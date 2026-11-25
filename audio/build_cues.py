"""Build the ep01 sound-effect cue list from the real word timings, using the SAME word anchors as
src/videos/gloom/ep01.tsx, so sound and picture cannot drift. Each sound lands LEAD_FRAMES (2) frames before
its visual (skill rule: 0-3 frames before).
usage: python3 audio/build_cues.py [--words build/ep01/ep01_words_fast.json] [--out audio/ep01_cues.json]
If ep01.tsx changes a visual's anchor, change it here too (each cue names the line of ep01.tsx it mirrors)."""
import argparse, json

FPS, LEAD, LEAD_FRAMES = 30, 2.6, 2  # LEAD = opening notice before the voice (ep01.tsx LEAD)
POP = 10 / FPS                        # cards pop in over 10 frames (ep01.tsx pop(appear[i])): they "land" at appear + POP

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--words", default="build/ep01/ep01_words_fast.json")
    ap.add_argument("--out", default="audio/ep01_cues.json")
    a = ap.parse_args()
    T = json.load(open(a.words)); W, S = T["words"], T["sections"]

    def wt(line, prefix, n=0, off=0.0):  # ep01.tsx WT(): LEAD + start of the n-th word of a line starting with prefix
        hits = [w for w in W if w["section"] == line and w["word"].startswith(prefix)]
        if not hits: raise SystemExit(f"no word {prefix!r} in line {line}")
        return LEAD + hits[min(n, len(hits) - 1)]["start"] + off
    t0 = lambda line, off=0.0: LEAD + S[line]["start"] + off   # ep01.tsx A()/at0()

    vis = []  # (visual time on the video timeline, sound, label)
    vis += [(wt(0, "January", 0, -0.1), "tick", "JAN 2005 calendar"), (wt(0, "February", 0, -0.1), "tick", "FEB 2007 calendar")]
    appear = [t0(2, 1.2), t0(3, 0.6), t0(4, 0.6), t0(5, 0.6), wt(7, "At", 0, 0.2), wt(7, "At", 0, 0.1), wt(7, "Three", 0, 0.1), wt(7, "At", 1, 0.1)]
    for i, t in enumerate(appear):
        if i == 5: continue  # card 6 (the unmentioned post) lands with card 5; one sound for both
        vis.append((t + POP, "slap", f"post card {i + 1} lands"))
        if i < 4: vis.append((t + POP + 0.1, "pin", f"post card {i + 1} pinned"))
    vis += [(wt(4, "three", 0, i * 0.35), "tick", f"3 OF 8 peg {i + 1} lights") for i in range(3)]
    vis.append((wt(5, "112", 0, -0.1), "page", "112 PAGES plate"))
    vis += [(wt(6, "1930", 0, -0.2), "slap", "1930 book"), (wt(6, "attack", 0, -0.1), "slap", "attack note"), (wt(6, "1942", 0, -0.2), "slap", "1942 journal")]
    vis += [(wt(7, "At", 0, -0.1), "pin", "+2 H 15 (monitor 1)"), (wt(7, "Three", 0, -0.1), "pin", "+2 H 18 (monitor 2)"), (wt(7, "At", 1, -0.1), "pin", "+2 H 43 (monitor 3)")]
    vis.append((wt(7, "left"), "keys", "'left one'"))
    vis.append((wt(8, "None", 0, -0.1), "powerdown", "closing notice"))

    cues = [{"t": round(v - LEAD_FRAMES / FPS, 3), "type": k, "visual": lab, "visual_t": round(v, 3)} for v, k, lab in sorted(vis)]
    json.dump({"source": a.words, "fps": FPS, "lead": LEAD, "lead_frames": LEAD_FRAMES, "cues": cues}, open(a.out, "w"), indent=1)
    print(f"{len(cues)} cues -> {a.out}")

if __name__ == "__main__":
    main()
