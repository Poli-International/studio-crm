// The jobs a studio does every day, done with real mouse clicks in a real
// browser: add, open, edit and delete a client; add, edit and remove staff;
// export files; clock in; import a CSV; fill, sign and save the tablet form.
// Each step fails loudly, so a button that stops working blocks the release.
//
//   node tests/click/flows.mjs
import { startApp } from './app.mjs';
import { sleep } from './cdp.mjs';

const { browser: b, url, httpsPort, stop } = await startApp();
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
  await b.evaluate(`document.getElementById('rota-date').value = new Date().toLocaleDateString('en-CA')`);
  await b.clickText('Add shift');
  await eventually(async () => (await text('#shift-roster-tbody')).includes('Remove'), 'the shift is not in the rota');
  for (const [button, file] of [['Download as CSV', 'shift_roster.csv'], ['Export Formatted PDF', 'shift_roster.pdf']]) {
    await b.clickText('Export Shift Roster');
    await b.clickText(button);
    await sleep(1000);
    check(b.seen.downloads.includes(file), `${button} said it exported, but no ${file} was downloaded`);
  }
  await b.clickText('Remove', '#shift-roster-tbody');
  await eventually(async () => !(await text('#shift-roster-tbody')).includes('Remove'), 'the shift was not removed');
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
  await b.type('#new-appt-client', 'Alex Riv');
  await eventually(async () => (await text('#new-appt-client-autocomplete-dropdown')).includes('Alex Rivera'), 'typing a name does not offer the existing client');
  // the suggestion is picked with the mouse, as a person does
  const pick = await b.evaluate(`(() => { const row = [...document.querySelectorAll('#new-appt-client-autocomplete-dropdown [data-id]')].find(r => r.innerText.includes('Alex Rivera')); const r = row.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: row.dataset.id }; })()`);
  await b.evaluate(`document.querySelector('#new-appt-client-autocomplete-dropdown [data-id="${pick.id}"]').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))`);
  check((await b.evaluate(`document.getElementById('new-appt-client-id').value`)) === pick.id, 'picking the client did not choose them');
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
  await eventually(async () => (await text('#app-version-label')) === 'v' + version, 'the version label does not match ' + version);
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
  await b.clickText('Settings');
  await b.type('#access-current', 'studio-test-password');
  await b.clickText('Remove password');
  await eventually(async () => (await text('#access-status')).startsWith('No password is set'), 'the password was not removed');
  check((await anon('api/clients')) === 200, 'the API stayed locked after the password was removed');
});

await stop();
console.log(failures.length ? `\n${failures.length} flow(s) failed` : '\nAll flows passed');
process.exit(failures.length ? 1 : 0);
