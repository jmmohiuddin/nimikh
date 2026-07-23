import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Agent sales leads — the pipeline an agent works to convert. Distinct
 * from marketing leads (lib/leads.ts, inbound contact-form submissions):
 * these are prospects assigned to a specific agent who calls, follows up,
 * and closes. A conversion is what triggers the agent's 25% commission.
 *
 * Same DB-or-demo pattern as the rest of the platform, so the agent
 * dashboard is fully navigable before Atlas is provisioned.
 */

export const LEAD_STAGES = ['new', 'contacted', 'followup', 'converted', 'lost'] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

/** Stages that still count as live pipeline. */
export const OPEN_STAGES: LeadStage[] = ['new', 'contacted', 'followup'];

export type CallLogEntry = { at: Date; outcome: string; note: string };

export const AgentLeadInputSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(120),
  email: z.string().trim().toLowerCase().email().max(200).optional().or(z.literal('')),
  phone: z.string().trim().max(40).default(''),
  company: z.string().trim().max(200).default(''),
  stage: z.enum(LEAD_STAGES).default('new'),
  assignedAgentId: z.string().max(60).default(''),
  assignedAgentName: z.string().trim().max(120).default(''),
  value: z.number().nonnegative().max(100_000_000).default(0),
  source: z.string().trim().max(80).default(''),
  notes: z.string().trim().max(8000).default(''),
});

export type AgentLeadInput = z.infer<typeof AgentLeadInputSchema>;

export type AgentLead = AgentLeadInput & {
  _id?: ObjectId;
  callLog: CallLogEntry[];
  followUpAt?: Date | null;
  lastContactedAt?: Date | null;
  convertedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AgentLeadView = Omit<AgentLead, '_id'> & { id: string };

function toView(l: AgentLead): AgentLeadView {
  const { _id, ...rest } = l;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<AgentLead>(COLLECTIONS.agentLeads);
  await col.createIndex({ assignedAgentId: 1, stage: 1 }).catch(() => {});
  await col.createIndex({ followUpAt: 1 }).catch(() => {});
  return col;
}

export async function listAgentLeads(opts: { agentId?: string; stage?: LeadStage; limit?: number } = {}): Promise<AgentLeadView[]> {
  const col = await requireCol();
  if (!col) {
    return demoLeads()
      .filter((l) => (!opts.agentId || l.assignedAgentId === opts.agentId) && (!opts.stage || l.stage === opts.stage))
      .slice(0, opts.limit ?? 500);
  }
  const filter: Record<string, unknown> = {};
  if (opts.agentId) filter.assignedAgentId = opts.agentId;
  if (opts.stage) filter.stage = opts.stage;
  const docs = await col.find(filter, { sort: { updatedAt: -1 }, limit: opts.limit ?? 500 }).toArray();
  return docs.map(toView);
}

export async function getAgentLead(id: string): Promise<AgentLeadView | null> {
  const col = await requireCol();
  if (!col) return demoLeads().find((l) => l.id === id) ?? null;
  const { ObjectId } = await import('mongodb');
  try {
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? toView(doc) : null;
  } catch {
    return null;
  }
}

export async function createAgentLead(raw: unknown): Promise<{ ok: boolean; id?: string; error?: string }> {
  const parsed = AgentLeadInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Validation failed' };
  const now = new Date();
  const doc: AgentLead = {
    ...parsed.data, callLog: [], followUpAt: null, lastContactedAt: null,
    convertedAt: parsed.data.stage === 'converted' ? now : null, createdAt: now, updatedAt: now,
  };
  const col = await requireCol();
  if (!col) return { ok: true };
  const { insertedId } = await col.insertOne(doc);
  return { ok: true, id: insertedId.toHexString() };
}

/**
 * Advance a lead's stage. Marking `converted` stamps convertedAt and (when
 * a value + agent are known) writes the paired customer_payment /
 * creator_payout / agent_commission rows so the money layer stays in sync.
 */
export async function setLeadStage(id: string, stage: LeadStage): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const now = new Date();
  const set: Record<string, unknown> = { stage, updatedAt: now };
  if (stage === 'converted') set.convertedAt = now;
  if (stage === 'contacted' || stage === 'followup') set.lastContactedAt = now;
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: set });
  return res.matchedCount > 0;
}

