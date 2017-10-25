'use strict';

const stage = document.querySelector('#stage'),
  output = document.querySelector('#output');

const map = [
    [0, 2, 0, 0, 0, 3],
    [0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0],
    [0, 2, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ],
  gameObjects = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [4, 0, 0, 0, 0, 0],
  ],
  WATER = 0,
  ISLAND = 1,
  PIRATE = 2,
  HOME = 3,
  SHIP = 4,
  SIZE = 64,
  ROWS = map.length,
  COLUMNS = map[0].length,
  UP = 38,
  DOWN = 40,
  RIGHT = 39,
  LEFT = 37;

let shipRow,
  shipColumn;

for (let row = 0; row < ROWS; row++) {
  for (let column = 0; column < COLUMNS; column++) {
    if (gameObjects[row][column] === SHIP) {
      shipRow = row;
      shipColumn = column;
    }
  }
}

window.addEventListener('keydown', keydownHandler, false);

render();

function keydownHandler(event) {
  switch (event.keyCode) {
    case UP:
      // Find out if ship's move will be within playing field
      if (shipRow > 0) {
        // If it is clear the ship's current cell
        gameObjects[shipRow][shipColumn] = WATER;

        // Subtract 1 from the ship's row to move it up one row
        shipRow--;

        // Apply the ship's new updated position to array
        gameObjects[shipRow][shipColumn] = SHIP;
      }
      break;
    case DOWN:
      if (shipRow < ROWS - 1) {
        gameObjects[shipRow][shipColumn] = WATER;
        shipRow++;
        gameObjects[shipRow][shipColumn] = SHIP;
      }
      break;
    case LEFT:
      if (shipColumn > 0) {
        gameObjects[shipRow][shipColumn] = WATER;
        shipColumn--;
        gameObjects[shipRow][shipColumn] = SHIP;
      }
      break;
    case RIGHT:
      if (shipColumn < COLUMNS - 1) {
        gameObjects[shipRow][shipColumn] = WATER;
        shipColumn++;
        gameObjects[shipRow][shipColumn] = SHIP;
      }
      break;
    default:
      break;
  }

  render();
}

function render() {
  // Clear the stage of img tag cells from previous turn
  if (stage.hasChildNodes()) {
    for (let i = 0; i < ROWS * COLUMNS; i++) {
      stage.removeChild(stage.firstChild);
    }
  }

  // Render the game by looping through the map arrays
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      // Create an img tag call cell
      const cell = document.createElement('img')

      // Set its CSS class to cell
      cell.setAttribute('class', 'cell');

      // Add the img tag to the stage tag
      stage.appendChild(cell);

      // Find the correct image for this map cell
      switch (map[row][column]) {
        case WATER:
          cell.src = 'assets/water.png';
          break;
        case ISLAND:
          cell.src = 'assets/island.png';
          break;
        case PIRATE:
          cell.src = 'assets/pirate.png';
          break;
        case HOME:
          cell.src = 'assets/home.png';
          break;
        default:
          break;
      }

      // Add the ship from the gameObjects array
      switch (gameObjects[row][column]) {
        case SHIP:
          cell.src = 'assets/ship.png';
          break;
        default:
          break;
      }

      // Position the cell
      cell.style.top = row * SIZE + 'px';
      cell.style.left = column * SIZE + 'px';
    }
  }
}
