/**
 * Formula Library System (V2)
 * Poli International Tattoo Tools Suite
 * 
 * LocalStorage-based save/load/search/export for custom tattoo formulas.
 * 100% client-side: data stays in browser localStorage, zero network transmission.
 * 
 * Includes:
 * - Brand & Batch/Lot tracking
 * - Brand mismatch detection & warning system
 * - Formula scaling (1 Cap, Standard 5ml, Batch 30ml)
 * - Copy recipe as formatted text
 * - Printable studio formula archive sheet
 */

const FormulaLibrary = {
  STORAGE_KEY: 'ink_mixer_formulas',

  generateId() {
    return 'formula_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  save(formulaData) {
    const formulas = this.getAll();
    const newFormula = {
      id: this.generateId(),
      name: formulaData.name || 'Untitled Formula',
      author: formulaData.author || '',
      colors: (formulaData.colors || []).map(c => ({
        color: c.color,
        parts: Number(c.parts) || 1,
        brand: c.brand || 'Standard',
        shadeName: c.shadeName || c.color,
        batchNumber: c.batchNumber || ''
      })),
      ratio: formulaData.ratio || '',
      totalVolume: Number(formulaData.totalVolume) || 5,
      unit: formulaData.unit || 'ml',
      resultingColor: formulaData.resultingColor || '#808080',
      category: formulaData.category || 'custom',
      notes: formulaData.notes || '',
      tags: formulaData.tags || [],
      primaryBrand: formulaData.primaryBrand || (formulaData.colors && formulaData.colors[0] ? formulaData.colors[0].brand : 'Standard'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    formulas.push(newFormula);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formulas));
    return newFormula;
  },

  getAll() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing formulas:', e);
      return [];
    }
  },

  getById(id) {
    const formulas = this.getAll();
    return formulas.find(f => f.id === id) || null;
  },

  update(id, updatedData) {
    const formulas = this.getAll();
    const index = formulas.findIndex(f => f.id === id);
    if (index === -1) return null;

    formulas[index] = {
      ...formulas[index],
      ...updatedData,
      id: id,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formulas));
    return formulas[index];
  },

  delete(id) {
    const formulas = this.getAll();
    const filtered = formulas.filter(f => f.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return filtered.length < formulas.length;
  },

  search(query) {
    if (!query) return this.getAll();
    const formulas = this.getAll();
    const lowerQuery = query.toLowerCase();

    return formulas.filter(f => {
      if (f.name && f.name.toLowerCase().includes(lowerQuery)) return true;
      if (f.notes && f.notes.toLowerCase().includes(lowerQuery)) return true;
      if (f.tags && f.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
      if (f.category && f.category.toLowerCase().includes(lowerQuery)) return true;
      if (f.primaryBrand && f.primaryBrand.toLowerCase().includes(lowerQuery)) return true;
      return false;
    });
  },

  exportToJSON() {
    const formulas = this.getAll();
    const dataStr = JSON.stringify(formulas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ink-formulas-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    URL.revokeObjectURL(url);
  },

  exportFormulaToCSV(formula) {
    if (!formula) return;
    const colors = formula.colors || [];
    const totalVol = parseFloat(formula.totalVolume) || 5;
    const unit = formula.unit || 'ml';

    const scaleData = window.scaleFormulaMeasurements 
      ? window.scaleFormulaMeasurements(colors, totalVol, unit)
      : null;

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = [];
    rows.push(['FORMULA METADATA']);
    rows.push(['Formula Name', escapeCsv(formula.name || 'Custom Mix')]);
    rows.push(['Ratio Formula', escapeCsv(formula.ratio || 'Custom')]);
    rows.push(['Target Volume', escapeCsv(`${totalVol} ${unit}`)]);
    rows.push(['Primary Brand', escapeCsv(formula.primaryBrand || 'Standard')]);
    rows.push(['Resulting Color (Hex)', escapeCsv(formula.resultingColor || '#808080')]);
    rows.push(['Date Recorded', escapeCsv(formula.createdAt ? new Date(formula.createdAt).toLocaleDateString() : new Date().toLocaleDateString())]);
    rows.push(['Artist Notes', escapeCsv(formula.notes || '')]);
    rows.push([]);
    rows.push(['PIGMENT VOLUMETRIC MEASUREMENTS & BATCH BREAKDOWN']);
    rows.push([
      'Pigment / Shade',
      'Manufacturer Brand',
      'Batch / Lot #',
      'Ratio Parts',
      'Percentage (%)',
      'Volume (ml)',
      'Dispensing Drops'
    ]);

    colors.forEach((c, idx) => {
      const m = scaleData && scaleData.measurements && scaleData.measurements[idx];
      rows.push([
        escapeCsv(c.shadeName || c.color),
        escapeCsv(c.brand || 'Standard'),
        escapeCsv(c.batchNumber || ''),
        escapeCsv(c.parts),
        escapeCsv(m ? `${m.percentage}%` : '-'),
        escapeCsv(m ? m.ml : '-'),
        escapeCsv(m ? m.drops : '-')
      ]);
    });

    const csvContent = rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (formula.name || 'formula').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeName}_dispensing_formula.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportAllToCSV() {
    const formulas = this.getAll();
    if (formulas.length === 0) {
      if (typeof window.showMessage === 'function') {
        const _t = typeof window.t === 'function' ? window.t : (k) => 'No formulas found to export.';
        window.showMessage(_t('library.noFormulasToExport'), 'info');
      }
      return;
    }
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };
    const rows = [];
    rows.push([
      'Formula Name',
      'Ratio Formula',
      'Target Volume',
      'Unit',
      'Primary Brand',
      'Resulting Hex',
      'Pigment Breakdown (Parts / Brand / Batch)',
      'Artist Notes',
      'Tags',
      'Date Recorded'
    ]);
    formulas.forEach(f => {
      const colorsStr = (f.colors || []).map(c => {
        const brandStr = c.brand && c.brand !== 'Standard' ? ` [${c.brand}]` : '';
        const batchStr = c.batchNumber ? ` (Lot #${c.batchNumber})` : '';
        return `${c.parts} ${c.shadeName || c.color}${brandStr}${batchStr}`;
      }).join(' + ');
      rows.push([
        escapeCsv(f.name),
        escapeCsv(f.ratio),
        escapeCsv(f.totalVolume),
        escapeCsv(f.unit || 'ml'),
        escapeCsv(f.primaryBrand || 'Standard'),
        escapeCsv(f.resultingColor),
        escapeCsv(colorsStr),
        escapeCsv(f.notes || ''),
        escapeCsv((f.tags || []).join(', ')),
        escapeCsv(f.createdAt || '')
      ]);
    });
    const csvContent = rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ink_formulas_library_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importFromJSON(fileContent) {
    try {
      const imported = JSON.parse(fileContent);
      if (!Array.isArray(imported)) {
        throw new Error('Invalid format: expected array of formulas');
      }

      const existing = this.getAll();
      const newFormulas = imported.map(formula => ({
        ...formula,
        id: this.generateId(),
        createdAt: formula.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      const combined = [...existing, ...newFormulas];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(combined));
      return { success: true, count: newFormulas.length };
    } catch (e) {
      console.error('Import error:', e);
      return { success: false, error: e.message };
    }
  },

  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  /**
   * Generates a plain-text clipboard recipe for sharing or studio logs
   */
  copyAsText(formula) {
    const scale1Cap = window.scaleFormulaMeasurements ? window.scaleFormulaMeasurements(formula.colors, 1, 'caps_large') : null;
    const scale5ml = window.scaleFormulaMeasurements ? window.scaleFormulaMeasurements(formula.colors, 5, 'ml') : null;

    let text = `==============================\n`;
    text += `TATTOO INK FORMULA: ${formula.name.toUpperCase()}\n`;
    text += `==============================\n`;
    text += `Ratio: ${formula.ratio}\n`;
    text += `Primary Brand: ${formula.primaryBrand || 'Standard'}\n`;
    if (formula.notes) text += `Notes: ${formula.notes}\n`;
    text += `------------------------------\n`;
    text += `SINGLE CAP RECIPE (#16 Large Cap / 2ml):\n`;
    if (scale1Cap) {
      scale1Cap.measurements.forEach(m => {
        text += `  • ${m.shadeName} (${m.brand}): ${m.drops} drops (${m.ml} ml / ${m.percentage}%)\n`;
      });
    }
    text += `------------------------------\n`;
    text += `STANDARD MIX (5 ml Dispenser):\n`;
    if (scale5ml) {
      scale5ml.measurements.forEach(m => {
        text += `  • ${m.shadeName} (${m.brand}): ${m.drops} drops (${m.ml} ml)\n`;
      });
    }
    text += `==============================\n`;
    text += `Generated with Poli International Tattoo Tools Suite\n`;

    navigator.clipboard.writeText(text).then(() => {
      if (typeof window.showMessage === 'function') {
        window.showMessage(typeof window.t === 'function' ? window.t('library.copiedRecipe') : 'Recipe copied to clipboard!', 'success');
      }
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
    });
  }
};

/**
 * Checks if the formula's brands match the artist's currently active stock/brand
 */
function checkBrandConsistency(formula) {
  const currentInks = window.InkInventory ? window.InkInventory.getInStock() : [];
  if (currentInks.length === 0) return { hasMismatch: false };

  const formulaBrands = new Set((formula.colors || []).map(c => (c.brand || 'Standard').toLowerCase()));
  const inventoryBrands = new Set(currentInks.map(i => (i.brand || 'Standard').toLowerCase()));

  const missingBrands = [];
  formulaBrands.forEach(b => {
    if (b !== 'standard' && !inventoryBrands.has(b)) {
      missingBrands.push(b);
    }
  });

  if (missingBrands.length > 0) {
    return {
      hasMismatch: true,
      missingBrands,
      message: typeof window.t === 'function' 
        ? window.t('library.brandMismatchNotice', { brands: missingBrands.join(', ') })
        : `Repeatability Notice: This formula was calibrated using ${missingBrands.join(', ')}. Pigment concentrations, particle grinds, and undertones vary between manufacturers. Test a single-drop swatch on practice skin before full application.`
    };
  }

  return { hasMismatch: false };
}

// Render formula card for library display
function renderFormulaCard(formula) {
  const card = document.createElement('div');
  card.className = 'ink-mixer__formula-card';
  card.dataset.formulaId = formula.id;

  // Swatch with simulated fresh color
  const swatchWrap = document.createElement('div');
  swatchWrap.className = 'ink-mixer__swatch-wrap';

  const swatch = document.createElement('div');
  swatch.className = 'ink-mixer__swatch ink-mixer__swatch--small';
  swatch.style.setProperty('--swatch-color', formula.resultingColor || '#808080');
  swatch.style.backgroundColor = formula.resultingColor || '#808080';
  swatch.title = `Hex: ${formula.resultingColor || '#808080'}`;

  swatchWrap.appendChild(swatch);

  // Formula details
  const details = document.createElement('div');
  details.className = 'ink-mixer__formula-details';

  const headerRow = document.createElement('div');
  headerRow.className = 'ink-mixer__formula-card-header';

  const name = document.createElement('h4');
  name.className = 'ink-mixer__formula-name';
  name.textContent = formula.name;

  const brandBadge = document.createElement('span');
  brandBadge.className = 'ink-mixer__brand-badge';
  brandBadge.textContent = formula.primaryBrand || 'Standard';

  headerRow.appendChild(name);
  headerRow.appendChild(brandBadge);

  const ratio = document.createElement('p');
  ratio.className = 'ink-mixer__formula-ratio';
  ratio.innerHTML = `<strong>${typeof window.t === 'function' ? window.t('mixer.ratio') : 'Ratio'}:</strong> ${formula.ratio || 'Custom Mix'}`;

  const colors = document.createElement('p');
  colors.className = 'ink-mixer__formula-colors';
  const colorNames = (formula.colors || []).map(c => {
    const brandStr = c.brand && c.brand !== 'Standard' ? ` [${c.brand}]` : '';
    const batchStr = c.batchNumber ? ` (Lot #${c.batchNumber})` : '';
    return `${c.parts} ${c.shadeName || c.color}${brandStr}${batchStr}`;
  }).join(' + ');
  colors.textContent = colorNames || 'No colors recorded';

  details.appendChild(headerRow);
  details.appendChild(ratio);
  details.appendChild(colors);

  if (formula.notes) {
    const notes = document.createElement('p');
    notes.className = 'ink-mixer__formula-notes';
    notes.textContent = formula.notes;
    details.appendChild(notes);
  }

  // Brand mismatch check
  const brandCheck = checkBrandConsistency(formula);
  if (brandCheck.hasMismatch) {
    const warning = document.createElement('div');
    warning.className = 'ink-mixer__card-warning';
    warning.innerHTML = `<span class="ink-mixer__warning-icon" aria-hidden="true">⚠️</span> <span>${brandCheck.message}</span>`;
    details.appendChild(warning);
  }

  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'ink-mixer__formula-actions';

  const loadBtn = document.createElement('button');
  loadBtn.className = 'ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--primary';
  loadBtn.textContent = typeof window.t === 'function' ? window.t('library.loadBtn') : 'Load in Mixer';
  loadBtn.onclick = () => loadFormulaToMixer(formula);

  const copyBtn = document.createElement('button');
  copyBtn.className = 'ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--outline';
  copyBtn.textContent = typeof window.t === 'function' ? window.t('library.copyTextBtn') : 'Copy Text';
  copyBtn.onclick = () => FormulaLibrary.copyAsText(formula);

  const printBtn = document.createElement('button');
  printBtn.className = 'ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--outline';
  printBtn.textContent = typeof window.t === 'function' ? window.t('library.printBtn') : 'Print Card';
  printBtn.onclick = () => printFormulaCard(formula);

  const csvBtn = document.createElement('button');
  csvBtn.className = 'ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--outline';
  csvBtn.textContent = typeof window.t === 'function' ? window.t('library.downloadCsvBtn') : 'Download CSV';
  csvBtn.title = 'Download formatted CSV for inventory software';
  csvBtn.onclick = () => FormulaLibrary.exportFormulaToCSV(formula);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--danger';
  deleteBtn.textContent = typeof window.t === 'function' ? window.t('library.deleteBtn') : 'Delete';
  deleteBtn.onclick = () => deleteFormula(formula.id);

  actions.appendChild(loadBtn);
  actions.appendChild(copyBtn);
  actions.appendChild(printBtn);
  actions.appendChild(csvBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(swatchWrap);
  card.appendChild(details);
  card.appendChild(actions);

  // Card click selection
  card.onclick = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
    const isSelected = card.classList.contains('ink-mixer__formula-card--selected');
    document.querySelectorAll('.ink-mixer__formula-card').forEach(c => c.classList.remove('ink-mixer__formula-card--selected'));
    if (!isSelected) {
      card.classList.add('ink-mixer__formula-card--selected');
      FormulaLibrary.selectedFormula = formula;
    } else {
      FormulaLibrary.selectedFormula = null;
    }
  };

  return card;
}

// Load formula into mixer
function loadFormulaToMixer(formula) {
  const mixerTab = document.querySelector('[data-tab="mixer"]');
  if (mixerTab) mixerTab.click();

  const colorSelectors = document.getElementById('colorSelectors');
  if (colorSelectors) colorSelectors.innerHTML = '';

  const colors = formula.colors || [];
  colors.forEach((colorData, index) => {
    if (typeof window.addColorRow === 'function') {
      window.addColorRow();
    }

    const selects = document.querySelectorAll('.color-select');
    const partsInputs = document.querySelectorAll('.parts-input');
    const brandInputs = document.querySelectorAll('.brand-input');
    const batchInputs = document.querySelectorAll('.batch-input');

    if (selects[index]) selects[index].value = colorData.color;
    if (partsInputs[index]) partsInputs[index].value = colorData.parts;
    if (brandInputs && brandInputs[index]) brandInputs[index].value = colorData.brand || 'Standard';
    if (batchInputs && batchInputs[index]) batchInputs[index].value = colorData.batchNumber || '';
  });

  const volumeInput = document.getElementById('totalVolume');
  if (volumeInput) volumeInput.value = formula.totalVolume || 5;

  const volumeUnit = document.getElementById('volumeUnit');
  if (volumeUnit) volumeUnit.value = formula.unit || 'ml';

  const calculateBtn = document.getElementById('calculateMixBtn');
  if (calculateBtn) calculateBtn.click();

  // Show brand repeatability alert if mismatch detected
  const brandCheck = checkBrandConsistency(formula);
  const banner = document.getElementById('brandMismatchBanner');
  if (banner) {
    if (brandCheck.hasMismatch) {
      banner.style.display = 'flex';
      const textEl = banner.querySelector('.mismatch-text');
      if (textEl) textEl.textContent = brandCheck.message;
    } else {
      banner.style.display = 'none';
    }
  }
}

// Delete formula safely without window.confirm (compatible with sandboxed iframes)
function deleteFormula(id) {
  const formula = FormulaLibrary.getById(id);
  if (!formula) return;

  FormulaLibrary.delete(id);
  refreshLibraryDisplay();
  if (typeof window.showMessage === 'function') {
    const _t = typeof window.t === 'function' ? window.t : (k, p) => `Formula "${p.name}" removed from library.`;
    window.showMessage(_t('library.formulaRemoved', { name: formula.name }), 'info');
  }
}

// Refresh library display
function refreshLibraryDisplay() {
  const container = document.getElementById('savedFormulasContainer');
  if (!container) return;

  const formulas = FormulaLibrary.getAll();

  if (formulas.length === 0) {
    const emptyMsg = typeof window.t === 'function' 
      ? window.t('library.noSaved')
      : 'No custom formulas saved yet. Build a recipe in the mixer and click "Save to Library".';
    container.innerHTML = `<p class="ink-mixer__empty-state">${emptyMsg}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  formulas.forEach(formula => {
    const card = renderFormulaCard(formula);
    fragment.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(fragment);

  const countElement = document.getElementById('formulaCount');
  if (countElement) {
    const text = typeof window.t === 'function'
      ? window.t('library.formulaCount', { count: formulas.length })
      : `${formulas.length} saved formula${formulas.length !== 1 ? 's' : ''}`;
    countElement.textContent = text;
  }
}

/**
 * Prepares and opens clean print dialog for single formula card
 */
function printFormulaCard(formula) {
  const modal = document.getElementById('printRecipeModal');
  const content = document.getElementById('printRecipeContent');
  if (!modal || !content) return;

  const scale1Cap = window.scaleFormulaMeasurements ? window.scaleFormulaMeasurements(formula.colors, 1, 'caps_large') : null;
  const scale5ml = window.scaleFormulaMeasurements ? window.scaleFormulaMeasurements(formula.colors, 5, 'ml') : null;
  const scale30ml = window.scaleFormulaMeasurements ? window.scaleFormulaMeasurements(formula.colors, 30, 'ml') : null;

  function calcLightness(hex) {
    if (!hex || hex[0] !== '#') return { lStar: 50, lightness: 50, greyscale: 'Mid-Tone' };
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const lightness = Math.round(lum * 100);
    const lStar = lum > 0.008856 ? Math.round(116 * Math.cbrt(lum) - 16) : Math.round(903.3 * lum);
    let greyscale = 'Mid-Tone';
    if (lightness < 15) greyscale = 'Deep Black';
    else if (lightness < 35) greyscale = 'Dark Tone';
    else if (lightness < 65) greyscale = 'Medium Tone';
    else if (lightness < 85) greyscale = 'Light Tint';
    else greyscale = 'Highlight / White';
    return { lStar, lightness, greyscale };
  }

  const mainColorVals = calcLightness(formula.resultingColor || '#808080');

  const dateStr = new Date(formula.createdAt || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;

  content.innerHTML = `
    <div class="print-card">
      <div class="print-card__header">
        <div class="print-card__brand-logo">POLI INTERNATIONAL TATTOO TOOLS</div>
        <div class="print-card__date">STUDIO FORMULA ARCHIVE SHEET • ${dateStr}</div>
      </div>

      <div class="print-card__meta-bar">
        <div class="print-card__meta-item">
          <span class="print-card__meta-label">${_t('printCard.folderRef')}</span>
          <span class="print-card__meta-value">${formula.id ? String(formula.id).slice(0, 12).toUpperCase() : _t('printCard.formulaArchive')}</span>
        </div>
        <div class="print-card__meta-item">
          <span class="print-card__meta-label">${_t('printCard.datePrepared')}</span>
          <span class="print-card__meta-value">${dateStr}</span>
        </div>
        <div class="print-card__meta-item">
          <span class="print-card__meta-label">${_t('printCard.toneClassification')}</span>
          <span class="print-card__meta-value">${mainColorVals.greyscale} (L* ${mainColorVals.lStar})</span>
        </div>
      </div>

      <div class="print-card__title-row">
        <div class="print-card__title-col">
          <h2 class="print-card__title">${formula.name}</h2>
          <div class="print-card__ratio">${_t('printCard.formulaRatioLabel')}: ${formula.ratio}</div>
        </div>
        <div class="print-card__swatch-col">
          <div class="print-card__swatch-main" style="background-color: ${formula.resultingColor || '#808080'};"></div>
          <span class="print-card__swatch-hex">${(formula.resultingColor || '#808080').toUpperCase()}</span>
          <span class="print-card__swatch-lstar">L* ${mainColorVals.lStar} (${mainColorVals.lightness}% Lightness)</span>
        </div>
      </div>

      <div class="print-card__section">
        <h4 class="print-card__subhead">${_t('printCard.batchTraceability')}</h4>
        <table class="print-card__table">
          <thead>
            <tr>
              <th>${_t('printCard.pigmentComponent')}</th>
              <th>${_t('printCard.brandLot')}</th>
              <th>${_t('printCard.partsRatio')}</th>
              <th>1 Cap (#16 / 2ml)</th>
              <th>5 ml Mix</th>
              <th>30 ml Bottle (1 oz)</th>
            </tr>
          </thead>
          <tbody>
            ${(formula.colors || []).map((c, i) => {
              const capDrops = scale1Cap && scale1Cap.measurements[i] ? `${scale1Cap.measurements[i].drops} drops` : '-';
              const ml5Drops = scale5ml && scale5ml.measurements[i] ? `${scale5ml.measurements[i].drops} drops (${scale5ml.measurements[i].ml}ml)` : '-';
              const ml30Drops = scale30ml && scale30ml.measurements[i] ? `${scale30ml.measurements[i].drops} drops (${scale30ml.measurements[i].ml}ml)` : '-';
              const batchText = c.batchNumber ? `Lot #${c.batchNumber}` : _t('printCard.lotNotLogged');
              return `
                <tr>
                  <td><strong>${c.shadeName || c.color}</strong></td>
                  <td><strong>${c.brand || 'Standard'}</strong> • <span style="font-family: monospace;">${batchText}</span></td>
                  <td><strong>${c.parts}</strong></td>
                  <td>${capDrops}</td>
                  <td>${ml5Drops}</td>
                  <td>${ml30Drops}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      ${formula.notes ? `
        <div class="print-card__section">
          <h4 class="print-card__subhead">${_t('printCard.artistNotes')}</h4>
          <p class="print-card__notes">${formula.notes}</p>
        </div>
      ` : ''}

      <div class="print-card__archive-checks">
        <div style="font-weight: 700; margin-bottom: 0.2rem; color: var(--text-primary);">${_t('printCard.checklistTitle')}</div>
        <div>[ &nbsp; ] ${_t('printCard.checkBottlesVerified')}</div>
        <div>[ &nbsp; ] ${_t('printCard.checkSterileCaps')}</div>
        <div>[ &nbsp; ] ${_t('printCard.checkTestedStencil')}</div>
      </div>

      <div class="print-card__footer">
        <span class="print-card__sign-line">${_t('printCard.artistSignature')}</span>
        <span>${_t('printCard.binderCopy')}</span>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function initLibraryUI() {
  const importBtn = document.getElementById('importFormulasBtn');
  const fileInput = document.getElementById('importFormulasFileInput');
  const exportBtn = document.getElementById('exportFormulasBtn');
  const exportCsvBtn = document.getElementById('exportFormulasCsvBtn');
  const searchInput = document.getElementById('formulaSearch');
  const closePrintModalBtn = document.getElementById('closePrintModalBtn');
  const doPrintBtn = document.getElementById('doPrintBtn');

  if (importBtn && fileInput) {
    importBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = FormulaLibrary.importFromJSON(event.target.result);
        const _t = typeof window.t === 'function' ? window.t : (k, p) => p.count ? `Imported ${p.count} formula(s) successfully!` : `Import failed: ${p.error}`;
        if (res.success) {
          refreshLibraryDisplay();
          if (typeof window.showMessage === 'function') {
            window.showMessage(_t('library.importSuccess', { count: res.count }), 'success');
          }
        } else {
          if (typeof window.showMessage === 'function') {
            window.showMessage(_t('library.importFailed', { error: res.error }), 'error');
          }
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    };
  }

  if (exportBtn) {
    exportBtn.onclick = () => FormulaLibrary.exportToJSON();
  }

  if (exportCsvBtn) {
    exportCsvBtn.onclick = () => {
      const _t = typeof window.t === 'function' ? window.t : (k, p) => p && p.name ? `Exported "${p.name}" to CSV!` : 'No saved formulas to export. Save a formula first.';
      if (FormulaLibrary.selectedFormula) {
        FormulaLibrary.exportFormulaToCSV(FormulaLibrary.selectedFormula);
        if (typeof window.showMessage === 'function') {
          window.showMessage(_t('library.exportedSingleCsv', { name: FormulaLibrary.selectedFormula.name }), 'success');
        }
      } else {
        const all = FormulaLibrary.getAll();
        if (all.length === 1) {
          FormulaLibrary.exportFormulaToCSV(all[0]);
          if (typeof window.showMessage === 'function') {
            window.showMessage(_t('library.exportedSingleCsv', { name: all[0].name }), 'success');
          }
        } else if (all.length > 1) {
          FormulaLibrary.exportAllToCSV();
          if (typeof window.showMessage === 'function') {
            window.showMessage(_t('library.exportedAllCsv', { count: all.length }), 'success');
          }
        } else {
          if (typeof window.showMessage === 'function') {
            window.showMessage(_t('library.noSavedFormulas'), 'info');
          }
        }
      }
    };
  }

  if (searchInput) {
    searchInput.oninput = (e) => {
      const q = e.target.value.trim();
      const results = FormulaLibrary.search(q);
      const container = document.getElementById('savedFormulasContainer');
      if (!container) return;
      container.innerHTML = '';
      if (results.length === 0) {
        const _t = typeof window.t === 'function' ? window.t : (k, p) => `No formulas matching "${p.query}"`;
        container.innerHTML = `<p class="ink-mixer__empty-state">${_t('library.noMatchingFormulas', { query: q })}</p>`;
        return;
      }
      const fragment = document.createDocumentFragment();
      results.forEach(f => fragment.appendChild(renderFormulaCard(f)));
      container.appendChild(fragment);
    };
  }

  if (closePrintModalBtn) {
    closePrintModalBtn.onclick = () => {
      const modal = document.getElementById('printRecipeModal');
      if (modal) modal.style.display = 'none';
    };
  }

  if (doPrintBtn) {
    doPrintBtn.onclick = () => window.print();
  }
}

window.FormulaLibrary = FormulaLibrary;
window.renderFormulaCard = renderFormulaCard;
window.loadFormulaToMixer = loadFormulaToMixer;
window.deleteFormula = deleteFormula;
window.refreshLibraryDisplay = refreshLibraryDisplay;
window.printFormulaCard = printFormulaCard;
window.checkBrandConsistency = checkBrandConsistency;
window.initLibraryUI = initLibraryUI;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLibraryUI);
} else {
  initLibraryUI();
}
