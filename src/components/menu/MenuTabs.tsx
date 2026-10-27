"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scrollToElement } from "@/components/three/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

type Tab = { id: string; label: string };

/**
 * Sticky category bar. The orange pill slides to whichever section is being
 * read and the strip scrolls sideways to keep it in view; clicking a tab
 * glides there. `children` renders beside the tabs (the diet filter).
 */
export default function MenuTabs({ tabs, children }: { tabs: Tab[]; children?: ReactNode }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const strip = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const triggers = tabs.flatMap(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return [];
      return ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(id),
      });
    });
    return () => triggers.forEach((t) => t.kill());
  }, [tabs]);

  // Keep the active tab visible inside the horizontal strip, without moving the page.
  useEffect(() => {
    const list = strip.current;
    const tab = list?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!list || !tab) return;
    const target = tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2;
    list.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky z-30 px-3 pt-2 pb-3 sm:px-5"
      style={{ top: "var(--hw-header-h)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-2 rounded-[1.75rem] bg-white/[0.97] p-1.5 shadow-[0_14px_30px_-18px_rgba(90,55,20,0.55)] ring-1 ring-[#f0e5da] lg:flex-row lg:items-center">
        <ul ref={strip} className="hw-menu-tabs flex min-w-0 flex-1 snap-x gap-1 overflow-x-auto scroll-px-3">
          {tabs.map(({ id, label }) => (
            <li key={id} className="shrink-0 snap-start">
              <a
                href={`#${id}`}
                data-tab={id}
                onClick={(e) => {
                  const el = document.getElementById(id);
                  if (!el) return;
                  e.preventDefault();
                  setActive(id);
                  scrollToElement(el, -170);
                }}
                aria-current={active === id ? "true" : undefined}
                className="relative flex min-h-11 items-center rounded-full px-4 font-[family-name:var(--font-poppins)] text-sm font-semibold whitespace-nowrap text-[#3a2c23] transition-colors aria-[current=true]:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f47514]"
              >
                {active === id && (
                  <motion.span
                    layoutId="menu-tab-pill"
                    className="absolute inset-0 rounded-full bg-[#f47514]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{label}</span>
              </a>
            </li>
          ))}
        </ul>
        {children}
      </div>
    </nav>
  );
}
