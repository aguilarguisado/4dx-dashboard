import { BaseError } from '../../domain/exceptions/BaseError';
import { IllegalStateError } from '../../domain/exceptions/IllegalStateError';
import { UnknownError } from '../../domain/exceptions/UnknownError';
import { BadRequestApiError } from '../exceptions/BadRequestApiError';
import { ForbiddenApiError } from '../exceptions/ForbiddenApiError';
import { InternalServerApiError } from '../exceptions/InternalServerApiError';
import { NotFoundApiError } from '../exceptions/NotFoundApiError';
import { buildUnknownError, DomainErrorTypes, genericApiErrorConverter } from '../exceptions/utils';

describe('utils', () => {
	describe('genericApiErrorConverter', () => {
		it('genericApiErrorConverter - no message', () => {
			const error = new UnknownError();
			const result = genericApiErrorConverter(error);
			expect(result).toBeInstanceOf(InternalServerApiError);
			expect(result.message).toBe(JSON.stringify({ id: 'error.unknown' }));
		});

		it.each([
			['NotPermissionError', ForbiddenApiError],
			['EntityNotExistsError', NotFoundApiError],
			['SLAError', BadRequestApiError],
			['IllegalStateError', BadRequestApiError],
		])(
			'genericApiErrorConverter - with message. converts %s to the appropriate ApiError subclass',
			(kind, expectedErrorClass) => {
				const error = new BaseError({ kind: kind as DomainErrorTypes, message: 'Error message' });
				const result = genericApiErrorConverter(error);
				expect(result).toBeInstanceOf(expectedErrorClass);
				expect(result.message).toBe('Error message');
			},
		);

		it('IllegalStateError with no message', () => {
			const error = new IllegalStateError();
			const result = genericApiErrorConverter(error);
			expect(result).toBeInstanceOf(BadRequestApiError);
			expect(result.message).toBe('IllegalStateError');
		});
	});

	describe('buildUnknownError', () => {
		it('wraps an unknown error in a Left containing an UnknownError', () => {
			const error = new Error('Test error');
			const result = buildUnknownError(error);

			expect(result.isLeft()).toBe(true);
			const leftValue = result.extract();
			expect(leftValue).toBeInstanceOf(UnknownError);
			expect(leftValue.message).toBe('Test error');
		});

		it('handles non-Error types', () => {
			const error = 'String error';
			const result = buildUnknownError(error as unknown);

			expect(result.isLeft()).toBe(true);
			const leftValue = result.extract();
			expect(leftValue).toBeInstanceOf(UnknownError);
			expect(leftValue.message).toBe('Internal server error');
		});
	});
});
