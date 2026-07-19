import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import {
  addCallLog, getAgentLead, listAgentLeads, LEAD_STAGES, OPEN_STAGES,
  setLeadStage, type AgentLeadView, type LeadStage,
} from '@/lib/agentLeads';
import { taka } from '@/lib/payments';
import { getDb } from '@/lib/db';
import { PageHead, SectionCard, StatusBadge } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Leads' };

const stageTone: Record<LeadStage, 'green' | 'amber' | 'indigo' | 'default'> = {
  new: 'indigo', contacted: 'indigo', followup: 'amber', converted: 'green', lost: 'default',
};

function fmt(d: Date | null | undefined) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(d));
}

async function assertOwner(id: string): Promise<boolean> {
  const session = (await getSession())!;
  const lead = await getAgentLead(id);
  return !!lead && lead.assignedAgentId === session.uid;
}

async function stageAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const stage = String(formData.get('stage') ?? '') as LeadStage;
  if (LEAD_STAGES.includes(stage) && (await assertOwner(id))) {
    await setLeadStage(id, stage);
  }
  revalidatePath('/agent/leads');
}

async function logAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const outcome = String(formData.get('outcome') ?? 'Called');
  const note = String(formData.get('note') ?? '');
  const followUp = String(formData.get('followUp') ?? '');
  if (await assertOwner(id)) {
    await addCallLog(id, outcome, note, followUp ? new Date(followUp) : undefined);
  }
  revalidatePath('/agent/leads');
}

export default async function AgentLeads({ searchParams }: { searchParams: Promise<{ stage?: string; q?: string }> }) {
  const q = await searchParams;
  const session = (await getSession())!;
  const db = await getDb();
  const stageFilter = (LEAD_STAGES as readonly string[]).includes(q.stage ?? '') ? (q.stage as LeadStage) : undefined;
  const search = (q.q ?? '').trim().toLowerCase();

  let leads = await listAgentLeads({ agentId: session.uid, stage: stageFilter, limit: 500 });
  if (search) {
    leads = leads.filter((l) =>
      l.name.toLowerCase().includes(search) ||
      l.company.toLowerCase().includes(search) ||
      l.phone.toLowerCase().includes(search));
  }

  return (
    <>
      <PageHead
        title="Lead management"
        subtitle="Contact, follow up, and convert your assigned leads."
        actions={
          <form method="get" style={{ display: 'flex', gap: 8 }}>
            {stageFilter ? <input type="hidden" name="stage" value={stageFilter} /> : null}
            <input name="q" defaultValue={q.q ?? ''} placeholder="Search name, company, phone" className="form-input" style={{ height: 34, width: 220, fontSize: '.85rem' }} />
            <button className="btn btn-secondary btn-sm">Search</button>
          </form>
        }
      />

      <div className="filter-tabs">
        <Link href="/agent/leads" className={`filter-tab${!stageFilter ? ' active' : ''}`}>All</Link>
        {LEAD_STAGES.map((s) => (
          <Link key={s} href={`/agent/leads?stage=${s}`} className={`filter-tab${stageFilter === s ? ' active' : ''}`} style={{ textTransform: 'capitalize' }}>{s}</Link>
        ))}
      </div>

      {!db ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', marginBottom: 'var(--space-20)' }}>
          <p className="text-body text-sm">Demo mode — sample leads shown. Connect <code>MONGODB_URI</code> to manage a live pipeline (stage changes and call logs will then persist).</p>
        </div>
      ) : null}

      {leads.length === 0 ? (
        <div className="card"><p className="text-body">No leads{stageFilter ? ` in "${stageFilter}"` : ''}{search ? ` matching "${q.q}"` : ''}.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {leads.map((l) => <LeadCard key={l.id} lead={l} />)}
        </div>
      )}
    </>
  );
}

function LeadCard({ lead }: { lead: AgentLeadView }) {
  const advanceable = OPEN_STAGES.includes(lead.stage);
  return (
    <SectionCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-16)', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {lead.name}
            <StatusBadge label={lead.stage} tone={stageTone[lead.stage]} />
          </div>
          <div style={{ fontSize: '.85rem', color: 'var(--fg-secondary)', marginTop: 4 }}>
            {lead.company ? `${lead.company} · ` : ''}{lead.phone}{lead.email ? ` · ${lead.email}` : ''}
          </div>
          <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>
            Est. value {taka(lead.value)}{lead.source ? ` · via ${lead.source}` : ''}
            {lead.followUpAt ? ` · follow up ${fmt(lead.followUpAt)}` : ''}
            {lead.lastContactedAt ? ` · last contact ${fmt(lead.lastContactedAt)}` : ''}
          </div>
        </div>
      </div>

      {/* Stage controls */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'var(--space-16)' }}>
        {advanceable ? (
          <>
            <StageButton id={lead.id} stage="contacted" label="Mark contacted" disabled={lead.stage === 'contacted'} />
            <StageButton id={lead.id} stage="followup" label="Needs follow-up" disabled={lead.stage === 'followup'} />
            <StageButton id={lead.id} stage="converted" label="✓ Convert" primary />
            <StageButton id={lead.id} stage="lost" label="Lost" />
          </>
        ) : (
          <span className="text-sm" style={{ color: 'var(--fg-tertiary)', fontSize: '.8rem' }}>
            {lead.stage === 'converted' ? `Converted ${fmt(lead.convertedAt)} — commission credited.` : 'Closed as lost.'}
          </span>
        )}
      </div>

      {/* Call history */}
      {lead.callLog.length > 0 ? (
        <details style={{ marginTop: 'var(--space-16)' }}>
          <summary style={{ cursor: 'pointer', fontSize: '.82rem', color: 'var(--fg-secondary)' }}>Call history ({lead.callLog.length})</summary>
          <ul style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lead.callLog.map((c, i) => (
              <li key={i} style={{ fontSize: '.8rem', color: 'var(--fg-secondary)' }}>
                <span style={{ color: 'var(--fg-tertiary)' }}>{fmt(c.at)}</span> — <strong>{c.outcome}</strong>{c.note ? `: ${c.note}` : ''}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {/* Log a call / add note */}
      {advanceable ? (
        <form action={logAction} style={{ marginTop: 'var(--space-16)', display: 'grid', gridTemplateColumns: '140px 1fr 150px auto', gap: 8, alignItems: 'end' }}>
          <input type="hidden" name="id" value={lead.id} />
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '.72rem' }}>Outcome</label>
            <select name="outcome" className="form-input" style={{ height: 36, fontSize: '.82rem' }}>
              <option>Called — spoke</option>
              <option>Called — no answer</option>
              <option>Left voicemail</option>
              <option>Sent proposal</option>
              <option>Note</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '.72rem' }}>Note</label>
            <input name="note" maxLength={400} className="form-input" style={{ height: 36, fontSize: '.82rem' }} placeholder="What happened?" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '.72rem' }}>Next follow-up</label>
            <input name="followUp" type="date" className="form-input" style={{ height: 36, fontSize: '.82rem' }} />
          </div>
          <button className="btn btn-secondary btn-sm">Log</button>
        </form>
      ) : null}
    </SectionCard>
  );
}

function StageButton({ id, stage, label, primary, disabled }: { id: string; stage: LeadStage; label: string; primary?: boolean; disabled?: boolean }) {
  return (
    <form action={stageAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="stage" value={stage} />
      <button className={`btn btn-sm ${primary ? 'btn-primary' : 'btn-ghost'}`} disabled={disabled}>{label}</button>
    </form>
  );
}
