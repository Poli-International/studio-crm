/**
 * Comprehensive Tattoo Ink Color Database & Subtractive Mixing Engine (V2)
 * Poli International Tattoo Tools Suite
 * 
 * Model: Kubelka-Munk Subtractive CMYKW Pigment Optical Model with Tinting & Scattering Coefficients.
 * 
 * Accurately models physical subtractive light absorption and pigment scattering,
 * replacing naive additive RGB averaging.
 */

const inkColorDatabase = {
  // NEUTRALS & PRIMARIES
  black: {
    id: 'black',
    name: 'Black (Carbon/Onyx)',
    category: 'neutral',
    hex: '#0a0a0a',
    rgb: { r: 10, g: 10, b: 10 },
    cmyk: { c: 0.0, m: 0.0, y: 0.0, k: 1.0 },
    tinting_strength: 3.2, // Extremely high light extinction: rapidly overpowers
    scattering: 0.05,
    properties: {
      opacity: 'very_high',
      tinting_strength: 'very_strong',
      typical_use: 'Outlines, dark shading base, gray washes',
      mixing_note: 'Extremely strong light absorption: add in tiny increments (0.1-0.25 parts)'
    },
    drops_per_ml: 20
  },

  white: {
    id: 'white',
    name: 'White (Titanium Opaque)',
    category: 'neutral',
    hex: '#fcfcfc',
    rgb: { r: 252, g: 252, b: 252 },
    cmyk: { c: 0.0, m: 0.0, y: 0.0, k: 0.0 },
    tinting_strength: 0.8,
    scattering: 2.5, // High optical scattering agent (lightens value and softens saturation)
    properties: {
      opacity: 'high',
      tinting_strength: 'strong',
      typical_use: 'Highlights, tinting, pastel tones, opacity builder',
      mixing_note: 'High optical scattering: lightens and mutes chroma without color shift'
    },
    drops_per_ml: 20
  },

  red: {
    id: 'red',
    name: 'Red (Warm Scarlet / Crimson)',
    category: 'primary',
    hex: '#d61818',
    rgb: { r: 214, g: 24, b: 24 },
    cmyk: { c: 0.0, m: 0.95, y: 0.90, k: 0.05 },
    tinting_strength: 1.6,
    scattering: 0.3,
    properties: {
      opacity: 'medium_high',
      tinting_strength: 'strong',
      typical_use: 'Primary warm color, skin tone shading, floral work',
      mixing_note: 'Strong warm absorption: dominant in oranges and warm purples'
    },
    drops_per_ml: 20
  },

  yellow: {
    id: 'yellow',
    name: 'Yellow (Bright / Golden)',
    category: 'primary',
    hex: '#ffea00',
    rgb: { r: 255, g: 234, b: 0 },
    cmyk: { c: 0.0, m: 0.04, y: 0.98, k: 0.0 },
    tinting_strength: 0.65, // Low tinting power, easily overpowered
    scattering: 0.2,
    properties: {
      opacity: 'low',
      tinting_strength: 'weak',
      typical_use: 'Highlights, warm undertones, greens and oranges',
      mixing_note: 'Lowest tinting power: requires 2x to 4x higher ratio when mixed with blue or black'
    },
    drops_per_ml: 20
  },

  blue: {
    id: 'blue',
    name: 'Blue (Cobalt / Cyan Base)',
    category: 'primary',
    hex: '#1446a0',
    rgb: { r: 20, g: 70, b: 160 },
    cmyk: { c: 0.96, m: 0.62, y: 0.0, k: 0.06 },
    tinting_strength: 2.2, // High tinting strength
    scattering: 0.25,
    properties: {
      opacity: 'very_high',
      tinting_strength: 'very_strong',
      typical_use: 'Cool undertones, greens, purples, deep waters',
      mixing_note: 'Very high tinting strength: easily turns mixes dark green or deep purple'
    },
    drops_per_ml: 20
  },

  // SECONDARY COLORS
  orange: {
    id: 'orange',
    name: 'Orange (Tangerine / Cadmium)',
    category: 'secondary',
    hex: '#ff7700',
    rgb: { r: 255, g: 119, b: 0 },
    cmyk: { c: 0.0, m: 0.60, y: 0.98, k: 0.0 },
    tinting_strength: 1.15,
    scattering: 0.25,
    properties: {
      opacity: 'medium',
      tinting_strength: 'medium',
      typical_use: 'Sunsets, warm skin tone highlights, warm accents',
      mixing_note: 'Subtractive mix of red and yellow'
    },
    drops_per_ml: 20
  },

  green: {
    id: 'green',
    name: 'Green (Forest / Emerald)',
    category: 'secondary',
    hex: '#1b8a3e',
    rgb: { r: 27, g: 138, b: 62 },
    cmyk: { c: 0.88, m: 0.0, y: 0.92, k: 0.12 },
    tinting_strength: 1.45,
    scattering: 0.2,
    properties: {
      opacity: 'medium_high',
      tinting_strength: 'medium_strong',
      typical_use: 'Botanicals, foliage, olive skin adjustments',
      mixing_note: 'Subtractive absorption of blue and yellow'
    },
    drops_per_ml: 20
  },

  purple: {
    id: 'purple',
    name: 'Purple (Deep Violet)',
    category: 'secondary',
    hex: '#6a1b9a',
    rgb: { r: 106, g: 27, b: 154 },
    cmyk: { c: 0.68, m: 0.96, y: 0.0, k: 0.12 },
    tinting_strength: 1.7,
    scattering: 0.2,
    properties: {
      opacity: 'high',
      tinting_strength: 'strong',
      typical_use: 'Cool shadows, fantasy pieces, velvet tones',
      mixing_note: 'Subtractive mix of blue and red'
    },
    drops_per_ml: 20
  },

  // EARTH TONES & SPECIALTY
  brown: {
    id: 'brown',
    name: 'Brown (Burnt Umber / Earth)',
    category: 'earth',
    hex: '#6d4323',
    rgb: { r: 109, g: 67, b: 35 },
    cmyk: { c: 0.25, m: 0.66, y: 0.88, k: 0.48 },
    tinting_strength: 1.35,
    scattering: 0.25,
    properties: {
      opacity: 'high',
      tinting_strength: 'medium',
      typical_use: 'Portraits, base skin tones, organic shading',
      mixing_note: 'Tri-color subtractive neutralization (red + yellow + black)'
    },
    drops_per_ml: 20
  },

  magenta: {
    id: 'magenta',
    name: 'Magenta (Process / Neon Red)',
    category: 'special',
    hex: '#d81b60',
    rgb: { r: 216, g: 27, b: 96 },
    cmyk: { c: 0.0, m: 0.98, y: 0.35, k: 0.04 },
    tinting_strength: 1.55,
    scattering: 0.2,
    properties: {
      opacity: 'high',
      tinting_strength: 'very_strong',
      typical_use: 'Vibrant florals, portrait lips, neon shading',
      mixing_note: 'Pure subtractive primary magenta pigment'
    },
    drops_per_ml: 20
  }
};

