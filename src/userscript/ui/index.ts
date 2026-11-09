export interface StatusUI {
	setText(text: string): void;
	remove(): void;
}

export function mountStatusUI(): StatusUI {
	const pill = document.createElement('div');
	pill.id = 'ocs-status-pill';
	Object.assign(pill.style, {
		position: 'fixed',
		right: '16px',
		bottom: '16px',
		zIndex: '2147483647',
		padding: '6px 12px',
		borderRadius: '999px',
		background: 'rgba(17, 24, 39, 0.85)',
		color: '#e5e7eb',
		font: '12px/1.5 system-ui, sans-serif',
		maxWidth: '320px',
		pointerEvents: 'none',
	} satisfies Partial<CSSStyleDeclaration>);
	document.body.append(pill);
	return {
		setText(text: string) {
			pill.textContent = text;
		},
		remove() {
			pill.remove();
		},
	};
}
