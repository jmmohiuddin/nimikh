import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { resolveClientProject } from '@/lib/portal';
import { PROJECT_STAGES, STAGE_LABEL, type ProjectStage } from '@/lib/projects';
import { getProjectFinance } from '@/lib/installments';
import { listDocuments } from '@/lib/documents';
import { taka } from '@/lib/payments';
import { PageHead, SectionCard, StatusBadge } from '@/app/(shared)/dashboard/ui';
import { Meter } from '@/app/(shared)/dashboard/Charts';
import { ProjectSwitcher } from '../ProjectSwitcher';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Project' };

function fmtDate(s?: string) {
  if (!s) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${s}T00:00:00`));
}

export default async function ClientProjectPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const q = await searchParams;
  const session = await requireSession('/client/project');
  const { projects, current } = await resolveClientProject(session.uid, q.project);
  if (!current) notFound();

  const [finance, docs] = await Promise.all([getProjectFinance(current.id), listDocuments({ projectId: current.id })]);
  const currentIndex = PROJECT_STAGES.indexOf(current.stage);

  return (
    <>
      <PageHead
        title={current.name}
        subtitle={current.description}
        actions={<ProjectSwitcher projects={projects} current={current.id} basePath="/client/project" />}
      />

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <SectionCard title="Progress">
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <StatusBadge label={current.stageLabel} tone={current.stage === 'completed' ? 'green' : 'indigo'} />
          </div>
          <Meter label="Overall completion" value={current.completion} tone={current.completion === 100 ? 'green' : 'indigo'} />

          <ol style={{ listStyle: 'none', margin: 'var(--space-24) 0 0', padding: 0, position: 'relative' }}>
            {PROJECT_STAGES.map((stage: ProjectStage, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              const color = done ? '#34d399' : active ? 'var(--interactive-action)' : 'var(--border-subtle)';
              return (
                <li key={stage} style={{ display: 'flex', gap: 12, paddingBottom: i === PROJECT_STAGES.length - 1 ? 0 : 16, position: 'relative' }}>
                  {i < PROJECT_STAGES.length - 1 ? (
                    <span aria-hidden style={{ position: 'absolute', left: 8, top: 18, bottom: 0, width: 2, background: done ? '#34d399' : 'var(--border-hairline)' }} />
                  ) : null}
                  <span aria-hidden style={{ width: 18, height: 18, borderRadius: '50%', background: done || active ? color : 'transparent', border: `2px solid ${color}`, flexShrink: 0, zIndex: 1, display: 'grid', placeItems: 'center', fontSize: 10, color: '#fff' }}>
                    {done ? '✓' : ''}
                  </span>
                  <span style={{ fontSize: '.9rem', fontWeight: active ? 700 : 400, color: done || active ? 'var(--fg-primary)' : 'var(--fg-tertiary)' }}>
                    {STAGE_LABEL[stage]}
                    {active ? <span className="badge badge-indigo" style={{ marginLeft: 8, fontSize: '.6rem' }}>current</span> : null}
                  </span>
                </li>
              );
            })}
          </ol>
        </SectionCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <SectionCard title="Project information">
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 10, columnGap: 16, fontSize: '.88rem' }}>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Current milestone</dt><dd>{current.stageLabel}</dd>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Project manager</dt><dd>{current.projectManager || '—'}</dd>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Designer</dt><dd>{current.designer || '—'}</dd>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Developer</dt><dd>{current.developer || '—'}</dd>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Start date</dt><dd>{fmtDate(current.startDate)}</dd>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Expected delivery</dt><dd>{fmtDate(current.expectedDelivery)}</dd>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Total value</dt><dd>{taka(finance.total)}</dd>
              <dt style={{ color: 'var(--fg-tertiary)' }}>Paid</dt><dd>{taka(finance.paid)} · {taka(finance.remaining)} remaining</dd>
            </dl>
          </SectionCard>

          {current.links.length > 0 ? (
            <SectionCard title="Important links">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {current.links.map((l, i) => (
                  <li key={i}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a></li>
                ))}
              </ul>
            </SectionCard>
          ) : null}

          <SectionCard title={`Documents (${docs.length})`} action={<Link href={`/client/documents?project=${current.id}`} className="btn btn-ghost btn-sm">All files</Link>}>
            {docs.length === 0 ? (
              <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>No documents yet.</p>
            ) : (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '.85rem' }}>
                {docs.slice(0, 5).map((d) => (
                  <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <a href={d.url} target="_blank" rel="noopener noreferrer">{d.title}</a>
                    <span style={{ color: 'var(--fg-tertiary)' }}>v{d.version}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </>
  );
}
