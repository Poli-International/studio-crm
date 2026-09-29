/**
 * Ink Color Mixer & Target Solver Controller (V2)
 * Poli International Tattoo Tools Suite
 * 
 * Features:
 * - Subtractive CMYKW pigment mixing engine with live optical prediction
 * - Target Color Solver (Inverse ratio optimizer from owned inventory)
 * - Formula Scaler (Caps, ml, drops with sensible rounding)
 * - Repeatability & Brand/Batch Tracking with mismatch alert
 * - Professional Gray Wash Studio Series (3-Cap, 4-Cap, 5-Cap, Custom %)
 * - Printable PDF recipe cards, Text recipe copy, CSV export
 * 
 * 100% Client-side and fully internationalized via window.t()
 */

// Global State
let mixHistory = [];
let colorRowCount = 0;
let currentMixResult = null;

// DOM Cache
const DOM = {};

function cacheDOM() {
  DOM.colorSelectors = document.getElementById('colorSelectors');
  DOM.addColorBtn = document.getElementById('addColorBtn');
  DOM.calculateMixBtn = document.getElementById('calculateMixBtn');
  DOM.resetMixerBtn = document.getElementById('resetMixerBtn');
  DOM.saveFormulaBtn = document.getElementById('saveFormulaBtn');
  DOM.mixerResults = document.getElementById('mixerResults');
  DOM.resultColorSwatch = document.getElementById('resultColorSwatch');
  DOM.resultColorHexText = document.getElementById('resultColorHexText');
  DOM.resultColorDescText = document.getElementById('resultColorDescText');
  DOM.resultColorLightnessVal = document.getElementById('resultColorLightnessVal');
  DOM.resultColorLStarVal = document.getElementById('resultColorLStarVal');
  DOM.resultColorToneVal = document.getElementById('resultColorToneVal');
  DOM.printCurrentMixBtn = document.getElementById('printCurrentMixBtn');
  DOM.ratioFormula = document.getElementById('ratioFormula');
  DOM.measurementsTableBody = document.getElementById('measurementsTableBody');

  // Target Solver DOM
  DOM.targetColorPicker = document.getElementById('targetColorPicker');
  DOM.targetHexInput = document.getElementById('targetHexInput');
  DOM.targetEyedropperBtn = document.getElementById('targetEyedropperBtn');
  DOM.targetPresetGrid = document.getElementById('targetPresetGrid');
  DOM.solveTargetBtn = document.getElementById('solveTargetBtn');
  DOM.targetSolverResults = document.getElementById('targetSolverResults');
  DOM.targetResultSwatch = document.getElementById('targetResultSwatch');
  DOM.targetOriginalSwatch = document.getElementById('targetOriginalSwatch');
  DOM.targetOriginalHexText = document.getElementById('targetOriginalHexText');
  DOM.targetOriginalLStarText = document.getElementById('targetOriginalLStarText');
  DOM.targetResultHexText = document.getElementById('targetResultHexText');
  DOM.targetResultLStarText = document.getElementById('targetResultLStarText');
  DOM.targetMatchQuality = document.getElementById('targetMatchQuality');
  DOM.targetHonestAssessment = document.getElementById('targetHonestAssessment');
  DOM.targetRatioString = document.getElementById('targetRatioString');
  DOM.targetMeasurementsBody = document.getElementById('targetMeasurementsBody');
  DOM.loadTargetToMixerBtn = document.getElementById('loadTargetToMixerBtn');
  DOM.saveTargetFormulaBtn = document.getElementById('saveTargetFormulaBtn');
  DOM.printTargetSolutionBtn = document.getElementById('printTargetSolutionBtn');
  DOM.useInventoryOnlyToggle = document.getElementById('useInventoryOnlyToggle');

  // Melanin Overlay Slider
  DOM.melaninAlphaSlider = document.getElementById('melaninAlphaSlider');
  DOM.melaninAlphaVal = document.getElementById('melaninAlphaVal');

  // Gray Wash DOM
  DOM.washSystemSelect = document.getElementById('washSystemSelect');
  DOM.washCapSizeSelect = document.getElementById('washCapSizeSelect');
  DOM.washDiluentSelect = document.getElementById('washDiluentSelect');
  DOM.diluentVolumeSummary = document.getElementById('diluentVolumeSummary');
  DOM.washLadderGrid = document.getElementById('washLadderGrid');
  DOM.openCapTrayFromWashBtn = document.getElementById('openCapTrayFromWashBtn');
  DOM.customWashSlider = document.getElementById('customWashSlider');
  DOM.customWashVal = document.getElementById('customWashVal');
  DOM.customWashResult = document.getElementById('customWashResult');

  // Neutralizing Assistant DOM
  DOM.unwantedTonePresetSelect = document.getElementById('unwantedTonePresetSelect');
  DOM.neutralizeColorPicker = document.getElementById('neutralizeColorPicker');
  DOM.neutralizeCustomInput = document.getElementById('neutralizeCustomInput');
  DOM.calcNeutralizerBtn = document.getElementById('calcNeutralizerBtn');
  DOM.neutralizerResultBox = document.getElementById('neutralizerResultBox');

  // Modals & Inventory
  DOM.printRecipeModal = document.getElementById('printRecipeModal');
  DOM.closePrintModalBtn = document.getElementById('closePrintModalBtn');
  DOM.doPrintBtn = document.getElementById('doPrintBtn');
  DOM.brandMismatchBanner = document.getElementById('brandMismatchBanner');

  // Printable Cap Tray Modal
  DOM.capTrayModal = document.getElementById('capTrayModal');
  DOM.closeTrayModalBtn = document.getElementById('closeTrayModalBtn');
  DOM.doPrintTrayBtn = document.getElementById('doPrintTrayBtn');
  DOM.trayGridTypeSelect = document.getElementById('trayGridTypeSelect');
  DOM.trayContentSourceSelect = document.getElementById('trayContentSourceSelect');
  DOM.capTrayPrintContent = document.getElementById('capTrayPrintContent');

  // Offline QR Transfer Modal
  DOM.qrTransferModal = document.getElementById('qrTransferModal');
  DOM.closeQrModalBtn = document.getElementById('closeQrModalBtn');
  DOM.qrByteCount = document.getElementById('qrByteCount');
  DOM.qrByteBar = document.getElementById('qrByteBar');
  DOM.qrCapacityWarning = document.getElementById('qrCapacityWarning');
  DOM.qrCodeContainer = document.getElementById('qrCodeContainer');
  DOM.qrTargetTitle = document.getElementById('qrTargetTitle');
  DOM.copyQrPayloadBtn = document.getElementById('copyQrPayloadBtn');
  DOM.qrFallbackSingleBtn = document.getElementById('qrFallbackSingleBtn');
  DOM.qrFallbackJsonBtn = document.getElementById('qrFallbackJsonBtn');
  DOM.qrTransferInventoryBtn = document.getElementById('qrTransferInventoryBtn');
}

// ==========================================
// 1. FORWARD MIXER & COLOR ROWS
// ==========================================

function initForwardMixer() {
  if (!DOM.colorSelectors) return;
  DOM.colorSelectors.innerHTML = '';
  colorRowCount = 0;

  // Add initial 2 color rows
  addColorRow('red', 1, 'Standard');
  addColorRow('yellow', 1, 'Standard');

  // Wire buttons
  if (DOM.addColorBtn) DOM.addColorBtn.onclick = () => addColorRow();
  if (DOM.calculateMixBtn) DOM.calculateMixBtn.onclick = calculateMix;
  if (DOM.resetMixerBtn) DOM.resetMixerBtn.onclick = resetMixer;
  if (DOM.saveFormulaBtn) DOM.saveFormulaBtn.onclick = saveCurrentFormula;

  // Volume input & unit changes
  if (DOM.totalVolume) {
    DOM.totalVolume.oninput = () => {
      calculateMix();
      updateVolumePresetHighlight();
    };
    DOM.totalVolume.onchange = () => {
      calculateMix();
      updateVolumePresetHighlight();
    };
  }
  if (DOM.volumeUnit) {
    DOM.volumeUnit.onchange = () => {
      calculateMix();
      updateVolumePresetHighlight();
    };
  }

  // Volume scale preset quick buttons
  document.querySelectorAll('.volume-preset-btn').forEach(btn => {
    btn.onclick = () => setVolumePreset(btn);
  });

  // Print current mix button
  if (DOM.printCurrentMixBtn) {
    DOM.printCurrentMixBtn.onclick = () => {
      if (!currentMixResult) {
        calculateMix();
      }
      if (currentMixResult) {
        const formulaData = {
          id: 'MIX-' + Date.now().toString().slice(-6),
          name: (DOM.formulaName && DOM.formulaName.value.trim()) || 'Studio Custom Ink Mix',
          resultingColor: currentMixResult.resultingHex,
          ratio: currentMixResult.ratioString,
          colors: currentMixResult.colors,
          notes: (DOM.formulaNotes && DOM.formulaNotes.value.trim()) || '',
          createdAt: new Date().toISOString()
        };
        if (typeof window.printFormulaCard === 'function') {
          window.printFormulaCard(formulaData);
        }
      }
    };
  }
}

function updateVolumePresetHighlight() {
  const volInput = document.getElementById('totalVolume');
  const unitInput = document.getElementById('volumeUnit');
  if (!volInput || !unitInput) return;

  const currentVol = volInput.value;
  const currentUnit = unitInput.value;

  document.querySelectorAll('.volume-preset-btn').forEach(btn => {
    const btnVol = btn.getAttribute('data-volume');
    const btnUnit = btn.getAttribute('data-unit') || 'ml';
    if (btnVol === currentVol && btnUnit === currentUnit) {
      btn.classList.add('ink-mixer__btn--primary', 'volume-preset-btn--active');
      btn.classList.remove('ink-mixer__btn--outline');
    } else {
      btn.classList.remove('ink-mixer__btn--primary', 'volume-preset-btn--active');
      btn.classList.add('ink-mixer__btn--outline');
    }
  });
}

function setVolumePreset(btn) {
  if (!btn) return;
  const vol = btn.getAttribute('data-volume') || '5';
  const unit = btn.getAttribute('data-unit') || 'ml';
  const volInput = document.getElementById('totalVolume');
  const unitInput = document.getElementById('volumeUnit');
  if (volInput) volInput.value = vol;
  if (unitInput) unitInput.value = unit;

  updateVolumePresetHighlight();
  calculateMix();
}
window.setVolumePreset = setVolumePreset;

function getAvailableInksForDropdown() {
  const useInventory = DOM.useInventoryOnlyToggle ? DOM.useInventoryOnlyToggle.checked : false;
  if (useInventory && window.InkInventory) {
    const owned = window.InkInventory.getInStock();
    if (owned.length > 0) {
      return owned.map(item => ({
        value: item.pigmentClass || item.color || 'red',
        label: `${item.shadeName || item.color} (${item.brand})`,
        brand: item.brand,
        batch: item.batchNumber || ''
      }));
    }
  }

  // Default Standard Inks
  return [
    { value: 'black', label: 'Black (Carbon/Onyx)', brand: 'Standard' },
    { value: 'white', label: 'White (Titanium Opaque)', brand: 'Standard' },
    { value: 'red', label: 'Red (Scarlet/Crimson)', brand: 'Standard' },
    { value: 'yellow', label: 'Yellow (Golden/Bright)', brand: 'Standard' },
    { value: 'blue', label: 'Blue (Cobalt/Cyan)', brand: 'Standard' },
    { value: 'orange', label: 'Orange (Cadmium)', brand: 'Standard' },
    { value: 'green', label: 'Green (Forest/Emerald)', brand: 'Standard' },
    { value: 'purple', label: 'Purple (Deep Violet)', brand: 'Standard' },
    { value: 'brown', label: 'Brown (Burnt Umber)', brand: 'Standard' },
    { value: 'magenta', label: 'Magenta (Process/Neon)', brand: 'Standard' }
  ];
}

function getLStarFromHex(hex) {
  if (!hex) return 50;
  if (window.hexToRgb && window.rgbToLab) {
    const rgb = window.hexToRgb(hex);
    const lab = window.rgbToLab(rgb.r, rgb.g, rgb.b);
    return Math.round(lab.L);
  }
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const y = lum > 0.008856 ? Math.cbrt(lum) : (7.787 * lum) + (16 / 116);
  return Math.round(Math.max(0, Math.min(100, (116 * y) - 16)));
}

function getToneCategory(hex) {
  const lStar = getLStarFromHex(hex);
  const _t = typeof window.t === 'function' ? window.t : (k) => k;
  if (lStar < 18) return _t('tones.deepCoreShadow');
  if (lStar < 38) return _t('tones.darkShadowTone');
  if (lStar < 62) return _t('tones.mediumMidtone');
  if (lStar < 82) return _t('tones.lightTintWash');
  return _t('tones.highKeyHighlight');
}

