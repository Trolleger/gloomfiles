// The first 21 s rebuilt the mromidev way: ONE connected world, a distinct literal place per beat, the camera gliding
// between them on the words, characters acting every frame, animated effects, and no signs.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Rig, camPath, Key } from "../core";
import { Stage3D, ShotView } from "../Shot";
import { bodyFront, bodySide, fxContact, fxPuff, Expr } from "../toon";
import { lam, glow, box, cyl, plane, sphere, lamTex } from "../mats";
import { NOINK } from "../ink";
import { rnd } from "../props/util";
import { clamp01, smooth } from "../core";
import { floor } from "./worlds";
import { planksTex } from "./tex";
import { rep, cobbleHD, grassHD } from "./paint";
import { Batch, house } from "./bbuild";
import { kit, at, useKit } from "./kit";
import { OUTFITS } from "./beats3";
import { W4, person, curseCloud, pines, dayClouds } from "./worlds4";
import { AT, CapView, Disclaimer, talkAt, FPS } from "./Episode4";

export const OPEN_FRAMES = Math.round(AT("Then he started", -0.05) * 30);
const F = (phrase: string, off = 0) => Math.round(AT(phrase, off) * FPS);
const T = { curse: F("curse strangers"), odd: F("and the odd"), stop: F("stops trying"), says: F("He says most"), cold: F("a cold"), miss: F("missing their"), rare: F("but very rarely"), dies: F("dies"), sure: F("His surest"), photo: F("photo"), piss: F("piss"), name: F("their name"), wish: F("and wish"), anger: F("nothing but pure"), word: F("anger") };
// places along one street, left to right
const P = { desk: 0, bench: 16, bus: 28, grave: 44, bath: 60 };

const V3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const noink = (o: THREE.Object3D) => { o.traverse((c) => c.layers.set(NOINK)); return o; };
const MB = (c: string, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) });

