import random
from pathlib import Path

import pandas as pd
import tkinter as tk

BACKGROUND_COLOR = "#B1DDC6"
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
WORDS_FILE = DATA_DIR / "french_words.csv"
TO_LEARN_FILE = DATA_DIR / "words_to_learn.csv"
IMAGES_DIR = BASE_DIR / "images"


def load_words_to_learn():
    if TO_LEARN_FILE.exists():
        data = pd.read_csv(TO_LEARN_FILE)
        return data.to_dict(orient="records")

    data = pd.read_csv(WORDS_FILE)
    return data.to_dict(orient="records")


def save_words_to_learn(words):
    pd.DataFrame(words).to_csv(TO_LEARN_FILE, index=False)


def main():
    to_learn = load_words_to_learn()
    current_card = {}
    flip_timer = None

    window = tk.Tk()
    window.title("Flashy")
    window.config(padx=50, pady=50, bg=BACKGROUND_COLOR)

    canvas = tk.Canvas(width=800, height=526, bg=BACKGROUND_COLOR, highlightthickness=0)

    card_front_img = tk.PhotoImage(file=IMAGES_DIR / "card_front.png")
    card_back_img = tk.PhotoImage(file=IMAGES_DIR / "card_back.png")
    cross_image = tk.PhotoImage(file=IMAGES_DIR / "wrong.png")
    check_image = tk.PhotoImage(file=IMAGES_DIR / "right.png")
    window.images = (card_front_img, card_back_img, cross_image, check_image)

    card_background = canvas.create_image(400, 263, image=card_front_img)
    card_title = canvas.create_text(400, 150, text="", font=("Ariel", 40, "italic"))
    card_word = canvas.create_text(400, 263, text="", font=("Ariel", 60, "bold"))
    canvas.grid(row=0, column=0, columnspan=2)

    def flip_card():
        canvas.itemconfig(card_title, text="English", fill="white")
        canvas.itemconfig(card_word, text=current_card["English"], fill="white")
        canvas.itemconfig(card_background, image=card_back_img)

    def next_card():
        nonlocal current_card, flip_timer

        if flip_timer is not None:
            window.after_cancel(flip_timer)
            flip_timer = None

        if not to_learn:
            canvas.itemconfig(card_title, text="Complete", fill="black")
            canvas.itemconfig(card_word, text="No words left to learn", fill="black")
            canvas.itemconfig(card_background, image=card_front_img)
            return

        current_card = random.choice(to_learn)
        canvas.itemconfig(card_title, text="French", fill="black")
        canvas.itemconfig(card_word, text=current_card["French"], fill="black")
        canvas.itemconfig(card_background, image=card_front_img)
        flip_timer = window.after(3000, flip_card)

    def is_known():
        if current_card in to_learn:
            to_learn.remove(current_card)
            save_words_to_learn(to_learn)
        next_card()

    unknown_button = tk.Button(
        image=cross_image,
        highlightthickness=0,
        command=next_card,
        bg=BACKGROUND_COLOR,
        borderwidth=0,
    )
    unknown_button.grid(row=1, column=0)

    known_button = tk.Button(
        image=check_image,
        highlightthickness=0,
        command=is_known,
        bg=BACKGROUND_COLOR,
        borderwidth=0,
    )
    known_button.grid(row=1, column=1)

    next_card()
    window.mainloop()


if __name__ == "__main__":
    main()
