// EP01 v8 full episode: 15 literal shots on the v8 voice take. Word-timed cuts, camera kicks on key words, Gloom mouth sync, in-world reveals, key-word captions, re-timed mix.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ShotView } from "../Shot";
import { SHOTS4 } from "./beats4";
import { Stage3 } from "./beats3";
import { useKit } from "./kit";
import takeV3 from "../../../../build/ep01v4/words.json";
import { mouthFromWords } from "../../../lib/anim";
import { FONT_DISPLAY } from "../../../theme";
import { clamp01, smooth } from "../core";

export const FPS = 30, TAIL = 1.5;
type TW = { word: string; start: number; end: number; section: number };
const WS = takeV3.words as TW[], SEC = takeV3.sections;
const WT = (i: number, re: RegExp, n = 0, off = 0) => { const h = WS.filter((w) => w.section === i && re.test(w.word)), w = h[Math.min(n, h.length - 1)]; if (!w) throw new Error(`ep01v8: no word ${re} in section ${i}`); return w.start + off; };
export const TOTAL_S = takeV3.voice_len + TAIL;
export const TOTAL = Math.ceil(TOTAL_S * FPS);
const B = [0, WT(0, /^and$/, 0, -0.08), SEC[1].start - 0.1, WT(1, /^and$/, 0, -0.08), SEC[2].start - 0.1, SEC[3].start - 0.1, SEC[4].start - 0.1, WT(4, /^like$/, 0, -0.1), SEC[5].start - 0.1, SEC[6].start - 0.1, WT(6, /^His$/, 0, -0.1), SEC[7].start - 0.1, SEC[8].start - 0.1, WT(8, /^In$/, 0, -0.1), SEC[9].start - 0.1, TOTAL_S];
const SH0 = SHOTS4.map((s, i) => ({ s, a: Math.round(B[i] * FPS), b: Math.round(B[i + 1] * FPS), sa: Math.round(B[i] * FPS), sb: Math.round(B[i + 1] * FPS) }));
const closer = (s: typeof SHOTS4[number]) => ({ ...s, keys: s.keys.map((q) => ({ ...q, pos: [q.look[0] + (q.pos[0] - q.look[0]) * 0.6, q.pos[1] + (q.look[1] - q.pos[1]) * 0.3, q.look[2] + (q.pos[2] - q.look[2]) * 0.6] as [number, number, number], fov: q.fov - 6, roll: -(q.roll ?? 0) || 0.04 })) });
const SH: { s: typeof SHOTS4[number]; a: number; b: number; sa: number; sb: number; cut?: boolean }[] = [];
SH0.forEach((q) => { if (q.b - q.a > 150 && q.s.id !== "S05") { const m = Math.round((q.a + q.b) / 2); SH.push({ ...q, b: m }, { ...q, s: closer(q.s), a: m, cut: true }); } else SH.push(q); });
const WORDS = WS.map((w) => ({ start: w.start, end: w.end }));
const KICKS: [number, number][] = [[WT(0, /^death/, 0, 0), 1.2], [WT(1, /^Death/, 0, 0), 1], [WT(1, /^death/, 0, 0), 1.3], [WT(3, /^forty/, 0, 0), 0.9], [WT(4, /^three/, 0, 0), 1.2], [WT(4, /^storm/, 0, 0), 1.5], [WT(7, /^didn/, 0, 0.3), 0.8], [WT(8, /^froze/, 0, 0), 1.4], [WT(8, /^fear/, 0, 0), 1.3], [WT(9, /^silence/, 0, 0), 0.8]];
const kickAt = (f: number) => { let o = 0; for (const [t, k] of KICKS) { const x = f - Math.round(t * FPS); if (x >= 0 && x < 7) o += k * (x % 2 ? -1 : 1) * (1 - x / 7); } return o; };
const talkAt = (f: number) => mouthFromWords(f, FPS, WORDS);

