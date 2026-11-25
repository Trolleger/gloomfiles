// EP 2: The Wow! Signal. Every shot is a 3D set that DEPICTS what the narration says (dish, printout, bars, radio dial,
// star map, silent sky). The cast are guides inside the sets. Timings come from the voice lines (3.7 w/s placeholder
// until Piper timings exist: replace LINES[].t0/t1 with words.json times and everything re-times).
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Rig, camPath, Key, SU, V3, smooth, clamp01 } from "./core";
import { Stage3D, ShotView } from "./Shot";
import { box, cyl, plane, sphere, lam, glow, canvasTex } from "./mats";
import { drawGloom, drawMoth, drawBiscuit, GLOOM } from "./cast";
import { flashHand } from "./toon";
import { fxBubble, fxPlate, fxQ, fxBeam, fxGlowDot } from "./fxdraw";
import { printoutTex } from "./paper";
import * as P from "./props";
import { NOINK } from "./ink";
import { CaptionTrack, Cap } from "../../Caption";
import { mouthFromWords, evenWords, Word, blinkAt } from "../../lib/anim";

export const FPS = 30;
const WPS = 3.7, GAP = 0.3;
export type Line = { who: "gloom" | "moth"; text: string; t0: number; t1: number };
const RAW: [Line["who"], string][] = [
  ["gloom", "One printout. One circled word. Forty-nine years of silence."],
  ["gloom", "August 15, 1977. A radio telescope in Ohio, listening for aliens, picks up something. It lasts exactly 72 seconds."],
  ["gloom", "Days later, a volunteer astronomer, Jerry Ehman, is reading the printout. He circles six characters, 6-E-Q-U-J-5, and writes one word beside them: Wow!"],
  ["moth", "That's it? That's the whole reaction?"],
  ["gloom", "The characters aren't a message. They're loudness, one character every 10 seconds. The U means about 30 times louder than background noise. It rose, peaked in the middle, and faded, which is how a real source in the sky should look."],
  ["gloom", "It sat near 1420 megahertz, the hydrogen line. Scientists had suggested that channel in 1959 as a sensible place to call another civilisation. It came from the direction of Sagittarius."],
  ["gloom", "Nobody has heard it again. Searches in 1987, 1989, 1995 and 1999 found nothing."],
  ["gloom", "Explanations: a reflected Earth signal, a one-off burst, a flickering signal. A 2017 comet idea was rejected by other astronomers. A 2024 preprint suggests a rare burst from a hydrogen cloud. Unconfirmed."],
  ["gloom", "Ehman said he would not draw vast conclusions from half-vast data. Gloom: Neither will I. Mostly."],
];
export const LINES: Line[] = (() => { let t = 0.15; return RAW.map(([who, text]) => { const n = text.split(/\s+/).length, d = n / WPS, l = { who, text, t0: t, t1: t + d }; t += d + GAP; return l; }); })();
export const TOTAL_S = LINES[LINES.length - 1].t1 + 1.2;
export const TOTAL = Math.ceil(TOTAL_S * FPS);
const WORDS: Word[][] = LINES.map((l) => evenWords(l.text, l.t0, l.t1));
const talkNow = (f: number, who: "gloom" | "moth") => LINES.reduce((m, l, i) => (l.who === who ? Math.max(m, mouthFromWords(f, FPS, WORDS[i])) : m), 0);

// shot table: a/b in frames, derived from line times (picture follows the words; reactions land ~2 f early)
const T = (i: number, k: 0 | 1) => Math.round((k ? LINES[i].t1 : LINES[i].t0) * FPS);
export type ShotDef = { id: number; a: number; b: number; name: string };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: T(0, 1) + 8, name: "hook: circled printout" },
  { id: 2, a: T(0, 1) + 8, b: T(1, 1) + 6, name: "the dish hears it" },
  { id: 3, a: T(1, 1) + 6, b: T(3, 1) + 6, name: "ehman circles it" },
  { id: 4, a: T(3, 1) + 6, b: T(4, 1) + 6, name: "loudness bars" },
  { id: 5, a: T(4, 1) + 6, b: T(5, 1) + 6, name: "1420 dial + sagittarius" },
  { id: 6, a: T(5, 1) + 6, b: T(6, 1) + 6, name: "silent sky, years" },
  { id: 7, a: T(6, 1) + 6, b: TOTAL, name: "explanations + close" },
];
export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];

