// Scanners plugged into the CRM computer, for the form builder's Scanner field (Henry, 2026-10-18:
// his TWAIN devices). A browser cannot reach a scanner, so the CRM server scans and hands the image to
// the form. Windows: WIA, built into Windows, which almost every TWAIN scanner also installs a driver
// for, so nothing extra is needed. Linux: SANE (`scanimage`). macOS: not yet (no built-in command line).
// STUDIO_CRM_FAKE_SCANNER=1 gives a pretend scanner, for the tests.
// ponytail: one page, default resolution and colour; options (dpi, duplex) when a studio needs them.
import { execFile } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const SCAN_TIMEOUT_MS = 120000;
const run = (cmd, args, opts = {}) => new Promise((resolve, reject) => {
  execFile(cmd, args, { timeout: SCAN_TIMEOUT_MS, maxBuffer: 64 * 1024 * 1024, windowsHide: true, ...opts }, (err, stdout, stderr) => {
    if (err) reject(Object.assign(new Error(String(stderr || err.message).trim().slice(0, 300)), { timedOut: err.killed }));
    else resolve(stdout);
  });
});
const ps = (script) => run('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script]);
const psString = (s) => "'" + String(s).replace(/'/g, "''") + "'";

// a valid 1x1 image, so a test can see an image came back
function fakePng() {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}

export async function listScanners() {
  if (process.env.STUDIO_CRM_FAKE_SCANNER === '1') return [{ id: 'fake', name: 'Test scanner' }];
  if (process.platform === 'win32') {
    const out = await ps(`$ErrorActionPreference='Stop'; $m = New-Object -ComObject WIA.DeviceManager; $r = @(); foreach ($d in $m.DeviceInfos) { if ($d.Type -eq 1) { $r += [pscustomobject]@{ id = $d.DeviceID; name = $d.Properties.Item('Name').Value } } }; ConvertTo-Json -Compress @($r)`);
    const list = JSON.parse(out.trim() || '[]');
    return Array.isArray(list) ? list : [list];
  }
  if (process.platform === 'linux') {
    const out = await run('scanimage', ['-f', '%d\t%v %m%n']).catch(() => '');
    return out.split('\n').filter(Boolean).map((l) => { const [id, name] = l.split('\t'); return { id, name: (name || id).trim() }; });
  }
  return [];
}

// One page from the scanner (the first one when none is named), as a data: URL
export async function scanPage(deviceId) {
  if (process.env.STUDIO_CRM_FAKE_SCANNER === '1') return fakePng();
  const devices = await listScanners();
  const dev = deviceId ? devices.find((d) => d.id === deviceId) : devices[0];
  if (!dev) throw Object.assign(new Error('No scanner was found on the CRM computer. Plug it into the computer that runs the CRM, and check it scans with its own software.'), { status: 404 });
  const file = path.join(os.tmpdir(), `studio-crm-scan-${Date.now()}.${process.platform === 'win32' ? 'jpg' : 'png'}`);
  try {
    if (process.platform === 'win32') {
      // {B96B3CAF-0728-11D3-9D7B-0000F81EF32E} is WIA's JPEG format
      await ps(`$ErrorActionPreference='Stop'; $m = New-Object -ComObject WIA.DeviceManager; $i = $null; foreach ($d in $m.DeviceInfos) { if ($d.DeviceID -eq ${psString(dev.id)}) { $i = $d } }; if (-not $i) { throw 'scanner gone' }; $dev = $i.Connect(); $img = $dev.Items.Item(1).Transfer('{B96B3CAF-0728-11D3-9D7B-0000F81EF32E}'); $img.SaveFile(${psString(file)})`);
      return 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
    }
    if (process.platform === 'linux') {
      await run('scanimage', ['-d', dev.id, '--format=png', '-o', file]);
      return 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    }
    throw Object.assign(new Error('Scanning from the CRM is not available on this computer yet.'), { status: 501 });
  } finally {
    fs.rmSync(file, { force: true });
  }
}
