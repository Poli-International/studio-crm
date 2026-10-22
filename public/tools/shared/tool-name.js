// On a Thai screen the tool's title is its Thai name with the English name under it, smaller
// (Patrick's ruling of 2026-10-21: staff often know the tools by their English names).
// Usage: <script src="../shared/tool-name.js" data-th="Thai name" data-en="English name" defer></script>
// The title is the first visible h1 (else a visible h2 near the top). The tool's own translator
// rewrites the title on every language switch, so this re-applies after it and gives the title back
// when the page leaves Thai.
(function () {
  var me = document.currentScript;
  var th = me && me.getAttribute('data-th'), en = me && me.getAttribute('data-en');
  if (!th || !en) return;
  var THAI = /[฀-๿]/g;

  function thaiPage() {
    if (/^th\b/i.test(document.documentElement.lang || '')) return true;
    // tools that never set <html lang>: a page mostly written in Thai
    // page text without scripts or styles (an inline dictionary holds Thai on every page)
    var w = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return /^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var count = 0, seen = 0, n;
    while ((n = w.nextNode()) && seen < 6000) { seen += n.nodeValue.length; count += (n.nodeValue.match(THAI) || []).length; }
    return count > 150;
  }
  function visible(e) { var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
  function titleEl() {
    var h1 = [].filter.call(document.querySelectorAll('h1'), visible)[0];
    return h1 || [].filter.call(document.querySelectorAll('h2'), function (e) { return visible(e) && e.getBoundingClientRect().top < 400; })[0];
  }

  function sync() {
    pending = false;
    var h = titleEl();
    if (!h) return;
    var shown = h.getAttribute('data-thai-name') === '1' && h.firstChild && h.firstChild.nodeValue === th;
    if (thaiPage()) {
      if (shown) return;
      if (h.getAttribute('data-thai-name') !== '1') h.setAttribute('data-name-before', h.innerHTML);
      h.setAttribute('data-thai-name', '1');
      h.textContent = th;
      var sub = document.createElement('span');
      sub.lang = 'en';
      sub.textContent = en;
      sub.style.cssText = 'display:block;font-size:0.55em;font-weight:500;opacity:0.75;letter-spacing:0;text-transform:none;margin-top:0.15em;';
      h.appendChild(sub);
    } else if (shown) {
      h.innerHTML = h.getAttribute('data-name-before') || '';
      h.removeAttribute('data-thai-name');
      h.removeAttribute('data-name-before');
    }
  }

  var pending = false;
  function later() { if (!pending) { pending = true; requestAnimationFrame(sync); } }
  function start() {
    sync();
    new MutationObserver(later).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
