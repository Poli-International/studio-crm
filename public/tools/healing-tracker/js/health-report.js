/**
 * Healing Health Report Generator
 * Generates a summarized, studio-ready clinical recovery report of logged
 * symptom trajectory and milestones for professional review.
 * Poli International Professional Tools
 */

(function() {
  'use strict';

  function t(key, fallback, params) {
    var val = typeof window.t === 'function' ? window.t(key, params) : key;
    if (!val || val === key) val = fallback || key;
    if (params) Object.keys(params).forEach(function(p) { val = val.split('{' + p + '}').join(params[p]); });
    return val;
  }

  function lbl(prefix, v) { return t(K + prefix + v, v); }
  var K = 'healing.healthReport.';

  var HealthReport = {
    currentReportData: null,

    init: function() {
      var self = this;
      var generateBtn = document.getElementById('generateHealthReportBtn');
      var printBtn = document.getElementById('printHealthReportBtn');
      var copyBtn = document.getElementById('copyHealthReportBtn');
      var downloadBtn = document.getElementById('downloadHealthReportBtn');

      if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.generate();
        });
      }

      if (printBtn) {
        printBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.print();
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.copyText();
        });
      }

      if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.downloadText();
        });
      }

      window.addEventListener('languageChanged', function() {
        if (self.currentReportData) {
          self.generate();
        }
      });
    },

    collectData: function() {
      var piece = window.HealingLog && typeof window.HealingLog.getActivePiece === 'function' ? window.HealingLog.getActivePiece() : null;
      // Map the log's 0-3 ratings onto the fields this report reads.
      var entries = (piece && Array.isArray(piece.entries) ? piece.entries : []).map(function(e) {
        var worst = Math.max(Number(e.redness) || 0, Number(e.swelling) || 0, Number(e.tenderness) || 0, Number(e.discharge) || 0);
        return Object.assign({}, e, {
          painLevel: Number(e.tenderness) || 0,
          swellingLevel: Number(e.swelling) || 0,
          rednessLevel: Number(e.redness) || 0,
          symptoms: [{ severity: ['normal', 'mild', 'monitor', 'concerning'][Math.min(3, worst)] }]
        });
      });

      // Procedure Info
      var procType = (piece && piece.type) || (document.getElementById('procedureType') || {}).value || 'piercing';

      var procDate = (document.getElementById('procedureDate') || {}).value || '';
      var procLoc = '';
      if (procType === 'piercing') {
        var pSelect = document.getElementById('piercingLocation');
        if (pSelect && pSelect.selectedOptions && pSelect.selectedOptions[0]) {
          procLoc = pSelect.selectedOptions[0].text;
        }
      } else {
        var tSelect = document.getElementById('tattooSize');
        if (tSelect && tSelect.selectedOptions && tSelect.selectedOptions[0]) {
          procLoc = tSelect.selectedOptions[0].text;
        }
      }

      // Elapsed recovery days
      var elapsedDays = 1;
      if (procDate) {
        var pDateObj = new Date(procDate);
        var now = new Date();
        var diffTime = now.getTime() - pDateObj.getTime();
        elapsedDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
      }

      // Trajectory Analysis
      var peakPain = 0;
      var peakSwelling = 0;
      var peakRedness = 0;
      var currentPain = 0;
      var currentSwelling = 0;
      var currentRedness = 0;
      var highestSev = 'normal';

      if (entries.length > 0) {
        var sorted = entries.slice().sort(function(a, b) {
          return new Date(a.date) - new Date(b.date);
        });

        var latest = sorted[sorted.length - 1];
        currentPain = latest.painLevel || 0;
        currentSwelling = latest.swellingLevel || 0;
        currentRedness = latest.rednessLevel || 0;

        sorted.forEach(function(entry) {
          if ((entry.painLevel || 0) > peakPain) peakPain = entry.painLevel;
          if ((entry.swellingLevel || 0) > peakSwelling) peakSwelling = entry.swellingLevel;
          if ((entry.rednessLevel || 0) > peakRedness) peakRedness = entry.rednessLevel;

          (entry.symptoms || []).forEach(function(s) {
            var sev = (typeof s === 'object' && s.severity) ? s.severity : 'normal';
            if (sev === 'concerning') highestSev = 'concerning';
            else if (sev === 'monitor' && highestSev !== 'concerning') highestSev = 'monitor';
            else if (sev === 'mild' && highestSev === 'normal') highestSev = 'mild';
          });
        });
      }

      var trajectory = 'stable';
      if (entries.length >= 2) {
        var first = entries[0];
        var last = entries[entries.length - 1];
        var firstScore = (first.painLevel || 0) + (first.swellingLevel || 0) + (first.rednessLevel || 0);
        var lastScore = (last.painLevel || 0) + (last.swellingLevel || 0) + (last.rednessLevel || 0);
        if (lastScore < firstScore) trajectory = 'improving';
        else if (lastScore > firstScore) trajectory = 'escalating';
      }

      var symptomTrendAlert = null;
      if (window.HealingLog && typeof window.HealingLog.detectSymptomTrendAlert === 'function') {
        symptomTrendAlert = window.HealingLog.detectSymptomTrendAlert(entries);
      }

      return {
        procedureType: procType,
        placement: procLoc || t('common.unspecified', 'Unspecified Location'),
        procedureDate: procDate || t('common.unspecified', 'Unspecified Date'),
        elapsedDays: elapsedDays,
        entriesCount: entries.length,
        entries: entries,
        peakPain: peakPain,
        peakSwelling: peakSwelling,
        peakRedness: peakRedness,
        currentPain: currentPain,
        currentSwelling: currentSwelling,
        currentRedness: currentRedness,
        highestSeverity: highestSev,
        trajectory: trajectory,
        symptomTrendAlert: symptomTrendAlert,
        allergyAssessment: window.LAST_ALLERGY_ASSESSMENT || null,
        generatedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
      };
    },

    generate: function() {
      var data = this.collectData();
      this.currentReportData = data;

      var container = document.getElementById('healthReportPreviewCard');
      var emptyNotice = document.getElementById('healthReportEmptyNotice');
      var actionsBar = document.getElementById('healthReportActionsBar');

      if (!container) return;

      if (data.entriesCount === 0) {
        if (emptyNotice) emptyNotice.style.display = 'block';
        container.style.display = 'none';
        if (actionsBar) actionsBar.style.display = 'none';
        return;
      }

      if (emptyNotice) emptyNotice.style.display = 'none';
      container.style.display = 'block';
      if (actionsBar) actionsBar.style.display = 'flex';

      // Build Report HTML
      var trajectoryLabel = (data.trajectory === 'improving') ? t(K + 'rep_trajImproving', 'Favorable (Decreasing Discomfort)') :
                            (data.trajectory === 'escalating') ? t(K + 'rep_trajEscalating', 'Elevated Discomfort (Close Monitoring Advised)') :
                            t(K + 'rep_trajStable', 'Stable Recovery Course');

      var html = 
        '<div class="health-report-document">' +
          '<div class="report-header-banner">' +
            '<div class="report-brand-title">' + t('healing.healthReport.reportHeader', 'POLI INTERNATIONAL - HEALING HEALTH SUMMARY') + '</div>' +
            '<div class="report-timestamp">Generated: ' + data.generatedAt + '</div>' +
          '</div>';

      // Symptom Trend Alert Section (Worsening 3 consecutive days)
      if (data.symptomTrendAlert) {
        var alertInfo = data.symptomTrendAlert;
        var sName = alertInfo.symptomType === 'both'
          ? t('healing.symptomTrendAlert.symptomBoth', 'Redness and Swelling')
          : (alertInfo.symptomType === 'swelling'
            ? t('healing.symptomTrendAlert.symptomSwelling', 'Swelling')
            : t('healing.symptomTrendAlert.symptomRedness', 'Redness'));

        var pStr = alertInfo.dates.map(function(d, idx) {
          return d + ' (R:' + alertInfo.rednessScores[idx] + ', S:' + alertInfo.swellingScores[idx] + ')';
        }).join(' → ');

        html += 
          '<div class="report-section report-section--trend-alert">' +
            '<div class="symptom-trend-emergency-banner">' +
              '<div class="symptom-trend-alert-header">' +
                '<span class="symptom-trend-alert-badge">' + t('healing.symptomTrendAlert.badge', 'SYMPTOM TREND ALERT') + '</span>' +
                '<h4 class="symptom-trend-alert-title">' + t('healing.healthReport.trendAlertTitle', 'SYMPTOM TREND ALERT: WORSENING CONSECUTIVE TRAJECTORY') + '</h4>' +
              '</div>' +
              '<p class="symptom-trend-alert-desc">' +
                t('healing.healthReport.trendAlertDesc', 'Automated analysis detected 3 consecutive entries of escalating {symptom}: {progression}.', { symptom: sName, progression: pStr }) +
              '</p>' +
              '<div class="symptom-trend-alert-recommendation">' +
                '<strong>' + t('healing.healthReport.recommendationLabel', 'Clinical Recommendation:') + ' </strong>' +
                t('healing.healthReport.recommendationText', 'Contact a studio professional or dermatologist immediately for in-person evaluation to rule out acute contact dermatitis, excessive mechanical friction, or localized infection.') +
              '</div>' +
            '</div>' +
          '</div>';
      }

      html += 
          '<div class="report-section">' +
            '<h4 class="report-section-title">' + t('healing.healthReport.clientSection', '1. Procedure & Placement Summary') + '</h4>' +
            '<div class="report-grid-2">' +
              '<div><strong>' + t('healing.healthReport.procedureLabel', 'Procedure Type') + ':</strong> ' + (data.procedureType === 'piercing' ? t(K + 'rep_procBody', 'Body Piercing') : t(K + 'rep_procTattoo', 'Tattoo Art')) + '</div>' +
              '<div><strong>' + t('healing.healthReport.placementLabel', 'Anatomical Placement') + ':</strong> ' + data.placement + '</div>' +
              '<div><strong>' + t('healing.healthReport.dateLabel', 'Procedure Date') + ':</strong> ' + data.procedureDate + '</div>' +
              '<div><strong>' + t('healing.healthReport.recoveryDaysLabel', 'Elapsed Recovery') + ':</strong> ' + t(K + 'rep_daysN', '{n} Days', { n: data.elapsedDays }) + '</div>' +
            '</div>' +
          '</div>' +

          '<div class="report-section">' +
            '<h4 class="report-section-title">' + t('healing.healthReport.statusSection', '2. Clinical Status & Symptom Trajectory') + '</h4>' +
            '<div class="report-grid-2">' +
              '<div><strong>' + t(K + 'rep_trajectory', 'Trajectory') + ':</strong> ' + trajectoryLabel + '</div>' +
              '<div><strong>' + t(K + 'rep_highestSeverity', 'Highest Recorded Severity') + ':</strong> ' + lbl('sev_', data.highestSeverity).toUpperCase() + '</div>' +
            '</div>' +
            '<div class="report-metrics-table">' +
              '<table class="report-table">' +
                '<thead>' +
                  '<tr><th>' + t(K + 'rep_thSymptom', 'Symptom Indicator') + '</th><th>' + t(K + 'rep_thPeak', 'Peak Rating') + '</th><th>' + t(K + 'rep_thCurrent', 'Current Rating') + '</th></tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr><td>' + t(K + 'rep_rowRedness', 'Redness / Erythema') + '</td><td>' + data.peakRedness + ' / 3</td><td>' + data.currentRedness + ' / 3</td></tr>' +
                  '<tr><td>' + t(K + 'rep_rowSwelling', 'Swelling / Edema') + '</td><td>' + data.peakSwelling + ' / 3</td><td>' + data.currentSwelling + ' / 3</td></tr>' +
                  '<tr><td>' + t(K + 'rep_rowPain', 'Pain / Tenderness') + '</td><td>' + data.peakPain + ' / 3</td><td>' + data.currentPain + ' / 3</td></tr>' +
                '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>';

      // Allergy Assessment Section if available
      if (data.allergyAssessment) {
        var a = data.allergyAssessment;
        html += 
          '<div class="report-section">' +
            '<h4 class="report-section-title">' + t(K + 'rep_allergySection', 'Product Allergy &amp; Contact Sensitivity Screening') + '</h4>' +
            '<div class="report-grid-2">' +
              '<div><strong>' + t(K + 'rep_screenedProduct', 'Screened Product') + ':</strong> ' + a.productType + '</div>' +
              '<div><strong>' + t(K + 'rep_riskLevel', 'Evaluated Risk Level') + ':</strong> ' + lbl('risk_', a.riskLevel).toUpperCase() + '</div>' +
            '</div>' +
            '<p class="report-note">' + t(K + 'rep_riskNote', 'Risk factors identified: {count}. Follow recommended 24-48h intact patch test protocol before applying any scented or emollient products to broken epidermal barrier.', { count: a.factorsCount }) + '</p>' +
          '</div>';
      }

      // Recent Milestones
      html += 
        '<div class="report-section">' +
          '<h4 class="report-section-title">' + t('healing.healthReport.milestonesSection', '4. Logged Healing Milestones & Entries') + ' (' + t(K + 'rep_totalN', '{n} Total', { n: data.entriesCount }) + ')</h4>' +
          '<div class="report-entries-summary">';

      data.entries.slice(-5).reverse().forEach(function(e) {
        html += 
          '<div class="report-entry-row">' +
            '<div class="report-entry-date"><strong>' + e.date + '</strong> (' + t(K + 'rep_dayN', 'Day {n}', { n: (typeof e.dayOffset === 'number' ? e.dayOffset : '?') }) + ')</div>' +
            '<div class="report-entry-scores">P:' + (e.painLevel || 0) + ' S:' + (e.swellingLevel || 0) + ' R:' + (e.rednessLevel || 0) + '</div>' +
            '<div class="report-entry-note">' + (e.notes ? ('"' + e.notes + '"') : t(K + 'rep_noNotes', 'No notes entered')) + '</div>' +
          '</div>';
      });

      html += 
          '</div>' +
        '</div>' +

        '<div class="report-section report-section--notes">' +
          '<h4 class="report-section-title">' + t('healing.healthReport.studioNotesSection', '5. Studio Review & Professional Check-In Notes') + '</h4>' +
          '<div class="report-studio-space">' +
            '<p class="report-placeholder-text">' + t('healing.healthReport.studioNotesPlaceholder', 'Space for studio piercer, tattoo artist, or medical professional assessment during in-person check-in...') + '</p>' +
            '<div class="report-signature-line">' +
              '<span>' + t(K + 'rep_signature', 'Studio Artist / Piercer Signature') + ': _______________________</span>' +
              '<span>' + t(K + 'rep_dateLine', 'Date') + ': ____________</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="report-footer-disclaimer">' +
          t('healing.healthReport.privacyDisclaimer', 'Privacy notice: Health logs are stored locally in your browser cache and are never transmitted to external servers. Standards cited: ASTM F-136, ASTM F-138, ASTM F-67, USP Class VI, Ph. Eur. 3.2.2, ISO 10993.') +
        '</div>' +
      '</div>';

      container.innerHTML = html;

      // Scroll into view
      try {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    },

    formatAsText: function(data) {
      if (!data) data = this.collectData();

      var lines = [
        '==================================================================',
        t(K + 'txt_title', 'POLI INTERNATIONAL - HEALING HEALTH REPORT'),
        t(K + 'txt_generated', 'Generated') + ': ' + data.generatedAt,
        '=================================================================='
      ];

      if (data.symptomTrendAlert) {
        var alt = data.symptomTrendAlert;
        var sName = alt.symptomType === 'both' ? t('healing.symptomTrendAlert.symptomBoth', 'Redness and Swelling') : (alt.symptomType === 'swelling' ? t('healing.symptomTrendAlert.symptomSwelling', 'Swelling (Edema)') : t('healing.symptomTrendAlert.symptomRedness', 'Redness (Erythema)'));
        var pStr = alt.dates.map(function(d, idx) {
          return d + ' (R:' + alt.rednessScores[idx] + ', S:' + alt.swellingScores[idx] + ')';
        }).join(' -> ');

        lines.push('');
        lines.push('*** ' + t(K + 'trendAlertTitle', 'SYMPTOM TREND ALERT: WORSENING CONSECUTIVE TRAJECTORY') + ' ***');
        lines.push(t(K + 'txt_escSymptom', 'Escalating Symptom') + ': ' + sName);
        lines.push(t(K + 'txt_trajectory3', '3-Day Trajectory') + ': ' + pStr);
        lines.push(t(K + 'recommendationLabel', 'Clinical Recommendation:').toUpperCase() + ' ' + t(K + 'recommendationText', 'Escalating severity over 3 consecutive entries exceeds standard healing trajectories. Contact your studio professional or dermatologist for in-person evaluation.'));
        lines.push('*********************************************************************');
      }

      lines.push('');
      lines.push('1. ' + t(K + 'clientSection', 'Procedure & Placement Summary').toUpperCase());
      lines.push('------------------------------------------------------------------');
      lines.push(t(K + 'procedureLabel', 'Procedure Type') + ': ' + (data.procedureType === 'piercing' ? t(K + 'rep_procBody', 'Body Piercing') : t(K + 'rep_procTattoo', 'Tattoo Art')));
      lines.push(t(K + 'placementLabel', 'Anatomical Placement') + ': ' + data.placement);
      lines.push(t(K + 'dateLabel', 'Procedure Date') + ': ' + data.procedureDate);
      lines.push(t(K + 'recoveryDaysLabel', 'Elapsed Recovery') + ': ' + t(K + 'rep_daysN', '{n} Days', { n: data.elapsedDays }));
      lines.push('');
      lines.push('2. ' + t(K + 'trajectorySection', 'Symptom Trajectory & Trends').toUpperCase());
      lines.push('------------------------------------------------------------------');
      lines.push(t(K + 'rep_trajectory', 'Trajectory') + ': ' + t(K + 'traj_' + data.trajectory, data.trajectory).toUpperCase());
      lines.push(t(K + 'rep_highestSeverity', 'Highest Recorded Severity') + ': ' + lbl('sev_', data.highestSeverity).toUpperCase());
      lines.push(t(K + 'txt_peak', 'Peak Levels') + ': ' + t(K + 'lbl_redness', 'Redness') + ': ' + data.peakRedness + '/3 | ' + t(K + 'lbl_swelling', 'Swelling') + ': ' + data.peakSwelling + '/3 | ' + t(K + 'lbl_pain', 'Pain') + ': ' + data.peakPain + '/3');
      lines.push(t(K + 'txt_current', 'Current Levels') + ': ' + t(K + 'lbl_redness', 'Redness') + ': ' + data.currentRedness + '/3 | ' + t(K + 'lbl_swelling', 'Swelling') + ': ' + data.currentSwelling + '/3 | ' + t(K + 'lbl_pain', 'Pain') + ': ' + data.currentPain + '/3');
      lines.push('');

      if (data.allergyAssessment) {
        lines.push('3. ' + t(K + 'rep_allergySection', 'Product Allergy & Contact Sensitivity Screening').replace(/&amp;/g, '&').toUpperCase());
        lines.push('------------------------------------------------------------------');
        lines.push(t(K + 'rep_screenedProduct', 'Screened Product') + ': ' + data.allergyAssessment.productType);
        lines.push(t(K + 'rep_riskLevel', 'Evaluated Risk Level') + ': ' + lbl('risk_', data.allergyAssessment.riskLevel).toUpperCase());
        lines.push(t(K + 'txt_factorsCount', 'Risk Factors Count') + ': ' + data.allergyAssessment.factorsCount);
        lines.push('');
      }

      lines.push('4. ' + t(K + 'milestonesSection', 'Logged Healing Milestones & Entries').toUpperCase() + ' (' + t(K + 'rep_totalN', '{n} Total', { n: data.entriesCount }).toUpperCase() + ')');
      lines.push('------------------------------------------------------------------');
      data.entries.slice(-5).reverse().forEach(function(e) {
        lines.push('• ' + e.date + ' (' + t(K + 'rep_dayN', 'Day {n}', { n: (typeof e.dayOffset === 'number' ? e.dayOffset : '?') }) + ') | P:' + (e.painLevel || 0) + ' S:' + (e.swellingLevel || 0) + ' R:' + (e.rednessLevel || 0) + ' | ' + t(K + 'txt_note', 'Note') + ': ' + (e.notes || t(K + 'rep_noNotes', 'No notes entered')));
      });
      lines.push('');

      lines.push('5. ' + t(K + 'studioNotesSection', 'Studio Review & Professional Check-In Notes').toUpperCase());
      lines.push('------------------------------------------------------------------');
      lines.push(t(K + 'txt_space', 'Space for piercer / tattoo artist evaluation:'));
      lines.push('[                                                                ]');
      lines.push('[                                                                ]');
      lines.push(t(K + 'txt_signature', 'Professional Signature') + ': _____________________  ' + t(K + 'rep_dateLine', 'Date') + ': ____________');
      lines.push('');
      lines.push('------------------------------------------------------------------');
      lines.push(t(K + 'txt_privacy', 'Privacy Notice: Stored locally in browser cache; zero remote transmission.'));
      lines.push('Poli International Professional Tools | Established Professional Practice');
      lines.push('==================================================================');

      return lines.join('\n');
    },

    print: function() {
      if (!this.currentReportData) this.generate();
      window.print();
    },

    copyText: function() {
      if (!this.currentReportData) this.generate();
      var text = this.formatAsText(this.currentReportData);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          HealthReport.showToast(t('healing.healthReport.copiedToast', 'Health report copied to clipboard!'));
        }).catch(function() {
          HealthReport.fallbackCopy(text);
        });
      } else {
        this.fallbackCopy(text);
      }
    },

    fallbackCopy: function(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showToast(t('healing.healthReport.copiedToast', 'Health report copied to clipboard!'));
      } catch (err) {
        console.warn('Clipboard copy failed');
      }
      document.body.removeChild(textarea);
    },

    downloadText: function() {
      if (!this.currentReportData) this.generate();
      var text = this.formatAsText(this.currentReportData);
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'healing-health-report.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    showToast: function(msg) {
      var toast = document.createElement('div');
      toast.className = 'health-report-toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function() {
        toast.classList.add('health-report-toast--visible');
      }, 10);
      setTimeout(function() {
        toast.classList.remove('health-report-toast--visible');
        setTimeout(function() {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, 2500);
    }
  };

  window.HealthReport = HealthReport;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      HealthReport.init();
    });
  } else {
    HealthReport.init();
  }
})();
