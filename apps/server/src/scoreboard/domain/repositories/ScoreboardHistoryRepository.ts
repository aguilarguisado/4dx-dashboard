import { BaseRepository } from '../../../common/domain/BaseRepository';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { ScoreboardHistory } from '../models/ScoreboardHistory';

import { Either } from 'purify-ts';

export type ScoreboardHistoryRepository = BaseRepository<ScoreboardHistory> & {
	addScoreboardHistory(scoreboardHistory: ScoreboardHistory): Promise<Either<UnknownError, ScoreboardHistory>>;
	getLatestScoreboardEntries: (scoreboardId: string) => Promise<Either<UnknownError, ScoreboardHistory[]>>;
};
