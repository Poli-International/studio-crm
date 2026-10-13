// Clicks every button the app shows, one at a time, in a real browser, and
// writes down what each click did. A button that does nothing, throws an
// error, or cannot be reached with the mouse is a dead button.
//
//   node tests/click/crawl.mjs            every button, report in click-report.json
//   CRAWL_DEPTH=1 node tests/click/crawl.mjs    only the eight main screens
//   CRAWL_PAGE=tools/form-builder/ node tests/click/crawl.mjs    one embedded tool
import { writeFileSync } from 'node:fs';
import { startApp } from './app.mjs';

const DEPTH = Number(process.env.CRAWL_DEPTH || 3);
const OUT = process.env.CRAWL_OUT || 'click-report.json';
const NAV = ['dashboard', 'clients', 'calendar', 'inventory', 'compliance', 'finance', 'tools', 'settings'];

const { browser, url, stop } = await startApp();
const results = [];
const queued = new Set();
const queue = [];

const navKey = (dest) => browser.evaluate(`(() => { const el = document.getElementById('nav-dest-${dest}'); return el ? window.__ct.key(el) : null; })()`);
// These delete or replace the studio's data: clicked last, so the rest runs on the demo studio.
const LAST = /demo-data-clear|empty studio|Restore|Factory|Wipe|Delete|Remove|Clear All|clearAll/i;
const last = [];
// A backdrop that closes its window only when the click lands on the backdrop itself: its centre is the window.
const BACKDROP = /event\.target\s*===?\s*this/;
// Buttons with nothing to see after the click, each for a reason a person would accept.
const QUIET = [
  /testQrAudioTheme/, // plays a sound
  /switchStudioProSuiteTab\('(aftercare|ear-planner)'\)|switchGalleryTab\('portfolio'\)|setSharePreset\('showcase'\)|prevQrTourStep|switchClientProfileTab\('overview'\)|switchImportTab\('manual'\)/, // already on that tab or step
  /sendTeamChatMessage/, // sends nothing until a message is typed
  /qr-validation-toast/, // closes a message that is not showing
  /clearWaiverSignature/, // clears a signature pad that is still empty
  /toggleQrScanner/, // starts the camera: there is none on a test machine
  /shareToPlatform\('email'\)/, // hands the message to the computer's mail program
];
const enqueue = (keys, pathTo) => {
  for (const key of keys) {
    if (queued.has(key) || BACKDROP.test(key)) continue;
    queued.add(key);
    (LAST.test(key) ? last : queue).push({ key, path: pathTo });
  }
};

