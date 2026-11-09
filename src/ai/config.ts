export type AIProviderId = 'deepseek' | 'qwen' | 'openai' | 'llama' | 'custom';

export interface AIProviderProfile {
	id: AIProviderId;
	name: string;
	endpoint: string;
	model: string;
	needsKey: boolean;
}

export const AI_PROVIDERS: Record<AIProviderId, AIProviderProfile> = {
	deepseek: { id: 'deepseek', name: 'DeepSeek', endpoint: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', needsKey: true },
	qwen: { id: 'qwen', name: '通义千问', endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-plus', needsKey: true },
	openai: { id: 'openai', name: 'OpenAI', endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini', needsKey: true },
	llama: { id: 'llama', name: '本地 llama.cpp', endpoint: 'http://127.0.0.1:8080/v1/chat/completions', model: 'local', needsKey: false },
	custom: { id: 'custom', name: '自定义', endpoint: '', model: '', needsKey: false },
};

export interface AIConfig {
	provider: AIProviderId;
	endpoint: string;
	model: string;
	temperature: number;
	maxTokens: number;
	timeoutSeconds: number;
	retries: number;
	systemPrompt: string;
}

export function getAIConfigError(config: AIConfig, apiKey: string): string {
	if (!config.endpoint) return '请先配置 AI Endpoint';
	try {
		const url = new URL(config.endpoint);
		if (!['http:', 'https:'].includes(url.protocol)) return 'AI Endpoint 只允许 HTTP 或 HTTPS';
	} catch {
		return 'AI Endpoint 格式不正确';
	}
	if (!config.model) return '请先配置 AI 模型名称';
	const profile = AI_PROVIDERS[config.provider] ?? AI_PROVIDERS.custom;
	if (profile.needsKey && !apiKey) return '请先配置 AI API Key';
	return '';
}
