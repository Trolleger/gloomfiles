# Episode 1 voice-over: one Piper synthesis per section (spoken forms for numbers/symbols), concat with 0.35 s gaps
# at 48 kHz, then faster-whisper word timings per section aligned onto the SCRIPT's exact words.
import json, re, subprocess, time, wave, difflib, sys
from pathlib import Path
import os
D = Path.home() / "claude-shorts/tts"
LS = os.environ.get("LENGTH_SCALE", "1.0"); SUF = os.environ.get("SUFFIX", "")
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
SPOKEN = [("/x/", "Slash X"), ("4chan's", "four-chan's"), ("2005", "two thousand five"), ("2007", "two thousand seven"), ("2003", "two thousand three"),
          ("2020", "twenty twenty"), ("112", "a hundred and twelve"), ("1930", "nineteen thirty"), ("1942", "nineteen forty-two"), ("one-metre", "one metre")]
NUM = {"2005": "two thousand five", "2007": "two thousand seven", "2003": "two thousand three", "2020": "twenty twenty", "112": "a hundred and twelve",
       "1930": "nineteen thirty", "1942": "nineteen forty-two", "43": "forty three", "8": "eight", "2": "two", "3": "three", "4": "four", "/x/": "slash x"}
GAP, SR = 0.35, 48000
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
def expand(w):  # script/whisper token -> list of normalised spoken tokens
    k = w.strip(".,:;\"!?").replace("’", "'")
    if k in NUM: return [norm(x) for x in NUM[k].split()]
    if k.lower().startswith("4chan"): return ["four", "chans"]
    return [norm(x) for x in re.split(r"[-\s]", k) if norm(x)]

from faster_whisper import WhisperModel
model = WhisperModel("tiny.en", device="cpu", compute_type="int8", download_root=str(D / "models"))
secs, words, repairs, cursor, parts = [], [], [], 0.0, []
t_syn = 0.0
for i, text in enumerate(SCRIPT, 1):
    sp = text
    for a, b in SPOKEN: sp = sp.replace(a, b)
    raw, wav48 = OUT / f"s{i}_22k.wav", OUT / f"s{i}.wav"
    t = time.time(); subprocess.run([str(D / "venv/bin/piper"), "-m", str(D / "voices/en_US-joe-medium.onnx"), "-f", str(raw), "--length-scale", LS], input=sp.encode(), check=True, capture_output=True); t_syn += time.time() - t
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(raw), "-ar", str(SR), "-ac", "1", str(wav48)], check=True)
    with wave.open(str(wav48)) as w: dur = w.getnframes() / SR
    segs, _ = model.transcribe(str(wav48), word_timestamps=True, language="en")
    wh = [(x.word.strip(), float(x.start), float(x.end)) for s in segs for x in s.words]
    # flatten both sides to spoken tokens and align by order (difflib), then map back to script words
    S = text.split(); s_tok, s_own = [], []
    for j, w in enumerate(S):
        for tk in expand(w) or [norm(w) or "x"]: s_tok.append(tk); s_own.append(j)
    w_tok, w_t = [], []
    for (w, a, b) in wh:
        ex = expand(w) or [norm(w)]
        for q, tk in enumerate(ex): w_tok.append(tk); w_t.append((a + (b - a) * q / len(ex), a + (b - a) * (q + 1) / len(ex)))
    tt = [None] * len(s_tok)
    for blk in difflib.SequenceMatcher(None, s_tok, w_tok, autojunk=False).get_matching_blocks():
        for q in range(blk.size): tt[blk.a + q] = w_t[blk.b + q]
    # fill gaps between anchors evenly
    k = 0
    while k < len(tt):
        if tt[k] is None:
            e = k
            while e < len(tt) and tt[e] is None: e += 1
            lo = tt[k - 1][1] if k else 0.05; hi = tt[e][0] if e < len(tt) else dur - 0.1
            n = e - k
            for q in range(n): tt[k + q] = (lo + (hi - lo) * q / n, lo + (hi - lo) * (q + 1) / n)
            repairs.append(f"s{i}: interpolated {' '.join(sorted(set(S[s_own[q]] for q in range(k, e))))}")
            k = e
        else: k += 1
    sw = []
    for j, w in enumerate(S):
        idx = [q for q, o in enumerate(s_own) if o == j]
        a, b = tt[idx[0]][0], tt[idx[-1]][1]
        sw.append([w, a, b])
    for j in range(len(sw)):  # monotonic + min length 0.08 s
        if j and sw[j][1] < sw[j - 1][2]: sw[j][1] = sw[j - 1][2]
        if sw[j][2] - sw[j][1] < 0.08:
            repairs.append(f"s{i}: lengthened '{sw[j][0]}' ({sw[j][2]-sw[j][1]:.2f}s)"); sw[j][2] = sw[j][1] + 0.08
    for w, a, b in sw: words.append({"word": w, "start": round(cursor + a, 3), "end": round(cursor + b, 3), "section": i - 1})
    secs.append({"id": f"s{i}", "start": round(cursor, 3), "end": round(cursor + dur, 3)})
    parts.append(wav48); cursor += dur + GAP
total = cursor - GAP
# concat with gaps
sil = OUT / "gap.wav"; subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono", "-t", str(GAP), str(sil)], check=True)
lst = OUT / "list.txt"; lst.write_text("".join(f"file '{p}'\n" + (f"file '{sil}'\n" if n < len(parts) - 1 else "") for n, p in enumerate(parts)))
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c:a", "pcm_s16le", str(D / f"ep01v3_voice{SUF}.wav")], check=True)
json.dump({"placeholder": False, "voice": "en_US-joe-medium", "length_scale": float(LS), "fps": 30, "total": round(total + 1.5, 3), "voice_len": round(total, 3), "sections": secs, "words": words},
          open(D / f"ep01v3_words{SUF}.json", "w"), indent=1)
print(f"synth {t_syn:.1f}s, total {total:.2f}s, {len(words)} words")
for s in secs: print(s)
print("\n".join(repairs) or "no repairs")
