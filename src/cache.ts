export default class Cache<T> {
	private data?: T;
	private expireAt: number;
	private cacheTime: number;

	constructor(cacheTime: number) {
		this.expireAt = Date.now() + cacheTime;
		this.cacheTime = cacheTime;
	}

	valid(): boolean {
		if (!this.data || Date.now() >= this.expireAt) {
			return false;
		}

		return true;
	}

	update(data: T): void {
		this.expireAt = Date.now() + this.cacheTime;
		this.data = data;
	}

	get(): T | undefined {
		return this.data;
	}
}