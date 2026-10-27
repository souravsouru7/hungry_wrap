"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wipes its content in through a clip-path the first time it scrolls into view.
 * The in-view check sits on an unclipped wrapper: an element fully hidden by
 * its own clip-path never counts as intersecting, so it would never reveal.
 */
export default function ClipReveal({
  children,
  className = "",
  from = "left",
}: {
  children: ReactNode;
  className?: string;
  from?: "left" | "bottom";
}) {
  const hidden = from === "left" ? "inset(0% 100% 0% 0% round 1.75rem)" : "inset(100% 0% 0% 0% round 1.75rem)";
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.div
        className="h-full w-full"
        variants={{
          hidden: { clipPath: hidden, scale: 1.08 },
          show: { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", scale: 1, transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
