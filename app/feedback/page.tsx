import type { Metadata } from 'next';
import { FeedbackForm } from '../(shared)/FeedbackForm';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Send feedback',
  description:
    "Tell Nimikh what's working, what isn't, and what would make this site better. Every note reaches the team.",
  alternates: { canonical: absoluteUrl('/feedback') },
  // Utility page with no search demand. Kept crawlable so link equity
  // still flows, but out of the index so it doesn't dilute crawl budget
  // or surface above a commercial page. Audit §5 (T3).
  robots: { index: false, follow: true },
};

export default function FeedbackPage() {
  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 'var(--space-32)' }}>
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: 0.05 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Feedback</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 640, fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}>
            Tell us <span className="text-indigo">what would make this better.</span>
          </h1>
          <p className="text-body mt-16 fade-up d2" style={{ maxWidth: 520, fontSize: '1.05rem' }}>
            A rating, a bug, a missing feature, or a general note — it all lands with the
            team. If you leave an email we can follow up; otherwise it&apos;s anonymous.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-48)', borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="card fade-up" style={{ maxWidth: 640, margin: '0 auto', padding: 'var(--space-32)' }}>
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
}
