import os
import random
import smtplib
from datetime import datetime
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
BIRTHDAYS_FILE = BASE_DIR / "birthdays.csv"
TEMPLATES_DIR = BASE_DIR / "letter_templates"

MY_EMAIL = os.environ.get("MY_EMAIL", "YOUR EMAIL")
MY_PASSWORD = os.environ.get("MY_PASSWORD", "YOUR PASSWORD")
SMTP_SERVER = os.environ.get("SMTP_SERVER", "YOUR EMAIL PROVIDER SMTP SERVER ADDRESS")


def load_birthdays():
    data = pd.read_csv(BIRTHDAYS_FILE)
    return {(row.month, row.day): row for (_, row) in data.iterrows()}


def build_letter(name):
    template_file = TEMPLATES_DIR / f"letter_{random.randint(1, 3)}.txt"
    contents = template_file.read_text(encoding="utf-8")
    return contents.replace("[NAME]", name)


def send_birthday_email(email, name):
    letter = build_letter(name)

    with smtplib.SMTP(SMTP_SERVER) as connection:
        connection.starttls()
        connection.login(MY_EMAIL, MY_PASSWORD)
        connection.sendmail(
            from_addr=MY_EMAIL,
            to_addrs=email,
            msg=f"Subject:Happy Birthday!\n\n{letter}",
        )


def main():
    today_tuple = (datetime.now().month, datetime.now().day)
    birthdays_dict = load_birthdays()

    if today_tuple not in birthdays_dict:
        print("No birthdays today.")
        return

    birthday_person = birthdays_dict[today_tuple]
    send_birthday_email(birthday_person.email, birthday_person.name)
    print(f"Birthday email sent to {birthday_person.name}.")


if __name__ == "__main__":
    main()
