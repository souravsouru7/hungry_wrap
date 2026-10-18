import Link from "next/link";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Menu", href: "#menu" },
  { label: "Our story", href: "#story" },
  { label: "Visit", href: "#visit" },
];

/**
 * Fixed brand bar. It stays usable while the stage below is pinned, so it sits
 * above the stage in the stacking order and never receives GSAP transforms.
 *
 * The wordmark is live text plus an SVG glyph rather than an image: the only
 * logo file in the asset kit is a screenshot crop with an opaque background.
 * Drop the real logo in at `public/assets/hungry-wrap/logo.svg` and swap the
 * `<BrandGlyph />` for an `<Image>` when the client supplies it.
 */
export default function HeroHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 sm:px-8 sm:py-4">
        <Link
          href="#top"
          className="pointer-events-auto flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <BrandGlyph />
          <span className="leading-none">
            <span className="block font-display text-base tracking-[0.14em] text-[color:var(--hero-accent)] sm:text-lg">THE HUNGRY</span>
            <span className="block font-display text-base tracking-[0.3em] text-[color:var(--hero-ink)] sm:text-lg">WRAP</span>
          </span>
        </Link>

        {/* On narrow screens this wraps onto its own row rather than disappearing
            behind a menu button — the links stay reachable while the stage is pinned. */}
        <nav aria-label="Primary" className="pointer-events-auto order-last w-full md:order-none md:w-auto">
          <ul className="flex items-center justify-center gap-5 text-[0.8rem] font-medium tracking-wide text-[color:var(--hero-ink)] sm:gap-8 sm:text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm py-2 opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ember"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* the cream ring keeps the pill legible once the stage turns orange */}
        <Link
          href="#menu"
          className="pointer-events-auto rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white ring-2 ring-cream/70 outline-none transition-transform hover:scale-[1.03] focus-visible:ring-4 focus-visible:ring-cream active:scale-100"
        >
          Order now
        </Link>
      </div>
    </header>
  );
}

function BrandGlyph() {
  return (
    <span
      aria-hidden="true"
      className="grid size-10 place-items-center rounded-full bg-pale/80 ring-1 ring-ember/30"
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="none">
        <rect x="6" y="10" width="20" height="12" rx="6" fill="#F6D9B4" />
        <path d="M8 13.5h16M8 18.5h16" stroke="#F47721" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 16h10" stroke="#5B8C34" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
