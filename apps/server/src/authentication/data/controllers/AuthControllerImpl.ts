import { genericApiErrorConverter } from '../../../common/data/exceptions/utils';
import { CreateUserUseCase } from '../../domain/usecases/CreateUserUseCase';
import { CreateUserDTO, toCreateUserModel } from '../dtos/CreateUserDTO';

import { inject, injectable } from 'inversify';

@injectable()
export class AuthControllerImpl {
	constructor(@inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase) {}

	async createUser(createUserDTO: CreateUserDTO) {
		const createUser = toCreateUserModel(createUserDTO);
		return (await this.createUserUseCase.execute(createUser)).mapLeft(genericApiErrorConverter).unsafeCoerce();
	}
}
