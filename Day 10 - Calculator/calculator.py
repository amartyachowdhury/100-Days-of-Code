import art


def add(n1, n2):
    return n1 + n2


def subtract(n1, n2):
    return n1 - n2


def multiply(n1, n2):
    return n1 * n2


def divide(n1, n2):
    if n2 == 0:
        raise ZeroDivisionError("Cannot divide by zero.")
    return n1 / n2


operations = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
}


def read_number(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Please enter a valid number.")


def read_operation():
    while True:
        for symbol in operations:
            print(symbol)
        operation_symbol = input("Pick an operation: ")
        if operation_symbol in operations:
            return operation_symbol
        print("Please pick a valid operation (+, -, *, /).")


def calculate(num1, operation_symbol, num2):
    try:
        return operations[operation_symbol](num1, num2)
    except ZeroDivisionError as error:
        print(error)
        return None


def run_calculation():
    num1 = read_number("What is the first number?: ")

    while True:
        operation_symbol = read_operation()
        num2 = read_number("What is the next number?: ")
        answer = calculate(num1, operation_symbol, num2)

        if answer is None:
            continue

        print(f"{num1} {operation_symbol} {num2} = {answer}")

        choice = input(
            f"Type 'y' to continue calculating with {answer}, "
            f"or type 'n' to start a new calculation: "
        ).lower()

        if choice == "y":
            num1 = answer
        else:
            return


def main():
    print(art.logo)
    while True:
        run_calculation()
        print("\n" * 20)


if __name__ == "__main__":
    main()
