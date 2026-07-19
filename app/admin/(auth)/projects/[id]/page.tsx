import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getProject, PROJECT_STAGES, setProjectStage, STAGE_LABEL, type ProjectStage } from '@/lib/projects';
import {
  generatePlan, getProjectFinance, markInstallmentPaid,
  PAYMENT_METHODS, type DerivedState, type PaymentMethod,
} from '@/lib/installments';
import { addDocument, DOC_CATEGORIES, DOC_CATEGORY_LABEL } from '@/lib/documents';
import { addMessage, listMessages } from '@/lib/messages';
import { createNotification } from '@/lib/notifications';
import { taka } from '@/lib/payments';
import { getDb } from '@/lib/db';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Manage project' };

function fmtDate(s: string) {
  if (!s) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${s}T00:00:00`));
}
const stateTone: Record<DerivedState, 'green' | 'amber' | 'indigo' | 'default'> = { paid: 'green', overdue: 'amber', 'due-soon': 'indigo', upcoming: 'default' };
const today = () => new Date().toISOString().slice(0, 10);

export default async function ManageProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const db = await getDb();
  const isDemo = !db || id.startsWith('demo-');
  const [finance, docs, messages] = await Promise.all([
    getProjectFinance(id),
    listDocumentsSafe(id),
    listMessages({ projectId: id }),
  ]);

  // ── Server actions (admin scope; wrapped by the (auth) gate) ──────────
  async function stageAction(formData: FormData) {
    'use server';
    const stage = String(formData.get('stage') ?? '') as ProjectStage;
    if (PROJECT_STAGES.includes(stage)) {
      await setProjectStage(id, stage);
      await createNotification({ clientId: project!.clientId, projectId: id, type: 'milestone', title: 'Project stage updated', body: `Your project moved to “${STAGE_LABEL[stage]}”.` });
    }
    revalidatePath(`/admin/projects/${id}`);
  }

  async function planAction(formData: FormData) {
    'use server';
    const res = await generatePlan({
      projectId: id, clientId: project!.clientId,
      total: Number(formData.get('total') ?? project!.totalValue),
      count: Number(formData.get('count') ?? 3),
      firstDueDate: String(formData.get('firstDueDate') ?? today()),
      cadenceDays: Number(formData.get('cadenceDays') ?? 30),
      replace: true,
    });
    if (res.ok) {
      await createNotification({ clientId: project!.clientId, projectId: id, type: 'invoice', title: 'Payment plan ready', body: `A ${res.created}-installment plan has been set up for your project.` });
    }
    revalidatePath(`/admin/projects/${id}`);
  }

  async function markPaidAction(formData: FormData) {
    'use server';
    const instId = String(formData.get('installmentId') ?? '');
    const method = String(formData.get('method') ?? '') as PaymentMethod;
    await markInstallmentPaid(instId, {
      method: PAYMENT_METHODS.includes(method) ? method : undefined,
      reference: String(formData.get('reference') ?? ''),
      paidDate: String(formData.get('paidDate') ?? today()),
      actor: 'admin',
    });
    await createNotification({ clientId: project!.clientId, projectId: id, type: 'payment', title: 'Payment received', body: 'We recorded your payment. A receipt is available in your portal.' });
    revalidatePath(`/admin/projects/${id}`);
  }

  async function addDocAction(formData: FormData) {
    'use server';
    const res = await addDocument({
      projectId: id, clientId: project!.clientId,
      title: String(formData.get('title') ?? ''),
      category: String(formData.get('category') ?? 'other'),
      url: String(formData.get('url') ?? ''),
      notes: String(formData.get('notes') ?? ''),
    });
    if (res.ok) await createNotification({ clientId: project!.clientId, projectId: id, type: 'file', title: 'New document uploaded', body: 'A new file was added to your project workspace.' });
    revalidatePath(`/admin/projects/${id}`);
  }

  async function replyAction(formData: FormData) {
    'use server';
    const body = String(formData.get('body') ?? '').trim();
    if (!body) return;
    await addMessage({ projectId: id, clientId: project!.clientId, sender: 'team', authorName: 'Nimikh Team', body });
    await createNotification({ clientId: project!.clientId, projectId: id, type: 'message', title: 'New message from the team', body: body.slice(0, 100) });
    revalidatePath(`/admin/projects/${id}`);
  }

  const tiles: Tile[] = [
    { label: 'Total value', value: taka(finance.total || project.totalValue) },
    { label: 'Collected', value: taka(finance.paid), accent: 'green', sub: `${finance.paidCount}/${finance.installments.length || 0}` },
    { label: 'Remaining', value: taka((finance.total || project.totalValue) - finance.paid), accent: 'amber' },
    { label: 'Overdue', value: finance.overdueCount, accent: finance.overdueCount > 0 ? 'amber' : 'default' },
  ];

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/projects" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to projects</Link>
      </div>
      <PageHead title={project.name} subtitle={`${project.clientName} · ${project.stageLabel}`} />

      {isDemo ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', marginBottom: 'var(--space-20)' }}>
          <p className="text-body text-sm">Demo project — changes won&apos;t persist without a database. Connect <code>MONGODB_URI</code> to manage live projects.</p>
        </div>
      ) : null}

      <StatGrid tiles={tiles} />

      <div className="grid-2" style={{ marginTop: 'var(--space-24)', alignItems: 'start' }}>
        <SectionCard title="Project stage">
          <form action={stageAction} style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Current stage</label>
              <select name="stage" className="form-input" defaultValue={project.stage}>
                {PROJECT_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
              </select>
            </div>
            <button className="btn btn-secondary">Update</button>
          </form>
        </SectionCard>

        <SectionCard title="Define / regenerate payment plan">
          <form action={planAction} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Total (BDT)</label>
              <input name="total" type="number" min="0" className="form-input" defaultValue={project.totalValue} />
            </div>
            <div className="form-group">
              <label className="form-label">Installments</label>
              <input name="count" type="number" min="1" max="120" className="form-input" defaultValue={finance.installments.length || 3} />
            </div>
            <div className="form-group">
              <label className="form-label">First due date</label>
              <input name="firstDueDate" type="date" className="form-input" defaultValue={today()} />
            </div>
            <div className="form-group">
              <label className="form-label">Cadence (days)</label>
              <input name="cadenceDays" type="number" min="1" className="form-input" defaultValue={30} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {finance.installments.length ? 'Replace plan' : 'Generate plan'}
              </button>
              {finance.installments.length ? <p className="text-sm" style={{ color: 'var(--fg-tertiary)', fontSize: '.72rem', marginTop: 6 }}>Replacing regenerates all installments for this project.</p> : null}
            </div>
          </form>
        </SectionCard>
      </div>

      <SectionCard title="Installments" className="mt-24">
        {finance.installments.length === 0 ? (
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No plan yet — define one above.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>#</th><th>Due</th><th className="num">Amount</th><th>Status</th><th>Record payment</th></tr></thead>
              <tbody>
                {finance.installments.map((i) => (
                  <tr key={i.id}>
                    <td>{i.number}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(i.dueDate)}</td>
                    <td className="num" style={{ fontWeight: 600, color: 'var(--fg-primary)' }}>{taka(i.amount)}</td>
                    <td><StatusBadge label={i.state} tone={stateTone[i.state]} /></td>
                    <td>
                      {i.state === 'paid' ? (
                        <span style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)' }}>{fmtDate(i.paidDate || '')}{i.method ? ` · ${i.method}` : ''}</span>
                      ) : db ? (
                        <form action={markPaidAction} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <input type="hidden" name="installmentId" value={i.id} />
                          <select name="method" className="form-input" style={{ height: 32, width: 'auto', fontSize: '.78rem' }}>
                            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <input name="reference" placeholder="Ref" className="form-input" style={{ height: 32, width: 90, fontSize: '.78rem' }} />
                          <input name="paidDate" type="date" className="form-input" style={{ height: 32, width: 'auto', fontSize: '.78rem' }} defaultValue={today()} />
                          <button className="btn btn-ghost btn-sm">Mark paid</button>
                        </form>
                      ) : (
                        <span style={{ fontSize: '.78rem', color: 'var(--fg-tertiary)' }}>Connect DB to record</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <div className="grid-2 mt-24" style={{ alignItems: 'start' }}>
        <SectionCard title={`Documents (${docs.length})`}>
          <form action={addDocAction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input name="title" placeholder="Title" required className="form-input" style={{ height: 36 }} />
              <select name="category" className="form-input" style={{ height: 36 }}>
                {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{DOC_CATEGORY_LABEL[c]}</option>)}
              </select>
            </div>
            <input name="url" type="url" placeholder="File URL (https://…)" required className="form-input" style={{ height: 36 }} />
            <input name="notes" placeholder="Notes (optional)" className="form-input" style={{ height: 36 }} />
            <button className="btn btn-secondary btn-sm">Upload document</button>
          </form>
          {docs.length === 0 ? <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>None yet.</p> : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '.85rem' }}>
              {docs.map((d) => (
                <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <a href={d.url} target="_blank" rel="noopener noreferrer">{d.title}</a>
                  <span style={{ color: 'var(--fg-tertiary)' }}>{DOC_CATEGORY_LABEL[d.category]} v{d.version}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Messages">
          <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--space-16)' }}>
            {messages.length === 0 ? <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>No messages yet.</p> : messages.map((m) => (
              <div key={m.id} style={{ fontSize: '.82rem' }}>
                <strong>{m.sender === 'team' ? m.authorName || 'Team' : m.authorName || 'Client'}:</strong> {m.body}
              </div>
            ))}
          </div>
          <form action={replyAction} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea name="body" required placeholder="Reply to the client…" className="form-input" style={{ minHeight: 60 }} />
            <button className="btn btn-primary btn-sm">Send reply</button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

async function listDocumentsSafe(projectId: string) {
  const { listDocuments } = await import('@/lib/documents');
  return listDocuments({ projectId });
}
