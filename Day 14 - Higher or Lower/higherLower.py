import random

from art import logo, vs
from game_data import data


def format_data(account):
    """Return a printable description of an account."""
    account_name = account["name"]
    account_descr = account["description"]
    account_country = account["country"]
    return f"{account_name}, a {account_descr}, from {account_country}"


def check_answer(user_guess, a_followers, b_followers):
    """Return True if the user guessed the account with more followers."""
    if a_followers > b_followers:
        return user_guess == "a"
    return user_guess == "b"


def pick_account_b(account_a):
    """Pick a different account with a different follower count than account_a."""
    account_b = random.choice(data)
    while (
        account_b == account_a
        or account_b["follower_count"] == account_a["follower_count"]
    ):
        account_b = random.choice(data)
    return account_b


def read_guess():
    while True:
        guess = input("Who has more followers? Type 'A' or 'B': ").lower()
        if guess in ("a", "b"):
            return guess
        print("Please type 'A' or 'B'.")


def read_play_again():
    while True:
        choice = input("Play again? Type 'y' or 'n': ").lower()
        if choice == "y":
            return True
        if choice == "n":
            return False
        print("Please type 'y' or 'n'.")


def play_game():
    print(logo)
    score = 0
    account_b = random.choice(data)

    while True:
        account_a = account_b
        account_b = pick_account_b(account_a)

        print(f"Compare A: {format_data(account_a)}.")
        print(vs)
        print(f"Against B: {format_data(account_b)}.")

        guess = read_guess()

        print("\n" * 20)
        print(logo)

        a_follower_count = account_a["follower_count"]
        b_follower_count = account_b["follower_count"]
        is_correct = check_answer(guess, a_follower_count, b_follower_count)

        if is_correct:
            score += 1
            print(f"You're right! Current score: {score}")
        else:
            print(f"Sorry, that's wrong. Final score: {score}.")
            print(f"{account_a['name']} has {a_follower_count}M followers.")
            print(f"{account_b['name']} has {b_follower_count}M followers.")
            return


def main():
    while True:
        play_game()
        if not read_play_again():
            print("Goodbye!")
            break
        print("\n" * 20)


if __name__ == "__main__":
    main()
