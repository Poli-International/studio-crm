// Community Feedback Form Handler
// Sends feedback to backend endpoint /api/feedback

document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const successMsg = document.getElementById('feedbackSuccess');
    const errorMsg = document.getElementById('feedbackError');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                email: document.getElementById('userEmail').value,
                role: document.getElementById('userRole').value,
                feedback: document.getElementById('feedbackText').value,
                toolName: document.title,
                toolUrl: window.location.href,
                timestamp: new Date().toString()
            };

            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            const sendingText = (window.i18n && typeof window.i18n.t === 'function') ? window.i18n.t('feedback.sending') : 'Sending...';
            submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">' + sendingText + '</span>';

            try {
                const response = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    successMsg.style.display = 'block';
                    feedbackForm.reset();
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 10000);
                } else {
                    throw new Error('Submission failed');
                }

            } catch (error) {
                console.error('Feedback submission error:', error);
                errorMsg.style.display = 'block';
                errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
