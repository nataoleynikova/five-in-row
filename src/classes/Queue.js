import Counter from './Counter.js';

export default class Queue {
	#gamers;
	#counter;

	constructor(gamers) {
		this.#gamers = gamers;
		this.#counter = new Counter(this.#gamers.length);
	}
	
	getGamer() {
		return this.#gamers[this.#counter.get()];
	}
}