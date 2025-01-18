import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		setupFiles: ['./test-setup.ts'],
		coverage: {
			exclude: [...(configDefaults.coverage.exclude || []), 'src/index.ts', 'src/lib/**', 'html/**'],
		},
	},
});
