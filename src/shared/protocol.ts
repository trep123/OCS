export type QuestionType = 'single' | 'multiple' | 'completion' | 'judgement' | 'reader';

export interface QuestionContext {
	id: string;
	type: QuestionType;
	title: string;
	options: string[];
	images: string[];
}

export interface AnswerItem {
	answer: string;
	optionIndex?: number;
	confidence?: number;
	explanation?: string;
}

export interface AnswerRequest {
	sessionId: string;
	platform: string;
	url: string;
	question: QuestionContext;
}

export type AnswerSource = 'session' | 'kb' | 'ai';

export interface AnswerResponse {
	ok: boolean;
	answers: AnswerItem[];
	source?: AnswerSource;
	error?: string;
}

export interface FeedbackRequest {
	sessionId: string;
	platform: string;
	questionId: string;
	questionTitle: string;
	correct: boolean;
}

export interface HealthResponse {
	ok: boolean;
	aiConfigured: boolean;
	kbDocuments: number;
	sessionRecords: number;
}
