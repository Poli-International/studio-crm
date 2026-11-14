import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import Database from 'better-sqlite3';
import http from 'node:http';
import fs from 'node:fs';
import { installAccess, needLevel, cleanPath, isLocalRequest } from '../src/access.js';

// Express answers /API/Clients and /api/clients/ like /api/clients. The level check once judged the
// address as typed, so capitals or a final slash passed for a page. These tests keep the two in step.
describe('an address written another way needs the same level', () => {
  const src = ['server.js', 'src/access.js', 'src/update.js'].map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const paths = new Set();
  for (const m of src.matchAll(/app\.(?:get|post|put|patch|delete)\(\s*(\[[^\]]+\]|'[^']+')/g)) for (const p of m[1].matchAll(/'([^']+)'/g)) if (p[1].startsWith('/')) paths.add(p[1]);

  it('finds the routes', () => expect(paths.size).toBeGreaterThan(200));

  it('capitals, a final slash, a number with letters after it', () => {
    const wrong = [];
    for (const route of paths) {
      const plain = route.replace(/:[A-Za-z_]+/g, '7');
      const forms = [plain.toUpperCase(), plain + '/', '/' + plain.slice(1, 2).toUpperCase() + plain.slice(2), route.replace(/:[A-Za-z_]+/g, '7abc')];
      for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
        for (const form of forms) if (needLevel(method, form) !== needLevel(method, plain)) wrong.push(`${method} ${form}: ${needLevel(method, form)}, but ${plain}: ${needLevel(method, plain)}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('cleanPath', () => {
    expect(cleanPath('/API/Clients/')).toBe('/api/clients');
    expect(cleanPath('/api/staff//')).toBe('/api/staff');
    expect(cleanPath('/')).toBe('/');
    expect(cleanPath('')).toBe('/');
  });

  it('the team, the stations and the settings stay with administrators however the address is written', () => {
    for (const [method, path] of [['PATCH', '/api/staff/3abc'], ['POST', '/api/staff/'], ['POST', '/API/STAFF'], ['PATCH', '/api/professionals/3%20'],
      ['PATCH', '/api/stations/2x'], ['POST', '/api/stations/'], ['PUT', '/api/app-data/poli_studio_profile/'], ['PUT', '/API/app-data/poli_kiosk_exit_pin'],
      ['POST', '/API/access/staff-login'], ['POST', '/Api/Admin/start-empty'], ['PUT', '/API/settings']]) expect(needLevel(method, path), `${method} ${path}`).toBe('admin');
    expect(needLevel('POST', '/api/staff/assign-shift')).toBe('rota');
    expect(needLevel('GET', '/API/financial')).toBe('finance');
    expect(needLevel('POST', '/API/clients')).toBe('clients');
  });
});

describe('this computer, or another device', () => {
  const local = { remoteAddress: '127.0.0.1', host: 'localhost:3000' };
  it('the CRM computer itself', () => {
    expect(isLocalRequest(local)).toBe(true);
    expect(isLocalRequest({ remoteAddress: '::1', host: '[::1]:3000' })).toBe(true);
    expect(isLocalRequest({ remoteAddress: '::ffff:127.0.0.1', host: '127.0.0.1:3443', origin: 'https://127.0.0.1:3443' })).toBe(true);
  });
  it('a tablet or another PC on the network', () => expect(isLocalRequest({ remoteAddress: '192.168.1.20', host: '192.168.1.5:3000' })).toBe(false));
  it('the CRM computer through its network address', () => expect(isLocalRequest({ remoteAddress: '192.168.1.5', host: '192.168.1.5:3000' })).toBe(false));
  it('the name of another website pointed at this computer', () => expect(isLocalRequest({ ...local, host: 'attacker.example:3000' })).toBe(false));
  it('a page of another website sending the request', () => {
    expect(isLocalRequest({ ...local, origin: 'https://evil.example' })).toBe(false);
    expect(isLocalRequest({ ...local, origin: 'http://localhost:8080' })).toBe(false);
    expect(isLocalRequest({ ...local, origin: 'null' })).toBe(false);
  });
  it('a proxy in front', () => expect(isLocalRequest({ ...local, forwarded: '203.0.113.9' })).toBe(false));
  it('nothing known', () => expect(isLocalRequest()).toBe(false));
});

// The real gate, on a small app with a few routes named like the CRM's.
describe('the gate and the level check on a running server', () => {
  let server;
  let port;
  const staff = [{ id: 1, name: 'Owner' }, { id: 3, name: 'Desk' }];
  const call = (method, path, { body, cookie, headers = {} } = {}) => new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({ host: '127.0.0.1', port, method, path, headers: { host: `127.0.0.1:${port}`, ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}), ...(cookie ? { cookie } : {}), ...headers } }, (res) => {
      let text = '';
      res.on('data', (d) => { text += d; });
      res.on('end', () => resolve({ status: res.statusCode, text, cookie: (res.headers['set-cookie'] || [''])[0].split(';')[0], acao: res.headers['access-control-allow-origin'] }));
    });
    req.on('error', reject);
    req.end(data);
  });

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    installAccess(app, new Database(':memory:'), () => staff);
    const ok = (req, res) => res.status(req.method === 'GET' ? 200 : 201).json({ ok: true });
    app.get('/api/clients', ok);
    app.post('/api/clients', ok);
    app.get('/api/financial', ok);
    app.post(['/api/staff', '/api/professionals'], ok);
    app.patch('/api/staff/:id', ok);
    app.post('/api/admin/start-empty', ok);
    app.get('/', (req, res) => res.send('the CRM'));
    await new Promise((r) => { server = app.listen(0, '127.0.0.1', r); });
    port = server.address().port;
  });
  afterAll(() => server.close());

  it('first start: only the CRM computer may go on without a password, and not for another website', async () => {
    expect((await call('GET', '/api/clients')).status).toBe(401);
    expect((await call('POST', '/api/access/skip', { headers: { host: 'attacker.example' } })).status).toBe(401);
    expect((await call('POST', '/api/access/skip', { headers: { origin: 'https://evil.example' } })).status).toBe(401);
    expect((await call('GET', '/', { headers: { 'x-forwarded-for': '203.0.113.9' } })).text).toContain('id="setup-skip" style="display:none"');
    expect((await call('GET', '/')).text).not.toContain('id="setup-skip" style="display:none"');
    expect((await call('POST', '/api/access/skip')).status).toBe(200);
  });

  it('no password: open on the CRM computer, closed to every other way in', async () => {
    const mine = await call('GET', '/api/clients');
    expect(mine.status).toBe(200);
    expect(mine.acao).toBeUndefined();   // no "any website may read this" header
    expect((await call('GET', '/api/clients', { headers: { origin: `http://127.0.0.1:${port}` } })).status).toBe(200);   // the CRM's own page
    expect((await call('GET', '/api/clients', { headers: { host: 'attacker.example' } })).status).toBe(401);
    expect((await call('POST', '/api/admin/start-empty', { headers: { origin: 'https://evil.example' } })).status).toBe(401);
    expect((await call('POST', '/api/admin/start-empty', { headers: { origin: 'null' } })).status).toBe(401);
    expect((await call('GET', '/api/clients', { headers: { 'x-forwarded-for': '203.0.113.9' } })).status).toBe(401);
    expect((await call('POST', '/api/access/password', { body: { next: 'taken-over-1' }, headers: { host: 'attacker.example' } })).status).toBe(401);
    const page = await call('GET', '/', { headers: { host: '192.168.1.5:3000' } });
    expect(page.status).toBe(401);
    expect(page.text).toContain('This studio has no password yet');
  });

  it('with logins: a limited login and a kiosk tablet stay limited, however the address is written', async () => {
    const admin = (await call('POST', '/api/access/password', { body: { next: 'studio-pass-1' } })).cookie;
    expect(admin).toMatch(/^studio_session=/);
    // not signed in: the sign-in answers, nothing else does (also not the routes under /api/access)
    expect((await call('GET', '/api/clients')).status).toBe(401);
    expect((await call('POST', '/api/access/staff-login', { body: { staff_id: 3, level: 'admin', password: 'intruder-1' } })).status).toBe(401);
    expect((await call('POST', '/API/access/staff-login', { body: { staff_id: 3, level: 'admin', password: 'intruder-1' } })).status).toBe(401);
    expect(JSON.parse((await call('GET', '/api/access')).text)).toEqual({ passwordSet: true, signedIn: false, chosen: true, staffLogins: false, kioskPasswordSet: false });

    expect((await call('POST', '/api/access/staff-login', { cookie: admin, body: { staff_id: 3, level: 'front_desk', password: 'front-desk-1' } })).status).toBe(200);
    expect((await call('POST', '/api/access/kiosk-password', { cookie: admin, body: { password: 'kiosk-1' } })).status).toBe(200);
    const desk = (await call('POST', '/api/access/login', { body: { staff_id: 3, password: 'front-desk-1' } })).cookie;
    const kiosk = (await call('POST', '/api/kiosk/login', { body: { password: 'kiosk-1', name: 'Stand' } })).cookie;

    expect((await call('GET', '/api/clients', { cookie: desk })).status).toBe(200);
    expect((await call('POST', '/api/clients', { cookie: desk, body: {} })).status).toBe(201);
    for (const [method, path] of [['GET', '/api/financial'], ['GET', '/API/financial'], ['GET', '/Api/Financial/'], ['POST', '/api/staff'], ['POST', '/api/staff/'], ['POST', '/API/professionals'],
      ['PATCH', '/api/staff/3'], ['PATCH', '/api/staff/3abc'], ['POST', '/API/admin/start-empty'], ['POST', '/API/access/staff-login'], ['POST', '/api/access/staff-login/']]) {
      expect((await call(method, path, { cookie: desk, body: { staff_id: 3, level: 'admin' } })).status, `Front desk ${method} ${path}`).toBe(403);
    }
    for (const [method, path] of [['POST', '/api/clients'], ['POST', '/API/clients'], ['POST', '/API/access/staff-login'], ['POST', '/API/admin/start-empty'], ['GET', '/api/clients']]) {
      expect((await call(method, path, { cookie: kiosk, body: { staff_id: 1, level: 'admin', password: 'kiosk-owned-1' } })).status, `Kiosk ${method} ${path}`).toBe(403);
    }
    // the Front desk login is still a Front desk login
    expect(JSON.parse((await call('GET', '/api/access', { cookie: desk })).text).level).toBe('front_desk');
  });
});
