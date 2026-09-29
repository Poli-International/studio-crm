/**
 * Piercing Angle & Depth Guide - Interactive Clinical Controller
 * Standards: ASTM F-136, ASTM F-138, ASTM F-67, BioFlex® body jewelry.
 */

(function () {
  'use strict';

  // Global database references
  var piercingData = (typeof window !== 'undefined' && window.PIERCING_DATA) || {};
  var jewelryOptions = (typeof window !== 'undefined' && window.PIERCING_JEWELRY_OPTIONS) || {};

  // Dedicated Architecture Modules
  var storage = (typeof window !== 'undefined' && window.PiercingStorageManager) || {};
  var calculator = (typeof window !== 'undefined' && window.PiercingCalculator) || {};
  var uiController = (typeof window !== 'undefined' && window.PiercingUIController) || {};

  // Active studio preferences storage delegation
  function getStudioPreferences() {
    return storage.getStudioPreferences ? storage.getStudioPreferences() : {};
  }

  function saveStudioPreference(piercingKey, prefData) {
    if (storage.saveStudioPreference) {
      storage.saveStudioPreference(piercingKey, prefData);
    }
  }

  function resetStudioPreference(piercingKey) {
    if (storage.resetStudioPreference) {
      storage.resetStudioPreference(piercingKey);
    }
  }


  // Modular UI Logic Delegations
  var visualizer = (typeof window !== 'undefined' && window.PiercingVisualizer) || {};

  var getActiveJewelryOption = visualizer.getActiveJewelryOption || (window.getActiveJewelryOption || function() { return null; });
  var renderJewelry3D = visualizer.renderJewelry3D || (window.renderJewelry3D || function() { return ''; });
  var calculateChannelMetrics = visualizer.calculateChannelMetrics || (window.calculateChannelMetrics || function() { return {}; });
  var renderV2InteractiveSvg = visualizer.renderV2InteractiveSvg || (window.renderV2InteractiveSvg || function() { return ''; });
  var renderErrorModeSvg = visualizer.renderErrorModeSvg || (window.renderErrorModeSvg || function() { return ''; });
  var renderSymmetrySvg = visualizer.renderSymmetrySvg || (window.renderSymmetrySvg || function() { return ''; });
  var renderSymmetryLandmarkSvg = visualizer.renderSymmetryLandmarkSvg || (window.renderSymmetryLandmarkSvg || function() { return ''; });
  var getSymmetryStepsData = visualizer.getSymmetryStepsData || (window.getSymmetryStepsData || function() { return []; });
  // Translate with an English fallback; a returned key counts as missing.
  function tr(key, params, fallback) {
    var v = window.translate ? window.translate(key, params, fallback) : fallback;
    return (v === key || v === undefined) ? interpolateFallback(fallback, params) : v;
  }
  function interpolateFallback(s, params) {
    return String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, function (m, k) { return params && Object.prototype.hasOwnProperty.call(params, k) ? params[k] : m; });
  }

  function initApp() {
    // Persistent Workspace State Variables
    var activePiercingKey = 'earlobe';
    var currentVisualizerAngle = 90;
    var currentMeasuredThickness = 5.0;
    var activeJewelryOptionId = null;
    var currentUnit = 'metric'; // 'metric' | 'imperial'
    var isCompareMode = false;
    var comparePiercingKeyA = 'earlobe';
    var comparePiercingKeyB = 'helix';
    var recentPiercings = []; // Array of up to 5 recently interacted piercing keys

    // Unit Conversion Utilities Delegated to Calculator Module
    function getFractionalInch(mm) {
      if (calculator.getFractionalInch) {
        return calculator.getFractionalInch(mm);
      }
      var val = parseFloat(mm);
      return isNaN(val) ? '' : (val / 25.4).toFixed(3) + '"';
    }

    function formatMm(mm, showDual) {
      if (calculator.formatMm) {
        return calculator.formatMm(mm, showDual, currentUnit);
      }
      var val = parseFloat(mm);
      return isNaN(val) ? String(mm) : val.toFixed(1) + ' mm';
    }

    function formatRangeUnit(min, max, typical) {
      if (calculator.formatRangeUnit) {
        return calculator.formatRangeUnit(min, max, typical, currentUnit);
      }
      return min + ' - ' + max + ' mm';
    }

    // Local Storage State Persistence Helpers Delegated to Storage Manager Module
    function saveWorkspaceState() {
      var activeSymTab = symTabSimulator && symTabSimulator.classList.contains('active') ? 'simulator' : 'landmarks';
      if (storage.saveWorkspaceState) {
        storage.saveWorkspaceState({
          activeKey: activePiercingKey,
          unit: currentUnit,
          compareMode: isCompareMode,
          compareA: comparePiercingKeyA,
          compareB: comparePiercingKeyB,
          recents: recentPiercings,
          symTab: activeSymTab,
          symPair: symmetryPairSelect ? symmetryPairSelect.value : ''
        });
      }
    }

    function loadSavedWorkspaceState() {
      if (storage.loadWorkspaceState) {
        var loaded = storage.loadWorkspaceState(piercingData);
        if (loaded.activeKey && piercingData[loaded.activeKey]) {
          activePiercingKey = loaded.activeKey;
        }
        if (loaded.unit) {
          currentUnit = loaded.unit;
        }
        if (loaded.compareMode !== undefined) {
          isCompareMode = loaded.compareMode;
        }
        if (loaded.compareA && piercingData[loaded.compareA]) {
          comparePiercingKeyA = loaded.compareA;
        }
        if (loaded.compareB && piercingData[loaded.compareB]) {
          comparePiercingKeyB = loaded.compareB;
        }
        if (Array.isArray(loaded.recents)) {
          recentPiercings = loaded.recents;
        }
      }
    }

    // Navigation Buttons
    var piercingButtons = document.querySelectorAll('.piercing-btn');
    var piercingDetails = document.getElementById('piercingDetails');
    var piercingName = document.getElementById('piercingName');

    // Unit Toggle Buttons
    var unitToggleBtn = document.getElementById('unitToggleBtn');
    var unitToggleText = document.getElementById('unitToggleText');
    var unitToggleQuickBtn = document.getElementById('unitToggleQuickBtn');
    var unitToggleQuickText = document.getElementById('unitToggleQuickText');

    // Compare Mode Elements
    var compareModeToggleBtn = document.getElementById('compareModeToggleBtn');
    var compareModeBtnText = document.getElementById('compareModeBtnText');
    var compareWorkspace = document.getElementById('compareWorkspace');
    var comparePrintBtn = document.getElementById('comparePrintBtn');
    var exitCompareBtn = document.getElementById('exitCompareBtn');
    var comparePresetPills = document.querySelectorAll('.compare-preset-pill');

    var compareSelectA = document.getElementById('compareSelectA');
    var compareSelectB = document.getElementById('compareSelectB');
    var compareNameA = document.getElementById('compareNameA');
    var compareNameB = document.getElementById('compareNameB');
    var compareCategoryA = document.getElementById('compareCategoryA');
    var compareCategoryB = document.getElementById('compareCategoryB');

    var compareDiagramA = document.getElementById('compareDiagramA');
    var compareDiagramB = document.getElementById('compareDiagramB');
    var compareJewelryDiagramA = document.getElementById('compareJewelryDiagramA');
    var compareJewelryDiagramB = document.getElementById('compareJewelryDiagramB');

    var compareAngleA = document.getElementById('compareAngleA');
    var compareAngleB = document.getElementById('compareAngleB');
    var compareTissueA = document.getElementById('compareTissueA');
    var compareTissueB = document.getElementById('compareTissueB');
    var compareThicknessA = document.getElementById('compareThicknessA');
    var compareThicknessB = document.getElementById('compareThicknessB');
    var compareChannelDepthA = document.getElementById('compareChannelDepthA');
    var compareChannelDepthB = document.getElementById('compareChannelDepthB');
    var compareJewelryA = document.getElementById('compareJewelryA');
    var compareJewelryB = document.getElementById('compareJewelryB');
    var compareDownsizeA = document.getElementById('compareDownsizeA');
    var compareDownsizeB = document.getElementById('compareDownsizeB');
    var compareHealingA = document.getElementById('compareHealingA');
    var compareHealingB = document.getElementById('compareHealingB');

    var compareClearanceA = document.getElementById('compareClearanceA');
    var compareClearanceB = document.getElementById('compareClearanceB');
    var compareHazardA = document.getElementById('compareHazardA');
    var compareHazardB = document.getElementById('compareHazardB');
    var compareRefusalA = document.getElementById('compareRefusalA');
    var compareRefusalB = document.getElementById('compareRefusalB');
    var compareDiffGrid = document.getElementById('compareDiffGrid');

    // 1. Dynamic Angle Visualizer DOM Elements
    var angleRangeSlider = document.getElementById('angleRangeSlider');
    var currentAngleBadge = document.getElementById('currentAngleBadge');
    var anglePresetBtns = document.querySelectorAll('.v2-preset-pill');
    var v2StatusBanner = document.getElementById('v2StatusBanner');
    var v2StatusIcon = document.getElementById('v2StatusIcon');
    var v2StatusText = document.getElementById('v2StatusText');
    var v2SvgCanvasContainer = document.getElementById('v2SvgCanvasContainer');
    var visualizerJewelryPills = document.getElementById('visualizerJewelryPills');
    var resetAngleVisualizerBtn = document.getElementById('resetAngleVisualizerBtn');
    var downloadAngleDiagramSvgBtn = document.getElementById('downloadAngleDiagramSvgBtn');
    var downloadAngleDiagramPngBtn = document.getElementById('downloadAngleDiagramPngBtn');

    var diagAngleDeviation = document.getElementById('diagAngleDeviation');
    var diagToleranceDesc = document.getElementById('diagToleranceDesc');
    var diagCompression = document.getElementById('diagCompression');
    var diagCompressionDesc = document.getElementById('diagCompressionDesc');
    var diagMigrationRisk = document.getElementById('diagMigrationRisk');
    var diagMigrationDesc = document.getElementById('diagMigrationDesc');
    var visualizerAnimateAngleBtn = document.getElementById('visualizerAnimateAngleBtn');
    var visualizerAnimateIcon = document.getElementById('visualizerAnimateIcon');
    var visualizerAnimateText = document.getElementById('visualizerAnimateText');

    // 2. Caliper Thickness & Channel Depth Calculator DOM Elements
    var caliperThicknessSlider = document.getElementById('caliperThicknessSlider');
    var caliperThicknessBadge = document.getElementById('caliperThicknessBadge');
    var thicknessPresetContainer = document.getElementById('thicknessPresetContainer');
    var calcMeasuredThickness = document.getElementById('calcMeasuredThickness');
    var calcChannelDepth = document.getElementById('calcChannelDepth');
    var calcChannelFormula = document.getElementById('calcChannelFormula');

    var toggleFineTuneBtn = document.getElementById('toggleFineTuneBtn');
    var caliperFineTuneBar = document.getElementById('caliperFineTuneBar');
    var stepperMinus05Btn = document.getElementById('stepperMinus05Btn');
    var stepperMinus01Btn = document.getElementById('stepperMinus01Btn');
    var stepperPlus01Btn = document.getElementById('stepperPlus01Btn');
    var stepperPlus05Btn = document.getElementById('stepperPlus05Btn');
    var caliperPrecisionInput = document.getElementById('caliperPrecisionInput');
    var isFineTuneMode = false;

    // 3. Why This Angle
    var whyAngleClearanceContent = document.getElementById('whyAngleClearanceContent');
    var badAngleHazardContent = document.getElementById('badAngleHazardContent');

    // 4. Clinical Error Modes
    var errorTabBtns = document.querySelectorAll('.error-tab-btn');
    var errorSvgContainer = document.getElementById('errorSvgContainer');
    var errorModeDescription = document.getElementById('errorModeDescription');

    // 5. Bilateral Symmetry Caliper & Landmark Guide DOM Elements
    var symmetryPairSelect = document.getElementById('symmetryPairSelect');
    var symTabLandmarks = document.getElementById('symTabLandmarks');
    var symTabSimulator = document.getElementById('symTabSimulator');
    var symLandmarkPanel = document.getElementById('symLandmarkPanel') || document.getElementById('symLandmarksPanel');
    var symSimulatorPanel = document.getElementById('symSimulatorPanel');

    var symLandmarkSvgContainer = document.getElementById('symLandmarkSvgContainer') || document.getElementById('symmetryLandmarkSvgContainer');
    var symLandmarkSteps = document.getElementById('symLandmarkSteps') || document.getElementById('symStepList');
    var symLandmarkTitle = document.getElementById('symLandmarkTitle') || document.getElementById('symStepCardTitle');
    var symDatumLabel = document.getElementById('symDatumLabel');
    var symMeasDistance = document.getElementById('symMeasDistance');

    var symToggleLandmarksBtn = document.getElementById('symToggleLandmarksBtn');
    var symToggleCaliperBtn = document.getElementById('symToggleCaliperBtn');
    var symToggleTargetsBtn = document.getElementById('symToggleTargetsBtn');

    var symLeftAngleSlider = document.getElementById('symLeftAngleSlider');
    var symLeftAngleBadge = document.getElementById('symLeftAngleBadge');
    var symRightAngleSlider = document.getElementById('symRightAngleSlider');
    var symRightAngleBadge = document.getElementById('symRightAngleBadge');
    var symHeightOffsetSlider = document.getElementById('symHeightOffsetSlider');
    var symHeightOffsetBadge = document.getElementById('symHeightOffsetBadge');
    var symmetrySvgContainer = document.getElementById('symmetrySvgContainer');
    var symStatusBanner = document.getElementById('symStatusBanner');
    var symStatusText = document.getElementById('symStatusText');

    var symOverlays = { landmarks: true, caliper: true, targets: true };

    // 6. Core Anatomical Baseline Specs
    var optimalAngle = document.getElementById('optimalAngle');
    var insertionDepth = document.getElementById('insertionDepth');
    var tissueType = document.getElementById('tissueType');
    var healingTime = document.getElementById('healingTime');

    // 7. Jewelry Specifications
    var jewelryOptionsPills = document.getElementById('jewelryOptionsPills');
    var jewelryType = document.getElementById('jewelryType');
    var jewelryGauge = document.getElementById('jewelryGauge');
    var jewelryLength = document.getElementById('jewelryLength');
    var downsizeTime = document.getElementById('downsizeTime');
    var jewelryOptionDescBox = document.getElementById('jewelryOptionDescBox');
    var jewelryDiagramContainer = document.getElementById('jewelryDiagramContainer');

    // 8. Positioning, Pitfalls, Refusal, Aftercare
    var positioningContent = document.getElementById('positioningContent');
    var techniqueContent = document.getElementById('techniqueContent');
    var pitfallsContent = document.getElementById('pitfallsContent');
    var refusalContent = document.getElementById('refusalContent');
    var healingContent = document.getElementById('healingContent');

    // 9. Actions (Print & Download PDF & Copy & JSON)
    var downloadPdfBtn = document.getElementById('downloadPdfBtn');
    var print1PageSheetBtn = document.getElementById('print1PageSheetBtn');
    var copySummaryBtn = document.getElementById('copySummaryBtn');
    var downloadJsonBtn = document.getElementById('downloadJsonBtn');
    var notesDownloadJsonBtn = document.getElementById('notesDownloadJsonBtn');
    var mainDownloadJsonBtn = document.getElementById('mainDownloadJsonBtn');

    // 10. Studio Preferences & House Standards Modal Elements
    var openStudioPrefModalBtn = document.getElementById('openStudioPrefModalBtn');
    var resetStudioPrefBtn = document.getElementById('resetStudioPrefBtn');
    var studioPrefLabel = document.getElementById('studioPrefLabel');
    var studioPrefModal = document.getElementById('studioPrefModal');
    var closeStudioPrefModalBtn = document.getElementById('closeStudioPrefModalBtn');
    var cancelStudioPrefBtn = document.getElementById('cancelStudioPrefBtn');
    var studioPrefForm = document.getElementById('studioPrefForm');
    var studioPrefModalPlacementName = document.getElementById('studioPrefModalPlacementName');
    var houseGaugeSelect = document.getElementById('houseGaugeSelect');
    var houseJewelryTypeSelect = document.getElementById('houseJewelryTypeSelect');
    var houseNotesInput = document.getElementById('houseNotesInput');

    function updateStudioPreferenceStatus() {
      if (!studioPrefLabel) return;
      var prefs = getStudioPreferences();
      var pref = prefs[activePiercingKey];
      var t = window.translate || function (k, p, d) { return d; };
      if (pref) {
        var houseLabel = t('nav.house_standards', null, 'House Standard');
        studioPrefLabel.textContent = houseLabel + ' (' + (pref.gauge || 'Custom') + ')';
        if (resetStudioPrefBtn) resetStudioPrefBtn.style.display = 'inline-block';
      } else {
        studioPrefLabel.textContent = t('common.global_clinical_baseline', null, 'Global Clinical Baseline');
        if (resetStudioPrefBtn) resetStudioPrefBtn.style.display = 'none';
      }
    }

    function openStudioPreferenceModal() {
      if (!studioPrefModal) return;
      var p = piercingData[activePiercingKey] || piercingData['earlobe'];
      var t = window.translate || function (k, p, d) { return d; };

      if (studioPrefModalPlacementName && p) {
        var normKey = activePiercingKey.replace(/-/g, '_');
        var localizedName = t('piercing.' + normKey + '.name', null, p.name || activePiercingKey);
        studioPrefModalPlacementName.textContent = localizedName;
      }

      var prefs = getStudioPreferences();
      var pref = prefs[activePiercingKey] || {};

      if (houseGaugeSelect) {
        houseGaugeSelect.value = pref.gauge || p.jewelryGauge || '16G';
      }
      if (houseJewelryTypeSelect) {
        houseJewelryTypeSelect.value = pref.jewelryType || p.jewelryType || 'Flat-Back Labret (Threadless / Internally Threaded)';
      }
      if (houseNotesInput) {
        houseNotesInput.value = pref.notes || '';
      }

      studioPrefModal.removeAttribute('hidden');
      studioPrefModal.style.display = 'flex';
    }

    function closeStudioPreferenceModal() {
      if (!studioPrefModal) return;
      studioPrefModal.setAttribute('hidden', 'true');
      studioPrefModal.style.display = 'none';
    }

    // 11. Reset All, Recent Piercings & Professional Notes Elements
    var resetAllBtn = document.getElementById('resetAllBtn');
    var recentPiercingsContainer = document.getElementById('recentPiercingsContainer');
    var recentPiercingsList = document.getElementById('recentPiercingsList');
    var professionalNotesArea = document.getElementById('professionalNotesArea');
    var notesSaveStatus = document.getElementById('notesSaveStatus');
    var clearNotesBtn = document.getElementById('clearNotesBtn');
    var piercingSearchInput = document.getElementById('piercingSearch');

    // -------------------------------------------------------------
    // Unit System UI Updater
    // -------------------------------------------------------------
    function updateUnitUI() {
      var isImperial = (currentUnit === 'imperial');
      if (unitToggleText) {
        unitToggleText.textContent = isImperial ? 'Imperial (inches)' : 'Metric (mm)';
      }
      if (unitToggleQuickText) {
        unitToggleQuickText.textContent = isImperial ? 'Units: in' : 'Units: mm';
      }
    }

    function toggleUnitSystem() {
      currentUnit = (currentUnit === 'metric') ? 'imperial' : 'metric';
      updateUnitUI();
      saveWorkspaceState();
      updateVisualizerAndCalculations();
      updateBaselineSpecs();
      updateSymmetryLandmarkUI();
      if (isCompareMode) {
        updateCompareWorkspace();
      }
    }

    // -------------------------------------------------------------
    // Core Synchronous UI Updater
    // -------------------------------------------------------------
    function updateVisualizerAndCalculations() {
      var data = piercingData[activePiercingKey] || piercingData['earlobe'];
      var curOpt = getActiveJewelryOption(activePiercingKey, activeJewelryOptionId);
      var metrics = calculateChannelMetrics(activePiercingKey, currentMeasuredThickness, currentVisualizerAngle);

      var dev = currentVisualizerAngle - 90;
      var absDev = Math.abs(dev);

      // A. Visualizer Card Updates
      if (currentAngleBadge) {
        currentAngleBadge.textContent = tr('visualizer.angle_badge_value', { angle: currentVisualizerAngle, dev: (dev > 0 ? '+' : '') + dev }, '{angle}° ({dev}° from perpendicular)');
      }
      if (angleRangeSlider) {
        angleRangeSlider.value = currentVisualizerAngle;
      }

      if (v2SvgCanvasContainer) {
        v2SvgCanvasContainer.innerHTML = renderV2InteractiveSvg(
          activePiercingKey,
          currentVisualizerAngle,
          currentMeasuredThickness,
          curOpt,
          false
        );
      }

      // Status Banner
      if (v2StatusBanner) {
        if (absDev === 0) {
          v2StatusBanner.className = 'v2-status-banner v2-status-banner--optimal';
          if (v2StatusIcon) v2StatusIcon.textContent = '✅';
          if (v2StatusText) v2StatusText.textContent = tr('visualizer.status_straight', null, 'Straight through. Both discs sit flat on the skin.');
        } else if (absDev <= 5) {
          v2StatusBanner.className = 'v2-status-banner v2-status-banner--warning';
          if (v2StatusIcon) v2StatusIcon.textContent = '⚠️';
          if (v2StatusText) v2StatusText.textContent = tr('visualizer.status_slight', { dev: (dev > 0 ? '+' : '') + dev }, 'Tilted {dev}°. One disc edge starts to press into the skin, and swelling makes it worse.');
        } else {
          v2StatusBanner.className = 'v2-status-banner v2-status-banner--danger';
          if (v2StatusIcon) v2StatusIcon.textContent = '🛑';
          if (v2StatusText) v2StatusText.textContent = tr('visualizer.status_tilted', { dev: (dev > 0 ? '+' : '') + dev }, 'Tilted {dev}°. One disc edge presses in and the other lifts. Expect irritation bumps; the channel can migrate.');
        }
      }

      // Diagnostic Cards
      if (diagAngleDeviation) diagAngleDeviation.textContent = `${absDev}°`;
      if (diagToleranceDesc) diagToleranceDesc.textContent = tr('visualizer.tolerance_value', { tol: data.angleTolerance || '±2°' }, 'Tolerance: {tol}');
      var level = absDev === 0 ? 0 : (absDev <= 5 ? 1 : 2);
      if (diagCompression) diagCompression.textContent = [tr('visualizer.contact_even', null, 'Even'), tr('visualizer.contact_slight', null, 'Slightly uneven'), tr('visualizer.contact_uneven', null, 'Uneven')][level];
      if (diagCompressionDesc) diagCompressionDesc.textContent = [tr('visualizer.contact_even_desc', null, 'Discs sit flat on both sides'), tr('visualizer.contact_slight_desc', null, 'One disc edge presses harder'), tr('visualizer.contact_uneven_desc', null, 'One edge presses in, the other lifts')][level];
      if (diagMigrationRisk) diagMigrationRisk.textContent = [tr('visualizer.align_straight', null, 'Straight'), tr('visualizer.align_slight', null, 'Slight tilt'), tr('visualizer.align_tilted', null, 'Tilted')][level];
      if (diagMigrationDesc) diagMigrationDesc.textContent = [tr('visualizer.align_straight_desc', null, 'Jewelry can settle in line'), tr('visualizer.align_slight_desc', null, 'Can drift with swelling and wear'), tr('visualizer.align_tilted_desc', null, 'Pushes the jewelry sideways')][level];

      // Update Preset Pills Highlight
      anglePresetBtns.forEach(function (pill) {
        var offset = parseInt(pill.getAttribute('data-angle-offset'), 10);
        if (offset === dev) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      // B. Caliper Depth Calculator Updates (Metric / Imperial Sensitive)
      if (caliperThicknessBadge) {
        caliperThicknessBadge.textContent = formatMm(metrics.measuredThickness, true);
      }
      if (caliperThicknessSlider) caliperThicknessSlider.value = currentMeasuredThickness;
      if (caliperPrecisionInput && document.activeElement !== caliperPrecisionInput) {
        caliperPrecisionInput.value = currentMeasuredThickness.toFixed(1);
      }

      if (calcMeasuredThickness) {
        calcMeasuredThickness.textContent = formatMm(metrics.measuredThickness);
      }
      if (calcChannelDepth) {
        calcChannelDepth.textContent = formatMm(metrics.channelDepth);
      }
      if (calcChannelFormula) {
        calcChannelFormula.textContent = absDev === 0 ? tr('visualizer.formula_straight', null, 'Straight through: equal to the tissue') : tr('visualizer.formula_tilted', { dev: absDev }, 'Longer because of the {dev}° tilt');
      }

      // Update Thickness Presets Active State
      var thickPills = thicknessPresetContainer ? thicknessPresetContainer.querySelectorAll('.v2-preset-pill') : [];
      thickPills.forEach(function (p) {
        var val = parseFloat(p.getAttribute('data-thickness'));
        if (Math.abs(val - currentMeasuredThickness) < 0.1) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

    }

    function updateBaselineSpecs() {
      var data = piercingData[activePiercingKey] || piercingData['earlobe'];
      if (optimalAngle) optimalAngle.textContent = data.optimalAngle;
      if (insertionDepth) {
        var tRange = data.tissueThicknessRange || [4.0, 8.0, 5.0];
        insertionDepth.textContent = formatRangeUnit(tRange[0], tRange[1], tRange[2]);
      }
      if (tissueType) tissueType.textContent = data.tissueType;
      if (healingTime) healingTime.textContent = data.healingTime;
    }

    // -------------------------------------------------------------
    // Populate & Render Compare Mode Side-by-Side Workspace
    // -------------------------------------------------------------
    function populateCompareSelects() {
      if (!compareSelectA || !compareSelectB) return;

      var pData = (typeof window !== 'undefined' && window.PIERCING_DATA && Object.keys(window.PIERCING_DATA).length > 0) ? window.PIERCING_DATA : (piercingData || {});
      var categories = {};
      var t = window.translate || function (k, p, fb) { return fb || k; };

      Object.keys(pData).forEach(function (k) {
        var p = pData[k];
        var rawCat = p.category || 'Other';
        var normKey = k.replace(/-/g, '_');
        var catName = t('piercing.' + normKey + '.category', null, rawCat);
        var pName = t('piercing.' + normKey + '.name', null, p.name || k);

        if (!categories[rawCat]) {
          categories[rawCat] = { label: catName, items: [] };
        }
        categories[rawCat].items.push({ key: k, name: pName });
      });

      var buildOptionsHtml = function (selectedKey) {
        var html = '';
        Object.keys(categories).forEach(function (cat) {
          html += '<optgroup label="' + categories[cat].label + '">';
          categories[cat].items.forEach(function (item) {
            var sel = (item.key === selectedKey) ? ' selected' : '';
            html += '<option value="' + item.key + '"' + sel + '>' + item.name + '</option>';
          });
          html += '</optgroup>';
        });
        return html;
      };

      compareSelectA.innerHTML = buildOptionsHtml(comparePiercingKeyA);
      compareSelectB.innerHTML = buildOptionsHtml(comparePiercingKeyB);
      if (comparePiercingKeyA) compareSelectA.value = comparePiercingKeyA;
      if (comparePiercingKeyB) compareSelectB.value = comparePiercingKeyB;
    }

    function updateCompareWorkspace() {
      var pData = (typeof window !== 'undefined' && window.PIERCING_DATA && Object.keys(window.PIERCING_DATA).length > 0) ? window.PIERCING_DATA : (piercingData || {});
      var dataA = pData[comparePiercingKeyA] || pData['earlobe'];
      var dataB = pData[comparePiercingKeyB] || pData['helix'];
      var t = window.translate || function (k, p, fb) { return fb || k; };

      if (compareSelectA && compareSelectA.options.length === 0) {
        populateCompareSelects();
      }

      var normA = comparePiercingKeyA.replace(/-/g, '_');
      var normB = comparePiercingKeyB.replace(/-/g, '_');

      var nameA = t('piercing.' + normA + '.name', null, dataA.name);
      var catA = t('piercing.' + normA + '.category', null, dataA.category || 'Piercing');
      var angleA = t('piercing.' + normA + '.optimalAngle', null, dataA.optimalAngle);
      var tissueA = t('piercing.' + normA + '.tissueType', null, dataA.tissueType);
      var healingA = t('piercing.' + normA + '.healingTime', null, dataA.healingTime);
      var clearanceA = t('piercing.' + normA + '.whyThisAngle', null, dataA.whyThisAngle);
      var hazardA = t('piercing.' + normA + '.badAngleConsequence', null, dataA.badAngleConsequence);
      var refuseA = t('piercing.' + normA + '.refuse', null, dataA.refuse);

      var nameB = t('piercing.' + normB + '.name', null, dataB.name);
      var catB = t('piercing.' + normB + '.category', null, dataB.category || 'Piercing');
      var angleB = t('piercing.' + normB + '.optimalAngle', null, dataB.optimalAngle);
      var tissueB = t('piercing.' + normB + '.tissueType', null, dataB.tissueType);
      var healingB = t('piercing.' + normB + '.healingTime', null, dataB.healingTime);
      var clearanceB = t('piercing.' + normB + '.whyThisAngle', null, dataB.whyThisAngle);
      var hazardB = t('piercing.' + normB + '.badAngleConsequence', null, dataB.badAngleConsequence);
      var refuseB = t('piercing.' + normB + '.refuse', null, dataB.refuse);

      var tRangeA = dataA.tissueThicknessRange || [4.0, 8.0, 5.0];
      var tRangeB = dataB.tissueThicknessRange || [1.0, 2.5, 1.5];

      var metricsA = calculateChannelMetrics(comparePiercingKeyA, tRangeA[2], 90);
      var metricsB = calculateChannelMetrics(comparePiercingKeyB, tRangeB[2], 90);

      var curOptA = getActiveJewelryOption(comparePiercingKeyA, null);
      var curOptB = getActiveJewelryOption(comparePiercingKeyB, null);

      // Render Column A
      if (compareNameA) compareNameA.textContent = nameA;
      if (compareCategoryA) compareCategoryA.textContent = catA;
      if (compareDiagramA) {
        compareDiagramA.innerHTML = renderV2InteractiveSvg(comparePiercingKeyA, 90, tRangeA[2], curOptA);
      }
      if (compareJewelryDiagramA) {
        compareJewelryDiagramA.innerHTML = renderJewelry3D(dataA, curOptA);
      }
      if (compareAngleA) compareAngleA.textContent = `${angleA} (${dataA.angleTolerance || '±2°'})`;
      if (compareTissueA) compareTissueA.textContent = tissueA;
      if (compareThicknessA) compareThicknessA.textContent = formatRangeUnit(tRangeA[0], tRangeA[1], tRangeA[2]);
      if (compareChannelDepthA) compareChannelDepthA.textContent = formatMm(metricsA.channelDepth);
      if (compareJewelryA) {
        var jNameA = curOptA ? curOptA.name : dataA.jewelryType;
        var jGA = curOptA ? curOptA.gauge : dataA.jewelryGauge;
        compareJewelryA.textContent = `${jGA} (${jNameA})`;
      }
      if (compareDownsizeA) compareDownsizeA.textContent = dataA.downsizeTime || '';
      if (compareHealingA) compareHealingA.textContent = healingA;
      if (compareClearanceA) compareClearanceA.innerHTML = `<p>${clearanceA}</p>`;
      if (compareHazardA) compareHazardA.innerHTML = `<p>${hazardA}</p>`;
      if (compareRefusalA) compareRefusalA.innerHTML = refuseA || '<p>Standard contraindications apply.</p>';

      // Render Column B
      if (compareNameB) compareNameB.textContent = nameB;
      if (compareCategoryB) compareCategoryB.textContent = catB;
      if (compareDiagramB) {
        compareDiagramB.innerHTML = renderV2InteractiveSvg(comparePiercingKeyB, 90, tRangeB[2], curOptB);
      }
      if (compareJewelryDiagramB) {
        compareJewelryDiagramB.innerHTML = renderJewelry3D(dataB, curOptB);
      }
      if (compareAngleB) compareAngleB.textContent = `${angleB} (${dataB.angleTolerance || '±2°'})`;
      if (compareTissueB) compareTissueB.textContent = tissueB;
      if (compareThicknessB) compareThicknessB.textContent = formatRangeUnit(tRangeB[0], tRangeB[1], tRangeB[2]);
      if (compareChannelDepthB) compareChannelDepthB.textContent = formatMm(metricsB.channelDepth);
      if (compareJewelryB) {
        var jNameB = curOptB ? curOptB.name : dataB.jewelryType;
        var jGB = curOptB ? curOptB.gauge : dataB.jewelryGauge;
        compareJewelryB.textContent = `${jGB} (${jNameB})`;
      }
      if (compareDownsizeB) compareDownsizeB.textContent = dataB.downsizeTime || '';
      if (compareHealingB) compareHealingB.textContent = healingB;
      if (compareClearanceB) compareClearanceB.innerHTML = `<p>${clearanceB}</p>`;
      if (compareHazardB) compareHazardB.innerHTML = `<p>${hazardB}</p>`;
      if (compareRefusalB) compareRefusalB.innerHTML = refuseB || '<p>Standard contraindications apply.</p>';

      // Render Differential Contrast Matrix
      if (compareDiffGrid) {
        var diffAngle = (dataA.optimalAngle === dataB.optimalAngle) ?
          t('compare.both_perpendicular_msg', { angle: angleA }, `Both share standard ${angleA} perpendicular baseline trajectory.`) :
          t('compare.vector_disparity_msg', { nameA: nameA, angleA: angleA, nameB: nameB, angleB: angleB }, `Vector disparity: ${nameA} (${angleA}) vs ${nameB} (${angleB}).`);

        var diffTissue = `<strong>${nameA}:</strong> ${tissueA}<br>vs<br><strong>${nameB}:</strong> ${tissueB}`;

        var depthDiffMm = (parseFloat(metricsA.channelDepth) - parseFloat(metricsB.channelDepth)).toFixed(1);
        var depthDiffText = (depthDiffMm == 0) ?
          t('compare.equal_depth_msg', { depth: formatMm(metricsA.channelDepth) }, `Equal average channel depth of ${formatMm(metricsA.channelDepth)}.`) :
          (depthDiffMm > 0 ?
            t('compare.channel_longer_msg', { nameA: nameA, diff: formatMm(Math.abs(depthDiffMm)), nameB: nameB }, `${nameA} channel is ${formatMm(Math.abs(depthDiffMm))} longer than ${nameB}.`) :
            t('compare.channel_shorter_msg', { nameA: nameA, diff: formatMm(Math.abs(depthDiffMm)), nameB: nameB }, `${nameA} channel is ${formatMm(Math.abs(depthDiffMm))} shorter than ${nameB}.`));


        var hazardLabelA = dataA.badAngleConsequence ? hazardA : t('compare.pressure_necrosis_risk', null, 'Pressure necrosis / migration');
        var hazardLabelB = dataB.badAngleConsequence ? hazardB : t('compare.hypertrophic_notch_risk', null, 'Hypertrophic scar / cartilage notch');

        compareDiffGrid.innerHTML = `
          <div class="compare-diff-item">
            <span class="compare-diff-item__label">${t('compare.vector_geometry_contrast', null, '📐 Vector Geometry Contrast')}</span>
            <span class="compare-diff-item__value">${diffAngle}</span>
          </div>
          <div class="compare-diff-item">
            <span class="compare-diff-item__label">${t('compare.histological_vascular_delta', null, '🔬 Histological & Vascular Delta')}</span>
            <span class="compare-diff-item__value">${diffTissue}</span>
          </div>
          <div class="compare-diff-item">
            <span class="compare-diff-item__label">${t('compare.channel_depth_difference', null, '📏 Channel Depth Difference')}</span>
            <span class="compare-diff-item__value">${depthDiffText}</span>
          </div>
          <div class="compare-diff-item">
            <span class="compare-diff-item__label">${t('compare.healing_duration_delta', null, '⏱️ Healing Duration Delta')}</span>
            <span class="compare-diff-item__value"><strong>${nameA}:</strong> ${healingA}<br><strong>${nameB}:</strong> ${healingB}</span>
          </div>
          <div class="compare-diff-item">
            <span class="compare-diff-item__label">${t('compare.primary_clinical_risk', null, '⚠️ Primary Clinical Risk Factor')}</span>
            <span class="compare-diff-item__value"><strong>${nameA}:</strong> ${hazardLabelA}<br><strong>${nameB}:</strong> ${hazardLabelB}</span>
          </div>
        `;
      }
    }

    function setCompareMode(active, scrollTo) {
      isCompareMode = active;
      saveWorkspaceState();

      if (isCompareMode) {
        if (compareModeToggleBtn) {
          compareModeToggleBtn.classList.add('active');
          compareModeToggleBtn.setAttribute('aria-pressed', 'true');
        }
        if (compareWorkspace) compareWorkspace.removeAttribute('hidden');
        if (piercingDetails) piercingDetails.setAttribute('hidden', '');
        populateCompareSelects();
        updateCompareWorkspace();
        if (scrollTo && compareWorkspace) {
          compareWorkspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        if (compareModeToggleBtn) {
          compareModeToggleBtn.classList.remove('active');
          compareModeToggleBtn.setAttribute('aria-pressed', 'false');
        }
        if (compareWorkspace) compareWorkspace.setAttribute('hidden', '');
        if (piercingDetails) piercingDetails.removeAttribute('hidden');
        selectPiercing(activePiercingKey, scrollTo);
      }
    }

    function generateAndPrintComparisonSheet() {
      var dataA = piercingData[comparePiercingKeyA] || piercingData['earlobe'];
      var dataB = piercingData[comparePiercingKeyB] || piercingData['helix'];
      var tRangeA = dataA.tissueThicknessRange || [4.0, 8.0, 5.0];
      var tRangeB = dataB.tissueThicknessRange || [1.0, 2.5, 1.5];
      var metricsA = calculateChannelMetrics(comparePiercingKeyA, tRangeA[2], 90);
      var metricsB = calculateChannelMetrics(comparePiercingKeyB, tRangeB[2], 90);

      var printDate = document.getElementById('printSheetDate');
      var printCategory = document.getElementById('printSheetCategory');
      var printTitle = document.getElementById('printSheetTitle');
      var printHouseBadge = document.getElementById('printSheetHouseBadge');
      var printDiagram = document.getElementById('printSheetDiagramContainer');
      var printJewelryDiagram = document.getElementById('printSheetJewelryDiagramContainer');
      var printAngle = document.getElementById('printSheetAngle');
      var printDepth = document.getElementById('printSheetDepth');
      var printThickness = document.getElementById('printSheetThickness');
      var printJewelry = document.getElementById('printSheetJewelry');
      var printDownsize = document.getElementById('printSheetDownsize');
      var printClearance = document.getElementById('printSheetClearance');
      var printTechniqueSummary = document.getElementById('printSheetTechniqueSummary');
      var printRefusal = document.getElementById('printSheetRefusal');

      var dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (printDate) printDate.textContent = dateStr;
      if (printCategory) printCategory.textContent = window.translate ? window.translate('guide.comp_geometry', null, 'COMPARATIVE CLINICAL GEOMETRY') : 'COMPARATIVE CLINICAL GEOMETRY';
      if (printTitle) printTitle.textContent = `${dataA.name} vs ${dataB.name} Comparative Protocol`;
      if (printHouseBadge) printHouseBadge.textContent = `Units: ${currentUnit === 'imperial' ? 'Imperial (inches)' : 'Metric (mm)'}`;

      if (printDiagram) {
        printDiagram.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%;">
            <div>
              <div style="font-size: 11px; font-weight: 700; text-align: center; margin-bottom: 4px;">${dataA.name.toUpperCase()} (90°)</div>
              ${renderV2InteractiveSvg(comparePiercingKeyA, 90, tRangeA[2], null)}
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 700; text-align: center; margin-bottom: 4px;">${dataB.name.toUpperCase()} (90°)</div>
              ${renderV2InteractiveSvg(comparePiercingKeyB, 90, tRangeB[2], null)}
            </div>
          </div>
        `;
      }

      if (printJewelryDiagram) {
        printJewelryDiagram.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%;">
            <div>${renderJewelry3D(dataA, null)}</div>
            <div>${renderJewelry3D(dataB, null)}</div>
          </div>
        `;
      }

      if (printAngle) printAngle.textContent = `${dataA.name}: ${dataA.optimalAngle} | ${dataB.name}: ${dataB.optimalAngle}`;
      if (printDepth) printDepth.textContent = `${dataA.name}: ${formatMm(metricsA.channelDepth)} | ${dataB.name}: ${formatMm(metricsB.channelDepth)}`;
      if (printThickness) printThickness.textContent = `${dataA.name}: ${formatRangeUnit(tRangeA[0], tRangeA[1], tRangeA[2])} vs ${dataB.name}: ${formatRangeUnit(tRangeB[0], tRangeB[1], tRangeB[2])}`;
      if (printJewelry) printJewelry.textContent = `${dataA.name}: ${dataA.jewelryGauge} vs ${dataB.name}: ${dataB.jewelryGauge}`;
      if (printDownsize) printDownsize.textContent = `${dataA.name}: ${dataA.downsizeTime} vs ${dataB.name}: ${dataB.downsizeTime}`;

      if (printClearance) {
        printClearance.innerHTML = `
          <p><strong>${dataA.name}:</strong> ${dataA.whyThisAngle}</p>
          <p><strong>${dataB.name}:</strong> ${dataB.whyThisAngle}</p>
        `;
      }
      if (printTechniqueSummary) {
        printTechniqueSummary.innerHTML = `
          <p><strong>${dataA.name} Off-Angle Hazard:</strong> ${dataA.badAngleConsequence}</p>
          <p><strong>${dataB.name} Off-Angle Hazard:</strong> ${dataB.badAngleConsequence}</p>
        `;
      }
      if (printRefusal) {
        printRefusal.innerHTML = `
          <p><strong>${dataA.name} Contraindications:</strong> ${dataA.refuse || 'Standard check'}</p>
          <p><strong>${dataB.name} Contraindications:</strong> ${dataB.refuse || 'Standard check'}</p>
        `;
      }

      window.print();
    }

    // -------------------------------------------------------------
    // Render Jewelry Options in Pills
    // -------------------------------------------------------------
    function updateJewelryUI() {
      var options = jewelryOptions[activePiercingKey] || [];
      var curOpt = getActiveJewelryOption(activePiercingKey, activeJewelryOptionId);
      var data = piercingData[activePiercingKey] || piercingData['earlobe'];

      function buildPillHtml(targetContainer) {
        if (!targetContainer) return;
        if (options.length === 0) {
          targetContainer.innerHTML = '<span class="text-muted">Standard initial jewelry configuration</span>';
          return;
        }
        var html = '';
        options.forEach(function (opt) {
          var isSelected = (curOpt && curOpt.id === opt.id);
          var badge = opt.isInitialStandard ? '<span class="jewelry-pill-badge initial">Initial Std</span>' : '<span class="jewelry-pill-badge healed">Healed Alt</span>';
          html += `
            <button type="button" class="jewelry-option-pill ${isSelected ? 'active' : ''}" data-jewelry-id="${opt.id}" aria-label="Select ${opt.name}">
              <span class="pill-name">${opt.name}</span>
              ${badge}
            </button>
          `;
        });
        targetContainer.innerHTML = html;

        // Attach Click Listener to Pills
        var pills = targetContainer.querySelectorAll('.jewelry-option-pill');
        pills.forEach(function (p) {
          p.addEventListener('click', function () {
            activeJewelryOptionId = this.getAttribute('data-jewelry-id');
            updateJewelryUI();
            updateVisualizerAndCalculations();
          });
        });
      }

      // Populate both pill containers
      buildPillHtml(visualizerJewelryPills);
      buildPillHtml(jewelryOptionsPills);

      // Update Specs Grid
      if (curOpt) {
        if (jewelryType) jewelryType.textContent = curOpt.name;
        if (jewelryGauge) jewelryGauge.textContent = curOpt.gauge;
        if (jewelryLength) jewelryLength.textContent = curOpt.length;
        if (downsizeTime) downsizeTime.textContent = curOpt.downsize;
        if (jewelryOptionDescBox) {
          jewelryOptionDescBox.innerHTML = `<strong>Clinical Rationale:</strong> ${curOpt.description}`;
        }
      } else {
        var prefs = getStudioPreferences();
        var pref = prefs[activePiercingKey];
        if (jewelryType) jewelryType.textContent = (pref && pref.jewelryType) || data.jewelryType;
        if (jewelryGauge) jewelryGauge.textContent = (pref && pref.gauge) || data.jewelryGauge;
        if (jewelryLength) jewelryLength.textContent = data.jewelryLength;
        if (downsizeTime) downsizeTime.textContent = data.downsizeTime;
        if (jewelryOptionDescBox) {
          if (pref && pref.notes) {
            jewelryOptionDescBox.innerHTML = `<strong>Studio House Standard:</strong> ${pref.notes}`;
          } else {
            jewelryOptionDescBox.innerHTML = `<strong>Clinical Standard:</strong> ${data.jewelryType}`;
          }
        }
      }

      // Re-render 3D CAD Diagram
      if (jewelryDiagramContainer) {
        jewelryDiagramContainer.innerHTML = renderJewelry3D(data, curOpt);
      }
    }

    // -------------------------------------------------------------
    // Render Clinical Error Modes Comparator
    // -------------------------------------------------------------
    function updateErrorModeUI(mode) {
      var activeMode = mode || 'optimal';
      var t = window.translate || function (k, p, d) { return d; };
      var descriptions = {
        'optimal': '<strong>' + t('visualizer.err_optimal_title', null, '✅ Optimal Perpendicular Alignment') + ':</strong> ' + t('visualizer.err_optimal_desc', null, 'The needle enters and exits at precisely 90° to the anatomical plane. Both anterior and posterior discs sit completely flush against the epidermal surface, distributing hydrostatic pressure uniformly with zero localized shear strain.'),
        'shallow': '<strong>' + t('visualizer.err_shallow_title', null, '⚠️ Shallow Insertion Error') + ':</strong> ' + t('visualizer.err_shallow_desc', null, 'Entering at a shallow diagonal angle (-15°) elongates the fistula channel and causes the superior edge of the backing disc to bite into the dermis. This localized pressure triggers collagen hyperplasia and chronic hypertrophic bumps.'),
        'steep': '<strong>' + t('visualizer.err_steep_title', null, '🛑 Steep / Off-Axis Incline Error') + ':</strong> ' + t('visualizer.err_steep_desc', null, 'A steep trajectory (+15°) forces the opposite disc edge to dig deeply into the tissue, creating high shear forces that cause the jewelry to migrate over time toward the path of least resistance.'),
        'asymmetric': '<strong>' + t('visualizer.err_asym_title', null, '⚠️ Bilateral Asymmetric Skew') + ':</strong> ' + t('visualizer.err_asym_desc', null, 'Different entry/exit vectors on paired piercings create optical dissonance, uneven downward hang under gravity, and asymmetric friction during daily activity and sleep.')
      };

      if (errorSvgContainer) {
        errorSvgContainer.innerHTML = renderErrorModeSvg(activeMode, activePiercingKey);
      }
      if (errorModeDescription) {
        errorModeDescription.innerHTML = descriptions[activeMode] || descriptions['optimal'];
      }

      errorTabBtns.forEach(function (btn) {
        if (btn.getAttribute('data-error-mode') === activeMode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // -------------------------------------------------------------
    // Render Bilateral Symmetry Caliper & Landmark Placement Guide
    // -------------------------------------------------------------
    function updateSymmetryLandmarkUI() {
      var pairType = symmetryPairSelect ? symmetryPairSelect.value : 'lobes';
      var t = window.translate || function (k, p, d) { return d; };

      // 1. Render Interactive SVG
      if (symLandmarkSvgContainer) {
        symLandmarkSvgContainer.innerHTML = renderSymmetryLandmarkSvg(pairType, symOverlays);
      }

      // 2. Update Protocol Header Labels
      var titles = {
        'lobes': {
          name: t('visualizer.sym_lobes_name', null, 'Earlobes Bilateral Reference'),
          datum: t('visualizer.sym_lobes_datum', null, 'Inter-Tragal Notch Plane (Datum A)'),
          dist: t('visualizer.sym_lobes_dist', null, '16.5 mm (Tragus to Center)')
        },
        'nostrils': {
          name: t('visualizer.sym_nostrils_name', null, 'Nostrils Bilateral Reference'),
          datum: t('visualizer.sym_nostrils_datum', null, 'Alar-Facial Crease Baseline'),
          dist: t('visualizer.sym_nostrils_dist', null, '7.0 mm (Crease to Apex)')
        },
        'high-nostrils': {
          name: t('visualizer.sym_high_nostrils_name', null, 'High Nostrils Supra-Alar Reference'),
          datum: t('visualizer.sym_high_nostrils_datum', null, 'Nasion / Interpupillary Plane'),
          dist: t('visualizer.sym_high_nostrils_dist', null, '14.0 mm from Alar Rim')
        },
        'eyebrows': {
          name: t('visualizer.sym_eyebrows_name', null, 'Eyebrows Ridge Reference'),
          datum: t('visualizer.sym_eyebrows_datum', null, 'Lateral Orbital Rim / Canthus'),
          dist: t('visualizer.sym_eyebrows_dist', null, '12.0 mm (Canthus to Axis)')
        },
        'snake-bites': {
          name: t('visualizer.sym_snake_bites_name', null, 'Snake Bites (Lower Lip) Reference'),
          datum: t('visualizer.sym_snake_bites_datum', null, 'Vermilion Border & Commissure'),
          dist: t('visualizer.sym_snake_bites_dist', null, '12.5 mm Inward from Corner')
        },
        'nipples': {
          name: t('visualizer.sym_nipples_name', null, 'Nipples Horizontal Reference'),
          datum: t('visualizer.sym_nipples_datum', null, 'Sternal Midline & Inframammary Level'),
          dist: t('visualizer.sym_nipples_dist', null, 'Transverse Coronal Axis')
        },
        'helix-flat': {
          name: t('visualizer.sym_helix_flat_name', null, 'Auricular Flat / Helix Reference'),
          datum: t('visualizer.sym_helix_flat_datum', null, 'Superior Auricular Ridge & Scapha'),
          dist: t('visualizer.sym_helix_flat_dist', null, '6.5 mm Outer Rim Clearance')
        }
      };

      var info = titles[pairType] || titles['lobes'];
      if (symLandmarkTitle) symLandmarkTitle.textContent = info.name;
      if (symDatumLabel) symDatumLabel.textContent = info.datum;
      if (symMeasDistance) symMeasDistance.textContent = info.dist;

      // 3. Render Step-by-Step Clinical Protocol for Junior Piercers
      if (symLandmarkSteps) {
        var steps = getSymmetryStepsData(pairType);
        var stepsHtml = '';
        steps.forEach(function (st) {
          stepsHtml += `
            <div style="display: flex; gap: 0.75rem; align-items: flex-start; margin-bottom: 0.65rem;">
              <span class="clinical-step-pill">${st.num}</span>
              <div style="font-size: 0.88rem; line-height: 1.45;">
                <strong style="color: var(--text-primary);">${st.title}</strong>
                <span style="color: var(--text-secondary); margin-left: 0.25rem;">${st.text}</span>
              </div>
            </div>
          `;
        });
        symLandmarkSteps.innerHTML = stepsHtml;
      }
    }

    function updateSymmetryUI() {
      var pairType = symmetryPairSelect ? symmetryPairSelect.value : 'lobes';
      var lAngle = symLeftAngleSlider ? parseFloat(symLeftAngleSlider.value) : 90;
      var rAngle = symRightAngleSlider ? parseFloat(symRightAngleSlider.value) : 90;
      var offset = symHeightOffsetSlider ? parseFloat(symHeightOffsetSlider.value) : 0.0;

      // Update Landmark Guide
      updateSymmetryLandmarkUI();

      // Update Simulator Badges
      if (symLeftAngleBadge) symLeftAngleBadge.textContent = `${lAngle}°`;
      if (symRightAngleBadge) symRightAngleBadge.textContent = `${rAngle}°`;
      if (symHeightOffsetBadge) symHeightOffsetBadge.textContent = `${offset > 0 ? '+' : ''}${offset.toFixed(1)} mm`;

      // Render Vector Simulator SVG
      if (symmetrySvgContainer) {
        symmetrySvgContainer.innerHTML = renderSymmetrySvg(pairType, lAngle, rAngle, offset);
      }

      var delta = Math.abs(lAngle - rAngle).toFixed(1);
      var isPerfect = (delta <= 1.0 && Math.abs(offset) < 0.5);

      if (symStatusBanner) {
        if (isPerfect) {
          symStatusBanner.className = 'v2-status-banner v2-status-banner--optimal';
          if (symStatusText) symStatusText.textContent = tr('ui.symmetrical_angle_difference_delta_height_offset', { delta: delta, offset: offset.toFixed(1) }, 'Symmetrical: angle difference {delta}°, height offset {offset} mm.');
        } else if (Math.abs(offset) >= 1.5) {
          symStatusBanner.className = 'v2-status-banner v2-status-banner--danger';
          if (symStatusText) symStatusText.textContent = `Significant Step Height Offset (${offset > 0 ? '+' : ''}${offset.toFixed(1)}mm)! Unbalanced optical level across datum plane.`;
        } else {
          symStatusBanner.className = 'v2-status-banner v2-status-banner--warning';
          if (symStatusText) symStatusText.textContent = `Angular Divergence Delta of ${delta}° detected. Asymmetric hang will be noticeable on resting posture.`;
        }
      }
    }

    // -------------------------------------------------------------
    // Printable / Download as PDF Placement Sheet Generator
    // -------------------------------------------------------------
    function generateAndPrintClinicalSheet() {
      var data = piercingData[activePiercingKey] || piercingData['earlobe'];
      var curOpt = getActiveJewelryOption(activePiercingKey, activeJewelryOptionId);
      var metrics = calculateChannelMetrics(activePiercingKey, currentMeasuredThickness, currentVisualizerAngle);

      var printDate = document.getElementById('printSheetDate');
      var printCategory = document.getElementById('printSheetCategory');
      var printTitle = document.getElementById('printSheetTitle');
      var printHouseBadge = document.getElementById('printSheetHouseBadge');
      var printDiagram = document.getElementById('printSheetDiagramContainer');
      var printJewelryDiagram = document.getElementById('printSheetJewelryDiagramContainer');
      var printAngle = document.getElementById('printSheetAngle');
      var printDepth = document.getElementById('printSheetDepth');
      var printThickness = document.getElementById('printSheetThickness');
      var printJewelry = document.getElementById('printSheetJewelry');
      var printDownsize = document.getElementById('printSheetDownsize');
      var printClearance = document.getElementById('printSheetClearance');
      var printTechniqueSummary = document.getElementById('printSheetTechniqueSummary');
      var printRefusal = document.getElementById('printSheetRefusal');
      var printHouseNotes = document.getElementById('printHouseNotes') || document.getElementById('printSheetHouseNotes');
      var printCareNotes = document.getElementById('printSheetCareNotes');

      var dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (printDate) printDate.textContent = dateStr;
      if (printCategory) printCategory.textContent = (data.category || 'CLINICAL PIERCING PROTOCOL').toUpperCase();
      if (printTitle) printTitle.textContent = `${data.name} Specification & Placement Protocol`;
      if (printHouseBadge) {
        var house = getStudioPreferences()[activePiercingKey];
        printHouseBadge.textContent = house ? tr('print.house_standard', { gauge: house.gauge }, 'House Standard: {gauge}') : tr('print.global_baseline', null, 'Protocol: Standard Global Clinical Baseline');
      }

      // Inject Cross-Section SVG Diagram (with ink-free high-legibility print mode)
      if (printDiagram) {
        printDiagram.innerHTML = renderV2InteractiveSvg(activePiercingKey, 90, currentMeasuredThickness, curOpt, true);
      }

      // Populate Large Room-Legible Hero Metric Strip for Procedure Room
      var printHeroAngle = document.getElementById('printHeroAngle');
      var printHeroAngleSub = document.getElementById('printHeroAngleSub');
      var printHeroDepth = document.getElementById('printHeroDepth');
      var printHeroDepthSub = document.getElementById('printHeroDepthSub');
      var printHeroPost = document.getElementById('printHeroPost');
      var printHeroPostSub = document.getElementById('printHeroPostSub');
      var printHeroGauge = document.getElementById('printHeroGauge');
      var printHeroGaugeSub = document.getElementById('printHeroGaugeSub');
      var printHeroDownsize = document.getElementById('printHeroDownsize');
      var printHeroDownsizeSub = document.getElementById('printHeroDownsizeSub');

      if (printHeroAngle) printHeroAngle.textContent = data.optimalAngle || '90°';
      if (printHeroAngleSub) printHeroAngleSub.textContent = `Normal (${data.angleTolerance || '±2°'})`;
      if (printHeroDepth) printHeroDepth.textContent = `${metrics.channelDepth} mm`;
      if (printHeroDepthSub) printHeroDepthSub.textContent = window.translate ? window.translate('guide.full_tissue_thickness', null, 'Full Tissue Thickness') : 'Full Tissue Thickness';
      if (printHeroPost) printHeroPost.textContent = curOpt ? curOpt.length : data.jewelryLength;
      if (printHeroPostSub) printHeroPostSub.textContent = tr('print.typical_starting_length', null, 'Typical starting length');
      if (printHeroGauge) printHeroGauge.textContent = curOpt ? curOpt.gauge : data.jewelryGauge;
      if (printHeroGaugeSub) printHeroGaugeSub.textContent = curOpt && curOpt.gaugeMm ? `${curOpt.gaugeMm} mm Post` : '1.2 mm Post';
      if (printHeroDownsize) printHeroDownsize.textContent = data.downsizeTime || '';
      if (printHeroDownsizeSub) printHeroDownsizeSub.textContent = tr('print.downsize_timing', null, 'Typical downsize timing');

      // Inject 3D Jewelry CAD Diagram
      if (printJewelryDiagram) {
        printJewelryDiagram.innerHTML = renderJewelry3D(data, curOpt);
      }

      // Fill Technical Specifications
      if (printAngle) printAngle.textContent = `${data.optimalAngle} (${data.angleTolerance || '±2°'})`;
      if (printDepth) printDepth.textContent = `${metrics.channelDepth} mm (Traverse full tissue thickness)`;
      if (printThickness) {
        var tRange = data.tissueThicknessRange || [4.0, 8.0, 5.0];
        printThickness.textContent = `${tRange[0]} - ${tRange[1]} mm (Typical: ${tRange[2]} mm | Sized: ${metrics.measuredThickness} mm)`;
      }
      if (printJewelry) {
        var jName = curOpt ? curOpt.name : data.jewelryType;
        var jG = curOpt ? curOpt.gauge : data.jewelryGauge;
        var jL = curOpt ? curOpt.length : data.jewelryLength;
        printJewelry.textContent = `${jG} / ${jL} (${jName})`;
      }
      if (printDownsize) {
        printDownsize.textContent = data.downsizeTime || '';
      }

      // Fill Anatomical Clearance & Guidance
      if (printClearance) {
        printClearance.innerHTML = `<strong>Clearance Rationale:</strong> ${data.whyThisAngle} <br><strong>Off-Axis Hazard:</strong> ${data.badAngleConsequence}`;
      }
      if (printTechniqueSummary) {
        printTechniqueSummary.innerHTML = `<strong>Technique Guidance:</strong> Stabilize tissue plane with sterile ring-closing forceps or freehand technique. Ensure needle axis maintains strict 90° normal vector through both epidermal boundaries. Verify exit mark visualization prior to needle advancement.`;
      }

      // Fill Refusal Criteria
      if (printRefusal) {
        printRefusal.innerHTML = data.refuse || 'Refuse procedure if local infection, active dermatitis, insufficient anatomical tissue ridge, or keloid predisposition is present.';
      }

      // Fill Material Protocols & Care
      if (printHouseNotes) {
        printHouseNotes.innerHTML = '<strong>' + tr('print.materials_label', null, 'Initial jewelry materials') + ':</strong> ' + tr('print.materials_text', null, 'implant-grade titanium (ASTM F136 or F67), implant-grade steel (ASTM F138), solid 14k gold or higher, niobium, or BioFlex® (medical-grade PP-R). Internally threaded or threadless, with a polished finish.');
      }
      if (printCareNotes) {
        printCareNotes.innerHTML = '<strong>' + tr('print.aftercare_label', null, 'Aftercare') + ':</strong> ' + tr('print.aftercare_text', null, 'follow the studio aftercare sheet. A personalised schedule: poliinternational.com/aftercare-schedule-generator/');
      }

      // Open Print Dialog
      window.print();
    }

    // -------------------------------------------------------------
    // Select Piercing Controller
    // -------------------------------------------------------------
    function selectPiercing(key, scrollIntoView) {
      stopSweepAnimation();
      if (!piercingData[key]) key = 'earlobe';
      activePiercingKey = key;
      activeJewelryOptionId = null; // Reset to default initial jewelry
      saveWorkspaceState();

      var data = piercingData[key];
      var thicknessRange = data.tissueThicknessRange || [3.0, 8.0, 5.0];
      currentMeasuredThickness = thicknessRange[2]; // Set typical thickness
      currentVisualizerAngle = data.optimalDegrees || 90;

      // Reveal Details Container
      if (piercingDetails) {
        piercingDetails.removeAttribute('hidden');
      }

      // Update Header & Baseline Specs
      if (piercingName) piercingName.textContent = data.name;
      updateBaselineSpecs();

      // Update Why This Angle
      if (whyAngleClearanceContent) {
        whyAngleClearanceContent.innerHTML = `<p>${data.whyThisAngle}</p>`;
      }
      if (badAngleHazardContent) {
        badAngleHazardContent.innerHTML = `<p>${data.badAngleConsequence}</p>`;
      }

      // Update Narrative Sections
      if (positioningContent) positioningContent.innerHTML = data.positioning || '<p>Anatomical positioning guidelines available.</p>';
      if (techniqueContent) techniqueContent.innerHTML = '<p><strong>' + tr('guide.technique_label', null, 'Technique') + ':</strong> ' + tr('guide.technique_text', { angle: data.optimalAngle }, 'Mark the entry and exit points and confirm both with the client. Support the tissue, then keep the needle on the angle for this placement ({angle}) from entry to exit.') + '</p>';
      if (pitfallsContent) pitfallsContent.innerHTML = '<p><strong>' + tr('guide.pitfall_label', null, 'Common pitfall') + ':</strong> ' + tr('guide.pitfall_text', null, 'The needle drifting as the tissue drags on it. Check that the exit mark is still in line before pushing through.') + '</p>';
      if (refusalContent) refusalContent.innerHTML = data.refuse || '<p>Refuse procedure if local infection, keloids, or severe anatomical abnormalities are present.</p>';

      // Update Thickness Slider Constraints
      if (caliperThicknessSlider) {
        caliperThicknessSlider.min = thicknessRange[0];
        caliperThicknessSlider.max = thicknessRange[1];
        caliperThicknessSlider.step = isFineTuneMode ? 0.1 : 0.5;
        caliperThicknessSlider.value = currentMeasuredThickness;
      }
      if (caliperPrecisionInput) {
        caliperPrecisionInput.min = thicknessRange[0];
        caliperPrecisionInput.max = thicknessRange[1];
        caliperPrecisionInput.value = currentMeasuredThickness.toFixed(1);
      }

      // Populate Thickness Presets
      if (thicknessPresetContainer) {
        thicknessPresetContainer.innerHTML = `
          <button type="button" class="v2-preset-pill" data-thickness="${thicknessRange[0]}">
            ${tr('ui.thin', null, 'Thin')} (${formatMm(thicknessRange[0])})
          </button>
          <button type="button" class="v2-preset-pill active" data-thickness="${thicknessRange[2]}">
            ${tr('ui.typical', null, 'Typical')} (${formatMm(thicknessRange[2])})
          </button>
          <button type="button" class="v2-preset-pill" data-thickness="${thicknessRange[1]}">
            ${tr('ui.thick', null, 'Thick')} (${formatMm(thicknessRange[1])})
          </button>
        `;
        var tPills = thicknessPresetContainer.querySelectorAll('.v2-preset-pill');
        tPills.forEach(function (pill) {
          pill.addEventListener('click', function () {
            currentMeasuredThickness = parseFloat(this.getAttribute('data-thickness'));
            updateVisualizerAndCalculations();
          });
        });
      }

      // Highlight Active Piercing Button
      piercingButtons.forEach(function (btn) {
        if (btn.getAttribute('data-piercing') === key) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Recent Piercings Tracking
      updateRecentPiercingsList(key);

      // Load Session Professional Notes for this Piercing
      loadProfessionalNotes(key);

      // Synchronize All Interactive Modules
      updateStudioPreferenceStatus();
      updateVisualizerAndCalculations();
      updateJewelryUI();
      updateErrorModeUI('optimal');

      // Synchronize 3D Human Anatomy Model if initialized
      if (window.Anatomy3DExplorer && typeof window.Anatomy3DExplorer.syncActivePiercing === 'function') {
        window.Anatomy3DExplorer.syncActivePiercing(key);
      }

      if (scrollIntoView && piercingDetails) {
        piercingDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // -------------------------------------------------------------
    // Recent Piercings Management Helper Delegating to Modules
    // -------------------------------------------------------------
    function updateRecentPiercingsList(currentKey) {
      if (!currentKey || !piercingData[currentKey]) return;

      if (storage.updateRecentPiercings) {
        recentPiercings = storage.updateRecentPiercings(recentPiercings, currentKey, piercingData, 5);
      } else {
        recentPiercings = recentPiercings.filter(function (k) {
          return k !== currentKey && piercingData[k];
        });
        recentPiercings.unshift(currentKey);
        if (recentPiercings.length > 5) {
          recentPiercings = recentPiercings.slice(0, 5);
        }
      }

      saveWorkspaceState();
      renderRecentPiercingsChips();
    }

    function renderRecentPiercingsChips() {
      if (uiController.renderRecentPiercingsChips) {
        uiController.renderRecentPiercingsChips(
          recentPiercingsContainer,
          recentPiercingsList,
          recentPiercings,
          activePiercingKey,
          isCompareMode,
          piercingData,
          function (key) {
            if (isCompareMode) {
              setCompareMode(false, false);
            }
            selectPiercing(key, true);
          }
        );
      }
    }

    // -------------------------------------------------------------
    // Professional Notes (Session Storage) Logic Delegating to Storage Module
    // -------------------------------------------------------------
    function getNotesSessionKey(key) {
      return storage.getNotesSessionKey ? storage.getNotesSessionKey(key) : `poli_piercing_notes_${key}`;
    }

    function loadProfessionalNotes(key) {
      if (!professionalNotesArea) return;
      var savedNote = storage.loadProfessionalNotes ? storage.loadProfessionalNotes(key) : '';

      professionalNotesArea.value = savedNote;
      if (notesSaveStatus) {
        if (savedNote.trim().length > 0) {
          notesSaveStatus.textContent = window.translate ? window.translate('guide.notes_loaded', null, 'Notes loaded for this session') : 'Notes loaded for this session';
          notesSaveStatus.className = 'notes-status-text notes-status--saved';
        } else {
          notesSaveStatus.textContent = window.translate ? window.translate('guide.notes_none', null, 'No notes recorded for this piercing') : 'No notes recorded for this piercing';
          notesSaveStatus.className = 'notes-status-text';
        }
      }
    }

    function saveProfessionalNotes(key, text) {
      if (storage.saveProfessionalNotes) {
        storage.saveProfessionalNotes(key, text);
      }
      if (notesSaveStatus) {
        if (text && text.trim().length > 0) {
          notesSaveStatus.textContent = window.translate ? window.translate('guide.notes_saved', null, 'Saved to session storage') : 'Saved to session storage';
          notesSaveStatus.className = 'notes-status-text notes-status--saved';
        } else {
          notesSaveStatus.textContent = window.translate ? window.translate('guide.notes_cleared', null, 'Note cleared') : 'Note cleared';
          notesSaveStatus.className = 'notes-status-text';
        }
      }
    }

    if (professionalNotesArea) {
      professionalNotesArea.addEventListener('input', function () {
        saveProfessionalNotes(activePiercingKey, this.value);
      });
    }

    if (clearNotesBtn) {
      clearNotesBtn.addEventListener('click', function () {
        if (professionalNotesArea) {
          professionalNotesArea.value = '';
          saveProfessionalNotes(activePiercingKey, '');
          professionalNotesArea.focus();
        }
      });
    }

    // -------------------------------------------------------------
    // Reset All Defaults Helper
    // -------------------------------------------------------------
    function resetAllWorkspaceDefaults() {
      if (storage.resetAllWorkspaceDefaults) {
        storage.resetAllWorkspaceDefaults();
      }

      // Reset runtime memory state variables
      activePiercingKey = 'earlobe';
      currentUnit = 'metric';
      isCompareMode = false;
      comparePiercingKeyA = 'earlobe';
      comparePiercingKeyB = 'helix';
      recentPiercings = ['earlobe'];
      currentVisualizerAngle = 90;
      currentMeasuredThickness = 5.0;
      isFineTuneMode = false;

      if (caliperFineTuneBar) caliperFineTuneBar.style.display = 'none';
      if (toggleFineTuneBtn) {
        toggleFineTuneBtn.classList.remove('active');
        toggleFineTuneBtn.setAttribute('aria-pressed', 'false');
        toggleFineTuneBtn.innerHTML = '🔬 Fine-Tune (0.1mm)';
      }

      // Reset symmetry controls to clinical defaults
      symOverlays.landmarks = true;
      symOverlays.caliper = true;
      symOverlays.targets = true;

      if (symmetryPairSelect) symmetryPairSelect.value = 'lobes';

      if (symTabLandmarks && symTabSimulator) {
        symTabLandmarks.classList.add('active');
        symTabLandmarks.setAttribute('aria-selected', 'true');
        symTabSimulator.classList.remove('active');
        symTabSimulator.setAttribute('aria-selected', 'false');
        if (symLandmarkPanel) symLandmarkPanel.style.display = 'block';
        if (symSimulatorPanel) symSimulatorPanel.style.display = 'none';
      }

      if (symToggleLandmarksBtn) symToggleLandmarksBtn.classList.add('active');
      if (symToggleCaliperBtn) symToggleCaliperBtn.classList.add('active');
      if (symToggleTargetsBtn) symToggleTargetsBtn.classList.add('active');

      // Update unit UI and compare workspace
      updateUnitUI();
      if (compareWorkspace) compareWorkspace.hidden = true;
      if (compareModeToggleBtn) {
        compareModeToggleBtn.classList.remove('active');
        compareModeToggleBtn.setAttribute('aria-pressed', 'false');
        if (compareModeBtnText) compareModeBtnText.textContent = window.translate ? window.translate('guide.compare_mode', null, 'Compare Mode') : 'Compare Mode';
      }

      // Reset search filter
      if (piercingSearchInput) {
        piercingSearchInput.value = '';
        var searchEvent = new Event('input', { bubbles: true });
        piercingSearchInput.dispatchEvent(searchEvent);
      }

      // Activate baseline piercing
      selectPiercing('earlobe', true);
      renderRecentPiercingsChips();
      updateSymmetryLandmarkUI();
      updateSymmetryUI();
      saveWorkspaceState();

      // Visual feedback on Reset All button
      if (resetAllBtn) {
        var origHtml = resetAllBtn.innerHTML;
        resetAllBtn.innerHTML = '<span class="reset-icon">✅</span> <span class="reset-text">Reset Done</span>';
        setTimeout(function () {
          resetAllBtn.innerHTML = origHtml;
        }, 1500);
      }
    }

    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', resetAllWorkspaceDefaults);
    }

    // -------------------------------------------------------------
    // Event Listeners Wiring
    // -------------------------------------------------------------

    // Studio House Standards Preferences Controls
    if (openStudioPrefModalBtn) {
      openStudioPrefModalBtn.addEventListener('click', openStudioPreferenceModal);
    }
    if (closeStudioPrefModalBtn) {
      closeStudioPrefModalBtn.addEventListener('click', closeStudioPreferenceModal);
    }
    if (cancelStudioPrefBtn) {
      cancelStudioPrefBtn.addEventListener('click', closeStudioPreferenceModal);
    }
    if (studioPrefModal) {
      studioPrefModal.addEventListener('click', function (e) {
        if (e.target === studioPrefModal) {
          closeStudioPreferenceModal();
        }
      });
    }
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && studioPrefModal && studioPrefModal.style.display === 'flex') {
        closeStudioPreferenceModal();
      }
    });
    if (studioPrefForm) {
      studioPrefForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var gaugeVal = houseGaugeSelect ? houseGaugeSelect.value : '16G';
        var jewelryTypeVal = houseJewelryTypeSelect ? houseJewelryTypeSelect.value : '';
        var notesVal = houseNotesInput ? houseNotesInput.value.trim() : '';

        saveStudioPreference(activePiercingKey, {
          gauge: gaugeVal,
          jewelryType: jewelryTypeVal,
          notes: notesVal
        });


        closeStudioPreferenceModal();
        updateStudioPreferenceStatus();
        updateVisualizerAndCalculations();
        updateBaselineSpecs();
        updateJewelryUI();
      });
    }
    if (resetStudioPrefBtn) {
      resetStudioPrefBtn.addEventListener('click', function () {
        resetStudioPreference(activePiercingKey);
        updateStudioPreferenceStatus();
        updateVisualizerAndCalculations();
        updateBaselineSpecs();
        updateJewelryUI();
      });
    }


    // Unit System Toggles
    if (unitToggleBtn) {
      unitToggleBtn.addEventListener('click', toggleUnitSystem);
    }
    if (unitToggleQuickBtn) {
      unitToggleQuickBtn.addEventListener('click', toggleUnitSystem);
    }

    // Compare Mode Controls
    if (compareModeToggleBtn) {
      compareModeToggleBtn.addEventListener('click', function () {
        setCompareMode(!isCompareMode, true);
      });
    }
    if (exitCompareBtn) {
      exitCompareBtn.addEventListener('click', function () {
        setCompareMode(false, true);
      });
    }
    if (comparePrintBtn) {
      comparePrintBtn.addEventListener('click', generateAndPrintComparisonSheet);
    }

    if (compareSelectA) {
      compareSelectA.addEventListener('change', function () {
        comparePiercingKeyA = this.value;
        updateCompareWorkspace();
        saveWorkspaceState();
      });
    }

    if (compareSelectB) {
      compareSelectB.addEventListener('change', function () {
        comparePiercingKeyB = this.value;
        updateCompareWorkspace();
        saveWorkspaceState();
      });
    }

    comparePresetPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var pairStr = this.getAttribute('data-pair');
        if (!pairStr) return;
        var parts = pairStr.split(',');
        if (parts.length === 2) {
          comparePiercingKeyA = parts[0];
          comparePiercingKeyB = parts[1];
          if (compareSelectA) compareSelectA.value = comparePiercingKeyA;
          if (compareSelectB) compareSelectB.value = comparePiercingKeyB;
          updateCompareWorkspace();
          saveWorkspaceState();
        }
      });
    });

    // Piercing Button Click
    piercingButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-piercing');
        if (isCompareMode) {
          setCompareMode(false, false);
        }
        selectPiercing(key, true);
      });
    });

    // Real-time Search Input Filter
    if (piercingSearchInput) {
      piercingSearchInput.addEventListener('input', function () {
        var query = this.value.toLowerCase().trim();
        piercingButtons.forEach(function (btn) {
          var key = btn.getAttribute('data-piercing');
          var data = piercingData[key];
          if (!data) return;
          var name = (data.name || '').toLowerCase();
          var category = (data.category || '').toLowerCase();
          var tissue = (data.tissueType || '').toLowerCase();
          var match = name.includes(query) || category.includes(query) || tissue.includes(query) || key.includes(query);
          btn.style.display = match ? '' : 'none';
        });
      });
    }

    // -------------------------------------------------------------
    // Interactive Dynamic Angle Dragging Engine
    // -------------------------------------------------------------
    var isDraggingAngle = false;

    function getAngleFromPointerEvent(e, container) {
      if (!container) return currentVisualizerAngle;
      var rect = container.getBoundingClientRect();
      var clientX = e.clientX;
      var clientY = e.clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }

      // Normalized coordinates mapped to SVG viewBox (360 x 300)
      var svgX = ((clientX - rect.left) / rect.width) * 360;
      var svgY = ((clientY - rect.top) / rect.height) * 300;

      var centerX = 180;
      var centerY = 140;
      var dx = svgX - centerX;
      var dy = svgY - centerY;

      // Handle both top anterior handle and bottom posterior handle dragging
      var angleRad;
      if (dy < 0) {
        angleRad = Math.atan2(-dy, -dx);
      } else {
        angleRad = Math.atan2(dy, dx);
      }

      var deg = Math.round((angleRad * 180) / Math.PI);
      if (deg < 30) deg = 30;
      if (deg > 150) deg = 150;
      return deg;
    }

    function handleAngleDragStart(e) {
      if (e.type === 'touchstart' || e.type === 'pointerdown') {
        if (e.cancelable && e.type !== 'pointerdown') e.preventDefault();
      }
      isDraggingAngle = true;
      if (v2SvgCanvasContainer) {
        v2SvgCanvasContainer.classList.add('is-dragging');
        if (v2SvgCanvasContainer.setPointerCapture && e.pointerId) {
          try { v2SvgCanvasContainer.setPointerCapture(e.pointerId); } catch (err) {}
        }
      }
      var newAngle = getAngleFromPointerEvent(e, v2SvgCanvasContainer);
      if (newAngle !== currentVisualizerAngle) {
        currentVisualizerAngle = newAngle;
        updateVisualizerAndCalculations();
      }
    }

    function handleAngleDragMove(e) {
      if (!isDraggingAngle) return;
      if (e.cancelable) e.preventDefault();
      var newAngle = getAngleFromPointerEvent(e, v2SvgCanvasContainer);
      if (newAngle !== currentVisualizerAngle) {
        currentVisualizerAngle = newAngle;
        updateVisualizerAndCalculations();
      }
    }

    function handleAngleDragEnd(e) {
      if (!isDraggingAngle) return;
      isDraggingAngle = false;
      if (v2SvgCanvasContainer) {
        v2SvgCanvasContainer.classList.remove('is-dragging');
        if (v2SvgCanvasContainer.releasePointerCapture && e.pointerId) {
          try { v2SvgCanvasContainer.releasePointerCapture(e.pointerId); } catch (err) {}
        }
      }
      saveWorkspaceState();
    }

    // Attach Pointer and Touch Listeners to Dynamic Visualizer Canvas
    if (v2SvgCanvasContainer) {
      v2SvgCanvasContainer.addEventListener('pointerdown', handleAngleDragStart);
      window.addEventListener('pointermove', handleAngleDragMove);
      window.addEventListener('pointerup', handleAngleDragEnd);
      window.addEventListener('pointercancel', handleAngleDragEnd);

      v2SvgCanvasContainer.addEventListener('touchstart', handleAngleDragStart, { passive: false });
      window.addEventListener('touchmove', handleAngleDragMove, { passive: false });
      window.addEventListener('touchend', handleAngleDragEnd);
      window.addEventListener('touchcancel', handleAngleDragEnd);
    }

    // -------------------------------------------------------------
    // Diagram Export Handlers (SVG & PNG for Client Consultation Notes)
    // -------------------------------------------------------------
    function downloadAngleVisualizerSvg() {
      if (!v2SvgCanvasContainer) return;
      var svgEl = v2SvgCanvasContainer.querySelector('svg');
      if (!svgEl) return;

      var serializer = new XMLSerializer();
      var svgString = serializer.serializeToString(svgEl);
      var blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = `poli-${activePiercingKey}-${currentVisualizerAngle}deg-diagram.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (downloadAngleDiagramSvgBtn) {
        var orig = downloadAngleDiagramSvgBtn.innerHTML;
        downloadAngleDiagramSvgBtn.innerHTML = '✅ Saved SVG';
        setTimeout(function () { downloadAngleDiagramSvgBtn.innerHTML = orig; }, 1500);
      }
    }

    function downloadAngleVisualizerPng() {
      if (!v2SvgCanvasContainer) return;
      var svgEl = v2SvgCanvasContainer.querySelector('svg');
      if (!svgEl) return;

      var serializer = new XMLSerializer();
      var svgString = serializer.serializeToString(svgEl);
      var svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      var url = URL.createObjectURL(svgBlob);

      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = 960;
        canvas.height = 780;
        var ctx = canvas.getContext('2d');

        // Dark slate neutral canvas background for consultation notes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header title for client notes
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        var pData = piercingData[activePiercingKey] || piercingData['earlobe'];
        ctx.fillText(`POLI INTERNATIONAL - ${pData.name.toUpperCase()} (${currentVisualizerAngle}°)`, 40, 45);

        // Draw scaled SVG diagram onto canvas
        ctx.drawImage(img, 40, 60, 880, 680);
        URL.revokeObjectURL(url);

        canvas.toBlob(function (blob) {
          if (!blob) return;
          var pngUrl = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = pngUrl;
          a.download = `poli-${activePiercingKey}-${currentVisualizerAngle}deg-diagram.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);

          if (downloadAngleDiagramPngBtn) {
            var orig = downloadAngleDiagramPngBtn.innerHTML;
            downloadAngleDiagramPngBtn.innerHTML = '✅ Saved PNG';
            setTimeout(function () { downloadAngleDiagramPngBtn.innerHTML = orig; }, 1500);
          }
        }, 'image/png');
      };
      img.src = url;
    }

    if (downloadAngleDiagramSvgBtn) {
      downloadAngleDiagramSvgBtn.addEventListener('click', downloadAngleVisualizerSvg);
    }
    if (downloadAngleDiagramPngBtn) {
      downloadAngleDiagramPngBtn.addEventListener('click', downloadAngleVisualizerPng);
    }

    // -------------------------------------------------------------
    // Smooth Dynamic Angle Animation & Sweep Stress Demonstration
    // -------------------------------------------------------------
    var angleAnimationId = null;
    var isAngleSweepRunning = false;

    function stopAngleAnimation() {
      if (angleAnimationId) {
        cancelAnimationFrame(angleAnimationId);
        angleAnimationId = null;
      }
    }

    function stopSweepAnimation() {
      isAngleSweepRunning = false;
      stopAngleAnimation();
      if (visualizerAnimateAngleBtn) {
        visualizerAnimateAngleBtn.classList.remove('active');
      }
      if (visualizerAnimateIcon) {
        visualizerAnimateIcon.textContent = '▶';
      }
      if (visualizerAnimateText) {
        var t = window.translate || function (k, p, d) { return d; };
        visualizerAnimateText.textContent = t('visualizer.animate_sweep_label', null, 'Animate Shift');
      }
    }

    function smoothAnimateAngleTo(targetAngle, duration, onComplete) {
      stopAngleAnimation();
      var startAngle = currentVisualizerAngle;
      var diff = targetAngle - startAngle;
      if (Math.abs(diff) < 0.1) {
        currentVisualizerAngle = targetAngle;
        updateVisualizerAndCalculations();
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      var startTime = performance.now();
      var animDuration = duration || 450;

      function step(now) {
        var elapsed = now - startTime;
        var progress = Math.min(1, elapsed / animDuration);
        // easeInOutQuad
        var ease = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        currentVisualizerAngle = Math.round(startAngle + diff * ease);
        updateVisualizerAndCalculations();

        if (progress < 1) {
          angleAnimationId = requestAnimationFrame(step);
        } else {
          currentVisualizerAngle = targetAngle;
          updateVisualizerAndCalculations();
          angleAnimationId = null;
          if (typeof onComplete === 'function') onComplete();
        }
      }

      angleAnimationId = requestAnimationFrame(step);
    }

    function startSweepAnimation() {
      isAngleSweepRunning = true;
      if (visualizerAnimateAngleBtn) {
        visualizerAnimateAngleBtn.classList.add('active');
      }
      if (visualizerAnimateIcon) {
        visualizerAnimateIcon.textContent = '⏸';
      }

      // Sweep keyframe sequence: 75° (-15°) -> 105° (+15°) -> 90° (Flush)
      var sequence = [75, 105, 90];
      var seqIndex = 0;

      function nextStep() {
        if (!isAngleSweepRunning) return;
        var target = sequence[seqIndex];
        seqIndex = (seqIndex + 1) % sequence.length;
        smoothAnimateAngleTo(target, 750, function () {
          if (!isAngleSweepRunning) return;
          setTimeout(function () {
            if (isAngleSweepRunning) nextStep();
          }, 350);
        });
      }

      nextStep();
    }

    // -------------------------------------------------------------
    // Reset Visualizer Action
    // -------------------------------------------------------------
    function resetAngleVisualizer() {
      stopSweepAnimation();
      activeJewelryOptionId = null;
      smoothAnimateAngleTo(90, 400, function () {
        updateJewelryUI();
        saveWorkspaceState();
      });

      if (resetAngleVisualizerBtn) {
        var orig = resetAngleVisualizerBtn.innerHTML;
        resetAngleVisualizerBtn.innerHTML = '✅ Reset Done';
        setTimeout(function () { resetAngleVisualizerBtn.innerHTML = orig; }, 1200);
      }
    }

    if (resetAngleVisualizerBtn) {
      resetAngleVisualizerBtn.addEventListener('click', resetAngleVisualizer);
    }

    // -------------------------------------------------------------
    // Sub-Millimeter (0.1mm) Fine-Tune Mode Logic
    // -------------------------------------------------------------
    function toggleFineTuneMode() {
      isFineTuneMode = !isFineTuneMode;
      if (caliperFineTuneBar) {
        caliperFineTuneBar.style.display = isFineTuneMode ? 'flex' : 'none';
      }
      if (toggleFineTuneBtn) {
        if (isFineTuneMode) {
          toggleFineTuneBtn.classList.add('active');
          toggleFineTuneBtn.setAttribute('aria-pressed', 'true');
          toggleFineTuneBtn.innerHTML = '🔬 Fine-Tune: ON (0.1mm)';
        } else {
          toggleFineTuneBtn.classList.remove('active');
          toggleFineTuneBtn.setAttribute('aria-pressed', 'false');
          toggleFineTuneBtn.innerHTML = '🔬 Fine-Tune (0.1mm)';
        }
      }
      if (caliperThicknessSlider) {
        caliperThicknessSlider.step = isFineTuneMode ? '0.1' : '0.5';
      }
      if (caliperPrecisionInput) {
        caliperPrecisionInput.value = currentMeasuredThickness.toFixed(1);
      }
    }

    function adjustCaliperThickness(delta) {
      var pData = piercingData[activePiercingKey] || piercingData['earlobe'];
      var tRange = pData.tissueThicknessRange || [2.0, 16.0, 6.0];
      var min = tRange[0];
      var max = tRange[1];

      var newThickness = Math.round((currentMeasuredThickness + delta) * 10) / 10;
      if (newThickness < min) newThickness = min;
      if (newThickness > max) newThickness = max;

      currentMeasuredThickness = newThickness;
      if (caliperPrecisionInput) {
        caliperPrecisionInput.value = currentMeasuredThickness.toFixed(1);
      }
      updateVisualizerAndCalculations();
      saveWorkspaceState();
    }

    if (toggleFineTuneBtn) {
      toggleFineTuneBtn.addEventListener('click', toggleFineTuneMode);
    }
    if (stepperMinus05Btn) {
      stepperMinus05Btn.addEventListener('click', function () { adjustCaliperThickness(-0.5); });
    }
    if (stepperMinus01Btn) {
      stepperMinus01Btn.addEventListener('click', function () { adjustCaliperThickness(-0.1); });
    }
    if (stepperPlus01Btn) {
      stepperPlus01Btn.addEventListener('click', function () { adjustCaliperThickness(0.1); });
    }
    if (stepperPlus05Btn) {
      stepperPlus05Btn.addEventListener('click', function () { adjustCaliperThickness(0.5); });
    }
    if (caliperPrecisionInput) {
      caliperPrecisionInput.addEventListener('change', function () {
        var val = parseFloat(this.value);
        if (!isNaN(val)) {
          var pData = piercingData[activePiercingKey] || piercingData['earlobe'];
          var tRange = pData.tissueThicknessRange || [2.0, 16.0, 6.0];
          if (val < tRange[0]) val = tRange[0];
          if (val > tRange[1]) val = tRange[1];
          currentMeasuredThickness = Math.round(val * 10) / 10;
          this.value = currentMeasuredThickness.toFixed(1);
          updateVisualizerAndCalculations();
          saveWorkspaceState();
        }
      });
    }

    // Angle Slider Live Input
    if (angleRangeSlider) {
      angleRangeSlider.addEventListener('input', function () {
        stopSweepAnimation();
        stopAngleAnimation();
        currentVisualizerAngle = parseInt(this.value, 10);
        updateVisualizerAndCalculations();
      });
    }

    // Angle Preset Pills Click
    anglePresetBtns.forEach(function (pill) {
      if (pill.id === 'visualizerAnimateAngleBtn') return;
      pill.addEventListener('click', function () {
        stopSweepAnimation();
        var offset = parseInt(this.getAttribute('data-angle-offset'), 10);
        smoothAnimateAngleTo(90 + offset, 450);
      });
    });

    // Angle Sweep Demonstration Button Click
    if (visualizerAnimateAngleBtn) {
      visualizerAnimateAngleBtn.addEventListener('click', function () {
        if (isAngleSweepRunning) {
          stopSweepAnimation();
        } else {
          startSweepAnimation();
        }
      });
    }

    // Caliper Thickness Slider Live Input
    if (caliperThicknessSlider) {
      caliperThicknessSlider.addEventListener('input', function () {
        currentMeasuredThickness = parseFloat(this.value);
        updateVisualizerAndCalculations();
      });
    }

    // Error Mode Tabs Click
    errorTabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = this.getAttribute('data-error-mode');
        updateErrorModeUI(mode);
        try {
          localStorage.setItem('poli_piercing_error_mode', mode);
        } catch (e) {}
      });
    });

    // Symmetry Tabs & Mode Switching
    if (symTabLandmarks && symTabSimulator) {
      symTabLandmarks.addEventListener('click', function () {
        symTabLandmarks.classList.add('active');
        symTabLandmarks.setAttribute('aria-selected', 'true');
        symTabSimulator.classList.remove('active');
        symTabSimulator.setAttribute('aria-selected', 'false');

        if (symLandmarkPanel) symLandmarkPanel.style.display = 'block';
        if (symSimulatorPanel) symSimulatorPanel.style.display = 'none';

        updateSymmetryLandmarkUI();
        saveWorkspaceState();
      });

      symTabSimulator.addEventListener('click', function () {
        symTabSimulator.classList.add('active');
        symTabSimulator.setAttribute('aria-selected', 'true');
        symTabLandmarks.classList.remove('active');
        symTabLandmarks.setAttribute('aria-selected', 'false');

        if (symSimulatorPanel) symSimulatorPanel.style.display = 'block';
        if (symLandmarkPanel) symLandmarkPanel.style.display = 'none';

        updateSymmetryUI();
        saveWorkspaceState();
      });
    }

    // Symmetry Visualizer Overlay Toggles
    if (symToggleLandmarksBtn) {
      symToggleLandmarksBtn.addEventListener('click', function () {
        symOverlays.landmarks = !symOverlays.landmarks;
        if (symOverlays.landmarks) {
          symToggleLandmarksBtn.classList.add('active');
        } else {
          symToggleLandmarksBtn.classList.remove('active');
        }
        updateSymmetryLandmarkUI();
      });
    }

    if (symToggleCaliperBtn) {
      symToggleCaliperBtn.addEventListener('click', function () {
        symOverlays.caliper = !symOverlays.caliper;
        if (symOverlays.caliper) {
          symToggleCaliperBtn.classList.add('active');
        } else {
          symToggleCaliperBtn.classList.remove('active');
        }
        updateSymmetryLandmarkUI();
      });
    }

    if (symToggleTargetsBtn) {
      symToggleTargetsBtn.addEventListener('click', function () {
        symOverlays.targets = !symOverlays.targets;
        if (symOverlays.targets) {
          symToggleTargetsBtn.classList.add('active');
        } else {
          symToggleTargetsBtn.classList.remove('active');
        }
        updateSymmetryLandmarkUI();
      });
    }

    // Symmetry Caliper Controls Listeners
    if (symmetryPairSelect) {
      symmetryPairSelect.addEventListener('change', function () {
        updateSymmetryUI();
        saveWorkspaceState();
      });
    }
    if (symLeftAngleSlider) {
      symLeftAngleSlider.addEventListener('input', updateSymmetryUI);
    }
    if (symRightAngleSlider) {
      symRightAngleSlider.addEventListener('input', updateSymmetryUI);
    }
    if (symHeightOffsetSlider) {
      symHeightOffsetSlider.addEventListener('input', updateSymmetryUI);
    }

    // Copy Clinical Summary Action
    if (copySummaryBtn) {
      copySummaryBtn.addEventListener('click', function () {
        var data = piercingData[activePiercingKey] || piercingData['earlobe'];
        var metrics = calculateChannelMetrics(activePiercingKey, currentMeasuredThickness, currentVisualizerAngle);

        var summary = `POLI INTERNATIONAL - CLINICAL PIERCING SPECIFICATION
Placement: ${data.name} (${data.category || 'Body Piercing'})
Optimal Angle: ${data.optimalAngle} (${data.angleTolerance || '±2°'})
Measured Tissue Thickness: ${formatMm(metrics.measuredThickness, true)}
Resulting Channel Depth: ${formatMm(metrics.channelDepth, true)}
Initial Gauge Standard: ${data.jewelryGauge}
Tissue Type: ${data.tissueType}
Healing Timeline: ${data.healingTime}
Downsize Milestone: ${data.downsizeTime}
Anatomical Rationale: ${data.whyThisAngle}
Clinical Risk of Off-Angle: ${data.badAngleConsequence}
Jewelry length and fit: https://poliinternational.com/jewelry-size-visualizer/
Reference: Poli International Piercing Angle & Depth Guide`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(summary).then(function () {
            var orig = copySummaryBtn.innerHTML;
            copySummaryBtn.innerHTML = '✅ Copied to Clipboard!';
            setTimeout(function () { copySummaryBtn.innerHTML = orig; }, 2000);
          });
        }
      });
    }

    // Print / Download as PDF Actions
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', generateAndPrintClinicalSheet);
    }
    if (print1PageSheetBtn) {
      print1PageSheetBtn.addEventListener('click', generateAndPrintClinicalSheet);
    }

    // Download Structured JSON Specification Action
    function downloadPiercingJson() {
      var data = piercingData[activePiercingKey] || piercingData['earlobe'];
      var metrics = calculateChannelMetrics(activePiercingKey, currentMeasuredThickness, currentVisualizerAngle);
      var currentNote = '';
      if (professionalNotesArea) {
        currentNote = professionalNotesArea.value;
      }

      var exportPayload = {
        application: "Poli International Piercing Angle & Depth Guide",
        publisher: "Poli International",
        version: "2.5.0",
        exportTimestamp: new Date().toISOString(),
        piercing: {
          key: activePiercingKey,
          name: data.name,
          category: data.category || 'Body Piercing',
          tissueType: data.tissueType,
          optimalAngle: data.optimalAngle,
          angleTolerance: data.angleTolerance || '±2°',
          currentSimulatedAngle: currentVisualizerAngle + '°',
          angleDeviationFromBaseline: (currentVisualizerAngle - 90) + '°'
        },
        measurements: {
          measuredTissueThicknessMm: metrics.measuredThickness,
          resultingChannelDepthMm: metrics.channelDepth,
          displayUnit: currentUnit
        },
        jewelry: {
          recommendedGauge: data.jewelryGauge,
          recommendedType: data.jewelryType,
          recommendedInitialLength: data.jewelryLength,
          typicalDownsizeTiming: data.downsizeTime
        },
        clinicalGuidance: {
          anatomicalRationale: data.whyThisAngle,
          riskOfOffAngle: data.badAngleConsequence,
          clientPositioning: data.positioning,
          piercingTechnique: data.technique,
          anatomicalContraindications: data.refusalCriteria,
          expectedHealingTimeline: data.healingTime
        },
        practitionerNotes: currentNote || null
      };

      var jsonStr = JSON.stringify(exportPayload, null, 2);
      var blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = `poli-${activePiercingKey}-specification.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      var btns = [downloadJsonBtn, notesDownloadJsonBtn, mainDownloadJsonBtn];
      btns.forEach(function (btn) {
        if (!btn) return;
        var origHtml = btn.innerHTML;
        btn.innerHTML = '✅ Exported JSON';
        setTimeout(function () {
          btn.innerHTML = origHtml;
        }, 1800);
      });
    }

    if (downloadJsonBtn) {
      downloadJsonBtn.addEventListener('click', downloadPiercingJson);
    }
    if (notesDownloadJsonBtn) {
      notesDownloadJsonBtn.addEventListener('click', downloadPiercingJson);
    }
    if (mainDownloadJsonBtn) {
      mainDownloadJsonBtn.addEventListener('click', downloadPiercingJson);
    }

    // Dynamic re-render on language change
    window.addEventListener('languageChanged', function () {
      // selectPiercing resets the visualizer; a language switch must keep the user's angle and thickness.
      var keepAngle = currentVisualizerAngle, keepThickness = currentMeasuredThickness;
      selectPiercing(activePiercingKey, false);
      currentVisualizerAngle = keepAngle;
      currentMeasuredThickness = keepThickness;
      updateVisualizerAndCalculations();
      populateCompareSelects();
      if (isCompareMode) {
        updateCompareWorkspace();
      }
      var activeErrorBtn = document.querySelector('.error-tab-btn.active');
      var curErrorMode = activeErrorBtn ? activeErrorBtn.getAttribute('data-error-mode') : 'optimal';
      updateErrorModeUI(curErrorMode);
      updateSymmetryLandmarkUI();
      updateSymmetryUI();
      if (window.Anatomy3DExplorer && typeof window.Anatomy3DExplorer.syncActivePiercing === 'function') {
        window.Anatomy3DExplorer.syncActivePiercing(activePiercingKey);
      }
    });

    // Initial Load Execution and State Restoration
    populateCompareSelects();
    loadSavedWorkspaceState();
    updateUnitUI();

    // Initialize 3D Anatomy Model if present
    if (window.Anatomy3DExplorer && typeof window.Anatomy3DExplorer.init === 'function') {
      window.Anatomy3DExplorer.init(function (piercingKey) {
        selectPiercing(piercingKey, true);
      });
    }

    try {
      var savedSymTab = localStorage.getItem('poli_piercing_sym_tab');
      if (savedSymTab === 'simulator' && symTabSimulator) {
        symTabSimulator.click();
      }
      var savedSymPair = localStorage.getItem('poli_piercing_sym_pair');
      if (savedSymPair && symmetryPairSelect) {
        symmetryPairSelect.value = savedSymPair;
      }
    } catch (e) {}

    if (isCompareMode) {
      setCompareMode(true, false);
    } else {
      selectPiercing(activePiercingKey, false);
    }

    updateSymmetryUI();

    // Expose selectPiercing for external components (like Anatomy 3D Explorer)
    window.selectPiercingGlobal = function (key, scroll) {
      selectPiercing(key, scroll);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
