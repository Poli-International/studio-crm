/**
 * Tool #7: Interactive Jewelry Size Visualizer
 * Jewellery Collection & Size Summary Module (Requirements E and F)
 * Poli International Widget Suite
 *
 * Handles:
 * - Local storage persistence of saved jewellery collection
 * - Printable card with 50 mm physical verification bar
 * - CSV export
 * - Single-line plain-text size summary clipboard export
 * - Form validation (refuses impossible / empty inputs at entry per Rule 4)
 */

const JewelleryCollectionModule = {
    STORAGE_KEY: 'poli_saved_jewellery_collection',
    items: [],

    init() {
        this.loadCollection();
        this.bindEvents();
        this.render();
        console.log('💎 Jewellery Collection Module initialized. Items count:', this.items.length);
    },

    getLocalDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    loadCollection() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    this.items = parsed;
                    return;
                }
            }
        } catch (e) {
            console.warn('Could not read saved collection:', e);
        }
        this.items = [];
    },

    saveCollection() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
        } catch (e) {
            console.warn('Could not save collection:', e);
        }
        this.render();
    },

    addPiece(piece) {
        const t = (k, fb) => (window.i18n ? window.i18n.t(k) : fb);
        // Validate at point of entry (Rule 4)
        if (!piece.placement || !piece.placement.trim()) {
            this.showError(t('collection.error.placement', 'Placement is required (e.g. Helix, Conch, Septum, Rook).'));
            return false;
        }
        if (!piece.name || !piece.name.trim()) {
            this.showError(t('collection.error.name', 'Jewellery type is required (e.g. Curved Barbell, Labret, BCR).'));
            return false;
        }
        const lengthNum = parseFloat(piece.length);
        if (isNaN(lengthNum) || lengthNum <= 0 || lengthNum > 100) {
            this.showError(t('collection.error.length', 'Length/Diameter must be a valid positive number between 1 mm and 100 mm.'));
            return false;
        }

        const newPiece = {
            id: 'jewel_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            placement: piece.placement.trim(),
            name: piece.name.trim(),
            gauge: piece.gauge || '16g (1.2 mm)',
            length: lengthNum.toFixed(1) + ' mm',
            ballSize: piece.ballSize ? (parseFloat(piece.ballSize).toFixed(1) + ' mm') : '—',
            material: piece.material || 'ASTM F-136 Titanium',
            dateAdded: this.getLocalDateString()
        };

        this.items.push(newPiece);
        this.saveCollection();
        this.showToast(t('collection.toast.added', '✓ Piece added to your saved jewellery collection.'));
        return true;
    },

    removePiece(id) {
        const t = (k, fb) => (window.i18n ? window.i18n.t(k) : fb);
        this.items = this.items.filter(item => item.id !== id);
        this.saveCollection();
        this.showToast(t('collection.toast.removed', 'Piece removed from collection.'));
    },

    addFromVisualizer(jewelry) {
        if (!jewelry) return;
        const lengthMM = jewelry.length ? (jewelry.length * 25.4).toFixed(1) : (jewelry.diameter ? (jewelry.diameter * 25.4).toFixed(1) : '8.0');
        const ballMM = jewelry.ballSize ? (jewelry.ballSize * 25.4).toFixed(1) : (jewelry.discSize ? (jewelry.discSize * 25.4).toFixed(1) : '');

        const success = this.addPiece({
            placement: jewelry.placement || 'Ear / Cartilage',
            name: jewelry.name || 'Jewelry Piece',
            gauge: `${jewelry.gauge}g (${jewelry.wireDiameter ? (jewelry.wireDiameter * 25.4).toFixed(1) + ' mm' : '1.2 mm'})`,
            length: lengthMM,
            ballSize: ballMM,
            material: jewelry.material || 'ASTM F-136 Titanium'
        });

        if (success) {
            if (typeof window.switchTab === 'function') {
                window.switchTab('collection');
            }
        }
    },

    render() {
        const tableBody = document.getElementById('collection-table-body');
        const emptyState = document.getElementById('collection-empty-state');
        const countBadge = document.getElementById('collection-count-badge');

        if (countBadge) {
            countBadge.textContent = this.items.length;
        }

        if (!tableBody) return;

        if (this.items.length === 0) {
            tableBody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        const copyTitle = window.i18n ? window.i18n.t('collection.action.copyTitle') : 'Copy Size Summary';
        const summaryBtn = window.i18n ? window.i18n.t('collection.action.summaryBtn') : '📋 Summary';
        const deleteTitle = window.i18n ? window.i18n.t('collection.action.deleteTitle') : 'Delete piece from collection';

        tableBody.innerHTML = this.items.map(item => `
            <tr>
                <td><strong>${this.escapeHtml(item.placement)}</strong></td>
                <td>${this.escapeHtml(item.name)}</td>
                <td>${this.escapeHtml(item.gauge)}</td>
                <td>${this.escapeHtml(item.length)}</td>
                <td>${this.escapeHtml(item.ballSize)}</td>
                <td><small style="color: var(--text-secondary);">${this.escapeHtml(item.material)}</small></td>
                <td><small style="color: var(--text-secondary);">${this.escapeHtml(item.dateAdded)}</small></td>
                <td>
                    <button class="btn btn--small btn--secondary" onclick="JewelleryCollectionModule.copyItemSummary('${item.id}')" title="${copyTitle}">${summaryBtn}</button>
                    <button class="btn btn--small" style="background: transparent; color: var(--color-error); border: 1px solid var(--border-color); margin-left: 4px;" onclick="JewelleryCollectionModule.removePiece('${item.id}')" title="${deleteTitle}">✕</button>
                </td>
            </tr>
        `).join('');
    },

    copyItemSummary(id) {
        const item = this.items.find(it => it.id === id);
        if (!item) return;

        const line = `Placement: ${item.placement} | Gauge: ${item.gauge} | Length/Diameter: ${item.length} | Ball Size: ${item.ballSize} | Material: ${item.material} | Date: ${item.dateAdded}`;
        const toastMsg = window.i18n ? window.i18n.t('collection.toast.copied') : '✓ Size summary copied to clipboard!';
        this.copyToClipboard(line, toastMsg);
    },

    copyToClipboard(text, successMsg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast(successMsg || '✓ Copied to clipboard!');
            }).catch(() => {
                this.fallbackCopy(text, successMsg);
            });
        } else {
            this.fallbackCopy(text, successMsg);
        }
    },

    fallbackCopy(text, successMsg) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            this.showToast(successMsg || '✓ Copied to clipboard!');
        } catch (e) {
            prompt('Copy this summary:', text);
        }
        ta.remove();
    },

    exportCSV() {
        if (this.items.length === 0) {
            this.showError(window.i18n ? window.i18n.t('collection.error.emptyExport') : 'No jewellery pieces in your collection to export.');
            return;
        }

        const headers = ['Placement', 'Jewellery Type', 'Gauge', 'Length or Diameter', 'Ball Size', 'Material', 'Date Added'];
        const rows = this.items.map(it => [
            `"${it.placement.replace(/"/g, '""')}"`,
            `"${it.name.replace(/"/g, '""')}"`,
            `"${it.gauge.replace(/"/g, '""')}"`,
            `"${it.length.replace(/"/g, '""')}"`,
            `"${it.ballSize.replace(/"/g, '""')}"`,
            `"${it.material.replace(/"/g, '""')}"`,
            `"${it.dateAdded}"`
        ]);

        const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `my-jewellery-collection-${this.getLocalDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    printCollection() {
        if (this.items.length === 0) {
            this.showError('No jewellery pieces to print. Add pieces to your collection first.');
            return;
        }
        window.print();
    },

    bindEvents() {
        const addForm = document.getElementById('collection-add-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const placement = document.getElementById('col-input-placement')?.value;
                const name = document.getElementById('col-input-name')?.value;
                const gauge = document.getElementById('col-input-gauge')?.value;
                const length = document.getElementById('col-input-length')?.value;
                const ballSize = document.getElementById('col-input-ball')?.value;
                const material = document.getElementById('col-input-material')?.value;

                const ok = this.addPiece({
                    placement,
                    name,
                    gauge,
                    length,
                    ballSize,
                    material
                });

                if (ok) {
                    addForm.reset();
                }
            });
        }

        const exportBtn = document.getElementById('collection-export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCSV());
        }

        const printBtn = document.getElementById('collection-print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printCollection());
        }
    },

    showError(msg) {
        const errEl = document.getElementById('collection-form-error');
        if (errEl) {
            errEl.textContent = msg;
            errEl.style.display = 'block';
            setTimeout(() => { errEl.style.display = 'none'; }, 4000);
        } else {
            alert(msg);
        }
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'collection-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.background = 'var(--color-surface)';
        toast.style.border = '2px solid var(--color-gold)';
        toast.style.padding = '12px 18px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.zIndex = '9999';
        toast.style.color = 'var(--color-text)';
        toast.style.fontWeight = '600';
        toast.style.fontSize = '0.875rem';
        toast.textContent = msg;

        document.body.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3000);
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
};

if (typeof window !== 'undefined') {
    window.JewelleryCollectionModule = JewelleryCollectionModule;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JewelleryCollectionModule;
}
