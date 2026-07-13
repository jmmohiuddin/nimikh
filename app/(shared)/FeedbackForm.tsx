'use client';

import { useState } from 'react';

const kinds = [
  { value: 'general', label: 'General' },
  { value: 'rating', label: 'Rate us' },
  { value: 'bug', label: 'Report a bug' },
  { value: 'feature', label: 'Feature request' },
] as const;

type Kind = (typeof kinds)[number]['value'];

export function FeedbackForm() {
  const [kind, setKind] = useState<Kind>('general');
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {
      kind,
      message: String(data.get('message') ?? ''),
      email: String(data.get('email') ?? ''),
      pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
      website: String(data.get('website') ?? ''),
    };
    if (kind === 'rating' && rating > 0) payload.rating = rating;

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setToast({ msg: json.error ?? 'Something went wrong.', kind: 'err' });
      } else {
        form.reset();
        setRating(0);
        setKind('general');
        setToast({ msg: '✓ Thanks — we read every note.', kind: 'ok' });
      }
    } catch {
      setToast({ msg: 'Network error. Please try again.', kind: 'err' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  }

  return (
    <>
      <div style={{ marginBottom: 'var(--space-24)' }}>
        <div style={{ fontSize: '.8125rem', fontWeight: 500, color: 'var(--fg-secondary)', marginBottom: 'var(--space-12)' }}>
          What kind of feedback?
        </div>
        <div className="intent-tabs" role="tablist">
          {kinds.map((k) => (
            <button
              key={k.value}
              type="button"
              role="tab"
              aria-selected={kind === k.value}
              className={`intent-tab${kind === k.value ? ' active' : ''}`}
              onClick={() => setKind(k.value)}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
        />

        {kind === 'rating' && (
          <div className="form-group" style={{ marginBottom: 'var(--space-16)' }}>
            <label className="form-label" htmlFor="rating">Your rating</label>
            <div id="rating" role="radiogroup" aria-label="Rating" style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  onClick={() => setRating(n)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '6px 12px',
                    color: rating >= n ? '#f59e0b' : 'var(--fg-tertiary)',
                    borderColor: rating >= n ? '#f59e0b' : 'var(--border-hairline)',
                  }}
                >
                  ★ {n}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 'var(--space-16)' }}>
          <label className="form-label" htmlFor="message">Your feedback *</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="form-input"
            placeholder={
              kind === 'bug'
                ? 'What happened? What did you expect?'
                : kind === 'feature'
                  ? 'What would make Nimikh work better for you?'
                  : 'Tell us anything…'
            }
          />
        </div>

        <div className="form-group" style={{ marginBottom: 'var(--space-24)' }}>
          <label className="form-label" htmlFor="email">Email (optional — for follow-up)</label>
          <input id="email" name="email" type="email" className="form-input" placeholder="you@company.com" />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          style={{ justifyContent: 'center' }}
          disabled={submitting}
        >
          {submitting ? 'Sending…' : 'Send feedback →'}
        </button>
      </form>

      {toast && (
        <div
          className="toast show"
          role="status"
          aria-live="polite"
          style={toast.kind === 'err' ? { borderColor: 'var(--status-error)', color: 'var(--status-error)' } : undefined}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
