export type OurStoryAsset = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
};

const asset = (file: string, width: number, height: number, alt = ""): OurStoryAsset => ({
  src: `/our-story/${file}`,
  width,
  height,
  alt,
});

/** Alpha-cropped, delivery-sized derivatives of the supplied PNG layers. */
export const OUR_STORY_ASSETS = {
  restaurant: asset(
    "01_restaurant_organic_cutout.png",
    1920,
    910,
    "A warmly lit restaurant interior concept with The Hungry Wrap sign",
  ),
  leafTop: asset("02_leaf_top.png", 444, 880),
  leafRight: asset("03_leaf_right.png", 674, 880),
  leafLower: asset("04_leaf_lower.png", 867, 880),
  leafCluster: asset("05_leaf_cluster.png", 1120, 946),
  foregroundBlur: asset("06_foreground_blurred_leaves.png", 1114, 1120),
  brushUnderline: asset("07_orange_brush_underline.png", 900, 45),
} as const;
