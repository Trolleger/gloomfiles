import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, W, SAFE, FONT_DISPLAY} from './theme';
import {pop} from './lib/anim';

export type Cap = {from: number; to: number; text: string; color?: string};

const split = (t: string): string[] => {
  const w = t.trim().split(/\s+/);
  if (w.length <= 2 || t.length <= 11) return [t.trim()];
  const mid = Math.ceil(w.length / 2);
  return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')];
};

/** One big caption. Auto-fits inside safe area x 80..940. Digits glow yellow. */
export const CaptionCard: React.FC<{text: string; frame: number; y?: number; color?: string}> = ({text, frame, y = 1240, color}) => {
  const lines = split(text.toUpperCase());
  const longest = Math.max(...lines.map((l) => l.length));
  const maxW = SAFE.x1 - SAFE.x0;
  const size = Math.max(84, Math.min(190, maxW / (longest * 0.47)));
  const s = pop(frame, 0);
  const hasDigit = /\d/.test(text);
  return (
    <div style={{position: 'absolute', left: SAFE.x0, width: maxW, top: y - size * lines.length * 0.55, textAlign: 'center', transform: `scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 2), transformOrigin: '50% 60%'}}>
      {lines.map((l, i) => (
        <div key={i} style={{fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1.04, letterSpacing: 2, color: color ?? (hasDigit ? C.yellow : '#fff'), WebkitTextStroke: `${Math.round(size * 0.07)}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.05}px 0 ${C.ink}, 0 10px 28px rgba(0,0,0,.7)`, whiteSpace: 'nowrap'}}>{l}</div>
      ))}
    </div>
  );
};

/** Caption track: list of {from,to} in SECONDS. Place inside a composition. */
export const CaptionTrack: React.FC<{caps: Cap[]; y?: number}> = ({caps, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const c = caps.find((k) => t >= k.from && t < k.to);
  if (!c) return null;
  return <CaptionCard text={c.text} frame={f - Math.round(c.from * fps)} y={y} color={c.color} />;
};
