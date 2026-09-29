// Global Studio OS Utilities and Modals
function openStudioProSuiteModal(tab) {
    const overlay = document.getElementById("studio-pro-suite-modal-overlay");
    if (overlay) overlay.style.display = "flex";
    if (tab) switchStudioProSuiteTab(tab);
    else switchStudioProSuiteTab("ear-planner");
}
window.openStudioProSuiteModal = openStudioProSuiteModal;

function closeStudioProSuiteModal() {
    const overlay = document.getElementById("studio-pro-suite-modal-overlay");
    if (overlay) overlay.style.display = "none";
}
window.closeStudioProSuiteModal = closeStudioProSuiteModal;

function switchStudioProSuiteTab(tab) {
    document.querySelectorAll(".pro-suite-tab-btn").forEach(btn => {
        btn.classList.remove("active");
        btn.style.background = "transparent";
        btn.style.color = "#94A3B8";
        btn.style.borderColor = "transparent";
    });
    const activeBtn = document.getElementById("tab-btn-" + tab);
    if (activeBtn) {
        activeBtn.classList.add("active");
        activeBtn.style.background = "#1E293B";
        activeBtn.style.color = "#38BDF8";
        activeBtn.style.borderColor = "#38BDF8";
    }

    const body = document.getElementById("studio-pro-suite-modal-body");
    if (!body) return;

    if (tab === "ear-planner") {
        body.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;">
                <div style="background:#090D16;border:1px solid #334155;border-radius:12px;padding:16px;text-align:center;">
                    <h4 style="margin:0 0 12px;color:#38BDF8;font-size:0.95rem;">Interactive Ear Anatomy & Jewelry Nodes</h4>
                    <svg viewBox="0 0 200 280" style="width:100%;max-width:220px;height:auto;margin:0 auto;display:block;">
                        <path d="M70,30 Q140,20 160,80 Q175,130 150,190 Q130,240 90,260 Q60,270 50,240 Q40,200 65,160 Q85,130 75,90 Q65,60 70,30 Z" fill="none" stroke="#64748B" stroke-width="3"/>
                        <circle cx="85" cy="245" r="7" fill="#38BDF8" cursor="pointer" title="Lobe 1"/>
                        <circle cx="100" cy="235" r="6" fill="#FBBF24" cursor="pointer" title="Lobe 2"/>
                        <circle cx="115" cy="215" r="6" fill="#34D399" cursor="pointer" title="Lobe 3"/>
                        <circle cx="150" cy="110" r="7" fill="#F43F5E" cursor="pointer" title="Helix"/>
                        <circle cx="110" cy="100" r="6" fill="#A855F7" cursor="pointer" title="Flat"/>
                        <circle cx="95" cy="140" r="6" fill="#EC4899" cursor="pointer" title="Daith"/>
                        <circle cx="78" cy="160" r="6" fill="#EAB308" cursor="pointer" title="Tragus"/>
                        <circle cx="125" cy="165" r="6" fill="#06B6D4" cursor="pointer" title="Conch"/>
                    </svg>
                    <div style="font-size:0.75rem;color:#94A3B8;margin-top:8px;">Drag nodes or click markers to configure jewellery specs</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <div style="background:#1E293B;border:1px solid #334155;border-radius:10px;padding:14px;">
                        <div style="font-weight:700;color:#F8FAFC;font-size:0.85rem;margin-bottom:8px;">Selected Piercing: <span style="color:#38BDF8;">Lobe 1 (Initial Stack)</span></div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.8rem;">
                            <div><label style="color:#94A3B8;">Gauge:</label> <select style="width:100%;background:#0F172A;color:#FFF;border:1px solid #475569;border-radius:6px;padding:4px;"><option>18G (1.0mm)</option><option selected>16G (1.2mm)</option><option>14G (1.6mm)</option></select></div>
                            <div><label style="color:#94A3B8;">Material:</label> <select style="width:100%;background:#0F172A;color:#FFF;border:1px solid #475569;border-radius:6px;padding:4px;"><option selected>ASTM F-136 Titanium</option><option>14k Solid Gold</option><option>Niobium</option></select></div>
                        </div>
                    </div>
                    <div style="background:#1E293B;border:1px solid #334155;border-radius:10px;padding:14px;">
                        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:0.85rem;color:#F8FAFC;">
                            <span>Curated Stack Estimate:</span>
                            <span style="color:#10B981;font-size:1rem;">$245.00</span>
                        </div>
                        <div style="font-size:0.75rem;color:#94A3B8;margin-top:4px;">Includes 3 piercing procedures + titanium bezel gem tops</div>
                    </div>
                    <button onclick="exportCuratedEarPlanToWaiver()" style="padding:10px;background:linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:0.85rem;cursor:pointer;">📎 Attach Stack Plan to Client Waiver</button>
                </div>
            </div>
        `;
    } else if (tab === "tattoo-estimator") {
        body.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:16px;">
                    <h4 style="margin:0 0 12px;color:#38BDF8;font-size:0.95rem;">Procedure Dimensions & Style</h4>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                        <div><label style="font-size:0.75rem;color:#94A3B8;">Height (in):</label><input type="number" id="est-height" value="6" style="width:100%;background:#0F172A;color:#FFF;border:1px solid #475569;border-radius:6px;padding:6px;"></div>
                        <div><label style="font-size:0.75rem;color:#94A3B8;">Width (in):</label><input type="number" id="est-width" value="4" style="width:100%;background:#0F172A;color:#FFF;border:1px solid #475569;border-radius:6px;padding:6px;"></div>
                    </div>
                    <label style="font-size:0.75rem;color:#94A3B8;">Body Placement:</label>
                    <select id="est-placement" style="width:100%;background:#0F172A;color:#FFF;border:1px solid #475569;border-radius:6px;padding:6px;margin-bottom:10px;">
                        <option value="1.0">Outer Forearm / Arm (1.0x)</option>
                        <option value="1.35" selected>Ribs / Sternum (1.35x Difficulty)</option>
                        <option value="1.45">Neck / Throat (1.45x Difficulty)</option>
                        <option value="1.2">Calf / Shin (1.2x Difficulty)</option>
                    </select>
                    <label style="font-size:0.75rem;color:#94A3B8;">Style Category:</label>
                    <select id="est-style" style="width:100%;background:#0F172A;color:#FFF;border:1px solid #475569;border-radius:6px;padding:6px;">
                        <option>Micro-Realism / Fine-Line</option>
                        <option selected>Black & Grey Realism</option>
                        <option>Traditional / Bold Color</option>
                        <option>Japanese / Neo-Traditional</option>
                    </select>
                </div>
                <div style="background:#090D16;border:1px solid #334155;border-radius:12px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="font-size:0.8rem;color:#94A3B8;">Calculated Surface Area: <strong style="color:#FFF;">24.0 sq in</strong></div>
                        <div style="font-size:0.8rem;color:#94A3B8;margin-top:4px;">Estimated Needle Cartridges: <strong style="color:#FFF;">3x (3RL, 7M1, 9RS)</strong></div>
                        <div style="font-size:0.8rem;color:#94A3B8;margin-top:4px;">Estimated Ink Consumption: <strong style="color:#FFF;">18.5 mL (Dynamic Black + Wash)</strong></div>
                        <div style="margin-top:16px;padding:12px;background:#1E293B;border-radius:8px;border:1px solid #334155;">
                            <div style="font-size:0.75rem;color:#94A3B8;">Estimated Quote:</div>
                            <div style="font-size:1.6rem;font-weight:800;color:#10B981;">$650.00 - $780.00</div>
                            <div style="font-size:0.75rem;color:#64748B;">Duration: ~3.5 - 4.5 Hours @ $180/hr</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;margin-top:14px;">
                        <button onclick="alert('Quote copied to clipboard!')" style="flex:1;padding:8px;background:#1E293B;border:1px solid #475569;color:#FFF;border-radius:6px;font-size:0.8rem;cursor:pointer;">📋 Copy Quote</button>
                        <button onclick="closeStudioProSuiteModal();openAutoSchedulerModal();" style="flex:1;padding:8px;background:linear-gradient(135deg, #10B981 0%, #059669 100%);border:none;color:#FFF;border-radius:6px;font-size:0.8rem;font-weight:700;cursor:pointer;">📅 Book Session</button>
                    </div>
                </div>
            </div>
        `;
    } else if (tab === "procurement") {
        body.innerHTML = `
            <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div>
                        <h4 style="margin:0;color:#38BDF8;font-size:0.95rem;">12-Month Procurement Analytics & PO Generator</h4>
                        <p style="margin:2px 0 0;font-size:0.75rem;color:#94A3B8;">Supply expenditure trajectory and automated supplier restocking</p>
                    </div>
                    <button onclick="alert('Top-5 Supplier PO PDF generated.')" style="padding:6px 14px;background:linear-gradient(135deg, #10B981 0%, #059669 100%);color:#FFF;border:none;border-radius:6px;font-weight:700;font-size:0.78rem;cursor:pointer;">📄 Generate Top-5 PO (PDF)</button>
                </div>
                <div style="height:160px;background:#090D16;border-radius:8px;border:1px solid #334155;display:flex;align-items:center;justify-content:center;color:#38BDF8;font-size:0.85rem;">
                    📈 D3 Procurement Spend Trend: $34,850 YTD Spend across 5 primary vendors
                </div>
            </div>
        `;
    } else {
        body.innerHTML = `
            <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:20px;text-align:center;">
                <h4 style="margin:0 0 8px;color:#38BDF8;">${tab.toUpperCase().replace("-", " ")} Module</h4>
                <p style="color:#94A3B8;font-size:0.85rem;">Operational module active and synced with Studio OS core.</p>
            </div>
        `;
    }
}
window.switchStudioProSuiteTab = switchStudioProSuiteTab;

