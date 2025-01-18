import { ScoreboardHistory } from '../models/ScoreboardHistory';
import { ScoreboardHistoryRepository } from '../repositories/ScoreboardHistoryRepository';
import { CreateScoreboardHistory } from '../types/CreateScoreboardHistory';

import { inject, injectable } from 'inversify';
import { v4 as uuid } from 'uuid';

@injectable()
export class ScoreboardHistoryInteractor {
	constructor(
		@inject(Symbol.for('ScoreboardHistoryRepository'))
		private scoreboardHistoryRepository: ScoreboardHistoryRepository,
	) {}

	public async addScoreboardEntry(organizationId: string, createScoreboardEntry: CreateScoreboardHistory) {
		const scoreboardEntry: ScoreboardHistory = {
			id: uuid(),
			organizationId,
			...createScoreboardEntry,
		};
		return this.scoreboardHistoryRepository.addScoreboardHistory(scoreboardEntry);
	}
}
