'use client';

import { useEffect, useRef } from 'react';

/** Thin progress bar at the top of the viewport — client-only, passive scroll. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : (window.scrollY / max) * 100;
      bar.style.width = `${Math.min(pct, 100)}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={barRef} className="scroll-bar" aria-hidden="true" />;
}
