/**
 * Synchronous Translation & Localization Engine (V2)
 * Poli International Tattoo Tools Suite
 * 
 * Provides centralized string management with token parameter interpolation.
 * Master Reference Dictionary: English
 */

const I18N_DICTIONARY = {
  en: {
  "app": {
    "title": "Professional Tattoo Ink Color Mixer & Formula Calculator",
    "headerTitle": "Professional Tattoo Ink Color Mixer",
    "subtitle": "Mix custom tattoo ink colors with precise subtractive ratios. Inverse target color matching, studio inventory filtering, volumetric scaling, gray wash series and ink substitution for professional tattoo artists.",
    "home": "Home",
    "tools": "Tools",
    "tattooTools": "Tattoo Tools",
    "inkMixer": "Ink Mixer",
    "githubCta": "View on GitHub",
    "freeToolBadge": "Free Professional Tool",
    "versionBadge": "v2.0.0 (Subtractive Engine)",
    "themeLight": "Light Mode",
    "themeDark": "Dark Mode",
    "embedBtn": "Free Embed",
    "embedModalTitle": "Embed This Tool",
    "embedModalDesc": "Copy the code snippet below to embed the Tattoo Ink Mixer on your website.",
    "copyCode": "Copy Code",
    "copied": "Copied!",
    "close": "Close",
    "skipLink": "Skip to main content",
    "toolSubtitle": "Mix custom ink colors • Save your recipes • Professional color matching",
    "headerSubtitle": "Calculate precise tattoo ink color mixtures, save custom formulas, and master color theory",
    "language": "Language",
    "printFormulaCard": "Print Formula Card"
  },
  "nav": {
    "home": "HOME",
    "about": "ABOUT",
    "innovation": "INNOVATION",
    "trust": "They trust us!",
    "contact": "CONTACT",
    "skipToContent": "Skip to main content"
  },
  "tabs": {
    "mixer": "Color Mixer & Solver",
    "inventory": "My Ink Inventory",
    "library": "Saved Formulas",
    "grayWash": "Gray Wash Studio Series",
    "theory": "Subtractive Science",
    "colorWheel": "Color Science",
    "referenceStudio": "Reference Studio",
    "gradientCaps": "Gradient Caps",
    "diluentFormulator": "Diluent Formulator",
    "studioTools": "Studio Tools & Vault"
  },
  "mixer": {
    "title": "Forward Ink Mixer (Mix Inks → Predict Color)",
    "colorPalette": "Base Ink Palette",
    "colorLabel": "Color {count}",
    "partsLabel": "Parts (Ratio)",
    "brandLabel": "Brand",
    "batchLabel": "Batch / Lot #",
    "selectColor": "Select Color",
    "maxColorsReached": "Maximum 8 ink components per mix",
    "noColorsError": "Please calculate a formula with at least one color before saving.",
    "ratio": "Ratio",
    "addInkBtn": "+ Add Color Component",
    "calculateBtn": "Calculate Ratios & Color",
    "resetBtn": "Reset Mixer",
    "saveFormula": "Save to My Formulas",
    "volumetricScalingTitle": "Volumetric Scaling & Measurements",
    "volumetricPresetLabel": "Quick Scale Presets",
    "totalVolumeLabel": "Target Volume Needed",
    "predictedColorTitle": "Subtractive Pigment Prediction (Kubelka-Munk CMYKW)",
    "healedSkinSimulationTitle": "Simulated Healed Appearance in Skin (Fitzpatrick I-VI)",
    "skinFilterNote": "Colour transmission in living skin is craft knowledge observed by practitioners. Melanin in the epidermis acts as an optical filter over dermal ink deposits.",
    "brandMismatchWarning": "Repeatability Notice: A brand mismatch was detected between your active stock and this formula. Pigment grinds and tinting strengths vary by manufacturer. Test a single-drop swatch before tattooing.",
    "formulaSavedToast": "Formula \"{name}\" saved to library!",
    "printFormulaCard": "Print Formula Card",
    "lightnessLabel": "Lightness",
    "toneLabel": "Tone",
    "componentSwatchLabel": "Component Swatch: {color}, Hex {hex}, L* {lStar}",
    "predictedSwatchLabel": "Predicted Ink Blend: {hex}, L* {lStar}, {tone}",
    "brandPlaceholder": "e.g. Dynamic, Eternal, Intenze",
    "batchPlaceholder": "Batch / Lot number",
    "customColorPlaceholder": "e.g. Solid Black, Lining Black, Tribal Black",
    "dropsHeader": "Drops (≈20 drops/ml)",
    "preset1Cap": "1 Large Cap (2ml)",
    "preset5ml": "Standard 5 ml",
    "preset1oz": "1 oz Bottle (30ml)",
    "unitMl": "ml (Milliliters)",
    "unitCapsLarge": "caps (#16 Large / 2ml)",
    "unitCapsSmall": "caps (#9 Small / 1ml)",
    "unitOz": "oz (Fluid Ounces / 30ml)",
    "formulaNamePlaceholder": "e.g., Warm Ochre Portrait Shadow",
    "formulaNotesPlaceholder": "e.g., Calibrated with Dynamic Black lot 44B. Test swatch on practice skin before full saturation.",
    "formulaTagsPlaceholder": "e.g., portrait, shadow, warm, realism",
    "subtitle": "Input specific pigment parts and batch numbers to predict the subtractive CMYKW blend and volumetric breakdown.",
    "addComponent": "+ Add Another Component",
    "resetInputs": "↺ Reset Inputs",
    "totalVolume": "Total Volume Needed",
    "calculateBlend": "🧪 Calculate Subtractive Blend",
    "predictedBlend": "Predicted Blend",
    "subtractiveModel": "Subtractive Pigment Model Simulation (CMYKW)",
    "proportionalRatio": "Proportional Formula Ratio",
    "dispenserBreakdown": "Dispenser Breakdown",
    "pigmentShade": "Pigment / Shade",
    "parts": "Parts",
    "volume": "Volume (ml)",
    "percentage": "Percentage",
    "visualApprox": "Visual Approximation",
    "purePigment": "0% Pure Pigment",
    "saveRecipeTitle": "Save Recipe to Local Studio Library",
    "artistNotes": "Artist Notes (Optional)",
    "tags": "Tags (comma-separated)",
    "saveBtn": "💾 Save to Library",
    "printBtn": "🖨️ Print Studio Formula Sheet",
    "manualHeaderTitle": "Manual Subtractive Ink Mixing Calculator",
    "predictedColorHeader": "Predicted Color & Dispensing Measurements",
    "lightnessPrefix": "Lightness",
    "lStarPrefix": "L*",
    "tonePrefix": "Tone"
  },
  "targetSolver": {
    "title": "Mix by Target (I want THIS color → What ratio from my inks?)",
    "subtitle": "Specify any target color and let the inverse subtractive solver calculate the exact ratio and volumetric drops from your owned inks.",
    "pickTargetLabel": "Select or Enter Target Color",
    "hexRgbLabel": "Target Desired Color (Hex or RGB)",
    "hexRgbPlaceholder": "e.g. #D84315 or rgb(216, 67, 21)",
    "hexPlaceholder": "#RRGGBB",
    "eyedropBtn": "🔍 Eyedrop Color",
    "eyedropperNotSupported": "EyeDropper API is not supported in this browser. Enter Hex or RGB directly.",
    "solveBtn": "🎯 Solve Recipe From Inks",
    "presetsLabel": "Target Color Presets",
    "restrictInventoryLabel": "Restrict solver strictly to on-hand bottles in My Inventory",
    "emptyInventoryNotice": "Your inventory is currently empty. Solving with standard 10 master pigments.",
    "noOnHandError": "No ink bottles are currently marked On Hand. Toggle bottles On Hand in My Inventory or disable the inventory restriction.",
    "invalidHex": "Please enter a valid Hex color (e.g. #2E7D32) or RGB format (e.g. rgb(46, 125, 50))",
    "resultTitle": "Achievable Recipe Solution",
    "targetVsMatch": "Target vs Predicted Mix",
    "honestDiffExact": "High-Fidelity Match",
    "honestDiffClose": "Close Visual Approximation",
    "honestDiffNoticeable": "Noticeable Hue/Saturation Variance",
    "honestDiffGamut": "Outside On-Hand Pigment Gamut",
    "loadToMixerBtn": "Load into Forward Mixer",
    "saveToLibraryBtn": "Save to My Formulas",
    "originalTargetGoal": "Original Target Goal",
    "predictedMatchResult": "Predicted Match Result",
    "achievedRatio": "Achieved Ratio",
    "printSolutionCard": "Print Solution Card",
    "solveFailed": "Could not solve recipe for this target color.",
    "targetMatchTitle": "Target Match ({hex})",
    "invalidHexPrompt": "Please enter a valid 6-character hex color (e.g. #2E7D32)",
    "restrictInventory": "Restrict solver strictly to bottles marked \"On Hand\" in My Inventory",
    "singleCapHeader": "Single Cap (#16 / 2ml)",
    "mix5mlHeader": "5 ml Mix",
    "bottle30mlHeader": "30 ml Bottle",
    "quickPresets": "Quick Target Presets",
    "calculateBtn": "🔍 Calculate Optimal Mix Ratio",
    "targetGoal": "Target Goal",
    "predictedMatch": "Predicted Match",
    "solvedRecipe": "Solved Recipe:",
    "componentInk": "Component Ink",
    "ratioParts": "Ratio Parts",
    "loadIntoMixerBtn": "📥 Load Into Forward Mixer",
    "printFormulaSheetBtn": "🖨️ Print Formula Sheet",
    "headerTitle": "Mix by Target Color (Inverse Ratio Solver)",
    "ratioWithVal": "Ratio: {ratio}"
  },
  "inventory": {
    "qrUnavailable": "QR code unavailable. Use Export JSON to move this formula.",
    "title": "Studio Ink Inventory Management",
    "subtitle": "Record the ink brands and shades you actually own in your shop. Stored 100% locally in your browser (zero network transmission).",
    "addBtn": "+ Add Ink Record",
    "presetBtn": "Load Starter Set",
    "exportBtn": "Export Inventory (.json)",
    "importBtn": "Import Inventory (.json)",
    "qrBtn": "📱 QR Transfer",
    "inStock": "In Stock",
    "outOfStock": "Out of Stock",
    "onHand": "On Hand",
    "notOnHand": "Not on Hand",
    "toggleOnHand": "Toggle On-Hand Status",
    "countBadge": "{total} Bottles Recorded ({onHand} On Hand)",
    "emptyState": "No inks in your inventory yet. Add individual inks or load a starter palette to get started.",
    "emptyTransferNotice": "Inventory is currently empty. Add inks or load a starter palette before transferring.",
    "addedInkNotice": "Added \"{shade}\" ({brand}) to studio inventory!",
    "loadedStarterNotice": "Loaded starter palette ({count} inks added to inventory)!",
    "jsonCopied": "Inventory JSON copied to clipboard!",
    "importSuccess": "Imported {count} ink(s) into inventory!",
    "importFailed": "Import failed: {error}",
    "emptyStateNotice": "No inks in inventory yet. Click \"+ Add Bottle\" to begin tracking your physical tattoo pigment stock.",
    "inkRemoved": "Ink removed from inventory.",
    "inksRecorded": "{count} Inks Recorded in Studio",
    "addBottle": "+ Add Bottle",
    "loadStarterPalette": "⚡ Load Starter Palette",
    "export": "📤 Export",
    "import": "📥 Import",
    "addModal": {
      "shadeNameLabel": "Shade Name"
    }
  },
  "library": {
    "title": "My Saved Formulas",
    "subtitle": "Formulas saved locally in your browser storage. Stays completely private in your browser and is never transmitted to any external server.",
    "searchPlaceholder": "Search formulas by name, brand, or notes...",
    "noSaved": "No formulas saved yet. Create and save formulas from the Color Mixer tab.",
    "importBtn": "Import Formulas (JSON)",
    "exportBtn": "Export All Formulas",
    "deleteConfirm": "Are you sure you want to delete formula '{name}'?",
    "loadBtn": "Load into Mixer",
    "copyTextBtn": "Copy Recipe Text",
    "printBtn": "Print / PDF Recipe Card",
    "downloadCsvBtn": "Download CSV",
    "deleteBtn": "Delete",
    "createdAt": "Saved: {date}",
    "formulaSaved": "Formula '{name}' successfully saved!",
    "formulaCount": "{count} saved formula(s)",
    "enterFormulaName": "Enter formula name:",
    "enterFormulaNotes": "Enter notes for this formula (optional):",
    "copiedRecipe": "Formula recipe copied to clipboard!",
    "brandMismatchNotice": "Repeatability Notice: This formula was saved using {brands}. Pigment densities vary between manufacturers. Test a single-drop test swatch on practice skin before full application.",
    "formulaRemoved": "Formula \"{name}\" removed from library.",
    "noMatchingFormulas": "No formulas matching \"{query}\"",
    "portraitAccents": "Portrait & Realism Accents",
    "graysNeutrals": "Grays & Neutrals",
    "landscapeBotanical": "Landscape & Botanical",
    "searchBarPlaceholder": "🔍 Search formulas by name, brand, notes, or tags...",
    "importJson": "📥 Import JSON",
    "exportJson": "📤 Export JSON",
    "downloadCsv": "📊 Download CSV",
    "noSavedFormulas": "No saved formulas yet. Create and save your first formula from the Color Mixer tab!",
    "benchmarkTitle": "Studio Benchmark Formulas",
    "benchmarkSubtitle": "Click any formula to load it into the mixer and calibrate for your specific bottle lot.",
    "skinToneBases": "Skin Tone Bases"
  },
  "grayWash": {
    "customRecipeLine": "{blackDrops} {blackUnit} + {diluentDrops} {diluentUnit}",
    "dropBlack": "drop Black",
    "dropsBlack": "drops Black",
    "dropDiluent": "drop Diluent",
    "dropsDiluent": "drops Diluent",
    "inContainerVolumetric": "In {container} ({volume} ml) • {blackMl} ml Black / {diluentMl} ml Diluent",
    "copyRecipeBtnLabel": "📋 Copy Recipe",
    "customWashFormulaName": "Custom {pct}% Wash",
    "diluentGeneral": "Diluent",
    "setupMetrics": "{name} Setup Metrics",
    "wellsInContainer": "{count} wells in {container} ({volume} ml each)",
    "totalSetup": "Total Setup: {volume} ml (≈{drops} drops)",
    "totalCarbonBlack": "Total Carbon Black:",
    "totalDiluentSuspension": "Total Diluent Suspension:",
    "dropsDetail": "{drops} drops ({ml} ml)",
    "dropDetail": "{drops} drop ({ml} ml)",
    "carbonBlack": "Carbon Black",
    "carbonBlackConcentration": "{pct}% Carbon Black Concentration",
    "distilledWaterName": "Distilled Water",
    "witchHazelName": "USP Witch Hazel",
    "glycerinName": "USP Vegetable Glycerin",
    "balancedBlendName": "Studio Balanced Blend",
    "pureDistilledName": "100% Pure Distilled Water",
    "glycerinDilutionName": "USP Vegetable Glycerin Dilution",
    "whisperWash": "Cap 1: Whisper Wash",
    "lightWash": "Cap 2: Light Wash",
    "midToneWash": "Cap 3: Mid-Tone Wash",
    "solidBlack": "Cap 4: Solid Black",
    "copyBtnLabel": "📋 Copy",
    "loadMixerBtnLabel": "🎨 Load in Mixer",
    "cap3LightWash": "Cap 1: Light Wash",
    "cap3MediumWash": "Cap 2: Medium Wash",
    "cap3SolidBlack": "Cap 3: Solid Black",
    "cap5MicroTone": "Cap 1: Micro Tone (#1)",
    "cap5LightWash": "Cap 2: Light Wash (#2)",
    "cap5MidWash": "Cap 3: Mid Wash (#3)",
    "cap5DarkWash": "Cap 4: Dark Wash (#4)",
    "cap5SolidBlack": "Cap 5: Solid Black (#5)",
    "system4capName": "4-Cap Studio Standard",
    "system3capName": "3-Cap Essential",
    "system5capName": "5-Cap Micro-Gradient",
    "containerCap16": "#16 Large Cap",
    "containerCap12": "#12 Medium Cap",
    "containerCap9": "#9 Small Cap",
    "containerBottle1oz": "1 oz Squeeze Bottle",
    "containerBottle2oz": "2 oz Squeeze Bottle",
    "containerBottle4oz": "4 oz Squeeze Bottle",
    "title": "Gray Wash Studio Mixing Series",
    "subtitle": "Calculate standard 3-cap, 4-cap, and 5-cap master gray wash series with exact drop counts for #9, #12, and #16 ink caps, plus 1oz, 2oz, and 4oz squeeze bottles.",
    "systemLabel": "Wash System Setup",
    "threeCap": "3-Cap Studio System (Light, Medium, Solid Black)",
    "fourCap": "4-Cap Smooth Shading System (Tone, Light, Mid, Dark)",
    "fiveCap": "5-Cap Master Realism Series (1-5 Full Range)",
    "capSizeLabel": "Container Size",
    "capSmall": "Small Cap (#9: 0.5ml / 10 drops)",
    "capMedium": "Medium Cap (#12: 1.0ml / 20 drops)",
    "capLarge": "Large Cap (#16: 2.0ml / 40 drops)",
    "bottle1oz": "1 oz Squeeze Bottle (30 ml ≈ 600 drops)",
    "bottle2oz": "2 oz Squeeze Bottle (60 ml ≈ 1,200 drops)",
    "bottle4oz": "4 oz Squeeze Bottle (120 ml ≈ 2,400 drops)",
    "diluentLabel": "Diluent Medium",
    "diluentDistilled": "100% Pure Distilled Water (Carrier)",
    "diluentWitchHazel": "USP Witch Hazel (Astringent Carrier)",
    "diluentGlycerin": "USP Vegetable Glycerin (Needle Flow & Anti-Drying)",
    "diluentBalanced": "Studio Balanced Blend (70% Water, 25% Witch Hazel, 5% Glycerin)",
    "diluentWaterWitch": "Distilled Water + Witch Hazel (70/30 Soothing Blend)",
    "diluentWater": "100% Distilled Water",
    "diluentShadingSol": "Commercial Shading Solution",
    "generateTrayBtn": "🖨️ Generate Printable Cap Tray Labels (6 & 12 Cap Trays)",
    "customWashTitle": "Custom Continuous Wash Dilution",
    "customWashLabel": "Target Black Pigment Density (%):",
    "ladderTitle": "Tonal Gray Progression Ladder",
    "volumetricTitle": "Dispenser & Volumetric Breakdown:",
    "recipeCopied": "Recipe for \"{name}\" copied to clipboard!",
    "recipeDrops": "Recipe: {blackDrops} drops Black + {diluentDrops} drops Diluent",
    "loadedMixer": "Loaded \"{name}\" into Manual Mixer!",
    "libraryUnavailable": "Formula library is not available.",
    "allShadesSaved": "Saved all {count} Gray Wash shades to your Library!",
    "seriesCopied": "Full Gray Wash Series recipe copied to clipboard!",
    "clipboardFailed": "Could not access clipboard automatically.",
    "system4cap": "4-Cap Studio Standard (Light / Medium / Dark / Solid)",
    "system3cap": "3-Cap Essential (Light / Medium / Dark)",
    "system5cap": "5-Cap Micro-Gradient (X-Light to Solid Black)",
    "cap16Large": "#16 Large Cap (2.0 ml ≈ 40 drops)",
    "cap12Medium": "#12 Medium Cap (1.0 ml ≈ 20 drops)",
    "cap9Small": "#9 Small Cap (0.5 ml ≈ 10 drops)",
    "openCapTrayBtn": "🏷️ Generate Printable Cap Tray Label Sheets (6 & 12 Cap Trays)",
    "generateBtn": "🌫️ Generate Gray Wash Ladder",
    "saveSeriesBtn": "💾 Save Full Series to Library",
    "copyBreakdownBtn": "📋 Copy Series Breakdown",
    "customDensityTitle": "Custom Density Wash Mixer",
    "densityTargetLabel": "Density Target"
  },
  "capTray": {
    "modalTitle": "Printable Cap Tray Label Sheets",
    "modalSubtitle": "High-contrast label strips formatted for standard 6-cap and 12-cap acrylic or silicone station trays. Uses browser print (save to PDF or print to paper).",
    "trayTypeLabel": "Tray Format",
    "tray6": "Standard 6-Cap Tray (1x6 Strip / 2x3 Grid)",
    "tray12": "Standard 12-Cap Tray (2x6 Strip / 3x4 Grid)",
    "wellHeader": "Well #{num}: {name}",
    "recipeLabel": "Recipe / Well:",
    "lotLabel": "Ink Lot / Batch:",
    "swatchLabel": "Test Swatch:",
    "printBtn": "🖨️ Print Label Sheet",
    "closeBtn": "✕ Close",
    "printSheetBtn": "🖨️ Print Tray Sheet",
    "layoutLabel": "Tray Layout:",
    "tray6Option": "Standard 6-Cap Tray (1×6 Strip / 2×3 Grid)",
    "tray12Option": "Standard 12-Cap Tray (2×6 Strip / 3×4 Grid)",
    "contentSourceLabel": "Label Content:",
    "contentGrayWash": "Active Gray Wash Series",
    "contentMixer": "Active Color Mixer Recipe",
    "subtitle": "High-contrast station label strips formatted for standard 6-cap and 12-cap acrylic and silicone trays.",
    "waterRinseWell": "Well #{index} (Water / Rinse)",
    "rinseDiluentWell": "Well #{index} (Rinse / Diluent)",
    "customWell": "Well #{index}",
    "mixerTrayTitle": "Color Mixer Tray: {colors}",
    "customStationTitle": "Custom Artist Station Tray",
    "configureWellsSubtitle": "Configure wells in Color Mixer or Gray Wash Ladder",
    "mixedBlendResult": "Mixed Blend Result",
    "finalBlendNote": "Final Homogenized Blend"
  },
  "neutralizing": {
    "practiceCapTest": "Test with a single drop in a practice cap before loading the main pigment well.",
    "physicsExplanationText": "Subtractive neutralisation works by optical wave cancellation: pigments absorb opposing spectrum wavelengths rather than reflecting them, driving the perceived color toward a neutral value.",
    "correctorWarmTerracotta": "Warm Terracotta / Orange Corrector",
    "guidanceWarmOrange": "1 drop Warm Orange per 10-12 drops base pigment in cap. Neutralizes blue into neutral ash/charcoal.",
    "correctorRedOrange": "Warm Red-Orange / Brick Red Corrector",
    "guidanceRedOrange": "1 drop Red-Orange per 8-10 drops base pigment. Counters green-teal reflection back to neutral earth brown.",
    "correctorGoldenYellow": "Golden Yellow / Mustard Corrector",
    "guidanceGoldenYellow": "2 drops Golden Yellow per 10 drops base pigment. Yellow absorbs violet wavelengths to neutralize tone.",
    "correctorOliveGreen": "Muted Olive / Sage Green Corrector",
    "guidanceOliveGreen": "1 drop Olive Green per 12 drops base pigment. Green neutralizes persistent warm pink/red casts.",
    "correctorSlateBlue": "Cool Slate Blue / Drop Black Corrector",
    "guidanceSlateBlue": "1 micro-drop Cool Blue per 30ml wash bottle. Cancels brassy warm casts in healed black & gray.",
    "correctorSepia": "Warm Sepia / Ochre Corrector",
    "guidanceSepia": "1 micro-drop Sepia per 30ml wash bottle. Cancels chalky or muddy blue-gray casts.",
    "correctorDefault": "Warm Terracotta / Orange",
    "guidanceDefault": "Start with 1 drop corrector per 10-12 drops base. Mix thoroughly on palette; test on practice medium before application.",
    "classOrange": "Orange",
    "classRed": "Red",
    "classYellow": "Yellow",
    "classGreen": "Green",
    "classBlue": "Blue",
    "classBrown": "Brown",
    "title": "Subtractive Complementary & Neutralising Hue Assistant",
    "subtitle": "Calculate subtractive color-wheel opposites to neutralize unwanted undertones in ink (faded brow pigment, warm casts in gray wash). Corrects pigment only; does not diagnose skin conditions.",
    "presetLabel": "Select Common Unwanted Ink Undertone:",
    "customLabel": "Or Enter Custom Undertone (Hex or RGB):",
    "unwantedSwatch": "Unwanted Pigment Tone",
    "neutralizerSwatch": "Subtractive Neutralizer",
    "recommendedPigment": "Recommended Neutralizing Pigment:",
    "guidanceLabel": "Dispensing Guidance:",
    "physicsTitle": "Subtractive Wave Absorption Physics:",
    "loadMixerBtn": "📥 Load Neutralizer into Color Mixer",
    "disclaimer": "Notice: This tool assists with subtractive pigment neutralization in tattoo ink mixtures. It does not diagnose, treat, or address medical skin conditions.",
    "invalidColor": "Please enter a valid Hex or RGB color.",
    "loadedMixer": "Loaded 10:1 neutralizer formulation into Color Mixer!",
    "blueSlate": "Faded Blue / Slate Pigment (#1E3A8A)",
    "blueGreenTeal": "Faded Blue-Green / Teal Pigment (#0D9488)",
    "purpleViolet": "Faded Purple / Violet Cast (#6B21A8)",
    "salmonPink": "Faded Salmon / Pinkish Cast (#E11D48)",
    "brassyWarm": "Brassy / Warm Gray Wash Cast (#78350F)",
    "chalkyBlue": "Chalky / Muddy Blue-Gray Cast (#475569)",
    "customColor": "Custom Color Value...",
    "orEnterCustom": "Or Enter Custom Tone (Hex or RGB)",
    "analyzeBtn": "Analyze",
    "scopeNoticeTitle": "Scope Notice:",
    "scopeNoticeText": "This assistant calculates subtractive pigment neutralization for tattoo ink suspensions in cups and palettes. It does not diagnose, treat, or address medical skin conditions or biological dermatitis.",
    "commonUndertones": "Common Unwanted Pigment Undertones",
    "headerTitle": "Subtractive Complementary & Neutralising Hue Assistant"
  },
  "qrTransfer": {
    "modalTitle": "Offline QR Code Formula Transfer",
    "modalSubtitle": "Scan with another device camera to import formula without network access or cloud accounts.",
    "payloadSizeLabel": "Measured Payload Size:",
    "capacityNotice": "Max QR capacity: 2,048 bytes",
    "exceededWarning": "Payload exceeds standard 2,048-byte QR capacity. The full multi-record inventory cannot be encoded into a single scannable 2D matrix without data loss. Recommended: Transfer a single selected formula via QR, or export the full inventory as a JSON file.",
    "singleFallbackBtn": "Switch to Transfer Single Formula",
    "jsonExportBtn": "Download Full JSON File",
    "copyPayloadBtn": "📋 Copy Raw Payload",
    "copiedNotice": "Encoded payload copied to clipboard!",
    "vendorNotice": "QR Engine file pending at ./js/vendor/qrcode.min.js. Encoded payload is verified ({bytes} bytes) and ready for transfer.",
    "clipboardFailed": "Clipboard copy failed. Please select text manually.",
    "noFormulaToTransfer": "No formula available to transfer. Calculate a mix in the mixer first.",
    "closeBtn": "✕ Close",
    "capacityExceededTitle": "⚠️ QR Capacity Exceeded (> 2,048 bytes)",
    "capacityExceededText": "The full multi-record inventory exceeds standard QR scannability. To transfer reliably, export the complete database as a JSON file, or transfer a single selected formula via QR.",
    "transferSingleBtn": "Transfer Single Formula",
    "downloadJsonBtn": "Download Full JSON File",
    "title": "Offline QR Formula Transfer",
    "subtitle": "Direct optical transfer without cloud servers or external connections.",
    "instructions": "Point camera or barcode scanner on the recipient device at this screen to import the formula instantly.",
    "byteMeter": "{current} bytes / {max} max",
    "failedRender": "Failed to render QR code graphic",
    "libNotLoaded": "QR code library is not loaded"
  },
  "skinMatcher": {
    "cardQuestion": "Matching ink to skin tone?",
    "cardLink": "Use the Skin Tone Pigment Matcher. →"
  },
  "theory": {
    "title": "Tattoo Pigment Subtractive Color Mechanics",
    "subtitle": "Subtractive color mechanics, pigment physics, and color wheel principles in professional tattooing.",
    "subtractiveTitle": "Subtractive vs. Additive Color in Tattooing",
    "subtractiveBody": "Unlike digital displays which emit light additively (Red + Green + Blue = White light), tattoo inks are physical chemical pigments in suspension. Pigments absorb (subtract) specific spectral wavelengths while scattering and reflecting others (Subtractive Mixing: Cyan, Magenta, Yellow, Carbon Black). Mixing complementary inks subtracts more light across the spectrum, shifting towards deeper and darker neutral values.",
    "skinFilterTitle": "The Epidermal Melanin Optical Filter",
    "skinFilterBody": "Healed tattoo pigment particles reside permanently in dermal macrophages beneath the living epidermis. The epidermis constantly synthesizes melanin, acting as a natural optical filter over the tattoo. Melanin absorbs short wavelengths (UV and blue) more heavily than red, creating a warm golden-brown optical shift and reducing contrast on pastel or low-saturation colors in deeper skin types.",
    "tintingStrengthsTitle": "Pigment Tinting Strengths",
    "carbonBlack": "Carbon Black & Blue (Dominant)",
    "magenta": "Magenta / Crimson (Medium)",
    "yellow": "Yellow (Recessive)",
    "titaniumWhite": "Titanium White (Lightener/Opaquing)",
    "subtractiveVsAdditive": "🎨 Subtractive vs. Additive Color",
    "subtractiveDesc": "Digital screens emit light additively (RGB mixing toward pure white). Tattoo ink is a physical pigment in liquid suspension that absorbs specific wavelengths of light subtractively (CMYKW mixing toward black/brown). Red and yellow create orange, blue and yellow create olive/green, and yellow requires 2-3x volume because of its lower pigment opacity.",
    "carbonBlackDesc": "Extremely high tinting strength. A single drop of carbon black can overpower 20 drops of yellow or white. Always add darks one drop at a time.",
    "magentaDesc": "Moderate tinting strength with warm undertones. Blends cleanly with yellow for peach/skin and blue for deep violets.",
    "yellowDesc": "Lowest opacity and tinting power. Requires 2-3x volume to influence darker pigment suspensions.",
    "titaniumWhiteDesc": "Creates tints and pastels by increasing light scattering. Excessive white in mixes can heal chalky in deeper melanin fields."
  },
  "footer": {
    "company": "Poli International",
    "description": "Manufacturer of precision body jewelry and publisher of free professional tools for tattoo artists, piercers, and studio owners.",
    "allTools": "View All Free Tools",
    "copyright": "© 2026 Poli International. Free and open source under MIT License."
  },
  "breadcrumb": {
    "home": "Home",
    "tools": "Tools",
    "tattooTools": "Tattoo Tools",
    "inkMixer": "Ink Mixer"
  },
  "tones": {
    "deepCoreShadow": "Deep Core Shadow",
    "darkShadowTone": "Dark Shadow Tone",
    "mediumMidtone": "Medium Midtone",
    "lightTintWash": "Light Tint / Wash",
    "highKeyHighlight": "High Key Highlight",
    "onyxCarbonBlack": "Onyx / Carbon Black",
    "deepCharcoalWash": "Deep Charcoal Wash",
    "neutralSlateGrey": "Neutral Slate Grey",
    "lightGreyWash": "Light Grey Wash",
    "opaqueMixingWhite": "Opaque Mixing White",
    "crimsonRed": "Crimson / Red",
    "warmOchreOrange": "Warm Ochre / Orange",
    "goldenrodYellow": "Goldenrod / Yellow",
    "emeraldOliveGreen": "Emerald / Olive Green",
    "cyanTeal": "Cyan / Teal",
    "cobaltBlue": "Cobalt / Blue",
    "violetPurple": "Violet / Purple",
    "magentaRose": "Magenta / Rose",
    "customBlend": "Custom Blend"
  },
  "refStudio": {
    "title": "Reference Studio & Color Analysis",
    "subtitle": "Extract dominant palettes, inspect CIE L* value contrast, and simulate color vision deficiencies.",
    "dropzoneTitle": "Drop reference photo or stencil here, or click to browse",
    "dropzoneHint": "Supports PNG, JPEG, and WebP. 100% client-side, zero network upload.",
    "loupeTitle": "Precision Magnifier Loupe",
    "sendToSolver": "Send to Target Solver",
    "greyscaleToggle": "Greyscale Luminance View (L*)",
    "cvdLabel": "Color Vision Deficiency (CVD):",
    "cvdNormal": "Normal Color Vision",
    "cvdProtanopia": "Protanopia (Red-Blind)",
    "cvdDeuteranopia": "Deuteranopia (Green-Blind)",
    "cvdTritanopia": "Tritanopia (Blue-Blind)",
    "cvdAchromatopsia": "Achromatopsia (Monochrome)",
    "dominantPaletteTitle": "Extracted Dominant Palette",
    "contrastTitle": "CIE L* Value Contrast & Longevity Analysis",
    "sentToSolver": "Sent {color} to Target Solver",
    "hoverLoupeHint": "💡 Hover over image for precision loupe. Click any pixel to lock shade.",
    "lockedShade": "Locked Shade:",
    "contrastHelp": "Load a reference image to calculate minimum delta L* between key shades and assess post-macrophage encapsulation contrast.",
    "invalidImage": "Please provide a valid image file (PNG, JPEG, WebP)",
    "extractTwoColors": "Extract at least two colors to evaluate value contrast.",
    "longevityWarningTitle": "Melanin Longevity Contrast Warning",
    "longevityWarningBody": "{count} color pair(s) exhibit ΔL* contrast under 30%. As epidermal melanin regenerates over healed tattoo pigments, low-luminance contrasts tend to merge into an unreadable tonal mass. Ensure deep line-work or core drop-shadows provide at least 35% L* difference against adjacent fills.",
    "excellentHierarchyTitle": "Excellent Tonal Hierarchy",
    "excellentHierarchyBody": "All extracted tonal steps demonstrate clear luminance separation (ΔL* ≥ 30%), ensuring lasting visual readability across healed skin.",
    "tonalSpanLabel": "Overall Palette Tonal Span:",
    "solveBtn": "Solve"
  },
  "gradientCaps": {
    "stepSolidBase": "Solid Base (Core)",
    "stepDeepShadow": "Deep Shadow",
    "stepMidtone": "Midtone Gradient #{number}",
    "stepFeatherHighlight": "Feather Highlight Wash",
    "stepPureDiluent": "Pure Wash Diluent",
    "stepSolidAccent": "Solid Accent / Tint",
    "basePigmentRatio": "{percent}% Base Pigment ({volume}ml)",
    "liningBlack": "Lining Black",
    "mixingWhite": "Mixing White",
    "shadingDiluent": "Shading Diluent",
    "title": "Continuous Shading Ladder & Gradient Cap Tray",
    "subtitle": "Calculate non-linear optical dilution steps and print workstation barrier tray guide strips.",
    "originLabel": "Origin Dark Ink",
    "originName": "Origin Ink Name",
    "destTypeLabel": "Destination Type",
    "destDiluent": "Shading Diluent (Wash)",
    "destColor": "Secondary Ink / Tint",
    "destName": "Destination Name",
    "capCountLabel": "Cap Count",
    "capSizeLabel": "Cap Size",
    "cap9": "#9 Small (0.5 ml)",
    "cap12": "#12 Medium (1.0 ml)",
    "cap16": "#16 Large (1.8 ml)",
    "generateBtn": "Generate Tray Setup",
    "printBtn": "Print Tray Guide Card",
    "ladder4": "4-Cap Shading Ladder",
    "ladder5": "5-Cap Shading Ladder",
    "tray6": "6-Cap Standard Tray",
    "transition8": "8-Cap Smooth Transition",
    "gradient10": "10-Cap Micro-Gradient",
    "tray12": "12-Cap Full Grid Tray"
  },
  "diluentFormulator": {
    "title": "Custom Shading Diluent Vehicle Formulator",
    "subtitle": "Formulate sterile water, witch hazel, and USP glycerin carrier vehicles for smooth gray wash and color blends.",
    "sizeLabel": "Container Size",
    "presetLabel": "Recipe Formulation",
    "water": "Sterile Distilled Water",
    "witchHazel": "Distilled Witch Hazel",
    "glycerin": "USP Vegetable Glycerin",
    "notes": "Batch Lot / Notes",
    "printLabel": "Print Bottle Label",
    "breakdownTitle": "Formulation Breakdown",
    "bottle30": "30 ml (1 fl oz) Squeeze Dropper",
    "bottle60": "60 ml (2 fl oz) Squeeze Bottle",
    "bottle120": "120 ml (4 fl oz) Dispenser Bottle",
    "bottle240": "240 ml (8 fl oz) Studio Supply",
    "customVolumeOption": "Custom Volume (ml)",
    "customVolumeLabel": "Custom Volume (ml)",
    "recipeBalanced": "Classic Balanced (75% Water / 20% Witch Hazel / 5% Glycerin)",
    "recipeUltraSoft": "Ultra-Soft Shading (80% Water / 10% Witch Hazel / 10% Glycerin)",
    "recipeFastSet": "Fast-Set Aqueous (85% Water / 15% Witch Hazel / 0% Glycerin)",
    "recipeAstringent": "Astringent Toning (60% Water / 35% Witch Hazel / 5% Glycerin)",
    "recipeCustom": "Custom Ratio",
    "totalBatch": "Total Formulation Batch"
  },
  "studioCalibration": {
    "title": "Drop-Volume & Dispenser Tip Calibration",
    "subtitle": "Calibrate actual drops per mL for your specific bottle tips or transfer pipettes.",
    "testLabel": "Dispensed Drops Count",
    "measuredLabel": "Measured Scale / Syringe Reading",
    "unitMl": "Milliliters (ml)",
    "unitGrams": "Grams (g)",
    "tipStandard": "Standard Twist Dropper (20-22 d/ml)",
    "tipNeedle": "Needle-Nose Precision Tip (28-34 d/ml)",
    "tipPipette": "Graduated Transfer Pipette (24-26 d/ml)",
    "saveBtn": "Save Studio Calibration",
    "resetBtn": "Reset to Nominal (20 d/ml)",
    "nominalBadge": "Nominal: 20 d/ml",
    "tipPresetLabel": "Tip Category Preset",
    "tipCustom": "Custom Calibration Test",
    "unitLabel": "Unit",
    "calculatedYield": "Calculated Tip Yield:",
    "volumePerDrop": "Volume per Drop:"
  },
  "studioVault": {
    "title": "Offline Studio Backup & Encrypted Vault Export",
    "subtitle": "Secure, encrypted client-side backup of formulas, inventory, and calibration profiles.",
    "exportJson": "Export Plain JSON Archive",
    "exportEnc": "Export AES-256 Encrypted Vault",
    "encPassphrase": "Vault Encryption Passphrase",
    "restoreTitle": "Restore Studio Backup or Vault",
    "selectFile": "Select Backup File (.json or .vault)",
    "decPassphrase": "Vault Decryption Passphrase",
    "restoreBtn": "Restore Studio Data",
    "passphraseWarning": "Please enter a secure passphrase (at least 4 characters)",
    "vaultExportSuccess": "Encrypted Studio Vault downloaded successfully",
    "restoreSuccess": "Studio data restored successfully!",
    "encPassPlaceholder": "Enter secure passphrase for AES-256 vault",
    "decPassPlaceholder": "Decryption passphrase (required for .vault files)",
    "jsonDownloaded": "Studio JSON backup downloaded",
    "encryptionError": "Encryption error: {error}",
    "encryptedVaultDetected": "Encrypted Studio Vault Detected",
    "enterPassphraseToRestore": "Enter the decryption passphrase below to restore.",
    "standardBackupVerified": "Standard Backup Verified",
    "backupContentsFound": "Found {fCount} saved formulas, {iCount} inventory records. Click Restore to apply.",
    "unrecognizedFormat": "Unrecognized backup file format.",
    "unableToParseJson": "Unable to parse JSON file.",
    "selectFileFirst": "Please select a backup file first",
    "enterPassphrase": "Please enter the vault passphrase",
    "restoreComplete": "Restore complete. UI updated.",
    "restoreFailed": "Restore failed: {error}"
  },
  "printModal": {
    "title": "Print Formula Card",
    "printPdf": "🖨️ Print / Save PDF",
    "closeBtn": "✕ Close",
    "disclaimerTitle": "Important Disclaimer:",
    "disclaimerText": "Color mixing results vary based on ink brands, skin type, and application technique. These formulas are guidelines - always test colors on practice skin before use on clients. Color preview is approximate and may not match actual result. Professional judgment and experience are essential."
  },
  "addBottleModal": {
    "title": "+ Add Ink Bottle to Studio Inventory",
    "subtitle": "Record a specific ink brand, shade, pigment class, and lot number.",
    "shadeLabel": "Shade Name",
    "brandLabel": "Brand Name",
    "classLabel": "Base Pigment Class",
    "classBlack": "Black (Carbon)",
    "classWhite": "White (Titanium)",
    "classRed": "Red (Scarlet/Crimson)",
    "classYellow": "Yellow (Golden/Bright)",
    "classBlue": "Blue (Cobalt/Cyan)",
    "classOrange": "Orange (Cadmium)",
    "classGreen": "Green (Emerald/Forest)",
    "classPurple": "Purple (Deep Violet)",
    "classBrown": "Brown (Burnt Umber)",
    "classMagenta": "Magenta (Process/Neon)",
    "batchLabel": "Batch / Lot # (Optional)",
    "colorSwatchLabel": "Color Swatch",
    "cancelBtn": "Cancel",
    "submitBtn": "✓ Add to Inventory"
  },
  "starterPaletteModal": {
    "title": "⚡ Load Starter Ink Palette",
    "subtitle": "Populate your inventory instantly with verified manufacturer sets.",
    "dynamicTitle": "Dynamic Black & White Basics",
    "dynamicDesc": "3 essential inks: Standard Black, Triple Black, Heavy White",
    "eternalTitle": "Eternal 12-Color Primary Set",
    "eternalDesc": "12 studio primaries: Lining Black, White, Lipstick Red, Bright Yellow, True Blue, Orange, Dark Green, Purple, Brown, Magenta, Sky Blue, Lime",
    "intenzeTitle": "Intenze Core Palette",
    "intenzeDesc": "9 foundational inks: Zuper Black, Snow White, Bright Red, Banana Cream, Mario's Blue, Tangerine, True Green, Dark Purple, Dark Brown",
    "standardTitle": "Standard 10 Core Pigments (Universal)",
    "standardDesc": "10 universal pigments covering full CMYK + RGB subtractive color space",
    "loadBtn": "Load Palette"
  },
  "exportInventoryModal": {
    "title": "📤 Export Studio Inventory",
    "subtitle": "Your inventory backup data. Download as a JSON file or copy to clipboard.",
    "copyBtn": "📋 Copy JSON to Clipboard",
    "downloadBtn": "💾 Download JSON File"
  },
  "saveFormulaModal": {
    "title": "💾 Save Formula to Studio Library",
    "subtitle": "Stored locally in browser storage. Zero cloud transmission.",
    "nameLabel": "Formula Name",
    "notesLabel": "Notes / Usage (Optional)",
    "cancelBtn": "Cancel",
    "submitBtn": "✓ Save Formula",
    "formulaNameLabel": "Formula Name"
  },
  "relatedTools": {
    "title": "Recommended for You",
    "coverageCalc": "Coverage Calculator",
    "needleSelector": "Needle Selector",
    "stencilCalc": "Stencil Calculator",
    "allTools": "View All 17 Free Tools"
  },
  "geoSummary": {
    "text": "Pro Artist Insight: Proper planning is the mark of a master. Integrating precision calculations into your workflow ensures consistent results and high-quality healing for every client. Use this tool to bridge the gap between artistic vision and technical execution."
  },
  "moreTools": {
    "explore": "Explore all our free professional tools →"
  },
  "embedModal": {
    "title": "Embed This Tool",
    "desc": "Copy this code to embed the tool on your website:",
    "copyBtn": "Copy Code"
  },
  "languages": {
    "en": "English (EN)",
    "fr": "Français (FR)",
    "it": "Italiano (IT)",
    "de": "Deutsch (DE)",
    "es": "Español (ES)",
    "nl": "Nederlands (NL)",
    "pt": "Português (PT)"
  },
  "printCard": {
    "brandLogo": "POLI INTERNATIONAL TATTOO TOOLS",
    "archiveSheetHeader": "STUDIO FORMULA ARCHIVE SHEET • {date}",
    "folderRef": "Folder / Procedure Ref",
    "datePrepared": "Date Prepared",
    "toneClassification": "Tone Classification",
    "formulaRatio": "Formula Ratio: {ratio}",
    "volumetricSection": "Volumetric Scaling & Batch Traceability",
    "colPigment": "Pigment / Component",
    "colBrandBatch": "Brand & Batch / Lot #",
    "colParts": "Ratio Parts",
    "col1Cap": "1 Cap (#16 / 2ml)",
    "col5ml": "5 ml Mix",
    "col30ml": "30 ml Bottle (1 oz)",
    "fitzHealedTitle": "Simulated Healed Appearance Across Skin Tones (Fitzpatrick I-VI)",
    "fitzNote": "Note: Living skin filters transmitted light through epidermal melanin. Swatches and numerical L* values show expected visual shift from lightest (Type I) to darkest (Type VI) skin.",
    "artistNotes": "Artist & Procedure Notes",
    "checklistTitle": "Studio Procedure & Folder Archive Checklist:",
    "checkBottlesVerified": "All component bottles verified within sterile shelf life with lot numbers recorded above",
    "checkSterileCaps": "Dispensed into single-use sterile caps according to established professional studio practice",
    "checkTestedStencil": "Formula tested and verified against reference stencil prior to procedure",
    "artistSignature": "Artist Signature: ___________________________   Date: ______________",
    "binderCopy": "Studio Binder Copy • Keep in Client Archive Folder",
    "lotNotLogged": "Lot # not logged",
    "formulaArchive": "FORMULA-ARCHIVE"
  },
  "substitution": {
    "title": "🔄 Formula Ink Substitution View",
    "subtitle": "Pick a saved recipe, mark an ink as out of stock, and select a replacement from inventory to verify CIEDE2000 color difference (ΔE₀₀).",
    "selectRecipe": "Select Saved Recipe",
    "selectReplacement": "Select Replacement Ink from Inventory",
    "chooseReplacement": "Choose replacement from inventory",
    "markOutOfStock": "Mark One Ink Out of Stock (Click to Toggle):",
    "parts": "parts",
    "recipeBefore": "Recipe Before (Original)",
    "recipeAfter": "Recipe After (Substituted)",
    "substitutedTag": "Substituted",
    "screenIndicative": "Screen colour is indicative only on an uncalibrated screen",
    "ciede2000Title": "CIEDE2000 Color Difference",
    "willNotMatch": "This will not match. Mix a test cap first.",
    "closeMatch": "Close visual match (ΔE ≤ 5.0). Minor shift acceptable for studio use. Mix a test cap to verify on your setup.",
    "loadInMixer": "Load in Mixer",
    "saveAsNew": "Save Substituted Recipe",
    "savedSuccess": "Saved \"{name}\" to formula library!",
    "substitutedNotes": "Substituted {out} with {rep}. ΔE₀₀: {de}."
  }
}
};

