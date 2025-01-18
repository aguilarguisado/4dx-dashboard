import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { DeleteScoreboardUseCase } from '../DeleteScoreboardUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('DeleteScoreboardUseCase', () => {
	let useCase: DeleteScoreboardUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		deleteScoreboard: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;

	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			deleteScoreboard: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(DeleteScoreboardUseCase);
	});

	it('successfully deletes the scoreboard', async () => {
		const result = await useCase.execute(organizationId, wigId);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteScoreboard).toHaveBeenCalled();
	});

	it('should not delete the scoreboard if the wig not exists', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await useCase.execute(organizationId, wigId);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.deleteScoreboard).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
	});

	it('should return an error when failing to deleting the scoreboard', async () => {
		vi.spyOn(mockWIGInteractor, 'deleteScoreboard').mockRejectedValue(new Error());
		const result = await useCase.execute(organizationId, wigId);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
	});
});
