import type { Metadata } from "next";
import OurStorySection from "@/components/hungry-wrap/our-story/OurStorySection";

export const metadata: Metadata = {
  title: "Our Story preview — The Hungry Wrap",
  description: "Preview of The Hungry Wrap Our Story section.",
  robots: { index: false, follow: false },
};

export default function OurStoryPreviewPage() {
  return <OurStorySection />;
}
