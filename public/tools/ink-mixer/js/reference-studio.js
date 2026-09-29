/**
 * Reference Studio: Eyedropper, Palette Extractor, CIE L* Value Contrast & CVD Simulation
 * Poli International Tattoo Tools Suite
 * 
 * Features:
 * 1. Image Eyedropper & Palette Extractor (HTML5 Canvas, local FileReader)
 * 2. CIE L* Perceptual Luminance & Value Contrast Checker (ΔL* calculation & healing warning)
 * 3. Color Vision Deficiency (CVD) Simulation (Protanopia, Deuteranopia, Tritanopia, Achromatopsia)
 */

(function () {
  'use strict';

  // State
  let loadedImage = null;
  let canvas = null;
  let ctx = null;
  let loupeCanvas = null;
  let loupeCtx = null;
  let currentSampledColor = { hex: '#000000', rgb: { r: 0, g: 0, b: 0 }, lab: { l: 0, a: 0, b: 0 } };
  let extractedPalette = [];
  let activeCVDMode = 'normal';
  let isGreyscaleLuminance = false;

  // Linear sRGB helper
  function sRgbToLinear(c) {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function linearToSRgb(c) {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(v * 255)));
  }

  // CIE L* Calculation (D65 illuminant standard)
  function rgbToLStar(r, g, b) {
    const rLin = sRgbToLinear(r);
    const gLin = sRgbToLinear(g);
    const bLin = sRgbToLinear(b);

    // Y tristimulus value (D65 standard)
    const y = 0.2126729 * rLin + 0.7151522 * gLin + 0.0721750 * bLin;
    const yn = 1.0;
    const yRatio = y / yn;

    const fY = yRatio > 0.008856 ? Math.cbrt(yRatio) : (7.787 * yRatio) + (16 / 116);
    const lStar = (116 * fY) - 16;
    return Math.max(0, Math.min(100, Number(lStar.toFixed(1))));
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16) || 0,
      g: parseInt(clean.substring(2, 4), 16) || 0,
      b: parseInt(clean.substring(4, 6), 16) || 0
    };
  }

  // Color Vision Deficiency Simulation (Standard Brettel/Viénot LMS Matrices)
  function simulateCVD(r, g, b, mode) {
    if (mode === 'normal' || !mode) return { r, g, b };

    if (mode === 'achromatopsia') {
      const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      return { r: lum, g: lum, b: lum };
    }

    const rL = sRgbToLinear(r);
    const gL = sRgbToLinear(g);
    const bL = sRgbToLinear(b);

    // sRGB to LMS
    const L = 0.31399022 * rL + 0.63951294 * gL + 0.04649755 * bL;
    const M = 0.15537241 * rL + 0.75789446 * gL + 0.08670142 * bL;
    const S = 0.01775239 * rL + 0.10944209 * gL + 0.87256922 * bL;

    let simL = L, simM = M, simS = S;

    if (mode === 'protanopia') {
      // Missing L-cone: anchor around 575nm & 475nm
      simL = 1.05118294 * M - 0.05116099 * S;
    } else if (mode === 'deuteranopia') {
      // Missing M-cone
      simM = 0.9513092 * L + 0.04866992 * S;
    } else if (mode === 'tritanopia') {
      // Missing S-cone
      simS = -0.86744736 * L + 1.86727089 * M;
    }

    // LMS back to linear sRGB
    const simRL = 5.47221206 * simL - 4.6419601 * simM + 0.16963708 * simS;
    const simGL = -1.1252419 * simL + 2.29317094 * simM - 0.1678952 * simS;
    const simBL = 0.02980165 * simL - 0.19318073 * simM + 1.16364789 * simS;

    return {
      r: linearToSRgb(simRL),
      g: linearToSRgb(simGL),
      b: linearToSRgb(simBL)
    };
  }

  // Fast Median-Cut / Color Quantizer for Palette Extraction
  function extractDominantColors(imageElement, maxColors = 6) {
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    const w = 150;
    const h = Math.max(1, Math.round((imageElement.height / imageElement.width) * w));
    offCanvas.width = w;
    offCanvas.height = h;

    offCtx.drawImage(imageElement, 0, 0, w, h);
    const imgData = offCtx.getImageData(0, 0, w, h).data;

    // Collect sampled pixels (step by 4 for speed)
    const samples = [];
    for (let i = 0; i < imgData.length; i += 16) {
      const a = imgData[i + 3];
      if (a < 128) continue; // Skip transparent
      samples.push({
        r: imgData[i],
        g: imgData[i + 1],
        b: imgData[i + 2]
      });
    }

    if (samples.length === 0) return [];

    // Simple k-means clustering
    let centroids = [];
    // Initialize centroids evenly across samples
    const step = Math.floor(samples.length / maxColors);
    for (let i = 0; i < maxColors; i++) {
      centroids.push(Object.assign({}, samples[Math.min(samples.length - 1, i * step)]));
    }

    // 3 Iterations of k-means
    for (let iter = 0; iter < 3; iter++) {
      const clusters = Array.from({ length: maxColors }, () => []);
      for (const s of samples) {
        let minDist = Infinity;
        let bestIdx = 0;
        for (let c = 0; c < centroids.length; c++) {
          const dr = s.r - centroids[c].r;
          const dg = s.g - centroids[c].g;
          const db = s.b - centroids[c].b;
          const dist = dr * dr + dg * dg + db * db;
          if (dist < minDist) {
            minDist = dist;
            bestIdx = c;
          }
        }
        clusters[bestIdx].push(s);
      }

      for (let c = 0; c < maxColors; c++) {
        const cluster = clusters[c];
        if (cluster.length > 0) {
          let sumR = 0, sumG = 0, sumB = 0;
          for (const p of cluster) {
            sumR += p.r;
            sumG += p.g;
            sumB += p.b;
          }
          centroids[c] = {
            r: Math.round(sumR / cluster.length),
            g: Math.round(sumG / cluster.length),
            b: Math.round(sumB / cluster.length)
          };
        }
      }
    }

    // Deduplicate and enrich with L* values
    const seenHexes = new Set();
    const result = [];
    for (const c of centroids) {
      const hex = rgbToHex(c.r, c.g, c.b);
      if (!seenHexes.has(hex)) {
        seenHexes.add(hex);
        const lStar = rgbToLStar(c.r, c.g, c.b);
        result.push({
          hex: hex,
          rgb: c,
          lStar: lStar
        });
      }
    }

    // Sort by L* descending (light to dark)
    result.sort((a, b) => b.lStar - a.lStar);
    return result;
  }

  // Render Image onto Main Canvas with Active CVD or L* Mode
  function redrawCanvas() {
    if (!loadedImage || !canvas || !ctx) return;

    const maxDisplayW = Math.min(800, canvas.parentElement ? canvas.parentElement.clientWidth - 32 : 800);
    const scale = Math.min(1, maxDisplayW / loadedImage.width);
    const w = Math.round(loadedImage.width * scale);
    const h = Math.round(loadedImage.height * scale);

    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(loadedImage, 0, 0, w, h);

    if (activeCVDMode !== 'normal' || isGreyscaleLuminance) {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (isGreyscaleLuminance) {
          const lStar = rgbToLStar(r, g, b);
          const greyVal = Math.round((lStar / 100) * 255);
          r = greyVal;
          g = greyVal;
          b = greyVal;
        }

        if (activeCVDMode !== 'normal') {
          const simulated = simulateCVD(r, g, b, activeCVDMode);
          r = simulated.r;
          g = simulated.g;
          b = simulated.b;
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      ctx.putImageData(imgData, 0, 0);
    }
  }

  // Update Loupe Magnifier on Hover
  function updateLoupe(e) {
    if (!canvas || !loadedImage || !loupeCanvas || !loupeCtx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const hex = rgbToHex(r, g, b);
    const lStar = rgbToLStar(r, g, b);

    currentSampledColor = {
      hex: hex,
      rgb: { r, g, b },
      lStar: lStar
    };

    // Render Loupe Magnifier (7x7 pixels enlarged)
    const zoomSize = 9;
    const half = Math.floor(zoomSize / 2);
    const startX = Math.max(0, Math.min(canvas.width - zoomSize, x - half));
    const startY = Math.max(0, Math.min(canvas.height - zoomSize, y - half));

    loupeCanvas.width = 120;
    loupeCanvas.height = 120;
    loupeCtx.imageSmoothingEnabled = false;
    loupeCtx.drawImage(canvas, startX, startY, zoomSize, zoomSize, 0, 0, 120, 120);

    // Draw Crosshair on Loupe
    loupeCtx.strokeStyle = 'var(--text-primary)';
    loupeCtx.lineWidth = 1;
    loupeCtx.strokeRect(55, 55, 10, 10);

    // Update readout
    const readoutHex = document.getElementById('refLoupeHex');
    const readoutLStar = document.getElementById('refLoupeLStar');
    const readoutRgb = document.getElementById('refLoupeRgb');
    const swatch = document.getElementById('refLoupeSwatch');

    if (readoutHex) readoutHex.textContent = hex.toUpperCase();
    if (readoutLStar) readoutLStar.textContent = `L*: ${lStar}`;
    if (readoutRgb) readoutRgb.textContent = `RGB(${r}, ${g}, ${b})`;
    if (swatch) swatch.style.backgroundColor = hex;
  }

  // Handle Palette Extractor UI
  function renderExtractedPalette() {
    const container = document.getElementById('refPaletteList');
    if (!container) return;

    const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;

    container.innerHTML = '';
    if (extractedPalette.length === 0) {
      container.innerHTML = `<p style="color: var(--text-tertiary); font-size: 0.9rem;">${_t('refStudio.dropzoneTitle')}</p>`;
      return;
    }

    extractedPalette.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'ref-palette-card';

      // Apply CVD simulation if active
      let displayHex = item.hex;
      if (activeCVDMode !== 'normal') {
        const sim = simulateCVD(item.rgb.r, item.rgb.g, item.rgb.b, activeCVDMode);
        displayHex = rgbToHex(sim.r, sim.g, sim.b);
      }

      card.innerHTML = `
        <div class="ref-swatch-box" style="background-color: ${displayHex};" title="${item.hex}"></div>
        <div class="ref-swatch-info">
          <strong>${item.hex.toUpperCase()}</strong>
          <span class="ref-lstar-tag">L*: ${item.lStar}</span>
        </div>
        <div class="ref-swatch-actions">
          <button type="button" class="ink-mixer__btn ink-mixer__btn--small ink-mixer__btn--primary send-to-solver-btn" data-hex="${item.hex}">
            🎯 ${_t('refStudio.solveBtn')}
          </button>
        </div>
      `;

      card.querySelector('.send-to-solver-btn').onclick = function () {
        sendToTargetSolver(item.hex);
      };

      container.appendChild(card);
    });

    renderValueContrastMatrix();
  }

  // Value Contrast Analysis (Feature 6)
  function renderValueContrastMatrix() {
    const container = document.getElementById('refContrastReport');
    if (!container) return;

    const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;

    if (extractedPalette.length < 2) {
      container.innerHTML = `<p style="color: var(--text-tertiary); font-size: 0.85rem;">${_t('refStudio.extractTwoColors')}</p>`;
      return;
    }

    const minL = Math.min(...extractedPalette.map(p => p.lStar));
    const maxL = Math.max(...extractedPalette.map(p => p.lStar));
    const totalContrastRange = Number((maxL - minL).toFixed(1));

    // Check adjacent contrasts
    let lowContrastWarnings = 0;
    const comparisons = [];
    for (let i = 0; i < extractedPalette.length - 1; i++) {
      const diff = Number(Math.abs(extractedPalette[i].lStar - extractedPalette[i + 1].lStar).toFixed(1));
      if (diff < 30) {
        lowContrastWarnings++;
      }
      comparisons.push({
        c1: extractedPalette[i].hex,
        c2: extractedPalette[i + 1].hex,
        diff: diff,
        isWarning: diff < 30
      });
    }

    let warningHtml = '';
    if (lowContrastWarnings > 0) {
      warningHtml = `
        <div class="ink-mixer__alert ink-mixer__alert--warning" style="margin-top: 0.75rem;">
          <div class="ink-mixer__alert-title">⚠️ ${_t('refStudio.longevityWarningTitle')}</div>
          <div class="ink-mixer__alert-body">
            ${_t('refStudio.longevityWarningBody', { count: lowContrastWarnings })}
          </div>
        </div>
      `;
    } else {
      warningHtml = `
        <div class="ink-mixer__alert ink-mixer__alert--success" style="margin-top: 0.75rem;">
          <div class="ink-mixer__alert-title">✅ ${_t('refStudio.excellentHierarchyTitle')}</div>
          <div class="ink-mixer__alert-body">
            ${_t('refStudio.excellentHierarchyBody')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span style="font-size: 0.9rem; color: var(--text-secondary);">${_t('refStudio.tonalSpanLabel')}</span>
        <strong style="font-size: 1.05rem; color: var(--text-primary);">ΔL* ${totalContrastRange}% (Range: ${minL} - ${maxL})</strong>
      </div>
      ${warningHtml}
    `;
  }

  // Send Hex directly to Target Solver in Tab 1
  function sendToTargetSolver(hex) {
    if (typeof window.syncTargetPickerFromHex === 'function') {
      window.syncTargetPickerFromHex(hex);
    }
    const solverInput = document.getElementById('targetHexInput');
    const colorPicker = document.getElementById('targetColorPicker');
    if (solverInput) solverInput.value = hex;
    if (colorPicker) colorPicker.value = hex;

    // Switch to mixer tab
    const mixerTabBtn = document.querySelector('[data-tab="mixer"]');
    if (mixerTabBtn) {
      mixerTabBtn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Auto-run solver if button exists
    const solveBtn = document.getElementById('solveTargetBtn');
    if (solveBtn) {
      setTimeout(() => solveBtn.click(), 150);
    }

    if (typeof window.showNotification === 'function') {
      const _t = typeof window.t === 'function' ? window.t : (k, p) => `Sent ${p.color} to Target Solver`;
      window.showNotification(_t('refStudio.sentToSolver', { color: hex.toUpperCase() }), 'success');
    }
  }

  // Load Image File
  function handleImageFile(file) {
    const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;
    if (!file || !file.type.startsWith('image/')) {
      if (typeof window.showNotification === 'function') {
        window.showNotification(_t('refStudio.invalidImage'), 'error');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        loadedImage = img;
        redrawCanvas();
        extractedPalette = extractDominantColors(img, 6);
        renderExtractedPalette();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Init Reference Studio UI
  function initReferenceStudio() {
    canvas = document.getElementById('refImageCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    loupeCanvas = document.getElementById('refLoupeCanvas');
    if (loupeCanvas) loupeCtx = loupeCanvas.getContext('2d');

    const fileInput = document.getElementById('refFileInput');
    const dropzone = document.getElementById('refDropzone');
    const cvdSelect = document.getElementById('refCvdSelect');
    const greyToggle = document.getElementById('refGreyscaleToggle');
    const sampleToSolverBtn = document.getElementById('refSampleToSolverBtn');

    if (fileInput) {
      fileInput.onchange = function (e) {
        if (e.target.files && e.target.files[0]) {
          handleImageFile(e.target.files[0]);
        }
      };
    }

    if (dropzone) {
      dropzone.ondragover = function (e) {
        e.preventDefault();
        dropzone.classList.add('ref-dropzone--active');
      };
      dropzone.ondragleave = function () {
        dropzone.classList.remove('ref-dropzone--active');
      };
      dropzone.ondrop = function (e) {
        e.preventDefault();
        dropzone.classList.remove('ref-dropzone--active');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleImageFile(e.dataTransfer.files[0]);
        }
      };
      dropzone.onclick = function () {
        if (fileInput) fileInput.click();
      };
    }

    canvas.onmousemove = updateLoupe;
    canvas.onclick = function (e) {
      updateLoupe(e);
      if (currentSampledColor && currentSampledColor.hex) {
        const lockSwatch = document.getElementById('refSampledLockSwatch');
        const lockHex = document.getElementById('refSampledLockHex');
        if (lockSwatch) lockSwatch.style.backgroundColor = currentSampledColor.hex;
        if (lockHex) lockHex.textContent = currentSampledColor.hex.toUpperCase();
      }
    };

    if (cvdSelect) {
      cvdSelect.onchange = function () {
        activeCVDMode = cvdSelect.value;
        redrawCanvas();
        renderExtractedPalette();
      };
    }

    if (greyToggle) {
      greyToggle.onchange = function () {
        isGreyscaleLuminance = greyToggle.checked;
        redrawCanvas();
      };
    }

    if (sampleToSolverBtn) {
      sampleToSolverBtn.onclick = function () {
        if (currentSampledColor && currentSampledColor.hex) {
          sendToTargetSolver(currentSampledColor.hex);
        }
      };
    }
  }

  // Global exposure
  window.initReferenceStudio = initReferenceStudio;
  window.simulateCVD = simulateCVD;
  window.rgbToLStar = rgbToLStar;
  window.sendToTargetSolver = sendToTargetSolver;

  document.addEventListener('DOMContentLoaded', initReferenceStudio);
})();
