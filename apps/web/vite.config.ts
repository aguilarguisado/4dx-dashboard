import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, PluginOption, splitVendorChunkPlugin } from 'vite';
import { compression } from 'vite-plugin-compression2';

export default defineConfig(({ mode }) => {
	loadEnv(mode, process.cwd());

	return {
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		optimizeDeps: {
			esbuildOptions: {
				target: 'es2020',
				tsconfigRaw: {
					compilerOptions: {
						experimentalDecorators: true,
					},
				},
			},
		},
		esbuild: {
			// https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
			// logOverride: { 'this-is-undefined-in-esm': 'silent' },
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						// creating a chunk to firebase deps. Reducing the vendor chunk size
						if (id.includes('firebase')) {
							return 'firebase';
						}
						// creating a chunk to tanstack deps. Reducing the vendor chunk size
						if (id.includes('@tanstack')) {
							return '@tanstack';
						}
						if (id.includes('chart.js')) {
							return 'chart.js';
						}
					},
				},
			},
		},
		plugins: [
			react(),
			compression(),
			splitVendorChunkPlugin(),
			// Visualizer should be the last one
			visualizer() as PluginOption,
		],
	};
});
