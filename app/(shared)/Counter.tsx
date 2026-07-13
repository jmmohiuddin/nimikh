'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  to: number;
  suffix?: string;
  duration?: number;
  /** Formatted fallback shown on the server + before the counter fires. */
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Count-up number, revealed on scroll. The `fallback` is what SSR emits
 * and what users with reduced motion / no JS keep seeing — so the number
 * is always readable, not a placeholder "0".
 */
export function Counter({ to, suffix = '', duration = 1800, fallback, className, style }: Props) {
  const [display, setDisplay] = useState(fallback ?? `${to.toLocaleString()}${suffix}`);
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || fired.current) continue;
          fired.current = true;
          io.disconnect();
          const startTs = performance.now();
          const step = (ts: number) => {
            const p = Math.min((ts - startTs) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(`${Math.round(eased * to).toLocaleString()}${suffix}`);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix, duration]);

  return (
    <div ref={ref} className={className} style={style}>
      {display}
    </div>
  );
}
