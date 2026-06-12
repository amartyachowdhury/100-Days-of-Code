const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const levelElement = document.getElementById("level");
const gameOverElement = document.getElementById("gameOver");

const TICK_MS = 100;
const PLAYER_SIZE = 24;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 20;
const MOVE_DISTANCE = 16;
const START_Y = 520;
const FINISH_Y = 60;
const SPEED_INCREMENT = 2;
const COLORS = ["#e94560", "#ff6b35", "#ffd166", "#06d6a0", "#4dabf7", "#9b5de5"];

let player;
let cars;
let level;
let carSpeed;
let gameLoopId;

function updateLevel() {
  levelElement.textContent = `Level: ${level}`;
}

function resetPlayer() {
  player = { x: canvas.width / 2, y: START_Y };
}

function drawPlayer() {
  ctx.fillStyle = "#06d6a0";
  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawCar(car) {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x - CAR_WIDTH / 2, car.y - CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
}

function drawFinishLine() {
  ctx.strokeStyle = "#ffffff";
  ctx.setLineDash([12, 12]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, FINISH_Y);
  ctx.lineTo(canvas.width, FINISH_Y);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawBoard() {
  ctx.fillStyle = "#2b2b2b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawFinishLine();
  cars.forEach(drawCar);
  drawPlayer();
}

function spawnCar() {
  if (Math.random() < 1 / 6) {
    cars.push({
      x: canvas.width + CAR_WIDTH,
      y: FINISH_Y + 40 + Math.random() * (START_Y - FINISH_Y - 80),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
}

function collidesWithCar(car) {
  return (
    Math.abs(player.x - car.x) < PLAYER_SIZE / 2 + CAR_WIDTH / 2 &&
    Math.abs(player.y - car.y) < PLAYER_SIZE / 2 + CAR_HEIGHT / 2
  );
}

function endGame() {
  clearInterval(gameLoopId);
  gameLoopId = null;
  gameOverElement.classList.add("is-visible");
}

function checkCollisions() {
  if (cars.some(collidesWithCar)) {
    endGame();
    return false;
  }
  return true;
}

function checkLevelComplete() {
  if (player.y <= FINISH_Y) {
    level += 1;
    carSpeed += SPEED_INCREMENT;
    updateLevel();
    resetPlayer();
  }
}

function movePlayerUp() {
  if (!gameLoopId) {
    return;
  }

  player.y = Math.max(FINISH_Y, player.y - MOVE_DISTANCE);

  if (!checkCollisions()) {
    return;
  }

  checkLevelComplete();
  drawBoard();
}

function tick() {
  spawnCar();

  cars.forEach((car) => {
    car.x -= carSpeed;
  });
  cars = cars.filter((car) => car.x > -CAR_WIDTH);

  if (!checkCollisions()) {
    return;
  }

  checkLevelComplete();
  drawBoard();
}

function handleKeydown(event) {
  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    event.preventDefault();
    movePlayerUp();
  }
}

function startGame() {
  if (gameLoopId) {
    clearInterval(gameLoopId);
  }

  level = 1;
  carSpeed = 5;
  cars = [];
  resetPlayer();
  gameOverElement.classList.remove("is-visible");
  updateLevel();
  drawBoard();
  gameLoopId = setInterval(tick, TICK_MS);
}

document.addEventListener("keydown", handleKeydown);
startGame();
