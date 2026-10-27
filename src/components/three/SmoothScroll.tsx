"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { INTRO_DONE_EVENT, isIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** The live Lenis instance, or null under reduced motion / on the landing page. */
export function getLenis() {
  return instance;
}

/** Scrolls to an element, through Lenis when it is running so the glide matches. */
export function scrollToElement(el: HTMLElement, offset = -120) {
  if (instance) {
    instance.scrollTo(el, { offset });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Inertial scrolling for the inner pages. Lenis is driven from GSAP's ticker
 * so ScrollTrigger and every scroll-scrubbed 3D scene read the same frame.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ignoreMobileResize: the address bar collapsing must not force a full
    // ScrollTrigger re-measure mid-scroll, which is what makes sticky 3D jump.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 0.9,
      // Touch scrolling stays native: smoothing it costs frames and feels laggy.
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    // Hold the page still while the opening story plays.
    const resume = () => lenis.start();
    if (!isIntroDone()) {
      lenis.stop();
      window.addEventListener(INTRO_DONE_EVENT, resume, { once: true });
    }
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, resume);
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
