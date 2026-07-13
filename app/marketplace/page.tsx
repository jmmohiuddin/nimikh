import type { Metadata } from 'next';
import Link from 'next/link';
import { FilterableGrid } from '../(shared)/FilterableGrid';
import { Counter } from '../(shared)/Counter';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Creator Marketplace',
  description:
    'Browse 240+ verified local creators — video editors, graphic designers, motion artists — and hire them with escrow protection.',
  alternates: { canonical: absoluteUrl('/marketplace') },
};

type Creator = {
  name: string;
  role: string;
  initial: string;
  bg: string;
  chips: string[];
  rate: string;
  rating: string;
  reviews: number;
  emoji: string;
  category: string;
};

const filters = [
  { value: 'all', label: 'All Creators' },
  { value: 'video', label: 'Video Editing' },
  { value: 'design', label: 'Graphic Design' },
  { value: 'motion', label: 'Motion Graphics' },
  { value: 'photo', label: 'Photography' },
  { value: 'copy', label: 'Copywriting' },
];

const creators: Creator[] = [
  { name: 'Riya Ahmed', role: 'Video Editor & Content Creator', initial: 'R', bg: 'linear-gradient(135deg,#5e6ad2,#7c3aed)', chips: ['Reels', 'TikTok', 'Hooks'], rate: 'From ৳5,000', rating: '4.9', reviews: 48, emoji: '🎬', category: 'video' },
  { name: 'Sadia Islam', role: 'Motion Graphics Artist', initial: 'S', bg: 'linear-gradient(135deg,#ec4899,#7c3aed)', chips: ['After Effects', 'Logo Anim'], rate: 'From ৳8,000', rating: '5.0', reviews: 32, emoji: '✨', category: 'motion' },
  { name: 'Karim Hassan', role: 'Brand Designer', initial: 'K', bg: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)', chips: ['Logos', 'Brand Kits', 'Social'], rate: 'From ৳3,500', rating: '4.8', reviews: 61, emoji: '🎨', category: 'design' },
  { name: 'Arif Hossain', role: 'Commercial Photographer', initial: 'A', bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', chips: ['Products', 'Lifestyle', 'Events'], rate: 'From ৳8,000', rating: '4.9', reviews: 27, emoji: '📸', category: 'photo' },
  { name: 'Nusrat Jahan', role: 'UGC Creator & Presenter', initial: 'N', bg: 'linear-gradient(135deg,#10b981,#0ea5e9)', chips: ['UGC Ads', 'Reviews', 'Unboxing'], rate: 'From ৳4,000', rating: '4.7', reviews: 55, emoji: '🎥', category: 'video' },
  { name: 'Tahsin Rahman', role: 'Illustration & Digital Art', initial: 'T', bg: 'linear-gradient(135deg,#7c3aed,#ec4899)', chips: ['Illustration', 'Posters', 'Characters'], rate: 'From ৳4,500', rating: '4.9', reviews: 38, emoji: '🖌️', category: 'design' },
  { name: 'Fatima Akter', role: 'Copywriter & Content Strategist', initial: 'F', bg: 'linear-gradient(135deg,#5e6ad2,#10b981)', chips: ['Ad Copy', 'Bangla', 'Blogs'], rate: 'From ৳1,500', rating: '4.8', reviews: 72, emoji: '✍️', category: 'copy' },
  { name: 'Mehedi Hasan', role: '2D Animator & Motion Artist', initial: 'M', bg: 'linear-gradient(135deg,#ef4444,#f59e0b)', chips: ['Explainers', 'Ads', '2D Anim'], rate: 'From ৳10,000', rating: '4.9', reviews: 19, emoji: '🎞️', category: 'motion' },
];

export default function MarketplacePage() {
  return (
    <>
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .07, background: '#7c3aed' }} />
          <div className="blob blob-2" style={{ opacity: .05 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Creator Marketplace</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 700 }}>
            Affordable creative talent. <span className="text-indigo">Ready to work.</span>
          </h1>
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 520, fontSize: '1.1rem' }}>
            Connect with 240+ verified local artists — video editors, graphic designers,
            photographers, and motion artists. Hire with confidence through our
            escrow-protected platform.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-24)', marginTop: 'var(--space-32)', flexWrap: 'wrap', alignItems: 'center' }} className="fade-up d3">
            <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
              <div>
                <Counter className="stat-number" style={{ fontSize: '2rem' }} to={240} suffix="+" fallback="240+" />
                <div className="stat-label">Verified creators</div>
              </div>
              <div className="stat-bar-divider" />
              <div>
                <div className="stat-number" style={{ fontSize: '2rem' }}>৳3k</div>
                <div className="stat-label">Minimum budget</div>
              </div>
              <div className="stat-bar-divider" />
              <div>
                <div className="stat-number" style={{ fontSize: '2rem' }}>100%</div>
                <div className="stat-label">Escrow safe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-48) 0', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="how-it-works-row fade-up">
            {[
              { n: '1', t: 'Browse & Filter', b: 'Filter by skill, category, budget, and availability.' },
              { n: '2', t: 'Send a Brief', b: 'Describe your project and set a budget. No obligation.' },
              { n: '3', t: 'Escrow Payment', b: 'Funds are held securely until you approve the work.' },
              { n: '4', t: 'Approve & Release', b: 'Happy with the result? Approve and release payment.' },
            ].map((s) => (
              <div key={s.n} style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--interactive-action)', color: 'white', fontWeight: 700, fontSize: '.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.n}
                </div>
                <div>
                  <div style={{ fontWeight: 590, fontSize: '.9rem', marginBottom: 4 }}>{s.t}</div>
                  <p className="text-body" style={{ fontSize: '.8rem' }}>{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-16)', marginBottom: 'var(--space-32)' }} className="fade-up">
            <div>
              <h2 className="text-h2 mb-8">Browse Creators</h2>
              <p className="text-body text-sm">240+ verified professionals ready for your project.</p>
            </div>
            <Link href="/contact?role=creator" className="btn btn-ghost btn-sm">Are you a creator? Join →</Link>
          </div>

          <FilterableGrid
            filters={filters}
            className="creator-grid"
            items={creators.map((c) => ({
              key: c.name,
              category: c.category,
              node: (
                <div className="creator-card">
                  <div className="creator-cover">
                    <div className="creator-cover-gradient" style={{ background: c.bg }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }} aria-hidden="true">
                      {c.emoji}
                    </div>
                  </div>
                  <div className="creator-body">
                    <div className="creator-avatar" style={{ background: c.bg }}>{c.initial}</div>
                    <div className="creator-name">{c.name}</div>
                    <div className="creator-role">{c.role}</div>
                    <div className="chip-group">
                      {c.chips.map((ch) => <span key={ch} className="chip">{ch}</span>)}
                    </div>
                    <div className="creator-footer">
                      <span className="creator-rate">{c.rate}</span>
                      <span className="creator-rating">
                        <span className="star" aria-hidden="true">★</span> {c.rating} ({c.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ),
            }))}
          />

          <div style={{ textAlign: 'center', padding: 'var(--space-48) 0', borderTop: '1px solid var(--border-hairline)', marginTop: 'var(--space-48)' }} className="fade-in d2">
            <p className="text-body text-sm mb-16">
              Showing 8 of 240+ creators. Register as a business to browse the full
              directory and send project briefs.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">Get Full Access →</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header centered fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span className="section-label-line" />
              <span className="section-label-text">Why Nimikh Marketplace</span>
            </div>
            <h2 className="text-h2">Hire local. Pay smart. Get results.</h2>
          </div>
          <div className="grid-3 fade-up d1">
            {[
              { icon: '🔒', title: 'Escrow Protection', body: 'Your money stays in escrow until you approve the final deliverable. Zero risk of getting bad work or losing your budget.' },
              { icon: '✅', title: 'Verified Talent', body: 'Every creator is manually reviewed. We check their portfolio, skills, and communication before they join the marketplace.' },
              { icon: '🚀', title: 'Fast Turnaround', body: 'Most creators deliver within 48–72 hours. Need it faster? Filter by delivery speed to find creators who can meet your deadline.' },
            ].map((c) => (
              <div key={c.title} className="card text-center" style={{ padding: 'var(--space-32)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">{c.icon}</div>
                <h3 className="text-h3 mb-12">{c.title}</h3>
                <p className="text-body text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="join" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-64)', alignItems: 'center' }}>
            <div className="fade-up">
              <div className="section-label">
                <span className="section-label-line" />
                <span className="section-label-text">Are You a Creator?</span>
              </div>
              <h2 className="text-h2 mb-16">Turn your creative skills into a steady income.</h2>
              <p className="text-body mb-24">
                Nimikh is built to support local artists and give them access to businesses
                that need their work. Join our marketplace, set your rates, and start
                earning from projects that match your skills.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', marginBottom: 'var(--space-32)' }}>
                {[
                  "Set your own rates — you're in control",
                  'Instant bKash / Nagad payouts on approval',
                  'Showcase your portfolio to 80+ active businesses',
                  'We handle all client communication and contracts',
                ].map((l) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: '.9rem', color: 'var(--fg-secondary)' }}>
                    <span style={{ color: 'var(--interactive-action)', fontWeight: 700 }}>✓</span>
                    {l}
                  </div>
                ))}
              </div>
              <Link href="/contact?role=creator" className="btn btn-primary btn-lg">Apply as Creator →</Link>
            </div>
            <div className="fade-up d2">
              <div className="card" style={{ padding: 'var(--space-32)', background: 'linear-gradient(135deg,rgba(94,106,210,.08),var(--surface-base))' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">💰</div>
                <h3 className="text-h3 mb-12">Top Creator Earnings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', marginTop: 'var(--space-20)' }}>
                  {[
                    ['Riya Ahmed — Video Editor', '৳45,000/mo'],
                    ['Sadia Islam — Motion Artist', '৳62,000/mo'],
                    ['Karim Hassan — Designer', '৳38,000/mo'],
                  ].map(([who, earn]) => (
                    <div key={who} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-12)', borderBottom: '1px solid var(--border-hairline)' }}>
                      <span style={{ fontSize: '.875rem', color: 'var(--fg-secondary)' }}>{who}</span>
                      <span style={{ fontWeight: 700, color: '#4ade80' }}>{earn}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>
                    Top 10% of creators. Results vary by activity and skill level.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-block fade-up">
            <div className="blob-container" style={{ opacity: .5 }} aria-hidden="true">
              <div className="blob blob-1" style={{ opacity: .07, background: '#7c3aed' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="text-h1 mb-16">Ready to hire your first creator?</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                Register your business, post a brief, and get matched with the right
                creative talent within 24 hours.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">Post a Brief →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
