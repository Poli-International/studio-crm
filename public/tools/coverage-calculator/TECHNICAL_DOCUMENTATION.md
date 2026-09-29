# Coverage Calculator - Technical Documentation

**Version:** 2.3.0  
**Last Updated:** 2026  
**Maintainer:** Poli International Co.  
**Supported Languages (7):** `[🇬🇧 English] • [🇫🇷 Français] • [🇮🇹 Italiano] • [🇩🇪 Deutsch] • [🇪🇸 Español] • [🇳🇱 Nederlands] • [🇵🇹 Português]`

---

## 🌐 Multilingual Technical Summary / Résumé Technique Multilingue / Riepilogo Tecnico Multilingue / Mehrsprachige Technische Zusammenfassung / Resumen Técnico Multilingüe / Meertalige Technische Samenvatting / Resumo Técnico Multilíngue

| Language | Module Overview & Latest Feature Architecture |
|---|---|
| 🇬🇧 **English** | Vanilla ES6+ architecture with dynamic 7-language I18N engine, Chart.js saturation trend curves with 35%/65% clinical threshold lines & baseline deviation alerts, multi-session master planning engine with batch aggregation, and certified client PDF consultation reports with signature blocks. |
| 🇫🇷 **Français** | Architecture modulaire JavaScript sans dépendance lourde, moteur de traduction DOM à 7 langues, analyse de saturation Chart.js avec seuils cliniques (35%/65%) et alertes de déviation, planificateur de projets multi-séances par lot et rapports techniques PDF certifiés avec blocs de signature. |
| 🇮🇹 **Italiano** | Architettura frontend modulare in puro JavaScript, motore I18N a 7 lingue, grafici di tendenza della saturazione Chart.js con soglie cliniche (35%/65%) e deviazione dallo standard di studio, modulo di pianificazione multi-seduta e generazione report PDF per clienti con firma. |
| 🇩🇪 **Deutsch** | Reine JavaScript-Architektur mit integrierter 7-Sprachen-I18N-Engine, interaktiver Chart.js-Sättigungsanalyse inklusive klinischer Schwellenwertlinien (35%/65%) und Studio-Abweichungswarnungen, Mehrfachsitzungs-Projektplaner mit Batch-Aggregation und PDF-Kundenprotokollen mit Unterschriftsfeldern. |
| 🇪🇸 **Español** | Arquitectura en JavaScript vanilla con motor I18N para 7 idiomas, analítica de curvas de saturación en Chart.js con líneas de umbral clínico (35%/65%) y alertas de desviación del estudio, planificador de proyectos multi-sesión con selección por lotes y reportes de consulta en PDF con firmas. |
| 🇳🇱 **Nederlands** | Modulaire vanilla JavaScript-architectuur met 7-talige I18N-engine, interactieve Chart.js verzadigingstrendanalyse met klinische drempellijnen (35%/65%) en afwijkingswaarschuwingen, projectplanner voor meerdere sessies met batchaggregatie en gecertificeerde PDF-klantspecificaties met handtekeningblokken. |
| 🇵🇹 **Português** | Arquitetura em JavaScript puro com motor I18N em 7 idiomas, análise de saturação com Chart.js com limites clínicos (35%/65%) e alertas de desvio de bancada, planejador de projetos multi-sessão com agregação em lote e emissão de laudos técnicos em PDF com assinatura. |

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Global Multilanguage Engine (I18N)](#global-multilanguage-engine-i18n)
3. [Database Schemas](#database-schemas)
4. [Calculation Algorithms](#calculation-algorithms)
5. [Advanced Analytics & Chart.js Engine](#advanced-analytics--chartjs-engine)
6. [Multi-Session Project Master Planning Engine](#multi-session-project-master-planning-engine)
7. [Certified Client PDF Documentation Generator](#certified-client-pdf-documentation-generator)
8. [API Reference](#api-reference)
9. [Integration Guide](#integration-guide)
10. [Customization Options](#customization-options)
11. [Performance Optimization](#performance-optimization)
12. [Testing & Validation](#testing--validation)
13. [Version History](#version-history)

---

## Architecture Overview

### Technology Stack

**Frontend:**
- Pure JavaScript (ES6+)
- Global I18N Translation Engine (`/js/i18n.js`) with 7-language support
- CSS3 with Custom Properties and Theme Switching
- Semantic HTML5 with `data-i18n` attribute binding
- No heavy frameworks or build dependencies needed

**Storage & Persistence:**
- `localStorage` for theme (`coverage-app-theme`), unit preference (`coverage-calculator-unit`), history, and language persistence (`coverage-app-lang`).
- Client-side only calculation engine.

**Compatibility:**
- ES6+ browsers (Chrome, Firefox, Safari, Edge, mobile browsers)
- Fully responsive (320px to 4K ultra-wide)

### File Structure

```
coverage-calculator/
├── index.html              # Main standalone application with 7-lang switcher
├── embed.html              # Embeddable widget version
├── css/
│   └── style.css          # Core CSS stylesheet
├── js/
│   ├── i18n.js            # 7-Language Internationalization engine & dictionary
│   ├── calculator.js      # Core calculation algorithms & databases
│   └── feedback.js        # Feedback widget
└── images/                # Logos and vector assets
```

---

## Global Multilanguage Engine (I18N)

The application incorporates a lightweight, dependency-free internationalization system exposed on `window.I18N`.

### Supported Locales:
- `en`: 🇬🇧 English (Default)
- `fr`: 🇫🇷 Français
- `it`: 🇮🇹 Italiano
- `de`: 🇩🇪 Deutsch
- `es`: 🇪🇸 Español
- `nl`: 🇳🇱 Nederlands
- `pt`: 🇵🇹 Português

### Mechanism:
1. **HTML Attribute Binding**: Elements declare translations using:
   - `data-i18n="key"`: Replaces `textContent` or `innerHTML`.
   - `data-i18n-placeholder="key"`: Translates input/search placeholders.
   - `data-i18n-title="key"`: Translates tooltips and title tags.
   - `data-i18n-aria="key"`: Translates accessibility `aria-label`s.
2. **Dynamic Key Resolution**: Code queries translations via `window.I18N.t('key')` or `I18N.getTranslation(key, lang)`.
3. **Event Dispatching**: Emits `languageChanged` event with `{ language }` payload so charts, converters, and dynamic widgets re-render instantly.
4. **Persistence**: Automatically syncs with `localStorage['coverage-app-lang']` and detects system browser language.

### Component Architecture

```
┌─────────────────────────────────────┐
│         User Interface              │
│  (Tab Navigation + Forms)           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Calculator Engine              │
│  (Event Handlers + Validation)      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       Database Layer                │
│  (Needle Rates + Body Factors)      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│     Calculation Functions           │
│  (Coverage + Session + Ink + Price) │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Results Display                │
│  (Dynamic HTML Generation)          │
└─────────────────────────────────────┘
```

---

## Database Schemas

### Needle Coverage Rates Database

**Object:** `NEEDLE_COVERAGE_RATES`
**Total Entries:** 18 needle configurations

**Schema:**
```javascript
{
  needle_id: {
    type: string,              // 'liner' | 'shader' | 'magnum' | 'curved-magnum' | 'flat'
    name: string,              // Display name
    needles: number,           // Number of needles in configuration
    width_mm: number,          // Physical width in millimeters
    coverage_rate: {
      slow: number,            // Square inches per hour (slow/detailed work)
      medium: number,          // Square inches per hour (standard pace)
      fast: number             // Square inches per hour (fast coverage)
    },
    best_for: string,          // Usage description
    typical_use: string,       // Common applications (optional)
    passes_required: number,   // Standard number of passes
    ink_efficiency: string     // 'low' | 'medium' | 'good' | 'excellent'
  }
}
```

**Example Entry:**
```javascript
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
}
```

**Coverage Rate Calculation:**
- **Slow:** Detailed work, 40-50 passes per inch
- **Medium:** Standard work, 25-35 passes per inch
- **Fast:** Coverage work, 15-25 passes per inch

**Data Sources:**
- Professional artist surveys
- Manufacturer specifications
- Industry standard practices

---

### Body Location Factors Database

**Object:** `BODY_LOCATION_FACTORS`
**Total Entries:** 15 body locations

**Schema:**
```javascript
{
  location_id: {
    difficulty: string,        // 'easy' | 'moderate' | 'difficult'
    name: string,              // Display name
    time_multiplier: number,   // Time adjustment factor (0.8 - 2.2)
    pain_level: string,        // 'low' | 'medium' | 'high' | 'very-high'
    typical_session: number,   // Max recommended session hours
    break_frequency: string,   // 'minimal' | 'normal' | 'frequent' | 'very-frequent'
    notes: string              // Special considerations (optional)
  }
}
```

**Example Entry:**
```javascript
'ribs': {
  difficulty: 'difficult',
  name: 'Ribs',
  time_multiplier: 2.0,
  pain_level: 'very-high',
  typical_session: 2.0,
  break_frequency: 'very-frequent',
  notes: 'Extremely painful, skin moves with breathing'
}
```

**Difficulty Categories:**
- **Easy (1.0-1.1x):** Outer arm, outer thigh, calf, shoulder
- **Moderate (1.2-1.4x):** Inner arm, forearm, back, chest
- **Difficult (1.6-2.2x):** Ribs, spine, feet, hands, neck, face

---

### Complexity Factors Database

**Object:** `COMPLEXITY_FACTORS`
**Total Entries:** 5 complexity levels

**Schema:**
```javascript
{
  complexity_id: {
    time_multiplier: number,   // Time adjustment (0.8 - 2.5)
    price_adjustment: {
      min: number,             // Minimum price adjustment (0 - 0.5)
      max: number              // Maximum price adjustment (0.1 - 1.0)
    }
  }
}
```

**Complexity Levels:**
```javascript
'simple': {
  time_multiplier: 0.8,
  price_adjustment: { min: 0, max: 0.10 }
},
'moderate': {
  time_multiplier: 1.0,
  price_adjustment: { min: 0.10, max: 0.20 }
},
'detailed': {
  time_multiplier: 1.4,
  price_adjustment: { min: 0.20, max: 0.30 }
},
'highly-detailed': {
  time_multiplier: 1.8,
  price_adjustment: { min: 0.30, max: 0.50 }
},
'masterwork': {
  time_multiplier: 2.5,
  price_adjustment: { min: 0.50, max: 1.0 }
}
```

---

### Ink Consumption Rates Database

**Object:** `INK_CONSUMPTION_RATES`
**Total Entries:** 6 tattooing techniques

**Schema:**
```javascript
{
  technique_id: {
    base_rate: number,         // ml per square inch
    saturation: {
      light: number,           // Saturation multiplier (0.6 - 0.8)
      medium: number,          // Saturation multiplier (1.0)
      heavy: number            // Saturation multiplier (1.2 - 1.5)
    },
    waste_factor: number       // Waste multiplier (1.2 - 1.5)
  }
}
```

**Example Entry:**
```javascript
'shading': {
  base_rate: 0.15,
  saturation: {
    light: 0.6,
    medium: 1.0,
    heavy: 1.5
  },
  waste_factor: 1.3
}
```

---

## Calculation Algorithms

### Coverage Area Calculator

**Formula:**
```javascript
effectiveHours = sessionHours - (breakTime / 60 * sessionHours)
baseCoverageRate = NEEDLE_COVERAGE_RATES[needle].coverage_rate[speed]
totalCoverage = baseCoverageRate * effectiveHours
adjustedCoverage = totalCoverage / passes
```

**Parameters:**
- `needle`: Needle configuration ID (string)
- `speed`: Work speed ('slow' | 'medium' | 'fast')
- `sessionHours`: Total session time in hours (0.5 - 12)
- `breakTime`: Minutes of breaks per hour (0 - 30)
- `passes`: Number of passes over area (1 - 5)

**Returns:**
```javascript
{
  coverage_imperial: number,     // Square inches
  coverage_metric: number,       // Square centimeters
  effective_hours: number,       // Actual working time
  coverage_per_hour: number,     // Base rate
  passes: number,                // Number of passes
  comparison: string             // Size comparison text
}
```

**Example:**
```javascript
Input:
- needle: '9M1'
- speed: 'medium'
- sessionHours: 4
- breakTime: 10
- passes: 2

Calculation:
- effectiveHours = 4 - (10/60 * 4) = 3.33 hours
- baseCoverageRate = 20 sq in/hour
- totalCoverage = 20 * 3.33 = 66.6 sq in
- adjustedCoverage = 66.6 / 2 = 33.3 sq in

Output:
- coverage_imperial: 33.3
- coverage_metric: 214.8 (33.3 * 6.4516)
- effective_hours: 3.33
- coverage_per_hour: 20
- passes: 2
```

---

### Session Time Estimator

**Formula:**
```javascript
totalArea = width * height
baseTime = totalArea / BASE_NEEDLE_RATE
adjustedTime = baseTime * complexityMultiplier * locationMultiplier * colorMultiplier * toleranceMultiplier
totalTime = adjustedTime * BUFFER_FACTOR
sessionsNeeded = Math.ceil(totalTime / typicalSessionLength)
```

**Constants:**
```javascript
BASE_NEEDLE_RATE = 20          // sq in/hr (9M1 medium speed)
BUFFER_FACTOR = 1.15           // 15% time buffer
```

**Multipliers:**
```javascript
colorMultiplier = {
  'blackwork': 1.0,
  'minimal-color': 1.2,
  'full-color': 1.5
}

toleranceMultiplier = {
  'low': 1.3,
  'medium': 1.0,
  'high': 0.85
}
```

**Parameters:**
- `width`: Tattoo width in inches
- `height`: Tattoo height in inches
- `complexity`: Complexity ID from COMPLEXITY_FACTORS
- `bodyLocation`: Location ID from BODY_LOCATION_FACTORS
- `colorWork`: Color type ('blackwork' | 'minimal-color' | 'full-color')
- `painTolerance`: Tolerance level ('low' | 'medium' | 'high')

**Returns:**
```javascript
{
  total_hours: number,           // Total estimated time
  sessions_needed: number,       // Number of sessions
  hours_per_session: number,     // Average session length
  total_area: number,            // Square inches
  complexity_factor: number,     // Applied multiplier
  location_factor: number,       // Applied multiplier
  base_time: number              // Time before adjustments
}
```

---

### Ink Consumption Calculator

**Formula:**
```javascript
totalArea = width * height
baseInk = totalArea * techniqueRate
saturationAdjusted = baseInk * saturationMultiplier
passesAdjusted = saturationAdjusted * passes
totalInk = passesAdjusted * wasteFactor
inkPerColor = totalInk / colors
capsPerColor = Math.ceil(inkPerColor / CAP_SIZE)
```

**Constants:**
```javascript
CAP_SIZE = 15                  // ml per ink cap
```

**Parameters:**
- `width`: Area width in inches
- `height`: Area height in inches
- `technique`: Technique ID from INK_CONSUMPTION_RATES
- `saturation`: Saturation level ('light' | 'medium' | 'heavy')
- `colors`: Number of colors (1 - 20)
- `passes`: Number of passes (1 - 5)

**Returns:**
```javascript
{
  total_ml: number,              // Total ink for all colors
  ml_per_color: number,          // Ink per individual color
  total_caps: number,            // Total caps needed
  caps_per_color: number,        // Caps per color
  total_area: number,            // Square inches
  waste_factor: number,          // Applied waste multiplier
  technique_rate: number         // Base consumption rate
}
```

---

### Pricing Calculator

**Formula:**
```javascript
basePrice = hours * hourlyRate
minAdjustment = basePrice * complexityFactor.price_adjustment.min
maxAdjustment = basePrice * complexityFactor.price_adjustment.max
minPrice = basePrice + minAdjustment
maxPrice = basePrice + maxAdjustment
midPrice = (minPrice + maxPrice) / 2
depositAmount = midPrice * (depositPercent / 100)
perSessionMin = minPrice / sessions
perSessionMax = maxPrice / sessions
```

**Parameters:**
- `hours`: Estimated total hours
- `hourlyRate`: Shop hourly rate ($50 - $500)
- `complexity`: Complexity ID from COMPLEXITY_FACTORS
- `depositPercent`: Deposit percentage (10 - 100)
- `sessions`: Number of sessions (1 - 20)

**Returns:**
```javascript
{
  min_price: number,             // Conservative estimate
  target_price: number,          // Recommended quote
  max_price: number,             // Upper range
  deposit_amount: number,        // Required deposit
  per_session_min: number,       // Min per session
  per_session_max: number,       // Max per session
  base_price: number,            // Price before adjustments
  complexity_adjustment: {
    min: number,
    max: number
  }
}
```

---

## Advanced Analytics & Chart.js Engine

### Saturation Trend Progression Architecture

The application implements a responsive Chart.js line chart rendered in `#saturation-trend-line-chart` that tracks ink saturation trends across calculation iterations.

#### Clinical Threshold Datasets
The chart renders three reference threshold levels alongside the primary session progression curve:
1. **Light Saturation / Fine Line Benchmark (35%)**: Dashed emerald line (`#10b981`) indicating delicate low-trauma linework with minimal dermal dwell.
2. **Heavy Solid Saturation Benchmark (65%)**: Dashed neon pink line (`#ff006e`) indicating dense pigment packing requiring careful pass control and extended recovery.
3. **Studio Historical Mean Baseline**: Dashed amber line (`#f59e0b`) dynamically computed from the rolling average of stored calculation records.

#### Data Schema & Point Hover Tooltip
```javascript
{
  labels: ['#1 (1RL)', '#2 (9M1)', ...],
  datasets: [
    {
      label: 'Session Saturation (%)',
      data: [18, 54, 82, ...],
      borderColor: '#ff006e',
      backgroundColor: 'rgba(255, 0, 110, 0.12)',
      pointHoverRadius: 7,
      pointRadius: 4,
      fill: true
    },
    { label: 'Heavy Saturation (65%)', data: [65, 65, ...], borderDash: [5, 4] },
    { label: 'Studio Baseline', data: [mean, mean, ...], borderDash: [3, 3] },
    { label: 'Light Saturation (35%)', data: [35, 35, ...], borderDash: [5, 4] }
  ]
}
```

#### Deviation Detection & Real-time Warning Logic
```javascript
const studioAvg = history.reduce((acc, h) => acc + h.saturationPercent, 0) / history.length;
const currentSat = currentCalc.saturationPercent;
const delta = currentSat - studioAvg;

if (Math.abs(delta) >= 20) {
  const isHigh = delta > 0;
  // Triggers dynamic warning badge and clinical advisory alert
  alertBadge.textContent = isHigh ? `+${Math.round(delta)}% Above Studio Avg` : `-${Math.round(Math.abs(delta))}% Below Studio Avg`;
  alertBanner.innerHTML = `⚠️ <strong>High Saturation Variance</strong>: Current configuration (${currentSat}%) differs from your studio baseline (${Math.round(studioAvg)}%). Review pass counts and stretch technique.`;
}
```

---

## Multi-Session Project Master Planning Engine

### Architecture & Data Aggregation
The multi-session planner allows tattoo artists and clients to select multiple historical calculation records using checkboxes to generate unified project specifications for large-scale tattoo works (sleeves, backpieces, multi-pass realism).

#### Aggregation Formulas:
```javascript
// Cumulative Surface Area
totalProjectAreaSqin = selectedRecords.reduce((sum, r) => sum + r.areaSqin, 0);
totalProjectAreaSqcm = totalProjectAreaSqin * 6.4516;

// Cumulative Chair Time
totalProjectHours = selectedRecords.reduce((sum, r) => sum + r.estHours, 0);
totalProjectMins = Math.round(totalProjectHours * 60);

// Volumetric Pigment Aggregation
totalNetMl = selectedRecords.reduce((sum, r) => sum + r.netMl, 0);
totalGrossMl = selectedRecords.reduce((sum, r) => sum + r.grossMl, 0);
totalCaps = Math.max(1, Math.ceil(totalGrossMl / 1.5));
totalGrossFloz = totalGrossMl * 0.033814;

// Financial Estimate
hourlyRate = userHourlyRate || 150;
projectMinQuote = totalProjectHours * hourlyRate;
projectTargetQuote = projectMinQuote * 1.2;
recommendedDeposit = projectTargetQuote * 0.25;
```

#### Clinical Staging & Healing Protocol
- **Interval Recommendation**: 14–21 calendar days between trauma passes on identical tissue zones.
- **Stage Progression**: Session 1 (Structural Linework & Outlines) → Session 2 (Primary Dark Core Shading) → Session 3 (Color Packing & Soft Feathering) → Session 4 (High-Trauma Solid Blacks & White Highlights).
- **Bio-Buffer Allowance**: +15% chair buffer for pain resets, skin stretching relief, and dermal redness reduction.

#### Multi-Format Export Endpoints:
- **`exportSelectedRecordsCSV()`**: Generates tabular CSV file of selected sessions.
- **`copyMultiSessionMarkdownPlan()`**: Copies formatted Markdown summary table to system clipboard.
- **`generateMultiSessionMasterPDF()`**: Builds multi-page client and studio master project summary PDF.

---

## Certified Client PDF Documentation Generator

### Engine & jsPDF Vector Layout
Built on `window.jspdf.jsPDF`, generating a high-resolution A4 vector document (`210mm × 297mm`) suitable for professional studio archives and client consultations.

#### Document Architecture:
1. **Header Branding Bar**: Slate-900 background (`rgb(15, 23, 42)`) with Poli neon-pink accent underline (`#ff006e`), studio seal, and unique document tracking reference ID (`POLI-DOC-XXXXXX`).
2. **Session Parameters & Needle Configuration Panel**: Two-column layout documenting needle type, speed, target skin area (dual `sq in` and `cm²`), estimated duration in hours/minutes, ink density rating, and unit deposition volume.
3. **Volumetric Dispensing & Reservoir Loss Table**: Itemized breakdown of Net Dermal Pigment, Cartridge Reservoir Overhead (+14% to +26% friction buffer), Gross Setup Volume (mL & fl oz), and 1.5 mL ink cap counts.
4. **Clinical Healing & Trauma Profile**:
   - Trauma Index rating (1.0 to 5.0 scale)
   - Needle dwell profile (Superficial vs. Mid-Dermis vs. Multi-Pass Deep Dermal)
   - Estimated epidermal re-epithelialization timeline (7–10 days, 12–16 days, or 18–25+ days)
   - SecondSkin / breathable barrier film aftercare specifications
5. **Artist & Client Sign-Off Block**: Verification disclaimer and physical dual-signature lines for studio liability and informed consent.

---

## API Reference

### Public Functions

#### `handleCoverageCalculation(event)`

Processes coverage calculator form submission.

**Parameters:**
- `event` (Event): Form submit event

**Returns:** void

**Side Effects:**
- Displays results in `#coverage-results` element
- Validates all form inputs
- Shows error messages for invalid inputs

**Example:**
```javascript
document.getElementById('coverage-form').addEventListener('submit', handleCoverageCalculation);
```

---

#### `handleSessionCalculation(event)`

Processes session time estimator form submission.

**Parameters:**
- `event` (Event): Form submit event

**Returns:** void

**Example:**
```javascript
document.getElementById('session-form').addEventListener('submit', handleSessionCalculation);
```

---

#### `handleInkCalculation(event)`

Processes ink consumption calculator form submission.

**Parameters:**
- `event` (Event): Form submit event

**Returns:** void

---

#### `handlePricingCalculation(event)`

Processes pricing calculator form submission.

**Parameters:**
- `event` (Event): Form submit event

**Returns:** void

---

#### `initializeTheme()`

Initializes theme toggle and loads saved preference from localStorage.

**Returns:** void

**Storage Key:** `coverage-calculator-theme`

**Example:**
```javascript
// Called on DOMContentLoaded
initializeTheme();

// Manually toggle theme
document.body.classList.toggle('light-mode');
localStorage.setItem('coverage-calculator-theme', 'light');
```

---

#### `initializeTabNavigation()`

Sets up tab switching functionality.

**Returns:** void

**Example:**
```javascript
// Called on DOMContentLoaded
initializeTabNavigation();

// Programmatically switch tabs
const sessionTab = document.querySelector('[data-tab="session"]');
sessionTab.click();
```

---

### Private Helper Functions

#### `displayCoverageResults(data)`

Generates and displays coverage calculation results.

**Parameters:**
- `data` (Object): Calculation results object

**Returns:** void

---

#### `displaySessionResults(data)`

Generates and displays session time estimation results.

---

#### `displayInkResults(data)`

Generates and displays ink consumption results.

---

#### `displayPricingResults(data)`

Generates and displays pricing calculation results.

---

## Integration Guide

### Standalone Embedding

**Full Page Integration:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Coverage Calculator</title>
    <link rel="stylesheet" href="coverage-calculator/css/style.css">
</head>
<body>
    <div id="calculator-container">
        <!-- Include full index.html content here -->
    </div>
    <script src="coverage-calculator/js/calculator.js"></script>
</body>
</html>
```

**iFrame Embedding:**
```html
<iframe src="https://yoursite.com/coverage-calculator/embed.html"
        width="100%"
        height="900"
        frameborder="0"
        loading="lazy">
</iframe>
```

---

### WordPress Integration

**Shortcode Registration:**
```php
function coverage_calculator_shortcode($atts) {
    $atts = shortcode_atts(array(
        'theme' => 'dark',
        'default_tab' => 'coverage',
        'show_branding' => 'yes'
    ), $atts);

    ob_start();
    include 'path/to/calculator-template.php';
    return ob_get_clean();
}
add_shortcode('coverage_calculator', 'coverage_calculator_shortcode');
```

**Usage:**
```
[coverage_calculator theme="dark" default_tab="coverage"]
```

---

### React Integration

```javascript
import { useEffect, useRef } from 'react';

function CoverageCalculator({ theme = 'dark', defaultTab = 'coverage' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        // Load calculator script
        const script = document.createElement('script');
        script.src = '/calculator/js/calculator.js';
        script.async = true;
        document.body.appendChild(script);

        // Set theme class
        if (theme === 'light') {
            containerRef.current.classList.add('light-mode');
        }

        return () => {
            document.body.removeChild(script);
        };
    }, [theme]);

    return (
        <div ref={containerRef} className="coverage-calculator-wrapper">
            {/* Include calculator HTML */}
        </div>
    );
}
```

---

### Vue.js Integration

```javascript
<template>
    <div :class="['calculator-wrapper', themeClass]" ref="calculatorContainer">
        <!-- Include calculator HTML -->
    </div>
</template>

<script>
export default {
    props: {
        theme: {
            type: String,
            default: 'dark'
        },
        defaultTab: {
            type: String,
            default: 'coverage'
        }
    },
    computed: {
        themeClass() {
            return this.theme === 'light' ? 'light-mode' : '';
        }
    },
    mounted() {
        // Initialize calculator
        const script = document.createElement('script');
        script.src = '/calculator/js/calculator.js';
        document.body.appendChild(script);
    }
}
</script>
```

---

## Customization Options

### CSS Custom Properties

The calculator uses CSS custom properties for easy theming:

```css
:root {
    /* Colors */
    --color-tattoo-black: #1A1A1A;
    --color-ink-blue: #2C5F7C;
    --color-neon-pink: #FF006E;
    --color-success: #00D084;
    --color-warning: #FFB800;
    --color-danger: #E63946;

    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Typography */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;

    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-base: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

**Custom Theme Example:**
```css
/* Override colors for your brand */
:root {
    --color-ink-blue: #YOUR-PRIMARY;
    --color-neon-pink: #YOUR-ACCENT;
}
```

---

### Database Extension

**Adding a New Needle Configuration:**
```javascript
NEEDLE_COVERAGE_RATES['17M1'] = {
    type: 'magnum',
    name: '17 Magnum',
    needles: 17,
    width_mm: 18.0,
    coverage_rate: {
        slow: 20.0,
        medium: 40.0,
        fast: 60.0
    },
    best_for: 'Maximum coverage for very large areas',
    passes_required: 2,
    ink_efficiency: 'excellent'
};

// Update select options in HTML
const select = document.getElementById('needle-config');
const option = document.createElement('option');
option.value = '17M1';
option.textContent = '17M1 - 17 Magnum (Maximum Coverage)';
select.querySelector('optgroup[label="Magnums"]').appendChild(option);
```

**Adding a New Body Location:**
```javascript
BODY_LOCATION_FACTORS['scalp'] = {
    difficulty: 'difficult',
    name: 'Scalp',
    time_multiplier: 1.9,
    pain_level: 'very-high',
    typical_session: 2.5,
    break_frequency: 'frequent',
    notes: 'Thin skin over bone, vibration sensitivity'
};
```

---

## Performance Optimization

### Lazy Loading

```javascript
// Lazy load calculator when visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadCalculator();
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.getElementById('calculator-container'));
```

### Debounced Input Validation

```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply to input validation
const validateInput = debounce((input) => {
    // Validation logic
}, 300);
```

### Caching Calculations

```javascript
const calculationCache = new Map();

function getCachedOrCalculate(params) {
    const cacheKey = JSON.stringify(params);

    if (calculationCache.has(cacheKey)) {
        return calculationCache.get(cacheKey);
    }

    const result = performCalculation(params);
    calculationCache.set(cacheKey, result);

    return result;
}
```

---

## Testing & Validation

### Unit Test Examples

```javascript
// Coverage calculation test
function testCoverageCalculation() {
    const input = {
        needle: '9M1',
        speed: 'medium',
        sessionHours: 4,
        breakTime: 10,
        passes: 2
    };

    const result = calculateCoverage(input);

    console.assert(
        Math.abs(result.coverage_imperial - 33.3) < 0.1,
        'Coverage calculation incorrect'
    );

    console.assert(
        result.effective_hours === 3.33,
        'Effective hours calculation incorrect'
    );
}
```

### Integration Test Examples

```javascript
// Form submission test
async function testFormSubmission() {
    // Fill form
    document.getElementById('needle-config').value = '9M1';
    document.getElementById('work-speed').value = 'medium';
    document.getElementById('session-hours').value = '4';
    document.getElementById('break-time').value = '10';
    document.getElementById('passes').value = '2';

    // Submit form
    const form = document.getElementById('coverage-form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Wait for results
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check results displayed
    const resultsDiv = document.getElementById('coverage-results');
    console.assert(
        resultsDiv.style.display !== 'none',
        'Results not displayed'
    );
}
```

### Validation Rules

**Input Validation:**
```javascript
const validationRules = {
    sessionHours: { min: 0.5, max: 12, step: 0.5 },
    breakTime: { min: 0, max: 30, step: 5 },
    passes: { min: 1, max: 5, step: 1 },
    tattooWidth: { min: 0.5, max: 50, step: 0.5 },
    tattooHeight: { min: 0.5, max: 50, step: 0.5 },
    colors: { min: 1, max: 20, step: 1 },
    hourlyRate: { min: 50, max: 500, step: 10 },
    depositPercent: { min: 10, max: 100, step: 5 },
    sessions: { min: 1, max: 20, step: 1 }
};
```

---

## Browser Compatibility

### Required Features

- CSS Custom Properties (IE not supported)
- ES6 Arrow Functions
- Template Literals
- `const` and `let`
- `addEventListener`
- `localStorage`
- Flexbox and Grid

### Polyfills

For older browser support:

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

---

## Security Considerations

### Input Sanitization

All user inputs are validated and sanitized:

```javascript
function sanitizeNumber(input, min, max) {
    const num = parseFloat(input);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
}
```

### XSS Prevention

All dynamic content is escaped:

```javascript
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

---

## Version History

### 2.4.0 - 2026
- **Google Calendar & .ICS Event Export Engine**: Direct appointment scheduling modal with pre-populated session estimates, client tags, needle configuration notes, and downloadable `.ics` iCalendar calendar files.
- **Ink Needle & Pass Optimization Suggestion System**: Algorithmic suggestion module that analyzes ink calculations to recommend broader magnum needle groupings and pass reductions, calculating saved pigment volume and reduced ink cap waste without compromising tattoo quality.
- **Inventory Stock Depletion & Predictive Reorder Forecast**: 30-day forecast engine tracking scheduled client sessions against ink bottle stock, automatic safety buffer alerts, and 1-click supplier order manifests.
- **Ink Waste vs. Dermal Consumption Telemetry**: Interactive multi-month bar chart and pigment line waste ratio matrix for comparing actual dermally deposited ink vs in-cap residue and cartridge discard.
- **Automated Browser Language Detection & Full Localization**: Automated `navigator.languages` detection with fallback handling, `localStorage` persistence, and 100% UI localization coverage across English, French, Italian, German, Spanish, Dutch, and Portuguese.

### 2.3.0 - 2026
- **Chart.js Saturation Trend Line Chart & Clinical Thresholds**: Dynamic analytics curve tracking calculation records with 35% (Light) and 65% (Heavy) clinical reference thresholds, rolling studio historical baseline, and instant high/low saturation deviation alerts.
- **Multi-Session Master Planning Engine**: Batch selection of historical records, combined project calculations (total area, total chair hours/minutes, total pigment volume in mL/fl oz/caps), financial forecasting, and 14–21 day clinical recovery scheduling with multi-session PDF/CSV exports.
- **Certified Client PDF Documentation Generator**: High-resolution A4 technical specification and consultation sheets with studio branding header seals, itemized volumetric waste calculations, trauma index profiling, aftercare regimens, and dual artist/client signature blocks.
- **Enhanced 7-Language Global Localization**: Complete multilingual UI coverage across English, French, Italian, German, Spanish, Dutch, and Portuguese.

### 2.2.0 - 2025
- Real-time unit toggle (`sq in` ↔ `cm²`) with automatic input synchronization across all tools.
- Volumetric saturation bar and sparkline history curve with interactive tooltips.
- Onboarding guided tour and needle size visual diagrams.

### 2.1.0 - 2025
- Global 7-language I18N translation engine with DOM attribute bindings.
- Extended needle configurations and categorized optgroups.

### 1.0.0 - January 2025
**Initial Release:**
- Coverage Area Calculator, Session Time Estimator, Ink Consumption Calculator, Pricing Calculator
- 18 needle configurations, 15 body locations
- Dark/Light theme toggle, mobile responsive design, WordPress integration

---

## Support & Contributing

### Reporting Issues

**GitHub Issues:** https://github.com/poliinternational/coverage-calculator/issues

**Include:**
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests

Submit feature requests via GitHub Issues with:
- Use case description
- Expected behavior
- Benefits to users

### Contact

**Technical Support:** support@poliinternational.com
**Website:** https://poliinternational.com

---

**© 2025 Poli International Co. - Technical Documentation**
**License:** GPL v2 or later
