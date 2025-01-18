import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { UpdateGeneralSection } from '../../types/UpdateGeneralSection';
import { UpdateWIGUseCase } from '../UpdateWIGUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('UpdateWIGUseCase', () => {
	let useCase: UpdateWIGUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		update: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let updateWIG: UpdateGeneralSection;

	beforeAll(() => {
		organizationId = 'org123';
		updateWIG = { id: 'dummy', name: 'dummy', isOrganizational: false };
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			update: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(UpdateWIGUseCase);
	});

	it('successfully updates a WIG', async () => {
		const result = await useCase.execute(organizationId, updateWIG);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, updateWIG.id);
		expect(mockWIGInteractor.update).toHaveBeenCalled();
	});

	it('should not update the wig if the wig not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, updateWIG);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, updateWIG.id);
		expect(mockWIGInteractor.update).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should return an error when failing to update the wig', async () => {
		vi.spyOn(mockWIGInteractor, 'update').mockRejectedValue(new Error());

		const result = await useCase.execute(organizationId, updateWIG);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
	});
});
