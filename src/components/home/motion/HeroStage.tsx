"use client";

import Image from "next/image";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { useEffect, useRef, useState } from "react";

import type { HeroAsset } from "@/components/hungry-wrap/exact-hero/assets";
import { useIntroDone } from "@/lib/intro";

import { HOME_ASSETS as A } from "../assets";

type Cutout = {
  asset: HeroAsset;
  className: string;
  /** How far it travels with the cursor (px at the screen edge). */
  depth: number;
  /** Extra upward drift over the hero's scroll range (px). */
  drift: number;
  /** Where it bursts out from, relative to its resting spot (% of its own size). */
  burst: { x: string; y: string };
  rotate: number;
  delay: number;
};

const CUTOUTS: Cutout[] = [
  { asset: A.tomatoCluster, className: "top-[2%] left-[2%] w-[24%]", depth: 26, drift: -140, burst: { x: "120%", y: "120%" }, rotate: -8, delay: 0.35 },
  { asset: A.herbCluster, className: "top-[6%] right-0 w-[21%]", depth: 34, drift: -200, burst: { x: "-130%", y: "120%" }, rotate: 12, delay: 0.45 },
  { asset: A.onionCluster, className: "bottom-[4%] left-[6%] w-[20%]", depth: 40, drift: -90, burst: { x: "120%", y: "-120%" }, rotate: 6, delay: 0.55 },
];

function useParallax(mouse: MotionValue<number>, scroll: MotionValue<number>, depth: number, drift: number) {
  return useTransform([mouse, scroll], ([m, s]: number[]) => m * depth + s * drift);
}

function CutoutLayer({ c, mx, my, progress, go }: { c: Cutout; mx: MotionValue<number>; my: MotionValue<number>; progress: MotionValue<number>; go: boolean }) {
  const x = useParallax(mx, progress, c.depth, 0);
  const y = useParallax(my, progress, c.depth * 0.7, c.drift);
  return (
    <motion.div style={{ x, y }} className={`absolute ${c.className}`}>
      <motion.div
        initial={{ x: c.burst.x, y: c.burst.y, scale: 0.2, opacity: 0, rotate: c.rotate - 90 }}
        animate={go ? { x: 0, y: 0, scale: 1, opacity: 1, rotate: c.rotate } : undefined}
        transition={{ type: "spring", stiffness: 90, damping: 12, delay: c.delay }}
      >
        <Image src={c.asset.src} alt="" width={c.asset.width} height={c.asset.height} sizes="140px" draggable={false} className="hw-home-float h-auto w-full select-none" />
      </motion.div>
    </motion.div>
  );
}

/**
 * The hero's product shot. After the intro the disc swells in, the wrap drops
 * onto it and the ingredients burst outward; then the layers drift apart as you
 * scroll and lean toward the cursor on desktop.
 */
export default function HeroStage({ rollsFrom }: { rollsFrom: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const go = useIntroDone();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  const wrapX = useParallax(mx, progress, -14, 0);
  const wrapY = useParallax(my, progress, -10, -120);
  const wrapRotate = useTransform(progress, [0, 1], [-6, 6]);
  const discScale = useTransform(progress, [0, 1], [1, 1.12]);
  const discX = useParallax(mx, progress, 8, 0);
  const discY = useParallax(my, progress, 6, 40);

  const [count, setCount] = useState(rollsFrom);
  useEffect(() => {
    if (!go || reduce) return;
    const controls = animate(0, rollsFrom, { duration: 1.1, delay: 0.9, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => setCount(Math.round(v)) });
    return () => controls.stop();
  }, [go, reduce, rollsFrom]);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[25rem] sm:max-w-[32rem] lg:max-w-[36rem]">
      <motion.div aria-hidden style={{ x: discX, y: discY, scale: discScale }} className="absolute inset-[7%]">
        <motion.div
          className="h-full w-full rounded-full shadow-[0_40px_70px_-35px_rgba(200,85,10,0.65)]"
          style={{ background: "radial-gradient(circle at 38% 32%, #ffc27a 0%, #fa9231 45%, #ee700c 100%)" }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={go ? { scale: 1, opacity: 1 } : undefined}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute inset-[2%] rounded-full border-2 border-dashed border-[#f6a66d]/70"
        initial={{ rotate: -120, opacity: 0 }}
        animate={go ? (reduce ? { opacity: 1, rotate: 0 } : { rotate: [0, 360], opacity: 1 }) : undefined}
        transition={{ rotate: { duration: 60, ease: "linear", repeat: reduce ? 0 : Infinity }, opacity: { duration: 0.8 } }}
      />

      {CUTOUTS.map((c) => (
        <CutoutLayer key={c.asset.src} c={c} mx={mx} my={my} progress={progress} go={go} />
      ))}

      <motion.div style={{ x: wrapX, y: wrapY, rotate: wrapRotate }} className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[74%]"
          initial={{ y: -160, rotate: -40, scale: 0.7, opacity: 0 }}
          animate={go ? { y: 0, rotate: 0, scale: 1, opacity: 1 } : undefined}
          transition={{ type: "spring", stiffness: 70, damping: 11, delay: 0.15 }}
          whileHover={reduce ? undefined : { scale: 1.04, rotate: 3 }}
        >
          <Image
            src={A.wrap.src}
            alt={A.wrap.alt}
            width={A.wrap.width}
            height={A.wrap.height}
            sizes="(max-width: 640px) 75vw, (max-width: 1024px) 26rem, 30rem"
            preload
            draggable={false}
            className="h-auto w-full select-none drop-shadow-[0_30px_30px_rgba(110,45,5,0.35)]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute right-[2%] bottom-[10%]"
        initial={{ scale: 0, rotate: -20 }}
        animate={go ? { scale: 1, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.85 }}
      >
        <Link
          href="/menu#veg-rolls"
          className="block rounded-2xl bg-white px-4 py-3 text-left font-[family-name:var(--font-poppins)] shadow-[0_18px_30px_-18px_rgba(90,55,20,0.6)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-2"
        >
          <span className="block text-[.72rem] font-medium text-[#77716c]">Rolls from</span>
          <span className="block font-[family-name:var(--font-baloo)] text-2xl leading-none font-extrabold text-[#f47514] tabular-nums">₹{count}</span>
        </Link>
      </motion.div>
    </div>
  );
}
