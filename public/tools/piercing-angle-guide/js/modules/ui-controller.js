/**
 * Piercing Angle & Depth Guide - UI Controller Module
 * Standards: ASTM F-136, ASTM F-138, ASTM F-67, BioFlex® body jewelry.
 * Provides specialized view controllers, widget state synchronizers, and toast/notification helpers.
 */

(function (window) {
  'use strict';

  var UIController = {};

  /**
   * Render Recent Piercings quick-switch chips.
   */
  UIController.renderRecentPiercingsChips = function (containerEl, listEl, recents, activeKey, isCompareMode, piercingData, onSelect) {
    if (!containerEl || !listEl) return;

    if (!recents || recents.length === 0) {
      containerEl.hidden = true;
      listEl.innerHTML = '';
      return;
    }

    containerEl.hidden = false;
    listEl.innerHTML = '';

    recents.forEach(function (key) {
      var data = piercingData && piercingData[key];
      if (!data) return;

      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'recent-piercing-chip';
      if (key === activeKey && !isCompareMode) {
        chip.classList.add('active');
      }
      chip.setAttribute('data-piercing-key', key);
      chip.setAttribute('title', `Switch to ${data.name} (${data.category || 'Piercing'})`);
      chip.innerHTML = `<span class="recent-chip-icon">📍</span> <span class="recent-chip-name">${data.name}</span>`;

      chip.addEventListener('click', function () {
        if (typeof onSelect === 'function') {
          onSelect(key);
        }
      });

      listEl.appendChild(chip);
    });
  };

  /**
   * Update Unit Toggle Button labels and accessibility state.
   */
  UIController.updateUnitToggleUI = function (buttonEl, textEl, currentUnit) {
    var isMetric = (currentUnit === 'metric');
    if (textEl) {
      textEl.textContent = isMetric ? 'Metric (mm)' : 'Imperial (in)';
    }
    if (buttonEl) {
      buttonEl.setAttribute('aria-pressed', isMetric ? 'false' : 'true');
      buttonEl.setAttribute('title', isMetric ? 'Switch to Imperial (inches)' : 'Switch to Metric (millimeters)');
    }
  };

  /**
   * Update Baseline Specifications display panel with proper unit formatting.
   */
  UIController.updateBaselineSpecs = function (piercing, els, currentUnit, calculator) {
    if (!piercing || !els) return;
    var calc = calculator || window.PiercingCalculator;

    if (els.optimalAngle) {
      els.optimalAngle.textContent = `${piercing.optimalAngle}°`;
    }
    if (els.angleTolerance) {
      els.angleTolerance.textContent = `±${piercing.angleTolerance}° (${piercing.optimalAngle - piercing.angleTolerance}° - ${piercing.optimalAngle + piercing.angleTolerance}°)`;
    }
    if (els.entryExitDepth && calc) {
      els.entryExitDepth.textContent = calc.formatRangeUnit(
        piercing.minDepth,
        piercing.maxDepth,
        piercing.typicalDepth,
        currentUnit
      );
    }
    if (els.tissueType) {
      els.tissueType.textContent = piercing.tissueType || 'Standard Dermis';
    }
    if (els.healingTime) {
      els.healingTime.textContent = piercing.healingTime || '6-8 weeks';
    }
    if (els.painLevel) {
      els.painLevel.textContent = `${piercing.painLevel || 3} / 10`;
    }
  };

  /**
   * Update interactive Jewelry options pills and detail fields.
   */
  UIController.updateJewelryPills = function (containerEl, options, activeOptId, onSelect) {
    if (!containerEl) return;
    if (!options || options.length === 0) {
      containerEl.innerHTML = '<span class="text-muted">Standard initial jewelry configuration</span>';
      return;
    }

    var html = '';
    options.forEach(function (opt) {
      var isSelected = (opt.id === activeOptId);
      var badge = opt.isInitialStandard
        ? '<span class="jewelry-pill-badge initial">Initial Std</span>'
        : '<span class="jewelry-pill-badge healed">Healed Alt</span>';

      html += `
        <button type="button" class="jewelry-option-pill ${isSelected ? 'active' : ''}" data-jewelry-id="${opt.id}" aria-label="Select ${opt.name}">
          <span class="pill-name">${opt.name}</span>
          ${badge}
        </button>
      `;
    });
    containerEl.innerHTML = html;

    var pills = containerEl.querySelectorAll('.jewelry-option-pill');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var optId = this.getAttribute('data-jewelry-id');
        if (typeof onSelect === 'function') {
          onSelect(optId);
        }
      });
    });
  };

  /**
   * Display momentary notification toast.
   */
  UIController.showToast = function (message, type, duration) {
    var toastContainer = document.getElementById('poliToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'poliToastContainer';
      toastContainer.className = 'poli-toast-container';
      document.body.appendChild(toastContainer);
    }

    var toast = document.createElement('div');
    toast.className = 'poli-toast poli-toast--' + (type || 'info');
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('poli-toast--visible');
    }, 10);

    setTimeout(function () {
      toast.classList.remove('poli-toast--visible');
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration || 2500);
  };

  window.PiercingUIController = UIController;
})(typeof window !== 'undefined' ? window : this);
