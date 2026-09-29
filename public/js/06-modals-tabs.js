// Tab Switching Logic
    document.querySelectorAll('.tool-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tool-tab').forEach(t => {
                t.classList.remove('active');
                t.style.background = '#1E293B';
                t.style.color = '#D1D5DB';
            });
            tab.classList.add('active');
            tab.style.background = 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)';
            tab.style.color = '#FFFFFF';
            const tabName = tab.dataset.tab;
            if (tabName) {
                document.querySelectorAll('.wrapper-tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                const targetContent = document.getElementById('tab-' + tabName);
                if (targetContent) targetContent.style.display = 'block';

                if (tabName === 'tool') {
                    if (typeof window.closeTattooPriceEstimatorModal === 'function') window.closeTattooPriceEstimatorModal();
                    const staffDash = document.getElementById('staff-dashboard-component');
                    if (staffDash) staffDash.style.display = 'block';
                    if (typeof updatePortalHeaderModeUI === 'function') {
                        window.currentPortalMode = 'staff';
                        updatePortalHeaderModeUI();
                    }
                }

                if (tabName === 'activity') {
                    unreadCount = 0;
                    if (typeof updateUnreadBadges === 'function') updateUnreadBadges();
                    setTimeout(() => {
                        if (typeof renderD3ActivityChart === 'function') renderD3ActivityChart();
                    }, 50);
                }
            }
        });
    });

    function switchTabToActivity() {
        document.querySelector('.tool-tab[data-tab="activity"]').click();
        const drawer = document.getElementById('activity-drawer');
        if (drawer) drawer.classList.remove('open');
    }
    window.switchTabToActivity = switchTabToActivity;

    function switchTabToTool() {
        if (typeof window.closeTattooPriceEstimatorModal === 'function') window.closeTattooPriceEstimatorModal();
        const tab = document.querySelector('.tool-tab[data-tab="tool"]');
        if (tab) tab.click();
        if (typeof window.switchToStaffDashboardMode === 'function') window.switchToStaffDashboardMode();
    }
    window.switchTabToTool = switchTabToTool;

    function copyEmbedCode() {
        const textarea = document.getElementById('embedCodeTab');
        textarea.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    }

    // REAL-TIME ACTIVITY FEED SCRIPT ENGINE
    let allActivities = [];
    let currentCategoryFilter = 'all';
    let unreadCount = 0;
    let sseSource = null;
    let sseReconnectAttempts = 0;
    let sseReconnectTimer = null;
    const SSE_BASE_BACKOFF_MS = 1000;
    const SSE_MAX_BACKOFF_MS = 30000;

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showUndoToast(msg) {
        let toast = document.getElementById('undo-notification-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'undo-notification-toast';
            toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#10B981;color:#FFFFFF;padding:10px 18px;border-radius:10px;font-weight:600;font-size:0.9rem;box-shadow:0 10px 25px rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;gap:8px;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);opacity:0;transform:translateY(20px);pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 3000);
    }

    function undoActivityLog(id, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const btn = event && event.currentTarget ? event.currentTarget : document.querySelector(`.undo-btn[data-undo-id="${id}"]`);
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Undoing...';
            btn.style.opacity = '0.6';
        }

        fetch(`/api/activity-logs/${id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to undo custom log entry');
            return res.json();
        })
        .then(data => {
            allActivities = allActivities.filter(a => a.id !== id);
            renderActivityFeed();
            renderDrawerFeed();
            renderD3ActivityChart();
            showUndoToast('↩️ Custom action log reverted successfully');
        })
        .catch(err => {
            alert('Could not undo action: ' + err.message);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '↩️ Undo';
                btn.style.opacity = '1';
            }
        });
    }

    function updateUndoTimers() {
        const undoButtons = document.querySelectorAll('.undo-btn[data-timestamp]');
        undoButtons.forEach(btn => {
            const ts = btn.getAttribute('data-timestamp');
            const parsedTime = ts ? new Date(ts).getTime() : NaN;
            const ageSec = !isNaN(parsedTime) ? Math.floor((Date.now() - parsedTime) / 1000) : 31;
            if (ageSec >= 30) {
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (btn.parentNode) btn.remove();
                }, 200);
            } else {
                const rem = 30 - ageSec;
                btn.innerHTML = `↩️ Undo (${rem}s)`;
            }
        });
    }

    setInterval(updateUndoTimers, 1000);

    // AUDIO NOTIFICATION SETTINGS & SYNTHESIZER
    let audioAlertsEnabled = true;

    function loadAudioAlertsSetting() {
        try {
            const saved = localStorage.getItem('studio_audio_alerts');
            if (saved !== null) {
                audioAlertsEnabled = saved === 'true';
            }
        } catch(e) {}
        updateAudioAlertsUI();
    }

    function toggleAudioAlerts() {
        audioAlertsEnabled = !audioAlertsEnabled;
        try {
            localStorage.setItem('studio_audio_alerts', String(audioAlertsEnabled));
        } catch(e) {}
        updateAudioAlertsUI();
        if (audioAlertsEnabled) {
            playActivityChime(true);
        }
    }

    function updateAudioAlertsUI() {
        const btns = document.querySelectorAll('.audio-alert-toggle-btn');
        btns.forEach(btn => {
            if (audioAlertsEnabled) {
                btn.style.background = 'rgba(16, 185, 129, 0.15)';
                btn.style.color = '#34D399';
                btn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                btn.innerHTML = '🔔 Audio Alerts: ON';
                btn.title = 'Audio notifications enabled for incoming activities. Click to mute.';
            } else {
                btn.style.background = 'rgba(239, 68, 68, 0.15)';
                btn.style.color = '#F87171';
                btn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                btn.innerHTML = '🔕 Audio Alerts: OFF';
                btn.title = 'Audio notifications muted. Click to enable.';
            }
        });
    }

    function playActivityChime(isTest = false) {
        if (!audioAlertsEnabled && !isTest) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const now = ctx.currentTime;

            // Tone 1: D5 (587.33 Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(587.33, now);
            gain1.gain.setValueAtTime(0.12, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.22);

            // Tone 2: A5 (880.00 Hz)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880.00, now + 0.08);
            gain2.gain.setValueAtTime(0.15, now + 0.08);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.35);
        } catch(e) {
            console.warn('Audio chime playback omitted:', e);
        }
    }

    function playMessengerChime(isTest = false) {
        if (!audioAlertsEnabled && !isTest) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const now = ctx.currentTime;

            // Distinct Dual High-Pitch Synth Chime for Team Messenger Messages
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(698.46, now);
            gain1.gain.setValueAtTime(0.14, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.18);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1046.50, now + 0.06);
            gain2.gain.setValueAtTime(0.18, now + 0.06);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.30);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.06);
            osc2.stop(now + 0.30);
        } catch(e) {
            console.warn('Messenger audio chime playback omitted:', e);
        }
    }

    function getCategoryEmoji(cat) {
        switch(cat) {
            case 'appointment': return '📅';
            case 'inventory': return '📦';
            case 'client': return '👤';
            case 'financial': return '💳';
            case 'compliance': return '🛡️';
            case 'staff': return '👥';
            default: return '⚡';
        }
    }

    function formatRelativeTime(isoString) {
        if (!isoString) return 'Just now';
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Recently';
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);

        if (diffSec < 15) return 'Just now';
        if (diffSec < 60) return `${diffSec}s ago`;
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        try {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            try {
                return date.toISOString().substring(0, 10);
            } catch (err) {
                return 'Recently';
            }
        }
    }

    // ==========================================
    // OFFLINE QUEUE & BULK SYNC ENGINE
    // ==========================================
    const OFFLINE_QUEUE_KEY = 'studio_crm_pending_activity_logs';
    let isSyncingBulk = false;

    function getPendingQueue() {
        try {
            const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
            if (!raw) return [];
            const queue = JSON.parse(raw);
            const nowMs = Date.now();
            const maxAgeMs = 24 * 60 * 60 * 1000; // 24 Hours
            const freshQueue = queue.filter(item => {
                const t = new Date(item.timestamp).getTime();
                return !isNaN(t) && (nowMs - t <= maxAgeMs);
            });
            if (freshQueue.length !== queue.length) {
                localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(freshQueue));
            }
            return freshQueue;
        } catch (e) {
            return [];
        }
    }

    function pruneStalePendingLogs() {
        try {
            const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
            if (!raw) return;
            const queue = JSON.parse(raw);
            const nowMs = Date.now();
            const maxAgeMs = 24 * 60 * 60 * 1000;
            const freshQueue = queue.filter(item => {
                const t = new Date(item.timestamp).getTime();
                return !isNaN(t) && (nowMs - t <= maxAgeMs);
            });
            if (freshQueue.length !== queue.length) {
                const prunedCount = queue.length - freshQueue.length;
                savePendingQueue(freshQueue);
                showSyncQueueToast(`🧹 <strong>Queue Maintenance:</strong> Pruned ${prunedCount} stale offline log(s) older than 24h.`);
                if (typeof renderActivityFeed === 'function') renderActivityFeed();
                if (typeof renderD3ActivityChart === 'function') renderD3ActivityChart();
            }
        } catch (e) {
            console.error('Failed to prune stale pending logs:', e);
        }
    }

    function savePendingQueue(queue) {
        try {
            localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        } catch (e) {
            console.error('Failed to save pending queue to localStorage:', e);
        }
        updateSyncStatusIndicatorUI();
    }

    function enqueuePendingLog(logItem) {
        const queue = getPendingQueue();
        const pendingEntry = {
            id: 'pending_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
            timestamp: new Date().toISOString(),
            category: logItem.category || 'general',
            action: logItem.action || 'MANUAL_LOG',
            title: logItem.title || 'Untitled Action',
            details: logItem.details || '',
            user: logItem.user || 'Studio Staff',
            badgeColor: logItem.badgeColor || 'amber',
            isPendingSync: true
        };
        queue.unshift(pendingEntry);
        savePendingQueue(queue);

        if (typeof renderActivityFeed === 'function') renderActivityFeed();
        if (typeof renderDrawerFeed === 'function') renderDrawerFeed();
        if (typeof renderD3ActivityChart === 'function') renderD3ActivityChart();

        showSyncQueueToast(`⚡ <strong>Saved Offline!</strong> Queue count: ${queue.length} log(s). Auto-syncing when online.`);
        return pendingEntry;
    }

    function updateSyncStatusIndicatorUI() {
        const indicator = document.getElementById('sync-status-indicator');
        if (!indicator) return;

        const queue = getPendingQueue();
        const count = queue.length;
        const isOnline = navigator.onLine;

        if (isSyncingBulk) {
            indicator.className = 'sync-active-pulse';
            indicator.style.background = 'rgba(59, 130, 246, 0.2)';
            indicator.style.borderColor = 'rgba(59, 130, 246, 0.6)';
            indicator.style.color = '#60A5FA';
            indicator.title = `Syncing ${count} pending offline log(s) to server...`;
            indicator.innerHTML = `
                <span style="display:inline-block;width:10px;height:10px;border:2px solid #60A5FA;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></span>
                <span>🔄 Syncing (${count})...</span>
            `;
        } else if (!isOnline || count > 0) {
            indicator.className = '';
            indicator.style.background = 'rgba(245, 158, 11, 0.2)';
            indicator.style.borderColor = 'rgba(245, 158, 11, 0.45)';
            indicator.style.color = '#FBBF24';
            const label = !isOnline ? `⚡ Offline (${count} Pending)` : `⚡ Pending Sync (${count})`;
            indicator.title = !isOnline ? `App is offline. ${count} item(s) pending sync.` : `Online. ${count} item(s) in queue. Click to trigger bulk push.`;
            indicator.innerHTML = `
                <span style="width:8px;height:8px;border-radius:50%;background:#F59E0B;display:inline-block;box-shadow:0 0 6px rgba(245, 158, 11, 0.7);"></span>
                <span>${label}</span>
            `;
        } else {
            indicator.className = '';
            indicator.style.background = 'rgba(16, 185, 129, 0.15)';
            indicator.style.borderColor = 'rgba(16, 185, 129, 0.35)';
            indicator.style.color = '#34D399';
            indicator.title = 'Online. All activity logs synced with server.';
            indicator.innerHTML = `
                <span class="pulse-dot" style="width:8px;height:8px;border-radius:50%;background:#10B981;display:inline-block;"></span>
                <span>🟢 Cloud Synced</span>
            `;
        }
    }

    function retrySinglePendingLog(logId, event) {
        if (event) event.stopPropagation();
        if (!navigator.onLine) {
            showSyncQueueToast('⚠️ <strong>Network Offline:</strong> Reconnect internet to retry sync.', true);
            return;
        }

        const queue = getPendingQueue();
        const itemIndex = queue.findIndex(q => q.id === logId);
        if (itemIndex === -1) {
            showSyncQueueToast('ℹ️ Log entry already synced or not found in queue.');
            fetchActivityLogs();
            return;
        }

        const item = queue[itemIndex];
        showSyncQueueToast(`🔄 <strong>Retrying Log Sync...</strong> Processing "${escapeHtml(item.title)}".`, false);

        fetch('/api/activity-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: item.title,
                category: item.category,
                action: item.action || 'MANUAL_LOG',
                user: item.user || 'Studio Staff',
                details: item.details || '',
                badgeColor: item.badgeColor || 'amber'
            })
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(() => {
            const updatedQueue = getPendingQueue().filter(q => q.id !== logId);
            savePendingQueue(updatedQueue);
            showSyncQueueToast(`🟢 <strong>Synced Successfully!</strong> "${escapeHtml(item.title)}" recorded to cloud API.`);
            fetchActivityLogs();
            updateSyncStatusIndicatorUI();
        })
        .catch(err => {
            console.warn('Single log retry failed:', err);
            const currentQueue = getPendingQueue();
            const idx = currentQueue.findIndex(q => q.id === logId);
            if (idx !== -1) {
                currentQueue[idx].syncFailed = true;
                currentQueue[idx].syncErrorMsg = err.message || 'API request failed';
                savePendingQueue(currentQueue);
            }
            showSyncQueueToast(`❌ <strong>Sync Failed:</strong> ${escapeHtml(err.message || 'Server error')}. Click 'Retry' on the entry to attempt again.`, true);
            if (typeof renderActivityFeed === 'function') renderActivityFeed();
            updateSyncStatusIndicatorUI();
        });
    }

    async function flushPendingLogsQueue() {
        if (isSyncingBulk || !navigator.onLine) return;
        const initialQueue = getPendingQueue();
        if (initialQueue.length === 0) {
            updateSyncStatusIndicatorUI();
            return;
        }

        isSyncingBulk = true;
        updateSyncStatusIndicatorUI();

        const BATCH_SIZE = 5;
        const MAX_RETRIES_PER_BATCH = 3;
        let totalSyncedCount = 0;
        let encounteredError = false;
        let lastErrorMessage = '';

        while (navigator.onLine) {
            const currentQueue = getPendingQueue();
            if (currentQueue.length === 0) break;

            const batch = currentQueue.slice(0, BATCH_SIZE);
            const batchIds = new Set(batch.map(item => item.id));

            let batchSuccess = false;
            let attempts = 0;

            while (attempts < MAX_RETRIES_PER_BATCH && !batchSuccess && navigator.onLine) {
                attempts++;
                try {
                    const res = await fetch('/api/activity-logs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(batch)
                    });

                    if (res.status === 409) {
                        const errData = await res.json().catch(() => ({}));
                        batchSuccess = true;
                        encounteredError = true;

                        const latestQueue = getPendingQueue();
                        const conflicts = errData.conflicts || [{ localEntry: batch[0], serverEntry: errData.serverEntry }];
                        
                        conflicts.forEach(c => {
                            if (!c || !c.localEntry) return;
                            const match = latestQueue.find(q => q.id === c.localEntry.id || q.title === c.localEntry.title);
                            if (match) {
                                match.hasConflict = true;
                                match.syncFailed = true;
                                match.conflictData = c;
                            }
                        });
                        savePendingQueue(latestQueue);

                        showSyncQueueToast(`⚠️ <strong>Sync Collision:</strong> Offline entry collided with server state. Opening Conflict Resolver...`, true);
                        if (conflicts.length > 0 && conflicts[0].localEntry) {
                            openConflictResolutionModal(conflicts[0].localEntry, conflicts[0].serverEntry || conflicts[0].localEntry, conflicts[0].localEntry.id);
                        }
                        break;
                    }

                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const data = await res.json();

                    totalSyncedCount += data.count || batch.length;
                    batchSuccess = true;

                    // Remove successfully synced batch items from queue
                    const remainingQueue = getPendingQueue().filter(q => !batchIds.has(q.id));
                    savePendingQueue(remainingQueue);

                } catch (err) {
                    lastErrorMessage = err.message || 'Server error';
                    // Exponential backoff strategy with jitter: base 500ms * 2^(attempt - 1) + jitter
                    const baseBackoffMs = 500;
                    const cappedBackoffMs = Math.min(10000, baseBackoffMs * Math.pow(2, attempts - 1));
                    const jitterMs = Math.floor(Math.random() * 200);
                    const totalDelayMs = cappedBackoffMs + jitterMs;

                    console.warn(`[Network Retry] Batch sync attempt ${attempts}/${MAX_RETRIES_PER_BATCH} failed: ${err.message}. Applying exponential backoff delay of ${totalDelayMs}ms...`);

                    if (attempts < MAX_RETRIES_PER_BATCH) {
                        await new Promise(resolve => setTimeout(resolve, totalDelayMs));
                    }
                }
            }

            if (!batchSuccess) {
                encounteredError = true;
                // Mark failed batch items with syncFailed flag
                const latestQueue = getPendingQueue();
                latestQueue.forEach(item => {
                    if (batchIds.has(item.id)) {
                        item.syncFailed = true;
                        item.syncErrorMsg = lastErrorMessage;
                    }
                });
                savePendingQueue(latestQueue);
                break;
            }
        }

        isSyncingBulk = false;

        if (totalSyncedCount > 0 && !encounteredError) {
            showSyncQueueToast(`🟢 <strong>Bulk Sync Complete!</strong> Pushed ${totalSyncedCount} offline activity log(s) in batch-retry chunks of ${BATCH_SIZE}.`);
            fetchActivityLogs();
        } else if (totalSyncedCount > 0 && encounteredError) {
            showSyncQueueToast(`⚠️ <strong>Partial Sync (${totalSyncedCount} synced):</strong> Batch retry stopped due to error: ${escapeHtml(lastErrorMessage)}. Remaining entries queued for retry.`, true);
            fetchActivityLogs();
        } else if (encounteredError) {
            showSyncQueueToast(`❌ <strong>Sync Failed:</strong> ${escapeHtml(lastErrorMessage)}. Entries highlighted for retry.`, true);
        }

        if (typeof renderActivityFeed === 'function') renderActivityFeed();
        updateSyncStatusIndicatorUI();
    }

    function triggerManualSync() {
        if (!navigator.onLine) {
            showSyncQueueToast('⚠️ <strong>Network Offline:</strong> Reconnect internet to trigger bulk push.', true);
            return;
        }
        const queue = getPendingQueue();
        if (queue.length === 0) {
            fetchActivityLogs();
            showSyncQueueToast('🟢 <strong>Activity Stream Refreshed:</strong> Queue clean and in sync!');
            return;
        }
        flushPendingLogsQueue();
    }

    function postActivityLog(logData) {
        if (!navigator.onLine) {
            return Promise.resolve(enqueuePendingLog(logData));
        }

        return fetch('/api/activity-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData)
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .catch(err => {
            console.warn('Network post failed, enqueuing offline item:', err.message);
            return enqueuePendingLog(logData);
        });
    }

    function showSyncQueueToast(htmlMsg, showRetryBtn = true) {
        let toast = document.getElementById('sync-queue-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sync-queue-toast';
            toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1E293B;color:#F8FAFC;border:1px solid #3B82F6;border-radius:10px;padding:12px 18px;font-size:0.88rem;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.4);z-index:999999;display:flex;align-items:center;gap:12px;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);transform:translateY(100px);opacity:0;pointer-events:none;flex-wrap:wrap;max-width:90vw;';
            document.body.appendChild(toast);
        }

        const pendingCount = getPendingQueue().length;
        let retryBtnHtml = '';
        if (showRetryBtn && (pendingCount > 0 || !navigator.onLine)) {
            retryBtnHtml = `
                <button onclick="triggerManualSync()" style="background:#3B82F6;color:#FFF;border:none;padding:5px 12px;border-radius:6px;font-weight:700;font-size:0.8rem;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(59,130,246,0.4);transition:all 0.15s ease;" onmouseover="this.style.background='#2563EB'" onmouseout="this.style.background='#3B82F6'" title="Click to trigger forced server synchronization">
                    🔄 Retry Sync
                </button>
            `;
        }

        toast.innerHTML = `
            <div style="flex:1;">${htmlMsg}</div>
            ${retryBtnHtml}
        `;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        toast.style.pointerEvents = 'auto';

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            toast.style.pointerEvents = 'none';
        }, 5500);
    }

    window.addEventListener('online', () => {
        updateSyncStatusIndicatorUI();
        showSyncQueueToast('🟢 <strong>Network Connection Restored!</strong> Triggering automatic bulk sync...');
        flushPendingLogsQueue();
    });

    window.addEventListener('offline', () => {
        updateSyncStatusIndicatorUI();
        showSyncQueueToast('⚡ <strong>Working Offline:</strong> Custom logs will be queued locally.');
    });

    setInterval(() => {
        pruneStalePendingLogs();
        if (navigator.onLine && getPendingQueue().length > 0 && !isSyncingBulk) {
            flushPendingLogsQueue();
        }
    }, 10000);

    function fetchActivityLogs() {
        fetch('/api/activity-logs?limit=100')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Non-JSON response received');
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    allActivities = data;
                    renderActivityFeed();
                    renderDrawerFeed();
                    renderD3ActivityChart();
                }
            })
            .catch(err => {
                console.warn('Activity log refresh skipped:', err.message);
            });
    }

    function initSSEConnection() {
        if (sseReconnectTimer) {
            clearTimeout(sseReconnectTimer);
            sseReconnectTimer = null;
        }

        if (sseSource) {
            sseSource.onopen = null;
            sseSource.onmessage = null;
            sseSource.onerror = null;
            sseSource.close();
            sseSource = null;
        }

        try {
            sseSource = new EventSource('/api/activity-logs/stream');
        } catch (err) {
            console.warn('Failed to initialize SSE EventSource:', err);
            scheduleSseReconnect();
            return;
        }

        sseSource.onopen = function() {
            sseReconnectAttempts = 0; // Reset attempts on successful connection
            const pill = document.getElementById('live-status-pill');
            if (pill) {
                pill.innerHTML = '<span class="pulse-dot"></span> LIVE SSE STREAM';
                pill.style.background = 'rgba(16, 185, 129, 0.15)';
                pill.style.color = '#34D399';
            }
            if (typeof flushPendingLogsQueue === 'function') {
                flushPendingLogsQueue();
            }
        };

        sseSource.onmessage = function(event) {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === 'ping' || payload.type === 'connected') return;

                // Delta-based Update Mechanism
                if (payload.type === 'activity_delta') {
                    const op = payload.op || (payload.data && payload.data.op);
                    const id = payload.id || (payload.data && payload.data.id);
                    const ids = payload.ids || (payload.data && payload.data.ids);
                    const delta = payload.delta || (payload.data && payload.data.delta);

                    if (op === 'create' && delta) {
                        if (!allActivities.some(a => String(a.id) === String(delta.id))) {
                            allActivities.unshift(delta);
                            unreadCount++;
                            updateUnreadBadges();
                            renderActivityFeed(delta.id);
                            renderDrawerFeed(delta.id);
                            renderD3ActivityChart();
                            playActivityChime();
                        }
                    } else if (op === 'update' && id && delta) {
                        const idx = allActivities.findIndex(a => String(a.id) === String(id));
                        if (idx !== -1) {
                            Object.assign(allActivities[idx], delta);
                            renderActivityFeed(id);
                            renderDrawerFeed(id);
                            renderD3ActivityChart();
                        }
                    } else if (op === 'delete' && id) {
                        allActivities = allActivities.filter(a => String(a.id) !== String(id));
                        if (typeof selectedActivityIds !== 'undefined') selectedActivityIds.delete(String(id));
                        renderActivityFeed();
                        renderDrawerFeed();
                        renderD3ActivityChart();
                    } else if (op === 'bulk_delete' && (ids || Array.isArray(delta?.ids))) {
                        const targetIds = new Set((ids || delta?.ids || []).map(String));
                        allActivities = allActivities.filter(a => !targetIds.has(String(a.id)));
                        if (typeof selectedActivityIds !== 'undefined') {
                            targetIds.forEach(i => selectedActivityIds.delete(i));
                        }
                        renderActivityFeed();
                        renderDrawerFeed();
                        renderD3ActivityChart();
                    }
                    return;
                }

                if (payload.type === 'deleted') {
                    allActivities = allActivities.filter(a => String(a.id) !== String(payload.id));
                    if (typeof selectedActivityIds !== 'undefined') selectedActivityIds.delete(String(payload.id));
                    renderActivityFeed();
                    renderDrawerFeed();
                    renderD3ActivityChart();
                    return;
                }

                if (payload.type === 'deleted_bulk' && Array.isArray(payload.data?.ids)) {
                    const targetIds = new Set(payload.data.ids.map(String));
                    allActivities = allActivities.filter(a => !targetIds.has(String(a.id)));
                    if (typeof selectedActivityIds !== 'undefined') {
                        targetIds.forEach(i => selectedActivityIds.delete(i));
                    }
                    renderActivityFeed();
                    renderDrawerFeed();
                    renderD3ActivityChart();
                    return;
                }

                // Prepend new activity if full object payload
                if (payload.id && !allActivities.some(a => String(a.id) === String(payload.id))) {
                    allActivities.unshift(payload);
                    unreadCount++;
                    updateUnreadBadges();
                    renderActivityFeed(payload.id);
                    renderDrawerFeed(payload.id);
                    renderD3ActivityChart();
                    playActivityChime();
                }
            } catch (err) {
                console.warn('Error processing SSE activity message:', err);
            }
        };

        sseSource.onerror = function() {
            if (sseSource) {
                sseSource.close();
                sseSource = null;
            }
            scheduleSseReconnect();
        };
    }

    function scheduleSseReconnect() {
        sseReconnectAttempts++;
        // Exponential Backoff calculation: min(MAX, BASE * 2^(attempts-1) + jitter)
        const backoffMs = Math.min(
            SSE_MAX_BACKOFF_MS,
            SSE_BASE_BACKOFF_MS * Math.pow(2, sseReconnectAttempts - 1) + Math.floor(Math.random() * 500)
        );
        const seconds = (backoffMs / 1000).toFixed(1);

        const pill = document.getElementById('live-status-pill');
        if (pill) {
            pill.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#F59E0B;display:inline-block;margin-right:6px;"></span> RECONNECTING IN ${seconds}s (#${sseReconnectAttempts})`;
            pill.style.background = 'rgba(245, 158, 11, 0.15)';
            pill.style.color = '#FBBF24';
        }

        if (sseReconnectTimer) clearTimeout(sseReconnectTimer);
        sseReconnectTimer = setTimeout(() => {
            initSSEConnection();
        }, backoffMs);
    }

    // Gentle fallback polling loop (every 15s) to avoid rate limits
    setInterval(fetchActivityLogs, 15000);
    fetchActivityLogs();
    initSSEConnection();
    if (typeof fetchGalleryWorks === 'function') fetchGalleryWorks();

    function updateUnreadBadges() {
        const topBadge = document.getElementById('unread-count-badge');
        const drawerBadge = document.getElementById('drawer-unread-pill');
        const headerDrawerBadge = document.getElementById('header-drawer-unread-pill');

        if (unreadCount > 0) {
            if (topBadge) { topBadge.textContent = unreadCount; topBadge.style.display = 'inline-block'; }
            if (drawerBadge) { drawerBadge.textContent = unreadCount; drawerBadge.style.display = 'inline-block'; }
            if (headerDrawerBadge) { headerDrawerBadge.textContent = unreadCount; headerDrawerBadge.style.display = 'inline-block'; }
        } else {
            if (topBadge) topBadge.style.display = 'none';
            if (drawerBadge) drawerBadge.style.display = 'none';
            if (headerDrawerBadge) headerDrawerBadge.style.display = 'none';
        }
    }

    function getLocalizedFormattedDate() {
        try {
            const now = new Date();
            const userLocale = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US';
            return new Intl.DateTimeFormat(userLocale, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            }).format(now);
        } catch (e) {
            try {
                return new Date().toLocaleDateString();
            } catch (err) {
                return new Date().toISOString().substring(0, 10);
            }
        }
    }

    let isUpdatingStudioCrmHeader = false;
    function updateStudioCrmDashboardHeader() {
        if (isUpdatingStudioCrmHeader) return;
        isUpdatingStudioCrmHeader = true;
        try {
            const formattedDate = getLocalizedFormattedDate();
            const dashboardText = `Dashboard - ${formattedDate}`;

            // Top Header Subtitle on left
            const topSubtitle = document.getElementById('studio-mode-subtitle');
            if (topSubtitle && topSubtitle.textContent !== dashboardText) {
                topSubtitle.textContent = dashboardText;
            }

            // Vue Sidebar Logo subtitle
            const sidebarLogos = document.querySelectorAll('.sidebar .logo');
            sidebarLogos.forEach(logo => {
                let sub = logo.querySelector('.sidebar-dashboard-date-subtitle');
                if (!sub) {
                    sub = document.createElement('div');
                    sub.className = 'sidebar-dashboard-date-subtitle';
                    sub.style.cssText = 'font-size:0.75rem; color:#94A3B8; font-weight:600; margin-top:4px; letter-spacing:0.01em;';
                    logo.appendChild(sub);
                }
                if (sub.textContent !== dashboardText) {
                    sub.textContent = dashboardText;
                }
            });
        } catch (e) {
            console.error('Error updating studio header:', e);
        } finally {
            isUpdatingStudioCrmHeader = false;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateStudioCrmDashboardHeader();
        setInterval(updateStudioCrmDashboardHeader, 10000);
    });

    let chartDateRangeFilters = []; // Array of { id, startMs, endMs, label }
    let chartMultiRangeMode = false;

    function toggleMultiRangeMode() {
        chartMultiRangeMode = !chartMultiRangeMode;
        const btn = document.getElementById('chart-multi-range-btn');
        if (btn) {
            btn.innerHTML = chartMultiRangeMode 
                ? '☑️ Multi-Range Mode (+Shift)' 
                : '🔲 Single Range Mode';
            btn.style.background = chartMultiRangeMode ? 'rgba(139, 92, 246, 0.35)' : 'rgba(139, 92, 246, 0.15)';
            btn.style.borderColor = chartMultiRangeMode ? '#A78BFA' : 'rgba(139, 92, 246, 0.35)';
        }
    }

    function removeChartDateFilter(id) {
        chartDateRangeFilters = chartDateRangeFilters.filter(r => r.id !== id);
        updateChartFilterPillsUI();
        renderD3ActivityChart();
        renderActivityFeed();
    }

    function clearChartDateFilter() {
        chartDateRangeFilters = [];
        updateChartFilterPillsUI();
        renderD3ActivityChart();
        renderActivityFeed();
    }

    function updateChartFilterPillsUI() {
        const container = document.getElementById('chart-date-filter-pill-container');
        if (!container) return;

        if (!chartDateRangeFilters || chartDateRangeFilters.length === 0) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'inline-flex';
        let html = '';
        chartDateRangeFilters.forEach(r => {
            html += `
                <div style="font-size:0.75rem;color:#FBBF24;font-weight:700;background:rgba(245, 158, 11, 0.18);padding:3px 9px;border-radius:16px;border:1px solid rgba(245, 158, 11, 0.4);display:inline-flex;align-items:center;gap:5px;">
                    <span>📅 ${escapeHtml(r.label)}</span>
                    <button onclick="removeChartDateFilter('${r.id}')" style="background:none;border:none;color:#FBBF24;cursor:pointer;font-weight:bold;padding:0 2px;font-size:0.9rem;line-height:1;" title="Remove this date range">&times;</button>
                </div>
            `;
        });

        if (chartDateRangeFilters.length > 1) {
            html += `
                <button onclick="clearChartDateFilter()" style="font-size:0.75rem;color:#EF4444;background:rgba(239, 68, 68, 0.15);padding:3px 8px;border-radius:12px;border:1px solid rgba(239, 68, 68, 0.3);cursor:pointer;font-weight:700;" title="Clear all selected date ranges">
                    Clear All (${chartDateRangeFilters.length})
                </button>
            `;
        }

        container.innerHTML = html;
    }

    function getFilteredActivities() {
        const searchQuery = (document.getElementById('feed-search-input')?.value || '').toLowerCase().trim();
        const staffFilter = (document.getElementById('feed-staff-select')?.value || 'all').toLowerCase().trim();
        const pendingQueue = typeof getPendingQueue === 'function' ? getPendingQueue() : [];
        const combined = [...pendingQueue, ...allActivities.filter(a => !pendingQueue.some(p => p.id === a.id))];

        return combined.filter(a => {
            const matchCat = currentCategoryFilter === 'all' || a.category === currentCategoryFilter;

            let matchStaff = true;
            if (staffFilter !== 'all') {
                const userVal = (a.user || '').toLowerCase();
                const titleVal = (a.title || '').toLowerCase();
                const detailsVal = (a.details || '').toLowerCase();
                matchStaff = userVal.includes(staffFilter) || titleVal.includes(staffFilter) || detailsVal.includes(staffFilter);
            }

            const matchQuery = !searchQuery || 
                (a.title && a.title.toLowerCase().includes(searchQuery)) ||
                (a.details && a.details.toLowerCase().includes(searchQuery)) ||
                (a.action && a.action.toLowerCase().includes(searchQuery)) ||
                (a.user && a.user.toLowerCase().includes(searchQuery));

            let matchDate = true;
            if (chartDateRangeFilters && chartDateRangeFilters.length > 0) {
                const t = new Date(a.timestamp).getTime();
                if (!isNaN(t)) {
                    matchDate = chartDateRangeFilters.some(r => t >= r.startMs && t <= r.endMs);
                }
            }

            return matchCat && matchStaff && matchQuery && matchDate;
        });
    }

    function openExportModal() {
        const catSelect = document.getElementById('export-category-select');
        if (catSelect) catSelect.value = currentCategoryFilter || 'all';
        const modal = document.getElementById('export-csv-modal');
        if (modal) {
            modal.style.display = 'flex';
            toggleCustomDateInputs();
            updateExportPreviewCount();
            loadScheduledReports();
            updateExportColumnLegend();
        }
    }

    