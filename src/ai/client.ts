import type { HttpPort, LoggerPort, SecretPort } from '../core/ports';
import type { AnswererPort, AnswerResult, QuestionContext } from '../core/types';
import type { AIConfig } from './config';

export interface AIAnswerClientDeps {
	http: HttpPort;
	secrets: SecretPort;
	logger: LoggerPort;
	getConfig(): AIConfig;
}

export class AIAnswerClient implements AnswererPort {
	constructor(private deps: AIAnswerClientDeps) {}

	async answer(question: QuestionContext): Promise<AnswerResult> {
		void question;
		void this.deps;
		throw new Error('TODO: 从 legacy bundle 迁移 aiAnswerRequest 状态机（重试/参数降级/JSON 修复）');
	}
}
