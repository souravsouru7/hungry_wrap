// Resizes the landing-page art to ~2x its largest display size and re-encodes
// it as WebP in public/home/. Originals are left untouched.
// Run: node scripts/prep-home-assets.mjs
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT = "public/home";

const JOBS = [
  ["assets/hero/02_main_wrap.png", "wrap", 900],
  ["assets/hero/04_tomato_cluster.png", "tomato-cluster", 360],
  ["assets/hero/05_onion_cluster.png", "onion-cluster", 360],
  ["assets/hero/06_herb_cluster.png", "herb-cluster", 360],
  ["images/menu/01_chicken_classic.png", "menu-chicken", 640],
  ["images/menu/02_spicy_chicken.png", "menu-spicy-chicken", 640],
  ["images/menu/03_paneer_delight.png", "menu-paneer", 640],
  ["images/menu/04_veggie_supreme.png", "menu-veg", 640],
  ["assets/hungry-wrap/tortilla.png", "tortilla", 440],
  ["assets/hungry-wrap/grilled_chicken.png", "chicken", 360],
  ["assets/hungry-wrap/lettuce.png", "lettuce", 360],
  ["assets/hungry-wrap/tomato.png", "tomato", 360],
  ["assets/hungry-wrap/finished_wrap.png", "finished-wrap", 560],
  ["our-story/01_restaurant_organic_cutout.png", "restaurant", 1100],
];

await mkdir(OUT, { recursive: true });

for (const [src, name, width] of JOBS) {
  const info = await sharp(`public/${src}`)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);
  console.log(`${name}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}
