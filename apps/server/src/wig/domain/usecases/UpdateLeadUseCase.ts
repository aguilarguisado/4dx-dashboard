import { IllegalStateError } from '../../../common/domain/exceptions/IllegalStateError';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { LeadMeasurement } from '../types/LeadMeasurement';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class UpdateLeadUseCase implements UseCase<LeadMeasurement> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		wigId: string,
		lead: LeadMeasurement,
	): Promise<Either<GetWIGError | IllegalStateError, LeadMeasurement>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGFromOrganization(organizationId, wigId)).chain(
			(wig) => this.wigInteractor.updateLead(wig, lead),
		);
	}
}
