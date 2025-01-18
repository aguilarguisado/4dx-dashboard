import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { LagMeasurement } from '../../types/LagMeasurement';
import { UpdateLagUseCase } from '../UpdateLagUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('UpdateLagUseCase', () => {
	let useCase: UpdateLagUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		updateLag: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;
	let updateLag: LagMeasurement;

	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
		updateLag = { id: 'dummy', title: 'dummy' };
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			updateLag: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(UpdateLagUseCase);
	});

	it('successfully updates a lag', async () => {
		const result = await useCase.execute(organizationId, wigId, updateLag);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.updateLag).toHaveBeenCalled();
	});

	it('should not update the lag if the wig not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, wigId, updateLag);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.updateLag).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should not update the lag if the lag not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'updateLag').mockResolvedValue(Left(new EntityNotExistsError()));

		const result = await useCase.execute(organizationId, wigId, updateLag);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.updateLag).toHaveBeenCalled();
	});

	it('should return an error when failing to update the lag', async () => {
		vi.spyOn(mockWIGInteractor, 'updateLag').mockRejectedValue(new Error());

		const result = await useCase.execute(organizationId, wigId, updateLag);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
	});
});
