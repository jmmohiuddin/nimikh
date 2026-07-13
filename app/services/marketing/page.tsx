import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Growth Marketing',
  description:
    'Performance advertising, SEO, and social media management that drives real business results. Nimikh’s growth marketing team.',
  alternates: { canonical: absoluteUrl('/services/marketing') },
};

const cards = [
  {
    icon: '🎯', title: 'Performance Advertising',
    body: 'We run paid campaigns on Facebook, Instagram, Google Search, Google Display, and TikTok. Every campaign is built around your goal — leads, sales, or brand awareness — and optimised daily for maximum return.',
    rows: [
      { label: 'Meta (Facebook & Instagram)', badge: { text: 'Expert', kind: 'green' as const } },
      { label: 'Google Ads (Search & Display)', badge: { text: 'Expert', kind: 'green' as const } },
      { label: 'TikTok Ads', badge: { text: 'Growing', kind: 'indigo' as const } },
    ],
  },
  {
    icon: '🔍', title: 'Search Engine Optimisation',
    body: 'We help your business rank higher on Google for the searches that matter. Technical SEO, on-page optimisation, content strategy, and local SEO for businesses serving the Bangladeshi market.',
    chips: ['Technical SEO', 'Keyword Research', 'On-Page Optimisation', 'Local SEO', 'Backlink Building', 'Monthly Reporting'],
  },
  {
    icon: '📱', title: 'Social Media Management',
    body: 'We manage your Facebook, Instagram, and LinkedIn presence — from strategy and content calendars to post scheduling, community management, and monthly performance reports.',
    pills: ['📘 Facebook', '📸 Instagram', '💼 LinkedIn', '🎵 TikTok'],
  },
  {
    icon: '📧', title: 'Email Marketing & Automation',
    body: 'Build relationships with your audience and drive repeat purchases through strategic email sequences, newsletter campaigns, and marketing automation flows.',
    chips: ['Welcome Sequences', 'Promotional Campaigns', 'Abandoned Cart', 'Re-engagement', 'Monthly Newsletters'],
  },
];

const packages = [
  {
    tier: 'Starter', badge: 'default', price: '15,000', period: '/month',
    features: [
      'Social media management (2 platforms)',
      '8 posts per month',
      'Basic community management',
      'Monthly performance report',
    ],
    unavailable: ['Paid advertising', 'SEO services'],
    cta: 'Get Started', primary: false,
  },
  {
    tier: 'Growth', badge: 'indigo', extraBadge: 'Popular', price: '35,000', period: '/month',
    features: [
      'Social media (3 platforms)',
      '16 posts per month',
      'Meta Ads management (up to ৳30k spend)',
      'Basic SEO (10 keywords)',
      'Bi-weekly strategy calls',
      'Full analytics dashboard',
    ],
    cta: 'Get Started', primary: true,
  },
  {
    tier: 'Performance', badge: 'default', price: '55,000', period: '/month',
    features: [
      'Full social media management',
      'Meta + Google Ads',
      'Up to ৳1L ad spend managed',
      'Full SEO (30+ keywords)',
      'Email marketing automation',
      'Dedicated account manager',
      'Weekly reports & calls',
    ],
    cta: 'Get Started', primary: false,
  },
];

