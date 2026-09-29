const MACHINES_KEY = 'poli-maint-machines';
const LOG_KEY = 'poli-maint-log';
const LANG_KEY = 'poli_tools_language';

const DICTIONARIES = {
  en: window.I18N_EN,
  fr: window.I18N_FR,
  it: window.I18N_IT,
  de: window.I18N_DE,
  es: window.I18N_ES,
  nl: window.I18N_NL,
  pt: window.I18N_PT
};

function getActiveLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && DICTIONARIES[saved]) return saved;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (DICTIONARIES[nav]) return nav;
  return 'en';
}

let currentLang = getActiveLanguage();

function t(path, params = {}) {
  const dict = DICTIONARIES[currentLang] || window.I18N_EN;
  const parts = path.split('.');
  let val = dict;
  for (const part of parts) {
    if (val && typeof val === 'object' && part in val) {
      val = val[part];
    } else {
      val = null;
      break;
    }
  }
  if (val === null && dict !== window.I18N_EN) {
    val = window.I18N_EN;
    for (const part of parts) {
      if (val && typeof val === 'object' && part in val) {
        val = val[part];
      } else {
        val = path;
        break;
      }
    }
  }
  if (typeof val === 'string') {
    for (const [k, v] of Object.entries(params)) {
      val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
    return val;
  }
  return path;
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadMachines() {
  try {
    const raw = localStorage.getItem(MACHINES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveMachines(machines) {
  localStorage.setItem(MACHINES_KEY, JSON.stringify(machines));
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));
}

function notify(msg) {
  const el = document.getElementById('toast-msg');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  setTimeout(() => {
    el.hidden = true;
  }, 3500);
}

function askConfirm(title, desc, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const titleEl = document.getElementById('modal-title');
  const descEl = document.getElementById('modal-message');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  if (!modal || !titleEl || !descEl || !cancelBtn || !confirmBtn) {
    return;
  }

  titleEl.textContent = title;
  descEl.textContent = desc;
  modal.hidden = false;

  function cleanup() {
    modal.hidden = true;
    cancelBtn.removeEventListener('click', onCancel);
    confirmBtn.removeEventListener('click', onOk);
  }
  function onCancel() {
    cleanup();
  }
  function onOk() {
    cleanup();
    onConfirm();
  }

  cancelBtn.addEventListener('click', onCancel);
  confirmBtn.addEventListener('click', onOk);
}

function updateStaticTranslations() {
  // Screen readers and the browser's translate prompt read <html lang>.
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const k = el.getAttribute('data-i18n');
    if (!k) return;
    el.textContent = t(k);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const k = el.getAttribute('data-i18n-aria');
    if (!k) return;
    el.setAttribute('aria-label', t(k));
  });
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = currentLang;
  }
}

function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseLocalDate(str) {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return new Date(y, m, d);
}

function calculateDueStatus(machine, entries) {
  if (machine.status === 'retired') {
    return null;
  }

  const mEntries = entries
    .filter((e) => e.machineId === machine.id || e.machineName === machine.name || e.machine === machine.name)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const latestEntry = mEntries[0];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let daysOverdue = null;
  let daysDueSoon = null;
  let targetDueDate = null;

  if (machine.intervalDays && typeof machine.intervalDays === 'number' && machine.intervalDays > 0) {
    const baseDateStr = latestEntry ? latestEntry.date : machine.purchaseDate;
    if (baseDateStr) {
      const baseDate = parseLocalDate(baseDateStr);
      if (baseDate) {
        const dueDate = new Date(baseDate);
        dueDate.setDate(dueDate.getDate() + machine.intervalDays);
        targetDueDate = formatLocalDate(dueDate);
        const diffMs = dueDate.getTime() - today.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) {
          daysOverdue = Math.abs(diffDays);
        } else if (diffDays <= 14) {
          daysDueSoon = diffDays;
        }
      }
    }
  }

  let hoursOverdue = null;
  if (machine.intervalHours && typeof machine.intervalHours === 'number' && machine.intervalHours > 0) {
    const hoursEntries = mEntries.filter((e) => e.runningHours !== null && e.runningHours !== undefined && !isNaN(e.runningHours));
    if (hoursEntries.length > 0) {
      const currentHours = hoursEntries[0].runningHours;
      const lastServiceHours = hoursEntries.length > 1 ? hoursEntries[1].runningHours : 0;
      const hoursDiff = currentHours - lastServiceHours;
      if (hoursDiff >= machine.intervalHours) {
        hoursOverdue = hoursDiff - machine.intervalHours;
      }
    }
  }

  if (daysOverdue !== null || daysDueSoon !== null || hoursOverdue !== null) {
    return {
      machine,
      daysOverdue,
      daysDueSoon,
      hoursOverdue,
      targetDueDate
    };
  }

  return null;
}

