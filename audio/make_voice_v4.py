# Episode 1 voice-over: one Piper synthesis per section (spoken forms for numbers/symbols), concat with 0.35 s gaps
# at 48 kHz, then faster-whisper word timings per section aligned onto the SCRIPT's exact words.
import json, re, subprocess, time, wave, difflib, sys
from pathlib import Path
import os
D = Path.home() / "claude-shorts/tts"
LS = os.environ.get("LENGTH_SCALE", "0.88"); SUF = os.environ.get("SUFFIX", "_v4")
OUT = D / ("ep01v3" + SUF); OUT.mkdir(exist_ok=True)
SCRIPT = [
 "A man online says he can curse strangers to death, and it only works when he stops trying.",
 "He posted in a Death Note thread, and his blog logs colds, missed buses and, very rarely, death.",
 "He says he prints their photo, pisses on it, says their name, and wishes the worst, with no thinking, just anger.",
 "Then he ran it like a lab: forty targets, each matched with a control, coded in advance so nobody could say he edited it.",
 "One reply says three hits out of eight, like hitting a one-metre target from a thousand metres, in a storm.",
 "Then he went silent for a week.",
 "That's when an anon wrote, \"I didn't think there were others like me.\" His blog takes anonymous comments, so someone left one.",
 "Luckily, nobody can prove he hurt anyone. Unluckily, nobody can prove he didn't.",
 "You see, belief is powerful. Ever been so scared you froze? In 1942, Walter Cannon argued a curse can kill through fear alone.",
 "He said it only worked when he stopped trying. Now he's stopped everything, and nobody can say which kind of silence that is.",
]
if os.environ.get("SCRIPT_JSON"): SCRIPT = json.load(open(os.environ["SCRIPT_JSON"]))
SPOKEN = [("/x/", "Slash X"), ("4chan's", "four-chan's"), ("2005", "two thousand five"), ("2007", "two thousand seven"), ("2003", "two thousand three"),
          ("2020", "twenty twenty"), ("112", "a hundred and twelve"), ("1930", "nineteen thirty"), ("1942", "nineteen forty-two"), ("one-metre", "one metre")]
NUM = {"2005": "two thousand five", "2007": "two thousand seven", "2003": "two thousand three", "2020": "twenty twenty", "112": "a hundred and twelve",
       "1930": "nineteen thirty", "1942": "nineteen forty-two", "43": "forty three", "8": "eight", "2": "two", "3": "three", "4": "four", "/x/": "slash x"}
GAP, SR = 0.06, 48000
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
def expand(w):  # script/whisper token -> list of normalised spoken tokens
    k = w.strip(".,:;\"!?").replace("’", "'")
    if k in NUM: return [norm(x) for x in NUM[k].split()]
    if k.lower().startswith("4chan"): return ["four", "chans"]
    return [norm(x) for x in re.split(r"[-\s]", k) if norm(x)]


import numpy as np
from piper import PiperVoice, SynthesisConfig
voice = PiperVoice.load(str(D / "voices/en_US-joe-medium.onnx"), include_alignments=True)
cfg = SynthesisConfig(length_scale=float(LS), normalize_audio=True)
PR = 22050
secs, words, cursor, chunks_all, report = [], [], 0.0, [], []
for i, text in enumerate(SCRIPT, 1):
    S = text.split()
    sp = text
    for a, b in SPOKEN: sp = sp.replace(a, b)
    audio, wl, t = [], [], 0  # wl: list of (start_sample, end_sample) per espeak word
    for ch in voice.synthesize(sp, cfg, include_alignments=True):
        ws = None; pos = t
        for al in ch.phoneme_alignments:
            n = int(al.num_samples)
            if al.phoneme == " ":
                if ws is not None: wl.append((ws, pos)); ws = None
            elif al.phoneme in "^$":
                pass
            elif al.phoneme in ",.;:?!":
                if ws is not None: wl.append((ws, pos)); ws = None
            else:
                if ws is None: ws = pos
            pos += n
        if ws is not None: wl.append((ws, pos))
        audio.append(ch.audio_float_array); t += len(ch.audio_float_array)
    a = np.concatenate(audio); dur = len(a) / PR
    spoken = sp.split()
    # espeak words may differ from whitespace tokens (hyphens): map by merging to script words
    MERGE = {("out", "of"), ("there", "were"), ("for", "a"), ("that", "it")}  # espeak fuses these into one phoneme word
    per = []
    for j, w in enumerate(S):
        k = w.strip(".,:;\"!?").lower()
        prev = S[j - 1].strip(".,:;\"!?").lower() if j else ""
        s2 = k
        for x, y in SPOKEN: s2 = s2.replace(x, y)
        per.append(0 if (prev, k) in MERGE else max(1, len(s2.split())))
    if sum(per) != len(wl):
        report.append(f"s{i}: script words need {sum(per)} espeak words, got {len(wl)}")
    q = 0; sw = []
    for j, (w, n) in enumerate(zip(S, per)):
        if n == 0:  # second half of a fused pair: split previous word's span in two
            a0, a1 = sw[-1][1], sw[-1][2]; mid = round((a0 + a1) / 2, 3); sw[-1][2] = mid; sw.append([w, mid, a1, i - 1]); continue
        q = min(q, len(wl) - 1)
        sw.append([w, round(cursor + wl[q][0] / PR, 3), round(cursor + wl[min(q + n - 1, len(wl) - 1)][1] / PR, 3), i - 1]); q += n
    for w, x, y, sec in sw: words.append({"word": w, "start": x, "end": y, "section": sec})
    secs.append({"id": f"s{i}", "start": round(cursor, 3), "end": round(cursor + dur, 3)})
    chunks_all.append(a); chunks_all.append(np.zeros(int(GAP * PR), dtype=np.float32)); cursor += dur + GAP
total = cursor - GAP
full = np.concatenate(chunks_all[:-1])
raw = OUT / "full22k.wav"; 
with wave.open(str(raw), "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(PR); w.writeframes((full * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(raw), "-ar", str(SR), "-ac", "1", str(D / f"ep01v3_voice{SUF}.wav")], check=True)
json.dump({"placeholder": False, "voice": "en_US-joe-medium", "length_scale": float(LS), "fps": 30, "total": round(total + 1.5, 3), "voice_len": round(total, 3), "sections": secs, "words": words, "alignment": "piper-phoneme"},
          open(D / f"ep01v3_words{SUF}.json", "w"), indent=1)
print(f"total {total:.2f}s, {len(words)} words, {len(words)/total:.2f} w/s")
for s in secs: print(s)
print("\n".join(report) or "all words aligned from piper phonemes")
