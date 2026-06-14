import os
import smtplib
import time
from datetime import datetime

import requests

MY_EMAIL = os.environ.get("MY_EMAIL", "YOUR EMAIL")
MY_PASSWORD = os.environ.get("MY_PASSWORD", "YOUR PASSWORD")
SMTP_SERVER = os.environ.get("SMTP_SERVER", "YOUR SMTP ADDRESS")
MY_LAT = float(os.environ.get("MY_LAT", "51.507351"))
MY_LONG = float(os.environ.get("MY_LONG", "-0.127758"))
CHECK_INTERVAL_SECONDS = 60


def is_iss_overhead():
    response = requests.get("https://api.open-notify.org/iss-now.json", timeout=10)
    response.raise_for_status()
    data = response.json()

    iss_latitude = float(data["iss_position"]["latitude"])
    iss_longitude = float(data["iss_position"]["longitude"])

    return (
        MY_LAT - 5 <= iss_latitude <= MY_LAT + 5
        and MY_LONG - 5 <= iss_longitude <= MY_LONG + 5
    )


def is_night():
    parameters = {
        "lat": MY_LAT,
        "lng": MY_LONG,
        "formatted": 0,
    }
    response = requests.get(
        "https://api.sunrise-sunset.org/json",
        params=parameters,
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()
    sunrise = int(data["results"]["sunrise"].split("T")[1].split(":")[0])
    sunset = int(data["results"]["sunset"].split("T")[1].split(":")[0])
    time_now = datetime.now().hour

    return time_now >= sunset or time_now <= sunrise


def send_notification():
    with smtplib.SMTP(SMTP_SERVER) as connection:
        connection.starttls()
        connection.login(MY_EMAIL, MY_PASSWORD)
        connection.sendmail(
            from_addr=MY_EMAIL,
            to_addrs=MY_EMAIL,
            msg="Subject:Look Up\n\nThe ISS is above you in the sky.",
        )


def main():
    print("ISS Overhead Notifier started. Checking every minute...")

    while True:
        time.sleep(CHECK_INTERVAL_SECONDS)

        if is_iss_overhead() and is_night():
            send_notification()
            print("Notification sent: ISS is overhead.")


if __name__ == "__main__":
    main()
