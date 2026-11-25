import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex } from "../mats";
import { rnd, grp, at, spin, prop } from "./util";

export const ground = (size = 900, color = "#243050") => { const g = plane(size, size, lam(color)); g.rotation.x = -Math.PI / 2; return prop(grp(g)); };
export const hills = (n = 9, color = "#1b2444", d0 = 160, seed = 0) => {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const a = i * 0.7 + 0.4 + seed, d = d0 + (i % 3) * 40; const h = sphere(1, lam(color)); h.position.set(Math.cos(a) * d, -6, Math.sin(a) * d - 80); h.scale.set(70 + (i % 4) * 25, 26 + (i % 3) * 10, 50); g.add(h); }
  return prop(g);
};
/** low-poly storybook tree: kind round | cone | dead */
export const tree = (kind: "round" | "cone" | "dead" = "round", h = 4, leaf = "#2f6a55", bark = "#5b4036") => {
  const g = new THREE.Group();
  g.add(cyl(0.12 * h / 4, 0.2 * h / 4, h * 0.45, lam(bark), 0, h * 0.225, 0, 8));
  if (kind === "round") { for (const [x, y, z, r] of [[0, 0.72, 0, 0.34], [0.22, 0.6, 0.1, 0.24], [-0.2, 0.62, -0.08, 0.26]]) g.add(sphere(r * h, lam(leaf), x * h, y * h, z * h)); }
  else if (kind === "cone") { for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry((0.34 - i * 0.07) * h, 0.4 * h, 8), lam(leaf)); c.position.y = (0.5 + i * 0.22) * h; c.castShadow = true; g.add(c); } }
  else { for (const [a, l] of [[0.6, 0.3], [-0.7, 0.26], [0.2, 0.22]]) { const b = cyl(0.03 * h, 0.05 * h, l * h, lam(bark), Math.sin(a) * l * h * 0.5, h * (0.42 + l * 0.4), 0, 6); b.rotation.z = -a; g.add(b); } }
  return prop(g);
};
export const rock = (r = 0.5, seed = 1, color = "#6a6f8c") => {
  const geo = new THREE.IcosahedronGeometry(r, 1); const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const k = 0.82 + 0.3 * rnd(Math.floor(p.getX(i) * 7 + p.getY(i) * 13 + p.getZ(i) * 3) + seed); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.78, p.getZ(i) * k); }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, lam(color)); m.castShadow = m.receiveShadow = true; m.position.y = r * 0.3; return prop(grp(m));
};
/** dry lake bed with cracks (sailing stones) */
export const playa = (size = 60) => {
  const t = canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = "#b9a58a"; g.fillRect(0, 0, w, h); g.strokeStyle = "#7c6a56"; g.lineWidth = 5; g.lineCap = "round";
    for (let i = 0; i < 70; i++) { let x = rnd(i) * w, y = rnd(i + 99) * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rnd(i * 9 + k) - 0.5) * 150; y += (rnd(i * 7 + k + 3) - 0.5) * 150; g.lineTo(x, y); } g.stroke(); }
  }, [6, 6]);
  const p = plane(size, size, lam("#ffffff", { map: t })); p.rotation.x = -Math.PI / 2; return prop(grp(p));
};
export const ocean = (size = 400, color = "#17386e") => { const p = plane(size, size, lam(color)); p.rotation.x = -Math.PI / 2; return prop(grp(p)); };
export const iceberg = (s = 3) => { const g = new THREE.Group(); const a = new THREE.Mesh(new THREE.OctahedronGeometry(s, 0), lam("#d6e8ff")); a.scale.set(1.3, 0.9, 1); a.position.y = s * 0.5; a.castShadow = true; const b = new THREE.Mesh(new THREE.ConeGeometry(s * 0.7, s * 1.3, 5), lam("#eaf4ff")); b.position.set(s * 0.7, s * 0.9, 0); g.add(a, b); return prop(g); };
export const buoy = (h = 1.6) => {
  const g = new THREE.Group(); g.add(cyl(0.45, 0.55, 0.5, lam("#e0553b"), 0, 0.25, 0, 16)); g.add(cyl(0.05, 0.05, h, lam("#8a8fb0"), 0, 0.5 + h / 2, 0, 8)); const lamp = sphere(0.14, glow("#7dffd0", 3), 0, h + 0.55, 0);
  g.add(lamp); g.add(box(0.5, 0.05, 0.05, lam("#8a8fb0"), 0, h * 0.7 + 0.5, 0)); return prop(g, { lamp });
};
