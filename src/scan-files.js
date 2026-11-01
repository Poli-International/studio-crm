// Each page from a Scanner field, kept at full size as a file on the CRM computer (Henry, 2026-11-01):
// storage/scans/<date>_<client>_<DOC ID>_<field>-<n>.jpg, so a scan is found from the DOC ID on the PDF.
// The same pages stay in the saved form in the database; these files are a copy that is easy to open.
import fs from 'node:fs';
import path from 'node:path';

// The DOC ID printed on a saved form's PDF: fixed by the form's record number, so a reprint shows the same one.
export const docIdFor = (id, savedAt) => {
  const d = savedAt ? new Date(String(savedAt).replace(' ', 'T') + (/Z|[+-]\d\d:?\d\d$/.test(String(savedAt)) ? '' : 'Z')) : new Date();
  return `REC-${isNaN(d) ? new Date().getFullYear() : d.getUTCFullYear()}-${String(id).padStart(6, '0')}`;
};

const slug = (s) => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

function scannerFields(fields, out = []) {
  for (const f of fields || []) {
    if (!f) continue;
    if (f.type === 'scanner') out.push(f);
    if (Array.isArray(f.fields)) scannerFields(f.fields, out); // fields inside a group
  }
  return out;
}

// Writes the pages and answers the file names written. Never throws: the form is already saved.
export function saveScanFiles(dir, { docId, clientName, schema, responses, date = new Date() }) {
  const written = [];
  try {
    const fields = scannerFields([].concat(...((schema && schema.sections) || []).map((s) => (s && s.fields) || [])));
    const base = `${date.toISOString().slice(0, 10)}_${slug(clientName) || 'client'}_${docId}`;
    for (const f of fields) {
      const pages = [].concat((responses && responses[f.id]) || []);
      pages.forEach((p, i) => {
        const m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec((p && p.dataUrl) || '');
        if (!m) return;
        fs.mkdirSync(dir, { recursive: true });
        const name = `${base}_${slug(f.label || f.id) || 'scan'}-${i + 1}.${m[1] === 'png' ? 'png' : 'jpg'}`;
        fs.writeFileSync(path.join(dir, name), Buffer.from(m[2], 'base64'));
        written.push(name);
      });
    }
  } catch (e) {
    console.warn('Scans: could not save a copy in ' + dir + ': ' + e.message);
  }
  return written;
}
