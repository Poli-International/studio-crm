/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Main JavaScript Controller
 * Poli International Widget Suite
 *
 * Handles:
 * - Tab navigation
 * - Global initialization
 * - Event coordination between modules
 * - Per MEASUREMENT_STANDARDS.md - All measurements in imperial + metric
 */

// ===================================
// Global State
// ===================================
const AppState = {
    currentTab: 'visualizer',
    isCalibrated: false,
    pixelsPerInch: 96, // Default DPI, will be calibrated
    selectedJewelry: null,
    comparisonItems: [],
    savedItems: [],
    userPreferences: {}
};

// ===================================
// Measurement Standards (per MEASUREMENT_STANDARDS.md)
// ===================================
const MeasurementStandards = {
    // Conversion constants
    MM_PER_INCH: 25.4,
    CM2_PER_SQ_IN: 6.4516,

    // European A-paper standards (ISO 216)
    paperSizes: {
        creditCard: { width: 85.6, height: 54, widthInch: 3.375, heightInch: 2.125, area: 7.17 },
        a5: { width: 148, height: 210, widthInch: 5.8, heightInch: 8.3, area: 48.15 },
        a4: { width: 210, height: 297, widthInch: 8.3, heightInch: 11.7, area: 97.09 },
        a3: { width: 297, height: 420, widthInch: 11.7, heightInch: 16.5, area: 193.05 }
    },

    /**
     * Format measurement with both imperial and metric
     * @param {number} imperial - Value in imperial units
     * @param {string} unit - Unit type ('in', 'sq in', 'fl oz')
     * @returns {string} Formatted measurement
     */
    formatMeasurement(imperial, unit) {
        // Guard against NaN, negative, null, undefined
        if (typeof imperial !== 'number' || isNaN(imperial) || imperial < 0) {
            return 'Invalid measurement';
        }
        let metric, metricUnit;

        switch(unit) {
            case 'in':
                metric = (imperial * this.MM_PER_INCH).toFixed(1);
                metricUnit = 'mm';
                break;
            case 'sq in':
                metric = (imperial * this.CM2_PER_SQ_IN).toFixed(1);
                metricUnit = 'cm²';
                break;
            case 'fl oz':
                metric = (imperial * 29.5735).toFixed(1);
                metricUnit = 'ml';
                break;
            default:
                return `${imperial} ${unit}`;
        }

        return `${imperial} ${unit} (${metric} ${metricUnit})`;
    },

    /**
     * Generate size comparisons to European paper standards
     * @param {number} areaInSquareInches - Area to compare
     * @returns {Array} Array of comparison objects
     */
    generateSizeComparisons(areaInSquareInches) {
        const { creditCard, a5, a4, a3 } = this.paperSizes;

        return [
            {
                name: 'Credit Card',
                ratio: (areaInSquareInches / creditCard.area).toFixed(1),
                size: `${creditCard.width}mm × ${creditCard.height}mm (${creditCard.widthInch}" × ${creditCard.heightInch}")`,
                area: `${(creditCard.area * this.CM2_PER_SQ_IN).toFixed(1)} cm² (${creditCard.area} sq in)`
            },
            {
                name: 'A5 Paper',
                ratio: (areaInSquareInches / a5.area).toFixed(2),
                size: `${a5.width}mm × ${a5.height}mm (${a5.widthInch}" × ${a5.heightInch}")`,
                area: `${(a5.area * this.CM2_PER_SQ_IN).toFixed(1)} cm² (${a5.area} sq in)`
            },
            {
                name: 'A4 Paper',
                ratio: (areaInSquareInches / a4.area).toFixed(2),
                size: `${a4.width}mm × ${a4.height}mm (${a4.widthInch}" × ${a4.heightInch}")`,
                area: `${(a4.area * this.CM2_PER_SQ_IN).toFixed(1)} cm² (${a4.area} sq in)`
            },
            {
                name: 'A3 Paper',
                ratio: (areaInSquareInches / a3.area).toFixed(2),
                size: `${a3.width}mm × ${a3.height}mm (${a3.widthInch}" × ${a3.heightInch}")`,
                area: `${(a3.area * this.CM2_PER_SQ_IN).toFixed(1)} cm² (${a3.area} sq in)`
            }
        ];
    }
};

