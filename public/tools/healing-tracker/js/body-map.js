/**
 * Visual Placement Picker for Body Piercings & Tattoos
 * Synchronizes single inline SVG body map with selection dropdowns.
 */
'use strict';

(function () {
  const PIERCING_ZONES = {
    ear: {
      nameKey: 'healing.piercingGroups.ear',
      fallback: 'Ear Piercings',
      locations: ['earlobe', 'helix', 'industrial', 'daith', 'rook', 'tragus', 'anti_tragus', 'conch', 'snug', 'forward_helix', 'orbital']
    },
    facial: {
      nameKey: 'healing.piercingGroups.facial',
      fallback: 'Facial Piercings',
      locations: ['nostril', 'septum', 'bridge', 'high_nostril', 'eyebrow', 'anti_eyebrow', 'cheek', 'medusa', 'monroe', 'labret', 'vertical_labret', 'snake_bites', 'angel_bites', 'smiley', 'frowny']
    },
    oral: {
      nameKey: 'healing.piercingGroups.oral',
      fallback: 'Oral Piercings',
      locations: ['tongue', 'tongue_web', 'venom', 'uvula']
    },
    body: {
      nameKey: 'healing.piercingGroups.body',
      fallback: 'Body Piercings',
      locations: ['navel', 'nipple']
    },
    surface: {
      nameKey: 'healing.piercingGroups.surface',
      fallback: 'Surface & Dermal Piercings',
      locations: ['surface', 'dermal_anchor', 'nape', 'sternum', 'madison']
    }
  };

  const GENITAL_KEYS = [
    'prince_albert', 'reverse_pa', 'ampallang', 'apadravya', 'frenum', 'lorum', 'hafada', 'dydoe', 'guiche', 'foreskin',
    'vch', 'hch', 'inner_labia', 'outer_labia', 'triangle', 'christina', 'fourchette'
  ];

  const BACK_VIEW_PIERCINGS = ['nape'];
  const BACK_VIEW_TATTOOS = ['neck_nape', 'upper_back', 'lower_back', 'tricep', 'calf'];

  const SUN_RISK_REGIONS = {
    face: {
      key: 'face',
      titleKey: 'healing.map.sunRiskFaceTitle',
      fallbackTitle: 'Face & Facial Features',
      tipKey: 'healing.map.sunRiskFaceTip',
      fallbackTip: 'Facial dermis is thin and receives continuous direct and reflected UV. Wear a wide-brim hat outdoors. Rinse sweat away gently with sterile 0.9% saline.',
      piercingZones: ['facial'],
      piercingLocations: ['nostril', 'septum', 'bridge', 'high_nostril', 'eyebrow', 'anti_eyebrow', 'cheek', 'medusa', 'monroe', 'labret', 'vertical_labret', 'snake_bites', 'angel_bites', 'smiley', 'frowny'],
      tattooRegions: ['head_face']
    },
    ears: {
      key: 'ears',
      titleKey: 'healing.map.sunRiskEarsTitle',
      fallbackTitle: 'Ear Cartilage & Lobes',
      tipKey: 'healing.map.sunRiskEarsTip',
      fallbackTip: 'Ears lack subcutaneous cushioning; direct sunlight heats metal jewelry and dries lymph crusts. Shield ears with hats and avoid prolonged sun exposure.',
      piercingZones: ['ear'],
      piercingLocations: ['earlobe', 'helix', 'industrial', 'daith', 'rook', 'tragus', 'anti_tragus', 'conch', 'snug', 'forward_helix', 'orbital'],
      tattooRegions: ['ear']
    },
    neck: {
      key: 'neck',
      titleKey: 'healing.map.sunRiskNeckTitle',
      fallbackTitle: 'Neck & Nape',
      tipKey: 'healing.map.sunRiskNeckTip',
      fallbackTip: 'Neck experiences multi-angle UV exposure and collar friction. Keep shirts loose and soft; never apply sunscreen onto healing puncture wounds.',
      piercingZones: ['surface'],
      piercingLocations: ['nape'],
      tattooRegions: ['neck', 'neck_nape']
    },
    hands: {
      key: 'hands',
      titleKey: 'healing.map.sunRiskHandsTitle',
      fallbackTitle: 'Hands & Wrists',
      tipKey: 'healing.map.sunRiskHandsTip',
      fallbackTip: 'Hands sustain the highest daily UV dose and constant wash friction. Keep in shade or use clean UV-protective gloves during outdoor tasks.',
      piercingZones: [],
      piercingLocations: ['wrist', 'hand'],
      tattooRegions: ['hand_wrist']
    }
  };

  let currentMode = 'piercing'; // 'piercing' | 'tattoo'
  let currentView = 'front'; // 'front' | 'back'
  let activeZone = null;
  let isSunRiskLayerActive = true;

  function t(key, fallback) {
    if (typeof window.t === 'function') {
      const res = window.t(key);
      if (res && res !== key) return res;
    }
    return fallback || key;
  }

  function getLocName(locKey) {
    const opt = document.querySelector('#piercingLocation option[value="' + locKey + '"]');
    if (opt && opt.textContent) return opt.textContent.trim();
    return t('healing.piercingLocations.' + locKey, locKey);
  }

  function getTattooLocName(locKey) {
    const opt = document.querySelector('#tattooPlacement option[value="' + locKey + '"], #tattooLocation option[value="' + locKey + '"]');
    if (opt && opt.textContent) return opt.textContent.trim();
    return t('healing.map.tattooLocations.' + locKey, locKey);
  }

  function findZoneForLocation(locKey) {
    for (const zoneKey of Object.keys(PIERCING_ZONES)) {
      if (PIERCING_ZONES[zoneKey].locations.includes(locKey)) {
        return zoneKey;
      }
    }
    return null;
  }

  function setView(view) {
    currentView = view;
    const frontView = document.getElementById('bodyMapFrontView');
    const backView = document.getElementById('bodyMapBackView');
    const toggleBtn = document.getElementById('bodyMapToggleBtn');
    const toggleText = document.getElementById('bodyMapToggleText');

    if (!frontView || !backView) return;

    if (view === 'back') {
      frontView.style.display = 'none';
      backView.style.display = 'block';
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-pressed', 'true');
      }
      if (toggleText) {
        toggleText.textContent = t('healing.map.switchToFront', 'Switch to Front View');
      }
    } else {
      frontView.style.display = 'block';
      backView.style.display = 'none';
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-pressed', 'false');
      }
      if (toggleText) {
        toggleText.textContent = t('healing.map.switchToBack', 'Switch to Back View');
      }
    }

    refreshMapHighlight();
  }

  function getSunRiskRegionForLocation(locVal, mode) {
    if (!locVal) return null;
    for (const regKey of Object.keys(SUN_RISK_REGIONS)) {
      const reg = SUN_RISK_REGIONS[regKey];
      if (mode === 'piercing') {
        if (reg.piercingLocations.includes(locVal)) return reg;
        const zone = findZoneForLocation(locVal);
        if (zone && reg.piercingZones.includes(zone)) return reg;
      } else if (mode === 'tattoo') {
        if (reg.tattooRegions.includes(locVal)) return reg;
      }
    }
    return null;
  }

  function updateSunRiskAdvisory(sunRegion) {
    const card = document.getElementById('sunExposureRiskCard');
    const titleEl = document.getElementById('sunExposureRiskRegionTitle');
    const tipEl = document.getElementById('sunExposureRiskRegionTip');

    if (!card) return;

    if (!isSunRiskLayerActive || !sunRegion) {
      card.style.display = 'none';
      return;
    }

    card.style.display = 'block';
    if (titleEl) {
      titleEl.textContent = t(sunRegion.titleKey, sunRegion.fallbackTitle);
    }
    if (tipEl) {
      tipEl.textContent = t(sunRegion.tipKey, sunRegion.fallbackTip);
    }
  }

  function refreshMapHighlight() {
    // Clear selected and sun risk classes from all body parts
    document.querySelectorAll('.body-part').forEach(function (el) {
      el.classList.remove('body-part--selected', 'sun-risk-amber', 'sun-risk-zone');
      el.setAttribute('aria-selected', 'false');
    });

    let selectedElements = [];
    let sunRiskRegion = null;

    if (currentMode === 'piercing') {
      const select = document.getElementById('piercingLocation');
      const locVal = select ? select.value : '';

      if (locVal && !GENITAL_KEYS.includes(locVal)) {
        const zone = activeZone || findZoneForLocation(locVal);
        if (zone) {
          const selector = '.body-part[data-piercing-zone="' + zone + '"]';
          selectedElements = Array.from(document.querySelectorAll(selector));
        }
        sunRiskRegion = getSunRiskRegionForLocation(locVal, 'piercing');
      }
    } else if (currentMode === 'tattoo') {
      const select = document.getElementById('tattooPlacement') || document.getElementById('tattooLocation');
      const locVal = select ? select.value : '';
      if (locVal) {
        const selector = '.body-part[data-tattoo-region="' + locVal + '"]';
        selectedElements = Array.from(document.querySelectorAll(selector));
        sunRiskRegion = getSunRiskRegionForLocation(locVal, 'tattoo');
      }
    }

    // Apply base sun risk zone styling to all high-UV areas if layer active
    if (isSunRiskLayerActive) {
      document.querySelectorAll('.body-part').forEach(function (el) {
        const pZone = el.getAttribute('data-piercing-zone');
        const tRegion = el.getAttribute('data-tattoo-region');
        const isHighUV = ['facial', 'ear'].includes(pZone) || 
                         ['head_face', 'neck', 'neck_nape', 'hand_wrist'].includes(tRegion) ||
                         (el.id && (el.id.includes('head') || el.id.includes('face') || el.id.includes('neck') || el.id.includes('hand') || el.id.includes('ear') || el.id.includes('nape')));
        if (isHighUV) {
          el.classList.add('sun-risk-zone');
        }
      });
    }

    // Highlight selected elements: if sun risk layer is active AND region is high UV -> amber!
    if (selectedElements.length > 0) {
      selectedElements.forEach(function (el) {
        el.classList.add('body-part--selected');
        el.setAttribute('aria-selected', 'true');
        if (isSunRiskLayerActive && sunRiskRegion) {
          el.classList.add('sun-risk-amber');
        }
      });
    }

    updateSunRiskAdvisory(sunRiskRegion);
  }

  function updateSelectedTag(text, isDropdownOnly) {
    const textEl = document.getElementById('placementSelectedText');
    if (!textEl) return;

    if (!text) {
      textEl.textContent = t('healing.map.noneSelected', 'None');
      return;
    }

    if (isDropdownOnly) {
      textEl.textContent = text + ' (' + t('healing.map.dropdownOnlyNotice', 'Dropdown only') + ')';
    } else {
      textEl.textContent = text;
    }
  }

  function renderZoneLocations(zoneKey) {
    const panel = document.getElementById('zoneLocationsPanel');
    const titleEl = document.getElementById('zoneLocationsTitle');
    const listEl = document.getElementById('zoneLocationsList');
    if (!panel || !titleEl || !listEl) return;

    activeZone = zoneKey;
    const zoneData = PIERCING_ZONES[zoneKey];
    if (!zoneData) {
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'block';
    titleEl.textContent = t(zoneData.nameKey, zoneData.fallback);
    listEl.innerHTML = '';

    const currentLoc = document.getElementById('piercingLocation')?.value || '';

    zoneData.locations.forEach(function (locKey) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'zone-location-btn';
      btn.setAttribute('role', 'option');
      btn.setAttribute('data-location', locKey);
      btn.textContent = getLocName(locKey);

      if (locKey === currentLoc) {
        btn.classList.add('zone-location-btn--selected');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.setAttribute('aria-selected', 'false');
      }

      btn.addEventListener('click', function () {
        selectPiercingLocation(locKey);
      });

      listEl.appendChild(btn);
    });
  }

  function selectPiercingLocation(locKey) {
    const select = document.getElementById('piercingLocation');
    if (select) {
      select.value = locKey;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function handlePiercingDropdownChange() {
    const select = document.getElementById('piercingLocation');
    const val = select ? select.value : '';

    if (!val) {
      activeZone = null;
      updateSelectedTag('');
      const panel = document.getElementById('zoneLocationsPanel');
      if (panel) panel.style.display = 'none';
      refreshMapHighlight();
      return;
    }

    const locName = getLocName(val);

    if (GENITAL_KEYS.includes(val)) {
      activeZone = null;
      const panel = document.getElementById('zoneLocationsPanel');
      if (panel) panel.style.display = 'none';
      updateSelectedTag(locName, true);
      refreshMapHighlight();
      return;
    }

    const zone = findZoneForLocation(val);
    if (zone) {
      activeZone = zone;

      // Auto-switch view if required
      if (BACK_VIEW_PIERCINGS.includes(val)) {
        if (currentView !== 'back') setView('back');
      } else if (['facial', 'oral'].includes(zone)) {
        if (currentView !== 'front') setView('front');
      }

      updateSelectedTag(locName, false);
      renderZoneLocations(zone);
      refreshMapHighlight();
    } else {
      updateSelectedTag(locName, false);
      refreshMapHighlight();
    }
  }

  function handleTattooDropdownChange() {
    const select = document.getElementById('tattooPlacement') || document.getElementById('tattooLocation');
    const val = select ? select.value : '';

    if (!val) {
      updateSelectedTag('');
      refreshMapHighlight();
      return;
    }

    const locName = getTattooLocName(val);

    if (BACK_VIEW_TATTOOS.includes(val)) {
      if (currentView !== 'back') setView('back');
    } else {
      if (currentView !== 'front') setView('front');
    }

    updateSelectedTag(locName, false);
    refreshMapHighlight();

    // Map to longevity calculator bodyLocation if present
    const bodyLocationSelect = document.getElementById('bodyLocation');
    if (bodyLocationSelect) {
      if (['hand_wrist', 'foot_ankle'].includes(val)) {
        bodyLocationSelect.value = 'high_friction';
      } else if (['head_face', 'neck'].includes(val)) {
        bodyLocationSelect.value = 'frequently_exposed';
      } else if (['chest', 'ribs_stomach', 'upper_back', 'lower_back', 'thigh'].includes(val)) {
        bodyLocationSelect.value = 'covered_areas';
      } else {
        bodyLocationSelect.value = 'occasionally_exposed';
      }
      bodyLocationSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function handleRegionClick(el) {
    if (currentMode === 'piercing') {
      const zone = el.getAttribute('data-piercing-zone');
      if (zone && PIERCING_ZONES[zone]) {
        activeZone = zone;
        renderZoneLocations(zone);
        refreshMapHighlight();

        // If no location selected in this zone yet, pick the first one
        const currentLoc = document.getElementById('piercingLocation')?.value;
        if (!currentLoc || !PIERCING_ZONES[zone].locations.includes(currentLoc)) {
          selectPiercingLocation(PIERCING_ZONES[zone].locations[0]);
        }
      }
    } else if (currentMode === 'tattoo') {
      const tattooRegion = el.getAttribute('data-tattoo-region');
      if (tattooRegion) {
        const tattooSelect = document.getElementById('tattooPlacement') || document.getElementById('tattooLocation');
        if (tattooSelect) {
          tattooSelect.value = tattooRegion;
          tattooSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  }

  function setupBodyMap() {
    const mapEl = document.getElementById('bodyPlacementMap');
    if (!mapEl) return;

    // Region click and keydown handlers
    const regions = mapEl.querySelectorAll('.body-part');
    regions.forEach(function (el) {
      el.addEventListener('click', function () {
        handleRegionClick(el);
      });

      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRegionClick(el);
        }
      });
    });

    // Sun risk toggle button
    const sunRiskBtn = document.getElementById('sunRiskToggleBtn');
    if (sunRiskBtn) {
      sunRiskBtn.addEventListener('click', toggleSunRiskLayer);
    }

    // View toggle button
    const toggleBtn = document.getElementById('bodyMapToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        setView(currentView === 'front' ? 'back' : 'front');
      });
    }

    // Dropdown change listeners
    const piercingSelect = document.getElementById('piercingLocation');
    if (piercingSelect) {
      piercingSelect.addEventListener('change', handlePiercingDropdownChange);
    }

    const tattooSelect = document.getElementById('tattooPlacement') || document.getElementById('tattooLocation');
    if (tattooSelect) {
      tattooSelect.addEventListener('change', handleTattooDropdownChange);
    }

    // Procedure type integration
    const procedureType = document.getElementById('procedureType');
    if (procedureType) {
      procedureType.addEventListener('change', function () {
        const type = this.value;
        const pickerSection = document.getElementById('placementPickerSection');
        const piercingGroup = document.getElementById('piercingLocationGroup');
        const tattooSizeGroup = document.getElementById('tattooSizeGroup');
        const tattooLocationGroup = document.getElementById('tattooLocationGroup');
        const panel = document.getElementById('zoneLocationsPanel');

        if (type === 'piercing') {
          currentMode = 'piercing';
          if (pickerSection) pickerSection.style.display = 'block';
          if (piercingGroup) piercingGroup.style.display = 'block';
          if (tattooSizeGroup) tattooSizeGroup.style.display = 'none';
          if (tattooLocationGroup) tattooLocationGroup.style.display = 'none';
          handlePiercingDropdownChange();
        } else if (type === 'tattoo') {
          currentMode = 'tattoo';
          if (pickerSection) pickerSection.style.display = 'block';
          if (piercingGroup) piercingGroup.style.display = 'none';
          if (tattooSizeGroup) tattooSizeGroup.style.display = 'block';
          if (tattooLocationGroup) tattooLocationGroup.style.display = 'block';
          if (panel) panel.style.display = 'none';
          handleTattooDropdownChange();
        } else {
          if (pickerSection) pickerSection.style.display = 'none';
          if (piercingGroup) piercingGroup.style.display = 'none';
          if (tattooSizeGroup) tattooSizeGroup.style.display = 'none';
          if (tattooLocationGroup) tattooLocationGroup.style.display = 'none';
          if (panel) panel.style.display = 'none';
        }
      });
    }
  }

  function toggleSunRiskLayer() {
    isSunRiskLayerActive = !isSunRiskLayerActive;
    const btn = document.getElementById('sunRiskToggleBtn');
    if (btn) {
      btn.setAttribute('aria-pressed', isSunRiskLayerActive ? 'true' : 'false');
      if (isSunRiskLayerActive) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
    refreshMapHighlight();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBodyMap);
  } else {
    setupBodyMap();
  }

  window.BodyPlacementMap = {
    SUN_RISK_REGIONS: SUN_RISK_REGIONS,
    setView: setView,
    refreshMapHighlight: refreshMapHighlight,
    toggleSunRiskLayer: toggleSunRiskLayer,
    isSunRiskActive: function () { return isSunRiskLayerActive; },
    getSunRiskRegionForLocation: getSunRiskRegionForLocation,
    handlePiercingDropdownChange: handlePiercingDropdownChange,
    handleTattooDropdownChange: handleTattooDropdownChange
  };
  window.BodyMap = window.BodyPlacementMap;
})();
