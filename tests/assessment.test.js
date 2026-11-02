import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import { ASSESSMENT_TABLES, COLUMN_MIGRATIONS, HEALTH_COLUMN, questionVisible, trialGate } from '../src/assessment.js';

describe('no health status anywhere in the assessment or the team', () => {
  it('no column of the assessment tables or staff could hold a diagnosis, test result or vaccination answer', async () => {
    process.env.SQLITE_DB_PATH = ':memory:';
    const { sqlite } = await import('../src/db/index.js');
    const tables = ['candidates', 'assessment_items', 'question_bank', 'studio_rules', 'staff', 'certifications'];
    const cols = tables.flatMap((t) => sqlite.prepare(`PRAGMA table_info(${t})`).all().map((c) => `${t}.${c.name}`));
    expect(cols).toContain('staff.hepb_vaccine_offered_on');
    expect(cols).toContain('candidates.track');
    expect(cols.filter((c) => HEALTH_COLUMN.test(c.split('.')[1]))).toEqual([]);
  });
  it('the guard itself catches the obvious ones', () => {
    for (const bad of ['hiv_status', 'hepatitis_b', 'hbv_result', 'viral_load', 'diagnosis', 'vaccine_declined', 'vaccinated', 'test_result', 'health_notes'])
      expect(HEALTH_COLUMN.test(bad), bad).toBe(true);
    expect(HEALTH_COLUMN.test('hepb_vaccine_offered_on')).toBe(false);
  });
  it('the tables build on a fresh database', () => {
    const db = new Database(':memory:');
    for (const s of ASSESSMENT_TABLES) db.exec(s);
    expect(COLUMN_MIGRATIONS).toEqual([['staff', 'hepb_vaccine_offered_on', 'TEXT']]);
  });
});

describe('a question shows only where the law allows it', () => {
  const law = { '*': 'check_locally', US: 'after_offer', UK: 'not_allowed', NZ: 'allowed' };
  it('follows the studio country', () => {
    expect(questionVisible(law, 'NZ')).toBe(true);
    expect(questionVisible(law, 'UK')).toBe(false);
    expect(questionVisible(law, 'UK', true)).toBe(false);
    expect(questionVisible(law, 'US')).toBe(false);
    expect(questionVisible(law, 'US', true)).toBe(true);
    expect(questionVisible(law, 'TH')).toBe(false); // falls back to "*": check locally
  });
  it('an unknown country sees only questions safe everywhere', () => {
    expect(questionVisible(law, '')).toBe(false);
    expect(questionVisible({ '*': 'allowed' }, '')).toBe(true);
    expect(questionVisible({ '*': 'after_offer' }, '', true)).toBe(false);
    expect(questionVisible('{"*":"allowed"}', 'CA')).toBe(true);
  });
  it('anything unreadable never shows', () => {
    for (const bad of [null, undefined, 'not json', {}, { '*': 'maybe' }]) expect(questionVisible(bad, 'US', true)).toBe(false);
  });
});

describe('no work area if any must-pass fails', () => {
  const mp = (item, passed, extra = {}) => ({ step: 'conversation', item, must_pass: 1, passed, ...extra });
  const sc = (item, score) => ({ step: 'practical', item, must_pass: 0, score });
  it('passes when every must-pass passed and nothing scored 1', () => {
    const g = trialGate([mp('needlestick', 1), mp('will_refuse', 1), sc('setup', 3), sc('marking', 2)]);
    expect(g.ok).toBe(true);
    expect(g.goals).toEqual(['marking']);
  });
  it('a failed or not-done must-pass blocks the trial, whatever the scores', () => {
    expect(trialGate([mp('needlestick', 0), sc('setup', 4)])).toMatchObject({ ok: false, failing: ['needlestick'] });
    expect(trialGate([mp('needlestick', null), sc('setup', 4)]).ok).toBe(false);
  });
  it('a score of 1 blocks the trial', () => {
    expect(trialGate([mp('needlestick', 1), sc('setup', 1)])).toMatchObject({ ok: false, unsafe: ['setup'] });
  });
  it('nothing assessed is not a pass', () => {
    expect(trialGate([]).ok).toBe(false);
    expect(trialGate([sc('setup', 4)]).ok).toBe(false);
  });
  it('a must-pass set aside counts only with a written reason, and stays visible', () => {
    expect(trialGate([mp('studio_extra', 0, { waived_note: '  ' })]).ok).toBe(false);
    expect(trialGate([mp('studio_extra', 0, { waived_note: 'Not done in this studio' })])).toMatchObject({ ok: true, waived: ['studio_extra'] });
  });
  it('the latest answer counts, and trial checkpoints do not reopen the gate', () => {
    const rows = [mp('needlestick', 0, { on_date: '2026-11-01' }), mp('needlestick', 1, { on_date: '2026-11-03' }),
      { step: 'checkpoint', item: 'needlestick', must_pass: 1, passed: 0, on_date: '2026-12-01' }];
    expect(trialGate(rows).ok).toBe(true);
  });
});
