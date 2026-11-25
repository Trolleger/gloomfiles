import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {W, H} from '../theme';

/** A scene = a Sequence (times in frames) with fade-in/out and a slow camera push. */
export const Scene: React.FC<{from: number; dur: number; push?: number; panX?: number; panY?: number; children: React.ReactNode; fade?: number; origin?: string}> = ({from, dur, push = 0.06, panX = 0, panY = 0, children, fade = 6, origin = '50% 50%'}) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <SceneInner dur={dur} push={push} panX={panX} panY={panY} fade={fade} origin={origin}>{children}</SceneInner>
  </Sequence>
);
const SceneInner: React.FC<{dur: number; push: number; panX: number; panY: number; fade: number; origin: string; children: React.ReactNode}> = ({dur, push, panX, panY, fade, origin, children}) => {
  const f = useCurrentFrame();
  const t = f / dur;
  const op = interpolate(f, [0, fade, dur - fade, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: op}}>
      <AbsoluteFill style={{transform: `translate(${panX * t}px, ${panY * t}px) scale(${1 + push * t})`, transformOrigin: origin}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
/** place an SVG layer in 1080x1920 coordinates */
export const Layer: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>{children}</svg>
);
