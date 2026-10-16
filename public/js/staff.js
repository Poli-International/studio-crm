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

// Who is signed in, and whether staff logins are on (from /api/access).
let accessInfo = {};
const LEVEL_LABEL = { front_desk: 'Front desk', staff: 'Staff', admin: 'Administrator' };
async function loadAccessInfo() {
    try { accessInfo = await (await fetch('/api/access')).json(); } catch (e) { accessInfo = {}; }
    // lower levels do not see the money reports and the studio settings (the server refuses them anyway)
    document.body.dataset.level = accessInfo.level || 'admin';
    for (const id of ['nav-dest-finance', 'nav-dest-settings']) {
        const el = document.getElementById(id);
        // the nav styles say display:flex !important, so the hiding needs !important too
        if (el) el.style.setProperty('display', accessInfo.level && accessInfo.level !== 'admin' ? 'none' : '', 'important');
    }
    // signed in with a staff login: that person is at the screen
    if (accessInfo.staffLogins && accessInfo.me) {
        try { localStorage.setItem('studio_active_staff', JSON.stringify({ id: 0, name: accessInfo.me + ' (' + LEVEL_LABEL[accessInfo.level] + ')' })); } catch (e) { /* private window */ }
        showActiveStaff();
    }
    return accessInfo;
}
document.addEventListener('DOMContentLoaded', loadAccessInfo);

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
        const level = accessInfo.logins && accessInfo.logins[id];
        return `<div class="staff-row" style="padding:12px 14px;background:#1E293B;border:1px solid ${here ? '#10B981' : '#475569'};border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <div style="min-width:0;">
                <div style="font-weight:800;font-size:0.9rem;">${escapeHtml(s.name || '')}${here ? ' <span style="color:#10B981;font-size:0.72rem;">● at the screen</span>' : ''}${level ? ` <span class="staff-level-badge" style="background:#312E81;color:#C7D2FE;border-radius:6px;padding:1px 6px;font-size:0.7rem;">🔑 ${LEVEL_LABEL[level]}</span>` : ''}</div>
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

async function openStaffLoginModal() {
    forceShowModal('staff-login-modal-overlay');
    await loadAccessInfo();
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
    // the login fields: an administrator, once the studio password is set
    const access = document.getElementById('staff-form-access');
    if (access) access.style.display = accessInfo.passwordSet && accessInfo.level === 'admin' ? '' : 'none';
    const levelEl = document.getElementById('staff-form-level');
    if (levelEl) levelEl.value = (member && accessInfo.logins && accessInfo.logins[member.id]) || '';
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
    // their login: level and password (an administrator, with the studio password set)
    const levelEl = document.getElementById('staff-form-level');
    const pwEl = document.getElementById('staff-form-login-password');
    const accessShown = document.getElementById('staff-form-access') && document.getElementById('staff-form-access').style.display !== 'none';
    if (accessShown && levelEl) {
        const had = accessInfo.logins && accessInfo.logins[saved.id];
        const level = levelEl.value, password = (pwEl && pwEl.value) || '';
        if (level || had) {
            const res = await fetch('/api/access/staff-login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(level ? { staff_id: saved.id, level, password } : { staff_id: saved.id, remove: true }) });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { showStudioToast(data.error || 'Could not save the login'); return; }
            await loadAccessInfo();
        }
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
    show('access-idle-row', on);
    const idle = document.getElementById('access-idle-minutes');
    if (idle) idle.value = String(access.idleMinutes || 0);
    startIdleLock(on ? access.idleMinutes : 0);
    // kiosk tablets: their own password, on top of the studio password
    const addr = document.getElementById('kiosk-address');
    if (addr) addr.textContent = window.location.origin + '/kiosk';
    // the server's own network addresses: on the server PC itself this page is on localhost, which a tablet cannot open
    fetch('/api/kiosk/addresses').then((r) => r.ok ? r.json() : null).then((a) => {
        if (!a) return;
        const secure = a.https.length ? a.https : a.http;
        if (addr && secure.length) addr.textContent = secure.join('  or  ');
        const plain = document.getElementById('kiosk-address-plain');
        if (plain) plain.textContent = a.http.join('  or  ');
        show('kiosk-address-plain-row', a.https.length > 0 && a.http.length > 0);
    }).catch(() => {});
    const kStatus = document.getElementById('kiosk-access-status');
    const kForm = document.getElementById('kiosk-access-form');
    if (kStatus) kStatus.textContent = !on ? 'No studio password is set, so a tablet opens the kiosk page without signing in. Set the studio password to give tablets their own password.'
        : access.kioskPasswordSet ? 'A kiosk password is set: a tablet signs in with it once and can then only receive and return forms.'
        : 'Set a kiosk password: a tablet signs in with it and can then only receive and return forms, never open the CRM.';
    if (kForm) kForm.style.display = on && access.level === 'admin' ? 'flex' : 'none';
    show('kiosk-access-remove-btn', !!access.kioskPasswordSet);
    const kSave = document.getElementById('kiosk-access-save-btn');
    if (kSave) kSave.textContent = access.kioskPasswordSet ? 'Change kiosk password' : 'Set kiosk password';
}
document.addEventListener('DOMContentLoaded', showStudioAccess);

// event: the form was submitted (set or change); null: remove
async function saveKioskPassword(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('kiosk-access-next');
    const password = event ? (input ? input.value : '') : '';
    if (event && password.length < 6) { showStudioToast('Use at least 6 characters'); return; }
    try {
        const res = await fetch('/api/access/kiosk-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { showStudioToast(data.error || 'Could not save'); return; }
        if (input) input.value = '';
        showStudioToast(data.kioskPasswordSet ? 'Kiosk password saved: sign each tablet in with it' : 'Kiosk password removed');
        showStudioAccess();
    } catch (e) { showStudioToast('Could not save: the server did not answer'); }
}
window.saveKioskPassword = saveKioskPassword;

// =========================================================================
// ⏱️ IDLE LOCK (Settings, with the studio password): a device left unused signs out
// =========================================================================
// Use anywhere counts, inside the embedded tools and the form builder too. The tablet kiosk is
// never locked: it has its own PIN, and a client filling in a long form is not "idle".
// ponytail: the lock runs in the page; the studio password is what protects the data on the server.
let idleLockTimer = null;
let idleLastUse = Date.now();
const markUsed = () => { idleLastUse = Date.now(); };
['pointerdown', 'keydown', 'touchstart', 'wheel', 'mousemove'].forEach((ev) => window.addEventListener(ev, markUsed, { passive: true, capture: true }));
// the embedded tools are pages of their own: listen inside them as they load
document.addEventListener('load', (e) => {
    const frame = e.target;
    if (!frame || frame.tagName !== 'IFRAME') return;
    try { ['pointerdown', 'keydown', 'touchstart', 'wheel', 'mousemove'].forEach((ev) => frame.contentWindow.addEventListener(ev, markUsed, { passive: true, capture: true })); } catch (err) { /* another site */ }
}, true);

function kioskOpen() {
    for (const frame of document.querySelectorAll('iframe')) {
        try {
            const k = frame.contentDocument && frame.contentDocument.getElementById('tablet-kiosk-modal');
            if (k && k.style.display !== 'none') return true;
        } catch (e) { /* another site */ }
    }
    return false;
}

function startIdleLock(minutes) {
    if (idleLockTimer) clearInterval(idleLockTimer);
    idleLockTimer = null;
    if (!minutes) return;
    markUsed();
    idleLockTimer = setInterval(async () => {
        if (kioskOpen()) { markUsed(); return; }
        if (Date.now() - idleLastUse < minutes * 60000) return;
        clearInterval(idleLockTimer);
        try { await fetch('/api/access/logout', { method: 'POST' }); } catch (e) { /* the reload shows the sign-in page anyway */ }
        window.location.reload();
    }, 15000);
}

async function saveIdleLock(minutes) {
    try {
        const res = await fetch('/api/access/idle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ minutes: Number(minutes) }) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { showStudioToast(data.error || 'Could not save'); return; }
        startIdleLock(data.idleMinutes);
        showStudioToast(data.idleMinutes ? 'Devices lock after ' + data.idleMinutes + ' minutes without use' : 'Idle lock is off');
    } catch (e) { showStudioToast('Could not save: the server did not answer'); }
}
window.saveIdleLock = saveIdleLock;

// =========================================================================
// 🔒 TABLET KIOSK PIN (Settings): asked to leave the consent form kiosk on a tablet
// =========================================================================
// Stored as a short hash in poli_kiosk_exit_pin, which app-data-sync shares with every device.
// ponytail: a deterrent for a client left alone with the tablet, not a security boundary
// (a 4-digit PIN is easy to try out); the studio password protects the data itself.
const KIOSK_PIN_KEY = 'poli_kiosk_exit_pin';
function kioskPinHash(pin) {
    let h = 0;
    for (const c of 'poli-kiosk:' + String(pin)) h = (h * 31 + c.charCodeAt(0)) | 0;
    return 'h' + (h >>> 0).toString(36);
}

function showKioskPin() {
    let set = false;
    try { set = !!localStorage.getItem(KIOSK_PIN_KEY); } catch (e) { /* private window */ }
    const status = document.getElementById('kiosk-pin-status');
    if (status) status.textContent = set
        ? 'A PIN is set: leaving Kiosk Mode, and the "form submitted" screen, needs it.'
        : 'No PIN is set: anyone holding the tablet can leave Kiosk Mode.';
    const save = document.getElementById('kiosk-pin-save-btn');
    if (save) save.textContent = set ? 'Change PIN' : 'Set PIN';
    const remove = document.getElementById('kiosk-pin-remove-btn');
    if (remove) remove.style.display = set ? '' : 'none';
}
document.addEventListener('DOMContentLoaded', showKioskPin);

function saveKioskPin(event) {
    if (event) event.preventDefault();
    const field = document.getElementById('kiosk-pin-next');
    const pin = (field && field.value || '').trim();
    if (!/^[0-9]{4,8}$/.test(pin)) { showStudioToast('Use 4 to 8 digits'); return; }
    try { localStorage.setItem(KIOSK_PIN_KEY, kioskPinHash(pin)); } catch (e) { showStudioToast('This browser could not save the PIN'); return; }
    field.value = '';
    showKioskPin();
    showStudioToast('Tablet kiosk PIN saved');
}
window.saveKioskPin = saveKioskPin;

function removeKioskPin() {
    try { localStorage.removeItem(KIOSK_PIN_KEY); } catch (e) { /* private window */ }
    showKioskPin();
    showStudioToast('Tablet kiosk PIN removed');
}
window.removeKioskPin = removeKioskPin;

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
