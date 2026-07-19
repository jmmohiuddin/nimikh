import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { resolveClientProject } from '@/lib/portal';
import { DOC_CATEGORY_LABEL, groupVersions, listDocuments } from '@/lib/documents';
import { PageHead, SectionCard } from '@/app/(shared)/dashboard/ui';
import { ProjectSwitcher } from '../ProjectSwitcher';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Documents' };

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
}

export default async function ClientDocuments({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const q = await searchParams;
  const session = (await getSession())!;
  const { projects, current } = await resolveClientProject(session.uid, q.project);
  if (!current) notFound();

  const docs = await listDocuments({ projectId: current.id });
  const grouped = groupVersions(docs);

  return (
    <>
      <PageHead
        title="Documents"
        subtitle={`Files for ${current.name}. Updated files keep their history.`}
        actions={<ProjectSwitcher projects={projects} current={current.id} basePath="/client/documents" />}
      />

      {grouped.length === 0 ? (
        <SectionCard><p className="text-body">No documents have been shared yet.</p></SectionCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {grouped.map((d) => (
            <SectionCard key={`${d.category}-${d.title}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-16)', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {d.title}
                    <span className="badge badge-default">{DOC_CATEGORY_LABEL[d.category]}</span>
                    <span className="badge badge-indigo" style={{ fontSize: '.65rem' }}>v{d.version}</span>
                  </div>
                  <div style={{ fontSize: '.78rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>
                    Updated {fmtDate(d.createdAt)}{d.notes ? ` · ${d.notes}` : ''}
                  </div>
                  {d.history.length > 0 ? (
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ cursor: 'pointer', fontSize: '.78rem', color: 'var(--fg-secondary)' }}>{d.history.length} previous version{d.history.length === 1 ? '' : 's'}</summary>
                      <ul style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {d.history.map((h) => (
                          <li key={h.id} style={{ fontSize: '.8rem' }}>
                            <a href={h.url} target="_blank" rel="noopener noreferrer">v{h.version}</a>
                            <span style={{ color: 'var(--fg-tertiary)' }}> — {fmtDate(h.createdAt)}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </div>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Download ↗</a>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </>
  );
}
