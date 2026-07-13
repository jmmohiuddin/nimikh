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
        disallow: ['/api/', '/preview/', '/*?*'],
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
