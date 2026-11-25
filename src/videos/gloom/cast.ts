// GLOOM FILES cast, drawn with the skill's Pen/toon construction (bean heads, stick limbs, plum ink, no blush/catchlights).
import { Pen, bodyFront, Outfit, Expr, INK, headBlob, blobPts, mix, shade, mul, thickAngle } from "./toon";

export const GLOOM: Outfit = {
  jacket: "#8d6b45", fleck: ["#5d4630", "#cfae7c"], patches: "#4b3424", waistcoat: "#56603a", lapel: "#76563a", pants: "#3a3949", boots: "#3a2a22", hat: "sidehair", hairCol: "#e9e7f0",
  glasses: true, irisCol: "#3fc4ff", beard: "#ebe9f2", moustache: "#ebe9f2", bow: "#b02a3e", old: true, bushy: true, build: "stout", skin: "#efd4b9", buttons: "#d8c28a",
};
export const MOTH: Outfit = { jacket: "#3fbf9b", pants: "#2e3358", boots: "#e8e4f4", hat: "tuft", hairCol: "#35243a", build: "kid", skin: "#f4e2cf" };

export type CastOpts = { expr?: Expr; talk?: number; look?: number; blink?: number; point?: number; bend?: number; tilt?: number; headTilt?: number; light?: number; seed?: number; wave?: number; flash?: boolean };

const shift = (p: Pen) => p.g.translate(150, 0); // cards are 900 wide: room for pointing arms
export const drawGloom = (p: Pen, o: CastOpts = {}) => (shift(p), bodyFront(p, GLOOM, {
  mode: "stand", expr: o.expr ?? "neutral", talk: o.talk ?? 0, look: o.look ?? 0, blink: o.blink ?? 0, tilt: o.tilt ?? 0, headTilt: o.headTilt ?? 0,
  light: o.light, seed: o.seed ?? 3, prop: o.flash === false ? null : ["flash", o.point ?? 20, o.bend ?? 0],
}));
export const drawMoth = (p: Pen, o: CastOpts = {}) => (shift(p), bodyFront(p, MOTH, {
  mode: "stand", expr: o.expr ?? "nervous", talk: o.talk ?? 0, look: o.look ?? 0, blink: o.blink ?? 0, tilt: o.tilt ?? 0, headTilt: o.headTilt ?? 0,
  light: o.light, seed: o.seed ?? 5, wave: o.wave,
}));

/** Biscuit the cat, sitting, 3/4 front. Drawn on the same 600 x 1000 design card (soles y = 975). */
export const drawBiscuit = (p: Pen, o: { expr?: "stare" | "annoyed" | "relieved" | "wide" | "sleepy"; blink?: number; light?: number; look?: number; tail?: number } = {}) => {
  const light = o.light ?? (-120 * Math.PI) / 180, thick = thickAngle(light), u = 5.2;
  shift(p);
  const FUR = "#2c2748", FUR_SH = "#17132b", sole = 975, blink = o.blink ?? 0, look = o.look ?? 0;
  // tail (behind)
  const tl = o.tail ?? 0;
  p.line([[430, sole - 40], [520, sole - 70], [560 + 20 * tl, sole - 170], [530 + 30 * tl, sole - 260]], mix(FUR_SH, FUR, 0.5), 30, true);
  // body: bean sitting
  const body = blobPts(300, sole - 150, { a: 150, b: 150, nTop: 2.1, nBot: 2.8, egg: 0.14, asym: 0.03, rot: 0, noise: 0.006, seed: 21 });
  p.shadedFill(body, FUR, FUR_SH, light, 150);
  p.inkRing(body, 26, thick);
  // front paws
  for (const s of [-1, 1]) { p.ell(300 + s * 52, sole - 22, 40, 22, FUR, 9); p.stroke([[300 + s * 44, sole - 20], [300 + s * 44, sole - 8]], 4, INK); }
  // head
  const hc = sole - 345;
  const H = { a: 128, b: 112, nTop: 2.2, nBot: 2.5, egg: -0.1, asym: 0.0, rot: 0, noise: 0.006, seed: 22 };
  for (const s of [-1, 1]) {
    const ear: [number, number][] = [[300 + s * 118, hc - 30], [300 + s * 100, hc - 148], [300 + s * 28, hc - 100]];
    p.poly(ear, FUR, 11);
    p.poly([[300 + s * 104, hc - 50], [300 + s * 96, hc - 112], [300 + s * 56, hc - 92]], "#5a3a62", 0);
  }
  const head = blobPts(300, hc, H);
  p.shadedFill(head, FUR, FUR_SH, light, 128);
  p.inkRing(head, 26, thick);
  // eyes: yellow, slit pupils, lidded for mood. no catchlights.
  const ex = o.expr ?? "stare";
  const lidK = ex === "annoyed" ? 0.5 : ex === "relieved" ? 0.62 : ex === "sleepy" ? 0.75 : ex === "wide" ? 0 : 0.0;
  const lid = Math.max(lidK, blink);
  const ry = ex === "wide" ? 32 : 26, rx = 26;
  for (const s of [-1, 1]) {
    const cx = 300 + s * 52, cy = hc + 4;
    p.ell(cx, cy, rx, ry, "#e8ff48", 7);
    p.ell(cx + look * 6, cy, ex === "wide" ? 5 : 7.5, ry - 4, INK, 0);
    if (lid > 0.02) p.clip([[cx - rx - 6, cy - ry - 6], [cx + rx + 6, cy - ry - 6], [cx + rx + 6, cy - ry + 2 * ry * lid], [cx - rx - 6, cy - ry + 2 * ry * lid]], () => p.ell(cx, cy, rx + 3, ry + 3, FUR, 0));
    if (lid > 0.02) p.stroke([[cx - rx, cy - ry + 2 * ry * lid], [cx + rx, cy - ry + 2 * ry * lid]], 7);
    if (ex === "annoyed") p.stroke([[cx - s * 30, cy - ry - 8 + (s > 0 ? 8 : 8)], [cx + s * 22, cy - ry - 22]], 8);
  }
  // nose + mouth + whiskers
  p.poly([[292, hc + 46], [308, hc + 46], [300, hc + 58]], "#c46b88", 4);
  p.stroke([[300, hc + 58], [288, hc + 72], [270, hc + 70]], 4, "#8a86ad");
  p.stroke([[300, hc + 58], [312, hc + 72], [330, hc + 70]], 4, "#8a86ad");
  for (const s of [-1, 1]) for (const d of [0, 16]) p.stroke([[300 + s * 70, hc + 48 + d], [300 + s * 175, hc + 36 + d * 1.6]], 3.2, "#9b97bd");
};
