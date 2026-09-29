/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Printable Client Fit Card Module
 * Poli International Widget Suite
 *
 * Requirements addressed:
 * - Rule 1: "Client-entered sizing record — for piercer sizing consultation" (No unverified claims)
 * - Rule 3: All inputs start empty by default
 * - Requirement C: 50 mm printed reference bar with exact calibration notice
 * - Requirement E: Size summary plain text clipboard copy
 * - Requirement F: Direct export to Saved Collection
 * - Ban 19: Strictly local calendar dates (never UTC)
 */
(function () {
    'use strict';

    function getLocalDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return '—';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const d = new Date(year, month, day);
            return d.toLocaleDateString((window.i18n && window.i18n.getLocale && window.i18n.getLocale()) || undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return dateStr;
    }

    const PRESETS = {
        rook: {
            placement: 'Rook (Antihelix Cartilage)',
            measurement: '6.5 mm tissue thickness',
            gauge: '16g (1.2 mm)',
            freshLength: '8.0 mm (curved post)',
            healedLength: '6.5 mm (downsized target)',
            ballSize: '3.0 mm ends',
            notes: 'Initial swelling margin. Downsize assessment in 6–8 weeks.'
        },
        industrial: {
            placement: 'Scapha-to-Helix Industrial Canal',
            measurement: '34.0 mm anatomical span',
            gauge: '14g (1.6 mm)',
            freshLength: '38.0 mm (straight post)',
            healedLength: '35.0 mm (fitted target)',
            ballSize: '4.0 mm balls',
            notes: 'Zero sleep pressure on canal. Downsize review at 8–10 weeks.'
        },
        navel: {
            placement: 'Upper Navel Rim',
            measurement: '10.0 mm tissue depth',
            gauge: '14g (1.6 mm)',
            freshLength: '12.0 mm (curved post)',
            healedLength: '10.0 mm (standard curve)',
            ballSize: '5.0 mm / 8.0 mm',
            notes: 'High mobility site. Inspect for migration and assess downsize at 8 weeks.'
        },
        eyebrow: {
            placement: 'Vertical Eyebrow Ridge',
            measurement: '8.0 mm tissue pinch',
            gauge: '16g (1.2 mm)',
            freshLength: '10.0 mm (curved barbell)',
            healedLength: '8.0 mm (fitted curve)',
            ballSize: '3.0 mm spikes/balls',
            notes: 'Surface tension watch. Downsize prompt at 5–6 weeks.'
        }
    };

    const FitCardModule = {
        previewMode: 'paper', // 'paper' or 'theme'
        data: {
            // Rule 3: Start completely empty
            studio: '',
            piercer: '',
            client: '',
            placement: '',
            measurement: '',
            gauge: '',
            freshLength: '',
            healedLength: '',
            ballSize: '',
            date: getLocalDateString(),
            notes: ''
        },

        init() {
            this.bindEvents();
            this.render();
            console.log('🖨️ FitCardModule initialized (Rule 3 compliant: starts empty)');
        },

        bindEvents() {
            const printBtn = document.getElementById('fit-card-print-btn');
            if (printBtn) {
                printBtn.addEventListener('click', () => {
                    window.print();
                });
            }

            const copySummaryBtn = document.getElementById('fit-card-copy-summary-btn');
            if (copySummaryBtn) {
                copySummaryBtn.addEventListener('click', () => {
                    this.copySizeSummary();
                });
            }

            const saveCollectionBtn = document.getElementById('fit-card-save-collection-btn');
            if (saveCollectionBtn) {
                saveCollectionBtn.addEventListener('click', () => {
                    this.saveToCollection();
                });
            }

            const form = document.getElementById('fit-card-form');
            if (form) {
                form.addEventListener('input', (e) => {
                    const field = e.target.name;
                    if (field && this.data.hasOwnProperty(field)) {
                        this.data[field] = e.target.value;
                        this.renderCardPreview();
                    }
                });
            }

            const resetBtn = document.getElementById('fit-card-reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.reset();
                });
            }

            // Preset buttons
            document.querySelectorAll('.fit-preset-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const presetKey = btn.dataset.preset;
                    if (presetKey && PRESETS[presetKey]) {
                        this.applyPreset(PRESETS[presetKey]);
                    }
                });
            });

            // Live Print Preview Toolbar Toggles
            const paperBtn = document.getElementById('fit-paper-mode-btn');
            const themeBtn = document.getElementById('fit-theme-mode-btn');

            if (paperBtn && themeBtn) {
                paperBtn.addEventListener('click', () => {
                    this.previewMode = 'paper';
                    paperBtn.classList.add('active');
                    themeBtn.classList.remove('active');
                    const renderWrap = document.getElementById('fit-card-render');
                    if (renderWrap) {
                        renderWrap.className = 'fit-card-render--paper';
                    }
                });

                themeBtn.addEventListener('click', () => {
                    this.previewMode = 'theme';
                    themeBtn.classList.add('active');
                    paperBtn.classList.remove('active');
                    const renderWrap = document.getElementById('fit-card-render');
                    if (renderWrap) {
                        renderWrap.className = 'fit-card-render--theme';
                    }
                });
            }
        },

        copySizeSummary() {
            const placement = this.data.placement || 'Not specified';
            const gauge = this.data.gauge || 'Not specified';
            const fresh = this.data.freshLength || 'Not specified';
            const healed = this.data.healedLength || 'Not specified';
            const span = this.data.measurement || 'Not specified';
            const date = this.data.date || getLocalDateString();

            const summary = `Placement: ${placement} | Gauge: ${gauge} | Fresh Length: ${fresh} | Healed Length: ${healed} | Measured Span: ${span} | Date: ${date}`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(summary).then(() => {
                    const btn = document.getElementById('fit-card-copy-summary-btn');
                    if (btn) {
                        const orig = btn.textContent;
                        btn.textContent = tr('common.summaryCopied', '✓ Summary copied');
                        setTimeout(() => { btn.textContent = orig; }, 2500);
                    }
                });
            } else if (typeof JewelleryCollectionModule !== 'undefined') {
                JewelleryCollectionModule.copyToClipboard(summary, '✓ Size summary copied to clipboard!');
            }
        },

        saveToCollection() {
            if (typeof JewelleryCollectionModule !== 'undefined') {
                JewelleryCollectionModule.addPiece({
                    placement: this.data.placement || 'Client Sizing Record',
                    name: 'Barbell / Ring',
                    gauge: this.data.gauge || '16g (1.2 mm)',
                    length: this.data.freshLength || this.data.healedLength || '',
                    ballSize: this.data.ballSize || '',
                    material: 'ASTM F-136 Titanium'
                });
            }
        },

        applyPreset(presetData) {
            Object.assign(this.data, presetData);
            if (!this.data.date) {
                this.data.date = getLocalDateString();
            }
            this.syncFormFields();
            this.renderCardPreview();
        },

        setData(newData) {
            Object.assign(this.data, newData);
            if (!this.data.date) {
                this.data.date = getLocalDateString();
            }
            this.syncFormFields();
            this.renderCardPreview();
        },

        syncFormFields() {
            const form = document.getElementById('fit-card-form');
            if (!form) return;

            Object.keys(this.data).forEach((key) => {
                const input = form.elements[key];
                if (input) {
                    input.value = this.data[key] || '';
                }
            });
        },

        render() {
            this.syncFormFields();
            this.renderCardPreview();
        },

        reset() {
            this.data = {
                studio: '',
                piercer: '',
                client: '',
                placement: '',
                measurement: '',
                gauge: '',
                freshLength: '',
                healedLength: '',
                ballSize: '',
                date: getLocalDateString(),
                notes: ''
            };
            this.syncFormFields();
            this.renderCardPreview();
        },

        renderCardPreview() {
            const previewEl = document.getElementById('fit-card-render');
            if (!previewEl) return;

            const formattedDate = formatDisplayDate(this.data.date);

            previewEl.innerHTML = `
                <div class="fit-card-sheet" id="printable-fit-card">
                    <header class="fit-card-header">
                        <div class="fit-card-brand">
                            <span class="fit-card-logo-badge">POLI</span>
                            <div>
                                <h3 class="fit-card-title">${tr('fitCard.cardTitle', 'Client Piercing Fit Card')}</h3>
                                <p class="fit-card-subtitle">${tr('fitCard.subtitle', 'Client-entered sizing record — for piercer sizing consultation')}</p>
                            </div>
                        </div>
                        <div class="fit-card-date-badge">
                            <span class="fit-card-meta-lbl">${tr('fitCard.dateLabel', 'Date:')}</span>
                            <span class="fit-card-meta-val">${this.escape(formattedDate)}</span>
                        </div>
                    </header>

                    <!-- Requirement C: Physical Print Reference Bar -->
                    <div class="fit-card-ref-bar-wrap">
                        <div class="fit-card-ref-bar-scale">
                            <span>0 mm</span>
                            <span>25 mm</span>
                            <span>50 mm</span>
                        </div>
                        <div class="fit-card-scale-bar"></div>
                        <p class="fit-card-scale-desc">
                            ${tr('fitCard.scaleDesc', '<strong>Verify print scale:</strong> this bar must measure exactly 50 mm with a ruler.')}
                        </p>
                    </div>

                    <div class="fit-card-client-bar">
                        <div class="fit-card-field-block">
                            <span class="fit-card-label">${tr('fitCard.studioName', 'Studio Name')}</span>
                            <span class="fit-card-val">${this.escape(this.data.studio || '—')}</span>
                        </div>
                        <div class="fit-card-field-block">
                            <span class="fit-card-label">${tr('fitCard.clientName', 'Client Name')}</span>
                            <span class="fit-card-val">${this.escape(this.data.client || '—')}</span>
                        </div>
                        <div class="fit-card-field-block">
                            <span class="fit-card-label">${tr('fitCard.placement', 'Placement')}</span>
                            <span class="fit-card-val fit-card-val--highlight">${this.escape(this.data.placement || '—')}</span>
                        </div>
                    </div>

                    <div class="fit-card-measurements-grid">
                        <div class="fit-card-cell">
                            <span class="fit-card-cell-label">${tr('fitCard.lbl.span', 'Measured span')}</span>
                            <span class="fit-card-cell-number">${this.escape(this.data.measurement || '—')}</span>
                            <span class="fit-card-cell-hint">${tr('fitCard.hint.span', 'Tissue span')}</span>
                        </div>
                        <div class="fit-card-cell">
                            <span class="fit-card-cell-label">${tr('fitCard.lbl.gauge', 'Wire gauge')}</span>
                            <span class="fit-card-cell-number">${this.escape(this.data.gauge || '—')}</span>
                            <span class="fit-card-cell-hint">${tr('fitCard.hint.gauge', 'Bar diameter')}</span>
                        </div>
                        <div class="fit-card-cell fit-card-cell--fresh">
                            <span class="fit-card-cell-label">${tr('fitCard.lbl.fresh', 'Initial length')}</span>
                            <span class="fit-card-cell-number fit-card-cell-number--fresh">${this.escape(this.data.freshLength || '—')}</span>
                            <span class="fit-card-cell-hint">${tr('fitCard.hint.fresh', 'With swelling clearance')}</span>
                        </div>
                        <div class="fit-card-cell fit-card-cell--healed">
                            <span class="fit-card-cell-label">${tr('fitCard.lbl.healed', 'Healed length (downsize)')}</span>
                            <span class="fit-card-cell-number fit-card-cell-number--healed">${this.escape(this.data.healedLength || '—')}</span>
                            <span class="fit-card-cell-hint">${tr('fitCard.hint.healed', 'Target once healed')}</span>
                        </div>
                    </div>

                    <div class="fit-card-details-row">
                        <div class="fit-card-field-block">
                            <span class="fit-card-label">${tr('fitCard.lbl.ball', 'Ball / end size')}</span>
                            <span class="fit-card-val">${this.escape(this.data.ballSize || '—')}</span>
                        </div>
                        <div class="fit-card-field-block fit-card-field-block--wide">
                            <span class="fit-card-label">${tr('fitCard.lbl.notes', 'Fitting &amp; downsize notes')}</span>
                            <span class="fit-card-val">${this.escape(this.data.notes || tr('fitCard.none', 'None'))}</span>
                        </div>
                    </div>

                    <div class="fit-card-notice-box">
                        <div class="fit-card-notice-icon">ℹ️</div>
                        <div class="fit-card-notice-text">
                            ${tr('fitCard.notice', '<strong>Initial jewelry is longer to allow for swelling and is shortened once the piercing has healed.</strong><br>For downsize timing and aftercare, see')}
                            <a href="https://poliinternational.com/aftercare-schedule-generator/" target="_top" class="fit-card-link">https://poliinternational.com/aftercare-schedule-generator/</a>
                        </div>
                    </div>

                    <footer class="fit-card-footer">
                        <div class="fit-card-sign-col">
                            <div class="fit-card-sign-line"></div>
                            <span class="fit-card-sign-label">Piercer Verification</span>
                        </div>
                        <div class="fit-card-sign-col">
                            <div class="fit-card-sign-line"></div>
                            <span class="fit-card-sign-label">Client Acknowledgment</span>
                        </div>
                    </footer>
                </div>
            `;
        },

        escape(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    };

    window.FitCardModule = FitCardModule;
})();
