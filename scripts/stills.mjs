// usage: node scripts/stills.mjs <Comp> <outDir> <frame,frame,...> [scale]   (bundles once, ANGLE GL, jpeg stills; no video render)
import fs from "node:fs"; import path from "node:path";
const tmp = process.env.REMOTION_TMP || path.join(process.env.HOME, "claude-shorts/remotion-tmp"); fs.mkdirSync(tmp, { recursive: true }); process.env.TMPDIR = process.env.TEMP = process.env.TMP = tmp;
const { bundle } = await import("@remotion/bundler"); const { renderStill, selectComposition } = await import("@remotion/renderer");
const [id, out, frames, scale = "0.5"] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const browserExecutable = "/usr/bin/google-chrome", chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions });
for (const f of frames.split(",").map(Number)) { const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: f, output: `${out}/f${String(f).padStart(4, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scale), browserExecutable, chromiumOptions, timeoutInMilliseconds: 180000 });
  console.log("still", f, ((Date.now() - t0) / 1000).toFixed(1) + "s"); }
