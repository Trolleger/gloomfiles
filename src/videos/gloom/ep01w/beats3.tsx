// EP01 v3 beat table: 14 shots, each a place that shows its line (docs/EP01_PLAN_v2.md). Keys are in fractions u of the shot length.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Rig, camPath, Key, SU } from "../core";
import { Stage3D, ShotView } from "../Shot";
import { drawGloom, GLOOM } from "../cast";
import { drawSilhouette } from "../props/figures";
import { flashHand, bodyFront, Outfit } from "../toon";
import { fxBeam } from "../fxdraw";
import { Light } from "../lights";
import { TONE } from "../shade";
import { W } from "./worlds";
import { W2 } from "./worlds2";
import { W3 } from "./worlds3";

export const OUTFITS: Record<string, Outfit> = {
  anon: { jacket: "#4a4a8a", pants: "#2a2a40", boots: "#241726", hat: "hair", hair: "#2a1a1a", skin: "#fbf7ee", build: "adult" },
  anonPink: { jacket: "#d85a8a", pants: "#3a2a48", boots: "#241726", hat: "hair", hair: "#6a3a1a", skin: "#fbf7ee", build: "adult" },
  green: { jacket: "#58b868", pants: "#3a3a52", boots: "#241726", hat: "cap", cap: "#e8c24a", skin: "#fbf7ee", build: "adult" },
  runner: { jacket: "#e8c24a", pants: "#3a5a8a", boots: "#f4f1ea", hat: "hair", hair: "#4a2a1a", skin: "#fbf7ee", build: "adult" },
  frozen: { jacket: "#e8c24a", pants: "#3a5a8a", boots: "#241726", hat: "cap", cap: "#d85a6a", skin: "#fbf7ee", build: "adult" },
  volunteer: { jacket: "#a8a8e8", pants: "#4a4a6a", boots: "#241726", hat: "hair", hair: "#3a2a1a", skin: "#fbf7ee", build: "adult" },
};
export const ALLW: Record<string, (R: THREE.Group) => void> = { ...W, ...W2, ...W3 };
export type K3 = { u: number; pos: [number, number, number]; look: [number, number, number]; fov: number; roll?: number; du?: number };
export type FigSpec = { outfit: string; expr?: string; wave?: number; mirror?: boolean };
export type Cast3 = { fig?: FigSpec; rel?: [number, number]; x?: number; z?: number; y?: number; s: number; point?: number; bend?: number; beam?: number; sil?: { arm?: [number, number]; col?: string }; expr?: string };
export type Shot3 = { dim?: number; id: string; line: string; world: string; light: Light; sun?: { az: number; el: number }; caption: string; cInf: number; keys: K3[]; cast: Cast3[] };
const k = (u: number, pos: [number, number, number], look: [number, number, number], fov: number, o: Partial<K3> = {}): K3 => ({ u, pos, look, fov, ...o });
const g = (d: number, lat: number, s: number, o: Partial<Cast3> = {}): Cast3 => ({ rel: [d, lat], s, ...o });
const NIGHT = { az: 125, el: 42 }, FRONT = { az: 165, el: 52 };

