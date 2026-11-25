import React from "react";
import * as THREE from "three";
import { AbsoluteFill } from "remotion";
import { Rig } from "./core";
import { Stage3D, ShotView } from "./Shot";
import { box, lam } from "./mats";
import { drawGloom } from "./cast";

class Close implements Stage3D {
  rig = new Rig(); root = this.rig.root;
  constructor() { this.root.add(box(40, 20, 0.3, lam("#2a2c4a"), 0, 5, -3)); }
  update(_f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const focus = this.rig.frame(cam, scene, { pos: [0.05, 1.55, 2.6], look: [0.0, 1.42, 0], fov: 24, roll: 0 }, "night", { az: 30, el: 38, focusR: 6 });
    const lt = this.rig.light2D(cam);
    this.rig.card(cam, { key: "gc" + lt, draw: (p) => drawGloom(p, { expr: "neutral", light: lt, point: 14 }), w: 2700, h: 3000, k: 3, x: 0, y: 0, z: 0, scale: 1, yaw: 0 });
    this.rig.finish();
    return { focus, cInf: 0, light: "night" as const };
  }
}
export const GloomClose: React.FC = () => <AbsoluteFill style={{ background: "#0a0c1c" }}><ShotView make={() => new Close()} frame={0} w={1080} h={1080} /></AbsoluteFill>;
