// =========================================================================
// 👥 STAFF: the team list (add, edit, remove) and who is at the screen
// =========================================================================
// "At the screen" is a name shown in the top bar, so the team can see whose turn
// it is on a shared PC. It is not a login: the optional studio password (below,
// and src/access.js) is what keeps other people on the network out.
let staffList = [];
let editingStaffId = null;
const STAFF_FORM_FIELDS = { name: 'staff-form-name', title: 'staff-form-title', role: 'staff-form-role',
    email: 'staff-form-email', phone: 'staff-form-phone', specialties: 'staff-form-specialties' };

function activeStaff() {
    try { return JSON.parse(localStorage.getItem('studio_active_staff') || 'null'); } catch (e) { return null; }
}

function showActiveStaff() {
    const el = document.getElementById('topbar-user-name');
    const who = activeStaff();
    if (el) el.textContent = who ? who.name : 'Staff Login';
}
document.addEventListener('DOMContentLoaded', showActiveStaff);

async function renderStaffList() {
    const body = document.getElementById('staff-list-body');
    if (!body) return;
    try {
        const res = await fetch('/api/staff');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        staffList = await res.json();
    } catch (e) {
        body.innerHTML = '<div style="padding:16px;color:#EF4444;text-align:center;">Could not load the team: the server did not answer</div>';
        return;
    }
    if (!staffList.length) {
        body.innerHTML = '<div style="padding:16px;color:#94A3B8;text-align:center;">No staff yet. Add your first team member.</div>';
        return;
    }
    const who = activeStaff();
    const btn = 'padding:6px 10px;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;';
    body.innerHTML = staffList.map((s) => {
        const id = Number(s.id);
        const here = who && Number(who.id) === id;
        const details = [s.title, s.email, s.phone].filter(Boolean).map(escapeHtml).join(' · ');
        return `<div class="staff-row" style="padding:12px 14px;background:#1E293B;border:1px solid ${here ? '#10B981' : '#475569'};border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <div style="min-width:0;">
                <div style="font-weight:800;font-size:0.9rem;">${escapeHtml(s.name || '')}${here ? ' <span style="color:#10B981;font-size:0.72rem;">● at the screen</span>' : ''}</div>
                <div style="font-size:0.75rem;color:#94A3B8;">${details}</div>
            </div>
            <div style="display:flex;gap:6px;">
                <button type="button" onclick="selectActiveStaff(${id})" style="${btn}background:#10B981;color:#FFF;border:none;">Select</button>
                <button type="button" onclick="openStaffFormModal(${id})" style="${btn}background:#2563EB;color:#FFF;border:none;">Edit</button>
                <button type="button" onclick="removeStaffMember(${id})" style="${btn}background:transparent;color:#FCA5A5;border:1px solid rgba(239,68,68,0.5);">Remove</button>
            </div>
        </div>`;
    }).join('');
}

function openStaffLoginModal() {
    forceShowModal('staff-login-modal-overlay');
    renderStaffList();
}
window.openStaffLoginModal = openStaffLoginModal;

function closeStaffLoginModal() {
    forceHideModal('staff-login-modal-overlay');
}
window.closeStaffLoginModal = closeStaffLoginModal;

function selectActiveStaff(id) {
    const member = staffList.find((s) => Number(s.id) === Number(id));
    if (!member) return;
    try { localStorage.setItem('studio_active_staff', JSON.stringify({ id: member.id, name: member.name })); } catch (e) { /* private window */ }
    showActiveStaff();
    renderStaffList();
    showStudioToast('At the screen now: ' + member.name);
}
window.selectActiveStaff = selectActiveStaff;

function openStaffFormModal(id) {
    const member = id ? staffList.find((s) => Number(s.id) === Number(id)) : null;
    editingStaffId = member ? member.id : null;
    const form = document.getElementById('staff-form');
    if (form) form.reset();
    const title = document.getElementById('staff-form-modal-title');
    if (title) title.textContent = member ? 'Edit Staff Member: ' + member.name : 'New Staff Member';
    if (member) {
        for (const [field, elId] of Object.entries(STAFF_FORM_FIELDS)) {
            const el = document.getElementById(elId);
            if (el) el.value = Array.isArray(member[field]) ? member[field].join(', ') : (member[field] || '');
        }
    }
    forceShowModal('staff-form-modal-overlay');
}
window.openStaffFormModal = openStaffFormModal;

function closeStaffFormModal() {
    forceHideModal('staff-form-modal-overlay');
    editingStaffId = null;
}
window.closeStaffFormModal = closeStaffFormModal;

