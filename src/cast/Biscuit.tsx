import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {blinkAt} from '../lib/anim';
import {GroundShadow, stroke} from './parts';

export type BiscuitExpr = 'stare' | 'annoyed' | 'relieved' | 'wide' | 'sleepy';
export type BiscuitProps = {
  x?: number; y?: number; scale?: number; flip?: boolean;
  expr?: BiscuitExpr; look?: [number, number]; tailSway?: number; seed?: number;
  pose?: 'sit' | 'loaf';
};

/** Biscuit, the black cat. Origin = ground under the body. ~250 units tall sitting. */
export const Biscuit: React.FC<BiscuitProps> = ({x = 0, y = 0, scale = 1, flip, expr = 'stare', look = [0, 0], tailSway = 1, seed = 9, pose = 'sit'}) => {
  const f = useCurrentFrame();
  const blink = expr === 'sleepy' ? 0.7 : blinkAt(f, seed + 40) * 1.0;
  const tail = Math.sin(f / (expr === 'annoyed' ? 5 : 16)) * 12 * tailSway;
  const ear = Math.sin(f / 23 + seed) > 0.96 ? -10 : 0;
  const pr = expr === 'wide' ? 4 : expr === 'annoyed' ? 6 : 7;     // pupil half-width (slit)
  const eyeH = expr === 'wide' ? 24 : 20;
  const lidCut = expr === 'annoyed' ? 0.45 : expr === 'relieved' ? 0.5 : blink;
  const eye = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={0} rx={19} ry={eyeH} fill={C.catEye} stroke={C.ink} strokeWidth={4} />
      <ellipse cx={cx + look[0] * 6} cy={look[1] * 5} rx={pr} ry={eyeH - 3} fill={C.ink} />
      <rect x={cx - 21} y={-eyeH - 3} width={42} height={(eyeH * 2 + 6) * lidCut} fill={C.cat} />
      {expr === 'relieved' && <path d={`M ${cx - 19} 4 Q ${cx} -14 ${cx + 19} 4`} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <GroundShadow rx={120} y={4} />
      {/* tail */}
      <g transform={`translate(98 -20) rotate(${tail})`}>
        <path d="M 0 0 C 70 6 96 -30 78 -90" fill="none" stroke={C.ink} strokeWidth={32} strokeLinecap="round" />
        <path d="M 0 0 C 70 6 96 -30 78 -90" fill="none" stroke={C.cat} strokeWidth={22} strokeLinecap="round" />
      </g>
      {/* body */}
      {pose === 'sit' ? (
        <path d="M -92 0 C -110 -70 -70 -150 -10 -150 C 50 -150 110 -90 98 0 Z" fill={C.cat} {...stroke} />
      ) : (
        <path d="M -110 0 C -120 -70 -60 -100 0 -100 C 70 -100 124 -60 110 0 Z" fill={C.cat} {...stroke} />
      )}
      <path d="M 40 -140 C 90 -120 112 -60 98 0 C 100 -60 80 -110 40 -140 Z" fill={C.catLight} opacity={0.6} />
      {/* paws */}
      <ellipse cx={-52} cy={-6} rx={32} ry={14} fill={C.cat} {...stroke} strokeWidth={5} />
      <ellipse cx={-8} cy={-6} rx={28} ry={13} fill={C.cat} {...stroke} strokeWidth={5} />
      {/* head */}
      <g transform={`translate(-34 ${pose === 'sit' ? -168 : -108})`}>
        <g transform={`rotate(${ear} -52 -50)`}><path d="M -68 -30 L -62 -92 L -22 -52 Z" fill={C.cat} {...stroke} /><path d="M -60 -44 L -58 -76 L -40 -54 Z" fill="#3f2b45" /></g>
        <path d="M 68 -30 L 62 -92 L 22 -52 Z" fill={C.cat} {...stroke} />
        <path d="M 60 -44 L 58 -76 L 40 -54 Z" fill="#3f2b45" />
        <ellipse cx={0} cy={0} rx={88} ry={70} fill={C.cat} {...stroke} />
        <path d="M 40 -56 C 88 -30 88 30 40 62 C 70 20 70 -30 40 -56 Z" fill={C.catLight} opacity={0.55} />
        <g transform="translate(0 -6)">{eye(-36)}{eye(36)}</g>
        <path d="M -8 24 L 8 24 L 0 34 Z" fill="#c26a86" {...stroke} strokeWidth={3} />
        <path d="M 0 34 Q -10 46 -22 40 M 0 34 Q 10 46 22 40" fill="none" stroke="#6d6a8a" strokeWidth={3} strokeLinecap="round" />
        {[-1, 1].map((s) => [0, 12].map((d) => <line key={`${s}${d}`} x1={s * 40} y1={28 + d} x2={s * (96 + d * 0.5)} y2={22 + d * 2} stroke="#8c89aa" strokeWidth={2.5} strokeLinecap="round" />))}
      </g>
    </g>
  );
};
