import type { AnswerItem, QuestionContext } from '../../shared/protocol';

export interface PlatformSession {
	start(): void;
	stop(): void;
	observeQuestions(onQuestion: (question: QuestionContext) => void): () => void;
	writeAnswer(question: QuestionContext, answers: AnswerItem[]): Promise<boolean>;
}

export interface Platform {
	readonly id: string;
	readonly name: string;
	detect(url: URL): boolean;
	createSession(): PlatformSession;
}