function exportIcsFile(machine, dueDateStr) {
  const dateStr = dueDateStr || formatLocalDate(new Date());
  const cleanDate = dateStr.replace(/-/g, '');
  const uid = `poli-maint-${machine.id || 'eq'}-${Date.now()}@poliinternational.com`;
  const summary = t('ics.summary', { name: machine.name });
  const desc = t('ics.description', {
    name: machine.name,
    serial: machine.serialNumber || t('ics.not_applicable'),
    model: machine.model || t('ics.not_applicable'),
    station: machine.station || t('ics.not_applicable'),
    artist: machine.artist || t('ics.not_applicable')
  });
  const loc = machine.station || '';

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Poli International//Machine Maintenance Logbook//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${cleanDate}T090000Z`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `DTEND;VALUE=DATE:${cleanDate}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `maintenance-${machine.name.replace(/[^a-zA-Z0-9_-]/g, '_')}-${cleanDate}.ics`;
  a.click();
  URL.revokeObjectURL(url);
  notify(t('toast.ics_exported'));
}

function renderDueBanner() {
  const banner = document.getElementById('due-banner');
  const title = document.getElementById('due-banner-title');
  const container = document.getElementById('due-items-container');
  if (!banner || !title || !container) return;

  const machines = loadMachines();
  const entries = loadEntries();

  const dueList = [];
  machines.forEach((m) => {
    const res = calculateDueStatus(m, entries);
    if (res) dueList.push(res);
  });

  if (dueList.length === 0) {
    banner.classList.add('due-banner--empty');
    title.textContent = t('due.none');
    container.innerHTML = '';
    return;
  }

  banner.classList.remove('due-banner--empty');
  title.textContent = t('due.banner_title');

  container.innerHTML = dueList.map((item) => {
    const m = item.machine;
    let badgeHtml = '';
    if (item.daysOverdue !== null) {
      badgeHtml = `<span class="due-item__badge due-item__badge--overdue">${escHtml(t('due.status_overdue', { days: item.daysOverdue }))}</span>`;
    } else if (item.hoursOverdue !== null) {
      badgeHtml = `<span class="due-item__badge due-item__badge--overdue">${escHtml(t('due.status_hours_overdue', { hours: item.hoursOverdue }))}</span>`;
    } else if (item.daysDueSoon !== null) {
      badgeHtml = `<span class="due-item__badge due-item__badge--due-soon">${escHtml(t('due.status_due_soon', { days: item.daysDueSoon }))}</span>`;
    }

    const locParts = [];
    if (m.station) locParts.push(m.station);
    if (m.artist) locParts.push(m.artist);
    const locStr = locParts.join(' • ');

    return `
      <div class="due-item">
        <div class="due-item__info">
          <div class="due-item__name">${escHtml(m.name)}</div>
          <div class="due-item__meta">${escHtml(locStr ? `${locStr} | ` : '')}${escHtml(m.serialNumber ? t('due.serial_prefix', { serial: m.serialNumber }) : (m.model || ''))}</div>
        </div>
        <div class="due-item__actions">
          ${badgeHtml}
          <button type="button" class="btn-secondary btn-sm due-export-btn" data-id="${escHtml(m.id)}" data-due="${escHtml(item.targetDueDate || '')}">${escHtml(t('due.export_ics'))}</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderMachines() {
  const tbody = document.getElementById('machines-table-body');
  const empty = document.getElementById('machines-empty-state');
  const entryMachineSelect = document.getElementById('entry-machine');
  const filterMachineSelect = document.getElementById('filter-machine');
  const filterStationSelect = document.getElementById('filter-station');
  const filterArtistSelect = document.getElementById('filter-artist');

  if (!tbody || !empty) return;

  const machines = loadMachines();

  if (entryMachineSelect) {
    const curVal = entryMachineSelect.value;
    entryMachineSelect.innerHTML = `<option value="">${escHtml(t('log.opt_select_machine'))}</option>` +
      machines.map((m) => `<option value="${escHtml(m.id)}">${escHtml(m.name)}${m.status === 'retired' ? ` [${t('machines.status_retired')}]` : ''}</option>`).join('');
    entryMachineSelect.value = curVal;
  }

  if (filterMachineSelect) {
    const curVal = filterMachineSelect.value;
    filterMachineSelect.innerHTML = `<option value="">${escHtml(t('filter.machine_all'))}</option>` +
      machines.map((m) => `<option value="${escHtml(m.id)}">${escHtml(m.name)}</option>`).join('');
    filterMachineSelect.value = curVal;
  }

  if (filterStationSelect) {
    const curVal = filterStationSelect.value;
    const stations = [...new Set(machines.map((m) => m.station).filter(Boolean))].sort();
    filterStationSelect.innerHTML = `<option value="">${escHtml(t('filter.station_all'))}</option>` +
      stations.map((s) => `<option value="${escHtml(s)}">${escHtml(s)}</option>`).join('');
    filterStationSelect.value = curVal;
  }

  if (filterArtistSelect) {
    const curVal = filterArtistSelect.value;
    const artists = [...new Set(machines.map((m) => m.artist).filter(Boolean))].sort();
    filterArtistSelect.innerHTML = `<option value="">${escHtml(t('filter.artist_all'))}</option>` +
      artists.map((a) => `<option value="${escHtml(a)}">${escHtml(a)}</option>`).join('');
    filterArtistSelect.value = curVal;
  }

  if (machines.length === 0) {
    tbody.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  tbody.innerHTML = machines.map((m) => {
    const isRetired = m.status === 'retired';
    const statusBadge = isRetired
      ? `<span class="status-badge status-badge--retired">${escHtml(t('machines.status_retired'))}</span>`
      : `<span class="status-badge status-badge--active">${escHtml(t('machines.status_active'))}</span>`;

    const datesStr = [
      m.purchaseDate ? t('machines.label_bought', { date: m.purchaseDate }) : '',
      m.warrantyEndDate ? t('machines.label_warranty', { date: m.warrantyEndDate }) : ''
    ].filter(Boolean).join('<br>');

    const locStr = [
      m.station ? t('machines.label_station', { station: m.station }) : '',
      m.artist ? t('machines.label_artist', { artist: m.artist }) : ''
    ].filter(Boolean).join('<br>');

    const intervalParts = [];
    if (m.intervalDays) intervalParts.push(`${m.intervalDays} ${t('units.days')}`);
    if (m.intervalHours) intervalParts.push(`${m.intervalHours} ${t('units.hours')}`);
    const intervalStr = intervalParts.join('<br>') || '-';

    return `
      <tr>
        <td data-label="${escHtml(t('machines.th_machine'))}">
          <strong>${escHtml(m.name)}</strong>
        </td>
        <td data-label="${escHtml(t('machines.th_serial'))}">
          ${escHtml(m.serialNumber || '-')}
          ${m.model ? `<span class="meta-subtext">${escHtml(m.model)}</span>` : ''}
        </td>
        <td data-label="${escHtml(t('machines.th_supplier'))}">${escHtml(m.supplier || '-')}</td>
        <td data-label="${escHtml(t('machines.th_dates'))}">${datesStr || '-'}</td>
        <td data-label="${escHtml(t('machines.th_location'))}">${locStr || '-'}</td>
        <td data-label="${escHtml(t('machines.th_interval'))}">${intervalStr}</td>
        <td data-label="${escHtml(t('machines.th_status'))}">${statusBadge}</td>
        <td data-label="${escHtml(t('machines.th_actions'))}">
          <div class="cell-actions">
            <button type="button" class="btn-secondary btn-sm toggle-retire-btn" data-id="${escHtml(m.id)}" data-retired="${isRetired ? '1' : '0'}">
              ${escHtml(isRetired ? t('machines.btn_reactivate') : t('machines.btn_retire'))}
            </button>
            <button type="button" class="btn-secondary btn-sm machine-export-ics" data-id="${escHtml(m.id)}" title="${escHtml(t('due.export_ics'))}">
              .ics
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderLogTable() {
  const tbody = document.getElementById('log-table-body');
  const empty = document.getElementById('log-empty-state');
  const countEl = document.getElementById('log-count-display');
  if (!tbody || !empty) return;

  const entries = loadEntries();
  const machines = loadMachines();
  const machineMap = new Map(machines.map((m) => [m.id, m]));

  const fStation = (document.getElementById('filter-station')?.value || '').trim();
  const fArtist = (document.getElementById('filter-artist')?.value || '').trim();
  const fMachine = (document.getElementById('filter-machine')?.value || '').trim();
  const fType = (document.getElementById('filter-type')?.value || '').trim();
  const fStatus = document.getElementById('filter-status')?.value || 'all';

  const filtered = entries.filter((e) => {
    const m = machineMap.get(e.machineId) || { name: e.machineName || e.machine || '', station: '', artist: '', status: 'active' };
    if (fStation && m.station !== fStation) return false;
    if (fArtist && m.artist !== fArtist) return false;
    if (fMachine && e.machineId !== fMachine && m.name !== fMachine) return false;
    if (fType && e.type !== fType) return false;
    if (fStatus === 'active' && m.status === 'retired') return false;
    if (fStatus === 'retired' && m.status !== 'retired') return false;
    return true;
  });

  if (countEl) {
    countEl.textContent = filtered.length === 1
      ? t('log.count_single')
      : t('log.count_plural', { count: filtered.length });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  const sortedForCalc = [...entries].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    const hA = typeof a.runningHours === 'number' ? a.runningHours : 0;
    const hB = typeof b.runningHours === 'number' ? b.runningHours : 0;
    return hA - hB;
  });

  const deltaMap = new Map();
  const lastHoursByType = new Map();

  sortedForCalc.forEach((e) => {
    const mId = e.machineId || e.machineName || e.machine;
    const key = `${mId}:::${e.type}`;
    if (e.runningHours !== null && e.runningHours !== undefined && !isNaN(e.runningHours)) {
      const prevHours = lastHoursByType.get(key);
      if (prevHours !== undefined && prevHours !== null) {
        const delta = Math.round((e.runningHours - prevHours) * 10) / 10;
        deltaMap.set(e.id, { current: e.runningHours, prev: prevHours, delta, type: e.type });
      } else {
        deltaMap.set(e.id, { current: e.runningHours, first: true, type: e.type });
      }
      lastHoursByType.set(key, e.runningHours);
    }
  });

  const displayList = [...filtered].reverse();

  tbody.innerHTML = displayList.map((e) => {
    const m = machineMap.get(e.machineId);
    const mName = m ? m.name : (e.machineName || e.machine || '-');
    const station = m?.station || '';
    const artist = m?.artist || '';
    const subText = [station, artist].filter(Boolean).join(' • ');

    const deltaInfo = deltaMap.get(e.id);
    let hoursStr = t('log.hours_not_recorded');
    if (deltaInfo) {
      if (deltaInfo.first) {
        hoursStr = t('log.hours_first_record', { current: deltaInfo.current, type: deltaInfo.type });
      } else {
        hoursStr = t('log.hours_since_last', { current: deltaInfo.current, prev: deltaInfo.prev, delta: deltaInfo.delta, type: deltaInfo.type });
      }
    }

    const voltageStr = e.voltage ? `${escHtml(e.voltage)} V` : '-';

    const partsCostList = [];
    if (e.partsReplaced) partsCostList.push(escHtml(e.partsReplaced));
    if (e.cost !== null && e.cost !== undefined && !isNaN(e.cost)) {
      partsCostList.push(`$${Number(e.cost).toFixed(2)}`);
    }
    const partsCostStr = partsCostList.join('<br>') || '-';

    return `
      <tr>
        <td data-label="${escHtml(t('log.th_date'))}"><strong>${escHtml(e.date)}</strong></td>
        <td data-label="${escHtml(t('log.th_machine'))}">
          ${escHtml(mName)}
          ${subText ? `<span class="meta-subtext">${escHtml(subText)}</span>` : ''}
        </td>
        <td data-label="${escHtml(t('log.th_type'))}">${escHtml(e.type)}</td>
        <td data-label="${escHtml(t('log.th_hours'))}" class="cell-hours">${escHtml(hoursStr)}</td>
        <td data-label="${escHtml(t('log.th_voltage'))}">${voltageStr}</td>
        <td data-label="${escHtml(t('log.th_parts_cost'))}">${partsCostStr}</td>
        <td data-label="${escHtml(t('log.th_filing'))}">${escHtml(e.filingRef || '-')}</td>
        <td data-label="${escHtml(t('log.th_notes'))}" class="cell-notes">${escHtml(e.notes || '-')}</td>
        <td data-label="${escHtml(t('machines.th_actions'))}">
          <button type="button" class="del-btn log-del-btn" data-id="${escHtml(e.id)}" title="${escHtml(t('log.btn_delete'))}" aria-label="${escHtml(t('log.btn_delete'))}">×</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderCostSummary() {
  const mBody = document.getElementById('costs-machine-body');
  const mEmpty = document.getElementById('costs-machine-empty');
  const yBody = document.getElementById('costs-year-body');
  const yEmpty = document.getElementById('costs-year-empty');
  if (!mBody || !yBody || !mEmpty || !yEmpty) return;

  const entries = loadEntries();
  const machines = loadMachines();
  const machineMap = new Map(machines.map((m) => [m.id, m]));

  const machineCosts = new Map();
  const yearCosts = new Map();

  entries.forEach((e) => {
    const cost = (e.cost !== null && e.cost !== undefined && !isNaN(e.cost)) ? Number(e.cost) : null;
    const parts = (e.partsReplaced || '').trim();

    const mId = e.machineId || 'unknown';
    const mName = machineMap.get(e.machineId)?.name || e.machineName || e.machine || t('costs.unassigned');

    if (!machineCosts.has(mName)) {
      machineCosts.set(mName, { parts: [], costs: [], total: 0 });
    }
    const mData = machineCosts.get(mName);
    if (parts) mData.parts.push(parts);
    if (cost !== null) {
      mData.costs.push(cost);
      mData.total += cost;
    }

    if (e.date && e.date.length >= 4) {
      const year = e.date.slice(0, 4);
      if (!yearCosts.has(year)) {
        yearCosts.set(year, { count: 0, costs: [], total: 0 });
      }
      const yData = yearCosts.get(year);
      yData.count += 1;
      if (cost !== null) {
        yData.costs.push(cost);
        yData.total += cost;
      }
    }
  });

  const mEntriesWithCost = [...machineCosts.entries()].filter(([_, d]) => d.costs.length > 0 || d.parts.length > 0);
  if (mEntriesWithCost.length === 0) {
    mBody.innerHTML = '';
    mEmpty.hidden = false;
  } else {
    mEmpty.hidden = true;
    mBody.innerHTML = mEntriesWithCost.map(([mName, data]) => {
      const partsStr = data.parts.length ? [...new Set(data.parts)].join(', ') : '-';
      const breakdownStr = data.costs.length > 0
        ? data.costs.map((c) => `$${c.toFixed(2)}`).join(' + ') + ` = $${data.total.toFixed(2)}`
        : '$0.00';
      return `
        <tr>
          <td data-label="${escHtml(t('costs.th_machine'))}"><strong>${escHtml(mName)}</strong></td>
          <td data-label="${escHtml(t('costs.th_parts'))}" class="cell-notes">${escHtml(partsStr)}</td>
          <td data-label="${escHtml(t('costs.th_calc'))}" class="cell-calc">${escHtml(breakdownStr)}</td>
          <td data-label="${escHtml(t('costs.th_total'))}"><strong>$${data.total.toFixed(2)}</strong></td>
        </tr>
      `;
    }).join('');
  }

  const yEntriesWithCost = [...yearCosts.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  if (yEntriesWithCost.length === 0) {
    yBody.innerHTML = '';
    yEmpty.hidden = false;
  } else {
    yEmpty.hidden = true;
    yBody.innerHTML = yEntriesWithCost.map(([year, data]) => {
      const breakdownStr = data.costs.length > 0
        ? (data.costs.length > 1
          ? data.costs.map((c) => `$${c.toFixed(2)}`).join(' + ') + ` = $${data.total.toFixed(2)}`
          : `$${data.total.toFixed(2)}`)
        : '$0.00';
      return `
        <tr>
          <td data-label="${escHtml(t('costs.th_year'))}"><strong>${escHtml(year)}</strong></td>
          <td data-label="${escHtml(t('costs.th_events'))}">${data.count}</td>
          <td data-label="${escHtml(t('costs.th_calc'))}" class="cell-calc">${escHtml(breakdownStr)}</td>
          <td data-label="${escHtml(t('costs.th_total'))}"><strong>$${data.total.toFixed(2)}</strong></td>
        </tr>
      `;
    }).join('');
  }
}

function renderAll() {
  renderDueBanner();
  renderMachines();
  renderLogTable();
  renderCostSummary();
}

function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      panels.forEach((p) => {
        if (p.id === targetId) {
          p.hidden = false;
        } else {
          p.hidden = true;
        }
      });
    });
  });
}

function setupMachineForm() {
  const form = document.getElementById('machine-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('m-name');
    const serialEl = document.getElementById('m-serial');
    const modelEl = document.getElementById('m-model');
    const supplierEl = document.getElementById('m-supplier');
    const purchaseEl = document.getElementById('m-purchase-date');
    const warrantyEl = document.getElementById('m-warranty-date');
    const stationEl = document.getElementById('m-station');
    const artistEl = document.getElementById('m-artist');
    const intervalDaysEl = document.getElementById('m-interval-days');
    const intervalHoursEl = document.getElementById('m-interval-hours');

    const name = nameEl.value.trim();
    if (!name) {
      notify(t('validation.machine_name_required'));
      return;
    }

    const purchaseDate = purchaseEl.value.trim();
    const warrantyEndDate = warrantyEl.value.trim();
    if (purchaseDate && warrantyEndDate && warrantyEndDate < purchaseDate) {
      notify(t('validation.warranty_before_purchase'));
      return;
    }

    let intervalDays = null;
    if (intervalDaysEl.value.trim() !== '') {
      const v = parseInt(intervalDaysEl.value.trim(), 10);
      if (isNaN(v) || v <= 0) {
        notify(t('validation.interval_days_positive'));
        return;
      }
      intervalDays = v;
    }

    let intervalHours = null;
    if (intervalHoursEl.value.trim() !== '') {
      const v = parseFloat(intervalHoursEl.value.trim());
      if (isNaN(v) || v <= 0) {
        notify(t('validation.interval_hours_positive'));
        return;
      }
      intervalHours = v;
    }

    const newMachine = {
      id: 'm_' + Date.now(),
      name,
      serialNumber: serialEl.value.trim(),
      model: modelEl.value.trim(),
      supplier: supplierEl.value.trim(),
      purchaseDate,
      warrantyEndDate,
      station: stationEl.value.trim(),
      artist: artistEl.value.trim(),
      intervalDays,
      intervalHours,
      status: 'active'
    };

    const machines = loadMachines();
    machines.push(newMachine);
    saveMachines(machines);

    form.reset();
    renderAll();
    notify(t('toast.machine_saved'));
  });
}

function setupLogForm() {
  const form = document.getElementById('log-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const machineSelect = document.getElementById('entry-machine');
    const dateInput = document.getElementById('entry-date');
    const hoursInput = document.getElementById('entry-hours');
    const typeSelect = document.getElementById('entry-type');
    const voltageInput = document.getElementById('entry-voltage');
    const partsInput = document.getElementById('entry-parts');
    const costInput = document.getElementById('entry-cost');
    const filingInput = document.getElementById('entry-filing-ref');
    const notesInput = document.getElementById('entry-notes');

    const machineId = machineSelect.value;
    if (!machineId) {
      notify(t('validation.machine_required'));
      return;
    }

    const date = dateInput.value.trim();
    if (!date) {
      notify(t('validation.date_required'));
      return;
    }

    const type = typeSelect.value;
    if (!type) {
      notify(t('validation.maint_type_required'));
      return;
    }

    let runningHours = null;
    if (hoursInput.value.trim() !== '') {
      const v = parseFloat(hoursInput.value.trim());
      if (isNaN(v) || v < 0) {
        notify(t('validation.hours_negative'));
        return;
      }
      runningHours = v;
    }

    let voltage = null;
    if (voltageInput.value.trim() !== '') {
      const v = parseFloat(voltageInput.value.trim());
      if (isNaN(v) || v < 0) {
        notify(t('validation.voltage_negative'));
        return;
      }
      voltage = voltageInput.value.trim();
    }

    let cost = null;
    if (costInput.value.trim() !== '') {
      const v = parseFloat(costInput.value.trim());
      if (isNaN(v) || v < 0) {
        notify(t('validation.cost_negative'));
        return;
      }
      cost = Math.round(v * 100) / 100;
    }

    const machines = loadMachines();
    const machineObj = machines.find((m) => m.id === machineId);
    const machineName = machineObj ? machineObj.name : '';

    const newEntry = {
      id: 'e_' + Date.now(),
      machineId,
      machineName,
      date,
      runningHours,
      type,
      voltage,
      partsReplaced: partsInput.value.trim(),
      cost,
      filingRef: filingInput.value.trim(),
      notes: notesInput.value.trim()
    };

    const entries = loadEntries();
    entries.push(newEntry);
    saveEntries(entries);

    form.reset();
    renderAll();
    notify(t('toast.entry_saved'));
  });
}

function setupGlobalDelegation() {
  document.addEventListener('click', (e) => {
    const dueBtn = e.target.closest('.due-export-btn');
    if (dueBtn) {
      const mId = dueBtn.dataset.id;
      const dueDate = dueBtn.dataset.due;
      const machines = loadMachines();
      const m = machines.find((x) => x.id === mId);
      if (m) exportIcsFile(m, dueDate);
      return;
    }

    const mIcsBtn = e.target.closest('.machine-export-ics');
    if (mIcsBtn) {
      const mId = mIcsBtn.dataset.id;
      const machines = loadMachines();
      const m = machines.find((x) => x.id === mId);
      if (m) exportIcsFile(m);
      return;
    }

    const toggleBtn = e.target.closest('.toggle-retire-btn');
    if (toggleBtn) {
      const mId = toggleBtn.dataset.id;
      const isRetired = toggleBtn.dataset.retired === '1';
      const machines = loadMachines();
      const m = machines.find((x) => x.id === mId);
      if (!m) return;

      if (!isRetired) {
        askConfirm(t('modal.confirm_title'), t('confirm.retire_machine'), () => {
          m.status = 'retired';
          saveMachines(machines);
          renderAll();
          notify(t('toast.machine_retired'));
        });
      } else {
        askConfirm(t('modal.confirm_title'), t('confirm.reactivate_machine'), () => {
          m.status = 'active';
          saveMachines(machines);
          renderAll();
          notify(t('toast.machine_reactivated'));
        });
      }
      return;
    }

    const delEntryBtn = e.target.closest('.log-del-btn');
    if (delEntryBtn) {
      const id = delEntryBtn.dataset.id;
      askConfirm(t('modal.confirm_title'), t('confirm.delete_entry'), () => {
        const entries = loadEntries();
        const next = entries.filter((x) => x.id !== id);
        saveEntries(next);
        renderAll();
        notify(t('toast.entry_deleted'));
      });
      return;
    }
  });

  const filters = ['filter-station', 'filter-artist', 'filter-machine', 'filter-type', 'filter-status'];
  filters.forEach((id) => {
    document.getElementById(id)?.addEventListener('change', () => {
      renderLogTable();
    });
  });

  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem(LANG_KEY, currentLang);
      updateStaticTranslations();
      renderAll();
    });
  }

  const exportCsvBtn = document.getElementById('export-csv-btn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const entries = loadEntries();
      if (!entries.length) {
        notify(t('log.empty'));
        return;
      }
      const machines = loadMachines();
      const mMap = new Map(machines.map((m) => [m.id, m]));

      const header = [
        t('csv.th_date'),
        t('csv.th_machine'),
        t('csv.th_station'),
        t('csv.th_artist'),
        t('csv.th_type'),
        t('csv.th_running_hours'),
        t('csv.th_voltage'),
        t('csv.th_parts_replaced'),
        t('csv.th_cost'),
        t('csv.th_filing_ref'),
        t('csv.th_notes')
      ];
      const rows = entries.map((e) => {
        const m = mMap.get(e.machineId);
        return [
          e.date,
          m ? m.name : (e.machineName || e.machine || ''),
          m?.station || '',
          m?.artist || '',
          e.type,
          e.runningHours !== null ? e.runningHours : '',
          e.voltage || '',
          e.partsReplaced || '',
          e.cost !== null ? Number(e.cost).toFixed(2) : '',
          e.filingRef || '',
          e.notes || ''
        ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',');
      });

      const csv = [header.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `machine-maintenance-log-${formatLocalDate(new Date())}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      notify(t('toast.csv_exported'));
    });
  }

  const backupBtn = document.getElementById('backup-json-btn');
  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      const machines = loadMachines();
      const entries = loadEntries();
      const payload = {
        version: 1,
        tool: 'machine-maintenance-logbook',
        exportedAt: new Date().toISOString(),
        machines,
        entries
      };
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `machine-maintenance-backup-${formatLocalDate(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
      notify(t('toast.backup_exported'));
    });
  }

  const restoreTrigger = document.getElementById('restore-trigger-btn');
  const fileInput = document.getElementById('restore-file-input');
  if (restoreTrigger && fileInput) {
    restoreTrigger.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (!parsed || !Array.isArray(parsed.machines) || !Array.isArray(parsed.entries)) {
            notify(t('toast.restore_invalid'));
            return;
          }

          askConfirm(
            t('modal.confirm_title'),
            t('confirm.restore', { machines: parsed.machines.length, entries: parsed.entries.length }),
            () => {
              saveMachines(parsed.machines);
              saveEntries(parsed.entries);
              renderAll();
              notify(t('toast.restore_success'));
            }
          );
        } catch (_) {
          notify(t('toast.restore_invalid'));
        } finally {
          fileInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }

  const clearAllBtn = document.getElementById('clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      askConfirm(t('modal.confirm_title'), t('confirm.clear_all'), () => {
        localStorage.removeItem(MACHINES_KEY);
        localStorage.removeItem(LOG_KEY);
        renderAll();
        notify(t('toast.all_cleared'));
      });
    });
  }
}

function init() {
  updateStaticTranslations();
  setupTabs();
  setupMachineForm();
  setupLogForm();
  setupGlobalDelegation();
  renderAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
