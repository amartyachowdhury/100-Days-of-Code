const WORK_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 20 * 60;

const MODES = {
  work: {
    label: "Work Session",
    seconds: WORK_SECONDS,
    bodyClass: "mode-work",
  },
  short: {
    label: "Short Break",
    seconds: SHORT_BREAK_SECONDS,
    bodyClass: "mode-short",
  },
  long: {
    label: "Long Break",
    seconds: LONG_BREAK_SECONDS,
    bodyClass: "mode-long",
  },
};

const sessionLabel = document.getElementById("sessionLabel");
const timerElement = document.getElementById("timer");
const pomodoroCountElement = document.getElementById("pomodoroCount");
const statusElement = document.getElementById("status");
const startButton = document.getElementById("startButton");
const modeButtons = document.querySelectorAll(".mode");

let currentMode = "work";
let remainingSeconds = WORK_SECONDS;
let timerId = null;
let isRunning = false;
let pomodorosCompleted = 0;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateDisplay() {
  timerElement.textContent = formatTime(remainingSeconds);
  document.title = `${formatTime(remainingSeconds)} - Pomodoro Timer`;
}

function setStatus(message) {
  statusElement.textContent = message;
}

function applyModeStyles() {
  document.body.classList.remove("mode-work", "mode-short", "mode-long");
  document.body.classList.add(MODES[currentMode].bodyClass);

  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === currentMode);
  });
}

function selectMode(mode) {
  if (isRunning) {
    return;
  }

  currentMode = mode;
  remainingSeconds = MODES[mode].seconds;
  sessionLabel.textContent = MODES[mode].label;
  applyModeStyles();
  updateDisplay();
  setStatus("");
}

function completeSession() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  startButton.textContent = "Start";
  setStatus(`${MODES[currentMode].label} complete!`);

  if (currentMode === "work") {
    pomodorosCompleted += 1;
    pomodoroCountElement.textContent = `Pomodoros completed: ${pomodorosCompleted}`;
  }
}

function tick() {
  if (remainingSeconds <= 0) {
    completeSession();
    return;
  }

  remainingSeconds -= 1;
  updateDisplay();

  if (remainingSeconds === 0) {
    completeSession();
  }
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
    startButton.textContent = "Start";
    setStatus("Timer paused.");
    return;
  }

  isRunning = true;
  startButton.textContent = "Pause";
  setStatus("Timer running...");
  timerId = setInterval(tick, 1000);
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  startButton.textContent = "Start";
  remainingSeconds = MODES[currentMode].seconds;
  updateDisplay();
  setStatus("Timer reset.");
}

selectMode("work");
