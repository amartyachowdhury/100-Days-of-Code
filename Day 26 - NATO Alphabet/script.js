const encodeForm = document.getElementById("encodeForm");
const wordInput = document.getElementById("wordInput");
const outputElement = document.getElementById("output");
const errorElement = document.getElementById("error");
const alphabetGrid = document.getElementById("alphabetGrid");

function encodeWord(word) {
  const letters = [...word.toUpperCase()].filter((char) => /[A-Z]/.test(char));

  if (!letters.length) {
    throw new Error("Enter at least one letter.");
  }

  return letters.map((letter) => {
    const code = NATO_ALPHABET[letter];
    if (!code) {
      throw new Error(`'${letter}' is not in the NATO phonetic alphabet.`);
    }
    return code;
  });
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.hidden = false;
}

function clearError() {
  errorElement.textContent = "";
  errorElement.hidden = true;
}

function renderAlphabetReference() {
  Object.entries(NATO_ALPHABET).forEach(([letter, code]) => {
    const item = document.createElement("div");
    item.className = "alphabet-item";
    item.innerHTML = `<span class="letter">${letter}</span><span class="code">${code}</span>`;
    alphabetGrid.append(item);
  });
}

encodeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  try {
    const codes = encodeWord(wordInput.value);
    outputElement.textContent = codes.join(" ");
  } catch (error) {
    outputElement.textContent = "Enter a word to see the result.";
    showError(error.message);
  }
});

renderAlphabetReference();