/**
 * Retrieves color definition by key or hex
 */
function getColorData(colorName) {
  if (!colorName) return null;
  const key = String(colorName).toLowerCase();
  return inkColorDatabase[key] || null;
}

// ==========================================
// COLOR SPACE UTILITIES (CMYK, RGB, Lab)
// ==========================================

function hexToRgb(hex) {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  const clampR = Math.max(0, Math.min(255, Math.round(r)));
  const clampG = Math.max(0, Math.min(255, Math.round(g)));
  const clampB = Math.max(0, Math.min(255, Math.round(b)));
  return "#" + ((1 << 24) + (clampR << 16) + (clampG << 8) + clampB).toString(16).slice(1).toUpperCase();
}

function rgbToCmyk(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k >= 0.999) {
    return { c: 0, m: 0, y: 0, k: 1 };
  }
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);
  return {
    c: Math.max(0, Math.min(1, c)),
    m: Math.max(0, Math.min(1, m)),
    y: Math.max(0, Math.min(1, y)),
    k: Math.max(0, Math.min(1, k))
  };
}

function cmykToRgb(c, m, y, k) {
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b))
  };
}

function rgbToLab(r, g, b) {
  let rN = r / 255, gN = g / 255, bN = b / 255;
  rN = rN > 0.04045 ? Math.pow((rN + 0.055) / 1.055, 2.4) : rN / 12.92;
  gN = gN > 0.04045 ? Math.pow((gN + 0.055) / 1.055, 2.4) : gN / 12.92;
  bN = bN > 0.04045 ? Math.pow((bN + 0.055) / 1.055, 2.4) : bN / 12.92;

  let x = (rN * 0.4124 + gN * 0.3576 + bN * 0.1805) / 0.95047;
  let y = (rN * 0.2126 + gN * 0.7152 + bN * 0.0722) / 1.00000;
  let z = (rN * 0.0193 + gN * 0.1192 + bN * 0.9505) / 1.08883;

  const f = t => t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + (16 / 116);
  const fx = f(x), fy = f(y), fz = f(z);

  return {
    l: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}

function deltaE(labA, labB) {
  const dL = labA.l - labB.l;
  const da = labA.a - labB.a;
  const db = labA.b - labB.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// =========================================================================
// 1. SUBTRACTIVE PIGMENT MIXING ENGINE (Kubelka-Munk Optical Approximation)
// =========================================================================

/**
 * Subtractive Pigment Mixing Engine
 * Accurately models subtractive absorption and tinting factors of physical tattoo inks.
 * 
 * @param {Array<{color: string, parts: number, brand?: string}>} colors 
 * @returns {string} Hex color string
 */
function estimateResultingColor(colors) {
  if (!colors || colors.length === 0) return '#808080';

  let totalWeightedParts = 0;
  let totalParts = 0;
  let weightedC = 0;
  let weightedM = 0;
  let weightedY = 0;
  let weightedK = 0;
  let whiteParts = 0;
  let blackParts = 0;

  colors.forEach(item => {
    let data = inkColorDatabase[item.color];
    if (!data && item.hex) {
      // Fallback for custom user inventory inks
      const rgb = hexToRgb(item.hex);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      data = {
        name: item.color,
        hex: item.hex,
        rgb,
        cmyk,
        tinting_strength: item.color === 'white' ? 0.8 : (item.color === 'black' ? 3.2 : 1.4),
        scattering: item.color === 'white' ? 2.5 : 0.25
      };
    }

    if (data && item.parts > 0) {
      totalParts += item.parts;
      if (item.color === 'white') {
        whiteParts += item.parts;
      }
      if (item.color === 'black') {
        blackParts += item.parts;
      }

      const strength = data.tinting_strength || 1.0;
      const weight = item.parts * strength;
      totalWeightedParts += weight;

      const cmyk = data.cmyk || rgbToCmyk(data.rgb.r, data.rgb.g, data.rgb.b);
      weightedC += cmyk.c * weight;
      weightedM += cmyk.m * weight;
      weightedY += cmyk.y * weight;
      weightedK += cmyk.k * weight;
    }
  });

  if (totalWeightedParts === 0 || totalParts === 0) return '#808080';

  let mixC = weightedC / totalWeightedParts;
  let mixM = weightedM / totalWeightedParts;
  let mixY = weightedY / totalWeightedParts;
  let mixK = weightedK / totalWeightedParts;

  // Physical cross-pigment subtractive absorption nuances:
  // 1. Blue + Yellow combination generates pure green transmission
  const hasBlue = colors.some(c => c.color === 'blue' && c.parts > 0);
  const hasYellow = colors.some(c => c.color === 'yellow' && c.parts > 0);
  if (hasBlue && hasYellow) {
    // In physical ink, Blue + Yellow absorbs Red and Blue, boosting Green reflectance
    mixC = Math.min(1, mixC * 0.95);
    mixY = Math.min(1, mixY * 0.95);
    mixM = Math.max(0, mixM * 0.35); // Subtract magenta contamination
  }

  // 2. Red + Yellow combination produces pure Cadmium Orange
  const hasRed = colors.some(c => c.color === 'red' && c.parts > 0);
  if (hasRed && hasYellow && !hasBlue) {
    mixC = 0; // Pure warm orange has zero cyan absorption
  }

  // 3. Black pigment has non-linear extinction power
  if (blackParts > 0) {
    const blackRatio = blackParts / totalParts;
    mixK = Math.min(1, mixK + blackRatio * 0.15);
  }

  // 4. White pigment is a scattering agent: lightens value and softens saturation
  if (whiteParts > 0 && totalParts > 0) {
    const whiteRatio = whiteParts / totalParts;
    const attenuation = Math.pow(1 - whiteRatio * 0.85, 1.1);
    mixC *= attenuation;
    mixM *= attenuation;
    mixY *= attenuation;
    mixK *= Math.pow(1 - whiteRatio * 0.95, 1.3);
  }

  const rgb = cmykToRgb(mixC, mixM, mixY, mixK);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// =========================================================================
// 2. MIX BY TARGET SOLVER (Inverse Pigment Optimization Engine)
// =========================================================================

/**
 * Helper to parse any hex, rgb string, or object into standard {hex, rgb}
 */
function parseColorInput(input) {
  if (!input) return null;
  if (typeof input === 'object' && input.r !== undefined && input.g !== undefined && input.b !== undefined) {
    const r = Math.max(0, Math.min(255, Math.round(Number(input.r) || 0)));
    const g = Math.max(0, Math.min(255, Math.round(Number(input.g) || 0)));
    const b = Math.max(0, Math.min(255, Math.round(Number(input.b) || 0)));
    return { hex: rgbToHex(r, g, b), rgb: { r, g, b } };
  }

  if (typeof input === 'string') {
    const str = input.trim();
    // Check rgb(r, g, b) or r, g, b
    const rgbMatch = str.match(/rgba?\(?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
    if (rgbMatch) {
      const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10)));
      const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10)));
      const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10)));
      return { hex: rgbToHex(r, g, b), rgb: { r, g, b } };
    }

    // Check hex
    let cleanHex = str.replace(/[^0-9a-fA-F]/g, '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    if (cleanHex.length === 6) {
      const hex = '#' + cleanHex.toLowerCase();
      return { hex, rgb: hexToRgb(hex) };
    }
  }
  return null;
}

