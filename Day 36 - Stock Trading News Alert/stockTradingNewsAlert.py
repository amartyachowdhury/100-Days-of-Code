import os

import requests
from twilio.rest import Client

STOCK_ENDPOINT = "https://www.alphavantage.co/query"
NEWS_ENDPOINT = "https://newsapi.org/v2/everything"

STOCK_SYMBOL = os.environ.get("STOCK_SYMBOL", "TSLA")
COMPANY_NAME = os.environ.get("COMPANY_NAME", "Tesla Inc")
STOCK_API_KEY = os.environ.get("STOCK_API_KEY", "YOUR STOCK API KEY")
NEWS_API_KEY = os.environ.get("NEWS_API_KEY", "YOUR NEWS API KEY")
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "YOUR TWILIO ACCOUNT SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "YOUR TWILIO AUTH TOKEN")
TWILIO_FROM_NUMBER = os.environ.get("TWILIO_FROM_NUMBER", "YOUR TWILIO VIRTUAL NUMBER")
TWILIO_TO_NUMBER = os.environ.get("TWILIO_TO_NUMBER", "YOUR TWILIO VERIFIED REAL NUMBER")
PRICE_CHANGE_THRESHOLD = 5


def fetch_daily_prices(symbol=STOCK_SYMBOL):
    response = requests.get(
        STOCK_ENDPOINT,
        params={
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "apikey": STOCK_API_KEY,
        },
        timeout=10,
    )
    response.raise_for_status()
    payload = response.json()

    if "Time Series (Daily)" not in payload:
        raise ValueError("Could not fetch stock prices. Check your API key and symbol.")

    daily_data = list(payload["Time Series (Daily)"].values())
    return (
        float(daily_data[0]["4. close"]),
        float(daily_data[1]["4. close"]),
    )


def calculate_price_change(yesterday_close, day_before_close):
    difference = yesterday_close - day_before_close
    diff_percent = round((difference / day_before_close) * 100)
    direction = "🔺" if difference > 0 else "🔻"
    return diff_percent, direction


def fetch_news(company_name=COMPANY_NAME):
    response = requests.get(
        NEWS_ENDPOINT,
        params={
            "apiKey": NEWS_API_KEY,
            "qInTitle": company_name,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()["articles"][:3]


def format_articles(stock_symbol, direction, diff_percent, articles):
    return [
        (
            f"{stock_symbol}: {direction}{diff_percent}%\n"
            f"Headline: {article['title']}.\n"
            f"Brief: {article.get('description') or 'No description available.'}"
        )
        for article in articles
    ]


def send_news_alerts(messages):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    for body in messages:
        message = client.messages.create(
            body=body,
            from_=TWILIO_FROM_NUMBER,
            to=TWILIO_TO_NUMBER,
        )
        print(f"Alert sent. Message status: {message.status}")


def main():
    yesterday_close, day_before_close = fetch_daily_prices()
    diff_percent, direction = calculate_price_change(
        yesterday_close, day_before_close
    )

    print(f"Yesterday close: {yesterday_close}")
    print(f"Day before close: {day_before_close}")
    print(f"Change: {diff_percent}%")

    if abs(diff_percent) < PRICE_CHANGE_THRESHOLD:
        print(f"No alert sent. Change is below {PRICE_CHANGE_THRESHOLD}%.")
        return

    articles = fetch_news()
    messages = format_articles(STOCK_SYMBOL, direction, diff_percent, articles)
    send_news_alerts(messages)


if __name__ == "__main__":
    main()
