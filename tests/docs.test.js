import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// The guides and docs must follow the app: same sections in every language, the labels the
// screen really shows, nothing that was removed, and screenshots of the current design.
const require = createRequire(import.meta.url);
const ROOT = path.resolve(__dirname, '..');
const guide = require('../scripts/build-guide.cjs');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const LANGS = guide.LANGS.filter((l) => l !== 'en');
const md = Object.fromEntries(guide.LANGS.map((l) => [l, fs.readFileSync(guide.sourceOf(l), 'utf8')]));
const lf = (s) => s.replace(/\r\n/g, '\n');

// paragraphs per section, counted the way build-guide.cjs renders them (one <p> or <li> per line)
const shape = (s) => {
  const out = [];
  for (const line of lf(s).split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('# ')) continue;
    if (t.startsWith('## ')) out.push(0);
    else if (out.length) out[out.length - 1]++;
  }
  return out;
};

describe('CRM user guide', () => {
  it('every language has the English sections, paragraph for paragraph', () => {
    const en = shape(md.en);
    for (const l of LANGS) expect(shape(md[l]), `${l}: sections or paragraphs differ from docs/USER-GUIDE.md`).toEqual(en);
  });

  it('public/guide pages are built from the current guides (run node scripts/build-guide.cjs)', () => {
    for (const l of guide.LANGS) expect(lf(read(`public/guide/${l}.html`)), l).toBe(guide.page(l));
  });

  it('a bold screen label is the one the CRM shows in that language', () => {
    // public/i18n/<lang>.json is what the screen shows; a guide naming the English label sends
    // a French studio looking for "Edit" on a screen that says "Modifier".
    const bold = (s) => [...s.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1].trim());
    const norm = (s) => s.replace(/^[^\p{L}\p{N}+]+/u, '').trim();
    const enLabels = new Set(bold(md.en));
    const bad = [];
    for (const l of LANGS) {
      const dict = {};
      for (const [k, v] of Object.entries(JSON.parse(read(`public/i18n/${l}.json`)))) dict[norm(k)] = norm(v);
      for (const b of new Set(bold(md[l]))) if (enLabels.has(b) && dict[b] && dict[b] !== b) bad.push(`${l}: **${b}** -> **${dict[b]}**`);
    }
    expect(bad).toEqual([]);
  });
});

describe('docs', () => {
  const docs = ['README.md', 'TECHNICAL_DOCUMENTATION.md', 'docs/USER-GUIDE.md', ...LANGS.map((l) => `docs/user-guide/${l}.md`),
    ...fs.readdirSync(path.join(ROOT, 'public/tools')).flatMap((t) => {
      const dir = path.join(ROOT, 'public/tools', t);
      return fs.statSync(dir).isDirectory() ? fs.readdirSync(dir).filter((f) => /^documentation(-[a-z]{2})?\.html$/.test(f)).map((f) => `public/tools/${t}/${f}`) : [];
    })];

  it('never mention a removed screen, button or build (tests/docs-removed-ui.json)', () => {
    const { entries } = JSON.parse(read('tests/docs-removed-ui.json'));
    const bad = [];
    for (const e of entries) {
      const re = new RegExp(e.pattern, 'i');
      for (const f of docs) if (!(e.allowIn || []).includes(f) && re.test(read(f))) bad.push(`${f}: "${e.pattern}" (${e.why})`);
    }
    expect(bad).toEqual([]);
  });

  it('screenshots show the current design (package.json uiDesign; retake with node scripts/screenshots.mjs)', () => {
    const { uiDesign } = JSON.parse(read('package.json'));
    expect(JSON.parse(read('docs/screenshots/manifest.json')).uiDesign).toBe(uiDesign);
    const missing = [...read('README.md').matchAll(/docs\/screenshots\/([\w.-]+\.webp)/g)].map((m) => m[1])
      .filter((f) => !fs.existsSync(path.join(ROOT, 'docs/screenshots', f)));
    expect(missing).toEqual([]);
  });

  it('a tool documentation page is in all eight languages, never half', () => {
    // Patrick 2026-10-20: every tool in EN FR DE IT ES NL PT TH. Until the Thai pass is done the
    // older seven-language set and English-only pages are tolerated; any other mix is a half job.
    // ponytail: drop the two LEGACY entries when the Thai/translation pass lands, so only `all` passes.
    const all = ['de', 'es', 'fr', 'it', 'nl', 'pt', 'th'].join();
    const LEGACY = ['', ['de', 'es', 'fr', 'it', 'nl', 'pt'].join()];
    const half = [];
    for (const t of fs.readdirSync(path.join(ROOT, 'public/tools'))) {
      const dir = path.join(ROOT, 'public/tools', t);
      if (!fs.existsSync(path.join(dir, 'documentation.html'))) continue;
      const have = fs.readdirSync(dir).map((f) => f.match(/^documentation-([a-z]{2})\.html$/)?.[1]).filter(Boolean).sort().join();
      if (have !== all && !LEGACY.includes(have)) half.push(`${t}: ${have || 'English only'}`);
    }
    expect(half).toEqual([]);
  });
});
