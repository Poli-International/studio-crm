// Scanners plugged into the CRM computer, for the form builder's Scanner field (Henry, 2026-10-18:
// his TWAIN devices). A browser cannot reach a scanner, so the CRM server scans and hands the image to
// the form. Windows: WIA, built into Windows, which almost every TWAIN scanner also installs a driver
// for, so nothing extra is needed. Linux: SANE (`scanimage`). macOS: not yet (no built-in command line).
// STUDIO_CRM_FAKE_SCANNER=1 gives a pretend scanner, for the tests.
// Paper in a document feeder: every page in it, both sides when the feeder is duplex (Henry, 2026-10-30:
// a health card, front and back, in one run). Otherwise one page from the glass.
// ponytail: default resolution and colour, Linux one page; options (dpi, SANE ADF) when a studio needs them.
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

// Scanners whose driver refused the feeder settings (Henry, 2026-10-31: "Catastrophic failure" on the first side).
// They scan as before 1.0.40: one Transfer, the driver's own settings. Until the CRM restarts.
const feederRefused = new Set();

// The pages from the scanner (the first one when none is named), as data: URLs, in scan order
export async function scanPages(deviceId) {
  if (process.env.STUDIO_CRM_FAKE_SCANNER === '1') return [fakePng(), fakePng()]; // a duplex feeder: front and back
  const devices = await listScanners();
  const dev = deviceId ? devices.find((d) => d.id === deviceId) : devices[0];
  if (!dev) throw Object.assign(new Error('No scanner was found on the CRM computer. Plug it into the computer that runs the CRM, and check it scans with its own software.'), { status: 404 });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-crm-scan-'));
  try {
    if (process.platform === 'win32') {
      // WIA device properties: 3086 feeder capabilities, 3087 feeder status, 3088 feeder select, 3096 pages per transfer.
      // Bits: 1 feeder (status: paper loaded), 4 duplex. In feeder mode each Transfer is the next side, until the feeder
      // is empty, which WIA reports as an error: after the first page that error is the end of the stack.
      // If the first side fails with our settings, they are put back and this scanner gets the plain scan from then on.
      // {B96B3CAF-0728-11D3-9D7B-0000F81EF32E} is WIA's JPEG format
      await ps(`$ErrorActionPreference='Stop'; $m = New-Object -ComObject WIA.DeviceManager; $i = $null; foreach ($d in $m.DeviceInfos) { if ($d.DeviceID -eq ${psString(dev.id)}) { $i = $d } }; if (-not $i) { throw 'scanner gone' }; $dev = $i.Connect()
function P($id) { foreach ($p in $dev.Properties) { if ($p.PropertyID -eq $id) { return $p } } }
$cap = P 3086; $st = P 3087; $sel = P 3088; $n = 0; $orig = $null
$feeder = ${feederRefused.has(dev.id) ? '$false' : '$cap -and $st -and $sel -and ($cap.Value -band 1) -and ($st.Value -band 1)'}
if ($feeder) { $orig = $sel.Value; $sel.Value = 1 -bor ($cap.Value -band 4) }
do {
  try { $img = $dev.Items.Item(1).Transfer('{B96B3CAF-0728-11D3-9D7B-0000F81EF32E}') } catch { if ($n -gt 0) { break }; if ($null -ne $orig) { try { $sel.Value = $orig } catch {}; throw ('FEEDER_REFUSED ' + $_) }; throw }
  $img.SaveFile((Join-Path ${psString(dir)} ('page-{0:D3}.jpg' -f $n))); $n++
} while ($feeder -and $n -lt 50)`).catch((e) => {
        if (!/FEEDER_REFUSED/.test(e.message)) throw e;
        feederRefused.add(dev.id);
        throw Object.assign(new Error('This scanner did not accept a two-sided scan, so the CRM will scan one side, as before. Put the page back in the scanner and press the button again.'), { status: 409 });
      });
      return fs.readdirSync(dir).sort().map((f) => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64'));
    }
    if (process.platform === 'linux') {
      const file = path.join(dir, 'page.png');
      await run('scanimage', ['-d', dev.id, '--format=png', '-o', file]);
      return ['data:image/png;base64,' + fs.readFileSync(file).toString('base64')];
    }
    throw Object.assign(new Error('Scanning from the CRM is not available on this computer yet.'), { status: 501 });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
