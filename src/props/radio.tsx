import React from 'react';
import {C, FONT_DISPLAY, FONT_TYPE} from '../theme';
import {rnd, clamp} from '../lib/anim';
import {stroke} from '../cast/parts';

/** night sky with twinkling stars */
export const Stars: React.FC<{frame: number; n?: number; h?: number; seed?: number}> = ({frame, n = 90, h = 1100, seed = 0}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const tw = 0.5 + 0.5 * Math.sin(frame / (10 + rnd(i + seed) * 20) + i);
      return <circle key={i} cx={rnd(i * 2 + seed) * 1080} cy={rnd(i * 3 + 1 + seed) * h} r={1.5 + rnd(i + 5) * 3} fill="#e8eeff" opacity={0.25 + tw * 0.7} />;
    })}
  </g>
);

/** big radio dish on a tower. angle = tilt of dish (deg, 0 = pointing up-right). Origin = base centre. */
export const Dish: React.FC<{x: number; y: number; scale?: number; angle?: number; spin?: number}> = ({x, y, scale = 1, angle = -40, spin = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* tower */}
    <path d="M -60 0 L -26 -300 L 26 -300 L 60 0 Z" fill="#2c3466" {...stroke} />
    <path d="M -44 -90 L 44 -90 M -36 -190 L 36 -190" stroke={C.ink} strokeWidth={6} />
    <path d="M 26 -300 L 60 0 L 40 0 L 14 -300 Z" fill="#3b4586" opacity={0.7} />
    <circle cx={0} cy={-310} r={24} fill="#46509a" {...stroke} />
    {/* dish group pivots at the top */}
    <g transform={`translate(0 -310) rotate(${angle + spin})`}>
      <path d="M -170 -120 Q 0 70 170 -120 L 150 -134 Q 0 36 -150 -134 Z" fill="#9aa6e0" {...stroke} transform="rotate(0)" />
      <path d="M -150 -134 Q 0 36 150 -134 Q 0 -10 -150 -134 Z" fill="#6773b8" />
      <line x1={0} y1={-12} x2={0} y2={-190} stroke={C.ink} strokeWidth={9} />
      <circle cx={0} cy={-196} r={14} fill="#e5e8ff" {...stroke} />
    </g>
    <circle cx={0} cy={-318} r={0} />
    <rect x={-100} y={-20} width={200} height={26} rx={8} fill="#1d2248" {...stroke} />
  </g>
);

/** hill silhouettes at the bottom of the screen */
export const Hills: React.FC<{y?: number; c1?: string; c2?: string}> = ({y = 1330, c1 = '#0c1030', c2 = '#070a22'}) => (
  <g>
    <path d={`M 0 ${y - 70} C 220 ${y - 150} 420 ${y - 20} 640 ${y - 90} C 820 ${y - 150} 960 ${y - 70} 1080 ${y - 110} L 1080 1920 L 0 1920 Z`} fill={c1} />
    <path d={`M 0 ${y + 40} C 260 ${y - 40} 520 ${y + 90} 780 ${y + 10} C 920 ${y - 30} 1000 ${y + 20} 1080 ${y} L 1080 1920 L 0 1920 Z`} fill={c2} />
  </g>
);

/** moon */
export const Moon: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 80}) => (
  <g>
    <circle cx={x} cy={y} r={r * 1.8} fill="#9fb4ff" opacity={0.08} />
    <circle cx={x} cy={y} r={r * 1.3} fill="#9fb4ff" opacity={0.1} />
    <circle cx={x} cy={y} r={r} fill="#eef2ff" />
    <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#c8d0f0" /><circle cx={x + r * 0.35} cy={y + r * 0.3} r={r * 0.25} fill="#d4dbf6" />
  </g>
);

/** digital clock */
export const DigitalClock: React.FC<{x: number; y: number; text: string; scale?: number}> = ({x, y, text, scale = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-170} y={-60} width={340} height={120} rx={18} fill="#0a0d1f" {...stroke} />
    <rect x={-158} y={-48} width={316} height={96} rx={10} fill="#05140f" />
    <text x={0} y={30} textAnchor="middle" fontFamily={FONT_TYPE} fontSize={84} fill="#5dffb0" style={{filter: 'drop-shadow(0 0 10px #5dffb0)'}}>{text}</text>
  </g>
);

/** circular countdown/timer ring that shows seconds count in the middle */
export const TimerRing: React.FC<{x: number; y: number; r?: number; value: number; max: number; label?: string}> = ({x, y, r = 150, value, max, label = 'SECONDS'}) => {
  const p = clamp(value / max);
  const circ = 2 * Math.PI * r;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 24} fill="#0a0d24" opacity={0.85} />
      <circle r={r} fill="none" stroke="#25306e" strokeWidth={26} />
      <circle r={r} fill="none" stroke={C.mint} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${circ * p} ${circ}`} transform="rotate(-90)" style={{filter: 'drop-shadow(0 0 12px #7dffd0)'}} />
      <text y={36} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={150} fill="#fff" stroke={C.ink} strokeWidth={8} paintOrder="stroke">{Math.round(value)}</text>
      <text y={r - 28} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={34} fill="#9fb4ff" letterSpacing={4}>{label}</text>
    </g>
  );
};

/** radio wave arcs radiating from a point towards a direction (deg) */
export const Waves: React.FC<{x: number; y: number; frame: number; dir?: number; color?: string; n?: number; maxR?: number; speed?: number}> = ({x, y, frame, dir = 0, color = '#7dffd0', n = 4, maxR = 520, speed = 3}) => (
  <g transform={`translate(${x} ${y}) rotate(${dir})`}>
    {Array.from({length: n}).map((_, i) => {
      const r = ((frame * speed + (i * maxR) / n) % maxR);
      const o = 1 - r / maxR;
      return <path key={i} d={`M ${r * Math.cos(-0.7)} ${r * Math.sin(-0.7)} A ${r} ${r} 0 0 1 ${r * Math.cos(0.7)} ${r * Math.sin(0.7)}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" opacity={o * 0.9} />;
    })}
  </g>
);
