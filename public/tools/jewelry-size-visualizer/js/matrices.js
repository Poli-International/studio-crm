// The search text is echoed back into HTML: escape it.
function escMatrix(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Clinical & Material Matrices Module
 * Poli International Widget Suite
 *
 * Established Professional Practice & Objective Implant-Grade Material Benchmarks
 * Meets ASTM F-136, ASTM F-138, and ISO Clinical Standards for piercers and healthcare providers worldwide.
 */

const ClinicalMatricesModule = {
    materials: [
        {
            alloy: 'Implant-Grade Titanium (Ti-6Al-4V ELI)',
            standard: 'ASTM F-136 / ISO 5832-3',
            composition: 'Titanium (89%), Aluminum (5.5-6.5%), Vanadium (3.5-4.5%), Extra Low Interstitials (O, N, C, H, Fe < 0.13%)',
            biocompatibility: 'Class VI / ISO 10993 Maximum (Osseointegrative)',
            nickelContent: '0.00% (Completely Nickel-Free)',
            surfaceFinish: 'Mirror Polish Ra < 0.025 μm, Passivated per ASTM F-86',
            sterilization: 'Autoclave Steam (134°C / 273°F at 30 psi), EtO Gas, Plasma',
            mriCompatibility: 'MRI Safe (Non-ferromagnetic, minimal radiofrequency artifact)',
            clinicalStatus: 'Clinical Standard: Approved for Initial Piercings & Long-term Implantation',
            badge: 'ASTM F-136 Certified',
            healthcareNotes: 'Recommended first-line material for individuals with metal sensitivities, compromised immune healing, or undergoing regular medical imaging.'
        },
        {
            alloy: 'Surgical Implant Stainless Steel (316LVM)',
            standard: 'ASTM F-138 / ISO 5832-1',
            composition: 'Vacuum Arc Remelted (VAR) Iron-Chromium-Nickel-Molybdenum alloy (17-19% Cr, 13-15% Ni, 2.25-3.0% Mo, C ≤ 0.03%)',
            biocompatibility: 'Implant Grade (Surgical fixation and osteosynthesis certified)',
            nickelContent: 'Bonded matrix; release rate < 0.05 μg/cm²/week (Passes EU Nickel Directive 94/27/EC)',
            surfaceFinish: 'Precision Mirror Polish, Passivated per ASTM F-86 to form protective chromium oxide barrier',
            sterilization: 'Autoclave Steam (121°C - 134°C), Dry Heat, Chemical vapor',
            mriCompatibility: 'MRI Conditional (Very low magnetic susceptibility; minor localized susceptibility artifact)',
            clinicalStatus: 'Approved for Initial Piercings when conforming strictly to ASTM F-138 specifications',
            badge: 'ASTM F-138 Certified',
            healthcareNotes: 'Must be verified as F-138 surgical implant grade with mill certificates. Standard 316L (architectural/commercial steel) is contraindicated for initial piercing.'
        },
        {
            alloy: 'Commercially Pure Titanium (CP Grades 1-4)',
            standard: 'ASTM F-67 / ISO 5832-2',
            composition: 'Unalloyed Titanium (99.0% - 99.5% pure Ti)',
            biocompatibility: 'Extreme Bio-inertness & corrosion resistance in physiological saline',
            nickelContent: '0.00% (Completely Nickel-Free)',
            surfaceFinish: 'Electropolished / Mechanically polished with natural titanium dioxide passive layer',
            sterilization: 'Autoclave Steam (134°C / 273°F), EtO Gas, Plasma',
            mriCompatibility: 'MRI Safe (Non-ferromagnetic, zero displacement force)',
            clinicalStatus: 'Approved for Initial & Healed Piercings',
            badge: 'ASTM F-67 Certified',
            healthcareNotes: 'Slightly more ductile than Ti-6Al-4V; commonly used for continuous rings and custom anatomical adaptations.'
        },
        {
            alloy: 'Pure Niobium (Nb)',
            standard: 'ASTM B392 Compliant',
            composition: 'Pure unalloyed Niobium (99.9% Nb)',
            biocompatibility: 'Elemental Bio-inert metal, elemental state without alloy additives',
            nickelContent: '0.00% (Completely Nickel-Free)',
            surfaceFinish: 'High mirror finish, anodizable to vibrant hypoallergenic colors without plating',
            sterilization: 'Autoclave Steam (134°C), EtO Gas',
            mriCompatibility: 'MRI Safe (Non-ferromagnetic)',
            clinicalStatus: 'Approved for Initial Piercings & Healed Fistulas',
            badge: 'Pure Niobium 99.9%',
            healthcareNotes: 'Ideal alternative for patients reporting idiopathic reactions to surgical stainless steel or titanium.'
        },
        {
            alloy: 'Solid 14k / 18k Biocompatible Gold',
            standard: 'Professional Piercing Standards / ASTM F-2999 Benchmark',
            composition: 'Solid alloy (58.3% gold for 14k, 75.0% gold for 18k) alloyed strictly with silver and copper; strictly zero nickel, zero cadmium',
            biocompatibility: 'Biocompatible inert precious alloy',
            nickelContent: '0.00% Nickel / 0.00% Cadmium',
            surfaceFinish: 'Hand-lapped high polish mirror finish; free of porosity, pitting, or tool marks',
            sterilization: 'Autoclave Steam (121°C - 134°C)',
            mriCompatibility: 'MRI Safe (Non-magnetic noble metal)',
            clinicalStatus: 'Approved for Initial Piercings (Solid 14k/18k only; Gold plated/rolled/vermeil is strictly contraindicated)',
            badge: 'Solid Nickel-Free Gold',
            healthcareNotes: 'Plated, vermeil, or gold-filled jewelry is never permissible for healing piercings due to flaking, galvanic corrosion, and toxic sub-layer exposure.'
        },
        {
            alloy: 'Medical-Grade Borosilicate Glass',
            standard: 'ISO 3585 / ASTM E438 Type I Class A',
            composition: 'Low-expansion borosilicate glass (81% SiO2, 13% B2O3, 4% Na2O/K2O, 2% Al2O3), lead-free, barium-free',
            biocompatibility: 'Completely chemically inert, non-porous, smooth amorphous surface',
            nickelContent: '0.00% (Zero metal content)',
            surfaceFinish: 'Fire-polished smooth radius, seamless, non-adherent to newly forming granulation tissue',
            sterilization: 'Autoclave Steam (134°C), Chemclave',
            mriCompatibility: 'MRI Safe (Zero magnetic susceptibility, completely transparent to X-ray/CT/MRI)',
            clinicalStatus: 'Approved for Initial Piercings, Stretching, and Medical Retainers',
            badge: 'Borosilicate Glass',
            healthcareNotes: 'Optimal temporary retainer during surgical procedures, radiographic imaging, MRI, and radiation therapy.'
        },
        {
            alloy: 'Implant Polymers: Medical-Grade PTFE / Bioplast',
            standard: 'USP Class VI / ISO 10993',
            composition: 'Polytetrafluoroethylene (PTFE) or medical-grade polymer resin, plasticizer-free',
            biocompatibility: 'Medical grade flexible polymer, biologically inert',
            nickelContent: '0.00% (Non-metallic)',
            surfaceFinish: 'Flexible, smooth micro-machined surface',
            sterilization: 'Autoclave Steam (Max 121°C / 250°F for PTFE; do not exceed temperature rating)',
            mriCompatibility: 'MRI Safe & CT Artifact-Free',
            clinicalStatus: 'Approved for specialized pregnancy retainers, hospital surgery, or athletic adaptation',
            badge: 'USP Class VI Polymer',
            healthcareNotes: 'Flexible shafts prevent abdominal tearing during late-term pregnancy and provide non-conductive safety during surgical electrosurgery/cautery.'
        }
    ],

    wireGauges: [
        {
            gauge: '20g',
            metric: '0.81 mm',
            inches: '0.032 in (1/32")',
            area: '0.51 mm²',
            stability: 'Low',
            migrationRisk: 'High (Wire Effect / "Cheese-Cutter" Risk)',
            clinicalGuidance: 'Permissible only for healed nostrils and secondary earlobes. Clinically contraindicated for initial cartilage, oral, navel, or genital piercings due to focal pressure necrosis.',
            initialApproved: false,
            downsizeRecommended: true,
            statusBadge: 'Healed Downsize Only'
        },
        {
            gauge: '18g',
            metric: '1.02 mm',
            inches: '0.040 in',
            area: '0.82 mm²',
            stability: 'Moderate-Low',
            migrationRisk: 'Moderate-High in High-Movement Tissue',
            clinicalGuidance: 'Standard clinical gauge for nostril piercings and initial lobe piercings. Minimal tissue displacement; requires careful swelling evaluation.',
            initialApproved: true,
            downsizeRecommended: true,
            statusBadge: 'Approved (Nostril / Lobes)'
        },
        {
            gauge: '16g',
            metric: '1.29 mm',
            inches: '0.051 in (3/64")',
            area: '1.31 mm²',
            stability: 'High Clinical Standard',
            migrationRisk: 'Low / Standard Clinical Baseline',
            clinicalGuidance: 'The international clinical baseline under established professional practice for ear cartilage (helix, tragus, conch, rook, daith), eyebrows, and lips. Prevents migration and promotes stable fistula formation.',
            initialApproved: true,
            downsizeRecommended: false,
            statusBadge: 'Primary Clinical Baseline'
        },
        {
            gauge: '14g',
            metric: '1.63 mm',
            inches: '0.064 in (1/16")',
            area: '2.08 mm²',
            stability: 'Very High',
            migrationRisk: 'Very Low',
            clinicalGuidance: 'Primary clinical standard for tongue, navel, nipple, industrial, and heavy cartilage piercings. Generates sufficient vascular drainage channel and resists shearing forces from clothing.',
            initialApproved: true,
            downsizeRecommended: false,
            statusBadge: 'Primary Clinical Standard'
        },
        {
            gauge: '12g',
            metric: '2.05 mm',
            inches: '0.081 in (5/64")',
            area: '3.31 mm²',
            stability: 'Superior Mechanical Strength',
            migrationRisk: 'Extremely Low',
            clinicalGuidance: 'Recommended for female genital (VCH, HCH), male genital, conch punches, and heavy-duty earlobes. Exceptional resistance to tissue cleavage.',
            initialApproved: true,
            downsizeRecommended: false,
            statusBadge: 'Heavy-Duty Standard'
        },
        {
            gauge: '10g',
            metric: '2.59 mm',
            inches: '0.102 in',
            area: '5.26 mm²',
            stability: 'Maximum Load-Bearing',
            migrationRisk: 'Negligible',
            clinicalGuidance: 'Standard starting gauge for Prince Albert (PA) and high-vascularity male genital piercings to protect the urethral meatus against pressure migration.',
            initialApproved: true,
            downsizeRecommended: false,
            statusBadge: 'Genital / Large Gauge'
        },
        {
            gauge: '8g',
            metric: '3.26 mm',
            inches: '0.128 in (1/8")',
            area: '8.37 mm²',
            stability: 'Extreme Structural Rigidity',
            migrationRisk: 'Negligible',
            clinicalGuidance: 'Specialized large-gauge piercings and advanced stretching milestones. Spreads mechanical load over 8.37 mm² cross-sectional core.',
            initialApproved: true,
            downsizeRecommended: false,
            statusBadge: 'Large Gauge Foundation'
        },
        {
            gauge: '6g',
            metric: '4.11 mm',
            inches: '0.162 in (5/32")',
            area: '13.30 mm²',
            stability: 'Extreme',
            migrationRisk: 'Zero (Significant Tissue Dispersal)',
            clinicalGuidance: 'Stretching milestone requiring minimum 8-12 weeks consolidation between steps under established professional practice.',
            initialApproved: false,
            downsizeRecommended: false,
            statusBadge: 'Advanced Stretched Size'
        },
        {
            gauge: '4g',
            metric: '5.19 mm',
            inches: '0.204 in (13/64")',
            area: '21.14 mm²',
            stability: 'Extreme',
            migrationRisk: 'Zero',
            clinicalGuidance: 'Requires single-flare implant-grade glass or ASTM F-136 titanium. Never stretch with silicone or acrylic.',
            initialApproved: false,
            downsizeRecommended: false,
            statusBadge: 'Advanced Stretched Size'
        },
        {
            gauge: '2g',
            metric: '6.54 mm',
            inches: '0.258 in (1/4")',
            area: '33.64 mm²',
            stability: 'Extreme',
            migrationRisk: 'Zero',
            clinicalGuidance: 'Critical transition threshold before reaching 0g (8.0mm). 1.5mm jump may require half-size (7mm / 1g) intermediate jewelry.',
            initialApproved: false,
            downsizeRecommended: false,
            statusBadge: 'Advanced Stretched Size'
        },
        {
            gauge: '0g',
            metric: '8.25 mm',
            inches: '0.325 in (5/16")',
            area: '53.48 mm²',
            stability: 'Extreme',
            migrationRisk: 'Zero',
            clinicalGuidance: 'Major cosmetic gauge threshold. Recommended wear: ASTM F-136 titanium, implant-grade glass, or certified biocompatible organic materials (once fully healed).',
            initialApproved: false,
            downsizeRecommended: false,
            statusBadge: 'Major Gauge Threshold'
        },
        {
            gauge: '00g',
            metric: '10.00 mm',
            inches: '0.394 in (3/8")',
            area: '78.54 mm²',
            stability: 'Extreme',
            migrationRisk: 'Zero',
            clinicalGuidance: 'Point of potential non-reversibility without reconstructive loboplasty. Clinical follow-up recommended.',
            initialApproved: false,
            downsizeRecommended: false,
            statusBadge: 'Major Milestone'
        }
    ],

    init() {
        this.renderMaterialMatrix();
        this.renderWireGaugeMatrix();
        this.bindFilterEvents();
        console.log('🔬 Clinical & Material Matrices module loaded');
    },

    renderMaterialMatrix(filterQuery = '') {
        const container = document.getElementById('material-matrix-container');
        if (!container) return;

        const query = filterQuery.toLowerCase().trim();
        const filtered = this.materials.filter(m => {
            if (!query) return true;
            return m.alloy.toLowerCase().includes(query) ||
                   m.standard.toLowerCase().includes(query) ||
                   m.nickelContent.toLowerCase().includes(query) ||
                   m.mriCompatibility.toLowerCase().includes(query) ||
                   m.clinicalStatus.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="matrix-empty-state">${escMatrix(tr('matrices.noMaterials', 'No materials match "{q}".', { q: filterQuery }))}</div>`;
            return;
        }

        container.innerHTML = filtered.map(m => `
            <div class="matrix-card" id="card-${m.standard.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}">
                <div class="matrix-card__header">
                    <div>
                        <span class="matrix-badge matrix-badge--primary">${m.badge}</span>
                        <h4 class="matrix-card__title">${m.alloy}</h4>
                        <span class="matrix-card__subtitle">Standard: <strong>${m.standard}</strong></span>
                    </div>
                </div>
                <div class="matrix-card__grid">
                    <div class="matrix-spec">
                        <span class="matrix-spec__label">Alloy Composition</span>
                        <span class="matrix-spec__value">${m.composition}</span>
                    </div>
                    <div class="matrix-spec">
                        <span class="matrix-spec__label">Nickel Release</span>
                        <span class="matrix-spec__value matrix-spec__value--highlight">${m.nickelContent}</span>
                    </div>
                    <div class="matrix-spec">
                        <span class="matrix-spec__label">Biocompatibility Rating</span>
                        <span class="matrix-spec__value">${m.biocompatibility}</span>
                    </div>
                    <div class="matrix-spec">
                        <span class="matrix-spec__label">Surface Finish Requirement</span>
                        <span class="matrix-spec__value">${m.surfaceFinish}</span>
                    </div>
                    <div class="matrix-spec">
                        <span class="matrix-spec__label">Autoclave / Sterilization</span>
                        <span class="matrix-spec__value">${m.sterilization}</span>
                    </div>
                    <div class="matrix-spec">
                        <span class="matrix-spec__label">MRI & Diagnostic Safety</span>
                        <span class="matrix-spec__value">${m.mriCompatibility}</span>
                    </div>
                </div>
                <div class="matrix-card__clinical">
                    <div class="matrix-clinical-status">
                        <span class="matrix-icon">⚕️</span>
                        <div>
                            <strong>Clinical Protocol Status:</strong> ${m.clinicalStatus}
                        </div>
                    </div>
                    <p class="matrix-healthcare-notes">
                        <strong>Healthcare Provider Guidance:</strong> ${m.healthcareNotes}
                    </p>
                </div>
            </div>
        `).join('');
    },

    renderWireGaugeMatrix(filterQuery = '') {
        const tableBody = document.getElementById('wire-gauge-table-body');
        if (!tableBody) return;

        const query = filterQuery.toLowerCase().trim();
        const filtered = this.wireGauges.filter(g => {
            if (!query) return true;
            return g.gauge.toLowerCase().includes(query) ||
                   g.metric.toLowerCase().includes(query) ||
                   g.inches.toLowerCase().includes(query) ||
                   g.clinicalGuidance.toLowerCase().includes(query) ||
                   g.migrationRisk.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">${escMatrix(tr('matrices.noGauges', 'No wire gauges match "{q}".', { q: filterQuery }))}</td></tr>`;
            return;
        }

        tableBody.innerHTML = filtered.map(g => `
            <tr class="${g.initialApproved ? 'row-approved' : 'row-downsize'}">
                <td>
                    <strong class="gauge-display">${g.gauge}</strong>
                    <div class="gauge-sub">${g.statusBadge}</div>
                </td>
                <td><strong>${g.metric}</strong></td>
                <td>${g.inches}</td>
                <td><code>${g.area}</code></td>
                <td>
                    <span class="stability-tag stability-tag--${g.stability.toLowerCase().includes('high') ? 'high' : (g.stability.toLowerCase().includes('low') ? 'low' : 'mid')}">
                        ${g.stability}
                    </span>
                </td>
                <td>
                    <span class="risk-indicator ${g.migrationRisk.includes('High') ? 'risk-indicator--high' : (g.migrationRisk.includes('Moderate') ? 'risk-indicator--mid' : 'risk-indicator--low')}">
                        ${g.migrationRisk}
                    </span>
                </td>
                <td class="clinical-guidance-cell">
                    ${g.clinicalGuidance}
                </td>
            </tr>
        `).join('');
    },

    bindFilterEvents() {
        const materialInput = document.getElementById('matrix-material-search');
        if (materialInput) {
            materialInput.addEventListener('input', (e) => {
                this.renderMaterialMatrix(e.target.value);
            });
        }

        const gaugeInput = document.getElementById('matrix-gauge-search');
        if (gaugeInput) {
            gaugeInput.addEventListener('input', (e) => {
                this.renderWireGaugeMatrix(e.target.value);
            });
        }

        const materialPills = document.querySelectorAll('.matrix-filter-pill[data-material-filter]');
        materialPills.forEach(pill => {
            pill.addEventListener('click', () => {
                materialPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const filter = pill.dataset.materialFilter;
                this.renderMaterialMatrix(filter === 'all' ? '' : filter);
                if (materialInput) materialInput.value = filter === 'all' ? '' : filter;
            });
        });

        const gaugePills = document.querySelectorAll('.matrix-filter-pill[data-gauge-filter]');
        gaugePills.forEach(pill => {
            pill.addEventListener('click', () => {
                gaugePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const filter = pill.dataset.gaugeFilter;
                let query = '';
                if (filter === 'initial') query = 'Approved';
                else if (filter === 'downsize') query = 'Downsize';
                else if (filter === 'stretched') query = 'Stretched';
                this.renderWireGaugeMatrix(query);
            });
        });
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ClinicalMatricesModule = ClinicalMatricesModule;
}
