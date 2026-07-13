'use client';

import { useState } from 'react';

const intents = [
  { value: 'software', label: 'Software Development' },
  { value: 'marketing', label: 'Growth Marketing' },
  { value: 'creative', label: 'Creative / Marketplace' },
  { value: 'creator', label: 'Join as Creator' },
  { value: 'hiring', label: 'Career (Growth Lead)' },
  { value: 'other', label: 'Something Else' },
] as const;

type Intent = (typeof intents)[number]['value'];

/**
 * Real submission to POST /api/leads. Validation is server-side (Zod);
 * client-side we just surface the resulting error message. Includes a
 * hidden honeypot input (`website`) that legit users leave empty.
 */
export function ContactForm({ initialIntent }: { initialIntent?: Intent } = {}) {
  const [intent, setIntent] = useState<Intent>(initialIntent ?? 'software');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      intent,
      firstName: String(data.get('first_name') ?? ''),
      lastName: String(data.get('last_name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      company: String(data.get('company') ?? ''),
      budget: String(data.get('budget') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
    };
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setToast({ msg: json.error ?? 'Something went wrong. Please try again.', kind: 'err' });
      } else {
        form.reset();
        setIntent(initialIntent ?? 'software');
        setToast({ msg: "✓ Message sent! We'll reply within 24 hours.", kind: 'ok' });
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
        <div
          style={{
            fontSize: '.8125rem',
            fontWeight: 500,
            color: 'var(--fg-secondary)',
            marginBottom: 'var(--space-12)',
          }}
        >
          I&apos;m interested in...
        </div>
        <div className="intent-tabs" role="tablist">
          {intents.map((i) => (
            <button
              key={i.value}
              type="button"
              role="tab"
              aria-selected={intent === i.value}
              className={`intent-tab${intent === i.value ? ' active' : ''}`}
              onClick={() => setIntent(i.value)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="intent" value={intent} />
        {/* Honeypot: legit users never see this. Bots often fill every input. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-16)',
            marginBottom: 'var(--space-16)',
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">First Name *</label>
            <input id="first-name" name="first_name" type="text" required className="form-input" placeholder="Rahim" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="last-name">Last Name *</label>
            <input id="last-name" name="last_name" type="text" required className="form-input" placeholder="Chowdhury" />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 'var(--space-16)' }}>
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input id="email" name="email" type="email" required className="form-input" placeholder="rahim@business.com" />
        </div>
        <div className="form-group" style={{ marginBottom: 'var(--space-16)' }}>
          <label className="form-label" htmlFor="phone">WhatsApp / Phone</label>
          <input id="phone" name="phone" type="tel" className="form-input" placeholder="01XXXXXXXXX" />
        </div>
        <div className="form-group" style={{ marginBottom: 'var(--space-16)' }}>
          <label className="form-label" htmlFor="company">Business / Company Name</label>
          <input id="company" name="company" type="text" className="form-input" placeholder="Dhaka Threads Ltd." />
        </div>
        <div className="form-group" style={{ marginBottom: 'var(--space-16)' }}>
          <label className="form-label" htmlFor="budget">Approximate Budget</label>
          <select id="budget" name="budget" className="form-input" defaultValue="">
            <option value="">Select a range...</option>
            <option>Under ৳25,000</option>
            <option>৳25,000 – ৳75,000</option>
            <option>৳75,000 – ৳2,00,000</option>
            <option>৳2,00,000+</option>
            <option>Not sure yet</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 'var(--space-24)' }}>
          <label className="form-label" htmlFor="message">Tell us about your project *</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="form-input"
            placeholder="Describe what you're trying to achieve, any relevant details about your business, timeline, etc."
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          style={{ justifyContent: 'center' }}
          disabled={submitting}
        >
          {submitting ? 'Sending…' : 'Send Message →'}
        </button>
        <p
          style={{
            fontSize: '.75rem',
            color: 'var(--fg-tertiary)',
            textAlign: 'center',
            marginTop: 'var(--space-12)',
          }}
        >
          We respond within 24 hours. No spam, ever.
        </p>
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
