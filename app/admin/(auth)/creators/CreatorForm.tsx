import Link from 'next/link';
import { CREATOR_CATEGORIES, CREATOR_STATUS, type CreatorView } from '@/lib/creators';

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<CreatorView> | null;
  submitLabel: string;
  error?: string | null;
  issues?: Record<string, string[] | undefined>;
};

/** Creator create/edit form. Uses the same fields the public marketplace card renders. */
export function CreatorForm({ action, initial, submitLabel, error, issues }: Props) {
  const d = initial ?? {};
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
        <Field label="Name *" name="name" required defaultValue={d.name ?? ''} error={err('name')} />
        <Field label="Role / title *" name="role" required defaultValue={d.role ?? ''} placeholder="Video Editor & Content Creator" error={err('role')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-16)' }}>
        <Select label="Category *" name="category" defaultValue={d.category ?? 'video'} options={[...CREATOR_CATEGORIES]} error={err('category')} />
        <Select label="Status *" name="status" defaultValue={d.status ?? 'draft'} options={[...CREATOR_STATUS]} error={err('status')} />
        <Field label="Initial (1–2 chars) *" name="initial" required maxLength={2} defaultValue={d.initial ?? ''} error={err('initial')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-16)' }}>
        <Field
          label="Avatar background (CSS gradient) *"
          name="bg"
          required
          defaultValue={d.bg ?? 'linear-gradient(135deg,#5e6ad2,#7c3aed)'}
          placeholder="linear-gradient(135deg,#5e6ad2,#7c3aed)"
          error={err('bg')}
        />
        <Field label="Emoji *" name="emoji" required maxLength={4} defaultValue={d.emoji ?? '🎬'} error={err('emoji')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-16)' }}>
        <Field label="Rate *" name="rate" required defaultValue={d.rate ?? 'From ৳5,000'} error={err('rate')} />
        <Field label="Rating (0–5)" name="rating" defaultValue={d.rating ?? '5.0'} placeholder="4.9" error={err('rating')} />
        <Field label="Review count" name="reviews" type="number" defaultValue={String(d.reviews ?? 0)} error={err('reviews')} />
      </div>

      <Field
        label="Skill chips (comma-separated)"
        name="chips"
        placeholder="Reels, TikTok, Hooks"
        defaultValue={(d.chips ?? []).join(', ')}
        error={err('chips')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
        <Field label="Portfolio URL" name="portfolioUrl" type="url" defaultValue={d.portfolioUrl ?? ''} placeholder="https://…" error={err('portfolioUrl')} />
        <Field label="Contact email" name="email" type="email" defaultValue={d.email ?? ''} placeholder="creator@example.com" error={err('email')} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="notes">Notes (internal)</label>
        <textarea id="notes" name="notes" rows={4} className="form-input" defaultValue={d.notes ?? ''} />
        {err('notes') ? <FieldError message={err('notes')!} /> : null}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center' }}>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <Link href="/admin/creators" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = 'text', placeholder, error, maxLength,
}: {
  label: string; name: string; defaultValue?: string; required?: boolean;
  type?: 'text' | 'email' | 'url' | 'number'; placeholder?: string; error?: string; maxLength?: number;
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
        maxLength={maxLength}
        className="form-input"
      />
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}

function Select({
  label, name, defaultValue, options, error,
}: { label: string; name: string; defaultValue: string; options: string[]; error?: string }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={`f-${name}`}>{label}</label>
      <select id={`f-${name}`} name={name} className="form-input" defaultValue={defaultValue}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
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
