"use client";

import { ChefHat, Heart, Leaf, Smile } from "lucide-react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties, ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { WHY_ASSETS, type WhyAsset } from "./assets";

gsap.registerPlugin(ScrollTrigger);

/** useLayoutEffect warns during SSR; this keeps client timing without the noise. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ layers --- */

type Placement = {
  /** Centre point and width, as a percentage of the positioning parent. */
  left: number;
  top: number;
  width: number;
  rotate?: number;
};

type FoodLayerProps = {
  asset: WhyAsset;
  /** Placement at >=1024px. */
  desktop: Placement;
  /** Placement below 1024px. Omitted layers inherit the desktop placement. */
  mobile?: Placement;
  z?: number;
  opacity?: number;
  flip?: boolean;
  shadow?: string;
  sizes: string;
  /** Continuous float: `bob` for the herbs, `drift` for the sauce ribbon. */
  loop?: "bob" | "drift";
  bobY?: number;
  bobRotate?: number;
  duration?: number;
  delay?: number;
  /** Pixels this layer travels over the section's scroll, via ScrollTrigger. */
  parallax?: number;
  /** Hidden below `lg` — used for layers that would crowd the mobile copy. */
  desktopOnly?: boolean;
  /** GSAP entrance hook. The main wrap gets its own, slower treatment. */
  entrance?: "wrap" | "decor";
  className?: string;
};

/**
 * One positioned PNG cutout.
 *
 * Three nested nodes on purpose, as in the hero: the outer div is placed and
 * tweened by GSAP, the middle one runs the CSS float loop, and the image
 * carries the static tilt. Keeping them apart means the entrance tween and
 * the infinite loop never fight over the same `transform`.
 *
 * Placement travels as custom properties rather than inline `left`/`top` so a
 * single media query in globals.css can swap the whole composition at `lg`.
 */
