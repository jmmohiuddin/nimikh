import type { Metadata } from 'next';
import Link from 'next/link';
import { team } from '@/content/team';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  // Brand omitted deliberately — the root layout template appends " — Nimikh".
  title: 'About Us — Software & Marketing Agency in Dhaka',
  description:
    'Nimikh is a software development and digital marketing agency in Dhaka, Bangladesh, built to serve small and medium businesses that cannot afford enterprise agency retainers.',
  alternates: { canonical: absoluteUrl('/about') },
};

const values = [
  { icon: '🎯', title: 'Results-driven', body: 'We measure our success by your results — not vanity metrics.' },
  { icon: '🔒', title: 'Trust & Safety', body: 'Every project is escrow-protected. You pay only when satisfied.' },
  { icon: '🌱', title: 'Local roots', body: "We're proud to support local creative talent and local businesses." },
  { icon: '⚡', title: 'Move fast', body: "We don't believe in slow agencies. Quality and speed together." },
];

// Team roster comes from content/team.ts — see ADR-05 (no fabricated
// members) and ADR-06 (real founder bios from the Execution Kit).

const why = [
  { icon: '🏠', title: 'One roof, three powers', body: 'Software, marketing, and creative — all under one agency. No coordination headaches, no finger-pointing between vendors.' },
  { icon: '💰', title: 'Prices that make sense', body: "We built our pricing for small businesses — not enterprise budgets. Quality work shouldn't require a corporate cheque book." },
  { icon: '🔒', title: 'Escrow protection', body: 'Every marketplace project is escrow-protected. You hold the funds until you approve the deliverable. Zero risk, total control.' },
  { icon: '🌐', title: 'Rooted in Bangladesh', body: 'We understand the local market, local payment systems, and local nuances — so we can help you reach your audience where they are.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .08 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Our Story</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 720 }}>
            We built the agency we <span className="text-indigo">wished existed.</span>
          </h1>
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 560, fontSize: '1.125rem' }}>
            Nimikh started with a simple frustration: great digital services shouldn&apos;t
            only be available to big brands with big budgets. Every business — no matter how
            small — deserves world-class software, effective marketing, and affordable
            creative talent.
          </p>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-64)', alignItems: 'center' }}>
            <div className="fade-up">
              <div className="section-label">
                <span className="section-label-line" />
                <span className="section-label-text">Mission</span>
              </div>
              <h2 className="text-h2 mb-24">Democratising digital growth for every business.</h2>
              <p className="text-body mb-16">
                We believe the digital divide between big corporations and small businesses
                shouldn&apos;t exist. The tools, talent, and strategies that help large brands
                succeed should be accessible to the local shop owner, the growing startup,
                and the ambitious entrepreneur.
              </p>
              <p className="text-body mb-32">
                That&apos;s why we built Nimikh as three things in one: a software studio, a
                marketing agency, and a creative marketplace — all connected, all working
                toward the same goal for you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                <span className="highlight-line">🛠 Build — Custom software and websites that work as hard as you do.</span>
                <span className="highlight-line">📈 Market — Data-driven campaigns that generate real business results.</span>
                <span className="highlight-line">🎨 Create — Connect with talented local artists who won&apos;t break the bank.</span>
              </div>
            </div>

            <div className="fade-up d2">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
                <div className="card" style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-12)' }} aria-hidden="true">🤝</div>
                  <div className="text-h3 mb-8">People first</div>
                  <p className="text-body text-sm">
                    We treat every client relationship as a long-term partnership, not a
                    transaction.
                  </p>
                </div>
                {values.map((v) => (
                  <div key={v.title} className="card">
                    <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-12)' }} aria-hidden="true">{v.icon}</div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{v.title}</div>
                    <p className="text-body text-sm">{v.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">The Team</span>
            </div>
            <h2 className="text-h2">The people behind Nimikh.</h2>
            <p className="text-body mt-16">
              A small, focused team of builders, marketers, and creatives who are obsessed
              with client results.
            </p>
          </div>
          <div className="grid-3">
            {team.map((m, i) => (
              <div
                key={m.name}
                className={`card fade-up${i > 0 ? ` d${i}` : ''}`}
                style={{ textAlign: 'center', opacity: m.hiring ? 0.75 : 1 }}
              >
                <div
                  style={{
                    width: 80, height: 80, borderRadius: '50%', background: m.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 700, color: m.hiring ? 'var(--fg-secondary)' : 'white',
                    margin: '0 auto var(--space-20)',
                    border: m.hiring ? '1px dashed var(--border-subtle)' : 'none',
                  }}
                  aria-hidden="true"
                >
                  {m.initial}
                </div>
                <h3 className="text-h3 mb-4">{m.name}</h3>
                <div style={{ fontSize: '.875rem', color: 'var(--interactive-action)', marginBottom: 'var(--space-12)' }}>
                  {m.role}
                </div>
                <p className="text-body text-sm">{m.bio}</p>
                <div className="chip-group mt-16" style={{ justifyContent: 'center' }}>
                  {m.chips.map((c) => <span key={c} className="chip">{c}</span>)}
                </div>
                {m.hiring ? (
                  <Link href="/contact?intent=hiring" className="btn btn-ghost btn-sm mt-16">Apply →</Link>
                ) : m.founderSlug ? (
                  <Link href={`/founders/${m.founderSlug}`} className="btn btn-ghost btn-sm mt-16">View profile →</Link>
                ) : null}
              </div>
            ))}
          </div>

          <div
            className="card mt-24 fade-up d3"
            style={{
              background: 'linear-gradient(135deg,rgba(94,106,210,.07),var(--surface-base))',
              borderColor: 'rgba(94,106,210,.2)',
              textAlign: 'center',
              padding: 'var(--space-48)',
            }}
          >
            <h3 className="text-h3 mb-12">And a growing network of 240+ verified creators.</h3>
            <p
              className="text-body text-sm mb-24"
              style={{ maxWidth: 480, margin: '0 auto var(--space-24)' }}
            >
              Video editors, graphic designers, photographers, motion artists, and content
              writers ready to work with your brand.
            </p>
            <Link href="/marketplace" className="btn btn-primary">Browse the Marketplace →</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header centered fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span className="section-label-line" />
              <span className="section-label-text">Why Choose Us</span>
            </div>
            <h2 className="text-h2">Different by design.</h2>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-16)' }}>
            {why.map((w, i) => (
              <div
                key={w.title}
                className={`card fade-up${i > 0 ? ` d${i}` : ''}`}
                style={{ display: 'flex', gap: 'var(--space-20)', alignItems: 'flex-start' }}
              >
                <div className="icon-box" style={{ marginBottom: 0, flexShrink: 0 }} aria-hidden="true">{w.icon}</div>
                <div>
                  <h3 className="text-h3 mb-8">{w.title}</h3>
                  <p className="text-body text-sm">{w.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-block fade-up" style={{ padding: 'var(--space-64)' }}>
            <div className="blob-container" style={{ opacity: .5 }} aria-hidden="true">
              <div className="blob blob-1" style={{ opacity: .06 }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="text-h1 mb-16">Ready to work with us?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                Tell us your goal and we&apos;ll figure out the best way to help — no
                pressure, no commitment.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-12)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-primary btn-lg">Get in Touch →</Link>
                <Link href="/case-studies" className="btn btn-ghost btn-lg">See Our Work</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
