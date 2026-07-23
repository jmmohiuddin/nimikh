# Architecture Decision Record — platform foundations

Records the decisions I took autonomously when the user asked me to "make it and
also what you think better take that decision" in response to the SaaS-rebuild
prompt. Each decision states the choice, the alternatives considered, and the
tripwire that would flip the choice.

> Context — the user's prompt asked for a full SaaS platform (MongoDB, Firebase
> Auth, admin dashboard, creator portal, real-time messaging, etc.) on top of
> what is currently a static marketing site. The engineering spec
> ([Nimikh_Engineering_Specifications.md](../Nimikh_Engineering_Specifications.md))
> calls for Contentful + Postgres and treats the marketplace as future work.
> These decisions reconcile the two.

---

## ADR-01 — Marketing-site subset in this repo, marketplace in a future repo

**Decision.** Keep this repo as the marketing site. Implement leads, feedback,
content externalization, admin-side CRM (clients) and admin-side marketplace CMS
(creator directory) here. Do NOT build customer-facing portals (creators logging
in to their own dashboard, clients logging in to see project status),
marketplace transactions, real-time messaging, or project management in this
repo — those belong to a future `nimikh-platform` repo.

**Why.** The marketing site's LCP/CLS/TBT budgets (spec §NIM-045) are
incompatible with a customer-facing portal's JS payload and multi-user auth
surface. A marketplace product deserves its own runtime, DB, deploy pipeline,
and on-call rotation. Admin-only CRUD is a different story — it runs
server-rendered under the same single-admin cookie session and edits the same
data the public pages read, so it collapses cleanly into this repo.

**The line.** In-scope here: any surface Mohiuddin uses server-side to
manage internal data. Out-of-scope: any surface a creator or client logs into
themselves. When the marketplace becomes a real product with transactional
flows or multi-user auth, extract it — do not extend this one.

**Tripwire.** First feature that needs a non-admin user account (creator
onboarding form with password, client project-status view, etc.) is the signal
to spin up `nimikh-platform` rather than adding a role check here.

---

## ADR-02 — MongoDB Atlas with graceful in-memory fallback

**Decision.** Use MongoDB Atlas via the official driver. If `MONGODB_URI` isn't
set, the app runs in "log-only" mode: submissions succeed for the user, are
written to the server log, and never touch a DB.

**Why.** The user asked for MongoDB and gave the engineering spec (which asks for
Postgres) delegated authority. Fallback matters because the code must ship *before*
the user configures Atlas — otherwise every deploy without env-var setup breaks
the contact form.

**Tripwire.** If a customer-facing feature needs relational integrity (multi-table
transactions, foreign keys), reopen the Postgres decision.

---

## ADR-03 — Single-admin cookie session (not Firebase / not Auth.js — yet)

**Decision.** Admin access is guarded by a single hashed `ADMIN_PASSWORD` env var
that mints an httpOnly signed cookie session. The `/admin/*` tree is
middleware-guarded.

**Why.** Firebase for a single-admin brochure site is over-engineered — one
user, no OAuth flow, no email verification, no MFA needs. Auth.js becomes the
right answer the day a *second* human logs in, which is the day the creator
portal ships (see ADR-01). Until then, one hashed password on one cookie is
strictly better: fewer moving parts, zero third-party dependency, faster.

**Tripwire.** Add a second admin, a second role, or public sign-up → migrate to
Auth.js in the same commit as the schema change.

---

## ADR-04 — Content in typed TypeScript modules, not Contentful (yet)

**Decision.** Team, testimonials, footer, FAQ, case-study data lives in
`content/*.ts` — typed, imported directly by the pages, statically bundled.

**Why.** The spec's Contentful path (NIM-020) is the right long-term choice.
But: Contentful needs an account, a paid tier at scale, and a full content model
migration. Typed TS modules ship *now*, keep the site fully static (best-in-class
Core Web Vitals), and are a one-adapter swap away from Contentful — because the
pages don't know where the data came from.

**Tripwire.** When a non-engineer needs to edit content weekly without a PR →
migrate to Contentful.

---

## ADR-05 — Refuse to fabricate a "Growth Lead" placeholder

**Decision.** The About page will NOT carry a fictional Growth Lead profile.
The team card becomes a "Growth Lead — hiring" placeholder that links to the
contact form.

**Why.** Fake team members hurt E-E-A-T signals and are actively spotted by
Google's manual reviewers. It's also representational — the site claims 152
projects and 80 clients; putting a fake person next to those numbers exposes both
to skepticism. The user's own instruction said "clearly marked as placeholder"
— my interpretation of that constraint is that a hiring placeholder is the
maximally-honest reading.

**Tripwire.** None — this decision is stable. Real hire fills it.

---

## ADR-06 — Real founders sourced from Nimikh-Execution-Kit, not invented

**Decision.** Mohiuddin (Founder & CEO) and Maruf Shezad (Founder & CXO) get
real bios sourced from `Nimikh-Execution-Kit/05-website-copy/about-team-contact.md`,
with LinkedIn `sameAs` for Mohiuddin (`jm-mohiuddin`). Both get a
`/founders/[slug]` page with `Person` schema linked to the Organization.

