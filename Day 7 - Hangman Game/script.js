const wordList = [
    "aardvark", "baboon", "camel", "capybara", "chameleon", "cheetah", "colt",
    "coyote", "crow", "deer", "dingo", "donkey", "dromedary", "elephant",
    "fox", "frog", "gazelle", "giraffe", "goat", "goose", "gorilla", "grasshopper",
    "hare", "hawk", "hedgehog", "hippopotamus", "hyena", "jackal", "jaguar",
    "kangaroo", "koala", "lemur", "leopard", "lion", "lizard", "llama",
    "lynx", "marmoset", "marten", "mink", "mole", "mongoose", "monkey",
    "moose", "mouse", "mule", "newt", "ocelot", "opossum", "orangutan",
    "oryx", "otter", "ox", "panda", "panther", "parakeet", "parrot",
    "pig", "platypus", "polarbear", "pony", "porcupine", "porpoise", "puma",
    "rabbit", "raccoon", "ram", "rat", "reindeer", "rhinoceros", "salamander",
    "seal", "sheep", "skunk", "sloth", "snake", "squirrel", "stallion",
    "tiger", "toad", "turtle", "walrus", "warthog", "weasel", "whale",
    "wildcat", "wolf", "wolverine", "wombat", "woodchuck", "yak", "zebra",
];

const stages = [
    `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========
`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========
`,
    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========
`,
    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`,
    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`,
    `
  +---+
  |   |
  O   |
      |
      |
      |
=========
`,
    `
  +---+
  |   |
      |
      |
      |
      |
=========
`,
];

const logo = `
   _
 | |
 | |__   __ _ _ __   __ _ _ __ ___   __ _ _ __
 | '_ \\ / _\` | '_ \\ / _\` | '_ \` _ \\ / _\` | '_ \\
 | | | | (_| | | | | (_| | | | | | | (_| | | | |
 |_| |_|\\__,_|_| |_|\\__, |_| |_| |_|\\__,_|_| |_|
                     __/ |
                    |___/
`;

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

const state = {
    chosenWord: "",
    wordDisplay: [],
    lives: 6,
    guessedLetters: new Set(),
    gameOver: false,
};

function initDom() {
    document.getElementById("logo").textContent = logo;
    buildKeyboard();
}

function buildKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";
    ALPHABET.forEach((letter) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = letter.toUpperCase();
        btn.dataset.letter = letter;
        btn.onclick = () => guessLetter(letter);
        keyboard.appendChild(btn);
    });
}

function startGame() {
    state.chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
    state.wordDisplay = Array(state.chosenWord.length).fill("_");
    state.lives = 6;
    state.guessedLetters = new Set();
    state.gameOver = false;

    document.getElementById("newGame").hidden = true;
    document.getElementById("message").textContent = "";
    document.getElementById("message").className = "message";

    ALPHABET.forEach((letter) => {
        const btn = document.querySelector(`[data-letter="${letter}"]`);
        btn.disabled = false;
        btn.classList.remove("correct", "wrong");
    });

    render();
}

function guessLetter(letter) {
    if (state.gameOver || state.guessedLetters.has(letter)) {
        if (state.guessedLetters.has(letter)) {
            setMessage(`You've already guessed ${letter}`);
        }
        return;
    }

    state.guessedLetters.add(letter);
    const btn = document.querySelector(`[data-letter="${letter}"]`);
    btn.disabled = true;

    let found = false;
    for (let i = 0; i < state.chosenWord.length; i++) {
        if (state.chosenWord[i] === letter) {
            state.wordDisplay[i] = letter;
            found = true;
        }
    }

    if (found) {
        btn.classList.add("correct");
        if (!state.wordDisplay.includes("_")) {
            endGame(true);
            return;
        }
    } else {
        btn.classList.add("wrong");
        state.lives -= 1;
        setMessage(`You guessed ${letter}, that's not in the word. You lose a life.`);

        if (state.lives === 0) {
            endGame(false);
            return;
        }
    }

    render();
}

function setMessage(text) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = "message";
}

function endGame(won) {
    state.gameOver = true;
    const message = document.getElementById("message");

    if (won) {
        message.textContent = "You win!";
        message.className = "message win";
    } else {
        message.textContent = `IT WAS ${state.chosenWord.toUpperCase()}! YOU LOSE`;
        message.className = "message lose";
        state.wordDisplay = state.chosenWord.split("");
    }

    document.getElementById("newGame").hidden = false;
    render();
}

function render() {
    document.getElementById("stage").textContent = stages[state.lives];
    document.getElementById("word").textContent = state.wordDisplay.join(" ");
    document.getElementById("lives").textContent =
        `****************************${state.lives}/6 LIVES LEFT****************************`;
}

initDom();
startGame();
