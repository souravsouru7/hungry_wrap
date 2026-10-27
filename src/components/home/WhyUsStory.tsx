import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChefHat, Coffee, IndianRupee, Salad } from "lucide-react";

import { HOME_ASSETS as A } from "./assets";
import ParallaxZoom from "./motion/ParallaxZoom";
import { Stagger, StaggerItem } from "./motion/Stagger";

const REASONS = [
  { icon: Salad, title: "Fresh every day", body: "Veggies and fillings prepped each morning." },
  { icon: ChefHat, title: "Made to order", body: "Rolled hot when you order, never pre-made." },
  { icon: IndianRupee, title: "Easy on the pocket", body: "Rolls from ₹49, chai for ₹11." },
  { icon: Coffee, title: "Chai & quick bites", body: "Bun maska, Maggie and coffee too." },
] as const;

/** Restaurant photo, four reasons to visit, and the doors into About and Tea Club. */
export default function WhyUsStory() {
  return (
    <section aria-labelledby="why-heading" className="overflow-x-clip bg-[#fff9f2] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative rounded-[1.75rem] shadow-[0_30px_60px_-35px_rgba(90,55,20,0.7)]">
          <ParallaxZoom className="aspect-[4/3] rounded-[1.75rem]">
            <Image
              src={A.restaurant.src}
              alt={A.restaurant.alt}
              width={A.restaurant.width}
              height={A.restaurant.height}
              sizes="(max-width: 1024px) 92vw, 700px"
              className="h-full w-full object-cover"
            />
          </ParallaxZoom>
        </div>

        <Stagger>
          <StaggerItem as="p" className="font-[family-name:var(--font-poppins)] text-[.9rem] font-semibold tracking-wide text-[#f47514] uppercase">
            Why The Hungry Wrap
          </StaggerItem>
          <StaggerItem
            as="h2"
            id="why-heading"
            className="mt-2 font-[family-name:var(--font-baloo)] text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[.98] font-extrabold tracking-[-.04em] text-[#211b18]"
          >
            A little cafe with a <span className="text-[#f47514]">big appetite</span>
          </StaggerItem>

          <Stagger as="ul" stagger={0.1} className="mt-8 grid gap-4 sm:grid-cols-2">
            {REASONS.map(({ icon: Icon, title, body }, i) => (
              <StaggerItem
                as="li"
                key={title}
                tilt={i % 2 ? 3 : -3}
                className="group flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#f1e4d7] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_28px_-20px_rgba(94,54,19,.55)] hover:ring-[#f6c79c]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff1e0] text-[#f47514] transition-all duration-300 group-hover:rotate-[-12deg] group-hover:scale-110 group-hover:bg-[#f47514] group-hover:text-white">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={2.3} />
                </span>
                <span className="font-[family-name:var(--font-poppins)]">
                  <span className="block text-[.95rem] font-semibold text-[#211b18]">{title}</span>
                  <span className="mt-0.5 block text-[.84rem] leading-snug text-[#75685e]">{body}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <StaggerItem className="mt-8 flex flex-wrap gap-3 font-[family-name:var(--font-poppins)]">
            <Link
              href="/about"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#211b18] px-6 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f47514]"
            >
              Our story
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/subscription"
              className="inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-[#f47514] ring-2 ring-[#f6c79c] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fff1e0]"
            >
              Join the Tea Club
            </Link>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
