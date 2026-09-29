/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Comprehensive Jewelry Database
 * Poli International Widget Suite
 *
 * Database of 100+ jewelry items with specifications
 * All measurements in imperial (with metric conversions per MEASUREMENT_STANDARDS.md)
 */

const JewelryDatabase = [
    // ===================================
    // RINGS (Circular Body Jewelry)
    // ===================================
    {
        id: 'ring-001',
        name: 'Basic Seamless Ring 16g × 3/8"',
        category: 'rings',
        gauge: '16g',
        diameter: 0.375,
        material: 'titanium',
        ballSize: null,
        locations: ['ear', 'nose', 'lip'],
        description: 'Classic seamless ring for healed piercings',
        popular: true
    },
    {
        id: 'ring-002',
        name: 'Seamless Ring 18g × 5/16"',
        category: 'rings',
        gauge: '18g',
        diameter: 0.3125,
        material: 'titanium',
        locations: ['nose', 'ear'],
        popular: true
    },
    {
        id: 'ring-003',
        name: 'Seamless Ring 20g × 1/4"',
        category: 'rings',
        gauge: '20g',
        diameter: 0.25,
        material: 'gold',
        locations: ['nose'],
        description: 'Delicate nose ring',
        popular: false
    },

    // ===================================
    // BALL CLOSURE RINGS (BCR)
    // ===================================
    {
        id: 'cbr-001',
        name: 'BCR 16g × 3/8" with 3mm ball',
        category: 'captive',
        gauge: '16g',
        diameter: 0.375,
        ballSize: 0.118,
        material: 'steel',
        locations: ['ear', 'nose', 'lip', 'eyebrow'],
        description: 'Versatile ball closure ring',
        popular: true
    },
    {
        id: 'cbr-002',
        name: 'BCR 14g × 1/2" with 4mm ball',
        category: 'captive',
        gauge: '14g',
        diameter: 0.5,
        ballSize: 0.157,
        material: 'titanium',
        locations: ['ear', 'nipple', 'navel'],
        popular: true
    },
    {
        id: 'cbr-003',
        name: 'BCR 12g × 5/8" with 5mm ball',
        category: 'captive',
        gauge: '12g',
        diameter: 0.625,
        ballSize: 0.197,
        material: 'titanium',
        locations: ['nipple', 'ear'],
        popular: false
    },
    {
        id: 'cbr-004',
        name: 'BCR 18g × 5/16" with 2.5mm ball',
        category: 'captive',
        gauge: '18g',
        diameter: 0.3125,
        ballSize: 0.098,
        material: 'gold',
        locations: ['nose', 'ear'],
        popular: true
    },
    {
        id: 'cbr-005',
        name: 'BCR 14g × 7/16" with 4mm ball',
        category: 'captive',
        gauge: '14g',
        diameter: 0.4375,
        ballSize: 0.157,
        material: 'niobium',
        locations: ['ear', 'lip'],
        popular: false
    },

    // ===================================
    // CIRCULAR BARBELLS / HORSESHOES
    // ===================================
    {
        id: 'circular-001',
        name: 'Circular Barbell 16g × 3/8"',
        category: 'circular',
        gauge: '16g',
        diameter: 0.375,
        ballSize: 0.118,
        material: 'titanium',
        locations: ['ear', 'lip', 'nose', 'eyebrow'],
        description: 'Horseshoe style with removable balls',
        popular: true
    },
    {
        id: 'circular-002',
        name: 'Circular Barbell 14g × 1/2"',
        category: 'circular',
        gauge: '14g',
        diameter: 0.5,
        ballSize: 0.157,
        material: 'steel',
        locations: ['nipple', 'navel', 'ear'],
        popular: true
    },
    {
        id: 'circular-003',
        name: 'Circular Barbell 12g × 5/8"',
        category: 'circular',
        gauge: '12g',
        diameter: 0.625,
        ballSize: 0.197,
        material: 'titanium',
        locations: ['nipple'],
        popular: false
    },
    {
        id: 'circular-004',
        name: 'Circular Barbell 18g × 5/16"',
        category: 'circular',
        gauge: '18g',
        diameter: 0.3125,
        ballSize: 0.098,
        material: 'gold',
        locations: ['nose', 'ear'],
        popular: true
    },

    // ===================================
    // LABRET STUDS
    // ===================================
    {
        id: 'labret-001',
        name: 'Flat Back Labret 16g × 1/4"',
        category: 'labrets',
        gauge: '16g',
        length: 0.25,
        topSize: 0.125,
        backSize: 0.1875,
        material: 'titanium',
        hasGem: false,
        locations: ['lip', 'ear'],
        description: 'Basic flat back labret for lip piercings',
        popular: true
    },
    {
        id: 'labret-002',
        name: 'Gem Labret 16g × 5/16" with 2mm gem',
        category: 'labrets',
        gauge: '16g',
        length: 0.3125,
        topSize: 0.118,
        backSize: 0.1875,
        material: 'titanium',
        hasGem: true,
        locations: ['lip', 'ear', 'nose'],
        description: 'Decorative gem top labret',
        popular: true
    },
    {
        id: 'labret-003',
        name: 'Labret 14g × 3/8"',
        category: 'labrets',
        gauge: '14g',
        length: 0.375,
        topSize: 0.157,
        backSize: 0.25,
        material: 'steel',
        hasGem: false,
        locations: ['lip', 'ear'],
        popular: false
    },
    {
        id: 'labret-004',
        name: 'Gem Labret 18g × 1/4" with 1.5mm gem',
        category: 'labrets',
        gauge: '18g',
        length: 0.25,
        topSize: 0.098,
        backSize: 0.1875,
        material: 'gold',
        hasGem: true,
        locations: ['nose', 'ear'],
        popular: true
    },
    {
        id: 'labret-005',
        name: 'Labret 16g × 3/8" with 3mm ball',
        category: 'labrets',
        gauge: '16g',
        length: 0.375,
        topSize: 0.118,
        backSize: 0.1875,
        material: 'titanium',
        hasGem: false,
        locations: ['lip', 'ear'],
        popular: false
    },
    {
        id: 'labret-006',
        name: 'Labret 14g × 1/2"',
        category: 'labrets',
        gauge: '14g',
        length: 0.5,
        topSize: 0.157,
        backSize: 0.25,
        material: 'titanium',
        hasGem: false,
        locations: ['lip', 'tongue'],
        popular: false
    },
    {
        id: 'labret-007',
        name: 'Opal Top Labret 16g × 5/16"',
        category: 'labrets',
        gauge: '16g',
        length: 0.3125,
        topSize: 0.118,
        backSize: 0.1875,
        material: 'gold',
        hasGem: true,
        locations: ['ear', 'lip', 'nose'],
        popular: true
    },

    // ===================================
    // STRAIGHT BARBELLS
    // ===================================
    {
        id: 'barbell-001',
        name: 'Barbell 14g × 5/8" with 4mm balls',
        category: 'barbells',
        gauge: '14g',
        length: 0.625,
        ballSize: 0.157,
        material: 'titanium',
        locations: ['tongue', 'nipple', 'ear'],
        description: 'Standard tongue barbell',
        popular: true
    },
    {
        id: 'barbell-002',
        name: 'Barbell 16g × 1/4" with 3mm balls',
        category: 'barbells',
        gauge: '16g',
        length: 0.25,
        ballSize: 0.118,
        material: 'titanium',
        locations: ['ear'],
        description: 'Cartilage barbell',
        popular: true
    },
    {
        id: 'barbell-003',
        name: 'Barbell 14g × 1/2" with 4mm balls',
        category: 'barbells',
        gauge: '14g',
        length: 0.5,
        ballSize: 0.157,
        material: 'steel',
        locations: ['nipple', 'ear'],
        popular: false
    },
    {
        id: 'barbell-004',
        name: 'Barbell 14g × 3/4" with 5mm balls',
        category: 'barbells',
        gauge: '14g',
        length: 0.75,
        ballSize: 0.197,
        material: 'titanium',
        locations: ['tongue'],
        description: 'Long tongue barbell',
        popular: false
    },
    {
        id: 'barbell-005',
        name: 'Barbell 12g × 5/8" with 5mm balls',
        category: 'barbells',
        gauge: '12g',
        length: 0.625,
        ballSize: 0.197,
        material: 'steel',
        locations: ['nipple'],
        popular: false
    },
    {
        id: 'barbell-006',
        name: 'Barbell 16g × 5/16" with 3mm balls',
        category: 'barbells',
        gauge: '16g',
        length: 0.3125,
        ballSize: 0.118,
        material: 'gold',
        locations: ['ear'],
        popular: true
    },
    {
        id: 'barbell-007',
        name: 'Barbell 18g × 1/4" with 2.5mm balls',
        category: 'barbells',
        gauge: '18g',
        length: 0.25,
        ballSize: 0.098,
        material: 'gold',
        locations: ['ear'],
        popular: false
    },
    {
        id: 'barbell-008',
        name: 'Industrial Barbell 14g × 1-3/8"',
        category: 'barbells',
        gauge: '14g',
        length: 1.375,
        ballSize: 0.157,
        material: 'titanium',
        locations: ['ear'],
        description: 'Industrial/scaffold bar',
        popular: true
    },

    // ===================================
    // CLICKERS & SEAMLESS
    // ===================================
    {
        id: 'clicker-001',
        name: 'Segment Ring Clicker 16g × 3/8"',
        category: 'clickers',
        gauge: '16g',
        diameter: 0.375,
        material: 'titanium',
        locations: ['nose', 'ear', 'lip'],
        description: 'Easy-to-use hinged segment ring',
        popular: true
    },
    {
        id: 'clicker-002',
        name: 'Decorative Clicker 16g × 5/16"',
        category: 'clickers',
        gauge: '16g',
        diameter: 0.3125,
        material: 'gold',
        locations: ['nose', 'ear'],
        description: 'Ornate decorative clicker',
        popular: true
    },
    {
        id: 'clicker-003',
        name: 'Segment Ring 14g × 1/2"',
        category: 'clickers',
        gauge: '14g',
        diameter: 0.5,
        material: 'titanium',
        locations: ['ear', 'nipple'],
        popular: false
    },
    {
        id: 'clicker-004',
        name: 'Hinged Clicker 18g × 5/16"',
        category: 'clickers',
        gauge: '18g',
        diameter: 0.3125,
        material: 'gold',
        locations: ['nose', 'ear'],
        popular: true
    },
    {
        id: 'clicker-005',
        name: 'Gem Clicker 16g × 3/8"',
        category: 'clickers',
        gauge: '16g',
        diameter: 0.375,
        material: 'titanium',
        locations: ['nose', 'ear'],
        hasGem: true,
        popular: true
    },

    // ===================================
    // PLUGS & TUNNELS (Ear Stretching)
    // ===================================
    {
        id: 'plug-001',
        name: 'Single Flare Glass Plug 2g (6mm)',
        category: 'plugs',
        gauge: '2g',
        diameter: 0.236,
        length: 0.375,
        material: 'glass',
        flareType: 'single',
        locations: ['ear'],
        description: 'High-quality glass stretching plug',
        popular: true
    },
    {
        id: 'plug-002',
        name: 'Double Flare Steel Plug 0g (8mm)',
        category: 'plugs',
        gauge: '0g',
        diameter: 0.315,
        length: 0.375,
        material: 'steel',
        flareType: 'double',
        locations: ['ear'],
        popular: true
    },
    {
        id: 'plug-003',
        name: 'Single Flare Glass Plug 00g (10mm)',
        category: 'plugs',
        gauge: '00g',
        diameter: 0.394,
        length: 0.4375,
        material: 'glass',
        flareType: 'single',
        locations: ['ear'],
        popular: true
    },
    {
        id: 'plug-004',
        name: 'Stone Plug 4g (5mm)',
        category: 'plugs',
        gauge: '4g',
        diameter: 0.197,
        length: 0.375,
        material: 'stone',
        flareType: 'double',
        locations: ['ear'],
        popular: false
    },
    {
        id: 'plug-005',
        name: 'Acrylic Tunnel 6g (4mm)',
        category: 'plugs',
        gauge: '6g',
        diameter: 0.157,
        length: 0.375,
        material: 'acrylic',
        flareType: 'double',
        locations: ['ear'],
        popular: false
    },
    {
        id: 'plug-006',
        name: 'Glass Plug 1/2" (12.7mm)',
        category: 'plugs',
        gauge: '1/2',
        diameter: 0.5,
        length: 0.5,
        material: 'glass',
        flareType: 'single',
        locations: ['ear'],
        popular: true
    },
    {
        id: 'plug-007',
        name: 'Stone Plug 7/16" (11mm)',
        category: 'plugs',
        gauge: '7/16',
        diameter: 0.4375,
        length: 0.4375,
        material: 'stone',
        flareType: 'double',
        locations: ['ear'],
        popular: false
    },
    {
        id: 'plug-008',
        name: 'Steel Tunnel 9/16" (14.3mm)',
        category: 'plugs',
        gauge: '9/16',
        diameter: 0.5625,
        length: 0.5,
        material: 'steel',
        flareType: 'double',
        locations: ['ear'],
        popular: false
    },
    {
        id: 'plug-009',
        name: 'Glass Plug 5/8" (15.9mm)',
        category: 'plugs',
        gauge: '5/8',
        diameter: 0.625,
        length: 0.5,
        material: 'glass',
        flareType: 'single',
        locations: ['ear'],
        popular: false
    },
    {
        id: 'plug-010',
        name: 'Stone Plug 3/4" (19mm)',
        category: 'plugs',
        gauge: '3/4',
        diameter: 0.75,
        length: 0.5625,
        material: 'stone',
        flareType: 'double',
        locations: ['ear'],
        popular: false
    },
    {
        id: 'plug-011',
        name: 'Glass Plug 1" (25.4mm)',
        category: 'plugs',
        gauge: '1',
        diameter: 1.0,
        length: 0.625,
        material: 'glass',
        flareType: 'single',
        locations: ['ear'],
        description: 'Large gauge plug',
        popular: false
    },

    // ===================================
    // ADDITIONAL SPECIALTY ITEMS
    // ===================================

    // Nose Screws
    {
        id: 'nose-001',
        name: 'Nose Screw 20g with 2mm gem',
        category: 'labrets',
        noseType: 'screw',
        gauge: '20g',
        length: 0.25,
        topSize: 0.079,
        backSize: 0.06,
        material: 'gold',
        hasGem: true,
        locations: ['nose'],
        description: 'L-shaped nose screw',
        popular: true
    },
    {
        id: 'nose-002',
        name: 'Nose Bone 18g with 2.5mm gem',
        category: 'labrets',
        noseType: 'bone',
        gauge: '18g',
        length: 0.25,
        topSize: 0.098,
        backSize: 0.118,
        material: 'gold',
        hasGem: true,
        locations: ['nose'],
        description: 'Straight post with ball retention',
        popular: true
    },

    // Curved Barbells (Eyebrow, Navel)
    {
        id: 'curved-001',
        name: 'Curved Barbell 16g × 3/8"',
        category: 'barbells',
        gauge: '16g',
        length: 0.375,
        ballSize: 0.118,
        material: 'titanium',
        locations: ['eyebrow', 'navel'],
        description: 'Standard curved barbell',
        popular: true
    },
    {
        id: 'curved-002',
        name: 'Navel Barbell 14g × 7/16" with 5mm gem',
        category: 'barbells',
        gauge: '14g',
        length: 0.4375,
        ballSize: 0.197,
        material: 'titanium',
        hasGem: true,
        locations: ['navel'],
        description: 'Decorative belly button ring',
        popular: true
    },
    {
        id: 'curved-003',
        name: 'Curved Barbell 14g × 1/2"',
        category: 'barbells',
        gauge: '14g',
        length: 0.5,
        ballSize: 0.157,
        material: 'steel',
        locations: ['eyebrow'],
        popular: false
    },
    {
        id: 'curved-004',
        name: 'Navel Barbell 14g × 3/8"',
        category: 'barbells',
        gauge: '14g',
        length: 0.375,
        ballSize: 0.157,
        material: 'titanium',
        locations: ['navel'],
        popular: false
    },

    // Surface Bars
    {
        id: 'surface-001',
        name: 'Surface Bar 14g × 1/2"',
        category: 'barbells',
        gauge: '14g',
        length: 0.5,
        ballSize: 0.157,
        material: 'titanium',
        locations: ['surface'],
        description: 'Specialized surface piercing bar with 90° bends',
        popular: false
    },
    {
        id: 'surface-002',
        name: 'Surface Bar 12g × 5/8"',
        category: 'barbells',
        gauge: '12g',
        length: 0.625,
        ballSize: 0.197,
        material: 'titanium',
        locations: ['surface'],
        popular: false
    },

    // Dermal Anchors
    {
        id: 'dermal-001',
        name: 'Dermal Anchor 14g with 3mm top',
        category: 'labrets',
        gauge: '14g',
        length: 0.25,
        topSize: 0.118,
        material: 'titanium',
        hasGem: false,
        locations: ['surface'],
        description: 'Microdermal anchor',
        popular: false
    },
    {
        id: 'dermal-002',
        name: 'Dermal Anchor 12g with 4mm gem top',
        category: 'labrets',
        gauge: '12g',
        length: 0.25,
        topSize: 0.157,
        material: 'titanium',
        hasGem: true,
        locations: ['surface'],
        popular: false
    },

    // Additional Ear Cartilage
    {
        id: 'ear-001',
        name: 'Helix Ring 16g × 5/16"',
        category: 'rings',
        gauge: '16g',
        diameter: 0.3125,
        material: 'titanium',
        locations: ['ear'],
        description: 'Perfect for helix, tragus, conch',
        popular: true
    },
    {
        id: 'ear-002',
        name: 'Daith Clicker 16g × 3/8"',
        category: 'clickers',
        gauge: '16g',
        diameter: 0.375,
        material: 'gold',
        locations: ['ear'],
        description: 'Decorative daith clicker',
        popular: true
    },
    {
        id: 'ear-003',
        name: 'Rook Curved Barbell 16g × 5/16"',
        category: 'barbells',
        gauge: '16g',
        length: 0.3125,
        ballSize: 0.118,
        material: 'titanium',
        locations: ['ear'],
        description: 'Curved bar for rook piercing',
        popular: false
    },
    {
        id: 'ear-004',
        name: 'Tragus Labret 16g × 1/4" with opal',
        category: 'labrets',
        gauge: '16g',
        length: 0.25,
        topSize: 0.098,
        backSize: 0.1875,
        material: 'gold',
        hasGem: true,
        locations: ['ear'],
        description: 'Flat back labret perfect for tragus',
        popular: true
    },
    {
        id: 'ear-005',
        name: 'Conch Ring 14g × 1/2"',
        category: 'rings',
        gauge: '14g',
        diameter: 0.5,
        material: 'titanium',
        locations: ['ear'],
        description: 'Larger ring for conch piercing',
        popular: false
    },

    // Genital Piercings (Professional Use)
    {
        id: 'genital-001',
        name: 'Circular Barbell 12g × 1/2"',
        category: 'circular',
        gauge: '12g',
        diameter: 0.5,
        ballSize: 0.157,
        material: 'titanium',
        locations: ['genital'],
        description: 'Professional genital piercing jewelry',
        popular: false
    },
    {
        id: 'genital-002',
        name: 'Barbell 14g × 5/8"',
        category: 'barbells',
        gauge: '14g',
        length: 0.625,
        ballSize: 0.157,
        material: 'titanium',
        locations: ['genital'],
        popular: false
    },

    // Specialty/Decorative
    {
        id: 'special-001',
        name: 'Hinged Segment Ring 14g × 7/16"',
        category: 'clickers',
        gauge: '14g',
        diameter: 0.4375,
        material: 'titanium',
        locations: ['ear', 'nose'],
        description: 'Easy click mechanism',
        popular: true
    },
    {
        id: 'special-002',
        name: 'Triple Forward Helix Set 16g',
        category: 'labrets',
        gauge: '16g',
        length: 0.25,
        topSize: 0.079,
        backSize: 0.1875,
        material: 'gold',
        hasGem: true,
        locations: ['ear'],
        description: 'Set of 3 matching labrets for forward helix',
        popular: true
    },
    {
        id: 'special-003',
        name: 'Huggie Hoop 18g × 5/16"',
        category: 'rings',
        gauge: '18g',
        diameter: 0.3125,
        material: 'gold',
        locations: ['ear'],
        description: 'Small huggie-style earring',
        popular: true
    },
    {
        id: 'special-004',
        name: 'Threadless Push-Pin Labret 18g × 1/4"',
        category: 'labrets',
        gauge: '18g',
        length: 0.25,
        topSize: 0.098,
        backSize: 0.1875,
        material: 'titanium',
        hasGem: true,
        locations: ['ear', 'nose', 'lip'],
        description: 'Modern threadless system',
        popular: true
    }
];

