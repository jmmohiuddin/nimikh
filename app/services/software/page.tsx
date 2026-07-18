import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../(shared)/JsonLd';
import { graph, service } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

/**
 * Title targets the head commercial query ("custom software development
 * company" + Bangladesh) rather than labelling the page. Description
 * front-loads the system types SMBs actually search for — CRM, ERP, POS,
 * inventory — which appeared nowhere on the site before. See
 * docs/seo/01-technical-and-content-audit.md §4 and §6.
 */
export const metadata: Metadata = {
  title: 'Custom Software Development Company in Bangladesh',
  description:
    'Affordable custom software for small and medium businesses — CRM, ERP, POS, inventory, HR and payroll systems, and business automation. Built in Dhaka from ৳25,000, with bKash, Nagad and courier integrations.',
  alternates: { canonical: absoluteUrl('/services/software') },
};

const serviceSchema = service({
  name: 'Custom Software Development',
  path: '/services/software',
  description:
    'Custom business software for small and medium businesses: CRM, ERP, POS, inventory management, HR and payroll, customer portals, dashboards, and workflow automation.',
  serviceType: 'Custom Software Development',
  offerings: [
    'Custom CRM Development',
    'ERP System Development',
    'POS Software Development',
    'Inventory Management Software',
    'HR and Payroll Software',
    'Business Process Automation',
    'Custom Web Application Development',
    'E-Commerce Development',
    'Mobile App Development',
    'API Integration',
  ],
  startingPriceBDT: 25000,
});

const process = [
  { n: '1', t: 'Discovery Call', b: '30-minute call to understand your goals, timeline, and budget.' },
  { n: '2', t: 'Proposal & Design', b: 'We send a clear proposal with scope, cost, and timeline. Then design mockups for your approval.' },
  { n: '3', t: 'Development', b: 'We build in sprints with regular updates. You get access to a staging environment to review progress.' },
  { n: '4', t: 'Launch & Support', b: 'We deploy to production, train your team, and provide post-launch support so everything runs smoothly.' },
];

const stack = [
  { icon: '⚛️', name: 'React / Next.js', role: 'Frontend' },
  { icon: '🟢', name: 'Node.js / Go', role: 'Backend' },
  { icon: '🐘', name: 'PostgreSQL', role: 'Database' },
  { icon: '☁️', name: 'AWS / Vercel', role: 'Hosting' },
];

