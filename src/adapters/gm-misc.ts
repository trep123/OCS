import type { LoggerPort, NotifyPort } from '../core/ports';

export class ConsoleLogger implements LoggerPort {
	constructor(private prefix = '[OCS]') {}
	info(...args: unknown[]): void {
		console.info(this.prefix, ...args);
	}
	warn(...args: unknown[]): void {
		console.warn(this.prefix, ...args);
	}
	error(...args: unknown[]): void {
		console.error(this.prefix, ...args);
	}
}

export class GMNotify implements NotifyPort {
	notify(text: string, title = 'OCS 网课助手'): void {
		GM_notification({ title, text, timeout: 30_000, silent: true });
	}
}
