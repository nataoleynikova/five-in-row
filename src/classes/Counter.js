export default class Counter {
	#length;
	#counter;
	
	constructor(length) {
		this.#length = length;
		this.#counter = null;
	}
	
	get() {
		if (this.#counter == null) {
			this.#counter = 0;
		} else {
			this.#counter++;
			
			if (this.#counter == this.#length) {
				this.#counter = 0;
			}
		}
		
		return this.#counter;
	}

	
}