// EP01 v3 full episode: 14 shots on the new 57 s Joe take. Word-timed cuts, kicks on key words, Gloom acting, in-world reveals, key-word captions.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ShotView } from "../Shot";
import { SHOTS3, Stage3 } from "./beats3";
import takeV2 from "../../../../build/ep01v2/ep01v2_words_fast.json";
import { mouthFromWords, blinkAt } from "../../../lib/anim";
import { FONT_DISPLAY } from "../../../theme";
import { clamp01, smooth } from "../core";

export const FPS = 30, TAIL = 1.5, VOICE_FILE = "audio/ep01v2/ep01v2_voice_fast.wav";
type TW = { word: string; start: number; end: number; section: number };
const WS = takeV2.words as TW[], SEC = takeV2.sections;
/** seconds of the n-th word in section i matching re (+off) */
const WT = (i: number, re: RegExp, n = 0, off = 0) => { const h = WS.filter((w) => w.section === i && re.test(w.word)), w = h[Math.min(n, h.length - 1)]; if (!w) throw new Error(`ep01v3: no word ${re} in section ${i}`); return w.start + off; };
export const TOTAL_S = takeV2.voice_len + TAIL;
export const TOTAL = Math.ceil(TOTAL_S * FPS);
// shot boundaries in seconds (S01..S14)
const B = [0, WT(0, /^Then/, 0, -0.08), SEC[1].start - 0.12, SEC[2].start - 0.1, WT(2, /^The$/, 0, -0.1) , SEC[3].start - 0.12, SEC[4].start - 0.12, SEC[5].start - 0.12, WT(5, /^like/, 0, -0.1), SEC[6].start - 0.12, SEC[7].start - 0.12, WT(7, /^1942/, 0, -0.55), SEC[8].start - 0.12, SEC[9].start - 0.12, TOTAL_S];
const SH = SHOTS3.map((s, i) => ({ s, a: Math.round(B[i] * FPS), b: Math.round(B[i + 1] * FPS) }));
const WORDS = WS.map((w) => ({ start: w.start, end: w.end }));
// word-timed kicks (seconds): impact flips of the camera, 7 frames
const KICKS: [number, number][] = [[WT(0, /^three/, 0, 0.05), 1], [WT(0, /^hits/, 0, 0.05), 1.2], [WT(2, /^forty/, 0, 0.1), 1], [WT(2, /^kills/, 0, 0), 1.5], [WT(5, /^storm/, 0, 0), 1.4], [WT(7, /^fear/, 0, 0), 1.2], [WT(9, /^verified/, 0, 0), 0.8]];
const kickAt = (f: number) => { let o = 0; for (const [t, k] of KICKS) { const x = f - Math.round(t * FPS); if (x >= 0 && x < 7) o += k * (x % 2 ? -1 : 1) * (1 - x / 7); } return o; };
// Gloom's expression per shot
const EXPR: Record<string, string> = { S02: "stern", S05: "stern", S09: "nervous", S12: "shock", S14: "neutral" };

