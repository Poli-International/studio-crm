/**
 * Studio settings: one store, read by every tool that quotes or invoices.
 *
 * WHY THIS FILE EXISTS
 * The settings modal already had fields, five empty pricing grids waiting to be
 * populated, and four save buttons. What it did not have was persistence. Every
 * one of those handlers was theatre:
 *
 *   handleSaveVatSettings()          toast "saved successfully", saved nothing
 *   saveStudioPricesFromSettings()   toast "pricing schedule updated", same
 *   resetStudioPricesToRecommended() a blocking alert() about benchmarks it
 *                                    did not have
 *   handleStudioLogoUpload()         toast "logo updated", no logo stored
 *
 * The owner set a VAT rate, was told it saved, and it was gone on reload. This
 * defines the schema, fills the grids the markup is already asking for, and
 * makes save actually save.
 *
 * THE STORE
 * localStorage key `poli_studio_profile`, which the form builder already reads
 * for studioName, studioPhone, studioEmail, studioAddress and artistName. This
 * MERGES into that object rather than replacing it, so identity fields written
 * by anything else survive.
 *
 * WHAT IS STORED, AND WHAT IS NOT
 * Only what the owner typed. Never a derived figure. Store deposit.percent: 20,
 * never depositAmount: 60 - the moment a price changes a cached amount is
 * wrong, and nothing reports it.
 *
 * THE DEFAULTS ARE A SAMPLE, AND SAY SO
 * The online preview needs numbers so the tools show something working, but a
 * preview that silently shows an hourly rate reads as advice about what to
 * charge. Everything below is marked sample: true until the owner saves, and
 * the form shows a banner saying exactly that.
 *
 * READING IT FROM ANOTHER TOOL
 *   var s = window.StudioSettings.get();     // defaults merged with saved
 *   s.pricing.hourlyRate                     // number
 *   window.StudioSettings.format(240)        // "$240.00" in the studio currency
 *   window.StudioSettings.isConfigured()     // false while still sample
 *   document.addEventListener('studio-settings-changed', fn)
 */
