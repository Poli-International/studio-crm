/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Calibration System - Single Source of Truth in Pixels per Millimetre (px/mm)
 * Poli International Widget Suite
 *
 * Requirements:
 * - One stored value in pixels per millimetre (pxPerMM).
 * - Tracks which method produced it and on what local date.
 * - Stale calibration detection: monitors viewport width and device pixel ratio.
 * - 1-click redo calibration.
 */

const CalibrationSystem = {
    modal: null,
    cardSlider: null,
    rulerSlider: null,
    currentCardWidth: 320, // Starting preview width in pixels
    currentRulerWidth: 400, // Starting preview width in pixels
    targetCardWidthMM: 85.60, // ISO/IEC 7810 ID-1 standard bank card (85.60 mm)
    targetRulerWidthMM: 100, // 100 mm (10 cm) ruler standard
    STORAGE_KEY: 'poli_screen_calibration',
    activeMethod: 'bank_card', // 'bank_card' | 'ruler' | 'auto_detect'
    isStale: false,
    staleReason: '',
    currentCalibration: null,

    /**
     * Initialize calibration system
     */
    init() {
        this.modal = document.getElementById('calibration-modal');
        this.cardSlider = document.getElementById('card-calibration-slider');
        this.rulerSlider = document.getElementById('ruler-calibration-slider');

        // Load saved calibration and assess staleness
        this.loadSavedCalibration();

        // Bind DOM event listeners
        this.bindEvents();

        // Initialize display state
        this.updateAllHonestyBadges();
        console.log('📏 Calibration System initialized. Source of truth:', AppState?.pxPerMM || 'uncalibrated', 'px/mm');
    },

    /**
     * Format current local date as YYYY-MM-DD
     */
    getLocalDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Load calibration from localStorage and detect staleness
     */
    loadSavedCalibration() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data && data.isCalibrated === true && typeof data.pxPerMM === 'number' && data.pxPerMM > 1 && data.pxPerMM < 30) {
                    const currentViewportWidth = window.innerWidth;
                    const currentDPR = window.devicePixelRatio || 1;

                    // Stale check (Requirement B)
                    // If either viewport width or DPR changed significantly, calibration is stale
                    const widthChanged = typeof data.viewportWidth === 'number' && Math.abs(currentViewportWidth - data.viewportWidth) > 30;
                    const dprChanged = typeof data.devicePixelRatio === 'number' && Math.abs(currentDPR - data.devicePixelRatio) > 0.05;

                    if (widthChanged || dprChanged) {
                        this.isStale = true;
                        this.staleReason = widthChanged && dprChanged
                            ? tr('cal.stale.both', 'Screen resolution and pixel ratio changed (was {w0}px at {d0}x, now {w1}px at {d1}x)', { w0: data.viewportWidth, d0: data.devicePixelRatio, w1: currentViewportWidth, d1: currentDPR })
                            : widthChanged
                                ? tr('cal.stale.width', 'Window or screen width changed (was {w0}px, now {w1}px)', { w0: data.viewportWidth, w1: currentViewportWidth })
                                : tr('cal.stale.dpr', 'Pixel ratio changed (was {d0}x, now {d1}x)', { d0: data.devicePixelRatio, d1: currentDPR });

                        if (typeof AppState !== 'undefined') {
                            AppState.isCalibrated = false;
                            AppState.pxPerMM = data.pxPerMM;
                            AppState.pixelsPerInch = data.pxPerMM * 25.4;
                        }
                        this.currentCalibration = data;
                        console.warn('⚠️ Screen calibration is stale:', this.staleReason);
                        return false;
                    }

                    // Active, valid calibration
                    this.isStale = false;
                    this.staleReason = '';
                    this.currentCalibration = data;
                    if (typeof AppState !== 'undefined') {
                        AppState.isCalibrated = true;
                        AppState.pxPerMM = data.pxPerMM;
                        AppState.pixelsPerInch = data.pxPerMM * 25.4;
                    }
                    console.log(`✅ Active 1:1 calibration loaded: ${data.pxPerMM.toFixed(2)} px/mm via ${data.method} (${data.date})`);
                    return true;
                }
            }
        } catch (e) {
            console.warn('Could not read calibration from localStorage:', e);
        }

        if (typeof AppState !== 'undefined') {
            AppState.isCalibrated = false;
            // Default baseline: 96 PPI = 3.7795 px/mm
            const dpr = window.devicePixelRatio || 1;
            AppState.pxPerMM = (96 * dpr) / 25.4;
            AppState.pixelsPerInch = 96 * dpr;
        }
        return false;
    },

    /**
     * Set active calibration method tab
     */
    setActiveMethod(method) {
        this.activeMethod = method;
        document.querySelectorAll('.cal-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.method === method);
        });
        document.querySelectorAll('.cal-method-pane').forEach(pane => {
            pane.style.display = (pane.id === `cal-pane-${method}`) ? 'block' : 'none';
        });

        if (method === 'ruler') {
            this.drawRuler();
        }
        this.updateActiveReadout();
    },

    /**
     * Compute px/mm for the active method
     */
    getActivePxPerMM() {
        if (this.activeMethod === 'bank_card') {
            return this.currentCardWidth / this.targetCardWidthMM;
        } else if (this.activeMethod === 'ruler') {
            return this.currentRulerWidth / this.targetRulerWidthMM;
        } else if (this.activeMethod === 'auto_detect') {
            const dpr = window.devicePixelRatio || 1;
            const ppi = (window.screen.width >= 2560) ? (110 * dpr) : (96 * dpr);
            return ppi / 25.4;
        }
        return 96 / 25.4;
    },

    /**
     * Get label of active method
     */
    methodText(label) {
        const map = { 'Bank Card (85.60 mm)': 'bank_card', 'Physical Ruler (100 mm)': 'ruler', 'Display Auto-Detect (Estimated)': 'auto_detect', 'Manual Calibration': 'manual' };
        return map[label] ? tr('cal.method.' + map[label], label) : label;
    },

    getActiveMethodLabel() {
        if (this.activeMethod === 'bank_card') return 'Bank Card (85.60 mm)';
        if (this.activeMethod === 'ruler') return 'Physical Ruler (100 mm)';
        if (this.activeMethod === 'auto_detect') return 'Display Auto-Detect (Estimated)';
        return 'Manual Calibration';
    },

    /**
     * Update readout in modal
     */
    updateActiveReadout() {
        const readout = document.getElementById('cal-active-readout');
        if (readout) {
            const pxPerMM = this.getActivePxPerMM();
            readout.innerHTML = tr('cal.readout', 'Method: <strong>{method}</strong> &bull; Scale: <strong>{scale} px/mm</strong> ({ppi} PPI)', { method: this.methodText(this.getActiveMethodLabel()), scale: pxPerMM.toFixed(2), ppi: (pxPerMM * 25.4).toFixed(1) });
        }
    },

    /**
     * Save calibration to localStorage and AppState
     */
    saveCalibration() {
        const pxPerMM = Number(this.getActivePxPerMM().toFixed(4));
        const method = this.getActiveMethodLabel();
        const date = this.getLocalDateString();
        const viewportWidth = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio || 1;

        const payload = {
            isCalibrated: true,
            pxPerMM: pxPerMM,
            pixelsPerInch: Number((pxPerMM * 25.4).toFixed(2)),
            method: method,
            date: date,
            viewportWidth: viewportWidth,
            devicePixelRatio: devicePixelRatio
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn('Failed to save calibration to localStorage:', e);
        }

        if (typeof AppState !== 'undefined') {
            AppState.isCalibrated = true;
            AppState.pxPerMM = pxPerMM;
            AppState.pixelsPerInch = pxPerMM * 25.4;
        }

        this.isStale = false;
        this.staleReason = '';
        this.currentCalibration = payload;

        this.updateAllHonestyBadges();
        this.closeModal();

        // Refresh views
        if (typeof VisualizerModule !== 'undefined' && typeof VisualizerModule.render === 'function') {
            VisualizerModule.render();
        }
        if (typeof CurvedBarbellCalculator !== 'undefined' && typeof CurvedBarbellCalculator.calculate === 'function') {
            CurvedBarbellCalculator.calculate();
        }
        if (typeof IndustrialBarbellCalculator !== 'undefined' && typeof IndustrialBarbellCalculator.calculate === 'function') {
            IndustrialBarbellCalculator.calculate();
        }

        this.showSuccessToast(`Calibration Saved: ${pxPerMM.toFixed(2)} px/mm via ${method}`);
    },

    /**
     * Update banner & header badges
     */
    updateAllHonestyBadges() {
        const banner = document.getElementById('calibration-banner');
        if (!banner) return;

        const bannerText = banner.querySelector('.calibration-banner__text');
        const bannerBtn = banner.querySelector('#calibrate-button');

        if (this.isStale && this.currentCalibration) {
            banner.className = 'calibration-banner calibration-banner--stale';
            banner.style.display = 'block';
            if (bannerText) {
                bannerText.innerHTML = tr('cal.bannerStale', '<strong>⚠️ Calibration out of date:</strong> {reason}. The preview is no longer at true scale.', { reason: this.staleReason });
            }
            if (bannerBtn) {
                bannerBtn.textContent = tr('cal.btnRedo', '🔄 Redo calibration');
                bannerBtn.onclick = () => this.openModal();
            }
        } else if (AppState && AppState.isCalibrated && this.currentCalibration) {
            banner.className = 'calibration-banner calibration-banner--calibrated';
            banner.style.display = 'block';
            if (bannerText) {
                bannerText.innerHTML = tr('cal.bannerCalibrated', '<strong>✅ Calibrated 1:1:</strong> scale <strong>{scale} px/mm</strong>, set with <em>{method}</em> on {date}.', { scale: this.currentCalibration.pxPerMM.toFixed(2), method: this.methodText(this.currentCalibration.method), date: this.currentCalibration.date });
            }
            if (bannerBtn) {
                bannerBtn.textContent = tr('cal.btnRedo', '🔄 Redo calibration');
                bannerBtn.onclick = () => this.openModal();
            }
        } else {
            banner.className = 'calibration-banner';
            banner.style.display = 'block';
            if (bannerText) {
                bannerText.innerHTML = tr('cal.bannerApprox', '<strong>⚠️ Approximate preview:</strong> the display is not calibrated. Calibrate against an 85.60 mm bank card for true 1:1 scale.');
            }
            if (bannerBtn) {
                bannerBtn.textContent = tr('cal.btnCalibrate', '📏 Calibrate display');
                bannerBtn.onclick = () => this.openModal();
            }
        }

        // Header status indicator
        const indicator = document.getElementById('calibration-status-indicator');
        if (indicator) {
            if (this.isStale) {
                indicator.className = 'scale-status-badge scale-status-badge--approx';
                indicator.textContent = tr('cal.indStale', '⚠️ Calibration out of date: click to redo');
                indicator.title = this.staleReason;
            } else if (AppState && AppState.isCalibrated && this.currentCalibration) {
                indicator.className = 'scale-status-badge scale-status-badge--calibrated';
                indicator.textContent = tr('cal.indOk', '✅ Calibrated ({scale} px/mm • {method})', { scale: this.currentCalibration.pxPerMM.toFixed(2), method: this.methodText(this.currentCalibration.method) });
                indicator.title = tr('cal.indOkTitle', 'Calibrated on {date}. Click to redo.', { date: this.currentCalibration.date });
            } else {
                indicator.className = 'scale-status-badge scale-status-badge--approx';
                indicator.textContent = tr('cal.indNone', '⚠️ Not calibrated (approximate): click to calibrate');
                indicator.title = tr('cal.uncalTitle', 'The screen is not calibrated. Click to calibrate against an 85.60 mm bank card.');
            }
        }

        // Toolbar status indicator
        const tbBadge = document.getElementById('toolbar-scale-badge');
        const tbText = document.getElementById('toolbar-scale-text');
        if (tbBadge) {
            if (this.isStale) {
                tbBadge.className = 'tool-utility-bar__badge tool-utility-bar__badge--stale';
                if (tbText) tbText.textContent = (window.i18n ? window.i18n.t('common.approximate') : 'Approximate');
                tbBadge.title = this.staleReason;
            } else if (AppState && AppState.isCalibrated && this.currentCalibration) {
                tbBadge.className = 'tool-utility-bar__badge tool-utility-bar__badge--calibrated';
                if (tbText) tbText.textContent = (window.i18n ? window.i18n.t('common.calibrated') : 'Calibrated (1:1 Active)');
                tbBadge.title = tr('cal.badgeOkTitle', 'Calibrated 1:1 ({scale} px/mm). Click to calibrate again.', { scale: this.currentCalibration.pxPerMM.toFixed(2) });
            } else {
                tbBadge.className = 'tool-utility-bar__badge tool-utility-bar__badge--approx';
                if (tbText) tbText.textContent = (window.i18n ? window.i18n.t('common.approximate') : 'Approximate');
                tbBadge.title = tr('cal.uncalTitle', 'The screen is not calibrated. Click to calibrate against an 85.60 mm bank card.');
            }
        }
    },

    /**
     * Open calibration modal
     */
    openModal() {
        if (!this.modal) {
            this.modal = document.getElementById('calibration-modal');
        }
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.setActiveMethod(this.activeMethod);
            if (this.cardSlider) {
                this.updateCardSize(parseInt(this.cardSlider.value, 10) || 100);
            }
        }
    },

    /**
     * Close calibration modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    },

    /**
     * Update card mockup dimensions
     */
    updateCardSize(percentage) {
        const baseWidth = 320;
        const baseHeight = 200;
        this.currentCardWidth = (baseWidth * percentage) / 100;
        const currentHeight = (baseHeight * percentage) / 100;

        const cardElement = document.querySelector('.card-mockup');
        if (cardElement) {
            cardElement.style.width = `${this.currentCardWidth}px`;
            cardElement.style.height = `${currentHeight}px`;
        }

        const sizeDisplay = document.getElementById('card-size-display');
        if (sizeDisplay) {
            sizeDisplay.textContent = `${this.targetCardWidthMM.toFixed(1)} mm`;
        }

        this.updateActiveReadout();
    },

    /**
     * Update ruler mockup dimensions
     */
    updateRulerSize(percentage) {
        const baseWidth = 400;
        this.currentRulerWidth = (baseWidth * percentage) / 100;
        this.drawRuler();

        const sizeDisplay = document.getElementById('ruler-size-display');
        if (sizeDisplay) {
            sizeDisplay.textContent = `${this.targetRulerWidthMM} mm`;
        }

        this.updateActiveReadout();
    },

    /**
     * Draw 100 mm ruler
     */
    drawRuler() {
        const svg = document.getElementById('ruler-svg');
        if (!svg) return;

        svg.innerHTML = '';
        svg.setAttribute('width', this.currentRulerWidth);
        svg.setAttribute('height', 60);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 10);
        rect.setAttribute('width', this.currentRulerWidth);
        rect.setAttribute('height', 40);
        rect.setAttribute('fill', '#F5F5F5');
        rect.setAttribute('stroke', '#6B7280');
        rect.setAttribute('stroke-width', 2);
        svg.appendChild(rect);

        const pixelsPerMM = this.currentRulerWidth / this.targetRulerWidthMM;

        for (let mm = 0; mm <= this.targetRulerWidthMM; mm++) {
            const x = mm * pixelsPerMM;
            const isCM = mm % 10 === 0;
            const isHalfCM = mm % 5 === 0;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('x2', x);
            line.setAttribute('y1', 10);

            if (isCM) {
                line.setAttribute('y2', 35);
                line.setAttribute('stroke', '#1F2937');
                line.setAttribute('stroke-width', 2);

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', 48);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '10');
                text.setAttribute('font-family', 'sans-serif');
                text.setAttribute('fill', '#1F2937');
                text.textContent = mm / 10;
                svg.appendChild(text);
            } else if (isHalfCM) {
                line.setAttribute('y2', 28);
                line.setAttribute('stroke', '#4B5563');
                line.setAttribute('stroke-width', 1.5);
            } else {
                line.setAttribute('y2', 22);
                line.setAttribute('stroke', '#9CA3AF');
                line.setAttribute('stroke-width', 1);
            }

            svg.appendChild(line);
        }
    },

    /**
     * Auto detect PPI based on screen resolution and DPR
     */
    autoDetectPPI() {
        const dpr = window.devicePixelRatio || 1;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        let detectedPPI = 96 * dpr;
        if (screenWidth >= 2560) {
            detectedPPI = 110 * dpr;
        }

        const resultElement = document.getElementById('auto-detect-result');
        if (resultElement) {
            resultElement.innerHTML = tr('cal.detected', 'Detected screen: <strong>{w}×{h} (DPR {dpr})</strong> &bull; Scale: <strong>{scale} px/mm</strong> ({ppi} PPI)', { w: screenWidth, h: screenHeight, dpr: dpr, scale: (detectedPPI / 25.4).toFixed(2), ppi: detectedPPI.toFixed(1) });
        }

        this.updateActiveReadout();
    },

    /**
     * Display a temporary toast message
     */
    showSuccessToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'calibration-success';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.background = 'var(--color-surface)';
        toast.style.border = '2px solid var(--color-gold)';
        toast.style.padding = '12px 18px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.zIndex = '9999';
        toast.style.color = 'var(--color-text)';
        toast.style.fontWeight = '600';
        toast.style.fontSize = '0.875rem';
        toast.textContent = msg;

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3500);
    },

    /**
     * Bind DOM events
     */
    bindEvents() {
        const calibrateBtn = document.getElementById('calibrate-button');
        if (calibrateBtn) {
            calibrateBtn.addEventListener('click', () => this.openModal());
        }

        const statusIndicator = document.getElementById('calibration-status-indicator');
        if (statusIndicator) {
            statusIndicator.addEventListener('click', () => this.openModal());
        }

        const tbBtn = document.getElementById('toolbar-calibrate-btn');
        if (tbBtn) {
            tbBtn.addEventListener('click', () => this.openModal());
        }

        const tbBadge = document.getElementById('toolbar-scale-badge');
        if (tbBadge) {
            tbBadge.addEventListener('click', () => this.openModal());
        }

        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        const overlay = this.modal?.querySelector('.modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        if (this.cardSlider) {
            this.cardSlider.addEventListener('input', (e) => {
                this.updateCardSize(parseInt(e.target.value, 10));
            });
        }

        if (this.rulerSlider) {
            this.rulerSlider.addEventListener('input', (e) => {
                this.updateRulerSize(parseInt(e.target.value, 10));
            });
        }

        const autoDetectBtn = document.getElementById('auto-detect-ppi');
        if (autoDetectBtn) {
            autoDetectBtn.addEventListener('click', () => this.autoDetectPPI());
        }

        const saveBtn = document.getElementById('save-calibration');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCalibration());
        }

        const skipBtn = document.getElementById('skip-calibration');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.closeModal());
        }

        // Method tabs in modal
        document.querySelectorAll('.cal-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveMethod(btn.dataset.method);
            });
        });
    }
};

if (typeof window !== 'undefined') {
    window.CalibrationSystem = CalibrationSystem;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalibrationSystem;
}
