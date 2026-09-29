/**
 * Drop-Volume & Dispenser Tip Calibration Engine
 * Poli International Tattoo Tools Suite
 * 
 * Calibrates physical droplet volume based on studio dispenser tip testing
 * (precision scale gravimetric weighing or graduated syringe volumetrics).
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'poli_ink_mixer_drop_calibration';
  const FACTORY_DEFAULT_DROPS_PER_ML = 20.0; // Standard nominal dropper tip

  let calibrationData = {
    dropsPerMl: FACTORY_DEFAULT_DROPS_PER_ML,
    mlPerDrop: 1.0 / FACTORY_DEFAULT_DROPS_PER_ML,
    testDropsCount: 20,
    measuredValue: 1.0,
    unit: 'ml', // 'ml' or 'g'
    dispenserType: 'standard_twist',
    lastCalibrated: null,
    isCustom: false
  };

  function loadCalibration() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.dropsPerMl === 'number' && parsed.dropsPerMl > 5 && parsed.dropsPerMl < 60) {
          calibrationData = Object.assign(calibrationData, parsed);
        }
      }
    } catch (e) {
      console.warn('Unable to read drop calibration from localStorage', e);
    }
  }

  function saveCalibration() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calibrationData));
      if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('dropCalibrationUpdated', { detail: calibrationData }));
      }
    } catch (e) {
      console.warn('Unable to save drop calibration to localStorage', e);
    }
  }

  function calculateCalibration(testDrops, measuredVal, unit, dispenserType) {
    const drops = Math.max(5, Math.min(100, Number(testDrops) || 20));
    const val = Math.max(0.1, Math.min(10, Number(measuredVal) || 1.0));
    
    // In tattoo suspension diluent / water carriers, density is approximately 1.00 g/cm³ (1 g = 1 mL)
    const volumeMl = val; // Direct equivalence for aqueous/glycol inks at room temperature
    const dropsPerMl = Number((drops / volumeMl).toFixed(1));
    const mlPerDrop = Number((volumeMl / drops).toFixed(4));

    calibrationData = {
      dropsPerMl: Math.max(10, Math.min(50, dropsPerMl)),
      mlPerDrop: mlPerDrop,
      testDropsCount: drops,
      measuredValue: val,
      unit: unit || 'ml',
      dispenserType: dispenserType || 'standard_twist',
      lastCalibrated: new Date().toISOString(),
      isCustom: true
    };

    saveCalibration();
    return calibrationData;
  }

  function resetToFactoryDefault() {
    calibrationData = {
      dropsPerMl: FACTORY_DEFAULT_DROPS_PER_ML,
      mlPerDrop: 1.0 / FACTORY_DEFAULT_DROPS_PER_ML,
      testDropsCount: 20,
      measuredValue: 1.0,
      unit: 'ml',
      dispenserType: 'standard_twist',
      lastCalibrated: null,
      isCustom: false
    };
    saveCalibration();
    return calibrationData;
  }

  function getCalibratedDropsPerMl() {
    return calibrationData.dropsPerMl || FACTORY_DEFAULT_DROPS_PER_ML;
  }

  function getCalibratedMlPerDrop() {
    return calibrationData.mlPerDrop || (1.0 / FACTORY_DEFAULT_DROPS_PER_ML);
  }

  function mlToDrops(ml) {
    const dpm = getCalibratedDropsPerMl();
    return Math.round(Number(ml) * dpm);
  }

  function dropsToMl(drops) {
    const mpd = getCalibratedMlPerDrop();
    return Number((Number(drops) * mpd).toFixed(2));
  }

  function initCalibrationUI() {
    const testCountInput = document.getElementById('calibTestCount');
    const measuredValInput = document.getElementById('calibMeasuredVal');
    const unitSelect = document.getElementById('calibUnitSelect');
    const tipSelect = document.getElementById('calibTipSelect');
    const saveBtn = document.getElementById('calibSaveBtn');
    const resetBtn = document.getElementById('calibResetBtn');
    const outputDpm = document.getElementById('calibOutputDpm');
    const outputMpd = document.getElementById('calibOutputMpd');
    const statusBadge = document.getElementById('calibStatusBadge');

    if (!saveBtn) return;

    function renderDisplay() {
      if (outputDpm) outputDpm.textContent = `${calibrationData.dropsPerMl} drops/ml`;
      if (outputMpd) outputMpd.textContent = `${calibrationData.mlPerDrop} ml/drop`;
      if (statusBadge) {
        statusBadge.textContent = calibrationData.isCustom
          ? `Calibrated: ${calibrationData.dropsPerMl} drops/ml`
          : 'Standard Nominal (20.0 drops/ml)';
      }
      if (testCountInput) testCountInput.value = calibrationData.testDropsCount;
      if (measuredValInput) measuredValInput.value = calibrationData.measuredValue;
      if (unitSelect) unitSelect.value = calibrationData.unit;
      if (tipSelect) tipSelect.value = calibrationData.dispenserType;
    }

    saveBtn.onclick = function () {
      const drops = parseInt(testCountInput ? testCountInput.value : '20', 10);
      const val = parseFloat(measuredValInput ? measuredValInput.value : '1.0');
      const unit = unitSelect ? unitSelect.value : 'ml';
      const tip = tipSelect ? tipSelect.value : 'standard_twist';

      calculateCalibration(drops, val, unit, tip);
      renderDisplay();

      if (typeof window.showNotification === 'function') {
        window.showNotification(`Drop calibration updated: ${calibrationData.dropsPerMl} drops/ml`, 'success');
      }
    };

    if (resetBtn) {
      resetBtn.onclick = function () {
        resetToFactoryDefault();
        renderDisplay();
        if (typeof window.showNotification === 'function') {
          window.showNotification('Calibration reset to standard 20 drops/ml', 'info');
        }
      };
    }

    renderDisplay();
  }

  // Initial load
  loadCalibration();

  // Global exposure
  window.getCalibratedDropsPerMl = getCalibratedDropsPerMl;
  window.getCalibratedMlPerDrop = getCalibratedMlPerDrop;
  window.mlToDrops = mlToDrops;
  window.dropsToMl = dropsToMl;
  window.getDropCalibrationData = function () { return Object.assign({}, calibrationData); };
  window.calculateDropCalibration = calculateCalibration;
  window.resetDropCalibration = resetToFactoryDefault;
  window.initCalibrationUI = initCalibrationUI;

  document.addEventListener('DOMContentLoaded', initCalibrationUI);
})();
