/**
 * Piercing Angle & Depth Guide - Clinical Calculator Module
 * Standards: ASTM F-136, ASTM F-138, ASTM F-67, BioFlex® body jewelry.
 * Provides dimensional conversion, fractional inch resolution, gauge conversion, and vector trigonometry.
 */

(function (window) {
  'use strict';

  var Calculator = {};

  var FRACTIONS = [
    { val: 1 / 16, text: '1/16"' },
    { val: 3 / 32, text: '3/32"' },
    { val: 1 / 8, text: '1/8"' },
    { val: 5 / 32, text: '5/32"' },
    { val: 3 / 16, text: '3/16"' },
    { val: 7 / 32, text: '7/32"' },
    { val: 1 / 4, text: '1/4"' },
    { val: 9 / 32, text: '9/32"' },
    { val: 5 / 16, text: '5/16"' },
    { val: 11 / 32, text: '11/32"' },
    { val: 3 / 8, text: '3/8"' },
    { val: 7 / 16, text: '7/16"' },
    { val: 1 / 2, text: '1/2"' },
    { val: 9 / 16, text: '9/16"' },
    { val: 5 / 8, text: '5/8"' },
    { val: 11 / 16, text: '11/16"' },
    { val: 3 / 4, text: '3/4"' },
    { val: 13 / 16, text: '13/16"' },
    { val: 7 / 8, text: '7/8"' },
    { val: 15 / 16, text: '15/16"' },
    { val: 1.0, text: '1"' },
    { val: 1.125, text: '1-1/8"' },
    { val: 1.25, text: '1-1/4"' },
    { val: 1.375, text: '1-3/8"' },
    { val: 1.5, text: '1-1/2"' }
  ];

  var GAUGE_TO_MM = {
    '20G': 0.81,
    '18G': 1.02,
    '16G': 1.29,
    '14G': 1.63,
    '12G': 2.05,
    '10G': 2.59,
    '8G': 3.25,
    '6G': 4.12,
    '4G': 5.19,
    '2G': 6.54,
    '0G': 8.25,
    '00G': 9.27
  };

  Calculator.FRACTIONS = FRACTIONS;
  Calculator.GAUGE_TO_MM = GAUGE_TO_MM;

  /**
   * Convert millimeter measurement to closest imperial standard body jewelry fraction.
   */
  Calculator.getFractionalInch = function (mm) {
    var val = parseFloat(mm);
    if (isNaN(val)) return '';
    var inches = val / 25.4;
    var closest = FRACTIONS[0];
    var minDiff = Math.abs(inches - closest.val);
    for (var i = 1; i < FRACTIONS.length; i++) {
      var diff = Math.abs(inches - FRACTIONS[i].val);
      if (diff < minDiff) {
        minDiff = diff;
        closest = FRACTIONS[i];
      }
    }
    return closest.text;
  };

  /**
   * Format millimeter number according to current active unit system (metric/imperial).
   */
  Calculator.formatMm = function (mm, showDual, unit) {
    var val = parseFloat(mm);
    if (isNaN(val)) return String(mm);
    var currentUnit = unit || 'metric';

    if (currentUnit === 'imperial') {
      var inVal = (val / 25.4).toFixed(3);
      var frac = Calculator.getFractionalInch(val);
      if (showDual) {
        return `${inVal}" (≈ ${frac}) [${val.toFixed(1)} mm]`;
      }
      return `${inVal}" (${frac})`;
    }
    if (showDual) {
      var fracIn = Calculator.getFractionalInch(val);
      return `${val.toFixed(1)} mm (${(val / 25.4).toFixed(3)}" ≈ ${fracIn})`;
    }
    return `${val.toFixed(1)} mm`;
  };

  /**
   * Format a numerical range string according to active unit system.
   */
  Calculator.formatRangeUnit = function (min, max, typical, unit) {
    var minV = parseFloat(min);
    var maxV = parseFloat(max);
    var typV = parseFloat(typical);
    var currentUnit = unit || 'metric';

    if (currentUnit === 'imperial') {
      return `${(minV / 25.4).toFixed(3)}" - ${(maxV / 25.4).toFixed(3)}" (Typical: ${(typV / 25.4).toFixed(3)}" ≈ ${Calculator.getFractionalInch(typV)})`;
    }
    var tpl = '{min} - {max} mm (Typical: {typ} mm)';
    var key = 'ui.min_max_mm_typical_typ_mm';
    var got = window.translate ? window.translate(key, null, tpl) : tpl;
    return (got === key ? tpl : got).replace('{min}', minV.toFixed(1)).replace('{max}', maxV.toFixed(1)).replace('{typ}', typV.toFixed(1));
  };

  /**
   * Return wire diameter in mm for standard body jewelry gauge.
   */
  Calculator.gaugeToMm = function (gaugeStr) {
    if (!gaugeStr) return 1.29; // default 16G
    var normalized = String(gaugeStr).trim().toUpperCase();
    if (GAUGE_TO_MM[normalized]) {
      return GAUGE_TO_MM[normalized];
    }
    var match = normalized.match(/(\d+)G/);
    if (match && GAUGE_TO_MM[match[0]]) {
      return GAUGE_TO_MM[match[0]];
    }
    return 1.29;
  };

  /**
   * Calculate angle deviation between target and clinical measured angle.
   */
  Calculator.calculateAngleDeviation = function (targetAngle, currentAngle) {
    var t = parseFloat(targetAngle) || 90;
    var c = parseFloat(currentAngle) || 90;
    var dev = Math.abs(c - t);
    return {
      target: t,
      current: c,
      deviation: dev,
      isAcceptable: dev <= 3.0,
      isWarning: dev > 3.0 && dev <= 7.0,
      isCritical: dev > 7.0
    };
  };

  /**
   * Calculate post clearance and channel trajectory metrics.
   */
  Calculator.calculateChannelMetrics = function (depthMm, measuredThicknessMm, initialAllowanceRatio) {
    var depth = parseFloat(depthMm) || 8.0;
    var thickness = parseFloat(measuredThicknessMm) || 5.0;
    var ratio = parseFloat(initialAllowanceRatio) || 1.35;
    var initialPostLength = depth * ratio;
    var postExcessMm = Math.max(0, initialPostLength - thickness);
    var recommendedDownsizeMm = depth + 1.0;

    return {
      depthMm: depth,
      thicknessMm: thickness,
      initialPostLengthMm: initialPostLength,
      postExcessMm: postExcessMm,
      recommendedDownsizeMm: recommendedDownsizeMm
    };
  };

  window.PiercingCalculator = Calculator;
})(typeof window !== 'undefined' ? window : this);
