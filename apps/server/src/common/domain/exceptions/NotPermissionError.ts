import { BaseError } from './BaseError';

export class NotPermissionError extends BaseError<'NotPermissionError'> {
	constructor(message?: string) {
		super({
			kind: 'NotPermissionError',
			message: message ?? 'NotPermissionError',
		});
	}
}
