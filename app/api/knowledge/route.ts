import { createHash } from 'node:crypto';
import { facts, services } from '@/lib/knowledge';
import { absoluteUrl, site } from '@/lib/site';

/**
 * /api/knowledge (NIM-081) — machine-readable digest of Nimikh facts,
 * no auth, ETag-cached. robots.txt disallows /api/* for the wildcard
 * agent, but the explicit LLM-bot user-agents get Allow: / and can read
 * this — which is exactly the intended audience for a knowledge endpoint.
 */
export function GET(req: Request) {
  const payload = {
    '@context': 'https://schema.org',
    name: site.name,
    url: site.url,
    description: facts.description,
    location: facts.foundedLocation,
    areaServed: facts.serviceArea,
    languages: facts.languages,
    currency: facts.currency,
    email: facts.contactEmail,
    paymentMethods: facts.paymentMethods,
    differentiators: facts.differentiators,
    stats: facts.stats,
    services: services.map((s) => ({
      name: s.name,
      url: absoluteUrl(s.path),
      summary: s.summary,
      startingPriceBDT: s.startingPriceBDT ?? null,
    })),
    generatedAt: new Date().toISOString().slice(0, 10),
  };

  const body = JSON.stringify(payload, null, 2);
  // Hash the stable content (exclude generatedAt's time-of-day by using
  // the date-only field already in the payload) so the ETag only changes
  // when the facts change.
  const etag = `"${createHash('sha1').update(body).digest('hex').slice(0, 16)}"`;

  if (req.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
      ETag: etag,
    },
  });
}
