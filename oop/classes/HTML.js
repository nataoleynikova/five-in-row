export default class HTML {
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
}