import { IllegalStateError } from '../../../common/domain/exceptions/IllegalStateError';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { LagMeasurement } from '../types/LagMeasurement';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class UpdateLagUseCase implements UseCase<LagMeasurement> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		wigId: string,
		lag: LagMeasurement,
	): Promise<Either<GetWIGError | IllegalStateError, LagMeasurement>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGFromOrganization(organizationId, wigId)).chain(
			(wig) => this.wigInteractor.updateLag(wig, lag),
		);
	}
}
