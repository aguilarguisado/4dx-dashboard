import { buildUnknownError } from '../../../common/data/exceptions/utils';
import { FirestoreRepositoryImpl } from '../../../common/data/FirestoreRepositoryImpl';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { ScoreboardHistory } from '../../domain/models/ScoreboardHistory';
import { ScoreboardHistoryRepository } from '../../domain/repositories/ScoreboardHistoryRepository';
import { CreateScoreboardHistory } from '../../domain/types/CreateScoreboardHistory';

import { injectable } from 'inversify';
import { Either, Left, Right } from 'purify-ts';

const SCOREBOARD_HISTORY_COLLECTION_PATH = 'scoreboard_history';
const SCOREBOARD_DATA_LENGHT = 3;

@injectable()
export class ScoreboardHistoryRepositoryImpl
	extends FirestoreRepositoryImpl<ScoreboardHistory>
	implements ScoreboardHistoryRepository
{
	getCollectionPath(): string {
		return SCOREBOARD_HISTORY_COLLECTION_PATH;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async create(data: CreateScoreboardHistory): Promise<Either<UnknownError, ScoreboardHistory>> {
		// This method is not allowed to be called in this repository. Use addScoreboardHistory instead
		return Left(new UnknownError('Method not allowed'));
	}

	public async addScoreboardHistory(
		scoreboardHistory: ScoreboardHistory,
	): Promise<Either<UnknownError, ScoreboardHistory>> {
		try {
			const scoreboardId = scoreboardHistory.scoreboardId;
			// TODO: now date selection depends on the timezone of the client
			const id = scoreboardHistory.date.toISOString().split('T')[0];
			await this.getCollection()
				.doc(scoreboardId)
				.collection('elements')
				.doc(id)
				.set(scoreboardHistory, { merge: true });
			return Right(scoreboardHistory);
		} catch (error) {
			return buildUnknownError(error);
		}
	}

	public async getLatestScoreboardEntries(scoreboardId: string): Promise<Either<UnknownError, ScoreboardHistory[]>> {
		try {
			const querySnapshot = await this.getCollection()
				.doc(scoreboardId)
				.collection('elements')
				.orderBy('date', 'desc')
				.limit(SCOREBOARD_DATA_LENGHT)
				.get();
			const entryList = this.mapQuerySnapshotToEntities(querySnapshot);
			return Right(entryList.reverse());
		} catch (error) {
			return buildUnknownError(error);
		}
	}
}
