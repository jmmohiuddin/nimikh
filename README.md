# Nimikh

Digital growth agency website — software development, growth marketing, and a creator marketplace connecting small businesses with affordable local creative talent. Based in Dhaka, Bangladesh.

🌐 **Live:** [nimikh.com](https://nimikh.com) · [nimikh.vercel.app](https://nimikh.vercel.app)

## Stack

- [Next.js 15](https://nextjs.org) App Router · React 19 · TypeScript (strict)
- Tailwind CSS wired to CSS-variable design tokens (`app/globals.css`)
- Server components by default; client components only where interactivity requires it (`app/(shared)/`)
- Zod-validated redirect map (`redirects.json`), edge middleware with security headers, split sitemaps, LLM-crawler-friendly `robots.txt`
- GitHub Actions CI: typecheck → lint → build → Lighthouse budget

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, services bento grid, pricing, testimonials |
| `/about` | Mission, team, and values |
| `/services` | Overview of all three service pillars |
| `/services/software` | Software development detail |
| `/services/marketing` | Growth marketing detail |
| `/services/creative` | Creative studio + marketplace |
| `/marketplace` | Filterable creator directory with escrow info |
| `/pricing` | Full pricing and comparison table |
| `/case-studies` | Client case studies with metrics |
| `/contact` | Contact form with inquiry routing |
| `/faq` | Categorized FAQ |
| `/founders/[slug]` | Founder profiles with Person schema |
| `/legal/*` | Privacy, terms, security, entity, compliance |

Machine-readable surfaces: `/robots.txt`, `/sitemap.xml` (+ split sitemaps), `/llms.txt`, `/api/knowledge`, `/.well-known/security.txt`.

## Authentication & role-based dashboards

The public site needs no login. Internal users sign in at **`/login`** (the
**Sign in** button in the header) with email + password; the system reads the
account's role and redirects to the matching dashboard:

| Role | Dashboard | What they can do |
|---|---|---|
| **Admin** | `/admin` | Everything: users, creators, agents, clients, projects, payments, finance, leads, feedback |
| **Creator** | `/creator` | Own earnings, portfolio content, analytics |
| **Agent** | `/agent` | Assigned sales leads, call log, commissions (25% per conversion), performance |
| **Client** | `/client` | Own projects, installment plan, payment history, invoices/receipts, documents, messages, notifications |

Sessions are HMAC-signed cookies (8-hour lifetime). Passwords are stored as
scrypt hashes. Each role only ever sees its own data — cross-role access
redirects away, and clients can never reach another client's records.

### Demo accounts (no database required)

When `MONGODB_URI` is **not** set, the app runs in **demo mode**: four
built-in accounts exist so every dashboard is explorable out of the box, and
all data (payments, leads, projects, installments…) is realistic sample data.
These credentials are deliberately **not shown anywhere in the UI** — they
live only here and in `content/demo-users.ts`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@nimikh.com` | `admin1234` |
| Creator | `creator@nimikh.com` | `creator1234` |
| Agent | `agent@nimikh.com` | `agent1234` |
| Client | `client@nimikh.com` | `client1234` |

Demo accounts are **automatically disabled** the moment a real database with
at least one real user exists — they are a pre-provisioning convenience, not
a backdoor. Do not rely on them for anything real.

### Environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `MONGODB_URI` | For real data | MongoDB Atlas connection string. Without it: demo mode (sample data, demo logins, nothing persisted). |
| `MONGODB_DB` | Optional | Database name (default `nimikh`). |
| `ADMIN_SESSION_SECRET` | **Required once `MONGODB_URI` is set** | 32+ random chars (`openssl rand -hex 32`). Signs all session cookies; rotating it logs everyone out. In demo mode (no DB) a built-in key is used so the deployed site works with zero configuration — safe only because demo accounts are public anyway. |
| `ADMIN_PASSWORD` | Optional (legacy) | Enables the older password-only `/admin/login` entry. |

Set these in Vercel → Project → Settings → Environment Variables, then redeploy.

### Going live with real accounts

1. Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and set
   `MONGODB_URI` + `ADMIN_SESSION_SECRET` in Vercel; redeploy.
2. While the users collection is still empty, demo login continues to work —
   sign in as the demo admin.
3. Go to **Admin → Users → New user** and create your real admin account
   (role `admin`, a strong password).
4. From that moment demo logins are dead; sign in with your real account and
   create creators, agents, and clients the same way.

Full operator walkthrough: [`docs/admin-guide.md`](docs/admin-guide.md).
Design rationale: ADR-08…11 in [`docs/architecture-decisions.md`](docs/architecture-decisions.md).

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
npm run build
npm run audit:seo  # boots the built site and checks indexability invariants
```

## Getting into Google

Deploying indexable code is necessary but not sufficient — you must verify the site
in Google Search Console and submit the sitemap. Step-by-step: [`docs/getting-indexed.md`](docs/getting-indexed.md).

## Architecture notes

- `lib/site.ts` — single source of truth for name, URL, nav, contact
- `lib/pages.ts` — static content manifest feeding sitemaps (swaps for CMS queries when Contentful lands)
- `lib/schema.ts` — typed JSON-LD builders (Organization, WebSite, ProfessionalService, FAQPage)
- `redirects.json` — all redirects; schema-validated at build, logged in `docs/redirects.md`
- Engineering roadmap: `Nimikh_Engineering_Specifications.md`

## Deployment

Pushes to `main` auto-deploy via Vercel.

---

© 2026 Nimikh. All rights reserved.
