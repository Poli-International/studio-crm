// Updates from inside the CRM, for the ready-to-run download (the folder with runtime/ in it).
//
// The studio's data is never moved or copied: it stays in data/ and storage/. Only the program files are
// swapped. The steps, each one stopping the update with nothing changed if it fails:
//   1. download the ZIP for this system from the latest GitHub release and check its SHA-256
//   2. unpack it into .update/new/ (next to the app, same disk, so the swap is a rename)
//   3. back up the database into storage/backups/
//   4. start the new version on a copy of that backup, on a spare port: it must answer
//   5. mark .update/ready and stop with exit code 75; the starter sees 75, runs
//      scripts/apply-update.cjs from the new version (it swaps the files, keeping the old ones in
//      .update/previous/) and starts the CRM again.
import fs from 'fs';
import path from 'path';
import net from 'net';
import crypto from 'crypto';
import { spawn } from 'child_process';
import { unzipSync } from 'fflate';

const FEED = process.env.STUDIO_CRM_UPDATE_FEED || 'https://api.github.com/repos/Poli-International/studio-crm/releases/latest';

export const RESTART_CODE = 75;

// "1.0.12" > "1.0.9"
export function newer(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number), pb = String(b).replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  return false;
}

export function assetName(platform = process.platform, arch = process.arch) {
  const os = { win32: 'windows', darwin: 'macos', linux: 'linux' }[platform];
  return os && ['x64', 'arm64'].includes(arch) ? `studio-crm-${os}-${arch}.zip` : null;
}

// The ZIP holds one folder, studio-crm/: its files go into dir, without that folder name.
export function unpack(zipBytes, dir) {
  const files = unzipSync(zipBytes);
  for (const [name, bytes] of Object.entries(files)) {
    const rel = name.split('/').slice(1).join('/');
    if (!rel || name.endsWith('/')) continue;
    const to = path.join(dir, rel);
    if (!to.startsWith(path.resolve(dir) + path.sep)) throw new Error('The download has a file outside its folder: ' + name);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, bytes);
  }
  // ponytail: fflate does not keep Unix file modes, so the files that must run are named here
  for (const f of ['runtime/node', 'start-studio-crm.sh', 'Start Studio CRM.command']) {
    if (fs.existsSync(path.join(dir, f))) fs.chmodSync(path.join(dir, f), 0o755);
  }
}

const freePort = () => new Promise((resolve, reject) => {
  const s = net.createServer().listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); }).on('error', reject);
});

