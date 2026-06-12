import time

from car_manager import CarManager
from player import Player
from scoreboard import Scoreboard
from turtle import Screen


def main():
    screen = Screen()
    screen.setup(width=600, height=600)
    screen.bgcolor("#2b2b2b")
    screen.tracer(0)

    player = Player()
    car_manager = CarManager()
    scoreboard = Scoreboard()

    screen.listen()
    screen.onkey(player.go_up, "Up")

    game_is_on = True
    while game_is_on:
        time.sleep(0.1)
        screen.update()

        car_manager.create_car()
        car_manager.move_cars()

        for car in car_manager.all_cars:
            if car.distance(player) < 20:
                game_is_on = False
                scoreboard.game_over()
                break

        if game_is_on and player.is_at_finish_line():
            player.go_to_start()
            car_manager.level_up()
            scoreboard.increase_level()

    screen.exitonclick()


if __name__ == "__main__":
    main()
