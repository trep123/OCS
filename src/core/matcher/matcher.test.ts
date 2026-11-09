import { describe, expect, it } from 'vitest';
import { answerExactMatch, answerNormalizedMatch, normalizeString, removeRedundant } from '.';

describe('matcher', () => {
	it('removeRedundant 去除选项字母前缀', () => {
		expect(removeRedundant('A. 光合作用')).toBe('光合作用');
		expect(removeRedundant('B.细胞分裂')).toBe('细胞分裂');
	});

	it('normalizeString 统一全角半角与标点', () => {
		expect(normalizeString('ＡＢＣ１２３')).toBe('abc123');
		expect(normalizeString('你好，世界！')).toBe('你好世界');
	});

	it('answerExactMatch 精确匹配', () => {
		expect(answerExactMatch(['A. 光合作用'], ['光合作用', '细胞分裂'])).toEqual(['光合作用']);
		expect(answerExactMatch([], ['光合作用'])).toEqual([]);
	});

	it('answerNormalizedMatch 归一化匹配并按级别排序', () => {
		const matched = answerNormalizedMatch(['ＡＢＣ'], ['abc', 'xyz']);
		expect(matched).toEqual(['abc']);
	});
});
