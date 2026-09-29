// ═══════════════════════════════════════════════════════════════
// I18N.JS - Internationalization Engine for Piercing Pain Guide V2
// Synchronous key lookup, 7-language selector, DOM hydration, and redraw events.
// ═══════════════════════════════════════════════════════════════

(function() {
  window.i18nLocales = window.i18nLocales || {};

  const SUPPORTED_LANGUAGES = {
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
    nl: 'Nederlands',
    pt: 'Português'
  };

  const STORAGE_KEY = 'poli_tools_language';
  let activeLang = 'en';

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES[saved]) {
      activeLang = saved;
    }
  } catch (e) {
    // localStorage might be unavailable in restricted sandbox
  }

  window.t = function(key, params) {
    const dict = window.i18nLocales[activeLang] || window.i18nLocales.en || {};
    let val = dict[key];
    if (typeof val === 'undefined') {
      const fallback = window.i18nLocales.en || {};
      val = fallback[key];
    }
    if (typeof val === 'undefined') {
      return key;
    }
    if (params && typeof params === 'object') {
      for (const [pKey, pVal] of Object.entries(params)) {
        val = val.replace(new RegExp('\\{' + pKey + '\\}', 'g'), String(pVal));
      }
    }
    return val;
  };

  window.getCurrentLanguage = function() {
    return activeLang;
  };

  window.getSupportedLanguages = function() {
    return SUPPORTED_LANGUAGES;
  };

  window.setLanguage = function(lang) {
    if (!SUPPORTED_LANGUAGES[lang]) return;
    activeLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // Update document lang attribute
    document.documentElement.lang = lang;

    // Sync select dropdowns
    const selectors = document.querySelectorAll('.language-select, #languageSelect, #languageSelector');
    selectors.forEach(sel => {
      if (sel.value !== lang) sel.value = lang;
    });

    // Translate all static DOM nodes with data-i18n
    hydrateDomTranslations();

    // Dispatch event for components to re-render generated content
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  };

  function hydrateDomTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const translated = window.t(key);
        if (el.tagName.toLowerCase() === 'title') {
          document.title = translated;
        } else {
          el.textContent = translated;
        }
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;
      // Format: "placeholder:key|title:key"
      raw.split('|').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key) {
          el.setAttribute(attr.trim(), window.t(key.trim()));
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Populate any language selector dropdown
    const selectors = document.querySelectorAll('.language-select, #languageSelect, #languageSelector');
    selectors.forEach(sel => {
      sel.innerHTML = '';
      for (const [code, label] of Object.entries(SUPPORTED_LANGUAGES)) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = `${label} (${code.toUpperCase()})`;
        if (code === activeLang) opt.selected = true;
        sel.appendChild(opt);
      }
      sel.addEventListener('change', function(e) {
        window.setLanguage(e.target.value);
      });
    });

    // Hydrate DOM
    hydrateDomTranslations();
  });
})();
