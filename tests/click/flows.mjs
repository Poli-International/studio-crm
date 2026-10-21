// The jobs a studio does every day, done with real mouse clicks in a real
// browser: add, open, edit and delete a client; add, edit and remove staff;
// export files; clock in; import a CSV; fill, sign and save the tablet form.
// Each step fails loudly, so a button that stops working blocks the release.
//
//   node tests/click/flows.mjs
import { startApp, startFreshServer } from './app.mjs';
import { sleep, launchBrowser } from './cdp.mjs';
import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';

// "GitHub" for the Updates card: a newer version is out
const feed = http.createServer((req, res) => res.end(JSON.stringify({ tag_name: 'v9.9.9', html_url: 'https://example.invalid/notes',
  assets: [{ name: 'studio-crm-windows-x64.zip', browser_download_url: 'http://127.0.0.1:9/zip' }] }))).listen(0, '127.0.0.1');
await new Promise((r) => feed.on('listening', r));
feed.unref();
process.env.STUDIO_CRM_UPDATE_FEED = 'http://127.0.0.1:' + feed.address().port + '/';
process.env.STUDIO_CRM_FAKE_SCANNER = '1'; // a pretend scanner for the form builder's Scanner field (src/scanner.js)

const { browser: b, url, httpsPort, stop, restart } = await startApp();
const failures = [];
const text = (sel) => b.evaluate(`(document.querySelector(${JSON.stringify(sel)}) || {}).innerText || ''`);
const shown = (id) => b.evaluate(`getComputedStyle(document.getElementById(${JSON.stringify(id)})).display !== 'none'`);
const api = (path) => b.evaluate(`fetch(${JSON.stringify(path)}).then(r => r.json())`);
const rowButton = (rowSel, rowText, label) => b.evaluate(`(() => { const row = [...document.querySelectorAll(${JSON.stringify(rowSel)})].find(r => r.innerText.includes(${JSON.stringify(rowText)})); const el = row && [...row.querySelectorAll('button')].find(x => x.innerText.trim() === ${JSON.stringify(label)}); return el ? window.__ct.key(el) : null; })()`);
function check(ok, what) { if (!ok) throw new Error(what); }
// for something the app shows a moment after the click: looks again for five seconds
async function eventually(fn, what, seconds = 5) {
  for (let i = 0; i < seconds * 5; i++) { if (await fn()) return; await sleep(200); }
  throw new Error(typeof what === 'function' ? await what() : what);
}
// clicks the visible button that runs the given onclick code
async function pressOn(onclick) {
  const key = await b.evaluate(`(() => { const el = window.__ct.all().find(e => (e.getAttribute('onclick') || '').trim() === ${JSON.stringify(onclick)}); return el ? window.__ct.key(el) : null; })()`);
  const t = key && await b.click(key);
  check(t && !t.covered, `the button for ${onclick} ` + (t ? 'is covered by ' + t.covered : 'is not on the screen'));
}
// clicks a button found in a table row, and says why when it cannot be clicked
async function press(rowSel, rowText, label) {
  const t = await b.click(await rowButton(rowSel, rowText, label));
  check(t && !t.covered, `"${label}" for ${rowText} ` + (t ? 'is covered by ' + t.covered : 'is not on the screen'));
}

async function flow(name, fn) {
  if (process.env.FLOW && !name.includes(process.env.FLOW)) return;
  b.reset();
  try {
    await b.goto(url);
    await fn();
    check(!b.seen.errors.length, 'script error: ' + b.seen.errors[0]);
    console.log('ok    ' + name);
  } catch (e) {
    failures.push(name);
    // what the page was doing, for whoever reads the log
    console.log('      ' + await b.evaluate(`JSON.stringify({ open: window.__ct.overlays(), calls: window.__ct.sig.fetches.slice(-6).map(f => f.method + ' ' + f.url + ' ' + f.status), said: window.__ct.sig.added.slice(-3), lastClick: window.__ct.sig.lastClick, refused: window.__ct.sig.refused })`).catch(() => ''));
    console.log('FAIL  ' + name + '\n      ' + e.message);
  }
}

// The studio's details, as a studio enters them once in Settings: the consent forms' studio fields are
// required and come from them (they held sample "Poli International" details before 1.0.19)
await b.goto(url);
await b.evaluate(`fetch('/api/app-data/poli_studio_profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: JSON.stringify({ studioName: 'Click Test Studio', studioAddress: '1 Test Street', studioPhone: '555-0100', studioPermit: 'TEST-1' }) }) })`);

await flow('New Client opens the form, saves, and the client is listed', async () => {
  await b.clickText('Clients');
  await b.clickText('New Client');
  check(await shown('new-client-modal-overlay'), 'New Client did not open the new client form');
  await b.type('#new-client-name', 'Flow Client');
  await b.type('#new-client-email', 'flow@example.com');
  await b.clickText('Save client');
  check(!(await shown('new-client-modal-overlay')), 'the form stayed open after Save client');
  await eventually(async () => (await text('#clients-table-tbody')).includes('Flow Client'), 'the new client is not in the list');
});

await flow('View Profile opens the profile, every tab shows, and it closes', async () => {
  await b.clickText('Clients');
  await press('.client-directory-row', 'Flow Client', 'View Profile');
  check(await shown('client-profile-modal-overlay'), 'View Profile opened nothing');
  check((await text('#client-profile-name')) === 'Flow Client', 'the profile shows the wrong client');
  for (const tab of ['Staff notes', 'Appointments', 'Waivers', 'Work and photos', 'Overview']) {
    await b.clickText(tab, '#client-profile-modal-overlay');
    check((await text('#client-profile-modal-body')).trim().length > 20, `the ${tab} tab is empty`);
  }
  await b.clickText('×', '#client-profile-modal-overlay');
  check(!(await shown('client-profile-modal-overlay')), 'the profile cannot be closed');
});

await flow('Work and photos: a photo taken or chosen on the device is added to the client, and deleted', async () => {
  // Henry, 2026-10-19: the profile only had a box for an image address
  const client = await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Photo Flow Client' }) }).then(r => r.json())`);
  await b.clickText('Clients');
  await eventually(async () => (await text('#clients-table-tbody')).includes('Photo Flow Client'), 'the client is not listed');
  await press('.client-directory-row', 'Photo Flow Client', 'View Profile');
  await b.clickText('Work and photos', '#client-profile-modal-overlay');
  await eventually(async () => b.evaluate(`!!document.getElementById('tw-photo-input')`), 'there is no photo button in Work and photos');
  check(!(await b.evaluate(`!!document.getElementById('tw-url-input')`)), 'Work and photos still asks for an image address');
  await b.clickText('Take or choose a photo', '#client-profile-modal-overlay');
  // what the camera or the device's pictures hand back
  await b.evaluate(`(async () => { const c = document.createElement('canvas'); c.width = 40; c.height = 30; const g = c.getContext('2d'); g.fillStyle = '#208040'; g.fillRect(0, 0, 40, 30);
    const blob = await new Promise((r) => c.toBlob(r, 'image/png')); const dt = new DataTransfer(); dt.items.add(new File([blob], 'stencil.png', { type: 'image/png' }));
    const input = document.getElementById('tw-photo-input'); input.files = dt.files; input.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await eventually(async () => b.evaluate(`!!document.querySelector('#tw-photo-preview img')`), 'the photo chosen is not shown');
  await b.type('#tw-title-input', 'Flow Stencil Photo');
  await b.type('#tw-notes-input', 'Flow photo notes');
  await b.clickText('Add to Client Gallery', '#client-profile-modal-overlay');
  await eventually(async () => (await text('#client-profile-modal-body')).includes('Flow Stencil Photo'), 'the photo was not added to the client');
  check(await b.evaluate(`[...document.querySelectorAll('#client-profile-modal-body img')].some(i => i.src.startsWith('data:image/') && i.alt === 'Flow Stencil Photo')`), 'the photo shown is not the one taken');
  check((await text('#client-profile-modal-body')).includes('Flow photo notes'), 'the notes were not kept');
  const work = (await api('/api/clients/' + client.id + '/profile')).tattoo_work || [];
  check(work.some((w) => w.title === 'Flow Stencil Photo' && !w.artist.includes('Jaxon')), 'the photo is credited to a sample artist');
  await press('.gallery-card-interactive', 'Flow Stencil Photo', 'Delete');
  await eventually(async () => !(await text('#client-profile-modal-body')).includes('Flow Stencil Photo'), 'Delete did not remove the photo');
  await b.clickText('×', '#client-profile-modal-overlay');
});

await flow('Two quick taps on Save make one client, not two', async () => {
  await b.goto(url);
  await b.clickText('Clients');
  await b.clickText('New Client');
  await b.type('#new-client-name', 'Double Tap');
  await b.evaluate(`(() => { const btn = [...document.querySelectorAll('#new-client-modal-overlay button')].find(x => /Save client/.test(x.innerText)); btn.click(); btn.click(); })()`);
  await sleep(1500);
  const copies = (await api('/api/clients')).filter((c) => c.name === 'Double Tap');
  check(copies.length === 1, `two taps saved ${copies.length} clients`);
  await b.evaluate(`fetch('/api/clients/${copies[0] && copies[0].id}', { method: 'DELETE' })`);
});

await flow('On a phone, nothing is cut off on any screen', async () => {
  await b.phone();
  try {
    for (const dest of ['dashboard', 'clients', 'calendar', 'inventory', 'compliance', 'finance', 'tools', 'settings']) {
      await b.goto(url);
      await b.evaluate(`navigateToDestination('${dest}')`);
      await sleep(400);
      // past the right edge, shown, and not inside a box that scrolls sideways: no finger can reach it
      const cut = await b.evaluate(`(() => { const v = innerWidth;
        const scrolls = (e) => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if ((o === 'auto' || o === 'scroll') && p.getBoundingClientRect().right <= v + 2) return true; } return false; };
        const seen = (e) => { for (let p = e; p; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; };
        return [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.left < v && r.right > v + 2 && getComputedStyle(e).position !== 'fixed' && seen(e) && !scrolls(e); })
          .filter((e, i, all) => !all.some(o => o !== e && o.contains(e))).map(e => e.id || e.tagName).slice(0, 3); })()`);
      check(!cut.length, `${dest}: cut off on a phone: ${cut.join(', ')}`);
    }
  } finally { await b.desktop(); }
});

await flow('Edit client saves the change; Delete removes the client', async () => {
  await b.clickText('Clients');
  await press('.client-directory-row', 'Flow Client', 'View Profile');
  await b.clickText('Edit client');
  check((await b.evaluate(`document.getElementById('new-client-name').value`)) === 'Flow Client', 'the edit form is not filled with the client');
  await b.type('#new-client-phone', '555-7777');
  await b.clickText('Save changes');
  await eventually(async () => (await text('#client-profile-tags')).includes('555-7777'), 'the profile does not show the edited phone');
  await eventually(async () => (await api('/api/clients')).some((c) => c.name === 'Flow Client' && c.phone === '555-7777'), 'the edit was not saved');
  await b.clickText('Delete', '#client-profile-modal-overlay');
  await eventually(async () => !(await api('/api/clients')).some((c) => c.name === 'Flow Client'), 'the client was not deleted');
});

await flow('Staff: add, edit, select and remove a team member', async () => {
  await b.clickText('Staff Login');
  await eventually(async () => (await text('#staff-list-body')).includes('Select'), 'the staff list is empty');
  await b.clickText('Add staff member');
  await b.type('#staff-form-name', 'Flow Artist');
  await b.clickText('Save staff member');
  await eventually(async () => (await text('#staff-list-body')).includes('Flow Artist'), 'the new staff member is not listed');
  await press('.staff-row', 'Flow Artist', 'Edit');
  await b.type('#staff-form-name', 'Flow Piercer');
  await b.clickText('Save staff member');
  await eventually(async () => (await api('/api/staff')).some((s) => s.name === 'Flow Piercer'), 'the staff edit was not saved');
  await press('.staff-row', 'Flow Piercer', 'Select');
  check((await text('#topbar-user-name')) === 'Flow Piercer', 'Select did not change the name in the top bar');
  check((await b.evaluate(`[...document.getElementById('new-appt-artist').options].map(o => o.textContent).join()`)).includes('Flow Piercer'), 'the new staff member cannot be chosen for an appointment');
  await press('.staff-row', 'Flow Piercer', 'Remove');
  await eventually(async () => !(await api('/api/staff')).some((s) => s.name === 'Flow Piercer'), 'the staff member was not removed');
  await b.clickText('×', '#staff-login-modal-overlay');
  check(!(await shown('staff-login-modal-overlay')), 'the staff window cannot be closed');
});

await flow('Shift rota: add a shift, export it as CSV and PDF, remove it', async () => {
  await b.clickText('Calendar');
  // the demo rota has shifts of its own: this one is told apart by its station
  await b.evaluate(`document.getElementById('rota-date').value = new Date().toLocaleDateString('en-CA')`);
  await b.evaluate(`document.getElementById('rota-station').value = 'Flow Station'`);
  await b.clickText('Add shift');
  await eventually(async () => (await text('#shift-roster-tbody')).includes('Flow Station'), 'the shift is not in the rota');
  for (const [button, file] of [['Download as CSV', 'shift_roster.csv'], ['Export Formatted PDF', 'shift_roster.pdf']]) {
    await b.clickText('Export Shift Roster');
    await b.clickText(button);
    await sleep(1000);
    check(b.seen.downloads.includes(file), `${button} said it exported, but no ${file} was downloaded`);
  }
  await press('#shift-roster-tbody tr', 'Flow Station', 'Remove');
  await eventually(async () => !(await text('#shift-roster-tbody')).includes('Flow Station'), 'the shift was not removed');
});

await flow('Staff shifts: clock in shows on shift, clock out, and the window closes', async () => {
  await b.clickText('Calendar');
  await b.clickText('Staff Shifts');
  await b.clickText('Clock in', '#shift-modal');
  await eventually(async () => (await text('#shift-status-text')).startsWith('On shift'), 'the status did not change after clocking in');
  await b.clickText('Clock out', '#shift-modal');
  check((await text('#shift-status-text')) === 'Off shift', 'the status did not change after clocking out');
  // one button clocks in and out: a double tap must not clock in and straight back out
  await b.evaluate(`(() => { const btn = document.getElementById('shift-toggle-btn'); btn.click(); btn.click(); })()`);
  await eventually(async () => (await text('#shift-status-text')).startsWith('On shift'), 'a double tap on Clock in left the person off shift');
  await sleep(800);
  check((await text('#shift-status-text')).startsWith('On shift'), 'a double tap on Clock in clocked in and straight back out');
  await b.clickText('Clock out', '#shift-modal');
  await b.clickText('×', '#shift-modal');
  check(!(await shown('shift-modal')), 'the shift window cannot be closed');
});

await flow('A waiver signed in the profile can be read back and downloaded', async () => {
  // a client with no waiver yet, as in Henry's report
  await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Waiver Flow' }) })`);
  await b.goto(url);
  await b.clickText('Clients');
  await press('.client-directory-row', 'Waiver Flow', 'View Profile');
  await b.clickText('Waivers', '#client-profile-modal-overlay');
  await b.clickText('Open', '#client-profile-modal-overlay');
  check((await b.evaluate(`document.getElementById('waiver-client-search').value`)) === 'Waiver Flow', 'the signing window does not know which client it is for');
  await b.type('#waiver-service-input', 'Helix piercing');
  await b.scribble('#waiver-sig-canvas');
  await b.clickText('Sign & Log Waiver', '#waiver-modal');
  await eventually(async () => (await api('/api/waivers')).some((w) => w.client_name === 'Waiver Flow' && w.signature), 'the waiver was not saved');
  await b.goto(url);
  await b.clickText('Clients');
  await press('.client-directory-row', 'Waiver Flow', 'View Profile');
  await b.clickText('Waivers', '#client-profile-modal-overlay');
  await b.clickText('View waiver');
  await eventually(async () => (await text('#waiver-record-modal-overlay')).includes('Helix piercing'), 'View waiver does not show the signed waiver');
  check(await b.evaluate(`!!document.querySelector('#waiver-record-modal-overlay img[alt="Client signature"]')`), 'the signature is not shown');
  b.reset();
  await b.clickText('Download PDF');
  await eventually(async () => b.seen.downloads.some((d) => d.endsWith('.pdf')), 'Download PDF made no file');
});

