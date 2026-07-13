/**
 * Naive per-IP token bucket, memoised on globalThis.
 *
 * Good enough for a marketing site's contact/feedback forms — the abuse
 * pattern to prevent is a scripted flood of dozens per second, not a
 * sophisticated adversary. When traffic scales past a single instance,
 * swap the backing store for Redis without changing the call site.
 */
type Bucket = { tokens: number; lastRefillMs: number };

declare global {
  var __nimikhRl: Map<string, Bucket> | undefined;
}

const buckets: Map<string, Bucket> = globalThis.__nimikhRl ?? new Map();
if (process.env.NODE_ENV !== 'production') globalThis.__nimikhRl = buckets;

export type RateLimitOptions = {
  /** Bucket capacity (max burst). */
  capacity: number;
  /** Tokens refilled per second. */
  refillPerSec: number;
};

export function checkRateLimit(key: string, opts: RateLimitOptions): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: opts.capacity, lastRefillMs: now };
  const elapsedSec = (now - b.lastRefillMs) / 1000;
  b.tokens = Math.min(opts.capacity, b.tokens + elapsedSec * opts.refillPerSec);
  b.lastRefillMs = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return { ok: false, retryAfterSec: Math.ceil((1 - b.tokens) / opts.refillPerSec) };
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  const h = new Headers(req.headers);
  return (
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    'unknown'
  );
}
