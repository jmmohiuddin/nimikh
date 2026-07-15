import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Lead capture — writes from the contact form (POST /api/leads).
 * Everything validates through Zod at the boundary so a malformed
 * client payload can't reach the DB. Emails are lowercased; free-text
 * fields are trimmed.
 */

export const LeadInputSchema = z.object({
  firstName: z.string().trim().min(1, 'First name required').max(80),
  lastName: z.string().trim().min(1, 'Last name required').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  budget: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Please describe your project').max(4000),
  intent: z.enum(['software', 'marketing', 'creative', 'creator', 'hiring', 'other']).default('other'),
  /**
   * Honeypot — legit users leave this empty; bots fill it. The route
   * handler checks whether it's non-empty *after* validation and returns
   * a silent 200 so the bot doesn't learn it was caught. Anything goes
   * through Zod so the field validates rather than 400-ing.
   */
  website: z.string().optional().default(''),
});

export type LeadInput = z.infer<typeof LeadInputSchema>;

export type Lead = LeadInput & {
  createdAt: Date;
  handled: boolean;
  source: string;
  userAgent?: string;
  ip?: string;
};

export type SaveResult =
  | { ok: true; persisted: boolean; id?: string }
  | { ok: false; error: string };

export async function saveLead(input: LeadInput, meta: { userAgent?: string; ip?: string; source?: string }): Promise<SaveResult> {
  const lead: Lead = {
    ...input,
    createdAt: new Date(),
    handled: false,
    source: meta.source ?? 'contact-form',
    userAgent: meta.userAgent,
    ip: meta.ip,
  };

  const db = await getDb();
  if (!db) {
    // Log-only mode. Log a redacted line so ops sees the lead came in.
    console.info('[leads] NEW LEAD (log-only, no DB):', {
      email: lead.email,
      intent: lead.intent,
      company: lead.company || '(none)',
      messagePreview: lead.message.slice(0, 80),
      at: lead.createdAt.toISOString(),
    });
    return { ok: true, persisted: false };
  }

  try {
    const { insertedId } = await db.collection<Lead>(COLLECTIONS.leads).insertOne(lead);
    return { ok: true, persisted: true, id: insertedId.toHexString() };
  } catch (err) {
    console.error('[leads] insert failed:', err);
    return { ok: false, error: 'Failed to save lead' };
  }
}

export async function listLeads(limit = 100): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .collection<Lead>(COLLECTIONS.leads)
    .find({}, { sort: { createdAt: -1 }, limit })
    .toArray();
}

export async function markLeadHandled(id: string, handled: boolean): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const { ObjectId } = await import('mongodb');
  const res = await db.collection(COLLECTIONS.leads).updateOne({ _id: new ObjectId(id) }, { $set: { handled } });
  return res.matchedCount > 0;
}

/** Fetch a single lead by id — used by the "Convert to client" server action. */
export async function getLead(id: string): Promise<Lead | null> {
  const db = await getDb();
  if (!db) return null;
  const { ObjectId } = await import('mongodb');
  try {
    return await db.collection<Lead>(COLLECTIONS.leads).findOne({ _id: new ObjectId(id) });
  } catch {
    return null;
  }
}
