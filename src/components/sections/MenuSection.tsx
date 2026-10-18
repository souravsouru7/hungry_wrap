"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWave from "@/components/hungry-wrap/SectionWave";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type MenuItem = {
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly active?: boolean;
};

type MenuSectionProps = {
  /** Existing navigation already uses this anchor; supply a route when one exists. */
  menuHref?: string;
  /** Optional selection hook, useful when a menu drawer or modal is later added. */
  onSelectItem?: (item: MenuItem) => void;
  className?: string;
};

const MENU_ITEMS: readonly MenuItem[] = [
  {
    title: "Chicken Classic",
    description: "Tender grilled chicken, fresh veggies, signature sauce",
    image: "/images/menu/01_chicken_classic.png",
    active: true,
  },
  {
    title: "Spicy Chicken",
    description: "For those who love extra kick",
    image: "/images/menu/02_spicy_chicken.png",
  },
  {
    title: "Paneer Delight",
    description: "A perfect vegetarian choice",
    image: "/images/menu/03_paneer_delight.png",
  },
  {
    title: "Veggie Supreme",
    description: "Loaded with fresh veggies and flavor",
    image: "/images/menu/04_veggie_supreme.png",
  },
] as const;

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MenuCard({ item, menuHref, onSelectItem }: { item: MenuItem; menuHref: string; onSelectItem?: (item: MenuItem) => void }) {
  const active = item.active === true;
  const cardClassName = `hw-menu-card group flex min-h-[23rem] flex-col rounded-[2rem] p-3 text-center shadow-[0_18px_32px_-23px_rgba(94,54,19,.48)] ring-1 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_27px_35px_-21px_rgba(94,54,19,.58)] focus-within:-translate-y-1.5 sm:min-h-[25rem] ${
    active
      ? "bg-[#ff7415] text-white ring-[#ff7415]"
      : "bg-white/90 text-[#231d19] ring-[#f1e4d7]"
  }`;
  const actionClassName = `inline-flex h-12 w-12 items-center justify-center rounded-full transition duration-300 group-hover:translate-x-1 group-focus-within:translate-x-1 focus-visible:outline-3 focus-visible:outline-offset-4 ${
    active
      ? "bg-white text-[#f47514] focus-visible:outline-white"
      : "border-2 border-[#f6a66d] text-[#f47514] focus-visible:outline-[#f47514]"
  }`;

  const action = onSelectItem ? (
    <button type="button" onClick={() => onSelectItem(item)} className={actionClassName} aria-label={`Select ${item.title}`}>
      <ArrowIcon className="h-5 w-5" />
    </button>
  ) : (
    <a href={menuHref} className={actionClassName} aria-label={`View ${item.title} on the full menu`}>
      <ArrowIcon className="h-5 w-5" />
    </a>
  );

  return (
    <li data-menu-card>
      <article className={cardClassName}>
        <div
          className={`relative flex h-[14rem] items-center justify-center overflow-hidden rounded-[1.45rem] sm:h-[15.5rem] ${
            active
              ? "bg-[radial-gradient(circle_at_50%_43%,rgba(255,255,255,.34),rgba(255,196,131,.19)_43%,rgba(210,81,7,.12)_100%)]"
              : "bg-[radial-gradient(circle_at_50%_48%,#fffdf8_0%,#fff5e7_58%,#f9e3ca_100%)]"
          }`}
        >
          <span aria-hidden="true" className={`absolute inset-x-[10%] bottom-[11%] h-7 rounded-[100%] blur-xl ${active ? "bg-[#cf570c]/30" : "bg-[#be8a5a]/20"}`} />
          <Image
            src={item.image}
            alt={item.title}
            width={1280}
            height={1280}
            sizes="(max-width: 639px) 86vw, (max-width: 1023px) 42vw, 22vw"
            quality={88}
            draggable={false}
            className="relative z-10 h-[128%] w-[128%] max-w-none object-contain transition-transform duration-500 group-hover:scale-[1.035] group-focus-within:scale-[1.035]"
          />
        </div>

        <div className="flex flex-1 flex-col items-center px-2 pt-5">
          <h3 className="font-[family-name:var(--font-baloo)] text-[clamp(1.28rem,1.75vw,1.75rem)] leading-none font-bold tracking-[-.035em]">{item.title}</h3>
          <p className={`mt-2 max-w-[15rem] font-[family-name:var(--font-poppins)] text-[.86rem] leading-[1.38] font-medium ${active ? "text-white/88" : "text-[#75685e]"}`}>
            {item.description}
          </p>
          <div className="mt-auto pt-4">{action}</div>
        </div>
      </article>
    </li>
  );
}