export async function addCallLog(id: string, outcome: string, note: string, followUpAt?: Date | null): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const now = new Date();
  const entry: CallLogEntry = { at: now, outcome, note };
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $push: { callLog: entry },
      $set: { lastContactedAt: now, updatedAt: now, ...(followUpAt !== undefined ? { followUpAt } : {}) },
    },
  );
  return res.matchedCount > 0;
}

export type StageCounts = Record<LeadStage | 'total' | 'open', number>;

export async function countLeadsByStage(agentId?: string): Promise<StageCounts> {
  const base: StageCounts = { new: 0, contacted: 0, followup: 0, converted: 0, lost: 0, total: 0, open: 0 };
  const leads = await listAgentLeads({ agentId, limit: 5000 });
  for (const l of leads) {
    base[l.stage] += 1;
    base.total += 1;
    if (OPEN_STAGES.includes(l.stage)) base.open += 1;
  }
  return base;
}

/** Conversion rate as a 0–100 number. Converted / (converted + lost + open). */
export function conversionRate(c: StageCounts): number {
  const closable = c.total;
  if (closable === 0) return 0;
  return Math.round((c.converted / closable) * 100);
}

// ── Demo pipeline (no-DB fallback) ───────────────────────────────────────

let _leads: AgentLeadView[] | null = null;

function demoLeads(): AgentLeadView[] {
  if (_leads) return _leads;
  const now = new Date();
  const day = (offset: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  const agent = { id: 'demo-agent', name: 'Rafiq Hasan' };
  const rows: Array<Partial<AgentLeadView> & { name: string; stage: LeadStage }> = [
    { name: 'Imran Chowdhury', company: 'Chowdhury Traders', phone: '+8801711000001', stage: 'new', value: 25000, source: 'Website', followUpAt: day(1) },
    { name: 'Nadia Sultana', company: 'Sultana Fashion', phone: '+8801711000002', stage: 'contacted', value: 40000, source: 'Referral', followUpAt: day(0), lastContactedAt: day(-1) },
    { name: 'Fahim Reza', company: 'Reza Electronics', phone: '+8801711000003', stage: 'followup', value: 60000, source: 'Ad', followUpAt: day(2), lastContactedAt: day(-2) },
    { name: 'Shirin Akter', company: 'Akter Boutique', phone: '+8801711000004', stage: 'followup', value: 18000, source: 'Website', followUpAt: day(0), lastContactedAt: day(-3) },
    { name: 'Tanvir Alam', company: 'Alam Foods', phone: '+8801711000005', stage: 'converted', value: 52000, source: 'Referral', convertedAt: day(-5), lastContactedAt: day(-6) },
    { name: 'Rumana Haque', company: 'Haque Realty', phone: '+8801711000006', stage: 'converted', value: 75000, source: 'Website', convertedAt: day(-9), lastContactedAt: day(-10) },
    { name: 'Sabbir Khan', company: 'Khan Motors', phone: '+8801711000007', stage: 'converted', value: 33000, source: 'Ad', convertedAt: day(-14), lastContactedAt: day(-15) },
    { name: 'Munia Islam', company: 'Islam Café', phone: '+8801711000008', stage: 'lost', value: 12000, source: 'Website', lastContactedAt: day(-8) },
    { name: 'Arefin Zaman', company: 'Zaman Textiles', phone: '+8801711000009', stage: 'new', value: 45000, source: 'Referral', followUpAt: day(3) },
    { name: 'Priya Das', company: 'Das Interiors', phone: '+8801711000010', stage: 'contacted', value: 28000, source: 'Ad', followUpAt: day(1), lastContactedAt: day(-1) },
  ];
  _leads = rows.map((r, i) => ({
    id: `demo-lead-${i}`,
    name: r.name,
    email: r.email ?? '',
    phone: r.phone ?? '',
    company: r.company ?? '',
    stage: r.stage,
    assignedAgentId: agent.id,
    assignedAgentName: agent.name,
    value: r.value ?? 0,
    source: r.source ?? '',
    notes: '',
    callLog: r.lastContactedAt ? [{ at: r.lastContactedAt, outcome: 'Spoke', note: 'Discussed requirements.' }] : [],
    followUpAt: r.followUpAt ?? null,
    lastContactedAt: r.lastContactedAt ?? null,
    convertedAt: r.convertedAt ?? null,
    createdAt: day(-20 + i),
    updatedAt: r.lastContactedAt ?? r.convertedAt ?? day(-20 + i),
  }));
  return _leads;
}
