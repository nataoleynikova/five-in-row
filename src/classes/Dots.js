export default class Dots {
	#dots;
	
	constructor() {
		this.#dots = {};
	}
	
	add(dot, row, col) {
		if (this.#dots[row] === undefined) {
			this.#dots[row] = {};
		}
		
		this.#dots[row][col] = dot;
	}
	
	get(row, col) {
		if (this.#dots[row] && this.#dots[row][col]) {
			return this.#dots[row][col];
		} else {
			return undefined;
		}
	}
}