await flow('Health Alerts: View Profile opens the profile in front', async () => {
  await b.goto(url);
  await b.clickText('Clients');
  await pressOn('openClientDirectoryModal()');
  // the client list behind has a View Profile button with the same label and action: name this one
  await b.evaluate(`[...document.querySelectorAll('#client-directory-modal-overlay button')].find(x => /View Profile/.test(x.innerText)).id = 'alerts-view-profile'`);
  const t = await b.click(await b.evaluate(`window.__ct.key(document.getElementById('alerts-view-profile'))`));
  check(t && !t.covered, 'View Profile in Health Alerts cannot be clicked');
  await sleep(500);
  const front = await b.evaluate(`(() => { const r = document.getElementById('client-profile-name').getBoundingClientRect(); return document.getElementById('client-profile-modal-overlay').contains(document.elementFromPoint(r.left + 5, r.top + r.height / 2)); })()`);
  check(front, 'the profile opened behind the alerts window');
});

await flow('Health Alerts: the search box, Latex Allergy and Medical Flags narrow the list', async () => {
  for (const c of [{ name: 'Alertflow Latex', allergies: 'Latex gloves' }, { name: 'Alertflow Heart', allergies: 'None', medical_history: 'Heart condition' }, { name: 'Alertflow Clear', allergies: 'None', medical_history: 'None' }])
    await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(c))} }).then(r => r.status)`);
  await b.goto(url);
  await b.clickText('Clients');
  await pressOn('openClientDirectoryModal()');
  const listed = () => b.evaluate(`[...document.querySelectorAll('#client-directory-modal-body strong')].map(s => s.innerText).filter(n => n.startsWith('Alertflow')).sort().join(',')`);
  const expect = async (want, what) => eventually(async () => (await listed()) === want, async () => what + ': listed ' + (await listed()));
  await b.type('#client-directory-search-input', 'alertflow');
  await expect('Alertflow Clear,Alertflow Heart,Alertflow Latex', 'the search lists all three');
  check(/Allergy: Latex gloves/.test(await text('#client-directory-modal-body')), 'the latex allergy is not shown on the client');
  await b.evaluate(`document.getElementById('client-directory-latex-filter').click()`);
  await expect('Alertflow Latex', 'Latex Allergy');
  await b.evaluate(`document.getElementById('client-directory-latex-filter').click()`);
  await b.evaluate(`document.getElementById('client-directory-medical-filter').click()`);
  await expect('Alertflow Heart,Alertflow Latex', 'Medical Flags');
  await b.type('#client-directory-search-input', 'heart');
  await expect('Alertflow Heart', 'search plus Medical Flags');
  await b.type('#client-directory-search-input', 'zzzq');
  await eventually(async () => /No client matches/.test(await text('#client-directory-modal-body')), 'no "No client matches" for a search that finds nobody');
});

await flow('Record Payment saves a payment', async () => {
  await b.goto(url);
  await b.clickText('Finance');
  const before = (await api('/api/financial')).length;
  await pressOn('openQuickRecordPaymentModal()');
  await b.type('#record-payment-amount', '50');
  await b.clickText('Save payment');
  await eventually(async () => (await api('/api/financial')).length === before + 1, 'Record Payment saved nothing');
  check(!(await b.evaluate(`getComputedStyle(document.getElementById('deposit-ledger-modal-overlay')).display !== 'none'`)), 'Record Payment opened the deposit ledger');
});

await flow('Book an appointment for a client picked from the list, then edit it', async () => {
  await b.goto(url);
  await b.clickText('Calendar');
  await pressOn('openQuickNewAppointmentModal()');
  // a slow studio computer: the client list answers late, after the client is picked (macOS runners
  // showed the answers for "Alex R", "Alex Ri"... clearing the pick, so the booking had no client)
  await b.evaluate(`(() => { const f = window.fetch; let n = 0; window.fetch = (u, o) => String(u).endsWith('/api/clients') ? new Promise((r) => setTimeout(r, 300 + 700 * n++)).then(() => f(u, o)) : f(u, o); })()`);
  await b.type('#new-appt-client', 'Alex Riv');
  await eventually(async () => (await text('#new-appt-client-autocomplete-dropdown')).includes('Alex Rivera'), 'typing a name does not offer the existing client');
  // the suggestion is picked with the mouse, as a person does
  const pick = await b.evaluate(`(() => { const row = [...document.querySelectorAll('#new-appt-client-autocomplete-dropdown [data-id]')].find(r => r.innerText.includes('Alex Rivera')); const r = row.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: row.dataset.id }; })()`);
  await b.evaluate(`document.querySelector('#new-appt-client-autocomplete-dropdown [data-id="${pick.id}"]').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))`);
  check((await b.evaluate(`document.getElementById('new-appt-client-id').value`)) === pick.id, 'picking the client did not choose them');
  await sleep(2500); // every late answer is in
  check((await b.evaluate(`document.getElementById('new-appt-client-id').value`)) === pick.id, 'a late answer for an earlier letter forgot the client picked');
  await b.evaluate(`(() => { const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); }; set('new-appt-date', '2031-03-04'); set('new-appt-time', '11:00'); set('new-appt-notes', 'Edit check'); })()`);
  await b.clickText('Book appointment', '#new-appointment-modal-overlay');
  let appt;
  await eventually(async () => { appt = (await api('/api/appointments')).find((a) => a.notes === 'Edit check'); return !!appt; }, 'the appointment was not booked');
  check(String(appt.client_id) === pick.id, 'the booking is not linked to the client picked from the list: ' + JSON.stringify({ saved: appt.client_id, name: appt.client_name, picked: pick.id, field: await b.evaluate(`document.getElementById('new-appt-client-id').value`) }));
  // Edit: change the deposit
  await b.goto(url);
  await b.clickText('Calendar');
  await press('.appointment-row', 'Mar 4, 2031', 'Edit');
  check((await text('#new-appt-title')) === 'Edit Appointment', 'Edit did not open the appointment');
  check((await b.evaluate(`document.getElementById('new-appt-notes').value`)) === 'Edit check', 'Edit opened another appointment');
  await b.type('#new-appt-price', '200');
  await b.type('#new-appt-deposit', '75');
  await b.clickText('Save changes', '#new-appointment-modal-overlay');
  await eventually(async () => Number((await api('/api/appointments')).find((a) => a.id === appt.id).deposit_paid) === 75, 'the change was not saved');
  check((await api('/api/appointments')).filter((a) => a.notes === 'Edit check').length === 1, 'Save changes booked a second appointment');
  // the deposit and what is still to pay, at a glance in the list
  await eventually(async () => { const row = await b.evaluate(`[...document.querySelectorAll('.appointment-row')].find(r => r.innerText.includes('Mar 4, 2031'))?.innerText || ''`); return row.includes('75.00') && row.includes('125.00'); }, 'the list does not show the deposit and the amount still to pay');
  // Henry, 2026-10-17: Completed left "Total spent" unchanged. It offers the payment, filled in with the client and price.
  const spentBefore = (await api(`/api/clients/${pick.id}/profile`)).stats.totalSpend;
  await press('.appointment-row', 'Mar 4, 2031', 'Completed');
  await eventually(async () => shown('record-payment-modal-overlay'), 'Completed does not offer to record the payment');
  check((await b.evaluate(`document.getElementById('record-payment-amount').value`)) === '200.00', 'the payment is not filled in with the price');
  check((await b.evaluate(`document.getElementById('record-payment-client').value`)) === pick.id, 'the payment is not filled in with the client');
  await b.clickText('Save payment', '#record-payment-modal-overlay');
  await eventually(async () => (await api(`/api/clients/${pick.id}/profile`)).stats.totalSpend === spentBefore + 200, 'the client\'s total spent did not go up');
  // the profile shows the deposit, the balance and the staff note of each appointment
  await b.evaluate(`openClientProfileModal(${pick.id})`);
  await sleep(1200);
  await b.evaluate(`switchClientProfileTab('appointments')`);
  await eventually(async () => { const t = await text('#client-profile-modal-body'); return t.includes('Deposit paid: $75.00') && t.includes('Balance: $125.00') && t.includes('Edit check'); }, 'the profile does not show the deposit, balance and note');
  // Henry looked for the appointment's note under Staff Notes: it is there too, saying where it came from
  await b.evaluate(`switchClientProfileTab('notes')`);
  await eventually(async () => { const t = await text('#client-profile-modal-body'); return t.includes('Edit check') && t.includes('From appointment'); }, 'the appointment note is not in Staff Notes');
  await b.evaluate(`closeClientProfileModal()`);
});

await flow('Healing Pipeline lists the clients of completed sessions, with a PDF', async () => {
  const [client] = await api('/api/clients');
  const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();
  const appt = await b.evaluate(`fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: ${client.id}, service_type: 'Pipeline Check', datetime: '${fiveDaysAgo}' }) }).then(r => r.json())`);
  await b.evaluate(`fetch('/api/appointments/${appt.id}/status', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'completed' }) })`);
  await b.goto(url);
  await b.clickText('Clients');
  await pressOn('openAftercarePipelineModal()');
  await eventually(async () => (await b.evaluate(`[...document.querySelectorAll('#aftercare-pipeline-modal-body .pipeline-group')].find(g => g.innerText.startsWith('Days 4 to 14'))?.innerText || ''`)).includes('Pipeline Check'),
    'the client of a session completed five days ago is not under Days 4 to 14');
  check(!(await text('#aftercare-pipeline-modal-body')).includes('Saline Soak'), 'the pipeline still shows sample figures');
  b.reset();
  await b.clickText('Download PDF', '#aftercare-pipeline-modal-body');
  await eventually(async () => b.seen.downloads.some((d) => d.endsWith('.pdf')), 'the pipeline PDF was not made');
  await press('#aftercare-pipeline-modal-body .pipeline-client', 'Pipeline Check', 'View Profile');
  await eventually(async () => (await text('#client-profile-name')) === client.name, 'View Profile did not open the client');
});

await flow('Inventory: add a stock item by hand, find it, edit it', async () => {
  await b.goto(url);
  await b.clickText('Inventory');
  await b.clickText('+ Add item');
  await b.type('#inventory-item-name', 'Flow Black Ink 8oz');
  await b.type('#inventory-item-quantity', '5');
  await b.type('#inventory-item-reorder_point', '10');
  await b.type('#inventory-item-supplier', 'Flow Supplies');
  await b.clickText('Add item', '#inventory-item-modal-overlay');
  let item;
  await eventually(async () => { const list = await api('/api/inventory'); item = (Array.isArray(list) ? list : list.items).find((i) => i.name === 'Flow Black Ink 8oz'); return !!item; }, 'the item was not added');
  await b.type('#inventory-items-search', 'Flow Black');
  await eventually(async () => (await b.evaluate(`document.querySelectorAll('.inventory-item-row').length`)) === 1, 'the search does not find the new item alone');
  await press('.inventory-item-row', 'Flow Black Ink 8oz', 'Edit');
  check((await b.evaluate(`document.getElementById('inventory-item-supplier').value`)) === 'Flow Supplies', 'Edit did not open the item');
  await b.type('#inventory-item-quantity', '20');
  await b.clickText('Save changes', '#inventory-item-modal-overlay');
  await eventually(async () => { const list = await api('/api/inventory'); return Number((Array.isArray(list) ? list : list.items).find((i) => i.id === item.id).quantity) === 20; }, 'the change was not saved');
});

await flow('Suppliers: add one by hand and edit it; nothing is made up', async () => {
  await b.goto(url);
  await b.clickText('Inventory');
  await b.clickText('+ Add supplier');
  await b.type('#supplier-name', 'Flow Pigments Ltd');
  await b.type('#supplier-phone', '555-0100');
  await b.clickText('Add supplier', '#supplier-modal-overlay');
  let sp;
  await eventually(async () => { sp = (await api('/api/inventory/suppliers')).find((x) => x.name === 'Flow Pigments Ltd'); return !!sp; }, 'the supplier was not added');
  check(!sp.order_email && !sp.email, 'an email address was invented for the supplier: ' + (sp.order_email || sp.email));
  await press('.supplier-row', 'Flow Pigments Ltd', 'Edit');
  check((await b.evaluate(`document.getElementById('supplier-phone').value`)) === '555-0100', 'Edit did not open the supplier');
  await b.type('#supplier-order_email', 'orders@flowpigments.example');
  await b.clickText('Save changes', '#supplier-modal-overlay');
  await eventually(async () => (await api('/api/inventory/suppliers')).find((x) => x.id === sp.id).order_email === 'orders@flowpigments.example', 'the change was not saved');
});

await flow('Removing an appointment also updates the dashboard count', async () => {
  const [client] = await api('/api/clients');
  const [staff] = await api('/api/staff');
  const when = new Date(Date.now() + 3600000);
  if (when.getDate() !== new Date().getDate()) when.setTime(Date.now()); // late evening: keep it today
  await b.evaluate(`fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: ${client.id}, staff_id: ${staff.id}, service_type: 'Count Check', datetime: '${when.toISOString()}', duration_minutes: 60 }) })`);
  await b.goto(url);
  const today = async () => parseInt(await text('#kpi-revenue-sub'), 10);
  await eventually(async () => (await today()) >= 1, 'the dashboard does not count the appointment booked for today');
  const before = await today();
  await b.clickText('Calendar');
  await press('.appointment-row', 'Count Check', 'Remove');
  await b.clickText('Dashboard');
  await eventually(async () => (await today()) === before - 1, async () => `the dashboard still counts ${await today()} appointments today after one was removed (was ${before})`);
});

await flow('Duration Analytics opens and closes', async () => {
  await b.clickText('Calendar');
  await b.clickText('Duration Analytics');
  check(await shown('session-duration-report-modal-overlay'), 'Duration Analytics opened nothing');
  await b.clickText('×', '#session-duration-report-modal-overlay');
  check(!(await shown('session-duration-report-modal-overlay')), 'the report cannot be closed');
});

await flow('Dashboard: Export CSV downloads the activity log', async () => {
  await b.clickText('Export CSV');
  await b.clickText('Download as CSV');
  await sleep(1000);
  check(b.seen.downloads.includes('activity_log.csv'), 'Export CSV made no file');
});

await flow('Inventory: Export Manifest downloads a CSV and a PDF', async () => {
  await b.clickText('Inventory');
  for (const [button, file] of [['Download as CSV', 'inventory_manifest.csv'], ['Export Formatted PDF', 'inventory_manifest.pdf']]) {
    await b.clickText('Export Manifest');
    await b.clickText(button);
    await sleep(1000);
    check(b.seen.downloads.includes(file), `${button} said it exported, but no ${file} was downloaded`);
  }
});

await flow('Import Data: the window closes, and pasted rows become clients', async () => {
  await b.clickText('Settings');
  await b.clickText('Import Data');
  await b.clickText('×', '#import-modal');
  check(!(await shown('import-modal')), 'the import window cannot be closed');
  await b.clickText('Import Data');
  await b.type('#import-csv-text', 'name,email,phone\nCsv Flow,csv.flow@example.com,555-1212\n"Flow, Second",second@example.com,');
  await b.clickText('Import CSV Rows');
  const clients = await api('/api/clients');
  check(clients.some((c) => c.name === 'Csv Flow' && c.email === 'csv.flow@example.com'), 'the pasted row was not imported');
  check(clients.some((c) => c.name === 'Flow, Second' && !c.phone), 'a quoted name was not imported as written');
  check(new Set(clients.map((c) => c.id)).size === clients.length, 'two clients share an id after the import');
});

await flow('CSV auto-sync: off on a new install, its addresses saved on the server, kept after a restart', async () => {
  // the sync said ACTIVE on every new install, and Save Config kept the addresses in the browser only
  check((await api('/api/sync/status')).enabled === false, 'a new install starts with the CSV sync on');
  await b.clickText('Settings');
  await eventually(async () => (await text('#settings-sync-status-badge')).includes('off'), async () => 'Settings does not say the sync is off: ' + await text('#settings-sync-status-badge'));
  await b.clickText('Import Data');
  await b.clickText('Remote CSV Auto-Sync');
  await eventually(async () => (await text('#sync-badge-status')).includes('off'), async () => 'the sync window does not say the sync is off: ' + await text('#sync-badge-status'));
  check(!(await b.evaluate(`document.getElementById('sync-enabled-cb').checked`)), 'the sync window shows the sync on');
  await b.type('#sync-clients-url', 'http://127.0.0.1:9/clients.csv');
  await b.evaluate(`document.getElementById('sync-enabled-cb').click()`); // a tick box: the click helper presses buttons only
  await b.clickText('Save Config');
  await eventually(async () => { const s = await api('/api/sync/status'); return s.enabled && s.clientsUrl === 'http://127.0.0.1:9/clients.csv'; }, async () => 'Save Config did not reach the server: ' + JSON.stringify(await api('/api/sync/status')).slice(0, 160));
  await restart();
  await b.goto(url);
  const after = await api('/api/sync/status');
  check(after.enabled && after.clientsUrl === 'http://127.0.0.1:9/clients.csv', 'a restart lost the CSV sync settings: ' + JSON.stringify(after).slice(0, 160));
  await b.clickText('Settings');
  await eventually(async () => (await text('#settings-sync-status-badge')).includes('on'), 'Settings does not say the sync is on');
  await b.evaluate(`fetch('/api/sync/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: false, clientsUrl: '' }) })`);
});

