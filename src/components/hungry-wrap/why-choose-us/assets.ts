/**
 * Transparent cutouts from `The_Hungry_Wrap_Why_Choose_Us_4K_Assets_Prompt`,
 * downscaled from the kit's 3840px exports and split into individual subjects
 * by `scripts/prep-why-choose-us-assets.py`.
 *
 * The kit's own README is blunt about what these are: every file was *upscaled*
 * to a 3840px long edge, so they carry no more detail than the screenshot the
 * main wrap was machine-extracted from. Intrinsic sizes below are the written
 * sizes from `public/why-choose-us/_sizes.json`, recorded here so <Image> can
 * reserve the right box without a static import.
 */
export type WhyAsset = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
};

const asset = (file: string, width: number, height: number, alt = ""): WhyAsset => ({
  src: `/why-choose-us/${file}`,
  width,
  height,
  alt,
});

export const WHY_ASSETS = {
  /** The hero of the left region — reference-extracted, edges are soft. */
  wrap: asset(
    "01_main_wrap.png",
    1746,
    1800,
    "A chicken wrap cut open, showing grilled chicken, lettuce and sauce",
  ),
  /** Glossy orange ribbon that swooshes out from behind the wrap. */
  sauce: asset("02_sauce_splash.png", 1035, 1200),
  /** Single tomato wedge for the upper right. `_a` is the uncut cluster. */
  tomato: asset("03_tomato_b.png", 433, 520),
  tomatoCluster: asset("03_tomato_a.png", 520, 514),
  /** Four parsley sprigs, drifting around the wrap. */
  herbA: asset("04_herb_a.png", 441, 520),
  herbB: asset("04_herb_b.png", 520, 364),
  herbC: asset("04_herb_c.png", 520, 467),
  herbD: asset("04_herb_d.png", 520, 514),
  /**
   * Prepared from the kit but deliberately unplaced: the reference has no
   * onion in this section and the prompt only allows it "if visually
   * appropriate". Kept so the layer is one line away if the art direction
   * changes.
   */
  onion: asset("05_onion.png", 684, 700),
} as const;