function getDescriptiveColorName(hex) {
  const _t = typeof window.t === 'function' ? window.t : (k) => k;
  if (!hex) return _t('tones.customBlend');
  const rgb = window.hexToRgb ? window.hexToRgb(hex) : { r: 128, g: 128, b: 128 };
  const r = rgb.r, g = rgb.g, b = rgb.b;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lStar = getLStarFromHex(hex);

  if (delta < 15) {
    if (lStar < 20) return _t('tones.onyxCarbonBlack');
    if (lStar < 40) return _t('tones.deepCharcoalWash');
    if (lStar < 70) return _t('tones.neutralSlateGrey');
    if (lStar < 90) return _t('tones.lightGreyWash');
    return _t('tones.opaqueMixingWhite');
  }

  // Hue angle calculation
  let h = 0;
  if (delta > 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  let hueName = _t('tones.customBlend');
  if (h >= 345 || h < 15) hueName = _t('tones.crimsonRed');
  else if (h < 40) hueName = _t('tones.warmOchreOrange');
  else if (h < 65) hueName = _t('tones.goldenrodYellow');
  else if (h < 160) hueName = _t('tones.emeraldOliveGreen');
  else if (h < 200) hueName = _t('tones.cyanTeal');
  else if (h < 260) hueName = _t('tones.cobaltBlue');
  else if (h < 310) hueName = _t('tones.violetPurple');
  else hueName = _t('tones.magentaRose');

  return `${getToneCategory(hex)} (${hueName})`;
}

function updateRowSwatch(row) {
  if (!row) return;
  const select = row.querySelector('.color-select');
  const swatch = row.querySelector('.row-component-swatch');
  if (!select || !swatch) return;

  const val = select.value;
  const data = window.getColorData ? window.getColorData(val) : null;
  const hex = data && data.hex ? data.hex : '#808080';
  const lStar = getLStarFromHex(hex);
  const selectedText = select.options && select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : val;

  swatch.style.backgroundColor = hex;
  swatch.title = `${selectedText} • ${hex.toUpperCase()} • L* ${lStar}`;
  swatch.setAttribute('aria-label', `Component Swatch: ${selectedText}, Hex ${hex.toUpperCase()}, L* ${lStar}`);
}

function addColorRow(defaultColor = '', defaultParts = 1, defaultBrand = 'Standard', defaultBatch = '') {
  if (colorRowCount >= 8) {
    showMessage(typeof window.t === 'function' ? window.t('mixer.maxColorsReached') : 'Maximum 8 ink components per mix', 'info');
    return;
  }

  colorRowCount++;
  const row = document.createElement('div');
  row.className = 'ink-mixer__color-row';
  row.id = `colorRow_${colorRowCount}`;

  const inks = getAvailableInksForDropdown();
  const optionsHtml = inks.map(ink => {
    const isSelected = ink.value === defaultColor ? 'selected' : '';
    return `<option value="${ink.value}" data-brand="${ink.brand || 'Standard'}" ${isSelected}>${ink.label}</option>`;
  }).join('');

  const labelText = typeof window.t === 'function' ? window.t('mixer.colorLabel', { count: colorRowCount }) : `Color ${colorRowCount}`;
  const partsLabel = typeof window.t === 'function' ? window.t('mixer.partsLabel') : 'Parts';
  const brandLabel = typeof window.t === 'function' ? window.t('mixer.brandLabel') : 'Brand';
  const batchLabel = typeof window.t === 'function' ? window.t('mixer.batchLabel') : 'Batch / Lot #';

  row.innerHTML = `
    <div class="ink-mixer__color-control">
      <label class="ink-mixer__label">${labelText}</label>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="row-component-swatch" role="img" aria-label="Component Swatch"></span>
        <select class="ink-mixer__select color-select" data-row="${colorRowCount}">
          <option value="">${typeof window.t === 'function' ? window.t('mixer.selectColor') : 'Select Color'}</option>
          ${optionsHtml}
        </select>
      </div>
    </div>
    <div class="ink-mixer__color-control ink-mixer__color-control--brand">
      <label class="ink-mixer__label">${brandLabel}</label>
      <input type="text" class="ink-mixer__input brand-input" placeholder="e.g. Dynamic, Eternal" value="${defaultBrand}">
    </div>
    <div class="ink-mixer__color-control ink-mixer__color-control--batch">
      <label class="ink-mixer__label">${batchLabel}</label>
      <input type="text" class="ink-mixer__input batch-input" placeholder="Optional Lot #" value="${defaultBatch}">
    </div>
    <div class="ink-mixer__color-control ink-mixer__color-control--parts">
      <label class="ink-mixer__label">${partsLabel}</label>
      <input type="number" class="ink-mixer__input parts-input" min="0.1" step="0.1" value="${defaultParts}">
    </div>
    <button type="button" class="ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--danger remove-color-btn" title="Remove" aria-label="Remove">×</button>
  `;

  DOM.colorSelectors.appendChild(row);

  // Initialize and wire swatch
  updateRowSwatch(row);
  const colorSelect = row.querySelector('.color-select');
  if (colorSelect) {
    colorSelect.addEventListener('change', () => {
      updateRowSwatch(row);
      calculateMix();
    });
  }

  // Wire remove button
  const removeBtn = row.querySelector('.remove-color-btn');
  removeBtn.onclick = () => {
    row.remove();
    renumberColorRows();
    calculateMix();
  };

  // Wire auto-calculate on input
  row.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', calculateMix);
  });

  renumberColorRows();
}

function updateColorRowLabels() {
  if (!DOM.colorSelectors) return;
  const rows = DOM.colorSelectors.querySelectorAll('.ink-mixer__color-row');
  const _t = typeof window.t === 'function' ? window.t : (k, p) => (p && p.count ? `Color ${p.count}` : k);

  const partsLabel = _t('mixer.partsLabel');
  const brandLabel = _t('mixer.brandLabel');
  const batchLabel = _t('mixer.batchLabel');
  const selectColorText = _t('mixer.selectColor');

  rows.forEach((row, index) => {
    const colorLabel = row.querySelector('.ink-mixer__color-control:not(.ink-mixer__color-control--brand):not(.ink-mixer__color-control--batch):not(.ink-mixer__color-control--parts) .ink-mixer__label');
    if (colorLabel) {
      colorLabel.textContent = _t('mixer.colorLabel', { count: index + 1 });
    }

    const brandLbl = row.querySelector('.ink-mixer__color-control--brand .ink-mixer__label');
    if (brandLbl) brandLbl.textContent = brandLabel;

    const batchLbl = row.querySelector('.ink-mixer__color-control--batch .ink-mixer__label');
    if (batchLbl) batchLbl.textContent = batchLabel;

    const partsLbl = row.querySelector('.ink-mixer__color-control--parts .ink-mixer__label');
    if (partsLbl) partsLbl.textContent = partsLabel;

    const placeholderOpt = row.querySelector('.color-select option[value=""]');
    if (placeholderOpt) placeholderOpt.textContent = selectColorText;

    updateRowSwatch(row);
  });
  colorRowCount = rows.length;
}

function renumberColorRows() {
  updateColorRowLabels();
}

function resetMixer() {
  initForwardMixer();
  if (DOM.mixerResults) DOM.mixerResults.style.display = 'none';
  if (DOM.brandMismatchBanner) DOM.brandMismatchBanner.style.display = 'none';
  currentMixResult = null;
}

function calculateMix() {
  clearMessages();
  const rows = DOM.colorSelectors.querySelectorAll('.ink-mixer__color-row');
  const colors = [];
  let totalParts = 0;

  rows.forEach(row => {
    const select = row.querySelector('.color-select');
    const partsInput = row.querySelector('.parts-input');
    const brandInput = row.querySelector('.brand-input');
    const batchInput = row.querySelector('.batch-input');

    const color = select ? select.value : '';
    const parts = partsInput ? parseFloat(partsInput.value) : 0;
    const brand = brandInput ? brandInput.value.trim() : 'Standard';
    const batchNumber = batchInput ? batchInput.value.trim() : '';

    if (color && parts > 0) {
      const selectedOption = select.options[select.selectedIndex];
      const shadeName = selectedOption ? selectedOption.text.split('(')[0].trim() : color;

      colors.push({
        color,
        shadeName,
        parts,
        brand: brand || 'Standard',
        batchNumber
      });
      totalParts += parts;
    }
  });

  if (colors.length === 0) {
    if (DOM.mixerResults) DOM.mixerResults.style.display = 'none';
    return;
  }

  const volInput = document.getElementById('totalVolume');
  const unitInput = document.getElementById('volumeUnit');
  const totalVolume = parseFloat(volInput ? volInput.value : 5) || 5;
  const unit = unitInput ? unitInput.value : 'ml';

  // 1. Subtractive Optical CMYKW Model Prediction
  const resultingHex = window.estimateResultingColor ? window.estimateResultingColor(colors) : '#808080';

  // 2. Volumetric Smart Scaling
  const scale = window.scaleFormulaMeasurements ? window.scaleFormulaMeasurements(colors, totalVolume, unit) : null;

  // 3. Ratio string
  const minPart = Math.min(...colors.map(c => c.parts));
  const ratioString = colors.map(c => Number((c.parts / minPart).toFixed(2))).join(' : ');

  currentMixResult = {
    colors,
    ratioString,
    totalVolume,
    unit,
    resultingHex,
    scale
  };

  // 4. Conflicting Brand Mismatch Check
  if (DOM.brandMismatchBanner) {
    const specifiedBrands = new Set(
      colors
        .map(c => (c.brand || '').trim())
        .filter(b => b.length > 0 && b.toLowerCase() !== 'standard')
    );

    if (specifiedBrands.size > 1) {
      const brandNames = Array.from(specifiedBrands).join(' & ');
      DOM.brandMismatchBanner.style.display = 'flex';
      const mismatchMsg = typeof window.t === 'function' && window.t('mixer.brandConflictNotice') !== 'mixer.brandConflictNotice'
        ? window.t('mixer.brandConflictNotice', { brands: brandNames })
        : `Inter-Brand Pigment Notice: You are blending inks from different manufacturers (${brandNames}). Pigment concentration, particle grind sizes, and surfactant bases differ across brands. Variations in viscosity may affect dispersion stability and healed color uniformity. Test on practice skin first.`;
      
      DOM.brandMismatchBanner.innerHTML = `
        <span style="font-size: 1.3rem; flex-shrink: 0;" aria-hidden="true">⚠️</span>
        <div class="mismatch-text">${mismatchMsg}</div>
      `;
    } else {
      DOM.brandMismatchBanner.style.display = 'none';
    }
  }

  displayMixerResults(currentMixResult);
}

function displayMixerResults(result) {
  if (!DOM.mixerResults) return;
  DOM.mixerResults.style.display = 'block';

  // Smooth subtle fade-in transition
  DOM.mixerResults.classList.remove('ink-mixer__fade-in');
  void DOM.mixerResults.offsetWidth; // Trigger reflow
  DOM.mixerResults.classList.add('ink-mixer__fade-in');

  const lStar = getLStarFromHex(result.resultingHex);
  const toneDesc = getToneCategory(result.resultingHex);
  const colorNameDesc = getDescriptiveColorName(result.resultingHex);

  // Update Main Predicted Swatch and Text Values
  if (DOM.resultColorSwatch) {
    DOM.resultColorSwatch.style.backgroundColor = result.resultingHex;
    DOM.resultColorSwatch.title = `Hex: ${result.resultingHex.toUpperCase()} • L* ${lStar} • ${toneDesc}`;
    DOM.resultColorSwatch.setAttribute('aria-label', `Predicted Ink Blend: ${result.resultingHex.toUpperCase()}, L* ${lStar}, ${toneDesc}`);
    DOM.resultColorSwatch.classList.remove('swatch-pulse');
    void DOM.resultColorSwatch.offsetWidth; // Force reflow to restart animation
    DOM.resultColorSwatch.classList.add('swatch-pulse');
  }

  if (DOM.resultColorHexText) {
    DOM.resultColorHexText.textContent = result.resultingHex.toUpperCase();
  }
  if (DOM.resultColorDescText) {
    DOM.resultColorDescText.textContent = colorNameDesc;
  }
  if (DOM.resultColorLightnessVal) {
    DOM.resultColorLightnessVal.textContent = `${lStar}%`;
  }
  if (DOM.resultColorLStarVal) {
    DOM.resultColorLStarVal.textContent = lStar;
  }
  if (DOM.resultColorToneVal) {
    DOM.resultColorToneVal.textContent = toneDesc;
  }

  // Update Ratio Formula
  if (DOM.ratioFormula) {
    const ratioLbl = typeof window.t === 'function' ? window.t('mixer.ratio') : 'Ratio';
    DOM.ratioFormula.textContent = `${ratioLbl}: ${result.ratioString}`;
  }

  // Update Volumetric Table
  if (DOM.measurementsTableBody && result.scale) {
    const fragment = document.createDocumentFragment();
    result.scale.measurements.forEach(m => {
      const tr = document.createElement('tr');
      const brandStr = m.brand && m.brand !== 'Standard' ? `<span class="ink-mixer__tbl-brand">${m.brand}</span>` : '';
      tr.innerHTML = `
        <td><strong>${m.shadeName}</strong> ${brandStr}</td>
        <td>${m.parts}</td>
        <td>${m.percentage}%</td>
        <td>${m.ml} ml</td>
        <td><strong>${m.drops} drops</strong></td>
      `;
      fragment.appendChild(tr);
    });
    DOM.measurementsTableBody.innerHTML = '';
    DOM.measurementsTableBody.appendChild(fragment);
  }
}

