// EP01 beat table: each beat = its own world + light + camera keys + cast. Used by the storyboard stills and the full build.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Rig, camPath, Key, SU } from "../core";
import { Stage3D, ShotView } from "../Shot";
import { drawGloom } from "../cast";
import { drawSilhouette } from "../props/figures";
import { Light } from "../lights";
import { W } from "./worlds";
import { flashHand } from "../toon";
import { GLOOM } from "../cast";
import { fxBeam } from "../fxdraw";

export type CastSpec = { rel?: [number, number]; x: number; z: number; s?: number; y?: number; point?: number; bend?: number; beam?: number; expr?: any; sil?: boolean; mirror?: boolean };
export type Beat = { id: string; line: string; world: keyof typeof W; light: Light; caption: string; keys: Key[]; cast: CastSpec[]; cInf: number; sun?: { az: number; el: number }; still: number };
const k = (f: number, pos: [number, number, number], look: [number, number, number], fov = 44, o: Partial<Key> = {}): Key => ({ f, pos, look, fov, ...o });

const g = (d: number, lat: number, s = 0.9, o: Partial<CastSpec> = {}): CastSpec => ({ x: 0, z: 0, rel: [d, lat], s, ...o });
export const BEATS: Beat[] = [
  { id: "B01", line: "/x/ is 4chan's paranormal board.", world: "vault", light: "night", caption: "/X/", cInf: 5, still: 36,
    keys: [k(0, [0.6, 1.5, 2.0], [0, 2.4, -30], 46), k(110, [0.2, 1.8, -4.0], [0, 2.8, -45], 48, { dur: 40 })], cast: [g(5.4, -0.42, 0.62, { point: 70, beam: 1.6 })] },
  { id: "B02", line: "It began in January 2005 as a photography board", world: "studio05", light: "day", caption: "JAN 2005", cInf: 5, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [-3.0, 1.7, 5.0], [1.2, 2.0, -6], 50, { roll: 0.04 }), k(100, [-1.8, 1.8, 2.6], [1.6, 2.0, -6], 48, { dur: 36, roll: 0 })], cast: [g(4.6, -0.5, 0.7, { point: 15, bend: 8 })] },
  { id: "B03", line: "and switched to the unexplained in February 2007.", world: "studio07", light: "golden", caption: "FEB 2007", cInf: 5, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [-3.0, 1.7, 5.0], [1.2, 2.2, -6], 50, { roll: -0.04 }), k(100, [-1.8, 1.8, 2.6], [1.6, 2.2, -6], 46, { dur: 36 })], cast: [g(4.6, -0.5, 0.7, { point: 55, bend: 8, beam: 1.4 })] },
  { id: "B04", line: "Eight posts, two hours and forty-three minutes.", world: "clocktower", light: "night", caption: "2 H 43 MIN", cInf: 3, still: 40,
    keys: [k(0, [2.5, 1.5, 6.0], [-1, 7, -26], 54, { roll: 0.04 }), k(100, [1.5, 2.6, -1.0], [-2, 12, -26], 48, { dur: 40 })], cast: [g(6.2, 0.5, 0.8, { point: 80, beam: 1.4 })] },
  { id: "B05", line: "The title borrows from Death Note.", world: "notebook", light: "golden", caption: "2003", cInf: 8, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [-2.6, 1.8, 2.6], [0, 1.5, -4], 50), k(100, [-1.2, 1.8, 0.8], [0, 1.4, -4], 44, { dur: 40, roll: 0.05 })], cast: [g(3.2, 0.6, 0.62, { point: 150, beam: 0.9 })] },
  { id: "B06", line: "...silent for a week...", world: "emptyhouse", light: "golden", caption: "SILENT 1 WEEK", cInf: 7, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [2.2, 1.8, 3.0], [-1.0, 1.8, -5.5], 50), k(100, [0.8, 1.9, -0.4], [-0.6, 1.8, -5.5], 44, { dur: 40, roll: -0.04 })], cast: [g(3.4, -0.55, 0.66, { point: 60, beam: 1.4 })] },
  { id: "B07", line: "real life, no results, boredom, the feds.", world: "bedroomA", light: "golden", caption: "THE FEDS", cInf: 5, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [-2.0, 1.8, 3.4], [0.8, 1.9, -5], 52), k(100, [0.0, 2.0, 1.6], [1.0, 2.0, -5], 46, { dur: 40, roll: 0.04 })], cast: [g(3.6, -0.55, 0.66, { point: 20, bend: 4 })] },
  { id: "B08", line: "like hitting a one-metre target at a thousand metres in a storm.", world: "range", light: "night", caption: "1 IN 1000", cInf: 0, still: 70,
    keys: [k(0, [-1.2, 1.5, 2.2], [0, 1.6, -200], 46), k(110, [-0.8, 2.0, 0.4], [0, 3.0, -700], 40, { dur: 50, roll: 0.05 })], cast: [g(5.4, -0.42, 0.66, { point: 82, beam: 1.4 })] },
  { id: "B09", line: "It cites a book, The Forbidden Parapsychology.", world: "bookshop", light: "golden", caption: "112 PAGES", cInf: 7, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [-1.6, 1.9, 2.0], [1.4, 1.8, -4], 50, { roll: -0.05 }), k(100, [0.4, 2.0, -0.4], [1.4, 1.8, -4], 42, { dur: 40, roll: 0 })], cast: [g(3.2, -0.55, 0.66, { point: 40, beam: 0.9 })] },
  { id: "B10", line: "Dion Fortune published Psychic Self-Defence in 1930.", world: "study30", light: "golden", caption: "1930", cInf: 6, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [3.2, 1.8, 2.4], [-0.6, 1.8, -5], 50), k(100, [1.4, 1.9, -0.2], [-0.6, 1.9, -5], 42, { dur: 40, roll: 0.04 })], cast: [g(3.4, 0.55, 0.66, { point: 140, beam: 1.0 })] },
  { id: "B11", line: "In 1942, Walter Cannon argued...", world: "lab42", light: "day", caption: "1942", cInf: 6, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [-2.0, 1.8, 2.6], [0.2, 1.6, -5], 50), k(100, [-0.4, 1.8, -0.6], [0.4, 1.6, -5], 42, { dur: 40, roll: -0.05 })], cast: [g(3.4, -0.55, 0.66, { point: 30, beam: 1.2 })] },
  { id: "B12", line: "At two fifteen, an anon says...", world: "threerooms", light: "night", caption: "+2 H 15", cInf: 4, still: 40,
    keys: [k(0, [0, 11.0, 24], [0, 10.0, -5], 46), k(110, [0.0, 12.5, 15], [0, 11.0, -5], 46, { dur: 70 })], cast: [{ x: -3.4, z: -4.2, y: 0, s: 1.1, point: 30 }] },
  { id: "B13", line: "...shows no reply from him. None of it can be verified.", world: "empty", light: "night", caption: "NO REPLY", cInf: 5, still: 40, sun: { az: 165, el: 52 },
    keys: [k(0, [2.5, 1.8, 2.5], [0, 2.0, -8], 48), k(110, [0.6, 2.2, -0.8], [0, 2.2, -8], 38, { dur: 50, roll: -0.04 })], cast: [g(5.4, -0.42, 0.70, { point: 60, beam: 1.2 })] },
];