(function () {
  'use strict';

  var STORE = 'poli_studio_profile';
  var LEGACY = ['studio_settings', 'studio_profile'];

  /* ------------------------------------------------------------ schema --- */

  var DEFAULTS = {
    // Flipped to false the first time the owner saves. Every figure below is
    // illustrative until then, not a recommendation.
    sample: true,

    currency: { code: 'USD', symbol: '$', locale: 'en-US' },

    pricing: {
      hourlyRate: 150,          // the studio's standard chair rate
      minimumCharge: 80,        // the floor for any booking
      shopMinimum: 60,          // the floor for the smallest piece of work
      halfDayRate: 0,           // 0 means "not offered", never "free"
      fullDayRate: 0
    },

    deposit: {
      mode: 'percent',          // 'percent' or 'fixed'
      percent: 20,
      fixed: 50,
      deductedFromBalance: true,
      refundableDays: 0         // 0 = non-refundable
    },

    tax: {
      enabled: false,
      ratePercent: 20,
      registrationNumber: '',
      pricesIncludeTax: false   // whether displayed prices already contain it
    },

    touchUp: {
      freeWindowDays: 30,       // free inside this window
      ratePercentOfHourly: 50   // charged at this share of the rate after it
    },

    inventory: {
      reorderThreshold: 10,     // global default; per-category overrides elsewhere
      categoryThresholds: {}
    },

    // A studio with a resident and an apprentice does not charge one rate.
    artists: [],                // [{ name, hourlyRate }]

    // The five grids the settings markup already asks JS to populate.
    piercingSiteFees: {
      earlobe: 30, helix: 40, daith: 45, rook: 45, tragus: 45, conch: 50,
      industrial: 60, septum: 50, nostril: 40, eyebrow: 40, labret: 40,
      tongue: 50, navel: 45, nipple: 60, surface: 70, dermal: 70
    },
    tattooBaseFees: {
      tiny: 80, small: 150, medium: 350, large: 700, halfSleeve: 1200, fullSleeve: 2400
    },
    styleMultipliers: {
      lineWork: 1.0, blackAndGrey: 1.1, colour: 1.25, realism: 1.4,
      watercolour: 1.3, geometric: 1.2, traditional: 1.0
    },
    materialFees: {
      titanium: 0, steel: 0, bioflex: 0, gold14k: 120, gold18k: 220
    },
    attachmentFees: {
      plainBall: 0, gem: 15, opal: 25, cluster: 40, custom: 60
    }
  };

  // Symbol and locale follow the code, so the owner picks one thing.
  var CURRENCIES = {
    USD: ['$', 'en-US'], EUR: ['€', 'fr-FR'], GBP: ['£', 'en-GB'],
    CAD: ['$', 'en-CA'], AUD: ['$', 'en-AU'], THB: ['฿', 'th-TH'],
    CHF: ['CHF', 'de-CH'], SEK: ['kr', 'sv-SE'], NZD: ['$', 'en-NZ'],
    JPY: ['¥', 'ja-JP']
  };

  /* ------------------------------------------------------- persistence --- */

  function readRaw() {
    var keys = [STORE].concat(LEGACY);
    for (var i = 0; i < keys.length; i++) {
      try {
        var raw = localStorage.getItem(keys[i]);
        if (raw) return JSON.parse(raw);
      } catch (e) { /* corrupt, or storage unavailable: fall through */ }
    }
    return {};
  }

  // Deep merge, so a saved partial does not wipe a whole section and a field
  // added in a later version appears with its default rather than undefined.
  function merge(base, over) {
    var out = {};
    Object.keys(base).forEach(function (k) {
      var b = base[k], o = over ? over[k] : undefined;
      if (b && typeof b === 'object' && !Array.isArray(b)) {
        out[k] = merge(b, (o && typeof o === 'object') ? o : {});
      } else {
        out[k] = (o === undefined || o === null || o === '') ? b : o;
      }
    });
    if (over) Object.keys(over).forEach(function (k) { if (!(k in out)) out[k] = over[k]; });
    return out;
  }

  function get() { return merge(DEFAULTS, readRaw()); }

  function save(patch) {
    var next = merge(merge(DEFAULTS, readRaw()), patch);
    next.sample = false;                       // the owner has now set these
    next.savedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
      return { ok: true, settings: next };
    } catch (e) {
      // Quota, private mode, or storage disabled. Report it rather than
      // claiming success, which is the whole bug this file replaces.
      return { ok: false, error: (e && e.name) ? e.name : 'unknown' };
    }
  }

  function isConfigured() { return get().sample === false; }

  // Every tool that prints a price should use this instead of a hardcoded '$'.
  function format(amount) {
    var c = get().currency;
    try {
      return new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.code }).format(amount);
    } catch (e) {
      return c.symbol + Number(amount).toFixed(2);
    }
  }

  /* --------------------------------------------------------- the grids --- */

  var GRIDS = [
    ['settings-site-pricing-grid', 'piercingSiteFees'],
    ['settings-tattoo-pricing-grid', 'tattooBaseFees'],
    ['settings-style-pricing-grid', 'styleMultipliers'],
    ['settings-material-pricing-grid', 'materialFees'],
    ['settings-attachment-pricing-grid', 'attachmentFees']
  ];

  var LABEL_OVERRIDES = {
    gold14k: '14k Gold', gold18k: '18k Gold', bioflex: 'BioFlex',
    blackAndGrey: 'Black & Grey', lineWork: 'Line Work',
    halfSleeve: 'Half Sleeve', fullSleeve: 'Full Sleeve', plainBall: 'Plain Ball'
  };

  function label(key) {
    if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); });
  }

  function fillGrids(settings) {
    GRIDS.forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (!el) return;
      var section = settings[pair[1]] || {};
      var isMultiplier = pair[1] === 'styleMultipliers';
      el.innerHTML = '';
      Object.keys(section).forEach(function (key) {
        var wrap = document.createElement('label');
        wrap.style.cssText = 'display:flex;flex-direction:column;gap:3px;font-size:0.72rem;color:#9CA3AF;';
        var span = document.createElement('span');
        span.textContent = label(key);
        var input = document.createElement('input');
        input.type = 'number';
        input.step = isMultiplier ? '0.05' : '1';
        input.min = '0';
        input.value = section[key];
        input.dataset.settingsGroup = pair[1];
        input.dataset.settingsKey = key;
        input.style.cssText = 'padding:6px 8px;background:#0F172A;border:1px solid #374151;' +
          'border-radius:6px;color:#F9FAFB;font-size:0.85rem;width:100%;box-sizing:border-box;';
        wrap.appendChild(span);
        wrap.appendChild(input);
        el.appendChild(wrap);
      });
    });
  }

  /* -------------------------------------------------- form load and save -- */

  // id in the markup -> where it lives in the schema.
  var FIELD_MAP = [
    ['settings-currency-code', 'currency.code', 'text'],
    ['settings-hourly-rate', 'pricing.hourlyRate', 'number'],
    ['settings-minimum-charge', 'pricing.minimumCharge', 'number'],
    ['settings-shop-minimum', 'pricing.shopMinimum', 'number'],
    ['settings-half-day-rate', 'pricing.halfDayRate', 'number'],
    ['settings-full-day-rate', 'pricing.fullDayRate', 'number'],
    ['settings-deposit-mode', 'deposit.mode', 'text'],
    ['settings-deposit-percent', 'deposit.percent', 'number'],
    ['settings-deposit-fixed', 'deposit.fixed', 'number'],
    ['settings-deposit-deducted', 'deposit.deductedFromBalance', 'checkbox'],
    ['settings-touchup-free-days', 'touchUp.freeWindowDays', 'number'],
    ['settings-touchup-rate-percent', 'touchUp.ratePercentOfHourly', 'number'],
    ['vat-setting-enabled', 'tax.enabled', 'checkbox'],
    ['vat-setting-rate', 'tax.ratePercent', 'number'],
    ['vat-setting-number', 'tax.registrationNumber', 'text'],
    ['vat-setting-inclusive', 'tax.pricesIncludeTax', 'checkbox'],
    ['settings-global-reorder-threshold', 'inventory.reorderThreshold', 'number']
  ];

  function at(obj, path) {
    return path.split('.').reduce(function (c, k) {
      return (c && typeof c === 'object') ? c[k] : undefined;
    }, obj);
  }

  function put(obj, path, value) {
    var keys = path.split('.'), c = obj;
    for (var i = 0; i < keys.length - 1; i++) {
      if (!c[keys[i]] || typeof c[keys[i]] !== 'object') c[keys[i]] = {};
      c = c[keys[i]];
    }
    c[keys[keys.length - 1]] = value;
  }

  function loadIntoForm() {
    var s = get();
    FIELD_MAP.forEach(function (f) {
      var el = document.getElementById(f[0]);
      if (!el) return;
      var v = at(s, f[1]);
      if (v === undefined) return;
      if (f[2] === 'checkbox') el.checked = !!v; else el.value = v;
    });
    fillGrids(s);
    showSampleBanner(s.sample);
    syncDepositMode();
  }

  function collectFromForm() {
    var patch = {};
    FIELD_MAP.forEach(function (f) {
      var el = document.getElementById(f[0]);
      if (!el) return;
      var v;
      if (f[2] === 'checkbox') v = el.checked;
      else if (f[2] === 'number') v = parseFloat(el.value) || 0;
      else v = el.value;
      put(patch, f[1], v);
    });
    // The grids live outside the <form>, so collect them by attribute.
    document.querySelectorAll('[data-settings-group][data-settings-key]').forEach(function (el) {
      var g = el.dataset.settingsGroup;
      if (!patch[g]) patch[g] = {};
      patch[g][el.dataset.settingsKey] = parseFloat(el.value) || 0;
    });
    var code = patch.currency && patch.currency.code;
    if (code && CURRENCIES[code]) {
      patch.currency.symbol = CURRENCIES[code][0];
      patch.currency.locale = CURRENCIES[code][1];
    }
    return patch;
  }

  // Showing a percentage and a fixed deposit at once invites setting one and
  // expecting the other to apply.
  function syncDepositMode() {
    var mode = document.getElementById('settings-deposit-mode');
    var pct = document.getElementById('settings-deposit-percent');
    var fix = document.getElementById('settings-deposit-fixed');
    if (!mode || !pct || !fix) return;
    var byPercent = mode.value === 'percent';
    pct.closest('label').style.display = byPercent ? '' : 'none';
    fix.closest('label').style.display = byPercent ? 'none' : '';
  }

  function showSampleBanner(isSample) {
    var overlay = document.getElementById('vat-settings-modal-overlay');
    if (!overlay) return;
    var id = 'studio-settings-sample-banner';
    var existing = document.getElementById(id);
    if (!isSample) { if (existing) existing.remove(); return; }
    if (existing) return;
    var form = overlay.querySelector('form');
    if (!form) return;
    var b = document.createElement('div');
    b.id = id;
    b.style.cssText = 'padding:10px 12px;background:#78350F;border:1px solid #B45309;' +
      'border-radius:8px;color:#FDE68A;font-size:0.8rem;line-height:1.45;';
    b.textContent = 'These are example figures so the tools have something to work with. ' +
      'They are not a recommendation about what to charge. Set your own rates and save, ' +
      'and every quote, invoice and estimate in the CRM will use them.';
    form.insertBefore(b, form.firstChild);
  }

  function toast(message) {
    (window.showToastNotification || function (m) { console.log(m); })(message);
  }

  function persist(successMessage) {
    var result = save(collectFromForm());
    if (result.ok) {
      toast(successMessage);
      showSampleBanner(false);
      document.dispatchEvent(new CustomEvent('studio-settings-changed', { detail: result.settings }));
    } else {
      // Never claim a save that did not happen.
      toast('Could not save: browser storage is unavailable (' + result.error + ').');
    }
    return result.ok;
  }

  /* ------------------------------------------------------- wire it up ----- */

  // These replace the stubs in 08-extended-operations.js. This file loads after
  // it, so these definitions win.

  function handleSaveVatSettings(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (persist('Studio settings saved.') && typeof window.closeVatSettingsModal === 'function') {
      window.closeVatSettingsModal();
    }
    return false;
  }

  // The price matrix sits OUTSIDE the <form> with its own button, and was a
  // stub as well: editing a grid and pressing its own Save saved nothing.
  function saveStudioPricesFromSettings() {
    persist('Studio pricing schedule saved.');
  }

  // Was a bare alert(), which blocks the page, and it claimed to restore
  // benchmarks it did not have. These are the sample figures, and it says so.
  function resetStudioPricesToRecommended() {
    GRIDS.forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (!el) return;
      el.querySelectorAll('[data-settings-key]').forEach(function (input) {
        var d = DEFAULTS[pair[1]][input.dataset.settingsKey];
        if (d !== undefined) input.value = d;
      });
    });
    toast('Grids reset to the sample figures. Nothing is stored until you press Save.');
  }

  var originalOpen = window.openVatSettingsModal;
  window.openVatSettingsModal = function () {
    if (typeof originalOpen === 'function') originalOpen();
    else {
      var el = document.getElementById('vat-settings-modal-overlay');
      if (el) el.style.display = 'flex';
    }
    loadIntoForm();
  };

  window.handleSaveVatSettings = handleSaveVatSettings;
  window.saveStudioPricesFromSettings = saveStudioPricesFromSettings;
  window.resetStudioPricesToRecommended = resetStudioPricesToRecommended;
  window.syncStudioDepositMode = syncDepositMode;

  window.StudioSettings = {
    get: get,
    save: save,
    format: format,
    isConfigured: isConfigured,
    defaults: DEFAULTS,
    currencies: CURRENCIES,
    STORE: STORE
  };

  function boot() { fillGrids(get()); syncDepositMode(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
