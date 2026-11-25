import * as THREE from "three";
import { lam, glow, box, plane, canvasTex } from "../mats";
import { grp, prop } from "./util";

/** 3D bar chart on a grid panel; h.bars[i].scale/position set by h.setBars(t) */
export const barChart = (vals: number[], hi = -1, unit = 0.095, gap = 0.8) => {
  const g = new THREE.Group(), n = vals.length, bw = 0.62, span = n * (bw + gap * 0.3);
  g.add(box(span + 2, 5.2, 0.2, lam("#1f2a4e"), 0, 2.7, -0.7));
  for (let i = 0; i <= 8; i++) g.add(box(0.025, 4.4, 0.04, glow("#3a4f9a", 1.0), -span / 2 - 0.6 + (i * (span + 1.2)) / 8, 2.6, -0.58));
  for (let j = 0; j <= 5; j++) g.add(box(span + 1.2, 0.025, 0.04, glow("#3a4f9a", 1.0), 0, 0.5 + j * 0.88, -0.58));
  g.add(box(span + 1.4, 0.12, 0.7, lam("#4a4f8a"), 0, 0.06, 0.2));
  const bars = vals.map((v, i) => { const b = box(bw, 1, 0.5, lam(i === hi ? "#ffd84a" : "#3fd3a4"), -span / 2 + bw / 2 + 0.15 + i * (bw + gap * 0.3), 0.12, 0.3); b.userData.v = v; g.add(b); return b; });
  const setBars = (u: (i: number) => number) => bars.forEach((b, i) => { const h = Math.max(0.001, b.userData.v * unit * u(i)); b.scale.y = h; b.position.y = 0.12 + h / 2; });
  return prop(g, { setBars, bars: bars as unknown as THREE.Object3D });
};
/** a polyline curve as a flat tube strip in the XY plane (x 0..w, y = f(x/w)*h) */
export const curve = (f: (u: number) => number, w = 4, h = 2, color = "#ffe44d", r = 0.04) => {
  const pts: THREE.Vector3[] = []; for (let i = 0; i <= 80; i++) { const u = i / 80; pts.push(new THREE.Vector3(u * w - w / 2, f(u) * h, 0)); }
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, r, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.5) }));
  return prop(grp(m));
};
/** spectrogram-like panel: bright rising line over a dark gradient */
export const spectrogram = (w = 4, h = 2.4) => {
  const t = canvasTex(512, 300, (g, W, H) => { const gr = g.createLinearGradient(0, H, 0, 0); gr.addColorStop(0, "#08113a"); gr.addColorStop(1, "#1b3a8a"); g.fillStyle = gr; g.fillRect(0, 0, W, H); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(120,180,255,${0.05 + 0.1 * Math.abs(Math.sin(i))})`; g.fillRect(((i * 37) % W), ((i * 91) % H), 3, 1); } });
  return prop(grp(box(w + 0.2, h + 0.2, 0.06, lam("#101428")), plane(w, h, new THREE.MeshBasicMaterial({ map: t }), 0, 0, 0.04)));
};
