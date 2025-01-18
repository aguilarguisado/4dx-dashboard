import { rebindMock, resetTestAppContainer } from '../../../__tests__/TestUtils';
import { UnauthorizedApiError } from '../../../common/data/exceptions/UnauthorizedApiError';
import { getNotLoggedUser, getOrdinaryUser, getSuperAdminUser } from '../../../lib/trpc/TestUtils';
import { appCreateCallerFactory } from '../../../lib/trpc/trpc';
import { Scoreboard } from '../../../wig/domain/types/Scoreboard';
import { ScoreboardHistoryControllerImpl } from '../controllers/ScoreboardHistoryControllerImpl';
import { CreateScoreboardHistoryDTO } from '../dtos/CreateScoreboardHistoryDTO';
import { scoreboardRouter } from '../router';

import { Container } from 'inversify';

describe('scoreboardRouter', () => {
	let container: Container;
	let mockScoreboard: Scoreboard;

	beforeEach(() => {
		container = resetTestAppContainer();
		mockScoreboard = {
			id: 'scoreboard123',
			visualizationType: 'progress',
			config: { current: 0, init: 0, target: 20 },
		};
	});

	describe('addScoreboardEntry route', () => {
		let mockController: Partial<ScoreboardHistoryControllerImpl>;
		let createScoreboardHistoryInput: CreateScoreboardHistoryDTO;

		beforeEach(() => {
			createScoreboardHistoryInput = {
				wigId: '1',
				containerId: '1',
				scoreboardId: '1',
				containerType: 'wig',
				date: new Date(),
				value: 50,
			};
			mockController = { createScoreboardHistory: vi.fn().mockResolvedValue(mockScoreboard) };
			rebindMock(container, ScoreboardHistoryControllerImpl, mockController);
		});

		it('should successfully add a scoreboard entry for a superadmin user', async () => {
			const createCaller = appCreateCallerFactory(scoreboardRouter);
			const caller = createCaller(getSuperAdminUser());
			const result = await caller.addScoreboardEntry(createScoreboardHistoryInput);
			expect(result).toEqual(mockScoreboard);
			expect(mockController.createScoreboardHistory).toHaveBeenCalledWith(
				expect.anything(),
				createScoreboardHistoryInput,
			);
		});

		it('should allow an ordinary user to add a scoreboard entry', async () => {
			const createCaller = appCreateCallerFactory(scoreboardRouter);
			const caller = createCaller(getOrdinaryUser());
			const result = await caller.addScoreboardEntry(createScoreboardHistoryInput);
			expect(result).toEqual(mockScoreboard);
			expect(mockController.createScoreboardHistory).toHaveBeenCalledWith(
				expect.anything(),
				createScoreboardHistoryInput,
			);
		});

		it('should not allow scoreboard entry addition without a user in session', async () => {
			const createCaller = appCreateCallerFactory(scoreboardRouter);
			const caller = createCaller(getNotLoggedUser());
			await expect(caller.addScoreboardEntry(createScoreboardHistoryInput)).rejects.toThrow(UnauthorizedApiError);
			expect(mockController.createScoreboardHistory).not.toHaveBeenCalled();
		});

		describe('input validation', () => {
			it('should reject when wigId is missing', async () => {
				const input = { ...createScoreboardHistoryInput, wigId: undefined };
				const createCaller = appCreateCallerFactory(scoreboardRouter);
				const caller = createCaller(getSuperAdminUser());

				await expect(
					caller.addScoreboardEntry(input as unknown as CreateScoreboardHistoryDTO),
				).rejects.toThrow();
				expect(mockController.createScoreboardHistory).not.toHaveBeenCalled();
			});
		});
	});
});
