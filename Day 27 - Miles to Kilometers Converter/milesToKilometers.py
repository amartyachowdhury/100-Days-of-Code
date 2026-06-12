MILES_TO_KM = 1.609344


def miles_to_kilometers(miles):
    return miles * MILES_TO_KM


def main():
    print("Welcome to the Miles to Kilometers Converter!")

    try:
        miles = float(input("Enter miles: "))
    except ValueError:
        print("Please enter a valid number.")
        return

    kilometers = miles_to_kilometers(miles)
    print(f"{miles:g} miles = {kilometers:.2f} kilometers")


if __name__ == "__main__":
    main()
