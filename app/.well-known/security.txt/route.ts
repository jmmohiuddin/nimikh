import { site } from '@/lib/site';

/**
 * RFC 9116 security.txt (NIM-098). `Expires` must be in the future or
 * scanners flag it stale — we compute it one year out at request time so
 * it never silently expires. Update the Contact when a dedicated security
 * inbox exists.
 */
export function GET() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const body = [
    `Contact: mailto:${site.contactEmail}`,
    `Expires: ${expires.toISOString()}`,
    `Canonical: ${site.url}/.well-known/security.txt`,
    'Preferred-Languages: en, bn',
    `Policy: ${site.url}/legal/security`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  });
}
