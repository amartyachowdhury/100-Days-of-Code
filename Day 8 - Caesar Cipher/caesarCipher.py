import art

alphabet = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
    "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
]


def caesar(original_text, shift_amount, encode_or_decode):
    shift_amount %= len(alphabet)
    if encode_or_decode == "decode":
        shift_amount *= -1

    output_text = ""
    for letter in original_text:
        if letter not in alphabet:
            output_text += letter
        else:
            shifted_position = alphabet.index(letter) + shift_amount
            shifted_position %= len(alphabet)
            output_text += alphabet[shifted_position]
    return output_text


def read_direction():
    while True:
        direction = input("Type 'encode' to encrypt, type 'decode' to decrypt:\n").lower()
        if direction in ("encode", "decode"):
            return direction
        print("Please type 'encode' or 'decode'.")


def read_shift():
    while True:
        try:
            shift = int(input("Type the shift number:\n"))
            return shift
        except ValueError:
            print("Please enter a valid number for the shift.")


def play_round():
    direction = read_direction()
    text = input("Type your message:\n").lower()
    shift = read_shift()
    result = caesar(original_text=text, shift_amount=shift, encode_or_decode=direction)
    print(f"Here is the {direction}d result: {result}")


def main():
    print(art.logo)
    should_continue = True

    while should_continue:
        play_round()
        restart = input("Type 'yes' if you want to go again. Otherwise, type 'no'.\n").lower()
        if restart == "no":
            should_continue = False
            print("Goodbye")


if __name__ == "__main__":
    main()
