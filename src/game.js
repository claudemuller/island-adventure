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
  WATER = 0,
  ISLAND = 1,
  PIRATE = 2,
  HOME = 3,
  SIZE = 64,
  ROWS = map.length,
  COLUMNS = map[0].length;

render();

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

      // Position the cell
      cell.style.top = row * SIZE + 'px';
      cell.style.left = column * SIZE + 'px';
    }
  }
}
