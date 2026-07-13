import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../(shared)/JsonLd';
import { getLegalPage, legalPages } from '@/lib/legal';
import { absoluteUrl, site } from '@/lib/site';

type Params = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  return legalPages.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { page } = await params;
  const doc = getLegalPage(page);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.metaDescription,
    alternates: { canonical: absoluteUrl(`/legal/${doc.slug}`) },
    // noindex until a lawyer signs off on the copy (NIM-059 governance).
    robots: doc.signedOff ? undefined : { index: false, follow: true },
  };
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

export default async function LegalPageView({ params }: Params) {
  const { page } = await params;
  const doc = getLegalPage(page);
  if (!doc) notFound();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: doc.title,
          url: absoluteUrl(`/legal/${doc.slug}`),
          description: doc.metaDescription,
          dateModified: doc.lastModified,
          publisher: { '@id': `${site.url}/#organization` },
        }}
      />

      <section className="page-hero" style={{ paddingBottom: 'var(--space-32)' }}>
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: 0.05 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Legal</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 720, fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>
            {doc.title}
          </h1>
          <p className="text-body mt-16 fade-up d2" style={{ fontSize: '.85rem', color: 'var(--fg-tertiary)' }}>
            Last updated {fmtDate(doc.lastModified)}
            {doc.signedOff ? null : ' · Draft, pending legal review'}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-48)', borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }} className="fade-up">
            <p className="text-body mb-32" style={{ fontSize: '1.05rem' }}>{doc.intro}</p>

            {doc.sections.map((s) => (
              <div key={s.heading} style={{ marginBottom: 'var(--space-48)' }}>
                <h2 className="text-h3 mb-16">{s.heading}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                  {s.body.map((p, i) => (
                    <p key={i} className="text-body">{p}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="card" style={{ marginTop: 'var(--space-32)' }}>
              <h2 className="text-h3 mb-16">Change history</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                {doc.changelog.map((c) => (
                  <div
                    key={c.date}
                    style={{ display: 'flex', gap: 'var(--space-16)', fontSize: '.875rem', color: 'var(--fg-secondary)' }}
                  >
                    <span style={{ color: 'var(--fg-tertiary)', flexShrink: 0, minWidth: 120 }}>{fmtDate(c.date)}</span>
                    <span>{c.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