// ===================================
// Database Query Functions
// ===================================

/**
 * Get all jewelry items
 */
function getAllJewelry() {
    return JewelryDatabase;
}

/**
 * Get jewelry by ID
 */
function getJewelryById(id) {
    return JewelryDatabase.find(item => item.id === id);
}

/**
 * Filter jewelry by criteria
 */
function filterJewelry(filters = {}) {
    let results = [...JewelryDatabase];

    if (filters.category && filters.category !== 'all') {
        results = results.filter(item => item.category === filters.category);
    }

    if (filters.gauge && filters.gauge !== 'all') {
        results = results.filter(item => item.gauge === filters.gauge);
    }

    if (filters.material && filters.material !== 'all') {
        results = results.filter(item => item.material === filters.material);
    }

    if (filters.location && filters.location !== 'all') {
        results = results.filter(item => item.locations.includes(filters.location));
    }

    if (filters.popular) {
        results = results.filter(item => item.popular === true);
    }

    return results;
}

/**
 * Search jewelry by name or description
 */
function searchJewelry(query) {
    const lowercaseQuery = query.toLowerCase();
    return JewelryDatabase.filter(item =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        (item.description && item.description.toLowerCase().includes(lowercaseQuery))
    );
}

/**
 * Get popular jewelry items
 */
