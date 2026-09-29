// ═══════════════════════════════════════════════════════════════
// BODY-MAP.JS - Interactive Inline SVG Body Diagram (V2)
// Clean anatomical vector outlines with keyboard-accessible nodes.
// Zero canvas, zero external bitmaps, zero hardcoded inline hex colors.
// ═══════════════════════════════════════════════════════════════

(function() {
    let currentView = 'front'; // 'front' or 'back'

    document.addEventListener('DOMContentLoaded', function() {
        initializeViewToggle();
        renderBodyMap(currentView);

        window.addEventListener('languageChanged', function() {
            renderBodyMap(currentView);
        });
    });

    function initializeViewToggle() {
        const frontBtn = document.getElementById('frontViewBtn');
        const backBtn = document.getElementById('backViewBtn');
        if (!frontBtn || !backBtn) return;

        frontBtn.addEventListener('click', function() {
            if (currentView === 'front') return;
            currentView = 'front';
            frontBtn.classList.add('view-btn--active');
            backBtn.classList.remove('view-btn--active');
            renderBodyMap('front');
        });

        backBtn.addEventListener('click', function() {
            if (currentView === 'back') return;
            currentView = 'back';
            backBtn.classList.add('view-btn--active');
            frontBtn.classList.remove('view-btn--active');
            renderBodyMap('back');
        });
    }

    function renderBodyMap(view) {
        const container = document.getElementById('bodyMapSvg');
        if (!container) return;

        const isPiercing = (typeof window.currentProcedure === 'string') 
            ? window.currentProcedure === 'piercing' 
            : true;

        if (isPiercing) {
            container.innerHTML = generatePiercingSvg(view);
        } else {
            container.innerHTML = generateTattooSvg(view);
        }

        attachMarkerEvents(container);
    }

    // ═══════════════════════════════════════════════════════════════
    // PIERCING SVG GENERATION
    // ═══════════════════════════════════════════════════════════════
    function generatePiercingSvg(view) {
        const t = window.t || (k => k);

        // Piercing Markers configuration
        const frontPiercingMarkers = [
            { id: 'earlobe', x: 130, y: 145, label: t('piercing.earlobe.name'), pain: '2/10', class: 'minimal' },
            { id: 'helix', x: 125, y: 88, label: t('piercing.helix.name'), pain: '4/10', class: 'moderate' },
            { id: 'conch', x: 140, y: 115, label: t('piercing.conch.name'), pain: '6/10', class: 'moderate' },
            { id: 'daith', x: 160, y: 120, label: t('piercing.daith.name'), pain: '6/10', class: 'moderate' },
            { id: 'industrial', x: 110, y: 68, label: t('piercing.industrial.name'), pain: '7/10', class: 'high' },
            { id: 'nostril', x: 235, y: 118, label: t('piercing.nostril.name'), pain: '4/10', class: 'moderate' },
            { id: 'septum', x: 250, y: 132, label: t('piercing.septum.name'), pain: '3/10', class: 'minimal' },
            { id: 'tongue', x: 250, y: 160, label: t('piercing.tongue.name'), pain: '5/10', class: 'moderate' },
            { id: 'dermal_anchor', x: 310, y: 205, label: t('piercing.dermal_anchor.name'), pain: '5/10', class: 'moderate' },
            { id: 'surface_barbell', x: 190, y: 205, label: t('piercing.surface_barbell.name'), pain: '6/10', class: 'moderate' },
            { id: 'nipple', x: 215, y: 255, label: t('piercing.nipple.name'), pain: '8/10', class: 'high' },
            { id: 'navel', x: 250, y: 345, label: t('piercing.navel.name'), pain: '6/10', class: 'moderate' },
            { id: 'genital', x: 250, y: 415, label: t('piercing.genital.name'), pain: '9/10', class: 'severe' }
        ];

        const backPiercingMarkers = [
            { id: 'surface_barbell', x: 250, y: 175, label: t('piercing.surface_barbell.name_nape'), pain: '6/10', class: 'moderate' },
            { id: 'dermal_anchor', x: 290, y: 210, label: t('piercing.dermal_anchor.name_scapula'), pain: '5/10', class: 'moderate' },
            { id: 'helix', x: 360, y: 100, label: t('piercing.helix.name_posterior'), pain: '4/10', class: 'moderate' },
            { id: 'earlobe', x: 355, y: 155, label: t('piercing.earlobe.name'), pain: '2/10', class: 'minimal' }
        ];

        const markers = view === 'front' ? frontPiercingMarkers : backPiercingMarkers;

        let markersHtml = '';
        markers.forEach(m => {
            const isSelected = (window.selectedLocation === m.id);
            const selectedClass = isSelected ? 'map-marker--selected' : '';
            markersHtml += `
                <g class="map-marker map-marker--${m.class} ${selectedClass}" 
                   data-location="${m.id}" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${m.label}, ${t('map.reported_discomfort', { pain: m.pain })}">
                    <circle cx="${m.x}" cy="${m.y}" r="11" class="marker-pulse" />
                    <circle cx="${m.x}" cy="${m.y}" r="7" class="marker-dot" />
                    <rect x="${m.x + 12}" y="${m.y - 12}" width="125" height="24" rx="4" class="marker-label-bg" />
                    <text x="${m.x + 18}" y="${m.y + 4}" class="marker-label-text">${m.label}</text>
                    <text x="${m.x + 105}" y="${m.y + 4}" class="marker-badge-text">${m.pain}</text>
                </g>
            `;
        });

        return `
            <svg viewBox="0 0 500 520" class="anatomical-svg" aria-label="${t('map.svg_aria_piercing')}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <!-- Anatomical Torso & Head Silhouette -->
                <g class="body-silhouette">
                    ${view === 'front' ? `
                        <!-- Head and Neck -->
                        <path d="M 215 90 C 215 50, 285 50, 285 90 C 285 125, 275 160, 265 170 L 265 185 L 235 185 L 235 170 C 225 160, 215 125, 215 90 Z" class="body-part" />
                        <!-- Ear Outline for Context -->
                        <path d="M 215 85 C 200 80, 195 110, 205 130 C 210 140, 218 142, 222 135" class="body-contour" />
                        <path d="M 285 85 C 300 80, 305 110, 295 130 C 290 140, 282 142, 278 135" class="body-contour" />
                        <!-- Dedicated Enlarged Ear Inset (Left) for Clear Cartilage Pinning -->
                        <g class="ear-inset-group" transform="translate(70, 30)">
                            <rect x="0" y="0" width="110" height="150" rx="8" class="inset-frame" />
                            <text x="10" y="20" class="inset-title">${t('map.ear_placements')}</text>
                            <path d="M 45 40 C 75 25, 85 60, 75 95 C 68 115, 60 135, 45 130 C 35 125, 30 95, 42 75 C 50 60, 52 50, 45 40 Z" class="ear-contour" />
                            <path d="M 52 55 C 65 50, 68 75, 60 88 C 55 95, 48 95, 48 85" class="ear-inner-contour" />
                        </g>
                        <!-- Shoulders and Torso -->
                        <path d="M 235 185 C 190 190, 150 205, 125 240 L 115 340 L 140 340 L 150 260 L 175 260 L 175 390 L 195 440 L 305 440 L 325 390 L 325 260 L 350 260 L 360 340 L 385 340 L 375 240 C 350 205, 310 190, 265 185 Z" class="body-part" />
                        <!-- Legs Upper -->
                        <path d="M 195 440 L 185 505 L 235 505 L 245 450 L 255 450 L 265 505 L 315 505 L 305 440 Z" class="body-part" />
                        <!-- Contours -->
                        <line x1="205" y1="205" x2="245" y2="215" class="body-contour" />
                        <line x1="295" y1="205" x2="255" y2="215" class="body-contour" />
                        <circle cx="250" cy="345" r="4" class="body-contour" />
                    ` : `
                        <!-- Back Silhouette -->
                        <path d="M 215 90 C 215 50, 285 50, 285 90 C 285 130, 275 165, 265 175 L 265 185 L 235 185 L 235 175 C 225 165, 215 130, 215 90 Z" class="body-part" />
                        <path d="M 235 185 C 190 190, 150 205, 125 240 L 115 340 L 140 340 L 150 260 L 175 260 L 175 390 L 195 440 L 305 440 L 325 390 L 325 260 L 350 260 L 360 340 L 385 340 L 375 240 C 350 205, 310 190, 265 185 Z" class="body-part" />
                        <!-- Spine and Scapula Contours -->
                        <line x1="250" y1="185" x2="250" y2="430" class="body-contour body-contour--dashed" />
                        <path d="M 210 220 C 230 225, 235 255, 220 270" class="body-contour" />
                        <path d="M 290 220 C 270 225, 265 255, 280 270" class="body-contour" />
                        <!-- Legs Upper Back -->
                        <path d="M 195 440 L 185 505 L 235 505 L 245 450 L 255 450 L 265 505 L 315 505 L 305 440 Z" class="body-part" />
                    `}
                </g>

                <!-- Interactive Marker Nodes -->
                <g class="markers-layer">
                    ${markersHtml}
                </g>
            </svg>
        `;
    }

    // ═══════════════════════════════════════════════════════════════
    // TATTOO SVG GENERATION (Comparative Benchmark)
    // ═══════════════════════════════════════════════════════════════
    function generateTattooSvg(view) {
        const t = window.t || (k => k);
        const frontTattooMarkers = [
            { id: 'outer_shoulder', x: 140, y: 205, label: t('tattoo.outer_shoulder.name'), pain: '2/10', class: 'minimal' },
            { id: 'outer_upper_arm', x: 125, y: 245, label: t('tattoo.outer_upper_arm.name'), pain: '2/10', class: 'minimal' },
            { id: 'outer_forearm', x: 110, y: 310, label: t('tattoo.outer_forearm.name'), pain: '2/10', class: 'minimal' },
            { id: 'inner_forearm', x: 380, y: 310, label: t('tattoo.inner_forearm.name'), pain: '5/10', class: 'moderate' },
            { id: 'chest', x: 250, y: 225, label: t('tattoo.chest.name'), pain: '6/10', class: 'moderate' },
            { id: 'ribs', x: 195, y: 295, label: t('tattoo.ribs.name'), pain: '8/10', class: 'high' },
            { id: 'outer_thigh', x: 205, y: 460, label: t('tattoo.outer_thigh.name'), pain: '3/10', class: 'minimal' },
            { id: 'knee', x: 295, y: 495, label: t('tattoo.knee.name'), pain: '7/10', class: 'high' }
        ];

        const backTattooMarkers = [
            { id: 'upper_back', x: 250, y: 235, label: t('tattoo.upper_back.name'), pain: '4/10', class: 'moderate' },
            { id: 'spine', x: 250, y: 310, label: t('tattoo.spine.name'), pain: '9/10', class: 'severe' },
            { id: 'outer_shoulder', x: 140, y: 205, label: t('tattoo.outer_shoulder.name'), pain: '2/10', class: 'minimal' },
            { id: 'outer_calf', x: 295, y: 480, label: t('tattoo.outer_calf.name'), pain: '3/10', class: 'minimal' }
        ];

        const markers = view === 'front' ? frontTattooMarkers : backTattooMarkers;

        let markersHtml = '';
        markers.forEach(m => {
            const isSelected = (window.selectedLocation === m.id);
            const selectedClass = isSelected ? 'map-marker--selected' : '';
            markersHtml += `
                <g class="map-marker map-marker--${m.class} ${selectedClass}" 
                   data-location="${m.id}" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${m.label}, ${t('map.reported_discomfort', { pain: m.pain })}">
                    <circle cx="${m.x}" cy="${m.y}" r="11" class="marker-pulse" />
                    <circle cx="${m.x}" cy="${m.y}" r="7" class="marker-dot" />
                    <rect x="${m.x + 12}" y="${m.y - 12}" width="125" height="24" rx="4" class="marker-label-bg" />
                    <text x="${m.x + 18}" y="${m.y + 4}" class="marker-label-text">${m.label}</text>
                    <text x="${m.x + 105}" y="${m.y + 4}" class="marker-badge-text">${m.pain}</text>
                </g>
            `;
        });

        return `
            <svg viewBox="0 0 500 520" class="anatomical-svg" aria-label="${t('map.svg_aria_tattoo')}" xmlns="http://www.w3.org/2000/svg">
                <!-- Silhouette Base -->
                <g class="body-silhouette">
                    <path d="M 215 90 C 215 50, 285 50, 285 90 C 285 125, 275 160, 265 170 L 265 185 L 235 185 L 235 170 C 225 160, 215 125, 215 90 Z" class="body-part" />
                    <path d="M 235 185 C 190 190, 150 205, 125 240 L 115 340 L 140 340 L 150 260 L 175 260 L 175 390 L 195 440 L 305 440 L 325 390 L 325 260 L 350 260 L 360 340 L 385 340 L 375 240 C 350 205, 310 190, 265 185 Z" class="body-part" />
                    <path d="M 195 440 L 185 510 L 235 510 L 245 450 L 255 450 L 265 510 L 315 510 L 305 440 Z" class="body-part" />
                </g>
                <g class="markers-layer">
                    ${markersHtml}
                </g>
            </svg>
        `;
    }

    function attachMarkerEvents(container) {
        const markers = container.querySelectorAll('.map-marker');
        markers.forEach(marker => {
            const locId = marker.getAttribute('data-location');
            if (!locId) return;

            const handleSelect = () => {
                // Update active marker styling
                markers.forEach(m => m.classList.remove('map-marker--selected'));
                marker.classList.add('map-marker--selected');

                if (typeof window.displayPainInfo === 'function') {
                    window.displayPainInfo(locId);
                }
            };

            marker.addEventListener('click', handleSelect);
            marker.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect();
                }
            });
        });
    }

    window.updateBodyMap = function(procedureType) {
        renderBodyMap(currentView);
    };

    window.refreshBodyMapSelection = function(selectedId) {
        const container = document.getElementById('bodyMapSvg');
        if (!container) return;
        const markers = container.querySelectorAll('.map-marker');
        markers.forEach(m => {
            if (m.getAttribute('data-location') === selectedId) {
                m.classList.add('map-marker--selected');
            } else {
                m.classList.remove('map-marker--selected');
            }
        });
    };
})();
