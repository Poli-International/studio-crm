// =====================================================
// VISUALIZER LOGIC & UI (Symptom Trends, Velocity & Telemetry)
// =====================================================

(function() {
  function initVisualizerUI() {
    setupTelemetryListeners();
    window.addEventListener('languageChanged', function() {
      const currentPiece = (window.HealingLog && window.HealingLog.getCurrentPiece && window.HealingLog.getCurrentPiece()) ||
                           (window.TrackerStorage && window.TrackerStorage.getActivePiece && window.TrackerStorage.getActivePiece());
      if (currentPiece) {
        updateVisualizer(currentPiece);
      }
    });
  }

  function updateVisualizer(piece) {
    if (!piece) return;
    renderSymptomTrends(piece);
    renderDirectionChangeAlert(piece);
    updateVisualTelemetry();
  }

  // ==========================================
  // PART 1: MULTI-SERIES SYMPTOM TRENDS (SVG Chart)
  // ==========================================
  function renderSymptomTrends(piece) {
    const trendsSection = document.getElementById('symptomTrendsSection');
    const chartContainer = document.getElementById('symptomTrendsChart');
    const sentencesContainer = document.getElementById('symptomSentencesList');
    const noDataNotice = document.getElementById('symptomTrendsNoData');

    if (!trendsSection) return;

    const entries = piece.entries || [];
    if (entries.length < 2) {
      if (noDataNotice) noDataNotice.style.display = 'block';
      if (chartContainer) chartContainer.style.display = 'none';
      if (sentencesContainer) sentencesContainer.style.display = 'none';
      return;
    }

    if (noDataNotice) noDataNotice.style.display = 'none';
    if (chartContainer) chartContainer.style.display = 'block';
    if (sentencesContainer) sentencesContainer.style.display = 'block';

    const sorted = entries.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

    // Render SVG Multi-series Line Chart
    renderTrendsChartSVG(sorted, chartContainer);

    // Compute Trajectory Sentences
    const sentences = generateSymptomSentences(sorted);
    if (sentencesContainer) {
      sentencesContainer.innerHTML = sentences.map(s => `
        <div class="symptom-trend-sentence">
          <span class="symptom-trend-sentence__icon">${s.icon}</span>
          <span class="symptom-trend-sentence__text">${s.text}</span>
        </div>
      `).join('');
    }
  }

  function renderTrendsChartSVG(entries, container) {
    const width = 600;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 40, left: 40 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const maxDay = Math.max(...entries.map(e => e.dayOffset), 5);
    const minDay = Math.min(...entries.map(e => e.dayOffset), 0);
    const dayRange = Math.max(1, maxDay - minDay);

    const scaleX = day => padding.left + ((day - minDay) / dayRange) * plotW;
    const scaleY = val => padding.top + plotH - (val / 3) * plotH;

    const symptoms = [
      { key: 'redness', label: 'Redness', color: '#ff4444' },
      { key: 'swelling', label: 'Swelling', color: '#fb923c' },
      { key: 'tenderness', label: 'Tenderness', color: '#facc15' },
      { key: 'discharge', label: 'Discharge', color: '#60a5fa' }
    ];

    let gridLines = '';
    for (let yVal = 0; yVal <= 3; yVal++) {
      const y = scaleY(yVal);
      const label = yVal === 0 ? 'None' : yVal === 1 ? 'Mild' : yVal === 2 ? 'Mod' : 'Sev';
      gridLines += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--border)" stroke-dasharray="2 2" stroke-width="1" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="var(--ink-muted)" font-family="var(--font-mono)" font-size="10" text-anchor="end">${label}</text>
      `;
    }

    entries.forEach(e => {
      const x = scaleX(e.dayOffset);
      gridLines += `
        <text x="${x}" y="${height - 15}" fill="var(--ink-muted)" font-family="var(--font-mono)" font-size="10" text-anchor="middle">D${e.dayOffset}</text>
      `;
    });

    let seriesSvg = '';
    symptoms.forEach(sym => {
      const points = entries.map(e => ({
        x: scaleX(e.dayOffset),
        y: scaleY(e[sym.key] || 0),
        val: e[sym.key] || 0,
        day: e.dayOffset
      }));

      const d = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

      seriesSvg += `<path d="${d}" fill="none" stroke="${sym.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;

      points.forEach(pt => {
        seriesSvg += `
          <circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="${sym.color}" stroke="var(--bg)" stroke-width="1">
            <title>${sym.label} Day ${pt.day}: ${pt.val}/3</title>
          </circle>
        `;
      });
    });

    const legendSvg = `
      <g transform="translate(${padding.left}, ${height - 2})">
        ${symptoms.map((s, i) => `
          <circle cx="${i * 120}" cy="0" r="4" fill="${s.color}" />
          <text x="${i * 120 + 8}" y="3" fill="var(--ink)" font-family="var(--font-mono)" font-size="10">${s.label}</text>
        `).join('')}
      </g>
    `;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="symptom-trends-svg" style="width: 100%; height: auto; display: block;" role="img" aria-label="Symptom trends timeline chart">
        ${gridLines}
        ${seriesSvg}
        ${legendSvg}
      </svg>
    `;
  }

  function generateSymptomSentences(entries) {
    if (entries.length < 2) return [];

    const first = entries[0];
    const last = entries[entries.length - 1];
    const daysElapsed = last.dayOffset - first.dayOffset;

    const symptoms = [
      { key: 'redness', name: 'Redness' },
      { key: 'swelling', name: 'Swelling' },
      { key: 'tenderness', name: 'Tenderness' },
      { key: 'discharge', name: 'Discharge' }
    ];

    const sentences = [];

    symptoms.forEach(sym => {
      const vStart = first[sym.key] || 0;
      const vEnd = last[sym.key] || 0;
      const diff = vEnd - vStart;

      let icon = '➡️';
      let text = '';

      if (diff < 0) {
        icon = '📉';
        if (vEnd === 0) {
          text = `${sym.name} has completely resolved over the last ${daysElapsed} days.`;
        } else {
          text = `${sym.name} decreased by ${Math.abs(diff)} level(s) since Day ${first.dayOffset}, indicating positive cellular repair.`;
        }
      } else if (diff > 0) {
        icon = '📈';
        text = `${sym.name} increased by ${diff} level(s) between Day ${first.dayOffset} and Day ${last.dayOffset}.`;
      } else {
        if (vEnd === 0) {
          icon = '✅';
          text = `${sym.name} remained completely absent throughout this monitoring window.`;
        } else {
          icon = '➡️';
          text = `${sym.name} remained constant at level ${vEnd}/3 across ${daysElapsed} days.`;
        }
      }

      sentences.push({ icon, text });
    });

    return sentences;
  }

  // ==========================================
  // PART 2: DIRECTION-CHANGE DETECTION (Reversals)
  // ==========================================
  function detectDirectionChange(entries) {
    if (!entries || entries.length < 4) return null;

    const sorted = entries.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const scores = sorted.map(e => ({
      day: e.dayOffset,
      date: e.date,
      score: (e.redness || 0) + (e.swelling || 0) + (e.tenderness || 0) + (e.discharge || 0)
    }));

    let minScoreIndex = -1;
    let minScore = 999;

    for (let i = 0; i < scores.length - 3; i++) {
      if (scores[i].score < minScore) {
        minScore = scores[i].score;
        minScoreIndex = i;
      }
    }

    if (minScoreIndex >= 0) {
      let isConsecutiveIncrease = true;
      for (let j = scores.length - 3; j < scores.length; j++) {
        if (scores[j].score <= scores[j - 1].score) {
          isConsecutiveIncrease = false;
          break;
        }
      }

      if (isConsecutiveIncrease && scores[scores.length - 1].score > minScore) {
        return {
          consecutiveDays: scores.slice(scores.length - 3).map(s => s.day),
          startDay: scores[0].day,
          minDay: scores[minScoreIndex].day,
          count: 3
        };
      }
    }

    return null;
  }

  function renderDirectionChangeAlert(piece) {
    const alertBox = document.getElementById('directionChangeAlert');
    if (!alertBox) return;

    const entries = (piece && piece.entries) || [];
    const change = detectDirectionChange(entries);

    if (change) {
      const msgTemplate = (window.t && window.t('healing.reversalAlert.message')) || 
        'Your symptom series had been improving from Day {startDay} to Day {peakDay}, but has now increased across {count} consecutive entries (Days {days}).';
      const recTemplate = (window.t && window.t('healing.reversalAlert.recommendation')) || 
        'Because this represents a multi-day reversal rather than daily noise, contact your professional piercer or tattoo artist for an in-person check.';
      const ruleJust = (window.t && window.t('healing.reversalAlert.ruleJustification')) || 
        'Note: A single flare-up can occur from momentary friction, but a sustained 3-entry increase warrants professional studio review.';

      const formattedMsg = msgTemplate
        .replace('{startDay}', change.startDay)
        .replace('{peakDay}', change.minDay)
        .replace('{count}', change.count)
        .replace('{days}', change.consecutiveDays.join(', '));

      alertBox.className = 'direction-change-alert-card';
      alertBox.innerHTML = `
        <div class="direction-change-alert__header">
          <span class="direction-change-alert__icon">⚠️</span>
          <strong>${(window.t && window.t('healing.reversalAlert.title')) || 'Clinical Alert: Symptom Trend Reversal Detected'}</strong>
        </div>
        <p class="direction-change-alert__message">${formattedMsg}</p>
        <p class="direction-change-alert__rec"><strong>Action:</strong> ${recTemplate}</p>
        <p class="direction-change-alert__subtext">${ruleJust}</p>
      `;
      alertBox.style.display = 'block';
    } else {
      alertBox.style.display = 'none';
      alertBox.innerHTML = '';
    }
  }

  // ==========================================
  // PART 3: VISUAL PANE & TELEMETRY ENGINE
  // ==========================================
  function updateVisualTelemetry() {
    const phaseStat = document.getElementById('currentPhaseStat');
    const telemetryStatus = document.getElementById('telemetryTrackerStatus');
    const currentPhaseBadge = document.querySelector('.timeline-step--active .timeline-step__title') || 
                              document.querySelector('.current-phase-badge');

    if (currentPhaseBadge && phaseStat) {
      const newPhase = currentPhaseBadge.textContent.trim().toUpperCase();
      if (phaseStat.textContent !== newPhase) {
        phaseStat.textContent = newPhase;
        phaseStat.classList.remove('pulse');
        void phaseStat.offsetWidth;
        phaseStat.classList.add('pulse');
      }
    }

    const symRedness = document.getElementById('visualSymptomRedness');
    const symSwelling = document.getElementById('visualSymptomSwelling');
    const symTenderness = document.getElementById('visualSymptomTenderness');
    const symItching = document.getElementById('visualSymptomItching');

    const isRedness = !!document.querySelector('.symptom-check[value="redness"]:checked, .symptom-check[value="mild-redness"]:checked, .symptom-check[value="increased-redness"]:checked, .entry-symptom-check[value="redness"]:checked');
    const isSwelling = !!document.querySelector('.symptom-check[value="swelling"]:checked, .symptom-check[value="slight-swelling"]:checked, .symptom-check[value="moderate-swelling"]:checked, .symptom-check[value="excessive-swelling"]:checked, .entry-symptom-check[value="swelling"]:checked');
    const isTenderness = !!document.querySelector('.symptom-check[value="pain"]:checked, .symptom-check[value="tenderness"]:checked, .symptom-check[value="mild-tenderness"]:checked, .symptom-check[value="severe-pain"]:checked, .entry-symptom-check[value="tenderness"]:checked');
    const isItching = !!document.querySelector('.symptom-check[value="itching"]:checked, .entry-symptom-check[value="itching"]:checked');

    function updateTag(el, checked, label) {
      if (!el) return;
      const text = (checked ? '[X] ' : '[ ] ') + label;
      if (el.textContent !== text) {
        el.textContent = text;
      }
      if (checked) {
        if (!el.classList.contains('active')) el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }

    updateTag(symRedness, isRedness, 'MILD REDNESS');
    updateTag(symSwelling, isSwelling, 'SWELLING');
    updateTag(symTenderness, isTenderness, 'TENDERNESS');
    updateTag(symItching, isItching, 'ITCHING');

    if (telemetryStatus) {
      const resultsSec = document.getElementById('resultsSection');
      const checkedCount = (isRedness ? 1 : 0) + (isSwelling ? 1 : 0) + (isTenderness ? 1 : 0) + (isItching ? 1 : 0);
      let targetText = 'READY';
      if (checkedCount > 0) {
        targetText = `${checkedCount} FLAGGED`;
      } else if (resultsSec && resultsSec.style.display !== 'none') {
        targetText = 'ACTIVE_MONITORING';
      }
      if (telemetryStatus.textContent !== targetText) {
        telemetryStatus.textContent = targetText;
        telemetryStatus.classList.remove('pulse');
        void telemetryStatus.offsetWidth;
        telemetryStatus.classList.add('pulse');
      }
    }
  }

  function setupTelemetryListeners() {
    document.addEventListener('change', function(e) {
      if (e.target && (e.target.classList.contains('symptom-check') || e.target.classList.contains('entry-symptom-check') || e.target.name === 'colors')) {
        updateVisualTelemetry();
      }
    });

    const startBtn = document.getElementById('startTracking');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        setTimeout(updateVisualTelemetry, 250);
      });
    }
  }

  // Export to global scope
  window.Visualizer = {
    init: initVisualizerUI,
    update: updateVisualizer,
    updateTelemetry: updateVisualTelemetry,
    renderSymptomTrends: renderSymptomTrends,
    detectDirectionChange: detectDirectionChange,
    renderDirectionChangeAlert: renderDirectionChangeAlert
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisualizerUI);
  } else {
    initVisualizerUI();
  }
})();
