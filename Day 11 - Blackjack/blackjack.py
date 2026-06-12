import random

from art import logo


def deal_card():
    """Returns a random card from the deck."""
    cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
    return random.choice(cards)


def calculate_score(cards):
    """Return the score calculated from the cards without mutating the original hand."""
    cards_copy = cards.copy()

    if sum(cards_copy) == 21 and len(cards_copy) == 2:
        return 0

    while 11 in cards_copy and sum(cards_copy) > 21:
        cards_copy.remove(11)
        cards_copy.append(1)

    return sum(cards_copy)


def compare(u_score, c_score):
    """Compare the user score against the computer score."""
    if u_score == c_score:
        return "Draw 🙃"
    if c_score == 0:
        return "Lose, opponent has Blackjack 😱"
    if u_score == 0:
        return "Win with a Blackjack 😎"
    if u_score > 21:
        return "You went over. You lose 😭"
    if c_score > 21:
        return "Opponent went over. You win 😁"
    if u_score > c_score:
        return "You win 😃"
    return "You lose 😤"


def read_hit_or_stand():
    while True:
        choice = input("Type 'y' to get another card, type 'n' to pass: ").lower()
        if choice in ("y", "n"):
            return choice
        print("Please type 'y' or 'n'.")


def read_play_again():
    while True:
        choice = input("Do you want to play a game of Blackjack? Type 'y' or 'n': ").lower()
        if choice == "y":
            return True
        if choice == "n":
            return False
        print("Please type 'y' or 'n'.")


def play_game():
    print(logo)
    user_cards = []
    computer_cards = []
    is_game_over = False

    for _ in range(2):
        user_cards.append(deal_card())
        computer_cards.append(deal_card())

    while not is_game_over:
        user_score = calculate_score(user_cards)
        computer_score = calculate_score(computer_cards)
        print(f"Your cards: {user_cards}, current score: {user_score}")
        print(f"Computer's first card: {computer_cards[0]}")

        if user_score == 0 or computer_score == 0 or user_score > 21:
            is_game_over = True
        elif read_hit_or_stand() == "y":
            user_cards.append(deal_card())
        else:
            is_game_over = True

    user_score = calculate_score(user_cards)
    computer_score = calculate_score(computer_cards)

    while computer_score != 0 and computer_score < 17:
        computer_cards.append(deal_card())
        computer_score = calculate_score(computer_cards)

    print(f"Your final hand: {user_cards}, final score: {user_score}")
    print(f"Computer's final hand: {computer_cards}, final score: {computer_score}")
    print(compare(user_score, computer_score))


def main():
    while read_play_again():
        print("\n" * 20)
        play_game()


if __name__ == "__main__":
    main()
