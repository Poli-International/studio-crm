/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Anatomy Guide Module
 * Poli International Widget Suite
 *
 * Body location recommendations with anatomy information
 */

const AnatomyGuide = {
    currentLocation: null,

    // Anatomy database
    anatomyData: {
        ear: {
            name: 'Ear Piercings',
            jewelryTypes: ['Labret Studs', 'Rings', 'Barbells', 'Clickers', 'Plugs/Tunnels'],
            gauges: ['20g', '18g', '16g', '14g', '12g', '10g', '8g', '6g', '4g', '2g', '0g', '00g'],
            sizes: [
                { type: 'Lobe', gauge: '20g-14g', size: '1/4"-3/8" (6-10mm)' },
                { type: 'Helix', gauge: '18g-14g', size: '5/16"-3/8" (8-10mm)' },
                { type: 'Tragus', gauge: '18g-14g', size: '1/4"-5/16" (6-8mm)' },
                { type: 'Daith', gauge: '16g-14g', size: '3/8"-1/2" (10-12mm)' },
                { type: 'Rook', gauge: '18g-14g', size: '5/16"-3/8" (8-10mm)' },
                { type: 'Conch', gauge: '16g-12g', size: '3/8"-1/2" (10-12mm)' },
                { type: 'Industrial', gauge: '14g', size: '1-3/8"-1-1/2" (35-38mm)' }
            ],
            notes: 'Ear piercings adhere to established professional practice. Lobe piercings heal in 6-8 weeks; cartilage requires 6-12 months. Initial piercings require verified implant-grade materials meeting ASTM F-136 titanium, ASTM F-138 steel, or nickel-free 14k/18k solid gold. Consult a qualified professional piercer to evaluate ear cartilage anatomy before industrial or daith procedures.'
        },
        nose: {
            name: 'Nose Piercings',
            jewelryTypes: ['Nose Screws', 'L-Shaped Studs', 'Labret Studs', 'Rings', 'Clickers'],
            gauges: ['20g', '18g', '16g'],
            sizes: [
                { type: 'Nostril', gauge: '20g-18g', size: '1/4"-5/16" (6-8mm) post' },
                { type: 'Nostril Ring', gauge: '20g-18g', size: '5/16"-3/8" (8-10mm) diameter' },
                { type: 'Septum', gauge: '16g-14g', size: '3/8"-1/2" (10-12mm) diameter' }
            ],
            notes: 'Nostril piercings heal in 4-6 months; septums heal in 6-8 weeks when placed in the membranous columellar space. Established professional practice recommends 18g/16g ASTM F-136 titanium flat-back labrets for initial nostrils to prevent canal trauma. Hoop jewelry is advised only after complete fistula epithelization.'
        },
        lip: {
            name: 'Lip Piercings',
            jewelryTypes: ['Labret Studs', 'Rings', 'Circular Barbells'],
            gauges: ['16g', '14g'],
            sizes: [
                { type: 'Labret (center)', gauge: '16g-14g', size: '5/16"-1/2" (8-12mm)' },
                { type: 'Monroe/Madonna', gauge: '16g', size: '1/4"-5/16" (6-8mm)' },
                { type: 'Medusa', gauge: '16g', size: '5/16"-3/8" (8-10mm)' },
                { type: 'Snake Bites', gauge: '16g-14g', size: '5/16"-1/2" (8-12mm)' }
            ],
            notes: 'Lip piercings heal in 6-8 weeks. Per established professional practice, initial placement requires a longer post (10-12mm) for physiological edema. A scheduled downsize at 3-4 weeks with a qualified professional piercer is critical to prevent oral mucosal erosion and dental abrasion.'
        },
        tongue: {
            name: 'Tongue Piercing',
            jewelryTypes: ['Straight Barbells'],
            gauges: ['14g'],
            sizes: [
                { type: 'Tongue (standard)', gauge: '14g', size: '5/8"-3/4" (16-19mm) initial' },
                { type: 'Tongue (healed)', gauge: '14g', size: '1/2"-5/8" (12-16mm) final' }
            ],
            notes: 'Tongue piercings heal in 4-6 weeks with significant initial vascular swelling (days 1-10). Established professional practice requires starting with an initial 3/4" or 7/8" 14g ASTM F-136 titanium barbell, followed by mandatory downsizing to 5/8" or 1/2" to avoid chipping dentition and damaging sublingual tissues.'
        },
        eyebrow: {
            name: 'Eyebrow Piercing',
            jewelryTypes: ['Curved Barbells', 'Circular Barbells'],
            gauges: ['16g'],
            sizes: [
                { type: 'Eyebrow', gauge: '16g', size: '3/8"-1/2" (10-12mm)' }
            ],
            notes: 'Eyebrow piercings heal in 6-8 weeks. As surface-level piercings, curved barbells meeting ASTM F-136 titanium standards are specified to mitigate migration risk. Anatomical assessment by a qualified professional piercer ensures placement follows natural supraorbital ridge lines.'
        },
        navel: {
            name: 'Navel (Belly Button)',
            jewelryTypes: ['Curved Barbells'],
            gauges: ['14g'],
            sizes: [
                { type: 'Navel (standard)', gauge: '14g', size: '7/16"-1/2" (11-12mm)' },
                { type: 'Navel (deep)', gauge: '14g', size: '1/2"-5/8" (12-16mm)' }
            ],
            notes: 'Navel piercings heal in 6-12 months. Anatomical compatibility requires a distinct superior lip and open navel cavity in seated and standing postures. Under established professional practice, floating navels or J-curves with ASTM F-136 titanium may be indicated for collapsing navels.'
        },
        nipple: {
            name: 'Nipple Piercings',
            jewelryTypes: ['Straight Barbells', 'Rings', 'Circular Barbells'],
            gauges: ['14g', '12g'],
            sizes: [
                { type: 'Nipple (male)', gauge: '14g', size: '1/2"-5/8" (12-16mm)' },
                { type: 'Nipple (female)', gauge: '14g', size: '1/2"-3/4" (12-19mm)' }
            ],
            notes: 'Nipple piercings heal in 6-12 months. Established professional practice prescribes 14g or 12g straight barbells of implant-grade titanium (ASTM F-136) or surgical steel (ASTM F-138) to prevent wire migration. Accurate caliper sizing by a qualified professional piercer accounts for areolar expansion.'
        },
        surface: {
            name: 'Surface & Dermal Piercings',
            jewelryTypes: ['Surface Bars', 'Dermal Anchors'],
            gauges: ['14g', '12g'],
            sizes: [
                { type: 'Surface Bar', gauge: '12g-14g', size: '1/2"-3/4" (12-19mm) between holes' },
                { type: 'Dermal Anchor', gauge: '14g-12g', size: '1/4" (6mm) depth' }
            ],
            notes: 'Surface bars require 90° rises and flat internal footings conforming to ASTM F-136 standards to dissipate superficial tissue tension. Single-point dermal anchors utilize perforated bases for tissue integration. Consultation and insertion by a qualified professional piercer is imperative.'
        },
        'male-genital': {
            name: 'Male Genital Piercings',
            jewelryTypes: ['Circular Barbells', 'Straight Barbells', 'Rings', 'Curved Barbells'],
            gauges: ['14g', '12g', '10g', '8g', '6g', '4g', '2g'],
            sizes: [
                { type: 'Prince Albert', gauge: '10g-6g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Reverse PA', gauge: '10g-6g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Apadravya', gauge: '10g-8g', size: '5/8"-3/4" (16-19mm) straight barbell' },
                { type: 'Ampallang', gauge: '10g-8g', size: '3/4"-1" (19-25mm) straight barbell' },
                { type: 'Frenum', gauge: '12g-10g', size: '3/8"-1/2" (10-12mm) circular barbell' },
                { type: 'Lorum', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Hafada', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Guiche', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Dydoe', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Foreskin', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) ring' }
            ],
            notes: 'Male genital piercings heal in 4-12 weeks depending on vascularity. Established professional practice recommends a minimum 12g-10g starting wire gauge for urethral piercings to eliminate wire-effect tissue cleavage. Consultation with a qualified professional piercer is essential to assess individual urogenital anatomy. Certified implant-grade materials (ASTM F-136 / ASTM F-138) must be used exclusively.'
        },
        'female-genital': {
            name: 'Female Genital Piercings',
            jewelryTypes: ['Curved Barbells', 'Circular Barbells', 'Rings', 'Labret Studs'],
            gauges: ['14g', '12g', '10g', '8g'],
            sizes: [
                { type: 'Clitoral Hood (VCH)', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) curved barbell' },
                { type: 'Horizontal CH (HCH)', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) curved barbell' },
                { type: 'Clitoris', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) circular barbell' },
                { type: 'Inner Labia', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) circular barbell' },
                { type: 'Outer Labia', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Triangle', gauge: '12g', size: '1/2"-5/8" (12-16mm) circular barbell' },
                { type: 'Fourchette', gauge: '14g-12g', size: '3/8"-1/2" (10-12mm) curved barbell' },
                { type: 'Christina', gauge: '14g', size: '1/2"-5/8" (12-16mm) surface bar' },
                { type: 'Princess Albertina', gauge: '12g-10g', size: '1/2"-5/8" (12-16mm) circular barbell' }
            ],
            notes: 'Female genital piercings heal in 4-10 weeks based on location and microvascular supply. A thorough clinical assessment by a qualified professional piercer under established professional practice is mandatory to determine clitoral hood depth and vascular landmarks. Only ASTM F-136 implant titanium or solid biocompatible gold are indicated.'
        }
    },

    init() {
        // Bind location button clicks
        document.querySelectorAll('.anatomy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const location = btn.dataset.location;
                this.showLocation(location);
            });
        });

        const browseBtn = document.getElementById('browse-location-jewelry');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => this.browseJewelry());
        }

        const calcCbbBtn = document.getElementById('anatomy-calc-curved-barbell');
        if (calcCbbBtn) {
            calcCbbBtn.addEventListener('click', () => {
                let targetPreset = 'rook';
                if (this.currentLocation === 'eyebrow') {
                    targetPreset = 'eyebrow';
                } else if (this.currentLocation === 'navel') {
                    targetPreset = 'navel';
                } else if (this.currentLocation === 'ear') {
                    targetPreset = 'rook';
                }
                if (typeof CurvedBarbellCalculator !== 'undefined') {
                    CurvedBarbellCalculator.selectPreset(targetPreset);
                }
            });
        }

        const calcIbbBtn = document.getElementById('anatomy-calc-industrial-barbell');
        if (calcIbbBtn) {
            calcIbbBtn.addEventListener('click', () => {
                const ibbTab = document.querySelector('[data-tab="industrial-barbell"]');
                if (ibbTab) {
                    ibbTab.click();
                    const input = document.getElementById('ibb-hole-distance');
                    if (input && !input.value) {
                        input.value = '38';
                    }
                    if (typeof IndustrialBarbellCalculator !== 'undefined') {
                        IndustrialBarbellCalculator.calculate();
                    }
                }
            });
        }

        console.log('🎯 Anatomy Guide initialized');
    },

    showLocation(location) {
        const data = this.anatomyData[location];
        if (!data) return;

        this.currentLocation = location;

        // Toggle curved barbell calculator button for locations using curved barbells
        const calcCbbBtn = document.getElementById('anatomy-calc-curved-barbell');
        if (calcCbbBtn) {
            const hasCurvedBarbell = ['ear', 'eyebrow', 'navel'].includes(location);
            calcCbbBtn.style.display = hasCurvedBarbell ? 'inline-flex' : 'none';
        }

        // Toggle industrial barbell calculator button for ear anatomy
        const calcIbbBtn = document.getElementById('anatomy-calc-industrial-barbell');
        if (calcIbbBtn) {
            const hasIndustrial = location === 'ear';
            calcIbbBtn.style.display = hasIndustrial ? 'inline-flex' : 'none';
        }

        // Update active state
        document.querySelectorAll('.anatomy-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.location === location);
        });

        // Show details
        const details = document.getElementById('anatomy-details');
        if (details) details.style.display = 'grid';

        // Update title
        const title = document.getElementById('anatomy-title');
        if (title) title.textContent = data.name;

        // Update jewelry types
        const typesList = document.getElementById('anatomy-jewelry-types');
        if (typesList) {
            typesList.innerHTML = data.jewelryTypes.map(type =>
                `<li>${type}</li>`
            ).join('');
        }

        // Update gauges
        const gaugesDiv = document.getElementById('anatomy-gauges');
        if (gaugesDiv) {
            gaugesDiv.innerHTML = data.gauges.map(gauge => {
                const mm = (ScaleRenderer.gaugeToInches(gauge) * 25.4).toFixed(1);
                return `<span class="gauge-chip">${gauge} (${mm}mm)</span>`;
            }).join('');
        }

        // Update sizes table
        const sizesBody = document.getElementById('anatomy-sizes');
        if (sizesBody) {
            sizesBody.innerHTML = data.sizes.map(size =>
                `<tr>
                    <td>${size.type}</td>
                    <td>${size.gauge}</td>
                    <td>${size.size}</td>
                </tr>`
            ).join('');
        }

        // Update notes
        const notes = document.getElementById('anatomy-notes');
        if (notes) notes.textContent = data.notes;

        // Update anatomy diagram
        const diagram = document.getElementById('anatomy-diagram');
        if (diagram) {
            // Map location to SVG filename (all locations now have SVGs!)
            const svgFile = location;
            diagram.src = `images/${svgFile}.svg`;
            diagram.alt = `${data.name} anatomy diagram`;
            diagram.style.display = 'block';
        }

        console.log('🎯 Showing anatomy for:', location);
    },

    browseJewelry() {
        if (!this.currentLocation) return;

        // Switch to visualizer tab with location filter
        const visualizerTab = document.querySelector('[data-tab="visualizer"]');
        if (visualizerTab) visualizerTab.click();

        // Set location filter
        const locationFilter = document.getElementById('filter-location');
        if (locationFilter) {
            // Map anatomy locations to filter values
            let filterValue = this.currentLocation;

            // Both male-genital and female-genital should show genital jewelry
            if (this.currentLocation === 'male-genital' || this.currentLocation === 'female-genital') {
                filterValue = 'genital';
            }

            locationFilter.value = filterValue;
            locationFilter.dispatchEvent(new Event('change'));
        }
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.AnatomyGuide = AnatomyGuide;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnatomyGuide;
}
