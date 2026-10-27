"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { useIntroDone } from "@/lib/intro";

type Line = { text: string; className?: string };

/**
 * Hero H1: each word rises out of a mask and un-skews in turn once the opening
 * story has lifted. The full sentence stays readable to screen readers.
 */
export default function HeroHeadline({ id, lines, className = "" }: { id: string; lines: Line[]; className?: string }) {
  const go = useIntroDone();
  let index = 0;

  return (
    <h1 id={id} aria-label={lines.map((l) => l.text).join(" ")} className={className}>
      {lines.map((line) => (
        <span key={line.text} aria-hidden className={`block ${line.className ?? ""}`}>
          {line.text.split(" ").map((word) => {
            const i = index++;
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", skewY: 10 }}
                  animate={go ? { y: "0%", skewY: 0 } : undefined}
                  transition={{ duration: 0.75, delay: 0.1 + i * 0.09, ease: [0.2, 0.75, 0.25, 1] }}
                >
                  {word}
                </motion.span>
                {" "}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/** Fades and lifts its content in after the headline, once the intro is done. */
export function IntroFade({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const go = useIntroDone();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={go ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.75, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
