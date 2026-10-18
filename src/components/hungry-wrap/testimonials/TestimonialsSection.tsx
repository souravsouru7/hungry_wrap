"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWave from "@/components/hungry-wrap/SectionWave";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type Testimonial = {
  /** The review itself. */
  quote: string;
  /** How the reviewer is credited. */
  name: string;
  /** 1-5. Rendered as filled stars and announced as text. */
  rating: number;
  /** Avatar tones — faces are drawn, never stock photos of real people. */
  skin: string;
  hair: string;
  shirt: string;
};

/**
 * Copy taken from the design mock so the section renders as designed.
 *
 * These are NOT real reviews. Replace them with verified customer feedback
 * before this page goes live — pass real entries through the `testimonials`
 * prop rather than editing this list, so it stays obvious that the default is
 * placeholder content.
 */
export const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    quote: "Absolutely delicious! The wraps are fresh, flavorful, and always satisfy my cravings.",
    name: "Aarav S.",
    rating: 5,
    skin: "#e8ad7d",
    hair: "#3a2a20",
    shirt: "#f08a2a",
  },
  {
    quote: "Best wraps in town! The chicken wrap is my favorite. Highly recommended!",
    name: "Priya K.",
    rating: 5,
    skin: "#c88a55",
    hair: "#241a14",
    shirt: "#4f8c43",
  },
  {
    quote: "Fresh ingredients and amazing taste. I keep coming back for more!",
    name: "Rahul M.",
    rating: 5,
    skin: "#8d5a33",
    hair: "#1d1410",
    shirt: "#2f3b55",
  },
];

type TestimonialsSectionProps = {
  testimonials?: Testimonial[];
  className?: string;
};

/** Avatar face, drawn in code — no stock photos of real people. */
function Avatar({ skin, hair, shirt }: Pick<Testimonial, "skin" | "hair" | "shirt">) {
  return (
    <span
      aria-hidden
      className="relative inline-block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white"
      style={{ background: "linear-gradient(180deg, #ffe9cf 0%, #f8d6ad 100%)" }}
    >
      <svg viewBox="0 0 36 36" className="h-full w-full">
        <circle cx="18" cy="14" r="7" fill={skin} />
        <path d="M11 13a7 7 0 0 1 14 0c0-5-3-7.5-7-7.5S11 8 11 13Z" fill={hair} />
        <path d="M4 36c1.6-7 7.4-10.5 14-10.5S30.4 29 32 36H4Z" fill={shirt} />
      </svg>
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden
          className="h-3.5 w-3.5"
          fill={i < filled ? "#f7a81b" : "#e7ddd2"}
        >
          <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9L12 2.6Z" />
        </svg>
      ))}
    </span>
  );
}

/* --------------------------------------------------------------- section --- */

/**
 * "Real People. Real Happiness." — a draggable testimonial carousel.
 *
 * The track is a real scroll container with CSS scroll-snap rather than a
 * transform-driven slider: that keeps native touch momentum, trackpad
 * scrolling, keyboard navigation and screen-reader reading order for free.
 * Pointer handlers add click-and-drag on top for mouse users, and the arrow
 * buttons scroll by exactly one card.
 */
