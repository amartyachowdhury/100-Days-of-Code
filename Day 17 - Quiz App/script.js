const state = {
    questions: [],
    questionNumber: 0,
    score: 0,
    waitingForNext: false,
};

function buildQuestionBank() {
    return questionData.map((item) => ({
        text: item.text,
        answer: item.answer,
    }));
}

function stillHasQuestions() {
    return state.questionNumber < state.questions.length;
}

function showQuestion() {
    const current = state.questions[state.questionNumber];
    document.getElementById("progress").textContent =
        `Question ${state.questionNumber + 1} of ${state.questions.length}`;
    document.getElementById("score").textContent = `Score: ${state.score}`;
    document.getElementById("question").textContent = current.text;
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "feedback";
    state.waitingForNext = false;
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
    const feedback = document.getElementById("feedback");

    state.questionNumber += 1;

    if (isCorrect) {
        state.score += 1;
        feedback.textContent = "You got it right!";
        feedback.className = "feedback correct";
    } else {
        feedback.textContent = "That's wrong.";
        feedback.className = "feedback wrong";
    }

    feedback.textContent += ` The correct answer was: ${current.answer}.`;
    document.getElementById("score").textContent =
        `Score: ${state.score}/${state.questionNumber}`;

    state.waitingForNext = true;

    if (stillHasQuestions()) {
        setTimeout(() => {
            showQuestion();
        }, 1500);
    } else {
        setTimeout(() => {
            endQuiz();
        }, 1500);
    }
}

function endQuiz() {
    document.getElementById("quiz").hidden = true;
    document.getElementById("result").hidden = false;
    document.getElementById("finalScore").textContent =
        `Your final score was: ${state.score}/${state.questions.length}`;
}

function startQuiz() {
    state.questions = buildQuestionBank();
    state.questionNumber = 0;
    state.score = 0;
    state.waitingForNext = false;

    document.getElementById("quiz").hidden = false;
    document.getElementById("result").hidden = true;
    showQuestion();
}

startQuiz();
