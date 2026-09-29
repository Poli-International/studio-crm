/**
 * Jewelry Longevity & Downsizing Calculator for Piercings
 * Calculates expected material lifespan, optimal professional downsizing windows,
 * and fastener integrity check schedules based on anatomical location and metallurgy.
 * 
 * Standards cited: ASTM F-136, ASTM F-67, EN 1811, ISO 10993.
 * BioFlex(R) body jewelry is PP-R random copolymer (creator: Patrick Poli).
 * Poli International Professional Tools
 */
'use strict';

(function() {
  function t(key, fallback, params) {
    if (typeof window.t === 'function') {
      var res = window.t(key, params);
      if (res && res !== key) return res;
    }
    return fallback || key;
  }

  var JewelryLongevityData = {
    materials: {
      titanium_f136: {
        nameKey: 'jewelryLongevity.materials.titanium_f136.name',
        fallbackName: 'Implant-Grade Titanium (ASTM F-136 / Ti-6Al-4V ELI)',
        baseLifespanYears: 30,
        biocompatibility: 'ISO 10993 Compliant',
        hardnessHv: '330-360 HV',
        corrosionResistance: 'Excellent (Passivated TiO2 layer)',
        finishRetention: 'Long-term (decades for high-polish; 1-3 years for anodized color in high-wear zones)',
        standards: ['ASTM F-136', 'ISO 10993']
      },
      titanium_f67: {
        nameKey: 'jewelryLongevity.materials.titanium_f67.name',
        fallbackName: 'Commercially Pure Titanium (ASTM F-67 Grade 4)',
        baseLifespanYears: 30,
        biocompatibility: 'ISO 10993 Compliant',
        hardnessHv: '250-290 HV',
        corrosionResistance: 'Outstanding (Inert passivated oxide)',
        finishRetention: 'Decades for mirror polish',
        standards: ['ASTM F-67', 'ISO 10993']
      },
      gold_14k: {
        nameKey: 'jewelryLongevity.materials.gold_14k.name',
        fallbackName: '14K Solid Gold (Nickel-Free / EN 1811 Compliant)',
        baseLifespanYears: 25,
        biocompatibility: 'Biocompatible (EN 1811 nickel release compliant)',
        hardnessHv: '140-160 HV',
        corrosionResistance: 'High nobility, tarnish-resistant',
        finishRetention: 'Long-term (softer than titanium, periodic professional repolish every 3-5 years)',
        standards: ['EN 1811', 'Established Professional Practice']
      },
      gold_18k: {
        nameKey: 'jewelryLongevity.materials.gold_18k.name',
        fallbackName: '18K Solid Gold (Nickel-Free / EN 1811 Compliant)',
        baseLifespanYears: 25,
        biocompatibility: 'Biocompatible (EN 1811 nickel release compliant)',
        hardnessHv: '120-140 HV',
        corrosionResistance: 'Superior nobility',
        finishRetention: 'Long-term (soft metal, susceptible to tooth/shear marks if used in oral)',
        standards: ['EN 1811', 'Established Professional Practice']
      },
      bioflex: {
        nameKey: 'jewelryLongevity.materials.bioflex.name',
        fallbackName: 'BioFlex(R) PP-R Copolymer (Medical Grade Polymer)',
        baseLifespanYears: 1, // Recommended 6-12 month replacement cycle for moving tissue/retainers
        biocompatibility: 'USP Class VI & ISO 10993 Medical Grade',
        hardnessHv: 'Flexible polymer (Shore D ~72)',
        corrosionResistance: 'Immune to bodily fluids, oral acid, and sweat',
        finishRetention: 'Long-term wear; replace if scratched, bent or discoloured',
        standards: ['ISO 10993', 'BioFlex PP-R random copolymer']
      }
    },

    locations: {
      oral_tongue: {
        nameKey: 'jewelryLongevity.locations.oral_tongue.name',
        fallbackName: 'Tongue (Center / Venom)',
        category: 'oral',
        downsizeWeeksMin: 2,
        downsizeWeeksMax: 3,
        downsizeUrgency: 'critical',
        checkIntervalMonths: 1,
        salivaExposure: 'high',
        frictionLevel: 'high'
      },
      oral_lip: {
        nameKey: 'jewelryLongevity.locations.oral_lip.name',
        fallbackName: 'Lip / Labret / Medusa / Monroe',
        category: 'oral',
        downsizeWeeksMin: 2,
        downsizeWeeksMax: 4,
        downsizeUrgency: 'critical',
        checkIntervalMonths: 1,
        salivaExposure: 'high',
        frictionLevel: 'moderate'
      },
      ear_cartilage: {
        nameKey: 'jewelryLongevity.locations.ear_cartilage.name',
        fallbackName: 'Ear Cartilage (Helix, Conch, Tragus, Rook, Daith, Flat)',
        category: 'cartilage',
        downsizeWeeksMin: 4,
        downsizeWeeksMax: 8,
        downsizeUrgency: 'high',
        checkIntervalMonths: 3,
        salivaExposure: 'none',
        frictionLevel: 'moderate'
      },
      ear_industrial: {
        nameKey: 'jewelryLongevity.locations.ear_industrial.name',
        fallbackName: 'Industrial / Scaffold Barbell',
        category: 'cartilage',
        downsizeWeeksMin: 6,
        downsizeWeeksMax: 10,
        downsizeUrgency: 'high',
        checkIntervalMonths: 2,
        salivaExposure: 'none',
        frictionLevel: 'high'
      },
      ear_lobe: {
        nameKey: 'jewelryLongevity.locations.ear_lobe.name',
        fallbackName: 'Earlobe (Standard & Upper)',
        category: 'fleshy',
        downsizeWeeksMin: 4,
        downsizeWeeksMax: 6,
        downsizeUrgency: 'moderate',
        checkIntervalMonths: 6,
        salivaExposure: 'none',
        frictionLevel: 'low'
      },
      nose_nostril: {
        nameKey: 'jewelryLongevity.locations.nose_nostril.name',
        fallbackName: 'Nostril / High Nostril',
        category: 'facial',
        downsizeWeeksMin: 4,
        downsizeWeeksMax: 8,
        downsizeUrgency: 'high',
        checkIntervalMonths: 3,
        salivaExposure: 'none',
        frictionLevel: 'low'
      },
      nose_septum: {
        nameKey: 'jewelryLongevity.locations.nose_septum.name',
        fallbackName: 'Septum',
        category: 'facial',
        downsizeWeeksMin: 6,
        downsizeWeeksMax: 8,
        downsizeUrgency: 'low',
        checkIntervalMonths: 6,
        salivaExposure: 'none',
        frictionLevel: 'low'
      },
      body_navel: {
        nameKey: 'jewelryLongevity.locations.body_navel.name',
        fallbackName: 'Navel (Belly Button)',
        category: 'body',
        downsizeWeeksMin: 6,
        downsizeWeeksMax: 12,
        downsizeUrgency: 'moderate',
        checkIntervalMonths: 3,
        salivaExposure: 'none',
        frictionLevel: 'high'
      },
      body_nipple: {
        nameKey: 'jewelryLongevity.locations.body_nipple.name',
        fallbackName: 'Nipple',
        category: 'body',
        downsizeWeeksMin: 6,
        downsizeWeeksMax: 10,
        downsizeUrgency: 'high',
        checkIntervalMonths: 2,
        salivaExposure: 'none',
        frictionLevel: 'moderate'
      },
      facial_eyebrow: {
        nameKey: 'jewelryLongevity.locations.facial_eyebrow.name',
        fallbackName: 'Eyebrow / Anti-Eyebrow',
        category: 'facial',
        downsizeWeeksMin: 5,
        downsizeWeeksMax: 8,
        downsizeUrgency: 'high',
        checkIntervalMonths: 3,
        salivaExposure: 'none',
        frictionLevel: 'moderate'
      },
      surface_dermal: {
        nameKey: 'jewelryLongevity.locations.surface_dermal.name',
        fallbackName: 'Surface Anchor / Microdermal',
        category: 'surface',
        downsizeWeeksMin: 8,
        downsizeWeeksMax: 16,
        downsizeUrgency: 'moderate',
        checkIntervalMonths: 2,
        salivaExposure: 'none',
        frictionLevel: 'high'
      }
    },

    fasteners: {
      threadless: {
        nameKey: 'jewelryLongevity.fasteners.threadless.name',
        fallbackName: 'Threadless Push-Pin (25-degree pre-bend)',
        tensionCheckMonths: 3,
        maintenanceTipKey: 'jewelryLongevity.fasteners.threadless.tip',
        fallbackTip: 'Check pin tension every 3 months. If loose, gently increase the bend angle of the pin before reinserting into the post.'
      },
      internally_threaded: {
        nameKey: 'jewelryLongevity.fasteners.internally_threaded.name',
        fallbackName: 'Internally Threaded (Counter-clockwise loosen, clockwise secure)',
        tensionCheckMonths: 1,
        maintenanceTipKey: 'jewelryLongevity.fasteners.internally_threaded.tip',
        fallbackTip: 'Gently test ball tightness monthly with clean nitrile-gloved fingers. Ensure threaded end seats squarely without cross-threading.'
      },
      clicker_hinge: {
        nameKey: 'jewelryLongevity.fasteners.clicker_hinge.name',
        fallbackName: 'Hinged Segment / Clicker Ring',
        tensionCheckMonths: 4,
        maintenanceTipKey: 'jewelryLongevity.fasteners.clicker_hinge.tip',
        fallbackTip: 'Check clasp click feedback every 4 months. Clasp should snap audibly with positive mechanical retention.'
      },
      captive_bead: {
        nameKey: 'jewelryLongevity.fasteners.captive_bead.name',
        fallbackName: 'Captive Bead Ring (CBR)',
        tensionCheckMonths: 6,
        maintenanceTipKey: 'jewelryLongevity.fasteners.captive_bead.tip',
        fallbackTip: 'Ensure dimpled bead sits firmly centered between ring gap. Have studio adjust ring tension with ring-opening pliers if loose.'
      }
    }
  };

  var JewelryLongevityCalculator = {
    init: function() {
      var form = document.getElementById('jewelryLongevityForm');
      var calcBtn = document.getElementById('calculateJewelryLongevityBtn');
      var locSelect = document.getElementById('jewelryLocationSelect');
      var matSelect = document.getElementById('jewelryMaterialSelect');
      var fastSelect = document.getElementById('jewelryFastenerSelect');
      var dateInput = document.getElementById('jewelryProcedureDateInput');

      if (!form && !calcBtn) return;

      // Auto-populate from active procedure if available
      this.syncWithTracker();

      if (calcBtn) {
        calcBtn.addEventListener('click', function(e) {
          e.preventDefault();
          JewelryLongevityCalculator.calculate();
        });
      }

      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          JewelryLongevityCalculator.calculate();
        });
      }

      // Re-run on inputs change
      [locSelect, matSelect, fastSelect, dateInput].forEach(function(el) {
        if (el) {
          el.addEventListener('change', function() {
            JewelryLongevityCalculator.calculate();
          });
        }
      });

      // Update when language changes
      window.addEventListener('languageChanged', function() {
        JewelryLongevityCalculator.calculate();
      });

      // Initial calculation if ready
      this.calculate();
    },

    calculateLongevity: function(locKey, matKey, fastKey, procDateStr) {
      var locData = JewelryLongevityData.locations[locKey] || JewelryLongevityData.locations.ear_cartilage;
      var matData = JewelryLongevityData.materials[matKey] || JewelryLongevityData.materials.titanium_f136;
      var fastData = JewelryLongevityData.fasteners[fastKey] || JewelryLongevityData.fasteners.threadless;

      var procDate = procDateStr ? new Date(procDateStr) : new Date();
      var now = new Date();
      var elapsedDays = Math.max(0, Math.floor((now.getTime() - procDate.getTime()) / (1000 * 60 * 60 * 24)));

      var downsizeMinDays = locData.downsizeWeeksMin * 7;
      var downsizeMaxDays = locData.downsizeWeeksMax * 7;

      var minDownsizeDate = new Date(procDate.getTime() + downsizeMinDays * 24 * 60 * 60 * 1000);
      var maxDownsizeDate = new Date(procDate.getTime() + downsizeMaxDays * 24 * 60 * 60 * 1000);

      var isDownsizeDue = elapsedDays >= downsizeMinDays && elapsedDays <= downsizeMaxDays;
      var isDownsizeOverdue = elapsedDays > downsizeMaxDays;
      var isTooEarly = elapsedDays < downsizeMinDays;
      var daysUntilDownsize = Math.max(0, downsizeMinDays - elapsedDays);

      return {
        location: locData,
        material: matData,
        fastener: fastData,
        elapsedDays: elapsedDays,
        optimalDownsizeMinWeeks: locData.downsizeWeeksMin,
        optimalDownsizeMaxWeeks: locData.downsizeWeeksMax,
        minDownsizeDate: minDownsizeDate,
        maxDownsizeDate: maxDownsizeDate,
        isDownsizeDue: isDownsizeDue,
        isDownsizeOverdue: isDownsizeOverdue,
        isTooEarly: isTooEarly,
        daysUntilDownsize: daysUntilDownsize
      };
    },

    syncWithTracker: function() {
      var locSelect = document.getElementById('jewelryLocationSelect');
      var dateInput = document.getElementById('jewelryProcedureDateInput');
      var pType = document.getElementById('procedureType');
      var pLoc = document.getElementById('piercingLocation');
      var pDate = document.getElementById('procedureDate');

      if (dateInput && pDate && pDate.value) {
        dateInput.value = pDate.value;
      }

      if (locSelect && pLoc && pLoc.value) {
        locSelect.value = this.mapPiercingLocationKey(pLoc.value);
      }
    },

    mapPiercingLocationKey: function(key) {
      if (['tongue', 'tongue_web', 'venom'].includes(key)) return 'oral_tongue';
      if (['labret', 'vertical_labret', 'medusa', 'monroe', 'snake_bites', 'angel_bites', 'cheek'].includes(key)) return 'oral_lip';
      if (['helix', 'conch', 'tragus', 'anti_tragus', 'rook', 'daith', 'snug', 'forward_helix'].includes(key)) return 'ear_cartilage';
      if (key === 'industrial') return 'ear_industrial';
      if (['earlobe', 'orbital'].includes(key)) return 'ear_lobe';
      if (['nostril', 'high_nostril'].includes(key)) return 'nose_nostril';
      if (key === 'septum') return 'nose_septum';
      if (key === 'navel') return 'body_navel';
      if (key === 'nipple') return 'body_nipple';
      if (['eyebrow', 'anti_eyebrow', 'bridge'].includes(key)) return 'facial_eyebrow';
      if (['surface', 'dermal_anchor', 'nape', 'sternum'].includes(key)) return 'surface_dermal';
      return 'ear_cartilage';
    },

    calculate: function() {
      var locKey = (document.getElementById('jewelryLocationSelect') || {}).value || 'ear_cartilage';
      var matKey = (document.getElementById('jewelryMaterialSelect') || {}).value || 'titanium_f136';
      var fastKey = (document.getElementById('jewelryFastenerSelect') || {}).value || 'threadless';
      var procDateStr = (document.getElementById('jewelryProcedureDateInput') || {}).value || '';

      var locData = JewelryLongevityData.locations[locKey] || JewelryLongevityData.locations.ear_cartilage;
      var matData = JewelryLongevityData.materials[matKey] || JewelryLongevityData.materials.titanium_f136;
      var fastData = JewelryLongevityData.fasteners[fastKey] || JewelryLongevityData.fasteners.threadless;

      var resultContainer = document.getElementById('jewelryLongevityResults');
      if (!resultContainer) return;

      // Calculate Target Downsizing Dates
      var procDate = procDateStr ? new Date(procDateStr) : new Date();
      var now = new Date();
      var elapsedDays = Math.max(0, Math.floor((now.getTime() - procDate.getTime()) / (1000 * 60 * 60 * 24)));

      var downsizeMinDays = locData.downsizeWeeksMin * 7;
      var downsizeMaxDays = locData.downsizeWeeksMax * 7;

      var minDownsizeDate = new Date(procDate.getTime() + downsizeMinDays * 24 * 60 * 60 * 1000);
      var maxDownsizeDate = new Date(procDate.getTime() + downsizeMaxDays * 24 * 60 * 60 * 1000);

      var isDownsizeDue = elapsedDays >= downsizeMinDays && elapsedDays <= downsizeMaxDays;
      var isDownsizeOverdue = elapsedDays > downsizeMaxDays;
      var isTooEarly = elapsedDays < downsizeMinDays;

      var daysUntilDownsize = Math.max(0, downsizeMinDays - elapsedDays);

      // Downsize Status Badge & Text
      var downsizeStatusBadge = '';
      var downsizeStatusClass = '';
      if (isDownsizeOverdue) {
        downsizeStatusBadge = t('jewelryLongevity.status.overdue', '⚠️ DOWNSIZE OVERDUE - CONTACT STUDIO');
        downsizeStatusClass = 'jewelry-status-badge--overdue';
      } else if (isDownsizeDue) {
        downsizeStatusBadge = t('jewelryLongevity.status.dueNow', '🔔 DOWNSIZE WINDOW ACTIVE (NOW)');
        downsizeStatusClass = 'jewelry-status-badge--active';
      } else {
        downsizeStatusBadge = t('jewelryLongevity.status.healing', '⏳ HEALING PHASE - DOWNSIZE IN {days} DAYS', { days: daysUntilDownsize });
        downsizeStatusClass = 'jewelry-status-badge--healing';
      }

      // Material Lifespan Description
      var lifespanYears = matData.baseLifespanYears;
      var materialLifespanLabel = (matKey === 'bioflex') 
        ? t('jewelryLongevity.lifespan.bioflex', 'Long-term wear (inspect at every check; replace if scratched, bent or discoloured)')
        : t('jewelryLongevity.lifespan.metal', '25+ Years / Lifetime Base Metallurgy (ASTM / EN Compliant)');

      // Maintenance Interval
      var checkInterval = locData.checkIntervalMonths;
      var checkIntervalLabel = t('jewelryLongevity.checkInterval', 'Every {months} month(s)', { months: checkInterval });

      // Render Output Card
      var html = 
        '<div class="jewelry-longevity-result-card">' +
          '<div class="jewelry-result-header">' +
            '<div class="jewelry-result-title-group">' +
              '<span class="jewelry-result-badge ' + downsizeStatusClass + '">' + downsizeStatusBadge + '</span>' +
              '<h3 class="jewelry-result-title">' + t(matData.nameKey, matData.fallbackName) + '</h3>' +
              '<p class="jewelry-result-subtitle">' + t(locData.nameKey, locData.fallbackName) + ' • ' + t(fastData.nameKey, fastData.fallbackName) + '</p>' +
            '</div>' +
          '</div>' +

          '<div class="jewelry-metrics-grid">' +
            // Metric 1: Professional Downsizing Window
            '<div class="jewelry-metric-box jewelry-metric-box--highlight">' +
              '<span class="jewelry-metric-label">' + t('jewelryLongevity.labels.downsizingWindow', 'OPTIMAL DOWNSIZING WINDOW') + '</span>' +
              '<div class="jewelry-metric-value">' + locData.downsizeWeeksMin + ' - ' + locData.downsizeWeeksMax + ' ' + t('jewelryLongevity.labels.weeks', 'Weeks') + '</div>' +
              '<p class="jewelry-metric-subtext">' +
                t('jewelryLongevity.labels.recommendedDates', 'Target Studio Visit:') + ' ' +
                '<strong>' + minDownsizeDate.toLocaleDateString() + '</strong> ➔ <strong>' + maxDownsizeDate.toLocaleDateString() + '</strong>' +
              '</p>' +
            '</div>' +

            // Metric 2: Material Metallurgy Lifespan
            '<div class="jewelry-metric-box">' +
              '<span class="jewelry-metric-label">' + t('jewelryLongevity.labels.materialLifespan', 'MATERIAL & FINISH LIFESPAN') + '</span>' +
              '<div class="jewelry-metric-value jewelry-metric-value--medium">' + materialLifespanLabel + '</div>' +
              '<p class="jewelry-metric-subtext">' +
                t('jewelryLongevity.labels.biocompatibility', 'Standard:') + ' ' + matData.standards.join(', ') + ' (' + matData.hardnessHv + ')' +
              '</p>' +
            '</div>' +

            // Metric 3: Fastener & Integrity Check Interval
            '<div class="jewelry-metric-box">' +
              '<span class="jewelry-metric-label">' + t('jewelryLongevity.labels.fastenerCheck', 'INTEGRITY & TENSION CHECK') + '</span>' +
              '<div class="jewelry-metric-value">' + checkIntervalLabel + '</div>' +
              '<p class="jewelry-metric-subtext">' +
                t('jewelryLongevity.labels.fastenerType', 'Mechanism:') + ' ' + t(fastData.nameKey, fastData.fallbackName) +
              '</p>' +
            '</div>' +
          '</div>' +

          // Professional Downsizing Guidance Box
          '<div class="jewelry-clinical-note ' + (locData.downsizeUrgency === 'critical' ? 'jewelry-clinical-note--urgent' : '') + '">' +
            '<div class="jewelry-note-heading">' +
              '<span>' + (locData.downsizeUrgency === 'critical' ? '🚨' : '💡') + '</span>' +
              '<strong>' + t('jewelryLongevity.downsizeGuidance.title', 'Why Professional Downsizing is Critical for this Placement') + '</strong>' +
            '</div>' +
            '<p>' +
              (locData.category === 'oral' 
                ? t('jewelryLongevity.downsizeGuidance.oral', 'Initial oral posts are sized long to accommodate dramatic post-procedure edema. Once swelling subsides (Weeks 2-4), an oversized post causes enamel erosion, gum recession, and bite entrapment. Downsizing at a studio is urgent.')
                : locData.category === 'cartilage'
                ? t('jewelryLongevity.downsizeGuidance.cartilage', 'Cartilage swells initially but heals with rigid tissue. Leaving the initial long post causes jewelry to tilt under sleeping pressure, altering the piercing channel angle and producing persistent irritation bumps.')
                : t('jewelryLongevity.downsizeGuidance.general', 'Initial posts accommodate swelling and drainage. Downsizing to a snug, flush post minimizes snagging, speeds re-epithelialization, and ensures long-term comfort.')) +
            '</p>' +
          '</div>' +

          // Fastener Maintenance Tips
          '<div class="jewelry-fastener-tips">' +
            '<h4 class="jewelry-section-title">' + t('jewelryLongevity.fastenerTips.title', 'Fastener Maintenance Protocol') + '</h4>' +
            '<div class="jewelry-tip-item">' +
              '<span class="jewelry-tip-icon">🔧</span>' +
              '<div class="jewelry-tip-text">' + t(fastData.maintenanceTipKey, fastData.fallbackTip) + '</div>' +
            '</div>' +
            (matKey === 'bioflex' ? (
              '<div class="jewelry-tip-item">' +
                '<span class="jewelry-tip-icon">✨</span>' +
                '<div class="jewelry-tip-text">' + t('jewelryLongevity.bioflexNote', 'BioFlex(R) body jewelry is medical-grade PP-R random copolymer, suitable for long-term wear. Inspect it at every check and replace it if it is scratched, bent or discoloured, as you would any jewelry.') + '</div>' +
              '</div>'
            ) : '') +
          '</div>' +

          // Standard Citations
          '<div class="jewelry-standards-footer">' +
            '<span>' + t('jewelryLongevity.standardsFooter', 'Cited Metallurgical & Biological Standards: ASTM F-136, ASTM F-67, EN 1811 (nickel-release compliant), ISO 10993. Established professional practice.') + '</span>' +
          '</div>' +
        '</div>';

      resultContainer.innerHTML = html;
      resultContainer.style.display = 'block';
    }
  };

  window.JewelryLongevity = JewelryLongevityCalculator;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      JewelryLongevityCalculator.init();
    });
  } else {
    JewelryLongevityCalculator.init();
  }
})();
