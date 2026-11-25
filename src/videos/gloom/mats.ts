import * as THREE from "three";
import { twoTone } from "./shade";

const cache = new Map<string, THREE.Material>();
/** two-tone world material from a colour (our painted-flat look; ink lines come from the post pass) */
export const lam = (color: string, opts: THREE.MeshLambertMaterialParameters = {}) => {
  const key = color + JSON.stringify(opts);
  let m = cache.get(key) as THREE.MeshLambertMaterial | undefined;
  if (!m) { m = twoTone(new THREE.MeshLambertMaterial({ color, ...opts })); cache.set(key, m); }
  return m;
};
export const lamTex = (tex: THREE.Texture, opts: THREE.MeshLambertMaterialParameters = {}) => twoTone(new THREE.MeshLambertMaterial({ map: tex, ...opts }));
/** self-lit HDR colour (> 1 blooms): lamps, monitors, dish lights */
export const glow = (color: string, k = 2) => { const c = new THREE.Color(color).multiplyScalar(k); return new THREE.MeshBasicMaterial({ color: c, toneMapped: true, fog: false }); };
export const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  draw(cv.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
};
export const box = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; return o;
};
export const cyl = (rt: number, rb: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0, seg = 24) => {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; return o;
};
export const plane = (w: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
  const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); o.position.set(x, y, z); o.receiveShadow = true; return o;
};
export const sphere = (r: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
  const o = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; return o;
};
