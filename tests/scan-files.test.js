import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { docIdFor, saveScanFiles, scanPagesOf } from '../src/scan-files.js';

const jpg = 'data:image/jpeg;base64,' + Buffer.from('front side').toString('base64');
const png = 'data:image/png;base64,' + Buffer.from('back side').toString('base64');

describe('DOC ID of a saved form', () => {
  it('is fixed by the record number and the year it was saved', () => {
    expect(docIdFor(42, '2026-11-01 01:27:10')).toBe('REC-2026-000042');
    expect(docIdFor(42, '2026-11-01 01:27:10')).toBe(docIdFor(42, '2026-11-01 01:27:10'));
  });
});

describe('scanned pages of a form', () => {
  it('lists each picture of each Scanner field in form order, pages counted per field', () => {
    const schema = { sections: [{ fields: [{ id: 'a', type: 'scanner', label: 'Card' }, { id: 'b', type: 'scanner' }] }] };
    const pages = scanPagesOf(schema, { a: [{ dataUrl: jpg }, { dataUrl: 'data:text/plain;base64,eA==' }, { dataUrl: png }], b: { dataUrl: jpg } });
    expect(pages.map((p) => [p.label, p.page, p.mime])).toEqual([['Card', 1, 'image/jpeg'], ['Card', 2, 'image/png'], ['b', 1, 'image/jpeg']]);
    expect(scanPagesOf(undefined, undefined)).toEqual([]);
  });
});

describe('scan files', () => {
  it('writes every scanned page, in groups too, named by date, client and DOC ID', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scans-'));
    const schema = { sections: [{ fields: [
      { id: 'card', type: 'scanner', label: 'Health card' },
      { id: 'grp', type: 'group', fields: [{ id: 'id2', type: 'scanner', label: 'ID' }] },
      { id: 'pic', type: 'photo_id', label: 'Photo' },
    ] }] };
    const responses = { card: [{ dataUrl: jpg }, { dataUrl: png }], id2: [{ dataUrl: jpg }], pic: [{ dataUrl: jpg }] };
    const names = saveScanFiles(dir, { docId: 'REC-2026-000042', clientName: 'Zoë O\'Neil', schema, responses, date: new Date('2026-11-01T12:00:00Z') });
    expect(names).toEqual([
      '2026-11-01_Zoe-O-Neil_REC-2026-000042_Health-card-1.jpg',
      '2026-11-01_Zoe-O-Neil_REC-2026-000042_Health-card-2.png',
      '2026-11-01_Zoe-O-Neil_REC-2026-000042_ID-1.jpg',
    ]);
    expect(fs.readFileSync(path.join(dir, names[1]), 'utf8')).toBe('back side');
  });
  it('skips anything that is not an image and never throws', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scans-'));
    const schema = { sections: [{ fields: [{ id: 'card', type: 'scanner', label: '../../evil' }] }] };
    expect(saveScanFiles(dir, { docId: 'REC-2026-000001', clientName: '', schema, responses: { card: [{ dataUrl: 'data:text/html;base64,PGI+' }, 'x', null] } })).toEqual([]);
    expect(saveScanFiles(dir, { docId: 'X', schema: null, responses: null })).toEqual([]);
    const names = saveScanFiles(dir, { docId: 'REC-2026-000001', clientName: '', schema, responses: { card: [{ dataUrl: jpg }] } });
    expect(names[0]).toMatch(/^\d{4}-\d\d-\d\d_client_REC-2026-000001_evil-1\.jpg$/);
  });
});
