import type { Platform, PlatformDeps, PlatformSession } from './types';
import type { AnswerResult, QuestionContext } from '../core/types';

export function createStubPlatform(id: string, name: string, hosts: RegExp): Platform {
	return {
		id,
		name,
		detect: (url) => hosts.test(url.hostname),
		createSession(deps: PlatformDeps): PlatformSession {
			void deps;
			return {
				start() {},
				stop() {},
				observeQuestions(_onQuestion: (q: QuestionContext) => void) {
					return () => {};
				},
				async writeAnswer(_q: QuestionContext, _r: AnswerResult) {
					throw new Error(`TODO: 实现 ${name} 答案写回`);
				},
			};
		},
	};
}
