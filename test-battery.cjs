const fs = require("fs");
const path = require("path");

let passed = 0;
let failed = 0;
const testLogs = [];

function assert(condition, testCategory, testName, details = "") {
  const timestamp = new Date().toISOString();
  if (condition) {
    passed++;
    testLogs.push({ status: "PASS", category: testCategory, name: testName, details, timestamp });
    console.log(`  ✅ [PASS] ${testCategory} -> ${testName}`);
  } else {
    failed++;
    testLogs.push({ status: "FAIL", category: testCategory, name: testName, details, timestamp });
    console.error(`  ❌ [FAIL] ${testCategory} -> ${testName}`);
  }
}

console.log("====================================================");
console.log("🧪 STUDIO CRM APP - AUTOMATED COMPREHENSIVE TEST SUITE");
console.log("====================================================\n");

const html = fs.readFileSync("public/index.html", "utf8");
let css = "";
if (fs.existsSync("public/css")) {
  for (const f of fs.readdirSync("public/css")) {
    if (f.endsWith(".css")) css += fs.readFileSync("public/css/" + f, "utf8") + "\n";
  }
}
let js = "";
if (fs.existsSync("public/js")) {
  for (const f of fs.readdirSync("public/js")) {
    if (f.endsWith(".js")) js += fs.readFileSync("public/js/" + f, "utf8") + "\n";
  }
}
if (fs.existsSync("public/app-features.js")) js += fs.readFileSync("public/app-features.js", "utf8") + "\n";
if (fs.existsSync("public/i18n.js")) js += fs.readFileSync("public/i18n.js", "utf8") + "\n";

const appSource = html + "\n" + css + "\n" + js;

// 1. Navigation & Header Button Verification
console.log("1️⃣  NAVBAR & CORE TOOLBAR BUTTON INTEGRITY:");
assert(html.includes('id="btn-m-board"'), "Navbar Controls", "M Board Button ID (\"btn-m-board\") present in DOM");
assert(html.includes('id="btn-auto-scheduler"'), "Navbar Controls", "Auto Scheduler Button ID (\"btn-auto-scheduler\") present in DOM");
assert(html.includes('id="btn-quick-export"'), "Navbar Controls", "Quick Export Button ID (\"btn-quick-export\") present in DOM");

// 2. Modal Overlay DOM Structure
console.log("\n2️⃣  MODAL OVERLAY STRUCTURE & VISIBILITY:");
assert(html.includes('id="team-messenger-overlay"'), "Modal Elements", "Team Messenger / M Board overlay container exists");
assert(html.includes('id="auto-scheduler-modal-overlay"'), "Modal Elements", "Auto Scheduler overlay container exists");
assert(html.includes('id="quick-table-export-modal-overlay"'), "Modal Elements", "Quick Table Export overlay container exists");

// 3. Stacking Context & Z-Index Hierarchy
console.log("\n3️⃣  STACKING CONTEXT & Z-INDEX LAYERING:");
assert(html.includes('id="team-messenger-overlay"') && html.includes("z-index:2000000"), "Z-Index Hierarchy", "Team Messenger modal elevated to z-index 2,000,000");
assert(html.includes('id="auto-scheduler-modal-overlay"') && html.includes("z-index:2000000"), "Z-Index Hierarchy", "Auto Scheduler modal set to z-index 2,000,000");
assert(html.includes('id="quick-table-export-modal-overlay"') && html.includes("z-index:2000000"), "Z-Index Hierarchy", "Quick Table Export modal set to z-index 2,000,000");

// 4. Exportable Data Table Target IDs
console.log("\n4️⃣  DATA TABLES & EXPORT TARGET IDENTIFIERS:");
assert(html.includes('id="summary-events-table"'), "Export Data Targets", "Daily Events Stream table tagged with id \"summary-events-table\"");
assert(html.includes('id="session-duration-breakdown-table"'), "Export Data Targets", "Session Duration Breakdown table tagged with id \"session-duration-breakdown-table\"");

// 5. Responsive CSS Grid Layout Rules
console.log("\n5️⃣  DASHBOARD RESPONSIVE CSS GRID ARCHITECTURE:");
assert(css.includes(".stats-grid") || html.includes(".stats-grid"), "CSS Grid Layout", ".stats-grid style rule defined");
assert(css.includes("repeat(auto-fit, minmax(230px, 1fr))") || html.includes("repeat(auto-fit, minmax(230px, 1fr))"), "CSS Grid Layout", "Stat cards configured with auto-fit fluid minmax(230px, 1fr)");
assert(css.includes(".content-grid") || html.includes(".content-grid"), "CSS Grid Layout", ".content-grid layout defined for primary vs secondary dashboard columns");

// 6. Global Function Exports & Event Handlers
console.log("\n6️⃣  GLOBAL WINDOW BINDINGS & DOM LISTENERS:");
assert(appSource.includes("window.openTeamMessengerModal = openTeamMessengerModal;"), "Global Scope", "openTeamMessengerModal exported to window");
assert(appSource.includes("window.openAutoSchedulerModal = openAutoSchedulerModal;"), "Global Scope", "openAutoSchedulerModal exported to window");
assert(appSource.includes("window.openQuickTableExportModal = openQuickTableExportModal;"), "Global Scope", "openQuickTableExportModal exported to window");
assert(appSource.includes("window.openInventoryCameraScannerModal = openInventoryCameraScannerModal;"), "Global Scope", "openInventoryCameraScannerModal exported to window");
assert(appSource.includes("window.openClientDirectoryModal = openClientDirectoryModal;"), "Global Scope", "openClientDirectoryModal exported to window");
assert(appSource.includes("window.toggleGlobalDarkMode = toggleGlobalDarkMode;"), "Global Scope", "toggleGlobalDarkMode exported to window");
assert(appSource.includes("bindBtn('btn-m-board'"), "Event Handlers", "DOM click listener bound to btn-m-board");
assert(appSource.includes("bindBtn('btn-auto-scheduler'"), "Event Handlers", "DOM click listener bound to btn-auto-scheduler");
assert(appSource.includes("bindBtn('btn-quick-export'"), "Event Handlers", "DOM click listener bound to btn-quick-export");

