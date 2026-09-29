/**
 * ═══════════════════════════════════════════════════════════
 * GLOBAL MULTILANGUAGE (i18n) ENGINE - DYNAMIC LOADER & PERSISTENCE
 * Supported Languages:
 *   🇬🇧 English (en)
 *   🇫🇷 Français (fr)
 *   🇮🇹 Italiano (it)
 *   🇩🇪 Deutsch (de)
 *   🇪🇸 Español (es)
 *   🇳🇱 Nederlands (nl)
 *   🇵🇹 Português (pt)
 * ═══════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    const SUPPORTED_LANGUAGES = {
        'en': { code: 'en', name: 'English', flag: '🇬🇧', label: '🇬🇧 English' },
        'fr': { code: 'fr', name: 'Français', flag: '🇫🇷', label: '🇫🇷 Français' },
        'it': { code: 'it', name: 'Italiano', flag: '🇮🇹', label: '🇮🇹 Italiano' },
        'de': { code: 'de', name: 'Deutsch', flag: '🇩🇪', label: '🇩🇪 Deutsch' },
        'es': { code: 'es', name: 'Español', flag: '🇪🇸', label: '🇪🇸 Español' },
        'nl': { code: 'nl', name: 'Nederlands', flag: '🇳🇱', label: '🇳🇱 Nederlands' },
        'pt': { code: 'pt', name: 'Português', flag: '🇵🇹', label: '🇵🇹 Português' }
    };

    const STORAGE_KEY = 'coverage-app-lang';
    let currentLang = 'en';
    let TRANSLATIONS = {};

    // Initial embedded fallback to prevent layout shift before fetch completes
    const EMBEDDED_FALLBACK = {
        en: {
            site_home: "HOME",
            site_about: "ABOUT",
            site_innovation: "INNOVATION",
            site_trust: "They trust us!",
            site_contact: "CONTACT",
            nav_home: "Home",
            nav_tools: "Tools",
            nav_tattoo_tools: "Tattoo Tools",
            nav_calculator: "Coverage Calculator",
            tool_main_title: "Tattoo Coverage Calculator & Session Planner",
            tool_main_subtitle: "Estimate tattoo session time • Calculate ink coverage • Professional planning tool",
            hero_title: "Professional Tattoo Needle Coverage Calculator",
            hero_subtitle: "Accurately estimate coverage area, session time, ink usage, and pricing for your tattoo projects. Plan multi-session work with confidence.",
            hero_feat_area: "Coverage Area",
            hero_feat_time: "Session Time",
            hero_feat_ink: "Ink Usage",
            hero_feat_pricing: "Pricing",
            ctrl_unit: "📏 Unit:",
            ctrl_style: "🎨 Style:",
            ctrl_lang: "🌐 Language:",
            btn_tour: "🗺️ Guided Tour",
            btn_embed: "⚡ Free Embed",
            btn_kofi: "Buy Me a Coffee",
            btn_theme_toggle: "Toggle dark mode",
            tab_coverage: "📐 Needle Coverage",
            tab_session: "⏱️ Session Time",
            tab_ink: "💧 Ink Usage",
            tab_pricing: "💰 Pricing",
            tab_inventory: "📦 Ink Inventory",
            tab_goals: "🎯 Session Goals",
            tab_efficiency: "📊 Artist Efficiency",
            btn_client_pdf: "Client PDF Report",
            btn_download_pdf: "Download PDF Report",
            btn_batch_plan: "Multi-Session Plan",
            btn_batch_delete: "Delete Selected",
            btn_export_csv: "Export CSV",
            btn_clear_history: "Clear History"
        }
    };

    TRANSLATIONS = Object.assign({}, EMBEDDED_FALLBACK);

    /**
     * Asynchronously loads translations from i18n.json beside index.html
     */
    async function loadTranslationsFromJson() {
        try {
            const response = await fetch('i18n.json');
            if (response.ok) {
                const data = await response.json();
                if (data && typeof data === 'object') {
                    TRANSLATIONS = data;
                    applyTranslations();
                    // Dispatch update event once remote translations are populated
                    window.dispatchEvent(new CustomEvent('i18nLoaded', {
                        detail: { currentLang: currentLang, translations: TRANSLATIONS[currentLang] }
                    }));
                }
            }
        } catch (err) {
            console.warn('[i18n] Could not load i18n.json dynamically; using internal translations dictionary.', err);
        }
    }

    /**
     * Initialize i18n subsystem
     */
    function initI18n() {
        // Global listener for language selector changes
        document.addEventListener('change', function(e) {
            if (e.target && (e.target.id === 'global-language-select' || e.target.classList.contains('global-language-select') || e.target.classList.contains('coverage__control-select-lang'))) {
                setLanguage(e.target.value, true);
            }
        });

        // 1. Detect language preference: URL param -> localStorage -> browser language -> 'en'
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const storedLang = localStorage.getItem(STORAGE_KEY);
        
        let detectedBrowserLang = '';
        const navLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
        for (const rawLang of navLangs) {
            if (!rawLang) continue;
            const shortCode = rawLang.toLowerCase().split('-')[0].trim();
            if (SUPPORTED_LANGUAGES[shortCode]) {
                detectedBrowserLang = shortCode;
                break;
            }
        }

        let initialLang = 'en';
        if (urlLang && SUPPORTED_LANGUAGES[urlLang]) {
            initialLang = urlLang;
        } else if (storedLang && SUPPORTED_LANGUAGES[storedLang]) {
            initialLang = storedLang;
        } else if (detectedBrowserLang && SUPPORTED_LANGUAGES[detectedBrowserLang]) {
            initialLang = detectedBrowserLang;
        }

        // 2. Set current language and immediately sync dropdowns
        setLanguage(initialLang, false);

        // 3. Fetch full /i18n.json in background
        loadTranslationsFromJson();
    }

    /**
     * Switch language, persist to localStorage, and re-render all DOM strings
     */
    function setLanguage(langCode, notify = true) {
        if (!SUPPORTED_LANGUAGES[langCode]) {
            langCode = 'en';
        }
        currentLang = langCode;

        // Persist language selection in localStorage
        try {
            localStorage.setItem(STORAGE_KEY, langCode);
        } catch (e) {
            console.warn('[i18n] Could not persist language to localStorage', e);
        }

        // Update html tag lang
        document.documentElement.lang = langCode;

        // Update all Language Selects in the DOM
        const langSelects = document.querySelectorAll('#global-language-select, .global-language-select, .coverage__control-select-lang');
        langSelects.forEach(select => {
            if (select.value !== langCode) {
                select.value = langCode;
            }
        });

        // Update language pill active states if any
        const langPills = document.querySelectorAll('.coverage__lang-pill');
        langPills.forEach(pill => {
            if (pill.getAttribute('data-lang') === langCode) {
                pill.classList.add('coverage__lang-pill--active');
            } else {
                pill.classList.remove('coverage__lang-pill--active');
            }
        });

        // Apply translations across DOM
        applyTranslations();

        // Dispatch custom event for dynamic components (charts, converter, timer, tour, etc.)
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: {
                language: langCode,
                langObj: SUPPORTED_LANGUAGES[langCode],
                translations: TRANSLATIONS[langCode] || TRANSLATIONS['en'] || {}
            }
        }));

        if (notify && typeof window.showToastNotification === 'function') {
            const langName = SUPPORTED_LANGUAGES[langCode].label;
            const msg = t('toast_lang_switched', 'Language changed to ') + `<strong>${langName}</strong>`;
            window.showToastNotification(msg);
        }
    }

    /**
     * Translation lookup helper with fallback
     */
    function t(key, fallback = '') {
        const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'] || {};
        if (langDict && langDict[key] !== undefined) {
            return langDict[key];
        }
        const fallbackDict = TRANSLATIONS['en'] || {};
        if (fallbackDict && fallbackDict[key] !== undefined) {
            return fallbackDict[key];
        }
        return fallback || key;
    }

    /**
     * Translate text of a button while preserving leading/trailing icons or badges
     */
    function translateButton(btn, translatedText) {
        // If button has specific text span with data-i18n, the general loop handles it.
        // If the button itself has data-i18n:
        if (btn.children.length === 0) {
            btn.textContent = translatedText;
            return;
        }

        // Look for dedicated text span or id
        const textSpan = btn.querySelector('.btn-text, [id$="-btn-text"], .coverage__button-text');
        if (textSpan) {
            textSpan.textContent = translatedText;
            return;
        }

        // If button contains icons/spans and text node, update only the text node
        let textNodeUpdated = false;
        for (let node of btn.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
                node.nodeValue = ' ' + translatedText.trim() + ' ';
                textNodeUpdated = true;
                break;
            }
        }

        // Fallback: If no direct text node found, update last child if span
        if (!textNodeUpdated) {
            const lastChild = btn.lastElementChild;
            if (lastChild && !lastChild.classList.contains('coverage__button-icon') && !lastChild.classList.contains('kofi-icon')) {
                lastChild.textContent = translatedText;
            }
        }
    }

    /**
     * Traverses the DOM tree and applies localization based on data-i18n* attributes
     */
    function applyTranslations(container = document) {
        if (!container || !container.querySelectorAll) return;

        // 1. Elements with data-i18n (labels, titles, buttons, spans, paragraphs, headings)
        const elements = container.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = t(key);
            if (!translated) return;

            // Handle <input> / <textarea> with data-i18n
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit' || el.type === 'button') {
                    el.value = translated;
                } else {
                    el.placeholder = translated;
                }
                return;
            }

            // Handle <button> with data-i18n
            if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.classList.contains('coverage__button')) {
                translateButton(el, translated);
                return;
            }

            // Handle innerHTML if specified
            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = translated;
                return;
            }

            // Handle regular text elements
            if (el.children.length === 0) {
                el.textContent = translated;
            } else {
                let foundText = false;
                for (let node of el.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
                        node.nodeValue = ' ' + translated.trim() + ' ';
                        foundText = true;
                        break;
                    }
                }
                if (!foundText) {
                    el.textContent = translated;
                }
            }
        });

        // 2. Input and Textarea placeholders with data-i18n-placeholder
        const placeholderEls = container.querySelectorAll('[data-i18n-placeholder]');
        placeholderEls.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translated = t(key);
            if (translated) {
                el.placeholder = translated;
            }
        });

        // 3. Tooltips and titles with data-i18n-title
        const titleEls = container.querySelectorAll('[data-i18n-title]');
        titleEls.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translated = t(key);
            if (translated) {
                el.title = translated;
            }
        });

        // 4. Accessibility aria-labels with data-i18n-aria
        const ariaEls = container.querySelectorAll('[data-i18n-aria]');
        ariaEls.forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const translated = t(key);
            if (translated) {
                el.setAttribute('aria-label', translated);
            }
        });
    }

    // Expose Global I18N API
    window.I18N = {
        SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES,
        get TRANSLATIONS() { return TRANSLATIONS; },
        setLanguage: setLanguage,
        getCurrentLanguage: function() { return currentLang; },
        getLanguageDetails: function(code) { return SUPPORTED_LANGUAGES[code || currentLang]; },
        t: t,
        applyTranslations: applyTranslations,
        loadTranslationsFromJson: loadTranslationsFromJson,
        init: initI18n
    };

    // Auto initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();
