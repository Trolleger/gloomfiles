// GLOOM FILES PROP LIBRARY: build once, reuse in every episode. Every builder returns a Prop (THREE.Group, origin = base centre on
// the ground, +z toward the camera) with named handles in `.h` for animation. All materials are two-tone world materials (lam),
// emissive things use glow() (HDR > 1 blooms). See /shorts/remotion/PROPS.md for the catalog.
export * from "./util";
export * from "./sky";
export * from "./terrain";
export * from "./buildings";
export * from "./furniture";
export * from "./devices";
export * from "./paper";
export * from "./charts";
export * from "./figures";
