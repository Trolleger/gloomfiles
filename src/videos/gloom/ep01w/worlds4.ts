import { Batch, house } from "./bbuild";
import { cloudHD, cobbleHD } from "./paint";
// EP01 v8 worlds: built for the approved v8 script, one literal place per line, using the Kenney CC0 kits (Nature, Furniture, Graveyard).
import * as THREE from "three";
import { lam, glow, box, cyl, plane, sphere, canvasTex, lamTex } from "../mats";
import * as P from "../props";
import { rnd } from "../props/util";
import { NOINK } from "../ink";
import { R, place, floor, glowAt, win, plant, plaster, wain, rugAt, sign, clock, checkTex, lampPool } from "./worlds";
import { planksTex, stoneTex, groundTex, rugTex, textTex } from "./tex";
import { rep, ctex, facadeHD, roofHD, grassHD } from "./paint";
import { kit, at } from "./kit";

const noink = (o: THREE.Object3D) => { o.traverse((c) => c.layers.set(NOINK)); return o; };
const MB = (c: string, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) });
const add = (R: R, ...o: THREE.Object3D[]) => { o.forEach((x) => R.add(x)); };
const beamLine = (R: R, a: THREE.Vector3, b: THREE.Vector3, c: string, r = 0.07, k = 2.2, solid = false) => { const d = new THREE.Vector3().subVectors(b, a), L = d.length(), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), transparent: !solid, opacity: solid ? 1 : 0.85, fog: false })); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); noink(m); R.add(m); return m; };
/** a cartoon person (no face detail beyond dots): body colour, scale, optional arms-up */
export const person = (c: string, s = 1, o: { arms?: boolean; face?: boolean; hat?: string } = {}) => {
  const g = new THREE.Group(); const body = sphere(0.36, lam(c)); body.scale.set(0.9, 1.15, 0.7); body.position.y = 1.15; g.add(body);
  for (const x of [-0.12, 0.12]) { const l = cyl(0.035, 0.035, 0.7, lam("#241726"), x, 0.38, 0, 6); g.add(l); g.add(sphere(0.07, lam("#241726"), x, 0.04, 0.05)); }
  const head = sphere(0.3, lam("#f4d8b8")); head.scale.set(0.92, 1.05, 0.9); head.position.y = 1.95; g.add(head);
  if (o.face !== false) { for (const x of [-0.1, 0.1]) { g.add(sphere(0.055, MB("#ffffff"), x, 2.0, 0.24)); g.add(sphere(0.028, MB("#14102a"), x, 2.0, 0.29)); } g.add(box(0.12, 0.025, 0.02, MB("#8a1a2a"), 0, 1.84, 0.27)); }
  for (const x of [-1, 1]) { const a = cyl(0.03, 0.03, 0.7, lam("#241726"), x * 0.4, o.arms ? 1.7 : 1.05, 0, 6); a.rotation.z = o.arms ? x * 0.7 : x * 0.12; g.add(a); g.add(sphere(0.06, lam("#241726"), x * 0.55, o.arms ? 2.0 : 0.7, 0)); }
  if (o.hat) g.add(cyl(0.3, 0.3, 0.1, lam(o.hat), 0, 2.24, 0, 12));
  g.scale.setScalar(s * 0.9); return g;
};
/** the template's painted cumulus cut-outs, shown on day and golden shots */
export const dayClouds = (R: R, z: number, seed = 0) => { for (let i = 0; i < 5; i++) { const w = 38 + rnd(i + seed) * 26, m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 2), new THREE.MeshBasicMaterial({ map: cloudHD(i % 4), transparent: true, depthWrite: false, fog: false })); m.userData.day = true; m.position.set(-100 + i * 50 + rnd(i) * 20, 28 + rnd(i + 3) * 22, z - 40); noink(m); R.add(m); } };
export const townHouses = (R: R, z: number, n: number, seed = 0, span = 90) => { const b = new Batch(); for (let i = 0; i < n; i++) { const ww = rnd(i + seed) > 0.5 ? 9 : 7, hh = [7, 8.4, 9.8][Math.floor(rnd(i + seed + 2) * 3) % 3], x = -span / 2 + i * (span / n) + rnd(i + 6) * 1.2, zz = z - rnd(i + 8) * 4; house(b, x, zz, 0, ww, 8, hh, (i + seed) % 8, 0); for (let w = 0; w < 2; w++) if (rnd(i * 5 + w + seed) > 0.5) glowAt(R, x + (w - 0.5) * 3, 2.4 + rnd(w) * 3, zz + 4.2, 1.8, "#ffcf8a"); } b.build(R as any); dayClouds(R, z - 60, seed); };
export const pines = (R: R, n: number, x0: number, x1: number, z0: number, z1: number, seed = 0, names = ["tree_pineDefaultA", "tree_pineTallB", "tree_pineRoundA", "tree_pineSmallA"]) => { for (let i = 0; i < n; i++) R.add(at(kit("nature", names[i % names.length], 4 + rnd(i + seed) * 5), x0 + rnd(i + seed + 1) * (x1 - x0), 0, z0 + rnd(i + seed + 3) * (z1 - z0), rnd(i) * 6)); };
const nightSky = (R: R, moon = [-80, 70, -200] as [number, number, number], seed = 1) => { const g = new THREE.Group(); g.userData.night = true; g.add(P.stars(300, seed, 400, 0.08, 2.4)); g.add(P.at(P.moon(10, moon))); R.add(g); };
const cloudsAt = (R: R, y: number, c: string, z = -150, n = 9) => { for (let i = 0; i < n; i++) { const s = P.glowSprite(c, 50 + rnd(i) * 40); s.userData.night = true; s.position.set(-200 + i * 50, y + rnd(i + 3) * 25, z - rnd(i + 5) * 60); R.add(s); } };
const roomShell = (R: R, o: { w?: number; d?: number; h?: number; wall: string; trim: string; floorTex?: THREE.Material; z?: number }) => { const w = o.w ?? 16, d = o.d ?? 14, h = o.h ?? 9, z0 = o.z ?? -7;
  floor(R, w, d, o.floorTex ?? planksTex("#6a4a30", "", [4, 4]), z0 + d / 2 - 1); R.add(box(w, h, 0.4, plaster(o.wall, 5, 2), 0, h / 2, z0)); wain(R, w, z0, o.trim, "#f4ead2"); R.add(box(0.4, h, d, plaster(o.wall, 4, 2), -w / 2, h / 2, z0 + d / 2)); R.add(box(0.4, h, d, plaster(o.wall, 4, 2), w / 2, h / 2, z0 + d / 2));
  const dark = "#" + new THREE.Color(o.trim).multiplyScalar(0.72).getHexString(), lite = "#" + new THREE.Color(o.trim).multiplyScalar(1.25).getHexString();
  R.add(box(w, 2.4, 0.12, tileTex("wn" + o.trim, [o.trim, lite], dark, w / 3, 1), 0, 1.2, z0 + 0.3)); R.add(box(w, 0.2, 0.3, planksTex("#8a5a34", "", [8, 1]), 0, 2.5, z0 + 0.34)); R.add(box(w, 0.3, 0.3, planksTex("#8a5a34", "", [8, 1]), 0, 0.15, z0 + 0.36));
  for (const [x, y, c] of [[-w * 0.34, 4.6, "#e8a860"], [-w * 0.2, 5.5, "#58b0a8"], [w * 0.31, 4.8, "#d8685a"]] as const) { R.add(box(1.25, 1.5, 0.1, planksTex("#6a4224", "", [1, 1]), x, y, z0 + 0.27)); R.add(box(1.0, 1.25, 0.12, tileTex("pic" + c, [c, "#f2e2c0"], "#4a3040", 1, 1), x, y, z0 + 0.28)); }
  R.add(box(3, 0.14, 0.55, planksTex("#8a5a34", "", [2, 1]), w * 0.3, 3.4, z0 + 0.45)); for (let i = 0; i < 9; i++) { const hh = 0.5 + rnd(i + w) * 0.35; R.add(box(0.2, hh, 0.4, lam(["#c8443a", "#2f8a84", "#e0a030", "#4a5ab8", "#f4ead2"][i % 5]), w * 0.3 - 1.2 + i * 0.27, 3.47 + hh / 2, z0 + 0.45)); }
};

