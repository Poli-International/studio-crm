import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The clean-up release (1.0.46), checked on the real server.js started on a throwaway database
// with the sample studio, in a time zone whose day is not the UTC day at this moment.
const root = path.resolve(__dirname, '..');
const PORT = 3477;
const base = `http://127.0.0.1:${PORT}`;
const zone = new Date().getUTCHours() >= 12 ? 'Pacific/Kiritimati' : 'Etc/GMT+12';   // UTC+14 or UTC-12
const studioDayNow = () => new Date().toLocaleDateString('sv', { timeZone: zone });
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let proc, dir;
const call = async (method, p, body) => {
  const res = await fetch(base + p, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  let json = null;
  try { json = await res.json(); } catch (e) { /* not JSON */ }
  return { status: res.status, body: json };
};
const feed = async () => JSON.stringify((await call('GET', '/api/activity-logs')).body);

beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'crm-cleanup-'));
  proc = spawn(process.execPath, ['server.js'], { cwd: root, stdio: 'ignore',
    env: { ...process.env, PORT: String(PORT), HTTPS_PORT: '0', STUDIO_CRM_TRIAL: '1', STUDIO_CRM_OPEN: '', STUDIO_CRM_UPDATE_FEED: 'http://127.0.0.1:9/no-feed',
      SQLITE_DB_PATH: path.join(dir, 'studio.sqlite'), TZ: zone } });
  for (let i = 0; ; i++) {
    if (await fetch(base).then(() => true, () => false)) break;
    if (i > 80) throw new Error('The CRM did not start');
    await sleep(500);
  }
  await call('POST', '/api/access/skip');
  await sleep(2500);   // the reminder job ran 1.5 seconds after the start
}, 90000);
afterAll(() => { if (proc) proc.kill(); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Windows may still hold the file */ } });

