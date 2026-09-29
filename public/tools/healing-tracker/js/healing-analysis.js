// =====================================================
// HEALING ANALYSIS COORDINATOR
// Coordinates Comparison UI, Visualizer UI, and Studio Pro-Tips
// =====================================================

(function() {
  function initAnalysisUI() {
    if (window.Comparison && typeof window.Comparison.init === 'function') {
      window.Comparison.init();
    }
    if (window.Visualizer && typeof window.Visualizer.init === 'function') {
      window.Visualizer.init();
    }
    if (window.ProTips && typeof window.ProTips.init === 'function') {
      window.ProTips.init();
    }
    if (window.HealingCalendar && typeof window.HealingCalendar.init === 'function') {
      window.HealingCalendar.init();
    }
    if (window.AllergyScreener && typeof window.AllergyScreener.init === 'function') {
      window.AllergyScreener.init();
    }
    if (window.HealthReport && typeof window.HealthReport.init === 'function') {
      window.HealthReport.init();
    }
  }

  function updateAnalysis(piece) {
    if (!piece) return;
    
    // 1. Update Comparison Module (Photo slider & Symptom Severity Bar Chart)
    if (window.Comparison && typeof window.Comparison.update === 'function') {
      window.Comparison.update(piece);
    }

    // 2. Update Visualizer Module (Symptom trends SVG chart, sentences & telemetry)
    if (window.Visualizer && typeof window.Visualizer.update === 'function') {
      window.Visualizer.update(piece);
    }

    // 3. Update Pro-Tips Module with current stage
    if (window.ProTips && typeof window.ProTips.update === 'function') {
      const today = new Date();
      const procDate = piece.procedureDate ? new Date(piece.procedureDate) : today;
      const dayOffset = Math.max(0, Math.floor((today - procDate) / (1000 * 60 * 60 * 24)));
      window.ProTips.update(piece.procedureType || 'piercing', dayOffset);
    }

    // 4. Update Healing Calendar
    if (window.HealingCalendar && typeof window.HealingCalendar.render === 'function') {
      window.HealingCalendar.render();
    }
  }

  window.HealingAnalysis = {
    init: initAnalysisUI,
    updateAnalysis: updateAnalysis,
    detectDirectionChange: function(entries) {
      return (window.Visualizer && typeof window.Visualizer.detectDirectionChange === 'function')
        ? window.Visualizer.detectDirectionChange(entries)
        : null;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalysisUI);
  } else {
    initAnalysisUI();
  }
})();
