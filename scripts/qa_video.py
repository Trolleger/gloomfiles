#!/usr/bin/env python3
"""Frame and sound checks for a finished short. usage: python3 scripts/qa_video.py video.mp4 [expected_seconds]
Flags: black frames, frozen stretches, white frames, duration mismatch, missing audio, loudness and true peak.
Needs ffmpeg and ffprobe. Exit code 1 if something is flagged."""
import json, re, subprocess, sys

def run(args):
    return subprocess.run(args, capture_output=True, text=True)

def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    path = sys.argv[1]; expect = float(sys.argv[2]) if len(sys.argv) > 2 else None
    problems = []
    p = json.loads(run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate", "-of", "json", path]).stdout)
    dur = float(p["format"]["duration"]); kinds = [s["codec_type"] for s in p["streams"]]
    vs = [s for s in p["streams"] if s["codec_type"] == "video"][0]
    print(f"duration {dur:.2f} s, {vs['width']}x{vs['height']}, fps {vs['r_frame_rate']}, streams {kinds}")
    if expect and abs(dur - expect) > 0.2: problems.append(f"duration {dur:.2f} s differs from expected {expect:.2f} s")
    if "audio" not in kinds: problems.append("no audio stream")
    # black frames
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-vf", "blackdetect=d=0.05:pix_th=0.12", "-an", "-f", "null", "-"])
    black = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", r.stderr)
    for a, b in black: problems.append(f"black frames {a}-{b} s")
    # frozen
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-vf", "freezedetect=n=-60dB:d=1.5", "-an", "-f", "null", "-"])
    starts = re.findall(r"freeze_start: ([\d.]+)", r.stderr); ends = re.findall(r"freeze_end: ([\d.]+)", r.stderr)
    for i, a in enumerate(starts):
        b = ends[i] if i < len(ends) else "end"
        problems.append(f"frozen picture {a}-{b} s (check it is intentional)")
    # white frames: average luma above 228 (limited-range white is 235) for a frame
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-an", "-f", "null", "-"])
    ts = None; whites = []
    for line in r.stdout.splitlines():
        m = re.search(r"pts_time:([\d.]+)", line)
        if m: ts = float(m.group(1))
        m = re.search(r"YAVG=([\d.]+)", line)
        if m and float(m.group(1)) > 228 and ts is not None: whites.append(ts)
    if whites: problems.append(f"{len(whites)} near-white frames, first at {whites[0]:.2f} s")
    # loudness
    if "audio" in kinds:
        r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"])
        i_ = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr); tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
        if i_: print(f"integrated loudness {i_[-1]} LUFS, true peak {tp[-1] if tp else '?'} dBFS")
        if i_ and not (-17 <= float(i_[-1]) <= -13): problems.append(f"loudness {i_[-1]} LUFS is outside -17..-13")
        if tp and float(tp[-1]) > -1.0: problems.append(f"true peak {tp[-1]} dBFS is above -1.0")
        r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "silencedetect=n=-50dB:d=1.5", "-vn", "-f", "null", "-"])
        for a in re.findall(r"silence_start: ([\d.]+)", r.stderr): problems.append(f"audio silence from {a} s (check it is intentional)")
    if problems:
        print("FLAGGED:"); [print(" -", x) for x in problems]; sys.exit(1)
    print("all checks passed")

if __name__ == "__main__":
    main()
