from random import randint

from art import logo

EASY_LEVEL_TURNS = 10
HARD_LEVEL_TURNS = 5


def check_answer(user_guess, actual_answer, turns):
    """Check guess against answer. Return remaining turns, or None if correct."""
    if user_guess > actual_answer:
        print("Too high.")
        return turns - 1
    if user_guess < actual_answer:
        print("Too low.")
        return turns - 1

    print(f"You got it! The answer was {actual_answer}")
    return None


def set_difficulty():
    while True:
        level = input("Choose a difficulty. Type 'easy' or 'hard': ").lower()
        if level == "easy":
            return EASY_LEVEL_TURNS
        if level == "hard":
            return HARD_LEVEL_TURNS
        print("Please type 'easy' or 'hard'.")


def read_guess():
    while True:
        try:
            return int(input("Make a guess: "))
        except ValueError:
            print("Please enter a valid whole number.")


def read_play_again():
    while True:
        choice = input("Play again? Type 'y' or 'n': ").lower()
        if choice == "y":
            return True
        if choice == "n":
            return False
        print("Please type 'y' or 'n'.")


def game():
    print(logo)
    print("Welcome to the Number Guessing Game!")
    print("I'm thinking of a number between 1 and 100.")
    answer = randint(1, 100)
    turns = set_difficulty()

    while True:
        print(f"You have {turns} attempts remaining to guess the number.")
        guess = read_guess()
        remaining = check_answer(guess, answer, turns)

        if remaining is None:
            return

        turns = remaining
        if turns == 0:
            print(f"You've run out of guesses, you lose. The answer was {answer}.")
            return

        print("Guess again.")


def main():
    while True:
        game()
        if not read_play_again():
            print("Goodbye!")
            break
        print("\n" * 20)


if __name__ == "__main__":
    main()
