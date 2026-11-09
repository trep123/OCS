import type { ServerConfig } from '../config';

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export class AIRequestError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly retriable: boolean
	) {
		super(message);
	}
}

export async function chatCompletion(ai: ServerConfig['ai'], messages: ChatMessage[]): Promise<string> {
	let lastError: unknown;
	for (let attempt = 0; attempt <= 2; attempt++) {
		if (attempt > 0) await sleep(1000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 500));
		try {
			return await requestOnce(ai, messages);
		} catch (e) {
			lastError = e;
			if (!(e instanceof AIRequestError) || !e.retriable) break;
		}
	}
	throw lastError instanceof Error ? lastError : new Error('AI 请求失败');
}

async function requestOnce(ai: ServerConfig['ai'], messages: ChatMessage[]): Promise<string> {
	const response = await fetch(`${ai.baseUrl}/chat/completions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ai.apiKey}` },
		body: JSON.stringify({
			model: ai.model,
			messages,
			temperature: ai.temperature,
			max_tokens: ai.maxTokens,
			response_format: { type: 'json_object' },
			stream: false,
		}),
		signal: AbortSignal.timeout(ai.timeoutSeconds * 1000),
	});
	if (!response.ok) {
		const detail = (await response.text().catch(() => '')).slice(0, 300);
		throw new AIRequestError(
			`HTTP ${response.status}${detail ? `：${detail}` : ''}`,
			response.status,
			response.status === 408 || response.status === 429 || response.status >= 500
		);
	}
	const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
	const content = data.choices?.[0]?.message?.content;
	if (!content?.trim()) throw new AIRequestError('模型返回空内容', 0, true);
	return content;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
