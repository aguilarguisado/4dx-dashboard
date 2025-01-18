import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { IllegalStateError } from '../../../../common/domain/exceptions/IllegalStateError';
import { WIGInteractor } from '../../interactors/WIGInteractor';
import { WIG } from '../../models/WIG';
import { Scoreboard } from '../../types/Scoreboard';
import { CreateScoreboardUseCase } from '../CreateScoreboardUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('CreateScoreboardUseCase', () => {
	let useCase: CreateScoreboardUseCase;
	let container: Container;
	let mockWIGInteractor: {
		getWIGFromOrganization: ReturnType<typeof vi.fn>;
		setScoreboard: ReturnType<typeof vi.fn>;
	};
	let organizationId: string;
	let wigId: string;
	let createScoreboard: Scoreboard;

	beforeAll(() => {
		organizationId = 'org123';
		wigId = 'wig123';
		createScoreboard = {
			id: 'scoreboard123',
			visualizationType: 'progress',
			config: { current: 0, init: 0, target: 0 },
		};
	});

	beforeEach(() => {
		container = resetTestAppContainer();
		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right({})),
			setScoreboard: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		useCase = container.get(CreateScoreboardUseCase);
	});

	it('successfully creates a scoreboard', async () => {
		const result = await useCase.execute(organizationId, wigId, createScoreboard);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.setScoreboard).toHaveBeenCalled();
	});

	it('should not create the scoreboard in the WIG if already exists', async () => {
		const wig: WIG = {
			id: 'dummy',
			name: 'dummy',
			organizationId: 'dummy',
			isOrganizational: false,
			scoreboard: createScoreboard,
		};
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Right(wig));
		const result = await useCase.execute(organizationId, wigId, createScoreboard);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.setScoreboard).not.toHaveBeenCalled();
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(IllegalStateError);
	});

	it('should return an error when failing to fetch WIG', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));

		const result = await useCase.execute(organizationId, wigId, createScoreboard);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wigId);
		expect(mockWIGInteractor.setScoreboard).not.toHaveBeenCalled();
	});

	it('should return an error when failing to set scoreboard', async () => {
		vi.spyOn(mockWIGInteractor, 'setScoreboard').mockRejectedValue(new Error());

		const result = await useCase.execute(organizationId, wigId, createScoreboard);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
	});
});
