import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only real, indexable pages (no redirects, no staff pages). lastModified is the build date.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number][] = [["/", 1], ["/hall", 0.9], ["/enquire", 0.8], ["/contact", 0.7], ["/about", 0.6], ["/faq", 0.6], ["/policies", 0.3], ["/privacy", 0.2], ["/terms", 0.2]];
  return pages.map(([p, priority]) => ({ url: `${SITE_URL}${p === "/" ? "/" : p}`, lastModified: now, priority }));
}
