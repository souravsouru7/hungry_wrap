"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

import { BagIcon } from "@/components/SiteHeader";

const BG = "linear-gradient(180deg, #fa9231 0%, #f0790f 100%)";

/**
 * Orange pill CTA with a magnetic pull toward the cursor. Opens externally
 * (WhatsApp) unless `external` is false.
 */
export default function CtaButton({
  href,
  children,
  external = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y, background: BG }}
      whileTap={{ scale: 0.95 }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-[family-name:var(--font-poppins)] text-[0.95rem] font-semibold text-white shadow-[0_14px_26px_-14px_rgba(224,106,16,0.8)] transition-shadow duration-300 hover:shadow-[0_22px_34px_-12px_rgba(224,106,16,0.85)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f47514] ${className}`}
    >
      {children}
      <BagIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
    </motion.a>
  );
}
