import { EntityNotExistsError } from './exceptions/EntityNotExistsError';
import { UnknownError } from './exceptions/UnknownError';
import { BaseModel } from './models/BaseModel';

import { Either } from 'purify-ts/Either';

export type BaseRepository<T extends BaseModel> = {
	find: (id: string) => Promise<Either<UnknownError | EntityNotExistsError, T>>;
	create: (entity: T | Omit<T, 'id'>) => Promise<Either<UnknownError, T>>;
	update: (reference: string, entity: Partial<T>) => Promise<Either<UnknownError | EntityNotExistsError, T>>;
	write: (reference: string, entity: Partial<T>) => Promise<Either<UnknownError | EntityNotExistsError, undefined>>;
	delete: (id: string) => Promise<Either<UnknownError, undefined>>;
};
