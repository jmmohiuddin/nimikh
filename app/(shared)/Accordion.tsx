'use client';

import { useId, useState } from 'react';

type Item = { question: string; answer: React.ReactNode };

/**
 * Single-open accordion. On the old site, clicking any trigger closed
 * every other item globally — we scope that behavior to this component so
 * multiple <Accordion>s on one page (pricing FAQ + main FAQ) don't fight.
 */
export function Accordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        const bodyId = `${baseId}-${i}-body`;
        return (
          <div key={item.question} className={`accordion-item${open ? ' open' : ''}`}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              {item.question}
              <span className="accordion-icon" aria-hidden="true">+</span>
            </button>
            <div id={bodyId} className="accordion-body" role="region">
              <div className="accordion-content">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
