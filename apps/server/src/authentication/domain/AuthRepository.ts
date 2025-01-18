import { AuthenticatedUser, CreateUser } from './models/AuthenticatedUser';
import { UnknownError } from '../../common/domain/exceptions/UnknownError';

import { Either } from 'purify-ts';

export type AuthRepository = {
	createUser: (createUser: CreateUser) => Promise<Either<UnknownError, AuthenticatedUser>>;
	decodeAndVerifyToken: (token: string) => Promise<Either<UnknownError, AuthenticatedUser>>;
};