class BeatStage implements Stage3D {
  rig = new Rig(); root = this.rig.root;
  cast: CastSpec[];
  constructor(public b: Beat) {
    const g = new THREE.Group(); W[b.world](g); this.root.add(g);
    const c = camPath(b.keys, b.still, 0.0016), f = new THREE.Vector3(c.look[0] - c.pos[0], 0, c.look[2] - c.pos[2]).normalize(), r = new THREE.Vector3(-f.z, 0, f.x);
    this.cast = b.cast.map((cs) => cs.rel ? { ...cs, x: c.pos[0] + f.x * cs.rel[0] + r.x * cs.rel[1], z: c.pos[2] + f.z * cs.rel[0] + r.z * cs.rel[1] } : cs);
  }
  update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const c = camPath(this.b.keys, f, 0.0016);
    const focus = this.rig.frame(cam, scene, c, this.b.light, { az: this.b.sun?.az ?? (this.b.light === "night" ? 40 : undefined), el: this.b.sun?.el, focusR: 14 });
    const lt = this.rig.light2D(cam);
    this.cast.forEach((cs, i) => {
      const s = cs.s ?? 0.9, d = cam.position.distanceTo(new THREE.Vector3(cs.x, 1, cs.z)) / s;
      const [w, h, kk] = this.rig.tier(d);
      if (cs.sil) this.rig.card(cam, { key: "sil" + i + lt, draw: (p) => drawSilhouette(p, { col: "#12102a" }), w, h, k: kk, x: cs.x, y: cs.y ?? 0, z: cs.z, scale: s });
      else this.rig.card(cam, { key: "g" + JSON.stringify([cs.point, cs.bend]) + lt, draw: (p) => drawGloom(p, { expr: cs.expr ?? "neutral", point: cs.point ?? 40, bend: cs.bend ?? 8, light: lt, flash: !!cs.beam }), w, h, k: kk, x: cs.x, y: cs.y ?? 0, z: cs.z, scale: s, mirror: cs.mirror });
      if (cs.beam) { const fh = flashHand(GLOOM, 3, cs.point ?? 40, cs.bend ?? 8), Rv = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), su = SU * s;
        const hx = cs.x + Rv.x * (fh.x - 300) * su, hz = cs.z + Rv.z * (fh.x - 300) * su, hy = (975 - fh.y) * su + (cs.y ?? 0), ang = Math.atan2(-fh.dy, fh.dx), L = cs.beam;
        this.rig.fxCard(cam, { key: "beam", cw: 512, ch: 256, draw: (p) => fxBeam(p, 512, 256), x: hx + Rv.x * Math.cos(ang) * L / 2, y: hy + Math.sin(ang) * L / 2, z: hz + Rv.z * Math.cos(ang) * L / 2, w: L, h: L * 0.42, soft: true, rot: ang }); }
    });
    this.rig.finish();
    const c0 = this.cast[0]; return { focus: c0 ? new THREE.Vector3(c0.x, (c0.y ?? 0) + 1.5 * (c0.s ?? 1), c0.z) : new THREE.Vector3(...c.look), cInf: this.b.cInf, light: this.b.light };
  }
}
export const makeStage = (b: Beat) => () => new BeatStage(b);
export const BeatStill: React.FC<{ beat?: number; frame?: number }> = ({ beat = 0, frame }) => {
  const b = BEATS[beat]; const make = useMemo(() => makeStage(b), [b]);
  return <ShotView make={make} frame={frame ?? b.still} />;
};
