"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/reduced-motion";

import { useIntroDone } from "@/lib/intro";

/**
 * Page H1: each word rises and un-skews in turn, then the orange accent lands
 * last with a squash-and-stretch bounce.
 */
export default function SplitHeadline({ title, accent }: { title: string; accent?: string }) {
  const reduce = useReducedMotion();
  // Wait for the opening story to lift so the headline plays in view.
  const go = useIntroDone();
  const words = title.split(" ");

  if (reduce) {
    return (
      <h1 className="mt-3 font-[family-name:var(--font-baloo)] text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-[#211b18]">
        {title} {accent && <span className="hw-menu-accent">{accent}</span>}
      </h1>
    );
  }

  return (
    <h1
      aria-label={accent ? `${title} ${accent}` : title}
      className="mt-3 font-[family-name:var(--font-baloo)] text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-[#211b18]"
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", skewY: 8, opacity: 0 }}
            animate={go ? { y: "0%", skewY: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.2, 0.75, 0.25, 1] }}
          >
            {word}
          </motion.span>
          &nbsp;
        </span>
      ))}
      {accent && (
        <motion.span
          aria-hidden
          className="hw-menu-accent inline-block origin-bottom"
          initial={{ y: -60, scaleY: 1.25, scaleX: 0.85, opacity: 0 }}
          animate={go ? { y: [-60, 0, 0, 0], scaleY: [1.25, 0.78, 1.08, 1], scaleX: [0.85, 1.18, 0.96, 1], opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.25 + words.length * 0.08, times: [0, 0.45, 0.7, 1], ease: "easeOut" }}
        >
          {accent}
        </motion.span>
      )}
    </h1>
  );
}
