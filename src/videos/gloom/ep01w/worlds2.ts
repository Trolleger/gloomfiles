// EP01 worlds v2: each beat is a different PLACE (meadow, forest clearing, house exterior, market stall, attic, library, panelled study,
// lab) instead of recoloured rooms. No readable text in the sets except what the story names (the book cover).
import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex, lamTex } from "../mats";
import * as P from "../props";
import { rnd } from "../props/util";
import { NOINK } from "../ink";
import { R, place, floor, glowAt, win, rain, plant, plaster, wain, rugAt, bed, shelf, lampHang, checkTex } from "./worlds";
import { planksTex, brickTex, stoneTex, groundTex, rugTex, textTex } from "./tex";
import { rep, ctex } from "./paint";

const noink = (o: THREE.Object3D) => { o.traverse((c) => c.layers.set(NOINK)); return o; };
const hill = (R: R, x: number, z: number, r: number, h: number, c: string) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12), lam(c)); m.scale.set(1.6, h / r, 1.2); m.position.set(x, -h * 0.25, z); R.add(m); };
const mount = (R: R, x: number, z: number, h: number, c: string, snow = true) => { const m = new THREE.Mesh(new THREE.ConeGeometry(h * 0.7, h, 6), lam(c)); m.position.set(x, h / 2 - 2, z); R.add(m); if (snow) { const s = new THREE.Mesh(new THREE.ConeGeometry(h * 0.24, h * 0.34, 6), lam("#f4f4ff")); s.position.set(x, h - h * 0.17 - 2, z); R.add(s); } };
const cloudSprites = (R: R, n: number, c: string, y = 60, spread = 300) => { for (let i = 0; i < n; i++) { const s = P.glowSprite(c, 40 + rnd(i) * 40); s.position.set((rnd(i + 3) - 0.5) * spread, y + rnd(i + 8) * 25, -120 - rnd(i + 11) * 150); R.add(s); } };
const flowers = (R: R, n: number, seed: number, xr: number, z0: number, z1: number) => { for (let i = 0; i < n; i++) { const c = ["#ff6a8a", "#ffe04a", "#ffffff", "#9a6aff"][i % 4], f = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), lam(c)); f.position.set((rnd(i + seed) - 0.5) * xr, 0.35, z0 + rnd(i + seed + 7) * (z1 - z0)); R.add(f); R.add(box(0.02, 0.3, 0.02, lam("#2f8a4a"), f.position.x, 0.15, f.position.z)); } };
const ghost = (R: R, x: number, y: number, z: number, s = 1) => { const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.6, 2.0), transparent: true, opacity: 0.8 })); body.position.y = 0.75; body.rotation.x = Math.PI; g.add(body); g.add(sphere(0.42, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.6, 2.0), transparent: true, opacity: 0.85 }), 0, 1.5, 0)); for (const sx of [-1, 1]) g.add(sphere(0.07, new THREE.MeshBasicMaterial({ color: "#1a1030" }), sx * 0.15, 1.55, 0.38)); g.add(sphere(0.1, new THREE.MeshBasicMaterial({ color: "#1a1030" }), 0, 1.35, 0.4)); g.scale.setScalar(s); g.position.set(x, y, z); noink(g); R.add(g); glowAt(R, x, y + 1.5 * s, z, 6 * s, "#a8b8ff"); };
const tripodCamera = (R: R, x: number, z: number, s = 1.6) => { const tri = new THREE.Group(); for (const a of [0, 2.1, 4.2]) { const l = cyl(0.05, 0.04, 2.6, lam("#2a2030"), Math.sin(a) * 0.6, 1.2, Math.cos(a) * 0.6, 6); l.rotation.set(Math.cos(a) * 0.22, 0, -Math.sin(a) * 0.22); tri.add(l); } tri.add(box(0.9, 0.6, 0.6, lam("#3a3a50"), 0, 2.7, 0)); const lens = cyl(0.26, 0.26, 0.5, lam("#555a7a"), 0, 2.7, 0.5); lens.rotation.x = Math.PI / 2; tri.add(lens); tri.add(sphere(0.18, glow("#ffffff", 2.4), 0, 2.7, 0.78)); tri.scale.setScalar(s); place(tri, x, 0, z); R.add(tri); };

