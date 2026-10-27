"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** A thin orange bar across the very top that fills as the page is read. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-[linear-gradient(90deg,#fa9231,#f0790f)]"
    />
  );
}
