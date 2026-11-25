#!/bin/bash
# usage: scripts/board.sh OUTDIR [beats...]  renders storyboard stills (scale 0.5) of the EP01 beats; no video render.
OUT=$1; shift; mkdir -p "$OUT"; export TMPDIR=${TMPDIR:-$HOME/claude-shorts/remotion-tmp} TEMP=$TMPDIR TMP=$TMPDIR
cd "$(dirname "$0")/.."
BEATS=${@:-0 1 2 3 4 5 6 7 8 9 10 11 12}
for b in $BEATS; do npx remotion still src/index.ts BeatStill "$OUT/B$(printf %02d $((b+1))).png" --props="{\"beat\":$b}" --scale=0.5 --gl=angle --concurrency=1 --browser-executable=/usr/bin/google-chrome 2>&1 | grep -iE "error|fail" ; done
