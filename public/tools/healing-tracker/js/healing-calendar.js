/**
 * Healing & Symptom Calendar Module
 * Maps daily symptom severity ratings and visual logs across a calendar grid
 * to identify healing discomfort patterns and recovery milestones.
 * Poli International Professional Tools
 */

(function() {
  'use strict';

  function t(key, fallback) {
    if (typeof window.t === 'function') {
      var val = window.t(key);
      if (val && val !== key) return val;
    }
    return fallback || key;
  }

  var HealingCalendar = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(), // 0-indexed
    selectedDateStr: null,

    init: function() {
      var self = this;
      var prevBtn = document.getElementById('calendarPrevMonthBtn');
      var nextBtn = document.getElementById('calendarNextMonthBtn');
      var todayBtn = document.getElementById('calendarTodayBtn');

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.navigateMonth(-1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.navigateMonth(1);
        });
      }

      if (todayBtn) {
        todayBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var now = new Date();
          self.currentYear = now.getFullYear();
          self.currentMonth = now.getMonth();
          self.render();
        });
      }

      window.addEventListener('languageChanged', function() {
        self.render();
      });

      // Also listen for healingLog updates
      window.addEventListener('healingLogUpdated', function() {
        self.render();
      });

      this.render();
    },

    navigateMonth: function(delta) {
      this.currentMonth += delta;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.render();
    },

    getEntriesMap: function() {
      var entries = [];
      var piece = window.HealingLog && typeof window.HealingLog.getActivePiece === 'function' && window.HealingLog.getActivePiece();
      if (piece && Array.isArray(piece.entries)) {
        entries = piece.entries;
      }

      var map = {};
      entries.forEach(function(entry) {
        if (!entry.date) return;
        // Normalize date YYYY-MM-DD
        var dStr = String(entry.date).split('T')[0];
        if (!map[dStr]) {
          map[dStr] = [];
        }
        map[dStr].push(entry);
      });
      return map;
    },

    // Worst of the four 0-3 ratings: 0 calm, 1 mild, 2 monitor, 3 concerning.
    // Worst of the four 0-3 ratings: 0 calm, 1 mild, 2 monitor, 3 concerning.
    // Worst of the four 0-3 ratings: 0 calm, 1 mild, 2 monitor, 3 concerning.
    getSeverityForEntry: function(entry) {
      if (!entry) return 'normal';
      var worst = Math.max(Number(entry.redness) || 0, Number(entry.swelling) || 0, Number(entry.tenderness) || 0, Number(entry.discharge) || 0);
      return ['normal', 'mild', 'monitor', 'concerning'][Math.min(3, worst)];
    },

    render: function() {
      var monthTitleEl = document.getElementById('calendarMonthTitle');
      var gridEl = document.getElementById('calendarGrid');
      var statsLoggedDaysEl = document.getElementById('calendarLoggedDaysCount');
      var statsStreakEl = document.getElementById('calendarStreakCount');
      var statsPeakDayEl = document.getElementById('calendarPeakDay');

      if (!gridEl) return;

      var entriesMap = this.getEntriesMap();
      var allLoggedDates = Object.keys(entriesMap).sort();

      // Month Name
      var lang = (typeof window.getCurrentLanguage === 'function') ? window.getCurrentLanguage() : 'en';
      var monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        nl: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
        pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      };

      var curMonthNames = monthNames[lang] || monthNames.en;

      // Weekday header, Sunday first to match the grid. 2023-01-01 was a Sunday.
      var weekdaysEl = document.getElementById('calendarWeekdays');
      if (weekdaysEl) {
        var fmt = new Intl.DateTimeFormat(lang, { weekday: 'short' });
        weekdaysEl.innerHTML = '';
        for (var w = 0; w < 7; w++) {
          var wd = document.createElement('span');
          wd.textContent = fmt.format(new Date(2023, 0, 1 + w));
          weekdaysEl.appendChild(wd);
        }
      }
      if (monthTitleEl) {
        monthTitleEl.textContent = curMonthNames[this.currentMonth] + ' ' + this.currentYear;
      }

      // Stats Calculation
      if (statsLoggedDaysEl) {
        statsLoggedDaysEl.textContent = allLoggedDates.length;
      }

      // Calculate consecutive streak
      var streak = 0;
      var today = new Date();
      var checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var checkStr = window.localISODate(checkDate);

      if (entriesMap[checkStr]) {
        streak++;
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          var prevStr = window.localISODate(checkDate);
          if (entriesMap[prevStr]) {
            streak++;
          } else {
            break;
          }
        }
      } else {
        // Check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        var yestStr = window.localISODate(checkDate);
        if (entriesMap[yestStr]) {
          streak++;
          while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            var prevStr2 = window.localISODate(checkDate);
            if (entriesMap[prevStr2]) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      if (statsStreakEl) {
        statsStreakEl.textContent = streak + ' d';
      }

      // Peak Discomfort Day
      var peakDayStr = '--';
      var maxSeverityScore = -1;
      allLoggedDates.forEach(function(d) {
        var dayEntries = entriesMap[d];
        dayEntries.forEach(function(entry) {
          var score = (Number(entry.redness) || 0) + (Number(entry.swelling) || 0) + (Number(entry.tenderness) || 0) + (Number(entry.discharge) || 0);
          if (score > maxSeverityScore && score > 0) {
            maxSeverityScore = score;
            peakDayStr = d;
          }
        });
      });

      if (statsPeakDayEl) {
        statsPeakDayEl.textContent = peakDayStr;
      }

      // Build Calendar Grid
      gridEl.innerHTML = '';

      var daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      var firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay(); // 0 = Sun

      // Empty lead cells
      for (var i = 0; i < firstDayIndex; i++) {
        var emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day-cell calendar-day-cell--empty';
        gridEl.appendChild(emptyCell);
      }

      var self = this;
      var todayStr = window.localISODate(new Date());

      for (var d = 1; d <= daysInMonth; d++) {
        var dayCell = document.createElement('button');
        var mStr = (self.currentMonth + 1 < 10) ? '0' + (self.currentMonth + 1) : String(self.currentMonth + 1);
        var dDayStr = (d < 10) ? '0' + d : String(d);
        var dateISO = self.currentYear + '-' + mStr + '-' + dDayStr;

        dayCell.type = 'button';
        dayCell.className = 'calendar-day-cell';
        dayCell.setAttribute('data-date', dateISO);

        if (dateISO === todayStr) {
          dayCell.classList.add('calendar-day-cell--today');
        }

        if (self.selectedDateStr === dateISO) {
          dayCell.classList.add('calendar-day-cell--selected');
        }

        var dayNumSpan = document.createElement('span');
        dayNumSpan.className = 'calendar-day-number';
        dayNumSpan.textContent = d;
        dayCell.appendChild(dayNumSpan);

        var dayEntries = entriesMap[dateISO];
        if (dayEntries && dayEntries.length > 0) {
          dayCell.classList.add('calendar-day-cell--has-entry');
          var latestEntry = dayEntries[dayEntries.length - 1];
          var sev = self.getSeverityForEntry(latestEntry);

          var indicator = document.createElement('span');
          indicator.className = 'calendar-severity-dot calendar-severity-dot--' + sev;
          indicator.title = 'Severity: ' + sev;
          dayCell.appendChild(indicator);

          if (typeof latestEntry.dayOffset === 'number') {
            var dayBadge = document.createElement('span');
            dayBadge.className = 'calendar-day-badge';
            dayBadge.textContent = 'D' + latestEntry.dayOffset;
            dayCell.appendChild(dayBadge);
          }
        }

        (function(targetDateISO) {
          dayCell.addEventListener('click', function(e) {
            e.preventDefault();
            self.selectDate(targetDateISO);
          });
        })(dateISO);

        gridEl.appendChild(dayCell);
      }

      this.renderDayDetails();
    },

    selectDate: function(dateISO) {
      this.selectedDateStr = (this.selectedDateStr === dateISO) ? null : dateISO;
      this.render();
      this.renderDayDetails();
    },

    renderDayDetails: function() {
      var container = document.getElementById('calendarDayDetailsCard');
      if (!container) return;

      if (!this.selectedDateStr) {
        container.style.display = 'none';
        return;
      }

      var entriesMap = this.getEntriesMap();
      var entries = entriesMap[this.selectedDateStr] || [];

      container.style.display = 'block';
      container.innerHTML = '';

      var header = document.createElement('div');
      header.className = 'calendar-details-header';

      var titleGroup = document.createElement('div');
      var dateHeading = document.createElement('h4');
      dateHeading.className = 'calendar-details-date';
      dateHeading.textContent = '📅 ' + this.selectedDateStr;

      var subHeading = document.createElement('span');
      subHeading.className = 'calendar-details-subtitle';

      if (entries.length > 0) {
        var dHealing = typeof entries[0].dayOffset === 'number' ? entries[0].dayOffset : 0;
        subHeading.textContent = t('healing.calendar.dayOfHealing', 'Day {day} of Recovery').replace('{day}', dHealing);
      } else {
        subHeading.textContent = t('healing.calendar.noEntriesMonth', 'No logs recorded for this date.');
      }

      titleGroup.appendChild(dateHeading);
      titleGroup.appendChild(subHeading);

      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'calendar-details-close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', t('healing.calendar.closeDetails', 'Close Day View'));
      var self = this;
      closeBtn.addEventListener('click', function() {
        self.selectedDateStr = null;
        self.render();
        self.renderDayDetails();
      });

      header.appendChild(titleGroup);
      header.appendChild(closeBtn);
      container.appendChild(header);

      if (entries.length === 0) {
        var emptyMsg = document.createElement('p');
        emptyMsg.className = 'calendar-details-empty';
        emptyMsg.textContent = t('healing.calendar.noEntrySelected', 'No symptom entry recorded on this day. Tap "Log Today\'s Entry" to create a new recovery record.');
        container.appendChild(emptyMsg);
        return;
      }

      entries.forEach(function(entry, idx) {
        var entryCard = document.createElement('div');
        entryCard.className = 'calendar-entry-item';

        var sev = self.getSeverityForEntry(entry);
        var sevBadge = document.createElement('span');
        sevBadge.className = 'calendar-severity-tag calendar-severity-tag--' + sev;

        if (sev === 'concerning') sevBadge.textContent = t('tracker.severityConcerning', 'Concerning');
        else if (sev === 'monitor') sevBadge.textContent = t('tracker.severityMonitor', 'Monitor Closely');
        else if (sev === 'mild') sevBadge.textContent = t('tracker.severityMild', 'Mild Discomfort');
        else sevBadge.textContent = t('tracker.severityNormal', 'Normal / Baseline');

        entryCard.appendChild(sevBadge);

        // Scores breakdown
        var scoresRow = document.createElement('div');
        scoresRow.className = 'calendar-scores-row';
        ['redness', 'swelling', 'tenderness', 'discharge'].forEach(function(k) {
          var span = document.createElement('span');
          var label = document.createElement('strong');
          label.textContent = t('healing.log.' + k, k) + ':';
          span.appendChild(label);
          span.appendChild(document.createTextNode(' ' + (Number(entry[k]) || 0) + '/3'));
          scoresRow.appendChild(span);
        });
        entryCard.appendChild(scoresRow);

        // Symptoms list
        if (entry.symptoms && entry.symptoms.length > 0) {
          var sympContainer = document.createElement('div');
          sympContainer.className = 'calendar-symptoms-chips';
          entry.symptoms.forEach(function(symp) {
            var chip = document.createElement('span');
            chip.className = 'calendar-symptom-chip';
            chip.textContent = (typeof symp === 'object' && symp.name) ? symp.name : String(symp);
            sympContainer.appendChild(chip);
          });
          entryCard.appendChild(sympContainer);
        }

        // Notes
        if (entry.notes) {
          var notesP = document.createElement('p');
          notesP.className = 'calendar-entry-notes';
          notesP.textContent = '"' + entry.notes + '"';
          entryCard.appendChild(notesP);
        }

        container.appendChild(entryCard);
      });
    }
  };

  window.HealingCalendar = HealingCalendar;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      HealingCalendar.init();
    });
  } else {
    HealingCalendar.init();
  }
})();
