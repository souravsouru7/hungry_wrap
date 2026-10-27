import Image from "next/image";

import type { HeroAsset } from "@/components/hungry-wrap/exact-hero/assets";

import { HOME_ASSETS as A } from "./assets";
import ScrollRail from "./motion/ScrollRail";
import { Pop, Stagger, StaggerItem } from "./motion/Stagger";

type Art = { asset: HeroAsset; className: string; from: { x?: number; y?: number; rotate?: number; scale?: number } };

const STEPS: { title: string; body: string; art: Art[] }[] = [
  {
    title: "Warm tortilla",
    body: "Every roll starts on a hot tawa, so the wrap is soft inside and lightly crisp outside.",
    art: [{ asset: A.tortilla, className: "h-full w-auto", from: { rotate: -200, scale: 0.3 } }],
  },
  {
    title: "Fresh fillings",
    body: "Chicken, paneer and veggies prepped every morning, piled high with crunchy lettuce and tomato.",
    art: [
      { asset: A.chicken, className: "absolute top-[8%] left-1/2 w-[46%] max-w-40 -translate-x-1/2", from: { y: -120, rotate: 20 } },
      { asset: A.lettuce, className: "absolute bottom-0 left-[12%] w-[34%] max-w-28 -rotate-12", from: { y: -160, rotate: -30 } },
      { asset: A.tomato, className: "absolute right-[12%] bottom-0 w-[30%] max-w-24 rotate-6", from: { y: -200, rotate: 40 } },
    ],
  },
  {
    title: "Rolled hot",
    body: "Sauced, rolled tight and handed over in minutes. Never sitting on a shelf.",
    art: [{ asset: A.finishedWrap, className: "h-full w-auto", from: { x: -140, rotate: -60 } }],
  },
];

/** Three-step "how it's made" strip; a rail fills as you scroll and each step's art lands in turn. */
export default function FreshSteps() {
  return (
    <section aria-labelledby="fresh-heading" className="overflow-x-clip bg-[#fff1e0] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Stagger className="mx-auto max-w-2xl text-center">
          <StaggerItem as="p" className="font-[family-name:var(--font-poppins)] text-[.9rem] font-semibold tracking-wide text-[#f47514] uppercase">
            Made fresh, every order
          </StaggerItem>
          <StaggerItem
            as="h2"
            id="fresh-heading"
            className="mt-2 font-[family-name:var(--font-baloo)] text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[.98] font-extrabold tracking-[-.04em] text-[#211b18]"
          >
            From tawa to your hands in minutes
          </StaggerItem>
        </Stagger>

        <ScrollRail className="mt-12">
          <Stagger as="ol" stagger={0.18} className="relative grid gap-5 pl-12 md:grid-cols-3 md:pt-10 md:pl-0">
            {STEPS.map((step, i) => (
              <StaggerItem
                as="li"
                key={step.title}
                className="group relative flex flex-col items-center rounded-[1.75rem] bg-white px-6 pt-6 pb-8 text-center shadow-[0_18px_32px_-26px_rgba(94,54,19,.5)] ring-1 ring-[#f6dcc0] transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="absolute top-5 -left-[2.6rem] flex h-9 w-9 items-center justify-center rounded-full bg-[#f47514] font-[family-name:var(--font-baloo)] text-lg font-bold text-white shadow-[0_8px_14px_-6px_rgba(200,85,10,.8)] ring-4 ring-[#fff1e0] md:-top-[2.375rem] md:left-1/2 md:-translate-x-1/2">
                  {i + 1}
                </span>
                <div className="relative mt-4 flex h-40 w-full items-center justify-center transition-transform duration-500 group-hover:scale-105 md:mt-6">
                  {step.art.map((art, j) => (
                    <Pop
                      key={art.asset.src}
                      from={art.from}
                      delay={0.15 + j * 0.12}
                      className={step.art.length === 1 ? "flex h-full items-center justify-center" : art.className}
                    >
                      <Image
                        src={art.asset.src}
                        alt={art.asset.alt}
                        width={art.asset.width}
                        height={art.asset.height}
                        sizes="180px"
                        className={step.art.length === 1 ? art.className : "h-auto w-full"}
                      />
                    </Pop>
                  ))}
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-baloo)] text-[1.5rem] font-bold text-[#211b18]">{step.title}</h3>
                <p className="mt-2 max-w-[19rem] font-[family-name:var(--font-poppins)] text-[.9rem] leading-relaxed text-[#6b5f56]">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </ScrollRail>
      </div>
    </section>
  );
}
