import { IllegalStateError } from '../../../common/domain/exceptions/IllegalStateError';
import { SLAError } from '../../../common/domain/exceptions/SLAError';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { CreateLag } from '../types/CreateLag';
import { LagMeasurement } from '../types/LagMeasurement';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class CreateLagUseCase implements UseCase<LagMeasurement> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		wigId: string,
		createLag: CreateLag,
	): Promise<Either<GetWIGError | SLAError | IllegalStateError, LagMeasurement>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGFromOrganization(organizationId, wigId)).chain(
			(wig) => this.wigInteractor.addLag(wig, createLag),
		);
	}
}
