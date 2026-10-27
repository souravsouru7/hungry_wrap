/**
 * Landing-page art, resized and re-encoded to WebP by
 * `scripts/prep-home-assets.mjs`. Intrinsic sizes are recorded so <Image> can
 * reserve the right box without a static import.
 */
import type { HeroAsset } from "@/components/hungry-wrap/exact-hero/assets";

const asset = (file: string, width: number, height: number, alt = ""): HeroAsset => ({
  src: `/home/${file}`,
  width,
  height,
  alt,
});

export const HOME_ASSETS = {
  wrap: asset("wrap.webp", 900, 967, "A chicken kathi roll in Hungry Wrap paper, loaded with fresh filling"),
  tomatoCluster: asset("tomato-cluster.webp", 360, 405),
  onionCluster: asset("onion-cluster.webp", 360, 368),
  herbCluster: asset("herb-cluster.webp", 360, 354),
  tortilla: asset("tortilla.webp", 436, 439, "A warm, soft tortilla"),
  chicken: asset("chicken.webp", 360, 340, "Grilled chicken pieces"),
  lettuce: asset("lettuce.webp", 360, 347, "Crisp lettuce"),
  tomato: asset("tomato.webp", 360, 363, "Fresh tomato slices"),
  finishedWrap: asset("finished-wrap.webp", 560, 441, "A finished roll, sliced open"),
  restaurant: asset("restaurant.webp", 1100, 619, "Inside The Hungry Wrap"),
} as const;
