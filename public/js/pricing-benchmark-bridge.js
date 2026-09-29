/**
 * Studio Pricing Benchmark -> Studio Settings bridge.
 *
 * WHAT IT DOES
 * Adds "Save my numbers to Studio Settings" to the benchmark's CRM modal. The
 * owner settles their hourly rate, minimums and deposit in the benchmark; this
 * writes those figures into the one store every quoting tool reads
 * (window.StudioSettings, localStorage `poli_studio_profile`).
 *
 * WHY IT LIVES HERE AND NOT IN THE TOOL
 * The CRM serves the tool from its own origin, so the host page can read what
 * the tool saved (`poli_benchmark_studio_rates_v1`) and the region picked inside
 * the frame. The tool copy therefore stays byte-identical to the website build,
 * and the website version never gains a button that saves somewhere.
 *
 * RULES
 * - Only what the owner typed. A blank field is left out, so it never
 *   overwrites a saved setting with nothing, and nothing is ever defaulted.
 * - A 0% deposit is a real answer and is saved as 0.
 * - Never converts currency. If the benchmark region's currency differs from
 *   the studio's, the owner is told the numbers are saved as entered. The
 *   studio currency is only set from the region while settings are still the
 *   untouched sample.
 * - Nothing is written until the owner confirms the summary of changes.
 *
 * The pure part, buildPatch(), is exported for
 * scripts/studio-crm-integration/check-pricing-bridge.js.
 */
