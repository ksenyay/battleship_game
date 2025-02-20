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
          console.log("the ship was hit");
          console.log(ship);
          this.board[x][y] = "X";
          isHit = true;
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

const ship1 = new Ship(2, [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
]);

const ship2 = new Ship(3, [
  { x: 5, y: 5 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
]);

const ship3 = new Ship(2, [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
]);

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
      this.makeMove();
    };
  }

  playerOneBoard() {
    document.querySelector(".gameboard").innerHTML = "";
    this.createPopup(
      `Let's begin! ${this.player1.name.slice(0, 1).toUpperCase() + this.player1.name.slice(1, this.player1.name.length)} attack first.`,
      2000,
    );
    this.player1.playerBoard.createBoard();

    this.player1.playerBoard.placeShip(ship1);
    this.player1.playerBoard.placeShip(ship2);
    this.renderBoard(this.player1);
  }

  playerTwoBoard() {
    this.player2.playerBoard.createBoard();

    this.player2.playerBoard.placeShip(ship3);
    this.renderBoard(this.player2);
  }

  renderNameTags() {
    const playerOneName = document.querySelector("#player-one-name");
    const playerTwoName = document.querySelector("#player-two-name");

    playerOneName.textContent = this.player1.name;
    playerTwoName.textContent = this.player2.name;
  }

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

          const hitOrMiss = opponent.playerBoard.attackResult();
          this.createPopup(hitOrMiss, 500);

          item.dataset.clicked = "true";

          if (opponent.playerBoard.reportSunk()) {
            this.createPopup(
              `Congrats! ${this.currentPlayer.name.slice(0, 1).toUpperCase() + this.currentPlayer.name.slice(1, this.currentPlayer.name.length)} wins!`,
              4000,
            );

            this.restartGameHandler();
          } else {
            this.switchPlayer();
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
    //Ensures ships are hidden when changing player
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

      boardContainer.style.display = "block";
      this.createNewGame(playerOneCleaned, playerTwoCleaned);

      form.style.display = "none";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  GameManager.getNameInputs();
});
