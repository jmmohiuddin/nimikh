import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';
import { hashPassword, verifyPassword } from './auth/password';
import { demoUsers } from '@/content/demo-users';

/**
 * User accounts + role-based access control (the identity layer).
 *
 * Follows the same shape as lib/clients.ts / lib/creators.ts: a Zod schema
 * at the boundary, a Mongo-backed CRUD surface, and a graceful fallback.
 * When there's no database, `authenticate()` and lookups fall back to the
 * demo users in content/demo-users.ts so the whole role-based platform is
 * navigable pre-Atlas — identical philosophy to the marketplace seed.
 *
 * Passwords are never stored or returned in plaintext. `UserView` (used in
 * server-component props) deliberately omits `passwordHash`.
 */

export const ROLES = ['admin', 'creator', 'agent', 'client'] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUS = ['active', 'suspended'] as const;
export type UserStatus = (typeof USER_STATUS)[number];

export const ROLE_HOME: Record<Role, string> = {
  admin: '/admin',
  creator: '/creator',
  agent: '/agent',
  client: '/client',
};

/** Create/update payload. Password is optional on update. */
export const UserInputSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(200),
  role: z.enum(ROLES),
  status: z.enum(USER_STATUS).default('active'),
  phone: z.string().trim().max(40).default(''),
  notes: z.string().trim().max(4000).default(''),
});

export type UserInput = z.infer<typeof UserInputSchema>;

export type User = UserInput & {
  _id?: ObjectId;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserView = Omit<User, '_id' | 'passwordHash'> & { id: string };

export type SessionUser = { id: string; name: string; email: string; role: Role; status: UserStatus };

function toView(u: User): UserView {
  const { _id, passwordHash: _pw, ...rest } = u;
  void _pw;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

type MutationResult =
  | { ok: true; id: string; persisted: boolean }
  | { ok: false; error: string; issues?: Record<string, string[] | undefined> };

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<User>(COLLECTIONS.users);
  await col.createIndex({ email: 1 }, { unique: true }).catch(() => {});
  await col.createIndex({ role: 1, status: 1 }).catch(() => {});
  return col;
}

/**
 * Authenticate by email + password. Returns a minimal session user on
 * success. DB accounts win; if the DB is unreachable/empty we validate
 * against the demo users so the platform is usable pre-provisioning.
 */
export async function authenticate(emailRaw: string, password: string): Promise<SessionUser | null> {
  const email = emailRaw.trim().toLowerCase();
  const col = await requireCol();

  if (col) {
    const doc = await col.findOne({ email });
    if (doc && doc.status === 'active' && verifyPassword(password, doc.passwordHash)) {
      return { id: doc._id!.toHexString(), name: doc.name, email: doc.email, role: doc.role, status: doc.status };
    }
    // If DB is present AND has this user, do not silently fall through to
    // demo — a real (possibly suspended/wrong-password) account was found.
    if (doc) return null;
    // No such DB user, and DB has at least started — still allow demo login
    // only while the collection is empty (fresh install convenience).
    const count = await col.estimatedDocumentCount().catch(() => 1);
    if (count > 0) return null;
  }

  const demo = demoUsers.find((u) => u.email === email);
  if (demo && demo.status === 'active' && verifyPassword(password, `plain$${demo.password}`)) {
    return { id: demo.id, name: demo.name, email: demo.email, role: demo.role, status: demo.status };
  }
  return null;
}

/** Fetch the session user's full profile view by id (DB or demo). */
export async function getUserById(id: string): Promise<UserView | null> {
  const col = await requireCol();
  if (col) {
    const { ObjectId } = await import('mongodb');
    try {
      const doc = await col.findOne({ _id: new ObjectId(id) });
      if (doc) return toView(doc);
    } catch {
      /* fall through to demo */
    }
  }
  const demo = demoUsers.find((u) => u.id === id);
  if (demo) {
    const now = new Date(0);
    return {
      id: demo.id, name: demo.name, email: demo.email, role: demo.role,
      status: demo.status, phone: '', notes: '', createdAt: now, updatedAt: now,
    };
  }
  return null;
}

export async function createUser(raw: unknown, password: string): Promise<MutationResult> {
  const parsed = UserInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  }
  if (!password || password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters', issues: { password: ['Min 8 characters'] } };
  }
  const now = new Date();
  const doc: User = { ...parsed.data, passwordHash: hashPassword(password), createdAt: now, updatedAt: now };
  const col = await requireCol();
  if (!col) {
    console.info('[users] CREATE (log-only, no DB):', { email: doc.email, role: doc.role });
    return { ok: true, id: '', persisted: false };
  }
  try {
    const { insertedId } = await col.insertOne(doc);
    return { ok: true, id: insertedId.toHexString(), persisted: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('duplicate key')) {
      return { ok: false, error: `A user with email "${doc.email}" already exists.` };
    }
    console.error('[users] insert failed:', err);
    return { ok: false, error: 'Failed to create user' };
  }
}

export async function updateUser(id: string, raw: unknown, password?: string): Promise<MutationResult> {
  const parsed = UserInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  }
  if (password && password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters', issues: { password: ['Min 8 characters'] } };
  }
  const col = await requireCol();
  if (!col) return { ok: true, id, persisted: false };
  const { ObjectId } = await import('mongodb');
  const set: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (password) set.passwordHash = hashPassword(password);
  try {
    await col.updateOne({ _id: new ObjectId(id) }, { $set: set });
    return { ok: true, id, persisted: true };
  } catch (err) {
    console.error('[users] update failed:', err);
    return { ok: false, error: 'Failed to update user' };
  }
}

export async function setUserStatus(id: string, status: UserStatus): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
  return res.matchedCount > 0;
}

export async function deleteUser(id: string): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

export async function listUsers(opts: { role?: Role; status?: UserStatus; limit?: number } = {}): Promise<UserView[]> {
  const col = await requireCol();
  if (!col) {
    // Demo fallback so admin → Users is populated pre-DB.
    return demoUsers
      .filter((u) => (!opts.role || u.role === opts.role) && (!opts.status || u.status === opts.status))
      .map((u) => ({
        id: u.id, name: u.name, email: u.email, role: u.role, status: u.status,
        phone: '', notes: '', createdAt: new Date(0), updatedAt: new Date(0),
      }));
  }
  const filter: Record<string, unknown> = {};
  if (opts.role) filter.role = opts.role;
  if (opts.status) filter.status = opts.status;
  const docs = await col.find(filter, { sort: { createdAt: -1 }, limit: opts.limit ?? 500 }).toArray();
  return docs.map(toView);
}

export async function countUsersByRole(): Promise<Record<Role | 'total' | 'suspended', number>> {
  const base: Record<Role | 'total' | 'suspended', number> = { admin: 0, creator: 0, agent: 0, client: 0, total: 0, suspended: 0 };
  const col = await requireCol();
  if (!col) {
    for (const u of demoUsers) {
      base[u.role] += 1;
      base.total += 1;
      if (u.status === 'suspended') base.suspended += 1;
    }
    return base;
  }
  const grouped = await col.aggregate<{ _id: Role | null; count: number; suspended: number }>([
    { $group: { _id: '$role', count: { $sum: 1 }, suspended: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } } } },
  ]).toArray();
  for (const g of grouped) {
    if (g._id && g._id in base) base[g._id] += g.count;
    base.total += g.count;
    base.suspended += g.suspended;
  }
  return base;
}
