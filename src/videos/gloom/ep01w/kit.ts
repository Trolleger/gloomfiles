// Kenney CC0 kits (Nature 2.1, Furniture 2.0, Graveyard) loaded as GLBs; every material becomes the series two-tone world material.
import * as THREE from "three";
import { useEffect, useState } from "react";
import { delayRender, continueRender, staticFile } from "remotion";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { twoTone } from "../shade";

export const KIT_LIST: Record<string, string[]> = {
  furniture: ["desk", "deskCorner", "computerScreen", "computerKeyboard", "chairDesk", "chairCushion", "bedSingle", "bedDouble", "bookcaseClosed", "bookcaseOpen", "bookcaseClosedWide", "rugRectangle", "rugRound", "rugSquare", "lampRoundTable", "lampSquareFloor", "lampRoundFloor", "pottedPlant", "plantSmall1", "plantSmall2", "televisionVintage", "televisionModern", "laptop", "radio", "sideTable", "sideTableDrawers", "books", "toilet", "bathroomSink", "bathtub", "shower", "cardboardBoxClosed", "cardboardBoxOpen", "loungeSofa", "loungeChair", "tableCoffee", "chair", "coatRack", "trashcan", "speaker", "cabinetTelevision", "pillow", "table", "tableRound", "bathroomCabinet", "bathroomMirror", "washer"],
  nature: ["tree_pineDefaultA", "tree_pineTallB", "tree_pineSmallA", "tree_pineRoundA", "tree_tall_dark", "tree_thin_fall", "tree_default", "tree_oak", "rock_largeD", "rock_smallE", "rock_largeB", "stone_largeB", "stone_tallE", "fence_planks", "fence_simpleCenter", "fence_simpleDiagonal", "sign", "log", "stump_oldTall", "mushroom_tan", "flower_yellowB", "flower_redA", "plant_bushTriangle", "plant_bushLarge", "grass_leafs", "grass_large", "platform_grass", "cliff_rock", "cliff_large_rock", "tent_detailedOpen", "campfire_logs", "lily_large", "canoe", "cart", "stall-red", "banner-red"],
  graveyard: ["candle", "candle-multiple", "altar-stone", "character-ghost", "gravestone-cross", "gravestone-round", "gravestone-broken", "gravestone-wide", "crypt-small", "pine-fall", "pine-fall-crooked", "lantern-candle", "coffin", "fence", "iron-fence", "pumpkin", "lightpost-single", "road", "character-skeleton", "rocks", "trunk", "fire-basket", "bench", "cross", "urn-round"],
};
const store = new Map<string, THREE.Object3D>();
const mats = new Map<string, THREE.Material>();
let loading: Promise<void> | null = null, done = false;
const conv = (m: THREE.Material) => {
  let l = mats.get(m.uuid);
  if (!l) { const s = m as THREE.MeshStandardMaterial; l = twoTone(new THREE.MeshLambertMaterial({ color: s.color?.clone() ?? new THREE.Color("#ffffff"), map: s.map ?? null, side: s.side, alphaTest: s.alphaTest, transparent: s.transparent, opacity: s.opacity })); mats.set(m.uuid, l); }
  return l;
};
export const loadKit = () => {
  if (!loading) {
    const loader = new GLTFLoader();
    const jobs: Promise<void>[] = [];
    for (const [pack, names] of Object.entries(KIT_LIST)) for (const n of names) jobs.push(loader.loadAsync(staticFile(`kenney/${pack}/${n}.glb`)).then((g) => { g.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.material = Array.isArray(m.material) ? m.material.map(conv) : conv(m.material); m.castShadow = m.receiveShadow = true; } }); store.set(`${pack}/${n}`, g.scene); }).catch(() => { /* a missing model just leaves a gap */ }));
    loading = Promise.all(jobs).then(() => { done = true; });
  }
  return loading;
};
export const useKit = () => {
  const [ready, setReady] = useState(done);
  useEffect(() => { if (done) { setReady(true); return; } const h = delayRender("kenney kit", { timeoutInMilliseconds: 120000 }); loadKit().then(() => { setReady(true); continueRender(h); }); }, []);
  return ready;
};
/** a clone of a kit model, scaled so it is `h` metres tall (or `s` x native), origin at the base centre; null if the model is missing */
export const kit = (pack: "nature" | "furniture" | "graveyard", name: string, h?: number, s = 1): THREE.Group => {
  const g = new THREE.Group(), src = store.get(`${pack}/${name}`);
  if (!src) return g;
  const o = src.clone(true), b = new THREE.Box3().setFromObject(o), size = b.getSize(new THREE.Vector3());
  const k = h ? h / Math.max(size.y, 0.001) : s;
  o.scale.setScalar(k); o.position.set(-(b.min.x + size.x / 2) * k, -b.min.y * k, -(b.min.z + size.z / 2) * k);
  g.add(o); return g;
};
export const at = (g: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { g.position.set(x, y, z); g.rotation.y = ry; return g; };
