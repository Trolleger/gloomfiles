// EP01 worlds: one 3D set per beat, every set literally shows what the line says. Built from code only (no GLB kit).
import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex, lamTex } from "../mats";
import * as P from "../props";
import { rnd } from "../props/util";
import { NOINK } from "../ink";
import { rep, ctex } from "./paint";
import { planksTex, brickTex, stoneTex, groundTex, wallpaperTex, rugTex, textTex } from "./tex";

type R = THREE.Group;
const add = (R: R, ...o: THREE.Object3D[]) => { o.forEach((x) => R.add(x)); return o[0]; };
const place = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };
const noink = (o: THREE.Object3D) => { o.traverse((c) => c.layers.set(NOINK)); return o; };
const floor = (R: R, w: number, d: number, m: THREE.Material, z = 0, y = 0) => { const f = plane(w, d, m); f.rotation.x = -Math.PI / 2; f.position.set(0, y, z); R.add(f); return f; };
const glowAt = (R: R, x: number, y: number, z: number, s: number, c: string) => { const g = P.glowSprite(c, s * 0.42); g.position.set(x, y, z); R.add(g); };
const screen = (c: string, k = 1.8) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) });
const sign = (tex: THREE.Texture, w: number, h: number, k = 1.5) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(k, k, k) }));
const win = (R: R, x: number, y: number, z: number, w: number, h: number, c: string, ry = 0) => { const g = new THREE.Group(); g.add(box(w + 0.3, h + 0.3, 0.12, lam("#2a1e2a"))); g.add(plane(w, h, screen(c, 1.2)) as any); (g.children[1] as THREE.Object3D).position.z = 0.07; g.add(box(0.08, h, 0.1, lam("#2a1e2a"), 0, 0, 0.1)); g.add(box(w, 0.08, 0.1, lam("#2a1e2a"), 0, 0, 0.1)); place(g, x, y, z, ry); R.add(g); return g; };
export const rain = (R: R, n: number, box3: [number, number, number], cx = 0, cz = 0) => {
  const pos: number[] = []; for (let i = 0; i < n; i++) { const x = cx + (rnd(i) - 0.5) * box3[0], y = rnd(i + 99) * box3[1], z = cz - rnd(i + 7) * box3[2]; pos.push(x, y, z, x - 0.12, y - 0.9, z + 0.05); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: "#a8c4ff", transparent: true, opacity: 0.55, fog: false })); noink(m); R.add(m);
};
const rugAt = (R: R, m: THREE.Material, w: number, d: number, x: number, y: number, z: number) => { const p = plane(w, d, m); p.rotation.x = -Math.PI / 2; p.position.set(x, y, z); R.add(p); };
const pillar = (R: R, x: number, z: number, h: number, m: THREE.Material) => R.add(box(0.5, h, 0.5, m, x, h / 2, z));
const shelf = (R: R, x: number, z0: number, z1: number, h = 4.2, ry = 0, seed = 1) => {
  const L = Math.abs(z1 - z0), cx = x, g = new THREE.Group(), wood = lam("#5a3a30");
  g.add(box(0.7, h, L, wood, 0, h / 2, 0));
  for (let r = 0; r < 5; r++) {
    g.add(box(0.9, 0.08, L, lam("#6e4a3a"), 0.1, 0.2 + r * (h - 0.4) / 4, 0));
    for (let i = 0; i < L / 0.6; i++) { const c = ["#b79a6a", "#a58858", "#c4a878", "#8a6a50"][Math.floor(rnd(i * 3 + r + seed) * 4)]; const bh = 0.5 + rnd(i + r * 7) * 0.25; g.add(box(0.7, bh, 0.5, lam(c), 0.35 * (ry ? -1 : 1), 0.28 + r * (h - 0.4) / 4 + bh / 2, -L / 2 + 0.4 + i * 0.6)); }
  }
  g.position.set(cx, 0, (z0 + z1) / 2); g.rotation.y = ry; R.add(g);
};
const lampHang = (R: R, x: number, y: number, z: number, c = "#ffc27a", s = 5) => { R.add(cyl(0.02, 0.02, 6 - y, lam("#2a2030"), x, y + (6 - y) / 2, z, 6)); R.add(cyl(0.12, 0.3, 0.25, lam("#3a3040"), x, y, z)); R.add(sphere(0.12, glow(c, 3), x, y - 0.1, z)); glowAt(R, x, y - 0.2, z, s, c); };
const clockFace = (txt: string, r = 1) => canvasTex(256, 256, (g) => { g.fillStyle = "#f2e8d0"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.strokeStyle = "#2a1e30"; g.lineWidth = 10; g.stroke(); g.fillStyle = "#2a1e30"; g.font = "40px Anton"; g.textAlign = "center"; g.textBaseline = "middle"; for (let i = 1; i <= 12; i++) g.fillText(String(i), 128 + 92 * Math.sin(i * Math.PI / 6), 128 - 92 * Math.cos(i * Math.PI / 6)); const [h, m] = txt.split(":").map(Number); const hand = (a: number, l: number, w: number) => { g.lineWidth = w; g.lineCap = "round"; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + l * Math.sin(a), 128 - l * Math.cos(a)); g.stroke(); }; hand(((h % 12) + m / 60) * Math.PI / 6, 56, 12); hand(m * Math.PI / 30, 86, 8); });
const clock = (R: R, txt: string, x: number, y: number, z: number, r = 1, ry = 0) => { const g = new THREE.Group(); g.add(cyl(r, r, 0.14, lam("#3a2a30"), 0, 0, 0, 28)); (g.children[0] as THREE.Object3D).rotation.x = Math.PI / 2; const f = sign(clockFace(txt), r * 1.8, r * 1.8, 1.1); f.position.z = 0.09; g.add(f); place(g, x, y, z, ry); R.add(g); return g; };
const bed = (R: R, x: number, z: number, c = "#3a4a8a", ry = 0) => { const g = new THREE.Group(); g.add(box(2.0, 0.45, 3.0, lam("#5a3a30"), 0, 0.3, 0)); g.add(box(1.9, 0.3, 2.9, lam(c), 0, 0.62, 0)); g.add(box(1.9, 0.25, 0.7, lam("#e8e0f0"), 0, 0.85, -1.1)); g.add(box(2.0, 1.0, 0.1, lam("#5a3a30"), 0, 0.8, -1.55)); place(g, x, 0, z, ry); R.add(g); };
const deskPc = (R: R, x: number, z: number, col = "#6aa8ff", ry = 0, wood = "#6a4630") => { const g = new THREE.Group(); g.add(P.desk(1.8, 0.8, wood)); const m = P.monitor(col); m.position.set(0, 0.945, -0.1); g.add(m); const l = P.lampDesk("#ffd9a0"); l.position.set(0.7, 0.945, -0.1); g.add(l); g.add(P.at(P.chair("#4a3a5a"), 0, 0, 0.9)); place(g, x, 0, z, ry); R.add(g); return g; };
const poster = (R: R, x: number, y: number, z: number, c: string, ry = 0, w = 0.9, h = 1.3) => { const m = sign(textTex(256, 360, c, "#fff", ["?"], "Anton", 200), w, h, 1.0); place(m, x, y, z, ry); R.add(m); };
const bubble = (R: R, x: number, y: number, z: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, s = 1.4) => { const t = canvasTex(256, 256, (g, w, h) => { g.fillStyle = "#f4f1ff"; g.strokeStyle = "#241726"; g.lineWidth = 9; g.beginPath(); g.arc(128, 118, 100, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(70, 226, 14, 0, 7); g.fill(); g.stroke(); draw(g, w, h); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: t, transparent: true, color: new THREE.Color(1.1, 1.1, 1.1) })); m.position.set(x, y, z); R.add(m); noink(m); return m; };


