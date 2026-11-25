#!/usr/bin/env python3
"""Gloom Files audio: original synthesized score + sound effects + mix. numpy only (plus ffmpeg for loudness).
Everything is generated from code, so there is nothing to license.

usage: python3 make_audio.py --config ep01.json --voice voice.wav --out out_dir [--seed 7]
       (--voice none makes a music + effects preview with no voice and no ducking)
Outputs in out_dir: music.wav, sfx.wav, mix_raw.wav, mix.wav (loudness normalised, 48 kHz stereo), cues.md, report.json
Timeline: the voice starts at config.lead seconds; section starts and sfx offsets are relative to the voice start,
so a different voice take only needs new section_starts (and voice_end) in the config."""
import argparse, json, os, subprocess, wave
import numpy as np

SR = 48000
TAU = 2 * np.pi


def read_wav(path):
    with wave.open(path, "rb") as w:
        n, ch, sw, sr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate()
        raw = w.readframes(n)
    if sw == 2:
        x = np.frombuffer(raw, "<i2").astype(np.float64) / 32768
    elif sw == 4:
        x = np.frombuffer(raw, "<i4").astype(np.float64) / 2147483648
    else:
        raise SystemExit(f"unsupported sample width {sw}")
    x = x.reshape(-1, ch).mean(axis=1)
    if sr != SR:
        t = np.arange(int(len(x) * SR / sr)) * sr / SR
        x = np.interp(t, np.arange(len(x)), x)
    return x


def read_wav_stereo(path):
    with wave.open(path, "rb") as w:
        n, ch, sw, sr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate()
        raw = w.readframes(n)
    if sw != 2:
        raise SystemExit("music decode must be 16-bit")
    x = np.frombuffer(raw, "<i2").astype(np.float64).reshape(-1, ch) / 32768
    if ch == 1:
        x = np.repeat(x, 2, axis=1)
    if sr != SR:
        t = np.arange(int(len(x) * SR / sr)) * sr / SR
        x = np.stack([np.interp(t, np.arange(len(x)), x[:, c]) for c in (0, 1)], 1)
    return x[:, :2]


def load_music_file(path, total, rng_unused=None):
    """Decode any audio file with ffmpeg, then trim or loop it to `total` seconds with fades."""
    tmp = os.path.join(os.path.dirname(os.path.abspath(path)), "_music_decoded.wav")
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", path, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", tmp], check=True)
    x = read_wav_stereo(tmp); os.remove(tmp)
    N = int(total * SR); xf = int(3 * SR)
    out = np.zeros((N, 2)); pos = 0; first = True
    while pos < N:
        seg = x if first else x[xf:]
        take = min(len(seg), N - pos)
        if first:
            out[pos:pos + take] = seg[:take]
        else:  # crossfade the loop point
            out[pos - xf:pos] = out[pos - xf:pos] * np.linspace(1, 0, xf)[:, None] + x[:xf] * np.linspace(0, 1, xf)[:, None]
            out[pos:pos + take] = seg[:take]
        pos += take; first = False
    fi, fo = int(1.5 * SR), int(4.0 * SR)
    out[:fi] *= np.linspace(0, 1, fi)[:, None]; out[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    return out


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    pcm = (x * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def fft_filter(x, lp=None, hp=None, order=2):
    n = len(x); m = 1 << int(np.ceil(np.log2(n)))
    X = np.fft.rfft(x, m); f = np.fft.rfftfreq(m, 1 / SR)
    H = np.ones_like(f)
    if lp: H *= 1 / (1 + (f / lp) ** (2 * order))
    if hp: H *= 1 - 1 / (1 + (f / hp) ** (2 * order))
    return np.fft.irfft(X * H, m)[:n]


def reverb(x, rng, rt=2.6, damp=2800, wet=0.4):
    """Stereo reverb from a synthetic noise impulse response. x mono -> returns (wet_L, wet_R) scaled by `wet`."""
    L = int(rt * SR); t = np.arange(L) / SR
    outs = []
    n = len(x) + L; m = 1 << int(np.ceil(np.log2(n)))
    X = np.fft.rfft(x, m)
    for _ in range(2):
        ir = rng.standard_normal(L) * np.exp(-t * 6.9 / rt)
        ir = fft_filter(ir, lp=damp, hp=120, order=1)
        ir[:int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
        y = np.fft.irfft(X * np.fft.rfft(ir, m), m)[:len(x)]
        outs.append(y * wet)
    return outs


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


CHORDS = {  # low dark voicings (MIDI)
    "Am": [33, 45, 52, 57, 60], "Fmaj7": [29, 41, 48, 52, 57], "Dm": [26, 38, 45, 53, 57], "Em": [28, 40, 47, 52, 55],
}
PENTA = [69, 72, 74, 76, 79, 81]  # A minor pentatonic


def pad(notes, dur, bright, rng):
    n = int(dur * SR); t = np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n)
    for k, m in enumerate(notes):
        f = hz(m)
        for side, det in ((0, 1.0015), (1, 0.9985)):
            y = np.zeros(n)
            for h in range(1, 7):
                y += np.sin(TAU * f * det * h * t + rng.uniform(0, TAU)) / h ** (1.7 - 0.6 * bright)
            y *= (1.0 if m < 40 else 0.7) / (1 + 0.15 * k)
            (L if side == 0 else R).__iadd__(y)
    # slow swell and low-pass
    sw = 0.8 + 0.2 * np.sin(TAU * t / 11.0 + rng.uniform(0, TAU))
    L, R = L * sw, R * sw
    cut = 500 + 1800 * bright
    return fft_filter(L, lp=cut), fft_filter(R, lp=cut)


def pluck(f, vel, rng):
    d = 3.2; t = np.arange(int(d * SR)) / SR
    y = np.zeros_like(t)
    for k, a in enumerate([1, .5, .3, .18, .1], start=1):
        y += a * np.sin(TAU * f * k * (1 + 0.0008 * k * k) * t + rng.uniform(0, 1)) * np.exp(-t * (2.0 + 0.9 * k))
    y *= np.minimum(1, t / 0.006) * vel
    return y


def thump(f0, f1, dur, decay):
    t = np.arange(int(dur * SR)) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 30)
    return np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * decay)


