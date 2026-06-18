import os
from datetime import datetime

import requests

PIXELA_BASE_URL = "https://pixe.la/v1/users"
USERNAME = os.environ.get("PIXELA_USERNAME", "YOUR USERNAME")
TOKEN = os.environ.get("PIXELA_TOKEN", "YOUR PIXELA TOKEN")
GRAPH_ID = os.environ.get("PIXELA_GRAPH_ID", "YOUR GRAPH ID")
GRAPH_NAME = os.environ.get("PIXELA_GRAPH_NAME", "Cycling Graph")
GRAPH_UNIT = os.environ.get("PIXELA_GRAPH_UNIT", "Km")


def auth_headers():
    return {"X-USER-TOKEN": TOKEN}


def graph_endpoint():
    return f"{PIXELA_BASE_URL}/{USERNAME}/graphs/{GRAPH_ID}"


def pixel_endpoint(date):
    return f"{graph_endpoint()}/{date}"


def today_string():
    return datetime.now().strftime("%Y%m%d")


def read_quantity(prompt="How many kilometers did you cycle today? "):
    while True:
        value = input(prompt).strip()
        try:
            float(value)
            return value
        except ValueError:
            print("Please enter a valid number.")


def create_user():
    response = requests.post(
        url=PIXELA_BASE_URL,
        json={
            "token": TOKEN,
            "username": USERNAME,
            "agreeTermsOfService": "yes",
            "notMinor": "yes",
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def create_graph():
    response = requests.post(
        url=f"{PIXELA_BASE_URL}/{USERNAME}/graphs",
        json={
            "id": GRAPH_ID,
            "name": GRAPH_NAME,
            "unit": GRAPH_UNIT,
            "type": "float",
            "color": "ajisai",
        },
        headers=auth_headers(),
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def add_pixel(quantity, date=None):
    response = requests.post(
        url=graph_endpoint(),
        json={
            "date": date or today_string(),
            "quantity": quantity,
        },
        headers=auth_headers(),
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def update_pixel(quantity, date=None):
    response = requests.put(
        url=pixel_endpoint(date or today_string()),
        json={"quantity": quantity},
        headers=auth_headers(),
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def delete_pixel(date=None):
    response = requests.delete(
        url=pixel_endpoint(date or today_string()),
        headers=auth_headers(),
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


def main():
    quantity = read_quantity()
    result = add_pixel(quantity)
    print(result.get("message", result))


if __name__ == "__main__":
    main()
