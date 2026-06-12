const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");
const SYMBOLS = "!#$%&()*+".split("");
const STORAGE_KEY = "day29-password-manager";

const managerForm = document.getElementById("managerForm");
const websiteInput = document.getElementById("website");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const statusElement = document.getElementById("status");
const savedListElement = document.getElementById("savedList");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePassword() {
  const passwordList = [];

  for (let i = 0; i < randomInt(8, 10); i += 1) {
    passwordList.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  }
  for (let i = 0; i < randomInt(2, 4); i += 1) {
    passwordList.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }
  for (let i = 0; i < randomInt(2, 4); i += 1) {
    passwordList.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
  }

  const password = shuffle(passwordList).join("");
  passwordInput.value = password;
  setStatus("Password generated and ready to save.", "success");
  return password;
}

function setStatus(message, type = "") {
  statusElement.textContent = message;
  statusElement.className = type ? `status ${type}` : "status";
}

function loadSavedEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderSavedEntries() {
  const entries = loadSavedEntries();

  if (!entries.length) {
    savedListElement.innerHTML = '<p class="empty">No saved passwords yet.</p>';
    return;
  }

  savedListElement.innerHTML = "";

  entries.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = "saved-card";

    card.innerHTML = `
      <h3>${entry.website}</h3>
      <p><strong>Email:</strong> ${entry.email || "—"}</p>
      <p class="saved-password"><strong>Password:</strong> ${entry.password}</p>
      <div class="saved-actions">
        <button type="button" class="secondary" data-copy="${index}">Copy Password</button>
        <button type="button" class="danger" data-delete="${index}">Delete</button>
      </div>
    `;

    savedListElement.append(card);
  });
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
  if (!passwordInput.value) {
    setStatus("Generate or enter a password first.", "error");
    return;
  }

  try {
    await copyToClipboard(passwordInput.value);
    setStatus("Password copied to clipboard.", "success");
  } catch {
    setStatus("Could not copy password.", "error");
  }
}

managerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const website = websiteInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!website || !password) {
    setStatus("Please make sure you haven't left any fields empty.", "error");
    return;
  }

  const confirmed = window.confirm(
    `These are the details entered:\nEmail: ${email}\nPassword: ${password}\n\nIs it ok to save?`
  );

  if (!confirmed) {
    return;
  }

  const entries = loadSavedEntries();
  entries.push({ website, email, password });
  saveEntries(entries);

  websiteInput.value = "";
  passwordInput.value = "";
  websiteInput.focus();
  renderSavedEntries();
  setStatus(`${website} saved successfully.`, "success");
});

savedListElement.addEventListener("click", async (event) => {
  const copyIndex = event.target.dataset.copy;
  const deleteIndex = event.target.dataset.delete;
  const entries = loadSavedEntries();

  if (copyIndex !== undefined) {
    try {
      await copyToClipboard(entries[copyIndex].password);
      setStatus("Saved password copied to clipboard.", "success");
    } catch {
      setStatus("Could not copy password.", "error");
    }
    return;
  }

  if (deleteIndex !== undefined) {
    entries.splice(Number(deleteIndex), 1);
    saveEntries(entries);
    renderSavedEntries();
    setStatus("Entry deleted.", "success");
  }
});

renderSavedEntries();
