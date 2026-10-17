// Presentation screenshots for the README and the website, taken from the real app with its demo studio.
// Run after a release:  node scripts/screenshots.mjs [out-dir]   (default docs/screenshots)
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { startApp } from '../tests/click/app.mjs';
import { sleep, launchBrowser } from '../tests/click/cdp.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.argv[2] || path.join(root, 'docs', 'screenshots'));
fs.mkdirSync(out, { recursive: true });
const W = 1440, H = 900;

// the Updates card asks a feed: this one says the version running is the latest, as it is on release day
const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const feed = http.createServer((q, r) => r.end(JSON.stringify({ tag_name: 'v' + version, assets: [] }))).listen(0, '127.0.0.1');
await new Promise((r) => feed.on('listening', r));
feed.unref();
process.env.STUDIO_CRM_UPDATE_FEED = 'http://127.0.0.1:' + feed.address().port + '/';

const { browser: b, url, stop } = await startApp();
const shoot = async (who, name) => { await sleep(800); await who.screenshot(path.join(out, name + '.webp')); console.log('  ' + name); };
const go = async (dest) => { await b.evaluate(`navigateToDestination(${JSON.stringify(dest)})`); await sleep(1600); };
const top = () => b.evaluate(`(() => { document.querySelectorAll('.destination-view, main, .main-content').forEach((e) => { e.scrollTop = 0; }); window.scrollTo(0, 0); })()`);
const k = await launchBrowser();
try {
  await b.size(W, H);
  await b.goto(url);
  await sleep(2500);
  const clean = () => b.evaluate(`document.getElementById('demo-data-banner') && document.getElementById('demo-data-banner').remove()`);
  await clean();

  for (const dest of ['dashboard', 'clients', 'calendar', 'inventory', 'finance', 'tools']) { await go(dest); await top(); await shoot(b, dest); }

  // a client's profile
  await go('clients');
  await b.evaluate(`openClientProfileModal(1)`); await sleep(1800);
  await shoot(b, 'client-profile');

  // a completed medical form, as the desk sees it ("View answers"), with the client's signature
  await b.goto(url + 'tools/form-builder/index.html');
  for (let i = 0; i < 80 && !(await b.evaluate(`!!(window.FormTemplates && window.MedicalHistorySystem)`).catch(() => false)); i++) await sleep(250);
  const form = await b.evaluate(`(() => { const f = JSON.parse(JSON.stringify(window.FormTemplates.formTemplates.medical_history_intake));
    f.sections.forEach((s) => { if (s.type === 'medical_section') s.fields = window.MedicalHistorySystem.getMedicalSection().fields; }); return f; })()`);
  const signature = await b.evaluate(`(() => { const c = document.createElement('canvas'); c.width = 360; c.height = 110; const g = c.getContext('2d');
    g.strokeStyle = '#1D4ED8'; g.lineWidth = 3; g.beginPath(); g.moveTo(20, 70);
    for (let x = 20; x < 330; x += 6) g.lineTo(x, 60 + Math.sin(x / 13) * 22 - (x > 160 && x < 200 ? 18 : 0));
    g.stroke(); return c.toDataURL('image/png'); })()`);
  const responses = { studio_name: 'Poli Studio', practitioner_name: 'Jaxon Vance', full_name: 'Alex Rivera', dob: '1991-04-12', phone: '555-0142',
    email: 'alex.r@example.com', emergency_contact: 'Jordan Rivera (brother) 555-0199', allergies: ['Latex'], conditions: [],
    medications: 'None', blood_thinners: 'No', pregnant: 'No', alcohol_24hrs: 'No', eaten_4hrs: 'Yes',
    requires_doctor_clearance: 'No medical clearance required', current_rx: 'Vitamin D', fainting_history: 'No history of fainting',
    skin_integrity: 'Yes - Skin is fully healthy and unbroken', truthful_disclosure: true, capacity_declaration: true,
    waiver_undisclosed: true, aftercare_prior_advice: true, sig_date: new Date().toISOString().slice(0, 10), client_sig: signature };
  await b.goto(url);
  await sleep(2000); await clean();
  const saved = await b.evaluate(`fetch('/api/clients/1/consent-forms', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formName: ${JSON.stringify(form.name)}, formCategory: 'Medical', language: 'en', schema: ${JSON.stringify(form)}, responses: ${JSON.stringify(responses)} }) }).then((r) => r.json())`);
  await b.evaluate(`openClientProfileModal(1)`); await sleep(1500);
  await b.evaluate(`switchClientProfileTab('waivers')`); await sleep(600);
  await b.evaluate(`viewClientConsentForm(${Number(saved.id)})`); await sleep(1200);
  await b.evaluate(`(() => { const body = document.getElementById('client-profile-modal-body'); const h = [...body.querySelectorAll('h4')].find((x) => /Medical|Health/.test(x.textContent)); if (h) h.scrollIntoView({ block: 'start' }); })()`);
  await shoot(b, 'consent-answers');
  await b.evaluate(`closeClientProfileModal()`);

  // the consent form builder
  await go('clients');
  await b.evaluate(`openFormBuilderModal()`); await sleep(4000);
  await shoot(b, 'form-builder');
  await b.goto(url); await sleep(2000); await clean();

  // Settings: kiosk tablets and one-click updates
  await go('settings');
  await b.evaluate(`document.getElementById('update-card').scrollIntoView({ block: 'center' })`);
  await shoot(b, 'settings');

  // the kiosk tablet: the desk sends a form, the client fills it in on the tablet
  await k.tablet();
  await k.goto(url + 'kiosk?name=Front%20Desk%20Tablet');
  await sleep(2500);
  await shoot(k, 'kiosk-waiting');
  await b.evaluate(`fetch('/api/kiosk/send', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: 2, kiosk: 'Front Desk Tablet', formName: ${JSON.stringify(form.name)}, schema: ${JSON.stringify(form)} }) })`);
  const kf = k.frame('#frame');
  for (let i = 0; i < 80 && !(await kf.evaluate(`!!document.getElementById('tablet-kiosk-modal') && getComputedStyle(document.getElementById('tablet-kiosk-modal')).display !== 'none'`).catch(() => false)); i++) await sleep(250);
  await kf.evaluate(`window.ActiveFormPreview.nextKioskStep && (window.ActiveFormPreview.currentKioskStep = 2, window.ActiveFormPreview.renderKioskStep())`);
  await kf.evaluate(`(() => { const m = document.getElementById('tablet-kiosk-modal'); [...m.querySelectorAll('input[type=checkbox]')].filter((c) => /Latex|Keloid/.test(c.value)).forEach((c) => c.click());
    [...m.querySelectorAll('input[type=radio]')].filter((r) => r.value === 'No').forEach((r) => r.click()); })()`);
  await shoot(k, 'kiosk-form');

  // languages: the same studio in Thai
  await b.goto(url); await sleep(2000); await clean();
  await b.evaluate(`setLanguage('th')`); await sleep(3000);
  await go('dashboard'); await top();
  await shoot(b, 'thai');
  await b.evaluate(`setLanguage('en')`);
} finally { await k.close().catch(() => {}); await stop(); }
