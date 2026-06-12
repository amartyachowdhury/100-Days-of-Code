const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const leftScoreElement = document.getElementById("leftScore");
const rightScoreElement = document.getElementById("rightScore");

const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 20;
const BALL_RADIUS = 10;
const BALL_SPEED = 4;

const paddles = {
  left: { x: 50, y: canvas.height / 2 - PADDLE_HEIGHT / 2 },
  right: { x: canvas.width - 50 - PADDLE_WIDTH, y: canvas.height / 2 - PADDLE_HEIGHT / 2 },
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: BALL_SPEED,
  dy: BALL_SPEED,
};

const scores = { left: 0, right: 0 };
const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

function updateScoreboard() {
  leftScoreElement.textContent = scores.left;
  rightScoreElement.textContent = scores.right;
}

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
}

function drawCenterLine() {
  ctx.setLineDash([12, 16]);
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawBoard() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawCenterLine();
  drawRect(paddles.left.x, paddles.left.y, PADDLE_WIDTH, PADDLE_HEIGHT, "#ffffff");
  drawRect(paddles.right.x, paddles.right.y, PADDLE_WIDTH, PADDLE_HEIGHT, "#ffffff");
  drawBall();
}

function clampPaddle(paddle) {
  paddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddle.y));
}

function movePaddle(side, direction) {
  const paddle = paddles[side];
  paddle.y += direction * PADDLE_SPEED;
  clampPaddle(paddle);
}

function updatePaddles() {
  if (keys.w) {
    movePaddle("left", -1);
  }
  if (keys.s) {
    movePaddle("left", 1);
  }
  if (keys.ArrowUp) {
    movePaddle("right", -1);
  }
  if (keys.ArrowDown) {
    movePaddle("right", 1);
  }
}

function resetBall(scorer) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = scorer === "left" ? BALL_SPEED : -BALL_SPEED;
  ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function intersectsPaddle(paddle) {
  return (
    ball.x - BALL_RADIUS < paddle.x + PADDLE_WIDTH &&
    ball.x + BALL_RADIUS > paddle.x &&
    ball.y - BALL_RADIUS < paddle.y + PADDLE_HEIGHT &&
    ball.y + BALL_RADIUS > paddle.y
  );
}

function tick() {
  updatePaddles();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y - BALL_RADIUS <= 0 || ball.y + BALL_RADIUS >= canvas.height) {
    ball.dy *= -1;
  }

  if (intersectsPaddle(paddles.left) && ball.dx < 0) {
    ball.dx = Math.abs(ball.dx);
    ball.x = paddles.left.x + PADDLE_WIDTH + BALL_RADIUS;
  }

  if (intersectsPaddle(paddles.right) && ball.dx > 0) {
    ball.dx = -Math.abs(ball.dx);
    ball.x = paddles.right.x - BALL_RADIUS;
  }

  if (ball.x > canvas.width) {
    scores.left += 1;
    updateScoreboard();
    resetBall("left");
  }

  if (ball.x < 0) {
    scores.right += 1;
    updateScoreboard();
    resetBall("right");
  }

  drawBoard();
}

function handleKeydown(event) {
  if (event.key in keys) {
    keys[event.key] = true;
    event.preventDefault();
  }
}

function handleKeyup(event) {
  if (event.key in keys) {
    keys[event.key] = false;
  }
}

document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);
updateScoreboard();
setInterval(tick, 1000 / 60);
