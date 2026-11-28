// EP01 v8 full episode: 15 literal shots on the v8 voice take. Word-timed cuts, camera kicks on key words, Gloom mouth sync, in-world reveals, key-word captions, re-timed mix.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ShotView } from "../Shot";
import { SHOTS4 } from "./beats4";
import { Stage3 } from "./beats3";
import { useKit } from "./kit";
import takeV3 from "../../../../build/ep01v9/words.json";
import { mouthFromWords } from "../../../lib/anim";
import { FONT_DISPLAY } from "../../../theme";
import { clamp01, smooth } from "../core";

export const FPS = 30, TAIL = 1.5;
type TW = { word: string; start: number; end: number; section: number };
const WS = takeV3.words as TW[];
const nw = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, "");
/** start time of the first word of `phrase` in the take (script v9): every cut and kick is anchored to spoken words */
const AT = (phrase: string, off = 0) => { const q = phrase.split(" ").map(nw); const i = WS.findIndex((_, k) => q.every((w, j) => WS[k + j] && nw(WS[k + j].word) === w)); if (i < 0) throw new Error(`ep01v9: phrase not found: ${phrase}`); return WS[i].start + off; };
export const TOTAL_S = takeV3.voice_len + TAIL;
export const TOTAL = Math.ceil(TOTAL_S * FPS);
/** shot order of script v9: [shot id, first spoken words of its line] */
const ORDER: [string, string][] = [["S01", "There's a man"], ["S02", "and the odd"], ["S04", "His targets"], ["S05", "His surest"], ["S06", "Then he started"], ["S07", "One reader"], ["S08", "and compared"], ["S09", "But after"], ["S03", "A week later"], ["S10", "a stranger"], ["S11", "and someone else"], ["S12", "Luckily"], ["S14", "Then again"], ["S13", "that people who"], ["S15", "That's the part"]];
const B = [...ORDER.map(([, ph], i) => (i ? AT(ph, -0.08) : 0)), TOTAL_S];
const SH0 = ORDER.map(([id], i) => { const s = SHOTS4.find((q) => q.id === id)!; return { s, a: Math.round(B[i] * FPS), b: Math.round(B[i + 1] * FPS), sa: Math.round(B[i] * FPS), sb: Math.round(B[i + 1] * FPS) }; });
const closer = (s: typeof SHOTS4[number]) => ({ ...s, keys: s.keys.map((q) => ({ ...q, pos: ((dx: number, dz: number, a: number) => [q.look[0] + (dx * Math.cos(a) - dz * Math.sin(a)) * 0.6, q.pos[1] + (q.look[1] - q.pos[1]) * 0.3, q.look[2] + (dx * Math.sin(a) + dz * Math.cos(a)) * 0.6])(q.pos[0] - q.look[0], q.pos[2] - q.look[2], 0.36) as [number, number, number], fov: q.fov - 6, roll: -(q.roll ?? 0) || 0.04 })) });
const SH: { s: typeof SHOTS4[number]; a: number; b: number; sa: number; sb: number; cut?: boolean }[] = [];
SH0.forEach((q) => { if (q.b - q.a > 150 && q.s.id !== "S05" && q.s.id !== "S15") { const m = Math.round((q.a + q.b) / 2); SH.push({ ...q, b: m }, { ...q, s: closer(q.s), a: m, cut: true }); } else SH.push(q); });
const WORDS = WS.map((w) => ({ start: w.start, end: w.end }));
const KICKS: [number, number][] = [[AT("death His"), 1.3], [AT("anger"), 1.2], [AT("forty targets"), 0.9], [AT("three hits"), 1.2], [AT("storm"), 1.5], [AT("went quiet", 0.1), 0.8], [AT("like me"), 0.8], [AT("fear That's"), 1.4], [AT("now he seems"), 0.8]];
const kickAt = (f: number) => { let o = 0; for (const [t, k] of KICKS) { const x = f - Math.round(t * FPS); if (x >= 0 && x < 7) o += k * (x % 2 ? -1 : 1) * (1 - x / 7); } return o; };
const talkAt = (f: number) => mouthFromWords(f, FPS, WORDS);