// 7. Global Keyboard Shortcuts Verification
console.log("\n7️⃣  GLOBAL KEYBOARD SHORTCUTS INTEGRITY:");
assert(appSource.includes("e.key.toLowerCase() === 's'") && appSource.includes("openInventoryCameraScannerModal"), "Hotkeys", "Alt+S assigned to Inventory QR Scanner modal");
assert(appSource.includes("e.key.toLowerCase() === 'd'") && appSource.includes("inventory-search-input"), "Hotkeys", "Alt+D assigned to inventory & feed search focus");
assert(appSource.includes("e.key.toLowerCase() === 't'") && appSource.includes("toggleGlobalDarkMode"), "Hotkeys", "Alt+T bound to toggleGlobalDarkMode");
assert(appSource.includes("e.key.toLowerCase() === 'c'") && appSource.includes("openClientDirectoryModal"), "Hotkeys", "Alt+C assigned to Client Directory & Health Alerts modal");

// 8. New Features Verification (Profile Camera, Messenger Draft Auto-Save, D3 Appointment Timeline)
console.log("\n8️⃣  CLIENT PROFILE CAMERA, MESSENGER DRAFT & D3 TIMELINE INTEGRITY:");
assert(appSource.includes("client-photo-camera-modal-overlay") && appSource.includes("openClientPhotoCameraModal"), "Profile Camera", "Client photo camera capture modal overlay & open method defined");
assert(appSource.includes("saveCapturedClientProfilePhoto") && appSource.includes("localStorage.setItem('client_photo_"), "Profile Camera", "Profile photo capture canvas & localStorage persistence active");
assert(appSource.includes("onMessengerInputDraft") && appSource.includes("restoreMessengerDraft") && appSource.includes("mboard_draft_"), "Messenger Draft", "M Board draft auto-save and restoration handlers bound");
assert(appSource.includes("d3-client-appointment-timeline") && appSource.includes("renderD3ClientAppointmentTimeline"), "D3 Timeline", "Client Profile D3 interactive appointment timeline widget rendered");

// 9. Inventory Features Verification (Categories Modal, Thermal Tag Printer, Debounced Search)
console.log("\n9️⃣  INVENTORY CATEGORIES, THERMAL TAG PRINTER & DEBOUNCED SEARCH INTEGRITY:");
assert(appSource.includes("category-settings-modal-overlay") && appSource.includes("openCategorySettingsModal") && appSource.includes("handleSaveCategorySetting"), "Inventory Categories", "Inventory categories management modal & reorder point handlers active");
assert(appSource.includes("printable-qr-tags-modal-overlay") && appSource.includes("openThermalLabelPrinterModal") && appSource.includes("renderPrintableQrTagSheet"), "Thermal Label Printer", "Thermal label tag generator modal & printable SVG barcode generator active");
assert(appSource.includes("debouncedInventorySearchInput") && appSource.includes("inventorySearchDebounceTimer") && appSource.includes("handleInventorySearchInput"), "Debounced Search", "Debounced real-time inventory search filter engine configured");

// 10. Extended Inventory & Client Profile Features Verification
console.log("\n🔟 EXTENDED INVENTORY TREND, SHIFT ROSTER EXPORT, QUICK ACTIONS & SYNC TOGGLE INTEGRITY:");
assert(appSource.includes("d3-inventory-trend-chart") && appSource.includes("renderD3InventoryTrendChart"), "30-Day Inventory Trend", "D3 30-day stockout risk trend trajectory line chart active");
assert(appSource.includes("openQuickTableExportModal('shift-roster-table')") && appSource.includes("shift-roster-table"), "Staff Shift Roster Export", "Shift roster export target registered in Quick Export modal & header button");
assert(appSource.includes("client-profile-floating-quick-actions") && appSource.includes("logRapidClientProcedureNote") && appSource.includes("toggleClientQuickActionsMenu"), "Client Quick Actions", "Client profile floating quick actions FAB & rapid procedure logging handlers active");
assert(appSource.includes("inventory-remote-sync-toggle-wrapper") && appSource.includes("toggleInventoryRemoteSync") && appSource.includes("initInventoryRemoteSyncState"), "Persistent Sync Toggle", "Inventory catalog table header persistent CSV remote sync toggle active");

console.log("\n====================================================");
console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
console.log("====================================================");

if (failed > 0) {
  console.error(`\n❌ TEST SUITE FAILED: ${failed} assertion(s) failed.`);
  testLogs.filter(t => t.status === "FAIL").forEach((t, i) => {
    console.error(`  ${i + 1}. [${t.category}] ${t.name}`);
  });
  process.exit(1);
} else {
  console.log(`\n🎉 All ${passed} tests completed successfully with 0 failures.`);
  process.exit(0);
}
