import { BaseError } from './BaseError';

export class UnknownError extends BaseError<'UnknownError'> {
	constructor(message?: string, cause?: unknown) {
		super({
			kind: 'UnknownError',
			message: message ?? 'Internal server error',
			cause,
		});
	}
}
