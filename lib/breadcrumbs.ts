import { absoluteUrl } from './site';

export type Crumb = { name: string; path: string; url: string };

/**
 * Human-readable labels for path segments where title-casing the slug
 * isn't good enough. Add overrides here when a new slug needs a nicer name
 * (NIM-012). Keys are individual path segments, not full paths.
 */
const LABELS: Record<string, string> = {
  services: 'Services',
  software: 'Software Development',
  marketing: 'Growth Marketing',
  creative: 'Creative Studio',
  marketplace: 'Creator Marketplace',
  pricing: 'Pricing',
  'case-studies': 'Case Studies',
  contact: 'Contact',
  faq: 'FAQ',
  about: 'About',
  legal: 'Legal',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  security: 'Security',
  entity: 'Company Entity',
  compliance: 'Compliance',
  founders: 'Founders',
};

function labelFor(segment: string): string {
  if (LABELS[segment]) return LABELS[segment];
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Turn a pathname into a breadcrumb trail rooted at Home. Returns an empty
 * array for the homepage (no breadcrumb there). The trail the UI renders
 * and the trail fed to BreadcrumbList schema come from this one function,
 * so they can never disagree — which Google requires.
 */
export function deriveBreadcrumbs(pathname: string): Crumb[] {
  const clean = pathname.split('?')[0].replace(/\/$/, '');
  if (clean === '' || clean === '/') return [];

  const segments = clean.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ name: 'Home', path: '/', url: absoluteUrl('/') }];

  let acc = '';
  for (const seg of segments) {
    acc += `/${seg}`;
    crumbs.push({ name: labelFor(seg), path: acc, url: absoluteUrl(acc) });
  }
  return crumbs;
}
