import { ApiError } from './ApiError';
import { BadRequestApiError } from './BadRequestApiError';
import { ForbiddenApiError } from './ForbiddenApiError';
import { InternalServerApiError } from './InternalServerApiError';
import { NotFoundApiError } from './NotFoundApiError';
import { BaseError } from '../../domain/exceptions/BaseError';
import { UnknownError } from '../../domain/exceptions/UnknownError';

import { Either, Left } from 'purify-ts';

export type DomainErrorTypes =
	| 'NotPermissionError'
	| 'UnknownError'
	| 'EntityNotExistsError'
	| 'IllegalStateError'
	| 'SLAError';

export const genericApiErrorConverter = (error: BaseError<DomainErrorTypes>): ApiError => {
	switch (error.kind) {
		case 'NotPermissionError':
			return new ForbiddenApiError(error.message, error.cause);
		case 'EntityNotExistsError':
			return new NotFoundApiError(error.message, error.cause);
		case 'SLAError':
		case 'IllegalStateError':
			return new BadRequestApiError(error.message, error.cause);
		default:
			return new InternalServerApiError(undefined, error.cause);
	}
};

export const buildUnknownError = (error: unknown): Either<UnknownError, never> => {
	return Left(new UnknownError((error as Error).message, error));
};
