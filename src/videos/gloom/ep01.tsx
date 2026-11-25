// EP 1 (pilot): "Anon Went Quiet". ONE continuous 3D thread room. The camera travels between stations
// (main corkboard, calendar board, bookshelf, history table, monitor desk) so every sentence is SHOWN.
// Gloom is a guide in the room. Script: SCRIPT_v6_info_heavy.md. No names, handles or links anywhere.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Rig, camPath, Key, SU, smooth, clamp01 } from "./core";
import { Stage3D, ShotView } from "./Shot";
import { box, plane, lam, glow, canvasTex } from "./mats";
import { drawGloom, GLOOM } from "./cast";
import { flashHand } from "./toon";
import { fxPlate, fxBeam, fxBubble } from "./fxdraw";
import { drawSilhouette } from "./props/figures";
import * as P from "./props";
import { CaptionTrack, Cap } from "../../Caption";
import { mouthFromWords, Word, blinkAt } from "../../lib/anim";
import takeDefault from "../../../build/ep01/ep01_words.json";
import takeFast from "../../../build/ep01/ep01_words_fast.json";
import { rnd } from "./props/util";

export const FPS = 30;
// Voice take: real Piper (Joe) timings from build/ep01/*.json. ONE-LINE SWITCH: "fast" (97.5 s, chosen) or "default" (natural, 107.9 s).
export const TAKE = "fast" as "default" | "fast"; // Andrew picked the fast take for ep01
const TK = TAKE === "fast" ? takeFast : takeDefault;
export const VOICE_FILE = TAKE === "fast" ? "audio/ep01/ep01_voice_fast.wav" : "audio/ep01/ep01_voice.wav";
const LEAD = 2.6, TAIL = 1.5; // LEAD = opening disclaimer seconds before the voice starts; TAIL after the last word
type TW = { word: string; start: number; end: number; section: number };
const TWORDS = TK.words as TW[];
const RAW: string[] = [
  "/x/ is 4chan's paranormal board. It began in January 2005 as a photography board and switched to the unexplained in February 2007.",
  "Eight posts, two hours and forty-three minutes. The title borrows from Death Note, the 2003 manga where writing a name in a notebook kills.",
  "The original post: a poster who says he runs psychic experiments has been silent for a week, on the board and on his blog. His last thread has been archived.",
  "First reply, with theories: real life, no results, boredom, the feds. It wishes he'd published his method.",
  "Second reply, the number: three successes out of eight experiments in October. Huge, it says, like hitting a one-metre target at a thousand metres in a storm.",
  "A third reply says he keeps writing about failure, as if he expected to win every time. It cites a book, The Forbidden Parapsychology: a 2020 paperback, 112 pages, sold as techniques for influencing people from a distance. The replier says it covers psychic attacks on strangers, not meant to kill.",
  "The idea is old. Occultist Dion Fortune published Psychic Self-Defence in 1930, and said a psychic attack had caused her own breakdown. In 1942, physiologist Walter Cannon argued in Voodoo Death that belief in a curse could kill through fear alone. Later researchers proposed other causes, from slowed heart rate to dehydration.",
  "At two fifteen, an anon says they didn't think there were others like them. Three minutes later, another notes his blog takes anonymous comments. At two forty-three, a third says they left one.",
  "The thread never defines a success, never names a target, and shows no reply from him. None of it can be verified.",
];
export type Line = { text: string; t0: number; t1: number };
export const LINES: Line[] = RAW.map((text, i) => ({ text, t0: LEAD + TK.sections[i].start, t1: LEAD + TK.sections[i].end }));
export const TOTAL_S = LEAD + TK.voice_len + TAIL;
export const TOTAL = Math.ceil(TOTAL_S * FPS);
const WORDS: Word[][] = LINES.map((_l, i) => TWORDS.filter((w) => w.section === i).map((w) => ({ start: LEAD + w.start, end: LEAD + w.end })));
const talkNow = (f: number) => LINES.reduce((m, _l, i) => Math.max(m, mouthFromWords(f, FPS, WORDS[i])), 0);
const A = (i: number, off = 0) => Math.round((LINES[i].t0 + off) * FPS); // frame at line i start + off seconds
const S = (i: number, off: number) => LINES[i].t0 + off; // seconds
/** seconds at the n-th word of line i matching re (+ off); throws if the script word is missing */
const WT = (i: number, re: RegExp, n = 0, off = 0) => {
  const hits = TWORDS.filter((w) => w.section === i && re.test(w.word)), w = hits[Math.min(n, hits.length - 1)];
  if (!w) throw new Error(`ep01: no word ${re} in line ${i}`);
  return LEAD + w.start + off;
};
const WF = (i: number, re: RegExp, n = 0, off = 0) => Math.round(WT(i, re, n, off) * FPS); // frame at that word

