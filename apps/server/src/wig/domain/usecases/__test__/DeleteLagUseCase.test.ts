import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { DeleteLagUseCase } from '../DeleteLagUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('DeleteLagUseCase', () => {
	let useCase: DeleteLagUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		deleteLag: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;
	let lagId: string;

	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
		lagId = 'lag123';
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			deleteLag: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(DeleteLagUseCase);
	});

	it('successfully deletes a lag', async () => {
		const result = await useCase.execute(organizationId, wigId, lagId);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteLag).toHaveBeenCalled();
	});

	it('should not delete the lag if the wig not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, wigId, lagId);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteLag).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should not delete the lag if the lag not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'deleteLag').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, wigId, lagId);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteLag).toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should return an error when failing to deleting the lag', async () => {
		vi.spyOn(mockWIGInteractor, 'deleteLag').mockRejectedValue(new Error());
		const result = await useCase.execute(organizationId, wigId, lagId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
	});
});
