import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Communication center — a message thread per project, shared between the
 * client and the Nimikh team. Every message is linked to a projectId so
 * conversation always has context. Attachments are referenced by URL to
 * stay storage-agnostic (see lib/documents.ts / lib/portfolio.ts).
 */

export const MessageSchema = z.object({
  projectId: z.string().min(1).max(60),
  clientId: z.string().min(1).max(60),
  sender: z.enum(['client', 'team']),
  authorName: z.string().trim().max(120).default(''),
  body: z.string().trim().min(1, 'Message required').max(4000),
  attachmentUrl: z.string().trim().url().max(1000).optional().or(z.literal('')),
});

export type MessageInput = z.infer<typeof MessageSchema>;
export type Message = MessageInput & { _id?: ObjectId; createdAt: Date };
export type MessageView = Omit<Message, '_id'> & { id: string };

function toView(m: Message): MessageView {
  const { _id, ...rest } = m;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<Message>(COLLECTIONS.messages);
  await col.createIndex({ projectId: 1, createdAt: 1 }).catch(() => {});
  await col.createIndex({ clientId: 1 }).catch(() => {});
  return col;
}

export async function listMessages(opts: { projectId?: string; clientId?: string; limit?: number } = {}): Promise<MessageView[]> {
  const col = await requireCol();
  if (!col) return demoMessages().filter((m) => (!opts.projectId || m.projectId === opts.projectId) && (!opts.clientId || m.clientId === opts.clientId)).slice(0, opts.limit ?? 500);
  const filter: Record<string, unknown> = {};
  if (opts.projectId) filter.projectId = opts.projectId;
  if (opts.clientId) filter.clientId = opts.clientId;
  const docs = await col.find(filter, { sort: { createdAt: 1 }, limit: opts.limit ?? 500 }).toArray();
  return docs.map(toView);
}

export async function addMessage(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = MessageSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' };
  const col = await requireCol();
  if (!col) return { ok: true };
  await col.insertOne({ ...parsed.data, createdAt: new Date() });
  return { ok: true };
}

let _msgs: MessageView[] | null = null;
function demoMessages(): MessageView[] {
  if (_msgs) return _msgs;
  const now = new Date();
  const hrs = (h: number) => new Date(now.getTime() - h * 3600_000);
  const rows: Array<Omit<MessageView, 'id'>> = [
    { projectId: 'demo-project-1', clientId: 'demo-client', sender: 'team', authorName: 'Maruf (PM)', body: 'Welcome to your project portal! We kicked off planning this week.', createdAt: hrs(24 * 40) },
    { projectId: 'demo-project-1', clientId: 'demo-client', sender: 'client', authorName: 'Imran Chowdhury', body: 'Thanks! Excited to get started. When can I review the first designs?', createdAt: hrs(24 * 39) },
    { projectId: 'demo-project-1', clientId: 'demo-client', sender: 'team', authorName: 'Sadia (Design)', body: 'First homepage concepts are up in Documents (Homepage Design v3). Would love your feedback.', createdAt: hrs(50) },
    { projectId: 'demo-project-1', clientId: 'demo-client', sender: 'team', authorName: 'Maruf (PM)', body: 'Quick reminder: installment 3 is coming up. No rush — invoice is in your Payments tab.', createdAt: hrs(4) },
  ];
  _msgs = rows.map((r, i) => ({ ...r, attachmentUrl: '', id: `demo-msg-${i}` }));
  return _msgs;
}
