# SEO Changes Implemented — Batch 1

**Date:** 18 July 2026
**Branch:** `main` (uncommitted — review before pushing)
**Verification:** `tsc --noEmit` clean, `eslint` clean. `next build` could not run in the sandbox (no npm registry access to fetch the linux-arm64 SWC binary) — **run `npm run build` locally before deploying.**

18 files changed, ~230 insertions.

---

## Decisions I made on your behalf

You asked me to decide, so I did. All three are reversible, and all are recorded here so you can overrule any of them.

**1. Positioning: SMB-focused, Bangladesh primary, UAE secondary.**

Adopted your brief (Version C) as canonical, with the marketplace retained. The enterprise/global framing in `Nimikh-Execution-Kit/00-GOLDEN-RECORD.md` — "Where engineering meets visual fluidity", FinTech/BFSI, US/UK/EU — is now superseded and should not be used for directory submissions.

*Reasoning:* the affordable-SMB gap is real and undefended (audit §4). The enterprise position puts you head-to-head with Kaz and Brain Station 23, who have 20 years of authority and hundreds of staff. You would lose that fight and abandon the one you can win.

**2. Creative Studio and the Marketplace stay, but as supporting services.**

You didn't mention either in your brief, but the marketplace has 13 internal links, sits in your primary nav, and is the only genuinely differentiated thing on the site. I kept both and optimised them for their own search demand rather than deleting them. Software and marketing are now the two pillars carrying the commercial terms.

**3. UAE added to schema `areaServed`, but no UAE pages yet.**

You confirmed UAE is a market. I added `AE` to the `Organization`, `LocalBusiness`, `ProfessionalService`, and all `Service` nodes, and worked the UAE into site-level descriptions. I did **not** build UAE landing pages — that is a content project, and doing it badly (thin duplicated pages with the city name swapped) is actively harmful. Scoped in the roadmap instead.

---

## What I would not do

You said I could make up what was missing. I made the strategy calls above, but I did not invent facts about your business, for a specific and practical reason: fabricated claims in structured data are the kind of thing Google issues manual actions for, and once a site is penalised it is far harder to fix than to have never had the traffic.

Concretely, I have **not** implemented `AggregateRating` or `Review` schema, even though your testimonials are named and attributed and it would be an easy win. You told me the 80 clients and 152 projects are real but "hard to explain" — that is fine for marketing copy, and those numbers stay on the page. It is not sufficient for rating markup, which Google expects to be backed by collectable, auditable reviews.

**The clean way to unlock this:** get 10–15 of your 80 clients to leave real Google Business Profile reviews. That gives you genuine `AggregateRating` eligibility, feeds your local pack ranking, and is worth more than the schema alone. I would put it in the 30-day plan.

Same logic applies to the `+340%` average ROI figure. It stays as marketing copy. It does not go into schema until there is a methodology behind it.

---

## Changes by file

### `lib/site.ts`

| | |
|---|---|
| **Before** | `description: 'Nimikh is your complete digital growth partner — we build custom software, run high-performance marketing, and connect your brand with talented local creators.'` |
| **After** | `description: 'Nimikh builds affordable custom software — CRM, ERP, POS, inventory and business automation systems — and runs performance marketing for small and medium businesses in Bangladesh and the UAE.'` |

*Why:* this string propagates to the homepage meta description, OG tags, Twitter cards, `Organization` schema, `llms.txt`, and `/api/knowledge`. It was the single highest-leverage string on the site and contained none of the terms buyers search. It now names the actual systems (CRM, ERP, POS, inventory) and both markets.

| | |
|---|---|
| **Before** | `socials: [] as string[]` |
| **After** | `socials: ['https://www.facebook.com/nimikh.technologies/']` |

*Why:* `Organization` schema now emits a `sameAs` array. This is how Google links nimikh.com to your Facebook presence — currently the profile that outranks your own site for a brand search. **Add LinkedIn and Instagram here as they go live.**

### `lib/schema.ts`

**Added:** a `service()` builder (+`ServiceInput` type), producing a `Service` node with `serviceType`, `provider` pointing at the shared `ORG_ID`, `areaServed`, `availableChannel`, a `hasOfferCatalog` of concrete deliverables, and real BDT `offers` where a starting price exists.

