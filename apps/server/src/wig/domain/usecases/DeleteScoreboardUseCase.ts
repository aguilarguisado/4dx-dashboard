import { Void } from '../../../common/domain/models/Void';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class DeleteScoreboardUseCase implements UseCase<Void> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(organizationId: string, wigId: string): Promise<Either<GetWIGError, Void>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGFromOrganization(organizationId, wigId)).chain(
			() => this.wigInteractor.deleteScoreboard(wigId),
		);
		// TODO: remove other registries
	}
}
