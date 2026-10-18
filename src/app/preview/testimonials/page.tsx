import type { Metadata } from "next";
import TestimonialsSection from "@/components/hungry-wrap/testimonials/TestimonialsSection";

export const metadata: Metadata = {
  title: "Testimonials preview — The Hungry Wrap",
  description: "Preview of the customer testimonials carousel, ahead of merging it into the homepage.",
  robots: { index: false, follow: false },
};

/**
 * Isolated preview route for the testimonials carousel. The spacer above is
 * taller than the viewport so the scroll entrance can be checked the way a
 * visitor meets it, rather than firing at load.
 */
export default function TestimonialsPreviewPage() {
  return (
    <div className="bg-[#fffaf2]">
      <div className="flex h-[125svh] items-end justify-center bg-[#fffaf2] px-6 pb-10 text-center">
        <p className="text-sm text-[#8a7a6c]">
          Preview build — scroll down for the section. The reviews are placeholder copy.
        </p>
      </div>

      <TestimonialsSection />

      <div className="h-[90svh] bg-[#fffaf2]" />
    </div>
  );
}
