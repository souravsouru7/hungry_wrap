import type { Metadata } from "next";
import FreshIngredientsSection from "@/components/hungry-wrap/fresh-ingredients/FreshIngredientsSection";

export const metadata: Metadata = {
  title: "Fresh Ingredients preview — The Hungry Wrap",
  description: "Preview of The Hungry Wrap Fresh Ingredients section.",
  robots: { index: false, follow: false },
};

export default function FreshIngredientsPreviewPage() {
  return <FreshIngredientsSection />;
}
