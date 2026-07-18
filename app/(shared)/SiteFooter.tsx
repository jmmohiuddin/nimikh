'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  footerCompany as company,
  footerConnect as connect,
  footerLegal as legal,
  footerServices as services,
  footerSocial as social,
} from '@/content/footer';
import { site } from '@/lib/site';

/**
 * Site-wide footer. Client component only so it can self-suppress on
 * /admin via usePathname — the payload is trivial (no interactivity),
 * and keeping the root layout static outweighs saving the client cost.
 */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
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
            {legal.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            {social.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener me">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
