import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { OrganizationInteractor } from '../../interactors/OrganizationInteractor';
import { CreateOrganization } from '../../models/Organization';
import { CreateOrganizationUseCase } from '../CreateOrganizationUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('CreateOrganizationUseCase', () => {
	let useCase: CreateOrganizationUseCase;
	let container: Container;
	let mockInteractor: {
		create: ReturnType<typeof vi.fn>;
	};
	let createOrganization: CreateOrganization;

	beforeAll(() => {
		createOrganization = { name: 'dummyOrganization' };
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockInteractor = {
			create: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, OrganizationInteractor, mockInteractor);
		useCase = container.get(CreateOrganizationUseCase);
	});

	it('successfully creates an organization', async () => {
		const result = await useCase.execute(createOrganization);
		expect(result.isRight()).toBe(true);
		expect(mockInteractor.create).toHaveBeenCalledWith(createOrganization);
	});

	it('should return an error when failing to create the organization', async () => {
		vi.spyOn(mockInteractor, 'create').mockResolvedValue(Left(new UnknownError()));
		const result = await useCase.execute(createOrganization);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(UnknownError);
		expect(mockInteractor.create).toHaveBeenCalledWith(createOrganization);
	});
});
