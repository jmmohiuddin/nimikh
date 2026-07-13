import { absoluteUrl, site } from './site';

/**
 * Typed JSON-LD builders (NIM-010, scoped to what the site emits today).
 * Stable @id scheme per the spec: `${site.url}/#<entity>` — every page
 * that references the org points at the same node so Google merges them
 * into one entity graph.
 *
 * The spec's full builder set (Article, TechArticle, DefinedTerm, Person
 * with founder data, Review…) lands alongside the Contentful content
 * types that feed them (E02/E03).
 */

export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

type JsonLdNode = Record<string, unknown>;

export function organization(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contactEmail,
    slogan: site.tagline,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.contactEmail,
      availableLanguage: ['en', 'bn'],
    },
  };
}

export function webSite(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: site.url,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

export function professionalService(): JsonLdNode {
  return {
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#service`,
    name: site.name,
    url: site.url,
    parentOrganization: { '@id': ORG_ID },
    description: site.description,
    areaServed: ['BD', 'US', 'GB', 'SG'],
    priceRange: '৳৳',
    knowsAbout: [
      'Software development',
      'E-commerce development',
      'Performance marketing',
      'Search engine optimisation',
      'Short-form video production',
      'Graphic design',
    ],
    makesOffer: [
      offer('Software Development', absoluteUrl('/services/software')),
      offer('Growth Marketing', absoluteUrl('/services/marketing')),
      offer('Creative Studio', absoluteUrl('/services/creative')),
      offer('Creator Marketplace', absoluteUrl('/marketplace')),
    ],
  };
}

function offer(name: string, url: string): JsonLdNode {
  return {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name, url, provider: { '@id': ORG_ID } },
  };
}

export type FaqItem = { question: string; answer: string };

export function faqPage(items: FaqItem[], pageUrl: string): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}

/** Combine nodes into a single @graph payload for one <script> tag. */
export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
