/**
 * Phrase-level translation for everything the key-based engine (i18n.js) does not cover:
 * static markup without data-i18n and text the app builds at runtime.
 *
 * public/i18n/<lang>.json maps the exact English text (whitespace collapsed) to its
 * translation. Numbers are matched as a template: "3 clients due" looks up
 * "{0} clients due". Unmatched text stays English. English originals are remembered
 * per node, so switching back and forth never compounds.
 *
 * Regenerate the English phrase list with scripts/studio-crm-integration/crm-phrases.js.
 */
(function () {
  'use strict';

  var ATTRS = ['placeholder', 'title', 'aria-label'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };
  var NUM = /\d+(?:[.,:]\d+)*/g;
  var cache = {};
  var dict = null;
  var lang = 'en';
  var origText = new WeakMap(); // text node -> English
  var lastSet = new WeakMap();  // text node -> value we wrote
  var origAttr = new WeakMap(); // element -> {attr: English}

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

  function lookup(en) {
    if (!dict) return null;
    var k = norm(en);
    if (!k || !/[A-Za-z]/.test(k)) return null;
    if (Object.prototype.hasOwnProperty.call(dict, k)) return dict[k];
    var nums = k.match(NUM);
    var i = 0;
    var tpl = nums ? k.replace(NUM, function () { return '{' + (i++) + '}'; }) : k;
    if (!nums || !Object.prototype.hasOwnProperty.call(dict, tpl)) {
      if (window.__phraseMisses) window.__phraseMisses.add(tpl); // set by the phrase crawler
      return null;
    }
    return dict[tpl].replace(/\{(\d+)\}/g, function (m, n) { return nums[n] !== undefined ? nums[n] : m; });
  }

  function keepSpace(orig, t) {
    var lead = orig.match(/^\s*/)[0], trail = orig.match(/\s*$/)[0];
    return lead + t + trail;
  }

  function skipped(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (SKIP[e.tagName] || e.isContentEditable || e.hasAttribute('data-no-phrase')) return true;
      // Elements owned by the key engine are translated there.
      if (e === el && e.hasAttribute('data-i18n')) return true;
    }
    return false;
  }

  function doText(node) {
    var cur = node.nodeValue;
    if (lastSet.get(node) !== cur) origText.set(node, cur); // new or changed by the app
    var en = origText.get(node);
    var t = lang === 'en' ? null : lookup(en);
    var next = t == null ? en : keepSpace(en, t);
    if (next !== cur) node.nodeValue = next;
    lastSet.set(node, next);
  }

  function doAttrs(el) {
    var o = origAttr.get(el);
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a) || el.hasAttribute('data-i18n-' + (a === 'aria-label' ? 'aria' : a))) continue;
      var cur = el.getAttribute(a);
      if (!o) { o = {}; origAttr.set(el, o); }
      if (o[a] === undefined || (o['_' + a] !== cur)) o[a] = cur;
      var t = lang === 'en' ? null : lookup(o[a]);
      var next = t == null ? o[a] : t;
      if (next !== cur) el.setAttribute(a, next);
      o['_' + a] = next;
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      if (root.parentElement && !skipped(root.parentElement)) doText(root);
      return;
    }
    if (root.nodeType !== 1 || skipped(root)) return;
    doAttrs(root);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return skipped(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = tw.nextNode())) {
      if (n.nodeType === 3) { if (/[A-Za-z]/.test(n.nodeValue) || origText.has(n)) doText(n); }
      else doAttrs(n);
    }
  }

  function translateAll() {
    walk(document.body);
    if (!origText.has(document)) origText.set(document, document.title);
    var en = origText.get(document);
    var t = lang === 'en' ? null : lookup(en);
    document.title = t == null ? en : t;
  }

  function load(l) {
    if (l === 'en') return Promise.resolve(null);
    if (cache[l]) return Promise.resolve(cache[l]);
    return fetch('./i18n/' + l + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (d) { cache[l] = d; return d; });
  }

  var pending = new Set(), scheduled = false;
  var observer = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'childList') m.addedNodes.forEach(function (n) { pending.add(n); });
      else if (m.type === 'characterData') { if (lastSet.get(m.target) !== m.target.nodeValue) pending.add(m.target); }
      else if (m.type === 'attributes') {
        var o = origAttr.get(m.target);
        if (!o || o['_' + m.attributeName] !== m.target.getAttribute(m.attributeName)) pending.add(m.target);
      }
    }
    if (!scheduled && pending.size) {
      scheduled = true;
      queueMicrotask(function () {
        scheduled = false;
        var list = Array.from(pending); pending.clear();
        list.forEach(function (n) { if (n.isConnected) walk(n); });
      });
    }
  });

  function setLang(l) {
    lang = l || 'en';
    return load(lang).then(function (d) {
      if (lang !== (l || 'en')) return; // a newer switch won
      dict = d;
      translateAll();
    });
  }

  // Dialogs: translate the message text when a phrase matches.
  ['alert', 'confirm', 'prompt'].forEach(function (fn) {
    var orig = window[fn];
    if (typeof orig !== 'function') return;
    window[fn] = function (msg) {
      var args = Array.prototype.slice.call(arguments);
      if (typeof msg === 'string' && lang !== 'en') {
        var t = lookup(msg);
        if (t != null) args[0] = t;
      }
      return orig.apply(window, args);
    };
  });

  window.i18nPhrases = { translate: lookup, refresh: translateAll, setLanguage: setLang };

  window.addEventListener('studioLanguageChanged', function (e) { setLang(e.detail && e.detail.language); });

  function start() {
    var l = (window.i18n && window.i18n.getLanguage()) || 'en';
    setLang(l).then(function () {
      observer.observe(document.body, {
        childList: true, subtree: true, characterData: true,
        attributes: true, attributeFilter: ATTRS
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
