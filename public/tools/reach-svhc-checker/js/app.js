/*
  REACH SVHC Pigment Checker - Application Engine V2
  Poli International | 2026
  Curated snapshot of ECHA SVHC Candidate List for body art studios.
  Depends on: js/i18n.js and js/svhc-data.js
*/

// ─── DOM Elements ────────────────────────────────────────────────
const langSelect           = document.getElementById('lang-select');
const headerSubtitle       = document.getElementById('header-subtitle');
const staleBanner          = document.getElementById('stale-banner');
const coverageBtn          = document.getElementById('coverage-btn');
const coverageModal        = document.getElementById('coverage-modal');
const coverageCloseBtn     = document.getElementById('coverage-modal-close');
const disclaimerText       = document.getElementById('disclaimer-text');

const tabBtns              = document.querySelectorAll('.tab-btn');
const tabPanels            = document.querySelectorAll('.tab-panel');

const searchInput          = document.getElementById('search-input');
const searchBtn            = document.getElementById('search-btn');
const searchError          = document.getElementById('search-error');
const searchResults        = document.getElementById('search-results');

const bulkInput            = document.getElementById('bulk-input');
const bulkScanBtn          = document.getElementById('bulk-scan-btn');
const bulkClearBtn         = document.getElementById('bulk-clear-btn');
const bulkError            = document.getElementById('bulk-error');
const bulkResults          = document.getElementById('bulk-results');
const bulkDropzone         = document.getElementById('bulk-dropzone');
const bulkFileInput        = document.getElementById('bulk-file-input');

// Browse Elements
const browseCategorySelect = document.getElementById('filter-category');
const browseAppSelect      = document.getElementById('filter-application');
const browseSearchInput    = document.getElementById('browse-search-input');
const browseResults        = document.getElementById('browse-results');
const browseCountBadge     = document.getElementById('browse-count-badge');
const browseSubtitleText   = document.getElementById('browse-subtitle-text');

// Register Elements
const regProductInput      = document.getElementById('reg-product');
const regBatchInput        = document.getElementById('reg-batch');
const regNotesInput        = document.getElementById('reg-notes');
const regSaveBtn           = document.getElementById('reg-save-btn');
const regAddBulkBtn        = document.getElementById('reg-add-bulk-btn');
const regExportCsvBtn      = document.getElementById('reg-export-csv-btn');
const regExportJsonBtn     = document.getElementById('reg-export-json-btn');
const regClearBtn          = document.getElementById('reg-clear-btn');
const regTableContainer    = document.getElementById('register-table-container');

// Watchlist Elements
const wlNameInput          = document.getElementById('wl-name');
const wlCasInput           = document.getElementById('wl-cas');
const wlReasonInput        = document.getElementById('wl-reason');
const wlAddBtn             = document.getElementById('wl-add-btn');
const wlContainer          = document.getElementById('watchlist-items-container');

// State tracking for live language redraws
let lastSearchQuery = '';
let lastBulkText = '';
let lastBulkScanData = null; // Stored for one-click add to register

// LocalStorage Keys
const STORAGE_REGISTER  = 'poli_svhc_register_log';
const STORAGE_WATCHLIST = 'poli_svhc_custom_watchlist';

// ─── i18n Redraw Engine ──────────────────────────────────────────
function applyTranslations() {
  const currentLang = getLanguage();
  if (langSelect) {
    langSelect.value = currentLang;
  }

  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Translate all elements with data-i18n-aria attribute
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    el.setAttribute('aria-label', t(key));
  });

  // Translate all elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  // Translate all elements with data-i18n-title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', t(key));
  });

  // Reconciled subtitle and staleness banner
  if (headerSubtitle && typeof SVHC_METADATA !== 'undefined') {
    headerSubtitle.textContent = t('header.subtitle', {
      subsetCount: SVHC_METADATA.subsetCount,
      officialTotal: SVHC_METADATA.officialTotal,
      snapshotDate: SVHC_METADATA.listDate
    });
  }

  if (staleBanner && typeof isSnapshotStale === 'function') {
    const staleInfo = isSnapshotStale();
    if (staleInfo.isStale) {
      staleBanner.textContent = t('header.stale_warning', {
        snapshotDate: SVHC_METADATA.listDate
      });
      staleBanner.removeAttribute('hidden');
    } else {
      staleBanner.setAttribute('hidden', '');
    }
  }

  // Update input placeholders
  if (searchInput) {
    searchInput.setAttribute('placeholder', t('search.placeholder'));
  }
  if (bulkInput) {
    bulkInput.setAttribute('placeholder', t('bulk.placeholder'));
  }

  // Update browse subtitle
  if (browseSubtitleText && typeof SVHC_METADATA !== 'undefined') {
    browseSubtitleText.textContent = t('browse.subtitle', {
      count: SVHC_METADATA.subsetCount,
      snapshotDate: SVHC_METADATA.listDate
    });
  }

  // Update disclaimer
  if (disclaimerText && typeof SVHC_METADATA !== 'undefined') {
    disclaimerText.textContent = t('disclaimer.text', {
      snapshotDate: SVHC_METADATA.listDate,
      officialTotal: SVHC_METADATA.officialTotal
    });
  }

  // Re-render active results if populated, otherwise refresh idle prompt
  if (lastSearchQuery) {
    runSearch(true);
  } else if (searchResults) {
    searchResults.innerHTML = renderIdle(t('idle.search'));
  }

  if (lastBulkText) {
    runBulkScan(true);
  } else if (bulkResults) {
    bulkResults.innerHTML = renderIdle(t('idle.bulk'));
  }

  renderBrowseView();
  renderRegisterTable();
  renderWatchlistItems();
}

