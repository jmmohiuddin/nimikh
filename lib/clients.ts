import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Clients — the CRM side of admin (ADR-01 update). Every row is a business
 * Nimikh has (or is about to) work with. A lead becomes a client when
 * Mohiuddin decides they're worth tracking beyond the inbox; the reverse
 * doesn't happen — we never demote a client back to a lead.
 *
 * Status vocabulary (kept small on purpose):
 *   - prospect: proposal sent, no signed engagement yet
 *   - active:   engagement is live
 *   - past:     engagement finished; still a reference client
 *   - dormant:  no active work, no immediate pipeline (kept for historical context)
 */

export const CLIENT_STATUS = ['prospect', 'active', 'past', 'dormant'] as const;
export type ClientStatus = (typeof CLIENT_STATUS)[number];

export const ClientInputSchema = z.object({
  company: z.string().trim().min(1, 'Company name required').max(200),
  contactName: z.string().trim().max(120).default(''),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(200),
  phone: z.string().trim().max(40).default(''),
  website: z.string().trim().url('Enter a valid URL').max(500).optional().or(z.literal('')),
  industry: z.string().trim().max(80).default(''),
  status: z.enum(CLIENT_STATUS).default('prospect'),
  services: z.array(z.string().trim().max(80)).max(20).default([]),
  notes: z.string().trim().max(8000).default(''),
  contractSignedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD').optional().or(z.literal('')),
  /** Optional back-reference to the lead this client was converted from. */
  fromLeadId: z.string().max(40).optional().or(z.literal('')),
});

export type ClientInput = z.infer<typeof ClientInputSchema>;

export type Client = ClientInput & {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
};

/**
 * A "safe" client used in server-component props — the raw Mongo document
 * has an ObjectId that doesn't serialize across the RSC boundary, so we
 * flatten it to a string id here.
 */
export type ClientView = Omit<Client, '_id'> & { id: string };

function toView(c: Client): ClientView {
  const { _id, ...rest } = c;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

type MutationResult =
  | { ok: true; id: string; persisted: boolean }
  | { ok: false; error: string; issues?: Record<string, string[] | undefined> };

async function requireDb() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<Client>(COLLECTIONS.clients);
  // Unique-per-company index. Enforced lazily; a duplicate insert will
  // simply surface a "Client already exists" error.
  await col.createIndex({ company: 1 }, { unique: true }).catch(() => {});
  await col.createIndex({ status: 1, updatedAt: -1 }).catch(() => {});
  return col;
}

export async function createClient(raw: unknown): Promise<MutationResult> {
  const parsed = ClientInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  }
  const now = new Date();
  const doc: Client = { ...parsed.data, createdAt: now, updatedAt: now, archived: false };

  const col = await requireDb();
  if (!col) {
    console.info('[clients] CREATE (log-only, no DB):', { company: doc.company, status: doc.status });
    return { ok: true, id: '', persisted: false };
  }
  try {
    const { insertedId } = await col.insertOne(doc);
    return { ok: true, id: insertedId.toHexString(), persisted: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('duplicate key')) {
      return { ok: false, error: `A client named "${doc.company}" already exists.` };
    }
    console.error('[clients] insert failed:', err);
    return { ok: false, error: 'Failed to create client' };
  }
}

export async function updateClient(id: string, raw: unknown): Promise<MutationResult> {
  const parsed = ClientInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  }
  const col = await requireDb();
  if (!col) return { ok: true, id, persisted: false };
  try {
    const { ObjectId } = await import('mongodb');
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { ...parsed.data, updatedAt: new Date() } });
    return { ok: true, id, persisted: true };
  } catch (err) {
    console.error('[clients] update failed:', err);
    return { ok: false, error: 'Failed to update client' };
  }
}

export async function setClientArchived(id: string, archived: boolean): Promise<boolean> {
  const col = await requireDb();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { archived, updatedAt: new Date() } },
  );
  return res.matchedCount > 0;
}

export async function deleteClient(id: string): Promise<boolean> {
  const col = await requireDb();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

export async function listClients(opts: { status?: ClientStatus; includeArchived?: boolean; limit?: number } = {}): Promise<ClientView[]> {
  const col = await requireDb();
  if (!col) return [];
  const filter: Record<string, unknown> = {};
  if (opts.status) filter.status = opts.status;
  if (!opts.includeArchived) filter.archived = { $ne: true };
  const docs = await col.find(filter, { sort: { updatedAt: -1 }, limit: opts.limit ?? 200 }).toArray();
  return docs.map(toView);
}

export async function getClient(id: string): Promise<ClientView | null> {
  const col = await requireDb();
  if (!col) return null;
  const { ObjectId } = await import('mongodb');
  try {
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? toView(doc) : null;
  } catch {
    return null;
  }
}

export async function countClientsByStatus(): Promise<Record<ClientStatus | 'archived' | 'total', number>> {
  const col = await requireDb();
  const base: Record<ClientStatus | 'archived' | 'total', number> = {
    prospect: 0, active: 0, past: 0, dormant: 0, archived: 0, total: 0,
  };
  if (!col) return base;
  const grouped = await col.aggregate<{ _id: ClientStatus | null; archived: number; count: number }>([
    { $group: { _id: '$status', count: { $sum: 1 }, archived: { $sum: { $cond: ['$archived', 1, 0] } } } },
  ]).toArray();
  for (const g of grouped) {
    if (g._id && g._id in base) base[g._id] += g.count;
    base.archived += g.archived;
    base.total += g.count;
  }
  return base;
}
