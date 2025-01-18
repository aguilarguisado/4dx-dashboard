import { IllegalStateError } from '../../../common/domain/exceptions/IllegalStateError';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../../../wig/domain/exceptions/GetWIGError';
import { WIGInteractor } from '../../../wig/domain/interactors/WIGInteractor';
import { Scoreboard } from '../../../wig/domain/types/Scoreboard';
import { ScoreboardHistoryInteractor } from '../interactors/ScoreboardHistoryInteractor';
import { CreateScoreboardHistory } from '../types/CreateScoreboardHistory';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class CreateScoreboardEntryUseCase implements UseCase<Scoreboard> {
	constructor(
		@inject(ScoreboardHistoryInteractor) private scoreboardHistoryInteractor: ScoreboardHistoryInteractor,
		@inject(WIGInteractor) private wigInteractor: WIGInteractor,
	) {}

	public async execute(
		organizationId: string,
		wigId: string,
		createScoreboardEntry: CreateScoreboardHistory,
	): Promise<Either<GetWIGError | IllegalStateError, Scoreboard>> {
		return EitherAsync<GetWIGError | IllegalStateError, Scoreboard>(async ({ fromPromise, throwE }) => {
			const wig = await fromPromise(this.wigInteractor.getWIGFromOrganization(organizationId, wigId));
			const { containerType, containerId } = createScoreboardEntry;
			let scoreboard;
			switch (containerType) {
				case 'wig':
					scoreboard = wig.scoreboard;
					break;
				case 'lag':
					scoreboard = wig.lags?.find((lag) => lag.id === containerId)?.scoreboard;
					break;
				case 'lead':
					scoreboard = wig.leads?.find((lead) => lead.id === containerId)?.scoreboard;
					break;
			}

			if (!scoreboard) {
				return throwE(new IllegalStateError('Scoreboard not found'));
			}

			if (scoreboard?.visualizationType !== 'series') {
				return throwE(new IllegalStateError('Scoreboard visualization type is not series'));
			}

			await fromPromise(
				this.scoreboardHistoryInteractor.addScoreboardEntry(organizationId, createScoreboardEntry),
			);
			return fromPromise(
				this.wigInteractor.refreshScoreboard(
					wig,
					createScoreboardEntry.scoreboardId,
					createScoreboardEntry.containerType,
				),
			);
		});
	}
}
