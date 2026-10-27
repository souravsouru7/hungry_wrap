"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useEffect } from "react";

import { useIntroDone } from "@/lib/intro";

import { FRESH_INGREDIENT_ASSETS as A } from "@/components/hungry-wrap/fresh-ingredients/assets";

type Piece = {
  asset: { src: string; width: number; height: number };
  /** Tailwind placement + size classes. */
  className: string;
  /** Parallax depth: higher moves further with the cursor. */
  depth: number;
  rotate: number;
  bob: { y: number; d: number; delay: number };
};

const PIECES: Piece[] = [
  { asset: A.tomatoSlices, className: "left-[4%] top-[14%] w-[clamp(4rem,9vw,8rem)]", depth: 34, rotate: -12, bob: { y: 10, d: 7, delay: 0 } },
  { asset: A.herbLeaves, className: "right-[6%] top-[10%] w-[clamp(3.5rem,8vw,7rem)]", depth: 22, rotate: 18, bob: { y: 12, d: 8.5, delay: -2 } },
  { asset: A.onionRings, className: "left-[12%] bottom-[14%] w-[clamp(3rem,6vw,5.5rem)] hidden md:block", depth: 48, rotate: 8, bob: { y: 8, d: 6.5, delay: -1 } },
  { asset: A.cucumber, className: "right-[13%] bottom-[16%] w-[clamp(2.8rem,5vw,4.5rem)] hidden md:block", depth: 40, rotate: -20, bob: { y: 9, d: 7.5, delay: -3 } },
  { asset: A.spiceFlecks, className: "left-[30%] top-[6%] w-[clamp(3rem,6vw,5rem)] hidden lg:block opacity-80", depth: 14, rotate: 0, bob: { y: 6, d: 9, delay: -4 } },
  { asset: A.lettuceFrill, className: "right-[28%] bottom-[8%] w-[clamp(3rem,6vw,5rem)] hidden lg:block", depth: 28, rotate: 24, bob: { y: 10, d: 8, delay: -5 } },
];

function Layer({ piece, mx, my }: { piece: Piece; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * piece.depth);
  const y = useTransform(my, (v) => v * piece.depth * 0.7);
  return (
    <motion.div style={{ x, y }} className={`absolute ${piece.className}`}>
      <div
        className="hw-fresh-float"
        style={
          {
            "--hw-fresh-float-y": `${piece.bob.y}px`,
            "--hw-fresh-float-r": "4deg",
            "--hw-fresh-float-d": `${piece.bob.d}s`,
            "--hw-fresh-float-delay": `${piece.bob.delay}s`,
          } as React.CSSProperties
        }
      >
        <Image
          src={piece.asset.src}
          alt=""
          width={piece.asset.width}
          height={piece.asset.height}
          sizes="128px"
          draggable={false}
          className="h-auto w-full select-none drop-shadow-[0_14px_18px_rgba(120,60,10,0.22)]"
          style={{ transform: `rotate(${piece.rotate}deg)` }}
        />
      </div>
    </motion.div>
  );
}

/** Fresh-ingredient cutouts floating around a hero, drifting with the cursor at different depths. */
export default function FloatingFood() {
  const reduce = useReducedMotion();
  const go = useIntroDone();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {PIECES.map((piece, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: -30 }}
          animate={go ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.5 + i * 0.09 }}
          className="absolute inset-0"
        >
          <Layer piece={piece} mx={mx} my={my} />
        </motion.div>
      ))}
    </div>
  );
}
