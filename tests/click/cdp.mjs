// Drives a real Chrome (or Edge) through the DevTools protocol, with nothing
// to install: Node 22 has WebSocket built in and every CI runner has Chrome.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const env = process.env;
const BROWSERS = [
  env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  `${env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
  `${env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
  `${env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  `${env['PROGRAMFILES(X86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
];

// Runs in the page before any app script: records what a click caused.
const PAGE_HELPER = `(() => {
  const sig = { fetches: [], inflight: 0, opens: [], prints: 0, added: [] };
  const realFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : input.url;
    const rec = { method: (init && init.method) || 'GET', url: url, status: 0 };
    sig.fetches.push(rec); sig.inflight++;
    return realFetch.apply(this, arguments).then(
      (r) => { rec.status = r.status; sig.inflight--; return r; },
      (e) => { rec.status = -1; sig.inflight--; throw e; });
  };
  window.open = (u) => { sig.opens.push(String(u)); return null; };
  window.print = () => { sig.prints++; };
  // where the last click really landed, and a form field the browser refused: read when a step fails
  document.addEventListener('click', (e) => { sig.lastClick = e.target.tagName + '#' + e.target.id + ' ' + (e.target.innerText || '').trim().slice(0, 30); }, true);
  document.addEventListener('invalid', (e) => { sig.refused = e.target.id + ': ' + e.target.validationMessage; }, true);
  // on the page and not parked off to the side (a closed drawer slides out of the window)
  const shown = (el) => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.right > 0 && r.left < innerWidth;
  };
  const ct = window.__ct = {
    sig,
    key(el) {
      const text = (el.innerText || el.value || el.title || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
      // a button with an id is that button whatever it says: its label may change (Clock in / Clock out)
      return [el.tagName, el.id || '', el.id ? '' : text, (el.getAttribute('onclick') || el.getAttribute('href') || '').trim().slice(0, 120)].join(' | ');
    },
    all() {
      return [...document.querySelectorAll('button,[onclick],a[href],input[type=button],input[type=submit],[role=button]')].filter(shown);
    },
    keys() { return [...new Set(ct.all().map(ct.key))]; },
    overlays() {
      return [...document.querySelectorAll('body [id]')].filter((el) => getComputedStyle(el).position === 'fixed' && shown(el)
        && el.getBoundingClientRect().width > innerWidth * 0.3 && el.getBoundingClientRect().height > innerHeight * 0.3).map((el) => el.id);
    },
    state() {
      const fields = [...document.querySelectorAll('input,select,textarea')].map((f) => f.type === 'checkbox' || f.type === 'radio' ? +f.checked : f.value).join('|');
      const text = document.body.innerText.replace(/[0-9]/g, '');
      const view = [...document.querySelectorAll('.destination-view')].filter(shown).map((v) => v.id).join(',');
      let h = 0; for (const c of text + fields + document.documentElement.className + document.body.className + document.documentElement.getAttribute('data-theme')) h = (h * 31 + c.charCodeAt(0)) | 0;
      return { overlays: ct.overlays(), view, hash: h };
    },
    // A submit button does nothing on an empty form: fill the required fields first, like a person would.
    fill(form) {
      for (const f of form.querySelectorAll('[required]')) {
        if (f.type === 'checkbox') f.checked = true;
        else if (f.tagName === 'SELECT') { if (!f.value && f.options.length > 1) f.selectedIndex = 1; }
        else if (!f.value) f.value = f.type === 'number' ? '1' : f.type === 'date' ? '2026-01-15' : f.type === 'time' ? '10:00' : f.type === 'email' ? 'click.test@example.com' : 'Click Test';
        f.dispatchEvent(new Event('input', { bubbles: true })); f.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
    target(key) {
      const el = ct.all().find((e) => ct.key(e) === key);
      if (!el) return null;
      if (el.form && (el.type === 'submit' || (el.tagName === 'BUTTON' && !el.getAttribute('type') && !el.getAttribute('onclick')))) ct.fill(el.form);
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      const top = document.elementFromPoint(x, y);
      const hit = top && el.contains(top); // the click must land on the button itself, not on something around or over it
      return { x, y, covered: hit ? null : (top ? (top.id || top.tagName + '.' + top.className) : 'outside the window') };
    },
  };
  new MutationObserver((list) => {
    for (const m of list) for (const n of m.addedNodes) {
      if (n.nodeType === 1 && n.innerText && n.innerText.trim()) sig.added.push(n.innerText.trim().replace(/\\s+/g, ' ').slice(0, 160));
    }
  }).observe(document, { childList: true, subtree: true });
})();`;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launchBrowser() {
  const exe = BROWSERS.find((p) => p && existsSync(p));
  if (!exe) throw new Error('No Chrome or Edge found. Set CHROME_PATH.');
  const dir = mkdtempSync(path.join(os.tmpdir(), 'crm-click-'));
  const proc = spawn(exe, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run',
    '--no-default-browser-check', '--disable-gpu', '--window-size=1440,1000',
    '--ignore-certificate-errors', // the CRM's https certificate is self-made
    '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', // a pretend camera, so the scanner can be opened
    ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank']);
  const wsUrl = await new Promise((res, rej) => {
    let buf = '';
    proc.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); });
    proc.on('exit', (c) => rej(new Error(`browser exited (${c}): ${buf}`)));
    setTimeout(() => rej(new Error('browser did not start in 30 s')), 30000);
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  // what the browser reported since the last reset()
  const seen = { errors: [], dialogs: [], downloads: [] };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
    const n = ++id;
    // a page stuck in a script never answers: fail the click instead of hanging the run
    const timer = setTimeout(() => { pending.delete(n); rej(new Error(`${method} got no answer in 20 s`)); }, 20000);
    pending.set(n, { res: (v) => { clearTimeout(timer); res(v); }, rej: (e) => { clearTimeout(timer); rej(e); } });
    ws.send(JSON.stringify({ id: n, method, params, sessionId }));
  });
  let sessionId;
  const cdp = (method, params) => send(method, params, sessionId);
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id) {
      const p = pending.get(m.id); pending.delete(m.id);
      if (!p) return;
      if (m.error) p.rej(new Error(`${m.error.message}`)); else p.res(m.result);
    } else if (m.method === 'Page.javascriptDialogOpening') {
      // alert(), confirm() and prompt() would freeze the page: answer and note them
      seen.dialogs.push(`${m.params.type}: ${m.params.message}`.slice(0, 200));
      cdp('Page.handleJavaScriptDialog', { accept: true, promptText: 'Click Test' }).catch(() => {});
    } else if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      seen.errors.push(((d.exception && d.exception.description) || d.text || '').split('\n')[0].slice(0, 200));
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      seen.errors.push('console.error: ' + m.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 200));
    } else if (m.method === 'Browser.downloadWillBegin') {
      seen.downloads.push(m.params.suggestedFilename);
    }
  };

  const { targetInfos } = await send('Target.getTargets');
  ({ sessionId } = await send('Target.attachToTarget', { targetId: targetInfos.find((t) => t.type === 'page').targetId, flatten: true }));
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: path.join(dir, 'downloads'), eventsEnabled: true });
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: PAGE_HELPER });

  const evaluate = async (expression) => {
    const r = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  };
  const js = (v) => JSON.stringify(v);

  const mouse = (type, x, y, down) => cdp('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: down ? 1 : 0, clickCount: 1 });
  const settle = async (ms = 250) => {
    await sleep(100);
    for (let i = 0; i < 40 && await evaluate('window.__ct ? window.__ct.sig.inflight : 0').catch(() => 0) > 0; i++) await sleep(100);
    await sleep(ms);
  };

  // The same actions on the page itself, or inside one of its embedded tools
  // (an <iframe> from the same server) when a frame selector is given.
  const scope = (frameSel) => {
    // `body` runs with window and document pointing at the page or at the frame
    const run = (body) => evaluate(frameSel
      ? `(function (window) { const document = window.document; ${body} })(document.querySelector(${js(frameSel)}).contentWindow)`
      : `(function () { ${body} })()`);
    const offset = () => (frameSel
      ? evaluate(`(() => { const r = document.querySelector(${js(frameSel)}).getBoundingClientRect(); return { x: r.left, y: r.top }; })()`)
      : { x: 0, y: 0 });
    return {
      evaluate: (expression) => run(`return (${expression});`),
      // A real mouse click on the button's centre. Returns null when the button is
      // not on screen, or { covered } when something else lies on top of it.
      async click(key) {
        // Windows pop in with a short animation that can start late; wait for every
        // animation that ends (and for late fonts) before trusting where the button is.
        const calm = () => run(`return Promise.race([
          Promise.all([document.fonts.ready].concat(document.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().iterations !== Infinity).map(a => a.finished.catch(() => {})))),
          new Promise(done => setTimeout(done, 2500))]).then(() => true);`).catch(() => {});
        await calm();
        let t = await run(`return window.__ct.target(${js(key)});`);
        for (let i = 0; i < 15 && t; i++) {
          await sleep(80);
          await calm();
          const again = await run(`return window.__ct.target(${js(key)});`);
          const still = again && Math.abs(again.x - t.x) < 1 && Math.abs(again.y - t.y) < 1 && again.covered === t.covered;
          t = again;
          if (still) break;
        }
        if (!t || t.covered) return t;
        const o = await offset();
        for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await mouse(type, t.x + o.x, t.y + o.y, type === 'mousePressed');
        await settle();
        return t;
      },
      // clicks the first visible button whose label contains the text
      async clickText(text, within = '') {
        const key = await run(`const s = ${js(within)}; const el = window.__ct.all().find(e => (!s || e.closest(s)) && (e.innerText || e.value || '').includes(${js(text)})); return el ? window.__ct.key(el) : null;`);
        if (!key) throw new Error(`No visible button "${text}"${within ? ' in ' + within : ''}`);
        const t = await this.click(key);
        if (!t) throw new Error(`Button "${text}" disappeared`);
        if (t.covered) throw new Error(`Button "${text}" cannot be clicked: covered by ${t.covered}`);
      },
      async type(selector, value) {
        // the keys go to whatever has the focus: if the page moved it elsewhere meanwhile, type again
        for (let attempt = 0; ; attempt++) {
          const ok = await run(`const el = document.querySelector(${js(selector)}); if (!el) return false; el.focus(); el.value = ''; return true;`);
          if (!ok) throw new Error(`No field ${selector}`);
          await cdp('Input.insertText', { text: value });
          if (await run(`return document.querySelector(${js(selector)}).value === ${js(value)};`)) break;
          if (attempt === 4) throw new Error(`Could not type into ${selector}`);
          await sleep(200);
        }
        await run(`const el = document.querySelector(${js(selector)}); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));`);
      },
      // draws a zig-zag across the element with the mouse held down, like a signature
      async scribble(selector) {
        const r = await run(`const el = document.querySelector(${js(selector)}); if (!el) return null; el.scrollIntoView({ block: 'center' }); const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height };`);
        if (!r) throw new Error(`Nothing to sign: ${selector}`);
        const o = await offset();
        const at = (i) => [o.x + r.x + r.w * (0.2 + 0.06 * i), o.y + r.y + r.h * (i % 2 ? 0.3 : 0.7)];
        await mouse('mouseMoved', ...at(0), false);
        await mouse('mousePressed', ...at(0), true);
        for (let i = 1; i <= 10; i++) { await mouse('mouseMoved', ...at(i), true); await sleep(20); }
        await mouse('mouseReleased', ...at(10), false);
        await settle();
      },
    };
  };

  return {
    seen, settle, ...scope(''),
    frame: (selector) => scope(selector),
    reset() { seen.errors.length = 0; seen.dialogs.length = 0; seen.downloads.length = 0; },
    // every page load starts like a first visit: nothing remembered from the click before
    async goto(url) {
      await cdp('Storage.clearDataForOrigin', { origin: new URL(url).origin, storageTypes: 'local_storage,session_storage' }).catch(() => {});
      await cdp('Page.navigate', { url });
      for (let i = 0; i < 100; i++) {
        await sleep(100);
        if (await evaluate('document.readyState === "complete" && !!window.__ct').catch(() => false)) break;
      }
      // text moves when a web font arrives late, and a small button moves with it
      await evaluate('document.fonts.ready.then(() => true)').catch(() => {});
      await settle();
    },
    // a phone or tablet screen
    viewport: (width, height) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true }),
    async screenshot(file) {
      writeFileSync(file, Buffer.from((await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 60 })).data, 'base64'));
    },
    async close() {
      ws.close(); proc.kill();
      await sleep(500);
      try { rmSync(dir, { recursive: true, force: true }); } catch { /* Windows may still hold the folder */ }
    },
  };
}
