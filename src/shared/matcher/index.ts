const CIRCLED_NUMBERS = '①②③④⑤⑥⑦⑧⑨';

export function clearString(str: string, ...exclude: string[]): string {
	exclude.push(CIRCLED_NUMBERS);
	return str
		.trim()
		.toLocaleLowerCase()
		.replace(RegExp(`[^\\u2E80-\\u9FFFA-Za-z0-9${exclude.join('')}]*`, 'g'), '');
}

export function normalizeString(str: string): string {
	return clearString(
		str
			.replace(/[，。！？；：""''、（）【】《》\s]/g, '')
			.replace(/[,.\-!?;:'"()[\]<>]/g, '')
			.replace(/[ａ-ｚＡ-Ｚ０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 65248))
			.replace(/％/g, '%')
	);
}

export function removeRedundant(str: string | undefined | null): string {
	return (
		str
			?.trim()
			.replace(/^[A-Z]{1}[^A-Za-z0-9⺀-鿿]+([A-Za-z0-9⺀-鿿]+)/, '$1')
			.replace(/^[A-Z]{1}([⺀-鿿][A-Za-z0-9⺀-鿿]*)/, '$1') || ''
	);
}

export function answerExactMatch(answers: string[], options: string[]): string[] {
	const _answers = answers.map(removeRedundant);
	const _options = options.map(removeRedundant);
	if (_answers.length === 0) return [];
	return _options.filter((option) => _answers.some((answer) => answer.trim() === option.trim()));
}

export function answerNormalizedMatch(answers: string[], options: string[]): string[] {
	const _answers = answers.map(removeRedundant).map(normalizeString);
	const _options = options.map(removeRedundant).map(normalizeString);
	if (_answers.length === 0) return [];
	return _options
		.map((opt, i) => {
			let level = 0;
			if (opt) {
				for (const ans of _answers) {
					if (ans === opt) {
						level = 2;
						break;
					} else if (ans.includes(opt)) {
						level = 1;
					}
				}
			}
			return { original: options[i], level };
		})
		.filter(({ level }) => level > 0)
		.sort((a, b) => b.level - a.level)
		.map(({ original }) => original);
}
