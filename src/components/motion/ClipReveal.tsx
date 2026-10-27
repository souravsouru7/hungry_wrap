"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Wipes its content in through a clip-path the first time it scrolls into view. */
export default function ClipReveal({
  children,
  className = "",
  from = "left",
}: {
  children: ReactNode;
  className?: string;
  from?: "left" | "bottom";
}) {
  const reduce = useReducedMotion();
  const hidden = from === "left" ? "inset(0% 100% 0% 0% round 1.75rem)" : "inset(100% 0% 0% 0% round 1.75rem)";
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: hidden, scale: 1.08 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.75rem)", scale: 1 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
