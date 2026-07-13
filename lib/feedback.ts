import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Feedback capture — separate collection from leads because it's a
 * different intent (bug/feature/rating vs. sales inquiry) and different
 * admin flow (usually skimmed, not replied to individually).
 */

export const FeedbackInputSchema = z.object({
  kind: z.enum(['rating', 'bug', 'feature', 'general']).default('general'),
  rating: z.number().int().min(1).max(5).optional(),
  message: z.string().trim().min(5, 'Say a little more').max(4000),
  email: z.string().trim().toLowerCase().email().max(200).optional().or(z.literal('')),
  pagePath: z.string().trim().max(500).optional(),
  /** Honeypot — see comment in lib/leads.ts. */
  website: z.string().optional().default(''),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

export type Feedback = FeedbackInput & {
  createdAt: Date;
  archived: boolean;
  userAgent?: string;
  ip?: string;
};

type SaveResult = { ok: true; persisted: boolean } | { ok: false; error: string };

export async function saveFeedback(input: FeedbackInput, meta: { userAgent?: string; ip?: string }): Promise<SaveResult> {
  const doc: Feedback = { ...input, createdAt: new Date(), archived: false, ...meta };
  const db = await getDb();
  if (!db) {
    console.info('[feedback] NEW FEEDBACK (log-only, no DB):', {
      kind: doc.kind,
      rating: doc.rating ?? null,
      messagePreview: doc.message.slice(0, 80),
      at: doc.createdAt.toISOString(),
    });
    return { ok: true, persisted: false };
  }
  try {
    await db.collection<Feedback>(COLLECTIONS.feedback).insertOne(doc);
    return { ok: true, persisted: true };
  } catch (err) {
    console.error('[feedback] insert failed:', err);
    return { ok: false, error: 'Failed to save feedback' };
  }
}

export async function listFeedback(limit = 100): Promise<Feedback[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .collection<Feedback>(COLLECTIONS.feedback)
    .find({}, { sort: { createdAt: -1 }, limit })
    .toArray();
}
