/**
 * Formula Ink Substitution View
 * Poli International Tattoo Tools Suite
 * 
 * Pick a saved recipe, mark one ink as out of stock, and choose a replacement
 * from inventory. Evaluates CIEDE2000 color difference (ΔE₀₀) and provides
 * studio test cap guidance.
 */

(function () {
  'use strict';

  let selectedFormula = null;
  let outOfStockIndex = -1;
  let selectedReplacement = null;

  function _t(key, params, fallback) {
    if (typeof window.t === 'function') {
      const res = window.t(key, params);
      if (res && res !== key) return res;
    }
    if (typeof fallback === 'string') return fallback;
    return key;
  }

  function getAvailableFormulas() {
    const saved = typeof FormulaLibrary !== 'undefined' && typeof FormulaLibrary.getAll === 'function'
      ? FormulaLibrary.getAll()
      : [];

    if (saved && saved.length > 0) return saved;

    // Studio benchmark fallback formulas if user has no saved formulas yet
    return [
      {
        id: 'bench_warm_ochre',
        name: 'Warm Ochre Portrait Shadow',
        colors: [
          { color: 'yellow', brand: 'Standard', parts: 4, hex: '#ffd700' },
          { color: 'red', brand: 'Standard', parts: 2, hex: '#d61818' },
          { color: 'black', brand: 'Standard', parts: 1, hex: '#0a0a0a' },
          { color: 'white', brand: 'Standard', parts: 3, hex: '#fdfdfd' }
        ],
        resultingColor: '#9e6d38'
      },
      {
        id: 'bench_forest_shadow',
        name: 'Deep Forest Pine Shadow',
        colors: [
          { color: 'green', brand: 'Standard', parts: 5, hex: '#1b663e' },
          { color: 'black', brand: 'Standard', parts: 2, hex: '#0a0a0a' },
          { color: 'blue', brand: 'Standard', parts: 2, hex: '#1e40af' }
        ],
        resultingColor: '#0f331f'
      },
      {
        id: 'bench_crimson_sunset',
        name: 'Rich Crimson Accent',
        colors: [
          { color: 'red', brand: 'Standard', parts: 6, hex: '#d61818' },
          { color: 'orange', brand: 'Standard', parts: 3, hex: '#ea580c' },
          { color: 'black', brand: 'Standard', parts: 1, hex: '#0a0a0a' }
        ],
        resultingColor: '#8f1515'
      }
    ];
  }

  function getInventoryBottles() {
    if (typeof InkInventory !== 'undefined' && typeof InkInventory.getAll === 'function') {
      const bottles = InkInventory.getAll();
      if (bottles && bottles.length > 0) return bottles;
    }

    // Default core studio palette if inventory is empty
    return [
      { id: 'def_black', brand: 'Standard', shadeName: 'Lining Black', baseClass: 'black', hex: '#0a0a0a' },
      { id: 'def_white', brand: 'Standard', shadeName: 'Mixing White', baseClass: 'white', hex: '#fdfdfd' },
      { id: 'def_red', brand: 'Standard', shadeName: 'Bright Red', baseClass: 'red', hex: '#d61818' },
      { id: 'def_yellow', brand: 'Standard', shadeName: 'Golden Yellow', baseClass: 'yellow', hex: '#ffd700' },
      { id: 'def_blue', brand: 'Standard', shadeName: 'True Blue', baseClass: 'blue', hex: '#1e40af' },
      { id: 'def_orange', brand: 'Standard', shadeName: 'Tangerine Orange', baseClass: 'orange', hex: '#ea580c' },
      { id: 'def_green', brand: 'Standard', shadeName: 'Forest Green', baseClass: 'green', hex: '#1b663e' },
      { id: 'def_purple', brand: 'Standard', shadeName: 'Deep Violet', baseClass: 'purple', hex: '#7c3aed' },
      { id: 'def_brown', brand: 'Standard', shadeName: 'Burnt Umber', baseClass: 'brown', hex: '#633d1f' },
      { id: 'def_magenta', brand: 'Standard', shadeName: 'Process Magenta', baseClass: 'magenta', hex: '#ec4899' }
    ];
  }

  function computeColorLab(hex) {
    if (!hex) return { l: 50, a: 0, b: 0 };
    const rgb = typeof window.hexToRgb === 'function' ? window.hexToRgb(hex) : { r: 128, g: 128, b: 128 };
    return typeof window.rgbToLab === 'function' ? window.rgbToLab(rgb.r, rgb.g, rgb.b) : { l: 50, a: 0, b: 0 };
  }

  function updateSubstitutionView() {
    const recipeSelect = document.getElementById('subRecipeSelect');
    const outOfStockContainer = document.getElementById('subOutOfStockContainer');
    const replacementSelect = document.getElementById('subReplacementSelect');
    const comparisonResults = document.getElementById('subComparisonResults');

    if (!recipeSelect || !comparisonResults) return;

    const formulaId = recipeSelect.value;
    const formulas = getAvailableFormulas();
    selectedFormula = formulas.find(f => f.id === formulaId) || formulas[0];

    if (!selectedFormula || !selectedFormula.colors || selectedFormula.colors.length === 0) {
      comparisonResults.style.display = 'none';
      return;
    }

    // Render Out-of-Stock choices
    if (outOfStockContainer) {
      outOfStockContainer.innerHTML = '';
      selectedFormula.colors.forEach((c, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ink-mixer__btn ink-mixer__btn--small' + (outOfStockIndex === idx ? ' ink-mixer__btn--danger' : ' ink-mixer__btn--outline');
        btn.style.marginRight = '0.5rem';
        btn.style.marginBottom = '0.5rem';
        const colorName = c.shadeName || c.color;
        const brand = c.brand ? ` (${c.brand})` : '';
        btn.innerHTML = (outOfStockIndex === idx ? '❌ ' : '') + `<strong>${colorName}${brand}</strong>: ${c.parts} ${_t('substitution.parts', {}, 'parts')}`;
        btn.onclick = () => {
          outOfStockIndex = idx;
          updateSubstitutionView();
        };
        outOfStockContainer.appendChild(btn);
      });
    }

    // Populate replacement select if not done
    if (replacementSelect) {
      const inventory = getInventoryBottles();
      const currentVal = replacementSelect.value;
      replacementSelect.innerHTML = `<option value="">-- ${_t('substitution.chooseReplacement', {}, 'Choose replacement from inventory')} --</option>` +
        inventory.map(b => {
          const brandStr = b.brand ? ` [${b.brand}]` : '';
          return `<option value="${b.id || b.baseClass || b.shadeName}">${b.shadeName || b.baseClass}${brandStr} (${b.hex})</option>`;
        }).join('');

      if (currentVal) {
        replacementSelect.value = currentVal;
      }
    }

    // Default to first ink if none selected
    if (outOfStockIndex < 0 || outOfStockIndex >= selectedFormula.colors.length) {
      outOfStockIndex = 0;
    }

    const outOfStockInk = selectedFormula.colors[outOfStockIndex];

    // Find chosen replacement
    const inventory = getInventoryBottles();
    const replacementId = replacementSelect ? replacementSelect.value : '';
    selectedReplacement = inventory.find(b => (b.id && b.id === replacementId) || b.baseClass === replacementId || b.shadeName === replacementId) || inventory[1] || inventory[0];

    // Calculate Before mix
    const originalColors = selectedFormula.colors.map(c => ({
      color: c.color || c.baseClass || 'black',
      parts: Number(c.parts) || 1,
      brand: c.brand,
      hex: c.hex
    }));
    const originalHex = (typeof window.estimateResultingColor === 'function')
      ? window.estimateResultingColor(originalColors)
      : (selectedFormula.resultingColor || '#808080');

    // Calculate After mix
    const substitutedColors = selectedFormula.colors.map((c, idx) => {
      if (idx === outOfStockIndex && selectedReplacement) {
        return {
          // Inventory bottles store their pigment as pigmentClass. Defaulting to
          // 'black' mixed every replacement as black; with no class, the
          // estimator falls back to the bottle's own hex.
          color: selectedReplacement.pigmentClass || selectedReplacement.baseClass || selectedReplacement.color,
          parts: Number(c.parts) || 1,
          brand: selectedReplacement.brand,
          hex: selectedReplacement.hex,
          shadeName: selectedReplacement.shadeName
        };
      }
      return {
        color: c.color || c.baseClass || 'black',
        parts: Number(c.parts) || 1,
        brand: c.brand,
        hex: c.hex,
        shadeName: c.shadeName
      };
    });

    const substitutedHex = (typeof window.estimateResultingColor === 'function')
      ? window.estimateResultingColor(substitutedColors)
      : '#777777';

    // Compute CIEDE2000 difference
    const lab1 = computeColorLab(originalHex);
    const lab2 = computeColorLab(substitutedHex);
    const dE = typeof window.ciede2000 === 'function' ? window.ciede2000(lab1, lab2) : 9.9;
    const dEFormatted = dE.toFixed(2);
    const isMismatch = dE > 5.0;

    comparisonResults.style.display = 'block';
    comparisonResults.innerHTML = `
      <div style="margin-top: 1.25rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        
        <!-- Recipe Before -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--border-radius); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <strong style="font-size: 0.95rem; color: var(--text-primary);">${_t('substitution.recipeBefore', {}, 'Recipe Before (Original)')}</strong>
            <span class="ink-mixer__tag">${selectedFormula.name}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 56px; height: 56px; border-radius: 8px; border: 1px solid var(--border-secondary); background-color: ${originalHex}; flex-shrink: 0;" title="${originalHex}"></div>
            <div>
              <div style="font-weight: 700; font-family: monospace; font-size: 1rem; color: var(--text-primary);">${originalHex.toUpperCase()}</div>
              <div style="font-size: 0.78rem; color: var(--text-tertiary);">L* ${lab1.l.toFixed(1)} &bull; a* ${lab1.a.toFixed(1)} &bull; b* ${lab1.b.toFixed(1)}</div>
            </div>
          </div>

          <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem;">
            ${selectedFormula.colors.map((c, idx) => `
              <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--border-secondary); display: flex; justify-content: space-between; align-items: center; ${idx === outOfStockIndex ? 'text-decoration: line-through; color: var(--color-red, #dc2626); font-weight: 600;' : 'color: var(--text-primary);'}">
                <span>${idx === outOfStockIndex ? '❌ ' : ''}${c.shadeName || c.color} ${c.brand ? `(${c.brand})` : ''}</span>
                <strong>${c.parts} ${_t('substitution.parts', {}, 'parts')}</strong>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Recipe After -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--border-radius); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <strong style="font-size: 0.95rem; color: var(--text-primary);">${_t('substitution.recipeAfter', {}, 'Recipe After (Substituted)')}</strong>
            <span class="ink-mixer__tag ink-mixer__tag--blue">${_t('substitution.substitutedTag', {}, 'Substituted')}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 56px; height: 56px; border-radius: 8px; border: 1px solid var(--border-secondary); background-color: ${substitutedHex}; flex-shrink: 0;" title="${substitutedHex}"></div>
            <div>
              <div style="font-weight: 700; font-family: monospace; font-size: 1rem; color: var(--text-primary);">${substitutedHex.toUpperCase()}</div>
              <div style="font-size: 0.78rem; color: var(--text-tertiary);">L* ${lab2.l.toFixed(1)} &bull; a* ${lab2.a.toFixed(1)} &bull; b* ${lab2.b.toFixed(1)}</div>
            </div>
          </div>

          <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem;">
            ${substitutedColors.map((c, idx) => `
              <li style="padding: 0.35rem 0; border-bottom: 1px solid var(--border-secondary); display: flex; justify-content: space-between; align-items: center; ${idx === outOfStockIndex ? 'color: var(--color-blue, #2563eb); font-weight: 700;' : 'color: var(--text-primary);'}">
                <span>${idx === outOfStockIndex ? '🔄 ' : ''}${c.shadeName || c.color} ${c.brand ? `(${c.brand})` : ''}</span>
                <strong>${c.parts} ${_t('substitution.parts', {}, 'parts')}</strong>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Swatch Screen Notice -->
      <div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-tertiary);">
        <span>ℹ️</span>
        <span>${_t('substitution.screenIndicative', {}, 'Screen colour is indicative only on an uncalibrated screen')}</span>
      </div>

      <!-- CIEDE2000 Comparison Metric Card -->
      <div style="margin-top: 1rem; padding: 1rem 1.25rem; border-radius: var(--border-radius); background: var(--bg-tertiary); border: 1px solid var(--border-primary); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-secondary); font-weight: 700;">
            ${_t('substitution.ciede2000Title', {}, 'CIEDE2000 Color Difference')}
          </div>
          <div class="${isMismatch ? 'sub-diff-mismatch' : 'sub-diff-match'}">
            &Delta;E<sub>00</sub>: ${dEFormatted}
          </div>
        </div>

        <div style="max-width: 480px;">
          ${isMismatch ? `
            <div class="sub-alert-danger">
              ${_t('substitution.willNotMatch', {}, 'This will not match. Mix a test cap first.')}
            </div>
          ` : `
            <div class="sub-alert-match">
              ${_t('substitution.closeMatch', {}, 'Close visual match (ΔE ≤ 5.0). Minor shift acceptable for studio use. Mix a test cap to verify on your setup.')}
            </div>
          `}
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" id="subLoadInMixerBtn" class="ink-mixer__btn ink-mixer__btn--secondary ink-mixer__btn--small">
            🎨 ${_t('substitution.loadInMixer', {}, 'Load in Mixer')}
          </button>
          <button type="button" id="subSaveAsNewBtn" class="ink-mixer__btn ink-mixer__btn--primary ink-mixer__btn--small">
            💾 ${_t('substitution.saveAsNew', {}, 'Save Substituted Recipe')}
          </button>
        </div>
      </div>
    `;

    // Hook buttons
    const loadBtn = document.getElementById('subLoadInMixerBtn');
    if (loadBtn) {
      loadBtn.onclick = () => {
        const mixerTab = document.querySelector('[data-tab="mixer"]');
        if (mixerTab) mixerTab.click();
        if (typeof window.addColorRow === 'function' && DOM.colorSelectors) {
          DOM.colorSelectors.innerHTML = '';
          window.colorRowCount = 0;
          substitutedColors.forEach(c => {
            window.addColorRow(c.color, c.parts, c.brand || 'Standard', c.hex);
          });
          const calcBtn = document.getElementById('calculateMixBtn');
          if (calcBtn) calcBtn.click();
        }
      };
    }

    const saveBtn = document.getElementById('subSaveAsNewBtn');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const newName = `${selectedFormula.name} (${selectedReplacement.shadeName || selectedReplacement.color} Sub)`;
        const repName = selectedReplacement.shadeName || selectedReplacement.color;
        const outName = outOfStockInk.shadeName || outOfStockInk.color;
        const newFormula = {
          name: newName,
          colors: substitutedColors,
          resultingColor: substitutedHex,
          notes: _t('substitution.substitutedNotes', { out: outName, rep: repName, de: dEFormatted }, `Substituted ${outName} with ${repName}. ΔE₀₀: ${dEFormatted}.`)
        };

        if (typeof FormulaLibrary !== 'undefined' && typeof FormulaLibrary.save === 'function') {
          FormulaLibrary.save(newFormula);
          if (typeof window.showNotification === 'function') {
            window.showNotification(_t('substitution.savedSuccess', { name: newName }, `Saved "${newName}" to formula library!`), 'success');
          }
          if (typeof window.renderSavedFormulas === 'function') {
            window.renderSavedFormulas();
          }
        }
      };
    }
  }

  function initSubstitutionView() {
    const section = document.getElementById('substitutionViewSection');
    if (!section) return;

    const recipeSelect = document.getElementById('subRecipeSelect');
    const replacementSelect = document.getElementById('subReplacementSelect');

    if (recipeSelect) {
      const formulas = getAvailableFormulas();
      recipeSelect.innerHTML = formulas.map(f => `
        <option value="${f.id}">${f.name} (${(f.colors || []).length} inks)</option>
      `).join('');

      recipeSelect.onchange = () => {
        outOfStockIndex = 0;
        updateSubstitutionView();
      };
    }

    if (replacementSelect) {
      replacementSelect.onchange = () => {
        updateSubstitutionView();
      };
    }

    updateSubstitutionView();
  }

  window.initSubstitutionView = initSubstitutionView;
  window.updateSubstitutionView = updateSubstitutionView;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubstitutionView);
  } else {
    initSubstitutionView();
  }

  window.addEventListener('languageChanged', () => {
    updateSubstitutionView();
  });
})();
