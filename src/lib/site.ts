/**
 * Every site-wide constant lives here so the real cafe details are filled in
 * exactly once. The `TODO:` strings below are the only values still outstanding —
 * replacing them is all that stands between the CTAs and a working phone number.
 */
export const SITE = {
  name: "The Hungry Wrap",
  url: "https://thehungrywrap.in", // TODO: confirm the real domain (metadataBase + sitemap)
  tagline: "Fresh Food. Hot Tea. Happy Pockets.",
  address: "TODO: full Kalpetta address / landmark",
  phone: "TODO: +91XXXXXXXXXX",
  /** Digits only, with country code and no `+` — the format wa.me expects. */
  whatsapp: "TODO: 91XXXXXXXXXX",
  email: "TODO: hello@example.com",
  hours: [
    { days: "Monday to Saturday", time: "9:00 AM – 10:00 PM" },
    { days: "Sunday", time: "10:00 AM – 11:00 PM" },
  ],
} as const;

export type NavLink = { label: string; href: string };

/** Shared by the header and the footer so the two lists cannot drift apart. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Menu", href: "/menu" },
  { label: "Tea Club", href: "/subscription" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

/** Prefilled WhatsApp deep link. Every order and subscribe CTA goes through this. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const ORDER_HREF = whatsappUrl(
  "Hi! I'd like to place an order from The Hungry Wrap.",
);

export const TEL_HREF = `tel:${SITE.phone}`;
export const MAIL_HREF = `mailto:${SITE.email}`;
