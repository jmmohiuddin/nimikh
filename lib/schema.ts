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
    areaServed: ['BD', 'AE', 'US', 'GB', 'SG'],
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
    areaServed: ['BD', 'AE', 'US', 'GB', 'SG'],
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

export type ServiceInput = {
  /** Public-facing service name, e.g. "Custom Software Development". */
  name: string;
  /** Site-relative path the service lives at, e.g. "/services/software". */
  path: string;
  description: string;
  /**
   * schema.org serviceType — the category term Google matches against.
   * Keep this a recognised industry label, not marketing copy.
   */
  serviceType: string;
  /** Concrete deliverables. Becomes an OfferCatalog of child services. */
  offerings: string[];
  /** Lowest real starting price in BDT. Omit rather than guess. */
  startingPriceBDT?: number;
};

/**
 * Service node for an individual service page (NIM-010 extension).
 *
 * Why this exists: `professionalService()` declares that Nimikh offers
 * these services at the org level, but each /services/* page needs its
 * own addressable node so Google can associate the page with the service
 * entity rather than inferring it from body copy. `provider` points at
 * the shared ORG_ID so everything stays one graph.
 *
 * Deliberately omits aggregateRating — see docs/seo/01-technical-and-
 * content-audit.md §7. Rating markup requires verifiable review data;
 * inventing it risks a manual action.
 */
export function service(s: ServiceInput): JsonLdNode {
  const url = absoluteUrl(s.path);
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: s.name,
    url,
    description: s.description,
    serviceType: s.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: ['BD', 'AE', 'US', 'GB', 'SG'],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      servicePhone: site.contactPhoneE164,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${s.name} services`,
      itemListElement: s.offerings.map((o) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: o },
      })),
    },
    ...(s.startingPriceBDT
      ? {
          offers: {
            '@type': 'Offer',
            price: s.startingPriceBDT,
            priceCurrency: 'BDT',
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: s.startingPriceBDT,
              priceCurrency: 'BDT',
              valueAddedTaxIncluded: false,
            },
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
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