export default function SoftwarePage() {
  return (
    <>
      <JsonLd data={graph(serviceSchema)} />
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .07 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Software Development</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 700 }}>
            We engineer software your <span className="text-indigo">business runs on.</span>
          </h1>
          {/* Keyword-bearing lede (SEO §6): the H1 keeps doing the persuading,
              this paragraph carries the terms buyers actually search — CRM, ERP,
              POS, inventory, payroll, automation — none of which appeared
              anywhere on the site before. Written for humans first. */}
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 560, fontSize: '1.1rem' }}>
            Nimikh is a custom software development company in Dhaka, Bangladesh, building
            the systems small and medium businesses actually run on — CRM, ERP, POS,
            inventory management, HR and payroll, customer portals, and workflow
            automation. Fixed scope, fixed price, from ৳25,000.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-32)', flexWrap: 'wrap' }} className="fade-up d3">
            <Link href="/contact" className="btn btn-primary btn-lg">Start a Project →</Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">View Pricing</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">What We Build</span>
            </div>
            <h2 className="text-h2">Every type of digital product — done right.</h2>
          </div>
          <div className="bento">
            <div className="bento-item bento-c6 fade-up" style={{ background: 'linear-gradient(135deg,rgba(94,106,210,.07),var(--surface-base))' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">🌐</div>
              <h3 className="text-h3 mb-12">Business Websites</h3>
              <p className="text-body text-sm mb-20">
                Professional, responsive websites that make a great first impression and
                convert visitors. Portfolio sites, corporate pages, landing pages — built
                to rank on Google and load in under 2 seconds.
              </p>
              <div className="chip-group">
                {['Responsive Design', 'SEO-Ready', 'Fast Loading', 'Contact Forms'].map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-24)', paddingTop: 'var(--space-20)', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8125rem', color: 'var(--fg-tertiary)' }}>Starting from</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>৳25,000</span>
              </div>
            </div>

            <div className="bento-item bento-c6 fade-up d1" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,.05),var(--surface-base))' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">🛒</div>
              <h3 className="text-h3 mb-12">E-Commerce Stores</h3>
              <p className="text-body text-sm mb-20">
                Full online stores with product management, shopping cart, and payment
                integration. We integrate with bKash, Nagad, Stripe, and local courier
                APIs (Pathao, Steadfast, RedX) for a seamless order flow.
              </p>
              <div className="chip-group">
                {['bKash / Nagad', 'Courier Integration', 'Inventory Mgmt', 'Order Tracking'].map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-24)', paddingTop: 'var(--space-20)', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8125rem', color: 'var(--fg-tertiary)' }}>Starting from</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>৳65,000</span>
              </div>
            </div>

            <div className="bento-item bento-c8 bento-r2 fade-up d1">
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">⚙️</div>
              <h3 className="text-h3 mb-12">Custom Web Applications</h3>
              <p className="text-body text-sm mb-20" style={{ maxWidth: 420 }}>
                Dashboards, management portals, booking systems, SaaS tools — if you can
                describe it, we can build it. We architect systems that scale from your
                first 100 users to your first 100,000.
              </p>
              <div className="code-snippet mt-24" style={{ maxWidth: 420 }}>
                <span style={{ color: 'var(--fg-tertiary)' }}>{'// Example: Restaurant Management System'}</span><br />
                <span style={{ color: '#9ba5e4' }}>features</span>: [<br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>&quot;Table reservation system&quot;</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>&quot;Digital menu with QR codes&quot;</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>&quot;Kitchen order display&quot;</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>&quot;Real-time analytics dashboard&quot;</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#4ade80' }}>&quot;Customer loyalty program&quot;</span><br />
                ]
              </div>
              <div className="chip-group mt-24">
                {['User Auth', 'Roles & Permissions', 'Real-time Updates', 'Mobile-Friendly', 'API-First', 'Data Exports'].map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-32)', paddingTop: 'var(--space-20)', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8125rem', color: 'var(--fg-tertiary)' }}>Starting from</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>৳1,20,000</span>
              </div>
            </div>

            <div className="bento-item bento-c4 fade-up d2">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">🔗</div>
              <h3 className="text-h3 mb-12">API Integrations</h3>
              <p className="text-body text-sm">
                Connect your systems — payment gateways, courier APIs, CRMs, WhatsApp
                notifications, and more.
              </p>
              <div className="chip-group mt-16">
                {['bKash', 'Pathao', 'Nagad', 'WhatsApp', 'Stripe'].map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header centered fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span className="section-label-line" />
              <span className="section-label-text">Our Process</span>
            </div>
            <h2 className="text-h2">How we take a project from idea to live.</h2>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--space-16)', maxWidth: 800, margin: '0 auto' }}
            className="fade-up d1"
          >
            {process.map((p) => (
              <div key={p.n} className="card" style={{ display: 'flex', gap: 'var(--space-16)', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--interactive-action)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.9rem', color: 'white', flexShrink: 0 }}>
                  {p.n}
                </div>
                <div>
                  <div style={{ fontWeight: 590, marginBottom: 6 }}>{p.t}</div>
                  <p className="text-body text-sm">{p.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header centered fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span className="section-label-line" />
              <span className="section-label-text">Technology</span>
            </div>
            <h2 className="text-h2">Modern tech. Proven results.</h2>
            <p className="text-body mt-16">
              We choose technologies based on your project&apos;s needs — not trends. Fast,
              reliable, and maintainable.
            </p>
          </div>
          <div className="grid-4 fade-up d1">
            {stack.map((s) => (
              <div key={s.name} className="card text-center" style={{ padding: 'var(--space-20)' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: 8 }} aria-hidden="true">{s.icon}</div>
                <div style={{ fontWeight: 590, fontSize: '.875rem' }}>{s.name}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 4 }}>{s.role}</div>
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
              <h2 className="text-h1 mb-16">Ready to build something?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                Tell us what you need. We&apos;ll send a proposal within 48 hours.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Start a Project →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
