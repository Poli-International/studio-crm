// =========================================================================
// NEW ARTISTS: assessment, scorecard and trial (Settings, New artists). Server: src/assessment.js
// =========================================================================
// The CRM records, the owner decides. No health question and no health answer is ever kept: the only
// vaccination record is the date hepatitis B vaccination was OFFERED.
(function () {
    const E = (v) => (v === null || v === undefined ? '' : String(v)).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
    const T = (en) => (window.i18nPhrases && window.i18nPhrases.translate(en)) || en;
    const toast = (m) => (window.showStudioToast ? window.showStudioToast(m) : console.log(m));
    const WIKI = 'https://poliinternational.com/wiki/';
    const SCORE = { 1: 'Unsafe', 2: 'Needs training', 3: 'Studio standard', 4: 'Could train others' };
    const STEPS = [['paper', '1. Paper check'], ['conversation', '2. Conversation'], ['practical', '3. Practical test'], ['scorecard', '4. Scorecard'], ['trial', '5. Trial']];
    const LABELS = {
        piercer: 'Piercer', tattooist: 'Tattooist', both: 'Piercer and tattooist',
        realignment: 'Experienced: re-alignment to the studio rules', apprenticeship: 'Student: apprenticeship',
        employee: 'Employee', booth_renter: 'Booth renter', guest: 'Guest artist', apprentice: 'Apprentice',
        assessing: 'Being assessed', trial: 'On trial', accepted: 'Accepted', stopped: 'Trial stopped', rejected: 'Not taken on',
        observe: 'Observe only (no clients booked)', supervised: 'Supervised: a named supervisor signs each session', spot_checks: 'Independent with spot checks',
    };
    const COUNTRY_NAMES = { US: 'United States', GB: 'United Kingdom', EU: 'European Union country', CA: 'Canada', AU: 'Australia', NZ: 'New Zealand', TH: 'Thailand' };
    const btn = 'padding:0.4rem 0.8rem;border-radius:7px;font-weight:700;font-size:0.8rem;cursor:pointer;border:1px solid var(--ti-line, #334155);background:var(--ti-panel2, #1E293B);color:var(--ti-text, #F8FAFC);';
    const btnMain = 'padding:0.45rem 0.9rem;border-radius:7px;font-weight:800;font-size:0.82rem;cursor:pointer;border:none;background:var(--ti-purple, #7C3AED);color:#FFF;';
    const on = 'background:var(--ti-purple, #7C3AED);color:#FFF;border-color:var(--ti-purple, #7C3AED);';
    const field = 'padding:8px 10px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:8px;color:var(--ti-text, #F8FAFC);font-size:0.85rem;box-sizing:border-box;';
    const card = 'background:var(--ti-bg2, #0F172A);border:1px solid var(--ti-panel2, #1E293B);border-radius:10px;padding:0.85rem;';
    const muted = 'font-size:0.78rem;color:var(--ti-muted, #94A3B8);';
    const NOT_ADVICE = 'Not legal or HR advice: employment, licensing and anti-discrimination law differ by country. Check your local rules.';
    let view = { name: 'list' };
    let data = null;

    async function api(method, url, body) {
        const res = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) { const err = new Error(json.error || ('HTTP ' + res.status)); err.body = json; throw err; }
        return json;
    }
    const body = () => document.getElementById('assessment-modal-body');
    const me = () => { try { return (JSON.parse(localStorage.getItem('studio_active_staff') || 'null') || {}).name || ''; } catch (e) { return ''; } };
    const today = () => new Date().toLocaleDateString('en-CA'); // the studio's own date, YYYY-MM-DD

    function latest(items, item, step) {
        let r = null;
        for (const x of items) if (x.item === item && (step === 'checkpoint' ? x.step === 'checkpoint' : x.step !== 'checkpoint')) r = x;
        return r;
    }

    // ---- views ----------------------------------------------------------------------------------
    async function show(v) {
        view = v || view;
        const el = body();
        if (!el) return;
        try {
            if (view.name === 'list') return renderList(el, await api('GET', '/api/assessment/candidates'));
            if (view.name === 'new') return renderNew(el);
            if (view.name === 'rules') return renderRules(el, await api('GET', '/api/assessment/rules'));
            if (view.name === 'questions') return renderQuestions(el, await api('GET', '/api/assessment/questions'));
            data = await api('GET', '/api/assessment/candidates/' + view.id);
            renderCandidate(el);
        } catch (e) {
            el.innerHTML = '<div style="padding:20px;color:var(--ti-alert-ink, #FCA5A5);">' + E(T('Could not load: ') + e.message) + '</div>';
        }
    }

    function topBar(extra) {
        return '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'
            + (view.name !== 'list' ? '<button type="button" data-act="go-list" style="' + btn + '">' + E(T('Back to the list')) + '</button>' : '')
            + (extra || '') + '</div>';
    }

    function renderList(el, list) {
        el.innerHTML = topBar('<button type="button" data-act="go-new" style="' + btnMain + '">' + E(T('+ New candidate')) + '</button>'
                + '<button type="button" data-act="go-rules" style="' + btn + '">' + E(T('Studio rules')) + '</button>'
                + '<button type="button" data-act="go-questions" style="' + btn + '">' + E(T('Questions')) + '</button>')
            + '<p style="' + muted + 'margin:0;">' + E(T('Art skill gets someone an interview. Hygiene gets them a work area: one failed must-pass item means no trial, whatever the portfolio.')) + '</p>'
            + (list.length ? '<table id="assessment-candidates-table" style="width:100%;border-collapse:collapse;font-size:0.84rem;text-align:left;"><thead><tr style="' + muted + '">'
                + ['Name', 'Works as', 'Status', 'Minimum standard', ''].map((h) => '<th style="padding:6px;">' + E(h ? T(h) : '') + '</th>').join('') + '</tr></thead><tbody>'
                + list.map((c) => '<tr style="border-top:1px solid var(--ti-line, #334155);"><td style="padding:8px 6px;font-weight:700;">' + E(c.name) + '</td>'
                    + '<td style="padding:6px;">' + E(T(LABELS[c.discipline] || c.discipline)) + '</td>'
                    + '<td style="padding:6px;">' + E(T(LABELS[c.status] || c.status)) + '</td>'
                    + '<td style="padding:6px;">' + (c.status !== 'assessing' ? '' : c.gate.ok ? '<span style="color:var(--ti-green, #34D399);font-weight:700;">' + E(T('Met')) + '</span>' : E(T('Not met yet'))) + '</td>'
                    + '<td style="padding:6px;text-align:right;"><button type="button" data-act="open" data-id="' + Number(c.id) + '" style="' + btn + '">' + E(T('Open')) + '</button></td></tr>').join('')
                + '</tbody></table>'
                : '<div style="' + card + 'text-align:center;' + muted + '">' + E(T('No candidate yet. Add the first one before giving anyone a work area.')) + '</div>')
            + '<p style="' + muted + 'margin:0;">' + E(T(NOT_ADVICE)) + '</p>';
    }

    function select(id, value, options) {
        return '<select id="' + id + '" style="' + field + '">' + options.map((o) => '<option value="' + E(o) + '"' + (o === value ? ' selected' : '') + '>' + E(T(LABELS[o] || o)) + '</option>').join('') + '</select>';
    }
    function labelled(text, inner) { return '<label style="display:flex;flex-direction:column;gap:4px;' + muted + '">' + E(T(text)) + inner + '</label>'; }

    function renderNew(el) {
        el.innerHTML = topBar() + '<form id="assessment-new-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">'
            + labelled('Name', '<input id="cand-name" required style="' + field + '">')
            + labelled('Email', '<input id="cand-email" type="email" style="' + field + '">')
            + labelled('Phone', '<input id="cand-phone" type="tel" style="' + field + '">')
            + labelled('Works as', select('cand-discipline', 'piercer', ['piercer', 'tattooist', 'both']))
            + labelled('Track', select('cand-track', 'apprenticeship', ['realignment', 'apprenticeship']))
            + labelled('Would work as', select('cand-type', 'employee', ['employee', 'booth_renter', 'guest', 'apprentice']))
            + '<div style="grid-column:1/-1;' + muted + '">' + E(T('Re-alignment: an experienced artist is shown the studio rules first, and the practical test checks they FOLLOW them. A red flag: "I have always done it this way" on a hygiene or technique point.')) + '</div>'
            + '<div style="grid-column:1/-1;"><button type="submit" style="' + btnMain + '">' + E(T('Start the assessment')) + '</button></div></form>';
    }

    function renderCandidate(el) {
        const c = data.candidate;
        const step = view.step || (c.status === 'assessing' ? 'paper' : 'trial');
        view.step = step;
        el.innerHTML = topBar('<button type="button" data-act="pdf" style="' + btn + '">' + E(T('PDF')) + '</button>'
                + '<button type="button" data-act="delete" style="' + btn + 'color:var(--ti-alert-ink, #FCA5A5);">' + E(T('Delete record')) + '</button>')
            + '<div style="' + card + 'display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">'
            + labelled('Name', '<input id="cand-name" value="' + E(c.name) + '" style="' + field + '">')
            + labelled('Works as', select('cand-discipline', c.discipline, ['piercer', 'tattooist', 'both']))
            + labelled('Track', select('cand-track', c.track, ['realignment', 'apprenticeship']))
            + labelled('Would work as', select('cand-type', c.person_type, ['employee', 'booth_renter', 'guest', 'apprentice']))
            + labelled('Notes', '<input id="cand-notes" value="' + E(c.notes) + '" style="' + field + '">')
            + '<div style="display:flex;align-items:flex-end;gap:8px;"><button type="button" data-act="save-details" style="' + btn + '">' + E(T('Save details')) + '</button>'
            + '<span style="' + muted + '">' + E(T(LABELS[c.status] || c.status)) + '</span></div></div>'
            + '<div role="tablist" style="display:flex;gap:6px;flex-wrap:wrap;">' + STEPS.map(([k, l]) => '<button type="button" role="tab" aria-selected="' + (k === step) + '" data-act="step" data-step="' + k + '" style="' + btn + (k === step ? on : '') + '">' + E(T(l)) + '</button>').join('') + '</div>'
            + '<div id="assessment-step">' + stepHtml(step) + '</div>';
    }

    function itemRow(p, step) {
        const r = latest(data.items, p.item, step);
        const done = step === 'checkpoint' ? false : data.candidate.status !== 'assessing';
        const id = E(p.item);
        let controls = '';
        if (p.kind === 'score') {
            controls = [1, 2, 3, 4].map((n) => '<button type="button" data-act="score" data-item="' + id + '" data-score="' + n + '" data-stepkind="' + step + '" title="' + E(T(SCORE[n])) + '" aria-label="' + E(n + ': ' + T(SCORE[n])) + '"' + (done ? ' disabled' : '') + ' style="' + btn + (r && r.score === n ? on : '') + 'min-width:2.2rem;">' + n + '</button>').join('');
        } else {
            controls = [[1, p.kind === 'must' ? 'Pass' : 'Yes'], [0, p.kind === 'must' ? 'Fail' : 'No']].map(([v, l]) => '<button type="button" data-act="pass" data-item="' + id + '" data-passed="' + v + '" data-stepkind="' + step + '"' + (done ? ' disabled' : '') + ' style="' + btn + (r && r.passed === v ? on : '') + '">' + E(T(l)) + '</button>').join('');
        }
        const extra = (p.good_answer ? '<div style="' + muted + '"><strong>' + E(T('A good answer covers:')) + '</strong> ' + E(p.good_answer) + '</div>' : '')
            + (p.red_flags ? '<div style="font-size:0.78rem;color:var(--ti-alert-ink, #FCA5A5);"><strong>' + E(T('Red flags:')) + '</strong> ' + E(p.red_flags) + '</div>' : '')
            + (p.rule ? '<div style="' + muted + '"><strong>' + E(T('Studio rule:')) + '</strong> ' + E(p.rule) + '</div>' : '')
            + (p.wiki_slug ? '<a href="' + WIKI + encodeURIComponent(p.wiki_slug) + '/" target="_blank" rel="noopener" style="font-size:0.78rem;color:var(--ti-blue, #38BDF8);">' + E(T('Check the answer on our wiki')) + '</a>' : '');
        const waived = r && r.waived_note ? '<div style="font-size:0.78rem;color:var(--ti-gold, #FBBF24);">' + E(T('Set aside by the owner:')) + ' ' + E(r.waived_note) + '</div>' : '';
        return '<div class="assessment-item" style="' + card + 'display:flex;flex-direction:column;gap:6px;">'
            + '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;"><div style="font-weight:700;font-size:0.88rem;">'
            + (p.kind === 'must' ? '<span style="color:var(--ti-alert-ink, #FCA5A5);font-size:0.72rem;font-weight:900;margin-right:6px;">' + E(T('MUST PASS')) + '</span>' : '')
            + (p.topic ? '<span style="' + muted + 'margin-right:6px;">' + E(T(p.topic)) + '</span>' : '') + E(T(p.label)) + '</div>'
            + '<div style="display:flex;gap:4px;flex-wrap:wrap;">' + controls + '</div></div>' + extra + waived
            + '<input data-notes-for="' + id + '" value="' + E(r && r.notes) + '" placeholder="' + E(T('Notes')) + '" aria-label="' + E(T('Notes')) + '"' + (done ? ' disabled' : '') + ' style="' + field + '">'
            + (p.kind === 'must' && !done && step !== 'checkpoint' ? '<details><summary style="' + muted + 'cursor:pointer;">' + E(T('Set this item aside (the reason stays on the record)')) + '</summary>'
                + '<div style="display:flex;gap:6px;margin-top:6px;"><input data-waive-for="' + id + '" placeholder="' + E(T('Why it does not apply in this studio')) + '" style="' + field + 'flex:1;">'
                + '<button type="button" data-act="waive" data-item="' + id + '" style="' + btn + '">' + E(T('Set aside')) + '</button></div></details>' : '')
            + '</div>';
    }

    function stepHtml(step) {
        const c = data.candidate;
        const plan = data.plan;
        const col = (items) => '<div style="display:flex;flex-direction:column;gap:8px;">' + items + '</div>';
        if (step === 'paper') return col('<p style="' + muted + 'margin:0;">' + E(T('Before meeting. The CRM records; you check your local law.')) + '</p>' + plan.filter((p) => p.step === 'paper').map((p) => itemRow(p, 'paper')).join(''));
        if (step === 'conversation') {
            const qs = plan.filter((p) => p.step === 'conversation');
            return col('<p style="' + muted + 'margin:0;">' + E(T('Ask about the WORK only. Never ask about health, age, religion, pregnancy or family plans.')) + ' '
                + E(data.country ? T('Questions shown for: ') + T(COUNTRY_NAMES[data.country]) : T('Set the studio country (Settings, Studio details) to see the questions checked for your country. Until then only the questions safe everywhere show.')) + '</p>'
                + (qs.length ? qs.map((p) => itemRow(p, 'conversation')).join('') : '<div style="' + card + muted + '">' + E(T('No question is switched on. Add your own in Questions.')) + '</div>'));
        }
        if (step === 'practical') return col('<p style="' + muted + 'margin:0;">' + E(T('Observed on an empty station, no client. Score 1 unsafe, 2 needs training, 3 studio standard, 4 could train others.')) + '</p>'
            + plan.filter((p) => p.step === 'practical').map((p) => itemRow(p, 'practical')).join('')
            + (c.discipline !== 'tattooist' && !plan.some((p) => p.item.startsWith('rule:')) ? '<div style="' + card + muted + '">' + E(T('Your studio has no piercing rules yet. Write them in Studio rules and the test will score each one.')) + '</div>' : ''));
        if (step === 'scorecard') return scorecardHtml();
        return trialHtml();
    }

    const labelOf = (item) => { const p = data.plan.find((x) => x.item === item); return p ? T(p.label) : item; };

    function scorecardHtml() {
        const c = data.candidate;
        const must = data.plan.filter((p) => p.kind === 'must');
        const notDone = must.filter((p) => !latest(data.items, p.item));
        const g = data.gate;
        const failing = [...new Set([...g.failing, ...notDone.map((p) => p.item)])];
        const ok = failing.length === 0 && g.unsafe.length === 0 && must.length > 0;
        const list = (title, items, color) => items.length ? '<div><strong style="color:' + color + ';">' + E(T(title)) + '</strong><ul style="margin:4px 0 0 18px;padding:0;">' + items.map((i) => '<li>' + E(labelOf(i)) + '</li>').join('') + '</ul></div>' : '';
        const signRow = '<input id="sign-name" value="' + E(me()) + '" placeholder="' + E(T('Signed by')) + '" aria-label="' + E(T('Signed by')) + '" style="' + field + '">';
        return '<div style="display:flex;flex-direction:column;gap:10px;">'
            + '<div style="' + card + 'border-color:' + (ok ? 'var(--ti-green, #34D399)' : 'var(--ti-alert-ink, #FCA5A5)') + ';font-weight:800;">'
            + E(T(ok ? 'Minimum standard met: every must-pass item passed and nothing scored 1.' : 'Minimum standard not met: no work area yet.')) + '</div>'
            + list('Must-pass items not passed or not done', failing, 'var(--ti-alert-ink, #FCA5A5)')
            + list('Scored 1 (unsafe)', g.unsafe, 'var(--ti-alert-ink, #FCA5A5)')
            + list('Training goals for the trial (scored 2)', g.goals, 'var(--ti-gold, #FBBF24)')
            + list('Set aside by the owner, with a reason', g.waived, 'var(--ti-gold, #FBBF24)')
            + (c.status !== 'assessing' ? '<p style="' + muted + '">' + E(T(LABELS[c.status])) + (c.decision_signed_by ? ' (' + E(c.decision_signed_by) + ')' : '') + '</p>'
                : '<div style="' + card + 'display:flex;flex-direction:column;gap:8px;"><strong>' + E(T('Start the trial')) + '</strong>'
                + '<p style="' + muted + 'margin:0;">' + E(T('Make the trial long enough to SEE HEALED RESULTS of the first work: a trial that ends before the first heals ends before the real test.')) + '</p>'
                + '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + labelled('First checkpoint', '<input type="date" id="trial-checkpoint" style="' + field + '">') + labelled('Trial ends', '<input type="date" id="trial-end" style="' + field + '">') + '</div>'
                + '<div><button type="button" data-act="start-trial"' + (ok ? '' : ' disabled') + ' style="' + btnMain + (ok ? '' : 'opacity:0.5;cursor:not-allowed;') + '">' + E(T('Start trial (observe stage)')) + '</button></div></div>'
                + '<div style="' + card + 'display:flex;flex-direction:column;gap:8px;"><strong>' + E(T('Not taking them on')) + '</strong>'
                + '<p style="' + muted + 'margin:0;">' + E(T("A candidate's record is personal data: choose when you will delete it.")) + '</p>'
                + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">' + labelled('Signed by', signRow) + labelled('Delete the record after', '<input type="date" id="reject-delete-after" style="' + field + '">')
                + '<button type="button" data-act="decide" data-decision="rejected" style="' + btn + '">' + E(T('Not taken on')) + '</button></div></div>')
            + '</div>';
    }

    function trialHtml() {
        const c = data.candidate;
        if (c.status === 'assessing') return '<div style="' + card + muted + '">' + E(T('The trial starts from the scorecard, once the minimum standard is met.')) + '</div>';
        const scored = data.plan.filter((p) => p.kind === 'score');
        return '<div style="display:flex;flex-direction:column;gap:10px;">'
            + '<div style="' + card + 'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">'
            + labelled('Stage', select('trial-stage', c.trial_stage || 'observe', ['observe', 'supervised', 'spot_checks']))
            + labelled('Next checkpoint', '<input type="date" id="trial-next" value="' + E(c.next_checkpoint_on) + '" style="' + field + '">')
            + labelled('Trial ends', '<input type="date" id="trial-ends" value="' + E(c.trial_ends_on) + '" style="' + field + '">')
            + labelled('Hepatitis B vaccination offered on', '<input type="date" id="trial-hepb" value="' + E(c.hepb_vaccine_offered_on) + '" style="' + field + '">')
            + '<div style="grid-column:1/-1;' + muted + '">' + E(T('Only the date it was offered is kept: whether someone is vaccinated is health data, so the CRM never asks or stores it. In the US, OSHA requires the offer, free, to employees exposed to blood.')) + ' '
            + E(T('Give their login the role that matches the stage (Settings, Staff).')) + '</div>'
            + '<div><button type="button" data-act="save-trial" style="' + btn + '"' + (c.status !== 'trial' ? ' disabled' : '') + '>' + E(T('Save')) + '</button></div></div>'
            + (c.status === 'trial' ? '<strong>' + E(T('Checkpoint: score the same areas again')) + '</strong>' + scored.map((p) => itemRow(p, 'checkpoint')).join('')
                + '<div style="' + card + 'display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;"><strong style="width:100%;">' + E(T('End of the trial')) + '</strong>'
                + labelled('Signed by', '<input id="sign-name" value="' + E(me()) + '" style="' + field + '">')
                + '<button type="button" data-act="decide" data-decision="accepted" style="' + btnMain + '">' + E(T('Accept')) + '</button>'
                + '<button type="button" data-act="decide" data-decision="stopped" style="' + btn + '">' + E(T('Stop the trial')) + '</button>'
                + '<span style="' + muted + '">' + E(T('To extend, move the trial end date and save.')) + '</span></div>'
                : '<p style="' + muted + '">' + E(T(LABELS[c.status])) + (c.decision_signed_by ? ' (' + E(c.decision_signed_by) + ')' : '') + '</p>')
            + '</div>';
    }

    function renderRules(el, rules) {
        el.innerHTML = topBar()
            + '<p style="' + muted + 'margin:0;">' + E(T('Your studio\'s own piercing rules, one per placement: needle choice for the jewellery, marking, angle, jewellery selection. Technique changes how a piercing heals, so we recommend writing them. The practical test scores "follows the studio rule" for each one.')) + '</p>'
            + rules.map((r) => '<div style="' + card + 'display:flex;flex-direction:column;gap:6px;"><strong>' + E(r.placement) + '</strong>'
                + '<textarea data-rule-for="' + E(r.placement) + '" rows="3" style="' + field + '">' + E(r.rule) + '</textarea>'
                + '<div style="display:flex;gap:6px;"><button type="button" data-act="save-rule" data-placement="' + E(r.placement) + '" style="' + btn + '">' + E(T('Save')) + '</button>'
                + '<button type="button" data-act="remove-rule" data-placement="' + E(r.placement) + '" style="' + btn + '">' + E(T('Remove')) + '</button></div></div>').join('')
            + '<form id="assessment-rule-form" style="' + card + 'display:flex;flex-direction:column;gap:6px;"><strong>' + E(T('Add a placement')) + '</strong>'
            + '<input id="rule-placement" required placeholder="' + E(T('Placement, e.g. Helix')) + '" style="' + field + '">'
            + '<textarea id="rule-text" required rows="3" placeholder="' + E(T("Write your studio's rule")) + '" style="' + field + '"></textarea>'
            + '<div><button type="submit" style="' + btnMain + '">' + E(T('Add')) + '</button></div></form>';
    }

    function renderQuestions(el, res) {
        const src = { plan: 'From the assessment plan', patrick: "Patrick Poli's questions", studio: 'Your own' };
        el.innerHTML = topBar()
            + '<p style="' + muted + 'margin:0;">' + E(T('Every question is about the work. A question about health is refused: it is unlawful before a job offer in many countries, and the CRM never records health.')) + '</p>'
            + res.questions.map((q) => '<div style="' + card + 'display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;' + (q.active ? '' : 'opacity:0.55;') + '"><div>'
                + (q.must_pass ? '<span style="color:var(--ti-alert-ink, #FCA5A5);font-size:0.72rem;font-weight:900;margin-right:6px;">' + E(T('MUST PASS')) + '</span>' : '')
                + '<span style="' + muted + '">' + E(T(q.topic)) + '</span><div style="font-weight:700;font-size:0.86rem;">' + E(T(q.question)) + '</div>'
                + '<div style="' + muted + '">' + E(T(src[q.source] || q.source)) + (q.discipline !== 'all' ? ' | ' + E(T(LABELS[q.discipline])) : '') + '</div></div>'
                + '<button type="button" data-act="toggle-question" data-id="' + Number(q.id) + '" data-active="' + (q.active ? 0 : 1) + '" style="' + btn + '">' + E(T(q.active ? 'Switch off' : 'Switch on')) + '</button></div>').join('')
            + '<form id="assessment-question-form" style="' + card + 'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;"><strong style="grid-column:1/-1;">' + E(T('Add your own question')) + '</strong>'
            + labelled('Topic', '<input id="q-topic" required style="' + field + '">')
            + labelled('For', select('q-discipline', 'all', ['all', 'piercer', 'tattooist']))
            + '<div style="grid-column:1/-1;">' + labelled('Question', '<input id="q-question" required style="' + field + '">') + '</div>'
            + labelled('A good answer covers', '<textarea id="q-good" rows="2" style="' + field + '"></textarea>')
            + labelled('Red flags', '<textarea id="q-red" rows="2" style="' + field + '"></textarea>')
            + '<label style="' + muted + 'display:flex;gap:6px;align-items:center;"><input type="checkbox" id="q-must"> ' + E(T('Must pass (a failed answer means no work area)')) + '</label>'
            + '<div style="grid-column:1/-1;"><button type="submit" style="' + btnMain + '">' + E(T('Add')) + '</button></div></form>';
    }
    LABELS.all = 'Everyone';

    // ---- actions --------------------------------------------------------------------------------
    async function act(fn) {
        try { await fn(); } catch (e) { toast(T(e.message)); }
    }
    async function answer(item, step, extra) {
        const notesEl = document.querySelector('[data-notes-for="' + CSS.escape(item) + '"]');
        data = await api('POST', '/api/assessment/candidates/' + data.candidate.id + '/items',
            { item, step, notes: notesEl ? notesEl.value : '', signed_by: me(), on_date: today(), ...extra });
        const scroll = body().scrollTop;
        renderCandidate(body());
        body().scrollTop = scroll;
    }

    document.addEventListener('click', (ev) => {
        const b = ev.target.closest && ev.target.closest('#assessment-modal-overlay [data-act]');
        if (!b || b.disabled) return;
        const a = b.dataset.act;
        if (a === 'go-list') return show({ name: 'list' });
        if (a === 'go-new') return show({ name: 'new' });
        if (a === 'go-rules') return show({ name: 'rules' });
        if (a === 'go-questions') return show({ name: 'questions' });
        if (a === 'open') return show({ name: 'candidate', id: Number(b.dataset.id) });
        if (a === 'step') { view.step = b.dataset.step; return renderCandidate(body()); }
        const v = (id) => (document.getElementById(id) || {}).value || '';
        act(async () => {
            const id = data && data.candidate && data.candidate.id;
            if (a === 'score') await answer(b.dataset.item, b.dataset.stepkind, { score: Number(b.dataset.score) });
            else if (a === 'pass') await answer(b.dataset.item, b.dataset.stepkind, { passed: Number(b.dataset.passed) });
            else if (a === 'waive') {
                const note = (document.querySelector('[data-waive-for="' + CSS.escape(b.dataset.item) + '"]') || {}).value || '';
                if (!note.trim()) return toast(T('Write why this item does not apply'));
                await answer(b.dataset.item, 'paper', { passed: 0, waived_note: note });
            } else if (a === 'save-details') {
                data = await api('PATCH', '/api/assessment/candidates/' + id, { name: v('cand-name'), discipline: v('cand-discipline'), track: v('cand-track'), person_type: v('cand-type'), notes: v('cand-notes') });
                renderCandidate(body()); toast(T('Saved'));
            } else if (a === 'save-trial') {
                data = await api('PATCH', '/api/assessment/candidates/' + id, { trial_stage: v('trial-stage'), next_checkpoint_on: v('trial-next'), trial_ends_on: v('trial-ends'), hepb_vaccine_offered_on: v('trial-hepb') });
                renderCandidate(body()); toast(T('Saved')); loadTrialWidget();
            } else if (a === 'start-trial') {
                data = await api('POST', '/api/assessment/candidates/' + id + '/start-trial', { next_checkpoint_on: v('trial-checkpoint'), trial_ends_on: v('trial-end') });
                view.step = 'trial'; renderCandidate(body()); toast(T('Trial started: they are now in the team list')); loadTrialWidget();
            } else if (a === 'decide') {
                data = await api('POST', '/api/assessment/candidates/' + id + '/decision', { decision: b.dataset.decision, signed_by: v('sign-name'), delete_after: v('reject-delete-after') });
                renderCandidate(body()); toast(T('Saved')); loadTrialWidget();
            } else if (a === 'delete') {
                if (b.dataset.confirm !== '1') { b.dataset.confirm = '1'; b.textContent = T('Click again to delete for good'); return; }
                await api('DELETE', '/api/assessment/candidates/' + id);
                toast(T('Record deleted')); show({ name: 'list' }); loadTrialWidget();
            } else if (a === 'pdf') downloadPdf();
            else if (a === 'save-rule' || a === 'remove-rule') {
                const p = b.dataset.placement;
                const rule = a === 'remove-rule' ? '' : (document.querySelector('[data-rule-for="' + CSS.escape(p) + '"]') || {}).value || '';
                renderRules(body(), await api('PUT', '/api/assessment/rules', { placement: p, rule, updated_by: me() })); toast(T('Saved'));
            } else if (a === 'toggle-question') {
                await api('PATCH', '/api/assessment/questions/' + b.dataset.id, { active: b.dataset.active === '1' });
                show({ name: 'questions' });
            }
        });
    });

    document.addEventListener('submit', (ev) => {
        const f = ev.target;
        if (!f || !f.closest || !f.closest('#assessment-modal-overlay')) return;
        ev.preventDefault();
        const v = (id) => (document.getElementById(id) || {}).value || '';
        act(async () => {
            if (f.id === 'assessment-new-form') {
                const res = await api('POST', '/api/assessment/candidates', { name: v('cand-name'), email: v('cand-email'), phone: v('cand-phone'), discipline: v('cand-discipline'), track: v('cand-track'), person_type: v('cand-type') });
                show({ name: 'candidate', id: res.candidate.id, step: 'paper' });
            } else if (f.id === 'assessment-rule-form') {
                renderRules(body(), await api('PUT', '/api/assessment/rules', { placement: v('rule-placement'), rule: v('rule-text'), updated_by: me() })); toast(T('Saved'));
            } else if (f.id === 'assessment-question-form') {
                await api('POST', '/api/assessment/questions', { topic: v('q-topic'), question: v('q-question'), good_answer: v('q-good'), red_flags: v('q-red'), discipline: v('q-discipline'), must_pass: document.getElementById('q-must').checked });
                toast(T('Question added')); show({ name: 'questions' });
            }
        });
    });

    // ---- PDF: the scorecard and the trial, for the studio's file ---------------------------------
    function downloadPdf() {
        if (!(window.jspdf && window.jspdf.jsPDF)) return toast(T('The PDF library did not load'));
        const c = data.candidate;
        const doc = new window.jspdf.jsPDF();
        let y = 16;
        const line = (text, size, gap) => {
            doc.setFontSize(size || 10);
            for (const l of doc.splitTextToSize(String(text), 180)) { if (y > 282) { doc.addPage(); y = 16; } doc.text(l, 15, y); y += (size || 10) * 0.5; }
            y += gap || 1.5;
        };
        let studio = '';
        try { studio = (JSON.parse(localStorage.getItem('poli_studio_profile') || '{}') || {}).studioName || ''; } catch (e) { /* no studio name */ }
        line(T('New artist assessment') + (studio ? ' - ' + studio : ''), 15, 3);
        line([c.name, T(LABELS[c.discipline]), T(LABELS[c.track]), T(LABELS[c.person_type]), T(LABELS[c.status])].join('  |  '), 10);
        line(T('Printed') + ' ' + new Date().toLocaleDateString(), 8, 4);
        const result = (p, step) => {
            const r = latest(data.items, p.item, step);
            if (!r) return T('not done');
            if (r.waived_note) return T('set aside:') + ' ' + r.waived_note;
            return (p.kind === 'score' ? r.score + ' ' + T(SCORE[r.score] || '') : T(r.passed === 1 ? (p.kind === 'must' ? 'Pass' : 'Yes') : (p.kind === 'must' ? 'Fail' : 'No')))
                + (r.notes ? ' - ' + r.notes : '') + (r.signed_by ? ' (' + r.signed_by + ', ' + r.on_date + ')' : '');
        };
        for (const [k, title] of STEPS.slice(0, 3)) {
            line(T(title), 12, 2);
            for (const p of data.plan.filter((x) => x.step === k)) line((p.kind === 'must' ? '[' + T('MUST PASS') + '] ' : '') + T(p.label) + ': ' + result(p, k), 9);
            y += 2;
        }
        const g = data.gate;
        line(T('4. Scorecard'), 12, 2);
        line(T(g.ok ? 'Minimum standard met.' : 'Minimum standard not met.'), 10);
        if (g.goals.length) line(T('Training goals:') + ' ' + g.goals.map(labelOf).join('; '), 9);
        if (g.waived.length) line(T('Set aside by the owner:') + ' ' + g.waived.map(labelOf).join('; '), 9);
        y += 2;
        if (c.status !== 'assessing') {
            line(T('5. Trial'), 12, 2);
            line([T('Stage') + ': ' + T(LABELS[c.trial_stage] || '-'), T('Next checkpoint') + ': ' + (c.next_checkpoint_on || '-'), T('Trial ends') + ': ' + (c.trial_ends_on || '-')].join('  |  '), 9);
            line(T('Hepatitis B vaccination offered on') + ': ' + (c.hepb_vaccine_offered_on || '-'), 9);
            const cps = data.items.filter((r) => r.step === 'checkpoint');
            for (const r of cps) line(r.on_date + '  ' + labelOf(r.item) + ': ' + r.score + (r.notes ? ' - ' + r.notes : ''), 9);
            if (c.decision_signed_by) line(T(LABELS[c.status]) + ', ' + T('signed by') + ' ' + c.decision_signed_by, 10);
        }
        y += 8;
        line(T('Owner signature') + ': ______________________      ' + T('Artist signature') + ': ______________________', 10, 6);
        line(T(NOT_ADVICE), 8);
        doc.save('assessment-' + String(c.name).replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-' + today() + '.pdf');
    }

    // ---- the calendar: trials, their next checkpoint and their end ------------------------------
    async function loadTrialWidget() {
        const box = document.getElementById('trial-checkpoints-widget');
        const tb = document.getElementById('trial-checkpoints-tbody');
        if (!box || !tb) return;
        let rows = [];
        try { const r = await fetch('/api/assessment/trials'); if (r.ok) rows = await r.json(); } catch (e) { /* not an administrator, or offline */ }
        box.style.display = rows.length ? '' : 'none';
        tb.innerHTML = rows.map((r) => '<tr style="border-top:1px solid var(--ti-line, #334155);"><td style="padding:6px;font-weight:700;">' + E(r.name) + '</td><td style="padding:6px;">' + E(T(LABELS[r.trial_stage] || '')) + '</td>'
            + '<td style="padding:6px;">' + E(r.next_checkpoint_on || '-') + '</td><td style="padding:6px;">' + E(r.trial_ends_on || '-') + '</td>'
            + '<td style="padding:6px;text-align:right;"><button type="button" data-trial-open="' + Number(r.id) + '" style="' + btn + '">' + E(T('Open')) + '</button></td></tr>').join('');
    }
    document.addEventListener('click', (ev) => {
        const b = ev.target.closest && ev.target.closest('[data-trial-open]');
        if (b) { openNewArtistsModal(); show({ name: 'candidate', id: Number(b.dataset.trialOpen), step: 'trial' }); }
        if (ev.target.closest && ev.target.closest('#nav-dest-calendar')) loadTrialWidget();
    });
    document.addEventListener('DOMContentLoaded', loadTrialWidget);

    function openNewArtistsModal() {
        window.forceShowModal('assessment-modal-overlay');
        show({ name: 'list' });
    }
    window.openNewArtistsModal = openNewArtistsModal;
    window.closeNewArtistsModal = () => window.forceHideModal('assessment-modal-overlay');
})();
