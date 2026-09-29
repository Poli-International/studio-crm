/**
 * Piercing Tension Gauge
 * Tracks daily jewelry tightness and tissue compression due to swelling or inadequate bar clearance.
 * Suggests professional studio inspection or downsizing when persistent tightness continues for 7+ consecutive days.
 * Poli International Professional Tools
 */
(function() {
  'use strict';

  function t(key, fallback, params) {
    if (typeof window.t === 'function') {
      var val = window.t(key, params);
      if (val && val !== key) return val;
    }
    if (params && typeof fallback === 'string') {
      var res = fallback;
      Object.keys(params).forEach(function(k) {
        res = res.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      });
      return res;
    }
    return fallback || key;
  }

  var PiercingTensionGauge = {
    init: function() {
      this.bindEvents();
      this.updateGaugeUI();

      var self = this;
      window.addEventListener('languageChanged', function() {
        self.updateGaugeUI();
      });
      window.addEventListener('healingEntriesUpdated', function() {
        self.updateGaugeUI();
      });
    },

    bindEvents: function() {
      var self = this;
      var openModalBtn = document.getElementById('openNewEntryBtn');
      if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
          self.syncModalVisibility();
        });
      }

      var procedureSelect = document.getElementById('procedureType');
      if (procedureSelect) {
        procedureSelect.addEventListener('change', function() {
          self.syncModalVisibility();
          self.updateGaugeUI();
        });
      }
    },

    syncModalVisibility: function() {
      var tensionGroup = document.getElementById('entryTensionFormGroup');
      if (!tensionGroup) return;

      var isPiercing = true;
      if (window.HealingLogManager && typeof window.HealingLogManager.getActivePiece === 'function') {
        var piece = window.HealingLogManager.getActivePiece();
        if (piece) {
          isPiercing = piece.procedureType === 'piercing';
        }
      } else {
        var procEl = document.getElementById('procedureType');
        if (procEl && procEl.value === 'tattoo') {
          isPiercing = false;
        }
      }

      tensionGroup.style.display = isPiercing ? 'block' : 'none';
    },

    /**
     * Evaluates entries for consecutive days of jewelry tension (rating >= 1)
     * @param {Array} entries 
     * @returns {Object} assessment
     */
    evaluateTensionHistory: function(entries) {
      if (!entries || !Array.isArray(entries) || entries.length === 0) {
        return {
          consecutiveTightDays: 0,
          currentTension: 0,
          hasProlongedTension: false,
          status: 'empty',
          message: t('healing.tensionGauge.noEntries', 'No tension logs recorded. Rate jewelry tightness in your daily log.')
        };
      }

      // Filter entries with valid date and sort by date ascending
      var sorted = entries.slice().filter(function(e) {
        return e && e.date;
      }).sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
      });

      if (sorted.length === 0) {
        return {
          consecutiveTightDays: 0,
          currentTension: 0,
          hasProlongedTension: false,
          status: 'empty',
          message: t('healing.tensionGauge.noEntries', 'No tension logs recorded. Rate jewelry tightness in your daily log.')
        };
      }

      // Read current (latest) entry tension
      var latest = sorted[sorted.length - 1];
      var currentTension = (typeof latest.tension === 'number') ? latest.tension : 0;

      // Count consecutive entries at the end with tension >= 1
      var consecutiveCount = 0;
      for (var i = sorted.length - 1; i >= 0; i--) {
        var entryTension = (typeof sorted[i].tension === 'number') ? sorted[i].tension : 0;
        if (entryTension >= 1) {
          consecutiveCount++;
        } else {
          break; // Streak broken by a normal/comfortable entry
        }
      }

      var hasProlongedTension = consecutiveCount >= 7;

      var status = 'normal';
      var message = '';

      if (hasProlongedTension) {
        status = 'alert';
        message = t('healing.tensionGauge.alert7Days', 
          '⚠️ Prolonged Jewelry Tension ({days} Consecutive Days): Swelling has maintained continuous tightness on your post for over a week. Persistent compression restricts capillary perfusion, risks embedding into compromised tissue, and inhibits drainage. Professional studio consultation for post-length inspection or planned downsizing is strongly advised.', 
          { days: consecutiveCount }
        );
      } else if (consecutiveCount > 0) {
        status = 'tight';
        message = t('healing.tensionGauge.monitoringDays', 
          'Tightness noted for {days} consecutive day(s). Normal during initial inflammatory peaks. If tightness continues past 7 days, schedule a studio check.', 
          { days: consecutiveCount }
        );
      } else {
        status = 'normal';
        message = t('healing.tensionGauge.normalComfortable', 
          'Jewelry clearance is adequate. Lymphatic drainage and micro-perfusion are uncompromised.'
        );
      }

      return {
        consecutiveTightDays: consecutiveCount,
        currentTension: currentTension,
        hasProlongedTension: hasProlongedTension,
        status: status,
        message: message,
        latestDate: latest.date
      };
    },

    updateGaugeUI: function() {
      var container = document.getElementById('piercingTensionGaugeCard');
      if (!container) return;

      var piece = null;
      if (window.HealingLogManager && typeof window.HealingLogManager.getActivePiece === 'function') {
        piece = window.HealingLogManager.getActivePiece();
      }

      var isPiercing = true;
      if (piece) {
        isPiercing = piece.procedureType === 'piercing';
      } else {
        var procEl = document.getElementById('procedureType');
        if (procEl && procEl.value === 'tattoo') isPiercing = false;
      }

      if (!isPiercing) {
        container.style.display = 'none';
        return;
      }

      container.style.display = 'block';

      var entries = (piece && Array.isArray(piece.entries)) ? piece.entries : [];
      var evalResult = this.evaluateTensionHistory(entries);

      var levelEl = document.getElementById('tensionGaugeLevelDisplay');
      var streakEl = document.getElementById('tensionGaugeStreakBadge');
      var advisoryEl = document.getElementById('tensionGaugeAdvisoryText');
      var barSegments = document.querySelectorAll('.tension-gauge-bar__segment');

      // Update level text
      if (levelEl) {
        var levelLabels = [
          t('healing.tensionGauge.level0', 'Level 0: Normal / Comfortable Clearance'),
          t('healing.tensionGauge.level1', 'Level 1: Snug (Post resting against tissue)'),
          t('healing.tensionGauge.level2', 'Level 2: Moderate Tightness (Tissue indentation)'),
          t('healing.tensionGauge.level3', 'Level 3: Constricting / Embedding Risk')
        ];
        levelEl.textContent = levelLabels[evalResult.currentTension] || levelLabels[0];
      }

      // Update segment highlights
      if (barSegments && barSegments.length > 0) {
        barSegments.forEach(function(seg, idx) {
          seg.classList.remove('active', 'active--normal', 'active--snug', 'active--tight', 'active--danger');
          if (idx <= evalResult.currentTension) {
            seg.classList.add('active');
            if (idx === 0) seg.classList.add('active--normal');
            if (idx === 1) seg.classList.add('active--snug');
            if (idx === 2) seg.classList.add('active--tight');
            if (idx === 3) seg.classList.add('active--danger');
          }
        });
      }

      // Update streak badge
      if (streakEl) {
        if (evalResult.consecutiveTightDays >= 7) {
          streakEl.textContent = t('healing.tensionGauge.streakAlertBadge', '⚠️ {days} Days Persistent Tightness', { days: evalResult.consecutiveTightDays });
          streakEl.className = 'tension-gauge-streak-badge tension-gauge-streak-badge--alert';
        } else if (evalResult.consecutiveTightDays > 0) {
          streakEl.textContent = t('healing.tensionGauge.streakWatchBadge', '⏳ {days} Days Snug / Tight', { days: evalResult.consecutiveTightDays });
          streakEl.className = 'tension-gauge-streak-badge tension-gauge-streak-badge--watch';
        } else {
          streakEl.textContent = t('healing.tensionGauge.streakNormalBadge', '✓ Normal Clearance', {});
          streakEl.className = 'tension-gauge-streak-badge tension-gauge-streak-badge--normal';
        }
      }

      // Update advisory text & box
      if (advisoryEl) {
        advisoryEl.textContent = evalResult.message;
        advisoryEl.className = 'tension-gauge-advisory tension-gauge-advisory--' + evalResult.status;
      }
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      PiercingTensionGauge.init();
    });
  } else {
    PiercingTensionGauge.init();
  }

  window.PiercingTensionGauge = PiercingTensionGauge;
})();