// Start the new version on a copy of the studio's database: it must answer within a minute.
async function trialStart(newDir, dbCopy) {
  const port = await freePort();
  const node = path.join(newDir, 'runtime', process.platform === 'win32' ? 'node.exe' : 'node');
  const proc = spawn(node, ['server.js'], {
    cwd: newDir, stdio: 'ignore',
    env: { ...process.env, PORT: String(port), HTTPS_PORT: '0', SQLITE_DB_PATH: dbCopy, STUDIO_CRM_OPEN: '' },
  });
  let exited = null;
  proc.on('exit', (code) => { exited = code; });
  try {
    for (let i = 0; i < 120; i++) {
      if (exited !== null) throw new Error(`The new version stopped at once (code ${exited})`);
      if (await fetch(`http://127.0.0.1:${port}/`).then(() => true, () => false)) return;
      await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error('The new version did not start within a minute');
  } finally {
    proc.kill();
    await new Promise((r) => (exited !== null ? r() : proc.on('exit', r)));
  }
}

export function installUpdate(app, { root, version, sqlite, saveAll, exit = (code) => process.exit(code) }) {
  const work = path.join(root, '.update');
  let state = { step: 'idle', error: null };
  let latest = null, checkedAt = 0;

  // Left over from the last update: the unpacked copy and the copied node. .update/previous stays
  // until the next update, so the old version can be put back.
  if (!fs.existsSync(path.join(work, 'ready'))) {
    for (const f of ['new', 'node.exe', 'node', 'trial']) fs.rmSync(path.join(work, f), { recursive: true, force: true });
  }

  const readyToRun = fs.existsSync(path.join(root, 'runtime')) && !fs.existsSync('/.dockerenv');

  async function check(force) {
    if (!force && latest && Date.now() - checkedAt < 6 * 3600 * 1000) return latest;
    const r = await fetch(FEED, { headers: { 'User-Agent': 'studio-crm', Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error('GitHub answered ' + r.status);
    const rel = await r.json();
    const asset = (rel.assets || []).find((a) => a.name === assetName());
    latest = { version: String(rel.tag_name || '').replace(/^v/, ''), notes: rel.html_url || '', asset: asset || null };
    checkedAt = Date.now();
    return latest;
  }

  app.get('/api/admin/update', async (req, res) => {
    let rel = null, problem = null;
    try { rel = await check(req.query.check === '1'); } catch (e) { problem = 'Could not check for updates: ' + e.message; }
    const available = !!rel && newer(rel.version, version);
    res.json({
      current: version, latest: rel && rel.version, notes: rel && rel.notes, available, problem, ...state,
      // the button is offered only where the update can be done from here
      canUpdate: available && readyToRun && !!(rel && rel.asset),
      why: !readyToRun ? 'This copy was not installed from the ready-to-run download: update it the way it was installed.' : null,
    });
  });

  app.post('/api/admin/update', async (req, res) => {
    if (!readyToRun) return res.status(400).json({ error: 'Updates from here need the ready-to-run download' });
    if (!['idle', 'failed'].includes(state.step)) return res.status(409).json({ error: 'An update is already running' });
    let rel;
    try { rel = await check(true); } catch (e) { return res.status(502).json({ error: 'Could not check for updates: ' + e.message }); }
    if (!newer(rel.version, version) || !rel.asset) return res.status(400).json({ error: 'There is no newer version for this computer' });
    res.json({ ok: true });
    run(rel).catch((e) => {
      state = { step: 'failed', error: e.message };
      fs.rmSync(path.join(work, 'new'), { recursive: true, force: true });
      fs.rmSync(path.join(work, 'trial'), { recursive: true, force: true });
    });
  });

  async function run(rel) {
    state = { step: 'downloading', error: null };
    const r = await fetch(rel.asset.browser_download_url, { headers: { 'User-Agent': 'studio-crm' }, signal: AbortSignal.timeout(15 * 60 * 1000) });
    if (!r.ok) throw new Error('The download failed: ' + r.status);
    const zip = new Uint8Array(await r.arrayBuffer());   // ponytail: ~60 MB held in memory, fine on a studio PC
    const want = String(rel.asset.digest || '').replace(/^sha256:/, '');
    if (want && crypto.createHash('sha256').update(zip).digest('hex') !== want) throw new Error('The download is damaged (its checksum does not match)');

    state.step = 'unpacking';
    const newDir = path.join(work, 'new');
    fs.rmSync(newDir, { recursive: true, force: true });
    unpack(zip, newDir);
    const got = JSON.parse(fs.readFileSync(path.join(newDir, 'package.json'), 'utf8')).version;
    if (got !== rel.version) throw new Error(`The download is version ${got}, not ${rel.version}`);

    state.step = 'backing up';
    saveAll();
    const backups = path.join(root, 'storage', 'backups');
    fs.mkdirSync(backups, { recursive: true });
    const backup = path.join(backups, `before-update-to-${rel.version}_${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`);
    await sqlite.backup(backup);

    state.step = 'testing';
    const trial = path.join(work, 'trial');
    fs.rmSync(trial, { recursive: true, force: true });
    fs.mkdirSync(trial, { recursive: true });
    fs.copyFileSync(backup, path.join(trial, 'studio_crm.sqlite'));
    await trialStart(newDir, path.join(trial, 'studio_crm.sqlite'));
    fs.rmSync(trial, { recursive: true, force: true });

    state.step = 'restarting';
    fs.writeFileSync(path.join(work, 'ready'), JSON.stringify({ from: version, to: rel.version, backup: path.relative(root, backup) }));
    setTimeout(() => { try { saveAll(); } catch (e) {} exit(RESTART_CODE); }, 1500);   // the browser hears "restarting" first
  }
}