if (langSelect) {
  langSelect.addEventListener('change', e => {
    setLanguage(e.target.value);
    applyTranslations();
  });
}

// ─── Coverage Modal Handling ─────────────────────────────────────
if (coverageBtn && coverageModal) {
  coverageBtn.addEventListener('click', () => {
    coverageModal.removeAttribute('hidden');
  });
}

if (coverageCloseBtn && coverageModal) {
  coverageCloseBtn.addEventListener('click', () => {
    coverageModal.setAttribute('hidden', '');
  });
}

if (coverageModal) {
  coverageModal.addEventListener('click', e => {
    if (e.target === coverageModal) {
      coverageModal.setAttribute('hidden', '');
    }
  });
}

// ─── Tab Switching ───────────────────────────────────────────────
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => {
      const active = b.dataset.tab === target;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    tabPanels.forEach(p => {
      p.classList.toggle('active', p.id === `panel-${target}`);
    });
    if (target === 'browse') {
      renderBrowseView();
    } else if (target === 'register') {
      renderRegisterTable();
    } else if (target === 'watchlist') {
      renderWatchlistItems();
    }
  });
});

// ─── Single Search ───────────────────────────────────────────────
if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
  });
  searchInput.addEventListener('input', () => {
    if (searchError) searchError.setAttribute('hidden', '');
  });
}

if (searchBtn) {
  searchBtn.addEventListener('click', () => runSearch());
}

function runSearch(isRedraw = false) {
  const q = searchInput ? searchInput.value.trim() : '';

  if (!isRedraw) {
    lastSearchQuery = q;
  }

  if (!q) {
    if (!isRedraw && searchError) {
      searchError.textContent = t('search.empty_error');
      searchError.removeAttribute('hidden');
    }
    searchResults.innerHTML = renderIdle(t('idle.search'));
    return;
  }

  if (searchError) {
    searchError.setAttribute('hidden', '');
  }

  searchResults.innerHTML = '';

  // 1. Check custom studio watchlist first
  const wlHit = matchCustomWatchlist(q);
  if (wlHit) {
    searchResults.appendChild(buildWatchlistResultCard(wlHit, q));
  }

  // 2. Query official SVHC dataset
  const match = findByQuery(q);
  if (match) {
    searchResults.appendChild(buildFlaggedCard(match.substance, q, match.matchType, match.confidence, match.matchedToken));
  } else {
    // Try CAS pattern fallback if formatted as CAS
    const casMatches = q.match(CAS_PATTERN);
    if (casMatches) {
      const casMatch = SVHC_DATA.find(s => s.cas && s.cas.some(c => casMatches.includes(c)));
      if (casMatch) {
        searchResults.appendChild(buildFlaggedCard(casMatch, q, 'cas', 'high', casMatches[0]));
        return;
      }
    }
    if (!wlHit) {
      searchResults.appendChild(buildNotFoundCard(q));
    }
  }
}

// ─── Bulk SDS Scan ───────────────────────────────────────────────
if (bulkScanBtn) {
  bulkScanBtn.addEventListener('click', () => runBulkScan());
}

if (bulkClearBtn) {
  bulkClearBtn.addEventListener('click', () => {
    if (bulkInput) bulkInput.value = '';
    lastBulkText = '';
    lastBulkScanData = null;
    if (bulkError) bulkError.setAttribute('hidden', '');
    bulkResults.innerHTML = renderIdle(t('idle.bulk'));
  });
}

if (bulkInput) {
  bulkInput.addEventListener('input', () => {
    if (bulkError) bulkError.setAttribute('hidden', '');
  });
}

