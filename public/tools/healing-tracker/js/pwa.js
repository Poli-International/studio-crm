// PWA Install UI & Teardown Controller
//
// Service worker registration is disabled per CSP and offline-first client architecture.
// Any worker previously installed in the user's browser is actively unregistered and caches cleared.
// The install button, iOS hint, appinstalled handler, and offline badge remain active.
(function() {
  let deferredPrompt = null;

  function initPWA() {
    // Teardown: ensure any previously installed service worker is unregistered
    // and caches cleared so plain document loading is unaffected.
    // Scoped to this tool: the page is served from poliinternational.com, and an
    // unscoped teardown would unregister every worker and cache on the whole site.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(function(regs) {
          regs.forEach(function(r) { if (r.scope.indexOf('/tools/healing-tracker/') !== -1) r.unregister(); });
        })
        .catch(function() {});
    }

    // Install prompt handler
    const installBtn = document.getElementById('pwaInstallBtn');
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', function() {
        if (!deferredPrompt) {
          alert('To install on iOS Safari: Tap Share -> Add to Home Screen.');
          return;
        }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(choiceResult) {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the PWA install prompt');
          }
          deferredPrompt = null;
          installBtn.style.display = 'none';
        });
      });
    }

    window.addEventListener('appinstalled', function() {
      if (installBtn) installBtn.style.display = 'none';
      deferredPrompt = null;
    });

    // Offline status detection
    function updateOnlineStatus() {
      const offlineBadge = document.getElementById('offlineIndicatorBadge');
      if (offlineBadge) {
        if (!navigator.onLine) {
          offlineBadge.style.display = 'inline-flex';
        } else {
          offlineBadge.style.display = 'none';
        }
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  document.addEventListener('DOMContentLoaded', initPWA);
})();
