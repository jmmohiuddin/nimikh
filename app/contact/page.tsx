import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '../(shared)/Accordion';
import { ContactForm } from '../(shared)/ContactForm';
import { JsonLd } from '../(shared)/JsonLd';
import { faqPage, graph } from '@/lib/schema';
import { absoluteUrl, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Nimikh. Start a project, request a quote, or apply to join our creator marketplace.',
  alternates: { canonical: absoluteUrl('/contact') },
};

const contactFaqs = [
  { question: 'How quickly can you start my project?', answer: "Most projects start within 1–2 weeks of signing off on the proposal. We'll give you a precise start date during the discovery call." },
  { question: 'Do you work with businesses outside Dhaka?', answer: "Absolutely. We're a remote-first agency and work with clients all across Bangladesh — and internationally. All communication is done digitally via WhatsApp, email, and video call." },
  { question: 'How do payments work?', answer: "We accept bKash, Nagad, bank transfer, and Stripe (for international clients). Project payments are split into milestones so you're never paying for work you haven't seen." },
  { question: "What if I'm not happy with the work?", answer: "We offer revisions at every milestone stage and don't consider a project complete until you're satisfied. For marketplace orders, funds are held in escrow and only released on your approval." },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={graph(faqPage(contactFaqs, absoluteUrl('/contact')))} />
      <section className="page-hero" style={{ paddingBottom: 'var(--space-48)' }}>
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" style={{ opacity: .06 }} />
        </div>
        <div className="container page-hero-content">
          <div className="section-label fade-in">
            <span className="section-label-line" />
            <span className="section-label-text">Contact</span>
          </div>
          <h1 className="text-display fade-up d1" style={{ maxWidth: 640 }}>
            Let&apos;s build something <span className="text-indigo">together.</span>
          </h1>
          <p className="text-body mt-16 fade-up d2" style={{ maxWidth: 440, fontSize: '1.05rem' }}>
            Tell us what you need. We respond within 24 hours — and we won&apos;t spam you
            or pass your details to anyone.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, borderTop: '1px solid var(--border-hairline)' }}>
        <div className="container">
          <div className="contact-grid">
            <div className="fade-up">
              <div className="card" style={{ padding: 'var(--space-32)' }}>
                <h2 className="text-h3 mb-8">Send us a message</h2>
                <p className="text-body text-sm mb-24">
                  Fill in the form below and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>

            <div className="fade-up d2">
              <div className="card" style={{ padding: 'var(--space-24)', marginBottom: 'var(--space-16)' }}>
                <h3 className="text-h3 mb-20">Get in touch directly</h3>
                <div className="contact-info-item">
                  <div className="contact-icon" aria-hidden="true">📧</div>
                  <div>
                    <div style={{ fontWeight: 590, fontSize: '.9rem', marginBottom: 4 }}>Email</div>
                    <a href={`mailto:${site.contactEmail}`} style={{ color: 'var(--interactive-action)', fontSize: '.875rem' }}>
                      {site.contactEmail}
                    </a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon" aria-hidden="true">💬</div>
                  <div>
                    <div style={{ fontWeight: 590, fontSize: '.9rem', marginBottom: 4 }}>WhatsApp</div>
                    <a href="https://wa.me/8801XXXXXXXXX" style={{ color: 'var(--interactive-action)', fontSize: '.875rem' }}>
                      +880 1XXX-XXXXXX
                    </a>
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 2 }}>Typically replies within 2 hours</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon" aria-hidden="true">📍</div>
                  <div>
                    <div style={{ fontWeight: 590, fontSize: '.9rem', marginBottom: 4 }}>Location</div>
                    <div style={{ fontSize: '.875rem', color: 'var(--fg-secondary)' }}>Dhaka, Bangladesh</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--fg-tertiary)', marginTop: 2 }}>Remote-first. We work with clients nationwide.</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon" aria-hidden="true">🕐</div>
                  <div>
                    <div style={{ fontWeight: 590, fontSize: '.9rem', marginBottom: 4 }}>Business Hours</div>
                    <div style={{ fontSize: '.875rem', color: 'var(--fg-secondary)' }}>Saturday – Thursday, 9am – 7pm BST</div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 'var(--space-24)', background: 'linear-gradient(135deg,rgba(94,106,210,.08),var(--surface-base))', borderColor: 'rgba(94,106,210,.2)', marginBottom: 'var(--space-16)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,.5)' }} />
                  <span style={{ fontSize: '.875rem', fontWeight: 590 }}>We&apos;re online now</span>
                </div>
                <p className="text-body text-sm">
                  Our typical response time is under 4 hours during business hours. For
                  urgent projects, mention it in your message and we&apos;ll prioritise.
                </p>
              </div>

              <div className="card" style={{ padding: 'var(--space-24)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-12)' }} aria-hidden="true">🎨</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 590, marginBottom: 8 }}>
                  Are you a creative professional?
                </h3>
                <p className="text-body text-sm mb-16">
                  Apply to join our creator marketplace and start earning from projects
                  that match your skills. We&apos;re always looking for talented video
                  editors, designers, photographers, and motion artists.
                </p>
                <Link href="/marketplace#join" className="btn btn-ghost btn-sm">Apply as Creator →</Link>
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
              <span className="section-label-text">Quick Answers</span>
            </div>
            <h2 className="text-h2">Common questions before reaching out.</h2>
          </div>
          <div style={{ maxWidth: 680, margin: '0 auto' }} className="fade-up d1">
            <Accordion items={contactFaqs} />
          </div>
          <div className="text-center mt-32 fade-in d2">
            <Link href="/faq" className="btn btn-ghost">View All FAQs →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
