import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { LeadMeasurement } from '../../types/LeadMeasurement';
import { UpdateLeadUseCase } from '../UpdateLeadUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('UpdateLeadUseCase', () => {
	let useCase: UpdateLeadUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		updateLead: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;
	let updateLead: LeadMeasurement;

	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
		updateLead = { id: 'dummy', name: 'dummy' };
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			updateLead: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(UpdateLeadUseCase);
	});

	it('successfully updates a lead', async () => {
		const result = await useCase.execute(organizationId, wigId, updateLead);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.updateLead).toHaveBeenCalled();
	});

	it('should not update the lead if the wig not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, wigId, updateLead);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.updateLead).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should not update the lead if the lead not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'updateLead').mockResolvedValue(Left(new EntityNotExistsError()));

		const result = await useCase.execute(organizationId, wigId, updateLead);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.updateLead).toHaveBeenCalled();
	});

	it('should return an error when failing to update the lead', async () => {
		vi.spyOn(mockWIGInteractor, 'updateLead').mockRejectedValue(new Error());

		const result = await useCase.execute(organizationId, wigId, updateLead);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
	});
});
