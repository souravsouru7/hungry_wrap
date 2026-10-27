"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Wipes its content in from the left the first time it enters the viewport,
 * then slowly zooms out and drifts it while it crosses the screen.
 *
 * The in-view check sits on an unclipped wrapper: an element fully hidden by
 * its own clip-path never counts as intersecting, so it would never reveal.
 */
export default function ParallaxZoom({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.div ref={ref} className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      <motion.div
        className="h-full w-full overflow-hidden rounded-[inherit]"
        variants={{
          hidden: { clipPath: "inset(0% 100% 0% 0% round 1.75rem)" },
          show: { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", transition: { duration: 1, ease: [0.65, 0, 0.35, 1] } },
        }}
      >
        <motion.div style={reduce ? undefined : { scale, y }} className="h-full w-full">
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
