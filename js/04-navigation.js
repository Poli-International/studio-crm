// =========================================================================
// 🧭 PERSISTENT SIDEBAR & DESTINATION NAVIGATION ENGINE
// =========================================================================
function navigateToDestination(destId) {
  if (!destId) destId = 'dashboard';
  
  // Hide all 8 destination views
  document.querySelectorAll('.destination-view').forEach(function(view) {
    view.style.display = 'none';
  });

  // Show the target destination view
  const targetView = document.getElementById('dest-' + destId);
  if (targetView) targetView.style.display = 'block';

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
    activeNavItem.style.background = 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)';
    activeNavItem.style.color = '#FFFFFF';
    activeNavItem.style.fontWeight = '800';
    activeNavItem.style.boxShadow = '0 3px 10px rgba(37,99,235,0.3)';
  }

  // Update topbar destination title and icon
  const titles = {
    dashboard: { title: 'Dashboard', icon: '📊' },
    clients: { title: 'Clients', icon: '👥' },
    calendar: { title: 'Calendar', icon: '📅' },
    inventory: { title: 'Inventory', icon: '📦' },
    compliance: { title: 'Compliance', icon: '🛡️' },
    finance: { title: 'Finance', icon: '💰' },
    tools: { title: 'Tools', icon: '🛠️' },
    settings: { title: 'Settings', icon: '⚙️' }
  };
  const info = titles[destId] || { title: destId, icon: '📌' };
  const titleEl = document.getElementById('topbar-dest-title');
  const iconEl = document.getElementById('topbar-dest-icon');
  if (titleEl) titleEl.textContent = info.title;
  if (iconEl) iconEl.textContent = info.icon;

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



