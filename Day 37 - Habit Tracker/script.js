const PIXELA_BASE_URL = "https://pixe.la/v1/users";

const usernameInput = document.getElementById("username");
const tokenInput = document.getElementById("token");
const graphIdInput = document.getElementById("graphId");
const dateInput = document.getElementById("date");
const quantityInput = document.getElementById("quantity");
const statusElement = document.getElementById("status");
const graphSectionElement = document.getElementById("graphSection");
const graphImageElement = document.getElementById("graphImage");
const graphLinkElement = document.getElementById("graphLink");

function setDefaultDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  dateInput.value = `${today.getFullYear()}-${month}-${day}`;
}

function formatPixelaDate(dateValue) {
  return dateValue.replaceAll("-", "");
}

function getCredentials() {
  const username = usernameInput.value.trim();
  const token = tokenInput.value.trim();
  const graphId = graphIdInput.value.trim();
  const date = dateInput.value;
  const quantity = quantityInput.value.trim();

  if (!username || !token || !graphId) {
    statusElement.textContent = "Please enter your Pixela username, token, and graph ID.";
    return null;
  }

  if (!date) {
    statusElement.textContent = "Please choose a date.";
    return null;
  }

  return { username, token, graphId, date, quantity };
}

function updateGraphPreview(username, graphId) {
  const graphPageUrl = `https://pixe.la/${username}/graphs/${graphId}`;
  const graphImageUrl =
    `https://pixe.la-v1.pixels.app/graphs/${graphId}?username=${encodeURIComponent(username)}`;

  graphImageElement.src = graphImageUrl;
  graphLinkElement.href = graphPageUrl;
  graphLinkElement.textContent = graphPageUrl;
  graphSectionElement.hidden = false;
}

async function submitPixel(action) {
  const credentials = getCredentials();
  if (!credentials) {
    return;
  }

  const { username, token, graphId, date, quantity } = credentials;
  const pixelaDate = formatPixelaDate(date);
  const headers = {
    "X-USER-TOKEN": token,
    "Content-Type": "application/json",
  };

  if (action !== "delete") {
    if (!quantity) {
      statusElement.textContent = "Please enter a distance in kilometers.";
      return;
    }

    if (Number.isNaN(Number(quantity))) {
      statusElement.textContent = "Please enter a valid number for distance.";
      return;
    }
  }

  statusElement.textContent = "Sending request to Pixela...";

  try {
    let response;

    if (action === "add") {
      response = await fetch(`${PIXELA_BASE_URL}/${username}/graphs/${graphId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          date: pixelaDate,
          quantity,
        }),
      });
    } else if (action === "update") {
      response = await fetch(
        `${PIXELA_BASE_URL}/${username}/graphs/${graphId}/${pixelaDate}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ quantity }),
        },
      );
    } else {
      response = await fetch(
        `${PIXELA_BASE_URL}/${username}/graphs/${graphId}/${pixelaDate}`,
        {
          method: "DELETE",
          headers,
        },
      );
    }

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "Pixela request failed.");
    }

    updateGraphPreview(username, graphId);
    statusElement.textContent = payload.message || "Pixela request completed successfully.";
  } catch (error) {
    statusElement.textContent =
      error.message || "Could not reach Pixela. Check your credentials and try again.";
  }
}

setDefaultDate();
