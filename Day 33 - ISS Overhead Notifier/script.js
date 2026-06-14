const locationForm = document.getElementById("locationForm");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const statusElement = document.getElementById("status");
const resultsElement = document.getElementById("results");
const issPositionElement = document.getElementById("issPosition");
const userPositionElement = document.getElementById("userPosition");
const conditionsElement = document.getElementById("conditions");
const notificationElement = document.getElementById("notification");

function isIssOverhead(userLat, userLong, issLat, issLong) {
  return (
    userLat - 5 <= issLat && issLat <= userLat + 5
    && userLong - 5 <= issLong && issLong <= userLong + 5
  );
}

function isNight(sunriseHour, sunsetHour) {
  const timeNow = new Date().getHours();
  return timeNow >= sunsetHour || timeNow <= sunriseHour;
}

function addCondition(text, met) {
  const item = document.createElement("li");
  item.textContent = text;
  item.className = met ? "met" : "not-met";
  conditionsElement.append(item);
}

async function checkIss() {
  statusElement.textContent = "Fetching live ISS and sunrise data...";
  resultsElement.hidden = true;
  notificationElement.hidden = true;
  conditionsElement.innerHTML = "";

  const userLat = Number(latitudeInput.value);
  const userLong = Number(longitudeInput.value);

  if (Number.isNaN(userLat) || Number.isNaN(userLong)) {
    statusElement.textContent = "Please enter valid latitude and longitude values.";
    return;
  }

  try {
    const [issResponse, sunResponse] = await Promise.all([
      fetch("https://api.open-notify.org/iss-now.json"),
      fetch(`https://api.sunrise-sunset.org/json?lat=${userLat}&lng=${userLong}&formatted=0`),
    ]);

    if (!issResponse.ok || !sunResponse.ok) {
      throw new Error("API request failed");
    }

    const issData = await issResponse.json();
    const sunData = await sunResponse.json();

    const issLat = Number(issData.iss_position.latitude);
    const issLong = Number(issData.iss_position.longitude);
    const sunriseHour = Number(sunData.results.sunrise.split("T")[1].split(":")[0]);
    const sunsetHour = Number(sunData.results.sunset.split("T")[1].split(":")[0]);

    const overhead = isIssOverhead(userLat, userLong, issLat, issLong);
    const night = isNight(sunriseHour, sunsetHour);
    const shouldNotify = overhead && night;

    issPositionElement.textContent = `Latitude: ${issLat.toFixed(4)}, Longitude: ${issLong.toFixed(4)}`;
    userPositionElement.textContent = `Latitude: ${userLat.toFixed(4)}, Longitude: ${userLong.toFixed(4)}`;
    addCondition("ISS is within 5° of your location", overhead);
    addCondition("It is currently dark at your location", night);
    addCondition("Email notification would be sent", shouldNotify);

    resultsElement.hidden = false;
    notificationElement.hidden = !shouldNotify;
    statusElement.textContent = shouldNotify
      ? "Conditions met. You would receive a Look Up email."
      : "Conditions not met right now. Try again later.";
  } catch {
    statusElement.textContent = "Could not fetch ISS data. Please try again.";
  }
}

locationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkIss();
});
