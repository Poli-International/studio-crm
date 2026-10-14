import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// A closing tag too many once ended the Log Activity window early and left its
// form loose at the bottom of every page. Browsers repair bad nesting silently,
// so the page is checked here: every block must close what it opened.
describe('public/index.html', () => {
  it('opens and closes its blocks in order', () => {
    const lines = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8').split('\n');
    const open = [];
    const problems = [];
    lines.forEach((line, i) => {
      const re = /<(\/?)(div|form|section|main|aside|header|table|thead|tbody|tr|ul|ol|details)\b[^>]*>/g;
      let m;
      while ((m = re.exec(line))) {
        if (!m[1]) { open.push({ tag: m[2], line: i + 1 }); continue; }
        const top = open.pop();
        if (!top) problems.push(`line ${i + 1}: </${m[2]}> closes nothing`);
        else if (top.tag !== m[2]) problems.push(`line ${i + 1}: </${m[2]}> closes <${top.tag}> from line ${top.line}`);
      }
    });
    open.forEach((o) => problems.push(`line ${o.line}: <${o.tag}> is never closed`));
    expect(problems).toEqual([]);
  });
});
