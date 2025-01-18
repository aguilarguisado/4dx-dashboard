import { ScoreboardHistoryControllerImpl } from '../data/controllers/ScoreboardHistoryControllerImpl';
import { ScoreboardHistoryRepositoryImpl } from '../data/repositories/ScoreboardHistoryRepositoryImpl';
import { ScoreboardHistoryInteractor } from '../domain/interactors/ScoreboardHistoryInteractor';
import { ScoreboardHistoryRepository } from '../domain/repositories/ScoreboardHistoryRepository';
import { CreateScoreboardEntryUseCase } from '../domain/usecases/CreateScoreboardEntryUseCase';

import { ContainerModule } from 'inversify';

export const scoreboardHistoryModule = new ContainerModule((bind) => {
	bind<ScoreboardHistoryRepository>(Symbol.for('ScoreboardHistoryRepository'))
		.to(ScoreboardHistoryRepositoryImpl)
		.inSingletonScope();
	bind<CreateScoreboardEntryUseCase>(CreateScoreboardEntryUseCase).toSelf().inSingletonScope();
	bind<ScoreboardHistoryInteractor>(ScoreboardHistoryInteractor).toSelf().inSingletonScope();
	bind<ScoreboardHistoryControllerImpl>(ScoreboardHistoryControllerImpl).toSelf().inSingletonScope();
});
