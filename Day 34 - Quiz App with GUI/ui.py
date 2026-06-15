from pathlib import Path

import tkinter as tk

from quiz_brain import QuizBrain

THEME_COLOR = "#375362"
IMAGES_DIR = Path(__file__).resolve().parent / "images"


class QuizInterface:

    def __init__(self, quiz_brain: QuizBrain):
        self.quiz = quiz_brain

        self.window = tk.Tk()
        self.window.title("Quizzler")
        self.window.config(padx=20, pady=20, bg=THEME_COLOR)

        self.score_label = tk.Label(text="Score: 0", fg="white", bg=THEME_COLOR)
        self.score_label.grid(row=0, column=1)

        self.canvas = tk.Canvas(width=300, height=250, bg="white")
        self.question_text = self.canvas.create_text(
            150,
            125,
            width=280,
            text="Loading question...",
            fill=THEME_COLOR,
            font=("Arial", 20, "italic"),
        )
        self.canvas.grid(row=1, column=0, columnspan=2, pady=50)

        self.true_image = tk.PhotoImage(file=IMAGES_DIR / "true.png")
        self.false_image = tk.PhotoImage(file=IMAGES_DIR / "false.png")

        self.true_button = tk.Button(
            image=self.true_image,
            highlightthickness=0,
            command=self.true_pressed,
        )
        self.true_button.grid(row=2, column=0)

        self.false_button = tk.Button(
            image=self.false_image,
            highlightthickness=0,
            command=self.false_pressed,
        )
        self.false_button.grid(row=2, column=1)

        self.get_next_question()
        self.window.mainloop()

    def set_buttons_state(self, state):
        self.true_button.config(state=state)
        self.false_button.config(state=state)

    def get_next_question(self):
        self.canvas.config(bg="white")
        if self.quiz.still_has_questions():
            self.set_buttons_state("normal")
            self.score_label.config(text=f"Score: {self.quiz.score}")
            question_text = self.quiz.next_question()
            self.canvas.itemconfig(self.question_text, text=question_text)
        else:
            self.canvas.itemconfig(
                self.question_text,
                text="You've reached the end of the quiz.",
            )
            self.set_buttons_state("disabled")

    def true_pressed(self):
        self.set_buttons_state("disabled")
        self.give_feedback(self.quiz.check_answer("True"))

    def false_pressed(self):
        self.set_buttons_state("disabled")
        self.give_feedback(self.quiz.check_answer("False"))

    def give_feedback(self, is_right):
        self.canvas.config(bg="green" if is_right else "red")
        self.window.after(1000, self.get_next_question)
