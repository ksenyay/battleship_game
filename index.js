"use strict";

require("./styles.css");
class Ship {
  constructor(length, coordinates) {
    this.length = length;
    this.hits = 0;
    this.coordinates = coordinates;
  }
  isSunk() {
    return this.length === this.hits;
  }
  hit() {
    this.hits += 1;
  }
}
class GameBoard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.hitOrMiss = "";
    this.currentShip = null;
  }
  createBoard() {
    for (let i = 0; i < 10; i++) {
      this.board.push(new Array(10).fill(""));
    }
  }
  placeShip(ship) {
    ship.coordinates.forEach(({
      x,
      y
    }) => {
      if (this.board[x][y] === "") {
        this.board[x][y] = "S";
      }
    });
    this.ships.push(ship);
    ship.hits = 0;
  }
  receiveAttack(x, y) {
    let isHit = false;
    this.ships.forEach(ship => {
      ship.coordinates.forEach(({
        x: shipX,
        y: shipY
      }) => {
        if (shipX === x && shipY === y) {
          this.currentShip = ship;
          ship.hit();
          this.hitOrMiss = "Hit!";
          this.board[x][y] = "X";
          isHit = true;
          let isSunk = ship.isSunk();
          if (isSunk) {
            this.hitOrMiss = "The ship has sunk!";
          }
        }
      });
    });
    if (!isHit) {
      this.board[x][y] = ".";
      this.hitOrMiss = "Miss!";
    }
  }
  attackResult() {
    return this.hitOrMiss;
  }
  returnCoordinates() {
    return this.currentShip.coordinates;
  }
  reportSunk() {
    return this.ships.every(ship => ship.isSunk());
  }
}
class Player {
  constructor() {
    this.playerBoard = new GameBoard();
  }
}
class RealPlayer extends Player {
  constructor(name) {
    super();
    this.name = name;
  }
}
/*
class Computer extends Player {
  constructor() {
    super();
  }
}*/

// SHIP MANAGER

