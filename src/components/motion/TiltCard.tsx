"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

/**
 * A card that tilts toward the pointer in 3D with a sheen that follows it.
 * Pure decoration: content is identical with or without the effect.
 */
export default function TiltCard({
  children,
  className = "",
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const sheenX = useTransform(px, (v) => `${v * 100}%`);
  const sheenY = useTransform(py, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.55), transparent 55%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className={`group/tilt relative h-full ${className}`}
      >
        {children}
        <motion.span
          aria-hidden
          style={{ background: sheen }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        />
      </motion.div>
    </div>
  );
}
