import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { InternalServerApiError } from '../../../../common/data/exceptions/InternalServerApiError';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { CreateUserUseCase } from '../../../domain/usecases/CreateUserUseCase';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { AuthControllerImpl } from '../AuthControllerImpl';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('AuthControllerImpl', () => {
	let container: Container;
	let organizationId: string;
	beforeEach(() => {
		container = resetTestAppContainer();
		organizationId = 'org123';
	});
	describe('createUser', () => {
		let createUserDTO: CreateUserDTO;
		beforeEach(() => {
			createUserDTO = {
				email: 'test@test.com',
				displayName: 'test',
				password: 'test',
				role: 'user',
				organizationId,
			};
		});

		it('should successfully create a user in an organization', async () => {
			const mockCreateUserUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, CreateUserUseCase, mockCreateUserUseCase);
			const controller: AuthControllerImpl = container.get(AuthControllerImpl);

			const result = await controller.createUser(createUserDTO);
			expect(result).toEqual(undefined);
			expect(mockCreateUserUseCase.execute).toHaveBeenCalled();
		});

		it('should throw an error when createUserUseCase fails', async () => {
			const mockCreateUserUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, CreateUserUseCase, mockCreateUserUseCase);
			const controller: AuthControllerImpl = container.get(AuthControllerImpl);

			await expect(controller.createUser(createUserDTO)).rejects.toThrow(InternalServerApiError);
			expect(mockCreateUserUseCase.execute).toHaveBeenCalled();
		});
	});
});
