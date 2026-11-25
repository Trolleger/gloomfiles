import * as THREE from "three";
import { glow, canvasTex, sphere } from "../mats";
import { NOINK } from "../ink";
import { rnd, grp, prop } from "./util";

export const glowSprite = (col: string, size: number) => {
  const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }), color: col, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
  m.scale.setScalar(size); m.layers.set(NOINK); return m;
};
/** star dome points (never inked) */
export const stars = (n = 520, seed = 0, R = 900, minEl = 0.04, size = 3.2) => {
  const pos: number[] = [];
  for (let i = 0; i < n; i++) { const az = rnd(i + seed) * Math.PI * 2, el = Math.asin(minEl + rnd(i * 3 + seed + 7) * (1 - minEl)); pos.push(R * Math.cos(el) * Math.cos(az), R * Math.sin(el), R * Math.cos(el) * Math.sin(az)); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const o = new THREE.Points(g, new THREE.PointsMaterial({ color: "#f0f4ff", size, sizeAttenuation: false, fog: false, depthWrite: false }));
  o.layers.set(NOINK); o.frustumCulled = false; return o;
};
export const moon = (r = 18, pos: [number, number, number] = [-260, 210, -500]) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12), glow("#eef2ff", 1.5)); m.position.set(...pos); m.layers.set(NOINK);
  const h = glowSprite("#9fb4ff", r * 9); h.position.copy(m.position);
  return prop(grp(m, h));
};
/** constellation: points [x,y] (m) on a plane facing +z, lines as index pairs */
export const constellation = (pts: [number, number][], lines: [number, number][], hi = -1, scale = 1) => {
  const g = new THREE.Group(), P: THREE.Vector3[] = [];
  pts.forEach(([x, y], i) => { const s = sphere(0.5 * scale, glow(i === hi ? "#ffe9a0" : "#dfe8ff", 3), x * scale, y * scale, 0); (s.material as THREE.MeshBasicMaterial).fog = false; s.layers.set(NOINK); g.add(s); const gl = glowSprite("#9fb4ff", 4.5 * scale); gl.position.copy(s.position); g.add(gl); P.push(s.position); });
  lines.forEach(([a, b]) => { const d = P[a].distanceTo(P[b]); const m = new THREE.Mesh(new THREE.BoxGeometry(0.08 * scale, 0.08 * scale, d), new THREE.MeshBasicMaterial({ color: new THREE.Color("#8fa6ff").multiplyScalar(1.5), fog: false })); m.position.copy(P[a]).lerp(P[b], 0.5); m.lookAt(P[b]); m.layers.set(NOINK); g.add(m); });
  return prop(g);
};
export const SAGITTARIUS: [[number, number][], [number, number][]] = [
  [[0, 0], [1.9, 1.4], [3.4, 0.2], [4.2, -1.6], [2.3, -3.0], [0.2, -2.6], [-1.4, -1.0], [-0.9, 1.3]].map(([x, y]) => [x * 4.6, y * 4.6]) as [number, number][],
  [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [1, 7], [7, 0]],
];
