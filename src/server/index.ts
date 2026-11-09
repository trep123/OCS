import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { join } from 'node:path';
import type {
	AnswerRequest,
	AnswerResponse,
	FeedbackRequest,
	HealthResponse,
} from '../shared/protocol';
import { config } from './config';
import { chatCompletion, AIRequestError } from './ai/client';
import { buildMessages, parseAnswerJson } from './ai/prompt';
import { KnowledgeBase } from './kb';
import { SessionStore, countLines } from './session/store';

const kb = new KnowledgeBase(config.dataDir);
const sessions = new SessionStore(config.dataDir);

async function decide(req: AnswerRequest): Promise<AnswerResponse> {
	const hit = sessions.lookup(req.platform, req.question);
	if (hit) return { ok: true, answers: hit, source: 'session' };

	if (!config.ai.apiKey) {
		return { ok: false, answers: [], error: '本地 server 未配置 AI Key（环境变量 OCS_AI_KEY）' };
	}
	const snippets = kb.retrieve(`${req.question.title} ${req.question.options.join(' ')}`, 3);
	try {
		const raw = await chatCompletion(config.ai, buildMessages(req.question, snippets));
		const answers = parseAnswerJson(raw, req.question);
		if (!answers.length) return { ok: false, answers: [], error: '模型输出解析为空' };
		sessions.record({
			ts: Date.now(),
			sessionId: req.sessionId,
			platform: req.platform,
			question: req.question,
			answers,
			source: snippets.length ? 'kb+ai' : 'ai',
		});
		return { ok: true, answers, source: snippets.length ? 'kb' : 'ai' };
	} catch (e) {
		const message =
			e instanceof AIRequestError ? `AI 请求失败（HTTP ${e.status}）：${e.message}` : `决策失败：${String(e instanceof Error ? e.message : e)}`;
		return { ok: false, answers: [], error: message };
	}
}

function json(res: ServerResponse, status: number, body: unknown): void {
	res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
	res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		let size = 0;
		req.on('data', (chunk: Buffer) => {
			size += chunk.length;
			if (size > 2 * 1024 * 1024) {
				reject(new Error('body too large'));
				req.destroy();
				return;
			}
			chunks.push(chunk);
		});
		req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
		req.on('error', reject);
	});
}

const server = createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	if (req.method === 'OPTIONS') {
		res.writeHead(204).end();
		return;
	}

	void (async () => {
		try {
			if (req.method === 'GET' && req.url === '/health') {
				const body: HealthResponse = {
					ok: true,
					aiConfigured: Boolean(config.ai.apiKey),
					kbDocuments: kb.documentCount,
					sessionRecords: sessions.size,
				};
				return json(res, 200, body);
			}
			if (req.method === 'POST' && req.url === '/api/answer') {
				const payload = JSON.parse(await readBody(req)) as AnswerRequest;
				if (!payload?.question?.title) return json(res, 400, { ok: false, answers: [], error: '缺少 question.title' });
				return json(res, 200, await decide(payload));
			}
			if (req.method === 'POST' && req.url === '/api/feedback') {
				const payload = JSON.parse(await readBody(req)) as FeedbackRequest;
				sessions.feedback({ ts: Date.now(), ...payload });
				return json(res, 200, { ok: true });
			}
			json(res, 404, { ok: false, answers: [], error: 'not found' });
		} catch (e) {
			json(res, 500, { ok: false, answers: [], error: String(e instanceof Error ? e.message : e) });
		}
	})();
});

server.listen(config.port, config.host, () => {
	console.log(`[OCS server] http://${config.host}:${config.port}  data: ${join(process.cwd(), config.dataDir)}`);
	console.log(`[OCS server] AI: ${config.ai.apiKey ? `${config.ai.model} @ ${config.ai.baseUrl}` : '未配置 OCS_AI_KEY'}  KB 段落: ${kb.documentCount}  会话记录: ${sessions.size}  feedback: ${countLines(join(config.dataDir, 'sessions', 'feedback.jsonl'))}`);
});
