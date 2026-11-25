// Shared 3D plumbing for every Gloom Files episode: light rig (camera-relative key, frozen per shot), sky dome, fog,
// card pools, per-frame cast placement. Structure follows the skill's world.ts (same uniforms, same NOINK rule).
import * as THREE from "three";
import { Pool, Actor, Fx } from "./cards";
import { Pen } from "./toon";
import { LIGHTS, LOOK, Light } from "./lights";
import { TONE, CHAR, untone } from "./shade";
import { NOINK } from "./ink";

export const SU = 0.00216; // metres per design unit (1000 units = 2.16 m)
export type V3 = [number, number, number];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
/** smootherstep glide (skill: 18-40 f) */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };

export type Key = { f: number; dur?: number; cut?: boolean; pos: V3; look: V3; fov?: number; roll?: number };
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
/** camera path of one shot: keys in LOCAL frames; between keys a smootherstep glide of `dur` frames ending at the next key
 *  (or a hold). Every hold creeps toward the look target (skill: 0.15-0.35 %/f; default .2). */
export const camPath = (keys: Key[], f: number, creep = 0.0020): Cam => {
  let k = 0;
  for (let i = 0; i < keys.length; i++) if (f >= keys[i].f) k = i;
  const a = keys[k], b = keys[k + 1];
  let pos = a.pos, look = a.look, fov = a.fov ?? 40, roll = a.roll ?? 0, held = f - a.f;
  if (b) {
    const dur = b.dur ?? 30, start = b.f - dur;
    if (f >= start) {
      const u = b.cut ? 0 : glide((f - start) / dur);
      const L = (x: number, y: number) => x + (y - x) * u;
      pos = [L(a.pos[0], b.pos[0]), L(a.pos[1], b.pos[1]), L(a.pos[2], b.pos[2])];
      look = [L(a.look[0], b.look[0]), L(a.look[1], b.look[1]), L(a.look[2], b.look[2])];
      fov = L(fov, b.fov ?? 40); roll = L(roll, b.roll ?? 0);
      held = Math.max(0, start - a.f);
    } else held = f - a.f;
  }
  // creep: move the camera toward the look point; capped at 22 % so long holds do not fly through the set
  const c = Math.min(0.22, creep * held);
  const p: V3 = [pos[0] + (look[0] - pos[0]) * c, pos[1] + (look[1] - pos[1]) * c, pos[2] + (look[2] - pos[2]) * c];
  return { pos: p, look, fov, roll };
};

const tmp = new THREE.Vector3();
export type CardPlace = { key: string; draw: (p: Pen) => void; w: number; h: number; k: number; x: number; y: number; z: number; scale?: number; mirror?: boolean; yaw?: number; roll?: number };
export type FxPlace = { key: string; cw: number; ch: number; draw: (p: Pen) => void; x: number; y: number; z: number; w: number; h: number; soft?: boolean; flat?: boolean; rot?: number; billboard?: boolean };

export class Rig {
  root = new THREE.Group();
  pool = new Pool();
  actors: Actor[] = []; fxs: Fx[] = [];
  hemi = new THREE.HemisphereLight("#cfe6ff", "#6c5c8c", 1);
  sun = new THREE.DirectionalLight("#fff0d6", 2.6);
  fog = new THREE.Fog("#1a2658", 18, 160);
  skyMat: THREE.ShaderMaterial; sky: THREE.Mesh;
  private used: Actor[] = []; private fused: Fx[] = [];
  private ai = 0; private fi = 0;
  sunDir = new THREE.Vector3(0.4, 0.7, -0.4);

