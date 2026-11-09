import type { CancellableHttpPort, HttpRequestOptions, HttpResponse, RequestHandle } from '../core/ports';

export class GMHttp implements CancellableHttpPort {
	request<T = unknown>(url: string, opts?: HttpRequestOptions): Promise<HttpResponse<T>> {
		return this.requestCancellable<T>(url, opts).promise;
	}

	requestCancellable<T = unknown>(
		url: string,
		opts?: HttpRequestOptions
	): { promise: Promise<HttpResponse<T>>; handle: RequestHandle } {
		let raw: { abort(): void } | undefined;
		const promise = new Promise<HttpResponse<T>>((resolve, reject) => {
			raw = GM_xmlhttpRequest<T>({
				url,
				method: opts?.method ?? 'GET',
				headers: opts?.headers,
				data: opts?.data,
				responseType: 'json',
				timeout: Math.max(10, opts?.timeoutSeconds ?? 30) * 1000,
				onload: (response) =>
					resolve({
						status: response.status,
						statusText: response.statusText,
						data: response.response ?? undefined,
						responseText: response.responseText,
						responseHeaders: response.responseHeaders,
						finalUrl: response.finalUrl,
					}),
				onerror: () => reject(Object.assign(new Error('网络请求失败'), { status: 0, retriable: true })),
				ontimeout: () => reject(Object.assign(new Error('请求超时'), { status: 408, retriable: true })),
				onabort: () => reject(Object.assign(new Error('请求已取消'), { status: 0 })),
			});
		});
		return { promise, handle: { abort: () => raw?.abort() } };
	}
}
