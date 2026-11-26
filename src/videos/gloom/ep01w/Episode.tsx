// EP01 full episode on the approved storyboard worlds: 15 shots (2.6-7 s), hard cuts / 8 f crossfades, gliding cameras that always creep in.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Rig, camPath, Key, SU, smooth, clamp01 } from "../core";
import { Stage3D, ShotView } from "../Shot";
import { drawGloom, GLOOM } from "../cast";
import { flashHand } from "../toon";
import { fxBeam } from "../fxdraw";
import { W } from "./worlds";
import { BEATS, Beat, CastSpec } from "./beats";
import { LINES, CAPS, TOTAL, FPS, VOICE_FILE, TAKE } from "../ep01";
import takeFast from "../../../../build/ep01/ep01_words_fast.json";
import takeDef from "../../../../build/ep01/ep01_words.json";
import { CaptionTrack } from "../../../Caption";
import { mouthFromWords, blinkAt } from "../../../lib/anim";
import { FONT_DISPLAY } from "../../../theme";

const TK = TAKE === "fast" ? takeFast : takeDef;
const LEAD = LINES[0].t0 - TK.sections[0].start;
const WORDS = (TK.words as { start: number; end: number }[]).map((w) => ({ start: LEAD + w.start, end: LEAD + w.end }));

// seconds are video seconds (voice time + LEAD). `beat` indexes BEATS (B14 = tally, B15 = second bedroom).
type Seg = { beat: number; a: number; b: number; cut?: "xfade" | "hard" };
const v = (s: number) => LEAD + s;
const SEGS: Seg[] = [
  { beat: 0, a: 0, b: v(3.0) },
  { beat: 1, a: v(3.0), b: v(6.3), cut: "xfade" },
  { beat: 2, a: v(6.3), b: v(9.3), cut: "xfade" },
  { beat: 3, a: v(9.3), b: v(12.0), cut: "xfade" },
  { beat: 4, a: v(12.0), b: v(17.5), cut: "xfade" },
  { beat: 5, a: v(17.5), b: v(26.3), cut: "xfade" },
  { beat: 6, a: v(26.3), b: v(33.5), cut: "xfade" },
  { beat: 13, a: v(33.5), b: v(38.5), cut: "hard" },
  { beat: 7, a: v(38.5), b: v(42.9), cut: "xfade" },
  { beat: 14, a: v(42.9), b: v(48.3), cut: "xfade" },
  { beat: 8, a: v(48.3), b: v(61.0), cut: "xfade" },
  { beat: 9, a: v(61.0), b: v(69.3), cut: "xfade" },
  { beat: 10, a: v(69.3), b: v(79.4), cut: "xfade" },
  { beat: 11, a: v(79.4), b: v(90.4), cut: "xfade" },
  { beat: 12, a: v(90.4), b: TOTAL / FPS, cut: "xfade" },
];
const XF = 8;
/** pieces: long segments are cut into <= 6.5 s sub-shots, the 2nd, 3rd... use a closer framing */
type Piece = { beat: number; a: number; b: number; variant: number; cut?: "xfade" | "hard" };
const PIECES: Piece[] = [];
SEGS.forEach((s) => { const n = Math.max(1, Math.ceil((s.b - s.a) / 6.6)), L = (s.b - s.a) / n; for (let i = 0; i < n; i++) PIECES.push({ beat: s.beat, a: s.a + i * L, b: s.a + (i + 1) * L, variant: i, cut: i === 0 ? s.cut : "hard" }); });

const EXTRA: Beat[] = [
  { id: "B14", line: "three successes out of eight", world: "tally", light: "golden", caption: "3 OF 8", cInf: 5, still: 40, sun: { az: 165, el: 52 },
    keys: [{ f: 0, pos: [-2.4, 1.8, 3.0], look: [0, 2.6, -6], fov: 50 }, { f: 100, pos: [-0.8, 2.0, 0.6], look: [0, 2.6, -6], fov: 42, dur: 40 }], cast: [{ x: 0, z: 0, rel: [3.4, -0.6], s: 0.66, point: 60, beam: 1.4 }] },
  { id: "B15", line: "he keeps writing about failure", world: "bedroomA", light: "golden", caption: "FAILURE", cInf: 5, still: 40, sun: { az: 150, el: 52 },
    keys: [{ f: 0, pos: [2.4, 1.8, 3.4], look: [-1.0, 1.8, -5], fov: 52, roll: -0.04 }, { f: 100, pos: [0.8, 2.0, 1.4], look: [-1.0, 1.9, -5], fov: 44, dur: 40 }], cast: [{ x: 0, z: 0, rel: [3.6, 0.55], s: 0.66, point: 70, bend: 4 }] },
];
const ALL = [...BEATS, ...EXTRA];

