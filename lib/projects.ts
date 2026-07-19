import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Projects — the unit of work a client can track in the portal. One client
 * (a user with role `client`) can own many projects; each project carries a
 * lifecycle stage, a team, key dates, and links. The payment plan for a
 * project lives in lib/installments.ts, keyed by projectId.
 *
 * Same DB-or-demo pattern as the rest of the platform so the portal is
 * fully navigable before Atlas is provisioned.
 */

/** Ordered lifecycle stages. Completion % is derived from position here. */
export const PROJECT_STAGES = [
  'created', 'planning', 'design', 'development', 'testing',
  'review', 'revisions', 'approval', 'deployment', 'completed',
] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

export const STAGE_LABEL: Record<ProjectStage, string> = {
  created: 'Project Created',
  planning: 'Planning',
  design: 'UI/UX Design',
  development: 'Development',
  testing: 'Internal Testing',
  review: 'Client Review',
  revisions: 'Revisions',
  approval: 'Final Approval',
  deployment: 'Deployment',
  completed: 'Completed',
};

/** Percent complete implied by a stage (0 at "created", 100 at "completed"). */
export function stageCompletion(stage: ProjectStage): number {
  const i = PROJECT_STAGES.indexOf(stage);
  return Math.round((i / (PROJECT_STAGES.length - 1)) * 100);
}

const LinkSchema = z.object({ label: z.string().trim().max(80), url: z.string().trim().url().max(600) });

export const ProjectInputSchema = z.object({
  clientId: z.string().min(1).max(60),
  clientName: z.string().trim().max(160).default(''),
  name: z.string().trim().min(1, 'Project name required').max(200),
  description: z.string().trim().max(4000).default(''),
  stage: z.enum(PROJECT_STAGES).default('created'),
  totalValue: z.number().nonnegative().max(1_000_000_000),
  currency: z.string().trim().max(8).default('BDT'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD').optional().or(z.literal('')),
  expectedDelivery: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD').optional().or(z.literal('')),
  projectManager: z.string().trim().max(120).default(''),
  designer: z.string().trim().max(120).default(''),
  developer: z.string().trim().max(120).default(''),
  links: z.array(LinkSchema).max(20).default([]),
});

export type ProjectInput = z.infer<typeof ProjectInputSchema>;

export type Project = ProjectInput & { _id?: ObjectId; createdAt: Date; updatedAt: Date };
export type ProjectView = Omit<Project, '_id'> & { id: string; completion: number; stageLabel: string };

function toView(p: Project): ProjectView {
  const { _id, ...rest } = p;
  return { ...rest, id: _id ? _id.toHexString() : '', completion: stageCompletion(p.stage), stageLabel: STAGE_LABEL[p.stage] };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<Project>(COLLECTIONS.projects);
  await col.createIndex({ clientId: 1, updatedAt: -1 }).catch(() => {});
  return col;
}

export async function listProjects(opts: { clientId?: string; limit?: number } = {}): Promise<ProjectView[]> {
  const col = await requireCol();
  if (!col) return demoProjects().filter((p) => !opts.clientId || p.clientId === opts.clientId).slice(0, opts.limit ?? 500);
  const filter: Record<string, unknown> = {};
  if (opts.clientId) filter.clientId = opts.clientId;
  const docs = await col.find(filter, { sort: { updatedAt: -1 }, limit: opts.limit ?? 500 }).toArray();
  return docs.map(toView);
}

export async function getProject(id: string): Promise<ProjectView | null> {
  const col = await requireCol();
  if (!col) return demoProjects().find((p) => p.id === id) ?? null;
  const { ObjectId } = await import('mongodb');
  try {
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? toView(doc) : null;
  } catch {
    return null;
  }
}

export async function createProject(raw: unknown): Promise<{ ok: boolean; id?: string; error?: string; issues?: Record<string, string[] | undefined> }> {
  const parsed = ProjectInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  const now = new Date();
  const doc: Project = { ...parsed.data, createdAt: now, updatedAt: now };
  const col = await requireCol();
  if (!col) return { ok: true };
  const { insertedId } = await col.insertOne(doc);
  return { ok: true, id: insertedId.toHexString() };
}

export async function updateProject(id: string, raw: unknown): Promise<{ ok: boolean; error?: string; issues?: Record<string, string[] | undefined> }> {
  const parsed = ProjectInputSchema.partial().safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Validation failed', issues: parsed.error.flatten().fieldErrors };
  const col = await requireCol();
  if (!col) return { ok: true };
  const { ObjectId } = await import('mongodb');
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { ...parsed.data, updatedAt: new Date() } });
  return { ok: true };
}

export async function setProjectStage(id: string, stage: ProjectStage): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: { stage, updatedAt: new Date() } });
  return res.matchedCount > 0;
}

// ── Demo project (no-DB fallback) ────────────────────────────────────────

let _projects: ProjectView[] | null = null;

export function demoProjects(): ProjectView[] {
  if (_projects) return _projects;
  const now = new Date();
  const iso = (offset: number) => new Date(now.getFullYear(), now.getMonth() + offset, 15).toISOString().slice(0, 10);
  const raw: Array<Omit<Project, 'createdAt' | 'updatedAt'> & { id: string }> = [
    {
      id: 'demo-project-1', clientId: 'demo-client', clientName: 'Imran Chowdhury',
      name: 'Chowdhury Traders — E-commerce Website', description: 'Custom storefront with inventory sync and bKash/Nagad checkout.',
      stage: 'development', totalValue: 240000, currency: 'BDT', startDate: iso(-2), expectedDelivery: iso(2),
      projectManager: 'Maruf Shezad', designer: 'Sadia Islam', developer: 'Karim Hassan',
      links: [{ label: 'Staging site', url: 'https://staging.chowdhurytraders.example' }, { label: 'Figma designs', url: 'https://figma.com/file/example' }],
    },
    {
      id: 'demo-project-2', clientId: 'demo-client', clientName: 'Imran Chowdhury',
      name: 'Chowdhury Traders — Brand Identity', description: 'Logo, brand kit, and social templates.',
      stage: 'completed', totalValue: 60000, currency: 'BDT', startDate: iso(-5), expectedDelivery: iso(-3),
      projectManager: 'Maruf Shezad', designer: 'Karim Hassan', developer: '',
      links: [{ label: 'Brand kit', url: 'https://drive.example/brandkit' }],
    },
  ];
  _projects = raw.map((p, i) => ({
    ...p, completion: stageCompletion(p.stage), stageLabel: STAGE_LABEL[p.stage],
    createdAt: new Date(now.getFullYear(), now.getMonth() - 3 - i, 1), updatedAt: new Date(now.getFullYear(), now.getMonth(), 1),
  }));
  return _projects;
}
