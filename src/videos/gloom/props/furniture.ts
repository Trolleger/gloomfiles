import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex } from "../mats";
import { grp, at, spin, prop } from "./util";

export const floorRoom = (color = "#3b3256", wallColor = "#2b2a52", size = 40) => {
  const f = plane(size, size, lam(color)); f.rotation.x = -Math.PI / 2;
  return prop(grp(f, box(size, 9, 0.4, lam(wallColor), 0, 4.5, -3.6)));
};
export const desk = (w = 2.4, d = 1.1, wood = "#7a5236") => {
  const g = new THREE.Group(); g.add(box(w, 0.09, d, lam(wood), 0, 0.9, 0));
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(box(0.09, 0.9, 0.09, lam("#5a3a28"), (x * (w - 0.2)) / 2, 0.45, (z * (d - 0.2)) / 2));
  g.add(box(w - 0.3, 0.3, d - 0.2, lam("#6a4630"), 0, 0.7, 0));
  return prop(g, { top: 0.945 });
};
export const lampDesk = (shade = "#ffd9a0") => { const g = new THREE.Group(); g.add(cyl(0.12, 0.16, 0.05, lam("#3a3a5a"), 0, 0.03, 0)); g.add(cyl(0.025, 0.025, 0.5, lam("#3a3a5a"), 0, 0.28, 0)); const b = sphere(0.1, glow(shade, 2.4), 0, 0.6, 0.05); g.add(b); return prop(g, { bulb: b }); };
export const mug = (c = "#c24a5a") => prop(grp(cyl(0.07, 0.06, 0.1, lam(c), 0, 0.05, 0)));
export const pen = (c = "#d62b45") => { const p = cyl(0.012, 0.012, 0.24, lam(c), 0, 0.012, 0, 8); p.rotation.z = Math.PI / 2; return prop(grp(p)); };
export const bookshelf = (w = 3, h = 3.2, books = 22) => {
  const g = new THREE.Group(); g.add(box(w, h, 0.5, lam("#4a3426"), 0, h / 2, -0.05));
  const cols = ["#7a3f58", "#3f6f7a", "#7a6a3f", "#4a4a8a", "#a85a3a"];
  for (let r = 0; r < 4; r++) { g.add(box(w - 0.1, 0.06, 0.5, lam("#6a4a3a"), 0, 0.2 + r * (h - 0.4) / 3.2, 0.02)); for (let i = 0; i < books / 4; i++) g.add(box(0.14, 0.5 + ((i * 7 + r) % 4) * 0.06, 0.34, lam(cols[(i + r) % 5]), -w / 2 + 0.3 + i * (w - 0.5) / (books / 4), 0.5 + r * (h - 0.4) / 3.2, 0.04)); }
  return prop(g);
};
export const crt = (screen = "#9fd0ff") => {
  const g = new THREE.Group(); g.add(box(1.5, 1.2, 1.1, lam("#6a5648"), 0, 0.6, 0));
  const scr = plane(1.1, 0.86, new THREE.MeshBasicMaterial({ color: new THREE.Color(screen).multiplyScalar(1.6) }), -0.06, 0.62, 0.56); g.add(scr);
  g.add(box(0.2, 0.7, 0.04, lam("#3a2e28"), 0.62, 0.62, 0.56));
  for (const s of [-1, 1]) { const a = cyl(0.015, 0.015, 0.9, lam("#9aa0b8"), s * 0.25, 1.65, 0, 6); a.rotation.z = s * 0.7; g.add(a); }
  g.add(cyl(0.2, 0.3, 0.1, lam("#4a3e38"), 0, 1.25, 0, 12));
  return prop(g, { screen: scr });
};
export const monitor = (screen = "#6aa8ff") => { const g = new THREE.Group(); g.add(box(0.7, 0.5, 0.06, lam("#1b1c2e"), 0, 0.5, 0)); const s = plane(0.62, 0.42, new THREE.MeshBasicMaterial({ color: new THREE.Color(screen).multiplyScalar(1.7) }), 0, 0.5, 0.035); g.add(s); g.add(box(0.1, 0.22, 0.08, lam("#1b1c2e"), 0, 0.15, -0.04)); g.add(box(0.36, 0.03, 0.2, lam("#1b1c2e"), 0, 0.02, 0)); return prop(g, { screen: s }); };
export const arcade = (art = "#222744", marquee = "#ff4fa0") => {
  const g = new THREE.Group(); g.add(box(1.2, 2.1, 1.0, lam(art), 0, 1.05, 0));
  g.add(box(1.2, 0.35, 1.05, glow(marquee, 1.8), 0, 2.0, 0.02)); const scr = plane(0.8, 0.7, new THREE.MeshBasicMaterial({ color: new THREE.Color("#0a0a14") }), 0, 1.45, 0.51); g.add(scr);
  g.add(box(1.2, 0.12, 0.7, lam("#2f3560"), 0, 0.98, 0.3)); g.add(cyl(0.03, 0.03, 0.18, lam("#c8ccf0"), -0.2, 1.1, 0.4, 8)); for (let i = 0; i < 3; i++) g.add(cyl(0.05, 0.05, 0.03, glow(["#ff4057", "#ffe44d", "#4fd1a5"][i], 2), 0.1 + i * 0.14, 1.06, 0.4, 10));
  return prop(g, { screen: scr });
};
export const couch = (c = "#7a4a68") => { const g = new THREE.Group(); g.add(box(2.4, 0.5, 1.0, lam(c), 0, 0.3, 0)); g.add(box(2.4, 0.8, 0.28, lam(c), 0, 0.75, -0.36)); for (const s of [-1, 1]) g.add(box(0.28, 0.6, 1.0, lam(c), s * 1.1, 0.5, 0)); return prop(g); };
export const crate = (s = 0.7, c = "#8a6a44") => prop(grp(box(s, s, s, lam(c), 0, s / 2, 0)));
export const archiveBoxes = (n = 8, seed = 0) => { const g = new THREE.Group(); for (let i = 0; i < n; i++) g.add(at(box(0.7, 0.5, 0.5, lam(["#b79a6a", "#a58858", "#c4a878"][i % 3]), 0, 0, 0), (i % 4) * 0.75 - 1.1, 0.25 + Math.floor(i / 4) * 0.5, ((i * 7 + seed) % 3) * 0.05)); return prop(g); };
export const chair = (c = "#5a3a28") => { const g = new THREE.Group(); g.add(box(0.5, 0.06, 0.5, lam(c), 0, 0.5, 0)); g.add(box(0.5, 0.6, 0.06, lam(c), 0, 0.8, -0.22)); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(box(0.05, 0.5, 0.05, lam(c), x * 0.22, 0.25, z * 0.22)); return prop(g); };
