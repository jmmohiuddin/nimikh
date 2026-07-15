import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';
import { type CreatorCategory, type MarketplaceCreator, seedCreators } from '@/content/marketplace';

/**
 * Creator directory — the CMS side of admin (ADR-01 update).
 *
 * The public /marketplace page reads through `listMarketplaceCreators()`.
 * That function returns published DB creators if any exist, and otherwise
 * falls back to `content/marketplace.ts::seedCreators`. This means the
 * marketplace is never empty: the site works pre-DB, gains DB entries as
 * they're published, and only fully replaces the static list once
 * `alwaysPreferDb` conditions are met.
 */

export const CREATOR_STATUS = ['draft', 'published', 'suspended'] as const;
export type CreatorStatus = (typeof CREATOR_STATUS)[number];

export const CREATOR_CATEGORIES = ['video', 'design', 'motion', 'photo', 'copy'] as const;

const RATING_RE = /^([0-4](\.\d)?|5(\.0)?)$/;

export const CreatorInputSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(120),
  role: z.string().trim().min(1, 'Role required').max(160),
  category: z.enum(CREATOR_CATEGORIES),
  status: z.enum(CREATOR_STATUS).default('draft'),
  initial: z.string().trim().min(1).max(2),
  bg: z.string().trim().min(4).max(200),
  emoji: z.string().trim().min(1).max(4),
  rate: z.string().trim().min(1, 'Starting rate required').max(60),
  rating: z.string().regex(RATING_RE, 'Rating must be 0.0–5.0').default('5.0'),
  reviews: z.number().int().min(0).max(100000).default(0),
  chips: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  portfolioUrl: z.string().trim().url('Enter a valid URL').max(500).optional().or(z.literal('')),
  email: z.string().trim().toLowerCase().email().max(200).optional().or(z.literal('')),
  notes: z.string().trim().max(8000).default(''),
});

export type CreatorInput = z.infer<typeof CreatorInputSchema>;

export type Creator = CreatorInput & {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatorView = Omit<Creator, '_id'> & { id: string };

function toView(c: Creator): CreatorView {
  const { _id, ...rest } = c;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

type MutationResult =
  | { ok: true; id: string; persisted: boolean }
  | { ok: false; error: string; issues?: Record<string, string[] | undefined> };

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<Creator>(COLLECTIONS.creators);
  await col.createIndex({ name: 1 }, { unique: true }).catch(() => {});
  await col.createIndex({ status: 1, category: 1 }).catch(() => {});
  return col;
}

export async function createCreator(raw: unknown): Promise<MutationResult> {
  const parsed = CreatorInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  }
  const now = new Date();
  const doc: Creator = { ...parsed.data, createdAt: now, updatedAt: now };
  const col = await requireCol();
  if (!col) {
    console.info('[creators] CREATE (log-only, no DB):', { name: doc.name, status: doc.status });
    return { ok: true, id: '', persisted: false };
  }
  try {
    const { insertedId } = await col.insertOne(doc);
    return { ok: true, id: insertedId.toHexString(), persisted: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('duplicate key')) {
      return { ok: false, error: `A creator named "${doc.name}" already exists.` };
    }
    console.error('[creators] insert failed:', err);
    return { ok: false, error: 'Failed to create creator' };
  }
}

export async function updateCreator(id: string, raw: unknown): Promise<MutationResult> {
  const parsed = CreatorInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  }
  const col = await requireCol();
  if (!col) return { ok: true, id, persisted: false };
  const { ObjectId } = await import('mongodb');
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { ...parsed.data, updatedAt: new Date() } });
  return { ok: true, id, persisted: true };
}

export async function setCreatorStatus(id: string, status: CreatorStatus): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
  return res.matchedCount > 0;
}

export async function deleteCreator(id: string): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

export async function listCreators(opts: { status?: CreatorStatus; category?: CreatorCategory; limit?: number } = {}): Promise<CreatorView[]> {
  const col = await requireCol();
  if (!col) return [];
  const filter: Record<string, unknown> = {};
  if (opts.status) filter.status = opts.status;
  if (opts.category) filter.category = opts.category;
  const docs = await col.find(filter, { sort: { updatedAt: -1 }, limit: opts.limit ?? 500 }).toArray();
  return docs.map(toView);
}

export async function getCreator(id: string): Promise<CreatorView | null> {
  const col = await requireCol();
  if (!col) return null;
  const { ObjectId } = await import('mongodb');
  try {
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? toView(doc) : null;
  } catch {
    return null;
  }
}

export async function countCreatorsByStatus(): Promise<Record<CreatorStatus | 'total', number>> {
  const col = await requireCol();
  const base: Record<CreatorStatus | 'total', number> = { draft: 0, published: 0, suspended: 0, total: 0 };
  if (!col) return base;
  const grouped = await col.aggregate<{ _id: CreatorStatus | null; count: number }>([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]).toArray();
  for (const g of grouped) {
    if (g._id && g._id in base) base[g._id] += g.count;
    base.total += g.count;
  }
  return base;
}

/**
 * Public marketplace read: prefers published DB records, falls back to
 * seed data. Shape matches MarketplaceCreator so /marketplace can render
 * without knowing the data source.
 */
export async function listMarketplaceCreators(): Promise<MarketplaceCreator[]> {
  const col = await requireCol();
  if (!col) return seedCreators;
  const published = await col
    .find({ status: 'published' }, { sort: { updatedAt: -1 } })
    .toArray();
  if (published.length === 0) return seedCreators;
  return published.map((c) => ({
    name: c.name,
    role: c.role,
    initial: c.initial,
    bg: c.bg,
    chips: c.chips,
    rate: c.rate,
    rating: c.rating,
    reviews: c.reviews,
    emoji: c.emoji,
    category: c.category,
  }));
}