export const CAPS: Cap[] = [
  { from: 0.2, to: 2.6, text: "WOW!" },
  { from: SHOTS[1].a / FPS + 0.2, to: SHOTS[1].a / FPS + 3.3, text: "AUG 15 1977" },
  { from: LINES[1].t0 + 4.0, to: LINES[1].t1 - 0.2, text: "72 SECONDS" },
  { from: LINES[2].t0 + 3.6, to: LINES[2].t1, text: "6EQUJ5" },
  { from: LINES[4].t0 + 3.2, to: LINES[4].t0 + 6.2, text: "ONE CHARACTER PER 10 S" },
  { from: LINES[4].t0 + 6.4, to: LINES[4].t0 + 9.6, text: "30X LOUDER" },
  { from: LINES[5].t0 + 0.2, to: LINES[5].t0 + 3.4, text: "1420 MHZ" },
  { from: LINES[5].t0 + 6.2, to: LINES[5].t1, text: "SAGITTARIUS" },
  { from: LINES[6].t0 + 0.3, to: LINES[6].t0 + 3.0, text: "NEVER AGAIN" },
  { from: LINES[7].t0 + 0.2, to: LINES[7].t0 + 3.5, text: "UNCONFIRMED" },
  { from: LINES[8].t0 + 1.0, to: LINES[8].t1, text: "HALF-VAST DATA" },
];

// ---------------- sets (composed from the prop library) ----------------
const buildField = (root: THREE.Group) => {
  const g = new THREE.Group(); root.add(g);
  g.add(P.ground(900), P.hills(9), P.at(P.hut(), 9, 0, -2), P.at(P.clockWall("22:16"), 6.7, 2.4, 0.3), P.stars(520, 3), P.moon(18));
  const d = P.dish(); P.at(d, 0, 0, -10); g.add(d);
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.09, 8, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color("#7dffd0").multiplyScalar(2.2), transparent: true, opacity: 0.8, fog: false })); r.layers.set(NOINK); (d.h.pivot as THREE.Object3D).add(r); rings.push(r); }
  return { g, pivot: d.h.pivot as THREE.Object3D, rings, tip: d.h.tip as THREE.Mesh };
};
const buildDesk = (root: THREE.Group, printout: THREE.Texture) => {
  const g = new THREE.Group(); root.add(g);
  g.add(P.floorRoom(), P.at(P.bookshelf(3, 3.2), -4.5, 0, -3.3), P.at(P.desk(), 0, 0, -0.3), P.at(P.lampDesk(), -0.85, 0.945, -0.55), P.at(P.mug(), 0.85, 0.945, -0.45), P.at(P.spin(P.pen(), 0, 0.5, 0), 0.6, 0.945, 0.15));
  g.add(box(2.6, 0.12, 0.2, lam("#1a1a38"), 4.4, 1.55, -3.3), plane(2.4, 3.2, glow("#27346a", 1.2), 4.4, 3.2, -3.38));
  const sh = P.sheet(printout, 0.46, 0.92); P.at(sh, 0.1, 0.945, -0.15); sh.rotation.y = 0.07; g.add(sh);
  return { g, paper: sh.h.mesh as THREE.Mesh };
};
const buildChart = (root: THREE.Group) => {
  const g = new THREE.Group(); root.add(g);
  g.add(P.at(P.floorRoom("#262d58", "#1f2a4e"), 0, 0, -1));
  const c = P.barChart([6, 14, 26, 30, 19, 5], 3, 0.095, 0.3); g.add(c);
  g.add(box(7.0, 0.04, 0.55, glow("#ff6a7c", 1.6), 0, 0.5, 0.48));
  return { g, bars: c.h.bars as unknown as THREE.Mesh[] };
};
const buildRadio = (root: THREE.Group) => {
  const g = new THREE.Group(); root.add(g);
  const r = P.radio(1400, 1440); P.at(r, 0, 0.945, 0);
  g.add(P.floorRoom("#352b4e", "#2b2850"), P.at(P.desk(), 0, 0, 0), r);
  return { g, setFreq: r.h.setFreq as unknown as (mhz: number) => void };
};
const buildSkyMap = (root: THREE.Group) => {
  const g = new THREE.Group(); root.add(g);
  const wall = new THREE.Mesh(new THREE.SphereGeometry(130, 24, 12), new THREE.MeshBasicMaterial({ color: "#0a1030", side: THREE.BackSide, fog: false })); wall.layers.set(NOINK); g.add(wall);
  g.add(P.stars(900, 11, 120, -0.9));
  const c = P.constellation(P.SAGITTARIUS[0], P.SAGITTARIUS[1], 4, 1); P.at(c, -8, 4, -70); g.add(c);
  return { g, center: new THREE.Vector3(-2.4, 1.0, -70) };
};

