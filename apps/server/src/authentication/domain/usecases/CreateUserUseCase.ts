import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { UseCase } from '../../../common/domain/UseCase';
import { AuthRepository } from '../AuthRepository';
import { AuthenticatedUser, CreateUser } from '../models/AuthenticatedUser';

import { inject, injectable } from 'inversify';
import { Either } from 'purify-ts';

@injectable()
export class CreateUserUseCase implements UseCase<AuthenticatedUser> {
	constructor(@inject(Symbol.for('AuthRepository')) private authRepository: AuthRepository) {}

	public async execute(createUser: CreateUser): Promise<Either<UnknownError, AuthenticatedUser>> {
		return this.authRepository.createUser(createUser);
	}
}
