/* =====================================================
   TOUCH-UP TIMELINE UI INTERACTION CONTROLLER
   Manages tab switching, form handling, visual timelines
   ===================================================== */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTouchUpTool);
} else {
  initTouchUpTool();
}

function initTouchUpTool() {
  initTouchUpTabs();
  initTouchUpForms();
  initTouchUpReminderSystem();
}

/**
 * Initialize Touch-Up sub-tabs
 */
function initTouchUpTabs() {
  const tabs = document.querySelectorAll('.touch-up-timeline__tab');
  const contents = document.querySelectorAll('.touch-up-timeline__tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      // Update tab active states
      tabs.forEach(t => t.classList.remove('touch-up-timeline__tab--active'));
      tab.classList.add('touch-up-timeline__tab--active');

      // Update content active states
      contents.forEach(content => {
        content.classList.remove('touch-up-timeline__tab-content--active');
        if (content.id === `tab-${targetTab}`) {
          content.classList.add('touch-up-timeline__tab-content--active');
        }
      });
    });
  });
}

/**
 * Initialize Touch-Up Reminder System
 */
function initTouchUpReminderSystem() {
  const neverTouchedUpCheck = document.getElementById('neverTouchedUpCheck');
  const lastTouchUpDateInput = document.getElementById('lastTouchUpDate');
  const dismissBtn = document.getElementById('touchUpReminderDismissBtn');
  const clearBtn = document.getElementById('touchUpReminderClearBtn');

  if (neverTouchedUpCheck && lastTouchUpDateInput) {
    neverTouchedUpCheck.addEventListener('change', function() {
      if (this.checked) {
        lastTouchUpDateInput.disabled = true;
        lastTouchUpDateInput.value = '';
      } else {
        lastTouchUpDateInput.disabled = false;
        if (!lastTouchUpDateInput.value) {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          lastTouchUpDateInput.value = window.localISODate(oneYearAgo);
        }
      }
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      const banner = document.getElementById('touchUpReminderBanner');
      if (banner) banner.style.display = 'none';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem('poli_touchup_reminder');
        const banner = document.getElementById('touchUpReminderBanner');
        if (banner) banner.style.display = 'none';
        clearBtn.style.display = 'none';
      } catch (err) {
        console.error('Failed to clear reminder', err);
      }
    });
  }

  // Restore saved reminder on load
  try {
    const savedJson = localStorage.getItem('poli_touchup_reminder');
    if (savedJson) {
      const saved = JSON.parse(savedJson);
      if (saved) {
        if (clearBtn) clearBtn.style.display = 'inline-block';

        const tattooAgeInput = document.getElementById('tattooAge');
        const tattooStyleInput = document.getElementById('tattooStyle');
        const bodyLocationInput = document.getElementById('bodyLocation');

        if (tattooAgeInput && saved.tattooAge !== undefined) tattooAgeInput.value = saved.tattooAge;
        if (neverTouchedUpCheck) {
          neverTouchedUpCheck.checked = !!saved.neverTouchedUp;
          if (lastTouchUpDateInput) {
            lastTouchUpDateInput.disabled = !!saved.neverTouchedUp;
            if (!saved.neverTouchedUp && saved.lastTouchUpDate) {
              lastTouchUpDateInput.value = saved.lastTouchUpDate;
            }
          }
        }
        if (tattooStyleInput && saved.style) tattooStyleInput.value = saved.style;
        if (bodyLocationInput && saved.bodyLocation) bodyLocationInput.value = saved.bodyLocation;

        const results = TattooCalculators.calculateTouchUpTimeline({
          tattooAge: saved.tattooAge || 0,
          style: saved.style || 'black_and_grey',
          colors: saved.colors || [],
          bodyLocation: saved.bodyLocation || 'occasionally_exposed',
          sunExposure: saved.sunExposure || 'low',
          careLevel: saved.careLevel || 'good',
          lastTouchUpDate: saved.lastTouchUpDate,
          neverTouchedUp: saved.neverTouchedUp
        });

        if (results && (results.reminderStatus === 'overdue' || results.reminderStatus === 'due_soon')) {
          renderTouchUpReminder(results, saved);
        }
      }
    }
  } catch (e) {
    console.warn('Error reading saved touch-up reminder', e);
  }
}

