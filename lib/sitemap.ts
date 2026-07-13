import type { SitemapEntry } from './pages';
import { pageEntries, serviceEntries, caseStudyEntries, founderEntries } from './pages';
import { absoluteUrl } from './site';

/**
 * Sitemap generation (NIM-006). Uses hand-rolled route handlers instead
 * of Next.js's `sitemap.ts` metadata convention because that convention
 * silently overrides the `sitemap:` field in robots.ts to a hardcoded
 * `/sitemap.xml` — which conflicts with `generateSitemaps`, since the
 * latter emits split files at `/sitemap/{id}.xml` and never creates an
 * index at the root.
 */

export const SITEMAP_BUCKETS = {
  pages: pageEntries,
  services: serviceEntries,
  'case-studies': caseStudyEntries,
  founders: founderEntries,
} satisfies Record<string, SitemapEntry[]>;

export type SitemapId = keyof typeof SITEMAP_BUCKETS;

export function renderUrlset(entries: SitemapEntry[]): string {
  const now = new Date().toISOString();
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${absoluteUrl(e.path)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function renderSitemapIndex(): string {
  const now = new Date().toISOString();
  const items = (Object.keys(SITEMAP_BUCKETS) as SitemapId[])
    .map(
      (id) => `  <sitemap>
    <loc>${absoluteUrl(`/sitemap/${id}.xml`)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>
`;
}

export const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
} as const;
