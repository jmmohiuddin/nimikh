import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';

/**
 * Payments ledger — the money layer shared by admin, creator and agent
 * dashboards. One flat collection with a `type` discriminator keeps
 * reporting simple (a single aggregation powers every dashboard):
 *
 *   customer_payment  — money a customer pays for a creator's work
 *   creator_payout    — the creator's share of a customer_payment
 *   agent_commission  — the converting agent's share (COMMISSION_RATE)
 *
 * Revenue-split rates are configuration, not magic numbers scattered
 * through the UI. The agent commission is fixed by the brief at 25%.
 */

/** Agent commission rate on each converted customer payment (brief: 25%). */
export const COMMISSION_RATE = 0.25;
/** Creator's share of each customer payment. */
export const CREATOR_RATE = 0.65;
/** Platform retains the remainder. */
export const PLATFORM_RATE = 1 - COMMISSION_RATE - CREATOR_RATE;

export const PAYMENT_TYPES = ['customer_payment', 'creator_payout', 'agent_commission'] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_STATUS = ['pending', 'completed'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PaymentInputSchema = z.object({
  type: z.enum(PAYMENT_TYPES),
  status: z.enum(PAYMENT_STATUS).default('pending'),
  amount: z.number().nonnegative().max(1_000_000_000),
  currency: z.string().trim().max(8).default('BDT'),
  creatorId: z.string().max(60).optional().or(z.literal('')),
  creatorName: z.string().trim().max(120).default(''),
  agentId: z.string().max(60).optional().or(z.literal('')),
  agentName: z.string().trim().max(120).default(''),
  customerName: z.string().trim().max(160).default(''),
  description: z.string().trim().max(400).default(''),
});

export type PaymentInput = z.infer<typeof PaymentInputSchema>;

export type Payment = PaymentInput & {
  _id?: ObjectId;
  createdAt: Date;
  paidAt?: Date | null;
};

export type PaymentView = Omit<Payment, '_id'> & { id: string };

function toView(p: Payment): PaymentView {
  const { _id, ...rest } = p;
  return { ...rest, id: _id ? _id.toHexString() : '' };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<Payment>(COLLECTIONS.payments);
  await col.createIndex({ type: 1, status: 1, createdAt: -1 }).catch(() => {});
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ creatorId: 1 }).catch(() => {});
  return col;
}

export type PaymentFilter = {
  type?: PaymentType;
  status?: PaymentStatus;
  creatorId?: string;
  agentId?: string;
  limit?: number;
};

export async function listPayments(f: PaymentFilter = {}): Promise<PaymentView[]> {
  const col = await requireCol();
  if (!col) {
    return demoPayments()
      .filter((p) =>
        (!f.type || p.type === f.type) &&
        (!f.status || p.status === f.status) &&
        (!f.creatorId || p.creatorId === f.creatorId) &&
        (!f.agentId || p.agentId === f.agentId))
      .slice(0, f.limit ?? 500);
  }
  const filter: Record<string, unknown> = {};
  if (f.type) filter.type = f.type;
  if (f.status) filter.status = f.status;
  if (f.creatorId) filter.creatorId = f.creatorId;
  if (f.agentId) filter.agentId = f.agentId;
  const docs = await col.find(filter, { sort: { createdAt: -1 }, limit: f.limit ?? 500 }).toArray();
  return docs.map(toView);
}

export async function createPayment(raw: unknown): Promise<{ ok: boolean; id?: string; error?: string }> {
  const parsed = PaymentInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Validation failed' };
  const doc: Payment = {
    ...parsed.data,
    createdAt: new Date(),
    paidAt: parsed.data.status === 'completed' ? new Date() : null,
  };
  const col = await requireCol();
  if (!col) return { ok: true };
  const { insertedId } = await col.insertOne(doc);
  return { ok: true, id: insertedId.toHexString() };
}

export async function setPaymentStatus(id: string, status: PaymentStatus): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, paidAt: status === 'completed' ? new Date() : null } },
  );
  return res.matchedCount > 0;
}

// ── Reporting ──────────────────────────────────────────────────────────

export type Money = { pending: number; completed: number; total: number };

function emptyMoney(): Money { return { pending: 0, completed: 0, total: 0 }; }

function sumBy(list: PaymentView[], type: PaymentType): Money {
  const m = emptyMoney();
  for (const p of list) {
    if (p.type !== type) continue;
    m.total += p.amount;
    if (p.status === 'completed') m.completed += p.amount;
    else m.pending += p.amount;
  }
  return m;
}

