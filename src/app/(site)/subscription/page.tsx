import type { Metadata } from "next";

import CtaButton from "@/components/CtaButton";
import FinalCtaFooter from "@/components/FinalCtaFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/motion/CountUp";
import DrawLine from "@/components/motion/DrawLine";
import TiltCard from "@/components/motion/TiltCard";
import SceneFrame from "@/components/three/SceneFrame";
import { HERO_ASSETS } from "@/components/hungry-wrap/exact-hero/assets";
import { HOW_IT_WORKS, TEA_PLANS } from "@/lib/plans";
import { NAV_LINKS, ORDER_HREF, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Daily Tea Subscription Plan | Save Money at Hungry Wrap" },
  description:
    "Drink tea daily? Join the Hungry Wrap Tea Subscription. Get weekly or monthly plans, skip the payment line, and lock in your Rs. 11 daily tea!",
};

const h2 = "font-[family-name:var(--font-baloo)] text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#211b18]";

export default function SubscriptionPage() {
  return (
    <main className="flex-1 bg-[#fff9f2]" style={{ "--hw-page-bg": "#fff9f2" } as React.CSSProperties}>
      <PageHero
        kicker="The Hungry Wrap Tea Club"
        title="Fuel Your Day:"
        accent="The Tea Club"
        lead="Stop searching for change every morning. With our exclusive subscription plans, you secure your daily brew at a flat, discounted rate. Just flash your digital pass, grab your piping hot tea, and conquer the day."
      />

      <section aria-labelledby="plans-heading" className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Reveal className="text-center">
          <h2 id="plans-heading" data-reveal className={h2}>
            Choose Your Chai Plan
          </h2>
          <p data-reveal className="mt-3 font-[family-name:var(--font-poppins)] text-[#5b514a]">
            Scroll the plans and watch your cup fill.
          </p>
        </Reveal>

        <div id="plans-track" className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          {/* The cup fills, glows gold for the Best Seller, and doubles for the Double Dose. */}
          <SceneFrame
            scene="tea"
            track="#plans-track"
            start="top 60%"
            end="bottom 70%"
            fallback={{ ...HERO_ASSETS.blob }}
          />

          <ul className="space-y-10 lg:space-y-[22vh] lg:py-[12vh]">
            {TEA_PLANS.map((p) => (
              <li key={p.name}>
                <Reveal>
                  <div data-reveal className={p.badge ? "hw-page-conic rounded-[1.6rem] p-[3px]" : ""}>
                    <TiltCard className="rounded-3xl" max={7}>
                      <article className="relative flex h-full flex-col rounded-3xl bg-white p-7 shadow-[0_18px_36px_-24px_rgba(90,55,20,0.45)] sm:p-8">
                        {p.badge && (
                          <span className="hw-page-badge absolute -top-3 right-6 rounded-full bg-[#f47514] px-3 py-1 font-[family-name:var(--font-poppins)] text-xs font-bold text-white">
                            {p.badge}
                          </span>
                        )}
                        <h3 className="font-[family-name:var(--font-baloo)] text-2xl font-extrabold text-[#211b18]">{p.name}</h3>
                        <p className="mt-3 font-[family-name:var(--font-baloo)] text-5xl font-extrabold text-[#f47514]">
                          Rs. <CountUp to={p.price} />
                          <span className="text-base font-semibold text-[#77716c]"> / {p.period}</span>
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-poppins)] text-sm text-[#77716c]">
                          Regular price{" "}
                          <span className="relative inline-block">
                            Rs. {p.regular}
                            <DrawLine className="absolute left-0 top-1/2 h-[2px] w-full bg-[#e8342a]" />
                          </span>
                          <span className="ml-2 rounded-full bg-[#eef6e3] px-2 py-0.5 font-semibold text-[#4f7f1c]">
                            Save Rs. {p.regular - p.price}
                          </span>
                        </p>
                        <dl className="mt-5 flex-1 space-y-3 font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-[#5b514a]">
                          <div>
                            <dt className="font-semibold text-[#211b18]">The Deal</dt>
                            <dd>{p.deal}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[#211b18]">The Value</dt>
                            <dd>{p.value}</dd>
                          </div>
                        </dl>
                        <CtaButton
                          className="mt-6 self-start"
                          href={whatsappUrl(`Hi! I'd like to subscribe to ${p.name} (Rs. ${p.price} / ${p.period}).`)}
                        >
                          Subscribe
                        </CtaButton>
                      </article>
                    </TiltCard>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <Reveal className="text-center">
          <h2 id="how-heading" data-reveal className={h2}>
            How It Works
          </h2>
        </Reveal>
        <div className="relative mt-12">
          {/* Connector drawn between the three steps as they scroll in. */}
          <DrawLine className="absolute top-6 left-[16%] right-[16%] hidden h-[3px] rounded-full bg-[#f47514] sm:block" duration={1.2} />
          <Reveal>
            <ol className="relative grid gap-10 sm:grid-cols-3">
              {HOW_IT_WORKS.map((s, i) => (
                <li key={s.title} data-reveal className="text-center">
                  <span className="hw-page-step mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f47514] font-[family-name:var(--font-baloo)] text-xl font-extrabold text-white shadow-[0_0_0_6px_#fff9f2]">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-baloo)] text-xl font-bold text-[#211b18]">{s.title}</h3>
                  <p className="mt-1 font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-[#5b514a]">{s.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        <div className="mt-14 flex justify-center">
          <CtaButton href={whatsappUrl("Hi! I'd like to start a Tea Club subscription.")}>Start My Subscription Today</CtaButton>
        </div>
      </section>

      <FinalCtaFooter orderHref={ORDER_HREF} navLinks={NAV_LINKS} />
    </main>
  );
}
