"use client";

import type { RefObject } from "react";

import Stage from "./Stage";
import CafePin from "./scenes/CafePin";
import IngredientJourney from "./scenes/IngredientJourney";
import MenuShowcase from "./scenes/MenuShowcase";
import QuestionCloud from "./scenes/QuestionCloud";
import TeaClub from "./scenes/TeaClub";

export type SceneKey = "menu" | "tea" | "about" | "faq" | "contact";

const CAMERAS: Record<SceneKey, { position: [number, number, number]; fov?: number }> = {
  menu: { position: [0, 1.6, 6.2], fov: 38 },
  tea: { position: [0, 1.9, 6], fov: 36 },
  about: { position: [0, 0, 8], fov: 50 },
  faq: { position: [0, 0, 9], fov: 45 },
  contact: { position: [0, 9, 0.01], fov: 40 },
};

type Props = {
  scene: SceneKey;
  progress: RefObject<number>;
  phases: RefObject<number[]>;
  active: boolean;
  lite: boolean;
};

export default function SceneCanvas({ scene, progress, phases, active, lite }: Props) {
  return (
    <Stage active={active} camera={CAMERAS[scene]} lite={lite}>
      {scene === "menu" && <MenuShowcase progress={progress} phases={phases} lite={lite} />}
      {scene === "tea" && <TeaClub progress={progress} lite={lite} />}
      {scene === "about" && <IngredientJourney progress={progress} lite={lite} />}
      {scene === "faq" && <QuestionCloud progress={progress} lite={lite} />}
      {scene === "contact" && <CafePin progress={progress} lite={lite} />}
    </Stage>
  );
}
