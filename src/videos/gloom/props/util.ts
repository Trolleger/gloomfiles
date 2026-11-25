import * as THREE from "three";
export const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const grp = (...c: THREE.Object3D[]) => { const g = new THREE.Group(); c.forEach((o) => g.add(o)); return g; };
export const at = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); return o; };
export const spin = <T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0) => { o.rotation.set(x, y, z); return o; };
export type Handles = Record<string, THREE.Object3D | THREE.Material | number | ((...a: any[]) => void)>;
/** a library prop: a group (origin = base centre on the ground, +z toward the camera) plus named handles for animation */
export type Prop = THREE.Group & { h: Handles };
export const prop = (g: THREE.Group, h: Handles = {}) => Object.assign(g, { h }) as Prop;
