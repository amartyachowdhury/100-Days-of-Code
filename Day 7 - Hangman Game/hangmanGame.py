import random

from hangman_art import logo, stages
from hangman_words import word_list


def play():
    chosen_word = random.choice(word_list)
    word_display = ["_"] * len(chosen_word)
    lives = 6
    guessed_letters = []

    print(logo)
    print(stages[lives])

    while "_" in word_display and lives > 0:
        guess = input("Guess a letter: ").lower()

        if guess in guessed_letters:
            print(f"You've already guessed {guess}")
            continue

        guessed_letters.append(guess)

        for position, letter in enumerate(chosen_word):
            if letter == guess:
                word_display[position] = letter

        print(f"{' '.join(word_display)}")

        if guess not in chosen_word:
            lives -= 1
            print(f"You guessed {guess}, that's not in the word. You lose a life.")
            print(stages[lives])
            print(f"****************************{lives}/6 LIVES LEFT****************************")

            if lives == 0:
                print(f"IT WAS {chosen_word.upper()}! YOU LOSE")
        elif "_" not in word_display:
            print("You win!")


if __name__ == "__main__":
    play()