function FoodLayer({
  asset,
  desktop,
  mobile,
  z = 10,
  opacity,
  flip = false,
  shadow,
  sizes,
  loop,
  bobY = 12,
  bobRotate = 0,
  duration = 7,
  delay = 0,
  parallax,
  desktopOnly = false,
  entrance = "decor",
  className = "",
}: FoodLayerProps) {
  const m = mobile ?? desktop;
  const placement = {
    "--hw-why-ml": `${m.left}%`,
    "--hw-why-mt": `${m.top}%`,
    "--hw-why-mw": `${m.width}%`,
    "--hw-why-dl": `${desktop.left}%`,
    "--hw-why-dt": `${desktop.top}%`,
    "--hw-why-dw": `${desktop.width}%`,
    zIndex: z,
    opacity,
  } as CSSProperties;

  const loopStyle = {
    "--hw-bob-y": `${bobY}px`,
    "--hw-bob-r": `${bobRotate}deg`,
    "--hw-bob-d": `${duration}s`,
    "--hw-bob-delay": `${delay}s`,
  } as CSSProperties;

  const rotate = `rotate(${(m.rotate ?? 0)}deg)`;
  const rotateLg = `rotate(${(desktop.rotate ?? 0)}deg)`;

  return (
    <div
      data-why-entrance={entrance}
      data-why-parallax={parallax}
      className={`hw-why-layer pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${
        desktopOnly ? "hidden lg:block" : ""
      } ${className}`}
      style={placement}
    >
      <div className={loop === "drift" ? "hw-drift" : loop === "bob" ? "hw-bob" : ""} style={loopStyle}>
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          draggable={false}
          aria-hidden={asset.alt === "" || undefined}
          /* The wrap is the section's subject, so it is fetched at high
             priority — but still lazily, because the section sits well below
             the fold and `preload` would pull it into the initial <head>. */
          loading="lazy"
          fetchPriority={entrance === "wrap" ? "high" : "low"}
          className="hw-why-img h-auto w-full select-none"
          style={
            {
              "--hw-why-rot": flip ? `${rotate} scaleX(-1)` : rotate,
              "--hw-why-rot-lg": flip ? `${rotateLg} scaleX(-1)` : rotateLg,
              filter: shadow ? `drop-shadow(${shadow})` : undefined,
            } as CSSProperties
          }
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- benefits --- */

type Benefit = {
  label: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number; fill?: string }>;
  /** Glyph colour, straight from the brief's palette. */
  color: string;
  /** Lucide draws outlines; the reference's leaf is a solid shape. */
  fill?: boolean;
};

const BENEFITS: Benefit[] = [
  { label: "Fresh & Quality Ingredients", Icon: Leaf, color: "var(--hw-why-green)", fill: true },
  { label: "Unique & Bold Flavors", Icon: ChefHat, color: "var(--hw-why-orange)" },
  { label: "Made with Care", Icon: Heart, color: "var(--hw-why-red)" },
  { label: "Consistent Great Taste", Icon: Smile, color: "var(--hw-why-yellow)" },
];

/* ----------------------------------------------------------------- section --- */

/**
 * "Why Choose Us", rebuilt from `REFERENCE_UPSCALED_3840.png` as positioned
 * transparent cutouts over a CSS backdrop. No part of the reference is used
 * as a background image, every heading and label is real text, and the four
 * benefit icons are vector `lucide-react` glyphs rather than raster lettering.
 *
 * Layer order in the left stage (z-index in brackets):
 *   sauce ribbon [10] -> back herbs [14] -> wrap [20] -> front herbs [30]
 * The lone tomato lives in a separate full-section decor layer [1] so it can
 * sit out in the right-hand margin, behind the copy, exactly as it does in
 * the reference.
 */
export default function WhyChooseUs() {
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
          desktop: "(min-width: 1024px)",
        },
        (context) => {
          const { reduced, desktop } = context.conditions as Record<string, boolean>;

          // Reduced motion: no entrance, no parallax. Nothing is hidden by
          // CSS, so the finished composition is simply what renders.
          if (reduced) return;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          });

          tl.from(q('[data-why-entrance="wrap"]'), {
            x: -70,
            scale: 1.07,
            autoAlpha: 0,
            duration: 1.1,
            transformOrigin: "50% 50%",
          })
            .from(
              q("[data-why-stagger]"),
              { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
              0.18,
            )
            .fromTo(
              q("[data-why-underline]"),
              { scaleX: 0, transformOrigin: "0% 50%" },
              { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
              0.52,
            )
            .from(
              q('[data-why-entrance="decor"]'),
              { scale: 0.7, autoAlpha: 0, duration: 0.7, stagger: 0.06 },
              0.3,
            );

          // Scroll parallax for the loose ingredients. Desktop only: the
          // mobile composition has too little of the section on screen at
          // once for it to read as anything but jitter.
          if (!desktop) return;

          const floaters = q("[data-why-parallax]") as HTMLElement[];
          const parallax = gsap.to(floaters, {
            y: (_i, target) => Number((target as HTMLElement).dataset.whyParallax ?? 0),
            ease: "none",
            scrollTrigger: {
              trigger: el,
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

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="hw-why relative w-full overflow-hidden bg-[var(--hw-why-cream)] lg:min-h-[650px] lg:[aspect-ratio:2048/819]"
    >
      {/* Warm backdrop: a soft cream wash plus a faint orange bloom behind the
          product, all CSS — the reference's background is not reproducible as
          a flat colour alone. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 22% 60%, rgba(244,116,25,0.09) 0%, rgba(244,116,25,0) 58%)," +
            "radial-gradient(90% 70% at 88% 8%, rgba(244,116,25,0.05) 0%, rgba(244,116,25,0) 60%)," +
            "linear-gradient(176deg, var(--hw-why-cream) 0%, var(--hw-why-cream-deep) 100%)",
        }}
      />

      {/* Loose ingredients that belong to the whole section rather than the
          product stage — the tomato out in the right margin, as referenced.
          Hidden on phones, where it would land behind the copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] hidden lg:block">
        <FoodLayer
          asset={WHY_ASSETS.tomato}
          desktop={{ left: 95, top: 13, width: 6.5, rotate: -22 }}
          z={1}
          parallax={34}
          sizes="(max-width: 1024px) 0px, 6vw"
          loop="bob"
          bobY={9}
          bobRotate={3}
          duration={8.4}
          delay={0.6}
          shadow="0 16px 18px rgba(150, 60, 30, 0.18)"
        />
        <FoodLayer
          asset={WHY_ASSETS.herbB}
          desktop={{ left: 90, top: 92, width: 5, rotate: 18 }}
          z={1}
          opacity={0.75}
          parallax={-26}
          sizes="(max-width: 1024px) 0px, 6vw"
          loop="bob"
          bobY={8}
          bobRotate={4}
          duration={9.2}
          delay={1.3}
        />
      </div>

      <div className="hw-why-grid relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-0">
        {/* ------------------------------- copy ------------------------------- */}
        <div className="hw-why-copy pt-12 sm:pt-16 lg:py-10 lg:pr-[6%] lg:pl-[3%]">
          <p data-why-stagger className="flex">
            <span
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--hw-why-orange)]/75 px-6 py-2 font-[family-name:var(--hw-why-font-display)] text-[clamp(1rem,1.6vw,1.35rem)] leading-none font-bold text-[var(--hw-why-orange)]"
              style={{ background: "rgba(255,255,255,0.55)" }}
            >
              {/* The small dash the reference tucks inside the pill. */}
              <span aria-hidden className="h-[2px] w-2.5 rounded-full bg-current opacity-80" />
              Why Choose Us
            </span>
          </p>

          <h2
            id="why-choose-us-heading"
            className="mt-5 font-[family-name:var(--hw-why-font-display)] leading-[1.18] font-extrabold tracking-[-0.005em]"
          >
            <span
              data-why-stagger
              className="hw-why-title-dark block text-[clamp(1.9rem,4.6vw,3.6rem)]"
            >
              Not Just a Wrap,
            </span>
            <span
              data-why-stagger
              className="hw-why-title-orange relative block text-[clamp(1.9rem,4.6vw,3.6rem)]"
            >
              A Better Experience
              {/* Hand-drawn orange underline, drawn in CSS so it stays crisp. */}
              <span
                aria-hidden
                data-why-underline
                className="absolute -bottom-[0.06em] left-[0.04em] block h-[0.075em] w-[88%] rounded-full bg-[var(--hw-why-orange)]"
              />
            </span>
          </h2>

          <p
            data-why-stagger
            className="mt-7 max-w-[34rem] font-[family-name:var(--hw-why-font-ui)] text-[clamp(0.95rem,1.25vw,1.12rem)] leading-[1.65] text-[var(--hw-why-body)]"
          >
            We combine fresh ingredients, bold flavors, and a passion for great food to give you more
            than just a meal.
          </p>
        </div>

        {/* ------------------------- product composition ------------------------- */}
        <div className="hw-why-stage relative mt-8 aspect-square w-full sm:mx-auto sm:max-w-[560px] lg:mt-0 lg:aspect-auto lg:h-full lg:max-w-none">
          {/* Glossy sauce, swooshing out from behind the wrap. Never reaches
              the copy column — it stops short of the stage's right edge. */}
          <FoodLayer
            asset={WHY_ASSETS.sauce}
            desktop={{ left: 76, top: 58, width: 38, rotate: 104 }}
            mobile={{ left: 86, top: 76, width: 40, rotate: 104 }}
            z={10}
            opacity={0.95}
            loop="drift"
            duration={15}
            sizes="(max-width: 1024px) 26vw, 23vw"
          />

          {/* Herbs behind the product. */}
          <FoodLayer
            asset={WHY_ASSETS.herbD}
            desktop={{ left: 7, top: 6, width: 15, rotate: -14 }}
            z={14}
            opacity={0.9}
            parallax={22}
            loop="bob"
            bobY={10}
            bobRotate={3}
            duration={7.6}
            delay={0.4}
            desktopOnly
            sizes="(max-width: 1024px) 0px, 9vw"
          />

          {/* The wrap itself: enormous, tilted, and deliberately cropped on the
              left and lower edges.

              The cutout was machine-extracted from the reference screenshot and
              its outline is correspondingly ragged — straight polygon cuts down
              the left and across the bottom. On desktop those edges fall outside
              the section and its `overflow-hidden` removes them. There is no
              offscreen to hide them in below `lg`, so the wrap gets a rounded
              frame of its own instead, and overfills it. */}
          <div className="hw-why-frame" style={{ zIndex: 20 }}>
            <FoodLayer
              asset={WHY_ASSETS.wrap}
              desktop={{ left: 35, top: 51, width: 78, rotate: -3 }}
              mobile={{ left: 42, top: 50, width: 118, rotate: -3 }}
              z={20}
              entrance="wrap"
              /* No drop-shadow: a CSS filter paints outside the element box,
                 and the feather mask then clips it at that box, leaving a
                 visible rectangular step in the cream. The reference has no
                 cast shadow under the wrap either — the backdrop's radial
                 bloom carries the depth. */
              className="hw-why-wrap-mask"
              sizes="(max-width: 1024px) 110vw, 40vw"
            />
          </div>

          {/* Herbs in front, drifting around the wrap. */}
          <FoodLayer
            asset={WHY_ASSETS.herbA}
            desktop={{ left: 87, top: 14, width: 13, rotate: -8 }}
            mobile={{ left: 88, top: 11, width: 20, rotate: -8 }}
            z={30}
            parallax={-30}
            loop="bob"
            bobY={14}
            bobRotate={4}
            duration={6.8}
            sizes="(max-width: 1024px) 20vw, 8vw"
          />
          <FoodLayer
            asset={WHY_ASSETS.herbC}
            desktop={{ left: 89, top: 81, width: 15, rotate: 12 }}
            mobile={{ left: 13, top: 87, width: 22, rotate: 12 }}
            z={30}
            parallax={18}
            loop="bob"
            bobY={11}
            bobRotate={3}
            duration={8.1}
            delay={0.9}
            sizes="(max-width: 1024px) 22vw, 9vw"
          />
          <FoodLayer
            asset={WHY_ASSETS.herbB}
            desktop={{ left: 97, top: 97, width: 10, rotate: -24 }}
            z={31}
            opacity={0.85}
            parallax={-16}
            loop="bob"
            bobY={9}
            duration={9.4}
            delay={1.6}
            flip
            desktopOnly
            sizes="(max-width: 1024px) 0px, 6vw"
          />
        </div>

        {/* ------------------------------ benefits ------------------------------ */}
        <ul className="hw-why-features mt-10 grid grid-cols-2 gap-x-4 gap-y-8 pb-14 sm:gap-x-8 sm:pb-16 lg:mt-0 lg:gap-x-6 lg:gap-y-10 lg:pr-[6%] lg:pb-12 lg:pl-[3%]">
          {BENEFITS.map(({ label, Icon, color, fill }) => (
            <li
              key={label}
              data-why-stagger
              className="hw-why-item flex items-center gap-3 sm:gap-4"
            >
              {/* Lucide glyphs paint with `currentColor`, so the colour sits on
                  the medallion and `stroke` and `fill` stay in step. */}
              <span
                className="hw-why-medallion flex aspect-square w-12 shrink-0 items-center justify-center rounded-full sm:w-14 lg:w-[3.9rem]"
                style={{ color }}
              >
                <Icon className="h-1/2 w-1/2" strokeWidth={2.1} fill={fill ? "currentColor" : "none"} />
              </span>
              <span className="max-w-[9.5rem] font-[family-name:var(--hw-why-font-ui)] text-[clamp(0.84rem,1.05vw,1.02rem)] leading-[1.35] font-semibold text-[var(--hw-why-ink)] sm:max-w-[11rem] lg:max-w-[7.9rem]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
