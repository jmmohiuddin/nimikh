import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge middleware — NIM-004 (security headers, LLM allowlist) and
 * NIM-061 (strip tracking params). Runs on every non-static request.
 *
 * Security headers are set here rather than in next.config.ts's headers()
 * so downstream `req` mutations (UTM strip, lowercase redirect) share the
 * same response pipeline. Static assets skip this via the matcher below.
 *
 * CSP note: the pre-Next.js design uses heavy inline `style={{...}}`
 * props, so `style-src` needs 'unsafe-inline' until a component-by-
 * component refactor lands. Script CSP is tight; keep it that way.
 */

const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'msclkid', '_hsenc', '_hsmi', 'mc_cid', 'mc_eid',
]);

/**
 * LLM crawlers we intentionally welcome — strategy §3.2 & NIM-005.
 * Middleware never rate-limits or challenges these; robots.txt explicitly
 * grants them Allow: /.
 */
const LLM_BOTS = [
  'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended',
  'CCBot', 'Applebot-Extended', 'Bytespider',
];

function buildCsp(): string {
  const isDev = process.env.NODE_ENV !== 'production';
  const scriptExtras = isDev ? " 'unsafe-eval' 'unsafe-inline'" : " 'unsafe-inline'";
  return [
    "default-src 'self'",
    `script-src 'self'${scriptExtras}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  // Report-Only for now so a mis-tuned directive shows in the console
  // without blocking the page. Flip to `Content-Security-Policy` after
  // NIM-004b removes inline styles in the app tree.
  res.headers.set('Content-Security-Policy-Report-Only', buildCsp());
  return res;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const ua = req.headers.get('user-agent') ?? '';

  // 1. UTM / click-id strip (NIM-061). Preserve params in analytics via
  //    the Referer/document.referrer chain; we just remove them from the
  //    displayed URL.
  let stripped = false;
  for (const key of Array.from(url.searchParams.keys())) {
    if (TRACKING_PARAMS.has(key)) {
      url.searchParams.delete(key);
      stripped = true;
    }
  }
  if (stripped) {
    return applySecurityHeaders(NextResponse.redirect(url, 301));
  }

  // 2. Lowercase path enforcement. Uppercase hits get a 301 to lowercase.
  if (/[A-Z]/.test(url.pathname)) {
    const cleaned = url.clone();
    cleaned.pathname = url.pathname.toLowerCase();
    return applySecurityHeaders(NextResponse.redirect(cleaned, 301));
  }

  // 3. Pass through with headers. Bot allowlist is informational — the
  //    matcher already lets these through; noting them here so a later
  //    edge rule (rate limiting, JS challenges) can special-case them.
  const isLlmBot = LLM_BOTS.some((b) => ua.includes(b));
  const res = NextResponse.next();
  if (isLlmBot) {
    res.headers.set('x-bot-allowlist', 'llm');
  }
  // Best-effort geo signal for downstream currency selection (NIM-117).
  // `geo.country` is present on Vercel/Cloudflare edges; empty locally.
  const country =
    (req as unknown as { geo?: { country?: string } }).geo?.country ??
    req.headers.get('x-vercel-ip-country') ??
    '';
  if (country) res.headers.set('x-country', country);
  return applySecurityHeaders(res);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next internals (chunks, image optimizer)
     *  - static assets (favicon, robots, sitemaps served by Next)
     *  - API routes (they set their own headers)
     */
    '/((?!_next/static|_next/image|api|favicon.ico|robots.txt|sitemap.xml|.well-known).*)',
  ],
};
