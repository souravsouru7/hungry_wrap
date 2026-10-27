import type { RefObject } from "react";

export const BRAND = {
  orange: "#f47514",
  orangeSoft: "#ffb15c",
  cream: "#fff9f1",
  creamDeep: "#fdf0dd",
  ink: "#211b18",
  green: "#6ea32e",
  red: "#e8342a",
  yellow: "#f6c33b",
  gold: "#f2b01e",
} as const;

/** Everything a scene receives from <Scene3D />. */
export type SceneProps = {
  /** 0→1 scroll progress through the page's tracked section. Read in useFrame. */
  progress: RefObject<number>;
  /** Phones: fewer instances and particles, no shadows. */
  lite: boolean;
  /** Measured 0→1 progress where each later page section begins (see Scene3D `phases`). */
  phases?: RefObject<number[]>;
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Maps `p` from the [a, b] window onto 0→1, clamped. */
export const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const easeOutBack = (t: number) => {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/** Rises over [a, b] and falls over [c, d]: a soft window for crossfading phases. */
export const windowed = (p: number, a: number, b: number, c: number, d: number) =>
  smooth(span(p, a, b)) * (1 - smooth(span(p, c, d)));

/** Deterministic pseudo-random so instance layouts are stable between renders. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
