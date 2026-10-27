"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { SceneKey } from "./SceneCanvas";

gsap.registerPlugin(ScrollTrigger);

// WebGL never runs during prerendering: the canvas and three.js load on the
// client only, and only once the scene is about to scroll into view.
const loadSceneCanvas = () => import("./SceneCanvas");
const SceneCanvas = dynamic(loadSceneCanvas, { ssr: false });

type Fallback = { src: string; width: number; height: number; alt: string };

type Scene3DProps = {
  scene: SceneKey;
  /** CSS selector of the section whose scroll drives the scene. */
  track: string;
  /** Scroll window, as ScrollTrigger start/end strings. */
  start?: string;
  end?: string;
  /**
   * Ids of sections inside the track where the scene should change. Their
   * positions are measured into 0→1 progress values and handed to the scene,
   * so phase changes stay aligned with the content however long it is.
   */
  phases?: string[];
  /** Shown instead of WebGL under reduced motion or without WebGL support. */
  fallback?: Fallback;
  className?: string;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Weak device? Phones, tablets, and anything short on cores or memory. */
function isLite() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    window.matchMedia("(max-width: 1023px)").matches ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4)
  );
}

// WebGL support can't change for the life of the page, so it's probed once.
// Everything else is re-read whenever the media queries fire, so rotating a
// phone or resizing a window moves the scene to the right quality tier.
let webgl: boolean | null = null;
let snapshot: { mode: "pending" | "3d" | "static"; lite: boolean } = { mode: "pending", lite: false };

const QUERIES = ["(prefers-reduced-motion: reduce)", "(max-width: 1023px)"];

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

function readCapability() {
  webgl ??= supportsWebGL();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mode = !reduce && webgl ? ("3d" as const) : ("static" as const);
  const lite = isLite();
  // useSyncExternalStore compares by reference, so only allocate on real change.
  if (snapshot.mode !== mode || snapshot.lite !== lite) snapshot = { mode, lite };
  return snapshot;
}

export default function Scene3D({
  scene,
  track,
  start = "top 75%",
  end = "bottom 75%",
  phases,
  fallback,
  className = "",
}: Scene3DProps) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const phaseBounds = useRef<number[]>([]);
  const cap = useSyncExternalStore(subscribe, readCapability, () => null);
  const mode = cap?.mode ?? "pending";
  const lite = cap?.lite ?? false;
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);

  // Fetch three.js while the browser is idle, so the scene is ready before it's scrolled to.
  useEffect(() => {
    if (mode !== "3d") return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void loadSceneCanvas());
    return () => cancel(handle);
  }, [mode]);

  // Mount lazily, then pause the render loop whenever the scene is offscreen.
  useEffect(() => {
    const el = root.current;
    if (!el || mode !== "3d") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  // Don't burn battery rendering behind another tab.
  useEffect(() => {
    const onVisibility = () => setForeground(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (mode !== "3d") return;
    const trigger = document.querySelector(track);
    if (!trigger) return;
    // The viewport line a section top must cross, read from e.g. "top 55%".
    const line = Number(/top (\d+)%/.exec(start)?.[1] ?? 50) / 100;
    const measure = (self: ScrollTrigger) => {
      if (!phases?.length) return;
      const range = self.end - self.start || 1;
      phaseBounds.current = phases.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 1;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return Math.min(1, Math.max(0, (top - line * window.innerHeight - self.start) / range));
      });
    };
    const st = ScrollTrigger.create({
      trigger,
      start,
      end,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
      onRefresh: measure,
    });
    progress.current = st.progress;
    measure(st);
    return () => st.kill();
  }, [mode, track, start, end, phases]);

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none ${className}`}>
      {mode === "3d" && mounted && (
        <SceneCanvas
          scene={scene}
          progress={progress}
          phases={phaseBounds}
          active={visible && foreground}
          lite={lite}
        />
      )}
      {mode === "static" && fallback && (
        <div className="flex h-full w-full items-center justify-center p-4">
          <Image
            src={fallback.src}
            alt=""
            width={fallback.width}
            height={fallback.height}
            sizes="(max-width: 1023px) 45vw, 420px"
            className="h-auto max-h-full w-auto max-w-[min(100%,26rem)] object-contain"
          />
        </div>
      )}
    </div>
  );
}