export default function MarketingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .07 }} />
          <div className="blob blob-2" style={{ opacity: .05 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Growth Marketing</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 700 }}>
            Marketing that earns its <span className="text-indigo">own budget.</span>
          </h1>
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 520, fontSize: '1.1rem' }}>
            We run performance campaigns on Meta, Google, and TikTok — anchored to your
            actual business KPIs. No jargon, no fluff. Just measurable growth.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-32)', flexWrap: 'wrap' }} className="fade-up d3">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a Campaign →</Link>
            <Link href="/case-studies" className="btn btn-ghost btn-lg">See Results</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-48) 0', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="stat-bar fade-in">
            <div><div className="stat-number" style={{ color: '#4ade80' }}>+340%</div><div className="stat-label">Average campaign ROI</div></div>
            <div className="stat-bar-divider" />
            <div><div className="stat-number">6.8%</div><div className="stat-label">Average click-through rate</div></div>
            <div className="stat-bar-divider" />
            <div><div className="stat-number">৳120</div><div className="stat-label">Average cost per lead</div></div>
            <div className="stat-bar-divider" />
            <div><div className="stat-number">50+</div><div className="stat-label">Active campaigns managed</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">What We Offer</span>
            </div>
            <h2 className="text-h2">Every growth channel, expertly managed.</h2>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-16)' }}>
            {cards.map((c, i) => (
              <div key={c.title} className={`card fade-up${i > 0 ? ` d${i}` : ''}`} style={{ padding: 'var(--space-32)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">{c.icon}</div>
                <h3 className="text-h3 mb-12">{c.title}</h3>
                <p className="text-body text-sm mb-20">{c.body}</p>
                {c.rows && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    {c.rows.map((r, ri) => (
                      <div key={r.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.8125rem' }}>
                          <span style={{ color: 'var(--fg-secondary)' }}>{r.label}</span>
                          <span className={`badge badge-${r.badge.kind}`}>{r.badge.text}</span>
                        </div>
                        {ri < c.rows!.length - 1 && <div style={{ height: 1, background: 'var(--border-hairline)', marginTop: 'var(--space-8)' }} />}
                      </div>
                    ))}
                  </div>
                )}
                {c.chips && (
                  <div className="chip-group">
                    {c.chips.map((chip) => <span key={chip} className="chip">{chip}</span>)}
                  </div>
                )}
                {c.pills && (
                  <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap', marginTop: 'var(--space-16)' }}>
                    {c.pills.map((p) => (
                      <div key={p} className="card-glass" style={{ padding: '10px 14px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '.8125rem' }}>
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">Our Approach</span>
            </div>
            <h2 className="text-h2">Data-driven. Creatively powered.</h2>
            <p className="text-body mt-16">
              We don&apos;t just &ldquo;run ads.&rdquo; We understand your customer, craft
              messages that resonate, test everything, and scale what works.
            </p>
          </div>
          <div className="steps-row fade-up d1">
            {[
              { n: '1', t: 'Audit & Strategy', b: 'We audit your current presence, understand your audience, and define clear KPIs for the campaign.' },
              { n: '2', t: 'Launch & Test', b: 'We build creative, launch campaigns, and A/B test copy, audiences, and formats in the first two weeks.' },
              { n: '3', t: 'Optimise & Scale', b: "We cut what doesn't work, double down on what does, and scale your winning campaigns month over month." },
            ].map((s) => (
              <div className="step-item" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3 className="text-h3 mb-12">{s.t}</h3>
                <p className="text-body text-sm">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">Marketing Retainers</span>
            </div>
            <h2 className="text-h2">Monthly packages. No lock-in contracts.</h2>
          </div>
          <div className="grid-3 fade-up d1">
            {packages.map((p) => (
              <div key={p.tier} className={`pricing-card${p.primary ? ' featured' : ''}`}>
                {p.extraBadge ? (
                  <div style={{ display: 'flex', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
                    <span className={`badge badge-${p.badge}`}>{p.tier}</span>
                    <span className="badge badge-amber">{p.extraBadge}</span>
                  </div>
                ) : (
                  <div className={`badge badge-${p.badge} mb-16`}>{p.tier}</div>
                )}
                <div className="price-display">
                  <span className="price-currency">৳</span>
                  <span className="price-amount">{p.price}</span>
                </div>
                <div className="price-period">{p.period}</div>
                <ul className="feature-list">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                  {p.unavailable?.map((f) => <li key={f} className="unavailable">{f}</li>)}
                </ul>
                <Link href="/contact" className={`btn ${p.primary ? 'btn-primary' : 'btn-ghost'} w-full`} style={{ justifyContent: 'center' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-block fade-up">
            <div className="blob-container" style={{ opacity: .5 }} aria-hidden="true">
              <div className="blob blob-1" style={{ opacity: .06 }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="text-h1 mb-16">Ready to grow your business?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                Let&apos;s have a quick call to understand your goals. No commitment required.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Book a Free Audit →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
