/**
 * Layers for the Fresh Ingredients section, written by
 * `scripts/prep-fresh-ingredients-assets.py`. Sizes mirror
 * `public/fresh-ingredients/_sizes.json`.
 *
 * Four of the kit's nine files could not be used as shipped:
 * `04_signature_sauce` and `07_cucumber_onion` are effectively empty (0.6%
 * and 0.1% opaque), and `05`/`06` are torn blobs with the scene backdrop
 * baked inside their alpha. The script peels `05` apart into its individual
 * subjects and borrows already-keyed cutouts from `public/assets/hungry-wrap/`
 * for the rest. The signature-sauce bowl has no source at all and is drawn as
 * SVG in the component.
 */
export type FreshIngredientAsset = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
};

const asset = (file: string, width: number, height: number, alt = ""): FreshIngredientAsset => ({
  src: `/fresh-ingredients/${file}`,
  width,
  height,
  alt,
});

export const FRESH_INGREDIENT_ASSETS = {
  /* ---- feature cards ---- */
  tomatoes: asset("01_tomatoes.png", 520, 385, "Fresh red tomatoes"),
  // The kit's own 02/03 are ~2000px of enlarged low-resolution art; these
  // 390px cutouts measure far sharper at the size the cards actually render.
  lettuce: asset("17_lettuce_sharp.png", 393, 378, "Crisp green lettuce"),
  chicken: asset("18_chicken_sharp.png", 395, 372, "Grilled chicken pieces"),

  /* ---- right-hand collage ---- */
  /** The kit lettuce: softer, but its spread frill suits the big green
      masses flanking the collage better than the compact card cutout. */
  lettuceSpread: asset("02_lettuce.png", 620, 469),
  orangeDisc: asset("09_orange_disc.png", 1100, 1100),
  leaf: asset("08_top_left_leaf.png", 620, 571),
  lettuceFrill: asset("10_lettuce_frill.png", 460, 426),
  tomatoWedge: asset("11_tomato_wedge.png", 460, 354),
  cucumber: asset("12_cucumber_slice.png", 317, 420),
  onionRings: asset("13_onion_rings.png", 401, 390),
  tomatoSlices: asset("14_tomato_slices.png", 389, 392),
  herbLeaves: asset("15_herb_leaves.png", 361, 388),
  spiceFlecks: asset("16_spice_flecks.png", 360, 338),
} as const;
