import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { resetAppContainer } from '../../../../lib/inversify/container';
import { mockScoreboardHistory } from '../../../domain/models/__mocks__/ScoreboardHistoryMocks';
import { ScoreboardHistory } from '../../../domain/models/ScoreboardHistory';
import { ScoreboardHistoryRepositoryImpl } from '../ScoreboardHistoryRepositoryImpl';

import { Container } from 'inversify';

describe('ScoreboardHistoryRepositoryImpl', () => {
	let container: Container;
	let repository: ScoreboardHistoryRepositoryImpl;

	beforeEach(() => {
		container = resetAppContainer();
		repository = container.get(Symbol.for('ScoreboardHistoryRepository'));
		vi.spyOn(repository, 'getCollectionPath').mockReturnValue('test_' + repository.getCollectionPath());
	});

	describe('create', () => {
		it('should return an error as method is not allowed', async () => {
			const data: ScoreboardHistory = mockScoreboardHistory;

			const result = await repository.create(data);

			expect(result.isLeft()).toBe(true);
			const error = result.extract();
			expect(error).toBeInstanceOf(UnknownError);
			expect((error as UnknownError).message).toBe('Method not allowed');
		});
	});

	describe('addScoreboardHistory', () => {
		it('should successfully add a scoreboard history entry', async () => {
			const scoreboardHistory: ScoreboardHistory = mockScoreboardHistory;
			const result = await repository.addScoreboardHistory(scoreboardHistory);
			expect(result.isRight()).toBe(true);
			const entries = await repository.getLatestScoreboardEntries(scoreboardHistory.scoreboardId);
			expect(entries.isRight()).toBe(true);
			expect(entries.extract()).toHaveLength(1);
		});
		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const scoreboardHistory: ScoreboardHistory = mockScoreboardHistory;
			const result = await repository.addScoreboardHistory(scoreboardHistory);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('getLatestScoreboardEntries', () => {
		it('should return the latest scoreboard entries', async () => {
			const scoreboardHistory: ScoreboardHistory = mockScoreboardHistory;
			await repository.addScoreboardHistory(scoreboardHistory);
			const entries = await repository.getLatestScoreboardEntries(scoreboardHistory.scoreboardId);
			expect(entries.isRight()).toBe(true);
			expect(entries.extract()).toHaveLength(1);
		});
		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const entries = await repository.getLatestScoreboardEntries('test');
			expect(entries.isLeft()).toBe(true);
			expect(entries.extract()).toBeInstanceOf(UnknownError);
		});
	});
});
