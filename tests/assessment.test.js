import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import express from 'express';
import { HEALTH_COLUMN, HEALTH_QUESTION, PRACTICAL, installAssessment, questionVisible, trialGate } from '../src/assessment.js';
import { needLevel } from '../src/access.js';

// A studio on a throwaway database, as server.js installs it.
let base, server, sqlite, country = '';
const team = [{ id: 1, name: 'Owner', role: 'manager' }];
beforeAll(async () => {
  sqlite = new Database(':memory:');
  const app = express();
  app.use(express.json());
  installAssessment(app, sqlite, { staff: () => team, country: () => country });
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}/api/assessment`;
});
afterAll(() => server && server.close());
const call = async (method, path, body) => {
  const res = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, body: await res.json() };
};

describe('no health status anywhere in the assessment', () => {
  it('no column could hold a diagnosis, a test result or a vaccination answer', () => {
    const cols = ['candidates', 'assessment_items', 'question_bank', 'studio_rules']
      .flatMap((t) => sqlite.prepare(`PRAGMA table_info(${t})`).all().map((c) => `${t}.${c.name}`));
    expect(cols).toContain('candidates.hepb_vaccine_offered_on');
    expect(cols.filter((c) => HEALTH_COLUMN.test(c.split('.')[1]))).toEqual([]);
  });
  it('the guard itself catches the obvious ones', () => {
    for (const bad of ['hiv_status', 'hepatitis_b', 'hbv_result', 'viral_load', 'diagnosis', 'vaccine_declined', 'vaccinated', 'test_result', 'health_notes', 'medical'])
      expect(HEALTH_COLUMN.test(bad), bad).toBe(true);
    expect(HEALTH_COLUMN.test('hepb_vaccine_offered_on')).toBe(false);
  });
  it('a studio cannot add a question about health; a question about the work is fine', async () => {
    for (const q of ['Are you HIV positive?', 'Do you have hepatitis B?', 'Any illness we should know about?', 'Are you pregnant?', 'What medication do you take?'])
      expect((await call('POST', '/questions', { topic: 'x', question: q })).status, q).toBe(400);
    expect(HEALTH_QUESTION.test('What do you do if YOU are injured or bleeding during a session?')).toBe(false);
    expect((await call('POST', '/questions', { topic: 'Station', question: 'Show me how you open a sterile pouch.' })).status).toBe(201);
  });
  it('only an administrator reaches the assessment', () => {
    expect(needLevel('GET', '/api/assessment/candidates')).toBe('admin');
    expect(needLevel('POST', '/api/assessment/candidates/1/items')).toBe('admin');
  });
});

describe('a question shows only where the law allows it', () => {
  const law = { '*': 'check_locally', US: 'after_offer', GB: 'not_allowed', NZ: 'allowed' };
  it('follows the studio country', () => {
    expect(questionVisible(law, 'NZ')).toBe(true);
    expect(questionVisible(law, 'GB')).toBe(false);
    expect(questionVisible(law, 'GB', true)).toBe(false);
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
  it('a question not allowed in the studio country never reaches the screen', async () => {
    sqlite.prepare(`INSERT INTO question_bank (topic, question, law) VALUES ('Fitness', 'Self-declaration', '{"*":"check_locally","NZ":"allowed"}')`).run();
    const id = (await call('POST', '/candidates', { name: 'Law test', discipline: 'both' })).body.candidate.id;
    const shown = async () => (await call('GET', '/candidates/' + id)).body.plan.some((p) => p.label === 'Self-declaration');
    country = '';   expect(await shown()).toBe(false);
    country = 'GB'; expect(await shown()).toBe(false);
    country = 'NZ'; expect(await shown()).toBe(true);
    country = '';
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
  it('a score of 1 blocks the trial; nothing assessed is not a pass', () => {
    expect(trialGate([mp('needlestick', 1), sc('setup', 1)])).toMatchObject({ ok: false, unsafe: ['setup'] });
    expect(trialGate([]).ok).toBe(false);
  });
  it('a must-pass set aside counts only with a written reason, and stays visible', () => {
    expect(trialGate([mp('extra', 0, { waived_note: '  ' })]).ok).toBe(false);
    expect(trialGate([mp('extra', 0, { waived_note: 'Not done in this studio' })])).toMatchObject({ ok: true, waived: ['extra'] });
  });
  it('the latest answer counts, and trial checkpoints do not reopen the gate', () => {
    const rows = [mp('n', 0, { on_date: '2026-11-01' }), mp('n', 1, { on_date: '2026-11-03' }), { step: 'checkpoint', item: 'n', must_pass: 1, passed: 0, on_date: '2026-12-01' }];
    expect(trialGate(rows).ok).toBe(true);
  });

  it('end to end: refused until every must-pass passes, then the candidate joins the team on trial', async () => {
    const created = await call('POST', '/candidates', { name: 'Sam Example', discipline: 'piercer', track: 'realignment' });
    expect(created.status).toBe(201);
    const id = created.body.candidate.id;
    const plan = created.body.plan;
    const must = plan.filter((p) => p.kind === 'must');
    expect(must.map((p) => p.item)).toEqual(expect.arrayContaining(PRACTICAL.filter((p) => p.kind === 'must').map((p) => p.item)));
    expect(plan.some((p) => p.item === 'practical:stencil')).toBe(false); // a tattooist item, not for a piercer
    // the page cannot switch must-pass off: the server decides it
    await call('POST', `/candidates/${id}/items`, { item: must[0].item, passed: 0, must_pass: 0 });
    expect((await call('POST', `/candidates/${id}/start-trial`, {})).status).toBe(409);
    for (const p of must) await call('POST', `/candidates/${id}/items`, { item: p.item, passed: 1 });
    const setup = await call('POST', `/candidates/${id}/items`, { item: 'practical:setup', score: 1 });
    expect(setup.body.gate.unsafe).toEqual(['practical:setup']);
    expect((await call('POST', `/candidates/${id}/start-trial`, {})).status).toBe(409);
    await call('POST', `/candidates/${id}/items`, { item: 'practical:setup', score: 2 });
    expect((await call('POST', `/candidates/${id}/items`, { item: 'not:an-item', passed: 1 })).status).toBe(400);
    const started = await call('POST', `/candidates/${id}/start-trial`, { trial_ends_on: '2027-02-01' });
    expect(started.status).toBe(200);
    expect(started.body.candidate).toMatchObject({ status: 'trial', trial_stage: 'observe', trial_ends_on: '2027-02-01' });
    expect(team.find((s) => s.id === started.body.candidate.staff_id)).toMatchObject({ name: 'Sam Example', title: 'Trial' });
    // only the date the vaccine was offered: anything else is not a field
    const hep = await call('PATCH', `/candidates/${id}`, { hepb_vaccine_offered_on: '2026-11-04', hepb_vaccinated: 'yes', health: 'x' });
    expect(hep.body.candidate.hepb_vaccine_offered_on).toBe('2026-11-04');
    expect(Object.keys(hep.body.candidate).filter((k) => HEALTH_COLUMN.test(k))).toEqual([]);
    expect((await call('POST', `/candidates/${id}/decision`, { decision: 'accepted' })).status).toBe(400); // unsigned
    const done = await call('POST', `/candidates/${id}/decision`, { decision: 'accepted', signed_by: 'Owner' });
    expect(done.body.candidate).toMatchObject({ status: 'accepted', decision_signed_by: 'Owner' });
    expect(team.find((s) => s.id === done.body.candidate.staff_id).title).toBe('');
  });
});
