class MoneyMachine:
    CURRENCY = "$"

    COIN_VALUES = {
        "quarters": 0.25,
        "dimes": 0.10,
        "nickles": 0.05,
        "pennies": 0.01,
    }

    def __init__(self):
        self.profit = 0
        self.money_received = 0

    def report(self):
        """Print the current profit."""
        print(f"Money: {self.CURRENCY}{self.profit:.2f}")

    def _read_coin_count(self, coin):
        while True:
            try:
                return int(input(f"How many {coin}?: "))
            except ValueError:
                print("Please enter a valid whole number.")

    def process_coins(self):
        """Return the total calculated from coins inserted."""
        print("Please insert coins.")
        self.money_received = 0
        for coin in self.COIN_VALUES:
            self.money_received += self._read_coin_count(coin) * self.COIN_VALUES[coin]
        return self.money_received

    def make_payment(self, cost):
        """Return True when payment is accepted, or False if insufficient."""
        self.process_coins()
        if self.money_received >= cost:
            change = round(self.money_received - cost, 2)
            print(f"Here is {self.CURRENCY}{change} in change.")
            self.profit += cost
            self.money_received = 0
            return True
        print("Sorry that's not enough money. Money refunded.")
        self.money_received = 0
        return False
