// New-artist assessment (vault: CRM-TEAM-AND-ASSESSMENT-ROADMAP.md, phase 1).
// The CRM RECORDS, it never DECIDES. It never stores a person's health status: no diagnosis, no test
// result, no vaccination answer. Hepatitis B vaccination is kept only as the date it was OFFERED
// (candidates.hepb_vaccine_offered_on; Patrick 2026-11-03), because even "accepted/declined" is health data.
// The candidate record stays linked to the team member (staff_id) after the trial, so the date stays too.

export const ASSESSMENT_TABLES = [
  // A person being assessed; a team member (staff_id) once the trial starts.
  `CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    discipline TEXT DEFAULT 'piercer',      -- piercer | tattooist | both
    track TEXT DEFAULT 'apprenticeship',    -- realignment (experienced) | apprenticeship (student)
    person_type TEXT DEFAULT 'employee',    -- employee | booth_renter | guest | apprentice
    status TEXT DEFAULT 'assessing',        -- assessing | trial | accepted | stopped | rejected
    trial_stage TEXT,                       -- observe | supervised | spot_checks
    next_checkpoint_on TEXT,
    trial_ends_on TEXT,
    hepb_vaccine_offered_on TEXT,           -- the date it was OFFERED, nothing else
    staff_id INTEGER,
    delete_after TEXT,                      -- a rejected candidate: the owner is asked to delete the record after this date
    decision_signed_by TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  // Every answer is kept; the latest per item counts. A trial checkpoint fills the items again on a new date.
  `CREATE TABLE IF NOT EXISTS assessment_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    step TEXT NOT NULL,                     -- paper | conversation | practical | checkpoint
    item TEXT NOT NULL,                     -- paper:x, q:<question id>, practical:x, rule:<placement>
    must_pass INTEGER DEFAULT 0,
    passed INTEGER,                         -- 1 yes, 0 no, null not done
    score INTEGER,                          -- 1 unsafe, 2 needs training, 3 studio standard, 4 could train others
    waived_note TEXT,                       -- a must-pass item set aside: the owner says why, visibly
    notes TEXT,
    signed_by TEXT,
    on_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  // The conversation guide. law: JSON {"*": status, "US": status, ...}; see questionVisible().
  `CREATE TABLE IF NOT EXISTS question_bank (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    good_answer TEXT,
    red_flags TEXT,
    must_pass INTEGER DEFAULT 0,
    discipline TEXT DEFAULT 'all',          -- all | piercer | tattooist
    wiki_slug TEXT,
    law TEXT DEFAULT '{"*":"allowed"}',
    source TEXT DEFAULT 'studio',           -- plan | patrick | studio
    active INTEGER DEFAULT 1
  )`,
  // The studio's own piercing technique rules per placement. Empty until the studio writes them.
  `CREATE TABLE IF NOT EXISTS studio_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    placement TEXT NOT NULL UNIQUE,
    rule TEXT,
    updated_by TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
];

export const LAW = ['allowed', 'after_offer', 'not_allowed', 'check_locally'];
export const COUNTRIES = ['US', 'GB', 'EU', 'CA', 'AU', 'NZ', 'TH'];

// May this question be shown to a studio in `country` ('' when not set or not one we researched)?
// Unknown country: only questions safe everywhere ("*": allowed). A country with no entry of its
// own follows "*". 'after_offer' shows only once a job offer was made; anything else never shows.
export function questionVisible(law, country, offerMade = false) {
  let map = law;
  if (typeof law === 'string') { try { map = JSON.parse(law); } catch (e) { return false; } }
  if (!map || typeof map !== 'object') return false;
  const status = country && map[country] ? map[country] : map['*'];
  if (!country && status !== 'allowed') return false;
  return status === 'allowed' || (status === 'after_offer' && offerMade === true);
}

// The minimum to start a trial: every must-pass item passed (or set aside with a written reason), and
// no scored item at 1. Items scored 2 become the trial's training goals. The latest answer per item counts.
export function trialGate(rows) {
  const latest = new Map();
  for (const r of rows || []) {
    if (r.step === 'checkpoint') continue;
    const prev = latest.get(r.item);
    const when = (x) => String(x.on_date || '') + '|' + String(x.created_at || '') + '|' + String(x.id || 0).padStart(9, '0');
    if (!prev || when(r) >= when(prev)) latest.set(r.item, r);
  }
  const items = [...latest.values()];
  const noted = (r) => !!String(r.waived_note || '').trim();
  const failing = items.filter((r) => r.must_pass && r.passed !== 1 && !noted(r)).map((r) => r.item);
  const unsafe = items.filter((r) => !r.must_pass && r.score === 1).map((r) => r.item);
  const goals = items.filter((r) => !r.must_pass && r.score === 2).map((r) => r.item);
  const waived = items.filter((r) => r.must_pass && r.passed !== 1 && noted(r)).map((r) => r.item);
  return { ok: failing.length === 0 && unsafe.length === 0 && items.some((r) => r.must_pass), failing, unsafe, goals, waived };
}

// Column names that would hold health status. The schema test fails if any table grows one.
export const HEALTH_COLUMN = /hiv|hepatit|hbv|hcv|bbv|viral|diagnos|infect|disease|serolog|antibod|immun|test_result|vaccin(?!e_offered_on$)|declin|medical|health/i;
// A question a studio writes must be about the WORK. Health is not asked (law table, 2026-11-02).
export const HEALTH_QUESTION = /\b(hiv|aids|hepatitis|hep ?[bc]|hbv|hcv|viral|virus|pregnan\w*|disab\w*|illness\w*|diagnos\w*|medication\w*|medicines?|sick\w*|disease\w*|infected|positive status)\b/i;

// The fixed items of steps 1 and 3. kind: tick (recorded, not a gate), must (gate), score (1-4).
export const PAPER = [
  ['portfolio', 'Healed work seen in the portfolio (photos at least a few weeks old, not only fresh ones)'],
  ['licence', 'Registration or licence recorded, where the law requires one'],
  ['bbp', 'Bloodborne pathogens training certificate, with its date'],
  ['first_aid', 'First-aid certificate, with its date'],
  ['reference', 'Last studio called: would they hire this person again?'],
  ['right_to_work', 'Right to work checked (local law)'],
].map(([key, label]) => ({ item: 'paper:' + key, label, kind: 'tick' }));
export const PRACTICAL = [
  ['barrier', 'Barrier film on everything that will be touched', 'must', 'all'],
  ['sharps', 'Sharps go straight into the sharps container', 'must', 'all'],
  ['gloves', 'Gloves changed at the right moments', 'must', 'all'],
  ['sterile', 'Nothing sterile touched with contaminated gloves', 'must', 'all'],
  ['setup', 'Station setup, from an empty table', 'score', 'all'],
  ['breakdown', 'Station breakdown and cleaning', 'score', 'all'],
  ['marking', 'Marking and jewellery selection on a model or volunteer (no piercing)', 'score', 'piercer'],
  ['stencil', 'Stencil and skin preparation on practice skin', 'score', 'tattooist'],
  ['lining', 'Lining and shading on practice skin', 'score', 'tattooist'],
].map(([key, label, kind, discipline]) => ({ item: 'practical:' + key, label, kind, discipline }));

// The first questions, from the agreed assessment plan (2026-10-31). Patrick's own questions are added
// when he sends them; "good answer" and "red flags" stay empty rather than invented.
const PLAN_QUESTIONS = [
  ['Station', 'Walk me through setting up your station, from an empty table.', '', 0, 'all', ''],
  ['Sterilisation', 'Walk me through your autoclave cycle and its indicators. What do you do if a spore test fails?', '', 0, 'all', 'autoclave-sterilization'],
  ['Exposure incident', 'You stick yourself with a used needle. What do you do in the first five minutes?', '', 1, 'all', 'bloodborne-pathogens'],
  ['Exposure incident', 'What do you do if YOU are injured or bleeding during a session?', '', 0, 'all', 'bloodborne-pathogens'],
  ['Cross-contamination', 'When do you change gloves? What do you do about the phone, the lamp and the bottles while you work?', '', 0, 'all', 'sharps-medical-waste'],
  ['Consent and refusal', 'Tell me about a client you refused, and why.', 'Has never refused anyone.', 1, 'all', ''],
  ['Jewellery', 'How do you choose and size the first jewellery, and which materials do you use?', '', 0, 'piercer', ''],
  ['Anatomy', 'Tell me about an anatomy that does not suit a piercing. What do you do?', '', 0, 'piercer', 'piercing-migration-rejection'],
  ['Inks', 'How do you record ink lots, and how do you prepare the skin and the stencil?', '', 0, 'tattooist', 'ink-toxicology-regulatory'],
  ['Aftercare', 'What do you tell a client about aftercare, and what do you do when a client comes back worried?', '', 0, 'all', 'infection-triage-microbiology'],
  ['When it goes wrong', 'Tell me about a complaint, a bad heal or a mistake of your own. What happened next?', '', 0, 'all', ''],
  ['Working here', 'How do you handle pricing, social media and boundaries with clients?', '', 0, 'all', ''],
];

const str = (v, max = 2000) => (v == null ? '' : String(v)).trim().slice(0, max);
const oneOf = (v, list, dflt) => (list.includes(v) ? v : dflt);
const dateOrNull = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : null);
const intIn = (v, lo, hi) => (Number.isInteger(Number(v)) && v !== '' && v !== null && Number(v) >= lo && Number(v) <= hi ? Number(v) : null);

const CANDIDATE_FIELDS = {
  name: (v) => str(v, 200),
  email: (v) => str(v, 200),
  phone: (v) => str(v, 60),
  discipline: (v) => oneOf(v, ['piercer', 'tattooist', 'both'], 'piercer'),
  track: (v) => oneOf(v, ['realignment', 'apprenticeship'], 'apprenticeship'),
  person_type: (v) => oneOf(v, ['employee', 'booth_renter', 'guest', 'apprentice'], 'employee'),
  trial_stage: (v) => oneOf(v, ['observe', 'supervised', 'spot_checks'], null),
  next_checkpoint_on: dateOrNull,
  trial_ends_on: dateOrNull,
  hepb_vaccine_offered_on: dateOrNull,
  delete_after: dateOrNull,
  notes: (v) => str(v, 5000),
};

// opts: staff() the team list, country() the studio's country code, log(entry) the activity log.
export function installAssessment(app, sqlite, opts = {}) {
  for (const s of ASSESSMENT_TABLES) sqlite.exec(s);
  const staff = opts.staff || (() => []);
  const country = () => { const c = String((opts.country && opts.country()) || '').toUpperCase(); return COUNTRIES.includes(c) ? c : ''; };
  const log = opts.log || (() => {});
  if (!sqlite.prepare('SELECT COUNT(*) n FROM question_bank').get().n) {
    const ins = sqlite.prepare("INSERT INTO question_bank (topic, question, red_flags, must_pass, discipline, wiki_slug, source) VALUES (?, ?, ?, ?, ?, ?, 'plan')");
    for (const q of PLAN_QUESTIONS) ins.run(q[0], q[1], q[2], q[3], q[4], q[5] || null);
  }

  const getCandidate = (id) => sqlite.prepare('SELECT * FROM candidates WHERE id = ?').get(Number(id));
  const itemsOf = (id) => sqlite.prepare('SELECT * FROM assessment_items WHERE candidate_id = ? ORDER BY id').all(Number(id));
  const fits = (discipline, c) => discipline === 'all' || c.discipline === 'both' || discipline === c.discipline;
  const offerMade = (c) => ['trial', 'accepted'].includes(c.status);
  const rules = () => sqlite.prepare("SELECT * FROM studio_rules WHERE TRIM(COALESCE(rule, '')) <> '' ORDER BY placement").all();
  // every item this candidate is assessed on, with its kind; the server decides what is must-pass
  const itemsFor = (c) => {
    const qs = sqlite.prepare('SELECT * FROM question_bank WHERE active = 1 ORDER BY id').all()
      .filter((q) => fits(q.discipline, c) && questionVisible(q.law, country(), offerMade(c)));
    return [
      ...PAPER.map((p) => ({ ...p, step: 'paper' })),
      ...qs.map((q) => ({ item: 'q:' + q.id, step: 'conversation', kind: q.must_pass ? 'must' : 'score', label: q.question, topic: q.topic,
        good_answer: q.good_answer || '', red_flags: q.red_flags || '', wiki_slug: q.wiki_slug || '' })),
      ...PRACTICAL.filter((p) => fits(p.discipline, c)).map((p) => ({ ...p, step: 'practical' })),
      ...(c.discipline === 'tattooist' ? [] : rules().map((r) => ({ item: 'rule:' + r.placement, step: 'practical', kind: 'score',
        label: 'Follows the studio rule: ' + r.placement, rule: r.rule }))),
    ];
  };
  const full = (c) => {
    const items = itemsOf(c.id);
    return { candidate: c, items, plan: itemsFor(c), gate: trialGate(items), country: country() };
  };

  app.get('/api/assessment/candidates', (req, res) => {
    res.json(sqlite.prepare('SELECT * FROM candidates ORDER BY id DESC').all().map((c) => ({ ...c, gate: trialGate(itemsOf(c.id)) })));
  });
  app.get('/api/assessment/candidates/:id', (req, res) => {
    const c = getCandidate(req.params.id);
    if (!c) return res.status(404).json({ error: 'No such candidate' });
    res.json(full(c));
  });
  app.post('/api/assessment/candidates', (req, res) => {
    const v = {};
    for (const [k, clean] of Object.entries(CANDIDATE_FIELDS)) v[k] = clean(req.body[k]);
    if (!v.name) return res.status(400).json({ error: 'A name is required' });
    const keys = ['name', 'email', 'phone', 'discipline', 'track', 'person_type', 'notes'];
    const id = sqlite.prepare(`INSERT INTO candidates (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).run(...keys.map((k) => v[k])).lastInsertRowid;
    log({ category: 'staff', action: 'CANDIDATE_ADDED', title: 'New candidate: ' + v.name, details: 'Assessment started' });
    res.status(201).json(full(getCandidate(id)));
  });
  app.patch('/api/assessment/candidates/:id', (req, res) => {
    const c = getCandidate(req.params.id);
    if (!c) return res.status(404).json({ error: 'No such candidate' });
    const keys = Object.keys(CANDIDATE_FIELDS).filter((k) => k in (req.body || {}));
    if (keys.includes('name') && !CANDIDATE_FIELDS.name(req.body.name)) return res.status(400).json({ error: 'A name is required' });
    if (keys.length) sqlite.prepare(`UPDATE candidates SET ${keys.map((k) => k + ' = ?').join(', ')} WHERE id = ?`).run(...keys.map((k) => CANDIDATE_FIELDS[k](req.body[k])), c.id);
    res.json(full(getCandidate(c.id)));
  });
  app.delete('/api/assessment/candidates/:id', (req, res) => {
    const c = getCandidate(req.params.id);
    if (!c) return res.status(404).json({ error: 'No such candidate' });
    sqlite.prepare('DELETE FROM assessment_items WHERE candidate_id = ?').run(c.id);
    sqlite.prepare('DELETE FROM candidates WHERE id = ?').run(c.id);
    res.json({ ok: true });
  });

  // One answer. The server looks the item up, so must-pass cannot be switched off from the page.
  app.post('/api/assessment/candidates/:id/items', (req, res) => {
    const c = getCandidate(req.params.id);
    if (!c) return res.status(404).json({ error: 'No such candidate' });
    const b = req.body || {};
    const def = itemsFor(c).find((p) => p.item === b.item);
    if (!def) return res.status(400).json({ error: 'Not an item of this assessment' });
    const step = b.step === 'checkpoint' ? 'checkpoint' : def.step;
    if (step === 'checkpoint' && c.status !== 'trial') return res.status(400).json({ error: 'Checkpoints are for a trial' });
    const passed = b.passed === true || b.passed === 1 ? 1 : b.passed === false || b.passed === 0 ? 0 : null;
    const score = def.kind === 'score' ? intIn(b.score, 1, 4) : null;
    const waived = def.kind === 'must' ? str(b.waived_note, 500) : '';
    sqlite.prepare('INSERT INTO assessment_items (candidate_id, step, item, must_pass, passed, score, waived_note, notes, signed_by, on_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(c.id, step, def.item, def.kind === 'must' ? 1 : 0, def.kind === 'score' ? null : passed, score, waived || null, str(b.notes, 5000) || null,
        str(b.signed_by, 200) || null, dateOrNull(b.on_date) || new Date().toISOString().slice(0, 10));
    res.status(201).json(full(getCandidate(c.id)));
  });

  // "Start trial": refused unless the gate passes; the candidate joins the team list at the observe stage.
  app.post('/api/assessment/candidates/:id/start-trial', (req, res) => {
    const c = getCandidate(req.params.id);
    if (!c) return res.status(404).json({ error: 'No such candidate' });
    if (c.status !== 'assessing') return res.status(400).json({ error: 'The trial has already started' });
    // must-pass items never answered count as not passed
    const rows = itemsOf(c.id);
    const answered = new Set(rows.map((r) => r.item));
    const missing = itemsFor(c).filter((p) => p.kind === 'must' && !answered.has(p.item)).map((p) => ({ step: p.step, item: p.item, must_pass: 1, passed: null }));
    const gate = trialGate([...rows, ...missing]);
    if (!gate.ok) return res.status(409).json({ error: 'The minimum standard is not met', gate });
    const team = staff();
    const member = { id: team.length ? Math.max(...team.map((s) => Number(s.id) || 0)) + 1 : 1, name: c.name, email: c.email || '', phone: c.phone || '',
      role: 'artist', title: 'Trial', specialties: [], bio: '', notes: '', certifications: [], active: true, created_at: new Date().toISOString() };
    team.push(member);
    sqlite.prepare("UPDATE candidates SET status = 'trial', trial_stage = 'observe', staff_id = ?, trial_ends_on = COALESCE(?, trial_ends_on), next_checkpoint_on = COALESCE(?, next_checkpoint_on) WHERE id = ?")
      .run(member.id, dateOrNull(req.body && req.body.trial_ends_on), dateOrNull(req.body && req.body.next_checkpoint_on), c.id);
    log({ category: 'staff', action: 'TRIAL_STARTED', title: 'Trial started: ' + c.name, details: 'Observe stage' });
    res.json(full(getCandidate(c.id)));
  });

  // The end of the assessment or the trial: accept, stop, or reject (before a trial). Signed by name.
  app.post('/api/assessment/candidates/:id/decision', (req, res) => {
    const c = getCandidate(req.params.id);
    if (!c) return res.status(404).json({ error: 'No such candidate' });
    const d = req.body && req.body.decision;
    const signed = str(req.body && req.body.signed_by, 200);
    if (!signed) return res.status(400).json({ error: 'Who signs the decision?' });
    const allowed = c.status === 'trial' ? ['accepted', 'stopped'] : c.status === 'assessing' ? ['rejected'] : [];
    if (!allowed.includes(d)) return res.status(400).json({ error: 'That decision is not possible now' });
    sqlite.prepare('UPDATE candidates SET status = ?, decision_signed_by = ?, delete_after = COALESCE(?, delete_after) WHERE id = ?').run(d, signed, dateOrNull(req.body.delete_after), c.id);
    const member = c.staff_id && staff().find((s) => Number(s.id) === Number(c.staff_id));
    if (member && d === 'accepted' && member.title === 'Trial') member.title = '';
    if (member && d === 'stopped') member.active = false;
    log({ category: 'staff', action: 'CANDIDATE_' + d.toUpperCase(), title: c.name + ': ' + d, details: 'Signed by ' + signed });
    res.json(full(getCandidate(c.id)));
  });

  // Trial checkpoints and ends, for the calendar.
  app.get('/api/assessment/trials', (req, res) => {
    res.json(sqlite.prepare("SELECT id, name, trial_stage, next_checkpoint_on, trial_ends_on, staff_id FROM candidates WHERE status = 'trial' ORDER BY COALESCE(next_checkpoint_on, trial_ends_on, '9999')").all());
  });

  // The question bank: the studio can add its own questions (about the work only) and switch any off.
  app.get('/api/assessment/questions', (req, res) => res.json({ country: country(), questions: sqlite.prepare('SELECT * FROM question_bank ORDER BY id').all() }));
  app.post('/api/assessment/questions', (req, res) => {
    const b = req.body || {};
    const q = { topic: str(b.topic, 100), question: str(b.question, 1000), good_answer: str(b.good_answer, 2000), red_flags: str(b.red_flags, 2000) };
    if (!q.topic || !q.question) return res.status(400).json({ error: 'A topic and a question are required' });
    if (HEALTH_QUESTION.test([q.question, q.good_answer, q.red_flags].join(' '))) return res.status(400).json({ error: 'Ask about the work, never about health. See the guide.' });
    const id = sqlite.prepare("INSERT INTO question_bank (topic, question, good_answer, red_flags, must_pass, discipline, source) VALUES (?, ?, ?, ?, ?, ?, 'studio')")
      .run(q.topic, q.question, q.good_answer, q.red_flags, b.must_pass ? 1 : 0, oneOf(b.discipline, ['all', 'piercer', 'tattooist'], 'all')).lastInsertRowid;
    res.status(201).json(sqlite.prepare('SELECT * FROM question_bank WHERE id = ?').get(id));
  });
  app.patch('/api/assessment/questions/:id', (req, res) => {
    const q = sqlite.prepare('SELECT * FROM question_bank WHERE id = ?').get(Number(req.params.id));
    if (!q) return res.status(404).json({ error: 'No such question' });
    sqlite.prepare('UPDATE question_bank SET active = ? WHERE id = ?').run(req.body && req.body.active ? 1 : 0, q.id);
    res.json(sqlite.prepare('SELECT * FROM question_bank WHERE id = ?').get(q.id));
  });

  // Studio rules per placement. An empty rule removes it.
  app.get('/api/assessment/rules', (req, res) => res.json(rules()));
  app.put('/api/assessment/rules', (req, res) => {
    const placement = str(req.body && req.body.placement, 100);
    if (!placement) return res.status(400).json({ error: 'Which placement?' });
    const rule = str(req.body.rule, 3000);
    if (!rule) sqlite.prepare('DELETE FROM studio_rules WHERE placement = ?').run(placement);
    else sqlite.prepare('INSERT INTO studio_rules (placement, rule, updated_by, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(placement) DO UPDATE SET rule = excluded.rule, updated_by = excluded.updated_by, updated_at = excluded.updated_at')
      .run(placement, rule, str(req.body.updated_by, 200) || null, new Date().toISOString());
    res.json(rules());
  });
}
