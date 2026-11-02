// New-artist assessment (vault: CRM-TEAM-AND-ASSESSMENT-ROADMAP.md, phase 1).
// The CRM RECORDS, it never DECIDES. It never stores a person's health status: no diagnosis, no test
// result, no vaccination answer. Hepatitis B vaccination is kept only as the date it was OFFERED
// (staff.hepb_vaccine_offered_on; Patrick 2026-11-03), because even "accepted/declined" is health data.

// Tables. Columns added later go in COLUMN_MIGRATIONS (CREATE TABLE IF NOT EXISTS will not add them).
export const ASSESSMENT_TABLES = [
  // A person being assessed; becomes a staff row (staff_id) when the trial starts.
  `CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    discipline TEXT DEFAULT 'piercer',      -- piercer | tattooist | both
    track TEXT DEFAULT 'apprenticeship',    -- realignment (experienced) | apprenticeship (student)
    person_type TEXT DEFAULT 'employee',    -- employee | booth_renter | guest | apprentice
    status TEXT DEFAULT 'assessing',        -- assessing | trial | accepted | extended | stopped | rejected
    trial_stage TEXT,                       -- observe | supervised | spot_checks
    trial_ends_on TEXT,
    staff_id INTEGER,
    delete_after TEXT,                      -- a rejected candidate's record: the owner is asked to delete it after this date
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  // One answer per item and step. A trial checkpoint fills the same items again on a new date.
  `CREATE TABLE IF NOT EXISTS assessment_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    step TEXT NOT NULL,                     -- paper | conversation | practical | checkpoint
    item TEXT NOT NULL,                     -- question_bank.id or a fixed item key
    must_pass INTEGER DEFAULT 0,
    passed INTEGER,                         -- must-pass items: 1 passed, 0 failed, null not done
    score INTEGER,                          -- scored items: 1 unsafe, 2 needs training, 3 studio standard, 4 could train others
    waived_note TEXT,                       -- an owner who sets a must-pass item aside says why, visibly
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
    source TEXT DEFAULT 'studio',           -- patrick | wiki | studio
    active INTEGER DEFAULT 1
  )`,
  // The studio's own technique rules per placement (ship empty: Patrick's defaults come later).
  `CREATE TABLE IF NOT EXISTS studio_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    placement TEXT NOT NULL UNIQUE,
    rule TEXT,
    updated_by TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
];
export const COLUMN_MIGRATIONS = [['staff', 'hepb_vaccine_offered_on', 'TEXT']];

export const LAW = ['allowed', 'after_offer', 'not_allowed', 'check_locally'];

// May this question be shown to a studio in `country` (ISO code, '' when not set)?
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

// The minimum to start a trial: every must-pass item passed (or set aside with a note), and no scored
// item at 1. Items scored 2 become the trial's training goals. Uses the latest answer per item.
export function trialGate(rows) {
  const latest = new Map();
  for (const r of rows || []) {
    if (r.step === 'checkpoint') continue;
    const prev = latest.get(r.item);
    if (!prev || String(r.on_date || r.created_at || '') >= String(prev.on_date || prev.created_at || '')) latest.set(r.item, r);
  }
  const items = [...latest.values()];
  const failing = items.filter((r) => r.must_pass && r.passed !== 1 && !(r.waived_note || '').trim()).map((r) => r.item);
  const unsafe = items.filter((r) => !r.must_pass && r.score === 1).map((r) => r.item);
  const goals = items.filter((r) => !r.must_pass && r.score === 2).map((r) => r.item);
  const waived = items.filter((r) => r.must_pass && r.passed !== 1 && (r.waived_note || '').trim()).map((r) => r.item);
  return { ok: failing.length === 0 && unsafe.length === 0 && items.some((r) => r.must_pass), failing, unsafe, goals, waived };
}

// Column names that would hold health status. The schema test fails if any table grows one.
export const HEALTH_COLUMN = /hiv|hepatit|hbv|hcv|bbv|viral|diagnos|infect|disease|serolog|antibod|immun|test_result|vaccin(?!e_offered_on$)|declin|medical_status|health/i;
