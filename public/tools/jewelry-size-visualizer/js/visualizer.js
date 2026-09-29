/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Visualizer Module - Gallery & Detail View
 * Poli International Widget Suite
 *
 * Handles:
 * - Jewelry gallery display with filtering
 * - 1:1 scale rendering in detail view
 * - Size comparisons with European standards
 * - Add to comparison/save functionality
 */

const Visualizer = {
    currentFilters: {
        category: 'all',
        gauge: 'all',
        material: 'all',
        location: 'all'
    },
    currentJewelry: null,
    galleryContainer: null,
    detailView: null,
    detailCanvas: null,
    currentPage: 1,
    itemsPerPage: 12,
    allItems: [],
    canvasObserver: null,

    /**
     * Initialize visualizer module
     */
    init() {
        this.galleryContainer = document.getElementById('jewelry-gallery');
        this.detailView = document.getElementById('jewelry-detail');
        this.detailCanvas = document.getElementById('jewelry-canvas');

        // Set up Intersection Observer for lazy canvas rendering
        this.setupCanvasObserver();

        // Bind filter events
        this.bindFilterEvents();

        // Bind detail view events
        this.bindDetailEvents();

        // Load initial gallery (popular items only)
        this.loadGallery();

        console.log('👁️ Visualizer module initialized');
    },

    /**
     * Set up IntersectionObserver for lazy canvas rendering
     */
    setupCanvasObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.canvasObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const canvas = entry.target;
                    const itemId = canvas.dataset.jewelryId;
                    if (itemId && !canvas.dataset.rendered) {
                        const item = getJewelryById(itemId);
                        if (item) {
                            ScaleRenderer.renderJewelry(canvas, item, {
                                showLabels: false,
                                showRuler: false
                            });
                            canvas.dataset.rendered = 'true';
                        }
                    }
                    this.canvasObserver.unobserve(canvas);
                }
            });
        }, options);
    },

    /**
     * Bind filter dropdown events
     */
    bindFilterEvents() {
        const categoryFilter = document.getElementById('filter-category');
        const gaugeFilter = document.getElementById('filter-gauge');
        const materialFilter = document.getElementById('filter-material');
        const locationFilter = document.getElementById('filter-location');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.loadGallery();
            });
        }

        if (gaugeFilter) {
            gaugeFilter.addEventListener('change', (e) => {
                this.currentFilters.gauge = e.target.value;
                this.loadGallery();
            });
        }

        if (materialFilter) {
            materialFilter.addEventListener('change', (e) => {
                this.currentFilters.material = e.target.value;
                this.loadGallery();
            });
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.currentFilters.location = e.target.value;
                this.loadGallery();
            });
        }
    },

    /**
     * Bind detail view events
     */
    bindDetailEvents() {
        const closeBtn = document.getElementById('detail-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDetailView());
        }

        const tryOnBtn = document.getElementById('try-on-button');
        if (tryOnBtn) {
            tryOnBtn.addEventListener('click', () => this.openTryOn());
        }

        const compareBtn = document.getElementById('compare-button');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.addToComparison());
        }

        const saveBtn = document.getElementById('save-button');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveToCollection());
        }
    },

    /**
     * Load and display jewelry gallery
     */
    loadGallery() {
        if (!this.galleryContainer) {
            console.error('❌ Gallery container not found');
            return;
        }

        // Show loading state
        this.galleryContainer.innerHTML = `
            <div class="gallery-loading">
                <div class="spinner"></div>
                <p>Loading jewelry...</p>
            </div>
        `;

        // Reset pagination
        this.currentPage = 1;

        // Small delay for smooth UX
        setTimeout(() => {
            try {
                // Check if database functions are available
                if (typeof getPopularJewelry === 'undefined') {
                    throw new Error('getPopularJewelry function not available');
                }
                if (typeof filterJewelry === 'undefined') {
                    throw new Error('filterJewelry function not available');
                }

                // Get filtered jewelry - start with popular items if no filters
                let jewelry;
                const hasFilters = this.currentFilters.category !== 'all' ||
                                  this.currentFilters.gauge !== 'all' ||
                                  this.currentFilters.material !== 'all' ||
                                  this.currentFilters.location !== 'all';

                if (hasFilters) {
                    jewelry = filterJewelry(this.currentFilters);
                } else {
                    // Show popular items only by default (much faster)
                    jewelry = getPopularJewelry();
                }

                if (!jewelry || jewelry.length === 0) {
                    console.warn('⚠️ No jewelry items returned from database');
                    this.galleryContainer.innerHTML = `
                        <div class="gallery-loading">
                            <p style="color: var(--text-tertiary);">No jewelry found. Please check the database.</p>
                        </div>
                    `;
                    return;
                }

                this.allItems = jewelry;

                // Display first page
                this.displayGallery();

                console.log(`📦 Loaded ${jewelry.length} jewelry items with filters:`, this.currentFilters);
            } catch (error) {
                console.error('❌ Error loading gallery:', error);
                this.galleryContainer.innerHTML = `
                    <div class="gallery-loading">
                        <p style="color: var(--color-error);">Error loading jewelry: ${error.message}</p>
                        <p style="color: var(--text-tertiary); font-size: 0.875rem;">Please check the browser console for details.</p>
                    </div>
                `;
            }
        }, 100);
    },

    /**
     * Display jewelry cards in gallery with pagination
     */
    displayGallery() {
        console.log('📦 displayGallery called');
        console.log('   Gallery container:', this.galleryContainer ? 'Found' : 'NOT FOUND');
        console.log('   All items:', this.allItems.length);

        if (!this.galleryContainer) {
            console.error('❌ Gallery container not found!');
            return;
        }

        if (this.allItems.length === 0) {
            console.warn('⚠️ No items to display');
            const emptyMsg = window.i18n ? window.i18n.t('visualizer.emptyFiltered') : 'No jewelry found matching your filters. Try adjusting your selection.';
            this.galleryContainer.innerHTML = `
                <div class="gallery-loading">
                    <p style="color: var(--text-tertiary);">${emptyMsg}</p>
                </div>
            `;
            return;
        }

        // Calculate pagination
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        const itemsToShow = this.allItems.slice(startIndex, endIndex);
        const hasMore = endIndex < this.allItems.length;

        console.log(`   Showing items ${startIndex} to ${endIndex} (${itemsToShow.length} items)`);
        console.log(`   Has more: ${hasMore}`);

        // Create cards
        let html = itemsToShow.map(item => this.createJewelryCard(item)).join('');

        console.log(`   Generated HTML length: ${html.length} characters`);

        const t = (k, fb, params) => (window.i18n ? window.i18n.t(k, params) : fb);

        // Add "Load More" button if there are more items
        if (hasMore) {
            const remaining = this.allItems.length - endIndex;
            const loadMoreText = t('visualizer.loadMore', `Load More (${remaining} remaining)`, { count: remaining });
            html += `
                <div class="gallery-load-more">
                    <button class="btn btn--secondary btn--large" id="load-more-btn">
                        ${loadMoreText}
                    </button>
                </div>
            `;
        } else if (this.allItems.length > this.itemsPerPage) {
            const showingAllText = t('visualizer.showingAll', `Showing all ${this.allItems.length} items`, { count: this.allItems.length });
            html += `
                <div class="gallery-load-more">
                    <p style="color: var(--text-tertiary); text-align: center;">
                        ${showingAllText}
                    </p>
                </div>
            `;
        }

        this.galleryContainer.innerHTML = html;
        console.log('✅ Gallery HTML updated');

        // Add click handlers to cards
        this.galleryContainer.querySelectorAll('.jewelry-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.id;
                this.openDetailView(itemId);
            });
        });

        // Add click handler to "Load More" button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.displayGallery();
                // Scroll to new items
                setTimeout(() => {
                    const cards = this.galleryContainer.querySelectorAll('.jewelry-card');
                    if (cards.length >= itemsToShow.length) {
                        cards[itemsToShow.length - this.itemsPerPage]?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            });
        }

        // Observe canvases for lazy rendering
        this.observeCanvases();
    },

    /**
     * Observe canvases for lazy rendering
     */
    observeCanvases() {
        if (!this.canvasObserver) return;

        const canvases = this.galleryContainer.querySelectorAll('.jewelry-card__canvas');
        canvases.forEach(canvas => {
            if (!canvas.dataset.rendered) {
                this.canvasObserver.observe(canvas);
            }
        });
    },

    /**
     * Create jewelry card HTML
     */
    createJewelryCard(item) {
        const gaugeMM = (ScaleRenderer.gaugeToInches(item.gauge) * MeasurementStandards.MM_PER_INCH).toFixed(1);
        const sizeMeasurement = item.diameter
            ? `Ø ${item.diameter}" (${(item.diameter * MeasurementStandards.MM_PER_INCH).toFixed(1)}mm)`
            : item.length
            ? `L ${item.length}" (${(item.length * MeasurementStandards.MM_PER_INCH).toFixed(1)}mm)`
            : '';

        const t = (k, fb) => (window.i18n ? window.i18n.t(k) : fb);
        const popularBadge = t('visualizer.card.popular', 'Popular');
        const gaugeLabel = t('visualizer.card.gauge', 'Gauge');
        const sizeLabel = t('visualizer.card.size', 'Size');
        const matLabel = t('visualizer.card.material', 'Material');

        return `
            <div class="jewelry-card" data-id="${item.id}">
                <div class="jewelry-card__image">
                    <canvas class="jewelry-card__canvas" width="200" height="200" data-jewelry-id="${item.id}"></canvas>
                    ${item.popular ? `<span class="jewelry-card__badge">${popularBadge}</span>` : ''}
                </div>
                <h3 class="jewelry-card__title">${item.name}</h3>
                <div class="jewelry-card__specs">
                    <span><strong>${gaugeLabel}:</strong> ${item.gauge} (${gaugeMM}mm)</span>
                    ${sizeMeasurement ? `<span><strong>${sizeLabel}:</strong> ${sizeMeasurement}</span>` : ''}
                    <span><strong>${matLabel}:</strong> ${this.formatMaterial(item.material)}</span>
                </div>
                <div class="jewelry-card__tags">
                    ${item.locations.map(loc => `<span class="tag">${this.formatLocation(loc)}</span>`).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Format material name for display
     */
    formatMaterial(material) {
        if (window.i18n && window.i18n.has('material.' + material)) {
            return window.i18n.t('material.' + material);
        }
        const names = {
            'titanium': 'Implant-Grade Titanium',
            'steel': 'Surgical Steel',
            'gold': '14k/18k Gold',
            'niobium': 'Niobium',
            'glass': 'Glass',
            'stone': 'Natural Stone',
            'acrylic': 'Acrylic'
        };
        return names[material] || material;
    },

    /**
     * Format location name for display
     */
    formatLocation(location) {
        if (window.i18n && window.i18n.has('location.' + location)) {
            return window.i18n.t('location.' + location);
        }
        const names = {
            'ear': 'Ear',
            'nose': 'Nose',
            'lip': 'Lip',
            'tongue': 'Tongue',
            'eyebrow': 'Eyebrow',
            'navel': 'Navel',
            'nipple': 'Nipple',
            'surface': 'Surface',
            'genital': 'Genital'
        };
        return names[location] || location;
    },

    /**
     * Open detail view for specific jewelry item
     */
    openDetailView(itemId) {
        const item = getJewelryById(itemId);
        if (!item) {
            console.error('Jewelry item not found:', itemId);
            return;
        }

        this.currentJewelry = item;

        // Populate detail view
        this.populateDetailView(item);

        // Render jewelry on canvas at 1:1 scale
        this.renderDetailCanvas(item);

        // Show detail view
        if (this.detailView) {
            this.detailView.style.display = 'flex';
        }

        console.log('🔍 Opened detail view for:', item.name);
    },

    /**
     * Populate detail view with jewelry information
     */
    populateDetailView(item) {
        // Set name
        const nameElement = document.getElementById('detail-name');
        if (nameElement) {
            nameElement.textContent = item.name;
        }

        // Set gauge
        const gaugeElement = document.getElementById('detail-gauge');
        if (gaugeElement) {
            const gaugeMM = (ScaleRenderer.gaugeToInches(item.gauge) * MeasurementStandards.MM_PER_INCH).toFixed(1);
            gaugeElement.textContent = `${item.gauge} (${gaugeMM}mm)`;
        }

        // Set size
        const sizeElement = document.getElementById('detail-size');
        if (sizeElement) {
            if (item.diameter) {
                const diameterMM = (item.diameter * MeasurementStandards.MM_PER_INCH).toFixed(1);
                sizeElement.textContent = `Ø ${item.diameter}" (${diameterMM}mm)`;
            } else if (item.length) {
                const lengthMM = (item.length * MeasurementStandards.MM_PER_INCH).toFixed(1);
                sizeElement.textContent = `Length ${item.length}" (${lengthMM}mm)`;
            } else {
                sizeElement.textContent = '--';
            }
        }

        // Set material
        const materialElement = document.getElementById('detail-material');
        if (materialElement) {
            materialElement.textContent = this.formatMaterial(item.material);
        }

        // Set locations
        const locationsElement = document.getElementById('detail-locations');
        if (locationsElement) {
            locationsElement.textContent = item.locations.map(loc => this.formatLocation(loc)).join(', ');
        }

        // Generate size comparisons
        this.generateSizeComparisons(item);
    },

    /**
     * Generate size comparisons using European standards
     */
    generateSizeComparisons(item) {
        const comparisonsElement = document.getElementById('detail-comparisons');
        if (!comparisonsElement) return;

        // Calculate approximate area based on jewelry type
        let areaInSquareInches = 0;

        if (item.diameter) {
            // Circular jewelry - use circle area
            const radius = item.diameter / 2;
            areaInSquareInches = Math.PI * radius * radius;
        } else if (item.length && item.gauge) {
            // Linear jewelry - approximate as rectangle
            const gaugeInches = ScaleRenderer.gaugeToInches(item.gauge);
            areaInSquareInches = item.length * gaugeInches;
        } else {
            // Default small area
            areaInSquareInches = 0.05;
        }

        // Get comparisons from measurement standards
        const comparisons = MeasurementStandards.generateSizeComparisons(areaInSquareInches);

        // Display comparisons
        comparisonsElement.innerHTML = comparisons.map(comp => `
            <li>
                <strong>${comp.ratio}× ${comp.name}</strong><br>
                <small>${comp.size}</small>
            </li>
        `).join('');
    },

    /**
     * Render jewelry on detail canvas at 1:1 scale
     */
    renderDetailCanvas(item) {
        if (!this.detailCanvas) return;

        // Set canvas size based on jewelry dimensions
        const maxDimension = this.calculateMaxDimension(item);
        const canvasSize = Math.max(ScaleRenderer.inchesToPixels(maxDimension) * 2, 400);

        this.detailCanvas.width = canvasSize;
        this.detailCanvas.height = canvasSize;

        // Render jewelry
        ScaleRenderer.renderJewelry(this.detailCanvas, item, {
            showRuler: false,
            showLabels: true,
            rotation: 0,
            opacity: 1
        });

        console.log(`🎨 Rendered ${item.name} at 1:1 scale (${canvasSize}px canvas)`);
    },

    /**
     * Calculate maximum dimension of jewelry item
     */
    calculateMaxDimension(item) {
        if (item.diameter) {
            return item.diameter;
        } else if (item.length) {
            return item.length;
        } else {
            return 0.5; // Default
        }
    },

    /**
     * Close detail view
     */
    closeDetailView() {
        if (this.detailView) {
            this.detailView.style.display = 'none';
        }
        this.currentJewelry = null;
    },

    /**
     * Open try-on view with current jewelry
     */
    openTryOn() {
        if (!this.currentJewelry) return;

        // Close detail view
        this.closeDetailView();

        // Switch to try-on tab
        const tryOnTab = document.querySelector('[data-tab="try-on"]');
        if (tryOnTab) {
            tryOnTab.click();
        }

        // Set jewelry for try-on
        if (typeof TryOnModule !== 'undefined') {
            TryOnModule.setJewelry(this.currentJewelry);
        }

        console.log('📸 Opening try-on for:', this.currentJewelry.name);
    },

    /**
     * Add current jewelry to comparison
     */
    addToComparison() {
        if (!this.currentJewelry) return;

        // Add to comparison list
        if (AppState.comparisonItems.length >= 4) {
            alert(window.i18n ? window.i18n.t('visualizer.alertCompareMax') : 'You can compare up to 4 items at once. Please remove an item first.');
            return;
        }

        AppState.comparisonItems.push(this.currentJewelry);

        // Close detail view
        this.closeDetailView();

        // Switch to comparison tab
        const compareTab = document.querySelector('[data-tab="compare"]');
        if (compareTab) {
            compareTab.click();
        }

        // Update comparison view
        if (typeof ComparisonModule !== 'undefined') {
            ComparisonModule.updateComparison();
        }

        console.log('⚖️ Added to comparison:', this.currentJewelry.name);
    },

    /**
     * Save jewelry to user's collection
     */
    saveToCollection() {
        if (!this.currentJewelry) return;

        // Check if already saved
        const alreadySaved = AppState.savedItems.some(item => item.id === this.currentJewelry.id);

        if (alreadySaved) {
            alert(window.i18n ? window.i18n.t('visualizer.alertAlreadySaved') : 'This item is already in your collection!');
            return;
        }

        // Add to saved items
        AppState.savedItems.push(this.currentJewelry);

        // Save to local storage
        if (typeof StorageManager !== 'undefined') {
            StorageManager.saveState();
        }

        // Show success message
        this.showSaveSuccess();

        console.log('💾 Saved to collection:', this.currentJewelry.name);
    },

    /**
     * Show save success message
     */
    showSaveSuccess() {
        const saveBtn = document.getElementById('save-button');
        if (!saveBtn) return;

        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = window.i18n ? window.i18n.t('visualizer.toastSaved') : '✓ Saved!';
        saveBtn.disabled = true;

        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    },

};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.Visualizer = Visualizer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Visualizer;
}