class ShipPlacer {
  constructor() {
    this.counterOne = 4;
    this.counterTwo = 3;
    this.counterThree = 2;
    this.counterFour = 1;
  }
  static checkShipPlaced() {
    if (this.counterOne === 0 && this.counterTwo === 0 && this.counterThree === 0 && this.counterFour === 0) {
      return true;
    } else {
      return false;
    }
  }
  static updateCounter(shipSize) {
    const shipCounterOne = document.querySelector(".ship-counter-1");
    const shipCounterTwo = document.querySelector(".ship-counter-2");
    const shipCounterThree = document.querySelector(".ship-counter-3");
    const shipCounterFour = document.querySelector(".ship-counter-4");
    const shipOne = document.querySelectorAll("#one-cell-ship div");
    const shipTwo = document.querySelectorAll("#two-cell-ship div");
    const shipThree = document.querySelectorAll("#three-cell-ship div");
    const shipFour = document.querySelectorAll("#four-cell-ship div");
    if (shipSize === 3) {
      this.counterThree -= 1;
      shipCounterThree.textContent = this.counterThree;
    } else if (shipSize === 2) {
      this.counterTwo = this.counterTwo - 1;
      shipCounterTwo.textContent = this.counterTwo;
    } else if (shipSize === 4) {
      this.counterFour = this.counterFour - 1;
      shipCounterFour.textContent = this.counterFour;
    } else if (shipSize === 1) {
      this.counterOne = this.counterOne - 1;
      shipCounterOne.textContent = this.counterOne;
    } else {
      return;
    }
    shipSize = null;
    if (this.counterOne <= 0) {
      document.querySelector("#one-cell-ship").draggable = false;
      shipOne.forEach(ship => {
        ship.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      });
    }
    if (this.counterTwo <= 0) {
      document.querySelector("#two-cell-ship").draggable = false;
      shipTwo.forEach(ship => {
        ship.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      });
    }
    if (this.counterThree <= 0) {
      document.querySelector("#three-cell-ship").draggable = false;
      shipThree.forEach(ship => {
        ship.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      });
    }
    if (this.counterFour <= 0) {
      document.querySelector("#four-cell-ship").draggable = false;
      shipFour.forEach(ship => {
        ship.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      });
    }
  }
  static restartShips() {
    document.querySelector("footer").style.display = "flex";
    document.querySelector(".rotate-button").style.display = "block";
    document.querySelector(".battleship-img").style.display = "none";
    const ships = document.querySelectorAll(".ship");
    ships.forEach(ship => {
      ship.style.flexDirection = "row";
    });
    const shipCounterOne = document.querySelector(".ship-counter-1");
    const shipCounterTwo = document.querySelector(".ship-counter-2");
    const shipCounterThree = document.querySelector(".ship-counter-3");
    const shipCounterFour = document.querySelector(".ship-counter-4");
    this.counterOne = 4;
    this.counterTwo = 3;
    this.counterThree = 2;
    this.counterFour = 1;
    shipCounterOne.textContent = this.counterOne;
    shipCounterTwo.textContent = this.counterTwo;
    shipCounterThree.textContent = this.counterThree;
    shipCounterFour.textContent = this.counterFour;
    ships.forEach(ship => {
      ship.draggable = true;
      document.querySelectorAll(".ship div").forEach(ship => {
        ship.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      });
    });
  }
}
class ManageDOM {
  constructor(name1, name2) {
    this.player1 = new RealPlayer(name1);
    this.player2 = new RealPlayer(name2);
    this.currentPlayer = this.player1;
    this.areShipsVisible = false;
    this.init = () => {
      this.playerOneBoard();
      this.playerTwoBoard();
      this.buttonEventListeners();
      this.renderNameTags();
    };
  }
  playerOneBoard() {
    document.querySelector(".gameboard").innerHTML = "";
    this.player1.playerBoard.createBoard();
    this.renderBoard(this.player1);
    this.placeShips(this.player1);
  }
  playerTwoBoard() {
    this.player2.playerBoard.createBoard();
    this.renderBoard(this.player2);
  }
  areShipsOverlapping(currentShip) {
    const isOverlappingRed = currentShip.coordinates.some(({
      x,
      y
    }) => {
      const cell = document.querySelector(`.grid-element-${this.currentPlayer.name}[data-col="${y}"][data-row="${x}"]`);
      return cell && cell.classList.contains("unavailable");
    });
    if (isOverlappingRed) {
      currentShip = null;
      this.removeHighlight();
      return false;
    }
  }
  canShipBePlaced(currentShip, orientation) {
    if (!currentShip.coordinates.length === currentShip.size) {
      return false;
    }
    const unavailableCells = (x, y) => {
      const cell = document.querySelector(`.grid-element-${this.currentPlayer.name}[data-col="${y}"][data-row="${x}"]`);
      if (cell) {
        cell.classList.add("unavailable");
      }
    };
    if (orientation === "horizontal") {
      // Highlight top and bottom for each coordinate
      currentShip.coordinates.forEach(coord => {
        unavailableCells(coord.x - 1, coord.y); // Top
        unavailableCells(coord.x + 1, coord.y); // Bottom
      });

      // Highlight the right and left ends of the ship
      unavailableCells(currentShip.coordinates[0].x, currentShip.coordinates[0].y - 1); // Right
      unavailableCells(currentShip.coordinates[0].x, currentShip.coordinates[currentShip.length - 1].y + 1); // Left
    } else {
      // Highlight right and left for each coordinate
      currentShip.coordinates.forEach(coord => {
        unavailableCells(coord.x, coord.y - 1); // Right
        unavailableCells(coord.x, coord.y + 1); // Left
      });

      // Highlight the top and bottom ends of the ship
      unavailableCells(currentShip.coordinates[0].x - 1, currentShip.coordinates[0].y); // Top
      unavailableCells(currentShip.coordinates[currentShip.length - 1].x + 1, currentShip.coordinates[0].y); // Bottom
    }
    return true;
  }
  removeHighlight() {
    const gridCells = document.querySelectorAll(`.grid-element-${this.currentPlayer.name}`);
    gridCells.forEach(cell => {
      cell.classList.remove("highlight");
      cell.draggable = false;
    });
  }
  placeShips(player) {
    ShipPlacer.restartShips();
    if (player.name === this.player2.name) {
      const opponentCells = document.querySelectorAll(`.grid-element-${this.player1.name}`);
      opponentCells.forEach(cell => {
        cell.style.pointerEvents = "none";
      });
    }

    // Event Listeners for dragging ships
    const ships = document.querySelectorAll(".ship");
    const gridCells = document.querySelectorAll(`.grid-element-${player.name}`);
    const rotateButton = document.querySelector(".rotate-button");
    let shipSize = null;
    let currentShip = null;
    let orientation = "horizontal"; // Default orientation

    ships.forEach(ship => {
      ship.addEventListener("dragstart", () => {
        shipSize = parseInt(ship.getAttribute("data-size"));
      });
    });
    rotateButton.addEventListener("click", event => {
      event.preventDefault();
      orientation = orientation === "horizontal" ? "vertical" : "horizontal";
      ships.forEach(ship => {
        if (orientation === "horizontal") {
          ship.style.flexDirection = "row";
        } else {
          ship.style.flexDirection = "column";
        }
      });
    });
    gridCells.forEach(cell => {
      cell.addEventListener("dragover", event => {
        event.preventDefault();
        currentShip = null;
        let col = parseInt(cell.getAttribute("data-col"));
        let row = parseInt(cell.getAttribute("data-row"));

        // Clear previous highlights
        this.removeHighlight();

        // Determine ship coordinates based on orientation
        let shipCoordinates = [];
        for (let i = 0; i < shipSize; i++) {
          if (orientation === "horizontal") {
            if (shipSize === 4 || shipSize === 3) {
              shipCoordinates.push({
                x: row,
                y: col + i - 1
              });
            } else {
              shipCoordinates.push({
                x: row,
                y: col + i
              });
            }
          } else {
            if (shipSize === 4 || shipSize === 3) {
              shipCoordinates.push({
                x: row + i - 1,
                y: col
              });
            } else {
              shipCoordinates.push({
                x: row + i,
                y: col
              });
            }
          }
        }

        // Check if ship fits within grid boundaries
        if (!shipCoordinates) return;
        const isWithinBounds = shipCoordinates.every(({
          x,
          y
        }) => x >= 0 && x < 10 && y >= 0 && y < 10);
        if (!isWithinBounds) return;

        // Highlight cells
        shipCoordinates.forEach(({
          x,
          y
        }) => {
          const cellToHighlight = document.querySelector(`.grid-element-${player.name}[data-col="${y}"][data-row="${x}"]`);
          if (cellToHighlight) cellToHighlight.classList.add("highlight");
        });

        // Create ship instance
        currentShip = new Ship(shipSize, shipCoordinates);
        this.areShipsOverlapping(currentShip);
      });
      cell.addEventListener("dragleave", () => {
        this.removeHighlight();
      });
      cell.addEventListener("drop", event => {
        event.preventDefault();
        let isCellAvailable = this.canShipBePlaced(currentShip, orientation);
        if (!isCellAvailable) {
          console.log("Cannot place ship!");
          return; // Prevents placement
        }
        this.removeHighlight();

        //if (!currentShip) return;

        ShipPlacer.updateCounter(shipSize);
        shipSize = null;
        //currentShip.draggable = false;

        // Place ship on player's board
        player.playerBoard.placeShip(currentShip);
        this.updateBoard(player);
        this.showShips();
        currentShip = null;
        let areShipsPlaced = ShipPlacer.checkShipPlaced();
        const playerOneName = document.querySelector("#player-one-name");
        const playerTwoName = document.querySelector("#player-two-name");
        if (areShipsPlaced && this.currentPlayer === this.player1) {
          ShipPlacer.restartShips();
          this.hideShips(player);
          this.currentPlayer = this.player2;

          // Changes player
          playerOneName.classList.remove("active");
          playerTwoName.classList.add("active");
          this.placeShips(this.player2);
        } else if (areShipsPlaced && this.currentPlayer === this.player2) {
          this.hideShips(player);

          // Changes player
          this.currentPlayer = this.player1;
          playerOneName.classList.add("active");
          playerTwoName.classList.remove("active");
          this.makeMove();
        }
      });
    });
    const showShipsButton = document.querySelector(".show-ships");
    if (showShipsButton) showShipsButton.style.display = "none";
    this.createPopup(`${player.name.charAt(0).toUpperCase() + player.name.slice(1)}, place your ships`, 100000);
  }
  renderNameTags() {
    const playerOneName = document.querySelector("#player-one-name");
    const playerTwoName = document.querySelector("#player-two-name");
    playerOneName.textContent = this.player1.name;
    playerTwoName.textContent = this.player2.name;
  }
  updateBoard(player) {
    for (let i = 0; i < player.playerBoard.board.length; i++) {
      for (let j = 0; j < player.playerBoard.board[i].length; j++) {
        const gridElement = document.querySelector(`.grid-element-${player.name}[data-col="${j}"][data-row="${i}"]`);
        if (player.playerBoard.board[i][j] === "S") {
          gridElement.dataset.ship = "true";
          gridElement.textContent = "";
        } else {
          gridElement.textContent = player.playerBoard.board[i][j];
        }
      }
    }
  }

