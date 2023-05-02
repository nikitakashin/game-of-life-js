const overlay = document.querySelector("#overlay");
const canvas = document.querySelector("#canvas");
const grid = document.querySelector("#grid");
const sizeInput = document.querySelector("#sizeInput");
const speedInput = document.querySelector("#speedInput");
const ctx = canvas.getContext("2d");
const gridCtx = grid.getContext("2d");
const startCanvasSize = 400;
const startSpeed = 10;
const startSize = 10;

let size = startSize;
let speed = startSpeed;
let canvasSize = startCanvasSize;
let sizeOfRect = canvasSize / size;
let isStarted = false;

const setSizesToGameField = () => {
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  grid.width = canvasSize;
  grid.height = canvasSize;
  overlay.style.width = canvasSize;
  overlay.style.height = canvasSize;
};

setSizesToGameField();

const changeSize = (evt) => {
  size = evt.target.value;

  switch (true) {
    case size < 20:
      break;
    case size < 100:
      canvasSize = 700;
      break;
    case size <= 300:
      canvasSize = 1000;
      break;
    case size > 300:
      canvasSize = 5000;
      break;
    default:
      break;
  }
  sizeOfRect = canvasSize / size;
  setSizesToGameField();
  createGrid();
  render();
};

const changeSpeed = (evt) => {
  speed = evt.target.value;
};

let newField = {
  0: { 1: true },
  1: { 2: true },
  2: { 0: true, 1: true, 2: true },
};

const createGrid = () => {
  gridCtx.clearRect(0, 0, grid.width, grid.height);
  gridCtx.beginPath();
  gridCtx.strokeStyle = "gray";

  for (let i = 0; i < size; i++) {
    gridCtx.beginPath();
    gridCtx.moveTo(sizeOfRect * i, 0);
    gridCtx.lineTo(sizeOfRect * i, canvasSize);
    gridCtx.moveTo(0, sizeOfRect * i);
    gridCtx.lineTo(canvasSize, sizeOfRect * i);
    gridCtx.stroke();
  }
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  let x = 0;
  let y = 0;
  for (let i = 0; i < size * size; i++) {
    if (i % size === 0 && i !== 0) {
      x += 1;
      y = 0;
    }

    if (i % size !== 0 && i !== 0) {
      y += 1;
    }

    if (newField?.[x]?.[y]) {
      ctx.fillStyle = "black";
      ctx.fillRect(y * sizeOfRect, x * sizeOfRect, sizeOfRect, sizeOfRect);
    }

    // ctx.strokeStyle = "gray";
    // ctx.strokeRect(y * sizeOfRect, x * sizeOfRect, sizeOfRect, sizeOfRect);
  }
};

const handleClick = (evt) => {
  if (!isStarted) {
    const x = Math.floor(evt.layerY / sizeOfRect);
    const y = Math.floor(evt.layerX / sizeOfRect);

    newField[x] = {
      ...newField[x],
      [y]: !newField?.[x]?.[y],
    };
    render();
  }
};

const update = () => {
  const clearField = {};

  let x = 0;
  let y = 0;
  for (let i = 0; i < size * size; i++) {
    if (i % size === 0 && i !== 0) {
      x += 1;
      y = 0;
    }

    if (i % size !== 0 && i !== 0) {
      y += 1;
    }

    const neighbours = countNeighbours(x, y);

    if (newField?.[x]?.[y]) {
      if (neighbours < 2 || neighbours > 3) {
        clearField[x] = {
          ...clearField[x],
          [y]: false,
        };
      } else {
        clearField[x] = {
          ...clearField[x],
          [y]: true,
        };
      }
    } else {
      if (neighbours === 3) {
        clearField[x] = {
          ...clearField[x],
          [y]: true,
        };
      }
    }
  }

  newField = null;
  newField = clearField;

  render();
};

const start = () => {
  isStarted = true;
  sizeInput.disabled = true;
  speedInput.disabled = true;

  setInterval(() => {
    update();
  }, 1000 / speed);
};

const countNeighbours = (x, y) => {
  let neighbours = 0;
  const neighbourCoords = [
    { x: x - 1, y: y },
    { x: x, y: y - 1 },
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y },
    { x: x, y: y + 1 },
    { x: x + 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y + 1 },
  ];

  for (let coords of neighbourCoords) {
    const torX = coords.x < 0 ? size - 1 : coords.x > size - 1 ? 0 : coords.x;
    const torY = coords.y < 0 ? size - 1 : coords.y > size - 1 ? 0 : coords.y;

    if (newField?.[torX]?.[torY]) {
      neighbours++;
    }
  }

  return neighbours;
};

window.addEventListener("DOMContentLoaded", () => {
  createGrid();
  render();

  sizeInput.value = startSize;
  speedInput.value = startSpeed;
});
