import type { MetadataRoute } from "next";

import { NAV_LINKS, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV_LINKS.map(({ href }) => ({ url: `${SITE.url}${href === "/" ? "" : href}` }));
}
