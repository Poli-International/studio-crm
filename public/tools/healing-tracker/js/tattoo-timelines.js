(function() {
  function translateKey(keyPath, fallback) {
    if (typeof window !== "undefined" && typeof window.t === "function") {
      var val = window.t(keyPath);
      if (val !== keyPath) return val;
    }
    return fallback;
  }

  const tattooTimelines = {
    small: {
      get healing() { return translateKey("tattooTimeline.small.healing", "1-2 weeks surface"); },
      stages: [
        {
          get stage() { return translateKey("tattooTimeline.small.stages.0.stage", "Day 1-3: Open Wound"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.small.stages.0.symptoms.0", "Bright and vibrant"),
              translateKey("tattooTimeline.small.stages.0.symptoms.1", "Redness around tattoo"),
              translateKey("tattooTimeline.small.stages.0.symptoms.2", "Mild swelling"),
              translateKey("tattooTimeline.small.stages.0.symptoms.3", "Oozing plasma/ink"),
              translateKey("tattooTimeline.small.stages.0.symptoms.4", "Feels like sunburn")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.small.stages.0.care.0", "Wash gently 2-3x daily"),
              translateKey("tattooTimeline.small.stages.0.care.1", "Apply thin layer fragrance-free lotion"),
              translateKey("tattooTimeline.small.stages.0.care.2", "No soaking/swimming"),
              translateKey("tattooTimeline.small.stages.0.care.3", "Loose clean clothing")
            ];
          }
        },
        {
          get stage() { return translateKey("tattooTimeline.small.stages.1.stage", "Day 4-7: Peeling Phase"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.small.stages.1.symptoms.0", "Looks dull/cloudy"),
              translateKey("tattooTimeline.small.stages.1.symptoms.1", "Peeling like sunburn"),
              translateKey("tattooTimeline.small.stages.1.symptoms.2", "VERY itchy"),
              translateKey("tattooTimeline.small.stages.1.symptoms.3", "Light scabbing")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.small.stages.1.care.0", "Continue washing"),
              translateKey("tattooTimeline.small.stages.1.care.1", "Moisturize frequently"),
              translateKey("tattooTimeline.small.stages.1.care.2", "SLAP don't scratch"),
              translateKey("tattooTimeline.small.stages.1.care.3", "DO NOT PICK")
            ];
          }
        },
        {
          get stage() { return translateKey("tattooTimeline.small.stages.2.stage", "Day 8-14: Settling"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.small.stages.2.symptoms.0", "Looking better"),
              translateKey("tattooTimeline.small.stages.2.symptoms.1", "Mostly done peeling"),
              translateKey("tattooTimeline.small.stages.2.symptoms.2", "Less itchy")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.small.stages.2.care.0", "Continue washing daily"),
              translateKey("tattooTimeline.small.stages.2.care.1", "Keep moisturized"),
              translateKey("tattooTimeline.small.stages.2.care.2", "Protect from sun")
            ];
          }
        }
      ]
    },
    medium: {
      get healing() { return translateKey("tattooTimeline.medium.healing", "2-3 weeks surface"); },
      stages: [
        {
          get stage() { return translateKey("tattooTimeline.medium.stages.0.stage", "Day 1-3: Open Wound"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.medium.stages.0.symptoms.0", "Vibrant colors"),
              translateKey("tattooTimeline.medium.stages.0.symptoms.1", "Moderate redness/swelling"),
              translateKey("tattooTimeline.medium.stages.0.symptoms.2", "Oozing"),
              translateKey("tattooTimeline.medium.stages.0.symptoms.3", "Tender")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.medium.stages.0.care.0", "Wash 2-3x daily"),
              translateKey("tattooTimeline.medium.stages.0.care.1", "Thin layer lotion"),
              translateKey("tattooTimeline.medium.stages.0.care.2", "No submersion"),
              translateKey("tattooTimeline.medium.stages.0.care.3", "Clean sheets")
            ];
          }
        },
        {
          get stage() { return translateKey("tattooTimeline.medium.stages.1.stage", "Day 4-10: Peeling Phase"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.medium.stages.1.symptoms.0", "Dull appearance"),
              translateKey("tattooTimeline.medium.stages.1.symptoms.1", "Significant peeling"),
              translateKey("tattooTimeline.medium.stages.1.symptoms.2", "Very itchy"),
              translateKey("tattooTimeline.medium.stages.1.symptoms.3", "Scabbing possible")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.medium.stages.1.care.0", "Continue washing"),
              translateKey("tattooTimeline.medium.stages.1.care.1", "Moisturize often"),
              translateKey("tattooTimeline.medium.stages.1.care.2", "Never pick or scratch"),
              translateKey("tattooTimeline.medium.stages.1.care.3", "Let peel naturally")
            ];
          }
        },
        {
          get stage() { return translateKey("tattooTimeline.medium.stages.2.stage", "Day 10-21: Settling"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.medium.stages.2.symptoms.0", "Color returning"),
              translateKey("tattooTimeline.medium.stages.2.symptoms.1", "Smooth again"),
              translateKey("tattooTimeline.medium.stages.2.symptoms.2", "Minimal symptoms")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.medium.stages.2.care.0", "Daily washing"),
              translateKey("tattooTimeline.medium.stages.2.care.1", "Continue moisturizing"),
              translateKey("tattooTimeline.medium.stages.2.care.2", "SPF 50+ in sun")
            ];
          }
        }
      ]
    },
    large: {
      get healing() { return translateKey("tattooTimeline.large.healing", "3-4 weeks surface"); },
      stages: [
        {
          get stage() { return translateKey("tattooTimeline.large.stages.0.stage", "Day 1-4: Open Wound"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.large.stages.0.symptoms.0", "Beautiful vibrant ink"),
              translateKey("tattooTimeline.large.stages.0.symptoms.1", "Significant redness/swelling"),
              translateKey("tattooTimeline.large.stages.0.symptoms.2", "Lots of oozing"),
              translateKey("tattooTimeline.large.stages.0.symptoms.3", "Quite sore")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.large.stages.0.care.0", "Wash 3x daily"),
              translateKey("tattooTimeline.large.stages.0.care.1", "Thin lotion application"),
              translateKey("tattooTimeline.large.stages.0.care.2", "Wrap in plastic wrap for sleep"),
              translateKey("tattooTimeline.large.stages.0.care.3", "Loose clothing only")
            ];
          }
        },
        {
          get stage() { return translateKey("tattooTimeline.large.stages.1.stage", "Day 5-14: Major Peeling"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.large.stages.1.symptoms.0", "Looks terrible (normal!)"),
              translateKey("tattooTimeline.large.stages.1.symptoms.1", "Heavy peeling"),
              translateKey("tattooTimeline.large.stages.1.symptoms.2", "Extreme itchiness"),
              translateKey("tattooTimeline.large.stages.1.symptoms.3", "Possible scabbing")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.large.stages.1.care.0", "Keep washing"),
              translateKey("tattooTimeline.large.stages.1.care.1", "Frequent moisturizing"),
              translateKey("tattooTimeline.large.stages.1.care.2", "HANDS OFF"),
              translateKey("tattooTimeline.large.stages.1.care.3", "Absolutely no picking")
            ];
          }
        },
        {
          get stage() { return translateKey("tattooTimeline.large.stages.2.stage", "Day 14-28: Settling & Healing"); },
          get symptoms() {
            return [
              translateKey("tattooTimeline.large.stages.2.symptoms.0", "Improving appearance"),
              translateKey("tattooTimeline.large.stages.2.symptoms.1", "Less peeling"),
              translateKey("tattooTimeline.large.stages.2.symptoms.2", "Color brightening")
            ];
          },
          get care() {
            return [
              translateKey("tattooTimeline.large.stages.2.care.0", "Daily care continues"),
              translateKey("tattooTimeline.large.stages.2.care.1", "Keep very moisturized"),
              translateKey("tattooTimeline.large.stages.2.care.2", "Always use SPF outside")
            ];
          }
        }
      ]
    }
  };

  if (typeof window !== "undefined") {
    window.tattooTimelines = tattooTimelines;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = tattooTimelines;
  }
})();
if (typeof tattooTimelines === "undefined" && typeof window !== "undefined") {
  var tattooTimelines = window.tattooTimelines;
}