export default function TestimonialsSection({
  testimonials = PLACEHOLDER_TESTIMONIALS,
  className = "",
}: TestimonialsSectionProps) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* ---------------------------- entrance ---------------------------- */
  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, (match) => {
        // Reduced motion: nothing is hidden in CSS, so the finished layout is
        // simply what renders. Dragging still works.
        if ((match.conditions as Record<string, boolean>).reduce) return;

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          })
          .from(q("[data-testimonial-copy]"), { y: 24, autoAlpha: 0, duration: 0.65, stagger: 0.08 })
          .from(
            q("[data-testimonial-card]"),
            { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.1 },
            0.2,
          );
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  /* ------------------------- scroll position ------------------------- */
  const syncEdges = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = track.current;
    if (!el) return;
    const onResize = () => syncEdges();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncEdges, testimonials.length]);

  const step = useCallback((direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const distance = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  }, []);

  /* ---------------------------- drag to pan --------------------------- */
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

  const onPointerDown = (event: ReactPointerEvent<HTMLUListElement>) => {
    // Let touch keep native momentum scrolling; only take over for mouse/pen.
    if (event.pointerType === "touch") return;
    const el = track.current;
    if (!el) return;
    drag.current = { active: true, startX: event.clientX, startLeft: el.scrollLeft, moved: 0 };
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLUListElement>) => {
    const el = track.current;
    if (!el || !drag.current.active) return;
    const dx = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    const el = track.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
  };

  // A drag that travelled should not also fire the click it ends on.
  const onClickCapture = (event: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      event.preventDefault();
      event.stopPropagation();
    }
    drag.current.moved = 0;
  };

  const arrow = "h-11 w-11 shrink-0 rounded-full transition duration-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47721]";

  return (
    <section
      ref={root}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className={`hw-testimonials relative isolate overflow-hidden bg-[#fffaf2] py-16 sm:py-20 lg:py-24 ${className}`}
    >
      {/* Organic wave parting this section from the one above. */}
      <SectionWave fill="#fffaf2" variant="rise" />

      {/* Hand-drawn orange flourishes either side, as in the design. */}
      {[
        { side: "left-[1%]", top: "top-[62%]", flip: false },
        { side: "right-[1%]", top: "top-[58%]", flip: true },
      ].map(({ side, top, flip }) => (
        <svg
          key={side}
          aria-hidden="true"
          viewBox="0 0 48 34"
          className={`pointer-events-none absolute ${side} ${top} hidden w-[2.6%] text-[#f5a84a] lg:block`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          style={flip ? { transform: "scaleX(-1)" } : undefined}
        >
          <path d="M4 25c8-3 13-9 14-18" />
          <path d="M20 29c9-4 15-11 16-21" />
          <path d="M36 32c6-3 9-8 9-14" />
        </svg>
      ))}

      <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        {/* ------------------------------ header ------------------------------ */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <p data-testimonial-copy>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#f58a3a]/75 bg-white/50 px-5 py-1.5 font-[family-name:var(--font-baloo)] text-[clamp(.9rem,1.15vw,1.12rem)] leading-none font-bold text-[#ee741a]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                What Our Customers Say
              </span>
            </p>

            <h2
              data-testimonial-copy
              id="testimonials-heading"
              className="mt-4 font-[family-name:var(--font-baloo)] text-[clamp(1.95rem,3.4vw,3.5rem)] leading-[1.1] font-extrabold tracking-[-.03em] text-[#201b18]"
            >
              Real People. <span className="text-[#f36b13]">Real Happiness.</span>
            </h2>

            <p
              data-testimonial-copy
              className="mt-3 max-w-[38rem] font-[family-name:var(--font-poppins)] text-[clamp(.9rem,1.05vw,1.04rem)] leading-[1.6] font-medium text-[#514943]"
            >
              Thousands of happy customers love our wraps. Here&apos;s what some of them say.
            </p>
          </div>

          <div
            data-testimonial-copy
            className={`items-center gap-3 ${atStart && atEnd ? "hidden" : "flex"}`}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous testimonials"
              className={`${arrow} border-2 border-[#f3ddc6] bg-white text-[#ee741a] hover:border-[#f47721] enabled:hover:-translate-y-0.5`}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="mx-auto h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H6M11.5 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next testimonials"
              className={`${arrow} text-white enabled:hover:-translate-y-0.5`}
              style={{ background: "linear-gradient(180deg, #fa9231 0%, #ef780e 100%)" }}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="mx-auto h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M12.5 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ------------------------------ carousel ------------------------------ */}
        <ul
          ref={track}
          onScroll={syncEdges}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          tabIndex={0}
          role="region"
          aria-label="Customer testimonials, scrollable"
          className="hw-testimonials-track mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47721] sm:mt-12"
        >
          {testimonials.map((t, i) => (
            <li
              key={`${t.name}-${i}`}
              data-testimonial-card
              className="w-[80%] shrink-0 snap-start sm:w-[58%] lg:w-[calc((100%-3rem)/3)]"
              style={{ "--hw-t-index": i } as CSSProperties}
            >
              <figure className="flex h-full flex-col rounded-[1.6rem] bg-white px-6 py-6 shadow-[0_16px_34px_-24px_rgba(83,48,19,.5)] ring-1 ring-[#f3e7da] sm:rounded-[2rem] sm:px-7 sm:py-7">
                <svg viewBox="0 0 32 24" aria-hidden className="h-5 w-7 shrink-0 text-[#f7bb7d]" fill="currentColor">
                  <path d="M0 24V13.4C0 6.1 4 1.4 11.3 0l1.3 3.7C8.2 5 6 7.4 6 10.6h5.3V24H0Zm19 0V13.4C19 6.1 23 1.4 30.3 0l1.3 3.7C27.2 5 25 7.4 25 10.6h5.3V24H19Z" />
                </svg>

                <blockquote className="mt-4 grow font-[family-name:var(--font-poppins)] text-[clamp(.92rem,1.06vw,1.05rem)] leading-[1.62] font-medium text-[#4c443e]">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-[#f3e7da] pt-5">
                  <Avatar skin={t.skin} hair={t.hair} shirt={t.shirt} />
                  <span className="min-w-0">
                    <span className="block truncate font-[family-name:var(--font-poppins)] text-[.95rem] font-bold text-[#221d1a]">
                      {t.name}
                    </span>
                    <Stars rating={t.rating} />
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
