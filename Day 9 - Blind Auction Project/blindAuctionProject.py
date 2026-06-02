from art import logo


def find_highest_bidder(bidding_record):
    # On a tie, the first bidder with the highest amount wins.
    highest_bid = 0
    winner = ""
    for bidder in bidding_record:
        bid_amount = bidding_record[bidder]
        if bid_amount > highest_bid:
            highest_bid = bid_amount
            winner = bidder
    print(f"The winner is {winner} with a bid of ${highest_bid}")


def read_bid():
    while True:
        try:
            return int(input("What is your bid?: $"))
        except ValueError:
            print("Please enter a valid number for your bid.")


def read_yes_no():
    while True:
        answer = input("Are there any other bidders? Type 'yes' or 'no'.\n").lower()
        if answer in ("yes", "no"):
            return answer
        print("Please type 'yes' or 'no'.")


def main():
    print(logo)
    bids = {}
    continue_bidding = True

    while continue_bidding:
        name = input("What is your name?: ")
        price = read_bid()
        bids[name] = price

        should_continue = read_yes_no()
        if should_continue == "no":
            continue_bidding = False
            find_highest_bidder(bids)
        else:
            print("\n" * 20)


if __name__ == "__main__":
    main()
