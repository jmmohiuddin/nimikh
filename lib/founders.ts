/**
 * Founder profiles (NIM-018/037). Content is drawn from the existing
 * About-page copy — no invented credentials. `sameAs` is intentionally
 * empty until real LinkedIn/GitHub/X URLs are supplied; a fabricated
 * profile link would be worse than none for E-E-A-T.
 *
 * Add a founder here and they get a /founders/[slug] page, Person schema,
 * a sitemap entry, and a link from the About team section automatically.
 */
export type Founder = {
  slug: string;
  name: string;
  jobTitle: string;
  initial: string;
  gradient: string;
  bio: string;
  focus: string[];
  knowsAbout: string[];
  sameAs: string[];
};

export const founders: Founder[] = [
  {
    slug: 'mohiuddin',
    name: 'Mohiuddin',
    jobTitle: 'Founder & CEO',
    initial: 'M',
    gradient: 'linear-gradient(135deg,#5e6ad2,#7c3aed)',
    bio: 'Visionary behind Nimikh. Passionate about connecting local creative talent with businesses that need them, and about making world-class software, marketing, and creative work affordable for small businesses across Bangladesh.',
    focus: ['Strategy', 'Business Development'],
    knowsAbout: [
      'Digital strategy',
      'Business development',
      'Creator marketplaces',
      'Small business growth',
    ],
    sameAs: [],
  },
];

export function getFounder(slug: string): Founder | undefined {
  return founders.find((f) => f.slug === slug);
}
