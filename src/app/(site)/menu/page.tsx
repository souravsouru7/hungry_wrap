import type { Metadata } from "next";

import CtaButton from "@/components/CtaButton";
import FinalCtaFooter from "@/components/FinalCtaFooter";
import PageHero from "@/components/PageHero";
import MenuBoard from "@/components/menu/MenuBoard";
import { MENU } from "@/lib/menu";
import { NAV_LINKS, ORDER_HREF, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Our Menu | Signature Wraps, Sides & Beverages | Hungry Wrap" },
  description:
    "Explore the Hungry Wrap menu: veg, paneer, chicken and egg kathi rolls, steamed, fried and kurkura momos, and our THW Special Chai. Fresh, affordable, made to order.",
};

// schema.org Menu, generated from the same data the page renders.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Menu",
  name: `${SITE.name} Menu`,
  inLanguage: "en-IN",
  hasMenuSection: MENU.map((c) => ({
    "@type": "MenuSection",
    name: c.title,
    hasMenuItem: c.items.map((i) => ({
      "@type": "MenuItem",
      // "Veg" alone is ambiguous outside its section, so single-word names take the section title.
      name: i.name.includes(" ") ? i.name : `${i.name} ${c.title}`,
      suitableForDiet: i.diet === "veg" ? "https://schema.org/VegetarianDiet" : undefined,
      offers: i.prices.map((p, idx) => ({
        "@type": "Offer",
        price: p,
        priceCurrency: "INR",
        ...(c.sizes ? { name: c.sizes[idx] } : {}),
      })),
    })),
  })),
};

export default function MenuPage() {
  return (
    <main className="flex-1 bg-[#fff9f2]" style={{ "--hw-page-bg": "#fff9f2" } as React.CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        kicker="Kathi Rolls • Momo"
        title="The Hungry Wrap"
        accent="Menu"
        lead="Everything is made fresh to order, just the way you like it."
      >
        <CtaButton href={ORDER_HREF}>Order Now</CtaButton>
      </PageHero>

      <MenuBoard />

      <div className="flex flex-col items-center gap-6 px-5 pt-6 pb-24 text-center">
        <p className="rotate-[-3deg] rounded-[1.5rem] border-2 border-dashed border-[#f47514]/50 px-8 py-4 font-[family-name:var(--font-marker)] text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-[#211b18]">
          Made with love,
          <br />
          <span className="text-[#f47514]">just for you!</span>
        </p>
        <CtaButton href={ORDER_HREF}>Order Now</CtaButton>
      </div>
      <FinalCtaFooter orderHref={ORDER_HREF} navLinks={NAV_LINKS} />
    </main>
  );
}