export const CAPS: Cap[] = [
  { from: WT(0, /^January/, 0, -0.1), to: WT(0, /^February/, 0, -0.3), text: "JAN 2005" },
  { from: WT(0, /^February/, 0, -0.1), to: LINES[0].t1 + 0.3, text: "FEB 2007" },
  { from: S(1, 0.2), to: S(1, 3.2), text: "EIGHT POSTS" },
  { from: S(1, 3.4), to: S(1, 6.4), text: "2 H 43 MIN" },
  { from: S(2, 0.4), to: S(2, 3.2), text: "POST 1: +0" },
  { from: S(2, 3.8), to: S(2, 8.3), text: "SILENT 1 WEEK" },
  { from: S(3, 0.3), to: S(3, 3.6), text: "+33 MIN" },
  { from: S(3, 3.8), to: S(3, 6.8), text: "NO METHOD" },
  { from: S(4, 0.3), to: S(4, 3.2), text: "+1 H" },
  { from: WT(4, /^three/, 0, -0.1), to: WT(4, /^October/, 0, 0.5), text: "3 OF 8" },
  { from: S(5, 0.3), to: S(5, 3.4), text: "+1 H 27" },
  { from: WT(6, /^1930/, 0, -0.1), to: WT(6, /^attack/, 0, -0.2), text: "1930" },
  { from: WT(6, /^breakdown/, 0, -0.1), to: WT(6, /^breakdown/, 0, 1.6), text: "BREAKDOWN" },
  { from: WT(6, /^1942/, 0, -0.1), to: WT(6, /^1942/, 0, 3.0), text: "1942" },
  { from: WT(7, /^At/, 0, -0.1), to: WT(7, /^Three/, 0, -0.3), text: "+2 H 15" },
  { from: WT(7, /^Three/, 0, -0.1), to: WT(7, /^At/, 1, -0.3), text: "+2 H 18" },
  { from: WT(7, /^At/, 1, -0.1), to: LINES[7].t1 + 0.4, text: "+2 H 43" },
];

// ---------------- textures ----------------
const FD = "'Anton',sans-serif", FT = "'Special Elite','Courier New',monospace";
const postTex = (stamp: string, tag: string, seed: number, dim = false) => canvasTex(512, 640, (g, W, H) => {
  g.fillStyle = dim ? "#4a4660" : "#efe6cf"; g.fillRect(0, 0, W, H); g.fillStyle = dim ? "#3a3650" : "#c8bb98"; g.fillRect(0, 0, W, 12);
  g.fillStyle = "#b02a3e"; g.font = `92px ${FD}`; g.textAlign = "left"; g.fillText(stamp, 30, 118);
  g.fillStyle = "#2b2b46"; g.font = `34px ${FT}`; g.fillText(tag, 32, 170);
  g.fillStyle = dim ? "#34304a" : "#59597a"; for (let i = 0; i < 6; i++) g.fillRect(34, 220 + i * 60, 160 + rnd(i * 7 + seed) * (W - 260), 18);
});
const disclaimerTex = () => canvasTex(900, 640, (g, W, H) => {
  g.fillStyle = "#14122a"; g.fillRect(0, 0, W, H); g.strokeStyle = "#ffe44d"; g.lineWidth = 12; g.strokeRect(24, 24, W - 48, H - 48);
  g.fillStyle = "#ffe44d"; g.textAlign = "center"; g.font = `78px ${FD}`; g.fillText("ANONYMOUS ONLINE CLAIMS", W / 2, 170);
  g.fillStyle = "#f4f1ff"; g.font = `110px ${FD}`; g.fillText("UNVERIFIED", W / 2, 330);
  g.font = `66px ${FD}`; g.fillText("NO NAMES. NO LINKS.", W / 2, 470);
});
const signTex = (txt: string, sub = "") => canvasTex(512, 256, (g, W, H) => {
  g.fillStyle = "#12102a"; g.fillRect(0, 0, W, H); g.strokeStyle = "#7dffd0"; g.lineWidth = 8; g.strokeRect(10, 10, W - 20, H - 20);
  g.fillStyle = "#7dffd0"; g.textAlign = "center"; g.font = `${sub ? 120 : 150}px ${FD}`; g.fillText(txt, W / 2, sub ? 130 : 170); if (sub) { g.font = `52px ${FT}`; g.fillText(sub, W / 2, 205); }
});
const bookTex = (title: string, c: string, sub = "") => canvasTex(256, 340, (g, W, H) => { g.fillStyle = c; g.fillRect(0, 0, W, H); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(0, 0, 18, H); g.fillStyle = "#e8d49a"; g.textAlign = "center"; g.font = `${title.length > 6 ? 40 : 76}px ${FD}`; g.fillText(title, W / 2 + 6, 150); if (sub) { g.font = `26px ${FT}`; g.fillText(sub, W / 2 + 6, 210); } });
const pageTex = (txt: string) => canvasTex(256, 340, (g, W, H) => { g.fillStyle = "#e9dcb8"; g.fillRect(0, 0, W, H); g.fillStyle = "#3a2a1a"; g.textAlign = "center"; g.font = `70px ${FD}`; g.fillText(txt, W / 2, 80); g.fillStyle = "#6a5a40"; for (let i = 0; i < 9; i++) g.fillRect(30, 120 + i * 24, 120 + rnd(i * 3 + txt.length) * 100, 8); });