/**
 * Initialize Forms and Event Listeners
 */
function initTouchUpForms() {
  // Main Touch-Up Calculator Form
  const touchUpForm = document.getElementById('touchUpForm');
  if (touchUpForm) {
    touchUpForm.addEventListener('submit', handleTouchUpCalculation);

    // Live Special Pigments Warning trigger
    const updatePigmentWarning = function() {
      const warningEl = document.getElementById('specialPigmentWarning');
      if (!warningEl) return;
      const specialChecked = document.querySelector('input[name="colors"][value="uv_reactive"]:checked, input[name="colors"][value="organic_inks"]:checked');
      if (specialChecked) {
        warningEl.style.display = 'flex';
      } else {
        warningEl.style.display = 'none';
      }
    };

    touchUpForm.addEventListener('change', function(e) {
      if (e.target && e.target.name === 'colors') {
        updatePigmentWarning();
      }
    });
    updatePigmentWarning();
  }

  // Sun Damage Impact Calculator
  const calculateSunBtn = document.getElementById('calculateSun');
  if (calculateSunBtn) {
    calculateSunBtn.addEventListener('click', handleSunDamageCalculation);
  }

  // Lifetime Cost Form
  const costForm = document.getElementById('costForm');
  if (costForm) {
    costForm.addEventListener('submit', handleCostCalculation);
  }

  // Readiness Assessment Form
  const readinessForm = document.getElementById('readinessForm');
  if (readinessForm) {
    readinessForm.addEventListener('submit', handleReadinessCheck);
  }
}

/**
 * Handle Touch-Up Timeline Calculation
 */
function handleTouchUpCalculation(e) {
  e.preventDefault();

  // Gather form data
  const tattooAgeInput = document.getElementById('tattooAge');
  const lastTouchUpDateInput = document.getElementById('lastTouchUpDate');
  const neverTouchedUpCheck = document.getElementById('neverTouchedUpCheck');
  const tattooStyleInput = document.getElementById('tattooStyle');
  const bodyLocationInput = document.getElementById('bodyLocation');
  const sunExposureInput = document.querySelector('input[name="sunExposure"]:checked');
  const careLevelInput = document.querySelector('input[name="careLevel"]:checked');
  const colorCheckboxes = document.querySelectorAll('input[name="colors"]:checked');

  const isNever = neverTouchedUpCheck ? neverTouchedUpCheck.checked : true;
  const lastDate = !isNever && lastTouchUpDateInput ? lastTouchUpDateInput.value : null;

  const formData = {
    tattooAge: tattooAgeInput ? parseFloat(tattooAgeInput.value) || 0 : 0,
    lastTouchUpDate: lastDate,
    neverTouchedUp: isNever,
    style: tattooStyleInput ? tattooStyleInput.value : '',
    colors: Array.from(colorCheckboxes).map(cb => cb.value),
    bodyLocation: bodyLocationInput ? bodyLocationInput.value : 'occasionally_exposed',
    sunExposure: sunExposureInput ? sunExposureInput.value : 'low',
    careLevel: careLevelInput ? careLevelInput.value : 'good'
  };

  // Perform calculation
  const results = TattooCalculators.calculateTouchUpTimeline(formData);

  if (results) {
    displayTouchUpResults(results, formData);
    displayFadingPredictor(results);
  }
}

/**
 * Display Results for Main Calculator
 */
