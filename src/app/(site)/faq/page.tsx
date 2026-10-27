import type { Metadata } from "next";

import FinalCtaFooter from "@/components/FinalCtaFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Scene3D from "@/components/three/Scene3D";
import { FAQ_GROUPS } from "@/lib/faqs";
import { NAV_LINKS, ORDER_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "FAQ | Menu, Delivery & Tea Subscription Questions | Hungry Wrap" },
  description:
    "Have questions about Hungry Wrap? Find fast answers about our menu, delivery options, cafe location, and how our monthly tea subscription works.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
};

// Each answer's position across all groups, so the 3D scene can flip a matching mark.
const OFFSETS = FAQ_GROUPS.map((_, gi) => FAQ_GROUPS.slice(0, gi).reduce((n, g) => n + g.items.length, 0));

export default function FaqPage() {
  return (
    <main className="flex-1 bg-[#fff9f2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero title="Frequently Asked" accent="Questions" lead="Tap a question — every answer you find flips a ? into a !" />

      {/* Glossy 3D question marks drift behind the answers. */}
      <section id="faq-track" className="relative">
        <div className="sticky top-0 -mb-[100svh] h-[100svh]">
          <Scene3D scene="faq" track="#faq-track" start="top bottom" end="bottom top" className="h-full w-full" />
        </div>

        <div className="relative mx-auto max-w-3xl space-y-14 px-5 py-16 sm:px-8">
          {FAQ_GROUPS.map((g, gi) => (
            <Reveal key={g.heading}>
              <section aria-labelledby={`faq-group-${gi}`}>
                <h2
                  id={`faq-group-${gi}`}
                  data-reveal
                  className="font-[family-name:var(--font-baloo)] text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold tracking-tight text-[#211b18]"
                >
                  {g.heading}
                </h2>
                <div className="mt-5 space-y-3">
                  {g.items.map((i, ii) => (
                    <details
                      key={i.q}
                      data-reveal
                      data-faq-index={OFFSETS[gi] + ii}
                      className="hw-page-faq group rounded-2xl bg-white/93 px-5 py-4 shadow-[0_12px_28px_-22px_rgba(90,55,20,0.5)] ring-1 ring-white/70 transition-shadow duration-300 open:shadow-[0_22px_40px_-24px_rgba(244,117,20,0.55)] open:ring-[#f47514]/40"
                    >
                      <summary className="cursor-pointer list-none font-[family-name:var(--font-baloo)] text-lg font-bold text-[#211b18] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47514] [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center justify-between gap-4">
                          {i.q}
                          <span
                            aria-hidden
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fdf0dd] text-xl text-[#f47514] transition-[transform,background-color,color] duration-300 group-open:rotate-[135deg] group-open:bg-[#f47514] group-open:text-white"
                          >
                            +
                          </span>
                        </span>
                      </summary>
                      <p className="mt-3 font-[family-name:var(--font-poppins)] leading-relaxed text-[#5b514a]">{i.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCtaFooter orderHref={ORDER_HREF} navLinks={NAV_LINKS} />
    </main>
  );
}
