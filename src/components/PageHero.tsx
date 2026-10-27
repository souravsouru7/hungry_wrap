import type { ReactNode } from "react";

import Reveal from "@/components/Reveal";
import FloatingFood from "@/components/motion/FloatingFood";
import SplitHeadline from "@/components/motion/SplitHeadline";

type PageHeroProps = {
  kicker?: string;
  title: string;
  /** Orange-accented tail of the headline. */
  accent?: string;
  lead?: ReactNode;
  children?: ReactNode;
};

/** Top band shared by every inner page. */
export default function PageHero({ kicker, title, accent, lead, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f6e6d2] px-5 pt-16 pb-28 sm:px-8 sm:pt-24 sm:pb-32">
      <div aria-hidden className="hw-page-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <FloatingFood />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          {kicker && (
            <p data-reveal className="font-[family-name:var(--font-poppins)] text-sm font-semibold uppercase tracking-[0.18em] text-[#f47514]">
              {kicker}
            </p>
          )}
        </Reveal>
        <SplitHeadline title={title} accent={accent} />
        <Reveal>
          {lead && (
            <p data-reveal className="mx-auto mt-5 max-w-2xl font-[family-name:var(--font-poppins)] text-base leading-relaxed text-[#5b514a] sm:text-lg">
              {lead}
            </p>
          )}
          {children && <div data-reveal className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
        </Reveal>
      </div>
      <svg aria-hidden viewBox="0 0 2048 125" preserveAspectRatio="none" className="hw-section-wave pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(2.5rem,5vw,5.5rem)] w-full translate-y-px">
        <path d="M0 13C298 78 568 16 906 70C1280 130 1632 35 2048 67V125H0V13Z" fill="#fff9f2" />
      </svg>
    </section>
  );
}
