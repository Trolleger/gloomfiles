// EP01 v8 worlds: built for the approved v8 script, one literal place per line, using the Kenney CC0 kits (Nature, Furniture, Graveyard).
import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex, lamTex } from "../mats";
import * as P from "../props";
import { rnd } from "../props/util";
import { NOINK } from "../ink";
import { R, place, floor, glowAt, win, plant, plaster, wain, rugAt, sign, clock, checkTex } from "./worlds";
import { planksTex, stoneTex, groundTex, rugTex, textTex } from "./tex";
import { rep, ctex, facadeHD, roofHD, grassHD } from "./paint";
import { kit, at } from "./kit";

const noink = (o: THREE.Object3D) => { o.traverse((c) => c.layers.set(NOINK)); return o; };
const MB = (c: string, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) });
const add = (R: R, ...o: THREE.Object3D[]) => { o.forEach((x) => R.add(x)); };
const beamLine = (R: R, a: THREE.Vector3, b: THREE.Vector3, c: string, r = 0.07, k = 2.2, solid = false) => { const d = new THREE.Vector3().subVectors(b, a), L = d.length(), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), transparent: !solid, opacity: solid ? 1 : 0.85, fog: false })); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); noink(m); R.add(m); return m; };
/** a cartoon person (no face detail beyond dots): body colour, scale, optional arms-up */
const person = (c: string, s = 1, o: { arms?: boolean; face?: boolean; hat?: string } = {}) => {
  const g = new THREE.Group(); const body = sphere(0.36, lam(c)); body.scale.set(0.9, 1.15, 0.7); body.position.y = 1.15; g.add(body);
  for (const x of [-0.12, 0.12]) { const l = cyl(0.035, 0.035, 0.7, lam("#241726"), x, 0.38, 0, 6); g.add(l); g.add(sphere(0.07, lam("#241726"), x, 0.04, 0.05)); }
  const head = sphere(0.3, lam("#f4d8b8")); head.scale.set(0.92, 1.05, 0.9); head.position.y = 1.95; g.add(head);
  if (o.face !== false) { for (const x of [-0.1, 0.1]) { g.add(sphere(0.055, MB("#ffffff"), x, 2.0, 0.24)); g.add(sphere(0.028, MB("#14102a"), x, 2.0, 0.29)); } g.add(box(0.12, 0.025, 0.02, MB("#8a1a2a"), 0, 1.84, 0.27)); }
  for (const x of [-1, 1]) { const a = cyl(0.03, 0.03, 0.7, lam("#241726"), x * 0.4, o.arms ? 1.7 : 1.05, 0, 6); a.rotation.z = o.arms ? x * 0.7 : x * 0.12; g.add(a); g.add(sphere(0.06, lam("#241726"), x * 0.55, o.arms ? 2.0 : 0.7, 0)); }
  if (o.hat) g.add(cyl(0.3, 0.3, 0.1, lam(o.hat), 0, 2.24, 0, 12));
  g.scale.setScalar(s * 0.9); return g;
};
const townHouses = (R: R, z: number, n: number, seed = 0, span = 90) => { for (let i = 0; i < n; i++) { const ww = 5 + rnd(i + seed) * 2.5, hh = 5 + rnd(i + seed + 2) * 3, dd = 4.5, tex = lamTex(rep(facadeHD("t" + ((i + seed) % 5), ww, hh, { wall: ["#d8b88a", "#c8a0a0", "#a8b8c8", "#c8c88a", "#b8a0c8"][(i + seed) % 5], shutter: ["#3a5a8a", "#8a3a3a", "#3a7a5a", "#7a5a2a", "#5a3a7a"][(i + seed) % 5], door: i % 2 === 0, timber: i % 3 === 0 }), 1, 1)); const h = new THREE.Group(); h.add(box(ww, hh, dd, tex, 0, hh / 2, 0)); const rf = new THREE.Mesh(new THREE.ConeGeometry(ww * 0.78, 2.6, 4), lamTex(rep(roofHD(["#9a4a3a", "#5a4a7a", "#3a5a7a"][i % 3]), 2, 1))); rf.position.y = hh + 1.3; rf.rotation.y = Math.PI / 4; rf.scale.z = dd / ww * 1.25; h.add(rf); h.position.set(-span / 2 + i * (span / n) + rnd(i + 6) * 2, 0, z - rnd(i + 8) * 5); R.add(h); for (let w = 0; w < 3; w++) if (rnd(i * 5 + w + seed) > 0.4) glowAt(R, h.position.x + (w - 1) * 1.6, 2.4 + rnd(w) * 2, h.position.z + 2.4, 1.6, "#ffcf8a"); } };
const pines = (R: R, n: number, x0: number, x1: number, z0: number, z1: number, seed = 0, names = ["tree_pineDefaultA", "tree_pineTallB", "tree_pineRoundA", "tree_pineSmallA"]) => { for (let i = 0; i < n; i++) R.add(at(kit("nature", names[i % names.length], 4 + rnd(i + seed) * 5), x0 + rnd(i + seed + 1) * (x1 - x0), 0, z0 + rnd(i + seed + 3) * (z1 - z0), rnd(i) * 6)); };
const nightSky = (R: R, moon = [-80, 70, -200] as [number, number, number], seed = 1) => { R.add(P.stars(300, seed, 400, 0.08, 2.4)); R.add(P.at(P.moon(10, moon))); };
const cloudsAt = (R: R, y: number, c: string, z = -150, n = 9) => { for (let i = 0; i < n; i++) { const s = P.glowSprite(c, 50 + rnd(i) * 40); s.position.set(-200 + i * 50, y + rnd(i + 3) * 25, z - rnd(i + 5) * 60); R.add(s); } };
const roomShell = (R: R, o: { w?: number; d?: number; h?: number; wall: string; trim: string; floorTex?: THREE.Material; z?: number }) => { const w = o.w ?? 16, d = o.d ?? 14, h = o.h ?? 9, z0 = o.z ?? -7;
  floor(R, w, d, o.floorTex ?? planksTex("#6a4a30", "", [4, 4]), z0 + d / 2 - 1); R.add(box(w, h, 0.4, plaster(o.wall, 5, 2), 0, h / 2, z0)); wain(R, w, z0, o.trim, "#f4ead2"); R.add(box(0.4, h, d, plaster(o.wall, 4, 2), -w / 2, h / 2, z0 + d / 2)); R.add(box(0.4, h, d, plaster(o.wall, 4, 2), w / 2, h / 2, z0 + d / 2)); };

