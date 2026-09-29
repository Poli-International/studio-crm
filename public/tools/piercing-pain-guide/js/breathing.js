// ═══════════════════════════════════════════════════════════════
// BREATHING.JS - Interactive Procedural Breathing Simulator
// Visual pacer: Inhale 4s, Hold 1s, Exhale 4s
// Framed as educational aid to help maintain calm & steady breathing
// ═══════════════════════════════════════════════════════════════

(function() {
    let breathingInterval = null;
    let isRunning = false;
    let phase = 'ready'; // 'inhale', 'hold', 'exhale'

    document.addEventListener('DOMContentLoaded', function() {
        initBreathingSimulator();
    });

    function initBreathingSimulator() {
        const toggleBtn = document.getElementById('breathingToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                if (isRunning) {
                    stopPacer();
                } else {
                    startPacer();
                }
            });
        }
    }

    function startPacer() {
        isRunning = true;
        const toggleBtn = document.getElementById('breathingToggleBtn');
        if (toggleBtn) {
            toggleBtn.textContent = window.t('breathing.stop_btn');
            toggleBtn.classList.add('breathing-btn--active');
        }

        runCycle();
    }

    function stopPacer() {
        isRunning = false;
        clearTimeout(breathingInterval);

        const toggleBtn = document.getElementById('breathingToggleBtn');
        if (toggleBtn) {
            toggleBtn.textContent = window.t('breathing.start_btn');
            toggleBtn.classList.remove('breathing-btn--active');
        }

        const ring = document.getElementById('breathingSvgRing');
        const text = document.getElementById('breathingPhaseText');
        const cue = document.getElementById('breathingPhaseCue');

        if (ring) {
            ring.style.transition = 'r 0.5s ease-out';
            ring.setAttribute('r', '55');
        }
        if (text) {
            text.textContent = window.t('breathing.state_ready');
        }
        if (cue) {
            cue.textContent = '';
        }
    }

    function runCycle() {
        if (!isRunning) return;

        // Phase 1: Inhale (4s)
        phase = 'inhale';
        updateVisuals('inhale', 4000);

        breathingInterval = setTimeout(function() {
            if (!isRunning) return;

            // Phase 2: Hold (1s)
            phase = 'hold';
            updateVisuals('hold', 1000);

            breathingInterval = setTimeout(function() {
                if (!isRunning) return;

                // Phase 3: Exhale (4s)
                phase = 'exhale';
                updateVisuals('exhale', 4000);

                breathingInterval = setTimeout(function() {
                    if (!isRunning) return;
                    runCycle();
                }, 4000);
            }, 1000);
        }, 4000);
    }

    function updateVisuals(currentPhase, durationMs) {
        const ring = document.getElementById('breathingSvgRing');
        const text = document.getElementById('breathingPhaseText');
        const cue = document.getElementById('breathingPhaseCue');
        const statusBox = document.getElementById('breathingStatusBox');

        const durationSec = durationMs / 1000;

        if (currentPhase === 'inhale') {
            if (ring) {
                ring.style.transition = `r ${durationSec}s cubic-bezier(0.4, 0, 0.2, 1)`;
                ring.setAttribute('r', '92');
            }
            if (text) text.textContent = window.t('breathing.state_inhale');
            if (cue) cue.textContent = window.t('breathing.cue_inhale');
            if (statusBox) statusBox.setAttribute('data-phase', 'inhale');
        } else if (currentPhase === 'hold') {
            if (ring) {
                ring.style.transition = 'none';
            }
            if (text) text.textContent = window.t('breathing.state_hold');
            if (cue) cue.textContent = window.t('breathing.cue_hold');
            if (statusBox) statusBox.setAttribute('data-phase', 'hold');
        } else if (currentPhase === 'exhale') {
            if (ring) {
                ring.style.transition = `r ${durationSec}s cubic-bezier(0.4, 0, 0.2, 1)`;
                ring.setAttribute('r', '55');
            }
            if (text) text.textContent = window.t('breathing.state_exhale');
            if (cue) cue.textContent = window.t('breathing.cue_exhale');
            if (statusBox) statusBox.setAttribute('data-phase', 'exhale');
        }
    }
})();
