/**
 * Tattoo Artist Tax Deduction Tracker: V2
 * Poli International Studio Tools
 * Pure client-side record keeping application.
 */

(function () {
  'use strict';

  // Storage keys
  const STORAGE_KEY_EXPENSES = 'poli-tax-tracker';
  const STORAGE_KEY_CATEGORIES = 'poli-tax-categories';
  const STORAGE_KEY_CURRENCY = 'poli-tax-currency';

  // Translation helper delegating to the unified internationalisation engine
  function t(key, params) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key, params);
    }
    if (typeof window.t === 'function' && window.t !== t) {
      return window.t(key, params);
    }
    return key;
  }
  window.t = t;

  // Default Categories tailored for tattoo artists, body piercers, and studio owners
  function getDefaultCategories() {
    return [
      t('category.equipment'),
      t('category.supplies'),
      t('category.studio_rent'),
      t('category.sterilisation'),
      t('category.education'),
      t('category.licences'),
      t('category.insurance'),
      t('category.software'),
      t('category.marketing'),
      t('category.travel'),
      t('category.utilities'),
      t('category.other')
    ];
  }

  // DOM Elements
  const filterYearSelect = document.getElementById('filter-year-select');
  const currencySelect = document.getElementById('currency-select');
  const openCatBtn = document.getElementById('open-cat-btn');
  const printSummaryBtn = document.getElementById('print-summary-btn');
  const printYearLabel = document.getElementById('print-year-label');
  const printDateLabel = document.getElementById('print-date-label');

  const totalDeductionsEl = document.getElementById('total-deductions');
  const entryCountEl = document.getElementById('entry-count');
  const travelTotalEl = document.getElementById('travel-total');
  const travelSubtextEl = document.getElementById('travel-subtext');
  const topCategoryEl = document.getElementById('top-category');
  const topCategorySubEl = document.getElementById('top-category-sub');
  const summaryYearTextEl = document.getElementById('summary-year-text');

  // Mode Tabs
  const tabStandard = document.getElementById('tab-standard');
  const tabMileage = document.getElementById('tab-mileage');
  const formStandard = document.getElementById('form-standard');
  const formMileage = document.getElementById('form-mileage');

  // Standard Form inputs
  const expenseDate = document.getElementById('expense-date');
  const expenseCategory = document.getElementById('expense-category');
  const expenseAmount = document.getElementById('expense-amount');
  const expenseSupplier = document.getElementById('expense-supplier');
  const expenseReceiptRef = document.getElementById('expense-receipt-ref');
  const expenseDesc = document.getElementById('expense-desc');
  const addBtn = document.getElementById('add-btn');
  const amountCurrencyLabel = document.getElementById('amount-currency-label');
  const currencySymbolAddon = document.getElementById('currency-symbol-addon');

  // Mileage Form inputs
  const mileageDate = document.getElementById('mileage-date');
  const mileagePurpose = document.getElementById('mileage-purpose');
  const mileageDistance = document.getElementById('mileage-distance');
  const mileageRate = document.getElementById('mileage-rate');
  const mileageExtra = document.getElementById('mileage-extra');
  const mileageReceiptRef = document.getElementById('mileage-receipt-ref');
  const mileageCalcTotal = document.getElementById('mileage-calc-total');
  const addMileageBtn = document.getElementById('add-mileage-btn');

  // Breakdown & SVG
  const breakdownSubtitle = document.getElementById('breakdown-subtitle');
  const exportSummaryBtn = document.getElementById('export-summary-btn');
  const categorySvgChart = document.getElementById('category-svg-chart');
  const categorySummaryBody = document.getElementById('category-summary-body');
  const summaryTotalEntries = document.getElementById('summary-total-entries');
  const summaryTotalAmount = document.getElementById('summary-total-amount');

  // Ledger elements
  const logSearchInput = document.getElementById('log-search-input');
  const logCount = document.getElementById('log-count');
  const exportAllBtn = document.getElementById('export-all-btn');
  const clearBtn = document.getElementById('clear-btn');
  const emptyState = document.getElementById('empty-state');
  const expensesTable = document.getElementById('expenses-table');
  const expensesBody = document.getElementById('expenses-body');

  // Category Modal
  const catModal = document.getElementById('cat-modal');
  const closeCatBtn = document.getElementById('close-cat-btn');
  const doneCatBtn = document.getElementById('done-cat-btn');
  const resetCatBtn = document.getElementById('reset-cat-btn');
  const newCatInput = document.getElementById('new-cat-input');
  const addCatBtn = document.getElementById('add-cat-btn');
  const catList = document.getElementById('cat-list');

  // Application State
  let currentCurrency = localStorage.getItem(STORAGE_KEY_CURRENCY) || '£';
  let activeTab = 'standard'; // 'standard' | 'mileage'

  // Initialize dates to today's LOCAL date in YYYY-MM-DD. toISOString() is UTC,
  // which dates an entry yesterday for anyone east of UTC before their UTC midnight.
  const todayStr = new Date().toLocaleDateString('en-CA');
  expenseDate.value = todayStr;
  mileageDate.value = todayStr;

  // Data helpers
  function loadExpenses() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_EXPENSES) || '[]');
    } catch {
      return [];
    }
  }

  function saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }

  function loadCategories() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_CATEGORIES));
      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
    } catch {
      // fallback
    }
    return getDefaultCategories();
  }

  function saveCategories(categories) {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtMoney(num) {
    const n = Number(num) || 0;
    return currentCurrency + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Update currency display everywhere
  function setCurrency(curr) {
    currentCurrency = curr;
    localStorage.setItem(STORAGE_KEY_CURRENCY, curr);
    currencySelect.value = curr;
    amountCurrencyLabel.textContent = `(${curr})`;
    currencySymbolAddon.textContent = curr;
    updateMileageCalculation();
    render();
  }

  // Populate Categories in Dropdown and Modal
  function populateCategories() {
    const categories = loadCategories();
    const currentVal = expenseCategory.value;

    expenseCategory.innerHTML = '';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      expenseCategory.appendChild(opt);
    });

    if (categories.includes(currentVal)) {
      expenseCategory.value = currentVal;
    } else if (categories.length > 0) {
      expenseCategory.value = categories[0];
    }

    renderCategoryModalList();
  }

  function renderCategoryModalList() {
    const categories = loadCategories();
    catList.innerHTML = '';

    categories.forEach((cat, index) => {
      const item = document.createElement('div');
      item.className = 'cat-item';
      item.setAttribute('role', 'listitem');

      const nameSpan = document.createElement('span');
      nameSpan.className = 'cat-name';
      nameSpan.textContent = cat;

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'cat-actions';

      const renameBtn = document.createElement('button');
      renameBtn.type = 'button';
      renameBtn.className = 'cat-btn';
      renameBtn.textContent = t('cat_modal.rename');
      renameBtn.addEventListener('click', () => {
        const newName = prompt(t('cat_modal.rename_prompt', { name: cat }), cat);
        if (!newName || !newName.trim()) return;
        const trimmed = newName.trim();
        if (trimmed === cat) return;
        if (categories.includes(trimmed)) {
          alert(t('cat_modal.err_exists', { name: trimmed }));
          return;
        }
        categories[index] = trimmed;
        saveCategories(categories);
        populateCategories();
        render();
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'cat-btn cat-btn--danger';
      delBtn.textContent = t('cat_modal.delete');
      delBtn.addEventListener('click', () => {
        if (categories.length <= 1) {
          alert(t('cat_modal.err_min_one'));
          return;
        }
        if (!confirm(t('cat_modal.confirm_delete', { name: cat }))) return;
        categories.splice(index, 1);
        saveCategories(categories);
        populateCategories();
        render();
      });

      actionsDiv.appendChild(renameBtn);
      actionsDiv.appendChild(delBtn);
      item.appendChild(nameSpan);
      item.appendChild(actionsDiv);
      catList.appendChild(item);
    });
  }

  // Populate Year Filter
  function updateYearFilterOptions(expenses) {
    const years = new Set();
    const currentYear = new Date().getFullYear();
    years.add(String(currentYear));

    expenses.forEach(e => {
      if (e.date && e.date.length >= 4) {
        years.add(e.date.slice(0, 4));
      }
    });

    const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
    const selectedVal = filterYearSelect.value;

    filterYearSelect.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = t('toolbar.all_years');
    filterYearSelect.appendChild(allOpt);

    sortedYears.forEach(yr => {
      const opt = document.createElement('option');
      opt.value = yr;
      opt.textContent = t('toolbar.tax_year', { year: yr });
      filterYearSelect.appendChild(opt);
    });

    if (Array.from(filterYearSelect.options).some(o => o.value === selectedVal)) {
      filterYearSelect.value = selectedVal;
    } else {
      filterYearSelect.value = 'all';
    }
  }

  // Calculate Travel Total Live
  function updateMileageCalculation() {
    const dist = parseFloat(mileageDistance.value) || 0;
    const rate = parseFloat(mileageRate.value) || 0;
    const extra = parseFloat(mileageExtra.value) || 0;
    const total = (dist * rate) + extra;
    mileageCalcTotal.textContent = fmtMoney(total);
  }

  mileageDistance.addEventListener('input', updateMileageCalculation);
  mileageRate.addEventListener('input', updateMileageCalculation);
  mileageExtra.addEventListener('input', updateMileageCalculation);

  // Tab switching
  function switchTab(mode) {
    activeTab = mode;
    if (mode === 'standard') {
      tabStandard.classList.add('is-active');
      tabStandard.setAttribute('aria-selected', 'true');
      tabMileage.classList.remove('is-active');
      tabMileage.setAttribute('aria-selected', 'false');
      formStandard.classList.remove('print-only');
      formMileage.classList.add('print-only');
    } else {
      tabMileage.classList.add('is-active');
      tabMileage.setAttribute('aria-selected', 'true');
      tabStandard.classList.remove('is-active');
      tabStandard.setAttribute('aria-selected', 'false');
      formMileage.classList.remove('print-only');
      formStandard.classList.add('print-only');
    }
  }

  tabStandard.addEventListener('click', () => switchTab('standard'));
  tabMileage.addEventListener('click', () => switchTab('mileage'));

  // SVG Chart Generation (Inline SVG, pure vector diagram)
  function renderSvgChart(byCategory, totalAmount) {
    const entries = Object.entries(byCategory).sort((a, b) => b[1].amount - a[1].amount);
    if (!entries.length || totalAmount <= 0) {
      categorySvgChart.setAttribute('height', '40');
      categorySvgChart.setAttribute('viewBox', '0 0 700 40');
      categorySvgChart.innerHTML = `<text x="350" y="25" text-anchor="middle" fill="var(--text-muted)" font-size="14">${escHtml(t('chart.no_entries'))}</text>`;
      return;
    }

    const rowHeight = 38;
    const chartHeight = entries.length * rowHeight + 20;
    const chartWidth = 740;
    const barStartX = 240;
    const barMaxWidth = 360;

    categorySvgChart.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
    categorySvgChart.setAttribute('height', String(chartHeight));

    const maxCatAmount = entries[0][1].amount;

    const rowsMarkup = entries.map(([catName, data], idx) => {
      const y = idx * rowHeight + 15;
      const pct = (data.amount / totalAmount) * 100;
      const barW = Math.max(4, Math.round((data.amount / maxCatAmount) * barMaxWidth));
      const displayCat = catName.length > 28 ? catName.slice(0, 26) + '…' : catName;
      const valLabel = `${fmtMoney(data.amount)} (${pct.toFixed(1)}%)`;

      return `
        <g>
          <text x="${barStartX - 12}" y="${y + 16}" text-anchor="end" fill="var(--text-main)" font-size="13" font-weight="600">${escHtml(displayCat)}</text>
          <rect x="${barStartX}" y="${y + 3}" width="${barMaxWidth}" height="18" rx="4" fill="var(--bg-input)" stroke="var(--border)" />
          <rect class="svg-bar-rect" x="${barStartX}" y="${y + 3}" width="${barW}" height="18" rx="4" fill="var(--primary)" stroke="var(--border)" />
          <rect x="${barStartX}" y="${y + 3}" width="${barW}" height="18" rx="4" fill="url(#bar-hatch)" opacity="0.25" />
          <text x="${barStartX + barW + 10}" y="${y + 16}" fill="var(--text-main)" font-size="12" font-weight="700">${escHtml(valLabel)}</text>
        </g>
      `;
    }).join('');

    categorySvgChart.innerHTML = `
      <defs>
        <pattern id="bar-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--border)" stroke-width="2" />
        </pattern>
      </defs>
      ${rowsMarkup}
    `;
  }

  // Main Render Function
  function render() {
    const allExpenses = loadExpenses();
    updateYearFilterOptions(allExpenses);

    const selectedYear = filterYearSelect.value;
    const isAllYears = selectedYear === 'all';

    // Update Print Metadata
    const printDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    printDateLabel.textContent = t('print.generated', { date: printDate });
    printYearLabel.textContent = isAllYears ? t('print.period_all') : t('print.period_year', { year: selectedYear });

    // Filter by selected year
    const filteredExpenses = isAllYears
      ? allExpenses
      : allExpenses.filter(e => e.date && e.date.startsWith(selectedYear));

    summaryYearTextEl.textContent = isAllYears ? t('summary.all_years_label') : t('summary.year_filter', { year: selectedYear });
    breakdownSubtitle.textContent = t('breakdown.subtitle', { year: isAllYears ? t('summary.all_years_label') : selectedYear });

    // Aggregate statistics
    let totalDeductions = 0;
    let travelExpenseTotal = 0;
    let totalMilesRecorded = 0;
    const byCategory = {};

    filteredExpenses.forEach(e => {
      const amt = parseFloat(e.amount) || 0;
      totalDeductions += amt;

      const cat = e.category || t('category.other');
      if (!byCategory[cat]) {
        byCategory[cat] = { amount: 0, count: 0 };
      }
      byCategory[cat].amount += amt;
      byCategory[cat].count += 1;

      // Track travel/mileage metrics
      if (cat.toLowerCase().includes('travel') || cat.toLowerCase().includes('mileage')) {
        travelExpenseTotal += amt;
      }
      if (e.mileageDist) {
        totalMilesRecorded += parseFloat(e.mileageDist) || 0;
      }
    });

    // Populate Top Cards
    totalDeductionsEl.textContent = fmtMoney(totalDeductions);
    entryCountEl.textContent = filteredExpenses.length;
    travelTotalEl.textContent = fmtMoney(travelExpenseTotal);
    travelSubtextEl.textContent = totalMilesRecorded > 0
      ? t('summary.miles_sub', { dist: totalMilesRecorded.toFixed(1) })
      : t('summary.travel_sub_expenses');

    const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1].amount - a[1].amount);
    if (sortedCategories.length > 0) {
      const [topName, topData] = sortedCategories[0];
      topCategoryEl.textContent = topName;
      topCategorySubEl.textContent = `${fmtMoney(topData.amount)} (${((topData.amount / (totalDeductions || 1)) * 100).toFixed(0)}%)`;
    } else {
      topCategoryEl.textContent = t('summary.no_category');
      topCategorySubEl.textContent = t('summary.highest_exp');
    }

    // Render SVG Chart
    renderSvgChart(byCategory, totalDeductions);

    // Render Annual Category Table
    categorySummaryBody.innerHTML = '';
    if (sortedCategories.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" class="table-empty-cell">${escHtml(t('log.empty'))}</td>`;
      categorySummaryBody.appendChild(tr);
    } else {
      sortedCategories.forEach(([cat, data]) => {
        const pct = totalDeductions > 0 ? ((data.amount / totalDeductions) * 100).toFixed(1) : '0.0';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td data-label="${escHtml(t('table.category'))}"><strong>${escHtml(cat)}</strong></td>
          <td data-label="${escHtml(t('table.entries_count'))}">${data.count}</td>
          <td data-label="${escHtml(t('table.amount'))}" class="amount-cell">${fmtMoney(data.amount)}</td>
          <td data-label="${escHtml(t('table.percent'))}">${pct}%</td>
        `;
        categorySummaryBody.appendChild(tr);
      });
    }
    summaryTotalEntries.textContent = filteredExpenses.length;
    summaryTotalAmount.textContent = fmtMoney(totalDeductions);

    // Filter Running Ledger by Search Query
    const searchQuery = (logSearchInput.value || '').trim().toLowerCase();
    const ledgerExpenses = searchQuery
      ? filteredExpenses.filter(e =>
          (e.supplier && e.supplier.toLowerCase().includes(searchQuery)) ||
          (e.desc && e.desc.toLowerCase().includes(searchQuery)) ||
          (e.category && e.category.toLowerCase().includes(searchQuery)) ||
          (e.receiptRef && e.receiptRef.toLowerCase().includes(searchQuery))
        )
      : filteredExpenses;

    logCount.textContent = t('log.count', {
      count: ledgerExpenses.length,
      s: ledgerExpenses.length === 1 ? '' : 's'
    });

    if (ledgerExpenses.length === 0) {
      emptyState.hidden = false;
      expensesTable.hidden = true;
      emptyState.textContent = searchQuery ? t('log.no_match') : t('log.empty');
      expensesBody.innerHTML = '';
    } else {
      emptyState.hidden = true;
      expensesTable.hidden = false;

      // Render reverse chronological
      expensesBody.innerHTML = [...ledgerExpenses].reverse().map((e) => {
        const originalIndex = allExpenses.indexOf(e);
        return `<tr>
          <td data-label="${escHtml(t('table.date'))}"><strong>${escHtml(e.date)}</strong></td>
          <td data-label="${escHtml(t('table.category'))}"><span class="badge-tag">${escHtml(e.category)}</span></td>
          <td data-label="${escHtml(t('table.amount'))}" class="amount-cell">${fmtMoney(parseFloat(e.amount))}</td>
          <td data-label="${escHtml(t('table.supplier'))}">${escHtml(e.supplier || '-')}</td>
          <td data-label="${escHtml(t('table.receipt_ref'))}" class="receipt-ref-cell">${e.receiptRef ? escHtml(e.receiptRef) : '<span class="empty-dash">-</span>'}</td>
          <td data-label="${escHtml(t('table.desc'))}" class="desc-cell" title="${escHtml(e.desc || '')}">${escHtml(e.desc || '-')}</td>
          <td class="no-print col-actions">
            <button type="button" class="del-btn" data-idx="${originalIndex}" aria-label="${escHtml(t('table.delete'))}" title="${escHtml(t('table.delete'))}">×</button>
          </td>
        </tr>`;
      }).join('');
    }
  }

  // Handle Standard Expense Submission
  addBtn.addEventListener('click', () => {
    const date = expenseDate.value;
    const category = expenseCategory.value;
    const amountStr = expenseAmount.value.trim();

    if (!date || !category || !amountStr) {
      alert(t('alert.fill_required'));
      return;
    }
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert(t('alert.amount_positive'));
      return;
    }

    const expenses = loadExpenses();
    expenses.push({
      date,
      category,
      amount: amount.toFixed(2),
      supplier: expenseSupplier.value.trim(),
      receiptRef: expenseReceiptRef.value.trim(),
      desc: expenseDesc.value.trim(),
      createdAt: new Date().toISOString()
    });

    saveExpenses(expenses);

    // Reset inputs but keep date on today
    expenseAmount.value = '';
    expenseSupplier.value = '';
    expenseReceiptRef.value = '';
    expenseDesc.value = '';
    render();
  });

  // Handle Travel & Mileage Submission
  addMileageBtn.addEventListener('click', () => {
    const date = mileageDate.value;
    const purpose = mileagePurpose.value.trim();
    const dist = parseFloat(mileageDistance.value) || 0;
    const rate = parseFloat(mileageRate.value) || 0;
    const extra = parseFloat(mileageExtra.value) || 0;
    const calculatedTotal = (dist * rate) + extra;

    if (!date || (!purpose && dist <= 0 && extra <= 0)) {
      alert(t('alert.mileage_required'));
      return;
    }
    if (calculatedTotal <= 0) {
      alert(t('alert.amount_positive'));
      return;
    }

    const categories = loadCategories();
    // Use Travel & Mileage category if available, else first category
    let targetCategory = categories.find(c => c.toLowerCase().includes('travel') || c.toLowerCase().includes('mileage'));
    if (!targetCategory) targetCategory = categories[0] || t('mileage.travel_category');

    const descNote = t('mileage.notes_format', {
      purpose: purpose || t('mileage.default_purpose'),
      dist: dist > 0 ? t('mileage.units', { count: dist }) : '0',
      rate: rate > 0 ? fmtMoney(rate) : '0',
      extra: extra > 0 ? fmtMoney(extra) : '0'
    });

    const expenses = loadExpenses();
    expenses.push({
      date,
      category: targetCategory,
      amount: calculatedTotal.toFixed(2),
      supplier: purpose || t('mileage.travel_category'),
      receiptRef: mileageReceiptRef.value.trim(),
      desc: descNote,
      mileageDist: dist > 0 ? dist : undefined,
      createdAt: new Date().toISOString()
    });

    saveExpenses(expenses);

    // Reset mileage inputs
    mileagePurpose.value = '';
    mileageDistance.value = '';
    mileageRate.value = '';
    mileageExtra.value = '';
    mileageReceiptRef.value = '';
    updateMileageCalculation();
    render();
  });

  // Handle Delete Expense
  expensesBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.del-btn');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    if (isNaN(idx)) return;

    if (!confirm(t('alert.confirm_delete_expense'))) return;
    const expenses = loadExpenses();
    if (idx >= 0 && idx < expenses.length) {
      expenses.splice(idx, 1);
      saveExpenses(expenses);
      render();
    }
  });

  // Handle Clear All
  clearBtn.addEventListener('click', () => {
    if (!confirm(t('alert.confirm_clear_all'))) return;
    saveExpenses([]);
    render();
  });

  // Export Full Ledger as CSV
  exportAllBtn.addEventListener('click', () => {
    const allExpenses = loadExpenses();
    const selectedYear = filterYearSelect.value;
    const exportData = selectedYear === 'all'
      ? allExpenses
      : allExpenses.filter(e => e.date && e.date.startsWith(selectedYear));

    if (!exportData.length) {
      alert(t('alert.no_export_data'));
      return;
    }

    const header = t('csv.header_full');
    const rows = exportData.map(e => [
      e.date,
      e.category,
      e.amount,
      e.supplier || '',
      e.receiptRef || '',
      e.desc || ''
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

    const csvContent = [header, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `tax-deductions-${selectedYear === 'all' ? 'all' : selectedYear}.csv`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Export Year Summary by Category as CSV
  exportSummaryBtn.addEventListener('click', () => {
    const allExpenses = loadExpenses();
    const selectedYear = filterYearSelect.value;
    const filteredExpenses = selectedYear === 'all'
      ? allExpenses
      : allExpenses.filter(e => e.date && e.date.startsWith(selectedYear));

    if (!filteredExpenses.length) {
      alert(t('alert.no_export_data'));
      return;
    }

    let total = 0;
    const byCategory = {};
    filteredExpenses.forEach(e => {
      const amt = parseFloat(e.amount) || 0;
      total += amt;
      const cat = e.category || t('csv.other_category');
      if (!byCategory[cat]) byCategory[cat] = { count: 0, amount: 0 };
      byCategory[cat].count += 1;
      byCategory[cat].amount += amt;
    });

    const header = t('csv.header_summary');
    const sorted = Object.entries(byCategory).sort((a, b) => b[1].amount - a[1].amount);
    const rows = sorted.map(([cat, data]) => {
      const pct = total > 0 ? ((data.amount / total) * 100).toFixed(1) : '0.0';
      return [
        selectedYear === 'all' ? t('csv.all_years') : selectedYear,
        cat,
        data.count,
        data.amount.toFixed(2),
        pct + '%'
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });

    // Add total line
    rows.push([
      selectedYear === 'all' ? t('csv.all_years') : selectedYear,
      t('csv.total'),
      filteredExpenses.length,
      total.toFixed(2),
      '100%'
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

    const csvContent = [header, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `tax-category-summary-${selectedYear === 'all' ? 'all' : selectedYear}.csv`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Print Summary Handler
  printSummaryBtn.addEventListener('click', () => {
    window.print();
  });

  // Event Listeners for Filters
  filterYearSelect.addEventListener('change', render);
  currencySelect.addEventListener('change', (e) => setCurrency(e.target.value));
  logSearchInput.addEventListener('input', render);

  // Category Editor Modal Handlers
  openCatBtn.addEventListener('click', () => {
    populateCategories();
    catModal.classList.add('is-active');
    newCatInput.focus();
  });

  function closeCategoryModal() {
    catModal.classList.remove('is-active');
  }

  closeCatBtn.addEventListener('click', closeCategoryModal);
  doneCatBtn.addEventListener('click', closeCategoryModal);

  catModal.addEventListener('click', (e) => {
    if (e.target === catModal) closeCategoryModal();
  });

  addCatBtn.addEventListener('click', () => {
    const name = newCatInput.value.trim();
    if (!name) {
      alert(t('cat_modal.err_empty'));
      return;
    }
    const categories = loadCategories();
    if (categories.includes(name)) {
      alert(t('cat_modal.err_exists', { name }));
      return;
    }
    categories.push(name);
    saveCategories(categories);
    newCatInput.value = '';
    populateCategories();
    render();
  });

  newCatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCatBtn.click();
    }
  });

  resetCatBtn.addEventListener('click', () => {
    if (!confirm(t('cat_modal.confirm_reset'))) return;
    saveCategories(getDefaultCategories());
    populateCategories();
    render();
  });

  // Keyboard shortcut ESC to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !catModal.classList.contains('print-only')) {
      closeCategoryModal();
    }
  });

  // Apply i18n data attributes across static HTML
  function applyI18n() {
    if (window.i18n && typeof window.i18n.applyI18n === 'function') {
      window.i18n.applyI18n();
      return;
    }

    // Fallback if standalone
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', t(key));
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (key) {
        el.setAttribute('aria-label', t(key));
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', t(key));
      }
    });
  }

  // Language selector integration
  const langSelect = document.getElementById('lang-select');
  if (langSelect && window.i18n) {
    langSelect.value = window.i18n.getLang();
    langSelect.addEventListener('change', (e) => {
      window.i18n.setLang(e.target.value);
    });
  }

  window.onLanguageChange = function() {
    applyI18n();
    populateCategories();
    render();
  };

  // Initialize
  applyI18n();
  setCurrency(currentCurrency);
  populateCategories();
  render();

})();
