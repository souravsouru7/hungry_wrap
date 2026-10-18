"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { SPRITES, WRAP_STACK } from "./scenes";

/** Deterministic specks — no randomness at render time, so SSR and client agree. */
const SPECKS = [
  { x: 12, y: 22, s: 7, d: 0.4 }, { x: 24, y: 68, s: 4, d: 0.8 },
  { x: 33, y: 14, s: 5, d: 1.1 }, { x: 44, y: 82, s: 6, d: 0.6 },
  { x: 58, y: 28, s: 4, d: 1.3 }, { x: 66, y: 72, s: 8, d: 0.5 },
  { x: 74, y: 18, s: 5, d: 0.9 }, { x: 82, y: 58, s: 6, d: 1.2 },
  { x: 90, y: 34, s: 4, d: 0.7 }, { x: 18, y: 46, s: 5, d: 1.0 },
  { x: 52, y: 54, s: 3, d: 1.4 }, { x: 38, y: 38, s: 4, d: 0.6 },
];

interface LayeredFoodStageProps {
  /** Called once per image when it has either decoded or failed to load. */
  onImageSettled: (key: string, ok: boolean) => void;
}

/**
 * Everything that moves: the background washes, the ingredient sprites and the
 * three centre-stage wrap images. The component only paints — all motion is
 * applied by the timeline in ScrollJourneyHero through the `data-*` hooks.
 *
 * Backgrounds, the flavour wave and the specks are CSS/SVG rather than image
 * assets: they scale to any viewport, cost nothing to download and avoid the
 * keying artefacts the bitmap backgrounds in the kit carry.
 */
export default function LayeredFoodStage({ onImageSettled }: LayeredFoodStageProps) {
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  const settle = useCallback(
    (key: string, ok: boolean) => () => {
      if (!ok) setBroken((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
      onImageSettled(key, ok);
    },
    [onImageSettled],
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* --- background washes, cross-faded by the timeline --- */}
      <div
        data-bg="espresso"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,#2d2018_0%,#201712_45%,#141010_100%)]"
      />
      <div
        data-bg="cream"
        className="absolute inset-0 opacity-0 bg-[radial-gradient(110%_80%_at_50%_42%,#FFF7EF_0%,#FFE3C4_58%,#F6CFA4_100%)]"
      />
      <div
        data-bg="ember"
        className="absolute inset-0 opacity-0 bg-[radial-gradient(120%_95%_at_50%_55%,#FF9A4D_0%,#F47721_52%,#D95F12_100%)]"
      />

      {/* flavour wave: an SVG curve swept up over the stage */}
      <svg
        data-flavor-wave
        aria-hidden="true"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 z-10 h-[55%] w-full translate-y-full opacity-0"
      >
        <path
          d="M0 180 C 180 60, 320 300, 520 180 S 900 60, 1200 170 L1200 400 L0 400 Z"
          fill="#F47721"
          fillOpacity="0.95"
        />
        <path
          d="M0 230 C 200 120, 360 340, 560 230 S 940 130, 1200 225 L1200 400 L0 400 Z"
          fill="#FFD9AE"
          fillOpacity="0.45"
        />
      </svg>

      {/* drifting specks — the later ones are dropped on small screens */}
      <div data-specks aria-hidden="true" className="absolute inset-0 z-10">
        {SPECKS.map((speck, index) => (
          <span
            key={index}
            data-speck
            data-depth={speck.d}
            className={`absolute block rounded-full bg-ember/50 opacity-0 ${index >= 6 ? "hidden sm:block" : ""}`}
            style={{
              left: `${speck.x}%`,
              top: `${speck.y}%`,
              width: speck.s,
              height: speck.s,
            }}
          />
        ))}
      </div>

      {/* soft plinth the food sits on, in place of the kit's wood board cutout */}
      <div
        data-plinth
        aria-hidden="true"
        className="absolute left-1/2 top-[62%] z-10 h-[18vh] w-[70vw] max-w-[60rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(32,23,18,0.45),transparent_72%)] opacity-0 blur-xl"
      />

      {/* --- ingredient sprites --- */}
      {SPRITES.map((sprite) => {
        if (broken[sprite.key]) return null;
        return (
          <div
            key={sprite.key}
            data-sprite={sprite.key}
            data-tier={sprite.tier}
            className={`absolute left-1/2 top-1/2 opacity-0 will-change-transform ${
              sprite.tier === "extra" ? "hidden sm:block" : ""
            }`}
            style={{ width: sprite.size, zIndex: sprite.layer }}
          >
            <Image
              src={sprite.src}
              alt={sprite.alt}
              width={sprite.width}
              height={sprite.height}
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 18vw"
              onLoad={settle(sprite.key, true)}
              onError={settle(sprite.key, false)}
              className="h-auto w-full select-none drop-shadow-[0_18px_28px_rgba(32,23,18,0.28)]"
              draggable={false}
            />
          </div>
        );
      })}

      {/* --- centre stage: tortilla -> finished wrap -> packaged wrap --- */}
      <div
        data-wrap-stack
        className="absolute left-1/2 top-1/2 z-[35] w-[min(78vw,34rem)] will-change-transform"
      >
        <div className="relative aspect-[601/473]">
          {!broken.tortilla && (
            <div data-wrap="tortilla" className="absolute inset-0 grid place-items-center opacity-0">
              <Image
                src={WRAP_STACK.tortilla.src}
                alt={WRAP_STACK.tortilla.alt}
                width={WRAP_STACK.tortilla.width}
                height={WRAP_STACK.tortilla.height}
                sizes="(max-width: 640px) 66vw, 36rem"
                onLoad={settle("tortilla", true)}
                onError={settle("tortilla", false)}
                className="h-auto w-[62%] select-none drop-shadow-[0_26px_44px_rgba(32,23,18,0.3)]"
                draggable={false}
              />
            </div>
          )}

          {!broken.finished && (
            <div data-wrap="finished" className="absolute inset-0 grid place-items-center opacity-0">
              <Image
                src={WRAP_STACK.finished.src}
                alt={WRAP_STACK.finished.alt}
                width={WRAP_STACK.finished.width}
                height={WRAP_STACK.finished.height}
                sizes="(max-width: 640px) 78vw, 36rem"
                loading="eager"
                fetchPriority="high"
                onLoad={settle("finished", true)}
                onError={settle("finished", false)}
                className="h-auto w-full select-none drop-shadow-[0_34px_60px_rgba(32,23,18,0.35)]"
                draggable={false}
              />
            </div>
          )}

          {!broken.packaged && (
            <div data-wrap="packaged" className="absolute inset-0 grid place-items-center opacity-0">
              <Image
                src={WRAP_STACK.packaged.src}
                alt={WRAP_STACK.packaged.alt}
                width={WRAP_STACK.packaged.width}
                height={WRAP_STACK.packaged.height}
                sizes="(max-width: 640px) 70vw, 32rem"
                onLoad={settle("packaged", true)}
                onError={settle("packaged", false)}
                className="h-auto w-[88%] select-none drop-shadow-[0_34px_60px_rgba(32,23,18,0.35)]"
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
