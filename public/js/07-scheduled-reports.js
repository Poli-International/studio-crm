// SCHEDULED RECURRING REPORTS LOGIC
    let scheduledReports = [];

    function loadScheduledReports() {
        try {
            const saved = localStorage.getItem('studio_scheduled_reports');
            if (saved) {
                scheduledReports = JSON.parse(saved);
            } else {
                scheduledReports = [
                    {
                        id: 'sched-1',
                        freq: 'daily',
                        day: 'Daily',
                        time: '08:00',
                        email: '',
                        category: 'all',
                        range: '24h',
                        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
                    }
                ];
                saveScheduledReports();
            }
        } catch(e) {
            scheduledReports = [];
        }
        renderScheduledReports();
    }

    function saveScheduledReports() {
        try {
            localStorage.setItem('studio_scheduled_reports', JSON.stringify(scheduledReports));
        } catch(e) {}
    }

    function toggleScheduleFields() {
        const cb = document.getElementById('export-schedule-enable');
        const fields = document.getElementById('export-schedule-fields');
        if (cb && fields) {
            fields.style.display = cb.checked ? 'flex' : 'none';
        }
    }

    function toggleScheduleDaySelect() {
        const freq = document.getElementById('export-schedule-freq')?.value;
        const dayContainer = document.getElementById('export-schedule-day-container');
        if (dayContainer) {
            dayContainer.style.display = freq === 'weekly' ? 'block' : 'none';
        }
    }

    function saveScheduledReport() {
        const freq = document.getElementById('export-schedule-freq')?.value || 'daily';
        const day = freq === 'weekly' ? (document.getElementById('export-schedule-day')?.value || 'Monday') : 'Daily';
        const time = document.getElementById('export-schedule-time')?.value || '08:00';
        const email = document.getElementById('export-schedule-email')?.value?.trim();
        const category = document.getElementById('export-category-select')?.value || 'all';
        const range = document.getElementById('export-range-select')?.value || 'all';

        if (!email || !email.includes("@")) {
            alert("Please enter a valid recipient email address.");
            return;
        }
        const reports = loadScheduledReports();
        reports.push({ id: Date.now(), email, freq, day, time, category, range, created: new Date().toISOString() });
        saveScheduledReports(reports);
        if (typeof showToastNotification === "function") {
            showToastNotification("Scheduled export report saved successfully.");
        } else {
            alert("Scheduled export report saved successfully.");
        }
    }



