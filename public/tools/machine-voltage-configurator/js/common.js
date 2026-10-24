document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // THEME LOGIC (Dark/Light Mode)
    // ==========================================
    const themeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const toolName = window.location.pathname.split('/').filter(Boolean).pop() || 'poli-tool';

    function setTheme(theme, save = true) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.dark-mode-icon') || themeToggle;
                icon.innerHTML = '<svg class=ti-i width=1.15em height=1.15em aria-hidden=true style=vertical-align:-.18em;flex:none><use href=../shared/icons.svg#i-sun></use></svg>';
            }
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.dark-mode-icon') || themeToggle;
                icon.textContent = '◐';
            }
        }
        if (save) localStorage.setItem('theme', theme);
    }

    // Init theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
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
        const height = document.body.scrollHeight + 50; // Buffer
        window.parent.postMessage({ height: height }, '*');
    }

    // Send height on load and on any interaction
    sendHeight();
    window.addEventListener('resize', sendHeight);
    document.addEventListener('click', () => setTimeout(sendHeight, 100));
    document.addEventListener('change', () => setTimeout(sendHeight, 100));
    
    // Mutation observer to catch dynamic content changes
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
        textarea.value = `<iframe src="https://poliinternational.com/tools/machine-voltage-configurator/index.html" width="100%" height="900" frameborder="0" style="border-radius:12px;"></iframe>`;
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
            navigator.clipboard.writeText(textarea.value).then(() => {
                const originalText = copyBtn.innerHTML;
                const i18n = window.PoliI18n || { t: (k) => k };
                copyBtn.innerHTML = i18n.t('embed.copied');
                setTimeout(() => copyBtn.innerHTML = originalText, 2000);
            });
        });
    }
});
