const API_URL = "https://opentdb.com/api.php";
const FEEDBACK_DELAY_MS = 1000;

const state = {
    questions: [],
    questionNumber: 0,
    score: 0,
    waitingForNext: false,
};

function decodeHtml(html) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}

function showPanel(panelId) {
    ["loading", "quiz", "result", "error"].forEach((id) => {
        document.getElementById(id).hidden = id !== panelId;
    });
}

function setButtonsEnabled(enabled) {
    document.querySelectorAll(".icon-button").forEach((button) => {
        button.disabled = !enabled;
    });
}

async function fetchQuestions() {
    const response = await fetch(`${API_URL}?amount=10&type=boolean`);
    if (!response.ok) {
        throw new Error("Could not load trivia questions.");
    }

    const data = await response.json();
    if (data.response_code !== 0) {
        throw new Error("The trivia API returned no questions.");
    }

    return data.results.map((item) => ({
        text: decodeHtml(item.question),
        answer: item.correct_answer,
    }));
}

function stillHasQuestions() {
    return state.questionNumber < state.questions.length;
}

function showQuestion() {
    const current = state.questions[state.questionNumber];
    const card = document.getElementById("questionCard");

    document.getElementById("progress").textContent =
        `Question ${state.questionNumber + 1} of ${state.questions.length}`;
    document.getElementById("score").textContent = `Score: ${state.score}`;
    document.getElementById("question").textContent =
        `Q.${state.questionNumber + 1}: ${current.text}`;

    card.className = "question-card";
    state.waitingForNext = false;
    setButtonsEnabled(true);
}

function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
}

function submitAnswer(userAnswer) {
    if (!stillHasQuestions() || state.waitingForNext) {
        return;
    }

    const current = state.questions[state.questionNumber];
    const isCorrect = checkAnswer(userAnswer, current.answer);
    const card = document.getElementById("questionCard");

    state.questionNumber += 1;
    state.waitingForNext = true;
    setButtonsEnabled(false);

    if (isCorrect) {
        state.score += 1;
        card.className = "question-card correct";
    } else {
        card.className = "question-card wrong";
    }

    document.getElementById("score").textContent = `Score: ${state.score}`;

    setTimeout(() => {
        if (stillHasQuestions()) {
            showQuestion();
        } else {
            endQuiz();
        }
    }, FEEDBACK_DELAY_MS);
}

function endQuiz() {
    document.getElementById("finalScore").textContent =
        `Your final score was: ${state.score}/${state.questions.length}`;
    showPanel("result");
}

function showError(message) {
    document.getElementById("errorMessage").textContent = message;
    showPanel("error");
}

async function startQuiz() {
    state.questionNumber = 0;
    state.score = 0;
    state.waitingForNext = false;
    showPanel("loading");

    try {
        state.questions = await fetchQuestions();
        showPanel("quiz");
        showQuestion();
    } catch (error) {
        showError(error.message || "Something went wrong while loading the quiz.");
    }
}

startQuiz();
