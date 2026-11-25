import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, W, H} from '../theme';
import {rnd} from '../lib/anim';

/** Navy backdrop + drifting dust + soft vignette. Wrap every scene in this. */
export const Stage: React.FC<{children?: React.ReactNode; top?: string; bottom?: string; dust?: boolean; vignette?: number}> = ({
  children, top = C.navy2, bottom = C.navy0, dust = true, vignette = 0.75,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>{children}
        {dust && Array.from({length: 26}).map((_, i) => {
          const x = (rnd(i) * W + f * (0.3 + rnd(i + 9) * 0.5)) % W;
          const y = (rnd(i + 3) * H - f * (0.2 + rnd(i + 5) * 0.4) + H * 4) % H;
          return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 7) * 3} fill="#cfd6ff" opacity={0.1 + rnd(i + 2) * 0.12} />;
        })}
      </svg>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 40%, rgba(2,3,12,${vignette}) 100%)`, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
