import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { SLAError } from '../../../../common/domain/exceptions/SLAError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { CreateWIG } from '../../types/CreateWIG';
import { CreateWIGUseCase } from '../CreateWIGUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('CreateWIGUseCase', () => {
	let useCase: CreateWIGUseCase;
	let container: Container;
	let mockWIGInteractor: {
		create: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let createWIG: CreateWIG;

	beforeAll(() => {
		organizationId = 'org123';
		createWIG = { name: 'dummy', isOrganizational: false };
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			create: vi.fn().mockResolvedValue(Right({ id: 'id123' })),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(CreateWIGUseCase);
	});

	it('successfully creates a wig', async () => {
		const result = await useCase.execute(organizationId, createWIG);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.create).toHaveBeenCalledWith(organizationId, createWIG);
	});

	it('should not create the wig if max number of wig was reached', async () => {
		vi.spyOn(mockWIGInteractor, 'create').mockResolvedValue(Left(new SLAError()));
		const result = await useCase.execute(organizationId, createWIG);
		expect(mockWIGInteractor.create).toHaveBeenCalledWith(organizationId, createWIG);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(SLAError);
	});

	it('should return an error when failing to create the wig', async () => {
		vi.spyOn(mockWIGInteractor, 'create').mockRejectedValue(new Error());
		const result = await useCase.execute(organizationId, createWIG);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.create).toHaveBeenCalledWith(organizationId, createWIG);
	});
});
