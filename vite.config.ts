import { defineConfig, type Plugin } from 'vite';
import { metadata, buildUserscriptHeader } from './src/userscript/shell/metadata';

function userscriptHeader(): Plugin {
	const header = buildUserscriptHeader(metadata);
	return {
		name: 'userscript-header',
		enforce: 'post',
		generateBundle(_, bundle) {
			for (const chunk of Object.values(bundle)) {
				if (chunk.type === 'chunk' && chunk.isEntry) {
					chunk.code = header + '\n' + chunk.code;
				}
			}
		},
	};
}

export default defineConfig({
	plugins: [userscriptHeader()],
	build: {
		target: 'es2020',
		minify: false,
		lib: {
			entry: 'src/userscript/shell/bootstrap.ts',
			name: 'OCS',
			formats: ['iife'],
			fileName: () => `${metadata.name}.user.js`,
		},
		outDir: 'dist',
		emptyOutDir: false,
	},
});
