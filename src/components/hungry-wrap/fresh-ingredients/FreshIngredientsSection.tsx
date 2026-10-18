"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { FRESH_INGREDIENT_ASSETS, type FreshIngredientAsset } from "./assets";
import SectionWave from "@/components/hungry-wrap/SectionWave";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type FreshIngredientsSectionProps = {
  className?: string;
};

/* ------------------------------------------------------------- collage --- */

type Placement = {
  /** Centre point and width, as a percentage of the collage box. */
  left: number;
  top: number;
  width: number;
  rotate?: number;
};

type ArtLayerProps = {
  asset: FreshIngredientAsset;
  at: Placement;
  z: number;
  opacity?: number;
  flip?: boolean;
  blur?: number;
  parallax?: number;
  float?: { y: number; rotate: number; duration: number; delay?: number };
  sizes?: string;
  /** Dropped below `lg`, where the collage has far less room. */
  desktopOnly?: boolean;
};

/**
 * One positioned cutout in the exploded collage.
 *
 * The outer node is placed and tweened by GSAP, the middle one runs the CSS
 * drift loop and the image carries the static tilt, so the entrance, the
 * parallax and the loop never contend for one `transform`.
 */
function ArtLayer({
  asset,
  at,
  z,
  opacity,
  flip = false,
  blur,
  parallax,
  float,
  sizes = "(max-width: 1023px) 22vw, 11vw",
  desktopOnly = false,
}: ArtLayerProps) {
  const floatStyle = float
    ? ({
        "--hw-fresh-float-y": `${float.y}px`,
        "--hw-fresh-float-r": `${float.rotate}deg`,
        "--hw-fresh-float-d": `${float.duration}s`,
        "--hw-fresh-float-delay": `${float.delay ?? 0}s`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      data-fresh-art
      data-fresh-parallax={parallax}
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${
        desktopOnly ? "hidden lg:block" : ""
      }`}
      style={{
        left: `${at.left}%`,
        top: `${at.top}%`,
        width: `${at.width}%`,
        zIndex: z,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      <div className={float ? "hw-fresh-float" : ""} style={floatStyle}>
        <Image
          src={asset.src}
          alt=""
          aria-hidden="true"
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          quality={90}
          draggable={false}
          loading="lazy"
          className="h-auto w-full select-none"
          style={{ transform: `rotate(${at.rotate ?? 0}deg)${flip ? " scaleX(-1)" : ""}` }}
        />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- sauce bowl --- */

/**
 * The signature-sauce card art.
 *
 * `04_signature_sauce.png` in the supplied kit is blank — 0.6% of its canvas
 * is opaque and none of it is the bowl — and nothing else in the project is a
 * bowl of sauce, so the reference's swirled mound is drawn here instead. Being
 * vector, it also stays crisp next to the three photographic cards.
 */
function SauceBowl({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" className={className} role="img" aria-label="A bowl of signature sauce">
      <defs>
        <linearGradient id="hw-sauce-swirl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7d2a4" />
          <stop offset="45%" stopColor="#f0b878" />
          <stop offset="100%" stopColor="#e09a4c" />
        </linearGradient>
        <linearGradient id="hw-sauce-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d6ab" />
          <stop offset="100%" stopColor="#d9a05d" />
        </linearGradient>
        <radialGradient id="hw-sauce-sheen" cx="0.35" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff6e6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* bowl */}
      <path d="M26 112h148c0 31-33 52-74 52s-74-21-74-52Z" fill="url(#hw-sauce-bowl)" />
      <ellipse cx="100" cy="112" rx="74" ry="17" fill="#f9e3c3" />

      {/* swirled mound, widest tier first */}
      <ellipse cx="100" cy="108" rx="58" ry="20" fill="url(#hw-sauce-swirl)" />
      <ellipse cx="100" cy="90" rx="46" ry="17" fill="url(#hw-sauce-swirl)" />
      <ellipse cx="100" cy="73" rx="34" ry="14" fill="url(#hw-sauce-swirl)" />
      <ellipse cx="100" cy="59" rx="22" ry="10" fill="url(#hw-sauce-swirl)" />
      <path d="M100 30c7 0 12 6 12 13 0 6-5 10-12 10s-12-4-12-10c0-7 5-13 12-13Z" fill="url(#hw-sauce-swirl)" />

      <ellipse cx="82" cy="86" rx="30" ry="22" fill="url(#hw-sauce-sheen)" />
    </svg>
  );
}

/* Chilli flakes scattered around the collage, as percentages of the collage
   box. Hand-placed to echo the reference's scatter rather than randomised,
   so the composition is stable between renders. */
const FLECKS = [
  { left: 20, top: 30, size: 9, rotate: -24, tone: "#d8321f" },
  { left: 16, top: 38, size: 6, rotate: 38, tone: "#e4512a" },
  { left: 24, top: 45, size: 5, rotate: 12, tone: "#c92c1b" },
  { left: 13, top: 52, size: 7, rotate: -52, tone: "#e4512a" },
  { left: 30, top: 19, size: 6, rotate: 66, tone: "#d8321f" },
  { left: 36, top: 60, size: 5, rotate: -16, tone: "#e4512a" },
  { left: 88, top: 20, size: 8, rotate: 28, tone: "#d8321f" },
  { left: 93, top: 27, size: 6, rotate: -44, tone: "#c92c1b" },
  { left: 85, top: 33, size: 5, rotate: 74, tone: "#e4512a" },
  { left: 95, top: 38, size: 7, rotate: -8, tone: "#d8321f" },
  { left: 90, top: 62, size: 6, rotate: 52, tone: "#e4512a" },
  { left: 78, top: 76, size: 5, rotate: -34, tone: "#c92c1b" },
  { left: 44, top: 88, size: 6, rotate: 20, tone: "#d8321f" },
  { left: 62, top: 24, size: 5, rotate: -62, tone: "#e4512a" },
] as const;

/* -------------------------------------------------------------- cards --- */

const FEATURES = [
  { title: "Tomatoes", subtitle: "Juicy & Fresh", asset: FRESH_INGREDIENT_ASSETS.tomatoes },
  { title: "Lettuce", subtitle: "Crisp & Healthy", asset: FRESH_INGREDIENT_ASSETS.lettuce },
  { title: "Grilled Chicken", subtitle: "Premium Quality", asset: FRESH_INGREDIENT_ASSETS.chicken },
  { title: "Signature Sauce", subtitle: "Our Special Blend", asset: null },
] as const;

/* ------------------------------------------------------------ section --- */

/**
 * "It All Starts With Real Ingredients", rebuilt from `REFERENCE_4K_WIDTH.png`
 * as individually placed transparent cutouts over a CSS backdrop. Every
 * heading, card and label is real text; the reference is never used as an
 * image.
 *
 * Collage order (z-index in brackets):
 *   orange disc [1] -> spice flecks [4] -> back greens [8] -> chicken [20]
 *   -> tomatoes and rings [26] -> front greens [32]
 */
export default function FreshIngredientsSection({ className = "" }: FreshIngredientsSectionProps) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const context = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const media = gsap.matchMedia();

      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
        },
        (match) => {
          const { reduce, desktop } = match.conditions as Record<string, boolean>;
          // Reduced motion: nothing is hidden in CSS, so the finished
          // composition is simply what renders.
          if (reduce) return;

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: section, start: "top 78%", once: true },
          });

          timeline
            .from(q("[data-fresh-copy]"), { y: 25, autoAlpha: 0, duration: 0.68, stagger: 0.08 })
            .from(
              q("[data-fresh-art]"),
              { autoAlpha: 0, scale: 0.8, duration: 0.76, stagger: 0.05, transformOrigin: "50% 50%" },
              0.22,
            )
            .from(
              q("[data-fresh-card]"),
              { y: 28, autoAlpha: 0, scale: 0.96, duration: 0.6, stagger: 0.07 },
              0.42,
            );

          // Depth parallax on the collage. Desktop only — on a phone too
          // little of the section is on screen at once for it to read as
          // anything but jitter.
          if (!desktop) return;

          const layers = q("[data-fresh-parallax]") as HTMLElement[];
          const parallax = gsap.to(layers, {
            y: (_index, layer) => Number((layer as HTMLElement).dataset.freshParallax ?? 0),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });

          return () => {
            parallax.scrollTrigger?.kill();
            parallax.kill();
          };
        },
      );

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={root}
      id="fresh-ingredients"
      aria-labelledby="fresh-ingredients-heading"
      className={`hw-fresh relative isolate overflow-hidden bg-[#fffaf2] ${className}`}
    >
      {/* Organic wave parting this section from the one above. */}
      <SectionWave fill="#fffaf2" />

      {/* Cream paper texture plus a sparse orange speckle, both CSS. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,119,33,.17) .75px, transparent .85px), radial-gradient(rgba(225,170,103,.12) .65px, transparent .75px)",
          backgroundPosition: "0 0, 13px 11px",
          backgroundSize: "31px 31px, 37px 37px",
          maskImage: "linear-gradient(105deg, black 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(70% 60% at 72% 42%, rgba(244,119,33,.07) 0%, rgba(244,119,33,0) 62%)",
        }}
      />

      {/* Basil leaves down the left edge, as in the reference. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] hidden lg:block">
        <ArtLayer
          asset={FRESH_INGREDIENT_ASSETS.leaf}
          at={{ left: 1.5, top: 17, width: 6.4, rotate: -24 }}
          z={3}
          parallax={30}
          float={{ y: 10, rotate: 3, duration: 8.4 }}
          sizes="(max-width: 1023px) 0px, 7vw"
        />
        <ArtLayer
          asset={FRESH_INGREDIENT_ASSETS.leaf}
          at={{ left: 5.5, top: 53, width: 4.6, rotate: 140 }}
          z={3}
          opacity={0.9}
          parallax={-24}
          float={{ y: 9, rotate: -3, duration: 9.6, delay: 1.1 }}
          sizes="(max-width: 1023px) 0px, 5vw"
        />
      </div>

      {/* The reference's faint hand-written mark in the lower right. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute right-[1.5%] bottom-[1%] z-[3] hidden text-right font-[family-name:var(--font-marker)] text-[clamp(1.5rem,2.9vw,3.4rem)] leading-[1.05] text-[#c8a079]/25 lg:block"
      >
        Real
        <br />
        Food
        <br />
        Real
        <br />
        Happiness
      </p>

      <div className="relative mx-auto flex w-full max-w-[2048px] flex-col px-5 pt-[clamp(4.5rem,10vw,7rem)] pb-12 sm:px-8 lg:block lg:min-h-[620px] lg:px-0 lg:pt-0 lg:pb-0 lg:[aspect-ratio:2048/923]">
        {/* ---------------------------------- copy ---------------------------------- */}
        <div className="relative z-20 order-1 max-w-[43rem] lg:absolute lg:top-[13%] lg:left-[9.5%] lg:w-[43%]">
          <p
            data-fresh-copy
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#f58a3a]/75 bg-white/40 px-5 py-1.5 font-[family-name:var(--font-baloo)] text-[clamp(.9rem,1.2vw,1.18rem)] leading-none font-bold text-[#ee741a]"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
            Freshness First
          </p>

          <h2
            id="fresh-ingredients-heading"
            className="mt-4 font-[family-name:var(--font-baloo)] text-[clamp(2.3rem,4.15vw,4.9rem)] leading-[1.08] font-extrabold tracking-[-.02em]"
          >
            <span data-fresh-copy className="block text-[#201b18]">
              It All Starts
            </span>
            <span data-fresh-copy className="block text-[#201b18]">
              With{" "}
              <span className="hw-fresh-orange relative inline-block">
                Real Ingredients
                {/* The thin scribble, tied to the words it underlines. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 16"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[0.04em] left-0 block h-[0.14em] w-full overflow-visible text-[#f47721]"
                >
                  <path
                    d="M4 10C70 3 176 2 316 7"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </span>
          </h2>

          <p
            data-fresh-copy
            className="mt-6 max-w-[34rem] font-[family-name:var(--font-poppins)] text-[clamp(.95rem,1.24vw,1.18rem)] leading-[1.6] font-medium text-[#514943]"
          >
            Crisp vegetables, premium meats, signature sauces, and soft tortillas — every ingredient is
            chosen to give you the perfect bite.
          </p>
        </div>

        {/* ------------------------ exploded ingredient stage ------------------------ */}
        <div
          aria-label="Fresh ingredients floating around a piece of grilled chicken"
          className="relative z-10 order-2 mx-auto mt-6 aspect-[5/4] w-full max-w-[34rem] lg:absolute lg:top-[1%] lg:left-[50%] lg:mt-0 lg:aspect-auto lg:h-[88%] lg:w-[49%] lg:max-w-none"
        >
          {/* Warm disc the collage sits on. */}
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.orangeDisc}
            at={{ left: 50, top: 45, width: 52 }}
            z={1}
            opacity={0.95}
            parallax={-18}
            sizes="(max-width: 1023px) 58vw, 29vw"
          />

          {/* Chilli flakes. Drawn rather than placed: the only seasoning
              cutout in the project is brown pepper crumb, which reads as a
              dust cloud at this size, where the reference has small red
              flecks. */}
          <div aria-hidden="true" className="absolute inset-0 z-[4] hidden lg:block">
            {FLECKS.map(({ left, top, size, rotate, tone }, i) => (
              <span
                key={i}
                data-fresh-art
                data-fresh-parallax={i % 2 ? 22 : -26}
                className="absolute block rounded-[40%_60%_55%_45%]"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size * 0.62}px`,
                  transform: `rotate(${rotate}deg)`,
                  background: tone,
                }}
              />
            ))}
          </div>

          {/* Greens behind the chicken. */}
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.lettuceSpread}
            at={{ left: 68, top: 15, width: 29, rotate: -12 }}
            z={8}
            parallax={-34}
            float={{ y: 11, rotate: 3, duration: 8.6, delay: 0.4 }}
            sizes="(max-width: 1023px) 32vw, 16vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.lettuceSpread}
            at={{ left: 80, top: 45, width: 25, rotate: 150 }}
            z={8}
            parallax={22}
            float={{ y: 9, rotate: -3, duration: 9.4, delay: 1.3 }}
            sizes="(max-width: 1023px) 28vw, 14vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.herbLeaves}
            at={{ left: 57, top: 88, width: 14, rotate: 18 }}
            z={8}
            opacity={0.9}
            parallax={-18}
            float={{ y: 8, rotate: 4, duration: 9.9, delay: 1.9 }}
            desktopOnly
            sizes="(max-width: 1023px) 0px, 8vw"
          />

          {/* The centrepiece. */}
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.chicken}
            at={{ left: 50, top: 34, width: 34, rotate: -4 }}
            z={20}
            parallax={10}
            float={{ y: 8, rotate: 1.5, duration: 7.2 }}
            sizes="(max-width: 1023px) 36vw, 18vw"
          />

          {/* Tomato wedges, scattered. One cutout, reused at four scales. */}
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.tomatoWedge}
            at={{ left: 27, top: 31, width: 14, rotate: -28 }}
            z={26}
            parallax={-26}
            float={{ y: 12, rotate: 4, duration: 8.1, delay: 0.2 }}
            sizes="(max-width: 1023px) 16vw, 8vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.tomatoWedge}
            at={{ left: 64, top: 44, width: 17, rotate: 18 }}
            z={26}
            flip
            parallax={18}
            float={{ y: 10, rotate: -3, duration: 7.8, delay: 0.9 }}
            sizes="(max-width: 1023px) 19vw, 9vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.tomatoWedge}
            at={{ left: 50, top: 70, width: 15, rotate: -52 }}
            z={26}
            parallax={-20}
            float={{ y: 11, rotate: 3, duration: 9.1, delay: 1.5 }}
            sizes="(max-width: 1023px) 17vw, 8vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.tomatoWedge}
            at={{ left: 67, top: 78, width: 14, rotate: 128 }}
            z={26}
            parallax={28}
            float={{ y: 9, rotate: -4, duration: 8.8, delay: 0.6 }}
            desktopOnly
            sizes="(max-width: 1023px) 0px, 8vw"
          />

          {/* Sliced garnish. */}
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.tomatoSlices}
            at={{ left: 44, top: 14, width: 13, rotate: 14 }}
            z={26}
            parallax={-28}
            float={{ y: 10, rotate: 3, duration: 8.3, delay: 1.1 }}
            sizes="(max-width: 1023px) 14vw, 7vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.onionRings}
            at={{ left: 32, top: 24, width: 13, rotate: -16 }}
            z={26}
            opacity={0.95}
            parallax={20}
            float={{ y: 8, rotate: 4, duration: 9.8, delay: 0.3 }}
            desktopOnly
            sizes="(max-width: 1023px) 0px, 7vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.onionRings}
            at={{ left: 68, top: 70, width: 14, rotate: 24 }}
            z={26}
            opacity={0.95}
            parallax={-22}
            flip
            float={{ y: 9, rotate: -4, duration: 8.9, delay: 1.7 }}
            desktopOnly
            sizes="(max-width: 1023px) 0px, 7vw"
          />
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.cucumber}
            at={{ left: 7, top: 61, width: 9, rotate: -18 }}
            z={26}
            parallax={24}
            float={{ y: 8, rotate: 3, duration: 7.9, delay: 0.8 }}
            desktopOnly
            sizes="(max-width: 1023px) 0px, 5vw"
          />

          {/* Lettuce frill in front, lower left of the disc. */}
          <ArtLayer
            asset={FRESH_INGREDIENT_ASSETS.lettuceFrill}
            at={{ left: 27, top: 57, width: 19, rotate: 6 }}
            z={32}
            parallax={16}
            float={{ y: 10, rotate: -3, duration: 8.7, delay: 0.5 }}
            sizes="(max-width: 1023px) 21vw, 10vw"
          />
        </div>

        {/* -------------------------------- feature cards ------------------------------- */}
        <ul className="relative z-30 order-3 mt-8 grid grid-cols-2 gap-3 sm:mx-auto sm:w-full sm:max-w-[44rem] sm:gap-4 lg:absolute lg:bottom-[3.5%] lg:left-[9.5%] lg:mt-0 lg:w-[59%] lg:max-w-none lg:grid-cols-4 lg:gap-[1.6%]">
          {FEATURES.map(({ title, subtitle, asset }) => (
            <li key={title} data-fresh-card>
              <article className="hw-fresh-card group flex h-full min-h-[12.5rem] flex-col items-center rounded-[1.55rem] bg-white/90 px-3 pt-3 pb-4 text-center shadow-[0_12px_26px_-17px_rgba(83,48,19,.42)] ring-1 ring-[#f5e8dc] transition duration-300 focus-within:-translate-y-1.5 hover:-translate-y-1.5 hover:shadow-[0_19px_30px_-17px_rgba(83,48,19,.52)] sm:min-h-[14rem] lg:min-h-0 lg:rounded-[2rem] lg:px-4 lg:pt-4">
                <div className="flex h-[7.1rem] w-full items-center justify-center sm:h-[8.6rem] lg:h-[clamp(6rem,8.5vw,9.5rem)]">
                  {asset ? (
                    <Image
                      src={asset.src}
                      alt={asset.alt}
                      width={asset.width}
                      height={asset.height}
                      sizes="(max-width: 639px) 39vw, (max-width: 1023px) 21rem, 14vw"
                      quality={90}
                      draggable={false}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <SauceBowl className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]" />
                  )}
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-poppins)] text-[clamp(.88rem,1.18vw,1.22rem)] leading-tight font-bold tracking-[-.035em] text-[#221d1a]">
                  {title}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-poppins)] text-[clamp(.7rem,.9vw,.92rem)] leading-tight font-medium text-[#87776b]">
                  {subtitle}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
