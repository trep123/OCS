export interface UserscriptMetadata {
	name: string;
	version: string;
	description: string;
	author: string;
	license: string;
	namespace: string;
	match: string[];
	connect: string[];
	grant: string[];
	runAt: string;
}

export const SERVER_ORIGIN = 'http://127.0.0.1:19818';

export const metadata: UserscriptMetadata = {
	name: 'OCS 网课助手',
	version: '5.0.0-alpha.0',
	description: 'OCS 薄客户端：抓取题目与选项，答案决策由本地 server（AI + 知识库 + 会话记录）完成',
	author: 'enncy',
	license: 'MIT',
	namespace: 'https://enncy.cn',
	match: [
		'*://*.chaoxing.com/*',
		'*://*.edu.cn/*',
		'*://*.zhihuishu.com/*',
		'*://*.icve.com.cn/*',
		'*://*.icourse163.org/*',
		'*://*.yuketang.cn/*',
	],
	connect: ['127.0.0.1', 'localhost'],
	grant: ['GM_info', 'GM_getValue', 'GM_setValue', 'GM_xmlhttpRequest'],
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
		['@run-at', m.runAt],
	];
	for (const [key, value] of scalar) lines.push(`// ${key.padEnd(14)}${value}`);
	for (const value of m.match) lines.push(`// ${'@match'.padEnd(14)}${value}`);
	for (const value of m.connect) lines.push(`// ${'@connect'.padEnd(14)}${value}`);
	for (const value of m.grant) lines.push(`// ${'@grant'.padEnd(14)}${value}`);
	lines.push('// ==/UserScript==');
	return lines.join('\n');
}
