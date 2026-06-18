const OWM_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast";
const FORECAST_HOURS = 4;

const forecastForm = document.getElementById("forecastForm");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const apiKeyInput = document.getElementById("apiKey");
const statusElement = document.getElementById("status");
const resultsElement = document.getElementById("results");
const locationSummaryElement = document.getElementById("locationSummary");
const forecastListElement = document.getElementById("forecastList");
const alertStatusElement = document.getElementById("alertStatus");
const notificationElement = document.getElementById("notification");

function isRainyCondition(conditionCode) {
  return conditionCode < 700;
}

function formatForecastTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function addForecastItem(hourData) {
  const weather = hourData.weather[0];
  const rainy = isRainyCondition(weather.id);
  const item = document.createElement("li");
  item.textContent =
    `${formatForecastTime(hourData.dt)} — ${weather.main} (${weather.description})`;
  item.className = rainy ? "rainy" : "clear";
  forecastListElement.append(item);
  return rainy;
}

async function checkForecast() {
  statusElement.textContent = "Fetching forecast data...";
  resultsElement.hidden = true;
  notificationElement.hidden = true;
  forecastListElement.innerHTML = "";

  const lat = Number(latitudeInput.value);
  const lon = Number(longitudeInput.value);
  const apiKey = apiKeyInput.value.trim();

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    statusElement.textContent = "Please enter valid latitude and longitude values.";
    return;
  }

  if (!apiKey) {
    statusElement.textContent = "Please enter your OpenWeatherMap API key.";
    return;
  }

  try {
    const url = new URL(OWM_ENDPOINT);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("cnt", String(FORECAST_HOURS));

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Forecast request failed");
    }

    const forecastData = await response.json();
    let willRain = false;

    forecastData.list.forEach((hourData) => {
      if (addForecastItem(hourData)) {
        willRain = true;
      }
    });

    locationSummaryElement.textContent =
      `Latitude: ${lat.toFixed(4)}, Longitude: ${lon.toFixed(4)}`;
    alertStatusElement.textContent = willRain
      ? "Rain is expected in the next 12 hours. An SMS alert would be sent."
      : "No rain expected in the next 12 hours. No alert would be sent.";

    resultsElement.hidden = false;
    notificationElement.hidden = !willRain;
    statusElement.textContent = willRain
      ? "Forecast checked. Bring an umbrella."
      : "Forecast checked. You are in the clear for now.";
  } catch {
    statusElement.textContent =
      "Could not fetch forecast data. Check your API key and try again.";
  }
}

forecastForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkForecast();
});