import { W2 } from "./worlds2";
export const W4: Record<string, (R: R) => void> = {
  // line 13: the 1942 lab, a visibly frightened volunteer in a chair, a pinned doll, a racing heart monitor
  lab(R) { W2.lab(R); const v = person("#8a8ad8", 1.7, { arms: true }); place(v, 1.0, 0.45, -4.0); v.rotation.y = 0.15; R.add(v); for (let i = 0; i < 4; i++) { const sw = sphere(0.1, MB("#a8e8ff", 1.4), 0.55 + i * 0.3, 3.4 - (i % 2) * 0.3, -3.9); noink(sw); R.add(sw); } },
  // line 1: "A man online says he can curse strangers to death": an anon at a glowing PC, a purple hate-beam out of the window to a night town, one lit window going dark
  deskNight(R) {
    // a rooftop desk high above a night town: the anon at his PC, a purple hate-beam shooting down to a far window that goes dark
    const T = new THREE.Group(); T.position.y = -3; R.add(T);
    floor(T, 300, 300, stoneTex("#6a6a98", "", [40, 40]), -80);
    townHouses(T, -42, 12, 3, 100); pines(T, 10, -40, 40, -18, -32, 2);
    for (const x of [-16, -6, 6, 16]) { T.add(at(kit("graveyard", "lightpost-single", 4.4), x, 0, -15)); glowAt(T, x, 4.4, -15, 5, "#ffcf8a"); }
    [[-8, "#d85a6a"], [-2, "#58b868"], [4, "#e8c24a"], [10, "#7a8ad8"]].forEach(([x, c], i) => { const p = person(c as string, 1.0); place(p, x as number, 0, -13 - (i % 2) * 2); T.add(p); });
    const wd = box(4, 4.8, 0.2, MB("#ffd58a", 1.7), 2.4, 3.4, -39.6); T.add(wd); glowAt(T, 2.4, 3.4, -38.8, 16, "#ffcf8a"); const dk = box(4, 4.8, 0.2, MB("#10102a"), 2.4, 3.4, -39.5); dk.userData.rv = 0.5; T.add(dk); for (let q = 0; q < 14; q++) { const wx = -22 + q * 3.4 + rnd(q) * 1.5; if (Math.abs(wx - 2.4) > 3) T.add(box(1.4, 1.8, 0.2, MB(rnd(q + 5) > 0.5 ? "#ffd58a" : "#2a2a5a", 1.2), wx, 2.6 + rnd(q + 2) * 4, -39.6)); }
    const roof = new THREE.Group(); roof.add(box(9, 0.8, 7, lam("#5a4a6a"), 0, -0.4, 0)); for (let x = -4.2; x <= 4.2; x += 1.4) roof.add(box(0.15, 1.0, 0.15, lam("#2a2a3a"), x, 0.5, 3.3)); roof.add(box(8.6, 0.12, 0.15, lam("#2a2a3a"), 0, 1.0, 3.3)); place(roof, 0, 0, -4); R.add(roof);
    add(R, at(kit("furniture", "desk", 1.0), 0, 0, -5.6), at(kit("furniture", "computerScreen", 0.9), 0, 1.0, -5.7), at(kit("furniture", "computerKeyboard", 0.08), 0, 1.0, -5.2), at(kit("furniture", "chairDesk", 1.4), 0.2, 0, -4.4, 2.9), at(kit("furniture", "lampRoundTable", 0.9), 1.0, 1.0, -5.8), at(kit("furniture", "pottedPlant", 1.2), -3.4, 0, -5.4));
    const an = person("#3a3a6a", 1.5, { face: false }); place(an, 0.1, 0, -4.1); an.rotation.y = Math.PI; R.add(an); glowAt(R, 0, 1.8, -5.2, 6, "#6aa8ff");
    beamLine(R, new THREE.Vector3(0.1, 2.9, -4.1), new THREE.Vector3(2.4, 0.4, -39.5), "#a040ff", 0.9, 1.6, true); for (let q = 0; q < 6; q++) glowAt(R, 0.1 + (2.3) * q / 6, 2.9 - 2.5 * q / 6, -4.1 - 35.4 * q / 6, 5, "#c880ff"); glowAt(R, 0.1, 2.9, -4.1, 12, "#b87aff");
    nightSky(R); cloudsAt(R, 55, "#4a3a9a");
  },
  // line 1b: "it only works when he stops trying": the anon on a floating island, thought bubbles popping, the beam getting stronger
  island(R) {
    const empty = false; void empty; 
    floor(R, 6, 6, MB("#0e0a22"), -200);
    const base = at(kit("nature", "platform_grass", 0.8, 4.0), 0, -0.4, -6); R.add(base);
    const rk = (x: number, y: number, z: number, s: number) => R.add(at(kit("nature", "rock_largeD", 2.4 * s), x, y, z, rnd(x) * 6));
    rk(-4, -3, -8, 1.2); rk(5, -4.5, -10, 1.6); rk(1, -6, -6, 0.9); rk(-7, -8, -14, 2);
    add(R, at(kit("furniture", "desk", 1.0), 0, 0.2, -6), at(kit("furniture", "computerScreen", 0.9), 0, 1.2, -6.1), at(kit("furniture", "chairDesk", 1.4), 0.3, 0.2, -4.7, 2.9), at(kit("furniture", "lampRoundTable", 0.9), 1.0, 1.2, -6.2));
    const an = person("#3a3a6a", 1.05); place(an, 0.2, 0.7, -4.8); an.rotation.y = Math.PI; R.add(an);
    glowAt(R, 0, 2.3, -5.5, 6, "#6aa8ff");
    // thinking bubbles popping, then a bigger beam to a far toy town
    for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.CircleGeometry(0.45 + (i % 3) * 0.12, 20), new THREE.MeshBasicMaterial({ color: "#f4f1ff", transparent: true, opacity: 0.9 })); b.position.set(-1.2 + (i % 3) * 1.3, 3.3 + Math.floor(i / 3) * 1.1 + (i % 2) * 0.4, -5.4); b.userData.rvOff = 0.18 + i * 0.1; noink(b); R.add(b); const tx = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: canvasTex(64, 64, (c) => { c.clearRect(0, 0, 64, 64); c.strokeStyle = "#241726"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); if (i % 3 === 0) { c.moveTo(8, 40); c.bezierCurveTo(10, 8, 54, 8, 56, 40); c.moveTo(20, 50); c.lineTo(44, 50); } else if (i % 3 === 1) { c.moveTo(10, 46); c.lineTo(22, 16); c.lineTo(34, 46); c.lineTo(46, 16); c.lineTo(56, 40); } else { c.arc(32, 28, 16, 0, 7); c.moveTo(32, 46); c.lineTo(32, 56); } c.stroke(); }), transparent: true })); tx.position.set(b.position.x, b.position.y, -5.38); tx.userData.rvOff = b.userData.rvOff; R.add(tx); }
    const b1 = beamLine(R, new THREE.Vector3(0.5, 3.0, -6), new THREE.Vector3(60, 6, -120), "#8a5ae8", 0.05); b1.userData.rvOff = 0.5; b1.scale.x = b1.scale.z = 2.4;
    const b2 = beamLine(R, new THREE.Vector3(0.5, 3.0, -6), new THREE.Vector3(60, 6, -120), "#d89aff", 0.28); b2.userData.rv = 0.5;
    townHouses(R, -130, 8, 1, 60); nightSky(R, [-60, 60, -220], 4); cloudsAt(R, 45, "#5a3aaa", -120);
  },
  // callback: "Now he's stopped everything": the same floating island, empty and dark, the chair pushed back, one comment glowing
  islandEmpty(R) {
    floor(R, 6, 6, MB("#0a0818"), -200);
    R.add(at(kit("nature", "platform_grass", 0.8, 4.0), 0, -0.4, -6));
    const rk = (x: number, y: number, z: number, s: number) => R.add(at(kit("nature", "rock_largeD", 2.4 * s), x, y, z, rnd(x) * 6));
    rk(-4, -3, -8, 1.2); rk(5, -4.5, -10, 1.6); rk(1, -6, -6, 0.9); rk(-7, -8, -14, 2);
    add(R, at(kit("furniture", "desk", 1.0), 0, 0.2, -6), at(kit("furniture", "computerScreen", 0.9), 0, 1.2, -6.1), at(kit("furniture", "chairDesk", 1.4), 1.6, 0.2, -4.4, 2.2));
    const c = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.8), new THREE.MeshBasicMaterial({ map: canvasTex(256, 90, (g, W, H) => { g.fillStyle = "#cfe8ff"; g.fillRect(0, 0, W, H); g.strokeStyle = "#3a6aa8"; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4); g.fillStyle = "#14102a"; g.font = "bold 30px 'Special Elite','Courier New',monospace"; g.fillText("I left a comment.", 14, 56); }), color: new THREE.Color(1.5, 1.5, 1.5) })); c.position.set(-0.6, 3.4, -5.6); R.add(c); glowAt(R, 0, 3.2, -5.2, 8, "#9ad0ff");
    for (let i = 0; i < 40; i++) glowAt(R, (rnd(i) - 0.5) * 14, rnd(i + 3) * 7, -3 - rnd(i + 8) * 6, 0.5, "#8a9aff");
    nightSky(R, [-60, 60, -220], 4);
  },
  // line 2: "He posted in a Death Note thread": a black notebook with white gothic lettering on a stone altar with candles; a thread board behind
  deathNote(R) {
    floor(R, 300, 300, lamTex(rep(grassHD(), 60, 60)), -60);
    pines(R, 26, -30, 30, -12, -40, 6, ["pine-fall", "pine-fall-crooked"]);
    for (let i = 0; i < 26; i++) R.add(at(kit("graveyard", "pine-fall", 5 + rnd(i) * 5), -34 + rnd(i + 2) * 68, 0, -10 - rnd(i + 4) * 34, rnd(i + 6) * 6));
    for (let i = 0; i < 10; i++) R.add(at(kit("graveyard", ["gravestone-cross", "gravestone-round", "gravestone-broken", "gravestone-wide"][i % 4], 1.6), -12 + i * 2.7, 0, -10 - rnd(i + 8) * 4, (rnd(i) - 0.5) * 0.4));
    R.add(at(kit("graveyard", "altar-stone", 1.5, 1.6), 0, 0, -5.4));
    const nb = new THREE.Group(); nb.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.34, 2.0), [MB("#e8e4f4"), MB("#e8e4f4"), new THREE.MeshBasicMaterial({ map: canvasTex(256, 340, (g, W, H) => { g.fillStyle = "#07050d"; g.fillRect(0, 0, W, H); g.strokeStyle = "#f2f2ff"; g.lineWidth = 3; g.strokeRect(14, 14, W - 28, H - 28); g.fillStyle = "#f2f2ff"; g.textAlign = "center"; g.font = "italic 700 62px 'Times New Roman',serif"; g.fillText("DEATH", W / 2, H / 2 - 12); g.fillText("NOTE", W / 2, H / 2 + 56); }), color: new THREE.Color(1.2, 1.2, 1.3) }), lam("#06040c"), MB("#e8e4f4"), MB("#e8e4f4")])); place(nb, 0, 1.82, -5.4); nb.rotation.y = 0.15; nb.scale.setScalar(1.9); R.add(nb);
    for (const [x, z, h] of [[-2.0, -5.4, 0.7], [2.0, -5.4, 0.7], [-1.9, -4.4, 0.5], [1.9, -4.4, 0.5]] as [number, number, number][]) { R.add(at(kit("graveyard", "candle-multiple", h), x, 1.74, z)); { const fl2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 8), MB("#ffb04a", 1.8)); fl2.position.set(x, 1.74 + h + 0.2, z); noink(fl2); R.add(fl2); } glowAt(R, x, 1.74 + h + 0.3, z, 4.5, "#ff9a4a"); }
    const bd = new THREE.Group(); bd.visible = false; bd.add(box(8, 5, 0.3, lam("#5a3a24"), 0, 2.5, 0)); bd.add(box(7.4, 4.4, 0.1, lam("#c8905a"), 0, 2.5, 0.2)); for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.8), new THREE.MeshBasicMaterial({ color: ["#6a6070", "#5a5068"][i % 2] })); c.position.set(-2.8 + (i % 3) * 2.8, 3.4 - Math.floor(i / 3) * 2.1, 0.3); c.rotation.z = (rnd(i) - 0.5) * 0.2; bd.add(c); } place(bd, 0, 0, -12); R.add(bd);
    glowAt(R, 0, 2.9, -4.4, 5, "#7a6aff"); nightSky(R, [60, 80, -180], 9); cloudsAt(R, 60, "#4a3a8a");
  },
  // line 2b: "his blog logs colds, missed buses and, very rarely, death": a street with three vignettes (cold, bus leaving, gravestone with a candle going out)
  logStreet(R) {
    floor(R, 300, 300, stoneTex("#b8b8e0", "", [30, 30]), -60); R.add(at(box(8, 0.05, 160, lam("#5a5a78"), 0, 0.03, -40), 0, 0, 0));
    townHouses(R, -14, 9, 4, 60); townHouses(R, -26, 11, 7, 100); pines(R, 8, -40, 40, -16, -24, 3);
    for (const x of [-22, -8, 8, 22]) { R.add(at(kit("graveyard", "lightpost-single", 4.4), x, 0, -9)); glowAt(R, x, 4.4, -9, 5, "#ffcf8a"); }
    // (a) a cold: a sneezing person with a green puff and a tissue
    const p1 = person("#58b868", 1.5); place(p1, -3.6, 0, -6); R.add(p1); for (let i = 0; i < 10; i++) R.add(sphere(0.28 + rnd(i) * 0.22, new THREE.MeshBasicMaterial({ color: i % 2 ? "#c8ffb0" : "#8ae88a", transparent: true, opacity: 0.75 }), -2.7 + i * 0.3, 2.3 + (rnd(i) - 0.5) * 0.8, -5.5));
    for (let i = 0; i < 4; i++) R.add(box(1.6 - i * 0.3, 0.06, 0.06, MB("#ffffff"), 4.0 + i * 0.5, 0.8 + i * 0.35, -8.2));
    R.add(at(kit("graveyard", "bench", 1.1, 1.5), -1.8, 0, -4.4)); R.add(at(kit("nature", "fence_planks", 1.2, 1.2), -6, 0, -4.6)); R.add(at(kit("nature", "sign", 1.6), 0.6, 0, -4.8)); for (const x of [-5.2, 6.4]) R.add(at(kit("nature", "plant_bushLarge", 1.4), x, 0, -5));
    // (b) missed bus: a bus pulling away, a runner
    const bus = new THREE.Group(); bus.add(box(6.5, 2.2, 2.2, lam("#f2c030"), 0, 1.7, 0)); bus.add(box(6.0, 0.8, 2.26, MB("#bfe8ff"), 0, 2.2, 0)); for (let q = 0; q < 5; q++) bus.add(box(0.06, 0.8, 2.3, lam("#f2c030"), -2.4 + q * 1.2, 2.2, 0)); for (const x of [-2.1, 2.1]) { const wh = cyl(0.62, 0.62, 2.4, lam("#1a1a22"), x, 0.62, 0, 16); wh.rotation.x = Math.PI / 2; bus.add(wh); bus.add(cyl(0.3, 0.3, 2.5, lam("#c8c8d8"), x, 0.62, 0, 10)).rotation.x = Math.PI / 2; } bus.add(box(0.3, 0.5, 1.2, MB("#ff3a2a", 1.4), 3.3, 0.9, 0)); bus.scale.setScalar(0.8); place(bus, 1.8, 0, -4.6); bus.rotation.y = 0.0; R.add(bus);
    const run = person("#e8c24a", 1.4, { arms: true }); place(run, -1.0, 0, -5.4); run.rotation.y = -0.8; R.add(run); R.add(box(0.15, 3.2, 0.15, lam("#7a7a8a"), -0.2, 1.6, -6.1)); R.add(box(1.6, 0.9, 0.08, lam("#e8c24a"), -0.2, 3.0, -6.05));
    // (c) very rarely death, as a nod: a gravestone and a candle going out
    R.add(at(kit("graveyard", "gravestone-cross", 3.4), 4.2, 0, -6)); const cn = at(kit("graveyard", "candle", 1.1), 3.0, 0, -4.8); R.add(cn); const fl = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.34, 8), MB("#ff9a3a", 1.8)); fl.position.set(3.0, 1.35, -4.8); fl.userData.rvOff = 0.7; noink(fl); R.add(fl); glowAt(R, 3.2, 1.1, -4.8, 3.4, "#ff9a4a");
    nightSky(R); cloudsAt(R, 55, "#4a3a9a");
  },
  // line 3: "prints their photo, pisses on it, says their name, wishes the worst, with no thinking, just anger": a bathroom, a printed photo on the tiles, a cartoon yellow stream, red hatred cloud
  bathroom(R) {
    roomShell(R, { w: 12, d: 10, h: 8, wall: "#3a9a98", trim: "#1f5a68", floorTex: checkTex("#c0d0d0", "#8ab0b8"), z: -6 });
    add(R, at(kit("furniture", "toilet", 2.4), -2.4, 0, -5.2), at(kit("furniture", "bathroomSink", 2.4), 2.5, 0, -5.4), at(kit("furniture", "bathroomMirror", 2.4), 2.5, 4.1, -5.6), at(kit("furniture", "trashcan", 1.4), -4.4, 0, -4.4));
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.8), new THREE.MeshBasicMaterial({ map: canvasTex(128, 160, (g, W, H) => { g.fillStyle = "#f5eee0"; g.fillRect(0, 0, W, H); g.fillStyle = "#9ab8d8"; g.fillRect(8, 8, W - 16, H - 36); g.fillStyle = "#5a4a3a"; g.beginPath(); g.arc(64, 62, 26, 0, 7); g.fill(); g.fillRect(34, 88, 60, 40); g.fillStyle = "#14102a"; g.fillRect(48, 56, 8, 8); g.fillRect(72, 56, 8, 8); g.strokeStyle = "#c8243e"; g.lineWidth = 8; g.beginPath(); g.moveTo(8, 8); g.lineTo(W - 8, H - 36); g.stroke(); }) })); ph.rotation.x = -Math.PI / 2; ph.position.set(0, 0.06, -2.6); R.add(ph);
    const an = person("#3a3a6a", 1.15); place(an, 0, 0, -3.9); an.rotation.y = 0; R.add(an);
    R.add(box(9, 4.2, 0.2, MB("#3aa8a0"), 0, 2.1, -5.85)); R.add(box(9, 0.14, 0.3, MB("#f4ead2"), 0, 4.25, -5.8));
    for (let i = 0; i < 16; i++) { const t = i / 15, dr = sphere(0.09, MB("#ffe04a", 1.7), 0.02, 1.05 - 0.9 * t * t - 0.05 * t, -3.7 + 0.9 * t); noink(dr); R.add(dr); }
    for (let i = 0; i < 8; i++) R.add(sphere(0.2 + rnd(i) * 0.14, lam(i % 2 ? "#e8453c" : "#c8243e"), -0.9 + i * 0.27, 2.9 + Math.sin(i * 1.3) * 0.18, -3.7 + (i % 3) * 0.1));
    { const ey = (x: number) => { R.add(sphere(0.2, MB("#ffffff"), x, 3.0, -3.3)); R.add(sphere(0.09, MB("#14102a"), x, 2.98, -3.12)); }; ey(-0.2); ey(0.35); const br = (x: number, r: number) => { const q = box(0.7, 0.12, 0.1, lam("#14102a"), x, 3.3, -3.15); q.rotation.z = r; R.add(q); }; br(-0.25, -0.5); br(0.5, 0.5); }
    R.add(box(3.2, 2.6, 0.12, MB("#cfe8f0", 1.1), 2.5, 4.0, -5.75)); R.add(box(3.5, 2.9, 0.1, lam("#f4ead2"), 2.5, 4.0, -5.8)); R.add(box(1.4, 1.2, 0.1, lam("#f4ead2"), -3.6, 2.4, -5.7)); R.add(box(1.2, 0.2, 0.2, lam("#c8c8d8"), -3.6, 3.1, -5.6)); for (const q of [-0.4, 0.4]) R.add(box(0.5, 1.0, 0.08, lam("#e8453c"), -3.6 + q, 2.5, -5.55));
    glowAt(R, 0, 2.4, -3.4, 16, "#ff3a2a"); R.add(P.at(P.lampDesk("#ff9a7a"), 4.2, 3.0, -5.6));
  },
  // line 4: "ran it like a lab: forty targets, each matched with a control, coded in advance": 40 targets and 40 controls under glass domes, coded tags
  labForty(R) {
    floor(R, 80, 80, checkTex("#7a8a98", "#3a5470"), -14); R.add(box(80, 20, 0.4, plaster("#2f5a88", 8, 2), 0, 10, -40)); for (let q = -6; q <= 6; q++) { R.add(at(kit("furniture", q % 2 ? "bookcaseClosed" : "cabinetTelevision", 3.2), q * 4.2, 0, -38)); } for (let q = 0; q < 14; q++) R.add(cyl(0.3, 0.4, 0.9, new THREE.MeshLambertMaterial({ color: ["#7affc8", "#ff7ab0", "#e8e07a", "#7ab0ff"][q % 4], transparent: true, opacity: 0.8 }), -26 + q * 4, 4.2, -37, 12));
    for (let r = 0; r < 10; r++) for (let c = 0; c < 8; c++) {
      const x = -9 + c * 1.2 + (c >= 4 ? 1.6 : 0), z = -3.5 - r * 2.0, tgt = c < 4, p = person(tgt ? "#d85a6a" : "#58b8c8", 0.62, { face: true });
      place(p, x, 0, z); if (!tgt) { const dome = new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 1.2, 1.6), transparent: true, opacity: 0.5 })); const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 6, 20), MB("#ffffff")); rim.rotation.x = Math.PI / 2; rim.position.set(x, 0.04, z); noink(rim); R.add(rim); dome.position.set(x, 0, z); noink(dome); R.add(dome); }
      R.add(p); const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.3), new THREE.MeshBasicMaterial({ map: textTex(128, 64, tgt ? "#ffe04a" : "#a8ffd8", tgt ? "#8a1a2a" : "#1a5a3a", [(tgt ? "T" : "C") + String(r * 4 + (c % 4) + 1).padStart(2, "0")], "Anton", 44) })); tag.position.set(x, 1.62, z); R.add(tag); tag.userData.rv = (r * 8 + c) / 80 * 0.55;
    }
    const cal = P.calendarPage("OCT", "21"); cal.position.set(0, 5.2, -39.6); cal.scale.setScalar(5); R.add(cal);
    for (let i = 0; i < 8; i++) glowAt(R, -18 + i * 5, 9, -8, 6, "#e8f4ff"); R.add(box(70, 0.5, 0.5, lam("#cfe8e0"), 0, 12, -10));
  },
  // line 6: "Then he went silent for a week": an empty desk, a dead monitor, an empty pushed-back chair, a stopped clock, seven days crossed off
  emptyDesk(R) {
    roomShell(R, { w: 14, d: 12, h: 9, wall: "#2f5a68", trim: "#1f3a48", z: -7 });
    add(R, at(kit("furniture", "desk", 1.0, 1.8), 0, 0, -5.6), at(kit("furniture", "computerScreen", 1.4), 0, 1.8, -5.8), at(kit("furniture", "computerKeyboard", 0.15), 0, 1.8, -5.1), at(kit("furniture", "chairDesk", 2.3), 1.6, 0, -3.4, 2.4), at(kit("furniture", "lampRoundTable", 1.4), -2.8, 1.8, -5.9), at(kit("furniture", "bookcaseClosed", 5.2), -5.4, 0, -6.4), at(kit("furniture", "pottedPlant", 1.8), 5.4, 0, -6.2), at(kit("furniture", "rugRectangle", 0.05), 0.4, 0.03, -3.6), at(kit("furniture", "laptop", 0.4), -1.8, 1.8, -5.2));
    const scr = plane(2.1, 1.3, new THREE.MeshBasicMaterial({ color: "#030306" })); scr.position.set(0, 2.45, -5.74); R.add(scr);
    clock(R, "3:07", -3.0, 6.6, -6.75, 1.0);
    const cal = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: canvasTex(256, 256, (g) => { g.fillStyle = "#f4efe4"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#c8243e"; g.fillRect(0, 0, 256, 40); g.strokeStyle = "#8a8a98"; g.lineWidth = 2; for (let i = 0; i <= 7; i++) { g.beginPath(); g.moveTo(i * 36, 46); g.lineTo(i * 36, 256); g.stroke(); } g.strokeStyle = "#c8243e"; g.lineWidth = 6; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(i * 36 + 5, 52); g.lineTo(i * 36 + 31, 84); g.moveTo(i * 36 + 31, 52); g.lineTo(i * 36 + 5, 84); g.stroke(); } }) })); cal.scale.setScalar(0.8); cal.position.set(0.7, 6.4, -6.75); R.add(cal);
    for (let i = 0; i < 50; i++) glowAt(R, (rnd(i) - 0.5) * 12, 0.4 + rnd(i + 3) * 6, -6 + rnd(i + 8) * 5, 0.12, "#c8d0ff");
    win(R, 6.0, 4.6, -6.7, 2.4, 3.2, "#34406a"); glowAt(R, 6.0, 4.4, -6.2, 8, "#7a8aff");
  },
  // line 7: "an anon wrote 'I didn't think there were others like me'": a second anon in an attic, laptop glow, a faint far window across the roofs
  attic2(R) {
    roomShell(R, { w: 12, d: 10, h: 7, wall: "#6a4a7a", trim: "#3a2a4a", z: -6 });
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), lamTex(rep(ctex("atticroof2", 256, 256, (g, r) => { g.fillStyle = "#7a4a3a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 16; i++) { g.fillStyle = r() > 0.5 ? "#6a3a30" : "#8a5a44"; g.fillRect(0, i * 16, 256, 14); } }), 3, 2))); p.position.set(s * 3.4, 5.2, -2); p.rotation.set(0, s * Math.PI / 2, s * -0.75); R.add(p); }
    for (let i = -3; i <= 3; i++) R.add(box(0.25, 0.25, 10, lam("#3a2418"), i * 1.5, 6.2 - Math.abs(i) * 0.8, -2));
    add(R, at(kit("furniture", "bedSingle", 0.8), -3.2, 0, -4.4), at(kit("furniture", "rugRound", 0.05, 4), 0, 0.03, -2.8), at(kit("furniture", "cardboardBoxClosed", 0.9), 3.2, 0, -4.8), at(kit("furniture", "laptop", 0.35), 3.2, 0.9, -4.8), at(kit("furniture", "lampSquareFloor", 2.2), 4.6, 0, -5.2), at(kit("furniture", "pillow", 0.25), -3.5, 0.85, -4.9), at(kit("furniture", "bookcaseOpen", 3.0), -5.2, 0, -5.6));
    const an = person("#d85a8a", 1.4); place(an, 2.0, 0, -3.8); an.rotation.y = 0; an.position.set(1.8, 0, -5.8); an.scale.setScalar(1.7); R.add(an);
    { const lp = new THREE.Group(); lp.add(box(2.4, 0.12, 1.6, lam("#3a3a4a"), 0, 0, 0)); const sc = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshBasicMaterial({ map: canvasTex(256, 170, (g, W, H) => { g.fillStyle = "#e8f0ff"; g.fillRect(0, 0, W, H); g.fillStyle = "#2a3a6a"; g.fillRect(0, 0, W, 22); g.fillStyle = "#14102a"; g.font = "bold 24px 'Special Elite','Courier New',monospace"; g.fillText("I didn't think there", 12, 70); g.fillText("were others like me.", 12, 102); g.fillStyle = "#4a6aaa"; g.fillRect(12, 124, 3, 22); }), color: new THREE.Color(0.85, 0.85, 0.9) })); sc.position.set(0, 0.95, -0.8); sc.rotation.x = -0.12; lp.add(sc); lp.add(box(2.5, 1.7, 0.08, lam("#2a2a3a"), 0, 0.95, -0.86)); place(lp, 1.8, 1.0, -4.4); R.add(lp); glowAt(R, 1.8, 1.9, -3.8, 5, "#e8f0ff"); }
    const rw = new THREE.Mesh(new THREE.CircleGeometry(1.3, 24), MB("#8aa8ff", 1.4)); rw.position.set(0, 3.8, -5.75); R.add(rw);
    for (let i = 0; i < 40; i++) { const hx = -3 + rnd(i) * 6, hy = 3.0 + rnd(i + 4) * 1.6; if (Math.hypot(hx, hy - 3.8) < 1.15) R.add(box(0.18, 0.2, 0.02, MB("#ffd58a", 1.4), hx, hy, -5.7)); }
    glowAt(R, 0, 3.8, -5.3, 9, "#7a9aff"); for (let i = 0; i < 18; i++) { const b = sphere(0.09, glow(["#ffd58a", "#ff9ab0", "#9affc8", "#9ad0ff"][i % 4], 3), -4 + i * 0.5, 5.2 - Math.abs(i - 9) * 0.07, -5.4); noink(b); R.add(b); }
  },
  // line 7b: "His blog takes anonymous comments, so someone left one": a giant blog page with the comment box; a comment slides in
  commentBox(R) {
    roomShell(R, { w: 26, d: 18, h: 22, wall: "#3a2a5a", trim: "#241a40", z: -9.5 });
    const pg = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 10.4), new THREE.MeshBasicMaterial({ map: canvasTex(512, 700, (g, W, H) => { g.fillStyle = "#f4efe4"; g.fillRect(0, 0, W, H); g.fillStyle = "#2a2a3a"; g.fillRect(0, 0, W, 80); g.fillStyle = "#f4efe4"; g.font = "bold 44px Anton"; g.fillText("MY BLOG", 24, 56); g.fillStyle = "#c8c8d8"; for (let k = 0; k < 7; k++) g.fillRect(24, 110 + k * 30, 300 + (k * 53) % 160, 12); g.fillStyle = "#e8e4f4"; g.fillRect(24, 360, W - 48, 260); g.strokeStyle = "#8a8aa8"; g.lineWidth = 3; g.strokeRect(24, 360, W - 48, 260); g.fillStyle = "#6a6a88"; g.font = "28px Anton"; g.fillText("ANONYMOUS COMMENTS", 40, 396); g.fillStyle = "#aaaabb"; g.fillRect(40, 560, 300, 14); }) })); pg.position.set(0, 6.1, -8); R.add(pg);
    R.add(box(8.4, 11.2, 0.9, lam("#1a1a2a"), 0, 6.1, -8.6)); floor(R, 44, 44, planksTex("#6a4a30", "", [8, 8]), 6); for (const sx of [-1, 1]) { R.add(at(kit("furniture", "bookcaseClosedWide", 6), sx * 8.5, 0, -8)); R.add(at(kit("furniture", "lampSquareFloor", 3.4), sx * 6.4, 0, -4)); R.add(at(kit("furniture", "loungeSofa", 1.6, 1.6), sx * 8, 0, 0, sx * -1.2)); } R.add(box(2.4, 1.2, 1.4, lam("#2a2a3a"), 0, 0.6, -8.3)); R.add(box(5.5, 0.4, 2.6, lam("#2a2a3a"), 0, 0.2, -8.0));
    const cm = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.6), new THREE.MeshBasicMaterial({ map: canvasTex(512, 128, (g, W, H) => { g.fillStyle = "#cfe8ff"; g.fillRect(0, 0, W, H); g.strokeStyle = "#3a6aa8"; g.lineWidth = 5; g.strokeRect(3, 3, W - 6, H - 6); g.fillStyle = "#14102a"; g.font = "bold 40px 'Special Elite','Courier New',monospace"; g.textAlign = "left"; g.fillText("I left a comment.", 24, 76); }), color: new THREE.Color(1.3, 1.3, 1.3) })); cm.position.set(0, 3.7, -7.9); cm.userData.rv = 0.35; R.add(cm); glowAt(R, 0, 3.7, -7.4, 8, "#9ad0ff");
    add(R, at(kit("furniture", "bookcaseClosed", 5), -6.5, 0, -6), at(kit("furniture", "pottedPlant", 2.2), 6.4, 0, -5.6), at(kit("furniture", "lampRoundTable", 1.4), 3.6, 0, -2.4), at(kit("furniture", "rugRectangle", 0.05, 3), 0, 0.03, -2), at(kit("furniture", "cardboardBoxOpen", 1.0), -3.4, 0, -2.4));
    add(R, at(kit("furniture", "desk", 1.0, 1.4), 0, 0, -2.6), at(kit("furniture", "computerKeyboard", 0.1, 1.4), 0, 1.4, -2.2), at(kit("furniture", "chairDesk", 1.6), 0, 0, -0.9, Math.PI));
    const an = person("#3a3a6a", 1.5, { face: false }); place(an, 0, 0.1, -1.4); an.rotation.y = Math.PI; R.add(an); for (let i = 0; i < 14; i++) glowAt(R, (rnd(i) - 0.5) * 16, 1 + rnd(i + 3) * 8, -5 - rnd(i + 8) * 3, 0.6, "#9ad0ff"); nightSky(R, [50, 70, -150], 8);
  },
  // line 8: "Luckily, nobody can prove he hurt anyone. Unluckily, nobody can prove he didn't.": a courtroom, an empty witness stand, scales with both pans empty
  courtroom(R) {
    roomShell(R, { w: 22, d: 16, h: 12, wall: "#3a5a6a", trim: "#2a3a48", floorTex: planksTex("#5a3a28", "", [6, 5]), z: -10 });
    R.add(box(8, 2.2, 2.4, lam("#3a2218"), 0, 1.1, -8.4)); R.add(box(8.4, 0.3, 2.8, lam("#4a2c20"), 0, 2.3, -8.4)); R.add(box(3, 1.6, 1.8, lam("#4a2c20"), -6.5, 0.8, -5)); R.add(box(3.2, 0.3, 2.0, lam("#5a3a28"), -6.5, 1.65, -5));
    const sc = new THREE.Group(); sc.add(cyl(0.1, 0.1, 4.6, lam("#d8b24a"), 0, 2.3, 0, 8)); sc.add(box(5.6, 0.14, 0.14, lam("#d8b24a"), 0, 4.5, 0)); for (const sx of [-2.7, 2.7]) { sc.add(cyl(0.02, 0.02, 1.6, lam("#d8b24a"), sx, 3.7, 0, 6)); sc.add(cyl(1.5, 0.2, 0.2, MB("#f0d070"), sx, 2.85, 0, 18)); } sc.add(sphere(0.22, lam("#d8b24a"), 0, 4.7, 0)); place(sc, 0, 2.4, -7.6); R.add(sc);
    for (const sx of [-2.7, 2.7]) glowAt(R, sx, 5.8, -7.2, 4, "#fff0c0");
    const cnt = (x: number) => { const t = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.9), new THREE.MeshBasicMaterial({ map: canvasTex(256, 90, (g, W, H) => { g.fillStyle = "#f4ead2"; g.fillRect(0, 0, W, H); g.fillStyle = "#6a1a2a"; g.font = "bold 44px Anton"; g.textAlign = "center"; g.fillText("NO PROOF", W / 2, 62); }) })); t.position.set(x, 7.4, -7.3); R.add(t); };
    cnt(-2.7); cnt(2.7);
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]) R.add(at(kit("furniture", "bench", 1.0, 1.6), s * 5.5, 0, -2 + i * 2.2));
    add(R, at(kit("furniture", "chair", 1.2), -6.5, 1.8, -5.4, 0.3)); const gv = new THREE.Group(); gv.add(box(0.9, 0.35, 0.35, lam("#5a3a24"), 0, 0.2, 0)); gv.add(box(0.12, 0.9, 0.12, lam("#5a3a24"), 0.4, 0.5, 0)); place(gv, 2.2, 2.45, -8.4); gv.rotation.z = 0.3; R.add(gv); for (const sx of [-9, 9]) R.add(at(kit("furniture", "bookcaseClosedWide", 5), sx, 0, -9.4)); for (const sx of [-6.4, 6.4, -10, 10]) { R.add(cyl(0.6, 0.7, 11, lam("#d8d0c0"), sx, 5.5, -9.3, 16)); R.add(box(1.8, 0.5, 1.8, lam("#b8b0a0"), sx, 0.25, -9.3)); R.add(box(1.8, 0.5, 1.8, lam("#b8b0a0"), sx, 11, -9.3)); } for (let q = 0; q < 3; q++) for (const sx of [-1, 1]) R.add(box(4, 0.5, 0.9, lam("#4a2c20"), sx * 7.2, 0.5 + q * 0.35, 1.2 - q * 1.6)); R.add(box(12, 0.8, 0.2, lam("#4a2c20"), 0, 0.9, -3.2)); for (let q = -5; q <= 5; q++) R.add(box(0.12, 0.8, 0.12, lam("#4a2c20"), q * 1.1, 0.4, -3.2)); for (const sx of [-5.4, 5.4]) { R.add(box(0.1, 5, 0.1, lam("#6a5a3a"), sx, 2.5, -9.6)); R.add(box(1.8, 1.1, 0.04, MB(sx < 0 ? "#2a4aa8" : "#c8243e"), sx + (sx < 0 ? 0.95 : -0.95), 4.4, -9.58)); } 
    R.add(P.stars(0, 1, 10, 0, 1));
  },
  // line 9: "Ever been so scared you froze?": a graveyard path at night, a person frozen mid-step, a ghost, a lantern
  graveyardPath(R) {
    floor(R, 300, 300, lamTex(rep(grassHD(), 60, 60)), -60); R.add(at(box(6, 0.05, 80, lam("#7a6a58"), 0, 0.03, -30), 0, 0, 0));
    for (let i = 0; i < 30; i++) R.add(at(kit("graveyard", ["pine-fall", "pine-fall-crooked", "pine"][i % 3], 5 + rnd(i) * 5), (i % 2 ? 1 : -1) * (8 + rnd(i + 3) * 24), 0, -4 - rnd(i + 5) * 40, rnd(i + 7) * 6));
    for (let i = 0; i < 16; i++) R.add(at(kit("graveyard", ["gravestone-cross", "gravestone-round", "gravestone-broken", "gravestone-wide", "cross"][i % 5], 2.2 + rnd(i) * 0.8), (i % 2 ? 1 : -1) * (2.6 + rnd(i + 2) * 5), 0, -3.5 - i * 2.2, (rnd(i) - 0.5) * 0.5));
    R.add(at(kit("graveyard", "crypt-small", 4.5), 8, 0, -20, -0.5)); R.add(at(kit("graveyard", "iron-fence", 1.4, 1.5), -7, 0, -9)); R.add(at(kit("graveyard", "iron-fence", 1.4, 1.5), 7, 0, -9));
    for (const x of [-3.8, 3.8]) { R.add(at(kit("graveyard", "lantern-candle", 1.0, 1.4), x, 0, -6)); glowAt(R, x, 1.2, -6, 5, "#ffb04a"); }
    const gh = at(kit("graveyard", "character-ghost", 3.2), 0, 0.8, -14); gh.userData.rv = 0.0; R.add(gh); glowAt(R, 0, 2.6, -13, 12, "#a8b8ff");
    const fz = person("#e8c24a", 1.6, { arms: true }); place(fz, 0.6, 0, -4.6); fz.rotation.y = 0; R.add(fz);
    for (let i = 0; i < 6; i++) { const ic = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5, 5), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 1.1, 1.6), transparent: true, opacity: 0.8 })); ic.position.set(0.6 + (rnd(i) - 0.5) * 0.9, 0.3 + rnd(i + 2) * 1.4, -4.3); noink(ic); R.add(ic); }
    nightSky(R, [70, 70, -190], 12); cloudsAt(R, 55, "#3a3a8a");
  },
};
const lampPoolC = (R: R, x: number, y: number, z: number, c: string) => { glowAt(R, x, y, z, 9, c); };
