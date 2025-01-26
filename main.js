const fractalSelect = document.getElementById("fractal-select");
const fractal = document.getElementById("fractal");
const depthSlider = document.getElementById("depthSlider");
const info = document.getElementById("info");

const WIDTH = fractal.clientWidth * 0.6;
const MIDPOINT = fractal.clientWidth / 2;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

function drawLine(start, end, y) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", start);
  line.setAttribute("x2", end);
  line.setAttribute("y1", y);
  line.setAttribute("y2", y);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "4");
  fractal.appendChild(line);
}

function drawCantorSet(start, end, y, depth = 0) {
  if (depth >= depthSlider.value) {
    // base case: C_0 = [start, end]
    drawLine(start, end, y);
    return;
  }
  const third = (end - start) / 3;
  // cantor set: C_n+1 = (1/3)C_n U (2/3) + (1/3)C_n
  drawCantorSet(start, start + third, y + 20, depth + 1);
  drawCantorSet(start + 2 * third, end, y + 20, depth + 1);
  drawLine(start, end, y);
}

function drawTriangle(x, y, size, color) {
  const h = (Math.sqrt(3) / 2) * size; // equilateral triangle
  const pts = `${x},${y} ${x + size / 2},${y + h} ${x - size / 2},${y + h}`;
  const triangle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  triangle.setAttribute("points", pts);
  triangle.setAttribute("fill", color);
  fractal.appendChild(triangle);
}

function drawSierpinski(x, y, size, depth) {
  const height = (Math.sqrt(3) / 2) * size;
  if (depth <= 0) {
    drawTriangle(x, y, size, "black");
    return;
  }
  const halfSize = size / 2;
  const halfHeight = height / 2;

  drawSierpinski(x, y, halfSize, depth - 1); // Top
  drawSierpinski(x - halfSize / 2, y + halfHeight, halfSize, depth - 1); // Bottom-left
  drawSierpinski(x + halfSize / 2, y + halfHeight, halfSize, depth - 1); // Bottom-right
}

function drawSnowflake(x, y, size, depth) {
  // TODO
}

function drawSquare(points, fill = "none", stroke = "blue") {
  const pts = points.map((pt) => pt.toString()).join(" ");
  const square = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  square.setAttribute("points", pts);
  square.setAttribute("fill", fill);
  square.setAttribute("stroke", stroke);
  fractal.appendChild(square);
}

function rotatePoint(x, y, ctrX, ctrY, angle) {
  const rad = (angle * Math.PI) / 180;
  const newX = ctrX + (x - ctrX) * Math.cos(rad) - (y - ctrY) * Math.sin(rad);
  const newY = ctrY + (x - ctrX) * Math.sin(rad) + (y - ctrY) * Math.cos(rad);
  return new Point(newX, newY);
}

function drawTree(size, rotation, ctrX, ctrY, depth = 0) {
  const halfSize = size / 2;

  const points = [
    new Point(ctrX - halfSize, ctrY + halfSize), // Bottom-left
    new Point(ctrX + halfSize, ctrY + halfSize), // Bottom-right
    new Point(ctrX + halfSize, ctrY - halfSize), // Top-right
    new Point(ctrX - halfSize, ctrY - halfSize), // Top-left
  ];

  const rotatedPoints = points.map((pt) =>
    rotatePoint(pt.x, pt.y, ctrX, ctrY, rotation)
  );

  if (depth >= depthSlider.value) {
    drawSquare(rotatedPoints);
    return;
  }
  const newSize = size / Math.sqrt(2);

  const lX = ctrX + newSize * Math.cos(((rotation + 45) * Math.PI) / 180);
  const lY = ctrY + newSize * Math.sin(((rotation + 45) * Math.PI) / 180);

  const rX = ctrX + newSize * Math.cos(((rotation - 45) * Math.PI) / 180);
  const rY = ctrY + newSize * Math.sin(((rotation - 45) * Math.PI) / 180);

  drawSquare(rotatedPoints);

  drawTree(newSize, rotation + 45, lX, lY, depth + 1);
  drawTree(newSize, rotation - 45, rX, rY, depth + 1);
}

function drawRect(x, y, width, height, fill = "purple") {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x); // top-left corner
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", fill);
  fractal.appendChild(rect);
}

function drawCarpet(x, y, size, depth = 0) {
  // base case: draw big square with one hole in the middle
  // recursive: plop that hole on all the surrounding mini squares
  if (depth <= 0) {
    drawRect(x, y, size, size);
    return;
  }
  const third = size / 3;
  drawRect(x, y, size, size);
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

function draw() {
  const depth = Number(depthSlider.value);
  switch (fractalSelect.value) {
    case "sierpinski":
      drawSierpinski(MIDPOINT, 0, WIDTH, depth);
      break;
    case "cantor":
      drawCantorSet(0, fractal.clientWidth, 50);
      break;
    case "tree":
      drawTree(150, -90, fractal.clientWidth / 2, fractal.clientHeight / 2);
      break;
    case "carpet":
      const CARPET_SIZE = 600;
      drawCarpet(
        fractal.clientWidth / 2 - CARPET_SIZE / 2,
        fractal.clientHeight / 2 - CARPET_SIZE / 2,
        CARPET_SIZE,
        depth
      );
      break;
    case "snowflake":
      drawSnowflake(MIDPOINT, 0, WIDTH, depth);
      break;
  }
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
  fractal.innerHTML = "";
  depthSlider.value = 0;
  depthSlider.disabled = false;
  depthSlider.dispatchEvent(new Event("input"));
  setLimits();
  draw();
});

depthSlider.addEventListener("input", () => {
  fractal.innerHTML = "";
  const startTime = performance.now();
  draw();
  info.textContent = `Depth: ${depthSlider.value} | Time to render: ${(
    performance.now() - startTime
  ).toFixed(2)}ms`;
});

setLimits();
