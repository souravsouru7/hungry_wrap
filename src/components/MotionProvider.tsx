"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Site-wide motion settings. `reducedMotion="user"` makes every motion
 * animation skip its movement (opacity still fades) when the visitor prefers
 * reduced motion, so components don't need a separate initial state for it.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
