/**
 * PoliShare - shareable result cards for Poli International tools.
 *
 * Shared by the share-enabled static tool apps (visual plan §A9). Each app
 * calls PoliShare.init() with three hooks:
 *   getState()        -> plain object of the current result state, or null
 *                        when there is nothing to share yet
 *   applyState(state) -> restore the app to that state (fill fields, rerun)
 *   getCard()         -> { t: headline, d: [[label, value], ...] } for the
 *                        1200x630 result card, or null
 *
 * A shared result travels as /share/<tool>/?r=<base64url JSON>. The Next.js
 * share route serves the OG card to scrapers and forwards humans back to the
 * tool page with ?r= intact; the tool page passes the query into this iframe,
 * where restore() picks it up.
 */
(function () {
  'use strict';

  var ORIGIN =
    window.location.origin && window.location.origin.indexOf('http') === 0
      ? window.location.origin
      : '';

  // -- base64url helpers (unicode-safe) --

  function encodePayload(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodePayload(r) {
    try {
      var b64 = r.replace(/-/g, '+').replace(/_/g, '/');
      var bin = atob(b64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
      return null;
    }
  }

  // -- string escaping helper --

  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (typeof window !== 'undefined' && !window.esc) {
    window.esc = esc;
  }

  // -- styles, injected once --

  var CSS =
    '.poli-share{margin:1.5rem 0 0;padding:1rem 1.25rem;border:1px solid rgba(6,147,227,.4);' +
    'border-radius:12px;background:rgba(6,147,227,.07);font-family:inherit}' +
    '.poli-share__title{font-weight:800;font-size:.95rem;margin:0 0 .25rem;letter-spacing:.02em}' +
    '.poli-share__hint{font-size:.8rem;opacity:.75;margin:0 0 .75rem}' +
    '.poli-share__row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}' +
    '.poli-share__btn{padding:.55rem 1.1rem;border-radius:8px;font-weight:700;font-size:.85rem;' +
    'cursor:pointer;border:1px solid #0693e3;background:transparent;color:inherit;line-height:1.2}' +
    '.poli-share__btn--primary{background:#0693e3;border-color:#0693e3;color:#fff}' +
    '.poli-share__btn:hover{filter:brightness(1.15)}' +
    '.poli-share__status{font-size:.8rem;font-weight:700;color:#0693e3;min-height:1em;margin:.5rem 0 0}';

  function injectStyles() {
    if (document.getElementById('poli-share-css')) return;
    var s = document.createElement('style');
    s.id = 'poli-share-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // -- URL builders --

  function buildShareUrl(tool, payload) {
    return ORIGIN + '/share/' + tool + '/?r=' + encodeURIComponent(encodePayload(payload));
  }

  function buildCardUrl(tool, card) {
    var qs = 't=' + encodeURIComponent(card.t);
    (card.d || []).forEach(function (pair) {
      qs += '&d=' + encodeURIComponent(pair[0] + '|' + pair[1]);
    });
    return ORIGIN + '/share/' + tool + '/card/?' + qs;
  }

  // -- clipboard with fallback --

  function copyText(text, done) {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text);
        done();
      });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      /* last resort exhausted */
    }
    document.body.removeChild(ta);
  }

  function init(cfg) {
    injectStyles();

    var mount = document.querySelector(cfg.mount);
    if (!mount) return;

    var titleTxt = window.t ? window.t('share.title') : 'Share your result';
    var hintTxt = window.t ? window.t('share.hint') : 'Creates a personal link and picture card for this exact result.';

    var bar = document.createElement('div');
    bar.className = 'poli-share';
    bar.innerHTML =
      '<p class="poli-share__title">' + esc(titleTxt) + '</p>' +
      '<p class="poli-share__hint">' + esc(hintTxt) + '</p>' +
      '<div class="poli-share__row"></div>' +
      '<p class="poli-share__status" role="status"></p>';
    var row = bar.querySelector('.poli-share__row');
    var status = bar.querySelector('.poli-share__status');
    mount.insertAdjacentElement('afterend', bar);

    function setStatus(msg) {
      status.textContent = msg;
      if (msg) {
        setTimeout(function () {
          if (status.textContent === msg) status.textContent = '';
        }, 4000);
      }
    }

    function currentPayload() {
      var state = cfg.getState();
      var card = cfg.getCard();
      if (!state || !card) {
        setStatus(window.t ? window.t('share.need_calc') : 'Fill in the tool and calculate first, then share.');
        return null;
      }
      return {
        payload: {
          v: 1,
          t: card.t,
          d: (card.d || []).map(function (p) { return p[0] + '|' + p[1]; }),
          s: state,
        },
        card: card,
      };
    }

    function addButton(label, primary, onClick) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'poli-share__btn' + (primary ? ' poli-share__btn--primary' : '');
      b.textContent = label;
      b.addEventListener('click', onClick);
      row.appendChild(b);
      return b;
    }

    var hasShare = typeof navigator !== 'undefined' && !!navigator.share;
    if (hasShare) {
      var shareBtnTxt = window.t ? window.t('share.btn_share') : 'Share';
      addButton(shareBtnTxt, true, function () {
        var p = currentPayload();
        if (!p) return;
        navigator
          .share({ title: p.card.t, url: buildShareUrl(cfg.tool, p.payload) })
          .catch(function () { /* user dismissed the sheet */ });
      });
    }

    var copyBtnTxt = window.t ? window.t('share.btn_copy') : 'Copy link';
    addButton(copyBtnTxt, !hasShare, function () {
      var p = currentPayload();
      if (!p) return;
      copyText(buildShareUrl(cfg.tool, p.payload), function () {
        setStatus(window.t ? window.t('share.copied') : 'Link copied. Anyone who opens it sees this exact result.');
      });
    });

    var downloadBtnTxt = window.t ? window.t('share.btn_download') : 'Download card';
    addButton(downloadBtnTxt, false, function () {
      var p = currentPayload();
      if (!p) return;
      setStatus(window.t ? window.t('share.building') : 'Building your card…');
      fetch(buildCardUrl(cfg.tool, p.card))
        .then(function (res) {
          if (!res.ok) throw new Error('card ' + res.status);
          return res.blob();
        })
        .then(function (blob) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'poli-' + cfg.tool + '-result.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
          setStatus(window.t ? window.t('share.downloaded') : 'Card downloaded.');
        })
        .catch(function () {
          setStatus(window.t ? window.t('share.error') : 'Could not build the card right now. Copy the link instead.');
        });
    });

    // Restore a shared result from ?r=
    var m = window.location.search.match(/[?&]r=([^&]+)/);
    if (m) {
      var payload = decodePayload(decodeURIComponent(m[1]));
      if (payload && payload.s && typeof cfg.applyState === 'function') {
        // Give the host app's own DOMContentLoaded handlers time to wire up.
        setTimeout(function () {
          try {
            cfg.applyState(payload.s);
          } catch (e) {
            /* a malformed payload must never break the tool itself */
          }
        }, 80);
      }
    }
  }

  window.PoliShare = { init: init };
})();
