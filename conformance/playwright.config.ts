import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import type { Target } from './scenarios';

const root = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig<{ target: Target }>({
	testDir: './checks',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		...devices['Desktop Chrome'],
		viewport: { width: 640, height: 360 },
		deviceScaleFactor: 1,
	},
	projects: [
		{ name: 'angular', use: { target: 'angular' } },
		{ name: 'react', use: { target: 'react' } },
	],
	webServer: [
		{
			command: 'npx vite --config conformance/harness/vite.config.ts --port 4401 --strictPort',
			cwd: root,
			url: 'http://localhost:4401/reference/',
			reuseExistingServer: !process.env.CI,
		},
		{
			command: 'npx ng serve lucent-conformance-angular --port 4402',
			cwd: root,
			url: 'http://localhost:4402/',
			reuseExistingServer: !process.env.CI,
			timeout: 180_000,
			env: { NG_CLI_ANALYTICS: 'false' },
		},
	],
});
