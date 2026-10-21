// Global Studio OS Utilities and Modals

// 2. Team Messenger Functions
async function renderTeamMessages() {
    const stream = document.getElementById("mboard-messages-stream");
    if (!stream) return;
    const list = await fetchJson("/api/messages");
    const sentAt = (m) => new Date(m.timestamp || m.created_at || 0).getTime();
    const messages = (Array.isArray(list) ? list : []).slice().sort((x, y) => sentAt(x) - sentAt(y)); // oldest first, newest at the bottom
    stream.innerHTML = messages.length ? messages.map((m) => `<div class="mboard-message" style="background:var(--ti-panel2, #1E293B);border:1px solid var(--ti-line, #334155);border-radius:8px;padding:8px 12px;font-size:0.8rem;color:var(--ti-text, #F8FAFC);">
            <strong style="color:var(--ti-blue, #38BDF8);">${escapeHtml(m.author || "Staff")}:</strong> ${escapeHtml(m.text || "")}
            <span style="font-size:0.7rem;color:var(--ti-faint, #64748B);float:right;">${escapeHtml(sentAt(m) ? new Date(sentAt(m)).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "")}</span>
        </div>`).join("") : '<div style="color:var(--ti-muted, #94A3B8);font-size:0.8rem;">No messages yet.</div>';
    stream.scrollTop = stream.scrollHeight;
}
window.renderTeamMessages = renderTeamMessages;

function openTeamMessengerModal() {
    forceShowModal("team-messenger-overlay");
    restoreMessengerDraft();
    renderTeamMessages();
}
window.openTeamMessengerModal = openTeamMessengerModal;

async function sendTeamChatMessage() {
    const input = document.getElementById("mboard-chat-input");
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    try {
        const res = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author: (activeStaff() || {}).name || "Staff", text }) });
        if (!res.ok) throw new Error("HTTP " + res.status);
    } catch (e) { showStudioToast("Could not send the message: the server did not answer"); return; }
    input.value = "";
    onMessengerInputDraft("");
    renderTeamMessages();
    if (typeof playMessengerChime === "function") playMessengerChime();
}
window.sendTeamChatMessage = oneAtATime(sendTeamChatMessage);

function closeTeamMessengerModal() {
    const el = document.getElementById("team-messenger-overlay");
    if (el) el.style.display = "none";
}
window.closeTeamMessengerModal = closeTeamMessengerModal;

function insertMessengerMacro(macro) {
    const input = document.getElementById("mboard-chat-input");
    if (input) {
        input.value = macro;
        onMessengerInputDraft(macro);
        input.focus();
    }
}
window.insertMessengerMacro = insertMessengerMacro;

function onMessengerInputDraft(val) {
    try {
        localStorage.setItem('mboard_draft_msg', val || "");
    } catch(e) {}
}
window.onMessengerInputDraft = onMessengerInputDraft;

function restoreMessengerDraft() {
    try {
        const draft = localStorage.getItem('mboard_draft_msg');
        const input = document.getElementById("mboard-chat-input");
        if (input && draft) input.value = draft;
    } catch(e) {}
}
window.restoreMessengerDraft = restoreMessengerDraft;


// 3. Auto Scheduler Functions

