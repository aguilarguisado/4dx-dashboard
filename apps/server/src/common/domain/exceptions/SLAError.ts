import { BaseError } from './BaseError';

export class SLAError extends BaseError<'SLAError'> {
	constructor(message?: string) {
		super({
			kind: 'SLAError',
			message: message ?? 'SLAError',
		});
	}
}
