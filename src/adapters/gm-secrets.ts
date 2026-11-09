import type { SecretPort, StoragePort } from '../core/ports';

export const AI_SECRET_KEY = 'ai.secret';

export class GMSecrets implements SecretPort {
	constructor(private storage: StoragePort) {}

	get(): string {
		return String(this.storage.get(AI_SECRET_KEY, '') || '');
	}

	set(value: string): void {
		const secret = String(value || '').trim();
		if (secret) this.storage.set(AI_SECRET_KEY, secret);
		else this.storage.delete(AI_SECRET_KEY);
	}

	redact(text: string): string {
		let out = String(text ?? '');
		const secret = this.get();
		if (secret) out = out.split(secret).join('[已遮罩]');
		return out.replace(/Bearer\s+[A-Za-z0-9._~+/-]{8,}/gi, 'Bearer [已遮罩]');
	}
}
