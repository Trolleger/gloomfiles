// EP01 v3 worlds: every place is built only to show what its line says (see docs/EP01_PLAN_v2.md, "line -> what's shown and why").
import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex, lamTex } from "../mats";
import * as P from "../props";
import { rnd } from "../props/util";
import { NOINK } from "../ink";
import { R, place, floor, glowAt, win, plant, plaster, wain, rugAt, bed, shelf, lampHang, clock } from "./worlds";
import { planksTex, brickTex, stoneTex, groundTex, rugTex, textTex } from "./tex";
import { rep, ctex, facadeHD, roofHD, grassHD, cobbleHD } from "./paint";

const noink = (o: THREE.Object3D) => { o.traverse((c) => c.layers.set(NOINK)); return o; };
const beam = (R: R, a: THREE.Vector3, b: THREE.Vector3, c: string, r = 0.07, k = 2.2) => { const d = new THREE.Vector3().subVectors(b, a), L = d.length(), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), transparent: true, opacity: 0.85, fog: false })); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); noink(m); R.add(m); return m; };
const target = (hit: boolean, s = 1) => {
  const g = new THREE.Group(); g.add(box(0.12, 2.4, 0.12, lam("#4a3a2a"), 0, 1.2, 0)); g.add(box(1.6, 0.1, 0.5, lam("#4a3a2a"), 0, 0.05, 0));
  const rings: [number, string][] = [[0.9, "#f2eadc"], [0.68, "#2f6aa8"], [0.46, "#e8453c"], [0.24, "#ffe04a"]];
  rings.forEach(([r, c], i) => { const d = cyl(r, r, 0.1, lam(c), 0, 2.2, 0.06 + i * 0.012, 28); d.rotation.x = Math.PI / 2; g.add(d); });
  if (hit) { const cr = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 6, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.3, 0.2) })); cr.position.set(0, 2.2, 0.14); noink(cr); g.add(cr); for (let i = 0; i < 6; i++) { const ln = box(0.03, 0.55, 0.03, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.4, 0.2) }), Math.sin(i) * 0.15, 2.2 + Math.cos(i) * 0.15, 0.15); ln.rotation.z = i * 1.05; noink(ln); g.add(ln); } g.userData.hit = true; g.children.forEach((ch) => { if (ch.userData.rvh === undefined && (ch as any).material?.color && ch.layers.mask === NOINK) {} }); }
  g.scale.setScalar(s); return g;
};
const paperCard = (draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, w = 1.1, h = 1.4, rz = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: canvasTex(128, Math.round(128 * h / w), (g, W, H) => { g.fillStyle = "#f5eee0"; g.fillRect(0, 0, W, H); draw(g, W, H); g.strokeStyle = "rgba(40,30,40,.5)"; g.lineWidth = 3; g.strokeRect(1, 1, W - 2, H - 2); }) })); m.rotation.z = rz; return m; };


// outdoor dressing: distant hills + snowy mountains, rocks, grass tufts, clouds, village lights so skies and ground are never plain
const outdoor = (R: R, o: { hill?: string; mount?: string; ground?: string; z?: number; cloud?: string; rocks?: number; tufts?: number; lights?: boolean } = {}) => {
  const z0 = o.z ?? -120;
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(40, 20, 10), lam(o.hill ?? "#2a2a68")); m.scale.set(1.8, 0.45 + rnd(i) * 0.3, 1.2); m.position.set(-170 + i * 45, -6, z0 + 40 - rnd(i + 3) * 30); R.add(m); }
  for (let i = 0; i < 6; i++) { const h = 60 + rnd(i + 9) * 45, c = new THREE.Mesh(new THREE.ConeGeometry(h * 0.7, h, 6), lam(o.mount ?? "#3a3a88")); c.position.set(-150 + i * 60, h / 2 - 3, z0 - 40 - rnd(i) * 40); R.add(c); const s = new THREE.Mesh(new THREE.ConeGeometry(h * 0.24, h * 0.32, 6), lam("#dfe4ff")); s.position.set(c.position.x, h - h * 0.16 - 3, c.position.z); R.add(s); }
  for (let i = 0; i < 10; i++) { const s = P.glowSprite(o.cloud ?? "#6a6ab8", 50 + rnd(i) * 40); s.position.set(-220 + i * 50 + rnd(i + 5) * 20, 55 + rnd(i + 8) * 40, z0 - 20 - rnd(i + 11) * 80); R.add(s); }
  for (let i = 0; i < (o.rocks ?? 14); i++) R.add(P.at(P.rock(0.5 + rnd(i) * 0.9, i + 3, ["#6a6a98", "#5a5a88", "#7a7aa8"][i % 3]), (rnd(i + 1) - 0.5) * 36, 0, -4 - rnd(i + 6) * 50));
  for (let i = 0; i < (o.tufts ?? 120); i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5 + rnd(i) * 0.4, 5), lam(["#3a8a6a", "#2a7a5a", "#58b888"][i % 3])); t.position.set((rnd(i + 2) - 0.5) * 40, 0.25, -2 - rnd(i + 7) * 45); R.add(t); }
  // painted village on the horizon (skill facades + roofs)
  for (let i = 0; i < 9; i++) { const ww = 5 + rnd(i) * 2.5, hh = 5 + rnd(i + 2) * 3, dd = 4.5, tex = lamTex(rep(facadeHD("v" + (i % 4), ww, hh, { wall: ["#d8b88a", "#c8a0a0", "#a8b8c8", "#c8c88a"][i % 4], shutter: ["#3a5a8a", "#8a3a3a", "#3a7a5a", "#7a5a2a"][i % 4], door: i % 2 === 0, timber: i % 3 === 0 }), 1, 1));
    const h = new THREE.Group(); h.add(box(ww, hh, dd, tex, 0, hh / 2, 0)); const rf = new THREE.Mesh(new THREE.ConeGeometry(ww * 0.78, 2.6, 4), lamTex(rep(roofHD(["#9a4a3a", "#5a4a7a", "#3a5a7a"][i % 3]), 2, 1))); rf.position.y = hh + 1.3; rf.rotation.y = Math.PI / 4; rf.scale.z = dd / ww * 1.25; h.add(rf); h.position.set(-60 + i * 15 + rnd(i + 6) * 4, 0, z0 + 70 - rnd(i + 8) * 14); R.add(h); }
  if (o.lights) for (let i = 0; i < 30; i++) glowAt(R, -80 + rnd(i) * 160, 1 + rnd(i + 4) * 2, z0 + 10 + rnd(i + 9) * 10, 1.4, "#ffd58a");
};

