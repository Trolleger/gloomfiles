// Thumbnail sheet of the whole prop library, rendered in the real pipeline (ink, grade, lit). Doubles as the visual catalog.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill } from "remotion";
import { Rig } from "./core";
import { Stage3D, ShotView } from "./Shot";
import { box, lam } from "./mats";
import * as P from "./props";
import { printoutTex } from "./paper";
import { drawGloom, drawMoth, drawBiscuit } from "./cast";
import { FONT_DISPLAY } from "../../theme";

type Entry = { name: string; make: () => THREE.Object3D; card?: (p: any, o: any) => void; yaw?: number; lift?: number };
const nz = (s: string, f: () => THREE.Object3D, extra: Partial<Entry> = {}): Entry => ({ name: s, make: f, ...extra });
export const CATALOG: Entry[] = [
  // sky + terrain
  nz("stars", () => P.stars(90, 2, 1.0, 0.0, 3)), nz("moon", () => P.moon(0.6, [0, 0, 0])), nz("constellation", () => P.constellation(P.SAGITTARIUS[0], P.SAGITTARIUS[1], 4, 0.05)),
  nz("ground", () => P.ground(3)), nz("hills", () => { const h = P.hills(5, "#2a3560", 3, 1); h.scale.setScalar(0.03); return h; }), nz("tree round", () => P.tree("round")), nz("tree cone", () => P.tree("cone")), nz("tree dead", () => P.tree("dead")),
  nz("rock", () => P.rock(0.8)), nz("playa", () => P.playa(3)), nz("ocean", () => P.ocean(3)), nz("iceberg", () => P.iceberg(1)), nz("buoy", () => P.buoy()),
  // buildings
  nz("house", () => P.house()), nz("timber house", () => P.timber()), nz("hut", () => P.hut()), nz("skyscraper", () => P.skyscraper(4, 16, 4)), nz("skyline", () => P.skyline(7, 40, 3, 30)), nz("lamppost", () => P.lamppost()), nz("fence", () => P.fence(4)), nz("cobbles", () => P.cobbles(3, 3)),
  // furniture + devices
  nz("desk", () => P.desk()), nz("lamp", () => P.lampDesk()), nz("mug", () => P.mug()), nz("pen", () => P.pen()), nz("bookshelf", () => P.bookshelf()), nz("chair", () => P.chair()), nz("couch", () => P.couch()), nz("crate", () => P.crate()), nz("archive boxes", () => P.archiveBoxes()),
  nz("CRT TV", () => P.crt()), nz("monitor", () => P.monitor()), nz("arcade cabinet", () => P.arcade()), nz("radio dish", () => P.dish(), { lift: 0 }), nz("radio mast", () => P.mast(10)), nz("shortwave radio", () => { const r = P.radio(); (r.h.setFreq as any)(1420); return r; }),
  nz("wall clock", () => P.clockWall()), nz("gavel", () => P.gavel()), nz("walkie-talkie", () => P.walkie()), nz("microphone", () => P.mic()), nz("speaker", () => P.speaker()),
  // paper + icons
  nz("printout", () => P.sheet(printoutTex(1, 1), 0.46, 0.92), { yaw: 0 }), nz("notice card", () => P.notice("+0:33", 5, 3)), nz("corkboard", () => P.corkboard(3, 1.8)), nz("pin", () => P.pin()), nz("book", () => P.book("#6a3f58", 0.5, 0.7, 0.12, "BOOK")), nz("open book", () => P.openBook()), nz("folder", () => P.folder()), nz("magazine", () => P.magazine("MAG")),
  nz("calendar page", () => P.calendarPage()), nz("world map", () => P.worldMap(3.4)), nz("wax seal", () => P.seal()), nz("lock", () => P.lockIcon()), nz("key", () => P.keyIcon()), nz("mask", () => P.maskIcon()),
  // charts
  nz("bar chart", () => { const c = P.barChart([6, 14, 26, 30, 19, 5], 3); (c.h.setBars as any)(() => 1); return c; }), nz("curve", () => P.curve((u) => Math.sin(u * Math.PI) ** 2, 2.4, 1.2)), nz("spectrogram", () => P.spectrogram(2.4, 1.4)),
  // cast + figures
  nz("PROFESSOR GLOOM", () => new THREE.Group(), { card: drawGloom }), nz("MOTH", () => new THREE.Group(), { card: drawMoth }), nz("BISCUIT", () => new THREE.Group(), { card: drawBiscuit }),
  nz("silhouette", () => new THREE.Group(), { card: (p, o) => P.drawSilhouette(p, { ...o, hat: true }) }), nz("dancer", () => new THREE.Group(), { card: (p, o) => P.drawDancer(p, { ...o, t: 1 }) }), nz("monster", () => new THREE.Group(), { card: P.drawMonster }),
];
const COLS = 8, CELL = 2.0, ROWS = Math.ceil(CATALOG.length / COLS);
const FOV = 14, ELEV = 12 * (Math.PI / 180);
const VH = ROWS * CELL, D = VH / 2 / Math.tan((FOV * Math.PI) / 360);
class SheetStage implements Stage3D {
  rig = new Rig(); root = this.rig.root; cells: { e: Entry; x: number; y: number }[] = [];
  constructor() {
    const back = box(COLS * CELL + 4, ROWS * CELL + 4, 0.2, lam("#232647"), 0, 0, -2.5); this.root.add(back);
    CATALOG.forEach((e, i) => {
      const cx = (i % COLS) * CELL - (COLS * CELL) / 2 + CELL / 2, cy = (ROWS * CELL) / 2 - Math.floor(i / COLS) * CELL - CELL / 2;
      this.root.add(box(CELL - 0.12, 0.05, CELL * 0.7, lam("#3a3f6a"), cx, cy - CELL * 0.4, 0));
      this.cells.push({ e, x: cx, y: cy });
      if (!e.card) {
        const o = e.make(); o.rotation.y = e.yaw ?? -0.5; this.root.add(o);
        const bb = new THREE.Box3().setFromObject(o), sz = bb.getSize(new THREE.Vector3()), s = Math.min((CELL * 0.8) / Math.max(sz.x, sz.z * 0.8, 0.01), (CELL * 0.7) / Math.max(sz.y, 0.01));
        o.scale.setScalar(s); const bb2 = new THREE.Box3().setFromObject(o), c = bb2.getCenter(new THREE.Vector3());
        o.position.set(cx - c.x, cy - CELL * 0.4 + 0.03 - bb2.min.y, 0 - c.z);
        if (e.name === "printout" || e.name === "magazine" || e.name === "folder" || e.name === "calendar page" || e.name === "wax seal" || e.name === "notice card" || e.name === "world map" || e.name === "corkboard") {/* flat items stand up for the thumbnail */}
      }
    });
  }
  update(_f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const focus = this.rig.frame(cam, scene, { pos: [0, Math.sin(ELEV) * D, Math.cos(ELEV) * D], look: [0, 0, 0], fov: FOV, roll: 0 }, "night", { az: 25, el: 42, focusR: ROWS * CELL * 0.8 });
    const lt = this.rig.light2D(cam);
    for (const { e, x, y } of this.cells) if (e.card) {
      const sc = e.name === "BISCUIT" ? 0.38 : e.name === "MOTH" ? 0.48 : e.name === "monster" ? 0.36 : 0.52;
      this.rig.card(cam, { key: e.name + lt, draw: (p) => e.card!(p, { light: lt }), w: 900, h: 1000, k: 1, x, y: y - CELL * 0.4 + 0.03, z: 0, scale: sc, yaw: 0 });
    }
    this.rig.finish();
    return { focus, cInf: 0, light: "night" as const };
  }
}
const SZ = 2000;
export const PropSheet: React.FC = () => {
  const sx = (x: number) => SZ / 2 + (x / (COLS * CELL / 2)) * (SZ / 2) * ((COLS * CELL) / (ROWS * CELL)) ;
  const heightPx = SZ * (ROWS / COLS) ;
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      <ShotView make={() => new SheetStage()} frame={0} w={SZ} h={Math.round(heightPx)} />
      {CATALOG.map((e, i) => {
        const col = i % COLS, row = Math.floor(i / COLS), cw = SZ / COLS, ch = heightPx / ROWS;
        return <div key={e.name} style={{ position: "absolute", left: col * cw, width: cw, top: row * ch + ch * 0.9, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: 1.5, color: "#c9d0ff", textTransform: "uppercase" }}>{e.name}</div>;
      })}
    </AbsoluteFill>
  );
};
export const SHEET_SIZE = { w: SZ, h: Math.round(SZ * (ROWS / COLS)) };
