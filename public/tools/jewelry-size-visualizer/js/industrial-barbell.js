/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Industrial Barbell Length Calculator Module
 * Poli International Widget Suite
 *
 * Requirements addressed:
 * - Empty input on start (Rule 3)
 * - Strict refusal of impossible inputs at entry (Rule 4)
 * - Size summary plain-text clipboard copy (Requirement E)
 * - Biological explanation of why undersized barbells fail (Requirement H)
 * - Direct transfer to Saved Collection (Requirement F) & Fit Card (Requirement C)
 */
'use strict';

const IndustrialBarbellCalculator = {
    ALL_LENGTHS: [30, 32, 34, 35, 36, 38, 40, 42, 44, 46, 48, 50, 54, 58, 60, 65, 70],

    BALL_PROTRUSION: {
        '3mm': 3,
        '4mm': 4,
        '5mm': 5
    },

    presets: [
        { span: 32, label: '32 mm', note: 'Petite ear scapha / helix' },
        { span: 35, label: '35 mm', note: 'Small / Compact ear' },
        { span: 38, label: '38 mm', note: 'Standard / Average scaffold' },
        { span: 42, label: '42 mm', note: 'Medium-wide ear ridge' },
        { span: 46, label: '46 mm', note: 'Large / Angled scaffold' }
    ],

    lastResult: null,

    getLocalDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    init() {
        const calcBtn = document.getElementById('ibb-calc-btn');
        const holeDistInput = document.getElementById('ibb-hole-distance');
        const ballSizeSelect = document.getElementById('ibb-ball-size');

        if (holeDistInput) {
            // Rule 3: Start empty with placeholder
            holeDistInput.value = '';
            holeDistInput.placeholder = 'e.g. 38';

            holeDistInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.calculate();
                }
            });
            holeDistInput.addEventListener('input', () => {
                const raw = holeDistInput.value.trim();
                if (raw === '') {
                    this.renderEmptyState();
                } else {
                    this.calculate();
                }
            });
        }

        if (ballSizeSelect) {
            ballSizeSelect.addEventListener('change', () => {
                if (holeDistInput && holeDistInput.value.trim() !== '') {
                    this.calculate();
                }
            });
        }

        if (calcBtn) {
            calcBtn.addEventListener('click', () => this.calculate());
        }

        this.renderQuickSpans();
        this.renderEmptyState();
        console.log('📏 IndustrialBarbellCalculator initialized (Rule 3 compliant: starts empty)');
    },

    renderQuickSpans() {
        const container = document.getElementById('ibb-quick-spans');
        if (!container) return;

        container.innerHTML = this.presets.map(p => `
            <button type="button" class="ibb-quick-chip" data-span="${p.span}">
                <strong>${p.label}</strong>
                <small>${tr('industrial.p.' + p.span, p.note)}</small>
            </button>
        `).join('');

        container.querySelectorAll('.ibb-quick-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const span = btn.dataset.span;
                const input = document.getElementById('ibb-hole-distance');
                if (input) {
                    input.value = span;
                    container.querySelectorAll('.ibb-quick-chip').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.calculate();
                }
            });
        });
    },

    renderEmptyState() {
        const resultDiv = document.getElementById('ibb-results');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="calc-empty-prompt" style="padding: 2.5rem 1.5rem; text-align: center; background: var(--bg-secondary); border: 2px dashed var(--border-color); border-radius: 8px; color: var(--text-secondary);">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📏</div>
                    <strong style="color: var(--text-primary); font-size: 1.05rem;">${tr('industrial.ui.emptyTitle', 'Enter the hole-to-hole distance above')}</strong>
                    <p style="margin: 0.5rem auto 0; max-width: 480px; font-size: 0.9rem; line-height: 1.5;">
                        ${tr('industrial.ui.emptyDesc', 'Type the measured distance between the two holes in millimetres, or pick a preset above, to get the bar length and calibrated 1:1 diagrams.')}
                    </p>
                </div>
            `;
        }
    },

    compute(dist, ball = '4mm') {
        const numDist = parseFloat(dist);
        if (isNaN(numDist) || numDist < 20 || numDist > 80) {
            return null;
        }

        const protrusion = this.BALL_PROTRUSION[ball] !== undefined ? this.BALL_PROTRUSION[ball] : 4;

        // Fresh calculation (4 mm clearance)
        const freshClearance = 4;
        const freshMinRequired = numDist + protrusion + freshClearance;
        const freshBestFit = this.ALL_LENGTHS.find(l => l >= freshMinRequired) || this.ALL_LENGTHS[this.ALL_LENGTHS.length - 1];
        const freshNextUp = this.ALL_LENGTHS.find(l => l > freshBestFit) || null;

        // Healed calculation (2 mm clearance)
        const healedClearance = 2;
        const healedMinRequired = numDist + protrusion + healedClearance;
        const healedBestFit = this.ALL_LENGTHS.find(l => l >= healedMinRequired) || this.ALL_LENGTHS[this.ALL_LENGTHS.length - 1];
        const healedNextUp = this.ALL_LENGTHS.find(l => l > healedBestFit) || null;

        return {
            dist: numDist,
            ball,
            protrusion,
            fresh: {
                clearance: freshClearance,
                minRequired: freshMinRequired,
                bestFit: freshBestFit,
                nextUp: freshNextUp
            },
            healed: {
                clearance: healedClearance,
                minRequired: healedMinRequired,
                bestFit: healedBestFit,
                nextUp: healedNextUp
            }
        };
    },

    calculate() {
        const holeDist = document.getElementById('ibb-hole-distance');
        const ballSize = document.getElementById('ibb-ball-size');
        const resultDiv = document.getElementById('ibb-results');

        if (!holeDist || !resultDiv) return;

        const raw = holeDist.value.trim();
        if (raw === '') {
            this.renderEmptyState();
            return;
        }

        const dist = parseFloat(raw);
        const ball = ballSize ? ballSize.value : '4mm';

        // Rule 4: Refuse impossible inputs at point of entry
        if (isNaN(dist) || dist < 20 || dist > 80) {
            resultDiv.innerHTML = `
                <div class="cbb-err-card" role="alert" style="background: var(--bg-secondary); border: 2px solid var(--color-error); padding: 1.5rem; border-radius: 8px; color: var(--text-primary); margin: 1.5rem 0;">
                    <div style="font-weight: 700; color: var(--color-error); margin-bottom: 0.5rem; font-size: 1.05rem;">
                        ⚠️ Impossible Scaffold Distance (${this.escapeHtml(raw)} mm)
                    </div>
                    <p style="margin: 0; line-height: 1.5; font-size: 0.95rem;">
                        Industrial scaffold distances must be between <strong>20 mm and 80 mm</strong>. Human ear scapha spans outside this range cannot safely accommodate a rigid straight barbell.
                    </p>
                </div>
            `;
            return;
        }

        const res = this.compute(dist, ball);
        if (!res) return;

        this.lastResult = res;

        resultDiv.innerHTML = this.buildResultHtml(res);
        this.renderScalePreviewSVG(res);
        this.wireButtons(res);
    },

    buildResultHtml(res) {
        const isCalibrated = (typeof AppState !== 'undefined' && AppState.isCalibrated);
        const statusBadge = isCalibrated
            ? `<span class="scale-status-badge scale-status-badge--calibrated">${tr('scale.badgeCalibrated', '✅ Calibrated (1:1)')}</span>`
            : `<span class="scale-status-badge scale-status-badge--approx">${tr('scale.badgeApprox', '⚠️ Approximate preview: not calibrated')}</span>`;

        return `
            <div class="cbb-result-container">
                <div class="cbb-result-header">
                    <div class="cbb-result-header-text">
                        <h3 class="cbb-result-title">Industrial Barbell Length Recommendations</h3>
                        <p class="cbb-result-subtitle">Hole-to-Hole Distance: <strong>${res.dist} mm</strong> &bull; Ball Diameter: <strong>${res.ball}</strong> &bull; Standard 14g (1.6 mm)</p>
                    </div>
                    ${statusBadge}
                </div>

                <!-- Side-by-Side Fresh vs Healed Display -->
                <div class="fresh-healed-grid">
                    <!-- Fresh Card -->
                    <div class="fresh-card">
                        <div class="stage-badge stage-badge--fresh">
                            <span>Fresh Industrial (Initial)</span>
                        </div>
                        <div class="stage-hero-length">
                            <span class="stage-hero-val">${res.fresh.bestFit}</span>
                            <span class="stage-hero-unit">mm</span>
                        </div>
                        <div class="stage-sub-label">Nearest standard internal length</div>

                        <div class="stage-breakdown">
                            <div class="stage-calc-row">
                                <span>Hole-to-Hole Span:</span>
                                <strong>${res.dist} mm</strong>
                            </div>
                            <div class="stage-calc-row">
                                <span>Ball Protrusion (${res.ball} balls):</span>
                                <strong>+${res.protrusion} mm</strong>
                            </div>
                            <div class="stage-calc-row">
                                <span>Swelling Clearance:</span>
                                <strong>+${res.fresh.clearance} mm</strong>
                            </div>
                            <div class="stage-calc-row stage-calc-row--total">
                                <span>Minimum Required:</span>
                                <strong>${res.fresh.minRequired.toFixed(1)} mm</strong>
                            </div>
                            ${res.fresh.nextUp ? `
                                <div class="stage-alt-row">
                                    <span>Next size up:</span>
                                    <strong>${res.fresh.nextUp} mm</strong> (extra comfort margin)
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Healed Card -->
                    <div class="healed-card">
                        <div class="stage-badge stage-badge--healed">
                            <span>Healed Industrial (Downsized)</span>
                        </div>
                        <div class="stage-hero-length">
                            <span class="stage-hero-val">${res.healed.bestFit}</span>
                            <span class="stage-hero-unit">mm</span>
                        </div>
                        <div class="stage-sub-label">Target downsized internal length</div>

                        <div class="stage-breakdown">
                            <div class="stage-calc-row">
                                <span>Hole-to-Hole Span:</span>
                                <strong>${res.dist} mm</strong>
                            </div>
                            <div class="stage-calc-row">
                                <span>Ball Protrusion (${res.ball} balls):</span>
                                <strong>+${res.protrusion} mm</strong>
                            </div>
                            <div class="stage-calc-row">
                                <span>Snug Clearance:</span>
                                <strong>+${res.healed.clearance} mm</strong>
                            </div>
                            <div class="stage-calc-row stage-calc-row--total">
                                <span>Minimum Required:</span>
                                <strong>${res.healed.minRequired.toFixed(1)} mm</strong>
                            </div>
                            ${res.healed.nextUp ? `
                                <div class="stage-alt-row">
                                    <span>Next size up:</span>
                                    <strong>${res.healed.nextUp} mm</strong> (comfort fit)
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Downsizing Disclosure -->
                <div class="downsizing-notice-callout">
                    <div class="downsizing-notice-content">
                        <strong>Initial jewelry is longer to allow for swelling and is shortened once the piercing has healed.</strong>
                        <p class="downsizing-notice-link-row">
                            For healing schedules and downsize reviews, see the
                            <a href="https://poliinternational.com/aftercare-schedule-generator/" target="_top" class="downsizing-external-link">
                                Aftercare Schedule Generator &rarr;
                            </a>
                        </p>
                    </div>
                </div>

                <!-- Requirement H: Clinical explanation of undersized industrial barbell -->
                <div class="size-shortage-warning" style="background: var(--bg-secondary); border: 2px solid var(--color-error); border-radius: 8px; padding: 1.25rem; margin: 1.5rem 0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem;">
                        <span style="font-size: 1.25rem;">⚠️</span>
                        <strong style="color: var(--color-error); font-size: 1rem;">
                            Clinical Warning: Why Any Industrial Barbell Under ${res.fresh.minRequired.toFixed(1)} mm Will Fail
                        </strong>
                    </div>
                    <p style="margin: 0 0 0.75rem 0; font-size: 0.9rem; line-height: 1.5; color: var(--text-primary);">
                        An industrial piercing connects two distinct cartilage ridges with one continuous rigid shaft. If the barbell length is shorter than <strong>${res.fresh.minRequired.toFixed(1)} mm</strong>:
                    </p>
                    <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.875rem; line-height: 1.6; color: var(--text-secondary);">
                        <li><strong>Cartilage Compression &amp; Inward Bowing:</strong> The rigid bar pulls both helix rims toward each other under high shear tension, permanently warping ear cartilage shape.</li>
                        <li><strong>Hypertrophic Scar Tissue &amp; Bumps:</strong> Continuous mechanical deflection across both channels produces stubborn inflammatory granulomas and hypertrophic scarring at both puncture margins.</li>
                        <li><strong>Margin Cutting (Cheese-Wiring):</strong> The 14g steel or titanium shaft cuts directly into the inner rim margin like a wire through cheese.</li>
                        <li><strong>Canal Tearing &amp; Rejection:</strong> Even minor incidental contact or pillow contact will tear through the compressed cartilage channel.</li>
                    </ul>
                </div>

                <!-- Full Mathematical Working Section -->
                <div class="working-box">
                    <h4 class="working-box-title">Calculation Working &amp; Formulas</h4>
                    <p class="working-formula-line">
                        <strong>Formula:</strong> Length = Hole-to-Hole Distance + Ball Protrusion Allowance + Stage Clearance
                    </p>
                    <ul class="working-list">
                        <li>
                            <strong>Fresh Working:</strong> ${res.dist} mm hole-to-hole + ${res.protrusion} mm ball protrusion + ${res.fresh.clearance} mm swelling clearance = <strong>${res.fresh.minRequired.toFixed(1)} mm</strong> minimum &rarr; Standard size: <strong>${res.fresh.bestFit} mm</strong>.
                        </li>
                        <li>
                            <strong>Healed Working:</strong> ${res.dist} mm hole-to-hole + ${res.protrusion} mm ball protrusion + ${res.healed.clearance} mm healed clearance = <strong>${res.healed.minRequired.toFixed(1)} mm</strong> minimum &rarr; Standard size: <strong>${res.healed.bestFit} mm</strong>.
                        </li>
                        <li>
                            <strong>Ball Protrusion Standard:</strong> 3mm balls = +3mm, 4mm balls = +4mm, 5mm balls = +5mm allowance across both ends.
                        </li>
                    </ul>
                </div>

                <!-- Pure Inline SVG True-Scale Diagram -->
                <div class="cbb-diagram-section">
                    <div class="cbb-diagram-header">
                        <span class="cbb-diagram-title">Calibrated 1:1 Vector Diagram</span>
                        <span class="cbb-diagram-legend">
                            <span class="legend-pill legend-pill--shaft">Barbell (${res.fresh.bestFit}mm Fresh / ${res.healed.bestFit}mm Healed)</span>
                            <span class="legend-pill legend-pill--tissue">Span (${res.dist}mm)</span>
                        </span>
                    </div>
                    <div class="cbb-svg-container" id="ibb-svg-viewport"></div>
                </div>

                <!-- Action Controls: Requirement E & F -->
                <div class="cbb-action-buttons" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 1.5rem;">
                    <button type="button" class="btn btn--primary" id="ibb-copy-summary-btn">
                        📋 Copy Size Summary (Plain Text)
                    </button>
                    <button type="button" class="btn btn--secondary" id="ibb-to-collection-btn">
                        💎 Save to My Jewellery Collection
                    </button>
                    <button type="button" class="btn btn--secondary" id="ibb-to-fitcard-btn">
                        🖨️ Transfer to Printable Fit Card
                    </button>
                </div>
            </div>
        `;
    },

    renderScalePreviewSVG(res) {
        const container = document.getElementById('ibb-svg-viewport');
        if (!container) return;

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

        const freshLengthPx = res.fresh.bestFit * ppmm;
        const distPx = res.dist * ppmm;

        const gaugeThicknessPx = Math.max(1.6 * ppmm, 2.5);
        const ballDiameterMM = parseInt(res.ball, 10) || 4;
        const ballRadiusPx = Math.max((ballDiameterMM / 2) * ppmm, 3.5);

        const startX = centerX - (freshLengthPx / 2);
        const endX = centerX + (freshLengthPx / 2);

        const hole1X = centerX - (distPx / 2);
        const hole2X = centerX + (distPx / 2);

        const isCalibrated = (typeof AppState !== 'undefined' && AppState.isCalibrated);
        const scaleNotice = isCalibrated
            ? 'Scale: 1:1 Calibrated Screen Scale'
            : 'Scale: Approximate (Bank card calibration required)';

        container.innerHTML = `
            <svg width="${widthPx}" height="${heightPx}" viewBox="0 0 ${widthPx} ${heightPx}" xmlns="http://www.w3.org/2000/svg" class="ibb-inline-svg" role="img" aria-label="Industrial Barbell 1:1 scale diagram">
                <defs>
                    <linearGradient id="ibbShaftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#cbd5e1" />
                        <stop offset="50%" stop-color="#64748b" />
                        <stop offset="100%" stop-color="#334155" />
                    </linearGradient>
                    <radialGradient id="ibbBallGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stop-color="#f8fafc" />
                        <stop offset="50%" stop-color="#94a3b8" />
                        <stop offset="100%" stop-color="#334155" />
                    </radialGradient>
                    <marker id="ibbArrM" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M 0 1.5 L 4.5 3 L 0 4.5 z" fill="#b76e79" />
                    </marker>
                    <marker id="ibbArrMStart" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 4.5 3 L 0 4.5 z" fill="#b76e79" />
                    </marker>
                </defs>

                <rect x="${hole1X}" y="${centerY - 24}" width="${distPx}" height="48" fill="rgba(183, 110, 121, 0.08)" rx="4" />
                <line x1="${hole1X}" y1="${centerY - 28}" x2="${hole1X}" y2="${centerY + 28}" stroke="#b76e79" stroke-width="1.5" stroke-dasharray="3 3" />
                <line x1="${hole2X}" y1="${centerY - 28}" x2="${hole2X}" y2="${centerY + 28}" stroke="#b76e79" stroke-width="1.5" stroke-dasharray="3 3" />

                <line x1="${startX}" y1="${centerY}" x2="${endX}" y2="${centerY}" stroke="url(#ibbShaftGrad)" stroke-width="${gaugeThicknessPx}" stroke-linecap="round" />
                <line x1="${startX}" y1="${centerY}" x2="${endX}" y2="${centerY}" stroke="#f1f5f9" stroke-width="${Math.max(gaugeThicknessPx * 0.35, 1)}" opacity="0.8" />

                <circle cx="${startX}" cy="${centerY}" r="${ballRadiusPx}" fill="url(#ibbBallGrad)" stroke="#475569" stroke-width="0.75" />
                <circle cx="${endX}" cy="${centerY}" r="${ballRadiusPx}" fill="url(#ibbBallGrad)" stroke="#475569" stroke-width="0.75" />

                <line x1="${hole1X}" y1="${centerY + 45}" x2="${hole2X}" y2="${centerY + 45}" stroke="#b76e79" stroke-width="1.5" marker-start="url(#ibbArrMStart)" marker-end="url(#ibbArrM)" />
                <text x="${centerX}" y="${centerY + 62}" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="600" fill="#881337">
                    Hole-to-Hole Distance: ${res.dist} mm
                </text>

                <line x1="${startX}" y1="${centerY - 45}" x2="${endX}" y2="${centerY - 45}" stroke="#475569" stroke-width="1.5" marker-start="url(#ibbArrMStart)" marker-end="url(#ibbArrM)" />
                <text x="${centerX}" y="${centerY - 52}" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="600" fill="#1e293b">
                    Fresh: ${res.fresh.bestFit} mm (Healed: ${res.healed.bestFit} mm)
                </text>

                <text x="14" y="${heightPx - 14}" font-size="11" font-family="sans-serif" fill="#64748b">
                    ${scaleNotice}
                </text>
                <text x="${widthPx - 14}" y="${heightPx - 14}" text-anchor="end" font-size="11" font-family="sans-serif" fill="#64748b">
                    14g (1.6 mm) &bull; ${res.ball} balls (+${res.protrusion}mm protrusion)
                </text>
            </svg>
        `;
    },

    wireButtons(res) {
        // Requirement E: Copy Size Summary (plain text)
        const copySummaryBtn = document.getElementById('ibb-copy-summary-btn');
        if (copySummaryBtn) {
            copySummaryBtn.addEventListener('click', () => {
                const date = this.getLocalDateString();
                const text = `Placement: Industrial Barbell | Gauge: 14g (1.6 mm) | Fresh Length: ${res.fresh.bestFit} mm | Healed Length: ${res.healed.bestFit} mm | Measured Span: ${res.dist} mm | Date: ${date}`;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        const orig = copySummaryBtn.textContent;
                        copySummaryBtn.textContent = tr('common.summaryCopied', '✓ Summary copied');
                        setTimeout(() => { copySummaryBtn.textContent = orig; }, 2500);
                    });
                } else if (typeof JewelleryCollectionModule !== 'undefined') {
                    JewelleryCollectionModule.copyToClipboard(text, '✓ Size summary copied!');
                }
            });
        }

        // Save to collection
        const toCollectionBtn = document.getElementById('ibb-to-collection-btn');
        if (toCollectionBtn) {
            toCollectionBtn.addEventListener('click', () => {
                if (typeof JewelleryCollectionModule !== 'undefined') {
                    JewelleryCollectionModule.addPiece({
                        placement: 'Industrial (Scaffold)',
                        name: 'Straight Scaffold Barbell',
                        gauge: '14g (1.6 mm)',
                        length: `${res.fresh.bestFit} mm`,
                        ballSize: res.ball,
                        material: 'ASTM F-136 Titanium'
                    });
                }
            });
        }

        // Transfer to printable fit card
        const toFitCardBtn = document.getElementById('ibb-to-fitcard-btn');
        if (toFitCardBtn) {
            toFitCardBtn.addEventListener('click', () => {
                if (typeof window.FitCardModule !== 'undefined') {
                    window.FitCardModule.setData({
                        placement: 'Industrial (Scaffold Barbell)',
                        measurement: `${res.dist} mm hole-to-hole cartilage distance`,
                        gauge: '14g (1.6 mm)',
                        freshLength: `${res.fresh.bestFit} mm (initial post)`,
                        healedLength: `${res.healed.bestFit} mm (downsized target)`,
                        ballSize: `${res.ball} threaded balls`,
                        notes: `Ball protrusion allowance: +${res.protrusion} mm. Swelling clearance: +${res.fresh.clearance} mm.`
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

window.IndustrialBarbellCalculator = IndustrialBarbellCalculator;
