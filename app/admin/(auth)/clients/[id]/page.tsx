import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { ClientForm } from '../ClientForm';
import { deleteClient, getClient, updateClient } from '@/lib/clients';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const client = await getClient(id);
  return { title: client?.company ?? 'Client' };
}

function parseFormData(formData: FormData) {
  const servicesRaw = String(formData.get('services') ?? '').trim();
  return {
    company: String(formData.get('company') ?? ''),
    contactName: String(formData.get('contactName') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    website: String(formData.get('website') ?? ''),
    industry: String(formData.get('industry') ?? ''),
    status: String(formData.get('status') ?? 'prospect'),
    services: servicesRaw ? servicesRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    notes: String(formData.get('notes') ?? ''),
    contractSignedOn: String(formData.get('contractSignedOn') ?? ''),
    fromLeadId: String(formData.get('fromLeadId') ?? ''),
  };
}

export default async function EditClientPage({ params, searchParams }: Params) {
  const { id } = await params;
  const q = await searchParams;
  const client = await getClient(id);
  if (!client) notFound();

  const one = (k: string) => (Array.isArray(q[k]) ? q[k]?.[0] : q[k]) ?? '';
  const savedFlag = one('saved') === '1';
  const createdFlag = one('created') === '1';
  const error = one('error') || null;
  const issues = one('issues') ? (JSON.parse(one('issues')) as Record<string, string[] | undefined>) : undefined;

  async function saveAction(formData: FormData) {
    'use server';
    const input = parseFormData(formData);
    const result = await updateClient(id, input);
    if (!result.ok) {
      const params = new URLSearchParams({
        error: result.error,
        ...(result.issues ? { issues: JSON.stringify(result.issues) } : {}),
      });
      redirect(`/admin/clients/${id}?${params.toString()}`);
    }
    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${id}`);
    redirect(`/admin/clients/${id}?saved=1`);
  }

  async function deleteAction() {
    'use server';
    await deleteClient(id);
    revalidatePath('/admin/clients');
    redirect('/admin/clients');
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/clients" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to clients</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-16)', flexWrap: 'wrap', marginBottom: 'var(--space-24)' }}>
        <h1 className="text-h2">{client.company}</h1>
        <form
          action={deleteAction}
          onSubmit={undefined}
          style={{ display: 'inline-flex' }}
        >
          <button
            type="submit"
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--status-error)', borderColor: 'rgba(238,0,0,.25)' }}
            // formNoValidate is fine — deletion has nothing to validate.
          >
            Delete
          </button>
        </form>
      </div>

      {(createdFlag || savedFlag) ? (
        <div
          role="status"
          style={{
            background: 'rgba(52,211,153,.08)',
            border: '1px solid rgba(52,211,153,.25)',
            color: '#a7f3d0',
            padding: 'var(--space-12) var(--space-16)',
            borderRadius: 'var(--radius-md)',
            fontSize: '.875rem',
            marginBottom: 'var(--space-20)',
          }}
        >
          {createdFlag ? 'Client created.' : 'Changes saved.'}
        </div>
      ) : null}

      <ClientForm
        action={saveAction}
        initial={client}
        submitLabel="Save changes"
        error={error}
        issues={issues}
      />
    </div>
  );
}
