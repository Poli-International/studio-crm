/**
 * Continuous Shading Ladder & Gradient Cap Generator
 * Poli International Tattoo Tools Suite
 * 
 * Computes non-linear subtractive optical dilution steps for multi-cap setups (3 to 12 caps).
 * Integrates physical drop calibration and printable workstation barrier tray cards.
 */

(function () {
  'use strict';

  // Standard cap sizes in milliliters
  const CAP_SIZES = {
    'cap_9': { id: 'cap_9', name: '#9 Small Cap', volumeMl: 0.5 },
    'cap_12': { id: 'cap_12', name: '#12 Medium Cap', volumeMl: 1.0 },
    'cap_16': { id: 'cap_16', name: '#16 Large Cap', volumeMl: 1.8 }
  };

  function getDropsPerMl() {
    return typeof window.getCalibratedDropsPerMl === 'function'
      ? window.getCalibratedDropsPerMl()
      : 20.0;
  }

  function parseHexToRgb(hex) {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16) || 0,
      g: parseInt(clean.substring(2, 4), 16) || 0,
      b: parseInt(clean.substring(4, 6), 16) || 0
    };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generates continuous gradient cap ladder
   * @param {Object} options
   * @param {string} options.originHex - Starting dark/dominant ink hex
   * @param {string} options.originName - Name of origin ink
   * @param {string} options.destinationType - 'diluent' or 'color'
   * @param {string} options.destHex - Ending color/tint hex (if destinationType === 'color')
   * @param {string} options.destName - Name of ending ink/diluent
   * @param {number} options.capCount - Number of caps (3 to 12)
   * @param {string} options.capSizeKey - 'cap_9', 'cap_12', or 'cap_16'
   * @returns {Array} List of cap objects
   */
  function generateGradientLadder(options) {
    const originHex = options.originHex || '#0a0a0a';
    const originName = options.originName || 'Origin Pigment';
    const destType = options.destinationType || 'diluent';
    const destHex = options.destHex || (destType === 'diluent' ? '#f5f5f5' : '#ffffff');
    const destName = options.destName || (destType === 'diluent' ? 'Shading Diluent' : 'Tint Pigment');
    const capCount = Math.max(3, Math.min(12, Number(options.capCount) || 5));
    const capSizeInfo = CAP_SIZES[options.capSizeKey] || CAP_SIZES['cap_12'];
    const totalDropsPerCap = Math.round(capSizeInfo.volumeMl * getDropsPerMl());

    const c1 = parseHexToRgb(originHex);
    const c2 = parseHexToRgb(destHex);

    const caps = [];

    for (let i = 0; i < capCount; i++) {
      // Linear step t from 0 (solid origin) to 1 (pure destination/diluent)
      const t = i / (capCount - 1);

      // Subtractive power-law interpolation:
      // Dark pigments (especially carbon black) have high extinction.
      // A power curve (t^2.2) produces visually uniform perceptual lightness steps.
      const factor = Math.pow(t, 2.0);

      // Drops allocation
      let originDrops = 0;
      let destDrops = 0;

      if (i === 0) {
        originDrops = totalDropsPerCap;
        destDrops = 0;
      } else if (i === capCount - 1) {
        originDrops = 0;
        destDrops = totalDropsPerCap;
      } else {
        // Compute origin drops with minimum 1 drop threshold
        const rawOrigin = Math.round((1 - factor) * totalDropsPerCap);
        originDrops = Math.max(1, Math.min(totalDropsPerCap - 1, rawOrigin));
        destDrops = totalDropsPerCap - originDrops;
      }

      // Predicted visual color
      let previewHex = '#ffffff';
      if (destType === 'diluent') {
        // Dilution against white skin reflection: RGB moves toward skin/white
        const r = Math.round(c1.r + (248 - c1.r) * factor);
        const g = Math.round(c1.g + (248 - c1.g) * factor);
        const b = Math.round(c1.b + (248 - c1.b) * factor);
        previewHex = rgbToHex(r, g, b);
      } else {
        // Physical subtractive blend between two pigments
        const r = Math.round(c1.r * (1 - factor) + c2.r * factor);
        const g = Math.round(c1.g * (1 - factor) + c2.g * factor);
        const b = Math.round(c1.b * (1 - factor) + c2.b * factor);
        previewHex = rgbToHex(r, g, b);
      }

      // Descriptive step tone name with i18n support
      const _t = (k, p) => (typeof window.t === 'function' ? window.t(k, p) : k);
      let stepTone = '';
      if (i === 0) stepTone = _t('gradientCaps.stepSolidBase');
      else if (i === capCount - 1) stepTone = destType === 'diluent' ? _t('gradientCaps.stepPureDiluent') : _t('gradientCaps.stepSolidAccent');
      else if (i === 1) stepTone = _t('gradientCaps.stepDeepShadow');
      else if (i === capCount - 2) stepTone = _t('gradientCaps.stepFeatherHighlight');
      else stepTone = _t('gradientCaps.stepMidtone', { number: i + 1 });

      caps.push({
        capIndex: i + 1,
        stepTone: stepTone,
        previewHex: previewHex,
        originDrops: originDrops,
        originName: originName,
        destDrops: destDrops,
        destName: destName,
        totalDrops: totalDropsPerCap,
        volumeMl: capSizeInfo.volumeMl,
        ratioPercent: Math.round((originDrops / totalDropsPerCap) * 100)
      });
    }

    return caps;
  }

  // Localize common ink / diluent names
  function getLocalizedInkName(name) {
    const _t = (k, p) => (typeof window.t === 'function' ? window.t(k, p) : k);
    if (!name) return '';
    const lower = name.trim().toLowerCase();
    if (lower === 'lining black') return _t('gradientCaps.liningBlack');
    if (lower === 'mixing white') return _t('gradientCaps.mixingWhite');
    if (lower === 'shading diluent') return _t('gradientCaps.shadingDiluent');
    return name;
  }

  // Render Cap Tray UI
  function renderGradientCapTray(caps) {
    const container = document.getElementById('gradientCapTray');
    if (!container) return;

    container.innerHTML = '';
    const _t = (k, p) => (typeof window.t === 'function' ? window.t(k, p) : k);

    caps.forEach(cap => {
      const capEl = document.createElement('div');
      capEl.className = 'gradient-cap-item';

      const localizedOrigin = getLocalizedInkName(cap.originName);
      const localizedDest = getLocalizedInkName(cap.destName);
      const localizedRatio = _t('gradientCaps.basePigmentRatio', { percent: cap.ratioPercent, volume: cap.volumeMl });

      capEl.innerHTML = `
        <div class="gradient-cap-circle" style="background-color: ${cap.previewHex};" title="Cap #${cap.capIndex}: ${cap.previewHex}">
          <span class="gradient-cap-num">#${cap.capIndex}</span>
        </div>
        <div class="gradient-cap-meta">
          <strong style="font-size: 0.85rem; color: var(--text-primary);">${cap.stepTone}</strong>
          <div class="gradient-cap-drops" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
            <span>💧 <strong>${cap.originDrops}</strong> ${localizedOrigin}</span>
            <span>➕ <strong>${cap.destDrops}</strong> ${localizedDest}</span>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-tertiary);">${localizedRatio}</span>
        </div>
      `;

      container.appendChild(capEl);
    });
  }

  // Print Workstation Cap Tray Guide Card
  function printCapTrayCard(caps, options) {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      if (typeof window.showNotification === 'function') {
        window.showNotification('Pop-up blocked. Please permit pop-ups to print tray guides.', 'error');
      }
      return;
    }

    const rows = caps.map(c => `
      <tr>
        <td class="cap-cell-bold">#${c.capIndex}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="swatch-dot" style="background-color: ${c.previewHex};"></span>
            <span>${c.stepTone}</span>
          </div>
        </td>
        <td class="cap-cell-right-bold">${c.originDrops} drops</td>
        <td class="cap-cell-right">${c.destDrops} drops</td>
        <td class="cap-cell-ratio">${c.ratioPercent}%</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Workstation Cap Tray Guide - Poli International</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #111; }
          h2 { margin-top: 0; margin-bottom: 4px; }
          .meta { color: #555; font-size: 0.85rem; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem; }
          th { background: #f0f0f0; border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
          td { padding: 6px 10px; border: 1px solid #ccc; }
          .cap-cell-bold { font-weight: bold; text-align: center; }
          .cap-cell-right { text-align: right; }
          .cap-cell-right-bold { text-align: right; font-weight: bold; }
          .cap-cell-ratio { text-align: right; color: #555; }
          .swatch-dot { display: inline-block; width: 22px; height: 22px; border-radius: 50%; border: 1px solid #999; }
          .footer { font-size: 0.75rem; color: #777; margin-top: 20px; border-top: 1px solid #eee; padding-top: 8px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <h2>🎨 Workstation Gradient Cap Tray Guide</h2>
            <div class="meta">
              Ladder: <strong>${options.originName}</strong> → <strong>${options.destName}</strong> | 
              Caps: <strong>${caps.length}</strong> | 
              Cap Size: <strong>${caps[0].volumeMl} ml</strong> | 
              Calibrated: <strong>${getDropsPerMl()} drops/ml</strong>
            </div>
          </div>
          <button onclick="window.print()" style="padding: 8px 14px; font-size: 0.9rem; cursor: pointer;">🖨️ Print Guide</button>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 60px;">Cap</th>
              <th>Tone / Gradation</th>
              <th style="text-align: right;">${options.originName}</th>
              <th style="text-align: right;">${options.destName}</th>
              <th style="text-align: right;">Density</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          Poli International Tattoo Tools Suite • Subtractive Ink Formulation • Keep this sheet beside workstation barrier tray.
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Init UI
  function initGradientCapsUI() {
    const originHexInput = document.getElementById('gradOriginHex');
    const originColorInput = document.getElementById('gradOriginColor');
    const originNameInput = document.getElementById('gradOriginName');
    const destTypeSelect = document.getElementById('gradDestType');
    const destColorGroup = document.getElementById('gradDestColorGroup');
    const destHexInput = document.getElementById('gradDestHex');
    const destColorInput = document.getElementById('gradDestColor');
    const destNameInput = document.getElementById('gradDestName');
    const capCountSelect = document.getElementById('gradCapCount');
    const capSizeSelect = document.getElementById('gradCapSize');
    const generateBtn = document.getElementById('gradGenerateBtn');
    const printBtn = document.getElementById('gradPrintBtn');

    if (!generateBtn) return;

    function getOptions() {
      const dType = destTypeSelect ? destTypeSelect.value : 'diluent';
      return {
        originHex: originHexInput ? originHexInput.value : '#0a0a0a',
        originName: originNameInput ? originNameInput.value.trim() || 'Lining Black' : 'Lining Black',
        destinationType: dType,
        destHex: destHexInput ? destHexInput.value : (dType === 'diluent' ? '#f5f5f5' : '#ffffff'),
        destName: destNameInput ? destNameInput.value.trim() || (dType === 'diluent' ? 'Shading Diluent' : 'White Tint') : 'Shading Diluent',
        capCount: capCountSelect ? parseInt(capCountSelect.value, 10) : 5,
        capSizeKey: capSizeSelect ? capSizeSelect.value : 'cap_12'
      };
    }

    function runGeneration() {
      const opts = getOptions();
      const caps = generateGradientLadder(opts);
      renderGradientCapTray(caps);
      return { caps, opts };
    }

    if (originColorInput && originHexInput) {
      originColorInput.oninput = function () {
        originHexInput.value = originColorInput.value;
      };
      originHexInput.oninput = function () {
        if (/^#[0-9a-fA-F]{6}$/.test(originHexInput.value)) {
          originColorInput.value = originHexInput.value;
        }
      };
    }

    if (destColorInput && destHexInput) {
      destColorInput.oninput = function () {
        destHexInput.value = destColorInput.value;
      };
      destHexInput.oninput = function () {
        if (/^#[0-9a-fA-F]{6}$/.test(destHexInput.value)) {
          destColorInput.value = destHexInput.value;
        }
      };
    }

    if (destTypeSelect) {
      destTypeSelect.onchange = function () {
        const isColor = destTypeSelect.value === 'color';
        if (destColorGroup) destColorGroup.style.display = isColor ? 'block' : 'none';
        if (destNameInput && !destNameInput.dataset.userEdited) {
          destNameInput.value = isColor ? 'White Highlight Pigment' : 'Shading Diluent';
        }
      };
    }

    generateBtn.onclick = function () {
      runGeneration();
      if (typeof window.showNotification === 'function') {
        window.showNotification('Generated gradient cap tray formulas', 'success');
      }
    };

    if (printBtn) {
      printBtn.onclick = function () {
        const { caps, opts } = runGeneration();
        printCapTrayCard(caps, opts);
      };
    }

    // Initial render
    runGeneration();

    // Re-render when language changes
    window.addEventListener('languageChanged', function () {
      runGeneration();
    });
  }

  // Global exposure
  window.generateGradientLadder = generateGradientLadder;
  window.initGradientCapsUI = initGradientCapsUI;

  document.addEventListener('DOMContentLoaded', initGradientCapsUI);
})();
