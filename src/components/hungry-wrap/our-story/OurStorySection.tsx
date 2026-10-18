import Image from "next/image";
import { OUR_STORY_ASSETS, type OurStoryAsset } from "./assets";

type OurStorySectionProps = {
  /** Defaults to the About anchor already used by the primary navigation. */
  learnMoreHref?: string;
  className?: string;
};

function DecorativeLayer({
  asset,
  className,
}: {
  asset: OurStoryAsset;
  className: string;
}) {
  return (
    <Image
      src={asset.src}
      alt=""
      aria-hidden="true"
      width={asset.width}
      height={asset.height}
      sizes="(max-width: 767px) 35vw, (max-width: 1023px) 18vw, 12vw"
      draggable={false}
      className={`pointer-events-none absolute h-auto select-none ${className}`}
    />
  );
}

/**
 * An accessible, responsive recreation of the restaurant story panel. The
 * restaurant and foliage remain individually positioned layers; only the
 * supplied transparent cutout defines the photo's organic right edge.
 */
export default function OurStorySection({
  learnMoreHref = "#about",
  className = "",
}: OurStorySectionProps) {
  return (
    <section
      id="about"
      aria-labelledby="our-story-heading"
      className={`hw-our-story relative isolate overflow-hidden bg-[#fff9f0] ${className}`}
    >
      <div className="relative mx-auto grid w-full max-w-[2048px] grid-cols-1 lg:aspect-[2048/564] lg:grid-cols-[55%_45%]">
        {/* The supplied alpha cutout carries the distinctive S-like edge. */}
        <div className="relative order-1 aspect-[1.36/1] overflow-hidden sm:aspect-[1.55/1] lg:aspect-auto lg:overflow-visible">
          <Image
            src={OUR_STORY_ASSETS.restaurant.src}
            alt={OUR_STORY_ASSETS.restaurant.alt}
            width={OUR_STORY_ASSETS.restaurant.width}
            height={OUR_STORY_ASSETS.restaurant.height}
            sizes="(max-width: 1023px) 100vw, 55vw"
            draggable={false}
            className="hw-our-story-photo absolute inset-0 h-full w-full object-cover object-[38%_center] lg:object-fill"
          />

          {/* Soft depth in the same foreground positions as the reference. */}
          <DecorativeLayer
            asset={OUR_STORY_ASSETS.foregroundBlur}
            className="hw-our-story-foliage hidden -left-[13%] -top-[36%] z-10 w-[40%] opacity-95 blur-[3.5px] lg:block"
          />
          <DecorativeLayer
            asset={OUR_STORY_ASSETS.leafCluster}
            className="hw-our-story-foliage hidden -bottom-[39%] -left-[10%] z-10 w-[38%] opacity-75 blur-[2.5px] lg:block"
          />
          <DecorativeLayer
            asset={OUR_STORY_ASSETS.foregroundBlur}
            className="-bottom-[43%] -left-[20%] z-10 w-[65%] opacity-70 blur-[1px] sm:-bottom-[50%] sm:w-[48%] lg:hidden"
          />
        </div>

        <div className="relative order-2 flex min-w-0 items-center px-6 py-14 sm:px-10 sm:py-16 lg:px-[7%] lg:py-6">
          <div className="relative z-20 max-w-[35rem] lg:-mt-1">
            <span className="hw-our-story-reveal inline-flex items-center gap-2 rounded-full border border-[#f78a3c]/75 bg-white/45 px-4 py-1 font-[family-name:var(--font-poppins)] text-[clamp(.78rem,1vw,.98rem)] font-semibold text-[#f47721] shadow-[0_3px_8px_rgba(225,116,30,.08)]">
              <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
              Our Story
              <svg
                aria-hidden
                viewBox="0 0 16 14"
                className="ml-0.5 h-3 w-3.5 overflow-visible"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              >
                <path d="M2 11c4.5.6 8-1.2 9-4.4" />
                <path d="M8.4 2.2 11.6 6 8 7.6" />
              </svg>
            </span>

            <h2
              id="our-story-heading"
              className="mt-4 font-[family-name:var(--font-poppins)] text-[clamp(1.85rem,2.95vw,3.15rem)] leading-[1.08] font-bold tracking-[-0.05em]"
            >
              <span className="hw-our-story-reveal block text-[#201b18]" style={{ animationDelay: "80ms" }}>
                Great Food Brings
              </span>
              <span className="hw-our-story-reveal hw-our-story-orange block" style={{ animationDelay: "150ms" }}>
                People Together
              </span>
            </h2>

            <span
              aria-hidden
              className="hw-our-story-reveal mt-2.5 block h-[0.26rem] w-20 rounded-full bg-[#f47721] shadow-[12px_2px_0_-1px_rgba(244,119,33,.42)]"
              style={{ animationDelay: "210ms" }}
            />

            <p
              className="hw-our-story-reveal mt-5 max-w-[27rem] font-[family-name:var(--font-poppins)] text-[clamp(.86rem,.99vw,.98rem)] leading-[1.62] font-medium tracking-[-0.016em] text-[#4c443e]"
              style={{ animationDelay: "250ms" }}
            >
              At The Hungry Wrap, we believe food is more than just a meal — it&apos;s a moment of
              happiness. Our wraps are crafted with fresh ingredients, bold flavors, and a passion for
              bringing people together.
            </p>

            <a
              href={learnMoreHref}
              className="hw-our-story-reveal hw-our-story-button group mt-7 inline-flex min-h-12 items-center gap-2.5 rounded-full border-2 border-[#f6b27c] bg-white/75 px-8 font-[family-name:var(--font-poppins)] text-[.95rem] font-bold text-[#ec731b] shadow-[0_9px_22px_-17px_rgba(99,55,23,.48)] transition duration-300 hover:-translate-y-1 hover:border-[#f47721] hover:bg-white hover:shadow-[0_17px_28px_-17px_rgba(99,55,23,.55)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#f47721]"
              style={{ animationDelay: "330ms" }}
            >
              Learn More
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-hover:-rotate-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
                <path d="M8.5 8V6.2a3.5 3.5 0 0 1 7 0V8" />
              </svg>
            </a>
          </div>

          {/* Sharp, separate right-side foliage. It is hidden/reduced before
              it can compete with the mobile text column. */}
          <DecorativeLayer
            asset={OUR_STORY_ASSETS.leafTop}
            className="hw-our-story-foliage absolute -top-[18%] right-[3%] z-10 hidden w-[14%] lg:block"
          />
          <DecorativeLayer
            asset={OUR_STORY_ASSETS.leafRight}
            className="hw-our-story-foliage absolute right-[-11%] top-[30%] z-10 hidden w-[18%] lg:block"
          />
          <DecorativeLayer
            asset={OUR_STORY_ASSETS.leafLower}
            className="hw-our-story-foliage absolute -bottom-[30%] right-[-7%] z-10 hidden w-[19%] lg:block"
          />
        </div>
      </div>
    </section>
  );
}
