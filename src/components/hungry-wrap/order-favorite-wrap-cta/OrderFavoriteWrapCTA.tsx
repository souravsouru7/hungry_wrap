import Image from "next/image";
import { ArrowUpRight, ShoppingBag, Sparkles } from "lucide-react";
import { ORDER_CTA_ASSETS } from "./assets";
import SectionWave from "@/components/hungry-wrap/SectionWave";
import { ORDER_HREF } from "@/lib/site";

type OrderFavoriteWrapCTAProps = {
  /** Destination for the primary ordering action. */
  orderHref?: string;
  /** Destination for the menu action. */
  menuHref?: string;
  className?: string;
};

type ArtLayerProps = {
  asset: (typeof ORDER_CTA_ASSETS)[keyof typeof ORDER_CTA_ASSETS];
  className: string;
  priority?: boolean;
};

function ArtLayer({ asset, className, priority = false }: ArtLayerProps) {
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      sizes="(max-width: 767px) 94vw, (max-width: 1023px) 75vw, 53vw"
      priority={priority}
      draggable={false}
      aria-hidden={asset.alt === "" || undefined}
      className={`pointer-events-none absolute h-auto select-none ${className}`}
    />
  );
}

/**
 * The Hungry Wrap's order call-to-action, composed from transparent food
 * layers rather than a flattened reference. On small screens the copy keeps
 * its reading order and the visual art becomes a centred, self-contained
 * stage beneath it.
 */
export default function OrderFavoriteWrapCTA({
  orderHref = ORDER_HREF,
  menuHref = "#menu",
  className = "",
}: OrderFavoriteWrapCTAProps) {
  return (
    <section
      id="order-favorite-wrap"
      aria-labelledby="order-favorite-wrap-heading"
      className={`hw-order-cta relative isolate overflow-hidden bg-[#fff8ef] ${className}`}
    >
      {/* This curve is intentionally CSS/SVG rather than a screenshot crop.
          It paints the section's own cream, not white: the section above is
          cream too, and a white fill here read as a hard white band. */}
      <SectionWave fill="#fff8ef" className="h-[clamp(3rem,7vw,7rem)]" />

      {/* A few quiet atmosphere details from the reference, kept behind copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="absolute -left-12 top-[16%] h-28 w-28 rounded-full bg-[#76a33e]/25 blur-3xl" />
        <span className="absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-[#6c9834]/20 blur-3xl" />
        <span className="absolute left-[7%] top-[20%] h-1.5 w-1.5 rounded-full bg-[#ed741c]/50" />
        <span className="absolute left-[10%] top-[24%] h-1 w-1 rotate-45 bg-[#ef7d29]/45" />
        <span className="absolute right-[9%] top-[23%] h-1.5 w-1.5 rounded-full bg-[#f47721]/60" />
        <span className="absolute right-[30%] top-[12%] h-2 w-1 rotate-[24deg] rounded-full bg-[#ee761d]/50" />
        <span className="absolute right-[4%] top-[54%] h-1 w-1 rounded-full bg-[#ef7b21]/55" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 px-5 pt-[clamp(7.75rem,14vw,10.5rem)] pb-4 sm:px-8 md:pb-8 lg:min-h-[34rem] lg:grid-cols-[42%_58%] lg:px-10 lg:pt-[clamp(7rem,8vw,9.25rem)]">
        <div className="hw-order-cta-copy self-center pb-8 lg:-mt-4 lg:pb-14 lg:pl-[3%]">
          <p className="hw-order-cta-reveal hw-order-cta-kicker font-[family-name:var(--font-poppins)] text-[clamp(1rem,1.55vw,1.32rem)] font-semibold tracking-[-0.025em] text-[#332d29]">
            Hunger Can&apos;t Wait!
          </p>

          <h2
            id="order-favorite-wrap-heading"
            className="hw-order-cta-reveal hw-order-cta-heading mt-2 max-w-[42rem] font-[family-name:var(--font-poppins)] text-[clamp(2.55rem,4.25vw,4rem)] leading-[0.98] font-bold tracking-[-0.065em]"
            style={{ animationDelay: "90ms" }}
          >
            <span className="text-[#211d1b]">Order Your </span>
            <span className="hw-order-cta-accent">Favorite</span>
            <span className="mt-1 block hw-order-cta-accent">Wrap Now</span>
          </h2>

          <div
            className="hw-order-cta-reveal mt-7 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8"
            style={{ animationDelay: "180ms" }}
          >
            <a
              href={orderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hw-order-cta-button group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-[#f87b18] px-8 font-[family-name:var(--font-poppins)] text-[1.02rem] font-bold text-white shadow-[0_9px_0_#db6010,0_17px_24px_rgba(217,95,15,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#ff8525] hover:shadow-[0_11px_0_#db6010,0_22px_28px_rgba(217,95,15,0.28)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#f87b18]"
            >
              Order Now
              <Sparkles aria-hidden className="h-[1.1rem] w-[1.1rem] transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.7} />
            </a>
            <a
              href={menuHref}
              className="hw-order-cta-button group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border-2 border-[#ffb277] bg-white/75 px-8 font-[family-name:var(--font-poppins)] text-[1.02rem] font-bold text-[#ee6f17] shadow-[0_7px_18px_rgba(129,76,36,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#f87b18] hover:bg-white hover:shadow-[0_14px_26px_rgba(129,76,36,0.13)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#f87b18]"
            >
              View Menu
              <ShoppingBag aria-hidden className="h-[1.08rem] w-[1.08rem] transition-transform duration-300 group-hover:-rotate-6" strokeWidth={2.5} />
              <ArrowUpRight aria-hidden className="sr-only" />
            </a>
          </div>
        </div>

        <div aria-label="A wrap with sauce and fresh garnish" className="relative mx-auto aspect-[1.18/1] w-full max-w-[43rem] lg:mt-[-4.9rem] lg:mr-[-4%] lg:max-w-none">
          <ArtLayer asset={ORDER_CTA_ASSETS.panel} className="left-[7%] top-[4%] z-[1] w-[88%]" />
          <ArtLayer asset={ORDER_CTA_ASSETS.sauceSplash} className="hw-order-cta-splash left-[13%] top-[3%] z-[5] w-[78%]" />
          <ArtLayer asset={ORDER_CTA_ASSETS.sauceRing} className="hw-order-cta-sauce left-[17%] top-[9%] z-10 w-[70%]" />
          <ArtLayer asset={ORDER_CTA_ASSETS.wrap} priority className="hw-order-cta-wrap left-[20%] top-[3%] z-20 w-[73%] drop-shadow-[0_28px_25px_rgba(91,46,15,0.2)]" />
          <ArtLayer asset={ORDER_CTA_ASSETS.garnish} className="hw-order-cta-garnish left-[13%] top-[2%] z-30 w-[80%]" />
          <ArtLayer asset={ORDER_CTA_ASSETS.slogan} className="right-[0%] top-[15%] z-40 w-[23%]" />
        </div>
      </div>
    </section>
  );
}
