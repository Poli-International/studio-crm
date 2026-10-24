/**
 * Skin Tone & Pigment Visibility Matcher
 * Pure client-side logic, 100% dictionary-driven i18n,
 * qualitative contrast tiers (High/Medium/Low), narrative fade factors.
 */

(function () {
  'use strict';

  const INK_CONFIG = [
    {
      id: 'black',
      tiers: ['high', 'high', 'high', 'high', 'high', 'medium'],
    },
    {
      id: 'grey',
      tiers: ['high', 'high', 'medium', 'medium', 'low', 'low'],
    },
    {
      id: 'white',
      tiers: ['medium', 'medium', 'low', 'low', 'low', 'low'],
    },
    {
      id: 'red',
      tiers: ['high', 'high', 'medium', 'medium', 'low', 'low'],
      hasAllergyNote: true,
    },
    {
      id: 'orange',
      tiers: ['high', 'medium', 'medium', 'low', 'low', 'low'],
    },
    {
      id: 'yellow',
      tiers: ['medium', 'low', 'low', 'low', 'low', 'low'],
    },
    {
      id: 'green',
      tiers: ['high', 'high', 'medium', 'medium', 'low', 'low'],
    },
    {
      id: 'blue',
      tiers: ['high', 'high', 'high', 'medium', 'medium', 'low'],
    },
    {
      id: 'purple',
      tiers: ['high', 'high', 'medium', 'medium', 'low', 'low'],
    },
  ];

  const TYPE_KEYS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  let selectedType = null;

  function t(key, params) {
    return window.i18n ? window.i18n.t(key, params) : key;
  }

  function getTierCount(tier) {
    if (tier === 'high') return 3;
    if (tier === 'medium') return 2;
    return 1;
  }

  function renderTierGauge(tier) {
    const count = getTierCount(tier);
    const tierText = t('contrast.' + tier);
    const accessibleDesc = tierText + ', ' + t('contrast.segment_count', { tier: count });

    let segmentsHtml = '';
    for (let i = 1; i <= 3; i++) {
      const activeCls = i <= count ? 'is-active is-' + tier : 'is-inactive';
      segmentsHtml += `<span class="tier-pip ${activeCls}"></span>`;
    }

    return `
      <div class="tier-indicator" role="img" aria-label="${accessibleDesc}">
        <div class="tier-pips" aria-hidden="true">${segmentsHtml}</div>
        <span class="tier-label is-${tier}">${tierText}</span>
      </div>
    `;
  }

  function renderResults(typeKey) {
    if (!typeKey) return;
    const typeIdx = TYPE_KEYS.indexOf(typeKey);
    if (typeIdx === -1) return;

    selectedType = typeKey;

    const resultsEl = document.getElementById('results');
    const headingEl = document.getElementById('results-heading');
    const summaryEl = document.getElementById('type-summary');
    const inkGridEl = document.getElementById('ink-grid');

    if (!resultsEl || !headingEl || !summaryEl || !inkGridEl) return;

    headingEl.textContent = t('results.heading', { type: typeKey });
    summaryEl.textContent = t('skin.type' + typeKey + '_summary');

    let cardsHtml = '';

    for (let i = 0; i < INK_CONFIG.length; i++) {
      const ink = INK_CONFIG[i];
      const tier = ink.tiers[typeIdx];
      const name = t('color.' + ink.id + '.name');
      const fadeFactor = t('color.' + ink.id + '.fade_factor');
      const note = t('color.' + ink.id + '.note_' + typeKey);

      let allergyHtml = '';
      if (ink.hasAllergyNote) {
        allergyHtml = `
          <div class="ink-card__allergy">
            <span class="allergy-icon" aria-hidden="true"><svg class=ti-i width=1.15em height=1.15em aria-hidden=true style=vertical-align:-.18em;flex:none><use href=../shared/icons.svg#i-info></use></svg></span>
            <span>${t('labels.allergy_note')} <a href="https://poliinternational.com/allergy-patch-test/" target="_top" class="inline-tool-link">${t('related.allergy_title')}</a></span>
          </div>
        `;
      }

      cardsHtml += `
        <article class="ink-card" id="ink-card-${ink.id}">
          <header class="ink-card__header">
            <div class="ink-card__title-group">
              <span class="ink-swatch swatch-${ink.id}" aria-hidden="true"></span>
              <h3 class="ink-card__name">${name}</h3>
            </div>
            ${renderTierGauge(tier)}
          </header>

          <div class="ink-card__body">
            <div class="ink-card__section">
              <span class="ink-card__meta-label">${t('labels.fade_factor')}</span>
              <p class="ink-card__fade-text">${fadeFactor}</p>
            </div>

            <div class="ink-card__section">
              <span class="ink-card__meta-label">${t('labels.artist_guidance')}</span>
              <p class="ink-card__note-text">${note}</p>
            </div>

            ${allergyHtml}
          </div>
        </article>
      `;
    }

    inkGridEl.innerHTML = cardsHtml;
    resultsEl.removeAttribute('hidden');
  }

  function applyTranslations() {
    // 1. Static text elements
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    // 2. Attributes (aria-label, title)
    const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');
    i18nAttrElements.forEach(el => {
      const raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;
      // Format: "aria-label:key,title:key"
      const pairs = raw.split(',');
      pairs.forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key) {
          el.setAttribute(attr.trim(), t(key.trim()));
        }
      });
    });

    // 3. Document meta title and description
    document.title = t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t('meta.title'));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', t('meta.description'));

    // 4. If a skin type is selected, re-render cards with fresh translations
    if (selectedType) {
      renderResults(selectedType);
    }
  }

  function initLanguageSelector() {
    const selectEl = document.getElementById('lang-select');
    if (!selectEl) return;

    selectEl.value = window.i18n ? window.i18n.currentLang : 'en';

    selectEl.addEventListener('change', function () {
      if (window.i18n) {
        window.i18n.setLanguage(selectEl.value);
        applyTranslations();
      }
    });
  }

  function initSkinSelector() {
    const container = document.getElementById('skin-grid');
    if (!container) return;

    container.addEventListener('click', function (e) {
      const btn = e.target.closest('.skin-btn');
      if (!btn) return;

      const allBtns = container.querySelectorAll('.skin-btn');
      allBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      const typeKey = btn.dataset.type;
      renderResults(typeKey);

      const resultsEl = document.getElementById('results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function initEmbedSnippet() {
    const copyBtn = document.getElementById('copy-embed-btn');
    const inputEl = document.getElementById('embed-code-snippet');
    if (!copyBtn || !inputEl) return;

    copyBtn.addEventListener('click', function () {
      const code = inputEl.value;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showCopiedState(copyBtn);
        }).catch(() => {
          fallbackCopy(inputEl, copyBtn);
        });
      } else {
        fallbackCopy(inputEl, copyBtn);
      }
    });
  }

  function fallbackCopy(inputEl, btn) {
    inputEl.focus();
    inputEl.select();
    try {
      document.execCommand('copy');
      showCopiedState(btn);
    } catch (err) {
      /* ignore */
    }
  }

  function showCopiedState(btn) {
    const originalText = t('embed.copy_button');
    btn.textContent = t('embed.copied_button');
    btn.classList.add('is-copied');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('is-copied');
    }, 2000);
  }

  // Document bootstrap
  document.addEventListener('DOMContentLoaded', function () {
    initLanguageSelector();
    initSkinSelector();
    initEmbedSnippet();
    applyTranslations();
  });
})();
