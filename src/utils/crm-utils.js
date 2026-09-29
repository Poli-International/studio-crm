/**
 * Studio CRM - Core CRM Utilities & Modal State Management Functions
 */

/**
 * Formats a number or string as USD currency.
 * @param {number|string} amount 
 * @returns {string} Formatted currency string (e.g. "$1,250.00")
 */
export function formatCurrency(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Calculates appointment status relative to current time or reference time.
 * @param {string|Date} startTime 
 * @param {number} durationMinutes 
 * @param {Date} [referenceDate] 
 * @returns {'Upcoming'|'In Progress'|'Completed'}
 */
export function calculateAppointmentStatus(startTime, durationMinutes = 60, referenceDate = new Date()) {
  if (!startTime) return 'Upcoming';
  const start = new Date(startTime);
  if (isNaN(start.getTime())) return 'Upcoming';
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const now = referenceDate ? new Date(referenceDate) : new Date();
  if (isNaN(now.getTime())) return 'Upcoming';

  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'In Progress';
  return 'Completed';
}

/**
 * Filters appointments array by date range.
 * @param {Array<{date: string}>} appointments 
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {Array}
 */
export function filterAppointmentsByDateRange(appointments, startDate, endDate) {
  if (!Array.isArray(appointments)) return [];
  const parsedStart = startDate ? new Date(startDate).getTime() : NaN;
  const parsedEnd = endDate ? new Date(endDate).getTime() : NaN;
  const start = !isNaN(parsedStart) ? parsedStart : -Infinity;
  const end = !isNaN(parsedEnd) ? parsedEnd : Infinity;

  return appointments.filter(app => {
    if (!app) return false;
    const appTime = new Date(app.date || app.startTime || 0).getTime();
    if (isNaN(appTime)) return false;
    return appTime >= start && appTime <= end;
  });
}

/**
 * Validates a modal state object for accessibility and stacking context integrity.
 * @param {object} modalConfig 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateModalState(modalConfig) {
  const errors = [];
  if (!modalConfig || typeof modalConfig !== 'object') {
    return { valid: false, errors: ['Modal config must be a non-null object'] };
  }

  if (!modalConfig.id || typeof modalConfig.id !== 'string') {
    errors.push('Modal id is required and must be a string');
  }

  if (modalConfig.zIndex !== undefined && (typeof modalConfig.zIndex !== 'number' || modalConfig.zIndex < 1000)) {
    errors.push('Modal zIndex must be at least 1000 for proper stacking context');
  }

  if (modalConfig.isOpen && modalConfig.display !== 'flex' && modalConfig.display !== 'block') {
    errors.push('Open modal must have display property set to flex or block');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Parses raw DOM table rows into clean JSON export format for CSV/PDF generators.
 * @param {Array<Array<string>>} rawRows 
 * @returns {{ headers: string[], data: Array<Array<string>>, totalRows: number }}
 */
export function extractTableDataForExport(rawRows) {
  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    return { headers: [], data: [], totalRows: 0 };
  }

  const cleanRows = rawRows.map(row => 
    row.map(cell => (cell || '').trim().replace(/\s+/g, ' '))
  );

  const headers = cleanRows[0];
  const data = cleanRows.slice(1);

  return {
    headers,
    data,
    totalRows: data.length
  };
}

/**
 * Computes aggregated test coverage metrics across CRM application modules.
 * @param {Record<string, { total: number, covered: number }>} moduleData 
 * @returns {{ overallCoverage: number, summary: Array<{ module: string, coverage: number, total: number, covered: number }> }}
 */
export function calculateCoverageMetrics(moduleData) {
  if (!moduleData || typeof moduleData !== 'object') {
    return { overallCoverage: 0, summary: [] };
  }

  let grandTotal = 0;
  let grandCovered = 0;
  const summary = [];

  for (const [moduleName, stats] of Object.entries(moduleData)) {
    const total = stats.total || 0;
    const covered = stats.covered || 0;
    const coverage = total > 0 ? Math.round((covered / total) * 1000) / 10 : 0;
    
    grandTotal += total;
    grandCovered += covered;

    summary.push({
      module: moduleName,
      coverage,
      total,
      covered
    });
  }

  const overallCoverage = grandTotal > 0 ? Math.round((grandCovered / grandTotal) * 1000) / 10 : 0;

  return {
    overallCoverage,
    summary
  };
}

/**
 * Handles QR scan payload parsing and activity stream update logic.
 * @param {string} decodedText 
 * @param {object} dataStore - { clients: [], inventory: [], appointments: [], allActivities: [] }
 * @returns {object} { isMalformed: boolean, matchedType: string|null, newActivity: object|null, allActivities: Array }
 */
