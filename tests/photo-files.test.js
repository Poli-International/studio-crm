import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { photosToFiles, PHOTO_NAME } from '../src/photo-files.js';
import { needLevel } from '../src/access.js';

// Photos as files (1.0.47, audit B4). Photos used to live inside the lists that are rewritten whole into the
// database after every write: 100 photos made every desk wait five seconds. They are files in storage/photos
// now, and the record holds only the address /api/photos/<name>.
// Signed forms and waivers keep their signature inside the record (Patrick, 2026-11-16).
const root = path.resolve(__dirname, '..');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const URL_RE = /^\/api\/photos\/[a-f0-9]{32}\.(jpg|png|webp)$/;
const jpeg = (bytes) => 'data:image/jpeg;base64,' + bytes.toString('base64');
const SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>';

// ---------------------------------------------------------------------------------------------
// The function itself
// ---------------------------------------------------------------------------------------------
describe('photosToFiles', () => {
  let dir;
  beforeAll(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'crm-photos-unit-')); });
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('writes each photo once, puts its address in the record, at any depth', () => {
    const a = crypto.randomBytes(5000), b = crypto.randomBytes(5000);
    const list = [{ id: 1, image_url: jpeg(a), nested: { again: jpeg(a), other: ['x', 'data:image/png;base64,' + b.toString('base64')] } }];
    const out = photosToFiles(path.join(dir, 'p'), list);
    expect(out).toEqual({ moved: 3, failed: 0 });
    expect(list[0].image_url).toMatch(URL_RE);
    expect(list[0].nested.again).toBe(list[0].image_url);                       // the same picture is the same file
    expect(list[0].nested.other[1]).toMatch(/\.png$/);
    const names = fs.readdirSync(path.join(dir, 'p'));
    expect(names.length).toBe(2);
    expect(names.every((n) => PHOTO_NAME.test(n))).toBe(true);                  // and no half-written file is left
    expect(fs.readFileSync(path.join(dir, 'p', list[0].image_url.split('/').pop())).equals(a)).toBe(true);
    expect(photosToFiles(path.join(dir, 'p'), list)).toEqual({ moved: 0, failed: 0 });   // nothing left to do
  });

  it('leaves everything that is not a photo', () => {
    const list = [{ a: SVG, b: 'https://example.org/x.jpg', c: 'data:image/jpeg;base64,not base64!', d: 12, e: null, f: '/api/photos/' + 'a'.repeat(32) + '.jpg' }];
    const before = JSON.stringify(list);
    expect(photosToFiles(path.join(dir, 'q'), list)).toEqual({ moved: 0, failed: 0 });
    expect(JSON.stringify(list)).toBe(before);
  });

  it('keeps the photo in the record when the file cannot be written', () => {
    const blocked = path.join(dir, 'blocked');
    fs.writeFileSync(blocked, 'a file where the folder should be');
    const photo = jpeg(crypto.randomBytes(3000));
    const list = [{ image_url: photo }];
    expect(photosToFiles(blocked, list)).toEqual({ moved: 0, failed: 1 });
    expect(list[0].image_url).toBe(photo);
  });

  it('a photo is for the people signed in to the CRM, not for a kiosk tablet', () => {
    expect(needLevel('GET', '/api/photos/' + 'a'.repeat(32) + '.jpg')).toBe('any');
  });
});

// ---------------------------------------------------------------------------------------------
// The real server
// ---------------------------------------------------------------------------------------------
const PORT = 3478;
const base = `http://127.0.0.1:${PORT}`;
let proc, dir, db, storage, second;

