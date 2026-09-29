/**
 * CIEDE2000 (ΔE₀₀) Standard Color Difference & Gamut Boundary Analysis
 * Poli International Tattoo Tools Suite - Subtractive Ink Engine
 * 
 * Implements ISO/CIE 11664-6:2014 / CIE 142-2001 color difference standard.
 * Reference: Sharma, G., Wu, W., & Dalal, E. N. (2005).
 * "The CIEDE2000 color-difference formula: Implementation notes, supplementary test data, and mathematical observations."
 */

(function () {
  'use strict';

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function radToDeg(rad) {
    return (rad * 180) / Math.PI;
  }

  /**
   * Computes CIEDE2000 (ΔE₀₀) between two CIE L*a*b* coordinates
   * @param {Object} lab1 - { l: number, a: number, b: number }
   * @param {Object} lab2 - { l: number, a: number, b: number }
   * @param {number} kL - Weighting factor for lightness (default 1.0)
   * @param {number} kC - Weighting factor for chroma (default 1.0)
   * @param {number} kH - Weighting factor for hue (default 1.0)
   * @returns {number} CIEDE2000 color difference
   */
  function ciede2000(lab1, lab2, kL = 1, kC = 1, kH = 1) {
    if (!lab1 || !lab2) return 999;

    const L1 = lab1.l;
    const a1 = lab1.a;
    const b1 = lab1.b;

    const L2 = lab2.l;
    const a2 = lab2.a;
    const b2 = lab2.b;

    // 1. Calculate C' and a'
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const avgC = (C1 + C2) / 2;

    const avgC7 = Math.pow(avgC, 7);
    const G = 0.5 * (1 - Math.sqrt(avgC7 / (avgC7 + 6103515625))); // 25^7 = 6103515625

    const a1Prime = (1 + G) * a1;
    const a2Prime = (1 + G) * a2;

    const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
    const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

    let h1Prime = radToDeg(Math.atan2(b1, a1Prime));
    if (h1Prime < 0) h1Prime += 360;

    let h2Prime = radToDeg(Math.atan2(b2, a2Prime));
    if (h2Prime < 0) h2Prime += 360;

    // 2. Calculate ΔL', ΔC', and ΔH'
    const deltaLPrime = L2 - L1;
    const deltaCPrime = C2Prime - C1Prime;

    let deltaHPrime = 0;
    if (C1Prime * C2Prime !== 0) {
      const diffH = h2Prime - h1Prime;
      if (Math.abs(diffH) <= 180) {
        deltaHPrime = diffH;
      } else if (diffH > 180) {
        deltaHPrime = diffH - 360;
      } else {
        deltaHPrime = diffH + 360;
      }
    }
    const deltaBigHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(degToRad(deltaHPrime / 2));

    // 3. Calculate CIEDE2000 Mean Values
    const avgLPrime = (L1 + L2) / 2;
    const avgCPrime = (C1Prime + C2Prime) / 2;

    let avgHPrime = 0;
    if (C1Prime * C2Prime !== 0) {
      const diffH = Math.abs(h1Prime - h2Prime);
      const sumH = h1Prime + h2Prime;
      if (diffH <= 180) {
        avgHPrime = sumH / 2;
      } else if (sumH < 360) {
        avgHPrime = (sumH + 360) / 2;
      } else {
        avgHPrime = (sumH - 360) / 2;
      }
    } else {
      avgHPrime = h1Prime + h2Prime;
    }

    // 4. Calculate Weighting Functions SL, SC, SH and RT
    const T = 1 -
      0.17 * Math.cos(degToRad(avgHPrime - 30)) +
      0.24 * Math.cos(degToRad(2 * avgHPrime)) +
      0.32 * Math.cos(degToRad(3 * avgHPrime + 6)) -
      0.20 * Math.cos(degToRad(4 * avgHPrime - 63));

    const deltaTheta = 30 * Math.exp(-Math.pow((avgHPrime - 275) / 25, 2));

    const avgCPrime7 = Math.pow(avgCPrime, 7);
    const RC = 2 * Math.sqrt(avgCPrime7 / (avgCPrime7 + 6103515625));

    const avgLDiff50Sqr = Math.pow(avgLPrime - 50, 2);
    const SL = 1 + (0.015 * avgLDiff50Sqr) / Math.sqrt(20 + avgLDiff50Sqr);
    const SC = 1 + 0.045 * avgCPrime;
    const SH = 1 + 0.015 * avgCPrime * T;

    const RT = -Math.sin(degToRad(2 * deltaTheta)) * RC;

    // 5. Total CIEDE2000 ΔE₀₀
    const termL = deltaLPrime / (kL * SL);
    const termC = deltaCPrime / (kC * SC);
    const termH = deltaBigHPrime / (kH * SH);

    const deltaE00 = Math.sqrt(
      termL * termL +
      termC * termC +
      termH * termH +
      RT * termC * termH
    );

    return Math.max(0, Number(deltaE00.toFixed(2)));
  }

  /**
   * Perceptual evaluation of CIEDE2000 score for tattoo color matching
   * @param {number} dE - CIEDE2000 score
   * @returns {Object} { category: string, ratingKey: string, description: string, badgeClass: string }
   */
  function getCiede2000Rating(dE) {
    if (dE < 1.0) {
      return {
        category: 'imperceptible',
        ratingKey: 'ciede2000.ratings.imperceptible',
        label: 'Imperceptible Match (High Fidelity)',
        badgeClass: 'badge--exact'
      };
    } else if (dE <= 2.0) {
      return {
        category: 'close',
        ratingKey: 'ciede2000.ratings.close',
        label: 'Close Match (Perceptible on Inspection)',
        badgeClass: 'badge--close'
      };
    } else if (dE <= 3.5) {
      return {
        category: 'noticeable',
        ratingKey: 'ciede2000.ratings.noticeable',
        label: 'Noticeable Variation (Usable Shading)',
        badgeClass: 'badge--usable'
      };
    } else {
      return {
        category: 'significant',
        ratingKey: 'ciede2000.ratings.significant',
        label: 'Significant Shift (Outside Core Gamut)',
        badgeClass: 'badge--shifted'
      };
    }
  }

  /**
   * Evaluates if a target Lab color is within the achievable subtractive mixing volume of on-hand inks
   * @param {Object} targetLab - { l, a, b }
   * @param {Array} availableInks - Array of ink objects
   * @param {number} bestMatchDE00 - The best match ΔE₀₀ found by the solver
   * @returns {Object} { inGamut: boolean, gamutPercent: number, statusKey: string, message: string }
   */
  function evaluateGamutBoundary(targetLab, availableInks, bestMatchDE00) {
    if (!targetLab || typeof bestMatchDE00 !== 'number') {
      return { inGamut: true, gamutPercent: 100, statusKey: 'ciede2000.gamut.unknown', message: 'Ready' };
    }

    // A match with ΔE₀₀ <= 3.0 is considered practically achievable within the subtractive pigment gamut
    const inGamut = bestMatchDE00 <= 3.0;
    const proximity = Math.max(0, Math.min(100, Math.round(100 - (bestMatchDE00 * 12))));

    return {
      inGamut: inGamut,
      gamutPercent: proximity,
      deltaE00: bestMatchDE00,
      statusKey: inGamut ? 'ciede2000.gamut.inGamut' : 'ciede2000.gamut.outOfGamut',
      message: inGamut
        ? 'Inside Achievable Studio Gamut'
        : 'Outside Current On-Hand Pigment Gamut'
    };
  }

  // Global exposure
  window.ciede2000 = ciede2000;
  window.getCiede2000Rating = getCiede2000Rating;
  window.evaluateGamutBoundary = evaluateGamutBoundary;
})();
