/**
 * Dependency-free inline-SVG charts. Recharts/Chart.js would add a client
 * bundle and the site's CSP blocks external scripts, so these are small,
 * pure, server-rendered SVGs. Accessible via role/aria-label + a caption.
 */

export type Series = { label: string; a: number; b?: number };

export function BarChart({
  data, height = 180, aLabel = 'Series A', bLabel, format = (n) => String(Math.round(n)),
}: {
  data: Series[];
  height?: number;
  aLabel?: string;
  bLabel?: string;
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...data.flatMap((d) => [d.a, d.b ?? 0]));
  const pad = { top: 12, bottom: 24, left: 8, right: 8 };
  const w = 520;
  const innerH = height - pad.top - pad.bottom;
  const groupW = (w - pad.left - pad.right) / data.length;
  const dual = data.some((d) => d.b !== undefined);
  const barW = dual ? Math.min(16, groupW / 3) : Math.min(28, groupW * 0.5);

  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} role="img"
        aria-label={`Bar chart. ${aLabel}${bLabel ? ` and ${bLabel}` : ''} by ${data.map((d) => d.label).join(', ')}.`}>
        <line x1={pad.left} y1={height - pad.bottom} x2={w - pad.right} y2={height - pad.bottom} className="chart-axis" />
        {data.map((d, i) => {
          const cx = pad.left + groupW * i + groupW / 2;
          const aH = (d.a / max) * innerH;
          const bH = ((d.b ?? 0) / max) * innerH;
          const baseY = height - pad.bottom;
          return (
            <g key={i}>
              {dual ? (
                <>
                  <rect className="chart-bar" x={cx - barW - 2} y={baseY - aH} width={barW} height={Math.max(0, aH)} rx={3}>
                    <title>{`${d.label} — ${aLabel}: ${format(d.a)}`}</title>
                  </rect>
                  <rect className="chart-bar alt" x={cx + 2} y={baseY - bH} width={barW} height={Math.max(0, bH)} rx={3}>
                    <title>{`${d.label} — ${bLabel}: ${format(d.b ?? 0)}`}</title>
                  </rect>
                </>
              ) : (
                <rect className="chart-bar" x={cx - barW / 2} y={baseY - aH} width={barW} height={Math.max(0, aH)} rx={3}>
                  <title>{`${d.label}: ${format(d.a)}`}</title>
                </rect>
              )}
              <text className="chart-label" x={cx} y={height - pad.bottom + 15} textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>
      {(aLabel || bLabel) && dual ? (
        <figcaption style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '.75rem', color: 'var(--fg-tertiary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--interactive-action)' }} />{aLabel}
          </span>
          {bLabel ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#34d399' }} />{bLabel}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** A labelled progress meter (used for conversion rate, pipeline health). */
export function Meter({ value, label, tone = 'indigo' }: { value: number; label?: string; tone?: 'indigo' | 'green' | 'amber' }) {
  const pct = Math.max(0, Math.min(100, value));
  const color = tone === 'green' ? '#34d399' : tone === 'amber' ? '#fbbf24' : 'var(--interactive-action)';
  return (
    <div>
      {label ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', marginBottom: 6, color: 'var(--fg-secondary)' }}>
          <span>{label}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
        </div>
      ) : null}
      <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-base)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}
