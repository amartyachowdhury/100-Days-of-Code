const templateElement = document.getElementById("template");
const nameListElement = document.getElementById("nameList");
const outputElement = document.getElementById("output");
const fileNameElement = document.getElementById("fileName");
const allLettersSection = document.getElementById("allLetters");
const allLettersListElement = document.getElementById("allLettersList");
const customNameInput = document.getElementById("customName");

function mergeLetter(name) {
  return LETTER_TEMPLATE.replace(PLACEHOLDER, name);
}

function outputFileName(name) {
  return `letter_for_${name}.txt`;
}

function showLetter(name) {
  outputElement.textContent = mergeLetter(name);
  fileNameElement.textContent = `Output/ReadyToSend/${outputFileName(name)}`;
}

function previewCustomName() {
  const name = customNameInput.value.trim();
  if (!name) {
    return;
  }
  showLetter(name);
}

function generateAll() {
  allLettersListElement.innerHTML = "";

  INVITED_NAMES.forEach((name) => {
    const card = document.createElement("article");
    card.className = "letter-card";

    const heading = document.createElement("h3");
    heading.textContent = outputFileName(name);

    const letter = document.createElement("pre");
    letter.className = "letter-box";
    letter.textContent = mergeLetter(name);

    card.append(heading, letter);
    allLettersListElement.append(card);
  });

  allLettersSection.hidden = false;
}

function init() {
  templateElement.textContent = LETTER_TEMPLATE;

  INVITED_NAMES.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.onclick = () => showLetter(name);
    nameListElement.append(button);
  });

  showLetter(INVITED_NAMES[0]);
}

init();
