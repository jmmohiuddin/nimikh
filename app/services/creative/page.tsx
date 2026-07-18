import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '../../(shared)/JsonLd';
import { graph, service } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Video Production & Graphic Design Services in Dhaka',
  description:
    'Short-form video, motion graphics, brand identity, and social media design for small businesses in Bangladesh. In-house studio plus 240+ verified creators, from ৳1,500.',
  alternates: { canonical: absoluteUrl('/services/creative') },
};

const serviceSchema = service({
  name: 'Creative Production',
  path: '/services/creative',
  description:
    'Short-form video production, motion graphics, graphic design, brand identity, and photography for small and medium businesses.',
  serviceType: 'Creative Services',
  offerings: [
    'Short-Form Video Production',
    'Motion Graphics',
    'Graphic Design',
    'Brand Identity Design',
    'Social Media Content Design',
    'Product Photography',
  ],
  startingPriceBDT: 1500,
});

const creatorPreview = [
  { name: 'Riya Ahmed', role: 'Video Editor & Content Creator', initial: 'R', bg: 'linear-gradient(135deg,#5e6ad2,#7c3aed)', chips: ['Reels', 'TikTok', 'Hooks'], rate: '৳5,000+', rating: '★ 4.9' },
  { name: 'Sadia Islam', role: 'Motion Graphics Artist', initial: 'S', bg: 'linear-gradient(135deg,#ec4899,#7c3aed)', chips: ['After Effects', 'Logo Anim'], rate: '৳8,000+', rating: '★ 5.0' },
  { name: 'Karim Hassan', role: 'Brand Designer', initial: 'K', bg: 'linear-gradient(135deg,#0ea5e9,#5e6ad2)', chips: ['Logos', 'Brand Kits', 'Social'], rate: '৳3,500+', rating: '★ 4.8' },
];

