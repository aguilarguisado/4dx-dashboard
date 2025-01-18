import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { CreateUser } from '../../models/AuthenticatedUser';
import { CreateUserUseCase } from '../CreateUserUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('CreateUserUseCase', () => {
	let useCase: CreateUserUseCase;
	let container: Container;
	let mockRepository: {
		createUser: ReturnType<typeof vi.fn>;
	};
	let createUser: CreateUser;

	beforeAll(() => {
		createUser = {
			email: 'test@test.com',
			password: 'password',
			displayName: 'test',
			role: 'user',
			organizationId: 'org123',
		};
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockRepository = {
			createUser: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, Symbol.for('AuthRepository'), mockRepository);
		useCase = container.get(CreateUserUseCase);
	});

	it('successfully creates an organization', async () => {
		const result = await useCase.execute(createUser);
		expect(result.isRight()).toBe(true);
		expect(mockRepository.createUser).toHaveBeenCalledWith(createUser);
	});

	it('should return an error when failing to create the organization', async () => {
		vi.spyOn(mockRepository, 'createUser').mockResolvedValue(Left(new UnknownError()));
		const result = await useCase.execute(createUser);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(UnknownError);
		expect(mockRepository.createUser).toHaveBeenCalledWith(createUser);
	});
});
