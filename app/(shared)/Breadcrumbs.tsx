'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JsonLd } from './JsonLd';
import { deriveBreadcrumbs } from '@/lib/breadcrumbs';
import { breadcrumbList, graph } from '@/lib/schema';

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD (NIM-012).
 * Client component so it can read the current path, but because every
 * route is statically prerendered, usePathname resolves at build time and
 * the correct trail is baked into the static HTML — so crawlers see it
 * without executing JS. Renders nothing on the homepage.
 */
export function Breadcrumbs() {
  const pathname = usePathname();
  if (/^\/(admin|creator|agent|client|login)(\/|$)/.test(pathname)) return null;
  const crumbs = deriveBreadcrumbs(pathname);
  if (crumbs.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <JsonLd data={graph(breadcrumbList(crumbs))} />
      <div className="container">
        <ol className="breadcrumbs-list">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={c.path} className="breadcrumbs-item">
                {isLast ? (
                  <span aria-current="page">{c.name}</span>
                ) : (
                  <>
                    <Link href={c.path}>{c.name}</Link>
                    <span className="breadcrumbs-sep" aria-hidden="true">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