// ---------------- the stage ----------------
class Ep02Stage implements Stage3D {
  rig = new Rig(); root = this.rig.root;
  shot: ShotDef; keys: Key[] = [];
  field?: ReturnType<typeof buildField>; desk?: ReturnType<typeof buildDesk>; chart?: ReturnType<typeof buildChart>; radio?: ReturnType<typeof buildRadio>; skymap?: ReturnType<typeof buildSkyMap>;
  ptex?: { tex: THREE.CanvasTexture; draw: (c: number, w: number) => void; last: string };
  constructor(id: number) {
    this.shot = SHOTS[id - 1];
    const ls = (n: number) => Math.round(LINES[n].t0 * FPS) - this.shot.a; // local frame at which line n starts
    switch (id) {
      case 1: { this.makeDesk(0, 0); this.keys = [
        { f: 0, pos: [0.12, 1.28, 0.42], look: [0.1, 0.95, -0.22], fov: 30 },
        { f: 50, dur: 40, pos: [0.0, 1.1, 0.18], look: [0.0, 0.95, -0.38], fov: 26 }]; break; }
      case 2: { this.field = buildField(this.root); this.keys = [
        { f: 0, pos: [-16, 1.6, 26], look: [0, 8.5, -10], fov: 44 },
        { f: 60, dur: 60, pos: [-3, 3, 19], look: [0, 10, -10], fov: 40 },
        { f: 112, dur: 45, pos: [11, 2.2, 10], look: [9.3, 1.7, -0.5], fov: 38 }]; break; }
      case 3: { this.makeDesk(1, 0); this.keys = [
        { f: 0, pos: [0.5, 1.7, 5.0], look: [0.1, 1.1, 0], fov: 40 },
        { f: 30, dur: 50, pos: [0.35, 1.5, 1.8], look: [0.1, 0.97, -0.15], fov: 30 },
        { f: 185, dur: 40, pos: [0.2, 1.7, 7.2], look: [0, 1.3, 0], fov: 40 }]; break; }
      case 4: { this.chart = buildChart(this.root); this.keys = [
        { f: 0, pos: [-0.6, 1.9, 9.6], look: [0, 1.8, 0], fov: 54 },
        { f: 150, dur: 90, pos: [0.3, 1.9, 8.8], look: [0.2, 1.8, 0], fov: 52 },
        { f: 280, dur: 60, pos: [0.0, 2.0, 9.8], look: [0, 1.8, 0], fov: 54 }]; break; }
      case 5: { this.radio = buildRadio(this.root); this.skymap = buildSkyMap(this.root); this.skymap.g.visible = false; this.keys = [
        { f: 0, pos: [0.2, 1.4, 3.2], look: [0, 1.32, 0.2], fov: 30 },
        { f: 90, dur: 40, pos: [0.0, 1.34, 2.3], look: [0, 1.31, 0.2], fov: 28 },
        { f: 135, cut: true, dur: 1, pos: [-2.4, 0.4, -20], look: [-2.4, 3.0, -70], fov: 52 },
        { f: 285, dur: 150, pos: [-2.4, 0.9, -34], look: [-2.4, 1.0, -70], fov: 24 }]; break; }
      case 6: { this.field = buildField(this.root); this.keys = [
        { f: 0, pos: [-12, 1.8, 20], look: [0, 9, -10], fov: 44 },
        { f: 30, dur: 90, pos: [6, 2.6, 13], look: [-1, 10.5, -10], fov: 38 }]; break; }
      default: { this.makeDesk(2, 0); this.keys = [
        { f: 0, pos: [0.6, 2.1, 8.6], look: [0, 2.1, 0], fov: 38 },
        { f: 200, dur: 120, pos: [0.2, 2.1, 7.8], look: [0, 2.1, 0], fov: 38 }]; }
    }
    void ls;
  }
  makeDesk(mode: number, _x: number) {
    const draw = (c: number, w: number) => { const k = `${c.toFixed(2)}|${w.toFixed(2)}`; if (this.ptex && this.ptex.last !== k) { const t = printoutTex(c, w); (this.desk!.paper.material as THREE.MeshBasicMaterial).map = t; this.ptex.tex.dispose(); this.ptex.tex = t; this.ptex.last = k; } };
    const t0 = printoutTex(mode === 0 ? 0 : 1, mode === 0 ? 0 : 1);
    this.desk = buildDesk(this.root, t0);
    this.ptex = { tex: t0, draw, last: "init" };
  }
  update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const sh = this.shot, lf = f - sh.a, id = sh.id;
    const c = camPath(this.keys, lf, id === 1 ? 0.0012 : 0.0018);
    const focus = this.rig.frame(cam, scene, c, "night", { az: id === 4 ? 70 : 35, el: 36, focusR: id === 2 || id === 6 ? 40 : 14 });
    const t = f / FPS;
    let cInf = 0;
    const lt = this.rig.light2D(cam);
    const put = (key: string, x: number, z: number, draw: (p: any, o: any) => void, o: any, scale = 1, y = 0) => {
      const d = cam.position.distanceTo(new THREE.Vector3(x, y + 1, z)) / scale;
      const [w, h, k] = this.rig.tier(d);
      this.rig.card(cam, { key: key + JSON.stringify(o) + lt, draw: (p) => draw(p, { ...o, light: lt }), w, h, k, x, y, z, scale });
    };
    const gloom = (x: number, z: number, o: any, scale = 1) => put("gloom", x, z, drawGloom, { talk: Math.round(talkNow(f, "gloom") * 8) / 8, blink: blinkAt(f, 3) > 0.3 ? 1 : 0, ...o }, scale);
    const moth = (x: number, z: number, o: any, scale = 0.8) => put("moth", x, z, drawMoth, { talk: Math.round(talkNow(f, "moth") * 8) / 8, blink: blinkAt(f, 5) > 0.3 ? 1 : 0, ...o }, scale);
    const beam = (x: number, z: number, scale: number, a1: number, bend: number, len: number, on = 1) => {
      const fh = flashHand(GLOOM, 3, a1, bend), Rv = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), s = SU * scale;
      const hx = x + Rv.x * (fh.x - 300) * s, hz = z + Rv.z * (fh.x - 300) * s, hy = (975 - fh.y) * s;
      const ang = Math.atan2(-fh.dy, fh.dx), L = len;
      const cx = hx + Rv.x * Math.cos(ang) * L / 2, cz = hz + Rv.z * Math.cos(ang) * L / 2, cy = hy + Math.sin(ang) * L / 2;
      this.rig.fxCard(cam, { key: "beam", cw: 512, ch: 256, draw: (p) => fxBeam(p, 512, 256), x: cx, y: cy, z: cz, w: L, h: L * 0.42 * on, soft: true, rot: ang });
    };
    const gflash = (talkExtra: any = {}) => ({ expr: "neutral", ...talkExtra });

    switch (id) {
      case 1: {
        cInf = 15;
        const u = clamp01(lf / 100), w = clamp01((lf - 90) / 30);
        this.ptex!.draw(Math.round(smooth(u) * 40) / 40, Math.round(w * 6) / 6);
        break;
      }
      case 2: {
        const F = this.field!;
        const tilt = 0.5 + 0.12 * Math.sin(lf / 40) + (lf > 120 ? 0.4 * smooth((lf - 120) / 60) : 0);
        F.pivot.rotation.x = -tilt;
        F.rings.forEach((r, i) => { const p = ((lf / 90 + i / F.rings.length) % 1); r.position.set(0, 3 + p * 60, 0); r.rotation.x = Math.PI / 2; r.scale.setScalar(1.2 - 0.5 * (1 - p)); (r.material as THREE.MeshBasicMaterial).opacity = 0.9 * Math.sin(Math.PI * p); r.visible = lf > 20; });
        (F.tip.material as THREE.MeshBasicMaterial).color.set("#ff5a6e").multiplyScalar(1.6 + 1.2 * (Math.sin(lf / 6) > 0 ? 1 : 0));
        if (lf > 105) { moth(8.5, -0.6, { expr: "nervous", look: -1 }, 0.9); gloom(10.3, -0.3, { expr: "neutral", point: 55, bend: 20, flash: true }, 0.95); }
        cInf = lf > 110 ? 8 : 0;
        break;
      }
      case 3: {
        const D = this.desk!;
        const u = clamp01((lf - 20) / 120), w = clamp01((lf - 150) / 40);
        this.ptex!.draw(Math.round(smooth(u) * 40) / 40, Math.round(w * 6) / 6);
        const pointing = 70 + 8 * Math.sin(lf / 22);
        gloom(0.8, 0.5, gflash({ point: pointing, bend: 14, flash: true }), 1);
        beam(0.8, 0.5, 1, pointing, 14, 1.8, lf > 8 ? 1 : 0);
        moth(-0.7, 0.6, { expr: lf > 170 ? "shock" : "nervous", wave: lf > 170 ? 0.3 : undefined }, 0.82);
        if (lf > 190) this.rig.fxCard(cam, { key: "b1", cw: 760, ch: 400, draw: (p) => fxBubble(p, 760, 400, "THAT'S IT?", "#f4f1ff", "#241726", 120), x: -0.55, y: 2.45, z: 0.6, w: 1.05, h: 0.55 });
        cInf = lf < 30 ? 7 : lf < 180 ? 4 : 8;
        void D;
        break;
      }
      case 4: {
        const C = this.chart!;
        C.bars.forEach((b, i) => { const st = 20 + i * 38, u = smooth(clamp01((lf - st) / 40)), over = 1 + 0.06 * Math.sin(clamp01((lf - st) / 40) * Math.PI); const h = b.userData.v * 0.095 * u * over + 0.001; b.scale.y = Math.max(0.001, h); b.position.y = 0.12 + h / 2; });
        const letters = ["6", "E", "Q", "U", "J", "5"];
        C.bars.forEach((b, i) => { const st = 20 + i * 38; if (lf > st + 20) { const hh = b.scale.y; this.rig.fxCard(cam, { key: "pl" + letters[i], cw: 160, ch: 160, draw: (p) => fxPlate(p, 160, 160, letters[i], i === 3 ? "#ffe44d" : "#e8f6ff", "#241726", 120), x: b.position.x, y: 0.12 + hh + 0.34, z: 0.0, w: 0.5, h: 0.5 }); } });
        const U = C.bars[3];
        if (lf > 215) this.rig.fxCard(cam, { key: "x30", cw: 380, ch: 190, draw: (p) => fxPlate(p, 380, 190, "30X", "#ffe44d", "#241726", 150), x: U.position.x + 0.1, y: 0.12 + U.scale.y + 0.95, z: 0.1, w: 1.15, h: 0.57 });
        const pt = 60 + 6 * Math.sin(lf / 25);
        gloom(1.05, 3.4, gflash({ point: pt, bend: 12, flash: true, talk: undefined }), 0.9);
        beam(1.05, 3.4, 0.9, pt, 12, 2.0, lf > 150 ? 1 : 0.0);
        cInf = 7;
        break;
      }
      case 5: {
        const R = this.radio!, S = this.skymap!;
        R.g.visible = lf < 135; S.g.visible = lf >= 135;
        if (lf < 135) {
          const sweep = 1 - Math.pow(1 - clamp01(lf / 100), 3);
          R.setFreq(1400 + 20 * sweep + (lf < 100 ? 2.2 * Math.sin(lf / 4) * (1 - sweep) : 0));
          cInf = 14;
        } else cInf = 0;
        break;
      }
      case 6: {
        const F = this.field!;
        F.pivot.rotation.x = -(0.5 + 0.4 * Math.sin(lf / 35));
        F.pivot.rotation.z = 0.9 * Math.sin(lf / 70);
        F.rings.forEach((r) => (r.visible = false));
        const yrs = ["1987", "1989", "1995", "1999"];
        yrs.forEach((y, i) => { const fw = new THREE.Vector3(); cam.getWorldDirection(fw); const Rv2 = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0); const px = cam.position.x + fw.x * 12 / Math.hypot(fw.x, fw.z) * Math.hypot(fw.x, fw.z), pz = cam.position.z + fw.z * 12, py = 11.4 - i * 1.3;
          if (lf > 6 + i * 22) this.rig.fxCard(cam, { key: "yr" + y, cw: 440, ch: 220, draw: (p) => fxPlate(p, 440, 220, y, "#e8f6ff", "#241726", 170), x: px, y: py, z: pz, w: 2.4, h: 1.2 });
          if (lf > 20 + i * 22) this.rig.fxCard(cam, { key: "no" + y, cw: 220, ch: 220, draw: (p) => { p.g.lineCap = "round"; p.g.strokeStyle = "#241726"; p.g.lineWidth = 56; p.g.beginPath(); p.g.moveTo(30, 30); p.g.lineTo(190, 190); p.g.moveTo(190, 30); p.g.lineTo(30, 190); p.g.stroke(); p.g.strokeStyle = "#ff4057"; p.g.lineWidth = 34; p.g.stroke(); }, x: px + Rv2.x * 1.05, y: py, z: pz + 0.1 + Rv2.z * 1.05, w: 0.8, h: 0.8 }); });
        put("bisc", 1.8, 9.5, drawBiscuit, { expr: lf > 85 ? "wide" : "stare", look: 0, tail: 1 }, 1.4, 0);
        cInf = 0;
        break;
      }
      default: {
        const D = this.desk!; void D;
        const u = lf;
        this.ptex!.draw(1, 1);
        const sh2 = 0.5 + 0.5 * Math.sin(u / 18);
        gloom(0.1, 0.8, { expr: lf > 300 ? "smile" : "neutral", point: 20 + 8 * sh2, bend: 0, flash: true }, 1);
        const bubbles: [string, number, number][] = [["REFLECTION", -0.85, 3.0], ["ONE-OFF BURST", 0.0, 3.55], ["FLICKER", 0.85, 3.0]];
        bubbles.forEach(([txt, x, y], i) => { if (lf > 10 + i * 36) { const pop = smooth(clamp01((lf - 10 - i * 36) / 10)); this.rig.fxCard(cam, { key: "q" + i, cw: 760, ch: 400, draw: (p) => fxBubble(p, 760, 400, txt, "#f4f1ff", "#241726", txt.length > 9 ? 84 : 112), x, y: y + 0.12 * Math.sin(lf / 20 + i), z: 0.1 - i * 0.02, w: 0.95 * pop, h: 0.5 * pop });
          if (lf > 24 + i * 36) this.rig.fxCard(cam, { key: "qm" + i, cw: 160, ch: 160, draw: (p) => fxQ(p, 160, 160), x: x + 0.3, y: y + 0.55 + 0.1 * Math.sin(lf / 15 + i), z: 0.12, w: 0.42, h: 0.42 }); } });
        cInf = 7;
        break;
      }
    }
    this.rig.finish();
    void t;
    return { focus: id === 2 || id === 6 ? new THREE.Vector3(...c.look) : focus, cInf, light: "night" as const };
  }
}

const Layer: React.FC<{ id: number; f: number }> = ({ id, f }) => {
  const make = useMemo(() => () => new Ep02Stage(id), [id]);
  return <ShotView make={make} frame={f} />;
};
export const Ep02: React.FC = () => {
  const f = useCurrentFrame();
  const sh = shotAt(f);
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      <Layer key={sh.id} id={sh.id} f={f} />
      <CaptionTrack caps={CAPS} y={1240} />
    </AbsoluteFill>
  );
};
