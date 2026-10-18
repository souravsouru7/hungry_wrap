/** Avatar face, drawn in code — no stock photos of real people. */
function Avatar({ skin, hair, shirt }: { skin: string; hair: string; shirt: string }) {
  return (
    <span
      className="relative inline-block h-9 w-9 overflow-hidden rounded-full ring-2 ring-white"
      style={{ background: "linear-gradient(180deg, #ffe9cf 0%, #f8d6ad 100%)" }}
    >
      <svg viewBox="0 0 36 36" aria-hidden className="h-full w-full">
        <circle cx="18" cy="14" r="7" fill={skin} />
        <path d="M11 13a7 7 0 0 1 14 0c0-5-3-7.5-7-7.5S11 8 11 13Z" fill={hair} />
        <path d="M4 36c1.6-7 7.4-10.5 14-10.5S30.4 29 32 36H4Z" fill={shirt} />
      </svg>
    </span>
  );
}

/**
 * Floating social-proof pill at mid-right: three overlapping avatars, the
 * headline figure, and a round orange arrow button.
 */
export default function CustomerBadge() {
  return (
    <div
      data-hero-entrance="badge"
      className="flex items-center gap-3 rounded-[1.75rem] px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3"
      style={{
        background: "linear-gradient(170deg, rgba(255,255,255,0.97) 0%, rgba(255,248,238,0.94) 100%)",
        boxShadow: "0 26px 50px -30px rgba(110, 66, 18, 0.65), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div className="flex -space-x-3">
        <Avatar skin="#e8ad7d" hair="#3a2a20" shirt="#f08a2a" />
        <Avatar skin="#c88a55" hair="#241a14" shirt="#4f8c43" />
        <Avatar skin="#8d5a33" hair="#1d1410" shirt="#2f3b55" />
      </div>

      <div className="font-[family-name:var(--hw-font-ui)] leading-tight">
        <p className="text-lg font-bold text-[var(--hw-orange)] sm:text-xl">10K+</p>
        <p className="text-[0.72rem] font-medium text-[#6a584a] sm:text-[0.8rem]">Happy Customers</p>
      </div>

      <button
        type="button"
        aria-label="See customer reviews"
        className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 hover:scale-110 sm:h-10 sm:w-10"
        style={{ background: "linear-gradient(180deg, #fa9231 0%, #ef780e 100%)" }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h13M12.5 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
