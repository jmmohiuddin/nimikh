/**
 * Team roster. Real founders sourced from
 * Nimikh-Execution-Kit/05-website-copy/about-team-contact.md (ADR-06).
 * Fictional placeholders are prohibited (ADR-05); use a "hiring" entry
 * with `hiring: true` instead. When a role is filled, replace the entry.
 */
export type TeamMember = {
  name: string;
  role: string;
  initial: string;
  gradient: string;
  bio: string;
  chips: string[];
  /** Links to a full founder page (must exist in lib/founders.ts). */
  founderSlug?: string;
  /** Marks the card as an open role — replaces the bio with a hiring CTA. */
  hiring?: boolean;
};

export const team: TeamMember[] = [
  {
    name: 'Mohiuddin',
    role: 'Founder & CEO',
    initial: 'M',
    gradient: 'linear-gradient(135deg,#5e6ad2,#7c3aed)',
    bio: "Four-plus years across data analytics, full-stack MERN engineering, agile product lifecycle management, and tech-venture operations. Studying Data Science and Artificial Intelligence at IIT Guwahati. Leads Nimikh's global strategy, cross-border client scaling, and dual-entity financial pipeline.",
    chips: ['Strategy', 'Full-Stack', 'Business Development'],
    founderSlug: 'mohiuddin',
  },
  {
    name: 'Maruf Shezad',
    role: 'Founder & CXO',
    initial: 'M',
    gradient: 'linear-gradient(135deg,#ec4899,#7c3aed)',
    bio: "Leads user experience strategy, premium typography systems, behavioral-economic interface architecture, and brand alignment engineering. Owner of Nimikh's design-token architecture and visual identity.",
    chips: ['UX Strategy', 'Design Systems', 'Typography'],
    founderSlug: 'maruf-shezad',
  },
  {
    name: 'Growth Lead',
    role: 'Hiring — Q3 2026',
    initial: '＋',
    gradient: 'linear-gradient(135deg,#1a1a1d,#2a2a2f)',
    bio: "We're looking for a performance-marketing lead to own Meta, Google, and TikTok campaigns across our client roster. If you've managed ৳50M+ in ad spend and can prove sub-10% CAC on a scaled brand, come talk to us.",
    chips: ['Performance Marketing', 'Analytics'],
    hiring: true,
  },
];
