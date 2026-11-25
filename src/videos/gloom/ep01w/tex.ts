// Painted Canvas2D textures for the Ep01 worlds (skill: hand-painted look, dark seams, grain, warm/cool variation).
import * as THREE from "three";
import { canvasTex, lamTex } from "../mats";
import { rnd } from "../props/util";

const speck = (g: CanvasRenderingContext2D, w: number, h: number, n: number, seed: number, cols: string[], max = 3) => {
  for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = 1 + rnd(i * 3 + seed) * max; g.fillRect(rnd(i * 5 + seed + 1) * w, rnd(i * 7 + seed + 2) * h, s, s * (0.5 + rnd(i + seed))); }
};
import { planksHD, brick, stoneHD, grassHD, rep, ctex, jit, rng } from "./paint";
const tint = (t: THREE.Texture, rx: number, ry: number) => lamTex(rep(t, rx, ry));
/** skill paint.ts textures (deck planks, brick courses, stone courses, grass), repeated per surface */
export const planksTex = (_base: string, _seam = "", r: [number, number] = [4, 4], _seed = 1) => tint(planksHD(), r[0] / 2, r[1] / 2);
export const brickTex = (_base: string, _mortar = "", r: [number, number] = [3, 3]) => tint(brick(), r[0], r[1]);
export const stoneTex = (base: string, _seam = "", r: [number, number] = [3, 3]) => tint(stoneHD("stoneHD" + base, [base, base, base, base]), r[0], r[1]);
export const groundTex = (_a: string, _b: string, r: [number, number] = [30, 30], _s = 0) => tint(grassHD(), r[0], r[1]);
void ctex; void jit; void rng;
export const wallpaperTex = (base: string, stripe: string, rep: [number, number] = [3, 2]) => lamTex(canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h); g.fillStyle = stripe; for (let i = 0; i < 8; i++) g.fillRect(i * 32 + 10, 0, 10, h);
  speck(g, w, h, 300, 9, ["rgba(0,0,0,.1)", "rgba(255,255,255,.06)"], 3);
}, rep));
export const rugTex = (a: string, b: string) => lamTex(canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = a; g.fillRect(0, 0, w, h); g.strokeStyle = b; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.lineWidth = 4; g.strokeRect(40, 40, w - 80, h - 80);
  g.fillStyle = b; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(w / 2, h / 2, 20 + i * 14, 0, 7); g.globalAlpha = .25; g.fill(); g.globalAlpha = 1; }
}));
export const textTex = (w: number, h: number, bg: string, fg: string, lines: string[], font = "Anton", size = 90, frame = "") => canvasTex(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); if (frame) { g.strokeStyle = frame; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); }
  g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `${size}px '${font}',sans-serif`;
  lines.forEach((t, i) => g.fillText(t, w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.1));
});
