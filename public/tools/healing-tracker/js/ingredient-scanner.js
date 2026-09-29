/**
 * Product Ingredient Scanner
 * Cross-references aftercare lotions, cleansers, and balms against a clinical database
 * of irritants, contact allergens, occlusive barriers, and cytotoxics for tattoos and piercings.
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

  var IRRITANT_DATABASE = [
    // --- HIGH HAZARD / PROHIBITED ON HEALING WOUNDS ---
    {
      tokens: ['alcohol denat', 'denatured alcohol', 'isopropyl alcohol', 'sd alcohol', 'ethyl alcohol', 'rubbing alcohol'],
      name: 'Denatured / Isopropyl Alcohol',
      hazard: 'high',
      category: 'Drying Solvent & Tissue Dehydrator',
      reason: 'Causes acute dermal desiccation, cell membrane lysis, and delays re-epithelialization.',
      standard: 'Established professional practice',
      alternative: 'Sterile 0.9% saline or alcohol-free isotonic wound wash.'
    },
    {
      tokens: ['fragrance', 'parfum', 'aroma', 'synthetic musk', 'perfume'],
      name: 'Synthetic Fragrance / Parfum',
      hazard: 'high',
      category: 'Primary Contact Allergen',
      reason: 'Number one cosmetic trigger of allergic contact dermatitis on open punctures and tattooed skin.',
      standard: 'EU REACH Annex XVII / Established professional practice',
      alternative: 'Fragrance-free, dye-free formulation.'
    },
    {
      tokens: ['tea tree oil', 'melaleuca alternifolia'],
      name: 'Tea Tree Oil (Melaleuca Alternifolia)',
      hazard: 'high',
      category: 'Essential Oil Terpene / Chemical Irritant',
      reason: 'High sensitization rate; causes localized chemical burns, contact dermatitis, and tissue necrosis on puncture wounds.',
      standard: 'Established professional practice',
      alternative: 'Sterile 0.9% isotonic saline spray.'
    },
    {
      tokens: ['hydrogen peroxide'],
      name: 'Hydrogen Peroxide (H2O2)',
      hazard: 'high',
      category: 'Cytotoxic Oxidizer',
      reason: 'Cytotoxic to healthy proliferating fibroblasts and capillary buds; destroys newly forming granulation tissue.',
      standard: 'Established professional practice',
      alternative: 'Sterile 0.9% sodium chloride wound wash.'
    },
    {
      tokens: ['chlorhexidine', 'chlorhexidine gluconate', 'hibiclens'],
      name: 'Chlorhexidine',
      hazard: 'high',
      category: 'Harsh Antiseptic',
      reason: 'High irritant potential on mucous membranes and piercing channels; delays physiological re-epithelialization.',
      standard: 'Established professional practice',
      alternative: 'Preservative-free sterile saline solution.'
    },
    {
      tokens: ['povidone-iodine', 'iodine', 'betadine'],
      name: 'Povidone-Iodine',
      hazard: 'high',
      category: 'Staining Tissue Dehydrator',
      reason: 'Severely dries open puncture channels and causes tissue irritation without clinical bacterial indication.',
      standard: 'Established professional practice',
      alternative: 'Sterile 0.9% saline irrigation.'
    },
    {
      tokens: ['petrolatum', 'petroleum jelly', 'vaseline'],
      name: 'Petrolatum / Petroleum Jelly (Heavy Occlusive)',
      hazard: 'high',
      category: 'Non-Breathable Occlusive Barrier',
      reason: '100% occlusive barrier suffocates puncture wounds, halts cellular respiration, and traps anaerobic bacteria.',
      standard: 'Established professional practice',
      alternative: 'Breathable, water-based lotion (tattoos) or sterile saline (piercings).'
    },
    {
      tokens: ['neomycin', 'bacitracin', 'polymyxin b'],
      name: 'Topical Antibiotics (Neomycin / Bacitracin)',
      hazard: 'high',
      category: 'Sensitizing Topical Antibiotic',
      reason: 'Frequent cause of severe allergic contact dermatitis (often mistaken for infection) and promotes resistant bacterial strains.',
      standard: 'Dermatological consensus / Established professional practice',
      alternative: 'Clean irrigation with sterile 0.9% saline without topical antibiotics.'
    },
    {
      tokens: ['sodium lauryl sulfate', 'sls', 'ammonium lauryl sulfate'],
      name: 'Sodium Lauryl Sulfate (SLS)',
      hazard: 'high',
      category: 'Harsh Anionic Surfactant',
      reason: 'Strips the skin natural lipid envelope, causing severe barrier collapse and burning on active wounds.',
      standard: 'Established professional practice',
      alternative: 'Ultra-mild, surfactant-free or gentle syndet cleanser.'
    },
    {
      tokens: ['salicylic acid', 'glycolic acid', 'lactic acid', 'retinol', 'tretinoin', 'aha', 'bha'],
      name: 'Chemical Exfoliants (Salicylic / Glycolic / Retinoids)',
      hazard: 'high',
      category: 'Chemical Keratolytic Exfoliant',
      reason: 'Dissolves developing stratum corneum, peels tattoo pigment prematurely, and creates chemical trauma.',
      standard: 'Established professional practice',
      alternative: 'Physiological repair formulas with Provitamin B5 (Panthenol).'
    },

    // --- CAUTION / MODERATE HAZARD ---
    {
      tokens: ['lanolin', 'lanolin alcohol', 'wool alcohol'],
      name: 'Lanolin (Wool Wax)',
      hazard: 'moderate',
      category: 'Common Sensitizing Emollient',
      reason: 'Recognized contact allergen for individuals sensitive to sheep wool derivatives.',
      standard: 'Established professional practice',
      alternative: 'Plant-derived non-comedogenic oils or panthenol balms.'
    },
    {
      tokens: ['methylisothiazolinone', 'methylchloroisothiazolinone', 'dmdm hydantoin'],
      name: 'Isothiazolinone / Formaldehyde Releasers',
      hazard: 'moderate',
      category: 'Sensitizing Preservative',
      reason: 'Known allergens regulated under EU cosmetic limits; can trigger flare-ups on broken skin.',
      standard: 'EU REACH Annex XVII',
      alternative: 'Preservative-free sterile unit-dose sprays.'
    },
    {
      tokens: ['cocoa butter', 'theobroma cacao'],
      name: 'Cocoa Butter (Theobroma Cacao)',
      hazard: 'moderate',
      category: 'Heavy Comedogenic Lipid',
      reason: 'Beneficial for fully healed tattoos, but may clog healing puncture channels or promote acneiform eruptions.',
      standard: 'Established professional practice',
      alternative: 'Lightweight fragrance-free water-in-oil lotion.'
    },

    // --- SAFE & BENEFICIAL INGREDIENTS ---
    {
      tokens: ['sodium chloride', 'saline', 'sterile saline'],
      name: 'Sodium Chloride (0.9% Saline)',
      hazard: 'safe',
      category: 'Isotonic Physiological Irrigant',
      reason: 'Matches bodily osmolarity (0.9%). Flushes cellular debris without cytotoxic damage to newly forming fibroblasts.',
      standard: 'Established professional practice / ISO 10993',
      alternative: 'Gold standard aftercare.'
    },
    {
      tokens: ['aqua', 'water', 'purified water'],
      name: 'Purified Water (Aqua)',
      hazard: 'safe',
      category: 'Neutral Solvent',
      reason: 'Essential base for gentle hydration and irrigation.',
      standard: 'Established professional practice',
      alternative: 'Recommended base.'
    },
    {
      tokens: ['panthenol', 'd-panthenol', 'provitamin b5'],
      name: 'Panthenol (Provitamin B5)',
      hazard: 'safe',
      category: 'Cellular Regeneration Promoter',
      reason: 'Accelerates keratinocyte migration and tissue re-epithelialization.',
      standard: 'Dermatological consensus',
      alternative: 'Highly recommended for tattoo aftercare.'
    },
    {
      tokens: ['allantoin'],
      name: 'Allantoin',
      hazard: 'safe',
      category: 'Keratolytic Soothing Agent',
      reason: 'Calms inflammation, stimulates healthy tissue repair, and softens skin.',
      standard: 'Established professional practice',
      alternative: 'Recommended soothing agent.'
    },
    {
      tokens: ['glycerin', 'glycerol'],
      name: 'Glycerin',
      hazard: 'safe',
      category: 'Physiological Humectant',
      reason: 'Maintains dermal stratum corneum moisture and elasticity without clogging tissue pores.',
      standard: 'Established professional practice',
      alternative: 'Recommended humectant.'
    },
    {
      tokens: ['bisabolol'],
      name: 'Bisabolol',
      hazard: 'safe',
      category: 'Anti-Irritant Botanical Derivative',
      reason: 'Purified active soothing compound from chamomile with proven anti-inflammatory properties.',
      standard: 'Established professional practice',
      alternative: 'Recommended soothing botanical.'
    }
  ];

  var IngredientScanner = {
    init: function() {
      this.bindEvents();
      var self = this;
      window.addEventListener('languageChanged', function() {
        self.reScanIfActive();
      });
    },

    bindEvents: function() {
      var self = this;

      var scanBtn = document.getElementById('ingredientScanBtn');
      if (scanBtn) {
        scanBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.scan();
        });
      }

      var resetBtn = document.getElementById('ingredientResetBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.reset();
        });
      }

      // Presets
      var presetBtns = document.querySelectorAll('.ingredient-preset-btn');
      presetBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var input = document.getElementById('ingredientInputText');
          if (!input) return;
          var preset = btn.getAttribute('data-preset');
          input.value = self.getPresetText(preset);
          self.scan();
        });
      });
    },

    getPresetText: function(preset) {
      switch (preset) {
        case 'saline':
          return 'Purified Water (Aqua), USP Grade Sodium Chloride (0.9%)';
        case 'lotion':
          return 'Aqua, Mineral Oil, Petrolatum, Cetearyl Alcohol, Fragrance (Parfum), Isopropyl Alcohol, Methylisothiazolinone';
        case 'ointment':
          return 'White Petrolatum (93.5%), Lanolin (Wool Fat), Mineral Oil, Fragrance';
        case 'teatree':
          return 'Aqua, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Alcohol Denat, Polysorbate 20, Limonene, Linalool';
        case 'cleanser':
          return 'Aqua, Glycerin, Panthenol (Provitamin B5), Sodium Cocoyl Glycinate, Allantoin, Bisabolol';
        default:
          return '';
      }
    },

    parseIngredients: function(text) {
      if (!text || typeof text !== 'string') return [];
      // Clean and split by commas, semicolons, bullets, or newlines
      var rawList = text.split(/[,;\n\r•]+/).map(function(s) {
        return s.trim();
      }).filter(function(s) {
        return s.length > 1;
      });

      var parsed = [];
      rawList.forEach(function(item) {
        // Strip percentages or parenthetical notes for matching
        var normalized = item.toLowerCase()
          .replace(/\b\d+(\.\d+)?%\b/g, '')
          .replace(/[()]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        parsed.push({
          original: item,
          normalized: normalized
        });
      });

      return parsed;
    },

    scan: function() {
      var input = document.getElementById('ingredientInputText');
      if (!input) return;
      var text = input.value.trim();

      var resultsCard = document.getElementById('ingredientResultsCard');
      if (!resultsCard) return;

      if (!text) {
        resultsCard.style.display = 'none';
        return;
      }

      var items = this.parseIngredients(text);
      if (items.length === 0) {
        resultsCard.style.display = 'none';
        return;
      }

      var matchedIrritants = [];
      var matchedSafe = [];
      var unmatched = [];

      items.forEach(function(item) {
        var found = false;
        for (var i = 0; i < IRRITANT_DATABASE.length; i++) {
          var rule = IRRITANT_DATABASE[i];
          for (var j = 0; j < rule.tokens.length; j++) {
            var tok = rule.tokens[j];
            if (item.normalized.includes(tok) || tok.includes(item.normalized)) {
              if (rule.hazard === 'high' || rule.hazard === 'moderate') {
                matchedIrritants.push({
                  input: item.original,
                  rule: rule
                });
              } else if (rule.hazard === 'safe') {
                matchedSafe.push({
                  input: item.original,
                  rule: rule
                });
              }
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (!found) {
          unmatched.push(item.original);
        }
      });

      var highCount = matchedIrritants.filter(function(m) { return m.rule.hazard === 'high'; }).length;
      var modCount = matchedIrritants.filter(function(m) { return m.rule.hazard === 'moderate'; }).length;

      var overallStatus = 'safe';
      var badgeText = t('healing.scanner.statusSafe', '🟢 NO LISTED IRRITANTS FOUND');
      var summaryMsg = t('healing.scanner.summarySafe', 'None of the ingredients matched the irritants this scanner checks for. That is not a guarantee of safety: if in doubt, ask your piercer, artist or a pharmacist.');

      if (highCount > 0) {
        overallStatus = 'high';
        badgeText = t('healing.scanner.statusHigh', '🔴 HIGH HAZARD / CONTRAINDICATED');
        summaryMsg = t('healing.scanner.summaryHigh', 'Contains {count} high-risk irritant(s) or cytotoxics known to delay wound closure, trigger allergic contact dermatitis, or damage healing tissue.', { count: highCount });
      } else if (modCount > 0) {
        overallStatus = 'moderate';
        badgeText = t('healing.scanner.statusModerate', '🟡 CAUTION / POTENTIAL IRRITANT');
        summaryMsg = t('healing.scanner.summaryModerate', 'Contains {count} moderate sensitizer(s) or comedogenic lipids. Use with caution or perform a 24-hour patch test before applying to active punctures.', { count: modCount });
      }

      this.renderResults(overallStatus, badgeText, summaryMsg, matchedIrritants, matchedSafe, unmatched);
    },

    renderResults: function(status, badgeText, summaryMsg, matchedIrritants, matchedSafe, unmatched) {
      var card = document.getElementById('ingredientResultsCard');
      var badgeEl = document.getElementById('ingredientOverallBadge');
      var summaryEl = document.getElementById('ingredientOverallSummary');
      var irritantsListEl = document.getElementById('ingredientIrritantsList');
      var safeListEl = document.getElementById('ingredientSafeList');

      if (!card) return;

      card.style.display = 'block';
      card.className = 'ingredient-results-card ingredient-results-card--' + status;

      if (badgeEl) {
        badgeEl.textContent = badgeText;
        badgeEl.className = 'ingredient-overall-badge ingredient-overall-badge--' + status;
      }

      if (summaryEl) {
        summaryEl.textContent = summaryMsg;
      }

      // Render irritants breakdown
      if (irritantsListEl) {
        irritantsListEl.innerHTML = '';
        if (matchedIrritants.length === 0) {
          irritantsListEl.innerHTML = '<div class="ingredient-clean-notice">' + t('healing.scanner.zeroIrritants', '✓ Zero known irritants, alcohols, or cytotoxics detected in this formula.') + '</div>';
        } else {
          matchedIrritants.forEach(function(m) {
            var itemEl = document.createElement('div');
            itemEl.className = 'ingredient-matched-item ingredient-matched-item--' + m.rule.hazard;

            var hazardBadge = m.rule.hazard === 'high'
              ? '<span class="ingredient-hazard-tag ingredient-hazard-tag--high">' + t('healing.scanner.tagHigh', 'HIGH RISK') + '</span>'
              : '<span class="ingredient-hazard-tag ingredient-hazard-tag--mod">' + t('healing.scanner.tagMod', 'CAUTION') + '</span>';

            itemEl.innerHTML = 
              '<div class="ingredient-matched-header">' +
                '<strong>' + m.rule.name + '</strong> ' + hazardBadge +
                '<span class="ingredient-matched-original">(' + m.input + ')</span>' +
              '</div>' +
              '<div class="ingredient-matched-reason">' +
                '<span class="ingredient-matched-label">' + t('healing.scanner.mechanism', 'Mechanism') + ':</span> ' + m.rule.reason +
              '</div>' +
              '<div class="ingredient-matched-alt">' +
                '<span class="ingredient-matched-label">' + t('healing.scanner.alternative', 'Recommended Alternative') + ':</span> ' + m.rule.alternative +
              '</div>' +
              '<div class="ingredient-matched-standard">' +
                '<span class="ingredient-matched-label">' + t('healing.scanner.citation', 'Reference Standard') + ':</span> ' + m.rule.standard +
              '</div>';

            irritantsListEl.appendChild(itemEl);
          });
        }
      }

      // Render beneficial / safe ingredients
      if (safeListEl) {
        safeListEl.innerHTML = '';
        if (matchedSafe.length > 0) {
          safeListEl.style.display = 'block';
          var safeTitle = document.createElement('h5');
          safeTitle.className = 'ingredient-safe-title';
          safeTitle.textContent = t('healing.scanner.beneficialTitle', '✓ Beneficial & Compatible Ingredients Detected:');
          safeListEl.appendChild(safeTitle);

          var chipsContainer = document.createElement('div');
          chipsContainer.className = 'ingredient-safe-chips';
          matchedSafe.forEach(function(s) {
            var chip = document.createElement('span');
            chip.className = 'ingredient-safe-chip';
            chip.textContent = '✓ ' + s.rule.name;
            chip.title = s.rule.reason;
            chipsContainer.appendChild(chip);
          });
          safeListEl.appendChild(chipsContainer);
        } else {
          safeListEl.style.display = 'none';
        }
      }
    },

    reScanIfActive: function() {
      var card = document.getElementById('ingredientResultsCard');
      if (card && card.style.display !== 'none') {
        this.scan();
      }
    },

    reset: function() {
      var input = document.getElementById('ingredientInputText');
      if (input) input.value = '';
      var card = document.getElementById('ingredientResultsCard');
      if (card) card.style.display = 'none';
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      IngredientScanner.init();
    });
  } else {
    IngredientScanner.init();
  }

  window.IngredientScanner = IngredientScanner;
})();
