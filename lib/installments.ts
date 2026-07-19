import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import { COLLECTIONS, getDb } from './db';
import { demoProjects } from './projects';

/**
 * Installments — the flexible payment-plan engine and the financial heart
 * of the client portal. A plan is simply the set of installments attached
 * to a projectId; plans can be 3 / 6 / 12 / custom because nothing here
 * hardcodes a count — `generatePlan()` takes the count, total, first due
 * date, and cadence as parameters.
 *
 * Each installment doubles as its own invoice/receipt (invoiceNumber +
 * receiptAvailable), and carries an embedded audit `history` so every
 * financial change is traceable. Reporting helpers roll installments up to
 * a per-project summary and a company-wide financial overview.
 */

export const PAYMENT_METHODS = ['bkash', 'nagad', 'bank-transfer', 'card', 'cash', 'cheque', 'other'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Stored status is binary; richer states are derived from dates. */
export type StoredStatus = 'pending' | 'paid';
export type DerivedState = 'paid' | 'overdue' | 'due-soon' | 'upcoming';

/** Days-out threshold under which an unpaid installment is "due soon". */
const DUE_SOON_DAYS = 14;

export type AuditEntry = { at: Date; action: string; detail: string };

export const InstallmentSchema = z.object({
  projectId: z.string().min(1).max(60),
  clientId: z.string().min(1).max(60),
  number: z.number().int().min(1).max(120),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  amount: z.number().nonnegative().max(1_000_000_000),
  currency: z.string().trim().max(8).default('BDT'),
  status: z.enum(['pending', 'paid']).default('pending'),
  paidDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  method: z.enum(PAYMENT_METHODS).optional(),
  reference: z.string().trim().max(120).default(''),
  invoiceNumber: z.string().trim().max(60).default(''),
  receiptAvailable: z.boolean().default(false),
  notes: z.string().trim().max(1000).default(''),
});

export type InstallmentInput = z.infer<typeof InstallmentSchema>;
export type Installment = InstallmentInput & { _id?: ObjectId; history: AuditEntry[]; createdAt: Date; updatedAt: Date };
export type InstallmentView = Omit<Installment, '_id'> & { id: string; state: DerivedState };

/** Derive the display state of an installment from its status + due date. */
export function deriveState(status: StoredStatus, dueDate: string, now = new Date()): DerivedState {
  if (status === 'paid') return 'paid';
  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (due < today) return 'overdue';
  const soon = new Date(today); soon.setDate(soon.getDate() + DUE_SOON_DAYS);
  if (due <= soon) return 'due-soon';
  return 'upcoming';
}

function toView(i: Installment): InstallmentView {
  const { _id, ...rest } = i;
  return { ...rest, id: _id ? _id.toHexString() : '', state: deriveState(i.status, i.dueDate) };
}

async function requireCol() {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<Installment>(COLLECTIONS.installments);
  await col.createIndex({ projectId: 1, number: 1 }).catch(() => {});
  await col.createIndex({ clientId: 1, status: 1 }).catch(() => {});
  await col.createIndex({ status: 1, dueDate: 1 }).catch(() => {});
  return col;
}

export async function listInstallments(opts: { projectId?: string; clientId?: string; limit?: number } = {}): Promise<InstallmentView[]> {
  const col = await requireCol();
  if (!col) {
    return demoInstallments()
      .filter((i) => (!opts.projectId || i.projectId === opts.projectId) && (!opts.clientId || i.clientId === opts.clientId))
      .slice(0, opts.limit ?? 1000);
  }
  const filter: Record<string, unknown> = {};
  if (opts.projectId) filter.projectId = opts.projectId;
  if (opts.clientId) filter.clientId = opts.clientId;
  const docs = await col.find(filter, { sort: { projectId: 1, number: 1 }, limit: opts.limit ?? 1000 }).toArray();
  return docs.map(toView);
}

export async function getInstallment(id: string): Promise<InstallmentView | null> {
  const col = await requireCol();
  if (!col) return demoInstallments().find((i) => i.id === id) ?? null;
  const { ObjectId } = await import('mongodb');
  try {
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? toView(doc) : null;
  } catch {
    return null;
  }
}

export type PlanConfig = {
  projectId: string;
  clientId: string;
  total: number;
  count: number;
  firstDueDate: string; // YYYY-MM-DD
  cadenceDays?: number;  // default 30
  currency?: string;
  invoicePrefix?: string;
  replace?: boolean;     // wipe existing installments for the project first
};

/** Split `total` into `count` installments (last absorbs rounding remainder). */
export function splitAmount(total: number, count: number): number[] {
  const base = Math.floor(total / count);
  const out = Array<number>(count).fill(base);
  out[count - 1] += total - base * count;
  return out;
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Generate (or regenerate) an installment plan for a project. This is the
 * "define payment plan / configure installment schedule" admin capability.
 */
export async function generatePlan(cfg: PlanConfig): Promise<{ ok: boolean; created: number; error?: string }> {
  if (cfg.count < 1 || cfg.count > 120) return { ok: false, created: 0, error: 'Count must be 1–120' };
  if (cfg.total < 0) return { ok: false, created: 0, error: 'Total must be positive' };
  const cadence = cfg.cadenceDays ?? 30;
  const amounts = splitAmount(cfg.total, cfg.count);
  const prefix = cfg.invoicePrefix ?? `INV-${cfg.projectId.slice(-4).toUpperCase()}`;
  const now = new Date();

  const docs: Installment[] = amounts.map((amount, idx) => ({
    projectId: cfg.projectId, clientId: cfg.clientId, number: idx + 1,
    dueDate: addDays(cfg.firstDueDate, cadence * idx), amount, currency: cfg.currency ?? 'BDT',
    status: 'pending', reference: '', invoiceNumber: `${prefix}-${String(idx + 1).padStart(2, '0')}`,
    receiptAvailable: false, notes: '',
    history: [{ at: now, action: 'plan_created', detail: `Installment ${idx + 1}/${cfg.count} scheduled` }],
    createdAt: now, updatedAt: now,
  }));

  const col = await requireCol();
  if (!col) return { ok: true, created: docs.length };
  if (cfg.replace) await col.deleteMany({ projectId: cfg.projectId });
  await col.insertMany(docs);
  return { ok: true, created: docs.length };
}

/** Record a payment against an installment (admin: "mark installment as paid"). */
export async function markInstallmentPaid(
  id: string,
  info: { method?: PaymentMethod; reference?: string; paidDate?: string; actor?: string },
): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const now = new Date();
  const paidDate = info.paidDate || now.toISOString().slice(0, 10);
  const entry: AuditEntry = {
    at: now, action: 'payment_recorded',
    detail: `Marked paid${info.method ? ` via ${info.method}` : ''}${info.reference ? ` (ref ${info.reference})` : ''}${info.actor ? ` by ${info.actor}` : ''}`,
  };
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { status: 'paid', paidDate, method: info.method, reference: info.reference ?? '', receiptAvailable: true, updatedAt: now },
      $push: { history: entry },
    },
  );
  return res.matchedCount > 0;
}