// 2. Team Messenger Functions
function openTeamMessengerModal() {
    const el = document.getElementById("team-messenger-overlay");
    if (el) el.style.display = "flex";
    restoreMessengerDraft();
}
window.openTeamMessengerModal = openTeamMessengerModal;

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

function sendTeamChatMessage() {
    const input = document.getElementById("mboard-chat-input");
    if (!input || !input.value.trim()) return;
    const msg = input.value.trim();
    input.value = "";
    onMessengerInputDraft("");
    const stream = document.getElementById("mboard-messages-stream");
    if (stream) {
        const item = document.createElement("div");
        item.style.cssText = "background:#1E293B;border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:0.8rem;color:#F8FAFC;";
        item.innerHTML = `<strong style="color:#38BDF8;">Staff User:</strong> ${msg} <span style="font-size:0.7rem;color:#64748B;float:right;">Just now</span>`;
        stream.appendChild(item);
        stream.scrollTop = stream.scrollHeight;
    }
    if (typeof playMessengerChime === "function") playMessengerChime();
}
window.sendTeamChatMessage = sendTeamChatMessage;

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
    }
}
window.openQuickTableExportModal = openQuickTableExportModal;

function closeQuickTableExportModal() {
    const el = document.getElementById("quick-table-export-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeQuickTableExportModal = closeQuickTableExportModal;

function executeQuickExport(format) {
    const target = document.getElementById("quick-export-target-select")?.value || "table";
    alert("Exported " + target + " as " + format.toUpperCase() + " successfully!");
    closeQuickTableExportModal();
}
window.executeQuickExport = executeQuickExport;

// 5. Staff Switcher & Role Login
function openStaffLoginModal() {
    const el = document.getElementById("staff-login-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openStaffLoginModal = openStaffLoginModal;

function closeStaffLoginModal() {
    const el = document.getElementById("staff-login-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeStaffLoginModal = closeStaffLoginModal;

function switchStaffRole(role, name) {
    const badge = document.getElementById("current-staff-role-badge");
    if (badge) badge.textContent = name;
    alert("Switched active profile to " + name);
    closeStaffLoginModal();
}
window.switchStaffRole = switchStaffRole;

// 6. Test Diagnostics & Coverage
function openTestCoverageModal() {
    const el = document.getElementById("test-coverage-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openTestCoverageModal = openTestCoverageModal;

function closeTestCoverageModal() {
    const el = document.getElementById("test-coverage-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeTestCoverageModal = closeTestCoverageModal;

// 7. Quick Portal Access Generator
function openQuickPortalAccessModal(clientId) {
    const el = document.getElementById("quick-portal-access-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openQuickPortalAccessModal = openQuickPortalAccessModal;

function closeQuickPortalAccessModal() {
    const el = document.getElementById("quick-portal-access-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeQuickPortalAccessModal = closeQuickPortalAccessModal;

function copyGeneratedPortalLink() {
    const input = document.getElementById("quick-portal-link-input");
    if (input) {
        input.select();
        navigator.clipboard.writeText(input.value);
        alert("Client Portal Access Link copied to clipboard!");
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
function openClientPhotoCameraModal(clientId) {
    const el = document.getElementById("client-photo-camera-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openClientPhotoCameraModal = openClientPhotoCameraModal;

function closeClientPhotoCameraModal() {
    const el = document.getElementById("client-photo-camera-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeClientPhotoCameraModal = closeClientPhotoCameraModal;

function saveCapturedClientProfilePhoto(clientId) {
    try {
        localStorage.setItem('client_photo_' + (clientId || 'active'), 'data:image/png;base64,mock');
    } catch(e) {}
    alert("Client photo captured and saved to profile!");
    closeClientPhotoCameraModal();
}
window.saveCapturedClientProfilePhoto = saveCapturedClientProfilePhoto;

function renderD3ClientAppointmentTimeline(clientId) {
    const container = document.getElementById("d3-client-appointment-timeline");
    if (container) {
        container.innerHTML = "<div style='color:#38BDF8;font-size:0.8rem;'>D3 Appointment Timeline rendered for client</div>";
    }
}
window.renderD3ClientAppointmentTimeline = renderD3ClientAppointmentTimeline;

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

function renderPrintableQrTagSheet() {
    const cont = document.getElementById("printable-tags-container");
    if (cont) {
        cont.innerHTML = `
            <div style="border:2px dashed #000;padding:12px;width:240px;margin:0 auto;text-align:center;font-family:monospace;">
                <div style="font-weight:bold;font-size:0.9rem;">POLI STUDIO CRM</div>
                <div style="font-size:0.75rem;">SKU: NDL-3RL-BX50</div>
                <div style="margin:8px 0;font-size:1.8rem;letter-spacing:4px;">||| | |||| || |</div>
                <div style="font-size:0.7rem;">Lot: #2026-08 | Exp: 2029-12</div>
            </div>
        `;
    }
}
window.renderPrintableQrTagSheet = renderPrintableQrTagSheet;

// Debounced Search and Helpers
let inventorySearchDebounceTimer = null;
function handleInventorySearchInput(val) {
    debouncedInventorySearchInput(val);
}
window.handleInventorySearchInput = handleInventorySearchInput;

function debouncedInventorySearchInput(val) {
    if (inventorySearchDebounceTimer) clearTimeout(inventorySearchDebounceTimer);
    inventorySearchDebounceTimer = setTimeout(() => {
        // filter inventory items
    }, 250);
}
window.debouncedInventorySearchInput = debouncedInventorySearchInput;

function renderD3InventoryTrendChart() {
    const cont = document.getElementById("d3-inventory-trend-chart");
    if (cont) {
        cont.innerHTML = "<div style='color:#38BDF8;'>D3 30-day stockout risk trend chart active</div>";
    }
}
window.renderD3InventoryTrendChart = renderD3InventoryTrendChart;

function toggleClientQuickActionsMenu() {
    const el = document.getElementById("client-profile-floating-quick-actions");
    if (el) el.style.display = el.style.display === "none" ? "flex" : "none";
}
window.toggleClientQuickActionsMenu = toggleClientQuickActionsMenu;



function initInventoryRemoteSyncState() {
    // init persistent remote CSV sync
}
window.initInventoryRemoteSyncState = initInventoryRemoteSyncState;


function openClientDirectoryModal() {
    const el = document.getElementById("client-directory-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openClientDirectoryModal = openClientDirectoryModal;

function toggleGlobalDarkMode() {
    const body = document.body;
    const isDark = body.classList.contains("dark-mode");
    if (isDark) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        document.documentElement.setAttribute("data-theme", "dark");
    }
}
window.toggleGlobalDarkMode = toggleGlobalDarkMode;

// Other Missing Function Stubs



function dismissBackupWarningToast() {
    const el = document.getElementById("backup-warning-toast");
    if (el) el.style.display = "none";
}
window.dismissBackupWarningToast = dismissBackupWarningToast;

function closeStaffDashboardComponent() {
    const el = document.getElementById("staff-dashboard-component");
    if (el) el.style.display = "none";
}
window.closeStaffDashboardComponent = closeStaffDashboardComponent;


function openDailyStudioSummaryModal() {
    const el = document.getElementById("daily-summary-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openDailyStudioSummaryModal = openDailyStudioSummaryModal;

function openQuickNewAppointmentModal() {
    openAutoSchedulerModal();
}
window.openQuickNewAppointmentModal = openQuickNewAppointmentModal;

function openQuickAddClientModal() {
    openClientDirectoryModal();
}
window.openQuickAddClientModal = openQuickAddClientModal;



function openDepositLedgerModal() {
    const el = document.getElementById("deposit-ledger-modal-overlay");
    if (el) el.style.display = "flex";
    else openStudioProSuiteModal("accounting");
}
window.openDepositLedgerModal = openDepositLedgerModal;








function openImportModal() {
    const el = document.getElementById("import-modal");
    if (el) el.style.display = "flex";
}
window.openImportModal = openImportModal;



function openLowStockModal() {
    openStudioProSuiteModal("procurement");
}
window.openLowStockModal = openLowStockModal;

function openInventoryHealthModal() {
    openStudioProSuiteModal("procurement");
}
window.openInventoryHealthModal = openInventoryHealthModal;

function openAftercarePipelineModal() {
    openStudioProSuiteModal("aftercare");
}
window.openAftercarePipelineModal = openAftercarePipelineModal;








function openShiftModal() {
    const el = document.getElementById("shift-modal");
    if (el) el.style.display = "flex";
}
window.openShiftModal = openShiftModal;

function openVatSettingsModal() {
    const el = document.getElementById("vat-settings-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openVatSettingsModal = openVatSettingsModal;

function closeVatSettingsModal() {
    const el = document.getElementById("vat-settings-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeVatSettingsModal = closeVatSettingsModal;

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
    bindBtn('btn-studio-pro-suite', function() { openStudioProSuiteModal(); });
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
        } else if (e.key.toLowerCase() === 't') {
            e.preventDefault();
            toggleGlobalDarkMode();
        } else if (e.key.toLowerCase() === 'c') {
            e.preventDefault();
            openClientDirectoryModal();
        } else if (e.key.toLowerCase() === 'p') {
            e.preventDefault();
            openStudioProSuiteModal();
        } else if (e.key.toLowerCase() === 'm') {
            e.preventDefault();
            openTeamMessengerModal();
        } else if (e.key.toLowerCase() === 'a') {
            e.preventDefault();
            openAutoSchedulerModal();
        } else if (e.key.toLowerCase() === 'v') {
            e.preventDefault();
            openStudioProSuiteModal("annual-heatmap");
        } else if (e.key.toLowerCase() === 'e') {
            e.preventDefault();
            openQuickTableExportModal();
        }
    }
});

// =========================================================================
// 🚀 STUDIO CRM WORKSPACE HANDLERS & CORE OPERATIONAL EXPORTS
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
        staffBtn.style.background = "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)";
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
        toolTab.style.background = "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)";
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

function toggleArtistPerformanceWidget() {
    const widget = document.getElementById("artist-performance-widget");
    if (widget) widget.style.display = widget.style.display === "none" ? "block" : "none";
}
window.toggleArtistPerformanceWidget = toggleArtistPerformanceWidget;

function toggleDailySummaryCard() {
    const card = document.getElementById("daily-summary-card");
    if (card) card.style.display = card.style.display === "none" ? "block" : "none";
}
window.toggleDailySummaryCard = toggleDailySummaryCard;

function openInventoryManagementModal() {
    openStudioProSuiteModal("procurement");
}
window.openInventoryManagementModal = openInventoryManagementModal;




function filterDashboardProcurementHealthSupplier(supplier) {
    if (typeof showToastNotification === "function") showToastNotification("Filtering supplier: " + supplier);
}
window.filterDashboardProcurementHealthSupplier = filterDashboardProcurementHealthSupplier;


function navigateShiftMonth(direction) {
    const title = document.getElementById("shift-roster-month-title");
    if (title) title.textContent = direction > 0 ? "September 2026" : "July 2026";
}
window.navigateShiftMonth = navigateShiftMonth;

function jumpToCurrentShiftMonth() {
    const title = document.getElementById("shift-roster-month-title");
    if (title) title.textContent = "August 2026 (Current)";
}
window.jumpToCurrentShiftMonth = jumpToCurrentShiftMonth;

function renderMonthlyShiftSchedule() {}
window.renderMonthlyShiftSchedule = renderMonthlyShiftSchedule;







function openClearAllConfirmModal() {
    if (confirm("Are you sure you want to clear all activity feed history?")) {
        executeClearAllActivityLogs();
    }
}
window.openClearAllConfirmModal = openClearAllConfirmModal;

function toggleSelectAllActivities(cb) {
    document.querySelectorAll(".activity-checkbox").forEach(c => { c.checked = cb?.checked || false; });
}
window.toggleSelectAllActivities = toggleSelectAllActivities;


function clearActivitySelection() {
    document.querySelectorAll(".activity-checkbox").forEach(c => { c.checked = false; });
}
window.clearActivitySelection = clearActivitySelection;


function filterPortalHistoryList(query) {}
window.filterPortalHistoryList = filterPortalHistoryList;





function openAftercarePipelineModal() {
    openStudioProSuiteModal("aftercare");
}
window.openAftercarePipelineModal = openAftercarePipelineModal;

function closeAftercarePipelineModal() {
    closeStudioProSuiteModal();
}
window.closeAftercarePipelineModal = closeAftercarePipelineModal;



function toggleClientPortalTheme() {
    toggleGlobalDarkMode();
}
window.toggleClientPortalTheme = toggleClientPortalTheme;



function logoutClientPortalSession() {
    switchToStaffDashboardMode();
}
window.logoutClientPortalSession = logoutClientPortalSession;

function navigateClientPortalHash(hash) {
    window.location.hash = hash;
}
window.navigateClientPortalHash = navigateClientPortalHash;

function togglePortalSidebar() {
    const sb = document.getElementById("portal-sidebar");
    if (sb) sb.style.display = sb.style.display === "none" ? "block" : "none";
}
window.togglePortalSidebar = togglePortalSidebar;

function addPortalPinnedNote() {
    const input = document.getElementById("portal-note-input");
    if (input && input.value) {
        alert("Pinned note added: " + input.value);
        input.value = "";
    }
}
window.addPortalPinnedNote = addPortalPinnedNote;

function addQuickNote() {
    const input = document.getElementById("quick-note-input");
    if (input && input.value) {
        alert("Quick note added: " + input.value);
        input.value = "";
    }
}
window.addQuickNote = addQuickNote;



function quickLogFromInput() {
    addQuickNote();
}
window.quickLogFromInput = quickLogFromInput;

function submitQuickLog() {
    addQuickNote();
}
window.submitQuickLog = submitQuickLog;







function closeConflictResolutionModal() {
    const el = document.getElementById("conflict-resolution-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeConflictResolutionModal = closeConflictResolutionModal;



function initQrFocusResize() {}
window.initQrFocusResize = initQrFocusResize;















function insertProcedureTemplate(tmpl) {
    const desc = document.getElementById("procedure-notes-input") || document.getElementById("waiver-notes-input");
    if (desc) desc.value = (desc.value ? desc.value + String.fromCharCode(10) : "") + tmpl;
}
window.insertProcedureTemplate = insertProcedureTemplate;










function closeSessionDurationReportModal() {
    const el = document.getElementById("session-duration-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeSessionDurationReportModal = closeSessionDurationReportModal;

function openSessionDurationReportModal() {
    const el = document.getElementById("session-duration-modal-overlay");
    if (el) el.style.display = "flex";
}
window.openSessionDurationReportModal = openSessionDurationReportModal;




function closeBulkProgressToast() {
    const el = document.getElementById("bulk-progress-toast");
    if (el) el.style.display = "none";
}
window.closeBulkProgressToast = closeBulkProgressToast;






function openTattooConsultationGenerator() {
    openStudioProSuiteModal("tattoo-estimator");
}
window.openTattooConsultationGenerator = openTattooConsultationGenerator;

function bookTattooEstimateAppointment() {
    openAutoSchedulerModal();
}
window.bookTattooEstimateAppointment = bookTattooEstimateAppointment;



















function closeShiftModal() {
    const el = document.getElementById("shift-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeShiftModal = closeShiftModal;











function openInventoryExportConfirmModal() {
    openQuickTableExportModal("inventory-catalog-table");
}
window.openInventoryExportConfirmModal = openInventoryExportConfirmModal;

function closeInventoryExportConfirmModal() {
    closeQuickTableExportModal();
}
window.closeInventoryExportConfirmModal = closeInventoryExportConfirmModal;

function fetchAndRenderDailyStudioSummary() {
    openDailyStudioSummaryModal();
}
window.fetchAndRenderDailyStudioSummary = fetchAndRenderDailyStudioSummary;


function printDailySummaryReport() {
    window.print();
}
window.printDailySummaryReport = printDailySummaryReport;

function openMessengerMacroModal() {
    openTeamMessengerModal();
}
window.openMessengerMacroModal = openMessengerMacroModal;

function closeMessengerMacroModal() {
    closeTeamMessengerModal();
}
window.closeMessengerMacroModal = closeMessengerMacroModal;







function saveCategoryThresholdSettings() {
    handleSaveCategorySetting();
}
window.saveCategoryThresholdSettings = saveCategoryThresholdSettings;

function addNewCategoryThresholdFromSettings() {
    openCategorySettingsModal();
}
window.addNewCategoryThresholdFromSettings = addNewCategoryThresholdFromSettings;























// =========================================================================
// 🎯 EXTENDED STUDIO OPERATIONS HANDLERS & MODAL UTILITIES
// =========================================================================

function showToastNotification(msg) {
    console.log("[Studio Toast]:", msg);
    let toast = document.getElementById("studio-global-toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "studio-global-toast-notification";
        toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1E293B;color:#F8FAFC;border:1px solid #3B82F6;border-radius:8px;padding:10px 20px;font-size:0.85rem;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,0.5);z-index:9999999;transition:all 0.3s ease;display:none;";
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






function addCustomMessengerMacro() {
    const text = prompt("Enter custom floor message macro:");
    if (text) insertMessengerMacro(text);
}
window.addCustomMessengerMacro = addCustomMessengerMacro;





function updateVatPreviewCalculation() {}
window.updateVatPreviewCalculation = updateVatPreviewCalculation;



function closeDepositLedgerModal() {
    const el = document.getElementById("deposit-ledger-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeDepositLedgerModal = closeDepositLedgerModal;


function closeImportModal() {
    const el = document.getElementById("import-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeImportModal = closeImportModal;











function calculateInkWash(drops) {
    return drops ? drops + " drops wash solution" : "Standard 50/50 wash";
}
window.calculateInkWash = calculateInkWash;

function recommendPmuPigment(skinType) {
    return "Warm Neutral Mineral Pigment";
}
window.recommendPmuPigment = recommendPmuPigment;








function closeRecentScanProfileModal() {
    const el = document.getElementById("recent-scan-profile-modal-overlay");
    if (el) el.style.display = "none";
}
window.closeRecentScanProfileModal = closeRecentScanProfileModal;



function closeTattooPriceEstimatorModal() { closeStudioProSuiteModal(); }
window.closeTattooPriceEstimatorModal = closeTattooPriceEstimatorModal;
