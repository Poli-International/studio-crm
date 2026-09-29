/**
 * Poli International - Piercing Angle Visualizer & CAD Engine
 * Dedicated module for interactive SVG rendering, 3D jewelry geometry,
 * cross-sectional tissue vector diagrams, and bilateral symmetry calipers.
 * Standards: ASTM F-136, ASTM F-138, ASTM F-67, BioFlex® body jewelry.
 */

(function (window) {
  'use strict';

  var piercingData = (typeof window !== 'undefined' && window.PIERCING_DATA) || {};
  var jewelryOptions = (typeof window !== 'undefined' && window.PIERCING_JEWELRY_OPTIONS) || {};

  // Active jewelry option selector
  // Translate a fixed English UI string by its generated key; English when missing.
  function ui(en, params) {
    var key = 'ui.' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 48);
    var out = window.translate ? window.translate(key, params, en) : en;
    if (out === key) out = en;
    return params ? String(out).replace(/\{([a-zA-Z0-9_]+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(params, k) ? params[k] : m; }) : out;
  }

  function getActiveJewelryOption(piercingKey, selectedId) {
    var options = jewelryOptions[piercingKey] || [];
    if (!options || options.length === 0) return null;
    if (selectedId) {
      for (var i = 0; i < options.length; i++) {
        if (options[i].id === selectedId) return options[i];
      }
    }
    // Return standard initial jewelry
    for (var j = 0; j < options.length; j++) {
      if (options[j].isInitialStandard) return options[j];
    }
    return options[0];
  }

  // Renders the 3D jewelry CAD diagram
  function renderJewelry3D(data, selectedOption) {
    var opt = selectedOption || getActiveJewelryOption(data.key || 'earlobe');
    var cat = (opt && opt.category) ? opt.category : 'labret';

    var svgContent = '';
    if (cat === 'labret') {
      svgContent = `
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="50%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>
          <linearGradient id="discGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#CBD5E1" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>
        <!-- Flat Back Disc Base -->
        <rect x="40" y="85" width="16" height="70" rx="3" fill="url(#discGrad)" stroke="#334155" stroke-width="1.5" />
        <line x1="48" y1="88" x2="48" y2="152" stroke="#F8FAFC" stroke-width="1" stroke-opacity="0.6" />
        <!-- Straight Post -->
        <rect x="56" y="112" width="140" height="16" rx="2" fill="url(#metalGrad)" stroke="#334155" stroke-width="1.5" />
        <line x1="56" y1="117" x2="196" y2="117" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.8" />
        <!-- Front Decorative Top/Ball -->
        <circle cx="210" cy="120" r="22" fill="url(#metalGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="202" cy="112" r="6" fill="#FFFFFF" fill-opacity="0.7" />
        <!-- Dimension Labels -->
        <text x="126" y="102" fill="var(--text-muted, #94A3B8)" font-size="11" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.wearable_post_length', null, 'Wearable Post Length') : 'Wearable Post Length'}</text>
        <line x1="56" y1="106" x2="196" y2="106" stroke="var(--primary, #8B5CF6)" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="56" cy="106" r="2.5" fill="var(--primary, #8B5CF6)" />
        <circle cx="196" cy="106" r="2.5" fill="var(--primary, #8B5CF6)" />
        <text x="48" y="174" fill="var(--text-muted, #94A3B8)" font-size="10" text-anchor="middle">${window.translate ? window.translate('jewelry.cad.flat_disc_base', null, 'Flat Disc Base') : 'Flat Disc Base'}</text>
      `;
    } else if (cat === 'circular') {
      // Circular Barbell (Horseshoe) Shape with open gap and dual spherical threaded beads
      svgContent = `
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="40%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
          <linearGradient id="beadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F1F5F9" />
            <stop offset="50%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>
        <!-- Horseshoe Open Ring Arc -->
        <path d="M 85,152 A 64,64 0 1,1 195,152" fill="none" stroke="url(#ringGrad)" stroke-width="16" stroke-linecap="round" />
        <!-- Left Spherical Threaded Bead -->
        <circle cx="85" cy="152" r="19" fill="url(#beadGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="79" cy="146" r="4.5" fill="#FFFFFF" fill-opacity="0.85" />
        <!-- Right Spherical Threaded Bead -->
        <circle cx="195" cy="152" r="19" fill="url(#beadGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="189" cy="146" r="4.5" fill="#FFFFFF" fill-opacity="0.85" />
        <!-- Inner Diameter Dimension Callout -->
        <text x="140" y="98" fill="var(--text-muted, #94A3B8)" font-size="11" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.inner_diameter', null, 'Inner Diameter (Ø)') : 'Inner Diameter (Ø)'}</text>
        <line x1="92" y1="110" x2="188" y2="110" stroke="var(--primary, #8B5CF6)" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="92" cy="110" r="2.5" fill="var(--primary, #8B5CF6)" />
        <circle cx="188" cy="110" r="2.5" fill="var(--primary, #8B5CF6)" />
        <!-- Horseshoe Opening Gap Callout -->
        <line x1="85" y1="184" x2="195" y2="184" stroke="var(--primary, #8B5CF6)" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="85" cy="184" r="2.5" fill="var(--primary, #8B5CF6)" />
        <circle cx="195" cy="184" r="2.5" fill="var(--primary, #8B5CF6)" />
        <text x="140" y="200" fill="var(--text-muted, #94A3B8)" font-size="10" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.horseshoe_clearance_gap', null, 'Horseshoe Clearance Gap') : 'Horseshoe Clearance Gap'}</text>
      `;
    } else if (cat === 'curved-stud' || cat === 'nostril-screw' || cat === 'stud') {
      // Curved Nose Stud (Nostril Screw) with gem bezel, straight wearable stem & curved hook
      svgContent = `
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="50%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>
          <radialGradient id="gemGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#BAE6FD" />
            <stop offset="50%" stop-color="#0284C7" />
            <stop offset="100%" stop-color="#0369A1" />
          </radialGradient>
        </defs>
        <!-- Front Decorative Prong/Bezel Gem Top -->
        <circle cx="48" cy="98" r="18" fill="url(#metalGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="48" cy="98" r="12" fill="url(#gemGrad)" stroke="#0284C7" stroke-width="1" />
        <circle cx="44" cy="94" r="3.5" fill="#FFFFFF" fill-opacity="0.9" />
        <!-- Straight Wearable Stem -->
        <rect x="66" y="90" width="76" height="15" rx="2" fill="url(#metalGrad)" stroke="#334155" stroke-width="1.5" />
        <line x1="66" y1="95" x2="142" y2="95" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.8" />
        <!-- Curved Mucosal Retention Hook / Pigtail Loop -->
        <path d="M 142,97 Q 192,97 192,138 Q 192,176 150,176 Q 118,176 118,154" fill="none" stroke="url(#metalGrad)" stroke-width="14" stroke-linecap="round" />
        <!-- Dimension Callouts -->
        <text x="104" y="77" fill="var(--text-muted, #94A3B8)" font-size="10" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.wearable_stem', null, 'Wearable Stem Length') : 'Wearable Stem Length'}</text>
        <line x1="66" y1="82" x2="142" y2="82" stroke="var(--primary, #8B5CF6)" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="66" cy="82" r="2.5" fill="var(--primary, #8B5CF6)" />
        <circle cx="142" cy="82" r="2.5" fill="var(--primary, #8B5CF6)" />
        <text x="156" y="200" fill="var(--text-muted, #94A3B8)" font-size="10" text-anchor="middle">${window.translate ? window.translate('jewelry.cad.curved_retention_tail', null, 'Curved Retention Tail') : 'Curved Retention Tail'}</text>
      `;
    } else if (cat === 'straight') {
      // Straight Barbell with dual threaded beads
      svgContent = `
        <defs>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="50%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>
        </defs>
        <!-- Straight Wearable Shaft -->
        <rect x="55" y="112" width="170" height="16" rx="2" fill="url(#barGrad)" stroke="#334155" stroke-width="1.5" />
        <line x1="55" y1="117" x2="225" y2="117" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.8" />
        <!-- Left Spherical Bead -->
        <circle cx="55" cy="120" r="20" fill="url(#barGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="49" cy="114" r="5" fill="#FFFFFF" fill-opacity="0.8" />
        <!-- Right Spherical Bead -->
        <circle cx="225" cy="120" r="20" fill="url(#barGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="219" cy="114" r="5" fill="#FFFFFF" fill-opacity="0.8" />
        <!-- Labels -->
        <text x="140" y="100" fill="var(--text-muted, #94A3B8)" font-size="11" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.wearable_post_length', null, 'Wearable Post Length') : 'Wearable Post Length'}</text>
        <line x1="55" y1="106" x2="225" y2="106" stroke="var(--primary, #8B5CF6)" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="55" cy="106" r="2.5" fill="var(--primary, #8B5CF6)" />
        <circle cx="225" cy="106" r="2.5" fill="var(--primary, #8B5CF6)" />
      `;
    } else if (cat === 'cbr' || cat === 'clicker') {
      svgContent = `
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="40%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>
        <!-- Ring Arc -->
        <circle cx="140" cy="120" r="64" fill="none" stroke="url(#ringGrad)" stroke-width="16" stroke-linecap="round" />
        <!-- Captive Bead / Ball -->
        <circle cx="140" cy="56" r="20" fill="url(#ringGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="134" cy="50" r="5" fill="#FFFFFF" fill-opacity="0.8" />
        <!-- Dimension Callout -->
        <text x="140" y="124" fill="var(--text-muted, #94A3B8)" font-size="11" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.inner_diameter', null, 'Inner Diameter (Ø)') : 'Inner Diameter (Ø)'}</text>
        <line x1="90" y1="120" x2="190" y2="120" stroke="var(--primary, #8B5CF6)" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="90" cy="120" r="2.5" fill="var(--primary, #8B5CF6)" />
        <circle cx="190" cy="120" r="2.5" fill="var(--primary, #8B5CF6)" />
      `;
    } else if (cat === 'curved') {
      svgContent = `
        <defs>
          <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="50%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>
        </defs>
        <!-- Curved Shaft -->
        <path d="M 65,85 Q 140,155 215,85" fill="none" stroke="url(#curveGrad)" stroke-width="16" stroke-linecap="round" />
        <!-- Top Small Ball -->
        <circle cx="65" cy="85" r="16" fill="url(#curveGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="60" cy="80" r="4" fill="#FFFFFF" fill-opacity="0.8" />
        <!-- Bottom Large Ball / Navel Gem -->
        <circle cx="215" cy="85" r="22" fill="url(#curveGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="209" cy="78" r="6" fill="#FFFFFF" fill-opacity="0.8" />
        <!-- Dimension Callout -->
        <text x="140" y="170" fill="var(--text-muted, #94A3B8)" font-size="11" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.arc_radius_rise', null, 'Arc Radius & Rise') : 'Arc Radius & Rise'}</text>
      `;
    } else if (cat === 'surface') {
      svgContent = `
        <defs>
          <linearGradient id="surfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#CBD5E1" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>
        <!-- Flat Base Bar -->
        <rect x="50" y="140" width="180" height="14" rx="2" fill="url(#surfaceGrad)" stroke="#334155" stroke-width="1.5" />
        <!-- Left 90° Vertical Rise -->
        <rect x="70" y="80" width="14" height="60" rx="2" fill="url(#surfaceGrad)" stroke="#334155" stroke-width="1.5" />
        <!-- Right 90° Vertical Rise -->
        <rect x="196" y="80" width="14" height="60" rx="2" fill="url(#surfaceGrad)" stroke="#334155" stroke-width="1.5" />
        <!-- Top Flat Discs -->
        <rect x="57" y="66" width="40" height="14" rx="3" fill="#94A3B8" stroke="#334155" stroke-width="1.5" />
        <rect x="183" y="66" width="40" height="14" rx="3" fill="#94A3B8" stroke="#334155" stroke-width="1.5" />
        <!-- Angle Marker -->
        <text x="140" y="175" fill="var(--text-muted, #94A3B8)" font-size="11" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.rigid_subdermal_rise', null, 'Rigid 90° Subdermal Rise') : 'Rigid 90° Subdermal Rise'}</text>
      `;
    } else {
      // Straight barbell default
      svgContent = `
        <defs>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="50%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>
        </defs>
        <!-- Straight Bar -->
        <rect x="55" y="112" width="170" height="16" rx="2" fill="url(#barGrad)" stroke="#334155" stroke-width="1.5" />
        <!-- Left Ball -->
        <circle cx="55" cy="120" r="20" fill="url(#barGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="49" cy="114" r="5" fill="#FFFFFF" fill-opacity="0.8" />
        <!-- Right Ball -->
        <circle cx="225" cy="120" r="20" fill="url(#barGrad)" stroke="#334155" stroke-width="1.5" />
        <circle cx="219" cy="114" r="5" fill="#FFFFFF" fill-opacity="0.8" />
        <!-- Labels -->
        <text x="140" y="102" fill="var(--text-muted, #94A3B8)" font-size="11" text-anchor="middle" font-weight="600">${window.translate ? window.translate('jewelry.cad.wearable_shaft_length', null, 'Wearable Shaft Length') : 'Wearable Shaft Length'}</text>
        <line x1="55" y1="106" x2="225" y2="106" stroke="var(--primary, #8B5CF6)" stroke-width="1.5" stroke-dasharray="3,3" />
      `;
    }

    return `
      <svg viewBox="0 0 280 220" class="v2-jewelry-cad-svg" style="width:100%; height:auto; display:block;" aria-label="3D Jewelry CAD Diagram">
        ${svgContent}
      </svg>
    `;
  }

  // Calculate live channel metrics
  function calculateChannelMetrics(piercingKey, measuredThickness, angleDeg) {
    var data = piercingData[piercingKey] || piercingData['earlobe'];
    var thickness = parseFloat(measuredThickness) || 5.0;
    var angle = parseFloat(angleDeg) || 90.0;
    var dev = Math.abs(angle - 90.0);

    // Channel length = thickness / sin(radians(angle))
    var rad = (angle * Math.PI) / 180.0;
    var effectiveSin = Math.max(0.2, Math.sin(rad));
    var channelDepth = (thickness / effectiveSin).toFixed(1);


    return {
      measuredThickness: thickness.toFixed(1),
      channelDepth: channelDepth,
      deviation: dev.toFixed(1)
    };
  }

  // -------------------------------------------------------------
  // Interactive angle cross-section (360 x 300 viewBox, pivot 180,140).
  // Geometry only: the channel length is thickness / sin(angle). The discs
  // sit on the skin at the entry and exit points, square to the bar, so a
  // tilt shows one edge pressing in and the other lifting. No pressure or
  // stress figures: none can be computed from an angle alone.
  // Shapes, not colour, carry meaning (solid = straight, dashed = tilted,
  // triangle = edge pressing in, open bracket = edge lifting).
  // -------------------------------------------------------------
  function renderV2InteractiveSvg(piercingKey, angleDeg, measuredThickness, selectedOption, isPrintMode) {
    var tr = function (key, params, fallback) {
      if (!window.translate) return fallback;
      var v = window.translate(key, params, fallback);
      return (v === key) ? fallback : v;
    };
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

    var angle = parseFloat(angleDeg) || 90.0;
    var dev = Math.round(angle - 90.0);
    var absDev = Math.abs(dev);
    var thickness = parseFloat(measuredThickness) || 5.0;
    var isOptimal = (absDev === 0);
    var isWarning = (absDev > 0 && absDev <= 5);

    var statusColor = isPrintMode
      ? '#000000'
      : (isOptimal ? 'var(--success-green, #047857)' : (isWarning ? 'var(--warning-yellow, #B45309)' : 'var(--error-red, #B91C1C)'));
    var tissueOutline = isPrintMode ? '#111111' : 'var(--border-secondary, #475569)';
    var textDark = isPrintMode ? '#000000' : 'var(--text-primary, #1E293B)';
    var textMuted = isPrintMode ? '#333333' : 'var(--text-secondary, #475569)';
    var cardBg = isPrintMode ? '#FFFFFF' : 'var(--bg-card, #1E293B)';
    var planeColor = isPrintMode ? '#000000' : 'var(--primary-color, #7C3AED)';

    var centerX = 180, centerY = 140, yAnt = 85, yPost = 195;
    var rad = (angle * Math.PI) / 180.0;
    var tanRad = Math.tan(rad);
    var entryX = Math.abs(tanRad) > 0.001 ? centerX - (centerY - yAnt) / tanRad : centerX;
    var exitX = Math.abs(tanRad) > 0.001 ? centerX + (yPost - centerY) / tanRad : centerX;

    var channelDepthMm = (thickness / Math.sin(rad)).toFixed(1);
    var channelElongation = (channelDepthMm - thickness).toFixed(1);

    // Channel corridor and discs, both square to the bar
    var cHalfW = 7;
    var cDx = cHalfW * Math.cos(rad + Math.PI / 2);
    var cDy = cHalfW * Math.sin(rad + Math.PI / 2);
    var discHalf = 21;
    var pDx = discHalf * Math.cos(rad + Math.PI / 2);
    var pDy = discHalf * Math.sin(rad + Math.PI / 2);

    // Front disc: the end below the entry surface presses in, the other lifts.
    var topA = { x: entryX - pDx, y: yAnt - pDy }, topB = { x: entryX + pDx, y: yAnt + pDy };
    var topIn = topA.y > topB.y ? topA : topB, topOut = topA.y > topB.y ? topB : topA;
    // Back disc: the end above the exit surface presses in.
    var botA = { x: exitX - pDx, y: yPost - pDy }, botB = { x: exitX + pDx, y: yPost + pDy };
    var botIn = botA.y < botB.y ? botA : botB, botOut = botA.y < botB.y ? botB : botA;

    var hatchId = 'hatch_' + Math.floor(Math.random() * 100000);
    var tissuePatId = 'tiss_' + Math.floor(Math.random() * 100000);

    var badgeText = isOptimal
      ? tr('visualizer.badge_optimal', null, '✔ ANGLE: 90° (PERP)')
      : tr('visualizer.badge_tilted', { angle: angle, sign: dev > 0 ? '+' : '-', dev: absDev }, '⚠ ANGLE: ' + angle + '° (' + (dev > 0 ? '+' : '') + dev + '°)');
    var channelText = isOptimal
      ? tr('visualizer.channel_straight', { depth: channelDepthMm }, '✔ CHANNEL: ' + channelDepthMm + ' mm, straight through')
      : tr('visualizer.channel_tilted', { depth: channelDepthMm, elong: channelElongation }, '⚠ CHANNEL: ' + channelDepthMm + ' mm (+' + channelElongation + ' mm longer than the tissue)');
    var discText = isOptimal
      ? tr('visualizer.discs_flat', null, 'Both discs sit flat on the skin')
      : tr('visualizer.discs_tilted_legend', null, '▼ disc edge presses into the skin    ○ disc edge lifts off');

    // Marks sit outside the disc so they never hide under it: a triangle on the
    // surface where an edge presses in, an open circle where an edge lifts.
    var markColor = isPrintMode ? '#000000' : 'var(--text-primary, #F8FAFC)';
    var pressMark = function (p, surfaceY, fromAbove) {
      var tip = fromAbove ? surfaceY - 2 : surfaceY + 2, base = fromAbove ? surfaceY - 11 : surfaceY + 11;
      return '<polygon points="' + (p.x - 5) + ',' + base + ' ' + (p.x + 5) + ',' + base + ' ' + p.x + ',' + tip + '" fill="' + markColor + '" stroke="' + cardBg + '" stroke-width="1" />';
    };
    var liftMark = function (p) {
      return '<circle cx="' + p.x + '" cy="' + p.y + '" r="4.5" fill="none" stroke="' + markColor + '" stroke-width="1.8" />';
    };

    return `
      <svg viewBox="0 0 360 300" class="v2-angle-interactive-svg" style="width:100%; height:auto; display:block;" role="img" aria-label="${esc(tr('visualizer.cross_section_aria', null, 'Cross-section of the tissue showing the channel angle and depth'))}">
        <defs>
          <pattern id="${hatchId}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="${statusColor}" stroke-width="2" />
          </pattern>
          <pattern id="${tissuePatId}" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.8" fill="${textMuted}" opacity="0.25" />
          </pattern>
        </defs>

        <!-- Angle badge -->
        <rect x="196" y="6" width="152" height="26" rx="5" fill="${cardBg}" stroke="${statusColor}" stroke-width="1.5" />
        <text x="272" y="23.5" fill="${statusColor}" font-size="11" font-weight="800" text-anchor="middle">${esc(badgeText)}</text>

        <!-- Tissue block and its two surfaces -->
        <rect x="35" y="${yAnt}" width="290" height="110" rx="4" fill="${isPrintMode ? '#FFFFFF' : 'var(--bg-secondary, #1E293B)'}" stroke="${tissueOutline}" stroke-width="1.5" />
        <rect x="35" y="${yAnt}" width="290" height="110" rx="4" fill="url(#${tissuePatId})" />
        <line x1="35" y1="${yAnt}" x2="325" y2="${yAnt}" stroke="${planeColor}" stroke-width="2" stroke-dasharray="${isPrintMode ? 'none' : '4,2'}" />
        <line x1="35" y1="${yPost}" x2="325" y2="${yPost}" stroke="${planeColor}" stroke-width="2" stroke-dasharray="${isPrintMode ? 'none' : '4,2'}" />
        <!-- Surface labels sit on the side away from the disc so they never collide with it -->
        <text x="${entryX < centerX ? 322 : 38}" y="77" text-anchor="${entryX < centerX ? 'end' : 'start'}" fill="${textMuted}" font-size="9" font-weight="700">${esc(tr('visualizer.entry_surface', null, 'ENTRY SURFACE'))}</text>
        <text x="${exitX > centerX ? 38 : 322}" y="211" text-anchor="${exitX > centerX ? 'start' : 'end'}" fill="${textMuted}" font-size="9" font-weight="700">${esc(tr('visualizer.exit_surface', null, 'EXIT SURFACE'))}</text>

        <!-- Thickness bracket -->
        <line x1="26" y1="${yAnt}" x2="31" y2="${yAnt}" stroke="${textMuted}" stroke-width="1.5" />
        <line x1="28" y1="${yAnt}" x2="28" y2="${yPost}" stroke="${textMuted}" stroke-width="1.5" />
        <line x1="26" y1="${yPost}" x2="31" y2="${yPost}" stroke="${textMuted}" stroke-width="1.5" />
        <text x="22" y="140" fill="${textMuted}" font-size="8.5" font-weight="700" text-anchor="middle" transform="rotate(-90 22 140)">${esc(tr('visualizer.tissue_label', { thickness: thickness.toFixed(1) }, 'TISSUE: ' + thickness.toFixed(1) + ' mm'))}</text>

        <!-- 90 degree reference -->
        <line x1="${centerX}" y1="40" x2="${centerX}" y2="226" stroke="${textMuted}" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.7" />
        <text x="${centerX - 4}" y="50" fill="${textMuted}" font-size="8.5" font-weight="600" text-anchor="end">${esc(tr('visualizer.reference_90', null, '90° reference'))}</text>

        <!-- Channel: solid when straight, dashed and hatched when tilted -->
        <polygon points="${entryX - cDx},${yAnt} ${exitX - cDx},${yPost} ${exitX + cDx},${yPost} ${entryX + cDx},${yAnt}"
                 fill="${isOptimal ? (isPrintMode ? '#DDDDDD' : 'var(--success-green, #047857)') : 'url(#' + hatchId + ')'}"
                 fill-opacity="${isOptimal ? '0.3' : '0.45'}" stroke="${statusColor}" stroke-width="${isOptimal ? '1.5' : '2'}"
                 stroke-dasharray="${isOptimal ? 'none' : '5,3'}" />

        <!-- Bar -->
        <line id="v2LiveNeedle" x1="${entryX}" y1="${yAnt}" x2="${exitX}" y2="${yPost}" stroke="${statusColor}" stroke-width="3.5" stroke-linecap="round" />


        <!-- Discs, with generous touch targets -->
        <g class="v2-drag-handle v2-drag-handle-top" role="button" aria-label="${esc(tr('visualizer.drag_front_disc', null, 'Drag the front disc to change the angle'))}">
          <circle cx="${entryX}" cy="${yAnt}" r="28" fill="transparent" class="v2-touch-target" style="touch-action:none; cursor:grab;" />
          <line id="v2LiveTopDiscLine" x1="${topA.x}" y1="${topA.y}" x2="${topB.x}" y2="${topB.y}" stroke="${statusColor}" stroke-width="6" stroke-linecap="round" />
          <circle id="v2LiveTopDiscCircle" cx="${entryX}" cy="${yAnt}" r="5" fill="${cardBg}" stroke="${statusColor}" stroke-width="2.5" />
        </g>
        <g class="v2-drag-handle v2-drag-handle-bottom" role="button" aria-label="${esc(tr('visualizer.drag_back_disc', null, 'Drag the back disc to change the angle'))}">
          <circle cx="${exitX}" cy="${yPost}" r="28" fill="transparent" class="v2-touch-target" style="touch-action:none; cursor:grab;" />
          <line id="v2LiveBottomDiscLine" x1="${botA.x}" y1="${botA.y}" x2="${botB.x}" y2="${botB.y}" stroke="${statusColor}" stroke-width="6" stroke-linecap="round" />
          <circle id="v2LiveBottomDiscCircle" cx="${exitX}" cy="${yPost}" r="5" fill="${cardBg}" stroke="${statusColor}" stroke-width="2.5" />
        </g>
        <circle cx="${centerX}" cy="${centerY}" r="4" fill="${cardBg}" stroke="${statusColor}" stroke-width="2" />
        <line id="v2LiveHitbox" x1="${entryX}" y1="${yAnt}" x2="${exitX}" y2="${yPost}" stroke="transparent" stroke-width="44" stroke-linecap="round" class="v2-drag-hitbox" style="touch-action:none; cursor:grab;" />

        ${isOptimal ? '' : pressMark(topIn, yAnt, true) + liftMark(topOut) + pressMark(botIn, yPost, false) + liftMark(botOut)}

        <!-- Readouts -->
        <rect x="35" y="234" width="290" height="24" rx="3" fill="${cardBg}" stroke="${tissueOutline}" stroke-width="1" />
        <text x="180" y="250" fill="${textDark}" font-size="9.5" font-weight="700" text-anchor="middle">${esc(channelText)}</text>
        <text x="180" y="276" fill="${textMuted}" font-size="9" font-weight="600" text-anchor="middle">${esc(discText)}</text>
      </svg>
    `;
  }

  // 4-Quadrant Failure Mode Diagram Generator
  function renderErrorModeSvg(mode, key) {
    var modeTitles = {
      'optimal': ui('Perpendicular Flush Placement (0° Error)'),
      'shallow': ui('Shallow Diagonal Entry (-15° Deviation)'),
      'steep': ui('Steep Vertical Incline (+15° Deviation)'),
      'asymmetric': ui('Bilateral Asymmetric Divergence')
    };

    var isOptimal = (mode === 'optimal');
    var strokeColor = isOptimal ? 'var(--success-green, #047857)' : (mode === 'shallow' ? 'var(--warning-yellow, #B45309)' : 'var(--error-red, #B91C1C)');
    var angle = isOptimal ? 90 : (mode === 'shallow' ? 75 : (mode === 'steep' ? 105 : 70));
    var rad = (angle * Math.PI) / 180.0;

    var cx = 140;
    var cy = 100;
    var len = 120;
    var dx = (len / 2) * Math.cos(rad);
    var dy = (len / 2) * Math.sin(rad);

    var discLen = 32;
    var pDx = (discLen / 2) * Math.cos(rad + Math.PI / 2);
    var pDy = (discLen / 2) * Math.sin(rad + Math.PI / 2);

    var yAnt = 60;
    var yPost = 140;
    var tanRad = Math.tan(rad);
    var entryX = Math.abs(tanRad) > 0.001 ? cx - (cy - yAnt) / tanRad : cx;
    var exitX = Math.abs(tanRad) > 0.001 ? cx + (yPost - cy) / tanRad : cx;

    var hatchId = 'err_hatch_' + Math.floor(Math.random() * 10000);

    return `
      <svg viewBox="0 0 280 200" style="width:100%; height:auto; display:block;" aria-label="${modeTitles[mode] || 'Error Mode Diagram'}">
        <defs>
          <pattern id="${hatchId}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--error-red, #B91C1C)" stroke-width="2" />
          </pattern>
        </defs>

        <!-- Tissue Block -->
        <rect x="25" y="60" width="230" height="80" rx="4" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-primary, #334155)" stroke-width="1.5" />
        <line x1="25" y1="60" x2="255" y2="60" stroke="var(--border-secondary, #475569)" stroke-width="1.5" stroke-dasharray="3,3" />
        <line x1="25" y1="140" x2="255" y2="140" stroke="var(--border-secondary, #475569)" stroke-width="1.5" stroke-dasharray="3,3" />

        <text x="32" y="54" fill="var(--text-muted, #64748B)" font-size="8" font-weight="700">${window.translate ? window.translate('visualizer.entry_surface', null, 'ENTRY SURFACE') : 'ENTRY SURFACE'}</text>
        <text x="32" y="152" fill="var(--text-muted, #64748B)" font-size="8" font-weight="700">${window.translate ? window.translate('visualizer.exit_surface', null, 'EXIT SURFACE') : 'EXIT SURFACE'}</text>

        <!-- 90° Reference -->
        <line x1="${cx}" y1="20" x2="${cx}" y2="180" stroke="var(--text-muted, #64748B)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" />

        <!-- Fistula Channel Corridor (Greyscale: Solid vs Dashed/Hatched) -->
        <polygon points="${entryX - 4},60 ${exitX - 4},140 ${exitX + 4},140 ${entryX + 4},60" 
                 fill="${isOptimal ? 'var(--success-green, #047857)' : 'url(#' + hatchId + ')'}" 
                 fill-opacity="${isOptimal ? '0.2' : '0.35'}" 
                 stroke="${strokeColor}" 
                 stroke-width="${isOptimal ? '1.5' : '2'}" 
                 stroke-dasharray="${isOptimal ? 'none' : '4,2'}" />

        <!-- Needle Bar -->
        <line x1="${cx - dx}" y1="${cy - dy}" x2="${cx + dx}" y2="${cy + dy}" stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round" />

        <!-- Top & Bottom Discs -->
        <line x1="${cx - dx - pDx}" y1="${cy - dy - pDy}" x2="${cx - dx + pDx}" y2="${cy - dy + pDy}" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
        <line x1="${cx + dx - pDx}" y1="${cy + dy - pDy}" x2="${cx + dx + pDx}" y2="${cy + dy + pDy}" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />

        <!-- Entry and Exit Dots -->
        <circle cx="${entryX}" cy="60" r="3.5" fill="var(--bg-card, #1E293B)" stroke="${strokeColor}" stroke-width="1.5" />
        <circle cx="${exitX}" cy="140" r="3.5" fill="var(--bg-card, #1E293B)" stroke="${strokeColor}" stroke-width="1.5" />

        <!-- Greyscale-Distinguishable Failure Indicator -->
        ${!isOptimal ? `
          <polygon points="${cx - dx},${cy - dy} ${cx - dx - pDx},${cy - dy - pDy} ${entryX},60" fill="url(#${hatchId})" stroke="${strokeColor}" stroke-width="1" />
          <text x="140" y="176" fill="${strokeColor}" font-size="10" font-weight="bold" text-anchor="middle">${window.translate ? window.translate('visualizer.diagram_off_axis', { angle: angle }, `⚠ OFF-AXIS (${angle}°): FOCAL EDGE COMPRESSION`) : `⚠ OFF-AXIS (${angle}°): FOCAL EDGE COMPRESSION`}</text>
        ` : `
          <text x="140" y="176" fill="${strokeColor}" font-size="10" font-weight="bold" text-anchor="middle">${window.translate ? window.translate('visualizer.optimal_90_flush', null, '✔ OPTIMAL 90°: UNIFORM DERMAL FLUSH') : '✔ OPTIMAL 90°: UNIFORM DERMAL FLUSH'}</text>
        `}
      </svg>
    `;
  }

  // Bilateral Symmetry Caliper SVG Renderer
  function renderSymmetrySvg(pairType, leftAngleDeg, rightAngleDeg, heightOffsetMm) {
    var lAngle = parseFloat(leftAngleDeg) || 90.0;
    var rAngle = parseFloat(rightAngleDeg) || 90.0;
    var offset = parseFloat(heightOffsetMm) || 0.0;

    var angleDelta = Math.abs(lAngle - rAngle);
    var isSymmetric = (angleDelta <= 1.0 && Math.abs(offset) < 0.5);
    var statusColor = isSymmetric ? 'var(--success-green, #10B981)' : (angleDelta <= 4.0 && Math.abs(offset) <= 1.5 ? 'var(--warning-yellow, #F59E0B)' : 'var(--error-red, #EF4444)');

    var lRad = (lAngle * Math.PI) / 180.0;
    var rRad = (rAngle * Math.PI) / 180.0;

    var lCx = 100;
    var lCy = 110;
    var rCx = 220;
    var rCy = 110 + (offset * 4.0); // 4px per mm scale

    var len = 70;

    return `
      <svg viewBox="0 0 320 220" style="width:100%; height:auto; display:block;" aria-label="${ui('Bilateral Symmetry Caliper')}">
        <!-- Caliper Datum Horizontal Grid Lines -->
        <line x1="20" y1="110" x2="300" y2="110" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" stroke-opacity="0.7" />
        <text x="30" y="104" fill="var(--text-secondary, #94A3B8)" font-size="9" font-weight="bold">${window.translate ? window.translate('visualizer.coronal_datum_level', null, 'CORONAL DATUM LEVEL (0.0mm)') : 'CORONAL DATUM LEVEL (0.0mm)'}</text>

        <!-- Left Anatomical Plane -->
        <rect x="50" y="80" width="100" height="60" rx="6" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-primary, #334155)" stroke-width="1.5" />
        <text x="100" y="72" fill="var(--text-primary, #94A3B8)" font-size="10" font-weight="bold" text-anchor="middle">${window.translate ? ui('LEFT') : 'LEFT'}</text>

        <!-- Left Piercing Vector -->
        <line x1="${lCx - ((len/2)*Math.cos(lRad))}" y1="${lCy - ((len/2)*Math.sin(lRad))}" x2="${lCx + ((len/2)*Math.cos(lRad))}" y2="${lCy + ((len/2)*Math.sin(lRad))}" stroke="${lAngle === 90 ? 'var(--success-green, #10B981)' : 'var(--warning-yellow, #F59E0B)'}" stroke-width="4" stroke-linecap="round" />
        <circle cx="${lCx}" cy="${lCy}" r="4" fill="var(--bg-primary, #FFFFFF)" stroke="var(--border-primary, #334155)" stroke-width="1" />
        <text x="100" y="156" fill="var(--text-secondary, #94A3B8)" font-size="10" text-anchor="middle">${lAngle}°</text>

        <!-- Right Anatomical Plane -->
        <rect x="170" y="${80 + (offset*4)}" width="100" height="60" rx="6" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-primary, #334155)" stroke-width="1.5" />
        <text x="220" y="${72 + (offset*4)}" fill="var(--text-primary, #94A3B8)" font-size="10" font-weight="bold" text-anchor="middle">${window.translate ? ui('RIGHT') : 'RIGHT'}</text>

        <!-- Right Piercing Vector -->
        <line x1="${rCx - ((len/2)*Math.cos(rRad))}" y1="${rCy - ((len/2)*Math.sin(rRad))}" x2="${rCx + ((len/2)*Math.cos(rRad))}" y2="${rCy + ((len/2)*Math.sin(rRad))}" stroke="${rAngle === 90 ? 'var(--success-green, #10B981)' : 'var(--warning-yellow, #F59E0B)'}" stroke-width="4" stroke-linecap="round" />
        <circle cx="${rCx}" cy="${rCy}" r="4" fill="var(--bg-primary, #FFFFFF)" stroke="var(--border-primary, #334155)" stroke-width="1" />
        <text x="220" y="${156 + (offset*4)}" fill="var(--text-secondary, #94A3B8)" font-size="10" text-anchor="middle">${rAngle}°</text>

        <!-- Caliper Vertical Offset Indicator -->
        ${Math.abs(offset) > 0.1 ? `
          <line x1="285" y1="110" x2="285" y2="${rCy}" stroke="${statusColor}" stroke-width="2" />
          <circle cx="285" cy="110" r="2.5" fill="${statusColor}" />
          <circle cx="285" cy="${rCy}" r="2.5" fill="${statusColor}" />
          <text x="295" y="${(110 + rCy) / 2 + 3}" fill="${statusColor}" font-size="9" font-weight="bold">${offset > 0 ? '+' : ''}${offset}mm</text>
        ` : ''}

        <!-- Bilateral Status Callout -->
        <text x="160" y="200" fill="${statusColor}" font-size="11" font-weight="bold" text-anchor="middle">
          ${isSymmetric ? (window.translate ? window.translate('visualizer.symmetrical_alignment', null, '✅ Symmetrical Bilateral Alignment') : '✅ Symmetrical Bilateral Alignment') : (window.translate ? window.translate('visualizer.angular_delta_offset', { delta: angleDelta.toFixed(1), offset: offset }, `⚠️ Angular Delta: ${angleDelta.toFixed(1)}° | Offset: ${offset}mm`) : `⚠️ Angular Delta: ${angleDelta.toFixed(1)}° | Offset: ${offset}mm`)}
        </text>
      </svg>
    `;
  }

  // Interactive Landmark Caliper Placement SVG Renderer (Junior Piercer Guide)
  function renderSymmetryLandmarkSvg(pairType, overlays) {
    var showLandmarks = overlays ? overlays.landmarks : true;
    var showCaliper = overlays ? overlays.caliper : true;
    var showTargets = overlays ? overlays.targets : true;

    // Anatomical configurations per pair type
    var configs = {
      'lobes': {
        title: ui('Paired Earlobes Symmetry Protocol'),
        datumLabel: 'Inter-Tragal Notch Plane (Datum 0.0)',
        measDist: 'd = 16.5 mm',
        svgContent: `
          <!-- Ear Contour -->
          <path d="M 60,60 C 40,20 110,20 120,60 C 130,100 135,140 115,170 C 105,185 80,185 70,165 C 60,145 80,120 80,95 C 80,75 70,70 60,60 Z" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <!-- Tragus Landmark -->
          <path d="M 65,85 C 75,85 75,100 65,105" fill="none" stroke="var(--text-secondary, #94A3B8)" stroke-width="2.5" />
          
          ${showLandmarks ? `
            <!-- Inter-tragal datum plane -->
            <line x1="20" y1="95" x2="280" y2="95" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" />
            <circle cx="65" cy="95" r="3.5" fill="var(--primary-color, #8B5CF6)" />
            <text x="25" y="90" fill="var(--primary-color, #8B5CF6)" font-size="9" font-weight="700">${ui('Tragal Reference Notch (Datum A)')}</text>
            <!-- Vertical Drop Line from Tragus -->
            <line x1="65" y1="95" x2="65" y2="165" stroke="var(--primary-color, #8B5CF6)" stroke-width="1" stroke-dasharray="2,2" />
            <!-- Free Edge Curvature Baseline -->
            <path d="M 60,175 C 80,195 115,190 125,165" fill="none" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" stroke-dasharray="3,3" />
            <text x="135" y="180" fill="var(--warning-yellow, #F59E0B)" font-size="8.5">${ui('Lobule Rim Tangent')}</text>
          ` : ''}

          ${showCaliper ? `
            <!-- Vernier Caliper Representation -->
            <!-- Main Beam -->
            <rect x="155" y="65" width="140" height="14" rx="2" fill="var(--bg-tertiary, #334155)" stroke="var(--border-secondary, #64748B)" stroke-width="1.5" />
            <!-- Millimeter Graduations -->
            <line x1="170" y1="65" x2="170" y2="72" stroke="#FFFFFF" stroke-width="1" />
            <line x1="180" y1="65" x2="180" y2="76" stroke="#FFFFFF" stroke-width="1" />
            <line x1="190" y1="65" x2="190" y2="72" stroke="#FFFFFF" stroke-width="1" />
            <line x1="200" y1="65" x2="200" y2="76" stroke="#FFFFFF" stroke-width="1" />
            <line x1="210" y1="65" x2="210" y2="72" stroke="#FFFFFF" stroke-width="1" />
            <line x1="220" y1="65" x2="220" y2="76" stroke="#FFFFFF" stroke-width="1" />
            <line x1="230" y1="65" x2="230" y2="72" stroke="#FFFFFF" stroke-width="1" />
            <line x1="240" y1="65" x2="240" y2="76" stroke="#FFFFFF" stroke-width="1" />
            <text x="205" y="76" fill="#FFFFFF" font-size="8" font-family="monospace">16.5mm</text>
            <!-- Fixed Reference Jaw (Anchored at Tragus level) -->
            <path d="M 155,65 L 65,95 L 65,100 L 155,79 Z" fill="var(--primary-color, #8B5CF6)" fill-opacity="0.85" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" />
            <!-- Sliding Measuring Jaw (At planned mark) -->
            <path d="M 235,65 L 95,165 L 95,170 L 235,79 Z" fill="var(--secondary-color, #7C3AED)" fill-opacity="0.85" stroke="var(--secondary-color, #7C3AED)" stroke-width="1.5" />
            <!-- Caliper Measurement Callout -->
            <line x1="65" y1="130" x2="95" y2="130" stroke="var(--success-green, #10B981)" stroke-width="1.5" marker-end="url(#arrow)" />
            <rect x="70" y="120" width="48" height="15" rx="3" fill="var(--bg-primary, #0F172A)" stroke="var(--success-green, #10B981)" stroke-width="1" />
            <text x="94" y="131" fill="var(--success-green, #10B981)" font-size="9" font-weight="700" text-anchor="middle">16.5 mm</text>
          ` : ''}

          ${showTargets ? `
            <!-- Planned Piercing Mark -->
            <circle cx="95" cy="165" r="5" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="95" cy="165" r="2" fill="var(--success-green, #10B981)" />
            <line x1="85" y1="165" x2="105" y2="165" stroke="var(--success-green, #10B981)" stroke-width="1.5" />
            <line x1="95" y1="155" x2="95" y2="175" stroke="var(--success-green, #10B981)" stroke-width="1.5" />
            <text x="110" y="162" fill="var(--success-green, #10B981)" font-size="9" font-weight="700">${ui('Target Mark (Center of Mass)')}</text>
          ` : ''}
        `
      },
      'nostrils': {
        title: ui('Paired Nostrils Bilateral Caliper Guide'),
        datumLabel: 'Alar-Facial Crease Horizontal Baseline',
        measDist: 'd = 7.0 mm (Crease to Mark)',
        svgContent: `
          <!-- Nose Base & Alar Contours -->
          <path d="M 60,70 Q 150,50 240,70 Q 260,110 240,150 Q 210,165 150,165 Q 90,165 60,150 Q 40,110 60,70 Z" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <!-- Columella & Nostril Apertures -->
          <ellipse cx="115" cy="140" rx="18" ry="12" fill="var(--bg-tertiary, #0F172A)" stroke="var(--border-secondary, #475569)" stroke-width="1.5" />
          <ellipse cx="185" cy="140" rx="18" ry="12" fill="var(--bg-tertiary, #0F172A)" stroke="var(--border-secondary, #475569)" stroke-width="1.5" />
          <path d="M 140,120 Q 150,155 160,120" fill="none" stroke="var(--text-secondary, #94A3B8)" stroke-width="2" />

          ${showLandmarks ? `
            <!-- Mid-Sagittal Facial Midline -->
            <line x1="150" y1="40" x2="150" y2="180" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="155" y="50" fill="var(--primary-color, #8B5CF6)" font-size="8.5" font-weight="700">${ui('Mid-Sagittal Axis')}</text>
            <!-- Alar-Facial Crease Datum Lines -->
            <line x1="30" y1="150" x2="270" y2="150" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" stroke-dasharray="3,3" />
            <circle cx="60" cy="150" r="3.5" fill="var(--warning-yellow, #F59E0B)" />
            <circle cx="240" cy="150" r="3.5" fill="var(--warning-yellow, #F59E0B)" />
            <text x="35" y="163" fill="var(--warning-yellow, #F59E0B)" font-size="8.5">${ui('Alar Groove Baseline (Datum)')}</text>
          ` : ''}

          ${showCaliper ? `
            <!-- Caliper Jaws on Left Nostril -->
            <rect x="10" y="30" width="110" height="12" rx="2" fill="var(--bg-tertiary, #334155)" stroke="var(--border-secondary, #64748B)" stroke-width="1.5" />
            <!-- Fixed Jaw on Alar Crease -->
            <path d="M 10,30 L 60,150 L 65,150 L 25,42 Z" fill="var(--primary-color, #8B5CF6)" fill-opacity="0.8" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" />
            <!-- Sliding Jaw on Planned Mark -->
            <path d="M 70,30 L 88,118 L 93,118 L 82,42 Z" fill="var(--secondary-color, #7C3AED)" fill-opacity="0.8" stroke="var(--secondary-color, #7C3AED)" stroke-width="1.5" />
            <!-- Measurement Dimension -->
            <line x1="50" y1="134" x2="50" y2="118" stroke="var(--success-green, #10B981)" stroke-width="1.5" />
            <text x="38" y="128" fill="var(--success-green, #10B981)" font-size="8.5" font-weight="700">7.0mm</text>
          ` : ''}

          ${showTargets ? `
            <!-- Left Target Mark -->
            <circle cx="88" cy="118" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="88" cy="118" r="1.5" fill="var(--success-green, #10B981)" />
            <!-- Right Target Mark (Symmetrical) -->
            <circle cx="212" cy="118" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="212" cy="118" r="1.5" fill="var(--success-green, #10B981)" />
            <!-- Horizontal Level Line -->
            <line x1="88" y1="118" x2="212" y2="118" stroke="var(--success-green, #10B981)" stroke-width="1" stroke-dasharray="2,2" />
            <text x="150" y="114" fill="var(--success-green, #10B981)" font-size="8" font-weight="700" text-anchor="middle">Horizontal Gaze Level (0.0mm Δ)</text>
          ` : ''}
        `
      },
      'high-nostrils': {
        title: ui('Paired High Nostrils Supra-Alar Guide'),
        datumLabel: 'Nasion & Interpupillary Horizontal Plane',
        measDist: 'd = 14.0 mm from Alar Rim',
        svgContent: `
          <!-- Upper Nose Bridge Contour -->
          <path d="M 90,30 Q 150,20 210,30 L 230,160 Q 150,175 70,160 Z" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <path d="M 120,40 Q 150,130 180,40" fill="none" stroke="var(--text-secondary, #94A3B8)" stroke-width="1.5" />

          ${showLandmarks ? `
            <!-- Sagittal Midline -->
            <line x1="150" y1="20" x2="150" y2="180" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" />
            <!-- Horizontal Supra-Alar Plane -->
            <line x1="30" y1="85" x2="270" y2="85" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" stroke-dasharray="3,3" />
            <text x="35" y="80" fill="var(--warning-yellow, #F59E0B)" font-size="8.5">${ui('Nasal Bone / Cartilage Junction Plane')}</text>
          ` : ''}

          ${showCaliper ? `
            <rect x="30" y="15" width="100" height="10" rx="2" fill="var(--bg-tertiary, #334155)" stroke="var(--border-secondary, #64748B)" stroke-width="1" />
            <path d="M 30,15 L 115,85 L 120,85 L 40,25 Z" fill="var(--primary-color, #8B5CF6)" fill-opacity="0.8" stroke="var(--primary-color, #8B5CF6)" stroke-width="1" />
            <path d="M 80,15 L 150,85 L 150,85 L 88,25 Z" fill="var(--secondary-color, #7C3AED)" fill-opacity="0.8" stroke="var(--secondary-color, #7C3AED)" stroke-width="1" />
          ` : ''}

          ${showTargets ? `
            <circle cx="115" cy="85" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="115" cy="85" r="1.5" fill="var(--success-green, #10B981)" />
            <circle cx="185" cy="85" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="185" cy="85" r="1.5" fill="var(--success-green, #10B981)" />
            <text x="150" y="78" fill="var(--success-green, #10B981)" font-size="8" font-weight="700" text-anchor="middle">Equal Distance from Midline (12.0mm)</text>
          ` : ''}
        `
      },
      'eyebrows': {
        title: ui('Paired Eyebrows Ridge Tangent Protocol'),
        datumLabel: 'Lateral Orbital Rim & Outer Canthus Datum',
        measDist: 'd = 12.0 mm from Outer Canthus',
        svgContent: `
          <!-- Brow Ridge & Eye Contour -->
          <path d="M 40,50 Q 150,30 260,50 Q 270,90 240,110 Q 150,105 60,110 Z" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <!-- Eyebrow Arch -->
          <path d="M 50,60 Q 150,42 250,55" fill="none" stroke="var(--text-primary, #CBD5E1)" stroke-width="5" stroke-linecap="round" />
          <!-- Eye / Palpebral Fissure -->
          <path d="M 80,95 Q 150,75 220,95 Q 150,115 80,95 Z" fill="var(--bg-tertiary, #0F172A)" stroke="var(--text-secondary, #94A3B8)" stroke-width="1.5" />
          <circle cx="150" cy="95" r="8" fill="var(--primary-color, #8B5CF6)" />

          ${showLandmarks ? `
            <!-- Outer Canthus Landmark Point -->
            <circle cx="220" cy="95" r="3.5" fill="var(--warning-yellow, #F59E0B)" />
            <line x1="220" y1="40" x2="220" y2="150" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" stroke-dasharray="3,3" />
            <text x="175" y="145" fill="var(--warning-yellow, #F59E0B)" font-size="8">${ui('Vertical Canthus Line')}</text>
            <!-- Supraorbital arch tangent -->
            <line x1="40" y1="48" x2="260" y2="48" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" />
          ` : ''}

          ${showCaliper ? `
            <rect x="140" y="130" width="100" height="12" rx="2" fill="var(--bg-tertiary, #334155)" stroke="var(--border-secondary, #64748B)" stroke-width="1.5" />
            <!-- Fixed Jaw on Canthus -->
            <path d="M 220,130 L 220,95 L 225,95 L 230,130 Z" fill="var(--warning-yellow, #F59E0B)" fill-opacity="0.8" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" />
            <!-- Sliding Jaw on Eyebrow Piercing Axis -->
            <path d="M 185,130 L 195,50 L 200,50 L 195,130 Z" fill="var(--secondary-color, #7C3AED)" fill-opacity="0.8" stroke="var(--secondary-color, #7C3AED)" stroke-width="1.5" />
          ` : ''}

          ${showTargets ? `
            <circle cx="195" cy="38" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="195" cy="62" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <line x1="195" y1="34" x2="195" y2="66" stroke="var(--success-green, #10B981)" stroke-width="2" stroke-linecap="round" />
            <text x="140" y="42" fill="var(--success-green, #10B981)" font-size="8.5" font-weight="700">90° to Arch Curve</text>
          ` : ''}
        `
      },
      'snake-bites': {
        title: ui('Snake Bites (Paired Lower Lip) Symmetry Guide'),
        datumLabel: 'Vermilion Border & Oral Commissure Baseline',
        measDist: 'd = 12.5 mm from Oral Commissure',
        svgContent: `
          <!-- Lips & Chin Contour -->
          <path d="M 40,60 Q 150,40 260,60 Q 240,140 150,165 Q 60,140 40,60 Z" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <!-- Upper Lip -->
          <path d="M 70,75 Q 110,65 135,72 Q 150,80 165,72 Q 190,65 230,75 Q 150,85 70,75 Z" fill="var(--bg-tertiary, #334155)" stroke="var(--text-secondary, #94A3B8)" stroke-width="1.5" />
          <!-- Lower Lip -->
          <path d="M 70,75 Q 150,85 230,75 Q 150,115 70,75 Z" fill="var(--bg-tertiary, #334155)" stroke="var(--text-secondary, #94A3B8)" stroke-width="1.5" />

          ${showLandmarks ? `
            <!-- Mid-Sagittal Labial Line -->
            <line x1="150" y1="40" x2="150" y2="165" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" />
            <!-- Vermilion Border Horizontal Baseline -->
            <line x1="30" y1="95" x2="270" y2="95" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" stroke-dasharray="3,3" />
            <text x="35" y="90" fill="var(--warning-yellow, #F59E0B)" font-size="8.5">${ui('Lower Vermilion Ridge')}</text>
          ` : ''}

          ${showCaliper ? `
            <!-- Caliper measuring distance from oral commissure to mark -->
            <line x1="70" y1="125" x2="105" y2="125" stroke="var(--success-green, #10B981)" stroke-width="1.5" />
            <text x="87" y="137" fill="var(--success-green, #10B981)" font-size="8.5" font-weight="700" text-anchor="middle">12.5 mm</text>
          ` : ''}

          ${showTargets ? `
            <!-- Left Snakebite Mark -->
            <circle cx="105" cy="105" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="105" cy="105" r="1.5" fill="var(--success-green, #10B981)" />
            <!-- Right Snakebite Mark -->
            <circle cx="195" cy="105" r="4" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="195" cy="105" r="1.5" fill="var(--success-green, #10B981)" />
            <text x="150" y="155" fill="var(--success-green, #10B981)" font-size="8.5" font-weight="700" text-anchor="middle">Equal 45mm Inter-Bite Span</text>
          ` : ''}
        `
      },
      'nipples': {
        title: ui('Paired Nipples Horizontal Axis Protocol'),
        datumLabel: 'Sternal Midline & Inframammary Fold Datum',
        measDist: 'd = Horizontal Transverse Gaze Plane',
        svgContent: `
          <!-- Bilateral Areola Contours -->
          <circle cx="85" cy="100" r="45" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <circle cx="85" cy="100" r="18" fill="var(--bg-tertiary, #334155)" stroke="var(--text-secondary, #94A3B8)" stroke-width="1.5" />
          <circle cx="215" cy="100" r="45" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <circle cx="215" cy="100" r="18" fill="var(--bg-tertiary, #334155)" stroke="var(--text-secondary, #94A3B8)" stroke-width="1.5" />

          ${showLandmarks ? `
            <!-- Sternal Midline -->
            <line x1="150" y1="30" x2="150" y2="170" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="155" y="45" fill="var(--primary-color, #8B5CF6)" font-size="8.5">${ui('Sternal Midline')}</text>
            <!-- Transverse Level Gaze Plane -->
            <line x1="20" y1="100" x2="280" y2="100" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" stroke-dasharray="3,3" />
            <text x="25" y="94" fill="var(--warning-yellow, #F59E0B)" font-size="8.5">${ui('Coronal Level Datum')}</text>
          ` : ''}

          ${showTargets ? `
            <!-- Left Nipple Axis -->
            <line x1="65" y1="100" x2="105" y2="100" stroke="var(--success-green, #10B981)" stroke-width="3" stroke-linecap="round" />
            <circle cx="65" cy="100" r="3" fill="var(--success-green, #10B981)" />
            <circle cx="105" cy="100" r="3" fill="var(--success-green, #10B981)" />
            <!-- Right Nipple Axis -->
            <line x1="195" y1="100" x2="235" y2="100" stroke="var(--success-green, #10B981)" stroke-width="3" stroke-linecap="round" />
            <circle cx="195" cy="100" r="3" fill="var(--success-green, #10B981)" />
            <circle cx="235" cy="100" r="3" fill="var(--success-green, #10B981)" />
            <text x="150" y="160" fill="var(--success-green, #10B981)" font-size="8.5" font-weight="700" text-anchor="middle">${ui('True Base-of-Papilla Horizontal Alignment')}</text>
          ` : ''}
        `
      },
      'helix-flat': {
        title: ui('Paired Auricular Flat / Helix Symmetry Guide'),
        datumLabel: 'Superior Auricular Ridge & Scapha Axis',
        measDist: 'd = 6.5 mm Rim Clearance',
        svgContent: `
          <!-- Auricle Contour -->
          <path d="M 60,160 C 40,70 100,20 180,20 C 250,20 270,80 250,140 C 230,180 180,185 150,170" fill="var(--bg-secondary, #1E293B)" stroke="var(--border-secondary, #475569)" stroke-width="2" />
          <!-- Antihelix & Scapha Contour -->
          <path d="M 120,150 C 100,90 140,50 190,50 C 220,50 230,80 215,120" fill="none" stroke="var(--text-secondary, #94A3B8)" stroke-width="2" />

          ${showLandmarks ? `
            <line x1="40" y1="50" x2="260" y2="50" stroke="var(--primary-color, #8B5CF6)" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="45" y="44" fill="var(--primary-color, #8B5CF6)" font-size="8.5">${ui('Superior Auricle Height Line')}</text>
            <path d="M 170,25 C 230,25 255,75 235,130" fill="none" stroke="var(--warning-yellow, #F59E0B)" stroke-width="1.5" stroke-dasharray="3,3" />
            <text x="175" y="85" fill="var(--warning-yellow, #F59E0B)" font-size="8">${ui('Helix Rim Tangent')}</text>
          ` : ''}

          ${showTargets ? `
            <circle cx="180" cy="80" r="5" fill="none" stroke="var(--success-green, #10B981)" stroke-width="2" />
            <circle cx="180" cy="80" r="2" fill="var(--success-green, #10B981)" />
            <text x="140" y="105" fill="var(--success-green, #10B981)" font-size="8.5" font-weight="700">${ui('Flat Plate Centering')}</text>
          ` : ''}
        `
      }
    };

    var activeCfg = configs[pairType] || configs['lobes'];

    return `
      <svg viewBox="0 0 300 200" style="width:100%; height:auto; display:block;" aria-label="${activeCfg.title}">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--success-green, #10B981)" />
          </marker>
        </defs>
        ${activeCfg.svgContent}
      </svg>
    `;
  }

  // Get Structured Clinical Protocol Steps for Junior Piercers
  function getSymmetryStepsData(pairType) {
    var protocols = {
      'lobes': [
        { num: '1', title: 'Client Gaze Calibration:', text: 'Seat client upright in neutral, forward-looking posture with head un-tilted. Ensure jaw is relaxed.' },
        { num: '2', title: 'Anchor Fixed Caliper Jaw:', text: 'Rest fixed reference jaw lightly against the inter-tragal notch baseline (Datum A) without depressing cartilage.' },
        { num: '3', title: 'Measure & Lock Dimension:', text: 'Extend sliding vernier jaw to planned lobule center-of-mass (typically 15.0-18.0mm). Tighten vernier thumbscrew.' },
        { num: '4', title: 'Transfer to Contralateral Ear:', text: 'Place locked caliper on contralateral ear to scribe exact bilateral coordinate, ensuring ≥4.0mm margin from free lower rim.' }
      ],
      'nostrils': [
        { num: '1', title: 'Establish Sagittal Midline:', text: 'Inspect nasal dorsum from anterior gaze. Verify columella verticality relative to philtrum center.' },
        { num: '2', title: 'Anchor on Alar-Facial Groove:', text: 'Rest fixed caliper jaw precisely in the lateral alar-facial crease where cheek meets nasal flare.' },
        { num: '3', title: 'Measure Apex Height:', text: 'Measure vertical distance to the peak of the alar curve (typically 6.5-8.0mm). Verify horizontal gaze line.' },
        { num: '4', title: 'Bilateral Verification:', text: 'Check both sides in frontal and 45° profile planes to prevent step-level asymmetry.' }
      ],
      'high-nostrils': [
        { num: '1', title: 'Locate Nasal Bone Junction:', text: 'Palpate junction between rigid nasal bone and flexible lateral cartilage.' },
        { num: '2', title: 'Measure from Interpupillary Line:', text: 'Align horizontal caliper beam with pupillary line to prevent angled tilt.' },
        { num: '3', title: 'Check Internal Vault Clearance:', text: 'Inspect nasal interior with penlight to ensure placement clears upper turbinate structures.' },
        { num: '4', title: 'Contralateral Mirroring:', text: 'Lock measurement and verify matching distance from dorsal bridge ridge.' }
      ],
      'eyebrows': [
        { num: '1', title: 'Find Outer Canthus Plane:', text: 'Drop vertical plumb line or caliper jaw from lateral orbital rim/canthus tangent.' },
        { num: '2', title: 'Measure Ridge Arch Tangent:', text: 'Measure 10.0-14.0mm along supraorbital ridge from lateral rim.' },
        { num: '3', title: 'Verify Tissue Pinch:', text: 'Gently pinch tissue in neutral expression to confirm adequate dermal depth (≥6.0mm).' },
        { num: '4', title: 'Dynamic Expression Test:', text: 'Have client raise brows and squint to verify channel remains perpendicular during facial animation.' }
      ],
      'snake-bites': [
        { num: '1', title: 'Mark Vermilion Parallel:', text: 'Draw horizontal guideline 8.0-10.0mm below lower vermilion border.' },
        { num: '2', title: 'Measure Oral Commissure Offset:', text: 'Place fixed caliper on corner of mouth; slide to planned puncture point (typically 12.0-14.0mm inward).' },
        { num: '3', title: 'Verify Dental Clearance:', text: 'Inspect inside mouth to ensure flatback disc clears canine and premolar teeth at rest.' },
        { num: '4', title: 'Bilateral Inter-Bite Check:', text: 'Verify left and right puncture points are equidistant from midline (typically 40.0-48.0mm total span).' }
      ],
      'nipples': [
        { num: '1', title: 'Identify Papilla Base Plane:', text: 'Palpate base of nipple where papilla transitions into areola tissue.' },
        { num: '2', title: 'Sternal Midline Reference:', text: 'Check distance from sternal midline to each nipple center for bilateral balance.' },
        { num: '3', title: 'Inframammary Horizontal Level:', text: 'Ensure needle pathway is strictly horizontal with client standing in neutral posture.' },
        { num: '4', title: 'Tissue Pinch Verification:', text: 'Verify puncture path does not dive into underlying breast parenchyma.' }
      ],
      'helix-flat': [
        { num: '1', title: 'Map Scapha & Flat Plate:', text: 'Identify central fossa/flat cartilage area devoid of prominent cartilage folds.' },
        { num: '2', title: 'Measure Rim Clearance:', text: 'Ensure ≥6.0mm clearance from outer curled helix rim to accommodate 4.0mm decorative ends.' },
        { num: '3', title: 'Perpendicular Backing Check:', text: 'Inspect posterior ear to verify flatback disc will not press against cranial skull curve.' },
        { num: '4', title: 'Mirror Height from Superior Rim:', text: 'Transfer caliper reading from top apex of auricle for matching bilateral elevation.' }
      ]
    };

    var base = protocols[pairType] || protocols['lobes'];
    var rawType = pairType.replace(/-/g, '_');
    var t = window.translate || function(k, p, d) { return d; };
    return base.map(function(item) {
      var tTitle = t('step.' + rawType + '.' + item.num + '.title', null, item.title);
      var tText = t('step.' + rawType + '.' + item.num + '.text', null, item.text);
      return { num: item.num, title: tTitle, text: tText };
    });
  }


  // DOM CONTROLLER LOGIC

  // Export to window
  window.PiercingVisualizer = {
    getActiveJewelryOption: getActiveJewelryOption,
    renderJewelry3D: renderJewelry3D,
    calculateChannelMetrics: calculateChannelMetrics,
    renderV2InteractiveSvg: renderV2InteractiveSvg,
    renderErrorModeSvg: renderErrorModeSvg,
    renderSymmetrySvg: renderSymmetrySvg,
    renderSymmetryLandmarkSvg: renderSymmetryLandmarkSvg,
    getSymmetryStepsData: getSymmetryStepsData,
  };

  // Backward-compatibility globals
  window.getActiveJewelryOption = getActiveJewelryOption;
  window.renderJewelry3D = renderJewelry3D;
  window.calculateChannelMetrics = calculateChannelMetrics;
  window.renderV2InteractiveSvg = renderV2InteractiveSvg;
  window.renderErrorModeSvg = renderErrorModeSvg;
  window.renderSymmetrySvg = renderSymmetrySvg;
  window.renderSymmetryLandmarkSvg = renderSymmetryLandmarkSvg;
  window.getSymmetryStepsData = getSymmetryStepsData;

})(typeof window !== 'undefined' ? window : this);
