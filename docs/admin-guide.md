# Nimikh admin — operator's guide

The `/admin` surface is your internal control room: lead inbox, feedback,
client CRM, creator directory (CMS for `/marketplace`). This is what runs it,
what to do first, and how it fails safely if a piece isn't configured yet.

---

## 1. Set the env vars (one-time, in Vercel)

Vercel → your project → **Settings → Environment Variables**.
Add these to **Production** (and Preview if you want previews to work too):

| Variable | Value | Effect if missing |
|---|---|---|
| `ADMIN_PASSWORD` | Any strong password | Login form disabled with an explainer |
| `ADMIN_SESSION_SECRET` | 32+ random chars — run `openssl rand -hex 32` | Same as above |
| `MONGODB_URI` | Your MongoDB Atlas connection string | Everything runs in **log-only mode** — see below |
| `MONGODB_DB` | Optional DB name | Defaults to `nimikh` |

**Redeploy after adding.** Env var changes only take effect on the next
deployment. Trigger one by pushing any commit or clicking **Redeploy** in
the Vercel UI.

### Getting a MongoDB URI in 3 minutes

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) — the free M0 tier is enough for this workload.
2. Create a project → build a database → free shared cluster → nearest region (Singapore for BD latency).
3. **Database Access** → add a database user with a strong password. Save the password.
4. **Network Access** → allow access from anywhere (`0.0.0.0/0`) for Vercel. (Yes, `0.0.0.0/0` is fine here — the DB is still password-protected. Vercel's edge IPs aren't stable, so an IP allowlist doesn't work.)
5. **Connect** → **Drivers** → copy the connection string. Replace `<password>` with the password from step 3.
6. Paste as `MONGODB_URI` in Vercel and redeploy.

The dashboard's banner will flip from "log-only mode" to nothing — meaning persistence is on.

---

## 2. Log in and take a tour

Visit **`https://nimikh.com/admin`** → you'll be redirected to `/admin/login`.
Enter the `ADMIN_PASSWORD` you set. Sessions last 8 hours.

The top bar shows five sections:

- **Overview** (`/admin`) — 8 clickable stat tiles + a "What's next" card that surfaces open items + a "Public marketplace source" card that tells you whether `/marketplace` is serving DB records or the seed list.
- **Leads** (`/admin/leads`) — every contact form submission.
- **Clients** (`/admin/clients`) — the CRM. Prospects, active engagements, past work.
- **Creators** (`/admin/creators`) — the marketplace directory. Publishing a creator makes them appear on `/marketplace`.
- **Feedback** (`/admin/feedback`) — every submission from `/feedback`.

---

## 3. Common workflows

### Handle a new lead
1. **Leads** → find the row (unhandled leads have an indigo border and no "Handled" badge).
2. Reply via the email/phone shown.
3. Click **Mark handled** to move it out of the "open" count.

### Convert a lead into a client
1. **Leads** → find the row → click **Convert to client →**.
2. The new-client form opens with company, name, email, phone, and notes
   pre-filled from the lead. The notes field is stamped with the original
   intent, budget, and full message — nothing is lost.
3. Set the status (usually **prospect**) and hit **Create client**.
4. The client keeps a hidden `fromLeadId` back-reference so you can trace it later.

### Add a new creator to the public marketplace
1. **Creators** → **＋ New creator**.
2. Fill in name, role, category, initial (1–2 chars for the avatar), a CSS
   gradient for the avatar background (any valid `linear-gradient(...)`), an
   emoji, starting rate, rating, and skill chips.
3. Set status to **draft** while you review, **published** to go live.
4. Save. The public `/marketplace` refreshes on the next request.

**How the marketplace picks what to show:** the public page prefers
published DB records. If none exist, it falls back to `content/marketplace.ts`
seed data. The moment you publish your first creator, seed data goes away
completely — publish creators in one sitting to avoid a partial-list view.

### Suspend or unpublish a creator
On the creator card in the list, one click:
- **Unpublish** → moves back to draft, disappears from `/marketplace`
- **Suspend** → hidden from `/marketplace` and marked amber in admin
- **Delete** (in the edit page) → permanent

### Export leads as CSV
**Leads** → **Download CSV** in the top right. All fields, one row per lead.
The endpoint (`/admin/leads/export.csv`) requires a valid admin session,
so the link is safe to share — but the CSV itself is not.

### Sign out
Top-right **Sign out** button clears the session cookie. Signing back in
requires the `ADMIN_PASSWORD`.

### Emergency: invalidate every active session
Rotate `ADMIN_SESSION_SECRET` in Vercel and redeploy. Every existing cookie
becomes invalid instantly. Do this if a session cookie leaks or a device is
lost.

---

## 4. Log-only mode (what happens without MongoDB)

If `MONGODB_URI` isn't set, the site still works — it just doesn't remember
anything:

- Form submissions (contact, feedback) return "sent successfully" to the
  user and get written as a redacted line in the Vercel function log
  (**Logs** tab in the Vercel dashboard). You can read them there.
- `/admin` renders empty lists with an amber "Log-only mode" banner
  telling you exactly what to set.
- Creating a client or creator in admin succeeds visually but nothing is
  saved — the amber banner explains why.
- `/marketplace` shows the seed creator list from `content/marketplace.ts`.

This is intentional: the code ships and works before MongoDB is provisioned,
so a missed step doesn't take the site down.

---

## 5. Public-facing surfaces powered by admin

| Admin action | Public effect |
|---|---|
| Publish a creator | Appears on `/marketplace` on the next request |
| Change a creator's rate, chips, or emoji | Same — `revalidatePath('/marketplace')` fires on every save |
| Convert a lead to a client | No public effect (CRM is internal only) |
| Everything else | No public effect |

The rest of the site (`/`, `/about`, `/services/*`, `/founders/*`, `/pricing`,
`/case-studies`, `/faq`, `/legal/*`) is content-managed by editing files in
the repo. That's intentional — see [ADR-04](./architecture-decisions.md).

---

## 6. Where to look when something breaks

- **Vercel Logs** — click the deployment → **Logs** tab. Every form submission,
  every admin action, every server error lands here. Filter by function
  (`/api/leads`, `/api/feedback`, `/admin/(auth)/*`) to narrow down.
- **MongoDB Atlas → Metrics** — connection failures show up here first.
- **Vercel → Deployments** — if a redeploy failed, the build log tells you
  why (usually a typecheck or lint error caught by the CI pipeline).

For anything else, check `docs/architecture-decisions.md` — every non-obvious
design choice has a rationale and a "tripwire" for when to revisit it.

---

## 7. Roles & the unified login (`/login`)

The site now has a **Sign in** button in the header. It leads to `/login`, a
single email + password form for all three internal roles. After sign-in the
system reads the account's role and redirects automatically:

| Role | Lands on | Can do |
|---|---|---|
| **Admin** | `/admin` | Everything: users (create/edit/suspend/delete/assign role), creators, agents, clients, all payments (+ CSV export), platform analytics |
| **Creator** | `/creator` | Only their own: earnings, payment history, portfolio content (add/delete), personal analytics |
| **Agent** | `/agent` | Only their own: assigned leads (call log, stage, follow-ups), commissions (25% of each conversion), performance |

The public marketing site stays fully open — logging in is optional and only
matters for these internal users.

**Env vars.** Role sessions are signed with the same `ADMIN_SESSION_SECRET` used
by the legacy `/admin` password login (rotating it logs everyone out). No new
env var is required. The legacy `/admin/login` password entry still works and
also grants admin.

**Managing accounts.** Admin → **Users** → *New user* creates an account with a
role and password (scrypt-hashed). Suspended users can't sign in. Assigning the
`agent` role makes the account appear under Admin → **Agents**; assigning
`creator` gives it a creator dashboard.

**Demo mode.** With no `MONGODB_URI`, the login page shows three built-in demo
accounts (admin/creator/agent) so the whole system is explorable before Atlas is
connected. The moment a database with real users exists, demo login is disabled.
See ADR-08…10 in `docs/architecture-decisions.md`.

---

## 8. Client Portal & projects

A fourth role, **client**, gives customers a private portal at `/client` to
track their projects and installment payments. Clients only ever see their own
data.

**Set up a client (admin):**
1. Admin → **Users → New user**, role = `client` — this is their login.
2. Admin → **Projects → New project**, pick that client, set value/dates/team.
3. Open the project → **Define payment plan** (e.g. 6 installments, monthly).
   This generates the schedule with invoice numbers.
4. As money arrives, **Record payment** on each installment (method + reference
   + date). This flips it to Paid, exposes a receipt, and notifies the client.

**What the client sees:** a dashboard (project status, % complete, total /
paid / remaining, next due), an installment schedule (paid / overdue / upcoming
with a progress bar), payment history with downloadable invoices & receipts, a
stage timeline, versioned documents, a per-project message thread, and
notifications. Invoices/receipts are printable HTML — "Print → Save as PDF".

**Financial dashboard:** Admin → **Finance** shows contracted revenue, received,
outstanding, upcoming (30-day), overdue, monthly cash flow, per-client payment
trends, collection rate, and a financial audit trail. See ADR-11.

**Demo mode:** with no `MONGODB_URI`, a demo client (`client@nimikh.com` /
`client1234`) with two projects, a live installment plan, documents, messages,
and notifications lets you explore the whole portal.
