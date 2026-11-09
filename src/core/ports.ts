export interface StoragePort {
	get<T>(key: string, defaultValue?: T): T | undefined;
	set<T>(key: string, value: T): void;
	delete(key: string): void;
	list(): string[];
	onChange(key: string, listener: (curr: unknown, pre: unknown, remote: boolean) => void): () => void;
}

export interface SecretPort {
	get(): string;
	set(value: string): void;
	redact(text: string): string;
}

export type HttpMethod = 'GET' | 'POST';

export interface HttpRequestOptions {
	method?: HttpMethod;
	headers?: Record<string, string>;
	data?: string;
	timeoutSeconds?: number;
}

export interface HttpResponse<T = unknown> {
	status: number;
	statusText: string;
	data: T | undefined;
	responseText: string;
	responseHeaders: string;
	finalUrl: string;
}

export interface HttpPort {
	request<T = unknown>(url: string, opts?: HttpRequestOptions): Promise<HttpResponse<T>>;
}

export interface RequestHandle {
	abort(): void;
}

export interface CancellableHttpPort extends HttpPort {
	requestCancellable<T = unknown>(
		url: string,
		opts?: HttpRequestOptions
	): { promise: Promise<HttpResponse<T>>; handle: RequestHandle };
}

export interface CacheStorePort {
	get<T>(key: string): Promise<T | undefined>;
	set<T>(key: string, value: T): Promise<void>;
	clear(): Promise<void>;
}

export interface LoggerPort {
	info(...args: unknown[]): void;
	warn(...args: unknown[]): void;
	error(...args: unknown[]): void;
}

export interface NotifyPort {
	notify(text: string, title?: string): void;
}

export interface CorePorts {
	storage: StoragePort;
	secrets: SecretPort;
	http: HttpPort;
	cache: CacheStorePort;
	logger: LoggerPort;
	notify: NotifyPort;
}
