import React from 'react';
import {Composition, Still} from 'remotion';
import './lib/fonts';
import {CastSheet} from './comps/CastSheet';
import {W, H, FPS} from './theme';
import {CastTest} from './videos/gloom/CastTest';
import {Ep02, TOTAL as EP2_TOTAL} from './videos/gloom/ep02';
import {Ep01, TOTAL as EP1_TOTAL} from './videos/gloom/ep01';
import {PropSheet, SHEET_SIZE} from './videos/gloom/PropSheet';
import {GloomClose} from './videos/gloom/GloomClose';
import {BeatStill} from './videos/gloom/ep01w/beats';
import {CastSheet3D} from './videos/gloom/CastSheet3D';

export const Root: React.FC = () => (
  <>
    <Composition id="Ep01" component={Ep01} width={1080} height={1920} fps={30} durationInFrames={EP1_TOTAL} />
    <Composition id="Ep02" component={Ep02} width={1080} height={1920} fps={30} durationInFrames={EP2_TOTAL} />
    <Still id="BeatStill" component={BeatStill as any} width={1080} height={1920} defaultProps={{beat: 0}} />
    <Still id="PropSheet" component={PropSheet} width={SHEET_SIZE.w} height={SHEET_SIZE.h} />
    <Still id="GloomClose" component={GloomClose} width={1080} height={1080} />
    <Still id="CastSheet3D" component={CastSheet3D} width={1920} height={1080} />
    <Still id="CastSheet" component={CastSheet} width={1920} height={1080} />
    <Composition id="CastTest" component={CastTest} width={1080} height={1920} fps={30} durationInFrames={150} />
  </>
);
