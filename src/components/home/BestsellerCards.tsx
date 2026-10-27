import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import CountUp from "@/components/motion/CountUp";
import DrawLine from "@/components/motion/DrawLine";
import TiltCard from "@/components/motion/TiltCard";
import { FEATURED, MENU_GROUPS, type Diet, type FeaturedItem } from "@/lib/menu";
import { ORDER_HREF } from "@/lib/site";

import { Stagger, StaggerItem } from "./motion/Stagger";

/** The Indian veg / non-veg mark: a coloured square with a dot inside. */
export function DietMark({ diet }: { diet: Diet }) {
  const color = diet === "veg" ? "#2f9a3a" : "#c5352b";
  return (
    <span
      role="img"
      aria-label={diet === "veg" ? "Vegetarian" : "Non-vegetarian"}
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-2 bg-white"
      style={{ borderColor: color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    </span>
  );
}

function BestsellerCard({ item, index }: { item: FeaturedItem; index: number }) {
  return (
    <StaggerItem as="li" tilt={index % 2 ? 4 : -4}>
      <TiltCard className="rounded-[1.75rem]" max={8}>
        <article className="group flex h-full flex-col rounded-[1.75rem] bg-white p-3 shadow-[0_18px_32px_-24px_rgba(94,54,19,.5)] ring-1 ring-[#f1e4d7] transition-shadow duration-300 hover:shadow-[0_30px_40px_-22px_rgba(94,54,19,.55)]">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.35rem] bg-[radial-gradient(circle_at_50%_45%,#fffdf8_0%,#fff2e1_60%,#f9e0c4_100%)]">
            <span
              aria-hidden
              className="absolute h-[70%] w-[70%] scale-50 rounded-full bg-[#ffd3a3]/70 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100"
            />
            <Image
              src={item.image}
              alt={item.name}
              width={640}
              height={640}
              sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 300px"
              className="relative h-[118%] w-auto max-w-none object-contain transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-[1.1] group-hover:-rotate-6 motion-reduce:transition-none"
            />
          </div>

          <div className="flex flex-1 flex-col px-2 pt-4 pb-1 font-[family-name:var(--font-poppins)]">
            <div className="flex items-center gap-2">
              <DietMark diet={item.diet} />
              <h3 className="font-[family-name:var(--font-baloo)] text-[1.35rem] leading-tight font-bold tracking-[-.02em] text-[#211b18]">
                {item.name}
              </h3>
            </div>
            <p className="mt-1.5 text-[.86rem] leading-relaxed text-[#75685e]">{item.blurb}</p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-4">
              <span className="font-[family-name:var(--font-baloo)] text-[1.6rem] leading-none font-extrabold text-[#f47514] tabular-nums">
                ₹<CountUp to={item.prices[0]} />
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/menu#${item.categoryId}`}
                  aria-label={`See ${item.name} on the menu`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f6a66d] text-[#f47514] transition-all duration-300 hover:-rotate-45 hover:bg-[#f47514] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f47514]"
                >
                  <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2.6} />
                </Link>
                <a
                  href={ORDER_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-full bg-[#f47514] px-4 text-[.85rem] font-semibold text-white transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f47514]"
                >
                  Order
                </a>
              </div>
            </div>
          </div>
        </article>
      </TiltCard>
    </StaggerItem>
  );
}

/**
 * Bestsellers plus the menu's main categories. Everything here is read from
 * `src/lib/menu.ts`, and every link lands on the matching section of /menu.
 */
export default function BestsellerCards() {
  return (
    <section id="menu" aria-labelledby="menu-heading" className="bg-[#fff9f2] pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Stagger as="header" className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <StaggerItem as="p" className="font-[family-name:var(--font-poppins)] text-[.9rem] font-semibold tracking-wide text-[#f47514] uppercase">
              Our bestsellers
            </StaggerItem>
            <StaggerItem
              as="h2"
              id="menu-heading"
              className="mt-2 font-[family-name:var(--font-baloo)] text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[.98] font-extrabold tracking-[-.04em] text-[#211b18]"
            >
              The rolls Nagpur keeps{" "}
              <span className="relative inline-block text-[#f47514]">
                coming back for
                <DrawLine className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#ffc48a]" duration={0.8} />
              </span>
            </StaggerItem>
          </div>
          <StaggerItem from="right">
            <Link
              href="/menu"
              className="group inline-flex shrink-0 items-center gap-2 self-start font-[family-name:var(--font-poppins)] text-[.95rem] font-bold text-[#f47514] sm:self-end"
            >
              View full menu
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f47514] text-white transition-transform duration-300 group-hover:translate-x-1.5 group-hover:scale-110">
                <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2.6} />
              </span>
            </Link>
          </StaggerItem>
        </Stagger>

        <Stagger as="ul" stagger={0.12} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((item, i) => (
            <BestsellerCard key={item.name} item={item} index={i} />
          ))}
        </Stagger>

        <Stagger>
          <StaggerItem as="h3" className="mt-14 font-[family-name:var(--font-baloo)] text-[1.5rem] font-bold text-[#211b18]">
            Browse the menu
          </StaggerItem>
          <Stagger as="ul" className="mt-4 grid grid-cols-2 gap-3 font-[family-name:var(--font-poppins)] lg:grid-cols-4 lg:gap-4">
            {MENU_GROUPS.map((group, i) => (
              <StaggerItem as="li" key={group.title} from={i % 2 ? "right" : "left"}>
                <Link
                  href={group.href}
                  className="group flex h-full items-center justify-between gap-3 rounded-2xl bg-[#fff1e0] p-4 ring-1 ring-[#f6dcc0] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f47514] hover:shadow-[0_16px_26px_-16px_rgba(200,85,10,.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f47514] sm:p-5"
                >
                  <span>
                    <span className="block font-[family-name:var(--font-baloo)] text-[1.15rem] leading-tight font-bold text-[#211b18] transition-colors group-hover:text-white sm:text-[1.3rem]">
                      {group.title}
                    </span>
                    <span className="mt-1 block text-[.78rem] text-[#77716c] transition-colors group-hover:text-white/85">
                      {group.count} items · from ₹{group.from}
                    </span>
                  </span>
                  <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-[#f47514] transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Stagger>
      </div>
    </section>
  );
}