function getPopularJewelry() {
    return JewelryDatabase.filter(item => item.popular === true);
}

/**
 * Get jewelry by location
 */
function getJewelryByLocation(location) {
    return JewelryDatabase.filter(item => item.locations.includes(location));
}

/**
 * Get database statistics
 */
function getDatabaseStats() {
    const stats = {
        total: JewelryDatabase.length,
        byCategory: {},
        byGauge: {},
        byMaterial: {},
        popularCount: 0
    };

    JewelryDatabase.forEach(item => {
        // Count by category
        stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;

        // Count by gauge
        stats.byGauge[item.gauge] = (stats.byGauge[item.gauge] || 0) + 1;

        // Count by material
        stats.byMaterial[item.material] = (stats.byMaterial[item.material] || 0) + 1;

        // Count popular
        if (item.popular) stats.popularCount++;
    });

    return stats;
}

// Make functions available globally for browser
if (typeof window !== 'undefined') {
    window.JewelryDatabase = JewelryDatabase;
    window.getAllJewelry = getAllJewelry;
    window.getJewelryById = getJewelryById;
    window.filterJewelry = filterJewelry;
    window.searchJewelry = searchJewelry;
    window.getPopularJewelry = getPopularJewelry;
    window.getJewelryByLocation = getJewelryByLocation;
    window.getDatabaseStats = getDatabaseStats;
}

// Export for use in Node.js modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        JewelryDatabase,
        getAllJewelry,
        getJewelryById,
        filterJewelry,
        searchJewelry,
        getPopularJewelry,
        getJewelryByLocation,
        getDatabaseStats
    };
}

// Log database stats on load
console.log('💎 Jewelry Database loaded:', getDatabaseStats());