await flow('CSV: a blank cell is left blank, never filled in or written over an existing value', async () => {
  // the sync gave a client allergies "None" and birth date 1990-01-01, and a blank quantity set stock to 10;
  // the stock import set a blank price to 15.00 on an item that had its own
  const post = (p, body) => b.evaluate(`fetch(${JSON.stringify(p)}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(body))} }).then(r => r.json())`);
  await post('/api/inventory/import-csv', { rows: [{ name: 'Blank Cell Ink', quantity: '7', price: '22.50', reorder_point: '3', category: 'Inks' }] });
  await post('/api/inventory/import-csv', { rows: [{ name: 'Blank Cell Ink', quantity: '', price: '', reorder_point: '', category: '' }] });
  const ink = (await api('/api/inventory')).find((i) => i.name === 'Blank Cell Ink');
  check(ink && ink.quantity === 7 && ink.price === 22.5 && ink.reorder_point === 3 && ink.item_type === 'Inks', 'blank cells in the stock import changed the item: ' + JSON.stringify(ink));

  const csv = http.createServer((req, res) => res.end(req.url.includes('clients')
    ? 'name,email,phone,dob,allergies\nSync Blank Client,,,,\n'
    : 'name,quantity,price\nBlank Cell Ink,,\n')).listen(0, '127.0.0.1');
  await new Promise((r) => csv.on('listening', r));
  const at = 'http://127.0.0.1:' + csv.address().port;
  try {
    await post('/api/sync/config', { clientsUrl: at + '/clients.csv', inventoryUrl: at + '/inventory.csv', enabled: false });
    const run = await post('/api/sync/trigger', {});
    check(run.success, 'the sync from the test CSV failed: ' + JSON.stringify(run).slice(0, 160));
    const c = (await api('/api/clients')).find((x) => x.name === 'Sync Blank Client');
    check(c && !c.dob && !c.allergies && !c.phone && !c.email && !c.medical_history, 'the sync filled in what the CSV left blank: ' + JSON.stringify(c));
    const after = (await api('/api/inventory')).find((i) => i.name === 'Blank Cell Ink');
    check(after.quantity === 7 && after.price === 22.5, 'a blank cell in the synced CSV changed the stock: ' + JSON.stringify(after));
  } finally {
    await post('/api/sync/config', { clientsUrl: '', inventoryUrl: '', enabled: false });
    csv.close();
  }
});

await flow('Backups: a second folder is checked and saved, Back up now copies the backup there too', async () => {
  // backups only went to storage/backups on the same disk, and only when someone clicked
  const second = fs.mkdtempSync(path.join(process.env.RUNNER_TEMP || os.tmpdir(), 'crm-second-backup-'));
  try {
    await b.clickText('Settings');
    await eventually(async () => (await text('#backup-status')).includes('Daily backups kept'), async () => 'the backup card does not say how many daily backups are kept: ' + await text('#backup-status'));
    await b.type('#backup-copy-folder', 'not/a/full/path');
    await b.clickText('Save folder');
    await eventually(async () => (await b.evaluate('window.__ct.sig.added.join(" ")')).includes('full path'), 'a folder that is not a full path was accepted');
    check(!(await api('/api/database/snapshot-status')).copyTo, 'a folder that is not a full path was saved');
    await b.evaluate(`document.getElementById('backup-copy-folder').value = ''`);
    await b.type('#backup-copy-folder', second);
    await b.clickText('Save folder');
    await eventually(async () => (await api('/api/database/snapshot-status')).copyTo === second, 'the second backup folder was not saved');
    await b.clickText('Back up now');
    await eventually(() => fs.readdirSync(second).some((n) => /^studio_crm_.*\.sqlite$/.test(n)), 'Back up now did not copy the backup to the second folder');
    await eventually(async () => (await text('#backup-status')).includes('Last copied to'), async () => 'the card does not say the backup was copied: ' + await text('#backup-status'));
    // the daily backup runs a minute after the start; by now the earlier flows have taken longer than that
    await eventually(async () => (await api('/api/database/snapshot-status')).autoBackups >= 1, 'no daily backup was made', 75);
  } finally {
    await b.evaluate(`fetch('/api/database/backup-folder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"copyTo":""}' })`);
    fs.rmSync(second, { recursive: true, force: true });
  }
});

await flow('Under 18: flagged, the ID check is recorded, and a form needs a parent or guardian signature', async () => {
  const call = (p, body) => b.evaluate(`fetch(${JSON.stringify(p)}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(body))} }).then(async (r) => ({ status: r.status, body: await r.json() }))`);
  const born = `${new Date().getFullYear() - 15}-01-02`;
  const minor = (await call('/api/clients', { name: 'Minor Flow', email: 'minor.flow@example.com', dob: born })).body;
  const adultForm = { sections: [{ id: 's', fields: [{ id: 'client_sig', type: 'signature', label: 'Client Signature' }] }] };
  const guardianForm = { sections: [{ id: 's', fields: [{ id: 'client_sig', type: 'signature', label: 'Client Signature' }, { id: 'guardian_sig', type: 'signature', label: 'Parent / Legal Guardian Signature' }] }] };

  // the desk sees it in the client list and the profile, and records the ID check (never the whole number)
  await b.clickText('Clients');
  await eventually(async () => (await text('#clients-table-tbody')).includes('Minor Flow'), 'the new client is not listed');
  check(await b.evaluate(`[...document.querySelectorAll('.client-directory-row')].some(r => r.innerText.includes('Minor Flow') && r.querySelector('.client-minor-tag'))`), 'the client list does not flag the client under 18');
  await press('.client-directory-row', 'Minor Flow', 'View Profile');
  await eventually(async () => (await text('#client-profile-tags')).includes('Under 18 (15)'), async () => 'the profile does not say the client is under 18: ' + await text('#client-profile-tags'));
  check((await text('#client-profile-tags')).includes('ID not checked'), 'the profile does not say the ID is not checked');
  check((await call(`/api/clients/${minor.id}/id-check`, { type: 'Passport', last4: '123456789' })).status === 400, 'a whole ID number was accepted');
  await b.evaluate(`document.getElementById('cp-id-type').value = 'Passport'`);
  await b.type('#cp-id-last4', 'ab12');
  await b.clickText('Save ID check');
  await eventually(async () => (await text('#client-profile-modal-body')).includes('ending AB12'), async () => 'the ID check is not on the profile: ' + (await text('#client-profile-modal-body')).slice(0, 300));
  check((await text('#client-profile-tags')).includes('ID checked'), 'the profile still says the ID is not checked');

  // no form without a guardian signature, from the desk or to the tablet
  const deskNo = await call(`/api/clients/${minor.id}/consent-forms`, { formName: 'Adult form', schema: adultForm, responses: {} });
  check(deskNo.status === 409 && /under 18/.test(deskNo.body.error), 'the desk saved a form with no guardian signature for a client under 18: ' + JSON.stringify(deskNo));
  check((await call('/api/kiosk/send', { kiosk: 'Age Stand', clientId: minor.id, formName: 'Adult form', schema: adultForm })).status === 409, 'a form with no guardian signature was sent to the tablet for a client under 18');
  const deskYes = await call(`/api/clients/${minor.id}/consent-forms`, { formName: 'Minor Consent', schema: guardianForm, responses: { client_sig: 'data:image/png;base64,AA', guardian_sig: 'data:image/png;base64,AA' } });
  check(deskYes.status === 201, 'the guardian form was refused: ' + JSON.stringify(deskYes));
  const saved = await api(`/api/consent-forms/${deskYes.body.id}`);
  check(saved.ageAtSigning === 15 && saved.idCheck && saved.idCheck.last4 === 'AB12', 'the signed form does not keep the age and the ID check: ' + JSON.stringify({ age: saved.ageAtSigning, id: saved.idCheck }));

  // a client whose age the studio did not know writes a birth date under 18 on the tablet: the form is kept, and flagged
  const unknown = (await call('/api/clients', { name: 'Unknown Age Flow' })).body;
  check((await call('/api/kiosk/send', { kiosk: 'Age Stand', clientId: unknown.id, formName: 'Adult form', schema: adultForm })).status === 201, 'a client of unknown age could not be sent a form');
  const queued = await api('/api/kiosk/next?kiosk=Age%20Stand');
  const done = await call('/api/kiosk/submit', { kiosk: 'Age Stand', id: queued.item.id, responses: { dob: born, client_sig: 'data:image/png;base64,AA' } });
  check(done.status === 201, 'the form signed on the tablet was not saved: ' + JSON.stringify(done));
  const prof = await api(`/api/clients/${unknown.id}/profile`);
  check(prof.client.dob === born && prof.client.age === 15, 'the birth date written on the form was not kept on the record');
  check(prof.consent_forms.some((f) => f.minor_without_guardian), 'the form signed by a client under 18 without a guardian is not flagged');
  check((await api('/api/activity-logs?limit=20')).some((a) => a.action === 'MINOR_WITHOUT_GUARDIAN'), 'the studio is not told a client under 18 signed without a guardian');

  // booking the client says so too
  await b.goto(url);
  await b.clickText('Calendar');
  await pressOn('openQuickNewAppointmentModal()');
  await b.type('#new-appt-client', 'Minor Fl');
  await eventually(async () => (await text('#new-appt-client-autocomplete-dropdown')).includes('Minor Flow'), 'the booking form does not offer the client');
  await b.evaluate(`document.querySelector('#new-appt-client-autocomplete-dropdown [data-id="${minor.id}"]').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))`);
  check((await text('#new-appt-age-note')).includes('Under 18'), 'booking a client under 18 says nothing: ' + await text('#new-appt-age-note'));
  await b.evaluate(`closeNewAppointmentModal()`);
});

