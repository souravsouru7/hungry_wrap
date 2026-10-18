import type { Metadata } from "next";
import WhyChooseUs from "@/components/hungry-wrap/why-choose-us/WhyChooseUs";

export const metadata: Metadata = {
  title: "Why Choose Us preview — The Hungry Wrap",
  description: "Preview of the Why Choose Us section, ahead of merging it into the homepage.",
  robots: { index: false, follow: false },
};

/**
 * Isolated preview route for the Why Choose Us section, matching
 * `/preview/hero`. The spacers above and below exist so the scroll entrance
 * and the ingredient parallax can be checked the way a visitor meets them —
 * scrolled into view, not already on screen at load.
 *
 * Once this is approved, render <WhyChooseUs /> from the homepage instead.
 */
export default function WhyChooseUsPreviewPage() {
  return (
    <div className="bg-[#fff9f0]">
      <div className="flex h-[125svh] items-end justify-center bg-[#fff9f0] px-6 pb-10 text-center">
        <p className="text-sm text-[#8a7a6c]">
          Preview build — scroll down for the section. Nothing here is a live page.
        </p>
      </div>

      <WhyChooseUs />

      <div className="h-[90svh] bg-[#fff9f0]" />
    </div>
  );
}