def noise_burst(rng, dur, lp=None, hp=None, decay=40):
    n = int(dur * SR); t = np.arange(n) / SR
    y = rng.standard_normal(n) * np.exp(-t * decay)
    return fft_filter(y, lp=lp, hp=hp, order=2)


def spad(*parts):
    """sum arrays of different lengths (shorter ones are zero-padded)"""
    n = max(len(p) for p in parts); out = np.zeros(n)
    for p in parts:
        out[:len(p)] += p
    return out


def sfx_sound(kind, rng):
    if kind == "pin":    # soft thud of a card pinned to cork
        return spad(0.9 * thump(190, 90, 0.18, 28), 0.5 * noise_burst(rng, 0.09, lp=1800, hp=300, decay=55))
    if kind == "slap":   # paper hitting the board
        return spad(0.8 * noise_burst(rng, 0.16, lp=6500, hp=1800, decay=32), 0.35 * thump(140, 80, 0.12, 40))
    if kind == "stamp":  # heavy ink stamp
        return spad(1.2 * thump(120, 52, 0.4, 14), 0.6 * noise_burst(rng, 0.1, lp=3000, hp=200, decay=45))
    if kind == "tick":   # tally tick
        t = np.arange(int(0.05 * SR)) / SR
        return spad(0.6 * np.sin(TAU * 1900 * t) * np.exp(-t * 90), 0.3 * noise_burst(rng, 0.05, hp=3000, decay=150))
    if kind == "page":   # page turn
        n = int(0.5 * SR); t = np.arange(n) / SR
        env = np.sin(np.pi * np.clip(t / 0.5, 0, 1)) ** 2
        return 0.7 * fft_filter(rng.standard_normal(n), lp=7000, hp=1500, order=2) * env
    if kind == "keys":   # keyboard clicks
        out = np.zeros(int(0.9 * SR)); pos = 0.0
        for _ in range(7):
            pos += rng.uniform(0.07, 0.15); i = int(pos * SR)
            c = noise_burst(rng, 0.03, lp=5000, hp=900, decay=120) * rng.uniform(0.5, 1.0)
            out[i:i + len(c)] += c[:max(0, len(out) - i)]
        return out
    if kind == "powerdown":  # monitor powering off
        n = int(1.4 * SR); t = np.arange(n) / SR
        f = 900 * np.exp(-t * 2.8) + 60
        return spad(0.35 * np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t * 2.2), 0.15 * noise_burst(rng, 1.4, lp=900, hp=80, decay=2.5))
    raise SystemExit(f"unknown sfx {kind}")


def envelope(x, sr=SR, win=0.02):
    n = max(1, int(win * sr)); k = np.ones(n) / n
    e = np.sqrt(np.convolve(x ** 2, k, "same"))
    return e


def smooth_env(e, attack=0.05, release=0.45):
    a = np.exp(-1 / (attack * SR)); r = np.exp(-1 / (release * SR))
    out = np.zeros_like(e); y = 0.0
    step = 48  # coarse loop for speed
    idx = np.arange(0, len(e), step)
    ec = e[idx]; yc = np.zeros_like(ec)
    ac = a ** step; rc = r ** step
    for i, v in enumerate(ec):
        y = v + ac * (y - v) if v < y else v + rc * (y - v) if False else (v if v > y else y * rc + v * (1 - rc))
        yc[i] = y
    return np.interp(np.arange(len(e)), idx, yc)


