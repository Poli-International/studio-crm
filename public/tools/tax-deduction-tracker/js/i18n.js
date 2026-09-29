/* ==========================================================================
   Tattoo Artist Tax Deduction Tracker: Internationalisation Engine
   Poli International Studio Tools
   Supports 7 Languages: en, fr, it, de, es, nl, pt
   Pure client-side zero-dependency localization engine
   ========================================================================== */

(function() {
  'use strict';

  const dictionaries = {};
  let currentLang = 'en';

  try {
    const saved = localStorage.getItem('poli-tax-lang');
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'it' || saved === 'de' || saved === 'es' || saved === 'nl' || saved === 'pt')) {
      currentLang = saved;
    }
  } catch (e) {
    // localStorage unavailable
  }

  function register(lang, dict) {
    dictionaries[lang] = dict;
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (dictionaries[lang]) {
      currentLang = lang;
      try {
        localStorage.setItem('poli-tax-lang', lang);
      } catch (e) {}
      applyI18n();
      if (typeof window.onLanguageChange === 'function') {
        window.onLanguageChange(lang);
      }
    }
  }

  function t(key, params) {
    const dict = dictionaries[currentLang] || dictionaries['en'] || {};
    let str = dict[key] !== undefined ? dict[key] : ((dictionaries['en'] && dictionaries['en'][key] !== undefined) ? dictionaries['en'][key] : key);
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(p => {
        str = str.replace(new RegExp('\\{' + p + '\\}', 'g'), String(params[p]));
      });
    }
    return str;
  }

  function applyI18n() {
    document.documentElement.lang = currentLang;

    // Direct text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const val = t(key);
        if (el.tagName === 'TITLE') {
          document.title = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });

    // Aria labels
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (key) el.setAttribute('aria-label', t(key));
    });

    // Tooltip titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });
  }

  window.i18n = {
    register,
    getLang,
    setLang,
    t,
    applyI18n,
    dictionaries
  };
  window.t = t;
})();
