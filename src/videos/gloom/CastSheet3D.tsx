// Landscape contact sheet of the cast as they render in the real pipeline (ink, lens blur, grade, lit cards).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill } from "remotion";
import { Rig } from "./core";
import { Stage3D, ShotView } from "./Shot";
import { box, plane, lam } from "./mats";
import { drawGloom, drawMoth, drawBiscuit } from "./cast";
import { FONT_DISPLAY } from "../../theme";

type Item = { id: string; label: string; x: number; row: 0 | 1; kind: "g" | "m" | "b"; o: any; scale?: number };
const R1 = 0, R2 = -3.0;
const G = (label: string, o: any, x: number): Item => ({ id: "g" + label, label, x, row: 0, kind: "g", o });
const ITEMS: Item[] = [
  G("deadpan", { expr: "neutral", point: 14 }, -5.2),
  G("talking, light on", { expr: "neutral", point: 78, bend: 10, talk: 0.6 }, -2.9),
  G("stern", { expr: "stern", point: 14, headTilt: -3 }, -0.6),
  G("shock", { expr: "shock", point: 14, talk: 0 }, 1.7),
  G("squint", { expr: "smile", point: 14, headTilt: 4 }, 4.0),
  { id: "m1", label: "MOTH nervous", x: -5.4, row: 1, kind: "m", o: { expr: "nervous" }, scale: 0.82 },
  { id: "m2", label: "shock", x: -3.6, row: 1, kind: "m", o: { expr: "shock", wave: 0.2 }, scale: 0.82 },
  { id: "m3", label: "relief", x: -1.8, row: 1, kind: "m", o: { expr: "relief" }, scale: 0.82 },
  { id: "m4", label: "grin", x: 0.0, row: 1, kind: "m", o: { expr: "grin", talk: 0.5 }, scale: 0.82 },
  { id: "b1", label: "BISCUIT stare", x: 2.3, row: 1, kind: "b", o: { expr: "stare" }, scale: 0.62 },
  { id: "b2", label: "annoyed", x: 3.7, row: 1, kind: "b", o: { expr: "annoyed", tail: 1 }, scale: 0.62 },
  { id: "b3", label: "relieved", x: 5.1, row: 1, kind: "b", o: { expr: "relieved" }, scale: 0.62 },
];
const FOV = 30, D = 13.6, LOOKY = -0.7, ASP = 1920 / 1080;
class SheetStage implements Stage3D {
  rig = new Rig(); root = this.rig.root;
  constructor() {
    for (const y of [R1, R2]) { const s = box(13.6, 0.18, 1.6, lam("#4a4d70"), 0, y - 0.09, -0.2); this.root.add(s); }
    this.root.add(box(40, 20, 0.3, lam("#2a2c4a"), 0, 0, -4));
    const floor = plane(80, 40, lam("#1f2140")); floor.rotation.x = -Math.PI / 2; floor.position.y = -4.2; this.root.add(floor);
  }
  update(_f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const focus = this.rig.frame(cam, scene, { pos: [0, LOOKY, D], look: [0, LOOKY, 0], fov: FOV, roll: 0 }, "night", { az: 25, el: 40, focusR: 14 });
    const lt = this.rig.light2D(cam);
    for (const it of ITEMS) {
      const y = it.row ? R2 : R1, sc = it.scale ?? 1;
      const [w, h, k] = this.rig.tier(8 / sc);
      const draw = it.kind === "g" ? drawGloom : it.kind === "m" ? drawMoth : drawBiscuit;
      this.rig.card(cam, { key: it.id + lt, draw: (p) => (draw as any)(p, { ...it.o, light: lt }), w: 1350, h: 1500, k: 1.5, x: it.x, y, z: 0, scale: sc, yaw: 0 });
    }
    this.rig.finish();
    return { focus, cInf: 0, light: "night" as const };
  }
}
export const CastSheet3D: React.FC = () => {
  const half = D * Math.tan((FOV * Math.PI) / 360) * ASP, sx = (x: number) => 960 + (x / half) * 960;
  const sy = (y: number) => 540 - ((y - LOOKY) / (D * Math.tan((FOV * Math.PI) / 360))) * 540;
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      <ShotView make={() => new SheetStage()} frame={0} w={1920} h={1080} />
      <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 56, letterSpacing: 6, color: "#fff" }}>GLOOM FILES · CAST v3 (skill pipeline)</div>
      {ITEMS.map((it) => (
        <div key={it.id} style={{ position: "absolute", left: sx(it.x) - 160, width: 320, top: sy(it.row ? R2 : R1) + 22, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 30, letterSpacing: 2, color: "#c9d0ff" }}>{it.label}</div>
      ))}
    </AbsoluteFill>
  );
};
