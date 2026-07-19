import { getSession } from '@/lib/auth';
import { getInstallment } from '@/lib/installments';
import { getProject } from '@/lib/projects';
import { getUserById } from '@/lib/users';
import { site } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
}
function money(n: number): string {
  return `BDT ${Math.round(n).toLocaleString('en-US')}`;
}
function fmt(s: string) {
  if (!s) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${s}T00:00:00`));
}

/**
 * Generates a self-contained, printable HTML invoice or receipt for a
 * single installment. No PDF dependency — the browser's "Print → Save as
 * PDF" produces the downloadable artefact. Strictly ownership-checked:
 * only the client who owns the installment (or an admin) can open it.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const inst = await getInstallment(id);
  if (!inst) return new Response('Not found', { status: 404 });

  // A client may only view their own installment; admins may view any.
  if (session.role !== 'admin' && inst.clientId !== session.uid) {
    return new Response('Forbidden', { status: 403 });
  }

  const url = new URL(req.url);
  const isReceipt = url.searchParams.get('type') === 'receipt' || inst.state === 'paid';
  const [project, client] = await Promise.all([getProject(inst.projectId), getUserById(inst.clientId)]);
  const docType = isReceipt && inst.state === 'paid' ? 'Receipt' : 'Invoice';

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(docType)} ${esc(inst.invoiceNumber)} — ${esc(site.name)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; margin: 0; padding: 40px; background: #f5f5f5; }
  .sheet { max-width: 720px; margin: 0 auto; background: #fff; padding: 48px; border-radius: 10px; box-shadow: 0 2px 20px rgba(0,0,0,.08); }
  .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; }
  h1 { font-size: 28px; margin: 0 0 4px; letter-spacing: -.02em; }
  .muted { color: #666; font-size: 13px; }
  .brand { font-size: 20px; font-weight: 800; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
  .paid { background: #dcfce7; color: #166534; }
  .due { background: #fef3c7; color: #92400e; }
  table { width: 100%; border-collapse: collapse; margin: 32px 0; }
  th, td { text-align: left; padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 14px; }
  th { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #888; }
  .num { text-align: right; }
  .total { font-size: 20px; font-weight: 800; }
  .meta { margin-top: 24px; font-size: 13px; color: #444; line-height: 1.7; }
  .print-btn { display: inline-block; margin: 0 auto 24px; padding: 10px 20px; background: #5e6ad2; color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; }
  @media print { body { background: #fff; padding: 0; } .sheet { box-shadow: none; } .print-btn { display: none; } }
</style></head>
<body>
  <div style="max-width:720px;margin:0 auto;text-align:center">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="sheet">
    <div class="row">
      <div>
        <div class="brand">${esc(site.name)}</div>
        <div class="muted">${esc(site.address.street)}, ${esc(site.address.locality)} ${esc(site.address.postalCode)}</div>
        <div class="muted">${esc(site.contactEmail)} · ${esc(site.contactPhoneDisplay)}</div>
      </div>
      <div style="text-align:right">
        <h1>${esc(docType)}</h1>
        <div class="muted">${esc(inst.invoiceNumber)}</div>
        <div style="margin-top:8px"><span class="status ${inst.state === 'paid' ? 'paid' : 'due'}">${inst.state === 'paid' ? 'PAID' : 'DUE'}</span></div>
      </div>
    </div>

    <div class="meta">
      <strong>Billed to:</strong> ${esc(client?.name ?? 'Client')}${client?.email ? ` (${esc(client.email)})` : ''}<br>
      <strong>Project:</strong> ${esc(project?.name ?? inst.projectId)}<br>
      <strong>Installment:</strong> #${esc(inst.number)}
    </div>

    <table>
      <thead><tr><th>Description</th><th>Due date</th><th class="num">Amount</th></tr></thead>
      <tbody>
        <tr>
          <td>Installment ${esc(inst.number)} — ${esc(project?.name ?? 'Project')}</td>
          <td>${esc(fmt(inst.dueDate))}</td>
          <td class="num">${esc(money(inst.amount))}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr><td colspan="2" class="num total">Total</td><td class="num total">${esc(money(inst.amount))}</td></tr>
      </tfoot>
    </table>

    <div class="meta">
      ${inst.state === 'paid'
        ? `<strong>Paid on:</strong> ${esc(fmt(inst.paidDate || ''))}${inst.method ? ` via ${esc(inst.method)}` : ''}${inst.reference ? `<br><strong>Reference:</strong> ${esc(inst.reference)}` : ''}`
        : `<strong>Please pay by:</strong> ${esc(fmt(inst.dueDate))}`}
      ${inst.notes ? `<br><strong>Notes:</strong> ${esc(inst.notes)}` : ''}
    </div>

    <p class="muted" style="margin-top:40px;text-align:center">Thank you for working with ${esc(site.name)}.</p>
  </div>
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
