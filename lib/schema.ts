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
    telephone: site.contactPhoneE164,
    slogan: site.tagline,
    // `sameAs` links the brand to its social profiles for Google's
    // knowledge panel. Omitted entirely when no profiles are configured —
    // an empty array is noise, and a fake URL is worse.
    ...(site.socials.length > 0 ? { sameAs: site.socials } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.contactEmail,
      telephone: site.contactPhoneE164,
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

/**
 * LocalBusiness node. This is the schema that unlocks Google local-search
 * features (map pack, "near me" queries, business panel with hours). The
 * `address`, `telephone`, and `openingHoursSpecification` are what
 * Google actually uses to fill those surfaces, so keep them accurate.
 */
export function localBusiness(): JsonLdNode {
  return {
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#localbusiness`,
    name: site.name,
    url: site.url,
    parentOrganization: { '@id': ORG_ID },
    description: site.description,
    telephone: site.contactPhoneE164,
    email: site.contactEmail,
    priceRange: '৳৳',
    areaServed: ['BD', 'US', 'GB', 'SG'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...site.hours.days],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
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

export type Crumb = { name: string; url: string };

export function breadcrumbList(crumbs: Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export type PersonInput = {
  name: string;
  slug: string;
  jobTitle: string;
  bio: string;
  knowsAbout: string[];
  sameAs: string[];
};

export function person(p: PersonInput): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': `${absoluteUrl(`/founders/${p.slug}`)}#person`,
    name: p.name,
    url: absoluteUrl(`/founders/${p.slug}`),
    jobTitle: p.jobTitle,
    description: p.bio,
    worksFor: { '@id': ORG_ID },
    knowsAbout: p.knowsAbout,
    ...(p.sameAs.length > 0 ? { sameAs: p.sameAs } : {}),
  };
}

/** Combine nodes into a single @graph payload for one <script> tag. */
export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
