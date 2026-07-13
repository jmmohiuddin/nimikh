import type { Metadata } from 'next';
import Link from 'next/link';
import { Counter } from './(shared)/Counter';
import { absoluteUrl, site } from '@/lib/site';

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: absoluteUrl('/') },
};

const marqueeItems = [
  'Software Development',
  'Performance Marketing',
  'Short-Form Video',
  'E-Commerce Solutions',
  'Creator Marketplace',
  'SEO & Growth',
  'Motion Graphics',
  'Custom Web Apps',
  'Graphic Design',
  'API Integrations',
];

export default function HomePage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-inner">
            <div>
              <div className="hero-badge fade-in">
                <span className="badge badge-indigo">
                  <span className="badge-dot" />
                  Digital Growth Agency — Dhaka, Bangladesh
                </span>
              </div>
              <h1 className="text-display hero-heading fade-up d1">
                Every business<br />
                deserves a <span className="text-indigo">digital powerhouse.</span>
              </h1>
              <p className="hero-sub fade-up d2">
                We build custom software, run high-performance marketing campaigns, and
                connect your brand with talented local creators — all under one roof, at
                prices small businesses can actually afford.
              </p>
              <div className="hero-actions fade-up d3">
                <Link href="/contact" className="btn btn-primary btn-lg">Start a Project →</Link>
                <Link href="/marketplace" className="btn btn-ghost btn-lg">Browse Creators</Link>
              </div>
              <div className="hero-trust fade-in d4">
                <div className="hero-avatars" aria-hidden="true">
                  <div className="hero-avatar" style={{ background: 'linear-gradient(135deg,#5e6ad2,#7c3aed)' }}>R</div>
                  <div className="hero-avatar" style={{ background: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)' }}>T</div>
                  <div className="hero-avatar" style={{ background: 'linear-gradient(135deg,#10b981,#0ea5e9)' }}>S</div>
                  <div className="hero-avatar" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>A</div>
                  <div className="hero-avatar" style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>M</div>
                </div>
                <span className="hero-trust-text">Trusted by 80+ businesses across Bangladesh</span>
              </div>
            </div>

            <div className="hero-visual-wrap fade-in d2">
              <div className="h-card">
                <span className="h-card-icon" aria-hidden="true">📈</span>
                <div className="h-card-label">Campaign ROI</div>
                <div className="h-card-val green">+340%</div>
                <span className="h-card-badge">↑ 12% this month</span>
              </div>
              <div className="h-card">
                <span className="h-card-icon" aria-hidden="true">💻</span>
                <div className="h-card-label">Projects Delivered</div>
                <Counter className="h-card-val indigo" to={152} fallback="152" />
                <div className="h-card-sub">Websites, apps &amp; tools</div>
              </div>
              <div className="h-card">
                <span className="h-card-icon" aria-hidden="true">🎨</span>
                <div className="h-card-label">Verified Creators</div>
                <Counter className="h-card-val" to={240} suffix="+" fallback="240+" />
                <div className="h-card-pill-row">
                  <span className="h-pill" style={{ borderColor: 'rgba(94,106,210,.3)', color: '#9ba5e4' }}>Video</span>
                  <span className="h-pill" style={{ borderColor: 'rgba(52,211,153,.3)', color: '#6ee7b7' }}>Design</span>
                  <span className="h-pill" style={{ borderColor: 'rgba(245,158,11,.3)', color: '#fbbf24' }}>Motion</span>
                </div>
              </div>
              <div className="h-card">
                <span className="h-card-icon" aria-hidden="true">🔒</span>
                <div className="h-card-label">Escrow Protected</div>
                <div
                  className="h-card-val"
                  style={{ fontSize: '1rem', marginTop: 6, color: 'var(--fg-secondary)', fontWeight: 500 }}
                >
                  Pay only when <br />you approve
                </div>
                <div className="h-card-bar" style={{ marginTop: 14 }}>
                  <div className="h-card-bar-fill" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="marquee-wrap">
        <div className="marquee-track" aria-hidden="true">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`${item}-${i}`} className="marquee-item">
              {item} <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="stat-bar fade-up">
            <div>
              <Counter className="stat-number" to={152} fallback="152" />
              <div className="stat-label">Projects delivered</div>
            </div>
            <div className="stat-bar-divider" />
            <div>
              <Counter className="stat-number" to={80} fallback="80" />
              <div className="stat-label">Happy clients</div>
            </div>
            <div className="stat-bar-divider" />
            <div>
              <Counter className="stat-number" to={240} fallback="240" />
              <div className="stat-label">Verified creators</div>
            </div>
            <div className="stat-bar-divider" />
            <div>
              <div className="stat-number">3</div>
              <div className="stat-label">Service pillars</div>
            </div>
            <div className="stat-bar-divider" />
            <div>
              <div className="stat-number">100%</div>
              <div className="stat-label">Escrow protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">What We Do</span>
            </div>
            <h2 className="text-h2">Three pillars. One agency.<br />Everything your brand needs.</h2>
            <p className="text-body mt-16">
              Stop juggling between multiple vendors. Nimikh handles your digital presence
              end-to-end — from the first line of code to the last frame of your ad creative.
            </p>
          </div>

          <div className="bento">
            <div className="bento-item bento-c8 bento-r2 fade-up">
              <div className="service-accent" aria-hidden="true">💻</div>
              <div className="service-tag">Software Development</div>
              <h3 className="text-h3 mb-12">Custom websites, web apps, and digital tools — built to last.</h3>
              <p className="text-body text-sm" style={{ maxWidth: 420 }}>
                From a sleek landing page to a full e-commerce platform, we engineer
                software that looks great, loads fast, and scales with your growth.
              </p>
              <div className="chip-group mt-24">
                {['Next.js', 'React', 'Node.js', 'PostgreSQL', 'E-Commerce', 'API Integrations', 'Mobile-First'].map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
              <div className="code-snippet mt-24" style={{ maxWidth: 400 }}>
                <span style={{ color: 'var(--fg-tertiary)' }}>{'// Your next project'}</span><br />
                <span style={{ color: '#9ba5e4' }}>const</span> <span style={{ color: '#4ade80' }}>project</span> = {'{'}<br />
                &nbsp;&nbsp;<span style={{ color: '#f9a8d4' }}>deadline</span>: <span style={{ color: '#fbbf24' }}>&quot;on time&quot;</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#f9a8d4' }}>quality</span>: <span style={{ color: '#fbbf24' }}>&quot;excellent&quot;</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#f9a8d4' }}>support</span>: <span style={{ color: '#4ade80' }}>true</span><br />
                {'}'}
              </div>
              <Link href="/services/software" className="btn btn-secondary mt-32">
                Explore Software Services →
              </Link>
            </div>

            <div className="bento-item bento-c4 fade-up d1">
              <div className="service-accent" aria-hidden="true">📊</div>
              <div className="service-tag">Growth Marketing</div>
              <h3 className="text-h3 mb-12">Ads, SEO &amp; social media that actually convert.</h3>
              <p className="text-body text-sm">
                Data-driven campaigns on Meta, Google, and TikTok. We don&apos;t just run
                ads — we optimise for real business outcomes.
              </p>
              <div style={{ marginTop: 'var(--space-20)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)' }}>Avg. ROI</span>
                  <span style={{ fontSize: '.75rem', fontWeight: 640, color: '#4ade80' }}>+340%</span>
                </div>
                <div className="h-card-bar">
                  <div className="h-card-bar-fill" style={{ width: '85%', background: 'linear-gradient(90deg,var(--interactive-action),#4ade80)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)' }}>Click Rate</span>
                  <span style={{ fontSize: '.75rem', fontWeight: 640, color: 'var(--interactive-action)' }}>6.8%</span>
                </div>
                <div className="h-card-bar">
                  <div className="h-card-bar-fill" style={{ width: '68%' }} />
                </div>
              </div>
              <Link href="/services/marketing" className="btn btn-ghost btn-sm mt-20">Learn More →</Link>
            </div>

            <div className="bento-item bento-c4 fade-up d2">
              <div className="service-accent" aria-hidden="true">🎬</div>
              <div className="service-tag">Creative Studio</div>
              <h3 className="text-h3 mb-12">Video, design, and motion graphics that stop the scroll.</h3>
              <p className="text-body text-sm">
                Short-form video production, brand identity, social graphics, and motion
                content — crafted by our in-house team and creator network.
              </p>
              <div className="chip-group mt-20">
                {['Reels & TikTok', 'Logo Design', 'Motion Graphics', 'Social Assets'].map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
              <Link href="/services/creative" className="btn btn-ghost btn-sm mt-20">Learn More →</Link>
            </div>

            <div
              className="bento-item bento-c8 fade-up d1"
              style={{ background: 'linear-gradient(135deg,rgba(94,106,210,.08),var(--surface-base))' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-16)' }}>
                <div>
                  <div className="service-tag">Creator Marketplace</div>
                  <h3 className="text-h3 mb-12">Affordable creative talent, right when you need it.</h3>
                  <p className="text-body text-sm" style={{ maxWidth: 420 }}>
                    We bridge the gap between small businesses and local artists. Browse
                    240+ verified creators — video editors, graphic designers,
                    photographers — and hire them directly through our escrow-protected
                    platform.
                  </p>
                </div>
                <Link href="/marketplace" className="btn btn-primary" style={{ flexShrink: 0 }}>
                  Browse Creators →
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-24)', flexWrap: 'wrap' }}>
                {[
                  { name: 'Riya Ahmed', role: 'Video Editor · ★ 4.9', initial: 'R', bg: 'linear-gradient(135deg,#5e6ad2,#7c3aed)' },
                  { name: 'Karim Hassan', role: 'Graphic Designer · ★ 4.8', initial: 'K', bg: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)' },
                  { name: 'Sadia Islam', role: 'Motion Artist · ★ 5.0', initial: 'S', bg: 'linear-gradient(135deg,#10b981,#0ea5e9)' },
                ].map((c) => (
                  <div key={c.name} className="card-glass" style={{ borderRadius: 'var(--radius-lg)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: 700, color: 'white' }}>
                      {c.initial}
                    </div>
                    <div>
                      <div style={{ fontSize: '.8125rem', fontWeight: 590 }}>{c.name}</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--fg-tertiary)' }}>{c.role}</div>
                    </div>
                  </div>
                ))}
                <div className="card-glass" style={{ borderRadius: 'var(--radius-lg)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: .6 }}>
                  <div style={{ fontSize: '.8125rem', fontWeight: 590, color: 'var(--fg-secondary)' }}>
                    +237 more creators →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section
        className="section"
        style={{ borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}
      >
        <div className="container">
          <div className="section-header centered fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span className="section-label-line" />
              <span className="section-label-text">How It Works</span>
            </div>
            <h2 className="text-h2">From idea to live — in three steps.</h2>
            <p className="text-body mt-16">
              No long-winded discovery calls. No confusing proposals. Just a clear path from
              your goal to real results.
            </p>
          </div>
          <div className="steps-row fade-up d1">
            {[
              { n: '1', t: 'Tell us your goal', b: "Fill out a quick brief on our contact page — your budget, timeline, and what you're trying to achieve. No commitment needed." },
              { n: '2', t: 'We match you with the right solution', b: "Our team reviews your brief and proposes a tailored plan — whether that's a software build, a marketing package, or a creator match." },
              { n: '3', t: 'Launch and grow together', b: "We deliver, you approve. Funds are escrow-protected — you only pay when the work meets your expectations. Then we scale together." },
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

      {/* ═══ PRICING PREVIEW ═══ */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">Pricing</span>
            </div>
            <h2 className="text-h2">Transparent pricing. No surprises.</h2>
            <p className="text-body mt-16">
              Every project is unique, but here&apos;s a starting point. All prices in BDT.
              Custom packages available for every budget.
            </p>
          </div>
          <div className="pricing-preview">
            <div className="pricing-card fade-up">
              <div className="badge badge-default mb-16">Starter</div>
              <div style={{ fontSize: '.9rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-8)' }}>
                Perfect for solo entrepreneurs and small shops getting online.
              </div>
              <div className="price-display">
                <span className="price-currency">৳</span>
                <span className="price-amount">25,000</span>
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-24)' }}>starting from, per project</div>
              <ul className="feature-list">
                <li>5-page responsive website</li>
                <li>Mobile-first design</li>
                <li>Contact form integration</li>
                <li>Basic SEO setup</li>
                <li>1 month free support</li>
                <li className="unavailable">E-commerce features</li>
                <li className="unavailable">Custom web application</li>
              </ul>
              <Link href="/contact" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}>Get Started</Link>
            </div>
            <div className="pricing-card featured fade-up d1">
              <div style={{ display: 'flex', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
                <span className="badge badge-indigo">Growth</span>
                <span className="badge badge-amber">Most Popular</span>
              </div>
              <div style={{ fontSize: '.9rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-8)' }}>
                For established businesses ready to scale their digital presence.
              </div>
              <div className="price-display">
                <span className="price-currency">৳</span>
                <span className="price-amount">65,000</span>
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-24)' }}>starting from, per project</div>
              <ul className="feature-list">
                <li>Full e-commerce or web app</li>
                <li>Custom design system</li>
                <li>Payment gateway integration</li>
                <li>Performance marketing setup</li>
                <li>Creator marketplace access</li>
                <li>Advanced SEO &amp; analytics</li>
                <li>3 months priority support</li>
              </ul>
              <Link href="/contact" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Get Started</Link>
            </div>
            <div className="pricing-card fade-up d2">
              <div className="badge badge-default mb-16">Enterprise</div>
              <div style={{ fontSize: '.9rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-8)' }}>
                Tailored solutions for larger organisations with complex needs.
              </div>
              <div className="price-display">
                <span className="price-currency" style={{ fontSize: '1.1rem', color: 'var(--fg-secondary)' }} />
                <span className="price-amount" style={{ fontSize: '2rem' }}>Custom</span>
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-24)' }}>let&apos;s talk about your requirements</div>
              <ul className="feature-list">
                <li>SaaS / custom platform build</li>
                <li>Multi-channel marketing strategy</li>
                <li>Dedicated creator team</li>
                <li>API &amp; system integrations</li>
                <li>Ongoing retainer available</li>
                <li>Dedicated account manager</li>
                <li>SLA with priority support</li>
              </ul>
              <Link href="/contact" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}>Contact Sales</Link>
            </div>
          </div>
          <div className="text-center mt-32 fade-in d3">
            <Link href="/pricing" className="btn btn-ghost">View Full Pricing Breakdown →</Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header centered fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span className="section-label-line" />
              <span className="section-label-text">Client Stories</span>
            </div>
            <h2 className="text-h2">Real results for real businesses.</h2>
          </div>
          <div className="grid-3">
            {[
              {
                quote: "Nimikh built our entire e-commerce store from scratch in just 3 weeks. The quality blew us away — and sales went up 180% in the first month after launch.",
                name: 'Rahim Chowdhury', role: 'Founder, Dhaka Threads',
                initial: 'R', bg: 'linear-gradient(135deg,#5e6ad2,#7c3aed)', delay: '',
              },
              {
                quote: "We needed affordable video content for our Facebook ads. Nimikh matched us with a local creator within 48 hours. The content performed better than anything we'd made before.",
                name: 'Fatima Begum', role: 'Marketing Manager, NutriBoost BD',
                initial: 'F', bg: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)', delay: 'd1',
              },
              {
                quote: "Their Google Ads team took our cost-per-lead from ৳450 down to ৳120. That's not marketing — that's magic. Nimikh is now our long-term growth partner.",
                name: 'Tanvir Ahmed', role: 'CEO, SkyTech Solutions',
                initial: 'T', bg: 'linear-gradient(135deg,#10b981,#0ea5e9)', delay: 'd2',
              },
            ].map((t) => (
              <div key={t.name} className={`testimonial-card fade-up ${t.delay}`.trim()}>
                <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="t-avatar" style={{ background: t.bg }}>{t.initial}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-32 fade-in d3">
            <Link href="/case-studies" className="btn btn-ghost">Read More Case Studies →</Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section">
        <div className="container">
          <div className="cta-block fade-up">
            <div className="blob-container" style={{ opacity: .6 }} aria-hidden="true">
              <div className="blob blob-1" style={{ opacity: .08 }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="badge badge-indigo mb-24" style={{ display: 'inline-flex' }}>Ready to grow?</span>
              <h2 className="text-h1 mb-16">Let&apos;s build something<br />great together.</h2>
              <p className="text-body mb-32" style={{ maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                Whether you need a website, a marketing strategy, or creative content — we
                have the team and the tools to make it happen.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-12)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-primary btn-lg">Start a Project →</Link>
                <Link href="/marketplace" className="btn btn-ghost btn-lg">Browse Creators</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
