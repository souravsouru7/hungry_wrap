import type { Metadata } from "next";
import ScrollJourneyHero from "@/components/hungry-wrap/ScrollJourneyHero";

export const metadata: Metadata = {
  title: "Hero preview — The Hungry Wrap",
  description: "Preview of the scroll-controlled cinematic hero, ahead of merging it into the homepage.",
  robots: { index: false, follow: false },
};

/**
 * Isolated preview route for the scroll journey hero. The homepage is
 * untouched — once this is approved, render <ScrollJourneyHero /> from
 * `src/app/page.tsx` instead.
 */
export default function HeroPreviewPage() {
  return (
    <div className="bg-cream font-sans text-ink">
      <ScrollJourneyHero />

      {/* Proves the stage unpins cleanly into normal page flow. */}
      <section id="menu" className="relative z-10 bg-cream px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ember">The menu</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[0.9] text-ink">
            Pick your wrap
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
            This placeholder stands in for the real menu section. Hook it up to the live menu and
            ordering flow before this page goes anywhere near production — nothing here should ship
            with invented dishes, prices or delivery promises.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {["Wraps", "Sides", "Drinks"].map((group) => (
              <div
                key={group}
                className="rounded-3xl border border-ink/10 bg-white/60 p-6 shadow-[0_24px_60px_-40px_rgba(32,23,18,0.8)]"
              >
                <h3 className="font-display text-xl uppercase tracking-wide text-ink">{group}</h3>
                <p className="mt-2 text-sm text-ink/60">Awaiting the client&rsquo;s menu data.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="bg-espresso px-6 py-24 text-cream sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-[clamp(1.75rem,5vw,3.5rem)] uppercase leading-[0.95]">Our story</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/70">
            Second placeholder section, here only to show the hero handing scroll back to the rest of
            the page.
          </p>
        </div>
      </section>

      <footer id="visit" className="bg-ink px-6 py-16 text-cream/70 sm:px-10">
        <div className="mx-auto max-w-5xl text-sm">
          <p className="font-display text-base uppercase tracking-[0.3em] text-cream">The Hungry Wrap</p>
          <p className="mt-3">Preview build — not a live page. Contact and location details to be supplied.</p>
        </div>
      </footer>
    </div>
  );
}