function closeAutoSchedulerModal() {
    const el = document.getElementById("auto-scheduler-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeAutoSchedulerModal = closeAutoSchedulerModal;


// 4. Quick Table Export Functions
function openQuickTableExportModal(targetTableId) {
    const el = document.getElementById("quick-table-export-modal-overlay");
    if (el) el.style.display = "flex";
    if (targetTableId) {
        const select = document.getElementById("quick-export-target-select");
        if (select) select.value = targetTableId;
        if (select && !select.value) select.selectedIndex = 0; // an unknown list: never leave the choice empty
    }
}
window.openQuickTableExportModal = openQuickTableExportModal;

function closeQuickTableExportModal() {
    const el = document.getElementById("quick-table-export-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeQuickTableExportModal = closeQuickTableExportModal;

// What each export contains. Tables with their own data source use it; any
// other table is exported as it is shown on the page.
async function quickExportData(target) {
    if (target === "session-duration-breakdown-table") {
        return { name: "session_durations", title: "Session durations", head: SESSION_HEAD, rows: await sessionDurationRows() };
    }
    if (target === "inventory-catalog-table") {
        const inv = await fetchJson("/api/inventory");
        const items = Array.isArray(inv) ? inv : (inv.items || []);
        return { name: "inventory_manifest", title: "Inventory manifest",
            head: ["name", "sku", "category", "quantity", "reorder point", "unit cost", "lot", "expires", "supplier"],
            rows: items.map((i) => [i.name, i.sku, i.category || i.item_type, i.quantity, i.reorder_point, i.unit_cost != null ? i.unit_cost : i.price, i.lot_number, i.exp_date, i.supplier].map((v) => (v == null ? "" : v))) };
    }
    if (target === "summary-events-table") {
        const logs = await fetchJson("/api/activity-logs?limit=100");
        return { name: "activity_log", title: "Activity log", head: ["time", "category", "staff", "title", "details"],
            rows: (Array.isArray(logs) ? logs : []).map((l) => [l.timestamp ? new Date(l.timestamp).toLocaleString() : "", l.category || "", l.user || "", l.title || "", l.details || ""]) };
    }
    const table = document.getElementById(target);
    const head = table ? [...table.querySelectorAll("thead th")].map((c) => c.innerText.trim()) : [];
    const cells = (row) => [...row.children].map((c) => c.innerText.trim()).filter((c, i) => head[i]);
    const rows = table ? [...table.querySelectorAll("tbody tr")].filter((r) => r.children.length > 1).map(cells) : [];
    return { name: target.replace(/-table$/, "").replace(/-/g, "_"), title: target === "shift-roster-table" ? "Shift rota" : "Studio CRM export",
        head: head.filter(Boolean), rows };
}

async function executeQuickExport(format) {
    const target = document.getElementById("quick-export-target-select")?.value || "";
    const data = await quickExportData(target);
    if (!data.rows.length) { showStudioToast("Nothing to export yet: this list is empty"); return; }
    if (format === "pdf") downloadPdfTable(data.name + ".pdf", data.title, data.head, data.rows);
    else downloadCsv(data.name + ".csv", data.head, data.rows);
    showStudioToast("Saved to your Downloads folder: " + data.name + "." + format);
    closeQuickTableExportModal();
}
window.executeQuickExport = executeQuickExport;

// 5. Staff Switcher & Role Login

// 6. Test Diagnostics & Coverage

// 7. Quick Portal Access Generator


function closeQuickPortalAccessModal() {
    const el = document.getElementById("quick-portal-access-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeQuickPortalAccessModal = closeQuickPortalAccessModal;

function copyGeneratedPortalLink() {
    const input = document.getElementById("quick-portal-link-input");
    if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(
            () => showStudioToast("Client portal link copied"),
            () => showStudioToast("Could not copy: select the link and press Ctrl+C"));
    }
}
window.copyGeneratedPortalLink = copyGeneratedPortalLink;

function openClientPortalDirectly() {
    closeQuickPortalAccessModal();
    window.location.hash = "portal-pass";
    switchToClientPortalMode();
}
window.openClientPortalDirectly = openClientPortalDirectly;

// 8. Client Photo Camera Capture

// 9. Category Settings
function openCategorySettingsModal() {
    const el = document.getElementById("category-settings-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openCategorySettingsModal = openCategorySettingsModal;

function closeCategorySettingsModal() {
    const el = document.getElementById("category-settings-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeCategorySettingsModal = closeCategorySettingsModal;


// 10. Thermal Label Printer
function openThermalLabelPrinterModal() {
    const el = document.getElementById("printable-qr-tags-modal-overlay");
    if (el) el.style.display = "flex";
    renderPrintableQrTagSheet();
}
window.openThermalLabelPrinterModal = openThermalLabelPrinterModal;

function closeThermalLabelPrinterModal() {
    const el = document.getElementById("printable-qr-tags-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeThermalLabelPrinterModal = closeThermalLabelPrinterModal;

// One label per stock item: name, SKU, lot and expiry. It printed a single invented label (SKU NDL-3RL-BX50)
// with a "barcode" drawn in | characters that nothing could scan.
// ponytail: text labels only; a scannable code needs a code generator the CRM does not ship yet
async function renderPrintableQrTagSheet() {
    const cont = document.getElementById("printable-tags-container");
    if (!cont) return;
    const inv = await fetchJson("/api/inventory");
    const items = Array.isArray(inv) ? inv : (inv.items || []);
    cont.innerHTML = items.length
        ? '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">' + items.map((i) => `
            <div style="border:2px dashed #000;padding:10px 12px;width:220px;text-align:center;font-family:monospace;">
                <div style="font-weight:bold;font-size:0.85rem;">${escapeHtml(i.name || "")}</div>
                <div style="font-size:0.75rem;">SKU: ${escapeHtml(i.sku || "-")}</div>
                <div style="font-size:0.7rem;">${escapeHtml(pdfLabel("lot"))}: ${escapeHtml(i.lot_number || i.lot || "-")} | ${escapeHtml(pdfLabel("expires"))}: ${escapeHtml(String(i.exp_date || i.expiration_date || "-").slice(0, 10))}</div>
            </div>`).join("") + "</div>"
        : '<p style="text-align:center;color:var(--ti-line2, #475569);">' + escapeHtml(pdfLabel("No stock items yet. Add them in Inventory, then print their labels here.")) + "</p>";
}
window.renderPrintableQrTagSheet = renderPrintableQrTagSheet;

// Debounced Search and Helpers
let inventorySearchDebounceTimer = null;


function renderD3InventoryTrendChart() {
    const cont = document.getElementById("d3-inventory-trend-chart");
    if (cont) {
        cont.innerHTML = "<div style='color:var(--ti-blue, #38BDF8);'>D3 30-day stockout risk trend chart active</div>";
    }
}
window.renderD3InventoryTrendChart = renderD3InventoryTrendChart;

function toggleClientQuickActionsMenu() {
    const el = document.getElementById("client-profile-floating-quick-actions");
    if (el) el.style.display = el.style.display === "none" ? "flex" : "none";
}
window.toggleClientQuickActionsMenu = toggleClientQuickActionsMenu;



// Other Missing Function Stubs

// DOM Binding helper and listeners
function bindBtn(id, handler) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener("click", handler);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    bindBtn('btn-m-board', openTeamMessengerModal);
    bindBtn('btn-auto-scheduler', openAutoSchedulerModal);
    bindBtn('btn-quick-export', function() { openQuickTableExportModal(); });
});

// Global Keyboard Hotkeys
window.addEventListener("keydown", function(e) {
    if (e.altKey) {
        if (e.key.toLowerCase() === 's') {
            e.preventDefault();
            openInventoryCameraScannerModal();
        } else if (e.key.toLowerCase() === 'd') {
            e.preventDefault();
            const input = document.getElementById("inventory-search-input") || document.getElementById("activity-search-input");
            if (input) input.focus();
        } else if (e.key.toLowerCase() === 'c') {
            e.preventDefault();
            openClientDirectoryModal();
        } else if (e.key.toLowerCase() === 'm') {
            e.preventDefault();
            openTeamMessengerModal();
        } else if (e.key.toLowerCase() === 'a') {
            e.preventDefault();
            openAutoSchedulerModal();
        } else if (e.key.toLowerCase() === 'v') {
            e.preventDefault();
            openStationHeatmapModal();
        } else if (e.key.toLowerCase() === 'e') {
            e.preventDefault();
            openQuickTableExportModal();
        }
    }
});

// =========================================================================
// STUDIO CRM WORKSPACE HANDLERS & CORE OPERATIONAL EXPORTS
// =========================================================================

function toggleActivityDrawer() {
    const drawer = document.getElementById("activity-drawer");
    if (!drawer) return;
    const isOpen = drawer.classList.toggle("open");
    const unreadPill = document.getElementById("drawer-unread-pill");
    if (isOpen) {
        if (unreadPill) unreadPill.style.display = "none";
        if (typeof renderD3ActivityChart === "function") {
            setTimeout(renderD3ActivityChart, 50);
        }
    }
}
window.toggleActivityDrawer = toggleActivityDrawer;

function switchToStaffDashboardMode() {
    window.currentPortalMode = "staff";
    const staffBtn = document.getElementById("mode-btn-staff");
    const clientBtn = document.getElementById("mode-btn-client");
    if (staffBtn) {
        staffBtn.style.background = "linear-gradient(135deg, var(--ti-purple, #7C3AED) 0%, var(--ti-purple, #6D28D9) 100%)";
        staffBtn.style.color = "#FFFFFF";
        staffBtn.style.boxShadow = "0 2px 6px rgba(124,58,237,0.4)";
    }
    if (clientBtn) {
        clientBtn.style.background = "#1E293B";
        clientBtn.style.color = "#94A3B8";
        clientBtn.style.boxShadow = "none";
    }
    const staffDash = document.getElementById("staff-dashboard-component");
    if (staffDash) staffDash.style.display = "block";
    
    const roleText = document.getElementById("mode-active-role-text");
    if (roleText && (!roleText.textContent || roleText.textContent.includes("Client") || roleText.textContent.includes("Portal"))) {
        roleText.textContent = "Staff: Alex Miller";
    }
    
    const toolTab = document.querySelector(".tool-tab[data-tab='tool']");
    if (toolTab) {
        document.querySelectorAll(".tool-tab").forEach(t => t.classList.remove("active"));
        toolTab.classList.add("active");
        toolTab.style.background = "linear-gradient(135deg, var(--ti-blue, #3B82F6) 0%, var(--ti-blue, #1D4ED8) 100%)";
        toolTab.style.color = "#FFFFFF";
    }
    const tabContent = document.getElementById("tab-tool");
    if (tabContent) {
        document.querySelectorAll(".wrapper-tab-content").forEach(c => c.style.display = "none");
        tabContent.style.display = "block";
    }
    
    if (typeof showToastNotification === "function") {
        showToastNotification("Switched to Staff Management Dashboard");
    }
}
window.switchToStaffDashboardMode = switchToStaffDashboardMode;

function toggleLiveStreamUpdates() {
    const isLive = document.querySelector(".live-stream-toggle-checkbox")?.checked;
    if (typeof showToastNotification === "function") {
        showToastNotification(isLive ? "Live updates resumed" : "Live updates paused");
    }
}
window.toggleLiveStreamUpdates = toggleLiveStreamUpdates;

function filterPortalHistoryList(query) {}
window.filterPortalHistoryList = filterPortalHistoryList;

function initQrFocusResize() {}
window.initQrFocusResize = initQrFocusResize;

function openSessionDurationReportModal() {
    forceShowModal("session-duration-report-modal-overlay");
    renderSessionDurationReport();
}

// The report window: the chart, and one line per service and artist.
async function renderSessionDurationReport() {
    renderD3SessionDurationChart();
    const table = document.getElementById("modal-session-duration-breakdown-table");
    if (!table) return;
    const groups = {};
    const rows = await sessionDurationRows();
    // the four figures above the table used to be typed into the page (148.5 hrs, Maya Lin 98.4%...): worked out here
    const hours = rows.reduce((t, r) => t + Number(r[4]), 0), billed = rows.reduce((t, r) => t + Number(r[5]), 0);
    const byArtist = {};
    rows.forEach((r) => { byArtist[r[0]] = (byArtist[r[0]] || 0) + Number(r[4]); });
    const top = Object.entries(byArtist).sort((x, y) => y[1] - x[1])[0];
    const put = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    put("sd-kpi-total-hours", hours.toFixed(1) + " h");
    put("sd-kpi-total-sub", rows.length + " " + pdfLabel(rows.length === 1 ? "session" : "sessions"));
    put("sd-kpi-avg-duration", rows.length ? Math.round(hours * 60 / rows.length) + " min" : "—");
    put("sd-kpi-efficiency", hours ? "$" + (billed / hours).toFixed(2) : "—");
    put("sd-kpi-top-artist", top && top[0] ? top[0] : "—");
    put("sd-kpi-top-sub", top && top[0] ? top[1].toFixed(1) + " h" : "");
    rows.forEach((r) => {
        const g = groups[r[1] + "|" + r[0]] = groups[r[1] + "|" + r[0]] || { service: r[1], artist: r[0], n: 0, hours: 0, billed: 0 };
        g.n++; g.hours += Number(r[4]); g.billed += Number(r[5]);
    });
    const cell = (v) => '<td style="padding:8px;">' + escapeHtml(String(v)) + "</td>";
    table.querySelector("thead").innerHTML = "<tr>" + ["Service", "Artist", "Sessions", "Average hours", "Billed"].map((h) => '<th style="padding:8px;text-align:left;">' + h + "</th>").join("") + "</tr>";
    const list = Object.values(groups);
    table.querySelector("tbody").innerHTML = list.length
        ? list.map((g) => "<tr>" + cell(g.service) + cell(g.artist) + cell(g.n) + cell((g.hours / g.n).toFixed(1)) + cell(g.billed.toFixed(2)) + "</tr>").join("")
        : '<tr><td colspan="5" style="padding:8px;color:var(--ti-muted, #94A3B8);">No completed sessions yet. Mark an appointment as completed and it appears here.</td></tr>';
}
window.renderSessionDurationReport = renderSessionDurationReport;
window.openSessionDurationReportModal = openSessionDurationReportModal;

function openInventoryExportConfirmModal() {
    openQuickTableExportModal("inventory-catalog-table");
}
window.openInventoryExportConfirmModal = openInventoryExportConfirmModal;

function openMessengerMacroModal() {
    openTeamMessengerModal();
}
window.openMessengerMacroModal = openMessengerMacroModal;

// =========================================================================
// EXTENDED STUDIO OPERATIONS HANDLERS & MODAL UTILITIES
// =========================================================================

function showToastNotification(msg) {
    console.log("[Studio Toast]:", msg);
    let toast = document.getElementById("studio-global-toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "studio-global-toast-notification";
        toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ti-panel2, #1E293B);color:var(--ti-text, #F8FAFC);border:1px solid var(--ti-blue, #3B82F6);border-radius:8px;padding:10px 20px;font-size:0.85rem;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,0.5);z-index:9999999;transition:all 0.3s ease;display:none;";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = "block";
    toast.style.opacity = "1";
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => { toast.style.display = "none"; }, 300);
    }, 2800);
}
window.showToastNotification = showToastNotification;

function updateVatPreviewCalculation() {}
window.updateVatPreviewCalculation = updateVatPreviewCalculation;

function calculateInkWash(drops) {
    return drops ? drops + " drops wash solution" : "Standard 50/50 wash";
}
window.calculateInkWash = calculateInkWash;

function recommendPmuPigment(skinType) {
    return "Warm Neutral Mineral Pigment";
}
window.recommendPmuPigment = recommendPmuPigment;

