import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * Password hashing with Node's built-in scrypt — no external dependency
 * (bcrypt/argon would add native builds; scrypt is memory-hard and ships
 * with Node). Format is self-describing so the algorithm/params can evolve:
 *
 *   scrypt$<N>$<saltHex>$<derivedHex>
 *
 * Verification is constant-time. `verifyPassword` also accepts a plaintext
 * fallback (prefixed `plain$`) used ONLY by the demo users in
 * content/demo-users.ts, so the app is log-in-able before a database and
 * real hashed accounts exist. Real accounts always store scrypt hashes.
 */

const KEYLEN = 64;
const COST = 16384; // 2^14 — a sensible interactive-login work factor

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(plain, salt, KEYLEN, { N: COST });
  return `scrypt$${COST}$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function verifyPassword(plain: string, stored: string | undefined | null): boolean {
  if (!stored) return false;

  // Demo-only plaintext form: `plain$<password>`. Constant-time compare.
  if (stored.startsWith('plain$')) {
    const expected = stored.slice('plain$'.length);
    const a = Buffer.from(plain);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }

  const [scheme, costStr, saltHex, derivedHex] = stored.split('$');
  if (scheme !== 'scrypt' || !costStr || !saltHex || !derivedHex) return false;
  const cost = Number(costStr);
  if (!Number.isFinite(cost)) return false;
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(derivedHex, 'hex');
    const derived = scryptSync(plain, salt, expected.length, { N: cost });
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