function displayTouchUpResults(results, formData) {
  const resultsDiv = document.getElementById('touchUpResults');
  if (!resultsDiv) return;

  resultsDiv.style.display = 'block';

  // Urgency indicator
  const urgencyCard = document.getElementById('urgencyIndicator');
  const urgencyLevel = document.getElementById('urgencyLevel');
  const urgencyMessage = document.getElementById('urgencyMessage');

  if (urgencyCard && urgencyLevel && urgencyMessage) {
    urgencyCard.className = `touch-up-timeline__urgency-card ${results.urgency.statusClass || ''}`;
    urgencyLevel.textContent = `${results.urgency.icon} ${results.urgency.level}`;
    urgencyMessage.textContent = results.urgency.message;
  }

  // Render Touch-Up Reminder Alert and Card
  renderTouchUpReminder(results, formData || {
    tattooAge: results.currentAge,
    lastTouchUpDate: results.lastTouchUpDate,
    neverTouchedUp: !results.lastTouchUpDate
  });

  // Stats
  const currentAgeDisplay = document.getElementById('currentAgeDisplay');
  const touchUpTime = document.getElementById('touchUpTime');
  const fadingProgress = document.getElementById('fadingProgress');

  if (currentAgeDisplay) {
    currentAgeDisplay.textContent = TattooCalculators.formatYears(results.currentAge);
  }
  if (touchUpTime) {
    touchUpTime.textContent = TattooCalculators.formatYears(results.yearsRemaining);
  }
  if (fadingProgress) {
    fadingProgress.textContent = `${results.fadingProgress}%`;
  }

  // Fading Order
  const fadingList = document.getElementById('fadingList');
  if (fadingList) {
    fadingList.innerHTML = '';
    if (results.fadingOrder.length > 0) {
      results.fadingOrder.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'touch-up-timeline__fading-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'touch-up-timeline__fading-item-name';
        nameSpan.textContent = `${index + 1}. ${item.color}`;

        const yearSpan = document.createElement('span');
        yearSpan.className = 'touch-up-timeline__fading-item-years';
        yearSpan.textContent = window.t('touchup.approxYears', { years: item.years });

        div.appendChild(nameSpan);
        div.appendChild(yearSpan);
        fadingList.appendChild(div);
      });
    } else {
      const p = document.createElement('p');
      p.className = 'touch-up-timeline__empty-text';
      p.textContent = window.t('touchup.selectColorsPrompt');
      fadingList.appendChild(p);
    }
  }

  // Recommendations
  const recList = document.getElementById('recommendationsList');
  if (recList) {
    recList.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'touch-up-timeline__recommendation-list';

    results.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.className = `touch-up-timeline__recommendation-item ${rec.priority === 'high' ? 'touch-up-timeline__recommendation-item--high' : ''}`;

      const icon = document.createElement('span');
      icon.className = 'touch-up-timeline__rec-icon';
      if (rec.type === 'care') icon.textContent = '🧴';
      else if (rec.type === 'sun') icon.textContent = '☀️';
      else if (rec.type === 'location') icon.textContent = '📍';
      else if (rec.type === 'color') icon.textContent = '🎨';
      else if (rec.type === 'urgent') icon.textContent = '🚨';
      else icon.textContent = '💡';

      const text = document.createElement('span');
      text.className = 'touch-up-timeline__rec-text';
      text.textContent = rec.text;

      li.appendChild(icon);
      li.appendChild(text);
      ul.appendChild(li);
    });

    recList.appendChild(ul);
  }

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Render Touch-Up Reminder Alert Banner & Status Card
 */
