const MAZE = [
    "#######",
    "#S    #",
    "# ### #",
    "# #   #",
    "# ### #",
    "#    G#",
    "#######",
];

const DIRECTIONS = [
    { dr: -1, dc: 0, angle: 0 },
    { dr: 0, dc: 1, angle: 90 },
    { dr: 1, dc: 0, angle: 180 },
    { dr: 0, dc: -1, angle: 270 },
];

const state = {
    row: 0,
    col: 0,
    direction: 1,
    goal: null,
    steps: 0,
    won: false,
};

function initState() {
    state.direction = 1;
    state.steps = 0;
    state.won = false;

    for (let r = 0; r < MAZE.length; r++) {
        for (let c = 0; c < MAZE[r].length; c++) {
            if (MAZE[r][c] === "S") {
                state.row = r;
                state.col = c;
            }
            if (MAZE[r][c] === "G") {
                state.goal = { row: r, col: c };
            }
        }
    }
}

function isWall(row, col) {
    if (row < 0 || col < 0 || row >= MAZE.length || col >= MAZE[r].length) {
        return true;
    }
    return MAZE[row][col] === "#";
}

function cellAhead() {
    const { dr, dc } = DIRECTIONS[state.direction];
    return { row: state.row + dr, col: state.col + dc };
}

function cellToRight() {
    const rightDir = (state.direction + 1) % 4;
    const { dr, dc } = DIRECTIONS[rightDir];
    return { row: state.row + dr, col: state.col + dc };
}

function atGoal() {
    return state.row === state.goal.row && state.col === state.goal.col;
}

function frontIsClear() {
    const next = cellAhead();
    return !isWall(next.row, next.col);
}

function rightIsClear() {
    const next = cellToRight();
    return !isWall(next.row, next.col);
}

function move() {
    if (state.won) {
        return false;
    }
    const next = cellAhead();
    if (isWall(next.row, next.col)) {
        setStatus("Can't move — wall ahead!");
        render();
        return false;
    }
    state.row = next.row;
    state.col = next.col;
    state.steps += 1;
    checkWin();
    render();
    return true;
}

function turnLeft() {
    if (state.won) {
        return;
    }
    state.direction = (state.direction - 1 + 4) % 4;
    setStatus("Turned left.");
    render();
}

function turnRight() {
    if (state.won) {
        return;
    }
    state.direction = (state.direction + 1) % 4;
    setStatus("Turned right.");
    render();
}

function checkWin() {
    if (atGoal()) {
        state.won = true;
        setStatus(`You escaped the maze in ${state.steps} moves!`, true);
    } else {
        setStatus(`Steps: ${state.steps}. Keep going!`);
    }
}

function setStatus(message, isWin) {
    const status = document.getElementById("status");
    status.textContent = message;
    status.className = isWin ? "win" : "";
}

function resetMaze() {
    initState();
    setStatus("Find your way to the goal!");
    render();
}

function runSolution() {
    resetMaze();
    const maxSteps = 500;
    let count = 0;

    const interval = setInterval(() => {
        if (atGoal() || count >= maxSteps) {
            clearInterval(interval);
            if (!atGoal()) {
                setStatus("Solution stopped — goal not reached.");
            }
            render();
            return;
        }

        if (rightIsClear()) {
            turnRight();
            move();
        } else if (frontIsClear()) {
            move();
        } else {
            turnLeft();
        }
        count += 1;
        render();
    }, 350);
}

function runCodeLines() {
    const code = document.getElementById("code").value;
    const lines = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && !line.startsWith("while") && !line.startsWith("if") && !line.startsWith("elif") && !line.startsWith("else"));

    let index = 0;

    function runNext() {
        if (state.won || index >= lines.length) {
            render();
            return;
        }

        const line = lines[index];
        index += 1;

        if (line === "move()") {
            move();
        } else if (line === "turn_left()") {
            turnLeft();
        } else if (line === "turn_right()") {
            turnRight();
        }

        setTimeout(runNext, 400);
    }

    resetMaze();
    runNext();
}

function render() {
    const mazeEl = document.getElementById("maze");
    mazeEl.innerHTML = "";
    mazeEl.style.gridTemplateColumns = `repeat(${MAZE[0].length}, var(--cell-size))`;

    for (let r = 0; r < MAZE.length; r++) {
        for (let c = 0; c < MAZE[r].length; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";

            const ch = MAZE[r][c];
            if (ch === "#") {
                cell.classList.add("wall");
            } else {
                cell.classList.add("path");
            }
            if (ch === "G") {
                cell.classList.add("goal");
                cell.textContent = "🏠";
            }

            if (r === state.row && c === state.col) {
                const robot = document.createElement("div");
                robot.className = "robot";
                robot.style.transform = `rotate(${DIRECTIONS[state.direction].angle}deg)`;
                robot.setAttribute("aria-label", "Robot");
                robot.textContent = "🤖";
                cell.appendChild(robot);
            }

            mazeEl.appendChild(cell);
        }
    }
}

initState();
render();
