// ================= AI TOOLS SEARCH FILTER =================
const aiSearchInput = document.getElementById('ai-search');
const aiCards = document.querySelectorAll('#ai-container .ai-card');
const aiNoResults = document.getElementById('ai-no-results');

if (aiSearchInput) {
    aiSearchInput.addEventListener('input', () => {
        const query = aiSearchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        aiCards.forEach(card => {
            const name = card.dataset.name || '';
            const match = name.includes(query);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        if (aiNoResults) {
            aiNoResults.hidden = visibleCount !== 0;
        }
    });
}

// ================= RESOURCES SEARCH FILTER =================
const resourceSearchInput = document.getElementById('resource-search');
const resourceCards = document.querySelectorAll('#resource-container .resource-card');
const resourceNoResults = document.getElementById('resource-no-results');

if (resourceSearchInput) {
    resourceSearchInput.addEventListener('input', () => {
        const query = resourceSearchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        resourceCards.forEach(card => {
            const name = card.dataset.name || '';
            const match = name.includes(query);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        if (resourceNoResults) {
            resourceNoResults.hidden = visibleCount !== 0;
        }
    });
}

// ================= QUIZ GAME =================
const quizQuestions = [
    {
        question: "❓ What does HTML stand for?",
        options: [
            "Hyper Trainer Marking Language",
            "Hyper Text Markup Language",
            "Hyper Text Marketing Language",
            "High Text Markup Language"
        ],
        answer: 1
    },
    {
        question: "❓ Which language is used to style web pages?",
        options: ["HTML", "JQuery", "CSS", "XML"],
        answer: 2
    },
    {
        question: "❓ Which language is mainly used for adding interactivity to websites?",
        options: ["Python", "JavaScript", "SQL", "C++"],
        answer: 1
    },
    {
        question: "❓ Which of these is used to manage databases?",
        options: ["HTML", "SQL", "CSS", "FTP"],
        answer: 1
    },
    {
        question: "❓ Which company developed the Python programming language?",
        options: ["Microsoft", "Google", "Python Software Foundation", "Apple"],
        answer: 2
    },
    {
        question: "❓ What is Git mainly used for?",
        options: [
            "Designing websites",
            "Version control and collaboration",
            "Database management",
            "Running servers"
        ],
        answer: 1
    },
    {
        question: "❓ Which of these is a popular JavaScript library/framework for building UIs?",
        options: ["Django", "React", "Laravel", "Flask"],
        answer: 1
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const qaContainer = document.getElementById('qa-container');
const progressCurrent = document.getElementById('quiz-progress-current');
const progressTotal = document.getElementById('quiz-progress-total');
const progressFill = document.getElementById('quiz-progress-fill');
const scoreValue = document.getElementById('quiz-score-value');
const nextBtn = document.getElementById('quiz-next-btn');
const restartBtn = document.getElementById('quiz-restart-btn');
const quizResult = document.getElementById('quiz-result');
const quizBody = document.getElementById('quiz-body');

function renderQuestion() {
    if (!qaContainer) return;

    answered = false;
    nextBtn.disabled = true;
    quizResult.textContent = '';

    const q = quizQuestions[currentQuestion];

    progressCurrent.textContent = currentQuestion + 1;
    progressTotal.textContent = quizQuestions.length;
    progressFill.style.width = `${(currentQuestion / quizQuestions.length) * 100}%`;
    scoreValue.textContent = score;

    nextBtn.textContent = currentQuestion === quizQuestions.length - 1 ? 'Finish 🏁' : 'Next ➜';

    qaContainer.innerHTML = `
        <div class="qa-card">
            <h3>${q.question}</h3>
            <div class="qa-options">
                ${q.options.map((opt, i) => `
                    <button type="button" class="qa-option" data-index="${i}">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;

    qaContainer.querySelectorAll('.qa-option').forEach(btn => {
        btn.addEventListener('click', handleAnswer);
    });
}

function handleAnswer(e) {
    if (answered) return;
    answered = true;

    const selectedIndex = parseInt(e.currentTarget.dataset.index, 10);
    const q = quizQuestions[currentQuestion];
    const options = qaContainer.querySelectorAll('.qa-option');

    options.forEach(btn => (btn.disabled = true));

    if (selectedIndex === q.answer) {
        score++;
        e.currentTarget.classList.add('correct');
    } else {
        e.currentTarget.classList.add('wrong');
        options[q.answer].classList.add('correct');
    }

    scoreValue.textContent = score;
    nextBtn.disabled = false;
}

function nextQuestion() {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion >= quizQuestions.length) {
        showResult();
        return;
    }

    renderQuestion();
}

function showResult() {
    progressFill.style.width = '100%';
    progressCurrent.textContent = quizQuestions.length;

    quizBody.style.display = 'none';

    const percent = Math.round((score / quizQuestions.length) * 100);
    let message = '';
    if (percent === 100) {
        message = "🏆 Perfect score! You're a coding champ!";
    } else if (percent >= 70) {
        message = "🎉 Great job! You really know your stuff.";
    } else if (percent >= 40) {
        message = "👍 Not bad! A little more practice and you'll ace it.";
    } else {
        message = "📘 Keep learning — check out our Resources section!";
    }

    quizResult.innerHTML = `You scored ${score} / ${quizQuestions.length} (${percent}%)<br>${message}`;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    quizBody.style.display = '';
    quizResult.textContent = '';
    renderQuestion();
}

if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
if (qaContainer) renderQuestion();

// ================= BACK TO TOP BUTTON =================
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

// ================= CONTACT FORM (front-end only) =================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formStatus.textContent = "✅ Thanks! Your message has been noted (demo form — no backend connected).";
        contactForm.reset();

        setTimeout(() => {
            formStatus.textContent = '';
        }, 5000);
    });
}
