import type { AnswerRequest, AnswerResponse, FeedbackRequest, HealthResponse } from '../../shared/protocol';

export class ServerTransport {
	constructor(private baseUrl: string) {}

	health(): Promise<HealthResponse> {
		return this.post<HealthResponse>('/health', undefined, 'GET');
	}

	answer(req: AnswerRequest): Promise<AnswerResponse> {
		return this.post<AnswerResponse>('/api/answer', req);
	}

	feedback(req: FeedbackRequest): Promise<void> {
		return this.post<void>('/api/feedback', req);
	}

	private post<T>(path: string, body?: unknown, method: 'GET' | 'POST' = 'POST'): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			GM_xmlhttpRequest<T>({
				url: this.baseUrl.replace(/\/$/, '') + path,
				method,
				headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
				data: body === undefined ? undefined : JSON.stringify(body),
				responseType: 'json',
				timeout: 180_000,
				onload: (response) => {
					if (response.status >= 200 && response.status < 300) {
						resolve(response.response as T);
					} else {
						reject(new Error(`本地 server 返回 HTTP ${response.status}`));
					}
				},
				onerror: () => reject(new Error(`无法连接本地 server（${this.baseUrl}），请确认已启动`)),
				ontimeout: () => reject(new Error('本地 server 响应超时')),
			});
		});
	}
}
