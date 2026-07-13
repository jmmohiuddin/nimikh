import type { Metadata } from 'next';
import Link from 'next/link';
import { Counter } from '../(shared)/Counter';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Real results for real businesses. See how Nimikh helped clients grow through software, marketing, and creative content.',
  alternates: { canonical: absoluteUrl('/case-studies') },
};

const cases = [
  {
    emoji: '🍕', bg: 'linear-gradient(135deg,rgba(16,185,129,.2),var(--surface-overlay))',
    tag: 'Software', title: 'Spice Route Restaurant',
    body: 'Built a full restaurant management system — digital menu with QR codes, table reservations, kitchen order display, and a loyalty program for repeat customers.',
    metrics: [{ v: '40%', l: 'Faster order processing' }, { v: '2x', l: 'Repeat customer rate' }],
  },
  {
    emoji: '💊', bg: 'linear-gradient(135deg,rgba(245,158,11,.15),var(--surface-overlay))',
    tag: 'Marketing', title: 'NutriBoost BD',
    body: 'Managed their full performance marketing including Meta Ads and UGC creator videos. Took cost-per-purchase from ৳380 down to ৳95 in 8 weeks.',
    metrics: [{ v: '75%', l: 'Reduction in CPP' }, { v: '6.2x', l: 'Return on ad spend' }],
  },
  {
    emoji: '💻', bg: 'linear-gradient(135deg,rgba(94,106,210,.2),var(--surface-overlay))',
    tag: 'Software', title: 'SkyTech Solutions',
    body: 'Built a SaaS dashboard for their B2B clients to manage IT infrastructure tickets, reports, and billing — replacing their spreadsheet-based workflow entirely.',
    metrics: [{ v: '85%', l: 'Time saved on admin' }, { v: '12', l: 'New clients onboarded' }],
  },
  {
    emoji: '👗', bg: 'linear-gradient(135deg,rgba(236,72,153,.15),var(--surface-overlay))',
    tag: 'Creative', title: 'Anika Boutique',
    body: 'Connected them with 4 local fashion creators from our marketplace to produce Instagram Reels for their Eid collection. Campaign reached 2.4M people organically.',
    metrics: [{ v: '2.4M', l: 'Organic reach' }, { v: '890%', l: 'Engagement increase' }],
  },
  {
    emoji: '🎓', bg: 'linear-gradient(135deg,rgba(14,165,233,.15),var(--surface-overlay))',
    tag: 'Software + Marketing', title: 'EduPath Academy',
    body: 'Built an online learning platform with course management, video hosting, and bKash subscription payments. Then ran a Google Ads campaign targeting university students.',
    metrics: [{ v: '1,200', l: 'Students in 60 days' }, { v: '৳3.2L', l: 'Monthly recurring revenue' }],
  },
  {
    emoji: '🏠', bg: 'linear-gradient(135deg,rgba(239,68,68,.15),var(--surface-overlay))',
    tag: 'Marketing', title: 'HomeFix BD',
    body: 'Launched their digital marketing from scratch — Facebook Ads, SEO, and social media management. Grew from 0 online leads to 80 qualified leads per month.',
    metrics: [{ v: '80', l: 'Leads per month' }, { v: '৳120', l: 'Cost per lead' }],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .07 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Our Work</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 680 }}>
            Real results for <span className="text-indigo">real businesses.</span>
          </h1>
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 500, fontSize: '1.1rem' }}>
            We let our work speak for itself. Here are a few projects we&apos;re proud of —
            the problem, our approach, and the outcome.
          </p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-48) 0', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="stat-bar fade-in">
            <div>
              <Counter className="stat-number" to={152} fallback="152" />
              <div className="stat-label">Projects delivered</div>
            </div>
            <div className="stat-bar-divider" />
            <div><div className="stat-number" style={{ color: '#4ade80' }}>+340%</div><div className="stat-label">Avg campaign ROI</div></div>
            <div className="stat-bar-divider" />
            <div><div className="stat-number">180%</div><div className="stat-label">Avg sales increase post-launch</div></div>
            <div className="stat-bar-divider" />
            <div><div className="stat-number">97%</div><div className="stat-label">Client satisfaction rate</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Featured Project</span>
          </div>
          <div className="card fade-up" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-2xl)' }}>
            <div style={{ background: 'linear-gradient(135deg,#5e6ad2 0%,#7c3aed 50%,#0ea5e9 100%)', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)' }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">🛒</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>Dhaka Threads</div>
                <div style={{ fontSize: '.875rem', color: 'rgba(255,255,255,.7)', marginTop: 4 }}>E-Commerce + Marketing</div>
              </div>
            </div>
            <div style={{ padding: 'var(--space-48)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-48)', alignItems: 'start' }} className="grid-2">
                <div>
                  <span className="badge badge-indigo mb-16">Software + Marketing</span>
                  <h2 className="text-h2 mb-16">From zero to ৳8L/month in online sales — in 90 days.</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
                    {[
                      { h: 'The Problem', b: 'Dhaka Threads was a popular brick-and-mortar clothing store but had no online presence. They were losing customers to competitors who were selling on Facebook and through e-commerce stores.' },
                      { h: 'Our Approach', b: 'We built a full e-commerce store with bKash checkout and Pathao courier integration in 5 weeks. Simultaneously, we launched a Meta Ads campaign and worked with 3 creators from our marketplace to produce video content showcasing their clothing line.' },
                      { h: 'The Result', b: 'Within 90 days of launch, Dhaka Threads was generating ৳8L per month through the online store — exceeding their physical store revenue. The Meta Ads campaign delivered a 420% ROAS.' },
                    ].map((s) => (
                      <div key={s.h}>
                        <div style={{ fontSize: '.75rem', fontWeight: 640, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-8)' }}>{s.h}</div>
                        <p className="text-body text-sm">{s.b}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
                    {[
                      { v: '৳8L', color: '#4ade80', l: 'Monthly revenue at Day 90' },
                      { v: '420%', color: 'var(--interactive-action)', l: 'Return on ad spend' },
                      { v: '5 wks', color: 'var(--white)', l: 'Store development time' },
                      { v: '180%', color: '#4ade80', l: 'Sales increase vs target' },
                    ].map((m) => (
                      <div key={m.l} className="card" style={{ textAlign: 'center', padding: 'var(--space-24)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 720, letterSpacing: '-.03em', color: m.color, lineHeight: 1 }}>{m.v}</div>
                        <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 6 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="testimonial-card mt-16">
                    <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
                    <p className="testimonial-quote" style={{ fontSize: '.9rem' }}>
                      &ldquo;Nimikh built our store, ran our ads, and even found us the creators
                      for our videos. They&apos;re not just an agency — they&apos;re our
                      digital team.&rdquo;
                    </p>
                    <div className="testimonial-author">
                      <div className="t-avatar" style={{ background: 'linear-gradient(135deg,#5e6ad2,#7c3aed)' }}>R</div>
                      <div><div className="t-name">Rahim Chowdhury</div><div className="t-role">Founder, Dhaka Threads</div></div>
                    </div>
                  </div>
                </div>
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
              <span className="section-label-text">More Work</span>
            </div>
            <h2 className="text-h2">More projects, more results.</h2>
          </div>
          <div className="grid-3">
            {cases.map((c, i) => (
              <div key={c.title} className={`case-card fade-up${i > 0 ? ` d${i % 3}` : ''}`}>
                <div className="case-image" style={{ background: c.bg }} aria-hidden="true">{c.emoji}</div>
                <div className="case-body">
                  <div style={{ display: 'flex', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
                    <span className="badge badge-default">{c.tag}</span>
                    <span className="badge badge-green">Completed</span>
                  </div>
                  <h3 className="text-h3 mb-8">{c.title}</h3>
                  <p className="text-body text-sm mb-0">{c.body}</p>
                  <div className="case-metrics">
                    {c.metrics.map((m) => (
                      <div key={m.l}>
                        <div className="case-metric-val">{m.v}</div>
                        <div className="case-metric-label">{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <h2 className="text-h1 mb-16">Want results like these?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                Let&apos;s talk about your business goals. We&apos;ll tell you exactly how
                we&apos;d approach them.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-12)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-primary btn-lg">Start a Project →</Link>
                <Link href="/services" className="btn btn-ghost btn-lg">View Services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
