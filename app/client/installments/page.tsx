import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { resolveClientProject } from '@/lib/portal';
import { getProjectFinance, type DerivedState, type InstallmentView } from '@/lib/installments';
import { taka } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';
import { Meter } from '@/app/(shared)/dashboard/Charts';
import { ProjectSwitcher } from '../ProjectSwitcher';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Installments' };

function fmtDate(s: string) {
  if (!s) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${s}T00:00:00`));
}

const stateTone: Record<DerivedState, 'green' | 'amber' | 'indigo' | 'default'> = {
  paid: 'green', overdue: 'amber', 'due-soon': 'indigo', upcoming: 'default',
};
const stateLabel: Record<DerivedState, string> = {
  paid: 'Paid', overdue: 'Overdue', 'due-soon': 'Due soon', upcoming: 'Upcoming',
};

export default async function ClientInstallments({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const q = await searchParams;
  const session = (await getSession())!;
  const { projects, current } = await resolveClientProject(session.uid, q.project);
  if (!current) notFound();

  const f = await getProjectFinance(current.id);
  // Running remaining balance after each installment (schedule view).
  let running = f.total;
  const withRemaining = f.installments.map((i) => {
    const before = running;
    running -= i.amount;
    return { inst: i, remainingAfter: before - i.amount };
  });

  const tiles: Tile[] = [
    { label: 'Total value', value: taka(f.total) },
    { label: 'Paid', value: taka(f.paid), accent: 'green', sub: `${f.paidCount} of ${f.installments.length}` },
    { label: 'Remaining', value: taka(f.remaining), accent: f.remaining > 0 ? 'amber' : 'green' },
    { label: 'Overdue', value: f.overdueCount, accent: f.overdueCount > 0 ? 'amber' : 'default' },
  ];

  return (
    <>
      <PageHead
        title="Installments"
        subtitle={`Payment plan for ${current.name}`}
        actions={<ProjectSwitcher projects={projects} current={current.id} basePath="/client/installments" />}
      />
      <StatGrid tiles={tiles} />

      <SectionCard title="Payment progress" className="mt-24">
        <Meter label={`${taka(f.paid)} paid of ${taka(f.total)}`} value={f.total ? Math.round((f.paid / f.total) * 100) : 0} tone="green" />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 'var(--space-16)', fontSize: '.8rem', color: 'var(--fg-tertiary)' }}>
          <span>✅ {f.paidCount} paid</span>
          <span>⏰ {f.upcomingCount} upcoming</span>
          <span>⚠️ {f.overdueCount} overdue</span>
        </div>
      </SectionCard>

      <SectionCard title="Schedule" className="mt-24">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Due date</th><th className="num">Amount</th><th>Status</th>
                <th>Paid on</th><th className="num">Balance after</th><th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {withRemaining.map(({ inst, remainingAfter }: { inst: InstallmentView; remainingAfter: number }) => (
                <tr key={inst.id}>
                  <td>{inst.number}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(inst.dueDate)}</td>
                  <td className="num" style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{taka(inst.amount)}</td>
                  <td><StatusBadge label={stateLabel[inst.state]} tone={stateTone[inst.state]} /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{inst.paidDate ? fmtDate(inst.paidDate) : '—'}</td>
                  <td className="num">{taka(remainingAfter)}</td>
                  <td>
                    <a href={`/client/invoices/${inst.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.82rem' }}>
                      {inst.state === 'paid' ? 'Receipt' : 'Invoice'} ↗
                    </a>
                    {inst.notes ? <div style={{ fontSize: '.72rem', color: 'var(--fg-tertiary)' }}>{inst.notes}</div> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}