/** keys for a piece of D frames: base framing, or the closer variant; second glide near the end, third lateral glide for long pieces */
const makeKeys = (b: Beat, D: number, variant: number): Key[] => {
  const k0 = b.keys[0], k1 = b.keys[1];
  const toward = (p: [number, number, number], l: [number, number, number], t: number): [number, number, number] => [p[0] + (l[0] - p[0]) * t, p[1] + (l[1] - p[1]) * t, p[2] + (l[2] - p[2]) * t];
  const base: Key = variant ? { ...k0, pos: toward(k0.pos, k0.look, 0.1), fov: (k0.fov ?? 44) - 4, roll: (k0.roll ?? 0) * -1 || 0.035 } : k0;
  const end: Key = variant ? { ...k1, pos: toward(k0.pos, k0.look, 0.3), fov: (k1.fov ?? 42) - 4 } : k1;
  const ks: Key[] = [{ ...base, f: 0 }, { ...end, f: Math.max(30, Math.round(D * 0.82)), dur: Math.min(40, Math.round(D * 0.55)) }];
  if (D > 150) { const last = ks[1]; ks.push({ ...last, f: D - 3, dur: 36, pos: [last.pos[0] + (variant ? -0.7 : 0.7), last.pos[1] + 0.05, last.pos[2]], roll: (last.roll ?? 0) * -1 }); }
  return ks;
};

const gloomKey = (f: number, cs: CastSpec) => ({ talk: Math.round(mouthFromWords(f, FPS, WORDS) * 8) / 8, blink: blinkAt(f, 3) > 0.3 ? 1 : 0, point: Math.round((cs.point ?? 40) + 5 * Math.sin(f / 22)) });

class PieceStage implements Stage3D {
  rig = new Rig(); root = this.rig.root; cast: CastSpec[]; keys: Key[];
  dk: number;
  constructor(public b: Beat, public D: number, public off: number, variant: number) {
    this.dk = variant ? 0.62 : 1;
    const g = new THREE.Group(); W[b.world](g); this.root.add(g);
    this.keys = makeKeys(b, D, variant);
    const c = camPath(this.keys, 0, 0.0016), f = new THREE.Vector3(c.look[0] - c.pos[0], 0, c.look[2] - c.pos[2]).normalize(), r = new THREE.Vector3(-f.z, 0, f.x);
    this.cast = b.cast.map((cs) => (cs.rel ? { ...cs, x: c.pos[0] + f.x * cs.rel[0] * (variant ? 0.62 : 1) + r.x * cs.rel[1], z: c.pos[2] + f.z * cs.rel[0] * (variant ? 0.62 : 1) + r.z * cs.rel[1] } : cs));
  }
  update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const c = camPath(this.keys, f, 0.0009);
    this.rig.frame(cam, scene, c, this.b.light, { az: this.b.sun?.az ?? (this.b.light === "night" ? 40 : undefined), el: this.b.sun?.el, focusR: 14 });
    const lt = this.rig.light2D(cam), abs = f + this.off;
    // the guide walks with the camera: placed relative to the CURRENT camera (stays in frame through glides and creeps)
    const fw = new THREE.Vector3(c.look[0] - c.pos[0], 0, c.look[2] - c.pos[2]).normalize(), rt = new THREE.Vector3(-fw.z, 0, fw.x);
    const live = this.cast.map((cs, i) => { const rel = this.b.cast[i].rel; return rel ? { ...cs, x: c.pos[0] + fw.x * rel[0] * this.dk + rt.x * rel[1], z: c.pos[2] + fw.z * rel[0] * this.dk + rt.z * rel[1] } : cs; });
    live.forEach((cs, i) => {
      const s = (cs.s ?? 0.9), d = cam.position.distanceTo(new THREE.Vector3(cs.x, 1, cs.z)) / s, [w, h, kk] = this.rig.tier(d), gk = gloomKey(abs, cs);
      this.rig.card(cam, { key: "g" + JSON.stringify([gk, cs.bend, !!cs.beam]) + lt, draw: (p) => drawGloom(p, { expr: cs.expr ?? "neutral", point: gk.point, bend: cs.bend ?? 8, talk: gk.talk, blink: gk.blink, light: lt, flash: !!cs.beam }), w, h, k: kk, x: cs.x, y: cs.y ?? 0, z: cs.z, scale: s });
      if (cs.beam) { const fh = flashHand(GLOOM, 3, gk.point, cs.bend ?? 8), Rv = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), su = SU * s;
        const hx = cs.x + Rv.x * (fh.x - 300) * su, hz = cs.z + Rv.z * (fh.x - 300) * su, hy = (975 - fh.y) * su + (cs.y ?? 0), ang = Math.atan2(-fh.dy, fh.dx), L = cs.beam;
        this.rig.fxCard(cam, { key: "beam", cw: 512, ch: 256, draw: (p) => fxBeam(p, 512, 256), x: hx + Rv.x * Math.cos(ang) * L / 2, y: hy + Math.sin(ang) * L / 2, z: hz + Rv.z * Math.cos(ang) * L / 2, w: L, h: L * 0.42, soft: true, rot: ang }); }
      void i;
    });
    this.rig.finish();
    const c0 = this.cast[0];
    return { focus: c0 ? new THREE.Vector3(c0.x, (c0.y ?? 0) + 1.4 * (c0.s ?? 1), c0.z) : new THREE.Vector3(...c.look), cInf: this.b.cInf, light: this.b.light };
  }
}

