"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { useRef } from "react";

const ITEMS = ["Kathi Rolls", "Steamy Momos", "₹11 Chai", "Kurkura Momos", "Bun Maska", "Masala Maggie", "Cold Coffee"];

/**
 * A tilted orange ribbon of menu names that loops forever, runs faster (and
 * reverses) with scroll speed, and slows to a stop while hovered.
 */
export default function Marquee() {
  const reduce = useReducedMotion();
  const offset = useMotionValue(0);
  const hovered = useRef(false);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const direction = useRef(1);

  // The track holds the list twice; wrapping at -50% makes the loop seamless.
  const x = useTransform(offset, (v) => `${(((v % 50) + 50) % 50) - 50}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || hovered.current) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    offset.set(offset.get() + direction.current * (delta / 1000) * (2.2 + Math.abs(b) * 2.2));
  });

  const list = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative z-10 -my-6 -rotate-2 overflow-hidden py-3.5 shadow-[0_18px_30px_-18px_rgba(200,85,10,0.7)] sm:-my-8"
      style={{ background: "linear-gradient(90deg, #f0790f 0%, #fa9231 50%, #f0790f 100%)" }}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
      aria-hidden
    >
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {list.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex items-center gap-6 px-6 font-[family-name:var(--font-baloo)] text-[clamp(1.3rem,2.6vw,2rem)] leading-none font-extrabold tracking-[-.02em] text-white"
              >
                {item}
                <span className="text-[#ffe0b8]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
