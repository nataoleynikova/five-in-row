import HTML from './HTML.js';
import Queue from './Queue.js';
import Dots from './Dots.js';
import Dot from './Dot.js';

export default class Field {
	#gameEnd;
	#field;
	#colsNum;
	#rowsNum;
	#html;
	#queue;
	#dots;

	constructor(selector, rowsNum, colsNum) { 
		this.#gameEnd = false;
		
		this.#field = document.querySelector(selector);
		this.#colsNum = colsNum;
		this.#rowsNum = rowsNum;
		
		this.#html = new HTML;
		this.#queue = new Queue(['gamer1', 'gamer2']); 
		this.#dots = new Dots;
		
		this.#html.createTable(this.#field, this.#rowsNum, this.#colsNum); 
		this.#run();
	}
	
	#run() {
		this.#field.addEventListener('click', () => {
			let cell = event.target.closest('td:not(.gamer)');
		
			if (!this.#gameEnd && cell) {
				let col = this.#html.getPrevSiblingsNum(cell);
				let row = this.#html.getPrevSiblingsNum(cell.parentElement);
				
				let gamer = this.#queue.getGamer();
				let dot = new Dot(gamer, cell, row, col, this.#dots); 
				this.#dots.add(dot, row, col);
				console.log(dot);
				
				let winLine = this.#checkWin(dot);
				if (winLine) {
					this.#win(winLine);
				}
			}
		});
	}
	
	#win(winLine) {
		this.#gameEnd = true;
		this.#notifyWinnerCells(winLine);
	}
	
	#notifyWinnerCells(winLine) {
		winLine.forEach((dot) => {
			dot.becomeWinner();
		});
	}
	
	#checkWin(dot) {
		let dirs = [
			{deltaRow:  0, deltaCol: -1},
			{deltaRow: -1, deltaCol: -1},
			{deltaRow: -1, deltaCol:  0},
			{deltaRow: -1, deltaCol:  1},
		];
		
		for (let i = 0; i < dirs.length; 
			i++) { 
			let line = this.#checkLine(dot, dirs[i].deltaRow, 
				dirs[i].deltaCol); 
			
			if (line.length >= 5) {
				return line;
			}
		};
		
		return false;
	}
	
	#checkLine(dot, deltaRow, deltaCol) {
		let dir1 = this.#checkDir(dot,  deltaRow, deltaCol); 
		let dir2 = this.#checkDir(dot, -deltaRow, -deltaCol); 
		
		return [].concat(dir1, [dot], dir2);
	}
	
	#checkDir(dot, deltaRow, deltaCol) {
		let result = [];
		let neighbor = dot;
		
		while (true) {
			neighbor = neighbor.getNeighbor(deltaRow, deltaCol);
			
			if (neighbor) {
				result.push(neighbor);
			} else {
				return result;
			}
		}
	}
}