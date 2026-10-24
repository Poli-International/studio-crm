/**
 * Poli International - Machine Voltage Configurator
 * My Machines Storage & Station Wall Print Engine (V2)
 * 
 * Rules:
 * - Persistent browser storage under 'poli_machine_voltage_my_machines'.
 * - 3-tap post-session evaluation tags.
 * - Validation at point of entry (non-empty name, needle, valid voltage).
 * - Printable card uses local date, never UTC ISO slice.
 */

(function(window) {
    'use strict';

    const STORAGE_KEY = 'poli_machine_voltage_my_machines';

    const MyMachines = {
        machines: [],

        init: function() {
            this.load();
            this.bindEvents();
            this.renderList();
        },

        load: function() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                if (data) {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        this.machines = parsed;
                    }
                }
            } catch (e) {
                this.machines = [];
            }
        },

        save: function() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.machines));
            } catch (e) {
                // local storage unavailable or quota exceeded
            }
        },

        addMachine: function(record) {
            this.machines.unshift(record);
            this.save();
            this.renderList();
        },

        deleteMachine: function(id) {
            this.machines = this.machines.filter(m => m.id !== id);
            this.save();
            this.renderList();
        },

        updateEvaluation: function(id, newEval) {
            const mach = this.machines.find(m => m.id === id);
            if (mach) {
                mach.evaluation = newEval;
                this.save();
                this.renderList();
            }
        },

        bindEvents: function() {
            const form = document.getElementById('machineForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmit();
                });
            }

            const filterSelect = document.getElementById('archFilter');
            if (filterSelect) {
                filterSelect.addEventListener('change', () => {
                    this.renderList();
                });
            }

            const printBtn = document.getElementById('printCardBtn');
            if (printBtn) {
                printBtn.addEventListener('click', () => {
                    this.triggerPrint();
                });
            }

            // Quick save from Configurator
            const quickSaveBtn = document.getElementById('quickSaveCurrentBtn');
            if (quickSaveBtn) {
                quickSaveBtn.addEventListener('click', () => {
                    this.handleQuickSave();
                });
            }

            // Listen for language change to update rendered table
            window.addEventListener('poli-language-changed', () => {
                this.renderList();
            });
        },

        handleFormSubmit: function() {
            const nameEl = document.getElementById('mach-name');
            const typeEl = document.getElementById('mach-type');
            const strokeEl = document.getElementById('mach-stroke');
            const techEl = document.getElementById('mach-tech');
            const voltageEl = document.getElementById('mach-voltage');
            const needleEl = document.getElementById('mach-needle');
            const notesEl = document.getElementById('mach-notes');
            const errBox = document.getElementById('formErrorMsg');

            if (!nameEl || !voltageEl || !needleEl) return;

            const name = nameEl.value.trim();
            const voltageNum = parseFloat(voltageEl.value);
            const needle = needleEl.value.trim();

            // Validation at point of entry
            if (!name) {
                this.showError(errBox, PoliI18n.t('machines.val.required_name'));
                nameEl.focus();
                return;
            }

            if (isNaN(voltageNum) || voltageNum < 3.0 || voltageNum > 18.0) {
                this.showError(errBox, PoliI18n.t('machines.val.required_voltage'));
                voltageEl.focus();
                return;
            }

            if (!needle) {
                this.showError(errBox, PoliI18n.t('machines.val.required_needle'));
                needleEl.focus();
                return;
            }

            const selectedEvalRadio = document.querySelector('input[name="mach-eval"]:checked');
            const evaluation = selectedEvalRadio ? selectedEvalRadio.value : 'worked';

            if (errBox) errBox.hidden = true;

            const newRecord = {
                id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                name: name,
                type: typeEl.value,
                stroke: strokeEl.value,
                tech: techEl.value,
                voltage: voltageNum.toFixed(1),
                needle: needle,
                notes: notesEl ? notesEl.value.trim() : '',
                evaluation: evaluation,
                savedAt: new Date().toLocaleDateString()
            };

            this.addMachine(newRecord);

            // Reset form inputs (start empty as per rules)
            nameEl.value = '';
            voltageEl.value = '';
            needleEl.value = '';
            if (notesEl) notesEl.value = '';

            // Switch to list view smoothly
            const emptyBox = document.getElementById('machineEmptyMsg');
            if (emptyBox) emptyBox.hidden = true;
        },

        handleQuickSave: function() {
            const machType = document.getElementById('machine-type');
            const strokeLength = document.getElementById('stroke-length');
            const activeTechBtn = document.querySelector('.tech-btn.active');
            const minVEl = document.getElementById('min-voltage');
            const maxVEl = document.getElementById('max-voltage');

            if (!machType || !strokeLength || !activeTechBtn) return;

            const type = machType.value;
            const stroke = strokeLength.value;
            const tech = activeTechBtn.dataset.tech;
            const minV = minVEl ? minVEl.textContent : '6.5';
            const maxV = maxVEl ? maxVEl.textContent : '8.5';
            const midV = ((parseFloat(minV) + parseFloat(maxV)) / 2).toFixed(1);

            const promptName = type === 'rotary'
                ? PoliI18n.t('machines.quick.rotary_setup', { stroke: stroke })
                : PoliI18n.t('machines.quick.coil_setup', { stroke: stroke });

            const record = {
                id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                name: promptName,
                type: type,
                stroke: stroke,
                tech: tech,
                voltage: midV,
                needle: PoliI18n.t('machines.quick.standard_setup', { tech: tech.toUpperCase() }),
                notes: PoliI18n.t('machines.quick.saved_from_config', { min: minV, max: maxV }),
                evaluation: 'worked',
                savedAt: new Date().toLocaleDateString()
            };

            this.addMachine(record);

            // Switch to My Machines tab
            const myMachTab = document.querySelector('.tool-tab[data-tab="my_machines"]');
            if (myMachTab) {
                myMachTab.click();
            }
        },

        showError: function(box, msg) {
            if (box) {
                box.textContent = msg;
                box.hidden = false;
            }
        },

        getEvalBadgeHtml: function(id, evaluation) {
            let labelKey = 'machines.eval.worked';
            let badgeClass = 'worked';

            if (evaluation === 'too_soft') {
                labelKey = 'machines.eval.too_soft';
                badgeClass = 'too_soft';
            } else if (evaluation === 'too_harsh') {
                labelKey = 'machines.eval.too_harsh';
                badgeClass = 'too_harsh';
            }

            return '<span class="eval-badge ' + badgeClass + '">' + PoliI18n.t(labelKey) + '</span>';
        },

        renderList: function() {
            const tbody = document.getElementById('machineListBody');
            const emptyMsg = document.getElementById('machineEmptyMsg');
            const filterEl = document.getElementById('archFilter');
            const selectedFilter = filterEl ? filterEl.value : 'all';

            if (!tbody) return;

            let filtered = this.machines;
            if (selectedFilter !== 'all') {
                filtered = this.machines.filter(m => m.type === selectedFilter);
            }

            if (filtered.length === 0) {
                tbody.innerHTML = '';
                if (emptyMsg) emptyMsg.hidden = false;
                return;
            }

            if (emptyMsg) emptyMsg.hidden = true;

            let rows = '';
            filtered.forEach(m => {
                const typeLabel = m.type === 'rotary' ? PoliI18n.t('config.machine_type.rotary').split('(')[0].trim() : PoliI18n.t('config.machine_type.coil').split('(')[0].trim();
                const techLabel = PoliI18n.t('config.tech.' + m.tech) || m.tech;

                rows += '<tr>' +
                    '<td data-label="' + PoliI18n.t('print.table.machine') + '"><strong>' + this.escape(m.name) + '</strong></td>' +
                    '<td data-label="' + PoliI18n.t('print.table.type') + '">' + this.escape(typeLabel) + '</td>' +
                    '<td data-label="' + PoliI18n.t('print.table.stroke') + '">' + this.escape(m.stroke) + ' mm</td>' +
                    '<td data-label="' + PoliI18n.t('print.table.tech') + '">' + this.escape(techLabel) + '</td>' +
                    '<td data-label="' + PoliI18n.t('print.table.voltage') + '"><strong>' + this.escape(m.voltage) + ' V</strong></td>' +
                    '<td data-label="' + PoliI18n.t('print.table.needle') + '">' + this.escape(m.needle) + '</td>' +
                    '<td data-label="' + PoliI18n.t('print.table.eval') + '">' +
                        '<div class="eval-control-group">' +
                            this.getEvalBadgeHtml(m.id, m.evaluation) +
                            '<select onchange="window.MyMachines.updateEvaluation(\'' + m.id + '\', this.value)" class="form-select eval-select" aria-label="' + PoliI18n.t('machines.eval.aria_update') + '">' +
                                '<option value="worked"' + (m.evaluation === 'worked' ? ' selected' : '') + '>' + PoliI18n.t('machines.eval.worked') + '</option>' +
                                '<option value="too_soft"' + (m.evaluation === 'too_soft' ? ' selected' : '') + '>' + PoliI18n.t('machines.eval.too_soft') + '</option>' +
                                '<option value="too_harsh"' + (m.evaluation === 'too_harsh' ? ' selected' : '') + '>' + PoliI18n.t('machines.eval.too_harsh') + '</option>' +
                            '</select>' +
                        '</div>' +
                    '</td>' +
                    '<td data-label="' + PoliI18n.t('print.table.notes') + '">' +
                        (m.notes ? '<div class="mach-row-notes">' + this.escape(m.notes) + '</div>' : '') +
                        '<button type="button" class="btn btn--secondary btn--small btn--delete" onclick="window.MyMachines.deleteMachine(\'' + m.id + '\')">' +
                            PoliI18n.t('machines.action.delete') +
                        '</button>' +
                    '</td>' +
                '</tr>';
            });

            tbody.innerHTML = rows;
        },

        triggerPrint: function() {
            // Populate printable header local date
            const dateEl = document.getElementById('printCurrentDate');
            if (dateEl) {
                const now = new Date();
                // Rule 19: Local calendar date, never UTC ISO slice
                dateEl.textContent = now.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            // Sync print table body
            const printTableBody = document.getElementById('printTableBody');
            if (printTableBody) {
                let printRows = '<tr><th colspan="7" class="print-section-th">' + PoliI18n.t('print.table.artist_saved') + '</th></tr>';
                if (this.machines.length === 0) {
                    printRows += '<tr><td colspan="7" class="print-empty-td">' + PoliI18n.t('print.table.no_machines') + '</td></tr>';
                } else {
                    this.machines.forEach(m => {
                        const typeLabel = m.type === 'rotary' ? PoliI18n.t('config.machine_type.rotary_short') : PoliI18n.t('config.machine_type.coil_short');
                        const techLabel = PoliI18n.t('config.tech.' + m.tech) || m.tech;
                        printRows += '<tr>' +
                            '<td><strong>' + this.escape(m.name) + '</strong></td>' +
                            '<td>' + this.escape(typeLabel) + '</td>' +
                            '<td>' + this.escape(m.stroke) + ' mm</td>' +
                            '<td>' + this.escape(techLabel) + '</td>' +
                            '<td><strong>' + this.escape(m.voltage) + ' V</strong></td>' +
                            '<td>' + this.escape(m.needle) + '</td>' +
                            '<td>' + this.escape(m.evaluation.toUpperCase()) + (m.notes ? ' • ' + this.escape(m.notes) : '') + '</td>' +
                        '</tr>';
                    });
                }
                printTableBody.innerHTML = printRows;
            }

            window.print();
        },

        escape: function(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    };

    window.MyMachines = MyMachines;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MyMachines.init());
    } else {
        MyMachines.init();
    }

})(window);
