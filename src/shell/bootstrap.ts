import { GMStorage } from '../adapters/gm-storage';
import { GMHttp } from '../adapters/gm-http';
import { GMSecrets } from '../adapters/gm-secrets';
import { IndexedDBCache } from '../adapters/idb-cache';
import { ConsoleLogger, GMNotify } from '../adapters/gm-misc';
import { EventBus, AppEvents } from '../core/events';
import { matchPlatform } from '../platforms';
import type { PlatformDeps } from '../platforms';

function main(): void {
	const platform = matchPlatform(new URL(location.href));
	if (!platform) return;

	const bus = new EventBus();
	const storage = new GMStorage();
	const deps: PlatformDeps = {
		storage,
		secrets: new GMSecrets(storage),
		http: new GMHttp(),
		cache: new IndexedDBCache(),
		logger: new ConsoleLogger(),
		notify: new GMNotify(),
		abortAll() {},
	};

	const session = platform.createSession(deps);
	const stopObserve = session.observeQuestions((question) => {
		bus.emit(AppEvents.StatusChanged, `检测到题目：${question.title.slice(0, 30)}`);
	});

	session.start();
	window.addEventListener('pagehide', () => {
		stopObserve();
		session.stop();
	});
}

main();
