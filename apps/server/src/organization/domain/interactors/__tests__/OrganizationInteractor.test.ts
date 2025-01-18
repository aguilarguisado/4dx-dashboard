import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { Organization } from '../../models/Organization';
import { OrganizationInteractor } from '../OrganizationInteractor';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

// TODO: make integration tests for wigcount increasing
describe('WIGInteractor', () => {
	let interactor: OrganizationInteractor;
	let container: Container;
	let mockOrganizationRepository: {
		find: ReturnType<typeof vi.fn>;
		create: ReturnType<typeof vi.fn>;
		write: ReturnType<typeof vi.fn>;
	};
	const organizationId = 'org123';
	let mockOrganization: Organization;
	beforeEach(() => {
		mockOrganization = { id: organizationId, name: 'dummyOrg', wigCount: 0 };
		container = resetTestAppContainer();
		mockOrganizationRepository = {
			find: vi.fn().mockResolvedValue(Right(mockOrganization)),
			create: vi.fn().mockResolvedValue(Right(undefined)),
			write: vi.fn().mockResolvedValue(Right(undefined)),
		};
		rebindMock(container, Symbol.for('OrganizationRepository'), mockOrganizationRepository);
		interactor = container.get(OrganizationInteractor);
	});

	describe('find', () => {
		it('should return an organization when found', async () => {
			const organizationId = 'org123';

			const result = await interactor.find(organizationId);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toMatchObject(mockOrganization);
			expect(mockOrganizationRepository.find).toHaveBeenCalledWith(organizationId);
		});

		it('should return an EntityNotExistsError when the organization does not exist', async () => {
			const organizationId = 'nonExistingOrg';
			vi.spyOn(mockOrganizationRepository, 'find').mockResolvedValue(Left(new EntityNotExistsError()));

			const result = await interactor.find(organizationId);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
			expect(mockOrganizationRepository.find).toHaveBeenCalledWith(organizationId);
		});
	});

	describe('create', () => {
		it('should successfully create an organization', async () => {
			const createOrganizationData = { name: 'New Org' };

			const result = await interactor.create(createOrganizationData);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toEqual(undefined);
			expect(mockOrganizationRepository.create).toHaveBeenCalledWith(
				expect.objectContaining(createOrganizationData),
			);
		});

		it('should return an UnknownError if the creation fails', async () => {
			const createOrganizationData = { name: 'Failed Org' };
			vi.spyOn(mockOrganizationRepository, 'create').mockResolvedValue(Left(new UnknownError()));

			const result = await interactor.create(createOrganizationData);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});
});
