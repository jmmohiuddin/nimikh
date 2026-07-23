# Nimikh

Digital growth agency website **and role-based business platform** — software
development, growth marketing, and a creator marketplace connecting small
businesses with affordable local creative talent. Based in Dhaka, Bangladesh.

🌐 **Live:** [nimikh.com](https://nimikh.com) · [nimikh.vercel.app](https://nimikh.vercel.app)

The repository contains two things that share one codebase and one design
system:

1. **The public marketing site** — fully open, no login required, SEO-first.
2. **The internal platform** — email/password sign-in with four roles
   (admin, creator, agent, client), each getting a completely different
   dashboard experience. Reached via the **Sign in** button in the header.

---

## Table of contents

- [How the platform was built — from first to last](#how-the-platform-was-built--from-first-to-last)
- [Stack](#stack)
- [Public site routes](#public-site-routes)
- [Roles & dashboards](#roles--dashboards)
  - [Admin](#admin--admin)
  - [Creator](#creator--creator)
  - [Agent](#agent--agent)
  - [Client portal](#client-portal--client)
- [Authentication architecture](#authentication-architecture)
- [Data model](#data-model)
- [Demo mode](#demo-mode)
- [Demo accounts](#demo-accounts)
- [Environment variables](#environment-variables)
- [Going live with real accounts](#going-live-with-real-accounts)
- [Security model](#security-model)
- [Project structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Further documentation](#further-documentation)

---

## How the platform was built — from first to last

The platform was delivered in four phases, each verified end-to-end against a
production build before landing (see the commit history of PR #9):

**Phase 1 — Role-based authentication + three dashboards.**
The site previously had no visible login. This phase added the **Sign in**
button to the header, a unified `/login` page (email + password), and a
role-bearing signed session: after login the system reads the account's role
and redirects to the right dashboard automatically. Three roles shipped here —
**admin** (full platform control: user management, agent monitoring, payments
with CSV export, analytics overview), **creator** (own earnings, portfolio
content, analytics), and **agent** (sales-lead pipeline with call logs and
follow-ups, commission tracking at 25% per conversion, performance charts).
Passwords are scrypt-hashed; sessions are HMAC-signed cookies; the pre-existing
password-only `/admin` login kept working throughout.

**Phase 2 — Client portal with installment & payment management.**
A fourth role, **client**, plus everything a paying customer needs to feel
informed: a dashboard answering "how is my project going, how much have I
paid, what's left, when is the next payment due"; flexible installment plans
(3/6/12/custom via one configurable generator); payment history with printable
invoices and receipts; a 10-stage visual project timeline; versioned documents
(new uploads never overwrite history); a per-project message thread with the
team; and notifications. On the admin side: `/admin/projects` (create/assign
projects, define payment plans, record payments, upload documents, reply to
clients) and `/admin/finance` (contracted vs received vs outstanding, overdue
tracking, monthly cash flow, collection rate, and a financial audit trail).

**Phase 3 — Hardening.**
Running the production server surfaced a crash where dashboard pages assumed a
session cookie always exists. A null-safe `requireSession()` helper replaced
every unsafe assertion (21 call sites) so the failure mode is a redirect to
`/login`, never a crash.

**Phase 4 — Production login fix + credential hygiene.**
On a freshly deployed site with zero configuration, login failed because
production demanded a session secret even in demo mode; and the login page
displayed the demo credentials publicly. Both fixed: the secret fallback is
now a ladder (see [Authentication architecture](#authentication-architecture)),
demo login works on a zero-config deployment, and **no credentials or internal
configuration hints appear anywhere in the UI** — they are documented only in
this README. `robots.txt` was also extended to keep crawlers out of all
dashboard trees.

Design rationale for every non-obvious decision lives in
[`docs/architecture-decisions.md`](docs/architecture-decisions.md) (ADR-08…11
cover the platform work).

---

## Stack

- [Next.js 15](https://nextjs.org) App Router · React 19 · TypeScript (strict)
- MongoDB (optional — see [Demo mode](#demo-mode)) via the official driver;
  Zod validation at every data boundary
- Tailwind CSS wired to CSS-variable design tokens (`app/globals.css`)
- Server components by default; client components only where interactivity
  requires it; dependency-free inline-SVG charts (no chart library, CSP-safe)
- Node's built-in `scrypt` for password hashing and `HMAC-SHA256` for session
  signing — zero added auth dependencies
- Zod-validated redirect map (`redirects.json`), edge middleware with security
  headers, split sitemaps, LLM-crawler-friendly `robots.txt`
- GitHub Actions CI: typecheck → lint → build → Lighthouse budget

## Public site routes

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
| `/login` | Unified sign-in for all internal roles |

Machine-readable surfaces: `/robots.txt`, `/sitemap.xml` (+ split sitemaps),
`/llms.txt`, `/api/knowledge`, `/.well-known/security.txt`.

All dashboard trees (`/admin`, `/creator`, `/agent`, `/client`) and `/login`
are `noindex` and disallowed in `robots.txt`.

---

## Roles & dashboards

Every dashboard shares one responsive shell (`app/(shared)/dashboard/`):
sidebar navigation with a mobile drawer, a top bar, stat-tile grids, data
tables, SVG bar charts and progress meters — so all four roles read as one
product. Each role sees **only** its own data.

### Admin — `/admin`

Complete control over the platform.

| Area | Capabilities |
|---|---|
| **Overview** | Total revenue, creators, agents, customers, conversions, commissions, pending payouts, platform users; monthly revenue & commissions chart; "what needs attention" list |
| **Users** | View all users; create, edit, delete; suspend/activate; assign any role; passwords scrypt-hashed on create/reset; search + role filters |
| **Creators** | Directory CRUD (also feeds the public `/marketplace`), approve/publish, edit, suspend |
| **Agents** | Per-agent performance: total/converted/active leads, conversion-rate meter, commissions earned & pending; enable/disable |
| **Clients** | CRM records (companies, status, services, notes) + convert-lead-to-client |
| **Projects** | Create & assign projects to client accounts; set stage (10-stage lifecycle); define/replace installment plans; record payments; upload versioned documents; message clients — each action notifies the client |
| **Finance** | Total contracted revenue, received, outstanding; upcoming & overdue installments; monthly cash-flow chart; per-client payment trends; collection rate; financial audit trail |
| **Payments** | Full ledger of customer payments, creator payouts, agent commissions; pending/completed filters; mark-paid; **CSV export** |
| **Leads / Feedback** | Contact-form inbox (with CSV export) and site feedback |

### Creator — `/creator`

Self-scoped only.

- **Overview** — earnings headline, profile card, monthly earnings chart
- **Earnings** — total / paid / pending, full payment history table
- **Content** — add, manage, and delete portfolio items (storage-agnostic:
  items reference hosted image URLs; direct uploads can be added later
  without changing the screens)
- **Analytics** — views, engagement, sales generated, revenue generated

### Agent — `/agent`

Designed around the convert-leads-into-customers workflow. **Every successful
conversion earns the agent a 25% commission** (`COMMISSION_RATE` in
`lib/payments.ts` — a named constant, not a magic number).

- **Overview** — active pipeline, conversions, conversion rate, commission
  headline; follow-ups due today; pipeline health meters
- **Leads** — assigned leads with stage (new → contacted → follow-up →
  converted / lost), call history, notes, follow-up dates; search + stage
  filters; one-click stage changes and call logging
- **Commissions** — total / pending / paid, monthly commission chart, full
  history
- **Performance** — conversions per month, earnings per month, funnel view

### Client portal — `/client`

Everything a client needs to feel informed, organized, and confident.

- **Overview** — project status and completion %, total value, amount paid,
  remaining balance, next installment + due date, recent activity,
  notifications, latest support messages
- **Project** — 10-stage visual timeline (Project Created → Planning → UI/UX
  Design → Development → Internal Testing → Client Review → Revisions → Final
  Approval → Deployment → Completed), completion meter, team (PM, designer,
  developer), start/expected-delivery dates, important links, documents
- **Installments** — the payment plan as both a table (number, due date,
  amount, status, paid date, running remaining balance, notes) and progress
  indicators; paid / pending / **overdue** / upcoming states are derived from
  dates so nothing needs manual flagging
- **Payments** — complete history: date, amount, method (bKash, Nagad, bank
  transfer, card, cash, cheque…), transaction reference, invoice number,
  status — with **downloadable invoices and receipts** (self-contained
  printable HTML; browser's Print → Save as PDF)
- **Documents** — contracts, proposals, requirement docs, design files,
  deliverables, manuals, invoices, receipts — **with versioning**: a new
  upload of the same document becomes v2/v3…, prior versions stay available
- **Messages** — a communication thread per project with the team; file
  links can be attached; announcements and updates stay tied to the project
- **Notifications** — invoice generated, payment received, installment due
  soon, overdue reminder, milestone completed, new message, file uploaded,
  project delivered; unread badge in the sidebar

Clients with multiple projects get a project switcher on every relevant page.

---

## Authentication architecture

- **One login for every role.** `POST /login` → `authenticate()` checks the
  `users` collection (or demo users — see below), verifies the scrypt hash in
  constant time, then mints an **HMAC-SHA256-signed session cookie** carrying
  `{uid, role, name, email, exp}`. No DB round-trip on subsequent requests.
- **Role gates.** Each dashboard tree's layout calls `requireRole(role)`:
  unauthenticated → `/login?next=…`; wrong role → redirected to their own
  dashboard. Leaf pages and server actions use the null-safe
  `requireSession()` — never a bare assertion.
- **Session secret ladder** (`lib/auth.ts`):
  1. `ADMIN_SESSION_SECRET` env var, if set (16+ chars) — always wins.
  2. Development/preview: built-in dev secret, so `npm run dev` just works.
  3. **Production without a database** (pure demo mode): built-in secret is
     allowed — demo accounts are public by design, so this exposes nothing
     they don't already, and a static key verifies consistently across
     serverless instances.
  4. **Production with `MONGODB_URI` set: the env var is required.** Real
     accounts never run on a publicly-known signing key; login refuses until
     a real secret is configured.
- **Passwords** are stored as `scrypt$N$salt$hash` (Node built-in, memory-hard,
  no native-dependency install). The format is self-describing so parameters
  can evolve.
- Rotating `ADMIN_SESSION_SECRET` invalidates every session at once — the
  intended panic button. The legacy password-only `/admin/login`
  (`ADMIN_PASSWORD`) still works and grants admin.

## Data model

MongoDB collections (created lazily, indexed on first use — see `lib/db.ts`):

| Collection | Purpose | Key relationships |
|---|---|---|
| `users` | All login accounts with role + status | — |
| `projects` | Client deliverables: stage, team, dates, links, value | `clientId → users` |
| `installments` | The payment plan: due date, amount, status, method, reference, invoice number, receipt flag, notes, **embedded audit history** | `projectId → projects`, `clientId → users` |
| `documents` | Versioned project files by category | `projectId`, `clientId` |
| `messages` | Per-project communication thread | `projectId`, `clientId` |
| `notifications` | Client activity feed with read state | `clientId`, `projectId` |
| `payments` | Creator-payout / agent-commission revenue ledger | `creatorId`, `agentId` |
| `agentLeads` | Agent sales pipeline: stage, call log, follow-ups | `assignedAgentId → users` |
| `creators` | Marketplace directory (feeds public `/marketplace`) | — |
| `clients` | CRM company records | — |
| `leads` / `feedback` | Public contact-form and feedback inboxes | — |

Derived values are computed, never stored redundantly: paid amount = Σ paid
installments; remaining = total − paid; next installment = earliest unpaid by
due date; overdue = unpaid **and** past due; project completion % = position
in the stage list. Payment-plan generation (`generatePlan()` in
`lib/installments.ts`) takes count, total, first due date, and cadence as
parameters — 3, 6, 12, or fully custom schedules all share one code path, and
the last installment absorbs rounding so the plan always sums exactly.

Every financial mutation (plan created, payment recorded, schedule modified)
appends to the installment's embedded `history`, which the admin Finance page
surfaces as an audit trail.

## Demo mode

The entire platform is explorable **without any configuration**. When
`MONGODB_URI` is not set:

- The four [demo accounts](#demo-accounts) can sign in.
- Every dashboard is populated with deterministic, realistic sample data
  (projects, installment plans with paid/overdue/upcoming states, payments,
  leads, documents, messages, notifications).
- Public form submissions are logged server-side rather than stored.

This mirrors the marketplace's original seed-data philosophy: the app is never
empty, works before infrastructure exists, and hands over to the database the
moment one is provisioned. Demo accounts **disable themselves automatically**
once a real database contains at least one real user.

## Demo accounts

Deliberately **never displayed in the UI** — documented here only (source:
`content/demo-users.ts`).

| Role | Email | Password | Lands on |
|---|---|---|---|
| Admin | `admin@nimikh.com` | `admin1234` | `/admin` |
| Creator | `creator@nimikh.com` | `creator1234` | `/creator` |
| Agent | `agent@nimikh.com` | `agent1234` | `/agent` |
| Client | `client@nimikh.com` | `client1234` | `/client` |

Do not rely on these for anything real — they are a pre-provisioning
convenience and die as soon as real users exist.

## Environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `MONGODB_URI` | For real data | MongoDB Atlas connection string. Without it: demo mode. |
| `MONGODB_DB` | Optional | Database name (default `nimikh`). |
| `ADMIN_SESSION_SECRET` | **Required once `MONGODB_URI` is set** | 32+ random chars (`openssl rand -hex 32`). Signs all sessions; rotating it logs everyone out. |
| `ADMIN_PASSWORD` | Optional (legacy) | Enables the older password-only `/admin/login` entry. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical origin override for previews. |

Set them in Vercel → Project → Settings → Environment Variables, then redeploy.

## Going live with real accounts

1. Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster; set
   `MONGODB_URI` and `ADMIN_SESSION_SECRET` in Vercel; redeploy.
2. While the users collection is still empty, demo login still works — sign
   in as the demo admin.
3. **Admin → Users → New user**: create your real admin account (role
   `admin`, strong password).
4. Demo logins are now dead. Sign in with your real account and create
   creators, agents, and client accounts the same way. Assign projects and
   payment plans from **Admin → Projects**.

Full operator walkthrough: [`docs/admin-guide.md`](docs/admin-guide.md).

## Security model

- **Public/private split** — the marketing site ships zero platform JS and
  needs no cookies; dashboards are server-rendered behind the session gate
  and `noindex`.
- **Role isolation** — enforced server-side in layouts; a creator hitting
  `/admin` is redirected to `/creator`, etc.
- **Ownership checks** — every client-portal query is scoped to the session
  `uid`, and record-level `clientId` is verified again on direct-id routes:
  the invoice route returns **403** for a non-owner role, **401** with no
  session, **404** for unknown ids. Agents can only mutate leads assigned to
  them.
- **Credential hygiene** — no credentials, secrets, or configuration hints in
  any public HTML; login errors are generic; passwords hashed with scrypt;
  constant-time comparisons throughout.
- **Transport & headers** — HSTS, X-Frame-Options DENY, nosniff,
  Referrer-Policy, Permissions-Policy, and CSP (report-only) set in edge
  middleware for every page.
- **Financial audit** — installment history records every plan creation,
  payment, and schedule change.

## Project structure

```
app/
  (shared)/              Public-site shared components (nav, footer, forms)
    dashboard/           Platform UI kit: DashboardShell, stat tiles, tables,
                         SVG charts — shared by all four roles
  admin/
    login/  logout/      Legacy password-only admin entry (still works)
    (auth)/              Gated admin tree: overview, users, creators, agents,
                         clients, projects, finance, payments (+CSV), leads,
                         feedback
  creator/               Creator dashboard (overview, earnings, content, analytics)
  agent/                 Agent dashboard (overview, leads, commissions, performance)
  client/                Client portal (overview, project, installments, payments,
                         documents, messages, notifications, invoice route)
  login/  logout/        Unified role-based sign-in / sign-out
  …                      Public marketing pages
content/
  demo-users.ts          Demo accounts (no-DB fallback)
  marketplace.ts         Marketplace seed data
lib/
  auth.ts                Role sessions: mint/verify, requireRole, requireSession
  auth/password.ts       scrypt hash + constant-time verify
  users.ts               Accounts + RBAC (roles: admin/creator/agent/client)
  projects.ts            Project lifecycle (10 stages, completion %)
  installments.ts        Payment plans, invoices/receipts, audit, finance rollups
  documents.ts           Versioned project documents
  messages.ts            Per-project communication threads
  notifications.ts       Client activity feed
  payments.ts            Creator/agent revenue ledger (25% commission constant)
  agentLeads.ts          Agent sales pipeline
  clients.ts creators.ts leads.ts feedback.ts   CRM/CMS/inbox models
  db.ts                  Mongo connection + graceful demo fallback
docs/
  admin-guide.md         Operator's guide (env setup, roles, workflows)
  architecture-decisions.md   ADR-01…11 — every non-obvious choice + tripwires
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000 — demo mode, no env vars needed
npm run typecheck  # tsc --noEmit
npm run lint
npm run build
npm run audit:seo  # boots the built site and checks indexability invariants
```

Sign in with any [demo account](#demo-accounts) to explore all four dashboards.

## Getting into Google

Deploying indexable code is necessary but not sufficient — you must verify the
site in Google Search Console and submit the sitemap. Step-by-step:
[`docs/getting-indexed.md`](docs/getting-indexed.md).

## Deployment

Pushes to `main` auto-deploy via Vercel. CI (GitHub Actions) runs typecheck →
lint → build → Lighthouse performance budget on every PR; all four platform
phases shipped through PR #9 with every check green.

## Further documentation

| Document | Contents |
|---|---|
| [`docs/admin-guide.md`](docs/admin-guide.md) | Operator's guide: env vars, log-only mode, role management, daily workflows |
| [`docs/architecture-decisions.md`](docs/architecture-decisions.md) | ADR-01…11: MongoDB fallback, session design, role dashboards in-repo, demo-user philosophy, client portal data model |
| [`docs/getting-indexed.md`](docs/getting-indexed.md) | Search Console verification + sitemap submission |
| [`Nimikh_Engineering_Specifications.md`](Nimikh_Engineering_Specifications.md) | Original engineering roadmap |

---

© 2026 Nimikh. All rights reserved.
