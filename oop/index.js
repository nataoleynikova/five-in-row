//import HTML from './classes/HTML.js';

// отрисовка поля
class HTML {
  createTable(parent, rowsNum, colsNum) {
    
    let table = document.createElement('table');

    for (let i = 0; i < rowsNum; i++) {
      let tr = document.createElement('tr');

      for (let j = 0; j < colsNum; j++) {
        let td = document.createElement('td');
        tr.appendChild(td);
      };

      table.appendChild(tr);
    };

    parent.appendChild(table);
  };

  getPreviousRelatives(element) {
    let previous = element.previousRelatives;
    let i = 0;

    while (previous) {
      previous = element.previousRelatives;
      i++
    };

    return i;
  };
}

// работа с полем: запуск поля, начало игры, определение победителя
class Field {
  constructor(selector, rowsNum, colsNum) {
    this._field = document.querySelector(selector);
    this._rowsNum = rowsNum;
    this._colsNum = colsNum;
    
    this._html = new HTML;
    this._html.createTable(this._field, this._rowsNum, this._colsNum);
    
    this._gamers = new Gamers(['gamer1', 'gamer2']);
    this._dots = new Dots;

    this._gameEnd = false;
    this._run();
  };

  _run() {
    this._field.addEventListener('click', () => {
      let cell = event.target.closest('td:not(.gamer)');
      
      if (!this._gameEnd && cell) {
        let row = this._html.getPreviousRelatives(cell.parentElement);
        let col = this._html.getPreviousRelatives(cell);
        
        let gamer = this._gamers.getGamer();
        let dot = new Dot(gamer, row, col, cell, this._dots);
        this._dots.addDots(dot, row, col);

        let winLine = this._checkWin(dot);

        if (winLine) {
          this._win(winLine);
        };
      };
    });
  };

  _win(winLine) {
    this._gameEnd = true;
    this._notifyWinnerCells(winLine);
  };

  _checkDirections(dot, changedRow, changedCol) {
    let result = [];
    let neighbor = dot;

    while (true) {
      neighbor = Neighbours.getNeighbor(changedRow, changedCol);

      if (neighbor) {
        result.push(neighbor);
      } else {
        return result;
      };
    };
  };

  _checkLine(dot, changedRow, changedCol) {
    let direction1 = this._checkDirections(dot, changedRow, changedCol);
    let direction2 = this._checkDirections(dot, -changedRow, -changedCol);

    return [].concat(direction1, [dot], direction2);
  };
  
  _checkWin(dot) {
    let directions = [
      {changedRow: 0, changedCol: -1},
      {changedRow: -1, changedCol: -1},
      {changedRow: -1, changedCol:  0},
			{changedRow: -1, changedCol:  1},
    ];

    for (let i = 0; i < directions.length; i++) {
      let line = this._checkLine(dot, directions[i].changedRow, directions[i].changedCol);

      if (line.length >= 5) {
        return line;
      };
    };

    return false;
  };

  becomeWinner() {
    this._element.classList.add('winner');
  };

  _notifyWinnerCells(winLine) {
    winLine.forEach((dot) => {dot.becomeWinner()});
  };
}

// определение игрока и очередности хода
class Gamers {
  constructor(gamers) {
    this._gamers = gamers;
    this._counter = new Counter(this._gamers.length);
  };

  getGamer() {
    return this._gamers[this._counter.getCounter()];
  }
};

// счетчик игроков
class Counter {
  constructor(length) {
    this._length = length;
    this._counter = null;
  };

  getCounter() {
    if (this._counter == null) {
      this._counter = 0;
    } else {
      this._counter++;
    };

    if (this._counter == this._length) {
      this._counter = 0;
    };

    return this._counter;
  };
}

// постановка точек
class Dots {
  constructor() {
    this._dots = {};
  };

  addDots(row, col, dot) {
    if (this._dots[row] === undefined) {
      this._dots[row] = {};
    };

    this._dots[row][col] = dot;
  };

  getDots(row, col) {
    if (this._dots[row] && this._dots[row][col]) {
      return this._dots[row][col];
    } else {
      return undefined;
    };
  };
}

// определение конкретной точки
class Dot {
  constructor(gamer, element, row, col, dots) {
    this._gamer = gamer;
    this._element = element;
    this._row = row;
    this._col = col;
    this._dots = dots;
  };

  getRow() {
    return this._row;
  };

  getCol() {
    return this._col;
  };

  // becomeWinner() {
  //   this._element.classList.add('winner');
  // };
}

// работа с соседними точками от заданной
class Neighbours extends Dot {
  constructor(gamer, element, row, col, dots) {
    super(gamer, element, row, col, dots);
    this._neighbours = {};

    this._findNeighbours();
    this._notifyNeighbours();
    this._reflectNeighbours();
  };

  addNeighbor(neighbor) {
    let changedRow = neighbor.getRow() - this._row;
    let changedCol = neighbor.getCol() - this._col;

    if (this._neighbours[changedRow] === undefined) {
      this._neighbours[changedRow] = {};
    };

    this._neighbours[changedRow][changedCol] = neighbor;
  };

  getNeighbor(changedRow, changedCol) {
    if (this._neighbours[changedRow] !== undefined) {
      return this._neighbours[changedRow][changedCol];
    } else {
      return undefined;
    };
  };

  _belongsTo(gamer) {
    return this._gamer == gamer;
  };

  _possibleNeighbor(changedRow, changedCol) {
    let neighbor = this._dots.getDots(this._row + changedRow, this._col + changedCol);

    if (neighbor !== undefined && neighbor._belongsTo(this._gamer)) {
      this.addNeighbor(neighbor);
    };
  };

  _findNeighbours() {
    this._possibleNeighbor(1, 1);
    this._possibleNeighbor(1, 0);
    this._possibleNeighbor(1, -1);
    this._possibleNeighbor(-1, 1);
    this._possibleNeighbor(-1, 0);
    this._possibleNeighbor(-1, -1);
    this._possibleNeighbor(0, 1);
    this._possibleNeighbor(0, -1);
  };

  _notifyNeighbours() {
    for (let rowKey in this._neighbours) {
      for (let colKey in this._neighbours[rowKey]) {
        this._neighbours[rowKey][colKey].addNeighbor(this);
      };
    };
  };

  _reflectNeighbours() {
    this._element.classList.add('gamer');
    this._element.classList.add(this._gamer);
  };
}

let field = new Field ('#game', 30, 30);