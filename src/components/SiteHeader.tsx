"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { useIntroDone } from "@/lib/intro";
import { BRAND_MARK } from "@/components/hungry-wrap/exact-hero/assets";
import { NAV_LINKS, ORDER_HREF, SITE } from "@/lib/site";

/** The little takeaway-bag glyph that sits inside the orange CTAs. */
export function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <path
        d="M4.5 8h15l-1.3 11.1a2 2 0 0 1-2 1.9H7.8a2 2 0 0 1-2-1.9L4.5 8Z"
        fill="currentColor"
      />
      <path
        d="M8.5 9V6.2a3.5 3.5 0 0 1 7 0V9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const CTA_BG = "linear-gradient(180deg, #fa9231 0%, #f0790f 100%)";

/**
 * Sitewide navbar: lockup on the left, route links in the centre, orange pill
 * CTA on the right. Below `xl` the links collapse into a disclosure panel so
 * the bar stays a single row.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const go = useIntroDone();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="hw-nav sticky top-0 z-50"
      initial={{ y: -90, opacity: 0 }}
      animate={go ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.6, ease: [0.2, 0.75, 0.25, 1] }}
    >
      <div
        className="rounded-b-[2rem] bg-white/[0.97] transition-shadow duration-500 sm:rounded-b-[2.5rem]"
        style={{
          boxShadow: scrolled
            ? "0 22px 44px -22px rgba(90, 55, 20, 0.55)"
            : "0 18px 40px -28px rgba(90, 55, 20, 0.45)",
        }}
      >
        <div
          className={`flex items-center justify-between gap-4 px-5 transition-[padding] duration-500 sm:px-8 lg:px-[4vw] ${
            scrolled ? "py-1.5" : "py-3"
          }`}
        >
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${SITE.name} home`}>
            <Image
              src={BRAND_MARK.src}
              alt=""
              width={BRAND_MARK.width}
              height={BRAND_MARK.height}
              sizes="80px"
              className={`h-auto select-none transition-[width] duration-500 ${
                scrolled ? "w-[46px] sm:w-[54px]" : "w-[54px] sm:w-[64px]"
              }`}
              loading="eager"
              fetchPriority="high"
              draggable={false}
            />
            <span
              className={`font-[family-name:var(--font-baloo)] leading-[.85] font-extrabold tracking-[-.03em] text-[#f47514] transition-[font-size] duration-500 ${
                scrolled ? "text-[1.2rem] sm:text-[1.4rem]" : "text-[1.35rem] sm:text-[1.6rem]"
              }`}
            >
              The Hungry
              <span className="mt-0.5 block text-[#211b18]">Wrap</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-7 font-[family-name:var(--hw-font-ui)] text-[0.95rem] font-medium text-[#3a2c23]">
              {NAV_LINKS.map(({ label, href }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className="group relative inline-block py-1 transition-colors hover:text-[var(--hw-orange)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hw-orange)] aria-[current=page]:text-[var(--hw-orange)]"
                    >
                      {label}
                      <span
                        className={`absolute -bottom-1 left-0 h-[3px] rounded-full bg-[var(--hw-orange)] transition-all duration-300 ${
                          active ? "w-full" : "w-0 group-hover:w-full group-focus-visible:w-full"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={ORDER_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full px-6 py-3 font-[family-name:var(--hw-font-ui)] text-[0.95rem] font-semibold text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-12px_rgba(224,106,16,0.75)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hw-orange)] motion-reduce:transition-none sm:inline-flex lg:px-8 lg:py-3.5"
              style={{ background: CTA_BG }}
            >
              Order Now
              <BagIcon className="h-[18px] w-[18px]" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="hw-mobile-nav"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--hw-cream)] text-[#3a2c23] xl:hidden"
            >
              <span className="sr-only">Toggle menu</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav id="hw-mobile-nav" aria-label="Primary" className="border-t border-[#f0e0cc] px-5 pb-5 pt-3 xl:hidden">
            <ul className="flex flex-col gap-1 font-[family-name:var(--hw-font-ui)] text-base font-medium text-[#3a2c23]">
              {NAV_LINKS.map(({ label, href }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-3 py-2.5 ${active ? "bg-[var(--hw-cream)] text-[var(--hw-orange)]" : ""}`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
              <li className="sm:hidden">
                <a
                  href={ORDER_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white"
                  style={{ background: CTA_BG }}
                >
                  Order Now
                  <BagIcon className="h-[18px] w-[18px]" />
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </motion.header>
  );
}