**Why.** The About page previously carried the About-copy stub; the Execution
Kit contains authoritative founder-supplied bios. Using the authoritative source
is the point of having the kit.

**Tripwire.** None. When Maruf's LinkedIn URL is known, add it to
`lib/founders.ts` `sameAs`.

---

## ADR-07 — Ship in slices behind a single PR, not one giant push

**Decision.** All work in this session lands on one `platform-foundations`
branch with logically-scoped commits, opened as one PR, merged after all commits
land.

**Why.** The user granted authority to merge but asked me previously to work in
small commits and explain architectural decisions. One PR with 8 commits threads
both: reviewable (per-commit diff), atomic (either all lands or none), and
faster than 8 sequential PR round-trips.

**Tripwire.** If any commit introduces a runtime dep with license or security
implications (MongoDB driver counts as neither — it's Apache-2.0), split it out.

---

## ADR-08 — Role-based auth (admin / creator / agent) extends the single-admin session

**Decision.** Introduce a `users` collection (email + scrypt-hashed password,
role, status) and a role-bearing signed session cookie (`lib/auth.ts`) that
carries `{uid, role, name, email, exp}`. Reuse the exact HMAC + timing-safe
pattern from the single-admin session (ADR-03) rather than adding Firebase /
Auth.js. The legacy `/admin/login` password flow keeps working — the admin gate
now accepts EITHER the new admin session OR the legacy cookie.

**Why.** ADR-03 deferred multi-user auth until "there's a second kind of user."
This request is exactly that: three roles, each with a tailored dashboard.
scrypt ships with Node (no native bcrypt build, no new dependency), the signed
cookie needs no session store, and reusing the established crypto keeps the
security surface small and reviewed. A hosted IdP would be heavier than the
brief warrants for three internal roles.

**Tripwire.** Move to Auth.js + an adapter when we need OAuth/social login,
per-permission (not per-role) authorization, or password-reset email flows.

---

## ADR-09 — Creator & agent dashboards live in THIS repo (revises ADR-01)

**Decision.** Build the admin, creator, and agent dashboards here, gated by the
new session and rendered server-side under `/admin`, `/creator`, `/agent`.

**Why.** ADR-01 excluded "creators logging in to their own dashboard" to protect
the marketing site's performance budget. That holds for a heavy customer-facing
marketplace runtime — but these are low-traffic, server-rendered internal
dashboards behind an auth gate and `robots: noindex`. They ship zero extra JS to
public pages (the public site's suppression of dashboard chrome is unchanged),
so the LCP/CLS budget is untouched. Splitting three internal dashboards into a
separate repo/runtime would be premature.

**Tripwire.** Split into `nimikh-platform` once dashboards need real-time
features, heavy client bundles, or a separate deploy/on-call rotation.

---

## ADR-10 — Demo-user + demo-ledger fallback, mirroring the marketplace seed

**Decision.** When `MONGODB_URI` is unset, `authenticate()` and every dashboard
query fall back to demo users (`content/demo-users.ts`) and a deterministic demo
ledger/pipeline (in `lib/payments.ts`, `lib/agentLeads.ts`). The login page
surfaces the demo credentials in this mode.

**Why.** This is the same "never-empty, works-pre-Atlas" philosophy as the
marketplace seed (ADR-04) and log-only mode (ADR-02). It makes the entire
role-based product demonstrable out of the box, then cleanly hands over to the
database the moment one is provisioned. Revenue-split rates (agent commission
25%, creator 65%) are named constants in `lib/payments.ts`, not magic numbers.

**Tripwire.** The demo plaintext passwords are gated to the no-DB path only; a
real DB with any users disables demo login. Never ship demo creds as real ones.

---

## ADR-11 — Client Portal role and installment engine (extends ADR-08/09)

**Decision.** Add a fourth role `client` (home `/client`) and a dedicated
client portal: projects, a flexible installment engine, documents, messages,
and notifications. Installments are a **separate** model from the
creator/agent revenue-split ledger (`lib/payments.ts`) — different lifecycle,
different party, different reporting — linked by `projectId`/`clientId`, not
merged into it.

**Why.** The revenue ledger records what Nimikh pays out (creator payouts,
agent commissions); installments record what clients owe Nimikh over time.
Forcing both into one collection would tangle two unrelated financial flows.
Clean relationships instead: `User(client) 1—* Project 1—* Installment`,
with documents/messages/notifications scoped by project + client.

**Flexible plans, no hardcoding.** `generatePlan()` takes count, total, first
due date, and cadence as parameters, so 3/6/12/custom plans are all the same
code path. Split rounding lands on the final installment. Each installment is
its own invoice/receipt (invoiceNumber + printable HTML route) and carries an
embedded `history[]` audit trail; `listRecentFinanceActivity()` flattens those
for the admin finance dashboard.

**Security.** Every client query is scoped to `session.uid`; the invoice route
and per-project pages verify the record's `clientId` matches the session (admins
may view any). A client can never address another client's data by id.

**Tripwire.** When real payment gateways land (bKash/Nagad/Stripe webhooks),
`markInstallmentPaid` becomes the webhook's target and the demo ledger retires.
If invoices need legal/PDF fidelity, swap the HTML route for a PDF service —
the model and links don't change.
