import Link from 'next/link';
import { site } from '@/lib/site';

const services = [
  { href: '/services/software', label: 'Software Development' },
  { href: '/services/marketing', label: 'Growth Marketing' },
  { href: '/services/creative', label: 'Creative Studio' },
  { href: '/marketplace', label: 'Creator Marketplace' },
];

const company = [
  { href: '/about', label: 'About Us' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

const connect: { href: string; label: string; external?: boolean }[] = [
  { href: '/contact', label: 'Contact' },
  { href: `mailto:${site.contactEmail}`, label: site.contactEmail, external: true },
  { href: '#', label: 'LinkedIn' },
  { href: '#', label: 'Facebook' },
];

const social = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter / X'];

/**
 * Site-wide footer. Server component — no client interactivity.
 * Structure mirrors the pre-Next.js footer 1:1.
 */
export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-logo" style={{ fontSize: '1.1rem' }}>
              <span className="nav-logo-mark">N</span>
              {site.name}
            </Link>
            <p>
              Your complete digital growth partner — software, marketing, and creative
              talent under one roof. Built for the businesses that build Bangladesh.
            </p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              {connect.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  {l.external ? (
                    <a href={l.href}>{l.label}</a>
                  ) : (
                    <Link href={l.href}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {site.name}. All rights reserved.</span>
          <div className="footer-social">
            {social.map((s) => (
              <a key={s} href="#">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