// Captions are built straight from the word timings (never hand-anchored), so they always match the audio.
type Cap = { from: number; to: number; words: [string, string?][] };
const Y = "#ffe44d", R = "#ff4a4a", M = "#7dffc8";
const KEY: Record<string, string> = { death: R, anger: R, worst: R, froze: R, fear: R, storm: R, unluckily: R, silent: R, quiet: R, strangers: Y, kill: R, trying: Y, three: Y, forty: Y, eight: Y, "1942": Y, week: Y, thousand: Y, metres: Y, metre: Y, note: Y, luckily: M, control: M, silence: M, anonymous: M, others: Y };
const buildCaps = (): Cap[] => {
  // phrase-sized chunks: never end on a joining word ("a", "to", "who", "could"...), never cross punctuation; ANGER stands alone
  const STOP = new Set("a an the and or but to of from for on in with by at that who he she they it his her their them him its is are was could can would will be been has have had it's they're there's that's if when while because so as then say says said him an no not never very just only right".split(" "));
  const chunks: TW[][] = []; let cur: TW[] = [];
  const text = (c: TW[]) => c.map((x) => x.word).join(" ");
  const flush = () => { if (cur.length) chunks.push(cur); cur = []; };
  WS.forEach((w, k) => {
    const nxt = WS[k + 1], lone = nw(w.word) === "anger";
    if (lone) flush();
    cur.push(w);
    if (lone || /[.,:;?!"]$/.test(w.word) || !nxt || nxt.section !== w.section || nw(nxt.word) === "anger") { flush(); return; }
    if (cur.length >= 2 && (text(cur).length + nxt.word.length + 1 > 18 || cur.length >= 4)) {
      let cut = cur.length; while (cut > 1 && STOP.has(cur[cut - 1].word.toLowerCase().replace(/[^a-z']/g, ""))) cut--;
      const rest = cur.slice(cut); cur = cur.slice(0, cut); flush(); cur = rest;
    }
  });
  flush();
  // a lone joining word ("who", "is", "to,") joins the chunk before it
  for (let i = chunks.length - 1; i > 0; i--) { const c = chunks[i], p = chunks[i - 1]; if (c.length === 1 && STOP.has(nw(c[0].word)) && p[p.length - 1].section === c[0].section && !/[.:;?!"]$/.test(p[p.length - 1].word)) { p.push(c[0]); chunks.splice(i, 1); } }
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
  const text = c.words.map((w) => w[0]).join(""), rage = /^ANGER/.test(text), size = rage ? 300 : Math.max(96, Math.min(180, 800 / (text.length * 0.5))), p = smooth(clamp01((t - c.from) / 0.07));
  return (<div style={{ position: "absolute", left: 80, width: 920, top: rage ? 1300 : 1400, marginLeft: rage ? (f % 2 ? 9 : -9) : 0, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1.05, letterSpacing: 2, transform: `scale(${0.85 + 0.15 * p})`, opacity: p, WebkitTextStroke: "10px #1a1020", paintOrder: "stroke fill" as any, textShadow: "0 8px 0 rgba(0,0,0,.45)" }}>
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
    if (s.id === "S05") st.rageAt = Math.round(AT("just pure", -0.05) * FPS) - a;
    return st;
  }, [i, ready]);
  return <ShotView make={make} frame={f - a} alpha={alpha} />;
};
export const Ep01V8: React.FC = () => {
  const f = useCurrentFrame(), ready = useKit();
  if (!ready) return <AbsoluteFill style={{ background: "#0a0c1c" }} />;
  let cur = SH.findIndex((q) => f >= q.a && f < q.b); if (cur < 0) cur = SH.length - 1;
  const n = SH[cur + 1], layers = [{ i: cur, alpha: 1 }];
  if (n && !n.cut && ["S09", "S13", "S14"].includes(SH[cur].s.id) && f >= n.a - 6) layers.push({ i: cur + 1, alpha: clamp01((f - (n.a - 6)) / 6) }); // 6 f dissolve where time passes
  return (
    <AbsoluteFill style={{ background: "#0a0c1c" }}>
      {layers.map((l) => <Layer key={l.i} i={l.i} f={f} alpha={l.alpha} ready={ready} />)}
      <Audio src={staticFile("audio/ep01v9/mix.wav")} />
      {(() => { const t = f / FPS - AT("anger"); return t > -0.45 && t < 0.9 ? <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 90px rgba(255,20,10,.75)", opacity: clamp01((t + 0.45) / 0.2) * clamp01((0.9 - t) / 0.3) }} /> : null; })()}
      <CapView f={f} />
      <Disclaimer f={f} />
    </AbsoluteFill>
  );
};
