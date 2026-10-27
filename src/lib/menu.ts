/**
 * The Hungry Wrap menu, transcribed from the printed menu card
 * ("Kathi Rolls • Momo"). Prices are in rupees. Items with several sizes list
 * one price per entry in their category's `sizes`.
 */

export type Diet = "veg" | "nonveg";
export type MenuItem = { name: string; prices: number[]; diet: Diet };
export type MenuTone = "orange" | "green" | "red" | "blue" | "purple" | "yellow";
export type MenuCategory = {
  id: string;
  title: string;
  kicker: string;
  /** Brush-stroke colour for the heading, echoing the printed card. */
  tone: MenuTone;
  /** Column labels when items come in several sizes. */
  sizes?: string[];
  items: MenuItem[];
};

const veg = (name: string, ...prices: number[]): MenuItem => ({ name, prices, diet: "veg" });
const nonveg = (name: string, ...prices: number[]): MenuItem => ({ name, prices, diet: "nonveg" });

export const MENU: MenuCategory[] = [
  {
    id: "veg-rolls",
    title: "Veg Rolls",
    kicker: "Kathi rolls",
    tone: "orange",
    items: [
      veg("Aloo Roll", 49),
      veg("Mix Veg Roll", 79),
      veg("Veg Paneer Roll", 119),
      veg("Aloo Tandoori Roll", 89),
      veg("Paneer Roll", 99),
      veg("Mint Paneer Roll", 129),
      veg("Tandoori Paneer Roll", 149),
      veg("Butter Paneer Roll", 169),
      veg("Masala Chaap Roll", 99),
      veg("Malai Chaap Roll", 119),
      veg("Schezwan Chaap Roll", 139),
      veg("Cheese Corn Roll", 119),
      veg("Mushroom Roll", 99),
      veg("Chilly Paneer Roll", 211),
      veg("THW Special Veg Roll", 229),
    ],
  },
  {
    id: "chicken-rolls",
    title: "Chicken Rolls",
    kicker: "Kathi rolls",
    tone: "orange",
    items: [
      nonveg("Chicken Roll", 129),
      nonveg("Mint Chicken Roll", 139),
      nonveg("Tandoori Chicken Roll", 159),
      nonveg("Single Egg Chicken Roll", 169),
      nonveg("Double Egg Chicken Roll", 179),
      nonveg("Double Egg Loaded Chicken Roll", 211),
      nonveg("Butter Chicken Roll", 199),
      nonveg("Chilly Chicken Roll", 211),
      nonveg("THW Special Non-Veg Roll", 249),
    ],
  },
  {
    id: "egg-rolls",
    title: "Egg Rolls",
    kicker: "Kathi rolls",
    tone: "orange",
    items: [
      nonveg("Single Egg Roll", 69),
      nonveg("Double Egg Roll", 79),
      nonveg("Triple Egg Roll", 89),
      nonveg("Single Egg Paneer Roll", 119),
      nonveg("Double Egg Paneer Roll", 129),
      nonveg("Single Egg Mushroom Roll", 129),
      nonveg("Double Egg Mushroom Roll", 139),
    ],
  },
  {
    id: "roll-loadings",
    title: "Roll Loadings",
    kicker: "Load it up",
    tone: "orange",
    items: [
      veg("Cheese Loading", 19),
      nonveg("Single Egg Loading", 29),
      nonveg("Double Egg Loading", 39),
      nonveg("Triple Egg Loading", 49),
      veg("Mayonnaise Loading", 19),
      veg("Tandoori Sauce Loading", 19),
    ],
  },
  {
    id: "steamy-momos",
    title: "Steamy Momos",
    kicker: "Momo",
    tone: "green",
    sizes: ["Full (10 pcs)", "Half (6 pcs)"],
    items: [veg("Veg Steam", 79, 59), veg("Paneer Steam", 99, 69), nonveg("Chicken Steam", 99, 69)],
  },
  {
    id: "fried-momos",
    title: "Fried Momos",
    kicker: "Momo",
    tone: "red",
    sizes: ["Full (10 pcs)", "Half (6 pcs)"],
    items: [veg("Veg Fried", 89, 69), veg("Paneer Fried", 111, 79), nonveg("Chicken Fried", 111, 89)],
  },
  {
    id: "kurkura-momos",
    title: "Crispy Kurkura Momos",
    kicker: "Momo",
    tone: "red",
    sizes: ["10 pcs", "8 pcs", "5 pcs"],
    items: [veg("Veg", 139, 111, 79), veg("Paneer", 169, 139, 99), nonveg("Chicken", 169, 139, 99)],
  },
  {
    id: "momo-dips",
    title: "Momo Dips",
    kicker: "On the side",
    tone: "yellow",
    items: [veg("Mayonnaise", 9), veg("Schezwan Chutney", 9)],
  },
  {
    id: "beverages",
    title: "Beverages",
    kicker: "Sip something",
    tone: "blue",
    items: [
      veg("THW Special Chai", 11),
      veg("Classic Hot Coffee", 29),
      veg("Classic Cold Coffee", 69),
      veg("Black Tea", 19),
      veg("Black Coffee", 19),
    ],
  },
  {
    id: "breads-maggie",
    title: "Breads & Maggie",
    kicker: "Quick bites",
    tone: "purple",
    items: [veg("Bun Maska", 29), veg("Masala Maggie", 39)],
  },
];

