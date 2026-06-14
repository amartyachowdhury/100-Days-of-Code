from pathlib import Path

PLACEHOLDER = "[name]"
BASE_DIR = Path(__file__).resolve().parent
NAMES_FILE = BASE_DIR / "Input" / "Names" / "invited_names.txt"
LETTER_FILE = BASE_DIR / "Input" / "Letters" / "starting_letter.txt"
OUTPUT_DIR = BASE_DIR / "Output" / "ReadyToSend"


def merge_letters():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    names = NAMES_FILE.read_text().splitlines()
    letter_template = LETTER_FILE.read_text()

    for name in names:
        stripped_name = name.strip()
        if not stripped_name:
            continue

        merged_letter = letter_template.replace(PLACEHOLDER, stripped_name)
        output_file = OUTPUT_DIR / f"letter_for_{stripped_name}.txt"
        output_file.write_text(merged_letter)
        print(f"Generated: {output_file.name}")


def main():
    merge_letters()


if __name__ == "__main__":
    main()