// ===================================
// 1:1 Scale Rendering System
// ===================================
const ScaleRenderer = {
    /**
     * Get physical pixels per inch for this display
     * @returns {number} PPI value
     */
    getDevicePPI() {
        if (AppState.isCalibrated) {
            return AppState.pixelsPerInch;
        }

        // Auto-detect attempt
        const dppx = window.devicePixelRatio || 1;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        // Common display sizes
        const commonPPI = {
            '1920x1080': 96,
            '2560x1440': 109,
            '3840x2160': 163
        };

        const key = `${screenWidth}x${screenHeight}`;
        return commonPPI[key] || (96 * dppx);
    },

    /**
     * Convert inches to pixels at true 1:1 scale
     * @param {number} inches - Measurement in inches
     * @returns {number} Pixels
     */
    inchesToPixels(inches) {
        return inches * this.getDevicePPI();
    },

    /**
     * Convert millimeters to pixels at true 1:1 scale
     * @param {number} mm - Measurement in millimeters
     * @returns {number} Pixels
     */
    mmToPixels(mm) {
        const inches = mm / MeasurementStandards.MM_PER_INCH;
        return this.inchesToPixels(inches);
    },

    /**
     * Convert pixels to inches
     * @param {number} pixels - Pixel count
     * @returns {number} Inches
     */
    pixelsToInches(pixels) {
        return pixels / this.getDevicePPI();
    },

    /**
     * Render jewelry item on canvas at 1:1 scale
     * @param {HTMLCanvasElement} canvas - Target canvas
     * @param {Object} jewelry - Jewelry item from database
     * @param {Object} options - Rendering options
     */
    renderJewelry(canvas, jewelry, options = {}) {
        const ctx = canvas.getContext('2d');
        const {
            showRuler = false,
            showLabels = true,
            rotation = 0,
            opacity = 1
        } = options;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();
        ctx.globalAlpha = opacity;

        // Translate to center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply rotation
        if (rotation) {
            ctx.rotate((rotation * Math.PI) / 180);
        }

        // Render based on jewelry type
        switch (jewelry.category) {
            case 'rings':
            case 'captive':
            case 'clickers':
                this.renderCircularJewelry(ctx, jewelry);
                break;
            case 'circular':
                this.renderCircularBarbell(ctx, jewelry);
                break;
            case 'barbells':
                if (this.isSurfaceBar(jewelry)) {
                    this.renderSurfaceBar(ctx, jewelry);
                } else if (this.isCurvedBarbell(jewelry)) {
                    this.renderCurvedBarbell(ctx, jewelry);
                } else {
                    this.renderBarbell(ctx, jewelry);
                }
                break;
            case 'labrets':
                this.renderLabret(ctx, jewelry);
                break;
            case 'plugs':
                if (this.isTunnel(jewelry)) {
                    this.renderTunnel(ctx, jewelry);
                } else {
                    this.renderPlug(ctx, jewelry);
                }
                break;
            default:
                this.renderGenericJewelry(ctx, jewelry);
        }

        // Restore context state
        ctx.restore();

        // Add labels if requested
        if (showLabels) {
            this.addMeasurementLabels(ctx, jewelry, canvas);
        }
    },

    /**
     * Render circular jewelry (rings, BCRs, clickers)
     */
    renderCircularJewelry(ctx, jewelry) {
        const diameterInches = jewelry.diameter || 0.5;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);

        const outerRadius = this.inchesToPixels(diameterInches / 2);
        const ringThickness = this.inchesToPixels(gaugeInches);

        // Main ring
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
        ctx.lineWidth = ringThickness;
        ctx.strokeStyle = this.getJewelryColor(jewelry.material);
        ctx.stroke();

        // Add ball/gem if specified
        if (jewelry.ballSize) {
            const ballRadius = this.inchesToPixels(jewelry.ballSize / 2);
            ctx.beginPath();
            ctx.arc(0, -outerRadius, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.getJewelryColor(jewelry.material);
            ctx.fill();
        }
    },

    /**
     * Render circular barbell (horseshoe) - open circular with two balls
     */
    renderCircularBarbell(ctx, jewelry) {
        const diameterInches = jewelry.diameter || 0.5;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);
        const ballSize = jewelry.ballSize || 0.125;

        const radius = this.inchesToPixels(diameterInches / 2);
        const thickness = this.inchesToPixels(gaugeInches);
        const ballRadius = this.inchesToPixels(ballSize / 2);

        const color = this.getJewelryColor(jewelry.material);

        // Draw horseshoe (open arc) - opening at bottom
        ctx.beginPath();
        // Arc from 45 degrees to 315 degrees (leaving gap at bottom)
        ctx.arc(0, 0, radius, Math.PI * 0.25, Math.PI * 1.75);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Calculate ball positions at the ends of the arc
        // Left ball (at 45 degrees)
        const leftAngle = Math.PI * 0.25;
        const leftX = Math.cos(leftAngle) * radius;
        const leftY = Math.sin(leftAngle) * radius;

        ctx.beginPath();
        ctx.arc(leftX, leftY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Right ball (at 315 degrees)
        const rightAngle = Math.PI * 1.75;
        const rightX = Math.cos(rightAngle) * radius;
        const rightY = Math.sin(rightAngle) * radius;

        ctx.beginPath();
        ctx.arc(rightX, rightY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    },

    /**
     * Render barbell
     */
    renderBarbell(ctx, jewelry) {
        const lengthInches = jewelry.length || 0.5;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);
        const ballSize = jewelry.ballSize || 0.125;

        const length = this.inchesToPixels(lengthInches);
        const thickness = this.inchesToPixels(gaugeInches);
        const ballRadius = this.inchesToPixels(ballSize / 2);

        const color = this.getJewelryColor(jewelry.material);

        // Bar
        ctx.beginPath();
        ctx.moveTo(0, -length / 2);
        ctx.lineTo(0, length / 2);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.stroke();

        // Top ball
        ctx.beginPath();
        ctx.arc(0, -length / 2, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Bottom ball
        ctx.beginPath();
        ctx.arc(0, length / 2, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    },

    /**
     * Curved barbells (eyebrow, navel, rook) share category 'barbells' with
     * straight bars, so detect them from the item name/id.
     */
    isCurvedBarbell(jewelry) {
        return /curved|navel|rook|banana/i.test((jewelry.name || '') + ' ' + (jewelry.id || ''));
    },

    /**
     * Render curved barbell - gently arced bar with a ball on each end.
     * Endpoints stay length apart (the wearable length), bar bows to one side.
     */
    renderCurvedBarbell(ctx, jewelry) {
        const lengthInches = jewelry.length || 0.5;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);
        const ballSize = jewelry.ballSize || 0.125;

        const length = this.inchesToPixels(lengthInches);
        const thickness = this.inchesToPixels(gaugeInches);
        const ballRadius = this.inchesToPixels(ballSize / 2);

        const color = this.getJewelryColor(jewelry.material);

        // Circle through both ball centers (0, -L/2) and (0, L/2), bulging right
        const offset = length * 0.6;
        const radius = Math.sqrt(offset * offset + (length / 2) * (length / 2));
        const startAngle = Math.atan2(-length / 2, offset);
        const endAngle = Math.atan2(length / 2, offset);

        ctx.beginPath();
        ctx.arc(-offset, 0, radius, startAngle, endAngle);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Top ball
        ctx.beginPath();
        ctx.arc(0, -length / 2, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Bottom ball (slightly larger on navel bananabells with a gem)
        ctx.beginPath();
        ctx.arc(0, length / 2, jewelry.hasGem ? ballRadius * 1.25 : ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = jewelry.hasGem ? '#0EA5E9' : color;
        ctx.fill();
    },

    /**
     * Surface bars share category 'barbells' but have a distinctive 'staple'
     * shape: a flat bar sitting under the skin with two 90-degree bent risers,
     * a ball on top of each. Detect from the item name/id.
     */
    isSurfaceBar(jewelry) {
        return /surface/i.test((jewelry.name || '') + ' ' + (jewelry.id || ''));
    },

    /**
     * Render surface bar - staple shape. The straight span (jewelry.length) runs
     * vertically like the flat bar under the skin; both ends bend 90 degrees to
     * the same side into short risers, each capped with a ball.
     */
    renderSurfaceBar(ctx, jewelry) {
        const lengthInches = jewelry.length || 0.5;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);
        const ballSize = jewelry.ballSize || 0.125;

        const length = this.inchesToPixels(lengthInches);
        const thickness = this.inchesToPixels(gaugeInches);
        const ballRadius = this.inchesToPixels(ballSize / 2);

        // Riser height (the 90-degree bent legs) - proportional but capped so it
        // stays a short right-angle bend rather than a second long bar.
        const rise = Math.min(length * 0.28, this.inchesToPixels(0.16));

        const color = this.getJewelryColor(jewelry.material);

        // Staple: ball riser -> flat bar -> riser ball, all sharp 90-degree bends
        ctx.beginPath();
        ctx.moveTo(rise, -length / 2);
        ctx.lineTo(0, -length / 2);
        ctx.lineTo(0, length / 2);
        ctx.lineTo(rise, length / 2);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'butt';
        ctx.stroke();

        // Balls on top of each riser
        ctx.beginPath();
        ctx.arc(rise, -length / 2, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rise, length / 2, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    },

    /**
     * Render labret stud - flat disc on one side, or nose stud shapes
     */
    renderLabret(ctx, jewelry) {
        // Debug: This should log for ALL labrets, nose screws, and dermal anchors
        console.log(`🔧 Rendering labret: ${jewelry.name} (${jewelry.id})`);

        // Check if this is a nose stud with special shape
        if (jewelry.noseType === 'screw') {
            this.renderNoseScrew(ctx, jewelry);
            return;
        } else if (jewelry.noseType === 'bone') {
            this.renderNoseBone(ctx, jewelry);
            return;
        }

        const lengthInches = jewelry.length || 0.25;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);
        const topSize = jewelry.topSize || 0.125;
        const backSize = jewelry.backSize || 0.1875;

        const length = this.inchesToPixels(lengthInches);
        const thickness = this.inchesToPixels(gaugeInches);
        const topRadius = this.inchesToPixels(topSize / 2);
        const backRadius = this.inchesToPixels(backSize / 2);

        const color = this.getJewelryColor(jewelry.material);

        // Post
        ctx.beginPath();
        ctx.moveTo(0, -length / 2);
        ctx.lineTo(0, length / 2);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.stroke();

        // Top (decorative ball or gem)
        ctx.beginPath();
        ctx.arc(0, -length / 2, topRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Add decorative sparkle for gems
        if (jewelry.hasGem) {
            ctx.beginPath();
            ctx.arc(0, -length / 2, topRadius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#0EA5E9'; // Gem blue
            ctx.fill();
        }

        // Flat back disc (thin ellipse to show it's flat, not a ball)
        const backY = length / 2;
        const discThickness = backRadius * 0.35; // Thin disc, not a ball

        // Draw flat disc as ellipse (wide but thin)
        ctx.beginPath();
        ctx.ellipse(0, backY, backRadius, discThickness, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Add gradient to show depth/roundedness of disc edge
        const gradient = ctx.createRadialGradient(
            0, backY - discThickness * 0.3, 0,
            0, backY, backRadius
        );
        gradient.addColorStop(0, this.adjustColorBrightness(color, 30));
        gradient.addColorStop(0.7, color);
        gradient.addColorStop(1, this.adjustColorBrightness(color, -20));

        ctx.beginPath();
        ctx.ellipse(0, backY, backRadius, discThickness, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add edge line to emphasize flatness
        ctx.beginPath();
        ctx.ellipse(0, backY, backRadius * 0.85, discThickness * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = this.adjustColorBrightness(color, -30);
        ctx.lineWidth = Math.max(0.5, discThickness * 0.15);
        ctx.stroke();
    },

    /**
     * Render nose screw (L-shaped post)
     */
    renderNoseScrew(ctx, jewelry) {
        const lengthInches = jewelry.length || 0.25;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);
        const topSize = jewelry.topSize || 0.08;
        const bendLength = lengthInches * 0.4; // L-bend is about 40% of total length

        const length = this.inchesToPixels(lengthInches);
        const thickness = this.inchesToPixels(gaugeInches);
        const topRadius = this.inchesToPixels(topSize / 2);
        const bendSize = this.inchesToPixels(bendLength);

        const color = this.getJewelryColor(jewelry.material);

        // Draw L-shaped post
        ctx.beginPath();
        // Vertical part (from top to bend point)
        ctx.moveTo(0, -length / 2);
        ctx.lineTo(0, length / 2 - bendSize);
        // Horizontal part (the L-bend going to the right)
        ctx.lineTo(bendSize, length / 2 - bendSize);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Top decorative ball or gem
        ctx.beginPath();
        ctx.arc(0, -length / 2, topRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Add gem sparkle if present
        if (jewelry.hasGem) {
            ctx.beginPath();
            ctx.arc(0, -length / 2, topRadius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#0EA5E9'; // Gem blue
            ctx.fill();
        }

        // Small ball at end of L-bend (retention)
        const endBallRadius = topRadius * 0.6;
        ctx.beginPath();
        ctx.arc(bendSize, length / 2 - bendSize, endBallRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    },

    /**
     * Render nose bone (straight post with ball at end)
     */
    renderNoseBone(ctx, jewelry) {
        const lengthInches = jewelry.length || 0.25;
        const gaugeInches = this.gaugeToInches(jewelry.gauge);
        const topSize = jewelry.topSize || 0.08;
        const backSize = jewelry.backSize || 0.118;

        const length = this.inchesToPixels(lengthInches);
        const thickness = this.inchesToPixels(gaugeInches);
        const topRadius = this.inchesToPixels(topSize / 2);
        const backRadius = this.inchesToPixels(backSize / 2);

        const color = this.getJewelryColor(jewelry.material);

        // Straight post
        ctx.beginPath();
        ctx.moveTo(0, -length / 2);
        ctx.lineTo(0, length / 2);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.stroke();

        // Top decorative ball or gem
        ctx.beginPath();
        ctx.arc(0, -length / 2, topRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Add gem sparkle if present
        if (jewelry.hasGem) {
            ctx.beginPath();
            ctx.arc(0, -length / 2, topRadius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#0EA5E9'; // Gem blue
            ctx.fill();
        }

        // Bottom retention ball (larger than post, smaller than top)
        ctx.beginPath();
        ctx.arc(0, length / 2, backRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Add shading to show it's a ball
        const gradient = ctx.createRadialGradient(
            0, length / 2 - backRadius * 0.3, 0,
            0, length / 2, backRadius
        );
        gradient.addColorStop(0, this.adjustColorBrightness(color, 30));
        gradient.addColorStop(1, color);
        ctx.beginPath();
        ctx.arc(0, length / 2, backRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    },

    /**
     * Helper function to adjust color brightness
     */
    adjustColorBrightness(color, amount) {
        // Simple brightness adjustment for hex colors
        if (color.startsWith('#')) {
            let hex = color.replace('#', '');
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);

            r = Math.max(0, Math.min(255, r + amount));
            g = Math.max(0, Math.min(255, g + amount));
            b = Math.max(0, Math.min(255, b + amount));

            return '#' +
                r.toString(16).padStart(2, '0') +
                g.toString(16).padStart(2, '0') +
                b.toString(16).padStart(2, '0');
        }
        return color;
    },

    /**
     * Render plug/tunnel with concave (flared) sides
     */
    renderPlug(ctx, jewelry) {
        const diameterInches = jewelry.diameter || 0.5;
        const lengthInches = jewelry.length || 0.375;

        const diameter = this.inchesToPixels(diameterInches);
        const length = this.inchesToPixels(lengthInches);
        const flareType = jewelry.flareType || 'double';

        const color = this.getJewelryColor(jewelry.material);

        // Calculate dimensions
        const bodyRadius = diameter / 2;
        const flareRadius = bodyRadius * 1.35; // Flares are wider
        const flareHeight = Math.max(4, bodyRadius * 0.3);
        const concaveDepth = bodyRadius * 0.2; // How much the sides curve in

        // Draw main body with concave sides (saddle shape)
        ctx.fillStyle = color;
        ctx.beginPath();

        // Start at top left of body
        ctx.moveTo(-bodyRadius, -length / 2);

        // Left side with concave curve (curves inward)
        ctx.quadraticCurveTo(
            -bodyRadius + concaveDepth, 0, // Control point - curves inward
            -bodyRadius, length / 2 // End point
        );

        // Bottom edge
        ctx.lineTo(bodyRadius, length / 2);

        // Right side with concave curve (curves inward)
        ctx.quadraticCurveTo(
            bodyRadius - concaveDepth, 0, // Control point - curves inward
            bodyRadius, -length / 2 // End point
        );

        // Top edge
        ctx.lineTo(-bodyRadius, -length / 2);
        ctx.closePath();
        ctx.fill();

        // Add shading gradient to show cylindrical form
        const gradient = ctx.createLinearGradient(-bodyRadius, 0, bodyRadius, 0);
        gradient.addColorStop(0, 'rgba(0,0,0,0.25)');
        gradient.addColorStop(0.3, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(0.7, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.25)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-bodyRadius, -length / 2);
        ctx.quadraticCurveTo(-bodyRadius + concaveDepth, 0, -bodyRadius, length / 2);
        ctx.lineTo(bodyRadius, length / 2);
        ctx.quadraticCurveTo(bodyRadius - concaveDepth, 0, bodyRadius, -length / 2);
        ctx.lineTo(-bodyRadius, -length / 2);
        ctx.closePath();
        ctx.fill();

        // Draw top flare (all plugs have at least one flare)
        this.drawFlare(ctx, 0, -length / 2, flareRadius, flareHeight, color, true);

        // Draw bottom flare (only for double flare)
        if (flareType === 'double') {
            this.drawFlare(ctx, 0, length / 2, flareRadius, flareHeight, color, false);
        }
    },

    /**
     * Tunnels share category 'plugs' but are hollow - you can see through the
     * centre. Detect from the item name/id.
     */
    isTunnel(jewelry) {
        return /tunnel/i.test((jewelry.name || '') + ' ' + (jewelry.id || ''));
    },

    /**
     * Render tunnel - like a plug but hollow: two side walls with an open,
     * see-through bore and ring-shaped (annular) flares instead of solid discs.
     */
    renderTunnel(ctx, jewelry) {
        const diameterInches = jewelry.diameter || 0.5;
        const lengthInches = jewelry.length || 0.375;

        const diameter = this.inchesToPixels(diameterInches);
        const length = this.inchesToPixels(lengthInches);
        const flareType = jewelry.flareType || 'double';

        const color = this.getJewelryColor(jewelry.material);

        const bodyRadius = diameter / 2;
        const flareRadius = bodyRadius * 1.35;
        const flareHeight = Math.max(4, bodyRadius * 0.3);
        const concaveDepth = bodyRadius * 0.2;
        // Wall thickness - the rest of the bore is open.
        const wall = Math.max(3, bodyRadius * 0.22);
        const boreRadius = bodyRadius - wall;

        // Left wall (outer concave edge -> inner bore edge)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-bodyRadius, -length / 2);
        ctx.quadraticCurveTo(-bodyRadius + concaveDepth, 0, -bodyRadius, length / 2);
        ctx.lineTo(-boreRadius, length / 2);
        ctx.quadraticCurveTo(-boreRadius + concaveDepth, 0, -boreRadius, -length / 2);
        ctx.closePath();
        ctx.fill();

        // Right wall (mirror)
        ctx.beginPath();
        ctx.moveTo(bodyRadius, -length / 2);
        ctx.quadraticCurveTo(bodyRadius - concaveDepth, 0, bodyRadius, length / 2);
        ctx.lineTo(boreRadius, length / 2);
        ctx.quadraticCurveTo(boreRadius - concaveDepth, 0, boreRadius, -length / 2);
        ctx.closePath();
        ctx.fill();

        // Open bore in the centre - dark channel to read as see-through depth
        const bore = ctx.createLinearGradient(-boreRadius, 0, boreRadius, 0);
        bore.addColorStop(0, 'rgba(0,0,0,0.55)');
        bore.addColorStop(0.5, 'rgba(0,0,0,0.2)');
        bore.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = bore;
        ctx.fillRect(-boreRadius, -length / 2, boreRadius * 2, length);

        // Ring-shaped flares (top always, bottom for double flare)
        this.drawFlareRing(ctx, 0, -length / 2, flareRadius, boreRadius, flareHeight, color, true);
        if (flareType === 'double') {
            this.drawFlareRing(ctx, 0, length / 2, flareRadius, boreRadius, flareHeight, color, false);
        }
    },

    /**
     * Draw an annular (ring) flare for tunnels - solid disc with the bore
     * opening cut through as a dark ellipse.
     */
    drawFlareRing(ctx, x, y, outerRadius, boreRadius, height, color, isTop) {
        const offset = isTop ? -height / 2 : height / 2;

        // Outer flare disc
        const highlight = ctx.createRadialGradient(x, y + offset - height * 0.2, 0, x, y + offset, outerRadius);
        highlight.addColorStop(0, this.adjustColorBrightness(color, 30));
        highlight.addColorStop(0.7, color);
        highlight.addColorStop(1, this.adjustColorBrightness(color, -20));
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.ellipse(x, y + offset, outerRadius, height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bore opening - dark ellipse showing the hole through the tunnel
        const openingHeight = (height / 2) * (boreRadius / outerRadius);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.ellipse(x, y + offset, boreRadius, openingHeight, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner rim for depth
        ctx.strokeStyle = this.adjustColorBrightness(color, -30);
        ctx.lineWidth = Math.max(1, height * 0.12);
        ctx.beginPath();
        ctx.ellipse(x, y + offset, boreRadius, openingHeight, 0, 0, Math.PI * 2);
        ctx.stroke();
    },

    /**
     * Draw a flare disc for plugs
     */
    drawFlare(ctx, x, y, radius, height, color, isTop) {
        const offset = isTop ? -height / 2 : height / 2;

        // Main flare disc
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y + offset, radius, height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlight on flare
        const highlight = ctx.createRadialGradient(x, y + offset - height * 0.2, 0, x, y + offset, radius);
        highlight.addColorStop(0, this.adjustColorBrightness(color, 30));
        highlight.addColorStop(0.7, color);
        highlight.addColorStop(1, this.adjustColorBrightness(color, -20));
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.ellipse(x, y + offset, radius, height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Edge ring for depth
        ctx.strokeStyle = this.adjustColorBrightness(color, -30);
        ctx.lineWidth = Math.max(1, height * 0.15);
        ctx.beginPath();
        ctx.ellipse(x, y + offset, radius * 0.85, height / 2 * 0.85, 0, 0, Math.PI * 2);
        ctx.stroke();
    },

    /**
     * Generic jewelry renderer (fallback)
     */
    renderGenericJewelry(ctx, jewelry) {
        // Simple representation
        const size = this.inchesToPixels(0.25);
        ctx.fillStyle = this.getJewelryColor(jewelry.material);
        ctx.fillRect(-size / 2, -size / 2, size, size);
    },

    /**
     * Convert gauge to inches
     */
    gaugeToInches(gauge) {
        const gaugeTable = {
            '20g': 0.032, '18g': 0.040, '16g': 0.047, '14g': 0.063,
            '12g': 0.079, '10g': 0.094, '8g': 0.126, '6g': 0.157,
            '4g': 0.197, '2g': 0.236, '0g': 0.315, '00g': 0.394,
            '7/16': 0.4375, '1/2': 0.5, '9/16': 0.5625, '5/8': 0.625,
            '3/4': 0.75, '7/8': 0.875, '1': 1.0
        };
        return gaugeTable[gauge] || 0.063; // Default to 14g
    },

    /**
     * Get jewelry color based on material
     */
    getJewelryColor(material) {
        const colors = {
            'titanium': '#C0C0C0',
            'steel': '#A8A8A8',
            'gold': '#FFD700',
            'niobium': '#B0B0B0',
            'glass': '#E8F4F8',
            'stone': '#8B7355',
            'acrylic': '#E0E0E0'
        };

        return colors[material?.toLowerCase()] || '#C0C0C0';
    },

    /**
     * Add measurement labels to canvas
     */
    addMeasurementLabels(ctx, jewelry, canvas) {
        ctx.save();
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'center';

        // Add gauge label
        const gaugeMM = (this.gaugeToInches(jewelry.gauge) * MeasurementStandards.MM_PER_INCH).toFixed(1);
        const gaugeText = `${jewelry.gauge} (${gaugeMM}mm)`;
        ctx.fillText(gaugeText, canvas.width / 2, canvas.height - 10);

        // Add size label (diameter or length)
        if (jewelry.diameter) {
            const diameterMM = (jewelry.diameter * MeasurementStandards.MM_PER_INCH).toFixed(1);
            const sizeText = `${jewelry.diameter}" (${diameterMM}mm)`;
            ctx.fillText(sizeText, canvas.width / 2, 20);
        } else if (jewelry.length) {
            const lengthMM = (jewelry.length * MeasurementStandards.MM_PER_INCH).toFixed(1);
            const sizeText = `${jewelry.length}" (${lengthMM}mm)`;
            ctx.fillText(sizeText, canvas.width / 2, 20);
        }

        ctx.restore();
    }
};

// ===================================
// Tab Navigation
// ===================================
function initTabNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active states
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            const targetEl = document.getElementById(`tab-${targetTab}`);
            if (targetEl) {
                targetEl.classList.add('active');
            }

            // Update app state
            AppState.currentTab = targetTab;

            // Specific tab render hooks
            if (targetTab === 'fit-card' && typeof FitCardModule !== 'undefined') {
                FitCardModule.render();
            } else if (targetTab === 'curved-barbell' && typeof CurvedBarbellCalculator !== 'undefined') {
                CurvedBarbellCalculator.calculate();
            } else if (targetTab === 'industrial-barbell' && typeof IndustrialBarbellCalculator !== 'undefined') {
                IndustrialBarbellCalculator.calculate();
            } else if (targetTab === 'photo-measure' && typeof PhotoMeasureModule !== 'undefined') {
                PhotoMeasureModule.onTabActivated();
            } else if (targetTab === 'collection' && typeof JewelleryCollectionModule !== 'undefined') {
                JewelleryCollectionModule.render();
            }

            console.log(`Switched to tab: ${targetTab}`);
        });
    });

    window.switchTab = function(targetTab) {
        const navTab = document.querySelector(`.nav-tab[data-tab="${targetTab}"]`);
        if (navTab) {
            navTab.click();
        }
    };
}

// ===================================
// Local Storage Management
// ===================================
const StorageManager = {
    STORAGE_KEY: 'poliJewelryVisualizer',

    saveState() {
        const state = {
            isCalibrated: AppState.isCalibrated,
            pixelsPerInch: AppState.pixelsPerInch,
            savedItems: AppState.savedItems,
            userPreferences: AppState.userPreferences,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
            console.log('State saved successfully');
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    },

    loadState() {
        let loaded = false;
        try {
            // First check dedicated screen calibration storage
            const calRaw = localStorage.getItem('poli_screen_calibration');
            if (calRaw) {
                const calData = JSON.parse(calRaw);
                if (calData && calData.isCalibrated === true && typeof calData.pixelsPerInch === 'number') {
                    AppState.isCalibrated = true;
                    AppState.pixelsPerInch = calData.pixelsPerInch;
                    loaded = true;
                }
            }

            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const state = JSON.parse(saved);
                if (!loaded) {
                    AppState.isCalibrated = Boolean(state.isCalibrated);
                    AppState.pixelsPerInch = state.pixelsPerInch || 96;
                }
                AppState.savedItems = state.savedItems || [];
                AppState.userPreferences = state.userPreferences || {};
                console.log('State loaded successfully. Calibrated:', AppState.isCalibrated);
                return true;
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
        return loaded;
    },

    clearState() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('State cleared');
        } catch (error) {
            console.error('Failed to clear state:', error);
        }
    }
};

// ===================================
// Dark Mode Manager
// ===================================
const DarkModeManager = {
    init() {
        // Load saved theme preference
        // Inside the site iframe the head bridge owns the theme; standalone defaults to dark
        const savedTheme = (window.self !== window.top)
            ? (document.documentElement.getAttribute('data-theme') || 'dark')
            : (localStorage.getItem('theme') || 'dark');
        this.setTheme(savedTheme, false);

        // Bind toggle button
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        console.log('🌓 Dark Mode initialized:', savedTheme);
    },

    setTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');

        // Update button icon
        const icon = document.querySelector('.dark-mode-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '☀️' : '◐';
        }

        // Save to localStorage
        if (save) {
            localStorage.setItem('theme', theme);
            console.log('🌓 Theme changed to:', theme);
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
};

// ===================================
// Embed Functionality
// ===================================
function showEmbedModal() {
    const modal = document.getElementById('embed-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Auto-select the code
        const textarea = document.getElementById('embed-code');
        if (textarea) {
            // It's a <code> element now, so we can't select() it like a textarea
            // but we can highlight it or just leave it
        }
    }
}

function closeEmbedModal() {
    const modal = document.getElementById('embed-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function copyEmbedCode() {
    const codeElement = document.getElementById('embed-code');
    if (codeElement) {
        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Show feedback
            const successMsg = document.getElementById('copy-success');
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 3000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
}

// Make functions globally available
window.showEmbedModal = showEmbedModal;
window.closeEmbedModal = closeEmbedModal;
window.copyEmbedCode = copyEmbedCode;

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Tool #7: Interactive Jewelry Size Visualizer - Initializing...');

    try {
        // Check database loaded
        if (typeof getAllJewelry === 'undefined') {
            console.error('❌ Database functions not loaded!');
            alert('Critical Error: Jewelry database failed to load.\n\nThe database.js file may not be loading properly. Please check:\n1. Is database.js in the js/ folder?\n2. Are there any errors in the browser console (F12)?\n3. Is your browser blocking JavaScript?');
            return;
        }
        console.log('✅ Database loaded');

        // Test database functions
        try {
            const testData = getAllJewelry();
            console.log(`✅ Database contains ${testData.length} items`);
        } catch (dbError) {
            console.error('❌ Database test failed:', dbError);
            alert(`Database Error: ${dbError.message}\n\nThe database loaded but cannot be accessed properly.`);
            return;
        }

        // Initialize i18n first
        if (typeof window.i18n !== 'undefined') {
            if (typeof window.i18n.init === 'function') {
                window.i18n.init();
            }
            if (typeof window.i18n.applyToDOM === 'function') {
                window.i18n.applyToDOM();
            }
            const currentLoc = (typeof window.i18n.getCurrentLocale === 'function')
                ? window.i18n.getCurrentLocale()
                : (typeof window.i18n.getLocale === 'function' ? window.i18n.getLocale() : (window.i18n.locale || 'en'));
            console.log('✅ i18n initialized:', currentLoc);
        }

        // Initialize dark mode
        DarkModeManager.init();
        console.log('✅ Dark mode initialized');

        // Load saved state
        StorageManager.loadState();
        console.log('✅ State loaded');

        // Initialize tab navigation
        initTabNavigation();
        console.log('✅ Tab navigation initialized');

        // Initialize calibration system
        if (typeof CalibrationSystem !== 'undefined') {
            CalibrationSystem.init();
            console.log('✅ Calibration system initialized');
        } else {
            console.warn('⚠️ CalibrationSystem not available');
        }

        // Initialize visualizer module
        if (typeof Visualizer !== 'undefined') {
            console.log('📦 Initializing Visualizer...');
            Visualizer.init();
            console.log('✅ Visualizer initialized');
        } else {
            console.error('❌ Visualizer not available');
            alert('Critical Error: Visualizer module failed to load.\n\nThe visualizer.js file may not be loading properly. Please check the browser console (F12) for details.');
            return;
        }

        // Initialize try-on module
        if (typeof TryOnModule !== 'undefined') {
            TryOnModule.init();
            console.log('✅ Try-on module initialized');
        } else {
            console.warn('⚠️ TryOnModule not available');
        }

        // Initialize comparison module
        if (typeof ComparisonModule !== 'undefined') {
            ComparisonModule.init();
            console.log('✅ Comparison module initialized');
        } else {
            console.warn('⚠️ ComparisonModule not available');
        }

        // Initialize anatomy module
        if (typeof AnatomyGuide !== 'undefined') {
            AnatomyGuide.init();
            console.log('✅ Anatomy guide initialized');
        } else {
            console.warn('⚠️ AnatomyGuide not available');
        }

        // Initialize clinical and material matrices
        if (typeof ClinicalMatricesModule !== 'undefined') {
            ClinicalMatricesModule.init();
            console.log('✅ Clinical & Material Matrices initialized');
        } else {
            console.warn('⚠️ ClinicalMatricesModule not available');
        }

        // Initialize curved barbell calculator
        if (typeof CurvedBarbellCalculator !== 'undefined') {
            CurvedBarbellCalculator.init();
            console.log('✅ Curved Barbell Calculator initialized');
        } else {
            console.warn('⚠️ CurvedBarbellCalculator not available');
        }

        // Initialize industrial barbell calculator
        if (typeof IndustrialBarbellCalculator !== 'undefined') {
            IndustrialBarbellCalculator.init();
            console.log('✅ Industrial Barbell Calculator initialized');
        } else {
            console.warn('⚠️ IndustrialBarbellCalculator not available');
        }

        // Initialize Fit Card module
        if (typeof FitCardModule !== 'undefined') {
            FitCardModule.init();
            console.log('✅ Fit Card module initialized');
        } else {
            console.warn('⚠️ FitCardModule not available');
        }

        // Initialize Photo Measurement module
        if (typeof PhotoMeasureModule !== 'undefined') {
            PhotoMeasureModule.init();
            console.log('✅ Photo Measurement module initialized');
        }

        // Initialize Jewellery Collection module
        if (typeof JewelleryCollectionModule !== 'undefined') {
            JewelleryCollectionModule.init();
            console.log('✅ Jewellery Collection module initialized');
        }

        // Handle direct hash navigation to tabs
        if (window.location.hash) {
            const hashTab = window.location.hash.replace('#', '');
            const targetNav = document.querySelector(`.nav-tab[data-tab="${hashTab}"]`);
            if (targetNav) {
                targetNav.click();
            }
        }

        // Initialize embed button
        const embedButton = document.getElementById('embed-button');
        if (embedButton) {
            embedButton.addEventListener('click', showEmbedModal);
            console.log('✅ Embed button initialized');
        }

        // Initialize modal close buttons
        const closeButtons = document.querySelectorAll('.modal__close, #embed-modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeEmbedModal);
        });

        // Initialize copy button
        const copyBtn = document.getElementById('copy-embed-code');
        if (copyBtn) {
            copyBtn.addEventListener('click', copyEmbedCode);
        }

        // Check if calibration is needed
        if (!AppState.isCalibrated) {
            // Show calibration banner
            const calibrationBanner = document.getElementById('calibration-banner');
            if (calibrationBanner) {
                calibrationBanner.style.display = 'block';
            }
        }

        console.log('✅ Tool #7 initialized successfully');
        console.log('📏 Current PPI:', ScaleRenderer.getDevicePPI());
        console.log('🎯 Calibrated:', AppState.isCalibrated);
        console.log('🌓 Theme:', DarkModeManager.getCurrentTheme());
    } catch (error) {
        console.error('❌ Initialization error:', error);
        console.error('Error stack:', error.stack);
        alert(`Failed to initialize tool.\n\nError: ${error.message}\n\nPlease check the browser console (press F12) for detailed error information.`);
    }
});

// Auto-save state before leaving
if (typeof window.addEventListener === 'function') {
    window.addEventListener('beforeunload', () => {
        StorageManager.saveState();
    });
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.AppState = AppState;
    window.MeasurementStandards = MeasurementStandards;
    window.ScaleRenderer = ScaleRenderer;
    window.StorageManager = StorageManager;
    window.DarkModeManager = DarkModeManager;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        MeasurementStandards,
        ScaleRenderer,
        StorageManager,
        DarkModeManager
    };
}
