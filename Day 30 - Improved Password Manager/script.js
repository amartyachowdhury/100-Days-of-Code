const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");
const SYMBOLS = "!#$%&()*+".split("");
const STORAGE_KEY = "day30-password-manager";

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

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
}

function renderSavedEntries() {
  const data = loadData();
  const websites = Object.keys(data).sort();

  if (!websites.length) {
    savedListElement.innerHTML = '<p class="empty">No saved passwords yet.</p>';
    return;
  }

  savedListElement.innerHTML = "";

  websites.forEach((website) => {
    const entry = data[website];
    const card = document.createElement("article");
    card.className = "saved-card";

    card.innerHTML = `
      <h3>${website}</h3>
      <p><strong>Email:</strong> ${entry.email || "—"}</p>
      <p class="saved-password"><strong>Password:</strong> ${entry.password}</p>
      <div class="saved-actions">
        <button type="button" class="secondary" data-load="${website}">Load</button>
        <button type="button" class="secondary" data-copy="${website}">Copy Password</button>
        <button type="button" class="danger" data-delete="${website}">Delete</button>
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

function searchPassword() {
  const website = websiteInput.value.trim();
  if (!website) {
    setStatus("Enter a website to search.", "error");
    return;
  }

  const data = loadData();
  if (!data[website]) {
    setStatus(`No details for ${website} exist.`, "error");
    return;
  }

  emailInput.value = data[website].email || "";
  passwordInput.value = data[website].password || "";
  setStatus(`Loaded saved details for ${website}.`, "success");
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

  const data = loadData();
  const isUpdate = Object.prototype.hasOwnProperty.call(data, website);
  data[website] = { email, password };
  saveData(data);

  passwordInput.value = "";
  renderSavedEntries();
  setStatus(
    isUpdate ? `${website} updated successfully.` : `${website} saved successfully.`,
    "success"
  );
});

savedListElement.addEventListener("click", async (event) => {
  const website = event.target.dataset.load
    || event.target.dataset.copy
    || event.target.dataset.delete;

  if (!website) {
    return;
  }

  const data = loadData();

  if (event.target.dataset.load) {
    websiteInput.value = website;
    emailInput.value = data[website].email || "";
    passwordInput.value = data[website].password || "";
    setStatus(`Loaded saved details for ${website}.`, "success");
    return;
  }

  if (event.target.dataset.copy) {
    try {
      await copyToClipboard(data[website].password);
      setStatus("Saved password copied to clipboard.", "success");
    } catch {
      setStatus("Could not copy password.", "error");
    }
    return;
  }

  if (event.target.dataset.delete) {
    delete data[website];
    saveData(data);
    renderSavedEntries();
    setStatus(`${website} deleted.`, "success");
  }
});

renderSavedEntries();
