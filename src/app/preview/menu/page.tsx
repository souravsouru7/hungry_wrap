import type { Metadata } from "next";
import MenuSection from "@/components/sections/MenuSection";

export const metadata: Metadata = {
  title: "Menu preview — The Hungry Wrap",
  description: "Preview of The Hungry Wrap menu section.",
  robots: { index: false, follow: false },
};

export default function MenuPreviewPage() {
  return <MenuSection />;
}
