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
 * rotating it invalidates everything — the intended panic button). In
 * non-production a built-in dev secret is used so the platform is
 * log-in-able out of the box; production REQUIRES the env var.
 */

export const SESSION_COOKIE = 'nimikh_session';
const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const DEV_SECRET = 'nimikh-dev-only-session-secret-change-me';

type SessionPayload = { uid: string; role: Role; name: string; email: string; exp: number };

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV !== 'production') return DEV_SECRET;
  // In production with no configured secret, sessions cannot be minted or
  // verified — treat as "auth unconfigured".
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
