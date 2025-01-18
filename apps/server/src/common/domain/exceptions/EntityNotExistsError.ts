import { BaseError } from './BaseError';

export class EntityNotExistsError extends BaseError<'EntityNotExistsError'> {
	constructor(message?: string) {
		super({
			kind: 'EntityNotExistsError',
			message: message ?? 'EntityNotExistsError',
		});
	}
}
