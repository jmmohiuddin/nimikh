import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Presentational dashboard primitives — pure, server-renderable, no client
 * JS. Shared by admin, creator and agent pages so every role reads as one
 * consistent design system.
 */

export function PageHead({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="text-h2" style={{ marginBottom: subtitle ? 4 : 0 }}>{title}</h1>
        {subtitle ? <p className="text-body text-sm" style={{ color: 'var(--fg-tertiary)' }}>{subtitle}</p> : null}
      </div>
      {actions ? <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>{actions}</div> : null}
    </div>
  );
}

export type Tile = { label: string; value: ReactNode; sub?: ReactNode; href?: string; icon?: string; accent?: 'default' | 'green' | 'amber' | 'indigo' };

const accentColor: Record<NonNullable<Tile['accent']>, string> = {
  default: 'var(--fg-primary)',
  green: '#6ee7b7',
  amber: '#fbbf24',
  indigo: '#9ba5e4',
};

export function StatTile({ tile }: { tile: Tile }) {
  const inner = (
    <>
      <div className="label">{tile.icon ? <span aria-hidden>{tile.icon}</span> : null}{tile.label}</div>
      <div className="value" style={{ color: accentColor[tile.accent ?? 'default'] }}>{tile.value}</div>
      {tile.sub ? <div className="sub">{tile.sub}</div> : null}
    </>
  );
  if (tile.href) {
    return <Link href={tile.href} className="stat-tile" style={{ display: 'block', textDecoration: 'none' }}>{inner}</Link>;
  }
  return <div className="stat-tile">{inner}</div>;
}

export function StatGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="stat-grid">
      {tiles.map((t, i) => <StatTile key={i} tile={t} />)}
    </div>
  );
}

export function SectionCard({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`}>
      {(title || action) ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)', gap: 'var(--space-12)' }}>
          {title ? <h2 className="text-h3">{title}</h2> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

const badgeClass: Record<string, string> = {
  green: 'badge-green', amber: 'badge-amber', indigo: 'badge-indigo', default: 'badge-default',
};

export function StatusBadge({ label, tone = 'default' }: { label: string; tone?: 'green' | 'amber' | 'indigo' | 'default' }) {
  return <span className={`badge ${badgeClass[tone]}`} style={{ textTransform: 'capitalize' }}>{label}</span>;
}
