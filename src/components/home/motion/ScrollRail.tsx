"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { useRef, type ReactNode } from "react";

/**
 * Wraps the "how it's made" steps with an orange rail that fills as the
 * visitor scrolls through them: horizontal across the cards on desktop,
 * vertical down the left edge on mobile.
 */
export default function ScrollRail({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const value = reduce ? 1 : fill;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div aria-hidden className="absolute top-[calc(1.25rem-2px)] right-[16%] left-[16%] hidden h-1 rounded-full bg-[#f47514]/15 md:block">
        <motion.div style={{ scaleX: value }} className="h-full origin-left rounded-full bg-[#f47514]" />
      </div>
      <div aria-hidden className="absolute top-6 bottom-6 left-[1.4rem] w-1 rounded-full bg-[#f47514]/15 md:hidden">
        <motion.div style={{ scaleY: value }} className="h-full origin-top rounded-full bg-[#f47514]" />
      </div>
      {children}
    </div>
  );
}
