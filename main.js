const fractalSelect = document.getElementById("fractal-select");
const depthSlider = document.getElementById("depthSlider");
const info = document.getElementById("info");

const WIDTH = window.innerWidth * 0.8;
const HEIGHT = window.innerHeight * 0.7;
const MIDPOINT = WIDTH / 2;

const p = new p5((p) => {
  p.setup = setup;
  p.draw = drawFractal;
});

function setup() {
  p.createCanvas(WIDTH, HEIGHT);
  p.background(255);
  p.noLoop();
}

function drawLine(start, end, y) {
  p.stroke(randomRGB());
  p.strokeWeight(4);
  p.line(start, y, end, y);
}

function drawCantorSet(start, end, y, depth = 0) {
  if (depth >= depthSlider.value) {
    drawLine(start, end, y);
    return;
  }
  const third = (end - start) / 3;
  drawCantorSet(start, start + third, y + 20, depth + 1);
  drawCantorSet(start + 2 * third, end, y + 20, depth + 1);
  drawLine(start, end, y);
}

function drawTriangle(x, y, size, color) {
  const height = (Math.sqrt(3) / 2) * size;
  p.fill(color);
  p.triangle(x, y, x - size / 2, y + height, x + size / 2, y + height);
}

function drawSierpinski(x, y, size, depth) {
  const height = (Math.sqrt(3) / 2) * size;
  if (depth === 0) {
    drawTriangle(x, y, size, "blue");
    return;
  }
  const halfBaseLen = size / 2;
  const halfHeight = height / 2;

  drawSierpinski(x, y, halfBaseLen, depth - 1); // Top
  drawSierpinski(x - halfBaseLen / 2, y + halfHeight, halfBaseLen, depth - 1); // Bottom-left
  drawSierpinski(x + halfBaseLen / 2, y + halfHeight, halfBaseLen, depth - 1); // Bottom-right
}

function drawRect(x, y, width, height, fill = "purple", stroke = "purple") {
  p.fill(fill);
  p.stroke(stroke);
  p.rect(x, y, width, height);
}

function drawCarpet(x, y, size, depth = 0) {
  // base case: draw big square with one hole in the middle
  // recursive: plop that hole on all the surrounding mini squares
  if (depth === 0) {
    drawRect(x, y, size, size);
    return;
  }
  const third = size / 3;
  drawCarpet(x, y, third, depth - 1); // top left
  drawCarpet(x + third, y, third, depth - 1); // top mid
  drawCarpet(x + 2 * third, y, third, depth - 1); // top right
  drawCarpet(x, y + third, third, depth - 1); // mid left
  drawCarpet(x + 2 * third, y + third, third, depth - 1); // mid right
  drawCarpet(x, y + 2 * third, third, depth - 1); // bot left
  drawCarpet(x + third, y + 2 * third, third, depth - 1); // bot mid
  drawCarpet(x + 2 * third, y + 2 * third, third, depth - 1); // bot right
  drawRect(x + third, y + third, third, third, "white");
}

function drawSquare(x, y, size, rotation, fill = "brown", stroke = "green") {
  p.push(); // apply transforms only to currently drawn shape
  p.translate(x, y);
  p.stroke(stroke);
  p.fill(fill);
  p.rotate(toRadians(rotation));
  p.square(-size / 2, -size / 2, size);
  p.pop();
}

function drawTree(cx, cy, size, rotation, depth = 0) {
  drawSquare(cx, cy, size, rotation);

  if (depth >= Number(depthSlider.value)) return;

  const newSize = size / Math.sqrt(2);

  const lX = cx + newSize * Math.cos(toRadians(rotation + 45));
  const lY = cy + newSize * Math.sin(toRadians(rotation + 45));
  const rX = cx + newSize * Math.cos(toRadians(rotation - 45));
  const rY = cy + newSize * Math.sin(toRadians(rotation - 45));

  drawTree(lX, lY, newSize, rotation + 45, depth + 1);
  drawTree(rX, rY, newSize, rotation - 45, depth + 1);
}

function drawSnowflake(x, y, size, depth) {
  // TODO
}

// function drawCircle(cx, cy, r, fill = "none", stroke = "blue") {
//   p.fill(fill);
//   p.stroke(stroke);
//   p.ellipse(cx, cy, r * 2, r * 2);
// }

// function drawGasket(x, y, radius, depth = 0) {
//   if (depth <= 0) {
//     drawCircle(x, y, radius);
//     return;
//   }
//   drawCircle(x, y, radius);
//   // r = (R*sqrt3) / (sqrt3 + 2)
//   const childRadius = (radius * Math.sqrt(3)) / (Math.sqrt(3) + 2);
//   const dist = radius - childRadius;
//   drawGasket(
//     x - dist * Math.cos(toRadians(30)),
//     y - dist * Math.sin(toRadians(30)),
//     childRadius,
//     depth - 1
//   );
//   drawGasket(
//     x + dist * Math.cos(toRadians(30)),
//     y - dist * Math.sin(toRadians(30)),
//     childRadius,
//     depth - 1
//   );
//   drawGasket(x, y + dist, childRadius, depth - 1);
// }

function drawFractal() {
  resetCanvas();

  const depth = Number(depthSlider.value);
  const DEFAULT_SIZE = Math.min(WIDTH, HEIGHT);
  switch (fractalSelect.value) {
    case "sierpinski":
      drawSierpinski(MIDPOINT, 0, DEFAULT_SIZE, depth);
      break;
    case "cantor":
      drawCantorSet(0, WIDTH, 50);
      break;
    case "tree":
      drawTree(WIDTH / 2, HEIGHT / 2, 150, -90);
      break;
    case "carpet":
      drawCarpet(
        WIDTH / 2 - DEFAULT_SIZE / 2,
        HEIGHT / 2 - DEFAULT_SIZE / 2,
        DEFAULT_SIZE,
        depth
      );
      break;
    case "snowflake":
      drawSnowflake(MIDPOINT, 0, WIDTH, depth);
      break;
    // case "gasket":
    //   const RADIUS = DEFAULT_SIZE / 2;
    //   drawGasket(WIDTH / 2, HEIGHT / 2, RADIUS, depth);
  }
}

function resetCanvas() {
  p.clear();
  p.noStroke();
  p.noFill();
}

// required since some fractals go too hard
function setLimits() {
  let sliderMax = 12;
  switch (fractalSelect.value) {
    case "tree":
    case "cantor":
      sliderMax = 15;
      break;
    case "carpet":
      sliderMax = 7;
      break;
    default:
      break;
  }
  depthSlider.max = sliderMax;
  const ticks = document.getElementById("ticks");
  Array.from({ length: sliderMax + 1 }).forEach((_, i) => {
    ticks.appendChild(
      Object.assign(document.createElement("option"), {
        value: i,
      })
    );
  });
}

fractalSelect.addEventListener("change", () => {
  depthSlider.value = 0;
  depthSlider.disabled = false;
  depthSlider.dispatchEvent(new Event("input"));
  setLimits();
  drawFractal();
});

depthSlider.addEventListener("input", () => {
  const startTime = performance.now();
  drawFractal();
  info.textContent = `Depth: ${depthSlider.value} | Time to render: ${(
    performance.now() - startTime
  ).toFixed(2)}ms`;
});

setLimits();

// misc. helpers
function randomRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
}

function toRadians(degs) {
  return (degs * Math.PI) / 180;
}
