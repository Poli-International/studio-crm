// =====================================================
// COMPARISON LOGIC & UI (Photo Slider & Symptom Severity Bar Chart)
// =====================================================

(function() {
  // window.t returns the key itself when a key is missing.
  function tr(key, fallback, params) {
    var s = window.t ? window.t(key, params) : key;
    if (!s || s === key) s = fallback;
    if (params) Object.keys(params).forEach(function(p) { s = s.split('{' + p + '}').join(params[p]); });
    return s;
  }

  let currentSliderPosition = 50; // percentage
  let isDragging = false;
  let selectedSeverityEntryAId = null;
  let selectedSeverityEntryBId = null;

  let cachedPhotoItems = [];
  let currentActiveLightboxId = null;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getMilestonePhotoItems(piece) {
    if (!piece) return [];
    const photoItems = [];
    if (piece.baselinePhoto) {
      photoItems.push({
        id: 'baseline',
        day: 0,
        date: piece.procedureDate || 'Day 0',
        title: (window.t && window.t('healing.gallery.baselineBadge')) || (window.t && window.t('healing.photoComparison.baselineBadge')) || 'Day 0 Baseline',
        url: piece.baselinePhoto,
        isBaseline: true,
        notes: piece.notes || '',
        symptoms: null
      });
    }

    if (piece.entries && piece.entries.length > 0) {
      piece.entries.forEach(entry => {
        if (entry.photo) {
          const dayVal = typeof entry.dayOffset === 'number' ? entry.dayOffset : 0;
          let dayBadgeTitle = `Day ${dayVal} (${entry.date || ''})`;
          if (window.t) {
            dayBadgeTitle = (window.t('healing.gallery.dayBadge', { day: dayVal }) || `Day ${dayVal}`) + (entry.date ? ` (${entry.date})` : '');
          }
          photoItems.push({
            id: String(entry.id),
            day: dayVal,
            date: entry.date || '',
            title: dayBadgeTitle,
            url: entry.photo,
            isBaseline: false,
            notes: entry.notes || '',
            symptoms: entry.symptoms || null
          });
        }
      });
    }

    photoItems.sort((a, b) => a.day - b.day);
    return photoItems;
  }

  function initComparisonUI() {
    initMilestoneViewTabs();
    setupPhotoSliderEvents();
    setupPhotoSelectDropdowns();
    setupSeveritySelectDropdowns();
    window.addEventListener('languageChanged', function() {
      const currentPiece = (window.HealingLog && window.HealingLog.getCurrentPiece && window.HealingLog.getCurrentPiece()) ||
                           (window.TrackerStorage && window.TrackerStorage.getActivePiece && window.TrackerStorage.getActivePiece());
      if (currentPiece) {
        updateComparison(currentPiece);
      }
    });
  }

  function updateComparison(piece) {
    if (!piece) return;
    renderMilestoneGallery(piece);
    renderPhotoComparison(piece);
    renderSeverityComparison(piece);
  }

  // ==========================================
  // PART 0: MILESTONE GALLERY GRID & LIGHTBOX
  // ==========================================
  function renderMilestoneGallery(piece) {
    const galleryGrid = document.getElementById('milestoneGalleryGrid');
    const emptyMsg = document.getElementById('milestoneGalleryEmpty');
    const controls = document.getElementById('milestoneGalleryControls');
    const statCount = document.getElementById('milestoneStatCount');
    const statSpan = document.getElementById('milestoneStatSpan');
    const sortSelect = document.getElementById('milestoneSortSelect');

    if (!galleryGrid) return;

    cachedPhotoItems = getMilestonePhotoItems(piece);

    if (cachedPhotoItems.length === 0) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      if (controls) controls.style.display = 'none';
      galleryGrid.style.display = 'none';
      galleryGrid.innerHTML = '';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (controls) controls.style.display = 'flex';
    galleryGrid.style.display = 'grid';

    const countText = tr('healing.gallery.totalPhotos', '{count} Photos', { count: cachedPhotoItems.length });
    if (statCount) statCount.textContent = countText;

    const firstDay = cachedPhotoItems[0].day;
    const lastDay = cachedPhotoItems[cachedPhotoItems.length - 1].day;
    if (statSpan) {
      statSpan.textContent = tr('healing.gallery.timelineSpan', 'Span: Day {start} ➔ Day {end}', { start: firstDay, end: lastDay });
    }

    const sortOrder = sortSelect ? sortSelect.value : 'asc';
    const itemsToDisplay = cachedPhotoItems.slice();
    if (sortOrder === 'desc') {
      itemsToDisplay.reverse();
    }

    galleryGrid.innerHTML = itemsToDisplay.map(item => {
      let symptomsMarkup = '';
      if (item.symptoms) {
        const chips = [];
        if (item.symptoms.redness > 0) chips.push(`Redness: ${item.symptoms.redness}/3`);
        if (item.symptoms.swelling > 0) chips.push(`Swelling: ${item.symptoms.swelling}/3`);
        if (item.symptoms.pain > 0) chips.push(`Pain: ${item.symptoms.pain}/3`);
        if (item.symptoms.discharge && item.symptoms.discharge !== 'none') chips.push(`Discharge: ${item.symptoms.discharge}`);
        
        if (chips.length > 0) {
          symptomsMarkup = chips.map(c => `<span class="milestone-symptom-chip">${escapeHtml(c)}</span>`).join('');
        } else {
          symptomsMarkup = `<span class="milestone-symptom-chip milestone-symptom-chip--calm">No Symptoms</span>`;
        }
      } else if (item.isBaseline) {
        symptomsMarkup = `<span class="milestone-symptom-chip milestone-symptom-chip--baseline">Baseline Pre-Heal</span>`;
      }

      const notesExcerpt = item.notes
        ? `<p class="milestone-card__notes">${escapeHtml(item.notes.length > 70 ? item.notes.substring(0, 70) + '...' : item.notes)}</p>`
        : '';

      const inspectLabel = (window.t && window.t('healing.gallery.inspectBtn')) || '🔍 Inspect';
      const compareLabel = (window.t && window.t('healing.gallery.compareBtn')) || '↔ Compare';

      return `
        <div class="milestone-card" data-photo-id="${escapeHtml(item.id)}">
          <div class="milestone-card__img-wrap" role="button" tabindex="0" aria-label="${escapeHtml(item.title)}">
            <img src="${item.url}" alt="${escapeHtml(item.title)}" class="milestone-card__img" loading="lazy">
            <span class="milestone-card__badge ${item.isBaseline ? 'milestone-card__badge--baseline' : ''}">
              ${item.isBaseline ? tr('healing.gallery.baselineBadge', 'Day 0 - Baseline') : tr('healing.gallery.dayBadge', 'Day {day}', { day: item.day })}
            </span>
            <span class="milestone-card__zoom-hint">🔍</span>
          </div>
          <div class="milestone-card__body">
            <div class="milestone-card__meta">
              <span class="milestone-card__date">${escapeHtml(item.date)}</span>
            </div>
            ${symptomsMarkup ? `<div class="milestone-card__symptoms">${symptomsMarkup}</div>` : ''}
            ${notesExcerpt}
            <div class="milestone-card__actions">
              <button type="button" class="btn btn--sm btn--outline milestone-btn-inspect" data-photo-id="${escapeHtml(item.id)}">
                ${inspectLabel}
              </button>
              <button type="button" class="btn btn--sm btn--accent milestone-btn-compare" data-photo-id="${escapeHtml(item.id)}">
                ${compareLabel}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners on cards
    galleryGrid.querySelectorAll('.milestone-card__img-wrap, .milestone-btn-inspect').forEach(el => {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.milestone-card');
        const photoId = card ? card.dataset.photoId : null;
        if (photoId) openMilestoneLightbox(photoId);
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const card = this.closest('.milestone-card');
          const photoId = card ? card.dataset.photoId : null;
          if (photoId) openMilestoneLightbox(photoId);
        }
      });
    });

    galleryGrid.querySelectorAll('.milestone-btn-compare').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const photoId = this.dataset.photoId;
        if (photoId) {
          sendPhotoToComparisonSlider(photoId);
        }
      });
    });
  }

  function sendPhotoToComparisonSlider(photoId) {
    switchMilestoneView('slider');

    const selectA = document.getElementById('comparePhotoA');
    const selectB = document.getElementById('comparePhotoB');
    if (!selectA || !selectB) return;

    if (photoId === 'baseline') {
      selectA.value = 'baseline';
      if (selectB.value === 'baseline' && cachedPhotoItems.length > 1) {
        selectB.value = cachedPhotoItems[cachedPhotoItems.length - 1].id;
      }
    } else {
      selectB.value = photoId;
      if (selectA.value === photoId && cachedPhotoItems.length > 1) {
        selectA.value = cachedPhotoItems[0].id;
      }
    }

    updatePhotoDisplay(cachedPhotoItems);

    const sliderContainer = document.getElementById('comparisonSliderContainer');
    if (sliderContainer) {
      sliderContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function switchMilestoneView(viewMode) {
    const galleryView = document.getElementById('milestoneGalleryView');
    const comparisonView = document.getElementById('milestoneComparisonView');
    const tabGallery = document.getElementById('milestoneTabGallery');
    const tabSlider = document.getElementById('milestoneTabSlider');

    if (viewMode === 'slider') {
      if (galleryView) galleryView.style.display = 'none';
      if (comparisonView) comparisonView.style.display = 'block';
      if (tabGallery) {
        tabGallery.classList.remove('milestone-tab-btn--active');
        tabGallery.setAttribute('aria-selected', 'false');
      }
      if (tabSlider) {
        tabSlider.classList.add('milestone-tab-btn--active');
        tabSlider.setAttribute('aria-selected', 'true');
      }
    } else {
      if (galleryView) galleryView.style.display = 'block';
      if (comparisonView) comparisonView.style.display = 'none';
      if (tabGallery) {
        tabGallery.classList.add('milestone-tab-btn--active');
        tabGallery.setAttribute('aria-selected', 'true');
      }
      if (tabSlider) {
        tabSlider.classList.remove('milestone-tab-btn--active');
        tabSlider.setAttribute('aria-selected', 'false');
      }
    }
  }

  function initMilestoneViewTabs() {
    const tabGallery = document.getElementById('milestoneTabGallery');
    const tabSlider = document.getElementById('milestoneTabSlider');
    const sortSelect = document.getElementById('milestoneSortSelect');

    if (tabGallery) {
      tabGallery.addEventListener('click', function() {
        switchMilestoneView('gallery');
      });
    }

    if (tabSlider) {
      tabSlider.addEventListener('click', function() {
        switchMilestoneView('slider');
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        const currentPiece = (window.HealingLog && window.HealingLog.getCurrentPiece && window.HealingLog.getCurrentPiece()) ||
                             (window.TrackerStorage && window.TrackerStorage.getActivePiece && window.TrackerStorage.getActivePiece());
        if (currentPiece) {
          renderMilestoneGallery(currentPiece);
        }
      });
    }

    setupMilestoneLightbox();
  }

  function setupMilestoneLightbox() {
    const modal = document.getElementById('milestoneLightboxModal');
    const backdrop = document.getElementById('milestoneLightboxBackdrop');
    const closeBtn = document.getElementById('milestoneLightboxClose');
    const prevBtn = document.getElementById('milestoneLightboxPrev');
    const nextBtn = document.getElementById('milestoneLightboxNext');
    const compareBtn = document.getElementById('milestoneLightboxCompareBtn');

    if (!modal) return;

    if (backdrop) backdrop.addEventListener('click', closeMilestoneLightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeMilestoneLightbox);

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        navigateLightbox(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        navigateLightbox(1);
      });
    }

    if (compareBtn) {
      compareBtn.addEventListener('click', function() {
        if (currentActiveLightboxId) {
          const id = currentActiveLightboxId;
          closeMilestoneLightbox();
          sendPhotoToComparisonSlider(id);
        }
      });
    }

    window.addEventListener('keydown', function(e) {
      if (!modal || modal.style.display === 'none') return;
      if (e.key === 'Escape') {
        closeMilestoneLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    });
  }

  function openMilestoneLightbox(photoId) {
    const modal = document.getElementById('milestoneLightboxModal');
    const img = document.getElementById('milestoneLightboxImg');
    const badge = document.getElementById('milestoneLightboxBadge');
    const title = document.getElementById('milestoneLightboxTitle');
    const dateEl = document.getElementById('milestoneLightboxDate');
    const symptomsEl = document.getElementById('milestoneLightboxSymptoms');
    const notesEl = document.getElementById('milestoneLightboxNotes');

    if (!modal || !cachedPhotoItems || cachedPhotoItems.length === 0) return;

    const item = cachedPhotoItems.find(p => p.id === photoId);
    if (!item) return;

    currentActiveLightboxId = item.id;

    if (img) {
      img.src = item.url;
      img.alt = item.title;
    }

    if (badge) {
      badge.textContent = item.isBaseline ? tr('healing.gallery.baselineBadge', 'Day 0 - Baseline') : tr('healing.gallery.dayBadge', 'Day {day}', { day: item.day });
      badge.className = `milestone-card__badge ${item.isBaseline ? 'milestone-card__badge--baseline' : ''}`;
    }

    if (title) {
      title.textContent = item.title;
    }

    if (dateEl) {
      dateEl.textContent = item.date ? tr('healing.gallery.recordedOn', 'Recorded on {date}', { date: item.date }) : '';
    }

    if (symptomsEl) {
      if (item.symptoms) {
        const chips = [];
        if (item.symptoms.redness > 0) chips.push(`Redness: ${item.symptoms.redness}/3`);
        if (item.symptoms.swelling > 0) chips.push(`Swelling: ${item.symptoms.swelling}/3`);
        if (item.symptoms.pain > 0) chips.push(`Pain: ${item.symptoms.pain}/3`);
        if (item.symptoms.discharge && item.symptoms.discharge !== 'none') chips.push(`Discharge: ${item.symptoms.discharge}`);
        
        if (chips.length > 0) {
          symptomsEl.innerHTML = chips.map(c => `<span class="milestone-symptom-chip">${escapeHtml(c)}</span>`).join('');
        } else {
          symptomsEl.innerHTML = `<span class="milestone-symptom-chip milestone-symptom-chip--calm">No Symptoms Reported</span>`;
        }
      } else if (item.isBaseline) {
        symptomsEl.innerHTML = `<span class="milestone-symptom-chip milestone-symptom-chip--baseline">Baseline (Pre-Healing Initial State)</span>`;
      } else {
        symptomsEl.innerHTML = '';
      }
    }

    if (notesEl) {
      notesEl.textContent = item.notes || '';
      notesEl.style.display = item.notes ? 'block' : 'none';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeMilestoneLightbox() {
    const modal = document.getElementById('milestoneLightboxModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    if (!cachedPhotoItems || cachedPhotoItems.length <= 1 || !currentActiveLightboxId) return;
    const currentIndex = cachedPhotoItems.findIndex(p => p.id === currentActiveLightboxId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = cachedPhotoItems.length - 1;
    if (nextIndex >= cachedPhotoItems.length) nextIndex = 0;

    openMilestoneLightbox(cachedPhotoItems[nextIndex].id);
  }

  // ==========================================
  // PART 1: MILESTONE PHOTO COMPARISON SLIDER
  // ==========================================
  function renderPhotoComparison(piece) {
    const section = document.getElementById('photoComparisonSection');
    const selectA = document.getElementById('comparePhotoA');
    const selectB = document.getElementById('comparePhotoB');
    const container = document.getElementById('photoComparisonContainer');
    const noPhotosMsg = document.getElementById('photoComparisonNoPhotos');
    const imageBefore = document.getElementById('compareImageBefore');
    const imageAfter = document.getElementById('compareImageAfter');
    const labelA = document.getElementById('compareLabelA');
    const labelB = document.getElementById('compareLabelB');

    if (!section) return;

    const photoItems = getMilestonePhotoItems(piece);

    if (photoItems.length < 2) {
      if (noPhotosMsg) noPhotosMsg.style.display = 'block';
      if (container) container.style.display = 'none';
      return;
    }

    if (noPhotosMsg) noPhotosMsg.style.display = 'none';
    if (container) container.style.display = 'block';

    const currentValA = selectA ? selectA.value : null;
    const currentValB = selectB ? selectB.value : null;

    if (selectA) {
      selectA.innerHTML = photoItems.map(p => 
        `<option value="${p.id}">${p.title}</option>`
      ).join('');
      if (currentValA && photoItems.some(p => p.id === currentValA)) {
        selectA.value = currentValA;
      } else {
        selectA.value = photoItems[0].id;
      }
    }

    if (selectB) {
      selectB.innerHTML = photoItems.map(p => 
        `<option value="${p.id}">${p.title}</option>`
      ).join('');
      if (currentValB && photoItems.some(p => p.id === currentValB)) {
        selectB.value = currentValB;
      } else {
        selectB.value = photoItems[photoItems.length - 1].id;
      }
    }

    updatePhotoDisplay(photoItems);
  }

  function updatePhotoDisplay(photoItems) {
    const selectA = document.getElementById('comparePhotoA');
    const selectB = document.getElementById('comparePhotoB');
    const imageBefore = document.getElementById('compareImageBefore');
    const imageAfter = document.getElementById('compareImageAfter');
    const labelA = document.getElementById('compareLabelA');
    const labelB = document.getElementById('compareLabelB');

    if (!selectA || !selectB) return;

    const itemA = photoItems.find(p => p.id === selectA.value) || photoItems[0];
    const itemB = photoItems.find(p => p.id === selectB.value) || photoItems[photoItems.length - 1];

    if (imageBefore && itemA) {
      imageBefore.src = itemA.url;
      imageBefore.alt = itemA.title;
    }
    if (imageAfter && itemB) {
      imageAfter.src = itemB.url;
      imageAfter.alt = itemB.title;
    }

    if (labelA && itemA) {
      const template = (window.t && window.t('healing.photoComparison.dayA')) || 'Photo A: Day {day} ({date})';
      labelA.textContent = template.replace('{day}', itemA.day).replace('{date}', itemA.date);
    }
    if (labelB && itemB) {
      const template = (window.t && window.t('healing.photoComparison.dayB')) || 'Photo B: Day {day} ({date})';
      labelB.textContent = template.replace('{day}', itemB.day).replace('{date}', itemB.date);
    }
  }

  function setupPhotoSelectDropdowns() {
    const selectA = document.getElementById('comparePhotoA');
    const selectB = document.getElementById('comparePhotoB');

    function onSelectChange() {
      const currentPiece = (window.HealingLog && window.HealingLog.getCurrentPiece && window.HealingLog.getCurrentPiece()) ||
                           (window.TrackerStorage && window.TrackerStorage.getActivePiece && window.TrackerStorage.getActivePiece());
      if (!currentPiece) return;

      const photoItems = [];
      if (currentPiece.baselinePhoto) {
        photoItems.push({
          id: 'baseline',
          day: 0,
          date: currentPiece.procedureDate,
          title: (window.t && window.t('healing.photoComparison.baselineBadge')) || 'Day 0 Baseline',
          url: currentPiece.baselinePhoto
        });
      }
      if (currentPiece.entries) {
        currentPiece.entries.forEach(entry => {
          if (entry.photo) {
            photoItems.push({
              id: entry.id,
              day: entry.dayOffset,
              date: entry.date,
              title: tr('healing.gallery.dayBadge', 'Day {day}', { day: entry.dayOffset }) + ` (${entry.date})`,
              url: entry.photo
            });
          }
        });
      }
      updatePhotoDisplay(photoItems);
    }

    if (selectA) selectA.addEventListener('change', onSelectChange);
    if (selectB) selectB.addEventListener('change', onSelectChange);
  }

  function setupPhotoSliderEvents() {
    const sliderContainer = document.getElementById('comparisonSliderContainer');
    const sliderDivider = document.getElementById('comparisonDivider');
    const clipContainer = document.getElementById('comparisonBeforeClip');

    if (!sliderContainer || !sliderDivider || !clipContainer) return;

    function setPosition(percentage) {
      currentSliderPosition = Math.max(0, Math.min(100, percentage));
      sliderDivider.style.left = currentSliderPosition + '%';
      clipContainer.style.width = currentSliderPosition + '%';
    }

    function updateFromEvent(e) {
      const rect = sliderContainer.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setPosition(percentage);
    }

    sliderDivider.addEventListener('mousedown', function() { isDragging = true; });
    window.addEventListener('mouseup', function() { isDragging = false; });
    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      updateFromEvent(e);
    });

    sliderDivider.addEventListener('touchstart', function() { isDragging = true; }, { passive: true });
    window.addEventListener('touchend', function() { isDragging = false; });
    window.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      updateFromEvent(e);
    }, { passive: true });

    sliderContainer.addEventListener('click', function(e) {
      updateFromEvent(e);
    });

    setPosition(50);
  }

  // ==========================================
  // PART 2: SYMPTOM SEVERITY COMPARISON & BAR CHART
  // ==========================================
  function renderSeverityComparison(piece) {
    const section = document.getElementById('symptomSeverityComparisonSection');
    const noData = document.getElementById('severityComparisonNoData');
    const container = document.getElementById('severityComparisonContainer');
    const selectA = document.getElementById('compareSeverityEntryA');
    const selectB = document.getElementById('compareSeverityEntryB');

    if (!section) return;

    const entries = (piece && piece.entries) ? piece.entries.slice() : [];
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (entries.length < 2) {
      if (noData) noData.style.display = 'block';
      if (container) container.style.display = 'none';
      return;
    }

    if (noData) noData.style.display = 'none';
    if (container) container.style.display = 'block';

    const currentA = selectA ? selectA.value : null;
    const currentB = selectB ? selectB.value : null;

    if (selectA) {
      selectA.innerHTML = entries.map(e => 
        `<option value="${e.id}">${tr('healing.gallery.dayBadge', 'Day {day}', { day: e.dayOffset })} (${e.date}), ${tr('healing.severityComparison.total', 'Total')}: ${e.overallScore || 0}/12</option>`
      ).join('');
      if (currentA && entries.some(e => e.id === currentA)) {
        selectA.value = currentA;
      } else if (selectedSeverityEntryAId && entries.some(e => e.id === selectedSeverityEntryAId)) {
        selectA.value = selectedSeverityEntryAId;
      } else {
        selectA.value = entries[0].id; // Earlier entry
      }
    }

    if (selectB) {
      selectB.innerHTML = entries.map(e => 
        `<option value="${e.id}">${tr('healing.gallery.dayBadge', 'Day {day}', { day: e.dayOffset })} (${e.date}), ${tr('healing.severityComparison.total', 'Total')}: ${e.overallScore || 0}/12</option>`
      ).join('');
      if (currentB && entries.some(e => e.id === currentB)) {
        selectB.value = currentB;
      } else if (selectedSeverityEntryBId && entries.some(e => e.id === selectedSeverityEntryBId)) {
        selectB.value = selectedSeverityEntryBId;
      } else {
        selectB.value = entries[entries.length - 1].id; // Later entry
      }
    }

    updateSeverityVisuals(entries);
  }

  function updateSeverityVisuals(entries) {
    const selectA = document.getElementById('compareSeverityEntryA');
    const selectB = document.getElementById('compareSeverityEntryB');
    if (!selectA || !selectB) return;

    const entryA = entries.find(e => e.id === selectA.value) || entries[0];
    const entryB = entries.find(e => e.id === selectB.value) || entries[entries.length - 1];

    if (!entryA || !entryB) return;

    selectedSeverityEntryAId = entryA.id;
    selectedSeverityEntryBId = entryB.id;

    // Update legend labels
    const legA = document.getElementById('severityLegendA');
    const legB = document.getElementById('severityLegendB');
    if (legA) {
      const template = (window.t && window.t('healing.severityComparison.entryALabel')) || 'Entry 1: Day {day} ({date})';
      legA.textContent = template.replace('{day}', entryA.dayOffset).replace('{date}', entryA.date);
    }
    if (legB) {
      const template = (window.t && window.t('healing.severityComparison.entryBLabel')) || 'Entry 2: Day {day} ({date})';
      legB.textContent = template.replace('{day}', entryB.dayOffset).replace('{date}', entryB.date);
    }

    // Render Side-by-Side SVG Grouped Bar Chart
    renderSeverityBarChart(entryA, entryB);

    // Render Deltas Breakdown Grid
    renderSeverityDeltas(entryA, entryB);

    // Render Overall Score Card
    renderOverallSeveritySummary(entryA, entryB);
  }

  function renderSeverityBarChart(entryA, entryB) {
    const container = document.getElementById('severityBarChartContainer');
    if (!container) return;

    const width = 640;
    const height = 240;
    const padLeft = 60;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 45;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const symptoms = [
      { key: 'redness', label: (window.t && window.t('healing.severityComparison.symptomRedness')) || 'Redness', valA: entryA.redness || 0, valB: entryB.redness || 0 },
      { key: 'swelling', label: (window.t && window.t('healing.severityComparison.symptomSwelling')) || 'Swelling', valA: entryA.swelling || 0, valB: entryB.swelling || 0 },
      { key: 'tenderness', label: (window.t && window.t('healing.severityComparison.symptomTenderness')) || 'Tenderness', valA: entryA.tenderness || 0, valB: entryB.tenderness || 0 },
      { key: 'discharge', label: (window.t && window.t('healing.severityComparison.symptomDischarge')) || 'Discharge', valA: entryA.discharge || 0, valB: entryB.discharge || 0 }
    ];

    const maxVal = 3; // Rating scale 0 - 3 (0=None, 1=Mild, 2=Moderate, 3=Severe)
    const scaleY = val => padTop + plotH - (val / maxVal) * plotH;

    // Horizontal grid lines
    let gridLines = '';
    const yLabels = [
      ...[0, 1, 2, 3].map((v) => ({ val: v, text: v + ' ' + tr('healing.severityComparison.level' + v, ['None', 'Mild', 'Moderate', 'Severe'][v]) }))
    ];

    yLabels.forEach(yItem => {
      const y = scaleY(yItem.val);
      gridLines += `
        <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="var(--border)" stroke-dasharray="2 3" stroke-width="1" />
        <text x="${padLeft - 8}" y="${y + 4}" fill="var(--ink-muted)" font-family="var(--font-mono)" font-size="10" text-anchor="end">${yItem.text}</text>
      `;
    });

    // Grouped Bars
    const groupW = plotW / symptoms.length;
    const barW = Math.min(36, (groupW - 24) / 2);
    let barsSvg = '';

    // Neobrutalist Dual-Theme Colors for Bars
    const colorA = 'var(--time-blue)'; // Primary comparative
    const colorB = 'var(--accent)';    // Target/Current comparative

    symptoms.forEach((s, idx) => {
      const groupCenter = padLeft + idx * groupW + groupW / 2;
      const barAX = groupCenter - barW - 3;
      const barBX = groupCenter + 3;

      const barAY = scaleY(s.valA);
      const barAH = padTop + plotH - barAY;

      const barBY = scaleY(s.valB);
      const barBH = padTop + plotH - barBY;

      // Category text on X axis
      const labelY = height - 12;

      barsSvg += `
        <g class="barchart-group" data-symptom="${s.key}">
          <!-- Bar A (Entry A) -->
          <rect x="${barAX}" y="${barAY}" width="${barW}" height="${barAH}" fill="${colorA}" stroke="var(--border)" stroke-width="1">
            <title>${s.label} - Entry 1: ${s.valA}/3</title>
          </rect>
          <text x="${barAX + barW / 2}" y="${barAY - 6}" fill="var(--ink)" font-family="var(--font-mono)" font-size="11" font-weight="700" text-anchor="middle">${s.valA}</text>

          <!-- Bar B (Entry B) -->
          <rect x="${barBX}" y="${barBY}" width="${barW}" height="${barBH}" fill="${colorB}" stroke="var(--border)" stroke-width="1">
            <title>${s.label} - Entry 2: ${s.valB}/3</title>
          </rect>
          <text x="${barBX + barW / 2}" y="${barBY - 6}" fill="var(--ink)" font-family="var(--font-mono)" font-size="11" font-weight="700" text-anchor="middle">${s.valB}</text>

          <!-- Category Label -->
          <text x="${groupCenter}" y="${labelY}" fill="var(--ink)" font-family="var(--font-mono)" font-size="11" font-weight="600" text-anchor="middle">${s.label}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="severity-barchart-svg" style="width: 100%; height: auto; display: block;" role="img" aria-label="Symptom severity comparison bar chart">
        ${gridLines}
        ${barsSvg}
      </svg>
    `;
  }

  function renderSeverityDeltas(entryA, entryB) {
    const container = document.getElementById('severityDeltasGrid');
    if (!container) return;

    const symptoms = [
      { key: 'redness', label: (window.t && window.t('healing.severityComparison.symptomRedness')) || 'Redness', valA: entryA.redness || 0, valB: entryB.redness || 0, icon: '🔴' },
      { key: 'swelling', label: (window.t && window.t('healing.severityComparison.symptomSwelling')) || 'Swelling', valA: entryA.swelling || 0, valB: entryB.swelling || 0, icon: '🟠' },
      { key: 'tenderness', label: (window.t && window.t('healing.severityComparison.symptomTenderness')) || 'Tenderness', valA: entryA.tenderness || 0, valB: entryB.tenderness || 0, icon: '🟡' },
      { key: 'discharge', label: (window.t && window.t('healing.severityComparison.symptomDischarge')) || 'Discharge', valA: entryA.discharge || 0, valB: entryB.discharge || 0, icon: '💧' }
    ];

    const levelNames = [0, 1, 2, 3].map((i) => tr('healing.severityComparison.level' + i, ['None', 'Mild', 'Moderate', 'Severe'][i]));

    container.innerHTML = symptoms.map(s => {
      const diff = s.valB - s.valA;
      let badgeClass = 'severity-delta--stable';
      let badgeText = (window.t && window.t('healing.severityComparison.statusStable')) || 'Stable (0)';

      if (diff < 0) {
        badgeClass = 'severity-delta--improved';
        const template = (window.t && window.t('healing.severityComparison.statusImproved')) || 'Improved (-{diff})';
        badgeText = template.replace('{diff}', Math.abs(diff));
      } else if (diff > 0) {
        badgeClass = 'severity-delta--worsened';
        const template = (window.t && window.t('healing.severityComparison.statusWorsened')) || 'Elevated (+{diff})';
        badgeText = template.replace('{diff}', diff);
      }

      return `
        <div class="severity-delta-card">
          <div class="severity-delta-card__header">
            <span class="severity-delta-card__icon">${s.icon}</span>
            <span class="severity-delta-card__title">${s.label}</span>
          </div>
          <div class="severity-delta-card__values">
            <div class="severity-delta-val">
              <span class="severity-delta-val__label">${tr('healing.comparison.entry1', 'Entry 1')}:</span>
              <span class="severity-delta-val__num">${s.valA} (${levelNames[s.valA] || s.valA})</span>
            </div>
            <div class="severity-delta-arrow">➔</div>
            <div class="severity-delta-val">
              <span class="severity-delta-val__label">${tr('healing.comparison.entry2', 'Entry 2')}:</span>
              <span class="severity-delta-val__num">${s.valB} (${levelNames[s.valB] || s.valB})</span>
            </div>
          </div>
          <div class="severity-delta-badge ${badgeClass}">${badgeText}</div>
        </div>
      `;
    }).join('');
  }

  function renderOverallSeveritySummary(entryA, entryB) {
    const container = document.getElementById('severityOverallCard');
    if (!container) return;

    const scoreA = entryA.overallScore !== undefined ? entryA.overallScore : ((entryA.redness || 0) + (entryA.swelling || 0) + (entryA.tenderness || 0) + (entryA.discharge || 0));
    const scoreB = entryB.overallScore !== undefined ? entryB.overallScore : ((entryB.redness || 0) + (entryB.swelling || 0) + (entryB.tenderness || 0) + (entryB.discharge || 0));
    const totalDiff = scoreB - scoreA;

    let statusText = '';
    let statusClass = '';

    if (totalDiff < 0) {
      statusClass = 'severity-overall--improved';
      statusText = tr('healing.severityComparison.overallImproved', 'Favorable healing trajectory: total severity score reduced by {diff} point(s) (from {from}/12 down to {to}/12). Tissue inflammation is resolving.', { diff: Math.abs(totalDiff), from: scoreA, to: scoreB });
    } else if (totalDiff === 0) {
      statusClass = 'severity-overall--stable';
      statusText = tr('healing.severityComparison.overallStable', 'Stable healing stage: total severity score unchanged at {from}/12. Continue your standard daily aftercare routine.', { from: scoreA });
    } else {
      statusClass = 'severity-overall--elevated';
      statusText = tr('healing.severityComparison.overallElevated', 'Symptom elevation: total severity score increased by +{diff} point(s) (from {from}/12 up to {to}/12). Watch carefully for friction or signs of infection.', { diff: totalDiff, from: scoreA, to: scoreB });
    }

    container.innerHTML = `
      <div class="severity-overall-content ${statusClass}">
        <div class="severity-overall-header">
          <span class="severity-overall-label">${tr('healing.severityComparison.overallDelta', 'Overall Severity Change')}</span>
          <span class="severity-overall-score">${scoreA}/12 ➔ ${scoreB}/12 (${totalDiff > 0 ? '+' + totalDiff : totalDiff})</span>
        </div>
        <p class="severity-overall-desc">${statusText}</p>
      </div>
    `;
  }

  function setupSeveritySelectDropdowns() {
    const selectA = document.getElementById('compareSeverityEntryA');
    const selectB = document.getElementById('compareSeverityEntryB');

    function onSelectChange() {
      const currentPiece = (window.HealingLog && window.HealingLog.getCurrentPiece && window.HealingLog.getCurrentPiece()) ||
                           (window.TrackerStorage && window.TrackerStorage.getActivePiece && window.TrackerStorage.getActivePiece());
      if (!currentPiece || !currentPiece.entries) return;
      const entries = currentPiece.entries.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      updateSeverityVisuals(entries);
    }

    if (selectA) selectA.addEventListener('change', onSelectChange);
    if (selectB) selectB.addEventListener('change', onSelectChange);
  }

  // Export to global scope
  window.Comparison = {
    init: initComparisonUI,
    update: updateComparison,
    renderMilestoneGallery: renderMilestoneGallery,
    renderPhotoComparison: renderPhotoComparison,
    renderSeverityComparison: renderSeverityComparison,
    switchView: switchMilestoneView,
    openLightbox: openMilestoneLightbox,
    closeLightbox: closeMilestoneLightbox
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComparisonUI);
  } else {
    initComparisonUI();
  }
})();
