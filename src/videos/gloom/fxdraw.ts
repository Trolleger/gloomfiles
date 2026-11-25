// Flat 2D effect cards drawn with Pen: speech bubbles, plates, question marks, years. Plum ink like the characters.
import { Pen, INK } from "./toon";

const FD = "'Anton','Impact',sans-serif";
const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
};
/** speech bubble on a cw x ch card (tail bottom-left) */
export const fxBubble = (p: Pen, cw: number, ch: number, text: string, fill = "#f4f1ff", fg = INK, size = 120) => {
  const g = p.g, pad = 14, bw = cw - 2 * pad, bh = ch * 0.78;
  g.lineJoin = "round"; g.lineWidth = 14; g.strokeStyle = INK; g.fillStyle = fill;
  rr(g, pad, pad, bw, bh, 60); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(cw * 0.2, pad + bh - 4); g.lineTo(cw * 0.1, ch - pad); g.lineTo(cw * 0.34, pad + bh - 4); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = fill; g.fillRect(cw * 0.2 + 3, pad + bh - 14, cw * 0.14 - 6, 20);
  g.fillStyle = fg; g.font = `${size}px ${FD}`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, cw / 2, pad + bh / 2 + 6);
};
/** glowing plate with big text (years, labels) */
export const fxPlate = (p: Pen, cw: number, ch: number, text: string, fill = "#ffe44d", fg = INK, size = 190) => {
  const g = p.g; g.lineJoin = "round"; g.lineWidth = 16; g.strokeStyle = INK; g.fillStyle = fill;
  rr(g, 12, 12, cw - 24, ch - 24, 36); g.fill(); g.stroke();
  g.fillStyle = fg; g.font = `${size}px ${FD}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, cw / 2, ch / 2 + 8);
};
/** fat "?" mark */
export const fxQ = (p: Pen, cw: number, ch: number, col = "#ffe44d") => {
  const g = p.g; g.font = `${ch * 0.95}px ${FD}`; g.textAlign = "center"; g.textBaseline = "middle";
  g.lineJoin = "round"; g.lineWidth = 22; g.strokeStyle = INK; g.strokeText("?", cw / 2, ch / 2 + 10); g.fillStyle = col; g.fillText("?", cw / 2, ch / 2 + 10);
};
/** soft light cone for a flashlight, drawn pointing right from the left-middle; use with soft:true + additive-looking colour */
export const fxBeam = (p: Pen, cw: number, ch: number) => {
  const g = p.g, gr = g.createLinearGradient(0, 0, cw, 0);
  gr.addColorStop(0, "rgba(255,240,170,0.85)"); gr.addColorStop(0.5, "rgba(255,236,160,0.35)"); gr.addColorStop(1, "rgba(255,236,160,0)");
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, ch * 0.46); g.lineTo(cw, 0); g.lineTo(cw, ch); g.lineTo(0, ch * 0.54); g.closePath(); g.fill();
};
export const fxGlowDot = (p: Pen, cw: number, ch: number, col = "255,255,255") => {
  const g = p.g, gr = g.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, cw / 2);
  gr.addColorStop(0, `rgba(${col},1)`); gr.addColorStop(0.25, `rgba(${col},0.55)`); gr.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, cw, ch);
};
