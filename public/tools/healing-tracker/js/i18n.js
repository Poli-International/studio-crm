// Local calendar date as YYYY-MM-DD. toISOString() is UTC and dates an entry
// yesterday for anyone east of UTC before their UTC midnight.
window.localISODate = function (d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};
// Synchronous i18n translation engine
(function() {
  var currentLang = 'en';

  // Recursively traverses window.I18N_DICTIONARY along a key path
  function traverseDictionary(dict, pathParts) {
    if (!dict || typeof dict !== 'object' || !pathParts || pathParts.length === 0) {
      return dict;
    }
    var currentKey = pathParts[0];
    var remainingParts = pathParts.slice(1);
    if (currentKey in dict) {
      var next = dict[currentKey];
      if (remainingParts.length === 0) {
        return next;
      }
      return traverseDictionary(next, remainingParts);
    }
    return null;
  }

  function lookup(dict, keyPath) {
    if (!dict || typeof dict !== 'object' || typeof keyPath !== 'string') {
      return null;
    }
    var parts = keyPath.split('.');
    var result = traverseDictionary(dict, parts);
    if (typeof result === 'string') {
      return result;
    }
    if (result && typeof result === 'object' && typeof result.text === 'string') {
      return result.text;
    }
    return null;
  }

  function getTranslation(keyPath, params) {
    var raw = null;

    if (window.I18N_DICTIONARY && window.I18N_DICTIONARY[currentLang]) {
      raw = lookup(window.I18N_DICTIONARY[currentLang], keyPath);
    }

    // Fallback to English before returning keyPath
    if ((raw === null || typeof raw !== 'string') && window.I18N_DICTIONARY && window.I18N_DICTIONARY.en) {
      raw = lookup(window.I18N_DICTIONARY.en, keyPath);
    }

    if (raw === null || typeof raw !== 'string') {
      return keyPath;
    }

    var result = raw;
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(function(paramKey) {
        var token = '{' + paramKey + '}';
        var value = params[paramKey];
        if (value !== undefined && value !== null) {
          result = result.split(token).join(String(value));
        }
      });
    }

    return result;
  }

  // Recursively traverses window.I18N_DICTIONARY and updates textContent, placeholder, and aria-label
  function updateI18nElements(container) {
    var root = container || document;
    var dict = (window.I18N_DICTIONARY && window.I18N_DICTIONARY[currentLang]) || (window.I18N_DICTIONARY && window.I18N_DICTIONARY.en) || {};
    var fallbackDict = (window.I18N_DICTIONARY && window.I18N_DICTIONARY.en) || {};

    // 1. Iterate through all elements with data-i18n attributes
    var elements = root.querySelectorAll('[data-i18n]');
    elements.forEach(function(el) {
      var keyPath = el.getAttribute('data-i18n');
      if (!keyPath) return;

      var parts = keyPath.split('.');
      var rawValue = traverseDictionary(dict, parts);
      if (rawValue === null || rawValue === undefined) {
        rawValue = traverseDictionary(fallbackDict, parts);
      }

      var textVal = null;
      var placeholderVal = null;
      var ariaVal = null;

      if (typeof rawValue === 'string') {
        textVal = rawValue;
      } else if (rawValue && typeof rawValue === 'object') {
        if (typeof rawValue.text === 'string') textVal = rawValue.text;
        else if (typeof rawValue.textContent === 'string') textVal = rawValue.textContent;
        if (typeof rawValue.placeholder === 'string') placeholderVal = rawValue.placeholder;
        if (typeof rawValue.ariaLabel === 'string') ariaVal = rawValue.ariaLabel;
        else if (typeof rawValue['aria-label'] === 'string') ariaVal = rawValue['aria-label'];
        else if (typeof rawValue.aria === 'string') ariaVal = rawValue.aria;
      }

      // If textVal was resolved
      if (textVal !== null) {
        var isInputOrTextarea = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
        if (isInputOrTextarea) {
          if (el.type === 'button' || el.type === 'submit' || el.type === 'reset') {
            el.value = textVal;
          } else {
            el.setAttribute('placeholder', textVal);
          }
        } else {
          el.textContent = textVal;
        }

        // Update placeholder if element has placeholder attribute
        if (el.hasAttribute('placeholder') && !placeholderVal && !el.hasAttribute('data-i18n-placeholder')) {
          el.setAttribute('placeholder', textVal);
        }

        // Update aria-label if element has aria-label attribute
        if (el.hasAttribute('aria-label') && !ariaVal && !el.hasAttribute('data-i18n-aria')) {
          el.setAttribute('aria-label', textVal);
        }
      }

      // Apply explicit object placeholder if present
      if (placeholderVal !== null) {
        el.setAttribute('placeholder', placeholderVal);
      }

      // Apply explicit object aria-label if present
      if (ariaVal !== null) {
        el.setAttribute('aria-label', ariaVal);
      }
    });

    // 2. Translate explicit placeholders
    var placeholderEls = root.querySelectorAll('[data-i18n-placeholder]');
    placeholderEls.forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', getTranslation(key));
      }
    });

    // 3. Translate explicit titles
    var titleEls = root.querySelectorAll('[data-i18n-title]');
    titleEls.forEach(function(el) {
      var key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', getTranslation(key));
      }
    });

    // 4. Translate explicit aria-labels
    var ariaEls = root.querySelectorAll('[data-i18n-aria]');
    ariaEls.forEach(function(el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key) {
        el.setAttribute('aria-label', getTranslation(key));
      }
    });

    // 5. Translate explicit labels (e.g. optgroup)
    var labelEls = root.querySelectorAll('[data-i18n-label]');
    labelEls.forEach(function(el) {
      var key = el.getAttribute('data-i18n-label');
      if (key) {
        el.setAttribute('label', getTranslation(key));
      }
    });
  }

  function applyI18n(container) {
    updateI18nElements(container);
  }

  window.t = getTranslation;
  window.applyI18n = applyI18n;
  window.updateI18nElements = updateI18nElements;
  window.traverseDictionary = traverseDictionary;
  window.getCurrentLanguage = function() {
    return currentLang;
  };
  window.i18n = {
    t: getTranslation,
    getTranslation: getTranslation,
    setLanguage: function(l) { if (window.setLanguage) window.setLanguage(l); },
    getCurrentLanguage: function() { return currentLang; },
    getLanguage: function() { return currentLang; },
    applyI18n: applyI18n,
    updateI18nElements: updateI18nElements
  };
  window.I18n = window.i18n;

  function updateDocsFrame(lang) {
    var docsFrame = document.querySelector('#tab-docs iframe.docs-frame') ||
                    document.querySelector('iframe.docs-frame') ||
                    document.querySelector('iframe[title="Technical Documentation"]');
    if (docsFrame) {
      var targetSrc = (lang === 'en') ? './documentation.html' : ('./documentation-' + lang + '.html');
      var currentSrc = docsFrame.getAttribute('src');
      if (currentSrc !== targetSrc) {
        docsFrame.setAttribute('src', targetSrc);
      }

      function notifyDocs() {
        try {
          if (docsFrame.contentWindow) {
            docsFrame.contentWindow.postMessage({ type: 'poli-language', language: lang }, '*');
            docsFrame.contentWindow.postMessage({ type: 'setLanguage', language: lang }, '*');
            docsFrame.contentWindow.postMessage({ type: 'languageChanged', detail: { language: lang } }, '*');
          }
        } catch (e) {}
      }

      notifyDocs();
      docsFrame.onload = function() {
        notifyDocs();
      };
    }

    // Update active state in documentation toolbar links if present
    document.querySelectorAll('.docs-lang-link').forEach(function(link) {
      if (link.getAttribute('data-lang') === lang) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.setLanguage = function(lang) {
    if (!lang) return;
    var supportedLanguages = ['en', 'fr', 'de', 'it', 'es', 'nl', 'pt'];
    if (supportedLanguages.indexOf(lang) !== -1 && window.I18N_DICTIONARY && window.I18N_DICTIONARY[lang]) {
      currentLang = lang;
    } else {
      currentLang = 'en';
    }

    // Update document's lang attribute
    document.documentElement.lang = currentLang;
    document.documentElement.setAttribute('lang', currentLang);
    try {
      document.lang = currentLang;
    } catch (e) {}

    // Persist preferred language to localStorage
    try {
      localStorage.setItem('preferred_language', currentLang);
      localStorage.setItem('language', currentLang);
    } catch (e) {}

    // Synchronize language switcher select element
    var switcher = document.getElementById('languageSwitcher');
    if (switcher && switcher.value !== currentLang) {
      switcher.value = currentLang;
    }

    // Trigger re-render of all elements with data-i18n attributes
    applyI18n();

    // Update documentation iframe src and notify
    updateDocsFrame(currentLang);

    // Dispatch event for other components to refresh
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLang } }));
  };

  // Cross-frame communication listener
  window.addEventListener('message', function(e) {
    if (e.data) {
      if (e.data.type === 'poli-language' || e.data.type === 'setLanguage') {
        var msgLang = e.data.language;
        if (msgLang && msgLang !== currentLang) {
          window.setLanguage(msgLang);
        }
      } else if (e.data.type === 'languageChanged' && e.data.detail) {
        var detailLang = e.data.detail.language;
        if (detailLang && detailLang !== currentLang) {
          window.setLanguage(detailLang);
        }
      }
    }
  });

  function initLanguage() {
    var supportedLanguages = ['en', 'fr', 'de', 'it', 'es', 'nl', 'pt'];
    var preferredLang = null;

    try {
      preferredLang = localStorage.getItem('preferred_language') || localStorage.getItem('language');
    } catch (e) {}

    if (!preferredLang) {
      try {
        var params = new URLSearchParams(window.location.search);
        var qLang = params.get('lang');
        if (qLang) preferredLang = qLang;
      } catch (e) {}
    }

    if (preferredLang && supportedLanguages.indexOf(preferredLang) !== -1 && window.I18N_DICTIONARY && window.I18N_DICTIONARY[preferredLang]) {
      currentLang = preferredLang;
    } else {
      currentLang = 'en';
    }

    // Update document's lang attribute
    document.documentElement.lang = currentLang;
    document.documentElement.setAttribute('lang', currentLang);
    try {
      document.lang = currentLang;
    } catch (e) {}

    // Configure language switcher select element
    var switcher = document.getElementById('languageSwitcher');
    if (switcher) {
      switcher.value = currentLang;
      switcher.addEventListener('change', function(e) {
        var selectedLang = (e && e.target && e.target.value) || this.value;
        window.setLanguage(selectedLang);
      });
    }

    // Listen to documentation toolbar link clicks
    document.addEventListener('click', function(e) {
      var target = e.target;
      if (target && target.classList && target.classList.contains('docs-lang-link')) {
        e.preventDefault();
        var selected = target.getAttribute('data-lang');
        if (selected) {
          window.setLanguage(selected);
        }
      }
    });

    // Update UI elements and documentation iframe
    applyI18n();
    updateDocsFrame(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }
})();

