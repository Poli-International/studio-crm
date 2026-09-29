// node scripts/build-guide.cjs
// Builds public/guide/<lang>.html from docs/USER-GUIDE.md (en) and docs/user-guide/<lang>.md.
// The Docs tab shows the page for the CRM's current language.
// Markdown subset used by the guide: # / ## headings, "1." lists, paragraphs, **bold**, `code`.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'guide');
const LANGS = ['en', 'fr', 'it', 'de', 'es', 'nl', 'pt', 'th'];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

function toHtml(md) {
  const out = [];
  let list = false;
  let title = '';
  for (const line of md.replace(/\r\n/g, '\n').split('\n')) {
    const t = line.trim();
    const li = t.match(/^\d+\.\s+(.*)$/);
    if (!li && list) { out.push('</ol>'); list = false; }
    if (!t) continue;
    if (t.startsWith('## ')) out.push(`<h2>${inline(t.slice(3))}</h2>`);
    else if (t.startsWith('# ')) { title = t.slice(2); out.push(`<h1>${inline(title)}</h1>`); }
    else if (li) { if (!list) { out.push('<ol>'); list = true; } out.push(`<li>${inline(li[1])}</li>`); }
    else out.push(`<p>${inline(t)}</p>`);
  }
  if (list) out.push('</ol>');
  return { title, body: out.join('\n') };
}

const CSS = `body{margin:0;padding:24px;background:#0F172A;color:#E2E8F0;font:15px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:760px;margin:0 auto}h1{font-size:1.6rem;color:#F8FAFC}h2{font-size:1.15rem;color:#38BDF8;margin-top:1.8em}
code{background:#1E293B;padding:1px 5px;border-radius:4px;font-size:0.9em}strong{color:#F8FAFC}li{margin:4px 0}`;

fs.mkdirSync(OUT, { recursive: true });
let built = 0;
for (const lang of LANGS) {
  const src = lang === 'en' ? path.join(ROOT, 'docs', 'USER-GUIDE.md') : path.join(ROOT, 'docs', 'user-guide', `${lang}.md`);
  if (!fs.existsSync(src)) { console.warn('missing', path.relative(ROOT, src)); continue; }
  const { title, body } = toHtml(fs.readFileSync(src, 'utf8'));
  fs.writeFileSync(path.join(OUT, `${lang}.html`),
    `<!DOCTYPE html>\n<html lang="${lang}">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n` +
    `<meta name="robots" content="noindex">\n<title>${esc(title)}</title>\n<style>${CSS}</style>\n</head>\n<body>\n<main>\n${body}\n</main>\n</body>\n</html>\n`);
  built++;
}
console.log(`built ${built} guide pages in public/guide/`);
