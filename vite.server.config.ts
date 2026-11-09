import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		target: 'node18',
		minify: false,
		ssr: true,
		lib: {
			entry: 'src/server/index.ts',
			formats: ['es'],
			fileName: () => 'index.mjs',
		},
		outDir: 'dist/server',
		emptyOutDir: true,
		rollupOptions: {
			external: [/^node:/],
		},
	},
});
