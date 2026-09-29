/**
 * Product Allergy & Sensitivity Screener
 * Helps users identify potential allergic contact dermatitis and adverse reactions
 * to aftercare lotions, ointments, cleansers, and barrier films before application.
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

  var AllergyScreener = {
    init: function() {
      var self = this;
      var assessBtn = document.getElementById('allergyAssessBtn');
      var resetBtn = document.getElementById('allergyResetBtn');
      var productSelect = document.getElementById('allergyProductType');

      if (assessBtn) {
        assessBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.assess();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.reset();
        });
      }

      if (productSelect) {
        productSelect.addEventListener('change', function() {
          self.updateProductGuidance();
        });
      }

      window.addEventListener('languageChanged', function() {
        self.updateProductGuidance();
        var resultsCard = document.getElementById('allergyResultsCard');
        if (resultsCard && resultsCard.style.display !== 'none') {
          self.assess();
        }
      });

      this.updateProductGuidance();
    },

    updateProductGuidance: function() {
      var select = document.getElementById('allergyProductType');
      var guidanceEl = document.getElementById('allergyProductGuidance');
      if (!select || !guidanceEl) return;

      var type = select.value;
      var guidanceText = '';

      switch (type) {
        case 'balm':
          guidanceText = t('healing.allergyScreener.guidanceBalm', 'Ointments & balms: Avoid thick petroleum jellies that suffocate puncture wounds. Look for breathable, non-comedogenic botanical bases free of synthetic fragrance.');
          break;
        case 'cleanser':
          guidanceText = t('healing.allergyScreener.guidanceCleanser', 'Piercing cleansers: Sterile 0.9% saline (isotonic sodium chloride) is the international gold standard. Avoid alcohol, chlorhexidine, or hydrogen peroxide.');
          break;
        case 'film':
          guidanceText = t('healing.allergyScreener.guidanceFilm', 'Barrier films: Polyurethane films with medical adhesive. If you react to surgical tape or band-aids, barrier films can cause severe adhesive blistering.');
          break;
        case 'lotion':
          guidanceText = t('healing.allergyScreener.guidanceLotion', 'Daily moisturizers: Choose unscented, dye-free lotions. Avoid lanolin (wool alcohol) if prone to contact allergies.');
          break;
        case 'soap':
          guidanceText = t('healing.allergyScreener.guidanceSoap', 'Antiseptic soaps: Mild, liquid fragrance-free soaps are preferred. Avoid harsh bar soaps and triclosan formulas that strip tissue lipids.');
          break;
        default:
          guidanceText = '';
      }

      guidanceEl.textContent = guidanceText;
      guidanceEl.style.display = guidanceText ? 'block' : 'none';
    },

    assess: function() {
      var productType = (document.getElementById('allergyProductType') || {}).value || 'balm';
      var q1 = document.getElementById('allergyQ1') && document.getElementById('allergyQ1').checked;
      var q2 = document.getElementById('allergyQ2') && document.getElementById('allergyQ2').checked;
      var q3 = document.getElementById('allergyQ3') && document.getElementById('allergyQ3').checked;
      var q4 = document.getElementById('allergyQ4') && document.getElementById('allergyQ4').checked;
      var q5 = document.getElementById('allergyQ5') && document.getElementById('allergyQ5').checked;
      var q6 = document.getElementById('allergyQ6') && document.getElementById('allergyQ6').checked;

      var riskScore = 0;
      var riskFactors = [];

      // Critical contraindications
      if (q1 && (productType === 'balm' || productType === 'lotion')) {
        riskScore += 3;
        riskFactors.push(t('healing.allergyScreener.factorAntibiotics', 'History of reaction to topical antibiotics (Neomycin/Bacitracin sensitizers).'));
      } else if (q1) {
        riskScore += 1;
      }

      if (q2 && productType === 'film') {
        riskScore += 3;
        riskFactors.push(t('healing.allergyScreener.factorAdhesive', 'Medical adhesive allergy with barrier film application poses severe blistering risk.'));
      } else if (q2) {
        riskScore += 1;
      }

      if (q3) {
        riskScore += 2;
        riskFactors.push(t('healing.allergyScreener.factorFragrance', 'Sensitivity to synthetic perfumes or botanical essential oils (e.g., tea tree oil contact dermatitis).'));
      }

      if (q4 && (productType === 'balm' || productType === 'lotion')) {
        riskScore += 2;
        riskFactors.push(t('healing.allergyScreener.factorLanolin', 'Lanolin or latex hypersensitivity. Avoid wool alcohol emollient products.'));
      } else if (q4) {
        riskScore += 1;
      }

      if (q5) {
        riskScore += 2;
        riskFactors.push(t('healing.allergyScreener.factorIrritants', 'Product contains drying alcohol, hydrogen peroxide, or harsh chemical astringents.'));
      }

      if (q6) {
        riskScore += 1;
        riskFactors.push(t('healing.allergyScreener.factorBarrier', 'Pre-existing localized eczema or compromised skin barrier near the procedure site.'));
      }

      var resultsCard = document.getElementById('allergyResultsCard');
      var badgeEl = document.getElementById('allergyRiskBadge');
      var descEl = document.getElementById('allergyRiskDesc');
      var factorsListEl = document.getElementById('allergyFactorsList');
      var patchTestContainer = document.getElementById('allergyPatchTestBox');

      if (!resultsCard) return;

      var riskLevel = 'low';
      if (riskScore >= 3) {
        riskLevel = 'high';
      } else if (riskScore >= 1) {
        riskLevel = 'moderate';
      }

      resultsCard.className = 'allergy-results-card allergy-results-card--' + riskLevel;
      resultsCard.style.display = 'block';

      if (badgeEl) {
        if (riskLevel === 'high') {
          badgeEl.textContent = t('healing.allergyScreener.riskHigh', 'High Allergenic / Dermatitis Risk');
          badgeEl.className = 'allergy-badge allergy-badge--high';
        } else if (riskLevel === 'moderate') {
          badgeEl.textContent = t('healing.allergyScreener.riskModerate', 'Moderate Caution Advised');
          badgeEl.className = 'allergy-badge allergy-badge--moderate';
        } else {
          badgeEl.textContent = t('healing.allergyScreener.riskLow', 'Low Sensitivity Risk');
          badgeEl.className = 'allergy-badge allergy-badge--low';
        }
      }

      if (descEl) {
        if (riskLevel === 'high') {
          descEl.textContent = t('healing.allergyScreener.highDesc', 'High risk of allergic contact dermatitis. Known allergens or contraindicated irritants detected. We recommend substituting with a hypoallergenic alternative.');
        } else if (riskLevel === 'moderate') {
          descEl.textContent = t('healing.allergyScreener.moderateDesc', 'Potential mild sensitizers identified. Perform an intact-skin patch test for 24-48 hours before applying to healing wound.');
        } else {
          descEl.textContent = t('healing.allergyScreener.lowDesc', 'Product ingredients and your profile show favorable tolerance. Follow standard application amounts without over-saturating.');
        }
      }

      if (factorsListEl) {
        factorsListEl.innerHTML = '';
        if (riskFactors.length > 0) {
          riskFactors.forEach(function(factor) {
            var li = document.createElement('li');
            li.textContent = factor;
            factorsListEl.appendChild(li);
          });
          factorsListEl.style.display = 'block';
        } else {
          factorsListEl.style.display = 'none';
        }
      }

      if (patchTestContainer) {
        patchTestContainer.style.display = (riskLevel === 'moderate' || riskLevel === 'high') ? 'block' : 'none';
      }

      // Smooth scroll to results if on mobile
      try {
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}

      // Save state in window for health report integration
      window.LAST_ALLERGY_ASSESSMENT = {
        productType: productType,
        riskLevel: riskLevel,
        riskScore: riskScore,
        factorsCount: riskFactors.length,
        timestamp: new Date().toISOString()
      };
    },

    reset: function() {
      ['allergyQ1', 'allergyQ2', 'allergyQ3', 'allergyQ4', 'allergyQ5', 'allergyQ6'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.checked = false;
      });

      var productSelect = document.getElementById('allergyProductType');
      if (productSelect) productSelect.selectedIndex = 0;

      var resultsCard = document.getElementById('allergyResultsCard');
      if (resultsCard) resultsCard.style.display = 'none';

      this.updateProductGuidance();
      window.LAST_ALLERGY_ASSESSMENT = null;
    }
  };

  window.AllergyScreener = AllergyScreener;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      AllergyScreener.init();
    });
  } else {
    AllergyScreener.init();
  }
})();
