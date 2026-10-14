// Optional studio password.
//
// Off by default: a studio with one trusted computer needs none. When the
// owner sets one (Settings), every device must sign in before it sees a page
// or an /api answer. It is one password for the studio, not one per person:
// it keeps people on the same network out, it does not limit what staff can do.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const COOKIE = 'studio_session';
const SESSION_DAYS = 30;
const hashOf = (password, salt) => crypto.scryptSync(String(password), salt, 64);

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex"><title>Studio CRM: sign in</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0B1120;color:#F8FAFC;font-family:system-ui,sans-serif}
form{background:#0F172A;border:1px solid #334155;border-radius:16px;padding:28px;width:min(92vw,360px)}h1{font-size:1.2rem;margin:0 0 6px}
p{color:#94A3B8;font-size:.85rem;margin:0 0 18px}input{width:100%;box-sizing:border-box;padding:11px 12px;background:#1E293B;border:1px solid #475569;border-radius:8px;color:#F8FAFC;font-size:1rem}
button{margin-top:14px;width:100%;padding:11px;background:#2563EB;color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:.95rem;cursor:pointer}
#error{color:#FCA5A5;font-size:.85rem;min-height:1.2em;margin-top:10px}</style></head>
<body><form id="login-form"><h1>Studio CRM</h1><p>This studio is protected by a password.</p>
<label for="login-password" style="display:block;font-size:.8rem;color:#94A3B8;margin-bottom:4px">Studio password</label>
<input type="password" id="login-password" autocomplete="current-password" required autofocus>
<button type="submit" id="login-submit">Sign in</button><div id="error" role="alert"></div></form>
<script>
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  var error = document.getElementById('error');
  error.textContent = '';
  try {
    var res = await fetch('/api/access/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: document.getElementById('login-password').value }) });
    if (res.ok) { window.location.reload(); return; }
    error.textContent = (await res.json()).error || 'Could not sign in';
  } catch (err) { error.textContent = 'The server did not answer'; }
});
</script></body></html>`;

export function installAccess(app, sqlite) {
  sqlite.exec('CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL)');
  const read = () => {
    const row = sqlite.prepare("SELECT value FROM app_state WHERE key = 'studioAccess'").get();
    try { return row ? JSON.parse(row.value) : null; } catch (e) { return null; }
  };
  const write = (value) => {
    if (!value) sqlite.prepare("DELETE FROM app_state WHERE key = 'studioAccess'").run();
    else sqlite.prepare('INSERT OR REPLACE INTO app_state (key, value, updated_at) VALUES (?, ?, ?)').run('studioAccess', JSON.stringify(value), new Date().toISOString());
  };

  // Forgotten password: an empty file named reset-password.txt in the data folder removes it at the next start.
  const dataDir = path.dirname(process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'studio_crm.sqlite'));
  const resetFile = path.join(dataDir, 'reset-password.txt');
  if (fs.existsSync(resetFile)) {
    write(null);
    try { fs.unlinkSync(resetFile); } catch (e) { /* read-only folder: the password is removed all the same */ }
    console.log('The studio password was removed (reset-password.txt found).');
  }

  let access = read();                 // { salt, hash } or null
  const sessions = new Map();          // token -> expiry time; signing in again after a restart is fine
  const failures = new Map();          // address -> { count, until }

  const matches = (password) => {
    if (!access) return false;
    const given = hashOf(password, Buffer.from(access.salt, 'hex'));
    const stored = Buffer.from(access.hash, 'hex');
    return given.length === stored.length && crypto.timingSafeEqual(given, stored);
  };
  const tokenOf = (req) => {
    const found = (req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).find(([name]) => name === COOKIE);
    return found ? found[1] : '';
  };
  const signedIn = (req) => {
    const expiry = sessions.get(tokenOf(req));
    return !!expiry && expiry > Date.now();
  };
  const startSession = (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, Date.now() + SESSION_DAYS * 86400000);
    res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${req.secure ? '; Secure' : ''}`);
  };

  // The gate: before the static files and every route.
  app.use((req, res, next) => {
    if (!access || signedIn(req) || req.path.startsWith('/api/access')) return next();
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Sign in with the studio password first' });
    res.status(401).set('Cache-Control', 'no-store').type('html').send(LOGIN_PAGE);
  });

  app.get('/api/access', (req, res) => res.json({ passwordSet: !!access, signedIn: !access || signedIn(req) }));

  app.post('/api/access/login', (req, res) => {
    const who = req.ip;
    const fail = failures.get(who) || { count: 0, until: 0 };
    if (fail.until > Date.now()) return res.status(429).json({ error: 'Too many wrong passwords. Wait half a minute and try again.' });
    if (!matches(req.body && req.body.password)) {
      fail.count++;
      if (fail.count >= 5) { fail.until = Date.now() + 30000; fail.count = 0; }
      failures.set(who, fail);
      return res.status(401).json({ error: 'Wrong password' });
    }
    failures.delete(who);
    startSession(req, res);
    res.json({ ok: true });
  });

  app.post('/api/access/logout', (req, res) => {
    sessions.delete(tokenOf(req));
    res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    res.json({ ok: true });
  });

  // Set, change or remove the password. Changing or removing needs the current one.
  app.post('/api/access/password', (req, res) => {
    const { current = '', next = '' } = req.body || {};
    if (access && !matches(current)) return res.status(403).json({ error: 'The current password is wrong' });
    if (!next) {
      access = null;
      write(null);
      sessions.clear();
      return res.json({ ok: true, passwordSet: false });
    }
    if (String(next).length < 8) return res.status(400).json({ error: 'Use at least 8 characters' });
    const salt = crypto.randomBytes(16);
    access = { salt: salt.toString('hex'), hash: hashOf(next, salt).toString('hex') };
    write(access);
    sessions.clear();          // every other device signs in again
    startSession(req, res);    // this one stays in
    res.json({ ok: true, passwordSet: true });
  });
}
