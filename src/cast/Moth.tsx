import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {blinkAt} from '../lib/anim';
import {Limb, EyeBall, Brow, Mouth, GroundShadow, stroke} from './parts';

export type MothExpr = 'nervous' | 'scared' | 'confused' | 'relieved' | 'excited' | 'flat';
export type MothProps = {
  x?: number; y?: number; scale?: number; flip?: boolean;
  expr?: MothExpr; talk?: number; look?: [number, number]; tilt?: number;
  armL?: number; armR?: number;   // degrees raised (0 hanging, 90 out sideways, 160 up)
  tremble?: number;               // 0..1 shaking amount
  sweat?: boolean; seed?: number; sit?: boolean; hide?: number; // hide 0..1 ducks down behind something
};

/** Moth. Origin = feet centre. ~430 units tall. Dark trousers, teal shirt, hair tuft. */
export const Moth: React.FC<MothProps> = ({
  x = 0, y = 0, scale = 1, flip, expr = 'nervous', talk = 0, look = [0, 0], tilt = 0,
  armL = 10, armR = 10, tremble = 0, sweat, seed = 5, sit, hide = 0,
}) => {
  const f = useCurrentFrame();
  const blink = blinkAt(f, seed);
  const tx = tremble * Math.sin(f * 2.3) * 4;
  const ty = tremble * Math.cos(f * 3.1) * 2 + hide * 200;
  const browTilt = {nervous: -8, scared: -14, confused: 4, relieved: 5, excited: 6, flat: 0}[expr];
  const browLift = {nervous: 6, scared: 14, confused: 4, relieved: 0, excited: 10, flat: 0}[expr];
  const curve = {nervous: -0.5, scared: -0.6, confused: -0.1, relieved: 0.6, excited: 0.9, flat: 0}[expr];
  const eyeR = expr === 'scared' ? 31 : 27;
  const pupil = expr === 'scared' ? 0.22 : 0.34;
  const open = Math.max(talk, expr === 'scared' ? 0.3 : expr === 'excited' ? 0.25 : 0);
  return (
    <g transform={`translate(${x + tx} ${y + ty}) scale(${flip ? -scale : scale} ${scale})`}>
      <GroundShadow rx={100} />
      {/* legs */}
      {sit ? null : [-26, 26].map((lx, i) => (
        <g key={i} transform={`translate(${lx} -125)`}>
          <line x1={0} y1={0} x2={0} y2={108} stroke={C.ink} strokeWidth={28} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={108} stroke="#2a2d4d" strokeWidth={20} strokeLinecap="round" />
          <path d="M -20 112 q 0 -14 22 -14 h 14 q 20 0 20 18 v 6 h -56 z" fill="#e8e4f4" {...stroke} strokeWidth={5} />
        </g>
      ))}
      {/* arms back */}
      <g transform="translate(-62 -262)"><Limb len1={64} len2={60} a1={armL} a2={-8} w={20} color={C.teal} /></g>
      {/* torso */}
      <path d="M -66 -118 C -76 -170 -70 -235 -52 -268 Q 0 -282 52 -268 C 70 -235 76 -170 66 -118 Q 0 -104 -66 -118 Z" fill={C.teal} {...stroke} />
      <path d="M 36 -262 C 66 -230 72 -170 62 -122 Q 78 -180 56 -250 Z" fill={C.tealDark} opacity={0.6} />
      <path d="M -62 -150 Q 0 -138 62 -150" fill="none" stroke={C.tealDark} strokeWidth={5} opacity={0.7} />
      <circle cx={0} cy={-205} r={7} fill="#fff" opacity={0.0} />
      <g transform="translate(62 -262)"><Limb len1={64} len2={60} a1={-armR} a2={8} w={20} color={C.teal} /></g>
      {/* head */}
      <g transform={`translate(0 -272) rotate(${tilt})`}>
        <rect x={-14} y={-6} width={28} height={20} fill={C.skinShade} {...stroke} strokeWidth={5} />
        <g transform="translate(0 -88)">
          <ellipse cx={0} cy={0} rx={82} ry={90} fill={C.skin2} {...stroke} />
          <path d="M 48 -78 C 88 -40 84 30 48 74 C 66 20 66 -40 48 -78 Z" fill={C.skinShade} opacity={0.55} />
          {/* tuft */}
          <path d="M -14 -86 C -22 -118 6 -126 4 -104 C 12 -124 34 -112 14 -86 Z" fill="#3a2b3e" {...stroke} strokeWidth={5} />
          <ellipse cx={-80} cy={8} rx={11} ry={18} fill={C.skin2} {...stroke} strokeWidth={5} />
          <ellipse cx={80} cy={8} rx={11} ry={18} fill={C.skinShade} {...stroke} strokeWidth={5} />
          <Brow x={-34} y={-44} w={40} tilt={browTilt / 2} lift={browLift / 2} />
          <Brow x={34} y={-44} w={40} tilt={-browTilt / 2} lift={browLift / 2} />
          <EyeBall cx={-33} cy={-8} r={eyeR} look={look} blink={blink} pupil={pupil} />
          <EyeBall cx={33} cy={-8} r={eyeR} look={look} blink={blink} pupil={pupil} />
          <Mouth cx={0} cy={50} w={expr === 'scared' ? 26 : 40} open={open + (expr === 'scared' ? 0.15 : 0)} curve={curve} />
          {sweat && <path d="M 70 -62 q 12 20 0 30 q -12 -10 0 -30 z" fill="#8fd8ff" {...stroke} strokeWidth={4} />}
          {expr === 'relieved' && <ellipse cx={-52} cy={24} rx={12} ry={7} fill="#ff8aa0" opacity={0.5} />}
        </g>
      </g>
    </g>
  );
};
