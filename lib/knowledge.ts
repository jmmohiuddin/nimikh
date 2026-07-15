import { site } from './site';

/**
 * Structured facts about Nimikh — the single source feeding both the
 * machine-readable knowledge endpoint (NIM-081) and llms.txt (NIM-075).
 * Keep this in sync with the marketing copy on the pages; when Contentful
 * lands, these become CMS queries.
 */

export type ServiceFact = {
  name: string;
  path: string;
  summary: string;
  startingPriceBDT?: number;
};

export const services: ServiceFact[] = [
  {
    name: 'Software Development',
    path: '/services/software',
    summary:
      'Custom websites, e-commerce stores, and web applications. Specialises in bKash/Nagad payments and Pathao/Steadfast/RedX courier integrations for the Bangladeshi market.',
    startingPriceBDT: 25000,
  },
  {
    name: 'Growth Marketing',
    path: '/services/marketing',
    summary:
      'Performance advertising on Meta, Google, and TikTok, plus SEO, social media management, and email automation. Month-to-month retainers with no lock-in.',
    startingPriceBDT: 15000,
  },
  {
    name: 'Creative Studio',
    path: '/services/creative',
    summary:
      'Short-form video, motion graphics, graphic design, photography, and copywriting — produced in-house and via the creator marketplace.',
    startingPriceBDT: 1500,
  },
  {
    name: 'Creator Marketplace',
    path: '/marketplace',
    summary:
      '240+ verified local creators hireable directly with escrow protection. Minimum order ৳3,000; Nimikh takes a 20% platform commission.',
    startingPriceBDT: 3000,
  },
];

export const facts = {
  legalName: site.name,
  description: site.description,
  foundedLocation: `${site.address.street}, ${site.address.locality} ${site.address.postalCode}, Bangladesh`,
  serviceArea: ['Bangladesh', 'United States', 'United Kingdom', 'Singapore'],
  languages: ['English', 'Bangla'],
  currency: 'BDT',
  contactEmail: site.contactEmail,
  contactPhone: site.contactPhoneE164,
  businessHours: site.hours.displayLabel,
  paymentMethods: ['bKash', 'Nagad', 'Bank transfer', 'Stripe', 'Payoneer', 'Wise'],
  differentiators: [
    'Software, marketing, and creative under one agency',
    'Escrow-protected marketplace payments',
    'Pricing built for small businesses, not enterprise budgets',
    'Fluent in both Bangla and English',
  ],
  stats: {
    projectsDelivered: 152,
    clients: 80,
    verifiedCreators: 240,
    averageCampaignRoi: '+340%',
  },
} as const;
