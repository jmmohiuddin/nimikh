import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getDb } from './db';

/**
 * Creator portfolio items — the "Content" surface of the creator
 * dashboard (upload / manage / delete). Storage-agnostic on purpose:
 * an item references an image by URL and carries metadata, so this works
 * today with externally hosted images and can be swapped for direct
 * uploads (S3/Cloudinary) later without touching the dashboard UI.
 *
 * Collection is created lazily; falls back to a per-creator demo set so
 * the content grid is populated before a database exists.
 */

const COLLECTION = 'portfolio';

export const PortfolioInputSchema = z.object({
  creatorId: z.string().min(1).max(60),
  title: z.string().trim().min(1, 'Title required').max(160),
  imageUrl: z.string().trim().url('Enter a valid image URL').max(1000).optional().or(z.literal('')),
  emoji: z.string().trim().max(4).default('🖼️'),
  bg: z.string().trim().max(200).default('linear-gradient(135deg,#5e6ad2,#7c3aed)'),
  tags: z.array(z.string().trim().max(40)).max(8).default([]),
});

export type PortfolioInput = z.infer<typeof PortfolioInputSchema>;

export type PortfolioItem = PortfolioInput & { _id?: ObjectId; createdAt: Date };
export type PortfolioView = Omit<PortfolioItem, '_id'> & { id: string };

function toView(p: PortfolioItem): PortfolioView {
  const { _id, ...rest } = p;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<PortfolioItem>(COLLECTION);
  await col.createIndex({ creatorId: 1, createdAt: -1 }).catch(() => {});
  return col;
}

export async function listPortfolio(creatorId: string): Promise<PortfolioView[]> {
  const col = await requireCol();
  if (!col) return demoPortfolio(creatorId);
  const docs = await col.find({ creatorId }, { sort: { createdAt: -1 }, limit: 200 }).toArray();
  return docs.map(toView);
}

export async function addPortfolioItem(raw: unknown): Promise<{ ok: boolean; error?: string; persisted?: boolean }> {
  const parsed = PortfolioInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' };
  const col = await requireCol();
  if (!col) return { ok: true, persisted: false };
  await col.insertOne({ ...parsed.data, createdAt: new Date() });
  return { ok: true, persisted: true };
}

export async function deletePortfolioItem(id: string, creatorId: string): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.deleteOne({ _id: new ObjectId(id), creatorId });
  return res.deletedCount > 0;
}

function demoPortfolio(creatorId: string): PortfolioView[] {
  const base: Array<Omit<PortfolioView, 'id' | 'createdAt'>> = [
    { creatorId, title: 'Ramadan Reel — GreenLeaf Café', emoji: '🎬', bg: 'linear-gradient(135deg,#5e6ad2,#7c3aed)', tags: ['Reels', 'Food'] },
    { creatorId, title: 'Product Launch Teaser', emoji: '✨', bg: 'linear-gradient(135deg,#ec4899,#7c3aed)', tags: ['Motion', 'Ad'] },
    { creatorId, title: 'Boutique Lookbook', emoji: '📸', bg: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)', tags: ['Photo', 'Fashion'] },
    { creatorId, title: 'Eid Campaign Hook', emoji: '🎥', bg: 'linear-gradient(135deg,#10b981,#0ea5e9)', tags: ['UGC', 'Hooks'] },
  ];
  return base.map((b, i) => ({ ...b, imageUrl: '', id: `demo-pf-${i}`, createdAt: new Date(Date.now() - i * 86400000) }));
}
