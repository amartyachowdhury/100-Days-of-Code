import json
from pathlib import Path
from random import choice, randint, shuffle
import tkinter as tk
from tkinter import messagebox

import pyperclip

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data.json"
LOGO_FILE = BASE_DIR / "logo.png"

LETTERS = list("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
NUMBERS = list("0123456789")
SYMBOLS = list("!#$%&()*+")


def generate_password():
    password_letters = [choice(LETTERS) for _ in range(randint(8, 10))]
    password_symbols = [choice(SYMBOLS) for _ in range(randint(2, 4))]
    password_numbers = [choice(NUMBERS) for _ in range(randint(2, 4))]

    password_list = password_letters + password_symbols + password_numbers
    shuffle(password_list)
    return "".join(password_list)


def load_data():
    if not DATA_FILE.exists():
        return {}

    with DATA_FILE.open("r", encoding="utf-8") as data_file:
        return json.load(data_file)


def save_data(data):
    with DATA_FILE.open("w", encoding="utf-8") as data_file:
        json.dump(data, data_file, indent=4)


def main():
    def on_generate_password():
        password = generate_password()
        password_entry.delete(0, tk.END)
        password_entry.insert(0, password)
        pyperclip.copy(password)

    def save():
        website = website_entry.get().strip()
        email = email_entry.get().strip()
        password = password_entry.get().strip()

        if not website or not password:
            messagebox.showinfo(
                title="Oops",
                message="Please make sure you haven't left any fields empty.",
            )
            return

        data = load_data()
        data[website] = {"email": email, "password": password}
        save_data(data)

        website_entry.delete(0, tk.END)
        password_entry.delete(0, tk.END)

    def find_password():
        website = website_entry.get().strip()
        if not website:
            messagebox.showinfo(title="Error", message="Enter a website to search.")
            return

        data = load_data()
        if website not in data:
            messagebox.showinfo(
                title="Error",
                message=f"No details for {website} exists.",
            )
            return

        entry = data[website]
        messagebox.showinfo(
            title=website,
            message=f"Email: {entry['email']}\nPassword: {entry['password']}",
        )

    window = tk.Tk()
    window.title("Password Manager")
    window.config(padx=50, pady=50)

    canvas = tk.Canvas(height=200, width=200)
    logo_img = tk.PhotoImage(file=LOGO_FILE)
    window.logo_img = logo_img
    canvas.create_image(100, 100, image=logo_img)
    canvas.grid(row=0, column=1)

    website_label = tk.Label(text="Website:")
    website_label.grid(row=1, column=0)
    email_label = tk.Label(text="Email/Username:")
    email_label.grid(row=2, column=0)
    password_label = tk.Label(text="Password:")
    password_label.grid(row=3, column=0)

    website_entry = tk.Entry(width=21)
    website_entry.grid(row=1, column=1)
    website_entry.focus()

    email_entry = tk.Entry(width=35)
    email_entry.grid(row=2, column=1, columnspan=2)
    email_entry.insert(0, "angela@gmail.com")

    password_entry = tk.Entry(width=21)
    password_entry.grid(row=3, column=1)

    search_button = tk.Button(text="Search", width=13, command=find_password)
    search_button.grid(row=1, column=2)

    generate_password_button = tk.Button(
        text="Generate Password",
        command=on_generate_password,
    )
    generate_password_button.grid(row=3, column=2)

    add_button = tk.Button(text="Add", width=36, command=save)
    add_button.grid(row=4, column=1, columnspan=2)

    window.mainloop()


if __name__ == "__main__":
    main()
