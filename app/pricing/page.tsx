import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '../(shared)/Accordion';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent pricing for software development, marketing retainers, and creator marketplace. No hidden fees, no surprises.',
  alternates: { canonical: absoluteUrl('/pricing') },
};

const softwarePlans = [
  {
    tier: 'Basic Website', badge: 'default', description: 'Best for portfolios, service businesses, and small shops getting online.',
    price: '25,000', period: 'one-time', delivery: 'Delivery: 2–3 weeks',
    features: ['Up to 5 pages', 'Mobile-responsive design', 'Contact form + WhatsApp button', 'Google Maps integration', 'Basic SEO setup', '1 month post-launch support'],
    unavailable: ['E-commerce / payments', 'Custom web application'],
    primary: false,
  },
  {
    tier: 'E-Commerce', badge: 'indigo', extraBadge: 'Most Popular', description: 'Full online store with bKash / Nagad payments and courier integration.',
    price: '65,000', period: 'one-time', delivery: 'Delivery: 4–6 weeks',
    features: ['Unlimited products', 'bKash + Nagad checkout', 'Pathao / Steadfast courier integration', 'Order management dashboard', 'Inventory tracking', 'Customer accounts', '3 months priority support', 'SEO + analytics setup'],
    primary: true,
  },
  {
    tier: 'Custom App', badge: 'default', description: 'SaaS tools, dashboards, booking systems, management portals.',
    price: '1,20,000', priceSize: '2rem', period: 'starting from', delivery: 'Delivery: 8–16 weeks',
    features: ['Custom database & backend', 'Role-based access control', 'Real-time features', 'API integrations (any service)', 'Admin dashboard', 'Staging + production environments', '6 months ongoing support'],
    ctaLabel: 'Contact Sales', primary: false,
  },
];

const marketingPlans = [
  {
    tier: 'Social Starter', badge: 'default', price: '15,000', period: '/month',
    features: ['2 social platforms managed', '8 posts per month', 'Community management', 'Monthly report'],
    unavailable: ['Paid ads management', 'SEO services', 'Email marketing'],
    primary: false,
  },
  {
    tier: 'Growth Pack', badge: 'indigo', extraBadge: 'Popular', price: '35,000', period: '/month',
    features: ['3 social platforms managed', '16 posts per month', 'Meta Ads (up to ৳30k spend)', 'SEO (10 keywords)', 'Bi-weekly strategy call', 'Full analytics dashboard'],
    unavailable: ['Google Ads'],
    primary: true,
  },
  {
    tier: 'Full Performance', badge: 'default', price: '55,000', period: '/month',
    features: ['All social platforms', 'Meta + Google Ads', 'Up to ৳1L ad spend managed', 'Full SEO (30+ keywords)', 'Email marketing automation', 'Weekly reports & strategy calls', 'Dedicated account manager'],
    primary: false,
  },
];

const marketplaceTiles = [
  { icon: '✍️', title: 'Copywriting', price: '৳1,500+', per: 'per piece' },
  { icon: '🎨', title: 'Graphic Design', price: '৳3,000+', per: 'per project' },
  { icon: '🎬', title: 'Video Production', price: '৳5,000+', per: 'per video' },
  { icon: '✨', title: 'Motion Graphics', price: '৳8,000+', per: 'per project' },
];

const compareRows: Array<[string, string, string, string]> = [
  ['Custom Design', '✓', '✓', '✓'],
  ['Mobile Responsive', '✓', '✓', '✓'],
  ['Contact Forms', '✓', '✓', '✓'],
  ['Basic SEO Setup', '✓', '✓', '✓'],
  ['Product Catalogue', '—', '✓', '✓'],
  ['bKash / Nagad Payments', '—', '✓', '✓'],
  ['Courier API Integration', '—', '✓', '✓'],
  ['User Authentication', '—', '✓', '✓'],
  ['Admin Dashboard', '—', '✓', '✓'],
  ['Custom Business Logic', '—', '—', '✓'],
  ['API Integrations (any)', '—', '—', '✓'],
  ['Real-time Features', '—', '—', '✓'],
  ['Post-Launch Support', '1 month', '3 months', '6 months'],
];

const pricingFaqs = [
  { question: 'Do you offer payment in instalments?', answer: 'Yes. For projects over ৳50,000 we typically split into 3 payments: 40% upfront, 40% at midpoint review, and 20% on final delivery approval. We’re flexible — just ask.' },
  { question: 'What happens if the scope changes mid-project?', answer: 'We agree on scope before work begins and anything outside that scope is quoted separately as a change request. No nasty surprises — ever.' },
  { question: 'Is there a setup fee for marketing retainers?', answer: 'No setup fees. The monthly retainer covers everything including strategy, creative, execution, and reporting. Ad spend is billed separately directly to your account.' },
  { question: 'How does the marketplace escrow work?', answer: 'When you hire a creator, the agreed amount is held securely in escrow. The creator delivers the work, you review it, and only release payment when you’re satisfied. If you’re not happy after one round of revisions, we help mediate a resolution.' },
  { question: 'Can I get a custom quote?', answer: 'Absolutely. Every business is different and our packages are starting points. Contact us with your specific needs and we’ll build a proposal that fits your budget and goals.' },
];

function isCheck(v: string) { return v === '✓'; }
function isCross(v: string) { return v === '—'; }

