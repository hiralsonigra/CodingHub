document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initQuiz();
    initNavHighlight();
    initBackToTop();
    initContactForm();
    initSearchFilters();
});

/* 1. MOBILE MENU HAMBURGER TOGGLE */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navList = document.querySelector('nav ul');

    if (!mobileMenuBtn || !navList) return;

    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });
}

/* 2. QUIZ GAME WITH LOCALSTORAGE HIGH-SCORE */
const quizData = [
    { question: "Which language is used to structure content on the web?", options: ["CSS", "HTML", "Python", "SQL"], answer: 1, explanation: "HTML (HyperText Markup Language) defines the structure of web pages." },
    { question: "Which of these is used to style a webpage?", options: ["JavaScript", "HTML", "CSS", "Java"], answer: 2, explanation: "CSS (Cascading Style Sheets) controls layout, colors, and design." },
    { question: "Which language adds interactivity to a website?", options: ["JavaScript", "HTML", "CSS", "SQL"], answer: 0, explanation: "JavaScript makes web pages interactive and dynamic." },
    { question: "Which language is widely used for AI and Data Science?", options: ["C", "Python", "HTML", "CSS"], answer: 1, explanation: "Python's simplicity and libraries make it the top choice for AI/ML." },
    { question: "What does SQL primarily manage?", options: ["Animations", "Databases", "Layouts", "Fonts"], answer: 1, explanation: "SQL (Structured Query Language) is used to manage and query databases." },
    { question: "Which platform hosts code and enables collaboration via Git?", options: ["Canva", "Notion", "GitHub", "ChatGPT"], answer: 2, explanation: "GitHub is a hosting platform for Git repositories and collaboration." },
    { question: "Which of these is a JavaScript framework/library for building UI?", options: ["React", "Django", "Flask", "Laravel"], answer: 0, explanation: "React is a popular JavaScript library for building user interfaces." }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function initQuiz() {
    const container = document.getElementById('qa-container');
    if (!container) return;
    updateHighScoreDisplay();
    renderQuestion();
    document.getElementById('quiz-next-btn').addEventListener('click', nextQuestion);
    document.getElementById('quiz-restart-btn').addEventListener('click', restartQuiz);
}

function getHighScore() {
    return localStorage.getItem('codingHub_highscore') || 0;
}

function updateHighScoreDisplay() {
    const hsElement = document.getElementById('quiz-highscore-value');
    if (hsElement) {
        hsElement.textContent = getHighScore();
    }
}

function renderQuestion() {
    const container = document.getElementById('qa-container');
    const total = quizData.length;
    const q = quizData[currentQuestion];
    answered = false;

    document.getElementById('quiz-progress-fill').style.width = `${(currentQuestion / total) * 100}%`;
    document.getElementById('quiz-progress-current').textContent = currentQuestion + 1;
    document.getElementById('quiz-progress-total').textContent = total;
    document.getElementById('quiz-score-value').textContent = score;
    updateHighScoreDisplay();

    container.innerHTML = `
        <div class="qa-card">
            <h3>❓ Q${currentQuestion + 1}. ${q.question}</h3>
            <div class="qa-options" id="qa-options"></div>
            <div class="answer-box" id="answer-box">
                <span class="ans-tag">Explanation:</span> ${q.explanation}
            </div>
        </div>
    `;

    const optionsWrap = document.getElementById('qa-options');
    q.options.forEach((optionText, index) => {
        const btn = document.createElement('button');
        btn.className = 'qa-option';
        btn.type = 'button';
        btn.textContent = optionText;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsWrap.appendChild(btn);
    });

    document.getElementById('quiz-next-btn').disabled = true;
    document.getElementById('quiz-result').classList.remove('show');
    document.getElementById('quiz-body').style.display = 'block';
}

function selectAnswer(selectedIndex) {
    if (answered) return;
    answered = true;

    const q = quizData[currentQuestion];
    const optionButtons = document.querySelectorAll('.qa-option');

    optionButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === q.answer) btn.classList.add('correct');
        else if (index === selectedIndex) btn.classList.add('wrong');
    });

    if (selectedIndex === q.answer) {
        score++;
        document.getElementById('quiz-score-value').textContent = score;
    }

    document.getElementById('answer-box').classList.add('show');
    document.getElementById('quiz-next-btn').disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) renderQuestion();
    else showResult();
}

function showResult() {
    const total = quizData.length;
    document.getElementById('quiz-progress-fill').style.width = '100%';
    document.getElementById('quiz-body').style.display = 'none';

    // Check & save highscore in localStorage
    let currentHighScore = parseInt(getHighScore());
    if (score > currentHighScore) {
        localStorage.setItem('codingHub_highscore', score);
        currentHighScore = score;
    }

    const resultBox = document.getElementById('quiz-result');
    const percent = Math.round((score / total) * 100);
    let message = "Keep practicing, you'll get there! 💪";
    if (percent >= 80) message = "Excellent work! You know your stuff! 🚀";
    else if (percent >= 50) message = "Good job! A little more practice will help. 👍";

    resultBox.innerHTML = `
        <h3>Quiz Complete!</h3>
        <div class="result-score">${score} / ${total}</div>
        <p>${message}</p>
        <p style="color: var(--success-light); font-weight: bold; margin-bottom: 15px;">👑 Best Score Saved: ${currentHighScore} / ${total}</p>
        <button class="quiz-btn" id="quiz-restart-btn2" type="button">🔁 Try Again</button>
    `;
    resultBox.classList.add('show');
    document.getElementById('quiz-restart-btn2').addEventListener('click', restartQuiz);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-body').style.display = 'block';
    renderQuestion();
}

/* 3. DYNAMIC SEARCH / FILTER IN AI TOOLS & RESOURCES WITH DIRECT OPEN */
function initSearchFilters() {
    const aiSearchInput = document.getElementById('ai-search');
    const aiCards = document.querySelectorAll('.ai-card');

    // Official Links mapping for AI tools
    const aiLinks = {
        "chatgpt": "https://chatgpt.com",
        "gemini": "https://gemini.google.com",
        "claude": "https://claude.ai",
        "github copilot": "https://github.com/features/copilot",
        "canva ai": "https://www.canva.com",
        "notion ai": "https://www.notion.so/product/ai"
    };

    if (aiSearchInput) {
        aiSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            aiCards.forEach(card => {
                const name = card.getAttribute('data-name');
                const text = card.textContent.toLowerCase();
                if (name.includes(query) || text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // Show direct open button banner if matched
            showQuickOpenBanner(query, aiLinks);
        });
    }

    // Resources Filter
    const resourceSearchInput = document.getElementById('resource-search');
    const resourceCards = document.querySelectorAll('.resource-card');