function renderTouchUpReminder(results, formData) {
  const reminderBanner = document.getElementById('touchUpReminderBanner');
  const reminderCard = document.getElementById('touchUpReminderCard');
  const reminderBadge = document.getElementById('touchUpReminderBadge');
  const reminderTimeMeta = document.getElementById('touchUpReminderTimeMeta');
  const reminderBody = document.getElementById('touchUpReminderBody');
  const statusBadge = document.getElementById('touchUpReminderStatusBadge');
  const cardText = document.getElementById('touchUpReminderCardText');
  const metaDate = document.getElementById('touchUpReminderMetaDate');
  const metaElapsed = document.getElementById('touchUpReminderMetaElapsed');
  const metaNext = document.getElementById('touchUpReminderMetaNext');

  if (!results) return;

  const tattooAge = results.currentAge;
  const isNever = formData ? (formData.neverTouchedUp || !formData.lastTouchUpDate) : !results.lastTouchUpDate;
  const lastDateStr = !isNever && formData && formData.lastTouchUpDate ? formData.lastTouchUpDate : (results.lastTouchUpDate || null);
  const elapsedYears = results.yearsSinceLastTouchUp !== null && results.yearsSinceLastTouchUp !== undefined 
    ? results.yearsSinceLastTouchUp 
    : tattooAge;
  const elapsedText = TattooCalculators.formatYears(elapsedYears);
  const longevity = results.totalLongevity;
  const remaining = results.yearsRemaining;
  const status = results.reminderStatus || 'on_track';

  let badgeText = '';
  let badgeClass = '';
  let alertMessage = '';
  let cardMessage = '';

  if (status === 'overdue') {
    badgeText = (window.t && window.t('touchup.reminder.badgeOverdue')) || '⚠️ TOUCH-UP OVERDUE';
    badgeClass = 'touch-up-reminder-badge--overdue';
    alertMessage = (window.t && window.t('touchup.reminder.msgOverdue', {
      tattooAge: tattooAge,
      elapsed: elapsedText,
      date: lastDateStr || ((window.t && window.t('touchup.reminder.initialSession')) || 'initial session'),
      longevity: longevity
    })) || `Your tattoo was completed ${tattooAge} years ago, and ${elapsedText} has elapsed since your last recorded touch-up. The projected longevity before touch-up was ${longevity} years. Contact an artist to assess line clarity and prevent fading.`;
    cardMessage = alertMessage;
  } else if (status === 'due_soon') {
    badgeText = (window.t && window.t('touchup.reminder.badgeDueSoon')) || '⏰ TOUCH-UP DUE SOON';
    badgeClass = 'touch-up-reminder-badge--duesoon';
    const monthsRemaining = Math.max(1, Math.round(remaining * 12));
    alertMessage = (window.t && window.t('touchup.reminder.msgDueSoon', {
      tattooAge: tattooAge,
      elapsed: elapsedText,
      date: lastDateStr || ((window.t && window.t('touchup.reminder.initialSession')) || 'initial session'),
      months: monthsRemaining,
      longevity: longevity
    })) || `Your tattoo was completed ${tattooAge} years ago (last touch-up: ${elapsedText} ago). You have approximately ${monthsRemaining} months remaining before your projected touch-up threshold of ${longevity} years.`;
    cardMessage = alertMessage;
  } else {
    badgeText = (window.t && window.t('touchup.reminder.badgeOnTrack')) || '✅ PIGMENT HEALTHY & ON TRACK';
    badgeClass = 'touch-up-reminder-badge--ontrack';
    alertMessage = (window.t && window.t('touchup.reminder.msgOnTrack', {
      date: lastDateStr || ((window.t && window.t('touchup.reminder.initialSession')) || 'initial session'),
      elapsed: elapsedText,
      years: remaining
    })) || `Your tattoo pigment is currently in its optimal durability window. Last touch-up was ${elapsedText} ago. Your next recommended review is projected in ${remaining} years.`;
    cardMessage = alertMessage;
  }

  // Update top banner
  if (reminderBanner && reminderBadge && reminderBody) {
    reminderBanner.className = `touch-up-reminder-banner touch-up-reminder-banner--${status}`;
    reminderBadge.textContent = badgeText;
    reminderBadge.className = `touch-up-reminder-badge ${badgeClass}`;
    if (reminderTimeMeta) {
      reminderTimeMeta.textContent = `Age: ${tattooAge}y • Wear: ${elapsedText}`;
    }
    reminderBody.textContent = alertMessage;
    reminderBanner.style.display = 'block';
  }

  // Update result card
  if (reminderCard && statusBadge && cardText) {
    reminderCard.className = `touch-up-reminder-card touch-up-reminder-card--${status}`;
    statusBadge.textContent = badgeText;
    statusBadge.className = `touch-up-reminder-badge ${badgeClass}`;
    cardText.textContent = cardMessage;

    if (metaDate) {
      metaDate.textContent = lastDateStr || ((window.t && window.t('touchup.calc.neverTouchedUp')) || 'Never (Original Ink)');
    }
    if (metaElapsed) {
      metaElapsed.textContent = elapsedText;
    }
    if (metaNext) {
      metaNext.textContent = remaining === 0 ? ((window.t && window.t('touchup.reminder.immediately')) || 'Now (overdue)') : ((window.t && window.t('touchup.reminder.inTime', { time: TattooCalculators.formatYears(remaining) })) || `In ${remaining} years`);
    }
    reminderCard.style.display = 'block';
  }

  // Setup save button
  const saveBtn = document.getElementById('saveTouchUpReminderBtn');
  if (saveBtn) {
    saveBtn.onclick = function() {
      saveTouchUpReminderRecord({
        tattooAge: tattooAge,
        lastTouchUpDate: lastDateStr,
        neverTouchedUp: isNever,
        style: formData ? formData.style : '',
        bodyLocation: formData ? formData.bodyLocation : '',
        sunExposure: formData ? formData.sunExposure : 'low',
        careLevel: formData ? formData.careLevel : 'good',
        colors: formData ? formData.colors : [],
        totalLongevity: longevity,
        status: status,
        savedDate: new Date().toISOString()
      });
    };
  }
}

