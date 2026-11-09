import { AI_PROVIDERS } from '../ai/config';

export interface UserscriptMetadata {
	name: string;
	version: string;
	description: string;
	author: string;
	license: string;
	namespace: string;
	homepage: string;
	source: string;
	match: string[];
	connect: string[];
	grant: string[];
	runAt: string;
}

function providerHosts(): string[] {
	const hosts = new Set<string>(['localhost', '127.0.0.1']);
	for (const profile of Object.values(AI_PROVIDERS)) {
		try {
			if (profile.endpoint) hosts.add(new URL(profile.endpoint).hostname);
		} catch {
			/* endpoint 为空或非法时跳过 */
		}
	}
	return [...hosts];
}

export const metadata: UserscriptMetadata = {
	name: 'OCS 网课助手',
	version: '5.0.0-alpha.0',
	description: 'OCS 网课助手（模块化重构版）',
	author: 'enncy',
	license: 'MIT',
	namespace: 'https://enncy.cn',
	homepage: 'https://docs.ocsjs.com',
	source: 'https://github.com/ocsjs/ocsjs',
	match: [
		'*://*.chaoxing.com/*',
		'*://*.edu.cn/*',
		'*://*.zhihuishu.com/*',
		'*://*.icve.com.cn/*',
		'*://*.icourse163.org/*',
		'*://*.yuketang.cn/*',
	],
	connect: providerHosts(),
	grant: [
		'GM_info',
		'GM_getValue',
		'GM_setValue',
		'GM_deleteValue',
		'GM_listValues',
		'GM_addValueChangeListener',
		'GM_removeValueChangeListener',
		'GM_xmlhttpRequest',
		'GM_notification',
	],
	runAt: 'document-idle',
};

export function buildUserscriptHeader(m: UserscriptMetadata): string {
	const lines: string[] = ['// ==UserScript=='];
	const scalar: Array<[string, string]> = [
		['@name', m.name],
		['@version', m.version],
		['@description', m.description],
		['@author', m.author],
		['@license', m.license],
		['@namespace', m.namespace],
		['@homepage', m.homepage],
		['@source', m.source],
		['@run-at', m.runAt],
	];
	for (const [key, value] of scalar) lines.push(`// ${key.padEnd(14)}${value}`);
	for (const value of m.match) lines.push(`// ${'@match'.padEnd(14)}${value}`);
	for (const value of m.connect) lines.push(`// ${'@connect'.padEnd(14)}${value}`);
	for (const value of m.grant) lines.push(`// ${'@grant'.padEnd(14)}${value}`);
	lines.push('// ==/UserScript==');
	return lines.join('\n');
}
