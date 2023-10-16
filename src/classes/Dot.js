export default class Dot {
	#gamer;
	#elem;
	#row;
	#col;
	#dots;
	#neighbors;
	
	constructor(gamer, elem, row, col, dots) { 
		this.#gamer = gamer;
		this.#elem = elem;
		this.#row = row;
		this.#col = col;
		this.#dots = dots;
		
		this.#neighbors = {};
		
		this.#findNeighbors();
		this.#notifyNeighbors();
		this.#reflect();
	}
	
	getRow() {
		return this.#row;
	}
	
	getCol() {
		return this.#col;
	}
	
	becomeWinner() {
		this.#elem.classList.add('winner');
	}
	
	getNeighbor(deltaRow, deltaCol) {
		if (this.#neighbors[deltaRow] !== undefined) {
			return this.#neighbors[deltaRow][deltaCol];
		} else {
			return undefined;
		}
	}
	
	addNeighbor(neighbor) {
		let deltaRow = neighbor.getRow() - this.#row;
		let deltaCol = neighbor.getCol() - this.#col;
		
		if (this.#neighbors[deltaRow] === undefined) {
			this.#neighbors[deltaRow] = {};
		}
		
		this.#neighbors[deltaRow][deltaCol] = neighbor;
	}
	
	#findNeighbors() {
		this.#considerNeighbor(1, 1);
		this.#considerNeighbor(1, 0);
		this.#considerNeighbor(1, -1);
		this.#considerNeighbor(-1, 1);
		this.#considerNeighbor(-1, 0);
		this.#considerNeighbor(-1, -1);
		this.#considerNeighbor(0, 1);
		this.#considerNeighbor(0, -1);
	}
	
	#considerNeighbor(deltaRow, deltaCol) {
		let neighbor = this.#dots.get(this.#row + deltaRow, this.#col + deltaCol); 
		
		if (neighbor !== undefined && neighbor.#belongsTo(this.#gamer)) {
			this.addNeighbor(neighbor);
		}
	}
	
	#notifyNeighbors() {
		for (let rowKey in this.#neighbors) {
			for (let colKey in this.#neighbors[rowKey]) {
				this.#neighbors[rowKey][colKey].addNeighbor(this);
			}
		}
	}
	
	#reflect() {
		this.#elem.classList.add('gamer');
		this.#elem.classList.add(this.#gamer);
	}
	
	#belongsTo(gamer) {
		return this.#gamer == gamer;
	}
}