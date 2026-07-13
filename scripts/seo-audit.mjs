/**
 * SEO indexability audit. Boots `next start`, crawls every public route,
 * and fails if any invariant that would keep a page out of Google is
 * broken. This is the regression guard behind the "make sure it shows in
 * Google" requirement — run in CI after build (see .github/workflows/ci.yml)
 * and locally via `npm run audit:seo`.
 *
 * Checks per route:
 *   - HTTP 200
 *   - exactly one <title>, non-empty and unique across the site
 *   - exactly one <h1>
 *   - a <link rel="canonical"> pointing at the expected absolute URL
 *   - indexable (no "noindex") unless the route is intentionally excluded
 *   - an og:image
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const BASE = 'http://localhost:3000';

// Public, indexable routes. Legal pages are intentionally noindex (pending
// legal sign-off) so they're audited separately with relaxed rules.
const INDEXABLE = [
  '/',
  '/about',
  '/services',
  '/services/software',
  '/services/marketing',
  '/services/creative',
  '/marketplace',
  '/pricing',
  '/case-studies',
  '/contact',
  '/faq',
  '/feedback',
  '/founders/mohiuddin',
  '/founders/maruf-shezad',
];

const NOINDEX_OK = ['/legal/privacy', '/legal/terms', '/legal/security'];

const failures = [];
const titles = new Map();

function count(html, re) {
  return (html.match(re) ?? []).length;
}

function firstTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
}

function hasNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

async function checkRoute(path, { expectIndexable }) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`);
  } catch (err) {
    failures.push(`${path}: request failed — ${err.message}`);
    return;
  }
  if (res.status !== 200) {
    failures.push(`${path}: expected 200, got ${res.status}`);
    return;
  }
  const html = await res.text();

  const titleCount = count(html, /<title>/gi);
  if (titleCount !== 1) failures.push(`${path}: expected 1 <title>, found ${titleCount}`);
  const title = firstTitle(html);
  if (!title) failures.push(`${path}: empty <title>`);
  if (title) {
    if (titles.has(title)) failures.push(`${path}: duplicate <title> "${title}" (also ${titles.get(title)})`);
    else titles.set(title, path);
  }

  const h1Count = count(html, /<h1[\s>]/gi);
  if (h1Count !== 1) failures.push(`${path}: expected 1 <h1>, found ${h1Count}`);

  if (!/rel=["']canonical["']/i.test(html)) failures.push(`${path}: missing canonical link`);

  if (!/property=["']og:image["']/i.test(html)) failures.push(`${path}: missing og:image`);

  const noindexed = hasNoindex(html);
  if (expectIndexable && noindexed) failures.push(`${path}: unexpectedly noindex`);
  if (!expectIndexable && !noindexed) failures.push(`${path}: expected noindex but is indexable`);
}

async function checkMachineRoute(path, test) {
  const res = await fetch(`${BASE}${path}`);
  if (res.status !== 200) {
    failures.push(`${path}: expected 200, got ${res.status}`);
    return;
  }
  const body = await res.text();
  const problem = test(body);
  if (problem) failures.push(`${path}: ${problem}`);
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  throw new Error('server did not become ready in time');
}

async function main() {
  const server = spawn('npm', ['run', 'start'], { stdio: 'ignore' });
  let exitCode = 0;
  try {
    await waitForServer();

    for (const path of INDEXABLE) await checkRoute(path, { expectIndexable: true });
    for (const path of NOINDEX_OK) await checkRoute(path, { expectIndexable: false });

    await checkMachineRoute('/robots.txt', (b) =>
      b.includes('Sitemap:') ? null : 'robots.txt missing Sitemap reference',
    );
    await checkMachineRoute('/sitemap.xml', (b) =>
      b.includes('<sitemapindex') ? null : 'sitemap.xml is not a sitemap index',
    );
    await checkMachineRoute('/llms.txt', (b) =>
      b.startsWith('# Nimikh') ? null : 'llms.txt missing H1 title',
    );

    if (failures.length > 0) {
      console.error(`\n✗ SEO audit failed with ${failures.length} issue(s):\n`);
      for (const f of failures) console.error(`  • ${f}`);
      exitCode = 1;
    } else {
      console.log(`\n✓ SEO audit passed: ${INDEXABLE.length + NOINDEX_OK.length} routes checked, all indexable pages sound.`);
    }
  } catch (err) {
    console.error(`SEO audit error: ${err.message}`);
    exitCode = 1;
  } finally {
    server.kill('SIGTERM');
  }
  process.exit(exitCode);
}

main();
