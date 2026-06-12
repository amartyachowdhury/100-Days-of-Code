const logo = `
    __  ___       __
   / / / (_)___ _/ /_  ___  _____
  / /_/ / / __ \`/ __ \\/ _ \\/ ___/
 / __  / / /_/ / / / /  __/ /
/_/ ///_/\\__, /_/ /_/\\___/_/
   / /  /____/_      _____  _____
  / /   / __ \\ | /| / / _ \\/ ___/
 / /___/ /_/ / |/ |/ /  __/ /
/_____/\\____/|__/|__\\/\\___/_/
`;

const vs = `
 _    __
| |  / /____
| | / / ___/
| |/ (__  )
|___/____(_)
`;

const state = {
    score: 0,
    accountA: null,
    accountB: null,
    gameOver: false,
};

function formatData(account) {
    return `${account.name}, a ${account.description}, from ${account.country}`;
}

function checkAnswer(guess, aFollowers, bFollowers) {
    if (aFollowers > bFollowers) {
        return guess === "a";
    }
    return guess === "b";
}

function pickRandomAccount() {
    return gameData[Math.floor(Math.random() * gameData.length)];
}

function pickAccountB(accountA) {
    let accountB = pickRandomAccount();
    while (
        accountB.name === accountA.name ||
        accountB.follower_count === accountA.follower_count
    ) {
        accountB = pickRandomAccount();
    }
    return accountB;
}

function renderRound() {
    document.getElementById("textA").textContent = formatData(state.accountA);
    document.getElementById("textB").textContent = formatData(state.accountB);
    document.getElementById("score").textContent = `Score: ${state.score}`;
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "feedback";
}

function nextRound() {
    state.accountA = state.accountB;
    state.accountB = pickAccountB(state.accountA);
    renderRound();
}

function endGame() {
    state.gameOver = true;
    const aCount = state.accountA.follower_count;
    const bCount = state.accountB.follower_count;

    document.getElementById("game").hidden = true;
    document.getElementById("result").hidden = false;
    document.getElementById("resultMessage").textContent =
        `Sorry, that's wrong. Final score: ${state.score}.`;
    document.getElementById("followerReveal").textContent =
        `${state.accountA.name} has ${aCount}M followers. ${state.accountB.name} has ${bCount}M followers.`;

    document.getElementById("accountA").disabled = true;
    document.getElementById("accountB").disabled = true;
}

function submitGuess(guess) {
    if (state.gameOver) {
        return;
    }

    const aCount = state.accountA.follower_count;
    const bCount = state.accountB.follower_count;
    const isCorrect = checkAnswer(guess, aCount, bCount);
    const feedback = document.getElementById("feedback");

    if (isCorrect) {
        state.score += 1;
        feedback.textContent = `You're right! Current score: ${state.score}`;
        feedback.className = "feedback win";
        nextRound();
        return;
    }

    endGame();
}

function startGame() {
    state.score = 0;
    state.gameOver = false;
    state.accountB = pickRandomAccount();

    document.getElementById("game").hidden = false;
    document.getElementById("result").hidden = true;
    document.getElementById("accountA").disabled = false;
    document.getElementById("accountB").disabled = false;

    nextRound();
}

document.getElementById("logo").textContent = logo;
document.getElementById("vs").textContent = vs;
startGame();
