if (window.self !== window.top) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-mode');
    window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'poli-theme') {
            if (e.data.light) {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
    });
}



    // =========================================================================
    
    // (Modal launchers & delegation consolidated at end of document)

    