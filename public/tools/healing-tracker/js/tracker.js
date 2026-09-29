function initTracker() {
    // Elements
    const procedureType = document.getElementById('procedureType');
    const piercingLocationGroup = document.getElementById('piercingLocationGroup');
    const tattooSizeGroup = document.getElementById('tattooSizeGroup');
    const startTracking = document.getElementById('startTracking');
    const resultsSection = document.getElementById('resultsSection');

    if (!procedureType || !startTracking) return;

    // Show/hide based on procedure type
    procedureType.addEventListener('change', function() {
        if (this.value === 'piercing') {
            piercingLocationGroup.style.display = 'block';
            tattooSizeGroup.style.display = 'none';
        } else if (this.value === 'tattoo') {
            piercingLocationGroup.style.display = 'none';
            tattooSizeGroup.style.display = 'block';
        } else {
            piercingLocationGroup.style.display = 'none';
            tattooSizeGroup.style.display = 'none';
        }
    });

    // Start tracking
    startTracking.addEventListener('click', function() {
        const type = procedureType.value;
        const date = document.getElementById('procedureDate').value;

        if (!type || !date) {
            var errEl = document.getElementById('symptomResults');
            if (typeof InputGuards !== 'undefined' && InputGuards.formatError && errEl) {
                errEl.innerHTML = InputGuards.formatError(window.t('tracker.errorSelectTypeAndDate'));
                errEl.style.display = 'block';
            } else {
                alert(window.t('tracker.errorSelectTypeAndDate'));
            }
            return;
        }

        if (isNaN(new Date(date).getTime())) {
            var errEl2 = document.getElementById('symptomResults');
            if (typeof InputGuards !== 'undefined' && InputGuards.formatError && errEl2) {
                errEl2.innerHTML = InputGuards.formatError(window.t('tracker.errorValidDate'));
                errEl2.style.display = 'block';
            } else {
                alert(window.t('tracker.errorValidDate'));
            }
            return;
        }

        if (type === 'piercing') {
            const location = document.getElementById('piercingLocation').value;
            if (!location) {
                alert(window.t('tracker.errorSelectPiercingLoc'));
                return;
            }
            generatePiercingTimeline(location, date);
        } else {
            const size = document.getElementById('tattooSize').value;
            if (!size) {
                alert(window.t('tracker.errorSelectTattooSize'));
                return;
            }
            generateTattooTimeline(size, date);
        }

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        generateChecklist(type);

        const jewelrySection = document.getElementById('jewelryLongevitySection');
        if (jewelrySection) jewelrySection.style.display = type === 'piercing' ? '' : 'none';
        if (type === 'piercing' && window.JewelryLongevity) {
            window.JewelryLongevity.syncWithTracker();
            window.JewelryLongevity.calculate();
        }
        if (window.Visualizer && window.Visualizer.updateTelemetry) window.Visualizer.updateTelemetry();
    });

    // Symptom checker
    document.getElementById('checkSymptoms').addEventListener('click', function() {
        const symptoms = Array.from(document.querySelectorAll('.symptom-check:checked'));
        const resultsDiv = document.getElementById('symptomResults');

        if (symptoms.length === 0) {
            alert(window.t('tracker.errorSelectOneSymptom'));
            return;
        }

        // Check severity
        const concerning = symptoms.filter(s => s.dataset.severity === 'concerning');
        const monitor = symptoms.filter(s => s.dataset.severity === 'monitor');

        // Check for symptoms that healing discs can help with
        const symptomValues = symptoms.map(s => s.value);
        const discHelpfulSymptoms = ['moderate-swelling', 'increased-redness', 'yellow-discharge', 'warmth'];
        const needsHealingDiscs = symptomValues.some(val => discHelpfulSymptoms.includes(val));

        let severity, message, cssClass, healingDiscSolution = '';

        if (concerning.length > 0) {
            severity = window.t('tracker.severityConcerning');
            cssClass = 'concerning';
            message = window.t('tracker.msgConcerning');
            healingDiscSolution = `
                <div class="symptom-disc-solution">
                    <p><strong>${window.t('tracker.solutionConcerningTitle')}</strong> ${window.t('tracker.solutionConcerningBody')}</p>
                </div>
            `;
        } else if (monitor.length > 0) {
            severity = window.t('tracker.severityMonitor');
            cssClass = 'monitor';
            message = window.t('tracker.msgMonitor');
            if (needsHealingDiscs) {
                healingDiscSolution = `
                    <div class="symptom-disc-solution">
                        <p><strong>${window.t('tracker.solutionMonitorTitle')}</strong> ${window.t('tracker.solutionMonitorIntro')}</p>
                        <ul>
                            <li>${window.t('tracker.solutionMonitorBenefit1')}</li>
                            <li>${window.t('tracker.solutionMonitorBenefit2')}</li>
                            <li>${window.t('tracker.solutionMonitorBenefit3')}</li>
                            <li>${window.t('tracker.solutionMonitorBenefit4')}</li>
                        </ul>
                        <p>${window.t('tracker.solutionMonitorOutro')}</p>
                    </div>
                `;
            }
        } else {
            severity = window.t('tracker.severityNormal');
            cssClass = 'normal';
            message = window.t('tracker.msgNormal');
            healingDiscSolution = `
                <div class="symptom-disc-solution">
                    <p><strong>${window.t('tracker.solutionNormalTitle')}</strong> ${window.t('tracker.solutionNormalBody')}</p>
                </div>
            `;
        }

        resultsDiv.innerHTML = `
            <h4>${severity}</h4>
            <p>${message}</p>
            ${healingDiscSolution}
        `;
        resultsDiv.className = 'healing-tracker__symptom-results ' + cssClass;
        resultsDiv.style.display = 'block';
    });

    // Reset checklist
    const resetChecklistBtn = document.getElementById('resetChecklist');
    if (resetChecklistBtn) {
        resetChecklistBtn.addEventListener('click', function() {
            document.querySelectorAll('#aftercareChecklist input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracker);
} else {
    initTracker();
}

// Index of the stage a procedure is in, from English names like "Week 3-6: Active
// Healing". Stage i starts on the first day of its lower bound; the last stage
// that has started is current. Unparseable names fall back to the first stage.
function currentStageIndex(group, key, count, daysElapsed) {
    const en = window.I18N_DICTIONARY && window.I18N_DICTIONARY.en;
    const stages = en && en[group] && en[group][key] && en[group][key].stages;
    const UNIT = { day: 1, week: 7, month: 30 };
    const day = daysElapsed + 1;
    let current = 0;
    for (let i = 0; i < count; i++) {
        const m = /^(Day|Week|Month)s?\s+(\d+)/i.exec((stages && stages[i] && stages[i].stage) || '');
        if (m && (Number(m[2]) - 1) * UNIT[m[1].toLowerCase()] + 1 <= day) current = i;
    }
    return current;
}

function stageCards(stages, active) {
    return stages.map((stage, i) => `
                <div class="stage-card${i === active ? ' timeline-step--active' : ''}"${i === active ? ' aria-current="step"' : ''}>
                    <h4 class="timeline-step__title">${stage.stage}</h4>
                    <p><strong>${window.t('tracker.whatToExpect')}</strong></p>
                    <ul>${stage.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
                    <p><strong>${window.t('tracker.careInstructions')}</strong></p>
                    <ul>${stage.care.map(c => `<li>${c}</li>`).join('')}</ul>
                </div>
            `).join('');
}

function generatePiercingTimeline(location, date) {
    const timeline = piercingTimelines[location];
    if (!timeline) return;

    // Validate date input
    if (!date || isNaN(new Date(date).getTime())) {
        if (typeof InputGuards !== 'undefined' && InputGuards.formatError) {
            document.getElementById('symptomResults').innerHTML = InputGuards.formatError(window.t('tracker.errorValidDate'));
            document.getElementById('symptomResults').style.display = 'block';
        } else {
            alert(window.t('tracker.errorValidDate'));
        }
        return;
    }
    const procDate = new Date(date);
    const today = new Date();
    const daysElapsed = Math.max(0, Math.floor((today - procDate) / (1000 * 60 * 60 * 24)));

    // Build healing disc recommendation if applicable
    let healingDiscAlert = '';
    if (timeline.healingDiscRecommended) {
        healingDiscAlert = `
            <div class="healing-disc-recommendation">
                <div class="healing-disc-rec-icon">💎</div>
                <div class="healing-disc-rec-content">
                    <h4>${window.t('tracker.healingDiscRecTitle', { name: timeline.name })}</h4>
                    <p>${timeline.healingDiscBenefits}</p>
                    <p class="healing-disc-rec-footer">
                        ${window.t('tracker.healingDiscRecFooter')}
                    </p>
                </div>
            </div>
        `;
    }

    document.getElementById('timelineResults').innerHTML = `
        <div class="timeline-header">
            <h3>${window.t('tracker.piercingTitle', { name: timeline.name })}</h3>
            <p>${window.t('tracker.dayOfHealing', { day: daysElapsed })}</p>
            <p>${window.t('tracker.typicalHealingTime', { time: timeline.healing })}</p>
        </div>
        ${healingDiscAlert}
        <div class="timeline-stages">
            ${stageCards(timeline.stages, currentStageIndex('piercingTimeline', location, timeline.stages.length, daysElapsed))}
        </div>
    `;
}

function generateTattooTimeline(size, date) {
    const timeline = tattooTimelines[size];
    if (!timeline) return;

    // Validate date input
    if (!date || isNaN(new Date(date).getTime())) {
        if (typeof InputGuards !== 'undefined' && InputGuards.formatError) {
            document.getElementById('symptomResults').innerHTML = InputGuards.formatError(window.t('tracker.errorValidDate'));
            document.getElementById('symptomResults').style.display = 'block';
        } else {
            alert(window.t('tracker.errorValidDate'));
        }
        return;
    }
    const procDate = new Date(date);
    const today = new Date();
    const daysElapsed = Math.max(0, Math.floor((today - procDate) / (1000 * 60 * 60 * 24)));
    const sizeName = size.charAt(0).toUpperCase() + size.slice(1);

    document.getElementById('timelineResults').innerHTML = `
        <div class="timeline-header">
            <h3>${window.t('tracker.tattooTitle', { size: sizeName })}</h3>
            <p>${window.t('tracker.dayOfHealing', { day: daysElapsed })}</p>
            <p>${window.t('tracker.typicalSurfaceHealing', { time: timeline.healing })}</p>
        </div>
        <div class="timeline-stages">
            ${stageCards(timeline.stages, currentStageIndex('tattooTimeline', size, timeline.stages.length, daysElapsed))}
        </div>
    `;
}

function generateChecklist(type) {
    const checklistDiv = document.getElementById('aftercareChecklist');

    const piercingKeys = [
        'tracker.checklist.piercing1',
        'tracker.checklist.piercing2',
        'tracker.checklist.piercing3',
        'tracker.checklist.piercing4',
        'tracker.checklist.piercing5',
        'tracker.checklist.piercing6',
        'tracker.checklist.piercing7',
        'tracker.checklist.piercing8'
    ];

    const tattooKeys = [
        'tracker.checklist.tattoo1',
        'tracker.checklist.tattoo2',
        'tracker.checklist.tattoo3',
        'tracker.checklist.tattoo4',
        'tracker.checklist.tattoo5',
        'tracker.checklist.tattoo6'
    ];

    const keys = type === 'piercing' ? piercingKeys : tattooKeys;

    checklistDiv.innerHTML = keys.map((key, i) => `
        <label class="checklist-item">
            <input type="checkbox" id="check${i}">
            <span>${window.t(key)}</span>
        </label>
    `).join('');

    if (window.ProTips && typeof window.ProTips.update === 'function') {
        const procDateInput = document.getElementById('procedureDate');
        const procDateVal = procDateInput ? procDateInput.value : null;
        let dayOffset = 0;
        if (procDateVal && !isNaN(new Date(procDateVal).getTime())) {
            const today = new Date();
            dayOffset = Math.max(0, Math.floor((today - new Date(procDateVal)) / (1000 * 60 * 60 * 24)));
        }
        window.ProTips.update(type, dayOffset);
    }
}
