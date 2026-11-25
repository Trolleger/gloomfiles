import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Gloom} from '../cast/Gloom';
import {Moth} from '../cast/Moth';
import {Biscuit} from '../cast/Biscuit';
import {FONT_DISPLAY, C} from '../theme';

const L: React.FC<{x: number; y: number; t: string}> = ({x, y, t}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={34} fill="#c9d0ff" letterSpacing={2}>{t}</text>
);

/** Landscape contact sheet 1920x1080: cast, expressions and poses. */
export const CastSheet: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${C.navy3} 0%, ${C.navy1} 55%, ${C.navy0} 100%)`}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <text x={960} y={70} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={58} fill="#fff" letterSpacing={6}>GLOOM FILES · CAST v2</text>
      {/* row 1 */}
      <Gloom x={190} y={560} scale={0.55} expr="deadpan" point={14} />
      <L x={190} y={610} t="PROF. GLOOM" />
      <Gloom x={560} y={560} scale={0.55} expr="raised" talk={0.7} point={78} elbow={10} light={0.9} beamLen={520} tilt={-4} look={[1, 0]} />
      <L x={560} y={610} t="flashlight · talking" />
      <Moth x={980} y={560} scale={0.78} expr="nervous" sweat look={[-1, 0.2]} armL={30} armR={60} />
      <L x={980} y={610} t="MOTH · nervous" />
      <Moth x={1230} y={560} scale={0.78} expr="scared" tremble={1} sweat armL={120} armR={120} />
      <L x={1230} y={610} t="scared" />
      <Moth x={1480} y={560} scale={0.78} expr="confused" tilt={-8} armR={150} look={[0, -1]} />
      <L x={1480} y={610} t="confused" />
      <Moth x={1730} y={560} scale={0.78} expr="relieved" armL={14} armR={14} />
      <L x={1730} y={610} t="relieved" />
      {/* row 2 */}
      <Gloom x={150} y={1010} scale={0.4} expr="surprised" talk={0.4} point={20} />
      <L x={150} y={1055} t="surprised" />
      <Gloom x={400} y={1010} scale={0.4} expr="squint" point={20} />
      <L x={400} y={1055} t="squint" />
      <Gloom x={650} y={1010} scale={0.4} expr="tired" tilt={6} point={20} />
      <L x={650} y={1055} t="tired" />
      <Gloom x={880} y={1010} scale={0.4} expr="grim" point={20} />
      <L x={880} y={1055} t="grim" />
      <Biscuit x={1130} y={1010} scale={0.6} expr="stare" />
      <L x={1130} y={1055} t="BISCUIT · stare" />
      <Biscuit x={1400} y={1010} scale={0.6} expr="annoyed" />
      <L x={1400} y={1055} t="annoyed" />
      <Biscuit x={1650} y={1010} scale={0.6} expr="relieved" />
      <L x={1650} y={1055} t="relieved" />
      <Biscuit x={1810} y={1010} scale={0.4} expr="wide" pose="loaf" />
    </svg>
  </AbsoluteFill>
);
