import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/**
 * robots.txt (NIM-005). Nimikh's stance from strategy §3.2: welcome LLM
 * crawlers on equal footing with search bots — no rate limits, no
 * challenges. Each is granted `Allow: /` explicitly so scraper defaults
 * that respect UA-specific rules find something to obey.
 */
const LLM_BOTS = [
  'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended',
  'CCBot', 'Applebot-Extended', 'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Previously `/*?*`, which blocked every URL carrying a query string —
        // including /contact?intent=…&role=…, a real, linkable route that
        // app/contact/page.tsx reads via searchParams. Tracking params are
        // already stripped at the edge in middleware.ts, so the blanket rule
        // was defending against a problem that no longer exists while making
        // a live page uncrawlable. Audit §5 (T1).
        // Auth-gated dashboard trees are meta-noindexed in their layouts;
        // disallowing them here also saves crawlers the redirect round-trip.
        disallow: [
          '/api/', '/preview/',
          '/admin/', '/admin', '/creator/', '/creator',
          '/agent/', '/agent', '/client/', '/client', '/login',
        ],
      },
      ...LLM_BOTS.map((bot) => ({
        userAgent: bot,
        allow: '/',
      })),
    ],
    // The sitemap index at /sitemap.xml (app/sitemap.xml/route.ts) lists
    // each split sitemap; crawlers walk it once to discover them all.
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
