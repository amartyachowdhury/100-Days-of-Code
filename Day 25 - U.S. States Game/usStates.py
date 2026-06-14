from pathlib import Path

import pandas as pd
import turtle

BASE_DIR = Path(__file__).resolve().parent
IMAGE_FILE = BASE_DIR / "blank_states_img.gif"
STATES_FILE = BASE_DIR / "50_states.csv"
LEARNING_FILE = BASE_DIR / "states_to_learn.csv"


def main():
    screen = turtle.Screen()
    screen.title("U.S. States Game")
    screen.addshape(str(IMAGE_FILE))
    turtle.shape(str(IMAGE_FILE))

    data = pd.read_csv(STATES_FILE)
    all_states = data.state.to_list()
    guessed_states = []

    while len(guessed_states) < 50:
        answer_state = screen.textinput(
            title=f"{len(guessed_states)}/50 States Correct",
            prompt="What's another state's name?",
        )
        if answer_state is None:
            break

        answer_state = answer_state.strip().title()
        if answer_state == "Exit":
            missing_states = [state for state in all_states if state not in guessed_states]
            pd.DataFrame(missing_states).to_csv(LEARNING_FILE, index=False, header=False)
            break

        if answer_state in all_states and answer_state not in guessed_states:
            guessed_states.append(answer_state)
            state_data = data[data.state == answer_state]
            label = turtle.Turtle()
            label.hideturtle()
            label.penup()
            label.goto(state_data.x.item(), state_data.y.item())
            label.write(answer_state)

    screen.exitonclick()


if __name__ == "__main__":
    main()