// Captions are built straight from the word timings (never hand-anchored), so they always match the audio.
type Cap = { from: number; to: number; words: [string, string?][] };
const Y = "#ffe44d", R = "#ff4a4a", M = "#7dffc8";
const KEY: Record<string, string> = { death: R, anger: R, worst: R, froze: R, fear: R, storm: R, unluckily: R, silent: R, kill: R, trying: Y, three: Y, forty: Y, eight: Y, "1942": Y, week: Y, thousand: Y, metres: Y, metre: Y, note: Y, luckily: M, control: M, silence: M, anonymous: M, others: Y };
const buildCaps = (): Cap[] => {
  const chunks: TW[][] = []; let cur: TW[] = [];
  WS.forEach((w, k) => { cur.push(w); const len = cur.map((x) => x.word).join(" ").length, endP = /[.,:;?!]$/.test(w.word), nxt = WS[k + 1]; if (endP || cur.length >= 3 || len > 16 || !nxt || nxt.section !== w.section) { chunks.push(cur); cur = []; } });
  return chunks.map((c, k) => {
    const next = chunks[k + 1], from = Math.max(0, c[0].start - 0.04), lastEnd = c[c.length - 1].end;
    const to = next && next[0].section === c[0].section ? Math.min(lastEnd + 0.12, next[0].start - 0.02) : lastEnd + 0.15;
    const words: [string, string?][] = c.map((x, q) => { const clean = x.word.replace(/[^A-Za-z0-9'-]/g, ""), col = KEY[clean.toLowerCase()]; return [clean.toUpperCase() + (q < c.length - 1 ? " " : ""), col] as [string, string?]; });
    return { from, to, words };
  });
};
const CAPS = buildCaps();
const CapView: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, c = CAPS.find((q) => t >= q.from && t < q.to); if (!c) return null;
  const text = c.words.map((w) => w[0]).join(""), size = Math.max(96, Math.min(180, 800 / (text.length * 0.5))), p = smooth(clamp01((t - c.from) / 0.07));
  return (<div style={{ position: "absolute", left: 80, width: 920, top: 1290, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1.05, letterSpacing: 2, transform: `scale(${0.85 + 0.15 * p})`, opacity: p, WebkitTextStroke: "10px #1a1020", paintOrder: "stroke fill" as any, textShadow: "0 8px 0 rgba(0,0,0,.45)" }}>
    {c.words.map((w, i) => <span key={i} style={{ color: w[1] ?? "#fff" }}>{w[0]}</span>)}</div>);
};
const Disclaimer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, endA = TOTAL_S - 3.0; const on = t < 2.6 || t > endA; if (!on) return null;
  const a = t < 2.6 ? smooth(clamp01(t / 0.25)) * smooth(clamp01((2.6 - t) / 0.3)) : smooth(clamp01((t - endA) / 0.3));
  return (<div style={{ position: "absolute", left: 120, right: 120, top: 170, padding: "20px 24px", borderRadius: 22, background: "rgba(16,14,40,.82)", border: "6px solid #ffe44d", textAlign: "center", opacity: a, fontFamily: FONT_DISPLAY }}>
    <div style={{ color: "#ffe44d", fontSize: 40 }}>ANONYMOUS ONLINE CLAIMS. UNVERIFIED.</div><div style={{ color: "#fff", fontSize: 36 }}>NO NAMES. NO LINKS.</div></div>);
};
const Layer: React.FC<{ i: number; f: number; alpha: number; ready: boolean }> = ({ i, f, alpha, ready }) => {
  const { s, a, b, sa, sb } = SH[i], D = b - a, SD = sb - sa;
  const make = useMemo(() => () => {
    const st: Stage3 = new Stage3(s, D, (lf, _rig, cam) => {
      const u = (lf + a - sa) / SD;
      st.root.traverse((o) => { if (o.userData.rv !== undefined) o.visible = u >= o.userData.rv; if (o.userData.rvOff !== undefined) o.visible = u < o.userData.rvOff; });
      const k = kickAt(lf + a); if (k) { cam.position.x += k * 0.1; cam.position.y += k * 0.06; cam.updateMatrixWorld(); }
    });
    st.talk = (lf: number) => talkAt(lf + a);
    return st;
  }, [i, ready]);
  return <ShotView make={make} frame={f - a} alpha={alpha} />;
};
export const Ep01V8: React.FC = () => {
  const f = useCurrentFrame(), ready = useKit();
  if (!ready) return <AbsoluteFill style={{ background: "#0a0c1c" }} />;
  let cur = SH.findIndex((q) => f >= q.a && f < q.b); if (cur < 0) cur = SH.length - 1;
  const n = SH[cur + 1], layers = [{ i: cur, alpha: 1 }];
  if (n && !n.cut && [12, 13, 8].includes(SH0.findIndex((q) => q.sa === SH[cur].sa)) && f >= n.a - 6) layers.push({ i: cur + 1, alpha: clamp01((f - (n.a - 6)) / 6) }); // 6 f dissolve where time passes
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      {layers.map((l) => <Layer key={l.i} i={l.i} f={f} alpha={l.alpha} ready={ready} />)}
      <Audio src={staticFile("audio/ep01v4/mix.wav")} />
      <CapView f={f} />
      <Disclaimer f={f} />
    </AbsoluteFill>
  );
};
