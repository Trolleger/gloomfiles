import {interpolate, spring, Easing} from 'remotion';
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** 0..1 progress between frame a and b */
export const prog = (f: number, a: number, b: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const pop = (f: number, start: number, fps = 30) =>
  spring({frame: f - start, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
/** deterministic pseudo random 0..1 */
export const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export type Word = {start: number; end: number};
/**
 * Mouth openness 0..1 from word timings (seconds). Pass the frame, fps and
 * word list (from Piper timing or evenly spread). 0 outside words.
 */
export const mouthFromWords = (frame: number, fps: number, words: Word[]) => {
  const t = frame / fps;
  for (const w of words) {
    if (t >= w.start && t <= w.end) {
      const p = (t - w.start) / Math.max(0.01, w.end - w.start);
      const env = Math.sin(Math.PI * p);             // open/close per word
      const jitter = 0.65 + 0.35 * Math.sin(t * 38 + w.start * 9); // syllable flutter
      return clamp(env * jitter * 1.15);
    }
  }
  return 0;
};
/** Evenly spread fake word timings across a line (fallback until real TTS timing exists) */
export const evenWords = (text: string, startS: number, endS: number): Word[] => {
  const ws = text.split(/\s+/).filter(Boolean);
  const per = (endS - startS) / ws.length;
  return ws.map((_, i) => ({start: startS + i * per + 0.02, end: startS + (i + 1) * per - 0.03}));
};
/** blink amount 0 (open)..1 (closed), deterministic per seed */
export const blinkAt = (frame: number, seed = 0) => {
  const period = 90 + Math.floor(rnd(seed) * 60);
  const k = (frame + Math.floor(rnd(seed + 1) * period)) % period;
  if (k < 5) return Math.sin((k / 5) * Math.PI);
  return 0;
};
