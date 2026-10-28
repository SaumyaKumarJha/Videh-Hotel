import type { Metadata } from "next";
import { BUSINESS as B } from "./business";

// The live web address. Set NEXT_PUBLIC_SITE_URL (e.g. https://www.yourdomain.com) in .env.local and on the host;
// canonical links, the sitemap, robots.txt and social previews are all built from it.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://videh.example")
).replace(/\/+$/, "");

export const SITE_NAME = B.tradeName;
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "Hotel Videh & Marriage Hall — wedding venue on Ranti Road, Madhubani" };

/** Per-page metadata with a canonical link and matching Open Graph / Twitter tags. */
export function pageMeta(o: { title: string; description: string; path: string; absolute?: boolean; images?: { url: string; width?: number; height?: number; alt?: string }[] }): Metadata {
  const full = o.absolute ? o.title : `${o.title} | Hotel Videh`;
  const images = o.images ?? [OG_IMAGE];
  return {
    title: o.absolute ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: { canonical: o.path },
    openGraph: { title: full, description: o.description, url: o.path, siteName: SITE_NAME, locale: "en_IN", type: "website", images },
    twitter: { card: "summary_large_image", title: full, description: o.description, images: images.map(i => i.url) },
  };
}

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

/** The business as structured data (schema.org), used on the home and hall pages. */
export function venueSchema(extra: Record<string, unknown> = {}) {
  return {
    "@type": ["EventVenue", "LocalBusiness"],
    "@id": `${SITE_URL}/#venue`,
    name: B.tradeName,
    url: `${SITE_URL}/`,
    image: [abs(OG_IMAGE.url)],
    logo: abs("/icon-512.png"),
    email: B.email,
    description: "Marriage hall and hotel on Ranti Road, Madhubani, Bihar, for tilak, haldi and matkor, vivah, reception and chaturthi.",
    address: { "@type": "PostalAddress", streetAddress: "Khesra No. 2083, Ranti Road, Near Gumti No. 13", addressLocality: "Madhubani", addressRegion: "Bihar", postalCode: "847211", addressCountry: "IN" },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${B.tradeName}, ${B.addressOneLine}`)}`,
    areaServed: { "@type": "AdministrativeArea", name: "Madhubani district, Bihar" },
    ...extra,
  };
}

export function breadcrumbs(items: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...items].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

/** Renders JSON-LD. `<` is escaped so text can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const graph = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