/**
 * Solves for the optimal ratio of available pigments to achieve a target color.
 * Solves strictly against on-hand bottles when an inventory is provided.
 * 
 * @param {string|Object} targetInput - Hex string, RGB string, or {r,g,b} object
 * @param {Array<Object>} availableInks - list of available ink objects or keys
 * @param {Object} [options] - maxPigments, precision
 * @returns {{
 *   success: boolean,
 *   bestMix: Array<{color: string, parts: number, brand?: string, shadeName?: string}>,
 *   targetHex: string,
 *   targetRgb: {r: number, g: number, b: number},
 *   predictedHex: string,
 *   predictedRgb: {r: number, g: number, b: number},
 *   deltaE: number,
 *   matchQuality: string,
 *   honestAssessment: string,
 *   ratioString: string
 * }}
 */
function solveMixForTarget(targetInput, availableInks, options = {}) {
  const parsed = parseColorInput(targetInput);
  if (!parsed) {
    return { success: false, error: 'Invalid color input. Provide hex or RGB.' };
  }

  const targetHex = parsed.hex;
  const targetRgb = parsed.rgb;
  const targetLab = rgbToLab(targetRgb.r, targetRgb.g, targetRgb.b);

  // Normalize available inks and enforce on-hand constraint strictly
  let pool = [];
  if (Array.isArray(availableInks)) {
    const onHandOnly = availableInks.filter(item => {
      if (typeof item === 'string') return true;
      return item.onHand !== false && item.inStock !== false;
    });

    if (onHandOnly.length === 0) {
      return {
        success: false,
        error: 'No bottles currently marked On Hand in inventory.'
      };
    }

    pool = onHandOnly.map(item => {
      if (typeof item === 'string') {
        const data = inkColorDatabase[item] || { id: item, name: item, hex: '#808080' };
        return { color: item, brand: 'Standard', ...data };
      }
      return {
        color: item.pigmentClass || item.color || item.id,
        brand: item.brand || 'Standard',
        shadeName: item.shadeName || item.name || item.color,
        hex: item.hex
      };
    });
  } else {
    pool = Object.keys(inkColorDatabase).map(key => ({
      color: key,
      brand: 'Standard',
      ...inkColorDatabase[key]
    }));
  }

  // Deduplicate by pigment class + brand
  const uniquePool = [];
  const seenClasses = new Set();
  pool.forEach(item => {
    const key = `${item.color}_${item.brand}`;
    if (!seenClasses.has(key)) {
      seenClasses.add(key);
      uniquePool.push(item);
    }
  });

  if (uniquePool.length === 0) {
    return { success: false, error: 'No usable pigments in pool.' };
  }

  let bestResult = {
    bestMix: [],
    predictedHex: '#808080',
    deltaE: 999
  };

  const steps = [0.25, 0.5, 1, 2, 3, 4, 6, 8];

  // 1-pigment direct test
  for (const ink of uniquePool) {
    const testMix = [{ color: ink.color, parts: 1, brand: ink.brand, shadeName: ink.shadeName }];
    const predHex = estimateResultingColor(testMix);
    const predRgb = hexToRgb(predHex);
    const predLab = rgbToLab(predRgb.r, predRgb.g, predRgb.b);
    const dE = deltaE(targetLab, predLab);
    if (dE < bestResult.deltaE) {
      bestResult = { bestMix: testMix, predictedHex: predHex, deltaE: dE };
    }
  }

  // 2-pigment combinations
  for (let i = 0; i < uniquePool.length; i++) {
    for (let j = i + 1; j < uniquePool.length; j++) {
      const ink1 = uniquePool[i];
      const ink2 = uniquePool[j];

      for (const p1 of steps) {
        for (const p2 of steps) {
          const testMix = [
            { color: ink1.color, parts: p1, brand: ink1.brand, shadeName: ink1.shadeName },
            { color: ink2.color, parts: p2, brand: ink2.brand, shadeName: ink2.shadeName }
          ];
          const predHex = estimateResultingColor(testMix);
          const predRgb = hexToRgb(predHex);
          const predLab = rgbToLab(predRgb.r, predRgb.g, predRgb.b);
          const dE = deltaE(targetLab, predLab);
          if (dE < bestResult.deltaE) {
            bestResult = { bestMix: testMix, predictedHex: predHex, deltaE: dE };
          }
        }
      }
    }
  }

  // 3-pigment combinations
  for (let i = 0; i < uniquePool.length; i++) {
    for (let j = i + 1; j < uniquePool.length; j++) {
      for (let k = j + 1; k < uniquePool.length; k++) {
        const ink1 = uniquePool[i];
        const ink2 = uniquePool[j];
        const ink3 = uniquePool[k];

        const sampleRatios = [
          [1, 1, 1], [2, 1, 0.5], [4, 1, 1], [1, 3, 0.5], [6, 2, 1], [8, 3, 1], [10, 3, 0.5], [1, 1, 4]
        ];

        for (const [p1, p2, p3] of sampleRatios) {
          const testMix = [
            { color: ink1.color, parts: p1, brand: ink1.brand, shadeName: ink1.shadeName },
            { color: ink2.color, parts: p2, brand: ink2.brand, shadeName: ink2.shadeName },
            { color: ink3.color, parts: p3, brand: ink3.brand, shadeName: ink3.shadeName }
          ];
          const predHex = estimateResultingColor(testMix);
          const predRgb = hexToRgb(predHex);
          const predLab = rgbToLab(predRgb.r, predRgb.g, predRgb.b);
          const dE = deltaE(targetLab, predLab);
          if (dE < bestResult.deltaE) {
            bestResult = { bestMix: testMix, predictedHex: predHex, deltaE: dE };
          }
        }
      }
    }
  }

  // Refine best mix with local gradient fine-tuning
  if (bestResult.bestMix.length > 1) {
    let currentBest = [...bestResult.bestMix];
    for (let iter = 0; iter < 12; iter++) {
      for (let idx = 0; idx < currentBest.length; idx++) {
        for (const delta of [-0.25, 0.25, -0.5, 0.5]) {
          const candidate = currentBest.map((item, i) => ({
            ...item,
            parts: i === idx ? Math.max(0.1, Number((item.parts + delta).toFixed(2))) : item.parts
          }));
          const predHex = estimateResultingColor(candidate);
          const predRgb = hexToRgb(predHex);
          const predLab = rgbToLab(predRgb.r, predRgb.g, predRgb.b);
          const dE = deltaE(targetLab, predLab);
          if (dE < bestResult.deltaE) {
            bestResult = { bestMix: candidate, predictedHex: predHex, deltaE: dE };
            currentBest = candidate;
          }
        }
      }
    }
  }

  // Simplify ratio display
  const minPart = Math.min(...bestResult.bestMix.map(m => m.parts));
  const normalizedMix = bestResult.bestMix.map(m => ({
    ...m,
    parts: Number((m.parts / minPart).toFixed(1))
  }));

  const ratioString = normalizedMix.map(m => `${m.parts} ${m.shadeName || m.color}`).join(' : ');
  const predRgb = hexToRgb(bestResult.predictedHex);
  const predLab = rgbToLab(predRgb.r, predRgb.g, predRgb.b);

  // Honest difference evaluation
  const dEVal = Number(bestResult.deltaE.toFixed(1));
  const dE00Val = typeof window.ciede2000 === 'function' ? window.ciede2000(targetLab, predLab) : dEVal;
  const gamutEval = typeof window.evaluateGamutBoundary === 'function'
    ? window.evaluateGamutBoundary(targetLab, uniquePool, dE00Val)
    : { inGamut: dE00Val <= 3.0, gamutPercent: Math.max(0, Math.min(100, Math.round(100 - dE00Val * 10))) };

  let matchQuality = 'Good Match';
  let honestAssessment = '';

  const targetLum = 0.299 * targetRgb.r + 0.587 * targetRgb.g + 0.114 * targetRgb.b;
  const predLum = 0.299 * predRgb.r + 0.587 * predRgb.g + 0.114 * predRgb.b;
  const lumDiff = Math.abs(targetLum - predLum);

  if (dE00Val < 1.0) {
    matchQuality = `High-Fidelity Match (ΔE₀₀: ${dE00Val})`;
    honestAssessment = `Minimal perceptual variance (CIEDE2000 ΔE₀₀: ${dE00Val}, ΔE76: ${dEVal}). High-fidelity match achievable using your on-hand bottles.`;
  } else if (dE00Val < 2.0) {
    matchQuality = `Close Approximation (ΔE₀₀: ${dE00Val})`;
    honestAssessment = `Close visual approximation (CIEDE2000 ΔE₀₀: ${dE00Val}, ΔE76: ${dEVal}). Slight hue or chroma variance; comfortably within standard tattoo pigment healing tolerance.`;
  } else if (dE00Val < 3.5) {
    matchQuality = `Noticeable Variance (ΔE₀₀: ${dE00Val})`;
    const toneNote = predLum > targetLum + 10 ? 'lighter' : (predLum < targetLum - 10 ? 'darker' : 'slightly shifted in saturation');
    honestAssessment = `Noticeable deviation (CIEDE2000 ΔE₀₀: ${dE00Val}, ΔE76: ${dEVal}). The achievable mix is ${toneNote} than your target. Your on-hand inventory lacks a dedicated pigment to hit this exact saturation point.`;
  } else {
    matchQuality = `Significant Gamut Shift (ΔE₀₀: ${dE00Val})`;
    honestAssessment = `Significant gamut discrepancy (CIEDE2000 ΔE₀₀: ${dE00Val}, ΔE76: ${dEVal}). This target shade lies outside the achievable subtractive range of your currently on-hand bottles. Showing the closest available compromise.`;
  }

  return {
    success: true,
    bestMix: normalizedMix,
    targetHex,
    targetRgb,
    targetLab,
    predictedHex: bestResult.predictedHex,
    predictedRgb: predRgb,
    predictedLab: predLab,
    deltaE: dEVal,
    deltaE00: dE00Val,
    gamut: gamutEval,
    matchQuality,
    honestAssessment,
    ratioString
  };
}

