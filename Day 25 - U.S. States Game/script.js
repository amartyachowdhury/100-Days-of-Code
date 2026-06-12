const scoreElement = document.getElementById("score");
const feedbackElement = document.getElementById("feedback");
const stateInput = document.getElementById("stateInput");
const guessForm = document.getElementById("guessForm");
const labelsElement = document.getElementById("labels");
const missingPanel = document.getElementById("missingPanel");
const missingListElement = document.getElementById("missingList");
const completePanel = document.getElementById("completePanel");

const stateLookup = new Map(STATES.map((state) => [state.name, state]));
let guessedStates = new Set();

function formatName(name) {
  return name.trim().replace(/\s+/g, " ").replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function turtleToPercent(x, y) {
  return {
    left: `${((x + MAP_WIDTH / 2) / MAP_WIDTH) * 100}%`,
    top: `${((MAP_HEIGHT / 2 - y) / MAP_HEIGHT) * 100}%`,
  };
}

function updateScore() {
  scoreElement.textContent = `${guessedStates.size} / 50 States Correct`;
}

function setFeedback(message, type = "") {
  feedbackElement.textContent = message;
  feedbackElement.className = type ? `feedback ${type}` : "feedback";
}

function addStateLabel(state) {
  const label = document.createElement("span");
  label.className = "state-label";
  label.textContent = state.name;

  const position = turtleToPercent(state.x, state.y);
  label.style.left = position.left;
  label.style.top = position.top;
  labelsElement.append(label);
}

function submitGuess(rawGuess) {
  const guess = formatName(rawGuess);

  if (guess === "Exit") {
    showMissingStates();
    return;
  }

  if (!guess) {
    return;
  }

  const state = stateLookup.get(guess);
  if (!state) {
    setFeedback("That's not a state. Try again.", "error");
    return;
  }

  if (guessedStates.has(guess)) {
    setFeedback("You already guessed that state.", "error");
    return;
  }

  guessedStates.add(guess);
  addStateLabel(state);
  updateScore();
  setFeedback(`Correct! ${guess} added to the map.`, "success");

  if (guessedStates.size === 50) {
    completePanel.hidden = false;
    stateInput.disabled = true;
  }
}

function showMissingStates() {
  const missing = STATES
    .map((state) => state.name)
    .filter((name) => !guessedStates.has(name));

  missingListElement.textContent = missing.length
    ? missing.join(", ")
    : "None. You named every state!";

  missingPanel.hidden = false;
  stateInput.disabled = true;
  setFeedback("");
}

function startGame() {
  guessedStates = new Set();
  labelsElement.innerHTML = "";
  missingPanel.hidden = true;
  completePanel.hidden = true;
  stateInput.disabled = false;
  stateInput.value = "";
  updateScore();
  setFeedback("");
  stateInput.focus();
}

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitGuess(stateInput.value);
  stateInput.value = "";
  stateInput.focus();
});

startGame();
