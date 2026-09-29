/**
 * Healing Journey Snapshot
 * Generates an infographic summary on an HTML5 canvas element
 * detailing procedure type, recovery speed, milestone photos, and clinical symptom trajectory.
 * Designed for direct sharing with tattoo artists or professional piercers.
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

  function getThemeColors() {
    var isDark = document.body ? document.body.classList.contains('dark-mode') || !document.body.classList.contains('light-mode') : true;
    if (isDark) {
      return {
        bg: '#121316',
        cardBg: '#1c1e24',
        cardBorder: '#2e333d',
        textPrimary: '#f1f3f7',
        textSecondary: '#9ca3af',
        accent: '#3b82f6',
        accentGold: '#f59e0b',
        accentGreen: '#10b981',
        barBg: '#2d3340',
        badgeBg: '#262a34'
      };
    } else {
      return {
        bg: '#f8fafc',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        textPrimary: '#0f172a',
        textSecondary: '#64748b',
        accent: '#2563eb',
        accentGold: '#d97706',
        accentGreen: '#059669',
        barBg: '#e2e8f0',
        badgeBg: '#f1f5f9'
      };
    }
  }

  var JourneySnapshot = {
    canvas: null,
    ctx: null,

    init: function() {
      this.canvas = document.getElementById('journeySnapshotCanvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
      }
      this.bindEvents();

      var self = this;
      window.addEventListener('languageChanged', function() {
        self.render();
      });
      window.addEventListener('healingEntriesUpdated', function() {
        self.render();
      });
    },

    bindEvents: function() {
      var self = this;
      var generateBtn = document.getElementById('generateSnapshotBtn');
      if (generateBtn) {
        generateBtn.addEventListener('click', function() {
          self.render();
        });
      }

      var downloadBtn = document.getElementById('downloadSnapshotBtn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
          self.download();
        });
      }

      var copyBtn = document.getElementById('copySnapshotBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function() {
          self.copyToClipboard();
        });
      }
    },

    getActiveData: function() {
      var piece = null;
      if (window.HealingLogManager && typeof window.HealingLogManager.getActivePiece === 'function') {
        piece = window.HealingLogManager.getActivePiece();
      }

      var procType = (document.getElementById('procedureType') || {}).value || 'piercing';
      var procDate = (document.getElementById('procedureDate') || {}).value || window.localISODate(new Date());
      var location = '';
      if (procType === 'piercing') {
        location = (document.getElementById('piercingLocation') || {}).value || 'earlobe';
      } else {
        location = (document.getElementById('tattooPlacement') || document.getElementById('tattooLocation') || {}).value || 'forearm';
      }

      if (piece) {
        procType = piece.procedureType || procType;
        procDate = piece.procedureDate || procDate;
        location = piece.location || piece.name || location;
      }

      var entries = (piece && Array.isArray(piece.entries)) ? piece.entries.slice() : [];
      // Sort entries by date ascending
      entries.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
      });

      var today = new Date();
      var startDate = new Date(procDate);
      var elapsedDays = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));

      // Healing estimated total days (e.g. 60 days default, 180 for cartilage)
      var totalEstimateDays = 60;
      if (procType === 'piercing') {
        if (location.includes('helix') || location.includes('industrial') || location.includes('cartilage') || location.includes('conch') || location.includes('rook')) {
          totalEstimateDays = 180;
        } else if (location.includes('lobe')) {
          totalEstimateDays = 60;
        } else {
          totalEstimateDays = 90;
        }
      } else {
        totalEstimateDays = 30; // standard tattoo re-epithelialization
      }

      var progressPct = Math.min(100, Math.round((elapsedDays / totalEstimateDays) * 100));

      // Calculate recovery velocity based on symptom trajectories
      var recoverySpeed = t('healing.snapshot.speedOptimal', 'On Track');
      var latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
      if (latestEntry) {
        var score = (latestEntry.redness || 0) + (latestEntry.swelling || 0) + (latestEntry.tenderness || 0);
        if (score >= 5) {
          recoverySpeed = t('healing.snapshot.speedMonitored', 'Monitored / High Irritation');
        } else if (score <= 1 && elapsedDays >= 7) {
          recoverySpeed = t('healing.snapshot.speedAccelerated', 'Optimal / Fast Resolution');
        }
      }

      return {
        piece: piece,
        procType: procType,
        procDate: procDate,
        location: location,
        elapsedDays: elapsedDays,
        totalEstimateDays: totalEstimateDays,
        progressPct: progressPct,
        recoverySpeed: recoverySpeed,
        entries: entries,
        latestEntry: latestEntry
      };
    },

    render: function() {
      if (!this.canvas) {
        this.canvas = document.getElementById('journeySnapshotCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
      }

      var canvas = this.canvas;
      var ctx = this.ctx;
      var colors = getThemeColors();
      var data = this.getActiveData();

      var w = canvas.width;
      var h = canvas.height;

      // Clear & Background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      // Main Framing Border
      ctx.strokeStyle = colors.cardBorder;
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, w - 32, h - 32);

      // Header Banner
      ctx.fillStyle = colors.cardBg;
      ctx.fillRect(24, 24, w - 48, 110);
      ctx.strokeStyle = colors.cardBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(24, 24, w - 48, 110);

      // Brand Title & Subtitle
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('POLI INTERNATIONAL • AFTERCARE SUITE', 44, 52);

      ctx.fillStyle = colors.textPrimary;
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(t('healing.snapshot.heading', 'HEALING JOURNEY SNAPSHOT'), 44, 88);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = '13px sans-serif';
      var genDateStr = new Date().toLocaleDateString();
      ctx.fillText(t('healing.snapshot.subheading', 'Clinical Recovery & Milestone Infographic • Generated {date}', { date: genDateStr }), 44, 114);

      // Card 1: Procedure Profile (y: 150 -> 270)
      ctx.fillStyle = colors.cardBg;
      ctx.fillRect(24, 150, w - 48, 120);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(24, 150, w - 48, 120);

      // Procedure Type Pill
      var procTypeLabel = data.procType.toUpperCase();
      ctx.fillStyle = colors.badgeBg;
      ctx.fillRect(44, 168, 110, 26);
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(procTypeLabel, 54, 186);

      // Procedure Title
      ctx.fillStyle = colors.textPrimary;
      ctx.font = 'bold 22px sans-serif';
      var locTitle = data.location.replace(/_/g, ' ').toUpperCase();
      ctx.fillText(locTitle, 168, 188);

      // Metadata Row
      ctx.fillStyle = colors.textSecondary;
      ctx.font = '14px sans-serif';
      ctx.fillText(t('healing.snapshot.startedDate', 'Started: {date}', { date: data.procDate }), 44, 230);
      ctx.fillText(t('healing.snapshot.elapsedDays', 'Elapsed: Day {days}', { days: data.elapsedDays }), 260, 230);
      ctx.fillText(t('healing.snapshot.totalWindow', 'Est. Full Window: ~{days} Days', { days: data.totalEstimateDays }), 460, 230);

      // Recovery Progress Bar in Profile Card
      ctx.fillStyle = colors.barBg;
      ctx.fillRect(44, 245, w - 88, 12);
      ctx.fillStyle = colors.accentGreen;
      var fillW = Math.max(8, Math.round(((w - 88) * data.progressPct) / 100));
      ctx.fillRect(44, 245, fillW, 12);

      // Card 2: Recovery Trajectory & Speed (y: 285 -> 405)
      ctx.fillStyle = colors.cardBg;
      ctx.fillRect(24, 285, w - 48, 115);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(24, 285, w - 48, 115);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(t('healing.snapshot.metricsHeader', 'CLINICAL RECOVERY TRAJECTORY'), 44, 310);

      // Recovery Speed Badge
      ctx.fillStyle = colors.badgeBg;
      ctx.fillRect(44, 325, 200, 56);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(44, 325, 200, 56);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = '11px sans-serif';
      ctx.fillText(t('healing.snapshot.speedLabel', 'RECOVERY VELOCITY'), 56, 345);
      ctx.fillStyle = colors.accentGreen;
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(data.recoverySpeed, 56, 368);

      // Recovery Completion
      ctx.fillStyle = colors.badgeBg;
      ctx.fillRect(260, 325, 200, 56);
      ctx.strokeRect(260, 325, 200, 56);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = '11px sans-serif';
      ctx.fillText(t('healing.snapshot.completionLabel', 'COMPLETION ESTIMATE'), 272, 345);
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(data.progressPct + '% ' + t('healing.snapshot.healed', 'Healed'), 272, 368);

      // Total Entries Logged
      ctx.fillStyle = colors.badgeBg;
      ctx.fillRect(476, 325, w - 520, 56);
      ctx.strokeRect(476, 325, w - 520, 56);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = '11px sans-serif';
      ctx.fillText(t('healing.snapshot.logsCountLabel', 'DAILY OBSERVATIONS'), 488, 345);
      ctx.fillStyle = colors.textPrimary;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(data.entries.length + ' ' + t('healing.snapshot.entriesLogged', 'Entries Recorded'), 488, 368);

      // Card 3: Milestone Photos / Visual Journey (y: 415 -> 770)
      ctx.fillStyle = colors.cardBg;
      ctx.fillRect(24, 415, w - 48, 340);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(24, 415, w - 48, 340);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(t('healing.snapshot.photoHeader', 'VISUAL MILESTONE COMPARISON'), 44, 440);

      // Photos layout: 2 side-by-side photo frames
      var frameW = 330;
      var frameH = 260;
      var frame1X = 44;
      var frame1Y = 460;
      var frame2X = 426;
      var frame2Y = 460;

      // Draw baseline frame
      ctx.fillStyle = colors.badgeBg;
      ctx.fillRect(frame1X, frame1Y, frameW, frameH);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(frame1X, frame1Y, frameW, frameH);

      // Draw latest milestone frame
      ctx.fillStyle = colors.badgeBg;
      ctx.fillRect(frame2X, frame2Y, frameW, frameH);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(frame2X, frame2Y, frameW, frameH);

      var baselinePhoto = (data.piece && data.piece.baselinePhoto) ? data.piece.baselinePhoto : null;
      var latestPhoto = null;
      for (var i = data.entries.length - 1; i >= 0; i--) {
        if (data.entries[i] && data.entries[i].photo) {
          latestPhoto = data.entries[i].photo;
          break;
        }
      }

      var self = this;
      var imagesToLoad = 0;
      var loadedImages = 0;

      function onBothPhotosRendered() {
        self.renderBottomCard(ctx, colors, data, w, h);
      }

      if (baselinePhoto) imagesToLoad++;
      if (latestPhoto) imagesToLoad++;

      if (imagesToLoad === 0) {
        // Draw placeholders
        self.drawPhotoPlaceholder(ctx, colors, frame1X, frame1Y, frameW, frameH, t('healing.snapshot.day0Baseline', 'Day 0 (Initial Baseline)'));
        self.drawPhotoPlaceholder(ctx, colors, frame2X, frame2Y, frameW, frameH, t('healing.snapshot.latestPhoto', 'Latest Milestone Entry'));
        onBothPhotosRendered();
      } else {
        if (baselinePhoto) {
          var img1 = new Image();
          img1.onload = function() {
            self.drawAspectFill(ctx, img1, frame1X, frame1Y, frameW, frameH);
            self.drawPhotoBadge(ctx, colors, frame1X + 12, frame1Y + 12, t('healing.snapshot.day0Baseline', 'Day 0 (Initial Baseline)'));
            loadedImages++;
            if (loadedImages === imagesToLoad) onBothPhotosRendered();
          };
          img1.onerror = function() {
            self.drawPhotoPlaceholder(ctx, colors, frame1X, frame1Y, frameW, frameH, t('healing.snapshot.day0Baseline', 'Day 0 (Initial Baseline)'));
            loadedImages++;
            if (loadedImages === imagesToLoad) onBothPhotosRendered();
          };
          img1.src = baselinePhoto;
        } else {
          self.drawPhotoPlaceholder(ctx, colors, frame1X, frame1Y, frameW, frameH, t('healing.snapshot.day0Baseline', 'Day 0 (Initial Baseline)'));
        }

        if (latestPhoto) {
          var img2 = new Image();
          img2.onload = function() {
            self.drawAspectFill(ctx, img2, frame2X, frame2Y, frameW, frameH);
            self.drawPhotoBadge(ctx, colors, frame2X + 12, frame2Y + 12, t('healing.snapshot.latestPhoto', 'Latest Milestone Entry'));
            loadedImages++;
            if (loadedImages === imagesToLoad) onBothPhotosRendered();
          };
          img2.onerror = function() {
            self.drawPhotoPlaceholder(ctx, colors, frame2X, frame2Y, frameW, frameH, t('healing.snapshot.latestPhoto', 'Latest Milestone Entry'));
            loadedImages++;
            if (loadedImages === imagesToLoad) onBothPhotosRendered();
          };
          img2.src = latestPhoto;
        } else {
          self.drawPhotoPlaceholder(ctx, colors, frame2X, frame2Y, frameW, frameH, t('healing.snapshot.latestPhoto', 'Latest Milestone Entry'));
        }
      }

      // Update preview card container display
      var container = document.getElementById('journeySnapshotContainer');
      if (container) container.style.display = 'block';
    },

    drawPhotoBadge: function(ctx, colors, x, y, text) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(x, y, 190, 24);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, 190, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(text, x + 8, y + 16);
      ctx.restore();
    },

    drawPhotoPlaceholder: function(ctx, colors, x, y, w, h, label) {
      ctx.save();
      ctx.fillStyle = colors.badgeBg;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷', x + w / 2, y + h / 2 - 10);

      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(label, x + w / 2, y + h / 2 + 25);

      ctx.font = '11px sans-serif';
      ctx.fillText(t('healing.snapshot.noPhotoNotice', 'No photo uploaded for this milestone'), x + w / 2, y + h / 2 + 45);
      ctx.restore();
    },

    drawAspectFill: function(ctx, img, x, y, w, h) {
      var imgRatio = img.width / img.height;
      var targetRatio = w / h;
      var sx, sy, sw, sh;

      if (imgRatio > targetRatio) {
        sh = img.height;
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = img.width / targetRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    },

    renderBottomCard: function(ctx, colors, data, w, h) {
      // Card 4: Clinical Advisory & Downsizing / Care Note (y: 770 -> 940)
      ctx.fillStyle = colors.cardBg;
      ctx.fillRect(24, 770, w - 48, 160);
      ctx.strokeStyle = colors.cardBorder;
      ctx.strokeRect(24, 770, w - 48, 160);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(t('healing.snapshot.advisoryHeader', 'CLINICAL OBSERVATION & AFTERCARE ADVISORY'), 44, 796);

      // Detail bullets
      ctx.fillStyle = colors.textPrimary;
      ctx.font = '13px sans-serif';

      var bullet1 = t('healing.snapshot.bullet1', '• Aftercare regime: Maintain sterile 0.9% saline irrigation; avoid manual friction, twisting, or sleeping on the site.');
      var bullet2 = t('healing.snapshot.bullet2', '• Sun protection: Open healing dermis requires physical shade; do NOT apply chemical sunscreens on unclosed tissue.');
      var bullet3 = data.procType === 'piercing'
        ? t('healing.snapshot.bullet3Piercing', '• Jewelry status: Monitor bar clearance daily. Downsizing evaluation recommended at scheduled studio milestone.')
        : t('healing.snapshot.bullet3Tattoo', '• Epidermal barrier: Keratinocyte layer consolidating. Maintain fragrance-free hydration to prevent cracking.');

      ctx.fillText(bullet1, 44, 825);
      ctx.fillText(bullet2, 44, 852);
      ctx.fillText(bullet3, 44, 879);

      // Studio Signature & Confidentiality line
      ctx.fillStyle = colors.textSecondary;
      ctx.font = '11px sans-serif';
      ctx.fillText(t('healing.snapshot.confidential', 'Verified client-side record • Stored strictly on device • Poli International Professional Tools'), 44, 915);
    },

    download: function() {
      if (!this.canvas) return;
      var link = document.createElement('a');
      link.download = 'healing-journey-snapshot.png';
      link.href = this.canvas.toDataURL('image/png');
      link.click();
    },

    copyToClipboard: function() {
      if (!this.canvas) return;
      var self = this;
      if (navigator.clipboard && typeof window.ClipboardItem === 'function') {
        this.canvas.toBlob(function(blob) {
          if (!blob) return;
          navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
            .then(function() {
              alert(t('healing.snapshot.copiedAlert', 'Snapshot copied to clipboard! You can paste it directly into messages to your artist or piercer.'));
            })
            .catch(function(err) {
              console.error('Clipboard write error', err);
              self.download();
            });
        });
      } else {
        this.download();
      }
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      JourneySnapshot.init();
    });
  } else {
    JourneySnapshot.init();
  }

  window.JourneySnapshot = JourneySnapshot;
})();
