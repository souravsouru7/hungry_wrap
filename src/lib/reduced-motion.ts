"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Hydration-safe stand-in for motion's `useReducedMotion`. Motion's hook reads
 * the media query during the first client render, so a component that renders
 * differently for reduced motion disagrees with the server HTML and React
 * throws a hydration error. This one reports `false` while hydrating (matching
 * the server) and switches to the real preference right after.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
