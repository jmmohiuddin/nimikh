'use client';

import { useState } from 'react';

const intents = [
  { value: 'software', label: 'Software Development' },
  { value: 'marketing', label: 'Growth Marketing' },
  { value: 'creative', label: 'Creative / Marketplace' },
  { value: 'creator', label: 'Join as Creator' },
  { value: 'other', label: 'Something Else' },
] as const;

type Intent = (typeof intents)[number]['value'];

/**
 * Placeholder submit handler — the pre-Next.js site had no real backend,
 * so we preserve the same UX (spinner → toast) client-side. Wiring to a
 * real endpoint (HubSpot per NIM-087) lands in a later ticket; the shape
 * of the POST body will be identical to these input names.
 */
export function ContactForm() {
  const [intent, setIntent] = useState<Intent>('software');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Simulated latency preserves the visual feedback of the old form.
    await new Promise((r) => setTimeout(r, 1200));
    (e.target as HTMLFormElement).reset();
    setIntent('software');
    setSubmitting(false);
    setToast("✓ Message sent! We'll reply within 24 hours.");
    setTimeout(() => setToast(null), 4200);
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
        <div className="toast show" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );
}
