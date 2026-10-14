// HTTPS on the studio network, with a certificate the CRM makes for itself.
//
// Why: a browser gives a page the camera (scanner, client photos) and the
// clipboard only on the computer itself (localhost) or over https. A tablet
// that opens http://the-server:3000 gets neither. With https://the-server:3443
// it gets both. The certificate is self-made, so each device shows one warning
// the first time ("not private"); nothing is sent outside the studio.
import crypto from 'crypto';
import fs from 'fs';
import https from 'https';
import os from 'os';
import path from 'path';
import selfsigned from 'selfsigned';

// Apple devices refuse a server certificate that is valid for more than 825 days.
const VALID_DAYS = 820;

export function lanAddresses() {
  return Object.values(os.networkInterfaces()).flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .map((n) => n.address);
}

// A certificate for every name and address this computer answers to. It is kept
// next to the database and made again when an address changes or it nears its end.
async function certificate(dataDir) {
  const keyFile = path.join(dataDir, 'https-key.pem');
  const certFile = path.join(dataDir, 'https-cert.pem');
  const names = [...new Set(['localhost', os.hostname()])];
  const addresses = ['127.0.0.1', ...lanAddresses()];
  try {
    const cert = fs.readFileSync(certFile, 'utf8');
    const x509 = new crypto.X509Certificate(cert);
    const covered = (x509.subjectAltName || '').split(',').map((s) => s.trim().replace(/^(DNS|IP Address):/, ''));
    const daysLeft = (new Date(x509.validTo).getTime() - Date.now()) / 86400000;
    if (daysLeft > 30 && [...names, ...addresses].every((n) => covered.includes(n))) {
      return { key: fs.readFileSync(keyFile, 'utf8'), cert };
    }
  } catch (e) { /* no certificate yet, or an unreadable one: make a new one */ }

  const notAfterDate = new Date(Date.now() + VALID_DAYS * 86400000);
  const pems = await selfsigned.generate([{ name: 'commonName', value: 'Studio CRM' }], {
    keySize: 2048,
    algorithm: 'sha256',
    notAfterDate,
    extensions: [
      { name: 'basicConstraints', cA: false },
      { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
      { name: 'extKeyUsage', serverAuth: true },
      { name: 'subjectAltName', altNames: [
        ...names.map((value) => ({ type: 2, value })),
        ...addresses.map((ip) => ({ type: 7, ip })),
      ] },
    ],
  });
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(keyFile, pems.private, { mode: 0o600 });
  fs.writeFileSync(certFile, pems.cert);
  return { key: pems.private, cert: pems.cert };
}

// Starts the https door next to the http one. A failure here never stops the CRM:
// it keeps running on http and says why https is missing.
export async function startHttps(app, port) {
  if (!port) return null;
  const dataDir = path.dirname(process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'studio_crm.sqlite'));
  try {
    const server = https.createServer(await certificate(dataDir), app);
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '0.0.0.0', resolve); });
    const addresses = lanAddresses();
    console.log(`For tablets and phones (camera, copy buttons): ${addresses.length ? addresses.map((a) => `https://${a}:${port}`).join('  or  ') : `https://localhost:${port}`}`);
    console.log('The first time, each device warns that the connection is "not private": choose Advanced, then Continue. The certificate was made by this computer.');
    return server;
  } catch (e) {
    console.log(`HTTPS is not available (${e.code || e.message}). The CRM still works on http; the camera only works on this computer.`);
    return null;
  }
}
