'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

type NavProps = {
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

/**
 * Top-of-page navigation. Client-side because it needs:
 *   1. usePathname() for the active-link highlight,
 *   2. scroll-position detection to toggle the .scrolled class,
 *   3. a hamburger toggle on mobile.
 * All three were client behaviors on the pre-Next.js static site (main.js).
 */
export function SiteNav({
  ctaHref = '/contact',
  ctaLabel = 'Get Started',
  secondaryHref = '/marketplace',
  secondaryLabel = 'Browse Creators',
}: NavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open. Reset if the route changes.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Admin has its own sticky bar; don't stack two. Guard placed AFTER all
  // hooks to keep hook order stable across pathname changes.
  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-mark">N</span>
            {site.name}
          </Link>
          <ul className={`nav-links${open ? ' open' : ''}`}>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive(item.href) ? 'active' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <Link href={secondaryHref} className="btn btn-ghost btn-sm btn-nav-hide">
              {secondaryLabel}
            </Link>
            <Link href={ctaHref} className="btn btn-primary btn-sm">
              {ctaLabel}
            </Link>
          </div>
          <button
            type="button"
            className="nav-hamburger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
