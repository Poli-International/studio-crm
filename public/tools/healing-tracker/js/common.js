(function() {
    function safeGetItem(key, fallback) {
        try {
            return window.localStorage ? (window.localStorage.getItem(key) || fallback) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function safeSetItem(key, value) {
        try {
            if (window.localStorage) window.localStorage.setItem(key, value);
        } catch (e) {
            // Storage access blocked or restricted
        }
    }

    function initCommon() {
        // ==========================================
        // THEME LOGIC (Dark/Light Mode)
        // ==========================================
        const themeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        if (!body) return;

        const pathname = (window.location && window.location.pathname) ? window.location.pathname : '';
        const toolName = pathname.split('/').filter(Boolean).pop() || 'poli-tool';

        function setTheme(theme, save = true) {
            document.documentElement.setAttribute('data-theme', theme);
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
            if (save) safeSetItem('theme', theme);
        }

        // Init theme
        const savedTheme = safeGetItem('theme', 'dark');
        setTheme(savedTheme, false);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = body.classList.contains('light-mode') ? 'dark' : 'light';
                setTheme(current);
            });
        }

        // Listen for messages from WordPress wrapper
        window.addEventListener('message', function(event) {
            if (event.data && event.data.theme) {
                setTheme(event.data.theme, true);
            }
        });

        // ==========================================
        // AUTO-RESIZE PARENT IFRAME
        // ==========================================
        function sendHeight() {
            try {
                if (window.parent && window.parent !== window && document.body) {
                    const height = document.body.scrollHeight + 50; // Buffer
                    window.parent.postMessage({ height: height }, '*');
                }
            } catch (e) {
                // Cross-origin restriction
            }
        }

        // Send height on load and on any interaction
        sendHeight();
        window.addEventListener('resize', sendHeight);
        document.addEventListener('click', () => setTimeout(sendHeight, 100));
        document.addEventListener('change', () => setTimeout(sendHeight, 100));
        
        // Mutation observer to catch dynamic content changes
        try {
            const observer = new MutationObserver(sendHeight);
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (e) {}

        // ==========================================
        // EMBED MODAL LOGIC
        // ==========================================
        const embedBtn = document.getElementById('embedBtn') || document.getElementById('embed-button');
        const modal = document.getElementById('embedModal') || document.getElementById('embed-modal');
        const modalClose = document.getElementById('modalClose') || document.querySelector('.modal-close');
        const copyBtn = document.getElementById('copyEmbedCode');
        const textarea = document.getElementById('embedCode');

        if (textarea) {
            const href = (window.location && window.location.href) ? window.location.href : '';
            const cleanUrl = href.split('?')[0].split('#')[0];
            textarea.value = `<iframe src="${cleanUrl}" width="100%" height="800" frameborder="0" style="border:0; border-radius:12px;"></iframe>`;
        }

        if (embedBtn && modal) {
            embedBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
                body.style.overflow = 'hidden';
            });

            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    modal.style.display = 'none';
                    body.style.overflow = '';
                });
            }

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
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
                        copyBtn.innerHTML = (window.t ? window.t('common.copied') : 'Copied');
                        setTimeout(() => copyBtn.innerHTML = originalText, 2000);
                    }).catch(() => {
                        document.execCommand('copy');
                    });
                } else {
                    document.execCommand('copy');
                }
            });
        }

        // ==========================================
        // EMAIL FORM SIMULATION
        // ==========================================
        const emailForms = document.querySelectorAll('.email-form');
        emailForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('input');
                const btn = form.querySelector('button');
                if (!btn) return;
                const originalText = btn.textContent;
                
                btn.textContent = (window.t ? window.t('common.subscribed') : 'Subscribed');
                btn.disabled = true;
                if (input) input.value = '';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCommon);
    } else {
        initCommon();
    }
})();
