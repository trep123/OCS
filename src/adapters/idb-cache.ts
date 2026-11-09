import type { CacheStorePort } from '../core/ports';

const DB_NAME = 'ocs-ai-answer-cache';
const STORE = 'answers';
const TTL_MS = 30 * 24 * 3600 * 1000;
const LIMIT = 3000;

export class IndexedDBCache implements CacheStorePort {
	private dbPromise: Promise<IDBDatabase> | null = null;
	private writes = 0;

	private db(): Promise<IDBDatabase> {
		if (!this.dbPromise) {
			this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
				const req = indexedDB.open(DB_NAME, 1);
				req.onupgradeneeded = () => {
					const db = req.result;
					if (!db.objectStoreNames.contains(STORE)) {
						db.createObjectStore(STORE, { keyPath: 'k' }).createIndex('t', 't');
					}
				};
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => reject(req.error);
			}).catch((e) => {
				this.dbPromise = null;
				throw e;
			});
		}
		return this.dbPromise;
	}

	private async hashKey(raw: string): Promise<string> {
		try {
			const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
			return Array.from(new Uint8Array(digest))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
		} catch {
			return raw;
		}
	}

	async get<T>(key: string): Promise<T | undefined> {
		const db = await this.db();
		const k = await this.hashKey(key);
		const row = await new Promise<{ k: string; v: T; t: number } | undefined>((resolve, reject) => {
			const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(k);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
		if (!row || Date.now() - row.t > TTL_MS) return undefined;
		return row.v;
	}

	async set<T>(key: string, value: T): Promise<void> {
		const db = await this.db();
		const k = await this.hashKey(key);
		const store = db.transaction(STORE, 'readwrite').objectStore(STORE);
		store.put({ k, v: value, t: Date.now() });
		if (++this.writes % 50 === 0) await this.evict(store);
	}

	private evict(store: IDBObjectStore): Promise<void> {
		return new Promise((resolve) => {
			const countReq = store.count();
			countReq.onsuccess = () => {
				let excess = countReq.result - LIMIT;
				if (excess <= 0) return resolve();
				store.index('t').openCursor().onsuccess = (event) => {
					const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
					if (!cursor || excess-- <= 0) return resolve();
					cursor.delete();
					cursor.continue();
				};
			};
			countReq.onerror = () => resolve();
		});
	}

	async clear(): Promise<void> {
		const db = await this.db();
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			tx.objectStore(STORE).clear();
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}
}
