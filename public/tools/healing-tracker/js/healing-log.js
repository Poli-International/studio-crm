// Healing Log Manager: Piece creation, baseline photos, daily entries, "What Changed" triggers, and Backup/Restore
(function() {
  const STORAGE_KEY_PIECES = 'poli_healing_pieces_v1';
  const STORAGE_KEY_ACTIVE = 'poli_healing_active_piece_id';

  function getPieces() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PIECES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading pieces from localStorage', e);
      return [];
    }
  }

  function savePieces(pieces) {
    try {
      localStorage.setItem(STORAGE_KEY_PIECES, JSON.stringify(pieces));
    } catch (e) {
      console.error('Error saving pieces to localStorage', e);
    }
  }

  function getActivePieceId() {
    return localStorage.getItem(STORAGE_KEY_ACTIVE);
  }

  function setActivePieceId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    }
  }

  function getActivePiece() {
    const pieces = getPieces();
    const activeId = getActivePieceId();
    const piece = pieces.find(p => p.id === activeId) || (pieces.length > 0 ? pieces[0] : null);
    // Pieces are stored with `type`; tension-gauge, journey-snapshot and
    // healing-analysis read `procedureType`. Expose both.
    if (piece && !piece.procedureType) piece.procedureType = piece.type;
    return piece;
  }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getBase64ByteLength(dataUrl) {
    if (!dataUrl) return 0;
    const base64Str = dataUrl.split(',')[1] || '';
    return Math.round((base64Str.length * 3) / 4);
  }

  // Storage Quota Calculator & Tracker
  function getStorageEstimate() {
    let usedChars = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        usedChars += key.length + val.length;
      }
    }
    // localStorage stores UTF-16 code units (2 bytes each)
    const usedBytes = usedChars * 2;
    const quotaBytes = 5 * 1024 * 1024; // Standard 5 MB origin storage quota
    const remainingBytes = Math.max(0, quotaBytes - usedBytes);

    const pieces = getPieces();
    let totalPhotoBytes = 0;
    let photoCount = 0;

    pieces.forEach(p => {
      if (p.baselinePhoto) {
        totalPhotoBytes += getBase64ByteLength(p.baselinePhoto);
        photoCount++;
      }
      if (Array.isArray(p.entries)) {
        p.entries.forEach(e => {
          if (e.photo) {
            totalPhotoBytes += getBase64ByteLength(e.photo);
            photoCount++;
          }
        });
      }
    });

    const avgPhotoBytes = photoCount > 0 ? Math.round(totalPhotoBytes / photoCount) : (180 * 1024);
    // Base64 storage cost in localStorage is ~2.66x binary JPEG bytes
    const avgPhotoStorageCost = Math.round(avgPhotoBytes * 2.66);
    const photosFit = Math.max(0, Math.floor(remainingBytes / (avgPhotoStorageCost || 1)));

    // Flag low storage if remaining is under 600 KB or fits fewer than 2 photos
    const isLow = remainingBytes < (600 * 1024) || photosFit < 2;

    return {
      usedBytes: usedBytes,
      remainingBytes: remainingBytes,
      quotaBytes: quotaBytes,
      photoCount: photoCount,
      avgPhotoBytes: avgPhotoBytes,
      photosFit: photosFit,
      isLow: isLow,
      formattedUsed: formatBytes(usedBytes),
      formattedRemaining: formatBytes(remainingBytes),
      formattedAvg: formatBytes(avgPhotoBytes)
    };
  }

  function updateStorageDisplay() {
    const est = getStorageEstimate();
    const statusText = window.t
      ? window.t('healing.storage.status', {
          used: est.formattedUsed,
          remaining: est.formattedRemaining,
          fits: est.photosFit,
          avg: est.formattedAvg
        })
      : `Storage: ${est.formattedUsed} used / ${est.formattedRemaining} remaining (~${est.photosFit} more photos fit at ${est.formattedAvg} avg size)`;

    const indicatorIds = ['baselineStorageIndicator', 'entryStorageIndicator', 'backupStorageIndicator'];
    indicatorIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = statusText;
    });

    const bannerIds = ['baselineLowStorageBanner', 'entryLowStorageBanner', 'backupLowStorageBanner'];
    bannerIds.forEach(id => {
      const banner = document.getElementById(id);
      if (banner) {
        if (est.isLow && est.photoCount > 0) {
          banner.style.display = 'block';
          const textEl = banner.querySelector('.healing-storage-low-text');
          if (textEl) {
            textEl.textContent = window.t
              ? window.t('healing.storage.lowWarning', { remaining: est.formattedRemaining })
              : `⚠️ Storage is running low (${est.formattedRemaining} remaining).`;
          }
        } else {
          banner.style.display = 'none';
        }
      }
    });
  }

  // Pruning: Drop oldest photos while keeping clinical entries and ratings intact
  function dropOldestPhotos() {
    const pieces = getPieces();
    const photosList = [];

    pieces.forEach((piece, pIdx) => {
      if (Array.isArray(piece.entries)) {
        piece.entries.forEach((entry, eIdx) => {
          if (entry.photo) {
            photosList.push({
              pieceIndex: pIdx,
              entryIndex: eIdx,
              pieceName: piece.name,
              date: entry.date,
              dayOffset: entry.dayOffset,
              isBaseline: false,
              bytes: getBase64ByteLength(entry.photo)
            });
          }
        });
      }
      if (piece.baselinePhoto) {
        photosList.push({
          pieceIndex: pIdx,
          entryIndex: -1,
          pieceName: piece.name,
          date: piece.procedureDate || '2000-01-01',
          dayOffset: 0,
          isBaseline: true,
          bytes: getBase64ByteLength(piece.baselinePhoto)
        });
      }
    });

    if (photosList.length === 0) {
      const noPhotosMsg = window.t
        ? window.t('healing.storage.noPhotosToDrop')
        : 'There are no stored photos to drop. All your storage is currently used by text logs.';
      alert(noPhotosMsg);
      return;
    }

    // Sort ascending by date (oldest first)
    photosList.sort((a, b) => new Date(a.date) - new Date(b.date));

    const dropCount = Math.min(photosList.length, Math.max(1, Math.min(3, Math.ceil(photosList.length / 2))));
    const toDrop = photosList.slice(0, dropCount);

    let totalFreedEst = 0;
    toDrop.forEach(item => {
      totalFreedEst += item.bytes;
    });

    const confirmMsg = window.t
      ? window.t('healing.storage.confirmDropPrompt', {
          count: dropCount,
          freed: formatBytes(totalFreedEst)
        })
      : `Drop the ${dropCount} oldest photo(s) to free up ~${formatBytes(totalFreedEst)} of storage?\n\nIMPORTANT: All clinical entries, symptom ratings (redness, swelling, etc.), notes, and trend lines will be 100% PRESERVED. Only the image data is removed.`;

    if (!confirm(confirmMsg)) return;

    // Apply drops in memory: clear photo data while keeping entries and ratings
    toDrop.forEach(item => {
      if (item.isBaseline) {
        pieces[item.pieceIndex].baselinePhoto = null;
      } else {
        pieces[item.pieceIndex].entries[item.entryIndex].photo = null;
      }
    });

    // Commit in ONE write
    savePieces(pieces);

    renderActivePieceView();
    updateStorageDisplay();

    const successMsg = window.t
      ? window.t('healing.storage.droppedSuccess', {
          count: dropCount,
          freed: formatBytes(totalFreedEst)
        })
      : `Successfully dropped ${dropCount} oldest photo(s), freeing ~${formatBytes(totalFreedEst)}. All symptom ratings and log entries were preserved.`;
    alert(successMsg);
  }

  // Compress image to canvas data URL using createImageBitmap with EXIF orientation handling
  // Longest edge 1200px, never upscale an image already smaller, quality 0.82 JPEG
  function compressImage(file, p1, p2, p3) {
    let maxEdge = 1200;
    let quality = 0.82;
    let callback = null;

    if (typeof p1 === 'function') {
      callback = p1;
    } else {
      if (typeof p1 === 'number') maxEdge = p1;
      if (typeof p2 === 'number') quality = p2;
      if (typeof p3 === 'function') callback = p3;
      else if (typeof p2 === 'function') callback = p2;
    }

    return new Promise((resolve, reject) => {
      const originalBytes = file.size || 0;

      function processSource(source) {
        let width = source.width;
        let height = source.height;
        const longest = Math.max(width, height);

        // Longest edge capped, and NEVER upscale an image already smaller
        if (longest > maxEdge) {
          const scale = maxEdge / longest;
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0, width, height);

        if (typeof source.close === 'function') {
          source.close();
        }

        const dataUrl = canvas.toDataURL('image/jpeg', quality || 0.82);
        const compressedBytes = getBase64ByteLength(dataUrl);
        const reductionPercent = originalBytes > compressedBytes
          ? Math.round(((originalBytes - compressedBytes) / originalBytes) * 100)
          : 0;

        // Check against available storage BEFORE writing
        const estimatedStorageCost = dataUrl.length * 2;
        const storageEst = getStorageEstimate();
        const exceedsStorage = estimatedStorageCost > storageEst.remainingBytes;

        const result = {
          dataUrl: dataUrl,
          width: width,
          height: height,
          originalBytes: originalBytes,
          compressedBytes: compressedBytes,
          reductionPercent: reductionPercent,
          formattedOriginal: formatBytes(originalBytes),
          formattedCompressed: formatBytes(compressedBytes),
          exceedsStorage: exceedsStorage,
          neededBytes: estimatedStorageCost,
          remainingBytes: storageEst.remainingBytes
        };

        if (typeof callback === 'function') {
          callback(result);
        }
        resolve(result);
      }

      // Read with createImageBitmap(file, { imageOrientation: 'from-image' }) so EXIF orientation is honoured
      if (typeof window.createImageBitmap === 'function') {
        createImageBitmap(file, { imageOrientation: 'from-image' })
          .then(bitmap => {
            processSource(bitmap);
          })
          .catch(err => {
            console.warn('createImageBitmap failed, using FileReader fallback', err);
            fallbackReader(file, processSource, reject);
          });
      } else {
        fallbackReader(file, processSource, reject);
      }
    });
  }

  function fallbackReader(file, processCallback, rejectCallback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        processCallback(img);
      };
      img.onerror = function(err) {
        if (typeof rejectCallback === 'function') rejectCallback(err);
      };
      img.src = e.target.result;
    };
    reader.onerror = function(err) {
      if (typeof rejectCallback === 'function') rejectCallback(err);
    };
    reader.readAsDataURL(file);
  }

  let pendingImportData = null;

  // Initialize UI controllers
  function initHealingLogUI() {
    const baselinePhotoInput = document.getElementById('baselinePhotoInput');
    const baselinePhotoPreview = document.getElementById('baselinePhotoPreview');
    const baselinePreviewContainer = document.getElementById('baselinePreviewContainer');
    let currentBaselineDataUrl = null;

    if (baselinePhotoInput) {
      baselinePhotoInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          compressImage(e.target.files[0], 1200, 0.82, function(result) {
            currentBaselineDataUrl = result.dataUrl;
            if (baselinePhotoPreview) {
              baselinePhotoPreview.src = result.dataUrl;
            }
            const sizeInfoEl = document.getElementById('baselinePhotoSizeInfo');
            if (sizeInfoEl) {
              const baseMsg = window.t
                ? window.t('healing.photo.compressionInfo', {
                    orig: result.formattedOriginal,
                    comp: result.formattedCompressed,
                    reduction: result.reductionPercent
                  })
                : `Photo compressed: ${result.formattedOriginal} → ${result.formattedCompressed} (${result.reductionPercent}% reduction)`;
              const exifMsg = window.t ? '' : ' (EXIF metadata & GPS location removed)';
              sizeInfoEl.textContent = baseMsg + exifMsg;
            }
            if (result.exceedsStorage) {
              const warnMsg = window.t
                ? window.t('healing.photo.exceedsStorageWarning', { size: formatBytes(result.neededBytes), remaining: formatBytes(result.remainingBytes) })
                : `⚠️ This photo requires ${formatBytes(result.neededBytes)}, but only ${formatBytes(result.remainingBytes)} remains in storage. Please drop older photos before saving.`;
              alert(warnMsg);
            }
            if (baselinePreviewContainer) {
              baselinePreviewContainer.style.display = 'block';
            }
            updateStorageDisplay();
          });
        }
      });
    }

    // New Entry Form Handlers
    const openLogBtn = document.getElementById('openNewEntryBtn');
    const entryModal = document.getElementById('newEntryModal');
    const closeEntryModalBtn = document.getElementById('closeEntryModalBtn');
    const cancelEntryBtn = document.getElementById('cancelEntryBtn');
    const logEntryForm = document.getElementById('logEntryForm');
    const entryPhotoInput = document.getElementById('entryPhotoInput');
    const entryPhotoPreview = document.getElementById('entryPhotoPreview');
    const entryPreviewContainer = document.getElementById('entryPreviewContainer');
    let currentEntryDataUrl = null;

    if (openLogBtn && entryModal) {
      openLogBtn.addEventListener('click', function() {
        const activePiece = getActivePiece();
        if (!activePiece) {
          alert(window.t ? window.t('healing.setup.subtitle') : 'Please start a healing journey first.');
          return;
        }
        // Set default date to today
        const dateInput = document.getElementById('entryDate');
        if (dateInput) {
          const today = window.localISODate(new Date());
          dateInput.value = today;
        }
        currentEntryDataUrl = null;
        if (entryPreviewContainer) entryPreviewContainer.style.display = 'none';
        const entrySizeInfo = document.getElementById('entryPhotoSizeInfo');
        if (entrySizeInfo) entrySizeInfo.textContent = '';
        if (logEntryForm) logEntryForm.reset();
        evaluateWhatChangedTrigger();
        updateStorageDisplay();
        entryModal.style.display = 'flex';
      });
    }

    function closeModal() {
      if (entryModal) entryModal.style.display = 'none';
      currentEntryDataUrl = null;
      if (entryPhotoInput) entryPhotoInput.value = '';
    }

    if (closeEntryModalBtn) closeEntryModalBtn.addEventListener('click', closeModal);
    if (cancelEntryBtn) cancelEntryBtn.addEventListener('click', closeModal);

    if (entryPhotoInput) {
      entryPhotoInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          compressImage(e.target.files[0], 1200, 0.82, function(result) {
            currentEntryDataUrl = result.dataUrl;
            if (entryPhotoPreview) entryPhotoPreview.src = result.dataUrl;
            const sizeInfoEl = document.getElementById('entryPhotoSizeInfo');
            if (sizeInfoEl) {
              const baseMsg = window.t
                ? window.t('healing.photo.compressionInfo', {
                    orig: result.formattedOriginal,
                    comp: result.formattedCompressed,
                    reduction: result.reductionPercent
                  })
                : `Photo compressed: ${result.formattedOriginal} → ${result.formattedCompressed} (${result.reductionPercent}% reduction)`;
              const exifMsg = window.t ? '' : ' (EXIF metadata & GPS location removed)';
              sizeInfoEl.textContent = baseMsg + exifMsg;
            }
            if (result.exceedsStorage) {
              const warnMsg = window.t
                ? window.t('healing.photo.exceedsStorageWarning', { size: formatBytes(result.neededBytes), remaining: formatBytes(result.remainingBytes) })
                : `⚠️ This photo requires ${formatBytes(result.neededBytes)}, but only ${formatBytes(result.remainingBytes)} remains in storage. Please drop older photos before saving.`;
              alert(warnMsg);
            }
            if (entryPreviewContainer) entryPreviewContainer.style.display = 'block';
            updateStorageDisplay();
          });
        }
      });
    }

    // Check "What Changed" trigger on symptom rating change
    const ratingInputs = document.querySelectorAll('.entry-rating-input');
    ratingInputs.forEach(input => {
      input.addEventListener('change', evaluateWhatChangedTrigger);
    });

    function evaluateWhatChangedTrigger() {
      const activePiece = getActivePiece();
      const whatChangedSection = document.getElementById('whatChangedSection');
      if (!whatChangedSection || !activePiece || !activePiece.entries || activePiece.entries.length === 0) {
        if (whatChangedSection) whatChangedSection.style.display = 'none';
        return;
      }

      // Get latest previous entry
      const sorted = activePiece.entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      const lastEntry = sorted[0];

      // Current form values
      const currentRedness = parseInt(document.querySelector('input[name="entryRedness"]:checked')?.value || '0', 10);
      const currentSwelling = parseInt(document.querySelector('input[name="entrySwelling"]:checked')?.value || '0', 10);
      const currentTenderness = parseInt(document.querySelector('input[name="entryTenderness"]:checked')?.value || '0', 10);
      const currentDischarge = parseInt(document.querySelector('input[name="entryDischarge"]:checked')?.value || '0', 10);

      const currentScore = currentRedness + currentSwelling + currentTenderness + currentDischarge;
      const lastScore = (lastEntry.redness || 0) + (lastEntry.swelling || 0) + (lastEntry.tenderness || 0) + (lastEntry.discharge || 0);

      const isWorse = currentScore > lastScore ||
        currentRedness > (lastEntry.redness || 0) ||
        currentSwelling > (lastEntry.swelling || 0) ||
        currentTenderness > (lastEntry.tenderness || 0) ||
        currentDischarge > (lastEntry.discharge || 0);

      if (isWorse && currentScore > 0) {
        whatChangedSection.style.display = 'block';
      } else {
        whatChangedSection.style.display = 'none';
      }
    }

    if (logEntryForm) {
      logEntryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const saved = saveNewEntry(currentEntryDataUrl);
        if (saved) {
          closeModal();
        }
      });
    }

    // Setup Piece Form Submission Integration
    const startTrackingBtn = document.getElementById('startTracking');
    if (startTrackingBtn) {
      startTrackingBtn.addEventListener('click', function() {
        const type = document.getElementById('procedureType')?.value;
        const date = document.getElementById('procedureDate')?.value;
        const customName = document.getElementById('pieceCustomName')?.value;
        const piercingLoc = document.getElementById('piercingLocation')?.value;
        const tattooLoc = (document.getElementById('tattooPlacement') || document.getElementById('tattooLocation'))?.value;
        const location = type === 'piercing' ? piercingLoc : (tattooLoc || null);
        const size = type === 'tattoo' ? document.getElementById('tattooSize')?.value : null;

        if (!type || !date) return; // Validation handled by tracker.js
        if (type === 'piercing' && !location) return;
        if (type === 'tattoo' && !size) return;

        createOrUpdatePiece({
          type: type,
          procedureDate: date,
          name: customName || (type === 'piercing' ? location : (tattooLoc ? `${tattooLoc} (${size})` : `${size} tattoo`)),
          location: location,
          size: size,
          baselinePhoto: currentBaselineDataUrl
        });
      });
    }

    // Connect Drop Oldest Photos buttons across views
    const dropBtns = document.querySelectorAll('.drop-oldest-photos-btn');
    dropBtns.forEach(btn => {
      btn.addEventListener('click', dropOldestPhotos);
    });

    // Backup and Restore Integration
    const exportBackupBtn = document.getElementById('exportBackupBtn');
    const importBackupInput = document.getElementById('importBackupInput');
    const importBackupBtn = document.getElementById('importBackupBtn');

    if (exportBackupBtn) {
      exportBackupBtn.addEventListener('click', exportBackupData);
    }

    if (importBackupBtn && importBackupInput) {
      importBackupBtn.addEventListener('click', function() {
        importBackupInput.click();
      });
      importBackupInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          importBackupData(e.target.files[0]);
        }
      });
    }

    // Connect Import Choice Modal Dialog controls (Replace vs Merge)
    const closeImportModalBtn = document.getElementById('closeImportChoiceModalBtn');
    const cancelImportChoiceBtn = document.getElementById('cancelImportChoiceBtn');
    const confirmImportReplaceBtn = document.getElementById('confirmImportReplaceBtn');
    const confirmImportMergeBtn = document.getElementById('confirmImportMergeBtn');
    const importChoiceModal = document.getElementById('importChoiceModal');

    function closeImportModal() {
      if (importChoiceModal) importChoiceModal.style.display = 'none';
      pendingImportData = null;
      if (importBackupInput) importBackupInput.value = '';
    }

    if (closeImportModalBtn) closeImportModalBtn.addEventListener('click', closeImportModal);
    if (cancelImportChoiceBtn) cancelImportChoiceBtn.addEventListener('click', closeImportModal);
    if (confirmImportReplaceBtn) {
      confirmImportReplaceBtn.addEventListener('click', function() {
        executeImport('replace');
      });
    }
    if (confirmImportMergeBtn) {
      confirmImportMergeBtn.addEventListener('click', function() {
        executeImport('merge');
      });
    }

    updateStorageDisplay();
    renderActivePieceView();
  }

  function createOrUpdatePiece(pieceData) {
    if (pieceData.baselinePhoto) {
      const est = getStorageEstimate();
      const photoCost = pieceData.baselinePhoto.length * 2;
      if (photoCost > est.remainingBytes) {
        const warnMsg = window.t
          ? window.t('healing.photo.exceedsStorageWarning', { size: formatBytes(photoCost), remaining: formatBytes(est.remainingBytes) })
          : `Storage limit exceeded: this photo requires ~${formatBytes(photoCost)}, but only ${formatBytes(est.remainingBytes)} is available. Please drop older photos before continuing.`;
        alert(warnMsg);
        return false;
      }
    }

    const pieces = getPieces();
    const existingIndex = pieces.findIndex(p => p.type === pieceData.type && p.procedureDate === pieceData.procedureDate && p.location === pieceData.location);

    let pieceId;
    if (existingIndex >= 0) {
      pieces[existingIndex].name = pieceData.name;
      if (pieceData.baselinePhoto) {
        pieces[existingIndex].baselinePhoto = pieceData.baselinePhoto;
      }
      pieceId = pieces[existingIndex].id;
    } else {
      pieceId = 'piece_' + Date.now();
      const newPiece = {
        id: pieceId,
        type: pieceData.type,
        name: pieceData.name,
        procedureDate: pieceData.procedureDate,
        location: pieceData.location,
        size: pieceData.size,
        baselinePhoto: pieceData.baselinePhoto || null,
        entries: [],
        createdAt: new Date().toISOString()
      };
      pieces.push(newPiece);
    }

    savePieces(pieces);
    setActivePieceId(pieceId);
    renderActivePieceView();
    updateStorageDisplay();
    return true;
  }

  function saveNewEntry(photoDataUrl) {
    const activePiece = getActivePiece();
    if (!activePiece) return false;

    if (photoDataUrl) {
      const est = getStorageEstimate();
      const photoCost = photoDataUrl.length * 2;
      if (photoCost > est.remainingBytes) {
        const warnMsg = window.t
          ? window.t('healing.photo.exceedsStorageWarning', { size: formatBytes(photoCost), remaining: formatBytes(est.remainingBytes) })
          : `Storage limit exceeded: this photo requires ~${formatBytes(photoCost)}, but only ${formatBytes(est.remainingBytes)} is available. Please drop older photos before saving.`;
        alert(warnMsg);
        return false;
      }
    }

    const entryDate = document.getElementById('entryDate')?.value || window.localISODate(new Date());
    const redness = parseInt(document.querySelector('input[name="entryRedness"]:checked')?.value || '0', 10);
    const swelling = parseInt(document.querySelector('input[name="entrySwelling"]:checked')?.value || '0', 10);
    const tenderness = parseInt(document.querySelector('input[name="entryTenderness"]:checked')?.value || '0', 10);
    const discharge = parseInt(document.querySelector('input[name="entryDischarge"]:checked')?.value || '0', 10);
    const tensionRadio = document.querySelector('input[name="entryTension"]:checked');
    const tension = tensionRadio ? parseInt(tensionRadio.value, 10) : 0;
    const notes = document.getElementById('entryNotes')?.value || '';

    // Collect checked causes from "What Changed"
    const causes = [];
    document.querySelectorAll('.what-changed-check:checked').forEach(cb => {
      causes.push(cb.value);
    });

    const procDate = new Date(activePiece.procedureDate);
    const currentEntryDate = new Date(entryDate);
    const dayOffset = Math.max(0, Math.floor((currentEntryDate - procDate) / (1000 * 60 * 60 * 24)));

    const newEntry = {
      id: 'entry_' + Date.now(),
      date: entryDate,
      dayOffset: dayOffset,
      redness: redness,
      swelling: swelling,
      tenderness: tenderness,
      discharge: discharge,
      tension: tension,
      overallScore: redness + swelling + tenderness + discharge,
      photo: photoDataUrl || null,
      notes: notes,
      likelyCauses: causes,
      createdAt: new Date().toISOString()
    };

    if (!activePiece.entries) activePiece.entries = [];
    activePiece.entries.push(newEntry);

    // Save piece updates
    const pieces = getPieces();
    const index = pieces.findIndex(p => p.id === activePiece.id);
    if (index >= 0) {
      pieces[index] = activePiece;
      savePieces(pieces);
    }

    renderActivePieceView();
    updateStorageDisplay();
    try {
      window.dispatchEvent(new CustomEvent('healingEntriesUpdated'));
    } catch (e) {}
    return true;
  }

  function deleteEntry(entryId) {
    const confirmMsg = window.t ? window.t('healing.log.confirmDelete') : 'Are you sure you want to delete this log entry?';
    if (!confirm(confirmMsg)) return;

    const activePiece = getActivePiece();
    if (!activePiece || !activePiece.entries) return;

    activePiece.entries = activePiece.entries.filter(e => e.id !== entryId);
    const pieces = getPieces();
    const index = pieces.findIndex(p => p.id === activePiece.id);
    if (index >= 0) {
      pieces[index] = activePiece;
      savePieces(pieces);
    }

    renderActivePieceView();
    updateStorageDisplay();
    try {
      window.dispatchEvent(new CustomEvent('healingEntriesUpdated'));
    } catch (e) {}
  }

  // Secure DOM rendering: never inject user-supplied or imported JSON via innerHTML; use textContent throughout
  function renderActivePieceView() {
    const activePiece = getActivePiece();
    const logSection = document.getElementById('healingLogSection');
    const entriesList = document.getElementById('healingEntriesList');
    const emptyLog = document.getElementById('healingEmptyLog');

    if (!activePiece) {
      if (logSection) logSection.style.display = 'none';
      return;
    }

    if (logSection) logSection.style.display = 'block';

    const entries = activePiece.entries || [];
    if (entries.length === 0) {
      if (emptyLog) emptyLog.style.display = 'block';
      if (entriesList) entriesList.textContent = '';
    } else {
      if (emptyLog) emptyLog.style.display = 'none';
      if (entriesList) {
        entriesList.textContent = '';
        // Sort descending by date
        const sorted = entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

        sorted.forEach(entry => {
          const card = document.createElement('div');
          card.className = 'healing-entry-card';
          card.id = 'entry_' + entry.id;

          // Header
          const header = document.createElement('div');
          header.className = 'healing-entry__header';

          const titleGroup = document.createElement('div');
          titleGroup.className = 'healing-entry__title-group';

          const dayBadge = document.createElement('span');
          dayBadge.className = 'healing-entry__day-badge';
          dayBadge.textContent = window.t ? window.t('healing.log.dayNumber', { day: entry.dayOffset }) : `Day ${entry.dayOffset}`;

          const dateSpan = document.createElement('span');
          dateSpan.className = 'healing-entry__date';
          dateSpan.textContent = window.t ? window.t('healing.log.recordedOn', { date: entry.date }) : `Logged on ${entry.date}`;

          titleGroup.appendChild(dayBadge);
          titleGroup.appendChild(dateSpan);

          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'healing-entry__delete-btn';
          deleteBtn.type = 'button';
          deleteBtn.title = window.t ? window.t('healing.log.deleteEntry') : 'Delete';
          deleteBtn.textContent = '🗑️';
          deleteBtn.addEventListener('click', function() {
            deleteEntry(entry.id);
          });

          header.appendChild(titleGroup);
          header.appendChild(deleteBtn);

          // Body
          const body = document.createElement('div');
          body.className = 'healing-entry__body';

          // Photo thumbnail (only if valid image data URL)
          if (entry.photo && typeof entry.photo === 'string' && entry.photo.startsWith('data:image/')) {
            const photoThumb = document.createElement('div');
            photoThumb.className = 'healing-entry__photo-thumb';
            const img = document.createElement('img');
            img.src = entry.photo;
            img.alt = `Day ${entry.dayOffset}`;
            img.loading = 'lazy';
            photoThumb.appendChild(img);
            body.appendChild(photoThumb);
          }

          const details = document.createElement('div');
          details.className = 'healing-entry__details';

          // Rating chips
          const ratingsGroup = document.createElement('div');
          ratingsGroup.className = 'healing-entry__ratings';

          const redChip = document.createElement('span');
          redChip.className = 'healing-entry__rating-chip';
          redChip.textContent = `🔴 ${(window.t ? window.t('healing.log.redness') : 'Redness')}: ${entry.redness}/3`;

          const swellChip = document.createElement('span');
          swellChip.className = 'healing-entry__rating-chip';
          swellChip.textContent = `🎈 ${(window.t ? window.t('healing.log.swelling') : 'Swelling')}: ${entry.swelling}/3`;

          const tendChip = document.createElement('span');
          tendChip.className = 'healing-entry__rating-chip';
          tendChip.textContent = `🩹 ${(window.t ? window.t('healing.log.tenderness') : 'Tenderness')}: ${entry.tenderness}/3`;

          const dischargeLevel = Math.min(3, Math.max(0, Number(entry.discharge) || 0));
          const dischargeDesc = window.t
            ? window.t('healing.log.discharge' + dischargeLevel).replace(/^\d\s*-\s*/, '')
            : ['None', 'Normal Clear/Whitish Lymph', 'Moderate / Slightly Thick', 'Excessive / Discolored'][dischargeLevel];

          const disChip = document.createElement('span');
          disChip.className = 'healing-entry__rating-chip';
          disChip.textContent = `💧 ${(window.t ? window.t('healing.log.discharge') : 'Discharge')}: ${dischargeDesc}`;

          ratingsGroup.appendChild(redChip);
          ratingsGroup.appendChild(swellChip);
          ratingsGroup.appendChild(tendChip);
          ratingsGroup.appendChild(disChip);
          details.appendChild(ratingsGroup);

          // Causes badge
          if (Array.isArray(entry.likelyCauses) && entry.likelyCauses.length > 0) {
            const causeNames = entry.likelyCauses.map(c => {
              const key = 'healing.whatChanged.' + c;
              return window.t ? window.t(key) : c;
            }).join(', ');
            const causeBadge = document.createElement('div');
            causeBadge.className = 'healing-entry__cause-badge';
            causeBadge.textContent = window.t
              ? ('⚡ ' + window.t('healing.whatChanged.causeRecorded', { causes: causeNames }))
              : `⚡ Likely trigger: ${causeNames}`;
            details.appendChild(causeBadge);
          }

          // Notes
          if (entry.notes && typeof entry.notes === 'string') {
            const notesP = document.createElement('p');
            notesP.className = 'healing-entry__notes';
            notesP.textContent = `📝 ${entry.notes}`;
            details.appendChild(notesP);
          }

          body.appendChild(details);
          card.appendChild(header);
          card.appendChild(body);
          entriesList.appendChild(card);
        });
      }
    }

    // Symptom Trend Alert evaluation
    updateSymptomTrendAlertUI(activePiece);

    // Trigger analysis modules
    if (window.HealingAnalysis) {
      window.HealingAnalysis.updateAnalysis(activePiece);
    }
  }

  // Symptom Trend Alert Algorithm:
  // Analyzes daily log entries and detects if redness or swelling scores worsen over 3 consecutive entries.
  function detectSymptomTrendAlert(entries) {
    if (!entries || !Array.isArray(entries) || entries.length < 3) {
      return null;
    }

    // Sort ascending by date
    const sorted = entries.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

    // Scan backwards from newest entry to find latest 3 consecutive worsening entries
    for (let i = sorted.length - 1; i >= 2; i--) {
      const e1 = sorted[i - 2];
      const e2 = sorted[i - 1];
      const e3 = sorted[i];

      const r1 = e1.redness !== undefined ? e1.redness : (e1.rednessLevel || 0);
      const r2 = e2.redness !== undefined ? e2.redness : (e2.rednessLevel || 0);
      const r3 = e3.redness !== undefined ? e3.redness : (e3.rednessLevel || 0);

      const s1 = e1.swelling !== undefined ? e1.swelling : (e1.swellingLevel || 0);
      const s2 = e2.swelling !== undefined ? e2.swelling : (e2.swellingLevel || 0);
      const s3 = e3.swelling !== undefined ? e3.swelling : (e3.swellingLevel || 0);

      // Worsening requires strictly increasing severity reaching at least noticeable level (>= 2)
      const rednessWorsening = (r3 > r2 && r2 > r1 && r3 >= 2);
      const swellingWorsening = (s3 > s2 && s2 > s1 && s3 >= 2);

      if (rednessWorsening || swellingWorsening) {
        let symptomType = 'redness';
        if (rednessWorsening && swellingWorsening) {
          symptomType = 'both';
        } else if (swellingWorsening) {
          symptomType = 'swelling';
        }

        return {
          detected: true,
          symptomType: symptomType,
          entries: [e1, e2, e3],
          dates: [e1.date, e2.date, e3.date],
          rednessScores: [r1, r2, r3],
          swellingScores: [s1, s2, s3],
          index: i
        };
      }
    }

    return null;
  }

  function updateSymptomTrendAlertUI(activePiece) {
    const entries = activePiece ? (activePiece.entries || []) : [];
    const alertData = detectSymptomTrendAlert(entries);

    const emergencyBanner = document.getElementById('symptomTrendEmergencyBanner');
    const sidebarAlert = document.getElementById('symptomTrendSidebarAlert');
    const healthNotice = document.getElementById('symptomTrendHealthReportNotice');

    if (!alertData) {
      if (emergencyBanner) emergencyBanner.style.display = 'none';
      if (sidebarAlert) sidebarAlert.style.display = 'none';
      if (healthNotice) healthNotice.style.display = 'none';
      return;
    }

    const t = function(k, fb, params) {
      let s = window.t ? window.t(k, params) : k;
      if (s === k) s = fb || k;
      if (params) Object.keys(params).forEach(function(p) { s = s.split('{' + p + '}').join(params[p]); });
      return s;
    };
    const symptomName = alertData.symptomType === 'both'
      ? t('healing.symptomTrendAlert.symptomBoth', 'Redness and Swelling')
      : (alertData.symptomType === 'swelling'
        ? t('healing.symptomTrendAlert.symptomSwelling', 'Swelling')
        : t('healing.symptomTrendAlert.symptomRedness', 'Redness'));

    const progStr = alertData.dates.map((d, idx) => {
      const r = alertData.rednessScores[idx];
      const s = alertData.swellingScores[idx];
      return `${d} (R:${r}, S:${s})`;
    }).join(' ➔ ');

    const descMsg = t('healing.symptomTrendAlert.desc', 
      'Automated analysis detected 3 consecutive entries of escalating {symptom}: {progression}.',
      { symptom: symptomName, progression: progStr }
    );

    // 1. Emergency Protocols Dynamic Banner
    if (emergencyBanner) {
      emergencyBanner.style.display = 'block';
      const descEl = document.getElementById('symptomTrendAlertDesc');
      if (descEl) descEl.textContent = descMsg;
    }

    // 2. Sidebar Emergency Card
    if (sidebarAlert) {
      sidebarAlert.style.display = 'block';
      const sideText = document.getElementById('symptomTrendSidebarText');
      if (sideText) {
        sideText.textContent = `${symptomName}: ${progStr}. ${t('healing.symptomTrendAlert.recommendation', 'Contact your studio professional or dermatologist for an in-person assessment.')}`;
      }
    }

    // 3. Health Report Notice
    if (healthNotice) {
      healthNotice.style.display = 'block';
      const healthText = document.getElementById('symptomTrendHealthNoticeText');
      if (healthText) healthText.textContent = descMsg;
    }
  }

  // Backup & Restore Implementation
  function exportBackupData() {
    const pieces = getPieces();
    const backup = {
      app: 'Poli_International_Healing_Tracker',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      pieces: pieces
    };

    let totalEntries = 0;
    pieces.forEach(p => {
      totalEntries += (p.entries || []).length;
    });

    const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const dateStr = window.localISODate(new Date());
    downloadAnchor.setAttribute('download', `poli-healing-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    const successMsg = window.t 
      ? window.t('healing.backup.exportSuccess', { count: pieces.length, entries: totalEntries })
      : `Backup exported successfully (${pieces.length} pieces, ${totalEntries} entries).`;
    alert(successMsg);
  }

  // Validate parsed JSON schema before touching storage: reject with clear message and change nothing on failure
  function validateBackupData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { valid: false, error: 'Backup root must be a JSON object.' };
    }

    const recognizedApps = ['Poli_International_Healing_Tracker', 'poli-healing-tracker'];
    if (!data.app || !recognizedApps.includes(data.app)) {
      return { valid: false, error: 'Unrecognised application signature in backup file.' };
    }

    if (data.version === undefined || data.version === null) {
      return { valid: false, error: 'Missing version identifier in backup file.' };
    }

    const versionStr = String(data.version).trim();
    if (!versionStr.startsWith('1')) {
      const unsuppMsg = window.t
        ? window.t('healing.backup.unsupportedVersion', { version: versionStr })
        : `Unrecognised or newer backup version '${versionStr}'. Only version 1 is supported by this software. To prevent data corruption, newer or unrecognised versions cannot be imported.`;
      return { valid: false, error: unsuppMsg };
    }

    if (!Array.isArray(data.pieces)) {
      return { valid: false, error: 'Top-level shape invalid: "pieces" must be an array.' };
    }

    for (let i = 0; i < data.pieces.length; i++) {
      const piece = data.pieces[i];
      if (!piece || typeof piece !== 'object') {
        return { valid: false, error: 'Piece at index ' + i + ' is not an object.' };
      }
      if (!piece.id || typeof piece.id !== 'string') {
        return { valid: false, error: 'Piece at index ' + i + ' is missing a string "id".' };
      }
      if (!piece.name || typeof piece.name !== 'string') {
        return { valid: false, error: 'Piece "' + piece.id + '" is missing a string "name".' };
      }
      if (piece.type !== 'piercing' && piece.type !== 'tattoo') {
        return { valid: false, error: 'Piece "' + piece.name + '" has invalid type "' + piece.type + '".' };
      }
      const pDate = piece.procedureDate || piece.date;
      if (!pDate || isNaN(new Date(pDate).getTime())) {
        return { valid: false, error: 'Piece "' + piece.name + '" has an invalid procedure date.' };
      }
      if (!Array.isArray(piece.entries)) {
        return { valid: false, error: 'Piece "' + piece.name + '" is missing an "entries" array.' };
      }

      for (let j = 0; j < piece.entries.length; j++) {
        const entry = piece.entries[j];
        if (!entry || typeof entry !== 'object') {
          return { valid: false, error: 'Entry at index ' + j + ' in piece "' + piece.name + '" is not an object.' };
        }
        if (!entry.id || typeof entry.id !== 'string') {
          return { valid: false, error: 'Entry at index ' + j + ' in piece "' + piece.name + '" is missing "id".' };
        }
        if (!entry.date || isNaN(new Date(entry.date).getTime())) {
          return { valid: false, error: 'Entry "' + entry.id + '" in piece "' + piece.name + '" has an invalid date.' };
        }
        if (typeof entry.day !== 'number' && typeof entry.dayOffset !== 'number') {
          return { valid: false, error: 'Entry "' + entry.id + '" in piece "' + piece.name + '" missing day number.' };
        }
        const symptoms = ['redness', 'swelling', 'tenderness', 'discharge'];
        for (let s = 0; s < symptoms.length; s++) {
          const sKey = symptoms[s];
          if (typeof entry[sKey] !== 'number' || isNaN(entry[sKey])) {
            return { valid: false, error: 'Entry "' + entry.id + '" in piece "' + piece.name + '" missing numeric rating for ' + sKey + '.' };
          }
        }
      }
    }

    return { valid: true };
  }

  function importBackupData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        let parsed;
        try {
          parsed = JSON.parse(e.target.result);
        } catch (jsonErr) {
          const parseErrorMsg = window.t
            ? window.t('healing.backup.validationFailed', { reason: 'Invalid JSON format. File could not be parsed.' })
            : 'Backup validation failed: Invalid JSON format. File could not be parsed.\n\nNo changes were made to your records.';
          alert(parseErrorMsg);
          return;
        }

        const validation = validateBackupData(parsed);
        if (!validation.valid) {
          const validationMsg = window.t
            ? window.t('healing.backup.validationFailed', { reason: validation.error })
            : ('Backup validation failed: ' + validation.error + '\n\nNo changes were made to your records.');
          alert(validationMsg);
          return;
        }

        // Standardize piece structure
        parsed.pieces.forEach(p => {
          if (!p.procedureDate && p.date) {
            p.procedureDate = p.date;
          }
        });

        let totalEntries = 0;
        parsed.pieces.forEach(p => {
          totalEntries += (p.entries || []).length;
        });

        pendingImportData = parsed;

        // Present the modal choice (Replace or Merge)
        const importModal = document.getElementById('importChoiceModal');
        const summaryEl = document.getElementById('importFileSummary');
        if (summaryEl) {
          summaryEl.textContent = `Valid Backup File: ${parsed.pieces.length} piece(s) and ${totalEntries} entry(s).`;
        }

        if (importModal) {
          importModal.style.display = 'flex';
        } else {
          // Fallback confirmation prompt if modal is absent
          const isMerge = confirm(
            `Backup verified: ${parsed.pieces.length} piece(s), ${totalEntries} entry(s).\n\nClick OK to MERGE with current records (duplicates skipped).\nClick Cancel to REPLACE all existing records.`
          );
          executeImport(isMerge ? 'merge' : 'replace');
        }
      } catch (err) {
        console.error('Import backup failure', err);
        const errorMsg = window.t
          ? window.t('healing.backup.validationFailed', { reason: err.message || 'Unknown processing error' })
          : 'Backup validation failed: ' + (err.message || 'Unknown error') + '\n\nNo changes were made to your records.';
        alert(errorMsg);
      }
    };
    reader.readAsText(file);
  }

  function executeImport(mode) {
    if (!pendingImportData) return;
    const parsed = pendingImportData;
    pendingImportData = null;

    const importModal = document.getElementById('importChoiceModal');
    if (importModal) importModal.style.display = 'none';

    const importInput = document.getElementById('importBackupInput');
    if (importInput) importInput.value = '';

    if (mode === 'replace') {
      // Complete replacement: discard existing log and replace with backup
      const sanitizedPieces = parsed.pieces.map(p => ({
        id: String(p.id),
        type: p.type,
        name: String(p.name || ''),
        procedureDate: p.procedureDate,
        location: p.location || null,
        size: p.size || null,
        baselinePhoto: (p.baselinePhoto && typeof p.baselinePhoto === 'string' && p.baselinePhoto.startsWith('data:image/')) ? p.baselinePhoto : null,
        entries: (p.entries || []).map(e => ({
          id: String(e.id),
          date: String(e.date),
          dayOffset: typeof e.dayOffset === 'number' ? e.dayOffset : (typeof e.day === 'number' ? e.day : 0),
          redness: Number(e.redness) || 0,
          swelling: Number(e.swelling) || 0,
          tenderness: Number(e.tenderness) || 0,
          discharge: Number(e.discharge) || 0,
          overallScore: (Number(e.redness) || 0) + (Number(e.swelling) || 0) + (Number(e.tenderness) || 0) + (Number(e.discharge) || 0),
          photo: (e.photo && typeof e.photo === 'string' && e.photo.startsWith('data:image/')) ? e.photo : null,
          notes: typeof e.notes === 'string' ? e.notes : '',
          likelyCauses: Array.isArray(e.likelyCauses) ? e.likelyCauses.map(String) : [],
          createdAt: e.createdAt || new Date().toISOString()
        })),
        createdAt: p.createdAt || new Date().toISOString()
      }));

      // Commit in ONE atomic write
      savePieces(sanitizedPieces);
      if (sanitizedPieces.length > 0) {
        setActivePieceId(sanitizedPieces[0].id);
      } else {
        setActivePieceId(null);
      }

      let totalEntries = 0;
      sanitizedPieces.forEach(p => { totalEntries += p.entries.length; });

      renderActivePieceView();
      updateStorageDisplay();

      const successMsg = window.t
        ? window.t('healing.backup.importSuccess', { count: sanitizedPieces.length, entries: totalEntries })
        : `Successfully restored ${sanitizedPieces.length} pieces and ${totalEntries} entries.`;
      alert(successMsg);

    } else if (mode === 'merge') {
      // Merge mode: keep existing records, add new pieces and non-duplicate entries
      const currentPieces = JSON.parse(JSON.stringify(getPieces()));
      let addedPieces = 0;
      let addedEntries = 0;
      let skippedEntries = 0;

      parsed.pieces.forEach(bp => {
        const existing = currentPieces.find(cp =>
          cp.id === bp.id ||
          (cp.type === bp.type && cp.procedureDate === bp.procedureDate && (cp.location || '') === (bp.location || ''))
        );

        const sanitizedEntries = (bp.entries || []).map(e => ({
          id: String(e.id),
          date: String(e.date),
          dayOffset: typeof e.dayOffset === 'number' ? e.dayOffset : (typeof e.day === 'number' ? e.day : 0),
          redness: Number(e.redness) || 0,
          swelling: Number(e.swelling) || 0,
          tenderness: Number(e.tenderness) || 0,
          discharge: Number(e.discharge) || 0,
          overallScore: (Number(e.redness) || 0) + (Number(e.swelling) || 0) + (Number(e.tenderness) || 0) + (Number(e.discharge) || 0),
          photo: (e.photo && typeof e.photo === 'string' && e.photo.startsWith('data:image/')) ? e.photo : null,
          notes: typeof e.notes === 'string' ? e.notes : '',
          likelyCauses: Array.isArray(e.likelyCauses) ? e.likelyCauses.map(String) : [],
          createdAt: e.createdAt || new Date().toISOString()
        }));

        if (existing) {
          if (!existing.baselinePhoto && bp.baselinePhoto && typeof bp.baselinePhoto === 'string' && bp.baselinePhoto.startsWith('data:image/')) {
            existing.baselinePhoto = bp.baselinePhoto;
          }
          if (!Array.isArray(existing.entries)) existing.entries = [];

          sanitizedEntries.forEach(be => {
            const isDup = existing.entries.some(ce =>
              ce.id === be.id || (ce.date === be.date && ce.dayOffset === be.dayOffset)
            );
            if (isDup) {
              skippedEntries++;
            } else {
              existing.entries.push(be);
              addedEntries++;
            }
          });
        } else {
          const newPiece = {
            id: String(bp.id),
            type: bp.type,
            name: String(bp.name || ''),
            procedureDate: bp.procedureDate,
            location: bp.location || null,
            size: bp.size || null,
            baselinePhoto: (bp.baselinePhoto && typeof bp.baselinePhoto === 'string' && bp.baselinePhoto.startsWith('data:image/')) ? bp.baselinePhoto : null,
            entries: sanitizedEntries,
            createdAt: bp.createdAt || new Date().toISOString()
          };
          currentPieces.push(newPiece);
          addedPieces++;
          addedEntries += sanitizedEntries.length;
        }
      });

      // Commit merged pieces in ONE atomic write
      savePieces(currentPieces);
      if (!getActivePieceId() && currentPieces.length > 0) {
        setActivePieceId(currentPieces[0].id);
      }

      renderActivePieceView();
      updateStorageDisplay();

      const successMsg = window.t
        ? window.t('healing.backup.mergeSuccess', {
            addedPieces: addedPieces,
            addedEntries: addedEntries,
            skippedEntries: skippedEntries
          })
        : `Successfully merged backup: ${addedPieces} new piece(s) added, ${addedEntries} new entry(s) added (${skippedEntries} duplicate entries skipped).`;
      alert(successMsg);
    }
  }

  // tension-gauge.js and journey-snapshot.js read HealingLogManager, which
  // nothing defined: both reported zero entries whatever was logged.
  window.HealingLogManager = window.HealingLog = {
    init: initHealingLogUI,
    getActivePiece: getActivePiece,
    getCurrentPiece: getActivePiece,
    deleteEntry: deleteEntry,
    exportBackupData: exportBackupData,
    importBackupData: importBackupData,
    validateBackupData: validateBackupData,
    renderActivePieceView: renderActivePieceView,
    compressImage: compressImage,
    getStorageEstimate: getStorageEstimate,
    updateStorageDisplay: updateStorageDisplay,
    dropOldestPhotos: dropOldestPhotos,
    executeImport: executeImport,
    detectSymptomTrendAlert: detectSymptomTrendAlert,
    updateSymptomTrendAlertUI: updateSymptomTrendAlertUI
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHealingLogUI);
  } else {
    initHealingLogUI();
  }
})();
