import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { IllegalStateError } from '../../../../common/domain/exceptions/IllegalStateError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { WIG } from '../../models/WIG';
import { Scoreboard } from '../../types/Scoreboard';
import { UpdateScoreboardUseCase } from '../UpdateScoreboardUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('UpdateScoreboardUseCase', () => {
	let useCase: UpdateScoreboardUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		setScoreboard: ReturnType<typeof vi.fn>;
		clearScoreboardData: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;
	let updateScoreboard: Scoreboard;
	let wig: WIG;

	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
		updateScoreboard = {
			id: 'scoreboard123',
			visualizationType: 'progress',
			config: { current: 0, init: 0, target: 0 },
		};
		wig = {
			id: 'dummy',
			name: 'dummy',
			organizationId: 'dummy',
			isOrganizational: false,
			scoreboard: updateScoreboard,
		};
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right(wig)),
			setScoreboard: vi.fn().mockResolvedValue(Right(wig)),
			clearScoreboardData: vi.fn().mockResolvedValue(Right(undefined)),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(UpdateScoreboardUseCase);
	});

	it('successfully updates a scoreboard', async () => {
		const result = await useCase.execute(organizationId, wigId, updateScoreboard);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.setScoreboard).toHaveBeenCalled();
	});

	it('successfully updates a scoreboard and clears the data if the new visualization type is different than the original', async () => {
		const newScoreboard = { ...updateScoreboard, visualizationType: 'series' as const };
		const result = await useCase.execute(organizationId, wigId, newScoreboard);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.setScoreboard).toHaveBeenCalled();
	});

	it('should not update the scoreboard in the WIG it has not a previous scoreboard', async () => {
		const wig: WIG = {
			id: 'dummy',
			name: 'dummy',
			organizationId: 'dummy',
			isOrganizational: false,
		};
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Right(wig));
		const result = await useCase.execute(organizationId, wigId, updateScoreboard);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.setScoreboard).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(IllegalStateError);
	});

	it('should return an error when failing to fetch WIG', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));

		const result = await useCase.execute(organizationId, wigId, updateScoreboard);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.setScoreboard).not.toHaveBeenCalled();
	});

	it('should return an error when failing to set scoreboard', async () => {
		vi.spyOn(mockWIGInteractor, 'setScoreboard').mockRejectedValue(new Error());

		const result = await useCase.execute(organizationId, wigId, updateScoreboard);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
	});
});
