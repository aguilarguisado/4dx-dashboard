import { BaseError } from './BaseError';

export class IllegalStateError extends BaseError<'IllegalStateError'> {
	constructor(message?: string) {
		super({
			kind: 'IllegalStateError',
			message: message ?? 'IllegalStateError',
		});
	}
}
