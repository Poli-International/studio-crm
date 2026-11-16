// Photos as files (1.0.47). A photo used to sit inside its record as text, and every record is rewritten
// into the database after each write: 100 photos made every desk wait five seconds. A photo is a file in
// storage/photos now, named by what is in it, and the record holds its address: /api/photos/<name>.
//
// The order that keeps a photo safe: the file is written and flushed first, only then does the record
// change. A photo whose file cannot be written stays in its record.
// ponytail: a deleted photo's file stays, so that an older backup still finds its pictures; "Erase this
// person's data" is where files will be removed.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PHOTO = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/;
const EXT = { jpeg: 'jpg', png: 'png', webp: 'webp' };
export const PHOTO_NAME = /^[a-f0-9]{32}\.(jpg|png|webp)$/;
export const isPhotoData = (v) => typeof v === 'string' && PHOTO.test(v);

// every photo still written inside node (a list or a record, at any depth): fn answers its new value, or nothing
function eachPhoto(node, fn) {
  if (!node || typeof node !== 'object') return;
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (typeof v !== 'string') { eachPhoto(v, fn); continue; }
    if (v.length < 64 || !v.startsWith('data:image/')) continue;
    const m = PHOTO.exec(v);
    if (!m) continue;
    const to = fn(m[1], m[2]);
    if (to) node[k] = to;
  }
}

export function countPhotos(node) {
  let n = 0;
  eachPhoto(node, () => { n++; });
  return n;
}

function writeOnce(dir, name, bytes, flush) {
  const file = path.join(dir, name);
  try { if (fs.statSync(file).size === bytes.length) return; } catch (e) { /* not there yet */ }
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  const fd = fs.openSync(tmp, 'w');
  try { fs.writeSync(fd, bytes); if (flush) fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  fs.renameSync(tmp, file);
}

// Moves every photo inside node to a file in dir. flush: false only where the database is a throwaway copy.
export function photosToFiles(dir, node, { flush = true } = {}) {
  const out = { moved: 0, failed: 0 };
  eachPhoto(node, (type, base64) => {
    try {
      const bytes = Buffer.from(base64, 'base64');
      const name = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 32) + '.' + EXT[type];
      writeOnce(dir, name, bytes, flush);
      out.moved++;
      return '/api/photos/' + name;
    } catch (e) {
      if (!out.failed++) console.error(`[photos] could not write to ${dir}, so the photo stays in the database: ${e.message}`);
    }
  });
  return out;
}

// The second backup folder gets the photos it does not have yet. Answers how many were copied.
export function copyPhotos(from, to) {
  let names;
  try { names = fs.readdirSync(from).filter((n) => PHOTO_NAME.test(n)); } catch (e) { return 0; }
  if (!names.length) return 0;
  fs.mkdirSync(to, { recursive: true });
  const have = new Set(fs.readdirSync(to));
  let n = 0;
  for (const name of names) if (!have.has(name)) { fs.copyFileSync(path.join(from, name), path.join(to, name)); n++; }
  return n;
}
