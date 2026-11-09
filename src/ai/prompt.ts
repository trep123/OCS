import type { QuestionContext } from '../core/types';

export const DEFAULT_AI_SYSTEM_PROMPT =
	'你是一个答题助手。只输出 JSON 对象，不要输出任何其他文字。格式：{"answer": string[]}';

export function buildAIQuestionPrompt(question: QuestionContext): string {
	const lines: string[] = [`题目类型：${question.type}`, `题干：${question.title}`];
	if (question.options.length) {
		lines.push('选项：', ...question.options.map((o, i) => `${i}. ${o}`));
	}
	lines.push('请按要求输出 JSON。');
	return lines.join('\n');
}