// ---------------- room ----------------
const COLX = [-0.95, 0.95], rowY = (r: number) => 4.9 - r * 1.3;
const cardPos = (i: number): [number, number] => [COLX[i % 2], rowY(Math.floor(i / 2))];
const STAMPS = ["+0", "+33 MIN", "+1 H", "+1 H 27", "+2 H 15", "+2 H 15", "+2 H 18", "+2 H 43"];
const TAGS = ["THE ORIGINAL POST", "FIRST REPLY", "SECOND REPLY", "THIRD REPLY", "AN ANON", "", "ANOTHER ANON", "A THIRD ANON"];

class Room implements Stage3D {
  rig = new Rig(); root = this.rig.root;
  cards: THREE.Group[] = []; threads: THREE.Object3D[] = [];
  discl: THREE.Mesh; noReply: THREE.Group; screens: THREE.Mesh[] = []; pegs: THREE.Mesh[] = [];
  items: THREE.Object3D[] = []; calA: THREE.Object3D; calB: THREE.Object3D; thr1: THREE.Object3D; tableBook: THREE.Object3D; notebook: THREE.Object3D; histItems: THREE.Object3D[] = [];
  keys: Key[] = [];
  constructor() {
    const R = this.root;
    R.add(P.floorRoom("#2c2748", "#232246", 60));
    // main board (portrait) with 8 post cards and a red thread
    R.add(P.at(P.corkboard(3.6, 5.6), 0, 3.0, -3.35));
    for (let i = 0; i < 8; i++) {
      const [x, y] = cardPos(i);
      const n = P.notice("", 0, i, 0.9, 1.1); n.rotation.z = (rnd(i * 3 + 1) - 0.5) * 0.08;
      const face = n.h.face as THREE.Mesh; (face.material as THREE.MeshBasicMaterial).map = postTex(STAMPS[i], TAGS[i], i, i === 5);
      const g = new THREE.Group(); g.add(n); g.position.set(x, y, -3.3); g.visible = false; this.cards.push(g); R.add(g);
      if (i > 0) { const [px, py] = cardPos(i - 1); const t = P.thread([px, py + 0.5, -3.27], [x, y + 0.5, -3.27]); t.visible = false; this.threads.push(t); R.add(t); }
    }
    // opening / closing disclaimer plate, in front of the board
    this.discl = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.92), new THREE.MeshBasicMaterial({ map: disclaimerTex(), color: new THREE.Color(1.15, 1.15, 1.15) })); this.discl.position.set(0, 3.0, -3.0); R.add(this.discl);
    // the empty "no reply" card
    this.noReply = new THREE.Group(); const nr = P.notice("", 0, 1, 0.9, 1.1); (nr.h.face as THREE.Mesh).material = new THREE.MeshBasicMaterial({ map: canvasTex(512, 640, (g, W, H) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, W, H); g.strokeStyle = "#8a8aa8"; g.setLineDash([22, 16]); g.lineWidth = 8; g.strokeRect(30, 30, W - 60, H - 60); g.fillStyle = "#8a8aa8"; g.font = `120px ${FD}`; g.textAlign = "center"; g.fillText("?", W / 2, H / 2 + 40); }) }); this.noReply.add(nr); this.noReply.position.set(0, 5.1, -3.28); this.noReply.scale.setScalar(0.01); R.add(this.noReply);
    // 8 pegs (3 of 8)
    for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), new THREE.MeshBasicMaterial({ color: "#3a4a8a" })); m.position.set(-0.84 + i * 0.24, 6.1, -3.27); m.visible = false; this.pegs.push(m); R.add(m); }
    // ledge with the notebook (the "Death Note" nod: a generic black notebook, nothing copied)
    R.add(P.at(box(3.0, 0.1, 0.8, lam("#3a2a22")), 0, 0.9, -3.0));
    this.notebook = new THREE.Group(); const nb = P.book("#14121f", 0.5, 0.7, 0.1, ""); nb.rotation.x = -Math.PI / 2 + 0.02; nb.position.set(0, 0.0, 0); this.notebook.add(nb);
    const nbCover = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.28), new THREE.MeshBasicMaterial({ map: canvasTex(256, 180, (g, W, H) => { g.fillStyle = "rgba(0,0,0,0)"; g.clearRect(0, 0, W, H); g.fillStyle = "#e8e0ff"; g.font = `60px ${FD}`; g.textAlign = "center"; g.fillText("NOTEBOOK", W / 2, 110); }), transparent: true })); nbCover.rotation.x = -Math.PI / 2; nbCover.position.set(0, 0.07, 0.05); this.notebook.add(nbCover);
    this.notebook.position.set(-0.7, 0.97, -3.0); this.notebook.rotation.y = 0.3; R.add(this.notebook);
    R.add(P.at(P.spin(P.pen(), 0, 0.5, 0), -0.1, 0.99, -2.9));
    // calendar board (context 1), right of the main board
    R.add(P.at(P.corkboard(2.4, 3.2), 3.9, 2.6, -3.35));
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map: signTex("/x/", "PARANORMAL BOARD"), color: new THREE.Color(1.5, 1.5, 1.5) })); sg.position.set(3.9, 4.55, -3.2); R.add(sg);
    this.calA = P.at(P.calendarPage("2005", "JAN"), 3.3, 2.7, -3.28); this.calB = P.at(P.calendarPage("2007", "FEB"), 4.5, 2.7, -3.28);
    for (const c of [this.calA, this.calB]) { c.scale.setScalar(1.1); c.visible = false; R.add(c); }
    this.thr1 = P.thread([3.35, 3.2, -3.25], [4.5, 3.2, -3.25]); this.thr1.visible = false; R.add(this.thr1);
    const lblA = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.42), new THREE.MeshBasicMaterial({ map: signTex("PHOTOS"), color: new THREE.Color(1.4, 1.4, 1.4) })); lblA.position.set(3.3, 1.75, -3.27); lblA.visible = false; R.add(lblA); this.items.push(lblA);
    const lblB = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), new THREE.MeshBasicMaterial({ map: signTex("THE", "UNEXPLAINED"), color: new THREE.Color(1.4, 1.4, 1.4) })); lblB.position.set(4.5, 1.75, -3.27); lblB.visible = false; R.add(lblB); this.items.push(lblB);
    // bookshelf + plinth with the paperback (post 4)
    R.add(P.at(P.bookshelf(3, 3.2), -5.2, 0, -3.3));
    R.add(P.at(P.desk(1.6, 0.9), -5.2, 0, -2.0));
    const pb = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.9, 0.1), [lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), lam("#2b2540"), new THREE.MeshBasicMaterial({ map: bookTex("FORBIDDEN", "#5a2a5a", "PARAPSYCHOLOGY"), color: new THREE.Color(1.3, 1.3, 1.3) }), lam("#2b2540")] as any);
    pb.position.set(-5.2, 0.945 + 0.45 + 0.05, -2.0); pb.rotation.x = -0.22; pb.rotation.y = 0.1; this.tableBook = pb; pb.visible = false; R.add(pb);
    // history table (context 2): attack note, 1930 book, 1942 journal
    R.add(P.at(P.desk(2.6, 0.9), -8.6, 0, -2.0));
    const h1 = new THREE.Group(); const bk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.86, 0.1), [lam("#2a2a3a"), lam("#2a2a3a"), lam("#2a2a3a"), lam("#2a2a3a"), new THREE.MeshBasicMaterial({ map: bookTex("1930", "#3a4a7a", "SELF-DEFENCE"), color: new THREE.Color(1.3, 1.3, 1.3) }), lam("#2a2a3a")] as any); bk.position.set(-8.6, 0.945 + 0.43 + 0.04, -2.0); bk.rotation.x = -0.2;
    const jr = P.at(P.openBook(pageTex("1942"), 0.34, 0.5), -7.8, 0.945, -1.9); jr.rotation.x = -0.35; jr.rotation.y = -0.1;
    const attackNote = P.notice("ATTACK", 4, 2, 0.5, 0.62); attackNote.scale.setScalar(2.0); const c1 = new THREE.Group(); c1.add(attackNote); // no year shown (script gives none) c1.position.set(-9.4, 1.35, -2.0); c1.visible = false;
    h1.visible = false; bk.visible = false; jr.visible = false; this.histItems = [c1, bk, jr]; for (const o of [c1, bk, jr]) R.add(o);
    // monitor desk with three seated-looking silhouettes (posts 5, 7, 8)
    R.add(P.at(P.desk(4.0, 0.9), 7.8, 0, -2.2));
    for (let i = 0; i < 3; i++) { const m = P.monitor("#6aa8ff"); P.at(m, 6.8 + i * 1.0, 0.945, -2.15); R.add(m); this.screens.push(m.h.screen as THREE.Mesh); }
    R.add(P.stars(300, 5, 25, 0.2));
    // ---- pass 2: warm light pools, filler on cork and wall
    const warm = (x: number, y: number, z: number, size: number, col = "#ffb86b") => { const g = P.glowSprite(col, size); g.position.set(x, y, z); R.add(g); };
    warm(0, 3.0, -3.15, 9.0, "#d98a4a"); warm(3.9, 2.6, -3.15, 5.5, "#c9803f"); warm(-5.2, 2.4, -2.6, 6.0, "#d98a4a"); warm(-8.6, 2.0, -2.6, 5.0, "#c9803f"); warm(7.8, 1.6, -2.4, 5.0, "#6aa8ff");
    for (const [lx, lz] of [[-6.0, -2.0], [-1.9, -2.9], [8.9, -2.2]] as [number, number][]) { const L = P.lampDesk("#ffd9a0"); P.at(L, lx, lx === -1.9 ? 0.95 : 0.945, lz); R.add(L); warm(lx, 1.55, lz + 0.1, 2.4, "#ffc27a"); }
    const sticky = (x: number, y: number, z: number, c: string, rz: number) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x, y, z); m.rotation.z = rz; R.add(m); const pn = P.pin("#d62b45"); P.at(pn, x, y + 0.12, z + 0.03); R.add(pn); };
    [[-1.65, 5.95, "#ffe27a", 0.1], [-1.55, 3.0, "#ff9ab0", -0.12], [1.7, 4.2, "#9ae0ff", 0.08], [1.65, 2.2, "#ffe27a", -0.1], [-1.6, 1.7, "#9ae0ff", 0.14], [1.6, 6.2, "#ff9ab0", -0.06], [0, 1.45, "#ffe27a", 0.05]].forEach(([x, y, c, r]: any) => sticky(x, y, -3.3, c, r));
    [[3.2, 4.0, "#ff9ab0", 0.1], [4.6, 4.0, "#ffe27a", -0.1], [3.2, 1.2, "#9ae0ff", -0.08], [4.7, 1.2, "#ff9ab0", 0.12]].forEach(([x, y, c, r]: any) => sticky(x, y, -3.3, c, r));
    R.add(P.at(P.clockWall("23:47"), -2.9, 5.9, -3.3)); R.add(P.at(P.clockWall("00:00"), 7.8, 3.8, -3.3));
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), new THREE.MeshBasicMaterial({ color: "#241f44" })); wall.position.set(0, 5.5, -3.6); R.add(wall);
  }
  update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const t = f / FPS;
    const c = camPath(this.keys, f, 0.0016);
    const focus = this.rig.frame(cam, scene, c, "night", { az: 25, el: 34, focusR: 10 });
    const lt = this.rig.light2D(cam);
    const put = (key: string, x: number, z: number, draw: (p: any, o: any) => void, o: any, scale = 1, y = 0) => {
      const d = cam.position.distanceTo(new THREE.Vector3(x, y + 1, z)) / scale;
      const [w, h, k] = this.rig.tier(d);
      this.rig.card(cam, { key: key + JSON.stringify(o) + lt, draw: (p) => draw(p, { ...o, light: lt }), w, h, k, x, y, z, scale });
    };
    const fxp = (key: string, text: string, x: number, y: number, z: number, w: number, fill = "#ffe44d", pop = 1) => this.rig.fxCard(cam, { key, cw: 440, ch: 220, draw: (p) => fxPlate(p, 440, 220, text, fill, "#241726", text.length > 8 ? 92 : text.length > 7 ? 120 : 170), x, y, z, w: w * pop, h: w * 0.5 * pop });
    const pop = (a: number, dur = 10) => smooth(clamp01((f - a) / dur));
    const at0 = (i: number, off = 0) => A(i, off);

    // ---- which cards are pinned (appear when the narration reaches them)
    const appear = [at0(2, 1.2), at0(3, 0.6), at0(4, 0.6), at0(5, 0.6), WF(7, /^At/, 0, 0.2), WF(7, /^At/, 0, 0.1), WF(7, /^Three/, 0, 0.1), WF(7, /^At/, 1, 0.1)];
    this.cards.forEach((g, i) => { const u = pop(appear[i]); g.visible = u > 0.001; g.scale.setScalar(Math.max(0.01, u)); if (i > 0) this.threads[i - 1].visible = u > 0.5; });
    // card 6 (the unmentioned post) appears with post 5 but stays unlit; fine.
    // ---- opening and closing disclaimer
    const dOpen = f < A(0, 0) - 6, dClose = f > WF(8, /^None/, 0, -0.1);
    this.discl.visible = dOpen || dClose; this.discl.scale.setScalar(dOpen ? 1 : Math.max(0.01, pop(WF(8, /^None/, 0, -0.1), 8)));
    // ---- context 1 items
    const fJan = WF(0, /^January/, 0, -0.1), fFeb = WF(0, /^February/, 0, -0.1);
    this.calA.visible = f > fJan; this.calB.visible = f > fFeb; this.thr1.visible = f > fFeb + 12;
    this.items[0].visible = f > fJan + 20; this.items[1].visible = f > fFeb + 20;
    this.calA.scale.setScalar(1.1 * Math.max(0.01, pop(fJan))); this.calB.scale.setScalar(1.1 * Math.max(0.01, pop(fFeb)));
    // ---- 3 of 8 pegs
    this.pegs.forEach((m, i) => { m.visible = f > WF(4, /^three/, 0, -0.4) && f < at0(5, 0); const on = i < 3 && f > WF(4, /^three/, 0, i * 0.35); (m.material as THREE.MeshBasicMaterial).color.set(on ? "#4dffb0" : "#3a4a8a").multiplyScalar(on ? 2.4 : 1); });
    // ---- book on plinth, history items
    const fBook = WF(5, /^book/, 0, -0.1); this.tableBook.visible = f > fBook; this.tableBook.scale.setScalar(Math.max(0.01, pop(fBook, 12)));
    this.histItems[0].visible = f > WF(6, /^attack/, 0, -0.1); this.histItems[1].visible = f > WF(6, /^1930/, 0, -0.2); this.histItems[2].visible = f > WF(6, /^1942/, 0, -0.2);
    // ---- monitors light in turn
    const mt = [WF(7, /^At/, 0, -0.1), WF(7, /^Three/, 0, -0.1), WF(7, /^At/, 1, -0.1)];
    this.screens.forEach((s, i) => { const on = f > mt[i]; (s.material as THREE.MeshBasicMaterial).color.set("#6aa8ff").multiplyScalar(on ? 1.9 : 0.12); });
    // ---- no-reply card
    this.noReply.scale.setScalar(Math.max(0.01, pop(at0(8, 0.2), 10)));

    // ---------- cards: silhouettes + Gloom ----------
    const sx = [6.8, 7.8, 8.8];
    sx.forEach((x, i) => put("sil" + i, x, -2.85, drawSilhouette, { col: "#171430", seed: i + 1, arm: i === 1 ? [0, -80] : [0, 0] }, 0.9));
    // chair-less "empty seat" in front of post 1: a single dark silhouette absent -> show an empty chair
    const chair = null; void chair;
    const gl = (x: number, z: number, o: any, scale = 0.9, y = 0) => put("gloom", x, z, drawGloom, { talk: Math.round(talkNow(f) * 8) / 8, blink: blinkAt(f, 3) > 0.3 ? 1 : 0, ...o }, scale, y);
    const st = this.station(f);
    const pt = 58 + 6 * Math.sin(f / 22);
    gl(st.gx, st.gz, { expr: "neutral", point: st.point ?? pt, bend: 12, flash: !!st.beam }, st.gs ?? 0.9, st.gy ?? 0);
    if (st.beam) { const fh = flashHand(GLOOM, 3, st.point ?? pt, 12), Rv = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), s = SU * (st.gs ?? 0.9);
      const hx = st.gx + Rv.x * (fh.x - 300) * s, hz = st.gz + Rv.z * (fh.x - 300) * s, hy = (975 - fh.y) * s + (st.gy ?? 0), ang = Math.atan2(-fh.dy, fh.dx), L = st.beam;
      this.rig.fxCard(cam, { key: "beam", cw: 512, ch: 256, draw: (p) => fxBeam(p, 512, 256), x: hx + Rv.x * Math.cos(ang) * L / 2, y: hy + Math.sin(ang) * L / 2, z: hz + Rv.z * Math.cos(ang) * L / 2, w: L, h: L * 0.42, soft: true, rot: ang }); }

    // ---------- floating plates ----------
    if (f > at0(1, 0.2) && f < at0(5, 0)) fxp("p8", "8", 0, 6.45, -2.9, 0.9, "#ffe44d", pop(at0(1, 0.2)));
    if (f > WF(3, /^real/, 0, -0.1) && f < at0(4, 0)) this.bubbles(cam, ["REAL LIFE", "NO RESULTS", "BORED", "THE FEDS"], WF(3, /^real/, 0, -0.1), f, 5.0);
    if (f > WF(4, /^thousand/, 0, -0.1) && f < at0(5, 0)) fxp("pT", "1 IN 1000", 0, 1.6, -2.9, 1.6, "#ffe44d", pop(WF(4, /^thousand/, 0, -0.1)));
    if (f > WF(5, /^2020/, 0, -0.1) && f < at0(6, 0)) { fxp("p2020", "2020", -5.2, 2.0, -1.6, 0.6, "#ffe44d", pop(WF(5, /^2020/, 0, -0.1))); if (f > WF(5, /^112/, 0, -0.1)) fxp("p112", "112 PAGES", -5.2, 2.5, -1.6, 0.95, "#e8f6ff", pop(WF(5, /^112/, 0, -0.1))); }
    if (f > WF(6, /^1930/, 0, -0.1) && f < at0(7, 0)) fxp("y30", "1930", -8.6, 2.5, -1.6, 1.1, "#e8f6ff", pop(WF(6, /^1930/, 0, -0.1)));
    if (f > WF(6, /^1942/, 0, -0.1) && f < at0(7, 0)) fxp("y42", "1942", -7.8, 2.2, -1.5, 1.1, "#e8f6ff", pop(WF(6, /^1942/, 0, -0.1)));
    if (f > WF(6, /^fear/, 0, -0.1) && f < at0(7, 0)) fxp("fear", "FEAR ALONE?", -8.6, 3.4, -1.6, 1.8, "#ffe44d", pop(WF(6, /^fear/, 0, -0.1)));
    ["+2 H 15", "+2 H 18", "+2 H 43"].forEach((s, i) => { if (f > mt[i] && f < at0(8, 0)) fxp("ts" + i, s, sx[i], 2.9, -2.3, 1.0, "#ffe44d", pop(mt[i])); });

    if (f > at0(8, 0.4) && f < at0(8, 3.6)) fxp("pNR", "NO REPLY", 0, 7.0, -2.9, 1.7, "#ffe44d", pop(at0(8, 0.4)));
    this.rig.finish();
    void t;
    return { focus: new THREE.Vector3(...c.look), cInf: st.cInf ?? 5, light: "night" as const };
  }
  bubbles(cam: THREE.PerspectiveCamera, txt: string[], a: number, f: number, y0: number) {
    const Rv = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    txt.forEach((s, i) => { const u = smooth(clamp01((f - a - i * 24) / 10)); if (u < 0.01) return; const dx = (i % 2 ? 1 : -1) * 0.62; this.rig.fxCard(cam, { key: "bb" + s, cw: 760, ch: 400, draw: (p) => fxBubble(p, 760, 400, s, "#f4f1ff", "#241726", s.length > 8 ? 90 : 112), x: -0.0 + Rv.x * dx, y: y0 - i * 0.62, z: -2.6 + Rv.z * dx, w: 1.0 * u, h: 0.52 * u }); });
  }
  station(f: number): { gx: number; gz: number; gy?: number; gs?: number; point?: number; beam?: number; cInf?: number } {
    // Gloom placement per narration beat (world x,z). He stands beside the thing being described.
    const i = LINES.findIndex((l, k) => f / FPS < (LINES[k + 1]?.t0 ?? 1e9));
    const k = Math.max(0, i);
    switch (k) {
      case 0: return f / FPS < LINES[0].t0 ? { gx: 0.0, gz: -1.2, gs: 0.7, cInf: 4 } : { gx: 2.5, gz: -2.2, point: 70, beam: 1.4, cInf: 5 };
      case 1: return { gx: -1.15, gz: -1.9, gy: 0.5, gs: 1.05, point: 60, beam: 1.4, cInf: 5 };
      case 2: return { gx: -1.15, gz: -1.9, gy: 0.5, gs: 1.05, point: 78, beam: 1.4, cInf: 5 };
      case 3: return { gx: -1.15, gz: -1.9, gy: 0.5, gs: 1.05, point: 68, beam: 1.4, cInf: 5 };
      case 4: return { gx: 1.25, gz: -1.9, gy: 0.5, gs: 1.05, point: 66, beam: 1.4, cInf: 5 };
      case 5: if (f / FPS < LINES[5].t0 + 6.8) return { gx: 1.25, gz: -1.9, gy: 0.5, gs: 1.05, point: 66, beam: 1.4, cInf: 5 };
        return { gx: -4.3, gz: -1.0, gs: 1.05, point: 40, beam: 1.2, cInf: 5 };
      case 6: return { gx: -7.2, gz: -1.0, gs: 1.05, point: 55, beam: 1.2, cInf: 5 };
      case 7: return { gx: 6.2, gz: -1.0, gs: 1.05, point: 50, beam: 1.2, cInf: 5 };
      default: return { gx: 1.7, gz: -2.0, gs: 0.9, cInf: 5 };
    }
  }
}