// ---------------------------------------------------------------------------------------------
// JOB A: routes no screen calls, the pretend reminder job, the sample studio on the purchase order
// ---------------------------------------------------------------------------------------------
const REMOVED = `
POST /api/activity-logs/bulk-undo | POST /api/activity-logs/resolve-conflict | DELETE /api/activity-logs/clear
GET /api/clients/search | PATCH /api/clients/1/reassign | POST /api/clients/bulk-update | POST /api/clients/reorder
GET /api/clients/1/full-profile | GET /api/clients/1/history | GET /api/clients/1/compliance-audit
POST /api/clients/1/notes | DELETE /api/clients/1/notes/1
GET /api/appointments/reminders | POST /api/appointments/reminders/trigger | POST /api/reminders/send | GET /api/calendar-events
GET /api/services/types | POST /api/services/types | GET /api/services | POST /api/services | DELETE /api/services/1
GET /api/inventory/suppliers/procurement-analytics | GET /api/procurement/monthly-spending-trends | GET /api/procurement/analytics
GET /api/inventory/csv-template | GET /api/inventory/categories | GET /api/inventory/category-alerts | POST /api/inventory/check-category-alerts
POST /api/inventory/categories | PUT /api/inventory/categories/1 | DELETE /api/inventory/categories/1
GET /api/inventory/critical-stock-alerts | POST /api/inventory/check-low-stock-alerts | POST /api/inventory/bulk-update | POST /api/inventory/reorder
GET /api/inventory/consumption | POST /api/inventory/consumption | GET /api/inventory/forecasting
POST /api/inventory/sterile-audit/send-expiry-alerts | PATCH /api/inventory/1/sterile-lot
GET /api/inventory/suppliers/1/inventory-history | POST /api/inventory/suppliers/1/inventory-history
GET /api/inventory/suppliers/lead-time-trend-alerts | POST /api/inventory/suppliers/check-lead-time-trends | POST /api/inventory/bulk-procurement-po
GET /api/inventory/daily-reorder-digest | POST /api/inventory/daily-reorder-digest/trigger-now | POST /api/inventory/daily-reorder-digest/config
GET /api/inventory/generate-po-from-digest | POST /api/inventory/generate-po-from-digest
GET /api/inventory/template-csv | GET /api/inventory/download-template | POST /api/inventory/suppliers/1/set-primary
GET /api/inventory/supplier-config | POST /api/inventory/supplier-config | GET /api/inventory/po-dispatches | POST /api/inventory/quick-restock
GET /api/inventory/category-thresholds | POST /api/inventory/category-thresholds | POST /api/inventory/category-thresholds/update
GET /api/inventory/periodic-scan-status | POST /api/inventory/run-6h-scan | POST /api/inventory/trigger-periodic-scan
GET /api/financial/dashboard | GET /api/financial/payment-methods | POST /api/financial/payment-methods
PATCH /api/financial/payment-methods/1 | DELETE /api/financial/payment-methods/1 | POST /api/financial/tip-split
GET /api/financials/deposit-splits | POST /api/financials/deposit-splits | GET /api/receipts | POST /api/receipts
GET /api/accounting/config | POST /api/accounting/config | GET /api/accounting/reconciliation-check | POST /api/accounting/reconciliation-audit
GET /api/accounting/ledger-timeseries | POST /api/accounting/connect/quickbooks | POST /api/accounting/sync | POST /api/accounting/bulk-resync
GET /api/accounting/health | GET /api/accounting/journal-preview/1
GET /api/vault | POST /api/vault/upload
GET /api/professionals | POST /api/professionals | PATCH /api/professionals/1 | DELETE /api/professionals/999 | GET /api/professionals/1/clients
POST /api/staff/1/certifications | POST /api/professionals/1/certifications | DELETE /api/staff/1/certifications/1 | DELETE /api/professionals/1/certifications/1
GET /api/staff/1/works
GET /api/disclaimers/templates | GET /api/disclaimers | POST /api/disclaimers | DELETE /api/disclaimers/1
GET /api/aftercare-templates | POST /api/aftercare-templates | PUT /api/aftercare-templates/1 | DELETE /api/aftercare-templates/1
GET /api/aftercare/sent | POST /api/aftercare/send | GET /api/aftercare/pipeline | POST /api/aftercare/pipeline/milestone
GET /api/messenger/announcement | POST /api/messenger/announcement | GET /api/staff-messaging/channels | POST /api/staff-messaging/channels
GET /api/messaging/conversations/1 | POST /api/messaging/business-reply
GET /api/reports/daily-summary | POST /api/gallery/1/like | POST /api/flash/1/like | POST /api/stations/1/sanitize
GET /api/body-maps/1 | GET /api/body-maps | POST /api/body-maps
GET /api/settings | PUT /api/settings | GET /api/settings/vat | PUT /api/settings/vat
GET /api/stations/capacity-matrix | GET /api/stations/hourly-revenue | GET /api/waivers/audit-history | GET /api/audit-logs
`.split(/[|\n]/).map((s) => s.trim()).filter(Boolean).map((s) => s.split(' '));

describe('Job A: routes no screen calls are gone', () => {
  it('each removed address answers 404', async () => {
    const still = [];
    for (const [method, p] of REMOVED) {
      const r = await call(method, p, method === 'GET' || method === 'DELETE' ? undefined : {});
      if (r.status !== 404) still.push(`${method} ${p} -> ${r.status}`);
    }
    expect(still).toEqual([]);
  });
  it('the routes a screen, a tool or a later step uses still answer', async () => {
    for (const p of ['/api/accounting/export/quickbooks', '/api/accounting/export/sage', '/api/scanner/devices', '/api/clients', '/api/staff', '/api/staff/2/clients',
      '/api/clients/1/profile', '/api/inventory', '/api/inventory/suppliers', '/api/inventory/purchase-orders', '/api/financial', '/api/financials/margin-calculator'])
      expect((await call('GET', p)).status, p).toBe(200);
    expect((await call('POST', '/api/clients/import-csv', { rows: [] })).status).not.toBe(404);
    expect((await call('POST', '/api/inventory/import-csv', { rows: [] })).status).not.toBe(404);
    expect((await call('PATCH', '/api/clients/1', { phone: '555-0199' })).status).toBe(200);
  }, 30000);   // listing the scanners starts PowerShell on Windows: over 5 seconds on a cold machine (the Windows runners, 1.0.47)
});

