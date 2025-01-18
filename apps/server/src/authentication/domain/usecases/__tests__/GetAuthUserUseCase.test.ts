import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { GetAuthUserUseCase } from '../GetAuthUserUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('GetAuthUserUseCase', () => {
	let useCase: GetAuthUserUseCase;
	let container: Container;
	let mockRepository: {
		decodeAndVerifyToken: ReturnType<typeof vi.fn>;
	};
	let token: string;

	beforeAll(() => {
		token = 'dummyToken';
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockRepository = { decodeAndVerifyToken: vi.fn().mockResolvedValue(Right({})) };
		rebindMock(container, Symbol.for('AuthRepository'), mockRepository);
		useCase = container.get(GetAuthUserUseCase);
	});

	it('successfully creates an organization', async () => {
		const result = await useCase.execute(token);
		expect(result.isRight()).toBe(true);
		expect(mockRepository.decodeAndVerifyToken).toHaveBeenCalledWith(token);
	});

	it('should return an error when failing to create the organization', async () => {
		vi.spyOn(mockRepository, 'decodeAndVerifyToken').mockResolvedValue(Left(new UnknownError()));
		const result = await useCase.execute(token);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(UnknownError);
		expect(mockRepository.decodeAndVerifyToken).toHaveBeenCalledWith(token);
	});
});
