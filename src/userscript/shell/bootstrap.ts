import type { QuestionContext } from '../../shared/protocol';
import { matchPlatform } from '../platforms';
import { ServerTransport } from '../transport/server-client';
import { mountStatusUI } from '../ui';
import { SERVER_ORIGIN } from './metadata';

function uuid(): string {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		return (c === 'x' ? r : (r & 3) | 8).toString(16);
	});
}

function serverBase(): string {
	const saved = typeof GM_getValue === 'function' ? (GM_getValue('ocs.server', '') as string) : '';
	return saved || SERVER_ORIGIN;
}

async function main(): Promise<void> {
	const platform = matchPlatform(new URL(location.href));
	if (!platform) return;

	const transport = new ServerTransport(serverBase());
	const ui = mountStatusUI();
	const sessionId = uuid();

	try {
		const health = await transport.health();
		ui.setText(`OCS · ${platform.name} · server 已连接${health.aiConfigured ? '' : '（未配置 AI Key）'}`);
	} catch (e) {
		ui.setText(e instanceof Error ? e.message : String(e));
		return;
	}

	const session = platform.createSession();
	const inflight = new Set<string>();

	const stopObserve = session.observeQuestions((question: QuestionContext) => {
		if (inflight.has(question.id)) return;
		inflight.add(question.id);
		void (async () => {
			try {
				ui.setText(`决策中：${question.title.slice(0, 24)}`);
				const res = await transport.answer({
					sessionId,
					platform: platform.id,
					url: location.href,
					question,
				});
				if (res.ok && res.answers.length) {
					const written = await session.writeAnswer(question, res.answers);
					ui.setText(written ? `已填入（${res.source}）` : '答案填入失败，请手动处理');
				} else {
					ui.setText(res.error || 'server 未返回答案');
				}
			} catch (e) {
				ui.setText(e instanceof Error ? e.message : String(e));
			} finally {
				inflight.delete(question.id);
			}
		})();
	});

	session.start();
	window.addEventListener('pagehide', () => {
		stopObserve();
		session.stop();
	});
}

void main();