export async function updateInstallment(
  id: string,
  patch: { dueDate?: string; amount?: number; notes?: string; actor?: string },
): Promise<boolean> {
  const col = await requireCol();
  if (!col) return false;
  const { ObjectId } = await import('mongodb');
  const now = new Date();
  const set: Record<string, unknown> = { updatedAt: now };
  if (patch.dueDate) set.dueDate = patch.dueDate;
  if (patch.amount !== undefined) set.amount = patch.amount;
  if (patch.notes !== undefined) set.notes = patch.notes;
  const entry: AuditEntry = { at: now, action: 'schedule_modified', detail: `Adjusted${patch.actor ? ` by ${patch.actor}` : ''}` };
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: set, $push: { history: entry } });
  return res.matchedCount > 0;
}

// ── Reporting ────────────────────────────────────────────────────────────

export type ProjectFinance = {
  total: number; paid: number; remaining: number; currency: string;
  paidCount: number; pendingCount: number; overdueCount: number; upcomingCount: number;
  next: InstallmentView | null;
  installments: InstallmentView[];
};

export function rollupProject(installments: InstallmentView[]): ProjectFinance {
  const sorted = [...installments].sort((a, b) => a.number - b.number);
  let paid = 0, total = 0, paidCount = 0, pendingCount = 0, overdueCount = 0, upcomingCount = 0;
  for (const i of sorted) {
    total += i.amount;
    if (i.state === 'paid') { paid += i.amount; paidCount++; }
    else {
      pendingCount++;
      if (i.state === 'overdue') overdueCount++; else upcomingCount++;
    }
  }
  const next = sorted.filter((i) => i.state !== 'paid').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] ?? null;
  return {
    total, paid, remaining: total - paid, currency: sorted[0]?.currency ?? 'BDT',
    paidCount, pendingCount, overdueCount, upcomingCount, next, installments: sorted,
  };
}

export async function getProjectFinance(projectId: string): Promise<ProjectFinance> {
  const installments = await listInstallments({ projectId });
  return rollupProject(installments);
}

export type FinanceOverview = {
  contracted: number; received: number; outstanding: number;
  overdueAmount: number; overdueCount: number; upcomingAmount: number; upcomingCount: number;
  collectionRate: number; // received / contracted, 0–100
  monthly: { label: string; received: number }[];
};

