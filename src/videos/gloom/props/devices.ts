import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex } from "../mats";
import { grp, at, spin, prop } from "./util";

const dishGeo = (R: number, focal: number) => { const pts: THREE.Vector2[] = []; for (let i = 0; i <= 18; i++) { const r = (i / 18) * R; pts.push(new THREE.Vector2(r, (r * r) / (4 * focal))); } return new THREE.LatheGeometry(pts, 40); };
/** radio telescope dish on a tower. h.pivot tilts (rotation.x), h.tip is the red beacon */
export const dish = (R = 5.6, towerH = 9) => {
  const g = new THREE.Group();
  const steel = lam("#59639c");
  g.add(cyl(R * 0.2, R * 0.36, towerH, steel, 0, towerH / 2, 0, 10));
  for (let i = 1; i < 5; i++) g.add(cyl(R * (0.36 - i * 0.03), R * (0.36 - i * 0.03), 0.16, lam("#3b4378"), 0, (towerH * i) / 5, 0, 10));
  g.add(box(R * 1.1, 0.7, 0.9, steel, 0, towerH + 0.2, 0));
  const pivot = new THREE.Group(); pivot.position.set(0, towerH + 0.4, 0); g.add(pivot);
  const F = R * 0.5;
  const d = new THREE.Mesh(dishGeo(R, F), lam("#d3d9f2", { side: THREE.DoubleSide })); d.castShadow = true; pivot.add(d);
  const depth = (R * R) / (4 * F);
  // dark rim + concentric ribs so the bowl reads as a bowl
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.14, 8, 56), lam("#2c3260")); rim.rotation.x = Math.PI / 2; rim.position.y = depth; pivot.add(rim);
  for (const k of [0.33, 0.66]) { const r = new THREE.Mesh(new THREE.TorusGeometry(R * k, 0.05, 6, 40), lam("#8f99cc")); r.rotation.x = Math.PI / 2; r.position.y = (R * k * R * k) / (4 * F) + 0.03; pivot.add(r); }
  pivot.add(cyl(R * 0.14, R * 0.2, 0.9, lam("#2c3260"), 0, -0.3, 0, 10));
  // tripod feed struts to the receiver
  const fy = F * 1.05; 
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5, rx = Math.cos(a) * R * 0.92, rz = Math.sin(a) * R * 0.92; const len = Math.hypot(rx, rz, fy - depth); const s = cyl(0.07, 0.07, len, lam("#2c3260"), rx / 2, depth + (fy - depth) / 2, rz / 2, 6); s.lookAt(0, fy, 0); s.rotateX(Math.PI / 2); s.position.set(rx / 2, depth + (fy - depth) / 2, rz / 2); pivot.add(s); }
  pivot.add(cyl(0.28, 0.28, 0.7, lam("#2c3260"), 0, fy - 0.2, 0, 10));
  const tip = sphere(0.42, glow("#ff5a6e", 2.6), 0, fy + 0.3, 0); pivot.add(tip);
  return prop(g, { pivot, tip });
};
export const mast = (h = 40) => { const g = new THREE.Group(); for (const [x, z] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const l = cyl(0.12, 0.2, h, lam("#8a90b8"), x * 1.2, h / 2, z * 1.2, 6); g.add(l); } for (let i = 1; i < 8; i++) g.add(box(2.6, 0.1, 0.1, lam("#8a90b8"), 0, (i * h) / 8, 1.2)); const beacon = sphere(0.5, glow("#ff4057", 3), 0, h + 0.5, 0); g.add(beacon); return prop(g, { beacon }); };
/** shortwave radio with animatable red needle over a MHz dial (h.setFreq(mhz)) */
export const radio = (lo = 1400, hi = 1440) => {
  const g = new THREE.Group(); g.add(box(1.0, 0.56, 0.4, lam("#8a5a36"), 0, 0.28, 0));
  const dialTex = canvasTex(1024, 256, (c) => { c.fillStyle = "#1c1a2e"; c.fillRect(0, 0, 1024, 256); c.fillStyle = "#ffe9b0"; c.fillRect(24, 24, 976, 208); c.strokeStyle = "#3a2a1a"; c.fillStyle = "#3a2a1a"; c.lineWidth = 4; c.font = "44px 'Anton',sans-serif"; c.textAlign = "center"; const n = hi - lo; for (let i = 0; i <= n; i++) { const x = 70 + (i * 884) / n, big = i % 10 === 0; c.beginPath(); c.moveTo(x, 150); c.lineTo(x, big ? 92 : 122); c.stroke(); if (big) c.fillText(String(lo + i), x, 80); } c.fillStyle = "#b02a3a"; c.font = "28px 'Anton',sans-serif"; c.fillText("MHZ", 940, 210); });
  g.add(plane(0.86, 0.215, new THREE.MeshBasicMaterial({ map: dialTex, color: new THREE.Color(1.35, 1.25, 1.0) }), 0, 0.36, 0.205));
  const needle = box(0.012, 0.2, 0.01, glow("#ff2a46", 2.4), 0, 0.36, 0.215); g.add(needle);
  for (const x of [-0.3, 0.3]) { const k = cyl(0.05, 0.05, 0.05, lam("#2b2538"), x, 0.14, 0.21); k.rotation.x = Math.PI / 2; g.add(k); }
  for (let i = 0; i < 6; i++) g.add(box(0.5, 0.014, 0.01, lam("#2a2030"), 0, 0.1 - i * 0.0, 0.205 + 0.0).translateY(-i * 0.03 + 0.0));
  g.add(cyl(0.01, 0.01, 0.7, lam("#aab0d0"), 0.4, 0.9, -0.1, 6));
  const setFreq = (mhz: number) => { needle.position.x = -0.43 + ((70 + ((mhz - lo) * 884) / (hi - lo)) / 1024) * 0.86; };
  setFreq(lo);
  return prop(g, { needle, setFreq });
};
export const clockWall = (text = "22:16") => { const t = canvasTex(256, 96, (c) => { c.fillStyle = "#06120e"; c.fillRect(0, 0, 256, 96); c.fillStyle = "#6bffb4"; c.font = "70px 'Special Elite',monospace"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(text, 128, 52); }); return prop(grp(box(1.6, 0.66, 0.08, lam("#101428"), 0, 0, 0), plane(1.5, 0.56, new THREE.MeshBasicMaterial({ map: t }), 0, 0, 0.05))); };
export const gavel = () => { const g = new THREE.Group(); const h = cyl(0.03, 0.03, 0.4, lam("#6a4630"), 0, 0.2, 0, 8); h.rotation.z = Math.PI / 2; g.add(h); g.add(cyl(0.08, 0.08, 0.2, lam("#8a5a3a"), 0.22, 0.2, 0, 14).rotateZ(0)); g.add(box(0.5, 0.05, 0.5, lam("#5a3a28"), 0, 0.025, 0)); return prop(g); };
export const walkie = () => { const g = new THREE.Group(); g.add(box(0.16, 0.34, 0.07, lam("#2b2f4a"), 0, 0.17, 0)); g.add(cyl(0.012, 0.012, 0.3, lam("#9aa0b8"), 0.05, 0.5, 0, 6)); g.add(box(0.1, 0.08, 0.01, glow("#6bffb4", 1.6), 0, 0.28, 0.04)); return prop(g); };
export const mic = () => { const g = new THREE.Group(); g.add(cyl(0.02, 0.03, 0.6, lam("#3a3f66"), 0, 0.3, 0, 8)); g.add(sphere(0.07, lam("#9aa0b8"), 0, 0.65, 0)); g.add(cyl(0.12, 0.12, 0.03, lam("#2b2f4a"), 0, 0.015, 0, 14)); return prop(g); };
export const speaker = () => { const g = new THREE.Group(); g.add(box(0.6, 0.9, 0.4, lam("#3a3040"), 0, 0.45, 0)); g.add(cyl(0.2, 0.2, 0.04, lam("#201a28"), 0, 0.35, 0.21).rotateX(Math.PI / 2)); g.add(cyl(0.1, 0.1, 0.04, lam("#201a28"), 0, 0.7, 0.21).rotateX(Math.PI / 2)); return prop(g); };
