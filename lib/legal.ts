/**
 * Legal page content (NIM-038, 095–097). These carry placeholder-but-
 * structured copy and are `noindex` until a lawyer signs off — flip
 * `signedOff` to true per page once reviewed, and the metadata layer will
 * start indexing it (see app/legal/[page]/page.tsx).
 *
 * `lastModified` feeds both the visible "Last updated" line and the
 * dateModified in JSON-LD; keep it ISO (UTC) so schema and UI match.
 */

export type LegalSection = { heading: string; body: string[] };

export type ChangelogEntry = { date: string; note: string };

export type LegalPage = {
  slug: string;
  title: string;
  metaDescription: string;
  lastModified: string; // ISO date
  signedOff: boolean;
  intro: string;
  sections: LegalSection[];
  changelog: ChangelogEntry[];
};

const UPDATED = '2026-07-01';

export const legalPages: LegalPage[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    metaDescription:
      'How Nimikh collects, uses, and protects your personal data, including our GDPR and PDPA 2026 commitments.',
    lastModified: UPDATED,
    signedOff: false,
    intro:
      'This policy explains what personal data Nimikh collects, why we collect it, and the choices you have. It is written to align with the EU GDPR, Bangladesh’s PDPA 2026, and the California CPRA where applicable.',
    sections: [
      {
        heading: 'Data we collect',
        body: [
          'Contact details you submit through our forms (name, email, phone, company).',
          'Project details you share when requesting a quote or brief.',
          'Standard analytics data (pages viewed, approximate location, device type), collected only after you consent.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To respond to your enquiry and deliver the services you request.',
          'To improve our website and understand which content is useful.',
          'We never sell your personal data or share it with third parties for their own marketing.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can request access to, correction of, or deletion of your personal data at any time.',
          'You can withdraw analytics consent at any time via the cookie preferences.',
          'To exercise any right, email our Data Protection contact at hello@nimikh.com.',
        ],
      },
    ],
    changelog: [{ date: UPDATED, note: 'Initial version published for review.' }],
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    metaDescription:
      'The terms governing your use of the Nimikh website, services, and creator marketplace.',
    lastModified: UPDATED,
    signedOff: false,
    intro:
      'These terms govern your use of the Nimikh website and services, including the creator marketplace. By engaging Nimikh you agree to them.',
    sections: [
      {
        heading: 'Engagements and scope',
        body: [
          'Every project begins with a written proposal defining scope, price, and timeline. Work outside that scope is quoted separately as a change request.',
          'Payment milestones and deliverables are set out in each proposal.',
        ],
      },
      {
        heading: 'Marketplace and escrow',
        body: [
          'Marketplace payments are held in escrow and released to the creator only on your approval of the deliverable.',
          'Standard orders include one revision round; disputes are mediated by Nimikh.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'On final payment, ownership of commissioned deliverables transfers to you, including source code and design files.',
        ],
      },
    ],
    changelog: [{ date: UPDATED, note: 'Initial version published for review.' }],
  },
  {
    slug: 'security',
    title: 'Security',
    metaDescription:
      'Nimikh’s security posture: standards alignment, data handling, and how to report a vulnerability.',
    lastModified: UPDATED,
    signedOff: false,
    intro:
      'We take the security of client data and the software we build seriously. This page summarises our posture and how to reach us about a vulnerability.',
    sections: [
      {
        heading: 'Standards alignment',
        body: [
          'Our engineering practices are aligned with ISO 9001 and ISO 27001 principles and with GDPR and PDPA 2026 data-handling requirements.',
          'Secrets are stored in managed secret stores, never in source control, and rotated on a regular schedule.',
        ],
      },
      {
        heading: 'Data handling',
        body: [
          'Lead and form data flows only through server-side APIs — never through client-side analytics or URLs.',
          'Access to client environments is least-privilege and logged.',
        ],
      },
      {
        heading: 'Reporting a vulnerability',
        body: [
          'Found a security issue? Email hello@nimikh.com with details and steps to reproduce.',
          'Our machine-readable policy lives at /.well-known/security.txt.',
        ],
      },
    ],
    changelog: [{ date: UPDATED, note: 'Initial version published for review.' }],
  },
  {
    slug: 'entity',
    title: 'Company Entity',
    metaDescription:
      'Nimikh’s corporate registration, memberships, and jurisdictional details.',
    lastModified: UPDATED,
    signedOff: false,
    intro:
      'Corporate and registration details for Nimikh. Registration numbers and memberships are pending final confirmation and are marked as such.',
    sections: [
      {
        heading: 'Registration',
        body: [
          'Nimikh operates from Dhaka, Bangladesh.',
          'RJSC registration number: pending confirmation.',
          'BASIS membership: pending confirmation.',
        ],
      },
      {
        heading: 'Contact',
        body: ['General and legal correspondence: hello@nimikh.com.'],
      },
    ],
    changelog: [{ date: UPDATED, note: 'Initial version published for review.' }],
  },
  {
    slug: 'compliance',
    title: 'Compliance',
    metaDescription:
      'Regulatory frameworks Nimikh aligns with, including GDPR, PDPA 2026, and CPRA.',
    lastModified: UPDATED,
    signedOff: false,
    intro:
      'This page lists the regulatory frameworks we design our services and data handling around.',
    sections: [
      {
        heading: 'Frameworks',
        body: [
          'EU General Data Protection Regulation (GDPR).',
          'Bangladesh Personal Data Protection Act 2026 (PDPA 2026).',
          'California Privacy Rights Act (CPRA), where applicable to US clients.',
        ],
      },
      {
        heading: 'Data processing',
        body: [
          'We act as a data processor for client project data and as a controller for our own enquiry data.',
          'Sub-processors are limited to the infrastructure and analytics providers named in our Privacy Policy.',
        ],
      },
    ],
    changelog: [{ date: UPDATED, note: 'Initial version published for review.' }],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return legalPages.find((p) => p.slug === slug);
}