/** Company-wide financial position for the admin finance dashboard. */
export async function financeOverview(): Promise<FinanceOverview> {
  const all = await listInstallments({ limit: 10000 });
  const now = new Date();
  const soon = new Date(now); soon.setDate(soon.getDate() + 30);

  let contracted = 0, received = 0, overdueAmount = 0, overdueCount = 0, upcomingAmount = 0, upcomingCount = 0;
  const buckets: { key: string; label: string; received: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('en-GB', { month: 'short' }), received: 0 });
  }
  const index = new Map(buckets.map((b) => [b.key, b]));

  for (const i of all) {
    contracted += i.amount;
    if (i.state === 'paid') {
      received += i.amount;
      if (i.paidDate) {
        const d = new Date(`${i.paidDate}T00:00:00`);
        const b = index.get(`${d.getFullYear()}-${d.getMonth()}`);
        if (b) b.received += i.amount;
      }
    } else if (i.state === 'overdue') {
      overdueAmount += i.amount; overdueCount++;
    } else {
      const due = new Date(`${i.dueDate}T00:00:00`);
      if (due <= soon) { upcomingAmount += i.amount; upcomingCount++; }
    }
  }
  return {
    contracted, received, outstanding: contracted - received,
    overdueAmount, overdueCount, upcomingAmount, upcomingCount,
    collectionRate: contracted ? Math.round((received / contracted) * 100) : 0,
    monthly: buckets.map((b) => ({ label: b.label, received: b.received })),
  };
}

// ── Demo installments (no-DB fallback) ───────────────────────────────────

let _installments: InstallmentView[] | null = null;

function demoInstallments(): InstallmentView[] {
  if (_installments) return _installments;
  const now = new Date();
  const ymd = (d: Date) => d.toISOString().slice(0, 10);
  const monthShift = (m: number, day = 10) => new Date(now.getFullYear(), now.getMonth() + m, day);
  const rows: Array<{ id: string; project: string; n: number; due: Date; amount: number; paid?: Date; method?: PaymentMethod; ref?: string }> = [
    // Project 1: 240,000 over 6 — 2 paid, 1 overdue, 3 upcoming
    { id: 'demo-inst-1', project: 'demo-project-1', n: 1, due: monthShift(-2), amount: 40000, paid: monthShift(-2, 12), method: 'bkash', ref: 'BKX8842' },
    { id: 'demo-inst-2', project: 'demo-project-1', n: 2, due: monthShift(-1), amount: 40000, paid: monthShift(-1, 9), method: 'bank-transfer', ref: 'TRX55021' },
    { id: 'demo-inst-3', project: 'demo-project-1', n: 3, due: monthShift(0, Math.max(1, now.getDate() - 3)), amount: 40000 },
    { id: 'demo-inst-4', project: 'demo-project-1', n: 4, due: monthShift(1), amount: 40000 },
    { id: 'demo-inst-5', project: 'demo-project-1', n: 5, due: monthShift(2), amount: 40000 },
    { id: 'demo-inst-6', project: 'demo-project-1', n: 6, due: monthShift(3), amount: 40000 },
    // Project 2: 60,000 over 3 — all paid
    { id: 'demo-inst-7', project: 'demo-project-2', n: 1, due: monthShift(-5), amount: 20000, paid: monthShift(-5, 8), method: 'nagad', ref: 'NGD1201' },
    { id: 'demo-inst-8', project: 'demo-project-2', n: 2, due: monthShift(-4), amount: 20000, paid: monthShift(-4, 10), method: 'nagad', ref: 'NGD1288' },
    { id: 'demo-inst-9', project: 'demo-project-2', n: 3, due: monthShift(-3), amount: 20000, paid: monthShift(-3, 7), method: 'cash', ref: '' },
  ];
  _installments = rows.map((r) => {
    const status: StoredStatus = r.paid ? 'paid' : 'pending';
    const proj = r.project.slice(-1);
    return {
      id: r.id, projectId: r.project, clientId: 'demo-client', number: r.n, dueDate: ymd(r.due),
      amount: r.amount, currency: 'BDT', status, paidDate: r.paid ? ymd(r.paid) : '',
      method: r.method, reference: r.ref ?? '', invoiceNumber: `INV-P${proj}-${String(r.n).padStart(2, '0')}`,
      receiptAvailable: !!r.paid, notes: '',
      history: r.paid
        ? [{ at: r.due, action: 'plan_created', detail: `Installment ${r.n} scheduled` }, { at: r.paid, action: 'payment_recorded', detail: `Marked paid via ${r.method}` }]
        : [{ at: r.due, action: 'plan_created', detail: `Installment ${r.n} scheduled` }],
      createdAt: now, updatedAt: r.paid ?? now, state: deriveState(status, ymd(r.due)),
    };
  });
  return _installments;
}

/** Flatten installment audit histories across all projects — recent first. */
export async function listRecentFinanceActivity(limit = 20): Promise<Array<AuditEntry & { installmentId: string; projectId: string; invoiceNumber: string }>> {
  const all = await listInstallments({ limit: 10000 });
  const flat = all.flatMap((i) => i.history.map((h) => ({ ...h, installmentId: i.id, projectId: i.projectId, invoiceNumber: i.invoiceNumber })));
  return flat.sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, limit);
}

/** Present a stored project id via demo lookup name (for admin lists). */
export function demoProjectName(projectId: string): string {
  return demoProjects().find((p) => p.id === projectId)?.name ?? projectId;
}
