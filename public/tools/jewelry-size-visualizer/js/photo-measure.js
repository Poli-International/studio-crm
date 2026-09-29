/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Photo Measurement Module (Requirement D)
 * Poli International Widget Suite
 *
 * Measures anatomical tissue spans in the browser using an ISO 85.60 mm bank card
 * placed in the same focal plane as a reference standard.
 *
 * Privacy:
 * Images are processed entirely within local browser memory on the user's device.
 * No photo or measurement data is ever uploaded or transmitted across any network.
 */

const PhotoMeasureModule = {
    canvas: null,
    ctx: null,
    image: null,
    points: {
        // Card reference points (85.60 mm long edge)
        cardA: { x: 80, y: 120 },
        cardB: { x: 320, y: 120 },
        // Anatomical span points
        anatomyC: { x: 180, y: 260 },
        anatomyD: { x: 230, y: 260 }
    },
    activePointKey: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    pointRadius: 14,
    hitRadius: 28, // touch-friendly hitbox

    cardLengthMM: 85.60, // Standard ISO/IEC 7810 ID-1 card long edge
    measuredSpanMM: 0,
    pxPerMM: 0,

    init() {
        this.canvas = document.getElementById('photo-measure-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.bindEvents();
        this.loadSamplePhotoWithCard();
        console.log('📐 Photo Measurement Module initialized (85.60 mm ISO reference)');
    },

    bindEvents() {
        // File upload
        const fileInput = document.getElementById('pm-file-upload');
        const uploadBtn = document.getElementById('pm-upload-btn');
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.loadFile(file);
            });
        }

        // Camera input
        const cameraInput = document.getElementById('pm-camera-upload');
        const cameraBtn = document.getElementById('pm-camera-btn');
        if (cameraBtn && cameraInput) {
            cameraBtn.addEventListener('click', () => cameraInput.click());
            cameraInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.loadFile(file);
            });
        }

        // Sample photo button
        const sampleBtn = document.getElementById('pm-sample-btn');
        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => this.loadSamplePhotoWithCard());
        }

        // Canvas pointer interactions
        this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
        window.addEventListener('pointerup', () => this.handlePointerUp());
        window.addEventListener('pointercancel', () => this.handlePointerUp());

        // Transfer buttons
        const transferCurvedBtn = document.getElementById('pm-transfer-curved');
        if (transferCurvedBtn) {
            transferCurvedBtn.addEventListener('click', () => this.transferToCurved());
        }

        const transferIndustrialBtn = document.getElementById('pm-transfer-industrial');
        if (transferIndustrialBtn) {
            transferIndustrialBtn.addEventListener('click', () => this.transferToIndustrial());
        }

        const transferFitCardBtn = document.getElementById('pm-transfer-fitcard');
        if (transferFitCardBtn) {
            transferFitCardBtn.addEventListener('click', () => this.transferToFitCard());
        }

        const copyMeasurementBtn = document.getElementById('pm-copy-measurement');
        if (copyMeasurementBtn) {
            copyMeasurementBtn.addEventListener('click', () => this.copyMeasurement());
        }
    },

    loadFile(file) {
        if (!file.type.startsWith('image/')) {
            alert(window.i18n ? window.i18n.t('photoMeasure.alertImageOnly') : 'Please select an image file (JPG, PNG, WebP).');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.fitCanvasToImage();
                this.resetPointsToDefaults();
                this.calculateAndRender();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    loadSamplePhotoWithCard() {
        // Synthesize an ear photograph mockup with an adjacent bank card
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 640;
        offCanvas.height = 480;
        const octx = offCanvas.getContext('2d');

        // Studio background gradient
        const bgGrad = octx.createLinearGradient(0, 0, 640, 480);
        bgGrad.addColorStop(0, '#1E293B');
        bgGrad.addColorStop(1, '#0F172A');
        octx.fillStyle = bgGrad;
        octx.fillRect(0, 0, 640, 480);

        // Draw bank card mockup on left
        const cardX = 60;
        const cardY = 100;
        const cardW = 240;
        const cardH = 151; // 85.6 x 53.98 aspect ratio

        octx.save();
        octx.fillStyle = '#334155';
        octx.strokeStyle = '#D97706';
        octx.lineWidth = 2;
        octx.beginPath();
        octx.roundRect(cardX, cardY, cardW, cardH, 10);
        octx.fill();
        octx.stroke();

        // Card chip & text
        octx.fillStyle = '#F59E0B';
        octx.fillRect(cardX + 24, cardY + 36, 32, 24);
        octx.fillStyle = '#94A3B8';
        octx.font = '11px sans-serif';
        octx.fillText('STANDARD REFERENCE CARD (85.60 mm)', cardX + 16, cardY + 120);
        octx.restore();

        // Draw anatomical ear profile on right
        octx.save();
        octx.fillStyle = '#E2B49A';
        octx.strokeStyle = '#C58F73';
        octx.lineWidth = 3;

        // Helix & antihelix contour
        octx.beginPath();
        octx.moveTo(420, 100);
        octx.bezierCurveTo(520, 90, 560, 200, 530, 310); // helix outer
        octx.bezierCurveTo(500, 380, 440, 400, 410, 360); // lobe
        octx.bezierCurveTo(390, 320, 410, 290, 420, 260); // tragus area
        octx.bezierCurveTo(430, 220, 410, 180, 420, 100); // conch wall
        octx.fill();
        octx.stroke();

        // Conch & rook shading
        octx.fillStyle = '#C58F73';
        octx.beginPath();
        octx.ellipse(460, 240, 28, 40, 0.2, 0, Math.PI * 2);
        octx.fill();

        // Piercing mark (e.g. Rook / Conch span)
        octx.fillStyle = '#10B981';
        octx.beginPath();
        octx.arc(460, 225, 4, 0, Math.PI * 2);
        octx.arc(460, 255, 4, 0, Math.PI * 2);
        octx.fill();

        octx.restore();

        const img = new Image();
        img.onload = () => {
            this.image = img;
            this.fitCanvasToImage();
            this.points.cardA = { x: cardX, y: cardY };
            this.points.cardB = { x: cardX + cardW, y: cardY };
            this.points.anatomyC = { x: 460, y: 225 };
            this.points.anatomyD = { x: 460, y: 255 };
            this.calculateAndRender();
        };
        img.src = offCanvas.toDataURL();
    },

    fitCanvasToImage() {
        if (!this.image || !this.canvas) return;
        const wrapper = this.canvas.parentElement;
        const maxWidth = wrapper ? wrapper.clientWidth : 640;
        const scale = Math.min(1, (maxWidth - 20) / this.image.width);

        this.canvas.width = Math.round(this.image.width * scale);
        this.canvas.height = Math.round(this.image.height * scale);
    },

    resetPointsToDefaults() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.points.cardA = { x: Math.round(w * 0.15), y: Math.round(h * 0.25) };
        this.points.cardB = { x: Math.round(w * 0.55), y: Math.round(h * 0.25) };
        this.points.anatomyC = { x: Math.round(w * 0.7), y: Math.round(h * 0.45) };
        this.points.anatomyD = { x: Math.round(w * 0.7), y: Math.round(h * 0.55) };
    },

    getCanvasPointerPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    },

    handlePointerDown(e) {
        const pos = this.getCanvasPointerPos(e);
        let closestKey = null;
        let minDist = this.hitRadius;

        for (const [key, pt] of Object.entries(this.points)) {
            const d = Math.hypot(pt.x - pos.x, pt.y - pos.y);
            if (d < minDist) {
                minDist = d;
                closestKey = key;
            }
        }

        if (closestKey) {
            this.activePointKey = closestKey;
            this.isDragging = true;
            this.canvas.setPointerCapture(e.pointerId);
            this.calculateAndRender();
        }
    },

    handlePointerMove(e) {
        if (!this.isDragging || !this.activePointKey) return;
        const pos = this.getCanvasPointerPos(e);

        // Clamp inside canvas bounds
        const clampedX = Math.max(10, Math.min(this.canvas.width - 10, pos.x));
        const clampedY = Math.max(10, Math.min(this.canvas.height - 10, pos.y));

        this.points[this.activePointKey] = { x: clampedX, y: clampedY };
        this.calculateAndRender();
    },

    handlePointerUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.activePointKey = null;
            this.calculateAndRender();
        }
    },

    calculateAndRender() {
        if (!this.canvas || !this.ctx) return;
        const ctx = this.ctx;

        // 1. Draw base photo
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.image) {
            ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        }

        // 2. Compute Card distance & scale
        const cardPx = Math.hypot(this.points.cardB.x - this.points.cardA.x, this.points.cardB.y - this.points.cardA.y);
        this.pxPerMM = cardPx > 0 ? (cardPx / this.cardLengthMM) : 0;

        // 3. Compute Anatomy distance
        const anatomyPx = Math.hypot(this.points.anatomyD.x - this.points.anatomyC.x, this.points.anatomyD.y - this.points.anatomyC.y);
        this.measuredSpanMM = this.pxPerMM > 0 ? (anatomyPx / this.pxPerMM) : 0;

        // 4. Render Card Reference Guide (Point A to Point B) - Gold
        ctx.save();
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(this.points.cardA.x, this.points.cardA.y);
        ctx.lineTo(this.points.cardB.x, this.points.cardB.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Card Line Midpoint Label
        const cardMidX = (this.points.cardA.x + this.points.cardB.x) / 2;
        const cardMidY = (this.points.cardA.y + this.points.cardB.y) / 2;
        this.drawTag(ctx, `Bank Card Ref: 85.60 mm (${cardPx.toFixed(1)} px)`, cardMidX, cardMidY - 14, '#D97706', '#FFFFFF');

        // Draw Card Handle A & B
        this.drawHandle(ctx, this.points.cardA, 'A (Card 0mm)', '#D97706', this.activePointKey === 'cardA');
        this.drawHandle(ctx, this.points.cardB, 'B (Card 85.6mm)', '#D97706', this.activePointKey === 'cardB');
        ctx.restore();

        // 5. Render Anatomical Span Guide (Point C to Point D) - Rose Gold
        ctx.save();
        ctx.strokeStyle = '#B76E79';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.points.anatomyC.x, this.points.anatomyC.y);
        ctx.lineTo(this.points.anatomyD.x, this.points.anatomyD.y);
        ctx.stroke();

        // Anatomy Line Midpoint Label
        const anatomyMidX = (this.points.anatomyC.x + this.points.anatomyD.x) / 2;
        const anatomyMidY = (this.points.anatomyC.y + this.points.anatomyD.y) / 2;
        this.drawTag(ctx, `Span: ${this.measuredSpanMM.toFixed(2)} mm`, anatomyMidX, anatomyMidY - 14, '#B76E79', '#FFFFFF');

        // Draw Anatomy Handle C & D
        this.drawHandle(ctx, this.points.anatomyC, 'C (Tissue Margin)', '#B76E79', this.activePointKey === 'anatomyC');
        this.drawHandle(ctx, this.points.anatomyD, 'D (Tissue Margin)', '#B76E79', this.activePointKey === 'anatomyD');
        ctx.restore();

        // 6. Update UI Readout cards
        this.updateReadoutCards(cardPx, anatomyPx);
    },

    drawHandle(ctx, pt, label, color, isActive) {
        ctx.save();
        ctx.fillStyle = isActive ? '#FFFFFF' : color;
        ctx.strokeStyle = isActive ? color : '#FFFFFF';
        ctx.lineWidth = 3;

        // Outer glow on active
        if (isActive) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, this.pointRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Crosshair
        ctx.strokeStyle = isActive ? color : '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pt.x - 6, pt.y);
        ctx.lineTo(pt.x + 6, pt.y);
        ctx.moveTo(pt.x, pt.y - 6);
        ctx.lineTo(pt.x, pt.y + 6);
        ctx.stroke();

        ctx.restore();
    },

    drawTag(ctx, text, x, y, bg, fg) {
        ctx.save();
        ctx.font = 'bold 12px sans-serif';
        const metrics = ctx.measureText(text);
        const pad = 6;
        const w = metrics.width + pad * 2;
        const h = 20;

        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 4);
        ctx.fill();

        ctx.fillStyle = fg;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
    },

    updateReadoutCards(cardPx, anatomyPx) {
        const cardScaleEl = document.getElementById('pm-readout-card-scale');
        const spanEl = document.getElementById('pm-readout-span');
        const detailEl = document.getElementById('pm-readout-detail');

        if (cardScaleEl) {
            cardScaleEl.textContent = `${this.pxPerMM.toFixed(2)} px/mm`;
        }
        if (spanEl) {
            spanEl.textContent = `${this.measuredSpanMM.toFixed(2)} mm`;
        }
        if (detailEl) {
            if (window.i18n) {
                detailEl.textContent = window.i18n.t('photoMeasure.readoutDetail', {
                    cardPx: cardPx.toFixed(1),
                    anatomyPx: anatomyPx.toFixed(1)
                });
            } else {
                detailEl.textContent = tr('photo.detail', 'Card edge: {card} px / 85.60 mm. Tissue span: {span} px.', { card: cardPx.toFixed(1), span: anatomyPx.toFixed(1) });
            }
        }
    },

    onTabActivated() {
        if (!this.canvas) return;
        this.fitCanvasToImage();
        this.calculateAndRender();
    },

    transferToCurved() {
        const spanRounded = this.measuredSpanMM.toFixed(1);
        const input = document.getElementById('cbb-anatomy-mm');
        if (input) {
            input.value = spanRounded;
        }

        if (typeof window.switchTab === 'function') {
            window.switchTab('curved-barbell');
        } else {
            const tabBtn = document.querySelector('.nav-tab[data-tab="curved-barbell"]');
            if (tabBtn) tabBtn.click();
        }

        if (typeof CurvedBarbellCalculator !== 'undefined' && typeof CurvedBarbellCalculator.calculate === 'function') {
            CurvedBarbellCalculator.calculate();
        }
    },

    transferToIndustrial() {
        const spanRounded = this.measuredSpanMM.toFixed(1);
        const input = document.getElementById('ibb-hole-distance');
        if (input) {
            input.value = spanRounded;
        }

        if (typeof window.switchTab === 'function') {
            window.switchTab('industrial-barbell');
        } else {
            const tabBtn = document.querySelector('.nav-tab[data-tab="industrial-barbell"]');
            if (tabBtn) tabBtn.click();
        }

        if (typeof IndustrialBarbellCalculator !== 'undefined' && typeof IndustrialBarbellCalculator.calculate === 'function') {
            IndustrialBarbellCalculator.calculate();
        }
    },

    transferToFitCard() {
        const spanRounded = this.measuredSpanMM.toFixed(1);
        const input = document.getElementById('fit-input-measurement');
        if (input) {
            input.value = `${spanRounded} mm (photo-measured)`;
        }

        if (typeof FitCardModule !== 'undefined') {
            FitCardModule.data.measurement = `${spanRounded} mm (photo-measured)`;
            FitCardModule.render();
        }

        if (typeof window.switchTab === 'function') {
            window.switchTab('fit-card');
        } else {
            const tabBtn = document.querySelector('.nav-tab[data-tab="fit-card"]');
            if (tabBtn) tabBtn.click();
        }
    },

    copyMeasurement() {
        const text = `${this.measuredSpanMM.toFixed(2)} mm`;
        const btn = document.getElementById('pm-copy-measurement');
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (btn) {
                    const original = btn.textContent;
                    btn.textContent = window.i18n ? window.i18n.t('common.copied') : '✓ Copied!';
                    setTimeout(() => { btn.textContent = original; }, 2000);
                }
            });
        }
    }
};

if (typeof window !== 'undefined') {
    window.PhotoMeasureModule = PhotoMeasureModule;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoMeasureModule;
}
