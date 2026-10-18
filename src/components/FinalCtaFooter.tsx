"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowRight, Camera, ChefHat, Heart, Leaf, MessageCircle, Play, Smile, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** The copyright year never changes while the page is open. */
const subscribeToNothing = () => () => {};

type NavLink = { label: string; href: string };
type SocialLink = { platform: string; href: string };

type FinalCtaFooterProps = {
  logoSrc?: string;
  orderHref: string;
  navLinks?: NavLink[];
  socialLinks?: SocialLink[];
  onSubscribe?: (email: string) => Promise<void>;
};

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Specials", href: "#specials" },
  { label: "Contact Us", href: "#contact" },
];

const SOCIALS = ["Instagram", "Facebook", "YouTube", "WhatsApp"] as const;

function SocialGlyph({ platform }: { platform: string }) {
  const normalized = platform.toLowerCase();
  if (normalized === "instagram") return <Camera aria-hidden className="h-4 w-4" strokeWidth={2.5} />;
  if (normalized === "youtube") return <Play aria-hidden className="h-4 w-4 fill-current" strokeWidth={2.5} />;
  if (normalized === "whatsapp") return <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2.5} />;
  return <span aria-hidden className="font-[family-name:var(--font-poppins)] text-base font-bold leading-none">f</span>;
}

