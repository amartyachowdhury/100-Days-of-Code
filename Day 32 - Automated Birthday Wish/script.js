const todayDateElement = document.getElementById("todayDate");
const birthdayStatusElement = document.getElementById("birthdayStatus");
const birthdayListElement = document.getElementById("birthdayList");
const emailMetaElement = document.getElementById("emailMeta");
const emailPreviewElement = document.getElementById("emailPreview");

let selectedPerson = null;
let selectedTemplateKey = "1";

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getTodayKey() {
  const today = new Date();
  return `${today.getMonth() + 1}-${today.getDate()}`;
}

function personKey(person) {
  return `${person.month}-${person.day}`;
}

function buildLetter(name, templateKey = selectedTemplateKey) {
  return LETTER_TEMPLATES[templateKey].replace("[NAME]", name);
}

function setPreview(person, templateKey = selectedTemplateKey) {
  selectedPerson = person;
  selectedTemplateKey = templateKey;
  emailMetaElement.textContent = `To: ${person.email} | Subject: Happy Birthday!`;
  emailPreviewElement.textContent = buildLetter(person.name, templateKey);
}

function previewRandomTemplate() {
  if (!selectedPerson) {
    return;
  }

  const keys = Object.keys(LETTER_TEMPLATES);
  selectedTemplateKey = keys[Math.floor(Math.random() * keys.length)];
  setPreview(selectedPerson, selectedTemplateKey);
}

function renderBirthdayList() {
  birthdayListElement.innerHTML = "";

  BIRTHDAYS.forEach((person) => {
    const card = document.createElement("article");
    card.className = "birthday-card";
    if (personKey(person) === getTodayKey()) {
      card.classList.add("today");
    }

    card.innerHTML = `
      <h3>${person.name}</h3>
      <p>${person.email}</p>
      <p class="birthday-date">Birthday: ${person.month}/${person.day}</p>
      <button type="button" class="secondary">Preview Email</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      const keys = Object.keys(LETTER_TEMPLATES);
      selectedTemplateKey = keys[Math.floor(Math.random() * keys.length)];
      setPreview(person, selectedTemplateKey);
    });

    birthdayListElement.append(card);
  });
}

function checkToday() {
  const matches = BIRTHDAYS.filter((person) => personKey(person) === getTodayKey());

  if (!matches.length) {
    birthdayStatusElement.textContent = "No birthdays today.";
    birthdayStatusElement.className = "birthday-status";
    emailMetaElement.textContent = "";
    emailPreviewElement.textContent = "No birthday emails to send today.";
    selectedPerson = null;
    return;
  }

  const person = matches[0];
  const keys = Object.keys(LETTER_TEMPLATES);
  selectedTemplateKey = keys[Math.floor(Math.random() * keys.length)];
  setPreview(person, selectedTemplateKey);

  birthdayStatusElement.textContent =
    matches.length === 1
      ? `Today is ${person.name}'s birthday!`
      : `Today is a birthday for ${matches.map((entry) => entry.name).join(", ")}!`;
  birthdayStatusElement.className = "birthday-status highlight";
}

todayDateElement.textContent = `Today: ${formatDate(new Date())}`;
renderBirthdayList();
checkToday();
