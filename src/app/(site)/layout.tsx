import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/three/SmoothScroll";
import { SITE } from "@/lib/site";

// Shared by every page, the landing page included: one header, one smooth scroller.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  openGraph: { type: "website", siteName: SITE.name, locale: "en_IN" },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      {children}
    </>
  );
}
