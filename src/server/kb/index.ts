import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export class KnowledgeBase {
	private dir: string;
	private paragraphs: string[] = [];
	private loadedAt = 0;

	constructor(dataDir: string) {
		this.dir = join(dataDir, 'kb');
	}

	private load(force = false): void {
		if (!force && Date.now() - this.loadedAt < 60_000) return;
		this.paragraphs = [];
		try {
			for (const file of readdirSync(this.dir).filter((f) => f.endsWith('.txt') || f.endsWith('.md'))) {
				const text = readFileSync(join(this.dir, file), 'utf-8');
				for (const para of text.split(/\n\s*\n/)) {
					const trimmed = para.trim();
					if (trimmed.length >= 20) this.paragraphs.push(trimmed);
				}
			}
		} catch {
			/* 无知识库目录 */
		}
		this.loadedAt = Date.now();
	}

	get documentCount(): number {
		this.load();
		return this.paragraphs.length;
	}

	retrieve(query: string, topK = 3): string[] {
		this.load();
		if (!this.paragraphs.length) return [];
		const tokens = tokenize(query);
		if (!tokens.length) return [];
		return this.paragraphs
			.map((para) => ({ para, score: tokens.filter((t) => para.includes(t)).length / tokens.length }))
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, topK)
			.map((item) => item.para.slice(0, 1200));
	}
}

function tokenize(text: string): string[] {
	const tokens = new Set<string>();
	const ascii = text.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [];
	for (const w of ascii) tokens.add(w);
	const cjk = text.replace(/[^\u4e00-\u9fff]/g, '');
	for (let i = 0; i < cjk.length - 1; i++) tokens.add(cjk.slice(i, i + 2));
	return [...tokens].slice(0, 64);
}
