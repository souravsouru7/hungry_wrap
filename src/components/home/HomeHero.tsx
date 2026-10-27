import Link from "next/link";
import { ArrowRight, Clock, Leaf, MapPin } from "lucide-react";

import { BagIcon } from "@/components/SiteHeader";
import { MENU_GROUPS } from "@/lib/menu";
import { ORDER_HREF, SITE } from "@/lib/site";

import HeroHeadline, { IntroFade } from "./motion/HeroHeadline";
import HeroStage from "./motion/HeroStage";

const chip =
  "inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-[.8rem] font-medium text-[#5b514a] ring-1 ring-[#f1dcc6] transition-transform duration-300 hover:-translate-y-0.5";

/**
 * Landing hero: copy and order buttons on the left, the animated product
 * stage on the right. Mobile-first and clipped on the x axis so nothing can
 * push the page wider than the screen.
 */
export default function HomeHero() {
  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative isolate overflow-x-clip bg-[radial-gradient(ellipse_at_85%_35%,#ffe1bf_0%,transparent_55%),linear-gradient(180deg,#fff4e6_0%,#fff9f2_100%)]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-10 pb-20 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pt-12 lg:pb-28">
        <div className="text-center lg:text-left">
          <IntroFade>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#f59a54]/70 bg-white/60 px-4 py-1 font-[family-name:var(--font-poppins)] text-[.85rem] font-semibold text-[#f47514]">
              <span aria-hidden className="h-1.5 w-1.5 animate-ping rounded-full bg-current motion-reduce:animate-none" />
              Kathi Rolls · Momos · Chai
            </p>
          </IntroFade>

          <HeroHeadline
            id="home-heading"
            lines={[{ text: "Rolled hot." }, { text: "Loaded right.", className: "text-[#f47514]" }]}
            className="mt-5 font-[family-name:var(--font-baloo)] text-[clamp(2.6rem,6.4vw,5.2rem)] leading-[.98] font-extrabold tracking-[-.045em] text-[#211b18]"
          />

          <IntroFade delay={0.45}>
            <p className="mx-auto mt-5 max-w-[34rem] font-[family-name:var(--font-poppins)] text-[clamp(.98rem,1.4vw,1.12rem)] leading-relaxed text-[#5b514a] lg:mx-0">
              Fresh kathi rolls, steamy momos and ₹11 chai, made to order at {SITE.name} in Nagpur. Pick it up or get it
              delivered.
            </p>
          </IntroFade>

          <IntroFade delay={0.6}>
            <div className="mt-8 flex flex-col items-stretch gap-3 font-[family-name:var(--font-poppins)] sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <a
                href={ORDER_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="hw-shine relative inline-flex min-h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 text-base font-semibold text-white shadow-[0_16px_28px_-14px_rgba(224,106,16,0.85)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47514] motion-reduce:transition-none"
                style={{ background: "linear-gradient(180deg, #fa9231 0%, #f0790f 100%)" }}
              >
                Order on Swiggy
                <BagIcon className="h-5 w-5" />
              </a>
              <a
                href={SITE.links.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-[#e23744] ring-2 ring-[#f6d3d6] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e23744] motion-reduce:transition-none"
              >
                Order on Zomato
              </a>
              <Link
                href="/menu"
                className="group inline-flex min-h-14 items-center justify-center gap-2 px-4 text-base font-semibold text-[#211b18] hover:text-[#f47514] focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f47514]"
              >
                View menu
                <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </IntroFade>

          <IntroFade delay={0.75}>
            <ul className="mt-8 flex flex-wrap justify-center gap-2.5 font-[family-name:var(--font-poppins)] lg:justify-start">
              <li>
                <a href={SITE.links.maps} target="_blank" rel="noopener noreferrer" className={`${chip} hover:text-[#f47514]`}>
                  <MapPin aria-hidden className="h-4 w-4 text-[#f47514]" />
                  Near Vasudev Nagar Metro
                </a>
              </li>
              <li className={chip}>
                <Clock aria-hidden className="h-4 w-4 text-[#f47514]" />
                Open every day
              </li>
              <li className={chip}>
                <Leaf aria-hidden className="h-4 w-4 text-[#3f9a3a]" />
                Veg &amp; non-veg
              </li>
            </ul>
          </IntroFade>
        </div>

        <HeroStage rollsFrom={MENU_GROUPS[0].from} />
      </div>
    </section>
  );
}
