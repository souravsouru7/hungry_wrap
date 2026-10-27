"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const TAGS = { div: motion.div, ul: motion.ul, ol: motion.ol, header: motion.header } as const;

/**
 * Plays its `StaggerItem` children in one after another the first time it
 * scrolls into view. Everything is visible in the server HTML; only the
 * entrance is animated.
 */
export function Stagger({
  as = "div",
  children,
  className = "",
  stagger = 0.09,
  delay = 0,
}: {
  as?: keyof typeof TAGS;
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  );
}

const ITEM_TAGS = { div: motion.div, li: motion.li, p: motion.p, h2: motion.h2, h3: motion.h3 } as const;

/** One step of a `Stagger`: rises in, optionally sliding from a side or tilting. */
export function StaggerItem({
  as = "div",
  children,
  className = "",
  from = "below",
  tilt = 0,
  id,
}: {
  as?: keyof typeof ITEM_TAGS;
  children: ReactNode;
  className?: string;
  from?: "below" | "left" | "right";
  tilt?: number;
  id?: string;
}) {
  const Tag = ITEM_TAGS[as];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: from === "left" ? -60 : from === "right" ? 60 : 0,
      y: from === "below" ? 44 : 0,
      rotate: tilt,
      scale: 0.96,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.9 },
    },
  };
  return (
    <Tag id={id} className={className} variants={variants}>
      {children}
    </Tag>
  );
}

/** Pops a single element in from an arbitrary starting pose when it scrolls into view. */
export function Pop({
  children,
  className = "",
  from,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  from: { x?: number; y?: number; rotate?: number; scale?: number; opacity?: number };
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 110, damping: 14, delay }}
    >
      {children}
    </motion.div>
  );
}
