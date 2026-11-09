import type { AnswerItem, QuestionContext } from '../../shared/protocol';
import type { Platform, PlatformSession } from './types';

export function createStubPlatform(id: string, name: string, hosts: RegExp): Platform {
	return {
		id,
		name,
		detect: (url) => hosts.test(url.hostname),
		createSession(): PlatformSession {
			return {
				start() {},
				stop() {},
				observeQuestions(_onQuestion: (q: QuestionContext) => void) {
					return () => {};
				},
				async writeAnswer(_q: QuestionContext, _answers: AnswerItem[]) {
					throw new Error(`TODO: 实现 ${name} 的抓题与答案写回`);
				},
			};
		},
	};
}
