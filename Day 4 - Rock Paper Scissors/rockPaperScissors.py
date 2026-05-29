import random

rock = '''
    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)
'''

paper = '''
    _______
---'   ____)____
          ______)
          _______)
         _______)
---.__________)
'''

scissors = '''
    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)
'''

game_images = [rock, paper, scissors]


def get_result(user_choice, computer_choice):
    if user_choice == 0 and computer_choice == 2:
        return "You win!"
    if computer_choice == 0 and user_choice == 2:
        return "You lose!"
    if computer_choice > user_choice:
        return "You lose!"
    if user_choice > computer_choice:
        return "You win!"
    if computer_choice == user_choice:
        return "It's a draw!"
    return ""


def play_round():
    try:
        user_choice = int(
            input("What do you choose? Type 0 for Rock, 1 for Paper or 2 for Scissors.\n")
        )
    except ValueError:
        print("You typed an invalid input. You lose!")
        return

    if user_choice < 0 or user_choice > 2:
        print("You typed an invalid number. You lose!")
        return

    print(game_images[user_choice])

    computer_choice = random.randint(0, 2)
    print("Computer chose:")
    print(game_images[computer_choice])
    print(get_result(user_choice, computer_choice))


def main():
    while True:
        play_round()
        again = input("Play again? Type 'y' or 'n':\n").lower()
        if again != "y":
            break


if __name__ == "__main__":
    main()
