const STOCK_ENDPOINT = "https://www.alphavantage.co/query";
const NEWS_ENDPOINT = "https://newsapi.org/v2/everything";
const PRICE_CHANGE_THRESHOLD = 5;

const stockForm = document.getElementById("stockForm");
const stockSymbolInput = document.getElementById("stockSymbol");
const companyNameInput = document.getElementById("companyName");
const stockApiKeyInput = document.getElementById("stockApiKey");
const newsApiKeyInput = document.getElementById("newsApiKey");
const statusElement = document.getElementById("status");
const resultsElement = document.getElementById("results");
const priceSummaryElement = document.getElementById("priceSummary");
const changeSummaryElement = document.getElementById("changeSummary");
const alertStatusElement = document.getElementById("alertStatus");
const articlesSectionElement = document.getElementById("articlesSection");
const articleListElement = document.getElementById("articleList");
const smsPreviewElement = document.getElementById("smsPreview");
const smsMessagesElement = document.getElementById("smsMessages");

function calculatePriceChange(yesterdayClose, dayBeforeClose) {
  const difference = yesterdayClose - dayBeforeClose;
  const diffPercent = Math.round((difference / dayBeforeClose) * 100);
  const direction = difference > 0 ? "🔺" : "🔻";
  return { diffPercent, direction };
}

function formatArticleMessage(stockSymbol, direction, diffPercent, article) {
  const description = article.description || "No description available.";
  return (
    `${stockSymbol}: ${direction}${diffPercent}%\n` +
    `Headline: ${article.title}.\n` +
    `Brief: ${description}`
  );
}

function addSmsPreview(message) {
  const card = document.createElement("div");
  card.className = "sms-message";
  card.textContent = message;
  smsMessagesElement.append(card);
}

async function fetchDailyPrices(stockSymbol, stockApiKey) {
  const url = new URL(STOCK_ENDPOINT);
  url.searchParams.set("function", "TIME_SERIES_DAILY");
  url.searchParams.set("symbol", stockSymbol);
  url.searchParams.set("apikey", stockApiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Stock request failed");
  }

  const payload = await response.json();
  if (!payload["Time Series (Daily)"]) {
    throw new Error("Could not fetch stock prices. Check your API key and symbol.");
  }

  const dailyData = Object.values(payload["Time Series (Daily)"]);
  return {
    yesterdayClose: Number(dailyData[0]["4. close"]),
    dayBeforeClose: Number(dailyData[1]["4. close"]),
  };
}

async function fetchNews(companyName, newsApiKey) {
  const url = new URL(NEWS_ENDPOINT);
  url.searchParams.set("apiKey", newsApiKey);
  url.searchParams.set("qInTitle", companyName);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("News request failed");
  }

  const payload = await response.json();
  return payload.articles.slice(0, 3);
}

async function checkStock() {
  statusElement.textContent = "Fetching stock and news data...";
  resultsElement.hidden = true;
  articlesSectionElement.hidden = true;
  smsPreviewElement.hidden = true;
  articleListElement.innerHTML = "";
  smsMessagesElement.innerHTML = "";

  const stockSymbol = stockSymbolInput.value.trim().toUpperCase();
  const companyName = companyNameInput.value.trim();
  const stockApiKey = stockApiKeyInput.value.trim();
  const newsApiKey = newsApiKeyInput.value.trim();

  if (!stockSymbol || !companyName) {
    statusElement.textContent = "Please enter a stock symbol and company name.";
    return;
  }

  if (!stockApiKey || !newsApiKey) {
    statusElement.textContent = "Please enter both API keys.";
    return;
  }

  try {
    const { yesterdayClose, dayBeforeClose } = await fetchDailyPrices(
      stockSymbol,
      stockApiKey,
    );
    const { diffPercent, direction } = calculatePriceChange(
      yesterdayClose,
      dayBeforeClose,
    );
    const shouldAlert = Math.abs(diffPercent) >= PRICE_CHANGE_THRESHOLD;

    priceSummaryElement.textContent =
      `Yesterday: $${yesterdayClose.toFixed(2)} | Day before: $${dayBeforeClose.toFixed(2)}`;
    changeSummaryElement.textContent = `${direction} ${diffPercent}%`;
    changeSummaryElement.className = diffPercent >= 0 ? "change-up" : "change-down";

    if (!shouldAlert) {
      alertStatusElement.textContent =
        `No alert would be sent. The change is below ${PRICE_CHANGE_THRESHOLD}%.`;
      resultsElement.hidden = false;
      statusElement.textContent = "Stock checked. No significant movement detected.";
      return;
    }

    alertStatusElement.textContent =
      "Price change threshold met. SMS alerts would be sent for the top headlines.";

    try {
      const articles = await fetchNews(companyName, newsApiKey);

      articles.forEach((article) => {
        const item = document.createElement("li");
        item.textContent = article.title;
        articleListElement.append(item);

        addSmsPreview(
          formatArticleMessage(stockSymbol, direction, diffPercent, article),
        );
      });

      articlesSectionElement.hidden = false;
      smsPreviewElement.hidden = false;
      statusElement.textContent = "Stock checked. Headlines loaded for SMS preview.";
    } catch {
      alertStatusElement.textContent +=
        " News API requests are blocked in the browser, so use the Python CLI to send live Twilio alerts.";
      statusElement.textContent =
        "Stock checked. News headlines require the CLI version in this browser.";
    }

    resultsElement.hidden = false;
  } catch {
    statusElement.textContent =
      "Could not fetch stock data. Check your API keys and try again.";
  }
}

stockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkStock();
});
