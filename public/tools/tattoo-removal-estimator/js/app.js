/**
 * Tattoo Removal Sessions Estimator - V2 Application Logic
 * Implements the Kirby-Desai Scale (Kirby W, Desai A et al., J Clin Aesthet Dermatol. 2009;2(3):32–37).
 *
 * Fully localized, client-side only, zero external libraries, zero remote network requests.
 * Features:
 * 1. Multi-Tattoo Profile Manager (localStorage)
 * 2. Clinical Lifestyle & Circulation Modifiers
 * 3. Cover-Up Colour Feasibility Matrix
 * 5. Non-Linear Biological Clearance Trajectory Curve (SVG)
 * 6. Local Photo Progression Storage (IndexedDB)
 * 7. Interactive Clinical Aftercare Stage Checklist
 * 8. Data Backup, Export & Portability (JSON/CSV)
 */

(function(window, document) {
  'use strict';

  var G = (typeof window !== 'undefined' && window.InputGuards) || (typeof InputGuards !== 'undefined' ? InputGuards : {});
  var i18n = (typeof window !== 'undefined' && window.i18n) || (typeof i18n !== 'undefined' ? i18n : { t: function(k) { return k; } });

  // DOM Elements
  var form = document.getElementById('calc-form');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var printBtn = document.getElementById('print-btn');
  var exportIcsBtn = document.getElementById('export-ics-btn');
  var results = document.getElementById('results');
  var langSelect = document.getElementById('lang-select');

  // Profile Elements
  var profileSelect = document.getElementById('profile-select');
  var profileNewBtn = document.getElementById('profile-new-btn');
  var profileRenameBtn = document.getElementById('profile-rename-btn');
  var profileDeleteBtn = document.getElementById('profile-delete-btn');

  // Assessment Inputs
  var goalRadios = document.getElementsByName('treatment-goal');
  var skinSelect = document.getElementById('skin-type');
  var sunBurnSelect = document.getElementById('skin-q1');
  var sunTanSelect = document.getElementById('skin-q2');
  var locationSelect = document.getElementById('location-named');
  var locationDesc = document.getElementById('location-group-desc');
  var colourSelect = document.getElementById('ink-colour');
  var densitySelect = document.getElementById('ink-density');
  var scarringSelect = document.getElementById('scarring');
  var layeringSelect = document.getElementById('layering');

  // Clinic & Progress Inputs
  var intervalInput = document.getElementById('clinic-interval');
  var priceInput = document.getElementById('session-price');
  var currencyInput = document.getElementById('currency-symbol');
  var startedCheckbox = document.getElementById('already-started');
  var startedPanel = document.getElementById('started-panel');
  var completedInput = document.getElementById('sessions-completed');
  var fadeRatingInput = document.getElementById('current-fade');
  var startDateInput = document.getElementById('calendar-start-date');

  // Lifestyle Inputs
  var lifestyleSmoking = document.getElementById('lifestyle-smoking');

  // Fade log elements
  var logDateInput = document.getElementById('log-date');
  var logRatingInput = document.getElementById('log-rating');
  var logNoteInput = document.getElementById('log-note');
  var logAddBtn = document.getElementById('log-add-btn');
  var logTableBody = document.getElementById('log-table-body');
  var logEmptyMsg = document.getElementById('log-empty-msg');
  var logPhotoFile = document.getElementById('log-photo-file');
  var logPhotoBtn = document.getElementById('log-photo-btn');
  var logPhotoName = document.getElementById('log-photo-name');

  // Backup Elements
  var backupExportJsonBtn = document.getElementById('backup-export-json-btn');
  var backupImportJsonBtn = document.getElementById('backup-import-json-btn');
  var backupImportFile = document.getElementById('backup-import-file');
  var backupExportCsvBtn = document.getElementById('backup-export-csv-btn');

  // Photo Modal Elements
  var photoModal = document.getElementById('photo-modal');
  var modalCloseBtn = document.getElementById('modal-close-btn');

  // Cover-up Toggle
  var coverupToggleBtn = document.getElementById('coverup-matrix-toggle-btn');
  var coverupContainer = document.getElementById('coverup-matrix-container');

  var currentSchedule = [];
  var lastCalculationData = null;
  var selectedPhotoFile = null;

  var PROFILES_KEY = 'poli_tattoo_profiles_v2';
  var ACTIVE_PROFILE_KEY = 'poli_tattoo_active_profile_id';
  var LEGACY_FADE_KEY = 'poli_tattoo_fade_log_v2';

  /**
   * Helper: Get local calendar date as YYYY-MM-DD (Ban 19)
   */
  function getLocalToday() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1);
    if (m.length < 2) m = '0' + m;
    var day = String(d.getDate());
    if (day.length < 2) day = '0' + day;
    return y + '-' + m + '-' + day;
  }

  /**
   * Format local date string for display (YYYY-MM-DD to readable local)
   */
  function formatLocalDate(isoStr) {
    if (!isoStr) return '';
    var parts = isoStr.split('-');
    if (parts.length !== 3) return isoStr;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    var dt = new Date(y, m, d);
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /**
   * Add weeks to a local date string (YYYY-MM-DD)
   */
  function addWeeksToLocalDate(isoStr, weeks) {
    var parts = isoStr.split('-');
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    var dt = new Date(y, m, d);
    dt.setDate(dt.getDate() + (weeks * 7));
    var resY = dt.getFullYear();
    var resM = String(dt.getMonth() + 1);
    if (resM.length < 2) resM = '0' + resM;
    var resD = String(dt.getDate());
    if (resD.length < 2) resD = '0' + resD;
    return resY + '-' + resM + '-' + resD;
  }

  /* ==========================================================================
     Profile Management Functions
     ========================================================================== */

  function createBlankProfile(id, name) {
    return {
      id: id || 'prof_' + Date.now(),
      name: name || i18n.t('profile.default_name'),
      goal: 'clearance',
      skin: '',
      loc: '',
      col: '',
      den: '',
      sca: '',
      lay: '',
      interval: '8',
      price: '',
      currency: '$',
      started: false,
      completed: '',
      faded: '',
      smoking: 'non',
      fadeLog: []
    };
  }

  function loadProfiles() {
    var raw = null;
    try {
      raw = localStorage.getItem(PROFILES_KEY);
    } catch (e) {}

    var list = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch (e) {}
    }

    if (!Array.isArray(list) || list.length === 0) {
      // Check for legacy fade log
      var legacyLog = [];
      try {
        var legRaw = localStorage.getItem(LEGACY_FADE_KEY);
        if (legRaw) legacyLog = JSON.parse(legRaw);
      } catch (e) {}

      var defaultProf = createBlankProfile('prof_1', 'Tattoo #1');
      if (Array.isArray(legacyLog) && legacyLog.length > 0) {
        defaultProf.fadeLog = legacyLog;
      }
      list = [defaultProf];
      saveProfiles(list);
    }
    return list;
  }

  function saveProfiles(list) {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function getActiveProfileId() {
    var id = null;
    try {
      id = localStorage.getItem(ACTIVE_PROFILE_KEY);
    } catch (e) {}
    var list = loadProfiles();
    if (id && list.some(function(p) { return p.id === id; })) {
      return id;
    }
    var fallbackId = list[0].id;
    setActiveProfileId(fallbackId);
    return fallbackId;
  }

  function setActiveProfileId(id) {
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    } catch (e) {}
  }

  function getActiveProfile() {
    var id = getActiveProfileId();
    var list = loadProfiles();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return list[0];
  }

  function updateActiveProfile(updaterFn) {
    var id = getActiveProfileId();
    var list = loadProfiles();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        updaterFn(list[i]);
        break;
      }
    }
    saveProfiles(list);
  }

  function syncActiveProfileFromForm() {
    var prof = getActiveProfile();
    if (!prof) return;

    var isCoverup = false;
    for (var g = 0; g < goalRadios.length; g++) {
      if (goalRadios[g].checked && goalRadios[g].value === 'coverup') {
        isCoverup = true;
        break;
      }
    }

    prof.goal = isCoverup ? 'coverup' : 'clearance';
    prof.skin = skinSelect.value;
    prof.loc = locationSelect.value;
    prof.col = colourSelect.value;
    prof.den = densitySelect.value;
    prof.sca = scarringSelect.value;
    prof.lay = layeringSelect.value;
    prof.interval = intervalInput.value;
    prof.price = priceInput.value;
    prof.currency = currencyInput.value;
    prof.started = startedCheckbox.checked;
    prof.completed = completedInput.value;
    prof.faded = fadeRatingInput.value;

    if (lifestyleSmoking) prof.smoking = lifestyleSmoking.value;

    updateActiveProfile(function(p) {
      for (var k in prof) {
        if (Object.prototype.hasOwnProperty.call(prof, k)) {
          p[k] = prof[k];
        }
      }
    });
  }

  function populateFormFromProfile(prof) {
    if (!prof) return;

    for (var g = 0; g < goalRadios.length; g++) {
      goalRadios[g].checked = (goalRadios[g].value === prof.goal);
    }

    skinSelect.value = prof.skin || '';
    locationSelect.value = prof.loc || '';
    colourSelect.value = prof.col || '';
    densitySelect.value = prof.den || '';
    scarringSelect.value = prof.sca || '';
    layeringSelect.value = prof.lay || '';

    intervalInput.value = prof.interval || '8';
    priceInput.value = prof.price || '';
    currencyInput.value = prof.currency || '$';
    startedCheckbox.checked = !!prof.started;
    completedInput.value = prof.completed || '';
    fadeRatingInput.value = prof.faded || '';

    if (lifestyleSmoking && prof.smoking) lifestyleSmoking.value = prof.smoking;

    updateStartedToggle();
    updateLocationGroupDescription();
  }

  function renderProfileSelect() {
    if (!profileSelect) return;
    var list = loadProfiles();
    var activeId = getActiveProfileId();

    profileSelect.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
      var opt = document.createElement('option');
      opt.value = list[i].id;
      opt.textContent = list[i].name;
      if (list[i].id === activeId) opt.selected = true;
      profileSelect.appendChild(opt);
    }
  }

  function handleProfileChange() {
    syncActiveProfileFromForm();
    var newId = profileSelect.value;
    setActiveProfileId(newId);
    var prof = getActiveProfile();
    populateFormFromProfile(prof);
    renderFadeLog();
    if (window.ClinicalFeatures && window.ClinicalFeatures.renderAftercareChecklist) {
      window.ClinicalFeatures.renderAftercareChecklist('aftercare-container', newId);
    }
    // Re-calculate if results were previously showing
    if (!results.hasAttribute('hidden')) {
      calculate();
    }
  }

  function handleNewProfile() {
    syncActiveProfileFromForm();
    var list = loadProfiles();
    var defaultName = 'Tattoo #' + (list.length + 1);
    var promptMsg = i18n.t('profile.prompt_new');
    var chosenName = window.prompt(promptMsg, defaultName);
    if (!chosenName || chosenName.trim() === '') return;

    var newProf = createBlankProfile('prof_' + Date.now(), chosenName.trim());
    list.push(newProf);
    saveProfiles(list);
    setActiveProfileId(newProf.id);

    renderProfileSelect();
    populateFormFromProfile(newProf);
    renderFadeLog();
    if (window.ClinicalFeatures && window.ClinicalFeatures.renderAftercareChecklist) {
      window.ClinicalFeatures.renderAftercareChecklist('aftercare-container', newProf.id);
    }
    results.setAttribute('hidden', '');
  }

  function handleRenameProfile() {
    var prof = getActiveProfile();
    if (!prof) return;
    var promptMsg = i18n.t('profile.prompt_rename');
    var newName = window.prompt(promptMsg, prof.name);
    if (!newName || newName.trim() === '') return;

    updateActiveProfile(function(p) {
      p.name = newName.trim();
    });
    renderProfileSelect();
  }

  function handleDeleteProfile() {
    var list = loadProfiles();
    if (list.length <= 1) {
      alert(i18n.t('profile.delete_min_alert'));
      return;
    }

    var prof = getActiveProfile();
    var confirmMsg = i18n.t('profile.confirm_delete', { name: prof.name });
    if (!window.confirm(confirmMsg)) return;

    // Delete associated photos in IndexedDB
    if (window.PhotoStore && window.PhotoStore.deleteProfilePhotos) {
      window.PhotoStore.deleteProfilePhotos(prof.id);
    }

    var remaining = list.filter(function(p) { return p.id !== prof.id; });
    saveProfiles(remaining);
    setActiveProfileId(remaining[0].id);

    renderProfileSelect();
    populateFormFromProfile(remaining[0]);
    renderFadeLog();
    if (window.ClinicalFeatures && window.ClinicalFeatures.renderAftercareChecklist) {
      window.ClinicalFeatures.renderAftercareChecklist('aftercare-container', remaining[0].id);
    }
    results.setAttribute('hidden', '');
  }

  /* ==========================================================================
     Clinical Helpers & Form Listeners
     ========================================================================== */

  /**
   * Fitzpatrick Phototype Guided Wizard
   */
  function updateFitzpatrickFromWizard() {
    var q1Val = sunBurnSelect.value;
    var q2Val = sunTanSelect.value;
    var badge = document.getElementById('skin-wizard-badge');

    if (!q1Val || !q2Val) {
      if (badge) badge.setAttribute('hidden', '');
      return;
    }

    var v1 = parseInt(q1Val, 10);
    var v2 = parseInt(q2Val, 10);
    var avg = Math.round((v1 + v2) / 2);
    if (avg < 1) avg = 1;
    if (avg > 6) avg = 6;

    skinSelect.value = String(avg);

    if (badge) {
      var romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
      badge.textContent = i18n.t('factor.skin.detected_result', { type: romanNumerals[avg - 1], pts: avg, unit: i18n.t(avg === 1 ? 'unit.pt' : 'unit.pts') });
      badge.removeAttribute('hidden');
    }
  }

  /**
   * Anatomical Location Dynamic Description
   */
  function updateLocationGroupDescription() {
    if (!locationSelect || !locationDesc) return;
    var val = locationSelect.value;
    if (!val) {
      locationDesc.setAttribute('hidden', '');
      locationDesc.textContent = '';
      return;
    }
    var key = 'factor.location.desc_group' + val;
    var translated = i18n.t(key);
    locationDesc.textContent = translated;
    locationDesc.removeAttribute('hidden');
  }

  /**
   * Started treatments toggle panel
   */
  function updateStartedToggle() {
    if (!startedCheckbox || !startedPanel) return;
    if (startedCheckbox.checked) {
      startedPanel.removeAttribute('hidden');
    } else {
      startedPanel.setAttribute('hidden', '');
    }
  }

  /**
   * Identify Dominant Kirby-Desai Factor
   */
  function getDominantFactor(skin, loc, col, den, sca, lay) {
    var factors = [
      { name: i18n.t('factor.skin.title'), pts: skin },
      { name: i18n.t('factor.location.title'), pts: loc },
      { name: i18n.t('factor.colour.title'), pts: col },
      { name: i18n.t('factor.density.title'), pts: den },
      { name: i18n.t('factor.scarring.title'), pts: sca },
      { name: i18n.t('factor.layering.title'), pts: lay }
    ];

    factors.sort(function(a, b) {
      return b.pts - a.pts;
    });

    var maxPts = factors[0].pts;
    var dominants = factors.filter(function(f) {
      return f.pts === maxPts;
    });

    var names = dominants.map(function(d) { return d.name; }).join(', ');
    return names + ' (+' + maxPts + ' ' + i18n.t('table.col_points') + ')';
  }

  /**
   * Input Validation
   */
  function validateInputs() {
    var errors = [];

    if (!skinSelect.value || !locationSelect.value || !colourSelect.value ||
        !densitySelect.value || !scarringSelect.value || !layeringSelect.value) {
      errors.push(i18n.t('err.all_factors_required'));
    }

    var rawInterval = intervalInput.value.trim();
    if (!rawInterval) {
      errors.push(i18n.t('err.interval_required'));
    } else {
      var numInterval = parseFloat(rawInterval);
      if (isNaN(numInterval) || numInterval < 2 || numInterval > 52) {
        errors.push(i18n.t('err.interval_range'));
      }
    }

    var rawPrice = priceInput.value.trim();
    if (rawPrice !== '') {
      var numPrice = parseFloat(rawPrice);
      if (isNaN(numPrice) || numPrice < 0) {
        errors.push(i18n.t('err.price_invalid'));
      }
    }

    if (startedCheckbox.checked) {
      var rawCompleted = completedInput.value.trim();
      if (rawCompleted !== '') {
        var numComp = parseInt(rawCompleted, 10);
        if (isNaN(numComp) || numComp < 0 || numComp > 100) {
          errors.push(i18n.t(numComp > 100 ? 'err.completed_too_high' : 'err.completed_invalid'));
        }
      }
      var rawFade = fadeRatingInput.value.trim();
      if (rawFade !== '') {
        var numFade = parseInt(rawFade, 10);
        if (isNaN(numFade) || numFade < 0 || numFade > 10) {
          errors.push(i18n.t('fadelog.err_rating_range'));
        }
      }
    }

    return errors;
  }

  /* ==========================================================================
     Main Calculation Engine
     ========================================================================== */

  function calculate() {
    var errors = validateInputs();
    var errContainer = document.getElementById('calc-errors');

    if (errors.length > 0) {
      var errHtml = '<ul class="error-list">';
      for (var e = 0; e < errors.length; e++) {
        errHtml += '<li>' + G.esc(errors[e]) + '</li>';
      }
      errHtml += '</ul>';
      errContainer.innerHTML = errHtml;
      errContainer.removeAttribute('hidden');
      errContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    errContainer.innerHTML = '';
    errContainer.setAttribute('hidden', '');

    // Read factor scores
    var skin = parseInt(skinSelect.value, 10);
    var loc = parseInt(locationSelect.value, 10);
    var col = parseInt(colourSelect.value, 10);
    var den = parseInt(densitySelect.value, 10);
    var sca = parseInt(scarringSelect.value, 10);
    var lay = parseInt(layeringSelect.value, 10);

    var totalScore = skin + loc + col + den + sca + lay;

    // The paper: score ~ session count (r = 0.757). The ±2.5 margin is ours, not the paper's.
    var minSessions = Math.max(1, Math.round(totalScore - 2.5));
    var maxSessions = Math.round(totalScore + 2.5);

    // Goal: Complete clearance vs Cover-up
    var isCoverup = false;
    for (var g = 0; g < goalRadios.length; g++) {
      if (goalRadios[g].checked && goalRadios[g].value === 'coverup') {
        isCoverup = true;
        break;
      }
    }

    var estMin = minSessions;
    var estMax = maxSessions;
    // Cover-up: no published fraction of sessions exists, so the full-removal range is shown
    // and the cover-up note says fewer are usually needed.

    // Circulation & Lifestyle Modifiers
    var smokingVal = (lifestyleSmoking && lifestyleSmoking.value) || 'non';
    // No session multiplier: Bencini 2012 measured the chance of success, not extra sessions.

    var intervalWeeks = parseFloat(intervalInput.value.trim());

    // Duration calculation: (sessions - 1) * intervalWeeks / 4.33 months
    var minDurationMonths = Math.round(((estMin - 1) * intervalWeeks / 4.33) * 10) / 10;
    var maxDurationMonths = Math.round(((estMax - 1) * intervalWeeks / 4.33) * 10) / 10;
    if (minDurationMonths < 0) minDurationMonths = 0;
    if (maxDurationMonths < 0) maxDurationMonths = 0;

    // Cost arithmetic
    var rawPrice = priceInput.value.trim();
    var pricePerSession = rawPrice !== '' ? parseFloat(rawPrice) : null;
    var curr = currencyInput.value.trim() || '$';

    // Sessions already completed
    var completedSessions = 0;
    var currentFadePct = 0;
    if (startedCheckbox.checked) {
      var rawComp = completedInput.value.trim();
      if (rawComp !== '') completedSessions = parseInt(rawComp, 10) || 0;
      var rawFade = fadeRatingInput.value.trim();
      if (rawFade !== '') currentFadePct = (parseInt(rawFade, 10) || 0) * 10;
    }
    var remainingMin = Math.max(0, estMin - completedSessions);
    var remainingMax = Math.max(0, estMax - completedSessions);

    // Save calculation data
    lastCalculationData = {
      skin: skin,
      loc: loc,
      col: col,
      den: den,
      sca: sca,
      lay: lay,
      totalScore: totalScore,
      isCoverup: isCoverup,
      estMin: estMin,
      estMax: estMax,
      smokingVal: smokingVal,
      intervalWeeks: intervalWeeks,
      minDurationMonths: minDurationMonths,
      maxDurationMonths: maxDurationMonths,
      pricePerSession: pricePerSession,
      currency: curr,
      completedSessions: completedSessions,
      currentFadePct: currentFadePct,
      remainingMin: remainingMin,
      remainingMax: remainingMax,
      dominantText: getDominantFactor(skin, loc, col, den, sca, lay)
    };

    syncActiveProfileFromForm();
    renderResults(lastCalculationData);
    generateCalendarSchedule(lastCalculationData);

    results.removeAttribute('hidden');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Render Calculation Results into DOM
   */
  function renderResults(data) {
    // 1. Primary figures
    var scoreDisplay = document.getElementById('res-score-value');
    if (scoreDisplay) scoreDisplay.textContent = String(data.totalScore);

    var sessionsDisplay = document.getElementById('res-sessions-value');
    if (sessionsDisplay) sessionsDisplay.textContent = data.estMin + '–' + data.estMax;

    var sessionsLabel = document.getElementById('res-sessions-heading');
    if (sessionsLabel) {
      sessionsLabel.textContent = i18n.t('results.sessions_label');
    }

    var timelineDisplay = document.getElementById('res-timeline-value');
    if (timelineDisplay) {
      var moStr = i18n.t('unit.mo');
      timelineDisplay.textContent = data.minDurationMonths === data.maxDurationMonths
        ? data.minDurationMonths + ' ' + moStr
        : data.minDurationMonths + '–' + data.maxDurationMonths + ' ' + moStr;
    }

    // Cover-up alert badge
    var coverupBadge = document.getElementById('res-coverup-notice');
    if (coverupBadge) {
      if (data.isCoverup) {
        coverupBadge.removeAttribute('hidden');
      } else {
        coverupBadge.setAttribute('hidden', '');
      }
    }

    // High-score referral notice: the paper's own stated threshold (>15 points)
    var referralNotice = document.getElementById('res-referral-notice');
    if (referralNotice) {
      if (data.totalScore > 15) {
        referralNotice.removeAttribute('hidden');
      } else {
        referralNotice.setAttribute('hidden', '');
      }
    }

    // Dominant factor
    var dominantDisplay = document.getElementById('res-dominant-text');
    if (dominantDisplay) dominantDisplay.textContent = data.dominantText;

    // Smoking note (no session multiplier)
    var lifestyleBlock = document.getElementById('res-lifestyle-block');
    var lifestyleText = document.getElementById('res-lifestyle-text');
    if (lifestyleBlock) {
      if (data.smokingVal === 'active') {
        lifestyleBlock.removeAttribute('hidden');
        if (lifestyleText) lifestyleText.textContent = i18n.t('lifestyle.smoking_hint');
      } else {
        lifestyleBlock.setAttribute('hidden', '');
      }
    }

    // Cost block
    var costBlock = document.getElementById('res-cost-block');
    var costValue = document.getElementById('res-cost-value');
    var costDesc = document.getElementById('res-cost-desc');
    if (data.pricePerSession !== null && !isNaN(data.pricePerSession) && data.pricePerSession > 0) {
      var minCost = Math.round(data.estMin * data.pricePerSession);
      var maxCost = Math.round(data.estMax * data.pricePerSession);
      if (costValue) costValue.textContent = data.currency + minCost.toLocaleString() + ' – ' + data.currency + maxCost.toLocaleString();
      if (costDesc) costDesc.textContent = i18n.t('results.cost_disclaimer', { price: data.currency + data.pricePerSession.toLocaleString() });
      if (costBlock) costBlock.removeAttribute('hidden');
    } else {
      if (costBlock) costBlock.setAttribute('hidden', '');
    }

    // Remaining sessions block
    var remainingBlock = document.getElementById('res-remaining-block');
    var remainingValue = document.getElementById('res-remaining-value');
    var remainingDesc = document.getElementById('res-remaining-desc');
    if (data.completedSessions > 0) {
      if (remainingValue) remainingValue.textContent = data.remainingMin + '–' + data.remainingMax;
      if (remainingDesc) remainingDesc.textContent = i18n.t('results.remaining_desc', { completed: data.completedSessions });
      if (remainingBlock) remainingBlock.removeAttribute('hidden');
    } else {
      if (remainingBlock) remainingBlock.setAttribute('hidden', '');
    }

    // Factor Breakdown Table
    renderBreakdownTable(data);

    // Advanced Clinical Features: Trajectory, Cover-Up Matrix
    if (window.ClinicalFeatures) {
      if (window.ClinicalFeatures.renderTrajectoryChart) {
        window.ClinicalFeatures.renderTrajectoryChart(
          'trajectory-chart-container',
          data.estMin,
          data.estMax,
          data.completedSessions,
          data.currentFadePct,
          data.intervalWeeks,
          data.totalScore
        );
      }
      if (window.ClinicalFeatures.renderCoverupMatrix) {
        window.ClinicalFeatures.renderCoverupMatrix('coverup-matrix-container');
      }
    }
  }

  /**
   * Render Factor Breakdown Table
   */
  function renderBreakdownTable(data) {
    var tableBody = document.getElementById('res-breakdown-body');
    if (!tableBody) return;

    var rows = [
      {
        name: i18n.t('factor.skin.title'),
        val: skinSelect.options[skinSelect.selectedIndex].text,
        pts: data.skin
      },
      {
        name: i18n.t('factor.location.title'),
        val: locationSelect.options[locationSelect.selectedIndex].text,
        pts: data.loc
      },
      {
        name: i18n.t('factor.colour.title'),
        val: colourSelect.options[colourSelect.selectedIndex].text,
        pts: data.col
      },
      {
        name: i18n.t('factor.density.title'),
        val: densitySelect.options[densitySelect.selectedIndex].text,
        pts: data.den
      },
      {
        name: i18n.t('factor.scarring.title'),
        val: scarringSelect.options[scarringSelect.selectedIndex].text,
        pts: data.sca
      },
      {
        name: i18n.t('factor.layering.title'),
        val: layeringSelect.options[layeringSelect.selectedIndex].text,
        pts: data.lay
      }
    ];

    var html = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      html += '<tr>' +
        '<td><strong>' + G.esc(r.name) + '</strong></td>' +
        '<td>' + G.esc(r.val) + '</td>' +
        '<td class="pts-cell">+' + r.pts + '</td>' +
      '</tr>';
    }

    html += '<tr class="total-row">' +
      '<td colspan="2"><strong>' + G.esc(i18n.t('table.total_row')) + '</strong></td>' +
      '<td class="pts-cell"><strong>' + data.totalScore + '</strong></td>' +
    '</tr>';

    tableBody.innerHTML = html;

    var tableFormula = document.getElementById('res-table-formula');
    if (tableFormula) {
      tableFormula.textContent = i18n.t('table.formula_note', {
        s: data.skin,
        l: data.loc,
        c: data.col,
        a: data.den,
        sc: data.sca,
        ly: data.lay,
        total: data.totalScore
      });
    }

    var estFormula = document.getElementById('res-estimate-formula');
    if (estFormula) {
      if (data.isCoverup) {
        estFormula.textContent = i18n.t('table.formula_coverup', {
          total: data.totalScore,
          min: data.estMin,
          max: data.estMax
        });
      } else {
        estFormula.textContent = i18n.t('table.estimate_formula', {
          total: data.totalScore,
          min: data.estMin,
          max: data.estMax
        });
      }
    }
  }

  /**
   * Generate Projected Session Schedule Calendar Table
   */
  function generateCalendarSchedule(data) {
    var calBody = document.getElementById('calendar-schedule-body');
    if (!calBody) return;

    var startDateVal = (startDateInput && startDateInput.value) ? startDateInput.value : getLocalToday();
    var sessionCount = data.estMax;
    currentSchedule = [];

    var html = '';
    for (var i = 1; i <= sessionCount; i++) {
      var sessionDate = addWeeksToLocalDate(startDateVal, (i - 1) * data.intervalWeeks);
      var isCompleted = i <= data.completedSessions;
      var statusText = isCompleted ? i18n.t('calendar.status_completed') : i18n.t('calendar.status_projected');
      var statusCls = isCompleted ? 'badge-status-done' : 'badge-status-proj';

      currentSchedule.push({
        num: i,
        date: sessionDate,
        isCompleted: isCompleted
      });

      html += '<tr>' +
        '<td><strong>' + G.esc(i18n.t('calendar.session_row', { num: i })) + '</strong></td>' +
        '<td>' + G.esc(formatLocalDate(sessionDate)) + '</td>' +
        '<td>' + G.esc(i === 1 ? i18n.t('calendar.interval_start') : i18n.t('calendar.interval_weeks', { weeks: data.intervalWeeks })) + '</td>' +
        '<td><span class="' + statusCls + '">' + G.esc(statusText) + '</span></td>' +
      '</tr>';
    }

    calBody.innerHTML = html;
  }

  /**
   * Export RFC 5545 .ics Calendar File (Pure In-Browser Blob)
   */
  function exportIcsFile() {
    if (!currentSchedule || currentSchedule.length === 0) return;

    var events = [];
    for (var i = 0; i < currentSchedule.length; i++) {
      var item = currentSchedule[i];
      if (item.isCompleted) continue; // Only export future projected appointments

      var dParts = item.date.split('-');
      var dtStr = dParts[0] + dParts[1] + dParts[2];

      events.push(
        'BEGIN:VEVENT\r\n' +
        'UID:tattoo-removal-session-' + item.num + '-' + Date.now() + '@poliinternational.com\r\n' +
        'DTSTAMP:' + dtStr + 'T090000Z\r\n' +
        'DTSTART;VALUE=DATE:' + dtStr + '\r\n' +
        'SUMMARY:' + i18n.t('calendar.ics_summary', { num: item.num }) + '\r\n' +
        'DESCRIPTION:' + i18n.t('calendar.ics_description', { num: item.num, interval: (lastCalculationData ? lastCalculationData.intervalWeeks : 8) }) + '\r\n' +
        'STATUS:TENTATIVE\r\n' +
        'END:VEVENT'
      );
    }

    if (events.length === 0) {
      alert(i18n.t('calendar.ics_completed_alert'));
      return;
    }

    var icsData =
      'BEGIN:VCALENDAR\r\n' +
      'VERSION:2.0\r\n' +
      'PRODID:-//Poli International//Tattoo Removal Sessions Estimator//EN\r\n' +
      'CALSCALE:GREGORIAN\r\n' +
      'METHOD:PUBLISH\r\n' +
      events.join('\r\n') + '\r\n' +
      'END:VCALENDAR\r\n';

    var blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tattoo-removal-schedule.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ==========================================================================
     Fade Log & Photo Operations
     ========================================================================== */

  function renderFadeLog() {
    var prof = getActiveProfile();
    var entries = (prof && Array.isArray(prof.fadeLog)) ? prof.fadeLog : [];
    if (!logTableBody) return;

    if (entries.length === 0) {
      logTableBody.innerHTML = '';
      if (logEmptyMsg) logEmptyMsg.removeAttribute('hidden');
      return;
    }

    if (logEmptyMsg) logEmptyMsg.setAttribute('hidden', '');

    var html = '';
    for (var i = 0; i < entries.length; i++) {
      var item = entries[i];
      var photoCol = '<span class="text-muted text-sm"> - </span>';
      if (item.hasPhoto) {
        photoCol = '<button type="button" class="view-photo-btn secondary-btn text-sm" data-session="' + (i + 1) + '">' + i18n.t('photo.view_btn') + '</button>';
      }

      html += '<tr data-index="' + i + '">' +
        '<td><strong>#' + (i + 1) + '</strong></td>' +
        '<td>' + G.esc(formatLocalDate(item.date)) + '</td>' +
        '<td><span class="rating-badge">' + G.esc(item.rating) + ' / 10</span></td>' +
        '<td>' + photoCol + '</td>' +
        '<td>' + G.esc(item.note || ' - ') + '</td>' +
        '<td class="no-print"><button type="button" class="del-log-btn danger-text-btn" data-index="' + i + '">' + i18n.t('fadelog.delete') + '</button></td>' +
      '</tr>';
    }

    logTableBody.innerHTML = html;

    // Attach delete listeners
    var delBtns = logTableBody.querySelectorAll('.del-log-btn');
    for (var d = 0; d < delBtns.length; d++) {
      delBtns[d].addEventListener('click', function(e) {
        var idx = parseInt(e.target.getAttribute('data-index'), 10);
        deleteFadeLogEntry(idx);
      });
    }

    // Attach photo view listeners
    var viewBtns = logTableBody.querySelectorAll('.view-photo-btn');
    for (var v = 0; v < viewBtns.length; v++) {
      viewBtns[v].addEventListener('click', function(e) {
        var sess = parseInt(e.target.getAttribute('data-session'), 10);
        var activeProf = getActiveProfile();
        if (activeProf && window.ClinicalFeatures && window.ClinicalFeatures.openPhotoModal) {
          window.ClinicalFeatures.openPhotoModal(activeProf.id, 1, sess);
        }
      });
    }
  }

  function updateDynamicCost() {
    var rawPrice = priceInput ? priceInput.value.trim() : '';
    var pricePerSession = rawPrice !== '' ? parseFloat(rawPrice) : null;
    var curr = (currencyInput ? currencyInput.value.trim() : '') || '$';

    var costBlock = document.getElementById('res-cost-block');
    var costValue = document.getElementById('res-cost-value');
    var costDesc = document.getElementById('res-cost-desc');

    if (!lastCalculationData) {
      return;
    }

    lastCalculationData.pricePerSession = pricePerSession;
    lastCalculationData.currency = curr;

    if (pricePerSession !== null && !isNaN(pricePerSession) && pricePerSession > 0) {
      var minCost = Math.round(lastCalculationData.estMin * pricePerSession);
      var maxCost = Math.round(lastCalculationData.estMax * pricePerSession);
      if (costValue) costValue.textContent = curr + minCost.toLocaleString() + ' – ' + curr + maxCost.toLocaleString();
      if (costDesc) costDesc.textContent = i18n.t('results.cost_disclaimer', { price: curr + pricePerSession.toLocaleString() });
      if (costBlock) costBlock.removeAttribute('hidden');
    } else {
      if (costBlock) costBlock.setAttribute('hidden', '');
    }
  }

  function addFadeLogEntry() {
    var dateVal = logDateInput.value.trim() || getLocalToday();
    var ratingVal = logRatingInput.value.trim();
    var noteVal = logNoteInput.value.trim();

    if (ratingVal === '') {
      alert(i18n.t('fadelog.err_rating_required'));
      return;
    }
    var ratingNum = parseInt(ratingVal, 10);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      alert(i18n.t('fadelog.err_rating_range'));
      return;
    }

    var fileToSave = selectedPhotoFile;
    selectedPhotoFile = null;
    if (logPhotoFile) logPhotoFile.value = '';
    if (logPhotoName) logPhotoName.textContent = '';

    function saveEntryWithPhotoFlag(hasPhoto) {
      updateActiveProfile(function(p) {
        if (!Array.isArray(p.fadeLog)) p.fadeLog = [];
        p.fadeLog.push({
          date: dateVal,
          rating: ratingNum,
          note: noteVal,
          hasPhoto: hasPhoto
        });
      });
      renderFadeLog();
      logRatingInput.value = '';
      logNoteInput.value = '';
    }

    if (fileToSave && window.PhotoStore && window.PhotoStore.compressImage) {
      var nextSessionNum = (getActiveProfile().fadeLog || []).length + 1;
      window.PhotoStore.compressImage(fileToSave, 800, 800, 0.8)
        .then(function(dataUrl) {
          return window.PhotoStore.savePhoto(getActiveProfile().id, nextSessionNum, dataUrl);
        })
        .then(function() {
          saveEntryWithPhotoFlag(true);
        })
        .catch(function() {
          saveEntryWithPhotoFlag(false);
        });
    } else {
      saveEntryWithPhotoFlag(false);
    }
  }

  function deleteFadeLogEntry(index) {
    var prof = getActiveProfile();
    if (!prof || !Array.isArray(prof.fadeLog)) return;
    if (index >= 0 && index < prof.fadeLog.length) {
      var sessNum = index + 1;
      if (window.PhotoStore && window.PhotoStore.deletePhoto) {
        window.PhotoStore.deletePhoto(prof.id, sessNum);
      }
      updateActiveProfile(function(p) {
        p.fadeLog.splice(index, 1);
      });
      renderFadeLog();
    }
  }

  /* ==========================================================================
     Reset, Print, and UI Actions
     ========================================================================== */

  function resetForm() {
    form.reset();
    var badge = document.getElementById('skin-wizard-badge');
    if (badge) badge.setAttribute('hidden', '');
    if (locationDesc) locationDesc.setAttribute('hidden', '');
    startedPanel.setAttribute('hidden', '');
    results.setAttribute('hidden', '');
    var errContainer = document.getElementById('calc-errors');
    if (errContainer) {
      errContainer.innerHTML = '';
      errContainer.setAttribute('hidden', '');
    }
    lastCalculationData = null;
    currentSchedule = [];
  }

  function printSheet() {
    if (!lastCalculationData) {
      calculate();
    }
    window.print();
  }

  function setupLanguage() {
    if (!langSelect) return;
    langSelect.value = i18n.getLanguage();
    langSelect.addEventListener('change', function() {
      i18n.setLanguage(langSelect.value, function() {
        i18n.translatePage();
        updateLocationGroupDescription();
        renderProfileSelect();
        if (lastCalculationData) {
          lastCalculationData.dominantText = getDominantFactor(
            lastCalculationData.skin,
            lastCalculationData.loc,
            lastCalculationData.col,
            lastCalculationData.den,
            lastCalculationData.sca,
            lastCalculationData.lay
          );
          renderResults(lastCalculationData);
          generateCalendarSchedule(lastCalculationData);
        }
        renderFadeLog();
        if (window.ClinicalFeatures && window.ClinicalFeatures.renderAftercareChecklist) {
          window.ClinicalFeatures.renderAftercareChecklist('aftercare-container', getActiveProfileId());
        }
        var faqToggleBtn = document.getElementById('faq-toggle-all-btn');
        var faqToggleText = document.getElementById('faq-toggle-all-text');
        if (faqToggleBtn && faqToggleText) {
          var isExpand = faqToggleBtn.getAttribute('data-action') === 'expand';
          faqToggleText.textContent = isExpand ? i18n.t('faq.expand_all') : i18n.t('faq.collapse_all');
        }
      });
    });
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  function init() {
    i18n.initLanguage(function() {
      i18n.translatePage();
      setupLanguage();
      renderProfileSelect();
      populateFormFromProfile(getActiveProfile());
      renderFadeLog();
      if (window.ClinicalFeatures && window.ClinicalFeatures.renderAftercareChecklist) {
        window.ClinicalFeatures.renderAftercareChecklist('aftercare-container', getActiveProfileId());
      }
    });

    if (startDateInput && !startDateInput.value) {
      startDateInput.value = getLocalToday();
    }
    if (logDateInput && !logDateInput.value) {
      logDateInput.value = getLocalToday();
    }

    // Profile Listeners
    if (profileSelect) profileSelect.addEventListener('change', handleProfileChange);
    if (profileNewBtn) profileNewBtn.addEventListener('click', handleNewProfile);
    if (profileRenameBtn) profileRenameBtn.addEventListener('click', handleRenameProfile);
    if (profileDeleteBtn) profileDeleteBtn.addEventListener('click', handleDeleteProfile);

    // Form Action Listeners
    if (calcBtn) calcBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', resetForm);
    if (printBtn) printBtn.addEventListener('click', printSheet);
    if (exportIcsBtn) exportIcsBtn.addEventListener('click', exportIcsFile);
    if (logAddBtn) logAddBtn.addEventListener('click', addFadeLogEntry);

    // Dynamic field wizards
    if (sunBurnSelect) sunBurnSelect.addEventListener('change', updateFitzpatrickFromWizard);
    if (sunTanSelect) sunTanSelect.addEventListener('change', updateFitzpatrickFromWizard);
    if (locationSelect) locationSelect.addEventListener('change', updateLocationGroupDescription);
    if (startedCheckbox) startedCheckbox.addEventListener('change', updateStartedToggle);

    if (startDateInput) {
      startDateInput.addEventListener('change', function() {
        if (lastCalculationData) generateCalendarSchedule(lastCalculationData);
      });
    }

    // Photo selection
    if (logPhotoBtn && logPhotoFile) {
      logPhotoBtn.addEventListener('click', function() {
        logPhotoFile.click();
      });
      logPhotoFile.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          selectedPhotoFile = e.target.files[0];
          if (logPhotoName) logPhotoName.textContent = selectedPhotoFile.name;
        }
      });
    }

    // Photo Modal & Viewer
    var openPhotoViewerBtn = document.getElementById('open-photo-viewer-btn');
    if (openPhotoViewerBtn) {
      openPhotoViewerBtn.addEventListener('click', function() {
        var activeProf = getActiveProfile();
        if (activeProf && window.ClinicalFeatures && window.ClinicalFeatures.openPhotoModal) {
          window.ClinicalFeatures.openPhotoModal(activeProf.id, 1, null);
        }
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', function() {
        if (window.ClinicalFeatures && window.ClinicalFeatures.closePhotoModal) {
          window.ClinicalFeatures.closePhotoModal();
        }
      });
    }

    var modalCloseBtnBottom = document.getElementById('modal-close-btn-bottom');
    if (modalCloseBtnBottom) {
      modalCloseBtnBottom.addEventListener('click', function() {
        if (window.ClinicalFeatures && window.ClinicalFeatures.closePhotoModal) {
          window.ClinicalFeatures.closePhotoModal();
        }
      });
    }

    // Dynamic Price & Cost Calculation Listeners
    if (priceInput) {
      priceInput.addEventListener('input', updateDynamicCost);
      priceInput.addEventListener('change', updateDynamicCost);
    }
    if (currencyInput) {
      currencyInput.addEventListener('change', updateDynamicCost);
    }

    // Dynamic update when goal or interval changes
    for (var g = 0; g < goalRadios.length; g++) {
      goalRadios[g].addEventListener('change', function() {
        if (lastCalculationData) {
          calculate();
        }
      });
    }
    if (intervalInput) {
      intervalInput.addEventListener('change', function() {
        if (lastCalculationData) {
          calculate();
        }
      });
    }

    // Cover-up Matrix Toggle
    if (coverupToggleBtn && coverupContainer) {
      coverupToggleBtn.addEventListener('click', function() {
        var isHidden = coverupContainer.hasAttribute('hidden');
        if (isHidden) {
          coverupContainer.removeAttribute('hidden');
        } else {
          coverupContainer.setAttribute('hidden', '');
        }
      });
    }

    // Backup and Restore
    if (backupExportJsonBtn) {
      backupExportJsonBtn.addEventListener('click', function() {
        if (window.ClinicalFeatures) {
          window.ClinicalFeatures.exportFullBackupJSON(getActiveProfileId());
        }
      });
    }

    if (backupImportJsonBtn && backupImportFile) {
      backupImportJsonBtn.addEventListener('click', function() {
        backupImportFile.click();
      });
      backupImportFile.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0] && window.ClinicalFeatures) {
          window.ClinicalFeatures.importFullBackupJSON(e.target.files[0], function(err) {
            if (!err) {
              renderProfileSelect();
              populateFormFromProfile(getActiveProfile());
              renderFadeLog();
              if (window.ClinicalFeatures) {
                window.ClinicalFeatures.renderAftercareChecklist('aftercare-container', getActiveProfileId());
              }
              if (lastCalculationData) calculate();
            }
            backupImportFile.value = '';
          });
        }
      });
    }

    if (backupExportCsvBtn) {
      backupExportCsvBtn.addEventListener('click', function() {
        if (window.ClinicalFeatures) {
          window.ClinicalFeatures.exportFadeLogCSV(getActiveProfile());
        }
      });
    }

    // FAQ Section Expand/Collapse All, Smooth Transitions & Deep Linking
    var faqToggleBtn = document.getElementById('faq-toggle-all-btn');
    var faqItems = document.querySelectorAll('#faq-section .faq-item');
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isSyncingToggleAll = false;

    // Toast notification for permalink copy
    var faqToastEl = null;
    var faqToastTimeout = null;
    function showFaqToast(msg) {
      if (!faqToastEl) {
        faqToastEl = document.createElement('div');
        faqToastEl.className = 'faq-toast-notification';
        faqToastEl.setAttribute('role', 'status');
        faqToastEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(faqToastEl);
      }
      faqToastEl.innerHTML = '<svg class=ti-i width=1.15em height=1.15em aria-hidden=true style=vertical-align:-.18em;flex:none><use href=../shared/icons.svg#i-check></use></svg> ' + msg;
      faqToastEl.classList.add('is-visible');
      clearTimeout(faqToastTimeout);
      faqToastTimeout = setTimeout(function() {
        if (faqToastEl) faqToastEl.classList.remove('is-visible');
      }, 2600);
    }

    function expandFaqItem(item, answer, onComplete) {
      item.classList.add('is-expanding');
      item.classList.remove('is-collapsing');
      item.open = true;
      var targetHeight = answer.offsetHeight;

      if (prefersReducedMotion || typeof item.animate !== 'function') {
        item.classList.remove('is-expanding');
        if (onComplete) onComplete();
        return;
      }

      var anim = answer.animate([
        { height: '0px', opacity: 0, overflow: 'hidden' },
        { height: targetHeight + 'px', opacity: 1, overflow: 'hidden' }
      ], {
        duration: 260,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      });

      item._faqAnimation = anim;
      anim.onfinish = function() {
        item.classList.remove('is-expanding');
        item._faqAnimation = null;
        if (onComplete) onComplete();
      };
      anim.oncancel = function() {
        item.classList.remove('is-expanding');
        item._faqAnimation = null;
      };
    }

    function collapseFaqItem(item, answer, onComplete) {
      item.classList.add('is-collapsing');
      item.classList.remove('is-expanding');
      var startHeight = answer.offsetHeight;

      if (prefersReducedMotion || typeof item.animate !== 'function') {
        item.open = false;
        item.classList.remove('is-collapsing');
        if (onComplete) onComplete();
        return;
      }

      var anim = answer.animate([
        { height: startHeight + 'px', opacity: 1, overflow: 'hidden' },
        { height: '0px', opacity: 0, overflow: 'hidden' }
      ], {
        duration: 220,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      });

      item._faqAnimation = anim;
      anim.onfinish = function() {
        item.open = false;
        item.classList.remove('is-collapsing');
        item._faqAnimation = null;
        if (onComplete) onComplete();
      };
      anim.oncancel = function() {
        item.classList.remove('is-collapsing');
        item._faqAnimation = null;
      };
    }

    function updateFaqToggleBtnState() {
      if (isSyncingToggleAll || !faqToggleBtn) return;
      var items = document.querySelectorAll('#faq-section .faq-item');
      if (!items || items.length === 0) return;
      var allOpen = true;
      for (var i = 0; i < items.length; i++) {
        if (!items[i].open) {
          allOpen = false;
          break;
        }
      }
      var txtEl = document.getElementById('faq-toggle-all-text');
      if (allOpen) {
        faqToggleBtn.setAttribute('data-action', 'collapse');
        faqToggleBtn.setAttribute('aria-expanded', 'true');
        if (txtEl) txtEl.textContent = i18n.t('faq.collapse_all');
      } else {
        faqToggleBtn.setAttribute('data-action', 'expand');
        faqToggleBtn.setAttribute('aria-expanded', 'false');
        if (txtEl) txtEl.textContent = i18n.t('faq.expand_all');
      }
    }

    // Attach smooth toggle click handler to each FAQ summary
    faqItems.forEach(function(item) {
      var summary = item.querySelector('.faq-summary');
      var answer = item.querySelector('.faq-answer');
      if (!summary || !answer) return;

      summary.addEventListener('click', function(e) {
        if (e.target.closest('.faq-permalink')) return;

        if (prefersReducedMotion || typeof item.animate !== 'function') {
          return; // Let browser default handle it
        }

        e.preventDefault();

        if (item._faqAnimation) {
          item._faqAnimation.cancel();
        }

        if (item.open) {
          collapseFaqItem(item, answer, updateFaqToggleBtnState);
        } else {
          expandFaqItem(item, answer, updateFaqToggleBtnState);
        }
      });

      item.addEventListener('toggle', updateFaqToggleBtnState);
    });

    // Deep linking handler: check URL hash (e.g., #faq-q1) and open corresponding details element
    function handleFaqDeepLink(hash, isInitial) {
      var rawHash = hash || window.location.hash;
      if (!rawHash) return;
      var targetId = rawHash.replace(/^#/, '');
      var targetItem = document.getElementById(targetId);

      if (targetItem && targetItem.classList.contains('faq-item')) {
        var answer = targetItem.querySelector('.faq-answer');
        if (!targetItem.open) {
          if (isInitial || prefersReducedMotion || typeof targetItem.animate !== 'function') {
            targetItem.open = true;
          } else if (answer) {
            expandFaqItem(targetItem, answer);
          } else {
            targetItem.open = true;
          }
        }

        // Highlight element with pulse effect
        targetItem.classList.remove('faq-highlight-pulse');
        void targetItem.offsetWidth; // force reflow
        targetItem.classList.add('faq-highlight-pulse');

        // Scroll into view
        setTimeout(function() {
          targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, isInitial ? 180 : 50);

        setTimeout(function() {
          targetItem.classList.remove('faq-highlight-pulse');
        }, 2500);

        updateFaqToggleBtnState();
      }
    }

    // Permalink anchor click handler
    document.querySelectorAll('#faq-section .faq-permalink').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var href = link.getAttribute('href');
        var targetId = href ? href.replace(/^#/, '') : '';
        var targetItem = document.getElementById(targetId);

        if (targetItem) {
          var answer = targetItem.querySelector('.faq-answer');
          if (!targetItem.open) {
            if (answer && !prefersReducedMotion && typeof targetItem.animate === 'function') {
              expandFaqItem(targetItem, answer, updateFaqToggleBtnState);
            } else {
              targetItem.open = true;
              updateFaqToggleBtnState();
            }
          }

          targetItem.classList.remove('faq-highlight-pulse');
          void targetItem.offsetWidth;
          targetItem.classList.add('faq-highlight-pulse');
          targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', '#' + targetId);
          } else {
            window.location.hash = targetId;
          }

          var fullUrl = window.location.origin + window.location.pathname + window.location.search + '#' + targetId;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(fullUrl).then(function() {
              showFaqToast(i18n.t('faq.link_copied') || 'Link copied to clipboard');
            }).catch(function() {
              showFaqToast(i18n.t('faq.link_copied') || 'Link copied to clipboard');
            });
          }
        }
      });
    });

    // Expand/Collapse All button handler
    if (faqToggleBtn) {
      faqToggleBtn.addEventListener('click', function() {
        var isExpand = faqToggleBtn.getAttribute('data-action') === 'expand';
        var items = document.querySelectorAll('#faq-section .faq-item');
        isSyncingToggleAll = true;

        for (var f = 0; f < items.length; f++) {
          var item = items[f];
          var ans = item.querySelector('.faq-answer');
          if (isExpand) {
            if (!item.open) {
              if (ans && !prefersReducedMotion && typeof item.animate === 'function') {
                expandFaqItem(item, ans);
              } else {
                item.open = true;
              }
            }
          } else {
            if (item.open) {
              if (ans && !prefersReducedMotion && typeof item.animate === 'function') {
                collapseFaqItem(item, ans);
              } else {
                item.open = false;
              }
            }
          }
        }

        isSyncingToggleAll = false;
        faqToggleBtn.setAttribute('data-action', isExpand ? 'collapse' : 'expand');
        faqToggleBtn.setAttribute('aria-expanded', isExpand ? 'true' : 'false');
        var txtEl = document.getElementById('faq-toggle-all-text');
        if (txtEl) {
          txtEl.textContent = isExpand ? i18n.t('faq.collapse_all') : i18n.t('faq.expand_all');
        }
      });
    }

    // Check deep linking on initial page load
    handleFaqDeepLink(window.location.hash, true);

    // Listen for hashchange events
    window.addEventListener('hashchange', function() {
      handleFaqDeepLink(window.location.hash, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API for testing
  window.TattooRemovalV2 = {
    calculate: calculate,
    validateInputs: validateInputs,
    getDominantFactor: getDominantFactor,
    loadProfiles: loadProfiles,
    saveProfiles: saveProfiles,
    getActiveProfile: getActiveProfile,
    addWeeksToLocalDate: addWeeksToLocalDate,
    getLocalToday: getLocalToday
  };

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
