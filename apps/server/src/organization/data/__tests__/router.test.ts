import { rebindMock, resetTestAppContainer } from '../../../__tests__/TestUtils';
import { UnauthorizedApiError } from '../../../common/data/exceptions/UnauthorizedApiError';
import { getNotLoggedUser, getOrdinaryUser, getSuperAdminUser } from '../../../lib/trpc/TestUtils';
import { appCreateCallerFactory } from '../../../lib/trpc/trpc';
import { Organization } from '../../domain/models/Organization';
import { OrganizationControllerImpl } from '../controllers/OrganizationControllerImpl';
import { CreateOrganizationDTO } from '../dtos/CreateOrganizationDTO';
import { organizationRouter } from '../router';

import { Container } from 'inversify';

describe('organizationRouter', () => {
	let container: Container;
	let createOrganizationDTO: CreateOrganizationDTO;
	let expectedOrganization: Organization;
	beforeEach(() => {
		(createOrganizationDTO = { name: 'testOrganization' }),
			(expectedOrganization = { id: 'id', name: 'testOrganization', wigCount: 0 });
		container = resetTestAppContainer();
	});
	describe('createOrganization route', () => {
		it('should successfully create an organization with a superadmin user', async () => {
			const mockController = { createOrganization: vi.fn().mockResolvedValue(expectedOrganization) };
			rebindMock(container, OrganizationControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(organizationRouter);
			const caller = createCaller(getSuperAdminUser());
			const result = await caller.createOrganization(createOrganizationDTO);
			expect(result).toEqual(expectedOrganization);
		});

		it('should not create an organization with an ordinary user', async () => {
			const mockController = { createOrganization: vi.fn() };
			rebindMock(container, OrganizationControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(organizationRouter);
			const caller = createCaller(getOrdinaryUser());
			await expect(caller.createOrganization(createOrganizationDTO)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.createOrganization).not.toHaveBeenCalledWith(createOrganizationDTO);
		});

		it('should not create an organization without a user in session', async () => {
			const mockController = { createOrganization: vi.fn() };
			rebindMock(container, OrganizationControllerImpl, mockController);
			const createCaller = appCreateCallerFactory(organizationRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.createOrganization(createOrganizationDTO)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.createOrganization).not.toHaveBeenCalledWith(createOrganizationDTO);
		});
	});
});