let currentLanguage = "en";

function t(keyPath, params) {
  if (!keyPath) return "";
  const langDict = (window.I18N_DICTIONARY && window.I18N_DICTIONARY[currentLanguage]) || I18N_DICTIONARY[currentLanguage] || I18N_DICTIONARY.en;
  
  const segments = keyPath.split(".");
  let result = langDict;
  
  for (const seg of segments) {
    if (result && typeof result === "object" && seg in result) {
      result = result[seg];
    } else {
      let fallback = I18N_DICTIONARY.en;
      for (const fSeg of segments) {
        if (fallback && typeof fallback === "object" && fSeg in fallback) {
          fallback = fallback[fSeg];
        } else {
          fallback = null;
          break;
        }
      }
      result = fallback;
      break;
    }
  }

  if (typeof result !== "string") {
    return keyPath;
  }

  if (params && typeof params === "object") {
    return result.replace(/\{(\w+)\}/g, (match, token) => {
      return token in params ? String(params[token]) : match;
    });
  }

  return result;
}

function registerLanguage(langCode, translations) {
  if (!window.I18N_DICTIONARY) {
    window.I18N_DICTIONARY = I18N_DICTIONARY;
  }
  window.I18N_DICTIONARY[langCode] = translations;
  if (currentLanguage === langCode) {
    applyTranslations();
  }
}