/** painted ceramic tiles: per-tile colour jitter, soft highlight, ink grout, chips (template painted-texture style) */
export const tileTex = (key: string, cols: string[], grout: string, rx: number, ry: number) => lamTex(rep(ctex("tile5" + key, 512, 512, (g, r) => {
  g.fillStyle = grout; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const px = x * 128 + 4, py = y * 128 + 4; g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(px, py, 121, 121); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(px + 6, py + 6, 80, 7); g.fillStyle = "rgba(40,30,60,.16)"; g.fillRect(px, py + 108, 121, 13);
    for (let i = 0; i < 26; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,.16)" : "rgba(40,30,60,.12)"; g.fillRect(px + r() * 110, py + r() * 110, 3 + r() * 16, 2 + r() * 5); }
    if (r() < 0.2) { g.strokeStyle = "rgba(40,20,50,.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(px + r() * 120, py); g.lineTo(px + r() * 120, py + 50 + r() * 50); g.stroke(); } }
}), rx, ry));
/** line 3's bathroom, dense: tiled floor and wainscot, painted wall, window light, shelf, towels, tub, mat, clutter */
export const bathShell = (R: R) => {
  floor(R, 12, 11, tileTex("floor", ["#e8dcc0", "#f2e8d0", "#d8c8a8", "#8ab4ac", "#9cc4bc"], "#5a4a52", 5, 5), -1.5);
  R.add(box(12, 8, 0.4, plaster("#e8a860", 4, 2), 0, 4, -6.1)); for (const s of [-1, 1]) { R.add(box(0.4, 8, 11, plaster("#d89858", 4, 2), s * 6, 4, -1)); R.add(box(0.15, 3.0, 11, tileTex("side", ["#2f9a94", "#38a8a0", "#278880"], "#123a44", 6, 2), s * 5.75, 1.5, -1)); }
  R.add(box(12, 3.0, 0.16, tileTex("back", ["#2f9a94", "#38a8a0", "#278880", "#48b0a4"], "#123a44", 6, 2), 0, 1.5, -5.86)); R.add(box(12, 0.18, 0.26, lam("#f4ead2"), 0, 3.08, -5.82));
  // window with warm daylight, frame, curtain
  R.add(box(2.0, 2.2, 0.06, MB("#fff0c0", 1.5), -3.8, 5.0, -5.86)); for (const x of [-4.86, -3.8, -2.74]) R.add(box(0.12, 2.4, 0.14, lam("#8a4a2a"), x, 5.0, -5.8)); for (const y of [3.84, 5.0, 6.16]) R.add(box(2.24, 0.12, 0.14, lam("#8a4a2a"), -3.8, y, -5.8)); R.add(box(0.5, 2.8, 0.16, lam("#c8443a"), -5.2, 4.9, -5.65)); glowAt(R, -3.8, 5.0, -5.3, 5, "#ffd890");
  // shelf with bottles, towel rail, tub edge, bath mat, floor clutter
  R.add(box(2.6, 0.12, 0.5, lam("#8a5a34"), 4.2, 5.3, -5.6)); for (let i = 0; i < 7; i++) { const h = 0.35 + rnd(i) * 0.5, c = ["#e8453c", "#f2c030", "#3a7ad8", "#58b870", "#d870a8"][i % 5]; R.add(cyl(0.13, 0.15, h, lam(c), 3.1 + i * 0.36, 5.36 + h / 2, -5.6, 10)); R.add(cyl(0.05, 0.05, 0.12, lam("#f4ead2"), 3.1 + i * 0.36, 5.42 + h, -5.6, 8)); }
  R.add(box(2.0, 0.08, 0.08, lam("#c8c8d8"), -1.9, 2.9, -5.66)); for (const [x, c] of [[-2.4, "#e8453c"], [-1.5, "#f4ead2"]] as const) { R.add(box(0.7, 1.2, 0.1, lam(c), x, 2.35, -5.62)); R.add(box(0.7, 0.12, 0.12, lam("#3a7ad8"), x, 2.0, -5.6)); }
  add(R, at(kit("furniture", "bathtub", 1.2), 4.4, 0, -2.6, -Math.PI / 2), at(kit("furniture", "bathroomCabinet", 1.6), 4.6, 0, -5.4), at(kit("furniture", "washer", 2.0), -4.8, 0, -3.0, Math.PI / 2), at(kit("furniture", "plantSmall2", 0.9), 4.6, 1.6, -5.3), at(kit("furniture", "cardboardBoxOpen", 0.5), -3.4, 0, -4.6));
  R.add(box(2.4, 0.05, 1.3, tileTex("mat", ["#d8584a", "#c8443a"], "#7a2430", 2, 1), -2.2, 0.04, -3.9));
  for (let i = 0; i < 9; i++) { const rl = cyl(0.16, 0.16, 0.24, lam(i % 3 ? "#f4ead2" : "#d8cbb0"), 2.2 + rnd(i) * 2.2, 0.14, -4.9 + rnd(i + 4) * 0.8, 12); R.add(rl); }
};
/** line 2's street dressing: kerbs, shop awnings, crates, barrels, flower boxes, puddles, railings */
const streetDress = (R: R) => {
  for (const z of [-3.1, -9.6]) R.add(box(60, 0.18, 0.4, stoneTex("#cbbda4", "", [30, 1]), 0, 0.09, z));
  for (let i = 0; i < 9; i++) { const x = -18 + i * 4.4 + rnd(i) * 1.2, c = ["#c8443a", "#2f8a84", "#e0a030", "#4a5ab8"][i % 4]; for (let k = 0; k < 6; k++) { const a = box(0.42, 0.1, 1.2, lam(k % 2 ? c : "#f4ead2"), x - 1.05 + k * 0.42, 3.0, -9.9); a.rotation.x = 0.45; R.add(a); } }
  for (let i = 0; i < 16; i++) { const x = -15 + i * 2 + rnd(i + 3), z = -8.9 + rnd(i + 5) * 0.6; if (i % 3 === 0) { R.add(cyl(0.34, 0.3, 0.8, planksTex("#8a5a34", "", [2, 1]), x, 0.4, z, 12)); R.add(cyl(0.36, 0.36, 0.08, lam("#3a3040"), x, 0.62, z, 12)); } else { R.add(box(0.6, 0.6, 0.6, planksTex("#a87040", "", [1, 1]), x, 0.3, z)); if (i % 2) R.add(box(0.45, 0.45, 0.45, planksTex("#a87040", "", [1, 1]), x + 0.1, 0.82, z)); }
    for (let k = 0; k < 4; k++) R.add(sphere(0.12, lam(["#e8453c", "#ffd040", "#f4ead2"][(i + k) % 3]), x - 0.3 + k * 0.2, i % 3 ? 0.68 + (i % 2) * 0.46 : 0.9, z + 0.2)); }
};

/** a plain labelled board: every sign says exactly what the narrator is saying */
const board = (R: R, lines: string[], w: number, x: number, y: number, z: number, o: { bg?: string; fg?: string; size?: number; rv?: number; rvOff?: number; ry?: number } = {}) => {
  const th = 90 + (lines.length - 1) * 84, m = new THREE.Mesh(new THREE.PlaneGeometry(w, (w * th) / 512), new THREE.MeshBasicMaterial({ map: textTex(512, th, o.bg ?? "#f7f0dc", o.fg ?? "#1a1020", lines, "Anton", o.size ?? 66, "#1a1020") }));
  m.position.set(x, y, z); if (o.ry) m.rotation.y = o.ry; if (o.rv !== undefined) m.userData.rv = o.rv; if (o.rvOff !== undefined) m.userData.rvOff = o.rvOff; noink(m); R.add(m); return m; };
/** the universal cartoon curse: a small black storm cloud raining and zapping the one person under it */
export const curseCloud = (R: R, x: number, y: number, z: number, k = 1, rv = 0) => { const g = new THREE.Group(); for (let i = 0; i < 7; i++) g.add(sphere((0.42 + rnd(i) * 0.24) * k, lam(i % 2 ? "#2a2438" : "#3a3250"), (i - 3) * 0.32 * k, Math.sin(i * 2.1) * 0.14 * k, (i % 3) * 0.1));
  for (let i = 0; i < 14; i++) { const d = box(0.04 * k, 0.4 * k, 0.04, MB("#7ac8ff", 1.3), (rnd(i + 5) - 0.5) * 1.9 * k, -(0.6 + rnd(i) * 0.9) * k, 0.1); noink(d); g.add(d); }
  for (const [dx, dy, r] of [[0.05, -0.62, 0.55], [-0.08, -1.0, -0.6], [0.08, -1.36, 0.5]] as const) { const b = box(0.14 * k, 0.5 * k, 0.08, MB("#ffe23a", 1.9), dx * k, dy * k, 0.5); b.rotation.z = r; g.add(b); }
  g.position.set(x, y, z); g.userData.rv = rv; R.add(g); return g; };
const brickStreet = (R: R, seed: number) => { floor(R, 300, 300, lamTex(rep(cobbleHD(), 60, 60)), -60); townHouses(R, -13, 7, seed, 48); streetDress(R); };

import { W2 } from "./worlds2";
export const W4: Record<string, (R: R) => void> = {
  // line 13: the 1942 lab, a visibly frightened volunteer in a chair, a pinned doll, a racing heart monitor
  lab(R) { W2.lab(R); /*fig*/ for (let i = 0; i < 4; i++) { const sw = sphere(0.1, MB("#a8e8ff", 1.4), 0.55 + i * 0.3, 3.4 - (i % 2) * 0.3, -3.9); noink(sw); R.add(sw); } },
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
    /*fig*/
    for (const [x, c, rv] of [[-2.5, "#d85a6a", 0.25], [2.4, "#58b868", 0.4]] as const) { const v = person(c, 0.95); place(v, x, 0, -6.4); R.add(v); curseCloud(R, x, 2.7, -6.4, 0.7, rv); }
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
    /*fig*/
    { const v = person("#d85a6a", 1.2); place(v, 3.2, 0.2, -6.4); R.add(v); curseCloud(R, 3.2, 3.2, -6.4, 0.8, 0.55); }
    townHouses(R, -130, 8, 1, 60); nightSky(R, [-60, 60, -220], 4); cloudsAt(R, 45, "#5a3aaa", -120);
  },
  // callback: "Now he's stopped everything": the same floating island, empty and dark, the chair pushed back, one comment glowing
  islandEmpty(R) {
    // the grounded last room: planks, walls, a warm lamp left on, a dead screen and the empty chair
    roomShell(R, { w: 16, d: 16, h: 10, wall: "#2f4a78", trim: "#1f2f52", floorTex: planksTex("#6a4a30", "", [6, 6]), z: -9 });
    add(R, at(kit("furniture", "desk", 1.0), 0, 0, -6), at(kit("furniture", "computerScreen", 0.9), 0, 1.0, -6.1), at(kit("furniture", "chairDesk", 1.4), 1.6, 0, -4.4, 2.2), at(kit("furniture", "lampRoundFloor", 3.0), -2.4, 0, -6.4), at(kit("furniture", "bookcaseOpen", 3.4), -4.8, 0, -8.2), at(kit("furniture", "pottedPlant", 1.8), 4.2, 0, -7.6), at(kit("furniture", "rugRound", 0.05, 2.6), 0.6, 0.02, -5), at(kit("furniture", "books", 0.5), -0.6, 1.0, -6));
    lampPool(R, -2.4, 3.0, -6.2, "#ffb45a", 8); { const dead = plane(1.05, 0.62, new THREE.MeshBasicMaterial({ color: "#04050a" }), 0, 1.58, -5.96); R.add(dead); } lampPool(R, 0.4, 3.6, -5.4, "#ffc878", 4);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.8), new THREE.MeshBasicMaterial({ map: canvasTex(256, 90, (g, W, H) => { g.fillStyle = "#cfe8ff"; g.fillRect(0, 0, W, H); g.strokeStyle = "#3a6aa8"; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4); g.fillStyle = "#14102a"; g.font = "bold 30px 'Special Elite','Courier New',monospace"; g.fillText("I left a comment.", 14, 56); }), color: new THREE.Color(1.5, 1.5, 1.5) })); c.position.set(-0.6, 3.4, -5.6); R.add(c); glowAt(R, 0, 3.2, -5.2, 8, "#9ad0ff");
    
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
  sickCold(R) {
    brickStreet(R, 4);
    board(R, ["ACHOO!"], 3.2, 1.0, 4.1, -5.6, { bg: "#fff36a", size: 78 });
    R.add(at(kit("graveyard", "bench", 1.2, 1.6), -0.1, 0, -5.4));
    for (const [x, y] of [[0.75, 2.2], [1.05, 2.45], [1.15, 1.95], [1.5, 2.25], [1.75, 2.55], [1.8, 1.85]]) { const d = sphere(0.07, MB("#bfe8ff", 1.2), x, y, -3.9); noink(d); R.add(d); }
    // a tissue box and a big thermometer reading hot
    R.add(box(0.9, 0.45, 0.55, lam("#3a7ad8"), -2.0, 0.25, -3.8)); R.add(box(0.35, 0.35, 0.1, lam("#fbf8f0"), -2.0, 0.62, -3.8));
    R.add(box(0.34, 2.2, 0.16, lam("#f4f4fa"), -2.3, 2.3, -5.0)); R.add(box(0.14, 1.7, 0.18, MB("#ff2a1c", 1.2), -2.3, 2.15, -4.98)); R.add(sphere(0.3, MB("#ff2a1c", 1.2), -2.3, 1.2, -4.95)); board(R, ["39°"], 1.1, -2.3, 3.75, -5.0, { fg: "#c8141e" });
  },
  missedBus(R) {
    brickStreet(R, 7); R.add(at(box(40, 0.05, 4.2, lam("#4a4650"), 0, 0.04, -7.2), 0, 0, 0)); for (let x = -18; x < 19; x += 3) R.add(box(1.4, 0.02, 0.2, MB("#f4ead2"), x, 0.08, -7.2));
    const bus = new THREE.Group(); bus.add(box(6.4, 2.6, 2.2, lam("#f2c030"), 0, 1.9, 0)); for (let q = 0; q < 4; q++) bus.add(box(1.05, 0.85, 0.08, MB("#bfe8ff"), -2.1 + q * 1.4, 2.55, 1.12)); for (const x of [-2.1, 2.1]) { const wh = cyl(0.65, 0.65, 2.4, lam("#1a1a22"), x, 0.65, 0, 16); wh.rotation.x = Math.PI / 2; bus.add(wh); }
    board(bus as any, ["CITY BUS 7"], 3.4, 0, 1.45, 1.15, { size: 64 }); for (const y of [1.0, 1.6]) bus.add(sphere(0.14, MB("#ff2a1c", 1.8), -3.22, y, 0.9));
    for (let i = 0; i < 5; i++) { const p = sphere(0.22 + i * 0.1, new THREE.MeshBasicMaterial({ color: "#c8c4cc", transparent: true, opacity: 0.75 - i * 0.12 }), -3.7 - i * 0.55, 0.8 + i * 0.12, 0.7); noink(p); bus.add(p); }
    bus.scale.setScalar(0.72); bus.position.set(0.2, 0, -8.4); bus.userData.drive = [0.2, 4.2]; R.add(bus);
    R.add(box(0.16, 3.4, 0.16, lam("#7a7a8a"), -2.6, 1.7, -4.8)); board(R, ["BUS STOP"], 1.9, -2.6, 3.7, -4.7, { bg: "#2a5ab8", fg: "#ffffff" });
  },
  graveNod(R) {
    floor(R, 300, 300, lamTex(rep(grassHD(), 60, 60)), -60); pines(R, 14, -26, 26, -14, -30, 5);
    R.add(at(kit("graveyard", "gravestone-round", 3.6), 0, 0, -5.4)); board(R, ["R.I.P."], 1.5, 0, 2.2, -4.7, { bg: "#b8b4c4" });
    R.add(at(kit("graveyard", "candle", 1.1), 1.7, 0, -4.2)); const fl = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.46, 8), MB("#ff9a3a", 1.9)); fl.position.set(1.7, 1.4, -4.2); fl.userData.rvOff = 0.55; noink(fl); R.add(fl);
    for (let i = 0; i < 4; i++) { const sm = sphere(0.1 + i * 0.05, new THREE.MeshBasicMaterial({ color: "#d8d4e0", transparent: true, opacity: 0.7 }), 1.7 + Math.sin(i * 2) * 0.12, 1.5 + i * 0.3, -4.2); sm.userData.rv = 0.55; noink(sm); R.add(sm); }
    for (const x of [-4, 3.8]) R.add(at(kit("graveyard", "gravestone-cross", 2.4), x, 0, -7.5));
  },
  logStreet(R) {
    floor(R, 300, 300, lamTex(rep(cobbleHD(), 60, 60)), -60); R.add(at(box(8, 0.05, 160, lam("#7a6a5a"), 0, 0.03, -40), 0, 0, 0));
    townHouses(R, -14.5, 9, 4, 60); streetDress(R); townHouses(R, -26, 11, 7, 100); pines(R, 8, -40, 40, -16, -24, 3);
    for (const x of [-22, -8, 8, 22]) { R.add(at(kit("graveyard", "lightpost-single", 4.4), x, 0, -9)); glowAt(R, x, 4.4, -9, 5, "#ffcf8a"); }
    // (a) a cold: a sneezing person with a green puff and a tissue
    /*fig*/ for (let i = 0; i < 10; i++) R.add(sphere(0.28 + rnd(i) * 0.22, new THREE.MeshBasicMaterial({ color: i % 2 ? "#c8ffb0" : "#8ae88a", transparent: true, opacity: 0.75 }), -2.7 + i * 0.3, 2.3 + (rnd(i) - 0.5) * 0.8, -5.5));
    for (let i = 0; i < 4; i++) R.add(box(1.6 - i * 0.3, 0.06, 0.06, MB("#ffffff"), 4.0 + i * 0.5, 0.8 + i * 0.35, -8.2));
    R.add(at(kit("graveyard", "bench", 1.1, 1.5), -1.8, 0, -4.4)); R.add(at(kit("nature", "fence_planks", 1.2, 1.2), -6, 0, -4.6)); R.add(at(kit("nature", "sign", 1.6), 0.6, 0, -4.8)); for (const x of [-5.2, 6.4]) R.add(at(kit("nature", "plant_bushLarge", 1.4), x, 0, -5));
    // (b) missed bus: a bus pulling away, a runner
    const bus = new THREE.Group(); bus.add(box(6.5, 2.2, 2.2, lam("#f2c030"), 0, 1.7, 0)); bus.add(box(6.0, 0.8, 2.26, MB("#bfe8ff"), 0, 2.2, 0)); for (let q = 0; q < 5; q++) bus.add(box(0.06, 0.8, 2.3, lam("#f2c030"), -2.4 + q * 1.2, 2.2, 0)); for (const x of [-2.1, 2.1]) { const wh = cyl(0.62, 0.62, 2.4, lam("#1a1a22"), x, 0.62, 0, 16); wh.rotation.x = Math.PI / 2; bus.add(wh); bus.add(cyl(0.3, 0.3, 2.5, lam("#c8c8d8"), x, 0.62, 0, 10)).rotation.x = Math.PI / 2; } bus.add(box(0.3, 0.5, 1.2, MB("#ff3a2a", 1.4), 3.3, 0.9, 0)); bus.scale.setScalar(0.8); place(bus, 1.8, 0, -4.6); bus.rotation.y = 0.0; R.add(bus);
    /*fig*/ R.add(box(0.15, 3.2, 0.15, lam("#7a7a8a"), -0.2, 1.6, -6.1)); R.add(box(1.6, 0.9, 0.08, lam("#e8c24a"), -0.2, 3.0, -6.05));
    // (c) very rarely death, as a nod: a gravestone and a candle going out
    R.add(at(kit("graveyard", "gravestone-cross", 3.4), 4.2, 0, -6)); const cn = at(kit("graveyard", "candle", 1.1), 3.0, 0, -4.8); R.add(cn); const fl = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.34, 8), MB("#ff9a3a", 1.8)); fl.position.set(3.0, 1.35, -4.8); fl.userData.rvOff = 0.7; noink(fl); R.add(fl); glowAt(R, 3.2, 1.1, -4.8, 3.4, "#ff9a4a");
    nightSky(R); cloudsAt(R, 55, "#4a3a9a");
  },
  // line 3: "prints their photo, pisses on it, says their name, wishes the worst, with no thinking, just anger": a bathroom, a printed photo on the tiles, a cartoon yellow stream, red hatred cloud
  bathroom(R) {
    bathShell(R);
    add(R, at(kit("furniture", "toilet", 2.4), -2.4, 0, -5.2), at(kit("furniture", "bathroomSink", 2.4), 2.5, 0, -5.4), at(kit("furniture", "bathroomMirror", 2.4), 2.5, 4.1, -5.6), at(kit("furniture", "trashcan", 1.4), -4.4, 0, -4.4));
    // a snapshot of an ordinary smiling stranger, taped to the tiles: unmistakably "their photo"
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 3.2), new THREE.MeshBasicMaterial({ map: canvasTex(270, 320, (g) => {
      g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, 270, 320); g.fillStyle = "#8fd0f0"; g.fillRect(16, 16, 238, 236); g.fillStyle = "#7cc46a"; g.fillRect(16, 192, 238, 60);
      g.fillStyle = "#e8783c"; g.beginPath(); g.ellipse(135, 262, 78, 72, 0, Math.PI, 0); g.fill();
      g.fillStyle = "#6a3a20"; g.beginPath(); g.ellipse(135, 108, 66, 66, 0, 0, 7); g.fill();
      g.fillStyle = "#f6d2ac"; g.beginPath(); g.ellipse(135, 130, 52, 58, 0, 0, 7); g.fill();
      g.fillStyle = "#6a3a20"; g.beginPath(); g.ellipse(135, 86, 54, 24, 0, 0, 7); g.fill();
      g.fillStyle = "#1a1020"; for (const x of [115, 155]) { g.beginPath(); g.arc(x, 124, 6, 0, 7); g.fill(); }
      g.strokeStyle = "#1a1020"; g.lineWidth = 5; g.beginPath(); g.arc(135, 146, 22, 0.15, Math.PI - 0.15); g.stroke();
      g.strokeStyle = "#1a1020"; g.lineWidth = 4; g.strokeRect(16, 16, 238, 236); g.fillStyle = "#4a3a4a"; g.font = "bold 40px Anton"; g.textAlign = "center"; g.fillText("NAME: ?????", 135, 298); }) }));
    ph.position.set(0.5, 3.5, -5.5); R.add(ph); for (const [x, r] of [[-0.85, 0.7], [1.85, -0.7]] as const) { const t = box(0.7, 0.22, 0.04, lam("#e8d9a0"), x, 5.05, -5.46); t.rotation.z = r; R.add(t); }
    /*fig*/
    R.add(box(3.2, 2.6, 0.12, MB("#cfe8f0", 1.1), 2.5, 4.0, -5.75)); R.add(box(3.5, 2.9, 0.1, lam("#f4ead2"), 2.5, 4.0, -5.8)); R.add(box(1.4, 1.2, 0.1, lam("#f4ead2"), -3.6, 2.4, -5.7)); R.add(box(1.2, 0.2, 0.2, lam("#c8c8d8"), -3.6, 3.1, -5.6)); for (const q of [-0.4, 0.4]) R.add(box(0.5, 1.0, 0.08, lam("#e8453c"), -3.6 + q, 2.5, -5.55));
    R.add(P.at(P.lampDesk("#ff9a7a"), 4.2, 3.0, -5.6));
    // one unbroken yellow stream from him up to the photo, splashing off it
    { const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.0, 1.1, -3.0), new THREE.Vector3(0.3, 4.6, -4.2), new THREE.Vector3(0.5, 3.0, -5.42));
      const st = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.085, 10), MB("#ffd21a", 1.35)); noink(st); st.userData.oldStream = true; R.add(st);
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, rr = 0.25 + rnd(i) * 0.4, d = sphere(0.05 + rnd(i + 3) * 0.05, MB("#ffd21a", 1.3), 0.5 + Math.cos(a) * rr, 3.0 + Math.sin(a) * rr * 0.7, -5.38); noink(d); d.userData.oldStream = true; R.add(d); } }
  },
  // line 4: "ran it like a lab: forty targets, each matched with a control, coded in advance": 40 targets and 40 controls under glass domes, coded tags
  labForty(R) {
    floor(R, 80, 80, tileTex("lf", ["#b8c8cc", "#a8bcc4", "#c8d4d0", "#7a9aa8"], "#35485a", 18, 18), -14); R.add(box(80, 20, 0.4, tileTex("lw", ["#3a7a9a", "#438aa4", "#32708c"], "#173a50", 20, 5), 0, 10, -40)); for (let q = -6; q <= 6; q++) { R.add(at(kit("furniture", q % 2 ? "bookcaseClosed" : "cabinetTelevision", 3.2), q * 4.2, 0, -38)); } for (let q = 0; q < 14; q++) R.add(cyl(0.3, 0.4, 0.9, new THREE.MeshLambertMaterial({ color: ["#7affc8", "#ff7ab0", "#e8e07a", "#7ab0ff"][q % 4], transparent: true, opacity: 0.8 }), -26 + q * 4, 4.2, -37, 12));
    for (let r = 0; r < 10; r++) for (let c = 0; c < 8; c++) {
      const x = -5.0 + c * 1.2 + (c >= 4 ? 1.6 : 0), z = -3.5 - r * 2.0, tgt = c < 4, p = person(tgt ? "#d85a6a" : "#58b8c8", 0.62, { face: true });
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
    win(R, 6.0, 4.6, -6.7, 2.4, 3.2, "#34406a"); glowAt(R, 6.0, 4.4, -6.2, 8, "#7a8aff");
  },
  // line 7: "an anon wrote 'I didn't think there were others like me'": a second anon in an attic, laptop glow, a faint far window across the roofs
  attic2(R) {
    roomShell(R, { w: 12, d: 10, h: 7, wall: "#6a4a7a", trim: "#3a2a4a", z: -6 });
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), lamTex(rep(ctex("atticroof2", 256, 256, (g, r) => { g.fillStyle = "#7a4a3a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 16; i++) { g.fillStyle = r() > 0.5 ? "#6a3a30" : "#8a5a44"; g.fillRect(0, i * 16, 256, 14); } }), 3, 2))); p.position.set(s * 3.4, 5.2, -2); p.rotation.set(0, s * Math.PI / 2, s * -0.75); R.add(p); }
    for (let i = -3; i <= 3; i++) R.add(box(0.25, 0.25, 10, lam("#3a2418"), i * 1.5, 6.2 - Math.abs(i) * 0.8, -2));
    add(R, at(kit("furniture", "bedSingle", 0.8), -3.2, 0, -4.4), at(kit("furniture", "rugRound", 0.05, 4), 0, 0.03, -2.8), at(kit("furniture", "cardboardBoxClosed", 0.9), 3.2, 0, -4.8), at(kit("furniture", "laptop", 0.35), 3.2, 0.9, -4.8), at(kit("furniture", "lampSquareFloor", 2.2), 4.6, 0, -5.2), at(kit("furniture", "pillow", 0.25), -3.5, 0.85, -4.9), at(kit("furniture", "bookcaseOpen", 3.0), -5.2, 0, -5.6));
    /*fig*/
    { const lp = new THREE.Group(); lp.add(box(2.4, 0.12, 1.6, lam("#3a3a4a"), 0, 0, 0)); const sc = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshBasicMaterial({ map: canvasTex(256, 170, (g, W, H) => { g.fillStyle = "#e8f0ff"; g.fillRect(0, 0, W, H); g.fillStyle = "#2a3a6a"; g.fillRect(0, 0, W, 22); g.fillStyle = "#14102a"; g.font = "bold 24px 'Special Elite','Courier New',monospace"; g.font = "bold 21px 'Special Elite','Courier New',monospace"; g.fillText("I didn't think", 14, 104); g.fillText("there were others", 14, 130); g.fillText("like me.", 14, 156); g.fillStyle = "#4a6aaa"; g.fillRect(100, 140, 3, 18); }), color: new THREE.Color(0.7, 0.7, 0.78) })); sc.position.set(0, 0.95, -0.8); sc.rotation.x = -0.12; lp.add(sc); lp.renderOrder = 5; lp.add(box(2.5, 1.7, 0.08, lam("#2a2a3a"), 0, 0.95, -0.86)); place(lp, 1.8, 1.0, -4.4); R.add(lp); glowAt(R, 1.8, 1.9, -3.8, 5, "#e8f0ff"); }
    const rw = new THREE.Mesh(new THREE.CircleGeometry(1.3, 24), MB("#8aa8ff", 1.4)); rw.position.set(0, 3.8, -5.75); R.add(rw);
    for (let i = 0; i < 40; i++) { const hx = -3 + rnd(i) * 6, hy = 3.0 + rnd(i + 4) * 1.6; if (Math.hypot(hx, hy - 3.8) < 1.15) R.add(box(0.18, 0.2, 0.02, MB("#ffd58a", 1.4), hx, hy, -5.7)); }
    glowAt(R, 0, 3.8, -5.3, 9, "#7a9aff"); for (let i = 0; i < 18; i++) { const b = sphere(0.09, glow(["#ffd58a", "#ff9ab0", "#9affc8", "#9ad0ff"][i % 4], 3), -4 + i * 0.5, 5.2 - Math.abs(i - 9) * 0.07, -5.4); noink(b); R.add(b); }
  },
  // line 7b: "His blog takes anonymous comments, so someone left one": a giant blog page with the comment box; a comment slides in
  commentBox(R) {
    roomShell(R, { w: 26, d: 18, h: 22, wall: "#3a2a5a", trim: "#241a40", z: -9.5 });
    const pg = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 10.4), new THREE.MeshBasicMaterial({ map: canvasTex(512, 700, (g, W, H) => { g.fillStyle = "#f4efe4"; g.fillRect(0, 0, W, H); g.fillStyle = "#2a2a3a"; g.fillRect(0, 0, W, 80); g.fillStyle = "#f4efe4"; g.font = "bold 44px Anton"; g.fillText("HIS BLOG", 24, 56); g.fillStyle = "#c8c8d8"; for (let k = 0; k < 7; k++) g.fillRect(24, 110 + k * 30, 300 + (k * 53) % 160, 12); g.fillStyle = "#e8e4f4"; g.fillRect(24, 360, W - 48, 260); g.strokeStyle = "#8a8aa8"; g.lineWidth = 3; g.strokeRect(24, 360, W - 48, 260); g.fillStyle = "#6a6a88"; g.font = "28px Anton"; g.fillText("ANONYMOUS COMMENTS", 40, 396); g.fillStyle = "#aaaabb"; g.fillRect(40, 560, 300, 14); }) })); pg.position.set(0, 6.1, -8); R.add(pg);
    R.add(box(8.4, 11.2, 0.9, lam("#1a1a2a"), 0, 6.1, -8.6)); floor(R, 44, 44, planksTex("#6a4a30", "", [8, 8]), 6); for (let q = 0; q < 8; q++) R.add(at(kit("furniture", ["cardboardBoxClosed", "plantSmall1", "books", "pottedPlant"][q % 4], 1.0 + (q % 3) * 0.4), -6 + q * 1.7, 0, 1.5 + (q % 3) * 1.4, q));
    R.add(at(kit("furniture", "rugRound", 0.05, 6), 0, 0.03, 3)); for (const sx of [-1, 1]) { R.add(at(kit("furniture", "bookcaseClosedWide", 6), sx * 8.5, 0, -8)); R.add(at(kit("furniture", "lampSquareFloor", 3.4), sx * 6.4, 0, -4)); R.add(at(kit("furniture", "loungeSofa", 1.6, 1.6), sx * 8, 0, 0, sx * -1.2)); } R.add(box(2.4, 1.2, 1.4, lam("#2a2a3a"), 0, 0.6, -8.3)); R.add(box(5.5, 0.4, 2.6, lam("#2a2a3a"), 0, 0.2, -8.0));
    const cm = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.6), new THREE.MeshBasicMaterial({ map: canvasTex(512, 128, (g, W, H) => { g.fillStyle = "#cfe8ff"; g.fillRect(0, 0, W, H); g.strokeStyle = "#3a6aa8"; g.lineWidth = 5; g.strokeRect(3, 3, W - 6, H - 6); g.fillStyle = "#14102a"; g.font = "bold 40px 'Special Elite','Courier New',monospace"; g.textAlign = "left"; g.fillText("I left a comment.", 24, 76); }), color: new THREE.Color(1.3, 1.3, 1.3) })); cm.position.set(0, 3.7, -7.9); cm.userData.rv = 0.35; R.add(cm); glowAt(R, 0, 3.7, -7.4, 8, "#9ad0ff");
    add(R, at(kit("furniture", "bookcaseClosed", 5), -6.5, 0, -6), at(kit("furniture", "pottedPlant", 2.2), 6.4, 0, -5.6), at(kit("furniture", "lampRoundTable", 1.4), 3.6, 0, -2.4), at(kit("furniture", "rugRectangle", 0.05, 3), 0, 0.03, -2), at(kit("furniture", "cardboardBoxOpen", 1.0), -3.4, 0, -2.4));
    add(R, at(kit("furniture", "desk", 1.0, 1.4), 0, 0, -2.6), at(kit("furniture", "computerKeyboard", 0.1, 1.4), 0, 1.4, -2.2), at(kit("furniture", "chairDesk", 1.6), 0, 0, -0.9, Math.PI));
    const an = person("#3a3a6a", 1.5, { face: false }); place(an, 0, 0.1, -1.4); an.rotation.y = Math.PI; R.add(an); for (let i = 0; i < 14; i++) glowAt(R, (rnd(i) - 0.5) * 16, 1 + rnd(i + 3) * 8, -5 - rnd(i + 8) * 3, 0.6, "#9ad0ff"); nightSky(R, [50, 70, -150], 8);
  },
  // line 8: "Luckily, nobody can prove he hurt anyone. Unluckily, nobody can prove he didn't.": a courtroom, an empty witness stand, scales with both pans empty
  courtroom(R) {
    roomShell(R, { w: 22, d: 16, h: 30, wall: "#3a5a6a", trim: "#2a3a48", floorTex: planksTex("#5a3a28", "", [6, 5]), z: -10 }); R.add(box(22, 5, 0.2, tileTex("ct", ["#8a5434", "#7a482c", "#96603c"], "#341a10", 7, 2), 0, 2.5, -9.5)); for (const zz of [-1.6, 0.6]) for (const sx of [-1, 1]) { R.add(box(5.5, 0.18, 0.8, planksTex("#8a5a34", "", [3, 1]), sx * 5.4, 0.8, zz)); R.add(box(5.5, 1.1, 0.14, planksTex("#7a4a2c", "", [3, 1]), sx * 5.4, 1.2, zz + 0.42)); for (const dx of [-2.5, 2.5]) R.add(box(0.2, 0.8, 0.7, lam("#4a2c1c"), sx * 5.4 + dx, 0.4, zz)); }
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
    floor(R, 300, 300, lamTex(rep(grassHD(), 60, 60)), -60); R.add(box(6, 0.05, 80, lamTex(rep(cobbleHD(), 2, 24)), 0, 0.03, -30)); for (const sx of [-1, 1]) for (let i = 0; i < 12; i++) R.add(box(0.6, 0.8 + rnd(i) * 0.2, 3.2, stoneTex("#a89c8a", "", [2, 1]), sx * 11, 0.45, -2 - i * 3.5)); for (let i = 0; i < 90; i++) R.add(at(kit("nature", i % 5 ? "grass_large" : "flower_redA", 0.4 + rnd(i) * 0.4), (i % 2 ? 1 : -1) * (3.3 + rnd(i + 2) * 7), 0, -1 - rnd(i + 4) * 30, rnd(i) * 6));
    for (let i = 0; i < 30; i++) R.add(at(kit("graveyard", ["pine-fall", "pine-fall-crooked", "pine"][i % 3], 5 + rnd(i) * 5), (i % 2 ? 1 : -1) * (8 + rnd(i + 3) * 24), 0, -4 - rnd(i + 5) * 40, rnd(i + 7) * 6));
    for (let i = 0; i < 16; i++) R.add(at(kit("graveyard", ["gravestone-cross", "gravestone-round", "gravestone-broken", "gravestone-wide", "cross"][i % 5], 2.2 + rnd(i) * 0.8), (i % 2 ? 1 : -1) * (2.6 + rnd(i + 2) * 5), 0, -3.5 - i * 2.2, (rnd(i) - 0.5) * 0.5));
    R.add(at(kit("graveyard", "crypt-small", 4.5), 8, 0, -20, -0.5)); R.add(at(kit("graveyard", "iron-fence", 1.4, 1.5), -7, 0, -9)); R.add(at(kit("graveyard", "iron-fence", 1.4, 1.5), 7, 0, -9));
    for (const x of [-3.8, 3.8]) { R.add(at(kit("graveyard", "lantern-candle", 1.0, 1.4), x, 0, -6)); glowAt(R, x, 1.2, -6, 5, "#ffb04a"); }
    const gh = at(kit("graveyard", "character-ghost", 3.2), 0, 0.8, -14); gh.userData.rv = 0.0; R.add(gh); glowAt(R, 0, 2.6, -13, 12, "#a8b8ff");
    /*fig*/
    for (let i = 0; i < 6; i++) { const ic = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5, 5), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 1.1, 1.6), transparent: true, opacity: 0.8 })); ic.position.set(0.6 + (rnd(i) - 0.5) * 0.9, 0.3 + rnd(i + 2) * 1.4, -4.3); noink(ic); R.add(ic); }
    nightSky(R, [70, 70, -190], 12); cloudsAt(R, 55, "#3a3a8a");
  },
};
const lampPoolC = (R: R, x: number, y: number, z: number, c: string) => { glowAt(R, x, y, z, 9, c); };
