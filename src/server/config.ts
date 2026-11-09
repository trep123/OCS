export interface ServerConfig {
	host: string;
	port: number;
	dataDir: string;
	ai: {
		baseUrl: string;
		apiKey: string;
		model: string;
		timeoutSeconds: number;
		temperature: number;
		maxTokens: number;
	};
}

export const config: ServerConfig = {
	host: process.env.OCS_HOST ?? '127.0.0.1',
	port: Number(process.env.OCS_PORT ?? 19818),
	dataDir: process.env.OCS_DATA_DIR ?? 'data',
	ai: {
		baseUrl: (process.env.OCS_AI_BASE ?? 'https://api.deepseek.com').replace(/\/$/, ''),
		apiKey: process.env.OCS_AI_KEY ?? '',
		model: process.env.OCS_AI_MODEL ?? 'deepseek-chat',
		timeoutSeconds: Number(process.env.OCS_AI_TIMEOUT ?? 90),
		temperature: Number(process.env.OCS_AI_TEMPERATURE ?? 0.1),
		maxTokens: Number(process.env.OCS_AI_MAX_TOKENS ?? 4096),
	},
};
