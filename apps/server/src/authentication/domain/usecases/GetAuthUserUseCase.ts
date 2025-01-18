import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { UseCase } from '../../../common/domain/UseCase';
import { AuthRepository } from '../AuthRepository';
import { AuthenticatedUser } from '../models/AuthenticatedUser';

import { inject, injectable } from 'inversify';
import { Either } from 'purify-ts';

@injectable()
export class GetAuthUserUseCase implements UseCase<AuthenticatedUser> {
	constructor(@inject(Symbol.for('AuthRepository')) private authRepository: AuthRepository) {}

	public async execute(token: string): Promise<Either<UnknownError, AuthenticatedUser>> {
		return this.authRepository.decodeAndVerifyToken(token);
	}
}
