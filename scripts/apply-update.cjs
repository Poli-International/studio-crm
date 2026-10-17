// Swaps in an update unpacked by src/update.js. The starter runs this when it finds .update/ready, after
// the CRM has stopped and before it starts it again, with a copy of the NEW version's node (.update/node[.exe]),
// so no file of the app is in use.
//
// The studio's data (data/, storage/) is never touched. Every program file or folder of the old version moves
// to .update/previous/ and the new one moves in, by rename (same disk, nothing copied). If any move fails,
// every move already made is undone, so the folder is exactly as before and the old version starts.
'use strict';
const fs = require('fs');
const path = require('path');

// not part of an update: the studio's data, the update's own folder, and the starters (one of them is
// running this very moment; cmd.exe reads a .bat as it goes, so replacing it mid-run breaks it)
// ponytail: a new version cannot change its starters this way; ship that as a manual update if it ever must
const KEEP = new Set(['data', 'storage', '.update', 'Start Studio CRM.bat', 'Start Studio CRM.command', 'start-studio-crm.sh']);

function sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

// Windows: an antivirus scanning the new files can hold them for a moment
function rename(from, to) {
  for (let i = 0; ; i++) {
    try { return fs.renameSync(from, to); } catch (e) {
      if (i >= 20 || !['EPERM', 'EBUSY', 'EACCES'].includes(e.code)) throw e;
      sleep(500);
    }
  }
}

function apply(app) {
  const work = path.join(app, '.update');
  const fresh = path.join(work, 'new');
  const previous = path.join(work, 'previous');
  const ready = path.join(work, 'ready');
  const info = JSON.parse(fs.readFileSync(ready, 'utf8'));
  const log = (line) => {
    fs.mkdirSync(path.join(app, 'data'), { recursive: true });
    fs.appendFileSync(path.join(app, 'data', 'update.log'), `${new Date().toISOString()} ${line}\n`);
  };

  fs.rmSync(previous, { recursive: true, force: true });   // the version before last
  fs.mkdirSync(previous, { recursive: true });
  const done = [];   // [from, to] in the order made, to undo
  try {
    for (const name of fs.readdirSync(fresh)) {
      if (KEEP.has(name)) continue;
      if (fs.existsSync(path.join(app, name))) { rename(path.join(app, name), path.join(previous, name)); done.push([path.join(app, name), path.join(previous, name)]); }
      rename(path.join(fresh, name), path.join(app, name)); done.push([path.join(fresh, name), path.join(app, name)]);
    }
  } catch (e) {
    for (const [from, to] of done.reverse()) { try { rename(to, from); } catch (e2) { log('UNDO FAILED ' + to + ' -> ' + from + ': ' + e2.message); } }
    fs.rmSync(ready, { force: true });
    log(`update ${info.from} -> ${info.to} FAILED, the old version is back: ${e.message}`);
    return false;
  }
  fs.rmSync(ready, { force: true });
  log(`updated ${info.from} -> ${info.to}; database backup ${info.backup}; old version kept in .update/previous`);
  return true;
}

module.exports = { apply, KEEP };

if (require.main === module) {
  // this file is in <app>/.update/new/scripts/: the app is three folders up
  const app = path.resolve(__dirname, '..', '..', '..');
  try { process.exitCode = apply(app) ? 0 : 1; } catch (e) { console.error('The update could not be applied: ' + e.message); process.exitCode = 1; }
}
