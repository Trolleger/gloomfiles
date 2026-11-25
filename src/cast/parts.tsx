import React from 'react';
import {C} from '../theme';

export const SW = 6; // standard outline width
export const stroke = {stroke: C.ink, strokeWidth: SW, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** a limb: two segments with a bend, drawn from shoulder at 0,0 pointing down */
export const Limb: React.FC<{len1: number; len2: number; a1: number; a2: number; w?: number; color?: string; hand?: React.ReactNode; handColor?: string}> = ({len1, len2, a1, a2, w = 22, color = C.suit, hand, handColor = C.skin}) => (
  <g transform={`rotate(${a1})`}>
    <line x1={0} y1={0} x2={0} y2={len1} stroke={C.ink} strokeWidth={w + SW} strokeLinecap="round" />
    <g transform={`translate(0 ${len1}) rotate(${a2})`}>
      <line x1={0} y1={0} x2={0} y2={len2} stroke={C.ink} strokeWidth={w + SW} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={len2} stroke={handColor === color ? color : C.skin} strokeWidth={w * 0.8} strokeLinecap="round" />
      <g transform={`translate(0 ${len2})`}>{hand ?? <circle r={w * 0.7} fill={handColor} {...stroke} />}</g>
    </g>
    <line x1={0} y1={0} x2={0} y2={len1} stroke={color} strokeWidth={w} strokeLinecap="round" />
    <circle r={w * 0.5} cy={len1} fill={color} />
  </g>
);

export type Eye = {cx: number; cy: number; r: number; look: [number, number]; blink: number; pupil?: number; lid?: number};
/** round cartoon eye: white, pupil that looks, lid for blink */
export const EyeBall: React.FC<Eye> = ({cx, cy, r, look, blink, pupil = 0.38, lid = 0}) => {
  const pr = r * pupil;
  const px = cx + look[0] * (r - pr - 2), py = cy + look[1] * (r - pr - 2);
  const close = Math.max(blink, lid);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff" {...stroke} strokeWidth={5} />
      <circle cx={px} cy={py} r={pr} fill={C.ink} />
      <circle cx={px - pr * 0.3} cy={py - pr * 0.35} r={pr * 0.28} fill="#fff" />
      {close > 0.01 && (
        <clipPath id={`lid-${cx}-${cy}`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      )}
      {close > 0.01 && (
        <g clipPath={`url(#lid-${cx}-${cy})`}>
          <rect x={cx - r - 2} y={cy - r - 2} width={r * 2 + 4} height={(r * 2 + 4) * close} fill={C.skin} />
          <line x1={cx - r} x2={cx + r} y1={cy - r + (r * 2) * close} y2={cy - r + (r * 2) * close} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

export const Brow: React.FC<{x: number; y: number; w: number; tilt: number; lift?: number; color?: string}> = ({x, y, w, tilt, lift = 0, color = C.ink}) => (
  <line x1={x - w / 2} x2={x + w / 2} y1={y - lift - tilt} y2={y - lift + tilt} stroke={color} strokeWidth={9} strokeLinecap="round" />
);

/** mouth: open 0..1, curve -1 (frown) .. 1 (smile), width */
export const Mouth: React.FC<{cx: number; cy: number; w: number; open: number; curve?: number}> = ({cx, cy, w, open, curve = 0}) => {
  const h = open * w * 0.7;
  const c = curve * w * 0.28;
  if (h < 3) {
    return <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + c * 1.6} ${cx + w / 2} ${cy}`} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />;
  }
  return (
    <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy - h * 0.15 + c} ${cx + w / 2} ${cy} Q ${cx} ${cy + h * 1.6 + c} ${cx - w / 2} ${cy} Z`} fill="#3a0f1c" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
  );
};

/** soft ground shadow */
export const GroundShadow: React.FC<{rx: number; ry?: number; y?: number; opacity?: number}> = ({rx, ry = rx * 0.14, y = 6, opacity = 0.5}) => (
  <ellipse cx={0} cy={y} rx={rx} ry={ry} fill="#000" opacity={opacity} />
);
