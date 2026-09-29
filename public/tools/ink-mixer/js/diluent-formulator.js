/**
 * Custom Shading Diluent Vehicle Formulator
 * Poli International Tattoo Tools Suite
 * 
 * Formulates custom artist diluent / shading carrier solutions
 * (Sterile Distilled Water, Distilled Witch Hazel, USP Vegetable Glycerin).
 * Integrates drop calibration and printable batch bottle labels.
 */

(function () {
  'use strict';

  const BOTTLE_SIZES = {
    '1oz': { name: '1 oz Squeeze Bottle', ml: 30 },
    '2oz': { name: '2 oz Squeeze Bottle', ml: 60 },
    '4oz': { name: '4 oz Squeeze Bottle', ml: 120 },
    '8oz': { name: '8 oz Squeeze Bottle', ml: 240 },
    'custom': { name: 'Custom Batch Volume', ml: 100 }
  };

  const PRESETS = {
    'balanced': {
      name: 'Studio Balanced Standard',
      desc: 'Ideal all-around shading diluent for smooth grey wash and color tinting.',
      water: 70,
      witchHazel: 25,
      glycerin: 5
    },
    'high_glide': {
      name: 'High-Glide Feathering Blend',
      desc: 'Higher glycerin concentration for reduced needle friction and prolonged cup workability.',
      water: 60,
      witchHazel: 30,
      glycerin: 10
    },
    'fast_dry': {
      name: 'Fast-Drying Light Wash',
      desc: 'High witch hazel astringent content with minimal glycerin for rapid dry-down in realism shading.',
      water: 50,
      witchHazel: 48,
      glycerin: 2
    },
    'custom': {
      name: 'Custom Artist Ratio',
      desc: 'Custom formulated ratios for specialized needle configurations and techniques.',
      water: 70,
      witchHazel: 25,
      glycerin: 5
    }
  };

  function getDropsPerMl() {
    return typeof window.getCalibratedDropsPerMl === 'function'
      ? window.getCalibratedDropsPerMl()
      : 20.0;
  }

  /**
   * Calculates volumetric and drop breakdown for diluent recipe
   */
  function calculateDiluentBatch(batchMl, waterPct, witchHazelPct, glycerinPct) {
    const totalPct = waterPct + witchHazelPct + glycerinPct;
    const factor = totalPct > 0 ? 100 / totalPct : 1;

    const normWater = (waterPct * factor) / 100;
    const normWitch = (witchHazelPct * factor) / 100;
    const normGlyc = (glycerinPct * factor) / 100;

    const waterMl = Number((batchMl * normWater).toFixed(1));
    const witchMl = Number((batchMl * normWitch).toFixed(1));
    const glycMl = Number((batchMl * normGlyc).toFixed(1));

    const dpm = getDropsPerMl();
    const waterDrops = Math.round(waterMl * dpm);
    const witchDrops = Math.round(witchMl * dpm);
    const glycDrops = Math.round(glycMl * dpm);

    // Fluid drams (1 fl oz = 8 fluid drams = ~29.57 ml => 1 dram ≈ 3.7 ml)
    const waterDrams = Number((waterMl / 3.6967).toFixed(1));
    const witchDrams = Number((witchMl / 3.6967).toFixed(1));
    const glycDrams = Number((glycMl / 3.6967).toFixed(1));

    return {
      totalMl: batchMl,
      water: {
        percent: Math.round(normWater * 100),
        ml: waterMl,
        drops: waterDrops,
        drams: waterDrams
      },
      witchHazel: {
        percent: Math.round(normWitch * 100),
        ml: witchMl,
        drops: witchDrops,
        drams: witchDrams
      },
      glycerin: {
        percent: Math.round(normGlyc * 100),
        ml: glycMl,
        drops: glycDrops,
        drams: glycDrams
      }
    };
  }

  // Print Batch Bottle Label
  function printDiluentBottleLabel(batchData, recipeName, batchNotes) {
    const printWindow = window.open('', '_blank', 'width=600,height=500');
    if (!printWindow) {
      if (typeof window.showNotification === 'function') {
        window.showNotification('Pop-up blocked. Please permit pop-ups to print bottle labels.', 'error');
      }
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Diluent Bottle Label - Poli International</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #111; }
          .label-box {
            width: 320px;
            border: 2px solid #222;
            border-radius: 6px;
            padding: 14px;
            box-sizing: border-box;
            background: #fff;
          }
          h3 { margin: 0 0 6px 0; font-size: 1.1rem; border-bottom: 2px solid #222; padding-bottom: 4px; }
          .meta { font-size: 0.8rem; color: #444; margin-bottom: 10px; }
          .ing-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 10px; }
          .ing-table td { padding: 3px 0; border-bottom: 1px dotted #ccc; }
          .ing-table td.qty { text-align: right; font-weight: bold; }
          .warning { font-size: 0.7rem; color: #666; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 6px; }
          .notes-text { font-size: 0.75rem; color: #333; margin-bottom: 6px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="margin-bottom: 14px;">
          <button onclick="window.print()" style="padding: 8px 16px; cursor: pointer;">🖨️ Print Bottle Label</button>
        </div>

        <div class="label-box">
          <h3>SHADING DILUENT VEHICLE</h3>
          <div class="meta">
            <strong>${recipeName}</strong> (${batchData.totalMl} ml)<br>
            Prepared: <strong>${today}</strong> | Batch ID: <strong>DIL-${Date.now().toString(36).toUpperCase()}</strong>
          </div>

          <table class="ing-table">
            <tr>
              <td>Sterile Distilled Water (${batchData.water.percent}%)</td>
              <td class="qty">${batchData.water.ml} ml (${batchData.water.drops} drops)</td>
            </tr>
            <tr>
              <td>Distilled Witch Hazel (${batchData.witchHazel.percent}%)</td>
              <td class="qty">${batchData.witchHazel.ml} ml (${batchData.witchHazel.drops} drops)</td>
            </tr>
            <tr>
              <td>USP Vegetable Glycerin (${batchData.glycerin.percent}%)</td>
              <td class="qty">${batchData.glycerin.ml} ml (${batchData.glycerin.drops} drops)</td>
            </tr>
          </table>

          ${batchNotes ? `<div class="notes-text">Notes: ${batchNotes}</div>` : ''}

          <div class="warning">
            Poli International Tattoo Tools Suite • Store in clean sealed squeeze bottle. Practice sterile technique. Discard within recommended studio timeframe.
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function initDiluentFormulatorUI() {
    const sizeSelect = document.getElementById('diluentSizeSelect');
    const customMlInput = document.getElementById('diluentCustomMl');
    const customMlGroup = document.getElementById('diluentCustomMlGroup');
    const presetSelect = document.getElementById('diluentPresetSelect');
    const waterSlider = document.getElementById('diluentWaterSlider');
    const witchSlider = document.getElementById('diluentWitchSlider');
    const glycSlider = document.getElementById('diluentGlycSlider');
    const waterVal = document.getElementById('diluentWaterVal');
    const witchVal = document.getElementById('diluentWitchVal');
    const glycVal = document.getElementById('diluentGlycVal');
    const outputWater = document.getElementById('diluentOutWater');
    const outputWitch = document.getElementById('diluentOutWitch');
    const outputGlyc = document.getElementById('diluentOutGlyc');
    const outputTotal = document.getElementById('diluentOutTotal');
    const printBtn = document.getElementById('diluentPrintBtn');
    const notesInput = document.getElementById('diluentNotesInput');

    if (!sizeSelect || !presetSelect) return;

    function getBatchMl() {
      if (sizeSelect.value === 'custom') {
        return Math.max(10, Math.min(1000, parseInt(customMlInput ? customMlInput.value : '100', 10) || 100));
      }
      return BOTTLE_SIZES[sizeSelect.value] ? BOTTLE_SIZES[sizeSelect.value].ml : 60;
    }

    function updateCalculations() {
      const batchMl = getBatchMl();
      const w = parseInt(waterSlider ? waterSlider.value : '70', 10);
      const h = parseInt(witchSlider ? witchSlider.value : '25', 10);
      const g = parseInt(glycSlider ? glycSlider.value : '5', 10);

      if (waterVal) waterVal.textContent = `${w}%`;
      if (witchVal) witchVal.textContent = `${h}%`;
      if (glycVal) glycVal.textContent = `${g}%`;

      const res = calculateDiluentBatch(batchMl, w, h, g);

      if (outputWater) outputWater.textContent = `${res.water.ml} ml (${res.water.drops} drops)`;
      if (outputWitch) outputWitch.textContent = `${res.witchHazel.ml} ml (${res.witchHazel.drops} drops)`;
      if (outputGlyc) outputGlyc.textContent = `${res.glycerin.ml} ml (${res.glycerin.drops} drops)`;
      if (outputTotal) outputTotal.textContent = `${res.totalMl} ml`;

      return res;
    }

    if (sizeSelect) {
      sizeSelect.onchange = function () {
        if (customMlGroup) customMlGroup.style.display = sizeSelect.value === 'custom' ? 'block' : 'none';
        updateCalculations();
      };
    }

    if (customMlInput) {
      customMlInput.oninput = updateCalculations;
    }

    if (presetSelect) {
      presetSelect.onchange = function () {
        const p = PRESETS[presetSelect.value];
        if (p) {
          if (waterSlider) waterSlider.value = p.water;
          if (witchSlider) witchSlider.value = p.witchHazel;
          if (glycSlider) glycSlider.value = p.glycerin;
          updateCalculations();
        }
      };
    }

    [waterSlider, witchSlider, glycSlider].forEach(slider => {
      if (slider) {
        slider.oninput = function () {
          if (presetSelect) presetSelect.value = 'custom';
          updateCalculations();
        };
      }
    });

    if (printBtn) {
      printBtn.onclick = function () {
        const data = updateCalculations();
        const pName = PRESETS[presetSelect.value] ? PRESETS[presetSelect.value].name : 'Custom Diluent';
        const notes = notesInput ? notesInput.value.trim() : '';
        printDiluentBottleLabel(data, pName, notes);
      };
    }

    // Initial calculation
    updateCalculations();
  }

  // Global exposure
  window.calculateDiluentBatch = calculateDiluentBatch;
  window.initDiluentFormulatorUI = initDiluentFormulatorUI;

  document.addEventListener('DOMContentLoaded', initDiluentFormulatorUI);
})();