export default function PricingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .07 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Pricing</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 640 }}>
            Transparent pricing. <span className="text-indigo">No surprises.</span>
          </h1>
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 480, fontSize: '1.1rem' }}>
            All prices in BDT. Every package includes escrow protection and a satisfaction
            guarantee. Custom quotes available for any budget.
          </p>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">Software Development</span>
            </div>
            <h2 className="text-h2">Project-based pricing. Fixed scope. No scope creep.</h2>
            <p className="text-body mt-16">
              Every project starts with a free discovery call where we agree on scope and
              price before any work begins.
            </p>
          </div>
          <div className="grid-3 fade-up d1">
            {softwarePlans.map((p) => (
              <div key={p.tier} className={`pricing-card${p.primary ? ' featured' : ''}`}>
                {p.extraBadge ? (
                  <div style={{ display: 'flex', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
                    <span className={`badge badge-${p.badge}`}>{p.tier}</span>
                    <span className="badge badge-amber">{p.extraBadge}</span>
                  </div>
                ) : (
                  <div className={`badge badge-${p.badge} mb-16`}>{p.tier}</div>
                )}
                <p style={{ fontSize: '.9rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-16)' }}>{p.description}</p>
                <div className="price-display">
                  <span className="price-currency">৳</span>
                  <span className="price-amount" style={p.priceSize ? { fontSize: p.priceSize } : undefined}>{p.price}</span>
                </div>
                <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-8)' }}>{p.period}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-24)' }}>{p.delivery}</div>
                <ul className="feature-list">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                  {p.unavailable?.map((f) => <li key={f} className="unavailable">{f}</li>)}
                </ul>
                <Link href="/contact" className={`btn ${p.primary ? 'btn-primary' : 'btn-ghost'} w-full`} style={{ justifyContent: 'center' }}>
                  {p.ctaLabel ?? 'Get a Quote'}
                </Link>
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
              <span className="section-label-text">Growth Marketing</span>
            </div>
            <h2 className="text-h2">Monthly retainers. Cancel anytime.</h2>
            <p className="text-body mt-16">
              No lock-in contracts. Month-to-month with full transparency on what we&apos;re
              doing and why.
            </p>
          </div>
          <div className="grid-3 fade-up d1">
            {marketingPlans.map((p) => (
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
                <ul className="feature-list" style={{ marginTop: 'var(--space-24)' }}>
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                  {p.unavailable?.map((f) => <li key={f} className="unavailable">{f}</li>)}
                </ul>
                <Link href="/contact" className={`btn ${p.primary ? 'btn-primary' : 'btn-ghost'} w-full`} style={{ justifyContent: 'center' }}>
                  Get Started
                </Link>
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
              <span className="section-label-text">Creator Marketplace</span>
            </div>
            <h2 className="text-h2">Pay per project. No monthly fee.</h2>
            <p className="text-body mt-16">
              Hire creators directly for any budget. Nimikh takes a 20% platform commission
              — the rest goes directly to the creator.
            </p>
          </div>
          <div className="grid-4 fade-up d1">
            {marketplaceTiles.map((t) => (
              <div key={t.title} className="card text-center" style={{ padding: 'var(--space-24)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-12)' }} aria-hidden="true">{t.icon}</div>
                <div style={{ fontWeight: 640, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 720, letterSpacing: '-.02em', margin: 'var(--space-12) 0', color: 'var(--white)' }}>{t.price}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)' }}>{t.per}</div>
              </div>
            ))}
          </div>
          <div className="card mt-24 fade-up d2" style={{ background: 'rgba(94,106,210,.06)', borderColor: 'rgba(94,106,210,.2)', padding: 'var(--space-24)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-16)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '1.5rem' }} aria-hidden="true">🔒</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 590, marginBottom: 4 }}>Escrow Protection on every order</div>
                <p className="text-body text-sm">
                  All marketplace payments are held in escrow and only released when you
                  approve the final deliverable. Minimum order is ৳3,000.
                </p>
              </div>
              <Link href="/marketplace" className="btn btn-primary">Browse Creators →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header centered fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span className="section-label-line" />
              <span className="section-label-text">Compare Plans</span>
            </div>
            <h2 className="text-h2">Software Development — Feature Comparison</h2>
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="fade-up d1">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 200 }}>Feature</th>
                  <th>Basic Website<br /><span style={{ color: 'var(--fg-primary)', fontSize: '1rem', letterSpacing: '-.01em' }}>৳25,000</span></th>
                  <th>E-Commerce<br /><span style={{ color: 'var(--interactive-action)', fontSize: '1rem', letterSpacing: '-.01em' }}>৳65,000</span></th>
                  <th>Custom App<br /><span style={{ color: 'var(--fg-primary)', fontSize: '1rem', letterSpacing: '-.01em' }}>৳1,20,000+</span></th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([label, a, b, c]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td className={isCheck(a) ? 'check' : isCross(a) ? 'cross' : undefined}>{a}</td>
                    <td className={isCheck(b) ? 'check' : isCross(b) ? 'cross' : undefined}>{b}</td>
                    <td className={isCheck(c) ? 'check' : isCross(c) ? 'cross' : undefined}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">Pricing FAQ</span>
            </div>
            <h2 className="text-h2">Common questions about pricing.</h2>
          </div>
          <div style={{ maxWidth: 720 }} className="fade-up d1">
            <Accordion items={pricingFaqs} />
          </div>
          <div className="mt-32 fade-in d2">
            <Link href="/faq" className="btn btn-ghost">View All FAQs →</Link>
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
              <h2 className="text-h1 mb-16">Ready to get a quote?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                Tell us what you need and we&apos;ll send a detailed proposal within 48
                hours — no obligation.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Request a Proposal →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
