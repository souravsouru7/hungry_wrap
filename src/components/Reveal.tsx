"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scroll-reveal wrapper. Descendants opt in with `data-reveal`; they rise and
 * fade in, staggered, once the wrapper nears the viewport. Skipped entirely
 * under `prefers-reduced-motion`.
 */
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const context = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const media = gsap.matchMedia();

      media.add({ reduce: "(prefers-reduced-motion: reduce)" }, (match) => {
        if ((match.conditions as Record<string, boolean>).reduce) return;
        gsap.from(q("[data-reveal]"), {
          y: 26,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      });

      return () => media.revert();
    }, el);

    return () => context.revert();
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
