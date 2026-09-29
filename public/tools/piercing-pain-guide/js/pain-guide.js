// ═══════════════════════════════════════════════════════════════
// PAIN-GUIDE.JS - Main Application Logic & Section Orchestration (V2)
// Seamless coordination between Body Map, Comparison, Quiz, and Prep Sheet.
// ═══════════════════════════════════════════════════════════════

(function() {
    window.currentProcedure = 'piercing'; // Default primary focus
    window.selectedLocation = 'earlobe';  // Initial inspection location

    document.addEventListener('DOMContentLoaded', function() {
        initializeProcedureToggle();
        initializeSectionControls();
        initializeQuickLinks();
        initializePreparationTabs();
        initializePrintSheet();
        populateLocationSelector();

        // Initial render of default location
        window.displayPainInfo('earlobe');

        window.addEventListener('languageChanged', function() {
            populateLocationSelector();
            if (window.selectedLocation) {
                window.displayPainInfo(window.selectedLocation);
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // PROCEDURE TOGGLE (Piercing vs Tattoo)
    // ═══════════════════════════════════════════════════════════════
    function initializeProcedureToggle() {
        const piercingBtn = document.getElementById('piercingBtn');
        const tattooBtn = document.getElementById('tattooBtn');
        if (!piercingBtn || !tattooBtn) return;

        piercingBtn.addEventListener('click', function() {
            switchProcedure('piercing', piercingBtn, tattooBtn);
        });

        tattooBtn.addEventListener('click', function() {
            switchProcedure('tattoo', tattooBtn, piercingBtn);
        });
    }

    function switchProcedure(type, activeBtn, inactiveBtn) {
        if (window.currentProcedure === type) return;

        window.currentProcedure = type;

        activeBtn.classList.add('procedure-btn--active');
        activeBtn.setAttribute('aria-pressed', 'true');
        inactiveBtn.classList.remove('procedure-btn--active');
        inactiveBtn.setAttribute('aria-pressed', 'false');

        // Set default location for new procedure
        window.selectedLocation = type === 'piercing' ? 'earlobe' : 'outer_shoulder';

        if (typeof window.updateBodyMap === 'function') {
            window.updateBodyMap(type);
        }

        populateLocationSelector();
        if (typeof window.populateComparisonDropdowns === 'function') {
            window.populateComparisonDropdowns();
        }

        window.displayPainInfo(window.selectedLocation);
    }

    // ═══════════════════════════════════════════════════════════════
    // LOCATION SELECTOR POPULATION
    // ═══════════════════════════════════════════════════════════════
    function populateLocationSelector() {
        const selector = document.getElementById('locationSelector');
        if (!selector) return;

        const db = window.getPainDatabase(window.currentProcedure);
        const t = window.t || (k => k);

        let optionsHtml = `<option value="">-- ${t('map.select_location')} --</option>`;
        for (const [id, loc] of Object.entries(db)) {
            const locName = loc.nameKey ? t(loc.nameKey) : loc.name;
            const isSel = (id === window.selectedLocation) ? 'selected' : '';
            optionsHtml += `<option value="${id}" ${isSel}>${locName} (${loc.pain_level}/10)</option>`;
        }

        selector.innerHTML = optionsHtml;
        selector.addEventListener('change', function(e) {
            const locId = e.target.value;
            if (locId) {
                window.displayPainInfo(locId);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // DISPLAY LOCATION PAIN DETAILS
    // ═══════════════════════════════════════════════════════════════
    window.displayPainInfo = function(locationKey) {
        const db = window.getPainDatabase(window.currentProcedure);
        const location = db[locationKey];
        if (!location) return;

        window.selectedLocation = locationKey;
        if (typeof window.refreshBodyMapSelection === 'function') {
            window.refreshBodyMapSelection(locationKey);
        }

        const detailsPanel = document.getElementById('painDetails');
        const welcomePanel = document.getElementById('welcomeMessage');
        if (welcomePanel) welcomePanel.style.display = 'none';
        if (detailsPanel) detailsPanel.style.display = 'block';

        const t = window.t || (k => k);
        const locName = location.nameKey ? t(location.nameKey) : location.name;
        const category = location.categoryKey ? t(location.categoryKey) : location.category;
        const whyHurts = location.why_hurts_key ? t(location.why_hurts_key) : location.why_hurts;
        const feelsLike = location.feels_like_key ? t(location.feels_like_key) : location.feels_like;
        const duration = location.duration_key ? t(location.duration_key) : location.duration;
        const healingPain = location.healing_pain_key ? t(location.healing_pain_key) : location.healing_pain;
        const healingTime = location.healing_time_key ? t(location.healing_time_key) : location.healing_time;

        // Title and Score
        const nameEl = document.getElementById('locationName');
        const ratingEl = document.getElementById('painRating');
        const categoryEl = document.getElementById('painCategory');

        if (nameEl) nameEl.textContent = locName;
        if (ratingEl) {
            ratingEl.textContent = `${location.pain_level} / 10`;
            ratingEl.className = `pain-rating-badge badge--${location.level_class}`;
        }
        if (categoryEl) {
            categoryEl.textContent = category;
            categoryEl.className = `pain-category-label category--${location.level_class}`;
        }

        // Detailed Paragraphs
        const whyEl = document.getElementById('whyHurts');
        const feelsEl = document.getElementById('feelsLike');
        const durationEl = document.getElementById('duration');
        const healTimeEl = document.getElementById('healingTime');
        const healPainEl = document.getElementById('healingPain');

        if (whyEl) whyEl.textContent = whyHurts;
        if (feelsEl) feelsEl.textContent = feelsLike;
        if (durationEl) durationEl.textContent = duration;
        if (healTimeEl) healTimeEl.textContent = healingTime;
        if (healPainEl) healPainEl.textContent = healingPain;

        // Factors List
        const factorsContainer = document.getElementById('factorsList');
        if (factorsContainer && location.factors) {
            const factorsList = location.factor_keys 
                ? location.factor_keys.map(k => `<li>${t(k)}</li>`)
                : location.factors.map(f => `<li>${f}</li>`);
            factorsContainer.innerHTML = factorsList.join('');
        }

        // Related Studio Guides (Ban 18: target="_top")
        const linksContainer = document.getElementById('relatedGuideLinks');
        if (linksContainer) {
            if (location.related_tool) {
                const toolLabel = location.related_tool.label_key 
                    ? t(location.related_tool.label_key) 
                    : location.related_tool.label;
                linksContainer.innerHTML = `
                    <div class="related-tool-chip">
                        <span class="chip-label">${t('detail.related_tools')}:</span>
                        <a href="${location.related_tool.url}" target="_top" rel="noopener" class="chip-link">
                            ${toolLabel} ↗
                        </a>
                    </div>
                `;
            } else {
                linksContainer.innerHTML = '';
            }
        }

        // Sync dropdown value
        const selector = document.getElementById('locationSelector');
        if (selector && selector.value !== locationKey) {
            selector.value = locationKey;
        }

        // Render Sensory Breakdown Visualizer (4 dimensions)
        renderSensoryProfile(location);
    };

    function renderSensoryProfile(loc) {
        const sensoryCard = document.getElementById('sensoryBreakdownCard');
        if (!sensoryCard) return;

        const sensory = loc.sensory || { sharpness: 3, pressure: 3, duration: 3, aftercare: 3 };

        // Dimensions (values 1 to 10)
        const dims = [
            { key: 'sharpness', val: sensory.sharpness, labelKey: 'sensory.sharpness' },
            { key: 'pressure', val: sensory.pressure, labelKey: 'sensory.pressure' },
            { key: 'duration', val: sensory.duration, labelKey: 'sensory.duration' },
            { key: 'aftercare', val: sensory.aftercare, labelKey: 'sensory.aftercare' }
        ];

        const container = document.getElementById('sensoryBarsContainer');
        if (container) {
            const html = dims.map(function(d) {
                const pct = Math.min(100, Math.max(10, d.val * 10));
                let colorClass = 'sensory-bar--low';
                if (d.val >= 7) {
                    colorClass = 'sensory-bar--high';
                } else if (d.val >= 4) {
                    colorClass = 'sensory-bar--mid';
                }

                return `
                    <div class="sensory-item">
                        <div class="sensory-item-header">
                            <span class="sensory-item-title">${window.t(d.labelKey)}</span>
                            <span class="sensory-item-rating">${d.val} / 10</span>
                        </div>
                        <div class="sensory-track" role="progressbar" aria-valuenow="${d.val}" aria-valuemin="1" aria-valuemax="10" aria-label="${window.t(d.labelKey)}">
                            <svg class="sensory-bar-svg" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                                <rect class="sensory-track-bg" x="0" y="0" width="100" height="12" rx="4" />
                                <rect class="sensory-fill ${colorClass}" x="0" y="0" width="${pct}" height="12" rx="4" />
                            </svg>
                        </div>
                    </div>
                `;
            }).join('');
            container.innerHTML = html;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // SECTION VISIBILITY & NAVIGATION LINKS
    // ═══════════════════════════════════════════════════════════════
    function initializeQuickLinks() {
        const links = document.querySelectorAll('[data-goto-section]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetSecId = this.getAttribute('data-goto-section');
                openAndScrollToSection(targetSecId);
            });
        });
    }

    function openAndScrollToSection(secId) {
        const section = document.getElementById(secId);
        if (!section) return;

        section.style.display = 'block';
        section.hidden = false;
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function initializeSectionControls() {
        const closeButtons = document.querySelectorAll('.close-section-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const secId = this.getAttribute('data-section');
                const section = document.getElementById(secId);
                if (section) {
                    section.style.display = 'none';
                    section.hidden = true;
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // PREPARATION TABS
    // ═══════════════════════════════════════════════════════════════
    function initializePreparationTabs() {
        const tabs = document.querySelectorAll('.prep-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('prep-tab--active'));
                this.classList.add('prep-tab--active');

                document.querySelectorAll('.prep-tab-content').forEach(content => {
                    content.classList.remove('prep-tab-content--active');
                });

                const activeContent = document.getElementById(`${targetTab}Tab`);
                if (activeContent) {
                    activeContent.classList.add('prep-tab-content--active');
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // STUDIO CONSULTATION PREP SHEET (Printable)
    // ═══════════════════════════════════════════════════════════════
    function initializePrintSheet() {
        const printBtn = document.getElementById('printSheetBtn');
        const clearBtn = document.getElementById('clearSheetBtn');
        const printError = document.getElementById('printSheetError');

        if (printBtn) {
            printBtn.addEventListener('click', function() {
                const placementInput = document.getElementById('prepPlacement');
                if (!placementInput || !placementInput.value.trim()) {
                    if (printError) {
                        printError.textContent = window.t('printsheet.validation_error') || 'Please specify an intended piercing placement before printing.';
                        printError.hidden = false;
                        placementInput.focus();
                    }
                    return;
                }

                if (printError) printError.hidden = true;

                // Call native browser print dialog
                window.print();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                const form = document.getElementById('printSheetForm');
                if (form) form.reset();
                if (printError) printError.hidden = true;
            });
        }

        const printPocketCardBtn = document.getElementById('printPocketCardBtn');
        if (printPocketCardBtn) {
            printPocketCardBtn.addEventListener('click', function() {
                window.print();
            });
        }
    }
})();
