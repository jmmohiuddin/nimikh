import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Signed-cookie session for the single admin (ADR-03).
 *
 * Cookie value shape: `<expiresMs>.<hmac(sha256, ADMIN_SESSION_SECRET, expiresMs)>`.
 * A cookie is valid if the HMAC matches AND expiresMs is in the future.
 * No user id, no roles, no DB lookup — there is exactly one admin.
 *
 * Rotating ADMIN_SESSION_SECRET invalidates all existing sessions, which
 * is the intended emergency panic-button.
 */

export const SESSION_COOKIE = 'nimikh_admin';
const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours — a working shift

function getSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  return s && s.length >= 16 ? s : null;
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

export function mintSessionToken(ttlMs = DEFAULT_TTL_MS): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const expires = Date.now() + ttlMs;
  const payload = String(expires);
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const [expiresStr, sig] = token.split('.');
  if (!expiresStr || !sig) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = sign(expiresStr, secret);
  return safeEqualHex(sig, expected);
}

/** Match user-supplied password against the env var. Constant-time compare. */
export function verifyAdminPassword(supplied: string): boolean {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (!configured) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(configured);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** True only when both env vars are set — used by /admin/login to tell the user what's missing. */
export function isAdminConfigured(): boolean {
  return getSecret() !== null && !!process.env.ADMIN_PASSWORD?.trim();
}
