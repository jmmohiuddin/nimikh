import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: '70vh' }}>
      <div className="blob-container" aria-hidden="true">
        <div className="blob blob-1" style={{ opacity: .05 }} />
      </div>
      <div className="container page-hero-content">
        <div className="section-label">
          <span className="section-label-line" />
          <span className="section-label-text">404</span>
        </div>
        <h1 className="text-display" style={{ maxWidth: 640 }}>
          We can&apos;t find <span className="text-indigo">that page.</span>
        </h1>
        <p className="text-body mt-24" style={{ maxWidth: 480, fontSize: '1.05rem' }}>
          The link might be old or the page may have moved. Try one of these instead:
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap', marginTop: 'var(--space-32)' }}>
          {suggestions.map((s) => (
            <Link key={s.href} href={s.href} className="btn btn-ghost">
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
