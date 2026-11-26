// usage: node scripts/board3.mjs <outDir> [u=0.3] [shots...]   one still per EP01 v3 shot (bundles once)
import fs from "node:fs"; import path from "node:path";
const tmp = path.join(process.env.HOME, "claude-shorts/remotion-tmp"); fs.mkdirSync(tmp, { recursive: true }); process.env.TMPDIR = process.env.TEMP = process.env.TMP = tmp;
const { bundle } = await import("@remotion/bundler"); const { renderStill, selectComposition } = await import("@remotion/renderer");
const [out, u = "0.3", ...sel] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const browserExecutable = "/usr/bin/google-chrome", chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
for (const i of (sel.length ? sel.map(Number) : [...Array(14).keys()])) {
  const composition = await selectComposition({ serveUrl, id: "Shot3Still", browserExecutable, chromiumOptions, inputProps: { shot: i, u: Number(u) } });
  await renderStill({ composition, serveUrl, frame: 0, output: `${out}/S${String(i + 1).padStart(2, "0")}.png`, scale: 0.5, browserExecutable, chromiumOptions, inputProps: { shot: i, u: Number(u) }, timeoutInMilliseconds: 180000 });
  console.log("S" + (i + 1));
}