await flow('Studio details: saved in Settings, on the consent form and on the form sent to a tablet', async () => {
  // Henry, 2026-10-18: the forms showed "Poli International Certified Studio, 104 Studio Plaza"
  await b.clickText('Settings');
  await b.type('#studio-details-name', 'Flow Ink Studio');
  await b.type('#studio-details-address', '12 Flow Road');
  await b.type('#studio-details-phone', '555-0101');
  await b.clickText('Save studio details');
  await eventually(async () => JSON.parse((await api('/api/app-data')).poli_studio_profile || '{}').studioName === 'Flow Ink Studio', 'the studio details were not saved on the server');
  const made = await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Studio Details Flow' }) }).then(r => r.json())`);
  await b.evaluate(`fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: ${made.id}, client_name: 'Studio Details Flow', service_type: 'Body Piercing', staff_name: 'Flow Piercer Artist', date: '2031-06-07', time: '10:00', status: 'Confirmed' }) })`);
  await b.clickText('Clients');
  await eventually(async () => (await text('#clients-table-tbody')).includes('Studio Details Flow'), 'the client is not listed');
  await press('.client-directory-row', 'Studio Details Flow', 'Sign Waiver');
  const f = b.frame('#form-builder-frame');
  for (let i = 0; i < 80 && !(await f.evaluate('!!(window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("template-select"))').catch(() => false)); i++) await sleep(250);
  await sleep(800);
  const pick = (id) => f.evaluate(`(() => { const s = document.getElementById('template-select'); s.value = ${JSON.stringify(id)}; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await pick('minor_consent');
  if (await f.evaluate(`getComputedStyle(document.getElementById('preview-interface')).display === 'none'`)) await f.clickText('Preview Form');
  await eventually(async () => (await f.evaluate(`document.getElementById('preview-container').innerText`)).includes('Minor Consent'), 'the preview does not show the form chosen');
  const studioBox = () => f.evaluate(`(() => { const el = [...document.querySelectorAll('#preview-container .form-preview-interactive')].find(e => (e.dataset.id || e.name) === 'studio_name'); return el ? el.value : 'no studio name field'; })()`);
  await eventually(async () => (await studioBox()) === 'Flow Ink Studio', async () => 'the form does not show the studio name: ' + await studioBox());
  check(!(await f.evaluate(`document.getElementById('preview-container').innerText`)).includes('Studio Plaza'), 'the form still shows the sample studio address');
  // another form chosen while the preview is open is the one shown (it stayed on the first form)
  await pick('piercing_consent');
  await eventually(async () => (await f.evaluate(`document.getElementById('preview-container').innerText`)).includes('Piercing Consent'), 'choosing another form in the preview kept the old one');
  // the tablet cannot read the studio settings: the form sent to it carries them
  const schema = await f.evaluate(`window.FormBuilderApp.currentForm`);
  const sent = await b.evaluate(`fetch('/api/kiosk/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kiosk: 'Details Stand', clientId: ${made.id}, formName: 'Piercing', schema: ${JSON.stringify(schema)} }) }).then(r => r.status)`);
  check(sent === 201, 'the form could not be sent to the tablet: ' + sent);
  const waiting = await api('/api/kiosk/next?kiosk=Details%20Stand');
  const fields = waiting.item.schema.sections.flatMap((s) => s.fields || []);
  check(fields.some((x) => x.id === 'studio_name' && x.value === 'Flow Ink Studio'), 'the form on the tablet does not have the studio name');
  check(fields.some((x) => x.id === 'studio_contact' && /12 Flow Road/.test(x.value) && /555-0101/.test(x.value)), 'the form on the tablet does not have the studio address and phone');
  check(fields.some((x) => x.id === 'practitioner_name' && x.value === 'Flow Piercer Artist'), 'the form on the tablet does not have the artist of the client\'s appointment: ' + JSON.stringify(fields.filter((x) => /piercer|practitioner|artist/.test(x.id)).map((x) => [x.id, x.value])));
  await b.evaluate(`fetch('/api/kiosk/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"kiosk":"Details Stand"}' })`);
  await pick('tattoo_consent'); // the form builder remembers the form chosen: later flows start from the Tattoo form
  await sleep(800);
  await b.evaluate(`document.getElementById('form-builder-modal').style.display = 'none'`);
});

await flow('Studio details replace the sample studio in a form saved before 1.0.19', async () => {
  // Henry, 2026-10-19: forms he had edited before 1.0.19 still showed "Poli International", in the preview and on the tablet
  const own = JSON.parse((await api('/api/app-data')).poli_studio_profile || '{}');
  check(own.studioName, 'no studio details are saved');
  const made = await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Old Draft Flow' }) }).then(r => r.json())`);
  await b.clickText('Clients');
  await eventually(async () => (await text('#clients-table-tbody')).includes('Old Draft Flow'), 'the client is not listed');
  await press('.client-directory-row', 'Old Draft Flow', 'Sign Waiver');
  const f = b.frame('#form-builder-frame');
  for (let i = 0; i < 80 && !(await f.evaluate('!!(window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("template-select"))').catch(() => false)); i++) await sleep(250);
  await sleep(800);
  const pick = (id) => f.evaluate(`(() => { const s = document.getElementById('template-select'); s.value = ${JSON.stringify(id)}; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await pick('piercing_consent');
  await sleep(500);
  // the draft as 1.0.18 saved it: the sample studio typed into the studio fields
  const old = await f.evaluate(`(() => { const form = JSON.parse(JSON.stringify(window.FormBuilderApp.currentForm)); for (const sec of form.sections) for (const x of sec.fields || []) {
    if (x.id === 'studio_name') x.value = 'Poli International Body Piercing Studio';
    if (x.id === 'studio_contact') x.value = '104 Studio Plaza, Suite B | (555) 019-2834 | Permit #PB-8841'; }
    localStorage.setItem('poli_form_builder_autosave:' + form.id, JSON.stringify({ timestamp: Date.now(), form })); return form; })()`);
  check(old.sections.some((sec) => (sec.fields || []).some((x) => x.id === 'studio_name')), 'the Piercing form has no studio name field');
  await pick('tattoo_consent');
  await sleep(500);
  await pick('piercing_consent');
  if (await f.evaluate(`getComputedStyle(document.getElementById('preview-interface')).display === 'none'`)) await f.clickText('Preview Form');
  const box = (id) => f.evaluate(`(() => { const el = [...document.querySelectorAll('#preview-container .form-preview-interactive')].find(e => (e.dataset.id || e.name) === ${JSON.stringify(id)}); return el ? el.value : 'no ' + ${JSON.stringify(id)} + ' field'; })()`);
  await eventually(async () => (await box('studio_name')) === own.studioName, async () => 'the old draft still shows: ' + await box('studio_name'));
  check(!/Studio Plaza/.test(await box('studio_contact')), 'the old draft still shows the sample address');
  check(!/Poli International/.test(JSON.stringify(await f.evaluate('window.FormBuilderApp.currentForm'))), 'the form being edited still holds the sample studio');
  // a form sent to a tablet with the sample studio in it (sent from an older desk page) gets the studio's own details
  const sent = await b.evaluate(`fetch('/api/kiosk/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kiosk: 'Old Draft Stand', clientId: ${made.id}, formName: 'Piercing', schema: ${JSON.stringify(old)} }) }).then(r => r.status)`);
  check(sent === 201, 'the form could not be sent to the tablet: ' + sent);
  const fields = (await api('/api/kiosk/next?kiosk=Old%20Draft%20Stand')).item.schema.sections.flatMap((sec) => sec.fields || []);
  check(fields.some((x) => x.id === 'studio_name' && x.value === own.studioName), 'the tablet still gets the sample studio name: ' + JSON.stringify(fields.find((x) => x.id === 'studio_name')));
  check(!fields.some((x) => /Studio Plaza/.test(x.value || '')), 'the tablet still gets the sample address');
  await b.evaluate(`fetch('/api/kiosk/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"kiosk":"Old Draft Stand"}' })`);
  await f.evaluate(`localStorage.removeItem('poli_form_builder_autosave:piercing_consent')`);
  await pick('tattoo_consent'); // later flows start from the Tattoo form
  await sleep(800);
  await b.evaluate(`document.getElementById('form-builder-modal').style.display = 'none'`);
});

await flow('Stations: added, given a type and a usual artist, offered in the booking form, removed', async () => {
  // Henry, 2026-10-18: always four stations, none could be added or renamed; the booking form listed typed-in ones
  await b.clickText('Settings');
  await b.type('#new-station-name', 'Branding Room');
  await b.clickText('Add station');
  await eventually(async () => (await api('/api/stations')).some((s) => s.name === 'Branding Room'), 'the station was not added');
  const st = (await api('/api/stations')).find((s) => s.name === 'Branding Room');
  // an artist with no usual station yet (the demo studio has some)
  const taken = (await api('/api/stations')).map((s) => s.assignedStaff);
  const artist = (await api('/api/staff')).find((p) => p.role !== 'manager' && !taken.includes(p.name));
  await eventually(async () => b.evaluate(`!!document.querySelector('.settings-station-row[data-id="${st.id}"]')`), 'the new station is not in the list');
  await b.evaluate(`(() => { const row = document.querySelector('.settings-station-row[data-id="${st.id}"]'); row.querySelector('.st-type').value = 'Branding'; row.querySelector('.st-artist').value = ${JSON.stringify(artist.name)}; })()`);
  await pressOn(`saveStudioStation(${st.id})`);
  await eventually(async () => { const s = (await api('/api/stations')).find((x) => x.id === st.id); return s && s.type === 'Branding' && s.assignedStaff === artist.name; }, 'the station type and usual artist were not saved');
  await b.clickText('Calendar');
  await pressOn('openQuickNewAppointmentModal()');
  await eventually(async () => b.evaluate(`[...document.getElementById('new-appt-station').options].some(o => o.value === 'Branding Room')`), 'the booking form does not list the new station');
  check(!(await b.evaluate(`[...document.getElementById('new-appt-station').options].some(o => o.value === 'Piercing Room')`)), 'the booking form still lists a typed-in station');
  await b.evaluate(`(() => { const a = document.getElementById('new-appt-artist'); a.value = ${JSON.stringify(artist.name)}; a.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await eventually(async () => (await b.evaluate(`document.getElementById('new-appt-station').value`)) === 'Branding Room', async () => 'booking the artist did not choose their usual station: ' + await b.evaluate(`JSON.stringify({ artist: document.getElementById('new-appt-artist').value, want: ${JSON.stringify(artist.name)}, options: [...document.getElementById('new-appt-artist').options].map(o => o.value), station: document.getElementById('new-appt-station').value })`));
  await b.evaluate(`closeNewAppointmentModal()`);
  await b.clickText('Settings');
  await eventually(async () => b.evaluate(`!!document.querySelector('.settings-station-row[data-id="${st.id}"]')`), 'the station is not listed in Settings');
  await pressOn(`removeStudioStation(${st.id})`);
  await eventually(async () => !(await api('/api/stations')).some((s) => s.id === st.id), 'the station was not removed');
});

await flow('Aftercare: printed from the profile with the client name, recorded on the appointment; a sheet with no client', async () => {
  // Henry, 2026-10-18: no tattoo aftercare; give it from the client's profile and keep a record of it
  const made = await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Aftercare Flow' }) }).then(r => r.json())`);
  const appt = await b.evaluate(`fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: ${made.id}, client_name: 'Aftercare Flow', service_type: 'Custom Tattoo', date: '2031-05-06', time: '10:00', status: 'Confirmed' }) }).then(r => r.json())`);
  await b.clickText('Clients');
  await eventually(async () => (await text('#clients-table-tbody')).includes('Aftercare Flow'), 'the client is not listed');
  await press('.client-directory-row', 'Aftercare Flow', 'View Profile');
  await eventually(async () => b.evaluate(`!!document.getElementById('cp-aftercare-card')`), 'the profile has no aftercare section');
  check((await text('#cp-aftercare-card')).includes('No aftercare recorded'), 'the appointment does not say no aftercare was given');
  check((await b.evaluate(`document.getElementById('cp-aftercare-template').value`)) === 'tattoo', 'a tattoo appointment does not choose the tattoo sheet');
  await b.clickText('Print and record aftercare');
  await eventually(async () => ((await api(`/api/clients/${made.id}/profile`)).client.aftercare_given || []).some((g) => g.template_id === 'tattoo' && String(g.appointment_id) === String((appt.appointment || appt).id)), 'the aftercare was not recorded on the appointment');
  await eventually(async () => b.evaluate(`(() => { const f = document.getElementById('aftercare-print-frame'); const t = f && f.contentDocument && f.contentDocument.body ? f.contentDocument.body.innerText : ''; return t.includes('Aftercare Flow') && /tattoo/i.test(t); })()`), 'the printed sheet does not have the client name and the tattoo steps');
  await eventually(async () => (await text('#cp-aftercare-card')).includes('Aftercare given'), 'the profile does not show the aftercare was given');
  check((await api('/api/activity-logs?limit=20')).some((a) => a.action === 'AFTERCARE_GIVEN'), 'the activity log does not record the aftercare');
  await b.evaluate(`closeClientProfileModal()`);
  // a sheet for someone who is not a client: nothing recorded
  await b.clickText('Clients');
  await b.clickText('Aftercare sheet');
  await eventually(async () => b.evaluate(`!!document.getElementById('generic-aftercare-template')`), 'the aftercare sheet window did not open');
  await b.evaluate(`document.getElementById('generic-aftercare-template').value = 'piercing'`);
  await b.clickText('Print', '#generic-aftercare-overlay');
  await eventually(async () => b.evaluate(`(() => { const t = document.getElementById('aftercare-print-frame').contentDocument.body.innerText; return /piercing/i.test(t) && !t.includes('Aftercare Flow'); })()`), 'the sheet with no client was not printed');
});

await flow('Aftercare sheets: every language, edited in Settings, printed in the language chosen', async () => {
  // Patrick, 2026-10-19: the sheets fully editable, and in all languages
  const tattoo = (await api('/api/aftercare/templates')).find((t) => t.id === 'tattoo');
  check(['fr', 'it', 'de', 'es', 'nl', 'pt', 'th'].every((l) => tattoo.translations && tattoo.translations[l] && tattoo.translations[l].steps.length === tattoo.steps.length), 'the tattoo sheet is not in every language');
  await b.clickText('Settings');
  await eventually(async () => b.evaluate(`document.getElementById('aftercare-edit-template').options.length > 0`), 'the aftercare sheet editor is empty');
  await b.evaluate(`(() => { const t = document.getElementById('aftercare-edit-template'); t.value = 'tattoo'; t.dispatchEvent(new Event('change')); const l = document.getElementById('aftercare-edit-lang'); l.value = 'de'; l.dispatchEvent(new Event('change')); })()`);
  check((await b.evaluate(`document.getElementById('aftercare-edit-title').value`)).includes('Tattoo-Pflege'), 'the editor does not show the German sheet');
  await b.evaluate(`document.getElementById('aftercare-edit-steps').value = 'Schritt eins vom Studio.\\nSchritt zwei vom Studio.'`);
  await b.clickText('Save sheet');
  await eventually(async () => { const t = (await api('/api/aftercare/templates')).find((x) => x.id === 'tattoo'); return t.translations.de.steps[0] === 'Schritt eins vom Studio.' && t.steps.length === 6; }, 'the German steps were not saved, or the English ones changed');
  // English edited on its own
  await b.evaluate(`(() => { const l = document.getElementById('aftercare-edit-lang'); l.value = 'en'; l.dispatchEvent(new Event('change')); })()`);
  check((await b.evaluate(`document.getElementById('aftercare-edit-steps').value.split('\\n').length`)) === 6, 'the editor does not show the English steps');
  // a new sheet, then deleted
  const before = (await api('/api/aftercare/templates')).length;
  await b.clickText('New sheet');
  await eventually(async () => (await api('/api/aftercare/templates')).length === before + 1, 'no new sheet was added');
  await b.evaluate(`document.getElementById('aftercare-edit-title').value = 'Branding aftercare'`);
  await b.clickText('Save sheet');
  await eventually(async () => (await api('/api/aftercare/templates')).some((t) => t.title === 'Branding aftercare'), 'the new sheet was not saved');
  await b.clickText('Delete sheet');
  await eventually(async () => (await api('/api/aftercare/templates')).length === before, 'the sheet was not deleted');
  // printed in German, with German labels, whatever the screen's language
  await b.clickText('Clients');
  await b.clickText('Aftercare sheet');
  await eventually(async () => b.evaluate(`!!document.getElementById('generic-aftercare-lang')`), 'the aftercare sheet window did not open');
  await b.evaluate(`(() => { document.getElementById('generic-aftercare-template').value = 'tattoo'; document.getElementById('generic-aftercare-lang').value = 'de'; })()`);
  await b.clickText('Print', '#generic-aftercare-overlay');
  await eventually(async () => b.evaluate(`(() => { const t = document.getElementById('aftercare-print-frame').contentDocument.body.innerText; return t.includes('Schritt eins vom Studio.') && t.includes('Datum'); })()`), async () => 'the sheet was not printed in German: ' + await b.evaluate(`document.getElementById('aftercare-print-frame').contentDocument.body.innerText.slice(0, 200)`));
  await b.evaluate(`document.getElementById('generic-aftercare-overlay').style.display = 'none'`);
  // the studio's German wording put back, for the flows after this one
  await b.evaluate(`fetch('/api/aftercare/templates/tattoo', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: 'de', steps: ${JSON.stringify(tattoo.translations.de.steps)} }) })`);
});

await flow('Scanner field: in the form builder, its own button text, a page scanned on the CRM computer lands in the form', async () => {
  // Henry, 2026-10-18: a field that scans from his TWAIN devices, with a button he can name
  await b.clickText('Clients');
  await b.clickText('Consent Form Builder');
  const f = b.frame('#form-builder-frame');
  for (let i = 0; i < 80 && !(await f.evaluate('!!(window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("btn-preview"))').catch(() => false)); i++) await sleep(250);
  await sleep(800);
  check(await f.evaluate(`window.FormBuilderApp.getAllFieldTypeDefinitions().some(d => d.type === 'scanner')`), 'the form builder does not offer the Scanner field in the CRM');
  // the field, with the studio's own words on its button
  const id = await f.evaluate(`(() => { const app = window.FormBuilderApp; const sec = app.currentForm.sections[0]; app.addField('scanner', sec.id); const fld = sec.fields.find(x => x.type === 'scanner'); fld.buttonText = 'PRESS HERE TO SCAN'; return fld.id; })()`);
  check(id, 'the Scanner field could not be added');
  await f.clickText('Preview Form');
  await eventually(async () => f.evaluate(`!!document.querySelector('#preview-container [data-scan-field="${id}"]')`), 'the preview does not show the scan button');
  check((await f.evaluate(`document.querySelector('#preview-container [data-scan-field="${id}"]').innerText.trim()`)) === 'PRESS HERE TO SCAN', 'the scan button does not show the studio\'s own text');
  await f.evaluate(`document.querySelector('#preview-container [data-scan-field="${id}"]').click()`);
  await eventually(async () => f.evaluate(`(() => { const r = window.ActiveFormPreview.responses[${JSON.stringify(id)}]; return Array.isArray(r) && r.length === 1 && /^data:image\\//.test(r[0].dataUrl); })()`), 'the scanned page did not land in the form');
  check(await f.evaluate(`!!document.querySelector('#photo-gallery-${id} img')`), 'the scanned page is not shown in the form');
  // the scanner answers the server's own endpoints
  check((await api('/api/scanner/devices')).some((d) => d.name === 'Test scanner'), 'the CRM does not list the scanner');
  // put the form back as it was, for the flows after this one
  await f.clickText('Back to Editor');
  await f.evaluate(`(() => { const app = window.FormBuilderApp; const sec = app.currentForm.sections[0]; sec.fields = sec.fields.filter(x => x.id !== ${JSON.stringify(id)}); app.renderCanvas && app.renderCanvas(); })()`);
  await b.evaluate(`document.getElementById('form-builder-modal').style.display = 'none'`);
});

await flow('Ink mixer: the diluent label is the size chosen, cap sizes change the formula, a reference photo shows; the autoclave tool claims no Google Sheets sync', async () => {
  // Henry, 2026-10-18: every container size gave 60 ml, on screen and on the label
  await b.goto(url.replace(/\/$/, '') + '/tools/ink-mixer/');
  await eventually(async () => b.evaluate(`!!document.getElementById('diluentSizeSelect')`), 'the ink mixer did not open');
  await b.evaluate(`(() => { const s = document.getElementById('diluentSizeSelect'); s.value = '240'; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  check((await b.evaluate(`document.getElementById('diluentOutTotal').innerText`)).includes('240'), 'the diluent formulator ignores the container size: ' + await b.evaluate(`document.getElementById('diluentOutTotal').innerText`));
  // Henry, 2026-10-19: Gradient Caps gave the same formula for small, medium and large caps
  const capDrops = async (size) => {
    await b.evaluate(`(() => { const s = document.getElementById('gradCapSize'); s.value = '${size}'; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    return b.evaluate(`[...document.querySelectorAll('.gradient-cap-drops')].map(e => e.innerText).join(' / ')`);
  };
  await b.clickText('Gradient Caps');
  const small = await capDrops('cap_9'), large = await capDrops('cap_16');
  check(small && large && small !== large, 'Gradient Caps gives the same formula for a small and a large cap: ' + small);
  check((await b.evaluate(`[...document.getElementById('gradCapSize').options].map(o => o.value).join()`)) === 'cap_9,cap_12,cap_16', 'a cap size choice is not one the formula knows');
  // Henry, 2026-10-19: a photo chosen in Reference Studio showed nothing
  await b.clickText('Reference Studio');
  await b.evaluate(`(async () => { const c = document.createElement('canvas'); c.width = 60; c.height = 40; const g = c.getContext('2d'); g.fillStyle = '#c01020'; g.fillRect(0, 0, 30, 40); g.fillStyle = '#103080'; g.fillRect(30, 0, 30, 40);
    const blob = await new Promise((r) => c.toBlob(r, 'image/png')); const dt = new DataTransfer(); dt.items.add(new File([blob], 'reference.png', { type: 'image/png' }));
    const input = document.getElementById('refFileInput'); input.files = dt.files; input.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await eventually(async () => b.evaluate(`!!document.getElementById('refImageCanvas').offsetParent && document.getElementById('refImageCanvas').width > 0`), 'the reference photo is not shown');
  await eventually(async () => (await b.evaluate(`document.querySelectorAll('#refPaletteList .send-to-solver-btn').length`)) > 0, 'no colours were taken from the reference photo');
  // it said "Synced with Google Sheets & Firestore" and sent nothing
  await b.goto(url.replace(/\/$/, '') + '/tools/autoclave-calculator/');
  await eventually(async () => b.evaluate(`document.readyState === 'complete' && document.body.innerText.length > 1000`), 'the autoclave tool did not open');
  check(!/Google Sheets|Firestore/.test(await b.evaluate(`document.body.innerText`)), 'the autoclave tool still offers a Google Sheets sync');
});

await flow('Tools: the USA, Europe and Southeast Asia ink checkers are grouped and each opens; the Thai list flags a banned pigment, not carbon black', async () => {
  await pressOn("navigateToDestination('tools')");
  await eventually(async () => /Ink regulation checkers: USA, Europe \(REACH\), Southeast Asia/.test(await text('#ink-regulation-checkers')), 'no Ink regulation checkers group in Tools');
  for (const [fn, frame] of [['UsTattooInkChecker', 'poli-usinkcheck-frame'], ['ReachSvhcChecker', 'poli-svhccheck-frame'], ['SeaTattooInkChecker', 'poli-seainkcheck-frame']]) {
    await pressOn(`open${fn}Modal()`);
    await eventually(async () => b.evaluate(`(() => { const d = document.getElementById('${frame}').contentDocument; return !!d && d.readyState === 'complete' && d.body.innerText.length > 200; })()`), `${fn} did not open`);
    if (fn === 'SeaTattooInkChecker') {
      // 2026-10-20: the export flagged carbon black and the iron oxides as "restricted"; they are permitted colours in Thailand
      const rows = await b.evaluate(`(async () => {
        const d = document.getElementById('${frame}').contentDocument, w = d.defaultView, ta = d.querySelector('textarea');
        Object.getOwnPropertyDescriptor(w.HTMLTextAreaElement.prototype, 'value').set.call(ta, 'Pigment Red 53:1 (CI 15585), Carbon Black CI 77266, Iron Oxide CI 77491, Aqua');
        ta.dispatchEvent(new w.Event('input', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 200));
        [...d.querySelectorAll('button')].find((x) => /Screen Against/.test(x.innerText)).click();
        await new Promise((r) => setTimeout(r, 600));
        return [...d.querySelectorAll('table tbody tr')].map((r) => r.innerText).join(' | ');
      })()`);
      check(/CI 15585/.test(rows) && /399/.test(rows), 'CI 15585 is not flagged with its Royal Gazette entry: ' + rows);
      check(!/77266|77491/.test(rows), 'a permitted colour is flagged: ' + rows);
    }
    await b.evaluate(`close${fn}Modal()`);
  }
});

await flow('Autoclave log: keeps only what was entered, never a passing result nobody recorded', async () => {
  // it filled in 134 °C, 2.1 bar, 18 minutes, spore test PASS and a technician when they were left out
  const post = (body) => b.evaluate(`fetch('/api/compliance/autoclave-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ${JSON.stringify(JSON.stringify(body))} }).then(async r => ({ status: r.status, data: await r.json() }))`);
  check((await post({})).status === 400, 'an empty cycle was saved');
  const partial = await post({ autoclave_id: 'Flow Autoclave', technician: 'Flow Tech' });
  check(partial.status === 201, 'a cycle with some details was refused: ' + partial.status);
  const log = partial.data.log;
  check(log.spore_test_result === null && log.status === 'NOT_RECORDED', 'a spore test nobody recorded was saved as ' + log.spore_test_result);
  check(log.temperature_c === null && log.pressure_bar === null && log.duration_minutes === null && log.cycle_number === null, 'figures nobody entered were filled in: ' + JSON.stringify(log));
  check(log.indicator_strip === null && log.station === '' && log.notes === '', 'details nobody entered were filled in: ' + JSON.stringify(log));
  const failed = (await post({ autoclave_id: 'Flow Autoclave', spore_test_result: 'fail', temperature_c: '121' })).data.log;
  check(failed.spore_test_result === 'FAIL' && failed.status === 'QUARANTINE_WARNING' && failed.temperature_c === 121, 'a failed cycle was not kept as failed: ' + JSON.stringify(failed));
  // the vault shows who ran the cycle (it looked for an "operator" the log never had)
  await b.clickText('Compliance');
  await pressOn('openAutoclaveVaultModal()');
  await eventually(async () => (await text('#autoclave-vault-modal-body')).includes('Flow Tech'), async () => 'the vault does not show the technician: ' + (await text('#autoclave-vault-modal-body')).slice(0, 200));
  check((await text('#autoclave-vault-modal-body')).includes('result not recorded'), 'the vault does not say the spore test was not recorded');
  await b.evaluate(`forceHideModal('autoclave-vault-modal-overlay')`);
});

await flow('A Print button opens the print dialog', async () => {
  await b.clickText('Clients');
  await b.clickText('Health Alerts');
  await b.clickText('Print Client Health Directory');
  check((await b.evaluate('window.__ct.sig.prints')) === 1, 'the print dialog was not opened');
});

await flow('Tablet kiosk: fill, sign, complete; the client and the signed form are saved', async () => {
  await b.clickText('Clients');
  await b.clickText('Consent Form Builder');
  const f = b.frame('#form-builder-frame');
  for (let i = 0; i < 80 && !(await f.evaluate('!!(window.__ct && window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("btn-preview"))').catch(() => false)); i++) await sleep(250);
  await sleep(800);
  await f.clickText('Preview Form');
  await f.clickText('Fill Sample Answers');
    await eventually(async () => f.evaluate(`Object.keys(window.ActiveFormPreview.responses).length > 10 && window.ActiveFormPreview.validateAll().every(e => /signature/i.test(e.fieldLabel + e.message))`), 'the sample answers were not filled in');
  await f.clickText('Tablet Kiosk Mode');
  await f.clickText('Next Step', '#tablet-kiosk-modal');
  await f.type('#tablet-kiosk-modal [name="full_name"]', 'Kiosk Flow');
  await f.type('#tablet-kiosk-modal [name="email"]', 'kiosk.flow@example.com');
  await f.type('#tablet-kiosk-modal [name="dob"]', '');
  await f.evaluate(`(() => { const d = document.querySelector('#tablet-kiosk-modal [name="dob"]'); d.value = '1990-05-04'; d.dispatchEvent(new Event('input', { bubbles: true })); d.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  for (let i = 0; i < 5; i++) await f.clickText('Next Step', '#tablet-kiosk-modal');
  await f.scribble('#tablet-kiosk-modal canvas.signature-pad-canvas');
  check(await f.evaluate('!window.ActiveFormPreview.signatureManagers.client_sig.isEmpty()'), 'the kiosk signature box does not take a signature');
  await f.clickText('Complete', '#tablet-kiosk-modal');
  await sleep(2500);
  check(!(await f.evaluate(`(document.getElementById('validation-summary') || document.body).innerText`)).includes('mandatory fields require attention'), 'the completed form was reported as incomplete');
  check(b.seen.downloads.some((d) => d.endsWith('.pdf')), 'no PDF was produced');
  const client = (await api('/api/clients')).find((c) => c.name === 'Kiosk Flow');
  check(client, 'saving the form did not create the client');
  check(client.dob === '1990-05-04', 'the date of birth was replaced: ' + client.dob);
  const forms = (await api(`/api/clients/${client.id}/profile`)).consent_forms;
  check(forms.length === 1 && forms[0].signed, 'the signed form is not in the client profile');
  await b.clickText('Close', '#form-builder-modal button');
  // Henry: the client list still said "0 signed" after a form was signed on the tablet
  await eventually(async () => (await b.evaluate(`[...document.querySelectorAll('.client-directory-row')].find(r => r.innerText.includes('Kiosk Flow'))?.innerText || ''`)).includes('1 Signed'),
    'the client list does not count the form signed on the tablet');
  await press('.client-directory-row', 'Kiosk Flow', 'View Profile');
  await b.clickText('Waivers', '#client-profile-modal-overlay');
  await b.clickText('View answers');
  await eventually(async () => (await text('#client-profile-modal-body')).includes('kiosk.flow@example.com'), 'the saved answers cannot be read back');
});

await flow('On a tablet, with fingers: the consent form is filled, signed and saved', async () => {
  await b.tablet();
  try {
    await b.goto(url);
    await b.evaluate(`navigateToDestination('clients')`); // the menu is behind the hamburger on a tablet; tested on its own below
    await b.settle();
    await b.clickText('Consent Form Builder');
    const f = b.frame('#form-builder-frame');
    for (let i = 0; i < 80 && !(await f.evaluate('!!(window.__ct && window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("btn-preview"))').catch(() => false)); i++) await sleep(250);
    await sleep(800);
    await f.clickText('Preview Form');
    await f.clickText('Fill Sample Answers');
    await eventually(async () => f.evaluate(`Object.keys(window.ActiveFormPreview.responses).length > 10 && window.ActiveFormPreview.validateAll().every(e => /signature/i.test(e.fieldLabel + e.message))`), 'the sample answers were not filled in');
    await f.clickText('Tablet Kiosk Mode');
    await f.clickText('Next Step', '#tablet-kiosk-modal');
    await f.type('#tablet-kiosk-modal [name="full_name"]', 'Tablet Flow');
    for (let i = 0; i < 5; i++) await f.clickText('Next Step', '#tablet-kiosk-modal');
    await f.scribble('#tablet-kiosk-modal canvas.signature-pad-canvas');
    check(await f.evaluate('!window.ActiveFormPreview.signatureManagers.client_sig.isEmpty()'), 'a finger does not sign in the signature box');
    const missing = await f.evaluate(`window.ActiveFormPreview.validateAll().map(e => e.fieldLabel).join(', ')`);
    check(!missing, 'the form still asks for: ' + missing);
    await f.clickText('Complete', '#tablet-kiosk-modal');
    await eventually(async () => (await api('/api/clients')).some((c) => c.name === 'Tablet Flow'),
      async () => 'the form signed on the tablet was not saved. In the form: ' + await f.evaluate(`JSON.stringify({ kiosk: window.ActiveFormPreview.isKioskMode, missing: window.ActiveFormPreview.validateAll().map(e => e.fieldLabel), said: window.__ct.sig.added.slice(-3), lastClick: window.__ct.sig.lastClick })`).catch((e) => e.message)
        + ' | last click on the page: ' + await b.evaluate('window.__ct.sig.lastClick')
        + ' | page calls: ' + await b.evaluate(`window.__ct.sig.fetches.filter(x => x.method !== 'GET').slice(-4).map(x => x.method + ' ' + x.url + ' ' + x.status).join(', ')`), 20);
  } finally { await b.desktop(); }
});

await flow('Kiosk PIN: the client cannot leave the form; a finished form shows Thank you', async () => {
  await b.goto(url);
  await b.clickText('Settings');
  await b.type('#kiosk-pin-next', '4321');
  await b.clickText('Set PIN');
  await eventually(async () => (await text('#kiosk-pin-status')).startsWith('A PIN is set'), 'the kiosk PIN was not saved');
  try {
    await b.goto(url); // a fresh page: the PIN must come back from the studio database
    await b.clickText('Clients');
    await b.clickText('Consent Form Builder');
    const f = b.frame('#form-builder-frame');
    for (let i = 0; i < 80 && !(await f.evaluate('!!(window.__ct && window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("btn-preview"))').catch(() => false)); i++) await sleep(250);
    await sleep(800);
    await f.clickText('Preview Form');
    await f.clickText('Fill Sample Answers');
    await eventually(async () => f.evaluate(`Object.keys(window.ActiveFormPreview.responses).length > 10`), 'the sample answers were not filled in');
    await f.clickText('Tablet Kiosk Mode');
    const inKiosk = () => f.evaluate(`getComputedStyle(document.getElementById('tablet-kiosk-modal')).display !== 'none'`);
    // ✕ Exit asks for the PIN: a wrong one keeps the client in the form
    await f.clickText('Exit Kiosk', '#tablet-kiosk-modal');
    await f.type('#kiosk-pin-lock input', '1111');
    await f.clickText('Unlock', '#kiosk-pin-lock');
    check((await f.evaluate(`document.querySelector('#kiosk-pin-lock .kiosk-pin-error').innerText`)) === 'Wrong PIN', 'a wrong PIN was not refused');
    check(await inKiosk(), 'a wrong PIN let the client out of the kiosk');
    await f.type('#kiosk-pin-lock input', '4321');
    await f.clickText('Unlock', '#kiosk-pin-lock');
    check(!(await inKiosk()), 'the right PIN did not leave the kiosk');
    // finished form: saved, then a Thank you screen that only the PIN leaves
    await f.clickText('Tablet Kiosk Mode');
    await f.clickText('Next Step', '#tablet-kiosk-modal');
    await f.type('#tablet-kiosk-modal [name="full_name"]', 'Locked Kiosk');
    for (let i = 0; i < 5; i++) await f.clickText('Next Step', '#tablet-kiosk-modal');
    // not signed yet: Complete keeps the client in the form and says what is missing
    await f.clickText('Complete', '#tablet-kiosk-modal');
    check(await inKiosk(), 'an unsigned form let the client out of the locked kiosk');
    check(/Please complete:/.test(await f.evaluate(`document.getElementById('tablet-kiosk-modal').innerText`)), 'the locked kiosk does not say what is missing');
    await f.scribble('#tablet-kiosk-modal canvas.signature-pad-canvas');
    await f.clickText('Complete', '#tablet-kiosk-modal');
    await eventually(async () => (await f.evaluate(`document.getElementById('tablet-kiosk-modal').innerText`)).includes('Your form has been submitted'), 'no Thank you screen after a finished form');
    await eventually(async () => (await api('/api/clients')).some((c) => c.name === 'Locked Kiosk'), 'the form finished in the locked kiosk was not saved');
    await f.clickText('Staff: exit', '#tablet-kiosk-modal');
    await f.type('#kiosk-pin-lock input', '4321');
    await f.clickText('Unlock', '#kiosk-pin-lock');
    check(!(await inKiosk()), 'the PIN did not leave the Thank you screen');
  } finally {
    await b.goto(url);
    await b.evaluate('removeKioskPin()');
  }
});

await flow('On a tablet, the menu button opens the menu and a screen can be chosen', async () => {
  await b.tablet();
  try {
    await b.goto(url);
    await pressOn('toggleSidebar()');
    await b.clickText('Calendar');
    await eventually(async () => (await b.evaluate('window.__ct.state().view')) === 'dest-calendar', 'the Calendar did not open from the tablet menu');
  } finally { await b.desktop(); }
});

await flow('Form builder: changes to one form are still there after opening another form', async () => {
  await b.goto(url + 'tools/form-builder/index.html');
  await sleep(1500);
  const questions = () => b.evaluate('window.FormBuilderApp.currentForm.sections[0].fields.length');
  const open = (i) => b.evaluate(`(() => { const s = document.getElementById('template-select'); s.selectedIndex = ${i}; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  const before = await questions();
  await b.clickText('Add Question');
  await open(1);
  await sleep(600);
  const second = await questions();
  await b.clickText('Add Question');
  await open(0);
  await sleep(600);
  check((await questions()) === before + 1, 'the question added to the first form was lost');
  // every save to the studio database went through: two at once used to exceed the browser's keepalive limit
  await sleep(800);
  const lost = await b.evaluate(`window.__ct.sig.fetches.filter(f => f.url.includes('/api/app-data/') && f.method === 'PUT' && f.status !== 200).map(f => f.url + ' ' + f.status)`);
  check(!lost.length, 'form designs not saved on the server: ' + lost.join(', '));
  // another device: a browser that has never opened the form builder (goto starts with empty storage)
  await sleep(800);
  await b.goto(url + 'tools/form-builder/index.html');
  await sleep(1500);
  check((await questions()) === before + 1, 'the edited form did not reach a second device');
  // and every other form edited there, each saved under its own name
  await open(1);
  await sleep(600);
  check((await questions()) === second + 1, 'the second edited form did not reach a second device');
});

await flow('Team board: a message is saved and still there after a reload', async () => {
  await b.clickText('Settings');
  await b.clickText('Team M Board');
  await b.type('#mboard-chat-input', 'Flow message for the team');
  await b.clickText('Send', '#team-messenger-overlay');
  await eventually(async () => (await text('#mboard-messages-stream')).includes('Flow message for the team'), 'the message is not on the board');
  await b.goto(url);
  await b.clickText('Settings');
  await b.clickText('Team M Board');
  await eventually(async () => (await text('#mboard-messages-stream')).includes('Flow message for the team'), 'the message was gone after a reload');
});

await flow('The sidebar shows the version that is running', async () => {
  const version = (await api('/api/studio-meta')).version;
  // the label may go on with ' · update available' (the test feed always has a newer version)
  await eventually(async () => (await text('#app-version-label')).split(' ')[0] === 'v' + version, 'the version label does not match ' + version);
});

await flow('Over https the scanner button starts the camera, and stops it again', async () => {
  await b.goto(`https://127.0.0.1:${httpsPort}/`);
  check(await b.evaluate('isSecureContext && !!navigator.mediaDevices'), 'the https address does not give the page a camera');
  await b.clickText('Log Activity');
  await b.clickText('Open Camera Scanner');
  await eventually(async () => b.evaluate(`(() => { const v = document.querySelector('#qr-reader video'); return !!v && !v.paused && v.videoWidth > 0; })()`), 'the camera picture did not start');
  await b.clickText('Open Camera Scanner');
  await eventually(async () => b.evaluate(`!document.querySelector('#qr-reader video')`), 'the second click did not stop the camera');
});

await flow('Back up now writes a real copy of the studio database', async () => {
  await b.clickText('Settings');
  await pressOn('triggerInstantDatabaseSnapshot()');
  await eventually(async () => (await b.evaluate('window.__ct.sig.added.join(" ")')).includes('Backup saved in storage/backups'), 'the backup button did not report a saved file');
  const call = await b.evaluate(`window.__ct.sig.fetches.filter(f => f.url.includes('create-snapshot')).map(f => f.status).join()`);
  check(call === '200', 'the backup request failed: ' + call);
});

await flow('Updates: the menu says an update is out, Settings says what it is, and a copy not from the download is not offered the button', async () => {
  await b.goto(url);
  await eventually(async () => /update available/.test(await text('#app-version-label')), async () => 'the menu does not say an update is out: ' + await text('#app-version-label'));
  await b.evaluate(`document.getElementById('app-version-label').click()`);
  await eventually(async () => shown('dest-settings'), 'the update notice does not open Settings');
  await eventually(async () => /Version 9.9.9 is available/.test(await text('#update-status')), async () => 'Settings does not name the new version: ' + await text('#update-status'));
  // the ready-to-run download (runtime/ folder) offers Update now; a source checkout is updated the way it was
  // installed: no button that cannot work. (The test feed's ZIP does not exist, so nothing is installed here.)
  const download = fs.existsSync(path.join(process.env.CRM_ROOT || '.', 'runtime'));
  if (download && process.platform === 'win32') {
    check(await shown('update-now-btn'), 'the download is not offered Update now');
  } else if (!download) {
    check(!(await shown('update-now-btn')), 'Update now is offered where it cannot work');
    check(/ready-to-run download/.test(await text('#update-status')), 'Settings does not say why there is no Update now button');
    check((await b.evaluate(`fetch('/api/admin/update', { method: 'POST' }).then(r => r.status)`)) === 400, 'the server starts an update without the ready-to-run download');
  }
  await pressOn('checkStudioUpdate(true)');
  await eventually(async () => /9.9.9/.test(await text('#update-status')), 'Check again lost the status');
});

// Last, because it deletes the demo studio: the first thing a real studio does.
await flow('Start with an empty studio, then add the first client, staff member and appointment', async () => {
  await b.clickText('Start with an empty studio');
  await sleep(1500);
  check((await api('/api/clients')).length === 0, 'the demo clients were not cleared');
  await b.clickText('Clients');
  await b.clickText('New Client');
  await b.type('#new-client-name', 'First Client');
  await b.clickText('Save client');
  await eventually(async () => (await text('#clients-table-tbody')).includes('First Client'), 'the first client is not in the list');
  await press('.client-directory-row', 'First Client', 'View Profile');
  check((await text('#client-profile-name')) === 'First Client', 'the first client has no profile');
  await b.clickText('×', '#client-profile-modal-overlay');
  await b.clickText('Staff Login');
  await b.clickText('Add staff member');
  await b.type('#staff-form-name', 'First Artist');
  await b.clickText('Save staff member');
  await eventually(async () => (await api('/api/staff')).some((s) => s.name === 'First Artist'), 'the first staff member was not saved');
  await b.clickText('×', '#staff-login-modal-overlay');
  await b.clickText('Calendar');
  await b.clickText('Book Appointment');
  check((await b.evaluate(`[...document.getElementById('new-appt-artist').options].map(o => o.textContent).join()`)).includes('First Artist'), 'the first staff member cannot be chosen for an appointment');
  // a staff note is written by the studio's own people, not the demo's (the list was typed in: Jaxon Vance, Maya Lin...)
  const firstClient = (await api('/api/clients')).find((c) => c.name === 'First Client');
  await b.evaluate(`openClientProfileModal(${firstClient.id})`);
  await sleep(1200);
  await b.evaluate(`switchClientProfileTab('notes')`);
  await eventually(async () => { const o = await b.evaluate(`[...document.getElementById('sn-author-select').options].map((x) => x.textContent).join()`); return o.includes('First Artist') && !o.includes('Jaxon'); }, async () => 'the staff note authors are not the studio\'s own staff: ' + await b.evaluate(`[...document.getElementById('sn-author-select').options].map((x) => x.textContent).join()`));
  await b.evaluate(`closeClientProfileModal()`);
  await b.goto(url);
  await b.clickText('Calendar');
  await b.clickText('Book Appointment');
  await b.type('#new-appt-client', 'First Client');
  await b.evaluate(`document.getElementById('new-appt-date').value = new Date().toLocaleDateString('en-CA')`);
  await b.clickText('Book appointment');
  check((await api('/api/appointments')).length === 1, 'the first appointment was not saved');
  await eventually(async () => (await text('#schedule-appointments-tbody')).includes('First Client'), 'the booked appointment is not listed on the Calendar');
  await press('.appointment-row', 'First Client', 'Completed');
  check((await api('/api/appointments'))[0].status === 'completed', 'Completed did not change the appointment');
  await press('.appointment-row', 'First Client', 'Remove');
  check((await api('/api/appointments')).length === 0, 'the appointment was not removed');
  // nothing of the demo studio is left, and no screen shows a figure nobody entered
  for (const path of ['services', 'financial', 'inventory', 'waivers', 'gallery', 'messages', 'activity-logs?limit=5']) {
    const left = await api('/api/' + path);
    check(Array.isArray(left) && left.filter((x) => !/First (Client|Artist)/.test(JSON.stringify(x))).length === 0, `an emptied studio still has ${path}: ` + JSON.stringify(left).slice(0, 120));
  }
  check((await api('/api/inventory/usage-heatmap')).summary.total_weekly_units === 0, 'the usage heatmap shows supplies nobody used');
  check((await api('/api/stations')).every((st) => !st.autoclaveCycle), 'a station shows an autoclave cycle nobody ran');
  check(!(await api('/api/inventory/sync-status')).lastSuccessfulSyncTime, 'the CSV sync reports a run that never happened');
  // figures typed into the page itself, not only the data: Finance showed "$24,850, 42 completed appointments"
  // and the duration report "148.5 hrs, Maya Lin 98.4%" in every studio, even an empty one
  await b.clickText('Finance');
  await eventually(async () => (await text('#fin-paid')) === '$0.00' && (await text('#fin-deposits')) === '$0.00' && (await text('#fin-due')) === '$0.00' && (await text('#fin-done')) === '0',
    async () => 'Finance shows money an empty studio never took: ' + [await text('#fin-paid'), await text('#fin-deposits'), await text('#fin-due'), await text('#fin-done')].join(' / '));
  await b.evaluate(`openSessionDurationReportModal()`);
  await eventually(async () => (await text('#sd-kpi-total-hours')) === '0.0 h', async () => 'the duration report shows hours nobody worked: ' + await text('#sd-kpi-total-hours'));
  check((await text('#sd-kpi-top-artist')) === '—', 'the duration report names a top artist with no sessions');
  await b.evaluate(`closeSessionDurationReportModal()`);
  // nothing of the demo studio's people or rooms, and the daily summary is for today (it said 2026-07-29)
  await b.clickText('Dashboard');
  await sleep(1500);
  const everything = await b.evaluate(`document.body.innerText`);
  for (const demo of ['VIP Private Suite', 'Kai Thorne', 'Piercing Suite B', 'Admin Manager', 'Jaxon Vance', 'Maya Lin', 'Bugpin Liner', 'True Black 4oz']) check(!everything.includes(demo), 'an emptied studio still shows ' + demo);
  // low stock comes from the studio's stock: three invented items were typed into the page, and the reorder
  // list it copies was four other invented products
  await b.clickText('Inventory');
  await eventually(async () => (await text('#dashboard-low-stock-grid')).includes('No items are below'), async () => 'the low-stock cards show items an empty studio does not have: ' + await text('#dashboard-low-stock-grid'));
  b.reset();
  await pressOn('quickReorderLowStockEmail()');
  await eventually(async () => (await b.evaluate('window.__ct.sig.added.join(" ")')).includes('No items are below their reorder level'), 'the reorder list was made with no low stock');
  await b.evaluate(`openDailyStudioSummaryModal()`);
  await eventually(async () => (await text('#summary-report-timestamp')).includes(new Date().toLocaleDateString('en-CA')), async () => 'the daily summary is not for today: ' + await text('#summary-report-timestamp'));
  await b.evaluate(`forceHideModal('daily-summary-modal-overlay')`);
  await b.clickText('Finance');
  for (const [open, body, expected] of [
    ['openDepositLedgerModal()', '#deposit-ledger-modal-body', 'No deposits are recorded'],
    ['openCommissionModal()', '#commission-table-body', 'No payments are recorded'],
    ['openMarginCalculatorModal()', '#margin-calculator-modal-body', 'Nothing to calculate yet'],
  ]) {
    await b.goto(url);
    await b.clickText('Finance');
    await pressOn(open);
    await eventually(async () => (await text(body)).includes(expected), `${open} does not say that nothing is recorded: ` + (await text(body)).slice(0, 80));
  }
  await b.goto(url);
  await b.clickText('Compliance');
  await pressOn('openAutoclaveVaultModal()');
  await eventually(async () => (await text('#autoclave-vault-modal-body')).includes('No autoclave cycles recorded yet'), 'the autoclave vault shows a cycle nobody ran');
});

// After everything else: while it runs, the studio is locked.
await flow('Studio password: locks every device out until it signs in, and can be removed', async () => {
  const anon = (p) => fetch(url + p).then((r) => r.status); // a device that has not signed in
  check((await anon('api/clients')) === 200, 'the API was not open before a password was set');
  await b.clickText('Settings');
  await b.type('#access-next', 'studio-test-password');
  await b.clickText('Set password');
  await eventually(async () => (await text('#access-status')).startsWith('A password is set'), 'the password was not saved');
  check((await anon('api/clients')) === 401, 'the API still answers a device that has not signed in');
  check((await anon('')) === 401, 'the page still opens for a device that has not signed in');
  await b.clickText('Sign out on this device');
  await eventually(async () => b.evaluate(`!!document.getElementById('login-password')`), 'signing out did not show the sign-in page');
  await b.type('#login-password', 'not the password');
  await b.clickText('Sign in');
  await eventually(async () => (await text('#error')) === 'Wrong password', 'a wrong password was not refused');
  await b.type('#login-password', 'studio-test-password');
  await b.clickText('Sign in');
  await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-settings')`), 'the right password did not open the CRM');
  // idle lock: 5 minutes, then the clock is wound back instead of waiting
  await b.clickText('Settings');
  await b.evaluate(`(() => { const s = document.getElementById('access-idle-minutes'); s.value = '5'; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await eventually(async () => (await api('/api/access')).idleMinutes === 5, 'the idle lock was not saved');
  await b.evaluate('idleLastUse = Date.now() - 6 * 60000');
  await eventually(async () => b.evaluate(`!!document.getElementById('login-password')`).catch(() => false), 'a device left unused did not lock', 25);
  await b.type('#login-password', 'studio-test-password');
  await b.clickText('Sign in');
  await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-settings')`), 'signing in after the idle lock did not open the CRM');
  await b.clickText('Settings');
  await b.evaluate(`(() => { const s = document.getElementById('access-idle-minutes'); s.value = '0'; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await eventually(async () => (await api('/api/access')).idleMinutes === 0, 'the idle lock could not be turned off');
  await b.type('#access-current', 'studio-test-password');
  await b.clickText('Remove password');
  await eventually(async () => (await text('#access-status')).startsWith('No password is set'), 'the password was not removed');
  check((await anon('api/clients')) === 200, 'the API stayed locked after the password was removed');
});

await flow('Staff levels: each person signs in; front desk cannot delete or see money and settings', async () => {
  const setLevel = async (name, level, password) => {
    await press('.staff-row', name, 'Edit');
    await eventually(async () => b.evaluate(`getComputedStyle(document.getElementById('staff-form-access')).display !== 'none'`), 'the login fields are not shown to the administrator');
    await b.evaluate(`(() => { const s = document.getElementById('staff-form-level'); s.value = '${level}'; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    if (password) await b.type('#staff-form-login-password', password);
    await b.clickText('Save staff member');
  };
  const signIn = async (name, password) => {
    await eventually(async () => b.evaluate(`!!document.getElementById('login-password')`), 'the sign-in page is not shown');
    await eventually(async () => b.evaluate(`[...document.getElementById('login-who').options].some(o => o.text === ${JSON.stringify(name)})`), `${name} is not on the sign-in page`);
    await b.evaluate(`(() => { const s = document.getElementById('login-who'); s.value = [...s.options].find(o => o.text === ${JSON.stringify(name)}).value; })()`);
    await b.type('#login-password', password);
    await b.clickText('Sign in');
    await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-dashboard')`), `${name} could not sign in`);
  };
  await b.goto(url);
  await b.clickText('Settings');
  await b.type('#access-next', 'studio-test-password');
  await b.clickText('Set password');
  await eventually(async () => (await text('#access-status')).startsWith('A password is set'), 'the studio password was not saved');
  const [admin] = await api('/api/staff');
  try {
    // a new person gets a front desk login, before anyone has an administrator login (Henry, 1.0.20: refused)
    await b.clickText('Staff Login');
    await eventually(async () => (await text('#staff-list-body')).includes(admin.name), 'the staff list is empty');
    await b.clickText('Add staff member');
    await b.type('#staff-form-name', 'Desk Flow');
    await b.evaluate(`(() => { const s = document.getElementById('staff-form-level'); s.value = 'front_desk'; })()`);
    await b.type('#staff-form-login-password', 'desk-pass-123');
    await b.clickText('Save staff member');
    await eventually(async () => (await text('#staff-list-body')).includes('Front desk'), 'the front desk login was not created');
    // front desk: signs in by name; no Settings, no Finance, no deleting, no money reports; clients yes
    await b.evaluate('signOutOfStudio()');
    await signIn('Desk Flow', 'desk-pass-123');
    await eventually(async () => !(await b.evaluate(`!!document.getElementById('nav-dest-settings').offsetParent`)), 'front desk still sees Settings');
    check(!(await b.evaluate(`!!document.getElementById('nav-dest-finance').offsetParent`)), 'front desk still sees Finance');
    check((await b.evaluate(`fetch('/api/financial').then(r => r.status)`)) === 403, 'front desk can read the money reports');
    const [someClient] = await api('/api/clients');
    check((await b.evaluate(`fetch('/api/clients/${someClient.id}', { method: 'DELETE' }).then(r => r.status)`)) === 403, 'front desk can delete a client');
    await eventually(async () => (await b.evaluate('window.__ct.sig.added.join(" ")')).includes('Your level (Front desk) cannot do this'), 'a refused action shows no message');
    await b.clickText('Clients');
    await b.clickText('New Client');
    await b.type('#new-client-name', 'Desk Made Client');
    await b.clickText('Save client');
    await eventually(async () => (await api('/api/clients')).some((cl) => cl.name === 'Desk Made Client'), 'front desk cannot add a client');
    // a wrong password for a person is refused
    await b.evaluate('signOutOfStudio()');
    await eventually(async () => b.evaluate(`!!document.getElementById('login-password')`), 'the sign-in page is not shown');
    await b.type('#login-password', 'not-their-password');
    await b.clickText('Sign in');
    await eventually(async () => (await text('#error')) === 'Wrong password', 'a wrong password was not refused');
    // the studio password (first on the list) still signs in as administrator, who gives themself a login
    await b.type('#login-password', 'studio-test-password');
    await b.clickText('Sign in');
    await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-settings').offsetParent`), 'the studio password no longer signs in as administrator');
    await eventually(async () => (await text('#topbar-user-name')) === 'Staff Login', async () => 'the top bar still names the person who signed in before: ' + await text('#topbar-user-name'));
    await pressOn('openStaffLoginModal()');
    await eventually(async () => (await text('#staff-list-body')).includes(admin.name), 'the staff list is empty');
    await setLevel(admin.name, 'admin', 'admin-pass-123');
    await eventually(async () => (await text('#staff-list-body')).includes('Administrator'), 'the administrator level is not shown');
    await b.evaluate('signOutOfStudio()');
    await signIn(admin.name, 'admin-pass-123');
    await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-settings').offsetParent`), 'the administrator does not see Settings');
  } finally {
    // back to a studio without logins or a password, for the flows after this one
    await b.goto(url);
    // the studio password signs in as administrator, whoever was signed in before
    await b.evaluate(`fetch('/api/access/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'studio-test-password' }) })`).catch(() => {});
    for (const p of await b.evaluate(`fetch('/api/staff').then(r => r.json())`).catch(() => [])) {
      await b.evaluate(`fetch('/api/access/staff-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staff_id: ${p.id}, remove: true }) })`).catch(() => {});
    }
    await b.evaluate(`fetch('/api/access/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current: 'studio-test-password', next: '' }) })`).catch(() => {});
  }
});

await flow('Roles: an administrator makes a role with its own areas; that person sees and changes only those', async () => {
  // Henry, 2026-10-19: "a checkbox for what each role can access", and roles of the studio's own ("Sterilization")
  const anon = (p, init) => b.evaluate(`fetch(${JSON.stringify(p)}, ${JSON.stringify(init || {})}).then(r => r.status)`);
  await b.goto(url);
  await b.clickText('Settings');
  await b.type('#access-next', 'studio-test-password');
  await b.clickText('Set password');
  await eventually(async () => (await text('#access-status')).startsWith('A password is set'), 'the studio password was not saved');
  try {
    await eventually(async () => b.evaluate(`getComputedStyle(document.getElementById('roles-card')).display !== 'none'`), 'the Roles card is not shown to the administrator');
    check((await text('#roles-list')).includes('Front desk') && (await text('#roles-list')).includes('Administrator'), 'the Roles card does not list the roles');
    // a new role, Sterilization, with one area; Front desk also gets the stock
    await b.clickText('Add role');
    await b.evaluate(`(() => { const inputs = document.querySelectorAll('#roles-list input[type="text"]'); const el = inputs[inputs.length - 1]; el.value = 'Sterilization'; el.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    const tick = (role, area) => b.evaluate(`(() => { const row = [...document.querySelectorAll('#roles-list .role-row')].find(r => (r.querySelector('strong') || {}).innerText === ${JSON.stringify(role)} || (r.querySelector('input[type="text"]') || {}).value === ${JSON.stringify(role)});
      const box = [...row.querySelectorAll('label')].find(l => l.innerText.trim() === ${JSON.stringify(area)}).querySelector('input'); box.click(); return box.checked; })()`);
    check(await tick('Sterilization', 'Sterilization and compliance'), 'the area could not be ticked');
    check(await tick('Front desk', 'Stock and suppliers'), 'the Front desk area could not be ticked');
    await b.clickText('Save roles');
    await eventually(async () => (await api('/api/access')).roles.some((r) => r.name === 'Sterilization' && r.perms.join() === 'compliance'), 'the new role was not saved');
    check((await api('/api/access')).roles.find((r) => r.id === 'front_desk').perms.includes('stock'), 'the Front desk change was not saved');
    // the new person gets the role from the staff list
    await pressOn('openStaffLoginModal()');
    await b.clickText('Add staff member');
    await b.type('#staff-form-name', 'Steri Flow');
    check(await b.evaluate(`[...document.getElementById('staff-form-level').options].some(o => o.text === 'Sterilization')`), 'the staff form does not offer the new role');
    await b.evaluate(`(() => { const s = document.getElementById('staff-form-level'); s.value = [...s.options].find(o => o.text === 'Sterilization').value; })()`);
    await b.type('#staff-form-login-password', 'steri-pass-123');
    await b.clickText('Save staff member');
    await eventually(async () => (await text('#staff-list-body')).includes('Sterilization'), 'the staff list does not show the role');
    // a role someone has cannot be removed
    const roles = (await api('/api/access')).roles.filter((r) => r.name !== 'Sterilization');
    check((await anon('/api/access/roles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roles }) })) === 400, 'a role still given to someone was removed');
    // signed in as Steri Flow: Compliance yes; Clients, Calendar, Stock, Money, Settings no, and the server agrees
    await b.evaluate('signOutOfStudio()');
    await eventually(async () => b.evaluate(`!!document.getElementById('login-who')`), 'the sign-in page is not shown');
    await eventually(async () => b.evaluate(`[...document.getElementById('login-who').options].some(o => o.text === 'Steri Flow')`), 'Steri Flow is not on the sign-in page');
    await b.evaluate(`(() => { const s = document.getElementById('login-who'); s.value = [...s.options].find(o => o.text === 'Steri Flow').value; })()`);
    await b.type('#login-password', 'steri-pass-123');
    await b.clickText('Sign in');
    await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-dashboard')`), 'Steri Flow could not sign in');
    await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-compliance').offsetParent`), 'the role does not see Compliance');
    for (const dest of ['clients', 'calendar', 'inventory', 'finance', 'settings']) {
      check(!(await b.evaluate(`!!document.getElementById('nav-dest-${dest}').offsetParent`)), `the role still sees ${dest}`);
    }
    await b.evaluate(`navigateToDestination('clients')`);
    check(!(await b.evaluate(`document.getElementById('dest-clients').offsetParent`)), 'a shortcut still opens a screen the role does not have');
    check((await anon('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Not Allowed' }) })) === 403, 'the role can add a client');
    check((await anon('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Not Allowed' }) })) === 403, 'the role can change the stock');
    check((await anon('/api/financial')) === 403, 'the role can read the money reports');
    const logged = await anon('/api/compliance/autoclave-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoclave_id: 'Flow Autoclave', station: 'Flow Room', cycle_number: 7, temperature_c: 134, pressure_bar: 2.1, duration_minutes: 18, spore_test_result: 'PASS', technician: 'Steri Flow' }) });
    check(logged >= 200 && logged < 300, 'the role cannot record a sterilization cycle: ' + logged);
  } finally {
    // back to a studio without logins, roles or a password, for the flows after this one
    await b.goto(url);
    await b.evaluate(`fetch('/api/access/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'studio-test-password' }) })`).catch(() => {});
    for (const p of await b.evaluate(`fetch('/api/staff').then(r => r.json())`).catch(() => [])) {
      await b.evaluate(`fetch('/api/access/staff-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staff_id: ${p.id}, remove: true }) })`).catch(() => {});
    }
    await b.evaluate(`fetch('/api/access/roles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roles: [{ id: 'front_desk', perms: ['clients'] }, { id: 'staff', perms: ['clients', 'stock', 'compliance', 'rota', 'forms'] }] }) })`).catch(() => {});
    await b.evaluate(`fetch('/api/access/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current: 'studio-test-password', next: '' }) })`).catch(() => {});
  }
});

await flow('A Staff login cannot reach Finance: not in the second after a reload, not by switching to the administrator', async () => {
  // Henry, 2026-10-19: Maya (Staff) chose the administrator in Switch Staff User, clicked Finance while it
  // still showed, read the money records and recorded $150
  const call = (p, init) => b.evaluate(`fetch(${JSON.stringify(p)}, ${JSON.stringify(init || {})}).then(r => r.status)`);
  const post = (p, body) => call(p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  await b.goto(url);
  check((await post('/api/access/password', { next: 'studio-test-password' })) === 200, 'the studio password could not be set');
  const team = await api('/api/staff');
  const maya = team[0], boss = team[1];
  try {
    check((await post('/api/access/staff-login', { staff_id: maya.id, level: 'staff', password: 'maya-pass-123' })) === 200, 'Maya was not given a Staff login');
    check((await post('/api/access/staff-login', { staff_id: boss.id, level: 'admin', password: 'boss-pass-123' })) === 200, 'the administrator login was not made');
    await post('/api/access/logout', {});
    check((await post('/api/access/login', { staff_id: maya.id, password: 'maya-pass-123' })) === 200, 'Maya could not sign in');
    // the server: the ledger and its exports are money reports too (they were open to every login)
    for (const p of ['/api/financial', '/api/accounting/ledger-timeseries', '/api/accounting/reconciliation-check', '/api/accounting/export/quickbooks', '/api/accounting/export/sage', '/api/accounting/health', '/api/accounting/config']) {
      check((await call(p)) === 403, `Staff can read ${p}`);
    }
    // the screen: from the first paint, no Finance to click before the role is known, and no way in after
    // the page loaded before Maya signed in still thinks it is the administrator's: wait for the new one
    await b.evaluate('(() => { window.__beforeReload = true; location.reload(); })()');
    let early = null;
    for (let i = 0; i < 400 && early === null; i++) {
      early = await b.evaluate(`(() => { const el = document.getElementById('nav-dest-finance'); if (!el || window.__beforeReload) return null; navigateToDestination('finance'); return { menu: !!el.offsetParent, screen: !!document.getElementById('dest-finance').offsetParent }; })()`).catch(() => null);
    }
    check(early && !early.menu, 'Finance shows in the menu before the role is known');
    check(early && !early.screen, 'Finance opens before the role is known');
    await eventually(async () => b.evaluate(`document.body.dataset.level === 'staff'`), 'the role never loaded');
    await b.evaluate(`navigateToDestination('finance')`);
    check(!(await b.evaluate(`!!document.getElementById('dest-finance').offsetParent`)), 'Finance opens for Staff');
    // Switch Staff User: no choosing the administrator without their password; Sign out instead
    await pressOn('openStaffLoginModal()');
    await eventually(async () => (await text('#staff-list-body')).includes(boss.name), 'the staff list is empty');
    check(!(await b.evaluate(`[...document.querySelectorAll('#staff-list-body button')].some(x => ['Select', 'Edit', 'Remove'].includes(x.innerText.trim()))`)), 'Staff can still Select, Edit or Remove a person');
    check(!(await b.evaluate(`!!document.getElementById('staff-add-btn').offsetParent`)), 'Staff can still add a person');
    await b.evaluate(`selectActiveStaff(${boss.id})`);
    check((await text('#topbar-user-name')).includes(maya.name), 'the top bar names someone other than the person signed in: ' + await text('#topbar-user-name'));
    check(await b.evaluate(`!!document.getElementById('staff-signout-btn').offsetParent`), 'there is no Sign out for Staff');
    await b.clickText('Sign out', '#staff-login-modal-overlay');
    await eventually(async () => b.evaluate(`!!document.getElementById('login-who')`), 'Sign out did not bring back the sign-in page');
  } finally {
    await b.goto(url);
    await post('/api/access/login', { password: 'studio-test-password' }).catch(() => {});
    for (const p of [maya, boss]) await post('/api/access/staff-login', { staff_id: p.id, remove: true }).catch(() => {});
    await post('/api/access/password', { current: 'studio-test-password', next: '' }).catch(() => {});
  }
});

await flow('First start: the CRM asks for a studio password before anything loads', async () => {
  const fresh = await startFreshServer(Number(process.env.CLICK_PORT || 3412) + 7);
  try {
    check((await fetch(fresh.url + 'api/clients').then((r) => r.status)) === 401, 'a new studio answers data requests before the first-start choice');
    await b.goto(fresh.url);
    check(await b.evaluate(`document.body.innerText.includes('Welcome to Studio CRM')`), 'a new studio does not ask for a password');
    // the page speaks the language this device chose in the CRM
    await b.evaluate(`(() => { localStorage.setItem('studio_crm_lang', 'de'); location.reload(); })()`);
    await eventually(async () => b.evaluate(`document.body.innerText.includes('Willkommen bei Studio CRM')`), 'the first-start page ignores the chosen language');
    await b.evaluate(`(() => { localStorage.setItem('studio_crm_lang', 'en'); location.reload(); })()`);
    await eventually(async () => b.evaluate(`document.body.innerText.includes('Welcome to Studio CRM')`), 'the first-start page did not go back to English');
    await b.type('#setup-password', 'first-start-pass');
    await b.type('#setup-again', 'not-the-same-pass');
    await b.clickText('Create password and open the CRM');
    await eventually(async () => (await text('#error')).includes('not the same'), 'two different passwords were accepted');
    await b.type('#setup-again', 'first-start-pass');
    await b.clickText('Create password and open the CRM');
    await eventually(async () => b.evaluate(`!!document.getElementById('nav-dest-settings')`), 'creating the password did not open the CRM');
    check((await fetch(fresh.url + 'api/clients').then((r) => r.status)) === 401, 'the new password does not protect the data');
  } finally { await fresh.stop(); }
});

// A client on the kiosk page: types in every box, picks in every list and choice, ticks every box, adds a photo.
const CLIENT_FILLS_PAGE = `(async () => { const m = document.getElementById('tablet-kiosk-modal');
  const ev = (el) => { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
  for (const el of m.querySelectorAll('input, textarea, select')) {
    if (el.type === 'file') {
      const c = document.createElement('canvas'); c.width = c.height = 8; c.getContext('2d').fillRect(0, 0, 8, 8);
      const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
      const dt = new DataTransfer(); dt.items.add(new File([blob], 'arm.png', { type: 'image/png' })); el.files = dt.files; ev(el); continue;
    }
    if (!el.offsetParent) continue;
    if (el.type === 'checkbox') { if (!el.checked) el.click(); }
    else if (el.type === 'radio') { if (!m.querySelector('input[type=radio][name="' + el.name + '"]:checked')) el.click(); }
    else if (el.tagName === 'SELECT') { if (el.options.length > 1) { el.selectedIndex = 1; ev(el); } }
    else if (el.type === 'date') { el.value = '1990-05-04'; ev(el); }
    else if (el.type === 'email') { el.value = 'client@example.com'; ev(el); }
    else if (el.type === 'tel') { el.value = '555-0101'; ev(el); }
    else { el.value = 'Typed ' + (el.name || el.id); ev(el); }
  } })()`;

await flow('Kiosk tablet: signs in with its own password, receives a form from the desk, the signed form lands on the client', async () => {
  // Henry, 2026-10-15: a tablet on a stand waits; the desk sends a form; the client signs; it returns to waiting
  const k = await launchBrowser();          // the tablet: a second device with its own sign-in
  try {
    await b.clickText('Settings');
    await b.type('#access-next', 'studio-test-password');
    await b.clickText('Set password');
    await eventually(async () => (await text('#access-status')).startsWith('A password is set'), 'the studio password was not saved');
    await eventually(async () => b.evaluate(`getComputedStyle(document.getElementById('kiosk-access-form')).display !== 'none'`), 'the kiosk password field is not shown');
    await b.type('#kiosk-access-next', 'kiosk-pass-1');
    await b.clickText('Set kiosk password');
    await eventually(async () => (await api('/api/access')).kioskPasswordSet, 'the kiosk password was not saved');
    check((await text('#kiosk-address')).endsWith('/kiosk'), 'Settings does not say which address to open on the tablet');
    // Settings may be open on the server itself (localhost): the address shown must be one a tablet can reach
    if ((await api('/api/kiosk/addresses')).http.length) await eventually(async () => !/localhost|127\.0\.0\.1/.test(await text('#kiosk-address')), async () => 'Settings shows a tablet an address it cannot reach: ' + await text('#kiosk-address'));

    await k.tablet();
    await k.goto(url + 'kiosk');
    await eventually(async () => k.evaluate(`document.getElementById('login').classList.contains('on')`), 'the kiosk page does not ask for the kiosk password');
    await k.type('#login-password', 'studio-test-password');
    await k.clickText('Sign in');
    await eventually(async () => (await k.evaluate(`document.getElementById('login-error').innerText`)) === 'Wrong password', 'the studio password was accepted as the kiosk password');
    await k.type('#login-password', 'kiosk-pass-1');
    await k.type('#login-name', 'Front Stand');
    await k.clickText('Sign in');
    await eventually(async () => k.evaluate(`document.getElementById('idle').classList.contains('on')`), 'the signed-in kiosk does not show the waiting screen');
    // a kiosk reaches nothing of the CRM
    check((await k.evaluate(`fetch('/api/clients').then(r => r.status)`)) === 403, 'a kiosk tablet can read the client list');
    check((await k.evaluate(`fetch('/api/kiosk/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then(r => r.status)`)) === 403, 'a kiosk tablet can send forms');
    check((await k.evaluate(`fetch('/').then(r => r.url)`)).endsWith('/kiosk'), 'a kiosk tablet can open the CRM page');
    await eventually(async () => (await api('/api/kiosk/devices')).some((d) => d.kiosk === 'Front Stand' && d.online), 'the desk does not see the kiosk', 8);

    // the desk: a new client, the consent form, Send to kiosk
    const made = await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Stand Client', email: 'stand@example.com' }) }).then(r => r.json())`);
    await b.goto(url);
    await b.clickText('Clients');
    await press('.client-directory-row', 'Stand Client', 'Sign Waiver');
    const f = b.frame('#form-builder-frame');
    for (let i = 0; i < 80 && !(await f.evaluate('!!(window.__ct && window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("btn-preview"))').catch(() => false)); i++) await sleep(250);
    await sleep(800);
    await f.clickText('Preview Form');
    await eventually(async () => f.evaluate(`!!document.getElementById('crm-send-kiosk-btn')`), 'there is no Send to kiosk button');
    await f.clickText('Send to kiosk');
    await eventually(async () => (await api('/api/kiosk/devices')).some((d) => d.waiting && d.waiting.clientName === 'Stand Client'), 'the form did not reach the kiosk queue');

    // the tablet: the form opens by itself in kiosk mode; the client fills it in, signs, completes
    const kf = k.frame('#frame');
    await eventually(async () => kf.evaluate(`!!document.getElementById('tablet-kiosk-modal') && getComputedStyle(document.getElementById('tablet-kiosk-modal')).display !== 'none'`).catch(() => false), 'the form did not open on the kiosk', 20);
    check(!(await kf.evaluate(`!!(document.querySelector('.btn-exit-kiosk') || {}).offsetParent`)), 'the client can leave the form on the kiosk');
    // the client fills each page: a page with a required question left empty does not let the client on
    const fillPage = () => kf.evaluate(CLIENT_FILLS_PAGE);
    for (let i = 0; i < 12 && !(await kf.evaluate(`window.ActiveFormPreview.currentKioskStep >= window.ActiveFormPreview.getKioskSections().length - 1`)); i++) { await fillPage(); await kf.clickText('Next Step', '#tablet-kiosk-modal'); }
    check(await kf.evaluate(`window.ActiveFormPreview.currentKioskStep >= window.ActiveFormPreview.getKioskSections().length - 1`), 'the sample answers did not get the client to the last page: ' + await kf.evaluate(`(document.getElementById('kiosk-missing-note') || {}).innerText || 'no note'`));
    await fillPage();
    await kf.scribble('#tablet-kiosk-modal canvas.signature-pad-canvas');
    check(!(await kf.evaluate(`document.getElementById('tablet-kiosk-modal').innerText`)).includes('PDF'), 'the kiosk promises the client a PDF it never shows');
    await kf.clickText('Complete', '#tablet-kiosk-modal');
    await eventually(async () => k.evaluate(`document.getElementById('done').classList.contains('on')`), 'the kiosk did not say Thank you', 8);
    const forms = (await api(`/api/clients/${made.id}/profile`)).consent_forms;
    check(forms.length === 1 && forms[0].signed, 'the signed form is not on the client record');
    check(!k.seen.downloads.length, 'the kiosk saved a file on the tablet: ' + k.seen.downloads.join(', '));
    check((await api('/api/activity-logs?limit=20')).some((a) => a.action === 'KIOSK_FORM_SIGNED'), 'the studio is not told the form was completed');
    await eventually(async () => k.evaluate(`document.getElementById('idle').classList.contains('on')`), 'the kiosk did not go back to waiting', 12);

    // the desk takes a form back (the client left): the tablet returns to waiting
    await f.clickText('Send to kiosk');
    await eventually(async () => kf.evaluate(`!!document.getElementById('tablet-kiosk-modal') && getComputedStyle(document.getElementById('tablet-kiosk-modal')).display !== 'none'`).catch(() => false), 'the second form did not open on the kiosk', 20);
    await f.clickText('Send to kiosk');
    await eventually(async () => b.evaluate(`!!document.getElementById('kiosk-chooser')`), 'with a form waiting, the desk is not asked what to do');
    await b.clickText('Take back');
    await eventually(async () => k.evaluate(`document.getElementById('idle').classList.contains('on') && !document.getElementById('frame').classList.contains('on')`), 'the kiosk kept a form the desk took back', 10);
    check(!(await b.evaluate(`!!document.getElementById('kiosk-chooser')`)), 'the kiosk chooser stayed open after Take back');

    // a form waiting on another tablet stays hidden from this one, whatever name this tablet asks with
    const other = await b.evaluate(`fetch('/api/kiosk/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: ${made.id}, kiosk: 'Back Stand', formName: 'Other form', schema: { sections: [] } }) }).then(r => r.json())`);
    const peek = await k.evaluate(`fetch('/api/kiosk/next?kiosk=Back%20Stand').then(r => r.json())`);
    check(peek.kiosk === 'Front Stand' && !peek.item, 'a kiosk can read the form waiting on another tablet: ' + JSON.stringify(peek).slice(0, 120));
    check((await k.evaluate(`fetch('/api/kiosk/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kiosk: 'Back Stand', id: ${Number(other.id)}, responses: {} }) }).then(r => r.status)`)) === 409, 'a kiosk can complete the form waiting on another tablet');
    check((await api('/api/kiosk/devices')).some((d) => d.kiosk === 'Back Stand' && d.waiting), 'the other tablet lost its form');

    // the CRM restarts (an update, a power cut): the tablet stays signed in and the waiting form is still there
    await restart();
    await b.goto(url);
    await b.evaluate(`fetch('/api/access/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'studio-test-password' }) })`);
    check((await api('/api/kiosk/devices')).some((d) => d.kiosk === 'Back Stand' && d.waiting && d.waiting.clientName === 'Stand Client'), 'a restart dropped the form waiting on a tablet');
    const after = await k.evaluate(`fetch('/api/kiosk/next?kiosk=Back%20Stand').then(r => r.status + ' ' + r.headers.get('content-type'))`);
    check(after.startsWith('200'), 'after a restart the tablet is signed out: ' + after);
    check((await k.evaluate(`fetch('/api/kiosk/next').then(r => r.json())`)).kiosk === 'Front Stand', 'after a restart the tablet lost its own name');
    await sleep(4000);
    check(await k.evaluate(`document.getElementById('idle').classList.contains('on') && !document.getElementById('login').classList.contains('on')`), 'after a restart the tablet asks for the kiosk password again');
    await b.evaluate(`fetch('/api/kiosk/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kiosk: 'Back Stand' }) })`);
    check(!k.seen.errors.length, 'script error on the kiosk: ' + k.seen.errors[0]);
  } finally {
    await k.close().catch(() => {});
    await b.goto(url);
    await b.evaluate(`fetch('/api/access/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'studio-test-password' }) })`).catch(() => {});
    await b.evaluate(`fetch('/api/access/kiosk-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: '' }) })`).catch(() => {});
    await b.evaluate(`fetch('/api/access/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current: 'studio-test-password', next: '' }) })`).catch(() => {});
  }
});

await flow('Kiosk: every kind of answer the client gives (medical boxes, yes/no, photo, signature) is kept, shown and printed', async () => {
  // Henry, 2026-10-17: medical answers missing, a photo shown as [object Object], required questions skipped,
  // the client's medical overview left empty, no PDF of the completed form
  const k = await launchBrowser();
  try {
    // this tablet, not one an earlier flow left in the list
    const before = (await api('/api/kiosk/devices')).map((d) => d.kiosk);
    await k.tablet();
    await k.goto(url + 'kiosk');
    await eventually(async () => k.evaluate(`document.getElementById('login').classList.contains('on') || document.getElementById('idle').classList.contains('on')`), 'the kiosk page did not open', 10);
    await k.goto(url + 'kiosk?name=Side%20Stand');   // the kiosk page takes its name from ?name=
    if (await k.evaluate(`document.getElementById('login').classList.contains('on')`)) { await k.type('#login-name', 'Side Stand'); await k.clickText('Sign in'); }
    await eventually(async () => k.evaluate(`document.getElementById('idle').classList.contains('on')`), 'the kiosk does not wait for a form', 10);
    const made = await b.evaluate(`fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Every Answer' }) }).then(r => r.json())`);
    // the Medical History form, with a photo question added, as the desk would build it
    await b.goto(url + 'tools/form-builder/index.html');
    await eventually(async () => b.evaluate(`!!(window.FormTemplates && window.FormBuilderApp)`), 'the form builder did not load', 20);
    const schema = await b.evaluate(`(() => { const f = JSON.parse(JSON.stringify(window.FormTemplates.formTemplates.medical_history_intake));
      f.sections.find((s) => s.id === 'client_identity').fields.push({ id: 'reference_photo', type: 'photo_id', label: 'Reference photo' }); return f; })()`);
    await b.goto(url);
    let device;
    await eventually(async () => { device = (await api('/api/kiosk/devices')).find((d) => d.online && d.kiosk === 'Side Stand'); return !!device; }, 'the desk does not see this tablet: ' + before.join(', '), 10);
    check(device, 'the desk does not see the kiosk');
    await b.evaluate(`fetch('/api/kiosk/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: ${made.id}, kiosk: ${JSON.stringify(device && device.kiosk)}, formName: ${JSON.stringify(schema.name)}, schema: ${JSON.stringify(schema)} }) })`);
    const kf = k.frame('#frame');
    await eventually(async () => kf.evaluate(`!!document.getElementById('tablet-kiosk-modal') && getComputedStyle(document.getElementById('tablet-kiosk-modal')).display !== 'none'`).catch(() => false), 'the form did not open on the kiosk', 20);
    // page 1 is the studio's own details: no "required" stars the client would read as skipped questions
    check(await kf.evaluate(`/^studio_/.test(window.ActiveFormPreview.getKioskSections()[0].id) && !document.querySelector('#tablet-kiosk-modal .required-star')`), 'the studio page on the kiosk shows required stars');
    // an update while the client fills the form in: the tablet does not reload the form away
    await k.evaluate(`(window.kioskVersion = '0.0.0', window.__stillHere = true)`);
    await sleep(4000);
    check(await k.evaluate(`window.__stillHere === true`), 'an update reloaded the tablet with a client form open');

    // a required question left empty keeps the client on the page
    const page = () => kf.evaluate(`window.ActiveFormPreview.currentKioskStep`);
    const last = await kf.evaluate(`window.ActiveFormPreview.getKioskSections().length - 1`);
    let step = 0, stopped = false;
    // on every page, as a client: type in every box, pick in every list and choice, tick every box, add the photo
    for (let i = 0; i <= last + 2 && step < last; i++) {
      // the studio's own page is not the client's to fill (its practitioner box is empty until the studio fills it)
      if (!stopped && !(await kf.evaluate(`/^studio_/.test((window.ActiveFormPreview.getKioskSections()[window.ActiveFormPreview.currentKioskStep] || {}).id || '')`)) && await kf.evaluate(`[...document.querySelectorAll('#tablet-kiosk-modal input[data-required="true"], #tablet-kiosk-modal textarea[data-required="true"]')].some((el) => el.offsetParent && ['text', 'email', 'tel', 'textarea'].includes(el.type) && !el.value)`)) {
        await kf.clickText('Next Step', '#tablet-kiosk-modal');
        check((await page()) === step && /Please complete/.test(await kf.evaluate(`document.getElementById('tablet-kiosk-modal').innerText`)), 'the kiosk moved on with a required question empty');
        stopped = true;
      }
      await kf.evaluate(CLIENT_FILLS_PAGE);
      await sleep(300);
      await kf.clickText('Next Step', '#tablet-kiosk-modal');
      step = await page();
    }
    check(stopped, 'the form had no required question to test');
    check(step === last, 'the client could not reach the last page');
    await kf.evaluate(CLIENT_FILLS_PAGE);
    await kf.scribble('#tablet-kiosk-modal canvas.signature-pad-canvas');
    await kf.clickText('Complete', '#tablet-kiosk-modal');
    await eventually(async () => k.evaluate(`document.getElementById('done').classList.contains('on')`), 'the kiosk did not save the form: ' + await kf.evaluate(`(document.getElementById('kiosk-missing-note') || {}).innerText || ''`).catch(() => ''), 8);

    // everything the client gave is saved
    const listed = (await api(`/api/clients/${made.id}/profile`)).consent_forms[0];
    check(listed && listed.signed, 'the form is not saved as signed');
    const form = await api('/api/consent-forms/' + listed.id);
    const r = form.responses;
    check(Array.isArray(r.conditions) && r.conditions.length && Array.isArray(r.allergies) && r.allergies.length, 'the medical boxes were lost: ' + JSON.stringify(Object.keys(r)));
    check(r.blood_thinners && r.full_name === 'Typed full_name', 'the yes/no or typed answers were lost');
    // the physician box only shows when clearance is needed; either way it never gets today's date put in it
    check(!/^\d{4}-\d{2}-\d{2}$/.test(String(r.doctor_details || '')), "today's date was put in the physician name box: " + r.doctor_details);
    check(Array.isArray(r.reference_photo) && /^data:image/.test((r.reference_photo[0] || {}).dataUrl || ''), 'the photo was not saved');
    const med = form.schema.sections.find((s) => s.type === 'medical_section');
    check(med && med.fields && med.fields.some((f) => f.id === 'conditions'), 'the medical questions were not saved with the form');

    // the client's record shows what the client declared
    const client = (await api(`/api/clients/${made.id}/profile`)).client;
    check(String(client.allergies).includes(r.allergies[0]) && String(client.medical_history).includes(r.conditions[0]), 'the medical overview did not get the declared allergies and conditions');

    // View answers shows the medical answers, the photo as a picture, nothing as [object Object]
    await b.evaluate(`openClientProfileModal(${made.id})`);
    await sleep(1200);
    await b.evaluate(`switchClientProfileTab('waivers')`);
    await b.evaluate(`viewClientConsentForm(${listed.id})`);
    await eventually(async () => (await text('#client-profile-modal-body')).includes(r.conditions[0]), 'View answers does not show the medical conditions');
    const shown = await text('#client-profile-modal-body');
    check(!shown.includes('[object Object]'), 'View answers shows [object Object]');
    check(await b.evaluate(`!!document.querySelector('#client-profile-modal-body img[alt="arm.png"]')`), 'View answers does not show the photo');
    // the laid-out PDF of the completed form
    b.reset();
    await pressOn(`downloadConsentFormPDF(${listed.id})`);
    await eventually(async () => b.seen.downloads.some((d) => d.endsWith('.pdf')), 'the PDF of the completed form was not made', 25);
    await b.evaluate(`closeClientProfileModal()`);
    // ...and once it waits again, it reloads itself onto the new version (it was told 0.0.0 above)
    await eventually(async () => k.evaluate(`document.getElementById('idle').classList.contains('on') && window.__stillHere === undefined`).catch(() => false), 'after an update the waiting tablet kept the old pages', 20);
    check(!k.seen.errors.length, 'script error on the kiosk: ' + k.seen.errors[0]);
  } finally {
    await k.close().catch(() => {});
  }
});

await flow('Thai: the form builder, the consent form on the kiosk and the PDFs show Thai', async () => {
  await b.goto(url);
  await b.evaluate(`setLanguage('th')`);
  try {
    await b.evaluate(`openFormBuilderModal()`);
    const f = b.frame('#form-builder-frame');
    for (let i = 0; i < 80 && !(await f.evaluate('!!(window.__ct && window.FormBuilderApp && window.FormBuilderApp.currentForm && document.getElementById("btn-preview"))').catch(() => false)); i++) await sleep(250);
    await sleep(800);
    const thai = (s) => /[฀-๿]/.test(s);
    check((await f.evaluate(`window.i18n.currentLanguage`)) === 'th', 'the form builder did not follow the CRM to Thai');
    check(thai(await f.evaluate(`document.getElementById('btn-preview').innerText`)), 'the form builder buttons are not in Thai');
    await f.evaluate(`document.getElementById('btn-preview').click()`); await sleep(600);
    await f.evaluate(`document.getElementById('btn-toggle-kiosk').click()`); await sleep(600);
    const kiosk = await f.evaluate(`document.getElementById('tablet-kiosk-modal').innerText`);
    check(thai(kiosk), 'the kiosk is not in Thai: ' + kiosk.slice(0, 120));
    check(thai(await f.evaluate(`window.FormBuilderApp.currentForm.sections.map((s) => s.title).join(' ')`)), 'the consent form itself was not translated to Thai');
    // Helvetica has no Thai letters: a PDF with a Thai name must carry a Thai font
    const pdf = await f.evaluate(`(() => { const d = new window.jspdf.jsPDF(); d.text('ลูกค้า: สมชาย ใจดี', 10, 10); return d.output(); })()`);
    check(pdf.includes('/Sarabun'), 'a PDF with Thai text has no Thai font');
    // the fixed wording of the PDFs follows the language too (it is not on the page, so the page translator never saw it)
    const pdfText = (w, run) => w.evaluate(`(async () => { const J = window.jspdf.jsPDF, seen = [];
      window.jspdf.jsPDF = function (...args) { const d = new J(...args), text = d.text;
        d.text = function (t, ...rest) { seen.push([].concat(t).join(' ')); return text.call(this, t, ...rest); };
        d.save = function () { return this; }; return d; };
      try { await (${run})(); } finally { window.jspdf.jsPDF = J; }
      return seen.join(' | '); })()`);
    const consent = await pdfText(f, `() => window.PDFGenerator.generateFormPDF(window.FormBuilderApp.currentForm, {}, null)`);
    check(consent.includes('การรับรองทางกฎหมาย') && consent.includes('หน้า 1 จาก') && !consent.includes('LEGAL CERTIFICATION'), 'the consent form PDF wording is not in Thai: ' + consent.slice(-200));
    await eventually(async () => (await b.evaluate(`pdfLabel('Signed waiver')`)) !== 'Signed waiver', 'the CRM has no Thai for its PDF labels');
    const receipt = await pdfText(b, `() => generateClientAppointmentReceiptPDF({ id: 1, client_name: 'สมชาย', estimated_price: 100 })`);
    check(receipt.includes('ใบเสร็จการนัดหมาย'), 'the receipt PDF title is not in Thai: ' + receipt.slice(0, 160));
  } finally {
    await b.evaluate(`setLanguage('en')`);
  }
});

await stop();
console.log(failures.length ? `\n${failures.length} flow(s) failed` : '\nAll flows passed');
process.exit(failures.length ? 1 : 0);
