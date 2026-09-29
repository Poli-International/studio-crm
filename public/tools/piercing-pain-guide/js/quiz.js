// ═══════════════════════════════════════════════════════════════
// QUIZ.JS - Procedural Pain Tolerance & Sensitivity Assessment (V2)
// 7 questions, honest arithmetic, personalized studio preparation advice.
// All inputs start completely empty. No fake statistics.
// ═══════════════════════════════════════════════════════════════

(function() {
    let lastAnswers = null;

    document.addEventListener('DOMContentLoaded', function() {
        const quizForm = document.getElementById('quizForm');
        const resetBtn = document.getElementById('resetQuizBtn');

        if (quizForm) {
            quizForm.addEventListener('submit', handleQuizSubmit);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', resetQuiz);
        }

        window.addEventListener('languageChanged', function() {
            if (lastAnswers) {
                renderQuizResults(lastAnswers);
            }
        });
    });

    function handleQuizSubmit(e) {
        e.preventDefault();

        const errorEl = document.getElementById('quizValidationError');
        const resultContainer = document.getElementById('quizResults');
        if (errorEl) errorEl.hidden = true;

        const answers = {};
        const missing = [];

        for (let i = 1; i <= 7; i++) {
            const checked = document.querySelector(`input[name="q${i}"]:checked`);
            if (!checked) {
                missing.push(i);
            } else {
                answers[`q${i}`] = parseInt(checked.value, 10);
            }
        }

        if (missing.length > 0) {
            if (errorEl) {
                const t = window.t || (k => k);
                errorEl.textContent = t('quiz.validation_missing', { questions: missing.join(', ') }) 
                    || `Please answer question(s) ${missing.join(', ')} before calculating your score.`;
                errorEl.hidden = false;
                errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        lastAnswers = answers;
        renderQuizResults(answers);
    }

    function renderQuizResults(answers) {
        const t = window.t || (k => k);
        const resultContainer = document.getElementById('quizResults');
        if (!resultContainer) return;

        // Calculate exact arithmetic
        const q1 = answers.q1 || 0;
        const q2 = answers.q2 || 0;
        const q3 = answers.q3 || 0;
        const q4 = answers.q4 || 0;
        const q5 = answers.q5 || 0;
        const q6 = answers.q6 || 0;
        const q7 = answers.q7 || 0;
        const total = q1 + q2 + q3 + q4 + q5 + q6 + q7;

        let tierTitle = '';
        let tierAdvice = '';
        let tierClass = '';

        if (total <= 11) {
            tierTitle = t('quiz.low_tier');
            tierAdvice = t('quiz.low_advice');
            tierClass = 'quiz-result--low';
        } else if (total <= 16) {
            tierTitle = t('quiz.med_tier');
            tierAdvice = t('quiz.med_advice');
            tierClass = 'quiz-result--med';
        } else {
            tierTitle = t('quiz.high_tier');
            tierAdvice = t('quiz.high_advice');
            tierClass = 'quiz-result--high';
        }

        resultContainer.innerHTML = `
            <div class="quiz-result-card ${tierClass}">
                <div class="quiz-result-header">
                    <span class="quiz-score-badge">${t('quiz.result_score', { score: total })}</span>
                    <h3 class="quiz-result-title">${tierTitle}</h3>
                </div>
                <div class="quiz-arithmetic-box">
                    <strong>${t('quiz.arithmetic_explanation')}</strong>
                    <p class="quiz-arithmetic-formula">
                        Q1(${q1}) + Q2(${q2}) + Q3(${q3}) + Q4(${q4}) + Q5(${q5}) + Q6(${q6}) + Q7(${q7}) = <strong>${total} / 21</strong>
                    </p>
                </div>
                <div class="quiz-result-body">
                    <p class="quiz-advice-text">${tierAdvice}</p>
                </div>
                <div class="quiz-result-actions">
                    <button type="button" id="copyToPrepSheetBtn" class="btn-action">
                        ${t('quiz.transfer_btn')}
                    </button>
                </div>
            </div>
        `;

        resultContainer.hidden = false;
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const transferBtn = document.getElementById('copyToPrepSheetBtn');
        if (transferBtn) {
            transferBtn.addEventListener('click', function() {
                transferToPrepSheet(total, tierTitle);
            });
        }
    }

    function transferToPrepSheet(score, tierTitle) {
        const t = window.t || (k => k);
        // Open the prep sheet section if closed
        const prepSheetSection = document.getElementById('printSheetSection');
        if (prepSheetSection && prepSheetSection.style.display === 'none') {
            prepSheetSection.style.display = 'block';
        }

        // Fill user sensitivity note
        const sensitivityField = document.getElementById('prepSensitivity');
        if (sensitivityField) {
            if (score <= 11) {
                sensitivityField.value = 'high_anxiety';
            } else if (score <= 16) {
                sensitivityField.value = 'moderate_anxiety';
            } else {
                sensitivityField.value = 'low_anxiety';
            }
        }

        const notesField = document.getElementById('prepNotes');
        if (notesField) {
            const currentNotes = notesField.value.trim();
            const quizNote = t('quiz.prep_sheet_note', { score, tier: tierTitle });
            if (!currentNotes.includes('Tolerance Assessment Score') && !currentNotes.includes(quizNote)) {
                notesField.value = currentNotes ? `${currentNotes}\n${quizNote}` : quizNote;
            }
        }

        if (prepSheetSection) {
            prepSheetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function resetQuiz() {
        const quizForm = document.getElementById('quizForm');
        const resultContainer = document.getElementById('quizResults');
        const errorEl = document.getElementById('quizValidationError');

        if (quizForm) quizForm.reset();
        if (resultContainer) {
            resultContainer.innerHTML = '';
            resultContainer.hidden = true;
        }
        if (errorEl) errorEl.hidden = true;
        lastAnswers = null;
    }
})();
