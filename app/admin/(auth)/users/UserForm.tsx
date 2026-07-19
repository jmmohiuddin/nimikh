import Link from 'next/link';
import { ROLES, USER_STATUS, type UserView } from '@/lib/users';

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: UserView | null;
  submitLabel: string;
  error?: string | null;
  issues?: Record<string, string[] | undefined>;
  /** Password required on create, optional (leave blank = unchanged) on edit. */
  passwordRequired?: boolean;
};

/**
 * Create/edit form for a user account. Mirrors ClientForm: the page owns
 * the server action, this component is presentational. Passwords are never
 * prefilled — on edit, an empty password field means "keep current".
 */
export function UserForm({ action, initial, submitLabel, error, issues, passwordRequired }: Props) {
  const d = initial;
  const err = (f: string) => issues?.[f]?.[0];

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', maxWidth: 640 }}>
      {error ? (
        <div role="alert" style={{ background: 'rgba(238,0,0,.08)', border: '1px solid rgba(238,0,0,.25)', color: '#ffb4b4', padding: 'var(--space-12) var(--space-16)', borderRadius: 'var(--radius-md)', fontSize: '.875rem' }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <Field label="Full name *" name="name" defaultValue={d?.name ?? ''} required error={err('name')} />
        <Field label="Email *" name="email" type="email" defaultValue={d?.email ?? ''} required error={err('email')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="role">Role *</label>
          <select id="role" name="role" className="form-input" defaultValue={d?.role ?? 'creator'}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {err('role') ? <FieldError message={err('role')!} /> : null}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="status">Status *</label>
          <select id="status" name="status" className="form-input" defaultValue={d?.status ?? 'active'}>
            {USER_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <Field
          label={passwordRequired ? 'Password *' : 'New password (leave blank to keep)'}
          name="password"
          type="password"
          required={passwordRequired}
          placeholder="Min 8 characters"
          error={err('password')}
        />
        <Field label="Phone" name="phone" defaultValue={d?.phone ?? ''} error={err('phone')} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" className="form-input" defaultValue={d?.notes ?? ''} maxLength={4000} />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <Link href="/admin/users" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, type = 'text', required, placeholder, error }: {
  label: string; name: string; defaultValue?: string; type?: string; required?: boolean; placeholder?: string; error?: string;
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} className="form-input" />
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <span style={{ color: '#ffb4b4', fontSize: '.78rem' }}>{message}</span>;
}