export const SHOTS3: Shot3[] = [
  { id: "S01", line: "an anonymous poster says he can attack strangers with his mind. Eight tries, three hits.", world: "targets8", light: "night", sun: NIGHT, caption: "THREE HITS", cInf: 4,
    keys: [k(0, [1.6, 1.8, 3.0], [0, 2.2, -22], 54), k(1, [0.8, 2.0, -3.0], [0, 2.4, -26], 44, { du: 0.7 })], cast: [g(4.4, 0.8, 0.72, { point: 120, beam: 0 })] },
  { id: "S02", line: "Then he went silent.", world: "emptychair", light: "golden", sun: FRONT, caption: "SILENT", cInf: 6,
    keys: [k(0, [3.2, 1.8, 0.6], [0, 1.3, -4.6], 50), k(1, [1.6, 1.6, -1.2], [0, 1.2, -4.6], 42, { du: 0.8, roll: -0.04 })], cast: [g(3.5, 0.6, 0.66, { point: 40, beam: 1.0 })] },
  { id: "S03", line: "It happened on /x/, 4chan's paranormal board.", world: "board", light: "night", sun: NIGHT, caption: "/X/", cInf: 4,
    keys: [k(0, [-2, 2.2, 5], [0, 5.5, -11], 56), k(1, [0, 3.4, -1], [0, 6, -11], 48, { du: 0.8 })], cast: [g(6, -0.7, 0.8, { point: 60, beam: 1.4 })] },
  { id: "S04", line: "Eight posts, two hours forty-three.", world: "posts8", light: "night", sun: NIGHT, caption: "2 H 43", cInf: 3,
    keys: [k(0, [1.5, 1.8, 5], [0, 6.5, -14], 58, { roll: 0.04 }), k(1, [0.8, 2.4, -2], [0, 12, -20], 50, { du: 0.8 })], cast: [g(5.2, 0.8, 0.6, { point: 80, beam: 1.4 })] },
  { id: "S05", line: "The title borrows from Death Note, where a name in a notebook kills.", world: "notebookdesk", light: "night", sun: NIGHT, caption: "KILLS", cInf: 6,
    keys: [k(0, [-0.4, 3.7, 2.4], [-0.3, 1.6, -5.4], 58), k(1, [-0.3, 2.9, -1.0], [-0.3, 1.5, -5.4], 46, { du: 0.8, roll: 0.05 })], cast: [g(4.4, -0.7, 0.62, { point: 30, beam: 0.9 })] },
  { id: "S06", line: "He'd been silent a week. His last thread was archived.", world: "archive", light: "golden", sun: FRONT, caption: "A WEEK", cInf: 6,
    keys: [k(0, [1.6, 2.0, 2.6], [-1.2, 2.4, -6], 52), k(1, [-0.2, 2.0, -0.8], [-1.6, 2.4, -5], 44, { du: 0.8, roll: -0.04 })], cast: [g(4.2, 0.9, 0.6, { point: 50, beam: 1.0 })] },
  { id: "S07", line: "Replies guess: real life, no results, boredom, the feds.", world: "guesses", light: "night", sun: NIGHT, caption: "THE FEDS", cInf: 5,
    keys: [k(0, [0, 9.8, 22], [0, 9.8, -6], 58), k(0.28, [-3.6, 11.5, 1.5], [-3.6, 11.2, -6], 46, { du: 0.14 }), k(0.5, [3.6, 11.5, 1.5], [3.6, 11.2, -6], 46, { du: 0.12 }), k(0.74, [-3.6, 2.8, 1.5], [-3.6, 2.6, -6], 46, { du: 0.12 }), k(1, [3.6, 2.8, 1.5], [3.6, 2.6, -6], 44, { du: 0.12 })], cast: [{ x: -13.4, z: -3.6, y: 0.6, s: 0.5, point: 60 }] },
  { id: "S08", line: "One gives the number: three of eight,", world: "eightboxes", light: "night", sun: NIGHT, caption: "3 OF 8", cInf: 5,
    keys: [k(0, [0, 4.4, 10], [0, 4.4, -9], 56), k(1, [0, 4.2, 5.5], [0, 4.4, -9], 46, { du: 0.8 })], cast: [] },
  { id: "S09", line: "like hitting a one-metre target at a thousand metres in a storm.", world: "range", light: "night", sun: NIGHT, caption: "1 IN 1000", cInf: 0,
    keys: [k(0, [-1.2, 1.5, 2.2], [0, 1.6, -200], 46), k(1, [-0.8, 1.7, 1.2], [0, 3.0, -700], 32, { du: 0.7, roll: 0.05 })], cast: [g(4.0, -0.7, 0.62, { point: 82, beam: 1.4 })] },
  { id: "S10", line: "Another cites a book, The Forbidden Parapsychology, sold as techniques for influencing people from a distance.", world: "bookmap", light: "night", sun: NIGHT, caption: "FROM A DISTANCE", cInf: 6,
    keys: [k(0, [0, 9, 5], [0, 1, -12], 52), k(1, [0, 3.6, 1.4], [0, 1.8, -3.4], 44, { du: 0.7 })], cast: [g(3.4, -0.7, 0.66, { point: 40, beam: 0.9 })] },
  { id: "S11", line: "The idea is old. Dion Fortune wrote Psychic Self-Defence in 1930,", world: "study", light: "golden", sun: FRONT, caption: "1930", cInf: 6,
    keys: [k(0, [2.2, 1.8, 1.4], [0.6, 1.7, -4.4], 46), k(1, [1.4, 1.9, -0.6], [0.8, 1.7, -4.2], 40, { du: 0.8, roll: 0.04 })], cast: [g(3.6, -0.7, 0.62, { point: 130, beam: 1.0 }), { x: 2.0, z: -3.6, y: 0, s: 0.9, sil: { arm: [-80, -80], col: "#1a1030" } }] },
  { id: "S12", line: "and in 1942 Walter Cannon argued belief in a curse could kill through fear alone.", world: "lab", light: "night", sun: FRONT, caption: "FEAR ALONE", cInf: 6,
    keys: [k(0, [0.4, 2.1, 3.6], [0.8, 1.6, -5], 48), k(1, [0.5, 2.0, 0.8], [1.0, 1.5, -5], 40, { du: 0.8, roll: -0.05 })], cast: [g(3.2, -1.0, 0.62, { point: 35, beam: 1.2 }), { x: 1.0, z: -3.9, y: 0.3, s: 0.85, sil: { arm: [-90, -90], col: "#4a4a88" } }] },
  { id: "S13", line: "Later, an anon says they didn't think there were others like them... A third says they left one.", world: "threerooms", light: "night", sun: NIGHT, caption: "+2 H 43", cInf: 4,
    keys: [k(0, [0, 11, 24], [0, 10, -5], 46), k(1, [0, 6, 15], [0, 6, -5], 46, { du: 0.85 })], cast: [{ x: -3.6, z: -4.4, y: 0, s: 1.0, point: 30 }] },
  { id: "S14", line: "The thread never defines a success, names a target, or shows a reply from him. None of it can be verified.", world: "empty", light: "night", sun: NIGHT, caption: "NO REPLY", cInf: 5,
    keys: [k(0, [2.5, 1.8, 2.5], [0, 2.0, -8], 48), k(1, [0.6, 2.2, -0.8], [0, 2.2, -8], 38, { du: 0.9, roll: -0.04 })], cast: [g(4.0, -0.9, 0.7, { point: 60, beam: 1.2 })] },
];

