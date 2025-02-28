import "./styles.css";

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
  }

  createBoard() {
    for (let i = 0; i < 10; i++) {
      this.board.push(new Array(10).fill(""));
    }
  }

  placeShip(ship) {
    ship.coordinates.forEach(({ x, y }) => {
      if (this.board[x][y] === "") {
        this.board[x][y] = "S";
      }
    });
    this.ships.push(ship);
    ship.hits = 0;
  }

  receiveAttack(x, y) {
    console.log(`received attack at ${x} ${y}`);
    let isHit = false;

    this.ships.forEach((ship) => {
      ship.coordinates.forEach(({ x: shipX, y: shipY }) => {
        if (shipX === x && shipY === y) {
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

  reportSunk() {
    return this.ships.every((ship) => ship.isSunk());
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

class ManageDOM {
  constructor(name1, name2) {
    this.player1 = new RealPlayer(name1);
    this.player2 = new RealPlayer(name2);

    this.currentPlayer = this.player1;

    this.areShipsVisible = false;

    //
    this.counterOne = 4;
    this.counterTwo = 3;
    this.counterThree = 2;
    this.counterFour = 1;
    //

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

  restartShips() {
    document.querySelector(".ship-counter").style.display = "grid";
    document.querySelector(".ship-manager").style.display = "flex";

    const shipCounterOne = document.querySelector(".ship-counter-1");
    const shipCounterTwo = document.querySelector(".ship-counter-2");
    const shipCounterThree = document.querySelector(".ship-counter-3");
    const shipCounterFour = document.querySelector(".ship-counter-4");

    const shipOne = document.querySelector("#one-cell-ship");
    const shipTwo = document.querySelector("#two-cell-ship");
    const shipThree = document.querySelector("#three-cell-ship");
    const shipFour = document.querySelector("#four-cell-ship");

    this.counterOne = 4;
    this.counterTwo = 3;
    this.counterThree = 2;
    this.counterFour = 1;

    shipCounterOne.textContent = this.counterOne;
    shipCounterTwo.textContent = this.counterTwo;
    shipCounterThree.textContent = this.counterThree;
    shipCounterFour.textContent = this.counterFour;

    shipOne.draggable = true;
    shipTwo.draggable = true;
    shipThree.draggable = true;
    shipFour.draggable = true;

    shipOne.style.borderColor = "grey";
    shipTwo.style.borderColor = "grey";
    shipThree.style.borderColor = "grey";
    shipFour.style.borderColor = "grey";
  }

  placeShips(player) {
    this.restartShips();

    if (player.name === this.player2.name) {
      const opponentCells = document.querySelectorAll(
        `.grid-element-${this.player1.name}`,
      );
      opponentCells.forEach((cell) => {
        cell.style.pointerEvents = "none";
      });
    }

    // Event Listeners for dragging ships
    const ships = document.querySelectorAll(".ship");
    const gridCells = document.querySelectorAll(`.grid-element-${player.name}`);
    let shipSize = null;
    let currentShip = null;

    ships.forEach((ship) => {
      ship.addEventListener("dragstart", () => {
        shipSize = parseInt(ship.getAttribute("data-size"));
      });
    });

    gridCells.forEach((cell) => {
      cell.addEventListener("dragover", (event) => {
        event.preventDefault();

        let col = parseInt(cell.getAttribute("data-col"));
        let row = parseInt(cell.getAttribute("data-row"));

        // ELEMENTS
        let targetElement = document.querySelector(
          `.grid-element-${player.name}[data-col="${col}"][data-row="${row}"]`,
        );
        let oneRight = document.querySelector(
          `.grid-element-${player.name}[data-col="${col + 1}"][data-row="${row}"]`,
        );
        let twoRight = document.querySelector(
          `.grid-element-${player.name}[data-col="${col + 2}"][data-row="${row}"]`,
        );
        let oneLeft = document.querySelector(
          `.grid-element-${player.name}[data-col="${col - 1}"][data-row="${row}"]`,
        );

        if (
          (col - 1 < 0 && shipSize === 4) ||
          (col + 3 > 10 && shipSize === 4)
        ) {
          return;
        } else if (
          (col - 1 < 0 && shipSize === 3) ||
          (col + 2 > 10 && shipSize === 3)
        ) {
          return;
        } else if (
          (col < 0 && shipSize === 2) ||
          (col + 2 > 10 && shipSize === 2)
        ) {
          return;
        }

        // ELEMENTS

        if (shipSize === 3) {
          if (targetElement) targetElement.classList.add("highlight");
          if (oneRight) oneRight.classList.add("highlight");
          if (oneLeft) oneLeft.classList.add("highlight");

          currentShip = new Ship(3, [
            { x: row, y: col + 1 },
            { x: row, y: col },
            { x: row, y: col - 1 },
          ]);
        } else if (shipSize === 2) {
          if (targetElement) targetElement.classList.add("highlight");
          if (oneRight) oneRight.classList.add("highlight");

          currentShip = new Ship(2, [
            { x: row, y: col },
            { x: row, y: col + 1 },
          ]);
        } else if (shipSize === 4) {
          if (oneLeft) oneLeft.classList.add("highlight");
          if (targetElement) targetElement.classList.add("highlight");
          if (oneRight) oneRight.classList.add("highlight");
          if (twoRight) twoRight.classList.add("highlight");

          currentShip = new Ship(4, [
            { x: row, y: col - 1 },
            { x: row, y: col },
            { x: row, y: col + 1 },
            { x: row, y: col + 2 },
          ]);
        } else if (shipSize === 1) {
          if (targetElement) targetElement.classList.add("highlight");
          currentShip = new Ship(1, [{ x: row, y: col }]);
        } else {
          return;
        }

        cell.addEventListener("dragleave", () => {
          if (shipSize === 3) {
            if (oneRight) oneRight.classList.remove("highlight");
            if (targetElement) targetElement.classList.remove("highlight");
            if (oneLeft) oneLeft.classList.remove("highlight");
          } else if (shipSize === 2) {
            if (targetElement) targetElement.classList.remove("highlight");
            if (oneRight) oneRight.classList.remove("highlight");
          } else if (shipSize === 4) {
            if (oneLeft) oneLeft.classList.remove("highlight");
            if (targetElement) targetElement.classList.remove("highlight");
            if (oneRight) oneRight.classList.remove("highlight");
            if (twoRight) twoRight.classList.remove("highlight");
          } else if (shipSize === 1) {
            if (targetElement) targetElement.classList.remove("highlight");
          } else {
            return;
          }
        });
      });

      cell.addEventListener("drop", (event) => {
        event.preventDefault();

        const shipCounterOne = document.querySelector(".ship-counter-1");
        const shipCounterTwo = document.querySelector(".ship-counter-2");
        const shipCounterThree = document.querySelector(".ship-counter-3");
        const shipCounterFour = document.querySelector(".ship-counter-4");

        const shipOne = document.querySelector("#one-cell-ship");
        const shipTwo = document.querySelector("#two-cell-ship");
        const shipThree = document.querySelector("#three-cell-ship");
        const shipFour = document.querySelector("#four-cell-ship");

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

        if (this.counterOne === 0) {
          shipOne.draggable = false;
          shipOne.style.borderColor = "green";
        }
        if (this.counterTwo === 0) {
          shipTwo.draggable = false;
          shipTwo.style.borderColor = "green";
        }
        if (this.counterThree === 0) {
          shipThree.draggable = false;
          shipThree.style.borderColor = "green";
        }
        if (this.counterFour === 0) {
          shipFour.draggable = false;
          shipFour.style.borderColor = "green";
        }

        gridCells.forEach((cell) => {
          cell.classList.remove("highlight");
        });

        player.playerBoard.placeShip(currentShip);

        this.updateBoard(player);
        this.showShips();

        currentShip = null;

        if (
          this.counterOne === 0 &&
          this.counterTwo === 0 &&
          this.counterThree === 0 &&
          this.counterFour === 0 &&
          this.currentPlayer === this.player1
        ) {
          this.restartShips();
          this.hideShips(player);
          this.currentPlayer = this.player2;
          this.placeShips(this.player2);
        } else if (
          this.counterOne === 0 &&
          this.counterTwo === 0 &&
          this.counterThree === 0 &&
          this.counterFour === 0 &&
          this.currentPlayer === this.player2
        ) {
          this.hideShips(player);
          this.currentPlayer = this.player1;
          this.makeMove();
        }
      });
    });

    const showShipsButton = document.querySelector(".show-ships");
    if (showShipsButton) showShipsButton.style.display = "none";

    this.createPopup(
      `${player.name.charAt(0).toUpperCase() + player.name.slice(1)}, place your ships`,
      10000,
    );
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
        const gridElement = document.querySelector(
          `.grid-element-${player.name}[data-col="${j}"][data-row="${i}"]`,
        );

        if (player.playerBoard.board[i][j] === "S") {
          gridElement.dataset.ship = "true";
          gridElement.textContent = "";
        } else {
          gridElement.textContent = player.playerBoard.board[i][j];
        }
      }
    }
  }

  // Creates GRID for player

  renderBoard(player) {
    const gridContainer = document.createElement("div");

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
    document.querySelector(".ship-counter").style.display = "none";
    document.querySelector(".ship-manager").style.display = "none";
    document.querySelector(".show-ships").style.display = "flex";

    this.createPopup(
      `Let's begin! ${this.player1.name.slice(0, 1).toUpperCase() + this.player1.name.slice(1, this.player1.name.length)} attack first.`,
      5000,
    );

    document.querySelectorAll(".grid-container div").forEach((item) => {
      item.dataset.clicked = "false";

      item.addEventListener("click", (event) => {
        let opponent =
          this.currentPlayer === this.player1 ? this.player2 : this.player1;

        if (!event.target.classList.contains(`grid-element-${opponent.name}`)) {
          this.createPopup("You can't attack your own board!", 1000);
          return;
        }

        if (item.dataset.clicked === "false") {
          const x = parseInt(item.dataset.row);
          const y = parseInt(item.dataset.col);

          opponent.playerBoard.receiveAttack(x, y);
          item.textContent = opponent.playerBoard.board[x][y];

          let hitOrMiss = opponent.playerBoard.attackResult();

          item.dataset.clicked = "true";

          if (opponent.playerBoard.reportSunk()) {
            this.createPopup(
              `Congrats! ${this.currentPlayer.name.slice(0, 1).toUpperCase() + this.currentPlayer.name.slice(1, this.currentPlayer.name.length)} wins!`,
              4000,
            );

            this.restartGameHandler();
          } else {
            if (hitOrMiss === "Miss!") {
              this.createPopup(`${hitOrMiss}`, 1500);
              this.switchPlayer();
            } else {
              this.createPopup(
                `${hitOrMiss} Please continue, ${this.currentPlayer.name}!`,
                2000,
              );
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

    document.querySelectorAll(".grid-container div").forEach((item) => {
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
    const playerOneGrid = document.querySelectorAll(
      `.grid-element-${this.player1.name}`,
    );
    const playerTwoGrid = document.querySelectorAll(
      `.grid-element-${this.player2.name}`,
    );

    if (this.currentPlayer === this.player1) {
      playerOneGrid.forEach((item) => {
        if (item.dataset.ship === "true") {
          if (item.textContent === "X") {
            item.textContent = "X";
          } else {
            item.textContent = "S";
          }
        }
      });
    } else if (this.currentPlayer === this.player2) {
      playerTwoGrid.forEach((item) => {
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
    const playerOneGrid = document.querySelectorAll(
      `.grid-element-${this.player1.name}`,
    );
    const playerTwoGrid = document.querySelectorAll(
      `.grid-element-${this.player2.name}`,
    );

    if (this.currentPlayer === this.player1) {
      playerOneGrid.forEach((item) => {
        if (item.dataset.ship === "true") {
          if (item.textContent === "X") {
            item.textContent = "X";
          } else {
            item.textContent = "";
          }
        }
      });
    } else if (this.currentPlayer === this.player2) {
      playerTwoGrid.forEach((item) => {
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
    const playerOneGrid = document.querySelectorAll(
      `.grid-element-${this.player1.name}`,
    );
    const playerTwoGrid = document.querySelectorAll(
      `.grid-element-${this.player2.name}`,
    );

    playerOneGrid.forEach((item) => {
      if (item.dataset.ship === "true") {
        if (item.textContent === "X") {
          item.textContent = "X";
        } else {
          item.textContent = "S";
        }
      }
    });

    playerTwoGrid.forEach((item) => {
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
        let opponent =
          this.currentPlayer === this.player1 ? this.player2 : this.player1;

        this.createPopup(
          `${opponent.name.slice(0, 1).toUpperCase() + opponent.name.slice(1, opponent.name.length)} close your eyes!`,
          2000,
        );
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

    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;

    let opponent =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
    document
      .querySelectorAll(`.grid-element-${opponent.name}`)
      .forEach((item) => {
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

    form.style.display = "flex";
    boardContainer.style.display = "none";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const playerData = new FormData(event.target);
      const names = Object.fromEntries(playerData.entries());

      const playerOneCleaned = names["player_one_name"]
        .replace(/\s+/g, "_")
        .trim();
      const playerTwoCleaned = names["player_two_name"]
        .replace(/\s+/g, "_")
        .trim();

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
