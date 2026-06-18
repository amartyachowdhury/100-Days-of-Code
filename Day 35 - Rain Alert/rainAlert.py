import os

import requests
from twilio.rest import Client

OWM_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast"
OWM_API_KEY = os.environ.get("OWM_API_KEY", "YOUR_OWM_API_KEY")
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "YOUR TWILIO ACCOUNT SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "YOUR TWILIO AUTH TOKEN")
TWILIO_FROM_NUMBER = os.environ.get("TWILIO_FROM_NUMBER", "YOUR TWILIO VIRTUAL NUMBER")
TWILIO_TO_NUMBER = os.environ.get("TWILIO_TO_NUMBER", "YOUR TWILIO VERIFIED REAL NUMBER")
MY_LAT = float(os.environ.get("MY_LAT", "46.947975"))
MY_LON = float(os.environ.get("MY_LON", "7.447447"))
FORECAST_HOURS = 4


def fetch_forecast(lat=MY_LAT, lon=MY_LON, hours=FORECAST_HOURS):
    response = requests.get(
        OWM_ENDPOINT,
        params={
            "lat": lat,
            "lon": lon,
            "appid": OWM_API_KEY,
            "cnt": hours,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def will_rain(forecast_data):
    for hour_data in forecast_data["list"]:
        condition_code = hour_data["weather"][0]["id"]
        if condition_code < 700:
            return True
    return False


def send_rain_alert():
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body="It's going to rain today. Remember to bring an ☔️",
        from_=TWILIO_FROM_NUMBER,
        to=TWILIO_TO_NUMBER,
    )
    return message.status


def main():
    forecast = fetch_forecast()

    if will_rain(forecast):
        status = send_rain_alert()
        print(f"Rain alert sent. Message status: {status}")
    else:
        print("No rain in the forecast. No alert sent.")


if __name__ == "__main__":
    main()