function setLanguage(langCode) {
  const supported = ["en", "fr", "it", "de", "es", "nl", "pt"];
  if (supported.includes(langCode)) {
    currentLanguage = langCode;
    try {
      localStorage.setItem("poli_ink_mixer_lang", langCode);
    } catch (e) {}
    document.documentElement.setAttribute("lang", langCode);
    applyTranslations();
    const selects = document.querySelectorAll(".lang-switcher__select");
    selects.forEach(select => {
      if (select.value !== langCode) {
        select.value = langCode;
      }
    });
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: langCode } }));
  }
}

function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.textContent = translated;
      }
    }
  });

  const attrElements = document.querySelectorAll("[data-i18n-attr]");
  attrElements.forEach(el => {
    const spec = el.getAttribute("data-i18n-attr");
    if (!spec) return;
    
    const pairs = spec.split("|");
    pairs.forEach(pair => {
      const [attrName, key] = pair.split(":");
      if (attrName && key) {
        const translated = t(key.trim());
        if (translated && translated !== key.trim()) {
          el.setAttribute(attrName.trim(), translated);
        }
      }
    });
  });
}

function getCurrentLanguage() {
  return currentLanguage;
}

function getLocalizedDocUrl(docFileName, lang) {
  const selected = lang || currentLanguage || "en";
  if (selected === "en") {
    return `docs/${docFileName}`;
  }
  return `docs/${selected}/${docFileName}`;
}

// Global exposure
window.t = t;
window.registerLanguage = registerLanguage;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.getLocalizedDocUrl = getLocalizedDocUrl;
window.applyTranslations = applyTranslations;
window.I18N_DICTIONARY = I18N_DICTIONARY;

function initLanguage() {
  try {
    const saved = localStorage.getItem("poli_ink_mixer_lang");
    if (saved && ["en", "fr", "it", "de", "es", "nl", "pt"].includes(saved)) {
      currentLanguage = saved;
    }
  } catch (e) {}
  document.documentElement.setAttribute("lang", currentLanguage);
  
  const selects = document.querySelectorAll(".lang-switcher__select");
  selects.forEach(select => {
    select.value = currentLanguage;
    select.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  });
  
  applyTranslations();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguage);
} else {
  initLanguage();
}
