import requests

API_URL = "https://opentdb.com/api.php"


def fetch_question_data(amount=10, question_type="boolean"):
    response = requests.get(
        API_URL,
        params={"amount": amount, "type": question_type},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()["results"]
