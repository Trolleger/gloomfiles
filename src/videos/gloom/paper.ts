// Painted printout / paper textures (Canvas2D). Own designs: dot-matrix sheet with a circled row, notice cards.
import * as THREE from "three";
import { canvasTex } from "./mats";

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const SEQ = " 1 1 2 1 1 3 1 2 1 1 4 1 1 2 2 1 3 1 1 1 2 1 4 1 1 2 1";
/** old green-bar computer printout, 20 rows, special row (index 8) carries 6EQUJ5. circle 0..1 = how much of the red ring is drawn */
export const printoutTex = (circle: number, wow: number) => {
  const W = 1024, H = 2048;
  return canvasTex(W, H, (g, w, h) => {
    g.fillStyle = "#efe8d2"; g.fillRect(0, 0, w, h);
    for (let r = 0; r < 24; r++) { if (r % 2 === 0) { g.fillStyle = "#dfe6cc"; g.fillRect(0, 150 + r * 76, w, 76); } }
    g.fillStyle = "#b9b49a"; for (let i = 0; i < 12; i++) { g.beginPath(); g.arc(30, 100 + i * 170, 11, 0, 7); g.arc(w - 30, 100 + i * 170, 11, 0, 7); g.fill(); }
    g.font = "46px 'Special Elite','Courier New',monospace"; g.textBaseline = "middle"; g.fillStyle = "#3a3a52";
    for (let r = 0; r < 24; r++) {
      const y = 188 + r * 76;
      let line = "";
      for (let c = 0; c < 20; c++) line += (rnd(r * 31 + c) < 0.58 ? " " : String(1 + Math.floor(rnd(r * 7 + c * 3) * 3))) + " ";
      if (r === 11) line = " 1 1 2 1 1 1 3 6 E Q U J 5 1 1 ";
      g.fillText(line.slice(0, 22), 70, y);
    }
    // red ring around "6EQUJ5" on row 11
    const cx = 484, cy = 188 + 11 * 76, rx = 215, ry = 46;
    if (circle > 0) {
      g.strokeStyle = "#e0243e"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath();
      const a1 = -Math.PI * 0.75 + circle * Math.PI * 2.25;
      for (let a = -Math.PI * 0.75; a <= a1; a += 0.05) { const k = 1 + 0.05 * Math.sin(a * 3); const x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k; if (a === -Math.PI * 0.75) g.moveTo(x, y); else g.lineTo(x, y); }
      g.stroke();
    }
    if (wow > 0) {
      g.save(); g.translate(cx - 40, cy - 120); g.rotate(-0.12); g.font = "bold 120px 'Special Elite',cursive"; g.fillStyle = "#e0243e"; g.globalAlpha = Math.min(1, wow); g.fillText("Wow!", 0, 0); g.restore();
    }
  });
};
export const paperTex = (lines: number, seed = 1) => canvasTex(512, 640, (g, w, h) => {
  g.fillStyle = "#efe6cf"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#4a4a68";
  for (let i = 0; i < lines; i++) { const y = 70 + i * 54, len = 200 + rnd(i * 9 + seed) * 240; g.fillRect(48, y, len, 14); }
});