  // Creates grid for each player

  renderBoard(player) {
    const gridContainer = document.createElement("div");
    document.querySelector("h1").style.display = "none";
    document.querySelector(".battleship-img").style.display = "none";
    document.querySelector("footer").style.display = "flex";
    gridContainer.classList.add("grid-container");
    player.playerBoard.board.forEach((row, rowIndex) => {
      row.forEach((element, columnIndex) => {
        const gridItem = document.createElement("div");
        gridItem.dataset.row = rowIndex;
        gridItem.dataset.col = columnIndex;
        gridItem.classList.add(`grid-element-${player.name}`);
        if (element === "S") {
          gridItem.dataset.ship = "true";
          gridItem.textContent = "";
        } else {
          gridItem.textContent = element;
        }
        gridContainer.appendChild(gridItem);
      });
    });
    document.querySelector(".gameboard").appendChild(gridContainer);
  }
  createPopup(text, time) {
    // Removes previous popup
    const previousPopup = document.querySelector(".popup");
    if (previousPopup) {
      previousPopup.remove();
    }
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = text;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.classList.add("fade-out");
    }, time);
  }
  makeMove() {
    document.querySelector("footer").style.display = "none";
    document.querySelector(".show-ships").style.display = "flex";
    document.querySelector(".rotate-button").style.display = "none";
    document.querySelector(".board-container").style.marginTop = "150px";
    this.createPopup(`Let's begin! ${this.player1.name.slice(0, 1).toUpperCase() + this.player1.name.slice(1, this.player1.name.length)} attack first.`, 10000);
    document.querySelectorAll(".grid-container div").forEach(item => {
      item.dataset.clicked = "false";
      item.addEventListener("click", event => {
        let opponent = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        if (!event.target.classList.contains(`grid-element-${opponent.name}`)) {
          this.createPopup("You can't attack your own board!", 2000);
          return;
        }
        if (item.dataset.clicked === "false") {
          const x = parseInt(item.dataset.row);
          const y = parseInt(item.dataset.col);
          opponent.playerBoard.receiveAttack(x, y);
          item.textContent = opponent.playerBoard.board[x][y];
          let hitOrMiss = opponent.playerBoard.attackResult();

          //
          if (hitOrMiss === "Hit!") {
            item.style.color = "red";
          } else if (hitOrMiss === "The ship has sunk!") {
            let coordinates = opponent.playerBoard.returnCoordinates();
            coordinates.forEach(coord => {
              console.log(coord);
              let gridElements = document.querySelectorAll(`.grid-element-${opponent.name}[data-col="${coord.y}"][data-row="${coord.x}"]`);
              gridElements.forEach(element => {
                element.style.color = "black";
              });
            });
          }
          item.dataset.clicked = "true";
          if (opponent.playerBoard.reportSunk()) {
            this.createPopup(`Congrats! ${this.currentPlayer.name.slice(0, 1).toUpperCase() + this.currentPlayer.name.slice(1, this.currentPlayer.name.length)} wins!`, 10000);
            this.restartGameHandler();
          } else {
            if (hitOrMiss === "Miss!") {
              this.createPopup(`${hitOrMiss}`, 3000);
              this.switchPlayer();
            } else {
              this.createPopup(`${hitOrMiss} Please continue, ${this.currentPlayer.name}!`, 3000);
            }
          }
        } else {
          this.createPopup("This cell is already clicked!", 1500);
        }
      });
    });
  }
  restartGameHandler() {
    const showShipsButton = document.querySelector(".show-ships");
    showShipsButton.style.display = "none";
    const restartButton = document.createElement("button");
    document.querySelector(".show").appendChild(restartButton);
    restartButton.classList.add(".restart");
    restartButton.textContent = "Restart Game";
    this.showAllShips();
    document.querySelectorAll(".grid-container div").forEach(item => {
      item.style.pointerEvents = "none";
    });
    restartButton.addEventListener("click", () => {
      GameManager.restartGame();
      document.querySelector(".popup").remove();
      restartButton.style.display = "none";
      showShipsButton.style.display = "block";
      this.currentPlayer = this.player2;
      this.switchPlayer();
    });
  }
  showShips() {
    const playerOneGrid = document.querySelectorAll(`.grid-element-${this.player1.name}`);
    const playerTwoGrid = document.querySelectorAll(`.grid-element-${this.player2.name}`);
    if (this.currentPlayer === this.player1) {
      playerOneGrid.forEach(item => {
        if (item.dataset.ship === "true") {
          if (item.textContent === "X") {
            item.textContent = "X";
          } else {
            item.textContent = "S";
          }
        }
      });
    } else if (this.currentPlayer === this.player2) {
      playerTwoGrid.forEach(item => {
        if (item.dataset.ship === "true") {
          if (item.textContent === "X") {
            item.textContent = "X";
          } else {
            item.textContent = "S";
          }
        }
      });
    }
    this.areShipsVisible = true;
  }
  hideShips() {
    const playerOneGrid = document.querySelectorAll(`.grid-element-${this.player1.name}`);
    const playerTwoGrid = document.querySelectorAll(`.grid-element-${this.player2.name}`);
    if (this.currentPlayer === this.player1) {
      playerOneGrid.forEach(item => {
        if (item.dataset.ship === "true") {
          if (item.textContent === "X") {
            item.textContent = "X";
          } else {
            item.textContent = "";
          }
        }
      });
    } else if (this.currentPlayer === this.player2) {
      playerTwoGrid.forEach(item => {
        if (item.dataset.ship === "true") {
          if (item.textContent === "X") {
            item.textContent = "X";
          } else {
            item.textContent = "";
          }
        }
      });
    }
    this.areShipsVisible = false;
  }
  showAllShips() {
    const playerOneGrid = document.querySelectorAll(`.grid-element-${this.player1.name}`);
    const playerTwoGrid = document.querySelectorAll(`.grid-element-${this.player2.name}`);
    playerOneGrid.forEach(item => {
      if (item.dataset.ship === "true") {
        if (item.textContent === "X") {
          item.textContent = "X";
        } else {
          item.textContent = "S";
        }
      }
    });
    playerTwoGrid.forEach(item => {
      if (item.dataset.ship === "true") {
        if (item.textContent === "X") {
          item.textContent = "X";
        } else {
          item.textContent = "S";
        }
      }
    });
  }
  buttonEventListeners() {
    const showShipsButton = document.querySelector(".show-ships");

    // Removes previous event listeners before adding a new one
    showShipsButton.replaceWith(showShipsButton.cloneNode(true));
    const newShowShipsButton = document.querySelector(".show-ships");
    newShowShipsButton.addEventListener("click", () => {
      if (this.areShipsVisible) {
        this.hideShips();
        newShowShipsButton.textContent = "Show Ships";
      } else {
        let opponent = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        this.createPopup(`${opponent.name.slice(0, 1).toUpperCase() + opponent.name.slice(1, opponent.name.length)} close your eyes!`, 2000);
        showShipsButton.style.pointerEvents = "none";
        setTimeout(() => {
          const previousPopup = document.querySelector(".popup");
          if (previousPopup) {
            previousPopup.remove();
          }
          this.showShips();
          newShowShipsButton.textContent = "Hide Ships";
          showShipsButton.style.pointerEvents = "auto";
        }, 2000);
      }
    });
  }
  switchPlayer() {
    // Ensures ships are hidden when changing player
    this.hideShips();
    document.querySelector(".show-ships").textContent = "Show Ships";
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    let opponent = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    document.querySelectorAll(`.grid-element-${opponent.name}`).forEach(item => {
      item.style.pointerEvents = "auto";
    });
    const playerOneName = document.querySelector("#player-one-name");
    const playerTwoName = document.querySelector("#player-two-name");
    if (this.currentPlayer.name === this.player1.name) {
      playerOneName.classList.add("active");
      playerTwoName.classList.remove("active");
    } else {
      playerTwoName.classList.add("active");
      playerOneName.classList.remove("active");
    }
  }
}
class GameManager {
  static createNewGame(name1 = "Player 1", name2 = "Player 2") {
    const newGame = new ManageDOM(name1, name2);
    newGame.init();
  }
  static restartGame() {
    const board = document.querySelector(".gameboard");
    board.innerHTML = "";
    this.getNameInputs();
  }
  static getNameInputs() {
    const form = document.querySelector("form");
    const boardContainer = document.querySelector(".board-container");
    document.querySelector("h1").style.display = "block";
    document.querySelector(".battleship-img").style.display = "block";
    form.style.display = "flex";
    boardContainer.style.display = "none";
    form.addEventListener("submit", event => {
      event.preventDefault();
      const playerData = new FormData(event.target);
      const names = Object.fromEntries(playerData.entries());
      const playerOneCleaned = names["player_one_name"].replace(/\s+/g, "_").trim();
      const playerTwoCleaned = names["player_two_name"].replace(/\s+/g, "_").trim();
      if (playerOneCleaned === playerTwoCleaned) {
        alert("You cannot enter two identical names!");
        return;
      }
      boardContainer.style.display = "block";
      this.createNewGame(playerOneCleaned, playerTwoCleaned);
      form.style.display = "none";
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  GameManager.getNameInputs();
});