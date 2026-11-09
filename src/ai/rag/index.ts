import type { CacheStorePort, LoggerPort } from '../../core/ports';

export interface KnowledgeBaseDeps {
	cache: CacheStorePort;
	logger: LoggerPort;
}

export class KnowledgeBase {
	constructor(private deps: KnowledgeBaseDeps) {}

	async retrieve(_query: string, _topK: number): Promise<string> {
		void this.deps;
		throw new Error('TODO: 从 legacy bundle 迁移本地 RAG 检索');
	}
}
