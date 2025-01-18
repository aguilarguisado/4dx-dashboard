import { IllegalStateError } from '../../../common/domain/exceptions/IllegalStateError';
import { SLAError } from '../../../common/domain/exceptions/SLAError';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { CreateLead } from '../types/CreateLead';
import { LeadMeasurement } from '../types/LeadMeasurement';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class CreateLeadUseCase implements UseCase<LeadMeasurement> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		wigId: string,
		createLead: CreateLead,
	): Promise<Either<GetWIGError | SLAError | IllegalStateError, LeadMeasurement>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGFromOrganization(organizationId, wigId)).chain(
			(wig) => this.wigInteractor.addLead(wig, createLead),
		);
	}
}
