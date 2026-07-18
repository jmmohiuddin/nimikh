import { site } from '@/lib/site';

/**
 * Footer content. Externalized (ADR-04) so an admin content editor
 * eventually swaps this file for a DB fetch without touching page components.
 */

export type FooterLink = { href: string; label: string; external?: boolean };

export const footerServices: FooterLink[] = [
  { href: '/services/software', label: 'Software Development' },
  { href: '/services/marketing', label: 'Growth Marketing' },
  { href: '/services/creative', label: 'Creative Studio' },
  { href: '/marketplace', label: 'Creator Marketplace' },
];

export const footerCompany: FooterLink[] = [
  { href: '/about', label: 'About Us' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

export const footerConnect: FooterLink[] = [
  { href: '/contact', label: 'Contact' },
  { href: `mailto:${site.contactEmail}`, label: site.contactEmail, external: true },
  { href: '/feedback', label: 'Send feedback' },
];

export const footerLegal: FooterLink[] = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/security', label: 'Security' },
];

/**
 * Social profiles. Only list a platform once its profile is actually live —
 * these previously rendered as `href="#"`, putting four dead links on every
 * page of the site (audit §5, T4). Every URL added here should also go into
 * `lib/site.ts` → `socials` so it emits as schema.org `sameAs`, which is how
 * Google links the domain to the profile for Knowledge Panel purposes.
 */
export const footerSocial: FooterLink[] = [
  { href: 'https://www.facebook.com/nimikh.technologies/', label: 'Facebook', external: true },
];
