import time

WORK_MINUTES = 25
SHORT_BREAK_MINUTES = 5
LONG_BREAK_MINUTES = 20

SESSIONS = {
    "1": ("Work", WORK_MINUTES),
    "2": ("Short Break", SHORT_BREAK_MINUTES),
    "3": ("Long Break", LONG_BREAK_MINUTES),
}


def format_time(total_seconds):
    minutes, seconds = divmod(total_seconds, 60)
    return f"{minutes:02d}:{seconds:02d}"


def countdown(minutes, session_name):
    total_seconds = minutes * 60

    try:
        for remaining in range(total_seconds, 0, -1):
            print(f"\r{session_name}: {format_time(remaining)}", end="", flush=True)
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nTimer stopped.")
        return

    print(f"\n{session_name} complete!")


def main():
    print("Welcome to the Pomodoro Timer!")
    print("1. Work (25 minutes)")
    print("2. Short break (5 minutes)")
    print("3. Long break (20 minutes)")

    choice = input("Choose a session (1-3): ").strip()
    session = SESSIONS.get(choice)

    if not session:
        print("Invalid choice. Please enter 1, 2, or 3.")
        return

    session_name, minutes = session
    countdown(minutes, session_name)


if __name__ == "__main__":
    main()
