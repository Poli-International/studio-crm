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