**Changed:** `areaServed` on all nodes from `['BD','US','GB','SG']` → `['BD','AE','US','GB','SG']`.

*Why:* your three highest-value commercial pages had no service markup at all. The org-level `professionalService()` node declared *that* you offer these services; nothing told Google that `/services/software` **is** the custom software development service. The `OfferCatalog` is where "Custom CRM Development", "ERP System Development", "POS Software Development" etc. now live as machine-readable entities — the exact terms your brief listed and the site never mentioned.

Deliberately omits `aggregateRating` — see above.

### `app/services/software/page.tsx`

| | |
|---|---|
| **Title before** | `Software Development — Nimikh` |
| **Title after** | `Custom Software Development Company in Bangladesh — Nimikh` |
| **Desc before** | "Custom websites, e-commerce stores, and web applications built with modern technology. Nimikh delivers software that scales." |
| **Desc after** | "Affordable custom software for small and medium businesses — CRM, ERP, POS, inventory, HR and payroll systems, and business automation. Built in Dhaka from ৳25,000, with bKash, Nagad and courier integrations." |

Also added: `Service` JSON-LD with a 10-item offer catalogue, and a keyword-bearing lede under the H1.

**Lede before:** "From a landing page to a full SaaS platform — clean code, beautiful UI, and reliable infrastructure. Delivered on time."

**Lede after:** "Nimikh is a custom software development company in Dhaka, Bangladesh, building the systems small and medium businesses actually run on — CRM, ERP, POS, inventory management, HR and payroll, customer portals, and workflow automation. Fixed scope, fixed price, from ৳25,000."

The H1 ("We engineer software your business runs on.") is untouched — it does the persuading, the lede does the ranking. Both audiences served, no keyword stuffing.

### `app/services/marketing/page.tsx`

| | |
|---|---|
| **Title before** | `Growth Marketing — Nimikh` |
| **Title after** | `Affordable Digital Marketing Agency in Bangladesh — Nimikh` |

"Affordable" is both your positioning wedge and a genuine search modifier in this market. Added `Service` schema (8 offerings) and a lede naming Facebook Ads, Google Ads, SEO, and lead generation explicitly.

### `app/services/creative/page.tsx`

| | |
|---|---|
| **Title before** | `Creative Studio — Nimikh` |
| **Title after** | `Video Production & Graphic Design Services in Dhaka — Nimikh` |

"Creative Studio" is an internal label nobody searches. Added `Service` schema (6 offerings) and a lede naming the actual service terms.

### Remaining metadata rewrites

| Page | Before | After |
|---|---|---|
| `/` | `Nimikh — Build. Market. Create.` | `Nimikh — Affordable Software Development & Digital Marketing in Bangladesh` |
| `/services` | `Services` | `Software Development & Digital Marketing Services` |
| `/pricing` | `Pricing` | `Software Development & Marketing Cost in Bangladesh` |
| `/about` | `About` | `About Us — Software & Marketing Agency in Dhaka` |
| `/contact` | `Contact` | `Contact Us — Get a Free Software or Marketing Quote` |
| `/faq` | `FAQ` | `Frequently Asked Questions About Our Services` |
| `/case-studies` | `Case Studies` | `Client Case Studies & Results` |
| `/marketplace` | `Creator Marketplace` | `Hire Freelance Video Editors & Designers in Bangladesh` |

Note on `/pricing`: "custom software development cost in Bangladesh" is a query Bdtask, Dcastalia, and Rexoit all publish dedicated articles for. You already have real BDT prices on the page — more concrete than anything they publish. The title now competes for it.

Note on `/about` and `/contact`: I initially wrote "Contact Nimikh —…" and "About Nimikh —…", then caught that the root layout's `%s — Nimikh` template applies to nested segments, which would have rendered the brand twice. Corrected to "Contact Us" / "About Us". The homepage is exempt because Next.js metadata templates apply to nested segments only, not the same level — verified against the live site's current title.

### `app/robots.ts`

| | |
|---|---|
| **Before** | `disallow: ['/api/', '/admin/', '/admin', '/preview/', '/*?*']` |
| **After** | `disallow: ['/api/', '/admin/', '/admin', '/preview/']` |

