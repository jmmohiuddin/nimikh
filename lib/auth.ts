import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Role, SessionUser } from './users';

/**
 * Role-bearing session cookie (the RBAC layer).
 *
 * Reuses the signed-token approach from lib/session.ts (which remains for
 * the legacy password-only admin), but the payload now carries identity:
 *
 *   base64url(JSON{ uid, role, name, email, exp }) . hmacSha256(payload)
 *
 * Verification checks the HMAC and expiry — no DB round-trip on every
 * request. Dashboards that need fresh profile data fetch by `uid`.
 *
 * Secret: ADMIN_SESSION_SECRET (shared with the legacy admin session so
 * rotating it invalidates everything — the intended panic button).
 *
 * Fallback ladder when the env var is missing:
 *   - dev/preview: built-in dev secret, always.
 *   - production WITHOUT a database (pure demo mode): built-in demo secret.
 *     Demo mode's accounts are public by design (documented in the README),
 *     so a static signing key exposes nothing those accounts don't already;
 *     and being static it verifies consistently across serverless instances,
 *     which a per-boot random secret would not.
 *   - production WITH a database: env var is REQUIRED. Real accounts and
 *     real data must never run on a publicly-known signing key.
 */

export const SESSION_COOKIE = 'nimikh_session';
const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const DEV_SECRET = 'nimikh-dev-only-session-secret-change-me';

type SessionPayload = { uid: string; role: Role; name: string; email: string; exp: number };

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV !== 'production') return DEV_SECRET;
  // Production demo mode (no DB): allow the static secret so the deployed
  // site is log-in-able out of the box with the demo accounts.
  if (!process.env.MONGODB_URI?.trim()) return DEV_SECRET;
  // Production with a real database but no configured secret — refuse to
  // mint or verify sessions; treat as "auth unconfigured".
  return '';
}

export function isAuthConfigured(): boolean {
  return getSecret() !== '';
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

function encode(payload: SessionPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body, secret)}`;
}

function decode(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  if (!safeEqualHex(sig, sign(body, secret))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Mint a session token for a freshly authenticated user. Null if unconfigured. */
export function mintSession(user: SessionUser, ttlMs = DEFAULT_TTL_MS): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload: SessionPayload = {
    uid: user.id, role: user.role, name: user.name, email: user.email, exp: Date.now() + ttlMs,
  };
  return encode(payload, secret);
}

/** Read + verify the current session cookie. Returns identity, no DB hit. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return decode(jar.get(SESSION_COOKIE)?.value);
}

/**
 * Read the session and redirect to /login if absent — the null-safe
 * counterpart to `getSession()` for pages/actions nested under a layout
 * that already called `requireRole()`. Belt-and-braces: layouts gate
 * normal request traffic, but a page/server-action function can in
 * principle be invoked without that layout re-running (e.g. framework
 * prewarming), so leaf code should never blindly assert the cookie exists.
 */
export async function requireSession(currentPath: string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(currentPath)}`);
  return session;
}

/**
 * Gate a server component/layout to a specific role. Redirects to /login
 * (preserving `next`) when unauthenticated, or to the caller's own home
 * when authenticated as the wrong role.
 */
export async function requireRole(role: Role, currentPath: string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(currentPath)}`);
  if (session.role !== role) {
    const { ROLE_HOME } = await import('./users');
    redirect(ROLE_HOME[session.role]);
  }
  return session;
}

export const SESSION_MAX_AGE = DEFAULT_TTL_MS / 1000;