export default function CreativePage() {
  return (
    <>
      <JsonLd data={graph(serviceSchema)} />
      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .06, background: '#7c3aed' }} />
          <div className="blob blob-2" style={{ opacity: .05, background: '#ec4899' }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Creative Studio</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 680 }}>
            Content that <span className="text-indigo">stops the scroll</span> and starts the sale.
          </h1>
          <p className="text-body mt-24 fade-up d2" style={{ maxWidth: 560, fontSize: '1.1rem' }}>
            Video production, motion graphics, graphic design, and brand identity for small
            businesses in Bangladesh — delivered by our in-house creative studio in Dhaka
            and a marketplace of 240+ verified local artists. Projects from ৳1,500.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-12)', marginTop: 'var(--space-32)', flexWrap: 'wrap' }} className="fade-up d3">
            <Link href="/marketplace" className="btn btn-primary btn-lg">Browse Creators →</Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">Studio Project</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <div className="section-label">
              <span className="section-label-line" />
              <span className="section-label-text">Creative Services</span>
            </div>
            <h2 className="text-h2">Every format. Every platform.</h2>
          </div>
          <div className="bento">
            <div className="bento-item bento-c8 fade-up" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,.08),var(--surface-base))' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">🎬</div>
              <h3 className="text-h3 mb-12">Short-Form Video Production</h3>
              <p className="text-body text-sm mb-20" style={{ maxWidth: 420 }}>
                Reels, TikToks, and YouTube Shorts that drive real engagement. We handle
                scripting, filming (or UGC direction), editing, captions, and music
                licensing. Designed specifically for your target audience and platform
                algorithm.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-12)', maxWidth: 400 }}>
                {[
                  { icon: '📱', label: 'Instagram Reels' },
                  { icon: '🎵', label: 'TikTok Videos' },
                  { icon: '▶️', label: 'YouTube Shorts' },
                ].map((f) => (
                  <div key={f.label} className="card-glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-12)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: 4 }} aria-hidden="true">{f.icon}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-secondary)' }}>{f.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-24)', paddingTop: 'var(--space-20)', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8125rem', color: 'var(--fg-tertiary)' }}>Starting from ৳5,000 / video</span>
                <Link href="/marketplace" className="btn btn-primary btn-sm">Find a Creator →</Link>
              </div>
            </div>

            {[
              { size: 'c4', delay: 'd1', icon: '✨', title: 'Motion Graphics',
                body: 'Animated ads, logo reveals, product demos, and explainer videos. Motion content that makes your brand unforgettable.',
                chips: ['Logo Animation', 'Ad Creatives', 'Explainers', 'Lower Thirds'], from: '৳8,000' },
              { size: 'c4', delay: 'd2', icon: '🎨', title: 'Graphic Design',
                body: 'Brand identities, social media graphics, ad banners, packaging design, and print materials. Consistent visual language across every touchpoint.',
                chips: ['Logos & Branding', 'Social Graphics', 'Ad Banners', 'Packaging'], from: '৳3,000' },
              { size: 'c4', delay: 'd1', icon: '📸', title: 'Photography',
                body: 'Product photography, lifestyle shoots, brand photography, and social content photography by local professionals.',
                chips: ['Product Shots', 'Lifestyle', 'Brand Story'], from: '৳6,000' },
              { size: 'c4', delay: 'd2', icon: '✍️', title: 'Content Writing',
                body: 'Ad copy, website copy, blog articles, captions, and product descriptions — in both Bangla and English.',
                chips: ['Ad Copy', 'Blog Articles', 'Captions', 'Bangla & English'], from: '৳1,500' },
            ].map((b) => (
              <div key={b.title} className={`bento-item bento-${b.size} fade-up ${b.delay}`}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-16)' }} aria-hidden="true">{b.icon}</div>
                <h3 className="text-h3 mb-12">{b.title}</h3>
                <p className="text-body text-sm mb-16">{b.body}</p>
                <div className="chip-group">
                  {b.chips.map((c) => <span key={c} className="chip">{c}</span>)}
                </div>
                <div style={{ marginTop: 'var(--space-20)', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border-hairline)' }}>
                  <span style={{ fontSize: '.8125rem', color: 'var(--fg-tertiary)' }}>From {b.from}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-64)', alignItems: 'center' }}>
            <div className="fade-up">
              <div className="section-label">
                <span className="section-label-line" />
                <span className="section-label-text">Creator Marketplace</span>
              </div>
              <h2 className="text-h2 mb-16">Affordable local talent. No compromise on quality.</h2>
              <p className="text-body mb-24">
                Our creator marketplace was built for small businesses who need great
                content but can&apos;t afford big agency rates. We&apos;ve verified every
                creator on our platform and built an escrow-protected payment system so
                you can hire with complete confidence.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', marginBottom: 'var(--space-32)' }}>
                {[
                  '240+ verified creators — video, design, photo, motion',
                  'Escrow-protected — you pay only when you approve',
                  'Minimum order ৳3,000 — fits any budget',
                  'Physical product? We handle courier shipping to the creator',
                  '48-hour turnaround on most creative briefs',
                ].map((l) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', fontSize: '.9rem', color: 'var(--fg-secondary)' }}>
                    <span style={{ color: 'var(--interactive-action)', fontWeight: 700, fontSize: '1rem' }}>✓</span>
                    {l}
                  </div>
                ))}
              </div>
              <Link href="/marketplace" className="btn btn-primary btn-lg">Browse All Creators →</Link>
            </div>
            <div className="fade-up d2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                {creatorPreview.map((c) => (
                  <div key={c.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {c.initial}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 590, fontSize: '.9rem' }}>{c.name}</div>
                      <div style={{ fontSize: '.8rem', color: 'var(--fg-tertiary)' }}>{c.role}</div>
                      <div className="chip-group mt-8">
                        {c.chips.map((ch) => <span key={ch} className="chip">{ch}</span>)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '.875rem', fontWeight: 640, color: 'var(--interactive-action)' }}>{c.rate}</div>
                      <div style={{ fontSize: '.75rem', color: '#f59e0b' }}>{c.rating}</div>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                  <Link href="/marketplace" className="btn btn-ghost">See 237 more creators →</Link>
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
              <div className="blob blob-1" style={{ opacity: .06, background: '#7c3aed' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="text-h1 mb-16">Let&apos;s create something amazing.</h2>
              <p className="text-body mb-32" style={{ maxWidth: 440, margin: '0 auto var(--space-32)' }}>
                Whether you hire from our marketplace or work with our studio team — great
                creative starts here.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-12)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/marketplace" className="btn btn-primary btn-lg">Browse Creators →</Link>
                <Link href="/contact" className="btn btn-ghost btn-lg">Studio Brief</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
