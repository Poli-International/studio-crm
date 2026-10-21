/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Curved Barbell Length Calculator Module
 * Poli International Widget Suite
 *
 * Requirements addressed:
 * - Empty input on start (Rule 3)
 * - Strict refusal of impossible inputs at point of entry (Rule 4)
 * - Size summary plain-text clipboard copy (Requirement E)
 * - Biological explanation of why undersized barbells fail (Requirement H)
 * - Direct transfer to Saved Collection (Requirement F) & Fit Card (Requirement C)
 */
'use strict';

const CurvedBarbellCalculator = {
    presets: [
        {
            id: 'rook',
            name: 'Rook',
            desc: 'Antihelix cartilage fold — upper inner ear',
            typicalMin: 5,
            typicalMax: 9,
            defaultSpan: 7,
            gauge: '16g (1.2 mm)',
            gaugeVal: '16g',
            gaugeNote: 'Most rooks are pierced at 16g. 18g is possible for delicate anatomy.',
            clearanceFresh: 5,
            clearanceHealed: 3,
            quickSpans: [5, 6, 7, 8, 9]
        },
        {
            id: 'daith',
            name: 'Daith',
            desc: 'Innermost cartilage fold — crus of helix',
            typicalMin: 7,
            typicalMax: 11,
            defaultSpan: 8,
            gauge: '16g (1.2 mm) or 14g (1.6 mm)',
            gaugeVal: '16g',
            gaugeNote: 'Daith anatomy varies considerably. 14g is common for long-term wear stability.',
            clearanceFresh: 6,
            clearanceHealed: 4,
            quickSpans: [7, 8, 9, 10, 11]
        },
        {
            id: 'snug',
            name: 'Snug',
            desc: 'Anti-helix cartilage — mid inner ear rim',
            typicalMin: 6,
            typicalMax: 10,
            defaultSpan: 8,
            gauge: '16g (1.2 mm)',
            gaugeVal: '16g',
            gaugeNote: 'Snug is anatomy-dependent. Cartilage ridge must be prominent enough to support the barbell.',
            clearanceFresh: 5,
            clearanceHealed: 3,
            quickSpans: [6, 7, 8, 9, 10]
        },
        {
            id: 'conch',
            name: 'Conch (curved)',
            desc: 'Bowl of the ear — inner or outer conch',
            typicalMin: 7,
            typicalMax: 12,
            defaultSpan: 9,
            gauge: '16g or 14g (1.2–1.6 mm)',
            gaugeVal: '14g',
            gaugeNote: 'Curved barbells are one option for conch; 14g recommended for mechanical stability.',
            clearanceFresh: 6,
            clearanceHealed: 4,
            quickSpans: [7, 8, 9, 10, 12]
        },
        {
            id: 'eyebrow',
            name: 'Eyebrow / Anti-eyebrow',
            desc: 'Surface-type curved barbell through brow ridge',
            typicalMin: 7,
            typicalMax: 10,
            defaultSpan: 8,
            gauge: '16g (1.2 mm)',
            gaugeVal: '16g',
            gaugeNote: 'Eyebrow piercings are surface-type. Use an anatomically contoured curved barbell.',
            clearanceFresh: 6,
            clearanceHealed: 4,
            quickSpans: [7, 8, 9, 10]
        },
        {
            id: 'navel',
            name: 'Navel / Belly button',
            desc: 'Upper rim of the navel',
            typicalMin: 9,
            typicalMax: 14,
            defaultSpan: 11,
            gauge: '14g (1.6 mm)',
            gaugeVal: '14g',
            gaugeNote: 'Navel piercings are almost always done at 14g.',
            clearanceFresh: 7,
            clearanceHealed: 5,
            quickSpans: [9, 10, 11, 12, 14]
        }
    ],

    allSizes: [6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 20],
    lastCalculation: null,

    getLocalDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // opened from the anatomy view: show this calculator with that piercing chosen
    selectPreset(presetId) {
        const tab = document.querySelector('[data-tab="curved-barbell"]');
        if (tab) tab.click();
        const select = document.getElementById('cbb-piercing-type');
        if (select && this.presets.some(p => p.id === presetId)) {
            select.value = presetId;
            select.dispatchEvent(new Event('change'));
        }
    },

    init() {
        const piercingSelect = document.getElementById('cbb-piercing-type');
        const spanInput = document.getElementById('cbb-anatomy-mm');
        const calcBtn = document.getElementById('cbb-calc-btn');

        if (piercingSelect) {
            piercingSelect.innerHTML = this.presets.map(p => `
                <option value="${p.id}">${tr('curved.p.' + p.id + '.name', p.name)} (${tr('curved.p.' + p.id + '.desc', p.desc)})</option>
            `).join('');

            piercingSelect.addEventListener('change', () => {
                const preset = this.presets.find(p => p.id === piercingSelect.value);
                if (preset) {
                    this.updatePresetInfo(preset);
                    this.renderQuickSpans(preset);
                    if (spanInput && spanInput.value.trim() !== '') {
                        this.calculate();
                    }
                }
            });
        }

        if (spanInput) {
            // Rule 3: Input starts empty with placeholder
            spanInput.value = '';
            spanInput.placeholder = 'e.g. 8';

            spanInput.addEventListener('input', () => {
                const val = spanInput.value.trim();
                if (val === '') {
                    this.renderEmptyState();
                } else {
                    this.calculate();
                }
            });
            spanInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.calculate();
                }
            });
        }

        if (calcBtn) {
            calcBtn.addEventListener('click', () => this.calculate());
        }

        const initialPreset = this.presets[0];
        if (initialPreset) {
            this.updatePresetInfo(initialPreset);
            this.renderQuickSpans(initialPreset);
        }

        // Initially render empty prompt
        this.renderEmptyState();
        console.log('📐 CurvedBarbellCalculator initialized (Rule 3 compliant: starts empty)');
    },

    updatePresetInfo(preset) {
        const infoEl = document.getElementById('cbb-preset-info');
        if (!infoEl) return;

        infoEl.innerHTML = `
            <div class="cbb-preset-badge">
                <span class="cbb-preset-title">${this.escapeHtml(tr('curved.p.' + preset.id + '.name', preset.name))}</span>
                <span class="cbb-preset-gauge">Standard Gauge: <strong>${this.escapeHtml(preset.gauge)}</strong></span>
                <span class="cbb-preset-range">${tr('curved.ui.typicalRange', 'Typical span range: <strong>{min}–{max} mm</strong>', { min: preset.typicalMin, max: preset.typicalMax })}</span>
                <span class="cbb-preset-note">${this.escapeHtml(tr('curved.p.' + preset.id + '.note', preset.gaugeNote))}</span>
            </div>
        `;
    },

    renderQuickSpans(preset) {
        const container = document.getElementById('cbb-quick-spans');
        if (!container) return;

        container.innerHTML = preset.quickSpans.map(span => `
            <button type="button" class="cbb-quick-chip" data-span="${span}">
                ${span} mm
            </button>
        `).join('');

        container.querySelectorAll('.cbb-quick-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const span = parseFloat(btn.dataset.span);
                const input = document.getElementById('cbb-anatomy-mm');
                if (input) {
                    input.value = span;
                    container.querySelectorAll('.cbb-quick-chip').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.calculate();
                }
            });
        });
    },

    renderEmptyState() {
        const resultArea = document.getElementById('cbb-results');
        if (resultArea) {
            resultArea.innerHTML = `
                <div class="calc-empty-prompt" style="padding: 2.5rem 1.5rem; text-align: center; background: var(--bg-secondary); border: 2px dashed var(--border-color); border-radius: 8px; color: var(--text-secondary);">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📏</div>
                    <strong style="color: var(--text-primary); font-size: 1.05rem;">${tr('curved.ui.emptyTitle', 'Enter the tissue span above')}</strong>
                    <p style="margin: 0.5rem auto 0; max-width: 480px; font-size: 0.9rem; line-height: 1.5;">
                        ${tr('curved.ui.emptyDesc', 'Type your caliper or photo measurement in millimetres, or pick a typical depth, to get the fresh and healed bar lengths with calibrated diagrams.')}
                    </p>
                </div>
            `;
        }
    },

    compute(presetId, span) {
        const preset = this.presets.find(p => p.id === presetId);
        if (!preset) return null;
        const numSpan = parseFloat(span);
        if (isNaN(numSpan) || numSpan < 1 || numSpan > 35) return null;

        // Fresh calculation
        const freshClearance = preset.clearanceFresh;
        const freshRecommended = numSpan + freshClearance;
        const freshBestFit = this.allSizes.find(s => s >= freshRecommended) || this.allSizes[this.allSizes.length - 1];
        const freshNextUp = this.allSizes.find(s => s > freshBestFit) || null;

        // Healed calculation
        const healedClearance = preset.clearanceHealed;
        const healedRecommended = numSpan + healedClearance;
        const healedBestFit = this.allSizes.find(s => s >= healedRecommended) || this.allSizes[this.allSizes.length - 1];
        const healedNextUp = this.allSizes.find(s => s > healedBestFit) || null;

        return {
            preset,
            span: numSpan,
            fresh: {
                clearance: freshClearance,
                recommended: freshRecommended,
                bestFit: freshBestFit,
                nextUp: freshNextUp
            },
            healed: {
                clearance: healedClearance,
                recommended: healedRecommended,
                bestFit: healedBestFit,
                nextUp: healedNextUp
            }
        };
    },

    calculate() {
        const piercingSelect = document.getElementById('cbb-piercing-type');
        const spanInput = document.getElementById('cbb-anatomy-mm');
        const resultArea = document.getElementById('cbb-results');

        if (!piercingSelect || !spanInput || !resultArea) return;

        const preset = this.presets.find(p => p.id === piercingSelect.value);
        if (!preset) return;

        const rawVal = spanInput.value.trim();
        if (rawVal === '') {
            this.renderEmptyState();
            return;
        }

        const span = parseFloat(rawVal);

        // Rule 4: Refuse impossible inputs at point of entry
        if (isNaN(span) || span < 1 || span > 35) {
            resultArea.innerHTML = `
                <div class="cbb-err-card" role="alert" style="background: var(--bg-secondary); border: 2px solid var(--color-error); padding: 1.5rem; border-radius: 8px; color: var(--text-primary); margin: 1.5rem 0;">
                    <div style="font-weight: 700; color: var(--color-error); margin-bottom: 0.5rem; font-size: 1.05rem;">
                        ⚠️ Impossible Anatomical Measurement (${this.escapeHtml(rawVal)} mm)
                    </div>
                    <p style="margin: 0; line-height: 1.5; font-size: 0.95rem;">
                        Tissue spans must be realistic positive values between <strong>1 mm and 35 mm</strong>. Human ear, brow, and navel tissue folds do not exceed 35 mm. Please measure with physical calipers or use the in-browser Photo Measurement tab.
                    </p>
                </div>
            `;
            return;
        }

        const calc = this.compute(preset.id, span);
        this.lastCalculation = calc;

        resultArea.innerHTML = this.buildResultHtml(calc);
        this.renderScalePreviewSVG(calc);
        this.wireButtons(calc);
    },

    buildResultHtml(calc) {
        const { preset, span, fresh, healed } = calc;

        const isCalibrated = (typeof AppState !== 'undefined' && AppState.isCalibrated);
        const statusBadge = isCalibrated
            ? `<span class="scale-status-badge scale-status-badge--calibrated">${tr('scale.badgeCalibrated', '✅ Calibrated (1:1)')}</span>`
            : `<span class="scale-status-badge scale-status-badge--approx">${tr('scale.badgeApprox', '⚠️ Approximate preview: not calibrated')}</span>`;

        return `
            <div class="cbb-result-container">
                <div class="cbb-result-header">
                    <div class="cbb-result-header-text">
                        <h3 class="cbb-result-title">${tr('curved.res.title', '{name} Barbell Length Recommendations', { name: this.escapeHtml(preset.name) })}</h3>
                        <p class="cbb-result-subtitle">${tr('curved.res.subtitle', 'Measured tissue span: <strong>{span} mm</strong> &bull; Gauge: <strong>{gauge}</strong>', { span: span, gauge: this.escapeHtml(preset.gauge) })}</p>
                    </div>
                    ${statusBadge}
                </div>

                <!-- Side-by-side Fresh vs Healed Display -->
                <div class="fresh-healed-grid">
                    <!-- Fresh Card -->
                    <div class="fresh-card">
                        <div class="stage-badge stage-badge--fresh">
                            <span>${tr('curved.res.freshBadge', 'Fresh Piercing (Initial)')}</span>
                        </div>
                        <div class="stage-hero-length">
                            <span class="stage-hero-val">${fresh.bestFit}</span>
                            <span class="stage-hero-unit">mm</span>
                        </div>
                        <div class="stage-sub-label">${tr('curved.res.nearest', 'Nearest standard internal length')}</div>

                        <div class="stage-breakdown">
                            <div class="stage-calc-row">
                                <span>${tr('curved.res.tissueSpan', 'Tissue Span:')}</span>
                                <strong>${span} mm</strong>
                            </div>
                            <div class="stage-calc-row">
                                <span>${tr('curved.res.swellClear', 'Swelling Clearance:')}</span>
                                <strong>+${fresh.clearance} mm</strong>
                            </div>
                            <div class="stage-calc-row stage-calc-row--total">
                                <span>${tr('curved.res.minReq', 'Minimum Required:')}</span>
                                <strong>${fresh.recommended.toFixed(1)} mm</strong>
                            </div>
                            ${fresh.nextUp ? `
                                <div class="stage-alt-row">
                                    <span>${tr('curved.res.nextUp', 'Next size up:')}</span>
                                    <strong>${fresh.nextUp} mm</strong> ${tr('curved.res.extraMargin', '(extra comfort margin)')}
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Healed Card -->
                    <div class="healed-card">
                        <div class="stage-badge stage-badge--healed">
                            <span>${tr('curved.res.healedBadge', 'Healed Piercing (Downsized)')}</span>
                        </div>
                        <div class="stage-hero-length">
                            <span class="stage-hero-val">${healed.bestFit}</span>
                            <span class="stage-hero-unit">mm</span>
                        </div>
                        <div class="stage-sub-label">${tr('curved.res.targetDown', 'Target downsized internal length')}</div>

                        <div class="stage-breakdown">
                            <div class="stage-calc-row">
                                <span>${tr('curved.res.tissueSpan', 'Tissue Span:')}</span>
                                <strong>${span} mm</strong>
                            </div>
                            <div class="stage-calc-row">
                                <span>${tr('curved.res.snugClear', 'Snug Clearance:')}</span>
                                <strong>+${healed.clearance} mm</strong>
                            </div>
                            <div class="stage-calc-row stage-calc-row--total">
                                <span>${tr('curved.res.minReq', 'Minimum Required:')}</span>
                                <strong>${healed.recommended.toFixed(1)} mm</strong>
                            </div>
                            ${healed.nextUp ? `
                                <div class="stage-alt-row">
                                    <span>${tr('curved.res.nextUp', 'Next size up:')}</span>
                                    <strong>${healed.nextUp} mm</strong> ${tr('curved.res.comfortFit', '(comfort fit)')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Downsizing Notice -->
                <div class="downsizing-notice-callout">
                    <div class="downsizing-notice-content">
                        <strong>${tr('curved.res.downsizeNotice', 'Initial jewelry is longer to allow for swelling and is shortened once the piercing has healed.')}</strong>
                        <p class="downsizing-notice-link-row">
                            ${tr('curved.res.downsizeLink', 'For healing schedules and downsize timing, see the')}
                            <a href="https://poliinternational.com/aftercare-schedule-generator/" target="_top" class="downsizing-external-link">
                                Aftercare Schedule Generator &rarr;
                            </a>
                        </p>
                    </div>
                </div>

                <!-- Requirement H: Clinical explanation of undersized barbells -->
                <div class="size-shortage-warning" style="background: var(--bg-secondary); border: 2px solid var(--color-error); border-radius: 8px; padding: 1.25rem; margin: 1.5rem 0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem;">
                        <span style="font-size: 1.25rem;">⚠️</span>
                        <strong style="color: var(--color-error); font-size: 1rem;">
                            ${tr('curved.res.warnTitle', 'Clinical Warning: Why Any Barbell Under {len} mm Will Fail on a Fresh Piercing', { len: fresh.recommended.toFixed(1) })}
                        </strong>
                    </div>
                    <p style="margin: 0 0 0.75rem 0; font-size: 0.9rem; line-height: 1.5; color: var(--text-primary);">
                        ${tr('curved.res.warnIntro', 'If a barbell shorter than <strong>{len} mm</strong> is inserted into this {span} mm tissue span, the following biological complications occur:', { len: fresh.recommended.toFixed(1), span: span })}
                    </p>
                    <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.875rem; line-height: 1.6; color: var(--text-secondary);">
                        <li>${tr('curved.res.warn1', '<strong>Tissue Compression:</strong> The end balls clamp flush against entry and exit wounds with no relief margin.')}</li>
                        <li>${tr('curved.res.warn2', '<strong>Capillary Ischemia &amp; Necrosis:</strong> Unrelieved mechanical pressure halts local microvascular circulation, suffocating tissue and leading to localized tissue death (necrosis).')}</li>
                        <li>${tr('curved.res.warn3', '<strong>Jewellery Embedding:</strong> Normal post-piercing inflammatory edema forces the end balls into the skin, requiring urgent surgical incision to remove.')}</li>
                        <li>${tr('curved.res.warn4', '<strong>Migration &amp; Rejection:</strong> Persistent inward tension causes the barbell to track forward through the cartilage or skin, causing permanent scarring and loss of the piercing.')}</li>
                    </ul>
                </div>

                <!-- Full Mathematical Working Section -->
                <div class="working-box">
                    <h4 class="working-box-title">${tr('curved.res.workTitle', 'Calculation Working &amp; Formulas')}</h4>
                    <p class="working-formula-line">
                        ${tr('curved.res.formula', '<strong>Formula:</strong> Recommended Length = Measured Tissue Span + Stage Clearance')}
                    </p>
                    <ul class="working-list">
                        <li>
                            ${tr('curved.res.workFresh', '<strong>Fresh Working:</strong> {span} mm span + {c} mm swelling clearance = <strong>{rec} mm</strong> minimum &rarr; Standard size: <strong>{best} mm</strong>.', { span: span, c: fresh.clearance, rec: fresh.recommended.toFixed(1), best: fresh.bestFit })}
                        </li>
                        <li>
                            ${tr('curved.res.workHealed', '<strong>Healed Working:</strong> {span} mm span + {c} mm healed clearance = <strong>{rec} mm</strong> minimum &rarr; Standard size: <strong>{best} mm</strong>.', { span: span, c: healed.clearance, rec: healed.recommended.toFixed(1), best: healed.bestFit })}
                        </li>
                    </ul>
                </div>

                <!-- Pure Inline SVG True-Scale Diagram -->
                <div class="cbb-diagram-section">
                    <div class="cbb-diagram-header">
                        <span class="cbb-diagram-title">${tr('curved.res.diagTitle', 'Calibrated 1:1 Vector Diagram')}</span>
                        <span class="cbb-diagram-legend">
                            <span class="legend-pill legend-pill--shaft">${tr('curved.res.legendShaft', 'Shaft ({fresh}mm Fresh / {healed}mm Healed)', { fresh: fresh.bestFit, healed: healed.bestFit })}</span>
                            <span class="legend-pill legend-pill--tissue">${tr('curved.res.legendTissue', 'Tissue ({span}mm)', { span: span })}</span>
                        </span>
                    </div>
                    <div class="cbb-svg-container" id="cbb-svg-viewport"></div>
                </div>

                <!-- Action Controls: Requirement E & F -->
                <div class="cbb-action-buttons" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 1.5rem;">
                    <button type="button" class="btn btn--primary" id="cbb-copy-summary-btn">
                        ${tr('curved.res.btnCopy', '📋 Copy Size Summary (Plain Text)')}
                    </button>
                    <button type="button" class="btn btn--secondary" id="cbb-to-collection-btn">
                        ${tr('curved.res.btnSave', '💎 Save to My Jewellery Collection')}
                    </button>
                    <button type="button" class="btn btn--secondary" id="cbb-to-fitcard-btn">
                        ${tr('curved.res.btnFit', '🖨️ Transfer to Printable Fit Card')}
                    </button>
                </div>
            </div>
        `;
    },

    renderScalePreviewSVG(calc) {
        const container = document.getElementById('cbb-svg-viewport');
        if (!container) return;

        const { span, fresh, healed, preset } = calc;

        let ppmm = 96 / 25.4;
        if (typeof AppState !== 'undefined' && AppState.pxPerMM) {
            ppmm = AppState.pxPerMM;
        } else if (typeof AppState !== 'undefined' && AppState.pixelsPerInch) {
            ppmm = AppState.pixelsPerInch / 25.4;
        }

        const widthPx = Math.max(container.clientWidth || 540, 480);
        const heightPx = 220;

        const centerX = widthPx / 2;
        const centerY = 110;

        const freshLengthPx = fresh.bestFit * ppmm;
        const spanPx = span * ppmm;

        const freshHalfChord = freshLengthPx / 2;
        const freshBulge = freshLengthPx * 0.28;
        const freshRadius = (freshHalfChord * freshHalfChord + freshBulge * freshBulge) / (2 * freshBulge);

        const gaugeThicknessPx = Math.max((preset.gaugeVal === '14g' ? 1.6 : 1.2) * ppmm, 2.5);
        const ballRadiusPx = Math.max((preset.gaugeVal === '14g' ? 4 : 3) / 2 * ppmm, 3.5);

        const leftX = centerX - freshHalfChord;
        const rightX = centerX + freshHalfChord;
        const arcPath = `M ${leftX} ${centerY} A ${freshRadius} ${freshRadius} 0 0 1 ${rightX} ${centerY}`;

        const tissueLeft = centerX - (spanPx / 2);
        const tissueRight = centerX + (spanPx / 2);

        const isCalibrated = (typeof AppState !== 'undefined' && AppState.isCalibrated);
        const scaleNotice = isCalibrated
            ? tr('curved.res.scaleCal', 'Scale: 1:1 Calibrated Screen Scale')
            : tr('curved.res.scaleApprox', 'Scale: Approximate (Bank card calibration required)');

        container.innerHTML = `
            <svg width="${widthPx}" height="${heightPx}" viewBox="0 0 ${widthPx} ${heightPx}" xmlns="http://www.w3.org/2000/svg" class="cbb-inline-svg" role="img" aria-label="${tr('curved.res.svgAria', '{name} curved barbell 1:1 scale diagram', { name: preset.name })}">
                <defs>
                    <linearGradient id="barbellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#cbd5e1" />
                        <stop offset="50%" stop-color="#64748b" />
                        <stop offset="100%" stop-color="#334155" />
                    </linearGradient>
                    <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stop-color="#f8fafc" />
                        <stop offset="50%" stop-color="#94a3b8" />
                        <stop offset="100%" stop-color="#334155" />
                    </radialGradient>
                    <marker id="arrowM" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M 0 1.5 L 4.5 3 L 0 4.5 z" fill="#b76e79" />
                    </marker>
                    <marker id="arrowMStart" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 4.5 3 L 0 4.5 z" fill="#b76e79" />
                    </marker>
                </defs>

                <rect x="${tissueLeft}" y="${centerY - 24}" width="${spanPx}" height="48" fill="rgba(183, 110, 121, 0.08)" rx="4" />
                <line x1="${tissueLeft}" y1="${centerY - 28}" x2="${tissueLeft}" y2="${centerY + 28}" stroke="#b76e79" stroke-width="1.5" stroke-dasharray="3 3" />
                <line x1="${tissueRight}" y1="${centerY - 28}" x2="${tissueRight}" y2="${centerY + 28}" stroke="#b76e79" stroke-width="1.5" stroke-dasharray="3 3" />

                <path d="${arcPath}" fill="none" stroke="url(#barbellGrad)" stroke-width="${gaugeThicknessPx}" stroke-linecap="round" />
                <path d="${arcPath}" fill="none" stroke="#f1f5f9" stroke-width="${Math.max(gaugeThicknessPx * 0.35, 1)}" opacity="0.8" />

                <circle cx="${leftX}" cy="${centerY}" r="${ballRadiusPx}" fill="url(#ballGrad)" stroke="#475569" stroke-width="0.75" />
                <circle cx="${rightX}" cy="${centerY}" r="${ballRadiusPx}" fill="url(#ballGrad)" stroke="#475569" stroke-width="0.75" />

                <line x1="${tissueLeft}" y1="${centerY + 45}" x2="${tissueRight}" y2="${centerY + 45}" stroke="#b76e79" stroke-width="1.5" marker-start="url(#arrowMStart)" marker-end="url(#arrowM)" />
                <text x="${centerX}" y="${centerY + 62}" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="600" fill="#881337">
                    ${tr('curved.res.svgSpan', 'Tissue Span: {span} mm', { span: span })}
                </text>

                <line x1="${leftX}" y1="${centerY - 45}" x2="${rightX}" y2="${centerY - 45}" stroke="#475569" stroke-width="1.5" marker-start="url(#arrowMStart)" marker-end="url(#arrowM)" />
                <text x="${centerX}" y="${centerY - 52}" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="600" fill="#1e293b">
                    ${tr('curved.res.svgFresh', 'Fresh: {fresh} mm (Healed: {healed} mm)', { fresh: fresh.bestFit, healed: healed.bestFit })}
                </text>

                <text x="14" y="${heightPx - 14}" font-size="11" font-family="sans-serif" fill="#64748b">
                    ${scaleNotice}
                </text>
                <text x="${widthPx - 14}" y="${heightPx - 14}" text-anchor="end" font-size="11" font-family="sans-serif" fill="#64748b">
                    ${tr('curved.res.svgGauge', 'Gauge: {gauge}', { gauge: preset.gauge })}
                </text>
            </svg>
        `;
    },

    wireButtons(calc) {
        // Requirement E: One button that copies plain-text line
        const copySummaryBtn = document.getElementById('cbb-copy-summary-btn');
        if (copySummaryBtn) {
            copySummaryBtn.addEventListener('click', () => {
                const date = this.getLocalDateString();
                const text = tr('curved.res.copyText', 'Placement: {placement} | Gauge: {gauge} | Fresh Length: {fresh} mm | Healed Length: {healed} mm | Measured Span: {span} mm | Date: {date}', { placement: calc.preset.name, gauge: calc.preset.gauge, fresh: calc.fresh.bestFit, healed: calc.healed.bestFit, span: calc.span, date: date });
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        const orig = copySummaryBtn.textContent;
                        copySummaryBtn.textContent = tr('common.summaryCopied', '✓ Summary copied');
                        setTimeout(() => { copySummaryBtn.textContent = orig; }, 2500);
                    });
                } else if (typeof JewelleryCollectionModule !== 'undefined') {
                    JewelleryCollectionModule.copyToClipboard(text, tr('curved.res.copied', '✓ Size summary copied!'));
                }
            });
        }

        // Save to collection
        const toCollectionBtn = document.getElementById('cbb-to-collection-btn');
        if (toCollectionBtn) {
            toCollectionBtn.addEventListener('click', () => {
                if (typeof JewelleryCollectionModule !== 'undefined') {
                    JewelleryCollectionModule.addPiece({
                        placement: calc.preset.name,
                        name: 'Curved Barbell',
                        gauge: calc.preset.gauge,
                        length: `${calc.fresh.bestFit} mm`,
                        ballSize: calc.preset.gaugeVal === '14g' ? '4.0 mm' : '3.0 mm',
                        material: 'ASTM F-136 Titanium'
                    });
                }
            });
        }

        // Transfer to printable fit card
        const toFitCardBtn = document.getElementById('cbb-to-fitcard-btn');
        if (toFitCardBtn) {
            toFitCardBtn.addEventListener('click', () => {
                if (typeof window.FitCardModule !== 'undefined') {
                    window.FitCardModule.setData({
                        placement: `${calc.preset.name} (${calc.preset.desc})`,
                        measurement: tr('curved.res.fcMeasurement', '{span} mm tissue span', { span: calc.span }),
                        gauge: calc.preset.gauge,
                        freshLength: tr('curved.res.fcFresh', '{n} mm (initial post)', { n: calc.fresh.bestFit }),
                        healedLength: tr('curved.res.fcHealed', '{n} mm (downsized target)', { n: calc.healed.bestFit }),
                        ballSize: calc.preset.gaugeVal === '14g' ? '4 mm' : '3 mm',
                        notes: tr('curved.res.fcNotes', 'Swelling clearance: +{a} mm. Healed clearance: +{b} mm.', { a: calc.fresh.clearance, b: calc.healed.clearance })
                    });

                    if (typeof window.switchTab === 'function') {
                        window.switchTab('fit-card');
                    } else {
                        const tabBtn = document.querySelector('[data-tab="fit-card"]');
                        if (tabBtn) tabBtn.click();
                    }
                }
            });
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
};

window.CurvedBarbellCalculator = CurvedBarbellCalculator;
