import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { zipSync, strToU8 } from 'fflate';
import { newer, assetName, unpack } from '../src/update.js';
import { needLevel } from '../src/access.js';

const { apply } = createRequire(import.meta.url)('../scripts/apply-update.cjs');

// An installed app with data, and an unpacked new version waiting in .update/new
function studio() {
  const app = fs.mkdtempSync(path.join(os.tmpdir(), 'crm-update-'));
  const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(app, rel)), { recursive: true }); fs.writeFileSync(path.join(app, rel), text); };
  put('server.js', 'old server'); put('public/index.html', 'old page'); put('package.json', '{"version":"1.0.12"}');
  put('data/studio_crm.sqlite', 'THE CLIENTS'); put('storage/backups/b.sqlite', 'backup'); put('Start Studio CRM.bat', 'old starter');
  put('.update/new/server.js', 'new server'); put('.update/new/public/index.html', 'new page'); put('.update/new/package.json', '{"version":"1.0.13"}');
  put('.update/new/data/studio_crm.sqlite', 'EMPTY'); put('.update/new/Start Studio CRM.bat', 'new starter'); put('.update/new/runtime/node.exe', 'node');
  put('.update/ready', JSON.stringify({ from: '1.0.12', to: '1.0.13', backup: 'storage/backups/b.sqlite' }));
  const read = (rel) => fs.readFileSync(path.join(app, rel), 'utf8');
  return { app, read };
}

describe('updates', () => {
  it('compares versions as numbers', () => {
    expect(newer('1.0.12', '1.0.9')).toBe(true);
    expect(newer('v1.1.0', '1.0.99')).toBe(true);
    expect(newer('1.0.11', '1.0.11')).toBe(false);
    expect(newer('1.0.10', '1.0.11')).toBe(false);
  });

  it('picks the download for this computer', () => {
    expect(assetName('win32', 'x64')).toBe('studio-crm-windows-x64.zip');
    expect(assetName('darwin', 'arm64')).toBe('studio-crm-macos-arm64.zip');
    expect(assetName('linux', 'ia32')).toBe(null);
  });

  it('swaps the program and never touches the data or the running starter', () => {
    const { app, read } = studio();
    expect(apply(app)).toBe(true);
    expect(read('server.js')).toBe('new server');
    expect(read('public/index.html')).toBe('new page');
    expect(read('data/studio_crm.sqlite')).toBe('THE CLIENTS');
    expect(read('storage/backups/b.sqlite')).toBe('backup');
    expect(read('Start Studio CRM.bat')).toBe('old starter');
    expect(read('.update/previous/server.js')).toBe('old server');   // the old version, to go back to
    expect(fs.existsSync(path.join(app, '.update/ready'))).toBe(false);
    expect(read('data/update.log')).toMatch(/updated 1\.0\.12 -> 1\.0\.13/);
  });

  it('puts everything back when a move fails half way', () => {
    const { app, read } = studio();
    // the new "public" folder cannot move in (on a real PC: a file held open, a full disk)
    const realRename = fs.renameSync;
    fs.renameSync = (from, to) => { if (to === path.join(app, 'public')) throw Object.assign(new Error('blocked'), { code: 'EEXIST' }); return realRename(from, to); };
    try { expect(apply(app)).toBe(false); } finally { fs.renameSync = realRename; }
    expect(read('server.js')).toBe('old server');
    expect(read('data/studio_crm.sqlite')).toBe('THE CLIENTS');
    expect(read('.update/new/server.js')).toBe('new server');
    expect(read('data/update.log')).toMatch(/FAILED, the old version is back/);
  });

  it('unpacks the ZIP without its top folder, and refuses a path outside it', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'crm-unpack-'));
    unpack(zipSync({ 'studio-crm/server.js': strToU8('x'), 'studio-crm/runtime/node': strToU8('n') }), dir);
    expect(fs.readFileSync(path.join(dir, 'server.js'), 'utf8')).toBe('x');
    expect(() => unpack(zipSync({ 'studio-crm/../../evil.txt': strToU8('x') }), dir)).toThrow(/outside/);
  });

  it('only an administrator may check or start an update', () => {
    expect(needLevel('GET', '/api/admin/update')).toBe('admin');
    expect(needLevel('POST', '/api/admin/update')).toBe('admin');
  });
});
