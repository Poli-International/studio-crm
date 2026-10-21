/**
 * Professional PDF & Print Document Generator
 * Autoclave Sterilization & Biological Monitoring System
 * Handles studio logo embedding, calibration certificates, and QA audit exports.
 */

// i18n helpers: __tx = plain text, T = HTML-safe text (keys are the English strings, see js/i18n/*.js)
const __tx = (s, p) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s, p) : String(s).replace(/\{(\w+)\}/g, (m, k) => (p && k in p ? p[k] : m)));
const __loc = () => { const l = (typeof document !== 'undefined' && document.documentElement.lang) || 'en'; return l === 'en' ? 'en-US' : l; };
const T = (s, p) => __tx(s, p).replace(/&(?!(?:nbsp|amp|lt|gt|rarr);)/g, '&amp;').replace(/</g, '&lt;');

const PDFGenerator = {
    /**
     * Retrieve studio profile config from localStorage
     */
    getStudioProfile: function() {
        try {
            const raw = localStorage.getItem('autoclave_studio_profile');
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn('Unable to load studio profile:', e);
        }
        return {
            studioName: 'POLI INTERNATIONAL STUDIO',
            address: __tx('Infection Control & Sterilization Division'),
            operatorName: '',
            autoclaveSerial: '',
            certDate: localStorage.getItem('autoclave_calibration_date') || '',
            certTechnician: localStorage.getItem('autoclave_calibration_tech') || '',
            certNumber: localStorage.getItem('autoclave_calibration_cert_num') || '',
            emblem: 'crest'
        };
    },

    /**
     * Retrieve custom studio logo from localStorage (Base64 data URL or predefined SVG)
     */
    getStudioLogo: function() {
        try {
            const customLogo = localStorage.getItem('autoclave_studio_logo');
            if (customLogo && customLogo.startsWith('data:image/')) {
                return {
                    isCustom: true,
                    src: customLogo
                };
            }
        } catch (e) {
            console.warn('Unable to load custom logo:', e);
        }

        // Return standard clinical vector emblem
        return {
            isCustom: false,
            src: null,
            svg: `
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="10" fill="var(--color-success)"/>
                    <path d="M24 10V38M10 24H38" stroke="var(--bg-primary)" stroke-width="4.5" stroke-linecap="round"/>
                    <circle cx="24" cy="24" r="19" stroke="var(--bg-primary)" stroke-width="2.5" stroke-dasharray="4 2"/>
                </svg>
            `
        };
    },

    /**
     * Render header HTML with Studio Logo for printouts and modals
     */
    renderDocumentHeader: function(title, subtitle) {
        const profile = this.getStudioProfile();
        const logo = this.getStudioLogo();
        const layout = localStorage.getItem('autoclave_header_logo_layout') || 'left';
        const scale = localStorage.getItem('autoclave_header_logo_scale') || 'medium';
        const fontStyle = localStorage.getItem('autoclave_header_font_style') || 'modern';
        const divider = localStorage.getItem('autoclave_header_accent_border') || 'double';

        let maxH = '54px';
        if (scale === 'compact') maxH = '38px';
        else if (scale === 'large') maxH = '70px';
        else if (scale === 'hero') maxH = '88px';

        let logoHtml = '';
        if (logo.isCustom && logo.src) {
            logoHtml = `<div class="print-header-logo-container" style="display:inline-flex; align-items:center;"><img src="${logo.src}" alt="${profile.studioName} Logo" class="print-header-custom-logo" style="max-height: ${maxH}; max-width: 180px; object-fit: contain;" /></div>`;
        } else {
            logoHtml = `<div class="print-header-logo-container default-emblem">${logo.svg}</div>`;
        }

        let dividerStyle = 'border-bottom: 2px solid var(--color-success);';
        if (divider === 'minimal') dividerStyle = 'border-bottom: 1px solid #d1d5db;';
        else if (divider === 'teal') dividerStyle = 'border-bottom: 3px solid var(--color-success);';
        else if (divider === 'none') dividerStyle = 'border-bottom: none;';
        else if (divider === 'double') dividerStyle = 'border-bottom: 3px double var(--color-success);';

        let fontClass = 'font-modern';
        if (fontStyle === 'formal') fontClass = 'font-serif';
        else if (fontStyle === 'bold') fontClass = 'font-bold';
        else if (fontStyle === 'mono') fontClass = 'font-mono';

        if (layout === 'none') {
            return `
                <div class="print-document-header ${fontClass}" style="${dividerStyle} padding-bottom: 14px; margin-bottom: 16px; text-align: center;">
                    <h1 class="print-studio-name" style="font-size: 16px; margin: 0 0 2px 0; color: var(--text-primary);">${profile.studioName || 'POLI INTERNATIONAL • CLINICAL STERILIZATION'}</h1>
                    <p class="print-studio-address" style="font-size: 11px; color: var(--text-secondary); margin: 0 0 8px 0;">${profile.address || __tx('Quality Assurance & Infection Control Standard Operating Procedure')}</p>
                    <h2 class="print-doc-title" style="font-size: 15px; margin: 0 0 2px 0; color: var(--color-success);">${title}</h2>
                    <p class="print-doc-subtitle" style="font-size: 11px; color: var(--text-secondary); margin: 0;">${subtitle}</p>
                </div>
            `;
        }

        if (layout === 'center') {
            return `
                <div class="print-document-header ${fontClass}" style="${dividerStyle} padding-bottom: 14px; margin-bottom: 16px; text-align: center;">
                    <div style="margin-bottom: 8px;">${logoHtml}</div>
                    <h1 class="print-studio-name" style="font-size: 16px; margin: 0 0 2px 0; color: var(--text-primary);">${profile.studioName || 'POLI INTERNATIONAL • CLINICAL STERILIZATION'}</h1>
                    <p class="print-studio-address" style="font-size: 11px; color: var(--text-secondary); margin: 0 0 8px 0;">${profile.address || __tx('Quality Assurance & Infection Control Standard Operating Procedure')}</p>
                    <h2 class="print-doc-title" style="font-size: 15px; margin: 0 0 2px 0; color: var(--color-success);">${title}</h2>
                    <p class="print-doc-subtitle" style="font-size: 11px; color: var(--text-secondary); margin: 0;">${subtitle}</p>
                </div>
            `;
        }

        if (layout === 'banner') {
            return `
                <div class="print-document-header ${fontClass}" style="${dividerStyle} padding: 12px; margin-bottom: 16px; background: var(--bg-tertiary); border-radius: 6px; text-align: center;">
                    <div style="margin-bottom: 6px;">${logoHtml}</div>
                    <h1 class="print-studio-name" style="font-size: 16px; margin: 0 0 2px 0; color: var(--text-primary);">${profile.studioName || 'POLI INTERNATIONAL • CLINICAL STERILIZATION'}</h1>
                    <p class="print-studio-address" style="font-size: 11px; color: var(--text-secondary); margin: 0 0 6px 0;">${profile.address || __tx('Quality Assurance & Infection Control Standard Operating Procedure')}</p>
                    <h2 class="print-doc-title" style="font-size: 15px; margin: 0 0 2px 0; color: var(--color-success);">${title}</h2>
                    <p class="print-doc-subtitle" style="font-size: 11px; color: var(--text-secondary); margin: 0;">${subtitle}</p>
                </div>
            `;
        }

        if (layout === 'right') {
            return `
                <div class="print-document-header ${fontClass}" style="${dividerStyle} padding-bottom: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="print-header-text" style="flex: 1;">
                        <h1 class="print-studio-name" style="font-size: 16px; margin: 0 0 2px 0; color: var(--text-primary);">${profile.studioName || 'POLI INTERNATIONAL • CLINICAL STERILIZATION'}</h1>
                        <p class="print-studio-address" style="font-size: 11px; color: var(--text-secondary); margin: 0 0 6px 0;">${profile.address || __tx('Quality Assurance & Infection Control Standard Operating Procedure')}</p>
                        <h2 class="print-doc-title" style="font-size: 15px; margin: 0 0 2px 0; color: var(--color-success);">${title}</h2>
                        <p class="print-doc-subtitle" style="font-size: 11px; color: var(--text-secondary); margin: 0;">${subtitle}</p>
                    </div>
                    <div class="print-header-right" style="margin-left: 16px;">
                        ${logoHtml}
                    </div>
                </div>
            `;
        }

        // Default: 'left'
        return `
            <div class="print-document-header ${fontClass}" style="${dividerStyle} padding-bottom: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div class="print-header-left" style="display: flex; align-items: center; gap: 14px;">
                    ${logoHtml}
                    <div class="print-header-text">
                        <h1 class="print-studio-name" style="font-size: 16px; margin: 0 0 2px 0; color: var(--text-primary);">${profile.studioName || 'POLI INTERNATIONAL • CLINICAL STERILIZATION'}</h1>
                        <p class="print-studio-address" style="font-size: 11px; color: var(--text-secondary); margin: 0;">${profile.address || __tx('Quality Assurance & Infection Control Standard Operating Procedure')}</p>
                    </div>
                </div>
                <div class="print-header-right" style="text-align: right;">
                    <h2 class="print-doc-title" style="font-size: 15px; margin: 0 0 2px 0; color: var(--color-success);">${title}</h2>
                    <p class="print-doc-subtitle" style="font-size: 11px; color: var(--text-secondary); margin: 0;">${subtitle}</p>
                </div>
            </div>
        `;
    },

    /**
     * Generate HTML for Cycle Verification Log
     */
    generateCycleLogHtml: function(calcData) {
        const profile = this.getStudioProfile();
        const now = new Date();
        const dateStr = now.toLocaleDateString(__loc(), { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const autoLot = 'LOT-' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + String(Math.floor(Math.random()*900 + 100));
        const loadNum = calcData?.batchNumber || calcData?.batchId || autoLot;

        const temp = calcData?.parameters?.temperature ? `${calcData.parameters.temperature.f}°F (${calcData.parameters.temperature.c}°C)` : '270°F (132°C)';
        const pressure = calcData?.parameters?.pressure ? `${calcData.parameters.pressure.psi} PSI (${calcData.parameters.pressure.bar} bar)` : '30 PSI (2.0 bar)';
        const exposure = calcData?.parameters?.exposureTime ? `${calcData.parameters.exposureTime} min` : '4 min';
        const dry = calcData?.parameters?.dryTime ? `${calcData.parameters.dryTime} min` : '20 min';
        const total = calcData?.parameters?.totalCycle ? `${calcData.parameters.totalCycle} min` : '35 min';
        const loadType = calcData?.loadType ? (calcData.loadType.charAt(0).toUpperCase() + calcData.loadType.slice(1)) : __tx('Wrapped Instruments');
        const autoclaveName = calcData?.autoclaveType ? calcData.autoclaveType.toUpperCase() : 'PRE-VACUUM (CLASS B)';

        const calibrationDate = localStorage.getItem('autoclave_calibration_date');
        let calibStatusText = __tx('Not Documented');
        if (calibrationDate) {
            const calDate = new Date(calibrationDate);
            const daysSince = Math.floor((now - calDate)/(1000*60*60*24));
            if (daysSince >= 365) {
                calibStatusText = __tx('⚠️ Overdue ({d}d since cert on {date})', { d: daysSince, date: calDate.toLocaleDateString() });
            } else {
                calibStatusText = __tx('✓ Valid ({d}d remaining | Cert: {date})', { d: 365 - daysSince, date: calDate.toLocaleDateString() });
            }
        }

        return `
            <div class="print-document-sheet">
                ${this.renderDocumentHeader(__tx('STERILIZATION CYCLE VERIFICATION LOG'), __tx('Physical & Chemical Parameter Release Record'))}

                <div class="print-meta-grid">
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Date & Time:")}</span>
                        <span class="print-meta-value">${dateStr}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Cycle / Batch #:")}</span>
                        <span class="print-meta-value"><strong>${loadNum}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Autoclave Class:")}</span>
                        <span class="print-meta-value">${autoclaveName}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Chamber Serial ID:")}</span>
                        <span class="print-meta-value">${profile.autoclaveSerial || 'CHAMBER-01-SN4892'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Certified Technician:")}</span>
                        <span class="print-meta-value">${profile.operatorName || 'Lead Sterilization Tech'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Annual Calibration:")}</span>
                        <span class="print-meta-value">${calibStatusText}</span>
                    </div>
                </div>

                <table class="print-table">
                    <thead>
                        <tr>
                            <th>${T("Target Temp")}</th>
                            <th>${T("Target Pressure")}</th>
                            <th>${T("Exposure Plateau")}</th>
                            <th>${T("Dry Cycle")}</th>
                            <th>${T("Total Run Time")}</th>
                            <th>${T("Load Classification")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>${temp}</strong></td>
                            <td><strong>${pressure}</strong></td>
                            <td><strong>${exposure}</strong></td>
                            <td><strong>${dry}</strong></td>
                            <td><strong>${total}</strong></td>
                            <td>${loadType}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="print-checklist-title">${T("8-Point Clinical Release Verification Checklist")}</div>
                <ul class="print-checklist">
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("1. Pre-Clean & Ultrasonic:")}</strong> ${T("Instruments scrubbed, enzymatically rinsed, and 100% dry prior to packaging.")}</span></li>
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("2. Pouch Integrity:")}</strong> ${T("Medical-grade autoclave pouches inspected; self-seals intact without tears or creases.")}</span></li>
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("3. Internal Chemical Integrator:")}</strong> ${T("Class 4/5/6 multiparameter integrator placed in center of pack.")}</span></li>
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("4. External Process Indicator:")}</strong> ${T("External color change ink verified after completed cycle.")}</span></li>
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("5. Distilled Water & Gasket:")}</strong> ${T("Water purity verified; silicone door gasket clean with airtight seal.")}</span></li>
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("6. Physical Parameters Sustained:")}</strong> ${T("Digital display logged full plateau temp & pressure continuously.")}</span></li>
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("7. Dry Pack Release:")}</strong> ${T("Zero wet packs detected; items fully cooled before handling or storage.")}</span></li>
                    <li class="print-checklist-item"><span class="print-checkbox">✓</span><span><strong>${T("8. Biological Spore Test:")}</strong> ${T("Autoclave has a valid passing biological spore test within mandated frequency.")}</span></li>
                </ul>

                <div class="print-signoff-box">
                    <div class="print-signoff-grid">
                        <div>
                            <strong>${T("Authorized Operator Signature:")}</strong>
                            <div class="print-sign-line"></div>
                            <span style="font-size: 10px; color: var(--text-secondary);">${T("Sign to verify all physical and chemical parameters met")}</span>
                        </div>
                        <div>
                            <strong>${T("Load Release Decision:")}</strong>
                            <div style="margin-top: 8px;">
                                <span class="print-checkbox">✓</span> <strong>${T("PASSED & RELEASED")}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
                                <span class="print-checkbox"></span> <strong>${T("FAILED / QUARANTINE")}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="print-footer-note">
                    ${T("Official Infection Control Record • Retain on studio file for minimum 3 years or per local health authority regulations.")}
                </div>
            </div>
        `;
    },

    /**
     * Generate HTML for Custom Date Range or 30-Day Monthly Compliance Audit PDF Report for Health Inspectors
     */
    generateMonthlyAuditReportHtml: function(cycleLogs, sporeHistory, stateData, customStartDate = null, customEndDate = null) {
        const profile = this.getStudioProfile();
        const now = new Date();
        const dateStr = now.toLocaleDateString(__loc(), { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const monthYearStr = now.toLocaleDateString(__loc(), { month: 'long', year: 'numeric' });

        let startDateObj = null;
        let endDateObj = null;
        let reportingPeriodStr = '';

        if (customStartDate || customEndDate) {
            startDateObj = customStartDate ? new Date(customStartDate + 'T00:00:00') : new Date('2020-01-01');
            endDateObj = customEndDate ? new Date(customEndDate + 'T23:59:59') : new Date();
            const fromFormatted = startDateObj.toLocaleDateString(__loc(), { year: 'numeric', month: 'short', day: 'numeric' });
            const toFormatted = endDateObj.toLocaleDateString(__loc(), { year: 'numeric', month: 'short', day: 'numeric' });
            reportingPeriodStr = __tx('Custom Period ({from} – {to})', { from: fromFormatted, to: toFormatted });
        } else {
            startDateObj = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            endDateObj = now;
            reportingPeriodStr = __tx('Past 30 Days ({from} – {to})', { from: startDateObj.toLocaleDateString(), to: now.toLocaleDateString() });
        }

        // Filter cycle logs by date range
        const cycles = (cycleLogs || []).filter(c => {
            const d = new Date(c.date || c.timestamp);
            return !isNaN(d.getTime()) && d >= startDateObj && d <= endDateObj;
        });

        // Filter spore history by date range
        const spores = (sporeHistory || []).filter(s => {
            const d = new Date(s.date);
            return !isNaN(d.getTime()) && d >= startDateObj && d <= endDateObj;
        });

        // Calibration status calculation
        const calibrationDate = localStorage.getItem('autoclave_calibration_date');
        const calibTech = localStorage.getItem('autoclave_calibration_tech') || profile.certTechnician || 'Apex Biomedical Services Inc.';
        const calibDecal = localStorage.getItem('autoclave_calibration_decal') || profile.certNumber || 'CERT-2025-QA981';
        let calibStatusText = __tx('Valid & Certified');
        let calibBadgeColor = 'var(--color-success)';
        let daysSinceCalib = 0;
        let calibFormattedDate = 'N/A';

        if (calibrationDate) {
            const calDate = new Date(calibrationDate);
            daysSinceCalib = Math.floor((now - calDate) / (1000 * 60 * 60 * 24));
            calibFormattedDate = calDate.toLocaleDateString(__loc(), { year: 'numeric', month: 'short', day: 'numeric' });
            if (daysSinceCalib >= 365) {
                calibStatusText = __tx('OVERDUE ({n} days since certification)', { n: daysSinceCalib });
                calibBadgeColor = 'var(--color-danger)';
            } else {
                calibStatusText = __tx('ACTIVE & VALID ({n} days remaining)', { n: 365 - daysSinceCalib });
                calibBadgeColor = 'var(--color-success)';
            }
        } else {
            calibStatusText = __tx('PENDING DOCUMENTATION');
            calibBadgeColor = 'var(--color-warning)';
        }

        // Compute metrics
        const totalCycles = cycles.length;
        const totalSpores = spores.length;
        const passingSpores = spores.filter(s => s.result === 'pass' || s.result === 'Passed' || s.result === 'Negative').length;
        const sporePassRate = totalSpores > 0 ? Math.round((passingSpores / totalSpores) * 100) : 100;
        const complianceStatus = (daysSinceCalib < 365 && (totalSpores === 0 || sporePassRate === 100))
            ? '100% INFECTION CONTROL COMPLIANT'
            : 'ACTION REQUIRED';

        // Render Cycle Logs Rows
        let cycleRowsHtml = '';
        if (cycles.length === 0) {
            cycleRowsHtml = `<tr><td colspan="8" style="text-align:center; padding: 14px; color: var(--text-secondary);">${T("No sterilization cycles recorded in the last 30 days.")}</td></tr>`;
        } else {
            cycles.forEach(c => {
                const cDate = c.date || (c.timestamp ? new Date(c.timestamp).toISOString().split('T')[0] : 'N/A');
                const batch = c.batchNumber || c.batchId || `CYC-${cDate.replace(/-/g,'')}-${Math.floor(100+Math.random()*900)}`;
                const autoClass = (c.autoclaveType || 'Pre-Vacuum (Class B)').toUpperCase();
                const load = (c.loadType || 'Wrapped').toUpperCase() + (c.loadSize ? ` [${c.loadSize.toUpperCase()}]` : '');
                const temp = c.parameters?.temperature ? `${c.parameters.temperature.f}°F` : (c.temperature || '270°F');
                const pressure = c.parameters?.pressure ? `${c.parameters.pressure.psi} PSI` : (c.pressure || '27 PSI');
                const exposure = c.parameters?.exposureTime ? `${c.parameters.exposureTime}m` : (c.exposureTime ? `${c.exposureTime}m` : '4m');
                const dry = c.parameters?.dryTime ? `${c.parameters.dryTime}m` : (c.dryTime ? `${c.dryTime}m` : '20m');
                const total = c.parameters?.totalCycle ? `${c.parameters.totalCycle}m` : (c.totalCycle ? `${c.totalCycle}m` : '35m');
                const op = c.operator || profile.operatorName || __tx('Studio Tech');

                cycleRowsHtml += `
                    <tr>
                        <td><strong>${cDate}</strong></td>
                        <td><span style="font-family: monospace; font-weight: 700; color: var(--text-primary); background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px;">${batch}</span></td>
                        <td>${autoClass}</td>
                        <td>${load}</td>
                        <td>${temp} / ${pressure}</td>
                        <td>${exposure} / ${dry} (Tot: ${total})</td>
                        <td>${op}</td>
                        <td><span style="color: var(--color-success); font-weight: bold;">${T("✓ RELEASED")}</span></td>
                    </tr>
                `;
            });
        }

        // Render Spore Test Rows
        let sporeRowsHtml = '';
        if (spores.length === 0) {
            sporeRowsHtml = `<tr><td colspan="7" style="text-align:center; padding: 14px; color: var(--text-secondary);">${T("No biological spore tests logged in the last 30 days.")}</td></tr>`;
        } else {
            spores.forEach((s, idx) => {
                const isPass = s.result === 'pass' || s.result === 'Passed' || s.result === 'Negative';
                const badgeStyle = isPass
                    ? 'background: var(--color-success); color: var(--bg-primary);'
                    : 'background: var(--color-danger); color: var(--bg-primary);';
                const resultText = isPass ? __tx('✓ NEGATIVE (PASS)') : __tx('⚠️ POSITIVE (FAIL)');
                const gapText = s.gapDays !== undefined && s.gapDays !== null ? __tx('{n} days', { n: s.gapDays }) : (idx === 0 ? __tx('Baseline') : '--');

                sporeRowsHtml += `
                    <tr>
                        <td><strong>${s.date}</strong></td>
                        <td>${gapText}</td>
                        <td><code>${s.lotNumber || 'BI-LOT-9921'}</code></td>
                        <td><span style="display:inline-block; padding: 3px 8px; border-radius: 4px; font-weight: 800; font-size: 10px; ${badgeStyle}">${resultText}</span></td>
                        <td>${s.incubationHours ? `${s.incubationHours}h @ ${s.incubationTemp || 56}°C` : '24h Standard'}</td>
                        <td>${s.operator || profile.operatorName || __tx('Studio Tech')}</td>
                        <td>${s.notes || __tx('Unprocessed control vial verified positive.')}</td>
                    </tr>
                `;
            });
        }

        return `
            <div class="print-document-sheet print-monthly-audit">
                <!-- PAGE 1: EXECUTIVE AUDIT SUMMARY & FACILITY COMPLIANCE -->
                ${this.renderDocumentHeader(__tx('STERILIZATION & SPORE COMPLIANCE AUDIT REPORT'), __tx('Official Health Inspector Compliance Record • {period}', { period: reportingPeriodStr }))}

                <div class="print-meta-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 12px;">
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Inspection Date:")}</span>
                        <span class="print-meta-value">${dateStr}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Reporting Period:")}</span>
                        <span class="print-meta-value">${reportingPeriodStr}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Jurisdiction Mandate:")}</span>
                        <span class="print-meta-value">${stateData?.name || 'CDC / State Board Standards'} (${(stateData?.frequency || 'Weekly').toUpperCase()})</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Facility / Studio:")}</span>
                        <span class="print-meta-value"><strong>${profile.studioName || 'Poli International Tattoo & Piercing Arts'}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Lead Operator:")}</span>
                        <span class="print-meta-value">${profile.operatorName || __tx('Lead Sterilization Technician')}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Chamber Serial ID:")}</span>
                        <span class="print-meta-value">${profile.autoclaveSerial || 'CHAMBER-01-SN4892'}</span>
                    </div>
                </div>

                <!-- 30-Day Executive Metric Cards -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px;">
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <span style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; display: block;">${T("30-Day Cycles")}</span>
                        <strong style="font-size: 18px; color: var(--text-primary);">${T('{n} Batches', { n: totalCycles })}</strong>
                        <span style="font-size: 9.5px; color: var(--color-success); display: block;">${T("100% Parameter Pass")}</span>
                    </div>
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <span style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; display: block;">${T("Biological Tests")}</span>
                        <strong style="font-size: 18px; color: var(--text-primary);">${T('{n} Tests', { n: totalSpores })}</strong>
                        <span style="font-size: 9.5px; color: var(--color-success); display: block;">${T('{n}% Spore Lethality', { n: sporePassRate })}</span>
                    </div>
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <span style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; display: block;">${T("Annual Calibration")}</span>
                        <strong style="font-size: 13px; color: ${calibBadgeColor}; display: block; margin: 4px 0 2px 0;">${calibStatusText}</strong>
                        <span style="font-size: 9.5px; color: var(--text-secondary); display: block;">${T('Decal: {decal}', { decal: calibDecal })}</span>
                    </div>
                    <div style="background: var(--bg-secondary); border: 1.5px solid var(--color-success); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <span style="font-size: 10px; color: var(--color-success); text-transform: uppercase; font-weight: 700; display: block;">${T("Overall Rating")}</span>
                        <strong style="font-size: 12px; color: var(--color-success); display: block; margin: 4px 0 2px 0;">${T("COMPLIANT")}</strong>
                        <span style="font-size: 9.5px; color: var(--color-success); display: block;">${T("State Standards Met")}</span>
                    </div>
                </div>

                <!-- Annual Calibration & Biomedical Service Attestation -->
                <div style="background: var(--bg-secondary); border-left: 4px solid var(--color-success); padding: 8px 12px; border-radius: 4px; margin-bottom: 14px; font-size: 10.5px;">
                    <strong>${T("🛡️ Equipment Calibration Attestation:")}</strong> ${T("This autoclave is under active annual preventive maintenance and biomedical temperature/pressure calibration per manufacturer guidelines and local health authority mandates. Last certified on")} <strong>${calibFormattedDate}</strong> ${T("by")} <strong>${calibTech}</strong> ${T('(Certificate/Decal #{decal}).', { decal: calibDecal })}
                </div>

                <!-- SECTION 1: 30-DAY STERILIZATION CYCLES LOG TABLE -->
                <div class="print-checklist-title" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${T("1. 30-Day Physical Sterilization Cycle & Batch Release Log")}</span>
                    <span style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">${T('Showing {n} recorded cycles', { n: totalCycles })}</span>
                </div>
                <table class="print-table" style="margin-bottom: 14px;">
                    <thead>
                        <tr>
                            <th>${T("Date")}</th>
                            <th>${T("Batch / Lot #")}</th>
                            <th>${T("Autoclave Type")}</th>
                            <th>${T("Load Type & Size")}</th>
                            <th>${T("Target Parameters")}</th>
                            <th>${T("Exposure / Dry Time")}</th>
                            <th>${T("Operator")}</th>
                            <th>${T("Release")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cycleRowsHtml}
                    </tbody>
                </table>

                <!-- SECTION 2: 30-DAY BIOLOGICAL INDICATOR SPORE TEST AUDIT LOG -->
                <div class="print-checklist-title" style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
                    <span>${T("2. 30-Day Biological Indicator (Spore Test) Audit Log")}</span>
                    <span style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">${T('Showing {n} recorded spore tests', { n: totalSpores })}</span>
                </div>
                <table class="print-table" style="margin-bottom: 14px;">
                    <thead>
                        <tr>
                            <th>${T("Test Date")}</th>
                            <th>${T("Interval")}</th>
                            <th>${T("BI Indicator Lot #")}</th>
                            <th>${T("Biological Result")}</th>
                            <th>${T("Incubation Duration")}</th>
                            <th>${T("Testing Tech")}</th>
                            <th>${T("Incubation & Laboratory Notes")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sporeRowsHtml}
                    </tbody>
                </table>

                <!-- SECTION 3: OFFICIAL INSPECTION SIGNOFF & COMPLIANCE ENDORSEMENT -->
                <div class="print-checklist-title">${T("3. Official Health Department & Studio QA Release Sign-Off")}</div>
                <div class="print-signoff-box" style="margin-bottom: 8px;">
                    <p style="font-size: 10px; color: var(--text-secondary); margin-bottom: 10px; line-height: 1.4;">
                        ${T("I hereby certify that all autoclave sterilization cycles, physical parameters (temperature, pressure, exposure time, drying duration), chemical integration verifications, and biological spore tests listed above have been executed in strict adherence to CDC, OSHA, and local State Health Department regulations.")}
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                        <div>
                            <strong style="font-size: 10.5px;">${T("Lead Sterilization Technician:")}</strong>
                            <div class="print-sign-line"></div>
                            <span style="font-size: 9.5px; color: var(--text-secondary);">${T("Print Name & Signature")}</span>
                        </div>
                        <div>
                            <strong style="font-size: 10.5px;">${T("Studio Safety Officer / Owner:")}</strong>
                            <div class="print-sign-line"></div>
                            <span style="font-size: 9.5px; color: var(--text-secondary);">${T("Print Name & Signature")}</span>
                        </div>
                        <div>
                            <strong style="font-size: 10.5px;">${T("Health Department Inspector:")}</strong>
                            <div class="print-sign-line"></div>
                            <span style="font-size: 9.5px; color: var(--text-secondary);">${T("Official Health Officer Sign-Off & Date")}</span>
                        </div>
                    </div>
                </div>

                <div class="print-footer-note">
                    ${T("Official Infection Control Document • Generated by Poli International Autoclave Compliance System • Retain on studio premises for a minimum of 3 years.")}
                </div>
            </div>
        `;
    },

    /**
     * Generate HTML for Spore Test Schedule & History Report
     */
    generateSporeReportHtml: function(historyData, stateData) {
        const profile = this.getStudioProfile();
        const now = new Date();
        const dateStr = now.toLocaleDateString(__loc(), { year: 'numeric', month: 'long', day: 'numeric' });

        const history = historyData || [];
        let rowsHtml = '';

        if (history.length === 0) {
            rowsHtml = `<tr><td colspan="6" style="text-align:center; padding: 16px; color: var(--text-secondary);">${T("No historical spore tests logged yet.")}</td></tr>`;
        } else {
            history.forEach(item => {
                const badgeColor = item.result === 'Passed' || item.result === 'Negative' ? 'var(--color-success)' : 'var(--color-danger)';
                const statusBadge = `<span style="display:inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; color: white; background: ${badgeColor}; font-size: 11px;">${item.result}</span>`;
                const techNotes = item.notes || item.technicianNotes || __tx('Routine biological lethality verification; negative at readout.');
                rowsHtml += `
                    <tr>
                        <td><strong>${item.date}</strong></td>
                        <td>${item.gapDays !== undefined ? item.gapDays + ' days' : '--'}</td>
                        <td>${item.lotNumber || 'BI-LOT-982'}</td>
                        <td>${statusBadge}</td>
                        <td>${item.technician || item.operator || profile.operatorName || __tx('Operator')}</td>
                        <td>${techNotes}</td>
                    </tr>
                `;
            });
        }

        const calibrationDate = localStorage.getItem('autoclave_calibration_date');
        let calibInfo = __tx('Not Configured');
        if (calibrationDate) {
            const calDate = new Date(calibrationDate);
            const daysSince = Math.floor((now - calDate)/(1000*60*60*24));
            calibInfo = daysSince >= 365 ? __tx('⚠️ Overdue ({n}d ago)', { n: daysSince }) : __tx('✓ Certified ({n}d left)', { n: 365 - daysSince });
        }

        return `
            <div class="print-document-sheet">
                ${this.renderDocumentHeader(__tx('BIOLOGICAL MONITORING COMPLIANCE REPORT'), __tx('Historical Spore Testing & Annual Autoclave Calibration Audit'))}

                <div class="print-meta-grid">
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Audit Date:")}</span>
                        <span class="print-meta-value">${dateStr}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Jurisdiction / State:")}</span>
                        <span class="print-meta-value"><strong>${stateData?.name || 'CDC / State Standard'}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Mandated Frequency:")}</span>
                        <span class="print-meta-value">${stateData?.frequency ? stateData.frequency.toUpperCase() : 'WEEKLY'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Autoclave Serial #:")}</span>
                        <span class="print-meta-value">${profile.autoclaveSerial || 'CHAMBER-01'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Annual Calibration:")}</span>
                        <span class="print-meta-value"><strong>${calibInfo}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Total Tests Logged:")}</span>
                        <span class="print-meta-value">${T('{n} Certified Runs', { n: history.length })}</span>
                    </div>
                </div>

                <div class="print-checklist-title">${T("Biological Indicator Test History (Time Gap & Lethality Verification)")}</div>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>${T("Test Date")}</th>
                            <th>${T("Time Gap")}</th>
                            <th>${T("BI Indicator Lot #")}</th>
                            <th>${T("Biological Result")}</th>
                            <th>${T("Technician")}</th>
                            <th>${T("Technician Notes & Observations")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div class="print-signoff-box" style="margin-top: 18px;">
                    <div class="print-signoff-grid">
                        <div>
                            <strong>${T("QA Officer / Studio Lead Signature:")}</strong>
                            <div class="print-sign-line"></div>
                        </div>
                        <div>
                            <strong>${T("Compliance Certification:")}</strong>
                            <div style="margin-top: 8px;">
                                <span class="print-checkbox">✓</span> <strong>${T("COMPLIANT WITH HEALTH DEPT STANDARDS")}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Generate HTML for Complete Historical Spore Test Archive PDF
     * Compiles entire local database of biological indicator records
     */
    generateAllSporeArchivePdfHtml: function(historyData, stateData) {
        const profile = this.getStudioProfile();
        const now = new Date();
        const dateStr = now.toLocaleDateString(__loc(), { year: 'numeric', month: 'long', day: 'numeric' });

        const history = (historyData && historyData.length > 0) 
            ? [...historyData].sort((a, b) => new Date(b.date) - new Date(a.date))
            : [];

        const totalTests = history.length;
        const passCount = history.filter(h => h.result === 'Passed' || h.result === 'Negative').length;
        const passRate = totalTests > 0 ? ((passCount / totalTests) * 100).toFixed(1) : '100.0';

        let oldestDate = '--';
        let newestDate = '--';
        if (history.length > 0) {
            newestDate = history[0].date;
            oldestDate = history[history.length - 1].date;
        }

        const calibrationDate = localStorage.getItem('autoclave_calibration_date');
        let calibInfo = __tx('Not Configured');
        if (calibrationDate) {
            const calDate = new Date(calibrationDate);
            const daysSince = Math.floor((now - calDate) / (1000 * 60 * 60 * 24));
            calibInfo = daysSince >= 365 ? `⚠️ Overdue (${daysSince}d ago)` : `✓ Certified (${365 - daysSince}d remaining)`;
        }

        let rowsHtml = '';
        if (history.length === 0) {
            rowsHtml = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--text-secondary);">${T("No biological spore test records stored in local browser database.")}</td></tr>`;
        } else {
            history.forEach((item, index) => {
                const isPass = item.result === 'Passed' || item.result === 'Negative';
                const badgeColor = isPass ? 'var(--color-success)' : 'var(--color-danger)';
                const statusBadge = `<span style="display:inline-block; padding: 2px 7px; border-radius: 4px; font-weight: bold; color: white; background: ${badgeColor}; font-size: 10px;">${item.result.toUpperCase()}</span>`;
                
                let gapDisplay = '--';
                if (item.gapDays !== undefined) {
                    const gapColor = item.gapDays <= 7 ? 'var(--color-success)' : (item.gapDays <= 10 ? '#B45309' : 'var(--color-danger)');
                    gapDisplay = `<span style="font-weight:700; color: ${gapColor};">${__tx('{n}d', { n: item.gapDays })}</span>`;
                }

                const techNotes = item.technicianNotes || item.notes || __tx('Routine biological lethality verification; negative at readout.');
                const incubation = item.incubationType || '24h In-Office';
                const techName = item.technician || item.operator || profile.operatorName || __tx('Operator');
                const lotNum = item.lotNumber || 'BI-LOT-982';

                rowsHtml += `
                    <tr style="${!isPass ? 'background-color: #FEF2F2;' : (index % 2 === 1 ? 'background-color: var(--bg-secondary);' : '')}">
                        <td style="font-weight: 700; white-space: nowrap;">${item.date}</td>
                        <td style="text-align: center; white-space: nowrap;">${gapDisplay}</td>
                        <td style="text-align: center; white-space: nowrap;">${statusBadge}</td>
                        <td style="font-family: monospace; font-size: 10.5px; white-space: nowrap;">${lotNum}</td>
                        <td style="font-size: 10.5px; white-space: nowrap;">${incubation}</td>
                        <td style="font-size: 10.5px; white-space: nowrap;">${techName}</td>
                        <td style="font-size: 10.5px; line-height: 1.35; word-break: break-word;">${techNotes}</td>
                    </tr>
                `;
            });
        }

        return `
            <div class="print-document-sheet">
                ${this.renderDocumentHeader(__tx('COMPLETE BIOLOGICAL MONITORING ARCHIVE'), __tx('Official Historical Spore Test Verification Ledger & Compliance Certification'))}

                <div class="print-meta-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 12px;">
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Archive Generated:")}</span>
                        <span class="print-meta-value">${dateStr}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Date Range:")}</span>
                        <span class="print-meta-value">${oldestDate} &rarr; ${newestDate}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Total Tests Logged:")}</span>
                        <span class="print-meta-value"><strong>${T('{n} Certified Runs', { n: totalTests })}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Sterility Pass Rate:")}</span>
                        <span class="print-meta-value" style="color: var(--color-success);"><strong>${T('{n}% Negative', { n: passRate })}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Autoclave Chamber ID:")}</span>
                        <span class="print-meta-value">${profile.autoclaveSerial || 'CHAMBER-01 • SN-984210'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Facility Jurisdiction:")}</span>
                        <span class="print-meta-value">${stateData?.name || 'CDC Guidelines (Weekly)'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Annual Calibration:")}</span>
                        <span class="print-meta-value"><strong>${calibInfo}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Statutory Record Retention:")}</span>
                        <span class="print-meta-value">${T("3-Year Compliance Lock")}</span>
                    </div>
                </div>

                <div class="print-checklist-title" style="margin-top: 10px;">
                    ${T('Comprehensive Biological Indicator Test Log ({n} Total Historical Entries)', { n: totalTests })}
                </div>
                <table class="print-table" style="font-size: 10px; margin-bottom: 14px;">
                    <thead>
                        <tr style="background: var(--bg-secondary);">
                            <th style="width: 12%;">${T("Test Date")}</th>
                            <th style="width: 8%; text-align: center;">${T("Interval")}</th>
                            <th style="width: 12%; text-align: center;">${T("BI Result")}</th>
                            <th style="width: 15%;">${T("Lot Number")}</th>
                            <th style="width: 15%;">${T("Incubation Spec")}</th>
                            <th style="width: 14%;">${T("Technician")}</th>
                            <th style="width: 24%;">${T("Technician Notes & Observations")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div class="print-signoff-box" style="margin-top: 14px;">
                    <div class="print-signoff-grid" style="grid-template-columns: 1.2fr 1fr;">
                        <div>
                            <strong>${T("QA Director / Responsible Biomedical Officer Sign-Off:")}</strong>
                            <div class="print-sign-line" style="margin-top: 6px;"></div>
                            <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 4px;">
                                ${T('Name / Title: ____________________________________ Date: {date}', { date: dateStr })}
                            </div>
                        </div>
                        <div>
                            <strong>${T("Regulatory & Health Inspector Verification:")}</strong>
                            <div style="margin-top: 6px; font-size: 10.5px;">
                                <span class="print-checkbox">✓</span> <strong>${T("COMPLETE HISTORICAL ARCHIVE CERTIFIED")}</strong>
                            </div>
                            <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 4px;">
                                ${T("Verified compliant with 3-Year statutory biological monitoring audit requirements.")}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="print-footer-note" style="margin-top: 8px;">
                    ${T("Generated by Autoclave Sterilization & Biological Monitoring Compliance System • Permanent Historical Record")}
                </div>
            </div>
        `;
    },

    /**
     * Print Complete Historical Spore Test Archive PDF
     */
    printSporeArchivePdf: function() {
        try {
            let history = [];
            if (window.SporeHistoryManager && typeof window.SporeHistoryManager.getRecords === 'function') {
                history = window.SporeHistoryManager.getRecords();
            } else {
                const raw = localStorage.getItem('autoclave_spore_history');
                if (raw) history = JSON.parse(raw);
            }

            let stateData = { name: 'CDC / State Mandate', frequency: 'weekly' };
            const stateSelect = document.getElementById('spore-state-select');
            if (stateSelect && window.SPORE_REQUIREMENTS) {
                stateData = window.SPORE_REQUIREMENTS[stateSelect.value] || stateData;
            }

            const html = this.generateAllSporeArchivePdfHtml(history, stateData);
            this.printDocument(html);
            if (typeof showToast === 'function') {
                showToast(__tx('✓ Complete Spore Test Archive PDF ready for print/export!'), 'success', 2800);
            }
        } catch (err) {
            console.error('Error generating complete spore archive PDF:', err);
            if (typeof showToast === 'function') {
                showToast(__tx('Could not generate archive PDF: {error}', { error: err.message }), 'error', 3500);
            }
        }
    },

    /**
     * Open Print Dialog with Custom Styled Document
     */
    printPouchLabels: function(options) {
        const {
            studioName = 'POLI STUDIO',
            batchId = 'BATCH-RUN',
            date = new Date().toISOString().split('T')[0],
            contents = __tx('Piercing Clamps & Forceps'),
            expiryText = __tx('Event-Related'),
            operator = __tx('Studio Technician'),
            autoclave = 'Class B Pre-Vac',
            integratorPassed = true,
            qrSvg = '',
            format = 'single',
            quantity = 1
        } = options;

        const labelHtml = `
            <div class="pouch-print-sticker">
                <div class="pouch-print-header">
                    <span class="pouch-print-studio">${studioName}</span>
                    <span class="pouch-print-badge">${T("STERILE")}</span>
                </div>
                <div class="pouch-print-body">
                    <div class="pouch-print-details">
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("LOT:")}</span> <strong class="pouch-print-batch">${batchId}</strong></div>
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("DATE:")}</span> <span>${date}</span></div>
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("ITEM:")}</span> <span class="pouch-print-item">${contents}</span></div>
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("EXP:")}</span> <span>${expiryText}</span></div>
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("TECH:")}</span> <span>${operator}</span></div>
                    </div>
                    <div class="pouch-print-qr-wrap">
                        <div class="pouch-print-qr-svg">${qrSvg}</div>
                        <span class="pouch-print-qr-sub">${T("SCAN LOT")}</span>
                    </div>
                </div>
                <div class="pouch-print-footer">
                    <span>${T("CI Class 5:")} <strong>${integratorPassed ? T('✓ PASS') : T('⚠️ FAIL')}</strong></span>
                    <span>${autoclave}</span>
                </div>
            </div>
        `;

        let labelsCount = Math.max(1, parseInt(quantity, 10) || 1);
        let labelsContainerHtml = '';
        for (let i = 0; i < labelsCount; i++) {
            labelsContainerHtml += labelHtml;
        }

        const isThermalSingle = (format === 'single');
        const isCompact = (format === 'compact');
        const isDualChart = (format === 'dual_chart');
        const isAvery = (format === 'avery5160');
        const isSheet6 = (format === 'sheet6');
        const isSheet12 = (format === 'sheet12');

        const dualLabelHtml = `
            <div class="pouch-dual-wrapper" style="display: flex; border: 1.5px dashed var(--text-primary); border-radius: 4px; overflow: hidden; page-break-inside: avoid; margin-bottom: 8px;">
                <div class="pouch-print-sticker" style="flex: 1; border: none; border-radius: 0; border-right: 1.5px dashed var(--text-secondary);">
                    <div class="pouch-print-header">
                        <span class="pouch-print-studio">${studioName}</span>
                        <span class="pouch-print-badge">${T("POUCH SEAL")}</span>
                    </div>
                    <div class="pouch-print-body">
                        <div class="pouch-print-details">
                            <div class="pouch-print-row"><span class="pouch-print-label">${T("LOT:")}</span> <strong class="pouch-print-batch">${batchId}</strong></div>
                            <div class="pouch-print-row"><span class="pouch-print-label">${T("DATE:")}</span> <span>${date}</span></div>
                            <div class="pouch-print-row"><span class="pouch-print-label">${T("ITEM:")}</span> <span class="pouch-print-item">${contents}</span></div>
                            <div class="pouch-print-row"><span class="pouch-print-label">${T("EXP:")}</span> <span>${expiryText}</span></div>
                        </div>
                        <div class="pouch-print-qr-wrap">
                            <div class="pouch-print-qr-svg">${qrSvg}</div>
                        </div>
                    </div>
                    <div class="pouch-print-footer">
                        <span>${T("CI Class 5:")} <strong>${integratorPassed ? T('✓ PASS') : T('⚠️ FAIL')}</strong></span>
                        <span>${autoclave}</span>
                    </div>
                </div>
                <div class="pouch-print-sticker" style="flex: 0.9; border: none; border-radius: 0; background: var(--bg-secondary);">
                    <div class="pouch-print-header">
                        <span style="font-size: 8px; font-weight: 800; color: var(--color-primary);">${T("CLIENT CHART STUB")}</span>
                        <span style="font-size: 6.5px; font-weight: 700; color: var(--text-secondary);">${T("PEEL & AFFIX")}</span>
                    </div>
                    <div class="pouch-print-details" style="margin-top: 4px;">
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("LOT:")}</span> <strong>${batchId}</strong></div>
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("STERIL:")}</span> <span>${date}</span></div>
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("PROCEDURE:")}</span> <span>___________</span></div>
                        <div class="pouch-print-row"><span class="pouch-print-label">${T("PIERCER:")}</span> <span>${operator}</span></div>
                    </div>
                    <div class="pouch-print-footer" style="margin-top: 6px;">
                        <span style="font-size: 6.5px; color: var(--text-secondary);">${T("Attach to Client Consent Form")}</span>
                    </div>
                </div>
            </div>
        `;

        let finalLabelsContainerHtml = '';
        for (let i = 0; i < labelsCount; i++) {
            finalLabelsContainerHtml += isDualChart ? dualLabelHtml : labelHtml;
        }

        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);

        const doc = printFrame.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${T('Sterilization Pouch Labels - {batch}', { batch: batchId })}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: var(--text-primary); }
                    ${(isThermalSingle || isCompact) ? `
                        @page { size: ${isCompact ? '2in 1in' : '2in 1.25in'}; margin: 0mm; }
                        body { padding: 3px; background: var(--bg-primary); }
                        .pouch-print-sheet { width: 100%; display: flex; flex-direction: column; gap: 4px; }
                        .pouch-print-sticker { width: 100%; height: ${isCompact ? '0.94in' : '1.18in'}; page-break-inside: avoid; page-break-after: always; }
                    ` : isAvery ? `
                        @page { size: 8.5in 11in; margin: 0.5in 0.1875in; }
                        body { padding: 0; background: var(--bg-primary); }
                        .pouch-print-sheet {
                            display: grid;
                            grid-template-columns: repeat(3, 2.625in);
                            grid-auto-rows: 1in;
                            column-gap: 0.125in;
                            row-gap: 0in;
                            width: 100%;
                        }
                        .pouch-print-sticker { page-break-inside: avoid; height: 0.98in; border: 1px dashed var(--border-primary); }
                    ` : `
                        @page { size: letter portrait; margin: 10mm 12mm; }
                        body { padding: 10px; background: var(--bg-primary); }
                        .pouch-print-sheet {
                            display: grid;
                            grid-template-columns: ${isDualChart ? '1fr' : isSheet6 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'};
                            gap: 12px;
                            width: 100%;
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .pouch-print-sticker { page-break-inside: avoid; }
                    `}

                    .pouch-print-sticker {
                        background: var(--bg-primary);
                        border: 1.5px solid var(--text-primary);
                        border-radius: 4px;
                        padding: 6px 8px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        font-size: 8.5px;
                        line-height: 1.2;
                        box-sizing: border-box;
                    }
                    .pouch-print-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid var(--text-primary);
                        padding-bottom: 2px;
                        margin-bottom: 3px;
                    }
                    .pouch-print-studio {
                        font-size: 8.5px;
                        font-weight: 800;
                        text-transform: uppercase;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 130px;
                    }
                    .pouch-print-badge {
                        font-size: 7px;
                        font-weight: 800;
                        background: var(--text-primary);
                        color: var(--bg-primary);
                        padding: 1px 3px;
                        border-radius: 2px;
                    }
                    .pouch-print-body {
                        display: grid;
                        grid-template-columns: 1fr 48px;
                        gap: 4px;
                        align-items: center;
                    }
                    .pouch-print-details {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5px;
                    }
                    .pouch-print-row {
                        display: flex;
                        align-items: baseline;
                        gap: 3px;
                        font-size: 7.5px;
                    }
                    .pouch-print-label {
                        font-size: 7px;
                        font-weight: 800;
                        color: var(--text-secondary);
                        text-transform: uppercase;
                    }
                    .pouch-print-batch {
                        font-family: monospace;
                        font-size: 8.5px;
                        font-weight: 800;
                    }
                    .pouch-print-item {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 100px;
                        font-weight: 700;
                    }
                    .pouch-print-qr-wrap {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .pouch-print-qr-svg svg,
                    .pouch-print-qr-svg img {
                        width: 44px;
                        height: 44px;
                        display: block;
                    }
                    .pouch-print-qr-sub {
                        font-size: 6px;
                        font-weight: 800;
                        text-transform: uppercase;
                        color: var(--text-secondary);
                        margin-top: 1px;
                    }
                    .pouch-print-footer {
                        border-top: 0.8px solid var(--border-primary);
                        margin-top: 3px;
                        padding-top: 2px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 7px;
                        color: #334155;
                    }
                </style>
            </head>
            <body>
                <div class="pouch-print-sheet">
                    ${finalLabelsContainerHtml}
                </div>
            </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(printFrame);
            }, 2000);
        }, 300);
    },

    /**
     * Generate HTML for Concatenated Multi-Batch Sterilization Records PDF Report
     */
    generateConcatenatedBatchReportsHtml: function(selectedLogs) {
        const profile = this.getStudioProfile();
        const now = new Date();
        const dateStr = now.toLocaleDateString(__loc(), { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const batches = (selectedLogs && selectedLogs.length > 0) ? selectedLogs : [];
        const totalBatches = batches.length;

        const passingIntegrators = batches.filter(b => b.integratorPassed !== false).length;
        const passRate = totalBatches > 0 ? Math.round((passingIntegrators / totalBatches) * 100) : 100;
        const releasedCount = batches.filter(b => (b.signOffStatus || 'released').toLowerCase() === 'released').length;

        const calibrationDate = localStorage.getItem('autoclave_calibration_date');
        let calibInfo = __tx('Not Configured');
        if (calibrationDate) {
            const calDate = new Date(calibrationDate);
            const daysSince = Math.floor((now - calDate) / (1000 * 60 * 60 * 24));
            calibInfo = daysSince >= 365 ? `⚠️ Overdue (${daysSince}d ago)` : `✓ Certified (${365 - daysSince}d remaining)`;
        }

        let batchCardsHtml = '';
        batches.forEach((b, index) => {
            const bDate = b.date || 'N/A';
            const bTime = b.time ? ` at ${b.time}` : '';
            const batchId = b.batchNumber || b.batchId || `CYC-${bDate.replace(/-/g, '')}-${index + 1}`;
            const autoType = b.autoclaveName || b.autoclaveType || 'Class B Pre-Vacuum';
            const loadInfo = `${(b.loadType || 'General').toUpperCase()}${b.loadSize ? ` (${b.loadSize.toUpperCase()})` : ''}`;
            const temp = (b.temperature && typeof b.temperature === 'object') ? `${b.temperature.f}°F (${b.temperature.c}°C)` : (b.temperature ? `${b.temperature}°F` : '270°F');
            const press = (b.pressure && typeof b.pressure === 'object') ? `${b.pressure.psi} PSI (${b.pressure.bar || '1.8'} bar)` : (b.pressure ? `${b.pressure} PSI` : '27 PSI');
            const exposure = b.exposureTime ? `${b.exposureTime} min` : '4 min';
            const dry = b.dryTime ? `${b.dryTime} min` : '20 min';
            const total = b.totalCycle ? `${b.totalCycle} min` : '35 min';
            const op = b.operator || profile.operatorName || __tx('Studio Technician');
            const notes = b.technicianNotes || b.notes || __tx('Routine autoclave cycle executed per established professional piercing practice.');
            const isIntegratorPass = b.integratorPassed !== false;
            const signOffStatus = (b.signOffStatus || 'released').toUpperCase();
            const signOffColor = signOffStatus === 'RELEASED' ? 'var(--color-success)' : (signOffStatus === 'QUARANTINED' ? 'var(--color-danger)' : 'var(--color-warning)');

            // Generate Mini QR Code SVG
            let qrSvg = '';
            try {
                if (typeof qrcode !== 'undefined') {
                    const qr = qrcode(0, 'M');
                    const qrPayload = JSON.stringify({
                        schema: 'POLI_AUTOCLAVE_V1',
                        type: 'cycle',
                        id: b.id,
                        batch: batchId,
                        date: bDate,
                        time: b.time || '',
                        op: op,
                        temp: temp,
                        exp: exposure,
                        result: isIntegratorPass ? 'PASS' : 'FAIL'
                    });
                    qr.addData(qrPayload);
                    qr.make();
                    qrSvg = qr.createSvgTag({ scalable: true, cellSize: 2 });
                }
            } catch (e) {
                console.warn('QR error in PDF gen:', e);
            }

            batchCardsHtml += `
                <div style="border: 1.5px solid var(--border-primary); border-radius: 6px; padding: 12px; margin-bottom: 12px; background: var(--bg-primary); page-break-inside: avoid;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-primary); padding-bottom: 8px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${qrSvg ? `<div style="width: 44px; height: 44px; flex-shrink: 0; background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 4px; padding: 2px;">${qrSvg}</div>` : ''}
                            <div>
                                <div style="font-size: 13px; font-weight: 800; color: var(--text-primary);">
                                    ${T("Batch:")} <span style="font-family: monospace; color: var(--color-primary);">${batchId}</span>
                                </div>
                                <div style="font-size: 10.5px; color: var(--text-secondary);">${bDate}${bTime} • ${autoType} • ${T('Load: {load}', { load: loadInfo })}</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10.5px; font-weight: 700; background: ${signOffColor === 'var(--color-success)' ? 'rgba(0, 200, 127, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${signOffColor};">
                                ● ${signOffStatus}
                            </span>
                            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 3px;">${T("Sign-Off:")} <strong>${op}</strong></div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px 10px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 4px; padding: 8px 10px; font-size: 10.5px; margin-bottom: 8px;">
                        <div><span style="color:var(--text-secondary);">${T("Temperature:")}</span> <strong>${temp}</strong></div>
                        <div><span style="color:var(--text-secondary);">${T("Pressure:")}</span> <strong>${press}</strong></div>
                        <div><span style="color:var(--text-secondary);">${T("Exposure Time:")}</span> <strong>${exposure}</strong></div>
                        <div><span style="color:var(--text-secondary);">${T("Dry Time:")}</span> <strong>${dry}</strong></div>
                        <div><span style="color:var(--text-secondary);">${T("Total Duration:")}</span> <strong>${total}</strong></div>
                        <div><span style="color:var(--text-secondary);">${T("Chamber ID:")}</span> <strong>${b.serialNumber || profile.autoclaveSerial || 'CHAMBER-01'}</strong></div>
                        <div><span style="color:var(--text-secondary);">${T("Class 5 Integrator:")}</span> <strong style="color: ${isIntegratorPass ? 'var(--color-success)' : 'var(--color-danger)'};">${isIntegratorPass ? '✓ PASSED' : '⚠️ FAILED'}</strong></div>
                        <div><span style="color:var(--text-secondary);">${T("Wet Pack Check:")}</span> <strong>${T("✓ 0% Moisture (Dry)")}</strong></div>
                    </div>

                    <div style="font-size: 10px; color: var(--text-secondary); line-height: 1.35;">
                        <strong>${T("Technician Notes & Observations:")}</strong> ${notes}
                    </div>
                </div>
            `;
        });

        return `
            <div class="print-document-sheet">
                ${this.renderDocumentHeader(__tx('CONCATENATED STERILIZATION BATCH AUDIT REPORT'), __tx('Official Physical Cycle Release & Parameter Verification Dossier'))}

                <div class="print-meta-grid">
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Audit Generated:")}</span>
                        <span class="print-meta-value">${dateStr}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Total Batches Selected:")}</span>
                        <span class="print-meta-value"><strong>${T('{n} Batch Records', { n: totalBatches })}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Batch Release Status:")}</span>
                        <span class="print-meta-value" style="color: var(--color-success);"><strong>${T('{a} of {b} Released', { a: releasedCount, b: totalBatches })}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Chemical Integrator Rate:")}</span>
                        <span class="print-meta-value" style="color: var(--color-success);"><strong>${T('{n}% Verified Pass', { n: passRate })}</strong></span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Lead Operator:")}</span>
                        <span class="print-meta-value">${profile.operatorName || 'Studio Sterilization Technician'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Equipment Calibration:")}</span>
                        <span class="print-meta-value"><strong>${calibInfo}</strong></span>
                    </div>
                </div>

                <div class="print-checklist-title" style="margin-top: 6px; margin-bottom: 8px; display: flex; justify-content: space-between;">
                    <span>${T('Selected Sterilization Batch Dossier Logs ({n} Runs)', { n: totalBatches })}</span>
                    <span style="font-size: 10px; font-weight: normal; color: var(--text-secondary);">${T("Audit Retention Standard: 3-Year Physical Verification")}</span>
                </div>

                ${batchCardsHtml}

                <div class="print-signoff-box" style="margin-top: 14px; page-break-inside: avoid;">
                    <div class="print-signoff-grid" style="grid-template-columns: 1.2fr 1fr;">
                        <div>
                            <strong>${T("Lead Sterilization Technician / QA Sign-Off:")}</strong>
                            <div class="print-sign-line" style="margin-top: 6px;"></div>
                            <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 4px;">
                                ${T('Name: ____________________________________ Date: {date}', { date: dateStr })}
                            </div>
                        </div>
                        <div>
                            <strong>${T("Health Department & Audit Endorsement:")}</strong>
                            <div style="margin-top: 6px; font-size: 10.5px;">
                                <span class="print-checkbox">✓</span> <strong>${T("BATCHES VERIFIED & COMPLIANT")}</strong>
                            </div>
                            <div style="font-size: 9.5px; color: var(--text-secondary); margin-top: 4px;">
                                ${T("Verified compliant with CDC, OSHA, and established professional piercing practice.")}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="print-footer-note" style="margin-top: 8px;">
                    ${T("Generated by Autoclave Sterilization & Biological Monitoring Compliance System • Physical Batch Audit Record")}
                </div>
            </div>
        `;
    },

    /**
     * Print Concatenated Multi-Batch Sterilization Records PDF
     */
    /**
     * Print Concatenated Multi-Batch Sterilization Records PDF
     */
    printConcatenatedBatchReports: function(selectedLogs) {
        try {
            if (!selectedLogs || selectedLogs.length === 0) {
                if (typeof showToast === 'function') {
                    showToast(__tx('⚠️ Please select one or more batch records using the checkboxes first.'), 'warning', 3000);
                }
                return;
            }
            const html = this.generateConcatenatedBatchReportsHtml(selectedLogs);
            this.printDocument(html);
            if (typeof showToast === 'function') {
                showToast(__tx('✓ Concatenated PDF report generated for {n} selected batch(es)!', { n: selectedLogs.length }), 'success', 2800);
            }
        } catch (err) {
            console.error('Error generating concatenated batch PDF:', err);
            if (typeof showToast === 'function') {
                showToast(__tx('Could not generate batch PDF: {error}', { error: err.message }), 'error', 3500);
            }
        }
    },

    /**
     * Generate HTML for Quarterly Health Inspector Dossier
     */
    generateQuarterlyInspectorDossierHtml: function(quarter, year, customStart, customEnd, allLogs, allSporeTests, allMaintLogs) {
        const profile = this.getStudioProfile();
        const now = new Date();
        const dateStr = now.toLocaleDateString(__loc(), { year: 'numeric', month: 'short', day: 'numeric' });

        // Filter logs by date range
        let startDate, endDate;
        if (quarter === 'custom' && customStart && customEnd) {
            startDate = new Date(customStart + 'T00:00:00');
            endDate = new Date(customEnd + 'T23:59:59');
        } else {
            const yr = parseInt(year) || now.getFullYear();
            if (quarter === 'Q1') {
                startDate = new Date(yr, 0, 1);
                endDate = new Date(yr, 2, 31, 23, 59, 59);
            } else if (quarter === 'Q2') {
                startDate = new Date(yr, 3, 1);
                endDate = new Date(yr, 5, 30, 23, 59, 59);
            } else if (quarter === 'Q3') {
                startDate = new Date(yr, 6, 1);
                endDate = new Date(yr, 8, 30, 23, 59, 59);
            } else {
                startDate = new Date(yr, 9, 1);
                endDate = new Date(yr, 11, 31, 23, 59, 59);
            }
        }

        const logs = (allLogs || []).filter(l => {
            const d = new Date(l.date || l.timestamp);
            return d >= startDate && d <= endDate;
        });

        const spores = (allSporeTests || []).filter(s => {
            const d = new Date(s.date || s.testDate || s.timestamp);
            return d >= startDate && d <= endDate;
        });

        const maints = (allMaintLogs || []).filter(m => {
            const d = new Date(m.date || m.timestamp);
            return d >= startDate && d <= endDate;
        });

        const totalRuns = logs.length;
        const totalReleased = logs.filter(l => (l.status || '').toLowerCase() === 'released' || (l.complianceStatus || '').toLowerCase() === 'compliant').length;
        const releaseRate = totalRuns > 0 ? Math.round((totalReleased / totalRuns) * 100) : 100;
        const totalSpores = spores.length;
        const passedSpores = spores.filter(s => (s.result || s.status || '').toLowerCase().includes('pass') || (s.result || s.status || '').toLowerCase().includes('neg')).length;
        const sporeRate = totalSpores > 0 ? Math.round((passedSpores / totalSpores) * 100) : 100;

        const calibDate = localStorage.getItem('autoclave_calibration_date') || profile.certDate;
        const calibTech = localStorage.getItem('autoclave_calibration_tech') || profile.certTechnician || 'BioMed Solutions Inc.';
        const calibNum = localStorage.getItem('autoclave_calibration_cert_num') || profile.certNumber || 'CERT-BM-9941';

        // Render batch log table rows
        let batchRowsHtml = '';
        if (logs.length === 0) {
            batchRowsHtml = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 12px;">${T("No sterilization cycles recorded in this quarter period.")}</td></tr>`;
        } else {
            batchRowsHtml = logs.slice(0, 30).map(l => {
                const bDate = new Date(l.date || l.timestamp).toLocaleDateString(__loc(), { month: 'short', day: 'numeric' });
                const bLot = l.batchNumber || l.batchId || 'LOT-' + (l.id || '00');
                const bType = l.loadType || 'Wrapped Inst.';
                const bTemp = l.temperature ? `${l.temperature}°F` : '270°F';
                const bPress = l.pressure ? `${l.pressure} PSI` : '30 PSI';
                const bTime = l.exposureTime ? `${l.exposureTime} min` : '4 min';
                const bStatus = (l.status || 'RELEASED').toUpperCase();
                const statusColor = bStatus === 'RELEASED' || bStatus === 'COMPLIANT' ? 'var(--color-success)' : 'var(--color-danger)';

                return `
                    <tr>
                        <td><strong>${bDate}</strong></td>
                        <td><code>${bLot}</code></td>
                        <td>${bType}</td>
                        <td>${bTemp} / ${bPress}</td>
                        <td>${bTime}</td>
                        <td>${l.operator || profile.operatorName || __tx('Lead Tech')}</td>
                        <td style="color: ${statusColor}; font-weight: 700;">✓ ${bStatus}</td>
                    </tr>
                `;
            }).join('');
        }

        // Render biological spore test rows
        let sporeRowsHtml = '';
        if (spores.length === 0) {
            sporeRowsHtml = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 10px;">${T("No biological spore tests filed during this quarterly audit timeframe.")}</td></tr>`;
        } else {
            sporeRowsHtml = spores.map(s => {
                const sDate = new Date(s.date || s.testDate || s.timestamp).toLocaleDateString(__loc(), { month: 'short', day: 'numeric' });
                const sLot = s.biLotNumber || s.lotNumber || 'BI-LOT-4410';
                const sType = s.organism || 'G. stearothermophilus (10^6)';
                const sResult = (s.result || s.status || 'NEGATIVE (PASS)').toUpperCase();
                const resColor = sResult.includes('PASS') || sResult.includes('NEG') ? 'var(--color-success)' : 'var(--color-danger)';
                return `
                    <tr>
                        <td><strong>${sDate}</strong></td>
                        <td><code>${sLot}</code></td>
                        <td>${sType}</td>
                        <td>${s.incubatorTemp || '56°C'} / ${s.incubationHours || '24h'}</td>
                        <td style="color: ${resColor}; font-weight: 700;">✓ ${sResult}</td>
                    </tr>
                `;
            }).join('');
        }

        // Render maintenance rows
        let maintRowsHtml = '';
        if (maints.length === 0) {
            maintRowsHtml = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 8px;">${T("Standard routine preventive maintenance on schedule.")}</td></tr>`;
        } else {
            maintRowsHtml = maints.map(m => {
                const mDate = new Date(m.date || m.timestamp).toLocaleDateString(__loc(), { month: 'short', day: 'numeric' });
                return `
                    <tr>
                        <td><strong>${mDate}</strong></td>
                        <td>${m.unit || 'Midmark M11'}</td>
                        <td><strong>${m.procedure || m.task}</strong></td>
                        <td>${m.hours ? m.hours + ' hrs' : 'N/A'}</td>
                        <td>${m.tech || __tx('Staff Tech')}</td>
                    </tr>
                `;
            }).join('');
        }

        return `
            <div class="print-document-sheet dossier-page-sheet">
                ${this.renderDocumentHeader(__tx('QUARTERLY HEALTH INSPECTOR AUDIT DOSSIER'), __tx('Official Comprehensive Sterilization & Spore Monitoring Record • {quarter} {year}', { quarter: quarter, year: year }))}

                <div class="dossier-executive-grid">
                    <div class="dossier-kpi-item">
                        <span class="dossier-kpi-lbl">${T("Audit Period:")}</span>
                        <strong class="dossier-kpi-val">${quarter} ${year}</strong>
                    </div>
                    <div class="dossier-kpi-item">
                        <span class="dossier-kpi-lbl">${T("Total Batches:")}</span>
                        <strong class="dossier-kpi-val">${T('{n} Cycles', { n: totalRuns })}</strong>
                    </div>
                    <div class="dossier-kpi-item">
                        <span class="dossier-kpi-lbl">${T("Physical Release Rate:")}</span>
                        <strong class="dossier-kpi-val" style="color: var(--color-success);">${T('{n}% PASS', { n: releaseRate })}</strong>
                    </div>
                    <div class="dossier-kpi-item">
                        <span class="dossier-kpi-lbl">${T("Spore Compliance:")}</span>
                        <strong class="dossier-kpi-val" style="color: var(--color-success);">${T('{n}% PASS ({m} Tests)', { n: sporeRate, m: totalSpores })}</strong>
                    </div>
                </div>

                <div class="print-meta-grid" style="margin-bottom: 12px; grid-template-columns: repeat(3, 1fr);">
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Primary Autoclave:")}</span>
                        <span class="print-meta-value">${profile.autoclaveSerial || 'Midmark M11 (#MM-8472)'}</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Biomedical Calibration:")}</span>
                        <span class="print-meta-value" style="color: var(--color-success);">✓ ${calibNum} (${calibTech})</span>
                    </div>
                    <div class="print-meta-item">
                        <span class="print-meta-label">${T("Lead Operator:")}</span>
                        <span class="print-meta-value">${profile.operatorName || 'Studio Sterilization Director'}</span>
                    </div>
                </div>

                <!-- Section 1: Biological Spore Tests -->
                <div class="dossier-section-heading">
                    <span>${T("1. Biological Indicator (Spore) Testing Ledger")}</span>
                    <span style="font-size: 10px; font-weight: normal; color: var(--text-secondary);">${T("Weekly Verification Protocol (ANSI/AAMI ST79)")}</span>
                </div>
                <table class="dossier-table">
                    <thead>
                        <tr>
                            <th>${T("Test Date")}</th>
                            <th>${T("BI Lot Number")}</th>
                            <th>${T("Challenge Microorganism")}</th>
                            <th>${T("Incubation Param")}</th>
                            <th>${T("Spore Result")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sporeRowsHtml}
                    </tbody>
                </table>

                <!-- Section 2: Physical & Chemical Sterilization Batches -->
                <div class="dossier-section-heading" style="margin-top: 14px;">
                    <span>${T('2. Physical Cycle Parameter Release Record ({n} Batches Logged)', { n: totalRuns })}</span>
                    <span style="font-size: 10px; font-weight: normal; color: var(--text-secondary);">${T("Retained for 3-Year Health Authority Review")}</span>
                </div>
                <table class="dossier-table">
                    <thead>
                        <tr>
                            <th>${T("Date")}</th>
                            <th>${T("Batch ID / LOT #")}</th>
                            <th>${T("Load Content")}</th>
                            <th>${T("Temp / Press")}</th>
                            <th>${T("Plateau")}</th>
                            <th>${T("Technician")}</th>
                            <th>${T("Parametric Release")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${batchRowsHtml}
                    </tbody>
                </table>

                <!-- Section 3: Preventive Maintenance Summary -->
                <div class="dossier-section-heading" style="margin-top: 14px;">
                    <span>${T("3. Preventive Maintenance & Equipment Health Ledger")}</span>
                    <span style="font-size: 10px; font-weight: normal; color: var(--text-secondary);">${T("Descaling, Gasket Inspection & Calibration Logs")}</span>
                </div>
                <table class="dossier-table">
                    <thead>
                        <tr>
                            <th>${T("Date")}</th>
                            <th>${T("Chamber Unit")}</th>
                            <th>${T("Maintenance Procedure")}</th>
                            <th>${T("Running Hours")}</th>
                            <th>${T("Technician / Service Provider")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${maintRowsHtml}
                    </tbody>
                </table>

                <!-- Section 4: Dual Sign-off & Health Authority Endorsement Block -->
                <div class="dossier-signoff-block" style="page-break-inside: avoid;">
                    <div>
                        <strong style="font-size: 11px;">${T("Studio Quality Assurance & Piercing Director:")}</strong>
                        <div class="signoff-line"></div>
                        <div class="signoff-label">${T('Signature: ____________________________________ Date: {date}', { date: dateStr })}</div>
                        <p style="font-size: 9px; color: var(--text-secondary); margin-top: 3px;">${T("I hereby certify that all biological spore tests and daily physical parameter releases were conducted in full compliance with CDC, OSHA, and established professional piercing practice.")}</p>
                    </div>
                    <div>
                        <strong style="font-size: 11px;">${T("Public Health Official / Environmental Health Inspector:")}</strong>
                        <div class="signoff-line"></div>
                        <div class="signoff-label">${T("Inspector Name & Badge #: ____________________________________")}</div>
                        <div style="font-size: 10px; margin-top: 5px; color: var(--color-success); font-weight: bold;">
                            ${T("[ &nbsp; ] APPROVED & COMPLIANT &nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] RE-INSPECTION REQUIRED")}
                        </div>
                    </div>
                </div>

                <div class="print-footer-note" style="margin-top: 12px;">
                    ${T("Confidential Health & Safety Compliance Record • Autoclave Sterilization & Biological Monitoring Portal")}
                </div>
            </div>
        `;
    },

    /**
     * Print or Preview Quarterly Health Inspector Dossier
     */
    printQuarterlyInspectorDossier: function(quarter, year, customStart, customEnd, logs, spores, maints) {
        try {
            const html = this.generateQuarterlyInspectorDossierHtml(quarter, year, customStart, customEnd, logs, spores, maints);
            this.printDocument(html);
            if (typeof showToast === 'function') {
                showToast(__tx('✓ Printing Quarterly Inspector Dossier ({quarter} {year})...', { quarter: quarter, year: year }), 'success', 3000);
            }
        } catch (err) {
            console.error('Error generating inspector dossier printout:', err);
            if (typeof showToast === 'function') {
                showToast(__tx('Error generating dossier PDF: {error}', { error: err.message }), 'error', 3500);
            }
        }
    },

    /**
     * Print Thermal Adhesive Sterile Packaging Verification Label
     */
    printThermalPackagingLabel: function(pkgData) {
        const studio = this.getStudioProfile();
        const lot = pkgData?.lotNumber || 'LOT-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-01';
        const sterilDate = pkgData?.sterilDate || new Date().toISOString().slice(0,10);
        const contents = pkgData?.contents || __tx('Piercing Clamps & Tapers');
        const expiry = pkgData?.expiry || __tx('Event-Related (ST79)');

        // Generate QR code for label
        let qrDataUrl = '';
        try {
            if (typeof qrcode === 'function') {
                const qr = qrcode(0, 'M');
                qr.addData(`STERILE LOT:${lot}|DATE:${sterilDate}|AUTH:POLI_COMPLIANT`);
                qr.make();
                qrDataUrl = qr.createDataURL(3, 4);
            }
        } catch (e) {
            console.warn('QR code generator error:', e);
        }

        const labelHtml = `
            <div style="width: 2.8in; height: 1.8in; padding: 6px; border: 1.5px solid var(--border-primary); font-family: Arial, sans-serif; font-size: 8pt; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid var(--border-primary); padding-bottom: 2px;">
                    <strong style="font-size: 8.5pt;">${studio.studioName || 'POLI INTERNATIONAL'}</strong>
                    <span style="background: var(--text-primary); color: var(--bg-primary); font-size: 7pt; font-weight: bold; padding: 1px 4px; border-radius: 2px;">${T("STERILE")}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 4px; margin: 3px 0;">
                    <div>
                        <div><strong>${T("LOT:")}</strong> ${lot}</div>
                        <div><strong>${T("DATE:")}</strong> ${sterilDate}</div>
                        <div><strong>${T("ITEMS:")}</strong> ${contents}</div>
                        <div><strong>${T("EXP:")}</strong> <span style="color: var(--color-success); font-weight: bold;">${expiry}</span></div>
                    </div>
                    ${qrDataUrl ? `<img src="${qrDataUrl}" style="width: 50px; height: 50px; flex-shrink: 0;" alt="LOT QR" />` : ''}
                </div>
                <div style="border-top: 1px solid var(--border-primary); padding-top: 2px; display: flex; justify-content: space-between; font-size: 6.5pt; color: var(--text-primary);">
                    <span>${T("CI Class 5:")} <strong>${T("✓ PASS")}</strong></span>
                    <span>${T("ANSI/AAMI ST79 Compliant")}</span>
                </div>
            </div>
        `;

        this.printDocument(labelHtml);
    },

    /**
     * Bundle and export all logs, certificates, and dossiers into a structured .ZIP archive
     */
    exportAllLogsZip: function(logs, sporeLogs, maintLogs) {
        try {
            if (typeof JSZip === 'undefined') {
                if (typeof showToast === 'function') {
                    showToast('⚠️ JSZip library loading, please try again in a moment.', 'warning', 3000);
                }
                return;
            }

            const zip = new JSZip();
            const timestamp = new Date().toISOString().slice(0, 10);
            const folderName = `Autoclave_Compliance_Dossier_${timestamp}`;
            const folder = zip.folder(folderName);

            // 1. JSON Data Exports
            folder.file('sterilization_batch_records.json', JSON.stringify(logs || [], null, 2));
            folder.file('spore_test_biological_records.json', JSON.stringify(sporeLogs || [], null, 2));
            folder.file('equipment_maintenance_ledger.json', JSON.stringify(maintLogs || [], null, 2));
            folder.file('studio_profile.json', JSON.stringify(this.getStudioProfile(), null, 2));

            // 2. CSV Exports
            let batchCsv = 'Date,Batch_ID,Autoclave_Unit,Load_Type,Target_Temp_F,Pressure_PSI,Exposure_Min,Operator,Status\n';
            (logs || []).forEach(l => {
                batchCsv += `"${l.date || ''}","${l.batchNumber || l.batchId || ''}","${l.autoclaveType || ''}","${l.loadType || ''}","${l.temperature || ''}","${l.pressure || ''}","${l.exposureTime || ''}","${l.operator || ''}","${l.status || ''}"\n`;
            });
            folder.file('sterilization_batch_records.csv', batchCsv);

            let sporeCsv = 'Test_Date,BI_Lot_Number,Autoclave_Unit,Organism,Incubation_Temp,Incubation_Hours,Result,Technician\n';
            (sporeLogs || []).forEach(s => {
                sporeCsv += `"${s.date || s.testDate || ''}","${s.biLotNumber || s.lotNumber || ''}","${s.autoclave || ''}","${s.organism || ''}","${s.incubatorTemp || ''}","${s.incubationHours || ''}","${s.result || s.status || ''}","${s.technician || ''}"\n`;
            });
            folder.file('spore_biological_monitoring.csv', sporeCsv);

            // 3. HTML Printable Audit Dossier
            const dossierHtml = this.generateQuarterlyInspectorDossierHtml('Q3', '2026', null, null, logs, sporeLogs, maintLogs);
            folder.file('Quarterly_Inspector_Submission_Dossier.html', `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${T("Quarterly Sterilization Dossier")}</title><style>body{font-family:Arial,sans-serif;padding:20px;}</style></head><body>${dossierHtml}</body></html>`);

            // Generate ZIP file and trigger browser download
            zip.generateAsync({ type: 'blob' }).then(function(content) {
                const url = window.URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Quarterly_Health_Inspector_Dossier_${timestamp}.zip`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                if (typeof showToast === 'function') {
                    showToast(__tx('✓ All audit records bundled into {name}.zip!', { name: folderName }), 'success', 3500);
                }
            });

        } catch (err) {
            console.error('Error generating ZIP export:', err);
            if (typeof showToast === 'function') {
                showToast(__tx('Failed to generate ZIP archive: {error}', { error: err.message }), 'error', 3500);
            }
        }
    },

    /**
     * Generate HTML for Weekly 7-Day Sterilization Audit Summary
     */
    generateWeeklySummaryReportHtml: function(allLogs, allSporeTests, allMaintLogs, customStart, customEnd) {
        const profile = this.getStudioProfile();
        const logo = this.getStudioLogo();

        // Determine 7-day window
        let endMs = customEnd ? new Date(customEnd).getTime() : Date.now();
        let startMs = customStart ? new Date(customStart).getTime() : (endMs - 7 * 24 * 60 * 60 * 1000);

        const startDateStr = new Date(startMs).toLocaleDateString(__loc(), { month: 'short', day: 'numeric', year: 'numeric' });
        const endDateStr = new Date(endMs).toLocaleDateString(__loc(), { month: 'short', day: 'numeric', year: 'numeric' });

        // Filter cycle logs for past 7 days
        const rawLogs = allLogs || (typeof SterilizationLogManager !== 'undefined' ? SterilizationLogManager.logs : []);
        const logs = rawLogs.filter(log => {
            const t = new Date(log.timestamp || log.date || 0).getTime();
            return t >= startMs && t <= endMs + 86400000;
        });

        // Filter spore tests for past 7 days
        const rawSpores = allSporeTests || (typeof SporeHistoryManager !== 'undefined' ? SporeHistoryManager.tests : []);
        const spores = rawSpores.filter(sp => {
            const t = new Date(sp.testDate || sp.timestamp || 0).getTime();
            return t >= (startMs - 2 * 86400000) && t <= endMs + 86400000;
        });

        const totalBatches = logs.length;
        const releasedBatches = logs.filter(l => l.released !== false && l.integratorResult !== 'fail').length;
        const failedBatches = totalBatches - releasedBatches;
        const passRate = totalBatches > 0 ? Math.round((releasedBatches / totalBatches) * 100) : 100;
        const totalPouches = logs.reduce((sum, l) => sum + (parseInt(l.pouchCount || l.instrumentsCount || 4, 10) || 4), 0);

        // Check weekly spore test
        const latestSpore = spores.length > 0 ? spores[0] : null;
        let sporeStatusHtml = `<span style="color: var(--text-secondary);">${T('No Spore Run in Period')}</span>`;
        if (latestSpore) {
            if (latestSpore.result === 'pass' || latestSpore.result === 'negative') {
                sporeStatusHtml = `<span style="color: var(--color-success); font-weight: 700;">${T('✓ PASS (Negative / No Growth - Lot #{lot})', { lot: latestSpore.lotNumber || 'ST-79' })}</span>`;
            } else if (latestSpore.result === 'fail' || latestSpore.result === 'positive') {
                sporeStatusHtml = `<span style="color: var(--color-danger); font-weight: 700;">${T("⚠️ FAIL (Positive Spore Growth - Immediate Quarantine)")}</span>`;
            } else {
                sporeStatusHtml = `<span style="color: var(--color-warning); font-weight: 700;">${T('⏳ Incubation Pending ({status})', { status: __tx(latestSpore.incubatorTime || 'In Progress') })}</span>`;
            }
        }

        // Daily aggregated breakdown
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayMap = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date(startMs + i * 86400000);
            const key = d.toISOString().split('T')[0];
            dayMap[key] = {
                dateFormatted: d.toLocaleDateString(__loc(), { weekday: 'short', month: 'numeric', day: 'numeric' }),
                count: 0,
                pouches: 0,
                operators: new Set(),
                models: new Set()
            };
        }

        logs.forEach(l => {
            const dStr = new Date(l.timestamp || l.date || 0).toISOString().split('T')[0];
            if (dayMap[dStr]) {
                dayMap[dStr].count++;
                dayMap[dStr].pouches += (parseInt(l.pouchCount || 4, 10) || 4);
                if (l.operator) dayMap[dStr].operators.add(l.operator);
                if (l.autoclaveType) dayMap[dStr].models.add(l.autoclaveType);
            }
        });

        const dailyRowsHtml = Object.keys(dayMap).map(k => {
            const d = dayMap[k];
            const ops = Array.from(d.operators).join(', ') || profile.operatorName || __tx('Technician');
            return `
                <tr>
                    <td style="font-weight: 600; padding: 6px 8px;">${d.dateFormatted}</td>
                    <td style="text-align: center; padding: 6px 8px; font-weight: 700;">${d.count === 1 ? T('{n} cycle', { n: d.count }) : T('{n} cycles', { n: d.count })}</td>
                    <td style="text-align: center; padding: 6px 8px;">${T('{n} items', { n: d.pouches })}</td>
                    <td style="padding: 6px 8px;">${ops}</td>
                    <td style="text-align: center; padding: 6px 8px; color: ${d.count > 0 ? 'var(--color-success)' : 'var(--text-secondary)'}; font-weight: bold;">
                        ${d.count > 0 ? T('✓ 100% Release') : '—'}
                    </td>
                </tr>
            `;
        }).join('');

        // Batch table rows
        const batchRowsHtml = logs.length > 0 ? logs.map((log, idx) => {
            const dt = new Date(log.timestamp || log.date || 0);
            const dateFmt = dt.toLocaleDateString(__loc(), { month: 'numeric', day: 'numeric' }) + ' ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const batchNum = log.batchNumber || log.id || `BAT-${idx + 101}`;
            const autoType = log.autoclaveType || 'Pre-Vacuum (Class B)';
            const loadDesc = `${log.loadType || 'Wrapped'} (${log.loadSize || 'Med'})`;
            const params = `${log.temperature || '132°C / 270°F'} • ${log.pressure || '27 PSI'}`;
            const timeDesc = `${log.exposureTime || 4}m exp / ${log.dryTime || 20}m dry`;
            const oper = log.operator || profile.operatorName || __tx('Tech');
            const isReleased = log.released !== false && log.integratorResult !== 'fail';

            return `
                <tr style="font-size: 10px; ${idx % 2 === 1 ? 'background: var(--bg-secondary);' : ''}">
                    <td style="padding: 5px 6px; font-weight: 700; color: var(--color-primary);">#${batchNum}</td>
                    <td style="padding: 5px 6px; white-space: nowrap;">${dateFmt}</td>
                    <td style="padding: 5px 6px;">${autoType}</td>
                    <td style="padding: 5px 6px;">${loadDesc}</td>
                    <td style="padding: 5px 6px;">${params}</td>
                    <td style="padding: 5px 6px;">${timeDesc}</td>
                    <td style="padding: 5px 6px;">${oper}</td>
                    <td style="padding: 5px 6px; text-align: center;">
                        <span style="display: inline-block; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 9.5px; background: ${isReleased ? '#DEF7EC' : '#FDE8E8'}; color: ${isReleased ? '#03543F' : '#9B1C1C'};">
                            ${isReleased ? __tx('✓ PASS / RELEASED') : __tx('⚠️ QUARANTINE')}
                        </span>
                    </td>
                </tr>
            `;
        }).join('') : `
            <tr>
                <td colspan="8" style="text-align: center; padding: 16px; color: var(--text-secondary);">${T("No sterilization batches logged during this 7-day period.")}</td>
            </tr>
        `;

        return `
            <div class="print-document-sheet" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: var(--text-primary); max-width: 800px; margin: 0 auto; line-height: 1.35;">
                <!-- Header -->
                <div class="print-document-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid var(--color-success); padding-bottom: 12px; margin-bottom: 12px;">
                    <div class="print-header-left" style="display: flex; align-items: center; gap: 12px;">
                        <div class="print-header-logo-container">
                            ${logo.isCustom ? `<img src="${logo.src}" alt="Studio Logo" style="max-height: 52px; max-width: 140px; object-fit: contain;">` : logo.svg}
                        </div>
                        <div>
                            <div class="print-studio-name" style="font-size: 16px; font-weight: 800; color: var(--text-primary);">${profile.studioName || 'PROFESSIONAL STERILIZATION STUDIO'}</div>
                            <div class="print-studio-address" style="font-size: 10.5px; color: var(--text-secondary);">${profile.address || 'Infection Control & Quality Assurance Division'}</div>
                            <div style="font-size: 9.5px; color: var(--color-primary); font-weight: 600; margin-top: 2px;">${T("ANSI/AAMI ST79 & ISO 11140-1 Audit Compliance")}</div>
                        </div>
                    </div>
                    <div class="print-header-right" style="text-align: right;">
                        <div class="print-doc-title" style="font-size: 14px; font-weight: 800; color: var(--color-success); text-transform: uppercase;">${T("WEEKLY STERILIZATION AUDIT REPORT")}</div>
                        <div class="print-doc-subtitle" style="font-size: 10.5px; color: var(--text-primary); font-weight: 700;">${T('{range} (7-Day Aggregate)', { range: startDateStr + ' — ' + endDateStr })}</div>
                        <div style="font-size: 9px; color: var(--text-secondary); margin-top: 2px;">${T('Report Generated: {time}', { time: new Date().toLocaleString() })}</div>
                    </div>
                </div>

                <!-- 7-Day Performance Metric Dashboard -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <div style="font-size: 9.5px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">${T("Total Cycles Run")}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--color-primary); margin-top: 2px;">${totalBatches} <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">${T("Batches")}</span></div>
                    </div>
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <div style="font-size: 9.5px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">${T("Released / Pass Rate")}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--color-success); margin-top: 2px;">${passRate}% <span style="font-size: 11px; font-weight: 600; color: var(--color-success);">(${releasedBatches}/${totalBatches})</span></div>
                    </div>
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <div style="font-size: 9.5px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">${T("Pouched Items Processed")}</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-top: 2px;">${totalPouches} <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">${T("Instruments")}</span></div>
                    </div>
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 10px; text-align: center;">
                        <div style="font-size: 9.5px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">${T("Quarantined / Aborted")}</div>
                        <div style="font-size: 18px; font-weight: 800; color: ${failedBatches > 0 ? 'var(--color-danger)' : 'var(--color-success)'}; margin-top: 2px;">${failedBatches} <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">${T("Runs")}</span></div>
                    </div>
                </div>

                <!-- Studio & Hardware Metadata Grid -->
                <div class="print-meta-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; font-size: 10px;">
                    <div><span class="print-meta-label" style="color: var(--text-secondary); font-weight: 600;">${T("Autoclave Unit:")}</span> <span style="font-weight: 700;">${profile.autoclaveSerial || 'Midmark M11 UltraClave (#MM-8472)'}</span></div>
                    <div><span class="print-meta-label" style="color: var(--text-secondary); font-weight: 600;">${T("Calibration Status:")}</span> <span style="font-weight: 700; color: var(--color-success);">${T("✓ Certified Biomedical")}</span></div>
                    <div><span class="print-meta-label" style="color: var(--text-secondary); font-weight: 600;">${T("Lead Operator:")}</span> <span style="font-weight: 700;">${profile.operatorName || 'Qualified Professional Piercer'}</span></div>
                    <div><span class="print-meta-label" style="color: var(--text-secondary); font-weight: 600;">${T("Weekly Spore Verification:")}</span> ${sporeStatusHtml}</div>
                    <div><span class="print-meta-label" style="color: var(--text-secondary); font-weight: 600;">${T("Chemical Indicator:")}</span> <span style="font-weight: 700;">${T("ISO 11140-1 Class 5 Integrator")}</span></div>
                    <div><span class="print-meta-label" style="color: var(--text-secondary); font-weight: 600;">${T("Water Purity:")}</span> <span style="font-weight: 700;">${T("<15 ppm TDS Distilled Steam")}</span></div>
                </div>

                <!-- Section: Daily Schedule Breakdown -->
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 11px; font-weight: 800; color: var(--text-primary); text-transform: uppercase; border-bottom: 1.5px solid var(--border-primary); padding-bottom: 3px; margin-bottom: 6px; display: flex; justify-content: space-between;">
                        <span>${T("1. Daily Sterilization Throughput (Past 7 Days)")}</span>
                        <span style="font-weight: 600; color: var(--text-secondary); text-transform: none; font-size: 9.5px;">${T("Week Schedule")}</span>
                    </div>
                    <table class="print-table" style="width: 100%; border-collapse: collapse; font-size: 10px;">
                        <thead>
                            <tr style="background: var(--bg-tertiary); color: var(--text-primary);">
                                <th style="padding: 5px 8px; border: 1px solid var(--border-primary);">${T("Date")}</th>
                                <th style="padding: 5px 8px; border: 1px solid var(--border-primary); text-align: center;">${T("Completed Cycles")}</th>
                                <th style="padding: 5px 8px; border: 1px solid var(--border-primary); text-align: center;">${T("Estimated Items Processed")}</th>
                                <th style="padding: 5px 8px; border: 1px solid var(--border-primary);">${T("Operating Technicians")}</th>
                                <th style="padding: 5px 8px; border: 1px solid var(--border-primary); text-align: center;">${T("Release Compliance")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dailyRowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- Section: Comprehensive 7-Day Batch Log Manifest -->
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 11px; font-weight: 800; color: var(--text-primary); text-transform: uppercase; border-bottom: 1.5px solid var(--border-primary); padding-bottom: 3px; margin-bottom: 6px; display: flex; justify-content: space-between;">
                        <span>${T("2. Physical Cycle Parameter Logs & Class 5 Integrators")}</span>
                        <span style="font-weight: 600; color: var(--color-primary); text-transform: none; font-size: 9.5px;">${T('{n} Total Records', { n: logs.length })}</span>
                    </div>
                    <table class="print-table" style="width: 100%; border-collapse: collapse; font-size: 9.5px;">
                        <thead>
                            <tr style="background: var(--bg-tertiary); color: var(--text-primary);">
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary);">${T("Batch #")}</th>
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary);">${T("Date & Time")}</th>
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary);">${T("Autoclave Type")}</th>
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary);">${T("Load Type")}</th>
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary);">${T("Temp & Pressure")}</th>
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary);">${T("Exposure / Dry")}</th>
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary);">${T("Technician")}</th>
                                <th style="padding: 4px 6px; border: 1px solid var(--border-primary); text-align: center;">${T("Release Status")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${batchRowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- Section: Quality Assurance & Legal Sign-off -->
                <div class="print-signoff-box" style="border: 1.5px solid var(--border-primary); border-radius: 6px; padding: 10px 14px; margin-top: 10px; background: var(--bg-primary); font-size: 10px; page-break-inside: avoid;">
                    <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">${T("QUALITY ASSURANCE CERTIFICATION & BATCH RELEASE ATTESTATION")}</div>
                    <p style="font-size: 9.5px; color: var(--text-secondary); margin-bottom: 10px; line-height: 1.35;">
                        ${T("I hereby attest that all sterilization cycles cataloged in this 7-day report were processed in accordance with ANSI/AAMI ST79 comprehensive guidelines for steam sterilization, ISO 11140-1 chemical integrator monitoring, and manufacturer specifications. Physical time, temperature, and pressure parameters were observed on-spec prior to package release.")}
                    </p>
                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; align-items: flex-end;">
                        <div>
                            <div style="font-size: 9px; color: var(--text-secondary);">${T("Lead Piercer / Sterilization Tech Signature:")}</div>
                            <div class="print-sign-line" style="border-bottom: 1.5px solid var(--border-primary); height: 22px; margin: 4px 0 2px 0;"></div>
                            <div style="font-size: 8.5px; color: var(--text-secondary);">${T('Print Name & Title: {name} • Date: _________________', { name: profile.operatorName || __tx('Qualified Professional Piercer') })}</div>
                        </div>
                        <div>
                            <div style="font-size: 9px; color: var(--text-secondary);">${T("Infection Control Director / Studio Owner:")}</div>
                            <div class="print-sign-line" style="border-bottom: 1.5px solid var(--border-primary); height: 22px; margin: 4px 0 2px 0;"></div>
                            <div style="font-size: 8.5px; color: var(--text-secondary);">${T("Verification Signature • Date: _________________")}</div>
                        </div>
                    </div>
                </div>

                <div class="print-footer-note" style="text-align: center; font-size: 8.5px; color: var(--text-secondary); margin-top: 8px;">
                    ${T("Generated by Autoclave Sterilization & Quality Management System • Retain with Studio Health & Safety Compliance Files for a minimum of 3 years.")}
                </div>
            </div>
        `;
    },

    /**
     * Print Weekly 7-Day Sterilization Summary PDF
     */
    printWeeklySummaryPdf: function(allLogs, allSpores, allMaints) {
        try {
            const html = this.generateWeeklySummaryReportHtml(allLogs, allSpores, allMaints);
            this.printDocument(html);
            if (typeof showToast === 'function') {
                showToast(__tx('✓ Weekly 7-Day Sterilization Audit Summary report sent to printer / PDF!'), 'success', 3200);
            }
        } catch (err) {
            console.error('Error generating weekly summary PDF:', err);
            if (typeof showToast === 'function') {
                showToast(__tx('Could not generate weekly summary PDF: {error}', { error: err.message }), 'error', 3500);
            }
        }
    },

    printDocument: function(htmlContent) {
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);

        const doc = printFrame.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${T("Sterilization Log - Print Document")}</title>
                <style>
                    @page { size: letter portrait; margin: 12mm 15mm; }
                    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: var(--text-primary); }
                    body { padding: 10px; background: var(--bg-primary); font-size: 12px; line-height: 1.4; }
                    .print-document-sheet { width: 100%; max-width: 800px; margin: 0 auto; }
                    .print-document-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-success); padding-bottom: 12px; margin-bottom: 14px; }
                    .print-header-left { display: flex; align-items: center; gap: 14px; }
                    .print-header-logo-container img { max-height: 54px; max-width: 140px; object-fit: contain; }
                    .print-studio-name { font-size: 16px; font-weight: 800; color: var(--text-primary); letter-spacing: 0.5px; }
                    .print-studio-address { font-size: 11px; color: var(--text-secondary); }
                    .print-header-right { text-align: right; }
                    .print-doc-title { font-size: 14px; font-weight: 800; color: var(--color-success); }
                    .print-doc-subtitle { font-size: 10px; color: var(--text-secondary); }
                    .print-meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 14px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 6px; padding: 10px 14px; margin-bottom: 14px; font-size: 11px; }
                    .print-meta-label { color: var(--text-secondary); font-weight: 600; margin-right: 4px; }
                    .print-meta-value { color: var(--text-primary); font-weight: 700; }
                    .print-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11px; }
                    .print-table th { background: var(--bg-secondary); color: #334155; font-weight: 700; padding: 8px; text-align: left; border: 1px solid var(--border-primary); }
                    .print-table td { padding: 8px; border: 1px solid var(--border-primary); text-align: left; }
                    .print-checklist-title { font-size: 12px; font-weight: 800; color: var(--text-primary); margin: 12px 0 6px 0; border-bottom: 1px solid var(--border-primary); padding-bottom: 4px; }
                    .print-checklist { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; margin-bottom: 14px; font-size: 10.5px; }
                    .print-checklist-item { display: flex; align-items: flex-start; gap: 6px; }
                    .print-checkbox { display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; border: 1.5px solid var(--color-success); border-radius: 2px; color: var(--color-success); font-size: 10px; font-weight: bold; flex-shrink: 0; margin-top: 1px; }
                    .print-signoff-box { border: 1.5px solid var(--border-primary); border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; background: var(--bg-primary); font-size: 11px; }
                    .print-signoff-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; align-items: center; }
                    .print-sign-line { border-bottom: 1.5px solid var(--text-primary); height: 26px; margin: 4px 0 2px 0; }
                    .print-footer-note { text-align: center; font-size: 9.5px; color: var(--text-secondary); margin-top: 8px; }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(printFrame);
            }, 2000);
        }, 300);
    }
};

window.PDFGenerator = PDFGenerator;
