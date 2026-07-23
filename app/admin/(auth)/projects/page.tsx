import type { Metadata } from 'next';
import Link from 'next/link';
import { listProjects, STAGE_LABEL } from '@/lib/projects';
import { listInstallments, rollupProject } from '@/lib/installments';
import { taka } from '@/lib/payments';
import { getDb } from '@/lib/db';
import { PageHead, StatGrid, StatusBadge, type Tile } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Projects' };

export default async function AdminProjectsPage() {
  const db = await getDb();
  const [projects, allInstallments] = await Promise.all([
    listProjects({ limit: 500 }),
    listInstallments({ limit: 10000 }),
  ]);

  const rows = projects.map((p) => ({ project: p, finance: rollupProject(allInstallments.filter((i) => i.projectId === p.id)) }));
  const totalValue = rows.reduce((s, r) => s + r.finance.total, 0);
  const totalPaid = rows.reduce((s, r) => s + r.finance.paid, 0);
  const overdue = rows.reduce((s, r) => s + r.finance.overdueCount, 0);

  const tiles: Tile[] = [
    { label: 'Projects', value: projects.length, icon: '🗂' },
    { label: 'Contracted', value: taka(totalValue) },
    { label: 'Collected', value: taka(totalPaid), accent: 'green' },
    { label: 'Overdue installments', value: overdue, accent: overdue > 0 ? 'amber' : 'default' },
  ];

  return (
    <div className="container">
      <PageHead
        title="Projects"
        subtitle="Every client project, its stage, and its payment plan."
        actions={<Link href="/admin/projects/new" className="btn btn-primary btn-sm">＋ New project</Link>}
      />
      <StatGrid tiles={tiles} />

      {!db ? (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)', margin: 'var(--space-24) 0' }}>
          <p className="text-body text-sm">Demo mode — sample projects shown. Connect <code>MONGODB_URI</code> to create and manage real projects.</p>
        </div>
      ) : null}

      {projects.length === 0 ? (
        <div className="card" style={{ marginTop: 'var(--space-24)' }}><p className="text-body">No projects yet. <Link href="/admin/projects/new">Create one →</Link></p></div>
      ) : (
        <div className="table-wrap" style={{ marginTop: 'var(--space-24)' }}>
          <table className="data-table">
            <thead>
              <tr><th>Project</th><th>Client</th><th>Stage</th><th className="num">Value</th><th className="num">Paid</th><th className="num">Remaining</th><th>Plan</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map(({ project, finance }) => (
                <tr key={project.id}>
                  <td style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{project.name}</td>
                  <td>{project.clientName || '—'}</td>
                  <td><StatusBadge label={STAGE_LABEL[project.stage]} tone={project.stage === 'completed' ? 'green' : 'indigo'} /></td>
                  <td className="num">{taka(finance.total)}</td>
                  <td className="num" style={{ color: '#6ee7b7' }}>{taka(finance.paid)}</td>
                  <td className="num" style={{ color: finance.remaining > 0 ? '#fbbf24' : undefined }}>{taka(finance.remaining)}</td>
                  <td>{finance.installments.length ? `${finance.paidCount}/${finance.installments.length}` : '—'}{finance.overdueCount > 0 ? <span className="badge badge-amber" style={{ marginLeft: 6, fontSize: '.6rem' }}>{finance.overdueCount} overdue</span> : null}</td>
                  <td style={{ textAlign: 'right' }}><Link href={`/admin/projects/${project.id}`} className="btn btn-ghost btn-sm">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
