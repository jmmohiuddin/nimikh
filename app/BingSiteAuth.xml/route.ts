/**
 * Bing Webmaster "XML file" verification (NIM-088). Bing gives you a token
 * and expects it served at /BingSiteAuth.xml. We emit it from the
 * BING_SITE_AUTH env var so the token isn't committed. Absent token → 404,
 * so we never serve a placeholder that would fail verification.
 *
 * Note: the camelCase filename is deliberate — Bing fetches exactly
 * `BingSiteAuth.xml`. The middleware skips its lowercase redirect for
 * paths with a file extension so this URL isn't rewritten.
 */
export function GET() {
  const token = process.env.BING_SITE_AUTH?.trim();
  if (!token) {
    return new Response('Not found', { status: 404 });
  }
  const body = `<?xml version="1.0"?>\n<users>\n\t<user>${token}</user>\n</users>\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