  constructor() {
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() }, c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el)); c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el)); c = mix(c, c4, smoothstep(e.z, e.w, el)); gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1100, 48, 24), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK);
    this.sun.castShadow = true; this.sun.shadow.mapSize.set(2048, 2048);
    this.root.add(this.sky, this.hemi, this.sun, this.sun.target);
  }
  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fx(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  /** set the camera, light preset (sun camera-relative, frozen per shot via azOverride) and sky for this frame */
  frame(cam: THREE.PerspectiveCamera, scene: THREE.Scene, c: Cam, light: Light, opts: { az?: number; el?: number; focusR?: number } = {}) {
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = 0.15; cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    cam.layers.enable(NOINK);
    const L = LIGHTS[light], K = LOOK[light];
    const focus = new THREE.Vector3(...c.look), dist = cam.position.distanceTo(focus);
    const fwd = new THREE.Vector3().subVectors(focus, cam.position).setY(0).normalize();
    const az = THREE.MathUtils.degToRad(opts.az ?? L.az), el = THREE.MathUtils.degToRad(opts.el ?? L.el);
    const hx = fwd.x * Math.cos(az) - fwd.z * Math.sin(az), hz = fwd.z * Math.cos(az) + fwd.x * Math.sin(az);
    this.sunDir.set(hx * Math.cos(el), Math.sin(el), hz * Math.cos(el)).normalize();
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    const Rr = opts.focusR ?? THREE.MathUtils.clamp(dist * 1.15 + 6, 10, 60);
    this.sun.position.copy(focus).addScaledVector(this.sunDir, 120); this.sun.target.position.copy(focus);
    const sc = this.sun.shadow.camera; sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 10; sc.far = 260; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (Rr / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...K.bounce); TONE.uSat.value = K.sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad; CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    const su = this.skyMat.uniforms;
    K.sky.c.forEach((h, i) => untone(h, su["c" + i].value));
    const e = K.sky.e.map((d) => THREE.MathUtils.degToRad(d));
    su.e.value.set(e[1], e[2], e[3], e[4]);
    this.sky.position.copy(cam.position);
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar;
    scene.fog = this.fog; scene.background = null;
    this.ai = 0; this.fi = 0; this.used = []; this.fused = [];
    return focus;
  }
  /** canvas angle the sun comes FROM on an upright card (45-degree steps) */
  light2D(cam: THREE.PerspectiveCamera, mirror = false) {
    const right = tmp.setFromMatrixColumn(cam.matrixWorld, 0);
    const sx = this.sunDir.dot(right) * (mirror ? -1 : 1), sy = -this.sunDir.y;
    return Math.round(Math.atan2(sy, sx) / (Math.PI / 4)) * (Math.PI / 4);
  }
  /** card tier by distance: [w, h, k] */
  tier(d: number): [number, number, number] { const k = d < 3.2 ? 2.4 : d < 6.5 ? 1.5 : d < 16 ? 0.8 : 0.4; return [Math.round(900 * k), Math.round(1000 * k), k]; }
  card(cam: THREE.PerspectiveCamera, p: CardPlace) {
    const a = this.actor(this.ai++), sc = p.scale ?? 1;
    a.r = this.pool.req(p.key, p.w, p.h, p.k, p.draw);
    a.mesh.visible = true; a.mesh.position.set(p.x, p.y, p.z);
    a.mesh.rotation.set(0, p.yaw ?? Math.atan2(cam.position.x - p.x, cam.position.z - p.z), p.roll ?? 0);
    a.mesh.scale.set(p.mirror ? -sc : sc, sc, sc);
    a.mesh.castShadow = false;
    this.used.push(a);
  }
  fxCard(cam: THREE.PerspectiveCamera, p: FxPlace) {
    const e = this.fx(this.fi++);
    e.r = this.pool.req(p.key, p.cw, p.ch, 1, p.draw);
    e.use(!!p.soft); e.mesh.visible = true; e.mesh.position.set(p.x, p.y, p.z);
    if (p.flat) e.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0);
    else { e.mesh.quaternion.copy(cam.quaternion); e.mesh.rotateZ(p.rot ?? 0); }
    e.mesh.scale.set(p.w, p.h, 1); this.fused.push(e);
  }
  finish() {
    for (let i = this.ai; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    for (let i = this.fi; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (const a of this.used) a.bind();
    for (const e of this.fused) e.bind();
  }
}