export const W2: Record<string, (R: R) => void> = {
  // B2/B3: an open meadow. Day = Jan 2005 (photography board). Dusk + ghosts = Feb 2007 (the unexplained).
  meadow(R) {
    floor(R, 600, 600, groundTex("#4a9a4a", "#3a8a3a", [60, 60]), -100);
    for (let i = 0; i < 8; i++) hill(R, -140 + i * 45, -90 - rnd(i) * 40, 40, 8 + rnd(i) * 10, i % 2 ? "#5aaa5a" : "#4a9a50");
    for (let i = 0; i < 5; i++) mount(R, -120 + i * 60, -230 - rnd(i) * 40, 70 + rnd(i) * 40, "#7a8ab8");
    cloudSprites(R, 9, "#ffffff", 70);
    for (let i = 0; i < 14; i++) R.add(P.at(P.tree("round", 4 + rnd(i) * 3, ["#3f9a55", "#2f8a4a", "#58b868"][i % 3], "#6a4a38"), (i - 7) * 5 + rnd(i) * 4, 0, -16 - rnd(i + 5) * 20));
    tripodCamera(R, 1.4, -5.2, 1.9);
    const tb = P.desk(2.4, 1.0, "#8a5a38"); tb.position.set(-2.4, 0, -6); R.add(tb);
    for (let i = 0; i < 5; i++) R.add(place(plane(0.5, 0.65, new THREE.MeshBasicMaterial({ map: canvasTex(64, 80, (g, w, h) => { g.fillStyle = "#f5eee0"; g.fillRect(0, 0, w, h); g.fillStyle = ["#7ad0ff", "#ffb06a", "#ff7aa0", "#9affc8", "#ffe27a"][i]; g.fillRect(5, 5, w - 10, h - 20); g.fillStyle = "#4a8a5a"; g.beginPath(); g.moveTo(5, h - 15); g.lineTo(30, 26); g.lineTo(w - 5, h - 15); g.fill(); }) })), -3.4 + i * 0.5, 0.97, -6, 0)).rotation.x = -1.3;
    flowers(R, 140, 3, 18, -2, -30);
    R.add(P.at(P.fence(16, 1.0), -8, 0, -10));
    R.add(P.at(P.rock(0.8, 3, "#8a8aa0"), 5, 0, -8));
    for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), glow("#ffffff", 1.4)); b.position.set(-4 + i * 1.6, 3 + rnd(i) * 2, -8 - rnd(i) * 6); noink(b); R.add(b); }
  },
  // B2b: the same meadow turned to dusk with ghosts rising from the camera's flash
  meadowDusk(R) {
    W2.meadow(R);
    for (const [x, y, z, s] of [[-1.5, 1.4, -8, 1.3], [3.6, 2.2, -11, 1.8], [-5, 2.8, -14, 2.2], [7, 1.6, -9, 1.2], [0.5, 3.6, -17, 2.6]] as number[][]) ghost(R, x, y, z, s);
    R.add(P.stars(150, 5, 400, 0.15, 2.4)); glowAt(R, 1.4, 2.7, -4.4, 10, "#fff2d0"); R.add(P.at(P.moon(10, [-80, 70, -200])));
  },
  // B5: the title borrows from Death Note: a black notebook glowing on a stone altar in a night forest clearing
  clearing(R) {
    floor(R, 400, 400, groundTex("#2a3a5a", "#223050", [50, 50]), -60);
    for (let i = 0; i < 46; i++) { const a = rnd(i) * 6.28, d = 9 + rnd(i + 4) * 38; R.add(P.at(P.tree(i % 4 ? "cone" : "dead", 6 + rnd(i + 2) * 8, ["#1f5a50", "#2a4a6a", "#1a4a40"][i % 3], "#3a2a3a"), Math.sin(a) * d, 0, -8 + Math.cos(a) * d * 0.9 - 20)); }
    const alt = new THREE.Group(); for (let i = 0; i < 3; i++) alt.add(box(3.4 - i * 0.7, 0.45, 2.6 - i * 0.5, lam(["#7a7a98", "#6a6a88", "#8a8aa8"][i]), 0, 0.22 + i * 0.45, 0)); alt.add(cyl(0.9, 0.9, 1.2, lam("#6a6a88"), -2.4, 0.6, 0.6, 8)); alt.add(cyl(0.9, 0.9, 1.6, lam("#7a7a98"), 2.4, 0.8, -0.4, 8)); place(alt, 0, 0, -6); R.add(alt);
    const nb = new THREE.Group(); nb.add(box(0.8, 0.12, 1.1, lam("#0e0a18"), 0, 0, 0)); nb.add(box(0.7, 0.02, 1.0, lam("#e8e0ff"), 0.02, 0.07, 0)); place(nb, 0, 1.45, -6); nb.rotation.y = 0.3; nb.scale.setScalar(1.6); R.add(nb);
    glowAt(R, 0, 2.2, -6, 16, "#9a6aff");
    for (let i = 0; i < 14; i++) { const pg = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.55), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.25, 1.5), side: THREE.DoubleSide })); pg.position.set((rnd(i) - 0.5) * 6, 1.5 + rnd(i + 3) * 4.5, -6 + (rnd(i + 5) - 0.5) * 5); pg.rotation.set(rnd(i) * 3, rnd(i + 2) * 3, rnd(i + 4) * 3); noink(pg); R.add(pg); }
    for (let i = 0; i < 20; i++) glowAt(R, (rnd(i + 30) - 0.5) * 16, 0.5 + rnd(i) * 3, -2 - rnd(i + 3) * 14, 0.6, "#e8ffa8");
    R.add(P.stars(300, 9, 400, 0.12, 2.4)); R.add(P.at(P.moon(14, [-60, 90, -200]))); glowAt(R, -3, 6, -12, 40, "#4a5aa8");
    R.add(P.at(P.fence(8, 1.0), 6, 0, -3)); R.add(P.at(P.rock(1.0, 5, "#6a6a88"), -5, 0, -4));
  },
  // B6: post 1: an abandoned house at night, one window glowing blue (the monitor), weeds, broken fence, nobody home
  househouse(R) {
    floor(R, 300, 300, groundTex("#2a4a4a", "#1f3a3a", [40, 40]), -60);
    const h = new THREE.Group(); h.add(box(9, 5.5, 6, plaster("#6a6a98", 3, 2) as any, 0, 2.75, 0)); const roof = new THREE.Mesh(new THREE.ConeGeometry(6.8, 3.2, 4), lam("#3a2a50")); roof.position.y = 7.1; roof.rotation.y = Math.PI / 4; roof.scale.z = 0.75; h.add(roof); h.add(box(1.0, 2.4, 0.3, lam("#4a2a30"), -2.6, 1.2, 3.05)); h.add(box(1.0, 2.4, 0.2, lam("#2a2038"), 3.4, 3.1, 3.0)); h.add(box(0.8, 3.4, 0.8, lam("#4a3a4a"), 3.0, 8.0, -0.5)); place(h, 0, 0, -9); R.add(h);
    win(R, 2.8, 3.2, -5.9, 2.0, 2.2, "#6aa8ff"); glowAt(R, 2.8, 3.2, -5.4, 10, "#6aa8ff");
    win(R, -3.2, 3.2, -5.9, 2.0, 2.2, "#1a1c38"); win(R, 0, 6.2, -5.9, 1.4, 1.4, "#1a1c38");
    R.add(P.at(P.fence(10, 1.1), -4, 0, -2)); R.add(P.at(P.fence(8, 1.1), 7, 0, -3));
    R.add(P.at(P.tree("dead", 7, "#2a2038", "#2a2038"), -7, 0, -9)); R.add(P.at(P.tree("dead", 5, "#2a2038", "#2a2038"), 8.5, 0, -8));
    for (let i = 0; i < 22; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.4 + rnd(i) * 0.3, 8, 6), lam(["#2a5a3a", "#1f4a3a", "#3a6a4a"][i % 3])); b.position.set((rnd(i + 3) - 0.5) * 16, 0.3, -5 + rnd(i + 5) * 4); b.scale.y = 0.8; R.add(b); }
    const mb = new THREE.Group(); mb.add(box(0.1, 1.1, 0.1, lam("#4a3a3a"), 0, 0.55, 0)); mb.add(box(0.5, 0.35, 0.8, lam("#b04a5a"), 0, 1.2, 0)); place(mb, 3.2, 0, -1); mb.rotation.z = 0.15; R.add(mb);
    for (let i = 0; i < 8; i++) R.add(place(box(1.6, 0.04, 0.9, lam("#6a6a88"), 0, 0.02, 0), 0.2, 0.02, -1.2 - i * 0.9));
    R.add(P.stars(300, 4, 400, 0.12, 2.4)); R.add(P.at(P.moon(12, [-70, 80, -220]))); glowAt(R, 0, 3, -12, 30, "#3a4a98");
    for (let i = 0; i < 6; i++) glowAt(R, (rnd(i) - 0.5) * 14, 0.4, -3 - rnd(i + 4) * 3, 7, "#4a5a9a");
    R.add(P.at(P.crate(0.9, "#6a5240"), -6, 0, -3));
  },
  // B7b: three out of eight: a dusk market square, a stall with eight jars, three glowing green
  stall(R) {
    floor(R, 200, 200, stoneTex("#9a8a9a", "", [24, 24]), -50);
    for (let i = 0; i < 6; i++) { const bx = -20 + i * 8; R.add(P.at(P.timber(5 + rnd(i) * 2, 6 + rnd(i + 1) * 3, 4.4, ["#cdb892", "#d8a898", "#b8c8a8"][i % 3], "#4a3426", ["#7a3f3a", "#3f5a7a"][i % 2]), bx, 0, -22 - rnd(i) * 3)); }
    const st = new THREE.Group(); st.add(box(5, 0.2, 1.8, lam("#8a5a38"), 0, 1.3, 0)); for (const sx of [-2.3, 2.3]) { st.add(box(0.2, 3.4, 0.2, lam("#5a3a24"), sx, 1.7, -0.7)); st.add(box(0.2, 2.6, 0.2, lam("#5a3a24"), sx, 1.3, 0.7)); } for (let i = 0; i < 8; i++) st.add(box(0.7, 0.08, 2.4, lam(i % 2 ? "#ffffff" : "#e8453c"), -2.45 + i * 0.7, 3.2 - i * 0.0, -0.4)); st.add(box(5.2, 0.2, 0.2, lam("#5a3a24"), 0, 3.3, -0.5)); st.add(box(5, 1.3, 1.6, lam("#6a4630"), 0, 0.65, 0)); place(st, 0, 0, -6); R.add(st);
    for (let i = 0; i < 8; i++) { const on = i === 1 || i === 4 || i === 6, g = new THREE.Group(); g.add(cyl(0.3, 0.3, 0.75, new THREE.MeshLambertMaterial({ color: on ? "#7affc8" : "#8aa0c8", transparent: true, opacity: on ? 0.95 : 0.55 }), 0, 0.38, 0, 14)); if (on) g.add(sphere(0.2, glow("#7affc8", 3.2), 0, 0.42, 0)); g.add(cyl(0.22, 0.22, 0.08, lam("#3a2a24"), 0, 0.8, 0, 14)); place(g, -2.1 + i * 0.6, 1.4, -6.1); R.add(g); if (on) glowAt(R, -2.1 + i * 0.6, 1.9, -5.8, 2.6, "#58ffc0"); }
    for (const [x, z] of [[-5, -5], [5, -4.5], [-8, -12], [9, -11]]) { R.add(P.at(P.lamppost(4.6), x, 0, z)); glowAt(R, x, 4.6, z, 5, "#ffcf8a"); }
    for (let i = 0; i < 4; i++) R.add(P.at(P.crate(0.8, "#8a6a44"), -5 + i * 0.9, 0, -3.2 - (i % 2) * 0.4));
    for (let i = 0; i < 3; i++) R.add(cyl(0.5, 0.45, 1.0, lam("#7a4a30"), 4.8 + i * 0.9, 0.5, -4, 14));
    R.add(P.stars(200, 8, 400, 0.2, 2.2)); glowAt(R, 0, 2, -5, 18, "#ffb06a");
  },
  // B10b: a second anon: a cramped attic, slanted roof, round moonlit window, fairy lights, mattress and a laptop on a crate
  attic(R) {
    floor(R, 14, 14, planksTex("#6a4a30", "", [3, 3]), -2);
    const sl = (s: number) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), lamTex(rep(ctex("atticroof", 256, 256, (g, r) => { g.fillStyle = "#7a4a3a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 16; i++) { g.fillStyle = r() > 0.5 ? "#6a3a30" : "#8a5a44"; g.fillRect(0, i * 16, 256, 14); } }), 3, 2))); p.position.set(s * 3.6, 4.4, -2); p.rotation.set(0, s * Math.PI / 2, s * -0.7); R.add(p); };
    sl(-1); sl(1);
    R.add(box(14, 6, 0.4, plaster("#6a4a7a", 4, 2), 0, 3, -8)); for (let i = -3; i <= 3; i++) R.add(box(0.25, 0.25, 12, lam("#3a2418"), i * 1.7, 5.6 - Math.abs(i) * 0.7, -2));
    const rw = new THREE.Mesh(new THREE.CircleGeometry(1.4, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 0.85, 2.0) })); rw.position.set(0, 3.4, -7.75); R.add(rw); R.add(P.at(P.moon(0.9, [0, 3.7, -7.7]))); glowAt(R, 0, 3.4, -7.2, 12, "#7a9aff");
    bed(R, -3.4, -5.4, "#d85a8a"); R.add(P.at(P.crate(1.0, "#8a6a44"), 2.4, 0, -6.2)); const lp = P.monitor("#a88aff"); lp.position.set(2.4, 1.0, -6.2); R.add(lp); glowAt(R, 2.4, 1.8, -5.8, 7, "#a88aff");
    for (let i = 0; i < 18; i++) { const b = sphere(0.1, glow(["#ffd58a", "#ff9ab0", "#9affc8", "#9ad0ff"][i % 4], 3), -5 + i * 0.6, 4.9 - Math.sin(i * 0.5) * 0.3 - Math.abs(i - 9) * 0.04, -7.5); noink(b); R.add(b); }
    rugAt(R, rugTex("#4a6aa8", "#e8b86a"), 5, 4, 0, 0.03, -3.4);
    for (let i = 0; i < 7; i++) R.add(box(0.5 + rnd(i) * 0.4, 0.3 + rnd(i + 2) * 0.5, 0.5, lam(["#c85a3a", "#3aa0a0", "#d8b050", "#7a8ad8"][i % 4]), -6 + i * 0.45, 0.25, -1 - (i % 3) * 0.5));
    R.add(box(8, 0.04, 0.04, lam("#3a2a20"), 0, 3.6, -3)); for (let i = 0; i < 6; i++) R.add(box(0.5, 0.7, 0.04, lam(["#e8453c", "#ffe04a", "#3aa0a0"][i % 3]), -3.5 + i * 1.3, 3.2, -3));
    plant(R, 5.2, -6, 1.5);
  },
  // B9: post 4: a tall library, shelves to the ceiling both sides, a ladder, a round reading table with the book on a plinth
  library(R) {
    floor(R, 20, 40, planksTex("#7a4a30", "", [5, 10]), -10);
    for (const s of [-1, 1]) { shelf(R, s * 5.2, -22, 4, 8, 0, 3 + s); R.add(box(0.2, 0.2, 26, lam("#3a2418"), s * 4.6, 4.3, -9)); }
    R.add(box(12, 8.5, 0.4, brickTex("#8a4a4a", "", [3, 3]) as any, 0, 4.2, -24));
    for (let z = -4; z > -22; z -= 6) { R.add(box(11, 0.3, 0.3, lam("#4a2e20"), 0, 8.2, z)); lampHang(R, 0, 6.6, z, "#ffc27a", 8); }
    const lad = new THREE.Group(); for (const x of [-0.35, 0.35]) lad.add(box(0.07, 4.2, 0.07, lam("#8a6a44"), x, 2.1, 0)); for (let i = 0; i < 9; i++) lad.add(box(0.7, 0.05, 0.08, lam("#8a6a44"), 0, 0.4 + i * 0.45, 0)); lad.rotation.x = -0.18; place(lad, -4.3, 0, -9); R.add(lad);
    const tb = new THREE.Group(); tb.add(cyl(1.6, 1.6, 0.12, lam("#6a3a28"), 0, 1.0, 0, 24)); tb.add(cyl(0.18, 0.5, 1.0, lam("#4a2a1c"), 0, 0.5, 0, 12)); place(tb, 0, 0, -8); R.add(tb);
    const pl = new THREE.Group(); pl.add(box(1.0, 1.0, 1.0, lam("#3a2a4a"), 0, 0.5, 0)); place(pl, 0, 1.08, -8); R.add(pl);
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.18), [lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), new THREE.MeshBasicMaterial({ map: textTex(256, 360, "#5a2a5a", "#e8d49a", ["THE", "FORBIDDEN", "PARA-", "PSYCHOLOGY"], "Anton", 48, "#e8d49a"), color: new THREE.Color(1.3, 1.3, 1.3) }), lam("#2b2540")]); bk.position.set(0, 2.2, -8); bk.rotation.x = -0.12; R.add(bk);
    glowAt(R, 0, 2.6, -7.4, 8, "#ffd58a"); const sp = new THREE.SpotLight("#ffd8a0", 60, 14, 0.5, 0.6); sp.position.set(0, 7, -6); sp.target.position.set(0, 1.5, -8); R.add(sp, sp.target);
    rugAt(R, rugTex("#7a2a4a", "#e8b86a"), 8, 8, 0, 0.03, -8);
    const gl = new THREE.Group(); gl.add(sphere(0.45, lam("#3a7ac8"), 0, 0.9, 0)); gl.add(cyl(0.05, 0.2, 0.5, lam("#6a4630"), 0, 0.3, 0)); place(gl, 3.2, 0, -5); R.add(gl);
    R.add(P.at(P.chair("#8a3a3a"), -2.6, 0, -5.4)); R.add(P.at(P.chair("#8a3a3a"), 2.7, 0, -10.2));
    for (let i = 0; i < 30; i++) glowAt(R, (rnd(i) - 0.5) * 8, 0.8 + rnd(i + 2) * 6, -4 - rnd(i + 5) * 14, 0.1, "#ffe8b0");
  },
  // B10: 1930, panelled study: fireplace, armchair, typewriter, candles, dark mist pushing through the window
  study(R) {
    floor(R, 16, 16, planksTex("#5a3a28", "", [4, 4]), -2);
    R.add(box(16, 9, 0.4, lamTex(rep(ctex("panel", 256, 256, (g, r) => { g.fillStyle = "#4a2a1c"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { g.fillStyle = r() > 0.5 ? "#5a3624" : "#52301f"; g.fillRect(i * 64 + 6, j * 128 + 8, 52, 112); g.strokeStyle = "#2a160e"; g.lineWidth = 3; g.strokeRect(i * 64 + 6, j * 128 + 8, 52, 112); } }), 4, 1)) as any, 0, 4.5, -8)); R.add(box(0.4, 9, 16, lam("#46281c"), -8, 4.5, -2)); R.add(box(0.4, 9, 16, lam("#46281c"), 8, 4.5, -2));
    const fp = new THREE.Group(); fp.add(box(4.2, 3.6, 0.9, stoneTex("#a89888", "", [2, 2]) as any, 0, 1.8, 0)); fp.add(box(2.2, 1.9, 0.9, lam("#12080a"), 0, 1.0, 0.12)); fp.add(box(4.8, 0.3, 1.2, lam("#6a4630"), 0, 3.7, 0.1)); place(fp, -3.6, 0, -7.4); R.add(fp); for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.4 - i * 0.05, 1.2 - i * 0.12, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.0 + i * 0.3, 0.2) })); f.position.set(-3.6 + (i - 1.5) * 0.35, 1.0, -7.1); noink(f); R.add(f); } glowAt(R, -3.6, 1.2, -6.4, 14, "#ff8a3a");
    const ac = new THREE.Group(); ac.add(box(1.8, 0.7, 1.6, lam("#8a2a3a"), 0, 0.5, 0)); ac.add(box(1.8, 1.4, 0.35, lam("#8a2a3a"), 0, 1.3, -0.6)); for (const sx of [-1, 1]) ac.add(box(0.3, 1.0, 1.6, lam("#7a2434"), sx * 0.9, 0.8, 0)); place(ac, -1.2, 0, -4.6); ac.rotation.y = 0.4; R.add(ac);
    const dk = P.desk(2.8, 1.2, "#3a2218"); dk.position.set(2.8, 0, -5.6); R.add(dk); const tw = new THREE.Group(); tw.add(box(0.6, 0.3, 0.5, lam("#1a1a28"), 0, 0.15, 0)); tw.add(box(0.5, 0.04, 0.5, lam("#e8e0c8"), 0, 0.42, -0.2)); place(tw, 2.8, 0.95, -5.6); R.add(tw);
    for (const [x, z] of [[1.6, -5.3], [4.1, -5.9], [-5.6, -7], [0.6, -7.3]]) { R.add(cyl(0.06, 0.07, 0.5, lam("#efe6cf"), x, 1.2, z, 10)); R.add(sphere(0.08, glow("#ffd27a", 3.5), x, 1.5, z)); glowAt(R, x, 1.55, z, 3, "#ffb04a"); }
    win(R, 4.6, 4.2, -7.7, 2.6, 4.2, "#4a3a8a"); glowAt(R, 4.6, 4.2, -7.2, 9, "#8a6aff");
    for (let i = 0; i < 7; i++) { const m2 = P.glowSprite(i % 2 ? "#6a2a9a" : "#2a1a4a", 3.6 - i * 0.22); m2.position.set(4.4 - i * 0.7, 3.4 - i * 0.2, -6.4 + i * 0.12); R.add(m2); }
    R.add(P.at(P.bookshelf(3, 5, 26), 7, 0, -6.8)); R.add(box(1.3, 0.1, 1.3, lam("#c8a86a"), 0, 0.04, -2));
    const bust = new THREE.Group(); bust.add(box(0.5, 1.0, 0.5, lam("#6a5a4a"), 0, 0.5, 0)); bust.add(sphere(0.28, lam("#d8d0c0"), 0, 1.3, 0)); place(bust, -6, 0, -6); R.add(bust);
    rugAt(R, rugTex("#6a2a3a", "#c8a86a"), 6, 4.5, 0.5, 0.03, -4);
    for (let i = 0; i < 3; i++) { const rg = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.28, 0.05, 6, 28), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 0.5, 2.4), transparent: true, opacity: 0.8 - i * 0.2 })); rg.position.set(2.0, 1.9, -3.6); noink(rg); R.add(rg); }
    for (let i = 0; i < 9; i++) { const h = sphere(0.16 + (i % 3) * 0.05, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.3, 1.5), transparent: true, opacity: 0.85 }), 4.3 - i * 0.28, 3.2 - i * 0.14 + Math.sin(i) * 0.1, -6.2 + i * 0.3); noink(h); R.add(h); }
    glowAt(R, 2.0, 1.9, -3.4, 7, "#a84aff");
    const lec = new THREE.Group(); lec.add(box(0.9, 1.4, 0.7, lam("#3a2218"), 0, 0.7, 0)); const top = box(1.3, 0.1, 0.9, lam("#4a2c20"), 0, 1.45, 0); top.rotation.x = 0.3; lec.add(top); place(lec, 0.5, 0, -3.8); R.add(lec);
    const bk = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 1.4), [lam("#2a3a6a"), lam("#2a3a6a"), new THREE.MeshBasicMaterial({ map: textTex(256, 360, "#3a4a7a", "#e8d49a", ["PSYCHIC", "SELF-", "DEFENCE", "1930"], "Anton", 58, "#e8d49a"), color: new THREE.Color(1.35, 1.35, 1.35) }), lam("#2a3a6a"), lam("#2a3a6a"), lam("#2a3a6a")]); bk.position.set(0.5, 1.62, -3.75); bk.rotation.set(0.3, 0.1, 0); R.add(bk); glowAt(R, 0.5, 1.9, -3.4, 5, "#ffd58a");
  },
  // B11: 1942, a physiology lab: tiled walls, tall windows, benches with flasks, a doll with pins, the heart monitor
  lab(R) {
    floor(R, 18, 18, checkTex("#5a6a68", "#12404e"), -2);
    R.add(box(18, 9, 0.4, lamTex(rep(ctex("labtile", 256, 256, (g) => { g.fillStyle = "#cfe8e0"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#7aa8a0"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, 256); g.moveTo(0, i * 32); g.lineTo(256, i * 32); g.stroke(); } }), 4, 2)) as any, 0, 4.5, -8));
    for (const x of [-4, 0.6, 5]) { win(R, x, 5.0, -7.7, 2.4, 3.6, "#cfe8ff"); glowAt(R, x, 4.6, -7.2, 8, "#e8f4ff"); }
    const mk = (x: number, z: number, w: number) => { const b = new THREE.Group(); b.add(box(w, 0.14, 1.4, lam("#2a2830"), 0, 1.0, 0)); b.add(box(w - 0.2, 1.0, 1.3, lam("#4a4a58"), 0, 0.5, 0)); place(b, x, 0, z); R.add(b); };
    mk(-3.4, -5.4, 5); mk(4.4, -5.6, 4.6);
    const doll = new THREE.Group(); doll.add(box(0.5, 0.6, 0.2, lam("#c8a070"), 0, 0.5, 0)); doll.add(sphere(0.2, lam("#c8a070"), 0, 1.0, 0)); for (const s of [-1, 1]) { doll.add(box(0.14, 0.5, 0.14, lam("#c8a070"), s * 0.34, 0.5, 0)); doll.add(box(0.16, 0.5, 0.14, lam("#c8a070"), s * 0.12, 0.0, 0)); } for (let i = 0; i < 5; i++) { const pin = cyl(0.015, 0.015, 0.5, lam("#d8d8e8"), -0.12 + i * 0.07, 0.55, 0.12, 6); pin.rotation.z = 0.5 - i * 0.28; doll.add(pin); doll.add(sphere(0.035, lam("#e8453c"), -0.12 + i * 0.07 - Math.sin(0.5 - i * 0.28) * 0.25, 0.55 + Math.cos(0.5 - i * 0.28) * 0.25, 0.12)); } place(doll, -1.2, 1.07, -4.9); for (const sx of [-1, 1]) doll.add(sphere(0.045, new THREE.MeshBasicMaterial({ color: "#14102a" }), sx * 0.08, 1.04, 0.17)); doll.add(box(0.12, 0.02, 0.02, new THREE.MeshBasicMaterial({ color: "#8a1a2a" }), 0, 0.94, 0.19)); doll.scale.setScalar(2.4); R.add(doll);
    const mon = new THREE.Group(); mon.add(box(1.8, 1.3, 0.6, lam("#2a2a38"), 0, 0.65, 0)); mon.add(plane(1.5, 1.0, new THREE.MeshBasicMaterial({ map: canvasTex(256, 160, (g, w, h) => { g.fillStyle = "#04140e"; g.fillRect(0, 0, w, h); g.strokeStyle = "#5affb4"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 90); for (let x = 0; x < w; x += 64) { g.lineTo(x + 20, 90); g.lineTo(x + 28, 30); g.lineTo(x + 36, 130); g.lineTo(x + 44, 90); g.lineTo(x + 64, 90); } g.stroke(); }), color: new THREE.Color(1.5, 1.5, 1.5) }), 0, 0.7, 0.32)); place(mon, 2.4, 1.07, -4.8); mon.scale.setScalar(1.6); R.add(mon); glowAt(R, 2.4, 2.2, -4.4, 9, "#5affb4"); const fear = P.glowSprite("#3a1a5a", 5); fear.position.set(1.2, 3.2, -4.0); R.add(fear); const fear2 = P.glowSprite("#6a2a8a", 3.4); fear2.position.set(1.5, 3.5, -3.9); R.add(fear2); R.add(P.at(P.chair("#2a8a98"), 1.2, 0, -4.2));
    for (let i = 0; i < 7; i++) { const c = ["#7affc8", "#ff7ab0", "#e8e07a", "#7ab0ff"][i % 4], fl = cyl(0.16 + rnd(i) * 0.1, 0.26, 0.5 + rnd(i + 2) * 0.3, new THREE.MeshLambertMaterial({ color: c, transparent: true, opacity: 0.7 }), -6.4 + i * 0.5, 1.35, -5.5, 12); R.add(fl); }
    R.add(cyl(0.3, 0.2, 0.7, new THREE.MeshLambertMaterial({ color: "#b8e0ff", transparent: true, opacity: 0.45 }), 2.0, 1.45, -5.4)); // a nearly dry glass for dehydration
    R.add(place(sign(textTex(512, 256, "#e8e0c8", "#1a1830", ["1942"], "Anton", 160, "#1a1830"), 3.4, 1.7, 1.0), -2.4, 5.8, -7.6));
    for (let i = 0; i < 3; i++) glowAt(R, -5 + i * 5, 6.8, -3, 4, "#d0ffe8");
    R.add(P.at(P.chair("#2a8a98"), 0.8, 0, -3)); const sk = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), lam("#e8e0d0")); sk.position.set(0.6, 1.2, -5.3); R.add(sk);
  },
  // B7: an anon's bedroom (post 2): bed, posters (no text), window with two men in black outside, glowing monitor
  bedroom(R) {
    floor(R, 14, 14, planksTex("#4a3a58", "", [3, 3]), -2);
    R.add(box(14, 8, 0.4, plaster("#2f6aa8", 4, 2), 0, 4, -7.2)); wain(R, 14, -7.2, "#e8c24a", "#f4ead2"); R.add(box(0.4, 8, 14, plaster("#2f5a98", 3, 2), -7, 4, -2));
    bed(R, -4.6, -4.8, "#d85a6a"); const dk = new THREE.Group(); dk.add(P.desk(2.0, 0.9, "#6a4630")); const m = P.monitor("#6aa8ff"); m.position.set(0, 0.945, -0.1); m.scale.setScalar(1.3); dk.add(m); dk.add(P.at(P.chair("#c85a3a"), 0, 0, 0.9)); place(dk, 1.6, 0, -5.2); R.add(dk); glowAt(R, 1.6, 1.8, -4.9, 9, "#6aa8ff");
    for (const [x, y, c] of [[-2.6, 4.4, "#d85a6a"], [-1.2, 4.0, "#3aa0a0"], [-0.2, 4.6, "#e8c24a"], [0.8, 3.9, "#7a5ae8"]] as [number, number, string][]) R.add(place(plane(0.8, 1.1, new THREE.MeshBasicMaterial({ map: canvasTex(64, 90, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); g.fillStyle = "#14102a"; g.beginPath(); g.arc(32, 36, 16, 0, 7); g.fill(); g.fillRect(14, 54, 36, 30); }) })), x, y, -7.0));
    win(R, 4.6, 3.8, -7.0, 2.6, 3.0, "#1a2060");
    for (const dx of [-0.4, 0.4]) { const mb = new THREE.Group(); mb.add(box(0.5, 1.2, 0.3, lam("#0a0814"), 0, 0.6, 0)); mb.add(sphere(0.22, lam("#d8c0a8"), 0, 1.45, 0)); mb.add(cyl(0.3, 0.3, 0.05, lam("#0a0814"), 0, 1.65, 0)); mb.add(cyl(0.2, 0.2, 0.2, lam("#0a0814"), 0, 1.75, 0)); place(mb, 4.6 + dx, 2.4, -7.4); R.add(mb); }
    const bb = new THREE.Mesh(new THREE.SphereGeometry(0.9, 14, 10), lam("#c85a3a")); bb.scale.y = 0.7; bb.position.set(-1.2, 0.5, -3); R.add(bb); plant(R, 6, -6, 1.4); rugAt(R, rugTex("#6a3a8a", "#e8b86a"), 5, 4, 0, 0.03, -3.4);
    for (let i = 0; i < 6; i++) R.add(box(0.5, 0.35, 0.6, lam(["#3aa0a0", "#e8c24a", "#d85a6a"][i % 3]), -6 + i * 0.5, 0.2, -6.4));
  },
};
