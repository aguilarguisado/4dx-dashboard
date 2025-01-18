import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { ScoreboardHistoryRepository } from '../../repositories/ScoreboardHistoryRepository';
import { mockCreateScoreboardHistoryWIG } from '../../types/__mocks__/CreateScoreboardHistoryMocks';
import { ScoreboardHistoryInteractor } from '../ScoreboardHistoryInteractor';

import { Container } from 'inversify';
import { Right } from 'purify-ts';

describe('ScoreboardHistoryInteractor', () => {
	let interactor: ScoreboardHistoryInteractor;
	let container: Container;
	let mockScoreboardHistoryRepository: Partial<ScoreboardHistoryRepository>;

	beforeEach(() => {
		container = resetTestAppContainer();
		mockScoreboardHistoryRepository = {
			addScoreboardHistory: vi.fn().mockResolvedValue(Right(mockCreateScoreboardHistoryWIG)),
		};
		rebindMock(container, Symbol.for('ScoreboardHistoryRepository'), mockScoreboardHistoryRepository);
		interactor = container.get(ScoreboardHistoryInteractor);
	});
	describe('addScoreboardEntry', () => {
		it('should create a scoreboard entry', async () => {
			const result = await interactor.addScoreboardEntry(mockOrganization.id, mockCreateScoreboardHistoryWIG);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toEqual(mockCreateScoreboardHistoryWIG);
		});
	});
});
