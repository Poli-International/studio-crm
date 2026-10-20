// A "Documentation" link at the foot of a tool, in the tool's current language.
// Include with <script src="../shared/doc-link.js" defer></script>; the tool's folder needs
// documentation.html plus documentation-<lang>.html for fr, de, it, es, nl, pt.
// It sits in the page flow (not fixed), so it can never cover one of the tool's buttons.
(function () {
  var LABEL = { en: 'Documentation', fr: 'Documentation', de: 'Dokumentation', it: 'Documentazione', es: 'Documentación', nl: 'Documentatie', pt: 'Documentação' };
  function lang() {
    var l = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase();
    return LABEL[l] ? l : 'en';
  }
  function update(a) {
    var l = lang();
    a.href = l === 'en' ? './documentation.html' : './documentation-' + l + '.html';
    a.textContent = LABEL[l];
    a.setAttribute('hreflang', l);
  }
  function init() {
    var p = document.createElement('p');
    p.className = 'poli-doc-link';
    p.style.cssText = 'text-align:center;margin:24px 0 32px;font-size:14px;';
    var a = document.createElement('a');
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.cssText = 'color:inherit;opacity:.8;text-decoration:underline;text-underline-offset:3px;';
    p.appendChild(a);
    document.body.appendChild(p);
    update(a);
    new MutationObserver(function () { update(a); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
