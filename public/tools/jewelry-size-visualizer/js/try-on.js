/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Virtual Try-On Module
 * Poli International Widget Suite
 *
 * Handles:
 * - Photo upload (drag & drop, file select)
 * - Jewelry overlay at calibrated scale
 * - Position, rotation, scale, opacity controls
 * - Save and share try-on results
 */

const TryOnModule = {
    uploadArea: null,
    workspace: null,
    canvas: null,
    ctx: null,

    // Current state
    uploadedImage: null,
    selectedJewelry: null,
    jewelryPosition: { x: 0, y: 0 },
    jewelryScale: 100,
    jewelryRotation: 0,
    jewelryOpacity: 100,
    isDragging: false,

    /**
     * Initialize try-on module
     */
    init() {
        this.uploadArea = document.getElementById('upload-area');
        this.workspace = document.getElementById('try-on-workspace');
        this.canvas = document.getElementById('try-on-canvas');

        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }

        // Bind events
        this.bindUploadEvents();
        this.bindControlEvents();
        this.bindCanvasEvents();

        console.log('📸 Try-On module initialized');
    },

    /**
     * Bind upload area events
     */
    bindUploadEvents() {
        const fileInput = document.getElementById('photo-upload');
        const uploadButton = document.getElementById('upload-button');
        const cameraInput = document.getElementById('camera-upload');
        const cameraButton = document.getElementById('camera-button');

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFile(file);
                }
            });
        }

        // Camera input change (mobile camera direct capture)
        if (cameraInput) {
            cameraInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFile(file);
                }
            });
        }

        // Upload button click
        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        // Camera button click
        if (cameraButton) {
            cameraButton.addEventListener('click', () => {
                if (cameraInput) {
                    cameraInput.click();
                } else {
                    fileInput?.click();
                }
            });
        }

        // Sample anatomical photo click
        const samplePhotoBtn = document.getElementById('sample-photo-btn');
        if (samplePhotoBtn) {
            samplePhotoBtn.addEventListener('click', () => {
                this.loadSampleEarPhoto();
            });
        }

        // Drag and drop
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.classList.add('dragover');
            });

            this.uploadArea.addEventListener('dragleave', () => {
                this.uploadArea.classList.remove('dragover');
            });

            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('dragover');

                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleFile(file);
                }
            });

            // Click to upload
            this.uploadArea.addEventListener('click', () => {
                fileInput?.click();
            });
        }
    },

    /**
     * Bind control slider events
     */
    bindControlEvents() {
        // Scale controls
        const scaleSlider = document.getElementById('scale-slider');
        const scaleUp = document.getElementById('scale-up');
        const scaleDown = document.getElementById('scale-down');
        const scaleValue = document.getElementById('scale-value');

        if (scaleSlider) {
            scaleSlider.addEventListener('input', (e) => {
                this.jewelryScale = parseInt(e.target.value);
                if (scaleValue) scaleValue.textContent = `${this.jewelryScale}%`;
                this.redraw();
            });
        }

        if (scaleUp) {
            scaleUp.addEventListener('click', () => {
                this.jewelryScale = Math.min(150, this.jewelryScale + 5);
                if (scaleSlider) scaleSlider.value = this.jewelryScale;
                if (scaleValue) scaleValue.textContent = `${this.jewelryScale}%`;
                this.redraw();
            });
        }

        if (scaleDown) {
            scaleDown.addEventListener('click', () => {
                this.jewelryScale = Math.max(50, this.jewelryScale - 5);
                if (scaleSlider) scaleSlider.value = this.jewelryScale;
                if (scaleValue) scaleValue.textContent = `${this.jewelryScale}%`;
                this.redraw();
            });
        }

        // Rotation controls
        const rotationSlider = document.getElementById('rotation-slider');
        const rotateLeft = document.getElementById('rotate-left');
        const rotateRight = document.getElementById('rotate-right');
        const rotationValue = document.getElementById('rotation-value');

        if (rotationSlider) {
            rotationSlider.addEventListener('input', (e) => {
                this.jewelryRotation = parseInt(e.target.value);
                if (rotationValue) rotationValue.textContent = `${this.jewelryRotation}°`;
                this.redraw();
            });
        }

        if (rotateLeft) {
            rotateLeft.addEventListener('click', () => {
                this.jewelryRotation = (this.jewelryRotation - 15 + 360) % 360;
                if (rotationSlider) rotationSlider.value = this.jewelryRotation;
                if (rotationValue) rotationValue.textContent = `${this.jewelryRotation}°`;
                this.redraw();
            });
        }

        if (rotateRight) {
            rotateRight.addEventListener('click', () => {
                this.jewelryRotation = (this.jewelryRotation + 15) % 360;
                if (rotationSlider) rotationSlider.value = this.jewelryRotation;
                if (rotationValue) rotationValue.textContent = `${this.jewelryRotation}°`;
                this.redraw();
            });
        }

        // Opacity control
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');

        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                this.jewelryOpacity = parseInt(e.target.value);
                if (opacityValue) opacityValue.textContent = `${this.jewelryOpacity}%`;
                this.redraw();
            });
        }

        // Action buttons
        const saveTryOnBtn = document.getElementById('save-try-on');
        if (saveTryOnBtn) {
            saveTryOnBtn.addEventListener('click', () => this.saveTryOn());
        }

        const newPhotoBtn = document.getElementById('new-photo');
        if (newPhotoBtn) {
            newPhotoBtn.addEventListener('click', () => this.reset());
        }

        const shareTryOnBtn = document.getElementById('share-try-on');
        if (shareTryOnBtn) {
            shareTryOnBtn.addEventListener('click', () => this.shareTryOn());
        }
    },

    /**
     * Convert client DOM coordinates to internal canvas coordinate space
     */
    getCanvasCoords(clientX, clientY) {
        if (!this.canvas) return { x: 0, y: 0 };
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / (rect.width || 1);
        const scaleY = this.canvas.height / (rect.height || 1);
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    },

    /**
     * Bind canvas interaction events (Mouse + Touch support for mobile)
     */
    bindCanvasEvents() {
        if (!this.canvas) return;
        this.canvas.style.touchAction = 'none';

        let startX = 0;
        let startY = 0;
        let initialPinchDistance = 0;
        let initialPinchScale = 100;
        let initialPinchAngle = 0;
        let initialJewelryRotation = 0;

        const handleStart = (clientX, clientY) => {
            const coords = this.getCanvasCoords(clientX, clientY);
            const distance = Math.sqrt(
                Math.pow(coords.x - this.jewelryPosition.x, 2) +
                Math.pow(coords.y - this.jewelryPosition.y, 2)
            );
            const tolerance = Math.max(90, (this.selectedJewelry?.diameter || 0.5) * 160);
            if (distance < tolerance) {
                this.isDragging = true;
                startX = coords.x;
                startY = coords.y;
                this.canvas.style.cursor = 'grabbing';
            }
        };

        const handleMove = (clientX, clientY) => {
            if (!this.isDragging) return;
            const coords = this.getCanvasCoords(clientX, clientY);
            this.jewelryPosition.x += coords.x - startX;
            this.jewelryPosition.y += coords.y - startY;
            startX = coords.x;
            startY = coords.y;
            this.redraw();
        };

        const handleEnd = () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'move';
        };

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
        this.canvas.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        this.canvas.addEventListener('mouseup', handleEnd);
        this.canvas.addEventListener('mouseleave', handleEnd);

        // Mobile touch events with gesture support
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                const dx = e.touches[1].clientX - e.touches[0].clientX;
                const dy = e.touches[1].clientY - e.touches[0].clientY;
                initialPinchDistance = Math.hypot(dx, dy);
                initialPinchScale = this.jewelryScale;
                initialPinchAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                initialJewelryRotation = this.jewelryRotation;
            }
            if (this.isDragging || e.touches.length === 2) {
                e.preventDefault();
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && this.isDragging) {
                e.preventDefault();
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2 && initialPinchDistance > 0) {
                e.preventDefault();
                const dx = e.touches[1].clientX - e.touches[0].clientX;
                const dy = e.touches[1].clientY - e.touches[0].clientY;
                const newDist = Math.hypot(dx, dy);
                const scaleFactor = newDist / initialPinchDistance;
                this.jewelryScale = Math.min(200, Math.max(30, Math.round(initialPinchScale * scaleFactor)));

                const newAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                const angleDiff = Math.round(newAngle - initialPinchAngle);
                this.jewelryRotation = (initialJewelryRotation + angleDiff + 360) % 360;

                const scaleSlider = document.getElementById('scale-slider');
                const scaleValue = document.getElementById('scale-value');
                if (scaleSlider) scaleSlider.value = this.jewelryScale;
                if (scaleValue) scaleValue.textContent = `${this.jewelryScale}%`;

                const rotationSlider = document.getElementById('rotation-slider');
                const rotationValue = document.getElementById('rotation-value');
                if (rotationSlider) rotationSlider.value = this.jewelryRotation;
                if (rotationValue) rotationValue.textContent = `${this.jewelryRotation}°`;

                this.redraw();
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                handleEnd();
                initialPinchDistance = 0;
            } else if (e.touches.length === 1) {
                initialPinchDistance = 0;
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        this.canvas.addEventListener('touchcancel', () => {
            handleEnd();
            initialPinchDistance = 0;
        });
    },

    /**
     * Handle uploaded file
     */
    handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert(window.i18n ? window.i18n.t('tryOn.alert.imageOnly') : 'Please upload an image file (JPG, PNG, etc.)');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(window.i18n ? window.i18n.t('tryOn.alert.tooLarge') : 'Image file is too large. Please use an image under 10MB.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.showWorkspace();
                this.initializeCanvas();
                console.log('📷 Photo uploaded:', file.name);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    },

    /**
     * Generate and load a clean sample anatomical ear profile
     */
    loadSampleEarPhoto() {
        const offscreen = document.createElement('canvas');
        offscreen.width = 700;
        offscreen.height = 700;
        const ctx = offscreen.getContext('2d');

        // Clean neutral studio background
        ctx.fillStyle = '#f4f0eb';
        ctx.fillRect(0, 0, 700, 700);

        // Soft studio lighting gradient
        const bgGrad = ctx.createRadialGradient(350, 350, 100, 350, 350, 380);
        bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        bgGrad.addColorStop(1, 'rgba(215, 200, 190, 0.6)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 700, 700);

        // Draw anatomical ear silhouette
        ctx.save();
        ctx.translate(50, 20);

        // Outer Helix contour
        ctx.beginPath();
        ctx.moveTo(320, 100);
        ctx.bezierCurveTo(180, 70, 100, 200, 110, 350);
        ctx.bezierCurveTo(115, 450, 160, 580, 260, 620);
        ctx.bezierCurveTo(340, 640, 380, 560, 380, 480);
        ctx.bezierCurveTo(380, 420, 340, 390, 330, 360);
        ctx.bezierCurveTo(320, 330, 360, 260, 360, 200);
        ctx.bezierCurveTo(360, 140, 350, 110, 320, 100);
        ctx.closePath();

        ctx.fillStyle = '#eed6c4';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#c8a892';
        ctx.stroke();

        // Inner Helix rim fold
        ctx.beginPath();
        ctx.moveTo(310, 130);
        ctx.bezierCurveTo(200, 110, 130, 220, 140, 340);
        ctx.bezierCurveTo(145, 410, 170, 480, 220, 510);
        ctx.lineWidth = 14;
        ctx.strokeStyle = 'rgba(195, 160, 140, 0.45)';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Antihelix & Scapha depression
        ctx.beginPath();
        ctx.moveTo(270, 170);
        ctx.bezierCurveTo(200, 220, 190, 330, 230, 410);
        ctx.bezierCurveTo(250, 450, 270, 470, 280, 490);
        ctx.lineWidth = 18;
        ctx.strokeStyle = 'rgba(175, 140, 120, 0.4)';
        ctx.stroke();

        // Concha bowl
        ctx.beginPath();
        ctx.ellipse(260, 350, 45, 60, Math.PI / 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150, 115, 95, 0.5)';
        ctx.fill();

        // Tragus
        ctx.beginPath();
        ctx.moveTo(330, 340);
        ctx.bezierCurveTo(300, 345, 295, 375, 325, 385);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#b8947e';
        ctx.fillStyle = '#eed6c4';
        ctx.fill();
        ctx.stroke();

        // Antitragus & Lobe
        ctx.beginPath();
        ctx.arc(280, 520, 45, 0, Math.PI);
        ctx.fillStyle = '#e8cbba';
        ctx.fill();

        // Watermark / label
        ctx.restore();
        ctx.fillStyle = '#7a6a60';
        ctx.font = '600 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('ANATOMICAL REFERENCE PROFILE (EAR)', 30, 670);

        const img = new Image();
        img.onload = () => {
            this.uploadedImage = img;
            this.showWorkspace();
            this.initializeCanvas();
            console.log('👂 Sample anatomical ear loaded into Try-On');
        };
        img.src = offscreen.toDataURL('image/png');
    },

    /**
     * Show workspace and hide upload area
     */
    showWorkspace() {
        if (this.uploadArea) {
            this.uploadArea.parentElement.style.display = 'none';
        }
        if (this.workspace) {
            this.workspace.style.display = 'grid';
        }
    },

    /**
     * Initialize canvas with uploaded photo
     */
    initializeCanvas() {
        if (!this.canvas || !this.uploadedImage) return;

        // Set canvas size to match image (with max dimensions)
        const maxWidth = 800;
        const maxHeight = 600;
        let width = this.uploadedImage.width;
        let height = this.uploadedImage.height;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        // Set initial jewelry position (center)
        this.jewelryPosition = {
            x: width / 2,
            y: height / 2
        };

        // Draw initial state
        this.redraw();
    },

    /**
     * Redraw canvas with photo and jewelry overlay
     */
    redraw() {
        if (!this.ctx || !this.uploadedImage) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw uploaded photo
        this.ctx.drawImage(this.uploadedImage, 0, 0, this.canvas.width, this.canvas.height);

        // Draw jewelry overlay if selected
        if (this.selectedJewelry) {
            this.drawJewelryOverlay();
        }
    },

    /**
     * Draw jewelry overlay on canvas
     */
    drawJewelryOverlay() {
        if (!this.ctx || !this.selectedJewelry) return;

        // Create temporary canvas for jewelry
        const tempCanvas = document.createElement('canvas');
        const maxDim = Math.max(
            this.selectedJewelry.diameter || 0,
            this.selectedJewelry.length || 0,
            0.5
        );
        const jewelrySize = ScaleRenderer.inchesToPixels(maxDim) * 3;

        tempCanvas.width = jewelrySize;
        tempCanvas.height = jewelrySize;

        // Render jewelry on temp canvas
        ScaleRenderer.renderJewelry(tempCanvas, this.selectedJewelry, {
            showRuler: false,
            showLabels: false,
            rotation: 0,
            opacity: 1
        });

        // Apply transformations and draw on main canvas
        this.ctx.save();

        // Set opacity
        this.ctx.globalAlpha = this.jewelryOpacity / 100;

        // Translate to jewelry position
        this.ctx.translate(this.jewelryPosition.x, this.jewelryPosition.y);

        // Apply rotation
        this.ctx.rotate((this.jewelryRotation * Math.PI) / 180);

        // Apply scale
        const scale = this.jewelryScale / 100;
        this.ctx.scale(scale, scale);

        // Draw jewelry
        this.ctx.drawImage(tempCanvas, -jewelrySize / 2, -jewelrySize / 2);

        this.ctx.restore();
    },

    /**
     * Set jewelry for try-on (called from visualizer)
     */
    setJewelry(jewelry) {
        this.selectedJewelry = jewelry;
        if (this.uploadedImage) {
            this.redraw();
        }
        console.log('💍 Set jewelry for try-on:', jewelry.name);
    },

    /**
     * Save try-on result as image
     */
    saveTryOn() {
        if (!this.canvas) return;

        try {
            // Convert canvas to data URL
            const dataURL = this.canvas.toDataURL('image/png');

            // Create download link
            const link = document.createElement('a');
            link.download = `jewelry-tryon-${Date.now()}.png`;
            link.href = dataURL;
            link.click();

            console.log('💾 Try-on saved');
            this.showSaveMessage(window.i18n ? window.i18n.t('tryon.msgSaved') : 'Try-on saved successfully!');
        } catch (error) {
            console.error('Failed to save try-on:', error);
            alert(window.i18n ? window.i18n.t('tryOn.alert.saveFailed') : 'Failed to save image. Please try again.');
        }
    },

    /**
     * Share try-on result
     */
    shareTryOn() {
        if (!this.canvas) return;

        this.canvas.toBlob((blob) => {
            if (!blob) {
                alert(window.i18n ? window.i18n.t('tryOn.alert.shareFailed') : 'Failed to create shareable image');
                return;
            }

            const file = new File([blob], 'jewelry-tryon.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: 'My Jewelry Try-On',
                    text: 'Check out how this jewelry looks on me!',
                    files: [file]
                }).then(() => {
                    console.log('📤 Shared successfully');
                }).catch((error) => {
                    console.log('Share cancelled or failed:', error);
                });
            } else {
                // Fallback: copy link or download
                alert(window.i18n ? window.i18n.t('tryOn.alert.shareNotSupported') : 'Sharing not supported on this device. Image will be downloaded instead.');
                this.saveTryOn();
            }
        });
    },

    /**
     * Reset try-on (load new photo)
     */
    reset() {
        // Clear state
        this.uploadedImage = null;
        this.selectedJewelry = null;
        this.jewelryPosition = { x: 0, y: 0 };
        this.jewelryScale = 100;
        this.jewelryRotation = 0;
        this.jewelryOpacity = 100;

        // Reset sliders
        const scaleSlider = document.getElementById('scale-slider');
        const rotationSlider = document.getElementById('rotation-slider');
        const opacitySlider = document.getElementById('opacity-slider');

        if (scaleSlider) scaleSlider.value = 100;
        if (rotationSlider) rotationSlider.value = 0;
        if (opacitySlider) opacitySlider.value = 100;

        // Show upload area
        if (this.workspace) {
            this.workspace.style.display = 'none';
        }
        if (this.uploadArea) {
            this.uploadArea.parentElement.style.display = 'block';
        }

        console.log('🔄 Try-on reset');
    },

    /**
     * Show save success message
     */
    showSaveMessage(message) {
        const msgEl = document.createElement('div');
        msgEl.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 3000;
            font-weight: 600;
        `;
        msgEl.textContent = message;

        document.body.appendChild(msgEl);

        setTimeout(() => {
            msgEl.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => msgEl.remove(), 300);
        }, 3000);
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.TryOnModule = TryOnModule;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TryOnModule;
}