export const buildRoom = () => {
  const r = new Room();
  const K = (i: number, off: number, pos: [number, number, number], look: [number, number, number], fov = 44, o: Partial<Key> = {}): Key => ({ f: A(i, off), pos, look, fov, ...o });
  r.keys = [
    { f: 0, pos: [0.4, 3.3, 11.0], look: [0, 2.9, -3.0], fov: 46 },
    K(0, -0.2, [0.4, 3.3, 11.0], [0, 2.9, -3.0], 46, { dur: 12 }),
    K(0, 0.6, [3.6, 2.9, 4.6], [3.8, 2.8, -3.3], 44, { dur: 40 }),
    K(0, 4.8, [3.9, 2.9, 4.2], [3.9, 2.9, -3.3], 44, { dur: 40 }),
    K(1, 0.0, [0.0, 3.0, 6.4], [0, 3.1, -3.3], 48, { dur: 40 }),
    K(1, 3.6, [-0.2, 1.6, 2.4], [-0.6, 1.1, -3.0], 38, { dur: 36 }),
    K(2, 0.0, [-0.3, 3.4, 6.0], [-0.5, 3.6, -3.3], 46, { dur: 40 }),
    K(2, 4.0, [0.0, 3.2, 5.6], [-0.2, 3.4, -3.3], 46, { dur: 40 }),
    K(3, 0.0, [0.0, 3.4, 6.0], [-0.4, 3.6, -3.3], 46, { dur: 30 }),
    K(3, 4.0, [0.0, 3.3, 5.0], [-0.3, 3.5, -3.3], 44, { dur: 40 }),
    K(4, 0.0, [0.4, 3.0, 6.0], [0.3, 3.2, -3.3], 46, { dur: 30 }),
    K(4, 3.2, [0.3, 3.2, 5.6], [0.3, 3.4, -3.3], 46, { dur: 26 }),
    K(5, 0.0, [0.3, 3.0, 6.2], [0.2, 3.2, -3.3], 46, { dur: 30 }),
    K(5, 6.8, [-4.6, 2.4, 4.4], [-4.9, 1.9, -2.2], 44, { dur: 50 }),
    K(6, 0.0, [-8.2, 2.5, 4.2], [-8.3, 1.8, -2.2], 44, { dur: 60 }),
    K(7, -0.5, [7.3, 2.5, 4.4], [7.6, 1.9, -2.4], 44, { dur: 70 }),
    K(8, 0.0, [0.4, 3.4, 8.5], [0, 3.4, -3.3], 48, { dur: 60 }),
    K(8, 3.6, [0.0, 3.1, 6.0], [0, 3.0, -3.0], 42, { dur: 30 }),
  ];
  return r;
};

const makeRoom = () => buildRoom();
export const Ep01: React.FC = () => {
  const f = useCurrentFrame();
  const make = useMemo(() => makeRoom, []);
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      <ShotView make={make} frame={f} />
      <Sequence from={Math.round(LEAD * FPS)}><Audio src={staticFile(VOICE_FILE)} /></Sequence>
      <CaptionTrack caps={CAPS} y={1240} />
    </AbsoluteFill>
  );
};
