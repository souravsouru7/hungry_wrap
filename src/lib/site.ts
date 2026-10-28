/**
 * Every site-wide constant lives here so the real cafe details are filled in
 * exactly once. The `TODO:` strings below are the only values still outstanding.
 */
export const SITE = {
  name: "The Hungry Wrap",
  url: "https://thehungrywrap.in", // TODO: confirm the real domain (metadataBase + sitemap)
  tagline: "Fresh Food. Hot Tea. Happy Pockets.",
  address: "Vasudev Nagar Metro Station, Near, Hingna Rd, Rajendra Nagar, Nagpur, Maharashtra 440036",
  links: {
    maps: "https://maps.app.goo.gl/bJHCZkiBH6k9jYxg9",
    instagram: "https://www.instagram.com/thehungrywrap/",
    swiggy: "https://www.swiggy.com/city/nagpur/the-hungry-wrap-pratap-nagar-rest1410251",
    zomato: "https://www.zomato.com/nagpur/the-hungry-wrap-1-hingna-t-point",
  },
  /** Calls and WhatsApp share this one number. */
  phone: "+917709846604",
  phoneDisplay: "+91 77098 46604",
  /** Digits only, with country code and no `+` — the format wa.me expects. */
  whatsapp: "917709846604",
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

/** Prefilled WhatsApp deep link. The subscribe CTAs and the contact form go through this. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Every "Order Now" button opens the Swiggy listing. */
export const ORDER_HREF = SITE.links.swiggy;

export const TEL_HREF = `tel:${SITE.phone}`;
export const MAIL_HREF = `mailto:${SITE.email}`;
