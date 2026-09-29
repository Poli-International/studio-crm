/**
 * Ink Inventory Management System
 * Poli International Tattoo Tools Suite
 * 
 * Allows tattoo artists to record their shop/station ink inventory by brand, colour, and batch.
 * Stored 100% locally in the browser's localStorage (zero server transmission).
 * Used by the Target Solver and Color Mixer to restrict formulas to inks the artist actually owns.
 */

const InkInventory = {
  STORAGE_KEY: 'poli_ink_inventory',

  // Default starter palette presets for 1-click setup
  PRESETS: {
    dynamic_essential: {
      name: 'Dynamic Black & White Basics',
      brand: 'Dynamic',
      inks: [
        { brand: 'Dynamic', shadeName: 'Standard Black (BLK)', pigmentClass: 'black', hex: '#0a0a0a', inStock: true },
        { brand: 'Dynamic', shadeName: 'Triple Black (TBK)', pigmentClass: 'black', hex: '#050505', inStock: true },
        { brand: 'Dynamic', shadeName: 'Heavy White (HW)', pigmentClass: 'white', hex: '#fcfcfc', inStock: true }
      ]
    },
    eternal_primary_12: {
      name: 'Eternal 12-Color Primary Set',
      brand: 'Eternal',
      inks: [
        { brand: 'Eternal', shadeName: 'Lining Black', pigmentClass: 'black', hex: '#0a0a0a', inStock: true },
        { brand: 'Eternal', shadeName: 'White', pigmentClass: 'white', hex: '#fcfcfc', inStock: true },
        { brand: 'Eternal', shadeName: 'Lipstick Red', pigmentClass: 'red', hex: '#d61818', inStock: true },
        { brand: 'Eternal', shadeName: 'Bright Yellow', pigmentClass: 'yellow', hex: '#ffea00', inStock: true },
        { brand: 'Eternal', shadeName: 'True Blue', pigmentClass: 'blue', hex: '#1446a0', inStock: true },
        { brand: 'Eternal', shadeName: 'Bright Orange', pigmentClass: 'orange', hex: '#ff7700', inStock: true },
        { brand: 'Eternal', shadeName: 'Dark Green', pigmentClass: 'green', hex: '#1b8a3e', inStock: true },
        { brand: 'Eternal', shadeName: 'Purple Concentrated', pigmentClass: 'purple', hex: '#6a1b9a', inStock: true },
        { brand: 'Eternal', shadeName: 'Dark Brown', pigmentClass: 'brown', hex: '#6d4323', inStock: true },
        { brand: 'Eternal', shadeName: 'Magenta', pigmentClass: 'magenta', hex: '#d81b60', inStock: true },
        { brand: 'Eternal', shadeName: 'Sky Blue', pigmentClass: 'blue', hex: '#29b6f6', inStock: true },
        { brand: 'Eternal', shadeName: 'Lime Green', pigmentClass: 'green', hex: '#7cb342', inStock: true }
      ]
    },
    intenze_essential: {
      name: 'Intenze Core Palette',
      brand: 'Intenze',
      inks: [
        { brand: 'Intenze', shadeName: 'Zuper Black', pigmentClass: 'black', hex: '#080808', inStock: true },
        { brand: 'Intenze', shadeName: 'Snow White Opaque', pigmentClass: 'white', hex: '#fcfcfc', inStock: true },
        { brand: 'Intenze', shadeName: 'Bright Red', pigmentClass: 'red', hex: '#d61818', inStock: true },
        { brand: 'Intenze', shadeName: 'Banana Cream (Yellow)', pigmentClass: 'yellow', hex: '#ffea00', inStock: true },
        { brand: 'Intenze', shadeName: 'Mario\'s Blue', pigmentClass: 'blue', hex: '#1446a0', inStock: true },
        { brand: 'Intenze', shadeName: 'Tangerine', pigmentClass: 'orange', hex: '#ff7700', inStock: true },
        { brand: 'Intenze', shadeName: 'True Green', pigmentClass: 'green', hex: '#1b8a3e', inStock: true },
        { brand: 'Intenze', shadeName: 'Dark Purple', pigmentClass: 'purple', hex: '#6a1b9a', inStock: true },
        { brand: 'Intenze', shadeName: 'Dark Brown', pigmentClass: 'brown', hex: '#6d4323', inStock: true }
      ]
    },
    master_standard_10: {
      name: 'Standard 10 Core Pigments (Universal)',
      brand: 'Standard',
      inks: [
        { brand: 'Standard', shadeName: 'Carbon Black', pigmentClass: 'black', hex: '#0a0a0a', inStock: true },
        { brand: 'Standard', shadeName: 'Titanium White', pigmentClass: 'white', hex: '#fcfcfc', inStock: true },
        { brand: 'Standard', shadeName: 'Primary Red', pigmentClass: 'red', hex: '#d61818', inStock: true },
        { brand: 'Standard', shadeName: 'Primary Yellow', pigmentClass: 'yellow', hex: '#ffea00', inStock: true },
        { brand: 'Standard', shadeName: 'Primary Blue', pigmentClass: 'blue', hex: '#1446a0', inStock: true },
        { brand: 'Standard', shadeName: 'Secondary Orange', pigmentClass: 'orange', hex: '#ff7700', inStock: true },
        { brand: 'Standard', shadeName: 'Secondary Green', pigmentClass: 'green', hex: '#1b8a3e', inStock: true },
        { brand: 'Standard', shadeName: 'Secondary Purple', pigmentClass: 'purple', hex: '#6a1b9a', inStock: true },
        { brand: 'Standard', shadeName: 'Earth Brown', pigmentClass: 'brown', hex: '#6d4323', inStock: true },
        { brand: 'Standard', shadeName: 'Primary Magenta', pigmentClass: 'magenta', hex: '#d81b60', inStock: true }
      ]
    }
  },

  generateId() {
    return 'ink_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7);
  },

  getAll() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      // Seed with initial master standard set
      const initial = this.PRESETS.master_standard_10.inks.map(ink => ({
        ...ink,
        id: this.generateId(),
        batchNumber: '',
        onHand: true,
        notes: '',
        createdAt: new Date().toISOString()
      }));
      this.saveAll(initial);
      return initial;
    }
    try {
      const parsed = JSON.parse(stored);
      // Normalize onHand property
      return parsed.map(item => ({
        ...item,
        onHand: item.onHand !== undefined ? item.onHand : (item.inStock !== false)
      }));
    } catch (e) {
      console.error('Error parsing ink inventory:', e);
      return [];
    }
  },

  saveAll(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  },

  getOnHand() {
    return this.getAll().filter(item => item.onHand !== false);
  },

  getInStock() {
    // Backward compatibility alias
    return this.getOnHand();
  },

  add(item) {
    const all = this.getAll();
    const newItem = {
      id: this.generateId(),
      brand: item.brand || 'Custom',
      shadeName: item.shadeName || 'Custom Shade',
      pigmentClass: item.pigmentClass || 'red',
      hex: item.hex || '#d61818',
      batchNumber: item.batchNumber || '',
      onHand: item.onHand !== false && item.inStock !== false,
      notes: item.notes || '',
      createdAt: new Date().toISOString()
    };
    all.push(newItem);
    this.saveAll(all);
    return newItem;
  },

  update(id, updatedFields) {
    const all = this.getAll();
    const index = all.findIndex(i => i.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...updatedFields, updatedAt: new Date().toISOString() };
    this.saveAll(all);
    return all[index];
  },

  toggleOnHand(id) {
    const all = this.getAll();
    const item = all.find(i => i.id === id);
    if (item) {
      item.onHand = !item.onHand;
      item.inStock = item.onHand;
      this.saveAll(all);
      return item.onHand;
    }
    return false;
  },

  toggleStock(id) {
    // Backward compatibility alias
    return this.toggleOnHand(id);
  },

  delete(id) {
    const all = this.getAll();
    const filtered = all.filter(i => i.id !== id);
    this.saveAll(filtered);
    return filtered.length < all.length;
  },

  loadPreset(presetKey, mode = 'append') {
    const preset = this.PRESETS[presetKey];
    if (!preset) return 0;

    let all = mode === 'replace' ? [] : this.getAll();
    const newItems = preset.inks.map(ink => ({
      ...ink,
      id: this.generateId(),
      batchNumber: '',
      onHand: true,
      notes: `Loaded from ${preset.name}`,
      createdAt: new Date().toISOString()
    }));

    all = [...all, ...newItems];
    this.saveAll(all);
    return newItems.length;
  },

  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  exportJSON() {
    const all = this.getAll();
    const str = JSON.stringify(all, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-ink-inventory-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data)) throw new Error('Expected an array of ink records');
      const existing = this.getAll();
      const newItems = data.map(item => {
        const onHand = item.onHand !== undefined ? Boolean(item.onHand) : (item.inStock !== false);
        return {
          id: this.generateId(),
          brand: item.brand || 'Custom',
          shadeName: item.shadeName || 'Custom Shade',
          pigmentClass: item.pigmentClass || 'red',
          hex: item.hex || '#d61818',
          batchNumber: item.batchNumber || '',
          onHand: onHand,
          inStock: onHand,
          notes: item.notes || '',
          createdAt: item.createdAt || new Date().toISOString()
        };
      });
      const combined = [...existing, ...newItems];
      this.saveAll(combined);
      return { success: true, count: newItems.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

window.InkInventory = InkInventory;
