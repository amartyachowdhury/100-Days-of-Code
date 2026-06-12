const DOT_RADIUS = 10;
const DOT_SPACING = 50;
const DOTS_PER_ROW = 10;
const NUMBER_OF_DOTS = 100;

function randomColor() {
  return COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
}

function generatePainting() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const margin = (canvas.width - DOT_SPACING * (DOTS_PER_ROW - 1)) / 2;

  for (let dotCount = 1; dotCount <= NUMBER_OF_DOTS; dotCount += 1) {
    const row = Math.ceil(dotCount / DOTS_PER_ROW) - 1;
    const col = (dotCount - 1) % DOTS_PER_ROW;

    const x = margin + col * DOT_SPACING;
    const y = margin + row * DOT_SPACING;

    ctx.beginPath();
    ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = randomColor();
    ctx.fill();
  }
}

generatePainting();
