
// A sentence with computed values in it. The key carries positional holes so
// each language can put the numbers where its own grammar wants them; a hole a
// translation omits is simply dropped.
//
// THE GLOBAL IS NOT THE SAME IN EVERY TOOL. The coverage calculator exposes
// window.I18N; the form builder exposes window.i18n. Hardcoding I18N made all
// nineteen calls in the form builder fall back to English, silently, in all six
// languages, because a fallback that works is exactly what hides a lookup that
// does not.
function TP(key, fallback) {
  var vals = Array.prototype.slice.call(arguments, 2);
  var api = (typeof window !== 'undefined' && ((window.I18N && window.I18N.t && window.I18N) || (window.i18n && window.i18n.t && window.i18n))) || null;
  var s = api ? api.t(key, fallback) : fallback;
  if (s === undefined || s === null || s === key) s = fallback;
  return String(s).replace(/\{(\d+)\}/g, function (m, i) { return vals[Number(i)] === undefined ? '' : vals[Number(i)]; });
}

// Runtime strings go through the dictionary too. The fallback is the English, so
// the tool still reads correctly if i18n.js has not loaded or a key is missing.
function T(key, fallback) {
  return (window.I18N && typeof window.I18N.t === 'function') ? window.I18N.t(key, fallback) : fallback;
}
/* ═══════════════════════════════════════════════════════════
   PROFESSIONAL NEEDLE COVERAGE CALCULATOR
   Complex Databases & Calculation Engine
   Poli International
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   NEEDLE COVERAGE RATE DATABASE
   Coverage rates in square inches per hour
   ═══════════════════════════════════════════════════════════ */

const NEEDLE_COVERAGE_RATES = {
    // ROUND LINERS
    '1RL': {
        type: 'liner',
        name: 'Single Needle',
        needles: 1,
        width_mm: 0.35,
        coverage_rate: {
            slow: 0.5,
            medium: 1.0,
            fast: 1.5
        },
        best_for: 'Micro details, tiny lines, delicate work',
        typical_use: 'Single needle tattoos, micro-realism',
        passes_required: 2,
        ink_efficiency: 'low'
    },
    '3RL': {
        type: 'liner',
        name: '3 Round Liner',
        needles: 3,
        width_mm: 0.8,
        coverage_rate: {
            slow: 1.5,
            medium: 3.0,
            fast: 4.5
        },
        best_for: 'Fine lines, detailed work, small text',
        typical_use: 'Fine line tattoos, script, delicate outlines',
        passes_required: 1,
        ink_efficiency: 'medium'
    },
    '5RL': {
        type: 'liner',
        name: '5 Round Liner',
        needles: 5,
        width_mm: 1.2,
        coverage_rate: {
            slow: 2.5,
            medium: 5.0,
            fast: 7.5
        },
        best_for: 'Standard outlines, most line work',
        typical_use: 'General outlining, medium lines',
        passes_required: 1,
        ink_efficiency: 'medium'
    },
    '7RL': {
        type: 'liner',
        name: '7 Round Liner',
        needles: 7,
        width_mm: 1.6,
        coverage_rate: {
            slow: 3.5,
            medium: 7.0,
            fast: 10.5
        },
        best_for: 'Medium to bold lines',
        typical_use: 'Traditional outlines, bold work',
        passes_required: 1,
        ink_efficiency: 'good'
    },
    '9RL': {
        type: 'liner',
        name: '9 Round Liner',
        needles: 9,
        width_mm: 2.0,
        coverage_rate: {
            slow: 4.0,
            medium: 8.0,
            fast: 12.0
        },
        best_for: 'Bold outlines, traditional work',
        typical_use: 'Bold traditional, thick lines',
        passes_required: 1,
        ink_efficiency: 'good'
    },

    // ROUND SHADERS
    '5RS': {
        type: 'shader',
        name: '5 Round Shader',
        needles: 5,
        width_mm: 1.5,
        coverage_rate: {
            slow: 3.0,
            medium: 6.0,
            fast: 9.0
        },
        best_for: 'Light shading, gradients',
        typical_use: 'Soft shading, black & grey',
        passes_required: 3,
        ink_efficiency: 'medium'
    },
    '7RS': {
        type: 'shader',
        name: '7 Round Shader',
        needles: 7,
        width_mm: 2.0,
        coverage_rate: {
            slow: 4.0,
            medium: 8.0,
            fast: 12.0
        },
        best_for: 'Medium shading, versatile',
        typical_use: 'General shading work',
        passes_required: 2,
        ink_efficiency: 'good'
    },
    '9RS': {
        type: 'shader',
        name: '9 Round Shader',
        needles: 9,
        width_mm: 2.5,
        coverage_rate: {
            slow: 5.0,
            medium: 10.0,
            fast: 15.0
        },
        best_for: 'Heavy shading, large areas',
        typical_use: 'Bold shading, solid work',
        passes_required: 2,
        ink_efficiency: 'good'
    },

    // MAGNUMS
    '7M1': {
        type: 'magnum',
        name: '7 Magnum',
        needles: 7,
        width_mm: 8.0,
        coverage_rate: {
            slow: 8.0,
            medium: 16.0,
            fast: 24.0
        },
        best_for: 'Soft shading, color blending',
        typical_use: 'Smooth gradients, soft color',
        passes_required: 3,
        ink_efficiency: 'excellent'
    },
    '9M1': {
        type: 'magnum',
        name: '9 Magnum',
        needles: 9,
        width_mm: 10.0,
        coverage_rate: {
            slow: 10.0,
            medium: 20.0,
            fast: 30.0
        },
        best_for: 'Shading, color work, coverage',
        typical_use: 'Most common shading needle - industry workhorse',
        passes_required: 2,
        ink_efficiency: 'excellent'
    },
    '11M1': {
        type: 'magnum',
        name: '11 Magnum',
        needles: 11,
        width_mm: 12.0,
        coverage_rate: {
            slow: 12.0,
            medium: 24.0,
            fast: 36.0
        },
        best_for: 'Faster coverage, larger areas',
        typical_use: 'Large shading areas, backgrounds',
        passes_required: 2,
        ink_efficiency: 'excellent'
    },
    '13M1': {
        type: 'magnum',
        name: '13 Magnum',
        needles: 13,
        width_mm: 14.0,
        coverage_rate: {
            slow: 14.0,
            medium: 28.0,
            fast: 42.0
        },
        best_for: 'Large area coverage',
        typical_use: 'Backgrounds, large shading',
        passes_required: 2,
        ink_efficiency: 'excellent'
    },
    '15M2': {
        type: 'magnum',
        name: '15 Magnum Stacked',
        needles: 15,
        width_mm: 16.0,
        coverage_rate: {
            slow: 16.0,
            medium: 32.0,
            fast: 48.0
        },
        best_for: 'Maximum coverage, solid color',
        typical_use: 'Large solid areas, color packing',
        passes_required: 2,
        ink_efficiency: 'maximum'
    },
    '18M2': {
        type: 'magnum',
        name: '18 Magnum Stacked',
        needles: 18,
        width_mm: 18.0,
        coverage_rate: {
            slow: 18.0,
            medium: 36.0,
            fast: 54.0
        },
        best_for: 'Maximum coverage, sleeves, backs',
        typical_use: 'Large pieces, fast coverage',
        passes_required: 2,
        ink_efficiency: 'maximum'
    },

    // CURVED MAGNUMS
    '9CM': {
        type: 'curved_magnum',
        name: '9 Curved Magnum',
        needles: 9,
        width_mm: 10.0,
        coverage_rate: {
            slow: 9.0,
            medium: 18.0,
            fast: 27.0
        },
        best_for: 'Smooth color transitions, soft shading',
        typical_use: 'Realism, smooth gradients',
        passes_required: 3,
        ink_efficiency: 'excellent'
    },
    '11CM': {
        type: 'curved_magnum',
        name: '11 Curved Magnum',
        needles: 11,
        width_mm: 12.0,
        coverage_rate: {
            slow: 11.0,
            medium: 22.0,
            fast: 33.0
        },
        best_for: 'Realism work, smooth coverage',
        typical_use: 'Portrait work, smooth shading',
        passes_required: 2,
        ink_efficiency: 'excellent'
    },
    '13CM': {
        type: 'curved_magnum',
        name: '13 Curved Magnum',
        needles: 13,
        width_mm: 14.0,
        coverage_rate: {
            slow: 13.0,
            medium: 26.0,
            fast: 39.0
        },
        best_for: 'Large smooth areas',
        typical_use: 'Realism backgrounds, smooth color',
        passes_required: 2,
        ink_efficiency: 'excellent'
    }
};

/* ═══════════════════════════════════════════════════════════
   BODY LOCATION DIFFICULTY DATABASE
   Time multipliers and characteristics
   ═══════════════════════════════════════════════════════════ */

const BODY_LOCATION_FACTORS = {
    'outer-upper-arm': {
        difficulty: 'easy',
        name: 'Outer Upper Arm',
        time_multiplier: 1.0,
        pain_level: 'low',
        typical_session: 4.0,
        break_frequency: 'minimal',
        notes: 'Ideal location - great skin, easy positioning'
    },
    'outer-forearm': {
        difficulty: 'easy',
        name: 'Outer Forearm',
        time_multiplier: 1.0,
        pain_level: 'low',
        typical_session: 4.0,
        break_frequency: 'minimal',
        notes: 'Popular location, easy to work on'
    },
    'outer-calf': {
        difficulty: 'easy',
        name: 'Outer Calf',
        time_multiplier: 1.1,
        pain_level: 'low',
        typical_session: 3.5,
        break_frequency: 'minimal',
        notes: 'Good skin quality, comfortable for client'
    },
    'shoulder': {
        difficulty: 'easy',
        name: 'Shoulder',
        time_multiplier: 1.1,
        pain_level: 'low-medium',
        typical_session: 3.5,
        break_frequency: 'minimal',
        notes: 'Comfortable area, curved surface'
    },
    'upper-back': {
        difficulty: 'medium',
        name: 'Upper Back',
        time_multiplier: 1.3,
        pain_level: 'medium',
        typical_session: 3.0,
        break_frequency: 'moderate',
        notes: 'Requires position changes, large flat area'
    },
    'chest': {
        difficulty: 'medium',
        name: 'Chest',
        time_multiplier: 1.4,
        pain_level: 'medium-high',
        typical_session: 2.5,
        break_frequency: 'frequent',
        notes: 'More painful near sternum, challenging area'
    },
    'thigh': {
        difficulty: 'medium',
        name: 'Thigh',
        time_multiplier: 1.3,
        pain_level: 'medium',
        typical_session: 3.0,
        break_frequency: 'moderate',
        notes: 'Large area, comfortable positioning'
    },
    'inner-forearm': {
        difficulty: 'medium',
        name: 'Inner Forearm',
        time_multiplier: 1.4,
        pain_level: 'medium-high',
        typical_session: 2.5,
        break_frequency: 'frequent',
        notes: 'More sensitive than outer, thinner skin'
    },
    'lower-back': {
        difficulty: 'medium',
        name: 'Lower Back',
        time_multiplier: 1.4,
        pain_level: 'medium-high',
        typical_session: 2.5,
        break_frequency: 'frequent',
        notes: 'Can be uncomfortable, positioning challenges'
    },
    'ribs': {
        difficulty: 'difficult',
        name: 'Ribs',
        time_multiplier: 2.0,
        pain_level: 'very-high',
        typical_session: 2.0,
        break_frequency: 'very-frequent',
        notes: 'Extremely painful, skin moves with breathing'
    },
    'neck': {
        difficulty: 'difficult',
        name: 'Neck',
        time_multiplier: 1.8,
        pain_level: 'high',
        typical_session: 2.0,
        break_frequency: 'very-frequent',
        notes: 'Sensitive, client anxiety common, thin skin'
    },
    'hands': {
        difficulty: 'difficult',
        name: 'Hands',
        time_multiplier: 2.2,
        pain_level: 'very-high',
        typical_session: 1.5,
        break_frequency: 'constant',
        notes: 'Very painful, thin skin, many nerve endings'
    },
    'feet': {
        difficulty: 'difficult',
        name: 'Feet',
        time_multiplier: 2.3,
        pain_level: 'extreme',
        typical_session: 1.5,
        break_frequency: 'constant',
        notes: 'Extremely painful, difficult healing, fading common'
    },
    'spine': {
        difficulty: 'difficult',
        name: 'Spine',
        time_multiplier: 2.0,
        pain_level: 'very-high',
        typical_session: 1.5,
        break_frequency: 'very-frequent',
        notes: 'Extremely painful over vertebrae, vibrations intense'
    },
    'elbow-ditch': {
        difficulty: 'difficult',
        name: 'Elbow Ditch',
        time_multiplier: 2.5,
        pain_level: 'extreme',
        typical_session: 1.0,
        break_frequency: 'constant',
        notes: 'One of most painful locations, very challenging'
    },
    'knee-ditch': {
        difficulty: 'difficult',
        name: 'Knee Ditch',
        time_multiplier: 2.5,
        pain_level: 'extreme',
        typical_session: 1.0,
        break_frequency: 'constant',
        notes: 'Extremely painful, very challenging skin'
    }
};

/* ═══════════════════════════════════════════════════════════
   COMPLEXITY FACTORS DATABASE
   Design complexity multipliers
   ═══════════════════════════════════════════════════════════ */

const COMPLEXITY_FACTORS = {
    'simple-bold': {
        name: 'Simple Bold',
        time_multiplier: 1.0,
        price_multiplier: 0.9,
        passes_required: 1,
        description: 'Bold lines, minimal shading, traditional style'
    },
    'medium-detail': {
        name: 'Medium Detail',
        time_multiplier: 1.5,
        price_multiplier: 1.0,
        passes_required: 2,
        description: 'Moderate detail, standard shading'
    },
    'high-detail': {
        name: 'High Detail',
        time_multiplier: 2.0,
        price_multiplier: 1.2,
        passes_required: 3,
        description: 'Intricate details, careful shading'
    },
    'photorealistic': {
        name: 'Photorealistic',
        time_multiplier: 3.0,
        price_multiplier: 1.5,
        passes_required: 5,
        description: 'Extreme detail, multiple layers, precise gradients'
    },
    'micro-detail': {
        name: 'Micro Detail',
        time_multiplier: 4.0,
        price_multiplier: 1.8,
        passes_required: 2,
        description: 'Tiny intricate work, single needle'
    }
};

/* ═══════════════════════════════════════════════════════════
   INK CONSUMPTION DATABASE
   ML per square inch rates
   ═══════════════════════════════════════════════════════════ */

const INK_CONSUMPTION_RATES = {
    'lining': {
        ink_per_sqinch: 0.05,
        waste_factor_base: 1.3,
        caps_per_session: 2,
        name: 'Lining'
    },
    'light-shading': {
        ink_per_sqinch: 0.15,
        waste_factor_base: 1.4,
        caps_per_session: 3,
        name: 'Light Shading'
    },
    'medium-shading': {
        ink_per_sqinch: 0.25,
        waste_factor_base: 1.4,
        caps_per_session: 4,
        name: 'Medium Shading'
    },
    'solid-black': {
        ink_per_sqinch: 0.5,
        waste_factor_base: 1.3,
        caps_per_session: 5,
        name: 'Solid Black'
    },
    'color-packing': {
        ink_per_sqinch: 0.4,
        waste_factor_base: 1.5,
        caps_per_session: 6,
        name: 'Color Packing'
    },
    'color-blending': {
        ink_per_sqinch: 0.3,
        waste_factor_base: 1.6,
        caps_per_session: 8,
        name: 'Color Blending'
    }
};

/* ═══════════════════════════════════════════════════════════
   WASTE FACTOR MULTIPLIERS
   ═══════════════════════════════════════════════════════════ */

const WASTE_FACTORS = {
    'low': 1.2,
    'medium': 1.4,
    'high': 1.6
};

/* ═══════════════════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════════════════ */

let currentGlobalUnit = 'sqin';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize global unit selector (sq in vs cm²)
    initializeGlobalUnitSelector();

    // Initialize theme
    initializeTheme();

    // Initialize tab navigation
    initializeTabs();

    // Initialize Hero section feature buttons navigation & smooth scrolling
    initializeHeroNavigation();

    // Initialize form handlers
    initializeForms();

    // Initialize modal
    initializeModal();

    // Initialize email forms
    initializeEmailForms();

    // Initialize unit converter
    initializeUnitConverter();

    // Initialize recent calculations history
    initializeRecentCalculations();

    // Initialize real-time input validation feedback
    initializeRealtimeValidation();

    // Initialize session chair timer & stopwatch
    initializeSessionTimer();

    // Initialize side-by-side scenario comparison widget
    initializeComparisonWidget();

    // Initialize keyboard shortcuts (Ctrl+Enter)
    initializeKeyboardShortcuts();

    // Initialize interactive SVG body map selector
    initializeInteractiveBodyMap();

    // Initialize session summary modal (Actual vs Estimated variance)
    initializeSessionSummaryModal();

    // Initialize Ink Inventory Planner mode
    initializeInkInventoryPlanner();

    // Initialize Tattoo Style Theme Selector
    initializeStyleTheme();

    // Initialize Session Goals & Milestones
    initializeSessionGoals();

    // Initialize Artist Efficiency Dashboard
    initializeEfficiencyDashboard();

    // Initialize Email to Client Modal
    initializeClientEmailModal();

    // Initialize onboarding guided tour
    initializeOnboardingTour();

    console.log('Coverage Calculator initialized successfully');
});

/* ═══════════════════════════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════════════════════════ */

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('coverage-calculator-theme');

    // Apply saved theme or default to dark
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('coverage-calculator-theme', isLight ? 'light' : 'dark');
        });
    }
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL UNIT SELECTOR (sq in / cm²)
   ═══════════════════════════════════════════════════════════ */

function initializeGlobalUnitSelector() {
    const unitSelect = document.getElementById('global-unit-select');
    const savedUnit = localStorage.getItem('coverage-calculator-unit') || 'sqin';

    currentGlobalUnit = savedUnit;
    if (unitSelect) {
        unitSelect.value = savedUnit;
        unitSelect.addEventListener('change', function() {
            setGlobalUnit(this.value, true);
        });
    }

    // Apply labels on init without converting initial default inputs
    setGlobalUnit(savedUnit, false);
}

function setGlobalUnit(newUnit, convertValues = true) {
    const prevUnit = currentGlobalUnit;
    currentGlobalUnit = newUnit;
    localStorage.setItem('coverage-calculator-unit', newUnit);

    const isMetric = newUnit === 'sqcm';

    // Apply global CSS unit classes to body & documentElement
    document.documentElement.classList.remove('unit-sqin', 'unit-sqcm');
    document.documentElement.classList.add(isMetric ? 'unit-sqcm' : 'unit-sqin');
    document.body.classList.remove('unit-sqin', 'unit-sqcm');
    document.body.classList.add(isMetric ? 'unit-sqcm' : 'unit-sqin');

    const unitSelects = document.querySelectorAll('#global-unit-select, .global-unit-select');
    unitSelects.forEach(sel => {
        if (sel.value !== newUnit) {
            sel.value = newUnit;
        }
    });

    // 1. Session Time Form Labels & Values
    const widthLabel = document.querySelector('label[for="tattoo-width"] .coverage__label-text');
    if (widthLabel) widthLabel.textContent = isMetric ? T("x.width_cm", "Width (cm)") : T("x.width_inches", "Width (inches)");
    const widthInput = document.getElementById('tattoo-width');
    if (widthInput) {
        widthInput.placeholder = isMetric ? 'e.g., 15' : 'e.g., 6';
        if (convertValues && widthInput.value && !isNaN(parseFloat(widthInput.value))) {
            const currentVal = parseFloat(widthInput.value);
            widthInput.value = isMetric ? (currentVal * 2.54).toFixed(1) : (currentVal / 2.54).toFixed(2);
        }
    }

    const heightLabel = document.querySelector('label[for="tattoo-height"] .coverage__label-text');
    if (heightLabel) heightLabel.textContent = isMetric ? T("x.height_cm", "Height (cm)") : T("x.height_inches", "Height (inches)");
    const heightInput = document.getElementById('tattoo-height');
    if (heightInput) {
        heightInput.placeholder = isMetric ? 'e.g., 20' : 'e.g., 8';
        if (convertValues && heightInput.value && !isNaN(parseFloat(heightInput.value))) {
            const currentVal = parseFloat(heightInput.value);
            heightInput.value = isMetric ? (currentVal * 2.54).toFixed(1) : (currentVal / 2.54).toFixed(2);
        }
    }

    // 2. Ink Consumption Form
    const inkAreaLabel = document.querySelector('label[for="ink-area"] .coverage__label-text');
    if (inkAreaLabel) inkAreaLabel.textContent = isMetric ? T("x.coverage_area_cm", "Coverage Area (cm²)") : T("x.coverage_area_sq_in", "Coverage Area (sq in)");
    const inkAreaInput = document.getElementById('ink-area');
    if (inkAreaInput) {
        inkAreaInput.placeholder = isMetric ? 'e.g., 310' : 'e.g., 48';
        if (convertValues && inkAreaInput.value && !isNaN(parseFloat(inkAreaInput.value))) {
            const currentVal = parseFloat(inkAreaInput.value);
            inkAreaInput.value = isMetric ? (currentVal * 6.4516).toFixed(1) : (currentVal / 6.4516).toFixed(2);
        }
    }

    // 3. Pricing Form
    const pricingAreaLabel = document.querySelector('label[for="pricing-area"] .coverage__label-text');
    if (pricingAreaLabel) pricingAreaLabel.textContent = isMetric ? T("x.total_area_cm", "Total Area (cm²)") : T("x.total_area_sq_in", "Total Area (sq in)");
    const pricingAreaInput = document.getElementById('pricing-area');
    if (pricingAreaInput) {
        pricingAreaInput.placeholder = isMetric ? 'e.g., 310' : 'e.g., 48';
        if (convertValues && pricingAreaInput.value && !isNaN(parseFloat(pricingAreaInput.value))) {
            const currentVal = parseFloat(pricingAreaInput.value);
            pricingAreaInput.value = isMetric ? (currentVal * 6.4516).toFixed(1) : (currentVal / 6.4516).toFixed(2);
        }
    }

    // Pricing Result Card Sublabels
    const pricingPerUnitCard = document.getElementById('pricing-per-sqin');
    if (pricingPerUnitCard) {
        const parentCard = pricingPerUnitCard.closest('.coverage__result-card');
        if (parentCard) {
            const cardLabel = parentCard.querySelector('.coverage__result-label');
            const cardSublabel = parentCard.querySelector('.coverage__result-sublabel');
            if (cardLabel) cardLabel.textContent = isMetric ? T("x.per_sq_centimeter", "Per Sq Centimeter") : T("x.per_sq_inch", "Per Sq Inch");
            if (cardSublabel) cardSublabel.textContent = isMetric ? T("x.unit_pricing_cm", "Unit pricing ($/cm²)") : T("x.unit_pricing_sq_in", "Unit pricing ($/sq in)");
        }
    }

    // 4. Ink Inventory Planner
    const apptAreaLabel = document.querySelector('label[for="appt-area"] .coverage__label-text');
    if (apptAreaLabel) apptAreaLabel.textContent = isMetric ? T("x.skin_area_cm", "Skin Area (cm²)") : T("x.skin_area_sq_in", "Skin Area (sq in)");
    const apptAreaInput = document.getElementById('appt-area');
    if (apptAreaInput) {
        if (convertValues && apptAreaInput.value && !isNaN(parseFloat(apptAreaInput.value))) {
            const currentVal = parseFloat(apptAreaInput.value);
            apptAreaInput.value = isMetric ? Math.round(currentVal * 6.4516) : Math.round(currentVal / 6.4516);
        }
    }

    // 5. Update Quick Unit Converter Widget live output
    if (typeof updateCoveragePerUnit === 'function') {
        updateCoveragePerUnit();
    }

    // 6. Update all dynamic unit badges & formula labels across DOM
    document.querySelectorAll('.coverage__unit-tag').forEach(tag => {
        tag.textContent = isMetric ? 'cm²' : 'sq in';
    });

    // 7. Dispatch global unitChanged event
    window.dispatchEvent(new CustomEvent('unitChanged', {
        detail: {
            unit: newUnit,
            isMetric: isMetric,
            prevUnit: prevUnit
        }
    }));

    if (convertValues && prevUnit !== newUnit && typeof showToastNotification === 'function') {
        showToastNotification(`📏 Switched global unit to <strong>${isMetric ? 'cm² (Square Centimeters)' : 'sq in (Square Inches)'}</strong>`);
    }
}

// Global Unit Manager API
window.UnitManager = {
    getUnit: function() { return currentGlobalUnit; },
    setUnit: function(unit) { setGlobalUnit(unit, true); },
    toggleUnit: function() { setGlobalUnit(currentGlobalUnit === 'sqin' ? 'sqcm' : 'sqin', true); },
    isMetric: function() { return currentGlobalUnit === 'sqcm'; }
};

/* ═══════════════════════════════════════════════════════════
   TAB NAVIGATION
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   TAB NAVIGATION & HERO FEATURE WIRING
   ═══════════════════════════════════════════════════════════ */

function selectTab(targetTab, shouldScroll = false, triggerPulse = false) {
    if (!targetTab) return;
    const tabButtons = document.querySelectorAll('.coverage__tab');
    const tabPanels = document.querySelectorAll('.coverage__panel');

    // Remove active class from all tabs
    tabButtons.forEach(btn => {
        btn.classList.remove('coverage__tab--active');
        btn.setAttribute('aria-selected', 'false');
    });

    // Remove active class from all panels
    tabPanels.forEach(panel => {
        panel.classList.remove('coverage__panel--active');
    });

    // Add active class to corresponding tab button
    const activeTabBtn = document.querySelector(`.coverage__tab[data-tab="${targetTab}"]`);
    if (activeTabBtn) {
        activeTabBtn.classList.add('coverage__tab--active');
        activeTabBtn.setAttribute('aria-selected', 'true');
    }

    // Show target panel
    const targetPanel = document.getElementById(targetTab + '-panel') || document.querySelector(targetTab.startsWith('#') ? targetTab : `#${targetTab}-panel`);
    if (targetPanel) {
        targetPanel.classList.add('coverage__panel--active');

        // Trigger visual highlight pulse if requested
        if (triggerPulse) {
            targetPanel.classList.remove('panel-highlight-pulse');
            void targetPanel.offsetWidth; // Trigger reflow
            targetPanel.classList.add('panel-highlight-pulse');
        }

        // Smooth scroll to the target section
        if (shouldScroll) {
            const headerOffset = 80;
            const elementPosition = targetPanel.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
        }
    }

    // Sync Hero Section active button indicators
    syncHeroActiveTab(targetTab);

    // Save active tab preference
    try {
        localStorage.setItem('active_calculator_tab', targetTab);
    } catch (e) {}
}

function syncHeroActiveTab(activeTabName) {
    const heroFeatures = document.querySelectorAll('.coverage__hero-feature');
    heroFeatures.forEach(feature => {
        const featureTab = feature.getAttribute('data-tab');
        if (featureTab === activeTabName) {
            feature.classList.add('coverage__hero-feature--active');
            feature.setAttribute('aria-pressed', 'true');
        } else {
            feature.classList.remove('coverage__hero-feature--active');
            feature.setAttribute('aria-pressed', 'false');
        }
    });
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.coverage__tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            selectTab(targetTab, false, false);
        });
    });

    // Restore saved active tab on page load if available
    try {
        const savedTab = localStorage.getItem('active_calculator_tab');
        if (savedTab && document.getElementById(savedTab + '-panel')) {
            selectTab(savedTab, false, false);
        }
    } catch (e) {}
}

function initializeHeroNavigation() {
    const heroFeatures = document.querySelectorAll('.coverage__hero-feature');
    if (!heroFeatures || heroFeatures.length === 0) return;

    heroFeatures.forEach((feature, index) => {
        // Derive target tab if not explicitly set
        let targetTab = feature.getAttribute('data-tab');
        if (!targetTab) {
            const tabMap = ['coverage', 'session', 'ink', 'pricing'];
            targetTab = tabMap[index] || 'coverage';
            feature.setAttribute('data-tab', targetTab);
        }

        // Ensure accessibility attributes
        feature.setAttribute('role', 'button');
        feature.setAttribute('tabindex', '0');
        if (!feature.hasAttribute('aria-label')) {
            const labelText = feature.textContent.trim();
            feature.setAttribute('aria-label', `Navigate to ${labelText} calculator`);
        }

        // Click event listener
        feature.addEventListener('click', function(e) {
            e.preventDefault();
            const tabKey = this.getAttribute('data-tab') || 'coverage';
            selectTab(tabKey, true, true);
        });

        // Keyboard navigation (Enter or Space key)
        feature.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const tabKey = this.getAttribute('data-tab') || 'coverage';
                selectTab(tabKey, true, true);
            }
        });
    });

    // Ensure initial Hero active indicator is aligned with currently active tab
    const initialActiveTab = document.querySelector('.coverage__tab--active')?.getAttribute('data-tab') || 'coverage';
    syncHeroActiveTab(initialActiveTab);
}

/* ═══════════════════════════════════════════════════════════
   FORM INITIALIZATION
   ═══════════════════════════════════════════════════════════ */

function initializeForms() {
    // Coverage Calculator Form
    const coverageForm = document.getElementById('coverage-form');
    if (coverageForm) {
        coverageForm.addEventListener('submit', handleCoverageCalculation);
    }

    // Quick Reset Button for Coverage Calculator
    const resetCoverageBtn = document.getElementById('reset-coverage-btn');
    if (resetCoverageBtn) {
        resetCoverageBtn.addEventListener('click', handleCoverageReset);
    }

    // Session Time Estimator Form
    const sessionForm = document.getElementById('session-form');
    if (sessionForm) {
        sessionForm.addEventListener('submit', handleSessionCalculation);
    }

    // Ink Consumption Calculator Form
    const inkForm = document.getElementById('ink-form');
    if (inkForm) {
        inkForm.addEventListener('submit', handleInkCalculation);
    }

    // Pricing Calculator Form
    const pricingForm = document.getElementById('pricing-form');
    if (pricingForm) {
        pricingForm.addEventListener('submit', handlePricingCalculation);
    }
}

function handleCoverageReset() {
    const coverageForm = document.getElementById('coverage-form');
    if (coverageForm) {
        coverageForm.reset();
        // Reset secondary needle & elasticity selects explicitly to default
        const secSelect = document.getElementById('secondary-needle-config');
        if (secSelect) secSelect.value = '';
        const elasticitySelect = document.getElementById('skin-elasticity');
        if (elasticitySelect) elasticitySelect.value = 'standard';
    }

    const resultsDiv = document.getElementById('coverage-results');
    if (resultsDiv) resultsDiv.style.display = 'none';

    const progressContainer = document.getElementById('coverage-progress-container');
    if (progressContainer) progressContainer.style.display = 'none';

    // Show temporary reset notification
    showToastNotification('🔄 Coverage Calculator fields reset!');
}

function showToastNotification(message, color = '#10b981') {
    const toast = document.createElement('div');
    toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 10005; background: ${color}; color: white; padding: 0.85rem 1.25rem; border-radius: 8px; font-weight: 700; font-size: 0.88rem; box-shadow: 0 10px 25px rgba(0,0,0,0.4); animation: slideIn 0.3s ease;`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/* ═══════════════════════════════════════════════════════════
   COVERAGE CALCULATOR
   ═══════════════════════════════════════════════════════════ */

function handleCoverageCalculation(e) {
    e.preventDefault();

    // Get form values
    const needleConfig = document.getElementById('needle-config').value;
    const secondaryNeedleConfig = document.getElementById('secondary-needle-config')?.value || '';
    const skinElasticity = document.getElementById('skin-elasticity')?.value || 'standard';
    const technique = document.getElementById('technique').value;
    const workSpeed = document.getElementById('work-speed').value;
    const sessionHours = parseFloat(document.getElementById('session-hours').value);
    const breakTime = parseFloat(document.getElementById('break-time').value);
    const passes = parseInt(document.getElementById('passes').value);

    // Get primary needle data
    const needleData = NEEDLE_COVERAGE_RATES[needleConfig];
    if (!needleData) {
        alert('Please select a needle configuration');
        return;
    }

    // Get secondary needle data if configured
    let secondaryNeedleData = null;
    let primaryRate = needleData.coverage_rate[workSpeed] || 10;
    let baseCoverageRate = primaryRate;

    if (secondaryNeedleConfig && NEEDLE_COVERAGE_RATES[secondaryNeedleConfig]) {
        secondaryNeedleData = NEEDLE_COVERAGE_RATES[secondaryNeedleConfig];
        const secRate = secondaryNeedleData.coverage_rate[workSpeed] || 10;
        // Blended rate assuming 50/50 session split between primary & secondary needles
        baseCoverageRate = 2 / ((1 / primaryRate) + (1 / secRate));
    }

    // Calculate skin elasticity technical multiplier
    let elasticityMultiplier = 1.0;
    let elasticityLabel = 'Standard (1.0x)';
    if (skinElasticity === 'very-elastic') {
        elasticityMultiplier = 1.10; // +10% fast penetration
        elasticityLabel = 'Very Elastic (+10% Speed Boost)';
    } else if (skinElasticity === 'low-elasticity') {
        elasticityMultiplier = 0.85; // -15% technical difficulty penalty for mature/scarred skin
        elasticityLabel = 'Low Elasticity (-15% Technical Resistance Penalty)';
    }

    // Calculate effective coverage rate with elasticity factor
    const finalCoverageRate = baseCoverageRate * elasticityMultiplier;

    // Calculate effective working time (subtract breaks)
    const breakHours = (breakTime / 60) * sessionHours;
    const effectiveHours = sessionHours - breakHours;

    // Calculate total coverage
    const totalCoverage = finalCoverageRate * effectiveHours;

    // Adjust for passes (more passes = less effective new skin coverage)
    const adjustedCoverage = totalCoverage / passes;

    // Convert to square centimeters
    const coverageMetric = adjustedCoverage * 6.4516;

    // Hide previous results and trigger subtle progress bar animation
    const resultsDiv = document.getElementById('coverage-results');
    if (resultsDiv) resultsDiv.style.display = 'none';

    const progressContainer = document.getElementById('coverage-progress-container');
    const progressFill = document.getElementById('coverage-progress-fill');
    const progressPercent = document.getElementById('coverage-progress-percent');

    if (progressContainer && progressFill && progressPercent) {
        progressContainer.style.display = 'block';
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';

        let currentPercent = 0;
        const interval = setInterval(() => {
            currentPercent += Math.floor(Math.random() * 12) + 10;
            if (currentPercent >= 100) {
                currentPercent = 100;
                clearInterval(interval);
                progressFill.style.width = '100%';
                progressPercent.textContent = '100%';

                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    displayCoverageResults({
                        totalCoverage: adjustedCoverage,
                        coverageMetric: coverageMetric,
                        workingTime: effectiveHours,
                        coverageRate: finalCoverageRate,
                        primaryRate: primaryRate,
                        needleData: needleData,
                        secondaryNeedleData: secondaryNeedleData,
                        elasticityLabel: elasticityLabel,
                        elasticityMultiplier: elasticityMultiplier,
                        passes: passes,
                        technique: technique
                    });
                }, 120);
            } else {
                progressFill.style.width = currentPercent + '%';
                progressPercent.textContent = currentPercent + '%';
            }
        }, 35);
    } else {
        // Fallback direct display if elements absent
        displayCoverageResults({
            totalCoverage: adjustedCoverage,
            coverageMetric: coverageMetric,
            workingTime: effectiveHours,
            coverageRate: finalCoverageRate,
            primaryRate: primaryRate,
            needleData: needleData,
            secondaryNeedleData: secondaryNeedleData,
            elasticityLabel: elasticityLabel,
            elasticityMultiplier: elasticityMultiplier,
            passes: passes,
            technique: technique
        });
    }
}

/**
 * Smoothly animates a numeric value count-up with CSS pulse transition
 */
function animateValueCountUp(element, startVal, endVal, durationMs = 650, decimals = 1, suffix = '') {
    if (!element) return;
    
    element.classList.remove('coverage__result-value--updating');
    void element.offsetWidth; // Trigger browser reflow
    element.classList.add('coverage__result-value--updating');

    const start = isNaN(parseFloat(startVal)) ? 0 : parseFloat(startVal);
    const end = isNaN(parseFloat(endVal)) ? 0 : parseFloat(endVal);
    const startTime = performance.now();

    function updateFrame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // easeOutCubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;

        element.textContent = current.toFixed(decimals) + (suffix ? suffix : '');

        if (progress < 1) {
            requestAnimationFrame(updateFrame);
        } else {
            element.textContent = end.toFixed(decimals) + (suffix ? suffix : '');
            setTimeout(() => {
                element.classList.remove('coverage__result-value--updating');
            }, 300);
        }
    }

    requestAnimationFrame(updateFrame);
}

function displayCoverageResults(data) {
    const resultsDiv = document.getElementById('coverage-results');

    // Show results
    resultsDiv.style.display = 'block';

    // Animated count-up & smooth CSS transition for coverage results
    const totalEl = document.getElementById('coverage-total');
    const metricEl = document.getElementById('coverage-metric');
    const worktimeEl = document.getElementById('coverage-worktime');
    const rateEl = document.getElementById('coverage-rate');

    const prevTotal = totalEl ? (parseFloat(totalEl.textContent) || 0) : 0;
    const prevMetric = metricEl ? (parseFloat(metricEl.textContent) || 0) : 0;
    const prevWorktime = worktimeEl ? (parseFloat(worktimeEl.textContent) || 0) : 0;
    const prevRate = rateEl ? (parseFloat(rateEl.textContent) || 0) : 0;

    animateValueCountUp(totalEl, prevTotal, data.totalCoverage, 650, 1, '');
    animateValueCountUp(metricEl, prevMetric, data.coverageMetric, 650, 1, '');
    animateValueCountUp(worktimeEl, prevWorktime, data.workingTime, 650, 1, ' hrs');
    animateValueCountUp(rateEl, prevRate, data.coverageRate, 650, 1, '');

    // Set status badge
    const statusBadge = document.getElementById('coverage-status');
    statusBadge.textContent = T("x.calculation_complete", "✓ Calculation Complete");
    statusBadge.className = 'coverage__status-badge coverage__status-badge--optimal';

    // Create comparison (A-paper sizes + credit card)
    const comparisonDiv = document.getElementById('coverage-comparison');
    comparisonDiv.innerHTML = `
        <h4>Size Comparison</h4>
        <ul>
            <li>
                <span>Approximately</span>
                <strong>${(data.totalCoverage / 48.15).toFixed(2)}× A5 paper</strong>
                <small>(148mm × 210mm / 5.8" × 8.3")</small>
            </li>
            <li>
                <span>Or about</span>
                <strong>${(data.totalCoverage / 97.09).toFixed(2)}× A4 paper</strong>
                <small>(210mm × 297mm / 8.3" × 11.7")</small>
            </li>
            <li>
                <span>Or</span>
                <strong>${(data.totalCoverage / 193.05).toFixed(2)}× A3 paper</strong>
                <small>(297mm × 420mm / 11.7" × 16.5")</small>
            </li>
            <li>
                <span>About</span>
                <strong>${(data.totalCoverage / 7.17).toFixed(1)}× credit cards</strong>
                <small>(85.6mm × 54mm / 3.375" × 2.125")</small>
            </li>
        </ul>
    `;

    // Create notes including secondary needle & elasticity details
    const notesDiv = document.getElementById('coverage-notes');
    let needleComboHTML = `<strong>${data.needleData.name}</strong>`;
    if (data.secondaryNeedleData) {
        needleComboHTML = `<strong>${data.needleData.name}</strong> + <strong>${data.secondaryNeedleData.name}</strong> <small style="color: #0693e3;">(Blended 50/50 Dual Configuration)</small>`;
    }

    notesDiv.innerHTML = `
        <h4>Needle & Skin Elasticity Parameters</h4>
        <ul>
            <li>
                <span>Needle Setup:</span>
                <div>${needleComboHTML}</div>
            </li>
            <li>
                <span>Skin Elasticity Factor:</span>
                <strong>${data.elasticityLabel}</strong>
            </li>
            <li>
                <span>Best For:</span>
                <strong>${data.needleData.best_for}</strong>
            </li>
            <li>
                <span>Passes Required:</span>
                <strong>${data.passes} (${data.passes > data.needleData.passes_required ? 'more than typical' : 'standard'})</strong>
            </li>
            <li>
                <span>Ink Efficiency:</span>
                <strong>${data.needleData.ink_efficiency}</strong>
            </li>
        </ul>
    `;

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Save calculation history with structured metadata for CSV export
    const estInkCoverage = (data.totalCoverage * 0.15).toFixed(2);
    saveRecentCalculation(
        'coverage',
        'Coverage: ' + data.needleData.name,
        data.totalCoverage.toFixed(1) + ' sq in (' + data.coverageMetric.toFixed(1) + ' cm²)',
        'Work time: ' + data.workingTime.toFixed(1) + ' hrs',
        {
            needleType: data.secondaryNeedleData ? `${data.needleData.name} + ${data.secondaryNeedleData.name}` : data.needleData.name,
            sessionHours: data.workingTime.toFixed(1),
            coverageArea: data.totalCoverage.toFixed(1),
            estimatedInk: estInkCoverage
        }
    );
}

/* ═══════════════════════════════════════════════════════════
   SESSION TIME ESTIMATOR
   ═══════════════════════════════════════════════════════════ */

function handleSessionCalculation(e) {
    e.preventDefault();

    // Get form values
    const width = parseFloat(document.getElementById('tattoo-width').value);
    const height = parseFloat(document.getElementById('tattoo-height').value);
    const complexity = document.getElementById('complexity').value;
    const colorWork = document.getElementById('color-work').value;
    const bodyLocation = document.getElementById('body-location').value;
    const painTolerance = document.getElementById('pain-tolerance').value;

    const isMetric = currentGlobalUnit === 'sqcm';
    // Calculate total area normalized to sq in for base rate physics
    const totalAreaSqin = isMetric ? (width * height) / 6.4516 : (width * height);
    const displayArea = width * height;
    const displayUnit = isMetric ? 'cm²' : 'sq in';

    // Get complexity factor
    const complexityData = COMPLEXITY_FACTORS[complexity];

    // Get body location factor
    const locationData = BODY_LOCATION_FACTORS[bodyLocation];

    // Base time calculation (assuming medium speed with 9M1 needle)
    const baseNeedleRate = 20; // sq in per hour for 9M1 medium speed
    let baseTime = totalAreaSqin / baseNeedleRate;

    // Apply complexity multiplier
    baseTime *= complexityData.time_multiplier;

    // Apply body location multiplier
    baseTime *= locationData.time_multiplier;

    // Apply color work adjustment
    const colorMultiplier = {
        'blackgrey': 1.0,
        'limited-color': 1.3,
        'full-color': 1.6
    };
    baseTime *= colorMultiplier[colorWork];

    // Apply pain tolerance (affects breaks needed)
    const toleranceMultiplier = {
        'high': 1.0,
        'medium': 1.15,
        'low': 1.3
    };
    baseTime *= toleranceMultiplier[painTolerance];

    // Add buffer for setup, cleanup, unexpected challenges (15%)
    const totalTime = baseTime * 1.15;

    // Calculate number of sessions based on typical session length for location
    const maxSessionLength = locationData.typical_session;
    const sessionsNeeded = Math.ceil(totalTime / maxSessionLength);
    const hoursPerSession = totalTime / sessionsNeeded;

    // Calculate timeline (assume weekly sessions)
    const timelineWeeks = sessionsNeeded;

    // Determine if estimate is realistic
    let status = 'optimal';
    if (totalTime > 50) {
        status = 'ambitious'; // Very large project
    }
    if (hoursPerSession > maxSessionLength * 1.5) {
        status = 'unrealistic'; // Sessions too long
    }

    // Display results
    displaySessionResults({
        totalTime: totalTime,
        sessionsNeeded: sessionsNeeded,
        hoursPerSession: hoursPerSession,
        timelineWeeks: timelineWeeks,
        locationData: locationData,
        complexityData: complexityData,
        totalArea: totalAreaSqin,
        displayArea: displayArea,
        displayUnit: displayUnit,
        isMetric: isMetric,
        painTolerance: painTolerance,
        status: status
    });
}

function displaySessionResults(data) {
    const resultsDiv = document.getElementById('session-results');

    // Show results
    resultsDiv.style.display = 'block';

    // Update values
    document.getElementById('session-total-time').textContent = data.totalTime.toFixed(1) + ' hrs';
    document.getElementById('session-count').textContent = data.sessionsNeeded;
    document.getElementById('session-per-session').textContent = data.hoursPerSession.toFixed(1) + ' hrs';
    document.getElementById('session-timeline').textContent = data.timelineWeeks + ' weeks';

    // Set status badge
    const statusBadge = document.getElementById('session-status');
    if (data.status === 'optimal') {
        statusBadge.textContent = T("x.achievable_timeline", "✓ Achievable Timeline");
        statusBadge.className = 'coverage__status-badge coverage__status-badge--optimal';
    } else if (data.status === 'ambitious') {
        statusBadge.textContent = T("x.ambitious_project", "⚠ Ambitious Project");
        statusBadge.className = 'coverage__status-badge coverage__status-badge--ambitious';
    } else {
        statusBadge.textContent = T("x.adjust_expectations", "⚠️ Adjust Expectations");
        statusBadge.className = 'coverage__status-badge coverage__status-badge--unrealistic';
    }

    // Create session breakdown
    const breakdownDiv = document.getElementById('session-breakdown');
    let breakdownHTML = '<h4>Session Breakdown</h4><ul>';

    if (data.sessionsNeeded === 1) {
        breakdownHTML += `<li><span>Single Session:</span><strong>${data.hoursPerSession.toFixed(1)} hours total</strong></li>`;
    } else {
        for (let i = 1; i <= data.sessionsNeeded; i++) {
            const sessionType = i === 1 ? 'Outline' : (i === data.sessionsNeeded ? 'Details/Touch-ups' : 'Shading/Color');
            breakdownHTML += `<li><span>Session ${i} (${sessionType}):</span><strong>${data.hoursPerSession.toFixed(1)} hours</strong></li>`;
        }
    }

    breakdownHTML += '</ul>';
    breakdownDiv.innerHTML = breakdownHTML;

    // Create location notes
    const notesDiv = document.getElementById('session-location-notes');
    notesDiv.innerHTML = `
        <h4>Location Considerations</h4>
        <ul>
            <li>
                <span>Body Location:</span>
                <strong>${data.locationData.name}</strong>
            </li>
            <li>
                <span>Pain Level:</span>
                <strong>${data.locationData.pain_level} (${data.locationData.break_frequency} breaks)</strong>
            </li>
            <li>
                <span>Typical Session:</span>
                <strong>${data.locationData.typical_session} hours max recommended</strong>
            </li>
            <li>
                <span>Notes:</span>
                <strong>${data.locationData.notes}</strong>
            </li>
        </ul>
    `;

    // Render/update session timeline chart
    updateSessionTimelineChart(data);

    // Calculate & render Session Health Score & recommendations
    renderSessionHealthScore(data);

    // Update session chair timer target
    if (typeof sessionTimerState !== 'undefined') {
        sessionTimerState.targetSeconds = Math.round(data.totalTime * 3600);
        if (typeof updateSessionTimerDisplay === 'function') {
            updateSessionTimerDisplay();
        }
    }

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Save calculation history with structured metadata
    const estInkSession = (data.totalArea * 0.20).toFixed(2);
    saveRecentCalculation(
        'session',
        'Session: ' + data.locationData.name,
        data.totalTime.toFixed(1) + ' hrs total (' + data.sessionsNeeded + ' sessions)',
        'Area: ' + data.totalArea + ' sq in, Complexity: ' + data.complexityData.name,
        {
            needleType: 'Standard 9M1 Setup',
            sessionHours: data.totalTime.toFixed(1),
            coverageArea: data.totalArea.toFixed(1),
            estimatedInk: estInkSession
        }
    );
}

/* ═══════════════════════════════════════════════════════════
   INK CONSUMPTION CALCULATOR & BRANDS DATABASE
   ═══════════════════════════════════════════════════════════ */

const INK_BRANDS_DATABASE = {
    // Dynamic Color Co.
    'dynamic-black-8oz': { brand: 'Dynamic Color Co.', color: 'Black (Outlining/Shading)', name: 'Dynamic Black (8 oz)', size_ml: 240, price: 22.00 },
    'dynamic-triple-black-8oz': { brand: 'Dynamic Color Co.', color: 'Triple Black (Darkest)', name: 'Dynamic Triple Black (8 oz)', size_ml: 240, price: 24.00 },
    'dynamic-heavy-white-8oz': { brand: 'Dynamic Color Co.', color: 'Heavy White', name: 'Dynamic Heavy White (8 oz)', size_ml: 240, price: 25.00 },
    'dynamic-fire-red-1oz': { brand: 'Dynamic Color Co.', color: 'Fire Red', name: 'Dynamic Fire Red (1 oz)', size_ml: 30, price: 10.00 },
    'dynamic-canary-yellow-1oz': { brand: 'Dynamic Color Co.', color: 'Canary Yellow', name: 'Dynamic Canary Yellow (1 oz)', size_ml: 30, price: 10.00 },
    'dynamic-blue-1oz': { brand: 'Dynamic Color Co.', color: 'Electric Blue', name: 'Dynamic Blue (1 oz)', size_ml: 30, price: 10.00 },
    'dynamic-lime-green-1oz': { brand: 'Dynamic Color Co.', color: 'Lime Green', name: 'Dynamic Lime Green (1 oz)', size_ml: 30, price: 10.00 },
    'dynamic-violet-1oz': { brand: 'Dynamic Color Co.', color: 'Deep Violet', name: 'Dynamic Violet (1 oz)', size_ml: 30, price: 10.00 },

    // Solid Ink
    'solid-lining-black-4oz': { brand: 'Solid Ink', color: 'Lining Black', name: 'Solid Ink Lining Black (4 oz)', size_ml: 120, price: 20.00 },
    'solid-white-4oz': { brand: 'Solid Ink', color: 'Opaque White', name: 'Solid Ink White (4 oz)', size_ml: 120, price: 22.00 },
    'solid-marios-blue-1oz': { brand: 'Solid Ink', color: "Mario's Blue", name: "Solid Ink Mario's Blue (1 oz)", size_ml: 30, price: 11.00 },
    'solid-lime-green-1oz': { brand: 'Solid Ink', color: 'Lime Green', name: 'Solid Ink Lime Green (1 oz)', size_ml: 30, price: 11.00 },
    'solid-bright-red-1oz': { brand: 'Solid Ink', color: 'Bright Red', name: 'Solid Ink Bright Red (1 oz)', size_ml: 30, price: 11.00 },
    'solid-sunshine-yellow-1oz': { brand: 'Solid Ink', color: 'Sunshine Yellow', name: 'Solid Ink Sunshine Yellow (1 oz)', size_ml: 30, price: 11.00 },
    'solid-purple-haze-1oz': { brand: 'Solid Ink', color: 'Purple Haze', name: 'Solid Ink Purple Haze (1 oz)', size_ml: 30, price: 11.00 },
    'solid-flesh-1oz': { brand: 'Solid Ink', color: 'Medium Flesh Tone', name: 'Solid Ink Flesh Tone (1 oz)', size_ml: 30, price: 11.00 },

    // Eternal Ink
    'eternal-triple-black-4oz': { brand: 'Eternal Ink', color: 'Triple Black', name: 'Eternal Triple Black (4 oz)', size_ml: 120, price: 22.00 },
    'eternal-white-4oz': { brand: 'Eternal Ink', color: 'Whitehouse White', name: 'Eternal Whitehouse White (4 oz)', size_ml: 120, price: 24.00 },
    'eternal-bright-red-1oz': { brand: 'Eternal Ink', color: 'Bright Red', name: 'Eternal Bright Red (1 oz)', size_ml: 30, price: 11.50 },
    'eternal-canary-yellow-1oz': { brand: 'Eternal Ink', color: 'Canary Yellow', name: 'Eternal Canary Yellow (1 oz)', size_ml: 30, price: 11.50 },
    'eternal-sky-blue-1oz': { brand: 'Eternal Ink', color: 'Sky Blue', name: 'Eternal Sky Blue (1 oz)', size_ml: 30, price: 11.50 },
    'eternal-lime-green-1oz': { brand: 'Eternal Ink', color: 'Lime Green', name: 'Eternal Lime Green (1 oz)', size_ml: 30, price: 11.50 },
    'eternal-dark-purple-1oz': { brand: 'Eternal Ink', color: 'Dark Purple', name: 'Eternal Dark Purple (1 oz)', size_ml: 30, price: 11.50 },
    'eternal-cocoa-bean-1oz': { brand: 'Eternal Ink', color: 'Cocoa Bean Brown', name: 'Eternal Cocoa Bean (1 oz)', size_ml: 30, price: 11.50 },

    // Intenze Products
    'intenze-zuper-black-12oz': { brand: 'Intenze', color: 'Zuper Black', name: 'Intenze Zuper Black (12 oz)', size_ml: 360, price: 35.00 },
    'intenze-snow-white-4oz': { brand: 'Intenze', color: 'Snow White Opaque', name: 'Intenze Snow White (4 oz)', size_ml: 120, price: 22.00 },
    'intenze-bright-red-1oz': { brand: 'Intenze', color: 'Bright Red', name: 'Intenze Bright Red (1 oz)', size_ml: 30, price: 12.00 },
    'intenze-marios-light-blue-1oz': { brand: 'Intenze', color: "Mario's Light Blue", name: "Intenze Mario's Light Blue (1 oz)", size_ml: 30, price: 12.00 },
    'intenze-golden-yellow-1oz': { brand: 'Intenze', color: 'Golden Yellow', name: 'Intenze Golden Yellow (1 oz)', size_ml: 30, price: 12.00 },
    'intenze-forest-green-1oz': { brand: 'Intenze', color: 'Forest Green', name: 'Intenze Forest Green (1 oz)', size_ml: 30, price: 12.00 },
    'intenze-light-magenta-1oz': { brand: 'Intenze', color: 'Light Magenta', name: 'Intenze Light Magenta (1 oz)', size_ml: 30, price: 12.00 },

    // World Famous Tattoo Ink
    'worldfamous-pitch-black-4oz': { brand: 'World Famous', color: 'Pitch Black', name: 'World Famous Pitch Black (4 oz)', size_ml: 120, price: 20.00 },
    'worldfamous-pitch-black-8oz': { brand: 'World Famous', color: 'Pitch Black', name: 'World Famous Pitch Black (8 oz)', size_ml: 240, price: 32.00 },
    'worldfamous-blackout-4oz': { brand: 'World Famous', color: 'Blackout Black', name: 'World Famous Blackout Black (4 oz)', size_ml: 120, price: 22.00 },
    'worldfamous-lining-black-4oz': { brand: 'World Famous', color: 'Legendary Lining Black', name: 'World Famous Lining Black (4 oz)', size_ml: 120, price: 20.00 },
    'worldfamous-obsidian-black-4oz': { brand: 'World Famous', color: 'Obsidian Black', name: 'World Famous Obsidian Black (4 oz)', size_ml: 120, price: 21.00 },
    'worldfamous-whitehouse-4oz': { brand: 'World Famous', color: 'White House White', name: 'World Famous White House (4 oz)', size_ml: 120, price: 21.00 },
    'worldfamous-pure-white-4oz': { brand: 'World Famous', color: 'Pure White', name: 'World Famous Pure White (4 oz)', size_ml: 120, price: 20.00 },
    'worldfamous-opaque-white-1oz': { brand: 'World Famous', color: 'Opaque White', name: 'World Famous Opaque White (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-dark-red-1oz': { brand: 'World Famous', color: 'Master Dark Red', name: 'World Famous Master Dark Red (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-paul-rogers-red-1oz': { brand: 'World Famous', color: 'Paul Rogers Red', name: 'World Famous Paul Rogers Red (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-hoover-blue-1oz': { brand: 'World Famous', color: 'Hoover Dam Blue', name: 'World Famous Hoover Dam Blue (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-big-mike-blue-1oz': { brand: 'World Famous', color: 'Big Mike Blue', name: 'World Famous Big Mike Blue (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-yellow-1oz': { brand: 'World Famous', color: 'Multi-Town Yellow', name: 'World Famous Yellow (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-sunshine-yellow-1oz': { brand: 'World Famous', color: 'Sunshine Yellow', name: 'World Famous Sunshine Yellow (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-venice-green-1oz': { brand: 'World Famous', color: 'Venice Green', name: 'World Famous Venice Green (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-galapagos-green-1oz': { brand: 'World Famous', color: 'Galapagos Green', name: 'World Famous Galapagos Green (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-purple-rain-1oz': { brand: 'World Famous', color: 'Purple Rain', name: 'World Famous Purple Rain (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-port-wine-1oz': { brand: 'World Famous', color: 'Port Wine', name: 'World Famous Port Wine (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-flesh-1oz': { brand: 'World Famous', color: 'Portrait Flesh Tone', name: 'World Famous Portrait Flesh (1 oz)', size_ml: 30, price: 10.50 },
    'worldfamous-straight-dark-greywash-4oz': { brand: 'World Famous', color: 'Straight Dark Greywash', name: 'World Famous Straight Dark Greywash (4 oz)', size_ml: 120, price: 20.00 },
    'worldfamous-mid-tone-greywash-4oz': { brand: 'World Famous', color: 'Mid-Tone Greywash', name: 'World Famous Mid-Tone Greywash (4 oz)', size_ml: 120, price: 20.00 },
    'worldfamous-charcoal-greywash-4oz': { brand: 'World Famous', color: 'Charcoal Greywash', name: 'World Famous Charcoal Greywash (4 oz)', size_ml: 120, price: 20.00 },
    'worldfamous-ghost-wash-4oz': { brand: 'World Famous', color: 'Ghost Wash Light', name: 'World Famous Ghost Wash (4 oz)', size_ml: 120, price: 20.00 },
    'worldfamous-limitless-jet-black-4oz': { brand: 'World Famous', color: 'Limitless Jet Black (REACH)', name: 'World Famous Limitless Jet Black (4 oz)', size_ml: 120, price: 24.00 },
    'worldfamous-limitless-bright-white-4oz': { brand: 'World Famous', color: 'Limitless Bright White (REACH)', name: 'World Famous Limitless Bright White (4 oz)', size_ml: 120, price: 24.00 },
    'worldfamous-limitless-fire-red-1oz': { brand: 'World Famous', color: 'Limitless Fire Red (REACH)', name: 'World Famous Limitless Fire Red (1 oz)', size_ml: 30, price: 12.50 },
    'worldfamous-limitless-canary-yellow-1oz': { brand: 'World Famous', color: 'Limitless Canary Yellow (REACH)', name: 'World Famous Limitless Canary Yellow (1 oz)', size_ml: 30, price: 12.50 },
    'worldfamous-limitless-royal-blue-1oz': { brand: 'World Famous', color: 'Limitless Royal Blue (REACH)', name: 'World Famous Limitless Royal Blue (1 oz)', size_ml: 30, price: 12.50 },
    'worldfamous-limitless-emerald-green-1oz': { brand: 'World Famous', color: 'Limitless Emerald Green (REACH)', name: 'World Famous Limitless Emerald Green (1 oz)', size_ml: 30, price: 12.50 },

    // Radiant Colors
    'radiant-turbo-black-4oz': { brand: 'Radiant Colors', color: 'Turbo Black', name: 'Radiant Turbo Black (4 oz)', size_ml: 120, price: 18.00 },
    'radiant-super-white-4oz': { brand: 'Radiant Colors', color: 'Super White', name: 'Radiant Super White (4 oz)', size_ml: 120, price: 19.00 },
    'radiant-real-red-1oz': { brand: 'Radiant Colors', color: 'Real Red', name: 'Radiant Real Red (1 oz)', size_ml: 30, price: 10.00 },
    'radiant-electric-blue-1oz': { brand: 'Radiant Colors', color: 'Electric Blue', name: 'Radiant Electric Blue (1 oz)', size_ml: 30, price: 10.00 },
    'radiant-canary-yellow-1oz': { brand: 'Radiant Colors', color: 'Canary Yellow', name: 'Radiant Canary Yellow (1 oz)', size_ml: 30, price: 10.00 },
    'radiant-avocado-green-1oz': { brand: 'Radiant Colors', color: 'Avocado Green', name: 'Radiant Avocado Green (1 oz)', size_ml: 30, price: 10.00 },

    // Fusion Tattoo Ink
    'fusion-power-black-4oz': { brand: 'Fusion Ink', color: 'Power Black', name: 'Fusion Power Black (4 oz)', size_ml: 120, price: 20.00 },
    'fusion-mixing-white-4oz': { brand: 'Fusion Ink', color: 'Mixing White', name: 'Fusion Mixing White (4 oz)', size_ml: 120, price: 20.00 },
    'fusion-really-red-1oz': { brand: 'Fusion Ink', color: 'Really Red', name: 'Fusion Really Red (1 oz)', size_ml: 30, price: 11.00 },
    'fusion-atomic-yellow-1oz': { brand: 'Fusion Ink', color: 'Atomic Yellow', name: 'Fusion Atomic Yellow (1 oz)', size_ml: 30, price: 11.00 },
    'fusion-royal-blue-1oz': { brand: 'Fusion Ink', color: 'Royal Blue', name: 'Fusion Royal Blue (1 oz)', size_ml: 30, price: 11.00 },
    'fusion-emerald-green-1oz': { brand: 'Fusion Ink', color: 'Emerald Green', name: 'Fusion Emerald Green (1 oz)', size_ml: 30, price: 11.00 },
    'fusion-pink-1oz': { brand: 'Fusion Ink', color: 'Bubblegum Pink', name: 'Fusion Bubblegum Pink (1 oz)', size_ml: 30, price: 11.00 },

    // Allegory Ink
    'allegory-blak-8oz': { brand: 'Allegory Ink', color: 'Allegory Blak (Outlining)', name: 'Allegory Blak (8 oz)', size_ml: 240, price: 28.00 },
    'allegory-white-8oz': { brand: 'Allegory Ink', color: 'Allegory White', name: 'Allegory White (8 oz)', size_ml: 240, price: 28.00 },

    // Kuro Sumi
    'kuro-sumi-black-6oz': { brand: 'Kuro Sumi', color: 'Imperial Outlining Black', name: 'Kuro Sumi Imperial Black (6 oz)', size_ml: 180, price: 25.00 },
    'kuro-sumi-white-6oz': { brand: 'Kuro Sumi', color: 'Imperial White', name: 'Kuro Sumi Imperial White (6 oz)', size_ml: 180, price: 25.00 },
    'kuro-sumi-red-1oz': { brand: 'Kuro Sumi', color: "Dragon's Breath Red", name: "Kuro Sumi Dragon's Breath Red (1 oz)", size_ml: 30, price: 12.00 },

    'custom': { brand: 'Custom Ink', color: 'Custom Line', name: 'Custom Ink & Color', size_ml: 120, price: 18.00 }
};

function initializeInkBrandWiring() {
    const brandSelect = document.getElementById('ink-bottle-brand');
    const priceInput = document.getElementById('ink-bottle-price');
    const sizeSelect = document.getElementById('ink-bottle-size');

    if (!brandSelect || !priceInput || !sizeSelect) return;

    brandSelect.addEventListener('change', function() {
        const val = this.value;
        if (INK_BRANDS_DATABASE[val]) {
            const data = INK_BRANDS_DATABASE[val];
            if (data.price) {
                priceInput.value = data.price.toFixed(2);
            }
            if (data.size_ml) {
                sizeSelect.value = data.size_ml.toString();
            }
        }
    });
}

function handleInkCalculation(e) {
    e.preventDefault();

    // Get form values
    const area = parseFloat(document.getElementById('ink-area').value);
    const technique = document.getElementById('ink-technique').value;
    const saturation = document.getElementById('saturation').value;
    const colorCount = parseInt(document.getElementById('color-count').value);
    const passes = parseInt(document.getElementById('ink-passes').value);
    const wasteFactor = document.getElementById('waste-factor').value;

    // Custom Bottle Pricing & Waste Sub-Feature values
    const brandSelectEl = document.getElementById('ink-bottle-brand');
    let bottleBrand = 'Dynamic Black (8 oz)';
    if (brandSelectEl) {
        const key = brandSelectEl.value;
        if (INK_BRANDS_DATABASE[key]) {
            bottleBrand = INK_BRANDS_DATABASE[key].name;
        } else if (brandSelectEl.options && brandSelectEl.selectedIndex >= 0) {
            bottleBrand = brandSelectEl.options[brandSelectEl.selectedIndex].text;
        } else {
            bottleBrand = brandSelectEl.value;
        }
    }
    const bottleSizeMl = document.getElementById('ink-bottle-size') ? parseFloat(document.getElementById('ink-bottle-size').value) || 120 : 120;
    const bottlePrice = document.getElementById('ink-bottle-price') ? parseFloat(document.getElementById('ink-bottle-price').value) || 18.00 : 18.00;

    // Get technique data
    const techniqueData = INK_CONSUMPTION_RATES[technique];

    const isMetric = currentGlobalUnit === 'sqcm';
    const areaInSqin = isMetric ? area / 6.4516 : area;

    // Calculate base ink needed
    const baseInk = areaInSqin * techniqueData.ink_per_sqinch;

    // Apply saturation adjustment
    const saturationMultiplier = {
        'light': 0.7,
        'medium': 1.0,
        'heavy': 1.4
    };
    const adjustedInk = baseInk * saturationMultiplier[saturation];

    // Apply passes (ink deposited into skin)
    const inkWithPasses = adjustedInk * passes;

    // Apply waste factor (total ink poured into caps/trays)
    const wasteMultiplier = WASTE_FACTORS[wasteFactor];
    const totalInk = inkWithPasses * wasteMultiplier;

    // Wasted pigment calculation
    const wastedInkMl = totalInk - inkWithPasses;

    // Calculate per color
    const inkPerColor = totalInk / colorCount;

    // Calculate caps needed (5ml per cap)
    const capsNeeded = Math.ceil(totalInk / 5);

    // Calculate cost estimate using custom bottle pricing
    const pricePerMl = bottlePrice / bottleSizeMl;
    const costEstimate = totalInk * pricePerMl;
    const wastedCostEstimate = wastedInkMl * pricePerMl;
    const bottlePercentUsed = (totalInk / bottleSizeMl) * 100;

    // Display results
    displayInkResults({
        totalInk: totalInk,
        inkPerColor: inkPerColor,
        capsNeeded: capsNeeded,
        costEstimate: costEstimate,
        pricePerMl: pricePerMl,
        wastedInkMl: wastedInkMl,
        wastedCostEstimate: wastedCostEstimate,
        bottlePercentUsed: bottlePercentUsed,
        bottleBrand: bottleBrand,
        bottleSizeMl: bottleSizeMl,
        bottlePrice: bottlePrice,
        techniqueData: techniqueData,
        technique: technique,
        saturation: saturation,
        wasteFactor: wasteFactor,
        colorCount: colorCount,
        passes: passes,
        area: area,
        areaInSqin: areaInSqin,
        isMetric: isMetric
    });
}

function displayInkResults(data) {
    const resultsDiv = document.getElementById('ink-results');

    // Show results
    resultsDiv.style.display = 'block';

    // Update values
    document.getElementById('ink-total').textContent = data.totalInk.toFixed(1) + ' ml';
    document.getElementById('ink-per-color').textContent = data.inkPerColor.toFixed(1) + ' ml';
    document.getElementById('ink-caps').textContent = data.capsNeeded;
    document.getElementById('ink-cost').textContent = '$' + data.costEstimate.toFixed(2);

    // Create breakdown
    const unitLabel = data.isMetric ? 'cm²' : 'sq in';
    const breakdownDiv = document.getElementById('ink-breakdown');
    breakdownDiv.innerHTML = `
        <h4>Consumption & Bottle Waste Cost Analysis</h4>
        <ul>
            <li>
                <span>Ink Brand / Line:</span>
                <strong>${data.bottleBrand} ($${data.bottlePrice.toFixed(2)} for ${data.bottleSizeMl}ml — $${data.pricePerMl.toFixed(3)}/ml)</strong>
            </li>
            <li>
                <span>Session Ink Cost:</span>
                <strong>$${data.costEstimate.toFixed(2)} (${data.bottlePercentUsed.toFixed(1)}% of a bottle)</strong>
            </li>
            <li>
                <span>Pigment Deposited in Skin:</span>
                <strong>${(data.totalInk - data.wastedInkMl).toFixed(1)} ml ($${((data.totalInk - data.wastedInkMl) * data.pricePerMl).toFixed(2)})</strong>
            </li>
            <li>
                <span>Wasted Pigment (Caps/Wipes/Tubes):</span>
                <strong>${data.wastedInkMl.toFixed(1)} ml ($${data.wastedCostEstimate.toFixed(2)})</strong>
            </li>
            <li>
                <span>Coverage & Technique:</span>
                <strong>${data.area} ${unitLabel}, ${data.techniqueData.name} (${data.passes} passes)</strong>
            </li>
            <li>
                <span>Ink Caps & Reordering:</span>
                <strong>${data.capsNeeded} caps needed (5ml each) | Approx. ${Math.ceil(data.totalInk / 30)} × 30ml bottles</strong>
            </li>
        </ul>
    `;

    // Render Needle & Technique Optimization Suggestions
    renderInkOptimizationSuggestions(data);

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Save calculation history with structured metadata
    const estHoursInk = (data.areaInSqin / 10).toFixed(1);
    saveRecentCalculation(
        'ink',
        'Ink: ' + data.techniqueData.name + ' (' + data.bottleBrand + ')',
        data.totalInk.toFixed(1) + ' ml (Cost: $' + data.costEstimate.toFixed(2) + ')',
        'Area: ' + data.area + ' ' + unitLabel + ', Waste: ' + data.wastedInkMl.toFixed(1) + 'ml ($' + data.wastedCostEstimate.toFixed(2) + ')',
        {
            needleType: data.techniqueData.name + ' Config',
            sessionHours: estHoursInk,
            coverageArea: data.areaInSqin.toFixed(1),
            estimatedInk: data.totalInk.toFixed(1)
        }
    );
}

/* ═══════════════════════════════════════════════════════════
   PRICING CALCULATOR
   ═══════════════════════════════════════════════════════════ */

function handlePricingCalculation(e) {
    e.preventDefault();

    // Get form values
    const hours = parseFloat(document.getElementById('pricing-hours').value);
    const hourlyRate = parseFloat(document.getElementById('hourly-rate').value);
    const complexity = document.getElementById('pricing-complexity').value;
    const area = parseFloat(document.getElementById('pricing-area').value);
    const depositPercent = parseFloat(document.getElementById('deposit-percent').value);
    const sessions = parseInt(document.getElementById('pricing-sessions').value);

    const isMetric = currentGlobalUnit === 'sqcm';
    const areaInSqin = isMetric ? area / 6.4516 : area;

    // Get complexity factor
    const complexityData = COMPLEXITY_FACTORS[complexity];

    // Calculate base price
    const basePrice = hours * hourlyRate;

    // Apply complexity adjustment
    const adjustedPrice = basePrice * complexityData.price_multiplier;

    // Calculate price range (±15%)
    const priceMin = adjustedPrice * 0.85;
    const priceMax = adjustedPrice * 1.15;

    // Calculate deposit
    const deposit = adjustedPrice * (depositPercent / 100);

    // Calculate per unit (sq in or cm²)
    const perUnit = adjustedPrice / area;
    const perSqInch = adjustedPrice / areaInSqin;

    // Calculate per session
    const perSession = adjustedPrice / sessions;

    // Determine pricing status based on normalized sq inch benchmark ($5 - $30/sq in)
    let status = 'optimal';
    if (perSqInch < 5) {
        status = 'underpriced';
    } else if (perSqInch > 30) {
        status = 'premium';
    }

    // Display results
    displayPricingResults({
        suggestedPrice: adjustedPrice,
        priceMin: priceMin,
        priceMax: priceMax,
        deposit: deposit,
        perUnit: perUnit,
        perSqInch: perSqInch,
        perSession: perSession,
        hours: hours,
        hourlyRate: hourlyRate,
        sessions: sessions,
        status: status,
        complexityData: complexityData,
        area: area,
        areaInSqin: areaInSqin,
        isMetric: isMetric
    });
}

function displayPricingResults(data) {
    const resultsDiv = document.getElementById('pricing-results');

    // Show results
    resultsDiv.style.display = 'block';

    // Update values
    document.getElementById('pricing-suggested').textContent = '$' + data.suggestedPrice.toFixed(0);
    document.getElementById('pricing-range').textContent = '$' + data.priceMin.toFixed(0) + ' - $' + data.priceMax.toFixed(0);
    document.getElementById('pricing-deposit').textContent = '$' + data.deposit.toFixed(0);
    document.getElementById('pricing-per-sqin').textContent = '$' + data.perUnit.toFixed(2);

    // Set status badge
    const statusBadge = document.getElementById('pricing-status');
    if (data.status === 'underpriced') {
        statusBadge.textContent = T("badge_underpriced", "⚠ Consider Increasing");
        statusBadge.className = 'coverage__status-badge coverage__status-badge--ambitious';
    } else if (data.status === 'premium') {
        statusBadge.textContent = T("badge_premium", "✓ Premium Pricing");
        statusBadge.className = 'coverage__status-badge coverage__status-badge--optimal';
    } else {
        statusBadge.textContent = T("badge_market_rate", "✓ Market Rate");
        statusBadge.className = 'coverage__status-badge coverage__status-badge--optimal';
    }

    // Create breakdown
    const breakdownDiv = document.getElementById('pricing-breakdown');
    let breakdownHTML = '<h4>Payment Breakdown</h4><ul>';

    if (data.sessions === 1) {
        breakdownHTML += `
            <li><span>Deposit (upfront):</span><strong>$${data.deposit.toFixed(0)}</strong></li>
            <li><span>Balance (at session):</span><strong>$${(data.suggestedPrice - data.deposit).toFixed(0)}</strong></li>
        `;
    } else {
        breakdownHTML += `
            <li><span>Deposit (booking):</span><strong>$${data.deposit.toFixed(0)}</strong></li>
            <li><span>Per session (${data.sessions} sessions):</span><strong>$${data.perSession.toFixed(0)}</strong></li>
            <li><span>Final session balance:</span><strong>$${(data.suggestedPrice - data.deposit - (data.perSession * (data.sessions - 1))).toFixed(0)}</strong></li>
        `;
    }

    breakdownHTML += '</ul>';
    breakdownDiv.innerHTML = breakdownHTML;

    // Create profitability notes
    const profitDiv = document.getElementById('pricing-profitability');
    profitDiv.innerHTML = `
        <h4>Profitability Analysis</h4>
        <ul>
            <li>
                <span>Effective Hourly Rate:</span>
                <strong>$${(data.suggestedPrice / data.hours).toFixed(2)}/hr</strong>
            </li>
            <li>
                <span>Complexity Adjustment:</span>
                <strong>${data.complexityData.name} (${data.complexityData.price_multiplier}x)</strong>
            </li>
            <li>
                <span>Per Square Inch:</span>
                <strong>$${data.perSqInch.toFixed(2)}/sq in</strong>
            </li>
            <li>
                <span>Market Positioning:</span>
                <strong>${data.status === 'underpriced' ? 'Below market - consider increasing' : (data.status === 'premium' ? 'Premium rate - ensure quality justifies' : 'Competitive market rate')}</strong>
            </li>
        </ul>
    `;

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Save calculation history with structured metadata
    const estInkPricing = data.area ? (data.area * 0.18).toFixed(2) : 'N/A';
    saveRecentCalculation(
        'pricing',
        'Pricing: $' + data.suggestedPrice.toFixed(0),
        'Deposit: $' + data.deposit.toFixed(0) + ' (' + data.perSqInch.toFixed(2) + '/sq in)',
        'Hours: ' + data.hours + ' hrs @ $' + data.hourlyRate + '/hr',
        {
            needleType: 'Studio Standard',
            sessionHours: data.hours.toFixed(1),
            coverageArea: data.area ? data.area.toFixed(1) : 'N/A',
            estimatedInk: estInkPricing
        }
    );
}

/* ═══════════════════════════════════════════════════════════
   MODAL FUNCTIONALITY
   ═══════════════════════════════════════════════════════════ */

function initializeModal() {
    const embedButton = document.getElementById('embed-button');
    const modal = document.getElementById('embed-modal');
    if (!modal) return;

    const modalOverlay = modal.querySelector('.coverage__modal-overlay');
    const closeButton = modal.querySelector('.coverage__modal-close');
    const copyButton = document.getElementById('copy-embed-code');

    // Open modal
    if (embedButton) {
        embedButton.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal - close button
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Close modal - overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Close modal - Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Copy embed code
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const embedCodeEl = document.getElementById('embed-code');
            if (!embedCodeEl) return;
            const embedCode = embedCodeEl.textContent;

            // Modern Clipboard API
            navigator.clipboard.writeText(embedCode).then(function() {
                // Show success message
                const successMsg = document.getElementById('copy-success');
                if (successMsg) successMsg.style.display = 'block';

                // Hide after 3 seconds
                setTimeout(function() {
                    if (successMsg) successMsg.style.display = 'none';
                }, 3000);
            }).catch(function(err) {
                console.error('Failed to copy:', err);
                alert('Failed to copy code. Please copy manually.');
            });
        });
    }
}

/* ═══════════════════════════════════════════════════════════
   EMAIL FORM HANDLERS
   ═══════════════════════════════════════════════════════════ */

function initializeEmailForms() {
    // Footer email form
    const footerForm = document.getElementById('footer-email-form');
    if (footerForm) {
        footerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this, 'footer');
        });
    }

    // Modal email form
    const modalForm = document.getElementById('modal-email-form');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this, 'modal');
        });
    }
}

function handleEmailSubmit(form, location) {
    const emailInput = form.querySelector('.coverage__email-input');
    const email = emailInput.value.trim();
    const successMsg = document.getElementById(location + '-email-success');
    const errorMsg = document.getElementById(location + '-email-error');

    // Reset messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.style.display = 'block';
        return;
    }

    // TODO: Replace with actual email service integration (Mailchimp/ConvertKit)
    // For now, simulate successful submission
    console.log('Email submitted:', email, 'Location:', location);

    // Show success message
    successMsg.style.display = 'block';
    emailInput.value = '';

    // Hide success message after 5 seconds
    setTimeout(function() {
        successMsg.style.display = 'none';
    }, 5000);
}

/* ═══════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════ */

function formatNumber(num, decimals = 0) {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/* ═══════════════════════════════════════════════════════════
   RECENT CALCULATIONS HISTORY ENGINE & CSV EXPORT
   ═══════════════════════════════════════════════════════════ */

const RECENT_CALCS_KEY = 'coverage_calculator_recent_v1';

function initializeRecentCalculations() {
    const clearBtn = document.getElementById('clear-history-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');

    if (clearBtn) {
        clearBtn.addEventListener('click', clearRecentCalculations);
    }

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportCalculationsCSV);
    }

    renderRecentCalculations();
}

let selectedRecentCalcIds = new Set();

function getRecentCalculations() {
    try {
        const data = localStorage.getItem(RECENT_CALCS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading recent calculations:', e);
        return [];
    }
}

function saveRecentCalculation(type, title, detail, params, structuredMeta = {}) {
    const records = getRecentCalculations();
    const newRecord = {
        id: 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp: Date.now(),
        dateStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
        isoDate: new Date().toISOString(),
        type: type,
        title: title,
        detail: detail,
        params: params,
        needleType: structuredMeta.needleType || (type === 'coverage' ? title.replace('Coverage: ', '') : 'Standard Setup'),
        sessionHours: structuredMeta.sessionHours || 'N/A',
        coverageArea: structuredMeta.coverageArea || 'N/A',
        estimatedInk: structuredMeta.estimatedInk || 'N/A',
        saturation: structuredMeta.saturation || 'N/A',
        density: structuredMeta.density || 'N/A'
    };

    records.unshift(newRecord);
    if (records.length > 20) records.pop();

    try {
        localStorage.setItem(RECENT_CALCS_KEY, JSON.stringify(records));
    } catch (e) {
        console.error('Error saving calculation history:', e);
    }

    renderRecentCalculations();
}

function renderRecentCalculations() {
    const listEl = document.getElementById('recent-calculations-list');
    const badgeEl = document.getElementById('recent-count-badge');
    const clearBtn = document.getElementById('clear-history-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const selectAllWrap = document.getElementById('recent-select-all-wrap');
    const selectAllCheckbox = document.getElementById('recent-select-all-checkbox');
    const batchSummaryBtn = document.getElementById('recent-batch-summary-btn');
    const batchDeleteBtn = document.getElementById('recent-batch-delete-btn');
    const selectedCountEl = document.getElementById('recent-selected-count');

    if (!listEl) return;

    const records = getRecentCalculations();

    // Clean up selected IDs that no longer exist
    const validIds = new Set(records.map(r => r.id));
    selectedRecentCalcIds.forEach(id => {
        if (!validIds.has(id)) selectedRecentCalcIds.delete(id);
    });

    if (badgeEl) badgeEl.textContent = TP("x.saved", "{0} saved", records.length);
    if (clearBtn) clearBtn.style.display = records.length > 0 ? 'inline-block' : 'none';
    if (exportCsvBtn) exportCsvBtn.style.display = records.length > 0 ? 'inline-block' : 'none';

    // Batch controls visibility
    if (selectAllWrap) {
        selectAllWrap.style.display = records.length > 0 ? 'inline-flex' : 'none';
    }
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = records.length > 0 && selectedRecentCalcIds.size === records.length;
        selectAllCheckbox.indeterminate = selectedRecentCalcIds.size > 0 && selectedRecentCalcIds.size < records.length;
    }
    if (selectedCountEl) {
        selectedCountEl.textContent = selectedRecentCalcIds.size;
    }
    if (batchSummaryBtn) {
        batchSummaryBtn.style.display = selectedRecentCalcIds.size > 0 ? 'inline-flex' : 'none';
    }
    if (batchDeleteBtn) {
        batchDeleteBtn.style.display = selectedRecentCalcIds.size > 0 ? 'inline-flex' : 'none';
    }

    if (records.length === 0) {
        listEl.innerHTML = '<p class="coverage__recent-empty">No saved calculations yet. Perform a calculation below to auto-save your session records.</p>';
        return;
    }

    listEl.innerHTML = records.map(item => {
        const isSelected = selectedRecentCalcIds.has(item.id);
        const paramsText = typeof item.params === 'object' ? JSON.stringify(item.params).replace(/["{}]/g, '').replace(/,/g, ' • ') : item.params;
        return `
            <div class="coverage__recent-item ${isSelected ? 'coverage__recent-item--selected' : ''}" data-id="${item.id}">
                <div class="recent-calc-checkbox-wrap" onclick="event.stopPropagation();">
                    <input type="checkbox" class="recent-calc-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''} aria-label="Select calculation for batch planning">
                </div>
                <div class="coverage__recent-item-info">
                    <div class="coverage__recent-item-title">${item.title}</div>
                    <div class="coverage__recent-item-meta">${item.detail}</div>
                    <div class="coverage__recent-item-date">📅 ${item.dateStr} | ${paramsText}</div>
                </div>
                <div class="coverage__recent-actions">
                    <button type="button" class="coverage__recent-delete-btn" onclick="event.stopPropagation(); deleteRecentCalculation('${item.id}')" title="Delete record">✕</button>
                </div>
            </div>
        `;
    }).join('');

    // Attach event listeners to checkboxes and items
    listEl.querySelectorAll('.recent-calc-checkbox').forEach(cb => {
        cb.addEventListener('change', function(e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            if (this.checked) {
                selectedRecentCalcIds.add(id);
            } else {
                selectedRecentCalcIds.delete(id);
            }
            renderRecentCalculations();
        });
    });

    listEl.querySelectorAll('.coverage__recent-item').forEach(itemEl => {
        itemEl.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.type === 'checkbox') return;
            const id = this.getAttribute('data-id');
            if (selectedRecentCalcIds.has(id)) {
                selectedRecentCalcIds.delete(id);
            } else {
                selectedRecentCalcIds.add(id);
            }
            renderRecentCalculations();
        });
    });
}

function deleteRecentCalculation(id) {
    let records = getRecentCalculations();
    records = records.filter(item => item.id !== id);
    selectedRecentCalcIds.delete(id);
    try {
        localStorage.setItem(RECENT_CALCS_KEY, JSON.stringify(records));
    } catch (e) {
        console.error(e);
    }
    renderRecentCalculations();
}

function clearRecentCalculations() {
    if (confirm('Are you sure you want to clear your calculation history?')) {
        localStorage.removeItem(RECENT_CALCS_KEY);
        selectedRecentCalcIds.clear();
        renderRecentCalculations();
        if (typeof showToastNotification === 'function') {
            showToastNotification('🗑️ <strong>Cleared History</strong>: All saved calculations removed.');
        }
    }
}

function deleteSelectedRecentCalculations() {
    if (selectedRecentCalcIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedRecentCalcIds.size} selected calculation(s)?`)) {
        let records = getRecentCalculations();
        records = records.filter(item => !selectedRecentCalcIds.has(item.id));
        const countDeleted = selectedRecentCalcIds.size;
        selectedRecentCalcIds.clear();
        try {
            localStorage.setItem(RECENT_CALCS_KEY, JSON.stringify(records));
        } catch (e) {
            console.error(e);
        }
        renderRecentCalculations();
        if (typeof showToastNotification === 'function') {
            showToastNotification(`🗑️ Deleted <strong>${countDeleted} selected calculation(s)</strong>.`);
        }
    }
}

function toggleSelectAllRecentCalculations(checked) {
    const records = getRecentCalculations();
    if (checked) {
        records.forEach(r => selectedRecentCalcIds.add(r.id));
    } else {
        selectedRecentCalcIds.clear();
    }
    renderRecentCalculations();
}

/* ═══════════════════════════════════════════════════════════
   MULTI-SESSION PROJECT PLANNING SUMMARY ENGINE
   ═══════════════════════════════════════════════════════════ */

function openMultiSessionPlanningModal() {
    const records = getRecentCalculations();
    const selected = records.filter(r => selectedRecentCalcIds.has(r.id));

    if (selected.length === 0) {
        if (typeof showToastNotification === 'function') {
            showToastNotification('⚠️ Please select at least one calculation from Recent History first.');
        }
        return;
    }

    const modal = document.getElementById('multi-session-modal');
    const overlay = document.getElementById('multi-session-overlay');
    const closeBtn = document.getElementById('multi-session-close');
    const closeBottomBtn = document.getElementById('multi-session-close-btn');
    const metricsGrid = document.getElementById('multi-session-metrics-grid');
    const tableBody = document.getElementById('multi-session-table-body');
    const itemCountBadge = document.getElementById('multi-session-item-count');
    const clinicalBox = document.getElementById('multi-session-clinical-box');

    if (!modal) return;

    // Aggregate statistics across selected calculations
    let totalAreaSqin = 0;
    let totalChairHours = 0;
    let totalInkMl = 0;
    let maxSaturation = 0;
    let avgSaturation = 0;
    let saturationSum = 0;
    let saturationCount = 0;

    selected.forEach(item => {
        // Extract area
        let areaVal = 0;
        if (item.coverageArea && typeof item.coverageArea === 'number') {
            areaVal = item.coverageArea;
        } else if (typeof item.coverageArea === 'string' && parseFloat(item.coverageArea)) {
            areaVal = parseFloat(item.coverageArea);
        } else if (item.params && item.params.area) {
            areaVal = parseFloat(item.params.area);
        } else if (item.title && item.title.match(/([\d.]+)\s*(?:sq\s*in|in²)/i)) {
            areaVal = parseFloat(item.title.match(/([\d.]+)\s*(?:sq\s*in|in²)/i)[1]);
        }
        totalAreaSqin += areaVal || 15;

        // Extract chair hours
        let hoursVal = 0;
        if (item.sessionHours && typeof item.sessionHours === 'number') {
            hoursVal = item.sessionHours;
        } else if (typeof item.sessionHours === 'string' && parseFloat(item.sessionHours)) {
            hoursVal = parseFloat(item.sessionHours);
        } else if (item.params && item.params.chairTime) {
            hoursVal = parseFloat(item.params.chairTime);
        } else if (item.detail && item.detail.match(/([\d.]+)\s*hrs/i)) {
            hoursVal = parseFloat(item.detail.match(/([\d.]+)\s*hrs/i)[1]);
        }
        totalChairHours += hoursVal || (areaVal / 8.0);

        // Extract ink mL
        let inkVal = 0;
        if (item.estimatedInk && typeof item.estimatedInk === 'number') {
            inkVal = item.estimatedInk;
        } else if (typeof item.estimatedInk === 'string' && parseFloat(item.estimatedInk)) {
            inkVal = parseFloat(item.estimatedInk);
        } else if (item.params && item.params.volume) {
            inkVal = parseFloat(item.params.volume);
        } else if (item.detail && item.detail.match(/([\d.]+)\s*mL/i)) {
            inkVal = parseFloat(item.detail.match(/([\d.]+)\s*mL/i)[1]);
        }
        totalInkMl += inkVal || (areaVal * 0.15);

        // Extract saturation
        let satVal = 0;
        if (item.saturation && typeof item.saturation === 'number') {
            satVal = item.saturation;
        } else if (typeof item.saturation === 'string' && parseFloat(item.saturation)) {
            satVal = parseFloat(item.saturation);
        } else if (item.params && item.params.saturation) {
            satVal = parseFloat(item.params.saturation);
        } else if (item.detail && item.detail.match(/Saturation:\s*([\d.]+)%/i)) {
            satVal = parseFloat(item.detail.match(/Saturation:\s*([\d.]+)%/i)[1]);
        }
        if (satVal > 0) {
            saturationSum += satVal;
            saturationCount++;
            if (satVal > maxSaturation) maxSaturation = satVal;
        }
    });

    avgSaturation = saturationCount > 0 ? Math.round(saturationSum / saturationCount) : 48;
    const totalAreaSqcm = (totalAreaSqin * 6.4516).toFixed(1);
    const totalFloz = (totalInkMl * 0.033814).toFixed(3);
    const totalCaps = Math.max(selected.length, Math.ceil(totalInkMl / 1.5));
    const totalHoursFixed = totalChairHours.toFixed(1);
    const totalMins = Math.round(totalChairHours * 60);

    // Recommended sessions & spacing
    const sessionCount = selected.length;
    const estFeeMin = Math.round(totalChairHours * 150);
    const estFeeMax = Math.round(totalChairHours * 220);
    const recommendedDeposit = Math.round(estFeeMin * 0.3);

    // Update item count badge
    if (itemCountBadge) {
        itemCountBadge.textContent = TP("x.session_selected", "{0} Session{1} Selected", sessionCount, sessionCount > 1 ? 's' : '');
    }

    // Populate Metrics Grid
    if (metricsGrid) {
        metricsGrid.innerHTML = `
            <div style="background: var(--color-bg-card, #16213e); border: 1px solid var(--color-border, #2e2e4a); border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Total Project Area</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #38bdf8; margin-top: 2px;">${totalAreaSqin.toFixed(1)} sq in</div>
                <div style="font-size: 0.72rem; color: #64748b;">${totalAreaSqcm} cm² total</div>
            </div>
            <div style="background: var(--color-bg-card, #16213e); border: 1px solid var(--color-border, #2e2e4a); border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Total Chair Time</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: var(--color-neon-pink, #ff006e); margin-top: 2px;">${totalHoursFixed} hrs</div>
                <div style="font-size: 0.72rem; color: #64748b;">~${totalMins} minutes in chair</div>
            </div>
            <div style="background: var(--color-bg-card, #16213e); border: 1px solid var(--color-border, #2e2e4a); border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Combined Ink Needed</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #10b981; margin-top: 2px;">${totalInkMl.toFixed(1)} mL</div>
                <div style="font-size: 0.72rem; color: #64748b;">~${totalCaps} caps (${totalFloz} fl oz)</div>
            </div>
            <div style="background: var(--color-bg-card, #16213e); border: 1px solid var(--color-border, #2e2e4a); border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Est. Project Value</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #fbbf24; margin-top: 2px;">$${estFeeMin} – $${estFeeMax}</div>
                <div style="font-size: 0.72rem; color: #64748b;">Rec. Deposit: $${recommendedDeposit}</div>
            </div>
        `;
    }

    // Populate Detailed Multi-Session Table Body
    if (tableBody) {
        tableBody.innerHTML = selected.map((item, idx) => {
            const sessionNum = idx + 1;
            const needle = item.needleType || (item.params && item.params.preset) || 'Custom Grouping';
            
            let areaStr = '15.0 sq in';
            if (item.coverageArea && item.coverageArea !== 'N/A') {
                areaStr = typeof item.coverageArea === 'number' ? `${item.coverageArea} sq in` : item.coverageArea;
            } else if (item.params && item.params.area) {
                areaStr = item.params.area;
            }

            let durStr = '2.0 hrs';
            if (item.sessionHours && item.sessionHours !== 'N/A') {
                durStr = typeof item.sessionHours === 'number' ? `${item.sessionHours} hrs` : item.sessionHours;
            } else if (item.params && item.params.chairTime) {
                durStr = item.params.chairTime;
            }

            let inkStr = '2.25 mL';
            if (item.estimatedInk && item.estimatedInk !== 'N/A') {
                inkStr = typeof item.estimatedInk === 'number' ? `${item.estimatedInk} mL` : item.estimatedInk;
            } else if (item.params && item.params.volume) {
                inkStr = item.params.volume;
            }

            let satStr = 'Medium Density';
            let satColor = '#fbbf24';
            if (item.saturation && item.saturation !== 'N/A') {
                satStr = typeof item.saturation === 'string' ? item.saturation : `${item.saturation}%`;
                if (satStr.includes('Light') || parseInt(satStr) <= 35) satColor = '#10b981';
                else if (satStr.includes('Heavy') || parseInt(satStr) > 65) satColor = '#ff006e';
            }

            return `
                <tr>
                    <td style="font-weight: 700; color: #38bdf8;">Session ${sessionNum}</td>
                    <td>
                        <div style="font-weight: 600; color: #f8fafc;">${item.title}</div>
                        <div style="font-size: 0.72rem; color: #64748b;">${item.dateStr}</div>
                    </td>
                    <td><span style="background: rgba(255, 255, 255, 0.05); padding: 2px 6px; border-radius: 4px; color: #e2e8f0; font-family: monospace;">${needle}</span></td>
                    <td style="color: #cbd5e1;">${areaStr}</td>
                    <td style="font-weight: 600; color: var(--color-neon-pink, #ff006e);">${durStr}</td>
                    <td style="color: #10b981; font-weight: 600;">${inkStr}</td>
                    <td><span style="color: ${satColor}; font-weight: 600;">${satStr}</span></td>
                </tr>
            `;
        }).join('');
    }

    // Populate Clinical Box
    if (clinicalBox) {
        clinicalBox.innerHTML = `
            <div style="font-weight: 700; color: #38bdf8; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>🩺</span> Clinical Multi-Session Spacing & Dermal Recovery Plan
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.6rem; margin-top: 0.4rem;">
                <div>
                    <strong style="color: #f8fafc;">• Recommended Spacing Interval:</strong>
                    <div style="color: #cbd5e1;">Allow <strong>2 to 3 weeks (14–21 days)</strong> between sessions for complete epidermal re-epithelialization and dermal recovery.</div>
                </div>
                <div>
                    <strong style="color: #f8fafc;">• Execution Sequencing Strategy:</strong>
                    <div style="color: #cbd5e1;">Session 1: Linework & Structural Framework → Session 2: Midtone Grey Washes → Session 3: Heavy Color Packing & Solid Black.</div>
                </div>
                <div>
                    <strong style="color: #f8fafc;">• Client Prep & Bio-Buffer:</strong>
                    <div style="color: #cbd5e1;">Schedule 20-min bio-breaks every 2 hours for hydration and pain threshold reset across ${totalHoursFixed} planned hours.</div>
                </div>
            </div>
        `;
    }

    // Show modal
    modal.style.display = 'flex';

    function closeModal() {
        modal.style.display = 'none';
    }

    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeBottomBtn) closeBottomBtn.onclick = closeModal;
    if (overlay) overlay.onclick = closeModal;

    // Multi-Session Copy Button
    const copyBtn = document.getElementById('multi-session-copy-btn');
    if (copyBtn) {
        copyBtn.onclick = function() {
            let md = `# POLI INTERNATIONAL - MULTI-SESSION TATTOO PROJECT PLAN\n`;
            md += `Generated: ${new Date().toLocaleString()}\n`;
            md += `Sessions Count: ${sessionCount}\n`;
            md += `Total Coverage: ${totalAreaSqin.toFixed(1)} sq in (${totalAreaSqcm} cm²)\n`;
            md += `Total Chair Time: ${totalHoursFixed} hrs (~${totalMins} mins)\n`;
            md += `Total Ink Volume: ${totalInkMl.toFixed(1)} mL (~${totalCaps} caps)\n`;
            md += `Est. Fee Range: $${estFeeMin} – $${estFeeMax} (Deposit: $${recommendedDeposit})\n\n`;
            md += `## Session Breakdown:\n`;
            selected.forEach((item, idx) => {
                md += `### Session ${idx + 1}: ${item.title}\n`;
                md += `- Date: ${item.dateStr}\n`;
                md += `- Needle / Technique: ${item.needleType || 'Standard'}\n`;
                md += `- Area: ${item.coverageArea || 'N/A'}\n`;
                md += `- Duration: ${item.sessionHours || 'N/A'}\n`;
                md += `- Ink: ${item.estimatedInk || 'N/A'}\n\n`;
            });
            md += `## Clinical Recovery:\n`;
            md += `- Session Interval: 2–3 weeks between appointments for full healing.\n`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(md).then(() => {
                    if (typeof showToastNotification === 'function') {
                        showToastNotification('📋 <strong>Copied</strong>: Multi-session markdown project summary copied to clipboard!');
                    }
                });
            } else {
                alert('Plan copied to clipboard!');
            }
        };
    }

    // Multi-Session CSV Export
    const csvBtn = document.getElementById('multi-session-csv-btn');
    if (csvBtn) {
        csvBtn.onclick = function() {
            let csv = 'Session Number,Date,Calculation Title,Needle Configuration,Area,Duration,Ink Required,Trauma & Saturation\n';
            selected.forEach((item, idx) => {
                const num = `Session ${idx + 1}`;
                const date = `"${item.dateStr || ''}"`;
                const title = `"${(item.title || '').replace(/"/g, '""')}"`;
                const needle = `"${(item.needleType || 'Standard Setup').replace(/"/g, '""')}"`;
                const area = `"${(item.coverageArea || item.params?.area || '15 sq in').toString().replace(/"/g, '""')}"`;
                const dur = `"${(item.sessionHours || item.params?.chairTime || '2 hrs').toString().replace(/"/g, '""')}"`;
                const ink = `"${(item.estimatedInk || item.params?.volume || '2.25 mL').toString().replace(/"/g, '""')}"`;
                const sat = `"${(item.saturation || 'Medium').toString().replace(/"/g, '""')}"`;
                csv += `${num},${date},${title},${needle},${area},${dur},${ink},${sat}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `multi_session_project_plan_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (typeof showToastNotification === 'function') {
                showToastNotification('📊 <strong>Exported CSV</strong>: Multi-session project spreadsheet downloaded.');
            }
        };
    }

    // Multi-Session PDF Export
    const pdfBtn = document.getElementById('multi-session-pdf-btn');
    if (pdfBtn) {
        pdfBtn.onclick = function() {
            if (window.jspdf && window.jspdf.jsPDF) {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                // Header Banner
                doc.setFillColor(26, 26, 46);
                doc.rect(0, 0, 210, 26, 'F');
                doc.setTextColor(255, 0, 110);
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('POLI INTERNATIONAL TATTOO STUDIO', 14, 12);
                doc.setFontSize(9);
                doc.setTextColor(200, 200, 200);
                doc.text('MULTI-SESSION MASTER PROJECT PLAN & CLINICAL TIMELINE', 14, 18);
                doc.text(`Generated: ${new Date().toLocaleString()}`, 135, 18);

                // Summary Box
                doc.setFillColor(245, 247, 250);
                doc.roundedRect(14, 32, 182, 30, 2, 2, 'F');
                doc.setDrawColor(220, 225, 230);
                doc.roundedRect(14, 32, 182, 30, 2, 2, 'D');

                doc.setTextColor(30, 41, 59);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text('PROJECT AGGREGATE SUMMARY', 18, 40);

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.text(`• Total Planned Sessions: ${sessionCount}`, 18, 47);
                doc.text(`• Combined Surface Area: ${totalAreaSqin.toFixed(1)} sq in (${totalAreaSqcm} cm²)`, 18, 54);
                doc.text(`• Total Estimated Chair Time: ${totalHoursFixed} hrs (~${totalMins} mins)`, 105, 47);
                doc.text(`• Total Pigment Volume: ${totalInkMl.toFixed(1)} mL (~${totalCaps} caps)`, 105, 54);

                // Table Title
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255, 0, 110);
                doc.text('SESSION-BY-SESSION BREAKDOWN', 14, 70);

                // Table Rows
                let y = 78;
                doc.setFontSize(8.5);

                // Table Header
                doc.setFillColor(230, 235, 245);
                doc.rect(14, y - 4, 182, 6, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(40, 50, 70);
                doc.text('Session', 16, y);
                doc.text('Title & Needle Setup', 38, y);
                doc.text('Area', 110, y);
                doc.text('Time', 135, y);
                doc.text('Ink', 155, y);
                doc.text('Saturation', 172, y);

                y += 6;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(50, 50, 50);

                selected.forEach((item, idx) => {
                    const sessionTitle = `Session ${idx + 1}`;
                    const needle = (item.needleType || (item.params && item.params.preset) || 'Custom').slice(0, 32);
                    const areaStr = (item.coverageArea || item.params?.area || '15 sq in').toString();
                    const durStr = (item.sessionHours || item.params?.chairTime || '2.0 hrs').toString();
                    const inkStr = (item.estimatedInk || item.params?.volume || '2.25 mL').toString();
                    const satStr = (item.saturation || 'Medium').toString().slice(0, 14);

                    if (idx % 2 === 1) {
                        doc.setFillColor(248, 249, 251);
                        doc.rect(14, y - 4, 182, 6.5, 'F');
                    }

                    doc.text(sessionTitle, 16, y);
                    doc.text(`${item.title.slice(0, 22)} (${needle})`, 38, y);
                    doc.text(areaStr, 110, y);
                    doc.text(durStr, 135, y);
                    doc.text(inkStr, 155, y);
                    doc.text(satStr, 172, y);

                    y += 7;
                });

                // Clinical Healing Protocol
                y = Math.max(y + 6, 170);
                doc.setFillColor(240, 249, 255);
                doc.roundedRect(14, y, 182, 34, 2, 2, 'F');
                doc.setDrawColor(186, 230, 253);
                doc.roundedRect(14, y, 182, 34, 2, 2, 'D');

                doc.setTextColor(3, 105, 161);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('CLINICAL RECOVERY & MULTI-SESSION AFTERCARE PROTOCOL', 18, y + 7);

                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(51, 65, 85);
                doc.text('1. Healing Interval: Maintain a strict 14–21 day recovery interval between appointments for dermal recovery.', 18, y + 14);
                doc.text('2. Layering Sequencing: Complete bold contours first, allowing epidermal settling before solid color fills.', 18, y + 21);
                doc.text('3. Barrier Protection: Apply SecondSkin protective film for 3–4 days post-session with daily hygiene monitoring.', 18, y + 28);

                // Signatures
                y += 44;
                doc.setDrawColor(200, 200, 200);
                doc.line(18, y + 15, 85, y + 15);
                doc.line(115, y + 15, 182, y + 15);

                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('Artist Signature & Verification', 18, y + 20);
                doc.text('Client Acknowledgment & Date', 115, y + 20);

                doc.save(`multi_session_master_plan_${new Date().toISOString().slice(0, 10)}.pdf`);

                if (typeof showToastNotification === 'function') {
                    showToastNotification('📑 <strong>Downloaded Project PDF</strong>: Multi-session documentation plan saved.');
                }
            } else {
                window.print();
            }
        };
    }
}

function exportCalculationsCSV() {
    const records = getRecentCalculations();
    if (!records || records.length === 0) {
        alert('No calculation records saved yet to export.');
        return;
    }

    // Required structured columns: Date, Needle Type, Session Hours, Coverage Area, Estimated Ink Usage
    let csv = 'Date,Needle Type,Session Hours,Coverage Area (sq in),Estimated Ink Usage (mL),Calculation Type,Title,Result Summary,Parameters\n';
    records.forEach(r => {
        const date = `"${r.dateStr || ''}"`;
        const needle = `"${(r.needleType || (r.type === 'coverage' ? r.title.replace('Coverage: ', '') : 'Standard Setup')).replace(/"/g, '""')}"`;
        const sessionHours = `"${(r.sessionHours || 'N/A').toString().replace(/"/g, '""')}"`;
        const coverageArea = `"${(r.coverageArea || 'N/A').toString().replace(/"/g, '""')}"`;
        const estimatedInk = `"${(r.estimatedInk || 'N/A').toString().replace(/"/g, '""')}"`;
        const type = `"${(r.type || '').toUpperCase()}"`;
        const title = `"${(r.title || '').replace(/"/g, '""')}"`;
        const detail = `"${(r.detail || '').replace(/"/g, '""')}"`;
        const params = `"${(typeof r.params === 'object' ? JSON.stringify(r.params) : r.params || '').replace(/"/g, '""')}"`;
        csv += `${date},${needle},${sessionHours},${coverageArea},${estimatedInk},${type},${title},${detail},${params}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tattoo_calculations_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════
   QUICK UNIT CONVERTER UTILITY
   ═══════════════════════════════════════════════════════════ */

function initializeUnitConverter() {
    const sqinInput = document.getElementById('converter-sqin');
    const sqcmInput = document.getElementById('converter-sqcm');
    const toggleBtn = document.getElementById('converter-toggle-btn');
    const bodyEl = document.getElementById('converter-body');
    const toggleIcon = document.getElementById('converter-toggle-icon');
    const applyBtn = document.getElementById('converter-apply-active');
    const syncInventoryBtn = document.getElementById('converter-sync-inventory-btn');
    const quickSaveBtn = document.getElementById('converter-quick-save-btn');
    const converterResetBtn = document.getElementById('converter-reset-btn');
    const converterCopyBtn = document.getElementById('converter-copy-summary-btn');
    const converterPrintBtn = document.getElementById('converter-print-btn');
    const converterPdfReportBtn = document.getElementById('converter-pdf-report-btn');
    const volUnitToggleBtn = document.getElementById('converter-vol-unit-toggle');
    const volUnitLabel = document.getElementById('converter-vol-unit-label');
    const converterResultsBox = document.getElementById('converter-coverage-results');
    const factorIndicator = document.getElementById('converter-factor-text');
    const inkNeedleSelect = document.getElementById('converter-ink-needle-select');
    const categoryNeedleSelect = document.getElementById('converter-category-needle-select');
    const needleCategoryIcon = document.getElementById('converter-needle-category-icon');
    const needleCategoryBadge = document.getElementById('converter-needle-category-badge');
    const badgeEl = document.getElementById('converter-rate-badge');
    const textEl = document.getElementById('converter-coverage-text');
    const satBar = document.getElementById('converter-saturation-bar');
    const satLabel = document.getElementById('converter-saturation-label');
    const satDensityVal = document.getElementById('converter-saturation-density-val');
    const tooltipDesc = document.getElementById('converter-saturation-tooltip-dynamic');
    const rangeTooltipContent = document.getElementById('converter-range-tooltip-content');

    // Historical Trend Sparkline Elements
    const sparklineArea = document.getElementById('converter-sparkline-area');
    const sparklineLine = document.getElementById('converter-sparkline-line');
    const sparklineDots = document.getElementById('converter-sparkline-dots');
    const sparklineTrendBadge = document.getElementById('converter-sparkline-trend-badge');
    const deviationBadge = document.getElementById('converter-deviation-badge');
    const deviationAlert = document.getElementById('converter-deviation-alert');
    const chartAvgValEl = document.getElementById('converter-chart-avg-val');
    const SPARKLINE_HISTORY_KEY = 'coverage-converter-sat-history';

    // Batch Action Header Buttons
    const selectAllCheckbox = document.getElementById('recent-select-all-checkbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAllRecentCalculations(this.checked);
        });
    }

    const batchSummaryBtn = document.getElementById('recent-batch-summary-btn');
    if (batchSummaryBtn) {
        batchSummaryBtn.addEventListener('click', openMultiSessionPlanningModal);
    }

    const batchDeleteBtn = document.getElementById('recent-batch-delete-btn');
    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', deleteSelectedRecentCalculations);
    }

    // Compact / Expanded Mode Elements
    const modeCompactBtn = document.getElementById('converter-mode-compact');
    const modeExpandedBtn = document.getElementById('converter-mode-expanded');
    const expandedPanel = document.getElementById('converter-expanded-metadata');
    const healingBadge = document.getElementById('converter-healing-time-badge');
    const healingTimelineText = document.getElementById('converter-healing-timeline-text');
    const traumaIndexText = document.getElementById('converter-trauma-index-text');
    const passesRecommendText = document.getElementById('converter-passes-recommend-text');
    const aftercareNoteText = document.getElementById('converter-aftercare-note-text');

    // Needle Search Filter Elements
    const needleSearchInput = document.getElementById('converter-needle-search');
    const needleSearchClearBtn = document.getElementById('converter-search-clear-btn');

    let currentVolUnit = localStorage.getItem('coverage-converter-vol-unit') || 'ml'; // 'ml' or 'floz'
    let currentMode = localStorage.getItem('coverage-converter-mode') || 'compact'; // 'compact' or 'expanded'

    // Needle Category Icons dictionary
    const NEEDLE_CATEGORY_ICONS = {
        'preset': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
        'liner': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="7" y1="6" x2="7" y2="18"></line><line x1="17" y1="6" x2="17" y2="18"></line></svg>`,
        'shader': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"></circle><circle cx="6" cy="12" r="2"></circle><circle cx="18" cy="12" r="2"></circle><circle cx="12" cy="6" r="2"></circle><circle cx="12" cy="18" r="2"></circle></svg>`,
        'magnum': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff006e" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="6" rx="1.5"></rect><rect x="3" y="14" width="18" height="6" rx="1.5"></rect><line x1="7" y1="4" x2="7" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line><line x1="17" y1="4" x2="17" y2="20"></line></svg>`
    };

    function getNeedleCategory(presetKey) {
        if (['american-traditional', 'realism-portrait', 'blackwork-fill', 'fine-line-micro', 'japanese-irezumi', 'watercolor-splash', 'geometric-dotwork'].includes(presetKey)) {
            return 'preset';
        }
        if (['3RL', '5RL', '7RL', '9RL'].includes(presetKey)) {
            return 'liner';
        }
        if (['light-shading', 'medium-density', '7RS'].includes(presetKey)) {
            return 'shader';
        }
        return 'magnum'; // 7M1, 11M1, 15M2, color-packing, solid-black
    }

    let converterChartJsInstance = null;

    function getSaturationHistory() {
        try {
            const stored = localStorage.getItem(SPARKLINE_HISTORY_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error('Error reading saturation history:', e);
        }
        return [
            { saturation: 22, preset: 'Fine Line & Micro', density: 0.06, time: 'Init' },
            { saturation: 32, preset: 'Realism Portrait', density: 0.09, time: 'Init' },
            { saturation: 43, preset: 'Medium Gradients', density: 0.15, time: 'Init' },
            { saturation: 51, preset: '7M1 Soft Magnum', density: 0.18, time: 'Init' },
            { saturation: 79, preset: 'American Traditional', density: 0.22, time: 'Init' },
            { saturation: 43, preset: 'Medium Gradients', density: 0.15, time: 'Init' }
        ];
    }

    // Compute User Historical Average Saturation across recent calculations & history
    function calculateUserHistoricalAverageSaturation() {
        const history = getSaturationHistory();
        const recent = getRecentCalculations();
        let totalSat = 0;
        let count = 0;

        history.forEach(h => {
            if (h.saturation && typeof h.saturation === 'number') {
                totalSat += h.saturation;
                count++;
            }
        });

        recent.forEach(r => {
            if (r.saturation && typeof r.saturation === 'number') {
                totalSat += r.saturation;
                count++;
            } else if (typeof r.saturation === 'string' && parseFloat(r.saturation)) {
                totalSat += parseFloat(r.saturation);
                count++;
            }
        });

        return count > 0 ? Math.round(totalSat / count) : 45;
    }

    // Chart.js Custom Plugin for Threshold Lines (35% Light, 65% Heavy, and User Historical Average)
    const saturationThresholdsPlugin = {
        id: 'saturationThresholds',
        afterDraw: (chart) => {
            const { ctx, chartArea, scales: { y } } = chart;
            if (!chartArea || !y) return;

            ctx.save();

            // 1. Light Saturation Threshold Line (35%)
            const y35 = y.getPixelForValue(35);
            if (y35 >= chartArea.top && y35 <= chartArea.bottom) {
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
                ctx.beginPath();
                ctx.moveTo(chartArea.left, y35);
                ctx.lineTo(chartArea.right, y35);
                ctx.stroke();

                ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
                ctx.font = '9px "JetBrains Mono", sans-serif';
                ctx.textBaseline = 'bottom';
                ctx.fillText('35% Light Threshold', chartArea.left + 6, y35 - 1);
            }

            // 2. Heavy Solid Saturation Threshold Line (65%)
            const y65 = y.getPixelForValue(65);
            if (y65 >= chartArea.top && y65 <= chartArea.bottom) {
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 0, 110, 0.45)';
                ctx.beginPath();
                ctx.moveTo(chartArea.left, y65);
                ctx.lineTo(chartArea.right, y65);
                ctx.stroke();

                ctx.fillStyle = 'rgba(255, 0, 110, 0.9)';
                ctx.font = '9px "JetBrains Mono", sans-serif';
                ctx.textBaseline = 'bottom';
                ctx.fillText('65% Heavy Threshold', chartArea.left + 6, y65 - 1);
            }

            // 3. Historical Average Line
            const avgVal = chart.options.plugins?.saturationThresholds?.historicalAvg;
            if (typeof avgVal === 'number' && !isNaN(avgVal)) {
                const yAvg = y.getPixelForValue(avgVal);
                if (yAvg >= chartArea.top && yAvg <= chartArea.bottom) {
                    ctx.setLineDash([2, 3]);
                    ctx.lineWidth = 1.2;
                    ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
                    ctx.beginPath();
                    ctx.moveTo(chartArea.left, yAvg);
                    ctx.lineTo(chartArea.right, yAvg);
                    ctx.stroke();

                    ctx.fillStyle = '#fbbf24';
                    ctx.font = 'bold 9px "JetBrains Mono", sans-serif';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(`Hist Avg: ${avgVal}%`, chartArea.right - 78, yAvg - 1);
                }
            }

            ctx.restore();
        }
    };

    function updateSaturationSparkline(currentSat, presetName, mlPerSqinVal = 0.15) {
        let history = getSaturationHistory();
        const lastItem = history[history.length - 1];
        
        // Push if saturation is different or preset changed
        if (!lastItem || lastItem.saturation !== currentSat || lastItem.preset !== presetName) {
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            history.push({ saturation: currentSat, preset: presetName, density: mlPerSqinVal, time: timeStr });
            if (history.length > 10) {
                history = history.slice(-10);
            }
            try {
                localStorage.setItem(SPARKLINE_HISTORY_KEY, JSON.stringify(history));
            } catch (e) {}
        }

        const historicalAvg = calculateUserHistoricalAverageSaturation();
        if (chartAvgValEl) {
            chartAvgValEl.textContent = `${historicalAvg}%`;
        }

        // 1. Dynamic Historical Deviation Detection & Highlighting
        const deviationDiff = currentSat - historicalAvg;
        if (deviationBadge) {
            if (deviationDiff >= 15) {
                deviationBadge.innerHTML = TP("x.vs_studio_avg", "⚠️ +{0}% vs Studio Avg", deviationDiff);
                deviationBadge.style.background = 'rgba(255, 0, 110, 0.2)';
                deviationBadge.style.color = '#ff006e';
                deviationBadge.style.borderColor = 'rgba(255, 0, 110, 0.4)';
            } else if (deviationDiff <= -15) {
                deviationBadge.innerHTML = TP("x.vs_studio_avg_2", "⚡ {0}% vs Studio Avg", deviationDiff);
                deviationBadge.style.background = 'rgba(56, 189, 248, 0.2)';
                deviationBadge.style.color = '#38bdf8';
                deviationBadge.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            } else if (Math.abs(deviationDiff) >= 8) {
                deviationBadge.innerHTML = deviationDiff > 0 ? TP("x.vs_avg_2", "↗ +{0}% vs Avg", deviationDiff) : TP("x.vs_avg", "↘ {0}% vs Avg", deviationDiff);
                deviationBadge.style.background = 'rgba(251, 191, 36, 0.2)';
                deviationBadge.style.color = '#fbbf24';
                deviationBadge.style.borderColor = 'rgba(251, 191, 36, 0.4)';
            } else {
                deviationBadge.innerHTML = TP("x.studio_baseline_2", "✓ Studio Baseline ({0}%)", historicalAvg);
                deviationBadge.style.background = 'rgba(16, 185, 129, 0.18)';
                deviationBadge.style.color = '#10b981';
                deviationBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }
        }

        // Dynamic Deviation Alert Box below chart
        if (deviationAlert) {
            if (deviationDiff >= 15) {
                deviationAlert.style.display = 'block';
                deviationAlert.style.background = 'rgba(255, 0, 110, 0.1)';
                deviationAlert.style.border = '1px solid rgba(255, 0, 110, 0.3)';
                deviationAlert.style.color = '#fda4af';
                deviationAlert.innerHTML = TP("x.high_saturation_dwell_deviation_vs_studio", "⚠️ <strong>High Saturation Dwell Deviation (+{0}% vs {1}% Studio Average):</strong> Current needle setup delivers dense pigment displacement. Ensure appropriate multi-pass bio-breaks and notify client of extended deep dermal healing timeline.", deviationDiff, historicalAvg);
            } else if (deviationDiff <= -15) {
                deviationAlert.style.display = 'block';
                deviationAlert.style.background = 'rgba(56, 189, 248, 0.1)';
                deviationAlert.style.border = '1px solid rgba(56, 189, 248, 0.3)';
                deviationAlert.style.color = '#bae6fd';
                deviationAlert.innerHTML = TP("x.light_wash_fine_line_mode_vs", "⚡ <strong>Light Wash / Fine Line Mode ({0}% vs {1}% Studio Average):</strong> Minimal pigment deposition with rapid superficial skin recovery (~7–10 days).", deviationDiff, historicalAvg);
            } else {
                deviationAlert.style.display = 'none';
            }
        }

        // 2. Render / Update Chart.js Line Chart with Point Hover Effects & Tooltips
        const chartCanvas = document.getElementById('converter-saturation-chartjs');
        if (chartCanvas && typeof Chart !== 'undefined') {
            const labels = history.map((item, idx) => `#${idx + 1} (${item.preset ? item.preset.slice(0, 8) : 'Inst'})`);
            const dataValues = history.map(item => item.saturation);
            const densities = history.map(item => item.density || (item.saturation * 0.28 / 100).toFixed(2));
            const pointBackgroundColors = history.map(item => {
                if (item.saturation <= 35) return '#10b981';
                if (item.saturation <= 65) return '#fbbf24';
                return '#ff006e';
            });
            const pointBorderColors = history.map(() => '#ffffff');

            if (converterChartJsInstance) {
                converterChartJsInstance.data.labels = labels;
                converterChartJsInstance.data.datasets[0].data = dataValues;
                converterChartJsInstance.data.datasets[0].pointBackgroundColor = pointBackgroundColors;
                converterChartJsInstance.options.plugins.saturationThresholds.historicalAvg = historicalAvg;
                converterChartJsInstance.update('none');
            } else {
                const ctx = chartCanvas.getContext('2d');
                let gradient = null;
                if (ctx) {
                    gradient = ctx.createLinearGradient(0, 0, 0, 115);
                    gradient.addColorStop(0, 'rgba(6, 147, 227, 0.45)');
                    gradient.addColorStop(1, 'rgba(6, 147, 227, 0.0)');
                }

                converterChartJsInstance = new Chart(chartCanvas, {
                    type: 'line',
                    plugins: [saturationThresholdsPlugin],
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Saturation %',
                            data: dataValues,
                            borderColor: '#0693e3',
                            backgroundColor: gradient || 'rgba(6, 147, 227, 0.15)',
                            borderWidth: 2.5,
                            tension: 0.35,
                            fill: true,
                            pointBackgroundColor: pointBackgroundColors,
                            pointBorderColor: pointBorderColors,
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 8.5,
                            pointHoverBackgroundColor: '#ffffff',
                            pointHoverBorderWidth: 3,
                            pointHoverBorderColor: '#0693e3',
                            pointHitRadius: 15
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        plugins: {
                            legend: { display: false },
                            saturationThresholds: {
                                historicalAvg: historicalAvg
                            },
                            tooltip: {
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                titleColor: '#38bdf8',
                                titleFont: { weight: 'bold', size: 11 },
                                bodyColor: '#ffffff',
                                bodyFont: { size: 10.5 },
                                borderColor: 'rgba(56, 189, 248, 0.4)',
                                borderWidth: 1,
                                padding: 10,
                                boxPadding: 4,
                                displayColors: true,
                                callbacks: {
                                    title: function(items) {
                                        const idx = items[0].dataIndex;
                                        const item = history[idx];
                                        return `Calculation #${idx + 1}: ${item.preset || 'Needle Preset'} (${item.time || 'Logged'})`;
                                    },
                                    label: function(context) {
                                        const idx = context.dataIndex;
                                        const item = history[idx];
                                        const density = densities[idx];
                                        const densitySqcm = (parseFloat(density) / 6.4516).toFixed(3);
                                        const sat = context.parsed.y;
                                        let level = 'Medium Saturation';
                                        if (sat <= 35) level = 'Light Wash / Fine Line';
                                        else if (sat > 65) level = 'Heavy Solid Packing';

                                        const devVsAvg = sat - historicalAvg;
                                        const devText = devVsAvg >= 0 ? `+${devVsAvg}%` : `${devVsAvg}%`;

                                        return [
                                            `🎯 Needle Configuration: ${item.preset || 'Standard Preset'}`,
                                            `💧 Specific Ink Density: ~${density} mL/in² (${densitySqcm} mL/cm²)`,
                                            `📊 Saturation Ratio: ${sat}% (${level})`,
                                            `📈 Studio Deviation: ${devText} vs Historical Average (${historicalAvg}%)`
                                        ];
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                display: true,
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: { color: '#94a3b8', font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 }
                            },
                            y: {
                                display: true,
                                min: 0,
                                max: 100,
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: {
                                    color: '#94a3b8',
                                    font: { size: 9 },
                                    stepSize: 25,
                                    callback: function(v) { return v + '%'; }
                                }
                            }
                        }
                    }
                });
            }
        }

        // 3. Trend calculation badge
        const oldestSat = history[0].saturation;
        const newestSat = history[history.length - 1].saturation;
        const diff = newestSat - oldestSat;

        if (sparklineTrendBadge) {
            if (diff >= 4) {
                sparklineTrendBadge.innerHTML = TP("x.increasing", "↗ +{0}% (Increasing)", diff);
                sparklineTrendBadge.style.background = 'rgba(255, 0, 110, 0.18)';
                sparklineTrendBadge.style.color = '#ff006e';
                sparklineTrendBadge.style.borderColor = 'rgba(255, 0, 110, 0.35)';
            } else if (diff <= -4) {
                sparklineTrendBadge.innerHTML = TP("x.decreasing", "↘ {0}% (Decreasing)", diff);
                sparklineTrendBadge.style.background = 'rgba(16, 185, 129, 0.18)';
                sparklineTrendBadge.style.color = '#10b981';
                sparklineTrendBadge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
            } else {
                sparklineTrendBadge.innerHTML = TP("x.steady_0", "→ Steady (±0%)");
                sparklineTrendBadge.style.background = 'rgba(56, 189, 248, 0.18)';
                sparklineTrendBadge.style.color = '#38bdf8';
                sparklineTrendBadge.style.borderColor = 'rgba(56, 189, 248, 0.35)';
            }
        }

        // 4. Fallback SVG Sparkline
        if (sparklineLine && sparklineDots) {
            const svgWidth = 220;
            const padX = 14;
            const usableW = svgWidth - (padX * 2);
            const topY = 6;
            const botY = 32;
            const usableH = botY - topY;

            const pointsArr = history.slice(-5).map((item, idx, arr) => {
                const x = padX + (idx / Math.max(1, arr.length - 1)) * usableW;
                const satVal = Math.max(10, Math.min(100, item.saturation));
                const y = botY - ((satVal - 10) / 90) * usableH;
                return { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)), sat: item.saturation, preset: item.preset || '', density: item.density || 0.15 };
            });

            if (pointsArr.length > 0) {
                const pointsStr = pointsArr.map(p => `${p.x},${p.y}`).join(' ');
                sparklineLine.setAttribute('points', pointsStr);

                if (sparklineArea) {
                    const areaStr = `M ${pointsArr[0].x},36 ` + pointsArr.map(p => `L ${p.x},${p.y}`).join(' ') + ` L ${pointsArr[pointsArr.length - 1].x},36 Z`;
                    sparklineArea.setAttribute('d', areaStr);
                }

                let dotsHtml = '';
                pointsArr.forEach((p, idx) => {
                    let dotColor = '#eab308';
                    if (p.sat <= 35) dotColor = '#10b981';
                    else if (p.sat > 65) dotColor = '#ff006e';
                    const isCurrent = idx === pointsArr.length - 1;
                    const radius = isCurrent ? 4.5 : 3;
                    dotsHtml += `<circle cx="${p.x}" cy="${p.y}" r="${radius}" class="converter-sparkline-dot" fill="${dotColor}" stroke="${isCurrent ? '#ffffff' : 'rgba(255,255,255,0.7)'}" stroke-width="${isCurrent ? 2 : 1.2}">
                        <title>Calculation #${idx + 1}: ${p.sat}% Saturation | Needle: ${p.preset} | Density: ~${p.density} mL/in²</title>
                    </circle>`;
                });
                sparklineDots.innerHTML = dotsHtml;
            }
        }
    }

    const NEEDLE_TOOLTIP_PHYSICS = {
        'american-traditional': '<strong>American Traditional Preset:</strong> Bold linework (7RL/9RL) paired with 11M1 solid color packing delivering ~0.22 mL/in² (79% saturation) at 14 in²/hr.',
        'realism-portrait': '<strong>Realism Portrait Preset:</strong> Single-needle 3RL detail contouring with feather-soft 7RS/7M1 grey washes delivering ~0.09 mL/in² (32% saturation) at 6 in²/hr.',
        'blackwork-fill': '<strong>Blackwork Fill Preset:</strong> Dense 15M2 heavy magnum passes for deep, velvety solid black dispersion delivering ~0.35 mL/in² (100% saturation) at 22 in²/hr.',
        'fine-line-micro': '<strong>Fine Line & Micro Detail Preset:</strong> 1RL/3RL tight grouping for delicate geometry and script delivering ~0.06 mL/in² (21% saturation) at 4 in²/hr.',
        'japanese-irezumi': '<strong>Japanese Irezumi Preset:</strong> Bold 7RL/9RL contours with 13M1/15M2 wind bars and background shading delivering ~0.20 mL/in² (71% saturation) at 16 in²/hr.',
        'watercolor-splash': '<strong>Watercolor & Soft Blends Preset:</strong> 7RS/7M1 transparent wash dilution gradients delivering ~0.16 mL/in² (57% saturation) at 12 in²/hr.',
        'geometric-dotwork': '<strong>Geometric & Dotwork Preset:</strong> 5RL stippling and dotwork arrays delivering ~0.11 mL/in² (39% saturation) at 8 in²/hr.',
        'light-shading': '<strong>Light Shading / Grey Wash (~0.08 mL/in²):</strong> Diluted carbon pigments with low needle dwell time create airy, transparent gradients at ~28% saturation.',
        'medium-density': '<strong>Medium Density / Gradients (~0.15 mL/in²):</strong> Balanced needle stroke velocity deposits uniform tonal midtones across the dermis at ~43% saturation.',
        'solid-black': '<strong>Solid Black / Heavy Line Packing (~0.35 mL/in²):</strong> Maximum pin penetration density and multi-pass saturation (~100%) deliver rich, opaque black tone.',
        'color-packing': '<strong>Solid Color Packing (~0.28 mL/in²):</strong> High-viscosity organic pigments require broad needle grouping coverage (~80% saturation) for vibrant saturation.',
        '3RL': '<strong>3RL Fine Line Outlining (~0.06 mL/in²):</strong> 3 tightly grouped micro-pins deposit tight linear tracks with minimal volumetric ink displacement (~18% saturation).',
        '5RL': '<strong>5RL Standard Outlines (~0.09 mL/in²):</strong> 5-pin circular grouping deposits crisp bold lines with modest pigment consumption (~26% saturation).',
        '7RL': '<strong>7RL Bold Linework (~0.12 mL/in²):</strong> 7-pin tight grouping creates heavy contours and illustrative line weight (~34% saturation).',
        '9RL': '<strong>9RL Heavy Traditional Lines (~0.14 mL/in²):</strong> 9-pin traditional grouping deposits bold lines with dense dermal saturation (~40%).',
        '7RS': '<strong>7RS Round Shader / Whip Shading (~0.16 mL/in²):</strong> Loose circular pin cluster ideal for whip blends, color packing, and soft drop shadows (~46% saturation).',
        '7M1': '<strong>7M1 Soft Shading Magnum (~0.18 mL/in²):</strong> 7 alternating pins sweep smooth gradients across broad surface areas with medium-high saturation (~51%).',
        '11M1': '<strong>11M1 Workhorse Magnum (~0.22 mL/in²):</strong> 11 pins disperse broad pigment swathes, elevating saturation to ~63% with rapid skin coverage.',
        '15M2': '<strong>15M2 Maximum Coverage Magnum (~0.25 mL/in²):</strong> Double-stacked 15-pin array creates maximum surface contact and heavy pigment displacement (~71% saturation).'
    };

    const NEEDLE_RANGES = {
        'american-traditional': { min: 0.18, max: 0.26, desc: 'American Traditional (Bold & Solid)' },
        'realism-portrait': { min: 0.06, max: 0.12, desc: 'Realism Portrait (Micro Details & Soft Wash)' },
        'blackwork-fill': { min: 0.30, max: 0.42, desc: 'Blackwork Fill (Heavy Blackout)' },
        'fine-line-micro': { min: 0.04, max: 0.08, desc: 'Fine Line & Micro Detail (Precision Linework)' },
        'japanese-irezumi': { min: 0.16, max: 0.24, desc: 'Japanese Irezumi (Bold & Wind Bars)' },
        'watercolor-splash': { min: 0.13, max: 0.20, desc: 'Watercolor & Soft Blends (Transparent Washes)' },
        'geometric-dotwork': { min: 0.08, max: 0.14, desc: 'Geometric & Dotwork (Stippling & Geo)' },
        '3RL': { min: 0.04, max: 0.08, desc: '3RL Fine Line' },
        '5RL': { min: 0.07, max: 0.12, desc: '5RL Standard Outline' },
        '7RL': { min: 0.09, max: 0.15, desc: '7RL Bold Linework' },
        '9RL': { min: 0.11, max: 0.18, desc: '9RL Heavy Lines' },
        'light-shading': { min: 0.05, max: 0.11, desc: 'Light Grey Wash' },
        'medium-density': { min: 0.12, max: 0.18, desc: 'Medium Gradients' },
        '7RS': { min: 0.13, max: 0.20, desc: '7RS Color Shader' },
        '7M1': { min: 0.15, max: 0.22, desc: '7M1 Soft Magnum' },
        '11M1': { min: 0.18, max: 0.26, desc: '11M1 Workhorse Magnum' },
        '15M2': { min: 0.21, max: 0.30, desc: '15M2 Coverage Magnum' },
        'color-packing': { min: 0.24, max: 0.33, desc: 'Color Packing' },
        'solid-black': { min: 0.30, max: 0.42, desc: 'Solid Blackout' }
    };

    let lastSaturationPercent = null;

    function triggerResultsScalePulse() {
        if (converterResultsBox) {
            converterResultsBox.classList.remove('converter-results-pulse', 'converter-scale-pulse');
            void converterResultsBox.offsetWidth; // Force CSS reflow to re-trigger CSS scale transition pulse animation
            converterResultsBox.classList.add('converter-results-pulse');
        }
    }

    function updateCoveragePerUnit(skipPulse = false) {
        if (!inkNeedleSelect || !textEl) return;
        const selectedOpt = inkNeedleSelect.options[inkNeedleSelect.selectedIndex];
        if (!selectedOpt) return;

        const presetKey = selectedOpt.value;
        const rate = parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0;
        const mlPerSqin = parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15;
        const optName = selectedOpt.textContent.split('(')[0].trim();
        const mlPerSqcm = (mlPerSqin / 6.4516).toFixed(3);
        const rateSqcm = (rate * 6.4516).toFixed(1);

        // Keep category dropdown in sync
        if (categoryNeedleSelect && categoryNeedleSelect.value !== presetKey) {
            categoryNeedleSelect.value = presetKey;
        }

        // Update Needle Category Icon and Badge
        const catKey = getNeedleCategory(presetKey);
        if (needleCategoryIcon) {
            needleCategoryIcon.innerHTML = NEEDLE_CATEGORY_ICONS[catKey] || NEEDLE_CATEGORY_ICONS['shader'];
        }
        if (needleCategoryBadge) {
            needleCategoryBadge.textContent = catKey.charAt(0).toUpperCase() + catKey.slice(1);
            needleCategoryBadge.className = `converter-category-badge converter-category-badge--${catKey}`;
        }

        // Fluid ounce conversions (1 mL = 0.033814 fl oz)
        const flozPerSqin = (mlPerSqin * 0.033814).toFixed(4);
        const flozPerSqcm = (parseFloat(mlPerSqcm) * 0.033814).toFixed(4);

        // Saturation Calculation (Scale: 0.05 mL/in² is ~18% light wash, 0.28 mL/in² is ~100% solid blackout)
        const saturationPercent = Math.min(100, Math.max(12, Math.round((mlPerSqin / 0.28) * 100)));

        // Update Sparkline Trend Chart
        updateSaturationSparkline(saturationPercent, optName, mlPerSqin);

        // Border-color flash animation on #converter-coverage-results whenever calculation updates
        if (converterResultsBox) {
            converterResultsBox.classList.remove('converter-border-flash');
            void converterResultsBox.offsetWidth; // Force CSS reflow to re-trigger animation
            converterResultsBox.classList.add('converter-border-flash');
        }

        // Subtle CSS Scale Transition / Pulse animation on #converter-coverage-results
        if (!skipPulse && converterResultsBox) {
            if (lastSaturationPercent !== null && lastSaturationPercent !== saturationPercent) {
                triggerResultsScalePulse();
            }
        }
        lastSaturationPercent = saturationPercent;

        let levelText = 'Medium Density';
        let levelColor = '#eab308';
        let colorClass = 'saturation-bar--med';

        // Dynamic Color: Green for Low (<= 35%), Yellow for Medium (36-65%), Red for High (> 65%)
        if (saturationPercent <= 35) {
            levelText = 'Light Saturation';
            levelColor = '#10b981';
            colorClass = 'saturation-bar--low';
        } else if (saturationPercent <= 65) {
            levelText = 'Medium Saturation';
            levelColor = '#eab308';
            colorClass = 'saturation-bar--med';
        } else {
            levelText = 'Heavy Solid Saturation';
            levelColor = '#ef4444';
            colorClass = 'saturation-bar--high';
        }

        // Dynamically update saturation progress bar with keyframe expansion & haptic pulse
        if (satBar) {
            satBar.classList.remove('saturation-bar--low', 'saturation-bar--med', 'saturation-bar--high', 'saturation-bar--animate', 'saturation-bar--haptic-pulse');
            void satBar.offsetWidth; // Force CSS reflow to replay keyframe animation smoothly
            satBar.classList.add(colorClass, 'saturation-bar--animate', 'saturation-bar--haptic-pulse');
            satBar.style.width = `${saturationPercent}%`;
        }

        if (satLabel) {
            satLabel.textContent = `${levelText} (${saturationPercent}%)`;
            satLabel.style.color = levelColor;
        }

        // Update '?' Range Tooltip with numerical min-max range
        if (rangeTooltipContent) {
            const rangeInfo = NEEDLE_RANGES[presetKey] || { min: (mlPerSqin * 0.75).toFixed(2), max: (mlPerSqin * 1.25).toFixed(2), desc: optName };
            const minMl = rangeInfo.min;
            const maxMl = rangeInfo.max;
            const minCm = (minMl / 6.4516).toFixed(3);
            const maxCm = (maxMl / 6.4516).toFixed(3);
            const minFloz = (minMl * 0.033814).toFixed(4);
            const maxFloz = (maxMl * 0.033814).toFixed(4);

            if (currentVolUnit === 'floz') {
                rangeTooltipContent.innerHTML = `
                    <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.2rem;">${rangeInfo.desc}</div>
                    <strong>Range:</strong> ${minFloz} – ${maxFloz} fl oz/sq in<br>
                    <span style="color: #94a3b8; font-size: 0.7rem;">(${minMl} – ${maxMl} mL/sq in • ${minCm} – ${maxCm} mL/cm²)</span>
                `;
            } else {
                rangeTooltipContent.innerHTML = `
                    <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.2rem;">${rangeInfo.desc}</div>
                    <strong>Range:</strong> ${minMl} – ${maxMl} mL/sq in<br>
                    <span style="color: #94a3b8; font-size: 0.7rem;">(${minCm} – ${maxCm} mL/cm² • ${minFloz} – ${maxFloz} fl oz/in²)</span>
                `;
            }
        }

        // Update Expanded Mode Metadata (Healing time, Trauma index, Recommended passes, Aftercare)
        if (healingBadge && healingTimelineText && traumaIndexText && passesRecommendText && aftercareNoteText) {
            if (saturationPercent <= 35) {
                healingBadge.textContent = T("x.est_healing_7_10_days", "Est. Healing: ~7–10 days");
                healingBadge.style.background = 'rgba(16, 185, 129, 0.2)';
                healingBadge.style.color = '#10b981';
                healingTimelineText.textContent = T("x.7_to_10_days_rapid_epidermal", "7 to 10 days (Rapid epidermal re-epithelialization & mild flaking)");
                traumaIndexText.innerHTML = '<span style="color: #10b981;">Low (1.5 / 5)</span> • Superficial Dermal Dwell';
                passesRecommendText.textContent = T("x.1_2_single_needle_passes_with", "1–2 single-needle passes with minimal skin distress");
                aftercareNoteText.textContent = T("x.breathable_film_2_3_days_light", "Breathable film 2–3 days; light moisturization from day 4 onwards.");
            } else if (saturationPercent <= 65) {
                healingBadge.textContent = T("x.est_healing_12_16_days", "Est. Healing: ~12–16 days");
                healingBadge.style.background = 'rgba(234, 179, 8, 0.2)';
                healingBadge.style.color = '#fbbf24';
                healingTimelineText.textContent = T("x.12_to_16_days_standard_full", "12 to 16 days (Standard full-thickness dermal regeneration & moderate peeling)");
                traumaIndexText.innerHTML = '<span style="color: #eab308;">Moderate (3 / 5)</span> • Mid-Dermis Dwell';
                passesRecommendText.textContent = T("x.2_3_feathered_blend_passes", "2–3 feathered blend passes");
                aftercareNoteText.textContent = T("x.secondskin_3_4_days_unscented_barrier", "SecondSkin 3–4 days; unscented barrier cream/lotion days 5+.");
            } else {
                healingBadge.textContent = T("x.est_healing_18_25_days", "Est. Healing: ~18–25+ days");
                healingBadge.style.background = 'rgba(239, 68, 68, 0.2)';
                healingBadge.style.color = '#f87171';
                healingTimelineText.textContent = T("x.18_to_25_days_extended_deep", "18 to 25+ days (Extended deep dermal remodeling, high inflammation response)");
                traumaIndexText.innerHTML = '<span style="color: #ef4444;">Intense (4.8 / 5)</span> • Dense Multi-Pass Trauma';
                passesRecommendText.textContent = T("x.3_5_circular_packing_passes_with", "3–5 circular packing passes with skin stretching");
                aftercareNoteText.textContent = T("x.protective_film_with_exudate_check_avoid", "Protective film with exudate check; avoid over-saturating with heavy ointment.");
            }
        }

        if (satDensityVal) {
            if (currentVolUnit === 'floz') {
                satDensityVal.textContent = currentGlobalUnit === 'sqcm' 
                    ? `${flozPerSqcm} fl oz/cm²`
                    : `${flozPerSqin} fl oz/in²`;
            } else {
                satDensityVal.textContent = currentGlobalUnit === 'sqcm' 
                    ? `${mlPerSqcm} mL/cm²`
                    : `${mlPerSqin} mL/in²`;
            }
        }

        // Update Exact Conversion Factor Indicator
        if (factorIndicator) {
            const factorRatio = (mlPerSqin / 0.15).toFixed(2);
            factorIndicator.innerHTML = TP("x.applied_factor_x_baseline_ml_sq", "<strong>Applied Factor:</strong> {0}x baseline ({1} mL/sq in • {2} mL/cm² • {3} fl oz/sq in)", factorRatio, mlPerSqin, mlPerSqcm, flozPerSqin);
        }

        // Update Dynamic Tooltip Explanation for Needle Configuration Physics
        if (tooltipDesc) {
            tooltipDesc.innerHTML = NEEDLE_TOOLTIP_PHYSICS[presetKey] || TP("x.delivers_ml_in_saturation_at_in", "<strong>{0}:</strong> Delivers ~{1} mL/in² ({2}% saturation) at {3} in²/hr.", optName, mlPerSqin, saturationPercent, rate);
        }

        if (badgeEl) {
            if (currentVolUnit === 'floz') {
                badgeEl.textContent = currentGlobalUnit === 'sqcm'
                    ? `${flozPerSqcm} fl oz/cm² • ${rateSqcm} cm²/hr`
                    : `${flozPerSqin} fl oz/in² • ${rate} in²/hr`;
            } else {
                badgeEl.textContent = currentGlobalUnit === 'sqcm'
                    ? `${mlPerSqcm} mL/cm² • ${rateSqcm} cm²/hr`
                    : `${mlPerSqin} mL/in² • ${rate} in²/hr`;
            }
        }

        // Ink Waste & Cartridge Reservoir Retention Calculation
        // Liners: 14% retention, Shaders: 20% retention, Magnums: 26% retention, Presets: 22% retention
        const wastePctMap = {
            'liner': 14,
            'shader': 20,
            'magnum': 26,
            'preset': 22
        };
        const wastePct = wastePctMap[catKey] || 20;
        const wasteBadge = document.getElementById('converter-waste-badge');
        const wasteDetails = document.getElementById('converter-waste-details');
        const wasteGrossVal = document.getElementById('converter-waste-gross-val');

        if (wasteBadge) {
            wasteBadge.textContent = TP("x.cartridge_retention", "~{0}% Cartridge Retention", wastePct);
        }

        const sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : null;

        if (sqinVal && !isNaN(sqinVal) && sqinVal > 0) {
            const sqcmVal = (sqinVal * 6.4516).toFixed(1);
            const estMl = parseFloat((sqinVal * mlPerSqin).toFixed(2));
            const grossMl = parseFloat((estMl * (1 + wastePct / 100)).toFixed(2));
            const overheadMl = parseFloat((grossMl - estMl).toFixed(2));
            const estFloz = (estMl * 0.033814).toFixed(3);
            const grossFloz = (grossMl * 0.033814).toFixed(3);
            const estHours = (sqinVal / rate).toFixed(2);
            const capsCount = Math.max(1, Math.ceil(grossMl / 1.5));

            if (wasteDetails) {
                wasteDetails.textContent = currentVolUnit === 'floz'
                    ? `+${(overheadMl * 0.033814).toFixed(3)} fl oz Overhead`
                    : `+${overheadMl.toFixed(2)} mL Overhead`;
            }
            if (wasteGrossVal) {
                wasteGrossVal.textContent = currentVolUnit === 'floz'
                    ? `Gross: ${grossFloz} fl oz`
                    : `Gross: ${grossMl.toFixed(2)} mL`;
            }

            const volFormatted = currentVolUnit === 'floz' ? `${estFloz} fl oz (${estMl} mL)` : `${estMl} mL (${estFloz} fl oz)`;

            textEl.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.25rem;">
                    <div>• <strong>Est. Ink Volume:</strong> <span style="color: ${levelColor}; font-weight: 700;">${volFormatted}</span> (~${capsCount} caps)</div>
                    <div>• <strong>Est. Chair Time:</strong> <span style="color: #0693e3; font-weight: 700;">${estHours} hrs</span> (${Math.round(estHours * 60)} mins)</div>
                    <div>• <strong>Unit Density:</strong> ${currentVolUnit === 'floz' ? flozPerSqin + ' fl oz/in²' : mlPerSqin + ' mL/in²'} (${currentVolUnit === 'floz' ? flozPerSqcm + ' fl oz/cm²' : mlPerSqcm + ' mL/cm²'})</div>
                    <div>• <strong>Coverage Speed:</strong> ${rate} in²/hr (${rateSqcm} cm²/hr)</div>
                </div>
            `;
        } else {
            if (wasteDetails) {
                wasteDetails.textContent = TP("x.0_00_ml_overhead", "+0.00 mL Overhead");
            }
            if (wasteGrossVal) {
                wasteGrossVal.textContent = TP("x.gross_ml", "Gross: -- mL");
            }

            const volDesc = currentVolUnit === 'floz' 
                ? `${flozPerSqin} fl oz/sq in (${flozPerSqcm} fl oz/cm²)` 
                : `${mlPerSqin} mL/sq in (${mlPerSqcm} mL/cm²)`;
            textEl.innerHTML = TP("x.baseline_speed_of_sq_in_hr", "<strong>{0}:</strong> Baseline speed of <strong>{1} sq in/hr</strong> ({2} cm²/hr) with <strong>{3}</strong> ink density. Enter an area above to view real-time calculations.", optName, rate, rateSqcm, volDesc);
        }
    }

    if (toggleBtn && bodyEl) {
        toggleBtn.addEventListener('click', function() {
            const isHidden = bodyEl.style.display === 'none';
            bodyEl.style.display = isHidden ? 'block' : 'none';
            if (toggleIcon) toggleIcon.textContent = isHidden ? T("x.toggle_converter", "▼ Toggle Converter") : T("x.collapse_converter", "▲ Collapse Converter");
        });
    }

    if (sqinInput && sqcmInput) {
        sqinInput.addEventListener('input', function() {
            const val = parseFloat(this.value);
            if (!isNaN(val) && val >= 0) {
                sqcmInput.value = (val * 6.4516).toFixed(1);
            } else {
                sqcmInput.value = '';
            }
            updateCoveragePerUnit();
        });

        sqcmInput.addEventListener('input', function() {
            const val = parseFloat(this.value);
            if (!isNaN(val) && val >= 0) {
                sqinInput.value = (val / 6.4516).toFixed(1);
            } else {
                sqinInput.value = '';
            }
            updateCoveragePerUnit();
        });
    }

    // Converter Undo History Stack (tracks previous category filter, search query, and needle preset changes)
    const converterHistoryStack = [];
    let isApplyingHistory = false;

    function getCurrentConverterState() {
        return {
            categoryFilter: activeCategoryFilter || 'all',
            needleValue: inkNeedleSelect ? inkNeedleSelect.value : 'medium-density',
            searchQuery: needleSearchInput ? needleSearchInput.value : ''
        };
    }

    function pushConverterHistoryState(stateToSave) {
        if (isApplyingHistory) return;
        const state = stateToSave || getCurrentConverterState();
        if (!state) return;
        const last = converterHistoryStack[converterHistoryStack.length - 1];
        if (last && last.categoryFilter === state.categoryFilter && last.needleValue === state.needleValue && last.searchQuery === state.searchQuery) {
            return;
        }
        converterHistoryStack.push({ ...state });
        if (converterHistoryStack.length > 30) {
            converterHistoryStack.shift();
        }
        updateUndoButtonState();
    }

    function updateUndoButtonState() {
        const undoBtns = [
            document.getElementById('converter-undo-btn'),
            document.getElementById('converter-undo-filter-btn')
        ].filter(Boolean);

        const hasHistory = converterHistoryStack.length > 0;
        undoBtns.forEach(btn => {
            btn.disabled = !hasHistory;
            if (hasHistory) {
                btn.removeAttribute('disabled');
                btn.title = TP("x.undo_last_filter_or_preset_change_2", "Undo last filter or preset change ({0} in history)", converterHistoryStack.length);
            } else {
                btn.setAttribute('disabled', 'true');
                btn.title = 'No previous changes to undo';
            }
        });
    }

    function undoLastConverterChange() {
        if (converterHistoryStack.length === 0) return;
        const prevState = converterHistoryStack.pop();
        updateUndoButtonState();
        if (!prevState) return;

        isApplyingHistory = true;
        try {
            if (needleSearchInput) {
                needleSearchInput.value = prevState.searchQuery || '';
            }
            filterNeedleOptions(prevState.searchQuery || '', prevState.categoryFilter || 'all', false);
            if (inkNeedleSelect && prevState.needleValue) {
                inkNeedleSelect.value = prevState.needleValue;
            }
            if (categoryNeedleSelect && prevState.needleValue) {
                categoryNeedleSelect.value = prevState.needleValue;
            }
            updateCoveragePerUnit(false);
            triggerResultsScalePulse();

            if (typeof showToastNotification === 'function') {
                const optName = inkNeedleSelect && inkNeedleSelect.options[inkNeedleSelect.selectedIndex] ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex].textContent.split('(')[0].trim() : (prevState.needleValue || 'Preset');
                showToastNotification(`↩️ <strong>Undo</strong>: Reverted to '${optName}' [${prevState.categoryFilter || 'all'}].`);
            }
        } finally {
            isApplyingHistory = false;
        }
    }

    // Undo buttons listeners
    const converterUndoBtn = document.getElementById('converter-undo-btn');
    if (converterUndoBtn) {
        converterUndoBtn.addEventListener('click', undoLastConverterChange);
    }
    const converterUndoFilterBtn = document.getElementById('converter-undo-filter-btn');
    if (converterUndoFilterBtn) {
        converterUndoFilterBtn.addEventListener('click', undoLastConverterChange);
    }

    if (inkNeedleSelect) {
        inkNeedleSelect.addEventListener('change', function() {
            if (categoryNeedleSelect) categoryNeedleSelect.value = this.value;
            updateCoveragePerUnit();
            triggerResultsScalePulse();
        });
    }

    if (categoryNeedleSelect) {
        categoryNeedleSelect.addEventListener('change', function() {
            if (inkNeedleSelect) inkNeedleSelect.value = this.value;
            updateCoveragePerUnit();
            triggerResultsScalePulse();
        });
    }

    // Needle Category & Search Filtering Logic
    let activeCategoryFilter = 'all';

    function filterNeedleOptions(query = '', category = activeCategoryFilter, trackHistory = true) {
        const q = (query || '').toLowerCase().trim();
        const prevCategory = activeCategoryFilter;
        activeCategoryFilter = category || 'all';

        if (trackHistory && !isApplyingHistory && (prevCategory !== activeCategoryFilter || query !== (needleSearchInput ? needleSearchInput.value : ''))) {
            pushConverterHistoryState({
                categoryFilter: prevCategory,
                needleValue: inkNeedleSelect ? inkNeedleSelect.value : 'medium-density',
                searchQuery: query
            });
        }

        const selects = [categoryNeedleSelect, inkNeedleSelect].filter(Boolean);
        selects.forEach(select => {
            let firstVisible = null;
            let isCurrentVisible = false;

            Array.from(select.options).forEach(opt => {
                const val = opt.value;
                const optCat = getNeedleCategory(val);
                const text = opt.textContent.toLowerCase();

                const matchesCat = (activeCategoryFilter === 'all' || optCat === activeCategoryFilter);
                const matchesQuery = (!q || text.includes(q) || val.toLowerCase().includes(q));

                const visible = matchesCat && matchesQuery;
                opt.hidden = !visible;
                opt.style.display = visible ? '' : 'none';

                if (visible) {
                    if (!firstVisible) firstVisible = opt;
                    if (opt.value === select.value) isCurrentVisible = true;
                }
            });

            // If current selected option is hidden by filter, switch to first visible
            if (!isCurrentVisible && firstVisible) {
                select.value = firstVisible.value;
            }
        });

        // Update category filter buttons active state
        const catBtns = document.querySelectorAll('.converter-cat-filter-btn');
        catBtns.forEach(btn => {
            const btnCat = btn.getAttribute('data-category-filter');
            if (btnCat === activeCategoryFilter) {
                btn.classList.add('converter-cat-filter-btn--active');
            } else {
                btn.classList.remove('converter-cat-filter-btn--active');
            }
        });

        const catSelect = document.getElementById('converter-category-filter-select');
        if (catSelect && catSelect.value !== activeCategoryFilter) {
            catSelect.value = activeCategoryFilter;
        }

        updateCoveragePerUnit();
    }

    // Category Filter Buttons
    const categoryFilterBtns = document.querySelectorAll('.converter-cat-filter-btn');
    categoryFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cat = this.getAttribute('data-category-filter') || 'all';
            if (cat !== activeCategoryFilter) {
                pushConverterHistoryState();
            }
            filterNeedleOptions(needleSearchInput ? needleSearchInput.value : '', cat, false);
            triggerResultsScalePulse();
        });
    });

    // Category Filter Select Dropdown
    const categoryFilterSelect = document.getElementById('converter-category-filter-select');
    if (categoryFilterSelect) {
        categoryFilterSelect.addEventListener('change', function() {
            if (this.value !== activeCategoryFilter) {
                pushConverterHistoryState();
            }
            filterNeedleOptions(needleSearchInput ? needleSearchInput.value : '', this.value, false);
            triggerResultsScalePulse();
        });
    }

    // Needle Search Input & Clear Button
    if (needleSearchInput) {
        needleSearchInput.addEventListener('input', function() {
            filterNeedleOptions(this.value, activeCategoryFilter, false);
        });
    }

    if (needleSearchClearBtn) {
        needleSearchClearBtn.addEventListener('click', function() {
            if (needleSearchInput) {
                needleSearchInput.value = '';
                filterNeedleOptions('', activeCategoryFilter, false);
                needleSearchInput.focus();
            }
        });
    }

    // Share Button listener (Uses Web Share API to share calculation summary via mobile device share sheet)
    const converterShareBtn = document.getElementById('converter-share-btn');
    if (converterShareBtn) {
        converterShareBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            let sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : 25;
            if (isNaN(sqinVal) || sqinVal <= 0) sqinVal = 25;
            const sqcmVal = (sqinVal * 6.4516).toFixed(1);

            const selectedOpt = inkNeedleSelect ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex] : null;
            const presetKey = selectedOpt ? selectedOpt.value : 'medium-density';
            const rate = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0) : 8.0;
            const mlPerSqin = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15) : 0.15;
            const optName = selectedOpt ? selectedOpt.textContent.split('(')[0].trim() : 'Medium Gradients';
            const catKey = getNeedleCategory(presetKey);
            const catTitle = catKey.charAt(0).toUpperCase() + catKey.slice(1);

            const wastePctMap = { 'liner': 14, 'shader': 20, 'magnum': 26, 'preset': 22 };
            const wastePct = wastePctMap[catKey] || 20;

            const netMl = parseFloat((sqinVal * mlPerSqin).toFixed(2));
            const grossMl = parseFloat((netMl * (1 + wastePct / 100)).toFixed(2));
            const estHours = (sqinVal / rate).toFixed(2);
            const estMins = Math.round(parseFloat(estHours) * 60);
            const capsCount = Math.max(1, Math.ceil(grossMl / 1.5));
            const saturationPercent = Math.min(100, Math.max(12, Math.round((mlPerSqin / 0.28) * 100)));

            let levelText = 'Medium Saturation';
            if (saturationPercent <= 35) levelText = 'Light Saturation';
            else if (saturationPercent > 65) levelText = 'Heavy Solid Saturation';

            const areaText = `${sqinVal.toFixed(1)} sq in (${sqcmVal} cm²)`;

            const shareTitle = `Tattoo Ink Calculation: ${optName}`;
            const shareSummaryText = [
                `📐 TATTOO NEEDLE & INK SUMMARY`,
                `• Needle Preset: ${catTitle} — ${optName}`,
                `• Coverage Area: ${areaText}`,
                `• Ink Required: ${netMl} mL net | ${grossMl} mL gross (~${wastePct}% cartridge waste)`,
                `• Ink Caps: ~${capsCount} caps (1.5 mL standard)`,
                `• Density / Saturation: ${saturationPercent}% (${levelText} • ${mlPerSqin} mL/in²)`,
                `• Est. Chair Time: ~${estHours} hrs (${estMins} mins)`
            ].join('\n');

            if (navigator.share) {
                navigator.share({
                    title: shareTitle,
                    text: shareSummaryText,
                    url: window.location.href
                }).then(() => {
                    if (typeof showToastNotification === 'function') {
                        showToastNotification('📲 <strong>Shared successfully!</strong>');
                    }
                }).catch((err) => {
                    if (err && err.name !== 'AbortError') {
                        fallbackShareCopy(shareSummaryText);
                    }
                });
            } else {
                fallbackShareCopy(shareSummaryText);
            }

            function fallbackShareCopy(text) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        if (typeof showToastNotification === 'function') {
                            showToastNotification('📲 <strong>Mobile Share</strong>: Calculation summary copied to clipboard!');
                        }
                    }).catch(() => {
                        alert(text);
                    });
                } else {
                    alert(text);
                }
            }
        });
    }

    // Copy Result Button listener (Formatted text summary for messaging apps)
    const converterCopyResultBtn = document.getElementById('converter-copy-result-btn');
    if (converterCopyResultBtn) {
        converterCopyResultBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            let sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : 25;
            if (isNaN(sqinVal) || sqinVal <= 0) sqinVal = 25;
            const sqcmVal = (sqinVal * 6.4516).toFixed(1);

            const selectedOpt = inkNeedleSelect ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex] : null;
            const presetKey = selectedOpt ? selectedOpt.value : 'medium-density';
            const rate = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0) : 8.0;
            const mlPerSqin = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15) : 0.15;
            const optName = selectedOpt ? selectedOpt.textContent.split('(')[0].trim() : 'Medium Gradients';
            const catKey = getNeedleCategory(presetKey);
            const catTitle = catKey.charAt(0).toUpperCase() + catKey.slice(1);

            const wastePctMap = { 'liner': 14, 'shader': 20, 'magnum': 26, 'preset': 22 };
            const wastePct = wastePctMap[catKey] || 20;

            const netMl = parseFloat((sqinVal * mlPerSqin).toFixed(2));
            const grossMl = parseFloat((netMl * (1 + wastePct / 100)).toFixed(2));
            const estHours = (sqinVal / rate).toFixed(2);
            const estMins = Math.round(parseFloat(estHours) * 60);
            const capsCount = Math.max(1, Math.ceil(grossMl / 1.5));
            const saturationPercent = Math.min(100, Math.max(12, Math.round((mlPerSqin / 0.28) * 100)));

            let levelText = 'Medium Saturation';
            if (saturationPercent <= 35) levelText = 'Light Saturation';
            else if (saturationPercent > 65) levelText = 'Heavy Solid Saturation';

            const areaText = `${sqinVal.toFixed(1)} sq in (${sqcmVal} cm²)`;

            const resultChatMsg = [
                `✨ Tattoo Needle & Ink Result:`,
                `• Needle: ${catTitle} — ${optName}`,
                `• Area: ${areaText}`,
                `• Est. Ink: ${netMl} mL net | ${grossMl} mL gross (~${wastePct}% cartridge waste)`,
                `• Caps: ~${capsCount} caps`,
                `• Saturation: ${saturationPercent}% (${levelText} • ${mlPerSqin} mL/in²)`,
                `• Est. Chair Time: ~${estHours} hrs (${estMins} mins)`
            ].join('\n');

            function triggerCopiedFeedback() {
                converterCopyResultBtn.classList.add('converter-copy-btn--copied');
                const copyIcon = document.getElementById('converter-copy-result-icon');
                const copyLabel = document.getElementById('converter-copy-result-text');
                if (copyIcon) copyIcon.textContent = '✓';
                if (copyLabel) copyLabel.textContent = T("x.copied", "Copied!");

                if (typeof showToastNotification === 'function') {
                    showToastNotification('💬 <strong>Copy Result</strong>: Clean chat summary copied to clipboard!');
                }

                setTimeout(() => {
                    converterCopyResultBtn.classList.remove('converter-copy-btn--copied');
                    if (copyIcon) copyIcon.textContent = '💬';
                    if (copyLabel) copyLabel.textContent = T("btn_copy_result", "Copy Result");
                }, 2500);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(resultChatMsg)
                    .then(triggerCopiedFeedback)
                    .catch(() => fallbackCopy(resultChatMsg));
            } else {
                fallbackCopy(resultChatMsg);
            }

            function fallbackCopy(text) {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.top = '0';
                ta.style.left = '0';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                try {
                    document.execCommand('copy');
                    triggerCopiedFeedback();
                } catch (err) {
                    alert('Result copied to clipboard!');
                }
                document.body.removeChild(ta);
            }
        });
    }

    // Presets
    const presets = document.querySelectorAll('.coverage__preset-btn[data-sqin]');
    presets.forEach(btn => {
        btn.addEventListener('click', function() {
            const sqinVal = parseFloat(this.getAttribute('data-sqin'));
            if (sqinInput && !isNaN(sqinVal)) {
                sqinInput.value = sqinVal;
                if (sqcmInput) sqcmInput.value = (sqinVal * 6.4516).toFixed(1);
                updateCoveragePerUnit();
            }
        });
    });

    // Initial render
    updateCoveragePerUnit();

    // Apply to active tab form with respect to active global unit
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            const sqinVal = sqinInput ? parseFloat(sqinInput.value) : 0;
            const sqcmVal = sqcmInput ? parseFloat(sqcmInput.value) : (sqinVal * 6.4516);

            if (!sqinVal || sqinVal <= 0) {
                alert('Please enter a valid area value in the converter first.');
                return;
            }

            const activeTab = document.querySelector('.coverage__tab--active');
            const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'coverage';
            const targetVal = isMetric ? sqcmVal.toFixed(1) : sqinVal.toFixed(1);

            if (tabName === 'ink') {
                const inkArea = document.getElementById('ink-area');
                if (inkArea) {
                    inkArea.value = targetVal;
                    flashElement(inkArea);
                }
            } else if (tabName === 'pricing') {
                const pricingArea = document.getElementById('pricing-area');
                if (pricingArea) {
                    pricingArea.value = targetVal;
                    flashElement(pricingArea);
                }
            } else if (tabName === 'session') {
                const dim = Math.sqrt(parseFloat(targetVal)).toFixed(1);
                const w = document.getElementById('tattoo-width');
                const h = document.getElementById('tattoo-height');
                if (w) { w.value = dim; flashElement(w); }
                if (h) { h.value = dim; flashElement(h); }
            } else {
                alert(`Value (${targetVal} ${isMetric ? 'cm²' : 'sq in'}) ready! Selected active tab is '${tabName}'.`);
            }
        });
    }

    // Sync to Ink Inventory Planner button
    if (syncInventoryBtn) {
        syncInventoryBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            let sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : 25; // default 25 sq in
            if (isNaN(sqinVal) || sqinVal <= 0) sqinVal = 25;

            const selectedOpt = inkNeedleSelect ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex] : null;
            const rate = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0) : 8.0;
            const mlPerSqin = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15) : 0.15;
            const presetVal = selectedOpt ? selectedOpt.value : 'medium-density';
            const optTitle = selectedOpt ? selectedOpt.textContent.split('(')[0].trim() : 'Booking Estimate';

            const estMlTotal = sqinVal * mlPerSqin;
            const estChairDuration = Math.max(0.5, Math.round((sqinVal / rate) * 2) / 2);
            const displayAreaVal = isMetric ? Math.round(sqinVal * 6.4516) : Math.round(sqinVal);

            // Switch to Ink Inventory Planner Tab
            const inventoryTabBtn = document.querySelector('.coverage__tab[data-tab="inventory"]');
            if (inventoryTabBtn) {
                inventoryTabBtn.click();
            }

            // Populate fields in #inventory-appointment-form
            const apptClient = document.getElementById('appt-client');
            const apptArea = document.getElementById('appt-area');
            const apptDuration = document.getElementById('appt-duration');
            const apptTechnique = document.getElementById('appt-technique');
            const apptBlackMl = document.getElementById('appt-black-ml');
            const apptColorMl = document.getElementById('appt-color-ml');
            const apptDate = document.getElementById('appt-date');

            if (apptClient && (!apptClient.value || apptClient.value.startsWith('Auto-Synced:'))) {
                apptClient.value = TP("x.auto_synced", "Auto-Synced: {0}", optTitle);
            }
            if (apptDate && !apptDate.value) {
                apptDate.value = new Date().toISOString().slice(0, 10);
            }
            if (apptArea) {
                apptArea.value = displayAreaVal;
                flashElement(apptArea);
            }
            if (apptDuration) {
                apptDuration.value = estChairDuration;
                flashElement(apptDuration);
            }

            // Technique & Ink Split based on selected preset
            if (presetVal === 'color-packing') {
                if (apptTechnique) apptTechnique.value = 'color-packing';
                if (apptColorMl) {
                    apptColorMl.value = Math.max(2, Math.ceil(estMlTotal * 0.85) + 2);
                    flashElement(apptColorMl);
                }
                if (apptBlackMl) {
                    apptBlackMl.value = Math.max(1, Math.ceil(estMlTotal * 0.25) + 1);
                    flashElement(apptBlackMl);
                }
            } else if (presetVal === 'solid-black') {
                if (apptTechnique) apptTechnique.value = 'bold-linework';
                if (apptBlackMl) {
                    apptBlackMl.value = Math.max(3, Math.ceil(estMlTotal) + 2);
                    flashElement(apptBlackMl);
                }
                if (apptColorMl) {
                    apptColorMl.value = 0;
                    flashElement(apptColorMl);
                }
            } else if (presetVal === '3RL' || presetVal === '5RL') {
                if (apptTechnique) apptTechnique.value = 'micro-detail';
                if (apptBlackMl) {
                    apptBlackMl.value = Math.max(2, Math.ceil(estMlTotal) + 1);
                    flashElement(apptBlackMl);
                }
                if (apptColorMl) {
                    apptColorMl.value = 0;
                    flashElement(apptColorMl);
                }
            } else {
                if (apptTechnique) apptTechnique.value = 'black-grey';
                if (apptBlackMl) {
                    apptBlackMl.value = Math.max(2, Math.ceil(estMlTotal) + 2);
                    flashElement(apptBlackMl);
                }
                if (apptColorMl) {
                    apptColorMl.value = 0;
                    flashElement(apptColorMl);
                }
            }

            // Smooth scroll to appointment form
            const formEl = document.getElementById('inventory-appointment-form');
            if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            showToastNotification(`📦 Synced <strong>${estMlTotal.toFixed(1)} mL</strong> pigment & <strong>${estChairDuration} hrs</strong> duration into Ink Inventory Planner!`);
        });
    }

    // Persistent 'Reset All' Button listener
    if (converterResetBtn) {
        converterResetBtn.addEventListener('click', function() {
            if (needleSearchInput) {
                needleSearchInput.value = '';
                filterNeedleOptions('');
            }
            if (sqinInput) sqinInput.value = '';
            if (sqcmInput) sqcmInput.value = '';
            if (categoryNeedleSelect) categoryNeedleSelect.value = 'medium-density';
            if (inkNeedleSelect) inkNeedleSelect.value = 'medium-density';
            updateCoveragePerUnit(false);
            if (converterResultsBox) {
                flashElement(converterResultsBox);
            }
            if (typeof showToastNotification === 'function') {
                showToastNotification('↺ <strong>Reset All</strong>: Cleared all calculation inputs, reset saturation gauge, and restored needle selection to default.');
            }
        });
    }

    // 'Copy to Clipboard' Button listener (Formatted text summary for client notes & emails)
    if (converterCopyBtn) {
        converterCopyBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            let sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : 25;
            if (isNaN(sqinVal) || sqinVal <= 0) sqinVal = 25;
            const sqcmVal = (sqinVal * 6.4516).toFixed(1);

            const selectedOpt = inkNeedleSelect ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex] : null;
            const presetKey = selectedOpt ? selectedOpt.value : 'medium-density';
            const rate = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0) : 8.0;
            const rateSqcm = (rate * 6.4516).toFixed(1);
            const mlPerSqin = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15) : 0.15;
            const mlPerSqcm = (mlPerSqin / 6.4516).toFixed(3);
            const optName = selectedOpt ? selectedOpt.textContent.split('(')[0].trim() : 'Medium Gradients';
            const catKey = getNeedleCategory(presetKey);
            const catTitle = catKey.charAt(0).toUpperCase() + catKey.slice(1);

            const estMl = (sqinVal * mlPerSqin).toFixed(2);
            const estFloz = (parseFloat(estMl) * 0.033814).toFixed(3);
            const estHours = (sqinVal / rate).toFixed(2);
            const estMins = Math.round(parseFloat(estHours) * 60);
            const capsCount = Math.max(1, Math.ceil(parseFloat(estMl) / 1.5));
            const saturationPercent = Math.min(100, Math.max(12, Math.round((mlPerSqin / 0.28) * 100)));

            let levelText = 'Medium Saturation';
            let traumaText = 'Moderate (3/5) • Mid-Dermis Dwell';
            let healingText = '~12–16 days (Standard epidermal flaking)';
            let aftercareText = 'SecondSkin 3–4 days; light unscented lotion days 5+.';

            if (saturationPercent <= 35) {
                levelText = 'Light Saturation';
                traumaText = 'Low (1.5/5) • Superficial Dermal Dwell';
                healingText = '~7–10 days (Rapid re-epithelialization)';
                aftercareText = 'Breathable film 2–3 days; light moisturization from day 4.';
            } else if (saturationPercent > 65) {
                levelText = 'Heavy Solid Saturation';
                traumaText = 'Intense (4.8/5) • Dense Multi-Pass Trauma';
                healingText = '~18–25+ days (Extended deep remodeling)';
                aftercareText = 'Protective film with exudate check; avoid heavy ointment over-saturation.';
            }

            const areaText = `${sqinVal.toFixed(1)} sq in (${sqcmVal} cm²)`;
            const volText = currentVolUnit === 'floz' ? `${estFloz} fl oz (${estMl} mL)` : `${estMl} mL (${estFloz} fl oz)`;

            const summaryText = [
                `📋 TATTOO NEEDLE COVERAGE & INK SPECIFICATION`,
                `══════════════════════════════════════════════`,
                `• Needle Configuration:  ${catTitle} — ${optName}`,
                `• Target Coverage Area:  ${areaText}`,
                `• Estimated Ink Volume:  ${volText} (~${capsCount} caps)`,
                `• Estimated Chair Time:  ${estHours} hrs (~${estMins} mins)`,
                `• Saturation Density:    ${saturationPercent}% (${levelText} • ${mlPerSqin} mL/in² / ${mlPerSqcm} mL/cm²)`,
                `• Deposition Speed:      ${rate} in²/hr (${rateSqcm} cm²/hr)`,
                `• Skin Trauma Profile:   ${traumaText}`,
                `• Expected Healing:      ${healingText}`,
                `• Aftercare Regimen:     ${aftercareText}`,
                `──────────────────────────────────────────────`,
                `Generated by Poli International Coverage Suite • Precision Studio Calculations`
            ].join('\n');

            function triggerCopiedFeedback() {
                converterCopyBtn.classList.add('converter-copy-btn--copied');
                const copyIcon = document.getElementById('converter-copy-btn-icon');
                const copyLabel = document.getElementById('converter-copy-btn-text');
                if (copyIcon) copyIcon.textContent = '✓';
                if (copyLabel) copyLabel.textContent = T("x.copied", "Copied!");

                if (typeof showToastNotification === 'function') {
                    showToastNotification('📋 <strong>Copied to Clipboard</strong>: Formatted ink volume & needle specification summary ready to paste!');
                }

                setTimeout(() => {
                    converterCopyBtn.classList.remove('converter-copy-btn--copied');
                    if (copyIcon) copyIcon.textContent = '📋';
                    if (copyLabel) copyLabel.textContent = T("btn_copy_summary", "Copy to Clipboard");
                }, 2500);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(summaryText)
                    .then(triggerCopiedFeedback)
                    .catch(() => {
                        fallbackCopy(summaryText);
                    });
            } else {
                fallbackCopy(summaryText);
            }

            function fallbackCopy(text) {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.top = '0';
                ta.style.left = '0';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                try {
                    document.execCommand('copy');
                    triggerCopiedFeedback();
                } catch (err) {
                    alert('Summary copied to clipboard!');
                }
                document.body.removeChild(ta);
            }
        });
    }

    // 'Print Current Result' Button listener (Dedicated isolated printable slip/label)
    if (converterPrintBtn) {
        converterPrintBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            let sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : 25;
            if (isNaN(sqinVal) || sqinVal <= 0) sqinVal = 25;
            const sqcmVal = (sqinVal * 6.4516).toFixed(1);

            const selectedOpt = inkNeedleSelect ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex] : null;
            const presetKey = selectedOpt ? selectedOpt.value : 'medium-density';
            const rate = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0) : 8.0;
            const rateSqcm = (rate * 6.4516).toFixed(1);
            const mlPerSqin = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15) : 0.15;
            const mlPerSqcm = (mlPerSqin / 6.4516).toFixed(3);
            const optName = selectedOpt ? selectedOpt.textContent.split('(')[0].trim() : 'Medium Gradients';
            const catKey = getNeedleCategory(presetKey);
            const catTitle = catKey.charAt(0).toUpperCase() + catKey.slice(1);

            const estMl = (sqinVal * mlPerSqin).toFixed(2);
            const estFloz = (parseFloat(estMl) * 0.033814).toFixed(3);
            const estHours = (sqinVal / rate).toFixed(2);
            const estMins = Math.round(parseFloat(estHours) * 60);
            const capsCount = Math.max(1, Math.ceil(parseFloat(estMl) / 1.5));
            const saturationPercent = Math.min(100, Math.max(12, Math.round((mlPerSqin / 0.28) * 100)));

            let levelText = `Medium Saturation (${saturationPercent}%)`;
            let traumaText = 'Moderate (3/5) • Mid-Dermis Dwell';
            let healingText = '12 to 16 days (Standard epidermal regeneration)';
            let aftercareText = 'SecondSkin 3–4 days; light unscented lotion days 5+.';

            if (saturationPercent <= 35) {
                levelText = `Light Saturation (${saturationPercent}%)`;
                traumaText = 'Low (1.5/5) • Superficial Dermal Dwell';
                healingText = '7 to 10 days (Rapid re-epithelialization)';
                aftercareText = 'Breathable film 2–3 days; light moisturization from day 4.';
            } else if (saturationPercent > 65) {
                levelText = `Heavy Solid Saturation (${saturationPercent}%)`;
                traumaText = 'Intense (4.8/5) • Dense Multi-Pass Trauma';
                healingText = '18 to 25+ days (Extended deep remodeling)';
                aftercareText = 'Protective film with exudate check; avoid heavy ointment over-saturation.';
            }

            // Populate Slip Header & Metadata
            const slipDate = document.getElementById('slip-date');
            if (slipDate) slipDate.textContent = new Date().toLocaleString();

            const slipRef = document.getElementById('slip-ref');
            if (slipRef) slipRef.textContent = T("x.poli", "#POLI-") + Math.floor(100000 + Math.random() * 900000);

            // Populate Table
            const slipDynamic = document.getElementById('slip-dynamic-content');
            if (slipDynamic) {
                slipDynamic.innerHTML = `
                    <table class="slip-table">
                        <tr><td>Needle Grouping:</td><td><strong>${catTitle} — ${optName}</strong></td></tr>
                        <tr><td>Coverage Area:</td><td><strong>${sqinVal.toFixed(1)} sq in</strong> (${sqcmVal} cm²)</td></tr>
                        <tr><td>Estimated Ink:</td><td><strong>${estMl} mL</strong> (${estFloz} fl oz • ~${capsCount} caps)</td></tr>
                        <tr><td>Estimated Duration:</td><td><strong>${estHours} hrs</strong> (~${estMins} mins)</td></tr>
                        <tr><td>Saturation Level:</td><td>${levelText}</td></tr>
                        <tr><td>Deposition Density:</td><td>${mlPerSqin} mL/in² (${mlPerSqcm} mL/cm²)</td></tr>
                        <tr><td>Coverage Speed:</td><td>${rate} in²/hr (${rateSqcm} cm²/hr)</td></tr>
                    </table>
                `;
            }

            // Populate Clinical & Aftercare
            const slipClinical = document.getElementById('slip-clinical-content');
            if (slipClinical) {
                slipClinical.innerHTML = `
                    <div><strong>Trauma Profile:</strong> ${traumaText}</div>
                    <div style="margin-top: 3px;"><strong>Est. Healing:</strong> ${healingText}</div>
                    <div style="margin-top: 3px;"><strong>Aftercare:</strong> ${aftercareText}</div>
                `;
            }

            // Apply isolation print CSS class
            document.body.classList.add('printing-converter-slip');
            document.documentElement.classList.add('printing-converter-slip');

            if (typeof showToastNotification === 'function') {
                showToastNotification('🖨️ Opening print window for coverage specification slip...');
            }

            setTimeout(() => {
                window.print();
                setTimeout(() => {
                    document.body.classList.remove('printing-converter-slip');
                    document.documentElement.classList.remove('printing-converter-slip');
                }, 1000);
            }, 120);
        });
    }

    // Consolidated Client Documentation PDF Report listener
    if (converterPdfReportBtn) {
        converterPdfReportBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            let sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : 25;
            if (isNaN(sqinVal) || sqinVal <= 0) sqinVal = 25;
            const sqcmVal = (sqinVal * 6.4516).toFixed(1);

            const selectedOpt = inkNeedleSelect ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex] : null;
            const presetKey = selectedOpt ? selectedOpt.value : 'medium-density';
            const rate = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0) : 8.0;
            const rateSqcm = (rate * 6.4516).toFixed(1);
            const mlPerSqin = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15) : 0.15;
            const mlPerSqcm = (mlPerSqin / 6.4516).toFixed(3);
            const flozPerSqin = (mlPerSqin * 0.033814).toFixed(4);
            const optName = selectedOpt ? selectedOpt.textContent.split('(')[0].trim() : 'Medium Gradients';
            const catKey = getNeedleCategory(presetKey);
            const catTitle = catKey.charAt(0).toUpperCase() + catKey.slice(1);

            const wastePctMap = { 'liner': 14, 'shader': 20, 'magnum': 26, 'preset': 22 };
            const wastePct = wastePctMap[catKey] || 20;

            const netMl = parseFloat((sqinVal * mlPerSqin).toFixed(2));
            const grossMl = parseFloat((netMl * (1 + wastePct / 100)).toFixed(2));
            const overheadMl = parseFloat((grossMl - netMl).toFixed(2));
            const netFloz = (netMl * 0.033814).toFixed(3);
            const grossFloz = (grossMl * 0.033814).toFixed(3);
            const estHours = (sqinVal / rate).toFixed(2);
            const estMins = Math.round(parseFloat(estHours) * 60);
            const capsCount = Math.max(1, Math.ceil(grossMl / 1.5));
            const saturationPercent = Math.min(100, Math.max(12, Math.round((mlPerSqin / 0.28) * 100)));

            let levelText = 'Medium Saturation';
            let traumaText = 'Moderate (3 / 5) • Mid-Dermis Dwell';
            let healingTimeline = '12 to 16 days (Standard full-thickness dermal regeneration)';
            let passesText = '2–3 feathered blend passes with moderate stretching';
            let aftercareText = 'SecondSkin barrier film 3–4 days; unscented hydration lotion days 5+.';

            if (saturationPercent <= 35) {
                levelText = 'Light Saturation';
                traumaText = 'Low (1.5 / 5) • Superficial Dermal Dwell';
                healingTimeline = '7 to 10 days (Rapid epidermal re-epithelialization & mild flaking)';
                passesText = '1–2 single-needle passes with minimal skin distress';
                aftercareText = 'Breathable film 2–3 days; light moisturization from day 4 onwards.';
            } else if (saturationPercent > 65) {
                levelText = 'Heavy Solid Saturation';
                traumaText = 'Intense (4.8 / 5) • Dense Multi-Pass Trauma';
                healingTimeline = '18 to 25+ days (Extended deep dermal remodeling, high inflammation response)';
                passesText = '3–5 circular packing passes with continuous skin stretching';
                aftercareText = 'Protective film with exudate monitoring; avoid over-saturating with heavy ointment.';
            }

            if (window.jspdf && window.jspdf.jsPDF) {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

                // Brand Header Bar
                doc.setFillColor(15, 23, 42); // slate-900
                doc.rect(0, 0, 210, 32, 'F');

                doc.setFillColor(255, 0, 110); // neon pink accent line
                doc.rect(0, 32, 210, 2, 'F');

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('POLI INTERNATIONAL TATTOO SUITE', 14, 15);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(203, 213, 225);
                doc.text('CLINICAL INK DENSITY, COVERAGE & AFTERCARE SPECIFICATION', 14, 23);

                const refId = 'POLI-DOC-' + Math.floor(100000 + Math.random() * 900000);
                const dateStr = new Date().toLocaleString();
                doc.setFontSize(8.5);
                doc.setTextColor(148, 163, 184);
                doc.text(`Ref: ${refId}`, 155, 15);
                doc.text(`Date: ${new Date().toISOString().slice(0, 10)}`, 155, 23);

                // Section 1: Overview Summary Cards
                let y = 44;
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(14, y, 182, 38, 3, 3, 'F');
                doc.setDrawColor(226, 232, 240);
                doc.roundedRect(14, y, 182, 38, 3, 3, 'D');

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text('SESSION PARAMETERS & NEEDLE CONFIGURATION', 18, y + 8);

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);

                // Column 1
                doc.text(`Needle Setup:`, 18, y + 16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(`${catTitle} — ${optName}`, 48, y + 16);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(`Target Area:`, 18, y + 23);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(`${sqinVal.toFixed(1)} sq in (${sqcmVal} cm²)`, 48, y + 23);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(`Est. Duration:`, 18, y + 30);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(`${estHours} hrs (~${estMins} mins)`, 48, y + 30);

                // Column 2
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(`Ink Saturation:`, 112, y + 16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(saturationPercent > 65 ? 220 : (saturationPercent <= 35 ? 16 : 200), saturationPercent > 65 ? 20 : (saturationPercent <= 35 ? 140 : 120), 40);
                doc.text(`${saturationPercent}% (${levelText})`, 142, y + 16);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(`Deposition Rate:`, 112, y + 23);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(`${rate} in²/hr (${rateSqcm} cm²/hr)`, 142, y + 23);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(`Unit Density:`, 112, y + 30);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text(`${mlPerSqin} mL/in² (${mlPerSqcm} mL/cm²)`, 142, y + 30);

                // Section 2: Detailed Pigment & Reservoir Breakdown
                y = 90;
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(14, y, 182, 42, 3, 3, 'F');
                doc.setDrawColor(226, 232, 240);
                doc.roundedRect(14, y, 182, 42, 3, 3, 'D');

                doc.setFillColor(241, 245, 249);
                doc.rect(14, y, 182, 8, 'F');
                doc.setTextColor(30, 41, 59);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('PIGMENT DISPENSING & RESERVOIR VOLUMETRICS', 18, y + 5.5);

                // Table Rows
                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(51, 65, 85);

                const tableMetrics = [
                    ['Net Dermal Pigment Required', `${netMl} mL (${netFloz} fl oz)`, 'Pure pigment delivered into papillary dermis'],
                    ['Cartridge & Cap Reservoir Overhead', `+${overheadMl} mL (+${wastePct}% retention)`, 'Reservoir dwell loss & membrane friction buffer'],
                    ['Gross Setup Volume Required', `${grossMl} mL (${grossFloz} fl oz)`, 'Total bottle draw required before session start'],
                    ['Standard Ink Cap Allocation', `~${capsCount} caps (1.5 mL medium caps)`, 'Dispensed across workstation barrier film setup']
                ];

                let rowY = y + 14;
                tableMetrics.forEach((row, i) => {
                    if (i % 2 === 1) {
                        doc.setFillColor(248, 250, 252);
                        doc.rect(15, rowY - 4, 180, 6.5, 'F');
                    }
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(15, 23, 42);
                    doc.text(row[0], 18, rowY);

                    doc.setTextColor(row[0].startsWith('Gross') ? 220 : 30, row[0].startsWith('Gross') ? 20 : 41, row[0].startsWith('Gross') ? 80 : 59);
                    doc.text(row[1], 85, rowY);

                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 116, 139);
                    doc.text(row[2], 135, rowY);

                    rowY += 7;
                });

                // Section 3: Clinical Healing & Dermal Trauma Profile
                y = 140;
                doc.setFillColor(240, 249, 255);
                doc.roundedRect(14, y, 182, 48, 3, 3, 'F');
                doc.setDrawColor(186, 230, 253);
                doc.roundedRect(14, y, 182, 48, 3, 3, 'D');

                doc.setTextColor(3, 105, 161);
                doc.setFontSize(10.5);
                doc.setFont('helvetica', 'bold');
                doc.text('🩹 CLINICAL HEALING TIMELINE & SKIN TRAUMA PROFILE', 18, y + 8);

                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(30, 41, 59);

                doc.setFont('helvetica', 'bold');
                doc.text('Trauma Index:', 18, y + 16);
                doc.setFont('helvetica', 'normal');
                doc.text(traumaText, 45, y + 16);

                doc.setFont('helvetica', 'bold');
                doc.text('Passes Recommended:', 18, y + 23);
                doc.setFont('helvetica', 'normal');
                doc.text(passesText, 55, y + 23);

                doc.setFont('helvetica', 'bold');
                doc.text('Healing Timeline:', 18, y + 30);
                doc.setFont('helvetica', 'normal');
                doc.text(healingTimeline, 50, y + 30);

                doc.setFont('helvetica', 'bold');
                doc.text('Aftercare Protocol:', 18, y + 37);
                doc.setFont('helvetica', 'normal');
                doc.text(aftercareText, 52, y + 37);

                doc.setFontSize(7.5);
                doc.setTextColor(100, 116, 139);
                doc.text('Note: Individual healing rates depend on client skin hydration, sun exposure, and strict adherence to studio sanitary guidelines.', 18, y + 44);

                // Section 4: Professional Client & Artist Sign-Off
                y = 198;
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(14, y, 182, 44, 3, 3, 'F');
                doc.setDrawColor(226, 232, 240);
                doc.roundedRect(14, y, 182, 44, 3, 3, 'D');

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(9.5);
                doc.setFont('helvetica', 'bold');
                doc.text('CLIENT CONSULTATION & ARTIST VERIFICATION', 18, y + 7);

                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 116, 139);
                doc.text('By signing below, the client confirms receipt of this technical coverage specification, agrees to the estimated session duration, and acknowledges the aftercare regimen.', 18, y + 14, { maxWidth: 174 });

                // Signature lines
                doc.setDrawColor(203, 213, 225);
                doc.line(18, y + 34, 90, y + 34);
                doc.line(106, y + 34, 178, y + 34);

                doc.setFontSize(7.5);
                doc.setTextColor(100, 116, 139);
                doc.text('Artist Signature & Studio Seal', 18, y + 39);
                doc.text('Client Signature & Date', 106, y + 39);

                // Footer Bar
                doc.setFillColor(241, 245, 249);
                doc.rect(0, 282, 210, 15, 'F');
                doc.setTextColor(148, 163, 184);
                doc.setFontSize(7.5);
                doc.text('Generated by Poli International Tattoo Coverage Suite • Certified Technical Documentation', 14, 289);
                doc.text('Page 1 of 1', 185, 289);

                // Trigger PDF download
                const filename = `tattoo_coverage_report_${optName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
                doc.save(filename);

                if (typeof showToastNotification === 'function') {
                    showToastNotification(`📑 <strong>Downloaded Client PDF Report</strong>: Saved '${filename}'`);
                }
            } else {
                window.print();
            }
        });
    }

    // Quick Save button to append scenario to Recent Calculations history
    if (quickSaveBtn) {
        quickSaveBtn.addEventListener('click', function() {
            const isMetric = currentGlobalUnit === 'sqcm';
            let sqinVal = sqinInput && sqinInput.value ? parseFloat(sqinInput.value) : 25;
            if (isNaN(sqinVal) || sqinVal <= 0) sqinVal = 25;

            const selectedOpt = inkNeedleSelect ? inkNeedleSelect.options[inkNeedleSelect.selectedIndex] : null;
            const presetVal = selectedOpt ? selectedOpt.value : 'medium-density';
            const rate = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-rate')) || 8.0) : 8.0;
            const mlPerSqin = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-ml')) || 0.15) : 0.15;
            const optName = selectedOpt ? selectedOpt.textContent.split('(')[0].trim() : 'Quick Estimate';
            const optTitle = selectedOpt ? selectedOpt.textContent : optName;

            const estMl = (sqinVal * mlPerSqin).toFixed(2);
            const estFloz = (parseFloat(estMl) * 0.033814).toFixed(3);
            const estHours = (sqinVal / rate).toFixed(2);
            const saturationPercent = Math.min(100, Math.max(12, Math.round((mlPerSqin / 0.28) * 100)));
            const catKey = getNeedleCategory(presetVal);
            const catTitle = catKey.charAt(0).toUpperCase() + catKey.slice(1);
            const displayArea = isMetric ? (sqinVal * 6.4516).toFixed(1) + ' cm²' : sqinVal.toFixed(1) + ' sq in';

            let levelText = 'Medium Saturation';
            if (saturationPercent <= 35) levelText = 'Light Saturation';
            else if (saturationPercent > 65) levelText = 'Heavy Solid Saturation';

            const volFormatted = currentVolUnit === 'floz' ? `${estFloz} fl oz (${estMl} mL)` : `${estMl} mL (${estFloz} fl oz)`;

            // Save to Recent Calculations Engine
            saveRecentCalculation(
                'ink',
                `Scenario: ${optName} (${displayArea})`,
                `Saturation: ${saturationPercent}% (${levelText}), Vol: ${volFormatted}, Chair Time: ${estHours} hrs`,
                {
                    area: displayArea,
                    preset: optTitle,
                    category: catTitle,
                    volume: volFormatted,
                    chairTime: `${estHours} hrs`,
                    saturation: `${saturationPercent}% (${levelText})`,
                    density: `${mlPerSqin} mL/in²`,
                    rate: `${rate} in²/hr`
                },
                {
                    needleType: `${catTitle} - ${optName}`,
                    sessionHours: estHours,
                    coverageArea: displayArea,
                    estimatedInk: `${estMl} mL`,
                    saturation: `${saturationPercent}%`,
                    saturationLevel: levelText
                }
            );

            showToastNotification(`💾 Saved scenario <strong>${optName}</strong> (${displayArea}) to Recent Calculations!`);
        });
    }
}

function flashElement(el) {
    el.focus();
    el.style.transition = 'all 0.3s ease';
    el.style.boxShadow = '0 0 0 4px #ff006e';
    setTimeout(() => {
        el.style.boxShadow = '';
    }, 1200);
}

/* ═══════════════════════════════════════════════════════════
   REAL-TIME INPUT FORM VALIDATION FEEDBACK
   ═══════════════════════════════════════════════════════════ */

function initializeRealtimeValidation() {
    const forms = ['coverage-form', 'session-form', 'ink-form', 'pricing-form'];

    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (!form) return;

        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            ['input', 'change', 'blur'].forEach(evtType => {
                input.addEventListener(evtType, function() {
                    validateSingleField(this);
                });
            });
        });

        form.addEventListener('submit', function(e) {
            let isValid = true;
            let firstInvalid = null;

            inputs.forEach(input => {
                if (!validateSingleField(input)) {
                    isValid = false;
                    if (!firstInvalid) firstInvalid = input;
                }
            });

            if (!isValid) {
                e.preventDefault();
                e.stopPropagation();
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
}

function validateSingleField(input) {
    if (!input || input.type === 'hidden' || input.type === 'button' || input.type === 'submit') return true;

    const val = input.value.trim();
    const min = input.hasAttribute('min') ? parseFloat(input.getAttribute('min')) : null;
    const max = input.hasAttribute('max') ? parseFloat(input.getAttribute('max')) : null;
    const isRequired = input.hasAttribute('required');
    let errorMsg = '';

    if (isRequired && (val === '' || val === null)) {
        errorMsg = 'This field is required.';
    } else if (input.type === 'number' && val !== '') {
        const numVal = parseFloat(val);
        if (isNaN(numVal)) {
            errorMsg = 'Please enter a valid numeric value.';
        } else if (numVal < 0) {
            errorMsg = 'Value cannot be negative.';
        } else if ((input.id === 'effective-hours' || input.id === 'pricing-hours') && numVal > 24) {
            errorMsg = 'Session duration cannot exceed 24 hours.';
        } else if (min !== null && numVal < min) {
            errorMsg = `Value must be at least ${min}.`;
        } else if (max !== null && numVal > max) {
            errorMsg = `Value cannot exceed ${max}.`;
        } else if (numVal <= 0 && input.id !== 'break-time') {
            errorMsg = 'Value must be greater than 0.';
        }
    }

    const parentGroup = input.closest('.coverage__form-group') || input.parentElement;
    let errorEl = parentGroup.querySelector('.coverage__input-error-msg');

    if (errorMsg) {
        input.classList.add('coverage__input--error');
        input.classList.remove('coverage__input--success');

        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'coverage__input-error-msg';
            parentGroup.appendChild(errorEl);
        }
        errorEl.textContent = errorMsg;
        return false;
    } else {
        input.classList.remove('coverage__input--error');
        if (val !== '') {
            input.classList.add('coverage__input--success');
        }
        if (errorEl) {
            errorEl.remove();
        }
        return true;
    }
}

/* ═══════════════════════════════════════════════════════════
   SESSION TIMELINE CHART ENGINE
   ═══════════════════════════════════════════════════════════ */

let sessionChartInstance = null;

function updateSessionTimelineChart(data) {
    const canvas = document.getElementById('session-timeline-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (sessionChartInstance) {
        sessionChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const activeTattooTime = (data.totalTime * 0.75).toFixed(1);
    const breakDuration = (data.totalTime * 0.15).toFixed(1);
    const setupBuffer = (data.totalTime * 0.10).toFixed(1);

    sessionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: data.sessionsNeeded }, (_, i) => `Session ${i + 1}`),
            datasets: [
                {
                    label: 'Active Tattoo Time (hrs)',
                    data: Array(data.sessionsNeeded).fill((activeTattooTime / data.sessionsNeeded).toFixed(1)),
                    backgroundColor: '#ff006e'
                },
                {
                    label: 'Client Breaks (hrs)',
                    data: Array(data.sessionsNeeded).fill((breakDuration / data.sessionsNeeded).toFixed(1)),
                    backgroundColor: '#0693e3'
                },
                {
                    label: 'Setup & Prep Buffer (hrs)',
                    data: Array(data.sessionsNeeded).fill((setupBuffer / data.sessionsNeeded).toFixed(1)),
                    backgroundColor: '#7000ff'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' } },
                y: { stacked: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' }, title: { display: true, text: 'Hours', color: '#a0a0a0' } }
            },
            plugins: {
                legend: { labels: { color: '#ffffff' } },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
}

/* ═══════════════════════════════════════════════════════════
   EXPORT PDF AND TXT REPORTS
   ═══════════════════════════════════════════════════════════ */

function exportResultPDF(type) {
    if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header banner
        doc.setFillColor(26, 26, 46);
        doc.rect(0, 0, 210, 25, 'F');
        doc.setTextColor(255, 0, 110);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('POLI INTERNATIONAL', 14, 12);
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.text('Professional Tattoo Needle Coverage & Estimation Report', 14, 18);

        let title = 'Tattoo Calculation Report';
        let lines = [];

        if (type === 'coverage') {
            title = 'Needle Coverage Report';
            const total = document.getElementById('coverage-total').textContent;
            const metric = document.getElementById('coverage-metric').textContent;
            const worktime = document.getElementById('coverage-worktime').textContent;
            const rate = document.getElementById('coverage-rate').textContent;
            lines = [
                `Total Coverage Area: ${total} sq in (${metric} sq cm)`,
                `Effective Working Time: ${worktime}`,
                `Coverage Rate: ${rate} sq in / hr`,
                `Date: ${new Date().toLocaleDateString()}`
            ];
        } else if (type === 'session') {
            title = 'Session Time Estimate Report';
            const total = document.getElementById('session-total-time').textContent;
            const count = document.getElementById('session-count').textContent;
            const perSession = document.getElementById('session-per-session').textContent;
            const timeline = document.getElementById('session-timeline').textContent;
            lines = [
                `Estimated Total Time: ${total}`,
                `Required Sessions: ${count}`,
                `Hours per Session: ${perSession}`,
                `Project Timeline: ${timeline}`,
                `Date: ${new Date().toLocaleDateString()}`
            ];
        } else if (type === 'ink') {
            title = 'Ink Consumption Report';
            const total = document.getElementById('ink-total').textContent;
            const perColor = document.getElementById('ink-per-color').textContent;
            const caps = document.getElementById('ink-caps').textContent;
            const cost = document.getElementById('ink-cost').textContent;
            lines = [
                `Total Ink Needed: ${total}`,
                `Ink per Color: ${perColor}`,
                `Ink Caps Required (5ml caps): ${caps}`,
                `Estimated Ink Cost: ${cost}`,
                `Date: ${new Date().toLocaleDateString()}`
            ];
        } else if (type === 'pricing') {
            title = 'Project Pricing Estimate Report';
            const suggested = document.getElementById('pricing-suggested').textContent;
            const range = document.getElementById('pricing-range').textContent;
            const deposit = document.getElementById('pricing-deposit').textContent;
            const perSqin = document.getElementById('pricing-per-sqin').textContent;
            lines = [
                `Suggested Project Fee: ${suggested}`,
                `Estimated Price Range: ${range}`,
                `Booking Deposit: ${deposit}`,
                `Rate per Sq Inch: ${perSqin}`,
                `Date: ${new Date().toLocaleDateString()}`
            ];
        }

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 38);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        let y = 48;
        lines.forEach(line => {
            doc.text(`•  ${line}`, 14, y);
            y += 8;
        });

        doc.setDrawColor(200, 200, 200);
        doc.line(14, y + 5, 196, y + 5);

        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text('Report generated by Poli International Tattoo Coverage Calculator.', 14, y + 15);

        doc.save(`tattoo_${type}_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } else {
        window.print();
    }
}

function exportResultTXT(type) {
    let title = 'POLI INTERNATIONAL - TATTOO REPORT';
    let text = `${title}\n${'='.repeat(title.length)}\nDate: ${new Date().toLocaleString()}\n\n`;

    if (type === 'coverage') {
        text += `Type: Coverage Calculation\n`;
        text += TP("x.total_coverage_sq_in_cm_n", "Total Coverage: {0} sq in ({1} cm²)\\n", document.getElementById('coverage-total').textContent, document.getElementById('coverage-metric').textContent);
        text += TP("x.working_time_n", "Working Time: {0}\\n", document.getElementById('coverage-worktime').textContent);
        text += TP("x.coverage_rate_sq_in_hr_n", "Coverage Rate: {0} sq in/hr\\n", document.getElementById('coverage-rate').textContent);
    } else if (type === 'session') {
        text += `Type: Session Time Estimate\n`;
        text += TP("x.total_time_n", "Total Time: {0}\\n", document.getElementById('session-total-time').textContent);
        text += TP("x.sessions_needed_n", "Sessions Needed: {0}\\n", document.getElementById('session-count').textContent);
        text += TP("x.per_session_duration_n", "Per Session Duration: {0}\\n", document.getElementById('session-per-session').textContent);
        text += TP("x.timeline_n", "Timeline: {0}\\n", document.getElementById('session-timeline').textContent);
    } else if (type === 'ink') {
        text += `Type: Ink Consumption Estimate\n`;
        text += TP("x.total_ink_n", "Total Ink: {0}\\n", document.getElementById('ink-total').textContent);
        text += TP("x.per_color_n", "Per Color: {0}\\n", document.getElementById('ink-per-color').textContent);
        text += TP("x.ink_caps_n", "Ink Caps: {0}\\n", document.getElementById('ink-caps').textContent);
        text += TP("x.estimated_cost_n", "Estimated Cost: {0}\\n", document.getElementById('ink-cost').textContent);
    } else if (type === 'pricing') {
        text += `Type: Pricing Estimate\n`;
        text += TP("x.suggested_price_n", "Suggested Price: {0}\\n", document.getElementById('pricing-suggested').textContent);
        text += TP("x.price_range_n", "Price Range: {0}\\n", document.getElementById('pricing-range').textContent);
        text += TP("x.deposit_n", "Deposit: {0}\\n", document.getElementById('pricing-deposit').textContent);
        text += TP("x.per_square_inch_n", "Per Square Inch: {0}\\n", document.getElementById('pricing-per-sqin').textContent);
    }

    text += `\n---\nPowered by Poli International (https://poliinternational.com)`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tattoo_${type}_record_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS (Ctrl+Enter / Cmd+Enter)
   ═══════════════════════════════════════════════════════════ */

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activePanel = document.querySelector('.coverage__panel--active');
            if (!activePanel) return;

            const activeForm = activePanel.querySelector('form');
            if (activeForm) {
                e.preventDefault();
                if (typeof activeForm.requestSubmit === 'function') {
                    activeForm.requestSubmit();
                } else {
                    activeForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
            }
        }
    });
}

/* ═══════════════════════════════════════════════════════════
   REAL-TIME SESSION CHAIR TIME TIMER & STOPWATCH
   ═══════════════════════════════════════════════════════════ */

let sessionTimerState = {
    interval: null,
    seconds: 0,
    isRunning: false,
    mode: 'stopwatch', // 'stopwatch' or 'countdown'
    targetSeconds: 0,
    laps: []
};

function initializeSessionTimer() {
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const breakBtn = document.getElementById('timer-break-btn');
    const modeStopwatchBtn = document.getElementById('timer-mode-stopwatch');
    const modeCountdownBtn = document.getElementById('timer-mode-countdown');

    if (startBtn) {
        startBtn.addEventListener('click', startSessionTimer);
    }
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseSessionTimer);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSessionTimer);
    }
    if (breakBtn) {
        breakBtn.addEventListener('click', recordTimerBreak);
    }

    if (modeStopwatchBtn && modeCountdownBtn) {
        modeStopwatchBtn.addEventListener('click', function() {
            sessionTimerState.mode = 'stopwatch';
            modeStopwatchBtn.classList.add('coverage__timer-mode-btn--active');
            modeCountdownBtn.classList.remove('coverage__timer-mode-btn--active');
            updateSessionTimerDisplay();
        });

        modeCountdownBtn.addEventListener('click', function() {
            sessionTimerState.mode = 'countdown';
            modeCountdownBtn.classList.add('coverage__timer-mode-btn--active');
            modeStopwatchBtn.classList.remove('coverage__timer-mode-btn--active');
            updateSessionTimerDisplay();
        });
    }

    updateSessionTimerDisplay();
}

function startSessionTimer() {
    if (sessionTimerState.isRunning) return;

    sessionTimerState.isRunning = true;
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');

    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-flex';

    sessionTimerState.interval = setInterval(function() {
        sessionTimerState.seconds++;
        updateSessionTimerDisplay();
        if (typeof checkGoalMilestonesNotification === 'function') {
            checkGoalMilestonesNotification(sessionTimerState.seconds);
        }
    }, 1000);
}

function pauseSessionTimer() {
    if (!sessionTimerState.isRunning) return;

    sessionTimerState.isRunning = false;
    clearInterval(sessionTimerState.interval);

    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');

    if (startBtn) {
        startBtn.style.display = 'inline-flex';
        startBtn.textContent = T("x.resume_session", "▶ Resume Session");
    }
    if (pauseBtn) pauseBtn.style.display = 'none';

    updateSessionTimerDisplay();
}

function resetSessionTimer() {
    pauseSessionTimer();
    sessionTimerState.seconds = 0;
    sessionTimerState.laps = [];

    const startBtn = document.getElementById('timer-start-btn');
    if (startBtn) startBtn.textContent = T("btn_start_timer", "▶ Start Session");

    const lapsList = document.getElementById('timer-laps-list');
    if (lapsList) {
        lapsList.style.display = 'none';
        lapsList.innerHTML = '';
    }

    updateSessionTimerDisplay();
}

function recordTimerBreak() {
    if (!sessionTimerState.seconds) return;

    const formatted = formatTimerDisplayString(sessionTimerState.seconds);
    const lapNumber = sessionTimerState.laps.length + 1;
    sessionTimerState.laps.push(`Break #${lapNumber} logged at ${formatted}`);

    const lapsList = document.getElementById('timer-laps-list');
    if (lapsList) {
        lapsList.style.display = 'block';
        lapsList.innerHTML = '<strong>Logged Breaks:</strong><br>' + sessionTimerState.laps.map(l => `• ${l}`).join('<br>');
    }
}

function formatTimerDisplayString(secTotal) {
    const hrs = Math.floor(secTotal / 3600);
    const mins = Math.floor((secTotal % 3600) / 60);
    const secs = secTotal % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateSessionTimerDisplay() {
    const displayEl = document.getElementById('session-timer-display');
    const targetDisplay = document.getElementById('timer-target-display');
    const statusTag = document.getElementById('timer-status-tag');
    const progressBar = document.getElementById('session-timer-progress-bar');

    if (!displayEl) return;

    let displaySec = sessionTimerState.seconds;

    if (sessionTimerState.mode === 'countdown' && sessionTimerState.targetSeconds > 0) {
        displaySec = Math.max(0, sessionTimerState.targetSeconds - sessionTimerState.seconds);
    }

    displayEl.textContent = formatTimerDisplayString(displaySec);

    // Update target text
    if (targetDisplay) {
        if (sessionTimerState.targetSeconds > 0) {
            targetDisplay.textContent = TP("x.hrs", "{0} hrs ({1})", (sessionTimerState.targetSeconds / 3600).toFixed(1), sessionTimerState.mode);
        } else {
            targetDisplay.textContent = T("x.not_set_run_estimate", "Not Set (Run Estimate)");
        }
    }

    // Update progress bar & pace status
    if (progressBar) {
        if (sessionTimerState.targetSeconds > 0) {
            const pct = Math.min(100, (sessionTimerState.seconds / sessionTimerState.targetSeconds) * 100);
            progressBar.style.width = pct + '%';

            if (pct >= 100) {
                progressBar.style.background = '#ef4444';
                if (statusTag) {
                    statusTag.textContent = T("x.over_estimate", "⚠️ Over Estimate");
                    statusTag.style.color = '#ef4444';
                }
            } else if (pct > 80) {
                progressBar.style.background = '#f59e0b';
                if (statusTag) {
                    statusTag.textContent = T("x.nearing_target", "⚡ Nearing Target");
                    statusTag.style.color = '#f59e0b';
                }
            } else {
                progressBar.style.background = 'linear-gradient(90deg, #0693e3, #ff006e)';
                if (statusTag) {
                    statusTag.textContent = T("x.on_pace", "✓ On Pace");
                    statusTag.style.color = '#10b981';
                }
            }
        } else {
            progressBar.style.width = '0%';
            if (statusTag) {
                statusTag.textContent = sessionTimerState.isRunning ? T("x.active", "Active") : T("x.ready", "Ready");
                statusTag.style.color = '#10b981';
            }
        }
    }
}

/* ═══════════════════════════════════════════════════════════
   SIDE-BY-SIDE SCENARIO COMPARISON WIDGET
   ═══════════════════════════════════════════════════════════ */

const NEEDLE_PRESETS_FOR_COMPARISON = [
    { id: 'needle-1RL', title: '1RL Single Needle (Micro Detail)', detail: '1.0 sq in/hr', params: 'Needle: 1RL | Speed: Medium | Pass: 2', rate: 1.0 },
    { id: 'needle-3RL', title: '3RL Fine Line Outlining', detail: '3.0 sq in/hr', params: 'Needle: 3RL | Speed: Medium | Pass: 1', rate: 3.0 },
    { id: 'needle-5RL', title: '5RL Standard Outlines', detail: '5.0 sq in/hr', params: 'Needle: 5RL | Speed: Medium | Pass: 1', rate: 5.0 },
    { id: 'needle-7RL', title: '7RL Medium Bold Lines', detail: '7.0 sq in/hr', params: 'Needle: 7RL | Speed: Medium | Pass: 1', rate: 7.0 },
    { id: 'needle-9RL', title: '9RL Traditional Bold Lines', detail: '8.0 sq in/hr', params: 'Needle: 9RL | Speed: Medium | Pass: 1', rate: 8.0 },
    { id: 'needle-5RS', title: '5RS Light Shading', detail: '6.0 sq in/hr', params: 'Needle: 5RS | Speed: Medium | Pass: 3', rate: 6.0 },
    { id: 'needle-7RS', title: '7RS Medium Shading', detail: '8.0 sq in/hr', params: 'Needle: 7RS | Speed: Medium | Pass: 2', rate: 8.0 },
    { id: 'needle-9RS', title: '9RS Heavy Shading', detail: '10.0 sq in/hr', params: 'Needle: 9RS | Speed: Medium | Pass: 2', rate: 10.0 },
    { id: 'needle-7M1', title: '7M1 Soft Shading Magnum', detail: '16.0 sq in/hr', params: 'Needle: 7M1 | Speed: Medium | Pass: 3', rate: 16.0 },
    { id: 'needle-9M1', title: '9M1 Workhorse Shader', detail: '20.0 sq in/hr', params: 'Needle: 9M1 | Speed: Medium | Pass: 2', rate: 20.0 },
    { id: 'needle-11M1', title: '11M1 Large Area Magnum', detail: '24.0 sq in/hr', params: 'Needle: 11M1 | Speed: Medium | Pass: 2', rate: 24.0 },
    { id: 'needle-13M1', title: '13M1 Fast Coverage Magnum', detail: '28.0 sq in/hr', params: 'Needle: 13M1 | Speed: Medium | Pass: 2', rate: 28.0 },
    { id: 'needle-15M2', title: '15M2 Maximum Stacked Magnum', detail: '32.0 sq in/hr', params: 'Needle: 15M2 | Speed: Medium | Pass: 2', rate: 32.0 },
    { id: 'needle-18M2', title: '18M2 Maximum Back/Sleeve Shader', detail: '36.0 sq in/hr', params: 'Needle: 18M2 | Speed: Medium | Pass: 2', rate: 36.0 },
    { id: 'needle-9CM', title: '9CM Curved Magnum Realism', detail: '18.0 sq in/hr', params: 'Needle: 9CM | Speed: Medium | Pass: 3', rate: 18.0 },
    { id: 'needle-11CM', title: '11CM Curved Magnum Smooth', detail: '22.0 sq in/hr', params: 'Needle: 11CM | Speed: Medium | Pass: 2', rate: 22.0 },
    { id: 'needle-13CM', title: '13CM Curved Magnum Large', detail: '26.0 sq in/hr', params: 'Needle: 13CM | Speed: Medium | Pass: 2', rate: 26.0 }
];

function initializeComparisonWidget() {
    const toggleBtn = document.getElementById('comparison-toggle-btn');
    const bodyEl = document.getElementById('comparison-body');
    const toggleIcon = document.getElementById('comparison-toggle-icon');
    const selectA = document.getElementById('compare-select-a');
    const selectB = document.getElementById('compare-select-b');

    if (toggleBtn && bodyEl) {
        toggleBtn.addEventListener('click', function() {
            const isHidden = bodyEl.style.display === 'none';
            bodyEl.style.display = isHidden ? 'block' : 'none';
            if (toggleIcon) toggleIcon.textContent = isHidden ? T("x.collapse_comparison_mode", "▲ Collapse Comparison Mode") : T("x.toggle_comparison_mode", "▼ Toggle Comparison Mode");
            if (isHidden) {
                populateComparisonDropdowns();
            }
        });
    }

    if (selectA && selectB) {
        selectA.addEventListener('change', renderComparisonCards);
        selectB.addEventListener('change', renderComparisonCards);
    }

    // Auto populate options on startup
    populateComparisonDropdowns();
}

function populateComparisonDropdowns() {
    const selectA = document.getElementById('compare-select-a');
    const selectB = document.getElementById('compare-select-b');
    if (!selectA || !selectB) return;

    const records = getRecentCalculations();

    let optionsHtml = '<option value="">Select needle or calculation...</option>';

    optionsHtml += '<optgroup label="💉 Standard Needle Configurations">';
    NEEDLE_PRESETS_FOR_COMPARISON.forEach(n => {
        optionsHtml += `<option value="${n.id}">${n.title} (${n.detail})</option>`;
    });
    optionsHtml += '</optgroup>';

    if (records.length > 0) {
        optionsHtml += '<optgroup label="🕒 Your Saved Calculation Records">';
        records.forEach(r => {
            optionsHtml += `<option value="${r.id}">${r.type.toUpperCase()}: ${r.title} (${r.detail})</option>`;
        });
        optionsHtml += '</optgroup>';
    }

    const valA = selectA.value || 'needle-3RL';
    const valB = selectB.value || 'needle-11M1';

    selectA.innerHTML = optionsHtml;
    selectB.innerHTML = optionsHtml;

    selectA.value = valA;
    selectB.value = valB;

    renderComparisonCards();
}

function estimateItemInkForBenchmark(item, targetArea = 20) {
    if (!item) return 12.0;

    // If item already contains numeric ink calculation
    if (item.estimatedInk) {
        const parsed = parseFloat(item.estimatedInk);
        if (!isNaN(parsed) && parsed > 0) {
            const itemArea = parseFloat(item.area) || targetArea;
            return (parsed / itemArea) * targetArea;
        }
    }

    const titleLower = (item.title || '').toLowerCase();
    const idLower = (item.id || '').toLowerCase();
    const combined = `${idLower} ${titleLower}`;

    if (combined.includes('3rl') || combined.includes('single needle')) return 0.35 * targetArea;
    if (combined.includes('5rl')) return 0.42 * targetArea;
    if (combined.includes('7rl')) return 0.48 * targetArea;
    if (combined.includes('9rl')) return 0.55 * targetArea;
    if (combined.includes('7rs')) return 0.55 * targetArea;
    if (combined.includes('9rs') || combined.includes('14rs')) return 0.65 * targetArea;
    if (combined.includes('7m1') || combined.includes('7cm')) return 0.65 * targetArea;
    if (combined.includes('9m1') || combined.includes('9cm')) return 0.75 * targetArea;
    if (combined.includes('11m1') || combined.includes('11cm')) return 0.85 * targetArea;
    if (combined.includes('13cm') || combined.includes('15m1') || combined.includes('15cm')) return 0.95 * targetArea;
    if (combined.includes('25m1') || combined.includes('27m1')) return 1.20 * targetArea;
    if (combined.includes('49m1') || combined.includes('giant magnum')) return 1.60 * targetArea;

    // Default based on coverage rate if available
    const rate = parseFloat(item.rate) || 10.0;
    if (rate >= 30) return 1.40 * targetArea;
    if (rate >= 18) return 0.95 * targetArea;
    if (rate >= 10) return 0.70 * targetArea;
    if (rate >= 5) return 0.50 * targetArea;
    return 0.38 * targetArea;
}

function renderComparisonCards() {
    const selectA = document.getElementById('compare-select-a');
    const selectB = document.getElementById('compare-select-b');
    const container = document.getElementById('comparison-results-grid');

    if (!selectA || !selectB || !container) return;

    const idA = selectA.value;
    const idB = selectB.value;

    if (!idA || !idB) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    const records = getRecentCalculations();
    const allSources = [...NEEDLE_PRESETS_FOR_COMPARISON, ...records];

    let itemA = allSources.find(r => r.id === idA);
    let itemB = allSources.find(r => r.id === idB);

    if (!itemA || !itemB) return;

    container.style.display = 'grid';

    // 1. Calculate Chair Time Metrics on standard 20 in² benchmark piece
    const targetArea = 20; // 20 sq in standard comparative area
    const rateA = itemA.rate || parseFloat(itemA.detail) || 5.0;
    const rateB = itemB.rate || parseFloat(itemB.detail) || 20.0;

    const timeA = targetArea / rateA;
    const timeB = targetArea / rateB;
    const timeDelta = timeB - timeA;
    const timeVariancePct = ((timeB - timeA) / timeA) * 100;
    const speedMultiplier = rateB / rateA;

    // 2. Calculate Ink Volume Metrics on standard 20 in² benchmark
    const inkA = estimateItemInkForBenchmark(itemA, targetArea);
    const inkB = estimateItemInkForBenchmark(itemB, targetArea);
    const inkDelta = inkB - inkA;
    const inkVariancePct = ((inkB - inkA) / inkA) * 100;

    // Format narrative insight
    const isFaster = timeB < timeA;
    const isSlower = timeB > timeA;
    const isMoreInk = inkB > inkA;
    const isLessInk = inkB < inkA;

    let timeBadgeHtml = '';
    if (isFaster) {
        timeBadgeHtml = `<span class="coverage__variance-delta-badge coverage__variance-delta-badge--faster">⚡ ${Math.abs(timeVariancePct).toFixed(1)}% FASTER</span>`;
    } else if (isSlower) {
        timeBadgeHtml = `<span class="coverage__variance-delta-badge coverage__variance-delta-badge--slower">⏳ +${Math.abs(timeVariancePct).toFixed(1)}% SLOWER</span>`;
    } else {
        timeBadgeHtml = `<span class="coverage__variance-delta-badge" style="background: rgba(255,255,255,0.1); color: #ffffff;">IDENTICAL SPEED</span>`;
    }

    let inkBadgeHtml = '';
    if (isMoreInk) {
        inkBadgeHtml = `<span class="coverage__variance-delta-badge coverage__variance-delta-badge--higher">🧪 +${Math.abs(inkVariancePct).toFixed(1)}% INK VOLUME</span>`;
    } else if (isLessInk) {
        inkBadgeHtml = `<span class="coverage__variance-delta-badge coverage__variance-delta-badge--lower">💧 -${Math.abs(inkVariancePct).toFixed(1)}% INK VOLUME</span>`;
    } else {
        inkBadgeHtml = `<span class="coverage__variance-delta-badge" style="background: rgba(255,255,255,0.1); color: #ffffff;">EQUAL VOLUME</span>`;
    }

    let narrativeExplanation = '';
    if (isFaster) {
        narrativeExplanation = `<strong>Scenario B (${itemB.title})</strong> executes the session <strong>${speedMultiplier.toFixed(1)}x faster</strong> than Baseline A, reducing chair time by <strong>${Math.abs(timeDelta).toFixed(1)} hours</strong> (${Math.abs(timeVariancePct).toFixed(1)}% efficiency gain on 20 in²). ` +
            (isMoreInk ? `Due to increased needle configuration width and fluid delivery, pigment deposit increases by <strong>+${inkVariancePct.toFixed(1)}% (${inkB.toFixed(1)} mL vs ${inkA.toFixed(1)} mL)</strong>.` : `Ink consumption changes by <strong>${inkVariancePct.toFixed(1)}% (${inkB.toFixed(1)} mL vs ${inkA.toFixed(1)} mL)</strong>.`);
    } else if (isSlower) {
        narrativeExplanation = `<strong>Scenario B (${itemB.title})</strong> operates with finer precision, requiring <strong>+${timeVariancePct.toFixed(1)}% more chair time</strong> (+${timeDelta.toFixed(1)} hrs on 20 in²). ` +
            (isLessInk ? `However, ink deposit volume decreases by <strong>${Math.abs(inkVariancePct).toFixed(1)}% (${inkB.toFixed(1)} mL vs ${inkA.toFixed(1)} mL)</strong>, reflecting lower fluid dissipation in fine-gauge needle groupings.` : `Pigment volume requirements adjust to <strong>${inkB.toFixed(1)} mL (${inkVariancePct >= 0 ? '+' : ''}${inkVariancePct.toFixed(1)}%)</strong>.`);
    } else {
        narrativeExplanation = `Both scenarios demonstrate equivalent chair time velocity (${timeA.toFixed(1)} hrs / 20 in²). Pigment consumption variance is <strong>${inkVariancePct.toFixed(1)}%</strong>.`;
    }

    container.innerHTML = `
        <div class="coverage__compare-card">
            <div class="coverage__compare-card-title">Scenario A (Baseline)</div>
            <div style="font-size: 1rem; font-weight: bold; color: var(--color-neon-pink); margin-bottom: 0.5rem;">${itemA.title}</div>
            <div class="coverage__compare-metric">
                <span>Coverage Rate:</span>
                <strong>${itemA.detail}</strong>
            </div>
            <div class="coverage__compare-metric">
                <span>Parameters:</span>
                <span style="font-size: 0.8rem; color: var(--color-text-secondary);">${itemA.params}</span>
            </div>
            <div class="coverage__compare-metric">
                <span>Est. Chair Time (20 in²):</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-neon-pink);">${timeA.toFixed(1)} hours</span>
            </div>
            <div class="coverage__compare-metric">
                <span>Est. Ink Volume (20 in²):</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #a78bfa;">${inkA.toFixed(1)} mL</span>
            </div>
        </div>

        <div class="coverage__compare-card">
            <div class="coverage__compare-card-title">Scenario B (Comparison)</div>
            <div style="font-size: 1rem; font-weight: bold; color: #0693e3; margin-bottom: 0.5rem;">${itemB.title}</div>
            <div class="coverage__compare-metric">
                <span>Coverage Rate:</span>
                <strong>${itemB.detail}</strong>
            </div>
            <div class="coverage__compare-metric">
                <span>Parameters:</span>
                <span style="font-size: 0.8rem; color: var(--color-text-secondary);">${itemB.params}</span>
            </div>
            <div class="coverage__compare-metric">
                <span>Est. Chair Time (20 in²):</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #0693e3;">${timeB.toFixed(1)} hours</span>
            </div>
            <div class="coverage__compare-metric">
                <span>Est. Ink Volume (20 in²):</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #38bdf8;">${inkB.toFixed(1)} mL</span>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════
             VARIANCE INSIGHT PANEL (CHAIR TIME & INK VOLUME %)
             ═══════════════════════════════════════════════════════════ -->
        <div class="coverage__variance-insight-card">
            <div class="coverage__variance-header">
                <h4 class="coverage__variance-title">
                    <span>⚡</span> Variance Insight: Chair Time & Ink Volume Delta
                </h4>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    ${timeBadgeHtml}
                    ${inkBadgeHtml}
                </div>
            </div>

            <div class="coverage__variance-grid">
                <!-- Box 1: Chair Time Percentage Variance -->
                <div class="coverage__variance-stat-box">
                    <div>
                        <div class="coverage__variance-stat-label">
                            <span>⏱️ Chair Time Variance</span>
                            ${timeBadgeHtml}
                        </div>
                        <div class="coverage__variance-stat-value" style="color: ${isFaster ? '#10b981' : isSlower ? '#f59e0b' : '#ffffff'};">
                            ${timeVariancePct >= 0 ? '+' : ''}${timeVariancePct.toFixed(1)}%
                        </div>
                    </div>
                    <div style="font-size: 0.73rem; color: var(--color-text-secondary); margin-top: 0.3rem;">
                        ${timeA.toFixed(1)}h (A) vs ${timeB.toFixed(1)}h (B) • <strong>${Math.abs(timeDelta).toFixed(1)}h ${isFaster ? 'saved' : 'added'}</strong>
                    </div>
                </div>

                <!-- Box 2: Speed Multiplier Factor -->
                <div class="coverage__variance-stat-box">
                    <div>
                        <div class="coverage__variance-stat-label">
                            <span>🚀 Speed Multiplier</span>
                            <span class="coverage__variance-pill" style="background: rgba(6,147,227,0.15); color: #0693e3;">Relative</span>
                        </div>
                        <div class="coverage__variance-stat-value" style="color: #38bdf8;">
                            ${speedMultiplier.toFixed(2)}x
                        </div>
                    </div>
                    <div style="font-size: 0.73rem; color: var(--color-text-secondary); margin-top: 0.3rem;">
                        ${rateA.toFixed(1)} in²/hr vs ${rateB.toFixed(1)} in²/hr delivery speed
                    </div>
                </div>

                <!-- Box 3: Ink Volume Percentage Variance -->
                <div class="coverage__variance-stat-box">
                    <div>
                        <div class="coverage__variance-stat-label">
                            <span>💧 Ink Volume Variance</span>
                            ${inkBadgeHtml}
                        </div>
                        <div class="coverage__variance-stat-value" style="color: ${isMoreInk ? 'var(--color-neon-pink)' : '#0693e3'};">
                            ${inkVariancePct >= 0 ? '+' : ''}${inkVariancePct.toFixed(1)}%
                        </div>
                    </div>
                    <div style="font-size: 0.73rem; color: var(--color-text-secondary); margin-top: 0.3rem;">
                        ${inkA.toFixed(1)} mL (A) vs ${inkB.toFixed(1)} mL (B) • <strong>${Math.abs(inkDelta).toFixed(1)} mL delta</strong>
                    </div>
                </div>

                <!-- Box 4: Standard 20 in² Benchmark Area -->
                <div class="coverage__variance-stat-box">
                    <div>
                        <div class="coverage__variance-stat-label">
                            <span>📐 Comparative Benchmark</span>
                            <span class="coverage__variance-pill" style="background: rgba(167,139,250,0.15); color: #c084fc;">Normalized</span>
                        </div>
                        <div class="coverage__variance-stat-value" style="color: #c084fc;">
                            20 in²
                        </div>
                    </div>
                    <div style="font-size: 0.73rem; color: var(--color-text-secondary); margin-top: 0.3rem;">
                        Standardized forearm / bicep session segment
                    </div>
                </div>
            </div>

            <!-- Detailed Procedural Narrative -->
            <div class="coverage__variance-narrative">
                ${narrativeExplanation}
            </div>
        </div>
    `;
}

/* ═══════════════════════════════════════════════════════════
   CONSOLE BRANDING
   ═══════════════════════════════════════════════════════════ */

console.log('%c🎨 Professional Needle Coverage Calculator', 'color: #FF006E; font-size: 18px; font-weight: bold;');
console.log('%cPowered by Poli International', 'color: #2C5F7C; font-size: 12px;');
console.log('%cFree tools for professional tattoo artists', 'color: #808080; font-size: 10px;');


/* ═══════════════════════════════════════════════════════════
   FEATURE 1: SESSION HEALTH SCORE ENGINE
   ═══════════════════════════════════════════════════════════ */

function renderSessionHealthScore(data) {
    const badgeEl = document.getElementById('session-health-score-badge');
    const barEl = document.getElementById('session-health-score-bar');
    const listEl = document.getElementById('session-health-suggestions-list');

    if (!badgeEl || !barEl || !listEl) return;

    let score = 100;
    const suggestions = [];

    // Penalty for session length exceeding 4.5 hours
    const hours = data.hoursPerSession || data.totalTime;
    if (hours > 4.5) {
        const penalty = Math.min(30, (hours - 4.5) * 12);
        score -= penalty;
        suggestions.push(`⏱️ <strong>Session Duration Warning:</strong> ${hours.toFixed(1)} hrs per sitting causes fatigue tremor and skin saturation. Consider capping sittings at 4 hours or splitting into ${data.sessionsNeeded > 1 ? data.sessionsNeeded : 2} appointments.`);
    }

    // Body location sensitivity & difficulty penalty
    const locName = data.locationData ? data.locationData.name : '';
    const isSensitiveArea = ['Ribs', 'Neck', 'Hands', 'Feet', 'Spine', 'Elbow Ditch', 'Knee Ditch'].includes(locName);

    if (isSensitiveArea) {
        score -= 15;
        suggestions.push(`⚡ <strong>Sensitive Skin Zone:</strong> ${locName} has elevated nerve density. Client twitching increases after 90 mins. Pre-plan short stretch breaks every 60-75 minutes.`);
    }

    // Low pain tolerance adjustment
    if (data.painTolerance === 'low') {
        score -= 15;
        suggestions.push(`🧘 <strong>Pain Management:</strong> Client indicated low pain tolerance. Recommend pre-applying topical numbing cream or scheduling a shorter initial outline session.`);
    }

    // High complexity on difficult location
    if (data.complexityData && data.complexityData.time_multiplier > 1.4 && isSensitiveArea) {
        score -= 15;
        suggestions.push(`🎨 <strong>Complex Shading on Tender Skin:</strong> High detail work on ${locName} risks blowouts if skin swells. Line outline first and reserve shading for session #2.`);
    }

    // Always provide baseline guidance if score is high
    if (suggestions.length === 0) {
        suggestions.push(`✅ <strong>Optimal Ergonomic Conditions:</strong> Parameters are well-balanced. Keep workspace lit with 5000K LED and ensure ergonomic armrest support.`);
    }

    score = Math.max(20, Math.min(100, Math.round(score)));

    // UI Updates
    barEl.style.width = score + '%';

    if (score >= 85) {
        badgeEl.textContent = TP("x.100_optimal_health", "{0}/100 • Optimal Health", score);
        badgeEl.style.background = 'rgba(16, 185, 129, 0.2)';
        badgeEl.style.color = '#10b981';
        badgeEl.style.borderColor = '#10b981';
        barEl.style.backgroundColor = '#10b981';
    } else if (score >= 65) {
        badgeEl.textContent = TP("x.100_moderate_workload_risk", "{0}/100 • Moderate Workload Risk", score);
        badgeEl.style.background = 'rgba(245, 158, 11, 0.2)';
        badgeEl.style.color = '#f59e0b';
        badgeEl.style.borderColor = '#f59e0b';
        barEl.style.backgroundColor = '#f59e0b';
    } else {
        badgeEl.textContent = TP("x.100_high_fatigue_twitch_risk", "{0}/100 • High Fatigue & Twitch Risk", score);
        badgeEl.style.background = 'rgba(239, 68, 68, 0.2)';
        badgeEl.style.color = '#ef4444';
        badgeEl.style.borderColor = '#ef4444';
        barEl.style.backgroundColor = '#ef4444';
    }

    listEl.innerHTML = suggestions.map(s => `
        <li style="margin-bottom: 0.5rem; font-size: 0.85rem; line-height: 1.5; color: var(--color-text-secondary); background: rgba(255,255,255,0.03); padding: 0.6rem 0.8rem; border-radius: 6px; border-left: 3px solid ${score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444'};">
            ${s}
        </li>
    `).join('');
}


/* ═══════════════════════════════════════════════════════════
   FEATURE 2: INTERACTIVE SVG BODY MAP & ANATOMICAL CALLOUT ENGINE
   ═══════════════════════════════════════════════════════════ */

const ANATOMICAL_LOCATION_DATA = {
    'neck': {
        muscle: 'Trapezius & Sternocleidomastoid',
        badge: 'High Stretch & Pain Risk',
        badgeColor: '#ef4444',
        detail: 'Loose, thin skin over carotid vascular bundle & nerve clusters. Three-finger skin stretch required.',
        tip: 'Use neck support pillow; keep client seated upright and instruct slow breathing during needle passes.'
    },
    'shoulder': {
        muscle: 'Anterior & Lateral Deltoid',
        badge: 'Low Stretch Risk',
        badgeColor: '#10b981',
        detail: 'Firm, smooth muscle cap over shoulder joint. Easy skin stretch with single hand.',
        tip: 'Elevate armrest to 60° to open deltoid muscle plane for uniform ink saturation.'
    },
    'chest': {
        muscle: 'Pectoralis Major & Clavicular Cluster',
        badge: 'Moderate-High Sensitivity',
        badgeColor: '#f59e0b',
        detail: 'Tightly bound over sternum & clavicle bones; mobile fat layer on outer pec.',
        tip: 'Angle machine at 45° across rib lines to prevent needle bounce over bone.'
    },
    'ribs': {
        muscle: 'Intercostal Rib Cage & External Obliques',
        badge: 'Extreme Stretch Risk',
        badgeColor: '#ef4444',
        detail: 'Highly elastic skin moving with respiratory expansion; tender nerve endings between ribs.',
        tip: 'Lock client in side-lying position with stretch tape or helper stretch hand; work in short 45-min bursts.'
    },
    'outer-upper-arm': {
        muscle: 'Biceps Brachii & Deltoid',
        badge: 'Low Stretch Risk',
        badgeColor: '#10b981',
        detail: 'Firm, smooth skin over bicep muscle belly. Easy two-finger stretch.',
        tip: 'Position armrest at 45° angle to stabilize muscle surface and minimize skin bounce.'
    },
    'outer-forearm': {
        muscle: 'Brachioradialis & Wrist Extensors',
        badge: 'Low-Medium Risk',
        badgeColor: '#10b981',
        detail: 'Moderate elasticity over muscle fascia; tightens toward wrist joint.',
        tip: 'Secure wrist with ergonomic wrist rest to prevent hand tremors during fine lining.'
    },
    'hands': {
        muscle: 'Palmar Metacarpals & Tendons',
        badge: 'High Fade & Pain Zone',
        badgeColor: '#ef4444',
        detail: 'Extremely thin epidermis over metacarpal bones & flexor tendons. High ink fallout risk.',
        tip: 'Stretch skin tightly over closed fist; use tighter needle groupings (3RL/5RL) to prevent blowouts.'
    },
    'thigh': {
        muscle: 'Rectus Femoris & Quadriceps Group',
        badge: 'Moderate Stretch Needed',
        badgeColor: '#f59e0b',
        detail: 'Plump adipose & heavy muscle belly. Requires firm two-hand palm stretch.',
        tip: 'Keep client supine with knee slightly bent to relax quad tension.'
    },
    'outer-calf': {
        muscle: 'Gastrocnemius & Tibialis Anterior',
        badge: 'Low-Medium Stretch Risk',
        badgeColor: '#10b981',
        detail: 'Firm muscle backing over calf; tightens near Achilles tendon.',
        tip: 'Use leg wedge to elevate calf above hip level for comfortable artist posture.'
    },
    'feet': {
        muscle: 'Dorsal Extensor Tendons & Ankle Joint',
        badge: 'High Pain & Twitch Zone',
        badgeColor: '#ef4444',
        detail: 'Extremely thin skin directly over tarsal bones. High client involuntary twitch reflex.',
        tip: 'Anchor foot firmly with leg rest strap; maintain firm skin tension over bony prominences.'
    },
    'upper-back': {
        muscle: 'Latissimus Dorsi & Rhomboids',
        badge: 'Low-Medium Stretch Risk',
        badgeColor: '#10b981',
        detail: 'Broad flat skin expanse over back muscles; tightens when seated forward.',
        tip: 'Have client lean forward over massage chair to stretch upper back canvas naturally.'
    },
    'inner-forearm': {
        muscle: 'Flexor Carpi Radialis & Tendons',
        badge: 'Moderate-High Sensitivity',
        badgeColor: '#f59e0b',
        detail: 'Soft, sensitive skin prone to bruising and blowouts near inner elbow crease.',
        tip: 'Lighten machine stroke depth slightly and stretch skin sideways across forearm width.'
    },
    'lower-back': {
        muscle: 'Erector Spinae & Lumbar Fascia',
        badge: 'Moderate Stretch Risk',
        badgeColor: '#f59e0b',
        detail: 'Elastic skin over spine; stretches dynamically with torso bending.',
        tip: 'Keep client prone on flat table with lumbar support pillow.'
    },
    'spine': {
        muscle: 'Vertebral Column & Spinal Ligaments',
        badge: 'High Sensitivity & Pain Zone',
        badgeColor: '#ef4444',
        detail: 'Tightly stretched directly over bony spinous processes. Severe vibration transfer.',
        tip: 'Use low voltage machine stroke to reduce bone vibration discomfort.'
    },
    'elbow-ditch': {
        muscle: 'Cubital Fossa & Brachial Fascia',
        badge: 'Extreme Blowout & Healing Risk',
        badgeColor: '#ef4444',
        detail: 'Hyper-flexible skin folds with thin dermal layer and high nerve concentration.',
        tip: 'Fully extend arm; use light hand weight and 3RL/5RL needles to prevent ink spread.'
    },
    'knee-ditch': {
        muscle: 'Popliteal Fossa & Hamstring Tendons',
        badge: 'Extreme Blowout & Healing Risk',
        badgeColor: '#ef4444',
        detail: 'Soft, highly mobile skin fold behind knee joint. Sensitive nerve region.',
        tip: 'Support leg with knee bolster; advise client on strict minimal bending aftercare.'
    }
};

function updateAnatomicalCallout(locationKey) {
    const nameEl = document.getElementById('muscle-name-display');
    const badgeEl = document.getElementById('muscle-stretch-badge');
    const detailEl = document.getElementById('muscle-detail-display');
    const tipEl = document.getElementById('muscle-tip-display');

    const data = ANATOMICAL_LOCATION_DATA[locationKey] || ANATOMICAL_LOCATION_DATA['outer-upper-arm'];

    if (nameEl) nameEl.textContent = TP("x.muscle_group", "🦾 Muscle Group: {0}", data.muscle);
    if (badgeEl) {
        badgeEl.textContent = data.badge;
        badgeEl.style.backgroundColor = `${data.badgeColor}25`;
        badgeEl.style.color = data.badgeColor;
    }
    if (detailEl) {
        detailEl.innerHTML = TP("x.skin_tension_2", "<strong>Skin Tension:</strong> {0}", data.detail);
    }
    if (tipEl) {
        tipEl.innerHTML = TP("x.ergonomic_tip_2", "💡 <strong>Ergonomic Tip:</strong> {0}", data.tip);
    }
}

function initializeInteractiveBodyMap() {
    const bodyMapSvg = document.getElementById('interactive-body-map-svg');
    const locationSelect = document.getElementById('body-location');
    const tagEl = document.getElementById('body-map-selection-tag');

    if (!bodyMapSvg || !locationSelect) return;

    const groupEls = bodyMapSvg.querySelectorAll('.body-part-group');

    groupEls.forEach(group => {
        group.addEventListener('click', function() {
            const targetLoc = this.getAttribute('data-location');
            if (!targetLoc) return;

            // Highlight selected group in SVG
            groupEls.forEach(g => g.classList.remove('body-part--selected'));
            this.classList.add('body-part--selected');

            // Sync with select element
            locationSelect.value = targetLoc;

            // Update label
            if (tagEl) {
                const selectedOption = locationSelect.options[locationSelect.selectedIndex];
                tagEl.textContent = 'Selected: ' + (selectedOption ? selectedOption.textContent : targetLoc);
            }

            // Update anatomical callout box
            updateAnatomicalCallout(targetLoc);

            // Trigger change event on select to auto update calculations
            locationSelect.dispatchEvent(new Event('change'));
        });
    });

    // Also sync SVG when select element changes directly
    locationSelect.addEventListener('change', function() {
        const selectedVal = this.value;
        groupEls.forEach(g => {
            if (g.getAttribute('data-location') === selectedVal) {
                g.classList.add('body-part--selected');
            } else {
                g.classList.remove('body-part--selected');
            }
        });

        if (tagEl) {
            const selectedOption = locationSelect.options[locationSelect.selectedIndex];
            tagEl.textContent = 'Selected: ' + (selectedOption ? selectedOption.textContent : selectedVal);
        }

        updateAnatomicalCallout(selectedVal);
    });

    // Initial sync
    if (locationSelect.value) {
        updateAnatomicalCallout(locationSelect.value);
    }
}


/* ═══════════════════════════════════════════════════════════
   FEATURE 3: SESSION SUMMARY MODAL (ACTUAL VS ESTIMATED)
   ═══════════════════════════════════════════════════════════ */

let currentSummaryTag = 'accurate';

function initializeSessionSummaryModal() {
    const finishBtn = document.getElementById('timer-finish-btn');
    const modalEl = document.getElementById('session-summary-modal');
    const overlayEl = document.getElementById('session-summary-overlay');
    const closeBtn = document.getElementById('session-summary-close');
    const tagAccurateBtn = document.getElementById('modal-tag-accurate-btn');
    const tagOutlierBtn = document.getElementById('modal-tag-outlier-btn');
    const saveBtn = document.getElementById('modal-save-summary-btn');

    if (!modalEl) return;

    if (finishBtn) {
        finishBtn.addEventListener('click', openSessionSummaryModal);
    }

    if (overlayEl) overlayEl.addEventListener('click', closeSessionSummaryModal);
    if (closeBtn) closeBtn.addEventListener('click', closeSessionSummaryModal);

    if (tagAccurateBtn && tagOutlierBtn) {
        tagAccurateBtn.addEventListener('click', function() {
            currentSummaryTag = 'accurate';
            tagAccurateBtn.style.background = 'rgba(16, 185, 129, 0.25)';
            tagAccurateBtn.style.borderColor = '#10b981';
            tagOutlierBtn.style.background = 'rgba(239, 68, 68, 0.15)';
            tagOutlierBtn.style.borderColor = 'transparent';
        });

        tagOutlierBtn.addEventListener('click', function() {
            currentSummaryTag = 'outlier';
            tagOutlierBtn.style.background = 'rgba(239, 68, 68, 0.25)';
            tagOutlierBtn.style.borderColor = '#ef4444';
            tagAccurateBtn.style.background = 'rgba(16, 185, 129, 0.15)';
            tagAccurateBtn.style.borderColor = 'transparent';
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const notes = document.getElementById('modal-summary-notes')?.value || '';
            const estTimeText = document.getElementById('modal-summary-estimated-time')?.textContent || '0.0 hrs';
            const actTimeText = document.getElementById('modal-summary-actual-time')?.textContent || '0.0 hrs';
            const varianceText = document.getElementById('modal-summary-time-variance')?.textContent || '0%';

            saveRecentCalculation(
                'completed_session',
                '🏁 Completed Tattoo Session',
                `Actual: ${actTimeText} (Est: ${estTimeText}) | Tag: ${currentSummaryTag.toUpperCase()}`,
                `Variance: ${varianceText} | Notes: ${notes.substring(0, 40) || 'None'}`
            );

            alert('✅ Tattoo session summary record saved to history!');
            closeSessionSummaryModal();
        });
    }
}

function openSessionSummaryModal() {
    const modalEl = document.getElementById('session-summary-modal');
    if (!modalEl) return;

    let actualSeconds = 0;
    if (typeof sessionTimerState !== 'undefined') {
        actualSeconds = sessionTimerState.elapsedSeconds || 0;
    }

    const actualHours = actualSeconds > 0 ? (actualSeconds / 3600) : 3.8;
    const estText = document.getElementById('session-total-time')?.textContent || '4.0 hrs';
    const estHours = parseFloat(estText) || 4.0;

    const variancePct = estHours > 0 ? (((actualHours - estHours) / estHours) * 100) : 0;

    const estEl = document.getElementById('modal-summary-estimated-time');
    const actEl = document.getElementById('modal-summary-actual-time');
    const varEl = document.getElementById('modal-summary-time-variance');
    const breakEl = document.getElementById('modal-summary-breaks');

    if (estEl) estEl.textContent = estHours.toFixed(1) + ' hrs';
    if (actEl) actEl.textContent = actualHours.toFixed(1) + ' hrs';
    if (varEl) {
        const sign = variancePct > 0 ? '+' : '';
        const statusLabel = variancePct > 5 ? '(Over Estimate)' : variancePct < -5 ? '(Finished Faster)' : '(On Target)';
        varEl.textContent = `${sign}${variancePct.toFixed(1)}% ${statusLabel}`;
        varEl.style.color = Math.abs(variancePct) <= 10 ? '#10b981' : '#ef4444';
    }

    if (breakEl) {
        const breakCount = (typeof sessionTimerState !== 'undefined') ? sessionTimerState.breakCount : 1;
        breakEl.textContent = TP("x.break_s_logged", "{0} break(s) logged", breakCount);
    }

    modalEl.style.display = 'flex';
}

function closeSessionSummaryModal() {
    const modalEl = document.getElementById('session-summary-modal');
    if (modalEl) modalEl.style.display = 'none';
}


/* ═══════════════════════════════════════════════════════════
   FEATURE 4: INK INVENTORY PLANNER, STUDIO BOTTLES & USAGE TELEMETRY
   ═══════════════════════════════════════════════════════════ */

const INVENTORY_STORAGE_KEY = 'tattoo_inventory_appointments_v1';
const INVENTORY_STOCK_KEY = 'tattoo_inventory_stock_levels_v1';
const INVENTORY_MIN_THRESHOLD_KEY = 'tattoo_inventory_min_threshold_v1';
const INVENTORY_STUDIO_BOTTLES_KEY = 'tattoo_inventory_studio_bottles_v1';

/* ── Browser Toast Notification Subsystem ── */
function showToast({ type = 'info', title = 'Notification', message = '', actionLabel = null, onAction = null, duration = 5000 }) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'coverage__toast-container';
        document.body.appendChild(container);
    }

    const toastId = 'toast_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const toast = document.createElement('div');
    toast.id = toastId;
    const toastTypeClass = (type === 'low-stock' || type === 'error') 
        ? 'coverage__toast--error' 
        : (type === 'warning' ? 'coverage__toast--warning' : (type === 'success' ? 'coverage__toast--success' : 'coverage__toast--info'));
    
    toast.className = `coverage__toast ${toastTypeClass}`;
    toast.setAttribute('role', 'alert');

    let icon = 'ℹ️';
    if (type === 'low-stock' || type === 'error') icon = '🚨';
    else if (type === 'warning') icon = '⚠️';
    else if (type === 'success') icon = '✅';

    toast.innerHTML = `
        <div class="coverage__toast-header">
            <span class="coverage__toast-icon">${icon}</span>
            <div class="coverage__toast-title">${title}</div>
            <button type="button" class="coverage__toast-close" title="Dismiss">&times;</button>
        </div>
        <div class="coverage__toast-body">${message}</div>
        ${actionLabel ? `
            <div class="coverage__toast-actions">
                <button type="button" class="coverage__toast-action-btn">${actionLabel}</button>
            </div>
        ` : ''}
        <div class="coverage__toast-progress">
            <div class="coverage__toast-progress-bar"></div>
        </div>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.coverage__toast-close');
    const actionBtn = toast.querySelector('.coverage__toast-action-btn');
    const progressBar = toast.querySelector('.coverage__toast-progress-bar');

    let isDismissed = false;
    function dismissToast() {
        if (isDismissed) return;
        isDismissed = true;
        toast.classList.add('coverage__toast--closing');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 320);
    }

    if (closeBtn) closeBtn.addEventListener('click', dismissToast);

    if (actionBtn && onAction) {
        actionBtn.addEventListener('click', () => {
            try {
                onAction();
            } catch (err) {
                console.error(err);
            }
            dismissToast();
        });
    }

    if (progressBar && duration > 0) {
        progressBar.style.transition = `width ${duration}ms linear`;
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 40);
    }

    if (duration > 0) {
        setTimeout(dismissToast, duration);
    }

    return toast;
}

function triggerLowStockToast(bottle, minThreshold) {
    showToast({
        type: 'low-stock',
        title: `Low Stock Alert: ${bottle.name}`,
        message: `Current volume (${bottle.currentMl} mL) has dropped below your studio minimum threshold (${minThreshold} mL). Consider restocking ${bottle.brand} immediately.`,
        actionLabel: '📦 View Reorder Manifest',
        onAction: () => {
            const tab = document.querySelector('[data-tab="inventory"]');
            if (tab) tab.click();
        },
        duration: 7000
    });
}

function triggerTestStockAlertToast() {
    const minThreshold = getStudioMinThreshold();
    const bottles = getStudioBottles();
    const lowBottle = bottles.find(b => b.currentMl < minThreshold) || bottles[0];
    
    showToast({
        type: 'low-stock',
        title: `Low Stock Alert: ${lowBottle ? lowBottle.name : 'World Famous Pitch Black'}`,
        message: `Simulated Alert: Current volume (${lowBottle ? lowBottle.currentMl : 14} mL) is below your studio threshold of ${minThreshold} mL. Restock required!`,
        actionLabel: '📋 Open Inventory Matrix',
        onAction: () => {
            const tab = document.querySelector('[data-tab="inventory"]');
            if (tab) tab.click();
        },
        duration: 6000
    });
}

/* ── Search Filter for Ink Brand Dropdowns ── */
function setupSearchableSelect(searchInputId, selectId, countBadgeId, clearBtnId, countTextId) {
    const searchInput = document.getElementById(searchInputId);
    const select = document.getElementById(selectId);
    const badge = document.getElementById(countBadgeId);
    const clearBtn = document.getElementById(clearBtnId);
    const countText = document.getElementById(countTextId);

    if (!searchInput || !select) return;

    function filterOptions() {
        const query = searchInput.value.toLowerCase().trim();
        let matchCount = 0;
        let firstMatchOption = null;

        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? 'block' : 'none';
        }

        const optgroups = select.querySelectorAll('optgroup');
        if (optgroups.length > 0) {
            optgroups.forEach(group => {
                let groupHasVisible = false;
                const options = group.querySelectorAll('option');
                options.forEach(opt => {
                    const text = opt.textContent.toLowerCase();
                    const val = opt.value.toLowerCase();
                    const groupLabel = group.label.toLowerCase();
                    const matches = query === '' || text.includes(query) || val.includes(query) || groupLabel.includes(query);
                    if (matches) {
                        opt.style.display = '';
                        matchCount++;
                        groupHasVisible = true;
                        if (!firstMatchOption) firstMatchOption = opt;
                    } else {
                        opt.style.display = 'none';
                    }
                });
                group.style.display = groupHasVisible ? '' : 'none';
            });
        } else {
            const options = select.querySelectorAll('option');
            options.forEach(opt => {
                const text = opt.textContent.toLowerCase();
                const val = opt.value.toLowerCase();
                const matches = query === '' || text.includes(query) || val.includes(query);
                if (matches) {
                    opt.style.display = '';
                    matchCount++;
                    if (!firstMatchOption) firstMatchOption = opt;
                } else {
                    opt.style.display = 'none';
                }
            });
        }

        if (badge && countText) {
            if (query.length > 0) {
                badge.style.display = 'flex';
                countText.textContent = TP("x.matching_ink", "{0} matching ink{1}", matchCount, matchCount === 1 ? '' : 's');
            } else {
                badge.style.display = 'none';
            }
        }

        return firstMatchOption;
    }

    searchInput.addEventListener('input', filterOptions);

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstMatch = filterOptions();
            if (firstMatch) {
                select.value = firstMatch.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                showToast({
                    type: 'info',
                    title: 'Brand Selected',
                    message: TP("x.selected", "Selected \"{0}\"", firstMatch.textContent),
                    duration: 2500
                });
            }
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            filterOptions();
            searchInput.focus();
        });
    }
}

/* ── Stock Persistence and Thresholds ── */
function getStudioStockLevels() {
    try {
        const raw = localStorage.getItem(INVENTORY_STOCK_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error(e);
    }
    return { blackMl: 60, colorMl: 35 };
}

function saveStudioStockLevels(stock) {
    localStorage.setItem(INVENTORY_STOCK_KEY, JSON.stringify(stock));
}

function getStudioMinThreshold() {
    try {
        const val = localStorage.getItem(INVENTORY_MIN_THRESHOLD_KEY);
        if (val !== null) return Math.max(1, parseFloat(val) || 20);
    } catch (e) {
        console.error(e);
    }
    return 20;
}

function saveStudioMinThreshold(val) {
    localStorage.setItem(INVENTORY_MIN_THRESHOLD_KEY, val.toString());
}

function getStudioBottles() {
    try {
        const raw = localStorage.getItem(INVENTORY_STUDIO_BOTTLES_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error(e);
    }

    return [
        { id: 'bot_1', name: 'Pitch Black (Lining)', brand: 'World Famous', category: 'black', currentMl: 14, capacityMl: 120, hex: '#111827' },
        { id: 'bot_2', name: 'Straight Dark Greywash', brand: 'World Famous', category: 'black', currentMl: 18, capacityMl: 120, hex: '#4b5563' },
        { id: 'bot_3', name: 'Master Dark Red', brand: 'World Famous', category: 'color', currentMl: 28, capacityMl: 30, hex: '#dc2626' },
        { id: 'bot_4', name: 'Hoover Dam Blue', brand: 'World Famous', category: 'color', currentMl: 12, capacityMl: 30, hex: '#2563eb' },
        { id: 'bot_5', name: 'Sunshine Yellow', brand: 'World Famous', category: 'color', currentMl: 24, capacityMl: 30, hex: '#eab308' },
        { id: 'bot_6', name: 'White House White', brand: 'World Famous', category: 'white', currentMl: 90, capacityMl: 120, hex: '#f3f4f6' },
        { id: 'bot_7', name: 'Dynamic Triple Black', brand: 'Dynamic Color', category: 'black', currentMl: 160, capacityMl: 240, hex: '#000000' }
    ];
}

function saveStudioBottles(bottles) {
    localStorage.setItem(INVENTORY_STUDIO_BOTTLES_KEY, JSON.stringify(bottles));
}

function adjustStudioBottleStock(id, deltaMl) {
    const minThreshold = getStudioMinThreshold();
    const bottles = getStudioBottles();
    const bottle = bottles.find(b => b.id === id);
    if (!bottle) return;

    const previousMl = bottle.currentMl;
    bottle.currentMl = Math.max(0, Math.min(bottle.capacityMl, bottle.currentMl + deltaMl));
    saveStudioBottles(bottles);

    // Sync studio aggregate stock
    syncStudioStockFromBottles(bottles);

    // Check if threshold breached downward
    if (previousMl >= minThreshold && bottle.currentMl < minThreshold) {
        triggerLowStockToast(bottle, minThreshold);
    }

    renderStudioBottlesTable();
    renderInventoryPlanner();
    renderDashboardStockAlertCenter();
}

function restockStudioBottle(id) {
    const bottles = getStudioBottles();
    const bottle = bottles.find(b => b.id === id);
    if (!bottle) return;

    bottle.currentMl = bottle.capacityMl;
    saveStudioBottles(bottles);

    syncStudioStockFromBottles(bottles);

    showToast({
        type: 'success',
        title: 'Restocked Bottle',
        message: `${bottle.name} (${bottle.brand}) is now full at ${bottle.capacityMl} mL.`,
        duration: 3500
    });

    renderStudioBottlesTable();
    renderInventoryPlanner();
    renderDashboardStockAlertCenter();
}

function syncStudioStockFromBottles(bottles) {
    let blackMl = 0;
    let colorMl = 0;
    bottles.forEach(b => {
        if (b.category === 'black') blackMl += b.currentMl;
        else colorMl += b.currentMl;
    });

    const stock = { blackMl, colorMl };
    saveStudioStockLevels(stock);

    const blackInput = document.getElementById('stock-black-ml');
    const colorInput = document.getElementById('stock-color-ml');
    if (blackInput) blackInput.value = blackMl;
    if (colorInput) colorInput.value = colorMl;
}

function renderStudioBottlesTable() {
    const container = document.getElementById('studio-bottles-container');
    const lowCountEl = document.getElementById('studio-bottles-low-count');
    if (!container) return;

    const minThreshold = getStudioMinThreshold();
    const bottles = getStudioBottles();
    const lowBottles = bottles.filter(b => b.currentMl < minThreshold);

    if (lowCountEl) {
        lowCountEl.textContent = TP("x.bottle_low_ml", "{0} Bottle{1} Low (< {2} mL)", lowBottles.length, lowBottles.length === 1 ? '' : 's', minThreshold);
        lowCountEl.style.color = lowBottles.length > 0 ? '#ef4444' : '#10b981';
    }

    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
                <tr style="border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary); background: rgba(0,0,0,0.2);">
                    <th style="padding: 0.5rem 0.6rem;">Bottle / Brand</th>
                    <th style="padding: 0.5rem 0.6rem;">Stock Level</th>
                    <th style="padding: 0.5rem 0.6rem;">Status</th>
                    <th style="padding: 0.5rem 0.6rem; text-align: right;">Quick Adjust</th>
                </tr>
            </thead>
            <tbody>
                ${bottles.map(b => {
                    const isLow = b.currentMl < minThreshold;
                    const pct = Math.round((b.currentMl / b.capacityMl) * 100);
                    return `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); background: ${isLow ? 'rgba(239,68,68,0.08)' : 'transparent'};">
                            <td style="padding: 0.5rem 0.6rem;">
                                <div style="display: flex; align-items: center; gap: 0.4rem;">
                                    <span style="width: 10px; height: 10px; border-radius: 50%; background: ${b.hex}; border: 1px solid rgba(255,255,255,0.3); display: inline-block;"></span>
                                    <div>
                                        <div style="font-weight: 700; color: var(--color-text-primary);">${b.name}</div>
                                        <div style="font-size: 0.7rem; color: var(--color-text-secondary);">${b.brand} (${b.capacityMl} mL)</div>
                                    </div>
                                </div>
                            </td>
                            <td style="padding: 0.5rem 0.6rem;">
                                <div style="font-weight: 800; color: ${isLow ? '#ef4444' : '#ffffff'}; font-size: 0.88rem;">
                                    ${b.currentMl} mL
                                </div>
                                <div style="width: 70px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 2px;">
                                    <div style="width: ${pct}%; height: 100%; background: ${isLow ? '#ef4444' : '#10b981'};"></div>
                                </div>
                            </td>
                            <td style="padding: 0.5rem 0.6rem;">
                                ${isLow 
                                    ? `<span style="font-size: 0.7rem; font-weight: 800; color: #ef4444; background: rgba(239,68,68,0.2); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.4); white-space: nowrap;">⚠️ LOW (< ${minThreshold}mL)</span>` 
                                    : `<span style="font-size: 0.7rem; font-weight: 700; color: #10b981; background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">✓ OK</span>`}
                            </td>
                            <td style="padding: 0.5rem 0.6rem; text-align: right; white-space: nowrap;">
                                <button type="button" onclick="adjustStudioBottleStock('${b.id}', -5)" style="background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); border-radius: 4px; padding: 2px 6px; font-size: 0.72rem; cursor: pointer; margin-right: 2px;" title="Use 5 mL">-5</button>
                                <button type="button" onclick="adjustStudioBottleStock('${b.id}', 10)" style="background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); border-radius: 4px; padding: 2px 6px; font-size: 0.72rem; cursor: pointer; margin-right: 2px;" title="Add 10 mL">+10</button>
                                <button type="button" onclick="restockStudioBottle('${b.id}')" style="background: rgba(6,147,227,0.15); color: #38bdf8; border: 1px solid rgba(6,147,227,0.3); border-radius: 4px; padding: 2px 6px; font-size: 0.72rem; cursor: pointer;" title="Refill to capacity">Fill</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function parseTimeToDecimalHours(timeStr) {
    if (!timeStr) return 10.0;
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return hours + (minutes / 60);
}

function formatDecimalHoursToTime(decimalHours) {
    let hrs = Math.floor(decimalHours);
    let mins = Math.round((decimalHours - hrs) * 60);
    if (mins >= 60) {
        hrs += 1;
        mins = 0;
    }
    const period = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const displayMins = mins < 10 ? '0' + mins : mins;
    return `${displayHrs}:${displayMins} ${period}`;
}

function checkAppointmentConflicts(appointments) {
    const conflicts = new Map(); // id -> array of conflicting appointment summaries
    
    for (let i = 0; i < appointments.length; i++) {
        const a = appointments[i];
        if (!a.date) continue;
        const startA = parseTimeToDecimalHours(a.startTime || '10:00');
        const durationA = parseFloat(a.duration) || 3.5;
        const endA = startA + durationA;

        for (let j = i + 1; j < appointments.length; j++) {
            const b = appointments[j];
            if (!b.date || a.date !== b.date) continue;

            const startB = parseTimeToDecimalHours(b.startTime || '10:00');
            const durationB = parseFloat(b.duration) || 3.5;
            const endB = startB + durationB;

            // Check if time ranges overlap
            if (startA < endB && startB < endA) {
                const confA = conflicts.get(a.id) || [];
                confA.push({
                    client: b.client,
                    timeRange: `${b.startTime || '10:00'} - ${formatDecimalHoursToTime(endB)}`
                });
                confconflictsSet(conflicts, a.id, confA);

                const confB = conflicts.get(b.id) || [];
                confB.push({
                    client: a.client,
                    timeRange: `${a.startTime || '10:00'} - ${formatDecimalHoursToTime(endA)}`
                });
                confconflictsSet(conflicts, b.id, confB);
            }
        }
    }
    return conflicts;
}

function confconflictsSet(map, key, val) {
    map.set(key, val);
}

/* ── Historical Pigment Usage Telemetry & Recharts Engine ── */
const HISTORICAL_PIGMENT_DATA = [
    { month: 'Mar', monthFull: 'March', pitchBlack: 185, greywash: 120, darkRed: 65, hooverBlue: 45, sunshineYellow: 30, whiteHouse: 50 },
    { month: 'Apr', monthFull: 'April', pitchBlack: 210, greywash: 140, darkRed: 80, hooverBlue: 55, sunshineYellow: 40, whiteHouse: 60 },
    { month: 'May', monthFull: 'May', pitchBlack: 240, greywash: 160, darkRed: 95, hooverBlue: 60, sunshineYellow: 35, whiteHouse: 70 },
    { month: 'Jun', monthFull: 'June', pitchBlack: 220, greywash: 155, darkRed: 85, hooverBlue: 75, sunshineYellow: 50, whiteHouse: 80 },
    { month: 'Jul', monthFull: 'July', pitchBlack: 280, greywash: 190, darkRed: 110, hooverBlue: 80, sunshineYellow: 60, whiteHouse: 95 },
    { month: 'Aug', monthFull: 'August', pitchBlack: 310, greywash: 210, darkRed: 130, hooverBlue: 95, sunshineYellow: 65, whiteHouse: 105 }
];

let activePigmentFilter = 'all';

/* ── Ink Waste vs. Consumption Telemetry Engine (Chart.js) ── */
const INK_WASTE_MONTHLY_DATA = [
    { month: 'Mar', blacksConsumed: 185, blacksWaste: 38, colorsConsumed: 140, colorsWaste: 48, whitesConsumed: 50, whitesWaste: 15 },
    { month: 'Apr', blacksConsumed: 210, blacksWaste: 42, colorsConsumed: 175, colorsWaste: 58, whitesConsumed: 60, whitesWaste: 18 },
    { month: 'May', blacksConsumed: 240, blacksWaste: 48, colorsConsumed: 190, colorsWaste: 65, whitesConsumed: 70, whitesWaste: 20 },
    { month: 'Jun', blacksConsumed: 220, blacksWaste: 44, colorsConsumed: 210, colorsWaste: 72, whitesConsumed: 80, whitesWaste: 22 },
    { month: 'Jul', blacksConsumed: 280, blacksWaste: 56, colorsConsumed: 250, colorsWaste: 85, whitesConsumed: 95, whitesWaste: 26 },
    { month: 'Aug', blacksConsumed: 310, blacksWaste: 62, colorsConsumed: 290, colorsWaste: 98, whitesConsumed: 105, whitesWaste: 30 }
];

let inventoryWasteChart = null;
let activeWasteFamily = 'all';

function renderInventoryWasteChart(family = 'all') {
    activeWasteFamily = family;
    const canvas = document.getElementById('inventory-waste-consumption-chart');
    if (!canvas) return;

    if (inventoryWasteChart) {
        inventoryWasteChart.destroy();
        inventoryWasteChart = null;
    }

    const labels = INK_WASTE_MONTHLY_DATA.map(d => d.month);
    const consumedSeries = [];
    const wasteSeries = [];

    let totalConsumed = 0;
    let totalWaste = 0;

    INK_WASTE_MONTHLY_DATA.forEach(d => {
        let c = 0;
        let w = 0;
        if (family === 'all' || family === 'blacks') {
            c += d.blacksConsumed;
            w += d.blacksWaste;
        }
        if (family === 'all' || family === 'colors') {
            c += d.colorsConsumed;
            w += d.colorsWaste;
        }
        if (family === 'all' || family === 'whites') {
            c += d.whitesConsumed;
            w += d.whitesWaste;
        }
        consumedSeries.push(c);
        wasteSeries.push(w);
        totalConsumed += c;
        totalWaste += w;
    });

    const totalPoured = totalConsumed + totalWaste;
    const avgWasteRatio = totalPoured > 0 ? ((totalWaste / totalPoured) * 100).toFixed(1) : '0.0';

    // Update Stat Cards
    const totalConsumedEl = document.getElementById('waste-total-consumed');
    const totalDiscardEl = document.getElementById('waste-total-discard');
    const avgRatioEl = document.getElementById('waste-avg-ratio');
    const highestLineEl = document.getElementById('waste-highest-line');

    if (totalConsumedEl) totalConsumedEl.textContent = `${totalConsumed} mL`;
    if (totalDiscardEl) totalDiscardEl.textContent = `${totalWaste} mL`;
    if (avgRatioEl) avgRatioEl.textContent = `${avgWasteRatio}%`;

    // Calculate waste ratios for all individual lines to find highest
    let blacksC = 0, blacksW = 0;
    let colorsC = 0, colorsW = 0;
    let whitesC = 0, whitesW = 0;

    INK_WASTE_MONTHLY_DATA.forEach(d => {
        blacksC += d.blacksConsumed; blacksW += d.blacksWaste;
        colorsC += d.colorsConsumed; colorsW += d.colorsWaste;
        whitesC += d.whitesConsumed; whitesW += d.whitesWaste;
    });

    const blacksRatio = ((blacksW / (blacksC + blacksW)) * 100).toFixed(1);
    const colorsRatio = ((colorsW / (colorsC + colorsW)) * 100).toFixed(1);
    const whitesRatio = ((whitesW / (whitesC + whitesW)) * 100).toFixed(1);

    if (highestLineEl) {
        highestLineEl.textContent = TP("x.vivid_colors", "Vivid Colors ({0}%)", colorsRatio);
    }

    // Render Ratio Matrix Chips
    const matrixEl = document.getElementById('waste-ratio-matrix');
    if (matrixEl) {
        matrixEl.innerHTML = `
            <div style="background: rgba(6, 147, 227, 0.08); border: 1px solid rgba(6, 147, 227, 0.25); border-radius: 8px; padding: 0.6rem 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: #38bdf8; font-size: 0.85rem;">● Lining Blacks & Greys</span>
                    <span style="font-weight: 800; color: #ffffff; font-size: 0.85rem;">${blacksRatio}% Waste</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--color-text-secondary);">
                    Consumed: ${blacksC} mL | In-Cap Waste: ${blacksW} mL • Highly Efficient
                </div>
            </div>
            <div style="background: rgba(255, 0, 110, 0.08); border: 1px solid rgba(255, 0, 110, 0.25); border-radius: 8px; padding: 0.6rem 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: var(--color-neon-pink, #ff006e); font-size: 0.85rem;">● Vivid Color Packing</span>
                    <span style="font-weight: 800; color: #ef4444; font-size: 0.85rem;">${colorsRatio}% Waste ⚠️</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--color-text-secondary);">
                    Consumed: ${colorsC} mL | In-Cap Waste: ${colorsW} mL • Highest ratio; switch to small micro-caps
                </div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 0.6rem 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <span style="font-weight: 700; color: #ffffff; font-size: 0.85rem;">● Whites & Highlights</span>
                    <span style="font-weight: 800; color: #fbbf24; font-size: 0.85rem;">${whitesRatio}% Waste</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--color-text-secondary);">
                    Consumed: ${whitesC} mL | In-Cap Waste: ${whitesW} mL • Moderate drying residue
                </div>
            </div>
        `;
    }

    if (typeof Chart === 'undefined') return;

    inventoryWasteChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Net Dermal Consumed (mL)',
                    data: consumedSeries,
                    backgroundColor: '#0693e3',
                    borderColor: '#0693e3',
                    borderRadius: 4,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                },
                {
                    label: 'In-Cap Waste & Residue (mL)',
                    data: wasteSeries,
                    backgroundColor: 'rgba(255, 0, 110, 0.85)',
                    borderColor: '#ff006e',
                    borderRadius: 4,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#d1d5db',
                        font: { size: 11, weight: 'bold' }
                    }
                },
                tooltip: {
                    backgroundColor: '#16213e',
                    borderColor: '#0693e3',
                    borderWidth: 1,
                    titleColor: '#38bdf8',
                    bodyColor: '#ffffff',
                    callbacks: {
                        afterBody: function(items) {
                            const c = items.find(i => i.datasetIndex === 0)?.raw || 0;
                            const w = items.find(i => i.datasetIndex === 1)?.raw || 0;
                            const r = (c + w) > 0 ? ((w / (c + w)) * 100).toFixed(1) : 0;
                            return `\nMonthly Waste Ratio: ${r}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca3af', font: { size: 11 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: { color: '#9ca3af', font: { size: 11 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    title: {
                        display: true,
                        text: 'Volume (mL)',
                        color: '#9ca3af',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

function renderHistoricalPigmentUsageChart(family = 'all') {
    activePigmentFilter = family;
    const rootEl = document.getElementById('historical-usage-recharts-root');
    if (!rootEl) return;

    // Check if React, ReactDOM, and Recharts exist in window
    if (window.React && window.ReactDOM && window.Recharts) {
        try {
            const React = window.React;
            const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = window.Recharts;

            // Custom Tooltip component
            const CustomTooltip = ({ active, payload, label }) => {
                if (active && payload && payload.length) {
                    const row = HISTORICAL_PIGMENT_DATA.find(d => d.month === label);
                    const totalMonth = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
                    return React.createElement('div', {
                        style: {
                            backgroundColor: '#16213e',
                            border: '1px solid #0693e3',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            minWidth: '200px'
                        }
                    }, [
                        React.createElement('div', { key: 'head', style: { fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '6px', color: '#38bdf8' } }, `📅 ${row ? row.monthFull : label} Usage Total: ${totalMonth} mL`),
                        ...payload.map((entry, idx) => 
                            React.createElement('div', { key: idx, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0' } }, [
                                React.createElement('span', { key: 'name', style: { color: entry.color, fontWeight: 600 } }, `● ${entry.name}:`),
                                React.createElement('span', { key: 'val', style: { fontWeight: 800, color: '#ffffff' } }, `${entry.value} mL`)
                            ])
                        )
                    ]);
                }
                return null;
            };

            const lines = [];
            if (family === 'all' || family === 'blacks') {
                lines.push(React.createElement(Line, { key: 'pb', type: 'monotone', dataKey: 'pitchBlack', name: 'Pitch Black (Lining)', stroke: '#38bdf8', strokeWidth: 3, dot: { r: 4, fill: '#38bdf8' }, activeDot: { r: 7 } }));
                lines.push(React.createElement(Line, { key: 'gw', type: 'monotone', dataKey: 'greywash', name: 'Straight Dark Greywash', stroke: '#c084fc', strokeWidth: 2.5, strokeDasharray: '4 4', dot: { r: 4, fill: '#c084fc' }, activeDot: { r: 7 } }));
            }
            if (family === 'all' || family === 'colors') {
                lines.push(React.createElement(Line, { key: 'dr', type: 'monotone', dataKey: 'darkRed', name: 'Master Dark Red', stroke: '#ff006e', strokeWidth: 2.5, dot: { r: 4, fill: '#ff006e' }, activeDot: { r: 7 } }));
                lines.push(React.createElement(Line, { key: 'hb', type: 'monotone', dataKey: 'hooverBlue', name: 'Hoover Dam Blue', stroke: '#3b82f6', strokeWidth: 2.5, dot: { r: 4, fill: '#3b82f6' }, activeDot: { r: 7 } }));
                lines.push(React.createElement(Line, { key: 'sy', type: 'monotone', dataKey: 'sunshineYellow', name: 'Sunshine Yellow', stroke: '#fbbf24', strokeWidth: 2.5, dot: { r: 4, fill: '#fbbf24' }, activeDot: { r: 7 } }));
            }
            if (family === 'all' || family === 'whites') {
                lines.push(React.createElement(Line, { key: 'wh', type: 'monotone', dataKey: 'whiteHouse', name: 'White House White', stroke: '#f3f4f6', strokeWidth: 2.5, dot: { r: 4, fill: '#ffffff' }, activeDot: { r: 7 } }));
            }

            const chartElement = React.createElement(ResponsiveContainer, { width: '100%', height: 320 },
                React.createElement(LineChart, { data: HISTORICAL_PIGMENT_DATA, margin: { top: 15, right: 25, left: -10, bottom: 5 } }, [
                    React.createElement(CartesianGrid, { key: 'grid', strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.08)' }),
                    React.createElement(XAxis, { key: 'x', dataKey: 'month', stroke: 'rgba(255,255,255,0.5)', tick: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 } }),
                    React.createElement(YAxis, { key: 'y', stroke: 'rgba(255,255,255,0.5)', tick: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 }, unit: ' mL' }),
                    React.createElement(Tooltip, { key: 'tip', content: React.createElement(CustomTooltip) }),
                    React.createElement(Legend, { key: 'leg', wrapperStyle: { paddingTop: '10px', fontSize: '0.8rem' } }),
                    ...lines
                ])
            );

            if (window.ReactDOM.createRoot) {
                if (!window._rechartsRoot) {
                    window._rechartsRoot = window.ReactDOM.createRoot(rootEl);
                }
                window._rechartsRoot.render(chartElement);
            } else if (window.ReactDOM.render) {
                window.ReactDOM.render(chartElement, rootEl);
            }
            return;
        } catch (e) {
            console.warn('Recharts render failed, falling back to SVG renderer:', e);
        }
    }

    // High-Fidelity SVG Fallback Renderer
    renderSvgHistoricalChartFallback(rootEl, family);
}

function renderSvgHistoricalChartFallback(rootEl, family) {
    const data = HISTORICAL_PIGMENT_DATA;
    const maxVal = 350;
    const width = rootEl.clientWidth || 700;
    const height = 300;
    const padX = 55;
    const padY = 30;
    const chartW = width - padX - 30;
    const chartH = height - padY - 40;

    const seriesList = [];
    if (family === 'all' || family === 'blacks') {
        seriesList.push({ key: 'pitchBlack', name: 'Pitch Black (Lining)', color: '#38bdf8' });
        seriesList.push({ key: 'greywash', name: 'Straight Dark Greywash', color: '#c084fc' });
    }
    if (family === 'all' || family === 'colors') {
        seriesList.push({ key: 'darkRed', name: 'Master Dark Red', color: '#ff006e' });
        seriesList.push({ key: 'hooverBlue', name: 'Hoover Dam Blue', color: '#3b82f6' });
        seriesList.push({ key: 'sunshineYellow', name: 'Sunshine Yellow', color: '#fbbf24' });
    }
    if (family === 'all' || family === 'whites') {
        seriesList.push({ key: 'whiteHouse', name: 'White House White', color: '#ffffff' });
    }

    const xCoords = data.map((d, i) => padX + (i / (data.length - 1)) * chartW);
    const getY = val => padY + chartH - (val / maxVal) * chartH;

    let pathsHtml = '';
    seriesList.forEach(s => {
        const points = data.map((d, i) => `${xCoords[i]},${getY(d[s.key])}`).join(' ');
        pathsHtml += `
            <polyline fill="none" stroke="${s.color}" stroke-width="2.5" points="${points}" />
            ${data.map((d, i) => `<circle cx="${xCoords[i]}" cy="${getY(d[s.key])}" r="4" fill="${s.color}" />`).join('')}
        `;
    });

    rootEl.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: ${height}px; font-family: inherit;">
            <!-- Grid Lines -->
            ${[0, 100, 200, 300].map(val => `
                <line x1="${padX}" y1="${getY(val)}" x2="${width - 30}" y2="${getY(val)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3 3"/>
                <text x="${padX - 8}" y="${getY(val) + 4}" fill="rgba(255,255,255,0.6)" font-size="11" text-anchor="end">${val} mL</text>
            `).join('')}
            <!-- X Axis Labels -->
            ${data.map((d, i) => `
                <text x="${xCoords[i]}" y="${height - 12}" fill="rgba(255,255,255,0.7)" font-size="12" text-anchor="middle" font-weight="600">${d.month}</text>
            `).join('')}
            <!-- Data Lines -->
            ${pathsHtml}
        </svg>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 0.5rem; font-size: 0.78rem;">
            ${seriesList.map(s => `
                <span style="display: flex; align-items: center; gap: 0.35rem; color: #ffffff;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: ${s.color};"></span>
                    <span>${s.name}</span>
                </span>
            `).join('')}
        </div>
    `;
}

function initializeInkInventoryPlanner() {
    const form = document.getElementById('inventory-appointment-form');
    const clearBtn = document.getElementById('clear-inventory-btn');
    const exportBtn = document.getElementById('export-reorder-btn');
    const stockBlackInput = document.getElementById('stock-black-ml');
    const stockColorInput = document.getElementById('stock-color-ml');
    const minThresholdInput = document.getElementById('inventory-min-threshold');
    const thresholdCurrentLabel = document.getElementById('threshold-current-label');
    const testToastBtn = document.getElementById('test-low-stock-toast-btn');

    // Initialize Search Filter on Tab 3 & Tab 5 Ink Brand Selectors
    setupSearchableSelect('ink-bottle-brand-search', 'ink-bottle-brand', 'ink-bottle-brand-search-badge', 'ink-bottle-brand-search-clear', 'ink-bottle-brand-match-count');
    setupSearchableSelect('appt-ink-brand-search', 'appt-ink-brand', 'appt-ink-brand-search-badge', 'appt-ink-brand-search-clear', 'appt-ink-brand-match-count');

    // Populate initial stock inputs from stored values
    const currentStock = getStudioStockLevels();
    if (stockBlackInput) {
        stockBlackInput.value = currentStock.blackMl;
        stockBlackInput.addEventListener('input', function() {
            const stock = getStudioStockLevels();
            stock.blackMl = parseFloat(stockBlackInput.value) || 0;
            saveStudioStockLevels(stock);
            renderInventoryPlanner();
        });
    }

    if (stockColorInput) {
        stockColorInput.value = currentStock.colorMl;
        stockColorInput.addEventListener('input', function() {
            const stock = getStudioStockLevels();
            stock.colorMl = parseFloat(stockColorInput.value) || 0;
            saveStudioStockLevels(stock);
            renderInventoryPlanner();
        });
    }

    // Configurable Minimum Threshold Listener
    if (minThresholdInput) {
        const storedThreshold = getStudioMinThreshold();
        minThresholdInput.value = storedThreshold;
        if (thresholdCurrentLabel) thresholdCurrentLabel.textContent = `${storedThreshold} mL`;

        minThresholdInput.addEventListener('input', function() {
            const val = Math.max(1, parseFloat(minThresholdInput.value) || 20);
            saveStudioMinThreshold(val);
            if (thresholdCurrentLabel) thresholdCurrentLabel.textContent = `${val} mL`;
            renderStudioBottlesTable();
            renderDashboardStockAlertCenter();
        });
    }

    if (testToastBtn) {
        testToastBtn.addEventListener('click', triggerTestStockAlertToast);
    }

    // Wire Chart Filter Buttons (Historical Usage)
    const filterBtns = document.querySelectorAll('.pigment-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('pigment-filter-btn--active'));
            this.classList.add('pigment-filter-btn--active');
            const family = this.getAttribute('data-family') || 'all';
            renderHistoricalPigmentUsageChart(family);
        });
    });

    // Wire Ink Waste vs Consumption Filter Buttons
    const wasteFilterBtns = document.querySelectorAll('.waste-filter-btn');
    wasteFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            wasteFilterBtns.forEach(b => b.classList.remove('waste-filter-btn--active'));
            this.classList.add('waste-filter-btn--active');
            const family = this.getAttribute('data-waste-family') || 'all';
            renderInventoryWasteChart(family);
        });
    });

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const client = document.getElementById('appt-client').value;
            const date = document.getElementById('appt-date').value;
            const startTime = document.getElementById('appt-start-time') ? document.getElementById('appt-start-time').value : '10:00';
            const duration = parseFloat(document.getElementById('appt-duration') ? document.getElementById('appt-duration').value : 3.5) || 3.5;
            const area = parseFloat(document.getElementById('appt-area').value) || 20;
            const technique = document.getElementById('appt-technique').value;
            const blackMl = parseFloat(document.getElementById('appt-black-ml').value) || 0;
            const colorMl = parseFloat(document.getElementById('appt-color-ml').value) || 0;

            // Conflict pre-check before saving
            const existingAppointments = getInventoryAppointments();
            const startNew = parseTimeToDecimalHours(startTime);
            const endNew = startNew + duration;
            const sameDateConflict = existingAppointments.find(item => {
                if (item.date !== date) return false;
                const startExisting = parseTimeToDecimalHours(item.startTime || '10:00');
                const endExisting = startExisting + (parseFloat(item.duration) || 3.5);
                return startNew < endExisting && startExisting < endNew;
            });

            if (sameDateConflict) {
                const confMsg = `⚠️ SCHEDULE OVERLAP WARNING:\n\nThis session on ${date} (${startTime} for ${duration} hrs) overlaps with existing booking for "${sameDateConflict.client}" (${sameDateConflict.startTime || '10:00'}, ${sameDateConflict.duration || 3.5} hrs).\n\nDo you still want to add this booking?`;
                if (!confirm(confMsg)) {
                    return;
                }
            }

            addInventoryAppointment({
                id: 'appt_' + Date.now(),
                client: client,
                date: date,
                startTime: startTime,
                duration: duration,
                area: area,
                technique: technique,
                blackMl: blackMl,
                colorMl: colorMl
            });

            form.reset();
            if (document.getElementById('appt-start-time')) document.getElementById('appt-start-time').value = '10:00';
            if (document.getElementById('appt-duration')) document.getElementById('appt-duration').value = '3.5';
            if (document.getElementById('appt-area')) document.getElementById('appt-area').value = '25';
            if (document.getElementById('appt-black-ml')) document.getElementById('appt-black-ml').value = '15';
            if (document.getElementById('appt-color-ml')) document.getElementById('appt-color-ml').value = '10';

            showToast({
                type: 'success',
                title: 'Appointment Saved',
                message: `Booking for ${client} (${date}) successfully logged in inventory manifest.`,
                duration: 3500
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Clear all scheduled appointments from inventory planner?')) {
                localStorage.removeItem(INVENTORY_STORAGE_KEY);
                renderInventoryPlanner();
                showToast({
                    type: 'info',
                    title: 'Schedule Reset',
                    message: 'All upcoming appointment bookings have been cleared.',
                    duration: 3000
                });
            }
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportSupplierReorderList);
    }

    // Set default date to today
    const apptDateInput = document.getElementById('appt-date');
    if (apptDateInput && !apptDateInput.value) {
        apptDateInput.value = new Date().toISOString().split('T')[0];
    }

    renderStudioBottlesTable();
    renderInventoryPlanner();
    renderHistoricalPigmentUsageChart('all');
    renderInventoryWasteChart('all');
    renderRecommendedReorderList();
    renderDashboardStockAlertCenter();
}

function renderDashboardStockAlertCenter() {
    const listContainer = document.getElementById('dashboard-stock-alerts-list');
    const badgeEl = document.getElementById('dashboard-stock-alert-badge');
    const testBtn = document.getElementById('dashboard-toast-test-btn');
    if (!listContainer) return;

    if (testBtn && !testBtn._hasListener) {
        testBtn._hasListener = true;
        testBtn.addEventListener('click', triggerTestStockAlertToast);
    }

    const minThreshold = getStudioMinThreshold();
    const bottles = getStudioBottles();
    const lowBottles = bottles.filter(b => b.currentMl < minThreshold);

    if (badgeEl) {
        if (lowBottles.length > 0) {
            badgeEl.textContent = TP("x.critical_low", "🚨 {0} CRITICAL LOW", lowBottles.length);
            badgeEl.className = 'coverage__dash-stock-badge coverage__dash-stock-badge--alert';
        } else {
            badgeEl.textContent = T("x.all_inks_adequate", "✓ ALL INKS ADEQUATE");
            badgeEl.className = 'coverage__dash-stock-badge coverage__dash-stock-badge--ok';
        }
    }

    if (lowBottles.length === 0) {
        listContainer.innerHTML = `
            <div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="font-size: 1.1rem; margin-bottom: 0.2rem;">✨</div>
                <div style="font-weight: 700; color: #10b981; font-size: 0.9rem;">Studio Ink Stock Levels Nominal</div>
                <div style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 0.2rem;">
                    All registered bottles are above your minimum alert threshold of <strong>${minThreshold} mL</strong>.
                </div>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = lowBottles.map(b => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 0.65rem 0.85rem; gap: 0.5rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: ${b.hex}; border: 1px solid rgba(255,255,255,0.3);"></span>
                <div>
                    <div style="font-weight: 800; color: #ffffff; font-size: 0.88rem;">${b.name}</div>
                    <div style="font-size: 0.72rem; color: #fca5a5;">
                        ${b.brand} • <strong>${b.currentMl} mL remaining</strong> (Deficit: -${(minThreshold - b.currentMl).toFixed(0)} mL below ${minThreshold}mL min)
                    </div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
                <button type="button" onclick="restockStudioBottle('${b.id}')" style="background: #10b981; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                    Refill Bottle
                </button>
            </div>
        </div>
    `).join('');
}

function getInventoryAppointments() {
    try {
        const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error(e);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nextDayStr = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

    return [
        { id: 'appt_seed_1', client: 'Alex M. - Dragon Sleeve', date: todayStr, startTime: '10:00', duration: 4.0, area: 35, technique: 'bold-linework', blackMl: 45, colorMl: 10 },
        { id: 'appt_seed_2', client: 'Elena R. - Peony Realism', date: todayStr, startTime: '12:30', duration: 3.5, area: 20, technique: 'color-packing', blackMl: 25, colorMl: 30 },
        { id: 'appt_seed_3', client: 'Marcus T. - Geometric Sleeve', date: nextDayStr, startTime: '11:00', duration: 5.0, area: 30, technique: 'bold-linework', blackMl: 20, colorMl: 15 }
    ];
}

function addInventoryAppointment(appt) {
    const list = getInventoryAppointments();
    list.unshift(appt);
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(list));
    renderInventoryPlanner();
}

function deleteInventoryAppointment(id) {
    let list = getInventoryAppointments();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(list));
    renderInventoryPlanner();
}

function renderInventoryPlanner() {
    const summaryContainer = document.getElementById('inventory-aggregate-summary');
    const listContainer = document.getElementById('inventory-appointments-list');
    const shortageAlertBox = document.getElementById('inventory-shortage-alert');
    const conflictAlertBox = document.getElementById('inventory-conflict-alert');

    if (!summaryContainer || !listContainer) return;

    const appointments = getInventoryAppointments();
    const stock = getStudioStockLevels();

    if (appointments.length === 0) {
        if (shortageAlertBox) shortageAlertBox.style.display = 'none';
        if (conflictAlertBox) conflictAlertBox.style.display = 'none';
        summaryContainer.innerHTML = '<p style="font-size: 0.85rem; color: var(--color-text-secondary);">No upcoming appointments scheduled.</p>';
        listContainer.innerHTML = '<p style="font-size: 0.85rem; color: var(--color-text-secondary); text-align: center; padding: 1.5rem;">Your appointment schedule is clear. Add an appointment above to plan ink volume requirements.</p>';
        renderRecommendedReorderList();
        return;
    }

    let totalBlackMl = 0;
    let totalColorMl = 0;
    let totalAreaSqIn = 0;

    appointments.forEach(app => {
        totalBlackMl += (parseFloat(app.blackMl) || 0);
        totalColorMl += (parseFloat(app.colorMl) || 0);
        totalAreaSqIn += (parseFloat(app.area) || 0);
    });

    const blackDeficit = totalBlackMl - stock.blackMl;
    const colorDeficit = totalColorMl - stock.colorMl;
    const isBlackShortage = blackDeficit > 0;
    const isColorShortage = colorDeficit > 0;
    const hasAnyShortage = isBlackShortage || isColorShortage;

    // 1. VISUAL WARNING SYSTEM: Render Shortage Alert Banner
    if (shortageAlertBox) {
        if (hasAnyShortage) {
            shortageAlertBox.style.display = 'block';
            shortageAlertBox.innerHTML = `
                <div class="inventory-alert-banner inventory-alert-banner--shortage">
                    <div class="inventory-alert-icon">🚨</div>
                    <div>
                        <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 0.2rem; color: #ef4444;">
                            INSUFFICIENT STOCK WARNING: Total Demand Exceeds Available Inventory!
                        </div>
                        <div style="font-size: 0.82rem; color: #fca5a5;">
                            ${isBlackShortage ? `• <strong>Black Ink Deficit:</strong> ${blackDeficit.toFixed(0)} mL needed (${totalBlackMl} mL demand vs ${stock.blackMl} mL in stock). ` : ''}
                            ${isColorShortage ? `• <strong>Color Ink Deficit:</strong> ${colorDeficit.toFixed(0)} mL needed (${totalColorMl} mL demand vs ${stock.colorMl} mL in stock). ` : ''}
                            Order supplies immediately to prevent session interruptions.
                        </div>
                    </div>
                </div>
            `;
        } else {
            shortageAlertBox.style.display = 'none';
        }
    }

    // 2. Render Aggregated Demand vs Available Stock Cards (Highlighted in Red on Shortage)
    const blackBottlesNeeded = isBlackShortage ? Math.ceil(blackDeficit / 30) : 0;
    const colorBottlesNeeded = isColorShortage ? Math.ceil(colorDeficit / 30) : 0;

    summaryContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <!-- Black Pigment Demand Card -->
            <div class="${isBlackShortage ? 'inventory-card--shortage' : 'inventory-card--adequate'}" style="border-radius: 8px; padding: 0.85rem; text-align: center; transition: all 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: 0.25rem;">
                    <span>Total Black Pigment</span>
                    ${isBlackShortage ? '<span class="inventory-badge--shortage">⚠️ SHORTAGE</span>' : '<span style="color: #10b981; font-weight: 700; font-size: 0.7rem;">✓ OK</span>'}
                </div>
                <div style="font-size: 1.35rem; font-weight: 800; color: ${isBlackShortage ? '#ef4444' : '#0693e3'};">
                    ${totalBlackMl} mL
                </div>
                <div style="font-size: 0.72rem; margin-top: 4px; color: ${isBlackShortage ? '#fca5a5' : 'var(--color-text-secondary)'};">
                    ${isBlackShortage 
                        ? `<strong>Stock Shortage: -${blackDeficit.toFixed(0)} mL</strong> (~${blackBottlesNeeded}x 1oz bottles)` 
                        : `Stock Buffer: +${(stock.blackMl - totalBlackMl).toFixed(0)} mL (${stock.blackMl} mL on hand)`}
                </div>
            </div>

            <!-- Color Pigment Demand Card -->
            <div class="${isColorShortage ? 'inventory-card--shortage' : 'inventory-card--adequate'}" style="border-radius: 8px; padding: 0.85rem; text-align: center; transition: all 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: 0.25rem;">
                    <span>Total Color Pigments</span>
                    ${isColorShortage ? '<span class="inventory-badge--shortage">⚠️ SHORTAGE</span>' : '<span style="color: #10b981; font-weight: 700; font-size: 0.7rem;">✓ OK</span>'}
                </div>
                <div style="font-size: 1.35rem; font-weight: 800; color: ${isColorShortage ? '#ef4444' : 'var(--color-neon-pink, #ff006e)'};">
                    ${totalColorMl} mL
                </div>
                <div style="font-size: 0.72rem; margin-top: 4px; color: ${isColorShortage ? '#fca5a5' : 'var(--color-text-secondary)'};">
                    ${isColorShortage 
                        ? `<strong>Stock Shortage: -${colorDeficit.toFixed(0)} mL</strong> (~${colorBottlesNeeded}x 1oz bottles)` 
                        : `Stock Buffer: +${(stock.colorMl - totalColorMl).toFixed(0)} mL (${stock.colorMl} mL on hand)`}
                </div>
            </div>
        </div>
        <div style="font-size: 0.82rem; color: var(--color-text-secondary); background: ${hasAnyShortage ? 'rgba(239, 68, 68, 0.08)' : 'rgba(6, 147, 227, 0.08)'}; padding: 0.6rem 0.8rem; border-radius: 6px; border-left: 3px solid ${hasAnyShortage ? '#ef4444' : '#0693e3'};">
            Total skin surface: <strong>${totalAreaSqIn} sq in</strong> across <strong>${appointments.length} client session(s)</strong>.
        </div>
    `;

    // 3. APPOINTMENT CONFLICT VALIDATION CHECK
    const conflictsMap = checkAppointmentConflicts(appointments);
    const conflictingApptCount = conflictsMap.size;

    if (conflictAlertBox) {
        if (conflictingApptCount > 0) {
            conflictAlertBox.style.display = 'block';
            const conflictDates = [...new Set(appointments.filter(a => conflictsMap.has(a.id)).map(a => a.date))];
            conflictAlertBox.innerHTML = `
                <div class="inventory-alert-banner inventory-alert-banner--conflict">
                    <div class="inventory-alert-icon">⚠️</div>
                    <div>
                        <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 0.2rem; color: #fbbf24;">
                            SCHEDULE CONFLICT DETECTED (${conflictingApptCount} overlapping sessions on ${conflictDates.join(', ')})
                        </div>
                        <div style="font-size: 0.82rem; color: #fcd34d;">
                            Two or more sessions are scheduled on the same date with conflicting chair time requirements. Please review the highlighted rows below to prevent double-booking.
                        </div>
                    </div>
                </div>
            `;
        } else {
            conflictAlertBox.style.display = 'none';
        }
    }

    // 4. Render Appointments List with Conflict Badges & Shortage Highlights
    listContainer.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
                <tr style="border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary);">
                    <th style="padding: 0.6rem;">Client / Project</th>
                    <th style="padding: 0.6rem;">Date & Time Slot</th>
                    <th style="padding: 0.6rem;">Duration</th>
                    <th style="padding: 0.6rem;">Area</th>
                    <th style="padding: 0.6rem;">Black Ink</th>
                    <th style="padding: 0.6rem;">Color Ink</th>
                    <th style="padding: 0.6rem; text-align: right;">Action</th>
                </tr>
            </thead>
            <tbody>
                ${appointments.map(app => {
                    const conflicts = conflictsMap.get(app.id);
                    const hasConflict = !!conflicts && conflicts.length > 0;
                    const startTime = app.startTime || '10:00';
                    const duration = parseFloat(app.duration) || 3.5;
                    const startDec = parseTimeToDecimalHours(startTime);
                    const endDec = startDec + duration;
                    const endTimeStr = formatDecimalHoursToTime(endDec);

                    // Row classes
                    const rowClass = hasConflict ? 'inventory-row--conflict' : '';

                    return `
                        <tr class="${rowClass}" style="border-bottom: 1px solid rgba(255,255,255,0.05); transition: background-color 0.2s ease;">
                            <td style="padding: 0.6rem;">
                                <div style="font-weight: 600; color: var(--color-text-primary);">${app.client}</div>
                                ${hasConflict ? `
                                    <div style="margin-top: 4px;">
                                        <span class="inventory-badge--conflict">
                                            ⚠️ Conflict with ${conflicts.map(c => `${c.client} (${c.timeRange})`).join(', ')}
                                        </span>
                                    </div>
                                ` : ''}
                            </td>
                            <td style="padding: 0.6rem; color: var(--color-text-secondary);">
                                <div style="font-weight: 600; color: var(--color-text-primary);">${app.date}</div>
                                <div style="font-size: 0.75rem; color: ${hasConflict ? '#fbbf24' : 'var(--color-text-secondary)'};">
                                    🕒 ${startTime} - ${endTimeStr}
                                </div>
                            </td>
                            <td style="padding: 0.6rem; color: var(--color-text-secondary); font-weight: 500;">
                                ${duration} hrs
                            </td>
                            <td style="padding: 0.6rem; color: var(--color-text-secondary);">${app.area} sq in</td>
                            <td style="padding: 0.6rem; font-weight: 700; color: ${isBlackShortage ? '#ef4444' : '#0693e3'};">
                                ${app.blackMl} mL
                            </td>
                            <td style="padding: 0.6rem; font-weight: 700; color: ${isColorShortage ? '#ef4444' : 'var(--color-neon-pink, #ff006e)'};">
                                ${app.colorMl} mL
                            </td>
                            <td style="padding: 0.6rem; text-align: right;">
                                <button type="button" onclick="deleteInventoryAppointment('${app.id}')" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: all 0.2s ease;">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    renderRecommendedReorderList();
}

/* ── 30-Day Predictive Stock Depletion & Reorder Engine ── */
function renderRecommendedReorderList() {
    const container = document.getElementById('inventory-recommended-reorder-container');
    if (!container) return;

    const appointments = getInventoryAppointments();
    const minThreshold = getStudioMinThreshold();
    const bottles = getStudioBottles();

    // Filter appointments within next 30 days
    const now = new Date();
    const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const thirtyDaysTimestamp = todayTimestamp + (30 * 24 * 60 * 60 * 1000);

    const next30Appts = appointments.filter(a => {
        if (!a.date) return false;
        const apptTime = new Date(a.date).getTime();
        return apptTime >= todayTimestamp && apptTime <= thirtyDaysTimestamp;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Aggregate demand across next 30 days
    let thirtyDayBlackDemand = 0;
    let thirtyDayColorDemand = 0;

    next30Appts.forEach(a => {
        thirtyDayBlackDemand += (parseFloat(a.blackMl) || 0);
        thirtyDayColorDemand += (parseFloat(a.colorMl) || 0);
    });

    // Match bottles against projected demand
    const blackBottles = bottles.filter(b => b.category === 'black');
    const colorBottles = bottles.filter(b => b.category === 'color');

    // Proportionally project consumption per bottle
    const reorderItems = [];

    bottles.forEach(b => {
        const poolCount = b.category === 'black' ? (blackBottles.length || 1) : (colorBottles.length || 1);
        const projectedUsage = b.category === 'black' 
            ? (thirtyDayBlackDemand / poolCount)
            : (thirtyDayColorDemand / poolCount);

        const startingMl = b.currentMl;
        const projectedRemaining = startingMl - projectedUsage;
        const willBreachThreshold = projectedRemaining < minThreshold;
        const willDeplete = projectedRemaining <= 0;

        if (willBreachThreshold) {
            // Find estimated days until breach
            let cumUsage = 0;
            let daysUntilBreach = 30;
            let breachDateStr = 'Within 30 Days';

            for (let i = 0; i < next30Appts.length; i++) {
                const app = next30Appts[i];
                const appDemand = b.category === 'black' 
                    ? ((parseFloat(app.blackMl) || 0) / poolCount)
                    : ((parseFloat(app.colorMl) || 0) / poolCount);
                cumUsage += appDemand;
                if ((startingMl - cumUsage) < minThreshold) {
                    const diffDays = Math.max(1, Math.round((new Date(app.date).getTime() - todayTimestamp) / (1000 * 60 * 60 * 24)));
                    daysUntilBreach = diffDays;
                    breachDateStr = app.date;
                    break;
                }
            }

            const deficitBelowThreshold = Math.max(0, minThreshold - projectedRemaining);
            const bottlesToOrder = Math.max(1, Math.ceil(deficitBelowThreshold / (b.capacityMl || 30)));
            const recommendedVolume = bottlesToOrder * (b.capacityMl || 30);

            reorderItems.push({
                bottle: b,
                startingMl: startingMl,
                projectedUsage: Math.round(projectedUsage),
                projectedRemaining: Math.max(0, Math.round(projectedRemaining)),
                daysUntilBreach: daysUntilBreach,
                breachDateStr: breachDateStr,
                deficitBelowThreshold: Math.round(deficitBelowThreshold),
                bottlesToOrder: bottlesToOrder,
                recommendedVolume: recommendedVolume,
                isDepleted: willDeplete
            });
        }
    });

    if (reorderItems.length === 0) {
        container.innerHTML = `
            <div class="reorder-forecast-header">
                <div>
                    <h3 class="reorder-forecast-title">
                        <span>📦</span> 30-Day Recommended Reorder Forecast
                    </h3>
                    <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin: 0.2rem 0 0 0;">
                        Predictive inventory depletion model based on <strong>${next30Appts.length} scheduled session(s)</strong> in the next 30 days.
                    </p>
                </div>
                <span class="reorder-badge-safe">✓ ALL PIGMENTS ADEQUATE (30D SAFE)</span>
            </div>
            <div style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="color: #10b981; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.25rem;">
                    ✨ No Reorders Required Within the Next 30 Days
                </div>
                <div style="font-size: 0.8rem; color: var(--color-text-secondary);">
                    Current studio stock of registered inks is sufficient to handle all ${next30Appts.length} bookings without falling below your safety buffer of <strong>${minThreshold} mL</strong>.
                </div>
            </div>
        `;
        return;
    }

    // Build Reorder Matrix
    container.innerHTML = `
        <div class="reorder-forecast-header">
            <div>
                <h3 class="reorder-forecast-title">
                    <span>📦</span> 30-Day Recommended Reorder Forecast
                </h3>
                <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin: 0.2rem 0 0 0;">
                    Predictive inventory depletion model calculated from <strong>${next30Appts.length} scheduled session(s)</strong> in the next 30 days.
                </p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                <span class="reorder-badge-urgent">🚨 ${reorderItems.length} PIGMENT${reorderItems.length > 1 ? 'S' : ''} AT RISK</span>
                <button type="button" onclick="copyReorderManifestText()" class="coverage__export-btn" style="font-size: 0.75rem; padding: 4px 10px;">
                    📋 Copy Reorder List
                </button>
            </div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
            <div style="font-size: 1.3rem;">⚠️</div>
            <div style="font-size: 0.82rem; color: #fca5a5;">
                <strong>Attention Artist:</strong> Based on upcoming bookings, ${reorderItems.length} ink line(s) will breach your ${minThreshold} mL safety threshold within 30 days. Place orders now to maintain continuous studio workflow.
            </div>
        </div>

        <div style="overflow-x: auto;">
            <table class="reorder-forecast-table">
                <thead>
                    <tr>
                        <th>Pigment Bottle & Line</th>
                        <th>Current Stock</th>
                        <th>30D Projected Usage</th>
                        <th>Projected Balance</th>
                        <th>Est. Breach Date</th>
                        <th>Recommended Order</th>
                        <th style="text-align: right;">Quick Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${reorderItems.map(item => `
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 0.45rem;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${item.bottle.hex}; border: 1px solid rgba(255,255,255,0.3); display: inline-block;"></span>
                                    <div>
                                        <div style="font-weight: 700; color: #ffffff;">${item.bottle.name}</div>
                                        <div style="font-size: 0.7rem; color: var(--color-text-secondary);">${item.bottle.brand} (${item.bottle.capacityMl} mL)</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span style="font-weight: 700; color: ${item.startingMl < minThreshold ? '#ef4444' : '#ffffff'};">
                                    ${item.startingMl} mL
                                </span>
                            </td>
                            <td>
                                <span style="color: #0693e3; font-weight: 600;">-${item.projectedUsage} mL</span>
                            </td>
                            <td>
                                <span style="font-weight: 800; color: #ef4444;">
                                    ${item.projectedRemaining} mL
                                </span>
                                <div style="font-size: 0.68rem; color: #fca5a5;">(-${item.deficitBelowThreshold} mL buffer deficit)</div>
                            </td>
                            <td>
                                <div style="font-weight: 700; color: #fbbf24;">
                                    In ~${item.daysUntilBreach} days
                                </div>
                                <div style="font-size: 0.68rem; color: var(--color-text-secondary);">${item.breachDateStr}</div>
                            </td>
                            <td>
                                <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); border-radius: 4px; padding: 3px 6px; display: inline-block;">
                                    <span style="font-weight: 800; color: #34d399; font-size: 0.8rem;">
                                        Order ${item.bottlesToOrder}x (${item.recommendedVolume} mL)
                                    </span>
                                </div>
                            </td>
                            <td style="text-align: right;">
                                <button type="button" onclick="quickRestockFromReorder('${item.bottle.id}')" style="background: #10b981; color: #ffffff; border: none; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer; white-space: nowrap;">
                                    ⚡ 1-Click Restock
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function quickRestockFromReorder(bottleId) {
    restockStudioBottle(bottleId);
    renderRecommendedReorderList();
}

function copyReorderManifestText() {
    const appointments = getInventoryAppointments();
    const minThreshold = getStudioMinThreshold();
    const bottles = getStudioBottles();

    const now = new Date();
    const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const thirtyDaysTimestamp = todayTimestamp + (30 * 24 * 60 * 60 * 1000);

    const next30Appts = appointments.filter(a => {
        if (!a.date) return false;
        const apptTime = new Date(a.date).getTime();
        return apptTime >= todayTimestamp && apptTime <= thirtyDaysTimestamp;
    });

    let thirtyDayBlackDemand = 0;
    let thirtyDayColorDemand = 0;
    next30Appts.forEach(a => {
        thirtyDayBlackDemand += (parseFloat(a.blackMl) || 0);
        thirtyDayColorDemand += (parseFloat(a.colorMl) || 0);
    });

    const blackBottles = bottles.filter(b => b.category === 'black');
    const colorBottles = bottles.filter(b => b.category === 'color');

    let text = `=====================================================\n`;
    text += `30-DAY RECOMMENDED INK REORDER MANIFEST\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Safety Threshold: ${minThreshold} mL | Upcoming Sessions: ${next30Appts.length}\n`;
    text += `=====================================================\n\n`;

    let itemsCount = 0;
    bottles.forEach(b => {
        const poolCount = b.category === 'black' ? (blackBottles.length || 1) : (colorBottles.length || 1);
        const projectedUsage = b.category === 'black' 
            ? (thirtyDayBlackDemand / poolCount)
            : (thirtyDayColorDemand / poolCount);
        const projectedRemaining = b.currentMl - projectedUsage;

        if (projectedRemaining < minThreshold) {
            itemsCount++;
            const deficit = Math.max(0, minThreshold - projectedRemaining);
            const orderQty = Math.max(1, Math.ceil(deficit / (b.capacityMl || 30)));
            text += `[ITEM ${itemsCount}] ${b.name} (${b.brand})\n`;
            text += `  - Current Stock: ${b.currentMl} mL | 30D Usage: ${Math.round(projectedUsage)} mL\n`;
            text += `  - Projected Balance: ${Math.round(projectedRemaining)} mL (Deficit: -${Math.round(deficit)} mL)\n`;
            text += `  - RECOMMENDED ORDER: ${orderQty}x ${b.capacityMl} mL bottle (${orderQty * b.capacityMl} mL total)\n\n`;
        }
    });

    if (itemsCount === 0) {
        text += `No reorders required. All registered studio inks are within safe operational limits.\n`;
    }

    text += `=====================================================\n`;

    navigator.clipboard.writeText(text).then(() => {
        showToast({
            type: 'success',
            title: 'Manifest Copied',
            message: '30-Day Recommended Reorder manifest copied to clipboard!',
            duration: 3500
        });
    });
}

function exportSupplierReorderList() {
    const appointments = getInventoryAppointments();
    const stock = getStudioStockLevels();

    if (appointments.length === 0) {
        alert('No upcoming appointments scheduled to generate reorder manifest.');
        return;
    }

    let totalBlackMl = 0;
    let totalColorMl = 0;
    appointments.forEach(app => {
        totalBlackMl += (parseFloat(app.blackMl) || 0);
        totalColorMl += (parseFloat(app.colorMl) || 0);
    });

    const blackDeficit = Math.max(0, totalBlackMl - stock.blackMl);
    const colorDeficit = Math.max(0, totalColorMl - stock.colorMl);

    const manifestText = `=====================================================
TATTOO STUDIO SUPPLIER REORDER & INVENTORY MANIFEST
Generated: ${new Date().toLocaleString()}
=====================================================

STUDIO ON-HAND INVENTORY:
- Black Pigment Available: ${stock.blackMl} mL
- Color Pigments Available: ${stock.colorMl} mL

AGGREGATED UPCOMING DEMAND:
- Lining / Outlining Black Ink: ${totalBlackMl} mL (~${Math.ceil(totalBlackMl / 30)}x 1oz bottles)
- Color & Shading Pigments: ${totalColorMl} mL (~${Math.ceil(totalColorMl / 30)}x 1oz bottles)

NET REORDER REQUIREMENTS (STOCK DEFICIT):
- Black Ink To Order: ${blackDeficit > 0 ? `${blackDeficit} mL (${Math.ceil(blackDeficit / 30)}x 1oz bottles) [URGENT RESTOCK]` : '0 mL (Sufficient Stock Buffer)'}
- Color Pigments To Order: ${colorDeficit > 0 ? `${colorDeficit} mL (${Math.ceil(colorDeficit / 30)}x 1oz bottles) [URGENT RESTOCK]` : '0 mL (Sufficient Stock Buffer)'}

UPCOMING BOOKINGS SCHEDULE BREAKDOWN:
${appointments.map((a, i) => `${i + 1}. [${a.date} | ${a.startTime || '10:00'} (${a.duration || 3.5}h)] ${a.client}
   - Area: ${a.area} sq in | Technique: ${a.technique}
   - Black Demand: ${a.blackMl} mL | Color Demand: ${a.colorMl} mL`).join('\n\n')}

=====================================================
Powered by Tattoo Coverage & Session Planner Suite
=====================================================`;

    const blob = new Blob([manifestText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ink-supplier-reorder-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}


/* ═══════════════════════════════════════════════════════════
   FEATURE 5: ONBOARDING GUIDED TOUR OVERLAY
   ═══════════════════════════════════════════════════════════ */

const TOUR_STEPS = [
    {
        title: "Welcome to Tattoo Coverage & Session Planner",
        badge: "Step 1 of 5",
        body: "This professional suite helps body artists calculate precise needle coverage rates, chair time session estimates, ink consumption, bottle pricing, and profit margins."
    },
    {
        title: "Interactive SVG Body Map",
        badge: "Step 2 of 5",
        body: "Click any body location on the interactive SVG human model (Ribs, Forearm, Neck, Chest, etc.) to automatically apply skin stretch and pain difficulty multipliers to your calculations."
    },
    {
        title: "Chair Time Stopwatch & Timer Widget",
        badge: "Step 3 of 5",
        body: "Track actual chair time live during sittings! Features an integrated stopwatch count-up, target timer count-down, client break logger, and an Actual vs Estimated variance summary modal upon finishing."
    },
    {
        title: "Custom Ink Bottle Pricing & Waste Calculator",
        badge: "Step 4 of 5",
        body: "Enter your custom ink bottle price, brand, and volume in the Ink Calculator tab to get an exact cost-per-session value and analyze pigment waste in caps vs deposited ink."
    },
    {
        title: "Ink Inventory Planner & Shortcuts",
        badge: "Step 5 of 5",
        body: "Manage upcoming client bookings in local storage and aggregate total ink demand for supplier reorders. Pro tip: Press <strong>Ctrl+Enter</strong> or <strong>Cmd+Enter</strong> anywhere to instantly trigger form calculations!"
    }
];

let currentTourStep = 0;

function initializeOnboardingTour() {
    const tourBtn = document.getElementById('onboarding-tour-btn');
    const modalEl = document.getElementById('onboarding-modal');
    const overlayEl = document.getElementById('onboarding-overlay');
    const closeBtn = document.getElementById('onboarding-close');
    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');
    const skipBtn = document.getElementById('tour-skip-btn');

    if (tourBtn) {
        tourBtn.addEventListener('click', function() {
            currentTourStep = 0;
            openTourModal();
        });
    }

    if (overlayEl) overlayEl.addEventListener('click', closeTourModal);
    if (closeBtn) closeBtn.addEventListener('click', closeTourModal);
    if (skipBtn) skipBtn.addEventListener('click', closeTourModal);

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentTourStep > 0) {
                currentTourStep--;
                renderTourStep();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentTourStep < TOUR_STEPS.length - 1) {
                currentTourStep++;
                renderTourStep();
            } else {
                localStorage.setItem('tattoo_tour_completed', 'true');
                closeTourModal();
            }
        });
    }

    if (!localStorage.getItem('tattoo_tour_completed')) {
        setTimeout(function() {
            currentTourStep = 0;
            openTourModal();
        }, 800);
    }
}

function openTourModal() {
    const modalEl = document.getElementById('onboarding-modal');
    if (modalEl) {
        modalEl.style.display = 'flex';
        renderTourStep();
    }
}

function closeTourModal() {
    const modalEl = document.getElementById('onboarding-modal');
    if (modalEl) modalEl.style.display = 'none';
}

function renderTourStep() {
    const step = TOUR_STEPS[currentTourStep];
    const titleEl = document.getElementById('tour-title');
    const badgeEl = document.getElementById('tour-step-badge');
    const bodyEl = document.getElementById('tour-step-body');
    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');

    if (titleEl) titleEl.textContent = step.title;
    if (badgeEl) badgeEl.textContent = step.badge;
    if (bodyEl) bodyEl.innerHTML = step.body;

    if (prevBtn) prevBtn.disabled = currentTourStep === 0;
    if (nextBtn) {
        nextBtn.textContent = currentTourStep === TOUR_STEPS.length - 1 ? T("x.finish_tour", "Finish Tour ✓") : T("x.next_step", "Next Step →");
    }
}

/* ═══════════════════════════════════════════════════════════
   FEATURE 1: TATTOO STYLE THEME SELECTOR
   ═══════════════════════════════════════════════════════════ */

const TATTOO_THEMES = {
    'cyberpunk': {
        '--color-neon-pink': '#ff006e',
        '--color-primary': '#0693e3',
        '--color-bg-primary': '#0a0a16',
        '--color-bg-secondary': '#16213e',
        '--color-bg-card': '#1a1a2e',
        '--color-border': '#2e2e4a'
    },
    'cyberpunk-neo-noir': {
        '--color-neon-pink': '#ff006e',
        '--color-primary': '#0693e3',
        '--color-bg-primary': '#0a0a16',
        '--color-bg-secondary': '#16213e',
        '--color-bg-card': '#1a1a2e',
        '--color-border': '#2e2e4a'
    },
    'traditional': {
        '--color-neon-pink': '#d97706',
        '--color-primary': '#dc2626',
        '--color-bg-primary': '#120d0a',
        '--color-bg-secondary': '#1e1610',
        '--color-bg-card': '#281d15',
        '--color-border': '#4a3322'
    },
    'bold-traditional': {
        '--color-neon-pink': '#d97706',
        '--color-primary': '#dc2626',
        '--color-bg-primary': '#120d0a',
        '--color-bg-secondary': '#1e1610',
        '--color-bg-card': '#281d15',
        '--color-border': '#4a3322'
    },
    'fineline': {
        '--color-neon-pink': '#38bdf8',
        '--color-primary': '#94a3b8',
        '--color-bg-primary': '#0f172a',
        '--color-bg-secondary': '#1e293b',
        '--color-bg-card': '#334155',
        '--color-border': '#475569'
    },
    'fine-line': {
        '--color-neon-pink': '#38bdf8',
        '--color-primary': '#94a3b8',
        '--color-bg-primary': '#0f172a',
        '--color-bg-secondary': '#1e293b',
        '--color-bg-card': '#334155',
        '--color-border': '#475569'
    },
    'irezumi': {
        '--color-neon-pink': '#e11d48',
        '--color-primary': '#f59e0b',
        '--color-bg-primary': '#18080c',
        '--color-bg-secondary': '#2a1017',
        '--color-bg-card': '#3c1822',
        '--color-border': '#5c2432'
    },
    'japanese-irezumi': {
        '--color-neon-pink': '#e11d48',
        '--color-primary': '#f59e0b',
        '--color-bg-primary': '#18080c',
        '--color-bg-secondary': '#2a1017',
        '--color-bg-card': '#3c1822',
        '--color-border': '#5c2432'
    },
    'blackwork': {
        '--color-neon-pink': '#e2e8f0',
        '--color-primary': '#64748b',
        '--color-bg-primary': '#09090b',
        '--color-bg-secondary': '#18181b',
        '--color-bg-card': '#27272a',
        '--color-border': '#3f3f46'
    },
    'realism': {
        '--color-neon-pink': '#f59e0b',
        '--color-primary': '#10b981',
        '--color-bg-primary': '#0d1117',
        '--color-bg-secondary': '#161b22',
        '--color-bg-card': '#21262d',
        '--color-border': '#30363d'
    },
    'neotraditional': {
        '--color-neon-pink': '#ec4899',
        '--color-primary': '#8b5cf6',
        '--color-bg-primary': '#140c1c',
        '--color-bg-secondary': '#241432',
        '--color-bg-card': '#341d47',
        '--color-border': '#532d72'
    },
    'watercolor': {
        '--color-neon-pink': '#06b6d4',
        '--color-primary': '#f43f5e',
        '--color-bg-primary': '#0c1520',
        '--color-bg-secondary': '#132337',
        '--color-bg-card': '#1c3452',
        '--color-border': '#2d4e78'
    },
    'dotwork': {
        '--color-neon-pink': '#14b8a6',
        '--color-primary': '#eab308',
        '--color-bg-primary': '#0c1615',
        '--color-bg-secondary': '#142523',
        '--color-bg-card': '#1d3633',
        '--color-border': '#2c534e'
    },
    'biomechanical': {
        '--color-neon-pink': '#84cc16',
        '--color-primary': '#06b6d4',
        '--color-bg-primary': '#0d140e',
        '--color-bg-secondary': '#172318',
        '--color-bg-card': '#223524',
        '--color-border': '#355238'
    },
    'trashpolka': {
        '--color-neon-pink': '#ef4444',
        '--color-primary': '#ffffff',
        '--color-bg-primary': '#0a0a0a',
        '--color-bg-secondary': '#1c1917',
        '--color-bg-card': '#292524',
        '--color-border': '#57534e'
    },
    'chicano': {
        '--color-neon-pink': '#c084fc',
        '--color-primary': '#cbd5e1',
        '--color-bg-primary': '#111015',
        '--color-bg-secondary': '#1e1c24',
        '--color-bg-card': '#2d2a37',
        '--color-border': '#454054'
    }
};

function initializeStyleTheme() {
    const selectEls = document.querySelectorAll('#tattoo-style-theme-select, #tattoo-style-theme');
    if (!selectEls || selectEls.length === 0) return;

    const savedTheme = localStorage.getItem('tattoo_style_theme') || 'cyberpunk';
    
    selectEls.forEach(selectEl => {
        if (selectEl) {
            selectEl.value = savedTheme;
            selectEl.addEventListener('change', function() {
                const themeKey = this.value;
                applyTattooStyleTheme(themeKey);
                localStorage.setItem('tattoo_style_theme', themeKey);
                
                // Sync any other theme selects on page
                selectEls.forEach(s => {
                    if (s !== this) s.value = themeKey;
                });

                const styleName = this.options[this.selectedIndex] ? this.options[this.selectedIndex].text : themeKey;
                if (typeof showToastNotification === 'function') {
                    showToastNotification(`🎨 Applied Style Palette: <strong>${styleName}</strong>`);
                }
            });
        }
    });

    applyTattooStyleTheme(savedTheme);
}

function applyTattooStyleTheme(themeKey) {
    const themeProps = TATTOO_THEMES[themeKey] || TATTOO_THEMES['cyberpunk'] || TATTOO_THEMES['cyberpunk-neo-noir'];
    const root = document.documentElement;

    for (const [prop, val] of Object.entries(themeProps)) {
        root.style.setProperty(prop, val);
    }
}


/* ═══════════════════════════════════════════════════════════
   FEATURE 2: SESSION GOALS & TARGET MILESTONES
   ═══════════════════════════════════════════════════════════ */

let sessionGoals = JSON.parse(localStorage.getItem('tattoo_session_goals') || '[]');

if (sessionGoals.length === 0) {
    sessionGoals = [
        { id: 1, title: 'Finish Linework Outline', hours: 2.0, completed: false },
        { id: 2, title: 'Black & Grey Shading', hours: 3.5, completed: false }
    ];
}

function initializeSessionGoals() {
    const titleInput = document.getElementById('goal-title-input');
    const timeInput = document.getElementById('goal-time-input');
    const addBtn = document.getElementById('add-goal-btn');
    const listEl = document.getElementById('session-goals-list');
    const presetBtns = document.querySelectorAll('.preset-goal-btn');

    if (!listEl) return;

    renderSessionGoals();

    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const title = titleInput ? titleInput.value.trim() : '';
            const hours = timeInput ? parseFloat(timeInput.value) : 0;

            if (!title) {
                alert('Please enter a target milestone title (e.g. Finish Linework).');
                return;
            }
            if (isNaN(hours) || hours <= 0) {
                alert('Please enter valid target hours (e.g. 2.0).');
                return;
            }

            sessionGoals.push({
                id: Date.now(),
                title: title,
                hours: hours,
                completed: false
            });

            saveAndRenderGoals();
            if (titleInput) titleInput.value = '';
            if (timeInput) timeInput.value = '';
        });
    }

    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const hours = parseFloat(this.getAttribute('data-hours'));

            sessionGoals.push({
                id: Date.now(),
                title: title,
                hours: hours,
                completed: false
            });

            saveAndRenderGoals();
        });
    });
}

function saveAndRenderGoals() {
    localStorage.setItem('tattoo_session_goals', JSON.stringify(sessionGoals));
    renderSessionGoals();
}

function renderSessionGoals() {
    const listEl = document.getElementById('session-goals-list');
    if (!listEl) return;

    if (sessionGoals.length === 0) {
        listEl.innerHTML = '<div style="font-size: 0.8rem; color: var(--color-text-secondary); text-align: center; padding: 0.5rem;">No session goals set. Add a milestone above!</div>';
        return;
    }

    listEl.innerHTML = sessionGoals.map(g => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid var(--color-border); padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.82rem; ${g.completed ? 'opacity: 0.6; text-decoration: line-through;' : ''}">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" onchange="toggleGoalCompletion(${g.id})" ${g.completed ? 'checked' : ''} style="cursor: pointer;">
                <span style="font-weight: 600; color: var(--color-text-primary);">${g.title}</span>
                <span style="font-size: 0.75rem; color: var(--color-neon-pink, #ff006e); background: rgba(255,0,110,0.1); padding: 1px 6px; border-radius: 4px;">Target: ${g.hours}h</span>
            </div>
            <button type="button" onclick="deleteGoal(${g.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.9rem;" title="Delete goal">&times;</button>
        </div>
    `).join('');
}

function toggleGoalCompletion(id) {
    sessionGoals = sessionGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    saveAndRenderGoals();
}

function deleteGoal(id) {
    sessionGoals = sessionGoals.filter(g => g.id !== id);
    saveAndRenderGoals();
}

function checkGoalMilestonesNotification(elapsedSeconds) {
    const elapsedHours = elapsedSeconds / 3600;
    sessionGoals.forEach(g => {
        if (!g.completed && elapsedHours >= g.hours) {
            g.completed = true;
            saveAndRenderGoals();
            showGoalReachedToast(g.title, g.hours);
        }
    });
}

function showGoalReachedToast(title, hours) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 10005; background: #10b981; color: white; padding: 1rem 1.25rem; border-radius: 10px; font-weight: 700; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 0.75rem; font-size: 0.92rem; animation: slideIn 0.3s ease;';
    toast.innerHTML = TP("x.milestone_reached_h", "<span>🎯 Milestone Reached ({0}h)!</span> <span>{1}</span>", hours, title);
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 5000);
}


/* ═══════════════════════════════════════════════════════════
   FEATURE 3: ARTIST EFFICIENCY DASHBOARD & HISTORICAL CHARTING
   ═══════════════════════════════════════════════════════════ */

let efficiencyVarianceChart = null;
let efficiencyAccuracyChart = null;

let prevDashboardMetrics = {
    totalSessions: 0,
    avgVariance: 0,
    accuracyRate: 0,
    totalPigment: 0
};

function animateNumberValue(elementId, startVal, targetVal, duration = 800, options = {}) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Trigger CSS card pulse & text glow animation
    const card = el.closest('.dash-metric-card') || el.parentElement;
    if (card) {
        card.classList.remove('dash-metric-card--updating');
        void card.offsetWidth; // Force CSS reflow
        card.classList.add('dash-metric-card--updating');
        setTimeout(() => card.classList.remove('dash-metric-card--updating'), 650);
    }

    const prefix = options.prefix || '';
    const suffix = options.suffix || '';
    const decimals = options.decimals !== undefined ? options.decimals : 0;
    const isSigned = options.signed || false;

    const start = isNaN(startVal) ? 0 : parseFloat(startVal);
    const target = isNaN(targetVal) ? 0 : parseFloat(targetVal);

    if (start === target) {
        let formatted = target.toFixed(decimals);
        if (isSigned && target > 0) formatted = '+' + formatted;
        el.textContent = `${prefix}${formatted}${suffix}`;
        return;
    }

    const startTime = performance.now();

    function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * ease;

        let formatted = current.toFixed(decimals);
        if (isSigned && current > 0) formatted = '+' + formatted;
        el.textContent = `${prefix}${formatted}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            let finalFormatted = target.toFixed(decimals);
            if (isSigned && target > 0) finalFormatted = '+' + finalFormatted;
            el.textContent = `${prefix}${finalFormatted}${suffix}`;
        }
    }

    requestAnimationFrame(frame);
}

let isEfficiencyPrintMode = false;

function toggleEfficiencyPrintMode(forceState = null) {
    if (forceState !== null) {
        isEfficiencyPrintMode = forceState;
    } else {
        isEfficiencyPrintMode = !isEfficiencyPrintMode;
    }

    const panel = document.getElementById('dashboard-panel');
    const banner = document.getElementById('dashboard-print-banner');
    const printBtn = document.getElementById('dashboard-print-mode-btn');

    if (panel) {
        if (isEfficiencyPrintMode) {
            panel.classList.add('efficiency-dashboard--print-mode');
            if (banner) banner.style.display = 'flex';
            if (printBtn) printBtn.textContent = T("x.exit_print_view", "✕ Exit Print View");
        } else {
            panel.classList.remove('efficiency-dashboard--print-mode');
            if (banner) banner.style.display = 'none';
            if (printBtn) printBtn.textContent = T("x.high_contrast_print_view", "🖨️ High-Contrast Print View");
        }
    }

    const logs = JSON.parse(localStorage.getItem('tattoo_session_logs') || '[]');
    if (typeof Chart !== 'undefined') {
        renderEfficiencyCharts(logs);
    }
}

function initializeEfficiencyDashboard() {
    const loadSampleBtn = document.getElementById('dashboard-load-sample-btn');
    const clearBtn = document.getElementById('dashboard-clear-btn');
    const printModeBtn = document.getElementById('dashboard-print-mode-btn');
    const triggerPrintBtn = document.getElementById('dashboard-trigger-print-btn');
    const exitPrintBtn = document.getElementById('dashboard-exit-print-btn');

    renderEfficiencyDashboard();

    if (printModeBtn) {
        printModeBtn.addEventListener('click', function() {
            toggleEfficiencyPrintMode();
        });
    }

    if (triggerPrintBtn) {
        triggerPrintBtn.addEventListener('click', function() {
            window.print();
        });
    }

    if (exitPrintBtn) {
        exitPrintBtn.addEventListener('click', function() {
            toggleEfficiencyPrintMode(false);
        });
    }

    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', function() {
            const sampleLogs = [
                { date: '2026-08-01', client: 'Alex M.', location: 'Forearm', estimatedTime: 4.0, actualTime: 3.8, variance: -5.0, tag: 'accurate', inkMl: 18 },
                { date: '2026-08-03', client: 'Jordan S.', location: 'Ribs', estimatedTime: 5.5, actualTime: 6.8, variance: 23.6, tag: 'outlier', inkMl: 28 },
                { date: '2026-08-06', client: 'Taylor R.', location: 'Bicep', estimatedTime: 3.0, actualTime: 2.9, variance: -3.3, tag: 'accurate', inkMl: 14 },
                { date: '2026-08-09', client: 'Sam K.', location: 'Back Piece', estimatedTime: 6.0, actualTime: 5.7, variance: -5.0, tag: 'accurate', inkMl: 35 },
                { date: '2026-08-11', client: 'Chris L.', location: 'Outer Calf', estimatedTime: 4.5, actualTime: 4.6, variance: 2.2, tag: 'accurate', inkMl: 22 }
            ];

            localStorage.setItem('tattoo_session_logs', JSON.stringify(sampleLogs));
            renderEfficiencyDashboard();
            alert('Sample session history loaded successfully!');
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Clear all historical session logs? This cannot be undone.')) {
                localStorage.removeItem('tattoo_session_logs');
                renderEfficiencyDashboard();
            }
        });
    }

    // Re-render when dashboard tab is activated
    const dashTab = document.getElementById('dashboard-tab');
    if (dashTab) {
        dashTab.addEventListener('click', function() {
            setTimeout(renderEfficiencyDashboard, 100);
        });
    }
}

function renderEfficiencyDashboard() {
    const logs = JSON.parse(localStorage.getItem('tattoo_session_logs') || '[]');

    const totalCountEl = document.getElementById('dash-total-sessions');
    const avgVarEl = document.getElementById('dash-avg-variance');
    const accRateEl = document.getElementById('dash-accuracy-rate');
    const totalPigmentEl = document.getElementById('dash-total-pigment');
    const tableContainer = document.getElementById('dashboard-session-logs-table');

    const totalSessions = logs.length;
    let avgVariance = 0;
    let accurateCount = 0;
    let totalPigment = 0;

    if (totalSessions > 0) {
        const sumVar = logs.reduce((acc, curr) => acc + (curr.variance || 0), 0);
        avgVariance = sumVar / totalSessions;
        accurateCount = logs.filter(l => l.tag === 'accurate').length;
        totalPigment = logs.reduce((acc, curr) => acc + (curr.inkMl || 15), 0);
    }

    const accuracyRate = totalSessions > 0 ? (accurateCount / totalSessions) * 100 : 100;

    // Gracefully count up with CSS transition animations
    animateNumberValue('dash-total-sessions', prevDashboardMetrics.totalSessions, totalSessions, 700, { decimals: 0 });
    animateNumberValue('dash-avg-variance', prevDashboardMetrics.avgVariance, avgVariance, 700, { decimals: 1, suffix: '%', signed: true });
    animateNumberValue('dash-accuracy-rate', prevDashboardMetrics.accuracyRate, accuracyRate, 700, { decimals: 0, suffix: '%' });
    animateNumberValue('dash-total-pigment', prevDashboardMetrics.totalPigment, totalPigment, 700, { decimals: 0, suffix: ' mL' });

    if (avgVarEl) {
        avgVarEl.style.color = Math.abs(avgVariance) <= 10 ? '#10b981' : '#f59e0b';
    }

    // Save previous metrics for future count up transition
    prevDashboardMetrics = {
        totalSessions: totalSessions,
        avgVariance: avgVariance,
        accuracyRate: accuracyRate,
        totalPigment: totalPigment
    };

    // Render Table
    if (tableContainer) {
        if (totalSessions === 0) {
            tableContainer.innerHTML = '<div style="font-size: 0.88rem; color: var(--color-text-secondary); text-align: center; padding: 1.5rem;">No historical session records found. Finish a session using the Timer widget or click "Load Sample Demo Sessions" above.</div>';
        } else {
            tableContainer.innerHTML = `
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary);">
                            <th style="padding: 0.6rem;">Date</th>
                            <th style="padding: 0.6rem;">Client / Area</th>
                            <th style="padding: 0.6rem;">Estimated</th>
                            <th style="padding: 0.6rem;">Actual</th>
                            <th style="padding: 0.6rem;">Variance</th>
                            <th style="padding: 0.6rem;">Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.map(l => `
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); color: var(--color-text-primary);">
                                <td style="padding: 0.6rem;">${l.date || 'Recent'}</td>
                                <td style="padding: 0.6rem;"><strong>${l.client || 'Client'}</strong> (${l.location || 'Arm'})</td>
                                <td style="padding: 0.6rem; color: #0693e3;">${l.estimatedTime}h</td>
                                <td style="padding: 0.6rem; color: var(--color-neon-pink);">${l.actualTime}h</td>
                                <td style="padding: 0.6rem; font-weight: 700; color: ${l.variance <= 0 ? '#10b981' : '#f59e0b'};">
                                    ${l.variance >= 0 ? '+' : ''}${l.variance.toFixed(1)}%
                                </td>
                                <td style="padding: 0.6rem;">
                                    <span style="font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; background: ${l.tag === 'accurate' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${l.tag === 'accurate' ? '#10b981' : '#ef4444'};">
                                        ${l.tag === 'accurate' ? '✓ Baseline' : '⚠️ Outlier'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    }

    // Render Charts if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        renderEfficiencyCharts(logs);
    }
}

function renderEfficiencyCharts(logs) {
    const varCanvas = document.getElementById('efficiency-variance-chart');
    const accCanvas = document.getElementById('efficiency-accuracy-chart');

    if (!varCanvas || !accCanvas) return;

    if (efficiencyVarianceChart) efficiencyVarianceChart.destroy();
    if (efficiencyAccuracyChart) efficiencyAccuracyChart.destroy();

    const labels = logs.length > 0 ? logs.map((l, i) => l.date || `Session #${i+1}`) : ['Session #1', 'Session #2', 'Session #3', 'Session #4'];
    const estimatedData = logs.length > 0 ? logs.map(l => l.estimatedTime) : [4.0, 5.0, 3.5, 6.0];
    const actualData = logs.length > 0 ? logs.map(l => l.actualTime) : [3.8, 5.2, 3.4, 5.8];

    const isPrint = isEfficiencyPrintMode;

    const estColor = isPrint ? '#000000' : '#0693e3';
    const estBg = isPrint ? 'rgba(0, 0, 0, 0.05)' : 'rgba(6, 147, 227, 0.1)';
    const actColor = isPrint ? '#374151' : '#ff006e';
    const actBg = isPrint ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 0, 110, 0.1)';
    const textColor = isPrint ? '#000000' : '#a0a0a0';
    const gridColor = isPrint ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)';

    efficiencyVarianceChart = new Chart(varCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Estimated Chair Hours',
                    data: estimatedData,
                    borderColor: estColor,
                    backgroundColor: estBg,
                    borderWidth: isPrint ? 2.5 : 2,
                    borderDash: isPrint ? [6, 4] : [],
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Actual Chair Hours',
                    data: actualData,
                    borderColor: actColor,
                    backgroundColor: actBg,
                    borderWidth: isPrint ? 3 : 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor, font: { size: 11, weight: isPrint ? 'bold' : 'normal' } } }
            },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor }, title: { display: true, text: 'Hours', color: textColor, font: { weight: isPrint ? 'bold' : 'normal' } } }
            }
        }
    });

    const accurateCount = logs.filter(l => l.tag === 'accurate').length || (logs.length === 0 ? 4 : 0);
    const outlierCount = logs.filter(l => l.tag === 'outlier').length || 0;

    const donutBg = isPrint ? ['#111827', '#9ca3af'] : ['#10b981', '#ef4444'];

    efficiencyAccuracyChart = new Chart(accCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Accurate Baseline', 'Outlier Events'],
            datasets: [{
                data: [accurateCount, outlierCount],
                backgroundColor: donutBg,
                borderWidth: isPrint ? 2 : 0,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            cutout: '70%'
        }
    });

    const legendEl = document.getElementById('efficiency-accuracy-legend');
    if (legendEl) {
        legendEl.innerHTML = isPrint ? `
            <span style="color: #111827; font-weight: 800;">● Baseline: ${accurateCount}</span> &nbsp;|&nbsp; 
            <span style="color: #4b5563; font-weight: 800;">● Outlier: ${outlierCount}</span>
        ` : `
            <span style="color: #10b981; font-weight: 700;">● Baseline: ${accurateCount}</span> &nbsp;|&nbsp; 
            <span style="color: #ef4444; font-weight: 700;">● Outlier: ${outlierCount}</span>
        `;
    }
}


/* ═══════════════════════════════════════════════════════════
   FEATURE 4: PRE-FORMATTED CLIENT EMAIL GENERATOR
   ═══════════════════════════════════════════════════════════ */

function initializeClientEmailModal() {
    const modalEl = document.getElementById('client-email-modal');
    const overlayEl = document.getElementById('client-email-overlay');
    const closeBtn = document.getElementById('client-email-close');
    const nameInput = document.getElementById('email-client-name');
    const addrInput = document.getElementById('email-client-address');
    const dateInput = document.getElementById('email-appt-date');
    const depositInput = document.getElementById('email-deposit-paid');
    const prepChk = document.getElementById('email-include-prep');
    const careChk = document.getElementById('email-include-care');
    const copyBtn = document.getElementById('copy-client-email-btn');
    const mailtoBtn = document.getElementById('send-client-mailto-btn');

    if (!modalEl) return;

    if (overlayEl) overlayEl.addEventListener('click', closeClientEmailModal);
    if (closeBtn) closeBtn.addEventListener('click', closeClientEmailModal);

    if (dateInput && !dateInput.value) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        dateInput.value = nextWeek.toISOString().split('T')[0];
    }

    const inputs = [nameInput, addrInput, dateInput, depositInput, prepChk, careChk];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', generateClientEmailText);
            input.addEventListener('change', generateClientEmailText);
        }
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const previewEl = document.getElementById('email-body-preview');
            if (previewEl) {
                previewEl.select();
                navigator.clipboard.writeText(previewEl.value).then(() => {
                    const origText = copyBtn.textContent;
                    copyBtn.textContent = T("toast_copied", "✅ Copied to Clipboard!");
                    setTimeout(() => copyBtn.textContent = origText, 2000);
                });
            }
        });
    }

    if (mailtoBtn) {
        mailtoBtn.addEventListener('click', function() {
            const addr = addrInput ? addrInput.value : '';
            const subject = encodeURIComponent('Your Tattoo Appointment Summary & Pre-Session Guide');
            const previewEl = document.getElementById('email-body-preview');
            const body = encodeURIComponent(previewEl ? previewEl.value : '');
            window.location.href = `mailto:${addr}?subject=${subject}&body=${body}`;
        });
    }
}

function openClientEmailModal() {
    const modalEl = document.getElementById('client-email-modal');
    if (modalEl) {
        modalEl.style.display = 'flex';
        generateClientEmailText();
    }
}

function closeClientEmailModal() {
    const modalEl = document.getElementById('client-email-modal');
    if (modalEl) modalEl.style.display = 'none';
}

function generateClientEmailText() {
    const clientName = document.getElementById('email-client-name')?.value || 'Valued Client';
    const apptDate = document.getElementById('email-appt-date')?.value || 'Upcoming Appointment';
    const depositPaid = document.getElementById('email-deposit-paid')?.value || '100';
    const includePrep = document.getElementById('email-include-prep')?.checked;
    const includeCare = document.getElementById('email-include-care')?.checked;

    const totalTimeEl = document.getElementById('session-total-time');
    const estimatedTime = totalTimeEl ? totalTimeEl.textContent : T("x.3_4_hours", "3 - 4 hours");

    const locationSelect = document.getElementById('body-location');
    const locName = locationSelect && locationSelect.selectedIndex >= 0 ? locationSelect.options[locationSelect.selectedIndex].text : 'Selected Area';

    let body = `Hi ${clientName},\n\n`;
    body += `Thank you for booking your upcoming tattoo session with us! Below is your appointment summary, estimated chair time, and preparation guidance:\n\n`;
    body += `--------------------------------------------------\n`;
    body += `📅 APPOINTMENT DETAILS & SUMMARY\n`;
    body += `--------------------------------------------------\n`;
    body += `• Scheduled Date: ${apptDate}\n`;
    body += `• Target Body Location: ${locName}\n`;
    body += `• Estimated Session Duration: ${estimatedTime}\n`;
    body += `• Deposit Received: $${depositPaid} (Applied toward session total)\n\n`;

    if (includePrep) {
        body += `--------------------------------------------------\n`;
        body += `🥣 PRE-SESSION PREPARATION CHECKLIST\n`;
        body += `--------------------------------------------------\n`;
        body += `1. Get a good 8 hours of sleep the night before.\n`;
        body += `2. Eat a heavy, carbohydrate-rich meal 1-2 hours before arriving.\n`;
        body += `3. Stay hydrated! Drink plenty of water in the 24 hours leading up.\n`;
        body += `4. Avoid alcohol, aspirin, or blood thinners for 24 hours prior.\n`;
        body += `5. Wear comfortable, loose-fitting clothing that allows easy access to your ${locName}.\n\n`;
    }

    if (includeCare) {
        body += `--------------------------------------------------\n`;
        body += `✨ IMMEDIATE AFTERCARE HIGHLIGHTS\n`;
        body += `--------------------------------------------------\n`;
        body += `• Keep wrap/bandage on as directed at the end of the sitting.\n`;
        body += `• Wash gently with fragrance-free antibacterial soap and warm water.\n`;
        body += `• Apply a paper-thin layer of recommended balm or ointment.\n`;
        body += `• DO NOT soak in pools, tubs, or submerge under water for 2 weeks.\n`;
        body += `• Keep out of direct sunlight during the entire healing process.\n\n`;
    }

    body += `Please reply to this email if you have any questions or need to reschedule.\n\n`;
    body += `See you in the studio!\n`;
    body += `Best regards,\n`;
    body += `Your Tattoo Artist`;

    const previewEl = document.getElementById('email-body-preview');
    if (previewEl) previewEl.value = body;
}

/* ═══════════════════════════════════════════════════════════
   INK CONSUMPTION: SMART NEEDLE & TECHNIQUE OPTIMIZATIONS
   ═══════════════════════════════════════════════════════════ */

function renderInkOptimizationSuggestions(data) {
    const container = document.getElementById('ink-optimization-container');
    if (!container) return;

    // Calculate pass optimization
    const currentPasses = data.passes || 2;
    const optPasses = Math.max(1, currentPasses - 1);
    const hasPassOptimization = currentPasses > 1;
    const passReductionSavingsRatio = hasPassOptimization ? (currentPasses - optPasses) / currentPasses : 0;
    const passSavingsMl = data.totalInk * passReductionSavingsRatio * 0.85; // accounts for dermal deposit vs waste
    const passSavingsCost = passSavingsMl * data.pricePerMl;

    // Calculate waste factor optimization
    const currentWasteMultiplier = WASTE_FACTORS[data.wasteFactor] || 1.4;
    const hasWasteOptimization = currentWasteMultiplier > 1.2;
    const wasteReductionMl = hasWasteOptimization 
        ? data.totalInk - (data.totalInk / currentWasteMultiplier * 1.2)
        : 0;
    const wasteReductionCost = wasteReductionMl * data.pricePerMl;

    // Needle configuration recommendation based on technique
    let needleRec = {
        title: "11CM / 13M1 Curved Magnum (Bugpin #10 0.30mm)",
        type: "Curved Soft-Edge Magnum",
        desc: "Arch curvature prevents sharp edge gouging and skin slicing. Delivers ultra-uniform dermal deposit in 1–2 consistent passes instead of 3+ passes, cutting splatter and napkin wipe loss by ~22%.",
        benefit: "~22% ink deposit efficiency & reduced skin trauma",
        badge: "Needle Config"
    };

    if (data.technique === 'lining') {
        needleRec = {
            title: "#10 (0.30mm) Long-Taper 7RL with Anti-Spit Cartridge",
            type: "Precision Bugpin Round Liner",
            desc: "Long taper creates crisp, tight micro-punctures. Cartridge reservoir membrane stops ink pooling at the tip, preventing accidental puddles and eliminating excess wipe waste.",
            benefit: "~15% less ink splatter & zero tip flooding",
            badge: "Needle Config"
        };
    } else if (data.technique === 'light-shading' || data.technique === 'medium-shading') {
        needleRec = {
            title: "9CM Curved Magnum + 4-Tier Graduated Greywash",
            type: "Soft-Edge Shader & Dilution Setup",
            desc: "Use a structured 4-drop / 8-drop / 16-drop / Full wash set with blending solution instead of dipping raw black into rinse cups. Provides buttery gradients with 28% less raw pigment.",
            benefit: "~28% black pigment reduction & smoother tone transition",
            badge: "Needle Config"
        };
    } else if (data.technique === 'color-blending') {
        needleRec = {
            title: "9RS / 11CM Hybrid with Texture Long-Taper",
            type: "Round Shader / Soft Curve Mag",
            desc: "Textured needles carry and release pigment smoothly without requiring high machine speed or repetitive surface cross-hatching, keeping color vibrant with less overall liquid.",
            benefit: "~20% reduction in color oversaturation",
            badge: "Needle Config"
        };
    }

    // Cumulative potential savings
    const totalPotentialSavingsMl = passSavingsMl + wasteReductionMl + (data.totalInk * 0.12);
    const totalPotentialSavingsPct = Math.min(55, Math.round((totalPotentialSavingsMl / data.totalInk) * 100));
    const totalPotentialSavingsCost = totalPotentialSavingsMl * data.pricePerMl;

    container.style.display = 'block';
    container.innerHTML = `
        <div class="ink-opt-header">
            <h4 class="ink-opt-title">
                <span>💡</span> Smart Needle & Technique Optimization Suggestions
            </h4>
            <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 20px; font-weight: 700;">
                Save up to ${totalPotentialSavingsPct}% Ink Volume
            </span>
        </div>

        <div class="ink-opt-summary-strip">
            <div class="ink-opt-summary-pill ink-opt-summary-pill--savings">
                <span class="ink-opt-pill-label">Potential Ink Saved</span>
                <span class="ink-opt-pill-value" style="color: #10b981;">-${totalPotentialSavingsMl.toFixed(1)} mL (-${totalPotentialSavingsPct}%)</span>
            </div>
            <div class="ink-opt-summary-pill">
                <span class="ink-opt-pill-label">Bottle Cost Savings</span>
                <span class="ink-opt-pill-value" style="color: #0693e3;">-$${totalPotentialSavingsCost.toFixed(2)} / session</span>
            </div>
            <div class="ink-opt-summary-pill ink-opt-summary-pill--skin">
                <span class="ink-opt-pill-label">Skin Trauma Reduction</span>
                <span class="ink-opt-pill-value" style="color: #ff006e;">${hasPassOptimization ? '-33% Cycle Passes' : 'Optimal Glide'}</span>
            </div>
        </div>

        <div class="ink-opt-grid">
            <!-- 1. Needle Recommendation -->
            <div class="ink-opt-item">
                <div>
                    <span class="ink-opt-item-badge ink-opt-item-badge--needle">🎯 ${needleRec.badge}</span>
                    <h5 class="ink-opt-item-title">${needleRec.title}</h5>
                    <p class="ink-opt-item-desc">${needleRec.desc}</p>
                </div>
                <div>
                    <div class="ink-opt-item-savings-line">✨ ${needleRec.benefit}</div>
                    <button type="button" class="ink-opt-apply-btn" onclick="applyInkOptimization('needle', '${data.technique}', '${needleRec.title}')">
                        <span>⚡</span> Recommended Setup: ${needleRec.type}
                    </button>
                </div>
            </div>

            <!-- 2. Pass Count & Technique Adjustment -->
            <div class="ink-opt-item">
                <div>
                    <span class="ink-opt-item-badge ink-opt-item-badge--technique">🔁 Technique & Passes</span>
                    <h5 class="ink-opt-item-title">
                        ${hasPassOptimization ? `Consolidate from ${currentPasses} Passes → ${optPasses} Passes` : `Optimal Single-Pass Dynamic (${currentPasses} Pass)`}
                    </h5>
                    <p class="ink-opt-item-desc">
                        ${hasPassOptimization 
                            ? `By utilizing a slightly longer stroke throw (3.8mm–4.0mm) and consistent 45° hand angle, you achieve rich saturation in ${optPasses} passes, saving ${passSavingsMl.toFixed(1)} mL of excess pigment and minimizing skin redness.`
                            : `Your current ${currentPasses}-pass setup is already highly tuned. Maintain steady machine voltage and pendulum hand speed to prevent ink wipe waste.`}
                    </p>
                </div>
                <div>
                    <div class="ink-opt-item-savings-line">
                        ${hasPassOptimization ? `💰 Saves ~$${passSavingsCost.toFixed(2)} (${passSavingsMl.toFixed(1)} mL) per session` : `✓ Optimal Pass Count`}
                    </div>
                    ${hasPassOptimization ? `
                    <button type="button" class="ink-opt-apply-btn" onclick="applyInkOptimization('passes', ${optPasses}, '${optPasses} Passes')">
                        <span>⚡</span> Apply ${optPasses} Passes Reduction
                    </button>` : `
                    <button type="button" class="ink-opt-apply-btn" style="opacity: 0.8; pointer-events: none;">
                        <span>✓</span> Already at Peak Pass Efficiency
                    </button>`}
                </div>
            </div>

            <!-- 3. Staging & Waste Factor Optimization -->
            <div class="ink-opt-item">
                <div>
                    <span class="ink-opt-item-badge ink-opt-item-badge--waste">♻️ Cap Staging & Anti-Waste</span>
                    <h5 class="ink-opt-item-title">
                        ${hasWasteOptimization ? `Switch to Micro-Cap Staging (Low 1.2x Waste)` : `Low Waste Multiplier (1.2x Active)`}
                    </h5>
                    <p class="ink-opt-item-desc">
                        ${hasWasteOptimization 
                            ? `Pour ink progressively in 1.5 mL #9 micro-caps instead of 5 mL deep wells. Use silicone membrane anti-spit cartridges to stop needle splatter, reducing waste factor from ${data.wasteFactor.toUpperCase()} down to Low.`
                            : `Great practice! Micro-caps and membrane cartridges keep ink residue in check with minimal wasted pigment.`}
                    </p>
                </div>
                <div>
                    <div class="ink-opt-item-savings-line">
                        ${hasWasteOptimization ? `💧 Recovers ~${wasteReductionMl.toFixed(1)} mL ($${wasteReductionCost.toFixed(2)}) from cap residue` : `✓ Optimal Cap Staging`}
                    </div>
                    ${hasWasteOptimization ? `
                    <button type="button" class="ink-opt-apply-btn" onclick="applyInkOptimization('waste', 'low', 'Low Waste (1.2x)')">
                        <span>⚡</span> Apply Low-Waste Cap Staging
                    </button>` : `
                    <button type="button" class="ink-opt-apply-btn" style="opacity: 0.8; pointer-events: none;">
                        <span>✓</span> Low Waste Staging Active
                    </button>`}
                </div>
            </div>
        </div>

        <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--color-border, #2e2e4a); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <span style="font-size: 0.8rem; color: var(--color-text-secondary);">
                Applying suggestions recalculates ink volume, caps needed, and bottle cost estimates instantly.
            </span>
            <button type="button" class="ink-opt-apply-btn" style="width: auto; padding: 0.5rem 1.25rem; background: linear-gradient(135deg, #0693e3 0%, #0073b7 100%); color: #ffffff; border: none; font-weight: 800;" onclick="applyAllInkOptimizations({ passes: ${optPasses}, waste: 'low' })">
                <span>⚡</span> Apply All Recommended Optimizations (-${totalPotentialSavingsPct}%)
            </button>
        </div>
    `;
}

function applyInkOptimization(field, value, label) {
    if (field === 'passes') {
        const passInput = document.getElementById('ink-passes');
        if (passInput) passInput.value = value;
    } else if (field === 'waste') {
        const wasteSelect = document.getElementById('waste-factor');
        if (wasteSelect) wasteSelect.value = value;
    } else if (field === 'needle') {
        // Show informative notification for needle setup
        showBrowserToast(`🎯 Setup applied: ${label}`, 'success');
        return;
    }

    // Trigger recalculation
    const inkForm = document.getElementById('ink-form');
    if (inkForm) {
        if (typeof inkForm.requestSubmit === 'function') {
            inkForm.requestSubmit();
        } else {
            const submitBtn = inkForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
        }
    }
    showBrowserToast(`⚡ Applied optimization: ${label}`, 'success');
}

function applyAllInkOptimizations(opts) {
    if (opts.passes) {
        const passInput = document.getElementById('ink-passes');
        if (passInput) passInput.value = opts.passes;
    }
    if (opts.waste) {
        const wasteSelect = document.getElementById('waste-factor');
        if (wasteSelect) wasteSelect.value = opts.waste;
    }

    const inkForm = document.getElementById('ink-form');
    if (inkForm) {
        if (typeof inkForm.requestSubmit === 'function') {
            inkForm.requestSubmit();
        } else {
            const submitBtn = inkForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
        }
    }
    showBrowserToast('⚡ Applied all recommended needle & pass optimizations!', 'success');
}

/* ═══════════════════════════════════════════════════════════
   GOOGLE CALENDAR SESSION EXPORT INTEGRATION
   ═══════════════════════════════════════════════════════════ */

function openGoogleCalendarModal() {
    const modalEl = document.getElementById('gcal-export-modal');
    if (!modalEl) return;

    // Get current Session Estimator inputs and calculated results
    const locationSelect = document.getElementById('body-location');
    const locName = (locationSelect && locationSelect.selectedIndex >= 0) ? locationSelect.options[locationSelect.selectedIndex].text : 'Tattoo Project';
    
    const widthEl = document.getElementById('tattoo-width');
    const heightEl = document.getElementById('tattoo-height');
    const width = widthEl ? widthEl.value : '6';
    const height = heightEl ? heightEl.value : '8';

    const complexitySelect = document.getElementById('complexity');
    const complexityName = (complexitySelect && complexitySelect.selectedIndex >= 0) ? complexitySelect.options[complexitySelect.selectedIndex].text : 'Medium Detail';

    const totalTimeEl = document.getElementById('session-total-time');
    const perSessionEl = document.getElementById('session-per-session');
    const sessionCountEl = document.getElementById('session-count');
    const timelineEl = document.getElementById('session-timeline');

    let durationHours = 3.5;
    if (perSessionEl && perSessionEl.textContent) {
        const parsed = parseFloat(perSessionEl.textContent);
        if (!isNaN(parsed) && parsed > 0) durationHours = parsed;
    } else if (totalTimeEl && totalTimeEl.textContent) {
        const parsed = parseFloat(totalTimeEl.textContent);
        if (!isNaN(parsed) && parsed > 0) durationHours = parsed;
    }

    // Pre-populate Form Fields
    const titleInput = document.getElementById('gcal-event-title');
    if (titleInput) {
        titleInput.value = TP("x.tattoo_session_hrs", "Tattoo Session: {0} ({1} hrs)", locName, durationHours);
    }

    const durationInput = document.getElementById('gcal-event-duration');
    if (durationInput) {
        durationInput.value = durationHours.toFixed(1);
    }

    // Default date to tomorrow
    const dateInput = document.getElementById('gcal-event-date');
    if (dateInput && !dateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Default time
    const timeInput = document.getElementById('gcal-event-time');
    if (timeInput && !timeInput.value) {
        timeInput.value = '10:00';
    }

    // Build comprehensive structured event notes
    const totalTimeStr = totalTimeEl ? totalTimeEl.textContent : TP("x.hours", "{0} hours", durationHours);
    const countStr = sessionCountEl ? sessionCountEl.textContent : T("x.1_session", "1 session");
    const timelineStr = timelineEl ? timelineEl.textContent : T("x.1_2_weeks", "1 - 2 weeks");

    const notesText = `══════════════════════════════════════════════
TATTOO SESSION APPOINTMENT SPECIFICATIONS
══════════════════════════════════════════════
• Body Location: ${locName}
• Artwork Size: ${width}" × ${height}" (${(parseFloat(width) * parseFloat(height)).toFixed(1)} sq in)
• Complexity: ${complexityName}
• Scheduled Sitting: ${durationHours} Chair Hours
• Total Project Time: ${totalTimeStr} (${countStr})
• Recommended Healing Interval: ${timelineStr}

──────────────────────────────────────────────
ARTIST PREPARATION CHECKLIST
──────────────────────────────────────────────
[ ] Workstation sanitized & barrier film applied
[ ] Needle cartridge configurations & backup boxes verified
[ ] Ink caps poured with appropriate pigment series & wash dilutions
[ ] Power supply, clip cord sleeves & foot pedal inspected
[ ] Stencil printed, sized & skin prepped with stencil transfer solution

──────────────────────────────────────────────
CLIENT APPOINTMENT INSTRUCTIONS
──────────────────────────────────────────────
1. Sleep: Ensure a restful 8-hour sleep prior to session.
2. Nutrition: Eat a substantial meal 1–2 hours before arriving.
3. Hydration: Drink plenty of water; avoid caffeine & energy drinks.
4. Substances: No alcohol, aspirin, or ibuprofen for 24h before sitting.
5. Attire: Wear comfortable, loose clothing allowing clear access to ${locName}.

Generated via Poli International Tattoo Coverage Suite`;

    const notesInput = document.getElementById('gcal-event-notes');
    if (notesInput) {
        notesInput.value = notesText;
    }

    // Update real-time links & calculated display
    updateGoogleCalendarLinks();

    // Show modal
    modalEl.style.display = 'flex';
}

function closeGoogleCalendarModal() {
    const modalEl = document.getElementById('gcal-export-modal');
    if (modalEl) modalEl.style.display = 'none';
}

function updateGoogleCalendarLinks() {
    const titleInput = document.getElementById('gcal-event-title');
    const clientInput = document.getElementById('gcal-client-name');
    const dateInput = document.getElementById('gcal-event-date');
    const timeInput = document.getElementById('gcal-event-time');
    const durationInput = document.getElementById('gcal-event-duration');
    const locationInput = document.getElementById('gcal-event-location');
    const notesInput = document.getElementById('gcal-event-notes');

    const title = titleInput ? titleInput.value.trim() || 'Tattoo Session' : 'Tattoo Session';
    const client = clientInput ? clientInput.value.trim() : '';
    const dateVal = dateInput && dateInput.value ? dateInput.value : new Date().toISOString().slice(0, 10);
    const timeVal = timeInput && timeInput.value ? timeInput.value : '10:00';
    const durationHours = durationInput ? (parseFloat(durationInput.value) || 3.5) : 3.5;
    const location = locationInput ? locationInput.value.trim() : '';
    const notes = notesInput ? notesInput.value : '';

    // Calculate start Date
    const [year, month, day] = dateVal.split('-').map(Number);
    const [startHour, startMin] = timeVal.split(':').map(Number);
    const startDate = new Date(year, month - 1, day, startHour, startMin, 0);

    // Calculate end Date based on duration
    const durationMs = durationHours * 3600 * 1000;
    const endDate = new Date(startDate.getTime() + durationMs);

    // Update Window display
    const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const windowDisplayEl = document.getElementById('gcal-window-display');
    if (windowDisplayEl) {
        windowDisplayEl.textContent = `${formatTime(startDate)} – ${formatTime(endDate)}`;
    }

    const hoursDisplayEl = document.getElementById('gcal-hours-display');
    if (hoursDisplayEl) {
        hoursDisplayEl.textContent = TP("x.hrs_2", "{0} hrs", durationHours.toFixed(1));
    }

    // Format ISO strings for Google Calendar: YYYYMMDDTHHmmSS
    const pad = (n) => String(n).padStart(2, '0');
    const toGCalIso = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const startGCal = toGCalIso(startDate);
    const endGCal = toGCalIso(endDate);

    const fullTitle = client ? `${title} - ${client}` : title;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(fullTitle)}&dates=${startGCal}/${endGCal}&details=${encodeURIComponent(notes)}&location=${encodeURIComponent(location)}`;

    const directLink = document.getElementById('gcal-direct-link');
    if (directLink) {
        directLink.href = gcalUrl;
    }
}

function downloadIcsCalendarFile() {
    const titleInput = document.getElementById('gcal-event-title');
    const clientInput = document.getElementById('gcal-client-name');
    const dateInput = document.getElementById('gcal-event-date');
    const timeInput = document.getElementById('gcal-event-time');
    const durationInput = document.getElementById('gcal-event-duration');
    const locationInput = document.getElementById('gcal-event-location');
    const notesInput = document.getElementById('gcal-event-notes');

    const title = titleInput ? titleInput.value.trim() || 'Tattoo Session' : 'Tattoo Session';
    const client = clientInput ? clientInput.value.trim() : '';
    const dateVal = dateInput && dateInput.value ? dateInput.value : new Date().toISOString().slice(0, 10);
    const timeVal = timeInput && timeInput.value ? timeInput.value : '10:00';
    const durationHours = durationInput ? (parseFloat(durationInput.value) || 3.5) : 3.5;
    const location = locationInput ? locationInput.value.trim() : '';
    const notes = notesInput ? notesInput.value : '';

    const [year, month, day] = dateVal.split('-').map(Number);
    const [startHour, startMin] = timeVal.split(':').map(Number);
    const startDate = new Date(year, month - 1, day, startHour, startMin, 0);
    const endDate = new Date(startDate.getTime() + durationHours * 3600 * 1000);

    const pad = (n) => String(n).padStart(2, '0');
    const toIcsIso = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const fullTitle = client ? `${title} - ${client}` : title;
    const cleanNotes = notes.replace(/\n/g, '\\n');

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Poli International//Tattoo Coverage Calculator//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@tattoocoveragecalculator.com`,
        `DTSTAMP:${toIcsIso(new Date())}`,
        `DTSTART:${toIcsIso(startDate)}`,
        `DTEND:${toIcsIso(endDate)}`,
        `SUMMARY:${fullTitle}`,
        `DESCRIPTION:${cleanNotes}`,
        `LOCATION:${location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tattoo-session-${dateVal}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showBrowserToast('📅 Downloaded .ICS calendar file successfully!', 'success');
}

function copyGoogleCalendarDetails() {
    const notesInput = document.getElementById('gcal-event-notes');
    const titleInput = document.getElementById('gcal-event-title');
    const windowDisplayEl = document.getElementById('gcal-window-display');

    const text = TP("x.ntime_window_n_n", "{0}\\nTime Window: {1}\\n\\n{2}", titleInput ? titleInput.value : 'Tattoo Session', windowDisplayEl ? windowDisplayEl.textContent : '', notesInput ? notesInput.value : '');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showBrowserToast('📋 Copied appointment details to clipboard!', 'success');
        }).catch(() => {
            showBrowserToast('📋 Copied appointment details!', 'info');
        });
    } else {
        showBrowserToast('📋 Details ready to copy', 'info');
    }
}

// Attach Escape key listener to close Google Calendar modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGoogleCalendarModal();
    }
});