let pendingFormulaSaveData = null;

function promptSaveFormulaModal(formulaData) {
  pendingFormulaSaveData = formulaData;
  const modal = document.getElementById('saveFormulaModal');
  if (!modal) {
    if (window.FormulaLibrary) {
      window.FormulaLibrary.save(formulaData);
      const _t = typeof window.t === 'function' ? window.t : (k, p) => `Formula "${p.name}" saved to library!`;
      showMessage(_t('mixer.formulaSavedToast', { name: formulaData.name }), 'success');
    }
    return;
  }
  const nameInput = document.getElementById('saveFormulaNameInput');
  const notesInput = document.getElementById('saveFormulaNotesInput');
  if (nameInput) nameInput.value = formulaData.name || 'Custom Mix';
  if (notesInput) notesInput.value = formulaData.notes || '';
  modal.style.display = 'flex';
}

function initSaveFormulaModal() {
  const modal = document.getElementById('saveFormulaModal');
  const closeBtn = document.getElementById('closeSaveFormulaModalBtn');
  const cancelBtn = document.getElementById('cancelSaveFormulaBtn');
  const form = document.getElementById('saveFormulaForm');

  if (closeBtn && modal) closeBtn.onclick = () => { modal.style.display = 'none'; };
  if (cancelBtn && modal) cancelBtn.onclick = () => { modal.style.display = 'none'; };

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      if (!pendingFormulaSaveData) return;
      const name = document.getElementById('saveFormulaNameInput').value.trim() || 'Custom Mix';
      const notes = document.getElementById('saveFormulaNotesInput').value.trim();
      pendingFormulaSaveData.name = name;
      pendingFormulaSaveData.notes = notes;

      if (window.FormulaLibrary) {
        window.FormulaLibrary.save(pendingFormulaSaveData);
        if (typeof window.refreshLibraryDisplay === 'function') {
          window.refreshLibraryDisplay();
        }
        const _t = typeof window.t === 'function' ? window.t : (k, p) => `Formula "${p.name}" saved to library!`;
        showMessage(_t('mixer.formulaSavedToast', { name }), 'success');
      }
      if (modal) modal.style.display = 'none';
      pendingFormulaSaveData = null;
    };
  }
}

function saveCurrentFormula() {
  if (!currentMixResult || currentMixResult.colors.length === 0) {
    showMessage(typeof window.t === 'function' ? window.t('mixer.noColorsError') : 'Please calculate a formula before saving.', 'error');
    return;
  }

  const defaultName = currentMixResult.colors.map(c => c.shadeName || c.color).join(' & ') + ' Mix';
  let name = (DOM.formulaName && DOM.formulaName.value.trim()) || defaultName;
  let notes = (DOM.formulaNotes && DOM.formulaNotes.value.trim()) || '';
  const tagsStr = (DOM.formulaTags && DOM.formulaTags.value.trim()) || '';
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

  const formulaData = {
    name,
    colors: currentMixResult.colors,
    ratio: currentMixResult.ratioString,
    totalVolume: currentMixResult.totalVolume,
    unit: currentMixResult.unit,
    resultingColor: currentMixResult.resultingHex,
    notes,
    tags,
    primaryBrand: currentMixResult.colors[0] ? currentMixResult.colors[0].brand : 'Standard'
  };

  promptSaveFormulaModal(formulaData);
}

// ==========================================
// 2. MIX BY TARGET COLOR SOLVER
// ==========================================

function syncTargetColorFromPicker(hex) {
  if (!hex) return;
  const hexInput = document.getElementById('targetHexInput');
  const picker = document.getElementById('targetColorPicker');
  if (hexInput) hexInput.value = hex.toUpperCase();
  if (picker && picker.value.toLowerCase() !== hex.toLowerCase()) picker.value = hex;
}
window.syncTargetColorFromPicker = syncTargetColorFromPicker;

function syncTargetPickerFromHex(raw) {
  if (!raw) return;
  let hex = raw.trim();
  if (!hex.startsWith('#') && /^[0-9A-Fa-f]{3,6}$/.test(hex)) {
    hex = '#' + hex;
  }
  const picker = document.getElementById('targetColorPicker');
  if (picker && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
    picker.value = hex;
  }
}
window.syncTargetPickerFromHex = syncTargetPickerFromHex;

