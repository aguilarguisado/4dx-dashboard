import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { InternalServerApiError } from '../../../../common/data/exceptions/InternalServerApiError';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { CreateOrganizationUseCase } from '../../../domain/usecases/CreateOrganizationUseCase';
import { CreateOrganizationDTO } from '../../dtos/CreateOrganizationDTO';
import { OrganizationControllerImpl } from '../OrganizationControllerImpl';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('OrganizationControllerImpl', () => {
	let container: Container;
	beforeEach(() => {
		container = resetTestAppContainer();
	});
	describe('createOrganization', () => {
		let createOrganizationDTO: CreateOrganizationDTO;
		beforeEach(() => {
			createOrganizationDTO = { name: 'testOrganization' };
		});

		it('should successfully create an organization', async () => {
			const createOrganizationUseCase = { execute: vi.fn().mockResolvedValue(Right(undefined)) };
			rebindMock(container, CreateOrganizationUseCase, createOrganizationUseCase);
			const controller: OrganizationControllerImpl = container.get(OrganizationControllerImpl);

			const result = await controller.createOrganization(createOrganizationDTO);
			expect(result).toEqual(undefined);
			expect(createOrganizationUseCase.execute).toHaveBeenCalled();
		});

		// Test case for handling errors with genericApiErrorConverter
		it('should throw an error when createOrganizationUseCase fails', async () => {
			const createOrganizationUseCase = {
				execute: vi.fn().mockResolvedValue(Left(new UnknownError())),
			};
			rebindMock(container, CreateOrganizationUseCase, createOrganizationUseCase);
			const controller: OrganizationControllerImpl = container.get(OrganizationControllerImpl);

			await expect(controller.createOrganization(createOrganizationDTO)).rejects.toThrow(InternalServerApiError);
			expect(createOrganizationUseCase.execute).toHaveBeenCalled();
		});
	});
});