function Benefit({ icon, label, tone = "yellow" }: { icon: ReactNode; label: ReactNode; tone?: "yellow" | "coral" }) {
  return (
    // A div, not an li: every caller already wraps this in its own <li>, and
    // an <li> inside an <li> is invalid HTML that React fails hydration on.
    <div className="flex min-w-[5rem] flex-col items-center gap-2 text-center font-[family-name:var(--font-poppins)] text-[.72rem] leading-[1.15] font-semibold text-white sm:text-[.8rem]">
      <span className={`flex h-11 w-11 items-center justify-center rounded-full shadow-[0_8px_12px_-8px_rgba(81,28,0,.5)] ${tone === "coral" ? "bg-[#f14c43]" : "bg-[#ffb31a]"}`}>
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

/**
 * The final orange CTA and site footer. URLs and subscription delivery remain
 * caller-owned: no social destination or subscription success is fabricated.
 */
export default function FinalCtaFooter({
  logoSrc = "/assets/hero/01_logo_lockup.png",
  orderHref,
  navLinks = DEFAULT_NAV_LINKS,
  socialLinks = [],
  onSubscribe,
}: FinalCtaFooterProps) {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Client-only read. `cacheComponents` prerenders this page, so a clock read
  // during render would bake the year into the build output and go stale on
  // New Year. The server snapshot is null and only the client reads the date,
  // which keeps the year current without an effect writing state back.
  const year = useSyncExternalStore(
    subscribeToNothing,
    () => new Date().getFullYear(),
    () => null,
  );

  useIsomorphicLayoutEffect(() => {
    const footer = root.current;
    if (!footer) return;

    const context = gsap.context(() => {
      const q = gsap.utils.selector(footer);
      const media = gsap.matchMedia();

      media.add({ reduce: "(prefers-reduced-motion: reduce)" }, (match) => {
        if ((match.conditions as Record<string, boolean>).reduce) return;
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: footer, start: "top 78%", once: true },
          })
          .from(q("[data-footer-cta]"), { autoAlpha: 0, y: 24, duration: 0.72, stagger: 0.1 })
          .from(q("[data-footer-benefit]"), { autoAlpha: 0, scale: 0.78, duration: 0.55, stagger: 0.07 }, 0.24);
      });

      return () => media.revert();
    }, footer);

    return () => context.revert();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    if (!onSubscribe) {
      setStatus("Email subscription is not connected yet.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus("");
      await onSubscribe(email);
      setStatus("Thanks — please check your inbox for confirmation.");
      setEmail("");
    } catch {
      setStatus("We couldn’t subscribe that email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialByPlatform = new Map(socialLinks.map((link) => [link.platform.toLowerCase(), link.href]));

  return (
    <footer ref={root} className="hw-final-footer overflow-hidden bg-[#fff9f1] text-[#211b18]">
      <section aria-labelledby="final-cta-heading" className="relative isolate overflow-hidden bg-[linear-gradient(105deg,#ff7308_0%,#fa7510_55%,#f76a07_100%)] py-20 sm:py-24 lg:py-20">
        <svg aria-hidden="true" viewBox="0 0 2048 125" preserveAspectRatio="none" className="hw-section-wave pointer-events-none absolute inset-x-0 top-0 h-[clamp(3rem,6vw,7rem)] w-full -translate-y-px">
          <path d="M0 0H2048V31C1682 108 1265 17 911 92C564 166 231 66 0 112V0Z" fill="#fff9f1" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 2048 125" preserveAspectRatio="none" className="hw-section-wave pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(3rem,6vw,7rem)] w-full translate-y-px">
          <path d="M0 13C298 78 568 16 906 70C1280 130 1632 35 2048 67V125H0V13Z" fill="#fff9f1" />
        </svg>

        <div className="relative z-10 mx-auto grid max-w-[1720px] grid-cols-1 items-center gap-10 px-5 pt-[clamp(2rem,5vw,4rem)] pb-[clamp(2rem,5vw,4rem)] sm:px-8 lg:grid-cols-[minmax(16rem,1fr)_auto_minmax(31rem,1.55fr)] lg:gap-12 lg:px-12">
          <div data-footer-cta className="text-center lg:text-left">
            <h2 id="final-cta-heading" className="font-[family-name:var(--font-baloo)] text-[clamp(2.35rem,4vw,4.35rem)] leading-[.95] font-extrabold italic tracking-[-.05em] text-white drop-shadow-[0_3px_0_rgba(200,74,0,.23)]">
              Ready to Satisfy<br />Your Hunger?
            </h2>
          </div>

          <div data-footer-cta className="relative flex justify-center">
            <svg aria-hidden="true" viewBox="0 0 125 67" className="absolute right-[88%] top-1/2 hidden w-28 -translate-y-1/2 text-white/85 xl:block" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 37c29 15 65 18 94 1" />
              <path d="m83 21 18 17-22 11" />
            </svg>
            <a href={orderHref} className="group inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-white px-10 font-[family-name:var(--font-poppins)] text-[1.08rem] font-bold text-[#f47514] shadow-[0_14px_24px_-14px_rgba(93,30,0,.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_29px_-16px_rgba(93,30,0,.72)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white">
              Order Now
              <Sparkles aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
            </a>
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-4 lg:justify-items-center">
            <li data-footer-benefit><Benefit icon={<Leaf aria-hidden className="h-5 w-5 text-white" fill="currentColor" />} label={<>Fresh<br />Ingredients</>} /></li>
            <li data-footer-benefit><Benefit icon={<ChefHat aria-hidden className="h-5 w-5 text-white" />} label={<>Bold<br />Flavors</>} /></li>
            <li data-footer-benefit><Benefit icon={<Heart aria-hidden className="h-5 w-5 text-white" fill="currentColor" />} label={<>Made to<br />Satisfy You</>} tone="coral" /></li>
            <li data-footer-benefit><Benefit icon={<Smile aria-hidden className="h-5 w-5 text-[#2f241b]" />} label={<>Always<br />Delicious</>} /></li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-[1720px] px-5 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_.72fr_.9fr_1.25fr] lg:gap-12">
          <section aria-label="The Hungry Wrap brand" className="max-w-[20rem]">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#ffead4] p-2 shadow-[inset_0_0_0_1px_rgba(244,117,20,.08)]">
                <Image src={logoSrc} alt="The Hungry Wrap" width={1883} height={538} sizes="64px" className="h-auto w-full object-contain" />
              </span>
              <div className="font-[family-name:var(--font-baloo)] leading-[.85] tracking-[-.04em]">
                <p className="text-[1.4rem] font-extrabold text-[#f47514]">The Hungry</p>
                <p className="mt-1 text-[1.8rem] font-extrabold text-[#211b18]">Wrap</p>
              </div>
            </div>
            <p className="mt-4 font-[family-name:var(--font-poppins)] text-[.82rem] leading-relaxed text-[#77716c]">Wraps so good, you&apos;ll come back for more!</p>
          </section>

          <nav aria-label="Footer navigation">
            <h3 className="font-[family-name:var(--font-baloo)] text-[1.15rem] font-bold">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 font-[family-name:var(--font-poppins)] text-[.9rem] font-medium text-[#77716c]">
              {navLinks.map(({ label, href }) => <li key={label}><a href={href} className="decoration-[#f47514] decoration-2 underline-offset-4 transition hover:text-[#f47514] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47514]">{label}</a></li>)}
            </ul>
          </nav>

          <section aria-labelledby="footer-connect-heading">
            <h3 id="footer-connect-heading" className="font-[family-name:var(--font-baloo)] text-[1.15rem] font-bold">Connect With Us</h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {SOCIALS.map((platform) => {
                const href = socialByPlatform.get(platform.toLowerCase());
                const colors: Record<string, string> = {
                  Instagram: "bg-[linear-gradient(135deg,#ef6d53,#ff9e35)] text-white",
                  Facebook: "bg-[#5e5b5a] text-white",
                  YouTube: "bg-white text-[#ef4e38] ring-1 ring-[#f0e4d9]",
                  WhatsApp: "bg-[#61b94f] text-white",
                };
                const className = `inline-flex h-10 w-10 items-center justify-center rounded-full transition duration-300 hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f47514] ${colors[platform]}`;
                return <li key={platform}>{href ? <a href={href} className={className} aria-label={platform}><SocialGlyph platform={platform} /></a> : <span className={`${className} cursor-not-allowed opacity-55`} aria-label={`${platform} link not configured`} aria-disabled="true" title={`${platform} link not configured`}><SocialGlyph platform={platform} /></span>}</li>;
              })}
            </ul>
          </section>

          <section aria-labelledby="footer-subscribe-heading">
            <h3 id="footer-subscribe-heading" className="font-[family-name:var(--font-baloo)] text-[1.15rem] font-bold">Subscribe for Updates</h3>
            <p className="mt-3 font-[family-name:var(--font-poppins)] text-[.88rem] leading-relaxed text-[#77716c]">Get the latest offers and new menu items.</p>
            <form className="mt-4" onSubmit={submit} noValidate>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="flex min-h-13 items-center rounded-full bg-white p-1.5 shadow-[0_8px_20px_-15px_rgba(70,45,26,.45)] ring-1 ring-[#f0e5da] focus-within:ring-2 focus-within:ring-[#f47514]">
                <input id="footer-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-4 font-[family-name:var(--font-poppins)] text-[.88rem] text-[#211b18] outline-none placeholder:text-[#a39a93]" />
                <button type="submit" disabled={isSubmitting} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f47514] text-white shadow-[0_7px_13px_-7px_rgba(184,70,0,.75)] transition hover:scale-105 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f47514]" aria-label="Subscribe to updates">
                  <ArrowRight aria-hidden className="h-5 w-5" strokeWidth={2.8} />
                </button>
              </div>
              <p aria-live="polite" className="mt-2 min-h-5 font-[family-name:var(--font-poppins)] text-xs text-[#77716c]">{status}</p>
            </form>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#e8e1da] pt-6 font-[family-name:var(--font-poppins)] text-[.78rem] font-medium text-[#77716c] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year ?? "    "} The Hungry Wrap. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Good Food Moves You. <Heart aria-hidden className="h-3.5 w-3.5 fill-[#f47514] text-[#f47514]" /></p>
        </div>
      </div>
    </footer>
  );
}

export type { FinalCtaFooterProps, NavLink, SocialLink };
