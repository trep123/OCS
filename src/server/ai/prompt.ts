import type { AnswerItem, QuestionContext } from '../../shared/protocol';
import type { ChatMessage } from './client';

export function buildMessages(question: QuestionContext, kbSnippets: string[]): ChatMessage[] {
	const system = [
		'你是网课答题助手。只输出一个 JSON 对象，不要 markdown、注释或任何多余文字。',
		'格式：{"answers":[{"answer":"答案文本","optionIndex":选项序号或省略,"confidence":0到1,"explanation":"一句话解析或省略"}]}',
		'选择题给出应选选项的完整文本与 optionIndex（从 0 开始）；填空题 answers 数组逐项对应每个空；判断题 answer 为"对"或"错"。',
		kbSnippets.length
			? `优先严格依据以下资料作答，资料未覆盖时使用通用知识，答案中不要提及"资料"或"检索"：\n\n${kbSnippets.join('\n\n---\n\n')}`
			: '',
	]
		.filter(Boolean)
		.join('\n');

	const lines = [`题目类型：${question.type}`, `题干：${question.title}`];
	if (question.options.length) {
		lines.push('选项：', ...question.options.map((o, i) => `[${i}] ${o}`));
	}
	return [
		{ role: 'system', content: system },
		{ role: 'user', content: lines.join('\n') },
	];
}

export function parseAnswerJson(raw: string, question: QuestionContext): AnswerItem[] {
	const text = raw.trim();
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		const match = /\{[\s\S]*\}/.exec(text);
		if (!match) throw new Error('模型输出中未找到 JSON 对象');
		parsed = JSON.parse(match[0]);
	}
	const obj = parsed as { answers?: unknown; answer?: unknown };
	const list = Array.isArray(obj.answers)
		? obj.answers
		: typeof obj.answers === 'string'
			? [obj.answers]
			: Array.isArray(obj.answer)
				? obj.answer
				: obj.answer !== undefined
					? [obj.answer]
					: [];
	if (!list.length) throw new Error('模型输出中没有 answers 字段');
	const items = list.map((entry): AnswerItem => {
		if (typeof entry === 'string') return { answer: entry };
		const item = entry as Partial<AnswerItem>;
		return {
			answer: String(item.answer ?? ''),
			optionIndex: Number.isInteger(item.optionIndex) ? item.optionIndex : undefined,
			confidence: typeof item.confidence === 'number' ? item.confidence : undefined,
			explanation: typeof item.explanation === 'string' ? item.explanation : undefined,
		};
	});
	if (question.options.length) {
		for (const item of items) {
			if (item.optionIndex === undefined) {
				const idx = question.options.findIndex(
					(o) => o.trim() === item.answer.trim() || o.includes(item.answer.trim())
				);
				if (idx >= 0) item.optionIndex = idx;
			}
		}
	}
	return items.filter((item) => item.answer.trim() || item.optionIndex !== undefined);
}