// One embedded tool on its own page (CRAWL_PAGE=tools/gauge-converter/), or the app with its eight screens
const PAGE = '/' + (process.env.CRAWL_PAGE || '').replace(/^\//, ''); // Git Bash rewrites a leading slash, so tools/x/ works too
const start = url.replace(/\/$/, '') + PAGE;
await browser.goto(start);
if (PAGE !== '/') enqueue(await browser.evaluate('window.__ct.keys()'), []);
for (const dest of PAGE === '/' ? NAV : []) {
  const nk = await navKey(dest);
  await browser.click(nk);
  queued.add(nk);
  results.push({ key: nk, path: [], verdict: (await browser.evaluate('window.__ct.state().view')) === 'dest-' + dest ? 'works' : 'dead', did: 'opens the screen' });
  enqueue(await browser.evaluate('window.__ct.keys()'), [nk]);
}

while (queue.length || last.length) {
  const item = queue.shift() || last.shift();
  const r = { key: item.key, path: item.path };
  if (process.env.CRAWL_VERBOSE) console.log(item.key);
  results.push(r);
  try {
    await browser.goto(start);
    let lost = false;
    for (const step of item.path) {
      const t = await browser.click(step);
      if (t && t.covered) { r.verdict = 'broken'; r.did = `cannot get there: "${step.split(' | ')[2]}" is covered by ${t.covered}`; break; }
      if (!t) { lost = true; break; }
    }
    if (r.verdict) continue;
    // the way there is gone: an earlier click deleted the record it belongs to
    if (lost) { r.verdict = 'unreachable'; continue; }

    const [tag, , , action] = item.key.split(' | ');
    if (tag === 'A' && action && !/^(#|javascript:)/.test(action) && !(await browser.evaluate(`!!window.__ct.all().find(e => window.__ct.key(e) === ${JSON.stringify(item.key)} && e.getAttribute('onclick'))`))) {
      // a plain link: do not leave the app, just check that the address answers
      const local = action.startsWith('/') || action.startsWith('./') || action.startsWith(url);
      r.status = local ? await browser.evaluate(`fetch(${JSON.stringify(action)}).then(r => r.status, () => -1)`) : null;
      r.verdict = local ? (r.status === 200 ? 'works' : 'broken') : 'external link';
      r.did = 'link to ' + action;
      continue;
    }

    browser.reset();
    await browser.evaluate('(() => { const s = window.__ct.sig; s.fetches.length = 0; s.opens.length = 0; s.prints = 0; s.added.length = 0; })()');
    const before = await browser.evaluate('({ state: window.__ct.state(), keys: window.__ct.keys() })');
    const t = await browser.click(item.key);
    if (!t) { r.verdict = 'unreachable'; continue; }
    if (t.covered) { r.verdict = 'broken'; r.did = 'cannot be clicked: covered by ' + t.covered; continue; }
    const after = await browser.evaluate('({ state: window.__ct.state(), keys: window.__ct.keys(), sig: window.__ct.sig })').catch(() => null);
    if (!after) { r.verdict = 'works'; r.did = 'leaves the page'; continue; }

    const opened = after.state.overlays.filter((o) => !before.state.overlays.includes(o));
    const closed = before.state.overlays.filter((o) => !after.state.overlays.includes(o));
    Object.assign(r, {
      opened, closed,
      view: after.state.view !== before.state.view ? after.state.view : undefined,
      changed: after.state.hash !== before.state.hash,
      fetches: after.sig.fetches.map((f) => `${f.method} ${f.url} ${f.status}`),
      downloads: [...browser.seen.downloads], dialogs: [...browser.seen.dialogs], errors: [...browser.seen.errors],
      opens: after.sig.opens, prints: after.sig.prints,
      said: [...new Set(after.sig.added)].slice(0, 4),
    });
    const failed = after.sig.fetches.some((f) => f.status >= 400 || f.status === -1);
    const effect = opened.length || closed.length || r.view || r.changed || r.fetches.length || r.downloads.length
      || r.dialogs.length || r.opens.length || r.prints;
    r.verdict = r.errors.length || failed ? 'broken' : effect ? 'works' : QUIET.some((q) => q.test(item.key)) ? 'quiet' : 'dead';
    // says a file was made, but no file came
    const claim = [...r.dialogs, ...r.said].join(' ');
    if (r.verdict === 'works' && /export|download|saved to|generated/i.test(claim) && !r.downloads.length && !r.fetches.some((f) => !f.startsWith('GET'))) r.suspect = 'says exported/saved, but no file and nothing sent to the server';

    if (item.path.length < DEPTH) enqueue(after.keys.filter((k) => !before.keys.includes(k)), [...item.path, item.key]);
  } catch (e) {
    r.verdict = 'broken'; r.did = 'test error: ' + e.message;
  }
  if (results.length % 25 === 0) {
    console.log(`${results.length} clicked, ${queue.length} to go`);
    writeFileSync(OUT, JSON.stringify(results, null, 1));
  }
}

writeFileSync(OUT, JSON.stringify(results, null, 1));
const count = (v) => results.filter((r) => r.verdict === v).length;
console.log(`${results.length} buttons: ${count('works')} work, ${count('dead')} dead, ${count('broken')} broken, ${count('unreachable')} unreachable, ${count('quiet')} with nothing to see, ${count('external link')} external links`);
for (const r of results.filter((x) => x.verdict === 'dead' || x.verdict === 'broken')) {
  console.log(`${r.verdict.toUpperCase()}  ${r.key}\n    ${r.did || r.errors.concat(r.fetches.filter((f) => / (4|5)\d\d$| -1$/.test(f))).join('; ')}`);
}
await stop();
process.exit(count('dead') + count('broken') > 0 ? 1 : 0);