// Drag & Drop Handling for SDS .txt / .csv files
if (bulkDropzone) {
  bulkDropzone.addEventListener('dragover', e => {
    e.preventDefault();
    bulkDropzone.classList.add('dragover');
  });

  bulkDropzone.addEventListener('dragleave', () => {
    bulkDropzone.classList.remove('dragover');
  });

  bulkDropzone.addEventListener('drop', e => {
    e.preventDefault();
    bulkDropzone.classList.remove('dragover');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });

  const dropzoneHint = bulkDropzone.querySelector('.dropzone-hint');
  if (dropzoneHint && bulkFileInput) {
    dropzoneHint.addEventListener('click', () => bulkFileInput.click());
  }
}

if (bulkFileInput) {
  bulkFileInput.addEventListener('change', e => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadedFile(e.target.files[0]);
    }
  });
}

function handleUploadedFile(file) {
  if (!file) return;
  const isTxtOrCsv = file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.type.includes('text');
  if (!isTxtOrCsv) {
    if (bulkError) {
      bulkError.textContent = t('bulk.file_format_error');
      bulkError.removeAttribute('hidden');
    }
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const contents = e.target.result || '';
    if (bulkInput) {
      bulkInput.value = contents;
    }
    showToast(t('bulk.file_loaded', { filename: file.name }));
    runBulkScan();
  };
  reader.readAsText(file);
}

function runBulkScan(isRedraw = false) {
  const text = bulkInput ? bulkInput.value.trim() : '';

  if (!isRedraw) {
    lastBulkText = text;
  }

  if (!text) {
    if (!isRedraw && bulkError) {
      bulkError.textContent = t('bulk.empty_error');
      bulkError.removeAttribute('hidden');
    }
    bulkResults.innerHTML = renderIdle(t('idle.bulk'));
    lastBulkScanData = null;
    return;
  }

  if (bulkError) {
    bulkError.setAttribute('hidden', '');
  }

  const hits = parseIngredientBlock(text);

  // Check custom watchlist hits from text
  const customWatchlistHits = scanTextForWatchlist(text);

  // Deduplicate by substance id (prefer CAS / high confidence)
  const seen = new Map();
  hits.forEach(h => {
    if (!h.substance) return;
    const key = h.substance.id;
    if (!seen.has(key)) {
      seen.set(key, h);
    } else if (h.type === 'cas' || h.confidence === 'high') {
      seen.set(key, h);
    }
  });

  const flagged = [...seen.values()];
  const unknown = hits.filter(h => !h.substance);
  const total   = hits.length;

  lastBulkScanData = {
    flagged: flagged.map(f => f.substance.name),
    totalCount: total,
    textSnippet: text.slice(0, 100)
  };

  bulkResults.innerHTML = '';

  if (total === 0 && customWatchlistHits.length === 0) {
    bulkResults.innerHTML = renderIdle(t('idle.bulk'));
    return;
  }

  // Stats bar
  const statsEl = document.createElement('div');
  statsEl.className = 'scan-stats';

  const totalParsedText = total === 1
    ? t('stats.parsed_summary_one')
    : t('stats.parsed_summary', { count: total });

  if (flagged.length > 0 || customWatchlistHits.length > 0) {
    statsEl.innerHTML = `
      <div class="stat-item">
        <span class="stat-dot stat-dot--danger"></span>
        <span class="stat-count">${flagged.length}</span>
        <span class="stat-label">${escHtml(t('stats.flagged'))}</span>
      </div>
      <div class="stat-item">
        <span class="stat-dot stat-dot--safe"></span>
        <span class="stat-count">${unknown.length}</span>
        <span class="stat-label">${escHtml(t('stats.not_flagged'))}</span>
      </div>
      <div class="stat-item" style="color:var(--text-muted);font-size:0.78rem;margin-left:auto">
        ${escHtml(totalParsedText)}
      </div>
    `;
    bulkResults.appendChild(statsEl);

    const alertEl = document.createElement('div');
    alertEl.className = 'alert-banner alert-banner--danger';
    const alertKey = flagged.length === 1 ? 'stats.alert_danger' : 'stats.alert_danger_plural';
    alertEl.textContent = '⚠ ' + t(alertKey, { count: flagged.length });
    bulkResults.appendChild(alertEl);
  } else {
    statsEl.innerHTML = `
      <div class="stat-item">
        <span class="stat-dot stat-dot--safe"></span>
        <span class="stat-count">0</span>
        <span class="stat-label">${escHtml(t('stats.flagged'))}</span>
      </div>
      <div class="stat-item" style="color:var(--text-muted);font-size:0.78rem;margin-left:auto">
        ${escHtml(t('stats.no_matches_parsed', { count: total }))}
      </div>
    `;
    bulkResults.appendChild(statsEl);

    const infoEl = document.createElement('div');
    infoEl.className = 'alert-banner alert-banner--info';
    infoEl.textContent = t('stats.alert_safe');
    bulkResults.appendChild(infoEl);
  }

  // Custom watchlist hits section
  if (customWatchlistHits.length > 0) {
    const wlHdr = document.createElement('div');
    wlHdr.className = 'results-header';
    wlHdr.innerHTML = `<span class="results-title">${escHtml(t('watchlist.title'))} (${customWatchlistHits.length})</span>`;
    bulkResults.appendChild(wlHdr);

    const wlSec = document.createElement('div');
    wlSec.className = 'results-section';
    customWatchlistHits.forEach(item => {
      wlSec.appendChild(buildWatchlistResultCard(item, item.name));
    });
    bulkResults.appendChild(wlSec);
  }

  // Flagged substances header and list
  if (flagged.length > 0) {
    const hdr = document.createElement('div');
    hdr.className = 'results-header';
    hdr.innerHTML = `<span class="results-title">${escHtml(t('results.flagged_header', { count: flagged.length }))}</span>`;
    bulkResults.appendChild(hdr);

    const section = document.createElement('div');
    section.className = 'results-section';
    flagged.forEach(h => {
      section.appendChild(buildFlaggedCard(h.substance, h.query, h.type, h.confidence || 'high', h.matchedToken || h.query, h.concentration));
    });
    bulkResults.appendChild(section);
  }

  // Unknown / unflagged ingredients header and list
  if (unknown.length > 0) {
    const hdr2 = document.createElement('div');
    hdr2.className = 'results-header';
    hdr2.style.marginTop = '1.25rem';
    hdr2.innerHTML = `<span class="results-title">${escHtml(t('results.unknown_header', { count: unknown.length }))}</span>`;
    bulkResults.appendChild(hdr2);

    const section2 = document.createElement('div');
    section2.className = 'results-section';
    unknown.forEach(h => section2.appendChild(buildNotFoundCard(h.query)));
    bulkResults.appendChild(section2);
  }
}

