/**
 * Single source of truth for site-wide constants. Anything that would
 * otherwise be hardcoded across metadata, sitemaps, robots.txt, or schema
 * lives here so a change to the domain or brand name flows everywhere.
 */
export const site = {
  name: 'Nimikh',
  tagline: 'Build. Market. Create.',
  description:
    'Nimikh is your complete digital growth partner — we build custom software, run high-performance marketing, and connect your brand with talented local creators.',
  /** Canonical origin, no trailing slash. Override with NEXT_PUBLIC_SITE_URL for previews. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'https://nimikh.tech',
  locale: 'en-BD',
  contactEmail: 'hello@nimikh.com',
  /** Nav order matches the pre-Next.js static site 1:1. */
  nav: [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/case-studies', label: 'Work' },
    { href: '/contact', label: 'Contact' },
  ] as const,
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(pathname: string): string {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${site.url}${clean}`;
}
