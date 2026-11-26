// One shot = one ThreeCanvas with the skill's post chain: ink -> lens pre -> lens main -> bloom -> NEUTRAL tone map -> grade (MSAA 4).
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, getInputProps, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { BlendFunction, BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { InkPass, noInkFallback } from "./ink";
import { LensBlur } from "./lensblur";
import { GradeEffect, GRADES, GRADE_STRENGTH, gradeFor } from "./grade";
import { Light } from "./lights";

/** what a set exposes to the post chain each frame */
export type FrameInfo = { focus: THREE.Vector3; cInf: number; light: Light };
export interface Stage3D { root: THREE.Object3D; update(f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): FrameInfo }

const makeBloom = () => {
  const b = new BloomEffect({ blendFunction: BlendFunction.ADD, intensity: 0.5, luminanceThreshold: 1.0, luminanceSmoothing: 0.2, mipmapBlur: true, levels: 6, radius: 0.6 });
  const mip = b.mipmapBlurPass; const setSize = mip.setSize.bind(mip);
  mip.setSize = (w: number, h: number) => setSize(Math.round((1920 * w) / Math.max(h, 1)), 1920);
  return b;
};
const fwd = new THREE.Vector3(), fpt = new THREE.Vector3();

const Inner: React.FC<{ make: () => Stage3D; frame: number }> = ({ make, frame }) => {
  const { camera, scene } = useThree();
  const stage = useMemo(make, [make]);
  const fx = useMemo(() => ({
    ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
    lens: new LensBlur({ maxCoC: 24, nearScale: 1.2 }),
    bloom: makeBloom(),
    tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
    grade: new GradeEffect(GRADES.night, GRADE_STRENGTH.night),
  }), [camera, scene]);
  useEffect(() => () => { (fx.ink as any).dispose?.(); }, [fx]);
  const post = useMemo(() => (
    <EffectComposer multisampling={4}>
      <primitive object={fx.ink} dispose={null} />
      <primitive object={fx.lens.pre} dispose={null} />
      <primitive object={fx.lens.main} dispose={null} />
      <primitive object={fx.bloom} dispose={null} />
      <primitive object={fx.tone} dispose={null} />
      <primitive object={fx.grade} dispose={null} />
    </EffectComposer>
  ), [fx]);
  const cam = camera as THREE.PerspectiveCamera;
  const info = stage.update(frame, cam, scene);
  noInkFallback(stage.root);
  cam.getWorldDirection(fwd);
  fpt.copy(info.focus);
  fx.lens.focus = Math.max(0.3, fpt.sub(cam.position).dot(fwd));
  fx.lens.cInf = info.cInf;
  gradeFor(fx.grade, info.light);
  return (<><primitive object={stage.root} dispose={null} />{post}</>);
};

const dprOverride = () => (getInputProps() as { post?: { dpr?: number } }).post?.dpr;
export const ShotView: React.FC<{ make: () => Stage3D; frame?: number; alpha?: number; w?: number; h?: number }> = ({ make, frame, alpha = 1, w = 1080, h = 1920 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      <ThreeCanvas width={w} height={h} {...(dprOverride() ? { dpr: dprOverride() } : {})} shadows gl={{ antialias: false, stencil: false, powerPreference: "high-performance", toneMappingExposure: 1.0 }} camera={{ fov: 40, near: 0.15, far: 1500 }}>
        <Inner make={make} frame={frame ?? f} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
