# Getting Nimikh into Google (and Bing)

The site is built to be indexable — unique titles, canonicals, structured data,
split sitemaps, an LLM-friendly `robots.txt`, and a CI audit that fails if any of
that regresses. But **code alone does not put a site in Google's results.** Google
only lists pages after it (1) knows the site exists, (2) trusts you own it, and
(3) crawls it. Steps 1–2 are a few clicks in Search Console; step 3 takes days to
weeks. Here's the whole flow.

## 1. Deploy to the real domain

Make sure production is live at `https://nimikh.tech` (the canonical URL baked into
every page). If you deploy somewhere else, set `NEXT_PUBLIC_SITE_URL` so canonicals,
sitemaps, and schema all point at the right origin.

## 2. Verify ownership in Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add a **Domain** property for `nimikh.tech` (preferred — covers http/https and
   all subdomains). This needs a DNS TXT record at your domain registrar.
   - *Or* add a **URL-prefix** property for `https://nimikh.tech` and choose the
     **HTML tag** method. Copy the token out of the `<meta name="google-site-verification" content="…">` tag it shows you.
3. If you used the HTML-tag method, set the token as an environment variable in
   Vercel: `GOOGLE_SITE_VERIFICATION=<token>`, then redeploy. The site emits the
   meta tag automatically (see `lib/site.ts` → `verification`).
4. Back in Search Console, click **Verify**.

## 3. Submit the sitemap

In Search Console → **Sitemaps**, submit:

```
https://nimikh.tech/sitemap.xml
```

That's the sitemap index; Google will discover the split sitemaps
(`/sitemap/pages.xml`, `/services.xml`, `/case-studies.xml`, `/founders.xml`) from it.

## 4. Request indexing for key pages (optional, speeds up)

Use the **URL Inspection** tool on the homepage and top service pages, then click
**Request indexing**. This nudges Google to crawl sooner than it would on its own.

## 5. Bing (5 minutes, gets you Bing + partly ChatGPT search)

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters).
2. You can **import from Google Search Console** in one click, or verify separately
   with the HTML-tag method — set `BING_SITE_VERIFICATION=<token>` in Vercel and
   redeploy (emitted as `msvalidate.01`).
3. Submit the same `https://nimikh.tech/sitemap.xml`.

## What to expect

- Verification: instant.
- First crawl: hours to a few days.
- Appearing for your **brand name** ("Nimikh"): usually within a week of the first
  crawl.
- Ranking for **competitive terms** ("web development Dhaka"): months, and depends
  on content depth and backlinks — that's the ongoing content/SEO work in the
  strategy doc (Epics E06–E08), not a one-time setup.

## How to confirm it's working

- `site:nimikh.tech` in Google shows which pages are indexed.
- Search Console → **Pages** shows indexed vs. excluded, with reasons.
- Rich results: paste any URL into the
  [Rich Results Test](https://search.google.com/test/rich-results) — the homepage
  should report Organization + WebSite, `/faq` should report FAQ, service pages
  should report breadcrumbs.

> Note: the `/legal/*` pages are intentionally `noindex` until the copy is reviewed
> by a lawyer. Flip `signedOff: true` per page in `lib/legal.ts` to let them index.
