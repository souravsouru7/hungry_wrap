export type OrderCtaAsset = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
};

const asset = (file: string, width: number, height: number, alt = ""): OrderCtaAsset => ({
  src: `/order-cta/${file}`,
  width,
  height,
  alt,
});

/**
 * Alpha-cropped versions of the supplied transparent source PNGs. Their
 * dimensions are kept here so Next Image reserves each layer's final space.
 */
export const ORDER_CTA_ASSETS = {
  wrap: asset(
    "01_main_wrap.png",
    1600,
    1597,
    "A freshly prepared chicken wrap topped with vegetables and orange sauce",
  ),
  sauceRing: asset("02_sauce_ring.png", 1600, 1589),
  sauceSplash: asset("03_sauce_splash.png", 1597, 1600),
  garnish: asset("04_garnish_scatter.png", 1600, 1591),
  panel: asset("05_background_panel.png", 1593, 1600),
  slogan: asset("06_slogan_graphic.png", 1339, 1600, "Good Food Moves You"),
} as const;
