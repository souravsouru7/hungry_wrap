"use client";

import Scene3D from "./Scene3D";
import type { SceneKey } from "./SceneCanvas";

type SceneFrameProps = {
  scene: SceneKey;
  track: string;
  start?: string;
  end?: string;
  phases?: string[];
  fallback?: { src: string; width: number; height: number; alt: string };
  /** Extra top offset on mobile, for pages whose band sits under a tab bar. */
  mobileOffset?: string;
  /** Desktop sticky offset. */
  desktopTop?: string;
  className?: string;
};

/**
 * One 3D stage, two layouts.
 *
 * On a phone the scene is a band stuck below the header while the page scrolls
 * under it, so the whole scroll-driven story stays on screen. From `lg` up it
 * becomes the tall sticky side panel. It's the same element either way — only
 * CSS moves it — so a page never runs two canvases.
 */
export default function SceneFrame({
  scene,
  track,
  start,
  end,
  phases,
  fallback,
  mobileOffset = "var(--hw-header-h)",
  desktopTop = "7rem",
  className = "",
}: SceneFrameProps) {
  return (
    <div
      className={`hw-scene-frame relative z-10 lg:z-0 ${className}`}
      style={{ "--hw-scene-top": mobileOffset, "--hw-scene-top-lg": desktopTop } as React.CSSProperties}
    >
      <div className="hw-scene-sticky">
        <div aria-hidden className="hw-page-glow absolute inset-[14%] rounded-full" />
        <Scene3D
          scene={scene}
          track={track}
          start={start}
          end={end}
          phases={phases}
          fallback={fallback}
          className="relative h-full w-full"
        />
        {/* Softens the seam where page content scrolls under the mobile band. */}
        <div aria-hidden className="hw-scene-fade lg:hidden" />
      </div>
    </div>
  );
}