/** Where the 3D scene changes: each momo section gets its own moment, then the drinks. */
export const MENU_PHASE_STARTS = ["steamy-momos", "fried-momos", "kurkura-momos", "momo-dips", "beverages"];

/** Signature-roll art shown at the head of each roll category. */
export const ROLL_ART: Record<string, { src: string; alt: string }> = {
  "veg-rolls": { src: "/home/menu-paneer.webp", alt: "A paneer kathi roll" },
  "chicken-rolls": { src: "/home/menu-spicy-chicken.webp", alt: "A spicy chicken kathi roll" },
  "egg-rolls": { src: "/home/menu-chicken.webp", alt: "A loaded kathi roll" },
};

export type FeaturedItem = MenuItem & {
  categoryId: string;
  blurb: string;
  image: string;
};

const FEATURED_PICKS = [
  { name: "Chicken Roll", categoryId: "chicken-rolls", image: "/home/menu-chicken.webp", blurb: "Juicy chicken, crunchy veggies and our house sauce." },
  { name: "Chilly Chicken Roll", categoryId: "chicken-rolls", image: "/home/menu-spicy-chicken.webp", blurb: "Indo-Chinese heat, rolled tight. For the spice lovers." },
  { name: "Paneer Roll", categoryId: "veg-rolls", image: "/home/menu-paneer.webp", blurb: "Soft paneer tossed in spices with onion and mint." },
  { name: "Mix Veg Roll", categoryId: "veg-rolls", image: "/home/menu-veg.webp", blurb: "A colourful crunch of fresh veggies. Light and filling." },
];

/**
 * Bestsellers shown on the landing page. Only the photo and blurb live here;
 * name, price and diet are read from MENU so the two can never disagree.
 */
export const FEATURED: FeaturedItem[] = FEATURED_PICKS.map((pick) => {
  const item = MENU.find((c) => c.id === pick.categoryId)?.items.find((i) => i.name === pick.name);
  if (!item) throw new Error(`Featured item "${pick.name}" is not on the menu`);
  return { ...item, ...pick };
});

export type MenuGroup = { title: string; href: string; count: number; from: number; categoryIds: string[] };

const GROUPS = [
  { title: "Kathi Rolls", ids: ["veg-rolls", "chicken-rolls", "egg-rolls"] },
  { title: "Momos", ids: ["steamy-momos", "fried-momos", "kurkura-momos"] },
  { title: "Chai & Coffee", ids: ["beverages"] },
  { title: "Bun Maska & Maggie", ids: ["breads-maggie"] },
];

/** Category tiles on the landing page, each deep-linking into /menu. */
export const MENU_GROUPS: MenuGroup[] = GROUPS.map(({ title, ids }) => {
  const items = MENU.filter((c) => ids.includes(c.id)).flatMap((c) => c.items);
  return {
    title,
    href: `/menu#${ids[0]}`,
    count: items.length,
    from: Math.min(...items.flatMap((i) => i.prices)),
    categoryIds: ids,
  };
});

/** The one item that gets steam wisps. */
export const SIGNATURE_CHAI = "THW Special Chai";
