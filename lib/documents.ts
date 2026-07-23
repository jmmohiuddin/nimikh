import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Project documents with lightweight versioning. A new upload of the same
 * (category + title) within a project doesn't overwrite the old row — it
 * increments `version`, so historical records survive. The portal shows the
 * latest version by default and can reveal prior versions.
 *
 * Files are referenced by URL (storage-agnostic, like lib/portfolio.ts):
 * this works today with any hosted file and can be swapped for direct
 * uploads to S3/Cloudinary later without changing the model or UI.
 */

export const DOC_CATEGORIES = [
  'contract', 'proposal', 'requirements', 'design', 'deliverable', 'manual', 'invoice', 'receipt', 'other',
] as const;
export type DocCategory = (typeof DOC_CATEGORIES)[number];

export const DOC_CATEGORY_LABEL: Record<DocCategory, string> = {
  contract: 'Contract', proposal: 'Proposal', requirements: 'Requirements', design: 'Design file',
  deliverable: 'Final deliverable', manual: 'User manual', invoice: 'Invoice', receipt: 'Receipt', other: 'Other',
};

export const DocumentSchema = z.object({
  projectId: z.string().min(1).max(60),
  clientId: z.string().min(1).max(60),
  title: z.string().trim().min(1, 'Title required').max(200),
  category: z.enum(DOC_CATEGORIES).default('other'),
  url: z.string().trim().url('Enter a valid URL').max(1000),
  notes: z.string().trim().max(500).default(''),
});

export type DocumentInput = z.infer<typeof DocumentSchema>;
export type ProjectDocument = DocumentInput & { _id?: ObjectId; version: number; createdAt: Date };
export type DocumentView = Omit<ProjectDocument, '_id'> & { id: string };

function toView(d: ProjectDocument): DocumentView {
  const { _id, ...rest } = d;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<ProjectDocument>(COLLECTIONS.documents);
  await col.createIndex({ projectId: 1, category: 1, title: 1, version: -1 }).catch(() => {});
  await col.createIndex({ clientId: 1 }).catch(() => {});
  return col;
}

export async function listDocuments(opts: { projectId?: string; clientId?: string } = {}): Promise<DocumentView[]> {
  const col = await requireCol();
  if (!col) return demoDocuments().filter((d) => (!opts.projectId || d.projectId === opts.projectId) && (!opts.clientId || d.clientId === opts.clientId));
  const filter: Record<string, unknown> = {};
  if (opts.projectId) filter.projectId = opts.projectId;
  if (opts.clientId) filter.clientId = opts.clientId;
  const docs = await col.find(filter, { sort: { createdAt: -1 }, limit: 500 }).toArray();
  return docs.map(toView);
}

export async function addDocument(raw: unknown): Promise<{ ok: boolean; error?: string; version?: number }> {
  const parsed = DocumentSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' };
  const col = await requireCol();
  if (!col) return { ok: true, version: 1 };
  // Next version for the same (project, category, title).
  const latest = await col.find({ projectId: parsed.data.projectId, category: parsed.data.category, title: parsed.data.title })
    .sort({ version: -1 }).limit(1).toArray();
  const version = (latest[0]?.version ?? 0) + 1;
  await col.insertOne({ ...parsed.data, version, createdAt: new Date() });
  return { ok: true, version };
}

/**
 * Group documents by (category+title), latest version first, with prior
 * versions attached — the shape the portal renders.
 */
export function groupVersions(docs: DocumentView[]): Array<DocumentView & { history: DocumentView[] }> {
  const map = new Map<string, DocumentView[]>();
  for (const d of docs) {
    const key = `${d.category}::${d.title}`;
    (map.get(key) ?? map.set(key, []).get(key)!).push(d);
  }
  return Array.from(map.values()).map((group) => {
    const sorted = group.sort((a, b) => b.version - a.version);
    return { ...sorted[0], history: sorted.slice(1) };
  });
}

let _docs: DocumentView[] | null = null;
function demoDocuments(): DocumentView[] {
  if (_docs) return _docs;
  const now = new Date();
  const day = (o: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + o);
  const rows: Array<Omit<DocumentView, 'id' | 'createdAt'> & { createdAt: Date }> = [
    { projectId: 'demo-project-1', clientId: 'demo-client', title: 'Service Agreement', category: 'contract', url: 'https://drive.example/contract-v2.pdf', notes: '', version: 2, createdAt: day(-40) },
    { projectId: 'demo-project-1', clientId: 'demo-client', title: 'Service Agreement', category: 'contract', url: 'https://drive.example/contract-v1.pdf', notes: '', version: 1, createdAt: day(-55) },
    { projectId: 'demo-project-1', clientId: 'demo-client', title: 'Project Proposal', category: 'proposal', url: 'https://drive.example/proposal.pdf', notes: '', version: 1, createdAt: day(-58) },
    { projectId: 'demo-project-1', clientId: 'demo-client', title: 'Requirements Doc', category: 'requirements', url: 'https://drive.example/requirements.pdf', notes: '', version: 1, createdAt: day(-50) },
    { projectId: 'demo-project-1', clientId: 'demo-client', title: 'Homepage Design', category: 'design', url: 'https://figma.com/file/example', notes: 'Latest mockups', version: 3, createdAt: day(-12) },
    { projectId: 'demo-project-2', clientId: 'demo-client', title: 'Brand Kit', category: 'deliverable', url: 'https://drive.example/brandkit.zip', notes: '', version: 1, createdAt: day(-90) },
  ];
  _docs = rows.map((r, i) => ({ ...r, id: `demo-doc-${i}` }));
  return _docs;
}
