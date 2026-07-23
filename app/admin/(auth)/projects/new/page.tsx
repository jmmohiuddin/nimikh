import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createProject, PROJECT_STAGES, STAGE_LABEL } from '@/lib/projects';
import { listUsers } from '@/lib/users';
import { PageHead } from '@/app/(shared)/dashboard/ui';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'New project' };

async function createAction(formData: FormData) {
  'use server';
  const clientId = String(formData.get('clientId') ?? '');
  const clients = await listUsers({ role: 'client', limit: 500 });
  const client = clients.find((c) => c.id === clientId);
  const input = {
    clientId,
    clientName: client?.name ?? '',
    name: String(formData.get('name') ?? ''),
    description: String(formData.get('description') ?? ''),
    stage: String(formData.get('stage') ?? 'created'),
    totalValue: Number(formData.get('totalValue') ?? 0),
    currency: 'BDT',
    startDate: String(formData.get('startDate') ?? ''),
    expectedDelivery: String(formData.get('expectedDelivery') ?? ''),
    projectManager: String(formData.get('projectManager') ?? ''),
    designer: String(formData.get('designer') ?? ''),
    developer: String(formData.get('developer') ?? ''),
    links: [],
  };
  const result = await createProject(input);
  if (!result.ok) redirect(`/admin/projects/new?error=${encodeURIComponent(result.error ?? 'Failed')}`);
  revalidatePath('/admin/projects');
  redirect(result.id ? `/admin/projects/${result.id}?created=1` : '/admin/projects?created=1');
}

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const q = await searchParams;
  const clients = await listUsers({ role: 'client', limit: 500 });

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/projects" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to projects</Link>
      </div>
      <PageHead title="New project" subtitle="Assign a project to a client. You can define the payment plan next." />

      {q.error ? (
        <div role="alert" style={{ background: 'rgba(238,0,0,.08)', border: '1px solid rgba(238,0,0,.25)', color: '#ffb4b4', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '.85rem', marginBottom: 'var(--space-20)' }}>{q.error}</div>
      ) : null}

      {clients.length === 0 ? (
        <div className="card"><p className="text-body">No client accounts yet. <Link href="/admin/users/new">Create a user with the “client” role →</Link></p></div>
      ) : (
        <form action={createAction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', maxWidth: 720 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="clientId">Client *</label>
              <select id="clientId" name="clientId" required className="form-input">
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="stage">Stage</label>
              <select id="stage" name="stage" className="form-input" defaultValue="created">
                {PROJECT_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
              </select>
            </div>
          </div>
          <Field label="Project name *" name="name" required />
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea id="description" name="description" className="form-input" maxLength={4000} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-16)' }}>
            <Field label="Total value (BDT) *" name="totalValue" type="number" required />
            <Field label="Start date" name="startDate" type="date" />
            <Field label="Expected delivery" name="expectedDelivery" type="date" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-16)' }}>
            <Field label="Project manager" name="projectManager" />
            <Field label="Designer" name="designer" />
            <Field label="Developer" name="developer" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
            <button type="submit" className="btn btn-primary">Create project</button>
            <Link href="/admin/projects" className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} required={required} className="form-input" step={type === 'number' ? '1' : undefined} min={type === 'number' ? '0' : undefined} />
    </div>
  );
}
