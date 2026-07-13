'use client';

import { useState } from 'react';

type Filter = { value: string; label: string };
type Cell = { key: string; category: string; node: React.ReactNode };

type Props = {
  filters: Filter[];
  /**
   * Pre-rendered cells. The server component renders each item once,
   * hands us the JSX, and we handle only the filter interaction — we
   * cannot receive a render callback across the server/client boundary.
   */
  items: Cell[];
  className?: string;
  emptyMessage?: string;
};

/**
 * Filter tabs + a grid it filters. On the old site, filtering worked
 * by toggling display:none on the DOM; here we filter the source list
 * so React actually mounts/unmounts nodes, which lets us keep the
 * server-rendered content typed and avoids an a11y gotcha (hidden nodes
 * still receive focus with display:none).
 */
export function FilterableGrid({ filters, items, className, emptyMessage = 'No matches for this filter.' }: Props) {
  const [active, setActive] = useState(filters[0]?.value ?? 'all');
  const visible = active === 'all' ? items : items.filter((it) => it.category === active);

  return (
    <>
      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`filter-tab${active === f.value ? ' active' : ''}`}
            aria-pressed={active === f.value}
            onClick={() => setActive(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="text-body text-sm">{emptyMessage}</p>
      ) : (
        <div className={className}>
          {visible.map((it) => (
            <div key={it.key}>{it.node}</div>
          ))}
        </div>
      )}
    </>
  );
}
