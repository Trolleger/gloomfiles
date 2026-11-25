# Gloom Files

YouTube Shorts / TikTok / Reels series, fully 3D (Remotion + three.js, mromidev cartoon-3d-short pipeline). Professor Gloom, Moth and Biscuit guide you through internet mysteries.

## Install
```
npm install
```
Needs Node 18+ and a GPU-capable Chrome (Remotion downloads one).

## Render
- Preview in the browser: `npx remotion studio`
- One still: `npx remotion still src/index.ts Ep02 out/still.png --frame=300 --scale=0.5 --gl=angle`
- 60-frame speed test (do this first): `npx remotion render src/index.ts Ep02 out/test.mp4 --frames=300-359 --gl=angle --concurrency=1`
- Full episode: `npx remotion render src/index.ts Ep02 out/ep2.mp4 --gl=angle --concurrency=1` (Ep01 is the pilot)
- `render.sh` is the cloud helper (adds a cloud Chromium path); on a PC use the commands above.

## Layout
- `src/videos/gloom/` the real build: `ep01.tsx`, `ep02.tsx`, cast, props library (`props/`), post chain.
- `PROPS.md` prop catalog, `previews/` stills.
- `docs/` scripts, shot plans, tracker, bible (INDEX.md is the entry point). `build/` per-episode voiceover.txt and build.json.
- Deprecated flat-SVG files (src/theme.ts, src/cast, src/props, src/bg) are kept for reference only.
- Voice timing uses a 3.7 words/s placeholder; replace `LINES[].t0/t1` with Piper timings.
