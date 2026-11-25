#!/bin/bash
# Finishing steps for episode 1 (run on the PC after the picture render). usage: bash scripts/finish_ep01.sh
# 1) mux the finished mix over the silent picture   2) run the frame and sound checks   3) save a thumbnail frame
set -e
cd "$(dirname "$0")/.."
PIC=${PIC:-out/ep1.mp4}; MIX=${MIX:-audio/out_ep01/mix.wav}; OUT=${OUT:-out/ep1_final.mp4}; THUMB_FRAME=${THUMB_FRAME:-2400}
[ -f "$PIC" ] || { echo "missing picture render $PIC"; exit 1; }
[ -f "$MIX" ] || { echo "missing audio mix $MIX (run audio/make_audio.py first)"; exit 1; }
# the render also holds Remotion's own audio track; take video only from it and audio only from the mix
ffmpeg -y -hide_banner -loglevel error -i "$PIC" -i "$MIX" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
echo "wrote $OUT"
python3 scripts/qa_video.py "$OUT" || echo "QA flagged items above"
# thumbnail: a full-size still of one frame (captions included); pick another with THUMB_FRAME=NNN
npx remotion still src/index.ts Ep01 out/thumbnail.png --frame="$THUMB_FRAME" --gl=angle ${CHROME:+--browser-executable=$CHROME}
echo "wrote out/thumbnail.png (frame $THUMB_FRAME)"
