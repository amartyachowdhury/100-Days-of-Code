"""
Escaping the Maze — Reeborg-style maze simulation.

Use move(), turn_left(), turn_right(), front_is_clear(), right_is_clear(),
and at_goal() to navigate. Run this file to execute the wall-follower solution.
"""

MAZE = [
    "#######",
    "#S    #",
    "# ### #",
    "# #   #",
    "# ### #",
    "#    G#",
    "#######",
]

DIRECTIONS = [(-1, 0), (0, 1), (1, 0), (0, -1)]  # N, E, S, W


class Robot:
    def __init__(self, maze):
        self.maze = maze
        self.rows = len(maze)
        self.cols = len(maze[0])
        self.row = 0
        self.col = 0
        self.direction = 1  # start facing east
        self.steps = 0

        for r, line in enumerate(maze):
            for c, cell in enumerate(line):
                if cell == "S":
                    self.row, self.col = r, c
                if cell == "G":
                    self.goal = (r, c)

    def _in_bounds(self, row, col):
        return 0 <= row < self.rows and 0 <= col < self.cols

    def _is_wall(self, row, col):
        if not self._in_bounds(row, col):
            return True
        return self.maze[row][col] == "#"

    def _cell_ahead(self):
        dr, dc = DIRECTIONS[self.direction]
        return self.row + dr, self.col + dc

    def _cell_to_right(self):
        right_dir = (self.direction + 1) % 4
        dr, dc = DIRECTIONS[right_dir]
        return self.row + dr, self.col + dc

    def move(self):
        next_row, next_col = self._cell_ahead()
        if self._is_wall(next_row, next_col):
            return False
        self.row, self.col = next_row, next_col
        self.steps += 1
        return True

    def turn_left(self):
        self.direction = (self.direction - 1) % 4

    def turn_right(self):
        self.direction = (self.direction + 1) % 4

    def front_is_clear(self):
        row, col = self._cell_ahead()
        return not self._is_wall(row, col)

    def right_is_clear(self):
        row, col = self._cell_to_right()
        return not self._is_wall(row, col)

    def at_goal(self):
        return (self.row, self.col) == self.goal


robot = Robot(MAZE)


def move():
    return robot.move()


def turn_left():
    robot.turn_left()


def turn_right():
    robot.turn_right()


def front_is_clear():
    return robot.front_is_clear()


def right_is_clear():
    return robot.right_is_clear()


def at_goal():
    return robot.at_goal()


def solve_maze():
    """Right-hand wall follower (classic Reeborg maze solution)."""
    while not at_goal():
        if right_is_clear():
            turn_right()
            move()
        elif front_is_clear():
            move()
        else:
            turn_left()


def main():
    print("Welcome to Escaping the Maze!")
    print("Running wall-follower solution (Reeborg-style)...\n")
    solve_maze()
    if at_goal():
        print(f"You escaped the maze in {robot.steps} moves!")
    else:
        print("Could not reach the goal.")


if __name__ == "__main__":
    main()