export type LedgerSummary = {
  revenue: Money;      // customer_payment
  creatorPayouts: Money;
  agentCommissions: Money;
  monthly: { label: string; revenue: number; commissions: number }[];
};

/** One list → all headline numbers, for any scope (whole platform or one user). */
export async function summarize(f: PaymentFilter = {}): Promise<LedgerSummary> {
  const list = await listPayments({ ...f, limit: 5000 });
  const revenue = sumBy(list, 'customer_payment');
  const creatorPayouts = sumBy(list, 'creator_payout');
  const agentCommissions = sumBy(list, 'agent_commission');

  // Last 6 months, revenue + commissions by month.
  const now = new Date();
  const buckets: { key: string; label: string; revenue: number; commissions: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString('en-GB', { month: 'short' }),
      revenue: 0,
      commissions: 0,
    });
  }
  const index = new Map(buckets.map((b) => [b.key, b]));
  for (const p of list) {
    const d = new Date(p.createdAt);
    const b = index.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (!b) continue;
    if (p.type === 'customer_payment') b.revenue += p.amount;
    if (p.type === 'agent_commission') b.commissions += p.amount;
  }
  return {
    revenue,
    creatorPayouts,
    agentCommissions,
    monthly: buckets.map((b) => ({ label: b.label, revenue: b.revenue, commissions: b.commissions })),
  };
}

// ── Demo ledger (no-DB fallback) ─────────────────────────────────────────
// Deterministic so charts and totals are stable across renders.

let _demo: PaymentView[] | null = null;

function demoPayments(): PaymentView[] {
  if (_demo) return _demo;
  const out: PaymentView[] = [];
  const now = new Date();
  const customers = [
    'Dhaka Textiles Ltd', 'GreenLeaf Café', 'Rahman Motors', 'Nabila Boutique',
    'Bize POS Client', 'Aarong Reseller', 'Foodpanda Vendor', 'Skyline Realty',
  ];
  const creators = [
    { id: 'demo-creator', name: 'Riya Ahmed' },
    { id: 'c-sadia', name: 'Sadia Islam' },
    { id: 'c-karim', name: 'Karim Hassan' },
  ];
  const agents = [
    { id: 'demo-agent', name: 'Rafiq Hasan' },
    { id: 'a-tania', name: 'Tania Akter' },
  ];
  let seed = 7;
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  let idn = 0;
  const mkId = () => `demo-pay-${idn++}`;

  for (let m = 5; m >= 0; m--) {
    const count = 3 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      const day = 1 + Math.floor(rand() * 26);
      const created = new Date(now.getFullYear(), now.getMonth() - m, day);
      const amount = 4000 + Math.floor(rand() * 9) * 1000;
      const creator = creators[Math.floor(rand() * creators.length)];
      const agent = agents[Math.floor(rand() * agents.length)];
      const customer = customers[Math.floor(rand() * customers.length)];
      // Recent month has some still-pending settlements.
      const settled = m > 0 || rand() > 0.5;
      const status: PaymentStatus = settled ? 'completed' : 'pending';
      const paidAt = settled ? created : null;

      out.push({
        id: mkId(), type: 'customer_payment', status, amount, currency: 'BDT',
        creatorId: creator.id, creatorName: creator.name, agentId: agent.id, agentName: agent.name,
        customerName: customer, description: `Payment — ${customer}`, createdAt: created, paidAt,
      });
      out.push({
        id: mkId(), type: 'creator_payout', status, amount: Math.round(amount * CREATOR_RATE), currency: 'BDT',
        creatorId: creator.id, creatorName: creator.name, agentId: '', agentName: '',
        customerName: customer, description: `Payout — ${customer}`, createdAt: created, paidAt,
      });
      out.push({
        id: mkId(), type: 'agent_commission', status, amount: Math.round(amount * COMMISSION_RATE), currency: 'BDT',
        creatorId: '', creatorName: '', agentId: agent.id, agentName: agent.name,
        customerName: customer, description: `Commission — ${customer}`, createdAt: created, paidAt,
      });
    }
  }
  _demo = out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return _demo;
}

/** Format an amount as Bangladeshi Taka. */
export function taka(n: number): string {
  return `৳${Math.round(n).toLocaleString('en-US')}`;
}
