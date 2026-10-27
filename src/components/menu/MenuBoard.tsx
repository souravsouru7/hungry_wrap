"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import MenuTabs from "@/components/menu/MenuTabs";
import TiltCard from "@/components/motion/TiltCard";
import SceneFrame from "@/components/three/SceneFrame";
import { HERO_ASSETS } from "@/components/hungry-wrap/exact-hero/assets";
import { MENU, MENU_PHASE_STARTS, ROLL_ART, SIGNATURE_CHAI, type Diet, type MenuCategory, type MenuItem } from "@/lib/menu";

type Filter = "all" | Diet;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "veg", label: "Veg" },
  { id: "nonveg", label: "Non-veg" },
];

/** The standard Indian food mark: green square-and-dot for veg, red for non-veg. */
function DietMark({ diet }: { diet: Diet }) {
  const color = diet === "veg" ? "#2e8b2e" : "#c0392b";
  return (
    <span
      role="img"
      aria-label={diet === "veg" ? "Vegetarian" : "Non-vegetarian"}
      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-2"
      style={{ borderColor: color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    </span>
  );
}

/** Three rising wisps over the THW Special Chai. */
function Steam() {
  return (
    <span aria-hidden className="hw-page-steam absolute -top-4 left-1/2 flex -translate-x-1/2 gap-1">
      <i />
      <i />
      <i />
    </span>
  );
}

const price = (n: number) => `₹${n}`;

function ItemRow({ item, sizes }: { item: MenuItem; sizes?: string[] }) {
  const signature = item.name === SIGNATURE_CHAI;
  return (
    <div className="group flex min-h-11 flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl px-2 py-2 transition-colors hover:bg-[#fff6ea]">
      <DietMark diet={item.diet} />
      <span className="min-w-0 font-[family-name:var(--font-poppins)] text-[0.95rem] font-medium text-[#211b18] transition-colors group-hover:text-[#f47514]">
        {item.name}
      </span>
      <span aria-hidden className="mx-1 min-w-6 flex-1 translate-y-[-3px] border-b-2 border-dotted border-[#e6d3bd]" />
      {item.prices.map((p, i) => (
        <span
          key={i}
          className={`relative shrink-0 text-right font-[family-name:var(--font-baloo)] text-lg font-bold tabular-nums ${
            sizes ? "w-12 sm:w-14" : ""
          } ${signature ? "rounded-full bg-[#f47514] px-2.5 text-white" : "text-[#211b18]"}`}
        >
          {signature && <Steam />}
          <span className="sr-only">{sizes ? `${sizes[i]}: ` : ""}</span>
          {price(p)}
        </span>
      ))}
    </div>
  );
}

function CategoryCard({ category, items }: { category: MenuCategory; items: MenuItem[] }) {
  const reduce = useReducedMotion();
  const art = ROLL_ART[category.id];
  return (
    <motion.section
      layout={!reduce}
      id={category.id}
      aria-labelledby={`${category.id}-heading`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease: [0.2, 0.75, 0.25, 1] }}
      className="relative scroll-mt-44 rounded-[1.75rem] bg-white p-5 shadow-[0_18px_36px_-26px_rgba(90,55,20,0.5)] ring-1 ring-[#f3e6d6] sm:p-7"
    >
      <header className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-poppins)] text-xs font-semibold uppercase tracking-[0.18em] text-[#a08f80]">
            {category.kicker}
          </p>
          <h2 id={`${category.id}-heading`} className={`hw-brush hw-brush--${category.tone} mt-2`}>
            {category.title}
          </h2>
        </div>
        {art && (
          <div className="pointer-events-none absolute -top-12 -right-2 w-24 shrink-0 sm:-top-16 sm:w-32 lg:w-36">
            <TiltCard max={14}>
              <Image
                src={art.src}
                alt={art.alt}
                width={600}
                height={600}
                sizes="144px"
                quality={90}
                className="h-auto w-full drop-shadow-[0_18px_20px_rgba(120,60,10,0.3)] transition-transform duration-500 hover:scale-110 hover:-rotate-6"
              />
            </TiltCard>
          </div>
        )}
      </header>

      {category.sizes && (
        <div aria-hidden className="mt-4 flex justify-end gap-2 px-2 font-[family-name:var(--font-poppins)] text-[0.7rem] font-semibold uppercase tracking-wide text-[#f47514]">
          {category.sizes.map((s) => (
            <span key={s} className="w-12 text-right leading-tight sm:w-14">
              {s}
            </span>
          ))}
        </div>
      )}

      <ul className="mt-3 space-y-0.5">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.name}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 12, transition: { duration: 0.18 } }}
              transition={{ duration: 0.3 }}
            >
              <ItemRow item={item} sizes={category.sizes} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.section>
  );
}

/**
 * The full menu: sticky category tabs with a veg/non-veg filter, a 3D scene
 * that follows along (roll → momo steamer → chai), and every category card.
 */
export default function MenuBoard() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      MENU.map((c) => ({ category: c, items: filter === "all" ? c.items : c.items.filter((i) => i.diet === filter) })).filter(
        (c) => c.items.length > 0,
      ),
    [filter],
  );
  const tabs = useMemo(() => visible.map(({ category }) => ({ id: category.id, label: category.title })), [visible]);
  const counts = useMemo(() => {
    const all = MENU.flatMap((c) => c.items);
    return { all: all.length, veg: all.filter((i) => i.diet === "veg").length, nonveg: all.filter((i) => i.diet === "nonveg").length };
  }, []);

  // Filtering changes the page height: re-measure every scroll trigger once the cards settle.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => window.clearTimeout(id);
  }, [filter]);

  return (
    <>
      <MenuTabs tabs={tabs}>
        <div role="radiogroup" aria-label="Filter by diet" className="flex shrink-0 justify-center gap-1 rounded-full bg-[#fff6ea] p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="relative flex min-h-10 items-center gap-1.5 rounded-full px-3 font-[family-name:var(--font-poppins)] text-xs font-semibold text-[#5b514a] transition-colors aria-checked:text-[#211b18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f47514]"
            >
              {filter === f.id && (
                <motion.span
                  layoutId="menu-diet-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_4px_10px_-4px_rgba(90,55,20,0.4)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {f.id !== "all" && (
                <span className="relative">
                  <DietMark diet={f.id} />
                </span>
              )}
              <span className="relative">
                {f.label} <span className="text-[#a08f80]">{counts[f.id]}</span>
              </span>
            </button>
          ))}
        </div>
      </MenuTabs>

      <div id="menu-track" className="mx-auto grid max-w-7xl gap-x-12 px-5 pb-10 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* The scene follows the menu: kathi roll → momo steamer → chai. */}
        <SceneFrame
          scene="menu"
          track="#menu-track"
          start="top 55%"
          end="bottom 75%"
          phases={MENU_PHASE_STARTS}
          fallback={{ ...HERO_ASSETS.wrap }}
          mobileOffset="calc(var(--hw-header-h) + var(--hw-tabs-h))"
          desktopTop="12rem"
        />

        <div className="space-y-8 pt-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map(({ category, items }) => (
              <CategoryCard key={category.id} category={category} items={items} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
