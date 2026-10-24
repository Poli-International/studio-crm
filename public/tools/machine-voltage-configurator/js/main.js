/**
 * Poli International - Machine Voltage Configurator
 * Main Application Controller (V2)
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // 1. TAB NAVIGATION
    // ==========================================
    const tabs = document.querySelectorAll('.tool-tab');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            if (!targetId) return;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panes.forEach(p => {
                p.hidden = true;
            });

            const targetPane = document.getElementById('tab-' + targetId);
            if (targetPane) {
                targetPane.hidden = false;
            }

            // Trigger visualizer update if tab is visualizer
            if (targetId === 'visualizer') {
                updateVisualizer();
            }
        });
    });

    // ==========================================
    // 2. CONFIGURATOR CONTROLLER
    // ==========================================
    const machineType = document.getElementById('machine-type');
    const strokeLength = document.getElementById('stroke-length');
    const techBtns = document.querySelectorAll('.tech-btn');
    const minVEl = document.getElementById('min-voltage');
    const maxVEl = document.getElementById('max-voltage');
    const speedRelEl = document.getElementById('speed-rel');
    const forceRelEl = document.getElementById('force-rel');
    const dutyRelEl = document.getElementById('duty-rel');
    const techDescEl = document.getElementById('tech-description');

    let currentTech = 'lining';

    function updateConfig() {
        if (!machineType || !strokeLength) return;
        const type = machineType.value;
        const stroke = strokeLength.value;

        if (!window.STARTING_RANGES || !window.STARTING_RANGES[type]) return;

        const typeData = window.STARTING_RANGES[type];
        const strokeData = typeData[stroke];
        if (!strokeData || !strokeData[currentTech]) return;

        const config = strokeData[currentTech];

        if (minVEl) minVEl.textContent = config.min.toFixed(1);
        if (maxVEl) maxVEl.textContent = config.max.toFixed(1);

        const i18n = window.PoliI18n || { t: (k) => k };

        if (speedRelEl) speedRelEl.textContent = i18n.t(config.speed);
        if (forceRelEl) forceRelEl.textContent = i18n.t(config.force);
        if (dutyRelEl) dutyRelEl.textContent = i18n.t(typeData.duty_cycle);

        if (techDescEl) {
            const recKey = 'rec.' + type + '.' + currentTech;
            techDescEl.textContent = i18n.t(recKey);
        }
    }

    if (machineType) machineType.addEventListener('change', updateConfig);
    if (strokeLength) strokeLength.addEventListener('change', updateConfig);

    techBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            techBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTech = btn.dataset.tech;
            updateConfig();
        });
    });

    // ==========================================
    // 3. STROKE & SPEED VISUALIZER
    // ==========================================
    const visStroke = document.getElementById('vis-stroke');
    const visVoltBtns = document.querySelectorAll('.vis-volt-btn');
    const svgCamCircle = document.getElementById('svgCamCircle');
    const svgNeedleBar = document.getElementById('svgNeedleBar');
    const svgNeedleTip = document.getElementById('svgNeedleTip');
    const svgStrokeRange = document.getElementById('svgStrokeRange');

    const visMetricThrow = document.getElementById('vis-metric-throw');
    const visMetricSpeed = document.getElementById('vis-metric-speed');
    const visMetricForce = document.getElementById('vis-metric-force');
    const visMetricDwell = document.getElementById('vis-metric-dwell');

    let currentVoltLevel = 'med';

    function updateVisualizer() {
        if (!visStroke || !window.STROKE_MECHANICS) return;
        const strokeVal = visStroke.value;
        const mech = window.STROKE_MECHANICS[strokeVal];
        if (!mech) return;

        // Update Cam circle
        if (svgCamCircle) {
            svgCamCircle.setAttribute('r', mech.camRadius);
        }

        // Update Needle throw
        const tipBaseY = 160;
        const extraThrow = (parseFloat(strokeVal) - 2.5) * 8;
        const targetTipY = tipBaseY + extraThrow;

        if (svgNeedleBar) {
            svgNeedleBar.setAttribute('y2', targetTipY);
        }
        if (svgNeedleTip) {
            svgNeedleTip.setAttribute('cy', targetTipY);
        }

        // Update throw range bar
        if (svgStrokeRange) {
            svgStrokeRange.setAttribute('height', mech.throwHeight);
            svgStrokeRange.setAttribute('y', 200 - mech.throwHeight);
        }

        // Update Metrics
        const i18n = window.PoliI18n || { t: (k) => k };
        if (visMetricThrow) visMetricThrow.textContent = strokeVal + ' mm';
        if (visMetricSpeed) visMetricSpeed.textContent = i18n.t(mech.rateKey || mech.rateDesc);
        if (visMetricForce) visMetricForce.textContent = i18n.t(mech.forceKey || mech.forceDesc);
        if (visMetricDwell) visMetricDwell.textContent = i18n.t(mech.dwellKey || mech.dwellDesc);
    }

    if (visStroke) visStroke.addEventListener('change', updateVisualizer);

    visVoltBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            visVoltBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentVoltLevel = btn.dataset.voltLevel;
            updateVisualizer();
        });
    });

    // ==========================================
    // 4. CONNECTION & SUPPLY COMPATIBILITY CHECKER
    // ==========================================
    const compatCheckBtn = document.getElementById('compatCheckBtn');
    const compatConn = document.getElementById('compat-conn');
    const compatSupply = document.getElementById('compat-supply');
    const compatCable = document.getElementById('compat-cable');
    const compatResultBox = document.getElementById('compatResultBox');

    function runCompatibilityCheck() {
        if (!compatConn || !compatSupply || !compatCable || !compatResultBox) return;
        if (typeof window.evaluateCompatibility !== 'function') return;

        const result = window.evaluateCompatibility(
            compatConn.value,
            compatSupply.value,
            compatCable.value
        );

        const i18n = window.PoliI18n || { t: (k) => k };
        let html = '<div class="compat-results">';
        result.issues.forEach(issue => {
            let alertClass = 'notice-box';
            if (issue.type === 'incompatible' || issue.type === 'warning') {
                alertClass += ' warning';
            }
            const issueTitle = issue.titleKey ? i18n.t(issue.titleKey) : issue.title;
            const issueDesc = issue.descKey ? i18n.t(issue.descKey) : issue.desc;
            html += '<div class="' + alertClass + '">' +
                '<strong>' + issueTitle + ':</strong> ' + issueDesc +
            '</div>';
        });
        html += '</div>';

        compatResultBox.innerHTML = html;
    }

    if (compatCheckBtn) {
        compatCheckBtn.addEventListener('click', runCompatibilityCheck);
    }

    // ==========================================
    // 5. GLOBAL EVENT & LANGUAGE LISTENERS
    // ==========================================
    window.addEventListener('poli-language-changed', () => {
        updateConfig();
        updateVisualizer();
        if (compatResultBox && compatResultBox.innerHTML.trim() !== '') {
            runCompatibilityCheck();
        }
    });

    // Initialize Config and Visualizer
    updateConfig();
    updateVisualizer();
});

// Global helper for embed copying
window.copyEmbedSnippet = function() {
    const textarea = document.getElementById('embedCodeArea');
    const btn = document.getElementById('copyEmbedBtn');
    if (!textarea) return;

    textarea.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textarea.value).then(() => {
            if (btn) {
                const i18n = window.PoliI18n || { t: (k) => k };
                btn.textContent = i18n.t('embed.copied');
                setTimeout(() => {
                    btn.textContent = i18n.t('embed.copy_btn');
                }, 2500);
            }
        });
    }
};