// ---- set dressing: wainscot + trim, framed pictures, plants, curtains, rugs, warm lamp pools, clutter (reference sets are dense)
const frame = (R: R, x: number, y: number, z: number, w: number, h: number, c: string, seed: number, ry = 0) => { const g = new THREE.Group(); g.add(box(w + 0.16, h + 0.16, 0.08, lam("#5a3a24"))); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: canvasTex(64, 80, (c2, W, H) => { c2.fillStyle = c; c2.fillRect(0, 0, W, H); c2.fillStyle = ["#ffe27a", "#7ad0ff", "#ff9ab0", "#9affc8"][seed % 4]; c2.beginPath(); c2.arc(20 + rnd(seed) * 24, 26, 12, 0, 7); c2.fill(); c2.fillStyle = "#2f7a50"; c2.beginPath(); c2.moveTo(0, H); c2.lineTo(26, 38 + rnd(seed + 3) * 16); c2.lineTo(W, H); c2.fill(); }) })); m.position.z = 0.05; g.add(m); place(g, x, y, z, ry); R.add(g); };
const plant = (R: R, x: number, z: number, s = 1) => { const g = new THREE.Group(); g.add(cyl(0.28, 0.2, 0.4, lam("#c85a3a"), 0, 0.2, 0, 12)); for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), lam(["#3aa05a", "#2f8a4a", "#58b868"][i % 3])); l.scale.set(0.6, 1.3, 0.3); l.position.set(Math.sin(i * 2.4) * 0.22, 0.75, Math.cos(i * 2.4) * 0.22); l.rotation.z = Math.sin(i * 2.4) * 0.5; l.rotation.x = Math.cos(i * 2.4) * 0.5; g.add(l); } g.scale.setScalar(s); place(g, x, 0, z); R.add(g); };
const curtains = (R: R, x: number, y: number, z: number, h: number, c: string) => { for (const s of [-1, 1]) R.add(box(0.7, h, 0.14, lam(c), x + s * 1.65, y, z)); R.add(box(4.0, 0.14, 0.2, lam("#3a2a20"), x, y + h / 2 + 0.1, z)); };
const wain = (R: R, w: number, z: number, c: string, trim = "#f4ead2", x = 0, h = 1.5) => { R.add(box(w, h, 0.12, lam(c), x, h / 2, z + 0.14)); R.add(box(w, 0.12, 0.2, lam(trim), x, h, z + 0.16)); R.add(box(w, 0.14, 0.2, lam(trim), x, 0.07, z + 0.16)); };
const plaster = (c: string, rx = 3, ry = 2) => lamTex(rep(ctex("pl" + c, 256, 256, (g, r) => { g.fillStyle = c; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},.06)`; g.beginPath(); g.ellipse(r() * 256, r() * 256, 20 + r() * 40, 10 + r() * 20, 0, 0, 7); g.fill(); } }), rx, ry));
const checkTex = (a: string, b: string) => lamTex(rep(ctex("chk" + a + b, 128, 128, (g) => { g.fillStyle = a; g.fillRect(0, 0, 128, 128); g.fillStyle = b; g.fillRect(0, 0, 64, 64); g.fillRect(64, 64, 64, 64); }), 8, 8));
const lampPool = (R: R, x: number, y: number, z: number, c = "#ffd58a", s = 9) => { glowAt(R, x, y, z, s, c); const sp = new THREE.SpotLight(c, 30, 14, 0.7, 0.7); sp.position.set(x, y, z); sp.target.position.set(x, 0, z - 0.5); R.add(sp, sp.target); };
const clutter = (R: R, x0: number, x1: number, z: number, seed: number) => { for (let i = 0; i < 6; i++) { const x = x0 + rnd(i + seed) * (x1 - x0); R.add(box(0.5 + rnd(i) * 0.4, 0.5 + rnd(i + 2) * 0.5, 0.5, lam(["#e8a838", "#3aa0a0", "#d85a6a", "#7a8ad8"][i % 4]), x, 0.3, z + rnd(i + 5))); } };

const hero = (R: R, cx: number, seed: number, z = -6.9) => {
  frame(R, cx - 0.2, 4.0, z + 0.1, 1.5, 1.9, "#f4ead2", seed); frame(R, cx + 1.9, 3.5, z + 0.1, 0.9, 1.2, "#f4ead2", seed + 5); frame(R, cx - 2.2, 3.3, z + 0.1, 1.0, 1.3, "#f4ead2", seed + 9);
  R.add(box(2.6, 0.12, 0.5, lam("#6a4630"), cx + 0.2, 2.1, z + 0.3));
  for (let i = 0; i < 5; i++) R.add(box(0.28, 0.4 + rnd(i + seed) * 0.35, 0.3, lam(["#e8a838", "#3aa0a0", "#d85a6a", "#7a8ad8", "#58b868"][i]), cx - 0.8 + i * 0.4, 2.35 + rnd(i + seed) * 0.15, z + 0.3));
  const st = new THREE.Group(); st.add(box(1.0, 0.1, 0.8, lam("#6a4630"), 0, 0.9, 0)); for (const sx of [-1, 1]) st.add(box(0.1, 0.9, 0.1, lam("#5a3a24"), sx * 0.4, 0.45, 0)); place(st, cx + 2.4, 0, z + 0.9); R.add(st); R.add(cyl(0.1, 0.12, 0.5, lam("#d8d8f0"), cx + 2.4, 1.15, z + 0.9, 10)); R.add(sphere(0.18, glow("#ffd58a", 3), cx + 2.4, 1.55, z + 0.9));
  plant(R, cx - 2.3, z + 0.8, 1.6); R.add(P.at(P.chair("#c85a3a"), cx + 1.0, 0, z + 2.6));
};

// ---------- the 13 worlds ----------
export const W: Record<string, (R: R) => void> = {
  // B1: "/x/ is 4chan's paranormal board" -> the archive vault with the glowing door
  vault(R) {
    floor(R, 14, 60, planksTex("#6a4a40", "#140c18", [4, 14]), -22);
    R.add(box(14, 7, 0.4, lam("#2b2342"), 0, 3.5, -50)); R.add(box(0.4, 7, 60, lam("#2b2342"), -7, 3.5, -22)); R.add(box(0.4, 7, 60, lam("#2b2342"), 7, 3.5, -22));
    R.add(box(14, 0.4, 60, lam("#221a38"), 0, 7, -22));
    for (let z = 0; z > -46; z -= 6) { R.add(box(14, 0.5, 0.5, lam("#4a3030"), 0, 6.6, z)); R.add(box(0.6, 7, 0.6, lam("#4a3030"), -4.5, 3.5, z)); R.add(box(0.6, 7, 0.6, lam("#4a3030"), 4.5, 3.5, z)); }
    for (const s of [-1, 1]) shelf(R, s * 5.6, -2, -46, 5, 0, s + 3);
    const door = new THREE.Group(); door.add(box(4.2, 5.4, 0.3, lam("#1a1430"), 0, 2.7, 0)); door.add(box(3.4, 4.7, 0.2, glow("#7dffd0", 1.5), 0, 2.45, 0.2)); place(door, 0, 0, -49.4); R.add(door); glowAt(R, 0, 3, -48, 14, "#58ffc0");
    const sg = sign(textTex(1024, 512, "#0e0c24", "#7dffd0", ["/x/", "PARANORMAL BOARD"], "Anton", 170, "#7dffd0"), 7, 3.4, 1.7); sg.position.set(0, 5.6, -49); R.add(sg);
    [-3, -12, -22, -33, -42].forEach((z, i) => { lampHang(R, i % 2 ? -2.2 : 2.2, 5.6, z, i % 2 ? "#ffb06a" : "#ffd08a", 6); });
    for (let i = 0; i < 8; i++) R.add(box(0.8, 0.6, 0.6, lam(["#b79a6a", "#a58858"][i % 2]), -1 + rnd(i) * 3, 0.3, -6 - i * 4.5));
    const fogp = P.glowSprite("#4a3a7a", 28); fogp.position.set(0, 1.4, -26); R.add(fogp);
  },
  // B2: January 2005, photography. A bright studio, tripod, prints on a line, sunny mountain outside.
  studio05(R) {
    floor(R, 18, 22, planksTex("#c89868", "#4a2e28", [4, 5]), -4);
    R.add(box(18, 8, 0.4, plaster("#e8a838", 5, 2), 0, 4, -12)); wain(R, 18, -12, "#2a8f9a"); R.add(box(0.4, 8, 22, lam("#dcc6a8"), -9, 4, -4));
    hero(R, 3.8, 3, -11.5); plant(R, -4.5, -10, 1.6); curtains(R, 0, 3.6, -11.5, 4.4, "#d8627a");
    win(R, 0, 3.6, -11.7, 6.5, 4, "#9fd0ff"); glowAt(R, 0, 3.2, -10, 14, "#fff0c0");
    const hills = new THREE.Mesh(new THREE.ConeGeometry(6, 3, 5), lam("#6a9a6a")); hills.position.set(1.5, 2.0, -13); R.add(hills);
    const tri = new THREE.Group(); for (const a of [0, 2.1, 4.2]) { const l = cyl(0.05, 0.04, 2.6, lam("#2a2030"), Math.sin(a) * 0.5, 1.2, Math.cos(a) * 0.5, 6); l.rotation.set(Math.cos(a) * 0.2, 0, -Math.sin(a) * 0.2); tri.add(l); } tri.add(box(0.7, 0.5, 0.5, lam("#2a2a3a"), 0, 2.7, 0)); tri.add(cyl(0.2, 0.2, 0.4, lam("#555a7a"), 0, 2.7, 0.4)); (tri.children[4] as THREE.Object3D).rotation.x = Math.PI / 2; tri.add(sphere(0.12, glow("#ffffff", 2), 0, 2.7, 0.62)); place(tri, 2.2, 0, -1.5); tri.scale.setScalar(1.3); R.add(tri);
    R.add(box(9, 0.04, 0.04, lam("#2a2030"), -3, 6.2, -9)); const cols = ["#7ad0ff", "#ffb06a", "#ff7aa0", "#9affc0", "#ffe27a"];
    for (let i = 0; i < 7; i++) { const ph = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.5), new THREE.MeshBasicMaterial({ map: canvasTex(64, 80, (g, w, h) => { g.fillStyle = "#f5eee0"; g.fillRect(0, 0, w, h); g.fillStyle = cols[i % 5]; g.fillRect(6, 6, w - 12, h - 22); g.fillStyle = "#4a8a5a"; g.beginPath(); g.moveTo(6, h - 16); g.lineTo(32, 30); g.lineTo(w - 6, h - 16); g.fill(); }) })); ph.position.set(-7 + i * 1.3, 5.3, -8.9 + rnd(i) * 0.2); ph.rotation.z = (rnd(i + 3) - 0.5) * 0.2; R.add(ph); }
    rugAt(R, rugTex("#6a3a5a", "#e8b86a"), 6, 5, 1, 0.02, -2);
    const cal = P.calendarPage("2005", "JAN"); cal.position.set(-6.5, 3, -11.7); cal.scale.setScalar(2.2); R.add(cal);
    R.add(P.at(P.tree("round", 4, "#5aa070"), 9.5, 0, -9));
  },
  // B3: February 2007, the board turns to the unexplained. Same studio, dusk, ghosts in the prints.
  studio07(R) {
    floor(R, 18, 22, planksTex("#7a5a6a", "#241428", [4, 5]), -4);
    R.add(box(18, 8, 0.4, plaster("#7a2f8a", 5, 2), 0, 4, -12)); wain(R, 18, -12, "#2a6a8a"); R.add(box(0.4, 8, 22, lam("#5a3a5a"), -9, 4, -4));
    hero(R, 3.8, 8, -11.5); plant(R, -4.5, -10, 1.6); curtains(R, 0, 3.6, -11.5, 4.4, "#7a3aa0");
    win(R, 0, 3.6, -11.7, 6.5, 4, "#ff9a6a"); glowAt(R, 0, 3.2, -10, 14, "#ff8a5a");
    const tri = new THREE.Group(); for (const a of [0, 2.1, 4.2]) { const l = cyl(0.05, 0.04, 2.6, lam("#2a2030"), Math.sin(a) * 0.5, 1.2, Math.cos(a) * 0.5, 6); l.rotation.set(Math.cos(a) * 0.2, 0, -Math.sin(a) * 0.2); tri.add(l); } tri.add(box(0.7, 0.5, 0.5, lam("#2a2a3a"), 0, 2.7, 0)); tri.add(sphere(0.14, glow("#ffffff", 3), 0, 2.7, 0.55)); place(tri, 2.2, 0, -1.5); tri.scale.setScalar(1.3); R.add(tri);
    R.add(box(9, 0.04, 0.04, lam("#2a2030"), -3, 6.2, -9));
    for (let i = 0; i < 7; i++) { const ph = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.5), new THREE.MeshBasicMaterial({ map: canvasTex(64, 80, (g, w, h) => { g.fillStyle = "#e8dccc"; g.fillRect(0, 0, w, h); g.fillStyle = "#3a3a6a"; g.fillRect(6, 6, w - 12, h - 22); g.fillStyle = "#e8f4ff"; g.globalAlpha = .9; g.beginPath(); g.ellipse(32, 30 + (i % 3) * 3, 11, 15, 0, 0, 7); g.fill(); g.fillStyle = "#1a1030"; g.fillRect(26, 26, 4, 7); g.fillRect(36, 26, 4, 7); g.beginPath(); g.ellipse(33, 40, 4, 5, 0, 0, 7); g.fill(); }), color: new THREE.Color(1.15, 1.15, 1.25) })); ph.position.set(-7 + i * 1.3, 5.3, -8.9); ph.rotation.z = (rnd(i + 3) - 0.5) * 0.25; R.add(ph); glowAt(R, -7 + i * 1.3, 5.3, -8.7, 1.8, "#9a8aff"); }
    const cal = P.calendarPage("2007", "FEB"); cal.position.set(-6.5, 3, -11.7); cal.scale.setScalar(2.2); R.add(cal);
    rugAt(R, rugTex("#4a2a5a", "#c88a5a"), 6, 5, 1, 0.02, -2);
    R.add(P.at(P.tree("dead", 4, "#3a3040", "#2a2030"), 9.5, 0, -9));
    for (let i = 0; i < 5; i++) glowAt(R, -3 + i * 1.5, 1.2 + rnd(i) * 2, -4 - rnd(i + 5) * 2, 1.2, "#b8a8ff");
  },
  // B4: Eight posts, 2 h 43 min: a night street, a clock tower reading 2:43, eight lit windows
  clocktower(R) {
    floor(R, 80, 120, stoneTex("#4a4870", "#14102a", [10, 16]), -30);
    const tw = new THREE.Group(); tw.add(box(5, 20, 5, brickTex("#7a4a5a") as any, 0, 10, 0)); tw.add(box(6, 1, 6, lam("#3a2a3a"), 0, 20.5, 0)); const rf = new THREE.Mesh(new THREE.ConeGeometry(4.6, 5, 4), lam("#3a2a50")); rf.position.y = 23.5; rf.rotation.y = Math.PI / 4; tw.add(rf); place(tw, 0, 0, -26); R.add(tw);
    const cf = clock(R, "2:43", 0, 16, -23.4, 2.0); void cf; glowAt(R, 0, 16, -23, 10, "#ffe8a8");
    // eight windows in the neighbouring tower, lit one by one
    const b = new THREE.Group(); b.add(box(9, 26, 6, brickTex("#4a3a6a") as any, 0, 13, 0)); place(b, -11, 0, -22); R.add(b);
    for (let i = 0; i < 8; i++) { const x = -13 + (i % 2) * 4, y = 3 + Math.floor(i / 2) * 5.5; win(R, x, y + 3, -18.9, 2.4, 3.2, "#ffd27a"); glowAt(R, x, y + 3, -18.6, 5, "#ffb84a"); }
    for (let i = 0; i < 3; i++) { const t = new THREE.Group(); t.add(box(7, 14 + rnd(i) * 12, 6, lam(["#2b2850", "#34305c", "#26224a"][i]), 0, 10, 0)); place(t, 9 + i * 7, 0, -30 - i * 6); R.add(t); }
    for (const z of [2, -8, -16]) R.add(P.at(P.lamppost(4.8), 5, 0, z)), glowAt(R, 5, 4.8, z, 5, "#ffcf8a");
    R.add(P.stars(300, 7, 400, 0.08, 2.4)); R.add(P.at(P.moon(10, [-90, 70, -160]), 0, 0, 0));
  },
  // B5: the title borrows from Death Note: a dark study with a black notebook and a pen (generic, nothing copied)
  notebook(R) {
    floor(R, 14, 14, planksTex("#3a2a38", "#0e0814", [3, 3]), -2);
    R.add(box(16, 9, 0.4, plaster("#7a2f8a", 4, 2), 0, 4.5, -7.2)); wain(R, 16, -7.2, "#7a3a8a", "#f4ead2");
    for (const [fx, fy, fw, fh] of [[-5.2, 4.2, 1.1, 1.4], [-3.4, 4.6, 0.9, 1.1], [5.6, 4.4, 1.2, 1.5]] as number[][]) frame(R, fx, fy, -7.0, fw, fh, "#f4ead2", Math.round(fx * 7));
    plant(R, -6.2, -6.2, 1.4); plant(R, 6.3, -3.2, 1.1); curtains(R, 3.4, 3.8, -6.95, 3.6, "#7a3a8a"); clutter(R, -5, 5, -6.5, 3); lampPool(R, 0, 5.8, -4, "#ffd58a", 10);
    hero(R, 0, 1);
    const d = P.desk(4.4, 1.8, "#3a2418"); d.position.set(0, 0, -3.5); R.add(d);
    const nb = new THREE.Group(); const open = P.openBook(textTex(256, 340, "#14101c", "#e8e0ff", ["", "", ""]), 0.55, 0.78); nb.add(open); nb.add(sign(textTex(256, 340, "#0a0612", "#d8d0ff", ["NOTE", "BOOK"], "Anton", 54), 0.5, 0.7, 1.0) as any); (nb.children[1] as THREE.Object3D).rotation.x = -Math.PI / 2; (nb.children[1] as THREE.Object3D).position.set(-0.3, 0.07, 0); nb.position.set(0, 0.96, -3.5); nb.scale.setScalar(1.5); R.add(nb);
    const pen = P.pen("#c0b0ff"); pen.position.set(0.6, 0.98, -3.2); pen.rotation.y = 0.5; R.add(pen);
    const lamp = P.lampDesk("#ffd9a0"); lamp.position.set(-1.6, 0.96, -3.7); lamp.scale.setScalar(1.6); R.add(lamp); glowAt(R, -1.6, 2.0, -3.4, 5, "#ffc27a");
    win(R, 3.6, 4.0, -7.7, 3.2, 4.6, "#6a7ae0"); R.add(P.at(P.moon(5, [4, 7, -40]))); glowAt(R, 3.6, 4, -7.2, 9, "#7a8aff");
    const cal = P.calendarPage("2003", "MANGA"); cal.position.set(-4, 3.6, -7.7); cal.scale.setScalar(2.4); R.add(cal);
    for (let i = 0; i < 6; i++) { const s = P.at(P.book(["#5a3a68", "#3a5a68", "#684a3a"][i % 3], 0.5, 0.7, 0.14), -5.5 + i * 0.2, 0.2 + i * 0.16, -6.5); s.rotation.y = 0.1; R.add(s); }
    R.add(P.at(P.bookshelf(3.2, 4, 28), -5, 0, -7.4));
  },
  // B6: post 1: an abandoned house, one glowing monitor, an empty chair, a week crossed off, dust
  emptyhouse(R) {
    floor(R, 16, 16, planksTex("#4a3a40", "#0e0814", [3, 3], 5), -2);
    R.add(box(16, 9, 0.4, plaster("#2f9a8e", 4, 2), 0, 4.5, -7.2)); wain(R, 16, -7.2, "#2f7a86", "#f4ead2");
    for (const [fx, fy, fw, fh] of [[-5.2, 4.2, 1.1, 1.4], [-3.4, 4.6, 0.9, 1.1], [5.6, 4.4, 1.2, 1.5]] as number[][]) frame(R, fx, fy, -7.0, fw, fh, "#f4ead2", Math.round(fx * 7));
    plant(R, -6.2, -6.2, 1.4); plant(R, 6.3, -3.2, 1.1); curtains(R, 3.4, 3.8, -6.95, 3.6, "#2f7a86"); clutter(R, -5, 5, -6.5, 3); lampPool(R, 0, 5.8, -4, "#ffd58a", 10);
    hero(R, -1, 3);
    const d = P.desk(3.2, 1.3, "#4a3224"); d.position.set(-0.2, 0, -5.4); R.add(d);
    const m = P.monitor("#6aa8ff"); m.position.set(0, 0.95, -5.5); m.scale.setScalar(1.6); R.add(m); glowAt(R, 0, 1.6, -5.0, 9, "#6aa8ff");
    const ch = P.chair("#5a3a48"); ch.position.set(0.8, 0, -4.3); ch.rotation.y = 0.9; R.add(ch);
    for (let k = 0; k < 7; k++) R.add(place(sign(textTex(128, 128, "#efe6cf", "#b02a3e", ["X"], "Anton", 110), 0.55, 0.55, 1.0), -5.6 + (k % 7) * 0.62, 4.0, -6.78));
    const cal = P.calendarPage("7", "DAYS"); cal.position.set(-4.0, 3.3, -6.8); cal.scale.setScalar(2.6); R.add(cal);
    win(R, 5.4, 3.8, -6.76, 2.6, 3.4, "#34406a"); R.add(box(0.1, 3.4, 0.14, lam("#2a1e2a"), 5.4, 3.8, -6.7));
    for (let i = 0; i < 6; i++) { const w2 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.02 + rnd(i) * 0.02), new THREE.MeshBasicMaterial({ color: "#d8d8f0", transparent: true, opacity: 0.35 })); w2.position.set(-6 + rnd(i) * 3, 6.6 - i * 0.04, -6.6); w2.rotation.z = (rnd(i + 2) - 0.5) * 1.2; R.add(w2); }
    R.add(P.at(P.archiveBoxes(8, 2), -5.5, 0, -2.5)); R.add(P.at(P.crate(0.9, "#6a5240"), 5.6, 0, -2)); R.add(place(sign(textTex(256, 128, "#e8d49a", "#6a1a2a", ["ARCHIVED"], "Anton", 80, "#6a1a2a"), 1.1, 0.55, 1.0), 5.6, 1.0, -1.5)); 
    for (let i = 0; i < 40; i++) glowAt(R, (rnd(i) - 0.5) * 12, 0.6 + rnd(i + 4) * 5, -5 + rnd(i + 8) * 5, 0.12, "#9aa8ff");
  },
  // B7: post 2: an anon's bedroom (A), thought bubbles: real life, no results, boredom, the feds
  bedroomA(R) {
    floor(R, 14, 14, rugTex("#34406a", "#7a5a9a") as any, -2); floor(R, 18, 18, planksTex("#4a3a58", "#0e0814", [4, 4], 6), -2, -0.01);
    R.add(box(16, 9, 0.4, plaster("#d8b050", 4, 2), 0, 4.5, -7.2)); wain(R, 16, -7.2, "#2a8f9a", "#f4ead2");
    for (const [fx, fy, fw, fh] of [[-5.2, 4.2, 1.1, 1.4], [-3.4, 4.6, 0.9, 1.1], [5.6, 4.4, 1.2, 1.5]] as number[][]) frame(R, fx, fy, -7.0, fw, fh, "#f4ead2", Math.round(fx * 7));
    plant(R, -6.2, -6.2, 1.4); plant(R, 6.3, -3.2, 1.1); curtains(R, 3.4, 3.8, -6.95, 3.6, "#2a8f9a"); clutter(R, -5, 5, -6.5, 3); lampPool(R, 0, 5.8, -4, "#ffd58a", 10);
    hero(R, 1, 15);
    bed(R, -4.6, -4.8, "#4a5a9a"); deskPc(R, 1.6, -5.2, "#6aa8ff"); glowAt(R, 1.6, 1.7, -5.0, 8, "#6aa8ff");
    poster(R, -2.2, 3.6, -6.75, "#6a2a5a"); poster(R, 5.0, 4.0, -6.75, "#2a5a6a"); R.add(place(sign(textTex(256, 256, "#2a2040", "#ff8a5a", ["BORED"], "Anton", 60), 0.8, 0.8, 1.2), -2.2, 5.2, -6.75));
    win(R, 4.6, 3.4, -6.76, 2.6, 3.0, "#2a3070");
    // the feds outside the window: two men in black with hats
    for (const dx of [-0.4, 0.4]) { const mb = new THREE.Group(); mb.add(box(0.5, 1.2, 0.3, lam("#0a0814"), 0, 0.6, 0)); mb.add(sphere(0.22, lam("#d8c0a8"), 0, 1.45, 0)); mb.add(cyl(0.3, 0.3, 0.05, lam("#0a0814"), 0, 1.65, 0)); mb.add(cyl(0.2, 0.2, 0.2, lam("#0a0814"), 0, 1.75, 0)); place(mb, 4.6 + dx, 2.4, -7.2); R.add(mb); }
    bubble(R, -0.4, 4.3, -3.0, (g) => { g.fillStyle = "#e8a050"; g.fillRect(60, 110, 136, 80); g.fillStyle = "#b03a4a"; g.beginPath(); g.moveTo(50, 112); g.lineTo(128, 52); g.lineTo(206, 112); g.fill(); g.fillStyle = "#2a1a30"; g.fillRect(112, 140, 32, 50); });
    bubble(R, 2.0, 3.7, -3.2, (g) => { g.fillStyle = "#e8c04a"; g.beginPath(); g.moveTo(80, 60); g.lineTo(176, 60); g.lineTo(168, 130); g.lineTo(88, 130); g.fill(); g.fillRect(118, 130, 20, 36); g.fillRect(90, 166, 76, 14); g.strokeStyle = "#b02a3e"; g.lineWidth = 14; g.beginPath(); g.moveTo(60, 50); g.lineTo(196, 190); g.moveTo(196, 50); g.lineTo(60, 190); g.stroke(); });
    bubble(R, -1.8, 3.3, -3.4, (g) => { g.strokeStyle = "#2a1e30"; g.lineWidth = 10; g.beginPath(); g.arc(128, 118, 56, 0, 7); g.stroke(); g.beginPath(); g.moveTo(128, 118); g.lineTo(128, 84); g.moveTo(128, 118); g.lineTo(152, 128); g.stroke(); g.fillStyle = "#2a1e30"; g.font = "50px Anton"; g.fillText("z z", 160, 70); });
    bubble(R, 1.0, 2.9, -3.4, (g) => { g.fillStyle = "#14102a"; g.fillRect(70, 130, 116, 70); g.beginPath(); g.arc(128, 100, 34, 0, 7); g.fill(); g.fillStyle = "#e8e0ff"; g.fillRect(124, 134, 8, 50); });
  },
  // B8: post 3: three hits out of eight experiments; "like hitting a one-metre target at a thousand metres in a storm"
  range(R) {
    floor(R, 60, 1200, groundTex("#2a4a50", "#1e3a42", [40, 400], 8) as any, -540);
    rugAt(R, rugTex("#3a5a60", "#4a6a70"), 9, 1200, 0, 0.012, -540);
    for (let i = 0; i <= 10; i++) { const z = -i * 100; R.add(box(0.12, 1.4, 0.12, lam("#c8c8d8"), -4, 0.7, z)); R.add(place(sign(textTex(256, 128, "#e8e0c8", "#1a1830", [i * 100 + "m"], "Anton", 80), 1.6, 0.8, 1.0), -4, 1.6, z)); }
    const t = new THREE.Group(); t.add(box(0.1, 3.5, 0.1, lam("#3a2a24"), 0, 1.75, 0)); t.add(cyl(1.0, 1.0, 0.08, lam("#f2eadc"), 0, 3.4, 0.06)); (t.children[1] as THREE.Object3D).rotation.x = Math.PI / 2; for (const [r, c] of [[0.7, "#d62b45"], [0.4, "#f2eadc"], [0.18, "#d62b45"]] as [number, string][]) { const ring = cyl(r, r, 0.09, lam(c), 0, 3.4, 0.07); ring.rotation.x = Math.PI / 2; t.add(ring); } place(t, 0, 0, -1000); t.scale.setScalar(26); R.add(t);
    const rg = new THREE.Group(); rg.add(box(3, 0.1, 1.2, lam("#6a5a4a"), 0, 0.9, 0)); for (const x of [-1.3, 1.3]) rg.add(box(0.1, 0.9, 1, lam("#4a3a2a"), x, 0.45, 0)); place(rg, 1.4, 0, -2.4); R.add(rg);
    for (let i = 0; i < 6; i++) { const f = new THREE.Group(); f.add(cyl(0.04, 0.04, 3, lam("#c8c8d8"), 0, 1.5, 0, 6)); f.add(box(1.2, 0.5, 0.02, lam(["#e8453c", "#f2c84a"][i % 2]), 0.6, 2.7, 0)); place(f, 5 - (i % 2) * 10, 0, -30 - i * 90); f.rotation.y = -0.4; R.add(f); }
    for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(60, 12, 8), lam(["#2a2a5a", "#1e2050", "#34346a"][i % 3])); c.scale.set(2.2, 0.6, 1); c.position.set(-300 + i * 160, 160 + rnd(i) * 60, -700 - rnd(i + 4) * 300); noink(c); R.add(c); }
    rain(R, 1800, [30, 22, 140], 0, 6);
    const bolt = new THREE.Mesh(new THREE.PlaneGeometry(14, 160), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.6, 3.4), transparent: true, opacity: 0.9, fog: false })); bolt.position.set(-60, 90, -900); bolt.rotation.z = 0.12; noink(bolt); R.add(bolt);
    glowAt(R, -60, 40, -890, 220, "#a8b8ff");
  },
  // B9: post 4: the paperback on a plinth in an occult bookshop, 112 pages
  bookshop(R) {
    floor(R, 16, 16, planksTex("#6a4a30", "#1a0e14", [3, 3], 7), -2);
    R.add(box(16, 9, 0.4, plaster("#8a2a48", 4, 2), 0, 4.5, -7.2)); wain(R, 16, -7.2, "#6a2a5a", "#f4d89a");
    for (const [fx, fy, fw, fh] of [[-5.2, 4.2, 1.1, 1.4], [-3.4, 4.6, 0.9, 1.1], [5.6, 4.4, 1.2, 1.5]] as number[][]) frame(R, fx, fy, -7.0, fw, fh, "#f4ead2", Math.round(fx * 7));
    plant(R, -6.2, -6.2, 1.4); plant(R, 6.3, -3.2, 1.1); curtains(R, 3.4, 3.8, -6.95, 3.6, "#6a2a5a"); clutter(R, -5, 5, -6.5, 3); lampPool(R, 0, 5.8, -4, "#ffd58a", 10);
    hero(R, 1.4, 9);
    P.bookshelf; for (const x of [-5.4, -2.0, 5.4]) R.add(P.at(P.bookshelf(3.2, 5.2, 30), x, 0, -7));
    const pl = new THREE.Group(); pl.add(box(1.6, 1.0, 1.6, lam("#3a2a4a"), 0, 0.5, 0)); pl.add(box(1.8, 0.1, 1.8, lam("#5a4a6a"), 0, 1.05, 0)); place(pl, 1.4, 0, -4); R.add(pl);
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.18), [lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), new THREE.MeshBasicMaterial({ map: textTex(256, 360, "#5a2a5a", "#e8d49a", ["THE", "FORBIDDEN", "PARA-", "PSYCHOLOGY"], "Anton", 48, "#e8d49a"), color: new THREE.Color(1.3, 1.3, 1.3) }), lam("#2b2540")]); bk.position.set(1.4, 1.75, -4); bk.rotation.set(-0.15, -0.2, 0); R.add(bk);
    const stack = new THREE.Group(); for (let i = 0; i < 12; i++) stack.add(box(0.8, 0.02, 1.1, lam(i % 2 ? "#efe6cf" : "#e0d4b4"), 0, 0.012 + i * 0.022, 0)); place(stack, -1.6, 0.9, -3.4, 0.3); R.add(stack);
    lampHang(R, 1.4, 4.4, -4, "#ffb06a", 8); lampHang(R, -4, 4.6, -5, "#ffcf8a", 6);
    const sp = new THREE.SpotLight("#ffd8a0", 40, 12, 0.5, 0.6); sp.position.set(1.4, 5, -3); sp.target.position.set(1.4, 1.5, -4); R.add(sp, sp.target);
    rugAt(R, rugTex("#5a2a4a", "#e8b86a"), 8, 6, 0, 0.02, -3);
  },
  // B10: 1930, Psychic Self-Defence, her breakdown after a psychic attack: a 1930s occult study with candles and mist
  study30(R) {
    floor(R, 16, 16, rugTex("#5a2a3a", "#c8a86a") as any, -2); floor(R, 18, 18, planksTex("#3a2a24", "#0a0610", [4, 4], 9), -2, -0.01);
    R.add(box(16, 9, 0.4, plaster("#2a7a62", 4, 2), 0, 4.5, -7.2)); wain(R, 16, -7.2, "#4a2a58", "#e8c88a");
    for (const [fx, fy, fw, fh] of [[-5.2, 4.2, 1.1, 1.4], [-3.4, 4.6, 0.9, 1.1], [5.6, 4.4, 1.2, 1.5]] as number[][]) frame(R, fx, fy, -7.0, fw, fh, "#f4ead2", Math.round(fx * 7));
    plant(R, -6.2, -6.2, 1.4); plant(R, 6.3, -3.2, 1.1); curtains(R, 3.4, 3.8, -6.95, 3.6, "#4a2a58"); clutter(R, -5, 5, -6.5, 3); lampPool(R, 0, 5.8, -4, "#ffd58a", 10);
    hero(R, -0.6, 19);
    const d = P.desk(3.6, 1.5, "#3a2218"); d.position.set(-0.6, 0, -4.8); R.add(d);
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 1.0), [lam("#2a3a6a"), lam("#2a3a6a"), new THREE.MeshBasicMaterial({ map: textTex(256, 360, "#3a4a7a", "#e8d49a", ["PSYCHIC", "SELF-", "DEFENCE", "1930"], "Anton", 54, "#e8d49a"), color: new THREE.Color(1.25, 1.25, 1.25) }), lam("#2a3a6a"), lam("#2a3a6a"), lam("#2a3a6a")]); bk.position.set(-0.4, 1.0, -4.8); bk.rotation.y = 0.2; R.add(bk);
    for (const [x, z] of [[-1.7, -5.0], [0.9, -4.5], [-3.6, -6.4], [3.0, -6.2]]) { const c = cyl(0.06, 0.07, 0.45, lam("#efe6cf"), x, 1.2, z, 10); R.add(c); R.add(sphere(0.07, glow("#ffd27a", 3.5), x, 1.5, z)); glowAt(R, x, 1.55, z, 3.2, "#ffb04a"); }
    const cal = P.calendarPage("1930", "PUBLISHED"); cal.position.set(-5.4, 3.8, -7.2); cal.scale.setScalar(2.3); R.add(cal);
    win(R, 4.6, 3.8, -7.26, 2.8, 4.2, "#4a3a8a"); glowAt(R, 4.6, 3.8, -6.8, 10, "#8a6aff");
    // psychic attack: dark mist hands reaching in from the window
    for (let i = 0; i < 7; i++) { const m2 = P.glowSprite(i % 2 ? "#6a2a9a" : "#2a1a4a", 3.6 - i * 0.2); m2.position.set(4.2 - i * 0.7, 2.6 - i * 0.12, -5.6 + i * 0.1); R.add(m2); }
    R.add(P.at(P.bookshelf(3.2, 5, 26), -5.4, 0, -7)); R.add(P.at(P.chair("#6a3a48"), -0.4, 0, -3.2));
  },
  // B11: 1942 Cannon "Voodoo Death": a lab, a voodoo doll, a heart monitor, a dried glass and a stopwatch for fear, heart rate, dehydration
  lab42(R) {
    floor(R, 16, 16, checkTex("#f4f0e0", "#1f8a98"), -2);
    R.add(box(16, 9, 0.4, plaster("#3aa888", 4, 2), 0, 4.5, -7.2)); wain(R, 16, -7.2, "#2a7a8a", "#f4f0e0");
    for (const [fx, fy, fw, fh] of [[-5.2, 4.2, 1.1, 1.4], [-3.4, 4.6, 0.9, 1.1], [5.6, 4.4, 1.2, 1.5]] as number[][]) frame(R, fx, fy, -7.0, fw, fh, "#f4ead2", Math.round(fx * 7));
    plant(R, -6.2, -6.2, 1.4); plant(R, 6.3, -3.2, 1.1); curtains(R, 3.4, 3.8, -6.95, 3.6, "#2a7a8a"); clutter(R, -5, 5, -6.5, 3); lampPool(R, 0, 5.8, -4, "#ffd58a", 10);
    hero(R, 0.4, 6);
    const bn = new THREE.Group(); bn.add(box(6, 0.12, 1.8, lam("#2a2830"), 0, 1.0, 0)); bn.add(box(5.8, 1.0, 1.7, lam("#4a4a58"), 0, 0.5, 0)); place(bn, 0, 0, -4.8); R.add(bn);
    const doll = new THREE.Group(); doll.add(box(0.5, 0.6, 0.2, lam("#c8a070"), 0, 0.5, 0)); doll.add(sphere(0.2, lam("#c8a070"), 0, 1.0, 0)); for (const s of [-1, 1]) { doll.add(box(0.14, 0.5, 0.14, lam("#c8a070"), s * 0.34, 0.5, 0)); doll.add(box(0.16, 0.5, 0.14, lam("#c8a070"), s * 0.12, 0.0, 0)); } for (let i = 0; i < 4; i++) { const pin = cyl(0.015, 0.015, 0.5, lam("#d8d8e8"), -0.1 + i * 0.07, 0.55, 0.12, 6); pin.rotation.z = 0.5 - i * 0.3; doll.add(pin); doll.add(sphere(0.035, lam("#e8453c"), -0.1 + i * 0.07 - Math.sin(0.5 - i * 0.3) * 0.25, 0.55 + Math.cos(0.5 - i * 0.3) * 0.25, 0.12)); } place(doll, -1.6, 1.06, -4.8); doll.scale.setScalar(1.3); R.add(doll);
    const mon = new THREE.Group(); mon.add(box(1.8, 1.3, 0.6, lam("#2a2a38"), 0, 0.65, 0)); mon.add(plane(1.5, 1.0, new THREE.MeshBasicMaterial({ map: canvasTex(256, 160, (g, w, h) => { g.fillStyle = "#04140e"; g.fillRect(0, 0, w, h); g.strokeStyle = "#5affb4"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 90); for (let x = 0; x < w; x += 64) { g.lineTo(x + 20, 90); g.lineTo(x + 28, 30); g.lineTo(x + 36, 130); g.lineTo(x + 44, 90); g.lineTo(x + 64, 90); } g.stroke(); g.fillStyle = "#5affb4"; g.font = "30px Anton"; g.fillText("72 ♥", 10, 28); }), color: new THREE.Color(1.5, 1.5, 1.5) }), 0, 0.7, 0.32)); place(mon, 1.2, 1.06, -4.8); R.add(mon); glowAt(R, 1.2, 1.7, -4.4, 7, "#5affb4");
    for (let i = 0; i < 3; i++) { const fl = cyl(0.18, 0.28, 0.5, new THREE.MeshLambertMaterial({ color: ["#7affc8", "#ff7ab0", "#e8e07a"][i], transparent: true, opacity: 0.7 }), 3.0 + i * 0.5, 1.4, -4.9); R.add(fl); }
    R.add(place(sign(textTex(512, 256, "#e8e0c8", "#1a1830", ["1942", "VOODOO DEATH"], "Anton", 80, "#1a1830"), 3, 1.5, 1.0), -3.6, 4.2, -7.2));
    const glass = cyl(0.3, 0.2, 0.7, new THREE.MeshLambertMaterial({ color: "#b8e0ff", transparent: true, opacity: 0.45 }), 4.4, 1.4, -4.8); R.add(glass); R.add(cyl(0.2, 0.2, 0.08, lam("#d8b46a"), 4.4, 1.12, -4.8)); // a nearly empty glass: dehydration
    for (let i = 0; i < 5; i++) glowAt(R, -5 + i * 2.4, 6.3, -4, 4, "#d0ffe8"); R.add(box(16, 0.2, 2, lam("#cfe8e0"), 0, 7.6, -5));
  },
  // B12: posts 5, 7, 8: three dark bedrooms side by side (dollhouse cutaway), clocks at 2:15, 2:18, 2:43
  threerooms(R) {
    // an apartment block cut open: three floors, three dark bedrooms, each with a glowing monitor and a clock (2:15, 2:18, 2:43)
    const cols = ["#3a4a8a", "#5a3a7a", "#2a5a7a"], txt = ["2:15", "2:18", "2:43"], wp = [["#3a3a6a", "#46468a"], ["#4a2e6a", "#58368a"], ["#2e4a6a", "#365a8a"]], scr = ["#6aa8ff", "#a88aff", "#6affc8"];
    floor(R, 80, 50, stoneTex("#3a3858", "#14102a", [10, 6]), -10); R.add(box(14, 22, 0.3, brickTex("#4a3a58", "#241a34", [4, 6]) as any, 0, 11, -8.6)); 
    for (let i = 0; i < 3; i++) {
      const y = i * 6.4; R.add(box(14, 0.4, 8, planksTex("#3a2a48", "#0a0614", [6, 2], 12 + i) as any, 0, y - 0.2, -4.6));
      R.add(box(11.6, 6, 0.3, wallpaperTex(wp[i][0], wp[i][1], [4, 2]) as any, 0, y + 3.1, -8.4)); R.add(box(0.3, 6, 8, lam("#1a1430"), 6.2, y + 3.1, -4.6)); R.add(box(0.3, 6, 8, lam("#1a1430"), -6.2, y + 3.1, -4.6));
      const b2 = new THREE.Group(); bed(b2, -3.6, -6.0, cols[i]); b2.position.y = y; R.add(b2);
      const d2 = new THREE.Group(); deskPc(d2, 2.4, -6.6, scr[i]); d2.position.y = y; R.add(d2); glowAt(R, 2.4, y + 1.7, -6.3, 7, scr[i]);
      clock(R, txt[i], -0.4, y + 4.6, -8.2, 0.8);
      const sil = new THREE.Group(); sil.add(box(0.7, 0.9, 0.4, lam("#12102a"), 0, 0.45, 0)); sil.add(sphere(0.28, lam("#12102a"), 0, 1.15, 0)); place(sil, 2.4, y + 0.55, -5.4); R.add(sil);
    }
    R.add(P.stars(200, 3, 300, 0.1, 2));
  },
  // B13: the close: an empty blog comment page glowing in a foggy field, an empty chair, nothing answers
  empty(R) {
    floor(R, 120, 120, lam("#2a3a78"), -30);
    const d = P.desk(2.6, 1.2, "#3a2a40"); d.position.set(0, 0, -6); R.add(d);
    const mg = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.0), new THREE.MeshBasicMaterial({ map: textTex(512, 320, "#0c1228", "#7dffd0", ["COMMENTS", "", "(0)"], "Anton", 70, "#7dffd0"), color: new THREE.Color(1.6, 1.6, 1.6) })); mg.position.set(0, 2.2, -6.4); R.add(mg); glowAt(R, 0, 2.2, -6, 13, "#58ffc0");
    const ch = P.chair("#4a3a5a"); ch.position.set(0, 0, -4.6); ch.rotation.y = Math.PI; R.add(ch);
    for (let i = 0; i < 9; i++) R.add(P.at(P.tree(i % 3 ? "dead" : "cone", 4 + rnd(i) * 3, "#1c2a4a", "#2a2040"), -20 + i * 5, 0, -16 - rnd(i + 2) * 14));
    for (let i = 0; i < 12; i++) glowAt(R, (rnd(i) - 0.5) * 40, 1 + rnd(i + 2), -8 - rnd(i + 5) * 20, 14 + rnd(i) * 8, "#3a4a8a");
    R.add(P.stars(400, 11, 400, 0.08, 2.4)); R.add(P.at(P.moon(9, [60, 80, -200])));
  },
  // B07b: "three successes out of eight": eight jars on a long shelf, three glowing
  tally(R) {
    floor(R, 16, 16, planksTex("#6a4a30", "", [3, 3]), -2);
    R.add(box(16, 9, 0.4, plaster("#2a6a8a", 4, 2), 0, 4.5, -7.2)); wain(R, 16, -7.2, "#7a2f8a", "#f4ead2");
    const sh = new THREE.Group(); sh.add(box(9, 0.2, 1.0, lam("#6a4630"), 0, 0, 0)); for (const x of [-4, 0, 4]) sh.add(box(0.2, 1.6, 0.8, lam("#5a3a24"), x, -0.9, 0)); place(sh, 0, 2.6, -6.4); R.add(sh);
    for (let i = 0; i < 8; i++) { const on = i === 1 || i === 4 || i === 6, x = -3.5 + i, g = new THREE.Group(); g.add(cyl(0.34, 0.34, 0.9, new THREE.MeshLambertMaterial({ color: on ? "#7affc8" : "#8aa0c8", transparent: true, opacity: on ? 0.95 : 0.55 }), 0, 0.45, 0, 14)); if (on) { g.add(sphere(0.22, glow("#7affc8", 3.2), 0, 0.5, 0)); } g.add(cyl(0.25, 0.25, 0.1, lam("#3a2a24"), 0, 0.95, 0, 14)); place(g, x, 2.7, -6.4); R.add(g); if (on) glowAt(R, x, 3.2, -6.0, 3, "#58ffc0"); }
    for (let i = 0; i < 8; i++) R.add(place(sign(textTex(128, 128, "#f4ead2", on8(i) ? "#18a060" : "#b02a3e", [on8(i) ? "O" : "X"], "Anton", 100), 0.5, 0.5, 1.0), -3.5 + i, 1.9, -6.8));
    hero(R, 0, 4, -6.9); plant(R, -6.2, -6.2, 1.4); lampPool(R, 0, 5.8, -4, "#ffd58a", 10);
    R.add(P.at(P.chair("#c85a3a"), 2.4, 0, -3));
  },
};
const on8 = (i: number) => i === 1 || i === 4 || i === 6;
