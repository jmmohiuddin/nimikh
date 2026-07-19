import type { Metadata } from 'next';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { listProjects } from '@/lib/projects';
import { getProjectFinance } from '@/lib/installments';
import { listNotifications } from '@/lib/notifications';
import { listMessages } from '@/lib/messages';
import { taka } from '@/lib/payments';
import { PageHead, StatGrid, SectionCard, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';
import { Meter } from '@/app/(shared)/dashboard/Charts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Overview' };

function fmtDate(s: string) {
  if (!s) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${s}T00:00:00`));
}
function fmtWhen(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
}

export default async function ClientOverview() {
  const session = await requireSession('/client');
  const projects = await listProjects({ clientId: session.uid });

  if (projects.length === 0) {
    return (
      <>
        <PageHead title={`Welcome, ${session.name.split(' ')[0]}`} />
        <SectionCard title="No projects yet">
          <p className="text-body">Your account is set up, but no project has been assigned yet. Your Nimikh project manager will add one shortly.</p>
        </SectionCard>
      </>
    );
  }

  // Aggregate across all the client's projects for the headline numbers.
  const finances = await Promise.all(projects.map((p) => getProjectFinance(p.id)));
  const totalValue = finances.reduce((s, f) => s + f.total, 0);
  const paid = finances.reduce((s, f) => s + f.paid, 0);
  const remaining = totalValue - paid;
  const active = projects.find((p) => p.stage !== 'completed') ?? projects[0];
  const activeFinance = finances[projects.indexOf(active)];
  const next = finances.map((f) => f.next).filter(Boolean).sort((a, b) => a!.dueDate.localeCompare(b!.dueDate))[0] ?? null;
  const overdue = finances.reduce((s, f) => s + f.overdueCount, 0);

  const [notifs, messages] = await Promise.all([
    listNotifications(session.uid, 5),
    listMessages({ clientId: session.uid, limit: 200 }),
  ]);
  const recentMessages = messages.slice(-3).reverse();

  const tiles: Tile[] = [
    { label: 'Total project value', value: taka(totalValue), icon: '🗂', sub: `${projects.length} project${projects.length === 1 ? '' : 's'}` },
    { label: 'Amount paid', value: taka(paid), accent: 'green' },
    { label: 'Remaining balance', value: taka(remaining), accent: remaining > 0 ? 'amber' : 'green' },
    next
      ? { label: 'Next installment', value: taka(next.amount), accent: next.state === 'overdue' ? 'amber' : 'indigo', sub: `Due ${fmtDate(next.dueDate)}`, href: '/client/installments' }
      : { label: 'Next installment', value: 'All paid', accent: 'green' },
  ];

  return (
    <>
      <PageHead
        title={`Welcome back, ${session.name.split(' ')[0]}`}
        subtitle="Here's everything happening with your projects and payments."
        actions={<Link href="/client/installments" className="btn btn-primary btn-sm">View payment plan</Link>}
      />

      {overdue > 0 ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', marginBottom: 'var(--space-20)' }}>
          <p className="text-body text-sm">⚠️ You have {overdue} overdue installment{overdue === 1 ? '' : 's'}. Please see <Link href="/client/installments">Installments</Link>.</p>
        </div>
      ) : null}

      <StatGrid tiles={tiles} />

      <div className="grid-2" style={{ marginTop: 'var(--space-24)', alignItems: 'start' }}>
        <SectionCard title="Current project" action={<Link href="/client/project" className="btn btn-ghost btn-sm">Details</Link>}>
          <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 6 }}>{active.name}</div>
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <StatusBadge label={active.stageLabel} tone={active.stage === 'completed' ? 'green' : 'indigo'} />
          </div>
          <Meter label="Overall completion" value={active.completion} tone={active.completion === 100 ? 'green' : 'indigo'} />
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 8, columnGap: 16, fontSize: '.85rem', marginTop: 'var(--space-16)' }}>
            <dt style={{ color: 'var(--fg-tertiary)' }}>Paid</dt><dd>{taka(activeFinance.paid)} of {taka(activeFinance.total)}</dd>
            <dt style={{ color: 'var(--fg-tertiary)' }}>Expected delivery</dt><dd>{fmtDate(active.expectedDelivery ?? '')}</dd>
            <dt style={{ color: 'var(--fg-tertiary)' }}>Project manager</dt><dd>{active.projectManager || '—'}</dd>
          </dl>
        </SectionCard>

        <SectionCard title="Recent activity" action={<Link href="/client/notifications" className="btn btn-ghost btn-sm">All</Link>}>
          {notifs.length === 0 ? (
            <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No activity yet.</p>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notifs.map((n) => (
                <li key={n.id} style={{ display: 'flex', gap: 10 }}>
                  <span aria-hidden style={{ fontSize: '1.1rem' }}>{n.type === 'payment' ? '✅' : n.type === 'overdue' ? '⚠️' : n.type === 'milestone' ? '🚩' : n.type === 'file' ? '📎' : n.type === 'delivered' ? '🚀' : '⏰'}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '.88rem', fontWeight: 600 }}>{n.title}{!n.read ? <span className="badge badge-indigo" style={{ marginLeft: 6, fontSize: '.6rem' }}>new</span> : null}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--fg-tertiary)' }}>{fmtWhen(n.createdAt)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Support messages" className="mt-24" action={<Link href="/client/messages" className="btn btn-ghost btn-sm">Open chat</Link>}>
        {recentMessages.length === 0 ? (
          <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No messages yet. Reach out any time.</p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentMessages.map((m) => (
              <li key={m.id} style={{ fontSize: '.88rem' }}>
                <span style={{ fontWeight: 600 }}>{m.sender === 'client' ? 'You' : m.authorName || 'Team'}</span>
                <span style={{ color: 'var(--fg-tertiary)', fontSize: '.78rem' }}> · {fmtWhen(m.createdAt)}</span>
                <div style={{ color: 'var(--fg-secondary)', marginTop: 2 }}>{m.body}</div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </>
  );
}
