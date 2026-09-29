import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// public/i18n/<lang>.json maps exact English interface text to a translation
// (see public/js/i18n-phrases.js). Every language must cover the same phrases.
const dir = path.resolve(__dirname, '../public/i18n');
const langs = ['fr', 'it', 'de', 'es', 'nl', 'pt', 'th'];
const dicts = Object.fromEntries(langs.map((l) => [l, JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), 'utf8'))]));
const placeholders = (s) => (s.match(/\{\d+\}/g) || []).sort().join(',');
const lead = (s) => { const m = s.match(/^[^\p{L}\p{N}\s{$(]+/u); return m ? m[0].trim() : ''; };

describe('CRM phrase dictionaries', () => {
  it('every language has the same phrases as French', () => {
    const ref = Object.keys(dicts.fr).sort();
    for (const l of langs) expect(Object.keys(dicts[l]).sort(), l).toEqual(ref);
  });

  it('translations are non-empty and keep placeholders and the leading emoji', () => {
    const bad = [];
    for (const l of langs) {
      for (const [en, tr] of Object.entries(dicts[l])) {
        if (typeof tr !== 'string' || !tr.trim()) bad.push(`${l} empty: ${en}`);
        else if (placeholders(en) !== placeholders(tr)) bad.push(`${l} placeholders: ${en}`);
        else if (lead(en) && !tr.startsWith(lead(en))) bad.push(`${l} emoji: ${en}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
