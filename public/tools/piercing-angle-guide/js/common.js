document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // THEME LOGIC (Dark/Light Mode)
    // ==========================================
    const themeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function setTheme(theme, save = true) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.dark-mode-icon') || themeToggle;
                icon.textContent = '☀️';
            }
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.dark-mode-icon') || themeToggle;
                icon.textContent = '◐';
            }
        }
        if (save) {
            try {
                localStorage.setItem('theme', theme);
            } catch (e) {
                // Ignore storage errors in restricted contexts
            }
        }
    }

    // Init theme
    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('theme') || 'dark';
    } catch (e) {
        savedTheme = 'dark';
    }
    setTheme(savedTheme, false);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = body.classList.contains('light-mode') ? 'dark' : 'light';
            setTheme(current);
        });
    }

    // Listen for messages from parent wrapper
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'poli-theme') {
            setTheme(event.data.light ? 'light' : 'dark', false);
        } else if (event.data && event.data.theme) {
            setTheme(event.data.theme, true);
        }
    });

    // ==========================================
    // AUTO-RESIZE PARENT IFRAME
    // ==========================================
    function sendHeight() {
        const height = document.body.scrollHeight + 50;
        try {
            window.parent.postMessage({ height: height }, '*');
        } catch (e) {
            // Ignore cross-origin issues
        }
    }

    sendHeight();
    window.addEventListener('resize', sendHeight);
    document.addEventListener('click', () => setTimeout(sendHeight, 100));
    document.addEventListener('change', () => setTimeout(sendHeight, 100));

    const observer = new MutationObserver(sendHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    // ==========================================
    // EMBED MODAL LOGIC
    // ==========================================
    const embedBtn = document.getElementById('embedBtn') || document.getElementById('embed-button');
    const modal = document.getElementById('embedModal') || document.getElementById('embed-modal');
    const modalClose = document.getElementById('modalClose') || document.querySelector('.modal-close');
    const copyBtn = document.getElementById('copyEmbedCode');
    const textarea = document.getElementById('embedCode');

    if (textarea) {
        const cleanUrl = window.location.href.split('?')[0].split('#')[0];
        textarea.value = `<iframe src="${cleanUrl}?embed=true" width="100%" height="800" frameborder="0" class="poli-embed-frame"></iframe>`;
    }

    if (embedBtn && modal) {
        embedBtn.addEventListener('click', () => {
            modal.removeAttribute('hidden');
            modal.style.display = 'flex';
            body.style.overflow = 'hidden';
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.setAttribute('hidden', 'true');
                modal.style.display = 'none';
                body.style.overflow = '';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.setAttribute('hidden', 'true');
                modal.style.display = 'none';
                body.style.overflow = '';
            }
        });
    }

    if (copyBtn && textarea) {
        copyBtn.addEventListener('click', () => {
            textarea.select();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textarea.value).then(() => {
                    const originalText = copyBtn.innerHTML;
                    const copiedMsg = window.translate ? window.translate('common.copied', null, '✅ Copied!') : '✅ Copied!';
                    copyBtn.innerHTML = copiedMsg;
                    setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
                }).catch(() => {
                    document.execCommand('copy');
                    const originalText = copyBtn.innerHTML;
                    const copiedMsg = window.translate ? window.translate('common.copied', null, '✅ Copied!') : '✅ Copied!';
                    copyBtn.innerHTML = copiedMsg;
                    setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
                });
            } else {
                document.execCommand('copy');
                const originalText = copyBtn.innerHTML;
                const copiedMsg = window.translate ? window.translate('common.copied', null, '✅ Copied!') : '✅ Copied!';
                copyBtn.innerHTML = copiedMsg;
                setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
            }
        });
    }

});
