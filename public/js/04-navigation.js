// =========================================================================
// PERSISTENT SIDEBAR & DESTINATION NAVIGATION ENGINE
// =========================================================================
function navigateToDestination(destId) {
  if (!destId) destId = 'dashboard';
  // a screen this role does not have (a shortcut on the dashboard, an old link): the dashboard instead.
  // staff.js (screenAllowed) loads after this file: until it has, only the dashboard opens
  if (destId !== 'dashboard' && (typeof window.screenAllowed !== 'function' || !window.screenAllowed(destId))) destId = 'dashboard';
  
  // Hide all 8 destination views
  document.querySelectorAll('.destination-view').forEach(function(view) {
    view.style.display = 'none';
  });

  // Show the target destination view
  const targetView = document.getElementById('dest-' + destId);
  if (targetView) targetView.style.display = 'block';
  // fresh counts each time: a form signed on a kiosk only showed after a page refresh (Henry, 2026-10-17)
  if (destId === 'clients' && typeof window.renderClientsTable === 'function') window.renderClientsTable();
  if (destId === 'finance' && typeof window.renderFinanceSummary === 'function') window.renderFinanceSummary();
  if ((destId === 'inventory' || destId === 'dashboard') && typeof window.renderLowStockGrid === 'function') window.renderLowStockGrid();
  if (destId === 'settings' && typeof window.renderBackupCard === 'function') window.renderBackupCard();
  if (destId === 'settings' && typeof window.renderStudioDetailsCard === 'function') window.renderStudioDetailsCard();
  if (destId === 'settings' && typeof window.renderStationsCard === 'function') window.renderStationsCard();
  if (destId === 'settings' && typeof window.renderAftercareEditor === 'function') window.renderAftercareEditor();
  if ((destId === 'settings' || destId === 'inventory') && typeof window.renderSyncSettingsCard === 'function') window.renderSyncSettingsCard();

  // Update active status on sidebar nav buttons
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(function(item) {
    item.classList.remove('active');
    item.style.background = 'transparent';
    item.style.color = '#94A3B8';
    item.style.fontWeight = '700';
    item.style.boxShadow = 'none';
  });
  const activeNavItem = document.getElementById('nav-dest-' + destId);
  if (activeNavItem) {
    activeNavItem.classList.add('active');
    activeNavItem.style.background = 'linear-gradient(135deg, var(--ti-blue, #2563EB) 0%, var(--ti-blue, #1D4ED8) 100%)';
    activeNavItem.style.color = '#FFFFFF';
    activeNavItem.style.fontWeight = '800';
    activeNavItem.style.boxShadow = '0 3px 10px rgba(37,99,235,0.3)';
  }

  // Update topbar destination title and icon
  const titles = {
    dashboard: { title: 'Dashboard', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-chart></use></svg>' },
    clients: { title: 'Clients', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-users></use></svg>' },
    calendar: { title: 'Calendar', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-calendar></use></svg>' },
    inventory: { title: 'Inventory', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-box></use></svg>' },
    compliance: { title: 'Compliance', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-shield></use></svg>' },
    finance: { title: 'Finance', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-cash></use></svg>' },
    tools: { title: 'Tools', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-wrench></use></svg>' },
    settings: { title: 'Settings', icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-gear></use></svg>' }
  };
  const info = titles[destId] || { title: destId, icon: '<svg class=ti-i width=16 height=16 aria-hidden=true><use href=#i-pin></use></svg>' };
  const titleEl = document.getElementById('topbar-dest-title');
  const iconEl = document.getElementById('topbar-dest-icon');
  if (titleEl) titleEl.textContent = info.title;
  if (iconEl) iconEl.innerHTML = info.icon; // a drawn icon from the sprite in index.html

  // Auto-close sidebar on mobile viewports (< 900px)
  if (window.innerWidth <= 900) {
    toggleSidebar(false);
  }

  // Trigger view-specific dynamic renderings
  if (destId === 'dashboard') {
    if (typeof renderD3ActivityChart === 'function') setTimeout(renderD3ActivityChart, 50);
  } else if (destId === 'inventory') {
    if (typeof renderD3ProcurementChart === 'function') setTimeout(renderD3ProcurementChart, 50);
    if (typeof renderD3InventoryTrendChart === 'function') setTimeout(renderD3InventoryTrendChart, 50);
  } else if (destId === 'calendar') {
    if (typeof renderMonthlyShiftSchedule === 'function') setTimeout(renderMonthlyShiftSchedule, 50);
    if (typeof renderAppointmentsList === 'function') setTimeout(renderAppointmentsList, 50);
  }
}
window.navigateToDestination = navigateToDestination;

function toggleSidebar(forceState) {
  const sidebar = document.getElementById('main-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;

  const isOpen = sidebar.classList.contains('open');
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

  if (shouldOpen) {
    sidebar.classList.add('open');
    if (backdrop) backdrop.style.display = 'block';
  } else {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.style.display = 'none';
  }
}
window.toggleSidebar = toggleSidebar;

// Compatibility functions for legacy tab launchers
function switchToStaffDashboardMode() { navigateToDestination('dashboard'); }
window.switchToStaffDashboardMode = switchToStaffDashboardMode;
function switchToClientPortalMode() { navigateToDestination('clients'); }
window.switchToClientPortalMode = switchToClientPortalMode;
function switchTabToActivity() { navigateToDestination('dashboard'); }
window.switchTabToActivity = switchTabToActivity;
function switchTabToTool() { navigateToDestination('dashboard'); }
window.switchTabToTool = switchTabToTool;

// Consent Form Builder global entry point
function openFormBuilderModal(clientId, clientName) {
  if (typeof openWaiverModal === 'function') {
    openWaiverModal(clientId, clientName);
  } else {
    const waiverModal = document.getElementById('waiver-modal');
    if (waiverModal) waiverModal.style.display = 'flex';
  }
}
window.openFormBuilderModal = openFormBuilderModal;