describe('Job A: nothing is logged as a reminder, because none is sent', () => {
  it('the sample appointments of the next 24 hours are not marked "reminder sent"', async () => {
    const appts = (await call('GET', '/api/appointments')).body;
    expect(appts.length).toBeGreaterThan(1);
    expect(appts.filter((a) => a.reminder_sent || a.reminder_sent_at)).toEqual([]);
  });
  it('the activity feed has no reminder line', async () => {
    expect(await feed()).not.toMatch(/REMINDER_SENT|Reminder Engine|Appointment Reminder/);
  });
});

// The server no longer builds a purchase-order PDF at all: the only one it made went into a record no screen read.
describe('Job A: no sample studio on a purchase order', () => {
  it('the sample studio is not written in the server, and the server builds no PDF', () => {
    expect(read('server.js')).not.toMatch(/Studio CRM Headquarters|1042 Art & Tattoo Way|Studio Supply Admin|jsPDF/);
    expect(fs.existsSync(path.join(root, 'src/po-pdf.js'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------------------------
// JOB B: bookings (B6), payments (B7), the studio's day (B9), the studio's currency (B12)
// ---------------------------------------------------------------------------------------------
describe('Job B: bookings are checked', () => {
  const slot = (h, m = 0) => `2031-03-0${1 + Math.floor(h / 24)}T${String(h % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`;
  const book = (over) => call('POST', '/api/appointments', { client_name: 'Booking Test', staff_id: 2, station: 'Station 9', service_type: 'Test', duration_minutes: 60, ...over });
  let first;

  it('a date that is not a date, or no date, is refused', async () => {
    expect((await book({ datetime: 'not-a-date' })).status).toBe(400);
    expect((await book({ datetime: undefined })).status).toBe(400);
    expect((await book({ datetime: '' })).status).toBe(400);
  });
  it('a status outside the list is refused; the list is scheduled, confirmed, completed, cancelled, no-show', async () => {
    expect((await book({ datetime: slot(30), status: 'banana' })).status).toBe(400);
    for (const [i, status] of ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'].entries()) {
      const r = await book({ datetime: slot(30 + 2 * i), staff_id: 3, station: 'Station 8', status });
      expect(r.status, status).toBe(201);
      expect(r.body.status).toBe(status);
    }
  });
  it('a good booking is saved, with its time as a full timestamp', async () => {
    const r = await book({ datetime: '2031-03-01T10:00:00+00:00' });
    expect(r.status).toBe(201);
    expect(r.body.datetime).toBe(slot(10));
    first = r.body;
  });
  it('the same artist at the same time is refused, and says who is in the way', async () => {
    const r = await book({ datetime: slot(10, 30), station: 'Station 7' });
    expect(r.status).toBe(409);
    expect(r.body.conflict.same).toBe('artist');
    expect(r.body.conflict.with.id).toBe(first.id);
    expect(r.body.conflict.with.client_name).toBe('Booking Test');
    expect((await call('GET', '/api/appointments')).body.filter((a) => a.station === 'Station 7')).toEqual([]);
  });
  it('the same station at the same time is refused, for another artist too', async () => {
    const r = await book({ datetime: slot(9, 30), staff_id: 4 });
    expect(r.status).toBe(409);
    expect(r.body.conflict.same).toBe('station');
  });
  it('an artist known by name only is checked the same way', async () => {
    expect((await book({ datetime: slot(60), staff_id: undefined, staff_name: 'Guest Artist', station: '' })).status).toBe(201);
    const r = await book({ datetime: slot(60, 15), staff_id: undefined, staff_name: 'guest artist ', station: '' });
    expect(r.status).toBe(409);
    expect(r.body.conflict.same).toBe('artist');
  });
  it('two bookings with no artist and no station never clash', async () => {
    expect((await book({ datetime: slot(64), staff_id: undefined, station: '' })).status).toBe(201);
    expect((await book({ datetime: slot(64), staff_id: undefined, station: '' })).status).toBe(201);
  });
  it('"book anyway" saves it', async () => {
    const r = await book({ datetime: slot(10, 30), force: true });
    expect(r.status).toBe(201);
    expect(r.body.force).toBeUndefined();
    await call('DELETE', '/api/appointments/' + r.body.id);
  });
  it('the next appointment can start when the first one ends', async () => {
    expect((await book({ datetime: slot(11) })).status).toBe(201);
    expect((await book({ datetime: slot(8), duration_minutes: 120 })).status).toBe(201);
  });
  it('a cancelled appointment does not block the time', async () => {
    const r = await book({ datetime: slot(14) });
    expect((await call('PATCH', `/api/appointments/${r.body.id}/status`, { status: 'cancelled' })).status).toBe(200);
    expect((await book({ datetime: slot(14) })).status).toBe(201);
  });
  it('moving an appointment onto another one is refused; saving it where it is, is fine', async () => {
    const r = await book({ datetime: slot(20) });
    expect((await call('PATCH', '/api/appointments/' + r.body.id, { datetime: slot(10, 15) })).status).toBe(409);
    expect((await call('GET', '/api/appointments')).body.find((a) => a.id === r.body.id).datetime).toBe(slot(20));
    expect((await call('PATCH', '/api/appointments/' + r.body.id, { datetime: slot(20), notes: 'same place' })).status).toBe(200);
    expect((await call('PATCH', '/api/appointments/' + r.body.id, { datetime: 'next tuesday-ish' })).status).toBe(400);
    expect((await call('PATCH', '/api/appointments/' + r.body.id, { datetime: slot(10, 15), force: true })).status).toBe(200);
  });
  it('an appointment that does not exist: 404, and nothing in the activity feed', async () => {
    expect((await call('PATCH', '/api/appointments/987654/status', { status: 'completed' })).status).toBe(404);
    expect((await call('PATCH', `/api/appointments/${first.id}/status`, { status: 'banana' })).status).toBe(400);
    expect((await call('DELETE', '/api/appointments/987654')).status).toBe(404);
    await sleep(300);
    expect(await feed()).not.toContain('987654');
  });
});

describe('Job B: payments are checked', () => {
  const pay = (over) => call('POST', '/api/financial', { amount: 120, method: 'Cash', type: 'payment', ...over });
  it('the amount is a number above 0', async () => {
    for (const amount of [-500, 0, 'abc', '', null, undefined, '12abc', Infinity]) expect((await pay({ amount })).status, String(amount)).toBe(400);
    const before = (await call('GET', '/api/financial')).body.length;
    expect((await pay({ amount: '45.50' })).body.amount).toBe(45.5);
    expect((await call('GET', '/api/financial')).body.length).toBe(before + 1);
  });
  it('a payment needs a method', async () => {
    expect((await pay({ method: undefined })).status).toBe(400);
    expect((await pay({ method: '  ' })).status).toBe(400);
  });
  it('a refund is its own type, with an amount above 0; no other type is taken', async () => {
    expect((await pay({ type: 'banana' })).status).toBe(400);
    const r = await pay({ type: 'refund', amount: 50 });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ type: 'refund', amount: 50 });
    expect((await pay({ type: 'refund', amount: -50 })).status).toBe(400);
    expect((await pay({ type: undefined })).body.type).toBe('payment');
  });
  it('a payment is dated with the studio\'s day, not the day in London', async () => {
    const r = await pay({});
    expect(r.status).toBe(201);
    expect(r.body.transaction_date).toBe(studioDayNow());
  });
});

describe('Job B: one helper for the studio\'s day, and the studio\'s currency', () => {
  it('server.js never cuts the day out of a UTC timestamp', () => {
    expect(read('server.js').match(/toISOString\(\)\s*\.\s*(split\('T'\)\[0\]|slice\(0,\s*10\)|substring\(0,\s*10\))/g) || []).toEqual([]);
  });
  it('no "$" is written in front of an amount, on the server or on a screen', () => {
    const hits = [];
    for (const f of ['server.js', 'public/app-features.js', 'public/index.html', 'public/kiosk.html'])
      read(f).split(/\r?\n/).forEach((line, n) => { if (/\$\$\{|\$['"`]\s*\+/.test(line)) hits.push(`${f}:${n + 1}`); });
    expect(hits).toEqual([]);
  });
  it('the activity feed names a payment in the studio\'s currency', async () => {
    const profile = JSON.stringify({ sample: false, currency: { code: 'EUR', symbol: '€', locale: 'fr-FR' } });
    expect((await call('PUT', '/api/app-data/poli_studio_profile', { value: profile })).status).toBe(200);
    const r = await call('POST', '/api/financial', { amount: 1350.5, method: 'Card' });
    expect(r.status).toBe(201);
    let line = '';
    for (let i = 0; i < 20 && !line; i++) {
      line = ((await call('GET', '/api/activity-logs')).body || []).map((e) => e.title + ' ' + e.details).find((t) => /350,50/.test(t)) || '';
      if (!line) await sleep(200);
    }
    expect(line).toContain('€');
    expect(line).not.toContain('$');
    await call('DELETE', '/api/financial/' + r.body.id);
    await sleep(300);
    expect(await feed()).not.toMatch(/\$1,?350/);
  });
});

// ---------------------------------------------------------------------------------------------
// JOB C: "Delete" a client becomes "Archive" (B8)
// ---------------------------------------------------------------------------------------------
describe('Job C: a client is archived, never deleted', () => {
  let id;
  const names = async (q = '') => (await call('GET', '/api/clients' + q)).body.map((c) => c.name);
  it('archiving hides the client and keeps the appointments', async () => {
    id = (await call('POST', '/api/clients', { name: 'Archive Test Person', email: 'archive.test@example.com' })).body.id;
    const appt = await call('POST', '/api/appointments', { client_id: id, service_type: 'Test', datetime: '2031-05-01T10:00:00.000Z' });
    expect(appt.status).toBe(201);
    expect((await call('DELETE', '/api/clients/' + id)).status).toBe(200);
    expect(await names()).not.toContain('Archive Test Person');
    expect(await names('?q=archive')).not.toContain('Archive Test Person');
    const profile = await call('GET', `/api/clients/${id}/profile`);
    expect(profile.status).toBe(200);
    expect(profile.body.client.archived).toBe(true);
    expect(profile.body.client.archived_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(profile.body.appointments.map((a) => a.id)).toEqual([appt.body.id]);
    expect((await call('GET', '/api/appointments')).body.find((a) => a.id === appt.body.id).client_name).toBe('Archive Test Person');
  });
  it('the archived clients have their own list', async () => {
    expect(await names('?archived=1')).toEqual(['Archive Test Person']);
  });
  it('archiving twice changes nothing; a client who does not exist is a 404', async () => {
    const at = (await call('GET', `/api/clients/${id}`)).body.archived_at;
    expect((await call('DELETE', '/api/clients/' + id)).status).toBe(200);
    expect((await call('GET', `/api/clients/${id}`)).body.archived_at).toBe(at);
    expect((await call('DELETE', '/api/clients/987654')).status).toBe(404);
    expect((await call('POST', '/api/clients/987654/restore')).status).toBe(404);
  });
  it('an edit cannot archive or restore by the back door', async () => {
    expect((await call('PATCH', '/api/clients/' + id, { archived: false, phone: '555-0177' })).status).toBe(200);
    expect(await names()).not.toContain('Archive Test Person');
    await call('PATCH', '/api/clients/1', { archived: true });
    expect((await call('GET', '/api/clients')).body.some((c) => c.id === 1)).toBe(true);
  });
  it('restoring brings the client back', async () => {
    const r = await call('POST', `/api/clients/${id}/restore`);
    expect(r.status).toBe(200);
    expect(await names()).toContain('Archive Test Person');
    expect(await names('?archived=1')).toEqual([]);
    const c = (await call('GET', `/api/clients/${id}`)).body;
    expect(c.archived).toBeFalsy();
    expect(c.phone).toBe('555-0177');
  });
  it('the activity feed says archived and restored, never deleted', async () => {
    await sleep(300);
    const lines = ((await call('GET', '/api/activity-logs')).body || []).filter((e) => /Archive Test Person/.test(e.title + e.details)).map((e) => e.action);
    expect(lines).toContain('ARCHIVED');
    expect(lines).toContain('RESTORED');
    expect(lines).not.toContain('DELETED');
  });
});
