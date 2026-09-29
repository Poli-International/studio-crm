/**
 * Poli International - i18n Internationalization Engine
 * Offline-first, zero-dependency translation system.
 * Supports token interpolation, HTML/attribute translation, and language switching.
 */
(function (window) {
  'use strict';

  var i18n = window.i18n || {};
  i18n.translations = i18n.translations || {};
  i18n.currentLang = i18n.currentLang || 'en';

  /**
   * Interpolate parameters into a string template.
   * e.g. "Showing {count} of {total}" with {count: 5, total: 28}
   */
  function interpolate(str, params) {
    if (!params || typeof params !== 'object' || typeof str !== 'string') {
      return str;
    }
    return str.replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, token) {
      return Object.prototype.hasOwnProperty.call(params, token) ? params[token] : match;
    });
  }

  /**
   * Primary translate function
   */
  function translate(key, params, defaultText) {
    if (!key) return '';
    var lang = i18n.currentLang || 'en';
    var dict = i18n.translations[lang] || i18n.translations['en'] || {};
    var val = dict[key];

    // Fallback to English dictionary if missing in current language
    if (val === undefined && i18n.translations['en']) {
      val = i18n.translations['en'][key];
    }

    // Fallback to provided default text, or return the key itself
    if (val === undefined) {
      val = (defaultText !== undefined) ? defaultText : key;
    }

    return interpolate(val, params);
  }

  /**
   * Translates a single DOM element based on its data-i18n attributes.
   */
  function translateElement(el) {
    if (!el || !el.getAttribute) return;

    var key = el.getAttribute('data-i18n');
    if (key) {
      var translated = translate(key);
      if (translated && translated !== key) {
        // Prevent accidental rendering of HTML comments or script blocks
        if (translated.trim().startsWith('<!--') || /<script/i.test(translated)) {
          return;
        }
        // If translated string contains HTML tags or HTML entities, assign via innerHTML; otherwise textContent
        if (/<[a-z][\s\S]*>/i.test(translated) || /&[a-z0-9#]+;/i.test(translated)) {
          el.innerHTML = translated;
        } else {
          el.textContent = translated;
        }
      }
    }

    var placeholderKey = el.getAttribute('data-i18n-placeholder');
    if (placeholderKey) {
      el.setAttribute('placeholder', translate(placeholderKey));
    }

    var titleKey = el.getAttribute('data-i18n-title');
    if (titleKey) {
      el.setAttribute('title', translate(titleKey));
    }

    var ariaKey = el.getAttribute('data-i18n-aria-label');
    if (ariaKey) {
      el.setAttribute('aria-label', translate(ariaKey));
    }

    var altKey = el.getAttribute('data-i18n-alt');
    if (altKey) {
      el.setAttribute('alt', translate(altKey));
    }

    var labelKey = el.getAttribute('data-i18n-label');
    if (labelKey) {
      el.setAttribute('label', translate(labelKey));
    }
  }

  /**
   * Sweeps over the document or container element to translate all tagged elements.
   */
  function translateDocument(root) {
    var scope = root || document;
    if (!scope || !scope.querySelectorAll) return;

    var elements = scope.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria-label], [data-i18n-alt], [data-i18n-label]');
    for (var i = 0; i < elements.length; i++) {
      translateElement(elements[i]);
    }
  }

  /**
   * Switches the active language and re-translates the document.
   */
  function setLanguage(lang) {
    if (!lang) return;
    i18n.currentLang = lang;
    try {
      localStorage.setItem('poli_tools_language', lang);
    } catch (e) {
      // Storage unavailable in sandbox/restricted iframe
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      
      // Synchronize all language switcher dropdowns
      var selects = document.querySelectorAll('#languageSelect, .piercing-angle-guide__language-select');
      for (var i = 0; i < selects.length; i++) {
        if (selects[i].value !== lang) {
          selects[i].value = lang;
        }
      }

      // Serve appropriate documentation language file based on switcher selection
      var docLinks = document.querySelectorAll('[data-doc-type]');
      for (var d = 0; d < docLinks.length; d++) {
        var docType = docLinks[d].getAttribute('data-doc-type');
        if (docType === 'user-guide') {
          docLinks[d].href = (lang === 'en') ? 'docs/USER-GUIDE.md' : 'docs/USER-GUIDE.' + lang + '.md';
        } else if (docType === 'technical-docs') {
          docLinks[d].href = (lang === 'en') ? 'docs/TECHNICAL-DOCS.md' : 'docs/TECHNICAL-DOCS.' + lang + '.md';
        } else if (docType === 'contributing') {
          docLinks[d].href = (lang === 'en') ? 'CONTRIBUTING.md' : 'CONTRIBUTING.' + lang + '.md';
        } else if (docType === 'readme') {
          docLinks[d].href = (lang === 'en') ? 'README.md' : 'README.' + lang + '.md';
        }
      }
    }

    translateDocument();

    // Dispatch global languageChanged event for dynamic components to re-render
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        var evt;
        if (typeof CustomEvent === 'function') {
          evt = new CustomEvent('languageChanged', { detail: { lang: lang } });
        } else if (document && document.createEvent) {
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent('languageChanged', true, true, { lang: lang });
        }
        if (evt) {
          window.dispatchEvent(evt);
        }
      } catch (err) {}
    }
  }

  // Register on window
  i18n.t = translate;
  i18n.translate = translate;
  i18n.translateElement = translateElement;
  i18n.translateDocument = translateDocument;
  i18n.setLanguage = setLanguage;

  window.i18n = i18n;
  window.translate = translate;

  function initI18nUI() {
    var savedLang = 'en';
    try {
      savedLang = localStorage.getItem('poli_tools_language') || 'en';
    } catch (e) {}

    // Attach listeners to any language selects
    var selects = document.querySelectorAll('#languageSelect, .piercing-angle-guide__language-select');
    for (var i = 0; i < selects.length; i++) {
      selects[i].value = savedLang;
      selects[i].addEventListener('change', function () {
        setLanguage(this.value);
      });
    }

    setLanguage(savedLang);
  }

  // Auto-translate on document ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initI18nUI);
    } else {
      initI18nUI();
    }
  }

})(typeof window !== 'undefined' ? window : this);
