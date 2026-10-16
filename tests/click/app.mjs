// Starts the app on a throwaway database and opens a browser on it.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser, sleep } from './cdp.mjs';

const root = process.env.CRM_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export async function startApp() {
  const port = process.env.CLICK_PORT || 3412;
  const url = `http://127.0.0.1:${port}/`;
  const httpsPort = Number(port) + 1000;
  const dir = mkdtempSync(path.join(os.tmpdir(), 'crm-db-'));
  const start = async () => {
    const proc = spawn(process.execPath, ['server.js'], {
      cwd: root, stdio: 'ignore',
      env: { ...process.env, PORT: port, HTTPS_PORT: httpsPort, SQLITE_DB_PATH: path.join(dir, 'studio.sqlite') },
    });
    for (let i = 0; ; i++) {
      // any answer will do: with a studio password set, the home page answers 401 (sign in)
      if (await fetch(url).then(() => true, () => false)) return proc;
      if (i > 60) { proc.kill(); throw new Error('The app did not start'); }
      await sleep(500);
    }
  };
  let server = await start();
  // a fresh studio first asks for a password: the tests continue without one
  await fetch(url + 'api/access/skip', { method: 'POST' }).catch(() => {});
  const browser = await launchBrowser();
  return {
    browser, url, httpsPort,
    // the studio's PC restarts the CRM: same database, a new server process (killed hard, as a power cut would)
    async restart() { await sleep(600); server.kill(); await sleep(500); server = await start(); },
    async stop() {
      await browser.close();
      server.kill();
      await sleep(300);
      try { rmSync(dir, { recursive: true, force: true }); } catch { /* Windows may still hold the file */ }
    },
  };
}

// A second, brand-new studio that has not made its first-start choice (for that test only).
export async function startFreshServer(port) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'crm-db-'));
  const server = spawn(process.execPath, ['server.js'], {
    cwd: root, stdio: 'ignore', env: { ...process.env, PORT: port, HTTPS_PORT: 0, SQLITE_DB_PATH: path.join(dir, 'studio.sqlite') },
  });
  const url = `http://127.0.0.1:${port}/`;
  for (let i = 0; ; i++) {
    if (await fetch(url).then((r) => r.ok, () => false)) break;
    if (i > 60) { server.kill(); throw new Error('The fresh app did not start'); }
    await sleep(500);
  }
  return { url, async stop() { server.kill(); await sleep(300); try { rmSync(dir, { recursive: true, force: true }); } catch { /* Windows */ } } };
}
