const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;
const TICK_MS = 100;

let snake;
let direction;
let pendingDirection;
let food;
let score;
let gameLoopId;

function createStartingSnake() {
  const centerY = Math.floor(TILE_COUNT / 2);
  const centerX = Math.floor(TILE_COUNT / 2);
  return [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
}

function randomFoodPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
    };
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));
  return position;
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
}

function drawBoard() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    drawCell(segment.x, segment.y, index === 0 ? "#ffffff" : "#cccccc");
  });

  drawCell(food.x, food.y, "#4dabf7");
}

function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

function endGame() {
  clearInterval(gameLoopId);
  gameLoopId = null;
  gameOverElement.hidden = false;
}

function tick() {
  direction = pendingDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall =
    head.x < 0 ||
    head.x >= TILE_COUNT ||
    head.y < 0 ||
    head.y >= TILE_COUNT;

  const hitTail = snake.some((segment) => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitTail) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    updateScore();
    food = randomFoodPosition();
  } else {
    snake.pop();
  }

  drawBoard();
}

function queueDirection(x, y) {
  if (!gameLoopId) {
    return;
  }

  const activeDirection = pendingDirection;
  if (x === -activeDirection.x && y === -activeDirection.y) {
    return;
  }

  pendingDirection = { x, y };
}

function handleKeydown(event) {
  const keyMap = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1],
    s: [0, 1],
    a: [-1, 0],
    d: [1, 0],
  };

  const move = keyMap[event.key];
  if (move) {
    event.preventDefault();
    queueDirection(move[0], move[1]);
  }
}

function startGame() {
  if (gameLoopId) {
    clearInterval(gameLoopId);
  }

  snake = createStartingSnake();
  direction = { x: 1, y: 0 };
  pendingDirection = { x: 1, y: 0 };
  food = randomFoodPosition();
  score = 0;
  gameOverElement.hidden = true;
  updateScore();
  drawBoard();
  gameLoopId = setInterval(tick, TICK_MS);
}

document.addEventListener("keydown", handleKeydown);
startGame();
