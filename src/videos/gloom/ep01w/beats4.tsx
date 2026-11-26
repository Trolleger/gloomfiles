// EP01 v8 shot table (docs/EP01_SCRIPT_v8.md): 15 shots, each a literal place for its line. Keys are in fractions u of the shot.
import React, { useMemo } from "react";
import * as THREE from "three";
import { ShotView } from "../Shot";
import { Stage3, Shot3, ALLW, K3, Cast3 } from "./beats3";
import { W4 } from "./worlds4";
import { useKit } from "./kit";

Object.assign(ALLW, W4);
const k = (u: number, pos: [number, number, number], look: [number, number, number], fov: number, o: Partial<K3> = {}): K3 => ({ u, pos, look, fov, ...o });
const g = (d: number, lat: number, s: number, o: Partial<Cast3> = {}): Cast3 => ({ rel: [d, lat], s, ...o });
const NIGHT = { az: 125, el: 42 }, FRONT = { az: 165, el: 52 };

export const SHOTS4: Shot3[] = [
  { id: "S01", line: "A man online says he can curse strangers to death,", world: "deskNight", light: "night", sun: NIGHT, caption: "CURSE STRANGERS", cInf: 5,
    keys: [k(0, [2.4, 2.0, 2.4], [0.5, 0.2, -14], 54), k(1, [1.2, 1.7, -1.4], [0.3, -1.6, -20], 46, { du: 0.8 })], cast: [{ x: 0.2, z: -4.4, y: 0, s: 1.3, fig: { outfit: "anon", expr: "stern" } }, g(4.6, 1.3, 0.8, { point: 120, expr: "stern" })] },
  { id: "S02", line: "and it only works when he stops trying.", world: "island", light: "night", sun: NIGHT, caption: "STOPS TRYING", cInf: 5,
    keys: [k(0, [2.6, 2.4, 2.6], [0, 1.6, -6], 52), k(1, [1.2, 2.2, -0.2], [0.4, 1.8, -6], 44, { du: 0.8, roll: 0.04 })], cast: [{ x: 0.2, z: -4.8, y: 0.7, s: 1.1, fig: { outfit: "anon", expr: "neutral" } }, g(4.4, -1.3, 0.8, { point: 130, expr: "neutral" })] },
  { id: "S03", line: "He posted in a Death Note thread,", world: "deathNote", light: "night", sun: NIGHT, caption: "DEATH NOTE", cInf: 5,
    keys: [k(0, [-1.2, 3.8, 0.6], [0, 1.6, -5.4], 50), k(1, [-0.6, 3.2, -1.6], [0, 1.7, -5.4], 42, { du: 0.8, roll: -0.04 })], cast: [g(4.2, 1.4, 0.8, { point: 40, expr: "stern", beam: 0.9 })] },
  { id: "S04", line: "and his blog logs colds, missed buses and, very rarely, death.", world: "logStreet", light: "night", sun: NIGHT, caption: "VERY RARELY", cInf: 5,
    keys: [k(0, [0.5, 2.6, 9], [0.5, 2.6, -6], 62), k(0.34, [-4.2, 2.4, 3], [-4.0, 1.6, -6], 50, { du: 0.12 }), k(0.62, [1.0, 2.4, 3], [1.4, 1.6, -6], 50, { du: 0.12 }), k(1, [5.8, 2.4, 3], [5.9, 1.4, -6], 46, { du: 0.12 })], cast: [{ x: -3.6, z: -6, y: 0, s: 1.25, fig: { outfit: "green", expr: "shock" } }, { x: -1.0, z: -5.4, y: 0, s: 1.25, fig: { outfit: "runner", expr: "nervous", wave: 60 } }, g(6.5, 1.8, 0.9, { point: 40, expr: "neutral" })] },
  { id: "S05", line: "He says he prints their photo, pisses on it, says their name, and wishes the worst, with no thinking, just anger.", world: "bathroom", light: "golden", sun: FRONT, caption: "JUST ANGER", cInf: 5,
    keys: [k(0, [0, 2.6, 1.2], [0, 1.0, -4], 60), k(1, [0, 3.4, -0.6], [0, 0.6, -3.4], 46, { du: 0.8 })], cast: [{ x: 0, z: -3.9, y: 0, s: 1.3, fig: { outfit: "anon", expr: "stern", wave: 20 } }, g(4.2, 1.6, 0.75, { point: 30, expr: "shock", beam: 1.0 })] },
  { id: "S06", line: "Then he ran it like a lab: forty targets, each matched with a control, coded in advance so nobody could say he edited it.", world: "labForty", light: "day", sun: FRONT, caption: "FORTY TARGETS", cInf: 5,
    keys: [k(0, [0, 4.4, 6], [0, 1.4, -12], 56), k(1, [-2, 2.8, -1], [-3, 1.2, -9], 44, { du: 0.8 })], cast: [g(6.2, -1.8, 1.0, { point: 60, expr: "neutral", beam: 1.2 })] },
  { id: "S07", line: "One reply says three hits out of eight,", world: "eightboxes", light: "night", sun: NIGHT, caption: "3 OF 8", cInf: 5,
    keys: [k(0, [0, 4.4, 10], [0, 4.4, -9], 56), k(1, [0, 4.2, 5.5], [0, 4.4, -9], 46, { du: 0.8 })], cast: [] },
  { id: "S08", line: "like hitting a one-metre target from a thousand metres, in a storm.", world: "range", light: "night", sun: NIGHT, caption: "1000 METRES", cInf: 0,
    keys: [k(0, [-1.2, 1.5, 2.2], [0, 1.6, -200], 46), k(1, [-0.8, 1.7, 1.2], [0, 3.0, -700], 32, { du: 0.7, roll: 0.05 })], cast: [g(4.4, 0.9, 0.9, { point: 82, expr: "nervous", beam: 1.4 })] },
  { id: "S09", line: "Then he went silent for a week.", world: "emptyDesk", light: "golden", sun: FRONT, caption: "SILENT", cInf: 5,
    keys: [k(0, [3.2, 2.4, 2.4], [0, 1.5, -5.6], 50), k(1, [1.8, 2.2, -0.4], [0, 1.4, -5.6], 42, { du: 0.8, roll: -0.04 })], cast: [g(4.4, 1.4, 0.85, { point: 40, expr: "stern", beam: 1.0 })] },
  { id: "S10", line: "That's when an anon wrote, \"I didn't think there were others like me.\"", world: "attic2", light: "golden", sun: FRONT, caption: "OTHERS LIKE ME", cInf: 5,
    keys: [k(0, [-0.2, 2.5, 2.4], [1.8, 1.7, -4.8], 54), k(1, [0.6, 2.2, -0.4], [1.8, 1.7, -4.8], 44, { du: 0.8, roll: 0.04 })], cast: [{ x: 1.8, z: -5.8, y: 0, s: 1.25, fig: { outfit: "anonPink", expr: "neutral" } }, g(4.2, -1.5, 0.8, { point: 130, expr: "neutral" })] },
  { id: "S11", line: "His blog takes anonymous comments, so someone left one.", world: "commentBox", light: "night", sun: NIGHT, caption: "LEFT ONE", cInf: 5,
    keys: [k(0, [0, 5.2, 13], [0, 6.2, -8], 52), k(1, [0, 4.4, 7], [0, 6.0, -8], 46, { du: 0.8 })], cast: [g(6.5, -1.8, 1.2, { point: 60, expr: "neutral", beam: 1.0 })] },
  { id: "S12", line: "Luckily, nobody can prove he hurt anyone. Unluckily, nobody can prove he didn't.", world: "courtroom", light: "day", sun: FRONT, caption: "NO PROOF", cInf: 5,
    keys: [k(0, [0, 3.6, 8.5], [0, 4.4, -8], 62), k(1, [0, 3.3, 2.6], [0, 4.4, -8], 52, { du: 0.8 })], cast: [g(6.2, 1.6, 1.0, { point: 40, expr: "stern", beam: 1.0 })] },
  { id: "S13", line: "You see, belief is powerful. Ever been so scared you froze?", world: "graveyardPath", light: "night", sun: NIGHT, caption: "SO SCARED", cInf: 5,
    keys: [k(0, [-1.2, 2.2, 2.4], [0.4, 1.6, -10], 54), k(1, [-0.6, 2.0, -2.2], [0.4, 1.8, -10], 44, { du: 0.8 })], cast: [{ x: 0.6, z: -4.6, y: 0, s: 1.3, fig: { outfit: "frozen", expr: "shock", wave: 50 } }, g(4.8, -1.2, 0.85, { point: 130, expr: "nervous" })] },
  { id: "S14", line: "In 1942, Walter Cannon argued a curse can kill through fear alone.", world: "lab", light: "night", sun: FRONT, caption: "FEAR ALONE", cInf: 5,
    keys: [k(0, [0.4, 2.1, 3.6], [0.8, 1.6, -5], 48), k(1, [0.5, 2.0, 0.8], [1.0, 1.5, -5], 40, { du: 0.8, roll: -0.05 })], cast: [{ x: 1.0, z: -4.0, y: 0.45, s: 1.1, fig: { outfit: "volunteer", expr: "nervous", wave: 50 } }, g(3.8, -1.4, 0.75, { point: 35, expr: "shock", beam: 1.2 })] },
  { id: "S15", line: "He said it only worked when he stopped trying. Now he's stopped everything, and nobody can say which kind of silence that is.", world: "islandEmpty", light: "night", sun: NIGHT, dim: 0.4, caption: "WHICH SILENCE", cInf: 5,
    keys: [k(0, [2.6, 2.4, 2.6], [0, 1.8, -6], 50), k(1, [3.6, 3.2, 7], [0, 1.2, -8], 58, { du: 0.9 })], cast: [g(4.2, 1.2, 0.8, { point: 40, expr: "neutral" })] },
];

const PULL: Record<string, number> = { S01: 1.5, S03: 1.25, S05: 1.8, S09: 1.45, S10: 1.0, S11: 1.35, S12: 1.0, S14: 1.2 };
for (const s of SHOTS4) { const f = PULL[s.id]; if (!f) continue; s.keys = s.keys.map((q) => ({ ...q, pos: [q.look[0] + (q.pos[0] - q.look[0]) * f, q.pos[1] + (q.pos[1] - q.look[1]) * (f - 1) * 0.5, q.look[2] + (q.pos[2] - q.look[2]) * f] as [number, number, number] })); }

export const Shot4Still: React.FC<{ shot?: number; u?: number }> = ({ shot = 0, u = 0.15 }) => {
  const ready = useKit(), s = SHOTS4[shot], D = 150;
  const make = useMemo(() => () => new Stage3(s, D), [s, ready]);
  if (!ready) return null;
  return <ShotView make={make} frame={Math.round(u * D)} />;
};
