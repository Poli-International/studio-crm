/**
 * Poli International - Shared Input Validation Guards
 *
 * Cross-tool validation utilities for all calculator UIs.
 * Drop-in: no dependencies, no globals polluting (all namespaced).
 *
 * Usage:
 *   <script src="/js/input-guards.js"></script>
 *   const v = InputGuards.safeFloat(el, 0);
 *   if (!InputGuards.isValid(v)) { ... }
 *
 * @overview Centralises NaN guarding, range checks, cross-field warnings,
 *           safe division, and inline error/warning rendering.
 * @since   2026-06-23  Hermes T12 - 68-input-validation-spec
 */

'use strict';

var InputGuards = (function () {
  'use strict';

  /* -- HTML escaping (XSS protection) -- */
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* -- Number parsing ----------------------------------------- */
  /**
   * Parse a numeric value safely. Handles European decimal comma,
   * whitespace, and currency symbols.
   *
   * @param {string|number} raw   - value from input.value
   * @param {number}         fallback - returned if NaN (default NaN)
   * @returns {number}
   */
  function safeFloat(raw, fallback) {
    if (raw === null || raw === undefined || raw === '') return arguments.length > 1 ? fallback : NaN;
    var s = String(raw).trim();
    // Strip common currency/unit suffixes
    s = s.replace(/[£€$%\s]|mm$|cm$|in$|ml$|oz$|years?$/gi, '');
    // European decimal comma
    s = s.replace(',', '.');
    var n = parseFloat(s);
    return isNaN(n) ? (arguments.length > 1 ? fallback : NaN) : n;
  }

  /**
   * True when value is a finite number (not NaN, not Infinity).
   * @param {*} v
   * @returns {boolean}
   */
  function isValid(v) {
    return typeof v === 'number' && isFinite(v);
  }

  /* ── Range guards ─────────────────────────────────────────── */
  /**
   * Check whether value is inside [min, max] (inclusive).
   * Returns { ok: boolean, message: string|null }
   */
  function inRange(value, min, max, label) {
    var l = label || (typeof window !== 'undefined' && window.i18n ? window.i18n.t('guard.value_fallback') : 'Value');
    if (!isValid(value)) {
      var msg = typeof window !== 'undefined' && window.i18n
        ? window.i18n.t('guard.value_must_be_number', { label: l })
        : (l + ' must be a valid number.');
      return { ok: false, message: msg };
    }
    if (value < min) {
      var msgMin = typeof window !== 'undefined' && window.i18n
        ? window.i18n.t('guard.value_must_be_at_least', { label: l, min: min })
        : (l + ' must be at least ' + min + '.');
      return { ok: false, message: msgMin };
    }
    if (value > max) {
      var msgMax = typeof window !== 'undefined' && window.i18n
        ? window.i18n.t('guard.value_must_not_exceed', { label: l, max: max })
        : (l + ' must not exceed ' + max + '.');
      return { ok: false, message: msgMax };
    }
    return { ok: true, message: null };
  }

  /**
   * Check that value is strictly positive (> 0).
   */
  function positive(value, label) {
    if (!isValid(value) || value <= 0) {
      var l = label || (typeof window !== 'undefined' && window.i18n ? window.i18n.t('guard.value_fallback_lower') : 'value');
      var msg = typeof window !== 'undefined' && window.i18n
        ? window.i18n.t('guard.enter_greater_than_zero', { label: l })
        : ('Enter a ' + l + ' greater than zero.');
      return { ok: false, message: msg };
    }
    return { ok: true, message: null };
  }

  /**
   * Soft warning: value outside expected typical range,
   * but not blocked.
   */
  function unusualRange(value, typicalMin, typicalMax, label) {
    if (!isValid(value)) return null;
    if (value < typicalMin || value > typicalMax) {
      var l = label || (typeof window !== 'undefined' && window.i18n ? window.i18n.t('guard.measurement_fallback') : 'measurement');
      return typeof window !== 'undefined' && window.i18n
        ? window.i18n.t('guard.unusual_range', { label: l, min: typicalMin, max: typicalMax })
        : ('Unusual ' + l + ' - typical range is ' + typicalMin + ' to ' + typicalMax + '. Verify before proceeding.');
    }
    return null;
  }

  /* ── Safe arithmetic ──────────────────────────────────────── */
  /**
   * Divide, returning fallback when denominator is 0.
   */
  function safeDiv(numerator, denominator, fallback) {
    var fb = arguments.length > 2 ? fallback : NaN;
    if (!isValid(numerator) || !isValid(denominator) || denominator === 0) return fb;
    return numerator / denominator;
  }

  /* ── Error/warning rendering ──────────────────────────────── */
  /**
   * Blocking error (red). Prevents calculation.
   * @param {string} message
   * @returns {string} HTML
   */
  function formatError(message) {
    return '<div class="poli-err-card" role="alert">' + esc(message) + '</div>';
  }

  /**
   * Warning (amber). Allows but flags.
   * @param {string} message
   * @returns {string} HTML
   */
  function formatWarning(message) {
    return '<div class="poli-warn-card" role="alert">' + esc(message) + '</div>';
  }

  /* ── Default CSS injection ────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('poli-input-guards-css')) return;
    var style = document.createElement('style');
    style.id = 'poli-input-guards-css';
    style.textContent =
      '.poli-err-card{background:var(--err-bg,#3c1618);border-left:4px solid var(--err-border,#f85149);color:var(--err-text,#ffb4ab);padding:0.75rem 1rem;border-radius:6px;margin-bottom:1rem;font-size:0.95rem;}' +
      '.poli-warn-card{background:var(--warn-bg,#342800);border-left:4px solid var(--warn-border,#d29922);color:var(--warn-text,#f0c674);padding:0.75rem 1rem;border-radius:6px;margin-bottom:1rem;font-size:0.95rem;}';
    document.head.appendChild(style);
  }

  /* Auto-inject on load */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }

  /* ── Public API ───────────────────────────────────────────── */
  var api = {
    esc: esc,
    safeFloat: safeFloat,
    isValid: isValid,
    inRange: inRange,
    positive: positive,
    unusualRange: unusualRange,
    safeDiv: safeDiv,
    formatError: formatError,
    formatWarning: formatWarning,
  };

  if (typeof window !== 'undefined') window.InputGuards = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  return api;
})();