/**
 * The reusable Hungry Wrap menu grid. The card data is intentionally local
 * and plain so individual product images or labels can be replaced without
 * changing layout or animation code.
 */
export default function MenuSection({ menuHref = "#menu", onSelectItem, className = "" }: MenuSectionProps) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const context = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const media = gsap.matchMedia();

      media.add({ reduce: "(prefers-reduced-motion: reduce)" }, (match) => {
        if ((match.conditions as Record<string, boolean>).reduce) return;

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });

        timeline
          .from(q("[data-menu-intro]"), { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.08 })
          .from(q("[data-menu-card]"), { y: 36, autoAlpha: 0, scale: 0.96, duration: 0.7, stagger: 0.09 }, 0.25);
      });

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="menu" ref={root} aria-labelledby="menu-heading" className={`hw-menu relative isolate overflow-hidden bg-[#fff9f2] py-16 sm:py-20 lg:py-24 ${className}`}>
      <SectionWave fill="#fff9f2" variant="rise" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_0%_10%,rgba(255,196,136,.18),transparent_29%),radial-gradient(ellipse_at_100%_82%,rgba(244,117,20,.1),transparent_27%)]" />
      <span aria-hidden="true" className="pointer-events-none absolute -left-7 top-8 h-24 w-24 rounded-full bg-[#f47721]/15 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute right-[3%] top-[21%] h-3 w-3 rotate-45 rounded-[3px] bg-[#f47721]/70" />
      <span aria-hidden="true" className="pointer-events-none absolute right-[5%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#f47721]" />
      <span aria-hidden="true" className="pointer-events-none absolute left-[4%] bottom-[19%] h-2 w-6 rotate-[58deg] rounded-full bg-[#f47721]/55" />

      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <header className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-[59rem]">
            <p data-menu-intro className="inline-flex items-center gap-2 rounded-full border-2 border-[#f59a54]/75 bg-white/40 px-4 py-1 font-[family-name:var(--font-poppins)] text-[.95rem] font-semibold text-[#f47514]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
              Our Menu
            </p>
            <h2 id="menu-heading" data-menu-intro className="mt-4 font-[family-name:var(--font-baloo)] text-[clamp(2.45rem,5vw,4.9rem)] leading-[.94] font-bold tracking-[-.06em] text-[#211c18]">
              Wraps for <span className="hw-menu-accent">Every Craving</span>
            </h2>
            <p data-menu-intro className="mt-5 max-w-[48rem] font-[family-name:var(--font-poppins)] text-[clamp(.95rem,1.3vw,1.13rem)] leading-relaxed font-medium text-[#5b514a]">
              Explore our delicious range of wraps, made with fresh ingredients and bold flavors.
            </p>
          </div>

          <a data-menu-intro href={menuHref} className="group inline-flex min-h-11 shrink-0 items-center gap-3 self-end font-[family-name:var(--font-poppins)] text-[.95rem] font-bold text-[#ed731b] underline decoration-2 underline-offset-4 transition hover:text-[#d95e0b] focus-visible:rounded-sm focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#f47514]">
            View Full Menu
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f47721] text-white shadow-[0_8px_15px_-8px_rgba(201,82,4,.75)] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon className="h-5 w-5" />
            </span>
          </a>
        </header>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {MENU_ITEMS.map((item) => (
            <MenuCard key={item.title} item={item} menuHref={menuHref} onSelectItem={onSelectItem} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export type { MenuItem, MenuSectionProps };
