import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex } from "../mats";
import { rnd, grp, at, spin, prop } from "./util";

const FD = "'Anton',sans-serif", FT = "'Special Elite','Courier New',monospace";
/** flat sheet lying on a surface (face up); pass any texture */
export const sheet = (tex: THREE.Texture | null, w = 0.46, l = 0.92) => { const m = tex ? new THREE.MeshBasicMaterial({ map: tex }) : lam("#efe6cf"); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, l), m); p.rotation.x = -Math.PI / 2; p.position.y = 0.004; return prop(grp(p), { mesh: p }); };
export const noteTex = (title: string, lines = 5, seed = 1, w = 512, h = 640) => canvasTex(w, h, (g) => {
  g.fillStyle = "#efe6cf"; g.fillRect(0, 0, w, h); g.fillStyle = "#c8bb98"; g.fillRect(0, 0, w, 10);
  g.fillStyle = "#2b2b46"; g.font = `64px ${FD}`; g.textAlign = "left"; g.fillText(title, 36, 100);
  g.fillStyle = "#59597a"; for (let i = 0; i < lines; i++) g.fillRect(36, 150 + i * 62, 200 + rnd(i * 9 + seed) * (w - 280), 18);
});
/** a pinned note card with a timestamp-style title and greeked lines (no real text) */
export const notice = (title = "+0:00", lines = 5, seed = 1, w = 0.7, h = 0.88) => { const g = new THREE.Group(); const p = plane(w, h, new THREE.MeshBasicMaterial({ map: noteTex(title, lines, seed) })); g.add(p); g.add(box(w + 0.03, h + 0.03, 0.01, lam("#1b1730"), 0, 0, -0.01)); g.add(pin("#d62b45").translateY(h / 2 - 0.07).translateZ(0.03)); return prop(g, { face: p }); };
export const pin = (c = "#d62b45") => { const g = new THREE.Group(); const s = sphere(0.035, lam(c), 0, 0, 0.02); g.add(s); g.add(cyl(0.006, 0.006, 0.05, lam("#c8ccf0"), 0, 0, 0, 6).rotateX(Math.PI / 2)); return prop(g); };
/** taut thread between two points (m) */
export const thread = (a: [number, number, number], b: [number, number, number], c = "#e0243e", r = 0.012) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = A.distanceTo(B); const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(1.1) })); m.position.copy(A).lerp(B, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); return prop(grp(m)); };
export const corkboard = (w = 6, h = 3.6) => {
  const t = canvasTex(1024, 640, (g, W, H) => { g.fillStyle = "#9a6a3c"; g.fillRect(0, 0, W, H); for (let i = 0; i < 1400; i++) { g.fillStyle = ["#7e532d", "#b17d48", "#6e4725"][i % 3]; g.beginPath(); g.arc(rnd(i) * W, rnd(i + 5000) * H, 2 + rnd(i + 9) * 4, 0, 7); g.fill(); } });
  const g = new THREE.Group(); g.add(box(w + 0.3, h + 0.3, 0.12, lam("#3a2a22"), 0, 0, -0.05)); g.add(plane(w, h, lam("#ffffff", { map: t }), 0, 0, 0.02)); return prop(g);
};
export const book = (c = "#6a3f58", w = 0.5, h = 0.7, t = 0.12, title = "") => {
  const g = new THREE.Group(); g.add(box(w, h, t, lam(c), 0, h / 2, 0)); g.add(box(w - 0.04, h - 0.04, t - 0.02, lam("#efe6cf"), 0.02, h / 2, 0.0)); g.add(box(0.05, h, t + 0.01, lam(mixc(c)), -w / 2 + 0.025, h / 2, 0));
  if (title) { const tt = canvasTex(256, 64, (cg) => { cg.fillStyle = "rgba(0,0,0,0)"; cg.clearRect(0, 0, 256, 64); cg.fillStyle = "#e8d49a"; cg.font = `44px ${FD}`; cg.textAlign = "center"; cg.fillText(title, 128, 48); }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.7, w * 0.18), new THREE.MeshBasicMaterial({ map: tt, transparent: true })); p.position.set(0.02, h * 0.6, t / 2 + 0.005); g.add(p); }
  return prop(g);
};
const mixc = (c: string) => { const col = new THREE.Color(c).multiplyScalar(0.7); return "#" + col.getHexString(); };
export const openBook = (pageTex: THREE.Texture | null = null, w = 0.5, h = 0.7) => { const g = new THREE.Group(); g.add(box(w * 2 + 0.06, 0.06, h + 0.06, lam("#4a2f3c"), 0, 0.03, 0)); for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), pageTex ? new THREE.MeshBasicMaterial({ map: pageTex }) : lam("#efe6cf")); p.rotation.x = -Math.PI / 2; p.rotation.z = 0; p.position.set((s * w) / 2, 0.07, 0); g.add(p); } return prop(g); };
export const folder = (c = "#c8a45a") => prop(grp(box(0.32, 0.02, 0.42, lam(c), 0, 0.01, 0), box(0.12, 0.02, 0.04, lam(c), -0.1, 0.01, -0.23)));
export const magazine = (title = "", c = "#4fa0d0") => { const t = canvasTex(256, 340, (g) => { g.fillStyle = c; g.fillRect(0, 0, 256, 340); g.fillStyle = "#ffe44d"; g.fillRect(0, 0, 256, 70); g.fillStyle = "#241726"; g.font = `52px ${FD}`; g.textAlign = "center"; g.fillText(title || "MAG", 128, 56); g.fillStyle = "#ffffff"; for (let i = 0; i < 4; i++) g.fillRect(24, 110 + i * 40, 120 + rnd(i) * 90, 16); }); const p = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.4), new THREE.MeshBasicMaterial({ map: t })); p.rotation.x = -Math.PI / 2; p.position.y = 0.004; return prop(grp(p)); };
export const calendarPage = (text = "1977", sub = "AUG 15") => { const t = canvasTex(256, 300, (g) => { g.fillStyle = "#f2efe4"; g.fillRect(0, 0, 256, 300); g.fillStyle = "#d62b45"; g.fillRect(0, 0, 256, 80); g.fillStyle = "#fff"; g.font = `54px ${FD}`; g.textAlign = "center"; g.fillText(sub, 128, 62); g.fillStyle = "#241726"; g.font = `110px ${FD}`; g.fillText(text, 128, 200); }); return prop(grp(plane(0.5, 0.58, new THREE.MeshBasicMaterial({ map: t })))); };
const LAND: [number, number][][] = [
  [[-168, 66], [-140, 70], [-95, 72], [-80, 63], [-62, 58], [-55, 50], [-67, 44], [-76, 35], [-81, 25], [-97, 26], [-105, 22], [-117, 32], [-125, 42], [-130, 55], [-150, 60]],
  [[-55, 60], [-20, 70], [-30, 82], [-60, 80]],
  [[-80, 10], [-60, 10], [-35, -6], [-40, -22], [-58, -38], [-66, -55], [-75, -50], [-72, -20], [-81, -5]],
  [[-10, 36], [-9, 43], [0, 50], [10, 55], [28, 70], [40, 66], [40, 46], [28, 41], [15, 38], [3, 38]],
  [[-17, 15], [-6, 35], [10, 37], [32, 31], [44, 12], [51, 11], [40, -12], [35, -26], [20, -35], [12, -18], [8, 4], [-8, 5]],
  [[40, 46], [40, 66], [70, 72], [110, 76], [150, 70], [178, 66], [160, 52], [140, 40], [122, 30], [108, 20], [103, 2], [92, 20], [78, 8], [72, 20], [58, 24], [50, 30], [36, 36], [28, 41]],
  [[114, -22], [130, -12], [142, -11], [153, -27], [146, -39], [132, -33], [115, -34]],
];
/** stylised world map (own simplified continents). h.project(lon,lat) -> local [x,y] on the map plane */
export const worldMap = (w = 6, ocean = "#142a5a", land = "#3f8f6a") => {
  const W = 2048, H = 1024;
  const t = canvasTex(W, H, (g) => { g.fillStyle = ocean; g.fillRect(0, 0, W, H); g.strokeStyle = "#1f3f7a"; g.lineWidth = 2; for (let i = 1; i < 12; i++) { g.beginPath(); g.moveTo((i * W) / 12, 0); g.lineTo((i * W) / 12, H); g.stroke(); } for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, (i * H) / 6); g.lineTo(W, (i * H) / 6); g.stroke(); }
    g.fillStyle = land; g.strokeStyle = "#241726"; g.lineWidth = 7; g.lineJoin = "round"; for (const poly of LAND) { g.beginPath(); poly.forEach(([lo, la], i) => { const x = ((lo + 180) / 360) * W, y = ((90 - la) / 180) * H; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); g.fill(); g.stroke(); } });
  const g = new THREE.Group(); g.add(plane(w, w / 2, new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(1.15, 1.15, 1.15) })));
  g.add(box(w + 0.2, w / 2 + 0.2, 0.06, lam("#2a2438"), 0, 0, -0.04));
  const project = (lo: number, la: number): [number, number] => [((lo + 180) / 360 - 0.5) * w, (0.5 - (90 - la) / 180) * (w / 2) * 1 * 1 + 0];
  return prop(g, { project });
};
export const seal = (c = "#b02a3a") => { const g = new THREE.Group(); const d = cyl(0.12, 0.13, 0.03, lam(c), 0, 0.015, 0, 20); g.add(d); g.add(cyl(0.07, 0.07, 0.034, lam(mixc(c)), 0, 0.017, 0, 20)); return prop(g); };
export const lockIcon = () => { const g = new THREE.Group(); g.add(box(0.5, 0.4, 0.15, lam("#d8b24a"), 0, 0.2, 0)); const t = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 20, Math.PI), lam("#9aa0b8")); t.position.y = 0.4; g.add(t); return prop(g); };
export const keyIcon = () => { const g = new THREE.Group(); const r = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 8, 20), lam("#d8b24a")); g.add(r); const s = cyl(0.03, 0.03, 0.5, lam("#d8b24a"), 0, -0.36, 0, 8); g.add(s); g.add(box(0.12, 0.05, 0.04, lam("#d8b24a"), 0.06, -0.5, 0)); return prop(g); };
export const maskIcon = () => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), lam("#e8e4f4")); m.rotation.x = Math.PI; m.position.y = 0.3; m.scale.set(1, 1.2, 0.5); g.add(m); for (const s of [-1, 1]) g.add(sphere(0.045, lam("#241726"), s * 0.1, 0.34, 0.14)); return prop(g); };
