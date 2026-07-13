'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Applies the .visible class to every .fade-up / .fade-in element as it
 * enters the viewport. globals.css handles the actual transition, and the
 * @media (prefers-reduced-motion: reduce) block there disables the effect
 * for users who opt out — no need to re-check here.
 *
 * Re-runs whenever the route changes (usePathname) so that client-side
 * navigation to a new page correctly observes the new page's elements.
 * A MutationObserver is also used as a safety net for any elements added
 * to the DOM after the initial querySelectorAll (e.g. lazy-loaded sections).
 */
export function ScrollReveal() {
  const pathname = usePathname();

  const observe = useCallback((io: IntersectionObserver) => {
    const els = document.querySelectorAll<HTMLElement>(
      '.fade-up:not(.visible), .fade-in:not(.visible)',
    );
    els.forEach((el) => io.observe(el));
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    // Observe all current elements
    observe(io);

    // Watch for elements added later (e.g. streaming, lazy sections)
    const mo = new MutationObserver(() => observe(io));
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname, observe]);

  return null;
}
