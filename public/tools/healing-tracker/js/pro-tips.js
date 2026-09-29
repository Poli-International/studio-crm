// =====================================================
// STUDIO PRO-TIPS MODULE & PROFESSIONAL ADVICE DATABASE
// Dynamically tailored by procedure type and current healing stage
// =====================================================

(function() {
  // Professional Studio Advice Database
  // Compliant with ASTM F-136, ISO 10993, and BioFlex(R) PP-R material standards.
  const STUDIO_PRO_TIPS_DATABASE = {
    piercing: {
      acute: [
        {
          tag: 'IRRIGATION',
          title: '0.9% Sterile Saline Flush Only',
          advice: 'Irrigate both entry and exit points twice daily with sterile isotonic 0.9% sodium chloride saline spray. Avoid cotton swabs or Q-tips that can leave micro-fibers snagged around the jewelry post.',
          insight: 'Established studio practice: Harsh antiseptics (rubbing alcohol, hydrogen peroxide, tea tree oil) destroy fragile new granulating cells and stall healing.'
        },
        {
          tag: 'PRESSURE_RELIEF',
          title: 'Protect from Sleep Pressure',
          advice: 'If healing an ear cartilage or facial piercing, sleep with a travel/donut pillow so your ear rests in the opening. Never sleep directly on an unhealed piercing.',
          insight: 'Prolonged compression against pillows cuts off localized micro-circulation and shifts the angle of the fistular channel permanently.'
        },
        {
          tag: 'NO_ROTATION',
          title: 'Never Twist or Rotate Jewelry',
          advice: 'Leave jewelry completely stationary. The fistular channel regenerates outward from the edges like delicate cellular scaffolding; twisting tears this healing tissue.',
          insight: 'Rotating jewelry was abandoned in modern piercing decades ago: it introduces crust and bacteria directly into the open wound.'
        },
        {
          tag: 'CLEAN_TOUCH',
          title: 'Zero Unwashed Contact',
          advice: 'Never touch your piercing, jewelry, or surrounding skin without first washing your hands with liquid soap and warm water for at least 20 seconds.',
          insight: 'Staphylococcus and environmental bacteria are almost always transferred to fresh piercings via subconscious fingertip contact.'
        }
      ],
      proliferative: [
        {
          tag: 'DOWNSIZING',
          title: 'Schedule Post Downsizing',
          advice: 'Initial posts are intentionally longer to accommodate inflammatory swelling. Once swelling subsides (typically weeks 2–6 depending on placement), visit your piercer to downsize to a snugger post.',
          insight: 'Leaving an oversized initial post in place leads to snagging, perpetual friction bumps, and migration caused by torque.'
        },
        {
          tag: 'SUBMERSION',
          title: 'Strictly No Water Submersion',
          advice: 'Showers are completely safe, but strictly avoid submerging the piercing in swimming pools, hot tubs, baths, rivers, or oceans.',
          insight: 'Standing bodies of water harbor Pseudomonas and chemical irritants that easily colonize non-epithelialized puncture wounds.'
        },
        {
          tag: 'CRUST_HYGIENE',
          title: 'Soften Lymphatic Fluid in the Shower',
          advice: 'Pale yellowish crusting is dried blood plasma (lymph) and part of healthy tissue repair. Soften it under warm running shower water, then gently rinse. Never pick at dry crusts.',
          insight: 'Prying dry crust away pulls off the delicate new layer of basal cells adhering to the jewelry surface.'
        }
      ],
      maturation: [
        {
          tag: 'MATERIAL_SAFETY',
          title: 'Implant-Grade Materials Only',
          advice: 'For long-term wear or style changes, select certified ASTM F-136 implant-grade titanium or BioFlex® PP-R random copolymer. Avoid mystery alloy base metals and nickel-rich costume jewelry.',
          insight: 'Certified materials ensure biocompatibility tested under ISO 10993 standards and prevent localized contact dermatitis.'
        },
        {
          tag: 'FISTULA_STABILITY',
          title: 'Keep Jewelry Installed',
          advice: 'Even after surface tenderness disappears, the internal collagen canal continues to mature for up to a full year. Do not leave the channel empty for extended periods.',
          insight: 'Unseasoned fistulas can contract or close within hours if jewelry is removed prematurely.'
        },
        {
          tag: 'ROUTINE_HYGIENE',
          title: 'Regular Maintenance Rinses',
          advice: 'During normal bathing, allow warm water to flush through the piercing area to wash away trapped sebum and skin shed.',
          insight: 'Clean, buildup-free jewelry surfaces promote permanent channel stability and eliminate common odor.'
        }
      ]
    },
    tattoo: {
      acute: [
        {
          tag: 'HYGIENE',
          title: 'Lukewarm Cleansing & Disposable Drying',
          advice: 'Wash 2 to 3 times daily using clean fingertips, lukewarm water, and mild fragrance-free liquid soap. Pat dry using fresh, single-use paper towels. Never use a reusable bath towel.',
          insight: 'Reusable fabric towels harbor mold spores, household bacteria, and abrasive lint that easily infect freshly abraded epidermis.'
        },
        {
          tag: 'MOISTURIZING',
          title: 'Whisper-Thin Ointment Layer',
          advice: 'Apply only a microscopic sheer layer of fragrance-free tattoo balm or ointment. Your skin requires oxygen to regenerate; thick greasy layers suffocate the pore structure.',
          insight: 'Over-moisturizing causes pimples, delayed barrier restoration, and ink bubbling. If the skin looks glossy 10 minutes after application, dab off the excess.'
        },
        {
          tag: 'NO_SOAKING',
          title: 'Quick Showers, Zero Baths',
          advice: 'Keep showers under 10 minutes and avoid blasting high-pressure hot water directly onto the tattooed skin. Never soak in tubs, pools, or saunas.',
          insight: 'Excess moisture softens the dermis and leaches trapped ink droplets before macrophage cells have encapsulated the pigment.'
        }
      ],
      proliferative: [
        {
          tag: 'ZERO_PICKING',
          title: 'Let Peeling Flakes Fall Naturally',
          advice: 'As peeling begins, resist any urge to pick, peel, or scratch. Peeling flakes must shed entirely on their own during showers or gentle moisturizing.',
          insight: 'Pulling a flake forcibly extracts the underlying pigment from the upper dermis, creating permanent light patches and holidays in the linework.'
        },
        {
          tag: 'ITCH_RELIEF',
          title: 'Relieve Itching Without Nails',
          advice: 'When intense healing itch occurs, gently slap or tap the area with clean flat fingers, or apply a dab of fragrance-free water-based lotion.',
          insight: 'Scratching with fingernails creates micro-lacerations that slice right through fresh ink deposits and risk bacterial transfer.'
        },
        {
          tag: 'CLOTHING',
          title: 'Loose 100% Breathable Cotton',
          advice: 'Wear soft, loose-fitting cotton clothing over the healing piece. Avoid synthetics, activewear compression gear, or rough denim that rubs the surface.',
          insight: 'Abrasive friction against peeling skin strips epidermal layers prematurely and traps sweat against the wound.'
        }
      ],
      maturation: [
        {
          tag: 'SUN_DEFENSE',
          title: 'Daily Broad-Spectrum SPF 30+',
          advice: 'Once the epidermis is fully closed and non-shiny, apply broad-spectrum SPF 30+ sunscreen whenever the tattoo is exposed to daylight.',
          insight: 'Ultraviolet photons fracture pigment particles into smaller compounds that the lymphatic system clears away, leading to rapid fading and blur.'
        },
        {
          tag: 'DEEP_HYDRATION',
          title: 'Daily Moisture for Optical Clarity',
          advice: 'Regular daily moisturization keeps the stratum corneum supple and optically translucent, allowing the brilliance and deep contrast of the pigment below to shine.',
          insight: 'Dry, ashy surface skin scatters light, making dark blacks and saturated colors look muted and chalky.'
        }
      ]
    }
  };

  let currentStageKey = 'acute';
  let currentProcedureType = 'piercing';

  function determineStage(procedureType, dayOffset) {
    const days = Math.max(0, parseInt(dayOffset, 10) || 0);
    if (procedureType === 'tattoo') {
      if (days <= 4) return 'acute';
      if (days <= 14) return 'proliferative';
      return 'maturation';
    } else {
      // Piercing healing stages
      if (days <= 7) return 'acute';
      if (days <= 60) return 'proliferative';
      return 'maturation';
    }
  }

  function getStageDisplayTitle(stageKey) {
    if (stageKey === 'acute') {
      return (window.t && window.t('healing.proTips.acuteStage')) || 'Acute / Initial Stage';
    } else if (stageKey === 'proliferative') {
      return (window.t && window.t('healing.proTips.proliferativeStage')) || 'Proliferative / Healing Stage';
    } else {
      return (window.t && window.t('healing.proTips.maturationStage')) || 'Maturation / Final Stage';
    }
  }

  function updateProTips(procedureType, dayOrStage) {
    const container = document.getElementById('proTipsContainer');
    const list = document.getElementById('proTipsList');
    const badge = document.getElementById('proTipsStageBadge');

    if (!container || !list) return;

    currentProcedureType = procedureType || 'piercing';
    let stageKey = 'acute';

    if (typeof dayOrStage === 'string' && (dayOrStage === 'acute' || dayOrStage === 'proliferative' || dayOrStage === 'maturation')) {
      stageKey = dayOrStage;
    } else {
      stageKey = determineStage(currentProcedureType, dayOrStage);
    }
    currentStageKey = stageKey;

    const procAdvice = STUDIO_PRO_TIPS_DATABASE[currentProcedureType] || STUDIO_PRO_TIPS_DATABASE.piercing;
    const tips = procAdvice[stageKey] || procAdvice.acute || [];

    if (badge) {
      const typeLabel = currentProcedureType.toUpperCase();
      const stageLabel = getStageDisplayTitle(stageKey).toUpperCase();
      badge.textContent = `[ ${typeLabel} // ${stageLabel} ]`;
    }

    list.innerHTML = tips.map((tip, idx) => `
      <div class="pro-tip-item" data-tip-index="${idx}">
        <div class="pro-tip-item__header">
          <span class="pro-tip-tag">${tip.tag}</span>
          <h4 class="pro-tip-title">${tip.title}</h4>
        </div>
        <p class="pro-tip-advice">${tip.advice}</p>
        <div class="pro-tip-insight">
          <span class="pro-tip-insight__label">Studio Insight:</span> ${tip.insight}
        </div>
      </div>
    `).join('');
  }

  function initProTips() {
    // Listen for language changes to refresh headers/badges
    window.addEventListener('languageChanged', function() {
      updateProTips(currentProcedureType, currentStageKey);
    });
  }

  window.ProTips = {
    init: initProTips,
    update: updateProTips,
    determineStage: determineStage,
    getAdvice: function(procedureType, stageKey) {
      const db = STUDIO_PRO_TIPS_DATABASE[procedureType] || STUDIO_PRO_TIPS_DATABASE.piercing;
      return db[stageKey] || [];
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProTips);
  } else {
    initProTips();
  }
})();
