import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pruneAutoBackups } from '../src/backups.js';

describe('daily backups', () => {
  it('keeps the newest daily backups and never touches the others', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'crm-backups-'));
    const daily = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'].map((d) => `auto_${d}_${d}T09-00-00-000Z.sqlite`);
    const others = ['studio_crm_2026-09-01T10-00-00-000Z.sqlite', 'before-update-to-1.0.16_2026-09-02.sqlite', 'notes.txt'];
    for (const n of [...daily, ...others]) fs.writeFileSync(path.join(dir, n), 'x');

    expect(pruneAutoBackups(dir, 2)).toEqual(daily.slice(0, 2));
    expect(fs.readdirSync(dir).sort()).toEqual([...daily.slice(2), ...others].sort());
    expect(pruneAutoBackups(dir, 30)).toEqual([]);
    expect(pruneAutoBackups(path.join(dir, 'missing'), 2)).toEqual([]);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