def dbfs(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True); ap.add_argument("--voice", required=True)
    ap.add_argument("--out", required=True); ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--no-loudnorm", action="store_true")
    ap.add_argument("--cues", default=None, help="cue file from build_cues.py (absolute video times); default <config>_cues.json if it exists")
    ap.add_argument("--music-gap", type=float, default=15.5, help="dB the ducked music sits under the voice RMS during speech")
    ap.add_argument("--music-file", default=None, help="use this track (mp3/wav) as the music bed instead of the synthesized score")
    a = ap.parse_args()
    cfg = json.load(open(a.config)); os.makedirs(a.out, exist_ok=True)
    rng = np.random.default_rng(a.seed)

    lead, tail = cfg["lead"], cfg["tail"]
    starts = cfg["section_starts"]; vend = cfg["voice_end"]
    ends = starts[1:] + [vend]
    total = lead + vend + tail; N = int(total * SR)
    voice = np.zeros(N); have_voice = a.voice.lower() != "none"
    if have_voice:
        v = read_wav(a.voice); v = v[: N - int(lead * SR)]
        voice[int(lead * SR): int(lead * SR) + len(v)] = v

    # ---------- music ----------
    M = cfg["music"]; mL = np.zeros(N); mR = np.zeros(N)
    for i, (s, e) in enumerate(zip(starts, ends)):
        t0 = lead + s - (1.5 if i else lead); t1 = lead + e + (1.5 if i < len(starts) - 1 else tail)
        t0 = max(0, t0); dur = min(t1, total) - t0
        pl, pr = pad(CHORDS[M["chords"][i]], dur, M["bright"][i], rng)
        n = len(pl); fade = int(min(1.5, dur / 3) * SR)
        env = np.ones(n); env[:fade] = np.linspace(0, 1, fade) ** 2; env[-fade:] = np.linspace(1, 0, fade) ** 2
        if i == len(starts) - 1:  # close: long tail fade
            env *= np.linspace(1, 0.0, n) ** 1.5 * 0.9 + 0.1 * env
        o = int(t0 * SR); mL[o:o + n] += pl * env; mR[o:o + n] += pr * env
    # plucks
    plL = np.zeros(N); plR = np.zeros(N); plmono = np.zeros(N)
    for i, (s, e) in enumerate(zip(starts, ends)):
        dens = M["pluck_density"][i]; t = lead + s + rng.uniform(0.6, 1.6)
        while t < lead + e - 1.0:
            f = hz(int(rng.choice(PENTA))); y = pluck(f, rng.uniform(0.35, 0.8) * (0.6 + 0.4 * dens), rng)
            o = int(t * SR); y = y[:max(0, N - o)]; pan = rng.uniform(-0.6, 0.6)
            plmono[o:o + len(y)] += y; plL[o:o + len(y)] += y * (1 - max(0, pan)); plR[o:o + len(y)] += y * (1 + min(0, pan))
            t += rng.uniform(1.3, 3.2) / max(0.2, dens + 0.2)
    wl, wr = reverb(plmono, rng, rt=3.2, damp=3200, wet=0.9)
    plL = plL * 0.5 + wl; plR = plR * 0.5 + wr
    # pulse
    pu = np.zeros(N)
    for i, (s, e) in enumerate(zip(starts, ends)):
        lvl = M["pulse"][i]
        if lvl <= 0: continue
        t = lead + s
        while t < lead + e:
            y = thump(64, 38, 0.45, 9) * lvl; o = int(t * SR); y = y[:max(0, N - o)]; pu[o:o + len(y)] += y; t += 1.2
    musL = mL * 0.55 + plL * 0.9 + pu * 0.8; musR = mR * 0.55 + plR * 0.9 + pu * 0.8
    if a.music_file:
        ext = load_music_file(a.music_file, total); musL, musR = ext[:N, 0], ext[:N, 1]

    # ---------- sfx ----------
    sL = np.zeros(N); sR = np.zeros(N); cues = []
    cue_path = a.cues or os.path.splitext(a.config)[0] + "_cues.json"
    if os.path.exists(cue_path):  # word-anchored cues (build_cues.py): absolute times on the video timeline
        events = [(c["t"], c["type"], c.get("visual", "")) for c in json.load(open(cue_path))["cues"]]
    else:                         # legacy: section-relative offsets in the config
        cue_path = None
        events = [(lead + starts[ev["s"]] + ev["o"], ev["t"], f"section {ev['s'] + 1}") for ev in cfg["sfx"]]
    for t, kind, label in events:
        ev = {"t": kind, "s": label}; y = sfx_sound(kind, rng) * rng.uniform(0.85, 1.0)
        o = int(t * SR)
        if o >= N: continue
        y = y[:N - o]; pan = rng.uniform(-0.25, 0.25)
        sL[o:o + len(y)] += y * (1 - max(0, pan)); sR[o:o + len(y)] += y * (1 + min(0, pan))
        cues.append((t, ev["t"], ev["s"]))
    dl, dr = reverb(0.5 * (sL + sR), rng, rt=1.2, damp=2500, wet=0.25)
    sL += dl; sR += dr

    # ---------- levels and ducking ----------
    if have_voice and np.max(np.abs(voice)) > 0:
        vol = voice / (np.max(np.abs(voice)) + 1e-9) * 0.7
        env = smooth_env(envelope(vol)); thr = 0.04
        speak = np.clip(env / thr, 0, 1)
        vrms = np.sqrt(np.mean(vol[np.abs(vol) > 0.01] ** 2))
        vref = 20 * np.log10(vrms + 1e-12)
    else:
        vol = voice; speak = np.zeros(N); vref = -22.0
    musS = np.stack([musL, musR], 1)
    if have_voice and np.max(np.abs(voice)) > 0:
        # set the music level from what is actually under the speech: ducked music RMS = voice RMS - music_gap dB
        # (both measured over the speaking samples only, so a loud intro/outro elsewhere in the track cannot skew it)
        sp = speak > 0.5
        v_sp = np.sqrt(np.mean(vol[sp] ** 2)); m_sp = np.sqrt(np.mean(musS[sp] ** 2)) * 0.60
        mus_gain = 10 ** ((20 * np.log10(v_sp + 1e-12) - a.music_gap - 20 * np.log10(m_sp + 1e-12)) / 20)
    else:
        mus_gain = 10 ** ((vref - 19 - dbfs(np.stack([musL, musR]))) / 20)
    music = np.stack([musL, musR], 1) * mus_gain
    duck_m = 1 - 0.40 * speak[:, None]           # about -4.4 dB while speaking
    # sfx level: loudest effect peaks about 6 dB under the voice peak
    pk = np.max(np.abs(np.stack([sL, sR], 1))) + 1e-9
    sfx = np.stack([sL, sR], 1) * (0.7 * 10 ** (-6 / 20) / pk)
    duck_s = 1 - 0.15 * speak[:, None]
    mix = np.stack([vol, vol], 1) + music * duck_m + sfx * duck_s
    write_wav(os.path.join(a.out, "music.wav"), music / (np.max(np.abs(music)) + 1e-9) * 0.9)
    write_wav(os.path.join(a.out, "sfx.wav"), sfx)
    # stems at true mix scale (for level checks): voice alone, and everything under it (ducked music + ducked sfx)
    write_wav(os.path.join(a.out, "voice_mix.wav"), np.stack([vol, vol], 1))
    write_wav(os.path.join(a.out, "bed_mix.wav"), music * duck_m + sfx * duck_s)
    raw = np.clip(mix, -1, 1)
    write_wav(os.path.join(a.out, "mix_raw.wav"), raw)

    # ---------- loudness (ffmpeg, two-pass loudnorm) ----------
    report = {"duration_s": round(total, 2), "voice": have_voice, "music_gap_db_target": a.music_gap if have_voice else None, "music_gain_db": round(float(20 * np.log10(mus_gain + 1e-12)), 2), "cue_file": cue_path, "music_file": a.music_file, "raw_peak": float(np.max(np.abs(raw)))}
    final = os.path.join(a.out, "mix.wav")
    if not a.no_loudnorm:
        try:
            tgt = "I=-15:TP=-1.5:LRA=9"
            p1 = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", os.path.join(a.out, "mix_raw.wav"), "-af", f"loudnorm={tgt}:print_format=json", "-f", "null", "-"],
                                capture_output=True, text=True)
            txt = p1.stderr[p1.stderr.rfind("{"): p1.stderr.rfind("}") + 1]; m = json.loads(txt)
            af = (f"loudnorm={tgt}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
                  f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
            subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", os.path.join(a.out, "mix_raw.wav"), "-af", af, "-ar", "48000", final], check=True)
            report["loudnorm_pass1"] = m
        except Exception as ex:  # keep going without ffmpeg
            report["loudnorm_error"] = str(ex); os.replace(os.path.join(a.out, "mix_raw.wav"), final)
    else:
        write_wav(final, raw)
    with open(os.path.join(a.out, "cues.md"), "w") as f:
        f.write("# Sound cues (seconds on the video timeline)\n\n")
        for t, k, s in sorted(cues):
            f.write(f"- {t:7.2f} s  {k:9s} {s}\n")
    json.dump(report, open(os.path.join(a.out, "report.json"), "w"), indent=1)
    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
