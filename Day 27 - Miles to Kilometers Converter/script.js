const MILES_TO_KM = 1.609344;

const convertForm = document.getElementById("convertForm");
const milesInput = document.getElementById("milesInput");
const resultElement = document.getElementById("result");
const errorElement = document.getElementById("error");

function milesToKilometers(miles) {
  return miles * MILES_TO_KM;
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.hidden = false;
}

function clearError() {
  errorElement.textContent = "";
  errorElement.hidden = true;
}

function convertMiles() {
  clearError();

  const miles = Number(milesInput.value);
  if (Number.isNaN(miles)) {
    resultElement.textContent = "Enter a value to see the conversion.";
    showError("Please enter a valid number.");
    return;
  }

  if (miles < 0) {
    resultElement.textContent = "Enter a value to see the conversion.";
    showError("Distance cannot be negative.");
    return;
  }

  const kilometers = milesToKilometers(miles);
  resultElement.textContent = `${miles} miles = ${kilometers.toFixed(2)} kilometers`;
}

convertForm.addEventListener("submit", (event) => {
  event.preventDefault();
  convertMiles();
});
