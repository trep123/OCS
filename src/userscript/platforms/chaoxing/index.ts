import type { AnswerItem, QuestionContext, QuestionType } from '../../../shared/protocol';
import type { Platform, PlatformSession } from '../types';

const CX_TYPE_MAP: Record<number, QuestionType> = {
	0: 'single',
	1: 'multiple',
	3: 'judgement',
	2: 'completion',
	4: 'completion',
	5: 'completion',
	6: 'completion',
	7: 'completion',
	8: 'completion',
	9: 'completion',
	10: 'completion',
	14: 'reader',
	15: 'reader',
};

const CHAPTER_TITLE_SELECTORS = ['.Zy_TItle .clearfix', '.firstUlList', '.secondUlList'];
const WORK_TITLE_SELECTORS = ['.splitS-left .mark_name', '.line_wid_half.fl', '.line_wid_half.fr'];
const CHAPTER_OPTION_SELECTOR = 'ul li .after, ul li textarea, ul textarea, ul li label:not(.before)';
const WORK_OPTION_SELECTOR = '.answerBg .answer_p, .textDIV, .eidtDiv';
const TYPE_INPUT_SELECTOR = 'input[id^="answertype"], input[name^="type"]';

interface Extracted {
	root: Element;
	options: Element[];
	type?: QuestionType;
}

function cleanTitle(raw: string): string {
	return raw
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/^\d+[、.。]\s*/, '')
		.replace(/（\d+(\.\d+)?分）/g, '')
		.replace(/\(\s*\d+\s*题,\s*\d+(\.\d+)?分\s*\)/g, '')
		.replace(/[（(【[](单选题|多选题|判断题|填空题|简答题|名词解释|完形填空|阅读理解)[）)】]/g, '')
		.trim();
}

function readTypeInput(root: Element): QuestionType | undefined {
	const input = root.querySelector<HTMLInputElement>(TYPE_INPUT_SELECTOR);
	const value = input ? parseInt(input.value, 10) : NaN;
	return CX_TYPE_MAP[value];
}

function collectImages(root: Element): string[] {
	return [...root.querySelectorAll('img')]
		.map((img) => img.src)
		.filter((src) => /^https?:/.test(src));
}

function extract(root: Element): Extracted | undefined {
	const isChapter = root.classList.contains('TiMu');
	const optionSelector = isChapter ? CHAPTER_OPTION_SELECTOR : WORK_OPTION_SELECTOR;
	const options = [...root.querySelectorAll(optionSelector)].filter(
		(el) => el.tagName !== 'TEXTAREA' && el.tagName !== 'IFRAME' ? Boolean(el.textContent?.trim()) : true
	);
	return { root, options, type: readTypeInput(root) };
}

function titleOf(root: Element): string {
	const isChapter = root.classList.contains('TiMu');
	const selectors = isChapter ? CHAPTER_TITLE_SELECTORS : WORK_TITLE_SELECTORS;
	const parts = selectors
		.map((sel) => root.querySelector(sel))
		.filter((el): el is Element => Boolean(el?.textContent?.trim()))
		.map((el) => el.textContent?.trim() ?? '');
	return cleanTitle(parts.join(isChapter ? ',' : '\n'));
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function dispatchInput(el: Element): void {
	const win = el.ownerDocument?.defaultView;
	if (!win) return;
	el.dispatchEvent(new win.Event('input', { bubbles: true }));
	el.dispatchEvent(new win.Event('change', { bubbles: true }));
}

function isOptionChecked(option: Element): boolean {
	const box = option.closest('li') ?? option.parentElement;
	if (!box) return false;
	if (box.getAttribute('aria-checked') === 'true') return true;
	return Boolean(box.querySelector('input:checked, input[checked="checked"]'));
}

function resolveOptionElement(ex: Extracted, item: AnswerItem): Element | undefined {
	if (item.optionIndex !== undefined && ex.options[item.optionIndex]) return ex.options[item.optionIndex];
	const target = item.answer.trim();
	if (!target) return undefined;
	return ex.options.find((o) => {
		const text = (o.textContent ?? '').trim();
		return text === target || text.includes(target) || target.includes(text);
	});
}

function createSession(): PlatformSession {
	const registry = new Map<string, Extracted>();
	const seen = new WeakSet<Element>();
	let counter = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	function documents(): Document[] {
		const docs: Document[] = [document];
		for (const frame of document.querySelectorAll('iframe')) {
			try {
				const doc = frame.contentDocument;
				if (doc && doc.querySelector('.TiMu, .questionLi')) docs.push(doc);
			} catch {
				/* 跨域 iframe 跳过 */
			}
		}
		return docs;
	}

	function scan(cb: (q: QuestionContext) => void): void {
		for (const doc of documents()) {
			for (const root of doc.querySelectorAll('.TiMu, .questionLi')) {
				if (seen.has(root)) continue;
				seen.add(root);
				const title = titleOf(root);
				if (!title) continue;
				const ex = extract(root);
				if (!ex) continue;
				const id = `cx-${++counter}`;
				registry.set(id, ex);
				cb({
					id,
					type: ex.type ?? (ex.options.length ? 'single' : 'completion'),
					title,
					options: ex.options.map((o) => (o.textContent ?? '').trim()).filter(Boolean),
					images: collectImages(root),
				});
			}
		}
	}

	return {
		start() {},
		stop() {
			if (timer !== undefined) clearInterval(timer);
		},
		observeQuestions(cb) {
			timer = setInterval(() => scan(cb), 1500);
			scan(cb);
			return () => {
				if (timer !== undefined) clearInterval(timer);
				timer = undefined;
			};
		},
		async writeAnswer(question, answers) {
			const ex = registry.get(question.id);
			if (!ex || !answers.length) return false;
			let wrote = false;

			if (ex.type === 'single' || ex.type === 'multiple' || ex.type === 'judgement' || (!ex.type && ex.options.length)) {
				for (const item of answers) {
					const el = resolveOptionElement(ex, item);
					if (el && !isOptionChecked(el)) {
						(el as HTMLElement).click();
						wrote = true;
						await sleep(300);
					}
				}
				return wrote;
			}

			const blanks = ex.options.filter(
				(o) => o.tagName === 'TEXTAREA' || o.tagName === 'IFRAME' || Boolean(o.querySelector('textarea, iframe'))
			);
			for (let i = 0; i < answers.length && i < blanks.length; i++) {
				const answer = answers[i].answer.trim();
				if (!answer) continue;
				const blank = blanks[i];
				const textarea =
					blank.tagName === 'TEXTAREA' ? (blank as HTMLTextAreaElement) : blank.querySelector('textarea');
				const frame = blank.tagName === 'IFRAME' ? (blank as HTMLIFrameElement) : blank.querySelector('iframe');
				if (textarea) {
					textarea.value = answer;
					dispatchInput(textarea);
					wrote = true;
				}
				if (frame?.contentDocument?.body) {
					frame.contentDocument.body.textContent = answer;
					dispatchInput(frame.contentDocument.body);
					wrote = true;
				}
			}
			if (wrote) {
				ex.root.querySelector<HTMLElement>('[onclick*="saveQuestion"]')?.click();
				await sleep(500);
			}
			return wrote;
		},
	};
}

export const chaoxing: Platform = {
	id: 'chaoxing',
	name: '超星学习通',
	detect: (url) => /chaoxing\.com|edu\.cn$/.test(url.hostname),
	createSession,
};