// captions: phrase + the key word coloured
type Cap = { from: number; to: number; words: [string, string?][] };
const Y = "#ffe44d", R = "#ff4a4a", M = "#7dffc8";
const CAPS: Cap[] = [
  { from: 0.1, to: WT(0, /^strangers/, 0, 0.1), words: [["ANONYMOUS POSTER"]] }, { from: WT(0, /^with/, 0, -0.05), to: WT(0, /^Eight/, 0, -0.05), words: [["ATTACK STRANGERS"]] },
  { from: WT(0, /^Eight/, 0, -0.05), to: WT(0, /^three/, 0, -0.1), words: [["EIGHT TRIES"]] }, { from: WT(0, /^three/, 0, -0.1), to: WT(0, /^Then/, 0, -0.08), words: [["THREE HITS", R]] },
  { from: WT(0, /^Then/, 0, -0.08), to: SEC[0].end + 0.3, words: [["WENT "], ["SILENT", R]] },
  { from: SEC[1].start, to: SEC[1].end + 0.2, words: [["/X/ ", M], ["PARANORMAL BOARD"]] },
  { from: SEC[2].start, to: WT(2, /^two/, 0, -0.05), words: [["EIGHT POSTS", Y]] }, { from: WT(2, /^two/, 0, -0.05), to: WT(2, /^The$/, 0, -0.1), words: [["2 H 43", Y]] },
  { from: WT(2, /^The$/, 0, -0.1), to: WT(2, /^where/, 0, 0), words: [["DEATH NOTE"]] }, { from: WT(2, /^where/, 0, 0), to: SEC[2].end + 0.2, words: [["A NAME "], ["KILLS", R]] },
  { from: SEC[3].start, to: WT(3, /^His/, 0, -0.05), words: [["SILENT "], ["A WEEK", Y]] }, { from: WT(3, /^His/, 0, -0.05), to: SEC[3].end + 0.2, words: [["THREAD "], ["ARCHIVED", Y]] },
  { from: SEC[4].start, to: WT(4, /^no/, 0, -0.05), words: [["REAL LIFE"]] }, { from: WT(4, /^no/, 0, -0.05), to: WT(4, /^boredom/, 0, -0.05), words: [["NO RESULTS"]] }, { from: WT(4, /^boredom/, 0, -0.05), to: WT(4, /^the$/, 0, -0.05), words: [["BOREDOM"]] }, { from: WT(4, /^the$/, 0, -0.05), to: SEC[4].end + 0.2, words: [["THE "], ["FEDS", R]] },
  { from: SEC[5].start, to: WT(5, /^like/, 0, -0.1), words: [["3 OF 8", Y]] }, { from: WT(5, /^like/, 0, -0.1), to: WT(5, /^thousand/, 0, -0.05), words: [["ONE METRE TARGET"]] }, { from: WT(5, /^thousand/, 0, -0.05), to: SEC[5].end + 0.2, words: [["1000 METRES", Y]] },
  { from: SEC[6].start, to: WT(6, /^sold/, 0, -0.05), words: [["THE FORBIDDEN BOOK"]] }, { from: WT(6, /^sold/, 0, -0.05), to: SEC[6].end + 0.2, words: [["FROM A "], ["DISTANCE", M]] },
  { from: SEC[7].start, to: WT(7, /^1930/, 0, -0.05), words: [["THE IDEA IS "], ["OLD", Y]] }, { from: WT(7, /^1930/, 0, -0.05), to: WT(7, /^1942/, 0, -0.55), words: [["1930", Y]] },
  { from: WT(7, /^1942/, 0, -0.55), to: WT(7, /^kill/, 0, -0.05), words: [["1942", Y]] }, { from: WT(7, /^kill/, 0, -0.05), to: SEC[7].end + 0.2, words: [["FEAR "], ["ALONE", R]] },
  { from: SEC[8].start, to: WT(8, /^Another/, 0, -0.05), words: [["OTHERS LIKE THEM"]] }, { from: WT(8, /^Another/, 0, -0.05), to: WT(8, /^third/, 0, -0.1), words: [["ANONYMOUS COMMENTS"]] }, { from: WT(8, /^third/, 0, -0.1), to: SEC[8].end + 0.2, words: [["THEY "], ["LEFT ONE", Y]] },
  { from: SEC[9].start, to: WT(9, /^shows/, 0, -0.05), words: [["NO DEFINED "], ["SUCCESS", Y]] }, { from: WT(9, /^shows/, 0, -0.05), to: WT(9, /^None/, 0, -0.1), words: [["NO "], ["REPLY", R]] }, { from: WT(9, /^None/, 0, -0.1), to: TOTAL_S - 3.2, words: [["UNVERIFIED", Y]] },
];
const CapView: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, c = CAPS.find((q) => t >= q.from && t < q.to); if (!c) return null;
  const text = c.words.map((w) => w[0]).join(""), size = Math.max(88, Math.min(176, 800 / (text.length * 0.5))), p = smooth(clamp01((t - c.from) / 0.07));
  return (<div style={{ position: "absolute", left: 80, width: 920, top: 1290, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1.05, letterSpacing: 2, transform: `scale(${0.8 + 0.2 * p})`, opacity: p, WebkitTextStroke: "10px #1a1020", paintOrder: "stroke fill" as any, textShadow: "0 8px 0 rgba(0,0,0,.45)" }}>
    {c.words.map((w, i) => <span key={i} style={{ color: w[1] ?? "#fff" }}>{w[0]}</span>)}</div>);
};
const Disclaimer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS, endA = TOTAL_S - 3.0; const on = t < 2.6 || t > endA; if (!on) return null;
  const a = t < 2.6 ? smooth(clamp01(t / 0.25)) * smooth(clamp01((2.6 - t) / 0.3)) : smooth(clamp01((t - endA) / 0.3));
  return (<div style={{ position: "absolute", left: 120, right: 120, top: 170, padding: "20px 24px", borderRadius: 22, background: "rgba(16,14,40,.82)", border: "6px solid #ffe44d", textAlign: "center", opacity: a, fontFamily: FONT_DISPLAY }}>
    <div style={{ color: "#ffe44d", fontSize: 40 }}>ANONYMOUS ONLINE CLAIMS. UNVERIFIED.</div><div style={{ color: "#fff", fontSize: 36 }}>NO NAMES. NO LINKS.</div></div>);
};

const Layer: React.FC<{ i: number; f: number; alpha: number }> = ({ i, f, alpha }) => {
  const { s, a, b } = SH[i], D = b - a;
  const make = useMemo(() => () => {
    const st = new Stage3(s, D, (lf, rig, cam) => {
      // in-world reveals (userData.rv = fraction of the shot at which an object appears, rvOff = when it disappears)
      const u = lf / D;
      st.root.traverse((o) => { if (o.userData.rv !== undefined) o.visible = u >= o.userData.rv; if (o.userData.rvOff !== undefined) o.visible = u < o.userData.rvOff; });
      const k = kickAt(lf + a); if (k) { cam.position.x += k * 0.1; cam.position.y += k * 0.06; cam.updateMatrixWorld(); }
    });
    return st;
  }, [i]);
  return <ShotView make={make} frame={f - a} alpha={alpha} />;
};
export const Ep01V3: React.FC = () => {
  const f = useCurrentFrame();
  let cur = SH.findIndex((q) => f >= q.a && f < q.b); if (cur < 0) cur = SH.length - 1;
  const n = SH[cur + 1], layers = [{ i: cur, alpha: 1 }];
  if (n && cur === 11 && f >= n.a - 6) layers.push({ i: cur + 1, alpha: clamp01((f - (n.a - 6)) / 6) }); // S12 -> S13: time passes, 6 f dissolve
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      {layers.map((l) => <Layer key={l.i} i={l.i} f={f} alpha={l.alpha} />)}
      <Sequence from={3}><Audio src={staticFile(VOICE_FILE)} /></Sequence>
      <CapView f={f} />
      <Disclaimer f={f} />
    </AbsoluteFill>
  );
};
void WORDS; void mouthFromWords; void blinkAt; void THREE; void EXPR;
