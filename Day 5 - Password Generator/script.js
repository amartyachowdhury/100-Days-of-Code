const letters = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
    "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
    "W", "X", "Y", "Z",
];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbols = ["!", "#", "$", "%", "&", "(", ")", "*", "+"];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function buildPassword(nrLetters, nrSymbols, nrNumbers) {
    const passwordList = [];
    for (let i = 0; i < nrLetters; i++) {
        passwordList.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    for (let i = 0; i < nrSymbols; i++) {
        passwordList.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    for (let i = 0; i < nrNumbers; i++) {
        passwordList.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    shuffle(passwordList);
    return passwordList.join("");
}

function readCounts() {
    const nrLetters = parseInt(document.getElementById("letters").value, 10);
    const nrSymbols = parseInt(document.getElementById("symbols").value, 10);
    const nrNumbers = parseInt(document.getElementById("numbers").value, 10);

    if (
        Number.isNaN(nrLetters) ||
        Number.isNaN(nrSymbols) ||
        Number.isNaN(nrNumbers) ||
        nrLetters < 0 ||
        nrSymbols < 0 ||
        nrNumbers < 0
    ) {
        return null;
    }

    return { nrLetters, nrSymbols, nrNumbers };
}

function generatePassword() {
    const counts = readCounts();
    const errorEl = document.getElementById("error");
    const outputEl = document.getElementById("output");

    if (!counts) {
        errorEl.textContent = "Please enter valid numbers that are 0 or greater.";
        errorEl.hidden = false;
        outputEl.hidden = true;
        return;
    }

    errorEl.hidden = true;
    const password = buildPassword(counts.nrLetters, counts.nrSymbols, counts.nrNumbers);
    document.getElementById("password").textContent = password;
    resetCopyButton();
    outputEl.hidden = false;
}

function resetCopyButton() {
    const copyBtn = document.getElementById("copyBtn");
    copyBtn.textContent = "Copy Password";
    copyBtn.classList.remove("copied");
}

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!copied) {
        throw new Error("Copy failed");
    }
}

async function copyPassword() {
    const password = document.getElementById("password").textContent;
    const copyBtn = document.getElementById("copyBtn");

    if (!password) {
        return;
    }

    try {
        await copyToClipboard(password);
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("copied");
        setTimeout(resetCopyButton, 2000);
    } catch (err) {
        copyBtn.textContent = "Copy failed";
        setTimeout(resetCopyButton, 2000);
    }
}
