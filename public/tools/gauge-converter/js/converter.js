/**
 * Professional Gauge Converter & Size Chart - JavaScript Logic v2.0
 * Poli International
 *
 * Implements:
 * 1. Honest table data with supplier dual-values (10g: 2.4/2.5 mm, 2g: 6.0/6.5 mm, 00g: 9.5/10.0 mm).
 * 2. Stretched sizes above 00G (11, 12, 14, 16, 19, 22, 25 mm) with nearest common fraction.
 * 3. Screen card calibration (ISO/IEC 7810 ID-1, 85.60 mm) with persistent storage and 96 DPI fallback.
 * 4. Reverse caliper lookup from measured thickness to nearest gauge and difference in mm.
 * 5. Printable 1-page true-scale wall chart with 50 mm verification bar.
 * 6. Dynamic full redraw upon language switch while preserving user inputs.
 */

'use strict';

(function () {
  // ============================================
  // CONSTANTS & TABLE DEFINITIONS
  // ============================================

  const MM_PER_INCH = 25.4;
  const DEFAULT_DPI = 96;
  const DEFAULT_PX_PER_MM = DEFAULT_DPI / MM_PER_INCH; // ~3.7795
  const CARD_WIDTH_MM = 85.60; // ISO/IEC 7810 ID-1 card width
  const CALIBRATION_STORAGE_KEY = 'poli_screen_px_per_mm';
  const SVG_VIEWBOX_UNITS = 300;
  const SVG_CENTER = 150;
  const MAX_CIRCLE_RADIUS = 140;

  /**
   * Honest Gauge Table:
   * Body jewellery gauges are an industry convention derived from AWG with rounded mm values.
   * Dual supplier values noted where common practice differs.
   */
  const SIZES_DATA = [
    // Standard Wire Gauges
    { id: '22G', gauge: '22G', awgExact: 0.644, mm: 0.6, inchDec: 0.024, fraction: '1/40"', category: 'standard', placementKey: 'placement.nostril' },
    { id: '20G', gauge: '20G', awgExact: 0.812, mm: 0.8, inchDec: 0.031, fraction: '1/32"', category: 'standard', placementKey: 'placement.nostril' },
    { id: '18G', gauge: '18G', awgExact: 1.024, mm: 1.0, inchDec: 0.039, fraction: '3/64"', category: 'standard', placementKey: 'placement.earlobe' },
    { id: '16G', gauge: '16G', awgExact: 1.291, mm: 1.2, inchDec: 0.047, fraction: '3/64"', category: 'standard', placementKey: 'placement.cartilage_helix' },
    { id: '14G', gauge: '14G', awgExact: 1.628, mm: 1.6, inchDec: 0.063, fraction: '1/16"', category: 'standard', placementKey: 'placement.body_oral' },
    { id: '12G', gauge: '12G', awgExact: 2.053, mm: 2.0, inchDec: 0.079, fraction: '5/64"', category: 'standard', placementKey: 'placement.heavy_initial' },
    { id: '10G', gauge: '10G', awgExact: 2.588, mm: 2.4, dualMm: 2.5, inchDec: 0.094, fraction: '3/32"', category: 'standard', placementKey: 'placement.intermediate_stretch' },
    { id: '8G',  gauge: '8G',  awgExact: 3.264, mm: 3.2, inchDec: 0.126, fraction: '1/8"',  category: 'standard', placementKey: 'placement.lobe_stretch' },
    { id: '6G',  gauge: '6G',  awgExact: 4.115, mm: 4.0, inchDec: 0.157, fraction: '5/32"', category: 'standard', placementKey: 'placement.lobe_stretch' },
    { id: '4G',  gauge: '4G',  awgExact: 5.189, mm: 5.0, inchDec: 0.197, fraction: '3/16"', category: 'standard', placementKey: 'placement.lobe_stretch' },
    { id: '2G',  gauge: '2G',  awgExact: 6.544, mm: 6.0, dualMm: 6.5, inchDec: 0.236, fraction: '1/4"',  category: 'standard', placementKey: 'placement.heavy_lobe' },
    { id: '1G',  gauge: '1G',  awgExact: 7.348, mm: 7.0, inchDec: 0.276, fraction: '9/32"', category: 'standard', placementKey: 'placement.heavy_lobe' },
    { id: '0G',  gauge: '0G',  awgExact: 8.251, mm: 8.0, inchDec: 0.315, fraction: '5/16"', category: 'standard', placementKey: 'placement.heavy_lobe' },
    { id: '00G', gauge: '00G', awgExact: 9.266, mm: 10.0, dualMm: 9.5, inchDec: 0.394, fraction: '3/8"', category: 'standard', placementKey: 'placement.heavy_lobe' },

    // Stretched Sizes Above 00G (Millimetres & Nearest Common Fractional Inch)
    { id: '11mm', gauge: '11 mm', awgExact: null, mm: 11.0, inchDec: 0.433, fraction: '7/16"', category: 'stretched', placementKey: 'placement.large_stretched' },
    { id: '12mm', gauge: '12 mm', awgExact: null, mm: 12.0, inchDec: 0.472, fraction: '1/2"',  category: 'stretched', placementKey: 'placement.large_stretched' },
    { id: '14mm', gauge: '14 mm', awgExact: null, mm: 14.0, inchDec: 0.551, fraction: '9/16"', category: 'stretched', placementKey: 'placement.large_stretched' },
    { id: '16mm', gauge: '16 mm', awgExact: null, mm: 16.0, inchDec: 0.630, fraction: '5/8"',  category: 'stretched', placementKey: 'placement.large_stretched' },
    { id: '19mm', gauge: '19 mm', awgExact: null, mm: 19.0, inchDec: 0.748, fraction: '3/4"',  category: 'stretched', placementKey: 'placement.large_stretched' },
    { id: '22mm', gauge: '22 mm', awgExact: null, mm: 22.0, inchDec: 0.866, fraction: '7/8"',  category: 'stretched', placementKey: 'placement.large_stretched' },
    { id: '25mm', gauge: '25 mm', awgExact: null, mm: 25.0, inchDec: 0.984, fraction: '1"',    category: 'stretched', placementKey: 'placement.large_stretched' }
  ];

  // State
  let currentMm = null;
  let activeGaugeId = '';
  let activeInputType = null;
  let calibratedPxPerMm = null; // null => fallback probe/96 DPI

  /**
   * Helper translation accessor
   */
  function t(key, params) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key, params);
    }
    return key;
  }

  // ============================================
  // CALIBRATION LOGIC
  // ============================================

  function loadCalibration() {
    try {
      const stored = localStorage.getItem(CALIBRATION_STORAGE_KEY);
      if (stored) {
        const val = parseFloat(stored);
        if (!isNaN(val) && val > 1 && val < 30) {
          calibratedPxPerMm = val;
          return;
        }
      }
    } catch (e) {}
    calibratedPxPerMm = null;
  }

  function saveCalibration(pxPerMm) {
    if (isNaN(pxPerMm) || pxPerMm <= 1 || pxPerMm > 30) return;
    calibratedPxPerMm = pxPerMm;
    try {
      localStorage.setItem(CALIBRATION_STORAGE_KEY, pxPerMm.toFixed(4));
    } catch (e) {}
    updateVisualCircle();
    updateCalibrationStatusUI();
  }

  function resetCalibration() {
    calibratedPxPerMm = null;
    try {
      localStorage.removeItem(CALIBRATION_STORAGE_KEY);
    } catch (e) {}
    updateVisualCircle();
    updateCalibrationStatusUI();
  }

  function getActivePxPerMm() {
    if (calibratedPxPerMm !== null) {
      return calibratedPxPerMm;
    }
    // Probe measurement fallback
    try {
      const probe = document.createElement('div');
      probe.style.cssText = 'width:100mm;height:0;position:absolute;left:-9999px;top:-9999px;visibility:hidden;padding:0;border:0;';
      document.body.appendChild(probe);
      const measured = probe.getBoundingClientRect().width / 100;
      document.body.removeChild(probe);
      if (measured > 1 && measured < 30) return measured;
    } catch (e) {}
    return DEFAULT_PX_PER_MM;
  }

  function isCardCalibrated() {
    return calibratedPxPerMm !== null;
  }

  // ============================================
  // CONVERTER ARITHMETIC & UPDATES
  // ============================================

  function mmToDecimalInches(mm) {
    if (mm === null || isNaN(mm) || mm <= 0) return null;
    return parseFloat((mm / MM_PER_INCH).toFixed(3));
  }

  function inchesToMm(inches) {
    if (inches === null || isNaN(inches) || inches <= 0) return null;
    return parseFloat((inches * MM_PER_INCH).toFixed(2));
  }

  function findClosestSizeRecord(mm) {
    if (mm === null || isNaN(mm) || mm <= 0) return null;
    let closest = null;
    let minDiff = Infinity;

    for (const record of SIZES_DATA) {
      const diff1 = Math.abs(record.mm - mm);
      if (diff1 < minDiff) {
        minDiff = diff1;
        closest = { record, matchedMm: record.mm, diff: minDiff };
      }
      if (record.dualMm) {
        const diff2 = Math.abs(record.dualMm - mm);
        if (diff2 < minDiff) {
          minDiff = diff2;
          closest = { record, matchedMm: record.dualMm, diff: minDiff };
        }
      }
    }
    return closest;
  }

  // ============================================
  // UI RENDERING
  // ============================================

  function renderDropdown() {
    const select = document.getElementById('gauge-input');
    if (!select) return;

    const previousVal = select.value;
    select.innerHTML = '';

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = t('select.default_gauge');
    select.appendChild(defaultOpt);

    // Standard optgroup
    const stdGroup = document.createElement('optgroup');
    stdGroup.label = t('table.standard_category');
    SIZES_DATA.filter(s => s.category === 'standard').forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      if (item.dualMm) {
        opt.textContent = `${item.gauge} (${item.mm}/${item.dualMm} mm - ${item.fraction})`;
      } else {
        opt.textContent = `${item.gauge} (${item.mm} mm - ${item.fraction})`;
      }
      stdGroup.appendChild(opt);
    });
    select.appendChild(stdGroup);

    // Stretched optgroup
    const stretchGroup = document.createElement('optgroup');
    stretchGroup.label = t('table.stretched_category');
    SIZES_DATA.filter(s => s.category === 'stretched').forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `${item.gauge} (${item.mm} mm - ${t('select.approx')} ${item.fraction})`;
      stretchGroup.appendChild(opt);
    });
    select.appendChild(stretchGroup);

    if (previousVal) {
      select.value = previousVal;
    }
  }

  function renderTable() {
    const tableBody = document.getElementById('honest-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    SIZES_DATA.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = 'gauge-converter__table-row';
      tr.setAttribute('data-size-id', item.id);
      tr.setAttribute('tabindex', '0');
      tr.setAttribute('role', 'button');
      tr.setAttribute('aria-label', `${item.gauge}, ${item.mm} mm, ${item.fraction}`);

      if (item.id === activeGaugeId) {
        tr.classList.add('gauge-converter__table-row--active');
      }

      // Column 1: Gauge / Size
      const tdGauge = document.createElement('td');
      tdGauge.className = 'table-cell--bold';
      tdGauge.textContent = item.gauge;
      tr.appendChild(tdGauge);

      // Column 2: Derived AWG Exact (or dash)
      const tdAwg = document.createElement('td');
      tdAwg.textContent = item.awgExact !== null ? `${item.awgExact.toFixed(3)} mm` : '--';
      tr.appendChild(tdAwg);

      // Column 3: Industry mm (with dual notation if exists)
      const tdMm = document.createElement('td');
      if (item.dualMm) {
        tdMm.innerHTML = `<strong>${item.mm} mm</strong> / <strong>${item.dualMm} mm</strong><br><small class="table-cell__subtext">${t('table.dual_note', { val1: item.mm, val2: item.dualMm })}</small>`;
      } else {
        tdMm.textContent = `${item.mm} mm`;
      }
      tr.appendChild(tdMm);

      // Column 4: Approx Inches
      const tdInches = document.createElement('td');
      tdInches.textContent = `${item.inchDec.toFixed(3)}"`;
      tr.appendChild(tdInches);

      // Column 5: Nearest Common Fraction
      const tdFraction = document.createElement('td');
      tdFraction.textContent = item.fraction;
      tr.appendChild(tdFraction);

      // Column 6: Typical Starting Placements & Visualizer Link
      const tdPlacement = document.createElement('td');
      const placementText = document.createElement('span');
      placementText.textContent = t(item.placementKey);
      tdPlacement.appendChild(placementText);

      const spacer = document.createTextNode(' ');
      tdPlacement.appendChild(spacer);

      const visLink = document.createElement('a');
      visLink.href = 'https://poliinternational.com/jewelry-size-visualizer/';
      visLink.target = '_top';
      visLink.className = 'table-cell__link';
      visLink.textContent = `(${t('table.visualizer_link_text')})`;
      tdPlacement.appendChild(visLink);

      tr.appendChild(tdPlacement);

      // Click & Keyboard handlers
      tr.addEventListener('click', () => {
        selectSizeById(item.id);
      });
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectSizeById(item.id);
        }
      });

      tableBody.appendChild(tr);
    });
  }

  function updateVisualCircle() {
    const circle = document.getElementById('gauge-circle');
    const instructionEl = document.getElementById('visual-scale-instruction');
    if (!circle) return;

    if (currentMm === null || isNaN(currentMm) || currentMm <= 0) {
      circle.setAttribute('r', '0');
      if (instructionEl) {
        instructionEl.textContent = isCardCalibrated()
          ? t('visual.instruction_card')
          : t('visual.instruction_approx');
      }
      return;
    }

    const svg = circle.ownerSVGElement || circle.closest('svg');
    const renderedWidthPx = svg ? svg.getBoundingClientRect().width : SVG_VIEWBOX_UNITS;
    const unitsPerCssPx = renderedWidthPx > 0 ? (SVG_VIEWBOX_UNITS / renderedWidthPx) : 1;
    const pxPerMM = getActivePxPerMm();

    // Physical radius
    const radiusCssPx = (currentMm / 2) * pxPerMM;
    let radiusUnits = radiusCssPx * unitsPerCssPx;
    let scaledToFit = false;

    if (radiusUnits > MAX_CIRCLE_RADIUS) {
      radiusUnits = MAX_CIRCLE_RADIUS;
      scaledToFit = true;
    }

    circle.setAttribute('r', radiusUnits.toFixed(2));

    if (instructionEl) {
      if (scaledToFit) {
        instructionEl.textContent = t('visual.instruction_scaled');
      } else if (isCardCalibrated()) {
        instructionEl.textContent = t('visual.instruction_card');
      } else {
        instructionEl.textContent = t('visual.instruction_approx');
      }
    }
  }

  function updateMeasurementCards(gauge, mm, inches, fraction) {
    const dispGauge = document.querySelector('#display-gauge .gauge-converter__measurement-number');
    const dispMm = document.querySelector('#display-mm .gauge-converter__measurement-number');
    const dispInches = document.querySelector('#display-inches .gauge-converter__measurement-number');
    const dispFraction = document.querySelector('#display-fraction .gauge-converter__measurement-number');

    if (dispGauge) dispGauge.textContent = gauge || '--';
    if (dispMm) dispMm.textContent = mm !== null ? `${mm} mm` : '-- mm';
    if (dispInches) dispInches.textContent = inches !== null ? `${inches.toFixed(3)}" (${inches} in)` : '-- in';
    if (dispFraction) dispFraction.textContent = fraction || '--';
  }

  function updateCalibrationStatusUI() {
    const calibStatus = document.getElementById('calibration-status-badge');
    const resetBtn = document.getElementById('reset-calibration-btn');
    const calibBtn = document.getElementById('open-calibrate-modal');

    const calibrated = isCardCalibrated();
    if (calibStatus) {
      calibStatus.textContent = calibrated ? '✓ ' + t('visual.instruction_card') : t('visual.instruction_approx');
      calibStatus.className = 'calibration-status ' + (calibrated ? 'calibration-status--calibrated' : 'calibration-status--fallback');
    }
    if (resetBtn) {
      resetBtn.hidden = !calibrated;
      resetBtn.style.display = calibrated ? 'inline-flex' : 'none';
    }
    if (calibBtn) {
      calibBtn.textContent = calibrated ? t('visual.recalibrate_btn') : t('visual.calibrate_btn');
    }
  }

  function clearActiveTableRow() {
    document.querySelectorAll('.gauge-converter__table-row--active').forEach(r => {
      r.classList.remove('gauge-converter__table-row--active');
    });
  }

  function highlightTableRow(sizeId) {
    clearActiveTableRow();
    if (!sizeId) return;
    const target = document.querySelector(`.gauge-converter__table-row[data-size-id="${sizeId}"]`);
    if (target) {
      target.classList.add('gauge-converter__table-row--active');
    }
  }

  function selectSizeById(sizeId) {
    const record = SIZES_DATA.find(s => s.id === sizeId);
    if (!record) return;

    activeGaugeId = record.id;
    currentMm = record.mm;

    // Update inputs
    const select = document.getElementById('gauge-input');
    const mmInput = document.getElementById('mm-input');
    const inchInput = document.getElementById('inch-input');

    if (select) select.value = record.id;
    if (mmInput) mmInput.value = record.mm;
    if (inchInput) inchInput.value = record.inchDec.toFixed(3);

    hideError();
    highlightTableRow(record.id);
    updateVisualCircle();
    updateMeasurementCards(record.gauge, record.mm, record.inchDec, record.fraction);
  }

  // ============================================
  // REVERSE CALIPER LOOKUP
  // ============================================

  function handleCaliperCalculation() {
    const input = document.getElementById('caliper-input');
    const resultBox = document.getElementById('caliper-result-card');
    const resultText = document.getElementById('caliper-result-text');
    const errorEl = document.getElementById('caliper-error');

    if (!input || !resultBox || !resultText) return;

    const val = parseFloat(input.value);
    if (isNaN(val) || val <= 0 || val > 50) {
      if (errorEl) {
        errorEl.textContent = t('error.invalid_caliper');
        errorEl.style.display = 'block';
      }
      resultBox.style.display = 'none';
      return;
    }

    if (errorEl) errorEl.style.display = 'none';

    const match = findClosestSizeRecord(val);
    if (!match) return;

    const rec = match.record;
    const standardMm = match.matchedMm;
    const diff = Math.abs(val - standardMm);
    const diffFormatted = diff.toFixed(2);

    resultBox.style.display = 'block';

    if (diff < 0.03) {
      resultText.innerHTML = `<strong>${t('caliper.exact_match', { gauge: rec.gauge, mm: val.toFixed(2) })}</strong><br><span class="caliper-subtext">${t('caliper.supplier_variance_note')}</span>`;
    } else {
      const direction = val > standardMm ? t('caliper.larger') : t('caliper.smaller');
      resultText.innerHTML = `<strong>${t('caliper.closest_match', {
        gauge: rec.gauge,
        standardMm: standardMm.toFixed(2),
        diff: diffFormatted,
        direction: direction
      })}</strong><br><span class="caliper-subtext">${t('caliper.supplier_variance_note')}</span>`;
    }

    // Also populate main inputs so user sees the visual representation immediately
    currentMm = val;
    activeGaugeId = rec.id;
    const select = document.getElementById('gauge-input');
    const mmInput = document.getElementById('mm-input');
    const inchInput = document.getElementById('inch-input');

    if (select) select.value = rec.id;
    if (mmInput) mmInput.value = val;
    if (inchInput) inchInput.value = (val / MM_PER_INCH).toFixed(3);

    highlightTableRow(rec.id);
    updateVisualCircle();
    updateMeasurementCards(`~${rec.gauge}`, val, val / MM_PER_INCH, rec.fraction);
  }

  // ============================================
  // PRINTABLE TRUE-SCALE CHART
  // ============================================

  function renderPrintableChart() {
    const printContainer = document.getElementById('printable-chart-container');
    if (!printContainer) return;

    printContainer.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'print-sheet-header';
    header.innerHTML = `
      <h2 class="print-sheet-title">${t('print.header_title')}</h2>
      <p class="print-sheet-sub">${t('print.header_sub')}</p>
      <div class="print-calib-box">
        <span class="print-calib-label">${t('print.calib_ruler')} (50 mm):</span>
        <div class="print-calib-bar" style="width: 50mm; height: 4mm;"></div>
      </div>
    `;
    printContainer.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'print-sizes-grid';

    SIZES_DATA.forEach(item => {
      const card = document.createElement('div');
      card.className = 'print-size-item';

      // SVG True Scale Circle in mm units directly
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const boxSizeMm = Math.max(item.mm + 4, 14);
      svg.setAttribute('width', `${boxSizeMm}mm`);
      svg.setAttribute('height', `${boxSizeMm}mm`);
      svg.setAttribute('viewBox', `0 0 ${boxSizeMm} ${boxSizeMm}`);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', (boxSizeMm / 2).toString());
      circle.setAttribute('cy', (boxSizeMm / 2).toString());
      circle.setAttribute('r', (item.mm / 2).toString());
      circle.setAttribute('class', 'print-circle');

      svg.appendChild(circle);
      card.appendChild(svg);

      const info = document.createElement('div');
      info.className = 'print-size-info';
      if (item.dualMm) {
        info.innerHTML = `<strong>${item.gauge}</strong><br><span>${item.mm}/${item.dualMm} mm</span><br><span>${item.fraction}</span>`;
      } else {
        info.innerHTML = `<strong>${item.gauge}</strong><br><span>${item.mm} mm</span><br><span>${item.fraction}</span>`;
      }
      card.appendChild(info);

      grid.appendChild(card);
    });

    printContainer.appendChild(grid);

    const footer = document.createElement('div');
    footer.className = 'print-sheet-footer';
    footer.innerHTML = `
      <p>${t('print.notice')}</p>
      <p>https://poliinternational.com/tools/gauge-converter/ | Poli International</p>
    `;
    printContainer.appendChild(footer);
  }

  // ============================================
  // ERROR & INPUT EVENT LISTENERS
  // ============================================

  function showError(msg) {
    const errorEl = document.getElementById('error-message');
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function hideError() {
    const errorEl = document.getElementById('error-message');
    if (errorEl) errorEl.style.display = 'none';
  }

  function setupInputHandlers() {
    const gaugeSelect = document.getElementById('gauge-input');
    const mmInput = document.getElementById('mm-input');
    const inchInput = document.getElementById('inch-input');

    if (gaugeSelect) {
      gaugeSelect.addEventListener('change', () => {
        if (!gaugeSelect.value) {
          currentMm = null;
          activeGaugeId = '';
          if (mmInput) mmInput.value = '';
          if (inchInput) inchInput.value = '';
          clearActiveTableRow();
          updateVisualCircle();
          updateMeasurementCards(null, null, null, null);
          return;
        }
        selectSizeById(gaugeSelect.value);
      });
    }

    if (mmInput) {
      mmInput.addEventListener('input', () => {
        const val = parseFloat(mmInput.value);
        if (isNaN(val) || val <= 0) {
          if (mmInput.value === '') {
            hideError();
            currentMm = null;
            activeGaugeId = '';
            if (gaugeSelect) gaugeSelect.value = '';
            if (inchInput) inchInput.value = '';
            clearActiveTableRow();
            updateVisualCircle();
            updateMeasurementCards(null, null, null, null);
          } else {
            showError(t('error.invalid_mm'));
          }
          return;
        }
        if (val > 50) {
          showError(t('error.invalid_mm'));
          return;
        }
        hideError();
        currentMm = val;
        const inches = mmToDecimalInches(val);
        if (inchInput) inchInput.value = inches !== null ? inches.toFixed(3) : '';

        const match = findClosestSizeRecord(val);
        if (match) {
          activeGaugeId = match.record.id;
          if (gaugeSelect) gaugeSelect.value = match.record.id;
          highlightTableRow(match.record.id);
          updateMeasurementCards(match.record.gauge, val, inches, match.record.fraction);
        } else {
          activeGaugeId = '';
          if (gaugeSelect) gaugeSelect.value = '';
          clearActiveTableRow();
          updateMeasurementCards(t('visual.custom_gauge'), val, inches, '--');
        }
        updateVisualCircle();
      });
    }

    if (inchInput) {
      inchInput.addEventListener('input', () => {
        const val = parseFloat(inchInput.value);
        if (isNaN(val) || val <= 0) {
          if (inchInput.value === '') {
            hideError();
            currentMm = null;
            activeGaugeId = '';
            if (gaugeSelect) gaugeSelect.value = '';
            if (mmInput) mmInput.value = '';
            clearActiveTableRow();
            updateVisualCircle();
            updateMeasurementCards(null, null, null, null);
          } else {
            showError(t('error.invalid_inch'));
          }
          return;
        }
        if (val > 2.0) {
          showError(t('error.invalid_inch'));
          return;
        }
        hideError();
        const mm = inchesToMm(val);
        currentMm = mm;
        if (mmInput) mmInput.value = mm;

        const match = findClosestSizeRecord(mm);
        if (match) {
          activeGaugeId = match.record.id;
          if (gaugeSelect) gaugeSelect.value = match.record.id;
          highlightTableRow(match.record.id);
          updateMeasurementCards(match.record.gauge, mm, val, match.record.fraction);
        } else {
          activeGaugeId = '';
          if (gaugeSelect) gaugeSelect.value = '';
          clearActiveTableRow();
          updateMeasurementCards(t('visual.custom_gauge'), mm, val, '--');
        }
        updateVisualCircle();
      });
    }

    // Caliper trigger button
    const caliperBtn = document.getElementById('caliper-calc-btn');
    if (caliperBtn) {
      caliperBtn.addEventListener('click', handleCaliperCalculation);
    }
    const caliperInput = document.getElementById('caliper-input');
    if (caliperInput) {
      caliperInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCaliperCalculation();
        }
      });
    }

    // Print button
    const printBtn = document.getElementById('trigger-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        renderPrintableChart();
        window.print();
      });
    }
  }

  // ============================================
  // CARD CALIBRATION MODAL
  // ============================================

  function setupCalibrationModal() {
    const modal = document.getElementById('calibration-modal');
    const openBtn = document.getElementById('open-calibrate-modal');
    const closeBtn = document.getElementById('close-calibrate-modal');
    const cancelBtn = document.getElementById('cancel-calibrate-btn');
    const saveBtn = document.getElementById('save-calibrate-btn');
    const slider = document.getElementById('card-slider');
    const sliderValDisplay = document.getElementById('slider-px-val');
    const cardGuide = document.getElementById('calibration-card-guide');
    const resetBtn = document.getElementById('reset-calibration-btn');

    if (!modal) return;

    function openModal() {
      // Initialize slider with current pixel width of 85.60 mm
      const currentPx = Math.round(getActivePxPerMm() * CARD_WIDTH_MM);
      if (slider) {
        slider.value = currentPx;
        slider.min = (currentPx * 0.6).toFixed(0);
        slider.max = (currentPx * 1.5).toFixed(0);
      }
      if (sliderValDisplay) sliderValDisplay.textContent = `${currentPx}px`;
      if (cardGuide) cardGuide.style.width = `${currentPx}px`;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (slider && cardGuide) {
      slider.addEventListener('input', () => {
        const px = parseFloat(slider.value);
        cardGuide.style.width = `${px}px`;
        if (sliderValDisplay) sliderValDisplay.textContent = `${px}px`;
      });
    }

    if (saveBtn && slider) {
      saveBtn.addEventListener('click', () => {
        const px = parseFloat(slider.value);
        if (!isNaN(px) && px > 0) {
          const calculatedPxPerMm = px / CARD_WIDTH_MM;
          saveCalibration(calculatedPxPerMm);
        }
        closeModal();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetCalibration();
      });
    }

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ============================================
  // LANGUAGE SELECTOR
  // ============================================

  function setupLanguageSelector() {
    const langSelect = document.getElementById('language-selector');
    if (!langSelect) return;

    const current = (window.i18n && window.i18n.getLanguage()) || 'en';
    langSelect.value = current;

    langSelect.addEventListener('change', () => {
      const selected = langSelect.value;
      if (window.i18n && typeof window.i18n.setLanguage === 'function') {
        window.i18n.setLanguage(selected);
      }
    });

    // Listen to language switch event from i18n
    window.addEventListener('poli_language_changed', () => {
      renderDropdown();
      renderTable();
      renderPrintableChart();
      updateCalibrationStatusUI();
      updateVisualCircle();

      // Refresh measurements with active language translations
      if (currentMm !== null) {
        const match = findClosestSizeRecord(currentMm);
        if (match) {
          updateMeasurementCards(match.record.gauge, currentMm, currentMm / MM_PER_INCH, match.record.fraction);
        }
      }
    });
  }

  // ============================================
  // EMBED MODAL
  // ============================================

  function setupEmbedModal() {
    const embedBtn = document.getElementById('embed-button');
    const embedModal = document.getElementById('embed-modal');
    const modalClose = document.getElementById('modal-close');
    const copyBtn = document.getElementById('copy-embed-code');
    const copySuccess = document.getElementById('copy-success');
    const embedCodeEl = document.getElementById('embed-code');

    if (embedBtn && embedModal) {
      embedBtn.addEventListener('click', () => {
        embedModal.style.display = 'flex';
        embedModal.setAttribute('aria-hidden', 'false');
      });
    }

    if (modalClose && embedModal) {
      modalClose.addEventListener('click', () => {
        embedModal.style.display = 'none';
        embedModal.setAttribute('aria-hidden', 'true');
      });
    }

    if (copyBtn && embedCodeEl) {
      copyBtn.addEventListener('click', () => {
        const code = embedCodeEl.textContent || embedCodeEl.innerText;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(() => {
            if (copySuccess) {
              copySuccess.style.display = 'block';
              setTimeout(() => { copySuccess.style.display = 'none'; }, 3000);
            }
          });
        }
      });
    }
  }

  // ============================================
  // DARK MODE TOGGLE & THEME HANDSHAKE
  // ============================================

  function setupThemeToggle() {
    const toggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    function applyTheme(isLight) {
      if (isLight) {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
      } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
      }
    }

    // Read stored theme or system preference
    let isLightMode = false;
    try {
      const stored = localStorage.getItem('gauge_theme');
      if (stored) {
        isLightMode = stored === 'light';
      }
    } catch (e) {}

    applyTheme(isLightMode);

    if (toggle) {
      toggle.addEventListener('click', () => {
        isLightMode = !body.classList.contains('light-mode');
        applyTheme(isLightMode);
        try {
          localStorage.setItem('gauge_theme', isLightMode ? 'light' : 'dark');
        } catch (e) {}
      });
    }

    // Message handshake from parent frame on poliinternational.com
    window.addEventListener('message', (event) => {
      if (event.data && typeof event.data === 'object' && event.data.theme) {
        applyTheme(event.data.theme === 'light');
      }
    });
  }

  // Window resize handler for true scale circle
  window.addEventListener('resize', () => {
    updateVisualCircle();
  });

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    loadCalibration();
    renderDropdown();
    renderTable();
    renderPrintableChart();
    setupInputHandlers();
    setupCalibrationModal();
    setupLanguageSelector();
    setupEmbedModal();
    setupThemeToggle();
    updateCalibrationStatusUI();
    updateVisualCircle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
