import Link from 'next/link';
import type { ClientView } from '@/lib/clients';
import { CLIENT_STATUS } from '@/lib/clients';

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: ClientView | null;
  submitLabel: string;
  error?: string | null;
  issues?: Record<string, string[] | undefined>;
};

/**
 * Server component form for creating or editing a client. The consumer
 * page provides the server action — this component knows nothing about
 * where the data goes. Prefill values come from `initial` (edit) or an
 * empty draft (create). Field-level Zod errors surface under each input.
 */
export function ClientForm({ action, initial, submitLabel, error, issues }: Props) {
  const d = initial;
  const err = (field: string) => issues?.[field]?.[0];

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', maxWidth: 720 }}>
      {error ? (
        <div
          role="alert"
          style={{
            background: 'rgba(238,0,0,.08)',
            border: '1px solid rgba(238,0,0,.25)',
            color: '#ffb4b4',
            padding: 'var(--space-12) var(--space-16)',
            borderRadius: 'var(--radius-md)',
            fontSize: '.875rem',
          }}
        >
          {error}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <Field label="Company *" name="company" defaultValue={d?.company ?? ''} required error={err('company')} />
        <Field label="Contact person" name="contactName" defaultValue={d?.contactName ?? ''} error={err('contactName')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <Field label="Email *" name="email" type="email" defaultValue={d?.email ?? ''} required error={err('email')} />
        <Field label="Phone" name="phone" defaultValue={d?.phone ?? ''} error={err('phone')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <Field label="Website" name="website" type="url" placeholder="https://…" defaultValue={d?.website ?? ''} error={err('website')} />
        <Field label="Industry" name="industry" defaultValue={d?.industry ?? ''} error={err('industry')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="status">Status *</label>
          <select id="status" name="status" className="form-input" defaultValue={d?.status ?? 'prospect'}>
            {CLIENT_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {err('status') ? <FieldError message={err('status')!} /> : null}
        </div>
        <Field
          label="Contract signed (YYYY-MM-DD)"
          name="contractSignedOn"
          placeholder="2026-03-14"
          defaultValue={d?.contractSignedOn ?? ''}
          error={err('contractSignedOn')}
        />
      </div>
      <Field
        label="Services (comma-separated)"
        name="services"
        placeholder="Software, Growth marketing"
        defaultValue={(d?.services ?? []).join(', ')}
        error={err('services')}
      />
      <div className="form-group">
        <label className="form-label" htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={6}
          className="form-input"
          defaultValue={d?.notes ?? ''}
          placeholder="Internal notes — never shown publicly."
        />
        {err('notes') ? <FieldError message={err('notes')!} /> : null}
      </div>
      {d?.fromLeadId ? (
        <input type="hidden" name="fromLeadId" value={d.fromLeadId} />
      ) : null}

      <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center' }}>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <Link href="/admin/clients" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = 'text', placeholder, error,
}: {
  label: string; name: string; defaultValue?: string; required?: boolean;
  type?: 'text' | 'email' | 'url'; placeholder?: string; error?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="form-input"
      />
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <div role="alert" style={{ fontSize: '.75rem', color: 'var(--status-error)', marginTop: 4 }}>
      {message}
    </div>
  );
}
