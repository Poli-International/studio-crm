/* =====================================================
   TATTOO CALCULATORS
   Mathematical models and calculations for touch-up timeline
   ===================================================== */

const TattooCalculators = {
  /**
   * Calculate touch-up timeline and longevity
   */
  calculateTouchUpTimeline(data) {
    const styleData = TattooLongevityData.styles[data.style];
    if (!styleData) return null;

    const baseLongevity = styleData.baseLongevity;
    const styleModifier = styleData.modifier;
    const locationModifier = TattooLongevityData.locations[data.bodyLocation]?.longevityModifier || 1.0;
    const sunModifier = TattooLongevityData.sunExposure[data.sunExposure]?.longevityModifier || 1.0;
    const careModifier = TattooLongevityData.careLevel[data.careLevel]?.longevityModifier || 1.0;

    // Calculate color modifier (average of selected colors)
    let colorModifier = 1.0;
    if (data.colors && data.colors.length > 0) {
      const colorModifiers = data.colors.map(c => TattooLongevityData.colors[c]?.longevityModifier || 1.0);
      colorModifier = colorModifiers.reduce((a, b) => a + b, 0) / colorModifiers.length;
    }

    // Total modifier
    const totalModifier = styleModifier * locationModifier * sunModifier * careModifier * colorModifier;

    // Total expected longevity before touch-up needed (years)
    const totalLongevity = Math.round(baseLongevity * totalModifier * 10) / 10;

    // Current age of tattoo (years)
    const currentAge = parseFloat(data.tattooAge) || 0;

    // Last recorded touch-up date logic
    let yearsSinceLastTouchUp = null;
    let lastTouchUpDateFormatted = null;
    const isNeverTouchedUp = data.neverTouchedUp || !data.lastTouchUpDate;

    if (!isNeverTouchedUp && data.lastTouchUpDate) {
      const touchUpTime = new Date(data.lastTouchUpDate).getTime();
      if (!isNaN(touchUpTime)) {
        const diffMs = Date.now() - touchUpTime;
        yearsSinceLastTouchUp = Math.max(0, Math.round((diffMs / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10);
        lastTouchUpDateFormatted = data.lastTouchUpDate;
      }
    }

    // Effective pigment age: if a touch-up was performed, elapsed wear is measured from that session
    const effectivePigmentAge = (yearsSinceLastTouchUp !== null) ? yearsSinceLastTouchUp : currentAge;

    // Years remaining until touch-up recommended based on effective pigment age
    const rawYearsRemaining = Math.round((totalLongevity - effectivePigmentAge) * 10) / 10;
    const yearsRemaining = Math.max(0, rawYearsRemaining);

    // Fading progress percentage
    const fadingProgress = Math.min(100, Math.round((effectivePigmentAge / totalLongevity) * 100));

    // Reminder alert status based on tattoo age & last touch-up date
    let reminderStatus = 'on_track';
    if (effectivePigmentAge >= totalLongevity || rawYearsRemaining <= 0) {
      reminderStatus = 'overdue';
    } else if (yearsRemaining <= 1.0) {
      reminderStatus = 'due_soon';
    } else {
      reminderStatus = 'on_track';
    }

    // Determine urgency level
    let urgency = TattooLongevityData.urgencyLevels.no_rush;
    if (yearsRemaining === 0) {
      urgency = TattooLongevityData.urgencyLevels.overdue;
    } else if (yearsRemaining <= 1) {
      urgency = TattooLongevityData.urgencyLevels.schedule_soon;
    } else if (yearsRemaining <= 3) {
      urgency = TattooLongevityData.urgencyLevels.plan_ahead;
    }

    // Calculate fading order for colors
    const fadingOrder = this.calculateFadingOrder(data.colors, totalLongevity);

    // Generate recommendations
    const recommendations = this.generateRecommendations(data, yearsRemaining, urgency);

    return {
      totalLongevity,
      currentAge,
      lastTouchUpDate: lastTouchUpDateFormatted,
      yearsSinceLastTouchUp,
      effectivePigmentAge,
      reminderStatus,
      rawYearsRemaining,
      yearsRemaining,
      fadingProgress,
      urgency,
      fadingOrder,
      recommendations,
      modifiers: {
        style: styleModifier,
        location: locationModifier,
        sun: sunModifier,
        care: careModifier,
        color: colorModifier,
        total: totalModifier
      }
    };
  },

  /**
   * Calculate which colors will fade first and when
   */
  calculateFadingOrder(colors, totalLongevity) {
    if (!colors || colors.length === 0) return [];

    const fadingList = colors.map(c => {
      const colorData = TattooLongevityData.colors[c];
      if (!colorData) return null;

      // Adjust fading time based on total longevity
      const fadingTime = colorData.fadingYears * (totalLongevity / 8); // Normalize
      return {
        colorKey: c,
        color: colorData.name,
        years: Math.round(fadingTime * 10) / 10,
        order: colorData.fadingOrder
      };
    }).filter(Boolean);

    // Sort by fading order (fastest first)
    fadingList.sort((a, b) => a.order - b.order);

    return fadingList;
  },

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(data, yearsRemaining, urgency) {
    const recommendations = [];

    // Care level recommendations
    if (data.careLevel === 'poor' || data.careLevel === 'fair') {
      recommendations.push({
        type: 'care',
        priority: 'high',
        text: 'Improve your care routine! Daily moisturizing and SPF 50+ can extend your tattoo life by 30-50%.'
      });
    }

    // Sun exposure recommendations
    if (data.sunExposure === 'high') {
      recommendations.push({
        type: 'sun',
        priority: 'high',
        text: 'High sun exposure accelerates fading. Apply SPF 50+ sunscreen every 2 hours when directly exposed.'
      });
    }

    // Location-specific advice
    if (data.bodyLocation === 'high_friction' || data.bodyLocation === 'frequently_exposed') {
      recommendations.push({
        type: 'location',
        priority: 'medium',
        text: 'Your tattoo location experiences frequent friction or exposure. Consider protective clothing and regular moisturizing.'
      });
    }

    // Color-specific advice
    const hasLightColors = data.colors && data.colors.some(c =>
      ['yellow', 'pink_light_colors', 'white', 'orange'].includes(c)
    );
    if (hasLightColors) {
      recommendations.push({
        type: 'color',
        priority: 'medium',
        text: 'Light pigment tones (yellows, whites, pinks) fade earliest. These will benefit from targeted touch-ups before darker lines.'
      });
    }

    // Special Pigments (UV-reactive, older organic inks) consultation recommendation
    const hasSpecialPigments = data.colors && data.colors.some(c =>
      ['uv_reactive', 'organic_inks'].includes(c)
    );
    if (hasSpecialPigments) {
      const advisoryText = (typeof window !== 'undefined' && window.t)
        ? window.t('touchup.warnings.specialPigmentsText')
        : 'Special pigment alert: UV-reactive pigments and older organic inks experience unique photolysis and cellular dispersion. Consult your professional tattoo artist about potential fading behavior and specialized touch-up protocols for these materials.';
      recommendations.push({
        type: 'special_pigment',
        priority: 'high',
        text: advisoryText
      });
    }

    // Urgency-based recommendations
    if (urgency.level === 'Overdue' || urgency.level === 'Schedule Soon') {
      recommendations.push({
        type: 'urgent',
        priority: 'high',
        text: 'Contact your original artist or a reputable studio for a touch-up consultation. Bring reference photos from when it was fresh.'
      });
    }

    return recommendations;
  },

  /**
   * Calculate sun damage impact
   */
  calculateSunDamage(sunHoursPerWeek, spfUsage) {
    let fadingAcceleration = 0;
    let yearsLost = 0;

    // Base calculation
    if (spfUsage === 'never') {
      fadingAcceleration = sunHoursPerWeek * 8; // 8% per hour per week
      yearsLost = (sunHoursPerWeek * 52 * 0.01); // Estimate
    } else if (spfUsage === 'sometimes') {
      fadingAcceleration = sunHoursPerWeek * 4;
      yearsLost = (sunHoursPerWeek * 52 * 0.005);
    } else {
      fadingAcceleration = sunHoursPerWeek * 1;
      yearsLost = (sunHoursPerWeek * 52 * 0.001);
    }

    fadingAcceleration = Math.min(100, Math.round(fadingAcceleration));
    yearsLost = Math.round(yearsLost * 10) / 10;

    let recommendation = '';
    if (fadingAcceleration > 50) {
      recommendation = '🚨 Critical: Your tattoo is fading significantly faster than normal. SPF 50+ daily protection is strongly recommended!';
    } else if (fadingAcceleration > 30) {
      recommendation = '⚠️ Warning: Noticeable fading acceleration detected. Start using broad-spectrum SPF 50+ regularly.';
    } else if (fadingAcceleration > 15) {
      recommendation = '📊 Moderate: Some fading acceleration. Consider applying SPF more consistently when exposed.';
    } else {
      recommendation = '✅ Good: Your sun protection routine is actively preserving your tattoo pigments!';
    }

    return {
      fadingAcceleration,
      yearsLost,
      recommendation
    };
  },

  /**
   * Calculate lifetime cost of tattoo maintenance
   */
  calculateLifetimeCost(initialCost, touchUpFrequency) {
    const yearsToProject = 30;
    const numberOfTouchUps = Math.floor(yearsToProject / touchUpFrequency);

    // Touch-ups typically cost 40-60% of original
    const touchUpCost = Math.round(initialCost * 0.5);
    const totalTouchUpCost = numberOfTouchUps * touchUpCost;
    const lifetimeCost = initialCost + totalTouchUpCost;
    const annualCost = Math.round((lifetimeCost / yearsToProject) * 100) / 100;

    // Calculate with good care vs poor care
    const goodCareFrequency = touchUpFrequency * 1.5; // Touch up less often
    const goodCareTouchUps = Math.floor(yearsToProject / goodCareFrequency);
    const goodCareCost = initialCost + (goodCareTouchUps * touchUpCost);

    const poorCareFrequency = touchUpFrequency * 0.6; // Touch up more often
    const poorCareTouchUps = Math.floor(yearsToProject / poorCareFrequency);
    const poorCareCost = initialCost + (poorCareTouchUps * touchUpCost);

    const savings = poorCareCost - goodCareCost;

    return {
      lifetimeCost,
      annualCost,
      numberOfTouchUps,
      touchUpCost,
      goodCareCost,
      goodCareTouchUps,
      poorCareCost,
      poorCareTouchUps,
      savings
    };
  },

  /**
   * Assess readiness for touch-up
   */
  assessTouchUpReadiness(readinessData) {
    let score = 0;
    const issues = [];

    // Fading level assessment
    if (readinessData.fadingLevel === 'significant') {
      score += 40;
      issues.push('Significant overall pigment fading detected');
    } else if (readinessData.fadingLevel === 'moderate') {
      score += 25;
      issues.push('Moderate fading present across key sections');
    } else {
      score += 10;
    }

    // Color loss assessment
    const fadedColors = readinessData.fadedColors || [];
    if (fadedColors.length > 0) {
      score += fadedColors.length * 8;
      issues.push(`${fadedColors.length} color tone(s) showing significant fading`);
    }

    // Line blurring
    if (readinessData.lineBlurring === 'significant') {
      score += 30;
      issues.push('Lines are softening and spreading significantly');
    } else if (readinessData.lineBlurring === 'slight') {
      score += 15;
      issues.push('Some line softening detected');
    }

    // Detail loss
    if (readinessData.detailLoss === 'major') {
      score += 30;
      issues.push('Fine details and micro-elements are losing definition');
    } else if (readinessData.detailLoss === 'some') {
      score += 15;
      issues.push('Minor detail degradation present');
    }

    // Determine readiness status
    let status = {};
    if (score >= 70) {
      status = {
        level: 'Needs Touch-Up Now',
        statusClass: 'status-overdue',
        icon: '🚨',
        message: 'Your tattoo is showing significant pigment and detail wear. A touch-up is recommended to restore saturation and line definition.',
        action: 'Schedule a consultation with your tattoo artist in the coming weeks.'
      };
    } else if (score >= 45) {
      status = {
        level: 'Touch-Up Recommended',
        statusClass: 'status-soon',
        icon: '⏰',
        message: 'Your tattoo is showing moderate wear. A touch-up in the next 3–6 months will refresh its vibrancy.',
        action: 'Start planning your touch-up session with your artist.'
      };
    } else if (score >= 25) {
      status = {
        level: 'Monitor Closely',
        statusClass: 'status-plan',
        icon: '👀',
        message: 'Your tattoo is starting to show early subtle wear. Keep up your hydration and SPF routine.',
        action: 'Take comparison photos in consistent lighting and reassess in 6 months.'
      };
    } else {
      status = {
        level: 'Still Looking Great!',
        statusClass: 'status-great',
        icon: '✅',
        message: 'Your tattoo is in strong condition with solid contrast. No touch-up needed at this time.',
        action: 'Maintain your current daily moisturizing and SPF 50+ care routine!'
      };
    }

    return {
      score,
      status,
      issues
    };
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  /**
   * Format years for display
   */
  formatYears(years) {
    // window.t returns the key when a key is missing; fall back to English then.
    const tr = (k, fb, p) => { const s = typeof window !== 'undefined' && window.t ? window.t(k, p) : k; return s && s !== k ? s : fb; };
    if (years === 0) return tr('touchup.now', 'Now');
    if (years < 1) { const m = Math.round(years * 12); return tr('touchup.monthsCount', `${m} months`, { count: m }); }
    if (years === 1) return tr('touchup.oneYear', '1 year');
    const y = Math.round(years * 10) / 10;
    return tr('touchup.yearsCount', `${y} years`, { count: y });
  }
};

if (typeof window !== 'undefined') {
  window.TattooCalculators = TattooCalculators;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TattooCalculators;
}
