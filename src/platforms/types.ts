import type { CorePorts } from '../core/ports';
import type { AnswerResult, QuestionContext } from '../core/types';

export interface PlatformDeps extends CorePorts {
	abortAll(): void;
}

export interface PlatformSession {
	start(): void;
	stop(): void;
	observeQuestions(onQuestion: (question: QuestionContext) => void): () => void;
	writeAnswer(question: QuestionContext, result: AnswerResult): Promise<boolean>;
}

export interface Platform {
	readonly id: string;
	readonly name: string;
	detect(url: URL): boolean;
	createSession(deps: PlatformDeps): PlatformSession;
}
