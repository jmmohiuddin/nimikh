/**
 * Static content manifest — the source of truth for sitemap population
 * until Contentful (NIM-020) lands. Each entry corresponds to a real
 * App Router route in this repo. Adding a new page? Add it here or
 * sitemap emissions and internal-link audits will miss it.
 */
import { founders } from './founders';

export type SitemapEntry = {
  path: string;
  /** Sitemap priority per strategy §3.2. */
  priority: number;
  /** Change frequency hint for crawlers (not authoritative). */
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
};

/** Top-level static pages that aren't a service or case study. */
export const pageEntries: SitemapEntry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/marketplace', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
];

/** Service pillars. Sub-pages match /services/[slug]. */
export const serviceEntries: SitemapEntry[] = [
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/services/software', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/services/marketing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/services/creative', priority: 0.9, changeFrequency: 'weekly' },
];

/**
 * Case-study index only — individual case-study pages become dynamic
 * routes once the Contentful CaseStudy content type ships (NIM-020).
 */
export const caseStudyEntries: SitemapEntry[] = [
  { path: '/case-studies', priority: 0.7, changeFrequency: 'weekly' },
];

/**
 * Founder profiles. Derived from lib/founders.ts at build time so a new
 * founder shows up in the sitemap without a second edit here.
 */
export const founderEntries: SitemapEntry[] = founders.map((f) => ({
  path: `/founders/${f.slug}`,
  priority: 0.6,
  changeFrequency: 'monthly',
}));
