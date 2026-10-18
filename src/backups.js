import fs from 'fs';
import path from 'path';

// The daily backups are named auto_<YYYY-MM-DD>_<time>.sqlite, so sorting the names sorts them by
// date. Only those are pruned: backups made by hand or before an update are never deleted.
export const AUTO_BACKUP = /^auto_\d{4}-\d{2}-\d{2}_.*\.sqlite$/;

export function pruneAutoBackups(dir, keep) {
  let names;
  try { names = fs.readdirSync(dir).filter((n) => AUTO_BACKUP.test(n)).sort(); } catch (e) { return []; }
  const gone = names.slice(0, Math.max(0, names.length - keep));
  for (const n of gone) fs.rmSync(path.join(dir, n), { force: true });
  return gone;
}
