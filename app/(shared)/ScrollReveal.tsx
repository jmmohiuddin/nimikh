'use client';

import { useEffect } from 'react';

/**
 * Applies the .visible class to every .fade-up / .fade-in element as it
 * enters the viewport. globals.css handles the actual transition, and the
 * @media (prefers-reduced-motion: reduce) block there disables the effect
 * for users who opt out — no need to re-check here.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.fade-up, .fade-in');
    if (els.length === 0) return;

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

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
