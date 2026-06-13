const STORAGE_KEY = "day31-flash-card-words";
const FLIP_DELAY_MS = 3000;
const BACKGROUND_COLOR = "#B1DDC6";

const cardElement = document.getElementById("card");
const cardBgElement = document.getElementById("cardBg");
const cardTitleElement = document.getElementById("cardTitle");
const cardWordElement = document.getElementById("cardWord");
const progressElement = document.getElementById("progress");
const statusElement = document.getElementById("status");

let toLearn = [];
let currentCard = null;
let flipTimerId = null;
let isFlipped = false;

function loadToLearn() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...FRENCH_WORDS];
  } catch {
    return [...FRENCH_WORDS];
  }
}

function saveToLearn() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toLearn));
}

function updateProgress() {
  progressElement.textContent = `Words left: ${toLearn.length}`;
}

function setStatus(message) {
  statusElement.textContent = message;
}

function showFront() {
  isFlipped = false;
  cardBgElement.src = "images/card_front.png";
  cardTitleElement.textContent = "French";
  cardTitleElement.style.color = "#000000";
  cardWordElement.style.color = "#000000";
  cardWordElement.textContent = currentCard ? currentCard.French : "";
}

function showBack() {
  isFlipped = true;
  cardBgElement.src = "images/card_back.png";
  cardTitleElement.textContent = "English";
  cardTitleElement.style.color = "#ffffff";
  cardWordElement.style.color = "#ffffff";
  cardWordElement.textContent = currentCard ? currentCard.English : "";
}

function clearFlipTimer() {
  if (flipTimerId !== null) {
    clearTimeout(flipTimerId);
    flipTimerId = null;
  }
}

function scheduleFlip() {
  clearFlipTimer();
  flipTimerId = setTimeout(() => {
    if (currentCard) {
      showBack();
    }
  }, FLIP_DELAY_MS);
}

function showComplete() {
  clearFlipTimer();
  currentCard = null;
  cardBgElement.src = "images/card_front.png";
  cardTitleElement.textContent = "Complete";
  cardTitleElement.style.color = "#000000";
  cardWordElement.style.color = "#000000";
  cardWordElement.textContent = "No words left to learn";
  setStatus("You know all the words in this deck.");
}

function nextCard() {
  clearFlipTimer();
  updateProgress();

  if (!toLearn.length) {
    showComplete();
    return;
  }

  currentCard = toLearn[Math.floor(Math.random() * toLearn.length)];
  showFront();
  scheduleFlip();
  setStatus("");
}

function markKnown() {
  if (!currentCard || !toLearn.length) {
    return;
  }

  toLearn = toLearn.filter(
    (word) => word.French !== currentCard.French || word.English !== currentCard.English
  );
  saveToLearn();
  updateProgress();
  nextCard();
}

function resetDeck() {
  toLearn = [...FRENCH_WORDS];
  saveToLearn();
  updateProgress();
  setStatus("Deck reset.");
  nextCard();
}

document.body.style.backgroundColor = BACKGROUND_COLOR;
toLearn = loadToLearn();
updateProgress();
nextCard();
