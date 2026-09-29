/**
 * Piercing Angle & Depth Guide - Storage Manager Module
 * Standards: ASTM F-136, ASTM F-138, ASTM F-67, BioFlex® body jewelry.
 * Provides resilient, offline-first client storage management across localStorage and sessionStorage.
 */

(function (window) {
  'use strict';

  var StorageManager = {};

  var KEYS = {
    STUDIO_PREFS: 'poli_piercing_studio_prefs',
    ACTIVE_KEY: 'poli_piercing_active_key',
    UNIT: 'poli_piercing_unit',
    COMPARE_MODE: 'poli_piercing_compare_mode',
    COMPARE_A: 'poli_piercing_compare_a',
    COMPARE_B: 'poli_piercing_compare_b',
    RECENTS: 'poli_piercing_recents',
    SYM_TAB: 'poli_piercing_sym_tab',
    SYM_PAIR: 'poli_piercing_sym_pair',
    LANGUAGE: 'poli_tools_language',
    NOTES_PREFIX: 'poli_piercing_notes_',
    SENSITIVITY_MODE: 'poli_piercing_sensitivity_mode',
    STRESS_MAP: 'poli_piercing_stress_map'
  };

  StorageManager.KEYS = KEYS;

  // -------------------------------------------------------------
  // Studio Custom Baseline Preferences
  // -------------------------------------------------------------
  StorageManager.getStudioPreferences = function () {
    try {
      var stored = localStorage.getItem(KEYS.STUDIO_PREFS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  StorageManager.saveStudioPreference = function (piercingKey, prefData) {
    try {
      var prefs = StorageManager.getStudioPreferences();
      prefs[piercingKey] = prefData;
      localStorage.setItem(KEYS.STUDIO_PREFS, JSON.stringify(prefs));
      return true;
    } catch (e) {
      return false;
    }
  };

  StorageManager.resetStudioPreference = function (piercingKey) {
    try {
      var prefs = StorageManager.getStudioPreferences();
      delete prefs[piercingKey];
      localStorage.setItem(KEYS.STUDIO_PREFS, JSON.stringify(prefs));
      return true;
    } catch (e) {
      return false;
    }
  };

  // -------------------------------------------------------------
  // Anatomical Sensitivity Mode & Dynamic Stress Map
  // -------------------------------------------------------------
  StorageManager.getAnatomicalSensitivityMode = function () {
    try {
      return localStorage.getItem(KEYS.SENSITIVITY_MODE) === 'true';
    } catch (e) {
      return false;
    }
  };

  StorageManager.setAnatomicalSensitivityMode = function (enabled) {
    try {
      localStorage.setItem(KEYS.SENSITIVITY_MODE, enabled ? 'true' : 'false');
      return true;
    } catch (e) {
      return false;
    }
  };

  StorageManager.getStressMapMode = function () {
    try {
      var val = localStorage.getItem(KEYS.STRESS_MAP);
      return val === null ? true : (val === 'true'); // Defaults to active
    } catch (e) {
      return true;
    }
  };

  StorageManager.setStressMapMode = function (enabled) {
    try {
      localStorage.setItem(KEYS.STRESS_MAP, enabled ? 'true' : 'false');
      return true;
    } catch (e) {
      return false;
    }
  };

  // -------------------------------------------------------------
  // Workspace State
  // -------------------------------------------------------------
  StorageManager.saveWorkspaceState = function (state) {
    if (!state || typeof state !== 'object') return;
    try {
      if (state.activeKey !== undefined) {
        localStorage.setItem(KEYS.ACTIVE_KEY, state.activeKey);
      }
      if (state.unit !== undefined) {
        localStorage.setItem(KEYS.UNIT, state.unit);
      }
      if (state.compareMode !== undefined) {
        localStorage.setItem(KEYS.COMPARE_MODE, state.compareMode ? 'true' : 'false');
      }
      if (state.compareA !== undefined) {
        localStorage.setItem(KEYS.COMPARE_A, state.compareA);
      }
      if (state.compareB !== undefined) {
        localStorage.setItem(KEYS.COMPARE_B, state.compareB);
      }
      if (state.recents !== undefined) {
        localStorage.setItem(KEYS.RECENTS, JSON.stringify(state.recents));
      }
      if (state.symTab !== undefined) {
        localStorage.setItem(KEYS.SYM_TAB, state.symTab);
      }
      if (state.symPair !== undefined) {
        localStorage.setItem(KEYS.SYM_PAIR, state.symPair);
      }
    } catch (e) {
      // Storage access guarded
    }
  };

  StorageManager.loadWorkspaceState = function (validKeys) {
    var state = {
      activeKey: 'earlobe',
      unit: 'metric',
      compareMode: false,
      compareA: 'earlobe',
      compareB: 'helix',
      recents: [],
      symTab: 'simulator',
      symPair: ''
    };

    try {
      var savedKey = localStorage.getItem(KEYS.ACTIVE_KEY);
      if (savedKey && (!validKeys || validKeys[savedKey])) {
        state.activeKey = savedKey;
      }
      var savedUnit = localStorage.getItem(KEYS.UNIT);
      if (savedUnit === 'imperial' || savedUnit === 'metric') {
        state.unit = savedUnit;
      }
      var savedCompare = localStorage.getItem(KEYS.COMPARE_MODE);
      if (savedCompare === 'true') {
        state.compareMode = true;
      }
      var savedCompA = localStorage.getItem(KEYS.COMPARE_A);
      if (savedCompA && (!validKeys || validKeys[savedCompA])) {
        state.compareA = savedCompA;
      }
      var savedCompB = localStorage.getItem(KEYS.COMPARE_B);
      if (savedCompB && (!validKeys || validKeys[savedCompB])) {
        state.compareB = savedCompB;
      }
      var savedRecents = localStorage.getItem(KEYS.RECENTS);
      if (savedRecents) {
        try {
          var parsed = JSON.parse(savedRecents);
          if (Array.isArray(parsed)) {
            state.recents = validKeys ? parsed.filter(function (k) { return validKeys[k]; }) : parsed;
          }
        } catch (err) {}
      }
      var savedSymTab = localStorage.getItem(KEYS.SYM_TAB);
      if (savedSymTab) {
        state.symTab = savedSymTab;
      }
      var savedSymPair = localStorage.getItem(KEYS.SYM_PAIR);
      if (savedSymPair) {
        state.symPair = savedSymPair;
      }
    } catch (e) {
      // Fallback
    }

    return state;
  };

  // -------------------------------------------------------------
  // Recent Piercings Tracking
  // -------------------------------------------------------------
  StorageManager.updateRecentPiercings = function (recentsList, currentKey, validKeys, maxItems) {
    var list = Array.isArray(recentsList) ? recentsList.slice() : [];
    if (!currentKey || (validKeys && !validKeys[currentKey])) return list;
    var limit = typeof maxItems === 'number' ? maxItems : 5;

    list = list.filter(function (k) {
      return k !== currentKey && (!validKeys || validKeys[k]);
    });
    list.unshift(currentKey);
    if (list.length > limit) {
      list = list.slice(0, limit);
    }
    try {
      localStorage.setItem(KEYS.RECENTS, JSON.stringify(list));
    } catch (e) {}
    return list;
  };

  // -------------------------------------------------------------
  // Session Notes
  // -------------------------------------------------------------
  StorageManager.getNotesSessionKey = function (key) {
    return KEYS.NOTES_PREFIX + key;
  };

  StorageManager.loadProfessionalNotes = function (key) {
    if (!key) return '';
    try {
      return sessionStorage.getItem(StorageManager.getNotesSessionKey(key)) || '';
    } catch (e) {
      return '';
    }
  };

  StorageManager.saveProfessionalNotes = function (key, text) {
    if (!key) return false;
    try {
      if (text && text.trim().length > 0) {
        sessionStorage.setItem(StorageManager.getNotesSessionKey(key), text);
      } else {
        sessionStorage.removeItem(StorageManager.getNotesSessionKey(key));
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  // -------------------------------------------------------------
  // Language Persistence
  // -------------------------------------------------------------
  StorageManager.getSavedLanguage = function () {
    try {
      return localStorage.getItem(KEYS.LANGUAGE) || 'en';
    } catch (e) {
      return 'en';
    }
  };

  StorageManager.saveLanguage = function (lang) {
    try {
      localStorage.setItem(KEYS.LANGUAGE, lang);
      return true;
    } catch (e) {
      return false;
    }
  };

  // -------------------------------------------------------------
  // Reset All Workspace Defaults
  // -------------------------------------------------------------
  StorageManager.resetAllWorkspaceDefaults = function () {
    try {
      var keysToRemove = [
        KEYS.ACTIVE_KEY,
        KEYS.UNIT,
        KEYS.COMPARE_MODE,
        KEYS.COMPARE_A,
        KEYS.COMPARE_B,
        KEYS.RECENTS,
        KEYS.STUDIO_PREFS,
        KEYS.SYM_TAB,
        KEYS.SYM_PAIR,
        KEYS.SENSITIVITY_MODE,
        KEYS.STRESS_MAP
      ];
      for (var i = 0; i < keysToRemove.length; i++) {
        localStorage.removeItem(keysToRemove[i]);
      }
      // Also clear session notes
      try {
        var sessionKeys = [];
        for (var s = 0; s < sessionStorage.length; s++) {
          var sk = sessionStorage.key(s);
          if (sk && sk.indexOf(KEYS.NOTES_PREFIX) === 0) {
            sessionKeys.push(sk);
          }
        }
        for (var j = 0; j < sessionKeys.length; j++) {
          sessionStorage.removeItem(sessionKeys[j]);
        }
      } catch (err) {}
      return true;
    } catch (e) {
      return false;
    }
  };

  window.PiercingStorageManager = StorageManager;
  window.StorageManager = StorageManager;
})(typeof window !== 'undefined' ? window : this);
