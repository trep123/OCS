import { appendFileSync, mkdirSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { AnswerItem, QuestionContext } from '../../shared/protocol';

export interface SessionRecord {
	ts: number;
	sessionId: string;
	platform: string;
	question: QuestionContext;
	answers: AnswerItem[];
	source: string;
}

export interface FeedbackRecord {
	ts: number;
	sessionId: string;
	platform: string;
	questionId: string;
	questionTitle: string;
	correct: boolean;
}

const RECENT_LIMIT = 500;

export class SessionStore {
	private dir: string;
	private recent = new Map<string, AnswerItem[]>();

	constructor(dataDir: string) {
		this.dir = join(dataDir, 'sessions');
		mkdirSync(this.dir, { recursive: true });
		this.loadHistory();
	}

	private keyFor(platform: string, question: QuestionContext): string {
		return `${platform}:${question.title.trim().replace(/\s+/g, ' ')}`;
	}

	private todayFile(): string {
		return join(this.dir, `${new Date().toISOString().slice(0, 10)}.jsonl`);
	}

	private loadHistory(): void {
		try {
			const files = readdirSync(this.dir).filter((f) => f.endsWith('.jsonl')).sort();
			for (const file of files.slice(-7)) {
				for (const line of readFileSync(join(this.dir, file), 'utf-8').split('\n')) {
					if (!line.trim()) continue;
					try {
						const rec = JSON.parse(line) as SessionRecord;
						this.recent.set(this.keyFor(rec.platform, rec.question), rec.answers);
					} catch {
						/* 跳过损坏行 */
					}
				}
			}
			this.evict();
		} catch {
			/* 首次运行无历史 */
		}
	}

	private evict(): void {
		while (this.recent.size > RECENT_LIMIT) {
			const oldest = this.recent.keys().next().value;
			if (oldest === undefined) break;
			this.recent.delete(oldest);
		}
	}

	lookup(platform: string, question: QuestionContext): AnswerItem[] | undefined {
		return this.recent.get(this.keyFor(platform, question));
	}

	record(rec: SessionRecord): void {
		this.recent.set(this.keyFor(rec.platform, rec.question), rec.answers);
		this.evict();
		appendFileSync(this.todayFile(), JSON.stringify(rec) + '\n');
	}

	feedback(rec: FeedbackRecord): void {
		appendFileSync(join(this.dir, 'feedback.jsonl'), JSON.stringify(rec) + '\n');
	}

	get size(): number {
		return this.recent.size;
	}
}

export function countLines(file: string): number {
	if (!existsSync(file)) return 0;
	return readFileSync(file, 'utf-8').split('\n').filter((l) => l.trim()).length;
}