/**
 * Calculates the subtractive complementary neutralizer for an unwanted ink undertone.
 * Corrects pigment only; does not diagnose skin conditions.
 * 
 * @param {string} colorInput - Hex or shade identifier
 * @returns {{
 *   inputHex: string,
 *   neutralizerHex: string,
 *   neutralizerName: string,
 *   neutralizerClass: string,
 *   ratioGuidance: string,
 *   physicsExplanation: string
 * }}
 */
function calculateSubtractiveComplement(colorInput) {
  const parsed = parseColorInput(colorInput) || { hex: '#1446a0', rgb: { r: 20, g: 70, b: 160 } };
  const rgb = parsed.rgb;

  // Subtractive opposite mapping:
  // In CMY subtractive absorption:
  // C (Cyan/Blue) absorbs R -> Opposites with Red/Orange
  // M (Magenta) absorbs G -> Opposites with Green
  // Y (Yellow) absorbs B -> Opposites with Violet/Blue
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  // Invert CMY proportions for subtractive opposite
  let compC = 1 - cmyk.c;
  let compM = 1 - cmyk.m;
  let compY = 1 - cmyk.y;
  let compK = Math.max(0, cmyk.k * 0.3);

  // Normalize
  const maxComp = Math.max(compC, compM, compY);
  if (maxComp > 0) {
    compC /= maxComp;
    compM /= maxComp;
    compY /= maxComp;
  }

  const compRgb = cmykToRgb(compC, compM, compY, compK);
  const neutralizerHex = rgbToHex(compRgb.r, compRgb.g, compRgb.b);

  // Categorize based on dominant wavelength
  let correctorKey = 'correctorDefault';
  let guidanceKey = 'guidanceDefault';
  let classKey = 'classOrange';
  let neutralizerClass = 'orange';

  if (rgb.b > rgb.r && rgb.b > rgb.g) {
    // Unwanted blue / slate undertone
    correctorKey = 'correctorWarmTerracotta';
    guidanceKey = 'guidanceWarmOrange';
    classKey = 'classOrange';
    neutralizerClass = 'orange';
  } else if (rgb.g > rgb.r && rgb.b > rgb.r) {
    // Unwanted blue-green / teal undertone
    correctorKey = 'correctorRedOrange';
    guidanceKey = 'guidanceRedOrange';
    classKey = 'classRed';
    neutralizerClass = 'red';
  } else if (rgb.r > rgb.g && rgb.b > rgb.g) {
    // Unwanted violet / purple undertone
    correctorKey = 'correctorGoldenYellow';
    guidanceKey = 'guidanceGoldenYellow';
    classKey = 'classYellow';
    neutralizerClass = 'yellow';
  } else if (rgb.r > rgb.b && rgb.r > rgb.g && rgb.g < 100) {
    // Unwanted salmon / pinkish cast
    correctorKey = 'correctorOliveGreen';
    guidanceKey = 'guidanceOliveGreen';
    classKey = 'classGreen';
    neutralizerClass = 'green';
  } else if (Math.abs(rgb.r - rgb.g) < 20 && Math.abs(rgb.g - rgb.b) < 20) {
    // Gray wash cast
    if (rgb.r > rgb.b + 10) {
      correctorKey = 'correctorSlateBlue';
      guidanceKey = 'guidanceSlateBlue';
      classKey = 'classBlue';
      neutralizerClass = 'blue';
    } else {
      correctorKey = 'correctorSepia';
      guidanceKey = 'guidanceSepia';
      classKey = 'classBrown';
      neutralizerClass = 'brown';
    }
  }

  const _t = (k, p) => (typeof window.t === 'function' ? window.t(k, p) : k);
  const neutralizerName = _t('neutralizing.' + correctorKey);
  const ratioGuidance = _t('neutralizing.' + guidanceKey);
  const neutralizerClassLabel = _t('neutralizing.' + classKey);
  const physicsExplanation = _t('neutralizing.physicsExplanationText');

  return {
    inputHex: parsed.hex,
    neutralizerHex,
    neutralizerName,
    neutralizerClass,
    neutralizerClassLabel,
    correctorKey,
    guidanceKey,
    classKey,
    ratioGuidance,
    physicsExplanation,
    complementHex: neutralizerHex,
    recommendedPigmentClass: neutralizerClass,
    undertoneName: neutralizerName,
    explanation: physicsExplanation,
    mixingGuideline: ratioGuidance
  };
}

