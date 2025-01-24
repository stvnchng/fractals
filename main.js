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

function drawCantorSet(start, end, y, n) {
  if (n >= depthSlider.value) {
    // base case: C_0 = [start, end]
    drawLine(start, end, y);
  } else {
    const third = (end - start) / 3;
    // cantor set: C_n+1 = (1/3)C_n U (2/3) + (1/3)C_n
    drawCantorSet(start, start + third, y + 20, n + 1);
    drawCantorSet(start + 2 * third, end, y + 20, n + 1);
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

fractalSelect.addEventListener("change", () => {
  fractal.innerHTML = "";
  depthSlider.value = 0;
  depthSlider.dispatchEvent(new Event("input"));

  switch (fractalSelect.value) {
    case "sierpinski":
      drawSierpinski(MIDPOINT, 0, WIDTH, 0);
      break;
    case "cantor":
      drawCantorSet(0, fractal.clientWidth, 50, 0);
      break;
    case "snowflake":
      drawSnowflake(MIDPOINT, 0, WIDTH, 0);
      break;
  }
});

depthSlider.addEventListener("input", () => {
  fractal.innerHTML = "";
  const startTime = performance.now();

  switch (fractalSelect.value) {
    case "sierpinski":
      drawSierpinski(MIDPOINT, 0, WIDTH, depthSlider.value);
      break;
    case "cantor":
      drawCantorSet(0, fractal.clientWidth, 50, 0);
      break;
    case "snowflake":
      drawSnowflake(MIDPOINT, 0, WIDTH, depthSlider.value);
      break;
  }

  info.textContent = `Depth: ${depthSlider.value} | Time to render: ${(
    performance.now() - startTime
  ).toFixed(2)}ms`;
});