/**
 * Save Reminder Settings to LocalStorage
 */
function saveTouchUpReminderRecord(record) {
  try {
    localStorage.setItem('poli_touchup_reminder', JSON.stringify(record));
    const notice = document.getElementById('touchUpReminderSavedNotice');
    if (notice) {
      notice.style.display = 'inline-block';
      setTimeout(() => { notice.style.display = 'none'; }, 4500);
    }
    const clearBtn = document.getElementById('touchUpReminderClearBtn');
    if (clearBtn) clearBtn.style.display = 'inline-block';
  } catch (e) {
    console.error('Failed to save touch-up reminder', e);
  }
}

/**
 * Display Fading Predictor Tab Content
 */
function displayFadingPredictor(results) {
  const fadingInfoCard = document.getElementById('fadingInfoCard');
  const fadingPrediction = document.getElementById('fadingPrediction');

  if (fadingInfoCard) fadingInfoCard.style.display = 'none';
  if (fadingPrediction) fadingPrediction.style.display = 'block';

  createVisualTimeline(results);
  createCareComparison(results);
}

/**
 * Create Visual Progression Bar Timeline
 */
function createVisualTimeline(results) {
  const timeline = document.getElementById('visualTimeline');
  if (!timeline) return;

  timeline.innerHTML = '';
  const maxYears = Math.ceil(results.totalLongevity * 1.5);
  const currentAge = results.currentAge;

  for (let year = 0; year <= maxYears; year += 2) {
    const marker = document.createElement('div');
    marker.className = 'touch-up-timeline__timeline-marker';

    const yearLabel = document.createElement('span');
    yearLabel.className = 'touch-up-timeline__marker-label';
    yearLabel.textContent = window.t('touchup.yearLabel', { year: year });

    const barContainer = document.createElement('div');
    barContainer.className = 'touch-up-timeline__marker-bar-container';

    const bar = document.createElement('div');
    bar.className = 'touch-up-timeline__marker-bar';

    let fadingPercent = (year / results.totalLongevity) * 100;
    fadingPercent = Math.min(100, fadingPercent);

    if (fadingPercent < 40) {
      bar.classList.add('fading-phase-green');
    } else if (fadingPercent < 70) {
      bar.classList.add('fading-phase-yellow');
    } else if (fadingPercent < 90) {
      bar.classList.add('fading-phase-orange');
    } else {
      bar.classList.add('fading-phase-red');
    }

    if (year > currentAge) {
      bar.classList.add('fading-future');
    }

    if (year === Math.floor(currentAge) || (year <= currentAge && year + 2 > currentAge)) {
      const indicator = document.createElement('div');
      indicator.className = 'touch-up-timeline__current-age-badge';
      indicator.textContent = window.t('touchup.currentAgeBadge');
      bar.appendChild(indicator);
    }

    barContainer.appendChild(bar);
    marker.appendChild(yearLabel);
    marker.appendChild(barContainer);
    timeline.appendChild(marker);
  }
}