export function handleScannedQrPayloadLogic(decodedText, dataStore = {}) {
  const payload = String(decodedText || '').trim();
  const payloadLower = payload.toLowerCase();
  const activities = Array.isArray(dataStore.allActivities) ? [...dataStore.allActivities] : [];

  const isMalformed = !payload || payload.length < 2 || payload.includes('???') || /^[^a-zA-Z0-9\-_:]+$/.test(payload);
  if (isMalformed) {
    return {
      isMalformed: true,
      error: 'Malformed QR Code format',
      matchedType: null,
      newActivity: null,
      allActivities: activities
    };
  }

  const clients = dataStore.clients || [];
  const inventory = dataStore.inventory || [];
  const appointments = dataStore.appointments || [];

  let matchedAppointment = null;
  let matchedClient = null;
  let matchedItem = null;

  // Appointment match
  if (payloadLower.startsWith('app-') || payloadLower.startsWith('appt-') || payloadLower.startsWith('appointment-') || payloadLower.startsWith('app:')) {
    const aId = parseInt(payload.replace(/[^0-9]/g, ''), 10);
    if (aId) matchedAppointment = appointments.find(a => a.id === aId);
  }
  if (!matchedAppointment) {
    matchedAppointment = appointments.find(a => String(a.id) === payload || (a.client_name && a.client_name.toLowerCase().includes(payloadLower)));
  }

  // Client match
  if (!matchedAppointment) {
    if (payloadLower.startsWith('client-') || payloadLower.startsWith('client:')) {
      const cId = parseInt(payload.replace(/[^0-9]/g, ''), 10);
      matchedClient = clients.find(c => c.id === cId);
    }
    if (!matchedClient) {
      matchedClient = clients.find(c => String(c.id) === payload || (c.name && c.name.toLowerCase().includes(payloadLower)));
    }
  }

  // Inventory match
  if (!matchedAppointment && !matchedClient) {
    if (payloadLower.startsWith('inv-') || payloadLower.startsWith('sku-')) {
      const iId = parseInt(payload.replace(/[^0-9]/g, ''), 10);
      matchedItem = inventory.find(i => i.id === iId);
    }
    if (!matchedItem) {
      matchedItem = inventory.find(i => String(i.id) === payload || (i.name && i.name.toLowerCase().includes(payloadLower)) || (i.sku && i.sku.toLowerCase().includes(payloadLower)));
    }
  }

  let matchedType = 'custom';
  let title = `Scanned QR Code (${payload})`;
  let details = `Payload: ${payload}`;

  if (matchedAppointment) {
    matchedType = 'appointment';
    title = `Appointment Check-In: ${matchedAppointment.client_name || 'Client'}`;
    details = `Matched Appt #${matchedAppointment.id} (${matchedAppointment.service_type || 'Session'})`;
  } else if (matchedClient) {
    matchedType = 'client';
    title = `Client Check-In: ${matchedClient.name}`;
    details = `Matched Client Pass #${matchedClient.id} (${matchedClient.email || matchedClient.phone || 'Verified'})`;
  } else if (matchedItem) {
    matchedType = 'inventory';
    title = `Inventory Scan: ${matchedItem.name}`;
    details = `Matched Inventory SKU #${matchedItem.id} (Stock: ${matchedItem.quantity || 0})`;
  }

  const newActivity = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title,
    details,
    category: matchedType,
    user: 'QR Scanner',
    timestamp: new Date().toISOString()
  };

  const updatedActivities = addActivityToStream(newActivity, activities);

  return {
    isMalformed: false,
    matchedType,
    newActivity,
    allActivities: updatedActivities
  };
}

/**
 * Prepends a new activity to the stream, ensuring ID deduplication.
 * @param {object} activity 
 * @param {Array} currentStream 
 * @returns {Array} Updated activity stream array
 */
export function addActivityToStream(activity, currentStream = []) {
  if (!activity || !activity.id) return Array.isArray(currentStream) ? currentStream : [];
  const stream = Array.isArray(currentStream) ? [...currentStream] : [];
  
  if (stream.some(a => a.id === activity.id)) {
    return stream;
  }
  
  stream.unshift(activity);
  return stream;
}

/**
 * Calculates virtual list window indices and spacer heights for optimal DOM node recycling.
 * @param {number} totalItems 
 * @param {number} itemHeight 
 * @param {number} containerHeight 
 * @param {number} scrollTop 
 * @param {number} overscan 
 * @returns {{ startIndex: number, endIndex: number, topSpacerHeight: number, bottomSpacerHeight: number, visibleCount: number }}
 */
export function calculateVirtualWindow(totalItems, itemHeight = 76, containerHeight = 450, scrollTop = 0, overscan = 2) {
  if (totalItems <= 0) {
    return { startIndex: 0, endIndex: 0, topSpacerHeight: 0, bottomSpacerHeight: 0, visibleCount: 0 };
  }

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems, startIndex + visibleItemsCount + (overscan * 2));

  const topSpacerHeight = startIndex * itemHeight;
  const bottomSpacerHeight = Math.max(0, (totalItems - endIndex) * itemHeight);
  const visibleCount = Math.max(0, endIndex - startIndex);

  return {
    startIndex,
    endIndex,
    topSpacerHeight,
    bottomSpacerHeight,
    visibleCount
  };
}

