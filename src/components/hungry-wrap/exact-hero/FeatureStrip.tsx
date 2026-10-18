import type { ReactNode } from "react";

/* Four icon glyphs, drawn in code so they stay crisp at any size. */
const LeafIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-[55%] w-[55%]">
    <path d="M19.5 3.6c-7.6-.9-13.6 2.3-14.8 8-.6 2.8.3 5.4 2 7l1.8-1.8c-1-1.1-1.5-2.7-1.1-4.5.9-4.2 5.3-6.6 11-6.3-2.6 3.6-6.2 5.4-9 6.5l-.9 3.3c4.8-1.3 11.6-4.9 11-12.2Z" />
  </svg>
);

const ChefHatIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-[55%] w-[55%]">
    <path d="M6.2 11.6A4.1 4.1 0 0 1 8.6 4a4 4 0 0 1 6.8 0 4.1 4.1 0 0 1 2.4 7.6V15H6.2v-3.4Z" />
    <rect x="6.2" y="16.3" width="11.6" height="3.1" rx="1" />
  </svg>
);

const HeartIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden className="h-[55%] w-[55%]">
    <path d="M12 20.2 4.9 13.3a4.4 4.4 0 0 1 0-6.3 4.6 4.6 0 0 1 6.4 0l.7.7.7-.7a4.6 4.6 0 0 1 6.4 0 4.4 4.4 0 0 1 0 6.3L12 20.2Z" />
  </svg>
);

const SmileIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className="h-[58%] w-[58%]">
    <path d="M8.2 14.2a4.8 4.8 0 0 0 7.6 0" />
    <circle cx="8.6" cy="9.4" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="15.4" cy="9.4" r="1.25" fill="currentColor" stroke="none" />
  </svg>
);

type Feature = {
  label: string;
  icon: ReactNode;
  /** Disc gradient and glyph colour, matching the reference chips. */
  disc: string;
  glyph: string;
};

const FEATURES: Feature[] = [
  { label: "Fresh\nIngredients", icon: LeafIcon, disc: "linear-gradient(180deg, #67b23a 0%, #3f8b1d 100%)", glyph: "#ffffff" },
  { label: "Bold\nFlavors", icon: ChefHatIcon, disc: "linear-gradient(180deg, #ffc94a 0%, #f2a514 100%)", glyph: "#ffffff" },
  { label: "Made to\nSatisfy You", icon: HeartIcon, disc: "linear-gradient(180deg, #f1554a 0%, #d8352a 100%)", glyph: "#ffffff" },
  { label: "Always\nDelicious", icon: SmileIcon, disc: "linear-gradient(180deg, #ffd44f 0%, #f5b81c 100%)", glyph: "#3c2a10" },
];

/**
 * The cream card of four value props sitting at the foot of the copy
 * column. Columns are separated by hairlines, as in the reference.
 */
export default function FeatureStrip() {
  return (
    <div
      data-hero-entrance="strip"
      className="w-full max-w-[620px] rounded-[2rem] px-3 py-4 sm:rounded-[2.5rem] sm:px-5"
      style={{
        background: "linear-gradient(170deg, rgba(249,246,221,0.96) 0%, rgba(252,240,215,0.92) 100%)",
        boxShadow: "0 28px 60px -38px rgba(120, 72, 20, 0.55), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      <ul className="grid grid-cols-2 sm:grid-cols-4">
        {FEATURES.map(({ label, icon, disc, glyph }, i) => (
          <li
            key={label}
            className={`hw-feature flex flex-col items-center gap-2.5 px-2 py-2 text-center sm:px-3 ${
              i > 0 ? "sm:border-l sm:border-[#d8c9a8]/45" : ""
            }`}
          >
            <span
              className="hw-feature-icon flex h-11 w-11 items-center justify-center rounded-full sm:h-[52px] sm:w-[52px]"
              style={{ background: disc, color: glyph, boxShadow: "0 10px 18px -8px rgba(90,60,20,0.6)" }}
            >
              {icon}
            </span>
            <span className="whitespace-pre-line font-[family-name:var(--hw-font-ui)] text-[0.78rem] font-semibold leading-[1.25] text-[#4a3a2c] sm:text-[0.85rem]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
