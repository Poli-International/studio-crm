/* =====================================================
   TATTOO LONGEVITY DATABASE
   Comprehensive data for touch-up timeline calculations
   ===================================================== */

(function() {
  function translateKey(keyPath, fallback) {
    if (typeof window !== "undefined" && typeof window.t === "function") {
      var val = window.t(keyPath);
      if (val !== keyPath) return val;
    }
    return fallback;
  }

  const TattooLongevityData = {
    // Tattoo styles and their base longevity (years before first touch-up needed)
    styles: {
      "black_and_grey": {
        get name() { return translateKey("longevity.styles.black_and_grey.name", "Black & Grey"); },
        baseLongevity: 10,
        modifier: 1,
        get description() { return translateKey("longevity.styles.black_and_grey.description", "Highly durable, ages well"); }
      },
      "traditional_color": {
        get name() { return translateKey("longevity.styles.traditional_color.name", "Traditional / American Traditional"); },
        baseLongevity: 8,
        modifier: 0.9,
        get description() { return translateKey("longevity.styles.traditional_color.description", "Bold lines and colors last well"); }
      },
      "color_realism": {
        get name() { return translateKey("longevity.styles.color_realism.name", "Color Realism"); },
        baseLongevity: 6,
        modifier: 0.7,
        get description() { return translateKey("longevity.styles.color_realism.description", "Complex shading fades faster"); }
      },
      "black_realism": {
        get name() { return translateKey("longevity.styles.black_realism.name", "Black & Grey Realism"); },
        baseLongevity: 7,
        modifier: 0.8,
        get description() { return translateKey("longevity.styles.black_realism.description", "Detailed work may blur over time"); }
      },
      "watercolor": {
        get name() { return translateKey("longevity.styles.watercolor.name", "Watercolor"); },
        baseLongevity: 4,
        modifier: 0.5,
        get description() { return translateKey("longevity.styles.watercolor.description", "Fades quickly, requires frequent touch-ups"); }
      },
      "fine_line": {
        get name() { return translateKey("longevity.styles.fine_line.name", "Fine Line / Single Needle"); },
        baseLongevity: 5,
        modifier: 0.6,
        get description() { return translateKey("longevity.styles.fine_line.description", "Delicate lines spread and fade"); }
      },
      "tribal_blackwork": {
        get name() { return translateKey("longevity.styles.tribal_blackwork.name", "Tribal / Solid Blackwork"); },
        baseLongevity: 12,
        modifier: 1.2,
        get description() { return translateKey("longevity.styles.tribal_blackwork.description", "Most durable style"); }
      },
      "script_text": {
        get name() { return translateKey("longevity.styles.script_text.name", "Script / Lettering"); },
        baseLongevity: 9,
        modifier: 0.95,
        get description() { return translateKey("longevity.styles.script_text.description", "Depends on line weight and placement"); }
      }
    },

    // Color longevity modifiers (how fast each color fades)
    colors: {
      "black": {
        get name() { return translateKey("longevity.colors.black.name", "Black"); },
        fadingYears: 10,
        longevityModifier: 1,
        fadingOrder: 9
      },
      "dark_blue": {
        get name() { return translateKey("longevity.colors.dark_blue.name", "Dark Blue"); },
        fadingYears: 8,
        longevityModifier: 0.9,
        fadingOrder: 8
      },
      "purple": {
        get name() { return translateKey("longevity.colors.purple.name", "Purple"); },
        fadingYears: 5,
        longevityModifier: 0.7,
        fadingOrder: 5
      },
      "red": {
        get name() { return translateKey("longevity.colors.red.name", "Red"); },
        fadingYears: 6,
        longevityModifier: 0.75,
        fadingOrder: 6
      },
      "green": {
        get name() { return translateKey("longevity.colors.green.name", "Green"); },
        fadingYears: 7,
        longevityModifier: 0.8,
        fadingOrder: 7
      },
      "yellow": {
        get name() { return translateKey("longevity.colors.yellow.name", "Yellow"); },
        fadingYears: 3,
        longevityModifier: 0.5,
        fadingOrder: 2
      },
      "orange": {
        get name() { return translateKey("longevity.colors.orange.name", "Orange"); },
        fadingYears: 4,
        longevityModifier: 0.6,
        fadingOrder: 3
      },
      "pink_light_colors": {
        get name() { return translateKey("longevity.colors.pink_light_colors.name", "Pink/Light Colors"); },
        fadingYears: 3,
        longevityModifier: 0.5,
        fadingOrder: 1
      },
      "white": {
        get name() { return translateKey("longevity.colors.white.name", "White"); },
        fadingYears: 2,
        longevityModifier: 0.4,
        fadingOrder: 0
      },
      "uv_reactive": {
        get name() { return translateKey("longevity.colors.uv_reactive.name", "UV-Reactive / Glow Pigments"); },
        fadingYears: 2.5,
        longevityModifier: 0.45,
        fadingOrder: 0,
        isSpecialPigment: true
      },
      "organic_inks": {
        get name() { return translateKey("longevity.colors.organic_inks.name", "Older Organic Inks / Traditional Formulations"); },
        fadingYears: 3.5,
        longevityModifier: 0.55,
        fadingOrder: 1,
        isSpecialPigment: true
      }
    },

    // Body location modifiers
    locations: {
      "covered_areas": {
        get name() { return translateKey("longevity.locations.covered_areas.name", "Covered Areas (Torso, Upper Arms, Thighs)"); },
        longevityModifier: 1.2,
        get fadingRisk() { return translateKey("longevity.locations.covered_areas.fadingRisk", "Low"); },
        get description() { return translateKey("longevity.locations.covered_areas.description", "Protected from sun and friction"); }
      },
      "occasionally_exposed": {
        get name() { return translateKey("longevity.locations.occasionally_exposed.name", "Occasionally Exposed (Forearms, Lower Legs)"); },
        longevityModifier: 1,
        get fadingRisk() { return translateKey("longevity.locations.occasionally_exposed.fadingRisk", "Moderate"); },
        get description() { return translateKey("longevity.locations.occasionally_exposed.description", "Some sun exposure"); }
      },
      "frequently_exposed": {
        get name() { return translateKey("longevity.locations.frequently_exposed.name", "Frequently Exposed (Hands, Face, Neck)"); },
        longevityModifier: 0.7,
        get fadingRisk() { return translateKey("longevity.locations.frequently_exposed.fadingRisk", "High"); },
        get description() { return translateKey("longevity.locations.frequently_exposed.description", "Heavy sun exposure accelerates fading"); }
      },
      "high_friction": {
        get name() { return translateKey("longevity.locations.high_friction.name", "High Friction (Feet, Hands, Fingers)"); },
        longevityModifier: 0.5,
        get fadingRisk() { return translateKey("longevity.locations.high_friction.fadingRisk", "Very High"); },
        get description() { return translateKey("longevity.locations.high_friction.description", "Constant friction and washing"); }
      }
    },

    // Sun exposure modifiers
    sunExposure: {
      "low": {
        get name() { return translateKey("longevity.sunExposure.low.name", "Low - Usually covered"); },
        longevityModifier: 1.1,
        fadingAcceleration: "0%"
      },
      "medium": {
        get name() { return translateKey("longevity.sunExposure.medium.name", "Medium - Sometimes exposed"); },
        longevityModifier: 0.85,
        fadingAcceleration: "15-30%"
      },
      "high": {
        get name() { return translateKey("longevity.sunExposure.high.name", "High - Frequently in sun"); },
        longevityModifier: 0.6,
        fadingAcceleration: "40-60%"
      }
    },

    // Care level modifiers
    careLevel: {
      "excellent": {
        get name() { return translateKey("longevity.careLevel.excellent.name", "Excellent - Daily moisturizer, always SPF"); },
        longevityModifier: 1.3,
        get description() { return translateKey("longevity.careLevel.excellent.description", "Extends tattoo life significantly"); }
      },
      "good": {
        get name() { return translateKey("longevity.careLevel.good.name", "Good - Regular moisturizer, SPF when exposed"); },
        longevityModifier: 1,
        get description() { return translateKey("longevity.careLevel.good.description", "Standard care routine"); }
      },
      "fair": {
        get name() { return translateKey("longevity.careLevel.fair.name", "Fair - Occasional moisturizer, some SPF"); },
        longevityModifier: 0.8,
        get description() { return translateKey("longevity.careLevel.fair.description", "Below optimal care"); }
      },
      "poor": {
        get name() { return translateKey("longevity.careLevel.poor.name", "Poor - Minimal care, no SPF"); },
        longevityModifier: 0.5,
        get description() { return translateKey("longevity.careLevel.poor.description", "Accelerates fading significantly"); }
      }
    },

    // Urgency levels for touch-up recommendations
    urgencyLevels: {
      "no_rush": {
        threshold: 5,
        get level() { return translateKey("longevity.urgencyLevels.no_rush.level", "Looking Great!"); },
        icon: "✅",
        statusClass: "status-great",
        get message() { return translateKey("longevity.urgencyLevels.no_rush.message", "Your tattoo is still in excellent condition. Keep up the great care routine!"); }
      },
      "plan_ahead": {
        threshold: 3,
        get level() { return translateKey("longevity.urgencyLevels.plan_ahead.level", "Plan Ahead"); },
        icon: "📅",
        statusClass: "status-plan",
        get message() { return translateKey("longevity.urgencyLevels.plan_ahead.message", "Start planning for a touch-up in the next few years. Schedule a consultation with your artist."); }
      },
      "schedule_soon": {
        threshold: 1,
        get level() { return translateKey("longevity.urgencyLevels.schedule_soon.level", "Schedule Soon"); },
        icon: "⏰",
        statusClass: "status-soon",
        get message() { return translateKey("longevity.urgencyLevels.schedule_soon.message", "Touch-up recommended within the next year to maintain vibrancy and detail."); }
      },
      "overdue": {
        threshold: 0,
        get level() { return translateKey("longevity.urgencyLevels.overdue.level", "Overdue"); },
        icon: "🚨",
        statusClass: "status-overdue",
        get message() { return translateKey("longevity.urgencyLevels.overdue.message", "Your tattoo is overdue for a touch-up. Significant fading may have occurred."); }
      }
    }
  };

  if (typeof window !== "undefined") {
    window.TattooLongevityData = TattooLongevityData;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = TattooLongevityData;
  }
})();
if (typeof TattooLongevityData === "undefined" && typeof window !== "undefined") {
  var TattooLongevityData = window.TattooLongevityData;
}
