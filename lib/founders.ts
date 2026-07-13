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
    bio: "Four-plus years across data analytics, full-stack MERN engineering, agile product lifecycle management, and tech-venture operations. Studying Data Science and Artificial Intelligence at IIT Guwahati. Leads Nimikh's global strategy, cross-border client scaling, and dual-entity financial pipeline.",
    focus: ['Global strategy', 'Full-stack engineering', 'Business development'],
    knowsAbout: [
      'Data science',
      'Full-stack MERN engineering',
      'Product lifecycle management',
      'Cross-border client scaling',
      'Applied AI',
    ],
    sameAs: ['https://www.linkedin.com/in/jm-mohiuddin/'],
  },
  {
    slug: 'maruf-shezad',
    name: 'Maruf Shezad',
    jobTitle: 'Founder & CXO',
    initial: 'M',
    gradient: 'linear-gradient(135deg,#ec4899,#7c3aed)',
    bio: "Leads user experience strategy, premium typography systems, behavioral-economic interface architecture, and brand alignment engineering. Owner of Nimikh's design-token architecture and visual identity.",
    focus: ['UX strategy', 'Design systems', 'Brand engineering'],
    knowsAbout: [
      'User experience strategy',
      'Premium typography',
      'Behavioral-economic UX',
      'Design tokens',
      'Brand architecture',
    ],
    sameAs: [],
  },
];

export function getFounder(slug: string): Founder | undefined {
  return founders.find((f) => f.slug === slug);
}
