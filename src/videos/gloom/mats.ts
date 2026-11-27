import * as THREE from "three";
import { twoTone } from "./shade";

const cache = new Map<string, THREE.Material>();
/** two-tone world material from a colour (our painted-flat look; ink lines come from the post pass) */
let grainT: THREE.Texture | null = null;
/** shared painted-grain map (white base, darker dabs + light fibres): breaks up flat vector planes like the skill's painted textures */
const grain = () => {
  if (grainT) return grainT;
  const cv = document.createElement("canvas"); cv.width = cv.height = 256; const g = cv.getContext("2d")!;
  g.fillStyle = "#f4f4f4"; g.fillRect(0, 0, 256, 256);
  let sd = 7; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 1400; i++) { const v = 205 + Math.floor(r() * 40); g.fillStyle = `rgb(${v},${v - 4},${v - 8})`; g.fillRect(r() * 256, r() * 256, 2 + r() * 9, 1 + r() * 4); }
  for (let i = 0; i < 500; i++) { g.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.7)" : "rgba(150,140,150,0.25)"; g.lineWidth = 1; const x = r() * 256, y = r() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 26, y + (r() - 0.5) * 10); g.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); t.anisotropy = 8; grainT = t; return t;
};
export const lam = (color: string, opts: THREE.MeshLambertMaterialParameters = {}) => {
  const key = color + JSON.stringify(opts);
  let m = cache.get(key) as THREE.MeshLambertMaterial | undefined;
  if (!m) { m = twoTone(new THREE.MeshLambertMaterial({ color, map: grain(), ...opts })); cache.set(key, m); }
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
