(function() {
  function translateKey(keyPath, fallback) {
    if (typeof window !== "undefined" && typeof window.t === "function") {
      var val = window.t(keyPath);
      if (val !== keyPath) return val;
    }
    return fallback;
  }

  const piercingTimelines = {
    "earlobe": {
      get name() { return translateKey("piercingTimeline.earlobe.name", "Earlobe"); },
      get category() { return translateKey("piercingTimeline.earlobe.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.earlobe.healing", "6-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.earlobe.difficulty", "Easy"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.earlobe.stages.0.stage", "Week 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.earlobe.stages.0.symptoms.0", "Mild redness"),
              translateKey("piercingTimeline.earlobe.stages.0.symptoms.1", "Slight swelling"),
              translateKey("piercingTimeline.earlobe.stages.0.symptoms.2", "Clear discharge (crusties)"),
              translateKey("piercingTimeline.earlobe.stages.0.symptoms.3", "Tenderness")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.earlobe.stages.0.care.0", "Spray saline 2-3x daily"),
              translateKey("piercingTimeline.earlobe.stages.0.care.1", "Don't touch except when cleaning"),
              translateKey("piercingTimeline.earlobe.stages.0.care.2", "Sleep on clean pillowcase")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.earlobe.stages.1.stage", "Week 3-6: Active Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.earlobe.stages.1.symptoms.0", "Decreasing redness"),
              translateKey("piercingTimeline.earlobe.stages.1.symptoms.1", "Minimal crusties"),
              translateKey("piercingTimeline.earlobe.stages.1.symptoms.2", "Less tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.earlobe.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.earlobe.stages.1.care.1", "Can start to sleep on it if comfortable"),
              translateKey("piercingTimeline.earlobe.stages.1.care.2", "Avoid changing jewelry yet")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.earlobe.stages.2.stage", "Week 6-8: Fully Healed"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.earlobe.stages.2.symptoms.0", "No redness"),
              translateKey("piercingTimeline.earlobe.stages.2.symptoms.1", "No discharge"),
              translateKey("piercingTimeline.earlobe.stages.2.symptoms.2", "Can change jewelry")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.earlobe.stages.2.care.0", "Clean jewelry regularly"),
              translateKey("piercingTimeline.earlobe.stages.2.care.1", "Continue good hygiene")
            ];
          }
        }
      ]
    },
    "helix": {
      get name() { return translateKey("piercingTimeline.helix.name", "Helix (Upper Cartilage)"); },
      get category() { return translateKey("piercingTimeline.helix.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.helix.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.helix.difficulty", "Moderate"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.helix.healingDiscBenefits", "HIGHLY RECOMMENDED: Cartilage piercings are extremely prone to irritation bumps. Healing discs prevent metal-to-skin contact that causes bumps, while antimicrobial silver ions protect against infection during the long healing process."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.helix.stages.0.stage", "Month 1-2: Initial Inflammation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.helix.stages.0.symptoms.0", "Moderate swelling"),
              translateKey("piercingTimeline.helix.stages.0.symptoms.1", "Redness"),
              translateKey("piercingTimeline.helix.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.helix.stages.0.symptoms.3", "Quite tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.helix.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.helix.stages.0.care.1", "AVOID sleeping on it"),
              translateKey("piercingTimeline.helix.stages.0.care.2", "No touching"),
              translateKey("piercingTimeline.helix.stages.0.care.3", "Use Poli healing discs to prevent metal contact and irritation bumps"),
              translateKey("piercingTimeline.helix.stages.0.care.4", "Downsize jewelry at 6-8 weeks")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.helix.stages.1.stage", "Month 2-4: Tissue Formation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.helix.stages.1.symptoms.0", "Less swelling"),
              translateKey("piercingTimeline.helix.stages.1.symptoms.1", "Possible irritation bumps"),
              translateKey("piercingTimeline.helix.stages.1.symptoms.2", "Occasional tenderness")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.helix.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.helix.stages.1.care.1", "If irritation bumps develop, ensure healing discs are in place"),
              translateKey("piercingTimeline.helix.stages.1.care.2", "Ensure jewelry isn't too long"),
              translateKey("piercingTimeline.helix.stages.1.care.3", "Antimicrobial discs prevent bacterial buildup")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.helix.stages.2.stage", "Month 4-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.helix.stages.2.symptoms.0", "Looks healed"),
              translateKey("piercingTimeline.helix.stages.2.symptoms.1", "Minimal symptoms")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.helix.stages.2.care.0", "Continue gentle care"),
              translateKey("piercingTimeline.helix.stages.2.care.1", "Can change jewelry carefully at 3+ months"),
              translateKey("piercingTimeline.helix.stages.2.care.2", "Continue using healing discs until fully healed")
            ];
          }
        }
      ]
    },
    "industrial": {
      get name() { return translateKey("piercingTimeline.industrial.name", "Industrial (Scaffold)"); },
      get category() { return translateKey("piercingTimeline.industrial.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.industrial.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.industrial.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.industrial.healingDiscBenefits", "CRITICAL FOR SUCCESS: Industrial piercings have TWO cartilage holes healing simultaneously with constant bar pressure. Healing discs on both ends prevent irritation bumps and reduce the risk of one hole rejecting. The antimicrobial protection is essential for this long healing process."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.industrial.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.industrial.stages.0.symptoms.0", "Significant swelling both holes"),
              translateKey("piercingTimeline.industrial.stages.0.symptoms.1", "Moderate pain"),
              translateKey("piercingTimeline.industrial.stages.0.symptoms.2", "Heavy crusties"),
              translateKey("piercingTimeline.industrial.stages.0.symptoms.3", "Very tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.industrial.stages.0.care.0", "Saline spray 3x daily both holes"),
              translateKey("piercingTimeline.industrial.stages.0.care.1", "Never sleep on it"),
              translateKey("piercingTimeline.industrial.stages.0.care.2", "No touching bar"),
              translateKey("piercingTimeline.industrial.stages.0.care.3", "Use healing discs on BOTH ends to prevent bumps"),
              translateKey("piercingTimeline.industrial.stages.0.care.4", "May need longer bar initially")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.industrial.stages.1.stage", "Month 3-9: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.industrial.stages.1.symptoms.0", "Gradual improvement"),
              translateKey("piercingTimeline.industrial.stages.1.symptoms.1", "Occasional irritation bumps"),
              translateKey("piercingTimeline.industrial.stages.1.symptoms.2", "One hole may heal faster than other")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.industrial.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.industrial.stages.1.care.1", "Healing discs prevent metal bar irritation"),
              translateKey("piercingTimeline.industrial.stages.1.care.2", "Downsize bar at 2-3 months"),
              translateKey("piercingTimeline.industrial.stages.1.care.3", "Be very patient"),
              translateKey("piercingTimeline.industrial.stages.1.care.4", "Avoid snagging hair")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.industrial.stages.2.stage", "Month 9-12: Final Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.industrial.stages.2.symptoms.0", "Both holes should look healed")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.industrial.stages.2.care.0", "Can change jewelry carefully"),
              translateKey("piercingTimeline.industrial.stages.2.care.1", "Continue discs until completely healed"),
              translateKey("piercingTimeline.industrial.stages.2.care.2", "Monitor for irritation")
            ];
          }
        }
      ]
    },
    "daith": {
      get name() { return translateKey("piercingTimeline.daith.name", "Daith (Inner Cartilage)"); },
      get category() { return translateKey("piercingTimeline.daith.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.daith.healing", "6-9 months"); },
      get difficulty() { return translateKey("piercingTimeline.daith.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.daith.healingDiscBenefits", "HIGHLY RECOMMENDED: Daith piercings are in a difficult-to-clean fold and highly prone to bumps. Healing discs with antimicrobial protection keep bacteria away from this hard-to-reach area while preventing metal irritation."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.daith.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.daith.stages.0.symptoms.0", "Moderate to significant swelling"),
              translateKey("piercingTimeline.daith.stages.0.symptoms.1", "Deep cartilage pain"),
              translateKey("piercingTimeline.daith.stages.0.symptoms.2", "Crusties hard to reach"),
              translateKey("piercingTimeline.daith.stages.0.symptoms.3", "Tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.daith.stages.0.care.0", "Saline spray carefully into fold 2-3x daily"),
              translateKey("piercingTimeline.daith.stages.0.care.1", "No sleeping on it"),
              translateKey("piercingTimeline.daith.stages.0.care.2", "Use healing discs to protect this vulnerable cartilage"),
              translateKey("piercingTimeline.daith.stages.0.care.3", "No earbuds/headphones"),
              translateKey("piercingTimeline.daith.stages.0.care.4", "Avoid bumping")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.daith.stages.1.stage", "Month 3-9: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.daith.stages.1.symptoms.0", "Decreasing swelling"),
              translateKey("piercingTimeline.daith.stages.1.symptoms.1", "Less tender"),
              translateKey("piercingTimeline.daith.stages.1.symptoms.2", "Crusties reduce")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.daith.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.daith.stages.1.care.1", "Antimicrobial discs prevent infection in this fold"),
              translateKey("piercingTimeline.daith.stages.1.care.2", "Can resume headphones carefully after 4-5 months"),
              translateKey("piercingTimeline.daith.stages.1.care.3", "No jewelry changes until fully healed")
            ];
          }
        }
      ]
    },
    "rook": {
      get name() { return translateKey("piercingTimeline.rook.name", "Rook (Anti-Helix Fold)"); },
      get category() { return translateKey("piercingTimeline.rook.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.rook.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.rook.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.rook.healingDiscBenefits", "HIGHLY RECOMMENDED: Rook piercings are notoriously prone to irritation bumps and have one of the longest healing times. Healing discs dramatically reduce bump formation and protect against infection."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.rook.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.rook.stages.0.symptoms.0", "Significant swelling in fold"),
              translateKey("piercingTimeline.rook.stages.0.symptoms.1", "Moderate pain"),
              translateKey("piercingTimeline.rook.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.rook.stages.0.symptoms.3", "Very tender to touch")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.rook.stages.0.care.0", "Saline spray into fold 2-3x daily"),
              translateKey("piercingTimeline.rook.stages.0.care.1", "Absolutely no sleeping on it"),
              translateKey("piercingTimeline.rook.stages.0.care.2", "Use healing discs on both ends of curved barbell"),
              translateKey("piercingTimeline.rook.stages.0.care.3", "No touching"),
              translateKey("piercingTimeline.rook.stages.0.care.4", "Curved barbell needed")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.rook.stages.1.stage", "Month 3-12: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.rook.stages.1.symptoms.0", "Slow improvement"),
              translateKey("piercingTimeline.rook.stages.1.symptoms.1", "Occasional bumps common"),
              translateKey("piercingTimeline.rook.stages.1.symptoms.2", "Crusties decrease")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.rook.stages.1.care.0", "Be very patient"),
              translateKey("piercingTimeline.rook.stages.1.care.1", "Healing discs prevent the bumps this piercing is famous for"),
              translateKey("piercingTimeline.rook.stages.1.care.2", "Continue saline 2x daily"),
              translateKey("piercingTimeline.rook.stages.1.care.3", "Downsize at 2-3 months"),
              translateKey("piercingTimeline.rook.stages.1.care.4", "Avoid irritation")
            ];
          }
        }
      ]
    },
    "tragus": {
      get name() { return translateKey("piercingTimeline.tragus.name", "Tragus"); },
      get category() { return translateKey("piercingTimeline.tragus.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.tragus.healing", "4-8 months"); },
      get difficulty() { return translateKey("piercingTimeline.tragus.difficulty", "Moderate"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.tragus.healingDiscBenefits", "RECOMMENDED: Tragus piercings face constant pressure from headphones and phones. Healing discs create a protective barrier that prevents irritation from these daily activities."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.tragus.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.tragus.stages.0.symptoms.0", "Moderate swelling"),
              translateKey("piercingTimeline.tragus.stages.0.symptoms.1", "Tender especially with headphones"),
              translateKey("piercingTimeline.tragus.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.tragus.stages.0.symptoms.3", "Slight throbbing")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.tragus.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.tragus.stages.0.care.1", "Use healing discs to buffer pressure from phones"),
              translateKey("piercingTimeline.tragus.stages.0.care.2", "No earbuds for 2-3 months"),
              translateKey("piercingTimeline.tragus.stages.0.care.3", "Be careful with phones"),
              translateKey("piercingTimeline.tragus.stages.0.care.4", "Don't sleep on it")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.tragus.stages.1.stage", "Month 2-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.tragus.stages.1.symptoms.0", "Decreasing swelling"),
              translateKey("piercingTimeline.tragus.stages.1.symptoms.1", "Can tolerate gentle pressure"),
              translateKey("piercingTimeline.tragus.stages.1.symptoms.2", "Less crusties")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.tragus.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.tragus.stages.1.care.1", "Healing discs allow earlier return to headphone use"),
              translateKey("piercingTimeline.tragus.stages.1.care.2", "Downsize at 6-8 weeks"),
              translateKey("piercingTimeline.tragus.stages.1.care.3", "Can change jewelry at 4+ months")
            ];
          }
        }
      ]
    },
    "anti_tragus": {
      get name() { return translateKey("piercingTimeline.anti_tragus.name", "Anti-Tragus"); },
      get category() { return translateKey("piercingTimeline.anti_tragus.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.anti_tragus.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.anti_tragus.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.anti_tragus.healingDiscBenefits", "HIGHLY RECOMMENDED: Anti-tragus piercings are extremely prone to bumps due to the anatomy and pressure. Healing discs are essential for successful healing."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.anti_tragus.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.anti_tragus.stages.0.symptoms.0", "Significant swelling"),
              translateKey("piercingTimeline.anti_tragus.stages.0.symptoms.1", "Quite painful"),
              translateKey("piercingTimeline.anti_tragus.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.anti_tragus.stages.0.symptoms.3", "Pressure sensitive")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.anti_tragus.stages.0.care.0", "Saline spray 2-3x daily carefully"),
              translateKey("piercingTimeline.anti_tragus.stages.0.care.1", "Use healing discs immediately to prevent bumps"),
              translateKey("piercingTimeline.anti_tragus.stages.0.care.2", "No earbuds"),
              translateKey("piercingTimeline.anti_tragus.stages.0.care.3", "No sleeping on it"),
              translateKey("piercingTimeline.anti_tragus.stages.0.care.4", "Avoid touching")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.anti_tragus.stages.1.stage", "Month 3-12: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.anti_tragus.stages.1.symptoms.0", "Slow improvement"),
              translateKey("piercingTimeline.anti_tragus.stages.1.symptoms.1", "Bumps common if irritated"),
              translateKey("piercingTimeline.anti_tragus.stages.1.symptoms.2", "Less painful")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.anti_tragus.stages.1.care.0", "Very patient approach needed"),
              translateKey("piercingTimeline.anti_tragus.stages.1.care.1", "Healing discs prevent common bump problems"),
              translateKey("piercingTimeline.anti_tragus.stages.1.care.2", "Continue saline 2x daily"),
              translateKey("piercingTimeline.anti_tragus.stages.1.care.3", "Downsize at 2-3 months")
            ];
          }
        }
      ]
    },
    "conch": {
      get name() { return translateKey("piercingTimeline.conch.name", "Conch (Inner or Outer)"); },
      get category() { return translateKey("piercingTimeline.conch.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.conch.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.conch.difficulty", "Moderate"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.conch.healingDiscBenefits", "RECOMMENDED: Conch piercings benefit from healing discs especially when sleeping on them is unavoidable or when transitioning to a ring."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.conch.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.conch.stages.0.symptoms.0", "Moderate swelling"),
              translateKey("piercingTimeline.conch.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.conch.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.conch.stages.0.symptoms.3", "Throbbing possible")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.conch.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.conch.stages.0.care.1", "No sleeping on it"),
              translateKey("piercingTimeline.conch.stages.0.care.2", "Use healing discs to prevent pressure irritation"),
              translateKey("piercingTimeline.conch.stages.0.care.3", "Stud recommended initially"),
              translateKey("piercingTimeline.conch.stages.0.care.4", "No headphones on that ear")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.conch.stages.1.stage", "Month 3-12: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.conch.stages.1.symptoms.0", "Gradual improvement"),
              translateKey("piercingTimeline.conch.stages.1.symptoms.1", "Can try ring at 6+ months"),
              translateKey("piercingTimeline.conch.stages.1.symptoms.2", "Looks mostly healed")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.conch.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.conch.stages.1.care.1", "Healing discs especially helpful when switching to ring"),
              translateKey("piercingTimeline.conch.stages.1.care.2", "Downsize at 8-12 weeks"),
              translateKey("piercingTimeline.conch.stages.1.care.3", "Be patient for jewelry changes")
            ];
          }
        }
      ]
    },
    "snug": {
      get name() { return translateKey("piercingTimeline.snug.name", "Snug (Anti-Helix)"); },
      get category() { return translateKey("piercingTimeline.snug.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.snug.healing", "9-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.snug.difficulty", "Very Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.snug.healingDiscBenefits", "CRITICAL: Snug piercings have the highest rejection and complication rate. Healing discs are absolutely essential - they may be the difference between keeping or retiring this piercing. Prevents the notorious bumps and reduces rejection risk."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.snug.stages.0.stage", "Month 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.snug.stages.0.symptoms.0", "Very significant swelling"),
              translateKey("piercingTimeline.snug.stages.0.symptoms.1", "Quite painful"),
              translateKey("piercingTimeline.snug.stages.0.symptoms.2", "Heavy crusties"),
              translateKey("piercingTimeline.snug.stages.0.symptoms.3", "Very tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.snug.stages.0.care.0", "Saline spray 3x daily"),
              translateKey("piercingTimeline.snug.stages.0.care.1", "Never sleep on it"),
              translateKey("piercingTimeline.snug.stages.0.care.2", "Use healing discs immediately - non-negotiable for this piercing"),
              translateKey("piercingTimeline.snug.stages.0.care.3", "Curved barbell essential"),
              translateKey("piercingTimeline.snug.stages.0.care.4", "Avoid all pressure")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.snug.stages.1.stage", "Month 4-12: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.snug.stages.1.symptoms.0", "Very slow improvement"),
              translateKey("piercingTimeline.snug.stages.1.symptoms.1", "Bumps very common"),
              translateKey("piercingTimeline.snug.stages.1.symptoms.2", "Rejection possible")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.snug.stages.1.care.0", "Extreme patience required"),
              translateKey("piercingTimeline.snug.stages.1.care.1", "Healing discs are your best defense against bumps and rejection"),
              translateKey("piercingTimeline.snug.stages.1.care.2", "Continue saline 2x daily"),
              translateKey("piercingTimeline.snug.stages.1.care.3", "Monitor for migration"),
              translateKey("piercingTimeline.snug.stages.1.care.4", "Many people retire this piercing")
            ];
          }
        }
      ]
    },
    "forward_helix": {
      get name() { return translateKey("piercingTimeline.forward_helix.name", "Forward Helix"); },
      get category() { return translateKey("piercingTimeline.forward_helix.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.forward_helix.healing", "4-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.forward_helix.difficulty", "Moderate"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.forward_helix.healingDiscBenefits", "RECOMMENDED: Forward helix piercings are prone to snagging and pressure from glasses. Healing discs provide protection and prevent irritation bumps."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.forward_helix.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.forward_helix.stages.0.symptoms.0", "Moderate swelling"),
              translateKey("piercingTimeline.forward_helix.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.forward_helix.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.forward_helix.stages.0.symptoms.3", "Sensitive to touch")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.forward_helix.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.forward_helix.stages.0.care.1", "Use healing discs to protect from glasses and hair"),
              translateKey("piercingTimeline.forward_helix.stages.0.care.2", "No sleeping on it"),
              translateKey("piercingTimeline.forward_helix.stages.0.care.3", "Watch for snagging hair"),
              translateKey("piercingTimeline.forward_helix.stages.0.care.4", "Be careful with glasses")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.forward_helix.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.forward_helix.stages.1.symptoms.0", "Decreasing symptoms"),
              translateKey("piercingTimeline.forward_helix.stages.1.symptoms.1", "Looks good"),
              translateKey("piercingTimeline.forward_helix.stages.1.symptoms.2", "Less tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.forward_helix.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.forward_helix.stages.1.care.1", "Healing discs prevent bump formation"),
              translateKey("piercingTimeline.forward_helix.stages.1.care.2", "Downsize at 6-8 weeks"),
              translateKey("piercingTimeline.forward_helix.stages.1.care.3", "Can change jewelry at 3-4 months")
            ];
          }
        }
      ]
    },
    "orbital": {
      get name() { return translateKey("piercingTimeline.orbital.name", "Orbital (Connected Hoops)"); },
      get category() { return translateKey("piercingTimeline.orbital.category", "Ear"); },
      get healing() { return translateKey("piercingTimeline.orbital.healing", "6-9 months"); },
      get difficulty() { return translateKey("piercingTimeline.orbital.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.orbital.healingDiscBenefits", "RECOMMENDED: Like industrial piercings, orbitals have two holes healing with constant tension. Healing discs on both sides prevent irritation and ensure both holes heal evenly."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.orbital.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.orbital.stages.0.symptoms.0", "Both holes swollen"),
              translateKey("piercingTimeline.orbital.stages.0.symptoms.1", "Moderate pain"),
              translateKey("piercingTimeline.orbital.stages.0.symptoms.2", "Crusties on both holes"),
              translateKey("piercingTimeline.orbital.stages.0.symptoms.3", "Ring may feel tight")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.orbital.stages.0.care.0", "Saline spray both holes 2-3x daily"),
              translateKey("piercingTimeline.orbital.stages.0.care.1", "No sleeping on it"),
              translateKey("piercingTimeline.orbital.stages.0.care.2", "Use healing discs on both holes"),
              translateKey("piercingTimeline.orbital.stages.0.care.3", "May need larger ring initially"),
              translateKey("piercingTimeline.orbital.stages.0.care.4", "No rotating ring")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.orbital.stages.1.stage", "Month 3-9: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.orbital.stages.1.symptoms.0", "Gradual improvement"),
              translateKey("piercingTimeline.orbital.stages.1.symptoms.1", "Both holes may heal at different rates")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.orbital.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.orbital.stages.1.care.1", "Healing discs help both holes heal at similar rates"),
              translateKey("piercingTimeline.orbital.stages.1.care.2", "Can downsize ring at 2-3 months"),
              translateKey("piercingTimeline.orbital.stages.1.care.3", "Both holes must be healed before changing")
            ];
          }
        }
      ]
    },
    "nostril": {
      get name() { return translateKey("piercingTimeline.nostril.name", "Nostril"); },
      get category() { return translateKey("piercingTimeline.nostril.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.nostril.healing", "3-4 months"); },
      get difficulty() { return translateKey("piercingTimeline.nostril.difficulty", "Moderate"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.nostril.healingDiscBenefits", "HIGHLY RECOMMENDED: Nostril piercings are extremely prone to irritation bumps (nose bumps). Healing discs prevent the metal stud backing from irritating the inside of your nose, which is the #1 cause of bumps. Antimicrobial protection also prevents infection from nasal bacteria."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.nostril.stages.0.stage", "Month 1: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.nostril.stages.0.symptoms.0", "Moderate redness"),
              translateKey("piercingTimeline.nostril.stages.0.symptoms.1", "Mild swelling"),
              translateKey("piercingTimeline.nostril.stages.0.symptoms.2", "Crusties inside and outside nose")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.nostril.stages.0.care.0", "Spray saline 2-3x daily including inside nostril"),
              translateKey("piercingTimeline.nostril.stages.0.care.1", "Use healing disc inside nose to prevent bumps"),
              translateKey("piercingTimeline.nostril.stages.0.care.2", "Blow nose gently"),
              translateKey("piercingTimeline.nostril.stages.0.care.3", "Keep makeup away"),
              translateKey("piercingTimeline.nostril.stages.0.care.4", "Antimicrobial protection critical with nasal bacteria")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.nostril.stages.1.stage", "Month 2-4: Tissue Strengthening"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.nostril.stages.1.symptoms.0", "Decreasing redness"),
              translateKey("piercingTimeline.nostril.stages.1.symptoms.1", "Less discharge")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.nostril.stages.1.care.0", "Continue saline 1-2x daily"),
              translateKey("piercingTimeline.nostril.stages.1.care.1", "If bump develops, ensure healing disc is properly positioned"),
              translateKey("piercingTimeline.nostril.stages.1.care.2", "Can try ring at 2-3 months"),
              translateKey("piercingTimeline.nostril.stages.1.care.3", "Continue disc use until fully healed")
            ];
          }
        }
      ]
    },
    "septum": {
      get name() { return translateKey("piercingTimeline.septum.name", "Septum"); },
      get category() { return translateKey("piercingTimeline.septum.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.septum.healing", "2-3 months"); },
      get difficulty() { return translateKey("piercingTimeline.septum.difficulty", "Easy to Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.septum.stages.0.stage", "Week 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.septum.stages.0.symptoms.0", "Mild redness inside nose"),
              translateKey("piercingTimeline.septum.stages.0.symptoms.1", "Boogers stick to jewelry"),
              translateKey("piercingTimeline.septum.stages.0.symptoms.2", "Tender when moving jewelry")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.septum.stages.0.care.0", "Saline spray 2-3x daily up into nose"),
              translateKey("piercingTimeline.septum.stages.0.care.1", "Can flip up/down once per day max"),
              translateKey("piercingTimeline.septum.stages.0.care.2", "Blow nose gently")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.septum.stages.1.stage", "Month 2-3: Fully Healed"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.septum.stages.1.symptoms.0", "No tenderness"),
              translateKey("piercingTimeline.septum.stages.1.symptoms.1", "Looks healed")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.septum.stages.1.care.0", "Can change jewelry at 6-8+ weeks"),
              translateKey("piercingTimeline.septum.stages.1.care.1", "Keep clean")
            ];
          }
        }
      ]
    },
    "bridge": {
      get name() { return translateKey("piercingTimeline.bridge.name", "Bridge (Nose Bridge)"); },
      get category() { return translateKey("piercingTimeline.bridge.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.bridge.healing", "8-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.bridge.difficulty", "Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.bridge.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.bridge.stages.0.symptoms.0", "Moderate swelling on bridge"),
              translateKey("piercingTimeline.bridge.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.bridge.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.bridge.stages.0.symptoms.3", "May affect glasses")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.bridge.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.bridge.stages.0.care.1", "No glasses if possible"),
              translateKey("piercingTimeline.bridge.stages.0.care.2", "Watch for migration"),
              translateKey("piercingTimeline.bridge.stages.0.care.3", "Straight barbell only")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.bridge.stages.1.stage", "Month 3-12: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.bridge.stages.1.symptoms.0", "Slow healing"),
              translateKey("piercingTimeline.bridge.stages.1.symptoms.1", "Monitor for rejection")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.bridge.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.bridge.stages.1.care.1", "Watch for thinning skin"),
              translateKey("piercingTimeline.bridge.stages.1.care.2", "May need to retire if migrating")
            ];
          }
        }
      ]
    },
    "high_nostril": {
      get name() { return translateKey("piercingTimeline.high_nostril.name", "High Nostril"); },
      get category() { return translateKey("piercingTimeline.high_nostril.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.high_nostril.healing", "6-9 months"); },
      get difficulty() { return translateKey("piercingTimeline.high_nostril.difficulty", "Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.high_nostril.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.high_nostril.stages.0.symptoms.0", "Swelling higher on nose"),
              translateKey("piercingTimeline.high_nostril.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.high_nostril.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.high_nostril.stages.0.symptoms.3", "Longer healing than standard nostril")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.high_nostril.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.high_nostril.stages.0.care.1", "No makeup near piercing"),
              translateKey("piercingTimeline.high_nostril.stages.0.care.2", "Straight jewelry recommended"),
              translateKey("piercingTimeline.high_nostril.stages.0.care.3", "Be very patient")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.high_nostril.stages.1.stage", "Month 3-9: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.high_nostril.stages.1.symptoms.0", "Gradual improvement"),
              translateKey("piercingTimeline.high_nostril.stages.1.symptoms.1", "Crusties decrease")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.high_nostril.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.high_nostril.stages.1.care.1", "No jewelry changes until fully healed"),
              translateKey("piercingTimeline.high_nostril.stages.1.care.2", "Avoid irritation")
            ];
          }
        }
      ]
    },
    "eyebrow": {
      get name() { return translateKey("piercingTimeline.eyebrow.name", "Eyebrow"); },
      get category() { return translateKey("piercingTimeline.eyebrow.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.eyebrow.healing", "6-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.eyebrow.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.eyebrow.stages.0.stage", "Week 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.eyebrow.stages.0.symptoms.0", "Swelling around eyebrow"),
              translateKey("piercingTimeline.eyebrow.stages.0.symptoms.1", "Bruising possible"),
              translateKey("piercingTimeline.eyebrow.stages.0.symptoms.2", "Tender"),
              translateKey("piercingTimeline.eyebrow.stages.0.symptoms.3", "Crusties")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.eyebrow.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.eyebrow.stages.0.care.1", "No makeup on piercing"),
              translateKey("piercingTimeline.eyebrow.stages.0.care.2", "Watch for rejection"),
              translateKey("piercingTimeline.eyebrow.stages.0.care.3", "Curved barbell needed")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.eyebrow.stages.1.stage", "Week 4-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.eyebrow.stages.1.symptoms.0", "Swelling decreases"),
              translateKey("piercingTimeline.eyebrow.stages.1.symptoms.1", "Looks healed")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.eyebrow.stages.1.care.0", "Continue saline 2x daily"),
              translateKey("piercingTimeline.eyebrow.stages.1.care.1", "Monitor for migration"),
              translateKey("piercingTimeline.eyebrow.stages.1.care.2", "Can change jewelry at 6+ weeks")
            ];
          }
        }
      ]
    },
    "anti_eyebrow": {
      get name() { return translateKey("piercingTimeline.anti_eyebrow.name", "Anti-Eyebrow (Teardrop)"); },
      get category() { return translateKey("piercingTimeline.anti_eyebrow.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.anti_eyebrow.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.anti_eyebrow.difficulty", "Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.anti_eyebrow.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.anti_eyebrow.stages.0.symptoms.0", "Swelling on cheekbone"),
              translateKey("piercingTimeline.anti_eyebrow.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.anti_eyebrow.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.anti_eyebrow.stages.0.symptoms.3", "High rejection risk")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.anti_eyebrow.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.anti_eyebrow.stages.0.care.1", "Watch for migration"),
              translateKey("piercingTimeline.anti_eyebrow.stages.0.care.2", "Surface bar needed"),
              translateKey("piercingTimeline.anti_eyebrow.stages.0.care.3", "May need to retire early")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.anti_eyebrow.stages.1.stage", "Month 3-12: Monitoring Phase"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.anti_eyebrow.stages.1.symptoms.0", "May look healed but watch for rejection")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.anti_eyebrow.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.anti_eyebrow.stages.1.care.1", "Monitor for skin thinning"),
              translateKey("piercingTimeline.anti_eyebrow.stages.1.care.2", "Many people eventually retire this")
            ];
          }
        }
      ]
    },
    "cheek": {
      get name() { return translateKey("piercingTimeline.cheek.name", "Cheek (Dimple)"); },
      get category() { return translateKey("piercingTimeline.cheek.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.cheek.healing", "8-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.cheek.difficulty", "Very Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.cheek.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.cheek.stages.0.symptoms.0", "Significant facial swelling"),
              translateKey("piercingTimeline.cheek.stages.0.symptoms.1", "Quite painful"),
              translateKey("piercingTimeline.cheek.stages.0.symptoms.2", "Heavy discharge"),
              translateKey("piercingTimeline.cheek.stages.0.symptoms.3", "Eating difficult")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.cheek.stages.0.care.0", "Saline spray outside 2-3x daily"),
              translateKey("piercingTimeline.cheek.stages.0.care.1", "Alcohol-free mouthwash inside 2x daily"),
              translateKey("piercingTimeline.cheek.stages.0.care.2", "Long labret needed initially"),
              translateKey("piercingTimeline.cheek.stages.0.care.3", "Soft foods")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.cheek.stages.1.stage", "Month 3-12: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.cheek.stages.1.symptoms.0", "Gradual improvement"),
              translateKey("piercingTimeline.cheek.stages.1.symptoms.1", "Scarring normal (dimple effect)"),
              translateKey("piercingTimeline.cheek.stages.1.symptoms.2", "Eating returns to normal")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.cheek.stages.1.care.0", "Continue both internal and external care"),
              translateKey("piercingTimeline.cheek.stages.1.care.1", "Downsize at 2-3 months"),
              translateKey("piercingTimeline.cheek.stages.1.care.2", "Full healing takes long time")
            ];
          }
        }
      ]
    },
    "medusa": {
      get name() { return translateKey("piercingTimeline.medusa.name", "Medusa (Philtrum)"); },
      get category() { return translateKey("piercingTimeline.medusa.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.medusa.healing", "8-12 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.medusa.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.medusa.stages.0.stage", "Week 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.medusa.stages.0.symptoms.0", "Swelling of upper lip"),
              translateKey("piercingTimeline.medusa.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.medusa.stages.0.symptoms.2", "Crusties outside"),
              translateKey("piercingTimeline.medusa.stages.0.symptoms.3", "Slight lisp possible")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.medusa.stages.0.care.0", "Saline spray outside 2-3x daily"),
              translateKey("piercingTimeline.medusa.stages.0.care.1", "Alcohol-free mouthwash inside after eating"),
              translateKey("piercingTimeline.medusa.stages.0.care.2", "Long labret initially"),
              translateKey("piercingTimeline.medusa.stages.0.care.3", "Avoid spicy/acidic foods")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.medusa.stages.1.stage", "Week 4-12: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.medusa.stages.1.symptoms.0", "Swelling decreases"),
              translateKey("piercingTimeline.medusa.stages.1.symptoms.1", "Speech returns to normal"),
              translateKey("piercingTimeline.medusa.stages.1.symptoms.2", "Looks healed")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.medusa.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.medusa.stages.1.care.1", "Downsize at 4-6 weeks"),
              translateKey("piercingTimeline.medusa.stages.1.care.2", "Monitor gum erosion")
            ];
          }
        }
      ]
    },
    "monroe": {
      get name() { return translateKey("piercingTimeline.monroe.name", "Monroe/Madonna"); },
      get category() { return translateKey("piercingTimeline.monroe.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.monroe.healing", "8-12 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.monroe.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.monroe.stages.0.stage", "Week 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.monroe.stages.0.symptoms.0", "Swelling of upper lip area"),
              translateKey("piercingTimeline.monroe.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.monroe.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.monroe.stages.0.symptoms.3", "Slight discomfort with smiling")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.monroe.stages.0.care.0", "Saline spray outside 2-3x daily"),
              translateKey("piercingTimeline.monroe.stages.0.care.1", "Alcohol-free mouthwash inside"),
              translateKey("piercingTimeline.monroe.stages.0.care.2", "Long labret needed"),
              translateKey("piercingTimeline.monroe.stages.0.care.3", "Avoid makeup on it")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.monroe.stages.1.stage", "Week 4-12: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.monroe.stages.1.symptoms.0", "Swelling goes down"),
              translateKey("piercingTimeline.monroe.stages.1.symptoms.1", "Looks good"),
              translateKey("piercingTimeline.monroe.stages.1.symptoms.2", "No discomfort")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.monroe.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.monroe.stages.1.care.1", "Downsize at 4-6 weeks"),
              translateKey("piercingTimeline.monroe.stages.1.care.2", "Can wear flat disc jewelry")
            ];
          }
        }
      ]
    },
    "labret": {
      get name() { return translateKey("piercingTimeline.labret.name", "Labret (Lower Lip Center)"); },
      get category() { return translateKey("piercingTimeline.labret.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.labret.healing", "6-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.labret.difficulty", "Easy to Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.labret.stages.0.stage", "Week 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.labret.stages.0.symptoms.0", "Swelling of lower lip"),
              translateKey("piercingTimeline.labret.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.labret.stages.0.symptoms.2", "Crusties outside"),
              translateKey("piercingTimeline.labret.stages.0.symptoms.3", "Slight speech changes")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.labret.stages.0.care.0", "Saline spray outside 2-3x daily"),
              translateKey("piercingTimeline.labret.stages.0.care.1", "Alcohol-free mouthwash inside after eating/drinking"),
              translateKey("piercingTimeline.labret.stages.0.care.2", "Long labret initially"),
              translateKey("piercingTimeline.labret.stages.0.care.3", "Cold foods help swelling")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.labret.stages.1.stage", "Week 3-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.labret.stages.1.symptoms.0", "Swelling decreases"),
              translateKey("piercingTimeline.labret.stages.1.symptoms.1", "Speech normal"),
              translateKey("piercingTimeline.labret.stages.1.symptoms.2", "Looks healed")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.labret.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.labret.stages.1.care.1", "Downsize at 3-4 weeks"),
              translateKey("piercingTimeline.labret.stages.1.care.2", "Monitor for gum erosion")
            ];
          }
        }
      ]
    },
    "vertical_labret": {
      get name() { return translateKey("piercingTimeline.vertical_labret.name", "Vertical Labret"); },
      get category() { return translateKey("piercingTimeline.vertical_labret.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.vertical_labret.healing", "6-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.vertical_labret.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.vertical_labret.stages.0.stage", "Week 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.vertical_labret.stages.0.symptoms.0", "Lip swelling both exit points"),
              translateKey("piercingTimeline.vertical_labret.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.vertical_labret.stages.0.symptoms.2", "Curved barbell visible top and bottom"),
              translateKey("piercingTimeline.vertical_labret.stages.0.symptoms.3", "Eating carefully")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.vertical_labret.stages.0.care.0", "Saline spray 2-3x daily both holes"),
              translateKey("piercingTimeline.vertical_labret.stages.0.care.1", "Rinse mouth after eating"),
              translateKey("piercingTimeline.vertical_labret.stages.0.care.2", "No oral contact"),
              translateKey("piercingTimeline.vertical_labret.stages.0.care.3", "Curved barbell needed")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.vertical_labret.stages.1.stage", "Week 3-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.vertical_labret.stages.1.symptoms.0", "Swelling decreases"),
              translateKey("piercingTimeline.vertical_labret.stages.1.symptoms.1", "Both holes look good")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.vertical_labret.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.vertical_labret.stages.1.care.1", "Downsize at 3-4 weeks"),
              translateKey("piercingTimeline.vertical_labret.stages.1.care.2", "Heals faster than regular labret (no inside hole)")
            ];
          }
        }
      ]
    },
    "snake_bites": {
      get name() { return translateKey("piercingTimeline.snake_bites.name", "Snake Bites (Lower Lip Pair)"); },
      get category() { return translateKey("piercingTimeline.snake_bites.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.snake_bites.healing", "6-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.snake_bites.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.snake_bites.stages.0.stage", "Week 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.snake_bites.stages.0.symptoms.0", "Swelling both sides of lower lip"),
              translateKey("piercingTimeline.snake_bites.stages.0.symptoms.1", "Tender both holes"),
              translateKey("piercingTimeline.snake_bites.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.snake_bites.stages.0.symptoms.3", "Speech slightly affected")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.snake_bites.stages.0.care.0", "Saline spray outside 2-3x daily"),
              translateKey("piercingTimeline.snake_bites.stages.0.care.1", "Alcohol-free mouthwash inside frequently"),
              translateKey("piercingTimeline.snake_bites.stages.0.care.2", "Long jewelry both sides"),
              translateKey("piercingTimeline.snake_bites.stages.0.care.3", "Symmetrical placement important")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.snake_bites.stages.1.stage", "Week 3-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.snake_bites.stages.1.symptoms.0", "Both healing at similar rate hopefully"),
              translateKey("piercingTimeline.snake_bites.stages.1.symptoms.1", "Swelling decreases")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.snake_bites.stages.1.care.0", "Continue care both piercings"),
              translateKey("piercingTimeline.snake_bites.stages.1.care.1", "Downsize both at same time"),
              translateKey("piercingTimeline.snake_bites.stages.1.care.2", "Monitor gum erosion both sides")
            ];
          }
        }
      ]
    },
    "angel_bites": {
      get name() { return translateKey("piercingTimeline.angel_bites.name", "Angel Bites (Upper Lip Pair)"); },
      get category() { return translateKey("piercingTimeline.angel_bites.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.angel_bites.healing", "8-12 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.angel_bites.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.angel_bites.stages.0.stage", "Week 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.angel_bites.stages.0.symptoms.0", "Upper lip swelling both sides"),
              translateKey("piercingTimeline.angel_bites.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.angel_bites.stages.0.symptoms.2", "Monroe on each side"),
              translateKey("piercingTimeline.angel_bites.stages.0.symptoms.3", "Eating carefully")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.angel_bites.stages.0.care.0", "Saline spray outside 2-3x daily"),
              translateKey("piercingTimeline.angel_bites.stages.0.care.1", "Mouthwash inside frequently"),
              translateKey("piercingTimeline.angel_bites.stages.0.care.2", "Long labrets both sides"),
              translateKey("piercingTimeline.angel_bites.stages.0.care.3", "Avoid spicy foods")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.angel_bites.stages.1.stage", "Week 4-12: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.angel_bites.stages.1.symptoms.0", "Both sides healing"),
              translateKey("piercingTimeline.angel_bites.stages.1.symptoms.1", "Swelling decreases")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.angel_bites.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.angel_bites.stages.1.care.1", "Downsize both at 4-6 weeks"),
              translateKey("piercingTimeline.angel_bites.stages.1.care.2", "Symmetry important")
            ];
          }
        }
      ]
    },
    "smiley": {
      get name() { return translateKey("piercingTimeline.smiley.name", "Smiley (Upper Frenulum)"); },
      get category() { return translateKey("piercingTimeline.smiley.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.smiley.healing", "4-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.smiley.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.smiley.stages.0.stage", "Week 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.smiley.stages.0.symptoms.0", "Tender frenulum"),
              translateKey("piercingTimeline.smiley.stages.0.symptoms.1", "Slight discomfort smiling"),
              translateKey("piercingTimeline.smiley.stages.0.symptoms.2", "Visible when smiling")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.smiley.stages.0.care.0", "Alcohol-free mouthwash 2-3x daily"),
              translateKey("piercingTimeline.smiley.stages.0.care.1", "Be gentle brushing"),
              translateKey("piercingTimeline.smiley.stages.0.care.2", "Check frenulum isn't tearing"),
              translateKey("piercingTimeline.smiley.stages.0.care.3", "Circular barbell or curved barbell")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.smiley.stages.1.stage", "Week 2-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.smiley.stages.1.symptoms.0", "Heals quickly usually"),
              translateKey("piercingTimeline.smiley.stages.1.symptoms.1", "No discomfort")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.smiley.stages.1.care.0", "Continue mouthwash"),
              translateKey("piercingTimeline.smiley.stages.1.care.1", "Monitor for gum damage"),
              translateKey("piercingTimeline.smiley.stages.1.care.2", "May need to retire if problematic")
            ];
          }
        }
      ]
    },
    "frowny": {
      get name() { return translateKey("piercingTimeline.frowny.name", "Frowny (Lower Frenulum)"); },
      get category() { return translateKey("piercingTimeline.frowny.category", "Face"); },
      get healing() { return translateKey("piercingTimeline.frowny.healing", "4-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.frowny.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.frowny.stages.0.stage", "Week 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.frowny.stages.0.symptoms.0", "Tender lower frenulum"),
              translateKey("piercingTimeline.frowny.stages.0.symptoms.1", "Visible when pulling lip down"),
              translateKey("piercingTimeline.frowny.stages.0.symptoms.2", "Slight discomfort")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.frowny.stages.0.care.0", "Alcohol-free mouthwash 2-3x daily"),
              translateKey("piercingTimeline.frowny.stages.0.care.1", "Check for tearing"),
              translateKey("piercingTimeline.frowny.stages.0.care.2", "Small circular barbell"),
              translateKey("piercingTimeline.frowny.stages.0.care.3", "May reject more than smiley")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.frowny.stages.1.stage", "Week 2-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.frowny.stages.1.symptoms.0", "Usually heals quickly"),
              translateKey("piercingTimeline.frowny.stages.1.symptoms.1", "Monitor for rejection")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.frowny.stages.1.care.0", "Continue mouthwash"),
              translateKey("piercingTimeline.frowny.stages.1.care.1", "Watch for gum/tooth damage"),
              translateKey("piercingTimeline.frowny.stages.1.care.2", "Higher rejection risk")
            ];
          }
        }
      ]
    },
    "tongue": {
      get name() { return translateKey("piercingTimeline.tongue.name", "Tongue (Center)"); },
      get category() { return translateKey("piercingTimeline.tongue.category", "Oral"); },
      get healing() { return translateKey("piercingTimeline.tongue.healing", "4-6 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.tongue.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.tongue.stages.0.stage", "Week 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.tongue.stages.0.symptoms.0", "Significant tongue swelling"),
              translateKey("piercingTimeline.tongue.stages.0.symptoms.1", "Speech difficulty"),
              translateKey("piercingTimeline.tongue.stages.0.symptoms.2", "Eating difficulty"),
              translateKey("piercingTimeline.tongue.stages.0.symptoms.3", "White tongue coating normal")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.tongue.stages.0.care.0", "Alcohol-free mouthwash after everything"),
              translateKey("piercingTimeline.tongue.stages.0.care.1", "Long barbell needed"),
              translateKey("piercingTimeline.tongue.stages.0.care.2", "Cold foods/drinks help"),
              translateKey("piercingTimeline.tongue.stages.0.care.3", "No oral contact"),
              translateKey("piercingTimeline.tongue.stages.0.care.4", "Ibuprofen for swelling")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.tongue.stages.1.stage", "Week 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.tongue.stages.1.symptoms.0", "Swelling decreases rapidly"),
              translateKey("piercingTimeline.tongue.stages.1.symptoms.1", "Speech returns to normal"),
              translateKey("piercingTimeline.tongue.stages.1.symptoms.2", "Eating easier")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.tongue.stages.1.care.0", "Continue mouthwash"),
              translateKey("piercingTimeline.tongue.stages.1.care.1", "MUST downsize at 2 weeks"),
              translateKey("piercingTimeline.tongue.stages.1.care.2", "Avoid playing with jewelry"),
              translateKey("piercingTimeline.tongue.stages.1.care.3", "Monitor tooth/gum damage")
            ];
          }
        }
      ]
    },
    "tongue_web": {
      get name() { return translateKey("piercingTimeline.tongue_web.name", "Tongue Web (Frenulum)"); },
      get category() { return translateKey("piercingTimeline.tongue_web.category", "Oral"); },
      get healing() { return translateKey("piercingTimeline.tongue_web.healing", "4-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.tongue_web.difficulty", "Easy to Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.tongue_web.stages.0.stage", "Week 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.tongue_web.stages.0.symptoms.0", "Tender under tongue"),
              translateKey("piercingTimeline.tongue_web.stages.0.symptoms.1", "Slight speech changes"),
              translateKey("piercingTimeline.tongue_web.stages.0.symptoms.2", "Minimal swelling")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.tongue_web.stages.0.care.0", "Alcohol-free mouthwash frequently"),
              translateKey("piercingTimeline.tongue_web.stages.0.care.1", "Small jewelry needed"),
              translateKey("piercingTimeline.tongue_web.stages.0.care.2", "Usually easy healing"),
              translateKey("piercingTimeline.tongue_web.stages.0.care.3", "Check for tearing")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.tongue_web.stages.1.stage", "Week 2-8: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.tongue_web.stages.1.symptoms.0", "Heals quickly usually"),
              translateKey("piercingTimeline.tongue_web.stages.1.symptoms.1", "No discomfort")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.tongue_web.stages.1.care.0", "Continue mouthwash"),
              translateKey("piercingTimeline.tongue_web.stages.1.care.1", "Higher rejection risk than tongue"),
              translateKey("piercingTimeline.tongue_web.stages.1.care.2", "Monitor for embedding")
            ];
          }
        }
      ]
    },
    "venom": {
      get name() { return translateKey("piercingTimeline.venom.name", "Venom (Double Tongue)"); },
      get category() { return translateKey("piercingTimeline.venom.category", "Oral"); },
      get healing() { return translateKey("piercingTimeline.venom.healing", "4-6 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.venom.difficulty", "Moderate to Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.venom.stages.0.stage", "Week 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.venom.stages.0.symptoms.0", "Very significant tongue swelling"),
              translateKey("piercingTimeline.venom.stages.0.symptoms.1", "More speech difficulty than single"),
              translateKey("piercingTimeline.venom.stages.0.symptoms.2", "Eating very difficult"),
              translateKey("piercingTimeline.venom.stages.0.symptoms.3", "Two barbells visible")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.venom.stages.0.care.0", "Mouthwash after everything"),
              translateKey("piercingTimeline.venom.stages.0.care.1", "Long barbells both sides"),
              translateKey("piercingTimeline.venom.stages.0.care.2", "Cold foods essential"),
              translateKey("piercingTimeline.venom.stages.0.care.3", "Ibuprofen"),
              translateKey("piercingTimeline.venom.stages.0.care.4", "May have more swelling than single tongue")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.venom.stages.1.stage", "Week 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.venom.stages.1.symptoms.0", "Both sides healing"),
              translateKey("piercingTimeline.venom.stages.1.symptoms.1", "Swelling decreases")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.venom.stages.1.care.0", "Continue mouthwash"),
              translateKey("piercingTimeline.venom.stages.1.care.1", "Downsize both at 2 weeks"),
              translateKey("piercingTimeline.venom.stages.1.care.2", "Monitor both for tooth damage"),
              translateKey("piercingTimeline.venom.stages.1.care.3", "More challenging than single tongue")
            ];
          }
        }
      ]
    },
    "uvula": {
      get name() { return translateKey("piercingTimeline.uvula.name", "Uvula"); },
      get category() { return translateKey("piercingTimeline.uvula.category", "Oral"); },
      get healing() { return translateKey("piercingTimeline.uvula.healing", "4-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.uvula.difficulty", "Very Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.uvula.stages.0.stage", "Week 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.uvula.stages.0.symptoms.0", "Significant swelling of uvula"),
              translateKey("piercingTimeline.uvula.stages.0.symptoms.1", "Gag reflex issues"),
              translateKey("piercingTimeline.uvula.stages.0.symptoms.2", "Difficulty swallowing"),
              translateKey("piercingTimeline.uvula.stages.0.symptoms.3", "Speech very affected")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.uvula.stages.0.care.0", "Mouthwash frequently"),
              translateKey("piercingTimeline.uvula.stages.0.care.1", "Very small jewelry"),
              translateKey("piercingTimeline.uvula.stages.0.care.2", "High rejection/migration risk"),
              translateKey("piercingTimeline.uvula.stages.0.care.3", "May need to retire early")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.uvula.stages.1.stage", "Week 2-8: Monitoring"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.uvula.stages.1.symptoms.0", "IF it doesn't reject, heals moderately"),
              translateKey("piercingTimeline.uvula.stages.1.symptoms.1", "Gag reflex usually adapts")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.uvula.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.uvula.stages.1.care.1", "Very rare piercing"),
              translateKey("piercingTimeline.uvula.stages.1.care.2", "Many people can't keep it"),
              translateKey("piercingTimeline.uvula.stages.1.care.3", "Professional only")
            ];
          }
        }
      ]
    },
    "navel": {
      get name() { return translateKey("piercingTimeline.navel.name", "Navel (Belly Button)"); },
      get category() { return translateKey("piercingTimeline.navel.category", "Body"); },
      get healing() { return translateKey("piercingTimeline.navel.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.navel.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.navel.healingDiscBenefits", "CRITICAL: Navel piercings are THE MOST notorious for irritation bumps and keloid formation. Healing discs are absolutely essential - they prevent metal contact with the skin during movement (sitting, bending) which is the primary cause of navel bumps. Many navel piercings fail without this protection."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.navel.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.navel.stages.0.symptoms.0", "Moderate redness"),
              translateKey("piercingTimeline.navel.stages.0.symptoms.1", "Crusties"),
              translateKey("piercingTimeline.navel.stages.0.symptoms.2", "Tender with movement")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.navel.stages.0.care.0", "Saline spray 2x daily"),
              translateKey("piercingTimeline.navel.stages.0.care.1", "Use healing discs on BOTH top and bottom balls immediately"),
              translateKey("piercingTimeline.navel.stages.0.care.2", "Loose clothing"),
              translateKey("piercingTimeline.navel.stages.0.care.3", "Discs prevent bump formation from waistband pressure"),
              translateKey("piercingTimeline.navel.stages.0.care.4", "Avoid core exercises"),
              translateKey("piercingTimeline.navel.stages.0.care.5", "Watch for migration")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.navel.stages.1.stage", "Month 3-6: Strengthening"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.navel.stages.1.symptoms.0", "Less tender"),
              translateKey("piercingTimeline.navel.stages.1.symptoms.1", "Looks better")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.navel.stages.1.care.0", "Continue saline daily"),
              translateKey("piercingTimeline.navel.stages.1.care.1", "Keep discs in place - bumps can develop even mid-healing"),
              translateKey("piercingTimeline.navel.stages.1.care.2", "Can resume exercise gradually"),
              translateKey("piercingTimeline.navel.stages.1.care.3", "Antimicrobial protection prevents sweat-related infections")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.navel.stages.2.stage", "Month 6-12: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.navel.stages.2.symptoms.0", "Looks healed externally")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.navel.stages.2.care.0", "Can change jewelry at 6+ months"),
              translateKey("piercingTimeline.navel.stages.2.care.1", "Continue using discs until 100% healed"),
              translateKey("piercingTimeline.navel.stages.2.care.2", "Monitor for rejection"),
              translateKey("piercingTimeline.navel.stages.2.care.3", "If keloid-prone, use discs long-term")
            ];
          }
        }
      ]
    },
    "nipple": {
      get name() { return translateKey("piercingTimeline.nipple.name", "Nipple"); },
      get category() { return translateKey("piercingTimeline.nipple.category", "Body"); },
      get healing() { return translateKey("piercingTimeline.nipple.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.nipple.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.nipple.healingDiscBenefits", "HIGHLY RECOMMENDED: Nipple piercings are prone to metal sensitivity reactions and irritation from clothing. Healing discs eliminate metal-to-skin contact (preventing nickel reactions) and cushion against bra/clothing friction. Essential for those with sensitive skin or metal allergies."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.nipple.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.nipple.stages.0.symptoms.0", "Significant swelling"),
              translateKey("piercingTimeline.nipple.stages.0.symptoms.1", "Very tender"),
              translateKey("piercingTimeline.nipple.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.nipple.stages.0.symptoms.3", "Sensitivity changes")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.nipple.stages.0.care.0", "Saline spray 2x daily"),
              translateKey("piercingTimeline.nipple.stages.0.care.1", "Use healing discs on both ends of barbell"),
              translateKey("piercingTimeline.nipple.stages.0.care.2", "Soft supportive bra"),
              translateKey("piercingTimeline.nipple.stages.0.care.3", "Discs prevent metal allergies and bra friction"),
              translateKey("piercingTimeline.nipple.stages.0.care.4", "NO oral contact for 6+ months"),
              translateKey("piercingTimeline.nipple.stages.0.care.5", "Avoid rough clothing")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.nipple.stages.1.stage", "Month 3-12: Long-term Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.nipple.stages.1.symptoms.0", "Gradual improvement"),
              translateKey("piercingTimeline.nipple.stages.1.symptoms.1", "Decreasing tenderness")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.nipple.stages.1.care.0", "Continue daily care"),
              translateKey("piercingTimeline.nipple.stages.1.care.1", "Healing discs especially important if any metal sensitivity"),
              translateKey("piercingTimeline.nipple.stages.1.care.2", "Downsize at 2-3 months"),
              translateKey("piercingTimeline.nipple.stages.1.care.3", "Be patient - takes long time"),
              translateKey("piercingTimeline.nipple.stages.1.care.4", "Antimicrobial protection prevents fabric bacteria transfer")
            ];
          }
        }
      ]
    },
    "surface": {
      get name() { return translateKey("piercingTimeline.surface.name", "Surface Piercing (Various Locations)"); },
      get category() { return translateKey("piercingTimeline.surface.category", "Surface"); },
      get healing() { return translateKey("piercingTimeline.surface.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.surface.difficulty", "Very Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.surface.healingDiscBenefits", "ABSOLUTELY CRITICAL: Surface piercings have the highest rejection rate of ALL piercings. Healing discs are your best chance at success - they minimize metal movement against shallow tissue and reduce the friction that causes rejection. Without discs, rejection rate is 70-90%. With discs, significantly improved success."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.surface.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.surface.stages.0.symptoms.0", "Moderate swelling"),
              translateKey("piercingTimeline.surface.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.surface.stages.0.symptoms.2", "Crusties both holes"),
              translateKey("piercingTimeline.surface.stages.0.symptoms.3", "High rejection risk")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.surface.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.surface.stages.0.care.1", "Surface bar only"),
              translateKey("piercingTimeline.surface.stages.0.care.2", "Use healing discs on BOTH ends immediately"),
              translateKey("piercingTimeline.surface.stages.0.care.3", "Discs reduce micro-movement that causes rejection"),
              translateKey("piercingTimeline.surface.stages.0.care.4", "Avoid all pressure/movement"),
              translateKey("piercingTimeline.surface.stages.0.care.5", "Watch for migration")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.surface.stages.1.stage", "Month 3-12: Monitoring Phase"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.surface.stages.1.symptoms.0", "May look healed but watch for rejection"),
              translateKey("piercingTimeline.surface.stages.1.symptoms.1", "Skin thinning is rejection sign")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.surface.stages.1.care.0", "Continue gentle care"),
              translateKey("piercingTimeline.surface.stages.1.care.1", "Keep healing discs - they improve long-term success"),
              translateKey("piercingTimeline.surface.stages.1.care.2", "Monitor closely"),
              translateKey("piercingTimeline.surface.stages.1.care.3", "Retire if rejecting"),
              translateKey("piercingTimeline.surface.stages.1.care.4", "Location affects success rate"),
              translateKey("piercingTimeline.surface.stages.1.care.5", "Antimicrobial protection prevents infection during vulnerable healing")
            ];
          }
        }
      ]
    },
    "dermal_anchor": {
      get name() { return translateKey("piercingTimeline.dermal_anchor.name", "Dermal Anchor/Microdermal"); },
      get category() { return translateKey("piercingTimeline.dermal_anchor.category", "Surface"); },
      get healing() { return translateKey("piercingTimeline.dermal_anchor.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.dermal_anchor.difficulty", "Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.dermal_anchor.healingDiscBenefits", "HIGHLY RECOMMENDED: Dermal anchors are prone to snagging and pressure that can cause rejection. Healing discs on the visible top create a cushion that prevents snags and reduces pressure on the anchor base, significantly improving retention."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.dermal_anchor.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.dermal_anchor.stages.0.symptoms.0", "Swelling around anchor"),
              translateKey("piercingTimeline.dermal_anchor.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.dermal_anchor.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.dermal_anchor.stages.0.symptoms.3", "Anchor visible")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.dermal_anchor.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.dermal_anchor.stages.0.care.1", "Use healing disc on the top to prevent snagging"),
              translateKey("piercingTimeline.dermal_anchor.stages.0.care.2", "No touching/playing with top"),
              translateKey("piercingTimeline.dermal_anchor.stages.0.care.3", "Avoid pressure"),
              translateKey("piercingTimeline.dermal_anchor.stages.0.care.4", "Watch for rejection")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.dermal_anchor.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.dermal_anchor.stages.1.symptoms.0", "Skin heals around anchor plate"),
              translateKey("piercingTimeline.dermal_anchor.stages.1.symptoms.1", "Looks flush with skin")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.dermal_anchor.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.dermal_anchor.stages.1.care.1", "Healing disc protects from clothing snags"),
              translateKey("piercingTimeline.dermal_anchor.stages.1.care.2", "Can change tops carefully"),
              translateKey("piercingTimeline.dermal_anchor.stages.1.care.3", "Monitor for rejection"),
              translateKey("piercingTimeline.dermal_anchor.stages.1.care.4", "May last years or reject"),
              translateKey("piercingTimeline.dermal_anchor.stages.1.care.5", "Antimicrobial protection prevents infection around anchor")
            ];
          }
        }
      ]
    },
    "nape": {
      get name() { return translateKey("piercingTimeline.nape.name", "Nape (Back of Neck)"); },
      get category() { return translateKey("piercingTimeline.nape.category", "Surface"); },
      get healing() { return translateKey("piercingTimeline.nape.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.nape.difficulty", "Very Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.nape.healingDiscBenefits", "CRITICAL: Nape piercings have extremely high rejection rates due to constant movement and collar friction. Healing discs are essential - they cushion against neck movement and prevent clothing irritation. Without them, almost certain to reject."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.nape.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.nape.stages.0.symptoms.0", "Swelling back of neck"),
              translateKey("piercingTimeline.nape.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.nape.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.nape.stages.0.symptoms.3", "Collars irritate it")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.nape.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.nape.stages.0.care.1", "Surface bar needed"),
              translateKey("piercingTimeline.nape.stages.0.care.2", "Use healing discs on both ends - non-negotiable"),
              translateKey("piercingTimeline.nape.stages.0.care.3", "Discs buffer neck movement and collar pressure"),
              translateKey("piercingTimeline.nape.stages.0.care.4", "No high collars"),
              translateKey("piercingTimeline.nape.stages.0.care.5", "Avoid sleeping on back"),
              translateKey("piercingTimeline.nape.stages.0.care.6", "Very high rejection risk")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.nape.stages.1.stage", "Month 3-12: Monitoring"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.nape.stages.1.symptoms.0", "Watch for migration"),
              translateKey("piercingTimeline.nape.stages.1.symptoms.1", "May reject")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.nape.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.nape.stages.1.care.1", "Keep healing discs to maximize retention chance"),
              translateKey("piercingTimeline.nape.stages.1.care.2", "Monitor skin thickness"),
              translateKey("piercingTimeline.nape.stages.1.care.3", "Many people retire this"),
              translateKey("piercingTimeline.nape.stages.1.care.4", "Hair can irritate")
            ];
          }
        }
      ]
    },
    "sternum": {
      get name() { return translateKey("piercingTimeline.sternum.name", "Sternum (Chest Surface)"); },
      get category() { return translateKey("piercingTimeline.sternum.category", "Surface"); },
      get healing() { return translateKey("piercingTimeline.sternum.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.sternum.difficulty", "Very Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.sternum.healingDiscBenefits", "CRITICAL: Sternum piercings face constant chest movement (breathing, posture changes). Healing discs minimize the bar movement that causes rejection and protect from bra/clothing pressure. Essential for any chance of success."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.sternum.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.sternum.stages.0.symptoms.0", "Swelling on chest"),
              translateKey("piercingTimeline.sternum.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.sternum.stages.0.symptoms.2", "Movement affects it"),
              translateKey("piercingTimeline.sternum.stages.0.symptoms.3", "Clothing irritates")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.sternum.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.sternum.stages.0.care.1", "Surface bar essential"),
              translateKey("piercingTimeline.sternum.stages.0.care.2", "Use healing discs on both ends immediately"),
              translateKey("piercingTimeline.sternum.stages.0.care.3", "Discs cushion against chest movement"),
              translateKey("piercingTimeline.sternum.stages.0.care.4", "Loose clothing"),
              translateKey("piercingTimeline.sternum.stages.0.care.5", "High rejection risk")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.sternum.stages.1.stage", "Month 3-12: Monitoring"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.sternum.stages.1.symptoms.0", "May look good or may reject")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.sternum.stages.1.care.0", "Continue care"),
              translateKey("piercingTimeline.sternum.stages.1.care.1", "Healing discs improve long-term success significantly"),
              translateKey("piercingTimeline.sternum.stages.1.care.2", "Watch for migration"),
              translateKey("piercingTimeline.sternum.stages.1.care.3", "Retire if skin thinning"),
              translateKey("piercingTimeline.sternum.stages.1.care.4", "Antimicrobial protection critical for chest area")
            ];
          }
        }
      ]
    },
    "madison": {
      get name() { return translateKey("piercingTimeline.madison.name", "Madison (Front Neck)"); },
      get category() { return translateKey("piercingTimeline.madison.category", "Surface"); },
      get healing() { return translateKey("piercingTimeline.madison.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.madison.difficulty", "Very Difficult"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.madison.healingDiscBenefits", "ABSOLUTELY CRITICAL: Madison piercings have one of the absolute highest rejection rates due to neck swallowing/talking movement. Healing discs are mandatory - they cushion constant throat movement. Even with discs, rejection is common, but without them, almost guaranteed to fail."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.madison.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.madison.stages.0.symptoms.0", "Swelling on front neck"),
              translateKey("piercingTimeline.madison.stages.0.symptoms.1", "Very tender"),
              translateKey("piercingTimeline.madison.stages.0.symptoms.2", "Crusties"),
              translateKey("piercingTimeline.madison.stages.0.symptoms.3", "Movement affects it")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.madison.stages.0.care.0", "Saline spray 2-3x daily"),
              translateKey("piercingTimeline.madison.stages.0.care.1", "Surface bar"),
              translateKey("piercingTimeline.madison.stages.0.care.2", "Use healing discs on both ends - absolute requirement"),
              translateKey("piercingTimeline.madison.stages.0.care.3", "Discs buffer swallowing and talking movement"),
              translateKey("piercingTimeline.madison.stages.0.care.4", "No high necks"),
              translateKey("piercingTimeline.madison.stages.0.care.5", "Very high rejection"),
              translateKey("piercingTimeline.madison.stages.0.care.6", "Not for everyone")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.madison.stages.1.stage", "Month 3-12: Monitoring"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.madison.stages.1.symptoms.0", "High rejection rate")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.madison.stages.1.care.0", "Monitor closely"),
              translateKey("piercingTimeline.madison.stages.1.care.1", "Keep healing discs for best chance"),
              translateKey("piercingTimeline.madison.stages.1.care.2", "Many reject this"),
              translateKey("piercingTimeline.madison.stages.1.care.3", "Retire if migrating"),
              translateKey("piercingTimeline.madison.stages.1.care.4", "Antimicrobial protection important for neck bacteria")
            ];
          }
        }
      ]
    },
    "prince_albert": {
      get name() { return translateKey("piercingTimeline.prince_albert.name", "Prince Albert (PA)"); },
      get category() { return translateKey("piercingTimeline.prince_albert.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.prince_albert.healing", "4-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.prince_albert.difficulty", "Moderate"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.prince_albert.healingDiscBenefits", "RECOMMENDED: Genital piercings benefit greatly from healing discs. They eliminate metal contact with sensitive genital tissue (important for those with metal sensitivities), cushion against underwear/movement friction, and provide critical antimicrobial protection in this bacteria-rich area. Increases comfort dramatically during healing."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.prince_albert.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.prince_albert.stages.0.symptoms.0", "Bleeding first few days normal"),
              translateKey("piercingTimeline.prince_albert.stages.0.symptoms.1", "Swelling"),
              translateKey("piercingTimeline.prince_albert.stages.0.symptoms.2", "Tender"),
              translateKey("piercingTimeline.prince_albert.stages.0.symptoms.3", "Urination may spray initially")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.prince_albert.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.prince_albert.stages.0.care.1", "Use healing discs to protect sensitive tissue from metal"),
              translateKey("piercingTimeline.prince_albert.stages.0.care.2", "Rinse after urination"),
              translateKey("piercingTimeline.prince_albert.stages.0.care.3", "Antimicrobial discs prevent bacterial infections from urine"),
              translateKey("piercingTimeline.prince_albert.stages.0.care.4", "No sexual contact 4-6 weeks minimum"),
              translateKey("piercingTimeline.prince_albert.stages.0.care.5", "Circular barbell or ring"),
              translateKey("piercingTimeline.prince_albert.stages.0.care.6", "Sea salt soaks")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.prince_albert.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.prince_albert.stages.1.symptoms.0", "Heals relatively quickly"),
              translateKey("piercingTimeline.prince_albert.stages.1.symptoms.1", "Urination normalizes"),
              translateKey("piercingTimeline.prince_albert.stages.1.symptoms.2", "Less tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.prince_albert.stages.1.care.0", "Continue soaks daily"),
              translateKey("piercingTimeline.prince_albert.stages.1.care.1", "Healing discs reduce friction from underwear/movement"),
              translateKey("piercingTimeline.prince_albert.stages.1.care.2", "Can have sexual contact after 6-8 weeks with care"),
              translateKey("piercingTimeline.prince_albert.stages.1.care.3", "Condoms recommended initially"),
              translateKey("piercingTimeline.prince_albert.stages.1.care.4", "Can stretch later if desired")
            ];
          }
        }
      ]
    },
    "reverse_pa": {
      get name() { return translateKey("piercingTimeline.reverse_pa.name", "Reverse Prince Albert"); },
      get category() { return translateKey("piercingTimeline.reverse_pa.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.reverse_pa.healing", "6-9 months"); },
      get difficulty() { return translateKey("piercingTimeline.reverse_pa.difficulty", "Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.reverse_pa.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.reverse_pa.stages.0.symptoms.0", "More painful than standard PA"),
              translateKey("piercingTimeline.reverse_pa.stages.0.symptoms.1", "Bleeding"),
              translateKey("piercingTimeline.reverse_pa.stages.0.symptoms.2", "Swelling"),
              translateKey("piercingTimeline.reverse_pa.stages.0.symptoms.3", "Tender")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.reverse_pa.stages.0.care.0", "Saline soaks 2-3x daily"),
              translateKey("piercingTimeline.reverse_pa.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.reverse_pa.stages.0.care.2", "No sexual contact 6-8 weeks"),
              translateKey("piercingTimeline.reverse_pa.stages.0.care.3", "Curved barbell needed"),
              translateKey("piercingTimeline.reverse_pa.stages.0.care.4", "More difficult healing than PA")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.reverse_pa.stages.1.stage", "Month 3-9: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.reverse_pa.stages.1.symptoms.0", "Slow healing"),
              translateKey("piercingTimeline.reverse_pa.stages.1.symptoms.1", "Takes longer than PA")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.reverse_pa.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.reverse_pa.stages.1.care.1", "Be patient"),
              translateKey("piercingTimeline.reverse_pa.stages.1.care.2", "Sexual contact only when fully healed")
            ];
          }
        }
      ]
    },
    "ampallang": {
      get name() { return translateKey("piercingTimeline.ampallang.name", "Ampallang (Horizontal Through Glans)"); },
      get category() { return translateKey("piercingTimeline.ampallang.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.ampallang.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.ampallang.difficulty", "Very Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.ampallang.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.ampallang.stages.0.symptoms.0", "Significant pain and swelling"),
              translateKey("piercingTimeline.ampallang.stages.0.symptoms.1", "Bleeding"),
              translateKey("piercingTimeline.ampallang.stages.0.symptoms.2", "Very tender"),
              translateKey("piercingTimeline.ampallang.stages.0.symptoms.3", "Urination affected")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.ampallang.stages.0.care.0", "Saline soaks 2-3x daily"),
              translateKey("piercingTimeline.ampallang.stages.0.care.1", "Rinse after urination always"),
              translateKey("piercingTimeline.ampallang.stages.0.care.2", "NO sexual contact minimum 3 months"),
              translateKey("piercingTimeline.ampallang.stages.0.care.3", "Straight barbell"),
              translateKey("piercingTimeline.ampallang.stages.0.care.4", "Pain management important")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.ampallang.stages.1.stage", "Month 3-12: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.ampallang.stages.1.symptoms.0", "Slow gradual improvement"),
              translateKey("piercingTimeline.ampallang.stages.1.symptoms.1", "Very long healing time")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.ampallang.stages.1.care.0", "Continue soaks daily"),
              translateKey("piercingTimeline.ampallang.stages.1.care.1", "Be very patient"),
              translateKey("piercingTimeline.ampallang.stages.1.care.2", "Full healing takes long time"),
              translateKey("piercingTimeline.ampallang.stages.1.care.3", "Worth the wait for many")
            ];
          }
        }
      ]
    },
    "apadravya": {
      get name() { return translateKey("piercingTimeline.apadravya.name", "Apadravya (Vertical Through Glans)"); },
      get category() { return translateKey("piercingTimeline.apadravya.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.apadravya.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.apadravya.difficulty", "Very Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.apadravya.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.apadravya.stages.0.symptoms.0", "Significant pain and swelling"),
              translateKey("piercingTimeline.apadravya.stages.0.symptoms.1", "Bleeding"),
              translateKey("piercingTimeline.apadravya.stages.0.symptoms.2", "Very tender"),
              translateKey("piercingTimeline.apadravya.stages.0.symptoms.3", "Urination through piercing")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.apadravya.stages.0.care.0", "Saline soaks 2-3x daily"),
              translateKey("piercingTimeline.apadravya.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.apadravya.stages.0.care.2", "NO sexual contact minimum 3 months"),
              translateKey("piercingTimeline.apadravya.stages.0.care.3", "Straight barbell through urethra"),
              translateKey("piercingTimeline.apadravya.stages.0.care.4", "Very challenging healing")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.apadravya.stages.1.stage", "Month 3-12: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.apadravya.stages.1.symptoms.0", "Slow healing"),
              translateKey("piercingTimeline.apadravya.stages.1.symptoms.1", "Both entry and exit points heal")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.apadravya.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.apadravya.stages.1.care.1", "Very long healing"),
              translateKey("piercingTimeline.apadravya.stages.1.care.2", "Sexual contact only when fully healed")
            ];
          }
        }
      ]
    },
    "frenum": {
      get name() { return translateKey("piercingTimeline.frenum.name", "Frenum"); },
      get category() { return translateKey("piercingTimeline.frenum.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.frenum.healing", "3-5 months"); },
      get difficulty() { return translateKey("piercingTimeline.frenum.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.frenum.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.frenum.stages.0.symptoms.0", "Moderate swelling"),
              translateKey("piercingTimeline.frenum.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.frenum.stages.0.symptoms.2", "Slight bleeding initially")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.frenum.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.frenum.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.frenum.stages.0.care.2", "No sexual contact 4-6 weeks"),
              translateKey("piercingTimeline.frenum.stages.0.care.3", "Curved barbell or ring")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.frenum.stages.1.stage", "Month 2-5: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.frenum.stages.1.symptoms.0", "Heals relatively well"),
              translateKey("piercingTimeline.frenum.stages.1.symptoms.1", "Can do multiple (frenum ladder)")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.frenum.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.frenum.stages.1.care.1", "Sexual contact after 6-8 weeks with care")
            ];
          }
        }
      ]
    },
    "lorum": {
      get name() { return translateKey("piercingTimeline.lorum.name", "Lorum (Scrotal)"); },
      get category() { return translateKey("piercingTimeline.lorum.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.lorum.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.lorum.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.lorum.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.lorum.stages.0.symptoms.0", "Swelling at base of scrotum"),
              translateKey("piercingTimeline.lorum.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.lorum.stages.0.symptoms.2", "Crusties")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.lorum.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.lorum.stages.0.care.1", "Wear supportive underwear"),
              translateKey("piercingTimeline.lorum.stages.0.care.2", "No sexual contact 4-6 weeks"),
              translateKey("piercingTimeline.lorum.stages.0.care.3", "Curved barbell")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.lorum.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.lorum.stages.1.symptoms.0", "Heals moderately well"),
              translateKey("piercingTimeline.lorum.stages.1.symptoms.1", "Can do multiple")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.lorum.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.lorum.stages.1.care.1", "Supportive underwear helpful")
            ];
          }
        }
      ]
    },
    "hafada": {
      get name() { return translateKey("piercingTimeline.hafada.name", "Hafada (Scrotal Surface)"); },
      get category() { return translateKey("piercingTimeline.hafada.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.hafada.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.hafada.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.hafada.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.hafada.stages.0.symptoms.0", "Swelling on scrotum"),
              translateKey("piercingTimeline.hafada.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.hafada.stages.0.symptoms.2", "Can do multiple")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.hafada.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.hafada.stages.0.care.1", "Supportive underwear"),
              translateKey("piercingTimeline.hafada.stages.0.care.2", "No sexual contact 4-6 weeks"),
              translateKey("piercingTimeline.hafada.stages.0.care.3", "Ring or curved barbell")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.hafada.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.hafada.stages.1.symptoms.0", "Heals well usually"),
              translateKey("piercingTimeline.hafada.stages.1.symptoms.1", "Popular for multiple piercings")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.hafada.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.hafada.stages.1.care.1", "Can have multiple in various positions")
            ];
          }
        }
      ]
    },
    "dydoe": {
      get name() { return translateKey("piercingTimeline.dydoe.name", "Dydoe (Coronal Rim)"); },
      get category() { return translateKey("piercingTimeline.dydoe.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.dydoe.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.dydoe.difficulty", "Moderate to Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.dydoe.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.dydoe.stages.0.symptoms.0", "Swelling on rim of glans"),
              translateKey("piercingTimeline.dydoe.stages.0.symptoms.1", "Quite painful"),
              translateKey("piercingTimeline.dydoe.stages.0.symptoms.2", "Tender"),
              translateKey("piercingTimeline.dydoe.stages.0.symptoms.3", "Usually done in pairs")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.dydoe.stages.0.care.0", "Saline soaks 2-3x daily"),
              translateKey("piercingTimeline.dydoe.stages.0.care.1", "No sexual contact 6-8 weeks"),
              translateKey("piercingTimeline.dydoe.stages.0.care.2", "Curved barbell"),
              translateKey("piercingTimeline.dydoe.stages.0.care.3", "Circumcised only usually")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.dydoe.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.dydoe.stages.1.symptoms.0", "Gradual healing"),
              translateKey("piercingTimeline.dydoe.stages.1.symptoms.1", "Can do multiple pairs")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.dydoe.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.dydoe.stages.1.care.1", "Be patient")
            ];
          }
        }
      ]
    },
    "guiche": {
      get name() { return translateKey("piercingTimeline.guiche.name", "Guiche (Perineum)"); },
      get category() { return translateKey("piercingTimeline.guiche.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.guiche.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.guiche.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.guiche.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.guiche.stages.0.symptoms.0", "Swelling in perineum"),
              translateKey("piercingTimeline.guiche.stages.0.symptoms.1", "Tender especially sitting"),
              translateKey("piercingTimeline.guiche.stages.0.symptoms.2", "Crusties")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.guiche.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.guiche.stages.0.care.1", "Careful sitting"),
              translateKey("piercingTimeline.guiche.stages.0.care.2", "No sexual contact 4-6 weeks"),
              translateKey("piercingTimeline.guiche.stages.0.care.3", "Curved barbell or ring")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.guiche.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.guiche.stages.1.symptoms.0", "Heals moderately well"),
              translateKey("piercingTimeline.guiche.stages.1.symptoms.1", "Sitting becomes comfortable")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.guiche.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.guiche.stages.1.care.1", "Can do multiple")
            ];
          }
        }
      ]
    },
    "foreskin": {
      get name() { return translateKey("piercingTimeline.foreskin.name", "Foreskin"); },
      get category() { return translateKey("piercingTimeline.foreskin.category", "Male Genital"); },
      get healing() { return translateKey("piercingTimeline.foreskin.healing", "2-4 months"); },
      get difficulty() { return translateKey("piercingTimeline.foreskin.difficulty", "Easy to Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.foreskin.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.foreskin.stages.0.symptoms.0", "Swelling of foreskin"),
              translateKey("piercingTimeline.foreskin.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.foreskin.stages.0.symptoms.2", "Usually heals quickly")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.foreskin.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.foreskin.stages.0.care.1", "Keep clean"),
              translateKey("piercingTimeline.foreskin.stages.0.care.2", "No sexual contact 4 weeks"),
              translateKey("piercingTimeline.foreskin.stages.0.care.3", "Ring jewelry"),
              translateKey("piercingTimeline.foreskin.stages.0.care.4", "Uncircumcised only")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.foreskin.stages.1.stage", "Month 2-4: Fully Healed"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.foreskin.stages.1.symptoms.0", "Heals quickly usually"),
              translateKey("piercingTimeline.foreskin.stages.1.symptoms.1", "Easy maintenance")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.foreskin.stages.1.care.0", "Continue hygiene"),
              translateKey("piercingTimeline.foreskin.stages.1.care.1", "One of easier genital piercings")
            ];
          }
        }
      ]
    },
    "vch": {
      get name() { return translateKey("piercingTimeline.vch.name", "Vertical Clitoral Hood (VCH)"); },
      get category() { return translateKey("piercingTimeline.vch.category", "Female Genital"); },
      get healing() { return translateKey("piercingTimeline.vch.healing", "4-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.vch.difficulty", "Easy to Moderate"); },
      healingDiscRecommended: true,
      get healingDiscBenefits() { return translateKey("piercingTimeline.vch.healingDiscBenefits", "HIGHLY RECOMMENDED: VCH piercings benefit immensely from healing discs. They prevent metal balls from irritating sensitive genital tissue, cushion against underwear/pad friction, eliminate metal sensitivity issues, and provide antimicrobial protection critical for the genital area. Dramatically increases comfort and prevents irritation."); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.vch.stages.0.stage", "Week 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.vch.stages.0.symptoms.0", "Moderate swelling"),
              translateKey("piercingTimeline.vch.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.vch.stages.0.symptoms.2", "Some bleeding initially"),
              translateKey("piercingTimeline.vch.stages.0.symptoms.3", "Sensation changes")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.vch.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.vch.stages.0.care.1", "Use healing discs on both balls for comfort and protection"),
              translateKey("piercingTimeline.vch.stages.0.care.2", "Rinse after urination"),
              translateKey("piercingTimeline.vch.stages.0.care.3", "Antimicrobial protection prevents bacterial infections"),
              translateKey("piercingTimeline.vch.stages.0.care.4", "No sexual contact 4-6 weeks"),
              translateKey("piercingTimeline.vch.stages.0.care.5", "Curved barbell"),
              translateKey("piercingTimeline.vch.stages.0.care.6", "Discs cushion against underwear/pad friction"),
              translateKey("piercingTimeline.vch.stages.0.care.7", "Cotton underwear")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.vch.stages.1.stage", "Week 4-8: Fully Healed"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.vch.stages.1.symptoms.0", "Heals relatively quickly"),
              translateKey("piercingTimeline.vch.stages.1.symptoms.1", "Most popular female genital piercing")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.vch.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.vch.stages.1.care.1", "Healing discs eliminate metal sensitivity concerns"),
              translateKey("piercingTimeline.vch.stages.1.care.2", "Can have sexual contact after 6 weeks"),
              translateKey("piercingTimeline.vch.stages.1.care.3", "Good hygiene important"),
              translateKey("piercingTimeline.vch.stages.1.care.4", "Discs provide ongoing comfort")
            ];
          }
        }
      ]
    },
    "hch": {
      get name() { return translateKey("piercingTimeline.hch.name", "Horizontal Clitoral Hood (HCH)"); },
      get category() { return translateKey("piercingTimeline.hch.category", "Female Genital"); },
      get healing() { return translateKey("piercingTimeline.hch.healing", "6-12 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.hch.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.hch.stages.0.stage", "Week 1-6: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.hch.stages.0.symptoms.0", "Swelling"),
              translateKey("piercingTimeline.hch.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.hch.stages.0.symptoms.2", "Slightly longer healing than VCH")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.hch.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.hch.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.hch.stages.0.care.2", "No sexual contact 6-8 weeks"),
              translateKey("piercingTimeline.hch.stages.0.care.3", "Circular barbell"),
              translateKey("piercingTimeline.hch.stages.0.care.4", "Anatomy dependent")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.hch.stages.1.stage", "Week 6-12: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.hch.stages.1.symptoms.0", "Heals moderately well"),
              translateKey("piercingTimeline.hch.stages.1.symptoms.1", "Not as common as VCH")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.hch.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.hch.stages.1.care.1", "Monitor for migration")
            ];
          }
        }
      ]
    },
    "inner_labia": {
      get name() { return translateKey("piercingTimeline.inner_labia.name", "Inner Labia"); },
      get category() { return translateKey("piercingTimeline.inner_labia.category", "Female Genital"); },
      get healing() { return translateKey("piercingTimeline.inner_labia.healing", "4-8 weeks"); },
      get difficulty() { return translateKey("piercingTimeline.inner_labia.difficulty", "Moderate"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.inner_labia.stages.0.stage", "Week 1-4: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.inner_labia.stages.0.symptoms.0", "Swelling of inner labia"),
              translateKey("piercingTimeline.inner_labia.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.inner_labia.stages.0.symptoms.2", "Can do multiple")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.inner_labia.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.inner_labia.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.inner_labia.stages.0.care.2", "No sexual contact 4-6 weeks"),
              translateKey("piercingTimeline.inner_labia.stages.0.care.3", "Ring or curved barbell"),
              translateKey("piercingTimeline.inner_labia.stages.0.care.4", "Cotton underwear")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.inner_labia.stages.1.stage", "Week 4-8: Fully Healed"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.inner_labia.stages.1.symptoms.0", "Heals relatively quickly"),
              translateKey("piercingTimeline.inner_labia.stages.1.symptoms.1", "Can do multiple piercings")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.inner_labia.stages.1.care.0", "Continue good hygiene"),
              translateKey("piercingTimeline.inner_labia.stages.1.care.1", "Popular for multiple piercings")
            ];
          }
        }
      ]
    },
    "outer_labia": {
      get name() { return translateKey("piercingTimeline.outer_labia.name", "Outer Labia"); },
      get category() { return translateKey("piercingTimeline.outer_labia.category", "Female Genital"); },
      get healing() { return translateKey("piercingTimeline.outer_labia.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.outer_labia.difficulty", "Moderate to Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.outer_labia.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.outer_labia.stages.0.symptoms.0", "Swelling of outer labia"),
              translateKey("piercingTimeline.outer_labia.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.outer_labia.stages.0.symptoms.2", "Longer healing than inner")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.outer_labia.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.outer_labia.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.outer_labia.stages.0.care.2", "No sexual contact 6-8 weeks"),
              translateKey("piercingTimeline.outer_labia.stages.0.care.3", "Ring jewelry"),
              translateKey("piercingTimeline.outer_labia.stages.0.care.4", "Cotton underwear")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.outer_labia.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.outer_labia.stages.1.symptoms.0", "Slow healing"),
              translateKey("piercingTimeline.outer_labia.stages.1.symptoms.1", "Can do multiple pairs")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.outer_labia.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.outer_labia.stages.1.care.1", "Be patient"),
              translateKey("piercingTimeline.outer_labia.stages.1.care.2", "Good hygiene essential")
            ];
          }
        }
      ]
    },
    "triangle": {
      get name() { return translateKey("piercingTimeline.triangle.name", "Triangle"); },
      get category() { return translateKey("piercingTimeline.triangle.category", "Female Genital"); },
      get healing() { return translateKey("piercingTimeline.triangle.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.triangle.difficulty", "Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.triangle.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.triangle.stages.0.symptoms.0", "Swelling"),
              translateKey("piercingTimeline.triangle.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.triangle.stages.0.symptoms.2", "Goes under clitoris"),
              translateKey("piercingTimeline.triangle.stages.0.symptoms.3", "Anatomy dependent - not everyone can get this")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.triangle.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.triangle.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.triangle.stages.0.care.2", "No sexual contact 6-8 weeks"),
              translateKey("piercingTimeline.triangle.stages.0.care.3", "Circular barbell"),
              translateKey("piercingTimeline.triangle.stages.0.care.4", "Experienced piercer only")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.triangle.stages.1.stage", "Month 2-6: Long Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.triangle.stages.1.symptoms.0", "Slow healing"),
              translateKey("piercingTimeline.triangle.stages.1.symptoms.1", "Worth the wait for many")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.triangle.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.triangle.stages.1.care.1", "Very patient approach"),
              translateKey("piercingTimeline.triangle.stages.1.care.2", "Unique piercing")
            ];
          }
        }
      ]
    },
    "christina": {
      get name() { return translateKey("piercingTimeline.christina.name", "Christina (Pubic Mound Surface)"); },
      get category() { return translateKey("piercingTimeline.christina.category", "Female Genital"); },
      get healing() { return translateKey("piercingTimeline.christina.healing", "6-12 months"); },
      get difficulty() { return translateKey("piercingTimeline.christina.difficulty", "Very Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.christina.stages.0.stage", "Month 1-3: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.christina.stages.0.symptoms.0", "Swelling on pubic mound"),
              translateKey("piercingTimeline.christina.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.christina.stages.0.symptoms.2", "Surface piercing"),
              translateKey("piercingTimeline.christina.stages.0.symptoms.3", "High rejection risk")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.christina.stages.0.care.0", "Saline soaks 2-3x daily"),
              translateKey("piercingTimeline.christina.stages.0.care.1", "Surface bar needed"),
              translateKey("piercingTimeline.christina.stages.0.care.2", "No sexual contact 8-12 weeks"),
              translateKey("piercingTimeline.christina.stages.0.care.3", "Watch for migration"),
              translateKey("piercingTimeline.christina.stages.0.care.4", "Anatomy dependent")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.christina.stages.1.stage", "Month 3-12: Monitoring"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.christina.stages.1.symptoms.0", "May heal or may reject"),
              translateKey("piercingTimeline.christina.stages.1.symptoms.1", "Beautiful if it heals")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.christina.stages.1.care.0", "Monitor for rejection"),
              translateKey("piercingTimeline.christina.stages.1.care.1", "Many people retire this"),
              translateKey("piercingTimeline.christina.stages.1.care.2", "Skin thinning = rejection")
            ];
          }
        }
      ]
    },
    "fourchette": {
      get name() { return translateKey("piercingTimeline.fourchette.name", "Fourchette (Posterior)"); },
      get category() { return translateKey("piercingTimeline.fourchette.category", "Female Genital"); },
      get healing() { return translateKey("piercingTimeline.fourchette.healing", "3-6 months"); },
      get difficulty() { return translateKey("piercingTimeline.fourchette.difficulty", "Moderate to Difficult"); },
      stages: [
        {
          get stage() { return translateKey("piercingTimeline.fourchette.stages.0.stage", "Month 1-2: Initial Healing"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.fourchette.stages.0.symptoms.0", "Swelling at bottom of vaginal opening"),
              translateKey("piercingTimeline.fourchette.stages.0.symptoms.1", "Tender"),
              translateKey("piercingTimeline.fourchette.stages.0.symptoms.2", "Affected by movement")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.fourchette.stages.0.care.0", "Saline soaks 2x daily"),
              translateKey("piercingTimeline.fourchette.stages.0.care.1", "Rinse after urination"),
              translateKey("piercingTimeline.fourchette.stages.0.care.2", "No sexual contact 8 weeks"),
              translateKey("piercingTimeline.fourchette.stages.0.care.3", "Curved barbell"),
              translateKey("piercingTimeline.fourchette.stages.0.care.4", "Anatomy dependent")
            ];
          }
        },
        {
          get stage() { return translateKey("piercingTimeline.fourchette.stages.1.stage", "Month 2-6: Maturation"); },
          get symptoms() {
            return [
              translateKey("piercingTimeline.fourchette.stages.1.symptoms.0", "Slow healing"),
              translateKey("piercingTimeline.fourchette.stages.1.symptoms.1", "Not for everyone anatomically")
            ];
          },
          get care() {
            return [
              translateKey("piercingTimeline.fourchette.stages.1.care.0", "Continue soaks"),
              translateKey("piercingTimeline.fourchette.stages.1.care.1", "Be patient"),
              translateKey("piercingTimeline.fourchette.stages.1.care.2", "May migrate if anatomy not suitable")
            ];
          }
        }
      ]
    }
  };

  if (typeof window !== "undefined") {
    window.piercingTimelines = piercingTimelines;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = piercingTimelines;
  }
})();
if (typeof piercingTimelines === "undefined" && typeof window !== "undefined") {
  var piercingTimelines = window.piercingTimelines;
}
