export type QuestionType = 'single' | 'multiple' | 'completion' | 'judgement' | 'reader';

export interface QuestionContext {
	id: string;
	type: QuestionType;
	title: string;
	options: string[];
	images: string[];
	root?: Element;
}

export interface AnswerItem {
	answer: string;
	optionIndex?: number;
	confidence?: number;
	explanation?: string;
}

export interface AnswerResult {
	questionId: string;
	results: AnswerItem[];
	error?: string;
}

export interface AnswererPort {
	answer(question: QuestionContext): Promise<AnswerResult>;
}