// ─── Card Builders ───────────────────────────────────────────────
function buildFlaggedCard(sub, query, matchType, confidence = 'high', matchedToken = '', concentration = null) {
  const card = document.createElement('div');
  card.className = 'result-card result-card--flagged';

  // Relevance risk badge
  const relevanceBadge = sub.body_art_relevance === 'high'
    ? `<span class="badge badge--danger">${escHtml(t('card.risk_high'))}</span>`
    : sub.body_art_relevance === 'medium'
    ? `<span class="badge badge--warning">${escHtml(t('card.risk_medium'))}</span>`
    : `<span class="badge badge--neutral">${escHtml(t('card.risk_low'))}</span>`;

  // Confidence badge
  const confBadge = confidence === 'high'
    ? `<span class="badge badge--confidence-high">${escHtml(t('card.confidence_high'))}</span>`
    : confidence === 'medium'
    ? `<span class="badge badge--confidence-med">${escHtml(t('card.confidence_medium'))}</span>`
    : `<span class="badge badge--confidence-partial">${escHtml(t('card.confidence_partial'))}</span>`;

  const reasonKey = 'hazard.' + (sub.reason || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_').slice(0, 40).replace(/_+$/, '');
  const reasonShortKey = 'hazard_short.' + (sub.reason_short || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_').slice(0, 40).replace(/_+$/, '');
  const substanceNameKey = 'substance.' + sub.id + '.name';

  const reasonBadge = `<span class="badge badge--danger">${escHtml(t(reasonShortKey))}</span>`;
  const casDisplay = (sub.cas || []).join(', ');

  // Match description
  let matchNote = '';
  if (matchType === 'cas') {
    matchNote = t('card.matched_by_cas', { query: matchedToken || query });
  } else if (matchType === 'exact_name') {
    matchNote = t('card.matched_by_name', { query: matchedToken || query });
  } else if (matchType === 'alias') {
    matchNote = t('card.matched_by_alias', { query: matchedToken || query });
  } else if (matchType === 'boundary') {
    matchNote = t('card.matched_by_boundary', { term: matchedToken || query });
  } else {
    matchNote = t('card.matched_by_token', { term: matchedToken || query });
  }

  const foundInTags = (sub.found_in || []).map(f => {
    const fKey = 'found_in.' + f.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_').slice(0, 40).replace(/_+$/, '');
    return `<span class="detail-tag">${escHtml(t(fKey))}</span>`;
  }).join('');

  const alsoKnownAs = sub.also_known_as && sub.also_known_as.length > 0
    ? sub.also_known_as.map(a => `<span class="detail-tag">${escHtml(a)}</span>`).join('')
    : '<span class="detail-tag" style="color:var(--text-muted)">-</span>';

  // Cross-link buttons (Ban 18: use absolute url with target="_top")
  let crossLinksHtml = '';
  if (sub.id === 'nickel' || (sub.cas && sub.cas.includes('7440-02-0'))) {
    crossLinksHtml = `
      <div class="cross-link-box">
        <a href="https://poliinternational.com/nickel-release-calculator/" target="_top" class="cross-link-btn cross-link-btn--metal">
          🧮 ${escHtml(t('cross_link.nickel'))}
        </a>
      </div>
    `;
  } else if (sub.category === 'metal') {
    crossLinksHtml = `
      <div class="cross-link-box">
        <a href="https://poliinternational.com/material-certification-checker/" target="_top" class="cross-link-btn cross-link-btn--metal">
          📜 ${escHtml(t('cross_link.metal'))}
        </a>
      </div>
    `;
  } else if (sub.category === 'amine' || sub.category === 'pah' || sub.category === 'plasticizer' || (sub.found_in && sub.found_in.some(f => f.includes('ink') || f.includes('pigment')))) {
    crossLinksHtml = `
      <div class="cross-link-box">
        <a href="https://poliinternational.com/ink-ingredient-decoder/" target="_top" class="cross-link-btn cross-link-btn--ink">
          🧪 ${escHtml(t('cross_link.ink'))}
        </a>
      </div>
    `;
  }

  // Concentration Banner
  let concentrationHtml = '';
  if (concentration && concentration.token) {
    if (concentration.status === 'above') {
      concentrationHtml = `
        <div class="concentration-banner concentration-banner--above">
          <strong>${escHtml(t('concentration.parsed_label'))} ${escHtml(concentration.token)}</strong>
          <span>${escHtml(t('concentration.above_threshold', { value: concentration.value !== null ? concentration.value : concentration.token }))}</span>
        </div>
      `;
    } else if (concentration.status === 'below') {
      concentrationHtml = `
        <div class="concentration-banner concentration-banner--below">
          <strong>${escHtml(t('concentration.parsed_label'))} ${escHtml(concentration.token)}</strong>
          <span>${escHtml(t('concentration.below_threshold', { value: concentration.value !== null ? concentration.value : concentration.token }))}</span>
        </div>
      `;
    } else {
      concentrationHtml = `
        <div class="concentration-banner concentration-banner--ambiguous">
          <strong>${escHtml(t('concentration.parsed_label'))} ${escHtml(concentration.token)}</strong>
          <span>${escHtml(t('concentration.ambiguous', { token: concentration.token }))}</span>
        </div>
      `;
    }
  }

  card.innerHTML = `
    <div class="card-header" role="button" tabindex="0" aria-expanded="false">
      <span class="card-status-icon" aria-hidden="true">⚠️</span>
      <div class="card-title-block">
        <div class="card-name">${escHtml(t(substanceNameKey))}</div>
        <div class="card-name-sub">CAS ${escHtml(casDisplay)}</div>
        <div class="card-match-reason">${escHtml(matchNote)}</div>
      </div>
      <div class="card-badges">
        ${reasonBadge}
        ${relevanceBadge}
        ${confBadge}
      </div>
      <span class="card-chevron" aria-hidden="true">▼</span>
    </div>
    <div class="card-body">
      ${concentrationHtml}
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">${escHtml(t('card.label_hazard'))}</span>
          <span class="detail-value">${escHtml(t(reasonKey))}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">${escHtml(t('card.label_ec'))}</span>
          <span class="detail-value"><code>${escHtml(sub.ec || '-')}</code></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">${escHtml(t('card.label_cas'))}</span>
          <span class="detail-value"><code>${escHtml(casDisplay)}</code></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">${escHtml(t('card.label_confidence'))}</span>
          <span class="detail-value">${escHtml(matchNote)}</span>
        </div>
      </div>
      <div style="margin-top:0.75rem">
        <span class="detail-label">${escHtml(t('card.label_found_in'))}</span>
        <div class="detail-tags" style="margin-top:0.35rem">${foundInTags}</div>
      </div>
      <div style="margin-top:0.75rem">
        <span class="detail-label">${escHtml(t('card.label_also_known_as'))}</span>
        <div class="detail-tags" style="margin-top:0.35rem">${alsoKnownAs}</div>
      </div>
      ${crossLinksHtml}
      <div class="letter-action-row">
        <button type="button" class="btn-letter" data-substance-id="${escHtml(sub.id)}">
          ✉️ ${escHtml(t('letter.btn'))}
        </button>
      </div>
      <div class="card-action-row">
        <a href="${escHtml(sub.echa_url)}" target="_blank" rel="noopener noreferrer">
          ${escHtml(t('card.link_echa'))}
        </a>
        <a href="https://echa.europa.eu/candidate-list-table" target="_blank" rel="noopener noreferrer">
          ${escHtml(t('card.link_full_list'))}
        </a>
      </div>
    </div>
  `;

  // Attach card toggle event listener safely without inline handlers
  const headerEl = card.querySelector('.card-header');
  if (headerEl) {
    const toggle = () => {
      const isExpanded = card.classList.toggle('expanded');
      headerEl.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    };
    headerEl.addEventListener('click', toggle);
    headerEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }

  // Attach inquiry letter copy handler
  const letterBtn = card.querySelector('.btn-letter');
  if (letterBtn) {
    letterBtn.addEventListener('click', e => {
      e.stopPropagation();
      copySupplierInquiryLetter(sub, concentration);
    });
  }

  return card;
}

function buildNotFoundCard(query) {
  const div = document.createElement('div');
  div.className = 'not-found-card';
  div.innerHTML = `
    <span class="nf-icon" aria-hidden="true">✅</span>
    <div class="nf-text">
      <div class="nf-name">${escHtml(query)}</div>
      <div class="nf-sub">${escHtml(t('results.unknown_desc'))}</div>
    </div>
  `;
  return div;
}

function buildWatchlistResultCard(item, query) {
  const div = document.createElement('div');
  div.className = 'result-card';
  div.style.borderColor = 'var(--color-warning-border)';
  div.style.background = 'var(--color-warning-bg)';
  div.innerHTML = `
    <div style="padding:1rem 1.25rem;">
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;">
        <span style="font-size:1.1rem">📋</span>
        <strong style="color:var(--text-primary);font-size:1rem;">${escHtml(item.name)}</strong>
        <span class="badge badge--warning" style="margin-left:auto">${escHtml(t('watchlist.tag_match'))}</span>
      </div>
      <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.4rem;">
        ${item.cas ? `CAS: <code>${escHtml(item.cas)}</code> · ` : ''}
        ${item.reason ? `<em>${escHtml(item.reason)}</em>` : ''}
      </div>
      <div style="font-size:0.75rem;color:var(--color-warning-text);line-height:1.4;">
        ${escHtml(t('watchlist.disclaimer'))}
      </div>
    </div>
  `;
  return div;
}

// ─── 1. Interactive ECHA Browser View ────────────────────────────
function renderBrowseView() {
  if (!browseResults) return;

  const catVal = browseCategorySelect ? browseCategorySelect.value : 'all';
  const appVal = browseAppSelect ? browseAppSelect.value : 'all';
  const searchQ = browseSearchInput ? browseSearchInput.value.trim().toLowerCase() : '';

  let filtered = SVHC_DATA.filter(sub => {
    // Category filter
    if (catVal !== 'all' && sub.category !== catVal) {
      return false;
    }

    // Application filter
    if (appVal !== 'all') {
      const foundInStr = (sub.found_in || []).join(' ').toLowerCase();
      if (appVal === 'inks' && !(foundInStr.includes('ink') || foundInStr.includes('pigment') || sub.category === 'amine' || sub.category === 'pah')) {
        return false;
      }
      if (appVal === 'jewelry' && !(foundInStr.includes('jewelry') || foundInStr.includes('needles') || foundInStr.includes('tools') || sub.id === 'nickel' || sub.id === 'lead')) {
        return false;
      }
      if (appVal === 'packaging' && !(foundInStr.includes('packaging') || foundInStr.includes('pvc') || foundInStr.includes('vinyl') || foundInStr.includes('gloves') || sub.category === 'plasticizer' || sub.category === 'siloxane')) {
        return false;
      }
    }

    // Keyword / CAS search filter
    if (searchQ) {
      const matchName = sub.name.toLowerCase().includes(searchQ);
      const matchCas = (sub.cas || []).some(c => c.toLowerCase().includes(searchQ));
      const matchEc = (sub.ec || '').toLowerCase().includes(searchQ);
      const matchAliases = (sub.also_known_as || []).some(a => a.toLowerCase().includes(searchQ));
      if (!matchName && !matchCas && !matchEc && !matchAliases) {
        return false;
      }
    }

    return true;
  });

  if (browseCountBadge) {
    browseCountBadge.textContent = t('browse.showing_count', {
      filtered: filtered.length,
      total: SVHC_DATA.length
    });
  }

  browseResults.innerHTML = '';
  if (filtered.length === 0) {
    browseResults.innerHTML = renderIdle(t('results.unknown_desc'));
    return;
  }

  filtered.forEach(sub => {
    browseResults.appendChild(buildFlaggedCard(sub, sub.name, 'exact_name', 'high', sub.name));
  });
}

if (browseCategorySelect) {
  browseCategorySelect.addEventListener('change', renderBrowseView);
}
if (browseAppSelect) {
  browseAppSelect.addEventListener('change', renderBrowseView);
}
if (browseSearchInput) {
  browseSearchInput.addEventListener('input', renderBrowseView);
}

// ─── 4. Chemical Register / Screening Log ────────────────────────
function getStoredRegister() {
  try {
    const raw = localStorage.getItem(STORAGE_REGISTER);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRegisterItem(item) {
  const list = getStoredRegister();
  list.unshift(item);
  try {
    localStorage.setItem(STORAGE_REGISTER, JSON.stringify(list));
  } catch (e) {}
  renderRegisterTable();
}

function renderRegisterTable() {
  if (!regTableContainer) return;
  const items = getStoredRegister();

  if (items.length === 0) {
    regTableContainer.innerHTML = `
      <div class="register-empty-msg">
        ${escHtml(t('register.empty'))}
      </div>
    `;
    return;
  }

  let rowsHtml = items.map(item => {
    const flaggedStr = (item.flagged && item.flagged.length > 0)
      ? item.flagged.map(f => `<span class="detail-tag" style="color:var(--color-danger-text)">${escHtml(f)}</span>`).join(' ')
      : `<span style="color:var(--color-safe-text);font-weight:600">0</span>`;

    return `
      <tr>
        <td><code>${escHtml(item.date)}</code></td>
        <td><strong>${escHtml(item.product)}</strong></td>
        <td><code>${escHtml(item.batch || '-')}</code></td>
        <td>${flaggedStr}</td>
        <td>${escHtml(item.notes || '-')}</td>
      </tr>
    `;
  }).join('');

  regTableContainer.innerHTML = `
    <table class="register-table">
      <thead>
        <tr>
          <th>${escHtml(t('register.col_date'))}</th>
          <th>${escHtml(t('register.col_product'))}</th>
          <th>${escHtml(t('register.col_batch'))}</th>
          <th>${escHtml(t('register.col_flagged'))}</th>
          <th>${escHtml(t('register.col_notes'))}</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

// Local Calendar Date helper (Ban 19 compliance: Never UTC slice)
function getLocalCalendarDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

if (regSaveBtn) {
  regSaveBtn.addEventListener('click', () => {
    const product = regProductInput ? regProductInput.value.trim() : '';
    if (!product) return;
    const batch = regBatchInput ? regBatchInput.value.trim() : '';
    const notes = regNotesInput ? regNotesInput.value.trim() : '';

    saveRegisterItem({
      id: Date.now(),
      date: getLocalCalendarDate(),
      product,
      batch,
      flagged: lastBulkScanData && lastBulkScanData.flagged ? lastBulkScanData.flagged : [],
      notes
    });

    if (regProductInput) regProductInput.value = '';
    if (regBatchInput) regBatchInput.value = '';
    if (regNotesInput) regNotesInput.value = '';
  });
}

if (regAddBulkBtn) {
  regAddBulkBtn.addEventListener('click', () => {
    if (!lastBulkScanData) return;
    const prodName = prompt(t('register.form_product'), 'Screened SDS Batch');
    if (!prodName) return;

    saveRegisterItem({
      id: Date.now(),
      date: getLocalCalendarDate(),
      product: prodName,
      batch: '',
      flagged: lastBulkScanData.flagged || [],
      notes: `Screened from bulk block (${lastBulkScanData.totalCount} items analyzed)`
    });
  });
}

if (regClearBtn) {
  regClearBtn.addEventListener('click', () => {
    if (confirm(t('register.clear_log') + '?')) {
      try {
        localStorage.removeItem(STORAGE_REGISTER);
      } catch (e) {}
      renderRegisterTable();
    }
  });
}

if (regExportCsvBtn) {
  regExportCsvBtn.addEventListener('click', () => {
    const items = getStoredRegister();
    if (items.length === 0) return;
    const headers = ['Date Screened', 'Product', 'Batch/Lot', 'Flagged SVHCs', 'Notes'];
    const rows = items.map(i => [
      `"${i.date}"`,
      `"${(i.product || '').replace(/"/g, '""')}"`,
      `"${(i.batch || '').replace(/"/g, '""')}"`,
      `"${(i.flagged || []).join(', ').replace(/"/g, '""')}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadBlob(csvContent, 'studio-screening-log.csv', 'text/csv');
  });
}

if (regExportJsonBtn) {
  regExportJsonBtn.addEventListener('click', () => {
    const items = getStoredRegister();
    if (items.length === 0) return;
    const jsonContent = JSON.stringify(items, null, 2);
    downloadBlob(jsonContent, 'studio-screening-log.json', 'application/json');
  });
}

function downloadBlob(content, filename, mimeType) {
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

// ─── 5. Custom Watchlist Logic ───────────────────────────────────
function getStoredWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_WATCHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveWatchlistItem(item) {
  const list = getStoredWatchlist();
  list.push(item);
  try {
    localStorage.setItem(STORAGE_WATCHLIST, JSON.stringify(list));
  } catch (e) {}
  renderWatchlistItems();
}

function deleteWatchlistItem(id) {
  let list = getStoredWatchlist();
  list = list.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_WATCHLIST, JSON.stringify(list));
  } catch (e) {}
  renderWatchlistItems();
}

function renderWatchlistItems() {
  if (!wlContainer) return;
  const list = getStoredWatchlist();

  if (list.length === 0) {
    wlContainer.innerHTML = `<div class="register-empty-msg">${escHtml(t('watchlist.empty'))}</div>`;
    return;
  }

  wlContainer.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'watchlist-card';
    card.innerHTML = `
      <div class="watchlist-card-info">
        <span class="watchlist-card-title">${escHtml(item.name)}</span>
        <span class="watchlist-card-sub">
          ${item.cas ? `CAS: <code>${escHtml(item.cas)}</code> · ` : ''}
          ${item.reason ? `<em>${escHtml(item.reason)}</em>` : ''}
        </span>
      </div>
      <button type="button" class="watchlist-del-btn" data-wl-id="${item.id}">Remove</button>
    `;
    const delBtn = card.querySelector('.watchlist-del-btn');
    if (delBtn) {
      delBtn.addEventListener('click', () => deleteWatchlistItem(item.id));
    }
    wlContainer.appendChild(card);
  });
}

function matchCustomWatchlist(query) {
  if (!query) return null;
  const qNorm = query.toLowerCase().trim();
  const list = getStoredWatchlist();
  for (const item of list) {
    if (item.name.toLowerCase() === qNorm) return item;
    if (item.cas && item.cas === query.trim()) return item;
    if (qNorm.includes(item.name.toLowerCase()) && item.name.length >= 4) return item;
  }
  return null;
}

function scanTextForWatchlist(text) {
  const hits = [];
  const list = getStoredWatchlist();
  if (list.length === 0) return hits;
  const textNorm = text.toLowerCase();

  for (const item of list) {
    const itemNorm = item.name.toLowerCase();
    if (textNorm.includes(itemNorm) || (item.cas && text.includes(item.cas))) {
      hits.push(item);
    }
  }
  return hits;
}

if (wlAddBtn) {
  wlAddBtn.addEventListener('click', () => {
    const name = wlNameInput ? wlNameInput.value.trim() : '';
    if (!name) return;
    const cas = wlCasInput ? wlCasInput.value.trim() : '';
    const reason = wlReasonInput ? wlReasonInput.value.trim() : '';

    saveWatchlistItem({
      id: Date.now(),
      name,
      cas,
      reason
    });

    if (wlNameInput) wlNameInput.value = '';
    if (wlCasInput) wlCasInput.value = '';
    if (wlReasonInput) wlReasonInput.value = '';
  });
}

// ─── 3. Supplier Inquiry Letter Generator ────────────────────────
function copySupplierInquiryLetter(sub, concentration) {
  const substanceName = sub.name;
  const casDisplay = (sub.cas || []).join(', ');
  const ecDisplay = sub.ec || 'N/A';
  const hazardDesc = sub.reason || sub.reason_short || 'SVHC Candidate';
  const concMention = (concentration && concentration.token)
    ? `Mentioned in preliminary formulation at approx. ${concentration.token}`
    : 'Identified in product screening';

  const letterText =
`SUBJECT: Formal Chemical Substance Inquiry (REACH Article 33) - ${substanceName} (CAS ${casDisplay})

Dear Technical Compliance / Regulatory Department,

In connection with our professional studio chemical monitoring and product qualification under the European Union REACH Regulation (EC No 1907/2006), we are requesting verification regarding the following substance:

Substance Name: ${substanceName}
CAS Number: ${casDisplay}
EC Number: ${ecDisplay}
ECHA Candidate List Classification: ${hazardDesc}
Preliminary Observation: ${concMention}

Pursuant to REACH Article 33 (Duty to communicate information on substances in articles and mixtures):
1. Please confirm whether this substance is present in your product/batch in a concentration above 0.1% weight by weight (w/w).
2. If present at or above 0.1% w/w, please provide sufficient information, available to the supplier, to allow safe use of the article, including at least the name of that substance.
3. Please provide your latest compliant Safety Data Sheet (SDS) reflecting current Candidate List inclusions.

We appreciate your prompt cooperation in providing this regulatory documentation.

Sincerely,
Studio Quality & Compliance Management`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(letterText).then(() => {
      showToast(t('letter.copied_toast'));
    }).catch(() => {
      prompt('Copy letter text below:', letterText);
    });
  } else {
    prompt('Copy letter text below:', letterText);
  }
}

function showToast(msg) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// ─── Helpers ─────────────────────────────────────────────────────
function renderIdle(msg) {
  return `<div class="idle-state">
    <div class="idle-state__icon" aria-hidden="true">🔬</div>
    <div class="idle-state__text">${escHtml(msg)}</div>
  </div>`;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Initialization ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();

  // Auto-expand first flagged card when only one result
  const observer = new MutationObserver(() => {
    const cards = searchResults.querySelectorAll('.result-card--flagged');
    if (cards.length === 1) cards[0].classList.add('expanded');
  });
  observer.observe(searchResults, { childList: true });
});