export const W3: Record<string, (R: R) => void> = {
  // S1: "he can attack strangers with his mind. Eight tries, three hits." eight targets, three cracked and glowing, a purple mind-beam from a glowing head
  targets8(R) {
    floor(R, 300, 300, lamTex(rep(grassHD(), 60, 60)), -80); floor(R, 12, 300, rugTex("#3a2a6a", "#6a4aaa"), -60).position.y = 0.01;
    for (let i = 0; i < 8; i++) { const t = target(i === 1 || i === 4 || i === 6, 1.3); t.children.forEach((ch) => { if ((ch as any).material instanceof THREE.MeshBasicMaterial && ch.position.y > 2) ch.userData.rv = i === 1 ? 0.45 : i === 4 ? 0.62 : 0.78; }); place(t, (i % 2 ? 1 : -1) * 1.3, 0, -6 - i * 5.5); R.add(t); { const bl = new THREE.Mesh(new THREE.CircleGeometry(1.3, 16), new THREE.MeshBasicMaterial({ color: '#0a0620', transparent: true, opacity: 0.55 })); bl.rotation.x = -Math.PI / 2; bl.position.set((i % 2 ? 1 : -1) * 1.3, 0.03, -6 - i * 5.5); noink(bl); R.add(bl); } if (i === 1 || i === 4 || i === 6) glowAt(R, (i % 2 ? 1 : -1) * 1.3, 2.8, -5.4 - i * 5.5, 6, "#ff4a3a"); }
    const head = new THREE.Group(); head.add(sphere(0.9, lam("#d8c8e8"), 0, 0, 0)); for (const sx of [-1, 1]) head.add(sphere(0.12, glow("#d8a8ff", 3), sx * 0.3, 0.1, 0.8)); head.add(sphere(1.15, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 0.3, 1.4), transparent: true, opacity: 0.35 }), 0, 0, 0)); place(head, -5.5, 3.2, -4); noink(head.children[2]); R.add(head); glowAt(R, -5.5, 3.2, -4, 12, "#a86aff");
    for (const i of [1, 4, 6]) beam(R, new THREE.Vector3(-5.2, 3.2, -3.5), new THREE.Vector3((i % 2 ? 1 : -1) * 1.3, 2.5, -6 - i * 5.5), "#b87aff", 0.06);
    for (let i = 0; i < 30; i++) glowAt(R, (rnd(i) - 0.5) * 20, 0.5 + rnd(i + 4) * 6, -3 - rnd(i + 8) * 40, 0.5, "#d8b8ff");
    R.add(P.at(P.fence(30, 1.1), -6, 0, -12)); R.add(P.at(P.fence(30, 1.1), 6, 0, -12)); for (let i = 0; i < 14; i++) { const ar = new THREE.Group(); ar.add(cyl(0.025, 0.025, 1.1, lam('#8a6a44'), 0, 0.5, 0, 6)); ar.add(box(0.2, 0.2, 0.02, lam('#e8453c'), 0, 1.0, 0)); place(ar, (rnd(i) - 0.5) * 6, 0, -3 - rnd(i + 4) * 30); ar.rotation.z = (rnd(i + 2) - 0.5) * 0.5; R.add(ar); }
    outdoor(R, { lights: true, rocks: 22 }); R.add(P.stars(300, 6, 400, 0.08, 2.4)); R.add(P.at(P.moon(16, [70, 80, -230]))); glowAt(R, 0, 14, -90, 90, "#4a3a9a");
  },
  // S2: "Then he went silent." empty chair, dead monitor, cobweb, cold mug, moonlight
  emptychair(R) {
    floor(R, 14, 14, planksTex("#5a4a48", "", [3, 3]), -2);
    R.add(box(14, 8, 0.4, plaster("#2f5a68", 4, 2), 0, 4, -7)); wain(R, 14, -7, "#1f3a48", "#c8c0b0"); R.add(box(0.4, 8, 14, plaster("#2a4a58", 3, 2), -7, 4, -2));
    const d = P.desk(3.0, 1.3, "#4a3224"); d.position.set(0, 0, -5); R.add(d);
    const m = new THREE.Group(); m.add(box(1.4, 1.0, 0.12, lam("#14141c"), 0, 0.5, 0)); m.add(plane(1.2, 0.8, new THREE.MeshBasicMaterial({ map: canvasTex(256, 170, (g, W, H) => { g.fillStyle = '#0a0e1a'; g.fillRect(0, 0, W, H); g.fillStyle = '#2a3a5a'; for (let k = 0; k < 5; k++) g.fillRect(14, 16 + k * 22, 60 + (k * 37) % 120, 12); g.fillStyle = '#18243a'; g.fillRect(10, H - 34, W - 20, 22); g.fillStyle = '#4a6aaa'; g.fillRect(16, H - 28, 3, 10); g.fillStyle = '#3a4a6a'; g.font = '14px Anton'; g.fillText('1 week ago', W - 90, 20); }), color: new THREE.Color(0.9, 0.95, 1.2) }), 0, 0.5, 0.075)); m.add(box(0.2, 0.3, 0.1, lam("#14141c"), 0, 0, 0)); place(m, 0, 1.0, -5.2); m.scale.setScalar(1.4); R.add(m);
    const ch = P.chair("#6a3a48"); ch.position.set(0.6, 0, -3.6); ch.rotation.y = 2.6; R.add(ch); clock(R, "3:07", -3.2, 5.0, -6.75, 1.1);
    R.add(P.at(P.mug("#c24a5a"), -0.9, 0.95, -4.8));
    for (let i = 0; i < 9; i++) { const a = i / 8 * Math.PI / 2, st = box(0.01, 1.6, 0.01, new THREE.MeshBasicMaterial({ color: "#e8e8f8" }), -6.9 + Math.sin(a) * 0.1, 6.6 - Math.cos(a) * 0.2, -6.7); st.rotation.z = a - 0.8; R.add(st); }
    for (let i = 0; i < 40; i++) glowAt(R, (rnd(i) - 0.5) * 10, 0.4 + rnd(i + 3) * 5, -6 + rnd(i + 8) * 5, 0.12, "#c8d0ff");
    win(R, 4.4, 4.0, -6.7, 2.6, 3.4, "#34406a"); glowAt(R, 4.4, 3.6, -6.2, 9, "#7a8aff");
    R.add(P.at(P.bookshelf(3, 4, 18), -5, 0, -6.6)); R.add(P.at(P.crate(0.8, "#6a5240"), 5.2, 0, -3)); const lp = P.lampDesk("#ffd9a0"); lp.position.set(-1.1, 0.95, -5); lp.scale.setScalar(1.6); R.add(lp); glowAt(R, -1.1, 2.0, -4.8, 6, "#ffc27a"); for (const [px, py, c] of [[-2.8, 4.6, "#d85a6a"], [-1.6, 3.9, "#3aa0a0"], [-0.4, 4.7, "#e8c24a"]] as [number, number, string][]) R.add(place(plane(0.9, 1.2, new THREE.MeshBasicMaterial({ map: canvasTex(64, 90, (g, ww, hh) => { g.fillStyle = c; g.fillRect(0, 0, ww, hh); g.fillStyle = "#14102a"; g.beginPath(); g.arc(32, 36, 15, 0, 7); g.fill(); g.fillRect(14, 54, 36, 30); }) })), px, py, -6.78));
  },
  // S3: "/x/, 4chan's paranormal board." a giant pinboard of paranormal pictures with red string, floating in the sky
  board(R) {
    floor(R, 120, 60, planksTex("#7a5a3a", "", [10, 5]), -14);
    const bd = new THREE.Group(); bd.add(box(16, 10.5, 0.5, lam("#5a3a24"), 0, 5.4, 0)); bd.add(plane(15.2, 9.8, P.corkboard(1, 1).children[0] ? lam("#c8905a") : lam("#c8905a"), 0, 5.4, 0.27)); place(bd, 0, 0, -12); R.add(bd);
    const cards: ((g: CanvasRenderingContext2D, w: number, h: number) => void)[] = [
      (g, w, h) => { g.fillStyle = "#2a2a6a"; g.fillRect(8, 8, w - 16, h - 30); g.fillStyle = "#e8f4ff"; g.beginPath(); g.moveTo(34, 100); g.lineTo(34, 40); g.arc(64, 40, 30, Math.PI, 0); g.lineTo(94, 100); g.lineTo(80, 90); g.lineTo(64, 100); g.lineTo(48, 90); g.fill(); g.fillStyle = "#1a1030"; g.fillRect(52, 40, 6, 10); g.fillRect(70, 40, 6, 10); g.beginPath(); g.arc(64, 62, 5, 0, 7); g.fill(); },
      (g, w, h) => { g.fillStyle = "#14204a"; g.fillRect(8, 8, w - 16, h - 30); g.fillStyle = "#aab4c8"; g.beginPath(); g.ellipse(64, 56, 40, 12, 0, 0, 7); g.fill(); g.fillStyle = "#8ad8ff"; g.beginPath(); g.ellipse(64, 46, 18, 12, 0, Math.PI, 0); g.fill(); g.fillStyle = "rgba(255,255,160,.5)"; g.beginPath(); g.moveTo(40, 64); g.lineTo(88, 64); g.lineTo(100, 108); g.lineTo(28, 108); g.fill(); },
      (g, w, h) => { g.fillStyle = "#2a5a3a"; g.fillRect(8, 8, w - 16, h - 30); g.fillStyle = "#0e1a10"; g.fillRect(52, 50, 26, 56); g.beginPath(); g.arc(65, 42, 15, 0, 7); g.fill(); g.fillRect(36, 56, 16, 34); g.fillRect(78, 56, 16, 34); g.fillStyle = "#e8e8c0"; g.fillRect(58, 38, 4, 4); g.fillRect(68, 38, 4, 4); },
      (g, w, h) => { g.fillStyle = "#c8a85a"; g.fillRect(8, 8, w - 16, h - 30); g.strokeStyle = "#4a6a2a"; g.lineWidth = 6; for (const r of [12, 26, 40]) { g.beginPath(); g.arc(64, 62, r, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(64, 14); g.lineTo(64, 110); g.moveTo(16, 62); g.lineTo(112, 62); g.stroke(); },
      (g, w, h) => { g.fillStyle = "#1a1030"; g.fillRect(8, 8, w - 16, h - 30); g.fillStyle = "#e8e0ff"; g.beginPath(); g.arc(64, 60, 28, 0, 7); g.fill(); g.fillStyle = "#1a1030"; g.beginPath(); g.arc(74, 54, 26, 0, 7); g.fill(); },
      (g, w, h) => { g.fillStyle = "#2a1a3a"; g.fillRect(8, 8, w - 16, h - 30); g.fillStyle = "#e8d49a"; g.beginPath(); g.ellipse(64, 60, 34, 20, 0, 0, 7); g.fill(); g.fillStyle = "#14102a"; g.beginPath(); g.arc(64, 60, 13, 0, 7); g.fill(); g.fillStyle = "#e8f4ff"; g.beginPath(); g.arc(68, 56, 4, 0, 7); g.fill(); },
    ];
    const pos: [number, number][] = [[-5.2, 8.2], [-1.8, 8.6], [1.8, 7.8], [5.4, 8.4], [-4.6, 4.6], [-1.0, 4.2], [2.6, 4.8], [5.6, 4.0], [-6.0, 1.6], [-2.2, 1.4], [1.4, 1.8], [4.8, 1.2]];
    pos.forEach(([x, y], i) => { const c = paperCard(cards[i % cards.length], 2.4, 2.9, (rnd(i) - 0.5) * 0.18); c.position.set(x, y, -11.45); R.add(c); R.add(sphere(0.12, lam("#e8243e"), x, y + 1.3, -11.4)); });
    const pts = pos.map(([x, y]) => new THREE.Vector3(x, y + 1.3, -11.35)); [[0, 1], [1, 3], [3, 7], [7, 11], [11, 10], [10, 6], [6, 5], [5, 4], [4, 8], [8, 9], [9, 10], [2, 6], [1, 5]].forEach(([a, b]) => beam(R, pts[a], pts[b], "#e8243e", 0.025, 1.2));
    outdoor(R, { z: -90, cloud: "#7a5ac8", rocks: 4, tufts: 40 }); R.add(P.stars(300, 12, 400, 0.05, 2.4)); glowAt(R, 0, 8, -9, 36, "#7a4ac8"); R.add(P.at(P.moon(9, [60, 60, -120])));
    const lad = new THREE.Group(); for (const x of [-0.35, 0.35]) lad.add(box(0.07, 5.2, 0.07, lam("#8a6a44"), x, 2.6, 0)); for (let i = 0; i < 11; i++) lad.add(box(0.7, 0.05, 0.08, lam("#8a6a44"), 0, 0.4 + i * 0.45, 0)); lad.rotation.x = -0.1; place(lad, 7.0, 0, -11); R.add(lad);
  },
  // S4: "Eight posts, two hours forty-three." eight post cards pinned along a line under a clock showing 2:43
  posts8(R) {
    floor(R, 120, 120, stoneTex("#6a6a98", "", [14, 14]), -30);
    const tw = new THREE.Group(); tw.add(box(8, 26, 8, brickTex("#8a4a5a", "", [3, 6]) as any, 0, 13, 0)); tw.add(box(9, 1, 9, lam("#3a2a3a"), 0, 26.5, 0)); const rf = new THREE.Mesh(new THREE.ConeGeometry(7, 7, 4), lam("#3a2a50")); rf.position.y = 30.5; rf.rotation.y = Math.PI / 4; tw.add(rf); place(tw, 0, 0, -26); R.add(tw);
    clock(R, "2:43", 0, 20, -21.8, 3.0); glowAt(R, 0, 20, -21, 18, "#ffe8a8");
    const poleA = new THREE.Vector3(-8.5, 5.8, -10), poleB = new THREE.Vector3(8.5, 5.8, -10);
    R.add(box(0.25, 6, 0.25, lam("#5a3a24"), poleA.x, 3, poleA.z)); R.add(box(0.25, 6, 0.25, lam("#5a3a24"), poleB.x, 3, poleB.z));
    for (let s = 0; s < 24; s++) { const t0 = s / 24, t1 = (s + 1) / 24, p0 = new THREE.Vector3().lerpVectors(poleA, poleB, t0), p1 = new THREE.Vector3().lerpVectors(poleA, poleB, t1); p0.y -= Math.sin(Math.PI * t0) * 0.7; p1.y -= Math.sin(Math.PI * t1) * 0.7; beam(R, p0, p1, "#d8c8a8", 0.03, 0.7); }
    const stamps = ["+0", "+33", "+1H", "+1H27", "+2H15", "+2H18", "+2H43", "+2H43"];
    for (let i = 0; i < 8; i++) { const t = (i + 0.7) / 9.4, x = poleA.x + (poleB.x - poleA.x) * t, y = poleA.y - Math.sin(Math.PI * t) * 0.7 - 1.1; const c = paperCard((g, w, h) => { g.fillStyle = "#e8243e"; g.font = "bold 40px Anton"; g.textAlign = "center"; g.fillText(stamps[i], w / 2, 52); g.fillStyle = "#5a5a7a"; for (let k = 0; k < 5; k++) g.fillRect(14, 70 + k * 16, 60 + rnd(i * 5 + k) * 52, 8); }, 1.5, 1.9, (rnd(i) - 0.5) * 0.1); c.position.set(x, y, -9.9); c.userData.rv = 0.04 + i * 0.1; const pn = box(0.1, 0.35, 0.05, lam("#8a6a44"), x, y + 1.0, -9.88); pn.userData.rv = c.userData.rv; R.add(c, pn); glowAt(R, x, y, -9.5, 3, "#fff0c8"); }
    for (let i = 0; i < 7; i++) R.add(P.at(P.crate(0.7 + rnd(i) * 0.4, ["#8a6a44", "#6a5240", "#a8844a"][i % 3]), -7 + i * 2.3, 0, -7 - rnd(i + 3) * 2)); { const bn = new THREE.Group(); bn.add(box(2.4, 0.15, 0.7, lam("#6a4630"), 0, 0.5, 0)); bn.add(box(2.4, 0.7, 0.12, lam("#6a4630"), 0, 0.9, -0.3)); for (const sx of [-1, 1]) bn.add(box(0.12, 0.5, 0.6, lam("#3a2a24"), sx * 1.0, 0.25, 0)); place(bn, 3.6, 0, -4.4); R.add(bn); }
    for (const [x, z] of [[-12, -8], [12, -8], [-4, -3], [5, -2]]) { R.add(P.at(P.lamppost(4.8), x, 0, z)); glowAt(R, x, 4.8, z, 5, "#ffcf8a"); }
    R.add(P.stars(300, 7, 400, 0.08, 2.4)); R.add(P.at(P.moon(10, [-90, 70, -160])));
  },
  // S5: "The title borrows from Death Note, where a name in a notebook kills." a thread title card, a black notebook, a pen writing, a candle going out
  notebookdesk(R) {
    floor(R, 24, 24, planksTex("#3a2418", "", [4, 4]), -6); R.add(box(24, 11, 0.4, plaster("#3a2a5a", 5, 2), 0, 5.5, -12)); wain(R, 24, -12, "#1f1a3a", "#8a7aa8"); R.add(box(0.4, 11, 24, plaster("#34244a", 4, 2), -12, 5.5, -6)); R.add(box(0.4, 11, 24, plaster("#34244a", 4, 2), 12, 5.5, -6)); win(R, -4.5, 6.2, -11.7, 3.2, 4.4, "#4a5ab8"); R.add(P.at(P.bookshelf(4, 6, 36), 5.5, 0, -11.5)); glowAt(R, -4.5, 6.2, -11, 12, "#7a8aff");
    const tb = new THREE.Group(); tb.add(box(7, 0.3, 4, lam("#3a2418"), 0, 1.0, 0)); for (const [x, z] of [[-3.2, -1.7], [3.2, -1.7], [-3.2, 1.7], [3.2, 1.7]]) tb.add(box(0.3, 1.0, 0.3, lam("#2a1810"), x, 0.5, z)); place(tb, 0, 0, -6); R.add(tb);
    const nb = new THREE.Group(); nb.add(box(3.0, 0.1, 2.0, lam("#0a0612"), 0, 0, 0)); for (const sx of [-1, 1]) { nb.add(box(1.4, 0.05, 1.8, lam("#efe8ff"), sx * 0.75, 0.08, 0)); for (let i = 0; i < 10; i++) nb.add(box(0.7 + rnd(i + sx) * 0.4, 0.01, 0.035, lam("#2a1a4a"), sx * 0.75 - 0.1, 0.11, -0.78 + i * 0.16)); } nb.add(box(0.06, 0.16, 2.0, lam("#c8243e"), 0, 0.05, 0)); const nm = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), new THREE.MeshBasicMaterial({ map: canvasTex(256, 80, (g) => { g.clearRect(0, 0, 256, 80); g.strokeStyle = "#c8243e"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(10, 50); g.bezierCurveTo(40, 6, 70, 74, 100, 30); g.bezierCurveTo(130, 6, 150, 70, 190, 34); g.bezierCurveTo(210, 20, 230, 50, 246, 40); g.stroke(); }), transparent: true, color: new THREE.Color(2, 2, 2) })); nm.rotation.x = -Math.PI / 2; nm.position.set(0.75, 0.13, 0.2); noink(nm); nb.add(nm); place(nb, 0, 1.22, -6); nb.rotation.y = 0.25; nb.scale.setScalar(1.2); R.add(nb);
    const cl = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 2.0), [lam('#0a0612'), lam('#0a0612'), new THREE.MeshBasicMaterial({ map: textTex(256, 340, '#0a0612', '#f2f2ff', ['DEATH', 'NOTE'], 'Anton', 70, '#f2f2ff'), color: new THREE.Color(1.3, 1.3, 1.3) }), lam('#0a0612'), lam('#0a0612'), lam('#0a0612')]); cl.position.set(-2.6, 1.34, -5.6); cl.rotation.y = 0.4; R.add(cl);
    const pen = new THREE.Group(); pen.add(cyl(0.04, 0.04, 1.4, lam("#c0b0ff"), 0, 0, 0, 8)); pen.add(cyl(0.0, 0.04, 0.2, lam("#e8e0ff"), 0, -0.8, 0, 8)); pen.rotation.z = 0.6; place(pen, 0.9, 1.72, -5.95); R.add(pen);
    const title = paperCard((g, w, h) => { g.fillStyle = "#14102a"; g.fillRect(8, 10, w - 16, 44); g.fillStyle = "#ffffff"; g.font = "bold 22px Anton"; g.textAlign = "center"; g.fillText("DEATH NOTE", w / 2, 42); g.fillStyle = "#8a8aa8"; for (let k = 0; k < 4; k++) g.fillRect(14, 72 + k * 16, 70 + rnd(k * 3) * 40, 8); g.fillStyle = "#e8243e"; g.fillRect(14, 148, 40, 10); }, 2.0, 2.6, -0.1); title.position.set(-1.45, 2.2, -5.0); title.rotation.y = 0.4; R.add(title); glowAt(R, -2.4, 2.1, -4.8, 4, "#ffe8c0");
    const candle = new THREE.Group(); candle.add(cyl(0.18, 0.2, 0.9, lam("#efe6cf"), 0, 0.45, 0, 12)); const fl = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.9, 0.9, 0.12) })); fl.position.y = 1.1; noink(fl); candle.add(fl); fl.userData.rvOff = 0.62; candle.userData.flame = fl; place(candle, 1.5, 1.15, -4.6); candle.scale.setScalar(0.9); R.add(candle); glowAt(R, 1.5, 2.8, -4.3, 10, "#ff9a4a");
    glowAt(R, 0, 4, -6, 18, "#6a3aca"); const lec = new THREE.Group(); lec.add(box(1.3, 2.6, 1.3, stoneTex("#8a8aa8", "", [1, 2]) as any, 0, 1.3, 0)); place(lec, 5.2, 0, -7); R.add(lec); for (let i = 0; i < 5; i++) R.add(box(1.0 + rnd(i) * 0.3, 0.22, 0.8, lam(["#5a2a5a", "#2a3a6a", "#6a3a2a", "#2a5a4a", "#7a6a2a"][i]), 5.2, 2.7 + i * 0.22, -7)); 
    for (let i = 0; i < 16; i++) { const pg = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.65), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.25, 1.5), side: THREE.DoubleSide })); pg.position.set((rnd(i) - 0.5) * 9, 2.4 + rnd(i + 3) * 4.5, -6 + (rnd(i + 5) - 0.5) * 4); pg.rotation.set(rnd(i) * 3, rnd(i + 2) * 3, rnd(i + 4) * 3); noink(pg); R.add(pg); }
    
  },
  // S6: "He'd been silent a week. His last thread was archived." a calendar with seven days crossed off and a folder stamped into an archive box
  archive(R) {
    floor(R, 18, 18, planksTex("#6a5a48", "", [4, 4]), -2);
    R.add(box(18, 9, 0.4, plaster("#5a7a5a", 5, 2), 0, 4.5, -8)); wain(R, 18, -8, "#3a4a3a", "#d8d0b8");
    const cal = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), new THREE.MeshBasicMaterial({ map: canvasTex(512, 512, (g) => { g.fillStyle = "#f4efe4"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#c8243e"; g.fillRect(0, 0, 512, 80); g.strokeStyle = "#8a8a98"; g.lineWidth = 3; for (let i = 0; i <= 7; i++) { g.beginPath(); g.moveTo(i * 73, 90); g.lineTo(i * 73, 512); g.stroke(); } for (let j = 0; j <= 5; j++) { g.beginPath(); g.moveTo(0, 90 + j * 84); g.lineTo(512, 90 + j * 84); g.stroke(); } g.strokeStyle = "#c8243e"; g.lineWidth = 9; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(i * 73 + 10, 100); g.lineTo(i * 73 + 63, 166); g.moveTo(i * 73 + 63, 100); g.lineTo(i * 73 + 10, 166); g.stroke(); } }) })); cal.position.set(-3.0, 4.2, -7.7); R.add(cal); R.add(box(4.7, 4.7, 0.1, lam("#3a2a20"), -3.0, 4.2, -7.82));
    for (const x of [1.4, 4.4]) { const sh = new THREE.Group(); sh.add(box(2.6, 6, 1.0, lam("#7a8a9a"), 0, 3, 0)); for (let r = 0; r < 4; r++) { sh.add(box(2.5, 0.08, 1.0, lam("#4a5a6a"), 0, 0.3 + r * 1.5, 0.02)); for (let i = 0; i < 3; i++) sh.add(box(0.7, 0.9, 0.8, lam(["#b79a6a", "#a58858", "#c4a878"][(i + r) % 3]), -0.8 + i * 0.8, 0.8 + r * 1.5, 0.05)); } place(sh, x, 0, -7); R.add(sh); }
    const tb = P.desk(2.6, 1.2, "#6a4a30"); tb.position.set(-0.4, 0, -4.2); R.add(tb);
    const fo = P.folder("#c8a45a"); fo.position.set(-0.8, 0.96, -4.2); fo.scale.setScalar(2); R.add(fo);
    const ab = new THREE.Group(); ab.add(box(1.4, 0.8, 1.0, lam("#b79a6a"), 0, 0.4, 0)); ab.add(box(1.5, 0.08, 1.1, lam("#a58858"), 0, 0.82, 0)); const lb = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshBasicMaterial({ map: textTex(256, 128, "#e8d49a", "#8a1a2a", ["ARCHIVED"], "Anton", 64, "#8a1a2a") })); lb.position.set(0, 0.45, 0.52); ab.add(lb); place(ab, 0.7, 0.96, -4.2); R.add(ab);
    const st = new THREE.Group(); st.add(box(0.7, 0.3, 0.7, lam("#2a1a1a"), 0, 0, 0)); st.add(cyl(0.12, 0.12, 0.7, lam("#6a3a24"), 0, 0.5, 0, 10)); place(st, -2.0, 1.2, -4.2); R.add(st);
    lampHang(R, 0, 6.2, -4.5, "#ffd58a", 9); lampHang(R, 6, 6.4, -5, "#ffd58a", 7);
    for (let i = 0; i < 30; i++) glowAt(R, (rnd(i) - 0.5) * 12, 0.5 + rnd(i + 3) * 5, -6 + rnd(i + 8) * 4, 0.1, "#ffe8b0");
  },
  // S7: "real life, no results, boredom, the feds": four small scenes in a row
  guesses(R) {
    floor(R, 80, 40, lam("#2a2a5a"), -6);
    const stage = new THREE.Group(); stage.add(box(7, 0.6, 7, lam("#4a3a6a"), -3.6, 0.7, 0)); stage.add(box(7, 0.6, 7, lam("#3a5a8a"), 3.6, 0.7, 0)); stage.add(box(7, 0.6, 7, lam("#3a5a8a"), -3.6, 9.7, 0)); stage.add(box(7, 0.6, 7, lam("#4a3a6a"), 3.6, 9.7, 0)); place(stage, 0, 0, -6); R.add(stage);
    const X = [-3.6, 3.6, -3.6, 3.6], Y = [10.0, 10.0, 1.0, 1.0];
    // 1 real life: a house and a person with a briefcase on a road
    { const g = new THREE.Group(); g.add(box(2.8, 2.2, 2.4, lam("#e8c86a"), 0, 1.4, 0)); const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 4), lam("#b04a3a")); roof.position.y = 3.1; roof.rotation.y = Math.PI / 4; g.add(roof); g.add(box(0.6, 1.2, 0.1, lam("#6a3a24"), 0, 0.9, 1.25)); g.add(box(3.2, 0.1, 5, lam("#5a5a6a"), 1.4, 0.65, 0)); const pr = new THREE.Group(); pr.add(box(0.4, 0.9, 0.25, lam("#2f6aa8"), 0, 0.6, 0)); pr.add(sphere(0.2, lam("#f0d0b0"), 0, 1.25, 0)); pr.add(box(0.35, 0.28, 0.12, lam("#6a3a24"), 0.3, 0.5, 0)); place(pr, 2.2, 0.7, 1.6); g.add(pr); g.scale.setScalar(1.9); place(g, X[0], Y[0] + 1.2, -6); R.add(g); glowAt(R, X[0], Y[0] + 2.4, -4, 7, "#ffd58a"); }
    // 2 no results: a scoreboard reading 0
    { const g = new THREE.Group(); g.add(box(3.6, 2.4, 0.4, lam("#1a1a2a"), 0, 2.2, 0)); g.add(box(0.2, 2.0, 0.2, lam("#3a3a4a"), -1.5, 1.0, 0)); g.add(box(0.2, 2.0, 0.2, lam("#3a3a4a"), 1.5, 1.0, 0)); const sc = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.0), new THREE.MeshBasicMaterial({ map: textTex(256, 160, "#04100a", "#ff4a3a", ["0"], "Anton", 140), color: new THREE.Color(1.6, 1.6, 1.6) })); sc.position.set(0, 2.2, 0.22); g.add(sc); g.scale.setScalar(1.8); place(g, X[1], Y[1] + 1.2, -6); R.add(g); glowAt(R, X[1], Y[1] + 2.2, -5, 7, "#ff4a3a"); }
    // 3 boredom: a person yawning on a couch with a big clock
    { const g = new THREE.Group(); g.add(P.at(P.couch("#7a4a68"), 0, 0, 0)); const pr = new THREE.Group(); pr.add(box(0.5, 0.7, 0.3, lam("#3aa0a0"), 0, 0.6, 0)); pr.add(sphere(0.26, lam("#f0d0b0"), 0, 1.15, 0)); pr.add(sphere(0.12, lam("#3a1a2a"), 0, 1.08, 0.24)); place(pr, 0, 0.6, 0.1); g.add(pr); const ck = clock(g, "6:00", 0, 4, -1.2, 1.2); void ck; g.scale.setScalar(1.9); place(g, X[2], Y[2] + 1.2, -6); R.add(g); glowAt(R, X[2], Y[2] + 2.4, -4.6, 6, "#ffe8a8"); }
    // 4 the feds: two men in black with hats and shades beside a black car
    { const g = new THREE.Group(); const car = new THREE.Group(); car.add(box(3.4, 0.8, 1.5, lam("#0a0814"), 0, 0.8, 0)); car.add(box(1.8, 0.7, 1.4, lam("#14102a"), -0.2, 1.5, 0)); for (const x of [-1.1, 1.1]) car.add(cyl(0.35, 0.35, 1.7, lam("#1a1a22"), x, 0.45, 0, 14)).rotation.x = 0; (car.children[2] as THREE.Object3D).rotation.x = Math.PI / 2; (car.children[3] as THREE.Object3D).rotation.x = Math.PI / 2; g.add(car); for (const dx of [-0.9, 0.9]) { const mb = new THREE.Group(); mb.add(box(0.5, 1.2, 0.3, lam("#0a0814"), 0, 0.6, 0)); mb.add(sphere(0.22, lam("#d8c0a8"), 0, 1.45, 0)); mb.add(cyl(0.3, 0.3, 0.05, lam("#0a0814"), 0, 1.65, 0)); mb.add(cyl(0.2, 0.2, 0.2, lam("#0a0814"), 0, 1.75, 0)); mb.add(box(0.34, 0.07, 0.05, lam("#000000"), 0, 1.48, 0.2)); place(mb, dx, 0, 1.6); g.add(mb); } g.scale.setScalar(1.7); place(g, X[3], Y[3] + 1.2, -6); R.add(g); }
    const MB = (c: string) => new THREE.MeshBasicMaterial({ color: c });
    R.add(box(34, 44, 0.4, MB("#5a3a88"), 0, 9, -10.4)); R.add(box(15.6, 19.8, 0.3, MB("#f4ead2"), 0, 9.9, -10.1));
    for (let q = 0; q < 4; q++) {
      const px = X[q], py = Y[q], bg = ["#f8dc98", "#9cc8f8", "#f4a8c8", "#a8b8e0"][q], fl = ["#c8a060", "#6a8ac8", "#b86a8a", "#6a7a98"][q];
      R.add(box(6.6, 8.4, 0.3, MB(bg), px, py + 4.2, -9.6));                       // cubby back wall
      R.add(box(6.6, 0.5, 5.5, MB(fl), px, py + 0.25, -6.9));                      // floor
      R.add(box(0.3, 8.4, 5.5, MB("#f4ead2"), px - 3.2, py + 4.2, -6.9)); R.add(box(0.3, 8.4, 5.5, MB("#f4ead2"), px + 3.2, py + 4.2, -6.9)); // side walls
      R.add(box(6.9, 0.3, 5.7, MB("#f4ead2"), px, py + 8.55, -6.9));               // ceiling
      for (let k = 0; k < 4; k++) R.add(box(0.5 + rnd(k + q) * 0.4, 0.5 + rnd(k + q + 3) * 0.6, 0.5, lam(["#e8453c", "#3aa0a0", "#ffe04a", "#7a5ac8"][(k + q) % 4]), px - 2.4 + k * 1.6, py + 0.8, -4.6));
      glowAt(R, px, py + 5, -5.5, 8, "#fff0c8");
    }
    R.add(P.stars(300, 5, 400, -0.1, 2.4));
  },
  // S8a: "three of eight": eight big boxes with check marks, three checked
  eightboxes(R) {
    floor(R, 24, 20, planksTex("#7a4a30", "", [5, 4]), -6);
    R.add(box(24, 11, 0.4, plaster("#c8902a", 6, 2), 0, 5.5, -11)); wain(R, 24, -11, "#7a2a3a", "#f4ead2"); R.add(box(0.4, 11, 20, plaster("#b8801a", 4, 2), -12, 5.5, -6)); R.add(box(0.4, 11, 20, plaster("#b8801a", 4, 2), 12, 5.5, -6));
    R.add(box(11.2, 6.6, 0.5, lam("#3a2218"), 0, 4.4, -10.4)); R.add(box(10.6, 6.0, 0.2, lam("#2a1a14"), 0, 4.4, -10.1));
    for (let i = 0; i < 8; i++) { const on = i === 1 || i === 4 || i === 6, g = new THREE.Group(); g.add(box(2.1, 2.1, 0.3, lam(on ? "#2fa860" : "#e8e4f4"), 0, 0, 0)); const t = canvasTex(128, 128, (c) => { c.clearRect(0, 0, 128, 128); c.strokeStyle = on ? "#ffffff" : "#c8243e"; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); if (on) { c.moveTo(24, 66); c.lineTo(54, 98); c.lineTo(104, 30); } else { c.moveTo(30, 30); c.lineTo(98, 98); c.moveTo(98, 30); c.lineTo(30, 98); } c.stroke(); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), new THREE.MeshBasicMaterial({ map: t, transparent: true })); m.position.z = 0.17; g.add(m); const gx = -3.6 + (i % 4) * 2.4, gy = i < 4 ? 6.0 : 3.1; place(g, gx, gy, -9.8); R.add(g); if (on) glowAt(R, gx, gy, -9.2, 4.5, "#58ffa0"); }
    for (const s of [-1, 1]) { R.add(box(1.6, 8.4, 0.3, lam("#9a1a3a"), s * 6.9, 4.8, -10.6)); R.add(box(1.0, 8.4, 0.3, lam("#7a1230"), s * 5.9, 4.8, -10.5)); }
    for (let i = 0; i < 4; i++) { const sp = new THREE.SpotLight("#ffe0a0", 40, 16, 0.5, 0.6); sp.position.set(-3.6 + i * 2.4, 9, -4); sp.target.position.set(-3.6 + i * 2.4, 4.5, -9.8); R.add(sp, sp.target); }
    lampHang(R, -4, 8.6, -6, "#ffd58a", 9); lampHang(R, 4, 8.6, -6, "#ffd58a", 9); rugAt(R, rugTex("#7a2a4a", "#e8b86a"), 14, 6, 0, 0.03, -6);
    for (let i = 0; i < 12; i++) { const fl = box(0.6, 0.45, 0.02, lam(["#e8453c", "#ffe04a", "#3aa0a0", "#d85a8a"][i % 4]), -5.5 + i * 1.0, 9.6 - Math.sin(i / 11 * Math.PI) * 0.4, -9.5); fl.rotation.z = (i % 2 ? 1 : -1) * 0.3; R.add(fl); }
    R.add(P.at(P.chair("#8a3a3a"), -7, 0, -5)); R.add(P.at(P.chair("#8a3a3a"), 7, 0, -5)); plant(R, -9, -8, 1.6); plant(R, 9, -8, 1.6);
    const dk = P.desk(4.2, 1.6, "#6a4630"); dk.position.set(0, 0, -3.2); R.add(dk); const cb = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), new THREE.MeshBasicMaterial({ map: canvasTex(128, 170, (g) => { g.fillStyle = '#f5eee0'; g.fillRect(0, 0, 128, 170); g.fillStyle = '#2fa860'; g.font = 'bold 40px Anton'; g.fillText('3/8', 30, 50); g.fillStyle = '#8a8aa8'; for (let k = 0; k < 6; k++) g.fillRect(14, 70 + k * 16, 60 + (k * 31) % 50, 8); }) })); cb.position.set(0.3, 1.0, -3.0); cb.rotation.x = -1.2; R.add(cb);
    const an = new THREE.Group(); an.add(box(0.7, 1.1, 0.4, lam('#3aa0a0'), 0, 0.75, 0)); an.add(sphere(0.32, lam('#f0d0b0'), 0, 1.6, 0)); for (const sx of [-1, 1]) { an.add(sphere(0.05, new THREE.MeshBasicMaterial({ color: '#14102a' }), sx * 0.12, 1.65, 0.3)); an.add(box(0.14, 0.5, 0.14, lam('#3aa0a0'), sx * 0.5, 1.3, 0)); } an.add(box(0.16, 0.05, 0.02, new THREE.MeshBasicMaterial({ color: '#8a1a2a' }), 0, 1.5, 0.33)); place(an, -2.0, 0.3, -2.4); an.scale.setScalar(1.3); R.add(an);
  },
  // S9: "a book ... influencing people from a distance": the paperback on a plinth with threads across a map to tiny far-away figures
  bookmap(R) {
    floor(R, 40, 40, planksTex("#5a3a28", "", [6, 6]), -10); R.add(box(40, 14, 0.4, plaster("#6a3a58", 6, 2), 0, 7, -26)); wain(R, 40, -26, "#3a2040", "#d8c8a8"); for (const sx of [-1, 1]) R.add(P.at(P.bookshelf(5, 8, 40), sx * 14, 0, -25)); lampHang(R, -8, 8.5, -14, "#ffd58a", 12); lampHang(R, 8, 8.5, -14, "#ffd58a", 12);
    for (const [lx, lz] of [[-17, -2], [17, -2], [-17, -22], [17, -22]]) R.add(box(1.2, 1.0, 1.2, lam("#3a2a24"), lx, 0.5, lz));
    const map = P.worldMap(36, "#d8c08a", "#8a6a3a"); map.rotation.x = -Math.PI / 2; map.position.set(0, 1.04, -14); R.add(map); for (const [tx, tz] of [[-17, -8], [17, -8], [-17, -20], [17, -20]]) R.add(box(0.7, 1.0, 0.7, lam("#4a2a1c"), tx, 0.5, tz)); R.add(box(36.6, 0.3, 18.6, lam("#4a2a1c"), 0, 0.85, -14));
    const pl = new THREE.Group(); pl.add(box(1.8, 1.4, 1.8, lam("#3a2a4a"), 0, 0.7, 0)); pl.add(box(2.0, 0.12, 2.0, lam("#5a4a6a"), 0, 1.46, 0)); place(pl, 0, 1.0, -3.4); R.add(pl);
    const bk = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.2), [lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), new THREE.MeshBasicMaterial({ map: textTex(256, 360, "#5a2a5a", "#e8d49a", ["THE", "FORBIDDEN", "PARA-", "PSYCHOLOGY"], "Anton", 48, "#e8d49a"), color: new THREE.Color(1.3, 1.3, 1.3) }), lam("#2b2540")]); bk.position.set(0, 3.3, -3.4); bk.rotation.x = -0.1; R.add(bk); glowAt(R, 0, 2.4, -3.0, 8, "#ffd58a");
    const sp = new THREE.SpotLight("#ffd8a0", 70, 12, 0.45, 0.6); sp.position.set(0, 7, -2); sp.target.position.set(0, 1.5, -3.4); R.add(sp, sp.target);
    for (let i = 0; i < 26; i++) { const hx = (rnd(i) - 0.5) * 30, hz = -8 - rnd(i + 4) * 14; R.add(box(0.5, 0.4, 0.5, lam(["#c85a3a", "#3a7a5a", "#7a5ac8"][i % 3]), hx, 0.25, hz)); const rf = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.3, 4), lam("#7a2a2a")); rf.position.set(hx, 0.6, hz); rf.rotation.y = Math.PI / 4; R.add(rf); }
    const spots: [number, number][] = [[-12, -10], [-6, -20], [9, -9], [14, -18], [2, -24], [-16, -17]];
    spots.forEach(([x, z], i) => { const f = new THREE.Group(); f.add(box(0.5, 0.9, 0.3, lam(["#e8c24a", "#3aa0a0", "#d85a6a", "#7a8ad8", "#58b868", "#c8a070"][i]), 0, 0.55, 0)); f.add(sphere(0.25, lam("#f0d0b0"), 0, 1.2, 0)); for (const ex of [-0.08, 0.08]) f.add(sphere(0.035, new THREE.MeshBasicMaterial({ color: "#14102a" }), ex, 1.24, 0.22)); f.add(box(0.12, 0.02, 0.02, new THREE.MeshBasicMaterial({ color: "#8a1a2a" }), 0, 1.12, 0.24)); f.scale.setScalar(2.4); place(f, x, 1.12, z); R.add(f); beam(R, new THREE.Vector3(0, 3.3, -3.4), new THREE.Vector3(x, 2.3, z), "#b87aff", 0.03, 2); glowAt(R, x, 2.3, z, 3, "#a86aff"); });
    outdoor(R, { z: -120, rocks: 0, tufts: 0 }); R.add(P.stars(300, 14, 400, 0.05, 2.4));
  },
};
