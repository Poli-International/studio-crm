// ═══════════════════════════════════════════════════════════════
// KIOSK.JS - Studio Consultation Kiosk Mode Controller
// Fullscreen counter-tablet layout, 90-second idle auto-reset, 1-tap print
// ═══════════════════════════════════════════════════════════════

(function() {
    let kioskActive = false;
    let idleTimer = null;
    const IDLE_TIMEOUT_MS = 90000; // 90 seconds

    document.addEventListener('DOMContentLoaded', function() {
        initKioskMode();
    });

    function initKioskMode() {
        const toggleBtn = document.getElementById('kioskToggleBtn');
        const exitBtn = document.getElementById('kioskExitBtn');
        const resetBtn = document.getElementById('kioskResetBtn');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                enterKioskMode();
            });
        }

        if (exitBtn) {
            exitBtn.addEventListener('click', function() {
                exitKioskMode();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                resetToMap();
            });
        }

        // Global user activity tracking while kiosk is active
        const activityEvents = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
        activityEvents.forEach(function(evt) {
            document.addEventListener(evt, onUserActivity, { passive: true });
        });

        // Listen for ESC key to exit kiosk mode
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && kioskActive) {
                exitKioskMode();
            }
        });
    }

    function enterKioskMode() {
        kioskActive = true;
        document.body.classList.add('kiosk-mode-active');

        const bar = document.getElementById('kioskBar');
        if (bar) bar.hidden = false;

        // Attempt fullscreen if supported
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function() {
                // Fullscreen might be blocked in some iframe environments; class styling covers it
            });
        }

        startIdleTimer();
    }

    function exitKioskMode() {
        kioskActive = false;
        document.body.classList.remove('kiosk-mode-active');

        const bar = document.getElementById('kioskBar');
        if (bar) bar.hidden = true;

        if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen().catch(function() {});
        }

        clearTimeout(idleTimer);
    }

    function onUserActivity() {
        if (!kioskActive) return;
        startIdleTimer();
    }

    function startIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function() {
            if (kioskActive) {
                resetToMap();
            }
        }, IDLE_TIMEOUT_MS);
    }

    function resetToMap() {
        // Reset forms
        const printForm = document.getElementById('printSheetForm');
        if (printForm) printForm.reset();

        const quizForm = document.getElementById('quizForm');
        if (quizForm) quizForm.reset();

        // Close extra sections and return view to map
        const sectionsToHide = ['compareSection', 'quizSection', 'prepareSection', 'anatomySection', 'frictionSection'];
        sectionsToHide.forEach(function(secId) {
            const sec = document.getElementById(secId);
            if (sec) sec.hidden = true;
        });

        const printSheet = document.getElementById('printSheetSection');
        if (printSheet) printSheet.hidden = false;

        // Select default location
        if (window.displayPainInfo) {
            window.displayPainInfo('earlobe');
        }

        // Scroll back to anatomical map
        const mapSec = document.getElementById('mapSection');
        if (mapSec) {
            mapSec.scrollIntoView({ behavior: 'smooth' });
        }

        // Restart idle timer
        startIdleTimer();
    }
})();