const call = async (method, p, body) => {
  const res = await fetch(base + p, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  let json = null;
  try { json = await res.json(); } catch (e) { /* not JSON */ }
  return { status: res.status, body: json };
};
const bytesOf = async (address) => {
  const res = await fetch(base + address);
  return { status: res.status, type: res.headers.get('content-type'), bytes: Buffer.from(await res.arrayBuffer()) };
};
const eventually = async (fn, what) => {
  for (let i = 0; i < 40; i++) { const v = await fn(); if (v) return v; await sleep(100); }
  throw new Error('Never happened: ' + what);
};
async function start() {
  const t = Date.now();
  proc = spawn(process.execPath, ['server.js'], { cwd: root, stdio: 'ignore',
    env: { ...process.env, PORT: String(PORT), HTTPS_PORT: '0', STUDIO_CRM_TRIAL: '', STUDIO_CRM_OPEN: '', STUDIO_CRM_UPDATE_FEED: 'http://127.0.0.1:9/no-feed',
      SQLITE_DB_PATH: db, STUDIO_CRM_STORAGE: storage } });
  for (let i = 0; ; i++) {
    if (await fetch(base).then(() => true, () => false)) break;
    if (i > 600) throw new Error('The CRM did not start');
    await sleep(100);
  }
  return (Date.now() - t) / 1000;
}
async function stop() {
  if (!proc) return;
  const gone = new Promise((r) => proc.on('exit', r));
  proc.kill();
  await gone;
  proc = null;
}
const photoFiles = () => fs.readdirSync(path.join(storage, 'photos'));
const backupsBeforeMove = () => fs.readdirSync(path.join(storage, 'backups')).filter((n) => n.startsWith('before-photos-to-files_'));

describe('photos on the running CRM', () => {
  const work = crypto.randomBytes(40000), profile = crypto.randomBytes(20000), oldTab = crypto.randomBytes(20000);
  const signature = 'data:image/png;base64,' + crypto.randomBytes(2000).toString('base64');
  const logo = 'data:image/png;base64,' + crypto.randomBytes(2000).toString('base64');
  let ids;

  beforeAll(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'crm-photos-'));
    db = path.join(dir, 'studio.sqlite');
    storage = path.join(dir, 'storage');
    second = path.join(dir, 'second-folder');
    fs.mkdirSync(second);
    await start();
    await call('POST', '/api/access/skip');
    ids = (await call('GET', '/api/clients')).body.map((c) => c.id);
    expect(ids.length).toBeGreaterThanOrEqual(4);
  }, 90000);
  afterAll(async () => { await stop(); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Windows may still hold the file */ } });

  it('a new work photo becomes a file, and the same picture comes back from its address', async () => {
    const r = await call('POST', `/api/clients/${ids[0]}/tattoo-work`, { title: 'File photo', image_url: jpeg(work) });
    expect(r.status).toBe(201);
    const w = await eventually(async () => (await call('GET', `/api/gallery?client_id=${ids[0]}`)).body.find((x) => URL_RE.test(x.image_url) && /File photo/.test(JSON.stringify(x))), 'the work photo has an address');
    const got = await bytesOf(w.image_url);
    expect(got.status).toBe(200);
    expect(got.type).toBe('image/jpeg');
    expect(got.bytes.equals(work)).toBe(true);
  });

  it('a profile photo becomes one file for its three fields', async () => {
    expect((await call('POST', `/api/clients/${ids[0]}/photo`, { photo_url: jpeg(profile) })).status).toBe(200);
    const c = await eventually(async () => { const x = (await call('GET', `/api/clients/${ids[0]}`)).body; const cl = x.client || x; return URL_RE.test(cl.photo) && cl; }, 'the profile photo has an address');
    expect(c.avatar).toBe(c.photo);
    expect(c.avatar_url).toBe(c.photo);
    expect((await bytesOf(c.photo)).bytes.equals(profile)).toBe(true);
  });

  it('a profile photo an old browser tab still sends the old way reaches the client, not the shared browser data', async () => {
    expect((await call('PUT', `/api/app-data/client_photo_${ids[1]}`, { value: jpeg(oldTab) })).status).toBeLessThan(300);
    const c = await eventually(async () => { const x = (await call('GET', `/api/clients/${ids[1]}`)).body; const cl = x.client || x; return URL_RE.test(cl.photo) && cl; }, 'the old tab photo is on the client');
    expect((await bytesOf(c.photo)).bytes.equals(oldTab)).toBe(true);
    expect(Object.keys((await call('GET', '/api/app-data')).body).some((k) => k.startsWith('client_photo_'))).toBe(false);
  });

  it('only a real photo name is answered', async () => {
    for (const p of ['/api/photos/..%2F..%2Fstudio.sqlite', '/api/photos/abc.jpg', '/api/photos/' + '0'.repeat(32) + '.jpg', '/api/photos/' + '0'.repeat(32) + '.exe']) {
      expect((await bytesOf(p)).status, p).toBe(404);
    }
  });

  it('a backup copied to the second folder takes the photos with it', async () => {
    expect((await call('POST', '/api/database/backup-folder', { copyTo: second })).status).toBe(200);
    expect((await call('POST', '/api/database/create-snapshot', {})).status).toBe(200);
    expect(fs.readdirSync(second).some((n) => n.endsWith('.sqlite'))).toBe(true);
    expect(fs.readdirSync(path.join(second, 'photos')).sort()).toEqual(photoFiles().sort());
  });

  it('the screens no longer keep profile photos in the browser', () => {
    expect(read('public/app-features.js')).not.toMatch(/setItem\(['"]client_photo_/);
    expect(read('public/app-features.js')).not.toMatch(/getItem\(['"]client_photo_/);
    expect(read('public/js/app-data-sync.js').match(/var SYNCED = .*/)[0]).not.toContain('client_photo_');
    // sharing a gallery photo as a file must still work now that its address is not a data URL
    expect(read('public/app-features.js')).not.toMatch(/image_url\.startsWith\("data:image\/"\) && navigator\.canShare/);
  });

  // -------------------------------------------------------------------------------------------
  // A studio from before 1.0.47, with 1,000 photos in its database, starts the new version
  // -------------------------------------------------------------------------------------------
  describe('a studio with 1,000 photos in its database', () => {
    const N = 1000, SIZE = 100 * 1024;   // real photos are 300 to 500 KB; the waiting did not depend on what is in them
    const samples = new Map();
    const inlineProfile = crypto.randomBytes(20000), browserProfile = crypto.randomBytes(20000), flash = crypto.randomBytes(20000);
    let seconds, filesBefore;

    beforeAll(async () => {
      // a waiver signature and the studio logo are not photos: they stay where they are
      await call('POST', '/api/waivers', { client_id: ids[0], client_name: 'Signature Stays', signature });
      await call('PUT', '/api/app-data/poli_studio_logo', { value: logo });
      await sleep(800);
      filesBefore = photoFiles().length;
      await stop();

      const sq = new Database(db);
      const get = (k) => JSON.parse(sq.prepare('SELECT value FROM app_state WHERE key = ?').get(k).value);
      const put = (k, v) => sq.prepare('UPDATE app_state SET value = ? WHERE key = ?').run(JSON.stringify(v), k);
      const works = get('clientTattooWork');
      const top = works.reduce((m, w) => Math.max(m, Number(w.id) || 0), 0);
      for (let i = 1; i <= N; i++) {
        const b = crypto.randomBytes(SIZE);
        if (i % 400 === 1) samples.set(top + i, b);
        works.push({ id: top + i, client_id: ids[i % ids.length], client_name: 'Old photo', title: 'Old photo ' + i, category: 'Tattoo Session', date: '2026-01-01', artist: '', image_url: jpeg(b), notes: '', description: '', tags: [] });
      }
      put('clientTattooWork', works);
      const clients = get('clients');
      const c = clients.find((x) => x.id === ids[2]);
      c.photo = c.avatar = c.avatar_url = jpeg(inlineProfile);
      put('clients', clients);
      const appData = get('appData');
      appData['client_photo_' + ids[3]] = jpeg(browserProfile);
      put('appData', appData);
      const designs = get('flashDesigns');
      designs[0].image_url = jpeg(flash);
      put('flashDesigns', designs);
      sq.close();
      expect(fs.statSync(db).size + (fs.existsSync(db + '-wal') ? fs.statSync(db + '-wal').size : 0)).toBeGreaterThan(N * SIZE);

      seconds = await start();
      console.log(`[photos] a studio with ${N} photos of ${SIZE / 1024} KB started in ${seconds.toFixed(1)} s`);
    }, 300000);

    it('starts well inside the minute the updater gives a new version', () => {
      expect(seconds).toBeLessThan(30);
    });

    it('every photo is a file and shows the same picture', async () => {
      const all = (await call('GET', '/api/gallery')).body;
      const old = all.filter((w) => /^Old photo/.test(w.client_name || ''));
      expect(old.length).toBe(N);
      expect(old.every((w) => URL_RE.test(w.image_url))).toBe(true);
      for (const [id, b] of samples) expect((await bytesOf(old.find((w) => Number(w.id) === id).image_url)).bytes.equals(b), 'photo ' + id).toBe(true);
      expect(photoFiles().length).toBe(filesBefore + N + 3);   // + the two profile photos and the flash design
      expect(photoFiles().every((n) => PHOTO_NAME.test(n))).toBe(true);
    });

    it('profile photos from the record and from the browser data are on their clients, flash designs too', async () => {
      const client = async (id) => { const x = (await call('GET', `/api/clients/${id}`)).body; return x.client || x; };
      const a = await client(ids[2]), b = await client(ids[3]);
      expect((await bytesOf(a.photo)).bytes.equals(inlineProfile)).toBe(true);
      expect(a.avatar_url).toBe(a.photo);
      expect((await bytesOf(b.photo)).bytes.equals(browserProfile)).toBe(true);
      const appData = (await call('GET', '/api/app-data')).body;
      expect(Object.keys(appData).some((k) => k.startsWith('client_photo_'))).toBe(false);
      const designs = (await call('GET', '/api/flash')).body;
      const list = Array.isArray(designs) ? designs : designs.designs || designs.flash || [];
      expect(list.some((d) => URL_RE.test(d.image_url))).toBe(true);
      expect(list.some((d) => String(d.stencil_url || d.image_url).startsWith('data:image/svg+xml'))).toBe(true);   // a drawing, not a photo
    });

    it('a waiver signature and the studio logo stay inside their record', async () => {
      expect((await call('GET', '/api/waivers')).body.some((w) => w.signature === signature)).toBe(true);
      expect((await call('GET', '/api/app-data')).body.poli_studio_logo).toBe(logo);
    });

    it('made one backup of the database as it was, before moving anything', () => {
      const names = backupsBeforeMove();
      expect(names.length).toBe(1);
      const b = new Database(path.join(storage, 'backups', names[0]), { readonly: true });
      const n = b.prepare("SELECT length(value) n FROM app_state WHERE key = 'clientTattooWork'").get().n;
      b.close();
      expect(n).toBeGreaterThan(N * SIZE);
    });

    it('the database is small again', () => {
      const size = fs.statSync(db).size + (fs.existsSync(db + '-wal') ? fs.statSync(db + '-wal').size : 0);
      expect(size).toBeLessThan(10 * 1024 * 1024);
    });

    it('a save makes nobody wait: under 100 ms with 1,000 photos', async () => {
      // one small write, then the longest any request waits while the CRM saves. Best of three runs:
      // a busy test machine can add a pause once, photos in the database add seconds every time.
      const worstWait = async () => {
        await call('PUT', '/api/app-data/studio_tip_records', { value: '[]' });
        let worst = 0;
        for (const end = Date.now() + 900; Date.now() < end;) {
          const t = performance.now();
          await fetch(base + '/api/access');
          worst = Math.max(worst, performance.now() - t);
          await sleep(15);
        }
        return worst;
      };
      const runs = [await worstWait(), await worstWait(), await worstWait()];
      console.log('[photos] longest wait after a write, three runs (ms): ' + runs.map((r) => r.toFixed(0)).join(', '));
      expect(Math.min(...runs)).toBeLessThan(100);
    });

    it('starting again moves nothing and makes no second backup', async () => {
      const files = photoFiles().length;
      await stop();
      await start();
      expect(photoFiles().length).toBe(files);
      expect(backupsBeforeMove().length).toBe(1);
      expect((await call('GET', '/api/gallery')).body.filter((w) => /^Old photo/.test(w.client_name || '')).length).toBe(N);
    }, 120000);
  });
});