/**
 * Create Care Comparison Cards
 */
function createCareComparison(results) {
  const comparison = document.getElementById('careComparison');
  if (!comparison) return;

  comparison.innerHTML = '';

  const comparisonData = [
    {
      label: window.t('touchup.careExcellentLabel'),
      years: Math.round(results.totalLongevity * 1.3 * 10) / 10,
      className: 'care-card-excellent'
    },
    {
      label: window.t('touchup.careGoodLabel'),
      years: results.totalLongevity,
      className: 'care-card-good'
    },
    {
      label: window.t('touchup.carePoorLabel'),
      years: Math.round(results.totalLongevity * 0.5 * 10) / 10,
      className: 'care-card-poor'
    }
  ];

  comparisonData.forEach(item => {
    const card = document.createElement('div');
    card.className = `touch-up-timeline__care-card ${item.className}`;
    card.innerHTML = `
      <div class="touch-up-timeline__care-label">${item.label}</div>
      <div class="touch-up-timeline__care-years">${window.t('touchup.careYears', { years: item.years })}</div>
      <div class="touch-up-timeline__care-desc">${window.t('touchup.untilTouchUpNeeded')}</div>
    `;
    comparison.appendChild(card);
  });
}

/**
 * Handle Sun Damage Calculation
 */
function handleSunDamageCalculation() {
  const sunHoursInput = document.getElementById('sunHours');
  const spfUsageInput = document.getElementById('spfUsage');

  const sunHours = sunHoursInput ? parseInt(sunHoursInput.value) || 0 : 0;
  const spfUsage = spfUsageInput ? spfUsageInput.value : 'sometimes';

  const results = TattooCalculators.calculateSunDamage(sunHours, spfUsage);

  const resultsDiv = document.getElementById('sunDamageResults');
  if (resultsDiv) resultsDiv.style.display = 'block';

  const fadingAcc = document.getElementById('fadingAcceleration');
  const yearsLost = document.getElementById('yearsLost');
  const sunRec = document.getElementById('sunRecommendation');

  if (fadingAcc) fadingAcc.textContent = `+${results.fadingAcceleration}%`;
  if (yearsLost) yearsLost.textContent = window.t('touchup.yearsCount', { count: results.yearsLost });
  if (sunRec) sunRec.textContent = results.recommendation;
}

/**
 * Handle Cost Calculation
 */
