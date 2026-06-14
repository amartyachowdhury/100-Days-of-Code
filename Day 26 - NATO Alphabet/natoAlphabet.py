from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
NATO_FILE = BASE_DIR / "nato_phonetic_alphabet.csv"


def load_phonetic_dict():
    data = pd.read_csv(NATO_FILE)
    return {row.letter: row.code for (_, row) in data.iterrows()}


def encode_word(word, phonetic_dict):
    letters = [letter for letter in word.upper() if letter.isalpha()]
    if not letters:
        raise ValueError("Enter at least one letter.")

    output_list = []
    for letter in letters:
        if letter not in phonetic_dict:
            raise KeyError(letter)
        output_list.append(phonetic_dict[letter])

    return output_list


def main():
    phonetic_dict = load_phonetic_dict()
    word = input("Enter a word: ").strip()

    try:
        output_list = encode_word(word, phonetic_dict)
    except ValueError as error:
        print(error)
        return
    except KeyError as letter:
        print(f"'{letter.args[0]}' is not in the NATO phonetic alphabet.")
        return

    print(" ".join(output_list))


if __name__ == "__main__":
    main()
