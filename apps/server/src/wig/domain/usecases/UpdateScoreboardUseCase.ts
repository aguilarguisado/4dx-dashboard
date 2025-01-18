import { IllegalStateError } from '../../../common/domain/exceptions/IllegalStateError';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { WIG } from '../models/WIG';
import { Scoreboard } from '../types/Scoreboard';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class UpdateScoreboardUseCase implements UseCase<WIG> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		wigId: string,
		scoreboard: Scoreboard,
	): Promise<Either<GetWIGError | IllegalStateError, WIG>> {
		return EitherAsync<GetWIGError | IllegalStateError, WIG>(async ({ fromPromise, throwE }) => {
			const wig = await fromPromise(this.wigInteractor.getWIGFromOrganization(organizationId, wigId));
			if (!wig.scoreboard) {
				return throwE(new IllegalStateError('Scoreboard does not exist'));
			}
			const resetWigData = wig.scoreboard?.visualizationType !== scoreboard.visualizationType;
			const updatedWIG = await fromPromise(
				this.wigInteractor.setScoreboard(wigId, { ...wig.scoreboard, ...scoreboard }),
			);
			if (resetWigData) {
				// TODO: remove other registries. Now it only removes the scoreboard data
				await this.wigInteractor.clearScoreboardData(wigId);
				// To avoid asking again to the DB
				if (updatedWIG.scoreboard) {
					updatedWIG.scoreboard.data = undefined;
				}
			}
			return updatedWIG;
		});
	}
}
