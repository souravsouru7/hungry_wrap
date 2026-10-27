"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import { ORDER_HREF } from "@/lib/site";

import { HERO_ASSETS } from "./assets";
import CustomerBadge from "./CustomerBadge";
import FeatureStrip from "./FeatureStrip";
import HeroBackdrop from "./HeroBackdrop";
import HeroLayer from "./HeroLayer";
import HeroNav, { BagIcon } from "./HeroNav";

/** useLayoutEffect warns during SSR; this keeps client timing without the noise. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The Hungry Wrap hero, rebuilt from the reference screenshot as positioned
 * transparent PNG layers over a CSS-only interior. No part of the reference
 * is used as a background image and every piece of copy is real text.
 *
 * Layer order on the right-hand stage (z-index in brackets):
 *   blob halo [5] -> counter ring [6] -> back ingredients [12] -> pedestal [20]
 *   -> wrap [30] -> sauce ribbon [36] -> front ingredients [40]
 */
export default function HungryWrapHero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
          desktopPointer: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { reduced, desktopPointer } = context.conditions as Record<string, boolean>;

          if (reduced) {
            return;
          }

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(q('[data-hero-entrance="nav"]'), { y: -20, autoAlpha: 0, duration: 0.55 })
            .from(
              q('[data-hero-entrance="copy"]'),
              { y: 28, autoAlpha: 0, duration: 0.72, stagger: 0.075 },
              "-=0.28",
            )
            .from(
              q('[data-hero-entrance="halo"]'),
              { scale: 0.75, autoAlpha: 0, duration: 0.95, ease: "power2.out" },
              0.42,
            )
            .from(
              q('[data-hero-entrance="pedestal"]'),
              { y: 36, scale: 0.9, autoAlpha: 0, duration: 0.8 },
              0.54,
            )
            .from(
              q('[data-hero-entrance="wrap"]'),
              { y: 92, scale: 0.76, rotation: -9, autoAlpha: 0, duration: 1.1, ease: "back.out(1.25)" },
              0.64,
            )
            .from(
              q('[data-hero-entrance="sauce"]'),
              { scale: 0.78, rotation: -16, autoAlpha: 0, duration: 0.85 },
              1.03,
            )
            .from(
              q('[data-hero-entrance="float"]'),
              {
                x: (index, target) => (50 - Number.parseFloat((target as HTMLElement).style.left)) * 1.5,
                y: (index, target) => (50 - Number.parseFloat((target as HTMLElement).style.top)) * 1.5,
                scale: 0.55,
                autoAlpha: 0,
                duration: 0.75,
                stagger: 0.06,
              },
              1.12,
            )
            .from(
              q('[data-hero-entrance="strip"], [data-hero-entrance="badge"], [data-hero-entrance="slogan"]'),
              { y: 20, autoAlpha: 0, duration: 0.65, stagger: 0.1 },
              1.38,
            )
            .fromTo(
              q("[data-hero-swash] path"),
              { strokeDasharray: 360, strokeDashoffset: 360 },
              { strokeDashoffset: 0, duration: 0.65, ease: "power2.inOut", stagger: 0.1 },
              0.84,
            );

          if (!desktopPointer) return;

          const stage = q("[data-hero-stage]")[0] as HTMLElement | undefined;
          if (!stage) return;

          const moveX = gsap.quickTo(stage, "x", { duration: 0.65, ease: "power3.out" });
          const moveY = gsap.quickTo(stage, "y", { duration: 0.65, ease: "power3.out" });
          const onPointerMove = (event: PointerEvent) => {
            const bounds = el.getBoundingClientRect();
            moveX(((event.clientX - bounds.left) / bounds.width - 0.5) * 20);
            moveY(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
          };
          const onPointerLeave = () => {
            moveX(0);
            moveY(0);
          };

          el.addEventListener("pointermove", onPointerMove);
          el.addEventListener("pointerleave", onPointerLeave);
          return () => {
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerleave", onPointerLeave);
          };
        },
      );
      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="home"
      className="hw-hero relative w-full overflow-hidden bg-[#f6e6d2] lg:min-h-[100svh]"
    >
      <div className="relative flex min-h-[inherit] w-full flex-col overflow-hidden">
        <HeroBackdrop />

        <div data-hero-entrance="nav" className="shrink-0">
          <HeroNav />
        </div>

        {/* -------- stage: copy column + product composition -------- */}
        <div className="relative z-10 grid flex-1 grid-cols-1 gap-8 px-5 pt-8 pb-10 sm:px-8 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-0 lg:py-4 lg:pr-10 lg:pl-[7%]">
          {/* ------------------------------ copy column ------------------------------ */}
          <div className="flex flex-col items-center text-center lg:items-start lg:justify-center lg:pr-6 lg:text-left">
            <span data-hero-entrance="copy" className="relative inline-flex items-center">
              <span className="inline-flex items-center rounded-full border-2 border-[var(--hw-orange)]/70 bg-white/55 px-6 py-1.5 font-[family-name:var(--hw-font-display)] text-base text-[var(--hw-orange)] sm:text-lg">
                Welcome to
              </span>
              {/* The hand-drawn arrow curling off the pill. */}
              <svg
                viewBox="0 0 40 34"
                aria-hidden
                className="absolute top-1 -right-9 hidden w-8 text-[var(--hw-orange)] lg:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 5c9-2 16 2 19 9" />
                <path d="M16 15l7-1-1 7" />
                <path d="M6 20c8 4 15 3 20-2" />
              </svg>
            </span>

            <h1 className="mt-2 font-[family-name:var(--hw-font-display)] leading-none tracking-[-0.005em]">
              <span
                data-hero-entrance="copy"
                className="hw-title-dark block text-[clamp(2.1rem,7.5vw,4.4rem)] leading-[1.5] lg:leading-[1.12]"
              >
                The Hungry
              </span>
              <span
                data-hero-entrance="copy"
                className="hw-title-orange relative block text-[clamp(3rem,11vw,6.6rem)] leading-[1.3] lg:leading-[1]"
              >
                {/* Marker flecks either side of the word, as in the reference. */}
                <svg
                  viewBox="0 0 54 70"
                  aria-hidden
                  className="absolute top-[18%] -left-[11%] hidden w-[9%] text-[#f79231] lg:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                >
                  <path d="M46 8 33 16" />
                  <ellipse cx="22" cy="36" rx="13" ry="7" transform="rotate(-22 22 36)" />
                  <path d="M40 52 28 58" />
                </svg>
                <svg
                  viewBox="0 0 54 70"
                  aria-hidden
                  className="absolute top-[14%] -right-[10%] hidden w-[9%] text-[#f79231] lg:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                >
                  <path d="M8 10 21 18" />
                  <ellipse cx="32" cy="38" rx="12" ry="7" transform="rotate(22 32 38)" />
                  <path d="M12 54 24 60" />
                </svg>
                Wrap
                {/* Hand-drawn swash under the word, as in the reference. */}
                <svg
                  data-hero-swash
                  viewBox="0 0 320 34"
                  aria-hidden
                  className="absolute -bottom-[0.02em] left-[2%] h-[0.2em] w-[84%] overflow-visible"
                  preserveAspectRatio="none"
                >
                  <path d="M6 16C72 5 182 2 308 9" stroke="#f79231" strokeWidth="11" strokeLinecap="round" fill="none" />
                  <path d="M18 29C90 20 196 18 286 23" stroke="#f79231" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75" />
                  <path d="M296 24c10-5 18-3 22 2" stroke="#f6c54a" strokeWidth="6" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p
              data-hero-entrance="copy"
              className="mt-4 font-[family-name:var(--hw-font-ui)] text-lg font-bold lg:mt-5 text-[#2c211a] sm:text-xl lg:text-[1.4rem]"
            >
              Deliciously wrapped.{" "}
              <span className="relative inline-block">
                Perfectly yours.
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[var(--hw-orange)]/85" />
              </span>
            </p>

            <p
              data-hero-entrance="copy"
              className="mt-3 max-w-[27rem] font-[family-name:var(--hw-font-ui)] text-[0.98rem] leading-7 text-[#6b5747]"
            >
              Fresh ingredients, bold flavors, and wraps made to satisfy your cravings!
            </p>

            <div
              data-hero-entrance="copy"
              className="mt-6 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row"
            >
              <a
                href={ORDER_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 font-[family-name:var(--hw-font-ui)] text-base font-semibold text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_36px_-14px_rgba(224,106,16,0.8)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hw-orange)] motion-reduce:transition-none"
                style={{ background: "linear-gradient(180deg, #fa9231 0%, #ef780e 100%)" }}
              >
                Order Now
                <BagIcon className="h-5 w-5" />
              </a>
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 font-[family-name:var(--hw-font-ui)] text-base font-semibold text-[var(--hw-orange)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_36px_-18px_rgba(120,72,20,0.6)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hw-orange)] motion-reduce:transition-none"
                style={{ boxShadow: "0 14px 30px -20px rgba(120,72,20,0.55)" }}
              >
                View Menu
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="3" width="14" height="18" rx="2.5" />
                  <path d="M9 8h6M9 12h6M9 16h3" />
                </svg>
              </a>
            </div>

            <div className="mt-10 flex w-full justify-center lg:mt-8 lg:justify-start">
              <FeatureStrip />
            </div>
          </div>

          {/* --------------------------- product composition --------------------------- */}
          <div
            data-hero-stage
            className="relative -mx-5 aspect-square w-[calc(100%+2.5rem)] sm:mx-auto sm:w-full sm:max-w-[560px] lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:aspect-auto lg:h-full lg:w-[58%] lg:max-w-none"
          >
            {/* Soft halo behind everything. */}
            <HeroLayer
              asset={HERO_ASSETS.blob}
              left={48}
              top={46}
              width={80}
              rotate={-8}
              z={5}
              opacity={0.22}
              blur={26}
              bob={false}
              entrance="halo"
              sizes="(max-width: 1024px) 90vw, 50vw"
            />
            {/* The same disc again, sharp and flat, as the counter ring. */}
            <HeroLayer
              asset={HERO_ASSETS.blob}
              left={50}
              top={88}
              width={86}
              rotate={2}
              z={6}
              opacity={0.9}
              bob={false}
              entrance="halo"
              sizes="(max-width: 1024px) 80vw, 42vw"
            />

            {/* Ingredients behind the product. */}
            <HeroLayer
              asset={HERO_ASSETS.herbs}
              left={28}
              top={34}
              width={19}
              rotate={-14}
              z={12}
              bobY={13}
              duration={7.5}
              delay={0.3}
              sizes="(max-width: 1024px) 19vw, 11vw"
            />
            <HeroLayer
              asset={HERO_ASSETS.tomato}
              left={79}
              top={30}
              width={14}
              rotate={18}
              z={12}
              bobY={11}
              bobRotate={3}
              duration={6.8}
              delay={0.9}
              desktopOnly
              sizes="(max-width: 1024px) 14vw, 8vw"
            />
            <HeroLayer
              asset={HERO_ASSETS.onion}
              left={26}
              top={58}
              width={13}
              rotate={-22}
              z={12}
              bobY={9}
              bobRotate={4}
              duration={8.2}
              delay={1.4}
              desktopOnly
              sizes="(max-width: 1024px) 13vw, 7vw"
            />

            {/* Pedestal, then the product standing on it. */}
            <HeroLayer
              asset={HERO_ASSETS.pedestal}
              left={64}
              top={80}
              width={47}
              z={20}
              bob={false}
              entrance="pedestal"
              shadow="0 24px 26px rgba(130, 78, 24, 0.3)"
              sizes="(max-width: 1024px) 62vw, 32vw"
            />
            <HeroLayer
              asset={HERO_ASSETS.wrap}
              left={50}
              top={49}
              width={51}
              rotate={-6}
              z={30}
              bobY={9}
              bobRotate={0.9}
              duration={7}
              entrance="wrap"
              shadow="0 34px 40px rgba(120, 70, 20, 0.32)"
              sizes="(max-width: 1024px) 62vw, 34vw"
            />

            {/* Sauce ribbon looping across the product. */}
            <HeroLayer
              asset={HERO_ASSETS.sauce}
              left={56}
              top={56}
              width={52}
              rotate={-6}
              z={36}
              opacity={0.92}
              drift
              duration={16}
              entrance="sauce"
              sizes="(max-width: 1024px) 50vw, 27vw"
            />

            {/* Ingredients in front, flying outward. */}
            <HeroLayer
              asset={HERO_ASSETS.tomato}
              left={36}
              top={15}
              width={17}
              rotate={-24}
              z={40}
              bobY={14}
              bobRotate={5}
              duration={6.2}
              delay={0.15}
              sizes="(max-width: 1024px) 17vw, 10vw"
            />
            <HeroLayer
              asset={HERO_ASSETS.herbs}
              left={76}
              top={62}
              width={16}
              rotate={26}
              flip
              z={40}
              bobY={12}
              bobRotate={3}
              duration={7.8}
              delay={0.75}
              desktopOnly
              sizes="(max-width: 1024px) 16vw, 9vw"
            />
            <HeroLayer
              asset={HERO_ASSETS.onion}
              left={62}
              top={20}
              width={10}
              rotate={34}
              z={40}
              bobY={10}
              bobRotate={6}
              duration={5.6}
              delay={1.1}
              desktopOnly
              sizes="(max-width: 1024px) 10vw, 6vw"
            />
            <HeroLayer
              asset={HERO_ASSETS.tomato}
              left={24}
              top={76}
              width={11}
              rotate={44}
              z={40}
              bobY={9}
              bobRotate={4}
              duration={8.6}
              delay={0.5}
              desktopOnly
              sizes="(max-width: 1024px) 11vw, 7vw"
            />
            <HeroLayer
              asset={HERO_ASSETS.herbs}
              left={55}
              top={88}
              width={12}
              rotate={8}
              z={41}
              bobY={7}
              duration={6.4}
              delay={1.6}
              desktopOnly
              sizes="(max-width: 1024px) 12vw, 7vw"
            />

            {/* Handwritten wall slogan. */}
            <div
              data-hero-entrance="slogan"
              className="absolute top-[5%] right-[10%] z-45 hidden w-[24%] -rotate-[4deg] text-left font-[family-name:var(--hw-font-script)] text-[clamp(1.3rem,2.5vw,2.3rem)] leading-[1.1] text-[#231a15] md:block"
            >
              <p>
                Same
                <br />
                Wrap
                <br />
                More
                <br />
                <span className="relative inline-block">
                  Happiness
                  <svg
                    viewBox="0 0 200 14"
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-[0.3em] w-full text-[var(--hw-orange)]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 10C60 3 140 3 197 8"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </p>
              {/* The little smiley doodle under the slogan. */}
              <svg viewBox="0 0 48 32" aria-hidden className="mt-3 ml-6 w-[3.2em] text-[#231a15]">
                <path d="M8 12c6 14 26 14 32 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M15 5l2 6M33 5l-2 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Social proof, overlapping the window frame. */}
            <div className="pointer-events-none absolute right-[0%] bottom-[26%] z-46 hidden w-[60%] max-w-[268px] sm:block">
              <CustomerBadge />
            </div>
          </div>
        </div>

        {/* Mobile-only social proof, under the composition. */}
        <div className="relative z-10 flex justify-center px-5 pb-8 sm:hidden">
          <CustomerBadge />
        </div>
      </div>
    </section>
  );
}
