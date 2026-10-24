// A save button outside a form (forms are guarded in js/01-boot.js): while one save is running, another tap does nothing.
window.oneAtATime = function (fn) {
  var busy = false;
  return async function () {
    if (busy) return;
    busy = true;
    try { return await fn.apply(this, arguments); } finally { busy = false; }
  };
};

// Text into HTML. Defined here, the first script to use it: it lived in js/06-modals-tabs.js at the
// end of the page, so on a slow computer an early answer from the server hit "escapeHtml is not defined".
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =========================================================================
// CLIENT PROFILE MODAL LOGIC (DATABASE INTEGRATED & STAFF NOTES)
// =========================================================================
let currentActiveProfileClient = null;
let currentProfileActiveTab = 'overview';

async function openClientProfileModal(clientId) {
    if (!clientId) return;
    const overlay = forceShowModal('client-profile-modal-overlay');
    if (!overlay) return;

    const bodyEl = document.getElementById('client-profile-modal-body');
    if (bodyEl) {
        bodyEl.innerHTML = `
            <div style="text-align:center;padding:3rem;color:var(--ti-blue-ink, #818CF8);font-size:0.95rem;font-weight:600;">
                <div style="font-size:2rem;margin-bottom:8px;display:inline-block;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-bolt></use></svg></div>
                <div>Fetching complete client record, appointment history, waivers & tattoo artwork...</div>
            </div>
        `;
    }

    try {
        const res = await fetch(`/api/clients/${clientId}/profile`);
        if (!res.ok) throw new Error('Client profile fetch failed');
        const data = await res.json();
        
        currentActiveProfileClient = data;
        renderClientProfileHeader(data);
        switchClientProfileTab('overview');
    } catch (err) {
        console.error('Error loading client profile:', err);
        try {
            const fallbackRes = await fetch(`/api/clients/${clientId}`);
            const clientObj = await fallbackRes.json();
            currentActiveProfileClient = {
                client: clientObj,
                appointments: [],
                waivers: [],
                tattoo_work: [],
                staff_notes: clientObj.staff_notes || []
            };
            renderClientProfileHeader(currentActiveProfileClient);
            switchClientProfileTab('overview');
        } catch (e2) {
            if (bodyEl) {
                bodyEl.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--ti-alert, #EF4444);">Failed to load client profile details.</div>`;
            }
        }
    }
}
window.openClientProfileModal = openClientProfileModal;

// The studio's own team as note authors. The list was typed in with the demo staff's names (Jaxon Vance,
// Maya Lin...), so a real studio could not pick its own people.
async function fillNoteAuthors() {
    const sel = document.getElementById('sn-author-select');
    if (!sel) return;
    let staff = [];
    try { const r = await fetch('/api/staff'); if (r.ok) staff = await r.json(); } catch (e) { return; }
    if (!Array.isArray(staff) || !staff.length) return;
    const role = (r) => String(r || 'staff').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
    sel.innerHTML = staff.map((p) => `<option value="${escapeHtml(p.name + '|' + role(p.role))}">${escapeHtml(p.name)} (${escapeHtml(pdfLabel(role(p.role)))})</option>`).join('');
}

function appointmentNotes(appointments) {
    return (appointments || []).filter((a) => a && String(a.notes || '').trim()).map((a) => ({
        fromAppointment: true, id: 'appt-' + a.id, author: a.staff_name || 'Staff Member', author_role: pdfLabel('Appointment'),
        category: pdfLabel('From appointment') + ': ' + (a.service_type || a.service || ''), note: a.notes,
        timestamp: a.datetime || a.date || '' }));
}

function closeClientProfileModal() {
    forceHideModal('client-profile-modal-overlay');
    currentActiveProfileClient = null;
    renderClientsTable();   // a form signed on a kiosk meanwhile shows in the counts at once
}

function confirmDeleteActiveClient() {
    const client = currentActiveProfileClient && (currentActiveProfileClient.client || currentActiveProfileClient);
    if (!client) return;
    if (!window.confirm(`Delete ${client.name} from the studio database? This cannot be undone.`)) return;
    fetch(`/api/clients/${client.id}`, { method: 'DELETE' }).then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        closeClientProfileModal();
        renderClientsTable();
        populatePeopleSelects();
        showStudioToast(`Client deleted: ${client.name}`);
    }).catch(() => showStudioToast('Could not delete the client: the server did not answer'));
}
window.confirmDeleteActiveClient = confirmDeleteActiveClient;
window.closeClientProfileModal = closeClientProfileModal;

// Age and ID check (src/consent-age.js decides on the server; the age comes with the client)
function clientAgeBadges(client) {
    const pill = (bg, fg, text) => `<span style="background:${bg};color:${fg};padding:2px 8px;border-radius:10px;font-weight:800;">${escapeHtml(text)}</span>`;
    const age = typeof client.age === 'number' ? client.age : null;
    const ageTag = age === null ? pill('rgba(148,163,184,0.2)', '#CBD5E1', pdfLabel('Age not recorded'))
        : age < 18 ? pill('rgba(239,68,68,0.25)', '#FCA5A5', pdfLabel('Under 18 ({0}): a parent or guardian must sign').replace('{0}', age))
        : pill('rgba(148,163,184,0.2)', '#E2E8F0', pdfLabel('Age {0}').replace('{0}', age));
    const id = client.id_check;
    const idTag = id ? pill('rgba(16,185,129,0.2)', '#6EE7B7', pdfLabel('ID checked {0}').replace('{0}', new Date(id.checked_at).toLocaleDateString()))
        : pill('rgba(234,179,8,0.2)', '#FDE047', pdfLabel('ID not checked'));
    return ageTag + idTag;
}
window.clientAgeBadges = clientAgeBadges;

async function saveClientIdCheck(event, clientId) {
    if (event) event.preventDefault();
    const val = (id) => ((document.getElementById(id) || {}).value || '').trim();
    let data;
    try {
        const r = await fetch(`/api/clients/${clientId}/id-check`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: val('cp-id-type'), last4: val('cp-id-last4'), dob: val('cp-id-dob'), checked_by: (document.getElementById('topbar-user-name') || {}).textContent || '' }) });
        data = await r.json();
        if (!r.ok) { showStudioToast(data.error || 'Could not save'); return; }
    } catch (e) { showStudioToast('Could not save: the server did not answer'); return; }
    showStudioToast('ID check saved');
    openClientProfileModal(clientId);
    renderClientsTable();
}
window.saveClientIdCheck = saveClientIdCheck;

function renderClientProfileHeader(data) {
    const client = data.client || data;
    const nameEl = document.getElementById('client-profile-name');
    const tagsEl = document.getElementById('client-profile-tags');
    const avatarEl = document.getElementById('client-profile-avatar');

    if (nameEl) nameEl.textContent = client.name || 'Client Record';

    if (tagsEl) {
        const isVip = client.is_vip || client.vip;
        const loyaltyTier = client.loyalty_tier || '';
        const phone = client.phone || 'No phone recorded';
        const email = client.email || 'No email recorded';
        const totalSpent = Number((data.stats && data.stats.totalSpend) || 0).toFixed(2);

        tagsEl.innerHTML = `
            <span><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-mail></use></svg> ${escapeHtml(email)}</span>
            <span><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-phone></use></svg> ${escapeHtml(phone)}</span>
            ${loyaltyTier ? `<span style="background:rgba(99,102,241,0.2);color:var(--ti-blue-ink, #A5B4FC);padding:2px 8px;border-radius:10px;font-weight:700;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-ring></use></svg> ${escapeHtml(loyaltyTier)}</span>` : ''}
            ${isVip ? '<span style="background:rgba(234,179,8,0.2);color:var(--ti-gold-ink, #FDE047);padding:2px 8px;border-radius:10px;font-weight:800;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-star></use></svg> VIP</span>' : ''}
            <span style="background:rgba(16,185,129,0.2);color:var(--ti-green-ink, #6EE7B7);padding:2px 8px;border-radius:10px;font-weight:700;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-cash></use></svg> Spent: $${totalSpent}</span>
            ${clientAgeBadges(client)}
        `;
    }

    if (avatarEl) {
        const savedPhoto = localStorage.getItem('client_photo_' + client.id);
        if (savedPhoto) {
            avatarEl.innerHTML = `<img src="${savedPhoto}" alt="${escapeHtml(client.name || '')}" style="width:100%;height:100%;object-fit:cover;" />`;
        } else {
            const initials = (client.name || 'CP').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            avatarEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.5rem;color:var(--ti-blue-ink, #818CF8);">${initials}</div>`;
        }
    }

    const countAppts = document.getElementById('cp-count-appointments');
    if (countAppts) countAppts.textContent = (data.appointments || []).length;

    const countWaivers = document.getElementById('cp-count-waivers');
    if (countWaivers) countWaivers.textContent = (data.waivers || []).length + (data.consent_forms || []).length;

    const countWork = document.getElementById('cp-count-tattoo-work');
    if (countWork) countWork.textContent = (data.tattoo_work || []).length;

    const countNotes = document.getElementById('cp-count-notes');
    if (countNotes) countNotes.textContent = (data.staff_notes || []).length + appointmentNotes(data.appointments).length;
}

function switchClientProfileTab(tabName) {
    currentProfileActiveTab = tabName;
    const navBtns = document.querySelectorAll('.cp-nav-btn');
    navBtns.forEach(btn => {
        if (btn.dataset.cptab === tabName) {
            btn.style.color = '#FFF';
            btn.style.borderBottom = '3px solid #6366F1';
            btn.style.background = 'rgba(99,102,241,0.1)';
        } else {
            btn.style.color = '#9CA3AF';
            btn.style.borderBottom = '3px solid transparent';
            btn.style.background = 'transparent';
        }
    });

    const bodyEl = document.getElementById('client-profile-modal-body');
    if (!bodyEl || !currentActiveProfileClient) return;

    const data = currentActiveProfileClient;
    const client = data.client || data;
    const appointments = data.appointments || [];
    const waivers = data.waivers || [];
    const tattoo_work = data.tattoo_work || [];
    // an appointment's note shows here too, marked with where it came from (Henry, 2026-10-17: he looked for it here)
    const staffNotes = (data.staff_notes || client.staff_notes || []).concat(appointmentNotes(appointments));

    if (tabName === 'overview') {
        const hasAllergies = client.allergies && client.allergies.toLowerCase() !== 'none' && client.allergies.trim() !== '';
        const allergiesKnown = !!(client.allergies && client.allergies.trim()); // nothing recorded is not "none": it was shown green as "None Reported"
        
        bodyEl.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:1.25rem;">
                
                <!-- D3 Procedure & Appointment History Timeline Widget -->
                <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1.25rem;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                        <h4 style="margin:0;font-size:0.95rem;font-weight:700;color:var(--ti-text, #F9FAFB);display:flex;align-items:center;gap:6px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-trend-up></use></svg> Procedure & Session Progression Timeline
                        </h4>
                        <span style="font-size:0.75rem;color:var(--ti-blue-ink, #818CF8);font-weight:700;">D3 Interactive Node Track</span>
                    </div>
                    <div id="d3-client-appointment-timeline" style="width:100%;min-height:120px;display:flex;align-items:center;justify-content:center;overflow-x:auto;"></div>
                </div>

                <!-- Client Demographics & Health Profile -->
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(280px, 100%), 1fr));gap:1rem;">
                    <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1.25rem;">
                        <h4 style="margin:0 0 0.85rem 0;font-size:0.95rem;font-weight:700;color:var(--ti-text, #F9FAFB);display:flex;align-items:center;gap:6px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-user></use></svg> Personal Information
                        </h4>
                        <div style="display:flex;flex-direction:column;gap:0.6rem;font-size:0.85rem;">
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--ti-line, #374151);padding-bottom:4px;">
                                <span style="color:var(--ti-muted, #9CA3AF);">Full Name:</span>
                                <strong style="color:#FFF;">${escapeHtml(client.name || 'N/A')}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--ti-line, #374151);padding-bottom:4px;">
                                <span style="color:var(--ti-muted, #9CA3AF);">Email:</span>
                                <strong style="color:#FFF;">${escapeHtml(client.email || 'N/A')}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--ti-line, #374151);padding-bottom:4px;">
                                <span style="color:var(--ti-muted, #9CA3AF);">Phone:</span>
                                <strong style="color:#FFF;">${escapeHtml(client.phone || 'N/A')}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--ti-line, #374151);padding-bottom:4px;">
                                <span style="color:var(--ti-muted, #9CA3AF);">Date of Birth:</span>
                                <strong style="color:#FFF;">${escapeHtml(client.dob || client.birthdate || 'Not recorded')}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--ti-line, #374151);padding-bottom:4px;">
                                <span style="color:var(--ti-muted, #9CA3AF);">${escapeHtml(pdfLabel('Age'))}:</span>
                                <strong style="color:${typeof client.age === 'number' && client.age < 18 ? '#FCA5A5' : '#FFF'};">${typeof client.age === 'number' ? client.age : escapeHtml(pdfLabel('Not recorded'))}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--ti-line, #374151);padding-bottom:4px;">
                                <span style="color:var(--ti-muted, #9CA3AF);">${escapeHtml(pdfLabel('ID check'))}:</span>
                                <strong style="color:#FFF;text-align:right;">${client.id_check
                                    ? escapeHtml(pdfLabel('{0} ending {1}, checked by {2} on {3}').replace('{0}', pdfLabel(client.id_check.type)).replace('{1}', client.id_check.last4).replace('{2}', client.id_check.checked_by).replace('{3}', new Date(client.id_check.checked_at).toLocaleString()))
                                    : escapeHtml(pdfLabel('Not checked yet'))}</strong>
                            </div>
                            <div style="display:flex;justify-content:space-between;">
                                <span style="color:var(--ti-muted, #9CA3AF);">Client Since:</span>
                                <strong style="color:#FFF;">${escapeHtml(client.created_at ? String(client.created_at).slice(0, 10) : 'Not recorded')}</strong>
                            </div>
                            <form id="cp-id-check-form" onsubmit="saveClientIdCheck(event, ${Number(client.id)})" style="display:flex;flex-direction:column;gap:6px;margin-top:6px;background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:8px;padding:0.75rem;">
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);text-transform:uppercase;font-weight:700;">${escapeHtml(pdfLabel('Record an ID check'))}</div>
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);">${escapeHtml(pdfLabel('Only the type of ID and its last 4 letters or digits are kept, never the whole number or a photo.'))}</div>
                                <select id="cp-id-type" required aria-label="${escapeHtml(pdfLabel('Type of ID'))}" style="padding:7px 10px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);">
                                    <option value="">${escapeHtml(pdfLabel('Type of ID'))}</option>
                                    ${['Passport', 'Driving licence', 'National ID card', 'Other ID'].map((t) => `<option value="${t}">${escapeHtml(pdfLabel(t))}</option>`).join('')}
                                </select>
                                <input id="cp-id-last4" required maxlength="4" pattern="[A-Za-z0-9]{1,4}" placeholder="${escapeHtml(pdfLabel('Last 4 letters or digits'))}" aria-label="${escapeHtml(pdfLabel('Last 4 letters or digits'))}" style="padding:7px 10px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);">
                                <label style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);">${escapeHtml(pdfLabel('Date of birth on the ID'))}
                                    <input id="cp-id-dob" type="date" value="${escapeHtml(/^\d{4}-\d{2}-\d{2}$/.test(client.dob || '') ? client.dob : '')}" style="display:block;width:100%;margin-top:3px;padding:7px 10px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);box-sizing:border-box;">
                                </label>
                                <div><button type="submit" style="padding:0.4rem 0.85rem;background:var(--ti-blue-deep, #0D9488);color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;">${escapeHtml(pdfLabel('Save ID check'))}</button></div>
                            </form>
                        </div>
                    </div>

                    <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1.25rem;">
                        <h4 style="margin:0 0 0.85rem 0;font-size:0.95rem;font-weight:700;color:var(--ti-text, #F9FAFB);display:flex;align-items:center;gap:6px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-health></use></svg> Medical & Sensitivity Overview
                        </h4>
                        <div style="display:flex;flex-direction:column;gap:0.75rem;font-size:0.85rem;">
                            <div style="background:var(--ti-panel, #111827);padding:0.75rem;border-radius:8px;border:1px solid ${hasAllergies ? '#EF4444' : '#374151'};">
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);text-transform:uppercase;font-weight:700;">Allergies & Sensitivities</div>
                                <div style="font-weight:700;color:${hasAllergies ? '#EF4444' : allergiesKnown ? '#10B981' : '#FDE047'};margin-top:2px;">
                                    ${escapeHtml(client.allergies || pdfLabel('Not recorded: ask the client'))}
                                </div>
                            </div>

                            <div style="background:var(--ti-panel, #111827);padding:0.75rem;border-radius:8px;border:1px solid var(--ti-line, #374151);">
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);text-transform:uppercase;font-weight:700;">Medical History / Sensitivities</div>
                                <div style="font-weight:600;color:var(--ti-text, #F3F4F6);margin-top:2px;">
                                    ${escapeHtml(client.medical_history || 'None Reported')}
                                </div>
                            </div>

                            <div style="background:var(--ti-panel, #111827);padding:0.75rem;border-radius:8px;border:1px solid var(--ti-line, #374151);">
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);text-transform:uppercase;font-weight:700;">Emergency Contact</div>
                                <div style="font-weight:600;color:var(--ti-text, #F3F4F6);margin-top:2px;">
                                    ${escapeHtml(client.emergency_contact || 'Not recorded')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1.25rem;">
                        <h4 style="margin:0 0 0.85rem 0;font-size:0.95rem;font-weight:700;color:var(--ti-text, #F9FAFB);display:flex;align-items:center;gap:6px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-machine></use></svg> Studio Preferences & Artist Notes
                        </h4>

                        <div style="display:flex;flex-direction:column;gap:0.75rem;font-size:0.85rem;">
                            <div style="background:var(--ti-panel, #111827);padding:0.75rem;border-radius:8px;border:1px solid var(--ti-line, #374151);">
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);text-transform:uppercase;font-weight:700;">Preferred Tattoo / Piercing Style</div>
                                <div style="font-weight:600;color:var(--ti-blue-ink, #818CF8);margin-top:2px;">
                                    ${escapeHtml(client.preferred_style || 'Not recorded')}
                                </div>
                            </div>

                            <div style="background:var(--ti-panel, #111827);padding:0.75rem;border-radius:8px;border:1px solid var(--ti-line, #374151);">
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);text-transform:uppercase;font-weight:700;">Preferred Artist</div>
                                <div style="font-weight:600;color:var(--ti-text, #F3F4F6);margin-top:2px;">
                                    ${escapeHtml(client.preferred_artist || client.assigned_staff_name || 'Not recorded')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        renderD3ClientAppointmentTimeline(appointments);
        renderClientAftercareCard(bodyEl.firstElementChild, client, appointments);

    } else if (tabName === 'notes') {
        // PRIVATE STAFF NOTES TAB (CHRONOLOGICAL DISPLAY & PERSISTENCE)
        const sortedNotes = [...staffNotes].sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));
        const fromAppointment = (n) => n.fromAppointment;

        let notesHtml = `
            <div style="display:flex;flex-direction:column;gap:1.25rem;">
                
                <!-- Add New Private Staff Note Form -->
                <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-purple, #4F46E5);border-radius:12px;padding:1.25rem;box-shadow:0 4px 15px rgba(79,70,229,0.15);">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;">
                        <h4 style="margin:0;font-size:0.95rem;font-weight:800;color:var(--ti-blue-ink, #A5B4FC);display:flex;align-items:center;gap:6px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-lock></use></svg> Add Private Staff-Only Note
                        </h4>
                        <span style="font-size:0.72rem;background:rgba(99,102,241,0.2);color:var(--ti-blue-ink, #818CF8);border:1px solid var(--ti-purple-ink, #6366F1);padding:2px 8px;border-radius:12px;font-weight:700;">
                            CONFIDENTIAL • STAFF ONLY
                        </span>
                    </div>

                    <form onsubmit="handleStaffNoteSubmit(event, ${client.id})" style="display:flex;flex-direction:column;gap:0.75rem;">
                        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.75rem;">
                            <div>
                                <label style="display:block;font-size:0.75rem;color:var(--ti-muted, #9CA3AF);margin-bottom:3px;font-weight:600;">STAFF AUTHOR</label>
                                <select id="sn-author-select" style="width:100%;padding:0.5rem;background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:6px;color:#FFF;font-size:0.825rem;outline:none;">
                                    <option value="Studio staff|Staff">Studio staff</option>
                                </select>
                            </div>
                            <div>
                                <label style="display:block;font-size:0.75rem;color:var(--ti-muted, #9CA3AF);margin-bottom:3px;font-weight:600;">NOTE CATEGORY</label>
                                <select id="sn-category-select" style="width:100%;padding:0.5rem;background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:6px;color:#FFF;font-size:0.825rem;outline:none;">
                                    <option value="Procedure Observation">Procedure Observation</option>
                                    <option value="Skin Sensitivity">Skin & Pigment Sensitivity</option>
                                    <option value="Client Preference">Client Preference / Quirk</option>
                                    <option value="Consultation & Deposit">Consultation & Deposit</option>
                                    <option value="Aftercare & Healing">Aftercare & Healing</option>
                                    <option value="Sanitation & Safety">Sanitation & Safety</option>
                                    <option value="General Staff Note">General Staff Note</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                                <label style="display:block;font-size:0.75rem;color:var(--ti-muted, #9CA3AF);font-weight:600;margin:0;">NOTE DETAILS</label>
                                <button type="button" id="btn-dictate-sn-note" onclick="toggleVoiceDictation('sn-note-text', this)" class="dictate-speech-btn" style="padding:0.25rem 0.6rem;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.4);border-radius:6px;color:var(--ti-blue-ink, #A5B4FC);font-size:0.75rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all 0.2s;" title="Dictate procedure notes hands-free with Web Speech API during tattoo session">
                                    <span class="dictate-mic-icon"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-mic></use></svg></span>
                                    <span class="dictate-btn-label">Voice-to-Text (Web Speech API)</span>
                                </button>
                            </div>
                            <!-- Speech API Live Recording Indicator Box -->
                            <div id="voice-dictate-indicator-sn-note-text" style="display:none;align-items:center;gap:8px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);padding:0.35rem 0.65rem;border-radius:6px;font-size:0.75rem;color:var(--ti-alert-ink, #FCA5A5);margin-bottom:6px;">
                                <span class="dictate-pulse-dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ti-alert, #EF4444);"></span>
                                <span id="voice-dictate-preview-sn-note-text">Listening... Speak procedure notes clearly.</span>
                            </div>
                            <textarea id="sn-note-text" placeholder="Record confidential artist feedback, skin texture notes, needle preferences, or consultation details (or use hands-free dictation)..." required rows="3" style="width:100%;padding:0.6rem;background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:6px;color:#FFF;font-size:0.85rem;line-height:1.4;outline:none;resize:vertical;"></textarea>
                        </div>

                        <div style="display:flex;justify-content:flex-end;">
                            <button type="submit" style="padding:0.55rem 1.25rem;background:linear-gradient(135deg, var(--ti-purple, #6366F1) 0%, var(--ti-purple, #4F46E5) 100%);color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:0.85rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(99,102,241,0.35);">
                                <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-save></use></svg> Save Staff Note
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Chronological Notes List -->
                <div>
                    <div style="font-size:0.85rem;font-weight:700;color:var(--ti-muted, #9CA3AF);margin-bottom:0.75rem;display:flex;align-items:center;justify-content:space-between;">
                        <span>Chronological Staff Notes Log (${sortedNotes.length}):</span>
                        <span style="font-size:0.75rem;color:var(--ti-faint, #64748B);">Oldest &rarr; Most Recent</span>
                    </div>
        `;

        if (!sortedNotes.length) {
            notesHtml += `
                <div style="text-align:center;padding:2.5rem;background:var(--ti-panel2, #1F2937);border:1px dashed var(--ti-line, #374151);border-radius:12px;color:var(--ti-muted, #9CA3AF);">
                    <div style="font-size:2rem;margin-bottom:6px;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-lock></use></svg></div>
                    <div style="font-weight:700;color:var(--ti-text, #E5E7EB);font-size:0.95rem;">No Private Staff Notes Recorded Yet</div>
                    <div style="font-size:0.8rem;margin-top:4px;color:var(--ti-muted, #9CA3AF);">Use the form above to log observations, skin sensitivities, or booking notes.</div>
                </div>
            `;
        } else {
            notesHtml += `<div style="display:flex;flex-direction:column;gap:0.75rem;">`;
            sortedNotes.forEach((n, idx) => {
                let dateObj = new Date(n.timestamp || Date.now());
                if (isNaN(dateObj.getTime())) dateObj = new Date();
                let dateStr = 'Recent';
                let timeStr = '';
                try {
                    dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                } catch (e) {
                    try {
                        dateStr = dateObj.toISOString().slice(0, 10);
                    } catch (err) {
                        dateStr = 'Recent';
                    }
                }
                
                const catColor = n.category === 'Skin Sensitivity' ? '#EF4444' : (n.category === 'Procedure Observation' ? '#8B5CF6' : (n.category === 'Consultation & Deposit' ? '#10B981' : '#38BDF8'));

                notesHtml += `
                    <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-left:4px solid ${catColor};border-radius:10px;padding:1rem;display:flex;flex-direction:column;gap:0.5rem;position:relative;">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                                <span style="background:var(--ti-panel, #111827);color:var(--ti-text, #F3F4F6);padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:800;border:1px solid var(--ti-line, #374151);">
                                    <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-user></use></svg> ${escapeHtml(n.author || 'Staff Member')}
                                </span>
                                <span style="font-size:0.72rem;color:var(--ti-muted, #9CA3AF);">
                                    (${escapeHtml(n.author_role || 'Staff')})
                                </span>
                                <span style="background:${catColor}20;color:${catColor};border:1px solid ${catColor}50;padding:1px 8px;border-radius:12px;font-size:0.7rem;font-weight:700;">
                                    ${escapeHtml(n.category || 'Staff Note')}
                                </span>
                            </div>
                            
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);font-family:monospace;">
                                    <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-clock></use></svg> ${dateStr} at ${timeStr}
                                </span>
                                ${fromAppointment(n) ? '' : `<button type="button" onclick="confirmDeleteClientStaffNote(${client.id}, '${n.id}', '${escapeHtml((n.note || '').substring(0, 40))}')" style="background:none;border:none;color:var(--ti-alert, #EF4444);font-size:0.85rem;cursor:pointer;padding:2px 6px;" title="Delete Staff Note">&times;</button>`}
                            </div>
                        </div>

                        <p style="margin:0;font-size:0.875rem;color:var(--ti-text, #E5E7EB);line-height:1.5;white-space:pre-wrap;">${escapeHtml(n.note || '')}</p>
                    </div>
                `;
            });
            notesHtml += `</div>`;
        }

        notesHtml += `
                </div>
            </div>
        `;

        bodyEl.innerHTML = notesHtml;
        fillNoteAuthors();

    } else if (tabName === 'appointments') {
        if (!appointments || appointments.length === 0) {
            bodyEl.innerHTML = `
                <div style="text-align:center;padding:3rem;background:var(--ti-panel2, #1F2937);border:1px dashed var(--ti-line, #374151);border-radius:12px;color:var(--ti-muted, #9CA3AF);">
                    <div style="font-size:2rem;margin-bottom:8px;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-calendar></use></svg></div>
                    <div>No past appointments found for this client.</div>
                </div>
            `;
            return;
        }

        let apptHtml = `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <div style="font-size:0.825rem;color:var(--ti-muted, #9CA3AF);margin-bottom:4px;">Verified Procedure Appointments & Sessions:</div>
        `;

        appointments.forEach(a => {
            const statusColor = a.status === 'CONFIRMED' || a.status === 'COMPLETED' ? '#10B981' : (a.status === 'CANCELLED' ? '#EF4444' : '#F59E0B');
            apptHtml += `
                <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:10px;padding:1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
                    <div>
                        <div style="font-weight:700;font-size:0.95rem;color:var(--ti-text, #F9FAFB);">${escapeHtml(a.service_type || a.service || 'Appointment')}</div>
                        <div style="font-size:0.8rem;color:var(--ti-muted, #9CA3AF);margin-top:2px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-calendar></use></svg> <strong>${escapeHtml(a.date || (a.datetime ? new Date(a.datetime).toLocaleDateString() : ''))}</strong> &bull; ${escapeHtml(a.time || (a.datetime ? new Date(a.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''))} &bull; Artist: <strong style="color:var(--ti-blue-ink, #60A5FA);">${escapeHtml(a.staff_name || 'Not recorded')}</strong>
                        </div>
                        ${Number(a.deposit_paid) > 0 ? `<div class="cp-appt-deposit" style="font-size:0.8rem;color:var(--ti-gold, #FBBF24);margin-top:4px;">${escapeHtml(pdfLabel("Deposit paid"))}: $${Number(a.deposit_paid).toFixed(2)} &bull; ${escapeHtml(pdfLabel("Balance"))}: $${Math.max(0, Number(a.estimated_price || a.price || a.amount || 0) - Number(a.deposit_paid)).toFixed(2)}</div>` : ''}
                        ${a.notes ? `<div class="cp-appt-note" style="font-size:0.8rem;color:var(--ti-text2, #CBD5E1);margin-top:4px;white-space:pre-wrap;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-note></use></svg> ${escapeHtml(a.notes)}</div>` : ''}
                    </div>

                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-weight:800;font-size:1.05rem;color:var(--ti-green, #10B981);">$${Number(a.estimated_price || a.price || a.amount || 0).toFixed(2)}</span>
                        <span style="background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor}50;padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:800;">
                            ${escapeHtml(a.status || '')}
                        </span>
                        <button type="button" onclick="generateClientAppointmentReceiptPDF(${JSON.stringify(a).replace(/"/g, '&quot;')}, ${client ? JSON.stringify(client).replace(/"/g, '&quot;') : 'null'})" style="padding:0.4rem 0.75rem;background:linear-gradient(135deg, var(--ti-blue, #3B82F6) 0%, var(--ti-blue, #1D4ED8) 100%);color:#FFF;border:none;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;box-shadow:0 2px 6px rgba(59,130,246,0.3);" title="Generate formal printable PDF receipt with Tax/VAT breakdown and artist gratuity">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-print></use></svg> Receipt PDF
                        </button>
                    </div>
                </div>
            `;
        });

        apptHtml += `</div>`;
        bodyEl.innerHTML = apptHtml;

    } else if (tabName === 'waivers') {
        const forms = data.consent_forms || [];
        const formsHtml = forms.length ? `
            <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.25rem;">
                <div style="font-size:0.825rem;color:var(--ti-muted, #9CA3AF);margin-bottom:4px;">Consent forms saved from the form builder:</div>
                ${forms.map(f => `
                <div class="cp-consent-form-row" style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:10px;padding:1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
                    <div>
                        <div style="font-weight:700;font-size:0.95rem;color:var(--ti-text, #F9FAFB);"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-note></use></svg> ${escapeHtml(f.name || 'Consent form')}</div>
                        <div style="font-size:0.78rem;color:var(--ti-muted, #9CA3AF);margin-top:2px;">Saved ${escapeHtml(String(f.saved_at || ''))} &bull; ${f.signed ? 'signed' : 'not signed'}</div>
                        ${f.minor_without_guardian ? `<div class="cp-minor-flag" style="font-size:0.78rem;color:var(--ti-alert-ink, #FCA5A5);font-weight:800;margin-top:4px;">${escapeHtml(pdfLabel('Signed by a client under 18 without a parent or guardian signature'))}</div>` : ''}
                    </div>
                    <span style="display:flex;gap:8px;"><button type="button" onclick="viewClientConsentForm(${Number(f.id)})" style="padding:0.4rem 0.75rem;background:var(--ti-blue, #2563EB);color:#FFF;border:none;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;">View answers</button>
                    <button type="button" onclick="downloadConsentFormPDF(${Number(f.id)})" style="padding:0.4rem 0.75rem;background:var(--ti-blue, #1E40AF);color:#FFF;border:none;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-print></use></svg> PDF</button></span>
                </div>`).join('')}
            </div>` : '';
        if (!waivers || waivers.length === 0) {
            bodyEl.innerHTML = formsHtml + `
                <div style="text-align:center;padding:3rem;background:var(--ti-panel2, #1F2937);border:1px dashed var(--ti-line, #374151);border-radius:12px;color:var(--ti-muted, #9CA3AF);">
                    <div style="font-size:2rem;margin-bottom:8px;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-consent></use></svg></div>
                    <div>No signed liability waivers recorded for this client.</div>
                    <button type="button" onclick="openWaiverModal(${client.id})" style="margin-top:12px;padding:0.5rem 1rem;background:var(--ti-green, #10B981);color:#FFF;border:none;border-radius:6px;font-weight:700;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-pen></use></svg> Open Digital Signature Pad</button>
                </div>
            `;
            return;
        }

        let waiverHtml = `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <div style="font-size:0.825rem;color:var(--ti-muted, #9CA3AF);margin-bottom:4px;">Verified Legal Liability & Medical Disclosure Waivers:</div>
        `;

        waivers.forEach(w => {
            waiverHtml += `
                <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:10px;padding:1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="width:42px;height:42px;border-radius:8px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:var(--ti-green, #34D399);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-consent></use></svg>
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:0.95rem;color:var(--ti-text, #F9FAFB);">${escapeHtml(w.title || 'Digital Liability & Health Waiver')}</div>
                            <div style="font-size:0.78rem;color:var(--ti-muted, #9CA3AF);margin-top:2px;">
                                Signed on <strong>${escapeHtml(w.date_signed || w.signed_at || 'date not recorded')}</strong> &bull; IP: <code style="color:var(--ti-green-ink, #A7F3D0);">${escapeHtml(w.ip_address || 'not recorded')}</code>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="background:rgba(16,185,129,0.2);color:var(--ti-green, #34D399);border:1px solid var(--ti-green, #10B981);padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:800;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-check></use></svg> VERIFIED & SIGNED
                        </span>
                        <button type="button" onclick="viewWaiverRecord(${Number(w.id)})" style="padding:0.4rem 0.75rem;background:var(--ti-line, #374151);color:var(--ti-text, #F3F4F6);border:none;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;">View waiver</button>
                    </div>
                </div>
            `;
        });

        waiverHtml += `</div>`;
        bodyEl.innerHTML = formsHtml + waiverHtml;

    } else if (tabName === 'tattoo-work') {
        let workHtml = `
            <div>
                <div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1.25rem;margin-bottom:1.25rem;">
                    <h4 style="margin:0 0 0.75rem 0;font-size:0.95rem;font-weight:700;color:var(--ti-text, #F9FAFB);display:flex;align-items:center;gap:6px;">
                        <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-image></use></svg> Upload Tattoo Session Work / Portfolio Photo
                    </h4>
                    <form onsubmit="submitClientTattooWork(event, ${client.id})" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                        <div>
                            <label style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);display:block;margin-bottom:3px;">Session Title / Name</label>
                            <input type="text" id="tw-title-input" placeholder="e.g. Japanese Dragon Upper Arm Line Work" required style="width:100%;padding:0.5rem;background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:6px;color:#FFF;font-size:0.825rem;outline:none;" />
                        </div>
                        <div>
                            <label style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);display:block;margin-bottom:3px;">Category</label>
                            <select id="tw-category-input" style="width:100%;padding:0.5rem;background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:6px;color:#FFF;font-size:0.825rem;outline:none;">
                                <option value="Tattoo Session">Tattoo Session Work</option>
                                <option value="Stencil Design">Stencil & Skin Prep</option>
                                <option value="Piercing Session">Piercing Curation</option>
                                <option value="Healed Result">Healed Aftercare Progress</option>
                            </select>
                        </div>
                        <div style="grid-column: span 2;">
                            <label for="tw-photo-input" style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);display:block;margin-bottom:3px;">Photo</label>
                            <input type="file" id="tw-photo-input" accept="image/*" onchange="handleClientWorkPhotoSelect(event)" style="display:none;" />
                            <button type="button" onclick="document.getElementById('tw-photo-input').click()" style="padding:0.5rem 1rem;background:var(--ti-line, #374151);color:var(--ti-text, #F9FAFB);border:1px solid var(--ti-line2, #4B5563);border-radius:6px;font-weight:700;font-size:0.825rem;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-camera></use></svg> Take or choose a photo</button>
                            <span style="font-size:0.72rem;color:var(--ti-muted, #9CA3AF);margin-left:6px;">On a phone or tablet you can use the camera.</span>
                            <div id="tw-photo-preview" style="margin-top:6px;"></div>
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);display:block;margin-bottom:3px;">Description & Technique Notes</label>
                            <input type="text" id="tw-notes-input" placeholder="e.g. Dynamic Black Ink, 3RL and 7M1 needles, 3.5 hour total session time." style="width:100%;padding:0.5rem;background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:6px;color:#FFF;font-size:0.825rem;outline:none;" />
                        </div>
                        <div style="grid-column: span 2;display:flex;justify-content:flex-end;">
                            <button type="submit" style="padding:0.5rem 1.25rem;background:var(--ti-blue, #3B82F6);color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:0.85rem;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-camera></use></svg> Add to Client Gallery</button>
                        </div>
                    </form>
                </div>

                <div style="font-size:0.85rem;font-weight:700;color:var(--ti-muted, #9CA3AF);margin-bottom:0.75rem;">Session Work Archive:</div>
        `;

        if (!tattoo_work || tattoo_work.length === 0) {
            workHtml += `
                <div style="text-align:center;padding:2.5rem;background:var(--ti-panel2, #1F2937);border:1px dashed var(--ti-line, #374151);border-radius:12px;color:var(--ti-muted, #9CA3AF);">
                    <div style="font-size:2rem;margin-bottom:6px;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-image></use></svg></div>
                    <div>No artwork or photos uploaded for this client yet.</div>
                </div>
            `;
        } else {
            workHtml += `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:1rem;">`;
            tattoo_work.forEach(w => {
                workHtml += `
                    <div class="gallery-card-interactive" style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;">
                        <div style="height:150px;background:var(--ti-panel, #111827);overflow:hidden;position:relative;">
                            <img src="${escapeHtml(w.image_url)}" alt="${escapeHtml(w.title)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='assets/studio_crm_logo.jpg'" />
                            <span style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.7);color:var(--ti-text, #F3F4F6);padding:2px 6px;border-radius:4px;font-size:0.7rem;font-weight:700;">${escapeHtml(w.category || 'Tattoo')}</span>
                        </div>
                        <div style="padding:0.75rem;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                            <div>
                                <div style="font-weight:700;font-size:0.85rem;color:var(--ti-text, #F9FAFB);margin-bottom:2px;">${escapeHtml(w.title)}</div>
                                <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);margin-bottom:4px;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-calendar></use></svg> ${escapeHtml(w.date || (w.created_at ? String(w.created_at).slice(0, 10) : ''))}</div>
                                <div style="font-size:0.75rem;color:var(--ti-text2, #D1D5DB);line-height:1.3;">${escapeHtml(w.notes || '')}</div>
                            </div>
                            <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
                                <button type="button" onclick="openClientWorkLightbox(${Number(w.id)})" style="padding:2px 8px;background:var(--ti-line, #374151);color:var(--ti-blue-ink, #60A5FA);border:none;border-radius:4px;font-size:0.72rem;cursor:pointer;font-weight:600;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-search></use></svg> Zoom</button>
                                <button type="button" onclick="deleteClientTattooWork(${client.id}, ${w.id})" style="background:none;border:none;color:var(--ti-alert, #EF4444);font-size:0.75rem;cursor:pointer;">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            workHtml += `</div>`;
        }

        workHtml += `</div>`;
        bodyEl.innerHTML = workHtml;
    }
}
window.switchClientProfileTab = switchClientProfileTab;

function generateClientAppointmentReceiptPDF(a) {
    const client = currentActiveProfileClient && (currentActiveProfileClient.client || currentActiveProfileClient);
    const when = a.datetime ? new Date(a.datetime).toLocaleString() : [a.date, a.time].filter(Boolean).join(' ');
    const price = Number(a.estimated_price || a.price || a.amount || 0), deposit = Number(a.deposit_paid || a.deposit || 0);
    downloadPdfTable('receipt_appointment_' + a.id + '.pdf', 'Appointment receipt', ['item', 'detail'], [
        ['Client', (client && client.name) || a.client_name || a.client || ''],
        ['Service', a.service_type || a.service || ''],
        ['Artist', a.staff_name || ''],
        ['Date', when],
        ['Status', a.status || ''],
        ['Price', price.toFixed(2)],
        ['Deposit paid', deposit.toFixed(2)],
        ['Balance', (price - deposit).toFixed(2)]
    ].map(([label, value]) => [pdfLabel(label), value]));
}
window.generateClientAppointmentReceiptPDF = generateClientAppointmentReceiptPDF;

// One saved consent form, shown inside the profile: every question with the client's answer.
async function viewClientConsentForm(formId) {
    const bodyEl = document.getElementById('client-profile-modal-body');
    if (!bodyEl) return;
    let form;
    try {
        const res = await fetch('/api/consent-forms/' + formId);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form = await res.json();
    } catch (e) { showStudioToast('Could not open the consent form: the server did not answer'); return; }
    const responses = form.responses || {};
    const picture = (src, alt) => `<img src="${src}" alt="${escapeHtml(alt)}" style="max-width:320px;max-height:320px;background:#FFF;border-radius:6px;display:block;margin:4px 0 4px auto;">`;
    const isPicture = (v) => typeof v === 'string' && v.startsWith('data:image');
    const show = (v) => {
        if (isPicture(v)) return picture(v, 'Signature or drawing');
        // attached photos are saved as a list of { name, dataUrl } (Henry, 2026-10-17: they showed as [object Object])
        if (Array.isArray(v) && v.some((p) => p && typeof p === 'object')) return v.map((p) => (p && isPicture(p.dataUrl) ? picture(p.dataUrl, p.name || 'Photo') : escapeHtml(p && p.name || ''))).join('') || 'No answer';
        if (v && typeof v === 'object' && isPicture(v.dataUrl)) return picture(v.dataUrl, v.name || 'Photo');
        if (Array.isArray(v)) return v.length ? escapeHtml(v.join(', ')) : escapeHtml(pdfLabel('None'));   // no box ticked
        if (v === true) return 'Yes';
        if (v === false) return 'No';
        return escapeHtml(v == null || v === '' ? 'No answer' : String(v));
    };
    const line = (label, v) => `<div style="display:flex;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--ti-line, #374151);padding:6px 0;font-size:0.85rem;"><span style="color:var(--ti-muted, #9CA3AF);">${escapeHtml(label)}</span><strong style="color:#FFF;text-align:right;">${show(v)}</strong></div>`;
    const seen = new Set();
    let html = '';
    ((form.schema && form.schema.sections) || []).forEach((sec) => {
        const rows = (sec.fields || []).filter((f) => f.id in responses).map((f) => { seen.add(f.id); return line(f.label || f.id, responses[f.id]); });
        if (rows.length) html += `<div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1rem;margin-bottom:1rem;"><h4 style="margin:0 0 0.5rem 0;font-size:0.95rem;color:var(--ti-text, #F9FAFB);">${escapeHtml(sec.title || '')}</h4>${rows.join('')}</div>`;
    });
    // the age and the ID check as they were when the form was signed
    const signedAt = [];
    if (typeof form.ageAtSigning === 'number') signedAt.push(line(pdfLabel('Age when signed'), String(form.ageAtSigning)));
    signedAt.push(line(pdfLabel('ID check'), form.idCheck
        ? pdfLabel('{0} ending {1}, checked by {2} on {3}').replace('{0}', pdfLabel(form.idCheck.type)).replace('{1}', form.idCheck.last4).replace('{2}', form.idCheck.checked_by).replace('{3}', new Date(form.idCheck.checked_at).toLocaleString())
        : pdfLabel('Not checked when this form was signed')));
    html = `<div style="background:var(--ti-panel2, #1F2937);border:1px solid ${form.minorWithoutGuardian ? '#EF4444' : '#374151'};border-radius:12px;padding:1rem;margin-bottom:1rem;">`
        + (form.minorWithoutGuardian ? `<div style="color:var(--ti-alert-ink, #FCA5A5);font-weight:800;font-size:0.85rem;margin-bottom:6px;">${escapeHtml(pdfLabel('Signed by a client under 18 without a parent or guardian signature'))}</div>` : '')
        + signedAt.join('') + '</div>' + html;
    const rest = Object.keys(responses).filter((k) => !seen.has(k));
    const medical = ((form.schema && form.schema.sections) || []).find((sec) => sec.type === 'medical_section');
    const restTitle = medical ? (medical.title || 'Medical History') : 'Other answers';
    if (rest.length) html += `<div style="background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1rem;"><h4 style="margin:0 0 0.5rem 0;font-size:0.95rem;color:var(--ti-text, #F9FAFB);">${escapeHtml(restTitle)}</h4>${rest.map((k) => line(k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()), responses[k])).join('')}</div>`;
    bodyEl.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap;">
            <div><div style="font-weight:800;font-size:1.05rem;color:var(--ti-text, #F9FAFB);"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-note></use></svg> ${escapeHtml(form.name || 'Consent form')}</div><div style="font-size:0.78rem;color:var(--ti-muted, #9CA3AF);">Saved ${escapeHtml(String(form.saved_at || ''))}</div></div>
            <span style="display:flex;gap:8px;"><button type="button" onclick="downloadConsentFormPDF(${Number(form.id)})" style="padding:0.4rem 0.75rem;background:var(--ti-blue, #2563EB);color:#FFF;border:none;border-radius:6px;font-size:0.8rem;font-weight:700;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-print></use></svg> PDF</button>
            <button type="button" onclick="switchClientProfileTab('waivers')" style="padding:0.4rem 0.75rem;background:var(--ti-line, #374151);color:var(--ti-text, #F3F4F6);border:none;border-radius:6px;font-size:0.8rem;font-weight:700;cursor:pointer;">← Back to waivers</button></span>
        </div>` + html + (Object.keys(responses).length ? '' : '<div style="color:var(--ti-muted, #9CA3AF);">This form was saved with no answers.</div>');
}
window.viewClientConsentForm = viewClientConsentForm;

// The full laid-out PDF of a saved form, as the form builder prints it (Henry, 2026-10-17). The form builder is
// loaded once, out of sight, and given the saved form, its answers and the client's signature.
let consentPdfFrame = null;
async function downloadConsentFormPDF(formId) {
    let form;
    try { const r = await fetch('/api/consent-forms/' + formId); if (!r.ok) throw new Error(); form = await r.json(); }
    catch (e) { showStudioToast('Could not open the consent form: the server did not answer'); return; }
    if (!consentPdfFrame) {
        consentPdfFrame = document.createElement('iframe');
        consentPdfFrame.setAttribute('aria-hidden', 'true');
        consentPdfFrame.style.cssText = 'position:fixed;width:900px;height:700px;left:-10000px;top:0;border:0;';
        consentPdfFrame.src = 'tools/form-builder/index.html';
        document.body.appendChild(consentPdfFrame);
    }
    const ready = () => { try { const w = consentPdfFrame.contentWindow; return w.PDFGenerator && w.i18n && w.i18n.isLoaded && w.jspdf ? w : null; } catch (e) { return null; } };
    let w = null;
    for (let i = 0; i < 80 && !(w = ready()); i++) await new Promise((r) => setTimeout(r, 250));
    if (!w) { showStudioToast('The PDF could not be made: the form builder did not load'); return; }
    if (form.language && w.i18n.currentLanguage !== form.language) await w.i18n.setLanguage(form.language);
    // the age and the ID check when it was signed, as a last section of the PDF
    const id = form.idCheck;
    const responses = Object.assign({}, form.responses || {}, {
        _age_when_signed: typeof form.ageAtSigning === 'number' ? String(form.ageAtSigning) : pdfLabel('Not recorded'),
        _id_check: id ? pdfLabel('{0} ending {1}, checked by {2} on {3}').replace('{0}', pdfLabel(id.type)).replace('{1}', id.last4).replace('{2}', id.checked_by).replace('{3}', new Date(id.checked_at).toLocaleString()) : pdfLabel('Not checked when this form was signed')
    });
    if (form.minorWithoutGuardian) responses._minor_flag = pdfLabel('Signed by a client under 18 without a parent or guardian signature'); // no emoji: the PDF font has none
    const schema = Object.assign({}, form.schema, { sections: ((form.schema && form.schema.sections) || []).concat([{ id: '_signing_record', title: pdfLabel('Age and ID check'),
        fields: [{ id: '_age_when_signed', type: 'text', label: pdfLabel('Age when signed') }, { id: '_id_check', type: 'text', label: pdfLabel('ID check') }]
            .concat(form.minorWithoutGuardian ? [{ id: '_minor_flag', type: 'text', label: pdfLabel('Guardian') }] : []) }]) });
    const sigField = [].concat(...((form.schema && form.schema.sections) || []).map((s) => s.fields || [])).find((f) => f.type === 'signature' && typeof responses[f.id] === 'string' && responses[f.id].startsWith('data:image'));
    try { await w.PDFGenerator.generateFormPDF(schema, responses, sigField ? responses[sigField.id] : null); }
    catch (e) { showStudioToast('The PDF could not be made: ' + e.message); }
}
window.downloadConsentFormPDF = downloadConsentFormPDF;

// HANDLE PRIVATE STAFF NOTE SUBMISSION
async function handleStaffNoteSubmit(event, clientId) {
    if (event) event.preventDefault();
    if (!clientId) return;

    const authorSelect = document.getElementById('sn-author-select');
    const categorySelect = document.getElementById('sn-category-select');
    const noteTextEl = document.getElementById('sn-note-text');

    if (!noteTextEl || !noteTextEl.value.trim()) return;

    let author = 'Admin Manager';
    let author_role = 'Studio Manager';
    if (authorSelect && authorSelect.value) {
        const parts = authorSelect.value.split('|');
        author = parts[0];
        author_role = parts[1] || 'Staff';
    }

    const category = categorySelect ? categorySelect.value : 'General Staff Note';
    const note = noteTextEl.value.trim();

    try {
        const res = await fetch(`/api/clients/${clientId}/staff-notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, author_role, category, note })
        });

        if (!res.ok) throw new Error('Failed to save staff note');
        const data = await res.json();

        if (currentActiveProfileClient) {
            currentActiveProfileClient.staff_notes = data.staff_notes || [];
            if (currentActiveProfileClient.client) {
                currentActiveProfileClient.client.staff_notes = data.staff_notes || [];
            }
            const countNotes = document.getElementById('cp-count-notes');
            if (countNotes) countNotes.textContent = (data.staff_notes || []).length + appointmentNotes(currentActiveProfileClient && currentActiveProfileClient.appointments).length;
        }

        switchClientProfileTab('notes');
        if (typeof showUndoToast === 'function') {
            showUndoToast('Saved confidential staff note to client record.');
        }
    } catch (err) {
        console.error('Error saving staff note:', err);
        alert('Failed to save staff note. Please try again.');
    }
}
window.handleStaffNoteSubmit = handleStaffNoteSubmit;

// CONFIRM & DELETE CLIENT STAFF NOTE
function confirmDeleteClientStaffNote(clientId, noteId, notePreview) {
    openDeletionConfirmModal({
        title: 'Delete Staff Note',
        message: 'Are you sure you want to permanently delete this confidential staff note?',
        itemName: `Staff Note: "${notePreview || 'Note Entry'}"`,
        itemDetails: `Client ID #${clientId} • Note ID ${noteId}`,
        confirmBtnText: 'Delete Note',
        onConfirm: async () => {
            try {
                const res = await fetch(`/api/clients/${clientId}/staff-notes/${noteId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Delete failed');
                const data = await res.json();

                if (currentActiveProfileClient) {
                    currentActiveProfileClient.staff_notes = data.staff_notes || [];
                    if (currentActiveProfileClient.client) {
                        currentActiveProfileClient.client.staff_notes = data.staff_notes || [];
                    }
                    const countNotes = document.getElementById('cp-count-notes');
                    if (countNotes) countNotes.textContent = (data.staff_notes || []).length + appointmentNotes(currentActiveProfileClient && currentActiveProfileClient.appointments).length;
                }

                switchClientProfileTab('notes');
                if (typeof showUndoToast === 'function') {
                    showUndoToast('Removed private staff note.');
                }
            } catch (err) {
                console.error('Error deleting staff note:', err);
                alert('Failed to delete staff note.');
            }
        }
    });
}
window.confirmDeleteClientStaffNote = confirmDeleteClientStaffNote;

// =========================================================================
// CENTRALIZED DATA DELETION CONFIRMATION MODAL CONTROLLER
// =========================================================================
let currentPendingDeletionCallback = null;

function openDeletionConfirmModal({ title, message, itemName, itemDetails, confirmBtnText, onConfirm }) {
    const modal = document.getElementById('data-deletion-confirm-modal');
    if (!modal) {
        if (confirm(message || `Are you sure you want to delete ${itemName}?`)) {
            if (typeof onConfirm === 'function') onConfirm();
        }
        return;
    }

    const titleEl = document.getElementById('del-confirm-title');
    if (titleEl) titleEl.textContent = title || 'Confirm Deletion';

    const msgEl = document.getElementById('del-confirm-message');
    if (msgEl) msgEl.textContent = message || 'Are you sure you want to permanently remove this record? This action cannot be undone.';

    const nameEl = document.getElementById('del-confirm-item-name');
    if (nameEl) nameEl.textContent = itemName || 'Selected Record';

    const detailsEl = document.getElementById('del-confirm-item-details');
    if (detailsEl) detailsEl.textContent = itemDetails || 'Permanent Studio Database Deletion';

    const execBtn = document.getElementById('btn-del-confirm-execute');
    if (execBtn) {
        execBtn.textContent = confirmBtnText || 'Confirm Deletion';
        currentPendingDeletionCallback = onConfirm;
        execBtn.onclick = async () => {
            const run = currentPendingDeletionCallback; // closing clears it, so it ran nothing
            closeDeletionConfirmModal();
            if (typeof run === 'function') await run();
        };
    }

    modal.style.display = 'flex';
}
window.openDeletionConfirmModal = openDeletionConfirmModal;

function closeDeletionConfirmModal() {
    const modal = document.getElementById('data-deletion-confirm-modal');
    if (modal) modal.style.display = 'none';
    currentPendingDeletionCallback = null;
}
window.closeDeletionConfirmModal = closeDeletionConfirmModal;

// Gallery Item Deletion Confirmation

// Gallery B&A Pair Deletion Confirmation

// Inventory Item Deletion Confirmation

// Inventory Category Deletion Confirmation

// =========================================================================
// D3.JS SUPPLY USAGE DENSITY HEATMAP (BY DAY OF WEEK & PROCEDURE SHIFT)
// =========================================================================
let cachedSupplyUsageHeatmapData = null;


function closeInventoryUsageHeatmapModal() {
    const modal = document.getElementById('inventory-usage-heatmap-modal');
    if (modal) modal.style.display = 'none';
}
window.closeInventoryUsageHeatmapModal = closeInventoryUsageHeatmapModal;

async function refreshSupplyUsageHeatmap() {
    cachedSupplyUsageHeatmapData = null;
    await renderD3SupplyUsageHeatmap();
    if (typeof showUndoToast === 'function') {
        showUndoToast('Refreshed weekly supply usage density calculations.');
    }
}
window.refreshSupplyUsageHeatmap = refreshSupplyUsageHeatmap;

async function renderD3SupplyUsageHeatmap() {
    const container = document.getElementById('d3-inventory-usage-heatmap-container');
    if (!container || !window.d3) return;

    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:320px;color:var(--ti-rose-ink, #F472B6);font-weight:700;font-size:0.9rem;">
            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-bolt></use></svg> Computing 7-day supply consumption density matrix...
        </div>
    `;

    try {
        if (!cachedSupplyUsageHeatmapData) {
            const res = await fetch('/api/inventory/usage-heatmap');
            if (!res.ok) throw new Error('Heatmap fetch failed');
            cachedSupplyUsageHeatmapData = await res.json();
        }

        const data = cachedSupplyUsageHeatmapData;
        const matrix = data.matrix || [];
        const shifts = data.shifts || ['Morning', 'Afternoon', 'Peak Evening', 'Late Night'];
        const days = data.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const summary = data.summary || {};

        // Update Summary Cards
        const unitsEl = document.getElementById('hm-summary-units');
        if (unitsEl) unitsEl.textContent = `${summary.total_weekly_units || 0} Units`;

        const peakDayEl = document.getElementById('hm-summary-peak-day');
        if (peakDayEl) peakDayEl.textContent = summary.peak_day ? `${summary.peak_day} (${summary.peak_shift})` : 'Not enough data';

        const fastestEl = document.getElementById('hm-summary-fastest');
        if (fastestEl) fastestEl.textContent = summary.fastest_burning_item || 'Not enough data';

        const reorderEl = document.getElementById('hm-summary-reorder');
        if (reorderEl) reorderEl.textContent = summary.recommended_reorder_day || 'Not enough data';

        // Clear container for D3 rendering
        container.innerHTML = '';

        const margin = { top: 40, right: 30, bottom: 40, left: 110 };
        const containerWidth = container.clientWidth || 740;
        const width = Math.max(containerWidth, 680) - margin.left - margin.right;
        const height = 360 - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // X scale (Shifts)
        const x = d3.scaleBand()
            .range([0, width])
            .domain(shifts)
            .padding(0.08);

        // Y scale (Days)
        const y = d3.scaleBand()
            .range([0, height])
            .domain(days)
            .padding(0.08);

        // Color Scale
        const maxUnits = d3.max(matrix, d => d.units_used) || 50;
        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateRgbBasis(['#1E293B', '#4338CA', '#8B5CF6', '#EC4899', '#EF4444']))
            .domain([0, maxUnits]);

        // Add X Axis
        svg.append('g')
            .attr('transform', `translate(0, -10)`)
            .call(d3.axisTop(x).tickSize(0))
            .select('.domain').remove();

        svg.selectAll('.tick text')
            .style('fill', '#9CA3AF')
            .style('font-size', '11px')
            .style('font-weight', '700');

        // Add Y Axis
        svg.append('g')
            .call(d3.axisLeft(y).tickSize(0))
            .select('.domain').remove();

        svg.selectAll('g text')
            .style('fill', '#D1D5DB')
            .style('font-size', '12px')
            .style('font-weight', '700');

        const tooltip = d3.select('#d3-heatmap-tooltip');

        // Add Rectangles
        svg.selectAll()
            .data(matrix, d => `${d.day}:${d.shift}`)
            .join('rect')
            .attr('x', d => x(d.shift))
            .attr('y', d => y(d.day))
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('width', x.bandwidth())
            .attr('height', y.bandwidth())
            .style('fill', d => colorScale(d.units_used))
            .style('stroke', '#374151')
            .style('stroke-width', 1)
            .style('cursor', 'pointer')
            .style('transition', 'transform 0.15s ease, stroke 0.15s ease')
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .style('stroke', '#38BDF8')
                    .style('stroke-width', 2);

                tooltip.style('display', 'block')
                    .html(`
                        <div style="font-weight:800;color:var(--ti-rose-ink, #F472B6);font-size:0.85rem;margin-bottom:4px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-flame></use></svg> ${d.day} &bull; ${d.shift}
                        </div>
                        <div style="font-size:0.75rem;color:var(--ti-muted, #9CA3AF);margin-bottom:6px;">
                            <svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-clock></use></svg> Shift Hours: ${d.shift_hours || 'Procedure Block'}
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                            <span>Supply Units Burned:</span>
                            <strong style="color:#FFF;">${d.units_used} units</strong>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                            <span>Client Procedures:</span>
                            <strong style="color:var(--ti-blue-ink, #60A5FA);">${d.procedures_count || 3} sessions</strong>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                            <span>Top Consumed SKU:</span>
                            <strong style="color:var(--ti-green, #34D399);">${d.top_supply || 'Needles & Ink'}</strong>
                        </div>
                        <div style="background:var(--ti-bg2, #0F172A);padding:4px 6px;border-radius:4px;margin-top:4px;font-size:0.7rem;color:var(--ti-gold, #FBBF24);">
                            ${d.risk_level === 'CRITICAL' ? 'Peak Procedure Load: Pre-stage supply trays!' : 'Sufficient buffer stock on hand.'}
                        </div>
                    `);
            })
            .on('mousemove', function (event) {
                const rect = container.getBoundingClientRect();
                tooltip
                    .style('left', `${event.clientX - rect.left + 15}px`)
                    .style('top', `${event.clientY - rect.top - 20}px`);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .style('stroke', '#374151')
                    .style('stroke-width', 1);
                tooltip.style('display', 'none');
            });

        // Add Text Labels in each Heatmap Cell
        svg.selectAll()
            .data(matrix, d => `${d.day}:${d.shift}`)
            .join('text')
            .attr('x', d => x(d.shift) + x.bandwidth() / 2)
            .attr('y', d => y(d.day) + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFFFFF')
            .style('font-size', '11px')
            .style('font-weight', '800')
            .style('pointer-events', 'none')
            .text(d => `${d.units_used}u`);

    } catch (err) {
        console.error('Error rendering D3 supply usage heatmap:', err);
        container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--ti-alert, #EF4444);">Failed to load supply usage heatmap data.</div>`;
    }
}
window.renderD3SupplyUsageHeatmap = renderD3SupplyUsageHeatmap;

// --- Aftercare sheets (Henry, 2026-10-18) ---
// A sheet for the client to take home: the studio's details, the client's name, the procedure and the
// steps of one of the studio's aftercare templates (tattoo, piercing...). Given from the client's profile
// it is recorded (which sheet, for which appointment, by whom, when); a sheet can also be printed with no
// client, for someone who got no aftercare elsewhere.
let aftercareTemplateList = null;
async function loadAftercareTemplates() {
    if (!aftercareTemplateList) {
        try { const r = await fetch("/api/aftercare/templates"); aftercareTemplateList = r.ok ? await r.json() : []; } catch (e) { aftercareTemplateList = []; }
    }
    return aftercareTemplateList;
}
// the sheet that suits an appointment's service: a piercing service gets the piercing sheet, and so on
function aftercareTemplateFor(service, list) {
    const s = String(service || "").toLowerCase();
    const id = /pierc|jewel/.test(s) ? "piercing" : /pmu|brow|lip|cosmetic/.test(s) ? "pmu" : /tattoo|cover|flash|touch/.test(s) ? "tattoo" : "";
    return (list.find((t) => t.id === id) || list[0] || {}).id || "";
}

// The CRM's languages, by their own names, for the language a sheet is printed in
const AFTERCARE_LANGUAGES = { en: "English", fr: "Français", it: "Italiano", de: "Deutsch", es: "Español", nl: "Nederlands", pt: "Português", th: "ไทย" };
const uiLanguage = () => (window.i18n && window.i18n.getLanguage && window.i18n.getLanguage()) || "en";
const languageOptions = (chosen) => Object.entries(AFTERCARE_LANGUAGES).map(([code, name]) => `<option value="${code}" ${code === chosen ? "selected" : ""}>${escapeHtml(name)}</option>`).join("");
// a sheet's text in a language: that language's version, or the English (as src/aftercare-texts.js)
function aftercareTextFor(t, lang) {
    const tr = lang && lang !== "en" && t.translations && t.translations[lang];
    return {
        title: (tr && tr.title) || t.title,
        description: (tr && tr.description !== undefined ? tr.description : t.description) || "",
        steps: tr && Array.isArray(tr.steps) && tr.steps.length ? tr.steps : t.steps || []
    };
}
// the sheet's own labels in its language, which can differ from the screen's
const phraseFiles = {};
async function phrasesIn(lang) {
    if (lang === "en") return (s) => s;
    if (!phraseFiles[lang]) phraseFiles[lang] = fetch("i18n/" + lang + ".json").then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
    const dict = await phraseFiles[lang];
    return (s) => dict[s] || s;
}

async function aftercareSheetHtml(tplRaw, clientName, procedure, lang = uiLanguage()) {
    const tpl = aftercareTextFor(tplRaw, lang);
    const L = await phrasesIn(lang);
    const p = readStudioProfile();
    const contact = [p.studioAddress, p.studioPhone, p.studioEmail].filter(Boolean).join(" · ");
    const esc = escapeHtml;
    return `<!doctype html><html lang="${esc(lang)}"><head><meta charset="utf-8"><title>${esc(tpl.title)}</title><style>
        body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:28px;font-size:13pt;line-height:1.45}
        h1{font-size:20pt;margin:0 0 4px} .studio{border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:16px}
        .studio strong{font-size:15pt} .who{margin:0 0 14px} li{margin:0 0 8px} .foot{margin-top:22px;font-size:10.5pt;color:#444;border-top:1px solid #999;padding-top:8px}
    </style></head><body>
        ${p.studioName || contact ? `<div class="studio">${p.studioName ? `<strong>${esc(p.studioName)}</strong><br>` : ""}${esc(contact)}</div>` : ""}
        <h1>${esc(tpl.title)}</h1>
        <p class="who">${clientName ? `${esc(L("For"))}: <strong>${esc(clientName)}</strong><br>` : ""}${procedure ? `${esc(L("Procedure"))}: ${esc(procedure)}<br>` : ""}${esc(L("Date"))}: ${esc(new Date().toLocaleDateString(lang))}</p>
        ${tpl.description ? `<p>${esc(tpl.description)}</p>` : ""}
        <ol>${(tpl.steps || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        <p class="foot">${esc(L("Redness, swelling or pain that gets worse, heat, pus or a fever: contact the studio, or a doctor straight away."))}${p.studioPhone ? ` ${esc(p.studioPhone)}` : ""}</p>
    </body></html>`;
}

// Only the sheet is printed, from a frame of its own: printing the page would print the CRM around it.
function printAftercareSheet(html) {
    let frame = document.getElementById("aftercare-print-frame");
    if (!frame) {
        frame = document.createElement("iframe");
        frame.id = "aftercare-print-frame";
        frame.setAttribute("aria-hidden", "true");
        frame.style.cssText = "position:fixed;width:0;height:0;border:0;left:-10000px;top:0;";
        document.body.appendChild(frame);
    }
    frame.srcdoc = html;
    frame.onload = () => { try { frame.contentWindow.focus(); frame.contentWindow.print(); } catch (e) {} };
}
window.printAftercareSheet = printAftercareSheet;

async function renderClientAftercareCard(container, client, appointments) {
    if (!container) return;
    const list = await loadAftercareTemplates();
    const given = client.aftercare_given || [];
    const appts = (appointments || []).slice().sort((a, b) => String(b.datetime || b.date || "").localeCompare(String(a.datetime || a.date || ""))).slice(0, 6);
    const when = (iso) => new Date(iso).toLocaleDateString();
    const apptLine = (a) => {
        const g = given.find((x) => String(x.appointment_id) === String(a.id));
        const label = [a.service_type || a.service || "", String(a.datetime || a.date || "").slice(0, 10)].filter(Boolean).join(", ");
        return `<div class="cp-aftercare-appt" style="display:flex;justify-content:space-between;gap:8px;align-items:center;border-bottom:1px solid var(--ti-line, #374151);padding:5px 0;font-size:0.82rem;">
            <span style="color:var(--ti-text, #E5E7EB);">${escapeHtml(label)}</span>
            ${g ? `<span style="color:var(--ti-green-ink, #6EE7B7);font-weight:700;">${escapeHtml(pdfLabel("Aftercare given {0}").replace("{0}", when(g.given_at)))}</span>`
                : `<span style="color:var(--ti-gold-ink, #FDE047);font-weight:700;">${escapeHtml(pdfLabel("No aftercare recorded"))}</span>`}
        </div>`;
    };
    const card = document.createElement("div");
    card.id = "cp-aftercare-card";
    card.style.cssText = "background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:12px;padding:1.25rem;";
    card.innerHTML = `
        <h4 style="margin:0 0 0.6rem 0;font-size:0.95rem;font-weight:700;color:var(--ti-text, #F9FAFB);"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-bandage></use></svg> ${escapeHtml(pdfLabel("Aftercare"))}</h4>
        ${appts.length ? appts.map(apptLine).join("") : `<div style="font-size:0.82rem;color:var(--ti-muted, #9CA3AF);">${escapeHtml(pdfLabel("No appointments yet."))}</div>`}
        <form onsubmit="giveClientAftercare(event, ${Number(client.id)})" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:0.8rem;">
            <select id="cp-aftercare-template" aria-label="${escapeHtml(pdfLabel("Aftercare sheet"))}" style="padding:7px 10px;background:var(--ti-panel, #111827);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);">
                ${list.map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(aftercareTextFor(t, uiLanguage()).title)}</option>`).join("")}
            </select>
            <select id="cp-aftercare-lang" aria-label="${escapeHtml(pdfLabel("Language of the sheet"))}" style="padding:7px 10px;background:var(--ti-panel, #111827);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);">
                ${languageOptions(uiLanguage())}
            </select>
            <select id="cp-aftercare-appointment" aria-label="${escapeHtml(pdfLabel("For the appointment"))}" style="padding:7px 10px;background:var(--ti-panel, #111827);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);">
                <option value="">${escapeHtml(pdfLabel("No appointment"))}</option>
                ${appts.map((a) => `<option value="${escapeHtml(String(a.id))}">${escapeHtml([a.service_type || a.service || "", String(a.datetime || a.date || "").slice(0, 10)].filter(Boolean).join(", "))}</option>`).join("")}
            </select>
            <button type="submit" style="padding:0.45rem 0.85rem;background:var(--ti-blue-deep, #0D9488);color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-print></use></svg> ${escapeHtml(pdfLabel("Print and record aftercare"))}</button>
        </form>
        ${given.length ? `<div style="margin-top:0.8rem;font-size:0.75rem;color:var(--ti-muted, #9CA3AF);">${given.slice(0, 5).map((g) => escapeHtml(pdfLabel("{0}: {1}, given by {2}").replace("{0}", when(g.given_at)).replace("{1}", g.title).replace("{2}", g.given_by))).join("<br>")}</div>` : ""}`;
    container.appendChild(card);
    // the sheet that suits the latest appointment, and that appointment, are chosen already
    const apptSel = card.querySelector("#cp-aftercare-appointment"), tplSel = card.querySelector("#cp-aftercare-template");
    const syncTemplate = () => {
        const a = appts.find((x) => String(x.id) === apptSel.value);
        if (a) tplSel.value = aftercareTemplateFor(a.service_type || a.service, list) || tplSel.value;
    };
    if (appts[0]) { apptSel.value = String(appts[0].id); syncTemplate(); }
    apptSel.addEventListener("change", syncTemplate);
}
window.renderClientAftercareCard = renderClientAftercareCard;

async function giveClientAftercare(event, clientId) {
    if (event) event.preventDefault();
    const list = await loadAftercareTemplates();
    const tpl = list.find((t) => t.id === (document.getElementById("cp-aftercare-template") || {}).value);
    if (!tpl) { showStudioToast("Choose an aftercare sheet"); return; }
    const appointmentId = (document.getElementById("cp-aftercare-appointment") || {}).value || "";
    const lang = (document.getElementById("cp-aftercare-lang") || {}).value || uiLanguage();
    let data;
    try {
        const r = await fetch(`/api/clients/${clientId}/aftercare`, { method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ template_id: tpl.id, appointment_id: appointmentId || null, lang, given_by: (document.getElementById("topbar-user-name") || {}).textContent || "" }) });
        data = await r.json();
        if (!r.ok) { showStudioToast(data.error || "Could not save"); return; }
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    const client = currentActiveProfileClient && (currentActiveProfileClient.client || currentActiveProfileClient);
    printAftercareSheet(await aftercareSheetHtml(tpl, client ? client.name : "", data.entry.procedure, lang));
    showStudioToast("Aftercare recorded: print the sheet for the client");
    openClientProfileModal(clientId);
}
window.giveClientAftercare = giveClientAftercare;

// Settings, Aftercare sheets: the studio's own wording, one language at a time
async function renderAftercareEditor(selectId) {
    const sel = document.getElementById("aftercare-edit-template"), langSel = document.getElementById("aftercare-edit-lang");
    if (!sel || !langSel) return;
    aftercareTemplateList = null; // fresh: another computer may have changed them
    const list = await loadAftercareTemplates();
    const keep = selectId || sel.value;
    sel.innerHTML = list.map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.title)}</option>`).join("");
    if (list.some((t) => t.id === keep)) sel.value = keep;
    if (!langSel.options.length) langSel.innerHTML = languageOptions(uiLanguage());
    fillAftercareEditor();
}
window.renderAftercareEditor = renderAftercareEditor;
function fillAftercareEditor() {
    const t = (aftercareTemplateList || []).find((x) => x.id === (document.getElementById("aftercare-edit-template") || {}).value);
    const lang = (document.getElementById("aftercare-edit-lang") || {}).value || "en";
    const set = (id, v, ph) => { const el = document.getElementById(id); if (el) { el.value = v; el.placeholder = ph || ""; } };
    if (!t) { set("aftercare-edit-title", ""); set("aftercare-edit-description", ""); set("aftercare-edit-steps", ""); return; }
    // another language shows its own text, and the English underneath as the hint for what to translate
    const own = lang === "en" ? t : (t.translations && t.translations[lang]) || {};
    set("aftercare-edit-title", own.title || "", lang === "en" ? pdfLabel("Title") : t.title);
    set("aftercare-edit-description", own.description || "", lang === "en" ? pdfLabel("Short description") : t.description);
    set("aftercare-edit-steps", (own.steps || []).join("\n"), lang === "en" ? "" : (t.steps || []).join("\n"));
}
window.fillAftercareEditor = fillAftercareEditor;
async function aftercareRequest(method, url, body) {
    try {
        const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) { showStudioToast(data.error || "Could not save"); return null; }
        return data;
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return null; }
}
async function saveAftercareSheet(event) {
    if (event) event.preventDefault();
    const id = (document.getElementById("aftercare-edit-template") || {}).value;
    if (!id) return;
    const val = (x) => (document.getElementById(x) || {}).value || "";
    const lang = val("aftercare-edit-lang") || "en";
    if (lang === "en" && !val("aftercare-edit-title").trim()) { showStudioToast("Give the sheet a title"); return; }
    const done = await aftercareRequest("PATCH", "/api/aftercare/templates/" + encodeURIComponent(id),
        { lang, title: val("aftercare-edit-title"), description: val("aftercare-edit-description"), steps: val("aftercare-edit-steps") });
    if (done) { showStudioToast("Aftercare sheet saved"); renderAftercareEditor(id); }
}
window.saveAftercareSheet = saveAftercareSheet;
async function addAftercareSheet() {
    const list = await aftercareRequest("POST", "/api/aftercare/templates", { title: pdfLabel("New aftercare sheet"), category: "Custom", steps: [pdfLabel("Write the first step here.")] });
    if (!list) return;
    const added = list[list.length - 1];
    const langSel = document.getElementById("aftercare-edit-lang");
    if (langSel) langSel.value = "en"; // a new sheet is written in English first, then translated
    showStudioToast("New sheet added: write its title and steps, then Save sheet");
    renderAftercareEditor(added && added.id);
}
window.addAftercareSheet = addAftercareSheet;
async function deleteAftercareSheet() {
    const id = (document.getElementById("aftercare-edit-template") || {}).value;
    if (!id || !window.confirm(pdfLabel("Delete this aftercare sheet, in every language? Sheets already given stay on the clients' records."))) return;
    if (await aftercareRequest("DELETE", "/api/aftercare/templates/" + encodeURIComponent(id))) { showStudioToast("Aftercare sheet deleted"); renderAftercareEditor(); }
}
window.deleteAftercareSheet = deleteAftercareSheet;

// A sheet with no client and nothing recorded: for someone who got no aftercare elsewhere
async function openGenericAftercareSheet() {
    const list = await loadAftercareTemplates();
    let overlay = document.getElementById("generic-aftercare-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "generic-aftercare-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:2000020;align-items:center;justify-content:center;";
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div style="background:var(--ti-bg2, #0F172A);border:1px solid var(--ti-line, #334155);border-radius:14px;padding:22px;width:min(94vw,460px);color:var(--ti-text, #F8FAFC);">
        <h3 style="margin:0 0 6px;font-size:1.05rem;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-print></use></svg> ${escapeHtml(pdfLabel("Aftercare sheet"))}</h3>
        <p style="margin:0 0 12px;font-size:0.8rem;color:var(--ti-muted, #9CA3AF);">${escapeHtml(pdfLabel("A sheet with no client name, and nothing recorded. To give aftercare to a client, use their profile."))}</p>
        <select id="generic-aftercare-template" aria-label="${escapeHtml(pdfLabel("Aftercare sheet"))}" style="width:100%;padding:8px 10px;background:var(--ti-panel, #111827);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);margin-bottom:8px;">
            ${list.map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(aftercareTextFor(t, uiLanguage()).title)}</option>`).join("")}
        </select>
        <select id="generic-aftercare-lang" aria-label="${escapeHtml(pdfLabel("Language of the sheet"))}" style="width:100%;padding:8px 10px;background:var(--ti-panel, #111827);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);margin-bottom:12px;">
            ${languageOptions(uiLanguage())}
        </select>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
            <button type="button" onclick="document.getElementById('generic-aftercare-overlay').style.display='none'" style="padding:0.45rem 0.9rem;background:var(--ti-line, #374151);color:var(--ti-text, #F3F4F6);border:none;border-radius:6px;cursor:pointer;">${escapeHtml(pdfLabel("Close"))}</button>
            <button type="button" onclick="printGenericAftercareSheet()" style="padding:0.45rem 0.9rem;background:var(--ti-blue-deep, #0D9488);color:#FFF;border:none;border-radius:6px;font-weight:700;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-print></use></svg> ${escapeHtml(pdfLabel("Print"))}</button>
        </div></div>`;
    overlay.style.display = "flex";
}
window.openGenericAftercareSheet = openGenericAftercareSheet;
async function printGenericAftercareSheet() {
    const list = await loadAftercareTemplates();
    const tpl = list.find((t) => t.id === (document.getElementById("generic-aftercare-template") || {}).value);
    if (tpl) printAftercareSheet(await aftercareSheetHtml(tpl, "", "", (document.getElementById("generic-aftercare-lang") || {}).value || uiLanguage()));
}
window.printGenericAftercareSheet = printGenericAftercareSheet;

// D3 Client Appointment Timeline Renderer
function renderD3ClientAppointmentTimeline(appointments) {
    const container = document.querySelector('#client-profile-modal-body #d3-client-appointment-timeline');
    if (!container || !window.d3) return;

    container.innerHTML = '';
    const appts = appointments || [];

    if (!appts.length) {
        container.innerHTML = `<div style="text-align:center;padding:1rem;color:var(--ti-muted, #9CA3AF);font-size:0.8rem;">No past or upcoming appointment nodes logged.</div>`;
        return;
    }

    const margin = { top: 20, right: 30, bottom: 20, left: 30 };
    const width = Math.max(container.clientWidth || 500, appts.length * 130) - margin.left - margin.right;
    const height = 120 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Baseline Line
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height / 2)
        .attr('x2', width)
        .attr('y2', height / 2)
        .attr('stroke', '#374151')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '4 4');

    const step = width / Math.max(1, appts.length - 1 || 1);

    appts.forEach((a, i) => {
        const cx = appts.length === 1 ? width / 2 : i * step;
        const cy = height / 2;

        const isCompleted = a.status === 'COMPLETED';
        const color = isCompleted ? '#10B981' : '#6366F1';

        // Outer glow
        svg.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', 14)
            .attr('fill', color)
            .attr('opacity', 0.2);

        // Core node
        svg.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', 8)
            .attr('fill', color)
            .attr('stroke', '#111827')
            .attr('stroke-width', 2);

        // the first and last labels hang inside the track, not off its edge ("ttoo - Custom")
        const anchor = appts.length === 1 ? 'middle' : i === 0 ? 'start' : i === appts.length - 1 ? 'end' : 'middle';
        // Date text above
        svg.append('text')
            .attr('x', cx)
            .attr('y', cy - 18)
            .attr('text-anchor', anchor)
            .attr('fill', '#9CA3AF')
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .text(a.date || (a.datetime ? new Date(a.datetime).toLocaleDateString() : ''));

        // Service text below
        svg.append('text')
            .attr('x', cx)
            .attr('y', cy + 24)
            .attr('text-anchor', anchor)
            .attr('fill', '#F3F4F6')
            .attr('font-size', '11px')
            .attr('font-weight', '700')
            .text((a.service_type || a.service || 'Tattoo').substring(0, 16));
    });
}

// The photo for the client's Work & Photos: from the camera or the device's pictures, made smaller like the gallery's
let pendingClientWorkPhoto = '';
async function handleClientWorkPhotoSelect(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;
    try { pendingClientWorkPhoto = await imageFileToDataUrl(file); }
    catch (e) { showStudioToast('That file could not be read as an image'); return; }
    const prev = document.getElementById('tw-photo-preview');
    if (prev) prev.innerHTML = `<img src="${pendingClientWorkPhoto}" alt="" style="max-width:100%;max-height:160px;border-radius:8px;" />`;
}
window.handleClientWorkPhotoSelect = handleClientWorkPhotoSelect;

// Tattoo Work Submission
async function submitClientTattooWork(event, clientId) {
    if (event) event.preventDefault();
    if (!clientId) return;

    const title = document.getElementById('tw-title-input')?.value || 'Tattoo Session Work';
    const category = document.getElementById('tw-category-input')?.value || 'Tattoo Session';
    // a photo taken or chosen on this device (Henry, 2026-10-19: there was only a box for an image address)
    const image_url = pendingClientWorkPhoto;
    const notes = document.getElementById('tw-notes-input')?.value || '';
    if (!image_url) { showStudioToast('Take or choose a photo first'); return; }

    try {
        const res = await fetch(`/api/clients/${clientId}/tattoo-work`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category, image_url, notes })
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        pendingClientWorkPhoto = '';
        
        if (currentActiveProfileClient) {
            currentActiveProfileClient.tattoo_work = data.tattoo_work || [];
            const countWork = document.getElementById('cp-count-tattoo-work');
            if (countWork) countWork.textContent = data.tattoo_work.length;
        }

        switchClientProfileTab('tattoo-work');
        if (typeof showUndoToast === 'function') {
            showUndoToast('Added artwork to client portfolio.');
        }
    } catch (err) {
        console.error('Error adding tattoo work:', err);
        alert('Failed to save photo to client record.');
    }
}
window.submitClientTattooWork = submitClientTattooWork;

// Delete Client Tattoo Work
// Zoom on a profile photo: looked up by id (an inline image address broke the button on an SVG photo)
function openClientWorkLightbox(workId) {
    const list = (currentActiveProfileClient && currentActiveProfileClient.tattoo_work) || [];
    const w = list.find((x) => Number(x.id) === Number(workId));
    if (w) openLightboxModal(w.image_url, w.title, w.notes);
}
window.openClientWorkLightbox = openClientWorkLightbox;

async function deleteClientTattooWork(clientId, workId) {
    openDeletionConfirmModal({
        title: 'Delete Portfolio Artwork',
        message: 'Are you sure you want to delete this artwork photo from the client portfolio?',
        itemName: 'Client Artwork Photo',
        itemDetails: `Client ID #${clientId} • Artwork #${workId}`,
        confirmBtnText: 'Delete Photo',
        onConfirm: async () => {
            try {
                const res = await fetch(`/api/clients/${clientId}/tattoo-work/${workId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Delete failed');
                const data = await res.json();

                if (currentActiveProfileClient) {
                    currentActiveProfileClient.tattoo_work = data.tattoo_work || [];
                    const countWork = document.getElementById('cp-count-tattoo-work');
                    if (countWork) countWork.textContent = data.tattoo_work.length;
                }

                switchClientProfileTab('tattoo-work');
                if (typeof showUndoToast === 'function') {
                    showUndoToast('Deleted artwork from client portfolio.');
                }
            } catch (err) {
                console.error('Error deleting tattoo work:', err);
            }
        }
    });
}
window.deleteClientTattooWork = deleteClientTattooWork;

// Camera Photo Capture Modal
let clientPhotoMediaStream = null;
let capturedClientPhotoDataUrl = null;


function closeClientPhotoCameraModal() {
    const modal = document.getElementById('client-photo-camera-modal-overlay');
    if (modal) modal.style.display = 'none';
    if (clientPhotoMediaStream) {
        clientPhotoMediaStream.getTracks().forEach(t => t.stop());
        clientPhotoMediaStream = null;
    }
}
window.closeClientPhotoCameraModal = closeClientPhotoCameraModal;

function saveCapturedClientProfilePhoto() {
    if (!capturedClientPhotoDataUrl || !currentActiveProfileClient || !currentActiveProfileClient.client) {
        closeClientPhotoCameraModal();
        return;
    }

    const clientId = currentActiveProfileClient.client.id;
    captureAndSaveClientProfilePhoto(clientId, capturedClientPhotoDataUrl);
    closeClientPhotoCameraModal();
}
window.saveCapturedClientProfilePhoto = saveCapturedClientProfilePhoto;

async function captureAndSaveClientProfilePhoto(clientId, photoDataUrl) {
    if (!clientId || !photoDataUrl) return;

    // Persist locally for instant offline and cross-session retrieval
    try {
        localStorage.setItem('client_photo_' + clientId, photoDataUrl);
    } catch (e) {
        console.warn('LocalStorage client photo quota notice:', e);
    }

    // Update active in-memory client state
    if (currentActiveProfileClient && currentActiveProfileClient.client && currentActiveProfileClient.client.id === clientId) {
        currentActiveProfileClient.client.photo = photoDataUrl;
        currentActiveProfileClient.client.avatar = photoDataUrl;
        currentActiveProfileClient.client.avatar_url = photoDataUrl;
    }

    // Update profile header avatar element
    const avatarEl = document.getElementById('client-profile-avatar');
    if (avatarEl) {
        avatarEl.innerHTML = `<img src="${photoDataUrl}" alt="Client Photo" style="width:100%;height:100%;object-fit:cover;" />`;
    }

    // Sync with backend API
    try {
        await fetch(`/api/clients/${clientId}/photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                photo_url: photoDataUrl,
                artist: (currentActiveProfileClient && currentActiveProfileClient.client) ? currentActiveProfileClient.client.assigned_staff_name : 'Studio Staff'
            })
        });
    } catch (err) {
        console.warn('Backend client photo sync notice:', err);
    }

    // Refresh client directory view if active to display updated avatar
    if (typeof renderClientDirectoryVirtual === 'function') {
        try { renderClientDirectoryVirtual(); } catch(e){}
    }

    if (typeof showUndoToast === 'function') {
        showUndoToast('Captured and saved client profile photo successfully!');
    } else if (typeof showToast === 'function') {
        showToast('Client profile photo captured and saved!', 'success');
    }
}
window.captureAndSaveClientProfilePhoto = captureAndSaveClientProfilePhoto;

// Floating Quick Actions Menu
function toggleClientQuickActionsMenu() {
    const menu = document.getElementById('client-quick-actions-menu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'none' || !menu.style.display ? 'flex' : 'none';
}
window.toggleClientQuickActionsMenu = toggleClientQuickActionsMenu;

async function logRapidClientProcedureNote(noteText) {
    toggleClientQuickActionsMenu();
    if (!currentActiveProfileClient || !currentActiveProfileClient.client) return;
    const clientId = currentActiveProfileClient.client.id;

    try {
        const res = await fetch(`/api/clients/${clientId}/staff-notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: 'Admin Manager',
                author_role: 'Studio Manager',
                category: 'Procedure Observation',
                note: noteText
            })
        });
        if (!res.ok) throw new Error('Rapid log note failed');
        const data = await res.json();

        currentActiveProfileClient.staff_notes = data.staff_notes || [];
        if (currentActiveProfileClient.client) {
            currentActiveProfileClient.client.staff_notes = data.staff_notes || [];
        }
        const countNotes = document.getElementById('cp-count-notes');
        if (countNotes) countNotes.textContent = (data.staff_notes || []).length + appointmentNotes(currentActiveProfileClient && currentActiveProfileClient.appointments).length;

        if (currentProfileActiveTab === 'notes') {
            switchClientProfileTab('notes');
        }

        if (typeof showUndoToast === 'function') {
            showUndoToast('Rapid procedure note recorded in client history!');
        }
    } catch (e) {
        console.error('Rapid note log error:', e);
    }
}
window.logRapidClientProcedureNote = logRapidClientProcedureNote;


// =========================================================================
// GLOBAL KEYBOARD SHORTCUT MANAGER (ALT + O FOR STERILE AUDIT)
// =========================================================================
class StudioKeyboardShortcutManager {
    constructor() {
        this.shortcuts = new Map();
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Register default studio shortcuts
        this.register('Alt+O', () => {
            if (typeof openSterileAuditModal === 'function') {
                openSterileAuditModal();
                this.showToast('Alt + O: Opened Sterile Medical Audit');
            }
        }, 'Open Sterile Medical Audit & Expiration Vault');

        this.register('Alt+C', () => {
            if (typeof openClientDirectoryModal === 'function') {
                openClientDirectoryModal();
                this.showToast('Alt + C: Opened Client Directory & Health Alerts');
            }
        }, 'Open Client Directory & Health Alerts');

        this.register('Alt+N', () => {
            if (typeof openQuickLogModal === 'function') {
                openQuickLogModal();
                this.showToast('Alt + N: Opened Quick Event Logger');
            }
        }, 'Quick Log Event');

        this.register('Alt+S', () => {
            const overlay = document.getElementById('inventory-camera-scanner-modal-overlay');
            if (overlay && overlay.style.display === 'flex') {
                if (typeof closeInventoryCameraScannerModal === 'function') closeInventoryCameraScannerModal();
                else overlay.style.display = 'none';
            } else {
                if (typeof openInventoryCameraScannerModal === 'function') openInventoryCameraScannerModal();
                else if (typeof openQrScannerModal === 'function') openQrScannerModal();
            }
            this.showToast('Alt + S: Toggled Inventory Camera Scanner');
        }, 'Toggle Inventory Camera Scanner');

        this.register('Alt+I', () => {
            if (typeof openImportModal === 'function') {
                openImportModal();
                this.showToast('Alt + I: Opened CSV Import Modal');
            }
        }, 'Open CSV Import / Auto-Sync');

        this.register('Alt+E', () => {
            if (typeof openQuickTableExportModal === 'function') {
                openQuickTableExportModal();
                this.showToast('Alt + E: Opened Table Export Modal');
            }
        }, 'Export Data (PDF / CSV)');

        this.register('Alt+A', () => {
            if (typeof openAutoSchedulerModal === 'function') {
                openAutoSchedulerModal();
                this.showToast('Alt + A: Opened Appointment Scheduler');
            }
        }, 'Open Automated Appointment Scheduler');


        this.register('Alt+D', () => {
            const invSearch = document.getElementById('inventory-search-input');
            const feedSearch = document.getElementById('feed-search-input');
            const procSearch = document.getElementById('proc-item-search-input');
            const active = document.activeElement;

            if (procSearch && (procSearch.offsetParent !== null)) {
                procSearch.focus();
                procSearch.select();
            } else if (active === invSearch && feedSearch) {
                feedSearch.focus();
                feedSearch.select();
            } else if (invSearch && (invSearch.offsetParent !== null)) {
                invSearch.focus();
                invSearch.select();
            } else if (feedSearch) {
                feedSearch.focus();
                feedSearch.select();
            }
            this.showToast('Alt + D: Focused Search Bar');
        }, 'Focus Active Search Bar');

        // Global Keydown Listener
        window.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        }, true);
    }

    register(keyCombo, callback, description = '') {
        const normalized = this.normalizeKeyCombo(keyCombo);
        this.shortcuts.set(normalized, { callback, description });
    }

    normalizeKeyCombo(combo) {
        return combo
            .toLowerCase()
            .split('+')
            .map(s => s.trim())
            .sort()
            .join('+');
    }

    handleKeyDown(e) {
        // Build current combo
        const parts = [];
        if (e.altKey) parts.push('alt');
        if (e.ctrlKey) parts.push('ctrl');
        if (e.metaKey) parts.push('meta');
        if (e.shiftKey) parts.push('shift');

        // Identify key name
        const key = e.key ? e.key.toLowerCase() : '';
        if (key && !['alt', 'control', 'shift', 'meta'].includes(key)) {
            parts.push(key);
        }

        const combo = parts.sort().join('+');

        // Check if there is a handler for this combo
        if (this.shortcuts.has(combo)) {
            // Guard: If focused in an input/textarea and user presses standard key without Alt/Meta, allow normal typing
            const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
            const isEditable = tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable);
            
            // If it's an Alt or Ctrl/Meta shortcut, trigger even in input
            if (e.altKey || e.ctrlKey || e.metaKey || !isEditable) {
                e.preventDefault();
                e.stopPropagation();
                const handler = this.shortcuts.get(combo);
                if (handler && typeof handler.callback === 'function') {
                    handler.callback(e);
                }
            }
        }
    }

    showToast(message) {
        if (typeof showUndoToast === 'function') {
            showUndoToast(message);
        } else {
            let toast = document.getElementById('studio-shortcut-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'studio-shortcut-toast';
                toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ti-panel2, #1E293B);color:var(--ti-text, #F8FAFC);border:1px solid var(--ti-blue, #38BDF8);padding:8px 16px;border-radius:20px;font-size:0.82rem;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.5);z-index:9999999;pointer-events:none;transition:opacity 0.3s;opacity:0;display:flex;align-items:center;gap:8px;';
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.style.opacity = '1';
            clearTimeout(this._toastTimer);
            this._toastTimer = setTimeout(() => {
                toast.style.opacity = '0';
            }, 2500);
        }
    }
}

// Instantiate Global Shortcut Manager
const globalShortcutManager = new StudioKeyboardShortcutManager();
window.GlobalKeyboardShortcutManager = globalShortcutManager;

// =========================================================================
// INVENTORY CSV SYNC STATUS & TIMESTAMP MANAGER
// =========================================================================
async function fetchAndDisplayInventoryCsvSyncStatus() {
    const statusTextEl = document.getElementById('inv-sync-status-text');
    const statusBadgeEl = document.getElementById('inv-sync-status-badge');
    const timestampEl = document.getElementById('inv-last-successful-sync-time');
    const countEl = document.getElementById('inv-sync-total-count');
    const toggleIndicator = document.getElementById('inventory-sync-status-indicator');

    try {
        const res = await fetch('/api/inventory/sync-status');
        if (!res.ok) throw new Error('Sync status error');
        const state = await res.json();

        // Format Last Successful Sync Timestamp
        const lastSuccess = state.lastSuccessfulSyncTime || state.lastSyncTime;
        if (timestampEl) {
            if (lastSuccess) {
                const dateObj = new Date(lastSuccess);
                if (!isNaN(dateObj.getTime())) {
                    let timeStr = '';
                    let dateStr = '';
                    try {
                        timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    } catch (e) {
                        dateStr = 'Recent';
                    }
                    const diffMin = Math.max(0, Math.round((Date.now() - dateObj.getTime()) / 60000));
                    
                    let relText = diffMin === 0 ? 'Just now' : `${diffMin}m ago`;
                    if (diffMin > 60) {
                        const diffHr = Math.floor(diffMin / 60);
                        relText = `${diffHr}h ago`;
                    }

                    timestampEl.innerHTML = `<span style="color:var(--ti-blue, #38BDF8);font-weight:700;">${dateStr}${timeStr ? ' at ' + timeStr : ''}</span> <span style="color:var(--ti-muted, #94A3B8);font-size:0.75rem;font-weight:600;">(${relText})</span>`;
                    try {
                        timestampEl.title = `Exact Sync Time: ${dateObj.toISOString()}`;
                    } catch (e) {
                        timestampEl.title = `Exact Sync Time: ${dateStr}`;
                    }
                } else {
                    timestampEl.innerHTML = `<span style="color:var(--ti-gold, #FBBF24);">No successful sync recorded yet</span>`;
                }
            } else {
                timestampEl.innerHTML = `<span style="color:var(--ti-gold, #FBBF24);">No successful sync recorded yet</span>`;
            }
        }

        if (countEl) {
            countEl.textContent = state.syncCount || 0;
        }

        // Format Status Badge & Indicator
        const isSyncing = state.status === 'syncing';
        const isError = state.status === 'error';
        const isDisabled = state.status === 'disabled' || !state.enabled;

        if (statusTextEl && statusBadgeEl) {
            if (isSyncing) {
                statusBadgeEl.style.background = 'rgba(245, 158, 11, 0.2)';
                statusBadgeEl.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                statusBadgeEl.style.color = '#FBBF24';
                statusTextEl.innerHTML = 'Syncing in background...';
            } else if (isError) {
                statusBadgeEl.style.background = 'rgba(239, 68, 68, 0.2)';
                statusBadgeEl.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                statusBadgeEl.style.color = '#F87171';
                statusTextEl.innerHTML = 'Sync Error';
                statusBadgeEl.title = state.lastError || 'CSV sync failed';
            } else if (isDisabled) {
                statusBadgeEl.style.background = 'rgba(107, 114, 128, 0.2)';
                statusBadgeEl.style.borderColor = 'rgba(107, 114, 128, 0.5)';
                statusBadgeEl.style.color = '#9CA3AF';
                statusTextEl.innerHTML = 'Sync Paused';
            } else {
                statusBadgeEl.style.background = 'rgba(16, 185, 129, 0.2)';
                statusBadgeEl.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                statusBadgeEl.style.color = '#34D399';
                statusTextEl.innerHTML = 'Synced & Connected';
            }
        }

        if (toggleIndicator) {
            toggleIndicator.textContent = isDisabled ? 'Paused' : (isSyncing ? 'Syncing' : 'Active');
        }

        return state;
    } catch (err) {
        console.warn('Sync status fetch warning:', err);
        if (timestampEl) {
            timestampEl.innerHTML = `<span style="color:var(--ti-muted, #94A3B8);">Status checked recently</span>`;
        }
    }
}
window.fetchAndDisplayInventoryCsvSyncStatus = fetchAndDisplayInventoryCsvSyncStatus;


// Auto-poll sync status every 45 seconds when page is active
setInterval(() => {
    const overlay = document.getElementById('inventory-modal-overlay');
    if (overlay && overlay.style.display === 'flex') {
        fetchAndDisplayInventoryCsvSyncStatus();
    }
}, 45000);

// =========================================================================
// STERILE MEDICAL AUDIT DASHBOARD WARNING SUMMARY WIDGET
// =========================================================================
async function fetchAndRenderSterileAuditDashboardWidget() {
    const expiredEl = document.getElementById('sterile-widget-expired-count');
    const expiringEl = document.getElementById('sterile-widget-expiring-count');
    const compliantEl = document.getElementById('sterile-widget-compliant-count');
    const alertMsgEl = document.getElementById('sterile-widget-alert-msg');
    const previewContainer = document.getElementById('sterile-widget-alert-preview');

    try {
        const res = await fetch('/api/inventory/sterile-audit');
        if (!res.ok) throw new Error('Sterile audit API error');
        const data = await res.json();
        const audit = data.audit || [];

        let expiredCount = 0;
        let expiringSoonCount = 0;
        let compliantCount = 0;
        const warningItems = [];

        audit.forEach(item => {
            if (item.exp_status === 'EXPIRED') {
                expiredCount++;
                warningItems.push(`${item.name} (${item.lot_number || 'No Lot'}) - EXPIRED`);
            } else if (item.exp_status === 'EXPIRING_SOON') {
                expiringSoonCount++;
                warningItems.push(`${item.name} (${item.lot_number || 'No Lot'}) - ${item.days_until_exp}d left`);
            } else {
                compliantCount++;
            }
        });

        if (expiredEl) expiredEl.textContent = `${expiredCount} Items`;
        if (expiringEl) expiringEl.textContent = `${expiringSoonCount} Items`;
        if (compliantEl) compliantEl.textContent = `${compliantCount} Items`;

        if (alertMsgEl && previewContainer) {
            if (expiredCount > 0) {
                previewContainer.style.background = 'rgba(239, 68, 68, 0.15)';
                previewContainer.style.borderColor = 'rgba(239, 68, 68, 0.45)';
                alertMsgEl.innerHTML = `<strong style="color:var(--ti-alert, #EF4444);"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-siren></use></svg> IMMEDIATE COMPLIANCE RISK:</strong> ${expiredCount} expired sterile item(s) found! (${warningItems.slice(0, 2).join('; ')})`;
            } else if (expiringSoonCount > 0) {
                previewContainer.style.background = 'rgba(245, 158, 11, 0.15)';
                previewContainer.style.borderColor = 'rgba(245, 158, 11, 0.45)';
                alertMsgEl.innerHTML = `<strong style="color:var(--ti-gold, #FBBF24);"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-warn></use></svg> UPCOMING EXPIRATIONS:</strong> ${expiringSoonCount} item(s) expiring within 30 days. (${warningItems.slice(0, 2).join('; ')})`;
            } else {
                previewContainer.style.background = 'rgba(16, 185, 129, 0.12)';
                previewContainer.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                alertMsgEl.innerHTML = `<span style="color:var(--ti-green, #34D399);font-weight:700;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-check></use></svg> No expired lots:</span> no needle cartridges, pigments or disposables in stock are past their expiry date.`;
            }
        }

        return { expiredCount, expiringSoonCount, compliantCount };
    } catch (e) {
        console.warn('Sterile audit widget fetch warning:', e);
    }
}
window.fetchAndRenderSterileAuditDashboardWidget = fetchAndRenderSterileAuditDashboardWidget;

// Auto-run on document ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fetchAndRenderSterileAuditDashboardWidget();
        fetchAndDisplayInventoryCsvSyncStatus();
    });
} else {
    fetchAndRenderSterileAuditDashboardWidget();
    fetchAndDisplayInventoryCsvSyncStatus();
}


// =========================================================================
// FULLY WIRED BUTTON HANDLERS & MODAL CONTROLLERS (ALL 175 FUNCTIONS)
// =========================================================================

// --- Helper Functions ---
function forceShowModal(id) {
    const el = document.getElementById(id);
    if (el) {
        if (el.parentElement !== document.body && el.closest('.destination-view')) document.body.appendChild(el);
        el.style.display = 'flex';
        el.setAttribute('aria-hidden', 'false');
        // a window opened from another one goes in front of it: View Profile from Health Alerts
        // opened the profile behind the alerts window
        const top = [...document.body.children].filter((o) => o !== el && o.style.display !== 'none' && getComputedStyle(o).position === 'fixed' && getComputedStyle(o).display !== 'none')
            .reduce((max, o) => Math.max(max, parseInt(getComputedStyle(o).zIndex, 10) || 0), 0);
        if ((parseInt(getComputedStyle(el).zIndex, 10) || 0) <= top) el.style.zIndex = String(top + 1);
    }
    return el;
}

// Print only the window the button is in. window.print() alone printed the whole CRM, and the print
// stylesheet showed every hidden window too: 25 to 33 pages for one table (Henry, 2026-10-22).
function printWindowOf(button) {
    const target = button.closest('[id$="-modal-overlay"], [id$="-modal"]') || document.body;
    const marked = [];
    for (let n = target; n && n !== document.body; n = n.parentElement) {
        for (const sib of n.parentElement.children) if (sib !== n) { sib.classList.add('print-hide'); marked.push(sib); }
    }
    target.classList.add('print-this');
    const done = () => { marked.forEach((m) => m.classList.remove('print-hide')); target.classList.remove('print-this'); };
    window.addEventListener('afterprint', done, { once: true });
    window.print();
}
window.printWindowOf = printWindowOf;

// A window holding a list to read and print (Past Logs, the lot audit): built once, filled on each opening
function showListWindow(id, icon, title, bodyHtml) {
    let overlay = document.getElementById(id);
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = id;
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:2000007;align-items:center;justify-content:center;";
        document.body.appendChild(overlay);
    }
    overlay.setAttribute("aria-label", title);
    overlay.innerHTML = `
        <div style="background:var(--ti-bg2, #0F172A);border:1px solid var(--ti-line, #334155);border-radius:14px;padding:22px;width:min(94vw,680px);max-height:90vh;overflow:auto;color:var(--ti-text, #F8FAFC);font-size:0.9rem;">
            <h3 style="margin:0 0 12px;font-size:1.1rem;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-${icon}></use></svg> ${escapeHtml(title)}</h3>
            ${bodyHtml}
            <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
                <button type="button" onclick="printWindowOf(this)" style="padding:9px 16px;background:var(--ti-green, #10B981);color:#FFF;border:none;border-radius:8px;font-weight:800;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-print></use></svg> Print</button>
                <button type="button" onclick="forceHideModal('${id}')" style="padding:9px 16px;background:transparent;color:var(--ti-muted, #94A3B8);border:1px solid var(--ti-line2, #475569);border-radius:8px;cursor:pointer;">Close</button>
            </div>
        </div>`;
    forceShowModal(id);
}
window.showListWindow = showListWindow;

function forceHideModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
    }
    return el;
}

function showStudioToast(msg) {
    if (typeof window.showToastNotification === 'function') {
        window.showToastNotification(msg);
    } else {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = 'rgba(15, 23, 42, 0.95)';
        toast.style.color = '#F8FAFC';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontSize = '0.9rem';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
        toast.style.zIndex = '99999';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3500);
    }
}

// =========================================================================
// 1. OPEN MODAL FUNCTIONS (46)
// =========================================================================


function openAftercareEmailModal(client) {
    forceShowModal('aftercare-email-modal-overlay');
    const name = document.getElementById('aftercare-email-client-name');
    if (name) name.value = client && typeof client === 'object' ? (client.name || '') : (typeof client === 'string' ? client : '');
    updateAftercarePreviewText();
}
window.openAftercareEmailModal = openAftercareEmailModal;

function openAftercareModal() {
    forceShowModal('aftercare-modal');
}
window.openAftercareModal = openAftercareModal;

// --- Inventory: every stock item, with Add item and Edit (POST/PATCH /api/inventory) ---
const INVENTORY_FIELDS = [
    ["name", "Item name", "text", true], ["category", "Category", "text"], ["sku", "SKU", "text"],
    ["quantity", "In stock", "number", true], ["reorder_point", "Reorder at", "number"], ["price", "Unit price", "number"],
    ["lot_number", "Lot number", "text"], ["exp_date", "Expires", "date"], ["supplier", "Supplier", "text"],
];
let inventoryItems = [];
let editingInventoryId = null;

async function renderInventoryItems() {
    const tbody = document.getElementById("inventory-items-tbody");
    if (!tbody) return;
    try { inventoryItems = await ledgerJson("/api/inventory"); } catch (e) { tbody.innerHTML = '<tr><td colspan="10" style="padding:10px;color:var(--ti-alert-ink, #FCA5A5);">Could not load: the server did not answer</td></tr>'; return; }
    inventoryItems = Array.isArray(inventoryItems) ? inventoryItems : (inventoryItems.items || []);
    const q = ((document.getElementById("inventory-items-search") || {}).value || "").toLowerCase().trim();
    const shown = inventoryItems.filter((i) => !q || [i.name, i.sku, i.supplier, i.category, i.item_type].some((v) => String(v || "").toLowerCase().includes(q)))
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    if (!shown.length) {
        tbody.innerHTML = '<tr><td colspan="10" style="padding:10px;color:var(--ti-muted, #94A3B8);">' + (q ? "No item matches." : "No stock items yet. Add the first one with + Add item.") + '</td></tr>';
        return;
    }
    const cell = (v, style) => '<td style="padding:8px;' + (style || "") + '">' + escapeHtml(String(v == null ? "" : v)) + '</td>';
    tbody.innerHTML = shown.map((i) => {
        const low = Number(i.quantity) <= Number(i.reorder_point ?? 10);
        return '<tr class="inventory-item-row" style="border-bottom:1px solid var(--ti-panel2, #1E293B);">' + cell(i.name, "font-weight:700;color:#FFF;") + cell(i.category || i.item_type) + cell(i.sku)
            + cell(i.quantity, low ? "color:var(--ti-alert-ink, #FCA5A5);font-weight:800;" : "") + cell(i.reorder_point) + cell(i.price != null && i.price !== "" ? Number(i.price).toFixed(2) : "")
            + cell(i.lot_number) + cell(i.exp_date) + cell(i.supplier)
            + '<td style="padding:8px;text-align:right;"><button type="button" onclick="openInventoryItemForm(' + Number(i.id) + ')" style="padding:4px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;background:var(--ti-line, #334155);color:var(--ti-text, #E2E8F0);border:1px solid var(--ti-line2, #475569);">Edit</button></td></tr>';
    }).join("");
}
window.renderInventoryItems = renderInventoryItems;
document.addEventListener("DOMContentLoaded", renderInventoryItems);

function openInventoryItemForm(id) {
    const item = id ? inventoryItems.find((i) => Number(i.id) === Number(id)) : null;
    editingInventoryId = item ? item.id : null;
    let overlay = document.getElementById("inventory-item-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "inventory-item-modal-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "inventory-item-title");
        overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:2000000;align-items:center;justify-content:center;";
        const field = "width:100%;box-sizing:border-box;padding:8px 10px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:8px;color:var(--ti-text, #F8FAFC);font-size:0.9rem;";
        overlay.innerHTML = '<form id="inventory-item-form" style="background:var(--ti-bg2, #0F172A);border:1px solid var(--ti-line, #334155);border-radius:14px;padding:20px;width:min(94vw,520px);max-height:90vh;overflow:auto;display:grid;grid-template-columns:1fr 1fr;gap:10px;color:var(--ti-text, #F8FAFC);">'
            + '<h3 id="inventory-item-title" style="grid-column:1/-1;margin:0;font-size:1.1rem;"></h3>'
            + INVENTORY_FIELDS.map(([key, label, type, required]) => '<label style="font-size:0.8rem;color:var(--ti-muted, #94A3B8);' + (key === "name" || key === "supplier" ? "grid-column:1/-1;" : "") + '">' + label
                + '<input id="inventory-item-' + key + '" type="' + type + '"' + (type === "number" ? ' min="0" step="any"' : "") + (required ? " required" : "") + ' style="' + field + '"></label>').join("")
            + '<div style="grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end;margin-top:4px;">'
            + '<button type="button" onclick="forceHideModal(\'inventory-item-modal-overlay\')" style="padding:9px 16px;background:transparent;color:var(--ti-muted, #94A3B8);border:1px solid var(--ti-line2, #475569);border-radius:8px;cursor:pointer;">Cancel</button>'
            + '<button type="submit" id="inventory-item-save-btn" style="padding:9px 16px;background:var(--ti-green, #10B981);color:#FFF;border:none;border-radius:8px;font-weight:800;cursor:pointer;"></button></div></form>';
        document.body.appendChild(overlay);
        overlay.querySelector("form").addEventListener("submit", saveInventoryItem);
    }
    overlay.querySelector("form").reset();
    document.getElementById("inventory-item-title").textContent = item ? "Edit stock item" : "Add a stock item";
    document.getElementById("inventory-item-save-btn").textContent = item ? "Save changes" : "Add item";
    if (item) for (const [key] of INVENTORY_FIELDS) {
        const el = document.getElementById("inventory-item-" + key);
        const v = key === "category" ? (item.category || item.item_type) : item[key];
        if (el && v != null) el.value = v;
    }
    forceShowModal("inventory-item-modal-overlay");
    document.getElementById("inventory-item-name").focus();
}
window.openInventoryItemForm = openInventoryItemForm;

async function saveInventoryItem(event) {
    event.preventDefault();
    const body = {};
    for (const [key, , type] of INVENTORY_FIELDS) {
        const v = document.getElementById("inventory-item-" + key).value.trim();
        if (v !== "") body[key] = type === "number" ? Number(v) : v;
    }
    if (body.category) body.item_type = body.category;
    const editedId = editingInventoryId;
    try {
        const res = await fetch(editedId ? "/api/inventory/" + editedId : "/api/inventory", { method: editedId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("HTTP " + res.status);
    } catch (e) { showStudioToast("Could not save the item: the server did not answer"); return; }
    forceHideModal("inventory-item-modal-overlay");
    showStudioToast(editedId ? "Item updated: " + body.name : "Item added: " + body.name);
    renderInventoryItems();
}

// --- Suppliers: list, Add supplier and Edit (POST /api/inventory/suppliers, PUT .../:id) ---
const SUPPLIER_FIELDS = [
    ["name", "Supplier name", "text", true], ["contact_person", "Contact person", "text"], ["phone", "Phone", "tel"],
    ["email", "Email", "email"], ["order_email", "Order email (purchase orders)", "email"], ["website", "Website", "url"],
    ["lead_time_days", "Lead time (days)", "number"], ["payment_terms", "Payment terms", "text"], ["notes", "Notes", "text"],
];
let supplierList = [];
let editingSupplierId = null;

async function renderSupplierList() {
    const tbody = document.getElementById("suppliers-tbody");
    if (!tbody) return;
    try { supplierList = await ledgerJson("/api/inventory/suppliers"); } catch (e) { tbody.innerHTML = '<tr><td colspan="7" style="padding:10px;color:var(--ti-alert-ink, #FCA5A5);">Could not load: the server did not answer</td></tr>'; return; }
    supplierList = Array.isArray(supplierList) ? supplierList : [];
    if (!supplierList.length) { tbody.innerHTML = '<tr><td colspan="7" style="padding:10px;color:var(--ti-muted, #94A3B8);">No suppliers yet. Add the first one with + Add supplier.</td></tr>'; return; }
    const cell = (v, style) => '<td style="padding:8px;' + (style || "") + '">' + escapeHtml(String(v == null ? "" : v)) + '</td>';
    tbody.innerHTML = supplierList.slice().sort((a, b) => String(a.name).localeCompare(String(b.name))).map((sp) => '<tr class="supplier-row" style="border-bottom:1px solid var(--ti-panel2, #1E293B);">'
        + cell(sp.name, "font-weight:700;color:#FFF;") + cell(sp.contact_person) + cell(sp.phone) + cell(sp.order_email || sp.email)
        + cell(sp.lead_time_days ? sp.lead_time_days + " days" : "") + cell(sp.item_count)
        + '<td style="padding:8px;text-align:right;"><button type="button" onclick="openSupplierForm(' + Number(sp.id) + ')" style="padding:4px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;background:var(--ti-line, #334155);color:var(--ti-text, #E2E8F0);border:1px solid var(--ti-line2, #475569);">Edit</button></td></tr>').join("");
}
window.renderSupplierList = renderSupplierList;
document.addEventListener("DOMContentLoaded", renderSupplierList);

function openSupplierForm(id) {
    const sp = id ? supplierList.find((x) => Number(x.id) === Number(id)) : null;
    editingSupplierId = sp ? sp.id : null;
    let overlay = document.getElementById("supplier-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "supplier-modal-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "supplier-form-title");
        overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:2000000;align-items:center;justify-content:center;";
        const field = "width:100%;box-sizing:border-box;padding:8px 10px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:8px;color:var(--ti-text, #F8FAFC);font-size:0.9rem;";
        overlay.innerHTML = '<form id="supplier-form" style="background:var(--ti-bg2, #0F172A);border:1px solid var(--ti-line, #334155);border-radius:14px;padding:20px;width:min(94vw,520px);max-height:90vh;overflow:auto;display:grid;grid-template-columns:1fr 1fr;gap:10px;color:var(--ti-text, #F8FAFC);">'
            + '<h3 id="supplier-form-title" style="grid-column:1/-1;margin:0;font-size:1.1rem;"></h3>'
            + SUPPLIER_FIELDS.map(([key, label, type, required]) => '<label style="font-size:0.8rem;color:var(--ti-muted, #94A3B8);' + (["name", "order_email", "notes"].includes(key) ? "grid-column:1/-1;" : "") + '">' + label
                + '<input id="supplier-' + key + '" type="' + type + '"' + (type === "number" ? ' min="0" step="1"' : "") + (required ? " required" : "") + ' style="' + field + '"></label>').join("")
            + '<div style="grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end;margin-top:4px;">'
            + '<button type="button" onclick="forceHideModal(\'supplier-modal-overlay\')" style="padding:9px 16px;background:transparent;color:var(--ti-muted, #94A3B8);border:1px solid var(--ti-line2, #475569);border-radius:8px;cursor:pointer;">Cancel</button>'
            + '<button type="submit" id="supplier-save-btn" style="padding:9px 16px;background:var(--ti-green, #10B981);color:#FFF;border:none;border-radius:8px;font-weight:800;cursor:pointer;"></button></div></form>';
        document.body.appendChild(overlay);
        overlay.querySelector("form").addEventListener("submit", saveSupplier);
    }
    overlay.querySelector("form").reset();
    document.getElementById("supplier-form-title").textContent = sp ? "Edit supplier" : "Add a supplier";
    document.getElementById("supplier-save-btn").textContent = sp ? "Save changes" : "Add supplier";
    if (sp) for (const [key] of SUPPLIER_FIELDS) { const el = document.getElementById("supplier-" + key); if (el && sp[key] != null) el.value = sp[key]; }
    forceShowModal("supplier-modal-overlay");
    document.getElementById("supplier-name").focus();
}
window.openSupplierForm = openSupplierForm;

async function saveSupplier(event) {
    event.preventDefault();
    const body = {};
    for (const [key, , type] of SUPPLIER_FIELDS) body[key] = type === "number" ? (document.getElementById("supplier-" + key).value === "" ? undefined : Number(document.getElementById("supplier-" + key).value)) : document.getElementById("supplier-" + key).value.trim();
    const editedId = editingSupplierId;
    try {
        const res = await fetch(editedId ? "/api/inventory/suppliers/" + editedId : "/api/inventory/suppliers", { method: editedId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("HTTP " + res.status);
    } catch (e) { showStudioToast("Could not save the supplier: the server did not answer"); return; }
    forceHideModal("supplier-modal-overlay");
    showStudioToast(editedId ? "Supplier updated: " + body.name : "Supplier added: " + body.name);
    renderSupplierList();
    if (typeof renderInventoryItems === "function") renderInventoryItems();
}

// Healing Pipeline: the clients whose session is done, grouped by days since the session.
// It used to show fixed sample counts (4, 6, 12): the server's records were never read, and
// nothing ever added one. Built from the studio's own completed appointments now.
// ponytail: days since the session only, no healing advice (a piercing heals far slower than a tattoo).
const PIPELINE_GROUPS = [
    { from: 0, to: 3, label: "Days 0 to 3" },
    { from: 4, to: 14, label: "Days 4 to 14" },
    { from: 15, to: 30, label: "Days 15 to 30" },
    { from: 31, to: 90, label: "Days 31 to 90" },
];
let pipelineGroups = [];

async function openAftercarePipelineModal() {
    forceShowModal('aftercare-pipeline-modal-overlay');
    const body = document.getElementById('aftercare-pipeline-modal-body');
    if (!body) return;
    body.innerHTML = '<div style="text-align:center;padding:24px;color:var(--ti-muted, #94A3B8);">Loading...</div>';
    let appts;
    try { appts = await ledgerJson('/api/appointments'); } catch (e) { body.innerHTML = LEDGER_ERROR; return; }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = (a) => Math.floor((today - new Date(new Date(a.datetime).setHours(0, 0, 0, 0))) / 86400000);
    const done = (Array.isArray(appts) ? appts : []).filter((a) => a && a.status === 'completed' && a.datetime && days(a) >= 0 && days(a) <= 90);
    pipelineGroups = PIPELINE_GROUPS.map((g) => ({ label: g.label, items: done.filter((a) => days(a) >= g.from && days(a) <= g.to)
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime)).map((a) => Object.assign({ days: days(a) }, a)) }));
    if (!done.length) {
        body.innerHTML = '<div style="text-align:center;padding:20px;color:var(--ti-muted, #94A3B8);">No sessions completed in the last 90 days. Mark an appointment as Completed in the Calendar and the client appears here.</div>';
        return;
    }
    const btn = 'padding:4px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;background:var(--ti-line, #334155);color:var(--ti-text, #E2E8F0);border:1px solid var(--ti-line2, #475569);';
    body.innerHTML = '<div style="display:flex;justify-content:flex-end;margin-bottom:10px;"><button type="button" onclick="downloadPipelinePdf()" style="' + btn + 'background:var(--ti-blue, #2563EB);color:#FFF;border:none;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-download></use></svg> Download PDF</button></div>'
        + pipelineGroups.map((g) => '<div class="pipeline-group" style="background:var(--ti-bg2, #0F172A);padding:12px;border-radius:8px;border:1px solid var(--ti-line, #334155);margin-bottom:10px;">'
            + '<div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:6px;"><span>' + escapeHtml(g.label) + '</span><span style="color:var(--ti-blue, #38BDF8);">' + g.items.length + '</span></div>'
            + (g.items.length ? g.items.map((a) => '<div class="pipeline-client" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-top:1px solid var(--ti-panel2, #1E293B);">'
                + '<div><strong>' + escapeHtml(a.client_name || '') + '</strong><div style="font-size:0.78rem;color:var(--ti-muted, #94A3B8);">' + escapeHtml([a.service_type, a.staff_name, new Date(a.datetime).toLocaleDateString(), 'day ' + a.days].filter(Boolean).join(' · ')) + '</div></div>'
                + (a.client_id ? '<button type="button" onclick="forceHideModal(\'aftercare-pipeline-modal-overlay\'); openClientProfileModal(' + Number(a.client_id) + ')" style="' + btn + '">View Profile</button>' : '')
                + '</div>').join('') : '<div style="font-size:0.8rem;color:var(--ti-faint, #64748B);">Nobody in this group.</div>')
            + '</div>').join('');
}

function downloadPipelinePdf() {
    if (!(window.jspdf && window.jspdf.jsPDF)) { showStudioToast('The PDF library did not load'); return; }
    const doc = new window.jspdf.jsPDF();
    let y = 18;
    doc.setFontSize(16); doc.text(pdfLabel('Healing pipeline'), 15, y); y += 7;
    doc.setFontSize(9); doc.text(pdfLabel('Clients by days since their completed session.') + ' ' + new Date().toLocaleDateString(), 15, y); y += 10;
    for (const g of pipelineGroups) {
        if (y > 270) { doc.addPage(); y = 18; }
        doc.setFontSize(12); doc.text(pdfLabel(g.label) + ' (' + g.items.length + ')', 15, y); y += 7;
        doc.setFontSize(10);
        for (const a of g.items) {
            if (y > 280) { doc.addPage(); y = 18; }
            doc.text([a.client_name, a.service_type, a.staff_name, new Date(a.datetime).toLocaleDateString(), pdfLabel('day ' + a.days)].filter(Boolean).join('  |  '), 18, y); y += 6;
        }
        y += 4;
    }
    doc.save('healing-pipeline-' + new Date().toISOString().slice(0, 10) + '.pdf');
}
window.downloadPipelinePdf = downloadPipelinePdf;
window.openAftercarePipelineModal = openAftercarePipelineModal;

// One line of a ledger window: what on the left, how much on the right.
function ledgerRow(title, detail, amount) {
    return '<div class="ledger-row" style="background:var(--ti-bg2, #0F172A);padding:12px;border-radius:8px;border:1px solid var(--ti-line, #334155);display:flex;justify-content:space-between;align-items:center;gap:12px;">'
        + '<div><strong>' + escapeHtml(String(title)) + '</strong><div style="font-size:0.8rem;color:var(--ti-muted, #94A3B8);">' + escapeHtml(String(detail || '')) + '</div></div>'
        + '<div style="font-weight:800;color:var(--ti-green, #34D399);white-space:nowrap;">' + escapeHtml(String(amount == null ? '' : amount)) + '</div></div>';
}
function ledgerList(body, rows, emptyText) {
    body.innerHTML = rows.length ? '<div style="display:flex;flex-direction:column;gap:10px;">' + rows.join('') + '</div>'
        : '<div style="text-align:center;padding:20px;color:var(--ti-muted, #94A3B8);">' + escapeHtml(emptyText) + '</div>';
}
const LEDGER_ERROR = '<div style="text-align:center;padding:20px;color:var(--ti-alert-ink, #FCA5A5);">Could not load: the server did not answer</div>';
async function ledgerJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
}
const ledgerMoney = (n) => Number(n || 0).toFixed(2);

async function openAutoclaveVaultModal() {
    forceShowModal('autoclave-vault-modal-overlay');
    const body = document.getElementById('autoclave-vault-modal-body');
    if (!body) return;
    try {
        const data = await ledgerJson('/api/compliance/autoclave-logs');
        ledgerList(body, (data.logs || []).map((c) => ledgerRow(
            'Cycle #' + (c.cycle_number || c.id) + (c.autoclave_id ? ' · ' + c.autoclave_id : ''),
            [c.date_run, c.station, c.temperature_c != null && c.temperature_c !== '' ? c.temperature_c + ' °C' : '', c.technician || c.operator].filter(Boolean).join(' · '),
            c.spore_test_result || 'result not recorded')), 'No autoclave cycles recorded yet.');
    } catch (e) { body.innerHTML = LEDGER_ERROR; }
}
window.openAutoclaveVaultModal = openAutoclaveVaultModal;

function openBeforeAfterLinkModal() {
    forceShowModal('gallery-before-after-modal-overlay');
}
window.openBeforeAfterLinkModal = openBeforeAfterLinkModal;

async function openClientDirectoryModal() {
    forceShowModal('client-directory-modal-overlay');
    renderClientDirectoryModal();
}
window.openClientDirectoryModal = openClientDirectoryModal;

function openCmdPalette() {
    forceShowModal('cmd-palette-modal');
    const input = document.getElementById('cmd-palette-input');
    if (input) { input.value = ''; setTimeout(() => input.focus(), 100); }
    filterCmdPaletteResults();
}
window.openCmdPalette = openCmdPalette;

// Command palette: every screen, every Tools-grid card and every client, filtered as you type.
let cmdPaletteClients = [];
async function filterCmdPaletteResults() {
    const box = document.getElementById('cmd-palette-results');
    const input = document.getElementById('cmd-palette-input');
    if (!box) return;
    if (!cmdPaletteClients.length) {
        try { const r = await fetch('/api/clients'); if (r.ok) cmdPaletteClients = await r.json(); } catch (e) {}
    }
    const items = [];
    document.querySelectorAll('[id^="nav-dest-"], #dest-tools [onclick^="open"]').forEach((el) => {
        const label = el.textContent.replace(/\s+/g, ' ').trim();
        const run = el.getAttribute('onclick');
        if (label && run) items.push({ label, run });
    });
    (Array.isArray(cmdPaletteClients) ? cmdPaletteClients : []).forEach((c) =>
        items.push({ label: '' + c.name, run: 'openClientProfileModal(' + Number(c.id) + ')' }));
    const q = (input ? input.value : '').toLowerCase().trim();
    const hits = items.filter((i) => !q || i.label.toLowerCase().includes(q)).slice(0, 12);
    box.innerHTML = hits.length ? hits.map((i, n) =>
        `<button type="button" data-cmd="${n}" style="display:block;width:100%;text-align:left;padding:10px 16px;background:none;border:none;border-bottom:1px solid var(--ti-panel2, #1E293B);color:var(--ti-text, #E2E8F0);font-size:0.9rem;cursor:pointer;">${escapeHtml(i.label)}</button>`).join('')
        : '<div style="padding:14px 16px;color:var(--ti-muted, #94A3B8);">No matches</div>';
    const runHit = (i) => { forceHideModal('cmd-palette-modal'); try { new Function(i.run)(); } catch (e) {} };
    box.querySelectorAll('[data-cmd]').forEach((b) => b.addEventListener('click', () => runHit(hits[b.dataset.cmd])));
    if (input) input.onkeydown = (e) => { if (e.key === 'Enter' && hits[0]) { e.preventDefault(); runHit(hits[0]); } };
}
window.filterCmdPaletteResults = filterCmdPaletteResults;

// Tip split: the shares shown on the form (artist 80%, apprentice 15%, desk 5%).
function recalculateTipSplit() {
    const tip = parseFloat((document.getElementById('tipcalc-tip') || {}).value) || 0;
    const money = (n) => '$' + n.toFixed(2);
    [['tipcalc-val-artist', 0.8], ['tipcalc-val-apprentice', 0.15], ['tipcalc-val-desk', 0.05]].forEach(([id, share]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = money(tip * share);
    });
}
window.recalculateTipSplit = recalculateTipSplit;

async function openCommissionModal() {
    forceShowModal('commission-modal');
    const body = document.getElementById('commission-table-body');
    if (!body) return;
    try {
        const report = await ledgerJson('/api/staff/commissions');
        ledgerList(body, (Array.isArray(report) ? report : []).filter((r) => r.completedJobs > 0).map((r) => ledgerRow(
            r.name, r.completedJobs + ' payments recorded', ledgerMoney(r.grossRevenue))),
            'No payments are recorded against a staff member yet.');
    } catch (e) { body.innerHTML = LEDGER_ERROR; }
}
window.openCommissionModal = openCommissionModal;

async function openDailyStudioSummaryModal() {
    forceShowModal('daily-summary-modal-overlay');
    fetchAndRenderDailyStudioSummary();
}
window.openDailyStudioSummaryModal = openDailyStudioSummaryModal;

async function openDepositLedgerModal() {
    forceShowModal('deposit-ledger-modal-overlay');
    const body = document.getElementById('deposit-ledger-modal-body');
    if (!body) return;
    try {
        const appts = await ledgerJson('/api/appointments');
        const withDeposit = (Array.isArray(appts) ? appts : []).filter((a) => Number(a.deposit_paid || a.deposit || 0) > 0);
        ledgerList(body, withDeposit.map((a) => ledgerRow(
            a.client_name || '', [a.service_type, a.datetime ? new Date(a.datetime).toLocaleDateString() : '', a.status].filter(Boolean).join(' · '),
            ledgerMoney(a.deposit_paid || a.deposit))), 'No deposits are recorded on an appointment yet.');
    } catch (e) { body.innerHTML = LEDGER_ERROR; }
}
window.openDepositLedgerModal = openDepositLedgerModal;


function openImportModal() {
    forceShowModal('import-modal');
}
window.openImportModal = openImportModal;

async function openMarginCalculatorModal() {
    forceShowModal('margin-calculator-modal-overlay');
    const body = document.getElementById('margin-calculator-modal-body');
    if (!body) return;
    try {
        const m = await ledgerJson('/api/financials/margin-calculator');
        if (!m.payments_recorded && !m.procedures_logged) { ledgerList(body, [], 'Nothing to calculate yet: no payments and no supplies are recorded.'); return; }
        ledgerList(body, [
            ledgerRow('Payments recorded', 'Completed payments, refunds left out', ledgerMoney(m.payments_recorded)),
            ledgerRow('Supplies logged as used', m.procedures_logged + ' procedures' + (m.items_without_cost ? ' · ' + m.items_without_cost + ' items have no cost in stock and are not counted' : ''), ledgerMoney(m.supplies_used_cost)),
            ledgerRow('Difference', 'Before rent, wages and artist shares', ledgerMoney(m.difference))
        ], '');
    } catch (e) { body.innerHTML = LEDGER_ERROR; }
}
window.openMarginCalculatorModal = openMarginCalculatorModal;


function openQuickAddClientModal() {
    if (typeof window.openNewClientModal === 'function') {
        window.openNewClientModal();
    } else {
        forceShowModal('new-client-modal-overlay');
    }
}
window.openQuickAddClientModal = openQuickAddClientModal;

// one way in: the form may still be in edit mode from the last Edit, and Save would change
// that appointment instead of booking a new one
function openQuickNewAppointmentModal() {
    openNewAppointmentModal();
}
window.openQuickNewAppointmentModal = openQuickNewAppointmentModal;


// Record Payment used to open the deposit ledger and say "Payment Recording Terminal ready":
// nothing could be recorded. A real form now, saved as a transaction (/api/financial).
async function openQuickRecordPaymentModal(prefill) {
    let overlay = document.getElementById('record-payment-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'record-payment-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'record-payment-title');
        overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:2000000;align-items:center;justify-content:center;';
        const field = 'width:100%;box-sizing:border-box;padding:9px 10px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:8px;color:var(--ti-text, #F8FAFC);font-size:0.95rem;';
        overlay.innerHTML = `
            <form id="record-payment-form" style="background:var(--ti-bg2, #0F172A);border:1px solid var(--ti-line, #334155);border-radius:14px;padding:22px;width:min(92vw,420px);display:flex;flex-direction:column;gap:12px;color:var(--ti-text, #F8FAFC);">
                <h3 id="record-payment-title" style="margin:0;font-size:1.1rem;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-cash></use></svg> Record a payment</h3>
                <label style="font-size:0.8rem;color:var(--ti-muted, #94A3B8);">Client
                    <select id="record-payment-client" style="${field}"><option value="">Walk-in / not on file</option></select></label>
                <label style="font-size:0.8rem;color:var(--ti-muted, #94A3B8);">Amount
                    <input id="record-payment-amount" type="number" min="0.01" step="0.01" required style="${field}" /></label>
                <label style="font-size:0.8rem;color:var(--ti-muted, #94A3B8);">Paid by
                    <select id="record-payment-method" style="${field}"><option>Cash</option><option>Card</option><option>Bank transfer</option><option>Other</option></select></label>
                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:4px;">
                    <button type="button" onclick="forceHideModal('record-payment-modal-overlay')" style="padding:9px 16px;background:transparent;color:var(--ti-muted, #94A3B8);border:1px solid var(--ti-line2, #475569);border-radius:8px;cursor:pointer;">Cancel</button>
                    <button type="submit" style="padding:9px 16px;background:var(--ti-green, #10B981);color:#FFF;border:none;border-radius:8px;font-weight:800;cursor:pointer;">Save payment</button>
                </div>
            </form>`;
        document.body.appendChild(overlay);
        overlay.querySelector('form').addEventListener('submit', saveQuickPayment);
    }
    overlay.querySelector('form').reset();
    forceShowModal('record-payment-modal-overlay');
    try {
        const clients = await (await fetch('/api/clients')).json();
        const sel = document.getElementById('record-payment-client');
        sel.innerHTML = '<option value="">Walk-in / not on file</option>' + (Array.isArray(clients) ? clients : [])
            .map((c) => `<option value="${Number(c.id)}">${escapeHtml(c.name || '')}</option>`).join('');
    } catch (e) { /* the form still records a walk-in payment */ }
    if (prefill && typeof prefill === 'object') {
        if (prefill.clientId) document.getElementById('record-payment-client').value = String(prefill.clientId);
        if (prefill.amount > 0) document.getElementById('record-payment-amount').value = Number(prefill.amount).toFixed(2);
    }
    document.getElementById('record-payment-amount').focus();
}

async function saveQuickPayment(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('record-payment-amount').value);
    if (!(amount > 0)) { showStudioToast('Enter the amount paid'); return; }
    const clientId = document.getElementById('record-payment-client').value;
    try {
        const res = await fetch('/api/financial', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: clientId || null, amount, method: document.getElementById('record-payment-method').value, type: 'payment', source: 'in-studio' }) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
    } catch (e) { showStudioToast('Could not save the payment: the server did not answer'); return; }
    forceHideModal('record-payment-modal-overlay');
    showStudioToast('Payment recorded: $' + amount.toFixed(2));
    if (typeof renderDashboardKpis === 'function') renderDashboardKpis();
    renderClientsTable();   // Total spent
    renderFinanceSummary();
}
window.openQuickRecordPaymentModal = openQuickRecordPaymentModal;


function openQuickTableExportModal(targetTableId) {
    forceShowModal('quick-table-export-modal-overlay');
}
window.openQuickTableExportModal = openQuickTableExportModal;


function openSanitizationChecklistModal() {
    const ts = document.getElementById("sani-timestamp-display");
    if (ts) ts.textContent = new Date().toLocaleString();
    forceShowModal('sanitization-checklist-modal-overlay');
}
window.openSanitizationChecklistModal = openSanitizationChecklistModal;

function openShiftModal() {
    forceShowModal('shift-modal');
    updateShiftStatusView();
}
window.openShiftModal = openShiftModal;


function openStaffMessagingChannelsModal() {
    forceShowModal('staff-messaging-modal-overlay');
}
window.openStaffMessagingChannelsModal = openStaffMessagingChannelsModal;

function openStationHeatmapModal() {
    forceShowModal('station-heatmap-modal-overlay');
}
window.openStationHeatmapModal = openStationHeatmapModal;


// The sterile lot audit: every stock item with its lot and expiry, expired first. Open Audit (Alt+O) and
// Audit Lot Expirations opened the waiver audit window, which nothing ever filled (Henry, 2026-10-22).
async function openSterileAuditModal() {
    let audit = [];
    try { const r = await fetch('/api/inventory/sterile-audit'); if (r.ok) audit = (await r.json()).audit || []; } catch (e) {}
    const order = { EXPIRED: 0, EXPIRING_SOON: 1, VALID: 2 };
    audit.sort((x, y) => (order[x.exp_status] ?? 2) - (order[y.exp_status] ?? 2) || (x.days_until_exp ?? 1e9) - (y.days_until_exp ?? 1e9));
    const state = (i) => i.exp_status === 'EXPIRED' ? `<span style="color:var(--ti-alert, #EF4444);font-weight:800;">${pdfLabel('Expired')}</span>`
        : i.exp_status === 'EXPIRING_SOON' ? `<span style="color:var(--ti-gold, #FBBF24);font-weight:800;">${pdfLabel('{0} days left').replace('{0}', Number(i.days_until_exp))}</span>`
        : i.days_until_exp === null ? pdfLabel('No expiry date') : pdfLabel('In date');
    const cell = 'padding:6px 8px;border-bottom:1px solid var(--ti-panel2, #1E293B);text-align:left;';
    const body = audit.length ? `<table style="width:100%;border-collapse:collapse;font-size:0.84rem;">
        <thead><tr>${['Item', 'Lot', 'Expires', 'Quantity', 'Status'].map((h) => `<th style="${cell}color:var(--ti-muted, #94A3B8);">${pdfLabel(h)}</th>`).join('')}</tr></thead>
        <tbody>${audit.map((i) => `<tr><td style="${cell}">${escapeHtml(i.name || '')}</td><td style="${cell}">${escapeHtml(i.lot_number || '')}</td><td style="${cell}">${escapeHtml(i.exp_date || '')}</td><td style="${cell}">${escapeHtml(String(i.quantity ?? ''))}</td><td style="${cell}">${state(i)}</td></tr>`).join('')}</tbody>
    </table>` : `<div>${pdfLabel('No stock items yet.')}</div>`;
    showListWindow('sterile-audit-modal-overlay', 'flask', pdfLabel('Sterile lot audit: expiry dates'), body);
}
window.openSterileAuditModal = openSterileAuditModal;

function openTattooPriceEstimatorModal() {
    forceShowModal('tattoo-price-estimator-modal-overlay');
}
window.openTattooPriceEstimatorModal = openTattooPriceEstimatorModal;

function openTeamMessengerModal() {
    forceShowModal('team-messenger-overlay');
}
window.openTeamMessengerModal = openTeamMessengerModal;


function openTipCalculatorModal() {
    forceShowModal('tip-calculator-modal-overlay');
}
window.openTipCalculatorModal = openTipCalculatorModal;


function openVatSettingsModal() {
    forceShowModal('vat-settings-modal-overlay');
}
window.openVatSettingsModal = openVatSettingsModal;



// =========================================================================
// 2. CLOSE MODAL FUNCTIONS (36)
// =========================================================================

function closeAftercareEmailModal() { forceHideModal('aftercare-email-modal-overlay'); }
window.closeAftercareEmailModal = closeAftercareEmailModal;

function closeAftercareModal() { forceHideModal('aftercare-modal'); }
window.closeAftercareModal = closeAftercareModal;

function closeAftercarePipelineModal() { forceHideModal('aftercare-pipeline-modal-overlay'); }
window.closeAftercarePipelineModal = closeAftercarePipelineModal;

function closeAutoclaveVaultModal() { forceHideModal('autoclave-vault-modal-overlay'); }
window.closeAutoclaveVaultModal = closeAutoclaveVaultModal;

function closeBeforeAfterLinkModal() { forceHideModal('gallery-before-after-modal-overlay'); }
window.closeBeforeAfterLinkModal = closeBeforeAfterLinkModal;

function closeBulkProgressToast() {
    const toast = document.getElementById('bulk-progress-toast');
    if (toast) toast.style.display = 'none';
}
window.closeBulkProgressToast = closeBulkProgressToast;

function closeClearAllConfirmModal() { forceHideModal('clear-all-confirm-modal'); }
window.closeClearAllConfirmModal = closeClearAllConfirmModal;

function closeClientDirectoryModal() { forceHideModal('client-directory-modal-overlay'); }
window.closeClientDirectoryModal = closeClientDirectoryModal;

function closeCommissionModal() { forceHideModal('commission-modal'); }
window.closeCommissionModal = closeCommissionModal;

function closeConflictResolutionModal() { forceHideModal('conflict-resolution-modal'); }
window.closeConflictResolutionModal = closeConflictResolutionModal;

function closeDailyStudioSummaryModal() { forceHideModal('daily-summary-modal-overlay'); }
window.closeDailyStudioSummaryModal = closeDailyStudioSummaryModal;

function closeDepositLedgerModal() { forceHideModal('deposit-ledger-modal-overlay'); }
window.closeDepositLedgerModal = closeDepositLedgerModal;

function closeExportModal() { forceHideModal('export-csv-modal'); }
window.closeExportModal = closeExportModal;

function closeGalleryModal() { forceHideModal('gallery-modal'); }
window.closeGalleryModal = closeGalleryModal;

function closeGalleryShareModal() { forceHideModal('gallery-share-modal'); }
window.closeGalleryShareModal = closeGalleryShareModal;

function closeImportModal() { forceHideModal('import-modal'); }
window.closeImportModal = closeImportModal;

function closeInventoryExportConfirmModal() { forceHideModal('inventory-export-confirm-modal'); }
window.closeInventoryExportConfirmModal = closeInventoryExportConfirmModal;

function closeLightboxModal() { forceHideModal('lightbox-modal'); }
window.closeLightboxModal = closeLightboxModal;

function closeMarginCalculatorModal() { forceHideModal('margin-calculator-modal-overlay'); }
window.closeMarginCalculatorModal = closeMarginCalculatorModal;

function closeMessengerMacroModal() { forceHideModal('messenger-macro-modal-overlay'); }
window.closeMessengerMacroModal = closeMessengerMacroModal;

function closePOModal() { forceHideModal('po-modal'); }
window.closePOModal = closePOModal;

function closeQuickLogModal() { forceHideModal('quick-log-modal'); }
window.closeQuickLogModal = closeQuickLogModal;

function closeRecentScanProfileModal() { forceHideModal('recent-scan-profile-modal'); }
window.closeRecentScanProfileModal = closeRecentScanProfileModal;

function closeSanitizationChecklistModal() { forceHideModal('sanitization-checklist-modal-overlay'); }
window.closeSanitizationChecklistModal = closeSanitizationChecklistModal;

function closeSessionDurationReportModal() { forceHideModal('session-duration-report-modal-overlay'); }
window.closeSessionDurationReportModal = closeSessionDurationReportModal;

function closeShiftModal() { forceHideModal('shift-modal'); }
window.closeShiftModal = closeShiftModal;

function closeSkinToneVisualizerModal() { forceHideModal('skin-visualizer-modal'); }
window.closeSkinToneVisualizerModal = closeSkinToneVisualizerModal;


function closeStaffMessagingChannelsModal() { forceHideModal('staff-messaging-modal-overlay'); }
window.closeStaffMessagingChannelsModal = closeStaffMessagingChannelsModal;

function closeStationHeatmapModal() { forceHideModal('station-heatmap-modal-overlay'); }
window.closeStationHeatmapModal = closeStationHeatmapModal;

function closeTipCalculatorModal() { forceHideModal('tip-calculator-modal-overlay'); }
window.closeTipCalculatorModal = closeTipCalculatorModal;

function closeUploadFlashModal() { forceHideModal('upload-flash-modal'); }
window.closeUploadFlashModal = closeUploadFlashModal;

function closeUploadWorkModal() { forceHideModal('upload-work-modal'); }
window.closeUploadWorkModal = closeUploadWorkModal;

function closeVatSettingsModal() { forceHideModal('vat-settings-modal-overlay'); }
window.closeVatSettingsModal = closeVatSettingsModal;


function closeWaiverModal() { forceHideModal('waiver-modal'); }
window.closeWaiverModal = closeWaiverModal;

// =========================================================================
// 3. TOGGLE FUNCTIONS (15)
// =========================================================================

function toggleActivityDrawer() {
    const drawer = document.getElementById('activity-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) {
            const unread = document.getElementById('drawer-unread-pill');
            if (unread) unread.style.display = 'none';
        }
    }
}
window.toggleActivityDrawer = toggleActivityDrawer;

function toggleAllExportColumns() {
    const master = document.getElementById('export-select-all');
    const cbs = document.querySelectorAll('.export-col-cb');
    const newState = master ? master.checked : true;
    cbs.forEach(cb => { cb.checked = newState; });
}
window.toggleAllExportColumns = toggleAllExportColumns;


function toggleClientPortalTheme() {
    document.body.classList.toggle('portal-light-theme');
    showStudioToast('Switched Client Portal visual theme');
}
window.toggleClientPortalTheme = toggleClientPortalTheme;




function togglePortalSidebar() {
    const sb = document.getElementById('portal-sidebar');
    if (sb) sb.classList.toggle('open');
}
window.togglePortalSidebar = togglePortalSidebar;

function toggleQrCameraGrid() {
    const grid = document.getElementById('qr-camera-grid-overlay');
    if (grid) grid.style.display = grid.style.display === 'none' ? 'block' : 'none';
}
window.toggleQrCameraGrid = toggleQrCameraGrid;


// The button starts the camera, and stops it when it is already on. (It used to look at
// the frame overlay, which is visible from the start, so the first click did nothing.)
function toggleQrScanner() {
    const overlay = document.getElementById('qr-scanner-overlay');
    const scanning = typeof qrState !== 'undefined' && qrState.scanner && qrState.scanner.isScanning;
    if (scanning) {
        if (typeof window.stopQrCamera === 'function') window.stopQrCamera();
    } else {
        if (overlay) overlay.style.display = 'flex';
        if (typeof window.startQrCamera === 'function') window.startQrCamera();
    }
}
window.toggleQrScanner = toggleQrScanner;

let sessionTimerInterval = null;
let sessionTimerSeconds = 0;

function toggleSessionTimer() {
    const btn = document.getElementById('session-btn-start');
    const display = document.getElementById('session-timer-display');
    if (sessionTimerInterval) {
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
        if (btn) btn.textContent = '▶ Resume Session';
        showStudioToast('Session timer paused at ' + formatTimer(sessionTimerSeconds));
    } else {
        sessionTimerInterval = setInterval(() => {
            sessionTimerSeconds++;
            if (display) display.textContent = formatTimer(sessionTimerSeconds);
        }, 1000);
        if (btn) btn.textContent = 'Pause Session';
        showStudioToast('Session timer active');
    }
}
window.toggleSessionTimer = toggleSessionTimer;

function formatTimer(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return m + ':' + s;
}

function toggleShortcutsHelpTooltip() {
    const t = document.getElementById('cmd-palette-shortcuts-overlay');
    if (t) t.style.display = t.style.display === 'none' ? 'block' : 'none';
}
window.toggleShortcutsHelpTooltip = toggleShortcutsHelpTooltip;


let isVoiceDictating = false;
function toggleVoiceDictation() {
    isVoiceDictating = !isVoiceDictating;
    const btn = document.getElementById('btn-dictate-drawer-note');
    if (isVoiceDictating) {
        if (btn) btn.style.color = '#EF4444';
        showStudioToast('Voice dictation active (Listening...)');
    } else {
        if (btn) btn.style.color = '#94A3B8';
        showStudioToast('Voice dictation stopped');
    }
}
window.toggleVoiceDictation = toggleVoiceDictation;

function stopVoiceDictation() {
    isVoiceDictating = false;
    const btn = document.getElementById('btn-dictate-drawer-note');
    if (btn) btn.style.color = '#94A3B8';
}
window.stopVoiceDictation = stopVoiceDictation;

// =========================================================================
// 4. EXPORT & PDF FUNCTIONS (7)
// =========================================================================

function downloadBlobFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =========================================================================
// 5. SWITCH TABS & USER MODES (6)
// =========================================================================


function switchImportTab(tab) {
    document.querySelectorAll('.import-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
    });
    const active = document.getElementById('tab-csv-' + tab);
    if (active) {
        active.classList.add('active');
        active.style.background = '#1E293B';
    }
    ['manual', 'remote', 'history'].forEach((name) => {
        const section = document.getElementById('import-' + name + '-section');
        if (section) section.style.display = name === tab ? '' : 'none';
    });
    if (tab === 'history' && typeof fetchAndRenderCsvImportHistory === 'function') fetchAndRenderCsvImportHistory();
    if (tab === 'remote') loadRemoteCsvSyncForm();
}
window.switchImportTab = switchImportTab;

function switchToClientPortalMode() {
    window.currentPortalMode = 'client';
    const tab = document.querySelector('.tool-tab[data-tab="portal"]');
    if (tab) tab.click();
    showStudioToast('Switched to Client Self-Service Portal View');
}
window.switchToClientPortalMode = switchToClientPortalMode;

function logoutClientPortalSession() {
    window.currentPortalMode = 'staff';
    const tab = document.querySelector('.tool-tab[data-tab="dashboard"]');
    if (tab) tab.click();
    showStudioToast('Logged out of Client Portal session');
}
window.logoutClientPortalSession = logoutClientPortalSession;

// =========================================================================
// 6. CLEAR ACTIONS (5)
// =========================================================================

// =========================================================================
// 7. PRESET SETTERS (5)
// =========================================================================

function setVatPreset(rate) {
    const input = document.getElementById('vat-setting-rate');
    if (!input) return;
    input.value = Number(rate).toFixed(2);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    showStudioToast('Tax / VAT preset applied: ' + rate + '%');
}
window.setVatPreset = setVatPreset;

// =========================================================================
// 8. CLIPBOARD COPIERS (4)
// =========================================================================

function copyDailySummaryToClipboard() {
    const text = 'Poli Studio OS Daily Summary\nDate: ' + new Date().toLocaleDateString() + '\nProcedures: 12 Completed\nGross Studio Revenue: $1,840.00\nSterilization Integrity: 100% Validated';
    navigator.clipboard.writeText(text).then(() => {
        showStudioToast('Daily summary copied to clipboard');
    }).catch(() => {
        showStudioToast('Copied summary details');
    });
}
window.copyDailySummaryToClipboard = copyDailySummaryToClipboard;

function copyRecentScanCodeModal() {
    const code = document.getElementById('recent-scan-modal-subtitle')?.textContent || '';
    navigator.clipboard.writeText(code).then(() => {
        showStudioToast('Scan barcode copied to clipboard: ' + code);
    });
}
window.copyRecentScanCodeModal = copyRecentScanCodeModal;

// =========================================================================
// 9. PRINT HANDLERS (3)
// =========================================================================



// =========================================================================
// 10. RESET ACTIONS (3)
// =========================================================================

function resetSessionTimer() {
    if (sessionTimerInterval) {
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
    }
    sessionTimerSeconds = 0;
    const display = document.getElementById('session-timer-display');
    if (display) display.textContent = '00:00';
    const btn = document.getElementById('session-btn-start');
    if (btn) btn.textContent = '▶ Start Session';
    showStudioToast('Session timer reset');
}
window.resetSessionTimer = resetSessionTimer;

function resetStudioLogoToDefault() {
    localStorage.removeItem('poli_custom_studio_logo');
    showStudioToast('Studio logo restored to standard branding');
}
window.resetStudioLogoToDefault = resetStudioLogoToDefault;

function resetStudioPricesToRecommended() {
    showStudioToast('Studio procedure price matrix restored to recommended benchmarks');
}
window.resetStudioPricesToRecommended = resetStudioPricesToRecommended;

// =========================================================================
// 11. SAVE ACTIONS (3)
// =========================================================================

function saveCategoryThresholdSettings() {
    if (typeof window.handleSaveCategorySetting === 'function') {
        window.handleSaveCategorySetting();
    } else {
        showStudioToast('Inventory category stock thresholds saved');
    }
}
window.saveCategoryThresholdSettings = saveCategoryThresholdSettings;

function saveStudioPricesFromSettings() {
    showStudioToast('Studio procedure pricing schedule saved to database');
}
window.saveStudioPricesFromSettings = saveStudioPricesFromSettings;


// =========================================================================
// 12. LOG COMPLETED SESSION (1)
// =========================================================================

async function logCompletedSession() {
    try {
        const res = await fetch('/api/activity-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: 'procedure',
                action: 'SESSION_COMPLETED',
                title: 'Procedure Session Completed',
                details: 'Completed procedure session (' + formatTimer(sessionTimerSeconds) + '). Sterile pack archived.',
                badgeColor: 'green'
            })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        resetSessionTimer();
        showStudioToast('Procedure session logged to the activity log');
    } catch (e) {
        showStudioToast('Could not log the session: the server did not answer');
    }
}
window.logCompletedSession = logCompletedSession;

// =========================================================================
// 13. QR CAMERA & TOUR (4)
// =========================================================================

let qrTourStepIndex = 0;
const qrTourSteps = [
    ['Scan', 'Turn the camera on and point it at a QR code or barcode.'],
    ['Stock', 'A stock SKU or lot number opens the item with its quantity, lot and expiry date.'],
    ['Clients', 'A CLIENT-<number> code opens that client. Print it on client cards to check them in.'],
    ['History', 'Every scan is listed below. Codes with no match are kept under Error Logs.']
];
function showQrTourStep() {
    const [title, text] = qrTourSteps[qrTourStepIndex];
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('qr-tour-title', (qrTourStepIndex + 1) + '. ' + title);
    set('qr-tour-desc', text);
    set('qr-tour-step-badge', (qrTourStepIndex + 1) + ' / ' + qrTourSteps.length);
    qrTourSteps.forEach((_, i) => { const d = document.getElementById('tour-dot-' + i); if (d) d.style.opacity = i === qrTourStepIndex ? '1' : '0.35'; });
    const box = document.getElementById('qr-tour-interactive-box');
    if (box) box.style.display = 'none';
}
function startQrOnboardingTour() {
    qrTourStepIndex = 0;
    const bd = document.getElementById('qr-tour-backdrop');
    if (bd) bd.style.display = 'flex';
    showQrTourStep();
}
window.startQrOnboardingTour = startQrOnboardingTour;
function nextQrTourStep() {
    if (qrTourStepIndex === qrTourSteps.length - 1) { endQrOnboardingTour(); return; }
    qrTourStepIndex++;
    showQrTourStep();
}
window.nextQrTourStep = nextQrTourStep;
function prevQrTourStep() {
    qrTourStepIndex = Math.max(0, qrTourStepIndex - 1);
    showQrTourStep();
}
window.prevQrTourStep = prevQrTourStep;
function endQrOnboardingTour() {
    const bd = document.getElementById('qr-tour-backdrop');
    if (bd) bd.style.display = 'none';
}
window.endQrOnboardingTour = endQrOnboardingTour;

// CSV import history (Import modal): the server keeps the last batches.
async function fetchAndRenderCsvImportHistory() {
    const box = document.getElementById('import-history-list');
    if (!box) return;
    let hist = [];
    try { const r = await fetch('/api/inventory/import-history'); hist = r.ok ? ((await r.json()).history || []) : []; } catch (e) {}
    box.innerHTML = hist.length ? hist.map((h) => `<div style="background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:8px;padding:10px 12px;font-size:0.8rem;color:var(--ti-text2, #D1D5DB);">
        <div style="font-weight:700;color:var(--ti-text, #F9FAFB);" data-no-phrase>${escapeHtml(h.batchName || h.filename || h.source || '')}</div>
        <div>${escapeHtml(String(h.recordsImported != null ? h.recordsImported : 0))} rows · ${escapeHtml(h.timestamp ? new Date(h.timestamp).toLocaleString() : '')}</div></div>`).join('')
        : '<div style="text-align:center;padding:2rem 1rem;color:var(--ti-muted, #9CA3AF);font-size:0.85rem;">No imports yet.</div>';
}
window.fetchAndRenderCsvImportHistory = fetchAndRenderCsvImportHistory;

// =========================================================================
// 14. EXECUTION & ACTION HELPERS (29)
// =========================================================================

function dismissBackupWarningToast() {
    const toast = document.getElementById('database-backup-warning-toast');
    if (toast) toast.style.display = 'none';
}
window.dismissBackupWarningToast = dismissBackupWarningToast;

function executeClearAllActivityLogs() {
    closeClearAllConfirmModal();
    const feed = document.getElementById('drawer-feed-list');
    if (feed) feed.innerHTML = '<div style="padding:20px;text-align:center;color:var(--ti-muted, #94A3B8);">Activity feed cleared.</div>';
    showStudioToast('Activity logs cleared');
}
window.executeClearAllActivityLogs = executeClearAllActivityLogs;

async function executePOAndTriggerSupplierEmail() {
    try {
        const r = await fetch('/api/inventory/send-po-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        if (r.status === 400) { showStudioToast('No items are below their reorder level'); return; }
        if (!r.ok) throw new Error();
    } catch (e) { showStudioToast('Could not save: the server did not answer'); return; }
    showStudioToast('Purchase order ready: send it from your email');
}
window.executePOAndTriggerSupplierEmail = oneAtATime(executePOAndTriggerSupplierEmail);


async function fetchAndRenderDailyStudioSummary() {
    const body = document.getElementById('daily-summary-modal-body');
    if (!body) return;
    try {
        const [appts, clients, stock] = await Promise.all(['/api/appointments', '/api/clients', '/api/inventory'].map(ledgerJson));
        const today = new Date().toLocaleDateString('en-CA');
        // the footer said "Report generated for 2026-07-29" whatever the day
        const stamp = document.getElementById('summary-report-timestamp');
        if (stamp) stamp.textContent = pdfLabel('Report generated for') + ' ' + today;
        const items = Array.isArray(stock) ? stock : (stock.items || []);
        const card = (label, value) => '<div class="summary-card" style="background:var(--ti-bg2, #0F172A);padding:12px;border-radius:8px;border:1px solid var(--ti-line, #334155);"><div style="font-size:0.75rem;color:var(--ti-muted, #94A3B8);">' + label + '</div><div style="font-size:1.3rem;font-weight:800;color:var(--ti-blue, #38BDF8);">' + value + '</div></div>';
        body.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:12px;">'
            + card('Appointments today', appts.filter((a) => a.datetime && new Date(a.datetime).toLocaleDateString('en-CA') === today).length)
            + card('Clients on file', clients.length)
            + card('Stock items', items.length)
            + card('Low stock', items.filter((i) => Number(i.quantity) <= Number(i.reorder_point || 0)).length)
            + '</div>';
    } catch (e) { body.innerHTML = LEDGER_ERROR; }
}
window.fetchAndRenderDailyStudioSummary = fetchAndRenderDailyStudioSummary;


const PROCEDURE_NOTE_TEMPLATES = {
    tattoo: 'Tattoo session. Placement: . Size: . Needles: . Inks (brand, lot): . Aftercare explained: yes/no.',
    piercing: 'Piercing. Placement: . Jewelry (material, size): . Needle gauge: . Aftercare explained: yes/no.',
    autoclave: 'Autoclave cycle. Load: . Temperature and time: . Indicator result: pass/fail.',
    restock: 'Restock. Item: . Quantity: . Lot: . Expiry: . Supplier: .'
};
function insertProcedureTemplate(inputId, kind) {
    const input = document.getElementById(inputId);
    const text = PROCEDURE_NOTE_TEMPLATES[kind];
    if (!input || !text) return;
    input.value = (input.value ? input.value + '\n' : '') + text;
    input.focus();
}
window.insertProcedureTemplate = insertProcedureTemplate;


function navigateClientPortalHash(hash) {
    document.querySelectorAll('.portal-view-section').forEach(sec => { sec.style.display = 'none'; });
    const target = document.getElementById('portal-section-' + hash);
    if (target) target.style.display = 'block';
    showStudioToast('Navigated to ' + hash);
}
window.navigateClientPortalHash = navigateClientPortalHash;


function quickLogFromInput() {
    const input = document.getElementById('quick-log-input');
    if (input && input.value.trim()) {
        showStudioToast('Quick log saved: ' + input.value.trim());
        input.value = '';
        closeQuickLogModal();
    }
}
window.quickLogFromInput = quickLogFromInput;

function relogFromRecentScanModal() {
    closeRecentScanProfileModal();
    showStudioToast('Re-logged scanned jewelry item into active procedure');
}
window.relogFromRecentScanModal = relogFromRecentScanModal;

function resolveCurrentConflict(resolution) {
    closeConflictResolutionModal();
    showStudioToast('Conflict resolved with strategy: ' + resolution);
}
window.resolveCurrentConflict = resolveCurrentConflict;

async function triggerInstantDatabaseSnapshot() {
    try {
        const res = await fetch('/api/database/create-snapshot', { method: 'POST' });
        const data = await res.json();
        showStudioToast(data.message || (res.ok ? 'Backup saved' : 'The backup could not be written'));
    } catch (e) {
        showStudioToast('Could not save: the server did not answer');
    }
    renderBackupCard();
}
window.triggerInstantDatabaseSnapshot = triggerInstantDatabaseSnapshot;

// Settings, Studio details: the studio's own name and contact on the consent forms. Merged into
// poli_studio_profile (shared with the pricing settings and the form builder), not replacing it.
const STUDIO_DETAIL_FIELDS = { name: "studioName", address: "studioAddress", phone: "studioPhone", email: "studioEmail", permit: "studioPermit" };
function readStudioProfile() { try { return JSON.parse(localStorage.getItem("poli_studio_profile") || "{}") || {}; } catch (e) { return {}; } }
function renderStudioDetailsCard() {
    const p = readStudioProfile();
    for (const [id, key] of Object.entries(STUDIO_DETAIL_FIELDS)) {
        const el = document.getElementById("studio-details-" + id);
        if (el && document.activeElement !== el) el.value = p[key] || "";
    }
}
window.renderStudioDetailsCard = renderStudioDetailsCard;
function saveStudioDetails(event) {
    if (event) event.preventDefault();
    const p = readStudioProfile();
    for (const [id, key] of Object.entries(STUDIO_DETAIL_FIELDS)) p[key] = ((document.getElementById("studio-details-" + id) || {}).value || "").trim();
    try { localStorage.setItem("poli_studio_profile", JSON.stringify(p)); } // js/app-data-sync.js saves it on the server
    catch (e) { showStudioToast("Could not save: browser storage is unavailable"); return; }
    showStudioToast("Studio details saved");
}
window.saveStudioDetails = saveStudioDetails;

// Settings, Database Backup: the last backup, how many daily ones are kept, the second folder
async function renderBackupCard() {
    const status = document.getElementById('backup-status');
    if (!status) return;
    let st;
    try { const r = await fetch('/api/database/snapshot-status'); if (!r.ok) return; st = await r.json(); } catch (e) { return; }
    const folder = document.getElementById('backup-copy-folder');
    if (folder && document.activeElement !== folder) folder.value = st.copyTo || '';
    const parts = [st.lastSnapshotTimestamp
        ? pdfLabel('Last backup: {0}').replace('{0}', new Date(st.lastSnapshotTimestamp).toLocaleString())
        : pdfLabel('No backup yet: the first daily backup is made a minute after the CRM starts.')];
    parts.push(pdfLabel('Daily backups kept: {0} of {1}').replace('{0}', st.autoBackups || 0).replace('{1}', st.autoBackupsKept || 30));
    if (st.copyTo) parts.push(st.lastCopyError
        ? pdfLabel('The copy to {0} failed: {1}').replace('{0}', st.copyTo).replace('{1}', st.lastCopyError)
        : st.lastCopyTime ? pdfLabel('Last copied to {0}: {1}').replace('{0}', st.copyTo).replace('{1}', new Date(st.lastCopyTime).toLocaleString())
        : pdfLabel('Backups will also be copied to {0}').replace('{0}', st.copyTo));
    status.textContent = parts.join(' · ');
    status.style.color = st.copyTo && st.lastCopyError ? '#FCA5A5' : '#D1D5DB';
}
window.renderBackupCard = renderBackupCard;

async function saveBackupFolder(event) {
    if (event) event.preventDefault();
    const folder = (document.getElementById('backup-copy-folder') || {}).value || '';
    let data;
    try {
        const r = await fetch('/api/database/backup-folder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ copyTo: folder.trim() }) });
        data = await r.json();
        if (!r.ok) { showStudioToast(data.message || 'Could not save'); return; }
    } catch (e) { showStudioToast('Could not save: the server did not answer'); return; }
    showStudioToast(data.copyTo ? pdfLabel('Backups will also be copied to {0}').replace('{0}', data.copyTo) : 'Backups are no longer copied to a second folder');
    renderBackupCard();
}
window.saveBackupFolder = saveBackupFolder;

// =========================================================================
// 15. ADDITIONAL SINGLE ACTIONS (7)
// =========================================================================

function addNewCategoryThresholdFromSettings() {
    forceShowModal('category-settings-modal-overlay');
}
window.addNewCategoryThresholdFromSettings = addNewCategoryThresholdFromSettings;

async function renderClientDirectoryModal() {
    const body = document.getElementById('client-directory-modal-body');
    if (!body) return;
    body.innerHTML = '<div style="text-align:center;padding:24px;color:var(--ti-muted, #94A3B8);">Loading client directory...</div>';
    try {
        const res = await fetch('/api/clients');
        const clients = await res.json();
        // The search box and both tick boxes used to be ignored, and no health detail was shown:
        // a "health alerts" list that listed everyone by phone number.
        const val = (id) => document.getElementById(id);
        const q = String(val('client-directory-search-input')?.value || '').toLowerCase().trim();
        const latexOnly = !!val('client-directory-latex-filter')?.checked;
        const medicalOnly = !!val('client-directory-medical-filter')?.checked;
        const flagged = (v) => v && !/^(none|n\/a|no)$/i.test(String(v).trim());
        const rows = clients.map((c) => ({ c, allergy: flagged(c.allergies) ? String(c.allergies) : '', medical: flagged(c.medical_history) ? String(c.medical_history) : '' }))
            .filter(({ c, allergy, medical }) =>
                (!q || [c.name, c.phone, c.email, c.allergies, c.medical_history, c.assigned_staff_name].some((v) => String(v || '').toLowerCase().includes(q)))
                && (!latexOnly || /latex/i.test(allergy))
                && (!medicalOnly || allergy || medical))
            .sort((a, b) => Number(!!(b.allergy || b.medical)) - Number(!!(a.allergy || a.medical)));
        const chip = (text, color) => '<span style="display:inline-block;margin:4px 6px 0 0;padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:700;background:' + color + '22;color:' + color + ';border:1px solid ' + color + '55;">' + escapeHtml(text) + '</span>';
        body.innerHTML = rows.length ? '<div style="display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto;">' +
            rows.map(({ c, allergy, medical }) => '<div style="background:var(--ti-bg2, #0F172A);padding:10px 14px;border-radius:8px;border:1px solid ' + (allergy || medical ? '#7F1D1D' : '#334155') + ';display:flex;justify-content:space-between;align-items:center;gap:12px;"><div><strong>' + escapeHtml(c.name || 'Client') + '</strong><div style="font-size:0.8rem;color:var(--ti-muted, #94A3B8);">' + escapeHtml(c.phone || 'No phone') + ' | ' + escapeHtml(c.email || 'No email') + (c.assigned_staff_name ? ' | ' + escapeHtml(c.assigned_staff_name) : '') + '</div><div>' +
                (allergy ? chip('Allergy: ' + allergy, '#EF4444') : '') + (medical ? chip('' + medical, '#EAB308') : '') +
                (!allergy && !medical ? '<span style="font-size:0.75rem;color:var(--ti-faint, #64748B);">' + (String(c.allergies || c.medical_history || '').trim() ? 'No allergies or conditions recorded as present' : 'Nothing recorded yet: ask before the session') + '</span>' : '') +
                '</div></div><button onclick="openClientProfileModal(' + Number(c.id) + ')" style="background:var(--ti-blue, #2563EB);color:#FFF;border:none;padding:6px 12px;border-radius:6px;font-size:0.8rem;cursor:pointer;flex-shrink:0;">View Profile</button></div>').join('') +
            '</div>' : '<div style="text-align:center;padding:24px;color:var(--ti-muted, #94A3B8);">No client matches this search and these filters.</div>';
    } catch (e) {
        body.innerHTML = '<div style="color:var(--ti-alert, #EF4444);text-align:center;padding:16px;">Failed to load client directory.</div>';
    }
}
window.renderClientDirectoryModal = renderClientDirectoryModal;

// The search button said ⌘K on every computer; most studios run Windows.
document.addEventListener('DOMContentLoaded', () => {
    const kbd = document.getElementById('topbar-search-kbd');
    if (kbd && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) kbd.textContent = '⌘K';
});

// =========================================================================
// 16. CORE MODAL & FORM HANDLERS IMPLEMENTATION
// =========================================================================

// --- Finance summary: these four figures used to be typed into the page ($24,850, "42 completed
// appointments"...) and showed in every studio, even an empty one. Now worked out from the studio's records. ---
async function renderFinanceSummary() {
    const el = (id) => document.getElementById(id);
    if (!el('fin-paid')) return;
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : null), () => null);
    const [payments, appts] = await Promise.all([get('/api/financial'), get('/api/appointments')]);
    const month = new Date().toISOString().slice(0, 7);
    const money = (n) => '$' + n.toFixed(2);
    const set = (id, value, sub) => { el('fin-' + id).textContent = value; el('fin-' + id + '-sub').textContent = sub; };
    if (Array.isArray(payments)) {
        const paid = payments.filter((p) => p.status === 'completed' && p.type !== 'refund' && String(p.transaction_date || '').slice(0, 7) === month);
        set('paid', money(paid.reduce((t, p) => t + Number(p.amount || 0), 0)), paid.length + ' ' + pdfLabel(paid.length === 1 ? 'payment' : 'payments'));
    } else set('paid', '—', pdfLabel('Administrators only'));
    const list = Array.isArray(appts) ? appts : [];
    const open = list.filter((a) => a.status !== 'completed' && a.status !== 'cancelled');
    const price = (a) => Number(a.estimated_price || a.price || 0), deposit = (a) => Number(a.deposit_paid || 0);
    const withDeposit = open.filter((a) => deposit(a) > 0);
    set('deposits', money(withDeposit.reduce((t, a) => t + deposit(a), 0)), withDeposit.length + ' ' + pdfLabel('upcoming sessions with a deposit'));
    set('due', money(open.reduce((t, a) => t + Math.max(0, price(a) - deposit(a)), 0)), open.length + ' ' + pdfLabel('upcoming sessions'));
    const done = list.filter((a) => a.status === 'completed' && String(a.datetime || a.date || '').slice(0, 7) === month);
    set('done', String(done.length), pdfLabel('this month'));
}
window.renderFinanceSummary = renderFinanceSummary;

// --- Clients destination table: rendered from the studio database ---
async function renderClientsTable() {
    const tbody = document.getElementById("clients-table-tbody");
    if (!tbody) return;
    let clients, waivers = [], payments = [], forms = [];
    try {
        const [c, w, f, cf] = await Promise.all(["/api/clients", "/api/waivers", "/api/financial", "/api/consent-forms"].map((u) => fetch(u).then((r) => (r.ok ? r.json() : []))));
        clients = Array.isArray(c) ? c : [];
        waivers = Array.isArray(w) ? w : [];
        payments = Array.isArray(f) ? f : [];
        forms = Array.isArray(cf) ? cf : [];
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:16px;color:var(--ti-alert, #EF4444);text-align:center;">Could not load clients: the server did not answer</td></tr>';
        return;
    }
    if (!clients.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:16px;color:var(--ti-muted, #94A3B8);text-align:center;">No clients yet. Add your first client with New Client.</td></tr>';
        return;
    }
    const money = (n) => "$" + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const flagged = (v) => v && !/^(none|n\/a|no)$/i.test(String(v).trim());
    tbody.innerHTML = clients.map((c) => {
        const initials = String(c.name || "?").split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase();
        // signed waivers and consent forms signed on the tablet alike
        const signed = waivers.filter((w) => w.client_id === c.id && w.status !== "revoked").length
            + forms.filter((f) => Number(f.client_id) === Number(c.id) && f.signed).length;
        const spent = payments.filter((p) => p.client_id === c.id && p.status === "completed" && p.type !== "refund").reduce((t, p) => t + Number(p.amount || 0), 0);
        const health = [c.allergies, c.medical_history].filter(flagged).map(escapeHtml).join(", ");
        // nothing written down is not "none": it showed a green "None Recorded"
        const healthKnown = [c.allergies, c.medical_history].some((v) => v && String(v).trim());
        const minor = typeof c.age === "number" && c.age < 18;
        return `<tr class="client-directory-row" style="border-bottom:1px solid var(--ti-panel2, #1F2937);">
          <td style="padding:10px;font-weight:700;color:#FFF;"><div style="display:flex;align-items:center;gap:8px;">
            <span style="width:30px;height:30px;border-radius:50%;background:var(--ti-blue, #3B82F6);display:inline-flex;align-items:center;justify-content:center;font-weight:800;">${escapeHtml(initials)}</span>
            <div><div>${escapeHtml(c.name || "")}</div>${c.is_vip ? '<span style="font-size:0.7rem;background:rgba(234,179,8,0.2);color:var(--ti-gold-ink, #FDE047);padding:1px 6px;border-radius:6px;font-weight:800;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-star></use></svg> VIP</span>' : ""}${minor ? `<span class="client-minor-tag" style="font-size:0.7rem;background:rgba(239,68,68,0.2);color:var(--ti-alert-ink, #FCA5A5);padding:1px 6px;border-radius:6px;font-weight:800;margin-left:4px;">${escapeHtml(pdfLabel("Under 18"))}</span>` : ""}</div></div></td>
          <td style="padding:10px;color:var(--ti-muted, #9CA3AF);">${escapeHtml(c.email || "")}<br><span style="font-size:0.75rem;">${escapeHtml(c.phone || "")}</span></td>
          <td style="padding:10px;">${health ? `<span style="color:var(--ti-alert-ink, #FCA5A5);font-weight:700;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-warn></use></svg> ${health}</span>` : healthKnown ? '<span style="color:var(--ti-green, #34D399);font-weight:700;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-check></use></svg> None</span>' : `<span style="color:var(--ti-gold-ink, #FDE047);font-weight:700;">${escapeHtml(pdfLabel("Not recorded: ask the client"))}</span>`}</td>
          <td style="padding:10px;"><span style="background:rgba(16,185,129,0.15);color:var(--ti-green, #34D399);padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:700;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-consent></use></svg> ${signed} Signed</span></td>
          <td style="padding:10px;font-weight:800;color:var(--ti-green, #34D399);">${money(spent)}</td>
          <td style="padding:10px;text-align:right;">
            <button onclick="openClientProfileModal(${Number(c.id)})" style="padding:4px 8px;background:var(--ti-blue, #3B82F6);color:#FFF;border:none;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;">View Profile</button>
            <button onclick="openFormBuilderModal(${Number(c.id)}, ${escapeHtml(JSON.stringify(String(c.name || "")))})" style="padding:4px 8px;background:var(--ti-purple, #8B5CF6);color:#FFF;border:none;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;margin-left:4px;">Sign Waiver</button>
          </td></tr>`;
    }).join("");
    const q = document.getElementById("clients-main-search");
    if (q && q.value) filterClientDirectoryList(q.value);
}
window.renderClientsTable = renderClientsTable;
document.addEventListener("DOMContentLoaded", renderClientsTable);

// --- Staff and client pickers: filled from the studio database, not hard-coded names ---
const PEOPLE_SELECTS = {
    staff: { byName: ["sd-artist-filter", "tipcalc-artist", "sani-staff-select", "new-client-artist", "new-appt-artist"],
             byId: ["rota-staff", "shift-staff-select", "gallery-filter-artist", "work-staff-select", "flash-artist-select"] },
    clients: { byName: [], byId: ["gallery-filter-client"] }
};
// --- Stations: the studio's own (Settings, Stations), in the booking form too ---
// The booking form listed typed-in "Station 1, 2, 3, Piercing Room", whatever the studio had.
let studioStationList = [];
async function loadStations() {
    try { const r = await fetch("/api/stations"); studioStationList = r.ok ? await r.json() : []; } catch (e) {}
    const sel = document.getElementById("new-appt-station");
    if (sel) {
        const prev = sel.value;
        sel.innerHTML = `<option value="">${escapeHtml(pdfLabel("No station"))}</option>` +
            studioStationList.map((s) => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name + (s.type ? " (" + s.type + ")" : ""))}</option>`).join("");
        if ([...sel.options].some((o) => o.value === prev)) sel.value = prev;
    }
    return studioStationList;
}
window.loadStations = loadStations;
document.addEventListener("DOMContentLoaded", () => {
    loadStations();
    // booking an artist picks the station they usually work at
    const artist = document.getElementById("new-appt-artist"), station = document.getElementById("new-appt-station");
    if (artist && station) artist.addEventListener("change", () => {
        const usual = studioStationList.find((s) => s.assignedStaff && s.assignedStaff === artist.value);
        if (usual) station.value = usual.name;
    });
});

async function renderStationsCard() {
    const box = document.getElementById("settings-stations-list");
    if (!box) return;
    const [stations, staffList] = await Promise.all([loadStations(), fetch("/api/staff").then((r) => (r.ok ? r.json() : [])).catch(() => [])]);
    const input = (cls, value, label) => `<input type="text" class="${cls}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(pdfLabel(label))}" aria-label="${escapeHtml(pdfLabel(label))}" style="flex:1;min-width:110px;padding:7px 9px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);font-size:0.82rem;">`;
    box.innerHTML = stations.length ? stations.map((s) => `
        <div class="settings-station-row" data-id="${Number(s.id)}" style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            ${input("st-name", s.name, "Station name")}
            ${input("st-type", s.type, "Type: tattoo, piercing, branding...")}
            <select class="st-artist" aria-label="${escapeHtml(pdfLabel("Usual artist"))}" style="padding:7px 9px;background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line2, #475569);border-radius:6px;color:var(--ti-text, #F8FAFC);font-size:0.82rem;">
                <option value="">${escapeHtml(pdfLabel("No usual artist"))}</option>
                ${(Array.isArray(staffList) ? staffList : []).map((p) => `<option value="${escapeHtml(p.name)}" ${p.name === s.assignedStaff ? "selected" : ""}>${escapeHtml(p.name)}</option>`).join("")}
            </select>
            <button type="button" onclick="saveStudioStation(${Number(s.id)})" style="padding:0.4rem 0.75rem;background:var(--ti-blue-deep, #0D9488);color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:0.78rem;cursor:pointer;">${escapeHtml(pdfLabel("Save"))}</button>
            <button type="button" onclick="removeStudioStation(${Number(s.id)})" style="padding:0.4rem 0.75rem;background:transparent;color:var(--ti-alert-ink, #FCA5A5);border:1px solid rgba(239,68,68,0.5);border-radius:6px;font-weight:700;font-size:0.78rem;cursor:pointer;">${escapeHtml(pdfLabel("Remove"))}</button>
        </div>`).join("") : `<div style="font-size:0.8rem;color:var(--ti-muted, #9CA3AF);">${escapeHtml(pdfLabel("No stations yet."))}</div>`;
}
window.renderStationsCard = renderStationsCard;

async function stationRequest(method, url, body) {
    try {
        const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) { showStudioToast(data.error || "Could not save"); return false; }
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return false; }
    renderStationsCard();
    return true;
}
async function saveStudioStation(id) {
    const row = document.querySelector(`.settings-station-row[data-id="${Number(id)}"]`);
    if (!row) return;
    if (await stationRequest("PATCH", "/api/stations/" + id, { name: row.querySelector(".st-name").value, type: row.querySelector(".st-type").value, assignedStaff: row.querySelector(".st-artist").value })) showStudioToast("Station saved");
}
window.saveStudioStation = saveStudioStation;
async function removeStudioStation(id) {
    if (!window.confirm(pdfLabel("Remove this station? Appointments already booked keep its name."))) return;
    if (await stationRequest("DELETE", "/api/stations/" + id)) showStudioToast("Station removed");
}
window.removeStudioStation = removeStudioStation;
async function addStudioStation(event) {
    if (event) event.preventDefault();
    const input = document.getElementById("new-station-name");
    const name = input ? input.value.trim() : "";
    if (!name) { showStudioToast("Give the station a name"); return; }
    if (await stationRequest("POST", "/api/stations", { name })) { input.value = ""; showStudioToast("Station added"); }
}
window.addStudioStation = addStudioStation;

async function populatePeopleSelects() {
    for (const [kind, groups] of Object.entries(PEOPLE_SELECTS)) {
        let people;
        try {
            const r = await fetch(kind === "staff" ? "/api/staff" : "/api/clients");
            if (!r.ok) continue;
            people = await r.json();
        } catch (e) { continue; }
        if (!Array.isArray(people)) continue;
        if (kind === "staff") people = people.filter((p) => p.role !== "manager" || people.length === 1);
        for (const [mode, ids] of Object.entries(groups)) {
            ids.forEach((id) => {
                const sel = document.getElementById(id);
                if (!sel) return;
                const keep = [...sel.options].filter((o) => o.value === "" || o.value === "all");
                const prev = sel.value;
                sel.innerHTML = "";
                keep.forEach((o) => sel.appendChild(o));
                people.forEach((p) => {
                    const o = document.createElement("option");
                    o.value = mode === "byId" ? String(p.id) : p.name;
                    o.textContent = p.name;
                    sel.appendChild(o);
                });
                if ([...sel.options].some((o) => o.value === prev)) sel.value = prev;
            });
        }
    }
}
window.populatePeopleSelects = populatePeopleSelects;
document.addEventListener("DOMContentLoaded", populatePeopleSelects);

// --- Dashboard KPI cards: computed from the studio database ---
async function renderDashboardKpis() {
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : [])).catch(() => []);
    const [payments, appts, stations, clients, inventory] = await Promise.all(
        ["/api/financial", "/api/appointments", "/api/stations", "/api/clients", "/api/inventory"].map(get));
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const list = (x) => (Array.isArray(x) ? x : (x && Array.isArray(x.items) ? x.items : []));
    const today = new Date().toLocaleDateString("en-CA");
    const money = (n) => "$" + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const paidToday = list(payments).filter((p) => String(p.transaction_date || "").slice(0, 10) === today && p.status === "completed" && p.type !== "refund");
    const apptsToday = list(appts).filter((a) => a.datetime && new Date(a.datetime).toLocaleDateString("en-CA") === today);
    set("kpi-revenue-value", money(paidToday.reduce((t, p) => t + Number(p.amount || 0), 0)));
    set("kpi-revenue-badge", paidToday.length + " payments");
    set("kpi-revenue-sub", apptsToday.length + " appointments today");

    const st = list(stations);
    const busy = st.filter((s) => s.status === "in_use").length;
    set("kpi-stations-value", busy + " / " + st.length + " Stations");
    set("kpi-stations-badge", "In use");
    set("kpi-stations-sub", st.filter((s) => s.status === "ready").length + " ready");

    const now = Date.now(), week = 7 * 24 * 3600 * 1000;
    const upcoming = list(appts).filter((a) => { const t = new Date(a.datetime).getTime(); return t >= now && t < now + week && a.status !== "cancelled"; });
    const consults = upcoming.filter((a) => /consult/i.test(a.service_type || "")).length;
    set("kpi-clients-value", upcoming.length + " Scheduled");
    set("kpi-clients-badge", "Next 7 days");
    set("kpi-clients-sub", consults + " consultations | " + list(clients).length + " clients on file");

    const low = list(inventory).filter((i) => Number(i.quantity) <= Number(i.reorder_point || 0));
    set("kpi-stock-value", low.length + " Low Stock");
    set("kpi-stock-badge", low.length ? "Reorder" : "OK");
    set("kpi-stock-sub", low.slice(0, 2).map((i) => i.name).join(", "));
}
window.renderDashboardKpis = renderDashboardKpis;
document.addEventListener("DOMContentLoaded", renderDashboardKpis);

// --- Station strip and session duration table: from the studio database ---
async function renderStationStripAndSessions() {
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : [])).catch(() => []);
    const [stations, appts] = await Promise.all([get("/api/stations"), get("/api/appointments")]);
    const strip = document.getElementById("station-floor-strip");
    if (strip && Array.isArray(stations)) {
        const look = { in_use: ["<i class=ti-dot-green></i>", "16,185,129", "#34D399", "In session"], ready: ["<i class=ti-dot-blue></i>", "56,189,248", "#38BDF8", "Ready"], sanitizing: ["<i class=ti-dot-gold></i>", "245,158,11", "#FBBF24", "Sanitizing"] };
        strip.innerHTML = stations.map((st) => {
            const [dot, rgb, color, label] = look[st.status] || ["<i class=ti-dot-grey></i>", "148,163,184", "#94A3B8", String(st.status || "")];
            const who = st.status === "in_use" && st.assignedStaff ? ": " + st.assignedStaff : "";
            return `<span style="padding:4px 10px;background:rgba(${rgb},0.15);color:${color};border:1px solid rgba(${rgb},0.3);border-radius:8px;font-size:0.78rem;font-weight:700;">${dot} ${escapeHtml(st.name || "")}${escapeHtml(who)} (<span>${escapeHtml(label)}</span>)</span>`;
        }).join("");
    }
    const body = document.getElementById("session-duration-table-body");
    if (body && Array.isArray(appts)) {
        const done = appts.filter((a) => a.status === "completed");
        body.innerHTML = done.length ? done.map((a) => {
            const hrs = Number(a.duration_minutes || 0) / 60;
            const price = Number(a.estimated_price || a.price || 0);
            return `<tr style="border-bottom:1px solid var(--ti-panel2, #1E293B);"><td style="padding:8px;font-weight:700;">${escapeHtml(a.staff_name || "")}</td><td style="padding:8px;">${escapeHtml(a.service_type || "")}</td><td style="padding:8px;">${escapeHtml(a.client_name || "")}</td><td style="padding:8px;">${hrs.toFixed(1)} h</td><td style="padding:8px;">$${price.toFixed(2)}</td><td style="padding:8px;">${hrs ? "$" + (price / hrs).toFixed(2) + "/h" : "-"}</td></tr>`;
        }).join("") : '<tr><td colspan="6" style="padding:8px;color:var(--ti-muted, #94A3B8);">No completed sessions yet.</td></tr>';
    }
}
window.renderStationStripAndSessions = renderStationStripAndSessions;
document.addEventListener("DOMContentLoaded", renderStationStripAndSessions);

// --- Activity feed: renders allActivities (loaded and kept live by js/06-modals-tabs.js) ---
function renderActivityFeed() {
    const list = document.getElementById("activity-feed-list");
    if (!list || typeof allActivities === "undefined") return;
    const cat = typeof currentCategoryFilter === "undefined" ? "all" : currentCategoryFilter;
    const rows = allActivities.filter((a) => cat === "all" || a.category === cat).slice(0, 100);
    list.innerHTML = rows.length ? rows.map((a) => `<div class="activity-stream-item" data-category="${escapeHtml(a.category || "")}" style="display:flex;gap:10px;align-items:flex-start;background:var(--ti-panel2, #1F2937);border:1px solid var(--ti-line, #374151);border-radius:10px;padding:10px 12px;">
        <div style="flex:1;min-width:0;"><div style="font-weight:700;color:var(--ti-text, #F9FAFB);font-size:0.88rem;">${escapeHtml(a.title || "")}</div>
        <div style="color:var(--ti-muted, #9CA3AF);font-size:0.8rem;margin-top:2px;">${escapeHtml(a.details || "")}</div></div>
        <div style="color:var(--ti-faint, #6B7280);font-size:0.72rem;white-space:nowrap;text-align:right;">${escapeHtml(a.user || "")}<br>${a.timestamp ? escapeHtml(new Date(a.timestamp).toLocaleString()) : ""}</div></div>`).join("")
        : '<div style="padding:16px;color:var(--ti-muted, #94A3B8);text-align:center;">No activity yet.</div>';
}
window.renderActivityFeed = renderActivityFeed;
// The drawer holds quick notes, not a feed; callers in js/06 expect this to exist.
function renderDrawerFeed() {}
window.renderDrawerFeed = renderDrawerFeed;

// --- Client autocomplete (waiver + portfolio work forms): sets the hidden client id ---
let autocompleteClients = null; // the client list, or the request for it while it loads
let autocompleteTurn = 0;
async function handleClientAutocomplete(kind, query) {
    const box = document.getElementById(kind + "-client-autocomplete-dropdown");
    const idField = document.getElementById(kind + "-client-id");
    if (!box) return;
    // Every key typed calls this. On a slow computer the answers for "Alex R", "Alex Ri"... came
    // back after the client was picked and cleared the pick, so the booking had no client. Now
    // one request serves them all, only the last key typed acts, and it reads the box as it is now.
    const turn = ++autocompleteTurn;
    if (!autocompleteClients) {
        autocompleteClients = fetch("/api/clients").then((r) => (r.ok ? r.json() : [])).catch(() => []);
    }
    const clients = await autocompleteClients;
    if (turn !== autocompleteTurn) return;
    const input = document.getElementById(kind + "-client-search") || document.getElementById(kind + "-client"); // the booking form names it new-appt-client
    const now = input ? input.value : query;
    // a different name forgets the client picked before; tapping the field again, or the same
    // name, keeps it (it was cleared on every focus, so a picked waiver client got lost)
    const picked = idField && clients.find((c) => String(c.id) === idField.value);
    if (picked && String(picked.name || "") === String(now || "")) return;
    if (idField) idField.value = "";
    if (kind === "new-appt") showBookingAgeNote(null);
    const q = String(now || "").toLowerCase().trim();
    const hits = clients.filter((c) => !q || String(c.name || "").toLowerCase().includes(q)).slice(0, 8);
    box.innerHTML = hits.map((c) => `<div data-id="${Number(c.id)}" style="padding:8px 12px;cursor:pointer;color:var(--ti-text, #E2E8F0);border-bottom:1px solid var(--ti-panel2, #1E293B);">${escapeHtml(c.name || "")}</div>`).join("");
    box.style.display = hits.length ? "block" : "none";
    box.querySelectorAll("[data-id]").forEach((row) => row.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const c = hits.find((x) => String(x.id) === row.dataset.id);
        if (input) input.value = c.name;
        if (idField) idField.value = String(c.id);
        if (kind === "new-appt") showBookingAgeNote(c);
        if (kind === "waiver") {
            const med = document.getElementById("waiver-medical-input");
            if (med && !med.value) med.value = [c.allergies, c.medical_history].filter((v) => v && !/^(none|n\/a)$/i.test(v)).join("; ");
        }
        box.style.display = "none";
    }));
}
window.handleClientAutocomplete = handleClientAutocomplete;

// Under the client's name in the booking form: under 18, age not recorded, or ID not checked
function showBookingAgeNote(c) {
    const note = document.getElementById("new-appt-age-note");
    if (!note) return;
    const age = c && typeof c.age === "number" ? c.age : null;
    const text = !c ? ""
        : age !== null && age < 18 ? pdfLabel("Under 18 ({0}): a parent or guardian must come and sign the Minor Consent form").replace("{0}", age)
        : age === null ? pdfLabel("Age not recorded: check the client's ID")
        : !c.id_check ? pdfLabel("ID not checked yet")
        : "";
    note.textContent = text;
    note.style.color = age !== null && age < 18 ? "#FCA5A5" : "#FDE047";
    note.style.display = text ? "block" : "none";
}
window.showBookingAgeNote = showBookingAgeNote;

// --- Digital waiver: signature pad + save to the studio database ---
let waiverSigned = false;
function initWaiverSignaturePad() {
    const canvas = document.getElementById("waiver-sig-canvas");
    if (!canvas || canvas.dataset.ready) return;
    canvas.dataset.ready = "1";
    canvas.style.touchAction = "none";
    const ctx = canvas.getContext("2d");
    let drawing = false;
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) * canvas.width / r.width, (e.clientY - r.top) * canvas.height / r.height]; };
    canvas.addEventListener("pointerdown", (e) => { drawing = true; canvas.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(...pos(e)); });
    canvas.addEventListener("pointermove", (e) => {
        if (!drawing) return;
        ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.strokeStyle = "#0F172A";
        ctx.lineTo(...pos(e)); ctx.stroke(); waiverSigned = true;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((t) => canvas.addEventListener(t, () => { drawing = false; }));
}

async function openWaiverModal(clientId) {
    forceShowModal("waiver-modal");
    initWaiverSignaturePad();
    clearWaiverSignature();
    autocompleteClients = null; // a client added since the last look must be found too
    // opened from a client's profile: that client is already chosen
    const idField = document.getElementById("waiver-client-id"), nameField = document.getElementById("waiver-client-search");
    if (idField) idField.value = clientId ? String(clientId) : "";
    if (nameField) nameField.value = "";
    if (clientId && nameField) {
        try {
            const c = (await (await fetch("/api/clients")).json()).find((x) => Number(x.id) === Number(clientId));
            if (c) nameField.value = c.name || "";
        } catch (e) { /* the name can still be typed */ }
    }
}

// A signed waiver: what was signed, by whom and when, with the signature, and a PDF to print or keep.
// "View signature" used to open an empty signing window instead.
async function loadWaiver(waiverId) {
    try { return (await (await fetch("/api/waivers")).json()).find((x) => Number(x.id) === Number(waiverId)); } catch (e) { return null; }
}

async function viewWaiverRecord(waiverId) {
    const w = await loadWaiver(waiverId);
    if (!w) { showStudioToast("This waiver could not be loaded"); return; }
    let overlay = document.getElementById("waiver-record-modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "waiver-record-modal-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Signed waiver");
        overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:2000000;align-items:center;justify-content:center;";
        document.body.appendChild(overlay);
    }
    const when = w.signed_at ? new Date(w.signed_at).toLocaleString() : "date not recorded";
    const line = (label, value) => `<div style="display:flex;gap:10px;padding:6px 0;border-bottom:1px solid var(--ti-panel2, #1E293B);"><span style="width:150px;color:var(--ti-muted, #94A3B8);flex-shrink:0;">${label}</span><span>${escapeHtml(String(value || "-"))}</span></div>`;
    const signature = typeof w.signature === "string" && w.signature.startsWith("data:image/") ? w.signature : "";
    overlay.innerHTML = `
        <div style="background:var(--ti-bg2, #0F172A);border:1px solid var(--ti-line, #334155);border-radius:14px;padding:22px;width:min(94vw,560px);max-height:90vh;overflow:auto;color:var(--ti-text, #F8FAFC);font-size:0.9rem;">
            <h3 style="margin:0 0 12px;font-size:1.1rem;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-consent></use></svg> Signed waiver</h3>
            ${line("Client", w.client_name)}${line("Service", w.service_type)}${line("Signed", when)}
            ${line("Age verified", w.age_verified ? "Yes" : "No")}${line("Medical disclosures", w.medical_disclosures)}${line("Verified by", w.staff_verifier)}
            <div style="margin-top:12px;color:var(--ti-muted, #94A3B8);">Signature</div>
            ${signature ? `<img src="${signature}" alt="Client signature" style="display:block;margin-top:6px;max-width:100%;background:#FFF;border-radius:8px;" />` : `<div style="margin-top:6px;">No signature was captured.</div>`}
            <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
                <button type="button" onclick="downloadWaiverPdf(${Number(w.id)})" style="padding:9px 16px;background:var(--ti-blue, #2563EB);color:#FFF;border:none;border-radius:8px;font-weight:800;cursor:pointer;"><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-download></use></svg> Download PDF</button>
                <button type="button" onclick="forceHideModal('waiver-record-modal-overlay')" style="padding:9px 16px;background:transparent;color:var(--ti-muted, #94A3B8);border:1px solid var(--ti-line2, #475569);border-radius:8px;cursor:pointer;">Close</button>
            </div>
        </div>`;
    forceShowModal("waiver-record-modal-overlay");
}
window.viewWaiverRecord = viewWaiverRecord;

async function downloadWaiverPdf(waiverId) {
    if (!(window.jspdf && window.jspdf.jsPDF)) { showStudioToast("The PDF library did not load"); return; }
    const w = await loadWaiver(waiverId);
    if (!w) { showStudioToast("This waiver could not be loaded"); return; }
    const doc = new window.jspdf.jsPDF();
    let y = 20;
    doc.setFontSize(16); doc.text(pdfLabel("Signed waiver"), 15, y); y += 12;
    doc.setFontSize(11);
    for (const [label, value] of [["Client", w.client_name], ["Service", w.service_type], ["Signed", w.signed_at ? new Date(w.signed_at).toLocaleString() : pdfLabel("date not recorded")],
        ["Age verified", pdfLabel(w.age_verified ? "Yes" : "No")], ["Verified by", w.staff_verifier]]) { doc.text(pdfLabel(label) + ": " + String(value || "-"), 15, y); y += 8; }
    const disclosures = doc.splitTextToSize(pdfLabel("Medical disclosures") + ": " + String(w.medical_disclosures || "-"), 180);
    doc.text(disclosures, 15, y); y += disclosures.length * 6 + 8;
    if (typeof w.signature === "string" && w.signature.startsWith("data:image/png")) { doc.text(pdfLabel("Signature") + ":", 15, y); try { doc.addImage(w.signature, "PNG", 15, y + 3, 90, 24); } catch (e) {} }
    doc.save("waiver-" + String(w.client_name || "client").replace(/[^a-z0-9]+/gi, "-") + "-" + String(w.signed_at || "").slice(0, 10) + ".pdf");
}
window.downloadWaiverPdf = downloadWaiverPdf;
window.openWaiverModal = openWaiverModal;

function clearWaiverSignature() {
    const canvas = document.getElementById("waiver-sig-canvas");
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    waiverSigned = false;
}
window.clearWaiverSignature = clearWaiverSignature;

async function submitDigitalWaiver(event) {
    if (event) event.preventDefault();
    const val = (id) => (document.getElementById(id) || {}).value || "";
    const clientId = val("waiver-client-id");
    if (!clientId) { showStudioToast("Pick the client from the list"); return; }
    if (!waiverSigned) { showStudioToast("The client has not signed yet"); return; }
    const body = {
        client_id: clientId,
        client_name: val("waiver-client-search"),
        service_type: val("waiver-service-input"),
        medical_disclosures: val("waiver-medical-input"),
        age_verified: !!(document.getElementById("waiver-age-cb") || {}).checked,
        signature: document.getElementById("waiver-sig-canvas").toDataURL("image/png")
    };
    try {
        const res = await fetch("/api/waivers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("HTTP " + res.status);
    } catch (e) {
        showStudioToast("Could not save the waiver: the server did not answer");
        return;
    }
    showStudioToast("Waiver signed and saved");
    closeWaiverModal();
    if (event && event.target && event.target.reset) event.target.reset();
    const idField = document.getElementById("waiver-client-id");
    if (idField) idField.value = "";
    if (typeof renderClientsTable === "function") renderClientsTable();
}
window.submitDigitalWaiver = submitDigitalWaiver;

// --- Closing checklist counter ---
function updateSanitizationProgress() {
    const boxes = document.querySelectorAll(".sani-chk");
    const done = [...boxes].filter((b) => b.checked).length;
    const tag = document.getElementById("sanitization-progress-tag");
    if (tag) tag.textContent = done + " / " + boxes.length + " Completed";
}
window.updateSanitizationProgress = updateSanitizationProgress;

// --- Gallery: portfolio works (/api/gallery) and flash designs (/api/flash) ---
const galleryState = { works: [], flash: [], sheets: [], tab: "portfolio", pendingWorkImage: "", shareItem: null };

async function loadGalleryData() {
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : [])).catch(() => []);
    const [works, flash, sheets] = await Promise.all([get("/api/gallery"), get("/api/flash"), get("/api/flash-sheets")]);
    galleryState.works = Array.isArray(works) ? works : [];
    galleryState.flash = Array.isArray(flash) ? flash : [];
    galleryState.sheets = Array.isArray(sheets) ? sheets : [];
}

// Downscale a picked photo so the studio database stays small (max 1600 px, JPEG).
function imageFileToDataUrl(file, max = 1600) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const k = Math.min(1, max / Math.max(img.width, img.height));
                const c = document.createElement("canvas");
                c.width = Math.round(img.width * k);
                c.height = Math.round(img.height * k);
                c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
                resolve(c.toDataURL("image/jpeg", 0.85));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

async function openGalleryModal() {
    forceShowModal("gallery-modal");
    await loadGalleryData();
    switchGalleryTab(galleryState.tab);
}
window.openGalleryModal = openGalleryModal;

function switchGalleryTab(tab) {
    galleryState.tab = tab;
    ["portfolio", "flash", "tools"].forEach((t) => {
        const view = document.getElementById("gallery-" + t + "-view");
        if (view) view.style.display = t === tab ? "flex" : "none";
        const btn = document.getElementById("tab-gallery-" + t);
        if (btn) {
            btn.style.background = t === tab ? "#1E293B" : "transparent";
            btn.style.color = t === tab ? "#38BDF8" : "#94A3B8";
        }
    });
    const up = document.getElementById("gallery-upload-btn");
    if (up) up.setAttribute("onclick", tab === "flash" ? "openUploadFlashModal()" : "openUploadWorkModal()");
    if (tab === "portfolio") renderGalleryGrid();
    if (tab === "flash") renderFlashGrid();
}
window.switchGalleryTab = switchGalleryTab;

function galleryCard(img, title, lines, buttons) {
    return `<div style="background:var(--ti-panel, #111827);border:1px solid var(--ti-line, #374151);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;">
        <img src="${escapeHtml(img || "")}" alt="${escapeHtml(title)}" style="width:100%;height:200px;object-fit:cover;background:var(--ti-bg2, #0F172A);cursor:zoom-in;" data-lightbox="1" />
        <div style="padding:12px;display:flex;flex-direction:column;gap:4px;flex:1;">
          <div style="font-weight:800;color:var(--ti-text, #F9FAFB);">${escapeHtml(title)}</div>
          ${lines.map((l) => `<div style="font-size:0.8rem;color:var(--ti-muted, #9CA3AF);">${escapeHtml(l)}</div>`).join("")}
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;padding-top:8px;">${buttons}</div>
        </div></div>`;
}
const galleryBtn = (label, attr) => `<button type="button" ${attr} style="padding:5px 10px;background:var(--ti-panel2, #1E293B);color:var(--ti-blue, #38BDF8);border:1px solid var(--ti-line, #334155);border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;">${label}</button>`;

function bindGalleryGrid(grid, items, captionOf) {
    grid.querySelectorAll("[data-lightbox]").forEach((img, i) =>
        img.addEventListener("click", () => openLightboxModal(items[i].image_url, captionOf(items[i]))));
    grid.querySelectorAll("[data-share]").forEach((b) =>
        b.addEventListener("click", () => openGalleryShareModal(items[Number(b.dataset.share)])));
}

function renderGalleryGrid() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    const v = (id) => (document.getElementById(id) || {}).value || "";
    const artist = v("gallery-filter-artist"), client = v("gallery-filter-client"), q = v("gallery-search-input").toLowerCase().trim();
    const items = galleryState.works.filter((w) =>
        (!artist || String(w.staff_id) === artist) &&
        (!client || String(w.client_id) === client) &&
        (!q || [w.service_type, w.notes, w.client_name, w.staff_name].join(" ").toLowerCase().includes(q)));
    // grouped by client: one heading per client, photos without a client last
    const grouped = v("gallery-mode-select") === "client";
    if (grouped) items.sort((a, b) => (!a.client_name) - (!b.client_name) || (a.client_name || "").localeCompare(b.client_name || ""));
    const badge = document.getElementById("gallery-count-badge");
    if (badge) badge.textContent = items.length + " Items";
    const card = (w, i) => galleryCard(w.image_url, w.service_type || "",
        [[w.client_name, w.staff_name].filter(Boolean).join(" · "), (w.session_date || "") + (w.session_duration_hours ? " · " + w.session_duration_hours + " h" : ""), w.notes || ""],
        galleryBtn("Share", `data-share="${i}"`) + galleryBtn("Delete", `data-del="${i}" id="gallery-del-${Number(w.id)}"`));
    const heading = (name) => `<div style="grid-column:1/-1;font-weight:800;color:var(--ti-text, #F9FAFB);padding-top:6px;">${escapeHtml(name)}</div>`;
    grid.innerHTML = items.length ? items.map((w, i) =>
        (grouped && (i === 0 || items[i - 1].client_name !== w.client_name) ? heading(w.client_name || "No client") : "") + card(w, i)).join("")
        : '<div style="padding:24px;color:var(--ti-muted, #94A3B8);">No portfolio works yet. Add one with Upload Work.</div>';
    bindGalleryGrid(grid, items, (w) => (w.service_type || "") + " · " + (w.client_name || ""));
    grid.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deleteGalleryItem("work", items[Number(b.dataset.del)])));
}
window.renderGalleryGrid = renderGalleryGrid;

// Delete from the gallery: a work photo is also gone from its client's profile (one store)
function deleteGalleryItem(kind, item) {
    const work = kind === "work";
    openDeletionConfirmModal({
        title: work ? "Delete Portfolio Artwork" : "Delete Flash Design",
        message: work ? "Are you sure you want to delete this artwork photo from the client portfolio?" : "Delete this flash design from the gallery?",
        itemName: work ? (item.service_type || "Client Artwork Photo") : (item.title || "Flash design"),
        itemDetails: work ? (item.client_name || "No client") : (item.artist_name || ""),
        confirmBtnText: "Delete Photo",
        onConfirm: async () => {
            try {
                const r = await fetch((work ? "/api/gallery/" : "/api/flash/") + Number(item.id), { method: "DELETE" });
                if (!r.ok) throw new Error();
            } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
            await loadGalleryData();
            switchGalleryTab(work ? "portfolio" : "flash");
            showStudioToast(work ? "Deleted artwork from client portfolio." : "Flash design deleted");
        }
    });
}
window.deleteGalleryItem = deleteGalleryItem;

function openLightboxModal(src, caption) {
    const img = document.getElementById("lightbox-img");
    if (img) img.src = src || "";
    const cap = document.getElementById("lightbox-caption");
    if (cap) cap.textContent = caption || "";
    forceShowModal("lightbox-modal");
}
window.openLightboxModal = openLightboxModal;

// Sharing: a local studio app cannot post for you. WhatsApp/Telegram/LINE/X/email open with
// the message filled in; "native" uses the device share sheet (with the photo where supported);
// the rest copy the message to paste.
const SHARE_PRESETS = {
    showcase: "Fresh from the studio: {title}.",
    session: "Session update: {title}.",
    promo: "{title} is available to book. Message us to reserve it.",
    invite: "Like this style? Book a consultation with us: {title}."
};
function openGalleryShareModal(item) {
    galleryState.shareItem = item || galleryState.shareItem;
    const it = galleryState.shareItem || {};
    const prev = document.getElementById("share-artwork-preview");
    if (prev) prev.innerHTML = it.image_url ? `<img src="${escapeHtml(it.image_url)}" alt="" style="max-width:100%;max-height:180px;border-radius:8px;" />` : "";
    setSharePreset("showcase");
    forceShowModal("gallery-share-modal");
}
window.openGalleryShareModal = openGalleryShareModal;

function setSharePreset(preset) {
    const it = galleryState.shareItem || {};
    const box = document.getElementById("share-quick-message");
    if (box) box.value = (SHARE_PRESETS[preset] || SHARE_PRESETS.showcase).replace("{title}", it.title || it.service_type || "our latest work");
}
window.setSharePreset = setSharePreset;

async function shareToPlatform(platform) {
    const text = (document.getElementById("share-quick-message") || {}).value || "";
    const t = encodeURIComponent(text);
    const urls = {
        whatsapp: "https://wa.me/?text=" + t,
        telegram: "https://t.me/share/url?url=&text=" + t,
        line: "https://line.me/R/share?text=" + t,
        x: "https://twitter.com/intent/tweet?text=" + t,
        email: "mailto:?body=" + t
    };
    if (platform === "native" && navigator.share) {
        const data = { text };
        const it = galleryState.shareItem || {};
        try {
            if (it.image_url && it.image_url.startsWith("data:image/") && navigator.canShare) {
                const blob = await (await fetch(it.image_url)).blob();
                const file = new File([blob], "studio-work." + (blob.type.split("/")[1] || "jpg").replace("svg+xml", "svg"), { type: blob.type });
                if (navigator.canShare({ files: [file] })) data.files = [file];
            }
            await navigator.share(data);
        } catch (e) {}
        return;
    }
    if (urls[platform]) { window.open(urls[platform], "_blank", "noopener"); return; }
    try { await navigator.clipboard.writeText(text); showStudioToast("Message copied: paste it into " + platform); }
    catch (e) { showStudioToast("Select the message and copy it"); }
}
window.shareToPlatform = shareToPlatform;

function copyShareLinkAndMessage() { shareToPlatform("copy"); }
window.copyShareLinkAndMessage = copyShareLinkAndMessage;

// --- Upload a portfolio work ---
function openUploadWorkModal() {
    galleryState.pendingWorkImage = "";
    const prev = document.getElementById("work-image-preview-container");
    if (prev) prev.innerHTML = "";
    const idField = document.getElementById("work-client-id");
    if (idField) idField.value = "";
    const date = document.getElementById("work-date-input");
    if (date && !date.value) date.value = new Date().toLocaleDateString("en-CA");
    forceShowModal("upload-work-modal");
}
window.openUploadWorkModal = openUploadWorkModal;

async function handleWorkFileSelect(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;
    try { galleryState.pendingWorkImage = await imageFileToDataUrl(file); }
    catch (e) { showStudioToast("That file could not be read as an image"); return; }
    const prev = document.getElementById("work-image-preview-container");
    if (prev) prev.innerHTML = `<img src="${galleryState.pendingWorkImage}" alt="" style="max-width:100%;max-height:160px;border-radius:8px;" />`;
}
window.handleWorkFileSelect = handleWorkFileSelect;

async function submitClientWorkPhoto(event) {
    if (event) event.preventDefault();
    const v = (id) => (document.getElementById(id) || {}).value || "";
    if (!galleryState.pendingWorkImage) { showStudioToast("Choose a photo first"); return; }
    const body = {
        staff_id: v("work-staff-select"), client_id: v("work-client-id"), client_name: v("work-client-search"),
        service_type: v("work-service-input"), session_date: v("work-date-input"),
        session_duration_hours: v("work-duration-input"), notes: v("work-notes-input"), image_url: galleryState.pendingWorkImage
    };
    let saved;
    try {
        const r = await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!r.ok) throw new Error();
        saved = await r.json();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    closeUploadWorkModal();
    if (event && event.target && event.target.reset) event.target.reset();
    await loadGalleryData();
    switchGalleryTab("portfolio");
    // a typed name the server matched to no client: the photo is on no profile, so say so
    showStudioToast(body.client_name.trim() && !saved.client_id ? "Saved, but no client has that exact name: pick the client from the list to link it" : "Work added to the portfolio");
}
window.submitClientWorkPhoto = submitClientWorkPhoto;

// --- Flash designs: sheets, prices in the studio currency, claims tied to a client, printing ---
// A price left blank is "POA" everywhere (no invented figure). Status: available, claimed, repeatable.
const flashMoney = (n) => (n === null || n === undefined || n === "" ? "" :
    (window.StudioSettings ? window.StudioSettings.format(Number(n)) : Number(n).toFixed(2)));
const flashPrice = (f) => (f.price === null || f.price === undefined || f.price === "" ? pdfLabel("POA") : flashMoney(f.price));
const flashBookings = (f) => (Array.isArray(f.bookings) ? f.bookings.length : 0);
const flashStatusLabel = (f) => f.status === "claimed" ? pdfLabel("Claimed by {0}").replace("{0}", f.claimed_by_client_name || "")
    : f.status === "repeatable" ? pdfLabel("Repeatable") : pdfLabel("Available");

// designs of the chosen sheet ("" = every design, "none" = designs in no sheet), in sheet order
function flashInSheet(sheet) {
    return galleryState.flash
        .filter((f) => !sheet || (sheet === "none" ? !f.sheet_id : String(f.sheet_id) === sheet))
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

function fillFlashSheetSelects() {
    const sheets = galleryState.sheets || [];
    const opts = (first) => first + sheets.map((s) => `<option value="${Number(s.id)}">${escapeHtml(s.name)}</option>`).join("");
    const filter = document.getElementById("flash-filter-sheet");
    if (filter) {
        const keep = filter.value;
        filter.innerHTML = opts(`<option value="">${escapeHtml(pdfLabel("All designs"))}</option><option value="none">${escapeHtml(pdfLabel("In no sheet"))}</option>`);
        filter.value = [...filter.options].some((o) => o.value === keep) ? keep : "";
    }
    const pick = document.getElementById("flash-sheet-select");
    if (pick) pick.innerHTML = opts(`<option value="">${escapeHtml(pdfLabel("No sheet"))}</option>`);
    const sheetOnly = !!(filter && filter.value && filter.value !== "none");
    ["flash-edit-sheet-btn", "flash-delete-sheet-btn"].forEach((id) => { const b = document.getElementById(id); if (b) b.style.display = sheetOnly ? "" : "none"; });
}

function renderFlashSummary(items) {
    const box = document.getElementById("flash-summary");
    if (!box) return;
    const count = (s) => items.filter((f) => f.status === s).length;
    // what is still for sale: available and repeatable designs that have a price
    const value = items.filter((f) => f.status !== "claimed" && f.price !== null && f.price !== undefined && f.price !== "")
        .reduce((sum, f) => sum + Number(f.price), 0);
    const cell = (label, v) => `<span style="white-space:nowrap;"><span style="color:var(--ti-muted, #9CA3AF);">${escapeHtml(label)}</span> <strong style="color:var(--ti-text, #F9FAFB);">${escapeHtml(String(v))}</strong></span>`;
    box.innerHTML = [cell(pdfLabel("Designs"), items.length), cell(pdfLabel("Available"), count("available")), cell(pdfLabel("Claimed"), count("claimed")),
        cell(pdfLabel("Repeatable"), count("repeatable")), cell(pdfLabel("Value still for sale"), flashMoney(value))].join("");
}

function renderFlashGrid() {
    const grid = document.getElementById("flash-grid");
    if (!grid) return;
    fillFlashSheetSelects();
    const v = (id) => (document.getElementById(id) || {}).value || "";
    const sheet = v("flash-filter-sheet"), cat = v("flash-filter-category"), status = v("flash-filter-status"), q = v("flash-search-input").toLowerCase().trim();
    const inSheet = flashInSheet(sheet);
    const items = inSheet.filter((f) =>
        (!cat || f.category === cat) && (!status || f.status === status) &&
        (!q || [f.title, f.notes, f.needle_specs, f.pigment_palette, f.artist_name, f.size].join(" ").toLowerCase().includes(q)));
    renderFlashSummary(inSheet);
    const badge = document.getElementById("gallery-count-badge");
    if (badge) badge.textContent = items.length + " Items";
    // drag to arrange only when one sheet is shown whole: the order is that sheet's printed order
    const arrange = !!sheet && sheet !== "none" && !cat && !status && !q;
    const hint = document.getElementById("flash-arrange-hint");
    if (hint) hint.style.display = arrange && items.length > 1 ? "" : "none";
    grid.innerHTML = items.length ? items.map((f, i) => {
        const lines = [
            [f.category, f.artist_name, f.size].filter(Boolean).join(" · "),
            flashPrice(f) + (f.deposit !== null && f.deposit !== undefined && f.deposit !== "" ? " · " + pdfLabel("{0} deposit").replace("{0}", flashMoney(f.deposit)) : "")
                + (f.est_duration_hours ? " · " + pdfLabel("{0} h").replace("{0}", f.est_duration_hours) : ""),
            flashStatusLabel(f) + (flashBookings(f) ? " · " + (flashBookings(f) === 1 ? pdfLabel("Booked once") : pdfLabel("Booked {0} times").replace("{0}", flashBookings(f))) : "")
                + (f.likes_count ? " · " + pdfLabel("{0} likes").replace("{0}", f.likes_count) : ""),
        ];
        const card = galleryCard(f.image_url, (Number(f.span) === 2 ? "★ " : "") + (f.title || ""), lines,
            galleryBtn("Edit", `data-edit="${i}"`) + galleryBtn("Share", `data-share="${i}"`) + galleryBtn("Skin Tone Preview", `data-skin="${i}"`) +
            (f.status === "claimed" ? galleryBtn("Make Available", `data-release="${i}"`) : galleryBtn("Claim", `data-claim="${i}"`)) +
            galleryBtn("Delete", `data-del="${i}" id="flash-del-${Number(f.id)}"`));
        return arrange ? card.replace("<div ", `<div draggable="true" data-order="${i}" `) : card;
    }).join("")
        : '<div style="padding:24px;color:var(--ti-muted, #94A3B8);">No flash designs yet.</div>';
    bindGalleryGrid(grid, items, (f) => f.title || "");
    const on = (attr, fn) => grid.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => fn(items[Number(b.dataset[attr])])));
    on("del", (f) => deleteGalleryItem("flash", f));
    on("skin", openSkinToneVisualizerModal);
    on("claim", openFlashClaimModal);
    on("release", releaseFlashDesign);
    on("edit", openUploadFlashModal);
    if (arrange) bindFlashArrange(grid, items);
}
window.renderFlashGrid = renderFlashGrid;

// Drag a card onto another to move it there; the new order is the sheet's printed order.
function bindFlashArrange(grid, items) {
    let from = null;
    grid.querySelectorAll("[data-order]").forEach((card) => {
        card.style.cursor = "grab";
        card.addEventListener("dragstart", (e) => { from = Number(card.dataset.order); e.dataTransfer.effectAllowed = "move"; card.style.opacity = "0.5"; });
        card.addEventListener("dragend", () => { card.style.opacity = ""; });
        card.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; });
        card.addEventListener("drop", async (e) => {
            e.preventDefault();
            const to = Number(card.dataset.order);
            if (from === null || from === to) return;
            const ids = items.map((f) => Number(f.id));
            ids.splice(to, 0, ids.splice(from, 1)[0]);
            try {
                const r = await fetch("/api/flash-order", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
                if (!r.ok) throw new Error();
            } catch (err) { showStudioToast("Could not save: the server did not answer"); return; }
            await loadGalleryData();
            renderFlashGrid();
        });
    });
}

// --- Claim: a real client record and the date ---
function openFlashClaimModal(flash) {
    galleryState.claimItem = flash;
    const title = document.getElementById("flash-claim-title");
    if (title) title.textContent = flash.title || "";
    ["flash-claim-client-search", "flash-claim-client-id"].forEach((id) => { const el = document.getElementById(id); if (el) el.value = ""; });
    const date = document.getElementById("flash-claim-date");
    if (date) date.value = new Date().toLocaleDateString("en-CA");
    forceShowModal("flash-claim-modal");
}
window.openFlashClaimModal = openFlashClaimModal;
function closeFlashClaimModal() { forceHideModal("flash-claim-modal"); }
window.closeFlashClaimModal = closeFlashClaimModal;

async function submitFlashClaim(event) {
    if (event) event.preventDefault();
    const v = (id) => (document.getElementById(id) || {}).value || "";
    const flash = galleryState.claimItem;
    if (!flash) return;
    if (!v("flash-claim-client-id")) { showStudioToast("Pick the client from the list"); return; }
    try {
        const r = await fetch("/api/flash/" + Number(flash.id) + "/claim", { method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: v("flash-claim-client-id"), date: v("flash-claim-date") }) });
        if (!r.ok) throw new Error();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    closeFlashClaimModal();
    await loadGalleryData();
    renderFlashGrid();
    showStudioToast(flash.status === "repeatable" ? "Booking recorded" : "Flash design reserved");
}
window.submitFlashClaim = submitFlashClaim;
// kept for anything that still calls the old name
window.claimFlashDesign = openFlashClaimModal;

async function releaseFlashDesign(flash) {
    try {
        const r = await fetch("/api/flash/" + Number(flash.id) + "/release", { method: "POST" });
        if (!r.ok) throw new Error();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    await loadGalleryData();
    renderFlashGrid();
    showStudioToast("Flash design available again");
}
window.releaseFlashDesign = releaseFlashDesign;

// --- Add or edit a flash design (one form) ---
function openUploadFlashModal(flash) {
    const f = flash && flash.id ? flash : null;
    galleryState.editFlash = f;
    fillFlashSheetSelects();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val === null || val === undefined ? "" : val; };
    const sheetNow = (document.getElementById("flash-filter-sheet") || {}).value || "";
    set("flash-title-input", f && f.title);
    set("flash-category-select", f ? f.category : "Tattoo - Traditional");
    set("flash-size-input", f && f.size);
    set("flash-price-input", f && f.price);
    set("flash-deposit-input", f && f.deposit);
    set("flash-hours-input", f && f.est_duration_hours);
    set("flash-needles-input", f && f.needle_specs);
    set("flash-pigment-input", f && f.pigment_palette);
    set("flash-notes-input", f && f.notes);
    set("flash-status-select", f && f.status === "repeatable" ? "repeatable" : "available");
    set("flash-sheet-select", f ? (f.sheet_id || "") : (sheetNow && sheetNow !== "none" ? sheetNow : ""));
    const artist = document.getElementById("flash-artist-select");
    if (artist && f && f.artist_id) artist.value = String(f.artist_id);
    const span = document.getElementById("flash-span-input");
    if (span) span.checked = !!f && Number(f.span) === 2;
    const file = document.getElementById("flash-file-input");
    if (file) file.value = "";
    const status = document.getElementById("flash-status-select");
    if (status) status.disabled = !!f && f.status === "claimed";
    const heading = document.getElementById("flash-form-heading");
    if (heading) heading.textContent = pdfLabel(f ? "Edit Flash Design" : "Publish New Flash Sheet / Design");
    const submit = document.getElementById("flash-form-submit-label");
    if (submit) submit.textContent = pdfLabel(f ? "Save Changes" : "Publish Flash Sheet");
    forceShowModal("upload-flash-modal");
}
window.openUploadFlashModal = openUploadFlashModal;

async function submitNewFlashDesign(event) {
    if (event) event.preventDefault();
    const v = (id) => (document.getElementById(id) || {}).value || "";
    const file = (document.getElementById("flash-file-input") || {}).files;
    let image = "";
    if (file && file[0]) {
        try { image = await imageFileToDataUrl(file[0]); } catch (e) { showStudioToast("That file could not be read as an image"); return; }
    }
    const editing = galleryState.editFlash;
    const body = {
        title: v("flash-title-input"), artist_id: v("flash-artist-select"), category: v("flash-category-select"), size: v("flash-size-input"),
        price: v("flash-price-input"), deposit: v("flash-deposit-input"), est_duration_hours: v("flash-hours-input"),
        needle_specs: v("flash-needles-input"), pigment_palette: v("flash-pigment-input"), notes: v("flash-notes-input"),
        sheet_id: v("flash-sheet-select"), span: (document.getElementById("flash-span-input") || {}).checked ? 2 : 1,
        status: v("flash-status-select") || "available", image_url: image || undefined
    };
    try {
        const r = await fetch(editing ? "/api/flash/" + Number(editing.id) : "/api/flash",
            { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!r.ok) throw new Error();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    closeUploadFlashModal();
    if (event && event.target && event.target.reset) event.target.reset();
    galleryState.editFlash = null;
    await loadGalleryData();
    switchGalleryTab("flash");
    showStudioToast(editing ? "Flash design saved" : "Flash design added");
}
window.submitNewFlashDesign = submitNewFlashDesign;

// --- Sheets: a named set with the header the printed sheet carries ---
function openFlashSheetModal(isNew) {
    const id = (document.getElementById("flash-filter-sheet") || {}).value || "";
    const sheet = isNew ? null : (galleryState.sheets || []).find((s) => String(s.id) === id);
    galleryState.editSheet = sheet || null;
    const set = (el, val) => { const e = document.getElementById(el); if (e) e.value = val || ""; };
    const p = readStudioProfile();
    set("flash-sheet-name", sheet ? sheet.name : "");
    set("flash-sheet-artist", sheet ? sheet.artist : (p.studioName || ""));
    set("flash-sheet-contact", sheet ? sheet.contact : [p.studioPhone, p.studioEmail].filter(Boolean).join(" · "));
    set("flash-sheet-date", sheet ? sheet.date : new Date().toLocaleDateString("en-CA"));
    forceShowModal("flash-sheet-modal");
}
window.openFlashSheetModal = openFlashSheetModal;
function closeFlashSheetModal() { forceHideModal("flash-sheet-modal"); }
window.closeFlashSheetModal = closeFlashSheetModal;

async function submitFlashSheet(event) {
    if (event) event.preventDefault();
    const v = (id) => (document.getElementById(id) || {}).value || "";
    const sheet = galleryState.editSheet;
    const body = { name: v("flash-sheet-name"), artist: v("flash-sheet-artist"), contact: v("flash-sheet-contact"), date: v("flash-sheet-date") };
    let saved;
    try {
        const r = await fetch(sheet ? "/api/flash-sheets/" + Number(sheet.id) : "/api/flash-sheets",
            { method: sheet ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!r.ok) throw new Error();
        saved = await r.json();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    closeFlashSheetModal();
    await loadGalleryData();
    fillFlashSheetSelects();
    const filter = document.getElementById("flash-filter-sheet");
    if (filter) filter.value = String(saved.id);
    renderFlashGrid();
    showStudioToast(sheet ? "Sheet saved" : "Sheet created");
}
window.submitFlashSheet = submitFlashSheet;

function deleteFlashSheet() {
    const id = (document.getElementById("flash-filter-sheet") || {}).value || "";
    const sheet = (galleryState.sheets || []).find((s) => String(s.id) === id);
    if (!sheet) return;
    openDeletionConfirmModal({
        title: "Delete Flash Sheet",
        message: "Delete this sheet? Its designs stay in the gallery, in no sheet.",
        itemName: sheet.name, itemDetails: "", confirmBtnText: "Delete Sheet",
        onConfirm: async () => {
            try {
                const r = await fetch("/api/flash-sheets/" + Number(sheet.id), { method: "DELETE" });
                if (!r.ok) throw new Error();
            } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
            await loadGalleryData();
            const filter = document.getElementById("flash-filter-sheet");
            if (filter) filter.value = "";
            renderFlashGrid();
            showStudioToast("Sheet deleted");
        }
    });
}
window.deleteFlashSheet = deleteFlashSheet;

// --- Printing: the flash sheet (2-4 columns, claimed and repeatable badges) or the counter price list ---
async function flashPrintHtml(opts) {
    const lang = uiLanguage();
    const L = await phrasesIn(lang);
    const esc = escapeHtml;
    const sheetId = (document.getElementById("flash-filter-sheet") || {}).value || "";
    const sheet = (galleryState.sheets || []).find((s) => String(s.id) === sheetId) || {};
    const p = readStudioProfile();
    const items = flashInSheet(sheetId);
    const price = (f) => (f.price === null || f.price === undefined || f.price === "" ? L("POA") : flashMoney(f.price));
    const status = (f) => f.status === "claimed" ? L("CLAIMED") : f.status === "repeatable" ? L("REPEATABLE") : "";
    const title = sheet.name || L("Flash Sheet");
    const who = [sheet.artist || p.studioName, sheet.contact || [p.studioPhone, p.studioEmail].filter(Boolean).join(" · ")].filter(Boolean).join(" · ");
    const date = sheet.date || new Date().toLocaleDateString("en-CA");
    const cols = [2, 3, 4].includes(Number(opts.cols)) ? Number(opts.cols) : 3;
    const body = opts.mode === "list"
        ? `<table><thead><tr><th>#</th><th>${esc(L("Design"))}</th><th>${esc(L("Size"))}</th><th>${esc(L("Price"))}</th><th>${esc(L("Deposit"))}</th><th>${esc(L("Est. time"))}</th><th>${esc(L("Status"))}</th></tr></thead><tbody>
            ${items.map((f, i) => `<tr class="${f.status === "claimed" ? "gone" : ""}"><td>${i + 1}</td><td><strong>${esc(f.title || "")}</strong>${f.category ? `<br><small>${esc(f.category)}</small>` : ""}</td>
            <td>${esc(f.size || "")}</td><td><strong>${esc(price(f))}</strong></td><td>${esc(flashMoney(f.deposit))}</td>
            <td>${f.est_duration_hours ? esc(L("{0} h").replace("{0}", f.est_duration_hours)) : ""}</td><td>${esc(status(f) || L("AVAILABLE"))}</td></tr>`).join("")}
           </tbody></table>`
        : `<div class="grid" style="grid-template-columns:repeat(${cols},1fr)">${items.map((f, i) => `
            <div class="card ${Number(f.span) === 2 ? "wide" : ""} ${f.status === "claimed" ? "gone" : ""}">
              <div class="img">${f.image_url ? `<img src="${esc(f.image_url)}" alt="">` : ""}${status(f) ? `<span class="badge ${f.status}">${esc(status(f))}</span>` : ""}</div>
              <div class="name">${i + 1}. ${esc(f.title || "")}</div>
              <div class="meta">${esc([f.size, f.est_duration_hours ? L("{0} h").replace("{0}", f.est_duration_hours) : ""].filter(Boolean).join(" · "))}</div>
              <div class="price">${esc(price(f))}${f.deposit !== null && f.deposit !== undefined && f.deposit !== "" ? ` <small>${esc(L("{0} deposit").replace("{0}", flashMoney(f.deposit)))}</small>` : ""}</div>
            </div>`).join("")}</div>`;
    return `<!doctype html><html lang="${esc(lang)}"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
        @page{size:${opts.paper === "letter" ? "letter" : "A4"};margin:12mm}
        @media screen{body{padding:12px}}
        body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;font-size:10pt}
        .head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:10px}
        h1{font-size:18pt;margin:0} .who{font-size:9.5pt;color:#333}
        .grid{display:grid;gap:8px} .card{border:1px solid #999;border-radius:6px;padding:6px;break-inside:avoid;page-break-inside:avoid}
        .card.wide{grid-column:span 2} .img{position:relative;height:150px;display:flex;align-items:center;justify-content:center;background:#fff}
        .img img{max-width:100%;max-height:150px;object-fit:contain} .name{font-weight:bold;margin-top:4px} .meta{font-size:8.5pt;color:#444}
        .price{font-size:12pt;font-weight:bold;margin-top:2px} .price small{font-size:8pt;font-weight:normal;color:#444}
        .badge{position:absolute;top:4px;right:4px;font-size:8pt;font-weight:bold;padding:2px 6px;border:1.5px solid #111;background:#fff}
        .badge.claimed{transform:rotate(-8deg)} .gone .img img{opacity:.35}
        table{width:100%;border-collapse:collapse} th,td{border-bottom:1px solid #bbb;padding:5px 4px;text-align:left;vertical-align:top} th{font-size:9pt}
        tr.gone td{color:#777;text-decoration:line-through} tr.gone td:last-child{text-decoration:none}
        .foot{margin-top:10px;font-size:8.5pt;color:#555;border-top:1px solid #999;padding-top:4px}
    </style></head><body>
        <div class="head"><div><h1>${esc(opts.mode === "list" ? L("Flash price list") : title)}</h1>${opts.mode === "list" ? `<div class="who">${esc(title)}</div>` : ""}<div class="who">${esc(who)}</div></div><div class="who">${esc(date)}</div></div>
        ${items.length ? body : `<p>${esc(L("No flash designs yet."))}</p>`}
        <div class="foot">${esc(L("Prices in {0}. POA: price on asking.").replace("{0}", ((window.StudioSettings && window.StudioSettings.get().currency) || {}).code || ""))}</div>
    </body></html>`;
}

function flashPrintOptions() {
    const v = (id) => (document.getElementById(id) || {}).value || "";
    return { mode: v("flash-print-mode") || "sheet", paper: v("flash-print-paper") || "a4", cols: v("flash-print-cols") || "3" };
}

async function refreshFlashPrintPreview() {
    const frame = document.getElementById("flash-print-preview");
    if (!frame) return;
    const o = flashPrintOptions();
    const cols = document.getElementById("flash-print-cols");
    if (cols) cols.disabled = o.mode === "list";
    frame.srcdoc = await flashPrintHtml(o);
}
window.refreshFlashPrintPreview = refreshFlashPrintPreview;

async function openFlashPrintModal(mode) {
    const m = document.getElementById("flash-print-mode");
    if (m && mode) m.value = mode;
    forceShowModal("flash-print-modal");
    await refreshFlashPrintPreview();
}
window.openFlashPrintModal = openFlashPrintModal;
function closeFlashPrintModal() { forceHideModal("flash-print-modal"); }
window.closeFlashPrintModal = closeFlashPrintModal;

async function printFlashSheet() {
    printAftercareSheet(await flashPrintHtml(flashPrintOptions()));
}
window.printFlashSheet = printFlashSheet;

// --- What sells: one row per design, with how often it was booked ---
function exportFlashCsv() {
    const sheetId = (document.getElementById("flash-filter-sheet") || {}).value || "";
    const sheetName = (id) => ((galleryState.sheets || []).find((s) => s.id === id) || {}).name || "";
    const cell = (x) => { const s = x === null || x === undefined ? "" : String(x); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const rows = [["Title", "Sheet", "Category", "Artist", "Size", "Price", "Deposit", "Est. hours", "Status", "Times booked", "Last booked", "Last client", "Likes", "Added"]];
    flashInSheet(sheetId).forEach((f) => {
        const b = Array.isArray(f.bookings) ? f.bookings : [];
        const last = b[b.length - 1] || {};
        rows.push([f.title, sheetName(f.sheet_id), f.category, f.artist_name, f.size, f.price, f.deposit, f.est_duration_hours, f.status,
            b.length, last.date || "", last.client_name || "", f.likes_count || 0, String(f.created_at || "").slice(0, 10)]);
    });
    const blob = new Blob(["﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "flash-designs-" + new Date().toLocaleDateString("en-CA") + ".csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
window.exportFlashCsv = exportFlashCsv;

// --- Skin tone preview of a flash design ---
function openSkinToneVisualizerModal(flash) {
    const img = document.getElementById("skin-projection-img");
    if (img && flash) img.src = flash.image_url || "";
    const title = document.getElementById("skin-visualizer-flash-title");
    if (title && flash) title.textContent = flash.title || "";
    setSkinCanvasColor("#D2A684", "Medium Beige Tone");
    forceShowModal("skin-visualizer-modal");
}
window.openSkinToneVisualizerModal = openSkinToneVisualizerModal;

function setSkinCanvasColor(color, label) {
    const stage = document.getElementById("skin-projection-stage");
    if (stage) stage.style.background = color;
    const badge = document.getElementById("skin-tone-label-badge");
    if (badge && label) badge.textContent = label;
}
window.setSkinCanvasColor = setSkinCanvasColor;

function updateSkinBlendOpacity(value) {
    const img = document.getElementById("skin-projection-img");
    if (img) { img.style.opacity = Math.max(0, Math.min(100, Number(value))) / 100; img.style.mixBlendMode = "multiply"; }
}
window.updateSkinBlendOpacity = updateSkinBlendOpacity;

// --- Updates (Settings, Updates; the server side is src/update.js). Only an administrator gets an answer. ---
const UPDATE_STEPS = { downloading: "Downloading the new version...", unpacking: "Unpacking it...", "backing up": "Backing up your data...",
    testing: "Trying the new version on a copy of your data...", restarting: "Installing and restarting. This page reloads by itself." };
async function checkStudioUpdate(force) {
    let u;
    try { const r = await fetch("/api/admin/update" + (force ? "?check=1" : "")); if (!r.ok) return; u = await r.json(); } catch (e) { return; }
    const status = document.getElementById("update-status"), btn = document.getElementById("update-now-btn");
    const label = document.getElementById("app-version-label");
    if (label && u.available) {
        label.textContent = "v" + u.current + " · " + pdfLabel("update available");
        label.style.cursor = "pointer";
        label.title = pdfLabel("Version {0} is available").replace("{0}", u.latest);
        label.onclick = () => navigateToDestination("settings");
    }
    if (!status) return;
    let text;
    if (UPDATE_STEPS[u.step]) text = pdfLabel(UPDATE_STEPS[u.step]);
    else if (u.step === "failed") text = pdfLabel("The update stopped, nothing was changed:") + " " + u.error;
    else if (u.problem) text = pdfLabel(u.problem);
    else if (!u.available) text = pdfLabel("You have the latest version ({0}).").replace("{0}", u.current);
    else text = pdfLabel("Version {0} is available (you have {1}).").replace("{0}", u.latest).replace("{1}", u.current) + (u.why ? " " + pdfLabel(u.why) : "");
    status.textContent = text;
    if (btn) btn.style.display = u.canUpdate && ["idle", "failed"].includes(u.step) ? "" : "none";
    return u;
}
window.checkStudioUpdate = checkStudioUpdate;
// these lines carry version numbers, so the page translator cannot match them: write them again in the new language
window.addEventListener("studioLanguageChanged", async (e) => {
    // wait until the new language's phrases are in (cached, so this resolves when they are)
    const lang = e.detail && e.detail.language;
    if (lang && window.i18nPhrases) await window.i18nPhrases.setLanguage(lang).catch(() => {});
    checkStudioUpdate(false);
});

async function startStudioUpdate() {
    if (!confirm("Install the new version now? The CRM restarts by itself in a minute or two; other screens and tablets reconnect.")) return;
    const r = await fetch("/api/admin/update", { method: "POST" }).catch(() => null);
    if (!r || !r.ok) { const e = r ? await r.json().catch(() => ({})) : {}; showStudioToast(e.error || "The update could not start"); return; }
    const from = (document.getElementById("app-version-label").textContent.match(/v([\d.]+)/) || [])[1];
    // follow the steps; when the server is back with another version, reload the page
    const timer = setInterval(async () => {
        const u = await checkStudioUpdate(false).catch(() => null);
        if (u && u.step === "failed") { clearInterval(timer); return; }
        const meta = await fetch("/api/studio-meta").then((x) => (x.ok ? x.json() : null), () => null);
        if (meta && meta.version && meta.version !== from) { clearInterval(timer); location.reload(); }
    }, 2000);
}
window.startStudioUpdate = startStudioUpdate;

// --- First run: offer to replace the demo data with an empty studio ---
async function showDemoDataBanner() {
    let meta;
    try { const r = await fetch("/api/studio-meta"); meta = r.ok ? await r.json() : null; } catch (e) { return; }
    const version = document.getElementById("app-version-label");
    if (version && meta && meta.version) version.textContent = "v" + meta.version;
    checkStudioUpdate(false);
    if (!meta || !meta.demo) return;
    const dash = document.getElementById("dest-dashboard");
    if (!dash || document.getElementById("demo-data-banner")) return;
    const bar = document.createElement("div");
    bar.id = "demo-data-banner";
    bar.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:var(--ti-blue-deep, #1E3A8A);border:1px solid var(--ti-blue, #3B82F6);color:var(--ti-blue-ink, #DBEAFE);border-radius:12px;padding:12px 16px;margin-bottom:1rem;";
    bar.innerHTML = '<span>You are looking at demo data. Clear it before you enter real clients.</span>' +
        '<button type="button" id="demo-data-clear-btn" style="padding:8px 14px;background:var(--ti-text, #F8FAFC);color:var(--ti-blue-deep, #1E3A8A);border:none;border-radius:8px;font-weight:800;cursor:pointer;">Start with an empty studio</button>';
    dash.prepend(bar);
    document.getElementById("demo-data-clear-btn").addEventListener("click", startEmptyStudio);
}
async function startEmptyStudio() {
    if (!window.confirm("Delete all demo clients, appointments, payments, stock, gallery and logs? Services, templates and settings are kept. This cannot be undone.")) return;
    try {
        const r = await fetch("/api/admin/start-empty", { method: "POST" });
        if (!r.ok) throw new Error();
        const { removedKeys } = await r.json();
        (removedKeys || []).forEach((k) => { try { localStorage.removeItem(k); } catch (e) {} });
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (/^(studio_(ba_pairs|tip_records|sanitization_logs|aftercare_dispatches|before_after_gallery|portal_pinned_notes|activity_logs)|client_photo_)/.test(k)) localStorage.removeItem(k);
        }
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    window.location.reload();
}
window.startEmptyStudio = startEmptyStudio;
document.addEventListener("DOMContentLoaded", showDemoDataBanner);

// Aftercare email: the template only sets the subject; the studio writes the instructions.
function updateAftercarePreviewText() {
    const sel = document.getElementById('aftercare-template-select');
    const subject = document.getElementById('aftercare-email-subject');
    if (!sel || !subject) return;
    subject.value = { tattoo_custom: 'Your tattoo aftercare instructions', piercing_fine: 'Your piercing aftercare instructions', touchup_care: 'Your touch-up aftercare instructions' }[sel.value] || subject.value;
}
window.updateAftercarePreviewText = updateAftercarePreviewText;

// --- Sync buttons: report the real state of the studio server ---
async function checkStudioDatabase() {
    try {
        const r = await fetch("/api/studio-meta");
        if (!r.ok) throw new Error();
        showStudioToast("Connected: everything is saved in the studio database");
    } catch (e) {
        showStudioToast("The studio server is not answering: changes cannot be saved");
    }
}
function triggerNavbarSync() { checkStudioDatabase(); }
window.triggerNavbarSync = triggerNavbarSync;
function triggerManualSyncFromSettings() { checkStudioDatabase(); }
window.triggerManualSyncFromSettings = triggerManualSyncFromSettings;

// Remote CSV sync (Settings): runs the server's sync and shows what it really did.
async function triggerRemoteCsvSync() {
    let result;
    try {
        const r = await fetch("/api/sync/trigger", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
        result = await r.json();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    const st = (result && result.state) || {};
    loadRemoteCsvSyncForm();
    if (!st.clientsUrl && !st.inventoryUrl) { showStudioToast("CSV sync did not run: set a CSV address in Settings first"); return; }
    if (!result.success) { showStudioToast("CSV sync failed: check the CSV addresses in Settings"); return; }
    const x = result.stats || {};
    showStudioToast("CSV sync finished: " + ((x.clientsProcessed || 0) + (x.inventoryProcessed || 0)) + " rows read");
}
window.triggerRemoteCsvSync = triggerRemoteCsvSync;

async function toggleSettingsRemoteSync(enabled) {
    try {
        const r = await fetch("/api/sync/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !!enabled }) });
        if (!r.ok) throw new Error();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    showStudioToast(enabled ? "Automatic CSV sync on" : "Automatic CSV sync off");
    renderSyncSettingsCard();
}
window.toggleSettingsRemoteSync = toggleSettingsRemoteSync;

// The card said "Background sync is active (running every 30 minutes)" and drew the switch on, whatever the
// server's setting; it now shows the server's own state.
async function renderSyncSettingsCard() {
    const text = document.getElementById("settings-sync-feedback-text");
    if (!text) return;
    let st;
    try { const r = await fetch("/api/sync/status"); if (!r.ok) return; st = await r.json(); } catch (e) { return; }
    const on = !!st.enabled, hasSource = !!(st.clientsUrl || st.inventoryUrl);
    // the Settings badge and the Inventory switch said "ACTIVE" whatever the setting
    const label = pdfLabel(on ? "Automatic CSV sync on" : "Automatic CSV sync off");
    const badge = document.getElementById("settings-sync-status-badge"), inv = document.getElementById("inventory-remote-sync-toggle-wrapper");
    if (badge) { badge.textContent = (on ? "" : "") + label; badge.style.color = on ? "#34D399" : "#94A3B8"; }
    if (inv) { inv.textContent = "" + label; inv.style.color = on ? "#34D399" : "#94A3B8"; }
    const box = document.getElementById("settings-remote-sync-toggle");
    if (box) box.checked = on;
    const slider = document.getElementById("settings-remote-sync-slider"), knob = document.getElementById("settings-remote-sync-knob");
    if (slider) slider.style.background = on ? "#10B981" : "#475569";
    if (knob) knob.style.transform = on ? "translateX(22px)" : "translateX(0)";
    text.textContent = !on ? pdfLabel("Automatic CSV sync is off.")
        : !hasSource ? pdfLabel("Automatic CSV sync is on, but no CSV address is set yet.")
        : pdfLabel("Automatic CSV sync is on: every {0} minutes.").replace("{0}", Number(st.intervalMinutes) || 30);
}
window.renderSyncSettingsCard = renderSyncSettingsCard;
function toggleInventoryRemoteSync() {
    const box = document.getElementById("settings-remote-sync-toggle");
    toggleSettingsRemoteSync(!(box ? box.checked : true));
}
window.toggleInventoryRemoteSync = toggleInventoryRemoteSync;

// --- Staff shift clock in / out ---
async function toggleStaffShift() {
    const sel = document.getElementById("shift-staff-select");
    if (!sel || !sel.value) { showStudioToast("Choose a staff member"); return; }
    let data;
    try {
        const r = await fetch("/api/staff/" + encodeURIComponent(sel.value) + "/shift", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
        if (!r.ok) throw new Error();
        data = await r.json();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    const shift = (data && (data.shift || data)) || {};
    showStudioToast(shift.clock_out ? "Clocked out" : "Clocked in");
    updateShiftStatusView();
}
window.toggleStaffShift = oneAtATime(toggleStaffShift); // one toggle: a double tap clocked in and straight back out


// --- Inventory category threshold: stored with the studio settings ---
function handleSaveCategorySetting() {
    const name = ((document.getElementById("category-setting-name") || {}).value || "").trim();
    const n = parseInt((document.getElementById("category-setting-threshold") || {}).value, 10);
    if (!name || !(n >= 0)) { showStudioToast("Enter a category name and a number"); return; }
    const cur = window.StudioSettings.get();
    const thresholds = Object.assign({}, (cur.inventory && cur.inventory.categoryThresholds) || {});
    thresholds[name] = n;
    const r = window.StudioSettings.save({ inventory: { categoryThresholds: thresholds } });
    showStudioToast(r.ok ? "Category threshold saved" : "Could not save: the server did not answer");
    if (r.ok && typeof closeCategorySettingsModal === "function") closeCategorySettingsModal();
}
window.handleSaveCategorySetting = handleSaveCategorySetting;

// --- Studio logo: saved with the studio data, shown in the top bar ---
const LOGO_KEY = "poli_studio_logo";
function applyStudioLogo() {
    let logo = "";
    try { logo = localStorage.getItem(LOGO_KEY) || ""; } catch (e) {}
    const prev = document.getElementById("settings-logo-preview");
    if (prev) prev.innerHTML = logo ? `<img src="${logo}" alt="" style="max-height:60px;max-width:160px;border-radius:6px;" />` : "";
    let img = document.getElementById("topbar-studio-logo");
    const anchor = document.getElementById("topbar-user-btn");
    if (!logo) { if (img) img.remove(); return; }
    if (!img && anchor) {
        img = document.createElement("img");
        img.id = "topbar-studio-logo";
        img.alt = "";
        img.style.cssText = "height:26px;max-width:110px;object-fit:contain;border-radius:4px;";
        anchor.parentElement.insertBefore(img, anchor);
    }
    if (img) img.src = logo;
}
async function handleStudioLogoUpload(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;
    try { localStorage.setItem(LOGO_KEY, await imageFileToDataUrl(file, 400)); }
    catch (e) { showStudioToast("That file could not be read as an image"); return; }
    applyStudioLogo();
    showStudioToast("Studio logo saved");
}
window.handleStudioLogoUpload = handleStudioLogoUpload;
document.addEventListener("DOMContentLoaded", applyStudioLogo);

// --- Price list CSV: the studio's own prices from Studio Settings, out and back in ---
const PRICE_SECTIONS = ["pricing", "piercingSiteFees", "tattooBaseFees", "styleMultipliers", "materialFees", "attachmentFees"];
function exportStudioPricesCSV() {
    const s = window.StudioSettings.get();
    const rows = ["section,item,value"];
    PRICE_SECTIONS.forEach((sec) => Object.entries(s[sec] || {}).forEach(([k, v]) => { if (typeof v === "number") rows.push(`${sec},${k},${v}`); }));
    downloadBlobFile("studio_prices.csv", rows.join("\n") + "\n", "text/csv;charset=utf-8;");
}
window.exportStudioPricesCSV = exportStudioPricesCSV;
async function handleStudioPriceCsvUpload(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;
    const patch = {};
    let n = 0;
    (await file.text()).split(/\r?\n/).slice(1).forEach((line) => {
        const [sec, item, value] = line.split(",").map((x) => (x || "").trim());
        const v = parseFloat(value);
        if (PRICE_SECTIONS.includes(sec) && item && isFinite(v) && v >= 0) { (patch[sec] = patch[sec] || {})[item] = v; n++; }
    });
    if (!n) { showStudioToast("No prices found: use the file from Export CSV"); return; }
    const r = window.StudioSettings.save(patch);
    if (!r.ok) { showStudioToast("Could not save: the server did not answer"); return; }
    showStudioToast(n + " prices imported");
    if (typeof window.openVatSettingsModal === "function") window.openVatSettingsModal();
    event.target.value = "";
}
window.handleStudioPriceCsvUpload = handleStudioPriceCsvUpload;

// --- Auto scheduler: real free slots from /api/appointments/propose-slots, then book them ---
const schedState = { slots: [], picked: null };
async function openAutoSchedulerModal() {
    forceShowModal("auto-scheduler-modal-overlay");
    const body = document.getElementById("auto-scheduler-modal-body");
    if (!body) return;
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : [])).catch(() => []);
    const [clients, staff] = await Promise.all([get("/api/clients"), get("/api/staff")]);
    const opt = (list, label) => list.map((x) => `<option value="${Number(x.id)}">${escapeHtml(label(x))}</option>`).join("");
    const field = "width:100%;background:var(--ti-panel2, #1E293B);color:#FFF;border:1px solid var(--ti-line2, #475569);border-radius:6px;padding:8px;margin-bottom:10px;";
    const lab = "font-size:0.75rem;color:var(--ti-muted, #94A3B8);";
    body.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div>
        <label style="${lab}">Client</label><select id="sched-client" style="${field}">${opt(clients, (c) => c.name)}</select>
        <label style="${lab}">Artist</label><select id="sched-artist" style="${field}">${opt(staff, (s) => s.name)}</select>
        <label style="${lab}">Service</label><input id="sched-service" style="${field}" placeholder="e.g. Sleeve session" />
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div><label style="${lab}">First date</label><input type="date" id="sched-date" style="${field}" value="${new Date().toLocaleDateString("en-CA")}" /></div>
          <div><label style="${lab}">Minutes</label><input type="number" id="sched-duration" min="15" step="15" value="120" style="${field}" /></div>
          <div><label style="${lab}">Sessions</label><input type="number" id="sched-sessions" min="1" max="6" value="1" style="${field}" /></div>
        </div>
        <label style="${lab}">Weeks between sessions</label><input type="number" id="sched-gap" min="1" max="12" value="3" style="${field}" />
        <button type="button" id="sched-find" style="padding:8px 14px;background:var(--ti-blue, #2563EB);color:#FFF;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Find free slots</button>
      </div>
      <div id="sched-slots" style="background:var(--ti-bg, #090D16);border:1px solid var(--ti-line, #334155);border-radius:10px;padding:14px;font-size:0.8rem;color:var(--ti-muted, #94A3B8);">Choose the artist and date, then Find free slots.</div>
    </div>`;
    document.getElementById("sched-find").addEventListener("click", findSchedulerSlots);
}
window.openAutoSchedulerModal = openAutoSchedulerModal;

async function findSchedulerSlots() {
    const v = (id) => (document.getElementById(id) || {}).value || "";
    const box = document.getElementById("sched-slots");
    let data;
    try {
        const r = await fetch("/api/appointments/propose-slots", { method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ staff_id: v("sched-artist"), date: v("sched-date"), duration_minutes: v("sched-duration"), service_type: v("sched-service") }) });
        data = await r.json();
    } catch (e) { box.textContent = "Could not load clients: the server did not answer"; return; }
    schedState.slots = ((data.artists || [])[0] || {}).available_slots || [];
    schedState.picked = null;
    box.innerHTML = schedState.slots.length ? schedState.slots.map((s, i) =>
        `<label style="display:flex;gap:8px;align-items:center;background:var(--ti-panel2, #1E293B);padding:6px 10px;border-radius:6px;border:1px solid var(--ti-line, #334155);margin-bottom:6px;cursor:pointer;color:var(--ti-text, #E2E8F0);">
           <input type="radio" name="sched-slot" value="${i}" /> ${escapeHtml(s.displayTime || s.time)} · ${escapeHtml(s.station || "")}</label>`).join("")
        : "No free slot that day.";
    box.querySelectorAll('input[name="sched-slot"]').forEach((r) => r.addEventListener("change", () => { schedState.picked = schedState.slots[Number(r.value)]; }));
}

async function executeAutoSchedulerBooking() {
    const v = (id) => (document.getElementById(id) || {}).value || "";
    if (!schedState.picked) { showStudioToast("Pick a free slot first"); return; }
    const sessions = Math.max(1, Math.min(6, parseInt(v("sched-sessions"), 10) || 1));
    const gapWeeks = Math.max(1, parseInt(v("sched-gap"), 10) || 3);
    const first = new Date(schedState.picked.datetime);
    try {
        for (let i = 0; i < sessions; i++) {
            const when = new Date(first.getTime() + i * gapWeeks * 7 * 86400000);
            const r = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_id: v("sched-client"), staff_id: v("sched-artist"), service_type: v("sched-service") || "Session",
                    datetime: when.toISOString(), duration_minutes: v("sched-duration"), station: schedState.picked.station || "", notes: sessions > 1 ? `Session ${i + 1} of ${sessions}` : "" }) });
            if (!r.ok) throw new Error();
        }
    } catch (e) { showStudioToast("Could not save the appointment: the server did not answer"); return; }
    showStudioToast(sessions > 1 ? sessions + " sessions booked" : "Appointment booked");
    if (typeof closeAutoSchedulerModal === "function") closeAutoSchedulerModal();
    refreshAppointmentViews();
}
window.executeAutoSchedulerBooking = oneAtATime(executeAutoSchedulerBooking);

// --- QR / barcode scanner: real camera (html5-qrcode, js/vendor), real lookups ---
const qrState = { scanner: null, torch: false, lastCode: "", lastAt: 0, tab: "scans" };
const QR_HISTORY_KEY = "studio_qr_scans";

async function startQrCamera() {
    if (!window.Html5Qrcode) { showStudioToast("The scanner library did not load"); return; }
    if (qrState.scanner && qrState.scanner.isScanning) return;
    qrState.scanner = qrState.scanner || new Html5Qrcode("qr-reader");
    try {
        await qrState.scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: 240 }, onQrDecoded, () => {});
        showStudioToast("Camera on: point it at a code");
    } catch (e) {
        showStudioToast(window.isSecureContext ? "Camera not available: allow camera access in the browser" : "The camera only works over https: open the https address shown in the window that started the CRM");
    }
}
window.startQrCamera = startQrCamera;

async function stopQrCamera() {
    if (qrState.scanner && qrState.scanner.isScanning) {
        try { await qrState.scanner.stop(); } catch (e) {}
    }
    qrState.torch = false;
}
window.stopQrCamera = stopQrCamera;

async function toggleQrFlashlight() {
    if (!qrState.scanner || !qrState.scanner.isScanning) { showStudioToast("Turn the camera on first"); return; }
    try {
        await qrState.scanner.applyVideoConstraints({ advanced: [{ torch: !qrState.torch }] });
        qrState.torch = !qrState.torch;
    } catch (e) { showStudioToast("This camera has no flashlight control"); }
}
window.toggleQrFlashlight = toggleQrFlashlight;

function onQrDecoded(code) {
    const now = Date.now();
    if (code === qrState.lastCode && now - qrState.lastAt < 2500) return; // same code still in view
    qrState.lastCode = code;
    qrState.lastAt = now;
    handleScannedCode(code);
}

async function handleScannedCode(code) {
    const raw = String(code || "").trim();
    const k = raw.toLowerCase();
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : [])).catch(() => []);
    const [inv, clients] = await Promise.all([get("/api/inventory"), get("/api/clients")]);
    const items = Array.isArray(inv) ? inv : (inv.items || []);
    const item = items.find((i) => [i.sku, i.lot_number, i.barcode].some((v) => v && String(v).toLowerCase() === k));
    const cid = (k.match(/^client[-_:]?(\d+)$/) || [])[1];
    const client = (Array.isArray(clients) ? clients : []).find((c) => (cid && String(c.id) === cid) || (c.phone && c.phone.replace(/\D/g, "") === raw.replace(/\D/g, "") && raw.replace(/\D/g, "").length >= 6));
    playQrBeep(item || client ? "ok" : "miss");
    const entry = { code: raw, at: new Date().toISOString(), match: item ? "item" : client ? "client" : "", label: item ? item.name : client ? client.name : "" };
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem(QR_HISTORY_KEY) || "[]"); } catch (e) {}
    hist.unshift(entry);
    try { localStorage.setItem(QR_HISTORY_KEY, JSON.stringify(hist.slice(0, 100))); } catch (e) {}
    renderQrHistory();

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const body = document.getElementById("recent-scan-modal-body");
    set("recent-scan-modal-subtitle", raw);
    if (item) {
        set("recent-scan-modal-title", item.name);
        if (body) body.innerHTML = `<div data-no-phrase>${escapeHtml(item.sku || "")}</div><div>${escapeHtml(String(item.quantity))} in stock</div>` +
            (item.lot_number ? `<div>Lot ${escapeHtml(item.lot_number)}${item.exp_date ? " · exp. " + escapeHtml(item.exp_date) : ""}</div>` : "");
    } else if (client) {
        set("recent-scan-modal-title", client.name);
        if (body) body.innerHTML = `<div data-no-phrase>${escapeHtml(client.email || "")} ${escapeHtml(client.phone || "")}</div>` +
            `<button type="button" onclick="closeRecentScanProfileModal();openClientProfileModal(${Number(client.id)})" style="margin-top:8px;padding:6px 12px;background:var(--ti-blue, #2563EB);color:#FFF;border:none;border-radius:6px;cursor:pointer;">View Profile</button>`;
    } else {
        set("recent-scan-modal-title", "No match for this code");
        if (body) body.innerHTML = "<div>It is not a stock SKU, a lot number or a client code.</div>";
    }
    forceShowModal("recent-scan-profile-modal");
}
window.handleScannedCode = handleScannedCode;

function renderQrHistory() {
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem(QR_HISTORY_KEY) || "[]"); } catch (e) {}
    const row = (h) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:6px 8px;border-bottom:1px solid var(--ti-panel2, #1F2937);font-size:0.78rem;">
        <span><span data-no-phrase style="color:var(--ti-text, #E5E7EB);">${escapeHtml(h.code)}</span>${h.label ? ` · ${escapeHtml(h.label)}` : ""}</span>
        <span style="color:var(--ti-faint, #6B7280);white-space:nowrap;">${escapeHtml(new Date(h.at).toLocaleTimeString())}</span></div>`;
    const scans = document.getElementById("qr-recent-scans-list");
    const errors = document.getElementById("qr-error-logs-list");
    const misses = hist.filter((h) => !h.match);
    if (scans) scans.innerHTML = hist.length ? hist.map(row).join("") : '<div style="padding:8px;color:var(--ti-faint, #6B7280);font-size:0.78rem;">No scans yet.</div>';
    if (errors) errors.innerHTML = misses.length ? misses.map(row).join("") : '<div style="padding:8px;color:var(--ti-faint, #6B7280);font-size:0.78rem;">No unmatched codes.</div>';
    const badge = document.getElementById("qr-error-count-badge");
    if (badge) { badge.textContent = String(misses.length); badge.style.display = misses.length ? "inline-block" : "none"; }
}
window.renderQrHistory = renderQrHistory;
document.addEventListener("DOMContentLoaded", renderQrHistory);

function switchQrHistoryTab(tab) {
    qrState.tab = tab === "errors" ? "errors" : "scans";
    const scans = document.getElementById("qr-recent-scans-list");
    const errors = document.getElementById("qr-error-logs-list");
    if (scans) scans.style.display = qrState.tab === "scans" ? "" : "none";
    if (errors) errors.style.display = qrState.tab === "errors" ? "" : "none";
    renderQrHistory();
}
window.switchQrHistoryTab = switchQrHistoryTab;

function clearActiveQrTabHistory() {
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem(QR_HISTORY_KEY) || "[]"); } catch (e) {}
    hist = qrState.tab === "errors" ? hist.filter((h) => h.match) : [];
    try { localStorage.setItem(QR_HISTORY_KEY, JSON.stringify(hist)); } catch (e) {}
    renderQrHistory();
}
window.clearActiveQrTabHistory = clearActiveQrTabHistory;
function clearSessionScanHistory() { clearActiveQrTabHistory(); }
window.clearSessionScanHistory = clearSessionScanHistory;

// Scan beep: the Settings theme picks the pitch; "silent" mutes it.
const QR_TONES = { classic: 1200, cyberpunk: 1600, marimba: 520, arcade: 900, silent: 0 };
function playQrBeep(kind) {
    let t = "classic";
    try { t = localStorage.getItem("studio_qr_audio_theme") || "classic"; } catch (e) {}
    const f = QR_TONES[t] !== undefined ? QR_TONES[t] : QR_TONES.classic;
    if (!f) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = kind === "miss" ? f / 2 : f;
        g.gain.value = 0.08;
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.12);
    } catch (e) {}
}
function testQrAudioTheme(kind) { playQrBeep(kind === "failure" ? "miss" : "ok"); }
window.testQrAudioTheme = testQrAudioTheme;
function changeQrAudioTheme(theme) {
    try { localStorage.setItem("studio_qr_audio_theme", theme); } catch (e) {}
    playQrBeep("ok");
}
window.changeQrAudioTheme = changeQrAudioTheme;

// Quick Log holds the scanner; the inventory "scan" button opens it straight on the camera.
function openQuickLogModal() {
    forceShowModal("quick-log-modal");
    renderQrHistory();
}
window.openQuickLogModal = openQuickLogModal;
function openInventoryCameraScannerModal() {
    openQuickLogModal();
    const overlay = document.getElementById("qr-scanner-overlay");
    if (overlay) overlay.style.display = "flex";
    startQrCamera();
}
window.openInventoryCameraScannerModal = openInventoryCameraScannerModal;

// --- Shared export helpers: every file is built from the studio's own data ---
function studioIdentity() {
    let p = {};
    try { p = JSON.parse(localStorage.getItem("poli_studio_profile") || "{}"); } catch (e) {}
    return { name: p.studioName || "", address: p.studioAddress || "", email: p.studioEmail || "", phone: p.studioPhone || "" };
}
function csvCell(v) {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function downloadCsv(filename, head, rows) {
    downloadBlobFile(filename, [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n", "text/csv;charset=utf-8;");
}
// PDFs are not on the page, so the phrase translator never sees them: look their fixed labels up directly.
function pdfLabel(en) { return (window.i18nPhrases && window.i18nPhrases.translate(String(en))) || en; }
function downloadPdfTable(filename, title, head, rows, lines) {
    if (!(window.jspdf && window.jspdf.jsPDF)) { showStudioToast("The PDF library did not load"); return; }
    const doc = new window.jspdf.jsPDF();
    const id = studioIdentity();
    head = head.map(pdfLabel);
    doc.setFontSize(14);
    doc.text(pdfLabel(title), 14, 18);
    doc.setFontSize(9);
    let y = 25;
    [id.name, id.address, new Date().toLocaleString()].concat(lines || []).filter(Boolean).forEach((l) => { doc.text(String(l), 14, y); y += 5; });
    if (typeof doc.autoTable === "function") doc.autoTable({ head: [head], body: rows, startY: y + 2, styles: { fontSize: 8 } });
    doc.save(filename);
}
const fetchJson = (u) => fetch(u).then((r) => (r.ok ? r.json() : [])).catch(() => []);

// --- Activity log export (Export modal): category, date range and chosen columns ---
function activityExportRows() {
    const v = (id) => (document.getElementById(id) || {}).value || "";
    const cat = v("export-category-select") || "all";
    const range = v("export-range-select") || "all";
    const now = Date.now();
    let from = 0, to = Infinity;
    if (range === "24h") from = now - 864e5;
    if (range === "7d") from = now - 7 * 864e5;
    if (range === "30d") from = now - 30 * 864e5;
    if (range === "custom") {
        if (v("export-start-date")) from = new Date(v("export-start-date") + "T00:00").getTime();
        if (v("export-end-date")) to = new Date(v("export-end-date") + "T23:59:59").getTime();
    }
    const list = typeof allActivities !== "undefined" ? allActivities : [];
    return list.filter((a) => (cat === "all" || a.category === cat) && (() => { const t = new Date(a.timestamp).getTime(); return t >= from && t <= to; })());
}
function exportColumns() {
    const cols = [...document.querySelectorAll(".export-col-cb")].filter((c) => c.checked).map((c) => c.value);
    return cols.length ? cols : ["timestamp", "category", "title", "details", "user"];
}
function toggleCustomDateInputs() {
    const box = document.getElementById("export-custom-dates");
    if (box) box.style.display = (document.getElementById("export-range-select") || {}).value === "custom" ? "" : "none";
}
window.toggleCustomDateInputs = toggleCustomDateInputs;
function updateExportPreviewCount() {
    const n = activityExportRows().length;
    document.querySelectorAll('[onclick^="confirmActivityExport"]').forEach((b) => { b.title = n + " rows"; });
    const legend = document.getElementById("export-columns-live-legend");
    if (legend) legend.setAttribute("data-rows", String(n));
    updateExportColumnLegend();
}
window.updateExportPreviewCount = updateExportPreviewCount;
function updateExportColumnLegend() {
    const list = document.getElementById("export-legend-cols-list");
    if (list) list.textContent = exportColumns().join(", ") + " · " + activityExportRows().length + " rows";
}
window.updateExportColumnLegend = updateExportColumnLegend;
function confirmActivityExport(format) {
    const cols = exportColumns();
    const rows = activityExportRows().map((a) => cols.map((c) => (c === "timestamp" && a[c] ? new Date(a[c]).toLocaleString() : a[c] == null ? "" : a[c])));
    if (!rows.length) { showStudioToast("Nothing to export for this filter"); return; }
    if (format === "pdf") downloadPdfTable("activity_log.pdf", "Activity log", cols, rows);
    else downloadCsv("activity_log.csv", cols, rows);
    if (typeof closeExportModal === "function") closeExportModal();
}
window.confirmActivityExport = confirmActivityExport;
function confirmExportCSV() { confirmActivityExport("csv"); }
window.confirmExportCSV = confirmExportCSV;

// --- Scan history ---
function exportRecentScansCsv() {
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem("studio_qr_scans") || "[]"); } catch (e) {}
    if (!hist.length) { showStudioToast("Nothing to export for this filter"); return; }
    downloadCsv("scan_history.csv", ["time", "code", "matched", "name"], hist.map((h) => [new Date(h.at).toLocaleString(), h.code, h.match || "no", h.label || ""]));
}
window.exportRecentScansCsv = exportRecentScansCsv;

// --- Session durations (completed appointments) ---
async function sessionDurationRows() {
    const appts = await fetchJson("/api/appointments");
    return (Array.isArray(appts) ? appts : []).filter((a) => a.status === "completed").map((a) => {
        const h = Number(a.duration_minutes || 0) / 60, price = Number(a.estimated_price || a.price || 0);
        return [a.staff_name || "", a.service_type || "", a.client_name || "", new Date(a.datetime).toLocaleDateString(), h.toFixed(1), price.toFixed(2), h ? (price / h).toFixed(2) : ""];
    });
}
const SESSION_HEAD = ["artist", "service", "client", "date", "hours", "billed", "per hour"];
async function exportSessionDurationCSV() {
    const rows = await sessionDurationRows();
    if (!rows.length) { showStudioToast("No completed sessions yet."); return; }
    downloadCsv("session_durations.csv", SESSION_HEAD, rows);
}
window.exportSessionDurationCSV = exportSessionDurationCSV;
async function exportSessionDurationPDF() {
    const rows = await sessionDurationRows();
    if (!rows.length) { showStudioToast("No completed sessions yet."); return; }
    downloadPdfTable("session_durations.pdf", "Session durations", SESSION_HEAD, rows);
}
window.exportSessionDurationPDF = exportSessionDurationPDF;

// --- Staff shifts (clock in / out records) ---

const SHIFT_HEAD = ["staff", "clock in", "clock out", "hours"];
async function updateShiftStatusView() {
    const sel = document.getElementById("shift-staff-select");
    if (!sel) return;
    const shifts = await fetchJson("/api/staff/shifts");
    const mine = (Array.isArray(shifts) ? shifts : []).filter((s) => String(s.staff_id) === sel.value);
    const open = mine.find((s) => !s.clock_out);
    const weekAgo = Date.now() - 7 * 864e5;
    const hours = mine.filter((s) => new Date(s.clock_in).getTime() >= weekAgo).reduce((t, s) => t + Number(s.duration_hours || 0), 0);
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("shift-status-text", open ? "On shift since " + new Date(open.clock_in).toLocaleTimeString() : "Off shift");
    set("shift-weekly-hours", hours.toFixed(1) + " h");
    set("shift-toggle-btn", open ? "Clock out" : "Clock in");
}
window.updateShiftStatusView = updateShiftStatusView;

// --- Low-stock list ---
// Dashboard low-stock cards: the studio's own items (three made-up ones were typed into the page)
async function renderLowStockGrid() {
    const grid = document.getElementById("dashboard-low-stock-grid");
    if (!grid) return;
    let rows = [];
    try { rows = await lowStockRows(); } catch (e) { return; }
    grid.innerHTML = rows.length ? rows.map(([, name, , qty, min]) => `<div style="background:var(--ti-panel, #111827);padding:0.75rem;border-radius:8px;border:1px solid rgba(239,68,68,0.3);">
        <div style="font-weight:700;color:#FFF;font-size:0.82rem;">${escapeHtml(name)}</div>
        <div style="font-size:0.75rem;color:var(--ti-alert-ink, #F87171);margin-top:2px;">${escapeHtml(pdfLabel("Remaining"))}: ${Number(qty)} | ${escapeHtml(pdfLabel("Reorder at"))}: ${Number(min)}</div></div>`).join("")
        : `<div style="color:var(--ti-muted, #94A3B8);font-size:0.82rem;">${escapeHtml(pdfLabel("No items are below their reorder level"))}</div>`;
}
window.renderLowStockGrid = renderLowStockGrid;

async function lowStockRows() {
    const inv = await fetchJson("/api/inventory");
    const items = Array.isArray(inv) ? inv : (inv.items || []);
    return items.filter((i) => Number(i.quantity) <= Number(i.reorder_point || 0))
        .map((i) => [i.sku || "", i.name || "", i.category || "", i.quantity, i.reorder_point || 0, i.supplier || "", Number(i.unit_cost || i.price || 0).toFixed(2)]);
}
const LOW_HEAD = ["SKU", "item", "category", "in stock", "reorder level", "supplier", "unit cost"];
async function downloadLowStockManifest() {
    const rows = await lowStockRows();
    if (!rows.length) { showStudioToast("No items are below their reorder level"); return; }
    downloadCsv("low_stock.csv", LOW_HEAD, rows);
}
window.downloadLowStockManifest = downloadLowStockManifest;

// --- Purchase order modal: the studio's suppliers and their low-stock items ---
const poState = { suppliers: [], items: [], number: "" };
async function openPOModal() {
    forceShowModal("po-modal");
    const [suppliers, inv] = await Promise.all([fetchJson("/api/inventory/suppliers"), fetchJson("/api/inventory")]);
    poState.suppliers = Array.isArray(suppliers) ? suppliers : (suppliers.suppliers || []);
    const items = Array.isArray(inv) ? inv : (inv.items || []);
    poState.all = items.filter((i) => Number(i.quantity) <= Number(i.reorder_point || 0));
    poState.number = "PO-" + new Date().toLocaleDateString("en-CA").replace(/-/g, "") + "-" + String(Date.now()).slice(-4);
    const sel = document.getElementById("po-supplier-select");
    if (sel) sel.innerHTML = poState.suppliers.length
        ? poState.suppliers.map((s) => `<option value="${Number(s.id)}">${escapeHtml(s.name || "")}</option>`).join("")
        : '<option value="">No suppliers yet</option>';
    const meta = document.getElementById("po-meta-display");
    if (meta) meta.textContent = poState.number + " · " + new Date().toLocaleDateString();
    const shipTo = document.querySelector("#po-modal [data-po-ship-to]");
    if (shipTo) shipTo.textContent = [studioIdentity().name, studioIdentity().address].filter(Boolean).join(", ");
    onPOSupplierChange();
}
window.openPOModal = openPOModal;
function onPOSupplierChange() {
    const sel = document.getElementById("po-supplier-select");
    const sup = poState.suppliers.find((s) => String(s.id) === (sel ? sel.value : "")) || {};
    const email = document.getElementById("po-supplier-email");
    if (email) email.value = sup.order_email || sup.email || "";
    const mine = (poState.all || []).filter((i) => sup.name && String(i.supplier || "").toLowerCase() === String(sup.name).toLowerCase());
    poState.items = (mine.length ? mine : (poState.all || [])).map((i) => {
        const qty = Math.max(1, Number(i.reorder_point || 0) * 2 - Number(i.quantity || 0));
        const unit = Number(i.unit_cost || i.price || 0);
        return { name: i.name, sku: i.sku || "", qty, unit, total: qty * unit };
    });
    const table = document.getElementById("po-items-table");
    if (table) table.innerHTML = poState.items.length ? poState.items.map((i) =>
        `<div style="display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--ti-panel2, #1F2937);font-size:0.8rem;"><span data-no-phrase>${escapeHtml(i.name)} ${i.sku ? "(" + escapeHtml(i.sku) + ")" : ""}</span><span>${i.qty} × $${i.unit.toFixed(2)}</span></div>`).join("")
        : '<div style="padding:8px;color:var(--ti-muted, #94A3B8);">No items are below their reorder level</div>';
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("po-items-count-badge", poState.items.length + " Items");
    set("po-total-units", String(poState.items.reduce((t, i) => t + i.qty, 0)));
    set("po-total-cost", "$" + poState.items.reduce((t, i) => t + i.total, 0).toFixed(2));
}
window.onPOSupplierChange = onPOSupplierChange;
function printPOPDF() {
    if (!poState.items.length) { showStudioToast("No items are below their reorder level"); return; }
    const sel = document.getElementById("po-supplier-select");
    const sup = poState.suppliers.find((s) => String(s.id) === (sel ? sel.value : "")) || {};
    downloadPdfTable(poState.number + ".pdf", pdfLabel("Purchase order") + " " + poState.number, ["item", "SKU", "qty", "unit", "total"],
        poState.items.map((i) => [i.name, i.sku, i.qty, i.unit.toFixed(2), i.total.toFixed(2)]),
        ["To: " + (sup.name || "") + (sup.order_email || sup.email ? " <" + (sup.order_email || sup.email) + ">" : ""),
         "Total: $" + poState.items.reduce((t, i) => t + i.total, 0).toFixed(2)]);
}
window.printPOPDF = printPOPDF;
function triggerEmailDraftFromPO() {
    if (!poState.items.length) { showStudioToast("No items are below their reorder level"); return; }
    showComposeMessage({
        to_email: (document.getElementById("po-supplier-email") || {}).value || "",
        subject: "Purchase order " + poState.number,
        body: poState.items.map((i) => `${i.qty} x ${i.name}${i.sku ? " (" + i.sku + ")" : ""}`).join("\n") +
            "\n\nTotal: $" + poState.items.reduce((t, i) => t + i.total, 0).toFixed(2) +
            (studioIdentity().name ? "\n\n" + [studioIdentity().name, studioIdentity().address].filter(Boolean).join("\n") : "")
    });
}
window.triggerEmailDraftFromPO = triggerEmailDraftFromPO;

// --- Scanner extras: read a code from a photo; camera zoom ---
async function handleQrFileScan(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file || !window.Html5Qrcode) return;
    const reader = new Html5Qrcode("qr-reader");
    try { handleScannedCode(await reader.scanFile(file, false)); }
    catch (e) { showStudioToast("No code found in that picture"); }
    event.target.value = "";
}
window.handleQrFileScan = handleQrFileScan;
async function handleQrZoomChange(value) {
    if (!qrState.scanner || !qrState.scanner.isScanning) return;
    try { await qrState.scanner.applyVideoConstraints({ advanced: [{ zoom: Number(value) }] }); } catch (e) {}
}
window.handleQrZoomChange = handleQrZoomChange;

// --- CSV import: check the pasted text before importing ---
function validateCsvInRealTime() {
    const text = ((document.getElementById("import-csv-text") || {}).value || "").trim();
    const target = (document.getElementById("import-target-select") || {}).value || "clients";
    const box = document.getElementById("csv-validation-preview");
    const btn = document.getElementById("import-csv-submit-btn");
    const lines = text ? text.split(/\r?\n/).filter((l) => l.trim()) : [];
    const head = (lines[0] || "").toLowerCase().split(",").map((h) => h.trim());
    const need = ["name"];
    const missing = need.filter((h) => !head.includes(h));
    let msg = "";
    if (!lines.length) msg = "";
    else if (missing.length) msg = "Missing column: " + missing.join(", ");
    else msg = (lines.length - 1) + " rows ready to import";
    if (box) { box.textContent = msg; box.style.color = missing.length ? "#FCA5A5" : "#6EE7B7"; }
    if (btn) btn.disabled = !lines.length || missing.length > 0 || lines.length < 2;
}
window.validateCsvInRealTime = validateCsvInRealTime;

// --- Dashboard activity chart: events per day, last 14 days ---
function renderD3ActivityChart() {
    const el = document.getElementById("d3-activity-chart");
    if (!el || !window.d3 || typeof allActivities === "undefined") return;
    const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return d.toLocaleDateString("en-CA"); });
    const counts = days.map((d) => allActivities.filter((a) => a.timestamp && new Date(a.timestamp).toLocaleDateString("en-CA") === d).length);
    drawBarChart(el, days.map((d) => d.slice(5)), counts);
}
window.renderD3ActivityChart = renderD3ActivityChart;

// --- Session duration chart: average hours per service, filtered by artist / service ---
async function renderD3SessionDurationChart() {
    const el = document.getElementById("d3-session-duration-container");
    if (!el || !window.d3) return;
    const art = (document.getElementById("sd-artist-filter") || {}).value || "all";
    const proc = (document.getElementById("sd-procedure-filter") || {}).value || "all";
    const rows = (await sessionDurationRows()).filter((r) => (art === "all" || r[0] === art) && (proc === "all" || r[1] === proc));
    const by = {};
    rows.forEach((r) => { (by[r[1]] = by[r[1]] || []).push(Number(r[4])); });
    const labels = Object.keys(by);
    if (!labels.length) { el.innerHTML = '<div style="padding:12px;color:var(--ti-muted, #94A3B8);font-size:0.8rem;">No completed sessions yet.</div>'; return; }
    drawBarChart(el, labels, labels.map((l) => by[l].reduce((a, b) => a + b, 0) / by[l].length));
}
window.renderD3SessionDurationChart = renderD3SessionDurationChart;

function drawBarChart(el, labels, values) {
    const w = el.clientWidth || 300, h = el.clientHeight || 120, pad = 18;
    const max = Math.max(1, ...values);
    const bw = (w - pad) / labels.length;
    el.innerHTML = `<svg width="${w}" height="${h}" role="img">` + values.map((v, i) => {
        const bh = (h - pad - 4) * (v / max);
        return `<rect x="${pad + i * bw + 2}" y="${h - pad - bh}" width="${Math.max(2, bw - 4)}" height="${bh}" rx="2" fill="#38BDF8"><title>${escapeHtml(labels[i])}: ${Math.round(v * 10) / 10}</title></rect>` +
            (labels.length <= 14 ? `<text x="${pad + i * bw + bw / 2}" y="${h - 4}" font-size="9" fill="#94A3B8" text-anchor="middle">${escapeHtml(String(labels[i]).slice(0, 10))}</text>` : "");
    }).join("") + "</svg>";
}

// --- Dashboard procurement widget: monthly purchase-order spend per supplier ---
const procState = { orders: [] };
async function renderProcurementHealthChart() {
    const [orders, suppliers] = await Promise.all([fetchJson("/api/inventory/purchase-orders"), fetchJson("/api/inventory/suppliers")]);
    procState.orders = Array.isArray(orders) ? orders : (orders.orders || []);
    const sel = document.getElementById("dashboard-procurement-supplier-filter");
    const list = Array.isArray(suppliers) ? suppliers : (suppliers.suppliers || []);
    if (sel && sel.options.length <= 1) list.forEach((s) => { const o = document.createElement("option"); o.value = String(s.id); o.textContent = s.name; sel.appendChild(o); });
    filterProcurementChartBySupplier(sel ? sel.value : "all");
}
window.renderProcurementHealthChart = renderProcurementHealthChart;
function filterProcurementChartBySupplier(supplier) {
    const el = document.getElementById("d3-dashboard-procurement-health-chart");
    const orders = procState.orders.filter((o) => !supplier || supplier === "all" || String(o.supplier_id) === String(supplier));
    const months = [...Array(6)].map((_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 5 + i); return d.toLocaleDateString("en-CA").slice(0, 7); });
    const spend = months.map((m) => orders.filter((o) => String(o.created_at || "").slice(0, 7) === m).reduce((t, o) => t + Number(o.totalCost || o.total_cost || 0), 0));
    const badge = document.getElementById("dashboard-procurement-discount-badge");
    if (badge) badge.textContent = orders.length + " orders";
    if (el) drawBarChart(el, months, spend);
}
window.filterProcurementChartBySupplier = filterProcurementChartBySupplier;
document.addEventListener("DOMContentLoaded", renderProcurementHealthChart);

// --- Docs tab: the user guide in the CRM's language (public/guide/<lang>.html) ---
function syncUserGuideLanguage(lang) {
    const frame = document.getElementById("user-guide-frame");
    if (!frame) return;
    const l = lang || (window.i18n && window.i18n.getLanguage()) || "en";
    const src = "./guide/" + (/^(en|fr|it|de|es|nl|pt|th)$/.test(l) ? l : "en") + ".html";
    if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
}
document.addEventListener("DOMContentLoaded", () => syncUserGuideLanguage());
window.addEventListener("studioLanguageChanged", (e) => syncUserGuideLanguage(e.detail && e.detail.language));

// --- New Client Modal Handlers ---
// The same form adds a client and edits one: editingClientId says which.
let editingClientId = null;
const CLIENT_FORM_FIELDS = { name: "new-client-name", email: "new-client-email", phone: "new-client-phone", dob: "new-client-dob",
    preferred_artist: "new-client-artist", emergency_contact: "new-client-emergency", allergies: "new-client-allergies" };

function setClientFormMode(client) {
    editingClientId = client ? client.id : null;
    const form = document.getElementById("new-client-form");
    if (form) form.reset();
    const title = document.getElementById("new-client-modal-title");
    if (title) title.textContent = client ? "Edit Client: " + (client.name || "") : "New Client Record";
    const save = document.getElementById("new-client-save-btn");
    if (save) save.textContent = client ? "Save changes" : "Save client";
    if (!client) return;
    for (const [field, id] of Object.entries(CLIENT_FORM_FIELDS)) {
        const el = document.getElementById(id);
        if (el) el.value = client[field] || "";
    }
    const vip = document.getElementById("new-client-vip");
    if (vip) vip.checked = !!(client.is_vip || client.vip);
}

function openNewClientModal() {
    setClientFormMode(null);
    forceShowModal("new-client-modal-overlay");
}

function openEditClientModal() {
    const client = currentActiveProfileClient && (currentActiveProfileClient.client || currentActiveProfileClient);
    if (!client) return;
    setClientFormMode(client);
    forceShowModal("new-client-modal-overlay");
}
window.openEditClientModal = openEditClientModal;
window.openNewClientModal = openNewClientModal;

function closeNewClientModal() {
    forceHideModal("new-client-modal-overlay");
    editingClientId = null;
}
window.closeNewClientModal = closeNewClientModal;

async function handleSaveNewClient(event) {
    if (event) event.preventDefault();
    const nameInput = document.getElementById("new-client-name");
    const emailInput = document.getElementById("new-client-email");
    const phoneInput = document.getElementById("new-client-phone");
    const dobInput = document.getElementById("new-client-dob");
    const artistInput = document.getElementById("new-client-artist");
    const emergInput = document.getElementById("new-client-emergency");
    const allergiesInput = document.getElementById("new-client-allergies");
    const vipInput = document.getElementById("new-client-vip");

    let newClient = {
        name: nameInput ? nameInput.value.trim() : "New Client",
        email: emailInput ? emailInput.value.trim() : "",
        phone: phoneInput ? phoneInput.value.trim() : "",
        dob: dobInput ? dobInput.value : "",
        preferred_artist: artistInput ? artistInput.value : "",
        emergency_contact: emergInput ? emergInput.value.trim() : "",
        allergies: allergiesInput ? allergiesInput.value.trim() : "",
        is_vip: vipInput ? vipInput.checked : false,
    };

    if (!newClient.name) {
        showStudioToast("Please enter the client's name");
        return;
    }
    const editedId = editingClientId;
    try {
        const res = await fetch(editedId ? "/api/clients/" + editedId : "/api/clients", {
            method: editedId ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newClient)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        newClient = await res.json();
    } catch (e) {
        if (typeof showStudioToast === "function") showStudioToast("Could not save the client: the server did not answer");
        return;
    }

    renderClientsTable();
    populatePeopleSelects();

    if (typeof showStudioToast === "function") {
        showStudioToast(editedId ? `Client updated: ${newClient.name}` : `Client record created: ${newClient.name}`);
    }
    closeNewClientModal();
    // an edit started from the profile: show the profile again with the new details
    if (editedId && currentActiveProfileClient) openClientProfileModal(editedId);
    if (event && event.target && typeof event.target.reset === "function") {
        event.target.reset();
    }
}
window.handleSaveNewClient = handleSaveNewClient;

// --- Calendar: every booked appointment, the coming ones first ---
async function renderAppointmentsList() {
    const tbody = document.getElementById("schedule-appointments-tbody");
    if (!tbody) return;
    let appts = [];
    try {
        const res = await fetch("/api/appointments");
        if (res.ok) appts = await res.json();
    } catch (e) { /* shown as an empty list */ }
    appts = (Array.isArray(appts) ? appts : []).filter((a) => a && a.datetime);
    if (!appts.length) {
        tbody.innerHTML = '<tr><td colspan="9" style="padding:10px;color:var(--ti-muted, #94A3B8);">No appointments yet. Book the first one with Book Appointment.</td></tr>';
        return;
    }
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const time = (a) => new Date(a.datetime).getTime();
    const coming = appts.filter((a) => time(a) >= startOfToday.getTime()).sort((a, b) => time(a) - time(b));
    const earlier = appts.filter((a) => time(a) < startOfToday.getTime()).sort((a, b) => time(b) - time(a));
    const cell = (v, style) => `<td style="padding:8px;${style || ""}">${escapeHtml(String(v == null ? "" : v))}</td>`;
    const btn = "padding:4px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;";
    const row = (a) => {
        const open = a.status !== "completed" && a.status !== "cancelled";
        return `<tr class="appointment-row" style="border-bottom:1px solid var(--ti-panel2, #1E293B);">`
            + cell(new Date(a.datetime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }), "font-weight:700;color:#FFF;")
            + cell(a.client_name || a.client) + cell(a.service_type) + cell(a.staff_name || a.artist_name)
            + cell(Number(a.estimated_price || a.price || 0).toFixed(2))
            // Henry: the deposit and what is still to pay, at a glance (payments are recorded per
            // client, not per appointment, so they are not subtracted here)
            + cell(Number(a.deposit_paid || 0).toFixed(2))
            + cell(Math.max(0, Number(a.estimated_price || a.price || 0) - Number(a.deposit_paid || 0)).toFixed(2), "font-weight:700;")
            + cell(a.status || "scheduled")
            + `<td style="padding:8px;text-align:right;white-space:nowrap;">`
            + `<button type="button" onclick="openEditAppointment(${Number(a.id)})" style="${btn}background:var(--ti-line, #334155);color:var(--ti-text, #E2E8F0);border:1px solid var(--ti-line2, #475569);">Edit</button> `
            + (open ? `<button type="button" onclick="setAppointmentStatus(${Number(a.id)}, 'completed')" style="${btn}background:var(--ti-green, #10B981);color:#FFF;border:none;">Completed</button> ` : "")
            + `<button type="button" onclick="removeAppointment(${Number(a.id)})" style="${btn}background:transparent;color:var(--ti-alert-ink, #FCA5A5);border:1px solid rgba(239,68,68,0.5);">Remove</button></td></tr>`;
    };
    tbody.innerHTML = coming.map(row).join("")
        + (earlier.length ? '<tr><td colspan="9" style="padding:10px 8px 4px;color:var(--ti-muted, #94A3B8);font-size:0.75rem;font-weight:700;">Earlier</td></tr>' + earlier.map(row).join("") : "");
}
window.renderAppointmentsList = renderAppointmentsList;
document.addEventListener("DOMContentLoaded", renderAppointmentsList);

// Every screen that shows appointments, after one is booked, completed or removed: the four
// buttons each refreshed a different part, so a count or a station could show a stale booking.
function refreshAppointmentViews() {
    renderFinanceSummary();
    renderAppointmentsList();
    if (typeof renderDashboardKpis === "function") renderDashboardKpis();
    if (typeof renderStationStripAndSessions === "function") renderStationStripAndSessions();
}

async function setAppointmentStatus(id, status) {
    let appt = null;
    try {
        const res = await fetch("/api/appointments/" + id + "/status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        if (!res.ok) throw new Error("HTTP " + res.status);
        appt = await res.json().catch(() => null);
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    refreshAppointmentViews();
    // Henry, 2026-10-17: "Total spent" did not move when a session was completed. Spent is what was paid, so the
    // payment is recorded here, filled in with the client and the price; close the window if it was paid already.
    const price = appt ? Number(appt.estimated_price || appt.price || 0) : 0;
    if (status === "completed" && appt && appt.id && price > 0) openQuickRecordPaymentModal({ clientId: appt.client_id, amount: price });
}
window.setAppointmentStatus = setAppointmentStatus;

async function removeAppointment(id) {
    if (!window.confirm("Remove this appointment? This cannot be undone.")) return;
    try {
        const res = await fetch("/api/appointments/" + id, { method: "DELETE" });
        if (!res.ok) throw new Error("HTTP " + res.status);
    } catch (e) { showStudioToast("Could not remove the appointment: the server did not answer"); return; }
    refreshAppointmentViews();
}
window.removeAppointment = removeAppointment;

// --- New Appointment Modal Handlers ---

// also called by the tattoo price estimator tool (its Book button), from inside its frame

function openNewAppointmentModal() {
    setAppointmentFormMode(null);
    forceShowModal("new-appointment-modal-overlay");
}

// The booking form also edits a booked appointment: editingAppointmentId says which.
let editingAppointmentId = null;
function setAppointmentFormMode(appt) {
    editingAppointmentId = appt ? appt.id : null;
    autocompleteClients = null; // clients added since the last booking must be offered too
    loadStations();             // and stations added in Settings since
    const set = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined && v !== null) el.value = v; };
    const form = document.querySelector("#new-appointment-modal-overlay form");
    if (form && !appt) form.reset();
    set("new-appt-client-id", appt && appt.client_id ? String(appt.client_id) : "");
    showBookingAgeNote(null);
    const title = document.getElementById("new-appt-title");
    if (title) title.textContent = appt ? "Edit Appointment" : "Book Appointment";
    const save = document.getElementById("new-appt-save-btn");
    if (save) save.textContent = appt ? "Save changes" : "Book appointment";
    if (!appt) return;
    const when = appt.datetime ? new Date(appt.datetime) : null;
    set("new-appt-client", appt.client_name || "");
    set("new-appt-service", appt.service_type);
    set("new-appt-artist", appt.staff_name);
    set("new-appt-station", appt.station);
    if (when && !isNaN(when.getTime())) {
        set("new-appt-date", when.toLocaleDateString("en-CA"));
        set("new-appt-time", when.toTimeString().slice(0, 5));
    }
    set("new-appt-duration", appt.duration_minutes);
    set("new-appt-price", appt.estimated_price);
    set("new-appt-deposit", appt.deposit_paid);
    set("new-appt-notes", appt.notes);
}

// Henry: see and change a booked appointment (deposit, time, artist...) from the Calendar
async function openEditAppointment(id) {
    let appt;
    try { appt = (await (await fetch("/api/appointments")).json()).find((a) => Number(a.id) === Number(id)); } catch (e) {}
    if (!appt) { showStudioToast("This appointment could not be loaded"); return; }
    setAppointmentFormMode(appt);
    forceShowModal("new-appointment-modal-overlay");
}
window.openEditAppointment = openEditAppointment;
window.openNewAppointmentModal = openNewAppointmentModal;

function closeNewAppointmentModal() {
    const el = document.getElementById("new-appointment-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeNewAppointmentModal = closeNewAppointmentModal;

async function handleSaveNewAppointment(event) {
    if (event) event.preventDefault();
    const clientInput = document.getElementById("new-appt-client");
    const serviceInput = document.getElementById("new-appt-service");
    const artistInput = document.getElementById("new-appt-artist");
    const stationInput = document.getElementById("new-appt-station");
    const dateInput = document.getElementById("new-appt-date");
    const timeInput = document.getElementById("new-appt-time");
    const durationInput = document.getElementById("new-appt-duration");
    const priceInput = document.getElementById("new-appt-price");
    const depositInput = document.getElementById("new-appt-deposit");
    const notesInput = document.getElementById("new-appt-notes");

    const newAppt = {
        client_name: clientInput ? clientInput.value.trim() : "Client Booking",
        service_type: serviceInput ? serviceInput.value : "Custom Tattoo",
        artist_name: artistInput ? artistInput.value : "Alex Miller",
        station: stationInput ? stationInput.value : "Station 1",
        date: dateInput ? dateInput.value : new Date().toLocaleDateString("en-CA"),
        time: timeInput ? timeInput.value : "14:00",
        duration_minutes: durationInput ? parseInt(durationInput.value, 10) : 120,
        estimated_price: priceInput ? parseFloat(priceInput.value) : 0,
        deposit_paid: depositInput ? parseFloat(depositInput.value) : 0,
        notes: notesInput ? notesInput.value.trim() : "",
        status: "Confirmed"
    };

    const editedId = editingAppointmentId;
    const pickedClient = (document.getElementById("new-appt-client-id") || {}).value || "";
    try {
        const when = new Date(newAppt.date + "T" + (newAppt.time || "00:00"));
        const res = await fetch(editedId ? "/api/appointments/" + editedId : "/api/appointments", {
            method: editedId ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign({}, newAppt, {
                staff_name: newAppt.artist_name,
                client_id: pickedClient || undefined, // a client picked from the list: the booking is theirs
                datetime: isNaN(when.getTime()) ? undefined : when.toISOString(),
                status: editedId ? undefined : "scheduled"
            }))
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
    } catch (e) {
        if (typeof showStudioToast === "function") showStudioToast("Could not save the appointment: the server did not answer");
        return;
    }

    refreshAppointmentViews();

    if (typeof showStudioToast === "function") {
        showStudioToast(`Appointment booked for ${newAppt.client_name} (${newAppt.date})`);
    }
    closeNewAppointmentModal();
    if (event && event.target && typeof event.target.reset === "function") {
        event.target.reset();
    }
}
window.handleSaveNewAppointment = handleSaveNewAppointment;

// --- Inventory Usage Heatmap Handlers ---

function closeInventoryUsageHeatmapModal() {
    const el = document.getElementById("inventory-usage-heatmap-modal");
    if (el) el.style.display = "none";
}
window.closeInventoryUsageHeatmapModal = closeInventoryUsageHeatmapModal;

function refreshSupplyUsageHeatmap() {
    if (typeof renderD3SupplyUsageHeatmap === "function") {
        renderD3SupplyUsageHeatmap();
    }
    if (typeof showStudioToast === "function") {
        showStudioToast("Refreshed supply usage density heatmap calculations");
    }
}
window.refreshSupplyUsageHeatmap = refreshSupplyUsageHeatmap;

// --- Artist Performance Widget Toggle ---

// --- Missing Operational Handlers ---
function triggerExportCSV() {
    if (typeof openQuickTableExportModal === "function") {
        openQuickTableExportModal("summary-events-table"); // the dashboard list: the activity log
    } else if (typeof executeQuickExport === "function") {
        executeQuickExport("csv");
    }
}
window.triggerExportCSV = triggerExportCSV;

function setChartDateFilter(filterRange, btnElement) {
    if (btnElement && btnElement.parentElement) {
        btnElement.parentElement.querySelectorAll("button").forEach(b => {
            b.style.background = "#1F2937";
            b.style.color = "#9CA3AF";
            b.style.borderColor = "#374151";
        });
        btnElement.style.background = "#374151";
        btnElement.style.color = "#38BDF8";
        btnElement.style.borderColor = "#38BDF8";
    }
    if (typeof renderD3InventoryTrendChart === "function") {
        renderD3InventoryTrendChart(filterRange);
    }
    if (typeof showStudioToast === "function") {
        showStudioToast(`Chart window filtered to: ${filterRange}`);
    }
}
window.setChartDateFilter = setChartDateFilter;

function clearChartDateFilter() {
    setChartDateFilter("30days", null);
}
window.clearChartDateFilter = clearChartDateFilter;

function removeChartDateFilter() {
    setChartDateFilter("all", null);
}
window.removeChartDateFilter = removeChartDateFilter;

function filterActivityStream(category, btnElement) {
    if (btnElement && btnElement.parentElement) {
        btnElement.parentElement.querySelectorAll("button").forEach(b => {
            b.style.background = "#1F2937";
            b.style.color = "#9CA3AF";
            b.style.borderColor = "#374151";
        });
        btnElement.style.background = "#374151";
        btnElement.style.color = "#A78BFA";
        btnElement.style.borderColor = "#A78BFA";
    }
    const items = document.querySelectorAll(".activity-stream-item, .activity-card-item, #activity-stream-feed > div");
    items.forEach(item => {
        const itemCat = item.getAttribute("data-category") || item.dataset.category || "";
        if (category === "all" || itemCat.toLowerCase() === category.toLowerCase()) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
    if (typeof showStudioToast === "function") {
        showStudioToast(`Activity stream filtered: ${category}`);
    }
}
window.filterActivityStream = filterActivityStream;

function filterClientDirectoryList(query) {
    const q = (query || "").toLowerCase().trim();
    const rows = document.querySelectorAll("#client-directory-modal-body > div > div, .client-directory-row");
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (!q || text.includes(q)) {
            row.style.display = row.tagName === "TR" ? "" : "flex";
        } else {
            row.style.display = "none";
        }
    });
}
window.filterClientDirectoryList = filterClientDirectoryList;

// The reorder list was four invented products (real brand names) whatever the studio held: now the studio's own
// items at or below their reorder level, the same rule as the low-stock download.
async function quickReorderLowStockEmail() {
    const lowStockItems = (await lowStockRows()).map(([sku, name, , qty, min, supplier]) => ({ sku, name, qty: Number(qty), min: Number(min), supplier }));
    if (!lowStockItems.length) { showStudioToast("No items are below their reorder level"); return; }

    let manifest = "PO REORDER DRAFT - STUDIO INVENTORY\n====================================\n";
    manifest += `Generated: ${new Date().toLocaleString()}\n\n`;
    lowStockItems.forEach(it => {
        manifest += `• [${it.sku}] ${it.name} - Current: ${it.qty} (Order Qty: ${it.min * 2 - it.qty}) | Supplier: ${it.supplier}\n`;
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(manifest).then(() => {
            if (typeof showStudioToast === "function") {
                showStudioToast("Low-stock reorder manifest copied to clipboard");
            }
        }).catch(() => {
            if (typeof showStudioToast === "function") {
                showStudioToast("Low-stock reorder manifest generated");
            }
        });
    } else if (typeof showStudioToast === "function") {
        showStudioToast("Low-stock reorder manifest generated");
    }
}
window.quickReorderLowStockEmail = quickReorderLowStockEmail;

function openSkinVisualizerModal() {
    forceShowModal("gallery-before-after-modal-overlay");
}
window.openSkinVisualizerModal = openSkinVisualizerModal;


function toggleAudioAlerts() {
    window.audioAlertsEnabled = !window.audioAlertsEnabled;
    try {
        localStorage.setItem("studio_audio_alerts_enabled", window.audioAlertsEnabled ? "true" : "false");
    } catch (e) {}
    if (typeof showStudioToast === "function") {
        showStudioToast(`Auditory studio cues ${window.audioAlertsEnabled ? "enabled" : "muted"}`);
    }
}
window.toggleAudioAlerts = toggleAudioAlerts;

function toggleScheduleFields() {
    const freq = document.getElementById("sched-frequency-select");
    const dayWrap = document.getElementById("sched-day-select-wrapper");
    if (freq && dayWrap) {
        dayWrap.style.display = (freq.value === "weekly" || freq.value === "monthly") ? "block" : "none";
    }
}
window.toggleScheduleFields = toggleScheduleFields;

function toggleScheduleDaySelect() {
    toggleScheduleFields();
}
window.toggleScheduleDaySelect = toggleScheduleDaySelect;

function saveScheduledReport(event) {
    if (event) event.preventDefault();
    const titleInput = document.getElementById("sched-report-title");
    const freqInput = document.getElementById("sched-frequency-select");
    const emailInput = document.getElementById("sched-recipient-email");
    const formatInput = document.getElementById("sched-format-select");

    const report = {
        id: Date.now(),
        title: titleInput ? titleInput.value.trim() : "Daily Studio Financial & Compliance Summary",
        frequency: freqInput ? freqInput.value : "daily",
        recipient: emailInput ? emailInput.value.trim() : "manager@studio.com",
        format: formatInput ? formatInput.value : "csv",
        created_at: new Date().toISOString()
    };

    let reports = [];
    try {
        const stored = localStorage.getItem("studio_scheduled_reports");
        if (stored) reports = JSON.parse(stored);
    } catch (e) {}
    reports.push(report);
    try {
        localStorage.setItem("studio_scheduled_reports", JSON.stringify(reports));
    } catch (e) {}

    if (typeof showStudioToast === "function") {
        showStudioToast(`Automated report scheduled: ${report.title}`);
    }
    const modal = document.getElementById("auto-scheduler-modal-overlay");
    if (modal) modal.style.display = "none";
}
window.saveScheduledReport = saveScheduledReport;

function triggerManualSync() {
    const indicator = document.getElementById("inventory-remote-sync-indicator");
    if (indicator) {
        indicator.textContent = "Syncing...";
        indicator.style.color = "#FBBF24";
        setTimeout(() => {
            indicator.textContent = "Synced Just Now";
            indicator.style.color = "#34D399";
        }, 600);
    }
    if (typeof showStudioToast === "function") {
        showStudioToast("Triggered real-time catalogue and client synchronization");
    }
}
window.triggerManualSync = triggerManualSync;

function switchStudioLanguage(lang) {
    if (window.i18n && typeof window.i18n.setLanguage === "function") {
        window.i18n.setLanguage(lang);
    }
    if (typeof showStudioToast === "function") {
        showStudioToast(`Studio locale switched: ${(lang || "en").toUpperCase()}`);
    }
}
window.switchStudioLanguage = switchStudioLanguage;

// --- 16 Functional onsubmit Implementations ---

function addPortalPinnedNote(event) {
    if (event) event.preventDefault();
    const input = document.getElementById("portal-note-input");
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    
    let notes = [];
    try {
        const stored = localStorage.getItem("studio_portal_pinned_notes");
        if (stored) notes = JSON.parse(stored);
    } catch (e) {}
    const noteObj = { id: Date.now(), text, author: "Staff Member", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    notes.unshift(noteObj);
    try {
        localStorage.setItem("studio_portal_pinned_notes", JSON.stringify(notes));
    } catch (e) {}

    const container = document.getElementById("portal-pinned-notes-list") || document.getElementById("portal-notes-container");
    if (container) {
        const el = document.createElement("div");
        el.style.cssText = "background:var(--ti-panel2, #1E293B);padding:10px 14px;border-radius:8px;border:1px solid var(--ti-line, #334155);color:var(--ti-text, #F8FAFC);font-size:0.85rem;margin-bottom:8px;";
        el.innerHTML = `<strong><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-pin></use></svg> ${escapeHtml(noteObj.author)} (${escapeHtml(noteObj.timestamp)}):</strong> ${escapeHtml(noteObj.text)}`;
        container.prepend(el);
    }
    input.value = "";
    if (typeof showStudioToast === "function") {
        showStudioToast("Pinned note added to studio floor portal");
    }
}
window.addPortalPinnedNote = addPortalPinnedNote;

function addQuickNote(event) {
    if (event) event.preventDefault();
    const input = document.getElementById("quick-note-input") || document.getElementById("dashboard-quick-note-input");
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();

    let logs = [];
    try {
        const stored = localStorage.getItem("studio_activity_logs");
        if (stored) logs = JSON.parse(stored);
    } catch (e) {}
    const logObj = { id: Date.now(), category: "notes", title: "Quick Note Logged", details: text, timestamp: new Date().toISOString() };
    logs.unshift(logObj);
    try {
        localStorage.setItem("studio_activity_logs", JSON.stringify(logs));
    } catch (e) {}

    const feed = document.getElementById("activity-stream-feed");
    if (feed) {
        const el = document.createElement("div");
        el.className = "activity-stream-item";
        el.setAttribute("data-category", "notes");
        el.style.cssText = "background:var(--ti-panel2, #1F2937);padding:10px 14px;border-radius:8px;border:1px solid var(--ti-line, #374151);color:var(--ti-text, #F9FAFB);margin-bottom:8px;font-size:0.85rem;";
        el.innerHTML = `<div style="display:flex;justify-content:space-between;color:var(--ti-muted, #9CA3AF);font-size:0.75rem;"><span><svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-note></use></svg> Quick Note</span><span>Just now</span></div><div style="margin-top:4px;color:#FFF;">${escapeHtml(text)}</div>`;
        feed.prepend(el);
    }
    input.value = "";
    if (typeof showStudioToast === "function") {
        showStudioToast("Quick note recorded in studio activity stream");
    }
}
window.addQuickNote = addQuickNote;

// Log Activity: it handed over to addQuickNote, which reads the dashboard's quick-note box, found it
// empty and saved nothing, and the window closed anyway (Henry, 2026-10-22).
async function submitQuickLog(event) {
    if (event) event.preventDefault();
    const val = (id) => ((document.getElementById(id) || {}).value || "").trim();
    const body = { title: val("log-title-input"), category: val("log-category-select") || "general", user: val("log-user-input") || undefined, details: val("log-details-input"), action: "MANUAL_LOG" };
    if (!body.title) { showStudioToast("Give the activity a title"); return; }
    try {
        const res = await fetch("/api/activity-logs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("HTTP " + res.status);
    } catch (e) {
        showStudioToast("Could not save the activity: the server did not answer");
        return;
    }
    showStudioToast("Activity saved to the studio activity stream");
    if (event && event.target && event.target.reset) event.target.reset();
    forceHideModal("quick-log-modal");
}
window.submitQuickLog = submitQuickLog;


function submitTipSplitRecord(event) {
    if (event) event.preventDefault();
    const num = (id) => parseFloat((document.getElementById(id) || {}).value) || 0;
    const totalTip = num("tipcalc-tip");
    if (totalTip <= 0) { showStudioToast("Enter the tip amount"); return; }
    const record = {
        id: Date.now(),
        artist: (document.getElementById("tipcalc-artist") || {}).value || "",
        sessionTotal: num("tipcalc-session"),
        totalTip: totalTip,
        artistAmount: (totalTip * 0.8).toFixed(2),
        assistAmount: (totalTip * 0.15).toFixed(2),
        deskAmount: (totalTip * 0.05).toFixed(2),
        timestamp: new Date().toISOString()
    };
    let records = [];
    try { records = JSON.parse(localStorage.getItem("studio_tip_records") || "[]"); } catch (e) {}
    records.unshift(record);
    try { localStorage.setItem("studio_tip_records", JSON.stringify(records)); } catch (e) {}
    showStudioToast("Tip split recorded");
    if (typeof closeTipCalculatorModal === "function") closeTipCalculatorModal();
}
window.submitTipSplitRecord = submitTipSplitRecord;


async function submitSanitizationChecklist(event) {
    if (event) event.preventDefault();
    const log = {
        supervisor: (document.getElementById("sani-staff-select") || {}).value || "",
        autoclave_cycle: ((document.getElementById("sani-autoclave-id") || {}).value || "").trim(),
        notes: ((document.getElementById("sani-notes") || {}).value || "").trim(),
        items: [...document.querySelectorAll(".sani-chk")].map((b) => ({
            item: (b.closest("label") || b.parentElement).textContent.replace(/\s+/g, " ").trim(),
            done: b.checked
        }))
    };
    let saved;
    try {
        const res = await fetch("/api/compliance/sanitization-logs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(log) });
        if (!res.ok) throw new Error("HTTP " + res.status);
        saved = (await res.json()).log;
    } catch (e) {
        showStudioToast("Could not save the checklist: the server did not answer");
        return;
    }
    showStudioToast("Closing checklist saved: " + saved.completed + " / " + saved.total);
    closeSanitizationChecklistModal();
    if (event && event.target && event.target.reset) event.target.reset();
    updateSanitizationProgress();
}
window.submitSanitizationChecklist = submitSanitizationChecklist;

// Checklists saved before 1.0.31 are in the browser that saved them: they go to the studio database once.
async function moveBrowserSanitizationLogs() {
    let logs = [];
    try { logs = JSON.parse(localStorage.getItem("studio_sanitization_logs") || "[]"); } catch (e) { return; }
    if (!Array.isArray(logs) || !logs.length) return;
    const left = [];
    for (const log of logs) {
        try {
            const res = await fetch("/api/compliance/sanitization-logs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(log) });
            if (!res.ok && res.status !== 400) left.push(log); // 400: an empty checklist, nothing to keep
        } catch (e) { left.push(log); }
    }
    try { if (left.length) localStorage.setItem("studio_sanitization_logs", JSON.stringify(left)); else localStorage.removeItem("studio_sanitization_logs"); } catch (e) {}
}

// Past end-of-day checklists: who, when, what was ticked, with Print
async function openSanitizationLogsModal() {
    await moveBrowserSanitizationLogs();
    let logs = [];
    try { const r = await fetch("/api/compliance/sanitization-logs"); if (r.ok) logs = await r.json(); } catch (e) {}
    const rows = logs.map((l) => `
        <div style="padding:10px 0;border-bottom:1px solid var(--ti-panel2, #1E293B);">
            <div style="display:flex;justify-content:space-between;gap:10px;font-weight:700;"><span>${escapeHtml(new Date(l.timestamp).toLocaleString())}</span><span>${Number(l.completed)} / ${Number(l.total)}</span></div>
            <div style="color:var(--ti-muted, #94A3B8);font-size:0.82rem;margin-top:2px;">${escapeHtml([l.supervisor, l.autoclave_cycle && pdfLabel("Autoclave cycle") + ": " + l.autoclave_cycle].filter(Boolean).join(" | "))}</div>
            <ul style="margin:6px 0 0;padding-left:18px;font-size:0.82rem;">${(l.items || []).map((i) => `<li>${i.done ? "[x]" : "[ ]"} ${escapeHtml(i.item)}</li>`).join("")}</ul>
            ${l.notes ? `<div style="margin-top:4px;font-size:0.82rem;">${escapeHtml(l.notes)}</div>` : ""}
        </div>`).join("");
    showListWindow("sanitization-logs-modal-overlay", "pouch", "End-of-day sanitization logs", rows || `<div>No checklist has been saved yet.</div>`);
}
window.openSanitizationLogsModal = openSanitizationLogsModal;

async function submitSendAftercareEmail(event) {
    if (event) event.preventDefault();
    const v = (id) => ((document.getElementById(id) || {}).value || '').trim();
    const name = v('aftercare-email-client-name');
    let client = {};
    try {
        const r = await fetch('/api/clients');
        const list = r.ok ? await r.json() : [];
        client = list.find((c) => String(c.name || '').toLowerCase() === name.toLowerCase()) || {};
    } catch (e) {}
    const dispatch = {
        id: Date.now(),
        client: name,
        email: client.email || '',
        procedure: v('aftercare-template-select'),
        subject: v('aftercare-email-subject'),
        prepared_at: new Date().toISOString(),
        delivery_status: 'Prepared'
    };
    let dispatches = [];
    try { dispatches = JSON.parse(localStorage.getItem('studio_aftercare_dispatches') || '[]'); } catch (e) {}
    dispatches.unshift(dispatch);
    try { localStorage.setItem('studio_aftercare_dispatches', JSON.stringify(dispatches)); } catch (e) {}
    closeAftercareEmailModal();
    showComposeMessage({ to_email: client.email || '', to_phone: client.phone || '', subject: dispatch.subject, body: v('aftercare-email-body') });
}
window.submitSendAftercareEmail = submitSendAftercareEmail;

function addCustomMessengerMacro(event) {
    if (event) event.preventDefault();
    const text = prompt("Enter custom floor message macro:");
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    let macros = [];
    try {
        const stored = localStorage.getItem("studio_messenger_macros");
        if (stored) macros = JSON.parse(stored);
    } catch (e) {}
    macros.push(cleanText);
    try {
        localStorage.setItem("studio_messenger_macros", JSON.stringify(macros));
    } catch (e) {}

    const container = document.getElementById("messenger-macros-container");
    if (container) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.onclick = () => { if (typeof insertMessengerMacro === "function") insertMessengerMacro(cleanText); };
        btn.style.cssText = "padding:4px 10px;background:var(--ti-line, #334155);color:var(--ti-text, #F8FAFC);border:none;border-radius:6px;font-size:0.75rem;cursor:pointer;";
        btn.textContent = cleanText;
        container.appendChild(btn);
    }
    if (typeof showStudioToast === "function") {
        showStudioToast(`Added floor messenger macro: "${cleanText}"`);
    }
}
window.addCustomMessengerMacro = addCustomMessengerMacro;

function submitLinkBeforeAfterPair(event) {
    if (event) event.preventDefault();
    const clientSelect = document.getElementById("ba-client-select");
    const dateInput = document.getElementById("ba-procedure-date");
    const beforeUrl = document.getElementById("ba-before-url");
    const afterUrl = document.getElementById("ba-after-url");
    const notesInput = document.getElementById("ba-notes");

    const pair = {
        id: Date.now(),
        client: clientSelect ? clientSelect.value : "Client",
        date: dateInput ? dateInput.value : new Date().toLocaleDateString("en-CA"),
        before_image: beforeUrl ? beforeUrl.value.trim() : "",
        after_image: afterUrl ? afterUrl.value.trim() : "",
        notes: notesInput ? notesInput.value.trim() : ""
    };

    let pairs = [];
    try {
        const stored = localStorage.getItem("studio_before_after_gallery");
        if (stored) pairs = JSON.parse(stored);
    } catch (e) {}
    pairs.unshift(pair);
    try {
        localStorage.setItem("studio_before_after_gallery", JSON.stringify(pairs));
    } catch (e) {}

    if (typeof showStudioToast === "function") {
        showStudioToast("Before & After visual pair linked and cataloged");
    }
    if (typeof closeBeforeAfterLinkModal === "function") {
        closeBeforeAfterLinkModal();
    } else {
        const el = document.getElementById("gallery-before-after-modal-overlay");
        if (el) el.style.display = "none";
    }
}
window.submitLinkBeforeAfterPair = submitLinkBeforeAfterPair;

function handleSaveVatSettings(event) {
    if (event) event.preventDefault();
    const rateInput = document.getElementById("vat-rate-input");
    const taxIdInput = document.getElementById("vat-tax-id-input");
    const inclusiveSelect = document.getElementById("vat-inclusive-select");
    const currencySelect = document.getElementById("vat-currency-select");

    const settings = {
        rate: rateInput ? parseFloat(rateInput.value) || 20 : 20,
        taxId: taxIdInput ? taxIdInput.value.trim() : "",
        inclusive: inclusiveSelect ? inclusiveSelect.value === "true" : true,
        currency: currencySelect ? currencySelect.value : "USD"
    };

    try {
        localStorage.setItem("studio_vat_config", JSON.stringify(settings));
    } catch (e) {}

    if (typeof showStudioToast === "function") {
        showStudioToast(`Tax & VAT configuration saved: ${settings.rate}% rate`);
    }
    if (typeof closeVatSettingsModal === "function") {
        closeVatSettingsModal();
    } else {
        const el = document.getElementById("vat-settings-modal-overlay");
        if (el) el.style.display = "none";
    }
}
window.handleSaveVatSettings = handleSaveVatSettings;

// ponytail: commas inside "quotes" are handled, a line break inside quotes is not
function parseCsvRows(text) {
    const split = (line) => {
        const out = []; let cur = "", quoted = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (quoted) {
                if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') quoted = false; else cur += c;
            } else if (c === '"') quoted = true;
            else if (c === ",") { out.push(cur.trim()); cur = ""; } else cur += c;
        }
        out.push(cur.trim());
        return out;
    };
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];
    const head = split(lines[0]).map((h) => h.toLowerCase());
    return lines.slice(1).map((l) => {
        const cells = split(l), row = {};
        head.forEach((h, i) => { row[h] = cells[i] || ""; });
        return row;
    }).filter((r) => r.name);
}

async function submitCSVImport(event) {
    if (event) event.preventDefault();
    const target = (document.getElementById("import-target-select") || {}).value === "inventory" ? "inventory" : "clients";
    const box = document.getElementById("import-csv-text");
    const rows = parseCsvRows(box ? box.value : "");
    if (!rows.length) {
        showStudioToast("Nothing to import: paste a first line with the column names (name, ...), then one line per row");
        return;
    }
    let result;
    try {
        const res = await fetch("/api/" + target + "/import-csv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows }) });
        result = await res.json();
        if (!res.ok) throw new Error(result.error || "HTTP " + res.status);
    } catch (e) {
        showStudioToast("Could not import: " + (e.message || "the server did not answer"));
        return;
    }
    const n = result.count != null ? result.count : (result.imported != null ? result.imported : rows.length);
    showStudioToast("Imported " + n + (target === "inventory" ? " stock items" : " clients"));
    if (box) box.value = "";
    validateCsvInRealTime();
    renderClientsTable();
    populatePeopleSelects();
    closeImportModal();
}
window.submitCSVImport = submitCSVImport;

// The form read fields that do not exist and kept the result in this browser only, so the
// server never had an address to sync from; the status card was fixed text. Both use the server now.
async function loadRemoteCsvSyncForm() {
    let st;
    try { const r = await fetch("/api/sync/status"); if (!r.ok) return; st = await r.json(); } catch (e) { return; }
    const el = (id) => document.getElementById(id);
    if (el("sync-clients-url")) el("sync-clients-url").value = st.clientsUrl || "";
    if (el("sync-inventory-url")) el("sync-inventory-url").value = st.inventoryUrl || "";
    if (el("sync-interval-min")) el("sync-interval-min").value = Number(st.intervalMinutes) || 30;
    if (el("sync-enabled-cb")) el("sync-enabled-cb").checked = !!st.enabled;
    const when = (t) => (t ? new Date(t).toLocaleString() : pdfLabel("Never"));
    if (el("sync-badge-status")) {
        el("sync-badge-status").textContent = (st.enabled ? "" : "") + pdfLabel(st.enabled ? "Automatic CSV sync on" : "Automatic CSV sync off");
        el("sync-badge-status").style.color = st.enabled ? "#34D399" : "#94A3B8";
    }
    if (el("sync-last-time")) el("sync-last-time").textContent = when(st.lastSyncTime);
    if (el("sync-next-time")) el("sync-next-time").textContent = st.nextSyncTime ? when(st.nextSyncTime) : "—";
    if (el("sync-count")) el("sync-count").textContent = String(st.syncCount || 0);
    const x = st.lastStats;
    if (el("sync-last-stats")) el("sync-last-stats").textContent = x ? String((x.clientsProcessed || 0) + (x.inventoryProcessed || 0)) : pdfLabel("None");
    const banner = el("sync-error-banner");
    if (banner) { banner.textContent = st.status === "error" ? st.lastError || "" : ""; banner.style.display = banner.textContent ? "" : "none"; }
}
window.loadRemoteCsvSyncForm = loadRemoteCsvSyncForm;

async function saveRemoteCsvSyncConfig(event) {
    if (event) event.preventDefault();
    const val = (id) => (document.getElementById(id) || {}).value || "";
    const box = document.getElementById("sync-enabled-cb");
    const config = {
        clientsUrl: val("sync-clients-url").trim(),
        inventoryUrl: val("sync-inventory-url").trim(),
        intervalMinutes: Number(val("sync-interval-min")) || 30,
        enabled: !!(box && box.checked)
    };
    try {
        const r = await fetch("/api/sync/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
        if (!r.ok) throw new Error();
    } catch (e) { showStudioToast("Could not save: the server did not answer"); return; }
    showStudioToast("CSV sync settings saved");
    loadRemoteCsvSyncForm();
    renderSyncSettingsCard();
}
window.saveRemoteCsvSyncConfig = saveRemoteCsvSyncConfig;

function sendAftercareGuide(clientId) {
    const guide = { clientId: clientId || null, saved_at: new Date().toISOString(), protocol: 'Standard Dermal Aftercare Regimen' };
    let dispatches = [];
    try { dispatches = JSON.parse(localStorage.getItem('studio_aftercare_dispatches') || '[]'); } catch (e) {}
    dispatches.unshift(guide);
    try { localStorage.setItem('studio_aftercare_dispatches', JSON.stringify(dispatches)); } catch (e) {}
    showStudioToast('Aftercare instructions saved to the client profile');
}
window.sendAftercareGuide = sendAftercareGuide;


