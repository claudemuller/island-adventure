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
    [0, 0, 5, 0, 0, 0],
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
  MONSTER = 5,
  SIZE = 64,
  ROWS = map.length,
  COLUMNS = map[0].length,
  UP = 38,
  DOWN = 40,
  RIGHT = 39,
  LEFT = 37;

let shipRow,
  shipColumn,
  monsterRow,
  monsterColumn;

// Game variables
let gameMessage = 'Use the arrow keys to find your way home.',
  food = 10,
  gold = 10,
  experience = 0;

for (let row = 0; row < ROWS; row++) {
  for (let column = 0; column < COLUMNS; column++) {
    if (gameObjects[row][column] === SHIP) {
      shipRow = row;
      shipColumn = column;
    }

    if (gameObjects[row][column] === MONSTER) {
      monsterRow = row;
      monsterColumn = column;
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

  switch (map[shipRow][shipColumn]) {
    case WATER:
      gameMessage = 'You sail the open seas.';
      break;
    case PIRATE:
      fight();
      break;
    case ISLAND:
      trade();
      break;
    case HOME:
      endGame();
      break;
  }

  moveMonster();

  // Find out if the ship is touching the monster
  if (gameObjects[shipRow][shipColumn] === MONSTER) endGame();

  // Subtract some food each turn
  food--;

  // Find out if the ship has run out of food or gold
  if (food <= 0 || gold <= 0) endGame();

  render();
}

function moveMonster() {
  // 4 possible directions
  const UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4;

  // Array to store valid directions that monster can move in
  const validDirections = [];

  // The final direction that the monster will move in
  let direction = undefined;

  // Find out what kinds of things are in the cells that surround the monster. If the cell contains
  // WATER, push the corresponding direction into the validDirections array
  if (monsterRow > 0) {
    const thingAbove = map[monsterRow - 1][monsterColumn];

    if (thingAbove === WATER) validDirections.push(UP);
  }

  if (monsterRow < ROWS - 1) {
    const thingBelow = map[monsterRow + 1][monsterColumn];

    if (thingBelow === WATER) validDirections.push(DOWN);
  }

  if (monsterColumn > 0) {
    const thingToTheLeft = map[monsterRow][monsterColumn - 1];

    if (thingToTheLeft === WATER) validDirections.push(LEFT);
  }

  if (monsterColumn < COLUMNS - 1) {
    const thingToTheRight = map[monsterRow][monsterColumn + 1];

    if (thingToTheRight === WATER) validDirections.push(RIGHT);
  }

  // ValidDirections array now contains 0 to 4 directions that container WATER cells. Which of thoses will
  // the monster move in
  // If valid direction was found, randomly choose one of the possible directions and assign to direction var
  if (validDirections.length !== 0) {
    const randomNumber = Math.floor(Math.random() * validDirections.length);
    direction = validDirections[randomNumber];
  }

  // Move the monster in the chosen random direction
  switch (direction) {
    case UP:
      // Clear the monster's current cell
      gameObjects[monsterRow][monsterColumn] = WATER;

      // Subtract 1 from the monster's row
      monsterRow--;

      // Apply the monster's new updated position to array
      gameObjects[monsterRow][monsterColumn] = MONSTER;
      break;
    case DOWN:
      gameObjects[monsterRow][monsterColumn] = WATER;
      monsterRow++;
      gameObjects[monsterRow][monsterColumn] = MONSTER;
      break;
    case LEFT:
      gameObjects[monsterRow][monsterColumn] = WATER;
      monsterColumn--;
      gameObjects[monsterRow][monsterColumn] = MONSTER;
      break;
    case RIGHT:
      gameObjects[monsterRow][monsterColumn] = WATER;
      monsterColumn++;
      gameObjects[monsterRow][monsterColumn] = MONSTER;
      break;
    default:
      break;
  }
}

function fight() {
  // The ship's stength
  const shipStrength = Math.ceil((food + gold) / 2);

  // A random number between 1 and the ship's strength
  const pirateStrength = Math.ceil(Math.random() * shipStrength * 2);

  // Find out if the pirates are stronger than the player's ship
  if (pirateStrength > shipStrength) {
    // The pirates ransack the ship
    const stolenGold = Math.round(pirateStrength / 2);
    gold -= stolenGold;

    // Give the player some experience for trying
    experience += 1;

    // Update the game message
    gameMessage = `You fight and LOSE ${stolenGold} gold pieces. Ship's strength: ${shipStrength},`
      + ` Pirate's strength: ${pirateStrength}`;
  } else {
    // The player wins the pirates' gold
    const pirateGold = Math.round(pirateStrength / 2);
    gold += pirateGold;

    // Add some experience
    experience += 2;

    // Update the game message
    gameMessage = `You fight and WIN ${pirateGold} gold pieces. Ship's strength: ${shipStrength},`
      + ` Pirate's stength: ${pirateStrength}`;
  }
}

function trade() {
  // Figure out how much food island has and how much it should cost
  const islandsFood = experience + gold,
    cost = Math.ceil(Math.random() * islandsFood);

  // Let the player buy food if there's enough gold to afford it
  if (gold > cost) {
    food += islandsFood;
    gold -= cost;
    experience += 2;

    gameMessage = `You buy ${islandsFood} coconuts for ${cost} gold pieces.`;
  } else {
    // Tell the player if he or she does not have enough gold
    experience += 1;
    gameMessage = `You don't have enough gold to buy food.`;
  }
}

function endGame() {
  if (map[shipRow][shipColumn] === HOME) {
    // Calculate the score
    const score = food + gold + experience;

    // Display the game message
    gameMessage = `You made it home ALIVE! Final Score: ${score}`;
  } else if (map[shipRow][shipColumn] === MONSTER) {
    gameMessage = 'You ship has been swallowed by a sea monster!';
  } else {
    // Display the game message if the player has run out of gold or food
    if (gold <= 0) gameMessage += ` You've run out of gold!`;
    else gameMessage += ` You've run out of food!`;

    gameMessage += ' Your crew throws you overboard!';
  }

  // Remove the keyboard listener to end the game
  window.removeEventListener('keydown', keydownHandler, false);
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
        case MONSTER:
          cell.src = 'assets/monster.png';
          break;
        default:
          break;
      }

      // Position the cell
      cell.style.top = row * SIZE + 'px';
      cell.style.left = column * SIZE + 'px';
    }
  }

  // Display the game message
  output.innerHTML = gameMessage;

  // Display the player's food, gold and experience
  output.innerHTML += `<br>Gold: ${gold}, Food: ${food}, Experience: ${experience}`;
}
