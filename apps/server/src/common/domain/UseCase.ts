import { BaseError } from './exceptions/BaseError';

import { Either } from 'purify-ts';

export type UseCase<T> = {
	// This is a generic type, so we can't know what the params are
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	execute: (...params: any) => Promise<Either<BaseError<any>, T>>;
};
