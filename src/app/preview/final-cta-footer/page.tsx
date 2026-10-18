import type { Metadata } from "next";
import FinalCtaFooter from "@/components/FinalCtaFooter";

export const metadata: Metadata = {
  title: "Final CTA and footer preview — The Hungry Wrap",
  description: "Preview of The Hungry Wrap final CTA and footer.",
  robots: { index: false, follow: false },
};

export default function FinalCtaFooterPreviewPage() {
  return <FinalCtaFooter orderHref="#order" />;
}
