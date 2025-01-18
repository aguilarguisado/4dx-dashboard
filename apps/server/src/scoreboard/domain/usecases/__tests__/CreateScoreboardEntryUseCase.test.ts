import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { IllegalStateError } from '../../../../common/domain/exceptions/IllegalStateError';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { WIGInteractor } from '../../../../wig/domain/interactors/WIGInteractor';
import { mockWIG, mockWIGWithSeriesScoreboard } from '../../../../wig/domain/models/__mocks__/WIGMocks';
import { WIG } from '../../../../wig/domain/models/WIG';
import { mockLagWithSeriesScoreboard } from '../../../../wig/domain/types/__mocks__/LagMeasurementMocks';
import { mockLeadWithSeriesScoreboard } from '../../../../wig/domain/types/__mocks__/LeadMeasurementMocks';
import { mockProgressScoreboard } from '../../../../wig/domain/types/__mocks__/ScoreboardMocks';
import { ScoreboardHistoryInteractor } from '../../interactors/ScoreboardHistoryInteractor';
import {
	mockCreateScoreboardHistoryLag,
	mockCreateScoreboardHistoryLead,
	mockCreateScoreboardHistoryWIG,
} from '../../types/__mocks__/CreateScoreboardHistoryMocks';
import { CreateScoreboardEntryUseCase } from '../CreateScoreboardEntryUseCase';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

let createScoreboardEntryUseCase: CreateScoreboardEntryUseCase;
let container: Container;
let mockWIGInteractor: Partial<{
	getWIGFromOrganization: ReturnType<typeof vi.fn>;
	refreshScoreboard: ReturnType<typeof vi.fn>;
}>;
let mockScoreboardHistoryInteractor: {
	addScoreboardEntry: ReturnType<typeof vi.fn>;
};
let organizationId: string;
let wig: WIG;

describe('CreateScoreboardEntryUseCase', () => {
	beforeAll(() => {
		organizationId = mockOrganization.id;
	});

	beforeEach(() => {
		container = resetTestAppContainer();

		wig = mockWIGWithSeriesScoreboard;
		wig.lags = [mockLagWithSeriesScoreboard];
		wig.leads = [mockLeadWithSeriesScoreboard];

		mockWIGInteractor = {
			getWIGFromOrganization: vi.fn().mockResolvedValue(Right(wig)),
			refreshScoreboard: vi.fn().mockResolvedValue(Right({})),
		};
		mockScoreboardHistoryInteractor = {
			addScoreboardEntry: vi.fn().mockResolvedValue(Right({})),
		};
		rebindMock(container, WIGInteractor, mockWIGInteractor);
		rebindMock(container, ScoreboardHistoryInteractor, mockScoreboardHistoryInteractor);
		createScoreboardEntryUseCase = container.get(CreateScoreboardEntryUseCase);
	});

	it('should successfully create a scoreboard entry and refresh the scoreboard', async () => {
		const result = await createScoreboardEntryUseCase.execute(
			organizationId,
			wig.id,
			mockCreateScoreboardHistoryWIG,
		);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).toHaveBeenCalledWith(
			organizationId,
			mockCreateScoreboardHistoryWIG,
		);
		expect(mockWIGInteractor.refreshScoreboard).toHaveBeenCalledWith(
			expect.anything(),
			mockCreateScoreboardHistoryWIG.scoreboardId,
			mockCreateScoreboardHistoryWIG.containerType,
		);
	});

	it('should successfully create a scoreboard entry (lag) and refresh the scoreboard', async () => {
		const createScoreboardEntryLag = mockCreateScoreboardHistoryLag;
		const result = await createScoreboardEntryUseCase.execute(organizationId, wig.id, createScoreboardEntryLag);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).toHaveBeenCalledWith(
			organizationId,
			createScoreboardEntryLag,
		);
		expect(mockWIGInteractor.refreshScoreboard).toHaveBeenCalledWith(
			expect.anything(),
			wig.lags?.[0].scoreboard?.id,
			createScoreboardEntryLag.containerType,
		);
	});

	it('should successfully create a scoreboard entry (lead) and refresh the scoreboard', async () => {
		const createScoreboardEntryLead = mockCreateScoreboardHistoryLead;
		const result = await createScoreboardEntryUseCase.execute(organizationId, wig.id, createScoreboardEntryLead);
		expect(result.isRight()).toBe(true);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).toHaveBeenCalledWith(
			organizationId,
			createScoreboardEntryLead,
		);
		expect(mockWIGInteractor.refreshScoreboard).toHaveBeenCalledWith(
			expect.anything(),
			wig.leads?.[0].scoreboard?.id,
			createScoreboardEntryLead.containerType,
		);
	});

	it('should return an error if the WIG cannot be found', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Left(new EntityNotExistsError()));
		const result = await createScoreboardEntryUseCase.execute(
			organizationId,
			wig.id,
			mockCreateScoreboardHistoryWIG,
		);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).not.toHaveBeenCalled();
	});

	it('should return an error if the scoreboard visualization type is not series', async () => {
		const progressWig = structuredClone(wig);
		progressWig.scoreboard = mockProgressScoreboard;
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Right(progressWig));
		const result = await createScoreboardEntryUseCase.execute(
			organizationId,
			progressWig.id,
			mockCreateScoreboardHistoryWIG,
		);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(IllegalStateError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, progressWig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).not.toHaveBeenCalled();
	});

	it('should return an error if the scoreboard is not found', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockResolvedValue(Right(mockWIG));
		const result = await createScoreboardEntryUseCase.execute(
			organizationId,
			wig.id,
			mockCreateScoreboardHistoryLag,
		);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(IllegalStateError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).not.toHaveBeenCalled();
	});

	it('should return an error if adding the scoreboard entry fails', async () => {
		vi.spyOn(mockScoreboardHistoryInteractor, 'addScoreboardEntry').mockResolvedValue(Left(new UnknownError()));
		const result = await createScoreboardEntryUseCase.execute(
			organizationId,
			wig.id,
			mockCreateScoreboardHistoryWIG,
		);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(UnknownError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).toHaveBeenCalled();
		expect(mockWIGInteractor.refreshScoreboard).not.toHaveBeenCalled();
	});

	it('should return an error if refreshing the scoreboard fails', async () => {
		vi.spyOn(mockWIGInteractor, 'refreshScoreboard').mockResolvedValue(Left(new IllegalStateError()));
		const result = await createScoreboardEntryUseCase.execute(
			organizationId,
			wig.id,
			mockCreateScoreboardHistoryWIG,
		);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(IllegalStateError);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).toHaveBeenCalled();
		expect(mockWIGInteractor.refreshScoreboard).toHaveBeenCalled();
	});

	it('should return an error if an exception is thrown', async () => {
		vi.spyOn(mockWIGInteractor, 'getWIGFromOrganization').mockRejectedValue(new Error());
		const result = await createScoreboardEntryUseCase.execute(
			organizationId,
			wig.id,
			mockCreateScoreboardHistoryWIG,
		);
		expect(result.isLeft()).toBe(true);
		expect(result.extract()).toBeInstanceOf(Error);
		expect(mockWIGInteractor.getWIGFromOrganization).toHaveBeenCalledWith(organizationId, wig.id);
		expect(mockScoreboardHistoryInteractor.addScoreboardEntry).not.toHaveBeenCalled();
	});
});
