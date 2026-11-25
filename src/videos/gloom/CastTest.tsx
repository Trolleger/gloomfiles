import React from "react";
import * as THREE from "three";
import { AbsoluteFill } from "remotion";
import { Rig, camPath, Key } from "./core";
import { Stage3D, ShotView } from "./Shot";
import { box, plane, lam, cyl } from "./mats";
import { drawGloom, drawMoth, drawBiscuit } from "./cast";
import { flashHand } from "./toon";
import { GLOOM } from "./cast";

class CastTestStage implements Stage3D {
  rig = new Rig();
  root = this.rig.root;
  keys: Key[] = [
    { f: 0, pos: [0, 1.5, 9.5], look: [0, 1.0, 0], fov: 40 },
    { f: 90, dur: 60, pos: [0.1, 1.3, 7.0], look: [0, 1.1, 0], fov: 36 },
  ];
  constructor() {
    const floor = plane(60, 60, lam("#34396b")); floor.rotation.x = -Math.PI / 2; this.root.add(floor);
    this.root.add(box(24, 8, 0.4, lam("#3b2f55"), 0, 4, -3));
    this.root.add(box(2.4, 0.3, 1.0, lam("#6a4a3a"), 0, 0.15, -1.5));
    this.root.add(cyl(0.2, 0.2, 2, lam("#3a3f7a"), -3, 1, -2.5));
  }
  update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const c = camPath(this.keys, f);
    const focus = this.rig.frame(cam, scene, c, "night");
    const lt = this.rig.light2D(cam);
    const blink = 0;
    const put = (id: string, x: number, z: number, draw: any, scale = 1, extra: any = {}) => {
      const d = cam.position.distanceTo(new THREE.Vector3(x, 1, z));
      const [w, h, k] = this.rig.tier(d / scale);
      this.rig.card(cam, { key: id + JSON.stringify(extra) + lt, draw: (p) => draw(p, { ...extra, light: lt }), w, h, k, x, y: 0, z, scale });
    };
    put("gloom", -1.0, 0, drawGloom, 1, { expr: "neutral", point: 70, bend: 8, talk: (f % 12) / 12 });
    put("moth", 0.2, 0.4, drawMoth, 0.78, { expr: "nervous" });
    put("bisc", 1.1, 0.7, drawBiscuit, 0.5, { expr: "stare" });
    this.rig.finish();
    return { focus, cInf: 12, light: "night" as const };
  }
}
export const CastTest: React.FC = () => <AbsoluteFill style={{ background: "#0a0e24" }}><ShotView make={() => new CastTestStage()} /></AbsoluteFill>;