class OpenStage implements Stage3D {
  rig = new Rig(); root = this.rig.root;
  clouds: THREE.Group[] = []; bus = new THREE.Group(); wheels: THREE.Object3D[] = []; flame!: THREE.Mesh; smoke: THREE.Mesh[] = [];
  drops: THREE.Mesh[] = []; ring: THREE.Mesh[] = []; spray: THREE.Mesh[] = []; zaps: THREE.Mesh[] = [];
  curve = new THREE.QuadraticBezierCurve3(V3(P.bath - 0.15, 1.15, -3.0), V3(P.bath + 0.25, 4.7, -4.2), V3(P.bath + 0.5, 3.0, -5.4));
  keys: Key[];
  constructor() {
    const R = this.root;
    floor(R as any, 220, 120, lamTex(rep(cobbleHD(), 44, 24)), -20);
    // one terrace of houses behind the whole street, every front on the same line so nothing intersects
    const b = new Batch(); for (let i = 0, x = -30; x < 90; i++) { const w = i % 2 ? 9 : 7, h = [7, 8.4, 9.8][i % 3]; if (!(x + w > P.grave - 8 && x < P.bath + 8)) house(b, x + w / 2, -17, 0, w, 8, h, (i * 3) % 8, 0); x += w + 0.35; } b.build(R as any);
    dayClouds(R as any, -75, 2); dayClouds(R as any, -90, 7);
    for (let x = -22; x < 80; x += 9) R.add(at(kit("graveyard", "lightpost-single", 4.4), x + 4, 0, -10.5));
    // place 1: his table on the pavement, two strangers who will be cursed
    R.add(at(kit("furniture", "table", 0.85), 1.5, 0, -4.6), at(kit("furniture", "laptop", 0.4), 1.5, 0.85, -4.6), at(kit("furniture", "chair", 1.3), 2.5, 0, -4.8, -1.2), at(kit("furniture", "pottedPlant", 1.3), -1.8, 0, -4.8));
    for (const x of [-2.3, 2.3]) { const c = curseCloud(R as any, P.desk + x, 3.1, -5.8, 0.6, 0); delete c.userData.rv; this.clouds.push(c); }
    // place 2: the bench where someone catches a cold
    R.add(at(kit("graveyard", "bench", 1.2, 1.5), P.bench - 1.6, 0, -4.6), at(kit("furniture", "trashcan", 1.2), P.bench - 3.4, 0, -4.8));
    for (let i = 0; i < 26; i++) { const s = sphere(0.05 + rnd(i) * 0.07, MB("#cdeeff", 1.25), 0, -9, 0); noink(s); this.spray.push(s); R.add(s); }
    // place 3: the bus stop and the bus
    R.add(box(60, 0.05, 3.8, lam("#4a4650"), P.bus + 8, 0.04, -7.4)); for (let x = P.bus - 18; x < P.bus + 36; x += 3) R.add(box(1.4, 0.02, 0.18, MB("#f4ead2"), x, 0.08, -7.4));
    R.add(box(0.16, 3.2, 0.16, lam("#7a7a8a"), P.bus - 2.6, 1.6, -4.9), cyl(0.6, 0.6, 0.12, lam("#2a5ab8"), P.bus - 2.6, 3.4, -4.9, 20)); (R.children[R.children.length - 1] as THREE.Mesh).rotation.x = Math.PI / 2;
    R.add(box(2.6, 0.14, 1.2, lam("#c8443a"), P.bus - 0.6, 3.0, -5.4), box(0.12, 3.0, 0.12, lam("#7a7a8a"), P.bus - 1.8, 1.5, -5.8), box(0.12, 3.0, 0.12, lam("#7a7a8a"), P.bus + 0.6, 1.5, -5.8));
    const bus = this.bus; bus.add(box(5.4, 2.4, 2.0, lam("#f2c030"), 0, 1.75, 0), box(5.5, 0.18, 2.1, lam("#c8443a"), 0, 1.35, 0)); for (let q = 0; q < 4; q++) bus.add(box(0.95, 0.8, 0.06, MB("#bfe8ff"), -1.75 + q * 1.17, 2.35, 1.02));
    for (const x of [-1.7, 1.7]) { const g = new THREE.Group(); const t = cyl(0.62, 0.62, 2.2, lam("#1a1a22"), 0, 0, 0, 18); t.rotation.x = Math.PI / 2; g.add(t, box(0.7, 0.12, 0.05, lam("#c8c8d8"), 0, 0, 1.13), box(0.12, 0.7, 0.05, lam("#c8c8d8"), 0, 0, 1.13)); g.position.set(x, 0.62, 0); this.wheels.push(g); bus.add(g); }
    for (const y of [0.95, 1.5]) bus.add(sphere(0.13, MB("#ff2a1c", 1.8), -2.72, y, 0.85)); bus.position.set(P.bus + 0.5, 0, -7.2); R.add(bus);
    for (let i = 0; i < 8; i++) { const s = sphere(0.3, new THREE.MeshBasicMaterial({ color: "#d8d2da", transparent: true, opacity: 0.7 }), 0, -9, 0); noink(s); this.smoke.push(s); R.add(s); }
    // place 4: the little churchyard between the houses
    floor(R as any, 15, 20, lamTex(rep(grassHD(), 4, 5)), -14, 0.06); (R.children[R.children.length - 1] as THREE.Mesh).position.x = P.grave;
    pines(R as any, 10, P.grave - 8, P.grave + 8, -13, -22, 5);
    R.add(at(kit("graveyard", "gravestone-round", 3.4), P.grave, 0, -5.6), at(kit("graveyard", "candle", 1.1), P.grave + 1.7, 0, -4.4), at(kit("graveyard", "iron-fence", 1.3, 1.4), P.grave - 4.6, 0, -4.2), at(kit("graveyard", "iron-fence", 1.3, 1.4), P.grave + 4.8, 0, -4.2));
    for (const x of [-3.6, 3.4]) R.add(at(kit("graveyard", "gravestone-cross", 2.4), P.grave + x, 0, -8));
    this.flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 10), MB("#ff9a3a", 1.9)); this.flame.position.set(P.grave + 1.7, 1.4, -4.4); noink(this.flame); R.add(this.flame);
    // place 5: his bathroom, open to the street
    const bath = new THREE.Group(); W4.bathroom(bath as any); bath.traverse((o) => { if (o.userData.oldStream) o.visible = false; }); bath.position.set(P.bath, 0.08, 0); R.add(bath);
    for (let i = 0; i < 70; i++) { const s = sphere(0.11, MB("#ffd21a", 1.4), 0, -9, 0); noink(s); this.drops.push(s); R.add(s); }
    for (let i = 0; i < 18; i++) { const s = sphere(0.07, MB("#ffe45a", 1.4), 0, -9, 0); noink(s); this.ring.push(s); R.add(s); }
    // camera: glides arrive on the word, then keep pushing
    const k = (f: number, pos: [number, number, number], look: [number, number, number], fov: number, dur = 24, roll = 0): Key => ({ f, pos, look, fov, dur, roll });
    this.keys = [
      { f: 0, pos: [1.4, 2.6, 4.6], look: [0, 1.7, -4], fov: 46, roll: 0 },
      k(T.curse + 4, [0, 3.4, 6.4], [0, 2.1, -5.5], 58, 26),
      k(T.odd + 22, [-1.6, 2.4, 2.6], [-0.2, 1.7, -4], 46, 22, 0.04),
      k(T.stop + 14, [1.2, 2.9, 3.8], [0.6, 2.0, -4.4], 52, 20, -0.03),
      k(T.says + 26, [P.bench - 1.8, 3.0, 4.6], [P.bench + 0.2, 1.8, -4], 52, 30),
      k(T.cold - 16, [P.bench + 0.9, 2.5, 2.0], [P.bench + 0.7, 2.0, -4], 46, 22, 0.03),
      k(T.miss - 6, [P.bench + 1.1, 2.4, 1.2], [P.bench + 0.8, 2.0, -4], 44, 10),
      k(T.miss + 11, [P.bus - 1.6, 3.0, 4.8], [P.bus - 0.6, 1.8, -5.2], 56, 15),
      k(T.rare - 2, [P.bus + 1.6, 3.0, 5.0], [P.bus + 2.4, 1.7, -5.6], 56, 28, -0.04),
      k(T.rare + 26, [P.grave - 0.6, 3.4, 4.0], [P.grave + 0.4, 1.7, -5.2], 52, 26),
      k(T.sure - 4, [P.grave + 1.0, 2.2, 0.4], [P.grave + 0.9, 1.5, -5], 42, 20, 0.05),
      k(T.sure + 28, [P.bath - 1.2, 3.8, 5.0], [P.bath + 0.2, 2.0, -4.2], 54, 30),
      k(T.piss + 8, [P.bath + 1.6, 3.2, 1.8], [P.bath + 0.15, 2.2, -4.2], 50, 22, -0.04),
      k(T.name + 14, [P.bath - 1.6, 2.5, 1.0], [P.bath + 0.1, 2.0, -3.8], 46, 24, 0.04),
      k(T.anger + 4, [P.bath - 0.3, 2.9, 1.7], [P.bath + 0.1, 2.0, -3.6], 50, 30),
      k(T.word + 5, [P.bath - 0.2, 2.15, -0.1], [P.bath - 0.15, 1.75, -3.0], 42, 10, -0.05),
    ];
  }
  update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const c = camPath(this.keys, f, 0.0014);
    const kick = (t: number, a: number) => { const x = f - t; if (x >= 0 && x < 7) { const o = a * (x % 2 ? -1 : 1) * (1 - x / 7); c.pos = [c.pos[0] + o * 0.12, c.pos[1] + o * 0.08, c.pos[2]]; } };
    kick(T.curse + 8, 1.0); kick(T.cold - 6, 1.4); kick(T.dies + 2, 1.2); kick(T.word, 1.8);
    this.rig.frame(cam, scene, c, "day", { focusR: 15 });
    const lt = this.rig.light2D(cam);
    const t = f / 30;
    type A = { o: string; x: number; z: number; s?: number; expr?: Expr; wave?: number; walk?: boolean; side?: boolean; mirror?: boolean; roll?: number; hop?: number; seed?: number };
    const actor = (a: A) => {
      if (Math.abs(a.x - c.look[0]) > 20) return;
      const s = a.s ?? 1.1, d = cam.position.distanceTo(V3(a.x, 1.2, a.z)) / s, [w, h, kk] = this.rig.tier(d), b = (f + (a.seed ?? 0) * 17) % 43, blink = b === 0 || b === 3 ? 0.5 : b === 1 || b === 2 ? 1 : 0;
      const ph = a.walk || a.side ? ((f % 18) / 18) : 0, y = (a.hop ?? 0) + (a.walk || a.side ? 0 : 0.015 * Math.sin(f / 6 + (a.seed ?? 0)));
      this.rig.fxCard(cam, { key: "contact|blob|a", cw: 128, ch: 128, draw: (p) => fxContact(p, "#8a7e8e"), x: a.x, y: 0.1, z: a.z, w: 1.5 * s, h: 0.75 * s, flat: true, soft: true });
      const key = [a.o, a.expr, a.wave, Math.round(ph * 18), blink, a.walk, a.side, lt].join("|");
      this.rig.card(cam, { key, w, h, k: kk, x: a.x, y, z: a.z, scale: s, mirror: a.mirror, roll: a.roll, draw: (p) => { p.g.translate(150, 0); if (a.side) bodySide(p, OUTFITS[a.o], { mode: "march", phase: ph, expr: a.expr ?? "shock", blink, stride: 1.3, light: lt, seed: 4 }); else bodyFront(p, OUTFITS[a.o], { mode: a.walk ? "stroll" : "stand", phase: ph, expr: a.expr ?? "neutral", wave: a.wave, blink, light: lt, seed: 4 }); } });
    };
    const fx = (key: string, draw: (p: any) => void, x: number, y: number, z: number, w: number, h: number, cw = 512, ch = 512) => this.rig.fxCard(cam, { key, cw, ch, draw, x, y, z, w, h, soft: true });
    const lerp = (a: number, b: number, u: number) => a + (b - a) * smooth(clamp01(u));
    // 1. the man points at two strangers; clouds slam down on them; he relaxes when he "stops trying"
    const relaxed = f > T.stop + 6, cursing = f > T.curse - 12 && f < T.odd + 6;
    actor({ o: "anon", x: P.desk - 0.1, z: -2.9, s: 1.2, expr: relaxed ? "smile_closed" : f > T.odd + 10 ? "pained" : cursing ? "angry" : "stern", wave: cursing ? Math.round(70 + 12 * Math.sin(f / 2.5)) : f > T.odd && !relaxed ? Math.round(20 + 10 * Math.sin(f)) : undefined, seed: 1 });
    this.clouds.forEach((cl, i) => { const t0 = T.curse + i * 6, u = clamp01((f - t0) / 9), pop = u <= 0 ? 0 : 1 + 0.35 * Math.sin(u * Math.PI); cl.visible = u > 0; cl.scale.setScalar(pop); cl.position.y = lerp(5.4, 3.1, u) + 0.08 * Math.sin(f / 5 + i * 3); cl.children.forEach((m, j) => { if (j >= 7 && j < 21) m.position.y = -0.5 - (((f * 0.11 + j * 0.37) % 1.1)); if (j >= 21) m.visible = (f + i * 5) % 14 < 6; }); });
    [-2.3, 2.3].forEach((x, i) => { const hit = f > T.curse + 8 + i * 6; actor({ o: i ? "green" : "anonPink", x: P.desk + x, z: -5.8, s: 0.95, expr: hit ? ((f % 14) < 6 ? "shock" : "nervous") : "neutral", wave: hit && (f % 14) < 6 ? 80 : undefined, roll: hit && (f % 14) < 6 ? 0.07 * (f % 2 ? 1 : -1) : 0, seed: 3 + i }); });
    // 2. the sneeze: wind up, jerk forward, spray
    const wind = clamp01((f - (T.cold - 26)) / 18), sn = f - (T.cold - 6), jerk = sn >= 0 && sn < 14 ? Math.sin((sn / 14) * Math.PI) : 0;
    actor({ o: "green", x: P.bench + 0.4, z: -3.8, s: 1.2, expr: sn >= 0 && sn < 16 ? "pained" : wind > 0.3 ? "nervous" : "dazed", roll: -0.28 * jerk + (sn < 0 ? 0.08 * wind : 0), hop: sn >= 0 && sn < 10 ? 0.18 * Math.sin((sn / 10) * Math.PI) : 0, seed: 5 });
    actor({ o: "volunteer", x: P.bench + 2.5, z: -4.8, s: 0.95, expr: sn > 3 ? "shock" : "neutral", roll: sn > 3 && sn < 20 ? -0.18 : 0, seed: 6 });
    this.spray.forEach((s, i) => { const u = (sn - (i % 5) * 0.8) / 22; s.visible = u > 0 && u < 1; if (s.visible) s.position.set(P.bench + 0.7 + u * (1.2 + rnd(i) * 2.2), 2.35 + (rnd(i + 3) - 0.5) * 1.8 * u - 1.4 * u * u, -3.5 + (rnd(i + 7) - 0.5) * 1.2 * u); });
    // 3. the bus pulls away; the runner chases it and falls behind
    const go = Math.max(0, f - (T.miss - 14)) / 30, bx = P.bus + 0.8 + 1.5 * go * go + 0.5 * go; this.bus.position.set(bx, 0.03 * Math.sin(f * 1.7), -7.2); this.wheels.forEach((w) => (w.rotation.z = -(bx - P.bus) / 0.62));
    this.smoke.forEach((s, i) => { const u = ((f * 0.055 + i / 8) % 1); s.visible = go > 0.05; s.position.set(bx - 2.9 - u * 3.4, 0.7 + u * 1.1, -6.5 + 0.3 * Math.sin(i)); s.scale.setScalar(0.5 + u * 1.9); (s.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - u); });
    const run = clamp01((f - (T.miss - 18)) / 52), rx = P.bus - 3.4 + 4.6 * run, running = run > 0 && run < 1;
    actor({ o: "runner", x: rx, z: -4.2, s: 1.2, side: running, mirror: running, expr: run >= 1 ? "pained" : "shock", wave: running ? undefined : run >= 1 ? Math.round(60 + 25 * Math.sin(f / 3)) : undefined, seed: 7 });
    if (running && f % 9 < 6) fx("dust" + (f % 9), (p) => fxPuff(p, (f % 9) / 6), rx - 0.7, 0.35, -4.0, 1.1, 1.1, 300, 300);
    // 4. the candle gutters and goes out
    const out = f - T.dies; this.flame.visible = out < 4; this.flame.scale.set(1 + 0.18 * Math.sin(f * 1.9), out > -14 && out < 4 ? 0.55 + 0.45 * Math.abs(Math.sin(f * 1.3)) : 1 + 0.12 * Math.sin(f * 2.7), 1);
    if (out >= 4 && out < 46) { const u = (out - 4) / 42; for (let i = 0; i < 3; i++) { const v = u * 1.4 - i * 0.18; if (v > 0 && v < 1) fx("wisp" + Math.round(v * 12), (p) => fxPuff(p, Math.min(0.92, v)), P.grave + 1.7 + 0.18 * Math.sin(v * 8 + i), 1.5 + v * 1.7, -4.4, 0.8, 0.8, 300, 300); } }
    // 5. the bathroom: he walks in, tapes up nothing but their photo, the stream arcs up in moving drops and splashes
    const walk = clamp01((f - (T.sure - 6)) / 40), manx = lerp(P.bath - 4.2, P.bath - 0.15, walk), rage = clamp01((f - T.word) / 6), seething = f > T.wish;
    actor({ o: "anon", x: manx + (rage > 0 ? 0.04 * (f % 2 ? 1 : -1) : 0), z: -2.9, s: 1.15 + 0.06 * rage, walk: walk > 0 && walk < 1, expr: rage > 0 ? "angry" : seething ? "angry" : f > T.piss ? "grin" : "stern", wave: rage > 0 ? Math.round(90 + 20 * Math.sin(f)) : f > T.name && f < T.wish ? Math.round(55 + 20 * talkAt(f) + 8 * Math.sin(f / 4)) : undefined, hop: rage > 0 ? 0.12 * Math.abs(Math.sin((f - T.word) / 2.5)) : 0, seed: 1 });
    const head = clamp01((f - T.piss) / 12), tail = clamp01((f - (T.word - 12)) / 10);
    this.drops.forEach((s, i) => { const u = ((i / this.drops.length) + f * 0.028) % 1; s.visible = u < head && u > tail; if (s.visible) { const p = this.curve.getPoint(u), wob = 0.035 * Math.sin(u * 30 - f * 1.4); s.position.set(p.x + wob, p.y + P.bath * 0 + 0.08, p.z); s.scale.setScalar(0.85 + 0.35 * Math.sin(u * 17 - f * 0.9)); } });
    this.ring.forEach((s, i) => { const on = head >= 1 && tail < 1, u = ((i / this.ring.length) + f * 0.07) % 1, a = (i * 2.4) % (Math.PI * 2); s.visible = on; if (on) s.position.set(P.bath + 0.5 + Math.cos(a) * u * 0.9, 3.08 + Math.sin(a) * u * 0.55 - u * u * 0.7, -5.32 + u * 0.25); });
    if (rage > 0) { const h = 2.05; fx("rageburst", (p) => { const g = p.g; for (let n = 0; n < 22; n++) { const a = (n / 22) * Math.PI * 2, w = 0.07 + (n % 3) * 0.025; g.fillStyle = n % 2 ? "#ff2a1c" : "#ff8a1c"; g.beginPath(); g.moveTo(256 + Math.cos(a - w) * 100, 256 + Math.sin(a - w) * 100); g.lineTo(256 + Math.cos(a) * (205 + (n % 4) * 18), 256 + Math.sin(a) * (205 + (n % 4) * 18)); g.lineTo(256 + Math.cos(a + w) * 100, 256 + Math.sin(a + w) * 100); g.fill(); } }, manx, h, -3.2, 3.4 * rage * (1 + 0.1 * Math.sin(f * 1.5)), 3.4 * rage * (1 + 0.1 * Math.sin(f * 1.5))); }
    this.rig.finish();
    void t;
    const fxs = f < T.says ? P.desk - 0.9 : f < T.miss - 10 ? P.bench + 0.4 : f < T.rare ? rx : f < T.sure ? P.grave : manx;
    return { focus: V3(fxs, 1.6, f < T.miss - 10 ? -3.6 : f < T.sure ? -5 : -3), cInf: f > T.word ? 10 : 6, light: "day" as const };
  }
}

export const Ep01Open: React.FC = () => {
  const f = useCurrentFrame(), ready = useKit();
  const make = useMemo(() => () => new OpenStage(), [ready]);
  if (!ready) return <AbsoluteFill style={{ background: "#0a0c1c" }} />;
  return (<AbsoluteFill style={{ background: "#0a0c1c" }}>
    <ShotView make={make} frame={f} />
    <Audio src={staticFile("audio/ep01v10/mix.wav")} />
    {(() => { const d = (f - T.word) / 30; return d > -0.1 && d < 0.9 ? <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 90px rgba(255,20,10,.7)", opacity: clamp01((d + 0.1) / 0.15) * clamp01((0.9 - d) / 0.3) }} /> : null; })()}
    <CapView f={f} />
    <Disclaimer f={f} />
  </AbsoluteFill>);
};
