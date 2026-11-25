import * as THREE from "three";
import { lam, glow, box, cyl, plane, canvasTex } from "../mats";
import { rnd, grp, at, prop } from "./util";

export const windowsTex = (cols: number, rows: number, lit = 0.4, seed = 0, base = "#2c3560") => canvasTex(256, 512, (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const on = rnd(r * 13 + c + seed) < lit; g.fillStyle = on ? "#ffd58a" : "#161c3a"; g.fillRect(14 + c * ((w - 28) / cols) + 6, 14 + r * ((h - 28) / rows) + 6, (w - 28) / cols - 12, (h - 28) / rows - 14); }
});
export const house = (w = 4, h = 3, d = 4, wall = "#8a7a9a", roof = "#5a3f56") => {
  const g = new THREE.Group(); g.add(box(w, h, d, lam(wall), 0, h / 2, 0));
  const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.78, h * 0.5, 4), lam(roof)); r.rotation.y = Math.PI / 4; r.position.y = h + h * 0.25; r.castShadow = true; g.add(r);
  g.add(box(w * 0.2, h * 0.4, 0.06, lam("#3a2a3a"), 0, h * 0.2, d / 2 + 0.01));
  g.add(plane(w * 0.22, h * 0.22, glow("#ffb36b", 2), -w * 0.28, h * 0.6, d / 2 + 0.02)); g.add(plane(w * 0.22, h * 0.22, glow("#ffb36b", 2), w * 0.28, h * 0.6, d / 2 + 0.02));
  return prop(g);
};
/** half-timbered medieval house (tall, leaning gable) */
export const timber = (w = 3.6, h = 5, d = 3.4, wall = "#cdb892", beam = "#4a3426", roof = "#7a3f3a") => {
  const g = new THREE.Group(); g.add(box(w, h, d, lam(wall), 0, h / 2, 0));
  for (let i = 0; i <= 3; i++) g.add(box(0.12, h, 0.12, lam(beam), -w / 2 + (i * w) / 3, h / 2, d / 2 + 0.02));
  for (let j = 1; j <= 3; j++) g.add(box(w, 0.12, 0.12, lam(beam), 0, (j * h) / 4, d / 2 + 0.02));
  const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.85, h * 0.45, 4), lam(roof)); r.rotation.y = Math.PI / 4; r.position.y = h + h * 0.2; r.castShadow = true; g.add(r);
  g.add(plane(w * 0.18, h * 0.12, glow("#ffb36b", 2), -w * 0.2, h * 0.64, d / 2 + 0.05)); g.add(plane(w * 0.18, h * 0.12, glow("#ffb36b", 2), w * 0.2, h * 0.64, d / 2 + 0.05));
  return prop(g);
};
export const hut = () => { const p = house(5, 3, 4.5, "#5b5486", "#403a6a"); return p; };
export const skyscraper = (w = 6, h = 30, d = 6, seed = 0) => {
  const t = windowsTex(5, 16, 0.45, seed); const m = lam("#ffffff", { map: t });
  return prop(grp(box(w, h, d, m, 0, h / 2, 0)));
};
/** city skyline: n towers in a row (x spread) */
export const skyline = (n = 9, spread = 60, seed = 0, hMax = 55) => {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const h = 14 + rnd(i + seed) * hMax, w = 5 + rnd(i * 3 + seed) * 6; g.add(at(skyscraper(w, h, w, i + seed), -spread / 2 + (i * spread) / (n - 1) + (rnd(i * 5) - 0.5) * 3, 0, -(rnd(i * 7 + seed) * 12))); }
  return prop(g);
};
export const lamppost = (h = 4.5) => { const g = new THREE.Group(); g.add(cyl(0.07, 0.1, h, lam("#3a3f66"), 0, h / 2, 0, 8)); const l = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), glow("#ffd58a", 2.6)); l.position.y = h + 0.2; g.add(l); return prop(g, { lamp: l }); };
export const fence = (len = 8, h = 1.2) => { const g = new THREE.Group(); for (let i = 0; i <= len * 2; i++) g.add(box(0.1, h, 0.1, lam("#6a5a4a"), -len / 2 + i / 2, h / 2, 0)); g.add(box(len, 0.08, 0.06, lam("#7a6a58"), 0, h * 0.8, 0)); g.add(box(len, 0.08, 0.06, lam("#7a6a58"), 0, h * 0.4, 0)); return prop(g); };
export const cobbles = (w = 12, d = 30) => { const t = canvasTex(512, 512, (g, ww, hh) => { g.fillStyle = "#4b4a66"; g.fillRect(0, 0, ww, hh); for (let r = 0; r < 14; r++) for (let c = 0; c < 14; c++) { g.fillStyle = ["#5a597a", "#52516f", "#605f82"][(r * 3 + c) % 3]; g.beginPath(); g.ellipse(c * 38 + (r % 2) * 19 + 19, r * 38 + 19, 17, 15, 0, 0, 7); g.fill(); } }, [w / 3, d / 3]); const p = plane(w, d, lam("#ffffff", { map: t })); p.rotation.x = -Math.PI / 2; return prop(grp(p)); };
