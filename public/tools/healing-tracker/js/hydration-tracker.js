/**
 * Hydration Check-in & Intake Tracker
 * Gentle, time-based reminders and daily water intake monitoring
 * to support epidermal cellular regeneration and lymphatic recovery during tattoo and piercing healing.
 * Poli International Professional Tools
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'poli_healing_hydration_v1';
  var DEFAULT_TARGET_CUPS = 8; // 8 x 250ml (~2 Litres) daily benchmark
  var CHECK_INTERVAL_MS = 30000; // Check timer every 30 seconds

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

  function getTodayString() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }

  var HydrationTracker = {
    state: {
      date: getTodayString(),
      cups: 0,
      targetCups: DEFAULT_TARGET_CUPS,
      intervalMinutes: 120, // Default prompt every 2 hours
      lastIntakeTime: Date.now(),
      lastPromptTime: 0,
      snoozedUntil: 0,
      reminderEnabled: true
    },

    timerId: null,

    init: function() {
      this.loadState();
      this.bindEvents();
      this.render();
      this.startTimer();

      var self = this;
      window.addEventListener('languageChanged', function() {
        self.render();
      });
    },

    loadState: function() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          var today = getTodayString();
          if (parsed.date === today) {
            this.state = Object.assign(this.state, parsed);
          } else {
            // New day: retain settings, reset intake
            this.state.date = today;
            this.state.cups = 0;
            this.state.lastIntakeTime = Date.now();
            this.state.lastPromptTime = 0;
            this.state.snoozedUntil = 0;
            if (typeof parsed.intervalMinutes === 'number') this.state.intervalMinutes = parsed.intervalMinutes;
            if (typeof parsed.targetCups === 'number') this.state.targetCups = parsed.targetCups;
            if (typeof parsed.reminderEnabled === 'boolean') this.state.reminderEnabled = parsed.reminderEnabled;
            this.saveState();
          }
        }
      } catch (e) {
        console.error('HydrationTracker loadState error:', e);
      }
    },

    saveState: function() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error('HydrationTracker saveState error:', e);
      }
    },

    startTimer: function() {
      if (this.timerId) clearInterval(this.timerId);
      var self = this;
      this.timerId = setInterval(function() {
        self.checkPromptTrigger();
      }, CHECK_INTERVAL_MS);
      // Initial check on load
      setTimeout(function() {
        self.checkPromptTrigger();
      }, 3000);
    },

    checkPromptTrigger: function() {
      if (!this.state.reminderEnabled || this.state.intervalMinutes <= 0) {
        this.hidePromptBanner();
        return;
      }

      var now = Date.now();
      if (now < this.state.snoozedUntil) {
        return; // Currently snoozed
      }

      var intervalMs = this.state.intervalMinutes * 60 * 1000;
      var timeSinceLastIntake = now - (this.state.lastIntakeTime || 0);
      var timeSinceLastPrompt = now - (this.state.lastPromptTime || 0);

      // Trigger prompt if interval has passed since last intake AND since last prompt
      if (timeSinceLastIntake >= intervalMs && timeSinceLastPrompt >= intervalMs) {
        this.showPromptBanner();
      }
    },

    showPromptBanner: function() {
      var banner = document.getElementById('hydrationPromptBanner');
      if (!banner) return;

      this.state.lastPromptTime = Date.now();
      this.saveState();

      banner.style.display = 'flex';
      banner.classList.add('active');
    },

    hidePromptBanner: function() {
      var banner = document.getElementById('hydrationPromptBanner');
      if (banner) {
        banner.style.display = 'none';
        banner.classList.remove('active');
      }
    },

    addCup: function() {
      this.state.cups++;
      this.state.lastIntakeTime = Date.now();
      this.state.snoozedUntil = 0;
      this.saveState();
      this.hidePromptBanner();
      this.render();
      this.showToast(t('healing.hydration.loggedToast', '+1 Glass logged! Tissue hydration supported.'));
    },

    removeCup: function() {
      if (this.state.cups > 0) {
        this.state.cups--;
        this.saveState();
        this.render();
      }
    },

    snooze: function(minutes) {
      var mins = minutes || 30;
      this.state.snoozedUntil = Date.now() + (mins * 60 * 1000);
      this.saveState();
      this.hidePromptBanner();
      this.showToast(t('healing.hydration.snoozedToast', 'Hydration reminder snoozed for {mins} minutes.', { mins: mins }));
    },

    showToast: function(msg) {
      var toast = document.getElementById('hydrationToast');
      if (!toast) return;
      toast.textContent = msg;
      toast.style.display = 'block';
      toast.classList.add('visible');
      setTimeout(function() {
        toast.classList.remove('visible');
        setTimeout(function() {
          toast.style.display = 'none';
        }, 300);
      }, 3500);
    },

    bindEvents: function() {
      var self = this;

      var addBtn = document.getElementById('hydrationAddCupBtn');
      if (addBtn) {
        addBtn.addEventListener('click', function() {
          self.addCup();
        });
      }

      var removeBtn = document.getElementById('hydrationRemoveCupBtn');
      if (removeBtn) {
        removeBtn.addEventListener('click', function() {
          self.removeCup();
        });
      }

      var bannerDrinkBtn = document.getElementById('hydrationBannerDrinkBtn');
      if (bannerDrinkBtn) {
        bannerDrinkBtn.addEventListener('click', function() {
          self.addCup();
        });
      }

      var bannerSnoozeBtn = document.getElementById('hydrationBannerSnoozeBtn');
      if (bannerSnoozeBtn) {
        bannerSnoozeBtn.addEventListener('click', function() {
          self.snooze(30);
        });
      }

      var bannerDismissBtn = document.getElementById('hydrationBannerDismissBtn');
      if (bannerDismissBtn) {
        bannerDismissBtn.addEventListener('click', function() {
          self.hidePromptBanner();
          self.state.lastPromptTime = Date.now();
          self.saveState();
        });
      }

      var intervalSelect = document.getElementById('hydrationIntervalSelect');
      if (intervalSelect) {
        intervalSelect.addEventListener('change', function() {
          var val = parseInt(this.value, 10);
          if (isNaN(val) || val <= 0) {
            self.state.reminderEnabled = false;
            self.state.intervalMinutes = 0;
          } else {
            self.state.reminderEnabled = true;
            self.state.intervalMinutes = val;
          }
          self.saveState();
          self.render();
        });
      }
    },

    render: function() {
      var countEl = document.getElementById('hydrationCurrentCount');
      var targetEl = document.getElementById('hydrationTargetCount');
      var progressFill = document.getElementById('hydrationProgressBarFill');
      var progressPct = document.getElementById('hydrationProgressPct');
      var intervalSelect = document.getElementById('hydrationIntervalSelect');
      var statusBadge = document.getElementById('hydrationStatusBadge');

      var current = this.state.cups;
      var target = this.state.targetCups || DEFAULT_TARGET_CUPS;
      var pct = Math.min(100, Math.round((current / target) * 100));

      if (countEl) countEl.textContent = current;
      if (targetEl) targetEl.textContent = target;
      if (progressFill) progressFill.style.width = pct + '%';
      if (progressPct) progressPct.textContent = pct + '%';

      if (intervalSelect) {
        if (!this.state.reminderEnabled || this.state.intervalMinutes <= 0) {
          intervalSelect.value = '0';
        } else {
          intervalSelect.value = String(this.state.intervalMinutes);
        }
      }

      if (statusBadge) {
        if (pct >= 100) {
          statusBadge.textContent = t('healing.hydration.optimal', 'Optimal Cellular Hydration');
          statusBadge.className = 'hydration-status-badge hydration-status-badge--optimal';
        } else if (pct >= 50) {
          statusBadge.textContent = t('healing.hydration.moderate', 'Adequate Hydration');
          statusBadge.className = 'hydration-status-badge hydration-status-badge--moderate';
        } else {
          statusBadge.textContent = t('healing.hydration.low', 'Dermal Moisture Low');
          statusBadge.className = 'hydration-status-badge hydration-status-badge--low';
        }
      }
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      HydrationTracker.init();
    });
  } else {
    HydrationTracker.init();
  }

  window.HydrationTracker = HydrationTracker;
})();
