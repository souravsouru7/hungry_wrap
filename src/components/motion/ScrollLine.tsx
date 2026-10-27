"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

/**
 * A vertical rail that fills orange as the visitor scrolls through its parent.
 * Place it inside a `relative` container; it stretches to that container's height.
 */
export default function ScrollLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref} aria-hidden className={`absolute top-0 bottom-0 w-[3px] rounded-full bg-[#f47514]/15 ${className}`}>
      <motion.div className="h-full w-full origin-top rounded-full bg-[#f47514]" style={{ scaleY: reduce ? 1 : scaleY }} />
    </div>
  );
}
