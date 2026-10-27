"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { HERO_ASSETS } from "@/components/hungry-wrap/exact-hero/assets";
import { FRESH_INGREDIENT_ASSETS as F } from "@/components/hungry-wrap/fresh-ingredients/assets";
import { markIntroDone, useIntroDone } from "@/lib/intro";

/**
 * The opening story, told in one wrap: a craving, the fresh fillings landing on
 * a warm tortilla, the roll, the brand. It doubles as the loader — the curtain
 * only lifts once the story has had its moment and the page has finished
 * loading, and never later than MAX_MS.
 */

const CHAPTERS = [
  "Every great cafe starts with a simple craving…",
  "Fresh ingredients, prepped every morning…",
  "Rolled to order. Just for you.",
];

const FILLINGS = [
  { asset: F.lettuce, x: "-28%", y: "-6%", r: -14, w: "46%", at: 1 },
  { asset: F.tomatoSlices, x: "24%", y: "-14%", r: 12, w: "36%", at: 1 },
  { asset: F.chicken, x: "-6%", y: "10%", r: 6, w: "42%", at: 2 },
  { asset: F.onionRings, x: "26%", y: "16%", r: -8, w: "30%", at: 2 },
];

// stage 0: tortilla · 1–2: fillings drop · 3: roll → wrap · 4: brand · 5: exit
const TIMELINE = [0, 650, 1150, 1800, 2500];
const MIN_MS = 3200;
const MAX_MS = 6500;

function pageLoaded() {
  return new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
}

export default function IntroLoader() {
  const done = useIntroDone();
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (done) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const timers = TIMELINE.slice(1).map((ms, i) => window.setTimeout(() => setStage(i + 1), ms));
    const minWait = new Promise((r) => window.setTimeout(r, MIN_MS));
    const maxWait = new Promise((r) => window.setTimeout(r, MAX_MS));
    let cancelled = false;
    Promise.race([Promise.all([minWait, pageLoaded(), document.fonts?.ready]), maxWait]).then(() => {
      if (!cancelled) setLeaving(true);
    });

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      root.style.overflow = prevOverflow;
    };
  }, [done]);

  if (done) return null;

  const rolled = stage >= 3;
  const chapter = stage >= 3 ? 2 : stage >= 1 ? 1 : 0;

  return (
    <AnimatePresence onExitComplete={markIntroDone}>
      {!leaving && (
        <motion.div
          key="intro"
          role="status"
          aria-label="Loading The Hungry Wrap"
          className="hw-intro fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f6e6d2]"
          exit={{ y: "-105%", transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Warm light that swells as the story builds */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,177,92,0.55), transparent 68%)" }}
            animate={{ scale: [0.6, 1 + stage * 0.12] }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          {/* The plate */}
          <div className="relative aspect-square w-[min(68vw,22rem)]">
            {/* Tortilla, toasted, spinning onto the plate */}
            <motion.div
              aria-hidden
              className="absolute inset-[6%] rounded-full shadow-[0_30px_50px_-25px_rgba(120,60,10,0.55)]"
              style={{
                background:
                  "radial-gradient(circle at 30% 35%, rgba(150,82,24,.35) 0 3%, transparent 4%), radial-gradient(circle at 62% 28%, rgba(150,82,24,.3) 0 2.5%, transparent 3.5%), radial-gradient(circle at 70% 66%, rgba(150,82,24,.32) 0 3%, transparent 4%), radial-gradient(circle at 38% 72%, rgba(150,82,24,.28) 0 2%, transparent 3%), radial-gradient(circle at 50% 50%, #f6dca3 0%, #f0cf8e 62%, #e2b46a 100%)",
              }}
              initial={{ scale: 0, rotate: -220, opacity: 0 }}
              animate={
                rolled
                  ? { scaleX: 0.5, scaleY: 0.14, rotate: 0, opacity: 0, transition: { duration: 0.45, ease: "easeIn" } }
                  : { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 13 } }
              }
            />

            {/* Fillings drop in, one beat at a time */}
            {FILLINGS.map((f, i) => (
              <motion.div
                key={i}
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ width: f.w, left: `calc(50% + ${f.x})`, top: `calc(50% + ${f.y})` }}
                initial={{ opacity: 0 }}
                animate={
                  rolled
                    ? { opacity: 0, scale: 0.3, transition: { duration: 0.35 } }
                    : stage >= f.at
                      ? { opacity: 1 }
                      : { opacity: 0 }
                }
              >
                <motion.div
                  initial={{ y: "-260%", rotate: f.r - 40 }}
                  animate={stage >= f.at ? { y: 0, rotate: f.r } : { y: "-260%", rotate: f.r - 40 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: (i % 2) * 0.14 }}
                >
                  <Image
                    src={f.asset.src}
                    alt=""
                    width={f.asset.width}
                    height={f.asset.height}
                    sizes="200px"
                    preload
                    className="h-auto w-full drop-shadow-[0_12px_14px_rgba(90,40,5,0.3)]"
                  />
                </motion.div>
              </motion.div>
            ))}

            {/* …and it's rolled */}
            <motion.div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
              animate={rolled ? { opacity: 1, scale: 1, rotate: -6 } : { opacity: 0, scale: 0.4, rotate: -25 }}
              transition={{ type: "spring", stiffness: 170, damping: 11, delay: rolled ? 0.25 : 0 }}
            >
              <Image
                src={HERO_ASSETS.wrap.src}
                alt=""
                width={HERO_ASSETS.wrap.width}
                height={HERO_ASSETS.wrap.height}
                sizes="360px"
                preload
                className="h-auto w-[92%] drop-shadow-[0_26px_30px_rgba(90,40,5,0.35)]"
              />
            </motion.div>
          </div>

          {/* The brand lands */}
          <motion.div
            className="relative mt-2 h-[clamp(3rem,9vw,4.5rem)]"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={stage >= 4 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            <Image
              src={HERO_ASSETS.logo.src}
              alt="The Hungry Wrap"
              width={HERO_ASSETS.logo.width}
              height={HERO_ASSETS.logo.height}
              sizes="280px"
              preload
              className="h-full w-auto"
            />
          </motion.div>

          {/* Narration */}
          <div className="relative mt-5 h-7 w-full max-w-md px-6 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={chapter}
                className="font-[family-name:var(--font-poppins)] text-[0.95rem] font-medium text-[#5b514a]"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.35 }}
              >
                {CHAPTERS[chapter]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div aria-hidden className="relative mt-6 h-1 w-40 overflow-hidden rounded-full bg-[#f47514]/15">
            <motion.div
              className="h-full origin-left rounded-full bg-[#f47514]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: MIN_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          <button
            type="button"
            onClick={() => setLeaving(true)}
            className="absolute right-5 bottom-5 rounded-full px-4 py-2 font-[family-name:var(--font-poppins)] text-xs font-semibold tracking-wide text-[#77716c] uppercase transition-colors hover:text-[#f47514] focus-visible:outline-2 focus-visible:outline-[#f47514]"
          >
            Skip
          </button>

          {/* Curtain edge: a wave trails the overlay as it lifts */}
          <svg aria-hidden viewBox="0 0 2048 125" preserveAspectRatio="none" className="absolute inset-x-0 top-full h-16 w-full -translate-y-px">
            <path d="M0 0H2048V67C1632 35 1280 130 906 70C568 16 298 78 0 13V0Z" fill="#f6e6d2" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
