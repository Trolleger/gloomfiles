import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {blinkAt} from '../lib/anim';
import {Limb, EyeBall, Brow, Mouth, GroundShadow, stroke, SW} from './parts';

export type GloomExpr = 'deadpan' | 'raised' | 'squint' | 'surprised' | 'tired' | 'grim';
export type GloomProps = {
  x?: number; y?: number; scale?: number; flip?: boolean;
  expr?: GloomExpr;
  talk?: number;            // 0..1 mouth openness (use mouthFromWords)
  look?: [number, number];  // -1..1 pupils
  tilt?: number;            // head tilt degrees
  point?: number;           // flashlight arm raise, degrees (0 = hanging, 90 = out front, 140 = up)
  elbow?: number;           // bend of the flashlight forearm
  otherArm?: number;        // free arm angle
  light?: number;           // beam opacity 0..1
  beamLen?: number;         // beam length
  hold?: 'flashlight' | 'none' | 'paper';
  walk?: number;            // frames-based walk phase (0 = standing)
  idle?: boolean;
  seed?: number;
};

/** Professor Gloom. Origin = feet centre. ~620 units tall. */
export const Gloom: React.FC<GloomProps> = ({
  x = 0, y = 0, scale = 1, flip, expr = 'deadpan', talk = 0, look = [0, 0], tilt = 0,
  point = 12, elbow = 0, otherArm = -8, light = 0, beamLen = 700, hold = 'flashlight', walk = 0, idle = true, seed = 1,
}) => {
  const f = useCurrentFrame();
  const blink = blinkAt(f, seed);
  const bob = idle ? Math.sin(f / 14) * 3 : 0;
  const sway = walk ? Math.sin(walk * 0.4) : 0;
  const browL = {deadpan: [0, 0], raised: [-2, 8], squint: [10, -2], surprised: [-4, 16], tired: [-8, -6], grim: [12, 0]}[expr];
  const browR = {deadpan: [0, 0], raised: [0, 0], squint: [-10, -2], surprised: [4, 16], tired: [8, -6], grim: [-12, 0]}[expr];
  const lid = expr === 'squint' ? 0.35 : expr === 'tired' ? 0.4 : 0;
  const open = expr === 'surprised' ? Math.max(talk, 0.45) : talk * 0.9;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <GroundShadow rx={150} />
      {/* legs */}
      {[-48, 48].map((lx, i) => (
        <g key={i} transform={`translate(${lx} -205) rotate(${(i ? 1 : -1) * sway * 10})`}>
          <line x1={0} y1={0} x2={0} y2={190} stroke={C.ink} strokeWidth={34 + SW} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={190} stroke={C.suitDark} strokeWidth={34} strokeLinecap="round" />
          <path d={`M -30 190 q 0 -16 28 -16 h 30 q 22 0 22 20 v 8 h -80 z`} transform="translate(-6 0)" fill="#17122a" {...stroke} />
        </g>
      ))}
      <g transform={`translate(0 ${bob})`}>
        {/* free arm (back) */}
        <g transform="translate(-112 -400)">
          <Limb len1={105} len2={100} a1={-otherArm * -1 + 6} a2={-6} w={30} />
        </g>
        {/* torso */}
        <path d="M -118 -205 C -132 -300 -122 -390 -88 -432 Q 0 -452 88 -432 C 122 -390 132 -300 118 -205 Q 0 -190 -118 -205 Z" fill={C.suit} {...stroke} />
        <path d="M 60 -425 C 108 -385 120 -300 108 -212 Q 130 -300 98 -405 Z" fill={C.suitLight} opacity={0.55} />
        <path d="M -118 -205 Q 0 -190 118 -205 L 114 -232 Q 0 -218 -114 -232 Z" fill={C.suitDark} opacity={0.5} />
        {/* shirt V + tie */}
        <path d="M -30 -438 L 0 -360 L 30 -438 Z" fill="#e8e4f4" {...stroke} strokeWidth={4} />
        <path d="M -12 -380 L 12 -380 L 20 -250 L 0 -228 L -20 -250 Z" fill={C.tie} {...stroke} strokeWidth={5} />
        <path d="M -14 -392 L 14 -392 L 8 -372 L -8 -372 Z" fill="#a81c33" {...stroke} strokeWidth={4} />
        {/* buttons */}
        <circle cx={-46} cy={-300} r={5} fill={C.ink} /><circle cx={-46} cy={-250} r={5} fill={C.ink} />
        {/* flashlight arm (front) */}
        <g transform="translate(112 -400)">
          <Limb len1={105} len2={100} a1={-point} a2={-elbow} w={30}
            hand={hold === 'flashlight' ? (
              <g transform="rotate(90)">
                {/* beam */}
                {light > 0.01 && (
                  <g opacity={light}>
                    <defs>
                      <linearGradient id="beamg" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0" stopColor={C.beam} stopOpacity="0.9" />
                        <stop offset="1" stopColor={C.beam} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon points={`58,-12 ${beamLen},${-beamLen * 0.28} ${beamLen},${beamLen * 0.28} 58,12`} fill="url(#beamg)" style={{mixBlendMode: 'screen'}} />
                  </g>
                )}
                <rect x={-8} y={-13} width={62} height={26} rx={7} fill="#52576a" {...stroke} strokeWidth={5} />
                <path d="M 54 -20 L 76 -30 L 76 30 L 54 20 Z" fill="#3a3e50" {...stroke} strokeWidth={5} />
                <ellipse cx={76} cy={0} rx={5} ry={26} fill={light > 0.01 ? C.beam : '#8a8fa6'} stroke={C.ink} strokeWidth={4} />
                <circle cx={-2} cy={0} r={17} fill={C.skin} {...stroke} strokeWidth={5} />
              </g>
            ) : undefined} />
        </g>
        {/* neck + head */}
        <g transform={`translate(0 -440) rotate(${tilt})`}>
          <rect x={-24} y={-8} width={48} height={30} fill={C.skinShade} {...stroke} strokeWidth={5} />
          <g transform="translate(0 -108)">
            {/* ears */}
            <ellipse cx={-104} cy={10} rx={16} ry={26} fill={C.skin} {...stroke} />
            <ellipse cx={104} cy={10} rx={16} ry={26} fill={C.skinShade} {...stroke} />
            {/* head */}
            <ellipse cx={0} cy={0} rx={106} ry={122} fill={C.skin} {...stroke} />
            <path d="M 60 -108 C 112 -70 110 40 62 100 C 88 30 88 -60 60 -108 Z" fill={C.skinShade} opacity={0.6} />
            {/* sparse hair ring */}
            <path d="M -104 -22 C -112 -92 -70 -112 -50 -110 C -84 -96 -98 -62 -96 -22 Z" fill="#6d5f86" {...stroke} strokeWidth={4} />
            <path d="M 104 -22 C 112 -92 70 -112 50 -110 C 84 -96 98 -62 96 -22 Z" fill="#6d5f86" {...stroke} strokeWidth={4} />
            {/* brows */}
            <Brow x={-44 + browL[0]} y={-52} w={52} tilt={browL[1] / 2 * -1 + (expr === 'raised' ? 0 : 0)} lift={browL[1] / 2} />
            <Brow x={44 + browR[0]} y={-52} w={52} tilt={browR[1] / 2 * -1} lift={browR[1] / 2} />
            {/* eyes */}
            <EyeBall cx={-44} cy={-14} r={21} look={look} blink={blink} lid={Math.max(lid, expr==='surprised'?0:0.12)} pupil={0.36} />
            <EyeBall cx={44} cy={-14} r={21} look={look} blink={blink} lid={Math.max(lid, expr==='surprised'?0:0.12)} pupil={0.36} />
            {/* glasses */}
            <circle cx={-44} cy={-14} r={37} fill="#cfe6ff" opacity={0.12} />
            <circle cx={44} cy={-14} r={37} fill="#cfe6ff" opacity={0.12} />
            <circle cx={-44} cy={-14} r={37} fill="none" stroke={C.ink} strokeWidth={8} />
            <circle cx={44} cy={-14} r={37} fill="none" stroke={C.ink} strokeWidth={8} />
            <path d="M -4 -18 Q 0 -26 4 -18" fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
            <line x1={-84} y1={-18} x2={-104} y2={-12} stroke={C.ink} strokeWidth={6} />
            <line x1={84} y1={-18} x2={104} y2={-12} stroke={C.ink} strokeWidth={6} />
            <path d="M -30 -36 L -52 -52" stroke="#fff" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
            {/* nose */}
            <path d="M -4 14 Q 12 34 -4 40" fill="none" stroke={C.skinShade} strokeWidth={7} strokeLinecap="round" />
            {/* mouth (deadpan = tiny, flat) */}
            <Mouth cx={0} cy={72} w={expr === 'surprised' ? 30 : 56} open={open} curve={expr === 'grim' ? -0.4 : expr === 'tired' ? -0.2 : 0} />
          </g>
        </g>
      </g>
    </g>
  );
};