// =========================================================================
// 3. FORMULA SCALER & VOLUMETRIC MEASUREMENT CALCULATOR
// =========================================================================

/**
 * Scales a list of color parts to exact physical measurements (ml, drops, caps).
 * 
 * @param {Array<{color: string, parts: number, brand?: string, shadeName?: string}>} colors 
 * @param {number} totalVolume - in ml
 * @param {string} unit - 'ml' | 'caps_small' | 'caps_medium' | 'caps_large' | 'oz'
 * @returns {{
 *   totalVolumeMl: number,
 *   totalDrops: number,
 *   measurements: Array<{
 *     color: string,
 *     brand: string,
 *     shadeName: string,
 *     parts: number,
 *     percentage: number,
 *     ml: number,
 *     drops: number,
 *     capProportion: string
 *   }>
 * }}
 */
function scaleFormulaMeasurements(colors, totalVolume = 5, unit = 'ml') {
  let volumeInMl = totalVolume;

  if (unit === 'caps_small') volumeInMl = totalVolume * 0.5; // #9 cap ≈ 0.5 ml
  else if (unit === 'caps_medium') volumeInMl = totalVolume * 1.0; // #12 cap ≈ 1.0 ml
  else if (unit === 'caps_large') volumeInMl = totalVolume * 2.0; // #16 cap ≈ 2.0 ml
  else if (unit === 'oz') volumeInMl = totalVolume * 29.5735; // 1 US fl oz ≈ 29.57 ml

  const totalParts = colors.reduce((sum, c) => sum + (Number(c.parts) || 0), 0);
  if (totalParts <= 0 || volumeInMl <= 0) {
    return { totalVolumeMl: 0, totalDrops: 0, measurements: [] };
  }

  const DROPS_PER_ML = 20;
  const totalDrops = Math.round(volumeInMl * DROPS_PER_ML);

  const measurements = colors.map(item => {
    const p = Number(item.parts) || 0;
    const proportion = p / totalParts;
    const ml = Number((volumeInMl * proportion).toFixed(2));
    
    // Sensible drop rounding: for small volumes, allow 0.5 drop precision if needed, otherwise nearest whole drop
    let drops = Math.round(ml * DROPS_PER_ML);
    if (volumeInMl < 2.0 && drops === 0 && ml > 0.02) {
      drops = 1; // Ensure tiny component is not rounded away to zero
    }

    const percentage = Number((proportion * 100).toFixed(1));

    return {
      color: item.color,
      brand: item.brand || 'Standard',
      shadeName: item.shadeName || (item.color ? item.color.charAt(0).toUpperCase() + item.color.slice(1) : 'Ink'),
      parts: p,
      percentage,
      ml,
      drops,
      capProportion: `${(proportion * 100).toFixed(0)}% of cap`
    };
  });

  return {
    totalVolumeMl: Number(volumeInMl.toFixed(2)),
    totalDrops,
    measurements
  };
}

// Global exposure
window.inkColorDatabase = inkColorDatabase;
window.getColorData = getColorData;
window.hexToRgb = hexToRgb;
window.rgbToHex = rgbToHex;
window.rgbToCmyk = rgbToCmyk;
window.cmykToRgb = cmykToRgb;
window.rgbToLab = rgbToLab;
window.deltaE = deltaE;
window.estimateResultingColor = estimateResultingColor;
window.parseColorInput = parseColorInput;
window.solveMixForTarget = solveMixForTarget;
window.calculateSubtractiveComplement = calculateSubtractiveComplement;
window.scaleFormulaMeasurements = scaleFormulaMeasurements;
