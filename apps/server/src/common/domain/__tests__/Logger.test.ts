import { getLogger, resetLogger } from '../Logger';

describe('logger configuration', () => {
	it('sets log level to silent when NODE_ENV is test', () => {
		vi.unstubAllEnvs();
		resetLogger();
		expect(getLogger().level).toBe('silent');
	});
	it('sets log level to info when NODE_ENV is not test', () => {
		vi.unstubAllEnvs();
		vi.stubEnv('NODE_ENV', 'not-test');
		resetLogger();
		expect(getLogger().level).toBe('info');
	});
});
