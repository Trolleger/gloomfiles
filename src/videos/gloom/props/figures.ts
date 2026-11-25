// flat silhouette extras (crowds, queues, men-in-black, dancers): generic bean cards in one flat colour, built from the skill's Pen
import { Pen, INK, blobPts, headBlob } from "../toon";
type P2 = [number, number];
const body = (p: Pen, col: string, arm: [number, number], leg: number, hat: boolean, seed: number) => {
  p.g.translate(150, 0);
  const sole = 975, shade = col;
  const H = headBlob(seed, 105, 0), hc = 975 - 700;
  p.stroke([[300 - 22, sole - 360], [300 - 28 - leg, sole]], 24, col); p.stroke([[300 + 22, sole - 360], [300 + 28 + leg, sole]], 24, col);
  const torso = blobPts(300, sole - 470, { a: 88, b: 150, nTop: 2.2, nBot: 2.6, egg: 0.12, asym: 0, rot: 0, noise: 0.006, seed: seed + 3 });
  p.stroke([[300 - 80, sole - 580], [300 - 110, sole - 440 + arm[0]], [300 - 100, sole - 330 + arm[0] * 1.6]], 20, col);
  p.stroke([[300 + 80, sole - 580], [300 + 110, sole - 440 + arm[1]], [300 + 100, sole - 330 + arm[1] * 1.6]], 20, col);
  p.poly(torso, col, 14);
  const head = blobPts(300, hc, H); p.poly(head, col, 14);
  if (hat) { p.poly([[300 - 118, hc - 70], [300 + 118, hc - 70], [300 + 60, hc - 110], [300 - 60, hc - 110]], col, 12); }
};
/** flat dark silhouette person (extras, men in black). arm = [leftLift, rightLift] */
export const drawSilhouette = (p: Pen, o: { col?: string; arm?: [number, number]; leg?: number; hat?: boolean; seed?: number } = {}) => body(p, o.col ?? "#171430", o.arm ?? [0, 0], o.leg ?? 0, !!o.hat, o.seed ?? 1);
/** dancer: arms up, legs apart (dancing plague) */
export const drawDancer = (p: Pen, o: { col?: string; t?: number; seed?: number } = {}) => { const t = o.t ?? 0; body(p, o.col ?? "#241c3a", [-200 + 40 * Math.sin(t), -200 - 40 * Math.sin(t)], 28 * Math.abs(Math.sin(t * 0.7)), false, o.seed ?? 2); };
/** the monster silhouette of the bloop / tully (blob with tentacles) */
export const drawMonster = (p: Pen, o: { col?: string } = {}) => {
  p.g.translate(150, 0); const col = o.col ?? "#10142a";
  const b = blobPts(300, 975 - 420, { a: 230, b: 200, nTop: 2.1, nBot: 2.5, egg: 0.2, asym: 0.05, rot: 0, noise: 0.012, seed: 9 }); p.poly(b, col, 14);
  for (let i = 0; i < 5; i++) { const x = 140 + i * 80; p.stroke([[x, 975 - 250], [x + (i % 2 ? 30 : -30), 975 - 120], [x - (i % 2 ? 20 : -10), 975 - 20]], 34, col); }
  for (const s of [-1, 1]) { p.ell(300 + s * 80, 975 - 470, 38, 44, "#e8ff48", 10); p.ell(300 + s * 80, 975 - 470, 10, 30, INK, 0); }
};
