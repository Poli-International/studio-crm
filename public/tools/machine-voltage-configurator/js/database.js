/**
 * Poli International - Machine Voltage Configurator
 * Database & Engineering Rulesets (V2)
 * 
 * Rules:
 * - Starting ranges, NOT "optimal" single numbers.
 * - Relative speed and relative force, NO invented hertz values.
 * - Real mechanical relationships and manufacturer-safe boundaries.
 */

(function(window) {
    'use strict';

    // Baseline starting voltage ranges: { min, max, speedRel, forceRel }
    const STARTING_RANGES = {
        rotary: {
            "2.5": {
                lining:    { min: 5.7, max: 7.8, speed: 'result.speed.medium', force: 'result.punch.soft' },
                shading:   { min: 4.5, max: 6.5, speed: 'result.speed.slow',   force: 'result.punch.soft' },
                packing:   { min: 6.0, max: 8.2, speed: 'result.speed.medium', force: 'result.punch.medium' },
                stippling: { min: 4.8, max: 6.8, speed: 'result.speed.slow',   force: 'result.punch.soft' }
            },
            "3.0": {
                lining:    { min: 6.2, max: 8.3, speed: 'result.speed.medium', force: 'result.punch.medium' },
                shading:   { min: 5.0, max: 7.0, speed: 'result.speed.slow',   force: 'result.punch.soft' },
                packing:   { min: 6.5, max: 8.7, speed: 'result.speed.medium', force: 'result.punch.medium' },
                stippling: { min: 5.2, max: 7.2, speed: 'result.speed.slow',   force: 'result.punch.soft' }
            },
            "3.5": {
                lining:    { min: 6.7, max: 8.8, speed: 'result.speed.fast',   force: 'result.punch.medium' },
                shading:   { min: 5.5, max: 7.5, speed: 'result.speed.medium', force: 'result.punch.soft' },
                packing:   { min: 7.0, max: 9.2, speed: 'result.speed.fast',   force: 'result.punch.hard' },
                stippling: { min: 5.5, max: 7.6, speed: 'result.speed.slow',   force: 'result.punch.medium' }
            },
            "4.0": {
                lining:    { min: 7.2, max: 9.4, speed: 'result.speed.fast',   force: 'result.punch.hard' },
                shading:   { min: 6.0, max: 8.1, speed: 'result.speed.medium', force: 'result.punch.medium' },
                packing:   { min: 7.5, max: 9.8, speed: 'result.speed.fast',   force: 'result.punch.hard' },
                stippling: { min: 6.0, max: 8.0, speed: 'result.speed.slow',   force: 'result.punch.hard' }
            },
            "4.5": {
                lining:    { min: 7.7, max: 10.0, speed: 'result.speed.fast',   force: 'result.punch.very_hard' },
                shading:   { min: 6.5, max: 8.7,  speed: 'result.speed.medium', force: 'result.punch.hard' },
                packing:   { min: 8.0, max: 10.5, speed: 'result.speed.fast',   force: 'result.punch.very_hard' },
                stippling: { min: 6.5, max: 8.5,  speed: 'result.speed.slow',   force: 'result.punch.hard' }
            },
            duty_cycle: "result.duty.fixed"
        },
        coil: {
            "2.5": {
                lining:    { min: 6.5, max: 8.5, speed: 'result.speed.medium', force: 'result.punch.medium' },
                shading:   { min: 5.0, max: 7.0, speed: 'result.speed.slow',   force: 'result.punch.soft' },
                packing:   { min: 6.8, max: 9.0, speed: 'result.speed.medium', force: 'result.punch.medium' },
                stippling: { min: 5.2, max: 7.2, speed: 'result.speed.slow',   force: 'result.punch.soft' }
            },
            "3.0": {
                lining:    { min: 6.8, max: 9.0, speed: 'result.speed.medium', force: 'result.punch.medium' },
                shading:   { min: 5.2, max: 7.4, speed: 'result.speed.slow',   force: 'result.punch.soft' },
                packing:   { min: 7.0, max: 9.4, speed: 'result.speed.medium', force: 'result.punch.hard' },
                stippling: { min: 5.5, max: 7.5, speed: 'result.speed.slow',   force: 'result.punch.soft' }
            },
            "3.5": {
                lining:    { min: 7.2, max: 9.5, speed: 'result.speed.fast',   force: 'result.punch.hard' },
                shading:   { min: 5.6, max: 7.8, speed: 'result.speed.medium', force: 'result.punch.soft' },
                packing:   { min: 7.4, max: 9.8, speed: 'result.speed.fast',   force: 'result.punch.hard' },
                stippling: { min: 5.8, max: 7.8, speed: 'result.speed.slow',   force: 'result.punch.medium' }
            },
            "4.0": {
                lining:    { min: 7.9, max: 10.4, speed: 'result.speed.fast',   force: 'result.punch.hard' },
                shading:   { min: 6.3, max: 8.7,  speed: 'result.speed.medium', force: 'result.punch.medium' },
                packing:   { min: 8.1, max: 10.7, speed: 'result.speed.fast',   force: 'result.punch.very_hard' },
                stippling: { min: 6.2, max: 8.3,  speed: 'result.speed.slow',   force: 'result.punch.hard' }
            },
            "4.5": {
                lining:    { min: 8.5, max: 11.2, speed: 'result.speed.fast',   force: 'result.punch.very_hard' },
                shading:   { min: 6.8, max: 9.2,  speed: 'result.speed.medium', force: 'result.punch.hard' },
                packing:   { min: 8.6, max: 11.5, speed: 'result.speed.fast',   force: 'result.punch.very_hard' },
                stippling: { min: 6.8, max: 9.0,  speed: 'result.speed.slow',   force: 'result.punch.very_hard' }
            },
            duty_cycle: "result.duty.coil"
        }
    };

    // Visualizer stroke throw metrics
    const STROKE_MECHANICS = {
        "2.5": {
            camRadius: 16,
            throwHeight: 25,
            dwellKey: 'vis.mech.25.dwell',
            rateKey: 'vis.mech.25.rate',
            forceKey: 'vis.mech.25.force',
            dwellDesc: "Short skin contact time; fast recovery",
            rateDesc: "Higher cycle frequency per volt",
            forceDesc: "Low inertia; soft impact"
        },
        "3.0": {
            camRadius: 19,
            throwHeight: 32,
            dwellKey: 'vis.mech.30.dwell',
            rateKey: 'vis.mech.30.rate',
            forceKey: 'vis.mech.30.force',
            dwellDesc: "Balanced skin contact",
            rateDesc: "Moderate-high frequency",
            forceDesc: "Moderate punch"
        },
        "3.5": {
            camRadius: 22,
            throwHeight: 40,
            dwellKey: 'vis.mech.35.dwell',
            rateKey: 'vis.mech.35.rate',
            forceKey: 'vis.mech.35.force',
            dwellDesc: "Medium / Balanced skin contact",
            rateDesc: "Balanced cycle rate",
            forceDesc: "Balanced punch"
        },
        "4.0": {
            camRadius: 26,
            throwHeight: 50,
            dwellKey: 'vis.mech.40.dwell',
            rateKey: 'vis.mech.40.rate',
            forceKey: 'vis.mech.40.force',
            dwellDesc: "Extended skin dwell time",
            rateDesc: "Lower cycle frequency; deeper drive",
            forceDesc: "Firm punch; high inertia"
        },
        "4.5": {
            camRadius: 30,
            throwHeight: 62,
            dwellKey: 'vis.mech.45.dwell',
            rateKey: 'vis.mech.45.rate',
            forceKey: 'vis.mech.45.force',
            dwellDesc: "Maximum skin penetration dwell",
            rateDesc: "Low cycle frequency; heavy throw",
            forceDesc: "Heavy punch; maximum momentum"
        }
    };

    // Evaluates machine connection, power supply, and cable
    function evaluateCompatibility(conn, supply, cable) {
        const issues = [];
        let status = 'safe'; // 'safe' | 'warning' | 'incompatible'

        const i18n = window.PoliI18n || { t: (k) => k };

        // Check 1: Wireless direct mount with external cables
        if (conn === 'wireless' && cable !== 'direct') {
            issues.push({
                type: 'warning',
                titleKey: 'compat.issue.cable_mismatch.title',
                descKey: 'compat.issue.cable_mismatch.desc',
                title: i18n.t('compat.issue.cable_mismatch.title'),
                desc: i18n.t('compat.issue.cable_mismatch.desc')
            });
            status = 'warning';
        }

        // Check 2: Wireless pack selected with bench supply
        if (conn === 'wireless' && supply !== 'wireless_pack') {
            issues.push({
                type: 'warning',
                titleKey: 'compat.issue.supply_redundancy.title',
                descKey: 'compat.issue.supply_redundancy.desc',
                title: i18n.t('compat.issue.supply_redundancy.title'),
                desc: i18n.t('compat.issue.supply_redundancy.desc')
            });
            status = 'warning';
        }

        // Check 3: Cheyenne 3.5mm jack with clipcord
        if (conn === 'cheyenne' && cable === 'clipcord') {
            issues.push({
                type: 'incompatible',
                titleKey: 'compat.issue.cheyenne_clipcord.title',
                descKey: 'compat.issue.cheyenne_clipcord.desc',
                title: i18n.t('compat.issue.cheyenne_clipcord.title'),
                desc: i18n.t('compat.issue.cheyenne_clipcord.desc')
            });
            status = 'incompatible';
        }

        // Check 4: Clipcord machine with RCA cable
        if (conn === 'clipcord' && cable === 'rca') {
            issues.push({
                type: 'incompatible',
                titleKey: 'compat.issue.clipcord_rca.title',
                descKey: 'compat.issue.clipcord_rca.desc',
                title: i18n.t('compat.issue.clipcord_rca.title'),
                desc: i18n.t('compat.issue.clipcord_rca.desc')
            });
            status = 'incompatible';
        }

        // Check 5: Low-amperage mini supply with stiff cartridge machines
        if (supply === 'bench_low' && (conn === 'cheyenne' || conn === 'rca')) {
            issues.push({
                type: 'warning',
                titleKey: 'compat.issue.mini_supply_startup.title',
                descKey: 'compat.issue.mini_supply_startup.desc',
                title: i18n.t('compat.issue.mini_supply_startup.title'),
                desc: i18n.t('compat.issue.mini_supply_startup.desc')
            });
            if (status !== 'incompatible') status = 'warning';
        }

        // Check 6: Coil machines on wireless battery packs
        if (conn === 'clipcord' && supply === 'wireless_pack') {
            issues.push({
                type: 'warning',
                titleKey: 'compat.issue.coil_wireless_emf.title',
                descKey: 'compat.issue.coil_wireless_emf.desc',
                title: i18n.t('compat.issue.coil_wireless_emf.title'),
                desc: i18n.t('compat.issue.coil_wireless_emf.desc')
            });
            if (status !== 'incompatible') status = 'warning';
        }

        if (issues.length === 0) {
            issues.push({
                type: 'safe',
                titleKey: 'compat.issue.safe.title',
                descKey: 'compat.issue.safe.desc',
                title: i18n.t('compat.issue.safe.title'),
                desc: i18n.t('compat.issue.safe.desc')
            });
        }

        return {
            status: status,
            issues: issues
        };
    }

    // Export
    window.STARTING_RANGES = STARTING_RANGES;
    window.STROKE_MECHANICS = STROKE_MECHANICS;
    window.evaluateCompatibility = evaluateCompatibility;

})(window);
