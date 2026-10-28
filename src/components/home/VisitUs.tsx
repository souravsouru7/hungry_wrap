import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Navigation } from "lucide-react";

import { BRAND_MARK } from "@/components/hungry-wrap/exact-hero/assets";
import InstagramGlyph from "@/components/InstagramGlyph";
import { SITE } from "@/lib/site";

import { Stagger, StaggerItem } from "./motion/Stagger";

const orderBtn =
  "inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-6 shadow-[0_12px_22px_-16px_rgba(93,30,0,.7)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none";

/** Address, hours and every way to order, in one place. */
export default function VisitUs() {
  return (
    <section id="visit" aria-labelledby="visit-heading" className="overflow-x-clip bg-[#fff1e0] py-16 sm:py-20 lg:py-24">
      <Stagger stagger={0.15} className="mx-auto grid max-w-7xl gap-5 px-5 font-[family-name:var(--font-poppins)] sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        <StaggerItem from="left" className="rounded-[1.75rem] bg-white p-7 shadow-[0_18px_32px_-26px_rgba(94,54,19,.5)] ring-1 ring-[#f6dcc0] sm:p-9">
          <p className="text-[.9rem] font-semibold tracking-wide text-[#f47514] uppercase">Visit us</p>
          <h2
            id="visit-heading"
            className="mt-2 font-[family-name:var(--font-baloo)] text-[clamp(2rem,3.6vw,3rem)] leading-[1] font-extrabold tracking-[-.04em] text-[#211b18]"
          >
            Right by Vasudev Nagar Metro
          </h2>

          <p className="mt-5 flex gap-3 text-[.95rem] leading-relaxed text-[#5b514a]">
            <MapPin aria-hidden className="mt-0.5 h-5 w-5 shrink-0 animate-bounce text-[#f47514] [animation-duration:2s] motion-reduce:animate-none" />
            {SITE.address}
          </p>

          <div className="mt-5 flex gap-3">
            <Clock aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#f47514]" />
            <ul className="w-full space-y-1.5 text-[.92rem]">
              {SITE.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4 rounded-xl bg-[#fff9f2] px-4 py-2 transition-colors hover:bg-[#fff1e0]">
                  <span className="text-[#5b514a]">{h.days}</span>
                  <span className="font-semibold text-[#211b18]">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={SITE.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#211b18] px-6 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f47514]"
            >
              <Navigation aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              Get directions
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-[#211b18] ring-2 ring-[#ecdccb] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fff9f2]"
            >
              Contact us
            </Link>
          </div>
        </StaggerItem>

        <StaggerItem
          from="right"
          className="relative isolate flex flex-col justify-center gap-3 overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_24px_40px_-26px_rgba(200,85,10,.8)] sm:p-9"
        >
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(140deg, #fa9231 0%, #ee700c 100%)" }} />
          <Image
            src={BRAND_MARK.src}
            alt=""
            width={BRAND_MARK.width}
            height={BRAND_MARK.height}
            sizes="160px"
            className="hw-home-float pointer-events-none absolute -top-2 -right-4 w-32 opacity-90 [--r:12deg] sm:w-40"
          />
          <h3 className="relative max-w-[70%] font-[family-name:var(--font-baloo)] text-[clamp(1.8rem,3vw,2.5rem)] leading-[1] font-extrabold tracking-[-.03em]">
            Hungry right now?
          </h3>
          <p className="relative text-[.95rem] text-white/90">Get it delivered hot from your favourite app.</p>
          <div className="relative mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a href={SITE.links.swiggy} target="_blank" rel="noopener noreferrer" aria-label="Order on Swiggy" className={`${orderBtn} focus-visible:outline-white`}>
              <Image src="/brand/swiggy.png" alt="" width={336} height={101} sizes="128px" className="h-8 w-auto" />
            </a>
            <a href={SITE.links.zomato} target="_blank" rel="noopener noreferrer" aria-label="Order on Zomato" className={`${orderBtn} focus-visible:outline-white`}>
              <Image src="/brand/zomato.png" alt="" width={265} height={60} sizes="128px" className="h-7 w-auto" />
            </a>
          </div>
          <a
            href={SITE.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-2 inline-flex items-center gap-2 self-start font-semibold text-white underline-offset-4 hover:underline"
          >
            <InstagramGlyph className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
            Follow @thehungrywrap
          </a>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
