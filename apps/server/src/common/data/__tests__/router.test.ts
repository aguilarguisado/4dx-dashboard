import { appRouter } from '../router';

describe('router', () => {
	it('should be mounted correctly', () => {
		expect(appRouter).not.toBe(undefined);
	});
});
