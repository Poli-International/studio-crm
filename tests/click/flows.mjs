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
async function eventually(fn, what) {
  for (let i = 0; i < 25; i++) { if (await fn()) return; await sleep(200); }
  throw new Error(what);
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
  await b.clickText('×', '#shift-modal');
  check(!(await shown('shift-modal')), 'the shift window cannot be closed');
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
  await press('.client-directory-row', 'Kiosk Flow', 'View Profile');
  await b.clickText('Waivers', '#client-profile-modal-overlay');
  await b.clickText('View answers');
  await eventually(async () => (await text('#client-profile-modal-body')).includes('kiosk.flow@example.com'), 'the saved answers cannot be read back');
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
  await b.clickText('Add Question');
  await open(0);
  await sleep(600);
  check((await questions()) === before + 1, 'the question added to the first form was lost');
  // another device: a browser that has never opened the form builder (goto starts with empty storage)
  await sleep(800);
  await b.goto(url + 'tools/form-builder/index.html');
  await sleep(1500);
  check((await questions()) === before + 1, 'the edited form did not reach a second device');
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

await stop();
console.log(failures.length ? `\n${failures.length} flow(s) failed` : '\nAll flows passed');
process.exit(failures.length ? 1 : 0);
