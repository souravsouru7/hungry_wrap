"use client";

import { motion } from "motion/react";

/** A bar that draws itself left → right the first time it scrolls into view. */
export default function DrawLine({ className = "", duration = 0.6 }: { className?: string; duration?: number }) {
  return (
    <motion.span
      aria-hidden
      className={`block origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
    />
  );
}
