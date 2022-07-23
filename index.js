document.addEventListener('DOMContentLoaded', function() {

  let game = document.getElementById('game');
  let field = game.querySelector('.field');

  let rowsNum = 30;
  let colsNum = 30;
  let gamers = ['gamer1', 'gamer2'];
  let gamerNum = 0;

  let rows = fillField(field, rowsNum, colsNum);
  let cols = getColumns(rows);
  let diagonal1 = getFirstDiagonals(rows);
  // let diagonal2 = getSecondDiagonals(rows);
  let lines = rows.concat(cols, diagonal1);

  // отрисовка поля
  function fillField (field, rowsNum, colsNum) {
    let rows = [];

    for (let i = 0; i < rowsNum; i++) {
      let tr = document.createElement('tr');
      rows[i] = [];

      for (let j = 0; j < colsNum; j++) {
        let td = document.createElement('td');
        tr.appendChild(td);
        td.addEventListener('click', cellClickHandler);
        rows[i][j] = td;
      };

      field.appendChild(tr);
    };

    return rows;
  };

  // получение данных
  function getColumns(arr) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (result[j] === undefined) {
          result[j] = [];
        };
        result[j][i] = arr[i][j];
      };
    };

    return result;
  };

  function getFirstDiagonals(arr) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (result[i + j] === undefined) {
          result[i + j] = [];
        };
        result[j + i].push(arr[i][j]);
      };
    };

    return result;
  };

  // function getSecondDiagonals(result, arr) {
  //   return getFirstDiagonals[result].reverse(arr);
  // };

  // реагирование поля по клику на ячейку
  function cellClickHandler () {
    this.classList.add(gamers[gamerNum]);
    this.removeEventListener('click', cellClickHandler);

    isWin(gamers, lines);

    gamerNum++;
    
    if (gamerNum == gamers.length) {
      gamerNum = 0;
    };
  };

  // определение победителя
  function checkWinner(gamers, lines) {
    for (let i = 0; i < lines.length; i++) {
      for (let j = 4; j < lines[i].length; j++) {
        if (
            lines[i][j - 4].classList.contains(gamers) && 
            lines[i][j - 3].classList.contains(gamers) && 
            lines[i][j - 2].classList.contains(gamers) && 
            lines[i][j - 1].classList.contains(gamers) && 
            lines[i][j].classList.contains(gamers)
          ) {
          return true;
        }
      }
    }
    return false;
  }

  // окончание игры
  function isWin(gamers, lines) {
    for (let i = 0; i < gamers.length; i++) {
      if (checkWinner(gamers[i], lines)) {
        endGame(gamers[i]);
        break;
      };
    };
  };

  function endGame(gamer) {
    alert(gamer);
    freezeField(field);
  };

  function freezeField(field) {
    let cells = field.querySelectorAll('td');
    for (let i = 0; i < cells.length; i++) {
      cells[i].removeEventListener('click', cellClickHandler);
    };
  };
})