async function handleSaveStaffMember(event) {
    if (event) event.preventDefault();
    const member = {};
    for (const [field, elId] of Object.entries(STAFF_FORM_FIELDS)) {
        const el = document.getElementById(elId);
        member[field] = el ? el.value.trim() : '';
    }
    if (!member.name) {
        showStudioToast("Please enter the staff member's name");
        return;
    }
    const editedId = editingStaffId;
    let saved;
    try {
        const res = await fetch(editedId ? '/api/staff/' + editedId : '/api/staff', {
            method: editedId ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        saved = await res.json();
    } catch (e) {
        showStudioToast('Could not save the staff member: the server did not answer');
        return;
    }
    const who = activeStaff();
    if (who && Number(who.id) === Number(saved.id)) {
        try { localStorage.setItem('studio_active_staff', JSON.stringify({ id: saved.id, name: saved.name })); } catch (e) { /* private window */ }
        showActiveStaff();
    }
    closeStaffFormModal();
    renderStaffList();
    populatePeopleSelects();
    showStudioToast(editedId ? 'Staff member updated: ' + saved.name : 'Staff member added: ' + saved.name);
}
window.handleSaveStaffMember = handleSaveStaffMember;

async function removeStaffMember(id) {
    const member = staffList.find((s) => Number(s.id) === Number(id));
    if (!member) return;
    if (!window.confirm(`Remove ${member.name} from the team? Their past appointments and notes are kept.`)) return;
    try {
        const res = await fetch('/api/staff/' + member.id, { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
    } catch (e) {
        showStudioToast('Could not remove the staff member: the server did not answer');
        return;
    }
    const who = activeStaff();
    if (who && Number(who.id) === Number(member.id)) {
        try { localStorage.removeItem('studio_active_staff'); } catch (e) { /* private window */ }
        showActiveStaff();
    }
    renderStaffList();
    populatePeopleSelects();
    showStudioToast('Staff member removed: ' + member.name);
}
window.removeStaffMember = removeStaffMember;

// =========================================================================
// 📅 SHIFT ROTA: who works when, from this week on
// =========================================================================
async function renderMonthlyShiftSchedule() {
    const body = document.getElementById('shift-roster-tbody');
    if (!body) return;
    let shifts = [];
    try {
        const res = await fetch('/api/staff/monthly-schedule');
        if (res.ok) shifts = await res.json();
    } catch (e) { /* shown as an empty rota */ }
    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const from = monday.toLocaleDateString('en-CA');
    const list = (Array.isArray(shifts) ? shifts : []).filter((x) => x.date >= from)
        .sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
    const cell = (v) => '<td style="padding:8px;">' + escapeHtml(String(v || '')) + '</td>';
    body.innerHTML = list.length ? list.map((x) => '<tr style="border-bottom:1px solid #1E293B;">' + cell(x.staff_name) + cell(x.date) + cell(x.start_time) + cell(x.end_time) + cell(x.station)
        + `<td style="padding:8px;text-align:right;"><button type="button" onclick="removeRotaShift(${Number(x.id)})" style="padding:4px 8px;background:transparent;color:#FCA5A5;border:1px solid rgba(239,68,68,0.5);border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;">Remove</button></td></tr>`).join('')
        : '<tr><td colspan="6" style="padding:10px;color:#94A3B8;">No shifts planned from this week on. Add the first one above.</td></tr>';
}
window.renderMonthlyShiftSchedule = renderMonthlyShiftSchedule;

async function handleAddRotaShift(event) {
    if (event) event.preventDefault();
    const val = (id) => (document.getElementById(id) || {}).value || '';
    if (!val('rota-staff') || !val('rota-date')) { showStudioToast('Choose a staff member and a date'); return; }
    try {
        const res = await fetch('/api/staff/assign-shift', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ staff_id: val('rota-staff'), date: val('rota-date'), start_time: val('rota-start'), end_time: val('rota-end'), station: val('rota-station') }) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
    } catch (e) { showStudioToast('Could not save the shift: the server did not answer'); return; }
    showStudioToast('Shift saved');
    renderMonthlyShiftSchedule();
}
window.handleAddRotaShift = handleAddRotaShift;

async function removeRotaShift(id) {
    try {
        const res = await fetch('/api/staff/monthly-schedule/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
    } catch (e) { showStudioToast('Could not remove the shift: the server did not answer'); return; }
    renderMonthlyShiftSchedule();
}
window.removeRotaShift = removeRotaShift;

// =========================================================================
// 🔒 STUDIO PASSWORD (Settings): optional, one for the whole studio
// =========================================================================
async function showStudioAccess() {
    const status = document.getElementById('access-status');
    if (!status) return;
    let access;
    try { access = await (await fetch('/api/access')).json(); } catch (e) { return; }
    const on = !!access.passwordSet;
    status.textContent = on ? 'A password is set: every device signs in once before it can open the CRM.'
        : 'No password is set: anyone on the studio network can open the CRM.';
    const show = (id, visible) => { const el = document.getElementById(id); if (el) el.style.display = visible ? '' : 'none'; };
    show('access-current', on);
    show('access-remove-btn', on);
    show('access-signout-btn', on);
    const save = document.getElementById('access-save-btn');
    if (save) save.textContent = on ? 'Change password' : 'Set password';
}
document.addEventListener('DOMContentLoaded', showStudioAccess);

async function sendStudioPassword(next) {
    const current = (document.getElementById('access-current') || {}).value || '';
    try {
        const res = await fetch('/api/access/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current, next }) });
        const data = await res.json();
        if (!res.ok) { showStudioToast(data.error || 'Could not save the password'); return false; }
    } catch (e) { showStudioToast('Could not save the password: the server did not answer'); return false; }
    const form = document.getElementById('access-form');
    if (form) form.reset();
    showStudioAccess();
    return true;
}

async function saveStudioPassword(event) {
    if (event) event.preventDefault();
    const next = (document.getElementById('access-next') || {}).value || '';
    if (next.length < 8) { showStudioToast('Use at least 8 characters'); return; }
    if (await sendStudioPassword(next)) showStudioToast('Studio password saved. Other devices must sign in again.');
}
window.saveStudioPassword = saveStudioPassword;

async function removeStudioPassword() {
    if (!window.confirm('Remove the studio password? Anyone on the studio network can then open the CRM.')) return;
    if (await sendStudioPassword('')) showStudioToast('Studio password removed');
}
window.removeStudioPassword = removeStudioPassword;

async function signOutOfStudio() {
    try { await fetch('/api/access/logout', { method: 'POST' }); } catch (e) { /* the reload shows the sign-in page either way */ }
    window.location.reload();
}
window.signOutOfStudio = signOutOfStudio;
