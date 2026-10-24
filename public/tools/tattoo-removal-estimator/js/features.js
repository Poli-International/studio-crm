/**
 * Tattoo Removal Sessions Estimator - V2 Advanced Clinical Features Module
 * 1. Wavelength & Chromophore Laser Guide
 * 2. Cover-Up Colour Feasibility Matrix
 * 3. Non-Linear Biological Clearance Trajectory Curve (SVG)
 * 4. Interactive Aftercare Stage Checklist
 * 5. Data Backup, Export & Portability (JSON / CSV)
 * 6. Photo Progression Modal Viewer
 * Zero external libraries, zero network requests.
 */
(function(window) {
  'use strict';

  var t = function(key, params) {
    return (window.i18n && window.i18n.t) ? window.i18n.t(key, params) : key;
  };

  /* ==========================================================================
     1. Cover-Up Colour Feasibility Matrix
     ========================================================================== */
  var coverupRows = [
    {
      residualKey: 'coverup.row_black_faded',
      swatch: 'swatch-black',
      feasibility: ['high', 'high', 'high', 'high', 'mod', 'low']
    },
    {
      residualKey: 'coverup.row_warm_faded',
      swatch: 'swatch-red',
      feasibility: ['high', 'mod', 'mod', 'high', 'high', 'low']
    },
    {
      residualKey: 'coverup.row_cool_faded',
      swatch: 'swatch-green',
      feasibility: ['high', 'high', 'high', 'mod', 'low', 'low']
    },
    {
      residualKey: 'coverup.row_multi_faded',
      swatch: 'swatch-purple',
      feasibility: ['high', 'mod', 'mod', 'mod', 'low', 'low']
    }
  ];

  function renderCoverupMatrix(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var badgeClasses = {
      high: 'badge-feasibility-high',
      mod: 'badge-feasibility-mod',
      low: 'badge-feasibility-low'
    };
    var badgeLabels = {
      high: 'coverup.badge_high',
      mod: 'coverup.badge_mod',
      low: 'coverup.badge_low'
    };

    var html = '<div class="coverup-matrix-wrapper">';
    html += '<div class="table-responsive mb-3">';
    html += '<table class="data-table matrix-table" id="coverup-table">';
    html += '<thead><tr>';
    html += '<th>' + t('coverup.th_residual') + '</th>';
    html += '<th>' + t('coverup.th_cover_black') + '</th>';
    html += '<th>' + t('coverup.th_cover_navy') + '</th>';
    html += '<th>' + t('coverup.th_cover_green') + '</th>';
    html += '<th>' + t('coverup.th_cover_purple') + '</th>';
    html += '<th>' + t('coverup.th_cover_warm') + '</th>';
    html += '<th>' + t('coverup.th_cover_pastel') + '</th>';
    html += '</tr></thead><tbody>';

    for (var i = 0; i < coverupRows.length; i++) {
      var row = coverupRows[i];
      html += '<tr>';
      html += '<td><div class="swatch-cell"><span class="color-dot ' + row.swatch + '"></span><strong>' + t(row.residualKey) + '</strong></div></td>';
      for (var j = 0; j < row.feasibility.length; j++) {
        var grade = row.feasibility[j];
        html += '<td class="text-center"><span class="feasibility-badge ' + badgeClasses[grade] + '">' + t(badgeLabels[grade]) + '</span></td>';
      }
      html += '</tr>';
    }

    html += '</tbody></table></div>';
    html += '<div class="callout callout-info">';
    html += '<strong>' + t('coverup.advisory_title') + '</strong> ';
    html += t('coverup.advisory_text');
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
  }

  /* ==========================================================================
     3. Non-Linear Biological Clearance Trajectory Curve (Interactive D3/SVG)
     ========================================================================== */
  function renderTrajectoryChart(containerId, estMin, estMax, currentSessionNum, currentFadePct, intervalWeeks, totalScore) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var numEstMin = Math.max(1, parseInt(estMin, 10) || 5);
    var numEstMax = Math.max(numEstMin, parseInt(estMax, 10) || 10);
    var numWeeks = Math.max(2, Math.min(52, parseInt(intervalWeeks, 10) || 8));
    var numScore = (totalScore !== undefined && totalScore !== null && !isNaN(totalScore))
      ? parseInt(totalScore, 10)
      : Math.round((numEstMin + numEstMax) / 2);

    var totalSessions = Math.max(10, numEstMax + 2);
    var curSess = Math.min(totalSessions, Math.max(0, parseInt(currentSessionNum, 10) || 0));
    var curFade = Math.min(100, Math.max(0, parseFloat(currentFadePct) || 0));

    // Chart dimensions
    var width = 720;
    var height = 340;
    var padLeft = 60;
    var padRight = 35;
    var padTop = 35;
    var padBottom = 50;
    var chartW = width - padLeft - padRight;
    var chartH = height - padTop - padBottom;

    // D3 scale compatibility or math mapping
    var getX, getY;
    if (typeof window.d3 !== 'undefined' && window.d3.scaleLinear) {
      var xScale = window.d3.scaleLinear().domain([0, totalSessions]).range([padLeft, padLeft + chartW]);
      var yScale = window.d3.scaleLinear().domain([0, 100]).range([padTop + chartH, padTop]);
      getX = function(s) { return xScale(s); };
      getY = function(p) { return yScale(p); };
    } else {
      getX = function(sess) { return padLeft + (sess / totalSessions) * chartW; };
      getY = function(pct) { return padTop + (1 - (pct / 100)) * chartH; };
    }

    // Kinetic rate constant calibrated so estMax lands at ~96% clearance
    var k = -Math.log(0.04) / Math.pow(numEstMax, 1.15);

    // Compute session nodes data
    var sessionPoints = [];
    for (var s = 0; s <= totalSessions; s++) {
      var sPct = 100 * (1 - Math.exp(-k * Math.pow(s, 1.15)));
      if (sPct > 99.5) sPct = 99.5;
      var sRemaining = Math.max(0, 100 - sPct);
      var sWeek = s * numWeeks;
      var sMonths = (sWeek / 4.33).toFixed(1);

      var statusKey = 'trajectory.status_baseline';
      if (s === 0) {
        statusKey = 'trajectory.status_baseline';
      } else if (sPct < 25) {
        statusKey = 'trajectory.status_initial';
      } else if (sPct < 50) {
        statusKey = 'trajectory.status_intermediate';
      } else if (sPct < 70) {
        statusKey = 'trajectory.status_coverup';
      } else if (sPct < 95) {
        statusKey = 'trajectory.status_advanced';
      } else {
        statusKey = 'trajectory.status_clearance';
      }

      sessionPoints.push({
        session: s,
        pct: sPct,
        remaining: sRemaining,
        week: sWeek,
        months: sMonths,
        statusKey: statusKey,
        statusText: t(statusKey),
        x: getX(s),
        y: getY(sPct)
      });
    }

    // Build SVG curve path
    var pathD = '';
    var steps = 80;
    for (var i = 0; i <= steps; i++) {
      var stepS = (i / steps) * totalSessions;
      var stepPct = 100 * (1 - Math.exp(-k * Math.pow(stepS, 1.15)));
      if (stepPct > 99.5) stepPct = 99.5;
      var px = getX(stepS);
      var py = getY(stepPct);
      if (i === 0) {
        pathD += 'M ' + px.toFixed(1) + ' ' + py.toFixed(1);
      } else {
        pathD += ' L ' + px.toFixed(1) + ' ' + py.toFixed(1);
      }
    }

    // Area coordinates for zones
    var yCoverUpTop = getY(70);
    var yCoverUpBottom = getY(50);
    var yClearanceTop = getY(100);
    var yClearanceBottom = getY(95);

    // Top instruction & score bar
    var topBarHtml = '<div class="trajectory-header-bar d-flex justify-between align-center flex-wrap gap-2 mb-2">';
    topBarHtml += '<span class="trajectory-score-badge">' + t('trajectory.score_note', { score: numScore, min: numEstMin, max: numEstMax }) + '</span>';
    topBarHtml += '<span class="trajectory-prompt-text text-sm text-muted">' + t('trajectory.hover_prompt') + '</span>';
    topBarHtml += '</div>';

    var svg = '<svg id="trajectory-interactive-svg" viewBox="0 0 ' + width + ' ' + height + '" class="trajectory-svg" role="img" aria-label="' + t('trajectory.title') + '">';

    // Defs
    svg += '<defs>';
    svg += '<linearGradient id="trajGrad" x1="0%" y1="0%" x2="100%" y2="0%">';
    svg += '<stop offset="0%" stop-color="var(--border-focus)" stop-opacity="0.9"/>';
    svg += '<stop offset="100%" stop-color="var(--primary)" stop-opacity="1.0"/>';
    svg += '</linearGradient>';
    svg += '</defs>';

    // Shaded Zones
    // Cover-up zone (50% to 70%)
    svg += '<rect x="' + padLeft + '" y="' + yCoverUpTop + '" width="' + chartW + '" height="' + (yCoverUpBottom - yCoverUpTop) + '" class="zone-coverup-rect"/>';
    // Full clearance zone (95% to 100%)
    svg += '<rect x="' + padLeft + '" y="' + yClearanceTop + '" width="' + chartW + '" height="' + (yClearanceBottom - yClearanceTop) + '" class="zone-clearance-rect"/>';

    // Target estimated range vertical highlight
    var xMin = getX(numEstMin);
    var xMax = getX(numEstMax);
    svg += '<rect x="' + xMin + '" y="' + padTop + '" width="' + Math.max(2, xMax - xMin) + '" height="' + chartH + '" class="target-range-box"/>';
    svg += '<line x1="' + xMin + '" y1="' + padTop + '" x2="' + xMin + '" y2="' + (padTop + chartH) + '" class="target-est-line"/>';
    svg += '<line x1="' + xMax + '" y1="' + padTop + '" x2="' + xMax + '" y2="' + (padTop + chartH) + '" class="target-est-line"/>';

    // Grid lines (Horizontal: 0%, 25%, 50%, 70%, 95%, 100%)
    var yLevels = [0, 25, 50, 70, 95, 100];
    for (var j = 0; j < yLevels.length; j++) {
      var yVal = getY(yLevels[j]);
      svg += '<line x1="' + padLeft + '" y1="' + yVal + '" x2="' + (padLeft + chartW) + '" y2="' + yVal + '" class="grid-line"/>';
      svg += '<text x="' + (padLeft - 8) + '" y="' + (yVal + 4) + '" class="axis-label" text-anchor="end">' + yLevels[j] + '%</text>';
    }

    // Session vertical markers
    var stepSess = totalSessions > 16 ? 4 : 2;
    for (var sVal = 0; sVal <= totalSessions; sVal += stepSess) {
      var xVal = getX(sVal);
      svg += '<line x1="' + xVal + '" y1="' + padTop + '" x2="' + xVal + '" y2="' + (padTop + chartH) + '" class="grid-line"/>';
      svg += '<text x="' + xVal + '" y="' + (padTop + chartH + 18) + '" class="axis-label" text-anchor="middle">' + sVal + '</text>';
    }

    // Axis titles
    svg += '<text x="' + (padLeft + chartW / 2) + '" y="' + (height - 10) + '" class="axis-title" text-anchor="middle">' + t('trajectory.x_axis') + '</text>';
    svg += '<text x="16" y="' + (padTop + chartH / 2) + '" class="axis-title" text-anchor="middle" transform="rotate(-90 16 ' + (padTop + chartH / 2) + ')">' + t('trajectory.y_axis') + '</text>';

    // Zone labels right side
    svg += '<text x="' + (padLeft + chartW - 8) + '" y="' + (yCoverUpTop + 14) + '" class="zone-tag" text-anchor="end">' + t('trajectory.zone_coverup') + '</text>';
    svg += '<text x="' + (padLeft + chartW - 8) + '" y="' + (yClearanceTop + 14) + '" class="zone-tag" text-anchor="end">' + t('trajectory.zone_clearance') + '</text>';

    // Main Trajectory Curve Path
    svg += '<path d="' + pathD + '" class="trajectory-path" fill="none"/>';

    // Crosshairs for interactive inspection
    svg += '<line id="traj-crosshair-x" class="traj-crosshair" x1="' + padLeft + '" y1="0" x2="' + (padLeft + chartW) + '" y2="0" visibility="hidden"/>';
    svg += '<line id="traj-crosshair-y" class="traj-crosshair" x1="0" y1="' + padTop + '" x2="0" y2="' + (padTop + chartH) + '" visibility="hidden"/>';

    // Interactive Active Ring
    svg += '<circle id="traj-active-ring" class="traj-active-ring" cx="0" cy="0" r="9" visibility="hidden"/>';

    // Interactive session nodes along curve
    svg += '<g class="trajectory-nodes-layer">';
    for (var p = 0; p < sessionPoints.length; p++) {
      var pt = sessionPoints[p];
      var isTarget = (pt.session >= numEstMin && pt.session <= numEstMax);
      var nodeClass = isTarget ? 'trajectory-node target-range-node' : 'trajectory-node';
      var ariaLabel = t('trajectory.tooltip_session', { session: pt.session }) + ': ' + pt.pct.toFixed(0) + '%';

      svg += '<circle class="' + nodeClass + '" data-session="' + pt.session + '" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="5" tabindex="0" role="button" aria-label="' + ariaLabel + '"/>';
      // Larger invisible hit target for touch and pointer
      svg += '<circle class="trajectory-hit-target" data-session="' + pt.session + '" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="15" fill="transparent" style="cursor:pointer;"/>';
    }
    svg += '</g>';

    // Current Marker (if sessions already logged)
    if (curSess > 0 || curFade > 0) {
      var curX = getX(curSess);
      var curY = getY(curFade);
      svg += '<circle cx="' + curX + '" cy="' + curY + '" r="8" class="current-marker-pulse"/>';
      svg += '<circle cx="' + curX + '" cy="' + curY + '" r="5" class="current-marker-dot"/>';
      svg += '<text x="' + Math.min(width - 80, curX + 10) + '" y="' + Math.max(padTop + 15, curY - 10) + '" class="marker-label">' + t('trajectory.actual_observed', { sess: curSess, pct: curFade }) + '</text>';
    }

    // Floating SVG HUD Tooltip
    svg += '<g id="traj-hud" class="traj-hud" visibility="hidden" pointer-events="none">';
    svg += '<rect id="traj-hud-bg" class="traj-hud-bg" x="0" y="0" width="200" height="74" rx="6" ry="6"/>';
    svg += '<text id="traj-hud-session" class="traj-hud-session" x="12" y="18">Session</text>';
    svg += '<text id="traj-hud-clearance" class="traj-hud-clearance" x="12" y="34">Clearance</text>';
    svg += '<text id="traj-hud-timeline" class="traj-hud-timeline" x="12" y="50">Timeline</text>';
    svg += '<text id="traj-hud-status" class="traj-hud-status" x="12" y="66">Status</text>';
    svg += '</g>';

    svg += '</svg>';

    // Dynamic Live Readout Card below chart
    var defaultIdx = Math.min(sessionPoints.length - 1, Math.max(1, numEstMin));
    var initPt = sessionPoints[defaultIdx] || sessionPoints[0];

    var pointCardHtml = '<div id="trajectory-point-card" class="trajectory-point-card" role="region" aria-live="polite">';
    pointCardHtml += '<div class="point-card-header d-flex justify-between align-center flex-wrap gap-2">';
    pointCardHtml += '<div class="d-flex align-center gap-2">';
    pointCardHtml += '<strong id="card-session-title" class="text-md">' + t('trajectory.tooltip_session', { session: initPt.session }) + '</strong>';
    pointCardHtml += '<span id="card-timeline-badge" class="point-badge-timeline">' + t('trajectory.tooltip_timeline', { week: initPt.week, months: initPt.months }) + '</span>';
    pointCardHtml += '</div>';
    pointCardHtml += '<span id="card-status-badge" class="point-badge-status">' + initPt.statusText + '</span>';
    pointCardHtml += '</div>';

    pointCardHtml += '<div class="point-card-progress mt-2">';
    pointCardHtml += '<div class="d-flex justify-between text-sm mb-1">';
    pointCardHtml += '<span id="card-clearance-text"><strong>' + initPt.pct.toFixed(1) + '%</strong> ' + t('trajectory.zone_clearance') + '</span>';
    pointCardHtml += '<span id="card-remaining-text" class="text-muted">' + initPt.remaining.toFixed(1) + '% remaining</span>';
    pointCardHtml += '</div>';
    pointCardHtml += '<div class="point-progress-track"><div id="card-progress-bar" class="point-progress-fill" style="width:' + initPt.pct.toFixed(1) + '%;"></div></div>';
    pointCardHtml += '</div>';
    pointCardHtml += '</div>';

    // Legends bar underneath
    var legendHtml = '<div class="trajectory-legend mt-2 d-flex flex-wrap gap-3 text-sm">';
    legendHtml += '<span class="legend-item"><span class="legend-swatch swatch-line"></span> ' + t('trajectory.legend_trajectory') + '</span>';
    legendHtml += '<span class="legend-item"><span class="legend-swatch swatch-coverup"></span> ' + t('trajectory.legend_coverup') + '</span>';
    legendHtml += '<span class="legend-item"><span class="legend-swatch swatch-target"></span> ' + t('trajectory.legend_target') + '</span>';
    if (curSess > 0 || curFade > 0) {
      legendHtml += '<span class="legend-item"><span class="legend-swatch swatch-actual"></span> ' + t('trajectory.current_marker') + '</span>';
    }
    legendHtml += '</div>';

    container.innerHTML = topBarHtml + svg + pointCardHtml + legendHtml;

    // Attach interactive event listeners to points
    function inspectSession(sessNum) {
      var point = sessionPoints[sessNum];
      if (!point) return;

      var svgEl = document.getElementById('trajectory-interactive-svg');
      if (!svgEl) return;

      var crossX = document.getElementById('traj-crosshair-x');
      var crossY = document.getElementById('traj-crosshair-y');
      var ring = document.getElementById('traj-active-ring');
      var hud = document.getElementById('traj-hud');
      var hudBg = document.getElementById('traj-hud-bg');
      var hudSess = document.getElementById('traj-hud-session');
      var hudClear = document.getElementById('traj-hud-clearance');
      var hudTime = document.getElementById('traj-hud-timeline');
      var hudStat = document.getElementById('traj-hud-status');

      if (crossX) {
        crossX.setAttribute('y1', point.y.toFixed(1));
        crossX.setAttribute('y2', point.y.toFixed(1));
        crossX.setAttribute('visibility', 'visible');
      }
      if (crossY) {
        crossY.setAttribute('x1', point.x.toFixed(1));
        crossY.setAttribute('x2', point.x.toFixed(1));
        crossY.setAttribute('visibility', 'visible');
      }
      if (ring) {
        ring.setAttribute('cx', point.x.toFixed(1));
        ring.setAttribute('cy', point.y.toFixed(1));
        ring.setAttribute('visibility', 'visible');
      }

      // HUD position (prevent clipping at top and right)
      if (hud && hudBg) {
        var hudW = 205;
        var hudH = 74;
        var hx = point.x + 12;
        if (hx + hudW > width - padRight) {
          hx = point.x - hudW - 12;
        }
        var hy = point.y - hudH / 2;
        if (hy < padTop) hy = padTop;
        if (hy + hudH > height - padBottom) hy = height - padBottom - hudH;

        hud.setAttribute('transform', 'translate(' + hx.toFixed(1) + ',' + hy.toFixed(1) + ')');
        hud.setAttribute('visibility', 'visible');

        if (hudSess) hudSess.textContent = t('trajectory.tooltip_session', { session: point.session });
        if (hudClear) hudClear.textContent = t('trajectory.tooltip_clearance', { pct: point.pct.toFixed(1), remaining: point.remaining.toFixed(1) });
        if (hudTime) hudTime.textContent = t('trajectory.tooltip_timeline', { week: point.week, months: point.months });
        if (hudStat) hudStat.textContent = t('trajectory.tooltip_status', { status: point.statusText });
      }

      // Update Card
      var cTitle = document.getElementById('card-session-title');
      var cTimeline = document.getElementById('card-timeline-badge');
      var cStatus = document.getElementById('card-status-badge');
      var cClearText = document.getElementById('card-clearance-text');
      var cRemText = document.getElementById('card-remaining-text');
      var cBar = document.getElementById('card-progress-bar');

      if (cTitle) cTitle.textContent = t('trajectory.tooltip_session', { session: point.session });
      if (cTimeline) cTimeline.textContent = t('trajectory.tooltip_timeline', { week: point.week, months: point.months });
      if (cStatus) cStatus.textContent = point.statusText;
      if (cClearText) cClearText.innerHTML = '<strong>' + point.pct.toFixed(1) + '%</strong> ' + t('trajectory.zone_clearance');
      if (cRemText) cRemText.textContent = point.remaining.toFixed(1) + '% remaining';
      if (cBar) cBar.style.width = point.pct.toFixed(1) + '%';
    }

    var hitTargets = container.querySelectorAll('.trajectory-hit-target');
    var nodes = container.querySelectorAll('.trajectory-node');

    function bindNodeEvents(elem) {
      var sIdx = parseInt(elem.getAttribute('data-session'), 10);
      elem.addEventListener('pointerenter', function() { inspectSession(sIdx); });
      elem.addEventListener('focus', function() { inspectSession(sIdx); });
      elem.addEventListener('click', function() { inspectSession(sIdx); });
      elem.addEventListener('keydown', function(evt) {
        if (evt.key === 'ArrowRight' || evt.key === 'ArrowUp') {
          evt.preventDefault();
          var nextS = Math.min(sessionPoints.length - 1, sIdx + 1);
          var nextNode = container.querySelector('.trajectory-node[data-session="' + nextS + '"]');
          if (nextNode) { nextNode.focus(); inspectSession(nextS); }
        } else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowDown') {
          evt.preventDefault();
          var prevS = Math.max(0, sIdx - 1);
          var prevNode = container.querySelector('.trajectory-node[data-session="' + prevS + '"]');
          if (prevNode) { prevNode.focus(); inspectSession(prevS); }
        }
      });
    }

    for (var h = 0; h < hitTargets.length; h++) {
      bindNodeEvents(hitTargets[h]);
    }
    for (var n = 0; n < nodes.length; n++) {
      bindNodeEvents(nodes[n]);
    }

    // Set initial inspected session
    inspectSession(defaultIdx);
  }

  /* ==========================================================================
     4. Interactive Clinical Aftercare Checklist
     ========================================================================== */
  var aftercareStages = [
    {
      titleKey: 'aftercare.stage1_title',
      items: [
        { id: 'st1_1', textKey: 'aftercare.stage1_item1' },
        { id: 'st1_2', textKey: 'aftercare.stage1_item2' },
        { id: 'st1_3', textKey: 'aftercare.stage1_item3' },
        { id: 'st1_4', textKey: 'aftercare.stage1_item4' }
      ]
    },
    {
      titleKey: 'aftercare.stage2_title',
      items: [
        { id: 'st2_1', textKey: 'aftercare.stage2_item1' },
        { id: 'st2_2', textKey: 'aftercare.stage2_item2' },
        { id: 'st2_3', textKey: 'aftercare.stage2_item3' }
      ]
    },
    {
      titleKey: 'aftercare.stage3_title',
      items: [
        { id: 'st3_1', textKey: 'aftercare.stage3_item1' },
        { id: 'st3_2', textKey: 'aftercare.stage3_item2' },
        { id: 'st3_3', textKey: 'aftercare.stage3_item3' }
      ]
    }
  ];

  function getAftercareStateKey(profileId) {
    return 'poli_aftercare_' + (profileId || 'default');
  }

  function renderAftercareChecklist(containerId, profileId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var storageKey = getAftercareStateKey(profileId);
    var savedState = {};
    try {
      savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (e) {}

    var totalItems = 10;
    var doneCount = 0;

    var html = '<div class="aftercare-checklist-wrapper">';
    html += '<div class="aftercare-progress-bar-container mb-3">';
    html += '<div class="d-flex justify-between text-sm mb-1">';
    html += '<span id="aftercare-progress-text">' + t('aftercare.progress_label', { done: 0, total: totalItems }) + '</span>';
    html += '<span id="aftercare-progress-pct">0%</span>';
    html += '</div>';
    html += '<div class="progress-track"><div id="aftercare-progress-fill" class="progress-fill" style="width: 0%"></div></div>';
    html += '</div>';
    html += '<div class="aftercare-actions-bar mb-3">';
    html += '<button type="button" id="aftercare-mark-all-btn" class="secondary-btn text-xs mr-2">' + t('aftercare.mark_all_btn') + '</button>';
    html += '<button type="button" id="aftercare-unmark-all-btn" class="secondary-btn text-xs">' + t('aftercare.unmark_all_btn') + '</button>';
    html += '</div>';

    for (var s = 0; s < aftercareStages.length; s++) {
      var stage = aftercareStages[s];
      html += '<div class="aftercare-stage-group mb-4">';
      html += '<h4 class="aftercare-stage-title mb-2">' + t(stage.titleKey) + '</h4>';
      html += '<div class="aftercare-items-list">';
      for (var i = 0; i < stage.items.length; i++) {
        var item = stage.items[i];
        var isChecked = !!savedState[item.id];
        if (isChecked) doneCount++;

        html += '<label class="aftercare-item-label d-flex align-start gap-2 mb-2" for="chk_' + item.id + '">';
        html += '<input type="checkbox" id="chk_' + item.id + '" class="aftercare-checkbox" data-stage-id="' + item.id + '" ' + (isChecked ? 'checked' : '') + '/>';
        html += '<span class="aftercare-item-text">' + t(item.textKey) + '</span>';
        html += '</label>';
      }
      html += '</div></div>';
    }
    html += '</div>';

    container.innerHTML = html;

    // Update progress elements
    function updateProgress(done) {
      var pct = Math.round((done / totalItems) * 100);
      var txtEl = document.getElementById('aftercare-progress-text');
      var pctEl = document.getElementById('aftercare-progress-pct');
      var fillEl = document.getElementById('aftercare-progress-fill');
      if (txtEl) txtEl.textContent = t('aftercare.progress_label', { done: done, total: totalItems });
      if (pctEl) pctEl.textContent = pct + '%';
      if (fillEl) fillEl.style.width = pct + '%';
    }

    updateProgress(doneCount);

    // Event listeners
    var checkboxes = container.querySelectorAll('.aftercare-checkbox');
    for (var c = 0; c < checkboxes.length; c++) {
      checkboxes[c].addEventListener('change', function() {
        var id = this.getAttribute('data-stage-id');
        savedState[id] = this.checked;
        try {
          localStorage.setItem(storageKey, JSON.stringify(savedState));
        } catch (e) {}

        var newDone = 0;
        for (var k in savedState) {
          if (savedState[k]) newDone++;
        }
        updateProgress(newDone);
      });
    }

    var markAllBtn = document.getElementById('aftercare-mark-all-btn');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', function() {
        var cbs = container.querySelectorAll('.aftercare-checkbox');
        for (var i = 0; i < cbs.length; i++) {
          cbs[i].checked = true;
          var sId = cbs[i].getAttribute('data-stage-id');
          savedState[sId] = true;
        }
        try { localStorage.setItem(storageKey, JSON.stringify(savedState)); } catch (e) {}
        updateProgress(totalItems);
      });
    }

    var unmarkAllBtn = document.getElementById('aftercare-unmark-all-btn');
    if (unmarkAllBtn) {
      unmarkAllBtn.addEventListener('click', function() {
        var cbs = container.querySelectorAll('.aftercare-checkbox');
        for (var i = 0; i < cbs.length; i++) {
          cbs[i].checked = false;
          var sId = cbs[i].getAttribute('data-stage-id');
          savedState[sId] = false;
        }
        try { localStorage.setItem(storageKey, JSON.stringify(savedState)); } catch (e) {}
        updateProgress(0);
      });
    }
  }

  /* ==========================================================================
     5. Data Backup, Export & Portability (JSON / CSV)
     ========================================================================== */
  function exportFullBackupJSON() {
    var backupObj = {
      app: 'Poli Tattoo Removal Estimator',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      profiles: [],
      photos: []
    };

    try {
      backupObj.profiles = JSON.parse(localStorage.getItem('poli_tattoo_profiles_v2') || '[]');
    } catch (e) {}

    // Include photo records from IndexedDB
    if (window.PhotoStore && window.PhotoStore.exportAllPhotos) {
      window.PhotoStore.exportAllPhotos().then(function(photos) {
        backupObj.photos = photos || [];
        triggerDownloadJSON(backupObj);
      }).catch(function() {
        triggerDownloadJSON(backupObj);
      });
    } else {
      triggerDownloadJSON(backupObj);
    }
  }

  function triggerDownloadJSON(dataObj) {
    var jsonStr = JSON.stringify(dataObj, null, 2);
    var blob = new Blob([jsonStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    var now = new Date();
    var localDate = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    a.download = 'tattoo-estimator-backup-' + localDate + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importFullBackupJSON(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var data = JSON.parse(e.target.result);
          if (!data || (!data.profiles && !Array.isArray(data))) {
            reject(new Error(t('backup.import_err_invalid')));
            return;
          }

          var importedProfiles = data.profiles || (Array.isArray(data) ? data : []);
          var existingProfiles = [];
          try {
            existingProfiles = JSON.parse(localStorage.getItem('poli_tattoo_profiles_v2') || '[]');
          } catch (err) {}

          // Merge by ID or append
          var profileMap = {};
          for (var i = 0; i < existingProfiles.length; i++) {
            profileMap[existingProfiles[i].id] = existingProfiles[i];
          }
          for (var j = 0; j < importedProfiles.length; j++) {
            profileMap[importedProfiles[j].id] = importedProfiles[j];
          }

          var mergedList = [];
          for (var id in profileMap) {
            mergedList.push(profileMap[id]);
          }

          localStorage.setItem('poli_tattoo_profiles_v2', JSON.stringify(mergedList));

          // Import photos if present
          if (data.photos && window.PhotoStore && window.PhotoStore.importPhotos) {
            window.PhotoStore.importPhotos(data.photos).then(function() {
              resolve(mergedList.length);
            }).catch(function() {
              resolve(mergedList.length);
            });
          } else {
            resolve(mergedList.length);
          }
        } catch (err) {
          reject(new Error(t('backup.import_err_invalid')));
        }
      };
      reader.onerror = function() {
        reject(new Error(t('backup.import_err_invalid')));
      };
      reader.readAsText(file);
    });
  }

  function exportFadeLogCSV(profile) {
    if (!profile || !profile.fadeLog || profile.fadeLog.length === 0) {
      alert(t('results.no_sessions_yet'));
      return;
    }

    var csvRows = [
      [t('fadelog.col_session'), t('fadelog.col_date'), t('fadelog.csv_pct'), t('fadelog.col_note')]
    ];

    for (var i = 0; i < profile.fadeLog.length; i++) {
      var entry = profile.fadeLog[i];
      csvRows.push([
        entry.sessionNumber || (i + 1),
        entry.date || '',
        (entry.fadePct || 0) + '%',
        '"' + (entry.notes || '').replace(/"/g, '""') + '"'
      ]);
    }

    var csvContent = csvRows.map(function(r) { return r.join(','); }).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (profile.name || 'tattoo').replace(/[^a-zA-Z0-9_-]/g, '_') + '-fade-log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ==========================================================================
     6. Photo Progress Viewer (Side-by-Side & Swipe Slider, Filters & Markers)
     ========================================================================== */
  var activeModalKeyHandler = null;
  var activeModalBackdropHandler = null;
  var zoomHandlersInitialized = false;
  var photoToolsInitialized = false;
  var currentZoomLevel = 2.5;

  var currentViewMode = 'side-by-side'; // 'side-by-side' | 'slider'
  var currentPhotoFilter = 'normal'; // 'normal' | 'grayscale' | 'contrast' | 'edge' | 'thermal'
  var availablePhotoFilters = ['normal', 'grayscale', 'contrast', 'edge', 'thermal'];
  var isMarkerPlacementActive = false;
  var activeViewerProfileId = null;
  var sliderSplitPercentage = 50;
  var blinkComparisonTimer = null;

  var activeBaselinePhotoUrl = null;
  var activeCurrentPhotoUrl = null;

  function safeEscapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getMarkersForProfile(profileId) {
    if (!profileId) return [];
    try {
      var raw = localStorage.getItem('poli_ink_markers_' + profileId);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    try {
      var profiles = JSON.parse(localStorage.getItem('poli_tattoo_profiles_v2') || '[]');
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].id === profileId && Array.isArray(profiles[i].inkMarkers)) {
          return profiles[i].inkMarkers;
        }
      }
    } catch (e) {}
    return [];
  }

  function saveMarkersForProfile(profileId, markers) {
    if (!profileId) return;
    try {
      localStorage.setItem('poli_ink_markers_' + profileId, JSON.stringify(markers));
    } catch (e) {}
    try {
      var profiles = JSON.parse(localStorage.getItem('poli_tattoo_profiles_v2') || '[]');
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].id === profileId) {
          profiles[i].inkMarkers = markers;
          break;
        }
      }
      localStorage.setItem('poli_tattoo_profiles_v2', JSON.stringify(profiles));
    } catch (e) {}
  }

  function deleteMarker(index) {
    var markers = getMarkersForProfile(activeViewerProfileId);
    if (index >= 0 && index < markers.length) {
      markers.splice(index, 1);
      saveMarkersForProfile(activeViewerProfileId, markers);
      renderAllMarkers();
    }
  }

  function renderAllMarkers() {
    var markers = getMarkersForProfile(activeViewerProfileId);
    var baselineLayer = document.getElementById('modal-baseline-markers');
    var currentLayer = document.getElementById('modal-current-markers');
    var sliderLayer = document.getElementById('slider-markers-layer');
    var panelEl = document.getElementById('photo-markers-panel');
    var listEl = document.getElementById('photo-markers-list');
    var countEl = document.getElementById('photo-markers-count');

    if (baselineLayer) baselineLayer.innerHTML = '';
    if (currentLayer) currentLayer.innerHTML = '';
    if (sliderLayer) sliderLayer.innerHTML = '';
    if (listEl) listEl.innerHTML = '';

    if (countEl) countEl.textContent = String(markers.length);

    if (markers.length === 0) {
      if (panelEl) panelEl.classList.add('d-none');
      return;
    }

    if (panelEl) panelEl.classList.remove('d-none');

    markers.forEach(function(m, idx) {
      var num = idx + 1;
      var label = m.label || ('Cluster #' + num);

      function createMarkerPin() {
        var pin = document.createElement('div');
        pin.className = 'ink-marker-pin';
        pin.style.left = m.xPct + '%';
        pin.style.top = m.yPct + '%';
        pin.title = t('photo.marker_tooltip', { num: num, label: label });
        pin.innerHTML = '<div class="marker-dot">' + num + '</div>' +
                        '<div class="marker-tag">' + safeEscapeHtml(label) + '</div>';
        pin.addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm(t('photo.marker_delete_confirm'))) {
            deleteMarker(idx);
          }
        });
        return pin;
      }

      if (baselineLayer) baselineLayer.appendChild(createMarkerPin());
      if (currentLayer) currentLayer.appendChild(createMarkerPin());
      if (sliderLayer) sliderLayer.appendChild(createMarkerPin());

      if (listEl) {
        var chip = document.createElement('div');
        chip.className = 'marker-chip';
        chip.innerHTML = '<span class="marker-chip-badge">' + num + '</span>' +
                         '<span>' + safeEscapeHtml(label) + '</span>' +
                         '<span class="marker-chip-del" role="button" aria-label="' + t('photo.marker_delete_aria') + '" title="' + t('photo.marker_delete_confirm') + '">×</span>';
        chip.querySelector('.marker-chip-del').addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm(t('photo.marker_delete_confirm'))) {
            deleteMarker(idx);
          }
        });
        listEl.appendChild(chip);
      }
    });
  }

  function setMarkerPlacementMode(active) {
    isMarkerPlacementActive = active;
    var btn = document.getElementById('photo-add-marker-btn');
    var banner = document.getElementById('photo-marker-banner');
    var bCont = document.getElementById('modal-baseline-container');
    var cCont = document.getElementById('modal-current-container');
    var sStage = document.getElementById('photo-slider-stage');

    if (active) {
      resetAllPhotoZoom();
      if (btn) {
        btn.textContent = t('photo.marker_active_btn');
        btn.classList.add('btn-primary');
      }
      if (banner) banner.classList.remove('d-none');
      if (bCont) bCont.classList.add('marker-placement-active');
      if (cCont) cCont.classList.add('marker-placement-active');
      if (sStage) sStage.classList.add('marker-placement-active');
    } else {
      if (btn) {
        btn.textContent = t('photo.marker_btn');
        btn.classList.remove('btn-primary');
      }
      if (banner) banner.classList.add('d-none');
      if (bCont) bCont.classList.remove('marker-placement-active');
      if (cCont) cCont.classList.remove('marker-placement-active');
      if (sStage) sStage.classList.remove('marker-placement-active');
    }
  }

  function handlePhotoTargetClickForMarker(e, container) {
    if (!isMarkerPlacementActive) return;
    if (e.target.closest('.ink-marker-pin')) return;
    e.stopPropagation();

    var rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    var clickX = e.clientX - rect.left;
    var clickY = e.clientY - rect.top;
    var xPct = Math.max(2, Math.min(98, (clickX / rect.width) * 100));
    var yPct = Math.max(2, Math.min(98, (clickY / rect.height) * 100));

    var markers = getMarkersForProfile(activeViewerProfileId);
    var defName = 'Cluster #' + (markers.length + 1);
    var entered = prompt(t('photo.marker_prompt_title'), defName);
    if (entered !== null) {
      var label = entered.trim() || defName;
      markers.push({
        id: 'mk_' + Date.now(),
        xPct: parseFloat(xPct.toFixed(2)),
        yPct: parseFloat(yPct.toFixed(2)),
        label: label,
        createdAt: new Date().toISOString()
      });
      saveMarkersForProfile(activeViewerProfileId, markers);
      renderAllMarkers();
    }
    setMarkerPlacementMode(false);
  }

  function applyPhotoFilter(filterName) {
    if (availablePhotoFilters.indexOf(filterName) === -1) filterName = 'normal';
    currentPhotoFilter = filterName;

    var filterPills = document.querySelectorAll('#photo-filter-pills .photo-tool-pill');
    for (var i = 0; i < filterPills.length; i++) {
      var pill = filterPills[i];
      var pFilter = pill.getAttribute('data-filter');
      var isActive = (pFilter === filterName);
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    var targetImgs = [
      document.getElementById('modal-baseline-img'),
      document.getElementById('modal-current-img'),
      document.getElementById('slider-base-img'),
      document.getElementById('slider-overlay-img')
    ];

    targetImgs.forEach(function(img) {
      if (!img) return;
      availablePhotoFilters.forEach(function(f) {
        img.classList.remove('photo-filter-' + f);
      });
      img.classList.add('photo-filter-' + filterName);
    });
  }

  function setSliderSplit(pct) {
    pct = Math.max(0, Math.min(100, pct));
    sliderSplitPercentage = pct;
    var stage = document.getElementById('photo-slider-stage');
    var range = document.getElementById('photo-slider-range');
    var clip = document.getElementById('slider-clip-pane');
    var line = document.getElementById('slider-divider-line');

    if (stage) stage.style.setProperty('--slider-split', pct + '%');
    if (clip) {
      clip.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      clip.style.webkitClipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    }
    if (line) line.style.left = pct + '%';
    if (range && document.activeElement !== range) range.value = String(pct);
  }

  function setPhotoViewMode(mode) {
    currentViewMode = mode;
    var sideGrid = document.getElementById('photo-comparison-grid');
    var sliderWrapper = document.getElementById('photo-slider-wrapper');
    var modePills = document.querySelectorAll('#photo-view-mode-pills .photo-tool-pill');

    for (var i = 0; i < modePills.length; i++) {
      var pill = modePills[i];
      var pMode = pill.getAttribute('data-mode');
      var isActive = (pMode === mode);
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    if (mode === 'slider') {
      if (sideGrid) sideGrid.classList.add('d-none');
      if (sliderWrapper) sliderWrapper.classList.remove('d-none');
      setSliderSplit(sliderSplitPercentage);
      syncSliderImages();
    } else {
      if (sliderWrapper) sliderWrapper.classList.add('d-none');
      if (sideGrid) sideGrid.classList.remove('d-none');
    }
    resetAllPhotoZoom();
    renderAllMarkers();
  }

  function syncSliderImages() {
    var baseImg = document.getElementById('slider-base-img');
    var overlayImg = document.getElementById('slider-overlay-img');
    if (baseImg) {
      if (activeCurrentPhotoUrl) {
        baseImg.src = activeCurrentPhotoUrl;
        baseImg.classList.remove('d-none');
      } else {
        baseImg.src = '';
        baseImg.classList.add('d-none');
      }
    }
    if (overlayImg) {
      if (activeBaselinePhotoUrl) {
        overlayImg.src = activeBaselinePhotoUrl;
        overlayImg.classList.remove('d-none');
      } else {
        overlayImg.src = '';
        overlayImg.classList.add('d-none');
      }
    }
    applyPhotoFilter(currentPhotoFilter);
  }

  function initPhotoToolsController() {
    if (photoToolsInitialized) return;
    photoToolsInitialized = true;

    // View Mode selector pills
    var modePills = document.querySelectorAll('#photo-view-mode-pills .photo-tool-pill');
    for (var m = 0; m < modePills.length; m++) {
      modePills[m].addEventListener('click', function(e) {
        var mode = e.currentTarget.getAttribute('data-mode') || 'side-by-side';
        setPhotoViewMode(mode);
      });
    }

    // Photo filter selector pills
    var filterPills = document.querySelectorAll('#photo-filter-pills .photo-tool-pill');
    for (var f = 0; f < filterPills.length; f++) {
      filterPills[f].addEventListener('click', function(e) {
        var filter = e.currentTarget.getAttribute('data-filter') || 'normal';
        applyPhotoFilter(filter);
      });
    }

    // Marker mode toggle button
    var addMarkerBtn = document.getElementById('photo-add-marker-btn');
    if (addMarkerBtn) {
      addMarkerBtn.addEventListener('click', function() {
        setMarkerPlacementMode(!isMarkerPlacementActive);
      });
    }

    // Clear all markers button
    var clearMarkersBtn = document.getElementById('photo-clear-markers-btn');
    if (clearMarkersBtn) {
      clearMarkersBtn.addEventListener('click', function() {
        if (confirm(t('photo.marker_confirm_clear'))) {
          saveMarkersForProfile(activeViewerProfileId, []);
          renderAllMarkers();
        }
      });
    }

    // Target clicking on containers to place markers
    var targetContainers = [
      document.getElementById('modal-baseline-container'),
      document.getElementById('modal-current-container'),
      document.getElementById('photo-slider-stage')
    ];
    targetContainers.forEach(function(cont) {
      if (!cont) return;
      cont.addEventListener('click', function(e) {
        handlePhotoTargetClickForMarker(e, cont);
      });
    });

    // Slider stage dragging interaction
    var sliderStage = document.getElementById('photo-slider-stage');
    var sliderRange = document.getElementById('photo-slider-range');
    var flashBtn = document.getElementById('photo-slider-flash-btn');

    if (sliderStage) {
      var isDraggingSlider = false;

      function updateSplitFromPointer(clientX) {
        var rect = sliderStage.getBoundingClientRect();
        if (rect.width === 0) return;
        var offset = clientX - rect.left;
        var pct = (offset / rect.width) * 100;
        setSliderSplit(pct);
      }

      sliderStage.addEventListener('pointerdown', function(e) {
        if (isMarkerPlacementActive) return;
        if (e.target.closest('.ink-marker-pin')) return;
        isDraggingSlider = true;
        try { sliderStage.setPointerCapture(e.pointerId); } catch (err) {}
        updateSplitFromPointer(e.clientX);
      });

      sliderStage.addEventListener('pointermove', function(e) {
        if (isDraggingSlider) {
          updateSplitFromPointer(e.clientX);
        }
      });

      function endSliderDrag(e) {
        if (isDraggingSlider) {
          isDraggingSlider = false;
          try { sliderStage.releasePointerCapture(e.pointerId); } catch (err) {}
        }
      }
      sliderStage.addEventListener('pointerup', endSliderDrag);
      sliderStage.addEventListener('pointercancel', endSliderDrag);

      // Support direct touch if Pointer Events touch capture has nuances
      sliderStage.addEventListener('touchstart', function(e) {
        if (isMarkerPlacementActive) return;
        if (e.target.closest('.ink-marker-pin')) return;
        if (e.touches && e.touches.length === 1) {
          isDraggingSlider = true;
          updateSplitFromPointer(e.touches[0].clientX);
        }
      }, { passive: true });

      sliderStage.addEventListener('touchmove', function(e) {
        if (isDraggingSlider && e.touches && e.touches.length === 1) {
          updateSplitFromPointer(e.touches[0].clientX);
        }
      }, { passive: true });

      sliderStage.addEventListener('touchend', function() { isDraggingSlider = false; });
      sliderStage.addEventListener('touchcancel', function() { isDraggingSlider = false; });
    }

    if (sliderRange) {
      sliderRange.addEventListener('input', function() {
        setSliderSplit(parseFloat(sliderRange.value) || 50);
      });
    }

    if (flashBtn) {
      flashBtn.addEventListener('click', function() {
        if (blinkComparisonTimer) {
          clearInterval(blinkComparisonTimer);
          blinkComparisonTimer = null;
          flashBtn.classList.remove('btn-primary');
          setSliderSplit(50);
          return;
        }
        var count = 0;
        flashBtn.classList.add('btn-primary');
        blinkComparisonTimer = setInterval(function() {
          count++;
          setSliderSplit(count % 2 === 0 ? 100 : 0);
          if (count >= 8) {
            clearInterval(blinkComparisonTimer);
            blinkComparisonTimer = null;
            flashBtn.classList.remove('btn-primary');
            setSliderSplit(50);
          }
        }, 360);
      });
    }
  }

  function resetAllPhotoZoom() {
    var slots = ['baseline', 'current'];
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      var containerEl = document.getElementById('modal-' + slot + '-container');
      var imgEl = document.getElementById('modal-' + slot + '-img');
      if (containerEl) {
        containerEl.classList.remove('is-zoomed');
      }
      if (imgEl) {
        imgEl.style.transform = 'scale(1)';
        imgEl.style.transformOrigin = 'center center';
      }
    }
  }

  function initPhotoZoomController() {
    if (zoomHandlersInitialized) return;
    zoomHandlersInitialized = true;

    // Zoom level power selector buttons
    var zoomPills = document.querySelectorAll('.photo-zoom-pill');
    for (var zp = 0; zp < zoomPills.length; zp++) {
      zoomPills[zp].addEventListener('click', function(e) {
        var btn = e.currentTarget;
        var zVal = parseFloat(btn.getAttribute('data-zoom')) || 2.5;
        currentZoomLevel = zVal;
        for (var k = 0; k < zoomPills.length; k++) {
          zoomPills[k].classList.remove('active');
          zoomPills[k].setAttribute('aria-pressed', 'false');
        }
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      });
    }

    // Set up hover-to-zoom on both photo containers
    var slots = ['baseline', 'current'];
    slots.forEach(function(slot) {
      var container = document.getElementById('modal-' + slot + '-container');
      var imgEl = document.getElementById('modal-' + slot + '-img');
      if (!container || !imgEl) return;

      var initialRect = null;

      function getCleanRect() {
        var prevTransform = imgEl.style.transform;
        imgEl.style.transform = 'scale(1)';
        var r = imgEl.getBoundingClientRect();
        imgEl.style.transform = prevTransform;
        return r;
      }

      function startZoom(clientX, clientY) {
        if (isMarkerPlacementActive) return; // Suppress zoom while placing ink markers
        if (!imgEl || imgEl.classList.contains('d-none') || !imgEl.getAttribute('src')) return;
        container.classList.add('is-zoomed');
        initialRect = getCleanRect();
        updateZoom(clientX, clientY);
      }

      function updateZoom(clientX, clientY) {
        if (isMarkerPlacementActive) return;
        if (!imgEl || !initialRect || initialRect.width === 0 || initialRect.height === 0) return;
        var x = clientX - initialRect.left;
        var y = clientY - initialRect.top;
        var xPct = Math.max(0, Math.min(100, (x / initialRect.width) * 100));
        var yPct = Math.max(0, Math.min(100, (y / initialRect.height) * 100));
        imgEl.style.transformOrigin = xPct.toFixed(2) + '% ' + yPct.toFixed(2) + '%';
        imgEl.style.transform = 'scale(' + currentZoomLevel + ')';
      }

      function endZoom() {
        container.classList.remove('is-zoomed');
        initialRect = null;
        if (imgEl) {
          imgEl.style.transform = 'scale(1)';
          imgEl.style.transformOrigin = 'center center';
        }
      }

      // Mouse hover tracking
      container.addEventListener('mouseenter', function(e) {
        if (!isMarkerPlacementActive) startZoom(e.clientX, e.clientY);
      });

      container.addEventListener('mousemove', function(e) {
        if (isMarkerPlacementActive) return;
        if (!container.classList.contains('is-zoomed')) {
          startZoom(e.clientX, e.clientY);
        } else {
          updateZoom(e.clientX, e.clientY);
        }
      });

      container.addEventListener('mouseleave', function() {
        endZoom();
      });

      // Touch events for mobile inspection
      container.addEventListener('touchstart', function(e) {
        if (isMarkerPlacementActive) return;
        if (e.touches && e.touches.length === 1) {
          startZoom(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      container.addEventListener('touchmove', function(e) {
        if (isMarkerPlacementActive) return;
        if (e.touches && e.touches.length === 1 && container.classList.contains('is-zoomed')) {
          updateZoom(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      container.addEventListener('touchend', function() {
        endZoom();
      });
      container.addEventListener('touchcancel', function() {
        endZoom();
      });
    });
  }

  function renderPhotoSlot(slot, dataUrl, meta) {
    var imgEl = document.getElementById('modal-' + slot + '-img');
    var emptyEl = document.getElementById('modal-' + slot + '-empty');
    var metaEl = document.getElementById(slot + '-session-meta');
    var containerEl = document.getElementById('modal-' + slot + '-container');
    var zoomBadgeEl = document.getElementById('modal-' + slot + '-zoom-badge');

    if (slot === 'baseline') activeBaselinePhotoUrl = dataUrl;
    if (slot === 'current') activeCurrentPhotoUrl = dataUrl;

    if (dataUrl) {
      if (imgEl) {
        imgEl.src = dataUrl;
        imgEl.classList.remove('d-none');
        imgEl.style.transform = 'scale(1)';
        imgEl.style.transformOrigin = 'center center';
      }
      if (containerEl) {
        containerEl.classList.add('has-photo');
        containerEl.classList.remove('is-zoomed');
      }
      if (zoomBadgeEl) zoomBadgeEl.classList.remove('d-none');
      if (emptyEl) emptyEl.classList.add('d-none');
    } else {
      if (imgEl) {
        imgEl.src = '';
        imgEl.classList.add('d-none');
        imgEl.style.transform = 'scale(1)';
        imgEl.style.transformOrigin = 'center center';
      }
      if (containerEl) {
        containerEl.classList.remove('has-photo');
        containerEl.classList.remove('is-zoomed');
      }
      if (zoomBadgeEl) zoomBadgeEl.classList.add('d-none');
      if (emptyEl) emptyEl.classList.remove('d-none');
    }

    if (metaEl) {
      if (meta) {
        var metaParts = [];
        if (meta.date) metaParts.push(meta.date);
        if (meta.fadeRating !== null && meta.fadeRating !== undefined) {
          metaParts.push(t('fadelog.rating_label') + ': ' + meta.fadeRating + '/10');
        }
        metaEl.textContent = metaParts.join(' • ');
      } else {
        metaEl.textContent = '';
      }
    }

    syncSliderImages();
  }

  function updateActiveComparison(profileId, bSess, cSess, sessionMetaMap) {
    var summaryEl = document.getElementById('photo-comparison-summary');
    var summaryText = document.getElementById('photo-comparison-text');

    // Update tags in slider mode
    var tagLeft = document.getElementById('slider-ctrl-baseline-label');
    var tagRight = document.getElementById('slider-ctrl-current-label');
    var stageTagLeft = document.getElementById('slider-tag-left');
    var stageTagRight = document.getElementById('slider-tag-right');

    var bMeta = sessionMetaMap ? sessionMetaMap[bSess] : null;
    var cMeta = sessionMetaMap ? sessionMetaMap[cSess] : null;

    var bLabel = 'S' + bSess + (bMeta && bMeta.date ? ' (' + bMeta.date + ')' : '');
    var cLabel = 'S' + cSess + (cMeta && cMeta.date ? ' (' + cMeta.date + ')' : '');

    if (tagLeft) tagLeft.textContent = t('photo.slider_baseline_tag') + ': ' + bLabel;
    if (tagRight) tagRight.textContent = t('photo.slider_current_tag') + ': ' + cLabel;
    if (stageTagLeft) stageTagLeft.textContent = bLabel;
    if (stageTagRight) stageTagRight.textContent = cLabel;

    // Load baseline photo
    if (window.PhotoStore && window.PhotoStore.getPhoto) {
      window.PhotoStore.getPhoto(profileId, bSess).then(function(bRec) {
        var bUrl = (bRec && bRec.dataUrl) ? bRec.dataUrl : null;
        renderPhotoSlot('baseline', bUrl, bMeta);
      }).catch(function() {
        renderPhotoSlot('baseline', null, bMeta);
      });

      // Load comparison photo
      window.PhotoStore.getPhoto(profileId, cSess).then(function(cRec) {
        var cUrl = (cRec && cRec.dataUrl) ? cRec.dataUrl : null;
        renderPhotoSlot('current', cUrl, cMeta);
      }).catch(function() {
        renderPhotoSlot('current', null, cMeta);
      });
    }

    // Calculate progression comparison if both sessions have fade ratings
    if (bMeta && cMeta && bMeta.fadeRating !== null && cMeta.fadeRating !== null && summaryEl && summaryText) {
      var bRating = parseFloat(bMeta.fadeRating);
      var cRating = parseFloat(cMeta.fadeRating);
      var diffPct = 0;
      if (bRating > 0) {
        diffPct = Math.round(((bRating - cRating) / bRating) * 100);
      }
      if (diffPct < 0) diffPct = 0;
      summaryText.textContent = t('photo.progress_summary', {
        s1: bSess,
        r1: bRating,
        s2: cSess,
        r2: cRating,
        diff: diffPct
      });
      summaryEl.classList.remove('d-none');
    } else if (summaryEl) {
      summaryEl.classList.add('d-none');
    }

    renderAllMarkers();
  }

  function openPhotoModal(profileId, preferredBaselineSession, preferredCurrentSession) {
    var modalEl = document.getElementById('photo-modal');
    if (!modalEl) return;

    activeViewerProfileId = profileId;

    var baselineSelect = document.getElementById('photo-select-baseline');
    var currentSelect = document.getElementById('photo-select-current');
    var swapBtn = document.getElementById('photo-swap-btn');
    var summaryEl = document.getElementById('photo-comparison-summary');

    // Retrieve active profile to correlate session metadata (date, fade rating)
    var profileList = [];
    try {
      profileList = JSON.parse(localStorage.getItem('poli_tattoo_profiles_v2') || '[]');
    } catch (e) {}
    var activeProf = null;
    for (var p = 0; p < profileList.length; p++) {
      if (profileList[p].id === profileId) {
        activeProf = profileList[p];
        break;
      }
    }
    var fadeLog = (activeProf && activeProf.fadeLog) ? activeProf.fadeLog : [];
    var sessionMetaMap = {};
    for (var f = 0; f < fadeLog.length; f++) {
      var item = fadeLog[f];
      var sNum = item.sessionNumber || (f + 1);
      sessionMetaMap[sNum] = {
        date: item.date || '',
        fadeRating: (item.fadeRating !== undefined && item.fadeRating !== null && item.fadeRating !== '') ? item.fadeRating : (item.fadePct !== undefined ? Math.round(item.fadePct / 10) : null),
        notes: item.notes || ''
      };
    }

    // Initialize controls
    initPhotoToolsController();
    initPhotoZoomController();
    setMarkerPlacementMode(false);
    applyPhotoFilter(currentPhotoFilter || 'normal');

    if (!window.PhotoStore || !window.PhotoStore.getPhotosForProfile) {
      modalEl.classList.remove('d-none');
      renderAllMarkers();
      return;
    }

    window.PhotoStore.getPhotosForProfile(profileId).then(function(photoRecords) {
      photoRecords = photoRecords || [];
      photoRecords.sort(function(a, b) {
        return (parseInt(a.sessionIndex, 10) || 0) - (parseInt(b.sessionIndex, 10) || 0);
      });

      if (baselineSelect) baselineSelect.innerHTML = '';
      if (currentSelect) currentSelect.innerHTML = '';

      if (photoRecords.length === 0) {
        if (baselineSelect) {
          baselineSelect.innerHTML = '<option value="">' + t('photo.no_photos_yet') + '</option>';
          baselineSelect.disabled = true;
        }
        if (currentSelect) {
          currentSelect.innerHTML = '<option value="">' + t('photo.no_photos_yet') + '</option>';
          currentSelect.disabled = true;
        }
        if (swapBtn) swapBtn.disabled = true;
        renderPhotoSlot('baseline', null, null);
        renderPhotoSlot('current', null, null);
        if (summaryEl) summaryEl.classList.add('d-none');
        modalEl.classList.remove('d-none');
        renderAllMarkers();
        return;
      }

      if (baselineSelect) baselineSelect.disabled = false;
      if (currentSelect) currentSelect.disabled = false;
      if (swapBtn) swapBtn.disabled = false;

      for (var r = 0; r < photoRecords.length; r++) {
        var rec = photoRecords[r];
        var sIdx = parseInt(rec.sessionIndex, 10) || (r + 1);
        var meta = sessionMetaMap[sIdx];
        var optLabel = '';
        var dateDisplay = meta && meta.date ? meta.date : rec.date;
        if (meta && meta.fadeRating !== null && meta.fadeRating !== undefined) {
          optLabel = t('photo.session_option_label', { s: sIdx, date: dateDisplay || '—', r: meta.fadeRating });
        } else {
          optLabel = t('photo.session_option_no_rating', { s: sIdx, date: dateDisplay || '—' });
        }

        if (baselineSelect) {
          var optB = document.createElement('option');
          optB.value = String(sIdx);
          optB.textContent = optLabel;
          baselineSelect.appendChild(optB);
        }
        if (currentSelect) {
          var optC = document.createElement('option');
          optC.value = String(sIdx);
          optC.textContent = optLabel;
          currentSelect.appendChild(optC);
        }
      }

      var availableSessions = photoRecords.map(function(p) { return parseInt(p.sessionIndex, 10) || 1; });
      var initBaseline = (preferredBaselineSession && availableSessions.indexOf(parseInt(preferredBaselineSession, 10)) !== -1)
        ? parseInt(preferredBaselineSession, 10)
        : availableSessions[0];

      var initCurrent = (preferredCurrentSession && availableSessions.indexOf(parseInt(preferredCurrentSession, 10)) !== -1)
        ? parseInt(preferredCurrentSession, 10)
        : availableSessions[availableSessions.length - 1];

      if (baselineSelect) baselineSelect.value = String(initBaseline);
      if (currentSelect) currentSelect.value = String(initCurrent);

      updateActiveComparison(profileId, initBaseline, initCurrent, sessionMetaMap);

      if (baselineSelect) {
        baselineSelect.onchange = function() {
          var bVal = parseInt(baselineSelect.value, 10);
          var cVal = parseInt(currentSelect ? currentSelect.value : initCurrent, 10);
          updateActiveComparison(profileId, bVal, cVal, sessionMetaMap);
        };
      }

      if (currentSelect) {
        currentSelect.onchange = function() {
          var bVal = parseInt(baselineSelect ? baselineSelect.value : initBaseline, 10);
          var cVal = parseInt(currentSelect.value, 10);
          updateActiveComparison(profileId, bVal, cVal, sessionMetaMap);
        };
      }

      if (swapBtn) {
        swapBtn.onclick = function() {
          if (!baselineSelect || !currentSelect) return;
          var temp = baselineSelect.value;
          baselineSelect.value = currentSelect.value;
          currentSelect.value = temp;
          var bVal = parseInt(baselineSelect.value, 10);
          var cVal = parseInt(currentSelect.value, 10);
          updateActiveComparison(profileId, bVal, cVal, sessionMetaMap);
        };
      }

      modalEl.classList.remove('d-none');
      resetAllPhotoZoom();
      renderAllMarkers();
    }).catch(function(err) {
      console.error('Failed to load photos for profile:', err);
      modalEl.classList.remove('d-none');
      resetAllPhotoZoom();
      renderAllMarkers();
    });

    if (activeModalKeyHandler) document.removeEventListener('keydown', activeModalKeyHandler);
    activeModalKeyHandler = function(e) {
      if (e.key === 'Escape') closePhotoModal();
    };
    document.addEventListener('keydown', activeModalKeyHandler);

    if (activeModalBackdropHandler) modalEl.removeEventListener('click', activeModalBackdropHandler);
    activeModalBackdropHandler = function(e) {
      if (e.target === modalEl) closePhotoModal();
    };
    modalEl.addEventListener('click', activeModalBackdropHandler);
  }

  function closePhotoModal() {
    var modalEl = document.getElementById('photo-modal');
    if (modalEl) modalEl.classList.add('d-none');
    resetAllPhotoZoom();
    setMarkerPlacementMode(false);
    if (blinkComparisonTimer) {
      clearInterval(blinkComparisonTimer);
      blinkComparisonTimer = null;
    }
    if (activeModalKeyHandler) {
      document.removeEventListener('keydown', activeModalKeyHandler);
      activeModalKeyHandler = null;
    }
  }

  window.ClinicalFeatures = {
    renderCoverupMatrix: renderCoverupMatrix,
    renderTrajectoryChart: renderTrajectoryChart,
    renderAftercareChecklist: renderAftercareChecklist,
    exportFullBackupJSON: exportFullBackupJSON,
    importFullBackupJSON: importFullBackupJSON,
    exportFadeLogCSV: exportFadeLogCSV,
    openPhotoModal: openPhotoModal,
    closePhotoModal: closePhotoModal
  };

})(typeof window !== 'undefined' ? window : this);