/**
 * Calculates exponential backoff retry delay with optional jitter.
 * @param {number} attempt - 1-indexed attempt count
 * @param {number} baseMs - Base delay in milliseconds (default 500)
 * @param {number} maxMs - Maximum capped delay (default 10000)
 * @param {boolean} includeJitter - Add random jitter variance (default false)
 * @returns {number} Delay duration in milliseconds
 */
export function calculateExponentialBackoffDelay(attempt, baseMs = 500, maxMs = 10000, includeJitter = false) {
  const currentAttempt = Math.max(1, attempt);
  const exponentialDelay = baseMs * Math.pow(2, currentAttempt - 1);
  const cappedDelay = Math.min(maxMs, exponentialDelay);
  
  if (includeJitter) {
    const jitter = Math.random() * 200;
    return Math.min(maxMs, cappedDelay + jitter);
  }

  return cappedDelay;
}

/**
 * Simple performance monitor utility to track execution duration and warn on budget overflow (>16ms).
 * @param {string} name - Function identifier
 * @param {Function} fn - Function to measure
 * @param {number} thresholdMs - Alert threshold in ms (default 16ms)
 * @returns {{ duration: number, result: any, exceeded: boolean }}
 */
export function measurePerformance(name, fn, thresholdMs = 16) {
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  let result;
  try {
    result = fn();
  } catch (err) {
    throw err;
  }
  const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const duration = Math.round((end - start) * 100) / 100;
  const exceeded = duration > thresholdMs;

  return {
    name,
    duration,
    result,
    exceeded
  };
}

/**
 * Filters inventory array by item name or SKU query (case-insensitive).
 * @param {Array<{name: string, sku?: string}>} inventory 
 * @param {string} query 
 * @returns {Array} Filtered inventory items
 */
export function filterInventoryByQuery(inventory, query) {
  if (!Array.isArray(inventory)) return [];
  const q = String(query || '').trim().toLowerCase();
  if (!q) return inventory;

  return inventory.filter(item => {
    const nameMatch = item.name && item.name.toLowerCase().includes(q);
    const skuMatch = item.sku && item.sku.toLowerCase().includes(q);
    const catMatch = item.category && item.category.toLowerCase().includes(q);
    return nameMatch || skuMatch || catMatch;
  });
}

/**
 * Calculates top 5 most used items based on recent activity logs & inventory items.
 * @param {Array<{title?: string, details?: string, category?: string}>} activities 
 * @param {Array<{name: string, sku?: string, quantity?: number}>} inventory 
 * @returns {Array<{name: string, sku: string, count: number}>} Top 5 used items
 */
export function getTop5UsedInventoryItems(activities = [], inventory = []) {
  const usageCounts = {};

  // Track occurrences from activity logs
  if (Array.isArray(activities)) {
    activities.forEach(act => {
      const text = `${act.title || ''} ${act.details || ''}`.toLowerCase();
      if (Array.isArray(inventory)) {
        inventory.forEach(item => {
          if (!item.name) return;
          const nameLower = item.name.toLowerCase();
          const skuLower = (item.sku || '').toLowerCase();
          if (text.includes(nameLower) || (skuLower && text.includes(skuLower))) {
            usageCounts[item.name] = (usageCounts[item.name] || 0) + 1;
          }
        });
      }
    });
  }

  // Ensure items from inventory list are populated if activity counts are low
  const results = [];
  const processedNames = new Set();

  // First add items found in logs sorted by count
  Object.keys(usageCounts).forEach(name => {
    const matchedInv = inventory.find(i => i.name === name);
    results.push({
      name,
      sku: matchedInv ? (matchedInv.sku || 'SKU-GEN') : 'SKU-LOG',
      count: usageCounts[name]
    });
    processedNames.add(name);
  });

  results.sort((a, b) => b.count - a.count);

  // If fewer than 5 items, fill in from inventory catalog
  if (results.length < 5 && Array.isArray(inventory)) {
    inventory.forEach(item => {
      if (results.length >= 5) return;
      if (item.name && !processedNames.has(item.name)) {
        // Generate baseline usage count from activity/stock formula
        const pseudoCount = Math.max(1, Math.floor((100 - (item.quantity || 10)) / 10) + Math.floor(Math.random() * 3));
        results.push({
          name: item.name,
          sku: item.sku || 'SKU-ACTIVE',
          count: pseudoCount
        });
        processedNames.add(item.name);
      }
    });
  }

  return results.slice(0, 5);
}


