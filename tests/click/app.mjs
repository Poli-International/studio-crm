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
  const server = spawn(process.execPath, ['server.js'], {
    cwd: root, stdio: 'ignore',
    env: { ...process.env, PORT: port, HTTPS_PORT: httpsPort, SQLITE_DB_PATH: path.join(dir, 'studio.sqlite') },
  });
  for (let i = 0; ; i++) {
    if (await fetch(url).then((r) => r.ok, () => false)) break;
    if (i > 60) { server.kill(); throw new Error('The app did not start'); }
    await sleep(500);
  }
  const browser = await launchBrowser();
  return {
    browser, url, httpsPort,
    async stop() {
      await browser.close();
      server.kill();
      await sleep(300);
      try { rmSync(dir, { recursive: true, force: true }); } catch { /* Windows may still hold the file */ }
    },
  };
}