/** camera keys of a shot in frames for a length of D frames */
export const keysFor = (s: Shot3, D: number): Key[] => s.keys.map((q, i) => ({ f: Math.round(q.u * D), dur: Math.round((q.du ?? 0.7) * D), pos: q.pos, look: q.look, fov: q.fov, roll: q.roll ?? 0, ...(i === 0 ? { dur: undefined } : {}) }));

export class Stage3 implements Stage3D {
  rig = new Rig(); root = this.rig.root; cast: { x: number; z: number; c: Cast3 }[];
  constructor(public s: Shot3, public D: number, public extra?: (f: number, rig: Rig, cam: THREE.PerspectiveCamera) => void) {
    const grp = new THREE.Group(); ALLW[s.world](grp); this.root.add(grp);
    const c0 = camPath(keysFor(s, D), 0, 0), f = new THREE.Vector3(c0.look[0] - c0.pos[0], 0, c0.look[2] - c0.pos[2]).normalize(), r = new THREE.Vector3(-f.z, 0, f.x);
    this.cast = s.cast.map((c) => ({ c, x: c.rel ? c0.pos[0] + f.x * c.rel[0] + r.x * c.rel[1] : c.x ?? 0, z: c.rel ? c0.pos[2] + f.z * c.rel[0] + r.z * c.rel[1] : c.z ?? 0 }));
  }
  talk?: (lf: number) => number; kc?: Key[];
  keys() { return (this.kc ??= this.framed(keysFor(this.s, this.D))); }
  /** keep Gloom's fixed mark in frame at every key: never closer than 2.6 m ahead, never wider than 0.22 of the distance off the view axis */
  framed(ks: Key[]): Key[] {
    const m = this.cast.find((q) => !q.c.sil && q.c.rel); if (!m) return ks;
    return ks.map((k) => {
      const f = new THREE.Vector3(k.look[0] - k.pos[0], 0, k.look[2] - k.pos[2]).normalize(), r = new THREE.Vector3(-f.z, 0, f.x), pos = new THREE.Vector3(...k.pos), look = new THREE.Vector3(...k.look);
      let rel = new THREE.Vector3(m.x - pos.x, 0, m.z - pos.z), df = rel.dot(f);
      if (df < 2.6) { pos.addScaledVector(f, df - 2.6); look.addScaledVector(f, df - 2.6); rel = new THREE.Vector3(m.x - pos.x, 0, m.z - pos.z); df = 2.6; }
      const lat = rel.dot(r), lim = 0.22 * df;
      if (Math.abs(lat) > lim) { const sh = lat - Math.sign(lat) * lim; pos.addScaledVector(r, sh); look.addScaledVector(r, sh); }
      return { ...k, pos: [pos.x, pos.y, pos.z], look: [look.x, look.y, look.z] };
    });
  }
  update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const c = camPath(this.keys(), f, 0.0009);
    this.rig.frame(cam, scene, c, this.s.light, { az: this.s.sun?.az, el: this.s.sun?.el, focusR: 14 });
    if (this.s.dim) { TONE.uLitCol.value.multiplyScalar(this.s.dim); TONE.uShadeCol.value.multiplyScalar(this.s.dim); this.rig.hemi.intensity *= this.s.dim; this.rig.sun.intensity *= this.s.dim; }
    const lt = this.rig.light2D(cam);
    this.cast.forEach(({ c: cs, x, z }, i) => {
      const d = cam.position.distanceTo(new THREE.Vector3(x, 1, z)) / cs.s, [w, h, kk] = this.rig.tier(d), y = cs.y ?? 0;
      if (cs.fig) { const f = cs.fig, key = "fig" + f.outfit + f.expr + f.wave + lt; this.rig.card(cam, { key, draw: (p) => { p.g.translate(150, 0); bodyFront(p, OUTFITS[f.outfit], { mode: "stand", expr: (f.expr as any) ?? "neutral", wave: f.wave, light: lt, seed: 4 }); }, w, h, k: kk, x, y, z, scale: cs.s, mirror: f.mirror }); }
      else if (cs.sil) this.rig.card(cam, { key: "sil" + i + JSON.stringify(cs.sil) + lt, draw: (p) => drawSilhouette(p, { col: cs.sil!.col ?? "#171430", arm: cs.sil!.arm }), w, h, k: kk, x, y, z, scale: cs.s });
      else {
        const tk = Math.round((this.talk?.(f) ?? 0) * 6) / 6, bl = (f % 97) < 4 ? 1 : 0, sway = Math.round((cs.point ?? 40) + 4 * Math.sin(f / 20)); this.rig.card(cam, { key: "g" + JSON.stringify([sway, cs.bend, !!cs.beam, cs.expr, tk, bl]) + lt, draw: (p) => drawGloom(p, { expr: (cs.expr as any) ?? "neutral", point: sway, bend: cs.bend ?? 8, talk: tk, blink: bl, light: lt, flash: !!cs.beam }), w, h, k: kk, x, y, z, scale: cs.s });
        if (cs.beam) { const fh = flashHand(GLOOM, 3, sway, cs.bend ?? 8), Rv = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), su = SU * cs.s, L = cs.beam;
          const hx = x + Rv.x * (fh.x - 300) * su, hz = z + Rv.z * (fh.x - 300) * su, hy = (975 - fh.y) * su + y, ang = Math.atan2(-fh.dy, fh.dx);
          this.rig.fxCard(cam, { key: "beam", cw: 512, ch: 256, draw: (p) => fxBeam(p, 512, 256), x: hx + Rv.x * Math.cos(ang) * L / 2, y: hy + Math.sin(ang) * L / 2, z: hz + Rv.z * Math.cos(ang) * L / 2, w: L, h: L * 0.42, soft: true, rot: ang }); }
      }
    });
    this.extra?.(f, this.rig, cam);
    this.rig.finish();
    const fg = this.cast.find((q) => q.c.fig), c0 = fg ?? this.cast.find((q) => !q.c.sil && !q.c.fig && q.c.s >= 0.95);
    return { focus: c0 ? new THREE.Vector3(c0.x, (c0.c.y ?? 0) + 1.4 * c0.c.s, c0.z) : new THREE.Vector3(...c.look), cInf: this.s.cInf, light: this.s.light };
  }
}
export const Shot3Still: React.FC<{ shot?: number; u?: number }> = ({ shot = 0, u = 0.3 }) => {
  const s = SHOTS3[shot], D = 150; const make = useMemo(() => () => new Stage3(s, D), [s]);
  return <ShotView make={make} frame={Math.round(u * D)} />;
};