*Why:* `/*?*` blocked every URL with a query string. `/contact?intent=…&role=…` is a real route that `app/contact/page.tsx` reads via `searchParams` — it was uncrawlable. Tracking params are already stripped at the edge in `middleware.ts`, so the rule was defending against a problem that no longer existed.

### `app/feedback/page.tsx` + `lib/pages.ts`

Added `robots: { index: false, follow: true }` and removed the sitemap entry. A noindex page listed in a sitemap sends Google contradictory signals; the two changes go together.

### `content/footer.ts` + `app/(shared)/SiteFooter.tsx`

| | |
|---|---|
| **Before** | Four labels rendered as `<a href="#">` — Facebook, Instagram, LinkedIn, Twitter/X |
| **After** | Typed `FooterLink[]` with one real Facebook URL, `rel="noopener me"` |

*Why:* four dead links on every page of the site. `rel="me"` is the identity-verification convention and reinforces the `sameAs` signal. Instagram, LinkedIn, and Twitter were removed rather than left dead — **add them back here and in `lib/site.ts` → `socials` once the profiles are live.**

---

## Do these four things yourself — they matter more than the code

**1. Confirm Search Console is verified. This is the highest-value thing on the list.**

You said you indexed the domain but weren't sure about Search Console. These are different things. I fetched your live homepage: there is **no `google-site-verification` meta tag**, which means the `GOOGLE_SITE_VERIFICATION` env var is not set in Vercel. That is not conclusive — if you used the DNS/domain-property method, no meta tag would appear. Check at [search.google.com/search-console](https://search.google.com/search-console): if `nimikh.com` isn't there, follow `docs/getting-indexed.md`, which is already written and accurate.

Without GSC you have no impression data, no query data, and no index coverage report. Everything after this is inference. With it, Phase 3 keyword work gets dramatically better.

**2. Fix the Facebook NAP mismatch.**

Your Facebook page lists a different address, phone, and email than your site:

| | Site (canonical) | Facebook (wrong) |
|---|---|---|
| Address | Road 1, Building No 30, Dhaka Uddan, Mohammadpur, Dhaka 1207 | Road No. 6, Mohammadia Housing Society |
| Phone | +880 1335 857104 | +880 1779-911491 |
| Email | hey@nimikh.com | nimikh.marketing@gmail.com |

Update Facebook to match the site exactly. This is a 10-minute job that unblocks local ranking. *If the Facebook details are the correct ones, tell me and I will flip the canonical source instead — but pick one and make everything match.*

**3. Create a Google Business Profile,** then ask 10–15 of your 80 clients for reviews. This unlocks the local pack, the map result, and legitimate rating schema.

**4. Deploy and verify.** Run `npm run build` locally first — I couldn't run it in the sandbox. After deploy, validate the new `Service` markup at [validator.schema.org](https://validator.schema.org/) and Google's Rich Results Test.

---

## What comes next

Batch 1 fixed what was wrong with the 14 pages you have. It does not solve the core problem, which is that 14 pages is not enough to compete with a site running 60.

**Next, in order of impact:**

1. **`/solutions/[vertical]` pages** — the architecture the SERP evidence demands. `/solutions/inventory-management-software`, `/solutions/pos-software`, `/solutions/crm-for-small-business`, `/solutions/hr-payroll-software`, `/solutions/restaurant-management-software`. This is where SMB search demand actually lives, and where you are currently invisible.
2. **Individual case-study pages** at `/case-studies/[slug]`, with real screenshots. You have six named case studies rendering as inline cards; each should be a page.
3. **Images.** The site currently has none — no team, no office, no client work. This is the biggest E-E-A-T gap and it also costs you conversions.
4. **Blog + first topic cluster,** anchored on the cost and comparison queries competitors are winning.
5. **Directory submissions** — Clutch, GoodFirms, DesignRush, TechBehemoths. Your `04-directory-submissions/tier1-submission-pack.md` needs updating to the settled positioning first.
6. **UAE landing page** — one page, Bdtask-style, not a full site.

Items 1 and 2 I can build now. Item 3 needs assets from you.
