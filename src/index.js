import "./styles.css";

class Ship {
  constructor(length, coordinates) {
    this.length = length;
    this.hits = 0;
    this.coordinates = coordinates;

    this.isSunk = () => {
      return this.length === this.hits ? true : false;
    };
  }

  hit() {
    this.hits += 1;
  }
}

class GameBoard {
  constructor() {
    this.board = [];
    this.ships = [];

    this.render = () => {
      this.createBoard();
      this.displayBoard();
    };
  }

  createBoard() {
    for (let i = 0; i < 10; i++) {
      this.board.push(new Array(10).fill(""));
    }
  }

  displayBoard() {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");

    this.board.forEach((row) => {
      row.forEach((element) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-element");
        gridItem.textContent = element;
        gridContainer.appendChild(gridItem);
      });
    });
    document.querySelector(".gameboard").appendChild(gridContainer);
  }

  placeShip(ship) {
    ship.coordinates.forEach(({ x, y }) => {
      if (this.board[x][y] === "") {
        this.board[x][y] = "S";
      }
    });
    this.ships.push(ship);
  }

  receiveAttack(x, y) {
    let isHit = false;

    this.ships.forEach((ship) => {
      ship.coordinates.forEach(({ x: shipX, y: shipY }) => {
        if (shipX === x && shipY === y) {
          ship.hit();
          this.board[x][y] = "X";
          isHit = true;
        }
      });
    });

    if (!isHit) {
      this.board[x][y] = ".";
    }
  }

  reportSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

class Player {
  constructor() {
    this.board = new GameBoard();
  }
}

class RealPlayer extends Player {
  constructor(name) {
    super();
    this.name = name;
  }
}

class Computer extends Player {
  constructor() {
    super();
  }
}

const ship1 = new Ship(2, [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
]);

const ship2 = new Ship(3, [
  { x: 5, y: 5 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
]);

class ManageDOM {
  constructor(name1, name2) {
    this.player1 = new RealPlayer(name1);
    this.player2 = new RealPlayer(name2);

    this.init = () => {
      this.createPlayerOne();
      this.createPlayerTwo();
    };
  }

  createPlayerOne() {
    this.player1.board.render();
    this.player1.board.placeShip(ship1);
    this.player1.board.placeShip(ship2);
  }

  createPlayerTwo() {
    this.player2.board.render();
  }
}
