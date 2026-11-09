import type { CacheStorePort } from '../ports';

export class MemoryCache<K, V> {
	private store = new Map<K, V>();

	constructor(private limit: number) {}

	get(key: K): V | undefined {
		return this.store.get(key);
	}

	set(key: K, value: V): void {
		this.store.set(key, value);
		if (this.store.size > this.limit) {
			const oldest = this.store.keys().next().value;
			if (oldest !== undefined) this.store.delete(oldest);
		}
	}

	clear(): void {
		this.store.clear();
	}
}

export class TieredCache {
	constructor(
		private memory: MemoryCache<string, unknown>,
		private persistent: CacheStorePort | undefined
	) {}

	async get<T>(key: string): Promise<T | undefined> {
		const hit = this.memory.get(key) as T | undefined;
		if (hit !== undefined) return hit;
		if (!this.persistent) return undefined;
		const stored = await this.persistent.get<T>(key).catch(() => undefined);
		if (stored !== undefined) this.memory.set(key, stored);
		return stored;
	}

	async set<T>(key: string, value: T): Promise<void> {
		this.memory.set(key, value);
		if (this.persistent) void this.persistent.set(key, value).catch(() => {});
	}
}
