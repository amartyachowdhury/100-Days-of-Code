import random

letters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z',
]
numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
symbols = ['!', '#', '$', '%', '&', '(', ')', '*', '+']


def read_non_negative_int(prompt):
    while True:
        try:
            value = int(input(prompt))
        except ValueError:
            print("Please enter a valid number.")
            continue
        if value < 0:
            print("Please enter a number that is 0 or greater.")
            continue
        return value


def generate_password(nr_letters, nr_symbols, nr_numbers):
    password_list = []
    for _ in range(nr_letters):
        password_list.append(random.choice(letters))
    for _ in range(nr_symbols):
        password_list.append(random.choice(symbols))
    for _ in range(nr_numbers):
        password_list.append(random.choice(numbers))
    random.shuffle(password_list)
    return "".join(password_list)


def play_round():
    nr_letters = read_non_negative_int(
        "How many letters would you like in your password?\n"
    )
    nr_symbols = read_non_negative_int("How many symbols would you like?\n")
    nr_numbers = read_non_negative_int("How many numbers would you like?\n")
    password = generate_password(nr_letters, nr_symbols, nr_numbers)
    print(f"Your password is: {password}")


def main():
    print("Welcome to the PyPassword Generator!")
    while True:
        play_round()
        again = input("Generate another password? Type 'y' or 'n':\n").lower()
        if again != "y":
            break


if __name__ == "__main__":
    main()
