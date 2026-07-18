/**
 * Single source of truth for site-wide constants. Anything that would
 * otherwise be hardcoded across metadata, sitemaps, robots.txt, or schema
 * lives here so a change to the domain or brand name flows everywhere.
 */
export const site = {
  name: 'Nimikh',
  tagline: 'Build. Market. Create.',
  description:
    'Nimikh builds affordable custom software — CRM, ERP, POS, inventory and business automation systems — and runs performance marketing for small and medium businesses in Bangladesh and the UAE.',
  /** Canonical origin, no trailing slash. Override with NEXT_PUBLIC_SITE_URL for previews. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'https://nimikh.com',
  locale: 'en-BD',
  /**
   * Canonical contact. Sourced from
   * Nimikh-Execution-Kit/05-website-copy/about-team-contact.md. All
   * mailto: links, JSON-LD contactPoint, llms.txt, and the /contact page
   * read from here — change here, changes everywhere.
   */
  contactEmail: 'hey@nimikh.com',
  contactPhoneE164: '+8801335857104',
  contactPhoneDisplay: '+880 1335 857104',
  address: {
    street: 'Road 1, Building No 30, Dhaka Uddan, Mohammadpur',
    locality: 'Dhaka',
    postalCode: '1207',
    country: 'BD',
  },
  /** Opening hours in schema.org OpeningHoursSpecification format. */
  hours: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const,
    opens: '09:00',
    closes: '19:00',
    timeZone: 'Asia/Dhaka',
    displayLabel: 'Sunday – Thursday, 09:00 – 19:00 BST',
  },
  /**
   * Public social/profile URLs. These become schema.org `sameAs` on the
   * Organization node, which is how Google associates the brand with its
   * profiles for a knowledge panel. Add real URLs as they go live — leave
   * empty rather than pointing at placeholders (a bad sameAs hurts trust).
   */
  socials: [
    'https://www.facebook.com/nimikh.technologies/',
  ] as string[],
  /**
   * Search-engine ownership verification tokens. Paste the value Google
   * Search Console / Bing Webmaster gives you (env var so it isn't in the
   * repo). Consumed by app/layout.tsx metadata.verification.
   */
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? '',
    bing: process.env.BING_SITE_VERIFICATION ?? '',
  },
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
