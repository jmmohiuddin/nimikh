import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { ClientForm } from '../ClientForm';
import { createClient } from '@/lib/clients';
import { getLead } from '@/lib/leads';

export const dynamic = 'force-dynamic';

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

async function createClientAction(formData: FormData) {
  'use server';
  const input = parseFormData(formData);
  const result = await createClient(input);
  if (!result.ok) {
    // The result surfaces through the query string so error state survives
    // the redirect. Fine for a low-traffic admin — no CSRF token needed
    // because this route is behind the (auth) layout's session gate.
    const params = new URLSearchParams({
      error: result.error,
      ...(result.issues ? { issues: JSON.stringify(result.issues) } : {}),
      ...Object.fromEntries(
        Object.entries(input).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : String(v)]),
      ),
    });
    redirect(`/admin/clients/new?${params.toString()}`);
  }
  revalidatePath('/admin/clients');
  redirect(result.id ? `/admin/clients/${result.id}?created=1` : '/admin/clients?created=1');
}

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const one = (k: string) => (Array.isArray(q[k]) ? q[k]?.[0] : q[k]) ?? '';
  const error = one('error') || null;
  const issues = one('issues') ? (JSON.parse(one('issues')) as Record<string, string[] | undefined>) : undefined;

  // Prefill from lead if ?fromLeadId= is present (from the leads "Convert" action).
  const fromLeadId = one('fromLeadId');
  let prefill: Record<string, string> = {};
  if (fromLeadId) {
    const lead = await getLead(fromLeadId);
    if (lead) {
      prefill = {
        company: lead.company ?? '',
        contactName: `${lead.firstName} ${lead.lastName}`.trim(),
        email: lead.email,
        phone: lead.phone ?? '',
        notes: `From lead ${fromLeadId}\nOriginal intent: ${lead.intent}\nBudget mentioned: ${lead.budget ?? '—'}\n\n${lead.message}`,
      };
    }
  }

  // Merge (in priority): query-string prefill (from a failed submit) > lead prefill.
  const initial = {
    id: '',
    company: one('company') || prefill.company || '',
    contactName: one('contactName') || prefill.contactName || '',
    email: one('email') || prefill.email || '',
    phone: one('phone') || prefill.phone || '',
    website: one('website') || '',
    industry: one('industry') || '',
    status: (one('status') as 'prospect') || 'prospect',
    services: (one('services') || '').split(',').map((s) => s.trim()).filter(Boolean),
    notes: one('notes') || prefill.notes || '',
    contractSignedOn: one('contractSignedOn') || '',
    fromLeadId: fromLeadId || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 'var(--space-20)' }}>
        <Link href="/admin/clients" style={{ fontSize: '.875rem', color: 'var(--fg-tertiary)' }}>← Back to clients</Link>
      </div>
      <h1 className="text-h2 mb-24">
        {fromLeadId ? 'Convert lead → client' : 'New client'}
      </h1>
      <ClientForm
        action={createClientAction}
        initial={initial}
        submitLabel="Create client"
        error={error}
        issues={issues}
      />
    </div>
  );
}
