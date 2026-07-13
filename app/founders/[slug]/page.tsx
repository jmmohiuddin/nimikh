import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../(shared)/JsonLd';
import { founders, getFounder } from '@/lib/founders';
import { graph, person } from '@/lib/schema';
import { absoluteUrl, site } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return founders.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const f = getFounder(slug);
  if (!f) return {};
  return {
    title: `${f.name} — ${f.jobTitle}`,
    description: `${f.name} is ${f.jobTitle} at ${site.name}. ${f.bio}`,
    alternates: { canonical: absoluteUrl(`/founders/${f.slug}`) },
  };
}

export default async function FounderPage({ params }: Params) {
  const { slug } = await params;
  const f = getFounder(slug);
  if (!f) notFound();

  return (
    <>
      <JsonLd
        data={graph(
          person({
            name: f.name,
            slug: f.slug,
            jobTitle: f.jobTitle,
            bio: f.bio,
            knowsAbout: f.knowsAbout,
            sameAs: f.sameAs,
          }),
        )}
      />

      <section className="page-hero">
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: 0.06 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Founder</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-24)', alignItems: 'center', flexWrap: 'wrap', marginTop: 'var(--space-16)' }} className="fade-up d1">
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: f.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {f.initial}
            </div>
            <div>
              <h1 className="text-display" style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>{f.name}</h1>
              <div style={{ fontSize: '1.05rem', color: 'var(--interactive-action)', marginTop: 'var(--space-8)' }}>
                {f.jobTitle}, {site.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-48)', borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div style={{ maxWidth: 720 }} className="fade-up">
            <p className="text-body mb-32" style={{ fontSize: '1.1rem' }}>{f.bio}</p>

            <h2 className="text-h3 mb-16">Focus areas</h2>
            <div className="chip-group mb-32">
              {f.focus.map((c) => <span key={c} className="chip">{c}</span>)}
            </div>

            <h2 className="text-h3 mb-16">Areas of expertise</h2>
            <div className="chip-group mb-32">
              {f.knowsAbout.map((c) => <span key={c} className="chip">{c}</span>)}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap', marginTop: 'var(--space-16)' }}>
              <Link href="/about" className="btn btn-ghost">← Back to About</Link>
              <Link href="/contact" className="btn btn-primary">Work with us →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
