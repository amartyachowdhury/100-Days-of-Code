const logo = `
  / _ \\_   _  ___  ___ ___  /__   \\ |__   ___    /\\ \\ \\_   _ _ __ ___ | |__   ___ _ __
 / /_\\/ | | |/ _ \\/ __/ __|   / /\\/ '_ \\ / _ \\  /  \\/ / | | | '_ \` _ \\| '_ \\ / _ \\ '__|
/ /_\\\\| |_| |  __/\\__ \\__ \\  / /  | | | |  __/ / /\\  /| |_| | | | | | | |_) |  __/ |
\\____/ \\__,_|\\___||___/___/  \\/   |_| |_|\\___| \\_\\ \\/  \\__,_|_| |_| |_|_.__/ \\___|_|
`;

const EASY_TURNS = 10;
const HARD_TURNS = 5;

const state = {
    answer: 0,
    turns: 0,
    gameOver: false,
};

function checkAnswer(guess, answer, turns) {
    if (guess > answer) {
        return { remaining: turns - 1, message: "Too high.", won: false };
    }
    if (guess < answer) {
        return { remaining: turns - 1, message: "Too low.", won: false };
    }
    return { remaining: null, message: `You got it! The answer was ${answer}`, won: true };
}

function startGame(difficulty) {
    state.answer = Math.floor(Math.random() * 100) + 1;
    state.turns = difficulty === "easy" ? EASY_TURNS : HARD_TURNS;
    state.gameOver = false;

    document.getElementById("setup").hidden = true;
    document.getElementById("game").hidden = false;
    document.getElementById("result").hidden = true;
    document.getElementById("guess").value = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("attempts").textContent =
        `You have ${state.turns} attempts remaining to guess the number.`;
    document.getElementById("guess").focus();
}

function endGame(message, isWin) {
    state.gameOver = true;
    document.getElementById("game").hidden = true;
    document.getElementById("result").hidden = false;
    const resultMessage = document.getElementById("resultMessage");
    resultMessage.textContent = message;
    resultMessage.className = isWin ? "result win" : "result lose";
}

function submitGuess() {
    if (state.gameOver) {
        return;
    }

    const guessValue = document.getElementById("guess").value;
    const guess = parseInt(guessValue, 10);
    const feedback = document.getElementById("feedback");

    if (Number.isNaN(guess) || guess < 1 || guess > 100) {
        feedback.textContent = "Please enter a whole number between 1 and 100.";
        feedback.className = "feedback error";
        return;
    }

    const outcome = checkAnswer(guess, state.answer, state.turns);

    if (outcome.won) {
        endGame(outcome.message, true);
        return;
    }

    state.turns = outcome.remaining;
    feedback.textContent = outcome.message;
    feedback.className = "feedback";

    if (state.turns === 0) {
        endGame(
            `You've run out of guesses, you lose. The answer was ${state.answer}.`,
            false
        );
        return;
    }

    document.getElementById("attempts").textContent =
        `You have ${state.turns} attempts remaining to guess the number.`;
    document.getElementById("guess").value = "";
    feedback.textContent += " Guess again.";
}

function resetGame() {
    document.getElementById("setup").hidden = false;
    document.getElementById("game").hidden = true;
    document.getElementById("result").hidden = true;
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "feedback";
}

document.getElementById("logo").textContent = logo;
