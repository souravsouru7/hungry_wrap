/**
 * Transparent cutouts from `The_Hungry_Wrap_Hero_Exact_Copy_Kit`, downscaled
 * from the kit's 3840px exports back to their true source resolution and
 * cropped to their alpha bounds by `scripts/prep-hero-assets.py`.
 *
 * Intrinsic sizes are recorded here so <Image> can reserve the right box
 * without a static import (the files live in `public/`).
 */
export type HeroAsset = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
};

const asset = (file: string, width: number, height: number, alt: string): HeroAsset => ({
  src: `/assets/hero/${file}`,
  width,
  height,
  alt,
});

export const HERO_ASSETS = {
  /** Top-left brand lockup in the navbar. */
  logo: asset("01_logo_lockup.png", 1883, 538, "The Hungry Wrap"),
  /** The product itself — the anchor of the right-hand composition. */
  wrap: asset("02_main_wrap.png", 1069, 1149, "A chicken wrap in branded paper, overflowing with filling"),
  /** Glossy sauce ribbon that loops around the product. */
  sauce: asset("03_sauce_spiral.png", 1038, 1202, ""),
  /** Decorative floaters — reused at several scales and rotations. */
  tomato: asset("04_tomato_cluster.png", 970, 1090, ""),
  onion: asset("05_onion_cluster.png", 1075, 1100, ""),
  herbs: asset("06_herb_cluster.png", 1127, 1108, ""),
  /** Terrazzo disc the wrap stands on. */
  pedestal: asset("07_pedestal.png", 1162, 373, ""),
  /** Glossy orange disc, used both as the backdrop halo and the counter ring. */
  blob: asset("08_orange_blob.png", 1243, 1053, ""),
} as const;
