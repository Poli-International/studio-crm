/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Comparison Module
 * Poli International Widget Suite
 *
 * Side-by-side comparison of up to 4 jewelry items
 * with European A-paper size standards
 */

const ComparisonModule = {
    slots: [],
    canvas: null,
    table: null,
    currentSlot: null,
    selectorModal: null,

    init() {
        this.canvas = document.getElementById('comparison-canvas');
        this.table = document.getElementById('comparison-table');

        // Bind slot click events
        document.querySelectorAll('.compare-slot').forEach(slot => {
            slot.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                const slotNum = parseInt(slot.dataset.slot);
                this.selectItemForSlot(slotNum);
            });
        });

        // Create and append selector modal
        this.createSelectorModal();

        console.log('⚖️ Comparison module initialized');
    },

    createSelectorModal() {
        const t = (k, fb) => (window.i18n ? window.i18n.t(k) : fb);
        const modal = document.createElement('div');
        modal.id = 'jewelry-selector-modal';
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal__overlay"></div>
            <div class="modal__content" style="max-width: 900px;">
                <div class="modal__header">
                    <h3 class="modal__title" data-i18n="compare.modal.title">${t('compare.modal.title', 'Select Jewelry to Compare')}</h3>
                    <button class="modal__close" id="selector-modal-close">✕</button>
                </div>
                <div class="modal__body">
                    <div class="selector-filters" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                        <select id="selector-category" class="filter-select" style="flex: 1; min-width: 150px;">
                            <option value="all" data-i18n="compare.modal.allCategories">${t('compare.modal.allCategories', 'All Categories')}</option>
                            <option value="rings" data-i18n="visualizer.filter.rings">${t('visualizer.filter.rings', 'Rings')}</option>
                            <option value="labrets" data-i18n="visualizer.filter.labrets">${t('visualizer.filter.labrets', 'Labrets & Studs')}</option>
                            <option value="barbells" data-i18n="visualizer.filter.barbells">${t('visualizer.filter.barbells', 'Barbells')}</option>
                            <option value="circular" data-i18n="visualizer.filter.circular">${t('visualizer.filter.circular', 'Circular Barbells')}</option>
                            <option value="captive" data-i18n="visualizer.filter.captive">${t('visualizer.filter.captive', 'Ball Closure Rings (BCR)')}</option>
                            <option value="clickers" data-i18n="visualizer.filter.clickers">${t('visualizer.filter.clickers', 'Clickers')}</option>
                            <option value="plugs" data-i18n="visualizer.filter.plugs">${t('visualizer.filter.plugs', 'Plugs & Tunnels')}</option>
                        </select>
                        <select id="selector-gauge" class="filter-select" style="flex: 1; min-width: 150px;">
                            <option value="all" data-i18n="compare.modal.allGauges">${t('compare.modal.allGauges', 'All Gauges')}</option>
                            <option value="20g">20g</option>
                            <option value="18g">18g</option>
                            <option value="16g">16g</option>
                            <option value="14g">14g</option>
                            <option value="12g">12g</option>
                            <option value="10g">10g</option>
                            <option value="8g">8g</option>
                            <option value="6g">6g</option>
                            <option value="4g">4g</option>
                            <option value="2g">2g</option>
                            <option value="0g">0g</option>
                            <option value="00g">00g</option>
                        </select>
                        <input type="text" id="selector-search" placeholder="${t('compare.modal.searchPlaceholder', 'Search jewelry...')}" data-i18n-placeholder="compare.modal.searchPlaceholder" class="filter-select" style="flex: 1; min-width: 200px; padding: 0.5rem 1rem;">
                    </div>
                    <div id="selector-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; max-height: 400px; overflow-y: auto; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                        <!-- Items will be populated here -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.selectorModal = modal;

        // Bind modal events
        modal.querySelector('.modal__overlay').addEventListener('click', () => this.closeSelectorModal());
        modal.querySelector('#selector-modal-close').addEventListener('click', () => this.closeSelectorModal());

        // Bind filter events
        modal.querySelector('#selector-category').addEventListener('change', () => this.updateSelectorGallery());
        modal.querySelector('#selector-gauge').addEventListener('change', () => this.updateSelectorGallery());
        modal.querySelector('#selector-search').addEventListener('input', () => this.updateSelectorGallery());
    },

    selectItemForSlot(slotNum) {
        this.currentSlot = slotNum;
        this.openSelectorModal();
    },

    openSelectorModal() {
        if (this.selectorModal) {
            this.selectorModal.style.display = 'flex';
            this.updateSelectorGallery();
        }
    },

    closeSelectorModal() {
        if (this.selectorModal) {
            this.selectorModal.style.display = 'none';
        }
    },

    updateSelectorGallery() {
        const gallery = document.getElementById('selector-gallery');
        if (!gallery) return;

        // Get filters
        const category = document.getElementById('selector-category').value;
        const gauge = document.getElementById('selector-gauge').value;
        const search = document.getElementById('selector-search').value.toLowerCase();

        // Get all jewelry
        let items = getAllJewelry();

        // Apply filters
        if (category !== 'all') {
            items = items.filter(item => item.category === category);
        }
        if (gauge !== 'all') {
            items = items.filter(item => item.gauge === gauge);
        }
        if (search) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(search) ||
                (item.description && item.description.toLowerCase().includes(search))
            );
        }

        // Limit to 50 items for performance
        items = items.slice(0, 50);

        if (items.length === 0) {
            const noFound = window.i18n ? window.i18n.t('compare.noJewelryFound') : 'No jewelry found matching filters';
            gallery.innerHTML = `<p style="text-align: center; color: var(--text-tertiary); padding: 2rem;">${noFound}</p>`;
            return;
        }

        // Render items
        gallery.innerHTML = items.map(item => {
            const gaugeMM = (ScaleRenderer.gaugeToInches(item.gauge) * 25.4).toFixed(1);
            return `
                <div class="selector-item" data-id="${item.id}" style="cursor: pointer; padding: 1rem; background: var(--bg-primary); border: 2px solid var(--border-color); border-radius: 8px; transition: all 0.2s; text-align: center;">
                    <canvas width="100" height="100" data-jewelry-id="${item.id}" style="display: block; margin: 0 auto 0.5rem;"></canvas>
                    <h4 style="font-size: 0.875rem; margin-bottom: 0.25rem; color: var(--text-primary);">${item.name}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary);">${item.gauge} (${gaugeMM}mm)</p>
                </div>
            `;
        }).join('');

        // Render canvases
        setTimeout(() => {
            gallery.querySelectorAll('canvas').forEach(canvas => {
                const itemId = canvas.dataset.jewelryId;
                const item = getJewelryById(itemId);
                if (item) {
                    ScaleRenderer.renderJewelry(canvas, item, { showLabels: false, showRuler: false });
                }
            });
        }, 50);

        // Bind click events
        gallery.querySelectorAll('.selector-item').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const itemId = itemEl.dataset.id;
                this.addItemToSlot(itemId, this.currentSlot);
            });

            // Hover effect
            itemEl.addEventListener('mouseenter', () => {
                itemEl.style.borderColor = 'var(--color-rose-gold)';
                itemEl.style.transform = 'translateY(-2px)';
                itemEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });
            itemEl.addEventListener('mouseleave', () => {
                itemEl.style.borderColor = 'var(--border-color)';
                itemEl.style.transform = 'translateY(0)';
                itemEl.style.boxShadow = 'none';
            });
        });
    },

    addItemToSlot(itemId, slotNum) {
        const item = getJewelryById(itemId);
        if (!item) return;

        // Add to comparison items at correct position
        const index = slotNum - 1;

        // Ensure array has enough slots
        while (AppState.comparisonItems.length < slotNum) {
            AppState.comparisonItems.push(null);
        }

        AppState.comparisonItems[index] = item;

        // Close modal
        this.closeSelectorModal();

        // Update comparison view
        this.updateComparison();

        console.log(`⚖️ Added ${item.name} to slot ${slotNum}`);
    },

    updateComparison() {
        const items = AppState.comparisonItems.filter(item => item !== null);

        if (items.length === 0) {
            document.getElementById('comparison-display').style.display = 'none';
            return;
        }

        // Show comparison display
        document.getElementById('comparison-display').style.display = 'block';

        // Update slots
        this.updateSlots(AppState.comparisonItems);

        // Update canvas
        this.updateCanvas(items);

        // Update table
        this.updateTable(items);

        console.log(`⚖️ Comparing ${items.length} items`);
    },

    updateSlots(items) {
        const t = (k, fb) => (window.i18n ? window.i18n.t(k) : fb);
        const removeLabel = t('compare.removeBtn', 'Remove');
        document.querySelectorAll('.compare-slot').forEach((slot, index) => {
            if (items[index]) {
                const item = items[index];
                const gaugeMM = (ScaleRenderer.gaugeToInches(item.gauge) * 25.4).toFixed(1);
                slot.innerHTML = `
                    <div class="compare-slot__filled">
                        <canvas width="80" height="80" data-jewelry-id="${item.id}" style="display: block; margin: 0 auto 0.5rem;"></canvas>
                        <h4 style="font-size: 0.875rem; margin-bottom: 0.25rem;">${item.name}</h4>
                        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${item.gauge} (${gaugeMM}mm)</p>
                        <button class="btn btn--small" onclick="ComparisonModule.removeItem(${index})">✕ ${removeLabel}</button>
                    </div>
                `;
                slot.classList.add('filled');

                // Render canvas
                setTimeout(() => {
                    const canvas = slot.querySelector('canvas');
                    if (canvas) {
                        ScaleRenderer.renderJewelry(canvas, item, { showLabels: false, showRuler: false });
                    }
                }, 50);
            } else {
                // Reset to empty state
                const slotNum = index + 1;
                const slotText = t(`compare.addItem${slotNum}`, `Click to Add Item ${slotNum}`);
                slot.innerHTML = `
                    <div class="compare-slot__empty">
                        <span class="compare-slot__icon">+</span>
                        <span class="compare-slot__text">${slotText}</span>
                    </div>
                `;
                slot.classList.remove('filled');
            }
        });
    },

    updateCanvas(items) {
        if (!this.canvas) return;

        const ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const spacing = this.canvas.width / items.length;

        items.forEach((item, index) => {
            ctx.save();
            ctx.translate((index + 0.5) * spacing, this.canvas.height / 2);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 200;
            tempCanvas.height = 200;
            ScaleRenderer.renderJewelry(tempCanvas, item, { showLabels: false });

            ctx.drawImage(tempCanvas, -100, -100);
            ctx.restore();
        });
    },

    updateTable(items) {
        if (!this.table) return;

        const tbody = document.getElementById('comparison-tbody');
        if (!tbody) return;

        const t = (k, fb) => (window.i18n ? window.i18n.t(k) : fb);

        // Update headers
        items.forEach((item, index) => {
            const header = document.getElementById(`compare-header-${index + 1}`);
            if (header) header.textContent = item.name;
        });

        // Build comparison rows
        const rows = [
            { id: 'Gauge', label: t('visualizer.detail.gauge', 'Gauge') },
            { id: 'Size', label: t('compare.rowSize', 'Size') },
            { id: 'Material', label: t('visualizer.detail.material', 'Material') },
            { id: 'Locations', label: t('compare.rowLocations', 'Locations') },
            { id: 'Weight', label: t('compare.rowWeight', 'Weight') }
        ];

        tbody.innerHTML = rows.map(row => {
            const cells = items.map(item => {
                switch(row.id) {
                    case 'Gauge':
                        const gaugeMM = (ScaleRenderer.gaugeToInches(item.gauge) * 25.4).toFixed(1);
                        return `${item.gauge} (${gaugeMM}mm)`;
                    case 'Size':
                        if (item.diameter) {
                            return `Ø ${item.diameter}" (${(item.diameter * 25.4).toFixed(1)}mm)`;
                        } else if (item.length) {
                            return `L ${item.length}" (${(item.length * 25.4).toFixed(1)}mm)`;
                        }
                        return '--';
                    case 'Material':
                        return item.material;
                    case 'Locations':
                        return item.locations.map(loc => t('location.' + loc, loc)).join(', ');
                    default:
                        return '--';
                }
            }).join('</td><td>');

            return `<tr><td><strong>${row.label}</strong></td><td>${cells}</td></tr>`;
        }).join('');
    },

    removeItem(index) {
        AppState.comparisonItems[index] = null;
        this.updateComparison();
        console.log(`⚖️ Removed item from slot ${index + 1}`);
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.ComparisonModule = ComparisonModule;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComparisonModule;
}
