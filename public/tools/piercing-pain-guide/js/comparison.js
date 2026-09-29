// ═══════════════════════════════════════════════════════════════
// COMPARISON.JS - Side-by-Side Discomfort Comparison (V2)
// Direct anatomical and sensation comparison without fake percentages.
// ═══════════════════════════════════════════════════════════════

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', handleComparison);
        }

        window.addEventListener('languageChanged', function() {
            populateComparisonDropdowns();
            const resultsContainer = document.getElementById('comparisonResults');
            if (resultsContainer && resultsContainer.style.display !== 'none') {
                handleComparison();
            }
        });
    });

    window.populateComparisonDropdowns = function() {
        const selA = document.getElementById('locationA');
        const selB = document.getElementById('locationB');
        if (!selA || !selB) return;

        const valA = selA.value;
        const valB = selB.value;

        const isPiercing = (typeof window.currentProcedure === 'string') 
            ? window.currentProcedure === 'piercing' 
            : true;
        const db = window.getPainDatabase(isPiercing ? 'piercing' : 'tattoo');
        const t = window.t || (k => k);

        let optionsHtml = `<option value="">-- ${t('map.select_location')} --</option>`;
        for (const [id, loc] of Object.entries(db)) {
            const locName = loc.nameKey ? t(loc.nameKey) : loc.name;
            optionsHtml += `<option value="${id}">${locName} (${loc.pain_level}/10)</option>`;
        }

        selA.innerHTML = optionsHtml;
        selB.innerHTML = optionsHtml;

        if (valA && db[valA]) selA.value = valA;
        if (valB && db[valB]) selB.value = valB;
    };

    function handleComparison() {
        const selA = document.getElementById('locationA');
        const selB = document.getElementById('locationB');
        const errorEl = document.getElementById('compareError');
        const resultsContainer = document.getElementById('comparisonResults');
        if (!selA || !selB || !resultsContainer) return;

        const locKeyA = selA.value;
        const locKeyB = selB.value;

        if (!locKeyA || !locKeyB) {
            if (errorEl) {
                errorEl.textContent = window.t('compare.select_both_error') || 'Please select both locations to compare.';
                errorEl.hidden = false;
            }
            resultsContainer.hidden = true;
            return;
        }

        if (locKeyA === locKeyB) {
            if (errorEl) {
                errorEl.textContent = window.t('compare.select_different_error') || 'Please select two different locations.';
                errorEl.hidden = false;
            }
            resultsContainer.hidden = true;
            return;
        }

        if (errorEl) {
            errorEl.hidden = true;
        }

        const isPiercing = (typeof window.currentProcedure === 'string') 
            ? window.currentProcedure === 'piercing' 
            : true;
        const db = window.getPainDatabase(isPiercing ? 'piercing' : 'tattoo');

        const dataA = db[locKeyA];
        const dataB = db[locKeyB];
        if (!dataA || !dataB) return;

        renderComparisonCards(dataA, dataB, resultsContainer);
    }

    function renderComparisonCards(locA, locB, container) {
        const t = window.t || (k => k);
        const nameA = locA.nameKey ? t(locA.nameKey) : locA.name;
        const nameB = locB.nameKey ? t(locB.nameKey) : locB.name;
        const whyA = locA.why_hurts_key ? t(locA.why_hurts_key) : locA.why_hurts;
        const whyB = locB.why_hurts_key ? t(locB.why_hurts_key) : locB.why_hurts;
        const feelsA = locA.feels_like_key ? t(locA.feels_like_key) : locA.feels_like;
        const feelsB = locB.feels_like_key ? t(locB.feels_like_key) : locB.feels_like;
        const durA = locA.duration_key ? t(locA.duration_key) : locA.duration;
        const durB = locB.duration_key ? t(locB.duration_key) : locB.duration;
        const healA = locA.healing_time_key ? t(locA.healing_time_key) : locA.healing_time;
        const healB = locB.healing_time_key ? t(locB.healing_time_key) : locB.healing_time;

        let verdictHtml = '';
        if (locA.pain_level === locB.pain_level) {
            verdictHtml = `
                <div class="compare-verdict compare-verdict--equal">
                    <h4 class="compare-verdict-title">${t('compare.verdict_title')}</h4>
                    <p class="compare-verdict-text">
                        ${t('compare.verdict_equal', { score: locA.pain_level })}
                    </p>
                </div>
            `;
        } else {
            const isHigherA = locA.pain_level > locB.pain_level;
            const higherName = isHigherA ? nameA : nameB;
            const lowerName = isHigherA ? nameB : nameA;
            const scoreHigh = isHigherA ? locA.pain_level : locB.pain_level;
            const scoreLow = isHigherA ? locB.pain_level : locA.pain_level;

            verdictHtml = `
                <div class="compare-verdict compare-verdict--diff">
                    <h4 class="compare-verdict-title">${t('compare.verdict_title')}</h4>
                    <p class="compare-verdict-text">
                        ${t('compare.verdict_diff', { higher: higherName, lower: lowerName, scoreHigh, scoreLow })}
                    </p>
                </div>
            `;
        }

        container.innerHTML = `
            ${verdictHtml}
            <div class="compare-grid">
                <!-- Card A -->
                <div class="compare-card compare-card--${locA.level_class}">
                    <div class="compare-card-header">
                        <span class="compare-card-tag">${t('compare.select_a')}</span>
                        <h3 class="compare-card-title">${nameA}</h3>
                        <div class="compare-card-score badge--${locA.level_class}">
                            ${locA.pain_level} / 10
                        </div>
                    </div>
                    <div class="compare-card-body">
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('compare.sensation')}</span>
                            <p class="compare-metric-value">${feelsA}</p>
                        </div>
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('compare.duration')}</span>
                            <p class="compare-metric-value">${durA}</p>
                        </div>
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('detail.why_hurts')}</span>
                            <p class="compare-metric-value">${whyA}</p>
                        </div>
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('compare.healing')}</span>
                            <p class="compare-metric-value">${healA}</p>
                        </div>
                    </div>
                </div>

                <!-- Card B -->
                <div class="compare-card compare-card--${locB.level_class}">
                    <div class="compare-card-header">
                        <span class="compare-card-tag">${t('compare.select_b')}</span>
                        <h3 class="compare-card-title">${nameB}</h3>
                        <div class="compare-card-score badge--${locB.level_class}">
                            ${locB.pain_level} / 10
                        </div>
                    </div>
                    <div class="compare-card-body">
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('compare.sensation')}</span>
                            <p class="compare-metric-value">${feelsB}</p>
                        </div>
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('compare.duration')}</span>
                            <p class="compare-metric-value">${durB}</p>
                        </div>
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('detail.why_hurts')}</span>
                            <p class="compare-metric-value">${whyB}</p>
                        </div>
                        <div class="compare-metric">
                            <span class="compare-metric-label">${t('compare.healing')}</span>
                            <p class="compare-metric-value">${healB}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.hidden = false;
    }
})();