function handleCostCalculation(e) {
  e.preventDefault();

  const initialCostInput = document.getElementById('initialCost');
  const touchUpFreqInput = document.getElementById('touchUpFrequency');

  const initialCost = initialCostInput ? parseFloat(initialCostInput.value) || 0 : 0;
  const touchUpFrequency = touchUpFreqInput ? parseFloat(touchUpFreqInput.value) || 8 : 8;

  const results = TattooCalculators.calculateLifetimeCost(initialCost, touchUpFrequency);

  const resultsDiv = document.getElementById('costResults');
  if (resultsDiv) resultsDiv.style.display = 'block';

  const lifetimeCost = document.getElementById('lifetimeCost');
  const initialCostDisplay = document.getElementById('initialCostDisplay');
  const touchUpCostDisplay = document.getElementById('touchUpCostDisplay');
  const annualCost = document.getElementById('annualCost');
  const numberOfTouchUps = document.getElementById('numberOfTouchUps');
  const touchUpCost = document.getElementById('touchUpCost');

  if (lifetimeCost) lifetimeCost.textContent = TattooCalculators.formatCurrency(results.lifetimeCost);
  if (initialCostDisplay) initialCostDisplay.textContent = TattooCalculators.formatCurrency(initialCost);
  if (touchUpCostDisplay) touchUpCostDisplay.textContent = TattooCalculators.formatCurrency(results.touchUpCost * results.numberOfTouchUps);
  if (annualCost) annualCost.textContent = TattooCalculators.formatCurrency(results.annualCost);
  if (numberOfTouchUps) numberOfTouchUps.textContent = results.numberOfTouchUps;
  if (touchUpCost) touchUpCost.textContent = TattooCalculators.formatCurrency(results.touchUpCost);

  // Comparison cards
  const goodCareCost = document.getElementById('goodCareCost');
  const goodCareTouchUps = document.getElementById('goodCareTouchUps');
  const savings = document.getElementById('savings');
  const poorCareCost = document.getElementById('poorCareCost');
  const poorCareTouchUps = document.getElementById('poorCareTouchUps');
  const extraCost = document.getElementById('extraCost');

  if (goodCareCost) goodCareCost.textContent = TattooCalculators.formatCurrency(results.goodCareCost);
  if (goodCareTouchUps) goodCareTouchUps.textContent = window.t('touchup.goodCareTouchUpsText', { count: results.goodCareTouchUps });
  if (savings) savings.textContent = window.t('touchup.savingsText', { amount: TattooCalculators.formatCurrency(results.savings) });
  if (poorCareCost) poorCareCost.textContent = TattooCalculators.formatCurrency(results.poorCareCost);
  if (poorCareTouchUps) poorCareTouchUps.textContent = window.t('touchup.poorCareTouchUpsText', { count: results.poorCareTouchUps });
  if (extraCost) extraCost.textContent = window.t('touchup.extraCostText', { amount: TattooCalculators.formatCurrency(results.savings) });

  // Budget recommendation
  const monthlyBudget = Math.round((results.lifetimeCost / 30 / 12) * 100) / 100;
  const budgetRec = document.getElementById('budgetRecommendation');
  if (budgetRec) {
    budgetRec.textContent = window.t('touchup.budgetRecText', { amount: TattooCalculators.formatCurrency(monthlyBudget) });
  }

  // Scroll to results
  if (resultsDiv) {
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Handle Readiness Check
 */
function handleReadinessCheck(e) {
  e.preventDefault();

  const fadingLevelChecked = document.querySelector('input[name="fadingLevel"]:checked');
  const fadedColorsChecked = document.querySelectorAll('input[name="fadedColors"]:checked');
  const lineBlurringChecked = document.querySelector('input[name="lineBlurring"]:checked');
  const detailLossChecked = document.querySelector('input[name="detailLoss"]:checked');

  const readinessData = {
    fadingLevel: fadingLevelChecked ? fadingLevelChecked.value : 'slight',
    fadedColors: Array.from(fadedColorsChecked).map(cb => cb.value),
    lineBlurring: lineBlurringChecked ? lineBlurringChecked.value : 'no',
    detailLoss: detailLossChecked ? detailLossChecked.value : 'no'
  };

  const results = TattooCalculators.assessTouchUpReadiness(readinessData);

  displayReadinessResults(results);

  const resultsDiv = document.getElementById('readinessResults');
  if (resultsDiv) {
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Display Readiness Check Results
 */
function displayReadinessResults(results) {
  const resultsDiv = document.getElementById('readinessResults');
  if (!resultsDiv) return;

  resultsDiv.style.display = 'block';

  // Status card
  const statusDiv = document.getElementById('readinessStatus');
  if (statusDiv) {
    statusDiv.className = `touch-up-timeline__readiness-status ${results.status.statusClass || ''}`;
    statusDiv.innerHTML = `
      <h4>${results.status.icon} ${results.status.level}</h4>
      <p>${results.status.message}</p>
    `;
  }

  // Issues list
  const attentionList = document.getElementById('attentionList');
  if (attentionList) {
    attentionList.innerHTML = '';
    if (results.issues.length > 0) {
      results.issues.forEach(issue => {
        const li = document.createElement('li');
        li.textContent = issue;
        attentionList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'touch-up-timeline__attention-good';
      li.textContent = window.t('touchup.noIssuesDetected');
      attentionList.appendChild(li);
    }
  }

  // Next steps
  const nextSteps = document.getElementById('nextSteps');
  if (nextSteps) {
    nextSteps.textContent = results.status.action;
  }
}
