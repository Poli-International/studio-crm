/**
 * Poli International - Interactive 3D Human Anatomy Model
 * High-performance, self-contained SVG 3D projection engine.
 * Allows piercers and clients to rotate anatomical figures in 3D perspective,
 * inspect clinical insertion vectors, and jump to specific piercing guides.
 * Zero external libraries, fully self-contained offline architecture.
 */

(function () {
  'use strict';

  var currentView = 'full';
  var orbitAngle = 0; // degrees: -90 to +90
  var activeHotspotKey = 'earlobe';
  var onSelectCallback = null;
  var isDragging = false;
  var startX = 0;
  var startY = 0;
  var startOrbit = 0;
  var startPanX = 0;
  var startPanY = 0;
  var interactionMode = 'orbit'; // 'orbit' | 'pan'
  var zoomLevel = 1.0; // 0.7 to 3.5
  var panX = 0;
  var panY = 0;

  function reset3dView() {
    orbitAngle = 0;
    zoomLevel = 1.0;
    panX = 0;
    panY = 0;
    renderExplorerCanvas();
  }

  // 3D Anatomical Landmarks Database [x, y, z] (origin: center of viewport)
  // X: -100 to +100 (left/right), Y: -140 to +140 (top/bottom), Z: -100 to +100 (back/front)
  var anatomicalLandmarks = {
    full: {
      svgWidth: 360,
      svgHeight: 380,
      centerX: 180,
      centerY: 180,
      nodes: [
        { key: 'eyebrow', name: 'Eyebrow', cat: 'Facial', x: 22, y: -118, z: 28, angle: '90° to Supraorbital Ridge', depth: '2.0 - 4.0 mm', jw: '16g Curved Barbell', desc: 'Perpendicular flush entry avoids supraorbital notch and frontalis muscle fascial binding.' },
        { key: 'bridge', name: 'Bridge (Erl)', cat: 'Facial', x: 0, y: -110, z: 32, angle: '90° Perpendicular to Nasion', depth: '2.5 - 4.5 mm', jw: '14g/12g Straight Barbell', desc: 'Strict transverse alignment between medial canthi ensures no bone impingement.' },
        { key: 'nostril', name: 'Nostril', cat: 'Facial', x: 16, y: -94, z: 34, angle: '90° to Ala Curvature', depth: '1.5 - 3.5 mm', jw: '18g/16g Labret or Screw', desc: 'Perpendicular flush alignment prevents angular distortion through the alar crease.' },
        { key: 'septum', name: 'Septum', cat: 'Facial', x: 0, y: -90, z: 38, angle: '90° through Columellar Pocket', depth: '1.0 - 2.5 mm', jw: '16g/14g Circular Barbell', desc: 'True apex placement in the membranous sweet spot above alar cartilage.' },
        { key: 'labret', name: 'Labret / Lip', cat: 'Oral', x: 0, y: -72, z: 32, angle: '90° to Vermilion Border', depth: '3.0 - 6.5 mm', jw: '16g/14g Flat-Back Labret', desc: 'Perpendicular mucosal entry prevents intraoral tooth and gingival abrasion.' },
        { key: 'earlobe', name: 'Earlobe', cat: 'Auricular', x: 42, y: -92, z: -5, angle: '90° to Lobule Plane', depth: '4.0 - 8.0 mm', jw: '18g/16g Labret Stud', desc: 'Perpendicular coronal baseline prevents downward gravitational droop.' },
        { key: 'helix', name: 'Helix', cat: 'Auricular', x: 45, y: -124, z: -8, angle: '90° to Cartilage Plate', depth: '1.0 - 2.5 mm', jw: '16g Flat-Back Labret', desc: 'Orthogonal trajectory prevents hypertrophic cartilage notch formation.' },
        { key: 'nipple', name: 'Nipple', cat: 'Torso', x: 38, y: -2, z: 24, angle: '90° Transverse Areolar Plane', depth: '3.5 - 6.5 mm', jw: '14g/12g Straight Barbell', desc: 'True coronal baseline through erectile base tissue, avoiding areolar dermal layer.' },
        { key: 'navel', name: 'Navel (Umbilicus)', cat: 'Torso', x: 0, y: 72, z: 22, angle: '90° through Superior Hood', depth: '8.0 - 14.0 mm', jw: '14g Curved Barbell', desc: 'Deep superior shelf entry exiting inside umbilical cavity prevents migration.' },
        { key: 'dermal', name: 'Single-Point Dermal', cat: 'Surface', x: 0, y: -30, z: 26, angle: '90° Subdermal Anchor', depth: '2.0 - 3.0 mm', jw: '14g Anchor Base & Top', desc: 'Flat subdermal footplate seating prevents angled tilting and snagging.' }
      ]
    },
    head: {
      svgWidth: 360,
      svgHeight: 380,
      centerX: 180,
      centerY: 185,
      nodes: [
        { key: 'dermal', name: 'Third Eye / Bindi Dermal', cat: 'Surface', x: 0, y: -90, z: 40, angle: '90° Mid-Forehead Plane', depth: '2.0 - 3.0 mm', jw: '14g Anchor Base', desc: 'Strict vertical midline alignment between eyebrows.' },
        { key: 'eyebrow', name: 'Eyebrow', cat: 'Facial', x: 30, y: -64, z: 34, angle: '90° to Supraorbital Ridge', depth: '2.0 - 4.0 mm', jw: '16g Curved Barbell', desc: 'Perpendicular flush entry avoids supraorbital nerve notch.' },
        { key: 'bridge', name: 'Bridge (Erl)', cat: 'Facial', x: 0, y: -48, z: 40, angle: '90° to Nasal Bone Plane', depth: '2.5 - 4.5 mm', jw: '14g Straight Barbell', desc: 'Perpendicular transverse pinch test across nasion tissue.' },
        { key: 'high-nostril', name: 'High Nostril', cat: 'Facial', x: 18, y: -26, z: 46, angle: '90° to Lateral Nasal Vault', depth: '1.5 - 3.0 mm', jw: '18g/16g Labret Stud', desc: 'Perpendicular entry superior to alar groove with custom insertion tapers.' },
        { key: 'nostril', name: 'Nostril', cat: 'Facial', x: 26, y: -6, z: 46, angle: '90° to Alar Crease Curve', depth: '1.5 - 3.5 mm', jw: '18g/16g Labret / Screw', desc: 'Perpendicular flush alignment prevents angular distortion through the alar groove.' },
        { key: 'septum', name: 'Septum', cat: 'Facial', x: 0, y: 2, z: 52, angle: '90° through Columellar Pocket', depth: '1.0 - 2.5 mm', jw: '16g/14g Circular Barbell', desc: 'Membranous sweet spot between cartilage and alar tip.' },
        { key: 'medusa', name: 'Medusa (Philtrum)', cat: 'Oral', x: 0, y: 15, z: 46, angle: '90° to Philtral Column', depth: '3.0 - 5.5 mm', jw: '16g/14g Labret Stud', desc: 'Strict midline alignment within vertical philtral groove.' },
        { key: 'monroe', name: 'Monroe / Madonna', cat: 'Oral', x: 22, y: 17, z: 42, angle: '90° to Maxillary Labial Plane', depth: '3.0 - 5.5 mm', jw: '16g Labret Stud', desc: 'Upper lip beauty mark placement with flat back clearance.' },
        { key: 'labret', name: 'Labret (Lower Lip)', cat: 'Oral', x: 0, y: 36, z: 43, angle: '90° to Vermilion Border', depth: '3.5 - 6.5 mm', jw: '16g/14g Labret Stud', desc: 'Orthogonal trajectory perpendicular to lower labial tissue.' },
        { key: 'snake-bites', name: 'Snake Bites (Lower Lip)', cat: 'Oral', x: 24, y: 36, z: 39, angle: '90° to Mandibular Border', depth: '3.5 - 6.5 mm', jw: '16g Labret Studs', desc: 'Bilateral equidistant spacing outward from lower lip vermilion center.' },
        { key: 'tongue', name: 'Tongue', cat: 'Oral', x: 0, y: 25, z: 26, angle: '90° Lingual Perpendicular', depth: '8.0 - 16.0 mm', jw: '14g Straight Barbell', desc: 'Perpendicular to relaxed dorsal surface anterior to lingual frenulum.' },
        { key: 'tragus', name: 'Tragus', cat: 'Auricular', x: 56, y: -10, z: 2, angle: '90° to Tragal Cartilage', depth: '1.5 - 3.5 mm', jw: '16g Labret Stud', desc: 'Center cartilage alignment avoiding auditory canal intrusion.' },
        { key: 'earlobe', name: 'Earlobe', cat: 'Auricular', x: 64, y: 18, z: -6, angle: '90° to Lobule Plane', depth: '4.0 - 8.0 mm', jw: '18g/16g Labret Stud', desc: 'Orthogonal coronal alignment centered on tissue bulk.' }
      ]
    },
    ear: {
      svgWidth: 360,
      svgHeight: 380,
      centerX: 180,
      centerY: 185,
      nodes: [
        { key: 'helix', name: 'Helix (Outer Rim)', cat: 'Auricular', x: 40, y: -110, z: 10, angle: '90° Perpendicular to Rim', depth: '1.0 - 2.5 mm', jw: '16g Flat-Back Labret', desc: 'Perpendicular baseline prevents angular migration and cartilage notches.' },
        { key: 'forward-helix', name: 'Forward Helix', cat: 'Auricular', x: -42, y: -90, z: 24, angle: '90° to Ascending Root', depth: '1.2 - 2.6 mm', jw: '18g/16g Labret Stud', desc: 'Orthogonal to anterior curvature with flat disc clearance.' },
        { key: 'industrial', name: 'Industrial (Scapha)', cat: 'Auricular', x: 2, y: -80, z: 18, angle: 'Single Co-Linear Barbell Axis', depth: '28 - 38 mm Bar Span', jw: '14g Straight Barbell', desc: 'Precise co-linear alignment across both entry channels prevents tension.' },
        { key: 'rook', name: 'Rook', cat: 'Auricular', x: -20, y: -55, z: 22, angle: '90° through Inferior Crus', depth: '2.0 - 3.8 mm', jw: '16g Curved Barbell', desc: 'Vertical channel exiting into triangular fossa.' },
        { key: 'daith', name: 'Daith', cat: 'Auricular', x: -28, y: -25, z: 28, angle: '90° through Helix Crus', depth: '2.0 - 3.5 mm', jw: '16g/14g CBR / Clicker', desc: 'Deep innermost fold penetration seated centrally in concha basin.' },
        { key: 'tragus', name: 'Tragus', cat: 'Auricular', x: -64, y: 5, z: 32, angle: '90° to Tragal Plate', depth: '1.5 - 3.5 mm', jw: '16g Flat-Back Labret', desc: 'Perpendicular cartilage entry centered between root and apex.' },
        { key: 'anti-tragus', name: 'Anti-Tragus', cat: 'Auricular', x: -30, y: 52, z: 20, angle: '90° through Cartilaginous Ridge', depth: '2.5 - 4.5 mm', jw: '16g Curved Barbell', desc: 'Perpendicular through elevated cartilage ridge above lobule.' },
        { key: 'conch', name: 'Conch', cat: 'Auricular', x: 0, y: 10, z: 16, angle: '90° through Concha Cavity', depth: '1.5 - 3.2 mm', jw: '16g/14g Labret Stud', desc: 'Perpendicular exit into rear mastoid groove.' },
        { key: 'snug', name: 'Snug (Antihelix)', cat: 'Auricular', x: 18, y: 25, z: 15, angle: '90° through Antihelix Ridge', depth: '3.0 - 5.5 mm', jw: '16g Curved Barbell', desc: 'Transverse penetration from concha to scaphoid groove.' },
        { key: 'earlobe', name: 'Earlobe (Standard)', cat: 'Auricular', x: -25, y: 105, z: 6, angle: '90° Perpendicular to Lobule', depth: '4.0 - 8.0 mm', jw: '18g/16g Labret Stud', desc: 'Perpendicular coronal baseline prevents downward gravitational droop.' },
        { key: 'upper-lobe', name: 'Upper / Second Lobe', cat: 'Auricular', x: 0, y: 80, z: 8, angle: '90° to Lobule Transition', depth: '3.0 - 6.0 mm', jw: '18g/16g Labret Stud', desc: 'Equidistant trajectory parallel to primary lobe channel.' }
      ]
    },
    torso: {
      svgWidth: 360,
      svgHeight: 380,
      centerX: 180,
      centerY: 180,
      nodes: [
        { key: 'nipple', name: 'Nipple (Left/Right)', cat: 'Torso', x: 55, y: -35, z: 26, angle: '90° Transverse Areolar Axis', depth: '3.5 - 6.5 mm', jw: '14g/12g Straight Barbell', desc: 'True horizontal baseline through erectile tissue base, strictly perpendicular to torso axis.' },
        { key: 'navel', name: 'Navel (Umbilicus)', cat: 'Torso', x: 0, y: 55, z: 24, angle: '90° Superior Lip Shelf', depth: '8.0 - 14.0 mm', jw: '14g Curved Barbell', desc: 'Deep superior shelf entry exiting inside umbilical cavity prevents surface migration.' },
        { key: 'dermal', name: 'Sternal Dermal Anchor', cat: 'Surface', x: 0, y: -75, z: 30, angle: '90° Subdermal Pocket', depth: '2.0 - 3.0 mm', jw: '14g Dermal Footplate', desc: 'Flat seating on sternal fascia prevents skin tension and anchor rejection.' },
        { key: 'surface', name: 'Clavicular Surface Barbell', cat: 'Surface', x: 62, y: -105, z: 22, angle: '90° Dual Rise Surface Bar', depth: '14 - 22 mm Span', jw: '14g 90° Surface Barbell', desc: 'Subdermal flat channel with dual 90-degree rises flush with epidermal plane.' }
      ]
    }
  };

  // -------------------------------------------------------------
  // Math & Perspective Projection
  // -------------------------------------------------------------
  function projectPoint(x, y, z, angleDeg, centerX, centerY) {
    var rad = (angleDeg * Math.PI) / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    // Rotate around Y axis
    var rx = x * cos - z * sin;
    var rz = x * sin + z * cos;
    var ry = y;

    var perspective = 380;
    var fov = perspective / (perspective + rz);

    return {
      x: centerX + rx * fov,
      y: centerY + ry * fov,
      z: rz,
      scale: fov
    };
  }

  // -------------------------------------------------------------
  // SVG 3D Mannequin Silhouette Renderers
  // -------------------------------------------------------------
  function render3dMannequinSvg(view, angleDeg) {
    var cfg = anatomicalLandmarks[view] || anatomicalLandmarks.full;
    var cx = cfg.centerX;
    var cy = cfg.centerY;

    var rad = (angleDeg * Math.PI) / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    var svgHtml = `<svg viewBox="0 0 ${cfg.svgWidth} ${cfg.svgHeight}" class="anatomy-3d-svg" style="width:100%; height:100%; display:block;" role="img" aria-label="${(function (vn) { var k = 'ui.3d_human_anatomy_model_view', t = window.translate ? window.translate(k, { view: vn }, '3D Human Anatomy Model ({view})') : ''; return (!t || t === k ? '3D Human Anatomy Model ({view})' : t).replace('{view}', vn); })(view.toUpperCase())}">`;

    // Visual gradients & filters
    svgHtml += `
      <defs>
        <radialGradient id="meshRadial" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
          <stop offset="60%" stop-color="#1e293b" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
        </radialGradient>
        <linearGradient id="bodyOutlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.8" />
        </linearGradient>
        <radialGradient id="hotspotGradActive" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#34D399" />
          <stop offset="100%" stop-color="#059669" />
        </radialGradient>
        <radialGradient id="hotspotGradNormal" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#A78BFA" />
          <stop offset="100%" stop-color="#6D28D9" />
        </radialGradient>
        <filter id="glowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g id="anatomy3dSceneGroup" transform="translate(${panX}, ${panY}) scale(${zoomLevel})" style="transform-origin: ${cx}px ${cy}px;">
    `;

    // Render 3D Wireframe / Silhouette Curves based on view
    if (view === 'full') {
      // Full Body Contour: Head, neck, shoulders, chest, torso, hips
      var headP = projectPoint(0, -110, 0, angleDeg, cx, cy);
      var neckP = projectPoint(0, -68, 0, angleDeg, cx, cy);
      var lShoulder = projectPoint(-70, -42, 0, angleDeg, cx, cy);
      var rShoulder = projectPoint(70, -42, 0, angleDeg, cx, cy);
      var sternumP = projectPoint(0, -15, 12, angleDeg, cx, cy);
      var lWaist = projectPoint(-45, 50, 0, angleDeg, cx, cy);
      var rWaist = projectPoint(45, 50, 0, angleDeg, cx, cy);
      var lHip = projectPoint(-55, 115, 0, angleDeg, cx, cy);
      var rHip = projectPoint(55, 115, 0, angleDeg, cx, cy);
      var groinP = projectPoint(0, 135, 0, angleDeg, cx, cy);

      svgHtml += `
        <!-- Background Depth Grid -->
        <ellipse cx="${cx}" cy="${cy + 145}" rx="110" ry="24" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="3,3" opacity="0.4" />
        <ellipse cx="${cx}" cy="${cy + 145}" rx="65" ry="14" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="2,2" opacity="0.4" />

        <!-- Torso Silhouette Poly -->
        <path d="
          M ${headP.x - 22*headP.scale},${headP.y}
          C ${headP.x - 26*headP.scale},${headP.y - 32*headP.scale} ${headP.x + 26*headP.scale},${headP.y - 32*headP.scale} ${headP.x + 22*headP.scale},${headP.y}
          C ${headP.x + 20*headP.scale},${headP.y + 24*headP.scale} ${neckP.x + 15*neckP.scale},${neckP.y} ${neckP.x + 14*neckP.scale},${neckP.y + 12*neckP.scale}
          C ${neckP.x + 22*neckP.scale},${neckP.y + 18*neckP.scale} ${rShoulder.x - 12},${rShoulder.y - 5} ${rShoulder.x},${rShoulder.y}
          C ${rShoulder.x + 15},${rShoulder.y + 25} ${rWaist.x + 14},${rWaist.y - 20} ${rWaist.x},${rWaist.y}
          C ${rWaist.x - 8},${rWaist.y + 30} ${rHip.x + 12},${rHip.y - 15} ${rHip.x},${rHip.y}
          C ${rHip.x - 10},${rHip.y + 25} ${groinP.x + 16},${groinP.y - 10} ${groinP.x},${groinP.y}
          C ${groinP.x - 16},${groinP.y - 10} ${lHip.x + 10},${lHip.y + 25} ${lHip.x},${lHip.y}
          C ${lHip.x - 12},${lHip.y - 15} ${lWaist.x + 8},${lWaist.y + 30} ${lWaist.x},${lWaist.y}
          C ${lWaist.x - 14},${lWaist.y - 20} ${lShoulder.x - 15},${lShoulder.y + 25} ${lShoulder.x},${lShoulder.y}
          C ${lShoulder.x + 12},${lShoulder.y - 5} ${neckP.x - 22*neckP.scale},${neckP.y + 18*neckP.scale} ${neckP.x - 14*neckP.scale},${neckP.y + 12*neckP.scale}
          C ${neckP.x - 15*neckP.scale},${neckP.y} ${headP.x - 20*headP.scale},${headP.y + 24*headP.scale} ${headP.x - 22*headP.scale},${headP.y}
          Z
        " fill="url(#meshRadial)" stroke="url(#bodyOutlineGrad)" stroke-width="2" />

        <!-- Clavicle / Sternal Midline Wireframe -->
        <line x1="${lShoulder.x + 15}" y1="${lShoulder.y + 8}" x2="${sternumP.x}" y2="${sternumP.y - 15}" stroke="#475569" stroke-width="1.5" stroke-dasharray="2,2" />
        <line x1="${rShoulder.x - 15}" y1="${rShoulder.y + 8}" x2="${sternumP.x}" y2="${sternumP.y - 15}" stroke="#475569" stroke-width="1.5" stroke-dasharray="2,2" />
        <line x1="${sternumP.x}" y1="${sternumP.y - 15}" x2="${sternumP.x}" y2="${sternumP.y + 60}" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6" />
      `;
    } else if (view === 'head') {
      // Anatomically realistic Craniofacial 3D Human Head Model
      // Cranial Vault, Mandible, Facial Features, and Bilateral Auricles projected in 3D perspective

      // Cranial Vault Points (Neurocranium)
      var vertex = projectPoint(0, -122, 0, angleDeg, cx, cy);
      var lParietal = projectPoint(-55, -106, -5, angleDeg, cx, cy);
      var rParietal = projectPoint(55, -106, -5, angleDeg, cx, cy);
      var lTemple = projectPoint(-58, -62, 10, angleDeg, cx, cy);
      var rTemple = projectPoint(58, -62, 10, angleDeg, cx, cy);
      var lZygoma = projectPoint(-64, -20, 16, angleDeg, cx, cy);
      var rZygoma = projectPoint(64, -20, 16, angleDeg, cx, cy);
      var lGonion = projectPoint(-50, 32, -10, angleDeg, cx, cy);
      var rGonion = projectPoint(50, 32, -10, angleDeg, cx, cy);
      var lChin = projectPoint(-18, 68, 28, angleDeg, cx, cy);
      var rChin = projectPoint(18, 68, 28, angleDeg, cx, cy);
      var chin = projectPoint(0, 74, 32, angleDeg, cx, cy);

      // Neck & Clavicular Base Points
      var lNeck = projectPoint(-36, 68, -8, angleDeg, cx, cy);
      var rNeck = projectPoint(36, 68, -8, angleDeg, cx, cy);
      var lNeckBase = projectPoint(-56, 138, -6, angleDeg, cx, cy);
      var rNeckBase = projectPoint(56, 138, -6, angleDeg, cx, cy);
      var sternalNotch = projectPoint(0, 136, 16, angleDeg, cx, cy);
      var lClavicle = projectPoint(-75, 142, 5, angleDeg, cx, cy);
      var rClavicle = projectPoint(75, 142, 5, angleDeg, cx, cy);

      // Bilateral Auricles (Ears)
      // Left Ear
      var lHelixApex = projectPoint(-62, -45, -6, angleDeg, cx, cy);
      var lHelixOuter = projectPoint(-68, -20, -8, angleDeg, cx, cy);
      var lLobule = projectPoint(-62, 16, -6, angleDeg, cx, cy);
      var lTragus = projectPoint(-54, -10, 4, angleDeg, cx, cy);

      // Right Ear
      var rHelixApex = projectPoint(62, -45, -6, angleDeg, cx, cy);
      var rHelixOuter = projectPoint(68, -20, -8, angleDeg, cx, cy);
      var rLobule = projectPoint(62, 16, -6, angleDeg, cx, cy);
      var rTragus = projectPoint(54, -10, 4, angleDeg, cx, cy);

      // Eyebrows (Supraorbital margin)
      var lBrowOuter = projectPoint(-44, -56, 28, angleDeg, cx, cy);
      var lBrowArch = projectPoint(-28, -62, 34, angleDeg, cx, cy);
      var lBrowInner = projectPoint(-12, -56, 38, angleDeg, cx, cy);

      var rBrowInner = projectPoint(12, -56, 38, angleDeg, cx, cy);
      var rBrowArch = projectPoint(28, -62, 34, angleDeg, cx, cy);
      var rBrowOuter = projectPoint(44, -56, 28, angleDeg, cx, cy);

      // Eyes (Palpebral fissures)
      var lEyeOuter = projectPoint(-40, -42, 30, angleDeg, cx, cy);
      var lEyeUpper = projectPoint(-28, -46, 34, angleDeg, cx, cy);
      var lEyeInner = projectPoint(-16, -42, 36, angleDeg, cx, cy);
      var lEyeLower = projectPoint(-28, -39, 34, angleDeg, cx, cy);

      var rEyeInner = projectPoint(16, -42, 36, angleDeg, cx, cy);
      var rEyeUpper = projectPoint(28, -46, 34, angleDeg, cx, cy);
      var rEyeOuter = projectPoint(40, -42, 30, angleDeg, cx, cy);
      var rEyeLower = projectPoint(28, -39, 34, angleDeg, cx, cy);

      // Nose: Nasion, Bridge, Tip, Alae, Columella
      var nasion = projectPoint(0, -48, 38, angleDeg, cx, cy);
      var rhinion = projectPoint(0, -28, 44, angleDeg, cx, cy);
      var noseTip = projectPoint(0, -8, 54, angleDeg, cx, cy);
      var columella = projectPoint(0, 4, 48, angleDeg, cx, cy);
      var lAla = projectPoint(-16, -4, 42, angleDeg, cx, cy);
      var rAla = projectPoint(16, -4, 42, angleDeg, cx, cy);

      // Lips & Mouth: Cupid's Bow, Vermilion Border, Oral Fissure
      var lCupidPeak = projectPoint(-5, 18, 44, angleDeg, cx, cy);
      var rCupidPeak = projectPoint(5, 18, 44, angleDeg, cx, cy);
      var cupidDip = projectPoint(0, 20, 43, angleDeg, cx, cy);
      var lOralComm = projectPoint(-18, 22, 36, angleDeg, cx, cy);
      var rOralComm = projectPoint(18, 22, 36, angleDeg, cx, cy);
      var mouthCenter = projectPoint(0, 24, 41, angleDeg, cx, cy);
      var lowerLipVerm = projectPoint(0, 35, 40, angleDeg, cx, cy);
      var labioMental = projectPoint(0, 48, 36, angleDeg, cx, cy);
      var chinHighlight = projectPoint(0, 68, 34, angleDeg, cx, cy);

      // Occlusion opacities for bilateral ears based on rotation angle
      var lEarOpacity = lHelixApex.z > -20 ? 1.0 : Math.max(0.2, (lHelixApex.z + 60) / 40);
      var rEarOpacity = rHelixApex.z > -20 ? 1.0 : Math.max(0.2, (rHelixApex.z + 60) / 40);

      svgHtml += `
        <!-- Anatomical Neck & Trapezius/Clavicular Base -->
        <path d="
          M ${lNeck.x},${lNeck.y}
          L ${lNeckBase.x},${lNeckBase.y}
          Q ${lClavicle.x},${lClavicle.y} ${sternalNotch.x},${sternalNotch.y}
          Q ${rClavicle.x},${rClavicle.y} ${rNeckBase.x},${rNeckBase.y}
          L ${rNeck.x},${rNeck.y}
          Z
        " fill="url(#meshRadial)" stroke="url(#bodyOutlineGrad)" stroke-width="2" opacity="0.85" />
        
        <!-- Sternocleidomastoid Muscle Lines & Sternal Notch -->
        <path d="M ${lGonion.x + 8},${lGonion.y + 12} Q ${lNeck.x + 12},${lNeck.y + 35} ${sternalNotch.x - 6},${sternalNotch.y}" fill="none" stroke="#475569" stroke-width="1.3" stroke-dasharray="2,2" opacity="0.65" />
        <path d="M ${rGonion.x - 8},${rGonion.y + 12} Q ${rNeck.x - 12},${rNeck.y + 35} ${sternalNotch.x + 6},${sternalNotch.y}" fill="none" stroke="#475569" stroke-width="1.3" stroke-dasharray="2,2" opacity="0.65" />
        <path d="M ${sternalNotch.x - 22},${sternalNotch.y} Q ${sternalNotch.x},${sternalNotch.y + 6} ${sternalNotch.x + 22},${sternalNotch.y}" fill="none" stroke="#64748b" stroke-width="1.6" />

        <!-- Left Auricle (Ear) -->
        <g opacity="${lEarOpacity}">
          <path d="
            M ${lGonion.x + 4},${lGonion.y - 12}
            C ${lTragus.x - 4},${lTragus.y} ${lHelixApex.x - 8},${lHelixApex.y - 8} ${lHelixApex.x},${lHelixApex.y}
            C ${lHelixApex.x + 6},${lHelixApex.y + 8} ${lHelixOuter.x - 6},${lHelixOuter.y + 15} ${lLobule.x},${lLobule.y}
            C ${lLobule.x + 8},${lLobule.y + 4} ${lGonion.x + 8},${lGonion.y + 4} ${lGonion.x + 4},${lGonion.y - 12}
            Z
          " fill="url(#meshRadial)" stroke="url(#bodyOutlineGrad)" stroke-width="2" />
          <path d="M ${lHelixOuter.x + 4},${lHelixOuter.y} C ${lHelixOuter.x + 8},${lHelixOuter.y + 12} ${lLobule.x + 6},${lLobule.y - 6} ${lLobule.x + 4},${lLobule.y}" fill="none" stroke="#64748b" stroke-width="1.5" />
        </g>

        <!-- Right Auricle (Ear) -->
        <g opacity="${rEarOpacity}">
          <path d="
            M ${rGonion.x - 4},${rGonion.y - 12}
            C ${rTragus.x + 4},${rTragus.y} ${rHelixApex.x + 8},${rHelixApex.y - 8} ${rHelixApex.x},${rHelixApex.y}
            C ${rHelixApex.x - 6},${rHelixApex.y + 8} ${rHelixOuter.x + 6},${rHelixOuter.y + 15} ${rLobule.x},${rLobule.y}
            C ${rLobule.x - 8},${rLobule.y + 4} ${rGonion.x - 8},${rGonion.y + 4} ${rGonion.x - 4},${rGonion.y - 12}
            Z
          " fill="url(#meshRadial)" stroke="url(#bodyOutlineGrad)" stroke-width="2" />
          <path d="M ${rHelixOuter.x - 4},${rHelixOuter.y} C ${rHelixOuter.x - 8},${rHelixOuter.y + 12} ${rLobule.x - 6},${rLobule.y - 6} ${rLobule.x - 4},${rLobule.y}" fill="none" stroke="#64748b" stroke-width="1.5" />
        </g>

        <!-- Human Cranial Vault & Mandibular Contour -->
        <path d="
          M ${vertex.x},${vertex.y}
          C ${rParietal.x},${rParietal.y - 8} ${rTemple.x + 8},${rTemple.y - 8} ${rTemple.x},${rTemple.y}
          C ${rZygoma.x + 8},${rZygoma.y - 5} ${rGonion.x + 12},${rGonion.y - 12} ${rGonion.x},${rGonion.y}
          C ${rGonion.x - 6},${rGonion.y + 18} ${rChin.x + 12},${rChin.y} ${chin.x},${chin.y}
          C ${lChin.x - 12},${lChin.y} ${lGonion.x + 6},${lGonion.y + 18} ${lGonion.x},${lGonion.y}
          C ${lGonion.x - 12},${lGonion.y - 12} ${lZygoma.x - 8},${lZygoma.y - 5} ${lTemple.x},${lTemple.y}
          C ${lTemple.x - 8},${lTemple.y - 8} ${lParietal.x},${lParietal.y - 8} ${vertex.x},${vertex.y}
          Z
        " fill="url(#meshRadial)" stroke="url(#bodyOutlineGrad)" stroke-width="2.5" />

        <!-- Eyebrows (Supraorbital Arch) -->
        <path d="M ${lBrowOuter.x},${lBrowOuter.y} Q ${lBrowArch.x},${lBrowArch.y} ${lBrowInner.x},${lBrowInner.y}" fill="none" stroke="#94a3b8" stroke-width="2.6" stroke-linecap="round" />
        <path d="M ${rBrowInner.x},${rBrowInner.y} Q ${rBrowArch.x},${rBrowArch.y} ${rBrowOuter.x},${rBrowOuter.y}" fill="none" stroke="#94a3b8" stroke-width="2.6" stroke-linecap="round" />

        <!-- Eyes (Palpebral Fissures & Lids) -->
        <path d="M ${lEyeOuter.x},${lEyeOuter.y} Q ${lEyeUpper.x},${lEyeUpper.y} ${lEyeInner.x},${lEyeInner.y} Q ${lEyeLower.x},${lEyeLower.y} ${lEyeOuter.x},${lEyeOuter.y} Z" fill="#1e293b" stroke="#64748b" stroke-width="1.6" />
        <circle cx="${lEyeUpper.x}" cy="${lEyeUpper.y + 3}" r="2" fill="#38bdf8" opacity="0.9" />
        <path d="M ${lEyeOuter.x - 2},${lEyeUpper.y - 2} Q ${lEyeUpper.x},${lEyeUpper.y - 4} ${lEyeInner.x},${lEyeUpper.y - 1}" fill="none" stroke="#475569" stroke-width="1.2" opacity="0.7" />

        <path d="M ${rEyeInner.x},${rEyeInner.y} Q ${rEyeUpper.x},${rEyeUpper.y} ${rEyeOuter.x},${rEyeOuter.y} Q ${rEyeLower.x},${rEyeLower.y} ${rEyeInner.x},${rEyeInner.y} Z" fill="#1e293b" stroke="#64748b" stroke-width="1.6" />
        <circle cx="${rEyeUpper.x}" cy="${rEyeUpper.y + 3}" r="2" fill="#38bdf8" opacity="0.9" />
        <path d="M ${rEyeInner.x},${rEyeUpper.y - 1} Q ${rEyeUpper.x},${rEyeUpper.y - 4} ${rEyeOuter.x + 2},${rEyeUpper.y - 2}" fill="none" stroke="#475569" stroke-width="1.2" opacity="0.7" />

        <!-- 3D Nasal Bridge & Profile Line -->
        <path d="M ${nasion.x},${nasion.y} L ${rhinion.x},${rhinion.y} L ${noseTip.x},${noseTip.y} L ${columella.x},${columella.y}" fill="none" stroke="#64748b" stroke-width="1.8" />
        
        <!-- Alar Cartilage (Nostril Wings) -->
        <path d="M ${lAla.x},${lAla.y - 4} Q ${lAla.x - 3},${lAla.y + 4} ${columella.x - 3},${columella.y}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
        <path d="M ${rAla.x},${rAla.y - 4} Q ${rAla.x + 3},${rAla.y + 4} ${columella.x + 3},${columella.y}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
        <ellipse cx="${(lAla.x + columella.x) / 2}" cy="${(lAla.y + columella.y) / 2 + 1}" rx="3" ry="1.5" fill="#0f172a" opacity="0.7" />
        <ellipse cx="${(rAla.x + columella.x) / 2}" cy="${(rAla.y + columella.y) / 2 + 1}" rx="3" ry="1.5" fill="#0f172a" opacity="0.7" />

        <!-- Philtrum Vertical Columns -->
        <path d="M ${columella.x - 3},${columella.y} L ${lCupidPeak.x},${lCupidPeak.y}" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="2,2" opacity="0.7" />
        <path d="M ${columella.x + 3},${columella.y} L ${rCupidPeak.x},${rCupidPeak.y}" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="2,2" opacity="0.7" />

        <!-- Anatomical Lips: Cupid's Bow & Vermilion Margin -->
        <path d="
          M ${lOralComm.x},${lOralComm.y}
          Q ${lCupidPeak.x - 4},${lCupidPeak.y} ${lCupidPeak.x},${lCupidPeak.y}
          Q ${(lCupidPeak.x + cupidDip.x) / 2},${cupidDip.y} ${cupidDip.x},${cupidDip.y}
          Q ${(rCupidPeak.x + cupidDip.x) / 2},${cupidDip.y} ${rCupidPeak.x},${rCupidPeak.y}
          Q ${rCupidPeak.x + 4},${rCupidPeak.y} ${rOralComm.x},${rOralComm.y}
        " fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />

        <!-- Oral Fissure (Interlabial line) -->
        <path d="M ${lOralComm.x},${lOralComm.y} Q ${mouthCenter.x},${mouthCenter.y} ${rOralComm.x},${rOralComm.y}" fill="none" stroke="#475569" stroke-width="2" />

        <!-- Lower Lip Vermilion -->
        <path d="M ${lOralComm.x + 2},${lOralComm.y + 1} Q ${lowerLipVerm.x},${lowerLipVerm.y} ${rOralComm.x - 2},${rOralComm.y + 1}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />

        <!-- Labiomental Groove & Chin Definition -->
        <path d="M ${labioMental.x - 14},${labioMental.y} Q ${labioMental.x},${labioMental.y + 4} ${labioMental.x + 14},${labioMental.y}" fill="none" stroke="#475569" stroke-width="1.4" opacity="0.6" />
        <path d="M ${chinHighlight.x - 12},${chinHighlight.y} Q ${chinHighlight.x},${chinHighlight.y + 4} ${chinHighlight.x + 12},${chinHighlight.y}" fill="none" stroke="#64748b" stroke-width="1.6" opacity="0.5" />
      `;
    } else if (view === 'ear') {
      // Auricular High Definition 3D Model
      svgHtml += `
        <!-- Outer Auricular Cartilage Helix Rim -->
        <path d="
          M ${cx - 55},${cy - 85}
          C ${cx - 45},${cy - 145} ${cx + 75},${cy - 135} ${cx + 70},${cy - 50}
          C ${cx + 65},${cy + 20} ${cx + 55},${cy + 85} ${cx - 5},${cy + 135}
          C ${cx - 35},${cy + 145} ${cx - 55},${cy + 115} ${cx - 45},${cy + 85}
          C ${cx - 35},${cy + 65} ${cx - 20},${cy + 55} ${cx - 20},${cy + 25}
          C ${cx - 20},${cy - 15} ${cx - 65},${cy - 25} ${cx - 55},${cy - 85}
          Z
        " fill="url(#meshRadial)" stroke="url(#bodyOutlineGrad)" stroke-width="2.5" />

        <!-- Antihelix, Concha & Tragus Curvature -->
        <path d="M ${cx + 25},${cy - 65} C ${cx + 35},${cy - 10} ${cx + 15},${cy + 45} ${cx - 25},${cy + 65}" fill="none" stroke="#64748b" stroke-width="2.5" />
        <path d="M ${cx - 35},${cy - 10} C ${cx - 55},${cy} ${cx - 55},${cy + 25} ${cx - 35},${cy + 30}" fill="none" stroke="#94a3b8" stroke-width="2.5" />
        <path d="M ${cx - 15},${cy - 50} C ${cx + 5},${cy - 45} ${cx - 5},${cy - 10} ${cx - 25},${cy - 20}" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="2,2" />
      `;
    } else if (view === 'torso') {
      // Torso View: Sternum, Clavicles, Nipples, Rib Cage, Navel
      svgHtml += `
        <!-- Torso Muscle & Frame Contour -->
        <path d="
          M ${cx - 85},${cy - 120}
          C ${cx - 105},${cy - 60} ${cx - 65},${cy + 40} ${cx - 55},${cy + 130}
          C ${cx - 25},${cy + 145} ${cx + 25},${cy + 145} ${cx + 55},${cy + 130}
          C ${cx + 65},${cy + 40} ${cx + 105},${cy - 60} ${cx + 85},${cy - 120}
          C ${cx + 45},${cy - 105} ${cx - 45},${cy - 105} ${cx - 85},${cy - 120}
          Z
        " fill="url(#meshRadial)" stroke="url(#bodyOutlineGrad)" stroke-width="2" />

        <!-- Pectoral Ridges & Sternal Line -->
        <path d="M ${cx - 75},${cy - 55} Q ${cx - 30},${cy - 25} ${cx},${cy - 45} Q ${cx + 30},${cy - 25} ${cx + 75},${cy - 55}" fill="none" stroke="#475569" stroke-width="2" />
        <line x1="${cx}" y1="${cy - 105}" x2="${cx}" y2="${cy + 115}" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6" />
        <circle cx="${cx}" cy="${cy + 55}" r="7" fill="none" stroke="#94a3b8" stroke-width="1.5" />
      `;
    }

    // Sort Hotspot nodes by calculated Z depth (painters algorithm)
    var projectedNodes = cfg.nodes.map(function (n) {
      var proj = projectPoint(n.x, n.y, n.z, angleDeg, cx, cy);
      return {
        node: n,
        proj: proj
      };
    });

    // Sort ascending by Z so closer nodes render on top
    projectedNodes.sort(function (a, b) {
      return a.proj.z - b.proj.z;
    });

    // Render interactive hotspots
    projectedNodes.forEach(function (item) {
      var n = item.node;
      var p = item.proj;
      var isActive = (n.key === activeHotspotKey);
      var isFacingFront = (p.z >= -45);
      var opacity = isFacingFront ? 1.0 : 0.35;
      var rBase = isActive ? 10 : 8;
      var r = Math.max(5, rBase * p.scale);
      var grad = isActive ? 'url(#hotspotGradActive)' : 'url(#hotspotGradNormal)';
      var strokeColor = isActive ? '#10B981' : '#A78BFA';

      svgHtml += `
        <g class="anatomy-hotspot ${isActive ? 'active' : ''}" data-key="${n.key}" style="opacity: ${opacity};" transform="translate(0, 0)">
          <!-- Outer Pulsing Halo for Active Node -->
          ${isActive ? `<circle cx="${p.x}" cy="${p.y}" r="${r + 7}" fill="none" stroke="#10B981" stroke-width="2" opacity="0.65" filter="url(#glowFilter)">
            <animate attributeName="r" values="${r + 5};${r + 11};${r + 5}" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
          </circle>` : ''}

          <!-- Hotspot Outer Border Ring -->
          <circle class="hotspot-outer" cx="${p.x}" cy="${p.y}" r="${r + 2}" fill="#0f172a" stroke="${strokeColor}" stroke-width="${isActive ? 3 : 2}" />
          <!-- Hotspot Inner Core -->
          <circle class="hotspot-inner" cx="${p.x}" cy="${p.y}" r="${r - 1}" fill="${grad}" />
          <!-- White Center Specular Reflection -->
          <circle cx="${p.x - 2}" cy="${p.y - 2}" r="${r * 0.35}" fill="#FFFFFF" fill-opacity="0.85" />

          <!-- Label Tag -->
          <text x="${p.x + r + 5}" y="${p.y + 4}" fill="${isActive ? '#34D399' : '#CBD5E1'}" font-size="${isActive ? 11 : 10}" font-weight="${isActive ? '700' : '600'}" filter="url(#glowFilter)">
            ${window.translate ? window.translate('anatomy.node.' + n.key, null, n.name) : n.name}
          </text>
        </g>
      `;
    });

    // Close the 3D scene group (scales & pans the model)
    svgHtml += `</g>`;

    // 3D Angle & Zoom watermark in canvas corner (fixed HUD layer)
    var t = window.translate || function (k, p, d) { return d; };
    var viewWatermark = t('anatomy.svg_orbit_watermark', {
      view: view.toUpperCase(),
      angle: (angleDeg > 0 ? '+' : '') + angleDeg
    }, 'VIEW: ' + view.toUpperCase() + ' | ORBIT: ' + (angleDeg > 0 ? '+' : '') + angleDeg + '°') + ' | ' + zoomLevel.toFixed(1) + 'x';
    var dragHint = t('anatomy.svg_drag_hint', null, '🖱️ Drag to rotate | Shift+Drag or Toggle ✋ to Pan | Wheel to Zoom');

    svgHtml += `
      <text x="14" y="24" fill="#64748b" font-size="11" font-weight="600" font-family="monospace">
        ${viewWatermark}
      </text>
      <text x="14" y="${cfg.svgHeight - 12}" fill="#475569" font-size="10">
        ${dragHint}
      </text>
    `;

    svgHtml += `</svg>`;
    return svgHtml;
  }

  // -------------------------------------------------------------
  // UI Synchronization Handlers
  // -------------------------------------------------------------
  function updateInspectCard(key) {
    var cfg = anatomicalLandmarks[currentView] || anatomicalLandmarks.full;
    var node = null;

    // Search across current view then all views
    for (var i = 0; i < cfg.nodes.length; i++) {
      if (cfg.nodes[i].key === key) {
        node = cfg.nodes[i];
        break;
      }
    }

    if (!node) {
      Object.keys(anatomicalLandmarks).forEach(function (v) {
        if (!node) {
          var list = anatomicalLandmarks[v].nodes;
          for (var j = 0; j < list.length; j++) {
            if (list[j].key === key) {
              node = list[j];
              break;
            }
          }
        }
      });
    }

    if (!node) return;

    var catEl = document.getElementById('inspectCardCategory');
    var titleEl = document.getElementById('inspectCardTitle');
    var angleEl = document.getElementById('inspectCardAngle');
    var depthEl = document.getElementById('inspectCardDepth');
    var jwEl = document.getElementById('inspectCardJewelry');
    var healingEl = document.getElementById('inspectCardHealing');
    var descEl = document.getElementById('inspectCardDesc');

    // Cross-reference with clinical PIERCING_DATA if loaded
    var pData = (window.PIERCING_DATA && window.PIERCING_DATA[key]) ? window.PIERCING_DATA[key] : null;
    var t = window.translate || function (k, p, d) { return d; };

    var catText = (pData && pData.category ? pData.category : node.cat);
    if (catEl) catEl.textContent = t('anatomy.inspect_card_clinical', { category: catText.toUpperCase() }, catText.toUpperCase() + ' CLINICAL ANATOMY');
    var nodeName = t('anatomy.node.' + node.key, null, node.name);
    if (titleEl) titleEl.textContent = pData && pData.name ? pData.name : `${nodeName} Piercing`;
    var nodeAngle = t('anatomy.angle.' + node.key, null, node.angle);
    if (angleEl) angleEl.textContent = pData && pData.optimalAngle ? pData.optimalAngle : nodeAngle;
    if (depthEl) depthEl.textContent = pData && pData.insertionDepth ? pData.insertionDepth : node.depth;
    if (jwEl) jwEl.textContent = pData && pData.jewelryType ? pData.jewelryType : node.jw;
    if (healingEl) healingEl.textContent = pData && pData.healingTime ? pData.healingTime : (node.healing || '6 - 8 weeks');
    if (descEl) descEl.textContent = (pData && pData.whyThisAngle) ? pData.whyThisAngle : node.desc;
  }

  function renderExplorerCanvas() {
    var canvasWrap = document.getElementById('anatomy3dCanvasWrap');
    if (!canvasWrap) return;

    canvasWrap.innerHTML = render3dMannequinSvg(currentView, orbitAngle);

    // Bind click events on all hotspot groups
    var hotspots = canvasWrap.querySelectorAll('.anatomy-hotspot');
    hotspots.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        var key = el.getAttribute('data-key');
        if (key) {
          activeHotspotKey = key;
          updateInspectCard(key);
          renderExplorerCanvas();

          // Trigger smooth jump to main piercing guide
          if (typeof onSelectCallback === 'function') {
            onSelectCallback(key, true);
          }
        }
      });
    });

    // Update orbit angle display
    var sliderEl = document.getElementById('orbitAngleSlider');
    var valEl = document.getElementById('orbitAngleValue');
    if (sliderEl) sliderEl.value = orbitAngle;
    if (valEl) valEl.textContent = `${orbitAngle > 0 ? '+' : ''}${orbitAngle}°`;
  }

  // -------------------------------------------------------------
  // Pointer & Multi-Touch Gestures for 3D Orbiting, Pinch-Zoom & Panning
  // -------------------------------------------------------------
  function setupDragOrbit(canvasWrap) {
    if (!canvasWrap) return;

    var activePointers = new Map();
    var initialPinchDist = 0;
    var initialZoom = 1.0;
    var initialMidX = 0;
    var initialMidY = 0;
    var initialPanX = 0;
    var initialPanY = 0;

    function getTouchDistance(p1, p2) {
      var dx = p1.clientX - p2.clientX;
      var dy = p1.clientY - p2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getTouchMidpoint(p1, p2) {
      return {
        x: (p1.clientX + p2.clientX) / 2,
        y: (p1.clientY + p2.clientY) / 2
      };
    }

    function showTouchHud(msg) {
      var hud = document.getElementById('anatomy3dTouchHud');
      if (!hud) {
        hud = document.createElement('div');
        hud.id = 'anatomy3dTouchHud';
        hud.className = 'anatomy-3d-touch-hud';
        canvasWrap.appendChild(hud);
      }
      hud.textContent = msg;
      hud.classList.add('visible');
    }

    function hideTouchHud() {
      var hud = document.getElementById('anatomy3dTouchHud');
      if (hud) {
        hud.classList.remove('visible');
      }
    }

    // Mouse-wheel zoom capabilities
    canvasWrap.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? 0.15 : -0.15;
      var newZoom = Math.max(0.7, Math.min(3.5, zoomLevel + delta));
      if (newZoom !== zoomLevel) {
        zoomLevel = parseFloat(newZoom.toFixed(2));
        renderExplorerCanvas();
        showTouchHud(`${zoomLevel.toFixed(1)}×`);
        clearTimeout(canvasWrap._hudTimer);
        canvasWrap._hudTimer = setTimeout(hideTouchHud, 900);
      }
    }, { passive: false });

    // Dedicated Multi-Touch Event Handling for Tablets (iPad, Android, Surface)
    var lastTapTime = 0;
    var lastTapPos = { x: 0, y: 0 };
    var isTouchPinchActive = false;

    canvasWrap.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        var t = e.touches[0];
        var now = Date.now();
        var distFromLastTap = Math.hypot(t.clientX - lastTapPos.x, t.clientY - lastTapPos.y);

        // Double-tap detector for tablets (within 320ms and within 30px)
        if (now - lastTapTime < 320 && distFromLastTap < 30) {
          e.preventDefault();
          reset3dView();
          showTouchHud('1.0× Reset');
          clearTimeout(canvasWrap._hudTimer);
          canvasWrap._hudTimer = setTimeout(hideTouchHud, 900);
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;
        lastTapPos = { x: t.clientX, y: t.clientY };

        isDragging = true;
        isTouchPinchActive = false;
        startX = t.clientX;
        startY = t.clientY;
        startOrbit = orbitAngle;
        startPanX = panX;
        startPanY = panY;
        canvasWrap.setAttribute('data-drag-mode', interactionMode === 'pan' ? 'pan' : 'orbit');
        canvasWrap.classList.add('is-dragging');
      } else if (e.touches.length === 2) {
        e.preventDefault();
        isTouchPinchActive = true;
        isDragging = false;
        var t1 = e.touches[0];
        var t2 = e.touches[1];
        initialPinchDist = getTouchDistance(t1, t2);
        initialZoom = zoomLevel;
        var mid = getTouchMidpoint(t1, t2);
        initialMidX = mid.x;
        initialMidY = mid.y;
        initialPanX = panX;
        initialPanY = panY;
        canvasWrap.setAttribute('data-drag-mode', 'pinch-pan');
        showTouchHud(`🤏 ${zoomLevel.toFixed(1)}× | ✌️ Pan`);
      }
    }, { passive: false });

    canvasWrap.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var t1 = e.touches[0];
        var t2 = e.touches[1];
        var currentDist = getTouchDistance(t1, t2);

        if (initialPinchDist > 10) {
          var scaleFactor = currentDist / initialPinchDist;
          var newZoom = Math.max(0.7, Math.min(3.5, initialZoom * scaleFactor));
          zoomLevel = parseFloat(newZoom.toFixed(2));
        }

        var mid = getTouchMidpoint(t1, t2);
        var dMidX = mid.x - initialMidX;
        var dMidY = mid.y - initialMidY;
        panX = Math.round(initialPanX + dMidX);
        panY = Math.round(initialPanY + dMidY);

        renderExplorerCanvas();
        showTouchHud(`🤏 ${zoomLevel.toFixed(1)}× | ✌️ Pan (${panX}, ${panY})`);
        return;
      }

      if (isDragging && e.touches.length === 1 && !isTouchPinchActive) {
        e.preventDefault();
        var t = e.touches[0];
        var dx = t.clientX - startX;
        var dy = t.clientY - startY;
        var mode = canvasWrap.getAttribute('data-drag-mode');

        if (mode === 'pan') {
          panX = Math.round(startPanX + dx);
          panY = Math.round(startPanY + dy);
          renderExplorerCanvas();
        } else {
          var deltaAngle = Math.round(dx * 0.45);
          var newAngle = Math.max(-90, Math.min(90, startOrbit + deltaAngle));
          if (newAngle !== orbitAngle) {
            orbitAngle = newAngle;
            renderExplorerCanvas();
          }
        }
      }
    }, { passive: false });

    var endTouch = function (e) {
      if (e.touches.length === 0) {
        isDragging = false;
        isTouchPinchActive = false;
        canvasWrap.classList.remove('is-dragging');
        canvasWrap.removeAttribute('data-drag-mode');
        clearTimeout(canvasWrap._hudTimer);
        canvasWrap._hudTimer = setTimeout(hideTouchHud, 900);
      } else if (e.touches.length === 1) {
        var rem = e.touches[0];
        startX = rem.clientX;
        startY = rem.clientY;
        startOrbit = orbitAngle;
        startPanX = panX;
        startPanY = panY;
        isTouchPinchActive = false;
        isDragging = false;
        canvasWrap.removeAttribute('data-drag-mode');
      }
    };

    canvasWrap.addEventListener('touchend', endTouch);
    canvasWrap.addEventListener('touchcancel', endTouch);

    // Pointer events for desktop mouse and stylus interaction
    canvasWrap.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      activePointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

      if (e.pointerType === 'mouse' && typeof canvasWrap.setPointerCapture === 'function') {
        try { canvasWrap.setPointerCapture(e.pointerId); } catch (err) {}
      }

      var isPan = (e.button === 1 || e.shiftKey || interactionMode === 'pan');
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startOrbit = orbitAngle;
      startPanX = panX;
      startPanY = panY;
      canvasWrap.setAttribute('data-drag-mode', isPan ? 'pan' : 'orbit');
      canvasWrap.classList.add('is-dragging');
    });

    canvasWrap.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { clientX: e.clientX, clientY: e.clientY });

      if (!isDragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      var mode = canvasWrap.getAttribute('data-drag-mode');

      if (mode === 'pan') {
        panX = Math.round(startPanX + dx);
        panY = Math.round(startPanY + dy);
        renderExplorerCanvas();
      } else {
        var deltaAngle = Math.round(dx * 0.45);
        var newAngle = Math.max(-90, Math.min(90, startOrbit + deltaAngle));
        if (newAngle !== orbitAngle) {
          orbitAngle = newAngle;
          renderExplorerCanvas();
        }
      }
    });

    var endPointerDrag = function (e) {
      if (e.pointerType === 'touch') return;
      activePointers.delete(e.pointerId);

      if (typeof canvasWrap.releasePointerCapture === 'function') {
        try { canvasWrap.releasePointerCapture(e.pointerId); } catch (err) {}
      }

      isDragging = false;
      canvasWrap.classList.remove('is-dragging');
      canvasWrap.removeAttribute('data-drag-mode');
      clearTimeout(canvasWrap._hudTimer);
      canvasWrap._hudTimer = setTimeout(hideTouchHud, 800);
    };

    canvasWrap.addEventListener('pointerup', endPointerDrag);
    canvasWrap.addEventListener('pointercancel', endPointerDrag);

    // Double-click or double-tap resets zoom, pan, and rotation
    canvasWrap.addEventListener('dblclick', function () {
      reset3dView();
      showTouchHud('1.0× Reset');
      clearTimeout(canvasWrap._hudTimer);
      canvasWrap._hudTimer = setTimeout(hideTouchHud, 900);
    });
  }

  // -------------------------------------------------------------
  // Public Interface Initialization
  // -------------------------------------------------------------
  var isInitialized = false;

  function initAnatomy3DExplorer(onSelectPiercing) {
    if (typeof onSelectPiercing === 'function') {
      onSelectCallback = onSelectPiercing;
    }

    if (isInitialized) {
      updateInspectCard(activeHotspotKey);
      renderExplorerCanvas();
      return;
    }

    var canvasWrap = document.getElementById('anatomy3dCanvasWrap');
    if (canvasWrap) {
      setupDragOrbit(canvasWrap);
    }

    // Tab buttons for view switching (Full body, Head, Ear, Torso)
    var tabBtns = document.querySelectorAll('.btn-3d-tab');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        var view = btn.getAttribute('data-view');
        if (view) {
          currentView = view;
          panX = 0;
          panY = 0;
          zoomLevel = 1.0;
          renderExplorerCanvas();
        }
      });
    });

    function updateControlsUI() {
      var modeBtn = document.getElementById('orbitModeToggleBtn');
      var t = window.translate || function (k, p, d) { return d; };
      if (modeBtn) {
        if (interactionMode === 'pan') {
          modeBtn.classList.add('active');
          modeBtn.textContent = '✋ ' + t('anatomy.mode_pan', null, 'Pan View');
        } else {
          modeBtn.classList.remove('active');
          modeBtn.textContent = '🔄 ' + t('anatomy.mode_orbit', null, 'Rotate 3D');
        }
      }
    }

    // Orbit Buttons (-30, Front, +30)
    var orbitLeftBtn = document.getElementById('orbitLeftBtn');
    var orbitFrontBtn = document.getElementById('orbitFrontBtn');
    var orbitRightBtn = document.getElementById('orbitRightBtn');
    var orbitSlider = document.getElementById('orbitAngleSlider');

    // Pan & Zoom Controls
    var zoomInBtn = document.getElementById('orbitZoomInBtn');
    var zoomOutBtn = document.getElementById('orbitZoomOutBtn');
    var resetBtn = document.getElementById('orbitResetBtn');
    var modeToggleBtn = document.getElementById('orbitModeToggleBtn');

    if (orbitLeftBtn) {
      orbitLeftBtn.addEventListener('click', function () {
        orbitAngle = Math.max(-90, orbitAngle - 30);
        renderExplorerCanvas();
      });
    }
    if (orbitFrontBtn) {
      orbitFrontBtn.addEventListener('click', function () {
        orbitAngle = 0;
        renderExplorerCanvas();
      });
    }
    if (orbitRightBtn) {
      orbitRightBtn.addEventListener('click', function () {
        orbitAngle = Math.min(90, orbitAngle + 30);
        renderExplorerCanvas();
      });
    }
    if (orbitSlider) {
      orbitSlider.addEventListener('input', function () {
        orbitAngle = parseInt(this.value, 10) || 0;
        renderExplorerCanvas();
      });
    }

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function () {
        zoomLevel = Math.min(3.5, parseFloat((zoomLevel + 0.25).toFixed(2)));
        renderExplorerCanvas();
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function () {
        zoomLevel = Math.max(0.7, parseFloat((zoomLevel - 0.25).toFixed(2)));
        renderExplorerCanvas();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        reset3dView();
      });
    }
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener('click', function () {
        interactionMode = (interactionMode === 'orbit' ? 'pan' : 'orbit');
        updateControlsUI();
      });
    }

    // Jump to Guide button in inspect card
    var jumpBtn = document.getElementById('jumpToGuideBtn');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', function () {
        if (typeof onSelectCallback === 'function' && activeHotspotKey) {
          onSelectCallback(activeHotspotKey, true);
        }
      });
    }

    // Listen for language changes to update inspect card and SVG canvas dynamically
    window.addEventListener('languageChanged', function () {
      updateInspectCard(activeHotspotKey);
      renderExplorerCanvas();
      updateControlsUI();
    });

    isInitialized = true;

    // Initial render
    updateInspectCard(activeHotspotKey);
    renderExplorerCanvas();
    updateControlsUI();
  }

  // Export globally so piercing-guide.js can invoke it cleanly
  window.Anatomy3DExplorer = {
    init: initAnatomy3DExplorer,
    syncActivePiercing: function (key) {
      activeHotspotKey = key;
      updateInspectCard(key);
      renderExplorerCanvas();
    }
  };

  // Self-initialize on DOM ready
  function autoInit() {
    if (document.getElementById('anatomy3dCanvasWrap')) {
      initAnatomy3DExplorer(function (key) {
        if (typeof window.selectPiercingGlobal === 'function') {
          window.selectPiercingGlobal(key, true);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();
