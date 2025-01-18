import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { DeleteLeadUseCase } from '../DeleteLeadUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('DeleteLeadUseCase', () => {
	let useCase: DeleteLeadUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		deleteLead: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;
	let leadId: string;

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			deleteLead: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(DeleteLeadUseCase);
		organizationId = 'org123';
		wigId = 'wig123';
		leadId = 'lead123';
	});

	it('successfully deletes a lead', async () => {
		const result = await useCase.execute(organizationId, wigId, leadId);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteLead).toHaveBeenCalled();
	});

	it('should not delete the lead if the wig not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, wigId, leadId);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteLead).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should not delete the lead if the lead not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'deleteLead').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, wigId, leadId);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteLead).toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should return an error when failing to deleting the lead', async () => {
		vi.spyOn(mockWIGInteractor, 'deleteLead').mockRejectedValue(new Error());
		const result = await useCase.execute(organizationId, wigId, leadId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
	});
});
