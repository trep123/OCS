import type { StoragePort } from '../core/ports';

export class GMStorage implements StoragePort {
	get<T>(key: string, defaultValue?: T): T | undefined {
		return GM_getValue<T>(key, defaultValue);
	}

	set<T>(key: string, value: T): void {
		GM_setValue(key, value as unknown as Tampermonkey.StorageValue);
	}

	delete(key: string): void {
		GM_deleteValue(key);
	}

	list(): string[] {
		return GM_listValues();
	}

	onChange(key: string, listener: (curr: unknown, pre: unknown, remote: boolean) => void): () => void {
		const id = GM_addValueChangeListener(key, (_, pre, curr, remote) => listener(curr, pre, remote));
		return () => GM_removeValueChangeListener(id);
	}
}
