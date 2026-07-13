import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Nimikh offers software development, growth marketing, and creative production — three services, one agency, zero compromise.',
  alternates: { canonical: absoluteUrl('/services') },
};

const softwareCards = [
  { icon: '🌐', title: 'Web Design & Dev', body: 'Responsive websites that convert visitors into customers.' },
  { icon: '🛒', title: 'E-Commerce Stores', body: 'Full shopping experiences with payment & inventory.' },
  { icon: '⚙️', title: 'Web Applications', body: 'Dashboards, portals, and SaaS tools built for scale.' },
  { icon: '🔗', title: 'API Integrations', body: 'Connect your tools: bKash, Pathao, CRMs, and more.' },
];

const marketingServices = [
  { label: 'Performance Advertising (Meta / Google / TikTok)' },
  { label: 'Search Engine Optimisation (SEO)' },
  { label: 'Social Media Management & Strategy' },
  { label: 'Email Marketing & Automation' },
];

const creativeCards = [
  { icon: '🎬', title: 'Short-Form Video', body: 'Reels, TikToks, and YouTube Shorts that drive engagement.' },
  { icon: '✨', title: 'Motion Graphics', body: 'Animated ads, logo intros, and product showcases.' },
  { icon: '🎨', title: 'Graphic Design', body: 'Logos, brand kits, banners, and social media assets.' },
  { icon: '📸', title: 'Photography', body: 'Product, lifestyle, and brand photography.' },
];

