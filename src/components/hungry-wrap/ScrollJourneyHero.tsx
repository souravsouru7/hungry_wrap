"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroHeader from "./HeroHeader";
import KineticText from "./KineticText";
import LayeredFoodStage from "./LayeredFoodStage";
import SceneProgress from "./SceneProgress";
import { SCENES, SPRITES, sceneIndexAt, type SceneId } from "./scenes";

/** useLayoutEffect warns during SSR; this keeps client timing without the noise. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * One continuous, scroll-scrubbed food film.
 *
 * A tall section is the ScrollTrigger; the 100svh stage inside it is pinned for
 * the whole of that section, and a single master timeline — normalised 0..1 and
 * written here in units of 100 — drives every layer. Nothing animates from
 * React state: the only state is the current scene index (for the progress
 * rail) and whether the hero image has settled.
 */
export default function ScrollJourneyHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const sceneRef = useRef(0);
  const refreshTimer = useRef<number | null>(null);

  const [activeScene, setActiveScene] = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const [staticMode, setStaticMode] = useState(false);

  /** Images arrive at different times; nudge ScrollTrigger once they settle. */
  const handleImageSettled = useCallback((key: string) => {
    if (key === "finished") setHeroReady(true);
    if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    refreshTimer.current = window.setTimeout(() => ScrollTrigger.refresh(), 180);
  }, []);

  // Never leave the veil up if an image fires neither event.
  useEffect(() => {
    const id = window.setTimeout(() => setHeroReady(true), 2500);
    return () => window.clearTimeout(id);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    // Mobile browsers resize the viewport when the toolbar collapses; without
    // this the pin recalculates mid-scroll and the stage visibly jumps.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const root = document.documentElement;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const line = (id: SceneId) => q(`[data-kinetic-line="${id}"]`);
      const words = (id: SceneId) => q(`[data-kinetic-line="${id}"] [data-kinetic-word]`);
      const kicker = (id: SceneId) => q(`[data-kinetic-line="${id}"] [data-kinetic-kicker]`);
      const sprite = (key: string) => q(`[data-sprite="${key}"]`);
      const spritesFor = (narrow: boolean) => SPRITES.filter((s) => (narrow ? s.tier === "core" : true));

      const mm = gsap.matchMedia();

      /** Opening state for everything the timeline owns. */
      const prime = (narrow: boolean) => {
        gsap.set(q("[data-wrap-stack]"), { xPercent: -50, yPercent: -50, scale: 1, rotation: 0 });
        gsap.set(q("[data-wrap]"), { autoAlpha: 0 });
        gsap.set(q("[data-cta-group]"), { autoAlpha: 0, y: 40 });
        gsap.set(q("[data-scroll-hint]"), { autoAlpha: 0 });
        gsap.set(root, {
          "--hero-ink": "#FFF7EF",
          "--hero-accent": "#F47721",
          "--hero-rail": "rgba(255,247,239,0.14)",
        });

        SCENES.forEach((scene, index) => {
          const y = narrow ? scene.textYNarrow ?? scene.textY : scene.textY;
          gsap.set(line(scene.id), { yPercent: y, autoAlpha: index === 0 ? 1 : 0 });
          gsap.set(words(scene.id), { yPercent: 115, autoAlpha: 0 });
          gsap.set(kicker(scene.id), { autoAlpha: 0, y: 16 });
        });

        spritesFor(narrow).forEach((config) => {
          gsap.set(sprite(config.key), {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            scale: 0.35,
            rotation: 0,
            autoAlpha: 0,
          });
        });
      };

      /**
       * Builds the master timeline. `spread` scales how far the ingredient
       * layers travel from centre, so the same choreography reads on a phone.
       */
      const buildTimeline = (spread: number, narrow: boolean) => {
        const px = (percent: number) => () => (percent / 100) * stage.clientWidth * spread;
        const py = (percent: number) => () => (percent / 100) * stage.clientHeight * spread;
        const sprites = spritesFor(narrow);

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            pin: stage,
            pinSpacing: false,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = sceneIndexAt(self.progress);
              if (next !== sceneRef.current) {
                sceneRef.current = next;
                setActiveScene(next);
              }
            },
          },
        });
        triggerRef.current = tl.scrollTrigger ?? null;

        const showLine = (id: SceneId, at: number, pace = 1) => {
          tl.to(line(id), { autoAlpha: 1, duration: 0.6 }, at)
            .to(
              words(id),
              { yPercent: 0, autoAlpha: 1, duration: 5 * pace, stagger: 0.55 * pace, ease: "power3.out" },
              at,
            )
            .to(kicker(id), { autoAlpha: 1, y: 0, duration: 4 * pace }, at + 0.4 * pace);
        };
        const hideLine = (id: SceneId, at: number) => {
          tl.to(words(id), { yPercent: -90, autoAlpha: 0, duration: 4, stagger: 0.3, ease: "power2.in" }, at)
            .to(kicker(id), { autoAlpha: 0, y: -12, duration: 3 }, at)
            .set(line(id), { autoAlpha: 0 }, at + 4);
        };

        // ------------------------------------------------------ 0.00 INTRO
        const drop = (fraction: number) => () => stage.clientHeight * (narrow ? fraction + 0.09 : fraction);

        tl.set(q("[data-wrap-stack]"), { y: drop(0) }, 0)
          .to(q('[data-wrap="finished"]'), { autoAlpha: 1, duration: 6 }, 0)
          .fromTo(q("[data-wrap-stack]"), { scale: 0.7 }, { scale: 1, duration: 14, ease: "power2.out" }, 0)
          .to(q("[data-plinth]"), { autoAlpha: 0.85, duration: 8 }, 1)
          .to(q("[data-scroll-hint]"), { autoAlpha: 1, duration: 3 }, 1);
        showLine("intro", 0, 0.45);
        tl.to(q("[data-scroll-hint]"), { autoAlpha: 0, duration: 3 }, 13);

        // ------------------------------------------------ 0.17 INGREDIENTS
        hideLine("intro", 17);
        showLine("ingredients", 20);
        tl.to(q('[data-bg="cream"]'), { opacity: 1, duration: 8, ease: "none" }, 17)
          .to(q('[data-bg="espresso"]'), { opacity: 0, duration: 8, ease: "none" }, 17)
          .to(root, { "--hero-ink": "#181615", "--hero-rail": "rgba(24,22,21,0.10)", duration: 8, ease: "none" }, 17.5)
          .to(q('[data-wrap="finished"]'), { autoAlpha: 0, duration: 9 }, 19)
          .to(q("[data-wrap-stack]"), { scale: 0.82, duration: 10, ease: "power1.inOut" }, 19)
          .to(q("[data-specks] [data-speck]"), { autoAlpha: 0.9, duration: 8, stagger: 0.25 }, 19);

        sprites.forEach((config, index) => {
          tl.to(
            sprite(config.key),
            {
              x: px(config.scatter.x),
              y: py(config.scatter.y),
              rotation: config.scatter.rotation,
              scale: config.scatter.scale,
              autoAlpha: 1,
              duration: 13,
              ease: "power3.out",
            },
            19 + index * 0.7,
          );
        });

        // ------------------------------------------------------- 0.38 BUILD
        hideLine("ingredients", 38);
        showLine("build", 41);
        tl.fromTo(
          q('[data-wrap="tortilla"]'),
          { autoAlpha: 0, scale: 0.55, rotation: -14 },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 8, ease: "power2.out" },
          39,
        ).to(q("[data-wrap-stack]"), { scale: 0.95, duration: 10, ease: "power1.inOut" }, 39);

        sprites.forEach((config, index) => {
          const at = 42 + index * 0.6;
          // x and y run on different eases, which bends each layer inward along
          // a curve instead of sliding it in on a straight line.
          tl.to(sprite(config.key), { x: px(config.gather.x), duration: 12, ease: "power2.inOut" }, at)
            .to(sprite(config.key), { y: py(config.gather.y), duration: 12, ease: "back.in(1.1)" }, at)
            .to(
              sprite(config.key),
              { rotation: config.gather.rotation, scale: config.gather.scale, duration: 12, ease: "power1.inOut" },
              at,
            )
            .to(sprite(config.key), { autoAlpha: 0, duration: 5, ease: "power2.in" }, 52 + index * 0.4);
        });

        tl.to(q('[data-wrap="tortilla"]'), { autoAlpha: 0, duration: 5, ease: "none" }, 55).fromTo(
          q('[data-wrap="finished"]'),
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, duration: 6, ease: "power2.out" },
          55,
        );

        // ------------------------------------------------------ 0.62 FLAVOR
        hideLine("build", 62);
        showLine("flavor", 65);
        tl.to(q("[data-flavor-wave]"), { yPercent: 0, autoAlpha: 1, duration: 12, ease: "power2.out" }, 62)
          .to(q('[data-bg="ember"]'), { opacity: 1, duration: 8, ease: "none" }, 64)
          .to(q('[data-bg="cream"]'), { opacity: 0.15, duration: 8, ease: "none" }, 65)
          .to(
            root,
            {
              "--hero-ink": "#2A1206",
              "--hero-accent": "#FFF1DF",
              "--hero-rail": "rgba(42,18,6,0.12)",
              duration: 8,
              ease: "none",
            },
            64,
          )
          .to(
            q("[data-wrap-stack]"),
            {
              scale: 1.25,
              rotation: 6,
              x: () => stage.clientWidth * (narrow ? 0 : 0.07),
              y: drop(0.06),
              duration: 17,
              ease: "power1.inOut",
            },
            63,
          );

        // sauce and spice layers drift back in at their own depths
        ["sauce", "spices"].forEach((key, index) => {
          const config = sprites.find((s) => s.key === key);
          if (!config) return;
          tl.to(
            sprite(key),
            {
              autoAlpha: 1,
              x: px(config.gather.x * 3.4),
              y: py(config.gather.y * 3.1 - 6),
              rotation: config.scatter.rotation * 1.4,
              scale: config.gather.scale * 1.9,
              duration: 13,
              ease: "power2.out",
            },
            64 + index * 1.5,
          );
        });

        q("[data-specks] [data-speck]").forEach((speck) => {
          const depth = Number((speck as HTMLElement).dataset.depth ?? 1);
          tl.to(speck, { y: -70 * depth, x: 24 * depth, duration: 18, ease: "none" }, 62);
        });

        // ------------------------------------------------------- 0.82 ORDER
        hideLine("flavor", 82);
        showLine("order", 85);
        tl.to(
          q("[data-wrap-stack]"),
          {
            scale: 1,
            rotation: -2,
            x: 0,
            y: drop(0.05),
            duration: 12,
            ease: "power2.inOut",
          },
          83,
        )
          .to(
            sprites.flatMap((s) => sprite(s.key)),
            { autoAlpha: 0, duration: 6, ease: "none" },
            84,
          )
          .to(q('[data-wrap="finished"]'), { autoAlpha: 0, duration: 6, ease: "none" }, 85)
          .fromTo(
            q('[data-wrap="packaged"]'),
            { autoAlpha: 0, scale: 0.88, rotation: 6 },
            { autoAlpha: 1, scale: 1, rotation: 0, duration: 8, ease: "power2.out" },
            85,
          )
          .to(q("[data-flavor-wave]"), { yPercent: 18, autoAlpha: 0.35, duration: 12, ease: "power1.inOut" }, 88)
          .to(q('[data-bg="ember"]'), { opacity: 0.22, duration: 9, ease: "none" }, 91)
          .to(q('[data-bg="cream"]'), { opacity: 1, duration: 9, ease: "none" }, 91)
          .to(
            root,
            {
              "--hero-ink": "#181615",
              "--hero-accent": "#F47721",
              "--hero-rail": "rgba(24,22,21,0.10)",
              duration: 7,
              ease: "none",
            },
            92,
          )
          .to(q("[data-cta-group]"), { autoAlpha: 1, y: 0, duration: 8, ease: "power3.out" }, 89);
      };

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 641px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 640px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, tablet, mobile, reduced } = context.conditions as Record<string, boolean>;

          if (reduced) {
            // No pin, no scrub: one legible composition with everything on screen.
            setStaticMode(true);
            gsap.set(q("[data-wrap-stack]"), {
              xPercent: -50,
              yPercent: -50,
              scale: 0.78,
              y: stage.clientHeight * 0.14,
            });
            gsap.set(q('[data-wrap="finished"]'), { autoAlpha: 1 });
            gsap.set(q('[data-bg="cream"]'), { opacity: 1 });
            gsap.set(root, {
              "--hero-ink": "#181615",
              "--hero-accent": "#F47721",
              "--hero-rail": "rgba(24,22,21,0.10)",
            });
            gsap.set(q("[data-cta-group]"), { autoAlpha: 1, y: 0 });
            gsap.set(q("[data-scroll-hint]"), { autoAlpha: 0 });
            gsap.set(q("[data-plinth]"), { autoAlpha: 0.7 });
            SCENES.forEach((scene, index) => {
              gsap.set(line(scene.id), { yPercent: scene.textY, autoAlpha: index === 0 ? 1 : 0 });
              gsap.set(words(scene.id), { yPercent: 0, autoAlpha: 1 });
              gsap.set(kicker(scene.id), { autoAlpha: 1, y: 0 });
            });
            spritesFor(true).forEach((config) => {
              gsap.set(sprite(config.key), {
                xPercent: -50,
                yPercent: -50,
                x: (config.scatter.x / 100) * stage.clientWidth * 0.78,
                y: (config.scatter.y / 100) * stage.clientHeight * 0.6 + stage.clientHeight * 0.16,
                rotation: config.scatter.rotation,
                scale: 0.72,
                autoAlpha: 1,
              });
            });
            return;
          }

          setStaticMode(false);
          const spread = desktop ? 1 : tablet ? 0.86 : 0.62;
          prime(Boolean(mobile));
          buildTimeline(spread, Boolean(mobile));
        },
      );
    }, sectionRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    if (document.fonts?.ready) void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoad);
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
      triggerRef.current = null;
      ctx.revert();
    };
  }, []);

  /** Jump the page to the scroll position where a given scene begins. */
  const handleSeek = useCallback((index: number) => {
    const trigger = triggerRef.current;
    const section = sectionRef.current;
    if (!trigger || !section) {
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const top = trigger.start + (trigger.end - trigger.start) * SCENES[index].at;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <>
      <HeroHeader />
      {/* The pin lasts for the section height minus one stage, so the scroll
          length here is what sets the pace of the film. */}
      <section
        id="top"
        ref={sectionRef}
        aria-label="The Hungry Wrap — from fresh ingredients to a wrap in your hand"
        data-static={staticMode ? "true" : "false"}
        className="hero-journey relative h-[280svh] w-full bg-espresso sm:h-[420svh] lg:h-[500svh]"
      >
        <div
          ref={stageRef}
          className="hero-stage relative h-[100svh] w-full overflow-hidden"
        >
          <LayeredFoodStage onImageSettled={handleImageSettled} />
          <KineticText />

          <div
            data-scroll-hint
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-2 text-[color:var(--hero-ink)] opacity-0"
          >
            <span className="grid h-9 w-6 place-items-start rounded-full border border-current/50 p-1">
              <span className="hero-hint-dot block size-1.5 rounded-full bg-current" />
            </span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] opacity-70">
              Scroll to explore
            </span>
          </div>

          <div
            data-cta-group
            className="absolute inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 flex flex-wrap items-center justify-center gap-3 px-6 opacity-0 sm:bottom-[13%] sm:gap-4"
          >
            <Link
              href="#menu"
              className="rounded-full bg-[color:var(--hero-ink)] px-7 py-3.5 text-sm font-semibold text-cream outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ember active:scale-100 sm:text-base"
            >
              Order now
            </Link>
            <Link
              href="#menu"
              className="rounded-full border border-[color:var(--hero-ink)]/35 bg-cream/70 px-7 py-3.5 text-sm font-semibold text-[color:var(--hero-ink)] outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-[color:var(--hero-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-cream active:scale-100 sm:text-base"
            >
              Explore the menu
            </Link>
          </div>

          {!staticMode && <SceneProgress activeIndex={activeScene} onSeek={handleSeek} />}

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-[60] bg-espresso transition-opacity duration-700 ${
              heroReady ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </section>
    </>
  );
}
