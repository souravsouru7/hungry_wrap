/**
 * Shared data for the scroll journey: the five scenes of the stage timeline and
 * the sprite layers that move through them.
 *
 * Positions are expressed as a percentage of the stage box, measured from its
 * centre, so every value resolves against the live stage size at refresh time
 * (see `pct()` in ScrollJourneyHero).
 */

export type SceneId = "intro" | "ingredients" | "build" | "flavor" | "order";

export interface Scene {
  id: SceneId;
  /** Short label for the progress rail. */
  label: string;
  /** Normalised scroll progress where this scene takes over. */
  at: number;
  kicker: string;
  headline: string;
  /**
   * Vertical offset of the headline block, in % of its own height, away from
   * the stage centre. Each scene sits the type somewhere different so the wrap
   * crosses it rather than permanently covering it.
   */
  textY: number;
  /** Override for narrow screens, where the stage is tall and the wrap sits lower. */
  textYNarrow?: number;
}

export const SCENES: readonly Scene[] = [
  { id: "intro", label: "Welcome", at: 0.0, kicker: "The Hungry Wrap", headline: "Good food. Good mood.", textY: -128 },
  { id: "ingredients", label: "Ingredients", at: 0.17, kicker: "Picked this morning", headline: "Freshness in every bite.", textY: -50 },
  { id: "build", label: "The build", at: 0.38, kicker: "Rolled to order", headline: "Layer upon layer.", textY: 42, textYNarrow: 118 },
  { id: "flavor", label: "Flavour", at: 0.62, kicker: "Our signature sauce", headline: "Wrapped with flavour.", textY: -138 },
  { id: "order", label: "Order", at: 0.82, kicker: "Ready when you are", headline: "Your next craving starts here.", textY: -134 },
] as const;

/** Scene index for a normalised timeline progress value. */
export function sceneIndexAt(progress: number): number {
  let index = 0;
  for (let i = 0; i < SCENES.length; i += 1) {
    if (progress >= SCENES[i].at) index = i;
  }
  return index;
}

export interface Placement {
  /** % of stage width from centre. */
  x: number;
  /** % of stage height from centre. */
  y: number;
  rotation: number;
  scale: number;
}

export interface SpriteConfig {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** `core` sprites render everywhere; `extra` ones are dropped on small screens. */
  tier: "core" | "extra";
  /** Rendered width, as a clamped viewport value. */
  size: string;
  /** Parallax weight — higher sits nearer the camera and travels further. */
  depth: number;
  /** z-index inside the stage; the wrap stack sits at 20. */
  layer: number;
  /** Where the layer flies out to during INGREDIENTS. */
  scatter: Placement;
  /** Where it funnels back to during BUILD. */
  gather: Placement;
}

const ASSET = "/assets/hungry-wrap";

export const SPRITES: readonly SpriteConfig[] = [
  {
    key: "lettuce",
    src: `${ASSET}/lettuce.png`,
    width: 413,
    height: 398,
    alt: "Frilly green lettuce leaf",
    tier: "core",
    size: "clamp(7rem, 15vw, 15rem)",
    depth: 0.9,
    layer: 24,
    scatter: { x: -30, y: -17, rotation: -14, scale: 1 },
    gather: { x: -7, y: -5, rotation: 6, scale: 0.55 },
  },
  {
    key: "tomato",
    src: `${ASSET}/tomato.png`,
    width: 409,
    height: 412,
    alt: "Sliced vine tomato",
    tier: "core",
    size: "clamp(6rem, 13vw, 13rem)",
    depth: 1.1,
    layer: 26,
    scatter: { x: 27, y: -23, rotation: 18, scale: 1 },
    gather: { x: 6, y: -8, rotation: -8, scale: 0.5 },
  },
  {
    key: "onion",
    src: `${ASSET}/onion.png`,
    width: 421,
    height: 410,
    alt: "Red onion rings",
    tier: "core",
    size: "clamp(6rem, 13vw, 13rem)",
    depth: 0.8,
    layer: 18,
    scatter: { x: -34, y: 17, rotation: 12, scale: 1 },
    gather: { x: -9, y: 6, rotation: -4, scale: 0.5 },
  },
  {
    key: "grilled_chicken",
    src: `${ASSET}/grilled_chicken.png`,
    width: 415,
    height: 392,
    alt: "Pieces of grilled chicken",
    tier: "core",
    size: "clamp(7rem, 14vw, 14rem)",
    depth: 1.2,
    layer: 28,
    scatter: { x: 19, y: 21, rotation: -10, scale: 1 },
    gather: { x: 4, y: 7, rotation: 4, scale: 0.55 },
  },
  {
    key: "sauce",
    src: `${ASSET}/sauce.png`,
    width: 387,
    height: 434,
    alt: "Swirl of signature orange sauce",
    tier: "core",
    size: "clamp(8rem, 18vw, 18rem)",
    depth: 1.35,
    layer: 30,
    scatter: { x: 9, y: -33, rotation: -6, scale: 1 },
    gather: { x: 2, y: -3, rotation: 10, scale: 0.6 },
  },
  {
    key: "herbs",
    src: `${ASSET}/herbs.png`,
    width: 381,
    height: 408,
    alt: "Fresh herb leaves",
    tier: "extra",
    size: "clamp(5rem, 11vw, 11rem)",
    depth: 0.6,
    layer: 16,
    scatter: { x: -15, y: -31, rotation: -22, scale: 1 },
    gather: { x: -3, y: -10, rotation: 8, scale: 0.5 },
  },
  {
    key: "spices",
    src: `${ASSET}/spices.png`,
    width: 380,
    height: 358,
    alt: "Scattered ground spices",
    tier: "extra",
    size: "clamp(6rem, 14vw, 14rem)",
    depth: 1.4,
    layer: 32,
    scatter: { x: 35, y: 7, rotation: 8, scale: 1 },
    gather: { x: 9, y: 2, rotation: -12, scale: 0.6 },
  },
  {
    key: "floating_leaves",
    src: `${ASSET}/floating_leaves.png`,
    width: 232,
    height: 267,
    alt: "Drifting salad leaves",
    tier: "extra",
    size: "clamp(6rem, 13vw, 13rem)",
    depth: 0.5,
    layer: 14,
    scatter: { x: -26, y: 30, rotation: 16, scale: 1 },
    gather: { x: -6, y: 9, rotation: -6, scale: 0.5 },
  },
] as const;

/** The three centre-stage images that carry the wrap through the story. */
export const WRAP_STACK = {
  tortilla: { src: `${ASSET}/tortilla.png`, width: 436, height: 439, alt: "Round flour tortilla" },
  finished: { src: `${ASSET}/finished_wrap.png`, width: 601, height: 473, alt: "Chicken salad wrap, cut to show the filling" },
  packaged: { src: `${ASSET}/packaged_wrap.png`, width: 515, height: 432, alt: "Wrap folded in takeaway paper" },
} as const;
