// Community Feedback Form Handler
// Opens the visitor's email app with the message ready to send. There is no
// /api/feedback on the website or in Studio CRM, so posting there always failed.

document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const successMsg = document.getElementById('feedbackSuccess');
    const errorMsg = document.getElementById('feedbackError');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('userRole');
            const body = document.getElementById('feedbackText').value
                + '\n\n' + (role.options[role.selectedIndex] || {}).text
                + '\n' + document.getElementById('userEmail').value
                + '\n' + document.title;
            errorMsg.style.display = 'none';
            window.location.href = 'mailto:patrick@poli-international.com'
                + '?subject=' + encodeURIComponent('Feedback: ' + document.title)
                + '&body=' + encodeURIComponent(body);
            successMsg.style.display = 'block';
        });
    }
});