(function (root) {
  'use strict';

  var RATES_KEY = 'poli_benchmark_studio_rates_v1';
  var REGION_CURRENCY = {
    uk: 'GBP', london: 'GBP', us: 'USD', eu: 'EUR', au: 'AUD',
    cee: 'EUR', ca: 'CAD', sa: 'BRL', sea: 'THB'
  };

  // A figure the owner typed, or null. Parsed exactly as the tool's own
  // sanitizePriceInput keeps it (digits and a point), so "1,200" is 1200.
  function num(v) {
    if (v === null || v === undefined) return null;
    var s = String(v).replace(/[^0-9.]/g, '');
    if (s === '' || s === '.') return null;
    var n = Number(s);
    return isFinite(n) && n >= 0 ? n : null;
  }

  /**
   * rates    : the benchmark's saved object { hourlyRate, minimumCharge, shopMinimum, depositPercent, tier }
   * regionId : the region selected in the tool, or null if unknown
   * settings : StudioSettings.get()
   * supported: StudioSettings.currencies (code -> [symbol, locale])
   * Returns { patch, changes: [{label, from, to}], currencyNote, empty }
   */
  function buildPatch(rates, regionId, settings, supported) {
    rates = rates || {};
    var patch = {};
    var changes = [];
    var cur = settings.currency || {};
    var regionCode = regionId ? REGION_CURRENCY[regionId] : null;
    // The currency the saved figures will be shown in, so "£130" is never
    // displayed as "$130" in the confirmation.
    var adopt = !!(regionCode && regionCode !== cur.code && settings.sample && supported && supported[regionCode]);
    var toSymbol = adopt ? supported[regionCode][0] : (cur.symbol || '');

    function set(section, key, label, value, fmtFrom, fmtTo) {
      if (value === null) return;
      var before = settings[section] ? settings[section][key] : undefined;
      patch[section] = patch[section] || {};
      patch[section][key] = value;
      // A money figure also "changes" when its currency does; a percentage does not.
      if (before !== value || (adopt && fmtTo !== pct)) changes.push({ label: label, from: fmtFrom(before), to: fmtTo(value) });
    }
    var money = function (sym) { return function (v) { return v === undefined || v === null ? '—' : sym + v; }; };
    var pct = function (v) { return v === undefined || v === null ? '—' : v + '%'; };

    var fromMoney = money(cur.symbol || ''), toMoney = money(toSymbol);
    set('pricing', 'hourlyRate', 'Hourly rate', num(rates.hourlyRate), fromMoney, toMoney);
    set('pricing', 'minimumCharge', 'Minimum charge', num(rates.minimumCharge), fromMoney, toMoney);
    set('pricing', 'shopMinimum', 'Shop minimum', num(rates.shopMinimum), fromMoney, toMoney);

    var dep = num(rates.depositPercent);
    if (dep !== null) {
      dep = Math.min(100, dep);
      set('deposit', 'percent', 'Deposit', dep, pct, pct);
      if (settings.deposit && settings.deposit.mode !== 'percent') {
        patch.deposit.mode = 'percent';
        changes.push({ label: 'Deposit type', from: 'fixed amount', to: 'percentage' });
      }
    }

    var currencyNote = null;
    if (regionCode && regionCode !== cur.code) {
      if (adopt && changes.length) {
        patch.currency = { code: regionCode, symbol: supported[regionCode][0], locale: supported[regionCode][1] };
        changes.push({ label: 'Currency', from: cur.code || '—', to: regionCode });
      } else {
        currencyNote = 'The benchmark region prices in ' + regionCode + ' but your studio settings use ' +
          (cur.code || 'another currency') + '. The numbers are saved exactly as entered, not converted.';
      }
    }

    return { patch: patch, changes: changes, currencyNote: currencyNote, empty: changes.length === 0 };
  }

  root.PricingBenchmarkBridge = { buildPatch: buildPatch, REGION_CURRENCY: REGION_CURRENCY };
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;

  /* ------------------------------------------------------------------ UI --- */

  var BAR_BTN = 'poli-pricingbench-save-settings';
  var PANEL = 'poli-pricingbench-save-panel';

  function readRates() {
    try { return JSON.parse(localStorage.getItem(RATES_KEY) || 'null'); } catch (e) { return null; }
  }

  function readRegion() {
    try {
      var frame = document.getElementById('poli-pricingbench-frame');
      var sel = frame && frame.contentDocument && frame.contentDocument.getElementById('region-select');
      return sel ? sel.value : null;
    } catch (e) { return null; }
  }

  function el(tag, css, text) {
    var n = document.createElement(tag);
    if (css) n.style.cssText = css;
    if (text) n.textContent = text;
    return n;
  }

  function closePanel() {
    var p = document.getElementById(PANEL);
    if (p) p.remove();
  }

  function showPanel() {
    closePanel();
    var S = root.StudioSettings;
    var modal = document.getElementById('poli-pricingbench-modal');
    if (!S || !modal) return;

    var result = buildPatch(readRates(), readRegion(), S.get(), S.currencies);
    var panel = el('div', 'position:absolute;top:3.2rem;right:1rem;z-index:5;width:min(380px,90vw);' +
      'background:#111827;border:1px solid #374151;border-radius:10px;padding:1rem;color:#e5e7eb;' +
      'font-size:0.85rem;box-shadow:0 10px 30px rgba(0,0,0,0.5);');
    panel.id = PANEL;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Save to Studio Settings');

    panel.appendChild(el('strong', 'display:block;font-size:0.95rem;margin-bottom:0.5rem;color:#fff;', 'Save to Studio Settings'));

    if (result.empty) {
      panel.appendChild(el('p', 'margin:0 0 0.75rem;color:#9ca3af;',
        'Nothing to save yet. Enter your hourly rate, minimums or deposit in "Your Rates" first, or they already match your settings.'));
    } else {
      panel.appendChild(el('p', 'margin:0 0 0.5rem;color:#9ca3af;', 'These studio settings will change:'));
      var table = el('table', 'width:100%;border-collapse:collapse;margin-bottom:0.6rem;');
      result.changes.forEach(function (c) {
        var tr = el('tr', 'border-top:1px solid #1f2937;');
        tr.appendChild(el('td', 'padding:0.3rem 0;color:#d1d5db;', c.label));
        tr.appendChild(el('td', 'padding:0.3rem 0;text-align:right;color:#6b7280;text-decoration:line-through;', String(c.from)));
        tr.appendChild(el('td', 'padding:0.3rem 0 0.3rem 0.6rem;text-align:right;color:#34d399;font-weight:700;', String(c.to)));
        table.appendChild(tr);
      });
      panel.appendChild(table);
      panel.appendChild(el('p', 'margin:0 0 0.6rem;color:#9ca3af;font-size:0.8rem;',
        'Your decision, saved to your studio database on this machine. Quotes and deposits in the CRM will use these figures.'));
    }
    if (result.currencyNote) {
      panel.appendChild(el('p', 'margin:0 0 0.6rem;padding:0.5rem;border-radius:6px;background:#422006;color:#fbbf24;font-size:0.8rem;', result.currencyNote));
    }

    var row = el('div', 'display:flex;gap:0.5rem;justify-content:flex-end;');
    var cancel = el('button', 'padding:0.4rem 0.8rem;background:#1f2937;color:#e5e7eb;border:1px solid #374151;border-radius:6px;cursor:pointer;', 'Cancel');
    cancel.type = 'button';
    cancel.addEventListener('click', closePanel);
    row.appendChild(cancel);

    if (!result.empty) {
      var confirm = el('button', 'padding:0.4rem 0.8rem;background:#059669;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;', 'Save to settings');
      confirm.type = 'button';
      confirm.addEventListener('click', function () {
        var r = S.save(result.patch);
        var status = document.getElementById('poli-pricingbench-status');
        if (r && r.ok) {
          document.dispatchEvent(new CustomEvent('studio-settings-changed', { detail: r.settings }));
          if (status) { status.style.color = '#34d399'; status.textContent = 'Saved to Studio Settings'; }
        } else if (status) {
          status.style.color = '#f87171';
          status.textContent = 'Could not save: ' + ((r && r.error) || 'storage unavailable');
        }
        closePanel();
      });
      row.appendChild(confirm);
    }
    panel.appendChild(row);
    modal.firstChild.appendChild(panel);
  }

  // The modal is built lazily by the integration script. Add the button to its
  // bar whenever the bar exists, without touching that script.
  function addButton() {
    var status = document.getElementById('poli-pricingbench-status');
    if (!status || document.getElementById(BAR_BTN)) return;
    var btn = el('button', 'padding:0.4rem 0.9rem;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.85rem;',
      'Save my numbers to Studio Settings');
    btn.id = BAR_BTN;
    btn.type = 'button';
    btn.addEventListener('click', showPanel);
    // After the status text, before Close (which keeps margin-left:auto).
    status.parentNode.insertBefore(btn, status.nextSibling);
  }

  function start() {
    addButton();
    new MutationObserver(addButton).observe(document.body, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(typeof window !== 'undefined' ? window : globalThis);