export default function ServicesPage() {
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
            <span className="section-label-text">Services</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 680 }}>
            Three services. <span className="text-indigo">One team.</span> Unlimited potential.
          </h1>
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 520, fontSize: '1.1rem' }}>
            Software development, growth marketing, and creative production — we&apos;ve
            integrated all three so your brand stays consistent, your campaigns stay
            effective, and your product stays competitive.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-32)', flexWrap: 'wrap' }} className="fade-up d3">
            <a href="#software" className="btn btn-primary">Software Dev</a>
            <a href="#marketing" className="btn btn-ghost">Growth Marketing</a>
            <a href="#creative" className="btn btn-ghost">Creative Studio</a>
          </div>
        </div>
      </section>

      <section className="section" id="software" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-64)', alignItems: 'center' }}>
            <div className="fade-up">
              <div className="section-label">
                <span className="section-label-line" />
                <span className="section-label-text">01 — Software Development</span>
              </div>
              <h2 className="text-h2 mb-16">We build digital products that work — and scale.</h2>
              <p className="text-body mb-24">
                From a pixel-perfect marketing site to a full-featured SaaS platform, our
                engineering team delivers reliable, modern software on time and within
                budget. We use proven tech stacks and follow best practices so your product
                is built to last.
              </p>
              <div className="grid-2" style={{ gap: 'var(--space-16)', marginBottom: 'var(--space-32)' }}>
                {softwareCards.map((c) => (
                  <div key={c.title} className="card" style={{ padding: 'var(--space-16)' }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: 8 }} aria-hidden="true">{c.icon}</div>
                    <div style={{ fontWeight: 590, fontSize: '.9rem', marginBottom: 4 }}>{c.title}</div>
                    <p className="text-body" style={{ fontSize: '.8rem' }}>{c.body}</p>
                  </div>
                ))}
              </div>
              <Link href="/services/software" className="btn btn-primary">Full Software Details →</Link>
            </div>
            <div className="fade-up d2">
              <div className="code-snippet" style={{ fontSize: '.825rem', lineHeight: 1.8 }}>
                <span style={{ color: 'var(--fg-tertiary)' }}># Our typical stack</span><br /><br />
                <span style={{ color: '#9ba5e4' }}>frontend:</span><br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>- Next.js 14 (App Router)</span><br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>- TypeScript + Tailwind CSS</span><br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>- Framer Motion animations</span><br /><br />
                <span style={{ color: '#9ba5e4' }}>backend:</span><br />
                &nbsp;&nbsp;<span style={{ color: '#fbbf24' }}>- Node.js / NestJS / Go</span><br />
                &nbsp;&nbsp;<span style={{ color: '#fbbf24' }}>- PostgreSQL + Redis</span><br />
                &nbsp;&nbsp;<span style={{ color: '#fbbf24' }}>- REST & GraphQL APIs</span><br /><br />
                <span style={{ color: '#9ba5e4' }}>infra:</span><br />
                &nbsp;&nbsp;<span style={{ color: '#f9a8d4' }}>- Vercel / AWS ECS Fargate</span><br />
                &nbsp;&nbsp;<span style={{ color: '#f9a8d4' }}>- Docker containerised</span><br />
                &nbsp;&nbsp;<span style={{ color: '#f9a8d4' }}>- CI/CD with GitHub Actions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="marketing" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-64)', alignItems: 'center' }}>
            <div className="fade-up d1" style={{ order: 2 }}>
              <div className="section-label">
                <span className="section-label-line" />
                <span className="section-label-text">02 — Growth Marketing</span>
              </div>
              <h2 className="text-h2 mb-16">Marketing that moves the needle — not just the metrics.</h2>
              <p className="text-body mb-24">
                We run performance campaigns on Meta, Google, and TikTok anchored to your
                actual business KPIs. No vanity dashboards — just leads, sales, and
                measurable growth. We also optimise your organic presence through SEO and
                content strategy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', marginBottom: 'var(--space-32)' }}>
                {marketingServices.map((m) => (
                  <div
                    key={m.label}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: 'var(--space-16)', background: 'var(--surface-base)',
                      border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <span style={{ fontSize: '.875rem' }}>{m.label}</span>
                    <span className="badge badge-green">Active</span>
                  </div>
                ))}
              </div>
              <Link href="/services/marketing" className="btn btn-primary">Full Marketing Details →</Link>
            </div>
            <div className="fade-up" style={{ order: 1 }}>
              <div style={{ display: 'grid', gap: 'var(--space-16)' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg,rgba(94,106,210,.08),var(--surface-base))' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 'var(--space-8)' }}>
                    Average Client ROI
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: 720, letterSpacing: '-.04em', color: '#4ade80', lineHeight: 1 }}>+340%</div>
                  <p className="text-body text-sm mt-8">Across all active performance campaigns</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
                  <div className="card">
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 'var(--space-8)' }}>Avg. CTR</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-.02em', color: 'var(--white)' }}>6.8%</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>Industry avg: 2.1%</div>
                  </div>
                  <div className="card">
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 'var(--space-8)' }}>Cost / Lead</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-.02em', color: 'var(--white)' }}>৳120</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>Down from ৳450</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="creative" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-64)', alignItems: 'center' }}>
            <div className="fade-up">
              <div className="section-label">
                <span className="section-label-line" />
                <span className="section-label-text">03 — Creative Studio & Marketplace</span>
              </div>
              <h2 className="text-h2 mb-16">Beautiful creative content that fits your budget.</h2>
              <p className="text-body mb-24">
                Our Creative Studio produces in-house content — and our Marketplace
                connects you with 240+ verified local artists for affordable, authentic ad
                creative. Great content shouldn&apos;t cost a fortune.
              </p>
              <div className="grid-2" style={{ gap: 'var(--space-16)', marginBottom: 'var(--space-32)' }}>
                {creativeCards.map((c) => (
                  <div key={c.title} className="card" style={{ padding: 'var(--space-16)' }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: 8 }} aria-hidden="true">{c.icon}</div>
                    <div style={{ fontWeight: 590, fontSize: '.9rem', marginBottom: 4 }}>{c.title}</div>
                    <p className="text-body" style={{ fontSize: '.8rem' }}>{c.body}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
                <Link href="/services/creative" className="btn btn-primary">Creative Studio →</Link>
                <Link href="/marketplace" className="btn btn-ghost">Hire a Creator →</Link>
              </div>
            </div>
            <div className="fade-up d2">
              <div className="card" style={{ padding: 'var(--space-32)', background: 'linear-gradient(135deg,rgba(124,58,237,.08),var(--surface-base))' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">🤝</div>
                <h3 className="text-h3 mb-12">The Marketplace Difference</h3>
                <p className="text-body text-sm mb-20">
                  We built our creator marketplace specifically for small businesses who
                  can&apos;t afford agency rates but still need high-quality content. Local
                  talent, fair prices, and the escrow protection you need to hire with
                  confidence.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                  {[
                    'Vetted & verified creators only',
                    'Escrow payment — pay on approval',
                    'Starting from just ৳3,000',
                    '48-hour turnaround available',
                  ].map((line) => (
                    <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: '.875rem', color: 'var(--fg-secondary)' }}>
                      <span style={{ color: 'var(--interactive-action)', fontWeight: 700 }}>✓</span>
                      {line}
                    </div>
                  ))}
                </div>
                <Link href="/marketplace" className="btn btn-primary mt-24 w-full" style={{ justifyContent: 'center' }}>
                  Browse Creators →
                </Link>
              </div>
            </div>
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
              <h2 className="text-h1 mb-16">Not sure which service you need?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                That&apos;s exactly what we&apos;re here for. Tell us your challenge and
                we&apos;ll recommend the right mix of services.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Talk to Us →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
