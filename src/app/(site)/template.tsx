"use client";

import { motion } from "motion/react";

/** Each inner page lifts and fades in on navigation. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.75, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
