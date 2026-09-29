/**
 * Poli International - Autoclave Sterilization Suite
 * Internationalization (i18n) Core Engine
 * 
 * Manages language registration, string resolution, token substitution,
 * local storage persistence, DOM TreeWalker translation sweeps,
 * mutation observation, and dynamic component localization.
 */

(function(window) {
    'use strict';

    const STORAGE_KEY = 'autoclave_app_language';
    const SUPPORTED_LANGUAGES = ['en', 'fr', 'it', 'de', 'es', 'nl', 'pt'];
    const DEFAULT_LANGUAGE = 'en';

    const dictionaries = {};

    // Check for any pending dictionaries registered before engine loaded
    if (window.__i18n_pending) {
        Object.keys(window.__i18n_pending).forEach(function(lang) {
            dictionaries[lang] = window.__i18n_pending[lang];
        });
    }

    function getInitialLanguage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
                return saved;
            }
            if (navigator && navigator.language) {
                const navLang = navigator.language.slice(0, 2).toLowerCase();
                if (SUPPORTED_LANGUAGES.includes(navLang)) {
                    return navLang;
                }
            }
        } catch (e) {
            console.warn('[i18n] Storage access error:', e);
        }
        return DEFAULT_LANGUAGE;
    }

    let currentLanguage = getInitialLanguage();
    let isTranslating = false;

    function lookupInDict(str, lang) {
        if (!str || typeof str !== 'string') return str;
        const trimmed = str.trim();
        if (trimmed.length === 0) return str;

        // Skip pure numbers or pure punctuation/units
        if (/^[0-9\s.,\/#!$%\^&\*;:{}=\-_`~()°%+><≤≥•|\-]+$/.test(trimmed)) {
            return str;
        }

        const dict = dictionaries[lang] || {};
        if (dict[trimmed]) {
            return dict[trimmed];
        }

        // Try stripping leading icons / emojis / bullets / checkmarks
        const iconMatch = trimmed.match(/^([\uD800-\uDBFF\uDC00-\uDFFF\s\u2600-\u27BF⚡🚨🧪💧🏷️📋🌡️💾🗑️📤📥🔬📦📏🔧⚖️▶⏸🔄🔔👁️🖨️➕•\-\+\/✓⚠️✅❌]+)(.+)$/u);
        if (iconMatch) {
            const icon = iconMatch[1];
            const rest = iconMatch[2].trim();
            if (dict[rest]) {
                return icon + dict[rest];
            }
            if (dict[iconMatch[2]]) {
                return icon + dict[iconMatch[2]];
            }
        }

        // Try stripping trailing colons / parenthesis / counts
        const suffixMatch = trimmed.match(/^(.+?)(:|\s*\([^)]*\)|\s*\[[^\]]*\]|\s*\d+)$/);
        if (suffixMatch) {
            const base = suffixMatch[1].trim();
            const suffix = suffixMatch[2];
            if (dict[base]) {
                return dict[base] + (suffix.startsWith(' ') ? suffix : (' ' + suffix.trim()));
            }
        }

        // Try number prefix (e.g. "3 Units Loaded", "3 Years", "2. Packaging Integrity")
        const numPrefixMatch = clean => {
            return clean.match(/^(\d+(?:\.\d+)?\.?\s+)(.+)$/);
        };
        const pfxMatch = numPrefixMatch(trimmed);
        if (pfxMatch) {
            const pfx = pfxMatch[1];
            const base = pfxMatch[2].trim();
            if (dict[base]) {
                return pfx + dict[base];
            }
        }

        return str;
    }

    const i18n = {
        SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES,

        registerLanguage: function(lang, dict) {
            if (!lang || typeof dict !== 'object') return;
            dictionaries[lang] = Object.assign(dictionaries[lang] || {}, dict);
            if (lang === currentLanguage && typeof document !== 'undefined' && document.body) {
                this.applyTranslations();
            }
        },

        getLanguage: function() {
            return currentLanguage;
        },

        setLanguage: function(lang) {
            if (!SUPPORTED_LANGUAGES.includes(lang)) {
                console.warn('[i18n] Unsupported language:', lang);
                return;
            }
            currentLanguage = lang;
            try {
                localStorage.setItem(STORAGE_KEY, lang);
            } catch (e) {}

            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('lang', lang);
                this.applyTranslations();

                // Update language selector dropdown if in DOM
                const selectEls = document.querySelectorAll('.language-select, #language-selector, #header-language-select');
                selectEls.forEach(function(sel) {
                    if (sel.value !== lang) {
                        sel.value = lang;
                    }
                });

                // Dispatch global event for components (charts, canvas, dynamic tables)
                document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
            }
        },

        t: function(keyOrText, params) {
            if (!keyOrText) return '';
            
            const currentLang = currentLanguage;
            let val = lookupInDict(keyOrText, currentLang);
            if (val === keyOrText && dictionaries[DEFAULT_LANGUAGE] && dictionaries[DEFAULT_LANGUAGE][keyOrText]) {
                val = lookupInDict(dictionaries[DEFAULT_LANGUAGE][keyOrText], currentLang);
            }

            if (params && typeof params === 'object') {
                Object.keys(params).forEach(function(paramKey) {
                    const token = '{' + paramKey + '}';
                    val = val.split(token).join(String(params[paramKey]));
                });
            }

            return val;
        },

        getAllKeys: function() {
            const keys = new Set();
            Object.keys(dictionaries).forEach(function(lang) {
                Object.keys(dictionaries[lang] || {}).forEach(function(k) {
                    keys.add(k);
                });
            });
            return Array.from(keys);
        },

        getDictionary: function(lang) {
            return dictionaries[lang] || {};
        },

        applyTranslations: function(root) {
            if (isTranslating) return;
            isTranslating = true;

            try {
                const container = root || (typeof document !== 'undefined' ? (document.body || document.documentElement) : null);
                if (!container) return;
                const currentLang = currentLanguage;

                // 1. Explicit data-i18n elements
                if (container.querySelectorAll) {
                    const textElements = container.querySelectorAll('[data-i18n]');
                    textElements.forEach(function(el) {
                        const key = el.getAttribute('data-i18n');
                        if (!key) return;
                        const translated = i18n.t(key);
                        if (translated && translated !== key) {
                            if (el.getAttribute('data-i18n-mode') === 'html') {
                                el.innerHTML = translated;
                            } else if (el.children.length === 0) {
                                el.textContent = translated;
                            } else {
                                let foundTextNode = false;
                                for (let i = 0; i < el.childNodes.length; i++) {
                                    if (el.childNodes[i].nodeType === 3 && el.childNodes[i].nodeValue.trim().length > 0) {
                                        el.childNodes[i].nodeValue = ' ' + translated + ' ';
                                        foundTextNode = true;
                                        break;
                                    }
                                }
                                if (!foundTextNode) {
                                    el.textContent = translated;
                                }
                            }
                        }
                    });

                    // 2. Explicit data-i18n-placeholder / placeholder
                    const placeholderElements = container.querySelectorAll('[data-i18n-placeholder], [placeholder]');
                    placeholderElements.forEach(function(el) {
                        if (el.closest && (el.closest('#language-selector') || el.id === 'language-selector')) return;
                        const key = el.getAttribute('data-i18n-placeholder');
                        if (key) {
                            const trans = i18n.t(key);
                            if (trans) el.setAttribute('placeholder', trans);
                        } else if (el.hasAttribute('placeholder')) {
                            if (el._origPlaceholder === undefined) {
                                el._origPlaceholder = el.getAttribute('placeholder');
                            }
                            const trans = lookupInDict(el._origPlaceholder, currentLang);
                            if (trans) el.setAttribute('placeholder', trans);
                        }
                    });

                    // 3. Explicit data-i18n-title / title
                    const titleElements = container.querySelectorAll('[data-i18n-title], [title]');
                    titleElements.forEach(function(el) {
                        if (el.closest && (el.closest('#language-selector') || el.id === 'language-selector')) return;
                        const key = el.getAttribute('data-i18n-title');
                        if (key) {
                            const trans = i18n.t(key);
                            if (trans) el.setAttribute('title', trans);
                        } else if (el.hasAttribute('title')) {
                            if (el._origTitle === undefined) {
                                el._origTitle = el.getAttribute('title');
                            }
                            const trans = lookupInDict(el._origTitle, currentLang);
                            if (trans) el.setAttribute('title', trans);
                        }
                    });

                    // 4. Explicit data-i18n-aria-label / aria-label
                    const ariaElements = container.querySelectorAll('[data-i18n-aria-label], [aria-label]');
                    ariaElements.forEach(function(el) {
                        if (el.closest && (el.closest('#language-selector') || el.id === 'language-selector')) return;
                        const key = el.getAttribute('data-i18n-aria-label');
                        if (key) {
                            const trans = i18n.t(key);
                            if (trans) el.setAttribute('aria-label', trans);
                        } else if (el.hasAttribute('aria-label')) {
                            if (el._origAriaLabel === undefined) {
                                el._origAriaLabel = el.getAttribute('aria-label');
                            }
                            const trans = lookupInDict(el._origAriaLabel, currentLang);
                            if (trans) el.setAttribute('aria-label', trans);
                        }
                    });

                    // 5. Button values
                    const btnElements = container.querySelectorAll('input[type="button"], input[type="submit"], input[type="reset"]');
                    btnElements.forEach(function(el) {
                        if (el._origValue === undefined) {
                            el._origValue = el.value;
                        }
                        const trans = lookupInDict(el._origValue, currentLang);
                        if (trans) el.value = trans;
                    });

                    // 6. Select Dropdown Options & Optgroups
                    const optgroups = container.querySelectorAll('select optgroup');
                    optgroups.forEach(function(og) {
                        if (og._origLabel === undefined) {
                            og._origLabel = og.getAttribute('label') || '';
                        }
                        const trans = lookupInDict(og._origLabel, currentLang);
                        if (trans) og.setAttribute('label', trans);
                    });

                    const options = container.querySelectorAll('select option');
                    options.forEach(function(opt) {
                        if (opt.parentElement && (opt.parentElement.id === 'language-selector' || opt.parentElement.classList.contains('language-select'))) return;
                        const optKey = opt.getAttribute('data-i18n');
                        if (optKey) {
                            const trans = i18n.t(optKey);
                            if (trans) opt.textContent = trans;
                        } else {
                            if (opt._origText === undefined) {
                                opt._origText = opt.textContent.trim();
                            }
                            const trans = lookupInDict(opt._origText, currentLang);
                            if (trans && trans !== opt.textContent) {
                                opt.textContent = trans;
                            }
                        }
                    });
                }

                // 7. Text Node TreeWalker (Translates all paragraphs, spans, headers, buttons, table cells, lists)
                if (typeof document !== 'undefined' && typeof document.createTreeWalker === 'function') {
                    const walker = document.createTreeWalker(
                        container,
                        NodeFilter.SHOW_TEXT,
                        {
                            acceptNode: function(node) {
                                const parent = node.parentElement;
                                if (!parent) return NodeFilter.FILTER_REJECT;
                                const tag = parent.tagName.toUpperCase();
                                if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA'].includes(tag)) {
                                    return NodeFilter.FILTER_REJECT;
                                }
                                if (parent.closest && (parent.closest('#language-selector') || parent.id === 'language-selector' || parent.classList.contains('language-select'))) {
                                    return NodeFilter.FILTER_REJECT;
                                }
                                if (parent.hasAttribute && parent.hasAttribute('data-i18n-skip')) {
                                    return NodeFilter.FILTER_REJECT;
                                }
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        },
                        false
                    );

                    let node;
                    while ((node = walker.nextNode())) {
                        const raw = node.nodeValue;
                        if (node._origText === undefined) {
                            node._origText = raw;
                        }

                        const trimmed = node._origText.trim();
                        if (trimmed.length > 0) {
                            const translated = lookupInDict(trimmed, currentLang);
                            if (translated && translated !== trimmed) {
                                const leadingWs = node._origText.match(/^\s*/)[0];
                                const trailingWs = node._origText.match(/\s*$/)[0];
                                node.nodeValue = leadingWs + translated + trailingWs;
                            } else if (currentLang === DEFAULT_LANGUAGE) {
                                node.nodeValue = node._origText;
                            }
                        }
                    }
                }
            } finally {
                isTranslating = false;
            }
        },

        init: function() {
            if (typeof document === 'undefined') return;

            document.documentElement.setAttribute('lang', currentLanguage);
            
            const onReady = function() {
                i18n.applyTranslations();

                const langSelect = document.getElementById('language-selector');
                if (langSelect) {
                    langSelect.value = currentLanguage;
                    langSelect.addEventListener('change', function(e) {
                        i18n.setLanguage(e.target.value);
                    });
                }

                // Set up MutationObserver to translate dynamically appended nodes
                if (typeof MutationObserver !== 'undefined') {
                    let debounceTimer = null;
                    const observer = new MutationObserver(function(mutations) {
                        if (currentLanguage === DEFAULT_LANGUAGE || isTranslating) return;
                        let needsUpdate = false;
                        for (let i = 0; i < mutations.length; i++) {
                            if (mutations[i].addedNodes && mutations[i].addedNodes.length > 0) {
                                needsUpdate = true;
                                break;
                            }
                        }
                        if (needsUpdate) {
                            clearTimeout(debounceTimer);
                            debounceTimer = setTimeout(function() {
                                i18n.applyTranslations();
                            }, 50);
                        }
                    });

                    observer.observe(document.body || document.documentElement, {
                        childList: true,
                        subtree: true
                    });
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onReady);
            } else {
                onReady();
            }
        }
    };

    window.i18n = i18n;
    window.t = function(keyOrText, params) {
        return i18n.t(keyOrText, params);
    };

    i18n.init();

})(window);
