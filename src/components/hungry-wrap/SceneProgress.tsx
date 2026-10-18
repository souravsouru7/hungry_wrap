"use client";

import { SCENES } from "./scenes";

interface SceneProgressProps {
  activeIndex: number;
  /** Scrolls the page to the start of a scene. */
  onSeek: (index: number) => void;
}

/**
 * Sticky rail along the right edge of the stage (bottom on small screens).
 * Each stop is a real button, so the journey is reachable by keyboard without
 * scrubbing, and the active stop is announced politely rather than on every
 * frame — the parent only re-renders when the scene index changes.
 */
export default function SceneProgress({ activeIndex, onSeek }: SceneProgressProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-50 flex justify-center sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:block">
      <nav aria-label="Scenes in this story" className="pointer-events-auto">
        <ol className="flex items-center gap-3 rounded-full bg-[color:var(--hero-rail)] px-4 py-2.5 backdrop-blur-sm sm:flex-col sm:gap-5 sm:rounded-3xl sm:px-3 sm:py-5">
          {SCENES.map((scene, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={scene.id} className="sm:flex sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => onSeek(index)}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--hero-ink)] opacity-0 transition-opacity group-hover:opacity-70 group-focus-visible:opacity-100 sm:inline data-[on=true]:opacity-100" data-on={isActive}>
                    {scene.label}
                  </span>
                  <span
                    aria-hidden="true"
                    data-on={isActive}
                    className="block size-2.5 rounded-full bg-[color:var(--hero-ink)]/25 transition-[background-color,transform] duration-300 data-[on=true]:scale-150 data-[on=true]:bg-ember"
                  />
                  <span className="sr-only">{`Go to scene ${index + 1}: ${scene.label}`}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <p className="sr-only" aria-live="polite">
        {`Scene ${activeIndex + 1} of ${SCENES.length}: ${SCENES[activeIndex].label}`}
      </p>
    </div>
  );
}
