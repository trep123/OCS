import type { EventBus } from '../core/events';
import { AppEvents } from '../core/events';

export function mountPanel(bus: EventBus, host: ParentNode = document.body): HTMLElement {
	const root = document.createElement('div');
	root.id = 'ocs-panel-root';
	bus.on(AppEvents.StatusChanged, (status) => {
		root.dataset.status = String(status ?? '');
	});
	host.append(root);
	return root;
}
