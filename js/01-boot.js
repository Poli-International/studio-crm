// Ensure global jsPDF reference alias
    if (window.jspdf && window.jspdf.jsPDF && !window.jsPDF) {
        window.jsPDF = window.jspdf.jsPDF;
    }
    // Suppress ResizeObserver loop errors which are benign browser notifications
    window.addEventListener('error', function(e) {
        if (e && e.message && (
            e.message.indexOf('ResizeObserver loop completed with undelivered notifications') !== -1 ||
            e.message.indexOf('ResizeObserver loop limit exceeded') !== -1
        )) {
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
            return true;
        }
    });
    window.addEventListener('unhandledrejection', function(e) {
        if (e && e.reason && e.reason.message && (
            e.reason.message.indexOf('ResizeObserver loop completed with undelivered notifications') !== -1 ||
            e.reason.message.indexOf('ResizeObserver loop limit exceeded') !== -1
        )) {
            if (e.preventDefault) e.preventDefault();
        }
    });
    // Immediate anti-flicker theme initialization on page load
    (function() {
        try {
            var saved = localStorage.getItem('studio_crm_theme');
            if (!saved) {
                var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                saved = prefersDark ? 'dark' : 'light';
            }
            var isLight = saved === 'light';
            var themeClass = isLight ? 'light-mode' : 'dark-mode';
            var dataTheme = isLight ? 'light' : 'dark';
            document.documentElement.classList.add(themeClass);
            document.documentElement.setAttribute('data-theme', dataTheme);
        } catch (e) {}
    })();

// A double tap on Save sent every form twice: two clients, two bookings. The same form
// sent again with the same content within a moment is dropped before it reaches the form;
// different content (add a person, then edit them in the same form) goes through.
// ponytail: time window, not request tracking; resending the same failed save waits 1.5 s.
document.addEventListener('submit', function (e) {
  var form = e.target, sent = '';
  try { sent = JSON.stringify(Array.from(new FormData(form).entries())) + [].map.call(form.elements, function (f) { return f.value; }).join('|'); } catch (err) {}
  if (form.__sent === sent && Date.now() - form.__sentAt < 1500) { e.preventDefault(); e.stopPropagation(); return; }
  form.__sent = sent;
  form.__sentAt = Date.now();
}, true);

// Screen readers: most fields have a placeholder or a caption in front of them but no
// label tied to them, so they were read out as "edit text". Give each one that name.
function nameUnlabelledField(f) {
  if (!f.matches || !f.matches('input:not([type=hidden]),select,textarea')) return;
  if ((f.labels && f.labels.length) || f.getAttribute('aria-label') || f.getAttribute('aria-labelledby') || f.title) return;
  var prev = f.previousElementSibling;
  var text = (f.placeholder || (prev && /^(LABEL|SPAN|STRONG|B|DIV|P)$/.test(prev.tagName) ? prev.innerText : '') || '').trim();
  if (text) f.setAttribute('aria-label', text.slice(0, 80));
}
document.addEventListener('DOMContentLoaded', function () { document.querySelectorAll('input,select,textarea').forEach(nameUnlabelledField); });
document.addEventListener('focusin', function (e) { nameUnlabelledField(e.target); });

// Opened from another device (http://the-server:3000) the browser gives the page no
// clipboard: every Copy button then failed. Copy the old way instead.
if (!navigator.clipboard) {
  navigator.clipboard = {
    writeText: function (text) {
      return new Promise(function (resolve, reject) {
        var box = document.createElement('textarea');
        box.value = text;
        box.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(box);
        box.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        box.remove();
        if (ok) resolve(); else reject(new Error('copy not allowed'));
      });
    }
  };
}
