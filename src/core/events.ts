type Listener = (...args: unknown[]) => void;

export class EventBus {
	private listeners = new Map<string, Set<Listener>>();

	on(event: string, listener: Listener): () => void {
		let set = this.listeners.get(event);
		if (!set) {
			set = new Set();
			this.listeners.set(event, set);
		}
		set.add(listener);
		return () => this.off(event, listener);
	}

	off(event: string, listener: Listener): void {
		this.listeners.get(event)?.delete(listener);
	}

	emit(event: string, ...args: unknown[]): void {
		for (const listener of this.listeners.get(event) ?? []) {
			try {
				listener(...args);
			} catch (e) {
				console.error('[OCS] event listener error', event, e);
			}
		}
	}
}

export const AppEvents = {
	AnswerReceived: 'answer:received',
	StatusChanged: 'status:changed',
	ConfigChanged: 'config:changed',
} as const;