function initTargetSolver() {
  if (!DOM.targetColorPicker || !DOM.solveTargetBtn) return;

  // Sync Color Picker & Hex Input
  DOM.targetColorPicker.oninput = (e) => {
    syncTargetColorFromPicker(e.target.value);
  };
  DOM.targetColorPicker.onchange = (e) => {
    syncTargetColorFromPicker(e.target.value);
  };

  if (DOM.targetHexInput) {
    DOM.targetHexInput.oninput = (e) => {
      syncTargetPickerFromHex(e.target.value);
    };
    DOM.targetHexInput.onchange = (e) => {
      syncTargetPickerFromHex(e.target.value);
    };
  }

  // Eyedropper API
  if (DOM.targetEyedropperBtn) {
    DOM.targetEyedropperBtn.onclick = async () => {
      if ('EyeDropper' in window) {
        try {
          const eyeDropper = new window.EyeDropper();
          const res = await eyeDropper.open();
          if (res && res.sRGBHex) {
            syncTargetColorFromPicker(res.sRGBHex);
            runTargetSolver();
          }
        } catch (e) {
          // User canceled
        }
      } else {
        const _t = typeof window.t === 'function' ? window.t : (k) => 'Native EyeDropper is not supported in this browser. Please enter Hex or RGB color manually.';
        showMessage(_t('targetSolver.eyedropperNotSupported'), 'info');
        if (DOM.targetHexInput) DOM.targetHexInput.focus();
      }
    };
  }

  // Render Preset Target Swatches
  renderTargetPresets();

  // Solve button
  DOM.solveTargetBtn.onclick = runTargetSolver;

  // Load into forward mixer
  if (DOM.loadTargetToMixerBtn) {
    DOM.loadTargetToMixerBtn.onclick = () => {
      if (DOM.targetSolverResults && DOM.targetSolverResults.dataset.lastSolution) {
        try {
          const solution = JSON.parse(DOM.targetSolverResults.dataset.lastSolution);
          loadSolutionIntoMixer(solution);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }

  // Save Target Formula
  if (DOM.saveTargetFormulaBtn) {
    DOM.saveTargetFormulaBtn.onclick = () => {
      if (DOM.targetSolverResults && DOM.targetSolverResults.dataset.lastSolution) {
        try {
          const solution = JSON.parse(DOM.targetSolverResults.dataset.lastSolution);
          saveTargetSolution(solution);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }

  // Print Target Solution
  if (DOM.printTargetSolutionBtn) {
    DOM.printTargetSolutionBtn.onclick = () => {
      if (DOM.targetSolverResults && DOM.targetSolverResults.dataset.lastSolution) {
        try {
          const solution = JSON.parse(DOM.targetSolverResults.dataset.lastSolution);
          printTargetSolution(solution);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }
}

function renderTargetPresets() {
  if (!DOM.targetPresetGrid) return;

  const presets = [
    { name: 'Warm Flesh Light', hex: '#F0C8A8' },
    { name: 'Medium Ochre Flesh', hex: '#C68642' },
    { name: 'Rich Mahogany Flesh', hex: '#63381B' },
    { name: 'Crimson Blood Shadow', hex: '#8B0000' },
    { name: 'Terracotta Warm', hex: '#CC4E33' },
    { name: 'Olive Green Shadow', hex: '#556B2F' },
    { name: 'Seafoam Teal', hex: '#2E8B57' },
    { name: 'Plum Velvet', hex: '#4A154B' },
    { name: 'Deep Navy Velvet', hex: '#1C2833' },
    { name: 'Mustard Goldenrod', hex: '#DAA520' }
  ];

  DOM.targetPresetGrid.innerHTML = presets.map(p => `
    <button type="button" class="target-preset-chip" data-hex="${p.hex}" title="${p.name}">
      <span class="target-preset-dot" style="background-color: ${p.hex};"></span>
      <span class="target-preset-name">${p.name}</span>
    </button>
  `).join('');

  DOM.targetPresetGrid.querySelectorAll('.target-preset-chip').forEach(chip => {
    chip.onclick = () => {
      const hex = chip.dataset.hex;
      if (DOM.targetColorPicker) DOM.targetColorPicker.value = hex;
      if (DOM.targetHexInput) DOM.targetHexInput.value = hex.toUpperCase();
      runTargetSolver();
    };
  });
}

function showTargetSolverSkeleton() {
  if (!DOM.targetSolverResults) return;
  DOM.targetSolverResults.style.display = 'block';

  if (DOM.targetMatchQuality) {
    DOM.targetMatchQuality.innerHTML = '<span class="table-skeleton-shimmer table-skeleton-shimmer--short" style="display:inline-block; height:1rem; min-width:90px;"></span>';
  }
  if (DOM.targetHonestAssessment) {
    DOM.targetHonestAssessment.innerHTML = '<div class="table-skeleton-shimmer table-skeleton-shimmer--long" style="height: 0.95rem; margin-bottom: 0.4rem;"></div><div class="table-skeleton-shimmer table-skeleton-shimmer--medium" style="height: 0.95rem;"></div>';
  }
  if (DOM.targetRatioString) {
    DOM.targetRatioString.innerHTML = '<span class="table-skeleton-shimmer table-skeleton-shimmer--medium" style="display:inline-block; height:1.2rem; min-width:130px;"></span>';
  }

  if (DOM.targetMeasurementsBody) {
    DOM.targetMeasurementsBody.innerHTML = `
      <tr class="target-skeleton-row">
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--long"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--short"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
      </tr>
      <tr class="target-skeleton-row">
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--short"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--short"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
      </tr>
      <tr class="target-skeleton-row">
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--long"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--short"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--short"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
        <td><span class="table-skeleton-shimmer table-skeleton-shimmer--medium"></span></td>
      </tr>
    `;
  }
}

function runTargetSolver() {
  const rawInput = DOM.targetHexInput ? DOM.targetHexInput.value.trim() : (DOM.targetColorPicker ? DOM.targetColorPicker.value : '#d61818');
  let targetHex = rawInput;

  if (window.parseColorInput) {
    const parsed = window.parseColorInput(rawInput);
    if (!parsed) {
      showMessage(typeof window.t === 'function' ? window.t('targetSolver.invalidHex') : 'Please enter a valid Hex (#2E7D32) or RGB (rgb(46, 125, 50)) color.', 'error');
      return;
    }
    targetHex = parsed.hex;
    if (DOM.targetColorPicker) DOM.targetColorPicker.value = targetHex;
  } else if (!/^#[0-9A-Fa-f]{6}$/.test(targetHex)) {
    const _t = typeof window.t === 'function' ? window.t : (k) => 'Please enter a valid 6-character hex color (e.g. #2E7D32)';
    showMessage(_t('targetSolver.invalidHexPrompt'), 'error');
    return;
  }

  // Check inventory on-hand restriction
  const useInventory = DOM.useInventoryOnlyToggle ? DOM.useInventoryOnlyToggle.checked : false;
  let availableInks = null;
  if (useInventory && window.InkInventory) {
    availableInks = window.InkInventory.getOnHand();
    if (!availableInks || availableInks.length === 0) {
      const _t = typeof window.t === 'function' ? window.t : (k) => 'No bottles are currently marked "On Hand" in your inventory. Solving with standard master pigments.';
      showMessage(_t('targetSolver.emptyInventoryNotice'), 'info');
      availableInks = null;
    }
  }

  if (typeof window.solveMixForTarget !== 'function') return;

  // Display subtle shimmer loading skeleton animation while calculation runs
  showTargetSolverSkeleton();
  if (DOM.solveTargetBtn) {
    DOM.solveTargetBtn.disabled = true;
    DOM.solveTargetBtn.classList.add('loading');
  }

  setTimeout(() => {
    try {
      const result = window.solveMixForTarget(targetHex, availableInks);
      if (!result || !result.success) {
        const _t = typeof window.t === 'function' ? window.t : (k) => 'Could not solve recipe for this target color.';
        showMessage(_t('targetSolver.solveFailed'), 'error');
        return;
      }

      // Scale to 5ml default
      const scale = window.scaleFormulaMeasurements ? window.scaleFormulaMeasurements(result.bestMix, 5, 'ml') : null;

      displayTargetResults(targetHex, result, scale);
    } finally {
      if (DOM.solveTargetBtn) {
        DOM.solveTargetBtn.disabled = false;
        DOM.solveTargetBtn.classList.remove('loading');
      }
    }
  }, 120);
}

function displayTargetResults(targetHex, result, scale) {
  if (!DOM.targetSolverResults) return;
  DOM.targetSolverResults.style.display = 'block';

  const targetLStar = getLStarFromHex(targetHex);
  const predLStar = getLStarFromHex(result.predictedHex);

  if (DOM.targetOriginalSwatch) {
    DOM.targetOriginalSwatch.style.backgroundColor = targetHex;
    DOM.targetOriginalSwatch.title = `Target: ${targetHex.toUpperCase()} • L* ${targetLStar}`;
    DOM.targetOriginalSwatch.setAttribute('aria-label', `Target Goal Swatch: ${targetHex.toUpperCase()}, L* ${targetLStar}`);
  }
  if (DOM.targetOriginalHexText) {
    DOM.targetOriginalHexText.textContent = targetHex.toUpperCase();
  }
  if (DOM.targetOriginalLStarText) {
    DOM.targetOriginalLStarText.textContent = `L* ${targetLStar}`;
  }

  if (DOM.targetResultSwatch) {
    DOM.targetResultSwatch.style.backgroundColor = result.predictedHex;
    DOM.targetResultSwatch.title = `Predicted Mix: ${result.predictedHex.toUpperCase()} • L* ${predLStar}`;
    DOM.targetResultSwatch.setAttribute('aria-label', `Predicted Ink Match: ${result.predictedHex.toUpperCase()}, L* ${predLStar}`);
    // Trigger CSS pulse animation via animate-pulse class with clean reset
    DOM.targetResultSwatch.classList.remove('animate-pulse', 'swatch-pulse');
    void DOM.targetResultSwatch.offsetWidth; // Force reflow to reset animation
    DOM.targetResultSwatch.classList.add('animate-pulse');
  }
  if (DOM.targetResultHexText) {
    DOM.targetResultHexText.textContent = result.predictedHex.toUpperCase();
  }
  if (DOM.targetResultLStarText) {
    DOM.targetResultLStarText.textContent = `L* ${predLStar}`;
  }

  if (DOM.targetMatchQuality) {
    const rating = typeof window.getCiede2000Rating === 'function' && result.deltaE00 !== undefined
      ? window.getCiede2000Rating(result.deltaE00)
      : null;
    const de00Badge = result.deltaE00 !== undefined
      ? `<span class="target-de00-badge ${rating ? rating.badgeClass : ''}">ΔE₀₀: <strong>${result.deltaE00}</strong></span>`
      : '';
    const gamutBadge = result.gamut
      ? `<span class="target-gamut-badge ${result.gamut.inGamut ? 'gamut-in' : 'gamut-out'}">${result.gamut.inGamut ? '✓ In Gamut' : '⚠️ Gamut Boundary Shift'}</span>`
      : '';
    DOM.targetMatchQuality.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <strong>${result.matchQuality}</strong>
        ${de00Badge}
        ${gamutBadge}
      </div>
    `;
  }
  if (DOM.targetHonestAssessment) {
    DOM.targetHonestAssessment.textContent = result.honestAssessment || '';
  }
  if (DOM.targetRatioString) {
    DOM.targetRatioString.textContent = `Ratio: ${result.ratioString}`;
  }

  if (DOM.targetMeasurementsBody && scale) {
    const totalParts = scale.measurements.reduce((sum, m) => sum + m.parts, 0) || 1;
    const dpm = typeof window.getCalibratedDropsPerMl === 'function' ? window.getCalibratedDropsPerMl() : 20.0;
    DOM.targetMeasurementsBody.innerHTML = scale.measurements.map(m => {
      const capFraction = m.parts / totalParts;
      const capDrops = Math.max(1, Math.round(capFraction * 2.0 * dpm));
      const capMl = (capFraction * 2.0).toFixed(2);
      const mix5Drops = Math.max(1, Math.round(capFraction * 5.0 * dpm));
      const mix5Ml = (capFraction * 5.0).toFixed(2);
      const bottleDrops = Math.max(1, Math.round(capFraction * 30.0 * dpm));
      const bottleMl = (capFraction * 30.0).toFixed(1);

      return `
        <tr>
          <td><strong>${m.shadeName}</strong></td>
          <td><span class="ink-mixer__tbl-brand">${m.brand}</span></td>
          <td><strong>${m.parts}</strong> <span style="font-size: 0.8rem; color: var(--text-tertiary);">(${m.percentage}%)</span></td>
          <td>${capDrops} drops (${capMl} ml)</td>
          <td>${mix5Drops} drops (${mix5Ml} ml)</td>
          <td>${bottleDrops} drops (${bottleMl} ml)</td>
        </tr>
      `;
    }).join('');
  }

  DOM.targetSolverResults.dataset.lastSolution = JSON.stringify({
    targetHex,
    predictedHex: result.predictedHex,
    ratioString: result.ratioString,
    bestMix: result.bestMix
  });

  DOM.targetSolverResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function loadSolutionIntoMixer(solution) {
  const mixerTab = document.querySelector('[data-tab="mixer"]');
  if (mixerTab) mixerTab.click();

  if (!DOM.colorSelectors) return;
  DOM.colorSelectors.innerHTML = '';
  colorRowCount = 0;

  solution.bestMix.forEach(item => {
    addColorRow(item.color, item.parts, item.brand || 'Standard');
  });

  calculateMix();
}

function saveTargetSolution(solution) {
  const formulaData = {
    name: `Target ${solution.targetHex} Mix`,
    colors: solution.bestMix,
    ratio: solution.ratioString,
    totalVolume: 5,
    unit: 'ml',
    resultingColor: solution.predictedHex,
    notes: `Matched target ${solution.targetHex}`,
    primaryBrand: solution.bestMix[0] ? solution.bestMix[0].brand : 'Standard'
  };

  promptSaveFormulaModal(formulaData);
}

function printTargetSolution(solution) {
  if (!solution) return;
  const formulaData = {
    id: 'TGT-' + Date.now().toString().slice(-6),
    name: `Target Match (${solution.targetHex || ''})`,
    resultingColor: solution.predictedHex,
    ratio: solution.ratioString || '1:1',
    colors: (solution.bestMix || []).map(m => ({
      color: m.color,
      shadeName: m.shadeName || m.color,
      parts: m.parts,
      brand: m.brand || 'Standard',
      batchNumber: ''
    })),
    notes: `Target Color: ${solution.targetHex || ''} | Predicted Result: ${solution.predictedHex} | Ratio: ${solution.ratioString || '1:1'}`,
    createdAt: new Date().toISOString()
  };

  if (typeof window.printFormulaCard === 'function') {
    window.printFormulaCard(formulaData);
  }
}

// ==========================================
// 3. GRAY WASH PRO STUDIO SERIES
// ==========================================

const GRAY_WASH_SYSTEMS = {
  'system_4cap': {
    name: '4-Cap Studio Standard',
    caps: [
      { name: 'Cap 1: Whisper Wash', pct: 5 },
      { name: 'Cap 2: Light Wash', pct: 20 },
      { name: 'Cap 3: Mid-Tone Wash', pct: 50 },
      { name: 'Cap 4: Solid Black', pct: 100 }
    ]
  },
  'system_3cap': {
    name: '3-Cap Essential',
    caps: [
      { name: 'Cap 1: Light Wash', pct: 10 },
      { name: 'Cap 2: Medium Wash', pct: 40 },
      { name: 'Cap 3: Solid Black', pct: 100 }
    ]
  },
  'system_5cap': {
    name: '5-Cap Micro-Gradient',
    caps: [
      { name: 'Cap 1: Micro Tone (#1)', pct: 5 },
      { name: 'Cap 2: Light Wash (#2)', pct: 15 },
      { name: 'Cap 3: Mid Wash (#3)', pct: 30 },
      { name: 'Cap 4: Dark Wash (#4)', pct: 60 },
      { name: 'Cap 5: Solid Black (#5)', pct: 100 }
    ]
  }
};
// Aliases for compatibility
GRAY_WASH_SYSTEMS['4cap'] = GRAY_WASH_SYSTEMS['system_4cap'];
GRAY_WASH_SYSTEMS['3cap'] = GRAY_WASH_SYSTEMS['system_3cap'];
GRAY_WASH_SYSTEMS['5cap'] = GRAY_WASH_SYSTEMS['system_5cap'];

const CONTAINER_SIZES = {
  'caps_large': { name: '#16 Large Cap', ml: 2.0, drops: 40 },
  'caps_medium': { name: '#12 Medium Cap', ml: 1.0, drops: 20 },
  'caps_small': { name: '#9 Small Cap', ml: 0.5, drops: 10 },
  'bottle_1oz': { name: '1 oz Squeeze Bottle', ml: 30.0, drops: 600 },
  'bottle_2oz': { name: '2 oz Squeeze Bottle', ml: 60.0, drops: 1200 },
  'bottle_4oz': { name: '4 oz Squeeze Bottle', ml: 120.0, drops: 2400 }
};
CONTAINER_SIZES['cap16'] = CONTAINER_SIZES['caps_large'];
CONTAINER_SIZES['cap12'] = CONTAINER_SIZES['caps_medium'];
CONTAINER_SIZES['cap9'] = CONTAINER_SIZES['caps_small'];

const DILUENT_FORMULATIONS = {
  'balanced_blend': {
    name: 'Studio Balanced Blend',
    desc: '70% Distilled Water, 25% USP Witch Hazel, 5% USP Glycerin',
    components: [
      { name: 'Distilled Water', ratio: 0.70 },
      { name: 'USP Witch Hazel', ratio: 0.25 },
      { name: 'USP Vegetable Glycerin', ratio: 0.05 }
    ]
  },
  'distilled': {
    name: '100% Pure Distilled Water',
    desc: 'Sterile carrier without additives',
    components: [
      { name: 'Distilled Water', ratio: 1.0 }
    ]
  },
  'witch_hazel': {
    name: 'USP Witch Hazel',
    desc: 'Astringent carrier promotes skin pore tightening during shading',
    components: [
      { name: 'USP Witch Hazel', ratio: 1.0 }
    ]
  },
  'glycerin': {
    name: 'USP Vegetable Glycerin Dilution',
    desc: 'Needle flow enhancer & anti-drying vehicle',
    components: [
      { name: 'USP Vegetable Glycerin', ratio: 1.0 }
    ]
  }
};
DILUENT_FORMULATIONS['water_witch'] = DILUENT_FORMULATIONS['balanced_blend'];

function initGrayWashSeries() {
  const sysSelect = document.getElementById('washSystemSelect');
  const capSelect = document.getElementById('washCapSizeSelect');
  const diluentSelect = document.getElementById('washDiluentSelect');
  const genBtn = document.getElementById('generateWashBtn');
  const saveBtn = document.getElementById('saveWashSeriesBtn');
  const copyBtn = document.getElementById('copyWashSeriesBtn');
  const capTrayBtn = document.getElementById('openCapTrayFromWashBtn');
  const customSlider = document.getElementById('customWashSlider');

  if (sysSelect) sysSelect.onchange = renderGrayWashLadder;
  if (capSelect) capSelect.onchange = renderGrayWashLadder;
  if (diluentSelect) diluentSelect.onchange = renderGrayWashLadder;

  if (genBtn) genBtn.onclick = renderGrayWashLadder;
  if (saveBtn) saveBtn.onclick = saveGrayWashSeries;
  if (copyBtn) copyBtn.onclick = copyGrayWashSeries;

  if (capTrayBtn) {
    capTrayBtn.onclick = () => {
      openCapTrayModal('graywash');
    };
  }

  if (customSlider) {
    customSlider.oninput = updateCustomWash;
    customSlider.onchange = updateCustomWash;
  }

  renderGrayWashLadder();
  updateCustomWash();
}

function renderGrayWashLadder() {
  const grid = document.getElementById('washLadderGrid');
  if (!grid) return;

  const sysSelect = document.getElementById('washSystemSelect');
  const capSelect = document.getElementById('washCapSizeSelect');
  const diluentSelect = document.getElementById('washDiluentSelect');

  const sysKey = sysSelect ? sysSelect.value : 'system_4cap';
  const capSizeKey = capSelect ? capSelect.value : 'caps_large';
  const diluentKey = diluentSelect ? diluentSelect.value : 'balanced_blend';

  const system = GRAY_WASH_SYSTEMS[sysKey] || GRAY_WASH_SYSTEMS['system_4cap'];
  const container = CONTAINER_SIZES[capSizeKey] || CONTAINER_SIZES['caps_large'];
  const diluent = DILUENT_FORMULATIONS[diluentKey] || DILUENT_FORMULATIONS['balanced_blend'];

  const _t = (k, p) => (typeof window.t === 'function' ? window.t(k, p) : k);

  function getLocalizedSysName(key) {
    if (key === 'system_4cap' || key === '4cap') return _t('grayWash.system4capName');
    if (key === 'system_3cap' || key === '3cap') return _t('grayWash.system3capName');
    if (key === 'system_5cap' || key === '5cap') return _t('grayWash.system5capName');
    return GRAY_WASH_SYSTEMS[key]?.name || 'Gray Wash';
  }

  function getLocalizedContainerName(key) {
    if (key === 'caps_large' || key === 'cap16') return _t('grayWash.containerCap16');
    if (key === 'caps_medium' || key === 'cap12') return _t('grayWash.containerCap12');
    if (key === 'caps_small' || key === 'cap9') return _t('grayWash.containerCap9');
    if (key === 'bottle_1oz') return _t('grayWash.containerBottle1oz');
    if (key === 'bottle_2oz') return _t('grayWash.containerBottle2oz');
    if (key === 'bottle_4oz') return _t('grayWash.containerBottle4oz');
    return CONTAINER_SIZES[key]?.name || 'Cap';
  }

  function getLocalizedDiluentName(key) {
    if (key === 'balanced_blend' || key === 'water_witch') return _t('grayWash.balancedBlendName');
    if (key === 'distilled') return _t('grayWash.pureDistilledName');
    if (key === 'witch_hazel') return _t('grayWash.witchHazelName');
    if (key === 'glycerin') return _t('grayWash.glycerinDilutionName');
    return DILUENT_FORMULATIONS[key]?.name || 'Diluent';
  }

  function getLocalizedComponentName(name) {
    const l = (name || '').toLowerCase();
    if (l.includes('distilled')) return _t('grayWash.distilledWaterName');
    if (l.includes('witch hazel')) return _t('grayWash.witchHazelName');
    if (l.includes('glycerin')) return _t('grayWash.glycerinName');
    return name;
  }

  function getLocalizedCapName(capIndex, sKey) {
    if (sKey === 'system_4cap' || sKey === '4cap') {
      const keys = ['grayWash.whisperWash', 'grayWash.lightWash', 'grayWash.midToneWash', 'grayWash.solidBlack'];
      return _t(keys[capIndex] || `Cap ${capIndex + 1}`);
    }
    if (sKey === 'system_3cap' || sKey === '3cap') {
      const keys = ['grayWash.cap3LightWash', 'grayWash.cap3MediumWash', 'grayWash.cap3SolidBlack'];
      return _t(keys[capIndex] || `Cap ${capIndex + 1}`);
    }
    if (sKey === 'system_5cap' || sKey === '5cap') {
      const keys = ['grayWash.cap5MicroTone', 'grayWash.cap5LightWash', 'grayWash.cap5MidWash', 'grayWash.cap5DarkWash', 'grayWash.cap5SolidBlack'];
      return _t(keys[capIndex] || `Cap ${capIndex + 1}`);
    }
    return `Cap ${capIndex + 1}`;
  }

  const localizedSysName = getLocalizedSysName(sysKey);
  const localizedContainerName = getLocalizedContainerName(capSizeKey);
  const localizedDiluentName = getLocalizedDiluentName(diluentKey);

  const totalDropsInCap = container.drops;
  let totalBlackDrops = 0;
  let totalDiluentDrops = 0;

  grid.innerHTML = system.caps.map((cap, capIdx) => {
    const blackFraction = cap.pct / 100;
    const exactDrops = Math.max(1, Math.round(totalDropsInCap * blackFraction));
    const diluentDrops = Math.max(0, totalDropsInCap - exactDrops);
    totalBlackDrops += exactDrops;
    totalDiluentDrops += diluentDrops;

    const blackMl = (exactDrops / 20).toFixed(2);
    const diluentMl = (diluentDrops / 20).toFixed(2);
    const localizedCapTitle = getLocalizedCapName(capIdx, sysKey);

    // Subtractive gray hex calculation
    const val = Math.round(250 * Math.pow(1 - blackFraction, 1.2));
    const grayHex = (typeof window.rgbToHex === 'function') 
      ? window.rgbToHex(val, val, val) 
      : ('#' + ((1 << 24) + (val << 16) + (val << 8) + val).toString(16).slice(1));

    const blackDropsText = exactDrops === 1 
      ? _t('grayWash.dropDetail', { drops: exactDrops, ml: blackMl }) 
      : _t('grayWash.dropsDetail', { drops: exactDrops, ml: blackMl });
    const diluentDropsText = diluentDrops === 1 
      ? _t('grayWash.dropDetail', { drops: diluentDrops, ml: diluentMl }) 
      : _t('grayWash.dropsDetail', { drops: diluentDrops, ml: diluentMl });

    const safeCapTitle = localizedCapTitle.replace(/'/g, "\\'");
    const safeDiluentName = localizedDiluentName.replace(/'/g, "\\'");
    const safeContainerName = localizedContainerName.replace(/'/g, "\\'");

    return `
      <div class="wash-ladder-card">
        <div class="wash-ladder-swatch" style="background-color: ${grayHex};" title="${cap.pct}% Concentration"></div>
        <div class="wash-ladder-info">
          <h5 class="wash-ladder-title">${localizedCapTitle}</h5>
          <div class="wash-ladder-density">${_t('grayWash.carbonBlackConcentration', { pct: cap.pct })}</div>
          <div class="wash-ladder-recipe">
            <div><strong>${blackDropsText}</strong> ${_t('grayWash.carbonBlack')}</div>
            <div><strong>${diluentDropsText}</strong> ${localizedDiluentName}</div>
          </div>
          <div style="margin-top: 0.65rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--outline" onclick="copyWashCapRecipe('${safeCapTitle}', ${exactDrops}, ${diluentDrops}, '${safeDiluentName}', '${safeContainerName}');">
              ${_t('grayWash.copyBtnLabel')}
            </button>
            <button type="button" class="ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--secondary" onclick="loadWashCapIntoMixer('${safeCapTitle}', ${exactDrops}, ${diluentDrops}, '${safeDiluentName}');">
              ${_t('grayWash.loadMixerBtnLabel')}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Update Volumetric Diluent Summary Box
  const summaryBox = document.getElementById('diluentVolumeSummary');
  if (summaryBox) {
    const totalSetupMl = (system.caps.length * container.ml).toFixed(1);
    const totalSetupDrops = system.caps.length * totalDropsInCap;
    const totalBlackMl = (totalBlackDrops / 20).toFixed(2);
    const totalDiluentMl = (totalDiluentDrops / 20).toFixed(2);

    let componentsBreakdown = '';
    if (diluent.components.length > 1) {
      componentsBreakdown = diluent.components.map(comp => {
        const cDrops = Math.round(totalDiluentDrops * comp.ratio);
        const cMl = (cDrops / 20).toFixed(2);
        const localizedCompName = getLocalizedComponentName(comp.name);
        const compDetail = _t('grayWash.dropsDetail', { drops: cDrops, ml: cMl });
        return `<div><span style="color: var(--text-secondary);">${localizedCompName} (${Math.round(comp.ratio * 100)}%):</span> <strong>${compDetail}</strong></div>`;
      }).join('');
    }

    summaryBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
        <div>
          <strong style="font-size: 0.95rem; color: var(--text-primary);">${_t('grayWash.setupMetrics', { name: localizedSysName })}</strong>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">${_t('grayWash.wellsInContainer', { count: system.caps.length, container: localizedContainerName, volume: container.ml })}</div>
        </div>
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-blue);">
          ${_t('grayWash.totalSetup', { volume: totalSetupMl, drops: totalSetupDrops })}
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; font-size: 0.82rem; margin-top: 0.5rem;">
        <div style="background: var(--bg-tertiary); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <span style="color: var(--text-secondary); display: block;">${_t('grayWash.totalCarbonBlack')}</span>
          <strong style="font-size: 0.9rem;">${_t('grayWash.dropsDetail', { drops: totalBlackDrops, ml: totalBlackMl })}</strong>
        </div>
        <div style="background: var(--bg-tertiary); padding: 0.5rem 0.75rem; border-radius: 6px;">
          <span style="color: var(--text-secondary); display: block;">${_t('grayWash.totalDiluentSuspension')}</span>
          <strong style="font-size: 0.9rem;">${_t('grayWash.dropsDetail', { drops: totalDiluentDrops, ml: totalDiluentMl })}</strong>
        </div>
      </div>
      ${componentsBreakdown ? `
        <div style="margin-top: 0.65rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-primary); font-size: 0.8rem; display: flex; flex-wrap: wrap; gap: 1rem;">
          ${componentsBreakdown}
        </div>
      ` : ''}
    `;
  }
}
window.renderGrayWashLadder = renderGrayWashLadder;

function copyWashCapRecipe(name, blackDrops, diluentDrops, diluentName, containerName) {
  const blackMl = (blackDrops / 20).toFixed(2);
  const diluentMl = (diluentDrops / 20).toFixed(2);
  const _t = typeof window.t === 'function' ? window.t : (k, p) => (p && p.name ? p.name : k);
  const blackUnit = blackDrops === 1 ? _t('grayWash.dropBlack') : _t('grayWash.dropsBlack');
  const diluentUnit = diluentDrops === 1 ? _t('grayWash.dropDiluent') : _t('grayWash.dropsDiluent');
  const line1 = _t('grayWash.customRecipeLine', {
    blackDrops: blackDrops,
    blackUnit: blackUnit,
    diluentDrops: diluentDrops,
    diluentUnit: diluentUnit
  });
  const line2 = _t('grayWash.inContainerVolumetric', {
    container: containerName || _t('grayWash.containerCap16'),
    volume: (Number(blackMl) + Number(diluentMl)).toFixed(1),
    blackMl: blackMl,
    diluentMl: diluentMl
  });
  const text = `${name}\n${line1}\n${line2}`;
  navigator.clipboard.writeText(text).then(() => {
    showMessage(_t('grayWash.recipeCopied', { name }), 'success');
  }).catch(() => {
    showMessage(_t('grayWash.recipeDrops', { blackDrops, diluentDrops }), 'info');
  });
}
window.copyWashCapRecipe = copyWashCapRecipe;

function loadWashCapIntoMixer(name, blackDrops, diluentDrops, diluentName) {
  const mixerTab = document.querySelector('[data-tab="mixer"]');
  if (mixerTab) mixerTab.click();

  if (DOM.colorSelectors) {
    DOM.colorSelectors.innerHTML = '';
    colorRowCount = 0;
    addColorRow('black', blackDrops, 'Standard');
    addColorRow('white', diluentDrops, 'Standard');
    if (DOM.totalVolume) DOM.totalVolume.value = '1';
    if (DOM.volumeUnit) DOM.volumeUnit.value = 'caps_large';
    calculateMix();
    const _t = typeof window.t === 'function' ? window.t : (k, p) => `Loaded "${p.name}" into Manual Mixer!`;
    showMessage(_t('grayWash.loadedMixer', { name }), 'success');
  }
}
window.loadWashCapIntoMixer = loadWashCapIntoMixer;

function saveGrayWashSeries() {
  const sysSelect = document.getElementById('washSystemSelect');
  const capSelect = document.getElementById('washCapSizeSelect');
  const diluentSelect = document.getElementById('washDiluentSelect');

  const sysKey = sysSelect ? sysSelect.value : 'system_4cap';
  const capSizeKey = capSelect ? capSelect.value : 'caps_large';
  const diluentKey = diluentSelect ? diluentSelect.value : 'balanced_blend';

  const system = GRAY_WASH_SYSTEMS[sysKey] || GRAY_WASH_SYSTEMS['system_4cap'];
  const container = CONTAINER_SIZES[capSizeKey] || CONTAINER_SIZES['caps_large'];
  const diluent = DILUENT_FORMULATIONS[diluentKey] || DILUENT_FORMULATIONS['balanced_blend'];
  const _t = typeof window.t === 'function' ? window.t : (k, p) => 'Formula library is not available.';

  if (!window.FormulaLibrary) {
    showMessage(_t('grayWash.libraryUnavailable'), 'error');
    return;
  }

  let savedCount = 0;
  system.caps.forEach(cap => {
    const blackFraction = cap.pct / 100;
    const exactDrops = Math.max(1, Math.round(container.drops * blackFraction));
    const diluentDrops = Math.max(0, container.drops - exactDrops);
    const val = Math.round(250 * Math.pow(1 - blackFraction, 1.2));
    const grayHex = (typeof window.rgbToHex === 'function') 
      ? window.rgbToHex(val, val, val) 
      : ('#' + ((1 << 24) + (val << 16) + (val << 8) + val).toString(16).slice(1));

    window.FormulaLibrary.save({
      name: `${system.name} - ${cap.name}`,
      colors: [
        { color: 'black', shadeName: 'Carbon Black', brand: 'Standard', parts: exactDrops, hex: '#111111' },
        { color: 'white', shadeName: diluent.name, brand: 'Carrier', parts: diluentDrops, hex: '#f0f0f0' }
      ],
      ratio: `${exactDrops}:${diluentDrops}`,
      totalVolume: container.ml,
      unit: 'ml',
      resultingColor: grayHex,
      notes: `${cap.pct}% concentration in ${container.name} with ${diluent.name}`,
      tags: ['graywash', 'series'],
      primaryBrand: 'Standard'
    });
    savedCount++;
  });

  if (typeof window.refreshLibraryDisplay === 'function') {
    window.refreshLibraryDisplay();
  }
  showMessage(_t('grayWash.allShadesSaved', { count: savedCount }), 'success');
}
window.saveGrayWashSeries = saveGrayWashSeries;

function copyGrayWashSeries() {
  const sysSelect = document.getElementById('washSystemSelect');
  const capSelect = document.getElementById('washCapSizeSelect');
  const diluentSelect = document.getElementById('washDiluentSelect');

  const sysKey = sysSelect ? sysSelect.value : 'system_4cap';
  const capSizeKey = capSelect ? capSelect.value : 'caps_large';
  const diluentKey = diluentSelect ? diluentSelect.value : 'balanced_blend';

  const system = GRAY_WASH_SYSTEMS[sysKey] || GRAY_WASH_SYSTEMS['system_4cap'];
  const container = CONTAINER_SIZES[capSizeKey] || CONTAINER_SIZES['caps_large'];
  const diluent = DILUENT_FORMULATIONS[diluentKey] || DILUENT_FORMULATIONS['balanced_blend'];
  const _t = typeof window.t === 'function' ? window.t : (k) => 'Full Gray Wash Series recipe copied to clipboard!';

  let text = `🌫️ ${system.name.toUpperCase()}\n`;
  text += `Container: ${container.name} (${container.ml} ml, ~${container.drops} drops)\n`;
  text += `Diluent: ${diluent.name} (${diluent.desc})\n\n`;

  system.caps.forEach((cap, idx) => {
    const blackFraction = cap.pct / 100;
    const exactDrops = Math.max(1, Math.round(container.drops * blackFraction));
    const diluentDrops = Math.max(0, container.drops - exactDrops);
    const blackMl = (exactDrops / 20).toFixed(2);
    const diluentMl = (diluentDrops / 20).toFixed(2);
    text += `[Cap ${idx + 1}] ${cap.name} (${cap.pct}% Concentration)\n`;
    text += `  • Carbon Black: ${exactDrops} drops (${blackMl} ml)\n`;
    text += `  • Diluent: ${diluentDrops} drops (${diluentMl} ml)\n\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    showMessage(_t('grayWash.seriesCopied'), 'success');
  }).catch(() => {
    showMessage(_t('grayWash.clipboardFailed'), 'info');
  });
}
window.copyGrayWashSeries = copyGrayWashSeries;

function updateCustomWash() {
  const slider = document.getElementById('customWashSlider');
  const valDisplay = document.getElementById('customWashVal');
  const resultBox = document.getElementById('customWashResult');
  const capSelect = document.getElementById('washCapSizeSelect');

  if (!slider || !valDisplay || !resultBox) return;

  const pct = parseInt(slider.value, 10);
  valDisplay.textContent = `${pct}%`;

  const capSizeKey = capSelect ? capSelect.value : 'caps_large';
  const container = CONTAINER_SIZES[capSizeKey] || CONTAINER_SIZES['caps_large'];
  const totalDropsInCap = container.drops;

  const blackFraction = pct / 100;
  const exactDrops = Math.max(1, Math.round(totalDropsInCap * blackFraction));
  const diluentDrops = Math.max(0, totalDropsInCap - exactDrops);

  const val = Math.round(250 * Math.pow(1 - blackFraction, 1.2));
  const grayHex = (typeof window.rgbToHex === 'function') 
    ? window.rgbToHex(val, val, val) 
    : ('#' + ((1 << 24) + (val << 16) + (val << 8) + val).toString(16).slice(1));

  const _t = (k, p) => (typeof window.t === 'function' ? window.t(k, p) : k);

  function getLocalizedContainerName(key) {
    if (key === 'caps_large' || key === 'cap16') return _t('grayWash.containerCap16');
    if (key === 'caps_medium' || key === 'cap12') return _t('grayWash.containerCap12');
    if (key === 'caps_small' || key === 'cap9') return _t('grayWash.containerCap9');
    if (key === 'bottle_1oz') return _t('grayWash.containerBottle1oz');
    if (key === 'bottle_2oz') return _t('grayWash.containerBottle2oz');
    if (key === 'bottle_4oz') return _t('grayWash.containerBottle4oz');
    return CONTAINER_SIZES[key]?.name || 'Cap';
  }

  const localizedContainer = getLocalizedContainerName(capSizeKey);
  const blackUnit = exactDrops === 1 ? _t('grayWash.dropBlack') : _t('grayWash.dropsBlack');
  const diluentUnit = diluentDrops === 1 ? _t('grayWash.dropDiluent') : _t('grayWash.dropsDiluent');
  const dropsFormula = _t('grayWash.customRecipeLine', {
    blackDrops: exactDrops,
    blackUnit: blackUnit,
    diluentDrops: diluentDrops,
    diluentUnit: diluentUnit
  });

  const blackMl = (exactDrops / 20).toFixed(2);
  const diluentMl = (diluentDrops / 20).toFixed(2);

  const containerLine = _t('grayWash.inContainerVolumetric', {
    container: localizedContainer,
    volume: container.ml,
    blackMl: blackMl,
    diluentMl: diluentMl
  });

  const customWashTitle = _t('grayWash.customWashFormulaName', { pct: pct });
  const localizedDiluent = _t('grayWash.diluentGeneral');
  const copyBtnText = _t('grayWash.copyRecipeBtnLabel');
  const loadBtnText = _t('grayWash.loadMixerBtnLabel');

  const safeTitle = String(customWashTitle).replace(/'/g, "\\'");
  const safeDiluent = String(localizedDiluent).replace(/'/g, "\\'");
  const safeContainer = String(localizedContainer).replace(/'/g, "\\'");

  resultBox.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      <div class="custom-wash-preview" style="background-color: ${grayHex}; width: 68px; height: 68px; border-radius: 10px; border: 2px solid var(--border-secondary); flex-shrink: 0;" title="${pct}% Custom Wash"></div>
      <div class="custom-wash-details" style="flex: 1; min-width: 200px;">
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">
          ${dropsFormula}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          ${containerLine}
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--outline" onclick="copyWashCapRecipe('${safeTitle}', ${exactDrops}, ${diluentDrops}, '${safeDiluent}', '${safeContainer}');">
            ${copyBtnText}
          </button>
          <button type="button" class="ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--secondary" onclick="loadWashCapIntoMixer('${safeTitle}', ${exactDrops}, ${diluentDrops}, '${safeDiluent}');">
            ${loadBtnText}
          </button>
        </div>
      </div>
    </div>
  `;
}
window.updateCustomWash = updateCustomWash;

// ==========================================
// 4. INVENTORY TAB CONTROLLER
// ==========================================

function openAddBottleModal() {
  const modal = document.getElementById('addBottleModal');
  if (!modal) return;
  const form = document.getElementById('addBottleForm');
  if (form) form.reset();
  const hexInput = document.getElementById('addBottleHex');
  const colorPicker = document.getElementById('addBottleColorPicker');
  if (hexInput) hexInput.value = '#D61818';
  if (colorPicker) colorPicker.value = '#d61818';

  const classSelect = document.getElementById('addBottlePigmentClass');
  if (classSelect) {
    classSelect.onchange = () => {
      const cls = classSelect.value;
      if (window.inkColorDatabase && window.inkColorDatabase[cls]) {
        const hex = window.inkColorDatabase[cls].hex;
        if (hexInput) hexInput.value = hex.toUpperCase();
        if (colorPicker) colorPicker.value = hex;
      }
    };
  }

  modal.style.display = 'flex';
}
window.openAddBottleModal = openAddBottleModal;

function openStarterPaletteModal() {
  const modal = document.getElementById('starterPaletteModal');
  if (!modal) return;
  modal.style.display = 'flex';
}
window.openStarterPaletteModal = openStarterPaletteModal;

function openInventoryQrTransfer() {
  const items = window.InkInventory ? window.InkInventory.getAll() : [];
  const _t = typeof window.t === 'function' ? window.t : (k) => 'Inventory is currently empty. Add inks or load a starter palette before transferring.';
  if (items.length === 0) {
    showMessage(_t('inventory.emptyTransferNotice'), 'info');
    return;
  }
  openQrTransferModal({
    type: 'poli_ink_inventory',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    count: items.length,
    inks: items
  }, 'Studio Ink Inventory');
}
window.openInventoryQrTransfer = openInventoryQrTransfer;

function openExportInventoryModal() {
  const modal = document.getElementById('exportInventoryModal');
  const textarea = document.getElementById('exportInventoryTextarea');
  if (!modal || !textarea) return;

  const items = window.InkInventory ? window.InkInventory.getAll() : [];
  const exportObj = {
    app: 'Poli Tattoo Ink Mixer',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    totalInks: items.length,
    inks: items
  };
  textarea.value = JSON.stringify(exportObj, null, 2);
  modal.style.display = 'flex';
}
window.openExportInventoryModal = openExportInventoryModal;

function initInventoryUI() {
  const addBtn = document.getElementById('addInventoryItemBtn');
  const presetBtn = document.getElementById('loadInventoryPresetBtn');
  const qrBtn = document.getElementById('qrTransferInventoryBtn');
  const exportBtn = document.getElementById('exportInventoryBtn');
  const importInput = document.getElementById('importInventoryFileInput');

  if (addBtn) addBtn.onclick = openAddBottleModal;
  if (presetBtn) presetBtn.onclick = openStarterPaletteModal;
  if (qrBtn) qrBtn.onclick = openInventoryQrTransfer;
  if (exportBtn) exportBtn.onclick = openExportInventoryModal;

  // Add bottle modal controls
  const addModal = document.getElementById('addBottleModal');
  const closeAddBtn = document.getElementById('closeAddBottleModalBtn');
  const cancelAddBtn = document.getElementById('cancelAddBottleBtn');
  const addForm = document.getElementById('addBottleForm');

  if (closeAddBtn && addModal) closeAddBtn.onclick = () => { addModal.style.display = 'none'; };
  if (cancelAddBtn && addModal) cancelAddBtn.onclick = () => { addModal.style.display = 'none'; };

  if (addForm) {
    addForm.onsubmit = (e) => {
      e.preventDefault();
      const shade = document.getElementById('addBottleShade').value.trim();
      if (!shade) return;
      const brand = document.getElementById('addBottleBrand').value.trim() || 'Standard';
      const pigmentClass = document.getElementById('addBottlePigmentClass').value;
      const batchNumber = document.getElementById('addBottleBatch').value.trim();
      const hex = document.getElementById('addBottleHex').value.trim() || '#D61818';

      if (window.InkInventory) {
        window.InkInventory.add({
          shadeName: shade,
          brand,
          pigmentClass,
          batchNumber,
          hex
        });
        refreshInventoryUI();
        if (addModal) addModal.style.display = 'none';
        const _t = typeof window.t === 'function' ? window.t : (k, p) => `Added "${p.shade}" (${p.brand}) to studio inventory!`;
        showMessage(_t('inventory.addedInkNotice', { shade, brand }), 'success');
      }
    };
  }

  // Starter palette modal controls
  const starterModal = document.getElementById('starterPaletteModal');
  const closeStarterBtn = document.getElementById('closeStarterModalBtn');
  if (closeStarterBtn && starterModal) closeStarterBtn.onclick = () => { starterModal.style.display = 'none'; };

  if (starterModal) {
    starterModal.querySelectorAll('.load-preset-action-btn').forEach(btn => {
      btn.onclick = () => {
        const key = btn.dataset.preset;
        if (window.InkInventory) {
          const added = window.InkInventory.loadPreset(key, 'append');
          refreshInventoryUI();
          starterModal.style.display = 'none';
          const _t = typeof window.t === 'function' ? window.t : (k, p) => `Loaded starter palette (${p.count} inks added to inventory)!`;
          showMessage(_t('inventory.loadedStarterNotice', { count: added }), 'success');
        }
      };
    });
  }

  // Export inventory modal controls
  const exportModal = document.getElementById('exportInventoryModal');
  const closeExportBtn = document.getElementById('closeExportInventoryModalBtn');
  const copyExportBtn = document.getElementById('copyExportJsonBtn');
  const downloadExportBtn = document.getElementById('downloadExportJsonBtn');

  if (closeExportBtn && exportModal) closeExportBtn.onclick = () => { exportModal.style.display = 'none'; };
  if (copyExportBtn && exportModal) {
    copyExportBtn.onclick = () => {
      const textarea = document.getElementById('exportInventoryTextarea');
      if (!textarea) return;
      const _t = typeof window.t === 'function' ? window.t : (k) => 'Inventory JSON copied to clipboard!';
      navigator.clipboard.writeText(textarea.value).then(() => {
        showMessage(_t('inventory.jsonCopied'), 'success');
      }).catch(() => {
        textarea.select();
        document.execCommand('copy');
        showMessage(_t('inventory.jsonCopied'), 'success');
      });
    };
  }
  if (downloadExportBtn && exportModal) {
    downloadExportBtn.onclick = () => {
      if (window.InkInventory) window.InkInventory.exportJSON();
    };
  }

  // Import JSON file input
  if (importInput && window.InkInventory) {
    importInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = window.InkInventory.importJSON(evt.target.result);
        const _t = typeof window.t === 'function' ? window.t : (k, p) => p.count ? `Imported ${p.count} ink(s) into inventory!` : `Import failed: ${p.error}`;
        if (res.success) {
          showMessage(_t('inventory.importSuccess', { count: res.count }), 'success');
          refreshInventoryUI();
        } else {
          showMessage(_t('inventory.importFailed', { error: res.error }), 'error');
        }
      };
      reader.readAsText(file);
    };
  }

  refreshInventoryUI();
}

function refreshInventoryUI() {
  const container = document.getElementById('inventoryListContainer');
  if (!container || !window.InkInventory) return;

  const items = window.InkInventory.getAll();
  const countEl = document.getElementById('inventoryCountBadge');
  if (countEl) {
    const _t = typeof window.t === 'function' ? window.t : (k, p) => `${p.count} Inks Recorded in Studio`;
    countEl.textContent = _t('inventory.inksRecorded', { count: items.length });
  }

  if (items.length === 0) {
    container.innerHTML = `<p class="ink-mixer__empty-state">No inks in inventory yet. Click "+ Add Bottle" or "⚡ Load Starter Palette" to record your studio inventory.</p>`;
    return;
  }

  const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;

  container.innerHTML = items.map(item => `
    <div class="inventory-card ${item.inStock ? '' : 'inventory-card--out'}">
      <div class="inventory-card__swatch" style="background-color: ${item.hex || '#808080'};"></div>
      <div class="inventory-card__info">
        <h5 class="inventory-card__name">${item.shadeName}</h5>
        <div class="inventory-card__meta">
          <span class="inventory-card__brand">${item.brand}</span>
          ${item.batchNumber ? `<span class="inventory-card__batch">Lot #${item.batchNumber}</span>` : ''}
          <span class="inventory-card__class">${item.pigmentClass}</span>
        </div>
      </div>
      <div class="inventory-card__actions">
        <button type="button" class="ink-mixer__btn ink-mixer__btn--small ${item.inStock ? 'ink-mixer__btn--outline' : 'ink-mixer__btn--primary'} toggle-stock-btn" data-id="${item.id}">
          ${item.inStock ? _t('inventory.inStock') : _t('inventory.outOfStock')}
        </button>
        <button type="button" class="ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--danger del-ink-btn" data-id="${item.id}" title="${_t('library.deleteBtn')}">×</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.toggle-stock-btn').forEach(btn => {
    btn.onclick = () => {
      window.InkInventory.toggleStock(btn.dataset.id);
      refreshInventoryUI();
    };
  });

  container.querySelectorAll('.del-ink-btn').forEach(btn => {
    btn.onclick = () => {
      window.InkInventory.delete(btn.dataset.id);
      refreshInventoryUI();
      const _t = typeof window.t === 'function' ? window.t : (k) => 'Ink removed from inventory.';
      showMessage(_t('inventory.inkRemoved'), 'info');
    };
  });
}
window.refreshInventoryUI = refreshInventoryUI;

// ==========================================
// 5. PRINTABLE CAP TRAY LABEL SHEETS
// ==========================================

function initCapTrayModal() {
  if (!DOM.capTrayModal) return;

  if (DOM.closeTrayModalBtn) {
    DOM.closeTrayModalBtn.onclick = () => {
      DOM.capTrayModal.style.display = 'none';
    };
  }

  if (DOM.doPrintTrayBtn) {
    DOM.doPrintTrayBtn.onclick = () => {
      window.print();
    };
  }

  if (DOM.trayGridTypeSelect) {
    DOM.trayGridTypeSelect.onchange = renderCapTraySheet;
  }

  if (DOM.trayContentSourceSelect) {
    DOM.trayContentSourceSelect.onchange = renderCapTraySheet;
  }
}

function openCapTrayModal(source = 'graywash') {
  if (!DOM.capTrayModal) return;
  if (DOM.trayContentSourceSelect) {
    DOM.trayContentSourceSelect.value = source;
  }
  DOM.capTrayModal.style.display = 'flex';
  renderCapTraySheet();
}

function renderCapTraySheet() {
  if (!DOM.capTrayPrintContent) return;

  const gridType = DOM.trayGridTypeSelect ? DOM.trayGridTypeSelect.value : '6cap';
  const source = DOM.trayContentSourceSelect ? DOM.trayContentSourceSelect.value : 'graywash';
  const maxWells = gridType === '12cap' ? 12 : 6;

  let title = 'Studio Cap Tray Setup Sheet';
  let subtitle = 'Standard Station Dispensing Layout';
  let wells = [];

  if (source === 'graywash') {
    const sysKey = DOM.washSystemSelect ? DOM.washSystemSelect.value : 'system_4cap';
    const capSizeKey = DOM.washCapSizeSelect ? DOM.washCapSizeSelect.value : 'caps_large';
    const diluentKey = DOM.washDiluentSelect ? DOM.washDiluentSelect.value : 'balanced_blend';
    const system = GRAY_WASH_SYSTEMS[sysKey] || GRAY_WASH_SYSTEMS['system_4cap'];
    const container = CONTAINER_SIZES[capSizeKey] || CONTAINER_SIZES['caps_large'];
    const diluent = DILUENT_FORMULATIONS[diluentKey] || DILUENT_FORMULATIONS['balanced_blend'];

    title = `Gray Wash Station Tray: ${system.name}`;
    subtitle = `Container: ${container.name} (${container.ml} ml) • Diluent: ${diluent.name}`;

    wells = system.caps.map((cap, idx) => {
      const blackFraction = cap.pct / 100;
      const exactDrops = Math.max(1, Math.round(container.drops * blackFraction));
      const diluentDrops = Math.max(0, container.drops - exactDrops);
      return {
        num: idx + 1,
        title: cap.name,
        density: `${cap.pct}% Density`,
        recipe: `${exactDrops} drops Black + ${diluentDrops} drops Diluent`,
        note: 'Dispense in order'
      };
    });

    while (wells.length < maxWells) {
      const nextIdx = wells.length + 1;
      wells.push({
        num: nextIdx,
        title: `Well #${nextIdx} (Water / Rinse)`,
        density: 'Rinse / Diluent',
        recipe: `${container.drops} drops Pure Distilled Water`,
        note: 'Needle Rinse Well'
      });
    }
  } else {
    // Mixer source
    if (currentMixResult && currentMixResult.colors.length > 0) {
      title = `Color Mixer Tray: ${currentMixResult.colors.map(c => c.shadeName || c.color).join(' & ')}`;
      subtitle = `Ratio: ${currentMixResult.ratioString} • Total Volume: ${currentMixResult.totalVolume} ${currentMixResult.unit}`;
      wells = currentMixResult.colors.map((c, idx) => ({
        num: idx + 1,
        title: `${c.shadeName || c.color}`,
        density: `${c.percentage || Math.round((c.parts / currentMixResult.scale.totalParts) * 100)}% of Mix`,
        recipe: `${c.drops || c.parts} drops (${c.brand || 'Standard'})`,
        note: c.batchNumber ? `Lot #${c.batchNumber}` : 'Base Ink'
      }));

      wells.push({
        num: wells.length + 1,
        title: 'Mixed Blend Result',
        density: '100% Blended Recipe',
        recipe: `${currentMixResult.ratioString}`,
        note: 'Final Homogenized Blend'
      });

      while (wells.length < maxWells) {
        const nextIdx = wells.length + 1;
        wells.push({
          num: nextIdx,
          title: `Well #${nextIdx} (Rinse / Diluent)`,
          density: 'Blank Station Well',
          recipe: 'Rinse or Carrier',
          note: 'Auxiliary'
        });
      }
    } else {
      title = 'Custom Artist Station Tray';
      subtitle = 'Configure wells in Color Mixer or Gray Wash Ladder';
      for (let i = 1; i <= maxWells; i++) {
        wells.push({
          num: i,
          title: `Well #${i}`,
          density: 'Custom Ink / Wash',
          recipe: 'Enter drops manual',
          note: 'Record Lot #'
        });
      }
    }
  }

  const gridClass = gridType === '12cap' ? 'tray-sheet-grid--12cap' : 'tray-sheet-grid--6cap';

  const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;

  DOM.capTrayPrintContent.innerHTML = `
    <div class="tray-sheet-print">
      <div class="tray-sheet-header">
        <div class="tray-sheet-brand">
          <div class="tray-sheet-title">${title}</div>
          <div class="tray-sheet-meta">${subtitle}</div>
        </div>
        <div class="tray-sheet-meta" style="text-align: right;">
          <div>${_t('printCard.datePrepared')}: ${new Date().toLocaleDateString()}</div>
          <div>${_t('capTray.trayTypeLabel')}: ${gridType === '12cap' ? _t('capTray.tray12') : _t('capTray.tray6')}</div>
        </div>
      </div>

      <div class="tray-sheet-grid ${gridClass}">
        ${wells.slice(0, maxWells).map(w => `
          <div class="tray-cell">
            <div class="tray-cell__num">${_t('capTray.wellHeader', { num: w.num, name: '' }).replace(': ', '').trim()}</div>
            <div class="tray-cell__swatch-circle" title="${_t('capTray.swatchLabel')}"></div>
            <div class="tray-cell__name">${w.title}</div>
            <div class="tray-cell__recipe">${w.recipe}</div>
            <div class="tray-cell__batch">${_t('capTray.lotLabel')} ____________</div>
          </div>
        `).join('')}
      </div>

      <div class="tray-sheet-footer">
        <span>Poli International Professional Studio Tools • High Contrast Print Sheet</span>
        <span>Dispense sequentially from lightest tone to darkest shade</span>
      </div>
    </div>
  `;
}

// ==========================================
// 6. COMPLEMENTARY & NEUTRALISING HUE ASSISTANT
// ==========================================

function syncNeutralizeColorFromPicker(hex) {
  if (!hex) return;
  const input = document.getElementById('neutralizeCustomInput');
  const picker = document.getElementById('neutralizeColorPicker');
  const select = document.getElementById('unwantedTonePresetSelect');
  if (input) input.value = hex.toUpperCase();
  if (picker && picker.value.toLowerCase() !== hex.toLowerCase()) picker.value = hex;
  if (select) select.value = 'custom';
  if (typeof runNeutralizerAssistant === 'function') {
    runNeutralizerAssistant(hex);
  }
}
window.syncNeutralizeColorFromPicker = syncNeutralizeColorFromPicker;

function syncNeutralizePickerFromHex(raw) {
  if (!raw) return;
  let hex = raw.trim();
  if (!hex.startsWith('#') && /^[0-9A-Fa-f]{3,6}$/.test(hex)) {
    hex = '#' + hex;
  }
  const picker = document.getElementById('neutralizeColorPicker');
  const select = document.getElementById('unwantedTonePresetSelect');
  if (picker && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
    picker.value = hex;
  }
  if (select) select.value = 'custom';
  if (/^#[0-9A-Fa-f]{6}$/.test(hex) && typeof runNeutralizerAssistant === 'function') {
    runNeutralizerAssistant(hex);
  }
}
window.syncNeutralizePickerFromHex = syncNeutralizePickerFromHex;

function initNeutralizerAssistant() {
  if (!DOM.unwantedTonePresetSelect || !DOM.calcNeutralizerBtn) return;

  DOM.unwantedTonePresetSelect.onchange = () => {
    const val = DOM.unwantedTonePresetSelect.value;
    if (val !== 'custom') {
      if (DOM.neutralizeColorPicker) DOM.neutralizeColorPicker.value = val;
      if (DOM.neutralizeCustomInput) DOM.neutralizeCustomInput.value = val.toUpperCase();
      runNeutralizerAssistant(val);
    } else {
      if (DOM.neutralizeCustomInput) DOM.neutralizeCustomInput.focus();
    }
  };

  if (DOM.neutralizeColorPicker) {
    DOM.neutralizeColorPicker.oninput = (e) => {
      syncNeutralizeColorFromPicker(e.target.value);
    };
  }

  DOM.calcNeutralizerBtn.onclick = () => {
    const raw = DOM.neutralizeCustomInput ? DOM.neutralizeCustomInput.value.trim() : '#4A6B5B';
    let hex = raw;
    if (window.parseColorInput) {
      const parsed = window.parseColorInput(raw);
      if (!parsed) {
        const _t = typeof window.t === 'function' ? window.t : (k) => 'Please enter a valid Hex or RGB color.';
        showMessage(_t('neutralizing.invalidColor'), 'error');
        return;
      }
      hex = parsed.hex;
      if (DOM.neutralizeColorPicker) DOM.neutralizeColorPicker.value = hex;
    }
    runNeutralizerAssistant(hex);
  };

  // Initial calculation with preset default
  runNeutralizerAssistant(DOM.unwantedTonePresetSelect.value);
}

function runNeutralizerAssistant(unwantedHex) {
  if (!DOM.neutralizerResultBox || typeof window.calculateSubtractiveComplement !== 'function') return;

  const res = window.calculateSubtractiveComplement(unwantedHex);
  if (!res) return;

  const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;

  const neutralHex = res.complementHex || res.neutralizerHex || '#E07A24';
  const pigmentClass = res.recommendedPigmentClass || res.neutralizerClass || 'orange';
  const localizedClass = res.neutralizerClassLabel || _t('neutralizing.class' + (pigmentClass.charAt(0).toUpperCase() + pigmentClass.slice(1))) || pigmentClass;
  const pigmentClassCaps = (localizedClass || pigmentClass || 'orange').toUpperCase();
  const pigmentClassTitle = localizedClass || (pigmentClass ? (pigmentClass.charAt(0).toUpperCase() + pigmentClass.slice(1)) : 'Orange');
  const undertoneTitle = res.undertoneName || res.neutralizerName || (typeof window.getToneCategory === 'function' ? window.getToneCategory(unwantedHex) : 'Undertone');
  const explanation = res.explanation || res.physicsExplanation || _t('neutralizing.physicsExplanationText');
  const mixingGuideline = res.mixingGuideline || res.ratioGuidance || _t('neutralizing.guidanceDefault');

  DOM.neutralizerResultBox.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--border-radius);">
      <div style="text-align: center;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: ${unwantedHex}; margin: 0 auto 0.4rem; border: 2px solid var(--border-secondary);"></div>
        <strong style="font-size: 0.85rem; display: block; color: var(--text-primary);">${undertoneTitle}</strong>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">${unwantedHex}</span>
      </div>
      <div style="font-size: 1.5rem; color: var(--color-blue); font-weight: 700;">➔</div>
      <div style="text-align: center;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: ${neutralHex}; margin: 0 auto 0.4rem; border: 2px solid var(--border-secondary);"></div>
        <strong style="font-size: 0.85rem; display: block; color: var(--text-primary);">${pigmentClassCaps} ${_t('neutralizing.neutralizerSwatch')}</strong>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">${neutralHex}</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; font-size: 0.88rem; margin-bottom: 1.25rem;">
      <div style="padding: 0.75rem; background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 6px;">
        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${_t('neutralizing.recommendedPigment')}</strong>
        <span style="color: var(--color-blue); font-weight: 700;">${pigmentClassTitle}</span>
        <p style="margin: 0.35rem 0 0; font-size: 0.8rem; color: var(--text-secondary);">${explanation}</p>
      </div>
      <div style="padding: 0.75rem; background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 6px;">
        <strong style="color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${_t('neutralizing.guidanceLabel')}</strong>
        <span style="color: var(--text-primary); font-weight: 600;">${mixingGuideline}</span>
        <p style="margin: 0.35rem 0 0; font-size: 0.8rem; color: var(--text-secondary);">${_t('neutralizing.practiceCapTest')}</p>
      </div>
    </div>

    <div style="text-align: right;">
      <button type="button" id="loadNeutralizerToMixerBtn" class="ink-mixer__btn ink-mixer__btn--secondary">
        ${_t('neutralizing.loadMixerBtn')}
      </button>
    </div>
  `;

  const loadBtn = document.getElementById('loadNeutralizerToMixerBtn');
  if (loadBtn) {
    loadBtn.onclick = () => {
      const mixerTab = document.querySelector('[data-tab="mixer"]');
      if (mixerTab) mixerTab.click();

      if (!DOM.colorSelectors) return;
      DOM.colorSelectors.innerHTML = '';
      colorRowCount = 0;

      const undertoneStr = (undertoneTitle || '').toLowerCase();
      const basePigmentClass = undertoneStr.includes('blue') ? 'blue' : (undertoneStr.includes('green') ? 'green' : 'red');
      addColorRow(basePigmentClass, 10, 'Standard');
      addColorRow(pigmentClass, 1, 'Standard');
      calculateMix();
      const _t = typeof window.t === 'function' ? window.t : (k) => 'Loaded 10:1 neutralizer formulation into Color Mixer!';
      showMessage(_t('neutralizing.loadedMixer'), 'success');
    };
  }
}

// ==========================================
// 7. OFFLINE QR FORMULA TRANSFER
// ==========================================

function initQrModal() {
  if (!DOM.qrTransferModal) return;

  if (DOM.closeQrModalBtn) {
    DOM.closeQrModalBtn.onclick = () => {
      DOM.qrTransferModal.style.display = 'none';
    };
  }

  if (DOM.copyQrPayloadBtn) {
    DOM.copyQrPayloadBtn.onclick = () => {
      const payload = DOM.qrTransferModal.dataset.payload || '';
      if (!payload) return;
      const _t = typeof window.t === 'function' ? window.t : (k) => k.includes('copied') ? 'QR Payload copied to clipboard!' : 'Clipboard copy failed. Please select text manually.';
      navigator.clipboard.writeText(payload).then(() => {
        showMessage(_t('qrTransfer.copiedNotice'), 'success');
      }).catch(() => {
        showMessage(_t('qrTransfer.clipboardFailed'), 'error');
      });
    };
  }

  if (DOM.qrFallbackSingleBtn) {
    DOM.qrFallbackSingleBtn.onclick = () => {
      if (currentMixResult) {
        openQrTransferModal({
          type: 'poli_formula',
          name: currentMixResult.colors.map(c => c.shadeName || c.color).join(' & ') + ' Mix',
          ratio: currentMixResult.ratioString,
          colors: currentMixResult.colors,
          resultingColor: currentMixResult.resultingHex
        }, 'Single Formula Transfer');
      } else {
        const library = window.FormulaLibrary ? window.FormulaLibrary.getAll() : [];
        if (library.length > 0) {
          openQrTransferModal(library[0], library[0].name);
        } else {
          const _t = typeof window.t === 'function' ? window.t : () => 'No formula available to transfer. Calculate a mix in the mixer first.';
          showMessage(_t('qrTransfer.noFormulaToTransfer'), 'info');
        }
      }
    };
  }

  if (DOM.qrFallbackJsonBtn) {
    DOM.qrFallbackJsonBtn.onclick = () => {
      if (window.InkInventory) {
        window.InkInventory.exportJSON();
      }
    };
  }

  if (DOM.qrTransferInventoryBtn) {
    DOM.qrTransferInventoryBtn.onclick = () => {
      const items = window.InkInventory ? window.InkInventory.getAll() : [];
      openQrTransferModal({
        type: 'poli_ink_inventory',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        inks: items
      }, 'Studio Ink Inventory');
    };
  }
}

function openQrTransferModal(payloadData, title = 'Formula Transfer') {
  if (!DOM.qrTransferModal) return;

  DOM.qrTransferModal.style.display = 'flex';
  if (DOM.qrTargetTitle) DOM.qrTargetTitle.textContent = title;

  const jsonStr = typeof payloadData === 'string' ? payloadData : JSON.stringify(payloadData);
  DOM.qrTransferModal.dataset.payload = jsonStr;

  const byteSize = new TextEncoder().encode(jsonStr).length;
  const maxBytes = 2048;

  if (DOM.qrByteCount) {
    DOM.qrByteCount.textContent = `${byteSize.toLocaleString()} bytes / 2,048 max`;
  }

  if (DOM.qrByteBar) {
    const pct = Math.min(100, Math.round((byteSize / maxBytes) * 100));
    DOM.qrByteBar.style.width = `${pct}%`;
  }

  if (byteSize > maxBytes) {
    if (DOM.qrCapacityWarning) DOM.qrCapacityWarning.style.display = 'block';
    if (DOM.qrCodeContainer) {
      DOM.qrCodeContainer.innerHTML = `
        <div style="padding: 1.5rem; color: var(--text-secondary); font-size: 0.85rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;" aria-hidden="true">⚠️</div>
          <strong>QR Payload Exceeds Scannability Limit</strong>
          <p style="margin: 0.5rem 0 0;">The dataset (${byteSize} bytes) exceeds standard 2,048-byte optical scannability. Choose a single formula to transfer via QR, or export the full database as a JSON file.</p>
        </div>
      `;
    }
  } else {
    if (DOM.qrCapacityWarning) DOM.qrCapacityWarning.style.display = 'none';
    if (DOM.qrCodeContainer) {
      DOM.qrCodeContainer.innerHTML = '';
      if (typeof window.QRCode === 'function') {
        try {
          new window.QRCode(DOM.qrCodeContainer, {
            text: jsonStr,
            width: 210,
            height: 210,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : 0
          });
        } catch (e) {
          console.error('QRCode render error:', e);
          const _t = typeof window.t === 'function' ? window.t : (k, d) => d;
          DOM.qrCodeContainer.innerHTML = `<p style="padding: 1rem; color: var(--text-tertiary); font-size: 0.85rem; text-align: center;">${_t('inventory.qrUnavailable', 'QR code unavailable. Use Export JSON to move this formula.')}</p>`;
        }
      } else {
        const _t = typeof window.t === 'function' ? window.t : (k, d) => d;
        DOM.qrCodeContainer.innerHTML = `<p style="padding: 1rem; color: var(--text-tertiary); font-size: 0.85rem; text-align: center;">${_t('inventory.qrUnavailable', 'QR code unavailable. Use Export JSON to move this formula.')}</p>`;
      }
    }
  }
}

// ==========================================
// 8. PRINT & SHARE MODAL
// ==========================================

function initPrintModal() {
  if (!DOM.printRecipeModal) return;

  if (DOM.closePrintModalBtn) {
    DOM.closePrintModalBtn.onclick = () => {
      DOM.printRecipeModal.style.display = 'none';
    };
  }

  if (DOM.doPrintBtn) {
    DOM.doPrintBtn.onclick = () => {
      window.print();
    };
  }
}

// Helpers
function showMessage(msg, type = 'info') {
  const container = document.getElementById('messageContainer');
  if (!container) return;
  container.className = `ink-mixer__message ink-mixer__message--${type}`;
  container.innerHTML = msg;
  container.style.display = 'block';
  setTimeout(() => {
    container.style.display = 'none';
  }, 4500);
}

function clearMessages() {
  const container = document.getElementById('messageContainer');
  if (container) container.style.display = 'none';
}

// Tab navigation handler
function initTabs() {
  const tabButtons = document.querySelectorAll('.ink-mixer__tab, .ink-mixer__tab-btn');
  const tabPanes = document.querySelectorAll('.ink-mixer__tab-content, .ink-mixer__tab-pane');

  tabButtons.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const tabKey = btn.dataset.tab;
      
      tabButtons.forEach(b => {
        b.classList.remove('ink-mixer__tab--active', 'ink-mixer__tab-btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach(p => p.classList.remove('ink-mixer__tab-content--active', 'ink-mixer__tab-pane--active'));

      btn.classList.add('ink-mixer__tab--active', 'ink-mixer__tab-btn--active');
      btn.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(`tab-${tabKey}`) || document.getElementById(tabKey);
      if (targetPane) {
        targetPane.classList.add('ink-mixer__tab-content--active', 'ink-mixer__tab-pane--active');
      }

      if (tabKey === 'library' && typeof window.refreshLibraryDisplay === 'function') {
        window.refreshLibraryDisplay();
      }
      if (tabKey === 'inventory') {
        refreshInventoryUI();
      }
    };
  });
}

// Global Initialization
function initMixerApp() {
  cacheDOM();
  initTabs();
  initForwardMixer();
  initTargetSolver();
  initGrayWashSeries();
  initInventoryUI();
  initPrintModal();
  initCapTrayModal();
  initNeutralizerAssistant();
  initQrModal();
  initSaveFormulaModal();

  if (typeof window.initCalibrationUI === 'function') window.initCalibrationUI();
  if (typeof window.initReferenceStudio === 'function') window.initReferenceStudio();
  if (typeof window.initGradientCapsUI === 'function') window.initGradientCapsUI();
  if (typeof window.initDiluentFormulatorUI === 'function') window.initDiluentFormulatorUI();
  if (typeof window.initStudioVaultUI === 'function') window.initStudioVaultUI();

  if (typeof window.refreshLibraryDisplay === 'function') {
    window.refreshLibraryDisplay();
  }
}

window.initMixerApp = initMixerApp;
window.addColorRow = addColorRow;
window.calculateMix = calculateMix;
window.showMessage = showMessage;
window.clearMessages = clearMessages;
window.openCapTrayModal = openCapTrayModal;
window.openQrTransferModal = openQrTransferModal;
window.setVolumePreset = setVolumePreset;
window.updateVolumePresetHighlight = updateVolumePresetHighlight;
window.syncTargetColorFromPicker = syncTargetColorFromPicker;
window.syncTargetPickerFromHex = syncTargetPickerFromHex;
window.syncNeutralizeColorFromPicker = syncNeutralizeColorFromPicker;
window.syncNeutralizePickerFromHex = syncNeutralizePickerFromHex;
window.promptSaveFormulaModal = promptSaveFormulaModal;
window.saveCurrentFormula = saveCurrentFormula;
window.saveTargetSolution = saveTargetSolution;
window.renderGrayWashLadder = renderGrayWashLadder;
window.updateCustomWash = updateCustomWash;
window.copyWashCapRecipe = copyWashCapRecipe;
window.loadWashCapIntoMixer = loadWashCapIntoMixer;
window.saveGrayWashSeries = saveGrayWashSeries;
window.copyGrayWashSeries = copyGrayWashSeries;
window.openAddBottleModal = openAddBottleModal;
window.openStarterPaletteModal = openStarterPaletteModal;
window.openInventoryQrTransfer = openInventoryQrTransfer;
window.openExportInventoryModal = openExportInventoryModal;
window.refreshInventoryUI = refreshInventoryUI;
window.updateColorRowLabels = updateColorRowLabels;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMixerApp);
} else {
  initMixerApp();
}

window.addEventListener('languageChanged', () => {
  updateColorRowLabels();
  if (currentMixResult) {
    calculateMix();
  }
  if (typeof window.refreshInventoryUI === 'function') {
    window.refreshInventoryUI();
  }
  if (typeof window.refreshLibraryDisplay === 'function') {
    window.refreshLibraryDisplay();
  }
  if (typeof window.renderGrayWashLadder === 'function') {
    window.renderGrayWashLadder();
  }
  if (typeof renderTargetPresets === 'function') {
    renderTargetPresets();
  }
  if (typeof runNeutralizerAssistant === 'function') {
    const presetSelect = document.getElementById('unwantedTonePresetSelect');
    const customInput = document.getElementById('neutralizeCustomInput');
    const hex = (customInput && customInput.value) ? customInput.value : (presetSelect ? presetSelect.value : '#1E3A8A');
    runNeutralizerAssistant(hex);
  }
  if (typeof window.updateCustomWash === 'function') {
    window.updateCustomWash();
  }
});

