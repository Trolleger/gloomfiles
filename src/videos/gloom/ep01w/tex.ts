// Painted Canvas2D textures for the Ep01 worlds (skill: hand-painted look, dark seams, grain, warm/cool variation).
import * as THREE from "three";
import { canvasTex, lamTex } from "../mats";
import { rnd } from "../props/util";

const speck = (g: CanvasRenderingContext2D, w: number, h: number, n: number, seed: number, cols: string[], max = 3) => {
  for (let i = 0; i < n; i++) { g.fillStyle = cols[i % cols.length]; const s = 1 + rnd(i * 3 + seed) * max; g.fillRect(rnd(i * 5 + seed + 1) * w, rnd(i * 7 + seed + 2) * h, s, s * (0.5 + rnd(i + seed))); }
};
export const planksTex = (base: string, seam = "#1a1020", rep: [number, number] = [4, 4], seed = 1) => lamTex(canvasTex(512, 512, (g, w, h) => {
  const n = 8, ph = h / n;
  for (let r = 0; r < n; r++) {
    const l = 0.86 + rnd(r + seed) * 0.28; g.fillStyle = base; g.fillRect(0, r * ph, w, ph);
    g.fillStyle = `rgba(${l > 1 ? "255,235,200" : "20,10,30"},${Math.abs(l - 1) * 0.5})`; g.fillRect(0, r * ph, w, ph);
    g.strokeStyle = "rgba(20,10,30,.22)"; g.lineWidth = 1.4;
    for (let k = 0; k < 7; k++) { g.beginPath(); const y = r * ph + 4 + rnd(r * 9 + k + seed) * (ph - 8); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 4 * Math.sin(k + r), w * 0.6, y - 4, w, y + 2); g.stroke(); }
    g.fillStyle = seam; g.fillRect(0, r * ph, w, 4); const bx = rnd(r * 13 + seed) * w; g.fillRect(bx, r * ph, 4, ph);
  }
}, rep));
export const brickTex = (base: string, mortar = "#3a2a3a", rep: [number, number] = [3, 3], seed = 2) => lamTex(canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = mortar; g.fillRect(0, 0, w, h); const rows = 12, cols = 6, bh = h / rows, bw = w / cols;
  for (let r = 0; r < rows; r++) for (let c = -1; c < cols; c++) {
    const l = 0.8 + rnd(r * 17 + c + seed) * 0.4; const col = new THREE.Color(base).multiplyScalar(l);
    g.fillStyle = "#" + col.getHexString(); g.fillRect(c * bw + (r % 2) * bw / 2 + 3, r * bh + 3, bw - 6, bh - 6);
  }
  speck(g, w, h, 500, seed, ["rgba(0,0,0,.18)", "rgba(255,255,255,.08)"], 3);
}, rep));
export const stoneTex = (base: string, seam = "#232034", rep: [number, number] = [3, 3], seed = 3) => lamTex(canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = seam; g.fillRect(0, 0, w, h); const rows = 6;
  for (let r = 0; r < rows; r++) { let x = -rnd(r + seed) * 90; const y = r * (h / rows); while (x < w) { const bw = 90 + rnd(x + r * 31 + seed) * 90; const col = new THREE.Color(base).multiplyScalar(0.82 + rnd(x * 3 + r + seed) * 0.34); g.fillStyle = "#" + col.getHexString(); g.fillRect(x + 4, y + 4, bw - 8, h / rows - 8); x += bw; } }
  speck(g, w, h, 600, seed, ["rgba(0,0,0,.14)", "rgba(255,255,255,.09)"], 4);
}, rep));
export const groundTex = (a: string, b: string, rep: [number, number] = [30, 30], seed = 4) => lamTex(canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = a; g.fillRect(0, 0, w, h); speck(g, w, h, 900, seed, [b, a, "rgba(255,255,255,.07)", "rgba(0,0,0,.12)"], 5);
}, rep));
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