const aF = (p: Piece) => Math.round(p.a * FPS), bF = (p: Piece) => Math.round(p.b * FPS);
const Layer: React.FC<{ i: number; f: number; alpha: number }> = ({ i, f, alpha }) => {
  const p = PIECES[i], make = useMemo(() => () => new PieceStage(ALL[p.beat], bF(p) - aF(p), aF(p), p.variant), [i]);
  return <ShotView make={make} frame={f - aF(p)} alpha={alpha} />;
};
const layersAt = (f: number): { i: number; alpha: number }[] => {
  let cur = PIECES.findIndex((p) => f >= aF(p) && f < bF(p)); if (cur < 0) cur = PIECES.length - 1;
  const n = PIECES[cur + 1];
  if (n && n.cut === "xfade" && f >= aF(n) - XF / 2 - 4) { const u = clamp01((f - (aF(n) - XF)) / XF); if (u > 0) return [{ i: cur, alpha: 1 }, { i: cur + 1, alpha: u }]; }
  return [{ i: cur, alpha: 1 }];
};
const Disclaimer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, endA = TOTAL / FPS - 3.6;
  const on = t < LEAD - 0.3 || t > endA; if (!on) return null;
  const a = t < LEAD - 0.3 ? smooth(clamp01(t / 0.3)) * smooth(clamp01((LEAD - 0.3 - t) / 0.3)) : smooth(clamp01((t - endA) / 0.3));
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 560, padding: "46px 30px", borderRadius: 26, background: "rgba(16,14,40,.88)", border: "10px solid #ffe44d", textAlign: "center", opacity: a, fontFamily: FONT_DISPLAY }}>
      <div style={{ color: "#ffe44d", fontSize: 66, letterSpacing: 2 }}>ANONYMOUS ONLINE CLAIMS</div>
      <div style={{ color: "#fff", fontSize: 120, margin: "6px 0" }}>UNVERIFIED</div>
      <div style={{ color: "#fff", fontSize: 58 }}>NO NAMES. NO LINKS.</div>
    </div>
  );
};
export const Ep01W: React.FC = () => {
  const f = useCurrentFrame();
  const L = layersAt(f);
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      {L.map((l) => <Layer key={l.i} i={l.i} f={f} alpha={l.alpha} />)}
      <Sequence from={Math.round(LEAD * FPS)}><Audio src={staticFile(VOICE_FILE)} /></Sequence>
      <CaptionTrack caps={CAPS} y={1240} />
      <Disclaimer f={f} />
    </AbsoluteFill>
  );
};
export const PIECE_COUNT = PIECES.length;
export { TOTAL };
