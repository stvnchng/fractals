const fractalSelect = document.getElementById("fractal-select");
const fractal = document.getElementById("fractal");
const depthSlider = document.getElementById("depthSlider");
const info = document.getElementById("info");

const WIDTH = fractal.clientWidth * 0.6;
const MIDPOINT = fractal.clientWidth / 2;

function drawLine(start, end, y) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", start);
  line.setAttribute("x2", end);
  line.setAttribute("y1", y);
  line.setAttribute("y2", y);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  fractal.appendChild(line);
}

function drawCantorSet(start, end, y, depth = 0) {
  if (depth >= depthSlider.value) {
    // base case: C_0 = [start, end]
    drawLine(start, end, y);
  } else {
    const third = (end - start) / 3;
    // cantor set: C_n+1 = (1/3)C_n U (2/3) + (1/3)C_n
    drawCantorSet(start, start + third, y + 20, depth + 1);
    drawCantorSet(start + 2 * third, end, y + 20, depth + 1);
    drawLine(start, end, y);
  }
}

function drawTriangle(x, y, size, color) {
  const height = (Math.sqrt(3) / 2) * size;
  const points = `${x},${y} ${x + size / 2},${y + height} ${x - size / 2},${
    y + height
  }`;

  console.log(points);

  const triangle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  triangle.setAttribute("points", points);
  triangle.setAttribute("fill", color);
  fractal.appendChild(triangle);
}

function drawSierpinski(x, y, size, depth) {
  const height = (Math.sqrt(3) / 2) * size;
  if (depth <= 0) {
    drawTriangle(x, y, size, "black");
  } else {
    const halfSize = size / 2;
    const halfHeight = height / 2;

    drawSierpinski(x, y, halfSize, depth - 1); // Top
    drawSierpinski(x - halfSize / 2, y + halfHeight, halfSize, depth - 1); // Bottom-left
    drawSierpinski(x + halfSize / 2, y + halfHeight, halfSize, depth - 1); // Bottom-right
  }
}

function drawSnowflake(x, y, size, depth) {
  // TODO
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

function drawSquare(points) {
  const pts = points.map((pt) => pt.toString()).join(" ");
  const square = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  square.setAttribute("points", pts);
  square.setAttribute("fill", "none");
  square.setAttribute("stroke", "blue");
  fractal.appendChild(square);
}

function rotatePoint(x, y, ctrX, ctrY, angle) {
  const rad = (angle * Math.PI) / 180;
  const newX = ctrX + (x - ctrX) * Math.cos(rad) - (y - ctrY) * Math.sin(rad);
  const newY = ctrY + (x - ctrX) * Math.sin(rad) + (y - ctrY) * Math.cos(rad);
  return new Point(newX, newY);
}

function drawPythagoras(size, rotation, ctrX, ctrY, depth = 0) {
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
  } else {
    const newSize = size * Math.sqrt(0.5);

    // Calculate offsets for child branches
    const angle = (rotation * Math.PI) / 180;
    const leftCtrX = ctrX - halfSize * Math.cos(angle);
    const leftCtrY = ctrY - halfSize * Math.sin(angle);

    const rightCtrX = ctrX + halfSize * Math.cos(angle);
    const rightCtrY = ctrY + halfSize * Math.sin(angle);

    drawPythagoras(newSize, rotation + 45, leftCtrX, leftCtrY, depth + 1);
    drawPythagoras(newSize, rotation - 45, rightCtrX, rightCtrY, depth + 1);

    drawSquare(rotatedPoints);
  }
}

fractalSelect.addEventListener("change", () => {
  fractal.innerHTML = "";
  depthSlider.value = 0;
  depthSlider.dispatchEvent(new Event("input"));
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

function draw() {
  switch (fractalSelect.value) {
    case "sierpinski":
      drawSierpinski(MIDPOINT, 0, WIDTH, Number(depthSlider.value));
      break;
    case "cantor":
      drawCantorSet(0, fractal.clientWidth, 50);
      break;
    case "snowflake":
      drawSnowflake(MIDPOINT, 0, WIDTH, Number(depthSlider.value));
      break;
    case "tree":
      drawPythagoras(100, 0, fractal.clientWidth / 2, fractal.clientHeight / 2);
      break;
  }
}
